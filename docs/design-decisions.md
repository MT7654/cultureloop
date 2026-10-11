# CultureLoop art direction

Decision record, 11 October 2026. Initial design study; implemented and tested behaviour belongs in project knowledge and test notes.

The latest midnight-atlas redesign, concrete Spotify/DICE reference decisions, 3D/audio behaviour and two rendered refinement passes are documented in [the redesign audit](redesign-audit.md). React is canonical; this document retains the initial direction exploration.

## Selected direction

Use **A — Singapore after dark × cultural zine**, borrowing B's rhythmic movement sparingly. The lead selected this within the approved brief; participant review of the implemented experience remains pending. React code is the source of truth; Figma frames are editable visual references.

| Criterion | A — After-dark culture zine | B — Sonic playground |
| --- | --- | --- |
| First ten seconds | A large narrative statement and S$45 orbital ticket tell the continuity story immediately. | Expressive wide lettering and purple/lime establish energy, but “on repeat” explains the continuity problem less directly. |
| Warmth | Cream text and coral italic phrase soften midnight navy; feels personal and editorial. | Lime and violet feel playful and musical; stronger entertainment bias. |
| Legibility | Space Grotesk display with DM Sans function text supports scanning. | Wide Syne lettering needs careful width control; initial word break was observed and fixed in Figma. |
| Feasibility | CSS/SVG rings, restrained particles and editorial type scale can translate efficiently to mobile. | More expressive typography and large shapes increase mobile wrapping risk. |

A better supports varied Singapore art forms without making every recommendation feel like a gig. Retain B's rhythmic waveform as an optional, user-initiated interpretive preview.

## Visual foundation

Figma study palette: midnight navy `#0B1421`, warm cream `#F3EFE4`, electric green/mint `#CBF578`, coral `#FA896F`, muted text `#A9B4BD`. B uses purple `#301B52`, lime `#D9FF62`, violet `#9675DD`. These are exploration values; final CSS tokens may be tuned after browser contrast/layout checks.

- Display: Space Grotesk Bold. Functional labels/body: DM Sans. Use one restrained editorial italic phrase, explored with Bodoni Moda Italic, where it helps the emotional message.
- Composition: generous margins, one dominant statement, one orbit/connection artwork, concise primary action. Avoid a dense dashboard grid.
- Artwork: original geometric loops, lines and typography. Explicitly illustrative; never presented as an event photograph. Event metadata must remain readable separately.
- Discovery: no invented personalisation percentages. Label the actual recommendation relationship and provide a list alternative to interactive nodes.
- Motion: selected interest feedback, path highlight and staggered reveal should explain continuity. Short transitions; static reduced-motion alternative; no intro that prevents proceeding.
- Audio: silent by default, gesture-initiated play, pause/mute, clear “Creative interpretation — not actual event audio” label. Static artwork must remain usable if Web Audio is unavailable.
- Budget: illustrative S$55/S$45 story is labelled. Manually entered credits become the meaningful later balance. Saving does not deduct credits or imply attendance.
- Practical details: hierarchy learned from Airbnb, selection feedback from Spotify, concise discovery from DICE. Their visual identities are not copied.

## Evidence and remaining checks

Actual Figma MCP screenshots were inspected for A/B hook and preview. After B headline correction and reusable action component conversion, the relevant final frames were inspected again. All text, geometric shapes and action instances remain editable. No clipped content or overlapping controls was observed in the final desktop direction captures.

The frames are not the final event detail screen and intentionally do not invent metadata. Application QA was subsequently performed separately. See [design references](design-references.md) for exact source and Figma links.

## Implemented browser refinement

Final React tokens use ink `#101B20`, cream `#F3F0E5`, muted mint `#BCE7CC`, coral `#EFA18A` and muted text `#A9B9B8`, with category-specific original vector palettes. Space Grotesk, DM Sans and Bodoni Moda are locally bundled under SIL OFL. No Google Fonts request is required.

Actual Chrome captures were inspected at 1280px desktop and 390px mobile for hero, story, interests, constellation, preview and saved collection. The three most damaging first-pass defects were a mobile joined-word headline, letterboxed SVG card art and a poster caption obscured by the balance ticket. Explicit mobile line breaks, SVG slice treatment, caption clearance and removal of an overlapping decorative mobile arrow corrected these. Final captures were inspected again after waiting for the opacity transitions to finish; early mid-transition captures had appeared dimmer than the finished screen.

Mobile discovery retains an editable balance summary. Node labels derive from actual matched/bridge tags; selection changes the highlighted path and its explanation. The list alternative preserves event access. Audio remains gesture-initiated original synthesis with two moods, pause/mute and fallback. Saved chapters never imply attendance or reduce credits.

13 Playwright tests verify 360/390/768/1280 widths without horizontal overflow, reduced-motion CSS, keyboard audio, reset focus, budgets, history, reload and unsupported dependencies. Final screenshot evidence lives in `docs/visual-qa/*-final.png`. The final browser walkthrough reported no page errors and one saved chapter. Participant experience review and subjective audio judgement remain pending.
