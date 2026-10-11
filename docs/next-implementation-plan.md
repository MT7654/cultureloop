# CultureLoop: remaining 150-minute implementation plan

Approved plan from 11 October 2026, subsequently implemented following Malcolm's “Implement it all.” The planning details below record the original decisions; their audit/feasibility statements are historical. The delivered state and actual checks are in [immersive-upgrade.md](immersive-upgrade.md). Moving 3D, guided connections, 20 curated snapshots/three-choice maps, controlled replacement, optional collection intent, smooth sound transitions, AI memory interpretation and grounded narration are implemented. External hosting/public AI enablement and optional Neon application integration remain separate delivery work.

## Intended result

An animated cultural universe drawn from a broader curated catalogue, with three personalised event choices, an optional AI-assisted interpretation of the user's cultural memory, a guided source-supported cultural connection and a personal saved journey. Preserve the existing six screens, deterministic recommendations, typography, source/budget labels, local persistence, accessible alternative and gesture-only sound. No concept pivot.

Current scene evidence: selection/reset animate the camera; live audio changes point-light intensity. Nodes, rings and connection paths mostly have fixed transforms. Genuine visible mesh/path motion must work with audio off.

## 0. Broader catalogue, smaller personal constellations (core scope)

Target approximately **20 verified eligible experiences in total**, expanding the existing seven rather than replacing them. Recommend **three event nodes at a time** on desktop and mobile; never fill five slots just because more catalogue entries exist. One or two results are acceptable if availability, dates or the within-credits filter leave fewer suitable options. An honest empty state is preferable to ineligible or weak filler.

The three-event limit refers to recommended experiences. The remembered experience and selected interest nodes remain separate, visually quieter context nodes. With one memory, up to five selected tastes and three events, the scene can contain up to nine meaningful nodes; collapse irrelevant taste labels rather than remove the user's story. The list alternative shows the same current three choices, not the entire catalogue. No change to the existing three-event spatial capacity is needed.

### Catalogue curation and trust

- Research about 13 additional distinct experiences through official SG Culture Pass listings, authorised ticketing pages and organiser programme sources. Use an approximately 60-minute elapsed research/verification window in parallel with animation development; stop at minute 80 for final catalogue integration. Twenty is a target, not permission to fabricate entries. Record the actual verified total if sources or remaining time prevent reaching it.
- Prioritise gaps in the current seven: jazz, indie, electronic and pop where genuinely represented; film; literature; hands-on creative workshops; heritage/local history; contemporary visual art; theatre and family-friendly visiting contexts. Audit coverage of all twelve selectable tastes. Not every taste needs its own event, but each should have a supported direct match or authored bridge where reliable data allows.
- Include varied standard adult prices, dates and visiting contexts, aiming for useful choices at S$20, S$45 and S$100 balances without inventing affordable products. Capture known admission restrictions and fees. Do not equate a future date with available tickets or infer full session schedules.
- Require stable ID, title, description, organiser, venue, valid date range, official listing URL, eligibility evidence, verification timestamp/method, source URLs and honestly known price/availability fields. Unknown price stays unknown; unknown inventory stays unknown. Exclude expired, sold-out and unsupported eligibility records using existing guards.
- Tag only programme-supported interests. Write specific bridge explanations and cultural notes; avoid tagging every music event with every genre. Distinct ticket tiers or dates of one production do not count as multiple experiences to reach twenty.
- Reuse original category-based artwork with deliberate variations. Clearly label it as interpretation, not event photography. Store curated data locally and update provenance; catalogue expansion does not depend on Neon or scraping infrastructure.

### Personalisation and controlled variety

Keep the approved deterministic scoring weights and eligibility/budget/date rules. Separate ranking the eligible pool from selecting the displayed three so a larger pool does not overwhelm the UI. Select the strongest supported match, a justified adjacent discovery and a complementary high-quality choice, retaining prior-experience affinity where appropriate. Category diversity should distinguish similarly strong candidates, not promote a weak match solely to add a category. Do not force a bridge when no supported bridge exists.

