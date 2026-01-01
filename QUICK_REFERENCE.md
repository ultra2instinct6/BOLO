# Quick Reference: Enhanced Bilingual Lesson Format

## 🎯 What Changed

### Before
```javascript
{ 
  step_type: "example",
  english_text: "The <mark>cat</mark> is sleeping.",
  punjabi_text: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।"
}
```
❌ HTML marks in data
❌ Single phase interaction
❌ Static highlighting

### After
```javascript
{
  type: "example",
  exampleEn: "The cat is sleeping.",
  examplePa: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।",
  highlightedWords: ["cat"],
  points: 1
}
```
✅ Plain text + array
✅ Auto-rendering
✅ Two-phase practice flow

---

## 📐 Lesson Structure (New Format)

```javascript
LESSONS["L_LESSON_ID"] = {
  metadata: {
    titleEn: "...",
    titlePa: "...",
    labelEn: "...",
    labelPa: "...",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: ...",
      titlePa: "ਸਿੱਖੋ: ...",
      descEn: "...",
      descPa: "...",
      pointsAvailable: 15
    },
    difficulty: 1  // 1-3 stars
  },
  steps: [
    // Step objects here
  ]
}
```

---

## 🔧 Step Types Quick Reference

| Type | Input | Auto-Award | Bilingual | Interactive |
|------|-------|-----------|-----------|------------|
| definition | `contentEn/Pa` | ✅ 1pt | ✅ 50/50 | ❌ Read-only |
| example | `exampleEn/Pa` + `highlightedWords[]` | ✅ 1pt | ✅ 50/50 | ❌ Read-only |
| guided_practice | `sentenceEn/Pa` + `clickableWords[]` + `correctAnswers[]` | ✅ on correct | ✅ 50/50 | ✅ Tap-then-confirm |
| question | `englishText` + `options[]` + `correctAnswer` | ✅ on correct | ✅ 50/50 | ✅ Multiple choice |
| summary | `summaryEn/Pa` + `keyExamplesEn/Pa[]` | ❌ 0pt | ✅ 50/50 | ❌ Read-only |

---

## 📝 Step Definition Templates

### Definition
```javascript
{
  type: "definition",
  contentEn: "A noun is a word that...",
  contentPa: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ...",
  points: 1
}
```

### Example (NEW - with highlighting)
```javascript
{
  type: "example",
  exampleEn: "The cat is sleeping on the bed.",
  examplePa: "ਬਿੱਲੀ ਬਿਸਤਰੇ 'ਤੇ ਸੋ ਰਹੀ ਹੈ।",
  highlightedWords: ["cat", "bed"],
  points: 1
}
```

### Guided Practice (NEW - two-phase)
```javascript
{
  type: "guided_practice",
  sentenceEn: "The teacher gave a book to the student.",
  sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।",
  clickableWords: ["teacher", "book", "student"],
  correctAnswers: ["teacher", "book", "student"],
  feedbackCorrect: "Perfect! You found all 3 nouns! / ਸ਼ਾਨਦਾਰ!",
  points: 3
}
```

### Question
```javascript
{
  type: "question",
  englishText: "Which word is a noun?",
  punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਮ ਹੈ?",
  options: ["run", "quick", "dog", "very"],
  correctAnswer: "dog",
  points: 5
}
```

### Summary
```javascript
{
  type: "summary",
  titleEn: "You've Mastered Nouns!",
  titlePa: "ਤੁਸੀਂ ਨਾਮਾਂ ਨੂੰ ਸਮਝ ਗਏ!",
  summaryEn: "Nouns are essential building blocks...",
  summaryPa: "ਨਾਮ ਵਾਕਾਂ ਦੇ ਬੁਨਿਆਦੀ ਬਲਾਕ ਹਨ।",
  keyExamplesEn: ["person: teacher", "place: school"],
  keyExamplesPa: ["ਵਿਅਕਤੀ: ਅਧਿਆਪਕ", "ਥਾਂ: ਸਕੂਲ"],
  totalPoints: 18
}
```

---

## 🎨 Visual States (Guided Practice)

