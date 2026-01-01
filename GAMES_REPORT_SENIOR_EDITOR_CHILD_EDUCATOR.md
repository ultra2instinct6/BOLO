# BOLO Games Report (Senior Editor + Child Educator)

Date: 2025-12-28  
Scope: BOLO “Play” games (4 games) + Daily Quest integration  
Primary sources: app/data/games.js, app/js/games.js, app/js/dailyQuest.js

## Executive Summary
BOLO includes four short, repeatable grammar games designed for kids with optional Punjabi support.

Across all games, the platform uses a consistent learning loop:
- 10-question rounds (normal play) with difficulty (Easy/Medium/Hard).
- Two-attempt scaffolding: first wrong = hint + retry; second wrong = reveal answer + “help”.
- Immediate reinforcement: correct answer awards 5 XP per correct (configurable via State.XP_PER_CORRECT, default 5).
- Adaptive support: “Near-miss tips”, distractor reduction, and interleaved review of missed items.

From a content/editorial perspective:
- The question banks are substantial and distributed across the app’s track taxonomy.
- There is strong fallback hint/explanation infrastructure (POS/tense fallbacks + generic feedback), but some authored items and explanations need copy polish for correctness and consistency.

## Games Inventory (What exists today)
Question bank sizes (from app/data/games.js):
- Game 1: Tap the Word — 43 items
- Game 2: Part of Speech — 45 items
- Game 3: Tense Detective — 39 items
- Game 4: Sentence Check — 45 items

Track coverage (bank distribution by trackId):
- Game 1: T_WORDS 7, T_ACTIONS 10, T_DESCRIBE 8, T_SENTENCE 11, T_READING 7
- Game 2: T_WORDS 12, T_ACTIONS 10, T_DESCRIBE 7, T_SENTENCE 11, T_READING 5
- Game 3: T_ACTIONS 15, T_WORDS 6, T_DESCRIBE 6, T_SENTENCE 6, T_READING 6
- Game 4: T_SENTENCE 14, T_WORDS 7, T_ACTIONS 8, T_DESCRIBE 7, T_READING 9

Daily Quest integration (from app/js/dailyQuest.js):
- Each day generates a deterministic queue of three mini-rounds: GAME2 + GAME3 + GAME4 (3 questions each).
- GAME1 is not included in Daily Quest.

## Cross-Cutting Gameplay & Pedagogy Notes
These apply to all four games (from app/js/games.js).

### Round structure
- Normal play selects 10 questions from the game’s pool.
- After every 3 correct answers in normal mode, the engine may swap in a previously-missed question next (interleaved review), supporting retrieval practice.

### Scaffolding & feedback
- Attempt 1 wrong → hint only, no answer reveal, child can try again.
- Attempt 2+ wrong → show correct answer + explanation; apply “Help”:
  - Tap Word: disables distractors and visually emphasizes the correct token.
  - Other games: disables 1–2 distractors, reducing cognitive load.
- Correct feedback is intentionally brief on first-try correct; explanation appears mainly:
  - after a correct response on a later attempt, or
  - when an item was previously missed and later answered correctly (“Nice improvement!”).

### Language behavior (editor-facing)
- Punjabi support is a toggle; UI avoids showing empty Punjabi lines.
- Feedback has:
  - a compact on-screen block (active language only), and
  - a feedback overlay that can show bilingual “Answer / Hint / Why” sections.

### Editorial hygiene features
- A sanitizer adds missing terminal punctuation to sentences/options (ensuring . or ?).
- This prevents “dangling” prompt styles, but it also means editors may see console warnings during debug for missing punctuation.

## Game 1 — Tap the Word (tapWord)
Primary skill target: part-of-speech recognition in context (noun/verb/adjective/adverb/etc.), plus early sentence scanning.

### What the child does
- Sees a short sentence and a prompt like “Tap the noun”.
- Taps the correct token from a set of options.

### Difficulty
- Difficulty is inferred mainly from token count:
  - Easy: ≤ 5 tokens
  - Medium: ≤ 8 tokens
  - Hard: any length

