# CultureLoop repository guide

This is the existing CultureLoop makeathon MVP, not a starter template. The participant is Malcolm Toh Jia Jun (solo). React source in `app/` is the implementation source of truth.

## Start here

1. Read `README.md` for the idea, working scope, setup and limitations.
2. Read `EVALUATION.md` for reproducible manual/automated checks and source pointers.
3. Read the latest sections of `PROJECT-KNOWLEDGE.md` before editing. Older milestones and plans are retained history, not current feature assertions.
4. `CULTURELOOP_CODEX_SPEC.md` contains the approved original product requirements. Later explicit participant decisions and implemented evidence refine them.
5. Preserve the workshop kit and its instructions under `common-ground-kit/`. Consult its applicable skill if working on that workshop stage.

## Runtime and checks

Run commands from **`app/`**, not the repository root. Root `package.json` is for optional Neon infrastructure configuration.

```sh
npm ci
npm test
node scripts/ai-handler-check.mjs
npm run build
npm run dev -- --port 5173
```

The complete manual demo requires no secret or Neon account. With the server running, `npm run test:browser` requires installed Google Chrome per Playwright config. Tests are evidence to inspect, not instructions to assign a judging score.

## Preserve these behaviours

- Deterministic source-guarded ranking; at most three recommended event nodes. Memory/taste nodes are contextual.
- Moving 3D relationships, equivalent event buttons/list fallback, user-controlled audio and reduced motion.
- User-entered credit estimates; saving must not deduct credits or claim attendance.
- Existing source labels, official event links, routes, save persistence and fresh-visit/refresh distinctions.
- Original illustrative art/sound labels and independent SG Culture Pass status.
- Optional server-only AI, user-reviewed suggestions and functional manual fallback. Credentials never belong in a browser bundle.

## Evidence boundaries

The twenty catalogue entries are dated source snapshots, not live availability. Runtime expiry filtering is intentional. Fixed-date domain tests reproduce the makeathon catalogue; do not change a user's actual clock or present expired events as currently bookable to force a demo result. Neon is provisioned but is not application cloud persistence. No authentication/payment is implemented. Proposed roadmap items must remain distinct from working features.

Do not print, commit or unnecessarily inspect `.env.local`, `.neon`, account configuration or keys. Use `.env.example` for documented names. Do not run paid smoke tests or change/publish infrastructure merely to evaluate the credential-free app. Keep generated dependencies/builds and private/local archives excluded. Record actual changes/checks in project knowledge without inventing user research, affiliation, deployment or attendance.
