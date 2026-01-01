// =====================================
// EXAMPLE: Complete New-Format Lesson
// =====================================

// This is how to structure a lesson in the new pedagogical format
// Place this in your data/lessons.js alongside existing LESSONS

LESSONS["L_NOUNS_101"] = {
  // ===== METADATA (Objective & Difficulty) =====
  metadata: {
    titleEn: "Nouns",
    titlePa: "ਨਾਵਾਂ",
    objective: {
      titleEn: "Learn: Nouns",
      titlePa: "ਸਿੱਖੋ: ਨਾਵਾਂ",
      descEn: "Learn what nouns are and identify them in sentences",
      descPa: "ਸਿੱਖੋ ਨਾਵਾਂ ਕੀ ਹਨ ਅਤੇ ਵਾਕਾਂ ਵਿੱਚ ਪਛਾਣ ਕਰੋ",
      pointsAvailable: 12
    },
    difficulty: 1  // 1=easy, 2=medium, 3=hard
  },

  // ===== STEPS (6 total: objective, def, examples, guided practice, question, summary) =====
  steps: [
    // STEP 0: Objective (auto-rendered, shows goal & available points)
    // No need to define - auto-generated from metadata.objective

    // STEP 1: Definition
    {
      type: "definition",
      titleEn: "What is a Noun?",
      titlePa: "ਨਾਵਾਂ ਕੀ ਹੈ?",
      contentEn: "A noun is a word that names a person, place, or thing. Nouns can be concrete (things you can touch) or abstract (ideas, feelings).",
      contentPa: "ਇੱਕ ਨਾਵਾਂ ਇੱਕ ਸ਼ਬਦ ਹੈ ਜੋ ਇੱਕ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਮ ਕਰਦਾ ਹੈ। ਨਾਵਾਂ ਮੂਰਤ (ਜੋ ਤੁਸੀਂ ਛੂ ਸਕਦੇ ਹੋ) ਜਾਂ ਅਮੂਰਤ (ਵਿਚਾਰ, ਭਾਵਨਾਵਾਂ) ਹੋ ਸਕਦੇ ਹਨ।",
      points: 1  // Auto-awarded on view
    },

    // STEP 2: Examples
    {
      type: "example",
      titleEn: "Examples of Nouns",
      titlePa: "ਨਾਵਾਂ ਦੀਆਂ ਉਦਾਹਰਨਾਂ",
      examplesEn: [
        "Cat - a concrete animal",
        "Teacher - a person",
        "Canada - a place",
        "Love - an abstract feeling"
      ],
      examplesPa: [
        "ਬਿੱਲੀ - ਇੱਕ ਮੂਰਤ ਜਾਨਵਰ",
        "ਅਧਿਆਪਕ - ਇੱਕ ਵਿਅਕਤੀ",
        "ਕਨੇਡਾ - ਇੱਕ ਥਾਂ",
        "ਪਿਆਰ - ਇੱਕ ਅਮੂਰਤ ਭਾਵਨਾ"
      ],
      points: 1  // Auto-awarded on view
    },

    // STEP 3: Guided Practice (Interactive - Tap to Highlight)
    {
      type: "guided_practice",
      titleEn: "Find the Nouns",
      titlePa: "ਨਾਵਾਂ ਲੱਭੋ",
      sentenceEn: "The teacher gave a book to the student",
      sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਇੱਕ ਕਿਤਾਬ ਦਿੱਤੀ",
      clickableWords: ["teacher", "book", "student"],
      correctAnswers: ["teacher", "book", "student"],
      feedbackCorrect: "Perfect! You found all 3 nouns: teacher, book, and student.",
      feedbackIncomplete: "You found some! Keep tapping to find all nouns.",
      feedbackWrong: "Not quite. Remember: nouns name people, places, or things.",
      points: 3  // Awarded when all correct answers found
    },

    // STEP 4: Question (Assessment - Multiple Choice)
    {
      type: "question",
      titleEn: "Which word is NOT a noun?",
      titlePa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਵਾਂ ਨਹੀਂ ਹੈ?",
      questionEn: "In the sentence 'The dog runs quickly', which word is NOT a noun?",
      questionPa: "ਵਾਕ 'ਕੁੱਤਾ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਦਾ ਹੈ' ਵਿੱਚ, ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਵਾਂ ਨਹੀਂ ਹੈ?",
      options: [
        "dog",
        "runs",
        "quickly",
        "the"
      ],
      correctAnswer: "runs",
      points: 5  // Awarded only on correct answer
    },

    // STEP 5: Summary (Reinforce Learning)
    {
      type: "summary",
      titleEn: "Great Job! You Learned About Nouns",
      titlePa: "ਬਹੁਤ ਚੰਗਾ! ਤੁਸੀਂ ਨਾਵਾਂ ਬਾਰੇ ਸਿੱਖਿਆ",
      summaryEn: "Nouns are words that name people, places, or things. They are essential to every sentence!",
      summaryPa: "ਨਾਵਾਂ ਉਹ ਸ਼ਬਦ ਹਨ ਜੋ ਲੋਕਾਂ, ਥਾਵਾਂ ਜਾਂ ਚੀਜ਼ਾਂ ਦਾ ਨਾਮ ਕਰਦੇ ਹਨ। ਉਹ ਹਰ ਵਾਕ ਵਿੱਚ ਜ਼ਰੂਰੀ ਹੈ!",
      keyExamplesEn: ["person", "place", "thing", "idea"],
      keyExamplesPa: ["ਵਿਅਕਤੀ", "ਥਾਂ", "ਚੀਜ਼", "ਵਿਚਾਰ"],
      totalPoints: 12  // Sum of all step points
    }
  ]
};

