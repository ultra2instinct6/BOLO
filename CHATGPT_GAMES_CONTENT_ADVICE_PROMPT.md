# ChatGPT Prompt: BOLO Games Content Review + Advice (Paste-ready)

Copy/paste everything between **PROMPT START** and **PROMPT END**.

---

## PROMPT START

You are helping me improve the **content** (not code) of a kids grammar app called **BOLO**. Please give advice and sample questions.

### Hard constraints (important)
- This is a vanilla JS SPA with **globals only** (no imports/bundler). But you should provide **content/design advice only**.
- Games content is stored in raw question banks and then normalized at runtime.
- I do NOT want new screens or new game modes—work within the existing 4-game structure.
- TrackIds must be one of: `T_WORDS`, `T_ACTIONS`, `T_DESCRIBE`, `T_SENTENCE`, `T_READING`.

### The 4 existing games
1) **Game 1: Tap the Word**
   - Raw schema:
     ```js
     { sentence: string, question: string, correctWord: string, trackId: string }
     ```
   - Validator rule: `correctWord` must appear **exactly once** in the sentence after simple tokenization (split on spaces; punctuation at ends is stripped). Avoid ambiguity (no repeated word forms).

2) **Game 2: Part of Speech**
   - Raw schema:
     ```js
     { word: string, correctPartId: string, trackId: string }
     ```
   - `correctPartId` must be one of:
     `noun`, `pronoun`, `verb`, `adverb`, `adjective`, `preposition`, `conjunction`, `interjection`, `article`

3) **Game 3: Tense Detective**
   - Raw schema:
     ```js
     { sentence: string, correctTense: string, trackId: string }
     ```
   - `correctTense` must be one of: `present`, `past`, `future`

4) **Game 4: Sentence Check**
   - Raw schema:
     ```js
     { trackId: string, options: [string, string], correct: string }
     ```
   - Constraint: `correct` must match exactly one of the two options.
   - Style requirement: options should be “almost the same” (near-miss pairs).

### Current content size & distribution (as of Dec 2025)
- Total raw questions: 84
  - GAME1: 21
  - GAME2: 23
  - GAME3: 17
  - GAME4: 23

Track distribution by game (raw banks):
- GAME1: `T_WORDS` 4, `T_ACTIONS` 5, `T_DESCRIBE` 4, `T_SENTENCE` 5, `T_READING` 3
- GAME2: `T_WORDS` 5, `T_ACTIONS` 5, `T_DESCRIBE` 4, `T_SENTENCE` 7, `T_READING` 2
- GAME3: `T_ACTIONS` 9, `T_WORDS` 2, `T_DESCRIBE` 2, `T_SENTENCE` 2, `T_READING` 2
- GAME4: `T_SENTENCE` 8, `T_WORDS` 3, `T_ACTIONS` 4, `T_DESCRIBE` 3, `T_READING` 5

Daily Quest uses ONLY Game 2/3/4 (Game 1 excluded).

### Punjabi support
- UI supports Punjabi, but most game questions are English-only.
- You may suggest Punjabi for hints/explanations in simple kid-friendly Gurmukhi.

### What I want from you

A) **Content critique** (prioritized)
- Where are the biggest learning-value gaps?
- Which games have weak distractors, ambiguity risks, or repetitive patterns?
- Which track(s) are under-served by which game?

B) **Content principles**
- Provide 5–10 concrete principles for writing good questions for each game.

C) **Balanced coverage plan**
- Propose target distributions per game (by track and by difficulty) that would make learning more balanced.
- Explain how to avoid repetition in a daily-quest style system.

D) **Sample questions to add**
Provide **12 new questions per game** (48 total), with the following formatting:

- For Game 1:
  - `trackId`, `sentence`, `question`, `correctWord`
  - plus optional: `hintEn`, `hintPa`, `explanationEn`, `explanationPa`

- For Game 2:
  - `trackId`, `word`, `correctPartId`
  - plus optional: `hintEn`, `hintPa`, `explanationEn`, `explanationPa`

- For Game 3:
  - `trackId`, `sentence`, `correctTense`
  - plus optional: `hintEn`, `hintPa`, `explanationEn`, `explanationPa`

- For Game 4:
  - `trackId`, `options` (two strings), `correct` (one of the options)
  - plus optional: `explanationEn`, `explanationPa`

Constraints for the samples:
- Keep vocabulary age-appropriate.
- Avoid cultural references that require outside knowledge.
- Keep sentences short (ideally ≤ 9 words).
- For Game 4, keep pairs truly “near miss” (one tiny grammar change).

E) **Validator guidance**
- Tell me what should be hard errors vs warnings when validating new content.

### Output format
- Section 1: Key Issues
- Section 2: Principles
- Section 3: Coverage Targets
- Section 4: New Questions (group by game)
- Section 5: Validation Recommendations

## PROMPT END
