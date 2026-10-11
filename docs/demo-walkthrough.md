# CultureLoop demo rehearsal

Local demo: http://127.0.0.1:5173/ . Run `npm run dev` from `app`; use an installed Chrome. This is a local preview, not a remotely accessible judge link.

## Two-minute story

1. **0:00–0:15 — The premise.** “Eligible Singapore Citizens received S$100 in SG Culture Pass credits. Imagine spending S$55 on one outing, then wondering what to try with the remaining S$45. CultureLoop connects what stayed with you to your next cultural experience.” Choose **Try the S$45 demo**; identify the amounts as illustrative and the balance as manually entered. CultureLoop is an independent companion, not an official redemption service.
2. **0:15–0:35 — The memory.** Show the existing story choices. Optionally enter “I loved the live jazz and intimate setting, but the crowded venue put me off,” then explicitly use **Find my connections**. Review the supporting words and remove or accept suggestions. Continue manually if unavailable; do not claim crowd-size filtering.
3. **0:35–0:55 — Tastes.** Select up to five interests. Music tastes compose an original soundtrack; nonmusic interests use an ambient interpretation. Play requires a deliberate action.
4. **0:55–1:20 — The universe.** Reveal three moving event chapters from 20 curated snapshots. Rotate, pause or select a node. Use **Follow a connection**, then Next/Next to demonstrate memory → actual matched taste → event. Explain that a bridge is an editorial reading of sourced programme features.
5. **1:20–1:40 — The meaning.** Open the event, read its source-supported cultural notes and question. If an accepted memory exists, **Connect this to my story** explicitly selects approved notes through AI. Prices, dates and eligibility always come from the dataset. Music/artwork are original interpretations, not recordings/photos of that event.
6. **1:40–2:00 — Continuity.** Save, optionally add an intent, and visit My Loop. Saving keeps the entered balance; it does not claim attendance or redemption. Open the official source to reconfirm booking details if network/time permits.

## A contrasting second user

Choose **Start a new exploration** on welcome. Keep the entered balance or change it to S$45; choose heritage, family and learning. The map and relationships change through these inputs; music becomes neutral ambient. Similar profiles may legitimately share events. **Try another connection** replaces one chapter while keeping the other two and all saves.

## Backup

The screenshot storyboard is `docs/visual-qa/usability/immersive-final/`. `node scripts/demo-backup.mjs` records the actual manual flow into `docs/demo/cultureloop-manual-demo.webm`; it uses no AI fixtures or paid requests. Playwright's recording is silent and is a visual backup, not evidence of recorded music. Manual onboarding, deterministic discovery and saving remain available when the AI/server/network fails.

Source, selected final evidence and the silent manual-flow recording are published at [MT7654/cultureloop](https://github.com/MT7654/cultureloop). [Public Vercel demo](https://cultureloop-peach.vercel.app/) was checked without sign-in: desktop/mobile manual demo, preview and save/reload passed. Existing silent recording duration is 30.72 seconds, measured from the actual WebM in Chrome; it predates the last landing-copy revision. Production AI was not tested in this public check. The submission draft has not been sent. Figma judge access and shared Pages sync remain unverified/pending.
