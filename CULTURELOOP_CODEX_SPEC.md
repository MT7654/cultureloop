# CULTURELOOP — CODEX BUILD SPECIFICATION

**Project:** CultureLoop  
**Event:** COMMON GROUND — One Day Creative Tech Makeathon, Singapore, 11 October 2026  
**Track:** Culture × Tech (primary); Design × Tech only if team elects to submit to both  
**Status:** Product direction chosen; implementation, validation, visuals, and real event availability unverified until completed  
**Owner:** Participant team (names to be added; do not invent)  
**Document purpose:** Source-of-truth product and implementation brief for the Codex agent working in the same directory as the provided Common Ground workshop kit.

## 0. Operating instructions for Codex — read first

You are the lead product designer, creative technologist, and front-end engineer. Build **one polished, working CultureLoop prototype** within the constraints of a one-day makeathon. The user has already decided on the idea and stack. Do not restart open-ended ideation. Read this document in full, inspect the workspace and follow the workshop kit's `AGENTS.md` and stage-specific skills. This brief supplies pre-decided context, not permission to disregard the kit's meaningful review checkpoints.

**Kit files:** `AGENTS.md`, `START-HERE.md`, `.agents/skills/{start,develop,design,submit}/SKILL.md`, `.agents/skills/start/references/prd-outline.md`, `.agents/skills/start/references/mobbin-research.md`, `.agents/skills/submit/references/submission-template.md`, and `PROJECT-KNOWLEDGE.md`.

**IMPORTANT PRE-EXISTING DATA WARNING:** The distributed ZIP's `PROJECT-KNOWLEDGE.md` is unexpectedly populated with an unrelated **couples care-reminder / iPhone widget** project and an unrelated Codex Page link. These are NOT CultureLoop requirements and MUST NOT be used or edited as if they belong to this project. Before starting, preserve a copy in `docs/archive/unrelated-project-knowledge-original.md`, replace the *active* `PROJECT-KNOWLEDGE.md` with a truthful CultureLoop summary, and do not fetch, edit or use the unrelated project Page. Preserve the other kit instructions unchanged. Do not invent an existing CultureLoop Page; create or select one only through a supported actual Pages tool. If Pages access is unavailable, keep local documents current and explicitly record Page updates as pending.

**VISUAL QUALITY DIRECTIVE (non-negotiable):** The team explicitly wants a standout, visually captivating result. Treat Mobbin research and a Figma visual exploration as required design efforts **when their integrations are accessible**, not optional afterthoughts. Build one arresting first-10-seconds hook, a signature animated discovery moment, and a satisfying personal-recommendation reveal. Assess aesthetics using screenshots and actual browser interaction, not merely a successful build. If an integration is blocked, document the attempt and meet the same visual acceptance criteria with Codex-native design and browser review. See Section 8A and Section 9.

**Stage routing:** `Start` formalises the agreed framing and PRD, including real Mobbin references when available; `Develop` builds a greybox and checks actual user flow; `Design` applies an agreed aesthetic using Figma/Mobbin references; `Submit` drafts the final entry from what exists. Follow kit handoffs and team review gates. Do not automatically publish, change sharing, spend money, install unapproved paid software, or submit externally. For a one-day event, avoid lengthy repeat interviews: this brief contains the selected concept, persona, context, flow proposal, creative direction and scope. Ask only material questions that block implementation or are explicitly required for approving a major change. Minor engineering details are yours to decide.

**Source of truth:** Local `CULTURELOOP_CODEX_SPEC.md` (this file) for intended scope, actual current code for what is implemented, `PROJECT-KNOWLEDGE.md` for status, and the latest team-approved CultureLoop Page when one exists. Never claim planned functionality is implemented. Record source links and real tool/model use, not proposed use.

**Deliverable:** Working responsive React web app, verified sample event catalogue, tests, README, deployed demo when authorised and technically possible, source repository when authorised, and a completed submission draft through the kit's Submit stage.

## 1. North star

**One-liner:** CultureLoop helps Singaporeans turn a one-off SG Culture Pass redemption into their next meaningful local cultural experience by connecting what they already love to something unexpected.

**Short tagline:** *Don't let the experience end there.*

**The human story:** A Singaporean used **S$55 of the S$100 Culture Pass for a date**, enjoyed the occasion, and has left **S$45** unused for roughly a year. That user story is the emotional starting point, not a claim about all Singaporeans.

**Problem hypothesis:** After redeeming credits once, some people do not return because they have no obvious next occasion, cannot easily see how eligible events connect to their own interests, or lack confidence that an unfamiliar cultural activity will be worth their time and money. Existing discovery portals can filter events; CultureLoop should instead **bridge a personal memory to a next experience**, and help users imagine that experience. This hypothesis comes from anecdotal experience and qualitative discussion, NOT representative causal research.

**Cultural intent:** Do not reduce culture to voucher optimisation. Connect contemporary preferences (music, games, films, theatre, date ideas) to Singapore's artists, stories, places and artistic practices. Encourage curiosity, not a spending race. Make thoughtful local arts participation more approachable.

**Hero promise:** "Tell us what you liked last time. We'll show you why your next local cultural experience might surprise you."

**Demo outcome:** A user who has S$45 left, previously attended a musical on a date, and likes indie music and storytelling receives three culturally credible event recommendations, including at least one **taste bridge** into a less-familiar category, explores an immersive interpretive preview, saves an event, and sees it recorded as the next chapter in their CultureLoop journey.

## 2. Audience, context and job to be done

**Primary provisional user:** Singapore Citizen adult with SG Culture Pass credits remaining, who has already redeemed some for a one-off outing. Digitally comfortable, browsing on a phone in spare time, potentially choosing an activity for a date, friends or solo. Do not infer motivations from age, nationality, or demographics; this is a designed persona to validate.

