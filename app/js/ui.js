// =====================================
// UI Module - Screen Navigation & Modals
// =====================================

// =====================================
// Section Mapping (Phase 1/2)
// =====================================

var SECTION_LABELS = window.SECTION_LABELS || {
  dailyQuest: "Daily Quest",
  learn: "Learn",
  reading: "Reading",
  play: "Play",
  speak: "Speak",
  progress: "Progress",
  home: "Home"
};

var SCREEN_TO_SECTION = window.SCREEN_TO_SECTION || {
  "screen-home": "home",
  "screen-daily-quest": "dailyQuest",
  "screen-speak": "speak",
  "screen-learn": "learn",
  "screen-lesson": "learn",
  "screen-reading": "reading",
  "screen-reading-detail": "reading",
  "screen-play-home": "play",
  "screen-play": "play",
  "screen-progress": "progress",
  "screen-flashcards": "learn",
  "screen-parent": "home"
};

window.SECTION_LABELS = SECTION_LABELS;
window.SCREEN_TO_SECTION = SCREEN_TO_SECTION;

// =====================================
// Transition Overlay (Phase 1 primitive)
// =====================================

(function() {
  if (window.TransitionOverlay) return;

  var warnedMissing = false;
  var hideTimer = null;
  var failsafeTimer = null;

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  function clampMs(value, min, max) {
    var n = (typeof value === "number" && isFinite(value)) ? value : min;
    if (n < min) n = min;
    if (n > max) n = max;
    return Math.round(n);
  }

  function getEl() {
    return document.getElementById("section-transition");
  }

  function getLabelEl() {
    return document.getElementById("section-transition-label");
  }

  function warnOnce(msg) {
    if (warnedMissing) return;
    warnedMissing = true;
    try {
      console.warn(msg);
    } catch (e) {
      // no-op
    }
  }

  function clearTimers() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (failsafeTimer) {
      clearTimeout(failsafeTimer);
      failsafeTimer = null;
    }
  }

  window.TransitionOverlay = {
    show: function(label, durationMs) {
      var reduced = prefersReducedMotion();
      var raw = (typeof durationMs === "number" && isFinite(durationMs)) ? durationMs : 250;
      // Hard caps: keeps overlay bounded even if called incorrectly.
      // - Motion allowed: <= 600ms
      // - Reduced motion: <= 80ms (near-instant)
      var effectiveDuration = reduced ? clampMs(raw, 1, 80) : clampMs(raw, 1, 600);

      clearTimers();

      var el = getEl();
      var labelEl = getLabelEl();

      if (!el || !labelEl) {
        warnOnce("TransitionOverlay: missing #section-transition or #section-transition-label");
        return effectiveDuration;
      }

      labelEl.textContent = (label == null) ? "" : String(label);
      el.setAttribute("aria-hidden", "false");
      el.classList.add("is-visible");

      hideTimer = setTimeout(function() {
        window.TransitionOverlay.hide();
      }, Math.max(1, effectiveDuration));

      // Fail-safe: never allow it to remain visible if hideTimer is lost
      failsafeTimer = setTimeout(function() {
        window.TransitionOverlay.hide();
      }, reduced ? 200 : 1200);

      return effectiveDuration;
    },
    hide: function() {
      clearTimers();

      var el = getEl();
      if (!el) return;

      el.classList.remove("is-visible");
      el.setAttribute("aria-hidden", "true");
    },
    isVisible: function() {
      var el = getEl();
      return !!(el && el.classList.contains("is-visible") && el.getAttribute("aria-hidden") !== "true");
    }
  };
})();

