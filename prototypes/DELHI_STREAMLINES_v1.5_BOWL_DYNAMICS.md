# Delhi Streamlines v1.5 — board dynamics and rideable bowls

**Playable file:** `delhi-streamlines-v1.5.html`. Open it directly in a current browser. The four-neighborhood, 6,200 × 4,100 connected city from v1.4 remains available, with a more physical skate layer and a stronger illustrated bowl scene. Choose **Bowl practice · quick drop-in** in the opening atlas to start just outside the Community Skate Ground's first bowl, facing its lip.

This is an arcade-style, top-down 2.5D **concept**, with no downloaded assets or external dependencies. It uses fictional world units rather than a full 3D rigid-body simulation. The bowls are no longer automatic launch rings: their floor is lower than the deck, and the board can roll into, across, and out of that height difference.

## Try a complete bowl line

1. Choose **Bowl practice · quick drop-in**. The board starts on flat ground beside the community bowl, facing inward. Hold Shift / R2 / PUSH or steer left to enter; a slow entry stays on the surface.
2. Release push and watch the **BOWL ↓ DROP** readout. Gravity adds speed toward the lower floor. Keep your direction through the center and carve up the opposite wall.
3. Hold push as you **descend**, especially before crossing the floor. The pump adds momentum. The board leans during a turn, and the HUD changes to **BOWL ↑ CLIMB** as it runs uphill. A clean traverse from the floor to a far wall can score a **deep carve**.
4. Bring enough outward speed to the lip for a **lip transfer**. Low speed turns the rider back down the bowl. You can also hold/release POP from inside the bowl to ollie; airborne height follows the floor below the board.
5. Press SAVE / C / Create at a favorite bowl starting position. RETRY / R / R3 restores the board onto that actual floor height. Record a five-second ghost and run the same line again.

| Action | Standard Gamepad in browser (PS5-style naming) | Keyboard and mouse | Touch |
|---|---|---|---|
| Steer and carve | Left stick | WASD or arrows | Left joystick |
| Push and pump on descent | R2 | Shift | PUSH |
| Ollie from the bowl floor | Hold/release Cross | Hold/release Space or left click | Hold/release POP |
| Air flip / grab | Square / Triangle | J / K | FLIP / GRAB |
| Retry / return to atlas | R3 / Options | R / Tab | RETRY / MAP |

The controller uses browser **Standard Gamepad** numbering, with the earlier Arcade and Flow presets. This is not a native PlayStation 5 build; physical DualSense behavior and haptics remain unverified.

## Surface and motion model

For an oval bowl centered at `(cx, cy)`, with radii `rx`, `ry`, the sample radius and floor height are:

```text
r² = ((x − cx) / rx)² + ((y − cy) / ry)²

inside the bowl (r² < 1):
    floor height = −depth × (1 − r²)
outside (r² ≥ 1):
    floor height = 0
```

The center is deepest and the lip meets street level. Each fixed simulation step adds acceleration opposite the floor's height gradient while the wheels are grounded. Going inward therefore adds momentum; going outward costs momentum. Modest rolling drag allows an unpowered traverse to reach a far wall, while a push made during the descent adds a distinct pump impulse. Input turns the board progressively at speed, so a hard direction change reads as a lean and carve instead of an instant sideways flip.

Airborne `z` is measured above the **local** floor. As the skater flies over terrain that falls away, clearance grows; as the floor rises under a landing, clearance shrinks. This keeps ollies, flips and landings visually tied to bowl height. The character and shadow shift subtly inside the bowl, while the deck angle reflects carving and descent.

A lip transfer requires a grounded crossing from inside to outside with outward speed above the threshold. Entering toward the center does **not** launch. A rider without enough energy rolls back down; braking reduces speed normally. The flow from bowl to line is:

| Situation | Physical response | Feedback |
|---|---|---|
| Slow entry, inward | Wheels stay on the surface; downhill gravity builds speed | Descending HUD; deeper skater/shadow; soft drop cue |
| Traverse through the center | Existing speed carries the rider up a far wall | Smooth board turning, board lean, one scored deep carve |
| Shift / R2 / PUSH on the descent | Additional impulse along travel direction | Short amber pump ring, higher momentum |
| Outbound below lip speed | Gravity reverses travel before the deck | No false launch or trick award |
| Outbound above lip speed | Controlled takeoff and airborne landing | Lip-transfer combo, sound cue, air-height display |
| Ollie over a changing floor | Clearance adjusts to the new ground height | Shadow and body remain tied to the bowl surface |

