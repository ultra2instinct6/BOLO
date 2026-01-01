# BOLO (vanilla JS SPA) – Copilot coding instructions

## Big picture
- This is a single-page web app: screens are `<section class="screen">` blocks in `app/index.html` and navigation is class-toggled via `UI.goTo(screenId)`.
- No bundler/build step. Everything is loaded as `<script ... defer>` and communicated through globals.
- Code is organized as global “modules” (plain objects): `State`, `UI`, `Lessons`, `Games`, `Reading`, `Progress`, `DailyQuest`, `ParentGuide`.
- Content lives in `app/data/*.js` as global constants (`TRACKS`, `LESSONS`, `READINGS`, `GAMES_DATA`, etc). Feature logic lives in `app/js/*.js`.

## Run / debug
- Start a local server from `app/`: `cd app && npm start` (runs `python3 -m http.server 8000 --directory .`).
- Open `http://localhost:8000/` (serving is preferred over `file://` so script loading is consistent).
- Debug via browser DevTools; initialization sanity-check happens in `app/js/app.js` and logs missing globals.

## Key architectural conventions
- **Globals, not imports**: avoid introducing `import/export` unless you’re deliberately refactoring the whole loading model.
- **State is persisted** in `localStorage` under key `boloAppState_v1` (see `app/js/state.js`). Changes to state shape should be additive + guarded (e.g., `ensureTracksInitialized`).
- **Screen wiring**: button IDs in `app/index.html` are bound in module `init()` methods and in `app/js/app.js`. If you rename an element id/class, update the corresponding bindings.
- **Script order matters**: `app/index.html` loads `app/js/utils.js` → `app/data/*.js` → `app/js/state.js` → UI/feature modules → `app/js/app.js` last.

## Lessons: two formats + catalog sync
- `LESSONS` supports:
  - **Legacy format**: `LESSONS.noun = [ { step_type, english_text, ... }, ... ]` in `app/data/lessons.js`.
  - **New format**: `LESSONS.L_SOMETHING = { metadata: {...}, steps: [...] }` (normalized by `Lessons.normalizeLesson()` / `Lessons.getSteps()` in `app/js/lessons.js`).
- Lesson listing metadata lives in `LESSON_META` in `app/data/tracks.js`. `Lessons.ensureLessonCatalogSync()` keeps `LESSONS` and `LESSON_META` aligned.
- When adding a new lesson ID starting with `L_`, update both:
  - `app/data/lessons.js` (content)
  - `app/data/tracks.js` `LESSON_META` (id/labels/trackId/difficulty)

## XP, progress, daily quest
- Award XP via `State.awardXP(amount, { trackId })`; track accuracy via `State.recordQuestionAttempt(trackId, correct)`.
- Daily Quest is deterministic per day+profile: `DailyQuest.buildQueue()` uses seeded RNG and normalized questions from `buildAllGameQuestions()` in `app/data/games.js`.
- Streaks + milestone XP are handled centrally in `State.markDailyQuestCompleted(dateKey)`.
- Quest flows use globals: `window.DQ_QUEST_CONTEXT` (Learn/Reading) and `window.DQ_QUEST_MODE` + `window.DQ_CALLBACK` (DailyQuest → Games).

## Reading content format
- `READINGS` is an array in `app/data/readings.js`. Primary question is `questions[0]` with `{ q, options, explanation, correctIndex }`.
- `options` commonly use bilingual objects `{ en, pa }` (supported by `Reading.openReadingDetail()` in `app/js/reading.js`).

## Practical editing tips
- Prefer small, localized changes; keep the existing “module object” pattern and DOM id conventions.
- Avoid double-binding: several modules set `dataset.*Bound` flags before adding listeners (example: `UI.wireModalCloseButtons()` in `app/js/ui.js`).
- If you add a new script/module, ensure it’s included in `app/index.html` **before** `app/js/app.js` (app init must load last).
