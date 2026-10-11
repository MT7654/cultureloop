# Optional cultural-memory interpretation

Implemented 11 October 2026. React stays usable without AI. `MemoryInterpreter` sends only explicitly entered memory (3–600 characters), shows editable evidence-backed suggestions and applies them only after acceptance. The lead integrates accepted values into supported interests/highlights; no new recommendation weights or event facts are generated. `ConnectionNarration` explicitly sends an accepted summary and actual supported relationship; the model selects one or two approved cultural-note IDs. The server assembles the exact approved notes rather than accepting generated factual prose.

## Local and deployed runtime

- Root `.env.local` privately normalised to a standard `OPENAI_API_KEY` assignment. Neon values retained; ignored file never copied into React. Optional `OPENAI_MODEL` overrides the tested `gpt-4o-mini` default.
- Vite development and preview use the same server-only handler via middleware. No SDK/dependency added. Browser requests contain no credentials; final compiled JavaScript was checked against private environment values and credential markers, with none found.
- `app/api/interpret-memory.ts` and `app/api/narrate-connection.ts` are Vercel Node handlers. Hosting needs a **server-only** `OPENAI_API_KEY` variable; a local file does not configure the deployment.
- Deployed paid endpoints are disabled by default. Configure real deployment-side WAF/rate/spending protection before deliberately setting `CULTURELOOP_AI_PUBLIC_ENABLED=true`. The process-local limiter (two concurrent requests, 12 requests/IP/hour, 100 requests/process/hour and short cooldown) is a demo safeguard, **not a distributed abuse-control guarantee**. Public enablement and external publication remain delivery decisions.
- JSON/content-type/header/origin/4096-byte bounds, 600-character memory and 240-character summary limits, strict-schema output, exact evidence checks, eight-second provider timeout and no automatic retries. Provider errors/refusals remain nonblocking. Components cancel or ignore stale results after text/profile/route changes.
- Requests use `store:false`; raw memories and responses are not server-logged. This is not a claim of zero provider retention. No Neon schema, authentication or user cloud storage added.

## Integrated behaviour

Accepted values merge into existing manually selected tastes/highlights without overwriting them; caps remain five tastes/two highlights and the UI reports when suggestions cannot all fit. Accepted music tastes drive the shared soundtrack. Optional narration is shown only for an accepted summary and an actual matched relationship. A bounded 30-entry in-memory session cache avoids repeated requests for the same event/summary/tags; fresh exploration/demo/reset clears it, and a browser reload does not preserve generated narration. A browser regression verifies explicit invocation, reuse and unchanged practical event facts. Raw input is not stored in the profile; only the accepted short summary and confirmed choices are saved.

## Actual verification

- `node scripts/ai-handler-check.mjs`: 16 mocked server checks passed (strict schema/non-storage, evidence/explicit-negation validation, input bounds, origin, method, missing-key/deployed-disabled fallback, provider failures, cooldown and trusted narration).
- Four meaningful validator unit tests are included in the passing 40-test suite. The conservative clause guard rejects obvious dislike evidence but cannot establish every linguistic nuance.
- `npx tsc -b` passed after component/server adapter addition.
- Both deployed handler sources also passed standalone strict TypeScript checks. Five Chrome AI regressions passed: explicit call/edit/accept, unavailable-provider manual continuation, stale edit cancellation, invented evidence rejection and session-cached narration without changed facts. They are included in the passing 38-test browser suite. No paid requests occur in these mocked browser tests.
- Explicit real smoke: HTTP200/provider200, model `gpt-4o-mini-2024-07-18`, 2364ms, 279 input +55 output =334 tokens. Positive jazz/atmosphere suggestions returned for the provided jazz/intimate-setting example. Earlier sandbox/transient attempts returned the fallback; no secret values were displayed. This is one successful interpretation, not a guarantee of future quality/latency.
- Official implementation reference: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Schema/evidence validation reduces structural hallucination but does not establish semantic truth; editable confirmation remains necessary.

Run the smoke script only deliberately: it makes a small paid request. Browser regression mocks should cover accept/remove/decline, stale results, failure and no-call-on-load. The final app must also pass with AI unavailable.
