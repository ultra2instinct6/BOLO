# Phase 1: Pedagogical Redesign - Implementation Guide

**Status:** ✅ COMPLETE - All code deployed and syntax validated

---

## What Changed

### 1. **Lessons Data Structure (Now Supports Both Old & New Formats)**

**Old Format (Still Works):**
```javascript
LESSONS["L_WORDS_1"] = [
  { step_type: "definition", english_text: "...", punjabi_text: "..." },
  { step_type: "example", english_text: "...", punjabi_text: "..." },
  { step_type: "question", options: [...], correct_answer: "..." }
]
```

**New Format (Recommended):**
```javascript
LESSONS["L_WORDS_1"] = {
  metadata: {
    titleEn: "Nouns",
    titlePa: "ਨਾਵਾਂ",
    objective: {
      titleEn: "Learn: Nouns",
      titlePa: "ਸਿੱਖੋ: ਨਾਵਾਂ",
      descEn: "Identify nouns in sentences",
      descPa: "ਵਾਕਾਂ ਵਿੱਚ ਨਾਵਾਂ ਦੀ ਪਛਾਣ ਕਰੋ",
      pointsAvailable: 10
    },
    difficulty: 1  // 1=easy, 2=medium, 3=hard
  },
  steps: [
    {
      type: "objective",
      // Rendered automatically from metadata
    },
    {
      type: "definition",
      titleEn: "What is a Noun?",
      titlePa: "ਨਾਵਾਂ ਕੀ ਹੈ?",
      contentEn: "A noun is a word that...",
      contentPa: "ਇੱਕ ਨਾਵਾਂ ਇੱਕ ਸ਼ਬਦ ਹੈ...",
      points: 1  // Awarded on completion
    },
    {
      type: "example",
      titleEn: "Examples",
      titlePa: "ਉਦਾਹਰਨਾਂ",
      examplesEn: ["The cat is sleeping", "I like apples"],
      examplesPa: ["ਬਿੱਲੀ ਸੁੱਤ ਰਹੀ ਹੈ", "ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ"],
      points: 1
    },
    {
      type: "guided_practice",
      titleEn: "Tap the Nouns",
      titlePa: "ਨਾਵਾਂ 'ਤੇ ਟੈਪ ਕਰੋ",
      sentenceEn: "The teacher gave a book to students",
      sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਇੱਕ ਕਿਤਾਬ ਦਿੱਤੀ",
      clickableWords: ["teacher", "book", "students"],
      correctAnswers: ["teacher", "book", "students"],
      feedbackCorrect: "Good! These are all nouns.",
      points: 3
    },
    {
      type: "question",
      titleEn: "How many nouns?",
      titlePa: "ਕਿੰਨੇ ਨਾਵਾਂ ਹਨ?",
      questionEn: "How many nouns are in this sentence?",
      questionPa: "ਇਸ ਵਾਕ ਵਿੱਚ ਕਿੰਨੇ ਨਾਵਾਂ ਹਨ?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "3",
      points: 5
    },
    {
      type: "summary",
      titleEn: "Great Job!",
      titlePa: "ਬਹੁਤ ਚੰਗਾ!",
      summaryEn: "You learned: Nouns are words that name people, places, or things.",
      summaryPa: "ਤੁਸੀਂ ਸਿੱਖਿਆ: ਨਾਵਾਂ ਉਹ ਸ਼ਬਦ ਹਨ...",
      keyExamplesEn: ["cat", "teacher", "apple"],
      keyExamplesPa: ["ਬਿੱਲੀ", "ਅਧਿਆਪਕ", "ਸੇਬ"],
      totalPoints: 10
    }
  ]
}
```

### 2. **New Step Types**

| Type | Purpose | Auto-Awards | User Action |
|------|---------|-------------|-------------|
| `objective` | Show learning goal & available points | No | View |
| `definition` | Present concept | Yes (1 pt) | Continue |
| `example` | Show 2-4 real examples | Yes (1 pt) | Continue |
| `guided_practice` | Tap words to identify parts of speech | Yes (3 pts if correct) | Tap |
| `question` | Multiple choice assessment | No | Answer |
| `summary` | Reinforce learning, show total points | No | View |

