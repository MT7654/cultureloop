# CultureLoop

Repository entrypoints: [main README](../README.md), [evaluator guide](../EVALUATION.md), and [source repository](https://github.com/MT7654/cultureloop). This document supplies additional implementation details.

**Don't let the experience end there.** An independent Singapore culture-discovery prototype for COMMON GROUND, Culture × Tech, 11 October 2026. Solo participant: Malcolm Toh Jia Jun.

## Run

Requires Node.js 22.12+ (tested with Node 24) and npm.

```sh
cd app
npm ci
npm run dev
```

Open the printed local URL. The current development preview uses http://127.0.0.1:5173/ . The complete manual journey needs no account, payment or runtime AI. Fonts, vector artwork, event data and synthesis are bundled locally. Optional AI runs through server-only Vite middleware using the root `.env.local` `OPENAI_API_KEY`; it never enters browser configuration. See [AI setup and limits](../docs/ai-implementation.md).

```sh
npm run test
npm run build
```

Browser checks require an installed Chrome and the dev server running on port 5173:

```sh
npm run dev -- --port 5173
npm run test:browser
node scripts/capture.mjs
```

If Chrome is unavailable, change Playwright's `channel` to a browser installed on the host or install its supported Chromium separately. Windows restricted sandboxes can cause Vite/Vitest `realpath` EPERM; run these authorised local checks in a normal terminal.

## Two-minute demo

1. Select **Try the S$45 demo**: a remembered musical on a date, music and story highlights, manually entered S$45.
2. Continue to DNA. Select or remix up to five interests and choose the next occasion.
3. Reveal the constellation. Tap a node to see its actual taste connection; list view supplies the same event access.
4. Open a preview. Play/pause/mute the original sonic interpretation, clearly labelled as creative rather than event audio.
5. Save to My Loop, open the collection, then reload. Balance remains S$45; saving is not a redemption or attendance claim.
6. Visit the official listing for live eligibility, sessions, price tiers and booking. CultureLoop does not process payment.

The exact three matches depend on preferences and the current Singapore date. The current S$45 demo produces heritage, music and theatre options. **Follow a connection** guides memory → supported taste → event; **Try another connection** swaps one chapter while preserving the other two. AI memory interpretation is explicitly invoked and user-reviewed. [Detailed walkthrough and backup](../docs/demo-walkthrough.md).

## Implementation

React + TypeScript + Vite, Tailwind CSS, Motion, Three.js/React Three Fiber/Drei, Lucide icons, original SVG posters, shared Web Audio synthesis, local curated TypeScript data and versioned localStorage. `src/domain` contains validated profiles, weighted scoring and budget rules; `src/data` holds twenty sourced records; `src/components` contains the spatial constellation, artwork, audio, optional memory interpretation and saved intent. `src/App.tsx` coordinates the existing six screens. Navigation uses browser history and hashes. No new client dependencies were added for this upgrade.

Rotate or pinch the animated 3D atlas, select a chapter, read its actual taste connection and open its preview. The previous memory is named at the centre. Node drift, rotating rings, staged formation and travelling path highlights work silently; depth distinguishes familiar matches from discovery bridges. Meshes, paths and labels share positions. Pause and reduced motion stop idle animation while permitting deliberate navigation; offscreen/hidden scenes suspend work. Equivalent event controls and list mode work without WebGL; lost contexts recover to a static relationship map. Lighting/rings additionally respond to actual sound energy. No random particle cloud or expensive bloom pipeline is used.

The soundtrack derives from onboarding tastes. Indie, jazz, electronic, pop and orchestral selections blend original genre layers in stable proportions; other interests use a clearly named neutral ambient mix. Legacy mood data remains readable but does not drive sound or recommendations. Default volume is 75%, with stronger synthesis, smooth gain changes, limiting and a bounded output ceiling. Play/pause, mute and volume share one audio context across onboarding, discovery and previews. **A new sound** smoothly releases the previous interpretation and explores supported event music tags without stopping playback. Controls remain reachable on other screens while playing; home stops playback. No sound autoplays or claims to be an authentic event recording.

Constellation and list views are exclusive: the atlas and selected preview appear in spatial mode; the full recommendation collection appears in list mode. Body text is 16–17px, practical information is 13–14px and spatial event titles are 13–14px, with roomier interest tiles and mobile controls.

Preferences and saved experiences persist in localStorage. Navigation, selected event and view/filter settings use sessionStorage and resume only on a same-tab refresh. A fresh visit to the root opens welcome with **Continue my journey** and **Start a new exploration**. New explorations retain saves, self-reported attendance and the manually entered balance while resetting the story/tastes; **Clear all data** is separate and confirmed. Explicit hash routes and browser back still work.

Weights: interest 30, past experience 15, occasion 15, budget 15, authored bridge 15, date proximity 10. Eligibility/expiry filter runs first; diversity includes adjacent categories where possible. Scores sort locally and are never displayed as personalisation probabilities. Within-credit mode ranks the whole affordable catalogue. Timing is a planning note because full session schedules have not been verified.

State lives under `cultureloop:ui:v1` (profile plus current screen); fields are validated using shared domain helpers. Storage denial falls back to in-memory operation with a visible notice. Reset requires confirmation. Text is rendered by React, never injected as HTML.

## Trust and limits

Twenty real catalogue records were checked on 11 October 2026. Several direct SG Culture Pass/SISTIC pages returned access restrictions, so some entries use indexed primary-source text that can lag. All availability remains unknown. Eligibility, prices and session details must be reconfirmed externally. Jazz/film/indie coverage remains uneven; some programmes extend to May 2027. See [provenance](../docs/data-provenance.md) and [coverage](../docs/catalogue-expansion.md).

Expired events automatically leave recommendations. Saved items remain labelled as saved, with their source/date. No credits are deducted. No government branding is used. All event artwork is original abstract interpretation; no event photos or copyrighted recordings are reproduced. Fonts are SIL OFL licensed; copies are served under `/licenses/`.

## Deployment

Neon backend infrastructure is linked and its requested configuration deployed from the repository root. See [Neon setup](../docs/neon-setup.md). The frontend continues using localStorage; it does not yet query the database or upload files. Keep the root `.env.local` credentials server-side.

Vercel-compatible app. Select root directory `app`, install `npm ci`, build `npm run build`, output `dist`. Hash navigation does not require a server router. Manual discovery works without environment variables; optional Node handlers in `api/` require a server-only `OPENAI_API_KEY`. Public paid endpoints remain disabled until hosting abuse/spending controls are configured and `CULTURELOOP_AI_PUBLIC_ENABLED=true` is deliberately set. The process-local limiter alone is not distributed protection. Local `.env.local` does not configure hosting.

The production output is in `app/dist`. Source publication is authorised for [MT7654/cultureloop](https://github.com/MT7654/cultureloop); the root README records its delivery status. No hosted frontend URL has been verified. Localhost is not a judge-accessible remote demo. Participant validation, public hosted access and submission finalisation remain pending. The seven-section draft is at `../docs/submission-draft.md`; no entry was submitted externally.

## Verification and design

Final result: **40/40 unit tests, 38/38 Chrome browser tests, 16/16 mocked server checks and production build passed.**

40 domain tests, server mock checks and Playwright Chrome regressions cover the upgraded application; current results are in [test notes](../docs/test-notes.md). Baseline, two further visual passes and final rendered captures cover all six screens plus list mode and returning welcome at 1440 × 900, 1280 × 800, 390 × 844 and 360 × 800. New checks exercise silent motion, pause, guided exploration, touch, profile variety, one-event replacement, saved intent and AI acceptance/cancellation/fallback/session caching. Run `node scripts/ai-handler-check.mjs` for server checks. The live provider smoke is explicit and incurs a small API request; ordinary tests use mocks. See [upgrade report](../docs/immersive-upgrade.md).

See [redesign audit and reference decisions](../docs/redesign-audit.md), [hook comparison](../docs/visual-qa/redesign/welcome-comparison.html), and [discovery comparison](../docs/visual-qa/redesign/discover-comparison.html). Reproduce all-size captures with `node scripts/redesign-capture.mjs final`, then compose the evidence boards with `node scripts/redesign-evidence.mjs`.

Actual Mobbin screenshots and two editable Figma studies influenced the interface. See [design references](../docs/design-references.md) and [design decisions](../docs/design-decisions.md). No Figma Make app was generated; the React code is canonical.