**Secondary (not separate MVP flow):** Someone who has unused credits and wants a first activity. Allow a graceful "I haven't attended anything yet" route without designing a separate onboarding system.

**JTBD:** "When I think about my unused Culture Pass credits, help me find a local experience that connects with what I already enjoy, so I can confidently choose a next outing without having to research unfamiliar cultural events from scratch."

**Triggers:** Remembering unused balance; planning a date/weekend; feeling curious after an event; seeing a friend's recommendation.

**Desired feelings:** Recognised → curious → pleasantly surprised → confident → ready to act.

**Research caveat:** Interview feedback, browsing data and potential conversion rates should be labelled as hypotheses or observations until actually measured.

## 3. Product principles and differentiator

1. **Memory before marketplace:** Start from the previous experience, not a generic search box.
2. **Bridge, don't box in:** Include familiar matches AND one adjacent cultural discovery that can be explained.
3. **Show why:** Every recommendation answers "Because you enjoyed X, you might appreciate Y..." with a culturally substantive reason, not a generic similarity claim.
4. **Experience before ticket:** Offer one playful interpretive audio/visual preview. The visualiser is an artistic introduction, not actual event footage or audio unless licensed and verified.
5. **Respect time and budget:** Show remaining credits and possible top-up clearly; never pressure users to exhaust credits.
6. **Curated and truthful:** Ground real-world listings in the official SG Culture Pass website; distinguish estimates, verification dates, and unknown ticket availability.
7. **Not official government service:** CultureLoop is an independent makeathon concept. No government logos, impersonation, Singpass authentication or imitation checkout.
8. **Accessible and forgiving:** Clear text, keyboard support, mute/reduced-motion options, no mandatory personal information.

**Core interaction signature:** A visual **Culture Constellation** bridges the user's previous outing and selected tastes to three recommended events. Tapping a path reveals a short explanation; opening a recommendation enters a **Feel It** interpretive preview. Underneath, normal accessible text cards remain fully usable.

## 4. Scope and priorities

### Must ship (P0)

- Mobile-first landing/re-entry screen with clear independent-project disclaimer.
- Manual S$0–S$100 remaining-credit entry, seeded to S$45 for demo; optionally enter amount spent (default S$55), show accurate simple balance display. Never connect to Singpass/GovWallet.
- Past outing selection: category, optional name, sentiment (loved / okay / not for me), favourite aspect (music / story / people / creativity / place), and context (date / friends / solo / family). Support "skip / first-time user".
- Short interest picker: music genres and at least three non-music interests; outing context and when available are optional.
- Deterministic recommendation algorithm over a **small curated real event catalogue** (target 8–12 verified entries, or fewer rather than invented ones).
- Results page with **three personalised cards**, at least one appropriately explained adjacent/taste-bridge option when eligible entries permit it; visible price, available event date range, match reasons, official event link, source/verification notice, and a budget estimate.
- One interactive Culture Constellation or equivalent explanatory discovery visual, accessible alternative supplied.
- One **Feel It** sound/visual experience that works without external APIs; label as an artistic/interpretive preview, not an official sample. Mute and reduced-motion support.
- Save/unsave event and a lightweight **My Loop** saved-next-experience state via localStorage. Changes remain after refresh.
- Graceful empty states: no affordable events, missing data, no events remaining in date range, localStorage unavailable.
- Working links to official event detail / authorised ticketing flow; **never process payment**.
- Deployed demo if user authorises deployment, repo instructions, and evidence of checks.


### Should ship (P1, if time permits)

- A small post-experience reflection action ("I went" → rating / what I liked → new recommendations) to demonstrate the repeat-engagement loop, manually simulated by the user (not automatic ticket verification).
- One-click demo persona ("S$45 left after a date") for judges.
- User-friendly filters (within my credits / date range / occasion).
- Simple traceable recommendation explanations and an "Explore something different" toggle.
- Focused Figma prototype / screenshot documentation.

### Could ship (P2)

- Simple shareable recommendation card (copy link or text, using standard browser APIs).
- Three alternate sonic themes made with Web Audio synthesis.
- Small tests of recommendation relevance with consenting testers.

### Explicitly out of scope (Won't today)

- Real-time balance sync; Singpass/GovWallet integration; claiming vouchers; payments; ticket inventory or seat booking.
- Crawling protected sites, bypassing anti-bot controls or scraping authenticated content.
- User accounts, backend database, emails/push reminders, notifications scheduler, social matching, maps/routing.
- Unverified live prices, made-up event availability, false redemption completion, or guaranteed savings.
- Full AI agent architecture, paid model APIs, music licensing complexity, multi-language support as a hard requirement.
- Generating actual copyrighted tracks or audio that purports to be a performance recording.

## 5. UX information architecture and detailed flows

### Primary flow: "One experience → the next"

**S0 — Landing / Re-entry**

- Large editorial statement: "Your last cultural experience shouldn't be your last."
- Supporting line: "S$45 left? Let's find your next chapter." (only when demo persona is active; otherwise generic).
- CTA: `Find my next experience`.
- Secondary CTA: `Try the S$45 demo` (pre-fills manual values, clearly labelled demo).
- Mini non-official badge: `Independent makeathon prototype · Not affiliated with SG Culture Pass`.
- If local progress exists, show `Continue my CultureLoop` plus `Start fresh`.

**S1 — Your last chapter**

