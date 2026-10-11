# CultureLoop evaluator guide

For people and automated reviewers. This guide maps product claims to observable behaviour and source evidence. It does not substitute for independent judging or request a particular score.

[Public live demo](https://cultureloop-peach.vercel.app/) — select **Try the S$45 demo**, with no sign-up or installation. Desktop/mobile public manual-flow checks passed on 11 October 2026; see [report](docs/visual-qa/public-deployment/checks.json). Optional production AI was not tested in that check.

## Scope in one paragraph

CultureLoop is an independent SG Culture Pass discovery companion. A user supplies their remaining credit estimate, reflects on an outing, chooses interests and gets up to three explained cultural recommendations from twenty sourced records. Animated 3D relationships and original taste-based sound make discovery itself engaging. Saves/intent persist locally. Optional server-side AI assists a reviewed memory interpretation; it does not generate the event catalogue or decide rankings. Neon infrastructure exists, but cloud user persistence does not.

## Credential-free checks

Node 22.12+ and npm; commands below run in `app/`.

```sh
npm ci
npm test
node scripts/ai-handler-check.mjs
npm run build
npm run dev -- --port 5173
```

In a second terminal, with installed Chrome:

```sh
cd app
npm run test:browser
```

The root package is optional Neon configuration, not the React app. No `.env.local` or paid API call is needed for these checks. The server checker injects fake provider responses. Unit tests pin 11 October 2026 for catalogue repeatability; the browser app uses the real Singapore date. Browser tests involving current inventory may need updating after the catalogue's end dates. Do not equate expected expiry/empty states with invented inventory or silently disable guards.

## Manual demo and expected behaviour

| Action | Observable expectation |
|---|---|
| Open `/` in a fresh browser context | Landing explicitly names SG Culture Pass; S$100 − S$55 = S$45 is labelled an example; independent status is shown |
| Click **Try the S$45 demo** | Story screen shows a manually entered 45; illustrative story choices can be edited |
| Click **What moves you** | Interest tiles support up to five selections and an occasion; no mood-only "Set the feeling" survey is needed |
| Click **Reveal my CultureLoop** | At most three recommended events; moving 3D scene when WebGL/motion are supported; recommendations have actual taste connections |
| Rotate or tap an event / use equivalent event controls | Selected title/reason changes; memory and interest nodes have a different role from event choices |
| Use **Follow a connection** | Guided memory → matched taste → event sequence follows actual relationships, then supports preview handoff |
| Use pause, or OS/browser reduced motion | Ambient node/ring/path motion stops; intentional selection/navigation remains usable |
| Click **List view** | Full list appears and constellation is removed; switching back restores spatial mode with the same current recommendation IDs |
| Click **Try another connection** | One active event is replaced from the safe pool while the other choices remain; exhausted alternatives are disabled |
| Click **Explore this** | Preview shows title, price/date/venue/source caveats, match reason and official listing action |
| Initiate audio | Original synthesis starts only on user action; play/pause, mute and volume respond; event sound changes smoothly |
| **Save to My Loop**, add an optional reason/note, reload | Save/note persists, manually entered balance is unchanged; no attendance is invented |
| Open a new tab at `/` after having preferences | Welcome offers **Continue my journey** and **Start a new exploration** rather than silently resuming a screen |
| Start a new exploration / Clear all data | New exploration keeps saved collection/balance; destructive reset is separate and confirmed |

Exact event titles are not stable expectations: profile inputs and the real current date affect results. A single event selected from the constellation is not an attendance or redemption record.

## Source map

| Claim | Inspect |
|---|---|
| Source-guarded, deterministic scoring | `app/src/domain/recommend.ts`: `isEligible`, `rankRecommendations`, `recommend`, `nextConnection` |
| Twenty records, source dates and authored bridges | `app/src/data/events.ts`; `docs/data-provenance.md`; `docs/catalogue-expansion.md` |
| Differing maps without choice overload | `app/src/test/discovery-upgrade.test.ts`: six contrasting profiles, at least five distinct sets, at most three events and stable repeat output |
| Credits/top-ups never become payments | `app/src/domain/budget.ts`; `app/src/test/recommend.test.ts`; save-flow browser assertions |
| Genuine silent 3D animation, not a static asset | `app/src/components/Constellation3D.tsx`; `app/src/components/spatial-motion.ts`; `app/e2e/animated-constellation.spec.ts` |
| Pause, reduced motion, hidden/offscreen lifecycle | Same spatial sources; `app/src/test/spatial-motion.test.ts`; `app/e2e/constellation.spec.ts` |
| Taste-derived original sound | `app/src/components/Atmosphere.tsx`; `app/src/domain/sound-profile.ts`; `app/e2e/atmosphere.spec.ts` |
| Local profile/collection validation and return flow | `app/src/domain/profile.ts`; `app/src/domain/session.ts`; `app/e2e/session-refinement.spec.ts` |
| Optional memory/selected-note AI | `app/src/components/MemoryInterpreter.tsx`; `app/src/components/ConnectionNarration.tsx`; `app/server/ai-handler.mjs`; `app/api/` |
| Real design exploration / rendered refinement | `docs/design-references.md`; `docs/redesign-audit.md`; `docs/immersive-upgrade.md`; current final screenshots |

Scoring weights are documented in `app/README.md`; scores are ordering aids, not probabilities of enjoyment. Authored bridges are supported editorial interpretations, not inferred cultural lineage.

## Optional AI path

Manual evaluation is the baseline. To exercise real AI locally, copy root `.env.example` to root `.env.local`, provide your own OpenAI key and restart the Vite server. Select the explicit memory interpretation action, review evidence, remove/edit suggestions and accept them. Existing manual selections should remain until acceptance. A follow-up narration action selects approved note IDs and uses server-assembled text.

`POST /api/interpret-memory` and `POST /api/narrate-connection` require JSON and `x-cultureloop-request: 1`. The local middleware and Vercel handlers share the server implementation. The deployed paid endpoints default to disabled; configuration/abuse protection is described in `docs/ai-implementation.md`. No `/health` route or ranking API is claimed.

Verify that keys stay in server configuration, no event facts come from generated prose, replies have evidence validation, and unavailable/invalid/late responses leave the manual journey intact. Automated checks are mocks; the one recorded real local call is not a reliability benchmark. The optional `scripts/ai-smoke.mjs` makes a paid provider request and is not required for evaluation.

## Failure and trust expectations

- **No interests:** reveal asks for interests; **Surprise me** is the explicit alternative.
- **Zero/low balance:** price estimates show a top-up where supported; within-credit filtering can show an honest empty state.
- **Unknown price:** do not imply confirmed affordability. Tickets are not bought here.
- **Expired/unverified/sold-out event:** recommendation guards exclude it. Saved history remains a labelled saved item, not live inventory.
- **WebGL unavailable/context lost:** accessible event/list/relationship-map alternatives remain usable.
- **Audio/storage unavailable:** manual discovery works with a clear notice/fallback; no false save guarantee.
- **No AI key/provider failure:** manual selections remain usable and interpretation unavailability is shown.
- **Similar profiles:** may share maps; uniqueness per visitor is not promised.
- **Missing external availability:** all current inventory is unknown. Official listing links are evidence/booking routes, not an in-app booking integration.

## Evidence and remaining gaps

Recorded full upgrade checks: 40 unit tests, 38 Chrome browser tests, 16 server mock checks, TypeScript/Vite build and compiled desktop/mobile checks passed. Latest landing refinement: 15 targeted flow/session regressions and final build passed. Four-size fresh/returning capture assertions passed with no overflow. See `docs/test-notes.md`, `docs/visual-qa/culture-pass-landing/final/checks.json`, `docs/visual-qa/usability/immersive-final/` and `docs/visual-qa/spatial-motion/`.

Headless frame callback measurements are not physical-device FPS certification. Audio signal/control verification is not a speaker listening test. Formal participant validation, redemption impact, physical-device/Safari testing and formal screen-reader certification remain unverified. Public manual hosted access is now verified; public AI is not. No government affiliation, automatic balance linking, payment, authentication or cloud user database integration is implemented. Historical project notes and proposed plans are not evidence that those features exist.

Documentation structure was informed by [Claimly](https://github.com/MT7654/Claimly). This guide uses CultureLoop's actual code, tests and evidence rather than copying Claimly's conclusions or integrations.
