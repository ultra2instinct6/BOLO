# Enhanced Bilingual Lesson Format with Interactive Learning Flow

## Overview

The lesson system has been upgraded to support an enhanced pedagogical flow with **bilingual 50/50 layout**, **auto-highlighted examples**, and **two-phase interactive guided practice** (tap-to-select, then visual confirmation with highlighting).

## New Learning Flow

```
┌─────────────────────────────────────────┐
│  OBJECTIVE SCREEN                        │
│  - Goal description                      │
│  - Available points                      │
│  - Difficulty rating (★★☆)              │
│  [Next]                                  │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  DEFINITION STEP                         │
│  ┌──────────────────┬──────────────────┐│
│  │ English (50%)    │ Punjabi (50%)   ││
│  │                  │                  ││
│  │ "A noun is a     │ "ਨਾਮ ਉਹ ਸ਼ਬਦ  ││
│  │ word that names  │ ਹੁੰਦਾ ਹੈ ਜੋ... ││
│  │ ..."             │                  ││
│  └──────────────────┴──────────────────┘│
│  (Auto-awards 1 XP on view)              │
│  [Next]                                  │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  EXAMPLE STEP (NEW FEATURE)              │
│  ┌──────────────────┬──────────────────┐│
│  │ English (50%)    │ Punjabi (50%)   ││
│  │                  │                  ││
│  │ The [cat] is     │ ਬਿੱਲੀ ਬਿਸਤਰੇ  ││
│  │ sleeping on the  │ 'ਤੇ ਸੋ ਰਹੀ ਹੈ। ││
│  │ [bed].           │                  ││
│  │                  │ ← Highlighted   ││
│  └──────────────────┴──────────────────┘│
│  (Auto-awards 1 XP on view)              │
│  [Next]                                  │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  GUIDED PRACTICE (TWO-PHASE)             │
│                                          │
│  PHASE 1: TAP-TO-SELECT                  │
│  ┌──────────────────┬──────────────────┐│
│  │ English (50%)    │ Punjabi (50%)   ││
│  │                  │                  ││
│  │ [The] [teacher]  │ ਅਧਿਆਪਕ ਨੇ... ││
│  │ [gave] [a] [book]│                  ││
│  │ [to] [the]       │ ← Non-clickable ││
│  │ [student].       │                  ││
│  │                  │                  ││
│  │ Tap all nouns:   │                  ││
│  │ • "teacher" ← yellow (selected)   ││
│  │ • "book" ← yellow (selected)       ││
│  │ • "student" ← blue (unselected)    ││
│  │                  │                  ││
│  └──────────────────┴──────────────────┘│
│  Feedback: (empty until correct)         │
│  [Next] ← disabled                       │
│                                          │
│  PHASE 2: AUTO-HIGHLIGHT (on correct)    │
│  ┌──────────────────┬──────────────────┐│
│  │ • "teacher" ← green (correct!)     ││
│  │ • "book" ← green (correct!)        ││
│  │ • "student" ← green (correct!)     ││
│  │                  │                  ││
│  │ Feedback: "Perfect! You found all │
│  │ 3 nouns! / ਸ਼ਾਨਦਾਰ! ਤੁਸੀਂ ਸਾਰੇ  ││
│  │ 3 ਨਾਮ ਲੱਭ ਗਏ!"                      ││
│  │                  │                  ││
│  │ All buttons disabled (no re-click) ││
│  │ [Next] ← enabled                   ││
│  └──────────────────┴──────────────────┘│
│  (Awards 3 XP on correct completion)     │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  QUESTION STEP                           │
│  ┌──────────────────┬──────────────────┐│
│  │ English (50%)    │ Punjabi (50%)   ││
│  │ "Which word is   │ "ਕਿਹੜਾ ਸ਼ਬਦ  ││
│  │ a noun?"         │ ਨਾਮ ਹੈ?"       ││
│  │                  │                  ││
│  │ [a] [b] [c] [d]  │ (Multiple choice)││
│  └──────────────────┴──────────────────┘│
│  (Awards 5 XP on correct answer)         │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  SUMMARY STEP                            │
│  ┌──────────────────┬──────────────────┐│
│  │ "You've Mastered │ "ਤੁਸੀਂ ਨਾਮਾਂ  ││
│  │ Nouns!"          │ ਨੂੰ ਸਮਝ ਗਏ!" ││
│  │                  │                  ││
│  │ Key Examples:    │                  ││
│  │ • person: ...    │                  ││
│  │ • place: ...     │                  ││
│  │ • animal: ...    │                  ││
│  │ • thing: ...     │                  ││
│  │                  │                  ││
│  │ Total Points: +18 XP               ││
│  └──────────────────┴──────────────────┘│
│  [Next] → Return to Learn screen         │
└─────────────────────────────────────────┘
```

