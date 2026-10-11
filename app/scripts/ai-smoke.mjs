// Explicit, bounded developer smoke test. Never writes user input or credentials.
import { loadEnv } from 'vite';
import { createAIHandler } from '../server/ai-handler.mjs';
const env = { ...loadEnv('development','..',''), ...process.env };
let providerStatus; let providerCode; let usage; let actualModel;
const handler = createAIHandler({ env, fetchImpl: async (...args) => {
  const response = await fetch(...args); providerStatus = response.status;
  const payload = await response.clone().json().catch(() => ({}));
  const code = payload.error?.code || payload.error?.type;
  providerCode = typeof code === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(code) ? code : undefined;
  usage = payload.usage; actualModel = payload.model;
  return response;
} });
const started = performance.now();
let status; let result;
await handler({ method: 'POST', url: '/api/interpret-memory', headers: { 'content-type': 'application/json', 'x-cultureloop-request': '1', host: '127.0.0.1' }, socket: { remoteAddress: 'smoke' }, body: { memory: 'I loved the live jazz and intimate setting, but the crowded venue put me off.' } }, { setHeader() {}, set statusCode(value) { status = value; }, end(value) { result = JSON.parse(value); } });
console.log(JSON.stringify({ status, providerStatus, providerCode, elapsedMs: Math.round(performance.now()-started), configuredModel: env.OPENAI_MODEL || 'gpt-4o-mini', actualModel, usage, suggestedInterests: result?.interests?.map(row => row.value), suggestedHighlights: result?.highlights?.map(row => row.value), serverOnlyKeyPresent: Boolean(env.OPENAI_API_KEY) }));
if (status !== 200) process.exitCode = 1;
