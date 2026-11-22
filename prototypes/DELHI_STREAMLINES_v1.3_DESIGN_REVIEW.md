# Delhi Streamlines v1.3 — design review and implementation guide

**Deliverable:** `delhi-streamlines-v1.3.html` is a complete, offline-capable, zero-dependency Canvas game prototype. It expands v1.2 within a fictional four-district Delhi world. The original city-map screenshot informed Central Delhi's visual layout; the HTML includes original vector geometry, no external map tiles, and no claim that its streets are navigationally accurate or approved real-world skate spots.

## Play this build

Open the HTML file in a current browser. Select a district and mode from the pause menu. Use keyboard and mouse, the on-screen touch controls, or a controller the browser exposes as a **standard** Gamepad. Select **60s Line Run** for a timed challenge. In Free Skate, press **C** / **Create** / **SAVE** to place a BOLO Spot and record the next five seconds. Press **G** or use **Replay 5-second ghost** in the menu to chase that recorded line. Press **I** / **L3** / **INSTINCT** to toggle the challenge route and briefly pulse nearby Word Spots, transfer lines, and gaps.

| Area | Place and culture | Skate route | Challenge |
|---|---|---|---|
| Central Delhi, the main map | Janpath artisans, museum corridor, India Gate view, Khan Market connector; Bangla Sahib, Jantar Mantar, and Agrasen ki Baoli as scenery | Public approach banks and handrails beside a protected green corridor | Ollie **or** bank launch, grind, flip, arrive at Khan connector |
| Punjabi Market | Books, fabrics, tea, mithai, repair shops, Punjabi and Hindi signs | Market bank, plaza ledges, metro approach | Ollie, flip, metro grind, reach community plaza |
| Old Delhi Bazaar | Spices, craft workshops, block print, chai, festival lights | Craft and print banks, approachable market ledges | Ollie, spice-lane grind, print-lane manual, exploration |
| Community Skate Ground | Youth centre, art wall, water and first aid | Two bowls, four banks and quarter pipes, three rails | Bank launch, central grind, bowl-side flip, far pipe |

These are **fictional composite play spaces**. Landmark grounds and working stalls stay collision-protected. A later location review should be conducted with Delhi skaters, shopkeepers, Punjabi/Hindi readers, and people who use those public spaces. Avoid treating neighborhood income, religious sites, or market workers as trick hazards.

## Changes made from the supplied review

| Review point | v1.3 implementation | Verification |
|---|---|---|
| Rail grinds float off the feature | Enter a rail by projecting the rider onto its segment. While grinding, velocity follows its unit tangent, the board stays at the segment point, and the rail releases at an endpoint. Brake or pop can exit early. | The smoke test asserts snapping, line adherence on every step, and release at the actual endpoint. |
| One category penalizes different rails | Combo keys include `kind:feature`, so each separate rail and named bank can add full value and combo variety; repeating the same feature is still reduced. | The test links two rails, repeats one, and checks exact points and multiplier. |
| Janpath launch misses Task 01 | The task accepts either `ollie` or `ramp`; its text reflects both. | The test triggers the bank through movement and verifies mission progress. |
| Controller analog triggers and stuck touch | L2/R2 read `pressed` or `value > 0.5`. Blur clears the joystick pointer ID, visual position, and holds. | Synthetic analog-trigger and blur cases are exercised. |
| Missing audio | Web Audio creates a quiet speed-dependent rolling tone and short synthesized pop, grind, landing, bank, word, and revert cues. It initializes on an eligible interaction and has HUD and menu mute controls. | Fake Web Audio smoke check covers event creation and mute. Actual speaker and device QA remains open. |
| Only best score survives reload | `bolo-streamlines-save-v1` holds best line, district missions, Word Spots, best Line Runs, checkpoint, and input/accessibility/sound preferences. Existing v1.2 best score migrates when there is no v1 save. Export/import uses a local JSON file and validates loaded fields. | Save round trip and restored settings/words are exercised. |
| BOLO learning and identity underused | Tricks near visible Word Spots unlock script, English meaning, and a short pronunciation hint in the HUD and district Codex. Instinct briefly reveals nearby words, a marked gap, and possible rail-to-bank transfers. Aura grows through Spark, Flow, and Instinct. | Discovery, Codex update, and Aura tier are covered by the smoke test. |
| Trial, ghost, visual depth, minimap | A 60-second score run, five-second local ghost race, limited combo trail, stall awnings and shadows, speed camera lookahead, and multi-vertex minimap roads are present. Reduced motion disables the trail, camera lookahead, and pulsing. | Timed run, ghost completion, and a three-point minimap road are exercised. |

