# Delhi Streamlines v1.6 — streets, tricks and finishing pass

**Play:** Open `delhi-streamlines-v1.6.html` in a current desktop or mobile browser. The first screen is the city atlas; choose **Continue or drop in** for Central Delhi, or **Bowl practice · quick drop-in** for the skate ground. This is an original, self-contained HTML/CSS/Canvas/JavaScript concept, with no downloaded fonts, photo assets, audio files or libraries.

## What changed after the v1.5 review

| Area | v1.6 implementation | Why it matters |
| --- | --- | --- |
| Road layout | Replaced seven problematic local road paths and added four full polylines linking district street endpoints. The atlas draws those actual centerlines. | A road now remains visible and rideable through a boundary rather than becoming a rectangle with disconnected ends. |
| Street clearance | Sampled each local and connector road every 20 world units against buildings, active stalls and protected scenery with a 20-unit player radius. All centerline samples clear. One market connector narrows to fit between stalls. | Route centers no longer run through shops or monument grounds. |
| Trick animations | Kickflips rotate the deck edge-on, reveal the underside, and recover while airborne; grabs move the skater's hands and posture; charging crouches, and landings compress the body with a short ground ring. Manual and revert add readable board movement. | Square/J/FLIP and Triangle/K/GRAB have visible actions, rather than only adding points. |
| Trick integrity | A flip and a grab can each score once per airtime; jumping, bank takeoff or bowl lip transfer resets availability; landing resets the pose and prepares the next trick. | Repeated input cannot inflate a single jump. |
| Illustrated Delhi | Added a stylized India Gate silhouette *inside its protected viewpoint*, bazaar and Punjabi roof details at High detail, and market rickshaw coloring. Dusk warms the road and monument accents. | Visual motifs echo the supplied rooftop, bazaar-lane and evening photographs without using a photo as a game texture. |
| Rendering | Precomputed road bounds and skip roads outside the camera. Cache full-screen dusk gradients until resize; retire aura trail entries in place. Keep the existing viewport culling, 60 Hz fixed update, DPR cap and Auto/High/Low detail modes. | Less repeated drawing and allocation while retaining the one-file architecture. |

## The connected route

The world is still a single 6,200 × 4,100 top-down, depth-illustrated city. Central Delhi meets Punjabi Market on the east; Central meets Old Delhi Bazaar to the south; Punjabi Market joins Community Skate Ground below; Old Delhi Bazaar meets the skate ground to the east. Each transition has a painted road polyline leading from a road in one district to a road in the next, beside playable approach rails or banks. Crossing a district seam at ground level keeps the current combo.

The city is a **fictional composite**: Janpath, market lanes and the India Gate view inspire setting and signage, but the skate surfaces and links are invented. Historic, religious and other monument grounds are protected collision scenery. Working shop interiors and stalls are also blocked. The source photographs show varied streets and rooftops; the game's elevated top-down view translates those cues into shapes, awnings, signs and shadows. The linked YouTube page required a sign-in challenge, so its footage could not be watched or validated; v1.6's visual decisions use the supplied photographs and prior game design.

## Play and observe tricks

| Input | PS5-style Standard Gamepad in a browser | Keyboard/mouse | Touch |
| --- | --- | --- | --- |
| Steer / carve | Left stick | WASD / arrows | Left stick |
| Push / bowl pump | R2 | Shift | PUSH |
| Charged ollie | Hold and release Cross | Hold and release Space / left mouse | Hold and release POP |
| Flip | Square | J / middle mouse | FLIP |
| Grab | Triangle | K / right mouse | GRAB |
| Grind / manual / revert | R1 / L1 / L2 | E / M / Q | GRIND / MANUAL / REVERT |
| Instinct / spot / retry / atlas | L3 / Create / R3 / Options | I / C / R / Tab | INSTINCT / SAVE / RETRY / MAP |

1. Pop, then press FLIP during the jump. Watch the deck compress to an edge, expose its coral underside and settle before landing. The label above the skater confirms the timing. Repeated presses in that jump do not award more flips.
2. On another jump, press GRAB to pull both arms down toward the deck. You can combine one flip and one grab in an airtime. Keep enough height to see the full pose.
3. Hold POP before release to crouch and charge. Land to see the body compress and, in full motion, the short ground ring. Holding MANUAL tilts the deck; a timely REVERT adds a short turning accent.
4. In the skate ground, choose the bowl practice drop-in and roll down under gravity; the bowl floor, lip transfer and grind rail behavior from v1.5 remain intact.

**Accessibility:** Reduced motion retains the meaningful flip/grab pose and trick labels while omitting aura trails, landing ripple and speed-based camera lookahead. Low detail reduces decorative drawing and DPR; this mode can help on slower phones. Sound remains opt-in through browser user interaction and can be muted. The responsive touch grid and saved controller settings remain available.

## Verification and scope

Run `node prototypes/tests/delhi-streamlines-v1.6.smoke.cjs` from the repository root. The test includes the previous gamepad, touch, save migration, ghost, missions, rail geometry, bowl physics and shading checks. It additionally samples every street and connector against protected scenery and buildings, verifies that each connector meets roads on both ends, rides through a district seam while holding a combo, and checks animated deck flip, grab, landing and per-airtime scoring. The embedded JavaScript is syntax-checked and all referenced HTML IDs are present.

These checks use a simulated Canvas and inputs, so they do not establish frame rate, visual legibility in a real browser or physical DualSense and phone behavior. A native PS5 build, actual 3D mesh deformation, licensed Delhi recordings and footage-derived textures are outside this HTML concept. The next meaningful production pass is a real device playtest, with skaters and Delhi-based Punjabi/Hindi creators reviewing steering feel, sign text and the city's portrayal before wider release.
