# CultureLoop visual redesign

11 October 2026. Refinement of the existing six-screen React application. No product restart, event-data rewrite, authentication or database migration.

## Baseline audit

Before changing the presentation, the existing app was captured through installed Chrome at 1440 × 900, 1280 × 800, 390 × 844 and 360 × 800. All six screens were captured at each size, using the same S$45 demo and the second recommendation for the preview and saved collection. Files: [baseline captures](visual-qa/redesign/before/). First viewport overview boards and full-size screenshots accompany the comparisons.

| Existing area | Visible weakness | Refinement |
| --- | --- | --- |
| Hook | Ring artwork dominates without connecting to the product's signature experience | Bold new headline and a real, restrained 3D atlas alongside an immediately available CTA |
| Culture story | Outline choices and muted balance treatment feel like a conventional form | Editorial two-column layout, a prominent entered-credit panel and clear selected states |
| Cultural DNA | Twelve nearly identical text containers | Twelve original illustrated taste sleeves, consistent selection badges and optional mood choices |
| Discovery | Flat diagram, repeated artwork and equally weighted cards | Spatial atlas with selected-event panel, full square poster collection, compact mobile browsing |
| Preview | Repeated circular art and weak media hierarchy | Original event-specific poster, event title, a shared soundscape player and practical source-backed information |
| My Loop | Sparse generic rows | A personal sleeve collection connected to memory, curiosity and saved next chapters |

## Actual Mobbin research

The connected Mobbin MCP returned screen images and flow sequences, which were visually inspected. The supplied Spotify onboarding flow resolved exactly. Screen and DICE flow queries returned equivalent relevant captures rather than every supplied starting ID; the links below identify the captures actually studied. Screens show states and flow order, not verified animation timings.