**Aura thresholds:** Spark starts at 180 live line points, Flow at 900, and Instinct at 2400, measured as current combo × multiplier. Flow and Instinct give modest pop and push recovery changes to reward continued lines; these changes are independent of reduced-motion and balance-assist settings. Aura's ring and trail have no separate score bonus. Thresholds and boosts are game-tuning values to test with players.

**Word Spot copy:** The romanized pronunciation cues are deliberately short and approximate. Have Punjabi and Hindi speakers review script, nuance, pronunciation, and commercial-context placement before public release. No automated voice service or network pronunciation is included.

## Input map

| Action | Controller in a browser using standard mapping | Keyboard + mouse | Touch |
|---|---|---|---|
| Ride / push / brake | Left stick / R2 / Circle | WASD / Shift / B | Stick / PUSH / BRAKE |
| Charged ollie | Hold/release Cross; Flow also accepts right-stick down→up | Hold/release Space or left click | Hold/release POP |
| Flip / grab / grind | Square / Triangle / R1 | J or middle click / K or right click / E | FLIP / GRAB / GRIND |
| Manual / revert | Hold L1 / L2 near landing | Hold M / Q | Hold MANUAL / REVERT |
| Instinct / BOLO Spot / retry | L3 / Create / R3 | I / C / R | INSTINCT / SAVE / RETRY |
| Menu / ghost | Options / menu replay | Tab / G | MAP / menu replay |

The face-button actions remain available in Flow. Right-stick X corrects manual balance and spins the skater while airborne; Z/X correct balance on keyboard. Native DualSense haptics and console SDK mapping are future work. Standard Gamepad browser mapping does not establish hardware parity on a physical PS5.

## What should be tested next

1. **Feel:** Test a real DualSense over USB and Bluetooth, then tune projection radius, entry angle, speed and endpoint releases. The prototype still has top-down board physics rather than stance-aware 3D animation or real skate surface simulation.
2. **Mobile:** Test portrait and landscape at several physical sizes, reach of the twelve-button grid, touch cancellation when apps change focus, color contrast, and performance under thermal throttling. Canvas pixel ratio is capped and particles are bounded, but no physical-device frame-time measurements have been made.
3. **Audio and language:** Listen on phone speakers/headphones; verify mute, OS autoplay rules, and volume. Get bilingual review and record licensed voices only if pronunciation becomes an audio feature.
4. **Content and hub:** Connect districts with believable travel routes; replace mock foot traffic with purposeful behaviors. The JSON file is an import/export hook; no account synchronization or backend is implemented. Add custom remapping and a reviewed privacy model before any online ghost sharing.

## Reproducible checks

From the repository root, run `node prototypes/tests/delhi-streamlines-v1.3.smoke.cjs`. This mocks Canvas, a standard controller, touch controls, local storage, and Web Audio to verify the transitions in the table. It does not replace a real browser, physical controller, or PS5 compatibility test. Embedded JavaScript also passes `node --check` when extracted from the HTML file.

## References for the design comparison

- EA, [Get Control in skate.](https://www.ea.com/games/skate/skate/news/get-control) — stick flicks, controller presets, assists and camera options.
- Activision, [Tony Hawk's Pro Skater 1 + 2 Warehouse guide](https://blog.activision.com/tony-hawk/2020-08/THPS-Demo-Everything-You-Need-to-Know) — manual and revert combo linking.
- MDN, [Gamepad mapping](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping) and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — browser interface considerations.