Different profiles should change event IDs, explanations, matched taste links and semantic cluster positions through actual inputs: selected tastes, previous experience/sentiment, balance, visiting context and verified date constraints. Similar profiles may legitimately share recommendations; do not randomise results or guarantee every user a unique map. Remaining music choices also continue to determine the soundtrack independently of event selection.

Add **Try another connection** to replace one selected event with the next suitable alternative from the eligible ranked pool, preserving the other two. Update its explanation, paths, preview and animated transition together. Track replaced IDs only for the current exploration; never alter saved experiences or reset the profile. Hide or disable the control with a clear reason when no suitable alternative exists. A fresh exploration can reuse earlier candidates. This is controlled exploration, not an infinite shuffled directory.

### Acceptance and profile matrix

Test at least six contrasting fixtures: indie/storytelling on a date with S$45; jazz/orchestral solo with S$100; art/workshop with friends and S$20; heritage with family and S$45; film/literature solo with S$100; and electronic/pop with friends and S$45. Also test no interests, disliked previous category, zero balance, unknown prices, expired/sold-out records and a date window with no events.

For clearly contrasting fixtures, inspect actual differences in event selections and meaningful links, not just colours. Verify each explanation cites an actual matched tag, supported bridge or honest open-exploration rationale. Compare rankings while changing one input at a time; not every small input change must reorder results. All displayed maps contain no more than three unique event IDs; identical inputs produce identical initial recommendations; swapping changes only one recommendation, retains filters and cannot resurrect ineligible entries. If coverage is weak, correct the catalogue/tags before changing scoring weights. Dynamic data targets and assertions must not rely on seven fixed events or exactly three surviving every filter.

## 1. Animated constellation (highest priority)

- Animate the wireframe memory core and tilted orbital rings; spheres alone rotating would not be visibly distinctive.
- Give event/taste clusters slow bounded movement around their semantic anchor positions, retaining familiarity/discovery depth. Use deterministic phases, not random re-layout or a cloud of moving dots.
- Introduce the scene in an approximately 1.5-second formation: memory → selected tastes → genuine event links. Controls remain usable immediately.
- Trace the selected actual relationship with a travelling highlight. Hover/focus emphasises its path; selecting a node gently brings its cluster into view. Hold the interacted-with node steady so its hit target remains usable.
- Add a brief camera/connection transition into the existing preview and a save animation that marks the selected chapter in the constellation/collection.
- Sound energy adds a restrained pulse to ring scale/emission and link brightness; it supplements the silent idle animation.
- Add a visible Pause motion control. Respect reduced motion by default, and pause render loops when the page is hidden or the canvas is offscreen. Resume without a giant time jump. Keep drag/pinch, keyboard controls and lost-WebGL fallback.

Implementation: reuse R3F/Three/Drei. Extract a shared deterministic node-position model and focused animated node/link components. Meshes, endpoints and projected labels must consume the same positions, avoiding detached paths/labels. Use refs/buffer updates rather than React state per frame; limit DPR and provide a cheaper mobile mode. Preserve relation semantics and the existing recommendation order.

Acceptance: motion is obvious in a silent ten-second observation, but text stays readable and click targets usable. Links stay attached during motion/drag. Reduced-motion/Pause stops scene animation without stopping deliberate camera interaction. Tab visibility and route changes release continuous work. Measure sustained frame timing on this host; target approximately 50–60fps desktop/30fps mobile emulation, record actual results rather than promise physical-device performance.

## 2. Follow a cultural connection

Add a guided tour within the existing discovery view, not another onboarding screen. It visits the remembered experience, one matching taste and one recommended bridge, with a short caption at each stop. Next/back/exit and keyboard controls permit immediate interruption; use manual steps rather than a compulsory timed slideshow.

Enrich three existing featured previews with authored, sourced cultural interpretation: what the artistic form does, the specific programme feature that supports the bridge and a question worth taking into the experience. Keep a compact three-step relationship strip linking the selected taste to the form to the next chapter. Do not claim historical lineage just because two works share a tag.

Candidate stories from the current catalogue:
- Film/storytelling → audience-directed topical theatre in Fat Kids Are Harder To Kidnap.
- Indie/storytelling → choral voices and spoken word in Musica Intimae.
- Heritage/indie → contemporary Mandopop/electronic performance with Chinese cultural influences in SING浪.

