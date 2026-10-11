import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { events } from './src/data/events';
import { createAIHandler } from './server/ai-handler.mjs';

export default defineConfig(({ mode }) => {
  const runtime = globalThis as typeof globalThis & { process?: { env: Record<string, string | undefined> } };
  const env = { ...loadEnv(mode, '..', ''), ...loadEnv(mode, '.', ''), ...runtime.process?.env };
  const ai = createAIHandler({ env: { ...env, CULTURELOOP_AI_LOCAL: 'true' }, getEvent: (id: string) => events.find(event => event.id === id) });
  const localAPI: import('vite').Plugin = {
    name: 'cultureloop-local-ai',
    configureServer(server) { server.middlewares.use('/api', (req, res, next) => {
      const request = req as typeof req & { url?: string };
      if (!request.url?.startsWith('/interpret-memory') && !request.url?.startsWith('/narrate-connection')) return next();
      request.url = '/api' + request.url; void ai(request, res);
    }); },
    configurePreviewServer(server) { server.middlewares.use('/api', (req, res, next) => {
      const request = req as typeof req & { url?: string };
      if (!request.url?.startsWith('/interpret-memory') && !request.url?.startsWith('/narrate-connection')) return next();
      request.url = '/api' + request.url; void ai(request, res);
    }); },
  };
  return { plugins: [react(), tailwindcss(), localAPI] };
});
