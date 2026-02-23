// Practice Mode v1.2 (stub)
// Integration entrypoint; exposes window.Practice

(function() {
  "use strict";

  if (!window.Practice) window.Practice = {};

  var _initialized = false;

  function init() {
    if (_initialized) return;
    _initialized = true;

    // Progress storage (optional; never throw)
    try {
      if (window.PracticeProgress && typeof window.PracticeProgress.init === "function") {
        window.PracticeProgress.init();
      }
    } catch (eP) {}

    // Load persisted Practice data (safe; no UI dependency)
    try {
      if (window.PracticeStorage && typeof window.PracticeStorage.load === "function") {
        window.Practice._data = window.PracticeStorage.load();
      }
    } catch (e0) {
      // no-op
    }

    try {
      if (window.PracticeUI && typeof window.PracticeUI.init === "function") {
        window.PracticeUI.init();
      }
    } catch (e) {
      // Never crash app startup
    }

    // Entry points: Typing Center → Practice
    try {
      function bindOpen(btnId) {
        var el = document.getElementById(btnId);
        if (!el) return;
        if (el.dataset && el.dataset.practiceOpenBound) return;
        try { el.dataset.practiceOpenBound = "1"; } catch (e0) {}

        var handler = function() {
          try {
            if (window.Practice && typeof window.Practice.open === "function") {
              window.Practice.open({ fromScreenId: (window.UI && typeof window.UI.getCurrentScreenId === "function") ? window.UI.getCurrentScreenId() : null });
              return;
            }
          } catch (e1) {}

          // Fallback: direct UI open
          try {
            if (window.PracticeUI && typeof window.PracticeUI.open === "function") window.PracticeUI.open();
          } catch (e2) {}
        };

        if (window.UI && typeof window.UI.bindOnce === "function") {
          window.UI.bindOnce(el, "practiceOpenBound_" + btnId, "click", handler);
        } else {
          el.addEventListener("click", handler);
        }
      }

      bindOpen("typingHeroPracticeBtn");
    } catch (e3) {
      // no-op
    }
  }

  function open(opts) {
    practiceStart(opts);
  }

  function close() {
    practiceStop();
  }

  // Explicit lifecycle helpers (preferred call surface)
  function practiceInit() {
    init();
  }

  function practiceStart(opts) {
    init();
    try {
      if (window.PracticeUI && typeof window.PracticeUI.open === "function") {
        window.PracticeUI.open(opts || {});
      }
    } catch (e) {}
  }

  function practiceStop() {
    try {
      if (window.PracticeUI && typeof window.PracticeUI.close === "function") {
        window.PracticeUI.close();
      }
    } catch (e) {}
  }

  // Dev-only: leak self-test
  // Runs 10 open/close cycles and checks that:
  // - PracticeUI listener registry returns to 0
  // - PracticeTimer registry returns to 0
  window.practiceSelfTestLeaks = function() {
    var cycles = 10;
    var failures = [];

    function getListenerCount() {
      try {
        return (window.PracticeUI && typeof window.PracticeUI.__debugListenerCount === "function")
          ? window.PracticeUI.__debugListenerCount()
          : null;
      } catch (e0) {
        return null;
      }
    }

    function getTimerCount() {
      try {
        return (window.PracticeTimer && typeof window.PracticeTimer.count === "function")
          ? window.PracticeTimer.count()
          : null;
      } catch (e0) {
        return null;
      }
    }

    var prevScreenId = null;
    try {
      prevScreenId = (window.UI && typeof window.UI.getCurrentScreenId === "function") ? window.UI.getCurrentScreenId() : null;
    } catch (e1) { prevScreenId = null; }

    for (var i = 0; i < cycles; i++) {
      try {
        if (window.Practice && typeof window.Practice.practiceStart === "function") {
          window.Practice.practiceStart({ fromScreenId: prevScreenId });
        }
      } catch (e2) {}

      try {
        if (window.Practice && typeof window.Practice.practiceStop === "function") {
          window.Practice.practiceStop("selfTest");
        }
      } catch (e3) {}

      var lc = getListenerCount();
      var tc = getTimerCount();

      if (lc !== null && lc !== 0) failures.push("cycle " + (i + 1) + ": listeners=" + lc);
      if (tc !== null && tc !== 0) failures.push("cycle " + (i + 1) + ": timers=" + tc);
    }

    var pass = failures.length === 0;
    try {
      if (pass) console.log("[Practice] practiceSelfTestLeaks: PASS (" + cycles + " cycles)");
      else {
        console.log("[Practice] practiceSelfTestLeaks: FAIL (" + failures.length + " issues)");
        for (var j = 0; j < failures.length; j++) console.log(" - " + failures[j]);
      }
    } catch (e4) {}

    return pass;
  };

  function practiceDestroy() {
    try {
      if (window.PracticeUI && typeof window.PracticeUI.destroy === "function") {
        window.PracticeUI.destroy();
      }
    } catch (e) {}
  }

  window.Practice.init = init;
  window.Practice.open = open;
  window.Practice.close = close;

  window.Practice.practiceInit = practiceInit;
  window.Practice.practiceStart = practiceStart;
  window.Practice.practiceStop = function(reason) { practiceStop(reason); };
  window.Practice.practiceDestroy = practiceDestroy;

  // Auto-init (keeps wiring consistent with the rest of the app)
  // Safe: init() is idempotent + wrapped in try/catch.
  try {
    init();
  } catch (e5) {}
})();