These examples are usable only when the user's actual recommendation relationship supports them; other profiles receive appropriate existing explanations or an honest open-exploration state. Re-check any new cultural assertions against the linked programme sources. Retain eligibility/price/date caveats and clearly original sound/art labels.

## 3. Personal collection with intent

Add an optional “What sparked your curiosity?” field when revisiting a saved experience. Offer short intent choices and a brief note, using actual matched tastes where relevant. Store an optional versioned map keyed by event ID; old profiles migrate with an empty map. Saving and new-exploration flows preserve it; clearing all data clears it.

In My Loop, show the connection from remembered story to saved next chapters, with a lightweight animated journey line and the user's own intent. Reuse one small scene only if inexpensive; do not mount one WebGL canvas per saved card. Edit/remove intent and save/unsave remain accessible. Avoid displaying imagined attendance or changing the manually entered balance. Attendance reflection can be a later feature rather than a fabricated demonstration history.

## 4. Sound and immersive preview refinement

Keep taste-derived music, its stronger default output and one shared audio context. Tune actual audio-reactive movement to avoid continuous maximum brightness. Maintain a steady base mix during navigation with smooth release/transition. If time allows, let the preview's existing A new sound control explore a source-supported event music tag; label it an original creative study, not artist/event audio. No autoplay, compulsory sound or excessive selection effects.

## 5. Focused LLM enhancement: interpret the cultural memory

### Recommendation and scope

Add one bounded AI-assisted interaction to the existing Your Culture Story screen: an optional **What stayed with you?** text field and explicit **Find my connections** action. This strengthens the existing memory-to-next-experience idea without turning CultureLoop into a chatbot. The API is valuable for interpreting varied natural language; it is not necessary for animating 3D, establishing event facts, pricing or selecting from twenty curated events.

Example user input: “I loved the live jazz and intimate setting, but the crowded venue put me off.” The model can suggest Jazz and the supported music highlight, with a short evidence-based summary. Show editable chips and quoted supporting words. Ask the user to accept/adjust the suggestions before applying them to existing profile fields; do not automatically overwrite manually selected interests, convert one criticism into a disliked entire category, or pretend the app filters crowd size when that information is unavailable.

The resulting pipeline is: user memory → AI suggestions → user-confirmed supported tastes/highlights → existing deterministic ranking and three-event selection → actual constellation links. Accepted music interests affect the existing soundtrack; no separate superficial mood picker returns. Identical confirmed profiles still produce identical initial recommendations. Suggestions can vary, so AI output itself is not claimed to be deterministic. Map an unrepresented preference honestly rather than fabricate new event tags.

### Minimal implementation and key handling

- Current audit: the React/Vite application has no server API or OpenAI dependency. The root .env.local has an OpenAI label and a key-like value, but no standard nonempty OPENAI_API_KEY assignment was detected. The key value was not printed and its validity, credits, account/model access and latency have not been tested. Normalise the server environment assignment privately when implementation begins; do not duplicate it into browser-facing configuration.
- Add one small server-only POST /api/interpret-memory handler compatible with the existing Vercel project, plus a local development adapter/proxy that exercises the same handler. Explicitly load the root server environment locally. A deployed function needs its own server environment variable: a local file does not configure hosting. No Neon migration, authentication system, vector database or agent framework is required.
- Keep OPENAI_API_KEY server-only and never use a VITE_ prefix, frontend import, client request payload or error message for the credential. Preserve ignored environment files and check compiled assets for leakage.
- Use the Responses API with strict Structured Outputs. Suggested schema: a short summary, up to three proposed existing Interest enums and supported previous-highlight enums, each with a short input evidence span. Independently validate types, length, allowed values and evidence spans on the server. Schema conformity is not semantic truth; low-quality, unsupported or contradictory suggestions are discarded.
- Make model selection configurable server-side. Choose an account-accessible model supporting the schema with suitable measured latency/cost during implementation; no model availability or pricing is assumed from possession of a key.
- Bound input to approximately 600 characters and output to the small suggestion schema. Treat user text as data, not instructions. Use a short request timeout (initial target eight seconds), no automatic retry loop, request throttling/concurrency limits and cancellation/late-response guards. Do not send balance, saved IDs, personal names, the full journey or unnecessary profile fields. Provide a clear nearby notice that pressing the action sends the entered text to OpenAI; empty text or normal navigation makes no API call.
- Avoid retaining raw memories or provider responses in server logs. Request non-storage where supported; do not claim this guarantees zero provider retention. Do not persist inference to the profile until accepted. Keep schema/version/cache local to the session; no shared cache of private memories.
- Before exposing an unauthenticated paid endpoint publicly, validate effective deployment-side abuse controls and spending limits; a client-side button cooldown or process-local limiter alone is insufficient. If secure judge-accessible API hosting is not ready, retain the tested local demo feature or disable AI on the static deployment while the main journey continues to work.

