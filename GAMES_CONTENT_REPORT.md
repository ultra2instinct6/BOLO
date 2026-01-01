# BOLO – Games Content Report (Dec 2025)

This report summarizes the **content** and **wiring** of BOLO’s Games + Daily Quest system, based on the current repo state.

## 1) Scope & key constraints

- **Vanilla JS SPA, globals-only** (no bundler/imports). Script order is defined in `app/index.html`.
- Gameplay UI is a single screen: `#screen-play`. Navigation uses `UI.goTo(screenId)`.
- Game content lives in `app/data/games.js` as global arrays and helper label maps.
- Runtime logic lives in `app/js/games.js` (round engine, difficulty, hints/help, completion panel).
- Daily Quest uses a deterministic per-day/per-profile queue: `app/js/dailyQuest.js`.

## 2) File inventory (game-related)

### Data
- `app/data/games.js`
  - Raw banks: `GAME1_QUESTIONS`, `GAME2_QUESTIONS`, `GAME3_QUESTIONS`, `GAME4_QUESTIONS`
  - Labels: `PARTS_OF_SPEECH_LABELS`, `TENSE_LABELS`
  - Quest normalization builders: `normalizeGame{1..4}Questions()` and `buildAllGameQuestions()`
  - Registry: `GAMES_DATA` (maps `GAME1..GAME4` → raw arrays)

- `app/data/tracks.js`
  - Track metadata used for display and reporting: `TRACKS` (`T_WORDS`, `T_ACTIONS`, `T_DESCRIBE`, `T_SENTENCE`, `T_READING`)

### Runtime / UX
- `app/js/games.js`
  - Round engine (`beginRound`, `render`, `submitChoice`, `next`, completion panel)
  - Normalization/adapters for normal play and quest play:
    - `normalizeFromRawGame(gameNum, raw, idx)`
    - `normalizeFromDQQuestion(q)`
    - `normalizeFromLessonStepTapWord(lessonId, step, stepIndex)` (adds lesson-derived TapWord items)
  - Difficulty:
    - `State.getPlayDifficulty()` / `State.setPlayDifficulty()` (persisted)
    - selection filtering for TapWord; reduced choice sets for POS/Tense
  - Dev validator: `window.GamesDebug.runPhase2Validation()` (auto-runs with `?debugGames=1`)

- `app/js/dailyQuest.js`
  - Deterministic daily queue: one each of `GAME2`, `GAME3`, `GAME4` (shuffled by seeded RNG)
  - Each queued game uses **3 questions** chosen deterministically
  - Quest completion callback returns to Daily Quest screen

- `app/js/state.js`
  - XP constants and persistence
  - Per-profile difficulty persistence (`settings.playDifficultyByProfile`)
  - Quest completion/streak awarding logic (via `State.markDailyQuestCompleted(dateKey)`)

### UI anchors
- `app/index.html`
  - Play screen DOM: `#play-game-label`, `#play-difficulty-tag`, `#play-track-label`, `#play-question-text`, `#play-options`, `#play-feedback`, `#btn-play-next`, completion panel, and game buttons.

- `app/css/main.css`
  - Styles for Play UI and completion panel (`.play-complete-panel`) plus global button styles.

## 3) Games overview (what the player does)

- **Game 1: Tap the Word**
  - Player taps the target token in a sentence.
  - Content sources:
    1) `GAME1_QUESTIONS` (raw bank)
    2) **Lesson-derived TapWord** questions mined from lesson steps (`LESSONS`) at runtime.

- **Game 2: Part of Speech**
  - Player picks the part-of-speech label for a word.

- **Game 3: Tense Detective**
  - Player selects tense (Present/Past/Future) for a sentence.

- **Game 4: Sentence Check**
  - Player chooses the correct sentence from two near-miss options.

## 4) Raw question schemas (authoring format)

All are defined in `app/data/games.js`.

- **GAME1** item schema:
  ```js
  { sentence: string, question: string, correctWord: string, trackId: string }
  ```

- **GAME2** item schema:
  ```js
  { word: string, correctPartId: string, trackId: string }
  ```

- **GAME3** item schema:
  ```js
  { sentence: string, correctTense: string, trackId: string }
  ```

- **GAME4** item schema:
  ```js
  { trackId: string, options: [string, string], correct: string }
  ```
  Constraint: `correct` must equal either `options[0]` or `options[1]`.

## 5) Current content counts (raw)

