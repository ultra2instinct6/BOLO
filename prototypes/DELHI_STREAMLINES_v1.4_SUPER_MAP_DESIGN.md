# Delhi Streamlines v1.4 — one city, four neighborhoods

**Deliverable:** `delhi-streamlines-v1.4.html` is a self-contained browser game concept. It is playable offline in a modern browser with keyboard and mouse, touch, or a controller that the browser reports with the Standard Gamepad mapping. Its visual language is inspired by the warm, illustrated, top-down world of BOLO.Aura. It does not copy BOLO.Aura assets or claim to run on a PlayStation 5.

This version turns the four v1.3 districts into a **single 6,200 × 4,100 world-coordinate map**. Skating over a neighborhood edge keeps speed, a live combo, camera tracking, vehicles, ghost recordings, mission state, and the rider's position. The atlas doubles as a world overview; the district cards are optional fast travel. New skate features flank the links so travel itself can become a scored line.

## Open and play

1. Open the HTML file directly in a current browser. Select **Continue or drop in** to start in Central Delhi. After exploring, use the same button to resume exactly where you paused.
2. Steer with WASD, a virtual stick, or the controller's left stick. Hold Shift / PUSH / R2 to build speed. Hold then release Space / POP / Cross to charge an ollie. The Flow preset also accepts a right-stick down-to-up flick.
3. Ride the gold-marked connectors, or press Tab / MAP / Options for the atlas. Selecting a different district card deliberately fast travels to its drop-in point.
4. Press I / INSTINCT / L3 to reveal a mission route and, for a few seconds, nearby uncollected Word Spots, gaps, skate transfers, and city links. Make an airborne crossing within a marked city link to earn a **175-point City transfer** in the same combo.
5. Set a BOLO Spot with C / SAVE / Create to record the next five seconds; race the ghost with G or the menu. Use 60s Line Run for a timed score challenge. Export the local JSON save if you want a portable copy.

**Map caveat:** This is an original, fictional composite of Delhi-inspired streets and skateable public approach spaces. The supplied central-city screenshot informs the landmark and avenue feel, not turn-by-turn real geography, street legality, or a representation of a public monument as a skate spot.

## World layout and playable route

Coordinates below are internal prototype units. A visitor can cross the map freely. The bold connectors provide clear, staged routes; no loading screen or district reset occurs at their edges.

| Neighborhood | Global extent | Identity and playable line | Link to the next neighborhood |
|---|---|---|---|
| **Central Delhi** | x 0–3300; y 0–2150 | Janpath skate banks and artisans, museum-side green corridor, India Gate view, Khan Market approach; Bangla Sahib, Jantar Mantar, and Agrasen ki Baoli as backdrop or protected scenery | East to **Punjabi Market** at x 3060–3540, y 1220–1390; south to **Old Delhi Bazaar** at x 1320–1490, y 1910–2500 |
| **Punjabi Market** | x 3300–6200; y 350–2150 | Punjabi and Hindi signs, books, fabrics, tea, sweets, repair shops, a metro approach, mandi rails, awnings | West to Central; south to **Community Skate Ground** at x 4820–4990, y 1930–2590 |
| **Old Delhi Bazaar** | x 450–3300; y 2150–4100 | Spice, block print, crafts, music, lively lanes and festival strings; narrow rail and bank links | North to Central; east to **Community Skate Ground** at x 3050–3560, y 2910–3070 |
| **Community Skate Ground** | x 3300–6000; y 2350–4100 | Youth centre, art wall, water and first-aid signage, bowls, banks, open practice, gateway approach features | North to Punjabi Market; west to Old Delhi Bazaar |

Suggested opening loop: Janpath plaza → city-link ledge → Punjabi market entry rail → metro transfer route → community skate bowls → craft-lane exit → Old Delhi Bazaar → museum south link → Janpath. Each district has four sequential challenges, with independent progress. The loop is a route suggestion; players can choose their own line and fast travel.