### Progressive enhancement and fallback

The existing form and interest picker remain usable immediately. AI results should never gate onboarding, recommendation reveal, camera motion or saving. Missing key, timeout, no network, provider refusal, malformed output or rate limit returns a brief nonblocking status and leaves the user's existing choices intact. User edits made while a request is pending must not be overwritten by a late response. A development fixture can test the UI but must not be presented as a live AI response in the demo.

### Secondary stretch: personalised bridge narration

Only after the primary interpretation feature works, offer a short **Connect this to my story** explanation on an event preview or guided connection. Supply only the selected verified event's approved cultural notes, the already computed matched relationship and the relevant accepted memory summary. Return an event ID and approved evidence IDs with a short interpretation, never dates, price, booking URLs, availability or eligibility. Reject mismatched IDs and unsupported text; all practical facts continue to render directly from the curated data.

This can make the guided connection feel more personal, but does not change event order, create new connections or replace the existing explanation. Limit it to an explicit action and reuse the accepted result for that event in the current session. Do not call a model per animation frame, node hover or page render. Allow at most one memory interpretation plus one selected-event narration per normal demo journey, apart from deliberate user retries.

### Build-time assistance and deliberate exclusions

An LLM can help draft consistent summaries/tags from retrieved official programme text during catalogue work. Every record and tag still requires source checking; model memory is not event verification. This is optional editorial assistance, not an automated live-ingestion feature or reason to promise twenty entries instantly.

No general chat, autonomous web browsing agent, LLM ticket discovery, model-generated prices, AI music generation, live voice guide or broad AI reranking in this build. The immediate value comes from recognising what the user describes while retaining verified choices and the animated cultural narrative.

### Acceptance and time gate

Reserve up to 30 engineering minutes within the parallel work and integration slots, replacing optional collection-note/audio-variation effort rather than adding time to the deadline. Establish a working server-only request and local/deployed runtime approach early; if this remains unresolved after 15 focused minutes, stop runtime AI work and retain manual onboarding. Cut secondary narration first, then saved-intent notes and the event-replacement control if integration overruns. Preserve animated 3D, source-checked catalogue, guided actual connections and the final QA reserve.

Test varied free text, negation, ambiguous descriptions, unsupported interests, empty/oversized input and instruction-like text. Verify acceptance/edit/decline, respect for existing choices, stale-response cancellation, no request on load, offline/refusal/invalid-output/rate-limit fallbacks, server-only key handling and compiled asset inspection. Use mocked responses for repeatable regression tests and a small explicitly initiated real smoke test during implementation; record actual latency and usage rather than promise instant results. Confirm the complete journey also works with AI disabled.

