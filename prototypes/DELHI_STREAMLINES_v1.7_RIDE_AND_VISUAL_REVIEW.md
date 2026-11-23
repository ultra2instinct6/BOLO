# Delhi Streamlines v1.7 — ride feel and illustrated city pass

**Prototype:** `delhi-streamlines-v1.7.html` is one playable HTML file. Open it locally in a modern browser; start in Central Delhi or choose **Bowl practice · quick drop-in** in the city atlas. Earlier builds remain separate. There are no external images, scripts, fonts or audio downloads.

## Review: where v1.6 felt thin

1. **Push was only acceleration.** The rider remained planted when Shift, R2 or PUSH was held, which made a running start feel less like skating. Bowl pumping used the same action, but ought to keep both shoes on the deck.
2. **Tricks had clear labels but sparse contact feedback.** The new flip and grab animations in v1.6 worked, yet the instant of popping, catching the landing, or mounting a rail had little graphic response beyond existing sound and occasional ring effects.
3. **A grind required a last-moment press and could pull a sideways rider onto the rail.** This made good approaches easy to miss and rewarded implausible angles. The rail-locking and natural rail-end release from earlier versions were otherwise sound.
4. **Street and roof silhouettes were too uniform.** The game needs readable surfaces and shop canopy depth at play speed, not more detail everywhere. Adding art only within the camera and only in the High detail mode preserves the light mobile path.

## Implemented riding changes

| Action | Player-visible result | Actual behavior |
| --- | --- | --- |
| Ground push | Rear shoe sweeps behind the board; legs and arms counter-swing; wheel highlights advance with ground speed. | A fixed-step phase advances while pushing outside a bowl. The pose blends in and out; pop immediately plants both feet. The acceleration model remains the established v1.6 arcade model. |
| Charge and pop | Existing crouch and charge ring lead into a short deck nose tilt, with a small warm pop burst. | Deck-only tilt decays within 0.3 seconds. A bounded burst is cosmetic and cannot change physics. |
| Carve and pump | Two subdued wheel streaks appear during faster lean; pumping briefly compresses the rider while both shoes remain planted. | Streaks appear only while grounded, leaning and above the visual threshold. They disappear with Reduced motion. Bowl gravity and lip-speed gates stay as tested in v1.5. |
| Flip, grab and landing | The deck still exposes its underside on a flip; a grab moves both arms; landing adds a short dust burst and compression. | The existing one-flip/one-grab-per-airtime rules remain. Bursts are capped at 40 in High detail and 16 in Low/Auto-light detail; Reduced motion creates none. |
| Grind | Nearby aligned riders see a control-specific hint. An early R1/E/GRIND press stays active briefly; the board snaps when it actually reaches the segment. | The 0.24-second buffer tests the segment as the player moves. It requires speed and at least 65 units of velocity along the rail; a perpendicular approach cannot score or teleport. The same segment tracking, natural end release and rail identity still apply. |

These are intentionally **illustrative arcade cues**, not claims that a 2D Canvas simulation reproduces real foot, truck or wheel biomechanics. A published ollie model emphasizes a pop and later board leveling, which informed the order of this visual sequence: [Heinen et al., *Sports Engineering* (2024)](https://link.springer.com/article/10.1007/s12283-023-00448-y). The values in the game are tuned world units, not measured physical forces.

## Environmental art and BOLO identity

The existing dark blue-teal HUD, warm stone, mint and gold accents, tiered Aura ring and Instinct route overlay remain the visual foundation. These follow the broad palette and movement language visible on the current [BOLO.Aura game page](https://bolo-instinct.com/games/bolo-aura/) while drawing original code and artwork for this game. The supplied Delhi photographs guide flat-roof clusters, narrow market awnings, amber evening light and a protected historic viewpoint. The associated YouTube link required sign-in, so no footage from it was treated as inspected visual reference.

- **Road readability:** High detail adds small paving seams and low amber glints on visible horizontal streets. Markings stay within painted roads and do not become new collisions. Low detail skips them entirely.
- **Market roofs:** The Punjabi Market and Old Delhi Bazaar gain layered parapet shadows and alternating fabric canopy tips. Existing culling keeps distant buildings and active stalls out of the render path.
- **Protected viewpoint:** The Bangla Sahib building receives a simplified roof form; the India Gate art stays inside its protected grounds. The game does not offer skating on real monument grounds or through functioning market stalls.
- **Evening city:** Dusk window colors warm without an expensive new lighting pass. A developer discussion of city-scale nighttime scenes notes why headlights and many light sources need deliberate handling in larger worlds; this prototype keeps dusk a restrained illustrated layer rather than claiming full dynamic nighttime lighting. [Full Circle developer update (2026)](https://www.ea.com/games/skate/skate/news/behind-s3-building-s4)
- **Performance:** All new paving uses visible road spans and only runs when detail is on. Cosmetic bursts use a small capped array; the mobile coarse-pointer HUD drops its CSS backdrop blur. The previous 60 Hz fixed-step update, DPR caps, cached dusk gradients and road/building culling continue.

The city is fictional and intentionally composite. Local creators and Punjabi/Hindi readers should review language and cultural detail before public release.

## Inputs and comfort

| Action | Browser Standard Gamepad with PS5-style labels | Keyboard / mouse | Touch |
| --- | --- | --- | --- |
| Ride, push, bowl pump | Left stick, R2 | WASD/arrows, Shift | Stick, PUSH |
| Ollie, flip, grab | Cross, Square, Triangle | Space/left click, J/middle click, K/right click | POP, FLIP, GRAB |
| Buffered aligned grind | R1, briefly before rail | E, briefly before rail | GRIND, briefly before rail |
| Manual, revert | L1, L2 | M, Q | MANUAL, REVERT |
| Instinct, checkpoint, atlas | L3, Create, Options | I, C, Tab | INSTINCT, SAVE, MAP |

Gamepad mapping is a browser Standard Gamepad concept, not a native DualSense implementation. Reduced motion keeps the informative pose and trick labels while dropping floating particles and motion rings. Auto and Low detail remain useful on phones; no audio plays until the browser permits it after user input.

## Verification

Run `node prototypes/tests/delhi-streamlines-v1.7.smoke.cjs` from the repository root. It retains the v1.6 geometry checks for all four city connectors and all sampled road centers, plus input parity, progress migration, rail endpoints, bowl terrain, ghost, mission and character rendering regression coverage. New checks exercise push posture/leg placement, foot recovery, planted feet inside the bowl, early grind buffering, refusal of sideways rail entry, particle caps, Reduced motion and detail-dependent paving. The JavaScript also parses and every referenced HTML ID is present.

The test uses mocked Canvas, gamepad and audio. It cannot establish real-phone frame time, the artistic appearance of the composed frame, actual PS5 controller feel, audio mixing or a playable 3D camera. Before merging or publishing, play this on desktop and phone with a Standard Gamepad, inspect each district in day/dusk and High/Low detail, and tune foot animation, rail capture distance and readability with skateboarders and Delhi-based visual/language reviewers.
