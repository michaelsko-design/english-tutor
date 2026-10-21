import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serves the /api/tts Vercel Function from the dev server, with AZURE_* from .env.local. Without
 * the VITE_ prefix those values never reach the client bundle.
 */
function ttsApiDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'tts-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const { handleTtsRequest } = await server.ssrLoadModule('/api/tts.ts');
          const url = `http://${req.headers.host ?? 'localhost'}${req.originalUrl ?? req.url ?? ''}`;
          // Emulator sign-ins aren't signed by Google, so the dev server skips the sign-in check
          const request = new Request(url, { headers: { 'X-Firebase-Token': String(req.headers['x-firebase-token'] ?? '') } });
          const response: Response = await handleTtsRequest(request, { ...env, TTS_AUTH: 'off' });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(`tts-api-dev: ${error instanceof Error ? error.message : String(error)}`);
          res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

const SW_BUILD_ID_LINE = "const BUILD_ID = 'dev';";
const SW_PRECACHE_LINE = 'const PRECACHE_ASSETS = [];';

/**
 * Fills in the build id and the built JS/CSS list in dist/sw.js (copied from public/sw.js), so
 * every build gets its own app cache and the app starts offline without visiting each screen.
 */
function swPrecachePlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'sw-precache',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    writeBundle(options, bundle) {
      const files = Object.keys(bundle).sort();
      const assets = files.filter((file) => /\.(js|css)$/.test(file)).map((file) => `${config.base}${file}`);
      const hash = createHash('sha256');
      for (const file of files) {
        const output = bundle[file];
        hash.update(file);
        if (output.type === 'asset') hash.update(output.source);
      }
      const buildId = hash.digest('hex').slice(0, 12);

      const swPath = join(options.dir ?? config.build.outDir, 'sw.js');
      const source = readFileSync(swPath, 'utf8');
      if (!source.includes(SW_BUILD_ID_LINE) || !source.includes(SW_PRECACHE_LINE)) {
        throw new Error('sw-precache: public/sw.js no longer has the BUILD_ID / PRECACHE_ASSETS lines');
      }
      writeFileSync(
        swPath,
        source
          .replace(SW_BUILD_ID_LINE, `const BUILD_ID = '${buildId}';`)
          .replace(SW_PRECACHE_LINE, `const PRECACHE_ASSETS = ${JSON.stringify(assets)};`),
      );
    },
  };
}

/**
 * Libraries in their own chunks: their file names (content hashes) stay the same between releases,
 * so returning learners download only the app code that changed.
 */
function vendorChunk(id: string): string | undefined {
  if (/node_modules[\\/](firebase|@firebase)[\\/]/.test(id)) return 'firebase';
  if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
  return undefined;
}

export default defineConfig(({ mode }) => ({
  resolve: { alias: { 'emoji-jsx': resolve(__dirname, 'src/emojiJsx') } },
  // The JSX runtime is app source (it reads the icon map): served as is, not pre-bundled as a stale copy
  optimizeDeps: { exclude: ['emoji-jsx/jsx-runtime', 'emoji-jsx/jsx-dev-runtime'] },
  plugins: [react({ jsxImportSource: 'emoji-jsx' }), ttsApiDevPlugin(loadEnv(mode, process.cwd(), 'AZURE_')), swPrecachePlugin()],
  build: {
    rollupOptions: { output: { manualChunks: vendorChunk } },
  },
}));
