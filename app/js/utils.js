// =====================================
// Utility Functions
// =====================================

// -----------------------------------------------------
// Lightweight bilingual UI string helper
// - Accepts either a string OR { en: "...", pa: "..." }
// - Defaults to English unless Punjabi mode is enabled
// -----------------------------------------------------

if (typeof uiIsPunjabiOn !== "function") {
  function uiIsPunjabiOn() {
    try {
      if (typeof State !== "undefined" && State) {
        if (typeof State.getPunjabiEnabled === "function") return !!State.getPunjabiEnabled();
        if (State.state && State.state.settings && typeof State.state.settings.punjabiOn === "boolean") {
          return !!State.state.settings.punjabiOn;
        }
      }
    } catch (e) {}
    return false;
  }
}

if (typeof uiText !== "function") {
  function uiText(value, opts) {
    var o = opts || {};
    var preferPa = (o && o.lang === "pa") || (o && o.autoPunjabi === true && uiIsPunjabiOn());

    if (value && typeof value === "object") {
      var en = (typeof value.en === "string") ? value.en : "";
      var pa = (typeof value.pa === "string") ? value.pa : "";
      if (preferPa) return String(pa || en || "");
      return String(en || pa || "");
    }
    return (value == null) ? "" : String(value);
  }
}

// -----------------------------------------------------
// Shared labels/helpers used by Games 2/3 and DQ
// -----------------------------------------------------

// Parts of speech labels (EN)
if (typeof PARTS_OF_SPEECH_LABELS === "undefined") {
  var PARTS_OF_SPEECH_LABELS = {
    noun: "Noun",
    verb: "Verb",
    adjective: "Adjective",
    adverb: "Adverb",
    pronoun: "Pronoun",
    preposition: "Preposition",
    conjunction: "Conjunction",
    article: "Article",
    interjection: "Interjection"
  };
}

// Parts of speech labels (PA) — additive; safe fallback if Punjabi text is missing.
if (typeof PARTS_OF_SPEECH_LABELS_PA === "undefined") {
  var PARTS_OF_SPEECH_LABELS_PA = {
    noun: "ਨਾਂ",
    verb: "ਕਿਰਿਆ",
    adjective: "ਵਿਸ਼ੇਸ਼ਣ",
    adverb: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ",
    pronoun: "ਸਰਵਨਾਮ",
    preposition: "ਪੂਰਵ-ਬੋਧਕ",
    conjunction: "ਸੰਯੋਜਕ",
    article: "ਲੇਖ",
    interjection: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ"
  };
}

// Tense labels (EN)
if (typeof TENSE_LABELS === "undefined") {
  var TENSE_LABELS = {
    present: "Present",
    past: "Past",
    future: "Future"
  };
}

// Tense labels (PA)
if (typeof TENSE_LABELS_PA === "undefined") {
  var TENSE_LABELS_PA = {
    present: "ਵਰਤਮਾਨ",
    past: "ਭੂਤਕਾਲ",
    future: "ਭਵਿੱਖ"
  };
}

// Label helpers used by app/data/games.js and app/js/games.js
if (typeof getPosLabel !== "function") {
  function getPosLabel(partId, opts) {
    var id = String(partId || "");
    var o = opts || {};
    var en = (PARTS_OF_SPEECH_LABELS && PARTS_OF_SPEECH_LABELS[id]) ? PARTS_OF_SPEECH_LABELS[id] : id;
    var pa = (PARTS_OF_SPEECH_LABELS_PA && PARTS_OF_SPEECH_LABELS_PA[id]) ? PARTS_OF_SPEECH_LABELS_PA[id] : "";
    if (o && o.bilingual) return pa ? (en + " / " + pa) : en;
    if (o && o.lang === "pa") return pa || "";
    return en;
  }
}

if (typeof getTenseLabel !== "function") {
  function getTenseLabel(tenseId, opts) {
    var id = String(tenseId || "");
    var o = opts || {};
    var en = (TENSE_LABELS && TENSE_LABELS[id]) ? TENSE_LABELS[id] : id;
    var pa = (TENSE_LABELS_PA && TENSE_LABELS_PA[id]) ? TENSE_LABELS_PA[id] : "";
    if (o && o.bilingual) return pa ? (en + " / " + pa) : en;
    if (o && o.lang === "pa") return pa || "";
    return en;
  }
}

