# Delhi Streamlines / BOLO Streamlines — concept 1.2

**Status:** A playable, single-file browser prototype. The Central Delhi map uses the user's city-map image as a compositional reference. Streets, skate fixtures, geometry, travel times, and missions are fictional; no third-party map tile or photograph is embedded. This document describes the current build and a practical production direction, not an assertion that a PS5 game exists.

## The pitch

Build satisfying, player-authored skate lines through four Delhi-inspired districts. The first ten seconds should feel good: push into a lane, charge an ollie, clear a bank, land into a manual, tap a revert, and follow the teal rail into the next spot. BOLO Instinct supplies observation and route reading; BOLO Aura supplies the expressive layer of rhythm, focus, and persistence. These are original design interpretations, rather than imports of unverified mechanics from another game.

The district should be busy and lived in. People are going somewhere; stalls are working businesses. A skater earns space by choosing marked community spots, not by disrupting a market. The scene moves between public infrastructure, small craft and food businesses, and polished commercial streets without treating residents as scenery or turning a neighborhood's income into a difficulty rating.

## World and progression

| District | Playable route | Visual anchors | Designed obstacles | Opening route |
|---|---|---|---|---|
| Central Delhi, the main map | Janpath service plaza → museum-side approach → India Gate view promenade → Khan Market connector | National Museum green corridor, Jantar Mantar, Agrasen ki Baoli, Bangla Sahib, India Gate | Banks at the Janpath approach, museum-side handrails, promenade ledges | Ollie → grind → land flip → reach Khan connector |
| Punjabi Market | Tea lane → Punjabi mandi → metro plaza → community plaza | Punjabi and Hindi shop signs, phulkari-inspired fabric colors, sweets, books and repairs | Market approach banks, metro ledge, plaza rail | Ollie → flip → grind → explore plaza |
| Old Delhi Bazaar | Craft lane → spice lane → print lane → festival lane | Shaded shopfronts, print workshops, hanging lights, food and craft stalls | Low ledges and banks placed in the open lane | Ollie → grind → manual → explore final lane |
| Community Skate Ground | Warm-up rail → left bowl → centre rail → transfer bowl → quarter pipe | Neighborhood art wall, youth centre, water and first aid | Two bowls, banks, rails, quarter pipes | Launch → grind → flip → explore final ramp |

These are selectable areas in the HTML demo. For a full release, connect them with actual rideable links, a transit route selector, a slower exploration mode, and an optional continuous city session. Keep protected landmark grounds and religious spaces as observation and story points. Obtain local review before turning a named real place into an interactive level.

## Two input philosophies

The **Arcade** preset favors fast actions and readable combos, inspired by Tony Hawk's focus on tricks, manuals, and reverts. **Flow** adds a timed down-to-up right-stick flick, inspired by *skate.*'s Flick-It direction. The preset switch leaves face-button actions available, so a player can transition gradually. We avoid reproducing either game's move set or interface verbatim.

| Move | PS5-style standard browser mapping | Keyboard and mouse | Touch |
|---|---|---|---|
| Steer | Left stick or D-pad | WASD or arrows | Left thumb stick |
| Push / brake | R2 / Circle | Shift / B | Hold PUSH / BRAKE |
| Charged ollie | Hold and release Cross; in Flow, right-stick down then up | Hold and release Space or left click | Hold and release POP |
| Flip / grab | Square / Triangle while airborne; in Flow, diagonal right-stick flick can flip | J or middle click / K or right click | FLIP / GRAB |
| Grind | R1 near marked teal rail with speed | E | GRIND |
| Manual / balance | Hold L1; right-stick X corrects balance when assist is off | Hold M; Z/X correct balance | Hold MANUAL; balance assist defaults on |
| Revert / spin | L2 near landing / right-stick X in air | Q / spin unavailable for now | REVERT / spin unavailable for now |
| BOLO Instinct | L3 toggles the challenge-route cue | I | INSTINCT |
| Save spot / retry | Create / R3 | C / R | Retry in MAP menu |
| Map / pause | Options; D-pad and Cross select a district | Tab or P; arrows and Enter select | MAP and tap district |

Standard Gamepad API button indices are an interoperability assumption, not a guarantee of native DualSense support. Test physical DualSense controllers over USB and Bluetooth in target browsers, then create a native console input profile separately. Avoid using the system PlayStation button for game actions.

## Scoring and movement rules now in the prototype

1. Steer and push with acceleration, drag, and a speed cap. Ollie height rises with button charge.
2. Nearby marked rails accept a grind when the board has enough speed. Banks and bowl lips automatically launch a moving skater and have a short retrigger delay.
3. Flip, grab, grind, spin, bank launch, manual, and revert award points. Different trick types raise the combo multiplier. A manual keeps the line alive; a revert connects a landing back into the next trick during a short window.
4. Bank a line when the grace period ends. Bank a matching trick near a challenge marker to advance that district's route. The best line persists locally in the browser; challenge progress currently persists only during the open session.
5. Set a retry point. Colliding with a car returns the skater to that point. People move aside and are never targets or score objects.
6. Instinct is an optional route line and target ring for the current challenge. Aura is a visual ring that intensifies with the active combo; it does not alter points. Reduced motion removes its pulse.

## Next production passes

- **Feel:** Add stance, carving arcs, foot placement, grind entry and exit angles, air control, ledge collision, and explicit bail recovery animation. Tune ollie charge and manual difficulty with real controller playtests. Add remapping and left-handed/touch accessibility profiles.
- **World:** Turn district cards into continuous roads and transit connectors. Give markets time-of-day changes without piling up decorative crowds. Commission location and language review by Delhi and Punjabi creators. Use local musicians and record real permitted street ambience with clear licensing.
- **BOLO identity:** Deepen Instinct's route cue into a short scan of surfaces and clean lines with no score advantage. Add optional sounds to Aura. Provide independent flash and shake toggles for future effects; preserve identical scoring with accessibility options enabled.
- **Modes:** Add a 90-second line session, free skate, local ghost replay, a small set of video-clip challenges, and community-made spot packs. Moderation and privacy design are required before online sharing.
- **Mobile:** Cap pixel ratio, cull offscreen objects, keep 60 Hz simulation with a performance fallback, scale touch targets across safe areas, and provide a low-detail toggle. Revisit portrait reach and color-contrast with devices and one-handed users.
- **Console:** Replace browser input polling with the platform SDK, test trigger thresholds, pause/home handling, haptics, frame pacing, safe areas, suspension, and accessibility requirements. A web demo alone does not constitute a PS5 build.

## References informing the control comparison

- EA, [Get Control in skate.](https://www.ea.com/games/skate/skate/news/get-control): steering, flick tricks, controller presets, assists.
- EA, [skate. Features](https://www.ea.com/games/skate/skate/features): spots and player-created routes.
- Activision, [Tony Hawk's Pro Skater 1 + 2 Warehouse Demo guide](https://blog.activision.com/tony-hawk/2020-08/THPS-Demo-Everything-You-Need-to-Know): manuals and revert combo links.
- MDN, [Gamepad mapping property](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping): web-controller compatibility considerations.