### 3. **Bilingual 50/50 Layout**

**Mobile (Stacked):**
```
┌─────────────────────┐
│   DEFINITION        │
└─────────────────────┘
┌─────────────────────┐
│   English (50%)     │
│   A noun is a...    │
└─────────────────────┘
┌─────────────────────┐
│   Punjabi (50%)     │
│   ਇੱਕ ਨਾਵਾਂ ਇੱਕ...│
└─────────────────────┘
```

**Desktop (Side-by-Side):**
```
┌──────────────────┬──────────────────┐
│  English (50%)   │   Punjabi (50%)  │
│  A noun is a...  │ ਇੱਕ ਨਾਵਾਂ ਇੱਕ... │
└──────────────────┴──────────────────┘
```

---

## New Methods in Lessons Module

### Core Helpers

```javascript
// Normalize lesson (handles both old & new formats)
var lesson = Lessons.normalizeLesson("L_WORDS_1");

// Get steps array
var steps = Lessons.getSteps("L_WORDS_1");

// Initialize lesson progress tracking
Lessons.initLesson("L_WORDS_1");

// Award points to a step (called automatically)
Lessons.awardStepPoints(stepIndex, step);
```

### Rendering

```javascript
// Render objective screen
Lessons.renderObjectiveScreen(meta);

// Render guided practice (tap-to-highlight)
Lessons.renderGuidedPracticeStep(step);

// Handle guided practice correct answer
Lessons.handleGuidedPracticeCorrect(step);

// Render summary screen
Lessons.renderSummaryStep(step);

// Render question step (existing, enhanced)
Lessons.renderQuestionStep(step);
```

---

## How to Test

### Test 1: View Objective Screen
1. **Go to:** Learn section
2. **Tap:** Any lesson (use old-format lessons)
3. **See:** "Objective" screen with:
   - 🎯 emoji icon
   - Learning goal (English & Punjabi)
   - Points available badge
   - Difficulty stars
4. **Tap [Next]** to start lesson

**Expected:** Objective auto-skipped in Daily Quest mode