**New connection features:** Eight approach rails and four banks are added near the four links. Each rail's geometry is an actual locked segment with endpoint release. Crossing in the air, while moving inside a connector, awards a separate named trick. Variety scoring distinguishes the physical rail, bank, trick variant, and connector; revisiting the same feature in one line earns less.

**Environment boundaries:** Shops and stalls have solid colliders. Monument and park memorial areas are visually marked and protected. Moving traffic is a readable game hazard; the routes and vehicles are fictional, and the prototype does not suggest real-world street skating at named sites.

## Art direction: BOLO.Aura meets street skating

Use BOLO.Aura's broad design cues: an approachable overhead scene, warm stone, red and gold decorative accents, soft shadows, outlined figures, and a dark teal interface with cream typography. Delhi Streamlines translates them into an original city illustration instead of reusing character art, tiles, or an identical temple environment.

| Layer | v1.4 implementation | Purpose |
|---|---|---|
| Ground | District-specific warm stone, market earth, and park greens; tiled grids; broad roads with curbs and dashed centers | A continuous recognizable floor, legible at mobile scale |
| Street life | Market awning stripes, Hindi/Punjabi/English signs, trees, lamp posts, festival strings, plaza motifs, pedestrians and small vehicles | A city with shops, public life, transit, and public gathering space |
| Height | Offset diffuse shadows, extruded building sides, layered roofs and windows, shaded ramps, nested bowl walls, rail supports | A stronger 2.5D read while preserving the tight top-down controls |
| Skater | Board deck, wheels, feet, jacket, arms, head, cap, separate ground shadow, jump lift and rail sparks | Clear direction, pop height, contact with features, and character presence |
| Feedback | Teal playable edges, gold connector lanes, Word Spot plaques, Instinct guidance, three Aura tiers, soft short sound cues | Know where to skate and why a line scored |
| Mood | Warm day and golden dusk button, with muted dusk wash and limited static lamp halos | Change the city atmosphere without obscuring hazards |
| UI | Dark teal, cream, mint, and warm gold cards; full atlas with player, objective and four district links | Continuity with the BOLO ecosystem and quick wayfinding |

Illustration should treat the places as lived environments. A market's work, a public green, metro access, small shops, and a spacious community practice area all deserve attention; vary architecture and scale without making income or religious identity into game obstacles. Punjabi and Hindi scripts, colloquial labels, and phonetic hints need review by Delhi and Punjabi contributors before release. Future voice performances would require permission and credited collaborators.

## Systems that give the world dimension

| System | Present in playable v1.4 | Natural production extension |
|---|---|---|
| **Flow and trick mastery** | Charged ollies, flip, grab, segment-locked grind, manual with balance assist, revert, ramps, bowls, transfers, variety bonus and combo bank | Stances, ledge types, purposeful terrain, animation blending, user-remappable controls |
| **Aura** | Spark at 180 live line points, Flow at 900, Instinct at 2400; subtle ring/trail and small pop or push advantages | Tier-specific visual and sound motifs, equipment/cosmetic progression without stat-heavy paywalls |
| **Instinct** | Route to next mission, momentary nearby Word Spot and gap highlights, rail-to-bank hint, marked nearby city links | Traversal choices that show up briefly on pulse, player-chosen waypoints, spatial learning that rewards city discovery |
| **Discovery** | Bilingual Word Spots unlock through tricks close to a storefront; their terms and approximate phonetic cues enter the Codex | Locally reviewed micro-stories from collaborating skaters, shopkeepers and youth-centre artists; optional audio with captions |
| **Replay** | Local five-second ghost recorded from a custom BOLO Spot; district-anchored 60-second Line Run can span several neighborhoods | More ghost slots, line editor, meaningful completion rewards, opt-in privacy-preserving sharing if a hub is built |
| **Persistence** | Version 2 JSON stores city location, visited districts, checkpoint, missions, words, scores, mode, motion, detail, sound and controller settings; older version 1 saves migrate | User account sync only after a reviewed account and privacy flow |

Aura tiers are prototype tuning values, not claims about how BOLO.Aura currently levels a player. Word Spot romanization is intentionally approximate; pronunciation and cultural context require review.