- Budget input: remaining credits `0–100` (numeric, accessible, step S$1), default S$45 in demo mode; regular first visit may prefill S$100 or blank with explanation.
- Previous activity question: "What did you do with your Culture Pass last time?" Select `Musical / Live music / Theatre / Exhibition / Workshop / Heritage tour / Other / Haven't used it yet`.
- Optional activity title field; optional personal note (store locally only).
- "Who did you go with?" `A date / Friends / Family / On my own`.
- "What stayed with you?" choose up to two: `The music`, `The story`, `The atmosphere`, `Making something`, `Learning something`, `Spending time together`.
- Sentiment `Loved it / It was okay / Not my thing`.
- CTA `Next: what moves you` and `Skip this`.
- Validation: balance 0–100; typed text constrained; empty optional fields accepted.

**S2 — Your cultural DNA**

- Visually selectable taste chips with accessible labels and selected states. Examples: `Mandopop`, `Indie & alternative`, `Jazz`, `Electronic`, `Orchestral`, `Musicals`, `Film & storytelling`, `Gaming`, `Visual arts`, `Hands-on making`, `History & heritage`, `Literature`.
- Choose up to five, minimum one OR offer `Surprise me`.
- Visit context: `Date night / Friends / Solo / Family outing / Flexible`.
- Time preference: `Any time / Weekday evening / Weekend` (informational if event timing only dates).
- CTA `Reveal my CultureLoop`; clear back navigation.

**S3 — Discovery / Culture Constellation**

- Intro line customised to prior category and interest: e.g. "You came for a musical. Your next chapter might sound different."
- Show a constellation/orbit with the previous outing memory + 2 selected tastes as input nodes and 3 recommendation nodes. Use lines as visual affordance, not data-science decoration. Selectable nodes highlight the source → recommendation connection, show an explanation. Provide same functionality in text card list.
- Three results: ideally `Familiar`, `A little different`, `Unexpected connection`, with a transparent reason and NO invented categorical superiority or personalisation accuracy percentage.
- Each card has title, one-line descriptor, category, date, price `From S$X` when known, verified as-of date, and `Why this fits you` two-line explanation. Show `Within your remaining credits` or `Estimated top-up from S$X for one ticket` as relevant, with a fees caveat.
- CTA `Feel this experience` or `Explore event`.
- If no eligible results fit budget, show near-budget options and clear top-up instead of empty blank; if insufficient catalogue, show fewer than three and honest message.
- Explicit `Eligibility and availability may change. Confirm on the official site.`

**S4 — Feel It / Event detail**

- Header: real event name, accurate date/location, price where known, creator/organisation if verified, source link.
- Primary interactive hero: a lightweight Web Audio + Canvas/SVG **interpretive soundscape** that conveys mood/cultural connection, not official event media. Label prominently `Creative interpretation — not actual event audio`.
- Interaction: tap `Play the connection` (audio only starts after user gesture), select `Your taste` and `Try a new sound` modes. Animate wave/particle/line intensity with audio; respect `prefers-reduced-motion` and Pause/Mute controls. Provide a static illustrative alternative if audio unavailable.
- Explanation: `Your bridge` — one substantive sentence connecting earlier event / selected interest to this event's cultural form, using editorially written mappings from vetted metadata.
- Buttons: `Save to My Loop`, `See official event listing` (external, opens safely), `Back to matches`.
- Avoid false booking CTAs like `Redeem now` unless it clearly leads to official redemption pathway.

**S5 — My Loop / Return loop**

- Journey ribbon: `Previously explored → Curious about → Saved for next`.
- Saved cards persist after refresh; `Remove` action, empty state, `Find another experience`.
- Optional P1 `I attended this` is explicitly self-reported; if selected, request reflection and update future recommendation preferences, demonstrating repeat engagement, not verified attendance.
- CTA `Keep the loop going` back to discovery.

**Essential recovery:** Browser refresh restores state; reset requires confirmation (avoid accidental erasure); external event links open in new tab with appropriate `rel` attributes; user can navigate back without losing selections.

### Demo script (90–120 seconds)

1. "I used S$55 on a date and did not come back; S$45 remains."
2. Open `Try the S$45 demo`. Show `Musical`, `Date`, `The music` + `Story`.
3. Choose `Indie & alternative`, `Live music`, `Film & storytelling` (or mapped UI equivalents), `Date night`.
4. Reveal constellation: highlight a familiar recommendation and a surprising cultural bridge with a convincing `why` explanation.
5. Open the surprising recommendation; play the interpretive sonic preview, visibly labelled.
6. Save it; show `My Loop` and the official listing button.
7. Conclude: "The goal isn't just to spend credits. It's to create the next reason to experience local culture."

## 6. Recommendation engine — explicit MVP algorithm

**Approach:** Transparent deterministic local scoring; **no runtime LLM required**. This is a design-led cultural bridge, not opaque AI profiling. Use verified event metadata plus a small manually authored bridge dictionary. Document weights so explanations can be audited.

**Event eligibility filter (first):** `status=verified_eligible`, link works to official listing, event end date on/after today in Singapore time, and basic metadata not missing. Do not assert tickets are available simply because the event is upcoming. If user sets an event date preference, filter based on reliable occurrence data, not guesses.

**Candidate score (0–100):**

- Interest overlap — 0–30 pts (based on curated event tags and user tastes).
- Past-experience affinity — 0–15 pts (positive affinity if previously loved related form; penalise repeated category if not enjoyed).
- Occasion alignment — 0–15 pts (date/friends/solo/family editorially reviewed fit labels; do not assign stereotypes).
- Budget compatibility — 0–15 pts (full points if known starting price is within remaining credits, partial if top-up; unknown price gets neutral uncertainty with clear display).
- Intentional cultural bridge — 0–15 pts (editorial mapping from familiar taste to adjacent local form with a valid substantive explanation).
- Date/freshness — 0–10 pts (upcoming soon with a verified date, not artificial urgency).