### Phase 1: Tap-to-Select
| State | Color | Text | Cursor | Interactive |
|-------|-------|------|--------|------------|
| Unselected (clickable) | Light Blue (#f0f7ff) | Dark | pointer | ✅ Yes |
| Selected | Gold (#ffd700) | Black | pointer | ✅ Yes |
| Non-clickable | Gray (#f5f5f5) | Gray | default | ❌ No |

### Phase 2: Auto-Highlight (on correct)
| State | Color | Text | Cursor | Interactive |
|-------|-------|------|--------|------------|
| Correct | Green (#4caf50) | White | default | ❌ No |

**Animation:** Pulse effect (1.0 → 1.1 → 1.0 scale, 0.4s)

---

## ✨ Key Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| Bilingual 50/50 Layout | Both sides display simultaneously, equal height | ✅ |
| Auto-Highlighted Words | Plain text + array, no HTML needed | ✅ |
| Two-Phase Practice | Select → Auto-highlight on correct | ✅ |
| Per-Step Points | Tracked separately, visual feedback | ✅ |
| Button Disabling | Prevents re-clicking after interaction | ✅ |
| Pulse Animation | Smooth 0.4s scale animation | ✅ |
| Bilingual Feedback | Support for both languages in messages | ✅ |

---

## 📊 Points Allocation (Default)

```
Lesson Total: 10+ XP

├─ Objective: 0 XP (intro)
├─ Definition: 1 XP (read)
├─ Example: 1 XP (read)
├─ Guided Practice: 3 XP (interact correctly)
├─ Question: 5 XP (answer correctly)
└─ Summary: 0 XP (recap)

Total: 10 XP minimum
```

Customize per step by setting `points: X` field.

---

## 🔄 Old Format Still Supported

```javascript
// Old format (array) - still works!
LESSONS["noun"] = [
  { step_type: "definition", english_text: "...", punjabi_text: "..." },
  { step_type: "example", english_text: "...", punjabi_text: "..." }
]

// Automatically converts to new format internally via normalizeLesson()
```

No migration required. Existing lessons continue to work unchanged.

---

## 🧪 Sample Lesson Location

**File:** [app/data/lessons.js](app/data/lessons.js#L92-L174)  
**ID:** `L_EXAMPLE_NEW_FORMAT`  
**Content:** Full 6-step lesson demonstrating all features  
**Topic:** Nouns (Bilingual English/Punjabi)

### To Test:
1. Open http://localhost:8000
2. Go to Learn screen
3. Find "Nouns (New Format)" lesson
4. Click to start and step through all features

---

## 📋 Checklist: Creating New Lesson

- [ ] Create unique lesson ID: `L_TOPICNAME_NNN`
- [ ] Add metadata (title, labels, objective, difficulty)
- [ ] Step 1: Definition (auto-award 1 XP)
- [ ] Step 2: Example with `highlightedWords` (auto-award 1 XP)
- [ ] Step 3: Guided Practice with `clickableWords` + `correctAnswers` (award 3 XP)
- [ ] Step 4: Question with `options` + `correctAnswer` (award 5 XP)
- [ ] Step 5: Summary with `keyExamples` (recap)
- [ ] Test in browser (all steps render, points awarded, Next works)
- [ ] Verify bilingual text displays properly in 50/50 split

---

## 📚 Documentation

- **Full Reference:** [ENHANCED_BILINGUAL_LESSON_FORMAT.md](ENHANCED_BILINGUAL_LESSON_FORMAT.md)
- **Implementation Details:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Code:** [app/js/lessons.js](app/js/lessons.js)
- **Data:** [app/data/lessons.js](app/data/lessons.js)
- **Styles:** [app/css/main.css](app/css/main.css)

---

## ⚡ Quick Copy-Paste: New Lesson Template

```javascript
LESSONS["L_YOURLESSONID"] = {
  metadata: {
    titleEn: "YOUR TITLE",
    titlePa: "ਪੰਜਾਬੀ ਸਿਰਲੇਖ",
    labelEn: "Short Label",
    labelPa: "ਲੇਬਲ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Topic",
      titlePa: "ਸਿੱਖੋ: ਵਿਸ਼ਾ",
      descEn: "What you will learn",
      descPa: "ਤੁਸੀਂ ਕੀ ਸਿੱਖੋਗੇ",
      pointsAvailable: 15
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "...", contentPa: "...", points: 1 },
    { type: "example", exampleEn: "...", examplePa: "...", highlightedWords: ["word"], points: 1 },
    { type: "guided_practice", sentenceEn: "...", sentencePa: "...", clickableWords: ["w1"], correctAnswers: ["w1"], feedbackCorrect: "Great!", points: 3 },
    { type: "question", englishText: "Q?", punjabi_text: "ਸ?", options: ["a", "b"], correctAnswer: "a", points: 5 },
    { type: "summary", titleEn: "Done!", titlePa: "ਮੁਕਤ!", summaryEn: "...", summaryPa: "...", keyExamplesEn: [], keyExamplesPa: [], totalPoints: 10 }
  ]
}
```

---

✅ **All features implemented, tested, and validated.**
Ready for production use.
