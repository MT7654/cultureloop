# Landing page: SG Culture Pass context

11 October 2026. Plan approved by Malcolm's "okay do it" and implemented. No permission request has been sent and no official logo/icon has been copied.

## Implemented and verified

The landing now explicitly names SG Culture Pass, explains continuity after a first outing, presents the labelled S$100 − S$55 = S$45 example, and shows independent status near the actions and in the expanded footer. The three-recommendation copy says "up to three" to respect filtering/availability cases. The credit illustration is a single semantic block beside the scene on desktop and ahead of it on mobile; the existing animated scene, sounds, journeys and returning-user actions remain intact. The journey strip reads "One outing → What you loved → Your next connections". Demo narration now introduces the same premise. Existing official-site links are preserved; no external publication occurred.

First screenshots exposed an inherited 8px/hidden independent-status line, uneven equation alignment when labels wrapped, and an awkward mobile sequence wrap. Corrected all three and captured again. Actual final full-page captures were inspected for desktop and mobile, including fresh 1440×900, 1280×800, 390×844 and 360×800, plus returning laptop/small-mobile states. Eight fresh/returning states were captured at those sizes, with viewport and full-page images; automated assertions report no overflow, pass label and primary action above the fold, and working start/demo/continue routes. Evidence: docs/visual-qa/culture-pass-landing/final/checks.json and adjacent PNGs. Existing flow/session Playwright suites passed **15/15**, including reduced-motion widths, audio fallback/controls, budgets, save/reload and return behaviour. Final TypeScript/Vite production build passed; the existing lazy 3D chunk-size advisory remains. Windows sandbox initially blocked localhost/realpath; authorised local execution succeeded. No unit tests were added for this copy/layout-only change.

Keyboard/touch semantics were preserved by reusing existing buttons; no new interaction was introduced. No source, ranking, database, credential, API or persistence change was made. The local project knowledge mirror is updated; shared Page sync remains pending.

## Finding and direction

The inspected final desktop and mobile welcome captures show a strong cultural-discovery identity, but SG Culture Pass is only explicit in the footer. The S$55/S$45 example does not explain where the credits come from. Preserve the approved visual identity, animated constellation, primary journey and soundtrack. Improve first-viewport comprehension through copy and composition, rather than another redesign.

## Approved implementation plan (retained for rationale)

1. Replace the hero eyebrow with **MAKE MORE OF YOUR SG CULTURE PASS**. Keep **Your next cultural obsession.** as the expressive headline.
2. Replace the hero description with **Your first outing shouldn't be your last. CultureLoop connects what you loved to three new cultural experiences, with your remaining SG Culture Pass credits in mind.** This explains the continuity hypothesis without claiming measured abandonment or guaranteed savings/availability.
3. Put a short context line close to the example: **Eligible Singapore Citizens received S$100 in SG Culture Pass credits for local arts and heritage.** Avoid implying an annual allocation or eligibility for every current adult/resident. The official 2025 cohort was citizens aged 18 and above in 2025.
4. Relabel the balance illustration **SG CULTURE PASS — EXAMPLE JOURNEY**, with **S$100 starting credits / S$55 used on one outing / S$45 remaining for what's next**. Keep a readable **Illustrative amounts; your balance is entered by you** label. Connect the remaining amount visually to the existing three event nodes, without implying three tickets necessarily fit S$45 or deducting credits.
5. Keep **Find my next chapter** and the returning-user **Continue my journey** behaviour. Label the secondary action **Try the S$45 demo**. Add **Independent discovery companion** near the actions. On mobile, place a compact credit example beneath the actions and ahead of the full scene, so the pass, problem, solution and primary action are visible promptly; avoid shrinking text to fit.
6. Replace the poetic introduction strip with **One outing → what you loved → your next three connections**, using the existing memory/taste/event visual vocabulary. Practical details stay in onboarding and previews.
7. Extend the footer: **CultureLoop is an independent makeathon prototype, not affiliated with or endorsed by SG Culture Pass, MCCY or the Singapore Government. Balances are entered by users; credits are not linked or redeemed here. Confirm eligibility, prices and availability with the relevant ticketing provider.** Keep the disclaimer readable on mobile.

## Official logo and icon

Use the ordinary name **SG Culture Pass** in CultureLoop's own typeface for this iteration. Do not reproduce the official logo, eligibility icon, or a lookalike mark; do not label CultureLoop an official partner or "powered by" the programme.

Official website terms, clauses 5–7, require prior written permission to reuse website contents/graphics and give enquiries@sgculturepass.gov.sg as the permission route. The partner FAQ explicitly restricts the eligibility icon to authorised ticketing and Arts & Heritage partners, and encourages logo use by those partners for eligible offerings. We have no evidence that CultureLoop has that status or permission. This is a recommendation based on published guidance, not a determination of every possible statutory exception. A disclaimer does not supply permission to reuse a graphic.

If official branding remains desirable, request written approval for this independent prototype and proposed placement, including any public deployment, and use only the supplied asset and approved conditions. No email has been sent. The website terms also ask for permission for hyperlinks/framing; include the intended existing official-site link in that request. Do not embed/frame the official service.

Sources checked 11 October 2026:

- [SG Culture Pass terms of use](https://support.sgculturepass.gov.sg/terms-of-use), last updated 1 September 2025, clauses 5–7 and 19–23.
- [SG Culture Pass partner FAQ](https://partners.sgculturepass.gov.sg/faq), questions 5–6.
- [Official SG Culture Pass website](https://www.sgculturepass.gov.sg/?lang=en), eligibility and credit context.
- [MCCY clarification, 7 October 2026](https://www.mccy.gov.sg/about-us/news-and-resources/age-based-eligibility-criteria-for-sg-culture-pass-and-curiosity-credits/), 2025 cohort, S$100 and no annual allocation.

Terms/FAQ evidence was retrieved through indexed text on the official domains; direct page extraction returned a JavaScript shell. No general public licence for the logo was found.

## Verification after implementation

- Inspect actual fresh and returning welcome screens at 1440×900, 1280×800, 390×844 and 360×800.
- Check that a judge can identify the programme, the "what next?" problem and CultureLoop's purpose from the first viewport, without reading the footer.
- Verify readable type, no overflow, a visible primary action, keyboard navigation and reduced-motion behaviour.
- Recheck demo, continue, new-exploration and onboarding actions; confirm entered balances, saved collections, sources and audio are unchanged.
- Review the landing copy and demo/submission wording together. Do not introduce unverified redemption/retention statistics or affiliation claims.

Scope: landing copy/layout and footer only. No database, API, ranking or event-catalogue change. Shared project Page update remains pending because Pages tools are unavailable.
