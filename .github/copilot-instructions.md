# BOLO (vanilla JS SPA) – Copilot coding instructions

## Big picture
- This is a single-page web app: screens are `<section class="screen">` blocks in `app/index.html` and navigation is class-toggled via `UI.goTo(screenId)`.
- No bundler/build step. Everything is loaded as `<script ... defer>` and communicated through globals.
- Active global "modules" (plain objects): `State`, `UI`, `Lessons`, `Games`, `Reading`, `Sound`, `TypingPremium` (+ typing sub-modules), `PracticePacks`, `Practice` (+ practice sub-modules).
- **Not loaded** (files exist on disk but are excluded from `index.html`): `Progress`, `ParentGuide`, `TypeGame`. There is no `DailyQuest` module.
- Content lives in `app/data/*.js` as global constants (`TRACKS`, `LESSONS`, `READINGS`, `GAMES_DATA`, `TYPING_PROMPTS`, `BOLO_TYPE_DEFINE_VOCAB_V1`, `USMLE_STEP_TOP_500_FACTS`, etc). Feature logic lives in `app/js/*.js`.

## Run / debug
- Start a local server from `app/`: `cd app && npm start` (runs `python3 -m http.server 8000 --directory .`).
- Open `http://localhost:8000/` (serving is preferred over `file://` so script loading is consistent).
- Debug via browser DevTools; initialization sanity-check happens in `app/js/app.js` and logs missing globals.

## Key architectural conventions
- **Globals, not imports**: avoid introducing `import/export` unless you’re deliberately refactoring the whole loading model.
- **State is persisted** in `localStorage` under key `boloAppState_v1` (see `app/js/state.js`). Changes to state shape should be additive + guarded (e.g., `ensureTracksInitialized`).
- **Screen wiring**: button IDs in `app/index.html` are bound in module `init()` methods and in `app/js/app.js`. If you rename an element id/class, update the corresponding bindings.
- **Script order matters**: `app/index.html` loads `app/js/utils.js` → `app/data/*.js` → `app/js/state.js` → UI/feature modules → `app/js/app.js` last.

## Lessons: catalog sync
- All 32 lessons use the **new format**: `LESSONS.L_SOMETHING = { metadata: {...}, steps: [...] }` (normalized by `Lessons.normalizeLesson()` / `Lessons.getSteps()` in `app/js/lessons.js`).
- Lesson listing metadata lives in `LESSON_META` in `app/data/tracks.js`. `Lessons.ensureLessonCatalogSync()` keeps `LESSONS` and `LESSON_META` aligned.
- When adding a new lesson ID starting with `L_`, update both:
  - `app/data/lessons.js` (content)
  - `app/data/tracks.js` `LESSON_META` (id/labels/trackId/difficulty)

## XP & progress (stubs)
- `State.awardXP(amount, { trackId })` and `State.recordQuestionAttempt(trackId, correct)` exist but are **no-op stubs** that return immediately. Do not rely on them for tracking until they are implemented.

## Reading content format
- `READINGS` is built in `app/data/readings.js` from `BUNDLES` (10 books × 10 stories) + `BOOK*_CUSTOM_STORIES` arrays, normalized by `normalizeCustomStory()`.
- Questions use `multipleChoiceQuestions` array with `{ question, questionPa, choices, choicesPa, correctChoiceIndex, explanation, explanationPa }`.
- Vocab data lives in `READING_VOCAB_DETAIL` / `READING_VOCAB` in `app/data/readingVocab.js` (Books 1–10).
- The active reader is `_renderStoryReader()` in `app/js/reading.js`. It dynamically creates its DOM inside `reading-detail-selection-host`. The old card-based reader code (~2,000 lines) is dead but null-guarded.

## Play / Games (Coming Soon)
- The Play module card is gated as `is-coming-soon` / `aria-disabled="true"` on the home screen. The `screen-play` DOM has been stripped to a skeleton (status bar + completion panel only). All question/option/feedback element lookups in `games.js` are null-guarded and silently no-op.
- Game data exists for games 1–6, 8, 10–12 in `app/data/games.js`. Game 12 has no UI tile.

## Typing / Practice
- `TypingPremium` self-initializes via its own `DOMContentLoaded` listener in `app/js/typing.js`.
- `Practice` subsystem (`app/js/practice/*.js`) initializes lazily on first open.
- Typing is gated as Coming Soon on the home deck and header tab.

## Practical editing tips
- Prefer small, localized changes; keep the existing “module object” pattern and DOM id conventions.
- Avoid double-binding: several modules set `dataset.*Bound` flags before adding listeners (example: `UI.wireModalCloseButtons()` in `app/js/ui.js`).
- If you add a new script/module, ensure it’s included in `app/index.html` **before** `app/js/app.js` (app init must load last).