// ===== HOW IT WORKS =====

// 1. USER STARTS LESSON (from Learn screen)
//    ↓ Lessons.startLesson("L_NOUNS_101")
//
// 2. OBJECTIVE SCREEN SHOWS
//    ↓ "Learn: Nouns" title
//    ↓ "Learn what nouns are..." description
//    ↓ "+12 XP available" badge
//    ↓ Difficulty: ★★☆ (easy)
//    ↓ User taps [Next]
//
// 3. DEFINITION STEP
//    ↓ Auto-awards +1 XP
//    ↓ Shows English (left 50%) and Punjabi (right 50%)
//    ↓ User taps [Next] (no answer required)
//
// 4. EXAMPLES STEP
//    ↓ Auto-awards +1 XP
//    ↓ Shows 4 bilingual examples
//    ↓ User taps [Next]
//
// 5. GUIDED PRACTICE STEP
//    ↓ User taps: "teacher" → highlights yellow
//    ↓ User taps: "book" → highlights yellow
//    ↓ User taps: "student" → highlights yellow
//    ↓ System detects 3/3 correct
//    ↓ Auto-awards +3 XP
//    ↓ Shows "Perfect!" feedback
//    ↓ [Next] button enabled
//    ↓ User taps [Next]
//
// 6. QUESTION STEP
//    ↓ Multiple choice: "Which is NOT a noun?"
//    ↓ User taps "runs" (correct)
//    ↓ System awards +5 XP
//    ↓ Shows "Correct!" feedback
//    ↓ [Next] button enabled
//    ↓ User taps [Next]
//
// 7. SUMMARY SCREEN
//    ↓ Shows reinforcement text
//    ↓ Lists key examples
//    ↓ Shows "+12 XP earned" badge
//    ↓ User taps [Next] (or [Back to Learn])
//    ↓ Lesson marked as complete in State.state.progress.lessonDone
//

// ===== DAILY QUEST INTEGRATION =====

// If user does this lesson via Daily Quest:
//
// 1. DailyQuest.startLessonStep() calls Lessons.openLessonForQuest()
// 2. Objective screen is SKIPPED (not shown)
// 3. Seeded random question step is selected (e.g., STEP 4)
// 4. User must answer that ONE question correctly
// 5. After correct, calls callback() → returns to Daily Quest
// 6. Lesson checkbox marked ☑ but NOT marked as "Done"
//
// Same lesson can be:
// - Completed fully (Learn screen) → marks lessonDone
// - Completed once per day (Quest) → marks questCompleted


// ===== POINT BREAKDOWN =====

//   Definition:     +1  (auto-awarded on view)
//   Examples:       +1  (auto-awarded on view)
//   Guided:         +3  (awarded when all words tapped)
//   Question:       +5  (awarded on correct answer)
//   Summary:         -  (summary screen just shows total)
//   ─────────────────
//   TOTAL:        +10 XP per full lesson completion
//
// For non-quest mode: all steps award their points to track XP
// For quest mode: only question step awards +5 XP (hardcoded minimum)
//

// ===== TESTING THIS LESSON =====

// 1. Add to LESSONS object in data/lessons.js
// 2. Create LESSON_META entry:
//    {
//      id: "L_NOUNS_101",
//      trackId: "T_WORDS",
//      labelEn: "Nouns",
//      labelPa: "ਨਾਵਾਂ"
//    }
// 3. Go to Learn → scroll to T_WORDS track
// 4. Tap "Nouns" → see objective screen
// 5. Tap [Next] → go through all 6 steps
// 6. Verify in console:
//    State.state.session.lessonProgress["L_NOUNS_101"].pointsEarned === 10
//    State.state.progress.lessonDone["L_NOUNS_101"] === true