Total max 100. Normalise missing factors transparently or assign neutral values; do not report scores as scientific probability. No fictional `98% match` labels. Ranking should be stable for a fixed input and seeded data. Add mild diversity constraint: choose at least one same-category or close match and one adjacent-category bridge when possible, avoiding duplicate categories if the catalogue supports alternatives. For `Surprise me`, prioritise bridges and diversity. For `Not my thing` prior category, avoid recommending near-identical experiences unless user explicitly selects that interest again.

**Recommendation explanation generator:** Prefer curated templates based on actual features, e.g. `You liked the live storytelling of a musical. [Event] brings performance and Singapore narratives together in a different format.` Explanations must identify an actual event attribute; if data cannot support explanation, fall back to neutral `Based on your interest in [tag]` and mark the bridge as unverified. Do NOT hallucinate performers, sound samples, theme, venue or cultural history.

**Budget calculations:** A manually entered balance is an *estimate*. For one standard-priced ticket: `estimatedCreditApplied = min(userBalance, confirmedStartingPrice)`; `estimatedCashTopUp = max(confirmedStartingPrice - userBalance, 0)`. Show **"from"** and note possible fees, price tiers, and eligibility restrictions. Never deduct the balance on `Save`, `Open official listing`, or self-reported attendance. If multiple tickets, do not imply price/credits per party without implementing quantity explicitly. The official government redemption and ticketing partners handle real payment. With `price=null`, show `See price on official site`, not `$0`.


**Unit tests:** full budget match, required top-up, unknown price, expired event filter, unverified event filter, zero remaining balance, no preferences, prior disliked category, diversity selection, stable ranking, XSS-safe user notes, and no-false-availability text.

## 7. Real-event data, trust, legality

### Authoritative sources

- Official discovery portal: <https://www.sgculturepass.gov.sg/> ; eligible entries are listed here.
- Government scheme information: <https://www.mccy.gov.sg/sectors/arts-and-heritage/sg-culture-pass/>
- Credit validity: <https://ask.gov.sg/sgculturepass/questions/cmf2ca6bu0197yp9irzfsoaf1> (through 31 December 2028).
- GovTech redemption steps: <https://www.tech.gov.sg/technews/how-to-use-your-sg-culture-pass-credits-in-singapore/>

**Current policy context as of 11 Oct 2026:** S$100 credits went to eligible Singapore Citizens aged 18+ in 2025; credits can offset authorised eligible local arts/heritage programme tickets (and eligible Sing Lit purchases through participating bookstores); expiry 31 December 2028. The official site supports discovering experiences and redirects payment to authorised partners. Verify important operational details while building; rules may change.

**No official public event API is assumed.** For the MVP, manually curate a tiny catalogue. If browsing is available, visit current official listing pages; record `sourceUrl`, `verifiedAt` and `eligibilityStatus`. If access fails, use clearly labelled demo-only event records, never claim real eligibility, and keep official listing button as `Browse official SG Culture Pass site`. Do not present sample entries as real. No high-volume scraping, site security circumvention, auth extraction, or API key exposure.

### Suggested candidate listings to verify fresh before inclusion

- `Fat Kids Are Harder To Kidnap 2026` — currently displayed on official site in October 2026.
- `[OMM Presents] Black Myth: Wukong Global Concert` — currently displayed on official site in October 2026.
- `Musica Intimae: The Anatomy of Goodbye` — currently displayed on official site in October 2026.  
  These are **discovery leads only**; dates, price tiers, eligibility, live links and availability MUST be rechecked before using them as verified records. Do not blindly copy this brief into JSON as current truth.

### Minimal typed model

```ts
type VerificationStatus = 'verified_eligible' | 'unverified_demo' | 'expired';
type Occasion = 'date' | 'friends' | 'family' | 'solo' | 'flexible';
type Category = 'music' | 'theatre' | 'heritage' | 'visual-arts' | 'workshop' | 'film' | 'literature' | 'other';

interface CultureEvent {
  id: string;
  title: string;
  organiser?: string;
  category: Category;
  tags: string[];
  culturalNotes: string[];        // editorially verified claims only
  bridgeFromTags: string[];       // curated links from popular tastes
  occasions: Occasion[];
  location?: string;
  startDate?: string;             // ISO YYYY-MM-DD, Singapore local
  endDate?: string;
  startingPriceSGD: number | null;
  officialListingUrl: string;
  verifiedAt: string | null;      // ISO datetime; never pretend live inventory
  verificationStatus: VerificationStatus;
  imageUrl?: string;             // only licensed/authorised assets
  imageCredit?: string;
  actualAudioUrl?: string;       // only when explicitly licensed; none required
}

interface CultureProfile {
  balanceSGD: number;
  previousCategory?: Category;
  previousTitle?: string;
  previousSentiment?: 'loved' | 'okay' | 'not-for-me';
  previousHighlights: string[];
  previousOccasion?: Occasion;
  interests: string[];
  nextOccasion: Occasion;
  timingPreference?: 'any' | 'weekday-evening' | 'weekend';
  savedEventIds: string[];
  selfReportedAttendance: string[];
}
```

**Content safeguards:** Do not reuse event photos from copyrighted sites without permission. Prefer official event images only if use is clearly permitted; otherwise build attractive original geometric/artwork-style editorial cards without pretending to depict actual event performers. Properly credit any permitted images and audio. Avoid photos of identifiable people without rights. Do not use government crests/logos or misrepresent affiliation. Keep raw names and price data attributed to source pages.

## 8. Visual design system / creative direction

