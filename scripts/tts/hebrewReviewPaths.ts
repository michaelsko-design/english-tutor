import { join } from 'node:path';
import { HEBREW_VOICE } from '../../src/services/tts/ttsText';
import { getVoiceDir } from './clipManifest';
import type { ReviewDirs } from './hebrewReviewState';

/** New takes of reviewed clips wait here (gitignored, outside public/tts) until you pick one. */
export const CANDIDATE_DIR = join(process.cwd(), '.tts-candidates', HEBREW_VOICE);
export const REVIEW_STATE_PATH = join(process.cwd(), 'scripts', 'tts', 'hebrewReview.json');

export const getReviewDirs = (): ReviewDirs => ({
  clipDir: getVoiceDir(HEBREW_VOICE),
  candidateDir: CANDIDATE_DIR,
  undoDir: join(process.cwd(), '.tts-candidates', `undo-${HEBREW_VOICE}`),
  statePath: REVIEW_STATE_PATH,
});