var UI = {
  // Rollout flags (dev-only kill switch)
  flags: (window.UI && window.UI.flags) ? window.UI.flags : {
    sectionTransitions: true
  },

  state: {
    currentSectionKey: null,
    isTransitioning: false,
    _navToken: 0,
    _unlockTimer: null,
    _unlockFailsafeTimer: null
  },

  // Map screenId -> section key (or null)
  getSectionKeyForScreen: function(screenId) {
    if (!screenId) return null;
    try {
      return (SCREEN_TO_SECTION && SCREEN_TO_SECTION[screenId]) ? SCREEN_TO_SECTION[screenId] : null;
    } catch (e) {
      return null;
    }
  },

  // Major sections only (entry overlay)
  isMajorSection: function(sectionKey) {
    return sectionKey === "dailyQuest" || sectionKey === "learn" || sectionKey === "reading" || sectionKey === "play" || sectionKey === "speak" || sectionKey === "progress";
  },

  // Gate section transitions (Phase 2)
  //
  // Transitions are entry-only and section-based.
  // Do NOT add per-module transitions in Lessons/Reading/Games/DailyQuest.
  // Trigger rules:
  // - Only when entering a NEW major section (dailyQuest/learn/reading/play/progress)
  // - Never on navigation to Home
  // - Never for intra-section screens (e.g., Learn list <-> Lesson)
  // - Suppressed on boot/restore flows via { skipTransition: true }
  // - Suppressed when already transitioning (rapid taps): navigation continues, overlay does not queue
  // - Can be disabled globally with UI.flags.sectionTransitions = false
  //
  // Manual checklist (keep ≤10):
  // - Home -> each major section shows overlay once
  // - Learn list -> lesson detail: no overlay
  // - Reading list -> reading detail: no overlay
  // - Daily Quest -> Play: overlay only when entering Play
  // - Reduced motion: near-instant, no animation reliance
  // - Boot/restore: no overlay
  // - Rapid taps: no queued overlays; no stuck lock
  shouldShowSectionTransition: function(prevSection, nextSection, opts) {
    opts = opts || {};
    if (!(UI.flags && UI.flags.sectionTransitions === true)) return false;
    if (opts.skipTransition === true) return false;
    if (!UI.isMajorSection(nextSection)) return false;
    if (!nextSection || nextSection === prevSection) return false;
    if (nextSection === "home") return false;
    return true;
  },

  // Bind an event handler once per element using a dataset flag
  bindOnce: function(el, key, event, handler, options) {
    if (!el) return;
    try {
      if (el.dataset && el.dataset[key]) return;
      if (el.dataset) el.dataset[key] = "1";
    } catch (e) {
      // no-op
    }
    el.addEventListener(event, handler, options || false);
  },
  // Initialize UI - wire up event listeners
  init: function() {
    UI.ensureViewportVarsBound();
    UI.wireModalCloseButtons();
    UI.wireFooterToggles();
    UI.wireInkRipples();
    UI.renderHomeResumeCard();
    UI.renderStreakSection();

    // Initialize current section tracking from the DOM (no routing side-effects)
    try {
      var active = document.querySelector("section.screen.active");
      var sid = active && active.id ? active.id : null;
      UI.state.currentSectionKey = UI.getSectionKeyForScreen(sid) || "home";
    } catch (e) {
      UI.state.currentSectionKey = UI.state.currentSectionKey || "home";
    }

  },

  // =============================
  // Ink Ripple (Home tiles)
  // =============================

  wireInkRipples: function() {
    if (UI._inkRipplesBound) return;
    UI._inkRipplesBound = true;

    function prefersReducedMotion() {
      try {
        return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      } catch (e) {
        return false;
      }
    }

    function createRipple(target, clientX, clientY, forceCenter) {
      if (!target || !(target instanceof Element)) return;
      if (target.disabled) return;
      if (target.classList && !target.classList.contains("ink-ripple")) return;

      var rect = target.getBoundingClientRect();
      if (!rect || !(rect.width > 0) || !(rect.height > 0)) return;

      // Remove any lingering ripples (keeps DOM tidy on rapid taps)
      try {
        var old = target.querySelectorAll(".ink-ripple__wave");
        for (var i = 0; i < old.length; i++) {
          old[i].remove();
        }
      } catch (e) {
        // no-op
      }

      var size = Math.ceil(Math.max(rect.width, rect.height) * 1.35);
      var x;
      var y;
      if (forceCenter) {
        x = (rect.width / 2) - (size / 2);
        y = (rect.height / 2) - (size / 2);
      } else {
        x = (clientX - rect.left) - (size / 2);
        y = (clientY - rect.top) - (size / 2);
      }

      var wave = document.createElement("span");
      wave.className = "ink-ripple__wave";
      wave.style.width = size + "px";
      wave.style.height = size + "px";
      wave.style.left = Math.round(x) + "px";
      wave.style.top = Math.round(y) + "px";

      target.appendChild(wave);

      var reduced = prefersReducedMotion();
      var ttl = reduced ? 30 : 650;

      function cleanup() {
        try {
          if (wave && wave.parentNode) wave.parentNode.removeChild(wave);
        } catch (e) {
          // no-op
        }
      }

      wave.addEventListener("animationend", cleanup);
      setTimeout(cleanup, ttl);
    }

    // Pointer ripple
    document.addEventListener("pointerdown", function(e) {
      try {
        var t = e && e.target ? e.target : null;
        if (!t || !t.closest) return;
        var btn = t.closest(".ink-ripple");
        if (!btn) return;
        createRipple(btn, e.clientX, e.clientY, false);
      } catch (err) {
        // non-fatal
      }
    }, { passive: true });

    // Keyboard ripple (centered)
    document.addEventListener("keydown", function(e) {
      try {
        if (!e) return;
        var key = e.key;
        if (key !== "Enter" && key !== " ") return;
        var active = document.activeElement;
        if (!active || !active.classList || !active.classList.contains("ink-ripple")) return;
        var rect = active.getBoundingClientRect();
        createRipple(active, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      } catch (err) {
        // non-fatal
      }
    });
  },

  // =============================
  // Viewport/Footer CSS Variables
  // =============================

  // RAF-batched sync of CSS vars used to stabilize Android viewport + keyboard behavior.
  // Sets:
  // - --app-dvh   (px): visualViewport.height if available else window.innerHeight
  // - --kb-inset  (px): approximate keyboard inset (clamped >= 0)
  // - --footer-h  (px): measured footer height
  syncViewportVars: function() {
    if (UI._viewportVarsRaf) return;
    UI._viewportVarsRaf = window.requestAnimationFrame(function() {
      UI._viewportVarsRaf = 0;

      var root = document.documentElement;
      if (!root || !root.style) return;

      var vv = window.visualViewport;
      var appHeight = (vv && typeof vv.height === "number" && isFinite(vv.height)) ? vv.height : window.innerHeight;
      if (typeof appHeight === "number" && isFinite(appHeight) && appHeight > 0) {
        root.style.setProperty("--app-dvh", Math.round(appHeight) + "px");
      }

      var kbInset = 0;
      try {
        if (vv && typeof vv.height === "number" && isFinite(vv.height)) {
          var offsetTop = (typeof vv.offsetTop === "number" && isFinite(vv.offsetTop)) ? vv.offsetTop : 0;
          var rawInset = (window.innerHeight - vv.height - offsetTop);
          kbInset = Math.max(0, Math.round(isFinite(rawInset) ? rawInset : 0));
        }
      } catch (e) {
        kbInset = 0;
      }
      root.style.setProperty("--kb-inset", kbInset + "px");

      var footer = document.querySelector(".footer-nav");
      if (footer && footer.getBoundingClientRect) {
        var h = footer.getBoundingClientRect().height;
        if (typeof h === "number" && isFinite(h) && h > 0) {
          root.style.setProperty("--footer-h", Math.round(h) + "px");
        }
      }
    });
  },

  ensureViewportVarsBound: function() {
    if (UI._viewportVarsBound) return;
    UI._viewportVarsBound = true;

    // Initial sync
    UI.syncViewportVars();

    // Passive listeners (Android + iOS safe)
    try {
      window.addEventListener("resize", UI.syncViewportVars, { passive: true });
      window.addEventListener("orientationchange", UI.syncViewportVars, { passive: true });
    } catch (e) {
      // no-op
    }

    try {
      if (window.visualViewport && window.visualViewport.addEventListener) {
        window.visualViewport.addEventListener("resize", UI.syncViewportVars, { passive: true });
        window.visualViewport.addEventListener("scroll", UI.syncViewportVars, { passive: true });
      }
    } catch (e) {
      // no-op
    }
  },

  // Boot-time routing helper (skip transitions). Use only for programmatic startup/restore.
  goToInitial: function(screenId) {
    return UI.goTo(screenId, { skipTransition: true });
  },

  // Navigate to a screen
  goTo: function(screenId, opts) {
    opts = opts || {};

    // Fail silently if screen doesn't exist
    var exists = document.getElementById(screenId);
    if (!exists) return;

    if (!UI.state) {
      UI.state = {
        currentSectionKey: null,
        isTransitioning: false,
        _navToken: 0,
        _unlockTimer: null,
        _unlockFailsafeTimer: null
      };
    }

    // Capture active screen id early (for exit hooks)
    var active = document.querySelector("section.screen.active");
    var prevScreenId = active && active.id ? active.id : (State.state.session && State.state.session.screenId);

    var nextSection = UI.getSectionKeyForScreen(screenId);
    var prevSection = UI.state.currentSectionKey;

    // If section tracking hasn't been initialized yet, infer it from the currently active screen.
    // This allows the very first user navigation from Home -> Major section to still show an overlay.
    if (prevSection === null || prevSection === undefined) {
      var inferredPrev = UI.getSectionKeyForScreen(prevScreenId);
      if (inferredPrev) {
        UI.state.currentSectionKey = inferredPrev;
        prevSection = inferredPrev;
      }
    }

    // True first navigation (unknown prior section): never show overlay
    var isFirstNav = (prevSection === null || prevSection === undefined);

    // Re-entrancy: never queue overlays
    var isLocked = !!UI.state.isTransitioning;

    UI.state._navToken = (UI.state._navToken || 0) + 1;
    var navToken = UI.state._navToken;

    function performNavigation() {
      if (navToken !== UI.state._navToken) return;

      // Get the target screen element (re-resolve in case DOM changed)
      var targetScreen = document.getElementById(screenId);
      if (!targetScreen) return;

      // Allow screens to clean up before switching
      UI._runScreenHook(prevScreenId, "unmount");

      // Activate target screen and hide others from interaction/assistive tech
      UI.setActiveScreen(targetScreen);

      // Screen-specific mount hooks (render/sync after becoming active)
      UI._runScreenHook(screenId, "mount");

      // Keep global toggles and bindings fresh after navigation
      UI.refreshGlobalToggles();

      // Exit hook: leaving lesson screen should reset session-only lesson runtime
      if (prevScreenId === "screen-lesson" && screenId !== "screen-lesson") {
        try {
          if (typeof Lessons !== "undefined" && Lessons && typeof Lessons.resetRuntime === "function") {
            Lessons.resetRuntime(null);
          }
        } catch (e) {
          // no-op
        }
      }

      // Update state
      State.state.session.screenId = screenId;
      State.save();

      // Scroll to top
      window.scrollTo(0, 0);

      // Move focus into the destination screen after it is active
      UI.focusFirst(targetScreen);

      // Home-specific UI refreshes
      if (screenId === "screen-home") {
        UI.renderHomeResumeCard();
        UI.renderStreakSection();
      }

      // Update section tracking after successful navigation
      if (nextSection) {
        UI.state.currentSectionKey = nextSection;
      }
    }

    var shouldShow = (!isFirstNav) && (!isLocked) && UI.shouldShowSectionTransition(prevSection, nextSection, opts);

    if (shouldShow && window.TransitionOverlay && typeof window.TransitionOverlay.show === "function") {
      UI.state.isTransitioning = true;

      // Clear any prior unlock timers (defensive)
      if (UI.state._unlockTimer) {
        clearTimeout(UI.state._unlockTimer);
        UI.state._unlockTimer = null;
      }
      if (UI.state._unlockFailsafeTimer) {
        clearTimeout(UI.state._unlockFailsafeTimer);
        UI.state._unlockFailsafeTimer = null;
      }

      var label = (SECTION_LABELS && nextSection && SECTION_LABELS[nextSection]) ? SECTION_LABELS[nextSection] : "";
      var requestedDuration = 250;
      var effectiveDuration = 250;
      try {
        effectiveDuration = window.TransitionOverlay.show(label, requestedDuration);
      } catch (e) {
        // If overlay fails, continue navigation without blocking
        effectiveDuration = 1;
      }

      UI.state._unlockTimer = setTimeout(function() {
        if (navToken !== UI.state._navToken) return;
        UI.state.isTransitioning = false;
        UI.state._unlockTimer = null;
      }, Math.max(1, (typeof effectiveDuration === "number" ? effectiveDuration : requestedDuration) + 50));

      // Absolute lock fail-safe: never allow isTransitioning to remain true indefinitely
      UI.state._unlockFailsafeTimer = setTimeout(function() {
        UI.state.isTransitioning = false;
        UI.state._unlockFailsafeTimer = null;
      }, 1500);

      // Yield one frame so the overlay can paint before mount/render work
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(performNavigation);
      } else {
        setTimeout(performNavigation, 0);
      }
      return;
    }

    // No transition: navigate immediately
    performNavigation();
    return;

  },

  // Ensure global toggles reflect current state and bindings exist
  refreshGlobalToggles: function() {
    // Re-wire modal close buttons (safe, guarded by dataset flags)
    try { UI.wireModalCloseButtons(); } catch (e) {}

    // Re-wire footer quick actions (safe, guarded by dataset flags)
    try { UI.wireFooterToggles(); } catch (e) {}

    // Re-wire Punjabi toggle (safe, guarded)
    try { UI.wirePunjabiToggle(); } catch (e) {}

    // Punjabi footer toggle: read state and paint UI
    try { UI.syncPunjabiToggleUI(); } catch (e) {}

    // Footer: active tab state + badges (safe if controls missing)
    try { UI.syncFooterActiveState(); } catch (e) {}
    try { UI.syncFooterBadges(); } catch (e) {}

    // Learn: paint QA toggle and filter controls (safe if not on Learn screen)
    try {
      if (typeof Lessons !== "undefined" && Lessons) {
        if (typeof Lessons.syncQAToggle === "function") Lessons.syncQAToggle();
        if (typeof Lessons.syncFilterControls === "function") Lessons.syncFilterControls();
      }
    } catch (e) {}

    // Reading: paint vocab toggle + collapse state (safe if controls missing)
    try {
        if (typeof Reading !== "undefined" && Reading) {
          if (typeof Reading.syncVocabToggleUI === "function") Reading.syncVocabToggleUI();
          Reading.syncVocabCollapseUI(); // Ensure UI refresh loads persisted Reading vocab collapse state
      }
    } catch (e) {}

  },

  // Footer: paint which destination is active (do not treat action buttons as tabs)
  syncFooterActiveState: function() {
    var btnProgress = document.getElementById("toggle-progress");
    if (!btnProgress) return;

    var active = null;
    try {
      active = document.querySelector("section.screen.active");
    } catch (e) {
      active = null;
    }
    var screenId = (active && active.id) ? active.id : null;
    var isProgress = screenId === "screen-progress";

    btnProgress.classList.toggle("is-active", isProgress);
    if (isProgress) btnProgress.setAttribute("aria-current", "page");
    else btnProgress.removeAttribute("aria-current");
  },

  // Footer: show a single low-risk badge on Progress when XP has changed since last viewing Progress
  syncFooterBadges: function() {
    var badge = document.getElementById("footer-progress-badge");
    if (!badge) return;

    var profile = null;
    try {
      if (typeof State !== "undefined" && State && typeof State.getActiveProfile === "function") {
        profile = State.getActiveProfile();
      }
    } catch (e) {
      profile = null;
    }

    if (!profile || typeof profile.id !== "string") {
      badge.classList.remove("is-visible");
      badge.setAttribute("aria-hidden", "true");
      return;
    }

    var currentXP = (typeof profile.xp === "number" && isFinite(profile.xp)) ? profile.xp : 0;

    var active = null;
    try {
      active = document.querySelector("section.screen.active");
    } catch (e2) {
      active = null;
    }
    var screenId = (active && active.id) ? active.id : null;
    var isOnProgress = screenId === "screen-progress";

    // Ensure container exists
    try {
      if (State && State.state && State.state.progress) {
        if (!State.state.progress.lastSeenXPByProfile || typeof State.state.progress.lastSeenXPByProfile !== "object") {
          State.state.progress.lastSeenXPByProfile = {};
        }
      }
    } catch (e3) {}

    var lastSeen = 0;
    try {
      var map = State.state.progress.lastSeenXPByProfile;
      lastSeen = (map && typeof map[profile.id] === "number" && isFinite(map[profile.id])) ? map[profile.id] : 0;
    } catch (e4) {
      lastSeen = 0;
    }

    if (isOnProgress) {
      // Visiting Progress clears the badge
      badge.classList.remove("is-visible");
      badge.setAttribute("aria-hidden", "true");
      try {
        if (State && State.state && State.state.progress && State.state.progress.lastSeenXPByProfile) {
          if (State.state.progress.lastSeenXPByProfile[profile.id] !== currentXP) {
            State.state.progress.lastSeenXPByProfile[profile.id] = currentXP;
            State.save();
          }
        }
      } catch (e5) {}
      return;
    }

    var shouldShow = currentXP > lastSeen;
    badge.classList.toggle("is-visible", shouldShow);
    badge.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  },

  // Screen lifecycle dispatcher (mount/unmount)
  _runScreenHook: function(screenId, hookName) {
    if (!screenId || !hookName) return;

    var hooks = {
      "screen-learn": {
        mount: function() {
          if (typeof Lessons !== "undefined" && Lessons && typeof Lessons.mount === "function") {
            Lessons.mount();
          }
        }
      },
      "screen-reading": {
        mount: function() {
          if (typeof Reading !== "undefined" && Reading && typeof Reading.mountList === "function") {
            Reading.mountList();
          }
        }
      },
      "screen-reading-detail": {
        mount: function() {
          if (typeof Reading !== "undefined" && Reading && typeof Reading.mountDetail === "function") {
            Reading.mountDetail();
          }
        }
      },
      "screen-parent": {
        mount: function() {
          if (typeof ParentGuide !== "undefined" && ParentGuide && typeof ParentGuide.mountScreen === "function") {
            ParentGuide.mountScreen();
          }
        }
      }
    };

    var entry = hooks[screenId];
    if (entry && typeof entry[hookName] === "function") {
      try {
        entry[hookName]();
      } catch (e) {
        // no-op; lifecycle hooks should never block navigation
      }
    }
  },

  // Toggle active screen and apply accessibility hiding semantics
  setActiveScreen: function(targetScreen) {
    var screens = document.querySelectorAll("section.screen");
    screens.forEach(function(screen) {
      var isTarget = screen === targetScreen;
      screen.classList.toggle("active", isTarget);
      screen.setAttribute("aria-hidden", isTarget ? "false" : "true");

      // Use hidden for inactive screens (single-main landmark approach)
      if (isTarget) {
        screen.removeAttribute("hidden");
      } else {
        screen.setAttribute("hidden", "");
      }

      // Prefer inert where supported to prevent off-screen interaction
      if ("inert" in screen) {
        screen.inert = !isTarget;
      }
    });

    // Keep Speak nav button state in sync (safe even if button not present)
    try {
      var sid = targetScreen && targetScreen.id ? targetScreen.id : null;
      UI.syncSpeakNavActive(sid);
    } catch (e) {
      // no-op
    }
  },

  // Sync Speak navigation button active state to the current screen
  syncSpeakNavActive: function(screenId) {
    var isActive = (screenId === "screen-speak");
    var ids = ["btn-home-bolo", "btn-speak-nav"];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (!el) continue;
      el.classList.toggle("is-active", isActive);
      if (isActive) {
        el.setAttribute("aria-current", "page");
      } else {
        el.removeAttribute("aria-current");
      }
    }
  },

  // Focus the best candidate within a screen for keyboard/screen-reader users
  focusFirst: function(screenEl) {
    if (!screenEl) return;

    var focusTarget = null;

    // Priority: first heading
    focusTarget = screenEl.querySelector("h1, h2, h3");

    // Next: explicit autofocus marker
    if (!focusTarget) {
      focusTarget = screenEl.querySelector("[data-autofocus]");
    }

    // Next: first focusable control
    if (!focusTarget) {
      focusTarget = screenEl.querySelector(
        "button, a[href], input:not([type=hidden]), select, textarea"
      );
    }

    // Fallback: focus the section itself
    if (!focusTarget) {
      focusTarget = screenEl;
    }

    // Make non-focusable targets temporarily focusable without altering tab order
    if (focusTarget && focusTarget.tabIndex < 0) {
      focusTarget.setAttribute("tabindex", "-1");
    }

    try {
      focusTarget.focus({ preventScroll: true });
    } catch (e) {
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus();
      }
    }
  },

  // Open a modal
  openModal: function(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    UI.lockBodyScroll();
    UI.syncViewportVars();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  },

  // Close a modal
  closeModal: function(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    // Only unlock if no other modals are active.
    try {
      var anyActive = document.querySelector(".modal-backdrop.active");
      if (!anyActive) UI.unlockBodyScroll();
    } catch (e) {
      UI.unlockBodyScroll();
    }
  },

  // =============================
  // Body Scroll Lock (Modal Open)
  // =============================
  lockBodyScroll: function() {
    if (UI._bodyScrollLocked) return;
    UI._bodyScrollLocked = true;

    var y = 0;
    try {
      y = window.scrollY || window.pageYOffset || 0;
    } catch (e) {
      y = 0;
    }
    UI._bodyScrollY = y;

    var body = document.body;
    if (!body) return;

    try {
      body.classList.add("modal-open");
      body.style.position = "fixed";
      body.style.top = (-y) + "px";
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    } catch (e) {
      // no-op
    }
  },

  unlockBodyScroll: function() {
    if (!UI._bodyScrollLocked) return;
    UI._bodyScrollLocked = false;

    var y = UI._bodyScrollY || 0;
    UI._bodyScrollY = 0;

    var body = document.body;
    if (body) {
      try {
        body.classList.remove("modal-open");
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
      } catch (e) {
        // no-op
      }
    }

    try {
      window.scrollTo(0, y);
    } catch (e) {
      // no-op
    }
  },

  // Wire up modal close buttons
  wireModalCloseButtons: function() {
    var closeButtons = document.querySelectorAll("[data-modal-close]");
    closeButtons.forEach(function(btn) {
      UI.bindOnce(btn, "modalCloseBound", "click", function(e) {
        e.preventDefault();
        var modalId = btn.getAttribute("data-modal-close");
        UI.closeModal(modalId);
      });
    });
  },

  // Wire up footer toggles
  wireFooterToggles: function() {
    // Progress (footer)
    var btnProgress = document.getElementById("toggle-progress");
    if (btnProgress) {
      UI.bindOnce(btnProgress, "footerProgressBound", "click", function(e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        UI.goTo("screen-progress");
      });
    }
    
    // Switch profile link
    var linkSwitchProfile = document.getElementById("link-switch-profile");
    if (linkSwitchProfile) {
      UI.bindOnce(linkSwitchProfile, "linkSwitchBound", "click", function(e) {
        e.preventDefault();
        UI.openModal("modal-profiles");
      });
    }

    // Settings gear (footer) → open profiles modal
    var btnSettings = document.getElementById("toggle-settings");
    if (btnSettings) {
      UI.bindOnce(btnSettings, "footerSettingsBound", "click", function(e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        UI.openModal("modal-profiles");
      });
    }
  },

  // Wire Punjabi toggle click (footer)
  wirePunjabiToggle: function() {
    var btn = document.getElementById("toggle-punjabi");
    if (!btn) return;
    UI.bindOnce(btn, "punjabiToggleBound", "click", function(e) {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      // no-op for now
      UI.syncPunjabiToggleUI();
    });
  },

  // Update Punjabi toggle UI (idempotent; read state → paint UI)
  syncPunjabiToggleUI: function() {
    var btn = document.getElementById("toggle-punjabi");
    if (!btn) return;
    var isOn = (typeof State !== 'undefined' && State.getPunjabiEnabled) ? !!State.getPunjabiEnabled() : !!State.state.settings.punjabiOn;
    var statusEl = document.getElementById("footer-punjabi-status");
    if (statusEl) {
      statusEl.textContent = isOn ? "On" : "Off";
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");
      btn.classList.toggle("active", !!isOn);
      return;
    }

    // Backward-compatible fallback
    btn.textContent = isOn ? "Punjabi: On" : "Punjabi: Off";
    btn.setAttribute("aria-pressed", isOn ? "true" : "false");
    btn.classList.toggle("active", !!isOn);
  },

  // Update header with profile info
  updateHeader: function() {
    var profile = State.getActiveProfile();
    if (!profile) return;
    
    // Update profile name in header
    var headerProfileName = document.getElementById("header-profile-name");
    if (headerProfileName) {
      headerProfileName.textContent = profile.name;
    }
    
    // Update level badge
    var headerLevel = document.getElementById("header-level");
    if (headerLevel) {
      headerLevel.textContent = profile.level;
    }
    
    // Update XP bar fill (xp % 100)
    var xpBarFill = document.getElementById("xp-bar-fill");
    if (xpBarFill) {
      var xp = Math.max(0, profile.xp || 0);
      var xpPercent = xp % 100;
      xpBarFill.style.width = xpPercent + "%";
    }
  },

  // ===== Home Resume/Today Card =====

  _getHomeResumeContext: function() {
    var sess = (State && State.state && State.state.session) ? State.state.session : {};


    // Next: resume lesson
    if (sess && sess.currentLessonId) {
      return {
        type: "lesson",
        lessonId: sess.currentLessonId,
        title: "Resume Lesson",
        subtitle: "Pick up your last lesson.",
        cta: "Continue Lesson"
      };
    }

    // Next: resume reading
    if (sess && sess.currentReadingId) {
      return {
        type: "reading",
        readingId: sess.currentReadingId,
        title: "Resume Reading",
        subtitle: "Continue your last passage.",
        cta: "Continue Reading"
      };
    }

    // Default: promote Daily Quest
    return {
      type: "dailyQuest",
      title: "Today",
      subtitle: "Start your Daily Quest for a quick win.",
      cta: "Start Daily Quest"
    };
  },
  _performHomeResumePrimaryAction: function() {
    var ctx = UI._getHomeResumeContext();

    try {
      if (ctx.type === "lesson") {
        if (typeof Lessons !== "undefined" && Lessons && typeof Lessons.startLesson === "function") {
          Lessons.startLesson(ctx.lessonId);
        } else {
          UI.goTo("screen-learn");
        }
        return;
      }

      if (ctx.type === "reading") {
        if (typeof Reading !== "undefined" && Reading && typeof Reading.openReadingDetail === "function") {
          Reading.openReadingDetail(ctx.readingId);
        } else {
          UI.goTo("screen-reading");
        }
        return;
      }

      // Daily Quest: launch quest flow directly
      if (ctx.type === "dailyQuest") {
        try {
          if (typeof DailyQuest !== "undefined" && DailyQuest && typeof DailyQuest.startNext === "function") {
            DailyQuest.startNext();
          } else {
            // fallback: go to quest screen
            var profile = (typeof State !== "undefined" && State && typeof State.getActiveProfile === "function") ? State.getActiveProfile() : null;
            var profileId = profile && profile.id ? profile.id : null;
            if (profileId && typeof DailyQuest.getOrCreate === "function") {
              DailyQuest.getOrCreate(profileId);
              if (typeof DailyQuest.render === "function") DailyQuest.render();
            }
            UI.goTo("screen-daily-quest");
          }
        } catch (err) {
          console.error('[BOLO] Error launching Daily Quest from Home Resume:', err);
        }
        return;
      }
    } catch (e) {
      console.error('[BOLO] Error in _performHomeResumePrimaryAction:', e);
    }
  },

  renderHomeResumeCard: function() {
    var card = document.getElementById("home-resume-card");
    if (!card) return;

    var titleEl = document.getElementById("home-resume-title");
    var subtitleEl = document.getElementById("home-resume-subtitle");
    var btn = document.getElementById("btn-home-resume-primary");

    var ctx = UI._getHomeResumeContext();
    if (titleEl) titleEl.textContent = ctx.title;
    if (subtitleEl) subtitleEl.textContent = ctx.subtitle;
    if (btn) btn.textContent = ctx.cta;

    if (btn && !(btn.dataset && btn.dataset.homeResumeBound === "true")) {
      if (btn.dataset) btn.dataset.homeResumeBound = "true";
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        UI._performHomeResumePrimaryAction();
      });
    }
  },

  renderStreakSection: function() {
    var streakEl = document.getElementById("current-streak");
    if (!streakEl) return;

    var count = 0;
    var completedToday = false;
    try {
      if (typeof State !== "undefined" && State && typeof State.getDailyQuestProfileContainer === "function") {
        var cont = State.getDailyQuestProfileContainer();
        if (cont && typeof cont.streakCount === "number") count = cont.streakCount;

        // Completion status (used to style Roz button in the 50/50 streak card)
        var todayKey = null;
        try {
          if (typeof toISODateLocal === "function") {
            todayKey = toISODateLocal(new Date());
          } else {
            // Fallback: local YYYY-MM-DD
            var d = new Date();
            var mm = String(d.getMonth() + 1);
            var dd = String(d.getDate());
            if (mm.length < 2) mm = "0" + mm;
            if (dd.length < 2) dd = "0" + dd;
            todayKey = d.getFullYear() + "-" + mm + "-" + dd;
          }
        } catch (eToday) {
          todayKey = null;
        }

        if (todayKey && cont && cont.lastQuestCompletionAwardedDateKey === todayKey) {
          completedToday = true;
        }
      }
    } catch (e) {
      count = 0;
    }

    streakEl.textContent = String(count);

    // Sync the Roz half (if present) to show Ready vs Done today.
    try {
      var rozBtn = document.getElementById("btn-home-roz");
      if (rozBtn) {
        rozBtn.classList.toggle("is-complete", completedToday);
        // Keep Punjabi line consistent; only adjust the English line for clarity.
        var en = rozBtn.querySelector(".btn-label-en");
        if (en) en.textContent = completedToday ? "Roz ✓" : "Roz (ਰੋਜ਼)";
        rozBtn.setAttribute("aria-label", completedToday ? "Roz (Daily Quest) — Done today" : "Roz (Daily Quest)");
      }
    } catch (eRoz) {
      // no-op
    }
  }
};