**Overall aesthetic:** `Singapore after dark meets independent cultural zine`. Contemporary, inviting, rhythmic, experimental and warm. Not a corporate dashboard, government grant portal or another shopping catalogue. Design-led, but content and navigation must remain legible.

**Mood references as *analogies* (do not copy):** Spotify's taste entry/music emphasis; Airbnb Experiences' confidence-building details; modern art-museum microsites' exhibition-like movement; experimental sound visualisers; editorial Singapore cultural posters. Validate observed patterns using actual Mobbin results; these analogies are not claims of prior Mobbin research.

**Proposed palette (starting point, refine for accessibility):**

- `ink`: `#0D1324` deep midnight navy
- `paper`: `#F7F2E9` warm cream
- `electric`: `#52E1DD` mint/cyan highlight
- `coral`: `#FF7A73` warm accent
- `gold`: `#E8B85F` supporting accent
- `muted`: `#A9B4C7` secondary text on dark backgrounds

Avoid low-contrast coral or mint for small text. Text contrast target WCAG AA 4.5:1 for normal text; large text 3:1; visible keyboard focus. Prefer large display headlines, a readable sans font for body, consistent 8px spacing, mobile touch targets ~44px, and generous content spacing. Use trustworthy local Singaporean imagery only with rights or creative abstract art.

**Signature visuals:** A constellation/orbit of taste nodes; connecting curved lines respond to selection; event cards as collectable "chapters" or cultural passport stamps; a translucent sonic ripple for the preview. Motion should be purposeful, not a continuous distracting particle storm.

**Breakpoints:** 360px, 390px, 768px, 1280px desktop. Smartphone portrait is primary; desktop judges should see a designed composition with no stretched cards or empty void. Bottom sticky mobile actions where useful.

**Interaction behaviour:** keyboard accessible interests and constellations, `aria-live` for recommendation updates, clear selected states not colour alone, reduced-motion safe, captions/instructions for audio, large controls, muted initial audio, progress states and gentle transitions under ~400ms.

**Brand voice:** Singaporean without forcing Singlish; friendly, curious, culturally respectful, never preachy. Avoid copy like "Hurry or waste your credits". Example: `Because you loved the story, not just the stage.` / `Here's a different way to feel it.` / `Your next chapter can start anywhere.`

## 8A. Mandatory creative direction, motion choreography, and visual QA

### Make people care within the first 10 seconds

This is a **creative technology experience**, not an event booking dashboard. The visual benchmark is a polished contemporary music/arts microsite that feels intentionally art-directed, emotionally resonant and delightful to explore. The audience should understand both the problem and the product's personality almost immediately.

**Opening hook (working creative):** Start with an editorial, high-contrast composition reading **`S$55 experienced. S$45 forgotten.`** (demo persona only), supported by a beautiful abstract cultural poster or sonic waveform treatment. Animate an understated S$45 balance line into a branching visual pathway. Follow with **`What if your next favourite thing is something you haven't tried?`** and one unmistakable primary CTA: **`Find my next chapter`**. The hook should feel welcoming and non-guilt-inducing; don't imply the user's balance is known until they enter it or select the demo persona. Make the first screen effective even with all animations disabled.

**Visual principles (must implement):**

1. **Editorial, not template-like:** deliberate typographic scale, striking layouts, disciplined whitespace, event storytelling and original compositions; avoid stock SaaS dashboard cards and repetitive gradients.
2. **Rhythm and reveal:** create a perceptible progression: *forgotten balance → recognised taste → surprising connection → emotionally appealing preview → next chapter saved*.
3. **Surprise with clarity:** at least one tasteful, non-obvious visual transition that expresses how a familiar interest leads to unfamiliar culture; don't trade navigability for art direction.
4. **Sensory without coercion:** optional, gesture-initiated sound; motion should communicate selection, relationship and progress. No autoplay audio, flashing or perpetual high-energy particle storms.
5. **True cultural texture:** write meaningful event-specific copy and use licensed/reusable assets, credited real images where permitted, or original abstract graphics. No fake artists/event footage presented as real.

### Motion design brief — specify and implement intentionally

- **Hero entrance:** short staggered reveal of headline, balance motif and CTA (approximately 450–700ms total); no blocking intro, skipable by interaction, reduced-motion fallback instant.
- **Taste selection:** immediate responsive selection state, subtle scale/colour transition (120–220ms); the next screen should incorporate selected preferences visually.
- **Culture Constellation:** selected interest acts as an anchor; recommended event nodes appear with stagger (roughly 70–120ms apart). Connecting lines draw or fade into view (350–650ms). Focus/hover/tap illuminates one meaningful link and reveals a plain-language cultural bridge. Text/card list remains the accessible primary fallback.
- **Recommendation reveal:** personal match explanation arrives with each recommendation; elegantly animate a bounded card reveal (250–450ms). Avoid arbitrary percentages or fake AI 'thinking' animations.
- **Feel It preview:** motion-reactive abstract graphics tied to locally synthesised sound OR a manually choreographed silent sequence. Sound starts only on a play gesture; pause, mute and replay work. Clearly label this as an *artistic interpretation*, not real performance audio.
- **Save-to-My-Loop:** satisfying micro-celebration (one ripple, stamp or chapter card move; <500ms), without confetti overload; display an actionable saved state.
- **Transitions:** use transform/opacity in preference to expensive layout animation; aim for smooth playback on mid-range mobile, no forced page-long scroll-jacking, no excessive blurs; honour `prefers-reduced-motion` globally.


### Design deliverables and evidence gates