Documentation basis: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) documents schema-constrained responses, refusals and remaining semantic mistakes. [OpenAI API authentication](https://developers.openai.com/api/reference/overview) requires keeping API keys out of client code and loading them server-side. These sources support the implementation approach, not claims about account access or live event truth.

## Time allocation (estimates, not guarantees)

| Minutes | Work | Checkpoint |
| --- | --- | --- |
| 0–10 | Snapshot baseline, coverage audit, motion design; check server/key setup without disclosure | Current flow runnable; API feasibility assessed without assuming validity |
| 10–55 | Animated node/path model and lifecycle; catalogue research in parallel; bounded server-only AI handler work | Silent constellation moves; source evidence collected; AI runtime feasible or cut |
| 55–80 | Guided connections/grounded previews; finish catalogue verification; AI suggestion interface within 30-minute budget | Actual bridge works; honest catalogue total; optional suggestions can be accepted/declined |
| 80–100 | Profile matrix and AI/fallback integration; controlled replacement only if time permits | Confirmed profiles yield meaningful differences; three-choice cap and manual path preserved |
| 100–110 | Audio-reactive tuning and transitions; optional narration/collection only if ahead | Sound/mute/motion controls coherent; no API dependency on normal exploration |
| 110–135 | Two visual passes; catalogue/interaction/regression/API-fallback/performance checks | Desktop/mobile, varied profiles, reduced motion, no-AI flow and credential checks |
| 135–150 | Production build, demo rehearsal/backup and submission updates | Reviewable delivery with factual tool attribution |

Work in bounded parallel streams under Develop guidance when implementation begins: spatial animation; catalogue verification/cultural content; recommendation/server-only memory interpretation. One lead owns App integration, styling, QA and documentation. Parallel time is included in the estimate, not assumed to make integration free. Catalogue research needs a real source-checking allocation; it is not assumed to be an instant bulk generation task.

At minute 80, close catalogue research and record the verified total. If moving 3D/catalogue personalisation/bridges are late, defer AI bridge narration, collection notes and then the one-event replacement control; preserve the broader source-checked catalogue, focused initial recommendations and visible animation. Runtime AI has its own feasibility/time gate and remains optional. Do not lower data standards to hit twenty. At minute 110, freeze feature additions and preserve at least 25 minutes of QA. Optional backend work must not consume that reserve.

## Neon and other optional additions

Neon is provisioned but the app does not currently use database persistence. Animation, guided bridges and collection intent do not require a new backend. If the core work finishes materially early and backend integration is explicitly selected, investigate a small server-only, read-only curated-catalogue endpoint with local fallback. Use an isolated Neon development branch and minimal additive schema; never expose credentials to Vite. Do not commit to cloud user sync without addressing identity/access, and do not invent authentication or public anonymous journey storage. Do not count provisioned infrastructure as app integration.

LLM-controlled event ranking, payment, Singpass, automated catalogue scraping, social networking and a rebuild are outside this proposed 150-minute scope. Manual source-checked catalogue expansion is core scope. Optional bounded memory interpretation and grounded narration are the only proposed runtime AI features. Neon integration remains lower priority than animated interaction, varied personalisation and a clear cultural bridge; the minimal AI proxy does not require Neon.

## Verification and delivery

- Visual inspection at 1440×900, 1280×800, 390×844 and 360×800 across landing, onboarding, constellation, list, previews and collection; two targeted refinement passes.
- Test silent node motion, attached endpoints/labels, pause/reduced motion, tab/offscreen suspension, hover/focus/click/touch, guided tour interruption, WebGL loss and audio cleanup.
- If AI ships, test suggestion acceptance/edit/decline, unsupported inference, malformed/refused/slow/offline responses, request bounds, no autoplay/no request on load, stale-response protection and the complete manual fallback. Record actual smoke-test latency/usage and verify keys are absent from frontend assets/logs.
- Test implemented save/notes/edit/unsave/reload/fresh visit/new exploration flows, legacy profiles, empty/zero-balance cases, source/booking labels and recommendations. Run the contrasting profile matrix against the expanded dataset and test initial selection versus controlled replacement; verify list/constellation share the same selected IDs.
- Run meaningful new unit/browser checks plus the existing regression suite; build and check the compiled app. Capture measured performance without claiming certification.
- Prepare a suggested two-minute narrative: remembered outing → optional memory interpretation and accepted tastes → moving universe → meaningful cultural bridge → original sound → save (with intent if implemented). Prepare a second contrasting profile to demonstrate different recommendations and an AI-disabled fallback. Record a fallback clip if supported; otherwise preserve a storyboard/screenshots and report the gap.
- Update both proposed main-track reflections and actual Codex/Mobbin/Figma/asset attribution. Main-track pair remains proposed, not submitted. Judge-accessible hosting/source and final-form award selection remain delivery dependencies; external publication is a separate authorised action.

Shared Page update remains pending because no active Pages capability is exposed. React remains the single implementation source of truth; reuse the completed Mobbin/Figma direction instead of restarting research.