// =========================================================
// HomeLanes — Home-only Lane Tabs + Shortcuts (idempotent)
// =========================================================
(function() {
  if (window.HomeLanes) return;

  function $(sel) {
    return document.querySelector(sel);
  }

  function getProfileIdSafe() {
    try {
      if (window.State && typeof State.getActiveProfile === "function") {
        var p = State.getActiveProfile();
        if (p && p.id != null) return String(p.id);
      }
      if (window.State && State.profileId != null) return String(State.profileId);
    } catch (e) {
      // no-op
    }
    return "default";
  }

  function laneStorageKey() {
    return "bolo.homeLane." + getProfileIdSafe();
  }

  function normalizeLane(lane) {
    // Back-compat: older builds used "exp" for Encyclopedia/Explore.
    if (lane === "exp") return "ency";
    return lane;
  }

  function getLane() {
    try {
      var stored = localStorage.getItem(laneStorageKey());
      // Default (first run): clean Home (no active lane)
      if (stored == null) stored = "";

      stored = normalizeLane(stored);

      // "" is always allowed (clean Home)
      if (stored === "") return "";

      for (var i = 0; i < LANES.length; i++) {
        if (LANES[i].id === stored) return stored;
      }

      return "";
    } catch (e) {
      return "";
    }
  }

  function setLane(lane) {
    try {
      localStorage.setItem(laneStorageKey(), lane);
    } catch (e) {
      // no-op
    }
  }

  // Exactly 5 tabs: ABC / 123 / Calculator / Glossary / Encyclopedia
  // No "All" tab; empty lane ("") keeps Home clean.
  var LANES = [
    { id: "abc", en: "ABC", paShort: "ਅੱਖਰ", sub: "Letters practice", status: "comingSoon", toast: "ABC games coming soon" },
    { id: "num", en: "123", paShort: "ਅੰਕ", sub: "Numbers practice", status: "comingSoon", toast: "Number games coming soon" },
    { id: "calc", en: "Calculator", paShort: "ਕੈਲਕੂਲੇਟਰ", sub: "Quick math", status: "comingSoon", toast: "Calculator practice coming soon" },
    { id: "gloss", en: "Glossary", paShort: "ਸ਼ਬਦਕੋਸ਼", sub: "Word meanings", status: "comingSoon", toast: "Glossary coming soon" },
    { id: "ency", en: "Explore", paShort: "ਖੋਜ", sub: "Try new things", status: "comingSoon", toast: "Explore activities coming soon" }
  ];

  function getLaneMeta(id) {
    if (!id) return null;
    for (var i = 0; i < LANES.length; i++) {
      if (LANES[i].id === id) return LANES[i];
    }
    return null;
  }

  function ensureHintEl() {
    var panel = document.getElementById("homeLanePanel");
    if (!panel) return null;

    var el = document.getElementById("homeLaneHint");
    if (el) return el;

    el = document.createElement("div");
    el.id = "homeLaneHint";
    el.className = "home-lane-hint";
    el.setAttribute("aria-live", "polite");

    // Insert right after the belt
    var tabs = document.getElementById("homeLaneTabs");
    if (tabs && tabs.parentNode === panel) {
      if (tabs.nextSibling) panel.insertBefore(el, tabs.nextSibling);
      else panel.appendChild(el);
    } else {
      panel.appendChild(el);
    }
    return el;
  }

  function setHint(text) {
    var el = ensureHintEl();
    if (!el) return;
    el.textContent = text ? String(text) : "";
    el.classList.toggle("is-empty", !el.textContent);
  }

  function renderTabs(activeLane) {
    var root = $("#homeLaneTabs");
    if (!root) return;

    var html = "";
    for (var i = 0; i < LANES.length; i++) {
      var l = LANES[i];
      var isActive = l.id === activeLane;
      html +=
        '<button type="button" class="lane-tab' + (isActive ? ' is-active' : '') + '" role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '" data-lane="' + l.id + '" data-status="' + (l.status || '') + '" data-sub="' + (l.sub || '') + '" data-pa="' + (l.paShort || '') + '" data-toast="' + (l.toast || '') + '">' +
          '<span class="lane-top">' +
            '<span class="lane-dot" aria-hidden="true"></span>' +
            '<span class="lane-en">' + l.en + '</span>' +
          '</span>' +
          '<span class="lane-sub">' + (l.sub || '') + '</span>' +
        '</button>';
    }
    root.innerHTML = html;
  }

  function applyLane(lane) {
    setLane(lane || "");

    // Update active state in-place (no rebind)
    var tabs = $("#homeLaneTabs");
    if (tabs) {
      var btns = tabs.querySelectorAll("[data-lane]");
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        var isActive = b.getAttribute("data-lane") === lane;
        try {
          b.classList.toggle("is-active", isActive);
        } catch (e) {
          // no-op
        }
        b.setAttribute("aria-selected", isActive ? "true" : "false");
      }
    }

    // No Quick Start UI; lane selection is just a simple tab state.
  }

  function bindOnce(el, key, event, handler) {
    if (!el) return;
    var attr = "bound" + key;
    try {
      if (el.dataset && el.dataset[attr]) return;
      if (el.dataset) el.dataset[attr] = "1";
    } catch (e) {
      // no-op
    }
    el.addEventListener(event, handler, false);
  }

  var toastTimer = null;
  function showToast(message, durationMs) {
    var host = document.getElementById("toastHost");
    if (!host) return;

    var msg = (message == null) ? "" : String(message);
    if (!msg) return;

    host.textContent = msg;
    host.classList.add("is-visible");

    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    var ms = (typeof durationMs === "number" && isFinite(durationMs)) ? durationMs : 1600;
    toastTimer = setTimeout(function() {
      host.classList.remove("is-visible");
      toastTimer = null;
    }, Math.max(250, ms));
  }

  window.HomeLanes = {
    init: function() {
      var tabs = $("#homeLaneTabs");
      if (!tabs) return;

      // Idempotent init + refresh path
      try {
        if (tabs.dataset && tabs.dataset.hlInit === "1") {
          window.HomeLanes.refresh();
          return;
        }
        if (tabs.dataset) tabs.dataset.hlInit = "1";
      } catch (e) {
        // no-op
      }

      var lane = getLane();
      renderTabs(lane);
      applyLane(lane);
      setHint("");

      bindOnce(tabs, "Tabs", "click", function(e) {
        var t = e && e.target ? e.target : null;
        var btn = t && t.closest ? t.closest("[data-lane]") : null;
        if (!btn) return;
        var next = btn.getAttribute("data-lane");

        var meta = getLaneMeta(next);
        var status = meta && meta.status ? String(meta.status) : "";
        var purpose = meta && meta.sub ? String(meta.sub) : "";
        var label = meta && meta.en ? String(meta.en) : (next || "");

        // For comingSoon lanes: show feedback, but do NOT persist an active mode.
        if (next && status && status !== "live") {
          showToast(btn.getAttribute("data-toast") || "Coming soon", 1600);
          setHint(label + " — " + (purpose || "Coming soon") + " (coming soon)");

          try {
            btn.classList.add("is-preview");
            setTimeout(function() {
              try { btn.classList.remove("is-preview"); } catch (e2) {}
            }, 320);
          } catch (ePreview) {
            // no-op
          }
          return;
        }

        // Toggle-off behavior: clicking active tab returns to clean Home state
        if (next && next === getLane()) next = "";

        applyLane(next);
        if (next) setHint(label + " — " + (purpose || ""));
        else setHint("");
      });

      // Keyboard: Enter/Space activates, arrows move focus.
      bindOnce(tabs, "Keys", "keydown", function(e) {
        var key = e && e.key ? e.key : "";
        var active = document.activeElement;
        var btn = active && active.closest ? active.closest("[data-lane]") : null;
        if (!btn) return;

        if (key === "Enter" || key === " ") {
          e.preventDefault();
          btn.click();
          return;
        }

        if (key !== "ArrowLeft" && key !== "ArrowRight") return;
        e.preventDefault();

        var btns = tabs.querySelectorAll("[data-lane]");
        if (!btns || !btns.length) return;
        var idx = -1;
        for (var i = 0; i < btns.length; i++) {
          if (btns[i] === btn) { idx = i; break; }
        }
        if (idx < 0) return;
        var nextIdx = (key === "ArrowRight") ? (idx + 1) : (idx - 1);
        if (nextIdx < 0) nextIdx = btns.length - 1;
        if (nextIdx >= btns.length) nextIdx = 0;
        try { btns[nextIdx].focus(); } catch (eFocus) {}
      });
    },

    refresh: function() {
      var tabs = $("#homeLaneTabs");
      if (!tabs) return;

      var lane = getLane();
      renderTabs(lane);
      applyLane(lane);
    }
  };
})();

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  UI.init();
  UI.updateHeader();
  UI.syncPunjabiToggleUI();
});