**Gate D0 — Inspiration board:** During Start, use Mobbin search results to inspect at least **three actual relevant screens/flows**, ideally one interest-onboarding, one editorial discovery/recommendation, and one media/detail experience. For each record exact product/flow name, URL or retrievable reference, 2 useful interaction details, and **one thing deliberately *not* to copy**. Don't claim a reference was reviewed unless the tool returned it. Save to `docs/design-references.md`.

**Gate D1 — Two art directions:** During early Design exploration (can overlap with development), create **two distinct Figma Make explorations** or Figma frames if tool access allows: A) *After-Dark Editorial* (ink/cream, typographic posters, coral/mint accents) and B) *Sonic Playground* (energetic layered music-inspired graphics, responsive sound motifs). Compare against four criteria: first-impression hook, cultural warmth, legibility, ability to implement within available time. Pick one direction and record why in `docs/design-decisions.md`. If Figma cannot connect, make the two directions as small coded static samples and compare browser screenshots.

**Gate D2 — First viewport review:** Implement the landing hero and one recommendation detail scene **before styling the entire app**. Capture actual screenshots at 390px mobile and 1280px desktop via Playwright/browser tool, inspect for typography, composition, colour balance, CTA visibility and no clipping. Revise at least once based on observed defects, not just vibes.

**Gate D3 — Signature interaction review:** Test the Constellation and Feel It experience in a real browser. Verify that connecting interest to event is comprehensible without narration, and that motion adds meaning. Exercise keyboard focus, reduced motion and sound-off. Fix major awkward transitions before adding extra features.

**Gate D4 — Final visual walkthrough:** Capture the 5 core moments (hero, tastes, constellation, recommendation detail, saved chapter) in mobile screenshots plus at least a desktop hero. Critique side-by-side for coherence, image quality, spacing, typography and consistency. Fix at least the **top three visible defects**, then run existing functionality tests again. Add screenshots to `docs/visual-qa/` and record actual outcomes in `docs/design-decisions.md`. Do not state visual approval or tests passed unless verified.

**Scope trade-off rule:** If running behind, reduce optional feature breadth, catalogue size (within truthful-source limits), and secondary microinteractions **before** sacrificing quality of the opening, main discovery reveal, accessibility, or functional loop. Avoid endless aesthetics research; after a bounded reference pass, build and inspect. No visual-reference tool output should become a demand to clone protected layouts or assets.

## 9. Exact role of Codex, Mobbin and Figma

### Codex — SINGLE code source of truth

- Owns architecture, typed data, recommendation rules, component implementation, browser tests, lint/typecheck/build, README, Git, final demo.
- Use React + TypeScript + Vite, Tailwind CSS, `motion`/Motion for lightweight animation only if needed, built-in Web Audio API + SVG/Canvas, Vitest + React Testing Library, and Playwright where usable. Vercel static deployment is preferred; no backend.
- Keep source code in `app/` to protect the supplied kit at project root, unless a working repo already exists. Do not overwrite the kit's skill files.
- No paid runtime AI model calls. Codex used during development is credited in submission, while app personalisation remains local and rule-based.

### Mobbin Pro — grounded research, not a component generator

- As mandatory visual research during kit `Start`, inspect **actual** relevant flows/screens for (a) taste-preference onboarding, (b) discovery/recommendation explanation, (c) bookmark/save or experience-detail flows. Search and inspect two or three strong sources; save names, actual deep links, and observations in `docs/design-references.md` and project knowledge. Suggested searches: `Spotify choose music genres onboarding`, `Airbnb experiences discovery event detail`, `save event collection recommendations onboarding`.
- Use installed official Mobbin skills and the selected Mobbin connection per `.agents/skills/start/references/mobbin-research.md`. No fabricated links or screenshots. If unavailable, label research pending and proceed with original design decisions; do not claim Mobbin influenced a screen without actual inspection.
- During kit `Design`, apply Mobbin redesign-screen in **bounded screen-level passes**, starting with Discovery, then onboarding or event detail. Preserve already functional interactions. Research patterns, don't reproduce competitors' screens pixel-for-pixel.

### Figma Make + Figma MCP — design assistance, not a second product

- Use Figma Make for **two contrasted, focused aesthetic explorations** (see D1), covering landing/Discovery + event detail; choose one design direction and implement it, using this brief and verified Mobbin patterns. Optionally create a simple design system and responsive screen frames in a Figma Design file; use Figma MCP if connected to read/edit those designs.
- Keep actual build running in `app/`. Figma Make output is reference/experimental unless team explicitly decides to use that code as a base. Do not maintain two conflicting apps. If importing Make-generated code, review dependencies/accessibility/licensing and integrate deliberately.
- Figma Make supports downloading code and one-way push to a Figma-created GitHub repo; **do not assume two-way sync** to your Codex repository. Treat Codex `app/` as canonical after integration. Confirm current tool capabilities before claiming generated artefacts exist.
- Record Figma Make / Figma Design URLs only if actually created, and mark which screen is designed vs implemented. No need to block build if Figma connection fails.

### Workflow checkpoints to respect

- **Start:** Team already chose this idea; create concise PRD, make meaning and target audience explicit, inspect Mobbin, confirm major flow, record approved Page if available. Preserve actual team decisions.
- **Develop:** Build greybox: S1 → S2 → S3 → S4 → S5 with real state changes and event data; run it; present user testing route; implement feedback.
- **Design:** Apply agreed aesthetic to first sample, then remaining screens, keeping functional behaviour. Use Figma/Mobbin references as available.
- **Submit:** Draft kit's seven sections using actual implemented features, project URL/repo link if created, real team names only if supplied, and all AI/resource attribution.

## 10. Suggested architecture and directory tree

