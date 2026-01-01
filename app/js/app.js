  // Games screen Home button
  var btnPlayBackHome = document.getElementById("btn-play-back-home");
  if (btnPlayBackHome) {
    UI.bindOnce(btnPlayBackHome, "playBackHomeBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  // Daily Quest navigation from Home is handled by UI.renderHomeResumeCard()
// =====================================
// Global Error Handler (Production Safety)
// =====================================

window._APP_ERRORS = [];

// Catch uncaught JavaScript errors
window.onerror = function(message, source, lineno, colno, error) {
  var errorMsg = message + " (" + source + ":" + lineno + ":" + colno + ")";
  window._APP_ERRORS.push(errorMsg);
  
  // Dev mode: log to console
  if (localStorage.getItem("BOLO_DEV")) {
    console.error("🔴 Uncaught Error:", errorMsg);
    if (error && error.stack) console.error("Stack:", error.stack);
  }
  
  // Don't suppress; let browser default handler run too
  return false;
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
  var errorMsg = event.reason || "Unknown promise rejection";
  window._APP_ERRORS.push("Promise rejection: " + errorMsg);
  
  // Dev mode: log to console
  if (localStorage.getItem("BOLO_DEV")) {
    console.error("🔴 Unhandled Promise Rejection:", errorMsg);
  }
};

// =====================================
// App Initialization
// =====================================

function mergeReadingVocabIntoReadings() {
  if (typeof READINGS === "undefined" || !Array.isArray(READINGS)) return;

  var hasVocab = (typeof READING_VOCAB !== "undefined") && READING_VOCAB && (typeof READING_VOCAB === "object");

  for (var i = 0; i < READINGS.length; i++) {
    var rd = READINGS[i];
    if (!rd || typeof rd !== "object") continue;

    var v = hasVocab ? READING_VOCAB[rd.id] : null;
    if (!v || typeof v !== "object") v = {};

    rd.vocabWords = Array.isArray(v.vocabWords) ? v.vocabWords : [];
    rd.vocabPhrases = Array.isArray(v.vocabPhrases) ? v.vocabPhrases : [];

    if (v.vocabForms && typeof v.vocabForms === "object") {
      rd.vocabForms = v.vocabForms;
    } else {
      rd.vocabForms = {};
    }
  }
}

function _startupChecks() {
  var checks = {
    "State": typeof State !== "undefined",
    "UI": typeof UI !== "undefined",
    "Lessons": typeof Lessons !== "undefined",
    "Games": typeof Games !== "undefined",
    "Reading": typeof Reading !== "undefined",
    "Progress": typeof Progress !== "undefined",
    "DailyQuest": typeof DailyQuest !== "undefined",
    "TRACKS": typeof TRACKS !== "undefined",
    "LESSONS": typeof LESSONS !== "undefined",
    "READINGS": typeof READINGS !== "undefined",
    "GAMES_DATA": typeof GAMES_DATA !== "undefined"
  };
  
  var missing = [];
  for (var key in checks) {
    if (checks.hasOwnProperty(key) && !checks[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    var msg = "BOLO startup failed: Missing modules [" + missing.join(", ") + "]";
    console.error("❌ " + msg);
    alert(msg + "\n\nPlease reload the page. If this persists, check console for details.");
    return false;
  }
  
  console.log("✅ Startup checks passed. All modules loaded.");
  return true;
}

function validateReadingVocabDetail() {
  try {
    if (typeof READINGS === "undefined" || !Array.isArray(READINGS)) return;
    if (typeof READING_VOCAB_DETAIL === "undefined" || !READING_VOCAB_DETAIL || typeof READING_VOCAB_DETAIL !== "object") {
      console.log("ℹ️ READING_VOCAB_DETAIL not found (vocab detail UI will be limited). ");
      return;
    }

    var readingIds = {};
    for (var i = 0; i < READINGS.length; i++) {
      if (READINGS[i] && READINGS[i].id) readingIds[READINGS[i].id] = true;
    }

    var detailIds = Object.keys(READING_VOCAB_DETAIL);
    var covered = [];
    var missing = [];
    for (var id in readingIds) {
      if (!readingIds.hasOwnProperty(id)) continue;
      if (READING_VOCAB_DETAIL[id]) covered.push(id);
      else missing.push(id);
    }

    var extras = [];
    for (var j = 0; j < detailIds.length; j++) {
      var did = detailIds[j];
      if (!readingIds[did]) extras.push(did);
    }

    // Coverage report
    console.log("📘 Reading Vocab Detail coverage: " + covered.length + "/" + Object.keys(readingIds).length + " readings");
    if (missing.length) console.warn("⚠️ Missing READING_VOCAB_DETAIL entries for:", missing.join(", "));
    if (extras.length) console.warn("⚠️ READING_VOCAB_DETAIL has ids not in READINGS:", extras.join(", "));

    // Schema warnings
    function warn(readingId, msg) {
      console.warn("⚠️ Vocab detail [" + readingId + "]: " + msg);
    }

    for (var k = 0; k < detailIds.length; k++) {
      var rid = detailIds[k];
      var entry = READING_VOCAB_DETAIL[rid];
      if (!entry || typeof entry !== "object") {
        warn(rid, "entry is not an object");
        continue;
      }
      if (entry.phrases && !Array.isArray(entry.phrases)) warn(rid, "phrases should be an array");
      if (entry.words && !Array.isArray(entry.words)) warn(rid, "words should be an array");

      if (Array.isArray(entry.phrases)) {
        for (var p = 0; p < entry.phrases.length; p++) {
          var ph = entry.phrases[p];
          if (!ph || typeof ph.term !== "string" || !ph.term.trim()) {
            warn(rid, "phrases[" + p + "] missing term");
          }
        }
      }

      if (Array.isArray(entry.words)) {
        for (var w = 0; w < entry.words.length; w++) {
          var wd = entry.words[w];
          if (!wd || typeof wd.term !== "string" || !wd.term.trim()) {
            warn(rid, "words[" + w + "] missing term");
            continue;
          }
          if (wd.forms != null && !Array.isArray(wd.forms)) {
            warn(rid, "words[" + w + "].forms should be an array (or omitted)");
          }
        }
      }
    }
  } catch (e) {
    console.warn("⚠️ Reading vocab validation encountered an error:", e);
  }
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  try {
    // Startup validation with error handling
    if (!_startupChecks()) {
      console.error("❌ Startup checks failed. Module missing.");
      return;
    }

    // Localhost-only build stamp (helps verify cache-busted updates are live)
    try {
      var isLocalhost = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      if (isLocalhost) {
        var buildStamp = '20251231';
        window.BOLO_BUILD = buildStamp;
        document.documentElement.setAttribute('data-bolo-build', buildStamp);
        console.info('[BOLO] build', buildStamp);
      }
    } catch (e) {
      // Non-fatal
    }
    
    console.log("📚 Loaded " + Object.keys(LESSONS).length + " lessons");
    console.log("📖 Loaded " + Object.keys(READINGS).length + " readings");
    console.log("🎮 Loaded " + Object.keys(GAMES_DATA).length + " games");

    // Attach optional Reading vocab (safe if READING_VOCAB is missing)
    mergeReadingVocabIntoReadings();
    validateReadingVocabDetail();
    
    // Initialize feature modules
    Lessons.init();
    Games.init();
    Reading.init();
    Progress.init();
    DailyQuest.init();
    UI.init();

    // Home-only Lane Tabs + Shortcuts
    try {
      if (window.HomeLanes && typeof HomeLanes.init === "function") HomeLanes.init();
    } catch (e) {
      // no-op
    }

  // Wire up navigation buttons to screens (guarded)
  var btnHomeLearn = document.getElementById("btn-home-learn");
  if (btnHomeLearn) {
    UI.bindOnce(btnHomeLearn, "homeLearnBound", "click", function() {
      UI.goTo("screen-learn");
    });
  }

  var btnHomeRoz = document.getElementById("btn-home-roz");
  if (btnHomeRoz) {
    UI.bindOnce(btnHomeRoz, "homeRozBound", "click", function() {
      var profileId = State.getActiveProfile().id;
      DailyQuest.getOrCreate(profileId);
      DailyQuest.render();
      UI.goTo("screen-daily-quest");
    });
  }

  var btnHomeBolo = document.getElementById("btn-home-bolo");
  if (btnHomeBolo) {
    UI.bindOnce(btnHomeBolo, "homeBoloBound", "click", function() {
      UI.goTo("screen-speak");
    });
  }

  var btnHomeFlashcards = document.getElementById("btn-home-flashcards");
  if (btnHomeFlashcards) {
    UI.bindOnce(btnHomeFlashcards, "homeFlashcardsBound", "click", function() {
      UI.goTo("screen-flashcards");
    });
  }

  var btnHomeClear = document.getElementById("btn-home-clear");
  if (btnHomeClear) {
    UI.bindOnce(btnHomeClear, "homeClearBound", "click", function() {
      State.resetAll("Clear all saved progress and settings on this device? This cannot be undone.");
    });
  }

  var btnHomeReading = document.getElementById("btn-home-reading");
  if (btnHomeReading) {
    UI.bindOnce(btnHomeReading, "homeReadingBound", "click", function() {
      UI.goTo("screen-reading");
    });
  }

  var btnHomePlay = document.getElementById("btn-home-play");
  if (btnHomePlay) {
    UI.bindOnce(btnHomePlay, "homePlayBound", "click", function() {
      UI.goTo("screen-play-home");
    });
  }

  var btnHomeType = document.getElementById("btn-home-type");
  if (btnHomeType) {
    UI.bindOnce(btnHomeType, "homeTypeBound", "click", function() {
      UI.goTo("screen-play-home");
      try { if (Games && typeof Games.selectPlayHomeGame === "function") Games.selectPlayHomeGame(2); } catch (e) {}
    });
  }

  var btnSpeakNav = document.getElementById("btn-speak-nav");
  if (btnSpeakNav) {
    UI.bindOnce(btnSpeakNav, "speakNavBound", "click", function() {
      UI.goTo("screen-speak");
    });
  }

  var btnPlayHomeBackHome = document.getElementById("btn-playhome-back-home");
  if (btnPlayHomeBackHome) {
    UI.bindOnce(btnPlayHomeBackHome, "playHomeBackHomeBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnHomeProgress = document.getElementById("btn-home-progress");
  if (btnHomeProgress) {
    UI.bindOnce(btnHomeProgress, "homeProgressBound", "click", function() {
      UI.goTo("screen-progress");
    });
  }

  // Prefer ParentGuide's own binding; only bind if not already wired
  var btnHomeParent = document.getElementById("btn-home-parent");
  if (btnHomeParent && !(btnHomeParent.dataset && btnHomeParent.dataset.parentNavBound)) {
    UI.bindOnce(btnHomeParent, "homeParentBound", "click", function() {
      UI.goTo("screen-parent");
    });
  }

  // Back buttons
  var btnLearnBack = document.getElementById("btn-learn-back");
  if (btnLearnBack) {
    UI.bindOnce(btnLearnBack, "learnBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnSpeakBack = document.getElementById("btn-speak-back");
  if (btnSpeakBack) {
    UI.bindOnce(btnSpeakBack, "speakBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnLessonBack = document.getElementById("btn-lesson-back");
  if (btnLessonBack) {
    UI.bindOnce(btnLessonBack, "lessonBackBound", "click", function() {
      UI.goTo("screen-learn");
    });
  }

  var btnPlayBack = document.getElementById("btn-play-back");
  if (btnPlayBack) {
    UI.bindOnce(btnPlayBack, "playBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnReadingBack = document.getElementById("btn-reading-back");
  if (btnReadingBack) {
    UI.bindOnce(btnReadingBack, "readingBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnReadingDetailBack = document.getElementById("btn-reading-detail-back");
  if (btnReadingDetailBack) {
    UI.bindOnce(btnReadingDetailBack, "readingDetailBackBound", "click", function() {
      UI.goTo("screen-reading");
    });
  }

  var btnReadingNext = document.getElementById("reading-next-btn");
  if (btnReadingNext) {
    UI.bindOnce(btnReadingNext, "readingNextBound", "click", function() {
      var titleEl = document.getElementById("reading-detail-title");
      var currentReadingId = titleEl && titleEl.dataset ? titleEl.dataset.readingId : null;
      if (currentReadingId) {
        Reading.goToNextPassage(currentReadingId);
      }
    });
  }

  var btnProgressBack = document.getElementById("btn-progress-back");
  if (btnProgressBack) {
    UI.bindOnce(btnProgressBack, "progressBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  var btnFlashcardsBack = document.getElementById("btn-flashcards-back");
  if (btnFlashcardsBack) {
    UI.bindOnce(btnFlashcardsBack, "flashcardsBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  // Prefer ParentGuide's own binding; only bind if not already wired
  var btnParentBack = document.getElementById("btn-parent-back");
  if (btnParentBack && !(btnParentBack.dataset && btnParentBack.dataset.parentBackBound)) {
    UI.bindOnce(btnParentBack, "parentBackBound", "click", function() {
      UI.goTo("screen-home");
    });
  }

  // Punjabi toggle wiring moved to UI.refreshGlobalToggles() and guarded

  // ========================================
  // SPLASH SCREEN: Hide when app is ready
  // ========================================

  var splashShownAt = Date.now();
  var MIN_SPLASH_DISPLAY_MS = 1400; // Minimum time to show splash

  function hideSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    
    // Update ARIA state
    splash.setAttribute("aria-busy", "false");
    
    // Add hide class (triggers CSS transition)
    splash.classList.add("splash-hidden");
    
    // Remove from DOM after transition completes
    setTimeout(function() {
      if (splash && splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 650);
  }

  function requestHideSplash() {
    var elapsed = Date.now() - splashShownAt;
    var remainingTime = Math.max(0, MIN_SPLASH_DISPLAY_MS - elapsed);
    
    // Wait for minimum display time, then hide
    setTimeout(hideSplash, remainingTime);
  }

    // Hide splash after app initialization completes
    requestHideSplash();

    // Safety fallback: hide after window.load event
    window.addEventListener("load", function() {
      requestHideSplash();
    }, { once: true });

    console.log("✅ BOLO app initialized successfully");
  } catch (e) {
    console.error("❌ Failed to initialize BOLO:", e.message, e.stack);
    alert("BOLO failed to initialize: " + e.message + "\n\nCheck console for details.");
  }
});