**Current tuning, in world units:** Bowl 1 has radii 150 × 105 and depth 82; Bowl 2 has radii 160 × 118 and depth 66. Bowl gravity uses 475 acceleration units scaled by the slope. Bowl rolling drag is 0.996 per 60 Hz step, or 0.997 while pushing; braking is stronger. Lip takeoff requires outward speed over 145 and total speed over 165. These values are meant for player tuning, not real-world skate or vehicle physics.

The park's opening challenge now accepts either a launch from a practice bank or a scored community-bowl carve. Existing district mission counts remain meaningful for v1.4 saves; the version 2 local JSON format continues to store city coordinates and checkpoint, and the bowl's floor height is recomputed from that position on reload.

## Retro-modern BOLO visual layer

v1.5 follows the broad approach of [BOLO.Aura](https://bolo-instinct.com/games/bolo-aura/): an approachable overhead illustration, warm stone and gold detail, saturated accent colors, soft shadows and a dark-teal HUD. All bowl and rider marks are new vector drawings; the prototype does not reuse BOLO.Aura imagery.

- **Bowl depth:** An enamel-colored rim sits above a dark inset wall. Four successive contour rings follow the parabolic floor, with a brighter floor center and a soft offset shadow. High detail adds a gentle radial color shift and short rim markings; Low keeps the silhouettes and playable edge.
- **Character and board:** The skater has a separated deck, wheels, shoe placements, jacket, arms and cap. The deck tilts with turning and slope; its shadow stays below the airborne board and moves visually into the lowered bowl.
- **City continuity:** The park gains a patterned practice ground and painted approach cue. The atlas now marks both bowls alongside roads, connectors, mission and player position. The existing bazaar, Punjabi market and central-city layers stay connected to this more dimensional skating area.
- **Sound and HUD:** A quiet synthetic drop, carve and lip cue sits beside the existing wheel, ollie, rail and bank cues. A compact rider readout reports street, drop, climb or air state and momentum without pretending that world units are measured kilometres per hour.
- **Comfort and performance:** Reduced motion continues to remove trail and camera lookahead and now also removes the pump ripple. Auto detail simplifies decorations on coarse-pointer devices; High and Low remain available. Bowls and buildings are culled outside the view, and the simulation remains fixed at 60 steps per second.

Landmark grounds and working stalls remain protected scenery. These are invented skate features in a composite Delhi-inspired city, not recommendations to skate at a named real-world monument or shop. Punjabi and Hindi signs and cultural setting should be reviewed with local creators before publication.

## Reproducible checks

Run `node prototypes/tests/delhi-streamlines-v1.5.smoke.cjs` from the repository root. The automated simulation verifies:

- Inward entry builds depth and **does not** launch.
- A rider starting near the lip gains downhill speed, reaches the floor, climbs the far wall and earns one carve; slow outward travel rolls back.
- Timed pushing on descent increases momentum; sufficient outward velocity produces a gated lip launch.
- Airborne height responds to floor change, and a bowl checkpoint / browser save reloads at the correct depth.
- Board yaw and lean respond progressively at high speed, while high-detail bowl shading renders.
- The prior connected-city routes, controls, rail endpoints, progression, ghost, trials, old save migration and mobile DPR behavior still pass.

The embedded JavaScript also passes a syntax check. These checks use a simulated Canvas, inputs and audio. The artwork, speaker mix, button reach and frame time need a real browser and physical-phone / controller playtest.

## Next dimension to build after this concept

A production version could expand to multiple connected elevations with a sculpted snake run, side-on replay camera, truck contact and grinding angle, stance-aware animation, wheel friction per surface, pump timing based on compression, independent wheels and deck collision, and revised haptic cues for a native console build. Those systems are **not** implemented in v1.5. First tune bowl trajectories, user steering and input reach with skaters so extra realism does not damage the arcade flow.
