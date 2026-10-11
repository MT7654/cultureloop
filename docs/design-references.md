# CultureLoop design references

Research performed 11 October 2026. These are actual screens returned by the connected Mobbin tools and visually inspected by the build lead. This is bounded interface research, not user validation. The initial build used connector schemas directly; the subsequent redesign used Mobbin's search, best-practices, redesign-screen and plain-writing skills. Latest inspected Spotify/DICE captures and their concrete implementation decisions are in [the redesign audit](redesign-audit.md).

| Product and studied screen | Observed principles | CultureLoop adaptation | Avoid |
| --- | --- | --- | --- |
| [Spotify artist preference selection](https://mobbin.com/screens/53e5130e-8c6d-46dc-8689-70250e6f8472), [related onboarding screen](https://mobbin.com/screens/9470cc8c-8f98-40ed-b3db-55bec0019a57) | Dark circular selection grid; explicit check overlays and a clear Done action. | Make tastes tactile and visibly selected; keep the reveal action obvious and a selection count available. | Artist portraits implying endorsement, Spotify branding, or colour-only selection states. |
| [Airbnb private-bedroom detail](https://mobbin.com/screens/53d912ff-a3dc-472b-b525-379c327a89e8), [host detail](https://mobbin.com/screens/d71700a0-2e5e-4274-9d02-75b399408802) | Large image area before organised practical details; save action and persistent price/reserve hierarchy. This is accommodation UI, not an Airbnb Experiences screen. | Give cultural preview one clear focal point, then readable dates/venue/price; keep Save and the official listing easy to reach. | Copying a reservation flow or implying CultureLoop sells tickets. Original illustrative artwork replaces photos where event licensing is unclear. |
| [DICE event home](https://mobbin.com/screens/e381cd47-8bf5-4f79-8450-307b1f7d3bc1), [This week list](https://mobbin.com/screens/10d8319a-224c-452f-aab2-81d69cee38f6) | Image-led dark discovery; concise Tonight/This week controls, heart actions and compact event rows. | Use editorial event title/date hierarchy; make saved experiences lightweight and let recommendations retain atmosphere without obscuring practical details. | Arbitrary urgency labels, fabricated near-term inventory, or undocumented eligibility. |

## Figma exploration actually produced

[CultureLoop editable design file](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR) contains two contrasted directions, each with a landing hook and interpretive preview:

- [A — After-dark culture zine / Hook](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR?node-id=2-11)
- [A — After-dark culture zine / Interpretive preview](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR?node-id=2-12)
- [B — Sonic playground / Hook](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR?node-id=2-13)
- [B — Sonic playground / Interpretive preview](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR?node-id=2-14)

Figma MCP inspected the initially empty file, queried fonts, inspected available community libraries, searched Simple Design System button/background/heading assets, then composed original CultureLoop studies. No existing CultureLoop Code Connect or library conventions were found. General community themes were unsuitable for the selected original art direction; scoped local exploration tokens were created. Four reusable local action components have editable Label properties, shared action typography, and token-bound colours/padding/radii.

All four outputs were captured and visually inspected. The first B hook broke the word CULTURE; reducing its display size corrected that defect and the revised output was inspected. A subsequent component pass was also screenshot-inspected. Final frame descendants: A Hook 31, A Preview 47, B Hook 30, B Preview 47. Text counts are 13, 8, 12, 8; each frame has two component instances. There are no raster/image-filled layers. Font-family readback confirmed Space Grotesk/DM Sans/Bodoni Moda for A and Syne/DM Sans for B display content.

These are editable desktop direction studies, not a functional Figma prototype or proof of final responsive browser quality. Figma Make was not used; Figma MCP supplied the accessible visual exploration capability. The canonical app remains the React implementation in `app/`. No photos, event recordings, government logos, or third-party raster assets were imported into these studies.