Raw counts from `app/data/games.js`:

- GAME1: **21**
- GAME2: **23**
- GAME3: **17**
- GAME4: **23**
- Total raw across 4 games: **84**

Note: **Normal-play GAME1** can be larger in practice because `app/js/games.js` also mines TapWord questions from `LESSONS`.

## 6) Track distribution (raw banks)

Track distribution by game (from raw banks):

- GAME1: `T_WORDS` 4, `T_ACTIONS` 5, `T_DESCRIBE` 4, `T_SENTENCE` 5, `T_READING` 3
- GAME2: `T_WORDS` 5, `T_ACTIONS` 5, `T_DESCRIBE` 4, `T_SENTENCE` 7, `T_READING` 2
- GAME3: `T_ACTIONS` 9, `T_WORDS` 2, `T_DESCRIBE` 2, `T_SENTENCE` 2, `T_READING` 2
- GAME4: `T_SENTENCE` 8, `T_WORDS` 3, `T_ACTIONS` 4, `T_DESCRIBE` 3, `T_READING` 5

Overall (all games combined):

- `T_WORDS` 14, `T_ACTIONS` 23, `T_DESCRIBE` 13, `T_SENTENCE` 22, `T_READING` 12

## 7) Daily Quest content (what gets used)

Daily Quest (in `app/js/dailyQuest.js`):

- Uses **exactly one each** of: `GAME2`, `GAME3`, `GAME4` (Game 1 excluded)
- Each queued game uses **3 questions**
- Selection is deterministic per day and per profile:
  - queue seed: `hashStringToInt(dateKey + ":" + profileId)`
  - per-game question seed: `seedInt + idx + hashStringToInt(gameId)`

Daily Quest eligible pool size (normalized):

- GAME2 + GAME3 + GAME4 = **63** questions

Daily Quest pool track distribution:

- `T_WORDS` 10, `T_ACTIONS` 18, `T_DESCRIBE` 9, `T_SENTENCE` 17, `T_READING` 9

## 8) Difficulty & learning mechanics (runtime)

Difficulty levels are 1–3 (Easy/Medium/Hard), persisted per profile.

- TapWord (Game 1): selection filters by token count
  - Easy: ≤ 5 tokens
  - Medium: ≤ 8 tokens
  - Hard: any

- POS / Tense (Games 2–3): reduces how many answer choices are shown
  - Easy keeps 5 options, Medium 7, Hard = all
  - Quest mode uses deterministic option shuffling.

Attempts-based feedback:

- Wrong 1×: show a hint/near-miss tip
- Wrong 2×: show correct answer + explanation and apply “Help”
  - TapWord: disables distractor tokens, emphasizes correct token
  - Other games: disables 1–2 distractors

## 9) Validation & QA hooks

- Dev validator:
  - Open in browser: `http://localhost:8000/?debugGames=1`
  - Or run: `window.GamesDebug.runPhase2Validation()` in console

Validator checks include:

- Required globals exist (`GAME*_QUESTIONS`, `normalizeGame*Questions`, `buildAllGameQuestions`, etc.)
- Raw schema checks for each game
- Strong TapWord correctness: `correctWord` must appear **exactly once** in tokenized sentence
- Runtime normalizer (`Games.normalizeFromRawGame`) must not drop questions
- Daily Quest normalized bank (`buildAllGameQuestions`) must have valid IDs and choices

## 10) Notable content patterns / weak points (content-focused)

- GAME3 is heavily skewed to `T_ACTIONS` (9/17). If you want broader track reinforcement, consider adding more tense sentences tagged to other tracks.
- Punjabi support in games is currently strongest at **microcopy level** (goal/example, generic hints). Most per-question Punjabi prompts/explanations are empty unless authored (lesson-derived TapWord can include authored `hint/explanation`).
- GAME1 is “special”: it expands with lesson-derived TapWord questions, so quality/coverage depends on lesson authoring consistency.
- Daily Quest excludes Game 1 entirely, so TapWord practice is not part of the daily loop.

---

## Appendix: How to recompute counts (dev)

From repo root:

```bash
node -e "const fs=require('fs');const vm=require('vm');const ctx={window:null};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('app/data/games.js','utf8'),ctx);console.log(ctx.GAME1_QUESTIONS.length,ctx.GAME2_QUESTIONS.length,ctx.GAME3_QUESTIONS.length,ctx.GAME4_QUESTIONS.length);"
```