| Product and inspected capture | Concrete principle | CultureLoop use |
| --- | --- | --- |
| [Spotify Home](https://mobbin.com/screens/c436956e-14b1-4d90-b58d-846eece57ba5) | Square cover artwork, short editorial section titles and compact personalised starts | Complete poster sleeves, strong titles and a personal collection |
| [Spotify Browse](https://mobbin.com/screens/7d1d7f6f-e8d8-4569-8ff4-401b84695a0a) | Distinct visual genre identities with labels in predictable positions | Original symbols and limited category colours for each interest |
| [Spotify Now Playing](https://mobbin.com/screens/6cb0a8f6-977e-4b9a-b137-04bc8f4b9d24) | Large media artwork and an obvious primary playback action | Artwork-led preview, real play/pause, mute and volume; original synthesis only |
| [Spotify onboarding](https://mobbin.com/flows/e961c187-377c-4021-9b6d-0f34ba1fc266) | Visual taste selection, selected states and a personal final destination | Immediate taste feedback, a visible selection count and personalised discovery |
| [DICE discovery and map flow](https://mobbin.com/flows/e29aca9d-90b6-40f7-b3d7-02017c178dac) | Spatial browsing retains an inspectable selected experience; list rows keep artwork and metadata compact | Atlas beside an active-event panel; accessible controls and equivalent list browsing |
| [DICE event detail](https://mobbin.com/screens/d1ba2464-8482-4235-8de7-dc2e4dcae3d5), [second detail](https://mobbin.com/screens/ae074cf0-3b1d-4718-bfa2-67d4c929c10b) | A dominant cover and title lead into date, venue, price and clear actions | Event title appears before media on mobile; date and starting price are immediately visible, with complete facts and source links below |

The three-dimensional geometry, authored relationship paths, mood palettes and poster illustrations are CultureLoop's own design decisions. Mobbin informed browsing and control placement; its interfaces were not copied.

## Art direction and Figma

Chosen direction: **midnight cultural atlas**. Ink navy, acid lime actions, ice blue structural information, coral theatre and lilac art. Space Grotesk headlines and DM Sans functional text. Square sleeves, deliberate alignment and compact collections replace repetitive outlined cards. Motion serves selection, camera focus and screen continuity.

The existing [Figma file](https://www.figma.com/design/GJnRFnCGzSKxN0c9IfauMR) contains the earlier editorial and music-discovery directions. Two new editable studies explore the revised hook (node 8:10) and discovery framing (8:29), using existing token variables and the existing action component. Both rendered screenshots were inspected. Their useful decisions are the asymmetric headline/atlas composition and a selected-event column next to the atlas. These are schematic studies, not pixel-identical application screens. Figma Make is not exposed by the available tools; Figma MCP was used. React remains canonical.

## Spatial and sound behaviour

React Three Fiber, Three.js and Drei render actual meshes, perspective depth, curved paths and bounded orbit controls. The previous memory anchors the centre; octahedra represent chosen interests; spheres represent recommendations. Paths use actual matched tags and existing authored bridges. Familiar connections sit forward, bridges deeper. The explanation disclosure distinguishes chosen tastes from claims about the previous event. Selection changes the featured experience and smoothly focuses the camera; reduced motion settles immediately. The main scene has hover states, touch rotation/zoom, keyboard event controls and equivalent list access.

Fresnel rim glow and lighting provide emphasis. There is no full-screen postprocessing bloom or random particle cloud. The scene renders on demand when idle and under reduced motion, using continuous frames only while unmuted audio is active. DPR is capped at 1.5, geometry is small, orbit movement is bounded, and the 3D module loads separately. Unsupported WebGL, rendering errors and lost contexts retain an honest static map and functional event controls.

Six moods change original pad/chord/arpeggio palettes and the atmosphere's editorial note. They affect presentation, not event eligibility or deterministic ranking; no unsupported mood-to-event metadata was invented. Audio starts by a user gesture, shares one context across discovery and previews, uses actual analyser energy for the meter and constellation lighting, and exposes mute/volume. Other screens retain reachable controls while sound plays; returning home stops playback. Mode changes stop playback and require another gesture. No event recording or photograph is represented as authentic.

## Two refinement passes

| Pass | Three priority shortcomings actually seen | Corrections and subsequent verification |
| --- | --- | --- |
| 1, [captures](visual-qa/redesign/pass-1/) | Compact atlas globes clipped; rectangular poster crops and repeated interest images; mobile preview concealed the event title and had overlapping mix text | Aspect-aware compact camera and corrected container height; full square sleeves and twelve distinct interest illustrations; title-first mobile detail layout, separate mix rail and legible playback text. Captured again at all four sizes. Also fixed a route-departure DOM error by replacing Drei's nested HTML roots with ordinary React-owned projected labels. |
| 2, [captures](visual-qa/redesign/pass-2/) | Main atlas edge labels clipped on small mobile; preview heading joined words; green sound surfaces and native white number steppers broke the navy visual system | Aspect-aware main camera including selection focus; explicit spaced heading; navy player surfaces and clean numeric input. Added immediate mobile date/price, corrected joined story copy, and replaced a decorative play-shaped poster mark with a starburst. Final captures show the corrected results. |

Final evidence: [hook comparison](visual-qa/redesign/welcome-comparison.html), [discovery comparison](visual-qa/redesign/discover-comparison.html), [DNA comparison](visual-qa/redesign/dna-comparison.html), [preview comparison](visual-qa/redesign/experience-comparison.html), [full final captures](visual-qa/redesign/final/). Comparison boards use actual before/after screenshots and the Mobbin board template. Baseline element geometry was not recorded, so no guessed element outlines were added.

The final review also caught a mood-icon selector leaking onto the application shell. Mood metadata now uses an isolated data attribute; a browser regression check exercises all six selections and verifies stable geometry, text colour and transforms. Route headings receive focus after their entry transition completes, and the skip link focuses the main content without changing the current hash route.

## Preservation and limits

The original recommendation weights, expiry/eligibility filters, full-catalogue affordability handling, verified event snapshots, official URLs, hash routes, budget estimates, saved IDs and deployment configuration remain intact. Optional mood validation is backward-compatible with existing profiles. Root Neon infrastructure is linked and provisioned, but the frontend has never queried it: localStorage remains the application persistence layer. No credentials are bundled, no new backend or tables are needed, and no production Neon mutation was made for this redesign.

Rendered Chrome inspection and automated interactions are evidence of this implementation, not participant validation. Desktop and mobile viewport emulation do not certify physical-device GPU performance or Safari behaviour. No hardware FPS benchmark, screen-reader certification, listening study or improvement in cultural attendance is claimed. The lazy 3D chunk remains relatively large; its fallback and loading state are functional. Event snapshots still require confirmation on official listings. Hosting, public source links and final submission remain outstanding from the original delivery scope.