## New Lesson Data Structure (Object Format)

### Complete Example

```javascript
LESSONS["L_EXAMPLE_NEW_FORMAT"] = {
  metadata: {
    titleEn: "Nouns - Example Lesson",
    titlePa: "ਨਾਮ - ਉਦਾਹਰਨ ਪਾਠ",
    labelEn: "Nouns (New Format)",
    labelPa: "ਨਾਮ (ਨਿਆ ਢੰਗ)",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: What Are Nouns?",
      titlePa: "ਸਿੱਖੋ: ਨਾਮ ਕੀ ਹਨ?",
      descEn: "Identify nouns in sentences",
      descPa: "ਵਾਕਾਂ ਵਿੱਚ ਨਾਮ ਨੂੰ ਪਛਾਣ ਕਰੋ",
      pointsAvailable: 15
    },
    difficulty: 1  // 1-3 stars
  },
  steps: [
    // Step 1: Definition (auto-award 1 XP)
    {
      type: "definition",
      contentEn: "A noun is a word that names a person, place, animal, or thing.",
      contentPa: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ...",
      points: 1
    },

    // Step 2: Example with highlighting (auto-award 1 XP)
    {
      type: "example",
      exampleEn: "The cat is sleeping on the bed.",
      examplePa: "ਬਿੱਲੀ ਬਿਸਤਰੇ 'ਤੇ ਸੋ ਰਹੀ ਹੈ।",
      highlightedWords: ["cat", "bed"],  // NEW: plain text array
      points: 1
    },

    // Step 3: Guided Practice (award 3 XP on correct)
    {
      type: "guided_practice",
      sentenceEn: "The teacher gave a book to the student.",
      sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।",
      clickableWords: ["teacher", "book", "student"],
      correctAnswers: ["teacher", "book", "student"],
      feedbackCorrect: "Perfect! You found all 3 nouns! / ਸ਼ਾਨਦਾਰ!",
      points: 3
    },

    // Step 4: Question (award 5 XP on correct)
    {
      type: "question",
      englishText: "Which word is a noun?",
      punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਮ ਹੈ?",
      options: ["run", "quick", "dog", "very"],
      correctAnswer: "dog",
      points: 5
    },

    // ... more example/practice/question steps ...

    // Final Step: Summary
    {
      type: "summary",
      titleEn: "You've Mastered Nouns!",
      titlePa: "ਤੁਸੀਂ ਨਾਮਾਂ ਨੂੰ ਸਮਝ ਗਏ!",
      summaryEn: "Nouns are essential building blocks of sentences.",
      summaryPa: "ਨਾਮ ਵਾਕਾਂ ਦੇ ਬੁਨਿਆਦੀ ਬਲਾਕ ਹਨ।",
      keyExamplesEn: ["person: teacher", "place: school", "animal: dog"],
      keyExamplesPa: ["ਵਿਅਕਤੀ: ਅਧਿਆਪਕ", "ਥਾਂ: ਸਕੂਲ", "ਜਾਨਵਰ: ਕੁੱਤਾ"],
      totalPoints: 18
    }
  ]
}
```

## Step Type Reference

### 1. Definition Step
**Type:** `"definition"`

**Fields:**
- `contentEn` (string): Definition in English
- `contentPa` (string): Definition in Punjabi
- `points` (number): XP awarded on view (typically 1)

**Behavior:**
- Displays bilingual content in 50/50 split
- Auto-awards points when viewed
- [Next] button enabled immediately

**Example:**
```javascript
{
  type: "definition",
  contentEn: "A noun is a word that names a person, place, animal, or thing.",
  contentPa: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ...",
  points: 1
}
```

---

### 2. Example Step (NEW ENHANCED VERSION)
**Type:** `"example"`

**Fields:**
- `exampleEn` (string): Sentence in English (plain text, no HTML)
- `examplePa` (string): Sentence in Punjabi (plain text, no HTML)
- `highlightedWords` (array): Words to highlight with yellow background
- `points` (number): XP awarded on view (typically 1)

