// Typing platform helpers (keyboard inset + fullscreen)
(function() {
  if (!window.TypingPremium || typeof window.TypingPremium !== "object") {
    window.TypingPremium = {};
  }

  var TP = window.TypingPremium;
  if (!TP.platform || typeof TP.platform !== "object") TP.platform = {};

  // Keyboard inset helper (VisualViewport)
  TP.platform.setupKeyboardInsetVar = function setupKeyboardInsetVar() {
    // Guard: avoid double-binding listeners if this module is ever evaluated twice.
    try {
      if (window.__boloTypingKbInsetBound) return;
      window.__boloTypingKbInsetBound = true;
    } catch (e0) {}

    var root = document.documentElement;

    var lastInsetPx = 0;
    var kbScrollTimer = 0;

    function update() {
      var vv = window.visualViewport;
      if (!vv) {
        root.style.setProperty("--kb-inset", "0px");
        return;
      }

      // On many mobile browsers, keyboard reduces visualViewport.height.
      var inset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      var insetPx = Math.round(inset);
      root.style.setProperty("--kb-inset", String(insetPx) + "px");

      // When the keyboard opens, keep the prompt card centered.
      // Debounced and only triggers when the Race input is focused.
      try {
        var delta = insetPx - lastInsetPx;
        lastInsetPx = insetPx;
        if (delta > 20 && insetPx >= 60) {
          var raceScreen = document.getElementById("screen-typing-race");
          var isActive = !!(raceScreen && raceScreen.classList && raceScreen.classList.contains("active"));
          if (!isActive) return;

          // Avoid scrolling under modal overlays
          if (document.getElementById("typingResultModal")) return;

          var inputEl = document.getElementById("raceInput");
          if (!inputEl) return;
          if (document.activeElement !== inputEl) return;

          var card = document.getElementById("racePromptCard");
          if (!card) return;

          if (kbScrollTimer) clearTimeout(kbScrollTimer);
          kbScrollTimer = setTimeout(function() {
            try {
              if (card.scrollIntoView) {
                try {
                  card.scrollIntoView({ block: "center" });
                } catch (e2) {
                  card.scrollIntoView(true);
                }
              }
            } catch (e3) {}
          }, 150);
        }
      } catch (e1) {
        // no-op
      }
    }

    try {
      if (window.visualViewport && window.visualViewport.addEventListener) {
        window.visualViewport.addEventListener("resize", update);
        window.visualViewport.addEventListener("scroll", update);
      }
    } catch (e) {
      // no-op
    }

    window.addEventListener("orientationchange", function() {
      setTimeout(update, 80);
    });
    window.addEventListener("resize", function() {
      setTimeout(update, 80);
    });

    update();
  };

  // Fullscreen helper
  TP.platform.toggleFullscreen = function toggleFullscreen(targetEl, btnEl) {
    var isFs = !!document.fullscreenElement;

    function setPressed(val) {
      try {
        if (btnEl) btnEl.setAttribute("aria-pressed", val ? "true" : "false");
      } catch (e) {
        // no-op
      }
    }

    try {
      if (!isFs) {
        var el = targetEl || document.documentElement;
        if (el && el.requestFullscreen) {
          var p = el.requestFullscreen();
          if (p && typeof p.then === "function") {
            p.then(function() {
              setPressed(true);
            }).catch(function() {
              setPressed(false);
            });
          } else {
            setPressed(true);
          }
        }
      } else {
        if (document.exitFullscreen) {
          var p2 = document.exitFullscreen();
          if (p2 && typeof p2.then === "function") {
            p2.then(function() {
              setPressed(false);
            }).catch(function() {
              setPressed(false);
            });
          } else {
            setPressed(false);
          }
        }
      }
    } catch (e) {
      // Fail silently: many WebViews/iOS restrict fullscreen.
      setPressed(false);
    }
  };
})();