### Test 2: Bilingual Parity (50/50)
1. **During lesson:** Navigate to any definition/example step
2. **Verify:**
   - English text = left 50% (or top 50% on mobile)
   - Punjabi text = right 50% (or bottom 50% on mobile)
   - Both equal height (200px minimum)
   - Both readable font sizes
   - English blue border (#4a90e2)
   - Punjabi orange border (#e8923d)

### Test 3: Guided Practice (Tap-to-Highlight)
1. **Data requirement:** Use a lesson with `type: "guided_practice"` step
   ```javascript
   {
     type: "guided_practice",
     sentenceEn: "The teacher gave a book to students",
     clickableWords: ["teacher", "book", "students"],
     correctAnswers: ["teacher", "book", "students"]
   }
   ```
2. **In app:**
   - See sentence with words as buttons
   - Blue border = tappable
   - Grey = non-clickable
   - **Tap "teacher"** → highlights yellow
   - **Tap "book"** → highlights yellow
   - **Tap "students"** → highlights yellow
   - Auto-enables [Next] button when all 3 tapped
   - Shows "Good! These are all nouns." feedback

### Test 4: Points Per Step
1. **In session progress tracking:**
   - Open any lesson with points
   - Complete 1 definition (auto +1 pt)
   - Complete 1 example (auto +1 pt)
   - Answer guided practice correctly (+3 pts)
   - Answer question correctly (+5 pts)
   - **Total:** +10 XP earned (shown in summary)

2. **Verify in console:**
   ```javascript
   State.state.session.lessonProgress["L_WORDS_1"].pointsEarned  // Should be 10
   State.state.session.lessonProgress["L_WORDS_1"].stepAwarded   // All steps marked true
   ```

### Test 5: Summary Screen
1. **Complete full lesson** (reach summary step)
2. **See:**
   - "Great Job!" title (EN & PA)
   - Summary text
   - Key examples listed (EN & PA pairs)
   - Total points earned badge
   - [Next] button leads back to Learn

### Test 6: Daily Quest Integration (Critical)
1. **Start Daily Quest** → Learn step
2. **In quest mode:**
   - Objective screen **NOT shown** (skipped)
   - Go directly to quest question step
   - Can't tap Back button (hidden)
   - Must answer correctly to exit
   - After correct, return to Daily Quest via callback
3. **Verify:** Lesson checkbox marked ☑

### Test 7: Backward Compatibility
1. **Old-format lessons still work:**
   - Array-based LESSONS[id] format
   - Auto-normalized in code
   - No breaking changes
   - Points NOT awarded (old format unsupported)

---

## CSS Classes Added

### Objective
- `.objective-content` - Container
- `.objective-icon` - 🎯 emoji
- `.objective-title-en` - Title (EN)
- `.objective-title-pa` - Title (PA)
- `.objective-desc-en` / `objective-desc-pa` - Description
- `.objective-points-badge` - Points display
- `.objective-difficulty` - Difficulty stars
- `.difficulty-stars` / `.star` - Star rating

### Guided Practice
- `.guided-practice-container` - Wrapper
- `.word-container` - Flex row of words
- `.word-btn` - Word button
- `.word-btn.clickable` - Tappable words
- `.word-btn.non-clickable` - Non-tappable words

### Summary
- `.lesson-summary` - Container
- `.summary-title-en` / `.summary-title-pa` - Titles
- `.summary-text-en` / `.summary-text-pa` - Text
- `.summary-examples` - Examples box
- `.example-pair` - EN/PA word pair
- `.summary-points` - Points badge

### Bilingual
- `#lesson-text-en` - English content (50%, blue border)
- `#lesson-text-pa` - Punjabi content (50%, orange border)
- `.lesson-bilingual-container` - Flex container

---

## Key Design Decisions

✅ **50/50 Vertical Parity:** Punjabi gets equal real estate (not secondary)

✅ **Points on Every Step:** Frequent rewards boost motivation & retention

✅ **Tap-to-Highlight:** Active recall > passive reading

✅ **Summary Closure:** Reinforce concepts at lesson end

✅ **Objective First:** Set expectations before starting

✅ **Backward Compatible:** Old lessons auto-normalize, still work

✅ **Quest Mode Optimized:** Objective skipped, single question shown

---

## Next Steps (Phase 2+)

- [ ] Add illustrations/icons per concept
- [ ] Implement spaced repetition reviews
- [ ] Add difficulty variants (easy/medium/hard)
- [ ] Create "Review" section with daily practice queue
- [ ] Add progress streaks & milestones

---

## Debug Commands

```javascript
// Check lesson progress
State.state.session.lessonProgress["L_WORDS_1"]

// Check if step awarded XP
State.state.session.lessonProgress["L_WORDS_1"].stepAwarded[2]

// Force lesson normalize
var lesson = Lessons.normalizeLesson("L_WORDS_1");
console.log(lesson.metadata.objective)

// Check current step type
console.log(Lessons.currentLessonSteps[Lessons.currentStepIndex].type)

// Verify total session XP
State.state.session.lessonProgress["L_WORDS_1"].pointsEarned
```

---

## Files Modified

- ✅ `/Users/deepakdaroach/bolo/app/js/lessons.js` - 600+ lines, 8 new methods
- ✅ `/Users/deepakdaroach/bolo/app/css/main.css` - 250+ lines new CSS
- ✅ No breaking changes to HTML, other modules, or data structure

---

**Implementation Date:** 2025-12-16
**Syntax Status:** ✅ All validated
**Server Status:** ✅ Running on http://localhost:8000
