# CultureLoop readability, soundtrack and session refinement

Implemented 11 October 2026 from Malcolm's screenshots and approved five-part plan. The existing catalogue, scoring, Neon provisioning and deployment configuration are preserved.

## Implemented changes

- Body text is 16–17px, controls 15–16px, practical information 13–14px and scene event titles 13–14px. Interest tiles use four desktop columns and two mobile columns with reserved caption space. Small scene eyebrows remain 10–12px. The mobile memory caption sits above the spatial nodes; desktop retains its projected label.
- Mood controls are removed. Onboarding music tastes determine actual original harmony, phrases, timbre and rhythm. Indie, jazz, electronic, pop and orchestral layers blend in normalized proportions, independent of selection order. Nonmusic interests get an honestly named neutral ambient mix. Legacy mood fields remain readable but do not drive audio or recommendations.
- Default volume increases from 55% to 75%, with stronger pad/melody/master gains, smooth changes, compression and a bounded soft output ceiling. No autoplay. A single context serves onboarding, discovery and previews; taste changes introduce the next harmony smoothly. Controls remain reachable elsewhere while playing; home stops sound.
- Constellation and full event collection are exclusive. Spatial mode retains selected preview, keyboard node controls and actual explanations. List mode offers the same recommendations with saves and details.
- LocalStorage retains profiles/saves under the existing key. SessionStorage restores navigation, selected event and view/filter settings on same-tab refresh. Fresh root visits open welcome with Continue my journey / Start a new exploration. New exploration resets story/tastes while retaining entered balance, saves and self-reported attendance. Clear all data is separate and confirmed. Explicit hash routes and browser back work.

## Rendered review and checks

Two refinement passes plus final captures cover welcome, story, DNA, constellation, list, detail, My Loop and returning welcome at 1440×900, 1280×800, 390×844 and 360×800. Overview boards and selected full-size screens were actually inspected.

First pass corrected late-loaded scene CSS overriding larger labels, a clipped mobile preview button and small story controls. Second pass corrected an inherited preview margin, captions overlapping artwork and scene labels crowding the previous memory. Final captures report no page errors or document overflow. [Screenshots](visual-qa/usability/final/) and [measured fonts/bounds](visual-qa/usability/final/checks.json).

**29/29 Vitest and 25/25 Playwright Chrome tests pass; TypeScript/Vite production build passes.** Coverage includes the existing recommendation/budget/data checks plus soundtrack blending/fallback, gesture-only audio, shared context/mute/volume, exclusive views, practical font sizes, unclipped controls, old profiles, refresh retaining details, fresh visits and new explorations preserving saves.

The audio test measured a peak above 0.025 and below 0.85 after initiation, demonstrating a stronger nonzero bounded signal. Perceived volume on physical speakers/headphones remains a participant listening check.

Compiled desktop/mobile checks passed for 3D, exclusive views, label sizes, sound, save/reload and local assets, with no errors/overflow. Checked credential markers are absent from JS. CDP measured 109ms main-thread task time over four idle seconds while other QA was running, not GPU FPS. [Release evidence](visual-qa/usability/release-check.json). The existing lazy 3D chunk advisory remains (~263KB gzip).

No new dependencies, database tables, authentication, backend, production Neon mutation or external publication. Physical-device/Safari, full screen-reader certification, hosting and Pages-sync limitations remain. Malcolm's experience review is the next checkpoint.