## Controls and accessibility

| Action | Standard Gamepad browser mapping (PS5-style labels) | Keyboard and mouse | Touch |
|---|---|---|---|
| Ride / push / brake | Left stick / R2 / Circle | WASD or arrows / Shift / B | Joystick / PUSH / BRAKE |
| Charge pop | Hold and release Cross; optional right-stick flick in Flow | Space or left mouse button | Hold and release POP |
| Flip / grab / rail | Square / Triangle / R1 | J or middle click / K or right click / E | FLIP / GRAB / GRIND |
| Manual / revert | Hold L1 / L2 | Hold M / Q; Z/X balance correction | MANUAL / REVERT |
| Pulse / spot / retry | L3 / Create / R3 | I / C / R | INSTINCT / SAVE / RETRY |
| Atlas / ghost replay | Options / menu button | Tab / G | MAP / menu replay |

Analog L2/R2 values above 0.5 count as held even if a browser has not flipped `pressed`. Gamepad D-pad and keyboard arrows select a fast-travel neighborhood in the atlas. The HTML uses the Standard Gamepad API; button numbering and labels need testing on a real DualSense and do not constitute native PS5 support. No DualSense haptics, adaptive triggers, or PS5 package are provided.

Reduced motion disables rider trail, camera lookahead and pulsing animation. Balance assist is optional. Auto detail trims decorative geometry on coarse-pointer devices or narrower windows; Low caps canvas DPR more tightly. High forces decorative detail. The simulation has a fixed 1/60-second update, a bounded accumulation step, culled world drawing, and no downloaded game assets. Portrait touch is supported, with landscape giving controls more room.

## Production priorities beyond this concept

1. **Street-level authenticity.** Review architecture, Punjabi/Hindi/Gurmukhi/Devanagari spelling, storefront word placement, sign typography, music and soundscape with Delhi creatives. If a real neighborhood is referenced, verify whether a feature is actually a public, safe and permitted skate space; move tricks to designed fictional features if not.
2. **Physical playtests.** Tune travel distances between links, trick timings, camera lookahead, trigger dead zones, mobile button reach, tactile readability and target frame times on mid-range phones, a desktop, and USB/Bluetooth DualSense. Record observed metrics before describing any device as optimized in production.
3. **A fuller city chapter.** Extend the connected base with a stylized circular plaza loop, side-street courtyards, accessible metro-adjacent practice space and a youth art corridor. Integrate them through real streets and tasks instead of isolated menu maps. Add handcrafted transition banks and multiple route heights after collision and camera work are ready.
4. **Narrative through place.** Let optional collaborations unlock mural designs, the history of craft practice, repair culture and community skating without putting invented dialogue in the mouths of real residents. Make public-space stewardship part of world design, not a scoring punishment.
5. **Production renderer.** Replace flat shapes selectively with original sprite sheets, tile atlases and drawn animation frames while preserving readable gameplay edges, low-detail mode and original authorship. Expand audio with carefully mixed rolling surfaces and original music if licensed.

## Verification and limits

Run `node prototypes/tests/delhi-streamlines-v1.4.smoke.cjs` from the repository root. It exercises keyboard, touch, Standard Gamepad simulation, rail endpoints, combo variety, mission completion, connected crossings with airborne bonuses, traffic continuity, map roads, version 1 save migration, world position and preference reload, ghost races, trials, procedural audio and mobile detail/DPR limits. The embedded JavaScript also passes `node --check`. These are mocked browser checks; no physical PlayStation 5, DualSense, phone performance, speaker mixing, or art-direction playtest is represented as complete.

Reference design comparisons retained from the prior version: [EA's skate. control discussion](https://www.ea.com/games/skate/skate/news/get-control), [Activision's Tony Hawk trick guide](https://blog.activision.com/tony-hawk/2020-08/THPS-Demo-Everything-You-Need-to-Know), and the user's live [BOLO.Aura](https://bolo-instinct.com/games/bolo-aura/) visual language.
