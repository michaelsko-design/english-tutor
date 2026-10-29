/**
 * GET /api/tts?a=<version>&v=<female|male|he-female>&s=<normal|slow>&t=<text>: Azure Neural speech for text that has no
 * rendered clip (word lists, sticker names, dreams, the male voice, Hebrew with the learner's name). The CDN caches each answer by
 * URL for a year, so a phrase is synthesized once for everyone. The F0 key can't be billed: over
 * quota Azure answers 429 and the app uses the device voice.
 */
// Explicit .js extensions: the package is ESM ("type": "module"), so Node needs them at runtime.
import { AzureTtsError, readAzureConfig, synthesize } from './_lib/azureTts.js';
import { verifyAppCheckToken } from './_lib/appCheckToken.js';
import { readFirebaseClaims, verifyFirebaseIdToken } from './_lib/firebaseToken.js';
import { createRateLimiter } from './_lib/rateLimit.js';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER, buildLiveTtsQuery, isSpeakableBy, isTtsSpeed, isTtsVoice } from '../src/services/tts/ttsText.js';

const AZURE_TIMEOUT_MS = 8_000;
const DEFAULT_FIREBASE_PROJECT_ID = 'english-tutor-il-7';
/** App Check tokens name the project by number (the first part of the web appId) */
const DEFAULT_FIREBASE_PROJECT_NUMBER = '1003230297590';
// s-maxage lets the Vercel CDN share the answer; max-age lets the browser keep it.
const AUDIO_CACHE_CONTROL = 'public, max-age=31536000, s-maxage=31536000, immutable';
/**
 * Calls that reach Azure (CDN hits never get here). A learner meets a few dozen new phrases an
 * hour at most; a guest account is free to create, so the address is limited too, higher because
 * a classroom shares one.
 */
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_MISSES_PER_UID = 120;
const MAX_MISSES_PER_IP = 600;
const defaultUidLimiter = createRateLimiter({ limit: MAX_MISSES_PER_UID, windowMs: RATE_WINDOW_MS });
const defaultIpLimiter = createRateLimiter({ limit: MAX_MISSES_PER_IP, windowMs: RATE_WINDOW_MS });

export interface TtsRateLimiters {
  isUidWithinLimit: (uid: string) => boolean;
  isIpWithinLimit: (ip: string) => boolean;
}

const DEFAULT_RATE_LIMITERS: TtsRateLimiters = {
  isUidWithinLimit: defaultUidLimiter,
  isIpWithinLimit: defaultIpLimiter,
};

/** Vercel puts the client address first in x-forwarded-for */
function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/**
 * Only signed-in learners reach Azure: without that, anyone could use up the free quota for every
 * learner. A phrase already in the CDN cache is served without reaching this function at all.
 * `TTS_AUTH=off` turns the check off for the local dev server, whose emulator tokens aren't signed.
 */
export async function handleTtsRequest(
  request: Request,
  env: Record<string, string | undefined>,
  fetchImpl: typeof fetch = fetch,
  verifyToken: (token: string, projectId: string) => Promise<boolean> = verifyFirebaseIdToken,
  verifyAppCheck: (token: string, projectNumber: string) => Promise<boolean> = verifyAppCheckToken,
  rateLimiters: TtsRateLimiters = DEFAULT_RATE_LIMITERS,
): Promise<Response> {
  const url = new URL(request.url);
  const text = url.searchParams.get('t') ?? '';
  const voice = url.searchParams.get('v');
  const speed = url.searchParams.get('s');
  if (!isTtsVoice(voice) || !isSpeakableBy(voice, text) || !isTtsSpeed(speed)) {
    return errorResponse(400, 'Unsupported text, voice or speed');
  }
  // Only the canonical request is served (the parameters a, v, s, t in that order, the current
  // audio version, normalized text), so extra parameters or spacing can't create new cache entries
  // that each call Azure. The parsed values are compared, not the raw query: platforms rewrite
  // percent-encoding (Vercel turns %21 into !).
  const canonical = new URLSearchParams(buildLiveTtsQuery(text, voice, speed));
  if ([...url.searchParams].join('&') !== [...canonical].join('&')) {
    return errorResponse(400, 'Non-canonical request');
  }

  if (env.TTS_AUTH !== 'off') {
    const token = request.headers.get(TTS_TOKEN_HEADER) ?? '';
    const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
    if (!token || !(await verifyToken(token, projectId))) return errorResponse(401, 'Sign in to use the online voice');
  }

  // App Check proves the request came from the real app. Off until the console shows the web app
  // sending valid tokens (APPCHECK_ENFORCE=on), so a rollout can't lock out learners.
  if (env.APPCHECK_ENFORCE === 'on') {
    const appCheckToken = request.headers.get(APP_CHECK_HEADER) ?? '';
    const projectNumber = env.FIREBASE_PROJECT_NUMBER || DEFAULT_FIREBASE_PROJECT_NUMBER;
    if (!appCheckToken || !(await verifyAppCheck(appCheckToken, projectNumber))) {
      return errorResponse(401, 'App check failed');
    }
  }

  const config = readAzureConfig(env);
  if (!config) return errorResponse(503, 'Online voice is not configured');

  // Over the cap the app falls back to the device voice, as it does when Azure is over quota
  const uid = readFirebaseClaims(request.headers.get(TTS_TOKEN_HEADER) ?? '')?.uid;
  const ip = clientIp(request);
  const isOverUidLimit = uid !== undefined && !rateLimiters.isUidWithinLimit(uid);
  const isOverIpLimit = ip !== '' && !rateLimiters.isIpWithinLimit(ip);
  if (isOverUidLimit || isOverIpLimit) return errorResponse(429, 'Too many online voice requests');

  try {
    const audio = await synthesize(text, voice, speed, config, AZURE_TIMEOUT_MS, fetchImpl);
    return new Response(audio, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': AUDIO_CACHE_CONTROL },
    });
  } catch (error) {
    const status = error instanceof AzureTtsError ? error.status : 0;
    // Only the status and length are logged: the text may be something a learner typed.
    console.error(`tts: Azure failed (status ${status || 'network'}, ${text.length} chars)`);
    if (status === 429) return errorResponse(429, 'Online voice quota reached');
    return errorResponse(502, 'Online voice failed');
  }
}

export function GET(request: Request): Promise<Response> {
  return handleTtsRequest(request, process.env);
}
