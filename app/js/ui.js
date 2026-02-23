// =====================================
// UI Module - Screen Navigation & Modals
// =====================================

// =====================================
// Section Mapping (Phase 1/2)
// =====================================

var SECTION_LABELS = window.SECTION_LABELS || {
  learn: "Learn",
  read: "Read",
  play: "Play",
  type: "Type",
  home: "Home"
};

var SCREEN_TO_SECTION = window.SCREEN_TO_SECTION || {
  "screen-home": "home",
  "screen-learn": "learn",
  "screen-lesson": "learn",
  "screen-reading": "read",
  "screen-reading-detail": "read",
  "screen-play-home": "play",
  "screen-play": "play",
  "screen-typing-center": "type",
  "screen-practice": "type",
  "screen-typing-race": "type"
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
    sectionTransitions: true,
    typingEnabled: false
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

  isTypingScreen: function(screenId) {
    return screenId === "screen-typing-center" || screenId === "screen-typing-race" || screenId === "screen-practice";
  },

  isTypingEnabled: function() {
    return !!(UI.flags && UI.flags.typingEnabled === true);
  },

  wireHeaderSectionTabs: function() {
    var tabs = document.querySelectorAll(".header-section-tab[data-target-screen]");
    if (!tabs || !tabs.length) return;

    for (var i = 0; i < tabs.length; i += 1) {
      var tab = tabs[i];
      if (!tab || tab.dataset.headerTabBound === "1") continue;
      tab.dataset.headerTabBound = "1";

      tab.addEventListener("click", function(evt) {
        var btn = evt.currentTarget;
        if (!btn) return;
        if (btn.getAttribute("aria-disabled") === "true" || btn.classList.contains("is-disabled")) {
          try { if (evt && evt.preventDefault) evt.preventDefault(); } catch (e0) {}
          return;
        }
        var targetScreen = btn.getAttribute("data-target-screen");
        if (!targetScreen) return;
        UI.goTo(targetScreen);
      });
    }
  },

  updateHeaderSectionTabs: function(screenId) {
    var sid = screenId;
    if (!sid) {
      try {
        var active = document.querySelector("section.screen.active");
        sid = active && active.id ? active.id : null;
      } catch (e0) {
        sid = null;
      }
    }

    var sectionKey = UI.getSectionKeyForScreen(sid) || "home";
    var tabsHost = document.getElementById("header-section-tabs");
    if (tabsHost) {
      tabsHost.setAttribute("data-active-section", sectionKey);
    }

    var tabs = document.querySelectorAll(".header-section-tab[data-header-section]");
    if (!tabs || !tabs.length) return;

    for (var i = 0; i < tabs.length; i += 1) {
      var tab = tabs[i];
      var tabSection = tab.getAttribute("data-header-section") || "";
      var isTypeTab = tabSection === "type";
      var isPlayTab = tabSection === "play";
      var isDisabled = isPlayTab || (isTypeTab && !UI.isTypingEnabled());
      var isActive = tabSection === sectionKey;

      if (isDisabled) {
        isActive = false;
        tab.setAttribute("aria-disabled", "true");
        tab.classList.add("is-disabled");
      } else {
        tab.removeAttribute("aria-disabled");
        tab.classList.remove("is-disabled");
      }

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
      if (isActive) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    }
  },

  getHeaderHelperTextForScreen: function(screenId) {
    switch (screenId) {
      case "screen-home": return "Home › Pick module";
      case "screen-learn": return "Home › Learn";
      case "screen-lesson": return "Learn › Lesson";
      case "screen-reading": return "Home › Read";
      case "screen-reading-detail": return "Home › Story";
      case "screen-play-home": return "Home › Pick module";
      case "screen-play": return "Home › Pick module";
      case "screen-typing-center": return "Home › Type";
      case "screen-practice": return "Type › Practice";
      case "screen-typing-race": {
        try {
          if (window.TypingPremium && typeof window.TypingPremium.getHeaderHelperText === "function") {
            var helper = String(window.TypingPremium.getHeaderHelperText() || "").trim();
            if (helper) return helper;
          }
        } catch (e0) {}
        return "Type › Race";
      }
      default: return "Home › BOLO";
    }
  },

  updateHeaderBackChevron: function(screenId) {
    var chevron = document.getElementById("header-back-chevron");
    if (!chevron) return;
    chevron.removeAttribute("hidden");

    var targetScreen = null;
    if (screenId === "screen-learn") targetScreen = "screen-home";
    else if (screenId === "screen-typing-center") targetScreen = "screen-home";
    else if (screenId === "screen-lesson") targetScreen = "screen-learn";
    else if (screenId === "screen-play-home") targetScreen = "screen-home";
    else if (screenId === "screen-play") targetScreen = "screen-play-home";
    else if (screenId === "screen-reading") targetScreen = "screen-home";
    else if (screenId === "screen-reading-detail") targetScreen = "screen-reading";

    if (!targetScreen) {
      chevron.classList.add("is-hidden");
      chevron.setAttribute("aria-hidden", "true");
      chevron.removeAttribute("data-target-screen");
      return;
    }

    chevron.classList.remove("is-hidden");
    chevron.setAttribute("aria-hidden", "false");
    chevron.setAttribute("data-target-screen", targetScreen);
  },

  updateHeaderHelper: function(screenId) {
    var sid = screenId;
    if (!sid) {
      try {
        var active = document.querySelector("section.screen.active");
        sid = active && active.id ? active.id : null;
      } catch (e0) {
        sid = null;
      }
    }

    var sectionKey = UI.getSectionKeyForScreen(sid) || "home";

    UI.updateHeaderSectionTabs(sid);
    UI.updateHeaderBackChevron(sid);
  },

  // Major sections only (entry overlay)
  isMajorSection: function(sectionKey) {
    return sectionKey === "learn" || sectionKey === "read" || sectionKey === "type";
  },

  // Gate section transitions (Phase 2)
  //
  // Transitions are entry-only and section-based.
  // Do NOT add per-module transitions in Lessons/Reading/Games.
  // Trigger rules:
  // - Only when entering a NEW major section (learn/read/play/type)
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
  // - Any section -> Play: overlay only when entering Play
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

  // =============================
  // Lightweight i18n (Punjabi mode)
  // =============================

  applyI18n: function(root) {
    var r = root || document;
    var preferPa = false;
    try { preferPa = (typeof uiIsPunjabiOn === "function") ? !!uiIsPunjabiOn() : false; } catch (e0) { preferPa = false; }

    function pick(en, pa) {
      if (preferPa) return (pa || en || "");
      return (en || pa || "");
    }

    try {
      var nodes = r.querySelectorAll("[data-i18n-en],[data-i18n-pa]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var en = el.getAttribute("data-i18n-en") || "";
        var pa = el.getAttribute("data-i18n-pa") || "";
        el.textContent = pick(en, pa);
      }
    } catch (e1) {}

    try {
      var nodes2 = r.querySelectorAll("[data-i18n-placeholder-en],[data-i18n-placeholder-pa]");
      for (var j = 0; j < nodes2.length; j++) {
        var el2 = nodes2[j];
        var en2 = el2.getAttribute("data-i18n-placeholder-en") || "";
        var pa2 = el2.getAttribute("data-i18n-placeholder-pa") || "";
        el2.setAttribute("placeholder", pick(en2, pa2));
      }
    } catch (e2) {}

    try {
      var nodes3 = r.querySelectorAll("[data-i18n-aria-label-en],[data-i18n-aria-label-pa]");
      for (var k = 0; k < nodes3.length; k++) {
        var el3 = nodes3[k];
        var en3 = el3.getAttribute("data-i18n-aria-label-en") || "";
        var pa3 = el3.getAttribute("data-i18n-aria-label-pa") || "";
        el3.setAttribute("aria-label", pick(en3, pa3));
      }
    } catch (e3) {}
  },

  // =============================
  // Home: onboarding hint (dismissible)
  // =============================

  wireOnboardingHint: function() {
    var btn = document.getElementById("btn-onboarding-dismiss");
    if (!btn) return;
    UI.bindOnce(btn, "onboardingDismissBound", "click", function(e) {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      try {
        if (typeof State !== "undefined" && State && typeof State.ensureTracksInitialized === "function") {
          State.ensureTracksInitialized();
        }
        if (State && State.state && State.state.settings) {
          State.state.settings.onboardingHintDismissed = true;
          try { if (typeof State.save === "function") State.save(); } catch (e2) {}
        }
      } catch (e0) {}

      var wrap = document.getElementById("onboarding-hint");
      if (wrap) wrap.style.display = "none";
    });
  },

  renderOnboardingHint: function() {
    var wrap = document.getElementById("onboarding-hint");
    if (!wrap) return;

    var dismissed = false;
    try {
      if (typeof State !== "undefined" && State && typeof State.ensureTracksInitialized === "function") {
        State.ensureTracksInitialized();
      }
      dismissed = !!(State && State.state && State.state.settings && State.state.settings.onboardingHintDismissed);
    } catch (e0) { dismissed = false; }

    wrap.style.display = dismissed ? "none" : "block";
  },

  initStatusShelfMotion: function() {
    if (UI._statusShelfMotionInitialized) return;
    UI._statusShelfMotionInitialized = true;

    var shelf = document.querySelector(".status-shelf");
    if (!shelf) return;

    var storageKey = "bolo_status_shelf_intro_v1";
    var shouldIntro = true;
    try {
      shouldIntro = sessionStorage.getItem(storageKey) !== "1";
    } catch (e0) {
      shouldIntro = true;
    }
    if (!shouldIntro) return;

    shelf.classList.remove("is-intro");
    try { void shelf.offsetWidth; } catch (e1) {}
    shelf.classList.add("is-intro");
    setTimeout(function() {
      shelf.classList.remove("is-intro");
    }, 340);

    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (e2) {}
  },

  // Initialize UI - wire up event listeners
  init: function() {
    UI.ensureViewportVarsBound();
    UI.wireModalCloseButtons();
    UI.wireFooterToggles();
    UI.wireInkRipples();
    UI.wireHeaderSectionTabs();

    // Initialize current section tracking from the DOM (no routing side-effects)
    try {
      var active = document.querySelector("section.screen.active");
      var sid = active && active.id ? active.id : null;
      UI.state.currentSectionKey = UI.getSectionKeyForScreen(sid) || "home";
    } catch (e) {
      UI.state.currentSectionKey = UI.state.currentSectionKey || "home";
    }

    // Ensure Punjabi-mode UI text + onboarding hint are painted on boot
    try { UI.refreshGlobalToggles(); } catch (e2) {}
    try { UI.initStatusShelfMotion(); } catch (e3) {}

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
        } else {
          root.style.setProperty("--footer-h", "0px");
        }
      } else {
        root.style.setProperty("--footer-h", "0px");
      }

      var statusShelf = document.querySelector(".status-shelf");
      if (statusShelf && statusShelf.getBoundingClientRect) {
        var shelfH = statusShelf.getBoundingClientRect().height;
        if (typeof shelfH === "number" && isFinite(shelfH) && shelfH > 0) {
          root.style.setProperty("--status-shelf-h", Math.round(shelfH) + "px");
        }
      }

      var appHeader = document.querySelector(".app-header");
      if (appHeader && appHeader.getBoundingClientRect) {
        var headerH = appHeader.getBoundingClientRect().height;
        if (typeof headerH === "number" && isFinite(headerH) && headerH > 0) {
          root.style.setProperty("--header-h", Math.round(headerH) + "px");
        }
      }

      var appShell = document.querySelector(".app-container");
      if (appShell && appShell.getBoundingClientRect) {
        var shellRect = appShell.getBoundingClientRect();
        var shellW = shellRect && typeof shellRect.width === "number" ? shellRect.width : 0;
        if (isFinite(shellW) && shellW > 0) {
          var shellCenterX = shellRect.left + (shellW / 2);
          if (isFinite(shellCenterX)) {
            root.style.setProperty("--app-center-x", Math.round(shellCenterX) + "px");
          }

          var style = window.getComputedStyle ? window.getComputedStyle(appShell) : null;
          var padLeft = style ? parseFloat(style.paddingLeft || "0") : 0;
          var padRight = style ? parseFloat(style.paddingRight || "0") : 0;
          if (!isFinite(padLeft)) padLeft = 0;
          if (!isFinite(padRight)) padRight = 0;
          var innerW = Math.max(0, shellW - padLeft - padRight);
          if (isFinite(innerW) && innerW > 0) {
            root.style.setProperty("--app-shell-inner-width", Math.round(innerW) + "px");
          }
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

    if (screenId === "screen-play-home" || screenId === "screen-play") {
      screenId = "screen-home";
    }

    if (!UI.isTypingEnabled() && UI.isTypingScreen(screenId)) {
      screenId = "screen-home";
    }

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

      // Defensive cleanup for stale scroll-lock state before navigation
      try {
        document.documentElement.classList.remove("typing-scroll-lock");
        document.body.classList.remove("typing-scroll-lock");

        var activeModal = document.querySelector(".modal-backdrop.active");
        if (UI._bodyScrollLocked && !activeModal && typeof UI.unlockBodyScroll === "function") {
          UI.unlockBodyScroll();
        }

        if (!activeModal && document.body.classList.contains("modal-open")) {
          document.body.classList.remove("modal-open");
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.left = "";
          document.body.style.right = "";
          document.body.style.width = "";
        }
      } catch (eCleanup) {
        // no-op
      }

      // Allow screens to clean up before switching
      UI._runScreenHook(prevScreenId, "unmount");

      // Make target screen visible (but don't hide others yet)
      // This is critical: we must make the new screen visible BEFORE moving focus
      // to avoid any timing gap where a focused element could be inside an aria-hidden ancestor.
      UI.makeScreenVisible(targetScreen);

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

      // CRITICAL: Move focus into the destination screen BEFORE hiding the previous screen.
      // This is the key to WCAG 2.1 compliance (Section 2.4.3 Focus Order).
      // If we hide the old screen (aria-hidden=true) before moving focus, the browser will
      // emit a warning that the focused element is hidden from assistive technology.
      UI.focusFirst(targetScreen);

      // NOW safe to hide all other screens from interaction/assistive tech
      UI.hideOtherScreens(targetScreen);

      try { UI.syncViewportVars(); } catch (eSyncNow) {}
      try {
        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(function() {
            try { UI.syncViewportVars(); } catch (eSyncRaf) {}
          });
        }
      } catch (eSyncRafOuter) {}
      try {
        setTimeout(function() {
          try { UI.syncViewportVars(); } catch (eSyncLater) {}
        }, 40);
      } catch (eSyncLaterOuter) {}

      // Update section tracking after successful navigation
      if (nextSection) {
        UI.state.currentSectionKey = nextSection;
      }

      try { UI.updateHeaderHelper(screenId); } catch (e7) {}
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

    // Footer: badges (safe if controls missing)
    try { UI.syncFooterBadges(); } catch (e) {}

    // Reading: paint vocab toggle + collapse state (safe if controls missing)
    try {
        if (typeof Reading !== "undefined" && Reading) {
          if (typeof Reading.syncVocabToggleUI === "function") Reading.syncVocabToggleUI();
          Reading.syncVocabCollapseUI(); // Ensure UI refresh loads persisted Reading vocab collapse state
      }
    } catch (e) {}

    // Apply Punjabi-mode-aware text swaps (safe if no marked nodes)
    try { UI.applyI18n(document); } catch (e) {}

    // Home onboarding hint (safe if not present)
    try { UI.renderOnboardingHint(); } catch (e) {}
    try { UI.wireOnboardingHint(); } catch (e) {}

    try { UI.updateHeaderHelper(); } catch (e6) {}

  },

  // Footer badges (currently unused when no badge element is present)
  syncFooterBadges: function() {
    return;
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
      "screen-typing-center": {
        mount: function() {
          try {
            if (window.TypingPremium && typeof window.TypingPremium.init === "function") {
              window.TypingPremium.init();
            }
          } catch (e) {
            // no-op
          }
        }
      },
      "screen-typing-race": {
        mount: function() {
          try {
            if (window.TypingPremium && typeof window.TypingPremium.init === "function") {
              window.TypingPremium.init();
            }
          } catch (e) {
            // no-op
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

  // Make a target screen visible to users and assistive technology.
  // Does NOT hide other screens (see hideOtherScreens for that).
  // This is called BEFORE moving focus to ensure the screen is not hidden when focus arrives.
  makeScreenVisible: function(targetScreen) {
    if (!targetScreen) return;
    targetScreen.classList.add("active");
    targetScreen.setAttribute("aria-hidden", "false");
    targetScreen.removeAttribute("hidden");
    if ("inert" in targetScreen) {
      targetScreen.inert = false;
    }
  },

  // Hide all screens EXCEPT the target from interaction and assistive technology.
  // This is called AFTER focus has been moved to ensure no focused element is hidden.
  // Critical for WCAG 2.1 Section 2.4.3 (Focus Order) compliance.
  hideOtherScreens: function(targetScreen) {
    var screens = document.querySelectorAll("section.screen");
    screens.forEach(function(screen) {
      if (screen === targetScreen) {
        return; // Skip target screen
      }
      
      // Hide non-target screens from assistive tech and user interaction
      screen.classList.remove("active");
      screen.setAttribute("aria-hidden", "true");
      screen.setAttribute("hidden", "");
      if ("inert" in screen) {
        screen.inert = true;
      }
    });
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

    if (modalId === "modal-profiles") {
      try { UI.renderProfilesModal(); } catch (e0) {}
    }

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
    // Switch profile link
    var statusSwitchProfile = document.getElementById("status-switch-profile");
    if (statusSwitchProfile) {
      UI.bindOnce(statusSwitchProfile, "linkSwitchBound", "click", function(e) {
        e.preventDefault();
        UI.openProfilesModal();
      });
    }

  },

  openProfilesModal: function() {
    UI.openModal("modal-profiles");
  },

  renderProfilesModal: function() {
    var host = document.getElementById("profiles-list");
    if (!host) return;

    var profiles = [];
    try {
      profiles = (State && typeof State.getProfiles === "function")
        ? State.getProfiles()
        : ((State && State.state && State.state.profile && State.state.profile.profiles) || []);
    } catch (e0) {
      profiles = [];
    }

    var active = null;
    try {
      active = (State && typeof State.getActiveProfile === "function") ? State.getActiveProfile() : null;
    } catch (e1) {
      active = null;
    }
    var activeId = active && active.id ? String(active.id) : null;
    var preferPa = false;
    try { preferPa = (typeof uiIsPunjabiOn === "function") ? !!uiIsPunjabiOn() : false; } catch (eLang) { preferPa = false; }

    function tx(en, pa) {
      if (preferPa) return pa || en || "";
      return en || pa || "";
    }

    var editor = UI._profilesEditor || null;
    if (!editor || typeof editor !== "object") {
      editor = { mode: null, slotId: null, value: "", error: "" };
    }

    function normalizeName(raw) {
      return String(raw || "").replace(/^\s+|\s+$/g, "");
    }

    function isNicknamePatternValid(name) {
      if (!name || name.length < 2 || name.length > 24) return false;
      try {
        return /^(?=.{2,24}$)[\p{L}\p{M}\p{N} _-]+$/u.test(name);
      } catch (e0p) {
        return !/[<>`]/.test(name);
      }
    }

    function isDuplicateName(name, ignoreId) {
      var cmp = String(name || "").toLowerCase();
      for (var i = 0; i < profiles.length; i++) {
        var pr = profiles[i];
        if (!pr || !pr.id) continue;
        if (ignoreId && String(pr.id) === String(ignoreId)) continue;
        var n = String(pr.name || "").toLowerCase();
        if (n && n === cmp) return true;
      }
      return false;
    }

    function getValidationError(name, ignoreId) {
      if (!name) return tx("Enter nickname.", "ਨਿੱਕ ਨੇਮ ਲਿਖੋ।");
      if (name.length < 2 || name.length > 24) return tx("Use 2–24 characters.", "2–24 ਅੱਖਰ ਵਰਤੋ।");
      if (!isNicknamePatternValid(name)) return tx("Use letters, numbers, space, - or _.", "ਅੱਖਰ, ਅੰਕ, ਖਾਲੀ ਜਗ੍ਹਾ, - ਜਾਂ _ ਵਰਤੋ।");
      if (isDuplicateName(name, ignoreId)) return tx("Nickname already used.", "ਇਹ ਨਿੱਕ ਨੇਮ ਪਹਿਲਾਂ ਹੀ ਵਰਤਿਆ ਗਿਆ ਹੈ।");
      return "";
    }

    function setEditor(next) {
      UI._profilesEditor = next;
      UI.renderProfilesModal();
    }

    function clearEditor() {
      UI._profilesEditor = { mode: null, slotId: null, value: "", error: "" };
    }

    var nowTs = Date.now();
    var switchConfirm = UI._profileSwitchConfirm || { id: null, expiresAt: 0 };
    if (!switchConfirm.expiresAt || switchConfirm.expiresAt <= nowTs) {
      switchConfirm = { id: null, expiresAt: 0 };
      UI._profileSwitchConfirm = switchConfirm;
    }

    function isSwitchArmed(profileId) {
      var token = String(profileId || "");
      return !!(switchConfirm.id && switchConfirm.id === token && switchConfirm.expiresAt > Date.now());
    }

    function armSwitch(profileId, profileName) {
      UI._profileSwitchConfirm = {
        id: String(profileId || ""),
        expiresAt: Date.now() + 4000
      };
      var msg = preferPa
        ? ((profileName || "ਇਸ ਪ੍ਰੋਫ਼ਾਈਲ") + " 'ਤੇ ਸਵਿੱਚ ਕਰਨ ਲਈ ਦੁਬਾਰਾ ਟੈਪ ਕਰੋ।")
        : ("Tap again to switch to " + (profileName || "this profile") + ".");
      try { UI.showToast(msg, 2400); } catch (eArm) {}
    }

    function clearSwitchConfirm() {
      UI._profileSwitchConfirm = { id: null, expiresAt: 0 };
    }

    host.innerHTML = "";
    host.className = "profiles-list";

    var intro = document.createElement("div");
    intro.className = "profiles-intro";
    intro.innerHTML = ""
      + '<p class="profiles-intro-en">Up to 3 profiles per device.</p>'
      + '<p class="profiles-intro-pa" lang="pa">ਹਰ ਜੰਤਰ \u0027ਤੇ ਵੱਧ ਤੋਂ ਵੱਧ 3 ਪ੍ਰੋਫ਼ਾਈਲ।</p>';
    host.appendChild(intro);

    var profileById = {};
    for (var pi = 0; pi < profiles.length; pi++) {
      var pp = profiles[pi];
      if (pp && pp.id) profileById[String(pp.id)] = pp;
    }

    for (var slot = 0; slot < 3; slot++) {
      var slotId = "p" + (slot + 1);
      var p = profileById[slotId] || null;
      var isActive = p && p.id && String(p.id) === activeId;
      var isEditing = editor && editor.slotId === slotId;
      var mode = isEditing ? editor.mode : null;

      var row = document.createElement("div");
      row.className = "profile-row";
      if (isActive) row.className += " is-current";

      var left = document.createElement("div");
      left.className = "profile-main";

      var label = document.createElement("div");
      label.className = "profile-label";
      label.textContent = tx("Account ", "ਅਕਾਊਂਟ ") + (slot + 1);
      left.appendChild(label);

      var titleWrap = document.createElement("div");
      titleWrap.className = "profile-title-wrap";

      var nameLine = document.createElement("div");
      nameLine.className = "profile-name";

      var meta = document.createElement("div");
      meta.className = "profile-meta";

      if (p && p.id) {
        var nm = document.createElement("span");
        nm.textContent = p.name || ("Player " + (slot + 1));
        nameLine.appendChild(nm);

        if (isActive) {
          var chip = document.createElement("span");
          chip.className = "profile-status-chip";
          chip.textContent = tx("Current", "ਮੌਜੂਦਾ");
          chip.setAttribute("aria-current", "true");
          nameLine.appendChild(chip);
        }

        meta.textContent = tx("Profile active on this device", "ਇਹ ਪ੍ਰੋਫ਼ਾਈਲ ਇਸ ਜੰਤਰ 'ਤੇ ਸਰਗਰਮ ਹੈ");

      } else {
        nameLine.textContent = tx("Not created yet", "ਹਾਲੇ ਬਣਾਇਆ ਨਹੀਂ ਗਿਆ");
        meta.textContent = tx("Add a nickname to create this profile.", "ਇਹ ਪ੍ਰੋਫ਼ਾਈਲ ਬਣਾਉਣ ਲਈ ਨਿੱਕ ਨੇਮ ਜੋੜੋ।");
      }

      titleWrap.appendChild(nameLine);
      titleWrap.appendChild(meta);
      left.appendChild(titleWrap);
      row.appendChild(left);

      var actions = document.createElement("div");
      actions.className = "profile-actions";

      var actionRow = document.createElement("div");
      actionRow.className = "profile-action-row";
      actions.appendChild(actionRow);

      if (p && p.id) {
        if (!isActive) {
          var switchBtn = document.createElement("button");
          switchBtn.type = "button";
          switchBtn.className = "btn profile-btn-primary";
          switchBtn.textContent = isSwitchArmed(p.id) ? tx("Confirm switch", "ਸਵਿੱਚ ਪੱਕਾ ਕਰੋ") : tx("Switch", "ਸਵਿੱਚ");
          switchBtn.addEventListener("click", (function(profile) {
            return function() {
              if (!isSwitchArmed(profile.id)) {
                armSwitch(profile.id, profile.name);
                UI.renderProfilesModal();
                return;
              }

              var changed = false;
              try {
                changed = !!(State && typeof State.setActiveProfile === "function" && State.setActiveProfile(profile.id));
              } catch (e3) {
                changed = false;
              }
              if (!changed) {
                try { UI.showToast(tx("Could not switch profile.", "ਪ੍ਰੋਫ਼ਾਈਲ ਸਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕੀ।"), 2200); } catch (eFail) {}
                return;
              }

              clearSwitchConfirm();
              clearEditor();
              try { UI.updateHeader(); } catch (e4) {}
              try { UI.refreshGlobalToggles(); } catch (e5) {}
              UI.closeModal("modal-profiles");
              UI.goTo("screen-home");
            };
          })(p));
          actionRow.appendChild(switchBtn);
        }

        var renameToggle = document.createElement("button");
        renameToggle.type = "button";
        renameToggle.className = "btn profile-btn-secondary";
        renameToggle.textContent = (mode === "rename") ? tx("Cancel", "ਰੱਦ ਕਰੋ") : tx("Rename", "ਨਾਮ ਬਦਲੋ");
        renameToggle.addEventListener("click", (function(profile, slotToken) {
          return function() {
            if (editor.slotId === slotToken && editor.mode === "rename") {
              clearEditor();
              UI.renderProfilesModal();
              return;
            }
            setEditor({ mode: "rename", slotId: slotToken, value: String(profile.name || ""), error: "" });
          };
        })(p, slotId));
        actionRow.appendChild(renameToggle);

      } else {
        var addToggle = document.createElement("button");
        addToggle.type = "button";
        addToggle.className = "btn profile-btn-primary";
        addToggle.textContent = (mode === "create") ? tx("Cancel", "ਰੱਦ ਕਰੋ") : tx("Add profile", "ਪ੍ਰੋਫ਼ਾਈਲ ਜੋੜੋ");
        addToggle.addEventListener("click", (function(slotToken) {
          return function() {
            if (editor.slotId === slotToken && editor.mode === "create") {
              clearEditor();
              UI.renderProfilesModal();
              return;
            }
            setEditor({ mode: "create", slotId: slotToken, value: "", error: "" });
          };
        })(slotId));
        actionRow.appendChild(addToggle);
      }

      if (isEditing && mode) {
        var editorWrap = document.createElement("div");
        editorWrap.className = "profile-editor";

        var input = document.createElement("input");
        input.type = "text";
        input.className = "profile-editor-input";
        input.placeholder = tx("Enter nickname", "ਨਿੱਕ ਨੇਮ ਲਿਖੋ");
        input.maxLength = 24;
        input.value = editor.value || "";
        input.setAttribute("aria-label", (mode === "rename" ? tx("Rename", "ਨਾਮ ਬਦਲੋ") : tx("Create", "ਬਣਾਓ")) + " " + tx("account", "ਅਕਾਊਂਟ") + " " + (slot + 1));

        var helper = document.createElement("div");
        helper.className = "profile-editor-helper";
        helper.innerHTML = '<span class="helper-en">Use nicknames only (2–24 chars).</span><span class="helper-pa" lang="pa">ਸਿਰਫ਼ ਨਿੱਕ ਨੇਮ ਵਰਤੋ (2–24 ਅੱਖਰ)।</span>';

        var errorEl = document.createElement("div");
        errorEl.className = "profile-editor-error";

        var submit = document.createElement("button");
        submit.type = "button";
        submit.className = "btn profile-btn-primary";
        submit.textContent = mode === "rename" ? tx("Save", "ਸੇਵ ਕਰੋ") : tx("Create", "ਬਣਾਓ");

        function computeError(v) {
          return getValidationError(normalizeName(v), p && p.id ? String(p.id) : null);
        }

        function refreshFieldState(rawVal) {
          var nextVal = String(rawVal || "");
          var err = computeError(nextVal);
          input.value = nextVal;
          submit.disabled = !!err;
          if (err || editor.error) {
            errorEl.textContent = editor.error || err;
            errorEl.style.display = "block";
          } else {
            errorEl.textContent = "";
            errorEl.style.display = "none";
          }
        }

        input.addEventListener("input", function() {
          editor.value = input.value;
          editor.error = "";
          refreshFieldState(input.value);
        });

        submit.addEventListener("click", function() {
          var trimmed = normalizeName(input.value);
          var validationError = computeError(trimmed);
          if (validationError) {
            editor.error = validationError;
            refreshFieldState(input.value);
            return;
          }

          var okAction = false;
          try {
            if (mode === "rename" && p && p.id && State && typeof State.renameProfile === "function") {
              okAction = !!State.renameProfile(p.id, trimmed);
            } else if (mode === "create" && State && typeof State.addProfileAtSlot === "function") {
              okAction = !!State.addProfileAtSlot(slot + 1, trimmed);
            }
          } catch (e6) {
            okAction = false;
          }

          if (!okAction) {
            editor.error = (mode === "rename")
              ? tx("Could not rename profile.", "ਪ੍ਰੋਫ਼ਾਈਲ ਦਾ ਨਾਮ ਨਹੀਂ ਬਦਲਿਆ ਜਾ ਸਕਿਆ।")
              : tx("Could not create profile.", "ਪ੍ਰੋਫ਼ਾਈਲ ਨਹੀਂ ਬਣ ਸਕੀ।");
            refreshFieldState(input.value);
            return;
          }

          clearEditor();
          try { UI.updateHeader(); } catch (e7r) {}
          try { UI.refreshGlobalToggles(); } catch (e8r) {}
          UI.renderProfilesModal();
        });

        input.addEventListener("keydown", function(evt) {
          if (!evt) return;
          if (evt.key === "Enter") {
            evt.preventDefault();
            if (!submit.disabled) submit.click();
          }
          if (evt.key === "Escape") {
            evt.preventDefault();
            clearEditor();
            UI.renderProfilesModal();
          }
        });

        editorWrap.appendChild(input);
        editorWrap.appendChild(helper);
        editorWrap.appendChild(errorEl);
        editorWrap.appendChild(submit);
        actions.appendChild(editorWrap);

        refreshFieldState(input.value);
        setTimeout(function() {
          try { input.focus(); } catch (e9) {}
        }, 0);
      }

      row.appendChild(actions);

      host.appendChild(row);
    }
  },

  // Update header with profile info
  updateHeader: function() {
    var profile = State.getActiveProfile();
    if (!profile) return;

    var profileId = (profile && profile.id) ? String(profile.id) : "";
    var identityEl = document.querySelector(".status-shelf__identity");
    var prevShelfState = UI._statusShelfPrev || null;
    var isFirstRender = !prevShelfState;

    function replayStatusClass(el, cls, durationMs) {
      if (!el || !cls) return;
      el.classList.remove(cls);
      try { void el.offsetWidth; } catch (e0) {}
      el.classList.add(cls);
      setTimeout(function() {
        el.classList.remove(cls);
      }, Math.max(200, durationMs || 260));
    }
    
    // Update profile name in header
    var headerProfileName = document.getElementById("header-profile-name");
    if (headerProfileName) {
      headerProfileName.textContent = profile.name;
    }

    var statusAvatarInitial = document.getElementById("status-avatar-initial");
    if (statusAvatarInitial) {
      var safeName = String(profile.name || "").trim();
      var first = safeName ? safeName.charAt(0).toUpperCase() : "P";
      statusAvatarInitial.textContent = first;
    }
    
    if (!isFirstRender && prevShelfState) {
      if (identityEl && prevShelfState.profileId && profileId && profileId !== prevShelfState.profileId) {
        replayStatusClass(identityEl, "is-profile-swap", 240);
      }
    }

    UI._statusShelfPrev = {
      profileId: profileId
    };

    UI.updateHeaderHelper();
    try { UI.syncViewportVars(); } catch (eSyncHeader) {}
  },

  renderStreakSection: function() {
    return;
  },

  showToast: function(message, durationMs) {
    var host = document.getElementById("toastHost");
    if (!host) return;
    var msg = (message == null) ? "" : String(message);
    if (!msg) return;
    host.textContent = msg;
    host.classList.add("is-visible");
    if (UI._toastTimer) {
      clearTimeout(UI._toastTimer);
      UI._toastTimer = null;
    }
    var ms = (typeof durationMs === "number" && isFinite(durationMs)) ? durationMs : 1600;
    UI._toastTimer = setTimeout(function() {
      host.classList.remove("is-visible");
      UI._toastTimer = null;
    }, Math.max(250, ms));
  }
};

// Initialize UI when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  UI.init();
  UI.updateHeader();
});
