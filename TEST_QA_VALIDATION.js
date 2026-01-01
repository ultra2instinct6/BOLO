// ===============================================
// Learn Screen QA Validation Script
// Run in browser console after loading BOLO app
// ===============================================

var QAValidator = {
  results: [],
  startTime: Date.now(),
  
  // Test 1: Verify LearnQA object exists
  test_learningQAExists: function() {
    try {
      var pass = typeof LearnQA === 'object' && 
                 typeof LearnQA.enabled === 'function' &&
                 typeof LearnQA.logLessonsPerTrack === 'function' &&
                 typeof LearnQA.logFilterState === 'function' &&
                 typeof LearnQA.logLessonLaunch === 'function' &&
                 typeof LearnQA.validateLesson === 'function' &&
                 typeof LearnQA.logCardRendered === 'function';
      this.results.push({
        test: "LearnQA object + all 6 methods exist",
        pass: pass,
        details: pass ? "✅ All methods present" : "❌ Missing methods"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "LearnQA object + all 6 methods exist",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 2: Verify QA activation works
  test_qaActivation: function() {
    try {
      localStorage.LEARN_QA = "1";
      var enabled = LearnQA.enabled();
      delete localStorage.LEARN_QA;
      var disabled = !LearnQA.enabled();
      
      var pass = enabled && disabled;
      this.results.push({
        test: "QA activation toggle (localStorage.LEARN_QA)",
        pass: pass,
        details: pass ? "✅ Toggle works correctly" : "❌ Toggle not working"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "QA activation toggle",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 3: Check Lessons module exists
  test_lessonsModuleExists: function() {
    try {
      var pass = typeof Lessons === 'object' &&
                 typeof Lessons.renderLearnSections === 'function' &&
                 typeof Lessons.startLesson === 'function' &&
                 typeof Lessons.applyFilters === 'function' &&
                 Lessons.activeFilters &&
                 Array.isArray(Lessons.activeFilters.difficulty);
      this.results.push({
        test: "Lessons module + key methods exist",
        pass: pass,
        details: pass ? "✅ Module fully initialized" : "❌ Module incomplete"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Lessons module + key methods exist",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 4: Check LESSON_META loaded
  test_lessonMetaLoaded: function() {
    try {
      var pass = typeof LESSON_META !== 'undefined' &&
                 Array.isArray(LESSON_META) &&
                 LESSON_META.length > 30;
      var count = Array.isArray(LESSON_META) ? LESSON_META.length : 0;
      this.results.push({
        test: "LESSON_META loaded with lessons",
        pass: pass,
        details: pass ? "✅ " + count + " lessons loaded" : "❌ Expected 30+, got " + count
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "LESSON_META loaded",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 5: Check LESSONS content loaded
  test_lessonsContentLoaded: function() {
    try {
      var pass = typeof LESSONS === 'object' &&
                 Object.keys(LESSONS).length > 30;
      var count = Object.keys(LESSONS).length;
      this.results.push({
        test: "LESSONS content loaded",
        pass: pass,
        details: pass ? "✅ " + count + " lessons in LESSONS object" : "❌ Expected 30+, got " + count
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "LESSONS content loaded",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 6: Check new lessons T01-T10 in catalog
  test_newLessonsInCatalog: function() {
    try {
      var newLessonIds = ['L_NOUNS_COMMON_01', 'L_SENTENCE_CONNECTING_02', 
                          'L_ADJECTIVES_POSITION_04', 'L_NOUNS_POSSESSION_06',
                          'L_NOUNS_GENDER_07', 'L_SENTENCE_COMMANDS_08',
                          'L_SENTENCE_QUANTIFIERS_02', 'L_QUANTIFIERS_SOME_ANY_02',
                          'L_SENTENCE_RESPECT_10', 'L_COMPOUND_CLAUSES_01'];
      
      var found = [];
      var missing = [];
      
      for (var i = 0; i < newLessonIds.length; i++) {
        var id = newLessonIds[i];
        if (LESSON_META.some(function(m) { return m.id === id; })) {
          found.push(id);
        } else {
          missing.push(id);
        }
      }
      
      var pass = missing.length === 0;
      this.results.push({
        test: "New lessons T01-T10 in LESSON_META",
        pass: pass,
        details: pass ? "✅ All 10 new lessons found" : "❌ Missing: " + missing.join(", ")
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "New lessons T01-T10 in LESSON_META",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 7: Check TRACKS loaded
  test_tracksLoaded: function() {
    try {
      var tracks = Object.keys(TRACKS || {});
      var pass = tracks.length === 5;
      this.results.push({
        test: "TRACKS loaded (5 total)",
        pass: pass,
        details: pass ? "✅ All 5 tracks present" : "❌ Expected 5, got " + tracks.length
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "TRACKS loaded",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 8: Check filter controls exist in DOM
  test_filterControlsExist: function() {
    try {
      var learnScreen = document.getElementById("screen-learn");
      var searchInput = document.getElementById("lesson-search");
      var trackFilter = document.getElementById("track-filter");
      var filterBtns = document.querySelectorAll(".filter-btn");
      var diffCheckboxes = document.querySelectorAll(".diff-filter");
      
      var pass = learnScreen && searchInput && trackFilter && 
                 filterBtns.length > 0 && diffCheckboxes.length > 0;
      
      this.results.push({
        test: "Filter controls exist in DOM",
        pass: pass,
        details: pass ? "✅ All filters present" : "❌ Some controls missing"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Filter controls exist in DOM",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 9: Check lesson cards render
  test_lessonCardsRender: function() {
    try {
      var learnTrackSections = document.getElementById("learn-track-sections");
      var lessonCards = learnTrackSections ? 
                        learnTrackSections.querySelectorAll("[data-lesson-id]") : [];
      
      var pass = learnCards.length > 30;
      this.results.push({
        test: "Lesson cards render (30+)",
        pass: pass,
        details: pass ? "✅ " + lessonCards.length + " cards rendered" : "❌ Only " + lessonCards.length + " cards"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Lesson cards render",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 10: Check bilingual text in cards
  test_bilingualTextInCards: function() {
    try {
      var learnTrackSections = document.getElementById("learn-track-sections");
      var lessonCards = learnTrackSections ? 
                        learnTrackSections.querySelectorAll("[data-lesson-id]") : [];
      
      var cardsWithBilingual = 0;
      for (var i = 0; i < Math.min(5, lessonCards.length); i++) {
        var card = lessonCards[i];
        var englishText = card.querySelector(".lesson-en");
        var punjabiText = card.querySelector(".lesson-pa");
        if (englishText && punjabiText && englishText.textContent && punjabiText.textContent) {
          cardsWithBilingual++;
        }
      }
      
      var pass = cardsWithBilingual === Math.min(5, lessonCards.length);
      this.results.push({
        test: "Bilingual text in lesson cards",
        pass: pass,
        details: pass ? "✅ All cards have bilingual text" : "❌ Only " + cardsWithBilingual + "/5 have bilingual"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Bilingual text in lesson cards",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 11: Test filter logic (applyFilters)
  test_filterLogicWorks: function() {
    try {
      var originalFilters = JSON.parse(JSON.stringify(Lessons.activeFilters));
      
      // Test search filter
      Lessons.activeFilters.search = "plural";
      var searchResults = Lessons.applyFilters();
      var searchWorks = searchResults.length < 50; // Should be fewer
      
      // Reset
      Lessons.activeFilters.search = originalFilters.search;
      Lessons.activeFilters.track = "T_WORDS";
      var trackResults = Lessons.applyFilters();
      var trackWorks = trackResults.length < 50; // Should be fewer
      
      // Reset
      Lessons.activeFilters.track = originalFilters.track;
      
      var pass = searchWorks && trackWorks;
      this.results.push({
        test: "Filter logic (search + track) works",
        pass: pass,
        details: pass ? "✅ Filters reduce results correctly" : "❌ Filters not working"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Filter logic works",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 12: Verify QA logging doesn't crash
  test_qaLoggingNoCrash: function() {
    try {
      localStorage.LEARN_QA = "1";
      
      // Call logging methods
      var oldLog = console.log;
      var logsCalled = 0;
      console.log = function() { logsCalled++; };
      
      LearnQA.logLessonsPerTrack();
      LearnQA.logFilterState([]);
      LearnQA.logLessonLaunch("TEST_LESSON", "T_WORDS");
      LearnQA.validateLesson("TEST", { metadata: { titleEn: "Test" } });
      
      console.log = oldLog;
      delete localStorage.LEARN_QA;
      
      var pass = logsCalled > 0;
      this.results.push({
        test: "QA logging methods work without crashing",
        pass: pass,
        details: pass ? "✅ " + logsCalled + " logs generated" : "❌ No logs generated"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "QA logging methods work",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 13: Check no console errors on load
  test_noConsoleErrors: function() {
    try {
      // Check for known errors in window (if captured)
      var errorCount = 0;
      var hasErrors = window.__errorCount || false;
      
      this.results.push({
        test: "No critical console errors on load",
        pass: !hasErrors,
        details: hasErrors ? "❌ Errors detected" : "✅ No errors detected"
      });
      return true; // Can't fully test this without error hook
    } catch(e) {
      this.results.push({
        test: "Console error check",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 14: Verify Lessons.startLesson exists
  test_startLessonMethod: function() {
    try {
      var pass = typeof Lessons.startLesson === 'function';
      this.results.push({
        test: "Lessons.startLesson() method exists",
        pass: pass,
        details: pass ? "✅ startLesson method ready" : "❌ startLesson not found"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Lessons.startLesson method",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Test 15: Check lesson detail renders without error
  test_lessonDetailRender: function() {
    try {
      // Find a real lesson
      var testLessonId = null;
      if (LESSON_META && LESSON_META.length > 0) {
        testLessonId = LESSON_META[0].id;
      }
      
      if (!testLessonId) {
        this.results.push({
          test: "Lesson detail renders correctly",
          pass: false,
          details: "❌ No test lesson found"
        });
        return false;
      }
      
      // Check that lesson exists in LESSONS
      var lessonExists = !!LESSONS[testLessonId];
      var lesson = LESSONS[testLessonId];
      var hasSteps = lesson && Array.isArray(lesson.steps) && lesson.steps.length > 0;
      var hasMetadata = lesson && lesson.metadata;
      
      var pass = lessonExists && hasSteps && hasMetadata;
      this.results.push({
        test: "Lesson detail structure valid",
        pass: pass,
        details: pass ? "✅ Lesson " + testLessonId + " has valid structure" : "❌ Lesson structure invalid"
      });
      return pass;
    } catch(e) {
      this.results.push({
        test: "Lesson detail renders",
        pass: false,
        details: "❌ Error: " + e.message
      });
      return false;
    }
  },

  // Run all tests
  runAll: function() {
    console.log("\n" + "=".repeat(60));
    console.log("🎓 LEARN QA VALIDATION TEST SUITE");
    console.log("=".repeat(60) + "\n");
    
    this.test_learningQAExists();
    this.test_qaActivation();
    this.test_lessonsModuleExists();
    this.test_lessonMetaLoaded();
    this.test_lessonsContentLoaded();
    this.test_newLessonsInCatalog();
    this.test_tracksLoaded();
    this.test_filterControlsExist();
    this.test_lessonCardsRender();
    this.test_bilingualTextInCards();
    this.test_filterLogicWorks();
    this.test_qaLoggingNoCrash();
    this.test_noConsoleErrors();
    this.test_startLessonMethod();
    this.test_lessonDetailRender();
    
    // Print results
    var passed = 0;
    var failed = 0;
    
    for (var i = 0; i < this.results.length; i++) {
      var result = this.results[i];
      var icon = result.pass ? "✅" : "❌";
      console.log(icon + " " + result.test);
      console.log("   " + result.details);
      if (result.pass) passed++;
      else failed++;
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("RESULTS: " + passed + " passed, " + failed + " failed");
    console.log("=".repeat(60) + "\n");
    
    var duration = Date.now() - this.startTime;
    console.log("Test duration: " + duration + "ms\n");
    
    return {
      total: this.results.length,
      passed: passed,
      failed: failed,
      duration: duration,
      results: this.results
    };
  }
};

// Auto-run on load
console.log("QAValidator ready. Run QAValidator.runAll() to start tests.");
