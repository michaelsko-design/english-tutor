import { defineConfig, loadEnv, type Plugin } from 'vite';
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
          const response: Response = await handleTtsRequest(new Request(url), env);
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

export default defineConfig(({ mode }) => ({
  plugins: [react(), ttsApiDevPlugin(loadEnv(mode, process.cwd(), 'AZURE_'))],
}));