```text
common-ground-kit/
├── AGENTS.md
├── START-HERE.md
├── PROJECT-KNOWLEDGE.md                 # replace unrelated starter content
├── CULTURELOOP_CODEX_SPEC.md            # this specification
├── .agents/skills/                      # supplied kit, do not overwrite
├── docs/
│   ├── archive/unrelated-project-knowledge-original.md
│   ├── cultureloop-prd.md               # local mirror if Pages unavailable
│   ├── design-references.md             # only real Mobbin/Figma reference links
│   ├── research-and-assumptions.md
│   ├── data-provenance.md               # verification, source URLs, assets
│   ├── test-notes.md
│   └── submission-draft.md              # generated only when Submit requested
└── app/
    ├── package.json
    ├── index.html
    ├── public/assets/
    ├── src/
    │   ├── app/App.tsx
    │   ├── components/{Layout,Progress,EventCard,Constellation,AudioPreview,...}
    │   ├── screens/{Welcome,LastChapter,CulturalDNA,Discover,Experience,MyLoop}.tsx
    │   ├── data/events.ts or events.json
    │   ├── domain/{types,recommend,bridge,budget}.ts
    │   ├── hooks/{useCultureProfile,useReducedMotion}.ts
    │   ├── styles/globals.css
    │   └── test/{recommend,budget,flows}.test.ts(x)
    ├── README.md
    └── ...configs
```

No need for React Router if local-screen state and history are simpler; implement browser back expectations cleanly. Prefer clear boundaries between data, scoring, and visual presentation. Keep fixtures small and understandable.

**State:** `localStorage` key namespaced and versioned, e.g. `cultureloop:v1`; hydrate safely, validate schema before use, catch quota/security errors; graceful in-memory fallback. Do not persist sensitive identifiers. No analytics tracking without consent and clear purpose.

**Formatting:** Singapore currency via `Intl.NumberFormat('en-SG',{style:'currency',currency:'SGD'})`; Singapore dates/tz `Asia/Singapore`; no fabricated live availability.

## 11. Exact acceptance criteria / definition of done

**Core user value**

- [ ] On phone and desktop, a new user can start and complete the flow S0 → S1 → S2 → S3 → S4 → S5 without developer intervention.
- [ ] The S$45 demo persona starts with previous S$55 date outing; no actual government account connection is claimed.
- [ ] Changing balance/preferences changes recommendation order or affordability messages deterministically and sensibly.
- [ ] At least one result presents a truthful, explained link between a familiar interest and a new cultural category, when catalogue supports it.
- [ ] Three results appear when at least three verifiable candidates exist; if not, UI handles fewer honestly.
- [ ] Each real recommendation is backed by an accessible official source and verification date; no invented metadata or false availability.
- [ ] Users can open a detail view, initiate/stop a sonic interpretation, save an event, refresh, and still see saved items.
- [ ] An official event listing link opens safely; no site claims to redeem credits in-app.

**Design + access**

- [ ] Every interaction usable via keyboard; meaningful focus styles, labels, contrast, hover/touch states.
- [ ] Audio OFF by default; play requires gesture; Pause/Mute work; non-audio static alternative present.
- [ ] `prefers-reduced-motion` reduces the constellation/audio visualiser safely.
- [ ] No horizontal overflow at 360px; desktop experience remains coherent.
- [ ] No misleading official branding, stock event imagery presented as actual performances, or false AI features.


**Engineering + trust**

- [ ] `npm install`, `npm run dev`, `npm run build`, and `npm run test` work from documented `app/` directory.
- [ ] Unit tests cover eligibility filtering, affordability, ranking/bridge logic, persistence and edge cases; report actual pass counts.
- [ ] Manual browser E2E tests cover default, blank/no-match, back navigation, narrow phone, and desktop.
- [ ] External links and events are verified or visibly unverified; all asset origins credited.
- [ ] README explains project concept, setup, demo path, provenance, limitations, and test commands.
- [ ] `PROJECT-KNOWLEDGE.md` explicitly differentiates **proposed, built, tested, and pending**; unrelated source content archived.
- [ ] Final links (repo, deployment, Figma/Page) included only after existence/access verified.

**Stretch validation, not required for code completion:** Ask 3–5 volunteers, after consent, whether they discovered an appealing eligible event they would not otherwise have considered. Record what they actually said. Do not claim increased Culture Pass redemption or repeat attendance without longitudinal data.

## 12. Failure handling and scope cuts

**If official event detail verification takes too long:** Use 3–5 clearly source-linked verified events rather than fabricate 12. Place additional fictional fixtures only in an explicitly labelled preview sandbox, never intermixed with verified recommendations.

**If Figma/Mobbin access fails:** Make a genuine connection attempt and record the blocker. Still complete D1–D4 using coded design alternatives and browser screenshots; tools can be unavailable but visual QA must not be skipped.

**If Pages is unavailable:** Maintain `docs/cultureloop-prd.md` plus active `PROJECT-KNOWLEDGE.md`, and record pending Page sync in both. Never treat a local document as an actual Page save.

**If audio is difficult:** Ship an accessible, high-quality static/animated SVG mood piece with optional synthesis. Never block the main recommendation journey for effects.

**If time is short (cut in order):** P2 sharing → additional sound themes → extra filters → self-reported attendance → *secondary* constellation microdetails. Preserve truthful event data, the core flow, match explanations, save persistence, the compelling hero, one polished culture-bridge reveal, a minimal interpretive preview, and actual visual QA.

**If no deployment permissions:** Deliver a verified local run (`npm run dev`), build artefacts, README, and clear instructions; do not claim a live deployment.

## 13. Submission expectations (use supplied kit's actual template)

