# CultureLoop — Common Ground submission draft

Draft for Malcolm's review; not submitted. Adapted to the simplified live form supplied by Malcolm on 11 October 2026: one 100-word response for overview and one for build, plus links, team/collaboration and AI/tool attribution. Overview is 81 words; build is 86 words. Next steps remain suggested priorities for review. Seven kit sections are retained below for history/supporting context, but section 5 is no longer a separate field in the supplied form. Shared project Page update is pending.

## 1. Team Details

— Project name: CultureLoop

— Team name: Malcolm Toh, as displayed in the supplied saved-team form.

— Team members: Malcolm Toh Jia Jun (sole participant).

— Tracks: Recommended pair remains Design × Tech + Culture × Tech. Supplied form shows two selections but the pasted text does not identify which checkboxes are selected. Its instructions confirm judged-track panels may both consider a project nominated for both. Culture × Tech was previously confirmed; Malcolm should verify the intended pair in the form.

## 2. Project Overview (Max. 100 words)

CultureLoop helps people turn their remaining SG Culture Pass credits into their next cultural discovery. After one outing, what makes someone want to return? The project explores whether a personal connection can provide that nudge. Users enter their remaining credits, share what they enjoyed and choose their interests. Up to three explained recommendations appear in an animated 3D constellation. Original soundscapes and cultural notes invite users to explore connections between familiar interests and different art forms, making discovery an experience itself.

## 3. The Build (Max. 100 words)

Built with Codex, React, TypeScript, Three.js and Web Audio, using Mobbin and Figma for design exploration. The working app includes 20 sourced event records, up to three explained recommendations, animated constellations, taste-based soundscapes and locally saved collections. Optional server-side OpenAI features interpret memories for user review. I experimented with connecting familiar interests to different art forms, making spatial navigation accessible and keeping music continuous across screens. Next, I would test with users and cultural practitioners, refresh the catalogue and explore whether the experience encourages another outing.

## 4. Project Links & Demo