// Extract a POS key from prompts like "Tap the noun"
if (typeof derivePosKeyFromTapPrompt !== "function") {
  function derivePosKeyFromTapPrompt(promptText) {
    var s = String(promptText || "").toLowerCase();
    if (!s) return null;

    // Normalize punctuation to spaces
    s = s.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();

    var keys = [
      "noun",
      "verb",
      "adjective",
      "adverb",
      "pronoun",
      "preposition",
      "conjunction",
      "article",
      "interjection"
    ];

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (s.indexOf(" " + k + " ") !== -1 || s.endsWith(" " + k) || s.startsWith(k + " ") || s === k) {
        return k;
      }
    }

    // Common variations
    if (s.indexOf("word type") !== -1) return null;
    return null;
  }
}

// Convert Date to local ISO format (YYYY-MM-DD)
function toISODateLocal(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

// Simple stable hash from string to integer
function hashStringToInt(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

if (typeof BOLO_DECK_UX === "undefined") {
  var BOLO_DECK_UX = {
    touchIntentPx: 8,
    touchIntentRatio: 1.1,
    swipeThresholdRatio: 0.18,
    swipeThresholdMinPx: 36,
    swipeSnapTransition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
    pointerSnapTransition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
    wheelResetMs: 280,
    wheelTriggerPx: 54,
    suppressClickMs: 260,
    suppressWheelClickMs: 180
  };
}

if (typeof getDeckSwipeThresholdPx !== "function") {
  function getDeckSwipeThresholdPx(viewport, opts) {
    var o = opts || {};
    var ratio = (typeof o.ratio === "number" && isFinite(o.ratio)) ? o.ratio : BOLO_DECK_UX.swipeThresholdRatio;
    var minPx = (typeof o.minPx === "number" && isFinite(o.minPx)) ? o.minPx : BOLO_DECK_UX.swipeThresholdMinPx;

    var width = 0;
    try { width = (viewport && viewport.clientWidth) ? viewport.clientWidth : 0; } catch (e0) { width = 0; }
    if (!(width > 0)) {
      try { width = (window && window.innerWidth) ? window.innerWidth : 320; } catch (e1) { width = 320; }
    }

    var px = Math.round(width * ratio);
    if (!(px > 0)) px = minPx;
    if (px < minPx) px = minPx;
    return px;
  }
}

if (typeof hasDeckHorizontalIntent !== "function") {
  function hasDeckHorizontalIntent(deltaX, deltaY, opts) {
    var o = opts || {};
    var minIntentPx = (typeof o.minIntentPx === "number" && isFinite(o.minIntentPx)) ? o.minIntentPx : BOLO_DECK_UX.touchIntentPx;
    var ratio = (typeof o.ratio === "number" && isFinite(o.ratio)) ? o.ratio : BOLO_DECK_UX.touchIntentRatio;

    var absX = Math.abs(deltaX || 0);
    var absY = Math.abs(deltaY || 0);
    return absX > minIntentPx && absX > absY * ratio;
  }
}

if (typeof nudgeCounterIndicator !== "function") {
  function nudgeCounterIndicator(host, direction, opts) {
    if (!host || !host.classList) return;
    var dir = 0;
    if (typeof direction === "number") dir = direction > 0 ? 1 : (direction < 0 ? -1 : 0);
    if (!dir) return;

    var reduceMotion = false;
    try {
      reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e0) {
      reduceMotion = false;
    }

    var cls = dir > 0 ? "indicator-shift-next" : "indicator-shift-prev";
    var durationMs = 220;

    if (opts && typeof opts.durationMs === "number" && isFinite(opts.durationMs) && opts.durationMs > 0) {
      durationMs = Math.round(opts.durationMs);
    } else {
      try {
        var computed = window.getComputedStyle ? window.getComputedStyle(host) : null;
        var raw = computed ? String(computed.getPropertyValue("--counter-shift-duration") || "").trim() : "";
        if (raw) {
          if (/ms$/i.test(raw)) {
            var parsedMs = parseFloat(raw);
            if (isFinite(parsedMs) && parsedMs > 0) durationMs = Math.round(parsedMs);
          } else if (/s$/i.test(raw)) {
            var parsedS = parseFloat(raw);
            if (isFinite(parsedS) && parsedS > 0) durationMs = Math.round(parsedS * 1000);
          }
        }
      } catch (e1) {}
    }

    try {
      if (host.__counterNudgeTimer) {
        window.clearTimeout(host.__counterNudgeTimer);
        host.__counterNudgeTimer = 0;
      }
    } catch (e2) {}

    try { host.classList.remove("indicator-shift-next", "indicator-shift-prev"); } catch (e3) {}
    if (reduceMotion) return;

    try { void host.offsetWidth; } catch (e4) {}
    try { host.classList.add(cls); } catch (e5) {}

    try {
      host.__counterNudgeTimer = window.setTimeout(function() {
        try { host.classList.remove(cls); } catch (e6) {}
        try { host.__counterNudgeTimer = 0; } catch (e7) {}
      }, durationMs);
    } catch (e8) {}
  }
}