The kit's `submit/references/submission-template.md` requires **seven sections**: (1) Team Details, (2) Project Overview (maximum **100 words across entire section**), (3) The Build (maximum **100 words across entire section**), (4) Project Links & Demo, (5) Track-Specific Reflection, (6) Team & Collaboration, (7) AI & Tool Attribution. The template allows **up to two** of the listed tracks: Design × Tech, Culture × Tech, Best Use of Tech, Common Ground Award. Verify organisers' actual submission UI before assuming options changed. A GitHub/source link is required unless project is not code based. Links must really work and be judge-accessible. Submit prepares a draft only; never auto-send.

**Pitch spine:** `S$55 spent → S$45 forgotten → a reason to care → cultural bridge → immersive experience → saved next chapter`. Do not overclaim measured user impact. Describe Codex, Figma Make, Mobbin and any AI models only to the extent actually used. Provide asset/source credits.

## 14. Before you begin implementation, output this concise checkpoint

1. Confirm you found and read the workshop kit and this spec, and detected/archive-handled the unrelated prefilled knowledge file.
2. State which project Page, Figma, Mobbin and browser-testing tools are *actually available* (don't assume they're connected).
3. Summarise the confirmed CultureLoop target user, problem, memorable interaction and P0 feature scope in 6–8 lines.
4. Show a minimal staged implementation plan and highest-risk dependency (real current event data).
5. Complete the kit's Start/PRD approval checkpoint as required before Develop. After approval, proceed decisively without repetitive ideation questions.

## 15. Resource references and verification notes

- Official SG Culture Pass home and current listings: <https://www.sgculturepass.gov.sg/>
- MCCY scheme description: <https://www.mccy.gov.sg/sectors/arts-and-heritage/sg-culture-pass/>
- Government expiry FAQ: <https://ask.gov.sg/sgculturepass/questions/cmf2ca6bu0197yp9irzfsoaf1>
- GovTech redemption walkthrough: <https://www.tech.gov.sg/technews/how-to-use-your-sg-culture-pass-credits-in-singapore/>
- Figma MCP / Codex: <https://help.figma.com/hc/en-us/articles/39888629089175-Codex-and-Figma-Set-up-the-MCP-server>
- Figma Make code export: <https://help.figma.com/hc/en-us/articles/35710574222487-Beyond-the-basics-Using-Figma-Make>
- Figma Make GitHub push limitations: <https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub>
- Mobbin skills installation is already documented inside the provided kit's `mobbin-research.md`; follow the live tool environment rather than assume a command will work.

**Final instruction:** Build for the human experience, not a feature checklist. The unique result should be an exploratory, culturally meaningful **bridge from one lived experience to another**, with evidence-backed real options and a showable, playful interactive moment. Keep it beautiful, honest, runnable and submit-ready.

## 16. Copy-ready instructions for individual stage handoffs

**Kickoff / Start in Codex:**

> Read `AGENTS.md`, `CULTURELOOP_CODEX_SPEC.md`, `START-HERE.md`, and the Start skill before doing anything. This is an existing, participant-selected concept; do not invent a new idea or repeat answered discovery questions. Archive the unrelated prefilled couples-app `PROJECT-KNOWLEDGE.md`, initialise clean CultureLoop knowledge, verify available Pages/Mobbin/Figma tools, and complete a concise CultureLoop PRD via Start. Use genuine Mobbin flow evidence if connected. Seek only the necessary flow/PRD approval; do not automatically enter Develop until that checkpoint is approved.

**Develop after PRD approval:**

> Use the kit's Develop skill and the approved CultureLoop Page (or `docs/cultureloop-prd.md` if Pages was unavailable) as the source of truth. Build a usable greybox in `app/` implementing S0–S5, deterministic recommendations, verified event seed data, manual balance and save persistence. Run the app and tests, show how to try the demo persona, and record what was built and remains simulated. Preserve the review checkpoint and do not quietly expand scope.

**Design after the greybox trial:**

> Use the kit's Design skill. Inspect the working greybox first, perform actual Mobbin `redesign-screen` research in bounded passes if access works, and use Figma Make or Figma MCP for one high-impact Discovery/Experience visual sample. Apply the `Singapore after dark × cultural zine` design direction only after the sample is approved, then refine all screens without changing functional behaviour. Verify phone/desktop, reduced motion, contrast and audio controls.

**Submit after final checks:**

> Use the kit's Submit skill, actual project knowledge, tests, links, attribution and supplied seven-section template. Draft a truthful Common Ground submission with both 100-word section limits, track reflection, GitHub/live links if they exist, credits for all AI tools and third-party assets. Do not submit externally.

**Optional direct prompt for Figma Make (visual sample, not second app):**

> Create one highly polished, mobile-first UI concept for CultureLoop, an independent Singapore culture discovery prototype helping someone who spent S$55 of a S$100 Culture Pass on a date rediscover an inspiring next experience using their S$45 remaining balance. Concentrate on two connected views: (1) a personalised Discovery screen visualising the relationship between past musical/theatre outings, contemporary music interests, and three verified local culture events as an interactive constellation; (2) an Event Experience screen with striking editorial typography, deep midnight navy, cream text, tasteful electric mint and coral accents, a creative soundwave hero clearly labelled as an artistic interpretation, event context, credit/top-up details and Save/Official Listing actions. The feel is Singapore after dark × independent cultural zine: bold but not cluttered, contemporary without government-portal aesthetics, responsive, high contrast, screen-reader friendly, accessible by keyboard, with clear reduced-motion and mute states. Do not fabricate event metadata, copyrighted photos or official logos. Deliver editable design concepts and interaction notes; this is a reference for the canonical Codex React app, not a replacement application.