— Live demo / deployed project: [CultureLoop on Vercel](https://cultureloop-peach.vercel.app/). Verified without login in fresh Chrome contexts at desktop 1440×900 and mobile 390×844 on 11 October 2026. HTTP200, manual demo/three-event recommendations/preview/save/reload passed without page errors or overflow; desktop landing and mobile discovery captures inspected. Optional production AI was not exercised.

— Demo video: [Silent manual-flow WebM recording](https://github.com/MT7654/cultureloop/blob/main/docs/demo/cultureloop-manual-demo.webm), included in the public source repository. Duration measured from the actual local WebM in Chrome: 30.72 seconds, 1440×1000, within the form's two-minute limit. It predates the final Culture Pass landing copy and has no narration/audio track or AI fixture request. Playback/download behaviour depends on the viewer.

— GitHub / source code (required unless the project isn't based on code): [MT7654/cultureloop](https://github.com/MT7654/cultureloop). Public source pushed to main; README and evaluator guide verified readable without credentials on 11 October 2026. React application is under `app/`.

— Figma / prototype link (optional): [CultureLoop art directions](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR). File creation and editing verified; unauthenticated judge access unverified. No sharing permissions changed.

— Other supporting materials: [README and setup](https://github.com/MT7654/cultureloop#readme), [evaluator guide](https://github.com/MT7654/cultureloop/blob/main/EVALUATION.md), [design references](https://github.com/MT7654/cultureloop/blob/main/docs/design-references.md), [provenance](https://github.com/MT7654/cultureloop/blob/main/docs/data-provenance.md), and selected final screenshots under docs/visual-qa/. Intermediate captures and unrelated archives remain local.

Try-it instructions for the form: No installation or sign-up needed. Open the live demo and select “Try the S$45 demo”. Review the story, choose “What moves you”, select interests and reveal your constellation. Explore a connection, open a preview, press Play for the original soundtrack and save to My Loop. Credits are illustrative; saving does not spend them. AI features are optional. README/evaluator links above provide supporting evidence and local setup.

## 5. Track-Specific Reflection

For Culture × Tech:

CultureLoop treats culture as a continuing personal relationship rather than a credit-spending task. It connects familiar interests to source-supported artistic forms: live topical theatre, choral/spoken-word performance, Chinatown storytelling, contemporary art and music. The constellation makes each editorial bridge visible and explainable. Original geometric art and synthesised sound are clearly labelled interpretations, preserving the distinction between our creative invitation and actual artists’ work. The prototype aims to encourage curiosity about Singapore’s culture; repeat participation or redemption impact has not been measured.

For Design × Tech (proposed second track; draft reflection):

CultureLoop turns personalisation into a spatial interaction: a remembered experience anchors an animated constellation, selected tastes connect to source-supported cultural features, and a guided path explains a relationship before opening a preview. Three moving chapters keep the choice manageable; one-event replacement supports exploration. An original soundtrack derives from onboarding tastes, and actual audio energy shapes the scene's lighting. Pause, a list alternative, reduced motion and unsupported-WebGL recovery preserve access. The experiment explores discovery through relationships; its novelty and audience effect have not been validated.

## 6. Team & Collaboration

I built CultureLoop as a solo project. I developed the concept, set the creative direction and reviewed the experience throughout. I used Codex to help bring UX research, interaction design and implementation together. My feedback shaped readability, music, moving constellations and the clearer SG Culture Pass story. The focus was a coherent, personal experience with understandable recommendations and traceable event information.

## 7. AI & Tool Attribution

Concise response for the live form:

I used OpenAI Codex for research, design exploration, coding, testing and submission writing. Mobbin’s Spotify and DICE references informed interaction patterns; Figma MCP supported visual exploration. The OpenAI API supports optional, user-reviewed memory interpretation and connections to approved cultural notes. Event facts come from SG Culture Pass, authorised ticketing partners and organiser sources, rather than AI generation. Artwork and synthesised sound are original creative interpretations. Font and icon licences are included. Neon was provisioned; user preferences and saved journeys currently stay in browser storage.

Detailed supporting attribution:

Codex assisted implementation, original vector compositions, original Web Audio synthesis, research synthesis, tests, documentation and this draft. Exact underlying Codex model version is not established. Bounded Codex subagents assisted event research, editable Figma studies, spatial animation, sound and server-side memory interpretation. OpenAI Responses powers explicitly requested optional memory suggestions and selection of approved cultural notes. One real interpretation smoke test used `gpt-4o-mini-2024-07-18` (334 tokens); other automated AI checks use labelled test fixtures. AI does not supply prices, dates, eligibility, booking links or event rankings. Public paid API defaults to disabled pending hosting protections; the participant's production AI configuration was not tested in the public manual smoke check.

Mobbin’s connected app supplied inspected Spotify Home/Browse/Now Playing/onboarding, DICE discovery/detail and earlier Airbnb accommodation-detail screens; see docs/redesign-audit.md and docs/design-references.md for exact links. These were references only; no competitor images were bundled. Figma MCP created two original art directions, preview studies and revised atlas compositions; Figma Make was not used. The React app remains canonical.

SG Culture Pass, BookMyShow, SISTIC and organiser pages supply the twenty event snapshots. Several official pages were retrieved through search indexing because direct access returned 403; availability remains unknown. Original artwork is not actual event photography; synthesis is not an artist recording. Fontsource distributes Space Grotesk, DM Sans and Bodoni Moda under SIL OFL; Lucide icons are ISC licensed. License copies ship with the app. React, Vite, Tailwind, Motion, Vitest and Playwright supported development and verification. The Common Ground kit provided the workflow and submission template.

---

Ready for Malcolm to review against the live form. Confirm the selected track pair and first-person process/next-step wording; optional Figma can be omitted while judge access is unverified. Hosted manual journey and public source are verified; the existing silent video is under two minutes but is an earlier landing snapshot. Production AI enablement is untested here. Pages sync is pending because no Pages editing tool is exposed. No external draft/save/submit action has been performed.