**Behavior:**
- Displays bilingual content in 50/50 split
- Automatically highlights specified words with yellow background (#ffffcc)
- Auto-awards points when viewed
- [Next] button enabled immediately
- **Note:** NO HTML tags needed in data! Use `highlightedWords` array instead

**Example:**
```javascript
{
  type: "example",
  exampleEn: "The cat is sleeping on the bed.",
  examplePa: "ਬਿੱਲੀ ਬਿਸਤਰੇ 'ਤੇ ਸੋ ਰਹੀ ਹੈ।",
  highlightedWords: ["cat", "bed"],  // These words will be highlighted
  points: 1
}
```

**CSS Classes Used:**
- `.example-text-display`: Container for example text
- `.highlight-word`: Yellow highlighted words (background: #ffffcc, font-weight: 600)

---

### 3. Guided Practice Step (NEW TWO-PHASE VERSION)
**Type:** `"guided_practice"`

**Fields:**
- `sentenceEn` (string): Sentence in English for practice
- `sentencePa` (string): Sentence in Punjabi for reference
- `clickableWords` (array): Words that user can click/tap
- `correctAnswers` (array): Words that should be selected
- `feedbackCorrect` (string): Bilingual feedback shown on correct selection
- `points` (number): XP awarded on correct completion (typically 3)

**Behavior - Two Phases:**

**Phase 1: Tap-to-Select**
1. User sees sentence with words as buttons
2. Clickable words: blue border, light blue background (#f0f7ff), enabled cursor
3. Non-clickable words: gray border, gray background (#f5f5f5), disabled cursor
4. User taps/clicks a word → button turns gold (#ffd700, bold text)
5. User can deselect by tapping again → back to light blue
6. [Next] button remains DISABLED
7. **No feedback yet** - silent interaction

**Phase 2: Auto-Highlight (on correct selection)**
1. When all `correctAnswers` are selected (and ONLY those):
   - Feedback message appears: `feedbackCorrect`
   - All buttons change to green (#4caf50, white text, bold)
   - Animation: `pulse-correct` (scale 1→1.1→1 over 400ms)
   - All buttons disabled (no further clicking)
2. [Next] button becomes ENABLED
3. Points automatically awarded
4. User taps [Next] to continue

**Example:**
```javascript
{
  type: "guided_practice",
  sentenceEn: "The teacher gave a book to the student.",
  sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।",
  clickableWords: ["teacher", "book", "student"],
  correctAnswers: ["teacher", "book", "student"],
  feedbackCorrect: "Perfect! You found all 3 nouns! / ਸ਼ਾਨਦਾਰ! ਤੁਸੀਂ ਸਾਰੇ 3 ਨਾਮ ਲੱਭ ਗਏ!",
  points: 3
}
```

**CSS Classes & States:**
- `.word-btn.clickable`: Clickable word button (blue, enabled)
- `.word-btn.non-clickable`: Non-clickable word (gray, disabled)
- `.word-btn.selected`: User selected (gold background #ffd700)
- `.word-btn.correct-highlight`: Correct answer confirmed (green #4caf50, white text)
- `@keyframes pulse-correct`: Animation on correct (1.0 → 1.1 → 1.0)
- `.word-btn:disabled`: All buttons disabled in Phase 2

---

### 4. Question Step
**Type:** `"question"`

**Fields:**
- `englishText` or `english_text` (string): Question in English
- `punjabi_text` (string): Question in Punjabi
- `options` (array): Multiple choice answers
- `correctAnswer` or `correct_answer` (string): The correct option
- `points` (number): XP awarded on correct answer (typically 5)

**Behavior:**
- Displays bilingual question in 50/50 split
- Shows multiple choice buttons (one per option)
- User clicks an option:
  - **Correct:** "Correct! / ਠੀਕ ਹੈ!" feedback, points awarded, buttons disabled, [Next] enabled
  - **Wrong:** "Try again. / ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" feedback, [Next] stays disabled
- All buttons disabled after first answer (prevents re-clicking)

---

### 5. Summary Step
**Type:** `"summary"`

**Fields:**
- `titleEn` (string): Summary title in English
- `titlePa` (string): Summary title in Punjabi
- `summaryEn` (string): Reinforcement text in English
- `summaryPa` (string): Reinforcement text in Punjabi
- `keyExamplesEn` (array): List of examples in English
- `keyExamplesPa` (array): Parallel list of examples in Punjabi
- `totalPoints` (number): Sum of all points in lesson

**Behavior:**
- Displays bilingual title and summary
- Lists key examples side-by-side (English/Punjabi pairs)
- Shows total XP earned
- [Next] button enabled; clicking completes lesson

---

## Backward Compatibility

**Old Lesson Format (Array) Still Supported:**
```javascript
LESSONS["noun"] = [
  { step_type: "definition", english_text: "...", punjabi_text: "..." },
  { step_type: "example", english_text: "The <mark>cat</mark> is...", punjabi_text: "..." },
  { step_type: "question", options: [...], correct_answer: "..." }
]
```

The system automatically converts old array format to new object format via `Lessons.normalizeLesson()`, so existing lessons continue to work.

---

## CSS Styling

### Example Step Styling
```css
.example-text-display {
  padding: 20px;
  background: #f5f9ff;
  border-radius: 8px;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.highlight-word {
  background: #ffffcc;           /* Light yellow */
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}
```

### Guided Practice Styling
```css
.word-btn.clickable {
  border-color: #4a90e2;         /* Blue */
  background-color: #f0f7ff;     /* Light blue */
  font-weight: 500;
}

.word-btn.selected {
  background-color: #ffd700;     /* Gold */
  color: #000;
  border-color: #ffb800;
  font-weight: 600;
}

.word-btn.correct-highlight {
  background-color: #4caf50;     /* Green */
  color: #fff;
  border-color: #388e3c;
  font-weight: 600;
  animation: pulse-correct 0.4s ease-out;
}

@keyframes pulse-correct {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

---

## Points Per Step

Default point allocation:
- Definition: 1 XP (auto-awarded)
- Example: 1 XP (auto-awarded)
- Guided Practice: 3 XP (awarded on correct completion)
- Question: 5 XP (awarded on correct answer)
- Summary: 0 XP (final recap)

**Total per lesson:** 10 XP minimum (5 steps)

Customize by setting `points` field in each step.

---

## Migration Guide: Converting Old Format to New

### Before (Old Format)
```javascript
LESSONS["noun"] = [
  { step_type: "definition", english_text: "...", punjabi_text: "..." },
  { step_type: "example", english_text: "The <mark>cat</mark> is...", punjabi_text: "..." }
]
```

### After (New Format)
```javascript
LESSONS["L_NOUNS_101"] = {
  metadata: {
    titleEn: "Nouns",
    titlePa: "ਨਾਮ",
    objective: {
      titleEn: "Learn: What Are Nouns?",
      titlePa: "ਸਿੱਖੋ: ਨਾਮ ਕੀ ਹਨ?",
      descEn: "...",
      descPa: "...",
      pointsAvailable: 10
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "...", contentPa: "...", points: 1 },
    { type: "example", exampleEn: "The cat is...", examplePa: "...", 
      highlightedWords: ["cat"], points: 1 }
  ]
}
```

**Key Changes:**
- Array → Object with `metadata` + `steps`
- `step_type` → `type`
- `english_text` → `contentEn` (or `exampleEn` for examples)
- `punjabi_text` → `contentPa` (or `examplePa` for examples)
- Example: Remove `<mark>` HTML tags, use `highlightedWords` array instead
- Add explicit `points` field per step
- Add lesson-level metadata (title, objective, difficulty)

---

## Testing the New Format

A sample lesson `L_EXAMPLE_NEW_FORMAT` has been added to `/Users/deepakdaroach/bolo/app/data/lessons.js` demonstrating all step types and the complete bilingual flow.

### Test Steps:
1. Open app at http://localhost:8000
2. Go to Learn screen
3. Start lesson "Nouns (New Format)"
4. Verify:
   - Objective screen displays goal + points + difficulty
   - Definition shows bilingual text in 50/50 split
   - Example shows text with yellow highlights on specified words
   - Guided Practice: tap words → gold highlight, all selected → green highlight + feedback
   - Question: multiple choice with bilingual text
   - Summary: key examples listed, total XP shown

---

## Implementation Details

### Methods Modified in `lessons.js`:
- `renderExampleStep()` - NEW: Renders example with auto-highlighted words
- `renderGuidedPracticeStep()` - ENHANCED: Two-phase interaction (select → highlight)
- `handleGuidedPracticeCorrect()` - ENHANCED: Auto-highlight correct words, disable buttons
- `renderLessonStep()` - UPDATED: Switch statement routing for example type

### Backward Compatibility Methods:
- `normalizeLesson()` - Converts old array format to new object format
- `getSteps()` - Returns normalized steps array
- All existing lessons continue to work unchanged

---

## Summary

The enhanced bilingual lesson format provides:
- ✅ **Bilingual 50/50 layout** for definition, example, guided practice, question, summary
- ✅ **Auto-highlighted examples** (plain text + `highlightedWords` array, no HTML)
- ✅ **Two-phase guided practice** (tap-to-select, then visual confirmation)
- ✅ **Per-step XP awards** with clear point feedback
- ✅ **Full backward compatibility** with old lesson format
- ✅ **Structured metadata** with learning objectives and difficulty ratings
- ✅ **Engaging visual feedback** (yellow selections, green confirmations, animations)

This creates a more pedagogically sound learning experience while maintaining the simplicity and flexibility of the original lesson system.