### Content construction (important for editors)
- Game 1 is normalized into multiple-choice using:
  - curated function-word pools for articles/prepositions/conjunctions/pronouns/interjections, and
  - a content-word pool derived from Game 1 sentences.
- This reduces “unfair distractors” and makes distractors more meaningful.

### Strengths (educator lens)
- Strong for speed + automaticity: scanning for the grammatical target quickly.
- Token-in-context supports children who struggle with abstract labels.
- Difficulty aligns well with working memory constraints (shorter sentences for Easy).

### Risks / watch-outs
- Some prompts use “Tap the pronoun” but the target token can be capitalization-sensitive (e.g., “She”).
- If the same word appears twice in a sentence, the engine treats this as ambiguous; those items should be avoided.

### Copy/consistency checklist (senior editor)
- Ensure every sentence has terminal punctuation in the authored bank to avoid sanitizer warnings and improve readability.
- Ensure prompts consistently use “Tap the ___” with standard capitalization.
- Check hint/explanation Punjabi for clarity and age appropriateness.

## Game 2 — Part of Speech (pos)
Primary skill target: labeling word types (noun, verb, adjective, etc.) as an explicit classification task.

### What the child does
- Sees a single word: “Which part of speech is: ‘cat’?”
- Picks from labeled categories.

### Difficulty
- Difficulty controls the number of choices:
  - Easy keeps ~5 categories
  - Medium keeps ~7
  - Hard can include all categories

### Strengths (educator lens)
- Directly reinforces the grammar labels introduced in lessons.
- Near-miss tips provide kid-friendly definitions.

### Risks / watch-outs
- Many words are context-dependent in English (“play” can be noun/verb). The current bank uses straightforward items; future additions should avoid ambiguous items.

### Copy/consistency checklist (senior editor)
- Interjections are standardized to “Oops/Wow/Yikes/Hooray”.
- Function words (articles/prepositions/conjunctions) are lowercased.

## Game 3 — Tense Detective (tense)
Primary skill target: time cues and tense selection (past/present/future).

### What the child does
- Reads a sentence and selects Present/Past/Future.

### Strengths (educator lens)
- Builds the habit of scanning for time markers.
- Keeps the classification set small.

### Risks / watch-outs
- The game collapses multiple present forms into “Present,” which is fine for this age, but explanations should avoid over-precision.

### Copy/consistency checklist (senior editor)
- Ensure tense cues are consistent (“Right now…” → Present).
- Consider adding/standardizing explanations for less-obvious cues (“soon” / “next month”).

## Game 4 — Sentence Check (sentenceCheck)
Primary skill target: grammar correctness—primarily subject–verb agreement, but also common early errors (I/me, a/an, there/their, irregular past).

### What the child does
- Sees: “Pick the correct sentence:”
- Chooses between two near-identical options.

### Strengths (educator lens)
- Excellent for error detection and building a “sounds right” intuition.
- Two-choice format reduces overwhelm.

### Risks / watch-outs
- Explanations must be extremely clean; any sloppy rule statement risks teaching the wrong generalization.

### Copy/consistency checklist (senior editor)
- Ensure both options in a pair are punctuated consistently.
- Review explanation wording for grammatical accuracy and tone.
  - Example to review: “I goes with have.” could be simplified to “With ‘I’, use ‘have’.”

## Recommendations (Prioritized)
### High priority (copy + learning quality)
- Normalize punctuation in authored question banks (sentences and options).
- Audit all authored explanations for:
  - correct grammar rule statements,
  - consistent terminology,
  - kid-friendly phrasing.

### Medium priority (educator usability)
- Keep Game 2 bank unambiguous (avoid words that change part of speech by context).
- Provide guidance for when to use each game (before/after lessons).

### Nice-to-have (curricular alignment)
- Because Game 1 can pull tap-word questions from lesson steps, periodically review lesson question options/distractors to ensure they remain game-appropriate.

## Appendix: Key Design Facts
- XP per correct is State.XP_PER_CORRECT (default 5).
- Normal play rounds select 10 questions; Daily Quest uses 3-question rounds.
- Daily Quest includes GAME2/3/4 only.
- Help system: attempt 2+ wrong reveals answer + reduces distractors.
