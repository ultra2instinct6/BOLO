/* =========================================================
   Typing Center + Typing Race (Premium)
   - Keyboard inset -> CSS var --kb-inset
   - Fullscreen toggle
   - Simple typing race engine (WPM/accuracy/progress)
   ========================================================= */

(function() {
  if (window.TypingPremium && window.TypingPremium._inited) return;

  // Optional dev helper (must be explicitly enabled)
  var DEBUG_TYPING_SELF_TEST = false;
  var DEBUG_TYPING_TIME_TRIAL = false;
  // Dev-only: logs Type & Define queue composition once per session.
  // Enable via setting window.DEBUG_TYPE_DEFINE_QUEUE = true in DevTools.
  var DEBUG_TYPE_DEFINE_QUEUE = false;

  // Typing submodules (loaded from ./js/typing/* before this file)
  var TypingPremium = window.TypingPremium || (window.TypingPremium = {});
  if (!TypingPremium.platform || typeof TypingPremium.platform !== "object") TypingPremium.platform = {};
  if (!TypingPremium.storage || typeof TypingPremium.storage !== "object") TypingPremium.storage = {};

  var _tpPlatform = TypingPremium.platform;
  var _tpStorage = TypingPremium.storage;

  // Platform hooks (fallbacks are no-ops for safety)
  var setupKeyboardInsetVar = _tpPlatform.setupKeyboardInsetVar || function() {};
  var toggleFullscreen = _tpPlatform.toggleFullscreen || function() {};

  // Shared helpers (fallbacks kept tiny to avoid hard failures)
  var clampNumber = _tpStorage.clampNumber || function(n, min, max) {
    var v = (typeof n === "number" && isFinite(n)) ? n : parseFloat(n);
    if (!isFinite(v)) v = min;
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
  };
  var countWordsInText = _tpStorage.countWordsInText || function(text) {
    if (!text) return 0;
    var s = String(text);
    s = s.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
    if (!s) return 0;
    var parts = s.split(" ");
    var n = 0;
    for (var i = 0; i < parts.length; i++) if (parts[i]) n += 1;
    return n;
  };
  var promptCleanLen = _tpStorage.promptCleanLen || function(en) {
    if (!en) return 0;
    var s = String(en);
    s = s.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
    return s.length;
  };
  var countPunctuationChars = _tpStorage.countPunctuationChars || function(en) {
    if (!en) return 0;
    var s = String(en);
    var m = s.match(/[\.,;:!?\"'\(\)\[\]\{\}\-—]/g);
    return m ? m.length : 0;
  };
  var safeJsonParse = _tpStorage.safeJsonParse || function(raw, fallback) {
    try {
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return (v == null) ? fallback : v;
    } catch (e) {
      return fallback;
    }
  };
  var formatSeconds1 = _tpStorage.formatSeconds1 || function(n) {
    var v = (typeof n === "number" && isFinite(n)) ? n : parseFloat(n);
    if (!isFinite(v) || !(v > 0)) return "";
    v = Math.round(v * 10) / 10;
    return v.toFixed(1);
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- 1-2) Platform helpers now live in ./js/typing/platform.js ----------

  // ---------- 3) Navigation glue (idiomatic for BOLO: UI.goTo) ----------
  function showScreenSafe(screenId) {
    // Navigation can invalidate countdown/modal DOM; ensure we don't leak timers/listeners.
    try { cancelCountdown(); } catch (e0) {}
    try { cleanupTypingResultModal({ restoreFocus: false }); } catch (e1) {}
    try {
      document.documentElement.classList.remove("typing-scroll-lock");
      document.body.classList.remove("typing-scroll-lock");
    } catch (e2) {}

    try {
      if (window.UI && typeof UI.goTo === "function") {
        UI.goTo(screenId);
        return;
      }
    } catch (e) {
      // no-op
    }

    // Fallback: toggle .screen.active based on id
    var target = document.getElementById(screenId);
    if (!target) return;

    var screens = document.querySelectorAll("section.screen");
    for (var i = 0; i < screens.length; i++) {
      var el = screens[i];
      var isActive = (el === target);
      el.classList.toggle("active", isActive);
      try {
        el.setAttribute("aria-hidden", isActive ? "false" : "true");
      } catch (e2) {
        // no-op
      }
    }

    try { window.scrollTo(0, 0); } catch (e3) {}
  }

  // ---------- 4) Typing Race engine ----------
  var MODE_OBJECTIVE = {
    practice: "Accuracy + spacing",
    race: "Accuracy first, then speed",
    timeTrial: "Beat the clock, stay accurate"
  };

  // Single source of truth for Typing mode titles.
  // NOTE: The screen `screen-typing-race` is reused across multiple Typing modes,
  // so we must never default its title to a specific mode like "Typing Race".
  var TYPING_MODE_META = {
    practice: { title: "Typing Practice", subtitle: "Build accuracy and confidence" },
    race: { title: "Typing Race", subtitle: "Speed typing challenge" },
    typeDefine: { title: "Type & Define", subtitle: "Type the word, choose the meaning" }
  };

  function normalizeTypingCenterMode(mode) {
    var m = String(mode || "");
    if (m === "practice" || m === "race" || m === "typeDefine") return m;
    return "practice";
  }

  function getTypingModeMeta(modeKey) {
    if (!modeKey) return null;
    return TYPING_MODE_META[String(modeKey)] || null;
  }

  var ACC_GOAL = 95;      // display goal copy
  var ACC_COACH_LOW = 92; // coaching threshold
  var ACC_RETRY_THRESHOLD = 92;

  var TIME_TRIAL_TARGET_SECONDS_DEFAULT = 30;
  var TIME_TRIAL_ACC_MIN = 95;

  // Time Trial fairness + normalization
  // - Prompts: avoid very short sentences (more comparable difficulty)
  // - Targets: computed per prompt length (words), clamped
  // - Near-pass: encourage when close
  var TIME_TRIAL_TARGET_WPM = 40;
  var TIME_TRIAL_TARGET_SECONDS_MIN = 20;
  var TIME_TRIAL_TARGET_SECONDS_MAX = 75;
  // Time Trial should feel fair: avoid trivially short prompts.
  var TIME_TRIAL_MIN_WORDS = 8;
  var TIME_TRIAL_MIN_CHARS = 60;
  var TIME_TRIAL_POOL_MIN = 8;
  // Optional gate: exclude heavy punctuation prompts from the trial-safe pool.
  // (We relax this gate if the pool gets too small.)
  var TIME_TRIAL_EXCLUDE_HEAVY_PUNCT = true;
  var TIME_TRIAL_MAX_PUNCT = 6;
  var TIME_TRIAL_MAX_PUNCT_RATIO = 0.10;
  var TIME_TRIAL_NEAR_PASS_SEC = 2.0;
  var TIME_TRIAL_NEAR_PASS_ACC_PCT = 2;

  // ---------- Typing Race: short rounds (best-of-N) ----------
  // Kept intentionally small + self-contained; only used when runState.mode === "race".
  var RACE_MATCH_MAX_ROUNDS = 3;
  var RACE_MATCH_ACC_EASY_THRESHOLD = 85;
  // Thresholds for “slightly longer/harder” prompts.
  var RACE_MATCH_WPM_MED_THRESHOLD = 35;
  var RACE_MATCH_WPM_HARD_THRESHOLD = 45;
  // Typing Race isn't tied to a content track; default to Sentence Building for stats.
  var RACE_MATCH_TRACK_ID = "T_SENTENCE";

  var raceMatch = {
    active: false,
    roundIndex: 0, // 1-based when active
    maxRounds: RACE_MATCH_MAX_ROUNDS,
    nextBand: "short",
    currentPrompt: null
  };

  function resetRaceMatch() {
    raceMatch.active = false;
    raceMatch.roundIndex = 0;
    raceMatch.maxRounds = RACE_MATCH_MAX_ROUNDS;
    raceMatch.nextBand = "short";
    raceMatch.currentPrompt = null;
  }

  function getRaceRoundLabel() {
    if (!raceMatch.active) return "";
    var i = (raceMatch.roundIndex | 0);
    var n = (raceMatch.maxRounds | 0);
    if (i < 1) i = 1;
    if (n < 1) n = RACE_MATCH_MAX_ROUNDS;
    return "Round " + String(i) + " of " + String(n);
  }

  function pickRaceRoundPrompt(band) {
    return pickSharedTypingPrompt() || { en: "", pa: "", band: "short" };
  }

  function decideNextRaceBand(accPct, wpm) {
    var acc = (typeof accPct === "number" && isFinite(accPct)) ? accPct : (parseFloat(accPct) || 0);
    var spd = (typeof wpm === "number" && isFinite(wpm)) ? wpm : (parseFloat(wpm) || 0);
    if (acc < RACE_MATCH_ACC_EASY_THRESHOLD) return "short";
    if (spd >= RACE_MATCH_WPM_HARD_THRESHOLD) return "long";
    if (spd >= RACE_MATCH_WPM_MED_THRESHOLD) return "medium";
    return "medium";
  }

  // Time Trial target persistence + shared helpers now live in ./js/typing/storage.js
  function computeTimeTrialTargetSec(en) {
    if (_tpStorage && typeof _tpStorage.computeTimeTrialTargetSec === "function") {
      return _tpStorage.computeTimeTrialTargetSec(en, {
        targetWpm: TIME_TRIAL_TARGET_WPM,
        minSec: TIME_TRIAL_TARGET_SECONDS_MIN,
        maxSec: TIME_TRIAL_TARGET_SECONDS_MAX,
        defaultSec: TIME_TRIAL_TARGET_SECONDS_DEFAULT
      });
    }
    return TIME_TRIAL_TARGET_SECONDS_DEFAULT;
  }

  function readTimeTrialTargetSec() {
    if (_tpStorage && typeof _tpStorage.readTimeTrialTargetSec === "function") {
      return _tpStorage.readTimeTrialTargetSec(TIME_TRIAL_TARGET_SECONDS_DEFAULT, TIME_TRIAL_TARGET_SECONDS_MIN, TIME_TRIAL_TARGET_SECONDS_MAX);
    }
    return TIME_TRIAL_TARGET_SECONDS_DEFAULT;
  }

  function writeTimeTrialTargetSec(sec) {
    if (_tpStorage && typeof _tpStorage.writeTimeTrialTargetSec === "function") {
      _tpStorage.writeTimeTrialTargetSec(sec, TIME_TRIAL_TARGET_SECONDS_DEFAULT, TIME_TRIAL_TARGET_SECONDS_MIN, TIME_TRIAL_TARGET_SECONDS_MAX);
    }
  }

  function getTimeTrialTargetSec() {
    // Prefer per-prompt normalized targets.
    var v = (runState && runState.timeTrialTargetSec) ? (runState.timeTrialTargetSec | 0) : 0;
    if (v > 0) return v;

    // Backward compatible: if we have a prompt, derive the target from it.
    try {
      if (runState && runState.promptEn) {
        var d = computeTimeTrialTargetSec(runState.promptEn);
        if (d > 0) return d;
      }
    } catch (e0) {}

    // Legacy fallback (persisted fixed target)
    var legacy = (runState && runState.targetTimeSeconds) ? (runState.targetTimeSeconds | 0) : 0;
    if (legacy > 0) return legacy;
    return readTimeTrialTargetSec();
  }

  // ---- Time Trial card helpers (low-risk UX) ----
  // safeJsonParse + formatSeconds1 are provided by TypingPremium.storage.

  function renderTimeTrialBestPassOnCard() {
    // Never throw; no console errors in normal flow.
    var el = null;
    try { el = document.getElementById("typingCardMeta_timeTrial"); } catch (e0) { el = null; }
    if (!el) return;

    var rec = null;
    var dur = 30;
    try { dur = normalizeTimeTrialDurationSec(readTimeTrialDurationSec()); } catch (eD0) { dur = 30; }
    try {
      if (_tpStorage && typeof _tpStorage.getTimeTrialBestMetaForDuration === "function") {
        rec = _tpStorage.getTimeTrialBestMetaForDuration(dur);
      } else if (_tpStorage && typeof _tpStorage.getTimeTrialBestMeta === "function" && dur === 30) {
        // 30s uses legacy key.
        rec = _tpStorage.getTimeTrialBestMeta();
      } else {
        var raw = null;
        var key = (dur === 60) ? "bolo_typing_best_time_trial_v1_60" : "bolo_typing_best_time_trial_v1";
        key = typingProfileKey(key);
        try { raw = localStorage.getItem(key); } catch (e1) { raw = null; }
        rec = safeJsonParse(raw, null);
      }
    } catch (e2) { rec = null; }
    if (!rec || typeof rec !== "object") {
      el.textContent = (dur === 60 ? "Best (60s): — • Length: —" : "Best (30s): — • Length: —");
      return;
    }

    function pickNumber(obj, keys) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (obj && obj.hasOwnProperty(k)) {
          var v = obj[k];
          var n = (typeof v === "number" && isFinite(v)) ? v : parseFloat(v);
          if (isFinite(n)) return n;
        }
      }
      return 0;
    }

    var bestSec = pickNumber(rec, [
      "bestSec", "bestSeconds", "sec", "seconds",
      "timeSec", "timeSeconds", "bestTimeSec", "bestTimeSeconds"
    ]);

    // Support ms-shaped fields (rare, but defensive).
    if (!(bestSec > 0)) {
      var ms = pickNumber(rec, ["bestMs", "timeMs", "elapsedMs", "ms"]);
      if (ms > 0) bestSec = ms / 1000;
    }

    var chars = pickNumber(rec, ["promptLen", "chars", "len", "charCount", "promptChars"]);
    chars = Math.round(chars);

    var secStr = formatSeconds1(bestSec);
    if (!secStr) {
      el.textContent = "Best time: — • Length: —";
      return;
    }

    var line = (dur === 60 ? "Best (60s): " : "Best (30s): ") + secStr + "s";
    line += " • Length: " + (chars > 0 ? (String(chars) + " chars") : "—");
    el.textContent = line;
  }

  function renderTypeDefineStatsOnCard() {
    var el = getEl("typingCardMeta_typeDefine");
    if (!el) return;

    var stats = null;
    try {
      if (window.State && typeof State.getTypeDefineStats === "function") {
        stats = State.getTypeDefineStats();
      }
    } catch (e0) { stats = null; }

    if (!stats || typeof stats !== "object" || !stats.wordStats || typeof stats.wordStats !== "object") {
      el.textContent = "Seen: —";
      return;
    }

    var seen = 0;
    var typeMiss = 0;
    var mcqMiss = 0;
    for (var k in stats.wordStats) {
      if (!stats.wordStats.hasOwnProperty(k)) continue;
      var s = stats.wordStats[k];
      if (!s || typeof s !== "object") continue;
      var a = (typeof s.seen === "number" && isFinite(s.seen)) ? (s.seen | 0) : (parseInt(s.seen, 10) | 0);
      var b = (typeof s.typeMiss === "number" && isFinite(s.typeMiss)) ? (s.typeMiss | 0) : (parseInt(s.typeMiss, 10) | 0);
      var c0 = (s && s.hasOwnProperty("mcqMiss")) ? s.mcqMiss : s.meaningMiss;
      var c = (typeof c0 === "number" && isFinite(c0)) ? (c0 | 0) : (parseInt(c0, 10) | 0);
      if (a > 0) seen += a;
      if (b > 0) typeMiss += b;
      if (c > 0) mcqMiss += c;
    }
    if (seen < 0) seen = 0;
    if (typeMiss < 0) typeMiss = 0;
    if (mcqMiss < 0) mcqMiss = 0;

    el.textContent = "Seen: " + String(seen);
  }

  // Prompt bank: prefer global data file (app/data/typing.js), fall back to local.
  // Guard: if the external prompt bank is tiny, prefer the richer built-in set.
  var PROMPTS = ((typeof TYPING_PROMPTS !== "undefined") && TYPING_PROMPTS && TYPING_PROMPTS.length >= 30)
    ? TYPING_PROMPTS
    : [
    { en: "My name is Aman.", pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।" },
    { en: "I like apples.", pa: "ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ।" },
    { en: "Please close the door.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰੋ।" },
    { en: "She is going to school today.", pa: "ਉਹ ਅੱਜ ਸਕੂਲ ਜਾ ਰਹੀ ਹੈ।" },
    { en: "We will eat dinner at seven.", pa: "ਅਸੀਂ ਸੱਤ ਵਜੇ ਰਾਤ ਦਾ ਖਾਣਾ ਖਾਵਾਂਗੇ।" },

    { en: "I am ready now.", pa: "ਮੈਂ ਹੁਣ ਤਿਆਰ ਹਾਂ।" },
    { en: "He is my friend.", pa: "ਉਹ ਮੇਰਾ ਦੋਸਤ ਹੈ।" },
    { en: "This is my book.", pa: "ਇਹ ਮੇਰੀ ਕਿਤਾਬ ਹੈ।" },
    { en: "I can help you.", pa: "ਮੈਂ ਤੇਰੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।" },
    { en: "Please sit here.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਬੈਠੋ।" },

    { en: "I am learning English.", pa: "ਮੈਂ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।" },
    { en: "Today is a good day.", pa: "ਅੱਜ ਚੰਗਾ ਦਿਨ ਹੈ।" },
    { en: "I want some water.", pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।" },
    { en: "The cat is sleeping.", pa: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।" },
    { en: "The sun is bright.", pa: "ਸੂਰਜ ਤੇਜ਼ ਹੈ।" },

    { en: "Open the window, please.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਖਿੜਕੀ ਖੋਲ੍ਹੋ।" },
    { en: "I see a small bird.", pa: "ਮੈਂ ਇੱਕ ਛੋਟਾ ਪੰਛੀ ਵੇਖਦਾ ਹਾਂ।" },
    { en: "We are going home.", pa: "ਅਸੀਂ ਘਰ ਜਾ ਰਹੇ ਹਾਂ।" },
    { en: "I have two pencils.", pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਪੈਂਸਿਲ ਹਨ।" },
    { en: "My bag is blue.", pa: "ਮੇਰਾ ਬੈਗ ਨੀਲਾ ਹੈ।" },

    { en: "I like to read.", pa: "ਮੈਨੂੰ ਪੜ੍ਹਨਾ ਪਸੰਦ ਹੈ।" },
    { en: "He can run fast.", pa: "ਉਹ ਤੇਜ਼ ਦੌੜ ਸਕਦਾ ਹੈ।" },
    { en: "She is very kind.", pa: "ਉਹ ਬਹੁਤ ਦਇਆਾਲੂ ਹੈ।" },
    { en: "We play after school.", pa: "ਅਸੀਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਖੇਡਦੇ ਹਾਂ।" },
    { en: "I am happy today.", pa: "ਮੈਂ ਅੱਜ ਖੁਸ਼ ਹਾਂ।" },

    { en: "Do you have a question?", pa: "ਕੀ ਤੇਰਾ ਕੋਈ ਸਵਾਲ ਹੈ?" },
    { en: "I will call you later.", pa: "ਮੈਂ ਤੈਨੂੰ ਬਾਅਦ ਵਿੱਚ ਫ਼ੋਨ ਕਰਾਂਗਾ।" },
    { en: "Please speak slowly.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।" },
    { en: "I forgot my keys.", pa: "ਮੈਂ ਆਪਣੀਆਂ ਚਾਬੀਆਂ ਭੁੱਲ ਗਿਆ।" },
    { en: "The food is hot.", pa: "ਖਾਣਾ ਗਰਮ ਹੈ।" },

    { en: "I need a new notebook.", pa: "ਮੈਨੂੰ ਨਵੀਂ ਕਾਪੀ ਚਾਹੀਦੀ ਹੈ।" },
    { en: "The bus is coming.", pa: "ਬੱਸ ਆ ਰਹੀ ਹੈ।" },
    { en: "We are in a hurry.", pa: "ਅਸੀਂ ਜਲਦੀ ਵਿੱਚ ਹਾਂ।" },
    { en: "This is my favorite game.", pa: "ਇਹ ਮੇਰੀ ਮਨਪਸੰਦ ਖੇਡ ਹੈ।" },
    { en: "I will try again.", pa: "ਮੈਂ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ।" },

    { en: "I can do it.", pa: "ਮੈਂ ਕਰ ਸਕਦਾ ਹਾਂ।" },
    { en: "Please be careful.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਨਾਲ ਰਹੋ।" },
    { en: "We are practicing now.", pa: "ਅਸੀਂ ਹੁਣ ਅਭਿਆਸ ਕਰ ਰਹੇ ਹਾਂ।" },
    { en: "I like this song.", pa: "ਮੈਨੂੰ ਇਹ ਗਾਣਾ ਪਸੰਦ ਹੈ।" },
    { en: "See you tomorrow.", pa: "ਕੱਲ੍ਹ ਮਿਲਾਂਗੇ।" },

    // Punctuation + capitalization
    { en: "Stop, look, and listen.", pa: "ਰੁਕੋ, ਵੇਖੋ, ਤੇ ਸੁਣੋ।" },
    { en: "Wait—don't run!", pa: "ਰੁਕੋ—ਦੌੜੋ ਨਹੀਂ!" },
    { en: "Yes, I can.", pa: "ਹਾਂ, ਮੈਂ ਕਰ ਸਕਦਾ ਹਾਂ।" },
    { en: "No, I can't.", pa: "ਨਹੀਂ, ਮੈਂ ਨਹੀਂ ਕਰ ਸਕਦਾ।" },
    { en: "Where are you going?", pa: "ਤੂੰ ਕਿੱਥੇ ਜਾ ਰਿਹਾ ਹੈਂ?" },
    { en: "What time is it?", pa: "ਕਿੰਨਾ ਵੱਜਿਆ ਹੈ?" },
    { en: "Please type: A, B, C.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਟਾਈਪ ਕਰੋ: A, B, C।" },

    // Numbers + common symbols
    { en: "I have 2 apples.", pa: "ਮੇਰੇ ਕੋਲ 2 ਸੇਬ ਹਨ।" },
    { en: "We need 10 minutes.", pa: "ਸਾਨੂੰ 10 ਮਿੰਟ ਚਾਹੀਦੇ ਹਨ।" },
    { en: "Room 3 is on the left.", pa: "ਕਮਰਾ 3 ਖੱਬੇ ਪਾਸੇ ਹੈ।" },
    { en: "My phone number is 123-456.", pa: "ਮੇਰਾ ਫ਼ੋਨ ਨੰਬਰ 123-456 ਹੈ।" },
    { en: "I can pay $5.", pa: "ਮੈਂ $5 ਦੇ ਸਕਦਾ ਹਾਂ।" },

    // Spaces + rhythm
    { en: "Type one space between words.", pa: "ਸ਼ਬਦਾਂ ਵਿਚਕਾਰ ਇੱਕ ਸਪੇਸ ਟਾਈਪ ਕਰੋ।" },
    { en: "Slow and steady wins.", pa: "ਹੌਲੀ ਤੇ ਟਿਕਾ ਕੇ ਜਿੱਤ ਹੁੰਦੀ ਹੈ।" },
    { en: "Take a deep breath, then type.", pa: "ਗਹਿਰਾ ਸਾਹ ਲਓ, ਫਿਰ ਟਾਈਪ ਕਰੋ।" },

    // Common bigrams/trigrams (th/he/in/er/tion) via natural phrases
    { en: "This is the best thing.", pa: "ਇਹ ਸਭ ਤੋਂ ਵਧੀਆ ਗੱਲ ਹੈ।" },
    { en: "There is a thin thread.", pa: "ਉੱਥੇ ਇੱਕ ਪਤਲਾ ਧਾਗਾ ਹੈ।" },
    { en: "I think he is here.", pa: "ਮੈਂ ਸੋਚਦਾ ਹਾਂ ਉਹ ਇੱਥੇ ਹੈ।" },
    { en: "We are in the garden.", pa: "ਅਸੀਂ ਬਾਗ ਵਿੱਚ ਹਾਂ।" },
    { en: "Better to try than to quit.", pa: "ਛੱਡਣ ਨਾਲੋਂ ਕੋਸ਼ਿਸ਼ ਚੰਗੀ ਹੈ।" },

    // Longer prompts (medium/long band coverage)
    { en: "When you type, focus on accuracy first—speed will come later.", pa: "ਜਦੋਂ ਤੁਸੀਂ ਟਾਈਪ ਕਰੋ, ਪਹਿਲਾਂ ਸਹੀਪਨ ਤੇ ਧਿਆਨ ਦਿਓ—ਰਫ਼ਤਾਰ ਬਾਅਦ ਆ ਜਾਏਗੀ।" },
    { en: "If you make a mistake, pause, fix it, and continue calmly.", pa: "ਜੇ ਗਲਤੀ ਹੋਵੇ, ਰੁਕੋ, ਠੀਕ ਕਰੋ, ਤੇ ਸ਼ਾਂਤੀ ਨਾਲ ਜਾਰੀ ਰੱਖੋ।" }
  ];

  // Difficulty bands (derived locally; no app-wide schema changes)
  function bandForText(en) {
    var s = (en == null) ? "" : String(en);
    var n = s.length;
    if (n < 40) return "short";
    if (n <= 90) return "medium";
    return "long";
  }

  function normalizePromptItem(item) {
    // Backward compatible:
    // - string -> {en: str, pa: "", band: ...}
    // - object -> ensure {en, pa, band}
    if (item == null) return { en: "", pa: "", band: "short" };
    if (typeof item === "string") {
      return { en: String(item), pa: "", band: bandForText(item) };
    }
    var en = (item.en == null) ? "" : String(item.en);
    var pa = (item.pa == null) ? "" : String(item.pa);
    var band = item.band ? String(item.band) : bandForText(en);
    if (band !== "short" && band !== "medium" && band !== "long") band = bandForText(en);

    // Optional tags (used for Lessons). Keep additive and backward compatible.
    var tags = null;
    if (item.tags && Array.isArray(item.tags)) {
      tags = item.tags.slice(0);
    } else if (item.tags && typeof item.tags === "string") {
      tags = [String(item.tags)];
    }
    if (!tags) tags = inferTagsForPrompt(en);
    return { en: en, pa: pa, band: band, tags: tags };
  }

  function inferTagsForPrompt(en) {
    var s = (en == null) ? "" : String(en);
    var tags = [];

    function add(t) {
      if (!t) return;
      for (var i = 0; i < tags.length; i++) if (tags[i] === t) return;
      tags.push(t);
    }

    // Always includes spaces (all prompts are multi-word here)
    add("spaces");

    if (/[0-9]/.test(s)) add("numbers");
    if (/'/.test(s)) add("apostrophe");
    if (/\?/.test(s)) add("question");
    if (/!/.test(s)) add("exclamation");
    if (/,/.test(s)) add("comma");
    if (/:/.test(s)) add("colon");
    if (/;/.test(s)) add("semicolon");
    if (/\./.test(s)) add("period");
    if (/[-—]/.test(s)) add("dash");
    if (/\(|\)/.test(s)) add("parentheses");
    if (/\"/.test(s)) add("quotes");
    if (/[A-Z]/.test(s.replace(/^[A-Z]/, ""))) add("capital");

    if (/[\.,;:!?\"'\(\)\-—]/.test(s)) add("punctuation");
    return tags;
  }

  function normalizePrompts(arr) {
    if (!arr || !arr.length) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) out.push(normalizePromptItem(arr[i]));
    return out;
  }

  // Ensure PROMPTS entries include {en, pa, band}
  PROMPTS = normalizePrompts(PROMPTS);

  // Per-band shuffle bags: avoids repeats until each band cycles
  var bagShort = [];
  var bagMedium = [];
  var bagLong = [];
  var posShort = 0;
  var posMedium = 0;
  var posLong = 0;

  // Time Trial shuffle bag (length-controlled prompts)
  var timeTrialPool = null;
  var timeTrialBag = [];
  var timeTrialPos = 0;
  var timeTrialWarnedFallback = false;

  function isEligibleTimeTrialPrompt(p) {
    if (!p || !p.en) return false;
    var en = String(p.en);
    var words = countWordsInText(en);
    var chars = promptCleanLen(en);
    if (!(words >= TIME_TRIAL_MIN_WORDS) || !(chars >= TIME_TRIAL_MIN_CHARS)) return false;

    if (TIME_TRIAL_EXCLUDE_HEAVY_PUNCT) {
      var punct = countPunctuationChars(en);
      var ratio = (chars > 0) ? (punct / chars) : 0;
      if (punct > TIME_TRIAL_MAX_PUNCT) return false;
      if (ratio > TIME_TRIAL_MAX_PUNCT_RATIO) return false;
    }

    return true;
  }

  function isEligibleTimeTrialPromptLenOnly(p) {
    if (!p || !p.en) return false;
    var en = String(p.en);
    var words = countWordsInText(en);
    var chars = promptCleanLen(en);
    return (words >= TIME_TRIAL_MIN_WORDS) && (chars >= TIME_TRIAL_MIN_CHARS);
  }

  function buildTimeTrialPool() {
    // Prefer longer prompts that meet min length.
    // Fall back progressively so the mode never breaks even with small prompt banks.
    var pool = [];
    if (!PROMPTS || !PROMPTS.length) return pool;

    function sortByLenDesc(a, b) {
      var la = a ? promptCleanLen(a.en) : 0;
      var lb = b ? promptCleanLen(b.en) : 0;
      return lb - la;
    }

    // 1) Trial-safe: meets min length thresholds (and optional punctuation gate).
    for (var i = 0; i < PROMPTS.length; i++) {
      var p = PROMPTS[i];
      if (p && isEligibleTimeTrialPrompt(p)) pool.push(p);
    }
    pool.sort(sortByLenDesc);
    if (pool.length >= TIME_TRIAL_POOL_MIN) return pool;

    // 2) Relax punctuation gate (still enforce min length/words).
    pool = [];
    for (var j = 0; j < PROMPTS.length; j++) {
      var p2 = PROMPTS[j];
      if (p2 && isEligibleTimeTrialPromptLenOnly(p2)) pool.push(p2);
    }
    pool.sort(sortByLenDesc);
    if (pool.length >= TIME_TRIAL_POOL_MIN) return pool;

    // 3) Final fallback: use the longest prompts available, preferring those that
    // still meet the minimum length if any exist.
    pool = [];
    for (var k = 0; k < PROMPTS.length; k++) {
      var p3 = PROMPTS[k];
      if (p3 && isEligibleTimeTrialPromptLenOnly(p3)) pool.push(p3);
    }
    if (!pool.length) pool = PROMPTS.slice(0);
    pool.sort(sortByLenDesc);

    if (!timeTrialWarnedFallback && DEBUG_TYPING_TIME_TRIAL) {
      timeTrialWarnedFallback = true;
      try { console.warn("[TypingPremium][timeTrial] Using fallback pool (prompt bank lacks enough long prompts)"); } catch (e0) {}
    }

    return pool;
  }

  function pickTimeTrialPrompt() {
    if (!timeTrialPool || !timeTrialPool.length) timeTrialPool = buildTimeTrialPool();
    if (!timeTrialBag.length || timeTrialPos >= timeTrialBag.length) {
      timeTrialBag = (timeTrialPool && timeTrialPool.length) ? timeTrialPool.slice(0) : [];
      shuffleInPlace(timeTrialBag);
      timeTrialPos = 0;
    }
    return timeTrialBag.length ? timeTrialBag[timeTrialPos++] : null;
  }

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  // Type & Define: build a 10-card session queue using long-term (cross-session) stats.
  // Goal: prioritize words that are (a) missed more, (b) not seen recently, (c) low exposure,
  // while still mixing in easier/new items to avoid fatigue.
  function typeDefineComputeDueInfo(item, stats, nowMs) {
    var id = "";
    try { id = String((item && (item.id || item.word)) ? (item.id || item.word) : ""); } catch (e0) { id = ""; }
    if (!id) id = "__unknown";

    var ws = (stats && stats.wordStats && typeof stats.wordStats === "object") ? stats.wordStats : {};
    var s = ws[id];
    if (!s || typeof s !== "object") s = {};

    var seen = (typeof s.seen === "number" && isFinite(s.seen)) ? (s.seen | 0) : (parseInt(s.seen, 10) | 0);
    if (!(seen > 0)) seen = 0;
    var typeMiss = (typeof s.typeMiss === "number" && isFinite(s.typeMiss)) ? (s.typeMiss | 0) : (parseInt(s.typeMiss, 10) | 0);
    if (!(typeMiss > 0)) typeMiss = 0;

    // v2 stats: mcqMiss. Backward-compat: tolerate older meaningMiss-shaped stats.
    var mmRaw = (s && s.hasOwnProperty("mcqMiss")) ? s.mcqMiss : s.meaningMiss;
    var mcqMiss = (typeof mmRaw === "number" && isFinite(mmRaw)) ? (mmRaw | 0) : (parseInt(mmRaw, 10) | 0);
    if (!(mcqMiss > 0)) mcqMiss = 0;

    var last = 0;
    if (typeof s.lastSeenAt === "number" && isFinite(s.lastSeenAt)) last = s.lastSeenAt;
    if (!(last > 0)) last = 0;

    var misses = (typeMiss | 0) + (mcqMiss | 0);

    // Days since seen: never-seen treated as very old.
    var daysSinceSeen = 999;
    if (last > 0 && nowMs > last) {
      daysSinceSeen = Math.floor((nowMs - last) / 86400000);
      if (daysSinceSeen < 0) daysSinceSeen = 0;
    }

    // Simple stable scoring (documented):
    // - Misses: strong effect
    // - Recency: medium effect (cap at 14 days)
    // - New/low-seen: small boosts (ensures mix-in)
    var dCap = daysSinceSeen;
    if (dCap > 14) dCap = 14;
    if (dCap < 0) dCap = 0;

    var score = (misses * 5) + (dCap * 1) + (seen === 0 ? 8 : 0) + (seen < 3 ? 2 : 0);

    // Anti-fatigue helper flags used by the sampler.
    var lowSeen = (seen < 2);
    var hard = (misses >= 2);

    return {
      id: id,
      item: item,
      seen: seen,
      typeMiss: typeMiss,
      mcqMiss: mcqMiss,
      misses: misses,
      lastSeenAt: last,
      daysSinceSeen: daysSinceSeen,
      score: score,
      lowSeen: lowSeen,
      hard: hard
    };
  }

  // Type & Define: developer diagnostics overlay
  // Enable via URL param: ?dev=1
  var __TAD_DEV_ON__ = null;

  function typeDefineIsDevOn() {
    if (__TAD_DEV_ON__ != null) return (__TAD_DEV_ON__ === true);
    var on = false;
    try {
      var s = String((window && window.location && window.location.search) ? window.location.search : "");
      on = /(^|[?&])dev=1(&|$)/.test(s);
    } catch (e0) { on = false; }
    __TAD_DEV_ON__ = on;
    return on;
  }

  function typeDefineSetDevPanelVisible(isVisible) {
    var el = getEl("tadDevPanel");
    if (!el) return;
    if (isVisible) {
      try { el.classList.add("is-visible"); } catch (e0) {}
      try { el.setAttribute("aria-hidden", "false"); } catch (e1) {}
    } else {
      try { el.classList.remove("is-visible"); } catch (e2) {}
      try { el.setAttribute("aria-hidden", "true"); } catch (e3) {}
    }
  }

  function formatDevTime(ms) {
    ms = (typeof ms === "number" && isFinite(ms)) ? ms : 0;
    if (!(ms > 0)) return "—";
    try {
      var d = new Date(ms);
      var s = d.toLocaleString ? d.toLocaleString() : d.toString();
      return String(s || "—");
    } catch (e0) {
      return String(ms);
    }
  }

  function typeDefineUpdateDevPanel(item, dueInfo, sourceLabel) {
    // Dev-only: do not touch DOM or compute when disabled.
    if (!typeDefineIsDevOn()) return;
    if (!typeDefineSession || typeDefineSession.active !== true) return;
    if (typeDefineSession._devPanelDismissed === true) return;

    var panel = getEl("tadDevPanel");
    var body = getEl("tadDevPanelBody");
    if (!panel || !body) return;

    typeDefineSetDevPanelVisible(true);

    item = item || {};
    dueInfo = dueInfo || {};
    var wid = String(dueInfo.id || item.id || item.word || "");
    var word = String(item.word || "");

    var seen = (dueInfo.seen | 0);
    var typeMiss = (dueInfo.typeMiss | 0);
    var mcqMiss = (dueInfo.mcqMiss | 0);
    var misses = (dueInfo.misses | 0);
    var lastSeenAt = (typeof dueInfo.lastSeenAt === "number" && isFinite(dueInfo.lastSeenAt)) ? dueInfo.lastSeenAt : 0;
    var daysSince = (dueInfo.daysSinceSeen | 0);
    if (daysSince < 0) daysSince = 0;
    var dCap = daysSince;
    if (dCap > 14) dCap = 14;
    if (dCap < 0) dCap = 0;

    var missScore = (misses * 5);
    var recencyScore = (dCap * 1);
    var newBonus = (seen === 0 ? 8 : 0) + (seen < 3 ? 2 : 0);
    var totalScore = (typeof dueInfo.score === "number" && isFinite(dueInfo.score)) ? (dueInfo.score | 0) : (missScore + recencyScore + newBonus);

    var src = String(sourceLabel || "normal");

    var lines = [];
    lines.push("source: " + src);
    lines.push("wordId: " + (wid || "—"));
    lines.push("word: " + (word || "—"));
    lines.push("stats: seen=" + String(seen) + " typeMiss=" + String(typeMiss) + " mcqMiss=" + String(mcqMiss));
    lines.push("lastSeenAt: " + formatDevTime(lastSeenAt) + (lastSeenAt > 0 ? (" (" + String(daysSince) + "d ago)") : ""));
    lines.push("dueScore: " + String(totalScore) + "  [misses " + String(missScore) + " + recency " + String(recencyScore) + " + new " + String(newBonus) + "]");

    body.textContent = lines.join("\n");
  }

  function typeDefineWeightedPickIndex(rows) {
    var total = 0;
    for (var i = 0; i < rows.length; i++) {
      var w = rows[i] && rows[i].weight;
      var ww = (typeof w === "number" && isFinite(w)) ? w : 0;
      if (ww > 0) total += ww;
    }
    if (!(total > 0)) return -1;
    var r = Math.random() * total;
    for (var j = 0; j < rows.length; j++) {
      var wj = rows[j] && rows[j].weight;
      var ww2 = (typeof wj === "number" && isFinite(wj)) ? wj : 0;
      if (!(ww2 > 0)) continue;
      r -= ww2;
      if (r <= 0) return j;
    }
    return rows.length ? (rows.length - 1) : -1;
  }

  function buildTypeDefineSessionQueue(opts) {
    opts = (opts && typeof opts === "object") ? opts : {};
    var totalCards = (typeof opts.totalCards === "number" && isFinite(opts.totalCards)) ? (opts.totalCards | 0) : TYPE_DEFINE_MATCH_TOTAL_CARDS;
    if (totalCards <= 0) totalCards = TYPE_DEFINE_MATCH_TOTAL_CARDS;

    var vocab = opts.vocab;
    if (!Array.isArray(vocab)) vocab = getTypeDefineVocab();
    if (!vocab || !vocab.length) return [];

    // If dataset small, just shuffle and return all.
    if (vocab.length <= totalCards) {
      var small = vocab.slice(0);
      shuffleInPlace(small);
      return small;
    }

    var stats = null;
    try { stats = typeDefineLoadStats(); } catch (e0) { stats = null; }
    var nowMs = Date.now ? Date.now() : (new Date()).getTime();

    var scored = [];
    for (var i = 0; i < vocab.length; i++) {
      var it = vocab[i];
      if (!it) continue;
      var info = typeDefineComputeDueInfo(it, stats, nowMs);
      // Weight must be positive. Add a small constant to keep easy items possible.
      var w = 1 + (info.score | 0);
      // Tiny jitter avoids deterministic ties.
      w += Math.random() * 0.25;
      scored.push({ info: info, weight: w });
    }

    if (!scored.length) return [];

    // Anti-fatigue constraints.
    var minLowSeen = 2;
    var maxHard = 6;

    var selected = [];
    var selectedIds = Object.create(null);
    var hardCount = 0;

    // 1) Force at least 2 low-seen items (seen < 2) when available.
    var lowPool = [];
    for (var a = 0; a < scored.length; a++) {
      if (scored[a] && scored[a].info && scored[a].info.lowSeen) lowPool.push(scored[a]);
    }
    var needLow = minLowSeen;
    while (needLow > 0 && lowPool.length && selected.length < totalCards) {
      var idxL = typeDefineWeightedPickIndex(lowPool);
      if (idxL < 0) break;
      var rowL = lowPool.splice(idxL, 1)[0];
      if (!rowL || !rowL.info) continue;
      if (selectedIds[rowL.info.id]) continue;
      selectedIds[rowL.info.id] = true;
      selected.push(rowL);
      if (rowL.info.hard) hardCount += 1;
      needLow -= 1;
    }

    // 2) Fill remaining slots with weighted sampling without replacement.
    var pool = scored.slice(0);
    while (selected.length < totalCards && pool.length) {
      // Remove already selected from pool (cheap linear scan is fine here).
      for (var k = pool.length - 1; k >= 0; k--) {
        var pk = pool[k];
        if (!pk || !pk.info) { pool.splice(k, 1); continue; }
        if (selectedIds[pk.info.id]) pool.splice(k, 1);
      }
      if (!pool.length) break;

      var filtered = pool;
      if (hardCount >= maxHard) {
        filtered = [];
        for (var f = 0; f < pool.length; f++) {
          if (pool[f] && pool[f].info && !pool[f].info.hard) filtered.push(pool[f]);
        }
        if (!filtered.length) filtered = pool;
      }

      var idx = typeDefineWeightedPickIndex(filtered);
      if (idx < 0) break;
      var picked = filtered[idx];
      if (!picked || !picked.info) {
        break;
      }
      if (selectedIds[picked.info.id]) {
        // Should be rare; loop again.
        continue;
      }

      selectedIds[picked.info.id] = true;
      selected.push(picked);
      if (picked.info.hard) hardCount += 1;
    }

    // Convert to item queue and mix order so the session doesn't start "all hard".
    var out = [];
    for (var s = 0; s < selected.length; s++) {
      if (selected[s] && selected[s].info && selected[s].info.item) out.push(selected[s].info.item);
    }
    shuffleInPlace(out);

    // Dev-only summary (once per session start; no per-keystroke spam).
    var debugOn = (DEBUG_TYPE_DEFINE_QUEUE === true) || (window && window.DEBUG_TYPE_DEFINE_QUEUE === true);
    if (debugOn && window && window.console && typeof console.debug === "function") {
      try {
        var summary = [];
        for (var q = 0; q < selected.length; q++) {
          var ii = selected[q].info;
          summary.push({
            id: ii.id,
            score: ii.score,
            misses: ii.misses,
            seen: ii.seen,
            daysSinceSeen: ii.daysSinceSeen
          });
        }
        summary.sort(function(x, y) { return (y.score | 0) - (x.score | 0); });
        console.debug("[Type&Define] session queue (top by score)", summary.slice(0, Math.min(summary.length, 10)));
      } catch (eDbg) {}
    }

    return out;
  }

  function buildTypeDefineReviewQueue(opts) {
    // Review Mistakes: pick the most-missed words first.
    // Tie-breakers: older lastSeenAt first, then lower seen.
    // If fewer than totalCards have mistakes, fill remaining slots from the normal due-score builder.
    opts = (opts && typeof opts === "object") ? opts : {};
    var totalCards = (typeof opts.totalCards === "number" && isFinite(opts.totalCards)) ? (opts.totalCards | 0) : TYPE_DEFINE_MATCH_TOTAL_CARDS;
    if (totalCards <= 0) totalCards = TYPE_DEFINE_MATCH_TOTAL_CARDS;

    var vocab = opts.vocab;
    if (!Array.isArray(vocab)) vocab = getTypeDefineVocab();
    if (!vocab || !vocab.length) return [];

    // If dataset small, just shuffle and return all.
    if (vocab.length <= totalCards) {
      var small = vocab.slice(0);
      shuffleInPlace(small);
      return small;
    }

    var stats = null;
    try { stats = typeDefineLoadStats(); } catch (e0) { stats = null; }
    var ws = (stats && stats.wordStats && typeof stats.wordStats === "object") ? stats.wordStats : {};

    var rows = [];
    for (var i = 0; i < vocab.length; i++) {
      var it = vocab[i];
      if (!it) continue;
      var id = "";
      try { id = String((it.id || it.word) ? (it.id || it.word) : ""); } catch (eId) { id = ""; }
      if (!id) continue;

      var s = ws[id];
      if (!s || typeof s !== "object") s = {};
      var seen = (typeof s.seen === "number" && isFinite(s.seen)) ? (s.seen | 0) : (parseInt(s.seen, 10) | 0);
      if (!(seen > 0)) seen = 0;
      var tm = (typeof s.typeMiss === "number" && isFinite(s.typeMiss)) ? (s.typeMiss | 0) : (parseInt(s.typeMiss, 10) | 0);
      if (!(tm > 0)) tm = 0;
      var mmRaw = (s && s.hasOwnProperty("mcqMiss")) ? s.mcqMiss : s.meaningMiss;
      var mm = (typeof mmRaw === "number" && isFinite(mmRaw)) ? (mmRaw | 0) : (parseInt(mmRaw, 10) | 0);
      if (!(mm > 0)) mm = 0;
      var missScore = (tm | 0) + (mm | 0);
      if (!(missScore > 0)) continue;

      var last = 0;
      if (typeof s.lastSeenAt === "number" && isFinite(s.lastSeenAt)) last = s.lastSeenAt;
      if (!(last > 0)) last = 0;

      rows.push({ item: it, id: id, missScore: missScore, lastSeenAt: last, seen: seen });
    }

    if (!rows.length) return [];

    rows.sort(function(a, b) {
      var ms = (b.missScore | 0) - (a.missScore | 0);
      if (ms) return ms;

      // Older lastSeenAt first; treat 0 (unknown) as oldest.
      var la = (a.lastSeenAt > 0) ? a.lastSeenAt : -1;
      var lb = (b.lastSeenAt > 0) ? b.lastSeenAt : -1;
      if (la !== lb) return la - lb;

      return (a.seen | 0) - (b.seen | 0);
    });

    var queue = [];
    var picked = Object.create(null);
    for (var j = 0; j < rows.length && queue.length < totalCards; j++) {
      var r = rows[j];
      if (!r || !r.item) continue;
      if (picked[r.id]) continue;
      picked[r.id] = true;
      queue.push(r.item);
    }

    // Fill remaining slots from the normal due-score builder (avoids short sessions).
    if (queue.length < totalCards) {
      var filler = buildTypeDefineSessionQueue({ totalCards: totalCards, vocab: vocab });
      for (var f = 0; f < filler.length && queue.length < totalCards; f++) {
        var it2 = filler[f];
        if (!it2) continue;
        var id2 = "";
        try { id2 = String((it2.id || it2.word) ? (it2.id || it2.word) : ""); } catch (e2) { id2 = ""; }
        if (!id2) continue;
        if (picked[id2]) continue;
        picked[id2] = true;
        queue.push(it2);
      }
    }

    // Final safety fill (should be rare): random remaining items.
    if (queue.length < totalCards) {
      var rest = [];
      for (var z = 0; z < vocab.length; z++) {
        var it3 = vocab[z];
        if (!it3) continue;
        var id3 = "";
        try { id3 = String((it3.id || it3.word) ? (it3.id || it3.word) : ""); } catch (e3) { id3 = ""; }
        if (!id3) continue;
        if (picked[id3]) continue;
        rest.push(it3);
      }
      shuffleInPlace(rest);
      for (var rr = 0; rr < rest.length && queue.length < totalCards; rr++) queue.push(rest[rr]);
    }

    // Shuffle so review sessions aren't always "hardest-first".
    shuffleInPlace(queue);

    // Optional dev log (once per session start).
    try {
      var debugOn = (DEBUG_TYPE_DEFINE_QUEUE === true) || (window && window.DEBUG_TYPE_DEFINE_QUEUE === true);
      if (debugOn && window && window.console && typeof console.debug === "function") {
        console.debug("[Type&Define] review session started", { eligible: rows.length, queue: queue.length });
      }
    } catch (eDbg) {}

    return queue;
  }

  function refillBag(band) {
    var pool = [];
    for (var i = 0; i < PROMPTS.length; i++) {
      if (PROMPTS[i] && PROMPTS[i].band === band) pool.push(PROMPTS[i]);
    }
    shuffleInPlace(pool);

    if (band === "short") { bagShort = pool; posShort = 0; return; }
    if (band === "medium") { bagMedium = pool; posMedium = 0; return; }
    bagLong = pool; posLong = 0;
  }

  function pickFromBand(band) {
    if (!PROMPTS || !PROMPTS.length) return { en: "", pa: "", band: "short" };

    if (band === "short") {
      if (!bagShort.length || posShort >= bagShort.length) refillBag("short");
      return bagShort.length ? bagShort[posShort++] : null;
    }
    if (band === "medium") {
      if (!bagMedium.length || posMedium >= bagMedium.length) refillBag("medium");
      return bagMedium.length ? bagMedium[posMedium++] : null;
    }
    if (!bagLong.length || posLong >= bagLong.length) refillBag("long");
    return bagLong.length ? bagLong[posLong++] : null;
  }

  function pickRaceStylePrompt() {
    // Shared selector used by both Typing Race and Practice to keep pool + behavior identical.
    var best = getBestForMode("race");
    var bestAcc = (best && typeof best.bestAcc === "number") ? best.bestAcc : 0;

    var wShort = 50;
    var wMedium = 35;
    var wLong = 15;
    if (bestAcc > 0 && bestAcc < 92) {
      wShort = 70; wMedium = 25; wLong = 5;
    } else if (bestAcc >= 92 && bestAcc <= 96) {
      wShort = 50; wMedium = 40; wLong = 10;
    } else if (bestAcc > 96) {
      wShort = 45; wMedium = 40; wLong = 15;
    }

    var r = Math.floor(Math.random() * 100);
    var band = (r < wShort) ? "short" : ((r < (wShort + wMedium)) ? "medium" : "long");
    return pickFromBand(band) || pickFromBand("short") || pickFromBand("medium") || pickFromBand("long") || { en: "", pa: "", band: "short" };
  }

  function pickPromptForMode(mode) {
    var m = mode || "race";

    // Lessons: curated pool / shuffle-bag
    if (m === "lessons") {
      return pickLessonPrompt() || pickFromBand("short") || pickFromBand("medium") || pickFromBand("long") || { en: "", pa: "", band: "short" };
    }

    // Practice + Race: same selector so both features share pool + behavior.
    if (m === "practice") {
      return pickRaceStylePrompt();
    }

    // Time Trial: length-controlled shuffle bag (more fair)
    if (m === "timeTrial") {
      return pickTimeTrialPrompt() || pickFromBand("medium") || pickFromBand("long") || pickFromBand("short") || { en: "", pa: "", band: "medium" };
    }

    // Race
    return pickRaceStylePrompt();
  }

  function pickSharedTypingPrompt() {
    return pickRaceStylePrompt();
  }

  // ---------- Lessons catalog + prompt pool ----------
  var TYPING_LESSONS = [
    { id: "L_SPACES_1", title: "Spaces", objective: "One space between words", band: "short", tags: ["spaces"] },
    { id: "L_PUNCT_1", title: "Punctuation Basics", objective: "Comma, period, question mark", band: "short", tags: ["punctuation", "comma", "period", "question"] },
    { id: "L_NUM_1", title: "Numbers", objective: "Type digits smoothly", band: "short", tags: ["numbers"] },
    { id: "L_APOS_1", title: "Apostrophes", objective: "Don't, can't, I'm", band: "short", tags: ["apostrophe"] },
    { id: "L_DASH_1", title: "Dashes", objective: "Hyphen / em dash", band: "short", tags: ["dash"] },
    { id: "L_CAP_1", title: "Capital Letters", objective: "Capitals and names", band: "short", tags: ["capital"] },
    { id: "L_MIX_1", title: "Mixed Skills", objective: "Spaces + punctuation + accuracy", band: "medium", tags: ["spaces", "punctuation"] }
  ];

  var LAST_LESSON_ID_KEY = "bolo_typing_last_lesson_id";
  // Time Trial best time is stored per duration (30s vs 60s).
  // Back-compat: older versions used a single key with no suffix.
  var BEST_TIME_TRIAL_MS_KEY_LEGACY = "bolo_typing_time_trial_best_time_ms";
  var BEST_TIME_TRIAL_MS_KEY_30 = BEST_TIME_TRIAL_MS_KEY_LEGACY + "_30";
  var BEST_TIME_TRIAL_MS_KEY_60 = BEST_TIME_TRIAL_MS_KEY_LEGACY + "_60";

  function normalizeTimeTrialDurationSec(sec) {
    var v = parseInt(sec, 10);
    if (!isFinite(v)) v = TIME_TRIAL_TARGET_SECONDS_DEFAULT;
    if (v === 60) return 60;
    return 30;
  }

  function getBestTimeTrialMsKeyForTargetSec(targetSec) {
    var d = normalizeTimeTrialDurationSec(targetSec);
    var base = (d === 60) ? BEST_TIME_TRIAL_MS_KEY_60 : BEST_TIME_TRIAL_MS_KEY_30;
    return typingProfileKey(base);
  }

  function readTimeTrialDurationSec() {
    try {
      if (_tpStorage && typeof _tpStorage.readTimeTrialDurationSec === "function") {
        return normalizeTimeTrialDurationSec(_tpStorage.readTimeTrialDurationSec(TIME_TRIAL_TARGET_SECONDS_DEFAULT));
      }
    } catch (e0) {}

    try {
      var raw = localStorage.getItem(typingProfileKey("bolo_typing_time_trial_duration_sec"));
      return normalizeTimeTrialDurationSec(raw);
    } catch (e1) {
      return TIME_TRIAL_TARGET_SECONDS_DEFAULT;
    }
  }

  function writeTimeTrialDurationSec(sec) {
    var v = normalizeTimeTrialDurationSec(sec);
    try {
      if (_tpStorage && typeof _tpStorage.writeTimeTrialDurationSec === "function") {
        _tpStorage.writeTimeTrialDurationSec(v, TIME_TRIAL_TARGET_SECONDS_DEFAULT);
        return;
      }
    } catch (e0) {}

    try {
      localStorage.setItem(typingProfileKey("bolo_typing_time_trial_duration_sec"), String(v));
    } catch (e1) {}
  }

  function ensureLegacyTimeTrialBestMigrated() {
    // Non-destructive migration:
    // If legacy best exists and 30s key is empty, copy legacy -> 30s.
    try {
      var key30 = typingProfileKey(BEST_TIME_TRIAL_MS_KEY_30);
      var legacyKey = typingProfileKey(BEST_TIME_TRIAL_MS_KEY_LEGACY);
      var cur30 = parseInt(localStorage.getItem(key30) || "0", 10) || 0;
      if (cur30 > 0) return;
      var legacy = parseInt(localStorage.getItem(legacyKey) || "0", 10) || 0;
      if (legacy > 0) localStorage.setItem(key30, String(legacy));
    } catch (e0) {}
  }

  var lessonBag = [];
  var lessonPos = 0;
  var lessonPoolKey = "";
  var activeLessonPool = null;

  function findTypingLessonById(id) {
    var sid = String(id || "");
    for (var i = 0; i < TYPING_LESSONS.length; i++) {
      if (TYPING_LESSONS[i] && String(TYPING_LESSONS[i].id) === sid) return TYPING_LESSONS[i];
    }
    return null;
  }

  function readLastLessonId() {
    try {
      var v = localStorage.getItem(typingProfileKey(LAST_LESSON_ID_KEY));
      return v ? String(v) : null;
    } catch (e) {
      return null;
    }
  }

  function writeLastLessonId(id) {
    try {
      localStorage.setItem(typingProfileKey(LAST_LESSON_ID_KEY), String(id || ""));
    } catch (e) {}
  }

  function buildLessonPool(lesson) {
    var l = lesson || null;
    var out = [];
    if (!l || !Array.isArray(PROMPTS) || !PROMPTS.length) return out;

    var wantBand = l.band ? String(l.band) : null;
    var wantTags = Array.isArray(l.tags) ? l.tags : [];

    function hasAnyTag(pTags) {
      if (!wantTags.length) return true;
      if (!pTags || !pTags.length) return false;
      for (var i = 0; i < wantTags.length; i++) {
        for (var j = 0; j < pTags.length; j++) {
          if (String(pTags[j]) === String(wantTags[i])) return true;
        }
      }
      return false;
    }

    // First pass: band + tags
    for (var i = 0; i < PROMPTS.length; i++) {
      var p = PROMPTS[i];
      if (!p) continue;
      if (wantBand && String(p.band) !== wantBand) continue;
      if (!hasAnyTag(p.tags)) continue;
      out.push(p);
    }

    // If too small, relax band (tags only)
    if (out.length < 6) {
      out = [];
      for (var k = 0; k < PROMPTS.length; k++) {
        var p2 = PROMPTS[k];
        if (!p2) continue;
        if (!hasAnyTag(p2.tags)) continue;
        out.push(p2);
      }
    }

    // If still too small, fall back to all prompts of target band (if any)
    if (out.length < 6 && wantBand) {
      out = [];
      for (var m = 0; m < PROMPTS.length; m++) {
        var p3 = PROMPTS[m];
        if (p3 && String(p3.band) === wantBand) out.push(p3);
      }
    }

    // Final fallback: all prompts
    if (out.length < 6) out = PROMPTS.slice(0);

    return out;
  }

  function setActiveLesson(lesson) {
    runState.lessonId = lesson ? String(lesson.id || "") : "";
    runState.lessonTitle = lesson ? String(lesson.title || "") : "";
    runState.lessonObjective = lesson ? String(lesson.objective || "") : "";
    runState.lessonBand = lesson ? String(lesson.band || "") : "";
    runState.lessonTags = lesson && Array.isArray(lesson.tags) ? lesson.tags.slice(0) : [];

    activeLessonPool = lesson ? buildLessonPool(lesson) : null;
    lessonBag = [];
    lessonPos = 0;
    lessonPoolKey = lesson ? String(lesson.id || "") : "";
  }

  function pickLessonPrompt() {
    if (!activeLessonPool || !activeLessonPool.length) return null;
    if (!lessonBag.length || lessonPos >= lessonBag.length) {
      lessonBag = activeLessonPool.slice(0);
      shuffleInPlace(lessonBag);
      lessonPos = 0;
    }
    return lessonBag.length ? lessonBag[lessonPos++] : null;
  }

  var state = {
    prompt: "",
    startedAt: 0,
    running: false,
    totalTyped: 0,
    totalErrors: 0,
    rafId: 0
  };

  function pickPrompt() {
    // Backward-compatible wrapper
    return pickPromptForMode((runState && runState.mode) ? runState.mode : "race");
  }

  // Run-specific state for stable metrics
  var runState = {
    mode: "race",        // "race" | "practice" | "timeTrial" | "lessons"
    timerEnabled: true,   // race/timeTrial: true, practice/lessons: false
    startTs: 0,
    promptEn: "",
    promptPa: "",
    finished: false,
    prevValue: "",
    progressLen: 0,
    totalAdded: 0,
    totalErrors: 0,
    missCounts: null,
    bigramCounts: null,
    forceRetry: false,
    targetTimeSeconds: TIME_TRIAL_TARGET_SECONDS_DEFAULT,

    // Time Trial normalized goal (derived per prompt)
    timeTrialTargetSec: 0,
    timeTrialPromptLen: 0,
    timeTrialWordCount: 0,

    lessonId: "",
    lessonTitle: "",
    lessonObjective: "",
    lessonBand: "",
    lessonTags: null,

    // Optional drill context (Typing Center add-ons)
    drillKind: "",        // e.g. "ngrams"
    drillLabel: "",       // display label
    drillPackId: "",
    drillStep: 0,
    drillTotal: 0
  };

  // Additive drill session state (does not affect scoring/gameplay)
  // shape: { kind:"ngrams", packId, packTitle, queue:[string], i:number }
  var typingDrillSession = null;

    /* =========================================================
      Type & Define (Typing Center) — new mode
      Loop per item: (1) type the English word → (2) pick Punjabi meaning (4-option MCQ)
      Approved features implemented:
      1) One quick retry on wrong submit (submit only)
      2) 3-second MCQ timer w/ auto-advance (timeout = incorrect)
      3) Hotlist reinsertion (3/8/20), clears after 2 consecutive clears, cap 2 hotlist-in-a-row
      4) Per-word split stats per profile: seen, typeMiss, mcqMiss, defMiss (+ lastSeenAt)
      5) Tutor Mode: stop on first error (input-event enforced; backspace allowed)
      ========================================================= */

    var typeDefineSession = null;
    var typeDefineStats = null;

  function cancelTypingDrillSession() {
    typingDrillSession = null;
    try {
      runState.drillKind = "";
      runState.drillLabel = "";
      runState.drillPackId = "";
      runState.drillStep = 0;
      runState.drillTotal = 0;
    } catch (e0) {}
  }

  function isTypeDefineActive() {
    try { return !!(typeDefineSession && typeDefineSession.active === true); } catch (e0) { return false; }
  }

  function getTypeDefineVocab() {
    try {
      if (window.BOLO_TYPE_DEFINE_VOCAB_V1 && window.BOLO_TYPE_DEFINE_VOCAB_V1.length) return window.BOLO_TYPE_DEFINE_VOCAB_V1;
    } catch (e0) {}
    return [];
  }

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function typeDefineLoadSettingsStopOnError() {
    return false;
  }

  // Type & Define pacing: brief comprehension pause after MCQ resolves (selection or timeout)
  var TYPE_DEFINE_ADVANCE_DELAY_MS = 350;

  // Type & Define v2.1: brief lockout window after an incorrect MCQ tap
  // (prevents double-taps and gives kids time to read feedback)
  var TYPE_DEFINE_MCQ_RETRY_DELAY_MS = 650;

  // Type & Define session length (cards shown before returning to Typing Center)
  var TYPE_DEFINE_MATCH_TOTAL_CARDS = 10;

  // Type & Define v2.1: minimal explicit typing-phase state machine
  // Single source of truth for the shipped flow:
  //   typeWord -> choosePa -> done
  // NOTE: legacy phases (revealPa/typeDef) still exist in-file but are unreachable.

  function isValidTypeDefineTypingPhase(p) {
    return (p === "typeWord" || p === "choosePa" || p === "done");
  }

  function typeDefineGetTypingPhase() {
    if (!typeDefineSession) return "typeWord";
    var p = String(typeDefineSession.typingPhase || "typeWord");
    if (!isValidTypeDefineTypingPhase(p)) {
      try {
        if (!typeDefineSession._warnedInvalidTypingPhase) {
          typeDefineSession._warnedInvalidTypingPhase = true;
          console.warn("[Type&Define] Invalid typingPhase, normalizing to typeWord:", p);
        }
      } catch (eW) {}
      return "typeWord";
    }
    return p;
  }

  function typeDefineSetExactGuardrailVisible(isVisible) {
    var el = getEl("tadExactGuardrail");
    if (!el) return;
    if (isVisible) {
      try { el.classList.remove("is-hidden"); } catch (e0) {}
      try { el.setAttribute("aria-hidden", "false"); } catch (e1) {}
    } else {
      try { el.classList.add("is-hidden"); } catch (e2) {}
      try { el.setAttribute("aria-hidden", "true"); } catch (e3) {}
    }
  }

  function typeDefineSetHudStepText(step) {
    // Keeps HUD markup stable while allowing JS to drive the visible step.
    // If the markup isn't present, falls back to textContent.
    var el = getEl("tadPhaseIndicator");
    if (!el) return;

    var s = String(step || "type");
    if (!(s === "type" || s === "choose")) s = "type";

    var stepTypeText = (s === "type") ? "Step 1: Type the word ✍️" : "Step 2: Pick the meaning 🎯";

    try {
      var typeNode = el.querySelector ? el.querySelector('[data-step="type"]') : null;
      var chooseNode = el.querySelector ? el.querySelector('[data-step="choose"]') : null;
      if (typeNode && chooseNode) {
        var showType = (s === "type");
        if (typeNode.classList && typeNode.classList.toggle) typeNode.classList.toggle("is-hidden", !showType);
        if (chooseNode.classList && chooseNode.classList.toggle) chooseNode.classList.toggle("is-hidden", showType);
        try { typeNode.setAttribute("aria-hidden", showType ? "false" : "true"); } catch (eA0) {}
        try { chooseNode.setAttribute("aria-hidden", showType ? "true" : "false"); } catch (eA1) {}
      } else {
        el.textContent = stepTypeText;
      }
    } catch (e0) {
      try { el.textContent = stepTypeText; } catch (e1) {}
    }

    // Optional helper line under the step (kept subtle and safe).
    try {
      var hud = getEl("tadHud");
      if (hud && hud.querySelectorAll) {
        var helpers = hud.querySelectorAll('.tad-phase-helper__text[data-step]');
        for (var i = 0; i < helpers.length; i++) {
          var h = helpers[i];
          var ds = "";
          try { ds = String(h.getAttribute("data-step") || ""); } catch (eD) { ds = ""; }
          var show = (ds === s);
          try {
            if (h.classList && h.classList.toggle) h.classList.toggle("is-hidden", !show);
            h.setAttribute("aria-hidden", show ? "false" : "true");
          } catch (eH) {}
        }
      }
    } catch (e2) {}
  }

  function typeDefineApplyPhaseUI(promptEl, inputEl) {
    if (!typeDefineSession) return;
    var p = typeDefineGetTypingPhase();
    var item = typeDefineSession.item;

    // Keep TTS buttons in sync with phase and capabilities.
    typeDefineApplyAudioUI();

    // Ensure MCQ/checkpoint panels are not accidentally visible during typing.
    if (p === "typeWord" || p === "done") {
      hideTypeDefineMcqPanel();
    }

    // Prompt line + helper/intent line + placeholder depend ONLY on typingPhase.
    if (p === "typeWord") {
      typeDefineUpdateHudPhase("type");
      typeDefineSetHudStepText("type");
      typeDefineSetExactGuardrailVisible(false);
      typeDefineClearHudFeedback();
      if (inputEl) {
        inputEl.placeholder = "Type the word…";
        inputEl.disabled = false;
        try { inputEl.setAttribute("inputmode", "text"); } catch (eIM0) {}
      }

      var wordTarget = String(item && item.word ? item.word : "");
      resetRaceUIToPrompt(promptEl, inputEl, { en: wordTarget, pa: "" });
      typeDefineSetIntentLine("Type the word ✍️", "");
      renderTypeDefinePrompt(promptEl, (inputEl && inputEl.value) ? (inputEl.value || "") : "", wordTarget, (typeDefineSession.lockIndex | 0));
      setProgress(0);
      return;
    }

    if (p === "choosePa") {
      typeDefineUpdateHudPhase("choose");
      typeDefineSetHudStepText("choose");
      typeDefineSetExactGuardrailVisible(false);
      typeDefineClearHudFeedback();

      // Disable input to avoid soft keyboard + accidental typing.
      if (inputEl) {
        inputEl.placeholder = "Choose the meaning…";
        try { inputEl.blur(); } catch (eB) {}
        inputEl.disabled = true;
        try { inputEl.setAttribute("inputmode", "none"); } catch (eIM1) {}
        inputEl.value = "";
      }

      // Keep the English word visible (do not switch to Punjabi-only prompt).
      var word = String(item && item.word ? item.word : "");
      if (promptEl) {
        try {
          while (promptEl.firstChild) promptEl.removeChild(promptEl.firstChild);
        } catch (e0) {}
        promptEl.textContent = word;
      }

      typeDefineSetIntentLine("Pick the matching Punjabi meaning 🎯", "");
      typeDefineSetMcqButtonsEnabled(true);
      showTypeDefineMcqPanel();
      setProgress(0);
      return;
    }

    // done
    typeDefineUpdateHudPhase("type");
    typeDefineSetHudStepText("type");
    typeDefineSetExactGuardrailVisible(false);
    typeDefineClearHudFeedback();
    if (inputEl) {
      inputEl.placeholder = "Continuing…";
      inputEl.disabled = true;
    }
    typeDefineSetIntentLine("", "");
    setProgress(0);
  }

  function typeDefineSetTypingPhase(nextPhase, promptEl, inputEl) {
    if (!typeDefineSession) return;
    var p = String(nextPhase || "typeWord");
    if (!isValidTypeDefineTypingPhase(p)) {
      try { console.warn("[Type&Define] Attempt to set invalid typingPhase:", p); } catch (eW2) {}
      p = "typeWord";
    }
    typeDefineSession.typingPhase = p;
    typeDefineApplyPhaseUI(promptEl, inputEl);
  }

  function typeDefineSetIntentLine(text, tone) {
    var intentEl = getEl("raceIntentLine");
    if (!intentEl) return;
    intentEl.textContent = String(text || "");
    try {
      intentEl.classList.remove("is-ok");
      intentEl.classList.remove("is-warn");
    } catch (e0) {}
    if (tone === "ok") {
      try { intentEl.classList.add("is-ok"); } catch (e1) {}
    } else if (tone === "warn") {
      try { intentEl.classList.add("is-warn"); } catch (e2) {}
    }
  }

  function isSpeechSynthesisSupported() {
    try {
      return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    } catch (e0) {
      return false;
    }
  }

  function pickSpeechLang(langHint) {
    var h = String(langHint || "").toLowerCase();
    if (h === "en") return "en-US";
    if (h === "pa") return "pa-IN";
    return "en-US";
  }

  function hasSpeechVoiceForLang(langHint) {
    try {
      if (!isSpeechSynthesisSupported()) return false;
      var h = String(langHint || "").toLowerCase();
      var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      if (!voices || !voices.length) return true;

      var prefix = (h === "pa") ? "pa" : (h === "en") ? "en" : "";
      if (!prefix) return true;

      for (var i = 0; i < voices.length; i++) {
        var v = voices[i];
        var vlang = String((v && v.lang) ? v.lang : "").toLowerCase();
        if (!vlang) continue;
        if (vlang.indexOf(prefix) === 0) return true;
      }
      return false;
    } catch (e0) {
      return false;
    }
  }

  // Shared audio element for Type & Define recorded audio (prevents overlap).
  var typeDefineAudioEl = null;

  function stopTypeDefineAudio() {
    try {
      if (typeDefineAudioEl) {
        typeDefineAudioEl.pause();
        try { typeDefineAudioEl.currentTime = 0; } catch (eCT) {}
      }
    } catch (e0) {}
  }

  function playAudioUrl(url) {
    return new Promise(function(resolve) {
      try {
        var u = String(url || "").replace(/^\s+|\s+$/g, "");
        if (!u) return resolve(false);

        // Avoid overlap: cancel any ongoing speech first.
        try {
          if (window.speechSynthesis && typeof window.speechSynthesis.cancel === "function") {
            window.speechSynthesis.cancel();
          }
        } catch (eS0) {}

        if (!typeDefineAudioEl) {
          try { typeDefineAudioEl = new Audio(); } catch (eNew) { typeDefineAudioEl = null; }
          if (!typeDefineAudioEl) return resolve(false);
          try { typeDefineAudioEl.preload = "auto"; } catch (ePL) {}
        }

        // Stop any current playback before switching sources.
        stopTypeDefineAudio();

        typeDefineAudioEl.src = u;
        try { typeDefineAudioEl.load(); } catch (eL0) {}

        var p = null;
        try { p = typeDefineAudioEl.play(); } catch (eP0) { p = null; }
        if (p && typeof p.then === "function") {
          p.then(function() {
            resolve(true);
          }).catch(function() {
            resolve(false);
          });
          return;
        }

        // Older browsers: assume playback started if no exception.
        resolve(true);
      } catch (e0) {
        resolve(false);
      }
    });
  }

  // TTS helper: best-effort, user-initiated only.
  // Returns true if speech was started; false if unavailable or invalid.
  function speakText(text, langHint) {
    text = String(text || "").trim();
    if (!text) return false;
    if (!isSpeechSynthesisSupported()) return false;

    try {
      // Avoid overlap: stop any recorded audio first.
      stopTypeDefineAudio();

      // Cancel any queued/ongoing utterances so rapid clicks restart cleanly.
      try { window.speechSynthesis.cancel(); } catch (eC0) {}

      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = pickSpeechLang(langHint);

      // Best-effort voice selection: prefer exact/startsWith match if available.
      try {
        var want = String(utter.lang || "").toLowerCase();
        var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        if (voices && voices.length) {
          var chosen = null;
          for (var i = 0; i < voices.length; i++) {
            var v = voices[i];
            var vlang = String((v && v.lang) ? v.lang : "").toLowerCase();
            if (!vlang) continue;
            if (vlang === want) { chosen = v; break; }
            if (!chosen && (vlang.indexOf(want) === 0 || want.indexOf(vlang) === 0)) chosen = v;
            // Punjabi fallback: if pa-IN unavailable, accept pa-*
            if (!chosen && (want.indexOf("pa") === 0) && (vlang.indexOf("pa") === 0)) chosen = v;
          }
          if (chosen) utter.voice = chosen;
        } else {
          // If voices aren't loaded yet, still attempt with lang.
          if (String(langHint || "").toLowerCase() === "pa") utter.lang = "pa";
        }
      } catch (eV0) {
        // no-op
      }

      window.speechSynthesis.speak(utter);
      return true;
    } catch (e0) {
      try { window.speechSynthesis.cancel(); } catch (e1) {}
      return false;
    }
  }

  function typeDefineSetAudioButtonState(btn, isVisible, isEnabled, titleText) {
    if (!btn) return;
    var show = (isVisible === true);
    var enable = (isEnabled === true);
    try {
      if (btn.classList && btn.classList.toggle) btn.classList.toggle("is-hidden", !show);
    } catch (e0) {}
    try { btn.disabled = !(enable && show); } catch (e1) {}
    try { btn.setAttribute("aria-hidden", show ? "false" : "true"); } catch (e2) {}
    try { btn.setAttribute("aria-disabled", (enable && show) ? "false" : "true"); } catch (e3) {}
    try { btn.title = String(titleText || ""); } catch (e4) {}
  }

  function typeDefineApplyAudioUI() {
    var speakWordBtn = getEl("tadSpeakWordBtn");
    var speakMeaningBtn = getEl("tadSpeakMeaningBtn");

    // Only meaningful when Type & Define session is active.
    if (!typeDefineSession || typeDefineSession.active !== true) {
      typeDefineSetAudioButtonState(speakWordBtn, false, false, "");
      typeDefineSetAudioButtonState(speakMeaningBtn, false, false, "");
      return;
    }

    var supportedTts = isSpeechSynthesisSupported();

    var p = typeDefineGetTypingPhase();
    var item = typeDefineSession.item || {};
    var hasWord = !!String(item.word || "").trim();
    var hasDefinition = !!String(item.defEn || "").trim();

    var hasAudioEn = !!String(item.audioEnUrl || "").replace(/^\s+|\s+$/g, "");
    var hasAudioDefEn = !!String(item.audioDefEnUrl || "").replace(/^\s+|\s+$/g, "");

    var hasEnglishVoice = hasSpeechVoiceForLang("en");

    var canWord = hasWord && (hasAudioEn || (supportedTts && hasEnglishVoice));
    var canMeaning = hasDefinition && (hasAudioDefEn || (supportedTts && hasEnglishVoice));
    var unavailableTitle = "Audio not available";

    if (p === "typeWord") {
      typeDefineSetAudioButtonState(speakWordBtn, true, canWord, canWord ? "Play English word audio" : unavailableTitle);
      typeDefineSetAudioButtonState(speakMeaningBtn, true, canMeaning, canMeaning ? "Play English definition audio" : unavailableTitle);
      return;
    }

    if (p === "choosePa") {
      typeDefineSetAudioButtonState(speakWordBtn, true, canWord, canWord ? "Play English word audio" : unavailableTitle);
      typeDefineSetAudioButtonState(speakMeaningBtn, true, canMeaning, canMeaning ? "Play English definition audio" : unavailableTitle);
      return;
    }

    // done / any other phase
    typeDefineSetAudioButtonState(speakWordBtn, false, false, "");
    typeDefineSetAudioButtonState(speakMeaningBtn, false, false, "");
  }

  function typeDefineClearHudFeedback() {
    var el = getEl("tadFeedbackText");
    if (!el) return;
    try { el.textContent = ""; } catch (e0) {}
    try { el.classList.remove("is-visible"); } catch (e1) {}
    try { el.setAttribute("aria-hidden", "true"); } catch (e2) {}
  }

  function typeDefineShowHudFeedback(text, ms) {
    var el = getEl("tadFeedbackText");
    if (!el) return;

    if (typeDefineSession) {
      try {
        if (typeDefineSession.hudFeedbackTimerId) clearTimeout(typeDefineSession.hudFeedbackTimerId);
      } catch (eT0) {}
      typeDefineSession.hudFeedbackTimerId = null;
    }

    try { el.textContent = String(text || ""); } catch (e0) {}
    try { el.classList.add("is-visible"); } catch (e1) {}
    try { el.setAttribute("aria-hidden", "false"); } catch (e2) {}

    ms = (typeof ms === "number" && isFinite(ms)) ? (ms | 0) : 0;
    if (ms > 0 && typeDefineSession) {
      typeDefineSession.hudFeedbackTimerId = setTimeout(function() {
        try {
          if (!typeDefineSession || typeDefineSession.active !== true) return;
          typeDefineClearHudFeedback();
        } catch (eT1) {}
      }, ms);
    }
  }

  function typeDefineSetMcqButtonsEnabled(isEnabled) {
    var wrap = getEl("tadChoices");
    if (!wrap || !wrap.querySelectorAll) return;
    var btns = wrap.querySelectorAll("button[data-tad-choice]");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!b) continue;
      try { b.disabled = !(isEnabled === true); } catch (e0) {}
      try { b.setAttribute("aria-disabled", (isEnabled === true) ? "false" : "true"); } catch (e1) {}
    }
  }

  function typeDefineBeginDefinitionPhase(promptEl, inputEl) {
    // v2.1: definition typing is no longer part of the active Type & Define loop.
    // Keep this legacy function as a safe redirect so no caller can re-enter "typeDef".
    if (!typeDefineSession || !typeDefineSession.item) return;
    typeDefineBeginMcqPhase(promptEl, inputEl, typeDefineSession.typedCorrect === true);
  }

  function typeDefineAdvanceAfterTypedWord(promptEl, inputEl, typedWasCorrect) {
    if (!typeDefineSession || !typeDefineSession.item) return;
    // v2.1: immediately transition to MCQ meaning choice.
    typeDefineBeginMcqPhase(promptEl, inputEl, typedWasCorrect === true);
  }

  function typeDefineTrySubmitDefinition(typed, promptEl, inputEl) {
    if (!typeDefineSession || typeDefineGetTypingPhase() !== "typeDef" || !typeDefineSession.item) {
      try { console.warn("[Type&Define] submitDefinition with unexpected typingPhase", typeDefineSession ? typeDefineSession.typingPhase : null); } catch (eW) {}
      return;
    }
    if (typeDefineSession._submitting) return;
    typeDefineSession._submitting = true;

    var target = String(typeDefineSession.defTarget || "");
    var v = String(typed || "");
    if (v.length > target.length) v = v.slice(0, target.length);

    if (v.length < target.length) {
      typeDefineSession._submitting = false;
      return;
    }

    var item = typeDefineSession.item;
    var wid = String(item.id || item.word || "");

    if (v === target) {
      var fullClear = (typeDefineSession.typedCorrect === true);
      var checkpointDue = false;

      // Review Mistakes mode: once a card is completed, clear its stored miss counters.
      // This keeps the review queue shrinking over time.
      if (typeDefineSession.reviewMistakes === true) {
        var stClearAny = typeDefineEnsureWordStat(wid);
        stClearAny.typeMiss = 0;
        stClearAny.mcqMiss = 0;
        stClearAny.defMiss = 0;
        typeDefineSaveStats();
        typeDefineHotClearIfPresent(wid);
      }

      // Type & Define: award small, capped practice XP into the profile level system.
      // Uses State.awardTypingPracticeXp (daily cap + idempotent keys) to prevent farming.
      try {
        if (window.State && typeof State.awardTypingPracticeXp === "function") {
          var widKey = normalizeTypingXpKeyPart(wid || (item && item.word ? item.word : ""));
          var key = "typing:typeDefine:" + widKey;
          State.awardTypingPracticeXp(1, { key: key, reason: "typing_type_define_card" });
        }
      } catch (eTDXP) {}

      if (fullClear) {
        checkpointDue = typeDefineRecordFullClear(item);
        typeDefineSession.doubleClearStreak = (typeDefineSession.doubleClearStreak | 0) + 1;
        if ((typeDefineSession.doubleClearStreak | 0) > (typeDefineSession.bestDoubleClearStreak | 0)) {
          typeDefineSession.bestDoubleClearStreak = (typeDefineSession.doubleClearStreak | 0);
        }
        typeDefineHotClearIfPresent(wid);
      } else {
        typeDefineSession.doubleClearStreak = 0;
      }

      typeDefineUpdateDoubleClearStreakUi();
      typeDefineSession.step = (typeDefineSession.step | 0) + 1;
      typeDefineSession._submitting = false;

      if (checkpointDue) {
        typeDefineShowCheckpoint(promptEl, inputEl);
        return;
      }

      typeDefineSetTypingPhase("done", promptEl, inputEl);
      typeDefineServeItem(promptEl, inputEl);
      return;
    }

    // Definition miss: strict exact. Allow N attempts, then reveal answer + record defMiss once.
    typeDefineSession.defAttempts = (typeDefineSession.defAttempts | 0) + 1;
    var remaining = TYPE_DEFINE_DEF_FAIL_LIMIT - (typeDefineSession.defAttempts | 0);

    if (remaining > 0) {
      toast("Definition must match exactly (" + String(remaining) + " more tries)");
      if (inputEl) {
        inputEl.value = "";
        try { inputEl.focus(); } catch (e3) {}
      }
      typeDefineSession.prevValue = "";
      typeDefineSession.lockIndex = -1;
      typeDefineSyncTutorHint(-1);
      renderTypeDefinePrompt(promptEl, "", target, -1);
      setProgress(0);
      typeDefineSession._submitting = false;
      return;
    }

    // Final failure: reveal expected answer, increment defMiss, then allow progression.
    var st = typeDefineEnsureWordStat(wid);
    st.defMiss += 1;
    typeDefineSaveStats();
    typeDefineHotMiss(wid);

    // Break double-clear streak (no full clear).
    typeDefineSession.doubleClearStreak = 0;
    typeDefineUpdateDoubleClearStreakUi();

    toast("Answer: " + target);
    typeDefineSetTypingPhase("done", promptEl, inputEl);
    if (inputEl) {
      inputEl.disabled = true;
      inputEl.value = target;
    }
    if (promptEl) {
      renderTypeDefinePrompt(promptEl, target, target, -1);
    }
    setProgress(100);

    typeDefineSession._submitting = false;
    setTimeout(function() {
      if (!typeDefineSession || typeDefineSession.active !== true) return;
      typeDefineServeItem(promptEl, inputEl);
    }, TYPE_DEFINE_DEF_REVEAL_MS);
  }

  function typeDefineLoadStats() {
    try {
      if (window.State && typeof State.getTypeDefineStats === "function") return State.getTypeDefineStats();
    } catch (e0) {}
    return { v: 2, wordStats: {} };
  }

  function typeDefineSaveStats() {
    try {
      if (window.State && typeof State.saveTypeDefineStats === "function") {
        State.saveTypeDefineStats(typeDefineStats || { v: 2, wordStats: {} });
      }
    } catch (e0) {}
  }

  function typeDefineEnsureWordStat(wordId) {
    if (!typeDefineStats) typeDefineStats = { v: 2, wordStats: {} };
    if (!typeDefineStats.wordStats || typeof typeDefineStats.wordStats !== "object") typeDefineStats.wordStats = {};
    var ws = typeDefineStats.wordStats;
    var id = String(wordId || "");
    if (!id) id = "__unknown";
    var s = ws[id];
    if (!s || typeof s !== "object") s = { seen: 0, typeMiss: 0, mcqMiss: 0, defMiss: 0, lastSeenAt: 0 };
    if (typeof s.seen !== "number" || !isFinite(s.seen)) s.seen = 0;
    if (typeof s.typeMiss !== "number" || !isFinite(s.typeMiss)) s.typeMiss = 0;
    // Backward compatibility: if older shapes still have meaningMiss, map it into mcqMiss.
    if (typeof s.mcqMiss !== "number" || !isFinite(s.mcqMiss)) {
      var mm = s.meaningMiss;
      s.mcqMiss = (typeof mm === "number" && isFinite(mm)) ? mm : (+mm || 0);
      if (!isFinite(s.mcqMiss) || s.mcqMiss < 0) s.mcqMiss = 0;
    }
    if (typeof s.defMiss !== "number" || !isFinite(s.defMiss)) s.defMiss = 0;
    if (typeof s.lastSeenAt !== "number" || !isFinite(s.lastSeenAt)) s.lastSeenAt = 0;
    ws[id] = s;
    return s;
  }

  function typeDefineFirstMismatchIndex(typed, target) {
    typed = String(typed || "");
    target = String(target || "");
    var n = Math.min(typed.length, target.length);
    for (var i = 0; i < n; i++) {
      if (typed.charAt(i) !== target.charAt(i)) return i;
    }
    return -1;
  }

  function renderTypeDefinePrompt(promptEl, typed, target, lockIndex) {
    renderPromptWithHighlight(promptEl, typed, target);
    if (!promptEl) return;
    var idx = (typeof lockIndex === "number" && isFinite(lockIndex)) ? (lockIndex | 0) : -1;
    if (idx < 0) return;
    try {
      var spans = promptEl.querySelectorAll ? promptEl.querySelectorAll("span") : null;
      if (!spans || idx >= spans.length) return;
      if (spans[idx] && spans[idx].classList && spans[idx].classList.add) spans[idx].classList.add("tad-first-wrong");
    } catch (e0) {}
  }

  function clearTypeDefineMcqTimers() {
    if (!typeDefineSession) return;
    try { if (typeDefineSession.mcqTimerId) clearTimeout(typeDefineSession.mcqTimerId); } catch (e0) {}
    try { if (typeDefineSession.mcqTickId) clearInterval(typeDefineSession.mcqTickId); } catch (e1) {}
    try { if (typeDefineSession.mcqFlashTimerId) clearTimeout(typeDefineSession.mcqFlashTimerId); } catch (e2) {}
    try { if (typeDefineSession.mcqRetryEnableTimerId) clearTimeout(typeDefineSession.mcqRetryEnableTimerId); } catch (e3) {}
    try { if (typeDefineSession.hudFeedbackTimerId) clearTimeout(typeDefineSession.hudFeedbackTimerId); } catch (e4) {}
    typeDefineSession.mcqTimerId = null;
    typeDefineSession.mcqTickId = null;
    typeDefineSession.mcqFlashTimerId = null;
    typeDefineSession.mcqRetryEnableTimerId = null;
    typeDefineSession.hudFeedbackTimerId = null;
  }

  function hideTypeDefineMcqPanel() {
    var panel = getEl("tadMcqPanel");
    if (!panel) return;
    try { panel.classList.add("is-hidden"); } catch (e0) {}
    try { panel.setAttribute("aria-hidden", "true"); } catch (e1) {}
  }

  function showTypeDefineMcqPanel() {
    var panel = getEl("tadMcqPanel");
    if (!panel) return;
    try { panel.classList.remove("is-hidden"); } catch (e0) {}
    try { panel.setAttribute("aria-hidden", "false"); } catch (e1) {}
  }

  function hideTypeDefineCheckpointPanel() {
    var panel = getEl("tadCheckpointPanel");
    if (!panel) return;
    try { panel.classList.add("is-hidden"); } catch (e0) {}
    try { panel.setAttribute("aria-hidden", "true"); } catch (e1) {}
  }

  function showTypeDefineCheckpointPanel() {
    var panel = getEl("tadCheckpointPanel");
    if (!panel) return;
    try { panel.classList.remove("is-hidden"); } catch (e0) {}
    try { panel.setAttribute("aria-hidden", "false"); } catch (e1) {}
  }

  function typeDefineRenderCheckpointList(items) {
    var listEl = getEl("tadCheckpointList");
    if (!listEl) return;

    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);

    items = Array.isArray(items) ? items : [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i] || {};
      var word = String(it.word || "");
      var def = String(it.def || "");

      var row = document.createElement("div");
      row.className = "tad-checkpoint-item";

      var w = document.createElement("div");
      w.className = "tad-checkpoint-word";
      w.textContent = word;

      var d = document.createElement("div");
      d.className = "tad-checkpoint-def";
      d.textContent = def;

      row.appendChild(w);
      row.appendChild(d);
      listEl.appendChild(row);
    }
  }

  function typeDefineRecordFullClear(item) {
    if (!typeDefineSession) return false;

    typeDefineSession.fullClearCount = (typeDefineSession.fullClearCount | 0) + 1;
    if (!Array.isArray(typeDefineSession.recentFullClears)) typeDefineSession.recentFullClears = [];

    var word = String(item && item.word ? item.word : "");
    var def = "";
    try { def = String(item && item.defEn ? item.defEn : ""); } catch (e0) { def = ""; }
    def = def.replace(/^\s+|\s+$/g, "");
    if (!def) def = "A word you practiced today.";
    if (!word) word = "(word)";

    typeDefineSession.recentFullClears.push({ word: word, def: def });
    if (typeDefineSession.recentFullClears.length > 10) {
      typeDefineSession.recentFullClears = typeDefineSession.recentFullClears.slice(-10);
    }

    var n = (typeDefineSession.fullClearCount | 0);
    return (n > 0) && (n % 10 === 0);
  }

  function typeDefineShowCheckpoint(promptEl, inputEl) {
    if (!typeDefineSession) return;

    typeDefineSession.phase = "checkpoint";
    clearTypeDefineMcqTimers();
    hideTypeDefineMcqPanel();

    if (inputEl) {
      try { inputEl.blur(); } catch (e0) {}
      inputEl.disabled = true;
    }

    try { state.running = false; } catch (e1) {}

    var titleEl = getEl("tadCheckpointTitle");
    if (titleEl) titleEl.textContent = "Checkpoint!";

    var list = Array.isArray(typeDefineSession.recentFullClears) ? typeDefineSession.recentFullClears.slice(0) : [];
    typeDefineRenderCheckpointList(list);
    showTypeDefineCheckpointPanel();

    // Best-effort: focus Continue (avoid surprise focus on coarse pointers)
    var isCoarsePointer = false;
    try { isCoarsePointer = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch (eCP) {}
    if (!isCoarsePointer) {
      setTimeout(function() {
        try {
          if (!typeDefineSession || typeDefineSession.phase !== "checkpoint") return;
          var btn = getEl("tadCheckpointContinueBtn");
          if (btn && btn.focus) btn.focus();
        } catch (e2) {}
      }, 0);
    }
  }

  function typeDefineSetHudVisible(isVisible) {
    var hud = getEl("tadHud");
    if (!hud) return;
    if (isVisible) {
      try { hud.classList.remove("is-hidden"); } catch (e0) {}
      try { hud.setAttribute("aria-hidden", "false"); } catch (e1) {}
    } else {
      try { hud.classList.add("is-hidden"); } catch (e2) {}
      try { hud.setAttribute("aria-hidden", "true"); } catch (e3) {}
    }
  }

  function typeDefineUpdateHudPhase(phase) {
    var el = getEl("tadPhaseIndicator");
    if (!el) return;
    var p = String(phase || "type");
    if (!(p === "type" || p === "choose" || p === "def")) p = "type";
    try { el.setAttribute("data-phase", p); } catch (e0) {}
  }

  function typeDefineUpdateHudProgress() {
    var el = getEl("tadProgressIndicator");
    if (!el || !typeDefineSession) return;
    var x = (typeDefineSession.cardsServed | 0);
    var y = (typeDefineSession.totalPlanned | 0);
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    el.textContent = "Word " + String(x) + " of " + String(y);
  }

  function typeDefineUpdateDoubleClearStreakUi() {
    var el = getEl("tadDoubleClearStreak");
    if (!el) return;
    var streak = 0;
    try {
      if (typeDefineSession && typeDefineSession.doubleClearStreak != null) {
        streak = (typeDefineSession.doubleClearStreak | 0);
      }
    } catch (e0) { streak = 0; }
    if (streak < 0) streak = 0;
    el.textContent = "Combo " + String(streak) + " 🔥";
    try {
      if (el.classList && el.classList.toggle) el.classList.toggle("is-active", streak > 0);
    } catch (e1) {}
  }

  function typeDefineSetBossBadgeState(isBoss, isFailed) {
    var el = getEl("tadBossBadge");
    if (!el) return;
    var show = (isBoss === true);
    if (!show) {
      try { el.classList.add("is-hidden"); } catch (e0) {}
      try { el.classList.remove("is-failed"); } catch (e1) {}
      try { el.setAttribute("aria-hidden", "true"); } catch (e2) {}
      try { el.textContent = "Boss Round"; } catch (e3) {}
      return;
    }
    try { el.classList.remove("is-hidden"); } catch (e4) {}
    try { el.setAttribute("aria-hidden", "false"); } catch (e5) {}
    try {
      if (el.classList && el.classList.toggle) el.classList.toggle("is-failed", isFailed === true);
    } catch (e6) {}
    try { el.textContent = (isFailed === true) ? "Boss Failed" : "Boss Round"; } catch (e7) {}
  }

  function typeDefineSetTutorHintVisible(isVisible) {
    var el = getEl("tadTutorHint");
    if (!el) return;
    if (isVisible) {
      try { el.classList.remove("is-hidden"); } catch (e0) {}
      try { el.setAttribute("aria-hidden", "false"); } catch (e1) {}
    } else {
      try { el.classList.add("is-hidden"); } catch (e2) {}
      try { el.setAttribute("aria-hidden", "true"); } catch (e3) {}
    }
  }

  function typeDefineSyncTutorHint(lockIndex) {
    if (!typeDefineSession) {
      typeDefineSetTutorHintVisible(false);
      return;
    }
    var idx = (typeof lockIndex === "number" && isFinite(lockIndex)) ? (lockIndex | 0) : (typeDefineSession.lockIndex | 0);
    var show = (typeDefineSession.stopOnError === true) && (idx != null) && (idx >= 0);
    typeDefineSetTutorHintVisible(!!show);
  }

  function typeDefineFocusFirstMcqChoiceSoon() {
    // Accessibility: when MCQ opens, move focus to the first enabled choice.
    // Best-effort only; do not force focus on coarse pointers.
    var isCoarsePointer = false;
    try { isCoarsePointer = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch (eCP) {}
    if (isCoarsePointer) return;

    setTimeout(function() {
      try {
        if (!typeDefineSession || typeDefineSession.phase !== "mcq") return;
        var wrap = getEl("tadChoices");
        if (!wrap || !wrap.querySelectorAll) return;
        var btns = wrap.querySelectorAll("button[data-tad-choice]");
        for (var i = 0; i < btns.length; i++) {
          var b = btns[i];
          if (!b || b.disabled) continue;
          if (b.focus) b.focus();
          break;
        }
      } catch (e0) {}
    }, 0);
  }

  function cancelTypeDefineSession() {
    if (!typeDefineSession) return;
    try { typeDefineSession.active = false; } catch (e0) {}
    clearTypeDefineMcqTimers();

    // Cleanup: stop any ongoing audio/TTS.
    try { stopTypeDefineAudio(); } catch (eA0) {}
    try {
      if (window.speechSynthesis && typeof window.speechSynthesis.cancel === "function") {
        window.speechSynthesis.cancel();
      }
    } catch (eA1) {}

    // Cleanup: if focus is inside the MCQ panel, blur it before hiding.
    try {
      var panel = getEl("tadMcqPanel");
      var ae = document && document.activeElement;
      if (panel && ae && panel.contains && panel.contains(ae) && ae.blur) ae.blur();
    } catch (eBlur) {}

    hideTypeDefineMcqPanel();
    hideTypeDefineCheckpointPanel();
    typeDefineSetHudVisible(false);
    // Dev-only: hide diagnostics panel on exit.
    try { if (typeDefineIsDevOn()) typeDefineSetDevPanelVisible(false); } catch (eDev0) {}
    typeDefineSetTutorHintVisible(false);
    typeDefineUpdateDoubleClearStreakUi();
    typeDefineSetBossBadgeState(false, false);
    typeDefineSession = null;
    typeDefineStats = null;
  }

  function typeDefineHotGapByStage(stage) {
    stage = (typeof stage === "number" && isFinite(stage)) ? (stage | 0) : 0;
    if (stage <= 0) return 3;
    if (stage === 1) return 8;
    return 20;
  }

  function typeDefineHotMiss(wordId) {
    if (!typeDefineSession) return;
    if (!typeDefineSession.hotlist || typeof typeDefineSession.hotlist !== "object") typeDefineSession.hotlist = {};
    var id = String(wordId || "");
    if (!id) return;

    var h = typeDefineSession.hotlist[id];
    if (!h || typeof h !== "object") {
      h = { stage: 0, dueAtStep: 0, clearedStreak: 0 };
    } else {
      h.stage = (typeof h.stage === "number" && isFinite(h.stage)) ? (h.stage | 0) : 0;
      if (h.stage < 2) h.stage += 1;
    }

    h.clearedStreak = 0;
    h.dueAtStep = (typeDefineSession.step | 0) + typeDefineHotGapByStage(h.stage);
    typeDefineSession.hotlist[id] = h;
  }

  function typeDefineHotClearIfPresent(wordId) {
    if (!typeDefineSession || !typeDefineSession.hotlist) return;
    var id = String(wordId || "");
    if (!id) return;
    var h = typeDefineSession.hotlist[id];
    if (!h || typeof h !== "object") return;

    h.clearedStreak = (typeof h.clearedStreak === "number" && isFinite(h.clearedStreak)) ? (h.clearedStreak | 0) : 0;
    h.clearedStreak += 1;
    if (h.clearedStreak >= 2) {
      try { delete typeDefineSession.hotlist[id]; } catch (e0) {}
      return;
    }

    // Decision locked: second clear retest scheduled at step+8
    h.dueAtStep = (typeDefineSession.step | 0) + 8;
    typeDefineSession.hotlist[id] = h;
  }

  function typeDefinePickNextItem() {
    if (!typeDefineSession) return null;
    var stepNow = (typeDefineSession.step | 0);
    var hot = typeDefineSession.hotlist || {};
    var byId = typeDefineSession.vocabById || {};
    var lastId = "";
    try { lastId = String(typeDefineSession.lastItemId || ""); } catch (eL0) { lastId = ""; }

    // Serve due hotlist items first (anti-fatigue: max 2 hot items consecutively)
    if ((typeDefineSession.hotInARow | 0) < 2) {
      var dueId = "";
      var dueMin = 1e9;
      for (var k in hot) {
        if (!hot.hasOwnProperty(k)) continue;
        var h = hot[k];
        if (!h || typeof h !== "object") continue;
        var due = (typeof h.dueAtStep === "number" && isFinite(h.dueAtStep)) ? (h.dueAtStep | 0) : 0;
        var candId = String(k);
        if (candId && lastId && candId === lastId) continue;
        if (due <= stepNow && due < dueMin) {
          dueMin = due;
          dueId = candId;
        }
      }
      if (dueId && byId[dueId]) {
        typeDefineSession.hotInARow = (typeDefineSession.hotInARow | 0) + 1;
        try { typeDefineSession._lastPickSource = "hotlist"; } catch (eSrc0) {}
        return byId[dueId];
      }
    }

    // Otherwise serve from main queue
    typeDefineSession.hotInARow = 0;
    if (typeDefineSession.mainQueue && typeDefineSession.mainQueue.length) {
      // Defensive: avoid back-to-back repeats.
      var first = typeDefineSession.mainQueue.shift();
      if (first) {
        var fid = "";
        try { fid = String(first.id || first.word || ""); } catch (eF0) { fid = ""; }
        if (lastId && fid && fid === lastId && typeDefineSession.mainQueue.length) {
          // Rotate once.
          typeDefineSession.mainQueue.push(first);
          try { typeDefineSession._lastPickSource = (typeDefineSession.reviewMistakes === true) ? "review" : "normal"; } catch (eSrc1) {}
          return typeDefineSession.mainQueue.shift();
        }
      }

      try { typeDefineSession._lastPickSource = (typeDefineSession.reviewMistakes === true) ? "review" : "normal"; } catch (eSrc2) {}
      return first;
    }

    // If main queue empty but hotlist exists, serve the soonest-due item (even if not due yet)
    var soonId = "";
    var soonMin = 1e9;
    for (var j in hot) {
      if (!hot.hasOwnProperty(j)) continue;
      var hj = hot[j];
      if (!hj || typeof hj !== "object") continue;
      var duej = (typeof hj.dueAtStep === "number" && isFinite(hj.dueAtStep)) ? (hj.dueAtStep | 0) : 0;
      var candJ = String(j);
      if (candJ && lastId && candJ === lastId) continue;
      if (duej < soonMin) {
        soonMin = duej;
        soonId = candJ;
      }
    }
    if (soonId && byId[soonId]) {
      typeDefineSession.hotInARow = (typeDefineSession.hotInARow | 0) + 1;
      return byId[soonId];
    }

    return null;
  }

  function typeDefineServeItem(promptEl, inputEl) {
    if (!typeDefineSession) return;
    clearTypeDefineMcqTimers();
    hideTypeDefineMcqPanel();
    hideTypeDefineCheckpointPanel();

    // Stop after a fixed number of cards for this session.
    var planned = (typeDefineSession.totalPlanned | 0);
    if (planned <= 0) planned = TYPE_DEFINE_MATCH_TOTAL_CARDS;
    if ((typeDefineSession.cardsServed | 0) >= planned) {
      toast("Done");
      cancelTypeDefineSession();
      showScreenSafe("screen-typing-center");
      refreshTypingCenterUI();
      return;
    }

    // Start each new card at the word-typing phase.
    typeDefineUpdateHudPhase("type");

    var item = typeDefinePickNextItem();
    if (!item) {
      toast("Done");
      cancelTypeDefineSession();
      showScreenSafe("screen-typing-center");
      refreshTypingCenterUI();
      return;
    }

    // Dev-only diagnostics: compute based on pre-serve stats (so the score reflects selection time).
    var devDue = null;
    var devSrc = "normal";
    if (typeDefineIsDevOn()) {
      try {
        devSrc = String(typeDefineSession && typeDefineSession._lastPickSource ? typeDefineSession._lastPickSource : (typeDefineSession && typeDefineSession.reviewMistakes === true ? "review" : "normal"));
      } catch (eDS0) { devSrc = "normal"; }
      try {
        var now0 = Date.now ? Date.now() : (new Date()).getTime();
        devDue = typeDefineComputeDueInfo(item, typeDefineStats, now0);
      } catch (eDD0) { devDue = null; }
    }

    typeDefineSession.phase = "typing";
    typeDefineSession.typingPhase = "typeWord";
    typeDefineSession.item = item;
    typeDefineSession.retryUsed = false;
    typeDefineSession.mcqResolved = false;
    typeDefineSession.lockIndex = -1;
    typeDefineSession.prevValue = "";
    typeDefineSession._submitting = false;
    typeDefineSession.typedCorrect = false;
    typeDefineSession.defTarget = "";
    typeDefineSession.defAttempts = 0;

    typeDefineSyncTutorHint(-1);

    typeDefineSession.cardsServed = (typeDefineSession.cardsServed | 0) + 1;
    typeDefineUpdateHudProgress();

    var wid = String(item.id || item.word || "");
    try { typeDefineSession.lastItemId = wid; } catch (eLast) {}
    var st = typeDefineEnsureWordStat(wid);
    st.seen += 1;
    st.lastSeenAt = Date.now ? Date.now() : (new Date()).getTime();
    typeDefineSaveStats();

    // Dev-only: update panel after item is staged.
    if (devDue) {
      try { typeDefineUpdateDevPanel(item, devDue, devSrc); } catch (eDP0) {}
    }

    // Phase-driven rendering/placeholder.
    if (inputEl) inputEl.value = "";
    typeDefineSetTypingPhase("typeWord", promptEl, inputEl);

    var isCoarsePointer = false;
    try { isCoarsePointer = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch (eCP) {}

    state.running = true;
    runState.finished = false;
    if (inputEl) {
      inputEl.disabled = false;
      if (!isCoarsePointer) {
        try { inputEl.focus(); } catch (e0) {}
      }
    }

    // typeDefineSetTypingPhase() already renders the phase UI.
  }

  function typeDefineBeginMcqPhase(promptEl, inputEl, typedWasCorrect) {
    if (!typeDefineSession || !typeDefineSession.item) return;
    typeDefineSession.phase = "mcq";
    typeDefineSession.mcqResolved = false;
    typeDefineSession.typedCorrect = (typedWasCorrect === true);

    // Clear any pending MCQ timers/feedback from the previous card.
    clearTypeDefineMcqTimers();
    typeDefineClearHudFeedback();

    // Enter choosePa typingPhase (input disabled; MCQ drives progression).
    typeDefineSession.typingPhase = "choosePa";

    // Sync TTS buttons for the Choose step.
    try { typeDefineApplyAudioUI(); } catch (eAU0) {}

    typeDefineUpdateHudPhase("choose");
    typeDefineSetHudStepText("choose");
    typeDefineSetTutorHintVisible(false);

    if (inputEl) {
      try { inputEl.blur(); } catch (e0) {}
      inputEl.disabled = true;
      inputEl.value = "";
    }

    // Keep the English word visible in the prompt.
    try {
      var item0 = typeDefineSession.item;
      var w0 = String(item0 && item0.word ? item0.word : "");
      if (promptEl) {
        while (promptEl.firstChild) promptEl.removeChild(promptEl.firstChild);
        promptEl.textContent = w0;
      }
    } catch (eP0) {}

    var item = typeDefineSession.item;
    var wrap = getEl("tadChoices");
    if (wrap && wrap.querySelectorAll) {
      var btns = wrap.querySelectorAll("button[data-tad-choice]");
      for (var i = 0; i < btns.length; i++) {
        try {
          btns[i].textContent = String((item.choicesPa && item.choicesPa[i]) ? item.choicesPa[i] : "");
          btns[i].disabled = false;
          try { btns[i].setAttribute("aria-disabled", "false"); } catch (eAD0) {}
          if (btns[i].classList && btns[i].classList.remove) {
            btns[i].classList.remove("is-correct", "is-wrong", "is-correct-answer");
          }
        } catch (e1) {}
      }
    }

    // v2.1: no auto-timeout/auto-advance; keep it kid-friendly and allow retries.
    typeDefineSession.mcqEndsAt = 0;
    var timerEl = getEl("tadMcqTimer");
    if (timerEl) timerEl.textContent = "";

    showTypeDefineMcqPanel();
    typeDefineFocusFirstMcqChoiceSoon();
  }

  function typeDefineResolveMcq(choiceIndex, isTimeout, promptEl, inputEl) {
    if (!typeDefineSession || typeDefineSession.phase !== "mcq") return;
    if (typeDefineSession.mcqResolved) return;

    var item = typeDefineSession.item;
    var correctPa = String(item && item.pa ? item.pa : "");
    var chosenPa = "";
    if (choiceIndex != null && item && item.choicesPa) {
      chosenPa = String(item.choicesPa[choiceIndex] || "");
    }
    var mcqCorrect = (!isTimeout) && (choiceIndex != null) && (chosenPa === correctPa);

    // Ignore timeouts/skips in v2.1 (no auto-advance; keep the card active).
    if (isTimeout === true || choiceIndex == null) {
      try { toast("Choose the correct meaning"); } catch (eT0) {}
      return;
    }

    var wid = String(item && (item.id || item.word) ? (item.id || item.word) : "");

    // Feedback + counters for incorrect choices (stay in MCQ and allow retries).
    if (!mcqCorrect) {
      // Prevent accidental double-taps while we show feedback.
      typeDefineSetMcqButtonsEnabled(false);

      try {
        var stMiss = typeDefineEnsureWordStat(wid);
        stMiss.mcqMiss += 1;
        typeDefineSaveStats();
        typeDefineHotMiss(wid);
      } catch (eM0) {}

      try { typeDefineSetIntentLine("Good try — pick again", "warn"); } catch (eM1) {}
      try { typeDefineShowHudFeedback("Good try — pick again", TYPE_DEFINE_MCQ_RETRY_DELAY_MS); } catch (eFB0) {}

      // Brief visual feedback on the tapped option, but do not reveal the answer.
      try {
        var wrap0 = getEl("tadChoices");
        if (wrap0 && wrap0.querySelectorAll) {
          var btns0 = wrap0.querySelectorAll("button[data-tad-choice]");
          var sel0 = (choiceIndex | 0);
          if (btns0 && sel0 >= 0 && sel0 < btns0.length && btns0[sel0] && btns0[sel0].classList) {
            btns0[sel0].classList.add("is-wrong");
            setTimeout(function() {
              try {
                if (!typeDefineSession || typeDefineSession.phase !== "mcq") return;
                btns0[sel0].classList.remove("is-wrong");
              } catch (eR) {}
            }, 350);
          }
        }
      } catch (eM2) {}

      // Re-enable options after a short delay and restore the prompt.
      clearTypeDefineMcqTimers();
      typeDefineSession.mcqRetryEnableTimerId = setTimeout(function() {
        try {
          if (!typeDefineSession || typeDefineSession.phase !== "mcq" || typeDefineSession.mcqResolved) return;
          typeDefineSetMcqButtonsEnabled(true);
          typeDefineSetIntentLine("Pick the matching Punjabi meaning 🎯", "");
          typeDefineFocusFirstMcqChoiceSoon();
        } catch (eRE0) {}
      }, TYPE_DEFINE_MCQ_RETRY_DELAY_MS);

      return;
    }

    // Correct choice: lock in, award XP, count completion, then advance.
    typeDefineSession.mcqResolved = true;
    clearTypeDefineMcqTimers();

    // Double-Clear Streak: only counts when BOTH typing and meaning are correct.
    var fullClear = (typeDefineSession.typedCorrect === true) && (mcqCorrect === true);
    var checkpointDue = false;
    if (fullClear) {
      checkpointDue = typeDefineRecordFullClear(item);
      typeDefineSession.doubleClearStreak = (typeDefineSession.doubleClearStreak | 0) + 1;
      if ((typeDefineSession.doubleClearStreak | 0) > (typeDefineSession.bestDoubleClearStreak | 0)) {
        typeDefineSession.bestDoubleClearStreak = (typeDefineSession.doubleClearStreak | 0);
      }
    } else {
      typeDefineSession.doubleClearStreak = 0;
    }
    typeDefineUpdateDoubleClearStreakUi();

    // Review Mistakes mode: once a card is completed, clear its stored miss counters.
    // This keeps the review queue shrinking over time.
    try {
      if (typeDefineSession.reviewMistakes === true) {
        var stClearAny = typeDefineEnsureWordStat(wid);
        stClearAny.typeMiss = 0;
        stClearAny.mcqMiss = 0;
        stClearAny.defMiss = 0;
        typeDefineSaveStats();
        typeDefineHotClearIfPresent(wid);
      }
    } catch (eRM0) {}

    // Award XP on successful completion (idempotent per wordId).
    try {
      if (window.State && typeof State.awardTypingPracticeXp === "function") {
        var widKey = normalizeTypingXpKeyPart(wid || (item && item.word ? item.word : ""));
        var key = "typing:typeDefine:" + widKey;
        State.awardTypingPracticeXp(1, { key: key, reason: "typing_type_define_card" });
      }
    } catch (eXP) {}

    // Clear hotlist on any correct completion (regardless of typedCorrect).
    try { typeDefineHotClearIfPresent(wid); } catch (eHC) {}

    // Immediately disable choices (prevents double tap) and apply a short feedback flash.
    typeDefineShowHudFeedback("Great job! ✨", TYPE_DEFINE_ADVANCE_DELAY_MS);
    var wrap = getEl("tadChoices");
    var btns = null;
    if (wrap && wrap.querySelectorAll) {
      btns = wrap.querySelectorAll("button[data-tad-choice]");
      for (var i = 0; i < btns.length; i++) {
        try {
          btns[i].disabled = true;
          try { btns[i].setAttribute("aria-disabled", "true"); } catch (eAD1) {}
          if (btns[i].classList && btns[i].classList.remove) {
            btns[i].classList.remove("is-correct", "is-wrong", "is-correct-answer");
          }
        } catch (e0) {}
      }
    }

    // Apply correct feedback to selected option
    try {
      if (btns && btns.length) {
        var sel = (choiceIndex | 0);
        if (sel >= 0 && sel < btns.length && btns[sel] && btns[sel].classList) {
          btns[sel].classList.add("is-correct");
        }
      }
    } catch (eFx2) {}

    try { typeDefineSetIntentLine("Great job! ✨", "ok"); } catch (eOk) {}

    // Brief flash (~350ms), then advance to the next item.
    clearTypeDefineMcqTimers();
    typeDefineSession.mcqFlashTimerId = setTimeout(function() {
      if (!typeDefineSession || typeDefineSession.active !== true) return;
      hideTypeDefineMcqPanel();
      typeDefineUpdateHudPhase("type");
      typeDefineSetHudStepText("type");
      typeDefineSession.step = (typeDefineSession.step | 0) + 1;

      if (checkpointDue) {
        typeDefineShowCheckpoint(promptEl, inputEl);
        return;
      }

      typeDefineServeItem(promptEl, inputEl);
    }, TYPE_DEFINE_ADVANCE_DELAY_MS);
  }

  function typeDefineHandleTypingInput(ev, promptEl, inputEl) {
    if (!typeDefineSession || !typeDefineSession.item) return;

    var typingPhase = typeDefineGetTypingPhase();
    var target = "";
    if (typingPhase === "typeWord") target = String(typeDefineSession.item.word || "");
    else {
      // During reveal/done phases, ignore input events.
      return;
    }
    var v = inputEl ? (inputEl.value || "") : "";
    var prev = String(typeDefineSession.prevValue || "");

    // Force cursor to end
    try { if (inputEl) inputEl.setSelectionRange(v.length, v.length); } catch (err) {}

    // cap to word length
    if (v.length > target.length) {
      v = v.slice(0, target.length);
      if (inputEl) inputEl.value = v;
    }

    // Block multi-character jumps (paste/autofill)
    if ((!ev || !ev.isComposing) && (v.length - prev.length > 1)) {
      var nextCh = v.charAt(prev.length);
      v = prev + nextCh;
      if (inputEl) inputEl.value = v;
    }

    var lockIndex = -1;

    typeDefineSession.lockIndex = lockIndex;
    typeDefineSession.prevValue = v;

    renderTypeDefinePrompt(promptEl, v, target, lockIndex);
    setProgress((v.length / Math.max(1, target.length)) * 100);

    if (v.length >= target.length) {
      if (typingPhase === "typeWord") typeDefineTrySubmitTypedWord(v, promptEl, inputEl);
    }
  }

  function typeDefineTrySubmitTypedWord(typed, promptEl, inputEl) {
    if (!typeDefineSession || typeDefineGetTypingPhase() !== "typeWord" || !typeDefineSession.item) {
      try { console.warn("[Type&Define] submitWord with unexpected typingPhase", typeDefineSession ? typeDefineSession.typingPhase : null); } catch (eW) {}
      return;
    }
    if (typeDefineSession._submitting) return;
    typeDefineSession._submitting = true;

    var target = String(typeDefineSession.item.word || "");
    var v = String(typed || "");
    if (v.length > target.length) v = v.slice(0, target.length);

    if (v.length < target.length) {
      typeDefineSession._submitting = false;
      return;
    }

    var wid = String(typeDefineSession.item.id || typeDefineSession.item.word || "");

    if (v === target) {
      typeDefineSession.prevValue = "";
      typeDefineSession.retryUsed = false;
      typeDefineAdvanceAfterTypedWord(promptEl, inputEl, true);
      typeDefineSession._submitting = false;
      return;
    }

    // Boss Round: first attempt must be correct (no quick retry).
    if (typeDefineSession.bossRound === true) {
      typeDefineSession.retryUsed = false;
      typeDefineSession.bossFailed = true;
      typeDefineSetBossBadgeState(true, true);

      // Count as typing miss immediately (same as the normal second-failure path).
      typeDefineSession.doubleClearStreak = 0;
      typeDefineUpdateDoubleClearStreakUi();

      var stBoss = typeDefineEnsureWordStat(wid);
      stBoss.typeMiss += 1;
      typeDefineSaveStats();
      typeDefineHotMiss(wid);
      typeDefineAdvanceAfterTypedWord(promptEl, inputEl, false);
      typeDefineSession._submitting = false;
      return;
    }

    // Wrong submit: one quick retry
    if (!typeDefineSession.retryUsed) {
      typeDefineSession.retryUsed = true;
      toast("Quick retry (1)");
      if (inputEl) {
        inputEl.value = "";
        try { inputEl.focus(); } catch (e0) {}
      }
      typeDefineSession.prevValue = "";
      typeDefineSession.lockIndex = -1;
      renderTypeDefinePrompt(promptEl, "", target, -1);
      typeDefineSession._submitting = false;
      return;
    }

    // Second failure: record typing miss, hotlist miss, then proceed to MCQ
    typeDefineSession.retryUsed = false;
    typeDefineSession.doubleClearStreak = 0;
    typeDefineUpdateDoubleClearStreakUi();
    var st = typeDefineEnsureWordStat(wid);
    st.typeMiss += 1;
    typeDefineSaveStats();
    typeDefineHotMiss(wid);
    typeDefineAdvanceAfterTypedWord(promptEl, inputEl, false);
    typeDefineSession._submitting = false;
  }

  function getTypingDrillData() {
    try {
      if (window.BOLO_TYPING_DRILLS_V1 && window.BOLO_TYPING_DRILLS_V1.packs) return window.BOLO_TYPING_DRILLS_V1;
    } catch (e0) {}
    return { packs: [] };
  }

  var TYPING_NGRAM_LAST_PACK_KEY = "bolo_typing_last_ngram_pack_id";
  var TYPING_PP_MODE_KEY = "bolo_typing_pp_mode_v1";
  var TYPING_CENTER_SELECTED_MODE_KEY = "bolo_typing_center_selected_mode";

  function getTypingProfileIdSafe() {
    try {
      if (window.State && typeof State._getActiveProfileIdSafe === "function") {
        return State._getActiveProfileIdSafe();
      }
    } catch (e0) {}
    try {
      if (window.State && typeof State.getActiveProfile === "function") {
        var p = State.getActiveProfile();
        if (p && p.id) return String(p.id);
      }
    } catch (e1) {}
    return "p1";
  }

  function typingProfileKey(baseKey) {
    var base = String(baseKey || "");
    if (!base) return "";
    var pid = String(getTypingProfileIdSafe() || "p1").replace(/[^a-zA-Z0-9_-]/g, "");
    if (!pid) pid = "p1";
    return base + "_" + pid;
  }

  function readLocalStorageString(key) {
    try {
      var v = localStorage.getItem(String(key || ""));
      if (v == null) return "";
      v = String(v);
      v = v.replace(/^\s+|\s+$/g, "");
      return v;
    } catch (e0) {
      return "";
    }
  }

  function writeLocalStorageString(key, value) {
    try {
      var k = String(key || "");
      var v = (value == null) ? "" : String(value);
      v = v.replace(/^\s+|\s+$/g, "");
      if (!v) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (e0) {}
  }

  function readLastNgramPackId() {
    return readLocalStorageString(TYPING_NGRAM_LAST_PACK_KEY);
  }

  function writeLastNgramPackId(packId) {
    writeLocalStorageString(TYPING_NGRAM_LAST_PACK_KEY, packId);
  }

  function normalizePpMode(mode) {
    var m = String(mode || "");
    if (m === "pairs" || m === "patterns" || m === "mix") return m;
    return "mix";
  }

  function readPpMode() {
    var raw = readLocalStorageString(TYPING_PP_MODE_KEY);
    var norm = normalizePpMode(raw);

    // Defensive: if localStorage contains an invalid value, correct it to "mix".
    // Do not write on first-run empty values.
    if (raw && raw !== norm) {
      try { writeLocalStorageString(TYPING_PP_MODE_KEY, norm); } catch (e0) {}
    }

    return norm;
  }

  function writePpMode(mode) {
    writeLocalStorageString(TYPING_PP_MODE_KEY, normalizePpMode(mode));
  }

  function ppModeToSliderValue(mode) {
    var m = normalizePpMode(mode);
    if (m === "pairs") return 0;
    if (m === "patterns") return 2;
    return 1; // mix
  }

  function sliderValueToPpMode(v) {
    var n = (typeof v === "number" && isFinite(v)) ? (v | 0) : parseInt(String(v || ""), 10);
    if (n === 0) return "pairs";
    if (n === 2) return "patterns";
    return "mix";
  }

  function readTypingCenterSelectedMode() {
    try {
      if (window.State && typeof State.getTypingDeckUiState === "function") {
        var ui = State.getTypingDeckUiState();
        var s = ui && ui.selectedMode;
        if (s === "practice" || s === "race" || s === "typeDefine") return s;
      }
    } catch (eStateRead) {}

    var m = readLocalStorageString(TYPING_CENTER_SELECTED_MODE_KEY);
    if (m === "practice" || m === "race" || m === "typeDefine") return m;
    return "";
  }

  function writeTypingCenterSelectedMode(mode) {
    var m = String(mode || "");
    if (!(m === "practice" || m === "race" || m === "typeDefine")) return;
    try {
      if (window.State && typeof State.setTypingDeckUiState === "function") {
        State.setTypingDeckUiState({ selectedMode: m });
      }
    } catch (eStateWrite) {}
    writeLocalStorageString(TYPING_CENTER_SELECTED_MODE_KEY, m);
  }

  function buildNgramQueueFromPack(pack, limit) {
    limit = (typeof limit === "number" && isFinite(limit)) ? (limit | 0) : 10;
    if (limit <= 0) limit = 10;

    // Sample from the full pack for variety (then we re-order with mild weighting).
    var raw = (pack && pack.items && pack.items.slice) ? pack.items.slice(0) : [];
    var all = [];
    for (var i = 0; i < raw.length; i++) {
      var s = raw[i];
      if (s == null) continue;
      var t = String(s).replace(/^\s+|\s+$/g, "");
      if (!t) continue;
      all.push(t);
    }

    if (!all.length) return [];
    try { shuffleInPlace(all); } catch (e0) {}
    return all.slice(0, Math.min(limit, all.length));
  }

  function getTypingWeaknessStatsSafe() {
    try {
      if (window.State && typeof State.getTypingWeaknessStats === "function") {
        return State.getTypingWeaknessStats();
      }
    } catch (e0) {}
    return { chars: {}, bigrams: {}, lastDecayAt: 0 };
  }

  function computeWeakScoreForPrompt(prompt, weakness) {
    if (!prompt) return 0;
    weakness = weakness || {};
    var cMap = weakness.chars || {};
    var bMap = weakness.bigrams || {};

    var s = String(prompt);
    var sum = 0;

    // Bigrams are the main signal for this mode.
    for (var i = 0; i < s.length - 1; i++) {
      var bi = (s.charAt(i) + s.charAt(i + 1)).toLowerCase();
      var bv = bMap[bi];
      if (typeof bv === "number" && isFinite(bv) && bv > 0) sum += bv;
    }

    // Light char signal to break ties and keep spaces honest.
    for (var j = 0; j < s.length; j++) {
      var ch = s.charAt(j);
      var ck = (ch === " ") ? "[space]" : ch.toLowerCase();
      var cv = cMap[ck];
      if (typeof cv === "number" && isFinite(cv) && cv > 0) sum += cv * 0.25;
    }

    return sum;
  }


  function hasAnyWeaknessSignal(weakness) {
    if (!weakness || typeof weakness !== "object") return false;
    var cMap = weakness.chars;
    var bMap = weakness.bigrams;

    function hasPos(map) {
      if (!map || typeof map !== "object") return false;
      for (var k in map) {
        if (!map.hasOwnProperty(k)) continue;
        var v = map[k];
        if (typeof v === "number" && isFinite(v) && v > 0) return true;
      }
      return false;
    }

    return hasPos(bMap) || hasPos(cMap);
  }

  function getCleanPackItems(pack) {
    var raw = (pack && pack.items && pack.items.slice) ? pack.items.slice(0) : [];
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var s = raw[i];
      if (s == null) continue;
      var t = String(s).replace(/^\s+|\s+$/g, "");
      if (!t) continue;
      out.push(t);
    }
    return out;
  }

  function scorePackForWeakness(pack, weakness) {
    var items = getCleanPackItems(pack);
    if (!items.length) return 0;

    var scores = [];
    for (var i = 0; i < items.length; i++) {
      scores.push(computeWeakScoreForPrompt(items[i], weakness) || 0);
    }
    scores.sort(function(a, b) { return b - a; });

    var k = Math.min(20, scores.length);
    if (k <= 0) return 0;
    var sum = 0;
    for (var j = 0; j < k; j++) sum += scores[j];
    return sum / k;
  }

  function computeReviewCandidateScore(item, weakness) {
    // Reuse the same weakness scoring used elsewhere; keep it simple.
    var sc = computeWeakScoreForPrompt(item, weakness);
    return (typeof sc === "number" && isFinite(sc)) ? sc : 0;
  }

  function getEligibleNgramPacksWithFallback(packs, ppMode) {
    var mode = normalizePpMode(ppMode);
    var eligible = getEligibleNgramPacks(packs, mode);
    if (!eligible.length && mode !== "mix") eligible = getEligibleNgramPacks(packs, "mix");
    return eligible;
  }

  function buildNgramReviewQueue(opts) {
    opts = opts || {};
    var mode = normalizePpMode(opts.ppMode);
    var totalItems = (typeof opts.totalItems === "number" && isFinite(opts.totalItems)) ? (opts.totalItems | 0) : 10;
    if (totalItems <= 0) totalItems = 10;

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];
    var eligiblePacks = getEligibleNgramPacksWithFallback(packs, mode);

    var weakness = getTypingWeaknessStatsSafe();

    // 1) Pick highest-weakness items across eligible packs.
    var candidates = [];
    for (var i = 0; i < eligiblePacks.length; i++) {
      var p = eligiblePacks[i];
      if (!p) continue;
      var items = getCleanPackItems(p);
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (!it) continue;
        var sc = computeReviewCandidateScore(it, weakness);
        if (sc > 0) candidates.push({ s: it, score: sc });
      }
    }

    // Sort highest-score first; stable tie-breaker keeps variety.
    candidates.sort(function(a, b) {
      if (!a) return 1;
      if (!b) return -1;
      if (b.score !== a.score) return b.score - a.score;
      // Prefer longer items in patterns mode.
      var la = a.s ? String(a.s).length : 0;
      var lb = b.s ? String(b.s).length : 0;
      if (mode === "patterns" && lb !== la) return lb - la;
      return Math.random() - 0.5;
    });

    var queue = [];
    var seen = {};

    for (var k = 0; k < candidates.length && queue.length < totalItems; k++) {
      var s0 = candidates[k] && candidates[k].s ? String(candidates[k].s) : "";
      if (!s0) continue;
      if (seen[s0]) continue;
      seen[s0] = true;
      queue.push(s0);
    }

    // 2) Fill remaining slots using the normal Start pack (selected > recommended).
    var fillPack = null;
    var packIdOrNull = opts.packIdOrNull ? String(opts.packIdOrNull) : "";
    if (packIdOrNull) fillPack = findPackById(packs, packIdOrNull);
    if (!fillPack) fillPack = getSelectedEligibleNgramPack(packs, mode) || pickRecommendedNgramPack(mode);
    if (!fillPack && eligiblePacks.length) fillPack = eligiblePacks[0];

    if (fillPack) {
      var fill = buildNgramQueueFromPack(fillPack, Math.max(totalItems * 3, totalItems));
      for (var f = 0; f < fill.length && queue.length < totalItems; f++) {
        var s1 = String(fill[f] || "");
        if (!s1 || seen[s1]) continue;
        seen[s1] = true;
        queue.push(s1);
      }
    }

    // 3) Last-resort fill from any eligible pack items (shuffled).
    if (queue.length < totalItems && eligiblePacks.length) {
      var pool = [];
      for (var p2 = 0; p2 < eligiblePacks.length; p2++) {
        var it2 = getCleanPackItems(eligiblePacks[p2]);
        for (var q2 = 0; q2 < it2.length; q2++) pool.push(it2[q2]);
      }
      try { shuffleInPlace(pool); } catch (eSh) {}
      for (var z = 0; z < pool.length && queue.length < totalItems; z++) {
        var s2 = String(pool[z] || "");
        if (!s2 || seen[s2]) continue;
        seen[s2] = true;
        queue.push(s2);
      }
    }

    if (queue.length > totalItems) queue = queue.slice(0, totalItems);
    return queue;
  }

  function hasNgramReviewMistakesAvailable(ppMode) {
    var weakness = getTypingWeaknessStatsSafe();
    if (!hasAnyWeaknessSignal(weakness)) return false;

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];
    if (!packs.length) return false;

    // Quick check: if any eligible item has positive weakness score.
    var eligiblePacks = getEligibleNgramPacksWithFallback(packs, ppMode);
    var checked = 0;
    var MAX_CHECK = 220;
    for (var i = 0; i < eligiblePacks.length; i++) {
      var p = eligiblePacks[i];
      if (!p) continue;
      var items = getCleanPackItems(p);
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        if (!it) continue;
        if (computeReviewCandidateScore(it, weakness) > 0) return true;
        checked += 1;
        if (checked >= MAX_CHECK) return true; // weakness exists; allow review even if we didn't hit a match quickly
      }
    }
    return false;
  }

  function mildWeightedShuffleByWeakness(queue, weakness) {
    if (!queue || !queue.length) return queue;
    var items = queue.slice(0);

    var scores = [];
    var maxScore = 0;
    for (var i = 0; i < items.length; i++) {
      var sc = computeWeakScoreForPrompt(items[i], weakness);
      scores.push(sc);
      if (sc > maxScore) maxScore = sc;
    }

    // Always add randomness; weakness just nudges ordering.
    var BIAS = 0.35; // mild
    var keyed = [];
    for (var j = 0; j < items.length; j++) {
      var norm = (maxScore > 0) ? (scores[j] / maxScore) : 0;
      var key = Math.random() - (BIAS * norm);
      keyed.push({ k: key, v: items[j] });
    }

    keyed.sort(function(a, b) { return a.k - b.k; });
    var out = [];
    for (var k = 0; k < keyed.length; k++) out.push(keyed[k].v);
    return out;
  }

  function getTopWeakBigrams(weakness, limit) {
    limit = (typeof limit === "number" && isFinite(limit)) ? (limit | 0) : 12;
    if (limit < 1) limit = 12;
    var bMap = (weakness && weakness.bigrams && typeof weakness.bigrams === "object") ? weakness.bigrams : {};
    var rows = [];
    for (var k in bMap) {
      if (!bMap.hasOwnProperty(k)) continue;
      var v = bMap[k];
      if (typeof v !== "number" || !isFinite(v) || v <= 0) continue;
      rows.push({ k: String(k), v: v });
    }
    rows.sort(function(a, b) { return (b.v || 0) - (a.v || 0); });
    var out = [];
    for (var i = 0; i < rows.length && out.length < limit; i++) out.push(rows[i].k);
    return out;
  }

  function getAllBigramsLower(s) {
    var str = String(s || "").toLowerCase();
    var out = {};
    for (var i = 0; i < str.length - 1; i++) {
      var bi = str.charAt(i) + str.charAt(i + 1);
      out[bi] = true;
    }
    return out;
  }

  function hasNearDuplicate(prevItem, nextItem, opts) {
    if (!prevItem || !nextItem) return false;
    var a = String(prevItem);
    var b = String(nextItem);
    if (a === b) return true;

    var aLower = a.toLowerCase();
    var bLower = b.toLowerCase();

    // Avoid sharing a key bigram (e.g., "th") back-to-back.
    var top = (opts && opts.topWeakBigrams) ? opts.topWeakBigrams : null;
    if (top && top.length) {
      for (var i = 0; i < top.length; i++) {
        var bi = String(top[i] || "");
        if (!bi) continue;
        if (aLower.indexOf(bi) >= 0 && bLower.indexOf(bi) >= 0) return true;
      }
    }

    // General fallback: avoid heavy overlap of bigrams for very short items.
    // Keep this light so we don't over-constrain longer patterns.
    if (aLower.length <= 3 || bLower.length <= 3) {
      var aSet = getAllBigramsLower(aLower);
      for (var j = 0; j < bLower.length - 1; j++) {
        var bj = bLower.charAt(j) + bLower.charAt(j + 1);
        if (aSet[bj]) return true;
      }
    }

    return false;
  }

  function computeNgramItemDifficulty(item, weakness, opts) {
    var s = String(item || "");
    var len = s.length;
    var w = computeWeakScoreForPrompt(s, weakness) || 0;

    // Whether this item contains any of the top weak bigrams.
    var containsTop = false;
    var top = (opts && opts.topWeakBigrams) ? opts.topWeakBigrams : null;
    if (top && top.length) {
      var lower = s.toLowerCase();
      for (var i = 0; i < top.length; i++) {
        var bi = String(top[i] || "");
        if (!bi) continue;
        if (lower.indexOf(bi) >= 0) { containsTop = true; break; }
      }
    }

    // Simple numeric score: weakness signal dominates, length nudges.
    var score = (w * 1.0) + (len >= 5 ? 1.25 : (len >= 4 ? 0.85 : (len >= 3 ? 0.45 : 0.1))) + (containsTop ? 0.75 : 0);
    if (!(score > 0)) score = 0;
    return { score: score, len: len, containsTop: containsTop };
  }

  function bucketizeDifficulty(rows) {
    // Determine low/med/high thresholds from the session's distribution.
    var scores = [];
    for (var i = 0; i < rows.length; i++) scores.push(rows[i].diff.score || 0);
    scores.sort(function(a, b) { return a - b; });
    if (!scores.length) return { t1: 0, t2: 0 };
    var p60 = scores[Math.floor(scores.length * 0.6)] || 0;
    var p85 = scores[Math.floor(scores.length * 0.85)] || 0;
    // Keep separation even when all scores are near-equal.
    var t1 = p60;
    var t2 = Math.max(p85, t1 + 0.01);
    return { t1: t1, t2: t2 };
  }

  function orderNgramQueue(queue, weaknessStats, opts) {
    if (!queue || !queue.length) return queue;
    var weakness = weaknessStats || { chars: {}, bigrams: {} };
    var items = queue.slice(0);
    var topWeakBigrams = getTopWeakBigrams(weakness, 12);
    var meta = [];

    for (var i = 0; i < items.length; i++) {
      var s = String(items[i] || "");
      meta.push({ s: s, diff: computeNgramItemDifficulty(s, weakness, { topWeakBigrams: topWeakBigrams }) });
    }

    var th = bucketizeDifficulty(meta);
    var low = [];
    var med = [];
    var high = [];
    for (var j = 0; j < meta.length; j++) {
      var r = meta[j];
      var sc = (r && r.diff) ? (r.diff.score || 0) : 0;
      if (sc >= th.t2) high.push(r);
      else if (sc >= th.t1) med.push(r);
      else low.push(r);
    }

    function pickFrom(list, prev, preferEasier, consecutiveHigh) {
      if (!list || !list.length) return null;
      // Choose a candidate that avoids near-duplicates when possible.
      // For easier preference: scan lowest-score first; otherwise highest-score first.
      list.sort(function(a, b) {
        var as = (a && a.diff) ? (a.diff.score || 0) : 0;
        var bs = (b && b.diff) ? (b.diff.score || 0) : 0;
        return preferEasier ? (as - bs) : (bs - as);
      });

      var bestIdx = -1;
      for (var i = 0; i < list.length; i++) {
        var cand = list[i];
        if (!cand) continue;
        if (prev && hasNearDuplicate(prev, cand.s, { topWeakBigrams: topWeakBigrams })) continue;
        bestIdx = i;
        break;
      }

      if (bestIdx === -1) bestIdx = 0;
      var out = list[bestIdx];
      list.splice(bestIdx, 1);
      return out;
    }

    var ordered = [];
    var prevItem = "";
    var highStreak = 0;

    for (var k = 0; k < items.length; k++) {
      var isEarly = (k < 2);
      var allowHigh = true;
      if (isEarly && (low.length || med.length)) allowHigh = false;
      if (highStreak >= 2) allowHigh = false;

      var pick = null;

      // Interleave: after a high, prefer low/med; otherwise sprinkle highs.
      if (!pick && (!allowHigh || highStreak > 0)) {
        pick = pickFrom(low, prevItem, true, highStreak) || pickFrom(med, prevItem, true, highStreak);
      }

      if (!pick && allowHigh) {
        // Add a high roughly every 3rd slot when available.
        var sprinkle = (k >= 2) && (k % 3 === 2);
        if (sprinkle) pick = pickFrom(high, prevItem, false, highStreak);
      }

      if (!pick) {
        // Default: easiest available, then medium, then high.
        pick = pickFrom(low, prevItem, true, highStreak) || pickFrom(med, prevItem, true, highStreak);
      }

      if (!pick && allowHigh) pick = pickFrom(high, prevItem, false, highStreak);
      if (!pick) pick = pickFrom(high, prevItem, false, highStreak) || pickFrom(med, prevItem, true, highStreak) || pickFrom(low, prevItem, true, highStreak);
      if (!pick) break;

      ordered.push(pick.s);
      prevItem = pick.s;

      // Update high streak.
      var isHigh = false;
      var sc0 = (pick.diff && typeof pick.diff.score === "number") ? pick.diff.score : 0;
      if (sc0 >= th.t2) isHigh = true;
      if (isHigh) highStreak += 1;
      else highStreak = 0;
    }

    // Safety: preserve original items if something went wrong.
    if (ordered.length !== items.length) {
      ordered = items.slice(0);
    }

    // Dev-only one-time summary (per session start).
    if (opts && opts.debug === true && _isDevEnvForTypingLogs()) {
      try {
        var first10 = ordered.slice(0, 10);
        if (typeof console !== "undefined" && console && typeof console.debug === "function") {
          console.debug("[Typing][Pairs&Patterns] ordered queue", {
            tag: String(opts.tag || "ngrams"),
            counts: { low: low.length, med: med.length, high: high.length },
            first10: first10
          });
        }
      } catch (eD) {}
    }

    return ordered;
  }

  function normalizeTypingXpKeyPart(s) {
    if (s == null) return "";
    try { s = String(s); } catch (e0) { return ""; }
    s = s.replace(/\s+/g, " ");
    s = s.replace(/^\s+|\s+$/g, "");
    if (s.length > 120) s = s.slice(0, 120);
    return s;
  }

  function findPackById(packs, packId) {
    if (!packs || !packs.length || !packId) return null;
    for (var i = 0; i < packs.length; i++) {
      var p = packs[i];
      if (!p) continue;
      if (String(p.id || "") === String(packId)) return p;
    }
    return null;
  }

  function generateNgramPackExamplesPreview(pack) {
    var raw = (pack && pack.items && pack.items.slice) ? pack.items.slice(0) : [];
    var out = [];

    for (var i = 0; i < raw.length; i++) {
      var s = raw[i];
      if (s == null) continue;
      var t = String(s).replace(/^\s+|\s+$/g, "");
      if (!t) continue;
      if (t.length > 18) t = t.slice(0, 17) + "…";
      out.push(t);
      if (out.length >= 6) break;
    }

    return out.join(" · ");
  }

  function getSelectedEligibleNgramPack(packs, ppMode) {
    var eligible = getEligibleNgramPacks(packs, ppMode);
    var selectedId = readLastNgramPackId();
    if (!selectedId) return null;

    // If the stored id no longer exists in authored packs, clear it.
    if (!findPackById(packs, selectedId)) {
      writeLastNgramPackId("");
      return null;
    }

    return findPackById(eligible, selectedId);
  }

  function ensureSelectedPackEligibleOrClear(packs, ppMode) {
    var selectedId = readLastNgramPackId();
    if (!selectedId) return false;
    var eligible = getEligibleNgramPacks(packs, ppMode);
    if (!findPackById(eligible, selectedId)) {
      writeLastNgramPackId("");
      return true;
    }
    return false;
  }

  function setPpPackChooserOpen(isOpen) {
    var panel = getEl("ppPackChooserPanel");
    if (!panel) return;
    if (isOpen) {
      try { panel.classList.remove("is-hidden"); } catch (e0) {}
      try { panel.setAttribute("aria-hidden", "false"); } catch (e1) {}
    } else {
      try { panel.classList.add("is-hidden"); } catch (e2) {}
      try { panel.setAttribute("aria-hidden", "true"); } catch (e3) {}
    }
  }

  function isPpPackChooserOpen() {
    var panel = getEl("ppPackChooserPanel");
    if (!panel) return false;
    try { return String(panel.className || "").indexOf("is-hidden") === -1; } catch (e0) { return false; }
  }

  function renderPpPackChooser() {
    var listEl = getEl("ppPackChooserList");
    if (!listEl) return;

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];
    var ppMode = readPpMode();
    var eligible = getEligibleNgramPacks(packs, ppMode);

    // Highlight selected pack if eligible; otherwise highlight current recommendation.
    var selected = getSelectedEligibleNgramPack(packs, ppMode);
    var recommended = pickRecommendedNgramPack(ppMode);
    var activeId = (selected && selected.id) ? String(selected.id) : ((recommended && recommended.id) ? String(recommended.id) : "");

    try { listEl.innerHTML = ""; } catch (e0) { return; }

    if (!eligible.length) {
      var msg = document.createElement("div");
      msg.className = "tt-duration__hint";
      msg.textContent = "No packs available for this mode.";
      listEl.appendChild(msg);

      // Defensive fallback: show Mix packs so the user can still choose.
      var fallback = getEligibleNgramPacks(packs, "mix");
      if (!fallback.length) return;
      eligible = fallback;
    }

    for (var i = 0; i < eligible.length; i++) {
      var pack = eligible[i];
      if (!pack) continue;

      var packId = String(pack.id || "");
      var isActive = !!(activeId && packId && packId === activeId);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-secondary";
      btn.style.width = "100%";
      btn.style.textAlign = "left";
      btn.style.marginTop = i === 0 ? "0" : "8px";
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.setAttribute("data-pack-id", packId);

      var titleRow = document.createElement("div");
      titleRow.style.display = "flex";
      titleRow.style.alignItems = "center";
      titleRow.style.justifyContent = "space-between";
      titleRow.style.gap = "8px";

      var title = document.createElement("div");
      title.style.fontWeight = "700";
      title.textContent = String(pack.title || packId || "Pack");

      var mark = document.createElement("div");
      mark.textContent = isActive ? "✓" : "";

      titleRow.appendChild(title);
      titleRow.appendChild(mark);

      var preview = document.createElement("div");
      preview.className = "tt-duration__hint";
      preview.style.marginTop = "4px";
      preview.textContent = generateNgramPackExamplesPreview(pack);

      btn.appendChild(titleRow);
      btn.appendChild(preview);

      (function(packId2) {
        btn.addEventListener("click", function() {
          writeLastNgramPackId(packId2);
          setPpPackChooserOpen(false);
          try { renderNgramRecommendedOnCard(); } catch (e0) {}
          try { renderNgramXpOnCard(); } catch (e1) {}
          try { refreshTypingCenterUI(); } catch (e2) {}
        });
      })(packId);

      listEl.appendChild(btn);
    }
  }

  // Pairs & Patterns eligibility is now deterministic via explicit pack.kind.
  // pack.kind: "pairs" | "patterns" (authored in app/data/typing-drills.js)
  // NOTE: For forward-compatibility with older packs, we treat missing kind as:
  // - eligible only in "mix"
  // - in "pairs"/"patterns", excluded and (dev-only) logged via console.debug
  var _warnedMissingDrillPackKind = {};
  function _isDevEnvForTypingLogs() {
    try {
      var h = (window.location && typeof window.location.hostname === "string") ? window.location.hostname : "";
      if (h === "localhost" || h === "127.0.0.1" || h === "" || /\.local$/.test(h)) return true;
    } catch (e0) {}
    return false;
  }

  function getEligibleNgramPacks(packs, ppMode) {
    var m = normalizePpMode(ppMode);
    if (!packs || !packs.length) return [];
    if (m === "mix") return packs.slice(0);

    var out = [];
    for (var i = 0; i < packs.length; i++) {
      var p = packs[i];
      if (!p) continue;

      var kind = "";
      try { kind = String(p.kind || ""); } catch (e1) { kind = ""; }

      if (!kind) {
        if (_isDevEnvForTypingLogs()) {
          var pid = String(p.id || "");
          if (pid && !_warnedMissingDrillPackKind[pid]) {
            _warnedMissingDrillPackKind[pid] = true;
            try {
              if (typeof console !== "undefined" && console && typeof console.debug === "function") {
                console.debug("[Typing][Pairs&Patterns] pack.kind missing; excluded from", m, "mode:", pid);
              }
            } catch (e2) {}
          }
        }
        continue;
      }

      if (kind === m) out.push(p);
    }

    return out;
  }

  function pickRecommendedNgramPack(ppMode) {
    var data = getTypingDrillData();
    var packs = data && data.packs;
    if (!packs || !packs.length) return null;

    var mode = normalizePpMode(ppMode);
    var eligible = getEligibleNgramPacks(packs, mode);

    // Defensive fallback: if authored content yields zero eligible packs, fall back to Mix.
    if (!eligible.length && mode !== "mix") {
      eligible = getEligibleNgramPacks(packs, "mix");
    }
    if (!eligible.length) return null;

    // If we have per-profile weakness stats, recommend the pack that best matches them.
    // (Fallbacks below preserve previous behavior when stats are empty.)
    var weakness = getTypingWeaknessStatsSafe();
    if (hasAnyWeaknessSignal(weakness)) {
      var bestPack = null;
      var bestScore = 0;
      for (var s = 0; s < eligible.length; s++) {
        var p0 = eligible[s];
        if (!p0) continue;
        if (!buildNgramQueueFromPack(p0, 1).length) continue;
        var sc = scorePackForWeakness(p0, weakness);
        if (sc > bestScore) {
          bestScore = sc;
          bestPack = p0;
        }
      }
      if (bestPack && bestScore > 0) return bestPack;
    }

    // Prefer last-used pack if it still exists and has usable items.
    var lastId = readLastNgramPackId();
    if (lastId) {
      // If the stored id no longer exists in authored packs, clear it.
      if (!findPackById(packs, lastId)) {
        writeLastNgramPackId("");
        lastId = "";
      }
    }
    if (lastId) {
      // Only reuse the last-used pack if it is eligible under the current mode.
      var lastPack = findPackById(eligible, lastId);
      if (lastPack && buildNgramQueueFromPack(lastPack, 1).length) return lastPack;
    }

    for (var i = 0; i < eligible.length; i++) {
      if (eligible[i] && eligible[i].recommendWhenNoStats && buildNgramQueueFromPack(eligible[i], 1).length) return eligible[i];
    }

    for (var j = 0; j < eligible.length; j++) {
      if (eligible[j] && buildNgramQueueFromPack(eligible[j], 1).length) return eligible[j];
    }

    return null;
  }


  var ngramCardMeta = {
    recommended: "Recommended: —",
    xp: "XP: —/10"
  };

  function renderNgramMetaOnCard() {
    var el = getEl("typingCardMeta_ngrams");
    if (!el) return;
    var left = ngramCardMeta.recommended || "Recommended: —";
    var right = ngramCardMeta.xp || "XP today: —";
    el.textContent = left + " • " + right;
  }

  function renderNgramRecommendedOnCard() {
    var card = getEl("typingModeNgrams");
    var startBtn = getEl("typingNgramsStartBtn");

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];
    var mode = readPpMode();

    // Selected pack (if eligible) always wins for display.
    var selected = getSelectedEligibleNgramPack(packs, mode);
    var pack = selected || pickRecommendedNgramPack(mode);
    if (!pack) {
      ngramCardMeta.recommended = "No packs available. Please update drills.";
      ngramCardMeta.xp = "XP: —/10";
      renderNgramMetaOnCard();
      if (card) {
        try { card.setAttribute("aria-disabled", "true"); } catch (e0) {}
        try { card.disabled = true; } catch (e1) {}
      }

      if (startBtn) {
        try { startBtn.disabled = true; } catch (e2) {}
        try { startBtn.setAttribute("aria-disabled", "true"); } catch (e3) {}
      }
      return;
    }

    if (card) {
      try { card.removeAttribute("aria-disabled"); } catch (e2) {}
      try { card.disabled = false; } catch (e3) {}
    }

    if (startBtn) {
      try { startBtn.disabled = false; } catch (e4) {}
      try { startBtn.removeAttribute("aria-disabled"); } catch (e5) {}
    }

    if (selected) {
      ngramCardMeta.recommended = "Selected: " + String(pack.title || pack.id || "Pack");
    } else {
      ngramCardMeta.recommended = "Recommended: " + String(pack.title || pack.id || "Pack");
    }
    renderNgramMetaOnCard();
  }

  function renderNgramXpOnCard() {
    var xpToday = 0;
    var cap = 10;
    try {
      if (window.State && typeof State.getTypingPracticeXpSummary === "function") {
        var s = State.getTypingPracticeXpSummary();
        if (s) {
          if (typeof s.xpToday === "number" && isFinite(s.xpToday)) xpToday = (s.xpToday | 0);
          if (typeof s.cap === "number" && isFinite(s.cap)) cap = (s.cap | 0);
        }
      }
    } catch (e0) {}
    if (!(xpToday > 0)) xpToday = 0;
    if (!(cap > 0)) cap = 10;
    ngramCardMeta.xp = "XP: " + String(xpToday) + "/" + String(cap);
    renderNgramMetaOnCard();
  }


  function startNgramDrillSession(ppMode) {
    var mode = normalizePpMode(ppMode);

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];

    // Defensive: clear stale selection ids (pack removed).
    try {
      var lastId = readLastNgramPackId();
      if (lastId && !findPackById(packs, lastId)) writeLastNgramPackId("");
    } catch (eSelStale) {}

    // Override: if user explicitly selected a pack and it's eligible, always use it.
    var selected = getSelectedEligibleNgramPack(packs, mode);
    var pack = selected || pickRecommendedNgramPack(mode);

    // Defensive: if selection exists but is no longer eligible, clear it.
    if (!selected) {
      try { ensureSelectedPackEligibleOrClear(packs, mode); } catch (eSel0) {}
    }
    if (!pack) return null;

    var queue = buildNgramQueueFromPack(pack, 10);
    if (!queue.length) return null;

    // Kid-friendly adaptive ordering: early wins, fewer repeats, no hard clustering.
    queue = orderNgramQueue(queue, getTypingWeaknessStatsSafe(), { debug: true, tag: "start" });

    typingDrillSession = {
      kind: "ngrams",
      ppMode: mode,
      packId: String(pack.id || ""),
      packTitle: String(pack.title || pack.id || "Pairs & Patterns"),
      queue: queue,
      i: 0
    };

    try {
      runState.drillKind = "ngrams";
      runState.drillLabel = "Pairs & Patterns";
      runState.drillVariant = mode;
      runState.drillPackId = String(pack.id || "");
      runState.drillStep = 1;
      runState.drillTotal = queue.length;
    } catch (e0) {}

    writeLastNgramPackId(String(pack.id || ""));
    writeTypingCenterSelectedMode("ngrams");

    return typingDrillSession;
  }

  function startNgramReviewSession(ppMode) {
    var mode = normalizePpMode(ppMode);

    var data = getTypingDrillData();
    var packs = (data && data.packs) ? data.packs : [];

    // Pick the normal pack source for fill/idempotency key behavior.
    var selected = getSelectedEligibleNgramPack(packs, mode);
    var basePack = selected || pickRecommendedNgramPack(mode);
    if (!basePack && packs.length) basePack = packs[0];
    if (!basePack) return null;

    var queue = buildNgramReviewQueue({ ppMode: mode, packIdOrNull: String(basePack.id || ""), totalItems: 10 });
    if (!queue || !queue.length) return null;

    // Kid-friendly adaptive ordering: interleave hard/easy and avoid repeats.
    queue = orderNgramQueue(queue, getTypingWeaknessStatsSafe(), { debug: true, tag: "review" });

    typingDrillSession = {
      kind: "ngrams",
      ppMode: mode,
      packId: String(basePack.id || ""),
      packTitle: "Review mistakes",
      queue: queue,
      i: 0,
      reviewMistakes: true
    };

    try {
      runState.drillKind = "ngrams";
      runState.drillLabel = "Review mistakes";
      runState.drillVariant = mode;
      runState.drillPackId = String(basePack.id || "");
      runState.drillStep = 1;
      runState.drillTotal = queue.length;
    } catch (e1) {}

    writeTypingCenterSelectedMode("ngrams");
    return typingDrillSession;
  }

  function isNgramDrillActive() {
    try {
      return !!(typingDrillSession && typingDrillSession.kind === "ngrams" && runState && runState.drillKind === "ngrams");
    } catch (e0) {
      return false;
    }
  }

  function getNgramPromptTextAt(index) {
    if (!typingDrillSession || typingDrillSession.kind !== "ngrams") return "";
    var i = (typeof index === "number" && isFinite(index)) ? index : (typingDrillSession.i | 0);
    var q = typingDrillSession.queue || [];
    if (i < 0 || i >= q.length) return "";
    return String(q[i] || "");
  }

  function stringsMatchExactly(a, b) {
    if (a == null) a = "";
    if (b == null) b = "";
    return a === b;
  }

  function ensureRaceGoalLine() {
    var el = document.getElementById("raceGoalLine");
    if (el) {
      // Ensure it has the expected classes even if markup differs
      try {
        if (String(el.className || "").indexOf("race-goal-line") === -1) {
          el.className = (el.className ? (el.className + " ") : "") + "race-goal-line";
        }
        if (String(el.className || "").indexOf("race-goal") === -1) {
          el.className = (el.className ? (el.className + " ") : "") + "race-goal";
        }
      } catch (e0) {}
      return el;
    }

    var screen = document.getElementById("screen-typing-race");
    if (!screen) return null;

    var sub = document.getElementById("raceSubtitle");

    el = document.createElement("div");
    el.id = "raceGoalLine";
    el.className = "race-goal race-goal-line";
    el.setAttribute("aria-live", "polite");
    el.textContent = "";

    if (sub && sub.parentNode) {
      sub.parentNode.insertBefore(el, sub.nextSibling);
    } else {
      screen.insertBefore(el, screen.firstChild);
    }

    return el;
  }

  var GOAL_PRACTICE_WORDS = 10;

  function setGoalForRun(mode) {
    // Internal only; does not touch app-wide state
    if (mode === "practice") runState.goalMode = "practice";
    else if (mode === "typeDefine") runState.goalMode = "practice";
    else if (mode === "timeTrial") runState.goalMode = "timeTrial";
    else if (mode === "lessons") runState.goalMode = "lessons";
    else runState.goalMode = "race";
  }

  function countWordsTyped(text) {
    if (!text) return 0;
    var s = String(text);
    // trim (ES5)
    s = s.replace(/^\s+/, "").replace(/\s+$/, "");
    if (!s) return 0;
    var parts = s.split(/\s+/);
    var n = 0;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) n += 1;
    }
    return n;
  }

  function renderGoalLine(mainText, ok, okText, warnText) {
    var el = ensureRaceGoalLine();
    if (!el) return;

    while (el.firstChild) el.removeChild(el.firstChild);

    var main = document.createElement("span");
    main.className = "race-goal-line__text";
    main.textContent = String(mainText || "");
    el.appendChild(main);

    var status = document.createElement("span");
    status.className = "race-goal-line__status " + (ok ? "goal-ok" : "goal-warn");
    status.textContent = ok ? ("✓ " + String(okText || "Goal met")) : ("• " + String(warnText || "Keep going"));
    el.appendChild(status);
  }

  function updateGoalProgress(inputValue) {
    var v = (typeof inputValue === "string") ? inputValue : null;
    if (v == null) {
      var inputEl = getEl("raceInput");
      v = inputEl ? (inputEl.value || "") : "";
    }

    var mistakes = runState.totalErrors || 0;
    var accPct = computeAcc(runState.totalAdded || 0, mistakes);

    if (runState && runState.drillKind === "ngrams") {
      var step = (runState && runState.drillStep) ? (runState.drillStep | 0) : ((typingDrillSession && typingDrillSession.i != null) ? ((typingDrillSession.i | 0) + 1) : 1);
      var total = (runState && runState.drillTotal) ? (runState.drillTotal | 0) : ((typingDrillSession && typingDrillSession.queue) ? (typingDrillSession.queue.length | 0) : 0);
      if (step < 1) step = 1;
      if (total < 0) total = 0;
      var packTitle = (typingDrillSession && typingDrillSession.packTitle) ? String(typingDrillSession.packTitle) : "Pairs & Patterns";
      var mainTextD = "Drill: " + packTitle + (total > 0 ? (" • " + String(step) + "/" + String(total)) : "") +
        " • Goal: 0 mistakes" +
        " • Accuracy: " + String(accPct) + "%" +
        " • Mistakes: " + String(mistakes);
      var okD = (mistakes === 0);
      renderGoalLine(mainTextD, okD, "Clean", "Keep going");
      return;
    }

    if (runState.mode === "practice") {
      var words = countWordsTyped(v);
      var streakChars = computeCleanStreakChars(v, state.prompt);
      var mainText = "Goal: 0 mistakes for " + String(GOAL_PRACTICE_WORDS) + " words" +
        " • Progress: " + String(Math.min(words, GOAL_PRACTICE_WORDS)) + "/" + String(GOAL_PRACTICE_WORDS) +
        " • Mistakes: " + String(mistakes) +
        " • Clean streak: " + String(streakChars) + " chars";
      var ok = (mistakes === 0 && words >= GOAL_PRACTICE_WORDS);
      renderGoalLine(mainText, ok, "Goal met", "Keep going");
      return;
    }

    if (runState.mode === "timeTrial") {
      var targetSec = getTimeTrialTargetSec();

      var elapsedSec = 0;
      if (state.running) {
        elapsedSec = (hudSnapshot && hudSnapshot.seconds >= 0) ? hudSnapshot.seconds : 0;
      }
      if (!(elapsedSec > 0) && state.startedAt) {
        var now = (window.performance && performance.now) ? performance.now() : Date.now();
        elapsedSec = (now - state.startedAt) / 1000;
      }

      var mainTextTT = "Goal: ≤ " + String(targetSec) + "s" +
        " • Acc ≥ " + String(TIME_TRIAL_ACC_MIN) + "%" +
        " • Time: " + String(elapsedSec.toFixed(1)) + "s" +
        " • Acc: " + String(accPct) + "%";
      var okTT = (accPct >= TIME_TRIAL_ACC_MIN) && (elapsedSec <= targetSec);
      renderGoalLine(mainTextTT, okTT, "On track", "Keep going");
      return;
    }

    if (runState.mode === "lessons") {
      var title = runState.lessonTitle ? String(runState.lessonTitle) : "Lesson";
      var mainTextL = "Lesson: " + title +
        (runState.lessonObjective ? (" • " + String(runState.lessonObjective)) : "") +
        " • Accuracy: " + String(accPct) + "%" +
        " • Mistakes: " + String(mistakes);
      var okL = (accPct >= ACC_GOAL);
      renderGoalLine(mainTextL, okL, "Nice", "Keep going");
      return;
    }

    // Race
    var mainTextRace = "Goal: " + String(ACC_GOAL) + "%+ accuracy" +
      " • Accuracy: " + String(accPct) + "% (goal " + String(ACC_GOAL) + "%)";
    var okRace = (accPct >= ACC_GOAL);
    renderGoalLine(mainTextRace, okRace, "Goal met", "Keep going");
  }

  function setRaceSubtitle(modeKey, opts) {
    var el = document.getElementById("raceSubtitle");
    if (!el) return;

    opts = opts || {};
    var key = String(modeKey || "");
    var meta = getTypingModeMeta(key);

    var parts = [];
    if (meta && meta.subtitle) parts.push(String(meta.subtitle));

    if (key === "race") {
      parts.push("Accuracy goal: " + String(ACC_GOAL) + "%+");
      if (raceMatch && raceMatch.active) {
        var roundLabel = getRaceRoundLabel();
        if (roundLabel) parts.push(roundLabel);
      }
    } else if (key === "timeTrial") {
      var tsec = getTimeTrialTargetSec();
      parts.push("Target: " + String(tsec) + "s");
      parts.push(String(TIME_TRIAL_ACC_MIN) + "%+ accuracy");
    } else if (key === "practice" || key === "lessons" || key === "ngrams") {
      parts.push("Accuracy first");
    }

    if (opts.extra) parts.push(String(opts.extra));
    if (opts.punjabiHint) parts.push(String(opts.punjabiHint));

    el.textContent = parts.length ? parts.join(" • ") : "";
  }

  function setRaceTitle(text) {
    var el = getEl("raceTitle");
    if (!el) return;
    el.textContent = String(text || "Typing");
  }

  function setRaceMetricVisibility(opts) {
    opts = opts || {};
    var showWpm = (opts.showWpm !== false);
    var showTime = (opts.showTime !== false);

    var wpmRow = getEl("raceMetricWpm");
    var timeRow = getEl("raceMetricTime");

    if (wpmRow) wpmRow.style.display = showWpm ? "" : "none";
    if (timeRow) timeRow.style.display = showTime ? "" : "none";
  }

  function setRaceModeUI() {
    // Mark the active mode on the Typing Race screen so CSS can scope visuals
    // to Typing Race only (without affecting other Typing modes that reuse the screen).
    try {
      var screenEl = getEl("screen-typing-race");
      if (screenEl) {
        var modeVal = (runState && runState.drillKind === "ngrams") ? "ngrams" : String((runState && runState.mode) ? runState.mode : "race");
        screenEl.setAttribute("data-typing-mode", modeVal);
      }
    } catch (eMode) {}

    if (runState && runState.drillKind === "ngrams") {
      var metaD = getTypingModeMeta("ngrams");
      setRaceTitle(metaD && metaD.title ? metaD.title : "Typing");
      setRaceMetricVisibility({ showWpm: false, showTime: false });

      var step = (runState && runState.drillStep) ? (runState.drillStep | 0) : 1;
      var total = (runState && runState.drillTotal) ? (runState.drillTotal | 0) : 0;
      if (step < 1) step = 1;
      if (total < 0) total = 0;
      var extra0 = runState.drillLabel ? String(runState.drillLabel) : "";
      if (total > 0) extra0 = (extra0 ? (extra0 + " • ") : "") + String(step) + "/" + String(total);
      setRaceSubtitle("ngrams", { extra: extra0 });

      var startBtn0 = getEl("raceStartBtn");
      if (startBtn0) startBtn0.textContent = "Start Drill";

      var nextBtn0 = getEl("raceNextBtn");
      if (nextBtn0) nextBtn0.textContent = "Next Pattern";

      var resetBtn0 = getEl("raceResetBtn");
      if (resetBtn0) resetBtn0.textContent = "Restart";

      setGoalForRun("practice");
      updateGoalProgress();
      return;
    }

    // Non-drill: restore race UI defaults.
    var modeKey = (runState && runState.mode) ? String(runState.mode) : "";
    var meta = getTypingModeMeta(modeKey);
    setRaceTitle(meta && meta.title ? meta.title : "Typing");
    setRaceMetricVisibility({ showWpm: true, showTime: true });

    // Time Trial: show target in the Time metric pill (visual hint via CSS)
    try {
      var timeRow = getEl("raceMetricTime");
      if (timeRow) {
        if (runState && runState.mode === "timeTrial") {
          var tsec = getTimeTrialTargetSec();
          timeRow.setAttribute("data-target", "≤ " + String(tsec) + "s");
        } else {
          timeRow.removeAttribute("data-target");
        }
      }
    } catch (eT0) {}

    if (runState.mode === "practice") setRaceSubtitle("practice", { punjabiHint: runState.promptPa });
    else if (runState.mode === "typeDefine") setRaceSubtitle("typeDefine", { extra: "Type • Pick • Build combo" });
    else if (runState.mode === "timeTrial") setRaceSubtitle("timeTrial", { punjabiHint: runState.promptPa });
    else if (runState.mode === "lessons") {
      var extraL = runState.lessonTitle ? ("Lesson: " + String(runState.lessonTitle)) : "Lesson";
      setRaceSubtitle("lessons", { extra: extraL, punjabiHint: runState.promptPa });
    } else {
      setRaceSubtitle("race", { punjabiHint: runState.promptPa });
    }

    var startBtn = getEl("raceStartBtn");
    if (startBtn) {
      startBtn.textContent = "Start Typing";
    }

    setGoalForRun(runState.mode);
    updateGoalProgress();
  }

  function resetRun(promptObj) {
    runState.startTs = Date.now();
    runState.promptEn = (promptObj && promptObj.en) ? String(promptObj.en) : "";
    runState.promptPa = (promptObj && promptObj.pa) ? String(promptObj.pa) : "";
    runState.finished = false;
    runState.focusMode = false;
    runState.prevValue = "";
    runState.progressLen = 0;
    runState.totalAdded = 0;
    runState.totalErrors = 0;
    runState.missCounts = {};
    runState.bigramCounts = {};
    runState.forceRetry = false;

    // Time Trial: fixed duration target (30s / 60s).
    if (runState.mode === "timeTrial") {
      var en = runState.promptEn || "";
      runState.timeTrialPromptLen = promptCleanLen(en) | 0;
      runState.timeTrialWordCount = countWordsInText(en) | 0;
      // Explicit duration modes: 30s or 60s.
      runState.timeTrialTargetSec = readTimeTrialDurationSec() | 0;
      if (!(runState.timeTrialTargetSec > 0)) runState.timeTrialTargetSec = TIME_TRIAL_TARGET_SECONDS_DEFAULT;
    } else {
      runState.timeTrialPromptLen = 0;
      runState.timeTrialWordCount = 0;
      runState.timeTrialTargetSec = 0;
    }
  }

  var _promptHighlightRafId = 0;
  var _promptHighlightArgs = null;

  function schedulePromptHighlightRender(promptEl, typed, target) {
    _promptHighlightArgs = { promptEl: promptEl, typed: typed, target: target };
    if (_promptHighlightRafId) return;

    var raf = (window.requestAnimationFrame || function(fn) { return setTimeout(fn, 16); });
    _promptHighlightRafId = raf(function() {
      _promptHighlightRafId = 0;
      var args = _promptHighlightArgs;
      _promptHighlightArgs = null;
      if (!args) return;
      renderPromptWithHighlight(args.promptEl, args.typed, args.target);
    });
  }

  function renderPromptWithHighlight(promptEl, typed, target) {
    if (!promptEl) return;

    try {
      promptEl.setAttribute("role", "img");
      promptEl.setAttribute("aria-label", String(target || ""));
    } catch (e0) {}

    while (promptEl.firstChild) promptEl.removeChild(promptEl.firstChild);

    // Current word + next character highlighting (learning UX)
    // - nextPos: the next character index the learner should type
    // - word bounds: the word that contains nextPos
    var nextPos = typed ? typed.length : 0;
    if (nextPos < 0) nextPos = 0;
    if (nextPos > target.length) nextPos = target.length;

    var wordStart = nextPos;
    var wordEnd = nextPos;
    // Find word start (scan left until space)
    for (var ls = nextPos; ls > 0; ls--) {
      if (target.charAt(ls - 1) === " ") break;
      wordStart = ls - 1;
    }
    // Find word end (scan right until space)
    for (var rs = nextPos; rs < target.length; rs++) {
      if (target.charAt(rs) === " ") break;
      wordEnd = rs;
    }

    for (var i = 0; i < target.length; i++) {
      var span = document.createElement("span");
      try { span.setAttribute("aria-hidden", "true"); } catch (e1) {}
      var ch = target.charAt(i);
      span.textContent = ch;

      if (i < typed.length) {
        var isOk = (typed.charAt(i) === ch);
        if (runState && runState.mode === "race") {
          span.className = isOk ? "is-correct correct" : "is-wrong incorrect";
        } else {
          span.className = isOk ? "is-correct" : "is-wrong";
        }
      } else {
        // Pending characters can be highlighted as part of the current word
        var cls = "is-pending";
        if (i === nextPos) cls += " is-next";
        if (i >= wordStart && i <= wordEnd) cls += " is-current-word";
        if (runState && runState.mode === "race") cls += " pending";
        span.className = cls;
      }

      promptEl.appendChild(span);
    }
  }

  function computeWpm(charsTyped, seconds) {
    if (!(seconds > 0)) return 0;
    var words = charsTyped / 5;
    var minutes = seconds / 60;
    return Math.max(0, Math.round(words / minutes));
  }

  function computeAcc(totalTyped, totalErrors) {
    if (!(totalTyped > 0)) return 100;
    var correct = Math.max(0, totalTyped - totalErrors);
    return Math.max(0, Math.min(100, Math.round((correct / totalTyped) * 100)));
  }

  function computeCleanStreakChars(typed, target) {
    if (!typed || !target) return 0;
    var t = String(typed);
    var p = String(target);
    var n = Math.min(t.length, p.length);
    var streak = 0;
    for (var i = n - 1; i >= 0; i--) {
      if (t.charAt(i) !== p.charAt(i)) break;
      streak += 1;
    }
    return streak;
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  function getActiveTypingRaceRoot() {
    var screen = getEl("screen-typing-race");
    if (screen && screen.classList && screen.classList.contains("active")) return screen;
    return null;
  }

  function findActiveTypingInputEl() {
    var root = getActiveTypingRaceRoot() || document;
    if (!root || !root.querySelector) return null;

    // Most-specific first (within the active race screen when possible)
    return (
      root.querySelector("#raceInput") ||
      root.querySelector(".race-input") ||
      root.querySelector('input[data-typing="input"]') ||
      root.querySelector('input[type="text"]') ||
      root.querySelector("textarea") ||
      null
    );
  }

  function findActiveTypingPrimaryButton() {
    var root = getActiveTypingRaceRoot() || document;
    if (!root || !root.querySelector) return null;

    return (
      root.querySelector("#raceStartBtn") ||
      root.querySelector('button[data-typing-action="start"]') ||
      root.querySelector(".race-dock .pill-btn.is-primary") ||
      root.querySelector("button") ||
      null
    );
  }

  function findActiveTypingFocusButton() {
    var root = getActiveTypingRaceRoot() || document;
    if (!root || !root.querySelector) return null;
    return (
      root.querySelector("#raceFocusBtn") ||
      root.querySelector('button[data-typing-action="focus"]') ||
      null
    );
  }

  function ensureTypingCenterObjectiveEl() {
    // Preferred: prompt-aligned hero objective element if present in markup
    var heroObj = document.getElementById("typingCenterObjective");
    if (heroObj) return heroObj;

    var el = document.getElementById("typingCenterObjectiveLine");
    if (el) return el;

    var screen = document.getElementById("screen-typing-center");
    if (!screen) return null;

    // Preferred placement: inside the title block under the subtitle
    var titleBlock = screen.querySelector(".typing-titleblock");
    if (!titleBlock) return null;

    el = document.createElement("div");
    el.id = "typingCenterObjectiveLine";
    el.className = "typing-center__objective";
    el.setAttribute("aria-live", "polite");
    el.textContent = "";

    titleBlock.appendChild(el);
    return el;
  }

  function setTypingCenterObjective(mode) {
    var el = ensureTypingCenterObjectiveEl();
    if (!el) return;
    var m = normalizeTypingCenterMode(mode || "race");

    function renderObjectiveChips(chips) {
      if (!el) return;
      var list = Array.isArray(chips) ? chips : [];
      var html = "";
      for (var i = 0; i < list.length; i++) {
        var txt = String(list[i] || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (!txt) continue;
        html += '<span class="typing-config-chip">' + txt + '</span>';
      }
      el.innerHTML = html;
    }

    // Friendly chips: concise, kid-readable, less system-like metadata.
    if (m === "practice") {
      renderObjectiveChips([
        "Timer Off · ਟਾਈਮਰ ਬੰਦ",
        "Goal " + String(ACC_GOAL) + "%+ · ਲਕਸ਼ " + String(ACC_GOAL) + "%+",
        "Clean spacing · ਸਾਫ਼ ਖਾਲੀ ਥਾਂ"
      ]);
      return;
    }

    if (m === "ngrams") {
      renderObjectiveChips([
        "Drills On · ਡ੍ਰਿਲ ਚਾਲੂ",
        "Letter pairs · ਅੱਖਰ ਜੋੜੇ",
        "Accuracy first · ਪਹਿਲਾਂ ਸਹੀਪਨ"
      ]);
      return;
    }

    if (m === "typeDefine") {
      renderObjectiveChips([
        "Type then choose · ਪਹਿਲਾਂ ਟਾਈਪ ਫਿਰ ਚੋਣ",
        "Goal Recall · ਲਕਸ਼ ਯਾਦ",
        "Guided steps · ਰਹਿਨੁਮਾ ਕਦਮ"
      ]);
      return;
    }

    if (m === "timeTrial") {
      renderObjectiveChips([
        "Timer On · ਟਾਈਮਰ ਚਾਲੂ",
        "Goal " + String(TIME_TRIAL_ACC_MIN) + "%+ · ਲਕਸ਼ " + String(TIME_TRIAL_ACC_MIN) + "%+",
        "Target " + String(readTimeTrialDurationSec()) + "s · ਟਾਰਗੇਟ " + String(readTimeTrialDurationSec()) + "s"
      ]);
      return;
    }

    renderObjectiveChips([
      "Countdown On · ਗਿਣਤੀ ਚਾਲੂ",
      "Goal " + String(ACC_GOAL) + "%+ · ਲਕਸ਼ " + String(ACC_GOAL) + "%+",
      "Speed + accuracy · ਤੇਜ਼ੀ + ਸਹੀਪਨ"
    ]);
  }

  function setTypingCenterLastModeUI(mode, hasStoredValue) {
    var line = getEl("typingLastModeLine");
    var raceStartBtn = getEl("typingRaceStartBtn");

    var m = normalizeTypingCenterMode(mode);

    // Featured card requirement: show "Last: Race" only on the Typing Race featured card.
    if (line) {
      if (hasStoredValue === false || m !== "race") line.textContent = "";
      else line.textContent = "Last: Race";
    }

    if (raceStartBtn) {
      raceStartBtn.textContent = "Start Typing";
      raceStartBtn.setAttribute("aria-label", "Start Typing");
    }
  }

  function renderRaceFeaturedStatsOnCard() {
    var wpmEl = getEl("typingRaceStatWpm");
    var accEl = getEl("typingRaceStatAcc");
    var timeEl = getEl("typingRaceStatTime");
    var summaryEl = getEl("typingRaceBestSummary");
    if (!wpmEl && !accEl && !timeEl && !summaryEl) return;

    var best = getBestForMode("race");
    var w = (best && best.bestWpm > 0) ? Math.round(best.bestWpm) : 0;
    var a = (best && best.bestAcc > 0) ? (best.bestAcc | 0) : 0;
    var t = (best && best.bestTimeMs > 0) ? (best.bestTimeMs | 0) : 0;

    if (wpmEl) wpmEl.textContent = w > 0 ? String(w) : "—";
    if (accEl) accEl.textContent = a > 0 ? (String(a) + "%") : "—";
    if (timeEl) timeEl.textContent = t > 0 ? formatTime(t) : "—";

    if (summaryEl) {
      if (w > 0 || a > 0 || t > 0) {
        summaryEl.textContent = "Best: "
          + (w > 0 ? (String(w) + " WPM") : "—")
          + " • "
          + (a > 0 ? (String(a) + "%") : "—");
      } else {
        summaryEl.textContent = "Best: —";
      }
    }
  }

  function setTypingHeroChips(mode) {
    var row = getEl("typingHeroChips");
    if (!row) return;

    var chips = row.querySelectorAll ? row.querySelectorAll(".typing-chip") : null;
    if (!chips || chips.length < 3) return;

    var m = String(normalizeTypingCenterMode(mode || "")).toLowerCase();

    // Defaults (Practice)
    var c1 = "No timer";
    var c2 = "Warm-up";
    var c3 = "Accuracy goal " + String(ACC_GOAL) + "%+";

    if (m.indexOf("ngram") >= 0 || m.indexOf("pair") >= 0) {
      c1 = "Bigrams";
      c2 = "Short drills";
      c3 = "Accuracy first";
    } else if (m.indexOf("typedefine") >= 0) {
      c1 = "Type";
      c2 = "Pick meaning";
      c3 = "3s timer";
    } else if (m.indexOf("timetrial") >= 0) {
      c1 = "Timed";
      c2 = "Longer prompts";
      c3 = "" + String(TIME_TRIAL_ACC_MIN) + "%+ accuracy";
    } else if (m.indexOf("race") >= 0) {
      c1 = "Countdown start";
      c2 = "Chase your best";
      c3 = "Accuracy goal " + String(ACC_GOAL) + "%+";
    }

    try { chips[0].textContent = c1; } catch (e0) {}
    try { chips[1].textContent = c2; } catch (e1) {}
    try { chips[2].textContent = c3; } catch (e2) {}
  }

  var TYPING_CENTER_DECK_ORDER = ["practice", "typeDefine", "race"];

  function getTypingCenterDeckModeIndex(mode) {
    var m = normalizeTypingCenterMode(mode);
    for (var i = 0; i < TYPING_CENTER_DECK_ORDER.length; i++) {
      if (TYPING_CENTER_DECK_ORDER[i] === m) return i;
    }
    return 0;
  }

  function getTypingDeckCardMode(card) {
    var cardId = String((card && card.id) || "");
    if (cardId === "typingModeTypeDefine") return "typeDefine";
    if (cardId === "typingModeRace") return "race";
    return "practice";
  }

  function getTypingDeckCards(track) {
    return (track && track.querySelectorAll) ? track.querySelectorAll(".typing-mode-card") : [];
  }

  function typingDeckClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function typingDeckWrappedDelta(index, current, total) {
    var delta = index - current;
    if (total <= 2) return delta;
    var half = total / 2;
    if (delta > half) delta -= total;
    else if (delta < -half) delta += total;
    return delta;
  }

  function typingDeckReduceMotionEnabled() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e0) {
      return false;
    }
  }

  function applyTypingDeckLook(track, activeIndex, progress) {
    var cards = getTypingDeckCards(track);
    if (!cards || !cards.length) return;

    var p = (typeof progress === "number" && isFinite(progress)) ? typingDeckClamp(progress, -1.2, 1.2) : 0;
    var reduceMotion = typingDeckReduceMotionEnabled();
    var deckRoot = getEl("typingModeDeck");

    if (deckRoot && deckRoot.classList) {
      deckRoot.classList.toggle("is-swipe-moving", !reduceMotion && Math.abs(p) > 0.015);
    }

    if (reduceMotion) {
      for (var r = 0; r < cards.length; r++) {
        cards[r].style.transform = "";
        cards[r].style.opacity = "";
        cards[r].style.filter = "";
        cards[r].style.zIndex = "";
      }
      return;
    }

    var total = cards.length;
    for (var i = 0; i < total; i++) {
      var baseDelta = typingDeckWrappedDelta(i, activeIndex, total);
      var rel = baseDelta + p;
      var absRel = Math.abs(rel);
      var depthFactor = typingDeckClamp(absRel, 0, 2.2);
      var isActive = i === activeIndex;
      var slideX = 0;
      var scale = 1;
      var liftY = 0;
      var rotateY = 0;
      var opacity = 1;
      var saturate = 1;
      var brightness = 1;
      var z = 620;

      if (isActive) {
        slideX = typingDeckClamp(rel, -1.2, 1.2) * -18;
        scale = 1 - (Math.min(depthFactor, 1.2) * 0.015);
        liftY = Math.round(Math.min(depthFactor, 1.0) * 1);
        rotateY = typingDeckClamp(rel * -3, -4, 4);
      } else if (Math.abs(baseDelta) === 1) {
        slideX = typingDeckClamp(rel, -1.6, 1.6) * -34;
        scale = 0.97 - (Math.min(depthFactor, 1.7) * 0.02);
        liftY = 4 + Math.round(Math.min(depthFactor, 1.5) * 2);
        rotateY = typingDeckClamp(rel * -3.4, -5, 5);
        opacity = 0.74 - (Math.min(depthFactor, 2.0) * 0.08);
        saturate = 0.9 - (Math.min(depthFactor, 1.8) * 0.06);
        brightness = 0.98;
        z = 360 - Math.round(depthFactor * 24);
      } else {
        slideX = typingDeckClamp(rel, -1.8, 1.8) * -12;
        scale = 0.92 - (Math.min(depthFactor, 2.0) * 0.02);
        liftY = 7 + Math.round(Math.min(depthFactor, 1.8) * 3);
        rotateY = typingDeckClamp(rel * -2.4, -4, 4);
        opacity = 0.34;
        saturate = 0.74;
        brightness = 0.94;
        z = 150;
      }

      if (z < 90) z = 90;
      cards[i].style.transform = "translateX(" + slideX.toFixed(2) + "%) translateY(" + liftY + "px) scale(" + scale.toFixed(3) + ") rotateY(" + rotateY.toFixed(2) + "deg)";
      cards[i].style.opacity = opacity.toFixed(3);
      cards[i].style.filter = "saturate(" + saturate.toFixed(3) + ") brightness(" + brightness.toFixed(3) + ")";
      cards[i].style.zIndex = String(z);
    }
  }

  function getTypingCenterCtaLabels(mode) {
    return { en: "Start Typing", pa: "ਟਾਈਪਿੰਗ ਸ਼ੁਰੂ ਕਰੋ" };
  }

  function setTypingCenterCtaLabels(startBtn, labels) {
    if (!startBtn) return;
    var data = labels || { en: "Start Typing", pa: "ਟਾਈਪਿੰਗ ਸ਼ੁਰੂ ਕਰੋ" };
    var enText = String(data.en || "Start Typing");
    var paText = String(data.pa || "ਟਾਈਪਿੰਗ ਸ਼ੁਰੂ ਕਰੋ");

    var enEl = null;
    var paEl = null;
    try { enEl = startBtn.querySelector ? startBtn.querySelector(".btn-label-en") : null; } catch (e0) { enEl = null; }
    try { paEl = startBtn.querySelector ? startBtn.querySelector(".btn-label-pa") : null; } catch (e1) { paEl = null; }

    if (enEl) enEl.textContent = enText;
    if (paEl) paEl.textContent = paText;
    if (!enEl && !paEl) startBtn.textContent = enText;

    startBtn.setAttribute("aria-label", enText);
  }

  function syncTypingCenterDeckUi(mode, dragProgress) {
    var m = normalizeTypingCenterMode(mode);
    var idx = getTypingCenterDeckModeIndex(m);
    var drag = (typeof dragProgress === "number" && isFinite(dragProgress)) ? typingDeckClamp(dragProgress, -1.2, 1.2) : 0;

    var track = getEl("typingDeckTrack");
    var deckRoot = getEl("typingModeDeck");
    var progressHost = null;
    try { progressHost = document.querySelector("#screen-typing-center .typing-hero-progress"); } catch (ePH) { progressHost = null; }
    var dotsRoot = getEl("typingDeckDots");
    var progressText = getEl("typingDeckProgressText");
    var hintText = getEl("typingDeckHint");
    var prevBtn = getEl("typingDeckPrevBtn");
    var nextBtn = getEl("typingDeckNextBtn");
    var startBtn = getEl("typingCenterStartBtn");
    var isAtStart = idx === 0;
    var isAtEnd = idx === (TYPING_CENTER_DECK_ORDER.length - 1);

    if (deckRoot) {
      try {
        deckRoot.classList.toggle("is-at-start", isAtStart);
        deckRoot.classList.toggle("is-at-end", isAtEnd);
        if (progressHost) {
          progressHost.classList.toggle("is-at-start", isAtStart);
          progressHost.classList.toggle("is-at-end", isAtEnd);
        }
      } catch (eDeckState) {}
    }

    if (track && track.style) {
      track.style.transform = "translate3d(" + String((idx * -100) + (drag * 100)) + "%, 0, 0)";

      var cards = getTypingDeckCards(track);
      for (var c = 0; c < cards.length; c++) {
        var card = cards[c];
        var cardMode = getTypingDeckCardMode(card);
        var cardIdx = getTypingCenterDeckModeIndex(cardMode);
        var rel = typingDeckWrappedDelta(cardIdx, idx, TYPING_CENTER_DECK_ORDER.length);
        var isActive = rel === 0;
        var isPrev = rel === -1;
        var isNext = rel === 1;

        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-peek-prev", isPrev);
        card.classList.toggle("is-peek-next", isNext);
        card.classList.toggle("is-muted", !isActive && !isPrev && !isNext);

        try { card.setAttribute("aria-current", isActive ? "true" : "false"); } catch (eAC) {}
        try { card.setAttribute("aria-hidden", isActive ? "false" : "true"); } catch (eAH) {}
        try { card.setAttribute("tabindex", isActive ? "0" : "-1"); } catch (eTI) {}
      }

      applyTypingDeckLook(track, idx, drag);
    }

    if (dotsRoot) {
      var hasDots = !!(dotsRoot.querySelector && dotsRoot.querySelector(".deck-dot"));
      if (!hasDots) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < TYPING_CENTER_DECK_ORDER.length; i++) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "deck-dot";
          dot.setAttribute("aria-label", "Go to typing mode " + String(i + 1));
          dot.setAttribute("data-typing-deck-dot", TYPING_CENTER_DECK_ORDER[i]);
          dot.setAttribute("aria-pressed", "false");
          frag.appendChild(dot);
        }
        dotsRoot.innerHTML = "";
        dotsRoot.appendChild(frag);
      }

      var dots = dotsRoot.querySelectorAll ? dotsRoot.querySelectorAll(".deck-dot") : [];
      for (var d = 0; d < dots.length; d++) {
        var dotMode = String(dots[d].getAttribute("data-typing-deck-dot") || "");
        var active = (dotMode === m);
        dots[d].classList.toggle("is-active", active);
        dots[d].setAttribute("aria-pressed", active ? "true" : "false");
        if (active) dots[d].setAttribute("aria-current", "true");
        else dots[d].removeAttribute("aria-current");
      }
    }

    if (prevBtn) {
      prevBtn.disabled = false;
      prevBtn.setAttribute("aria-disabled", "false");
      prevBtn.classList.toggle("is-endpoint-fade", isAtStart);
    }
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.setAttribute("aria-disabled", "false");
      nextBtn.classList.toggle("is-endpoint-fade", isAtEnd);
    }

    if (progressText) {
      progressText.textContent = String(idx + 1) + "/" + String(TYPING_CENTER_DECK_ORDER.length);
    }

    if (hintText) {
      hintText.textContent = "";
      hintText.hidden = true;
      hintText.setAttribute("aria-hidden", "true");
    }

    if (startBtn) {
      setTypingCenterCtaLabels(startBtn, getTypingCenterCtaLabels(m));
    }
  }

  function setTypingCenterActiveMode(mode) {
    var cards = [
      { mode: "practice", el: getEl("typingModePractice") },
      { mode: "typeDefine", el: getEl("typingModeTypeDefine") },
      { mode: "race", el: getEl("typingModeRace") }
    ];

    var m = normalizeTypingCenterMode(mode);
    writeTypingCenterSelectedMode(m);

    for (var i = 0; i < cards.length; i++) {
      var el = cards[i].el;
      if (!el) continue;
      try { el.classList.remove("is-active"); } catch (e0) {}
      try { el.removeAttribute("aria-current"); } catch (e1) {}
    }

    for (var j = 0; j < cards.length; j++) {
      if (cards[j].mode !== m) continue;
      var el2 = cards[j].el;
      if (!el2) break;
      try { el2.classList.add("is-active"); } catch (e2) {}
      try { el2.setAttribute("aria-current", "true"); } catch (e3) {}
      break;
    }

    syncTypingCenterDeckUi(m);
  }

  function refreshTypingCenterUI() {
    var stored = readLastMode();
    var m = normalizeTypingCenterMode(stored || (runState && runState.mode) || "practice");
    var sel = normalizeTypingCenterMode(readTypingCenterSelectedMode() || m);

    var bestMode = (sel === "typeDefine") ? "practice" : sel;
    renderBestOnCenter(bestMode);
    setTypingCenterObjective(sel);
    setTypingCenterLastModeUI(m, !!stored);
    renderNgramRecommendedOnCard();
    renderNgramXpOnCard();

    // Pairs & Patterns: enable Review mistakes only when weakness data exists.
    try {
      var ppReviewBtn = getEl("ppReviewMistakesBtn");
      var ppReviewNote = getEl("ppReviewMistakesNote");
      if (ppReviewBtn) {
        var canReview = false;
        try { canReview = hasNgramReviewMistakesAvailable(readPpMode()); } catch (eNR) { canReview = false; }

        // If packs are missing entirely, keep it disabled.
        try {
          var d0 = getTypingDrillData();
          if (!d0 || !d0.packs || !d0.packs.length) canReview = false;
        } catch (eNP) {}

        ppReviewBtn.disabled = !canReview;
        try { ppReviewBtn.setAttribute("aria-disabled", canReview ? "false" : "true"); } catch (eAD) {}

        if (ppReviewNote && ppReviewNote.classList && ppReviewNote.classList.toggle) {
          ppReviewNote.classList.toggle("is-hidden", canReview);
          try { ppReviewNote.setAttribute("aria-hidden", canReview ? "true" : "false"); } catch (eAH) {}
        }
      }
    } catch (eR) {}
    renderTypeDefineStatsOnCard();
    renderTimeTrialBestPassOnCard();
    renderRaceFeaturedStatsOnCard();
    setTypingCenterActiveMode(sel);

    // Controls the visibility of the external Type & Define CTA row.
    try {
      var screen = getEl("screen-typing-center");
      if (screen && screen.classList) {
        screen.classList.toggle("is-typeDefine", sel === "typeDefine");
        screen.classList.toggle("is-timeTrial", sel === "timeTrial");
      }
    } catch (eC) {}

    // Type & Define: enable Review Mistakes only when mistakes exist.
    try {
      var reviewBtn = getEl("reviewTypeDefineMistakesBtn");
      var note = getEl("typeDefineReviewMistakesNote");
      if (reviewBtn) {
        var hasMistakes = false;
        try {
          if (window.State && typeof State.getTypeDefineStats === "function") {
            var st0 = State.getTypeDefineStats();
            var ws0 = (st0 && st0.wordStats && typeof st0.wordStats === "object") ? st0.wordStats : {};
            for (var k in ws0) {
              if (!ws0.hasOwnProperty(k)) continue;
              var rec = ws0[k];
              if (!rec || typeof rec !== "object") continue;
              var tm = (typeof rec.typeMiss === "number" && isFinite(rec.typeMiss)) ? (rec.typeMiss | 0) : (parseInt(rec.typeMiss, 10) | 0);
              var mmRaw = (rec && rec.hasOwnProperty("mcqMiss")) ? rec.mcqMiss : rec.meaningMiss;
              var mm = (typeof mmRaw === "number" && isFinite(mmRaw)) ? (mmRaw | 0) : (parseInt(mmRaw, 10) | 0);
              if ((tm | 0) + (mm | 0) > 0) { hasMistakes = true; break; }
            }
          }
        } catch (eS) { hasMistakes = false; }

        reviewBtn.disabled = !hasMistakes;
        try { reviewBtn.setAttribute("aria-disabled", hasMistakes ? "false" : "true"); } catch (eAD) {}

        if (note && note.classList && note.classList.toggle) {
          note.classList.toggle("is-hidden", hasMistakes);
          try { note.setAttribute("aria-hidden", hasMistakes ? "true" : "false"); } catch (eAH) {}
        }
      }
    } catch (eR) {}
  }

  function setText(id, value) {
    var el = getEl(id);
    if (el) el.textContent = value;
  }

  function setProgress(pct) {
    var el = getEl("raceProgressFill");
    if (!el) return;
    var v = Math.max(0, Math.min(100, pct));
    el.style.width = String(v) + "%";
  }

  function setTimeTrialCountdownRemainingFrac(frac) {
    var bar = getEl("raceTimeBar");
    var fill = getEl("raceTimeBarFill");
    if (!bar || !fill) return;

    var isTT = !!(runState && runState.mode === "timeTrial");
    if (!isTT) {
      bar.style.display = "none";
      return;
    }

    bar.style.display = "";

    var f = (typeof frac === "number" && isFinite(frac)) ? frac : 0;
    if (f < 0) f = 0;
    if (f > 1) f = 1;
    fill.style.width = String(Math.round(f * 1000) / 10) + "%";
  }

  function stopTick() {
    if (state.rafId) {
      try { cancelAnimationFrame(state.rafId); } catch (e) {}
    }
    state.rafId = 0;
  }

  // HUD snapshot (used to keep Time Trial explanations consistent with what the learner saw)
  var hudSnapshot = {
    seconds: 0,
    wpm: 0,
    accPct: 100
  };

  function tick() {
    if (!state.running) return;

    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var seconds = (now - state.startedAt) / 1000;

    // Time Trial countdown bar (remaining time)
    if (runState && runState.mode === "timeTrial") {
      var targetSec = getTimeTrialTargetSec();
      if (targetSec > 0) {
        setTimeTrialCountdownRemainingFrac((targetSec - seconds) / targetSec);
      } else {
        setTimeTrialCountdownRemainingFrac(0);
      }
    }

    // WPM should reflect prompt progress, not raw keystrokes (so retries/backspaces don't inflate speed).
    var wpm = computeWpm(runState.progressLen || 0, seconds);
    var acc = computeAcc(runState.totalAdded, runState.totalErrors);

    hudSnapshot.seconds = seconds;
    hudSnapshot.wpm = wpm;
    hudSnapshot.accPct = acc;

    if (runState && runState.drillKind === "ngrams") setText("raceWpm", "—");
    else setText("raceWpm", String(wpm));
    setText("raceAcc", String(acc) + "%");
    if (runState && runState.drillKind === "ngrams") setText("raceTime", "—");
    else setText("raceTime", seconds.toFixed(1) + "s");
    setText("raceMistakes", String(runState.totalErrors || 0));
    setText("raceStreak", String(computeCleanStreakChars(runState.prevValue || "", state.prompt || "")));

    updateGoalProgress();

    state.rafId = requestAnimationFrame(tick);
  }

  function updateStatsOnce() {
    if (!state.running) return;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var seconds = (now - state.startedAt) / 1000;

    var wpm = computeWpm(runState.progressLen || 0, seconds);
    var acc = computeAcc(runState.totalAdded, runState.totalErrors);

    hudSnapshot.seconds = seconds;
    hudSnapshot.wpm = wpm;
    hudSnapshot.accPct = acc;

    if (runState && runState.drillKind === "ngrams") setText("raceWpm", "—");
    else setText("raceWpm", String(wpm));
    setText("raceAcc", String(acc) + "%");
    if (runState && runState.drillKind === "ngrams") setText("raceTime", "—");
    else setText("raceTime", seconds.toFixed(1) + "s");
    setText("raceMistakes", String(runState.totalErrors || 0));
    setText("raceStreak", String(computeCleanStreakChars(runState.prevValue || "", state.prompt || "")));

    updateGoalProgress();
  }

  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return String(m) + ":" + (s < 10 ? ("0" + String(s)) : String(s));
  }

  var BEST_WPM_KEY = "bolo_typing_best_wpm";
  var BEST_ACC_KEY = "bolo_typing_best_acc";
  var BEST_TIME_MS_KEY = "bolo_typing_best_time_ms";
  var BEST_TIME_LEGACY_KEY = "bolo_typing_best_time";

  // Best scores v2 (per-mode, JSON; backwards compatible)
  var BEST_V2_KEY = "bolo_typing_best_v2";

  function clampInt(n, min, max) {
    var v = (typeof n === "number" && isFinite(n)) ? n : 0;
    v = Math.round(v);
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
  }

  function getBestLegacy() {
    try {
      var bestWpmKey = typingProfileKey(BEST_WPM_KEY);
      var bestAccKey = typingProfileKey(BEST_ACC_KEY);
      var bestTimeMsKey = typingProfileKey(BEST_TIME_MS_KEY);
      var bestTimeLegacyKey = typingProfileKey(BEST_TIME_LEGACY_KEY);
      var bestTimeTrialKey30 = typingProfileKey(BEST_TIME_TRIAL_MS_KEY_30);
      var bestTimeTrialLegacyKey = typingProfileKey(BEST_TIME_TRIAL_MS_KEY_LEGACY);

      var wpm = parseFloat(localStorage.getItem(bestWpmKey) || "0") || 0;
      var accRaw = parseFloat(localStorage.getItem(bestAccKey) || "0") || 0;
      // Back-compat: old versions stored accuracy as a fraction (0..1)
      var accPct = (accRaw > 0 && accRaw <= 1) ? Math.round(accRaw * 100) : Math.round(accRaw);
      accPct = clampInt(accPct, 0, 100);

      var timeMs = parseInt(localStorage.getItem(bestTimeMsKey) || "0", 10) || 0;
      if (!(timeMs > 0)) timeMs = parseInt(localStorage.getItem(bestTimeLegacyKey) || "0", 10) || 0;
      if (!(timeMs > 0)) timeMs = 0;

      ensureLegacyTimeTrialBestMigrated();
      // Legacy had a single Time Trial best time; treat it as 30s for migration.
      var ttMs = parseInt(localStorage.getItem(bestTimeTrialKey30) || "0", 10) || 0;
      if (!(ttMs > 0)) ttMs = parseInt(localStorage.getItem(bestTimeTrialLegacyKey) || "0", 10) || 0;
      if (!(ttMs > 0)) ttMs = 0;

      return { wpm: wpm, accPct: accPct, timeMs: timeMs, timeTrialMs: ttMs };
    } catch (e) {
      return { wpm: 0, accPct: 0, timeMs: 0, timeTrialMs: 0 };
    }
  }

  function defaultBestModeObj() {
    return { bestWpm: 0, bestAcc: 0, bestTimeMs: 0, updatedAt: 0 };
  }

  function nowMs() {
    try { return Date.now ? Date.now() : (new Date()).getTime(); } catch (e) { return 0; }
  }

  function normalizeModeKey(modeKey) {
    var m = String(modeKey || "");
    if (m === "practice" || m === "race" || m === "timeTrial" || m === "lessons") return m;
    return "race";
  }

  function loadBestV2() {
    try {
      var raw = localStorage.getItem(typingProfileKey(BEST_V2_KEY));
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") return null;
      return obj;
    } catch (e) {
      return null;
    }
  }

  function saveBestV2(data) {
    try {
      localStorage.setItem(typingProfileKey(BEST_V2_KEY), JSON.stringify(data || {}));
    } catch (e) {}
  }

  function ensureBestV2Migrated() {
    var existing = loadBestV2();
    if (existing) return;

    var legacy = getBestLegacy();
    var t = nowMs();
    var v2 = {
      race: defaultBestModeObj(),
      practice: defaultBestModeObj(),
      lessons: defaultBestModeObj(),
      timeTrial: defaultBestModeObj()
    };

    // Migration semantics (low-risk): legacy global bests map to Race.
    if (legacy) {
      if (legacy.wpm > 0) v2.race.bestWpm = legacy.wpm;
      if (legacy.accPct > 0) v2.race.bestAcc = legacy.accPct;
      if (legacy.timeMs > 0) v2.race.bestTimeMs = legacy.timeMs;
      if (legacy.timeTrialMs > 0) v2.timeTrial.bestTimeMs = legacy.timeTrialMs;
    }
    v2.race.updatedAt = t;
    if (v2.timeTrial.bestTimeMs > 0) v2.timeTrial.updatedAt = t;

    saveBestV2(v2);
  }

  function getBestForMode(modeKey) {
    ensureBestV2Migrated();
    var m = normalizeModeKey(modeKey);
    var data = loadBestV2();
    if (!data) return defaultBestModeObj();
    var b = data[m];
    if (!b || typeof b !== "object") return defaultBestModeObj();

    // Defensive normalization
    var out = defaultBestModeObj();
    out.bestWpm = (typeof b.bestWpm === "number" && isFinite(b.bestWpm)) ? b.bestWpm : (parseFloat(b.bestWpm) || 0);
    out.bestAcc = clampInt(parseFloat(b.bestAcc) || 0, 0, 100);
    out.bestTimeMs = parseInt(b.bestTimeMs, 10) || 0;
    if (out.bestTimeMs < 0) out.bestTimeMs = 0;
    out.updatedAt = parseInt(b.updatedAt, 10) || 0;
    return out;
  }

  function updateBestV2(modeKey, metrics, opts) {
    ensureBestV2Migrated();
    var m = normalizeModeKey(modeKey);
    var data = loadBestV2() || {};
    if (!data[m] || typeof data[m] !== "object") data[m] = defaultBestModeObj();

    var cur = getBestForMode(m);
    var changed = false;
    var t = nowMs();
    var options = opts || {};

    var w = (metrics && metrics.wpm != null) ? (parseFloat(metrics.wpm) || 0) : 0;
    var a = (metrics && metrics.accPct != null) ? clampInt(parseFloat(metrics.accPct) || 0, 0, 100) : 0;
    var ms = (metrics && metrics.timeMs != null) ? (parseInt(metrics.timeMs, 10) || 0) : 0;
    if (ms < 0) ms = 0;

    if (w > 0 && w > cur.bestWpm) {
      data[m].bestWpm = w;
      changed = true;
    }
    if (a > 0 && a > cur.bestAcc) {
      data[m].bestAcc = a;
      changed = true;
    }

    var skipTime = !!options.skipTime;
    if (!skipTime && ms > 0 && (cur.bestTimeMs === 0 || ms < cur.bestTimeMs)) {
      data[m].bestTimeMs = ms;
      changed = true;
    }

    if (changed) {
      data[m].updatedAt = t;
      saveBestV2(data);
    }

    return { changed: changed };
  }

  function renderBestOnCenter(modeKey) {
    var el = getEl("typingCenterSubtitle");
    if (!el) return;
    el.textContent = "Practice. Learn words. Race.";
    var paEl = getEl("typingCenterSubtitlePa");
    if (paEl) paEl.textContent = "ਅਭਿਆਸ ਕਰੋ। ਸ਼ਬਦ ਸਿੱਖੋ। ਰੇਸ ਕਰੋ।";
  }

  function computeTopMistakes(prompt, typed, missCounts) {
    // Prefer missCounts (accurate for this app because finishing requires exact match)
    if (missCounts) {
      var arr2 = [];
      for (var k2 in missCounts) {
        if (missCounts.hasOwnProperty(k2) && missCounts[k2] > 0) arr2.push([k2, missCounts[k2]]);
      }
      arr2.sort(function(a, b) { return b[1] - a[1]; });
      return arr2.slice(0, 3);
    }

    // Fallback (works if caller passes non-matching prompt/typed)
    if (!prompt) prompt = "";
    if (!typed) typed = "";

    var counts = {};
    var n = Math.min(prompt.length, typed.length);
    for (var i = 0; i < n; i++) {
      var pch = prompt.charAt(i);
      var tch = typed.charAt(i);
      if (pch !== tch) {
        var key = (pch === " ") ? "[space]" : String(pch).toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    }

    var arr = [];
    for (var k in counts) if (counts.hasOwnProperty(k)) arr.push([k, counts[k]]);
    arr.sort(function(a, b) { return b[1] - a[1]; });
    return arr.slice(0, 3);
  }

  function formatTopMistakes(top) {
    if (!top || !top.length) return "Great accuracy — no common misses detected.";
    var out = [];
    for (var i = 0; i < top.length; i++) out.push(top[i][0]);
    return "Most missed: " + out.join(", ");
  }

  function incMap(map, key, by) {
    if (!map || !key) return;
    if (by == null) by = 1;
    if (map[key] == null) map[key] = 0;
    map[key] += by;
  }

  function topKFromMap(map, k) {
    var arr = [];
    if (!map) return arr;
    for (var key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        arr.push({ key: key, n: map[key] });
      }
    }
    arr.sort(function(a, b) {
      if (b.n !== a.n) return b.n - a.n;
      return (a.key.length || 0) - (b.key.length || 0);
    });
    return arr.slice(0, k);
  }

  function labelCharForUI(key) {
    if (key === "[space]" || key === " ") return "space";
    if (key === "\n") return "newline";
    if (key === "\t") return "tab";
    if (!key) return "missing";
    if (String(key).length === 1) return "'" + String(key) + "'";
    return "'" + String(key) + "'";
  }

  function labelBigramForUI(bi) {
    if (!bi) return "''";
    var s = String(bi);
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === " ") out += "␠";
      else if (ch === "\n") out += "↵";
      else if (ch === "\t") out += "⇥";
      else out += ch;
    }
    return "'" + out + "'";
  }

  function buildRaceFeedbackText(missCounts, bigramCounts) {
    var charTop = topKFromMap(missCounts || {}, 3);
    var bigTop = topKFromMap(bigramCounts || {}, 3);

    var lines = [];
    lines.push("Top mistakes");

    if (charTop.length) {
      var a = [];
      for (var i = 0; i < charTop.length; i++) {
        a.push(labelCharForUI(charTop[i].key) + " (" + String(charTop[i].n) + ")");
      }
      lines.push("• Characters: " + a.join(", "));
    } else {
      lines.push("• Characters: none");
    }

    // Only show bigrams if they add signal
    if (bigTop.length && bigTop[0].n >= 2) {
      var b = [];
      for (var j = 0; j < bigTop.length; j++) {
        b.push(labelBigramForUI(bigTop[j].key) + " (" + String(bigTop[j].n) + ")");
      }
      lines.push("• Patterns: " + b.join(", "));
    }

    if (runState && runState.drillKind === "ngrams") lines.push("Tip: go slow and aim for clean patterns.");
    else lines.push("Tip: slow down for accuracy, then speed up.");
    return lines.join("\n");
  }

  function renderRaceTips(text) {
    var el = document.getElementById("raceTopMistakes");
    if (el) {
      el.textContent = String(text || "");
      return;
    }

    // Fallback: append into the active modal if it exists
    var modal = document.getElementById("typingResultModal");
    if (!modal) return;
    var card = modal.querySelector(".modal-card") || modal;

    el = document.createElement("p");
    el.id = "raceTopMistakes";
    el.className = "race-result__tips";
    el.setAttribute("aria-live", "polite");
    el.textContent = String(text || "");
    card.appendChild(el);
  }

  var toastTimer = null;
  function toast(msg) {
    var host = getEl("toastHost");
    if (!host) return;
    host.textContent = String(msg || "");
    host.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      host.classList.remove("is-visible");
    }, 1600);
  }

  var LAST_MODE_KEY = "bolo_typing_last_mode";

  function readLastMode() {
    try {
      var v = localStorage.getItem(typingProfileKey(LAST_MODE_KEY));
      return (v === "practice" || v === "race" || v === "typeDefine") ? v : null;
    } catch (e) {
      return null;
    }
  }

  function writeLastMode(mode) {
    try {
      localStorage.setItem(typingProfileKey(LAST_MODE_KEY), String(mode || ""));
    } catch (e) {
      // no-op
    }
  }

  function saveBest(wpm, accPct, elapsedMs, opts) {
    try {
      // Always update v2 for the active mode.
      // (Legacy keys remain race-only for backward compatibility.)
      var modeKey = normalizeModeKey((runState && runState.mode) ? runState.mode : "race");

      var w = (typeof wpm === "number" && isFinite(wpm)) ? wpm : (parseFloat(wpm) || 0);
      var a = clampInt(parseFloat(accPct) || 0, 0, 100);
      var t = (typeof elapsedMs === "number" && isFinite(elapsedMs)) ? Math.round(elapsedMs) : (parseInt(elapsedMs, 10) || 0);
      if (t < 0) t = 0;

      updateBestV2(modeKey, { wpm: w, accPct: a, timeMs: t }, opts);

      // Legacy write: keep previous behavior scoped to Race only.
      if (modeKey !== "race") return;

      var bestWpmKey = typingProfileKey(BEST_WPM_KEY);
      var bestAccKey = typingProfileKey(BEST_ACC_KEY);
      var bestTimeMsKey = typingProfileKey(BEST_TIME_MS_KEY);
      var bestTimeLegacyKey = typingProfileKey(BEST_TIME_LEGACY_KEY);

      var bestWpm = parseFloat(localStorage.getItem(bestWpmKey) || "0") || 0;
      var bestAccRaw = parseFloat(localStorage.getItem(bestAccKey) || "0") || 0;
      var bestAccPct = (bestAccRaw > 0 && bestAccRaw <= 1) ? Math.round(bestAccRaw * 100) : Math.round(bestAccRaw);
      bestAccPct = clampInt(bestAccPct, 0, 100);

      var bestTimeMs = parseInt(localStorage.getItem(bestTimeMsKey) || "0", 10) || 0;
      if (!(bestTimeMs > 0)) bestTimeMs = parseInt(localStorage.getItem(bestTimeLegacyKey) || "0", 10) || 0;
      if (!(bestTimeMs > 0)) bestTimeMs = 0;

      // Independent updates
      if (w > bestWpm) {
        localStorage.setItem(bestWpmKey, String(w));
      }
      if (a > bestAccPct) {
        localStorage.setItem(bestAccKey, String(a));
      }
      // Best time is the MIN non-zero time
      var skipTime = !!(opts && opts.skipTime);
      if (!skipTime && t > 0 && (bestTimeMs === 0 || t < bestTimeMs)) {
        localStorage.setItem(bestTimeMsKey, String(t));
        // Back-compat write
        localStorage.setItem(bestTimeLegacyKey, String(t));
      }
    } catch (e) {
      // no-op
    }
  }

  function saveBestTimeTrial(elapsedMs) {
    try {
      var t = (typeof elapsedMs === "number" && isFinite(elapsedMs)) ? Math.round(elapsedMs) : (parseInt(elapsedMs, 10) || 0);
      if (!(t > 0)) return;

      // v2: Time Trial best time is the best PASS time.
      updateBestV2("timeTrial", { timeMs: t }, { skipWpmAcc: true });

      ensureLegacyTimeTrialBestMigrated();

      var targetSec = getTimeTrialTargetSec();
      var bestKey = getBestTimeTrialMsKeyForTargetSec(targetSec);

      var best = parseInt(localStorage.getItem(bestKey) || "0", 10) || 0;
      var isNewBest = (!(best > 0) || t < best);
      if (isNewBest) {
        localStorage.setItem(bestKey, String(t));

        // PASS-only best record with metadata (Time Trial)
        try {
          var sec = Math.max(0, Math.round((t / 1000) * 10) / 10);
          var rec = {
            bestSec: sec,
            targetSec: targetSec,
            accPct: (hudSnapshot && typeof hudSnapshot.accPct === "number") ? hudSnapshot.accPct : 0,
            promptLen: (runState && runState.timeTrialPromptLen) ? (runState.timeTrialPromptLen | 0) : 0,
            wordCount: (runState && runState.timeTrialWordCount) ? (runState.timeTrialWordCount | 0) : 0,
            ts: (Date.now ? Date.now() : (new Date()).getTime())
          };
          if (_tpStorage && typeof _tpStorage.setTimeTrialBestMetaForDuration === "function") {
            _tpStorage.setTimeTrialBestMetaForDuration(targetSec, rec);
          } else if (_tpStorage && typeof _tpStorage.setTimeTrialBestMeta === "function" && normalizeTimeTrialDurationSec(targetSec) === 30) {
            // 30s uses legacy key.
            _tpStorage.setTimeTrialBestMeta(rec);
          } else {
            // Fallback storage
            try {
              var k = (normalizeTimeTrialDurationSec(targetSec) === 60) ? "bolo_typing_best_time_trial_v1_60" : "bolo_typing_best_time_trial_v1";
              k = typingProfileKey(k);
              localStorage.setItem(k, JSON.stringify(rec));
            } catch (e3) {}
          }
        } catch (e2) {}
      }
    } catch (e) {}
  }

  // Global modal cleanup (prevents document-level listener leaks on navigation/re-open)
  var typingResultModalCleanupFn = null;
  function cleanupTypingResultModal(opts) {
    var options = opts || {};
    try {
      if (typeof typingResultModalCleanupFn === "function") typingResultModalCleanupFn(options);
    } catch (e0) {}
    typingResultModalCleanupFn = null;
    try {
      var old = getEl("typingResultModal");
      if (old && old.parentNode) old.parentNode.removeChild(old);
    } catch (e1) {}
  }

  function showResultModal(wpm, acc, elapsedMs, errors, tipsText, feedbackText, coachText, primaryLabel, onPrimary, secondaryLabel, onSecondary, meta) {
    // Ensure any previous modal is fully torn down (listeners + DOM).
    cleanupTypingResultModal({ restoreFocus: false });

    var prevFocusEl = null;
    try { prevFocusEl = document.activeElement; } catch (ePrev) { prevFocusEl = null; }

    // Ensure mobile scroll lock never persists into modal interactions.
    try {
      document.documentElement.classList.remove("typing-scroll-lock");
      document.body.classList.remove("typing-scroll-lock");
    } catch (e0) {}

    var keyHandler = null;
    var focusInHandler = null;
    function isElementStillInDocument(el) {
      try {
        if (!el) return false;
        if (!document || !document.body || !document.body.contains) return false;
        return !!document.body.contains(el);
      } catch (e) {
        return false;
      }
    }

    function teardownModal(restoreFocus) {
      try {
        if (keyHandler) document.removeEventListener("keydown", keyHandler);
      } catch (e0) {}
      try {
        if (focusInHandler) document.removeEventListener("focusin", focusInHandler, true);
      } catch (e1) {}
      keyHandler = null;
      focusInHandler = null;
      try {
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      } catch (e2) {}

      if (restoreFocus) {
        try {
          if (prevFocusEl && prevFocusEl.focus && isElementStillInDocument(prevFocusEl)) {
            prevFocusEl.focus();
          }
        } catch (e3) {}
      }
    }

    function closeModal() {
      teardownModal(true);
      // Only clear if we're still the active global cleanup.
      try { if (typingResultModalCleanupFn) typingResultModalCleanupFn = null; } catch (e0) {}
    }

    var backdrop = document.createElement("div");
    backdrop.id = "typingResultModal";
    backdrop.className = "modal-backdrop active";
    backdrop.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Typing result");

    var card = document.createElement("div");
    card.className = "modal-card";

    // Focus trap helpers
    function getFocusableElements(rootEl) {
      if (!rootEl || !rootEl.querySelectorAll) return [];
      var nodes = rootEl.querySelectorAll("button, [href], input, select, textarea, [tabindex]");
      var out = [];
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (!el) continue;
        if (el.disabled) continue;
        var tn = String(el.tagName || "").toLowerCase();
        if (tn === "input" || tn === "select" || tn === "textarea" || tn === "button" || tn === "a") {
          // ok
        } else {
          // tabindex-based
          var ti = el.getAttribute ? el.getAttribute("tabindex") : null;
          if (ti === "-1") continue;
        }
        // Skip elements that are effectively hidden
        try {
          if (el.getClientRects && el.getClientRects().length === 0) continue;
        } catch (e0) {}
        out.push(el);
      }
      return out;
    }

    function trapTabKey(ev) {
      var focusables = getFocusableElements(card);
      if (!focusables.length) return;

      var active = null;
      try { active = document.activeElement; } catch (e0) { active = null; }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var isShift = !!(ev && ev.shiftKey);

      // If focus has escaped, pull it back in.
      if (!active || !isElementStillInDocument(active) || focusables.indexOf(active) === -1) {
        try {
          if (first && first.focus) first.focus();
          if (ev && ev.preventDefault) ev.preventDefault();
        } catch (e1) {}
        return;
      }

      if (!isShift && active === last) {
        try {
          if (first && first.focus) first.focus();
          if (ev && ev.preventDefault) ev.preventDefault();
        } catch (e2) {}
        return;
      }

      if (isShift && active === first) {
        try {
          if (last && last.focus) last.focus();
          if (ev && ev.preventDefault) ev.preventDefault();
        } catch (e3) {}
      }
    }

    var title = document.createElement("h3");
    var titleText = (meta && meta.title) ? String(meta.title) : "Race Complete";
    title.textContent = titleText;
    card.appendChild(title);

    var p = document.createElement("p");
    p.style.marginTop = "6px";
    var isDrillModal = !!(meta && meta.isDrill);
    var isRaceMode = !!(runState && runState.mode === "race");
    if (isDrillModal) {
      p.textContent =
        "Accuracy: " + String(Math.round(acc)) + "%" +
        " • Mistakes: " + String(errors);
    } else {
      p.textContent =
        "Time: " + formatTime(elapsedMs) +
        " • WPM: " + String(Math.round(wpm)) +
        " • Accuracy: " + String(Math.round(acc)) + "%" +
        " • " + (isRaceMode ? "Errors" : "Mistakes") + ": " + String(errors);
    }
    card.appendChild(p);

    if (coachText) {
      var coach = document.createElement("p");
      coach.id = "typingCoachLine";
      coach.className = "typing-coach-line";
      coach.style.marginTop = "8px";
      coach.textContent = String(coachText);
      card.appendChild(coach);
    }

    var tips = document.createElement("p");
    tips.id = "raceTopMistakes";
    tips.className = "race-result__tips";
    tips.setAttribute("aria-live", "polite");
    tips.style.marginTop = "10px";
    tips.textContent = String(tipsText || "");
    card.appendChild(tips);

    var fb = document.createElement("div");
    fb.id = "raceFeedback";
    fb.className = "race-feedback";
    fb.setAttribute("aria-live", "polite");
    fb.style.marginTop = "10px";
    fb.textContent = String(feedbackText || "");
    card.appendChild(fb);

    var copyRow = document.createElement("div");
    copyRow.className = "button-row";
    copyRow.style.marginTop = "10px";

    var copyBtn = document.createElement("button");
    copyBtn.id = "typingCopyFeedbackBtn";
    copyBtn.className = "btn btn-secondary";
    copyBtn.type = "button";
    copyBtn.textContent = "Copy feedback";
    copyBtn.addEventListener("click", function() {
      // Build plain text diagnostics from what we already render.
      // Guard all clipboard paths; must not throw.
      var lines = [];
      try {
        var modeLabel = (runState && runState.mode) ? String(runState.mode) : "";
        var promptText = (runState && runState.promptEn) ? String(runState.promptEn) : "";
        var promptPa = (runState && runState.promptPa) ? String(runState.promptPa) : "";

        lines.push("Typing result");
        if (modeLabel) lines.push("Mode: " + modeLabel);
        var isDrillCopy = !!(meta && meta.isDrill);
        if (isDrillCopy) {
          lines.push(
            "Accuracy: " + String(Math.round(acc)) + "%" +
            " | Mistakes: " + String(errors)
          );
        } else {
          lines.push(
            "Time: " + formatTime(elapsedMs) +
            " | WPM: " + String(Math.round(wpm)) +
            " | Accuracy: " + String(Math.round(acc)) + "%" +
            " | " + (isRaceMode ? "Errors" : "Mistakes") + ": " + String(errors)
          );
        }

        if (promptText) {
          lines.push("");
          lines.push("Prompt: " + promptText);
          if (promptPa) lines.push("Punjabi: " + promptPa);
        }

        lines.push("");
        lines.push("Diagnostics");
        if (tipsText) lines.push(String(tipsText));
        if (feedbackText) lines.push(String(feedbackText));
        if (coachText) {
          lines.push("");
          lines.push("Coach: " + String(coachText));
        }
      } catch (e0) {
        lines = [];
        if (tipsText) lines.push(String(tipsText));
        if (feedbackText) lines.push(String(feedbackText));
      }

      var text = String(lines.join("\n")).replace(/^\s+|\s+$/g, "");
      if (!text) {
        toast("Nothing to copy");
        return;
      }

      function tryExecCommandCopy(payload) {
        try {
          var ta = document.createElement("textarea");
          ta.value = String(payload);
          ta.setAttribute("readonly", "readonly");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          ta.style.top = "0";
          document.body.appendChild(ta);
          try { ta.select(); } catch (e1) {}
          try { ta.setSelectionRange(0, ta.value.length); } catch (e2) {}

          if (document.execCommand) {
            var ok = false;
            try { ok = !!document.execCommand("copy"); } catch (e3) { ok = false; }
            try { document.body.removeChild(ta); } catch (e4) {}
            if (ok) { toast("Copied"); return true; }
            toast("Copy failed");
            return true;
          }

          try { document.body.removeChild(ta); } catch (e5) {}
          return false;
        } catch (e6) {
          return false;
        }
      }

      try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            toast("Copied");
          }).catch(function() {
            if (!tryExecCommandCopy(text)) toast("Clipboard not supported");
          });
          return;
        }
      } catch (e7) {
        // fall through
      }

      if (!tryExecCommandCopy(text)) toast("Clipboard not supported");
    });

    copyRow.appendChild(copyBtn);
    card.appendChild(copyRow);

    var row = document.createElement("div");
    row.className = "button-row";
    row.style.marginTop = "10px";

    var primary = document.createElement("button");
    primary.className = "btn";
    primary.type = "button";
    primary.textContent = String(primaryLabel || "Next");
    primary.addEventListener("click", function() {
      closeModal();
      if (typeof onPrimary === "function") onPrimary();
    });

    var secondary = document.createElement("button");
    secondary.className = "btn btn-secondary";
    secondary.type = "button";
    secondary.textContent = String(secondaryLabel || "Back");
    secondary.addEventListener("click", function() {
      closeModal();
      if (typeof onSecondary === "function") onSecondary();
    });

    row.appendChild(primary);
    row.appendChild(secondary);
    card.appendChild(row);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    // Minimal keyboard/focus support
    try {
      keyHandler = function(ev) {
        try {
          var k = ev && (ev.key || ev.keyCode);
          if (k === "Escape" || k === "Esc" || k === 27) {
            closeModal();
            return;
          }

          // Focus trap (Tab cycles within modal)
          if (k === "Tab" || k === 9) {
            trapTabKey(ev);
          }
        } catch (e0) {}
      };
      document.addEventListener("keydown", keyHandler);
    } catch (e1) {}

    // Focus containment guard: if focus escapes (mouse/programmatic), pull it back.
    try {
      focusInHandler = function(ev) {
        try {
          if (!isElementStillInDocument(backdrop)) return;
          var t = ev && ev.target;
          if (!t) return;
          if (card && card.contains && card.contains(t)) return;

          var focusables = getFocusableElements(card);
          var target = focusables.length ? focusables[0] : primary;
          if (target && target.focus) target.focus();
          if (ev && ev.preventDefault) ev.preventDefault();
        } catch (e0) {}
      };
      document.addEventListener("focusin", focusInHandler, true);
    } catch (e2) {}

    // Register global teardown so navigation/re-open can’t leak listeners.
    typingResultModalCleanupFn = function(options) {
      var restore = !(options && options.restoreFocus === false);
      teardownModal(restore);
    };

    try {
      if (primary && primary.focus) primary.focus();
    } catch (e2) {}

    backdrop.addEventListener("click", function(ev) {
      if (ev.target === backdrop) {
        closeModal();
      }
    });
  }

  function resetRaceUIToPrompt(promptEl, inputEl, promptObj) {
    resetRun(promptObj);
    state.prompt = runState.promptEn;
    state.startedAt = 0;
    state.running = false;
    state.totalTyped = 0;
    state.totalErrors = 0;
    stopTick();

    if (promptEl) renderPromptWithHighlight(promptEl, "", state.prompt);
    if (inputEl) {
      inputEl.value = "";
      inputEl.disabled = true;
    }

    setText("raceWpm", "0");
    setText("raceAcc", "100%");
    setText("raceTime", "0.0s");
    setText("raceMistakes", "0");
    setText("raceStreak", "0");
    setProgress(0);

    // Reset countdown bar (Time Trial only)
    if (runState && runState.mode === "timeTrial") setTimeTrialCountdownRemainingFrac(1);
    else setTimeTrialCountdownRemainingFrac(0);

    renderRaceTips("");

    var fb = document.getElementById("raceFeedback");
    if (fb) fb.textContent = "";

    setRaceModeUI();
    updateGoalProgress("");

    // Guided UX defaults: intent + button sequencing + card state
    try {
      var intentEl = getEl("raceIntentLine");
      if (intentEl) {
        intentEl.textContent = (runState && runState.drillKind === "ngrams")
          ? "Type the pattern carefully • Accuracy first"
          : (runState && runState.mode === "typeDefine")
            ? "Type carefully • Then choose the meaning"
            : (runState && runState.mode === "timeTrial")
              ? "Smooth and accurate • Watch the target time"
              : (runState && runState.mode === "lessons")
                ? "One clean run • Accuracy first"
                : (runState && runState.mode === "practice")
                  ? "Type the word carefully • Accuracy first"
                  : "Type carefully • Accuracy first";
        try { intentEl.classList.remove("is-ok"); } catch (e0) {}
        try { intentEl.classList.remove("is-warn"); } catch (e1) {}
      }
    } catch (eI) {}

    try {
      var card = getEl("racePromptCard");
      if (card && card.classList) {
        card.classList.remove("is-active");
        card.classList.remove("is-success");
      }
    } catch (eC) {}

    try {
      var raceScreen = getEl("screen-typing-race");
      if (raceScreen && raceScreen.classList) {
        raceScreen.classList.remove("typing-focus-mode");
      }
      var focusBtn = getEl("raceFocusBtn");
      if (focusBtn) {
        try { focusBtn.setAttribute("aria-pressed", "false"); } catch (e0) {}
        try { if (focusBtn.classList) focusBtn.classList.remove("is-active"); } catch (e1) {}
      }
    } catch (eF) {}

    try {
      var startBtn = getEl("raceStartBtn");
      var resetBtn = getEl("raceResetBtn");
      var focusBtn = getEl("raceFocusBtn");
      var nextBtn = getEl("raceNextBtn");

      var isTypeDefineMode = !!((runState && runState.mode === "typeDefine") || isTypeDefineActive());

      if (isTypeDefineMode) {
        // Type & Define should flow continuously; Start is not part of the loop.
        if (startBtn) startBtn.style.display = "none";
        if (resetBtn) resetBtn.style.display = "";
        if (focusBtn) focusBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        if (resetBtn) {
          resetBtn.textContent = "New Word";
          try { resetBtn.setAttribute("aria-label", "Load a new word"); } catch (eAR0) {}
        }
      } else {
        if (startBtn) startBtn.style.display = "";
        if (resetBtn) resetBtn.style.display = "none";
        if (focusBtn) focusBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
      }

      if (nextBtn && nextBtn.classList) {
        nextBtn.classList.remove("is-primary");
        nextBtn.classList.add("is-accent");
      }
      if (startBtn && startBtn.classList) {
        startBtn.classList.add("is-primary");
      }
      if (resetBtn && resetBtn.classList) {
        if (isTypeDefineMode) resetBtn.classList.add("is-primary");
        else resetBtn.classList.remove("is-primary");
      }
    } catch (eB) {}
  }

  function resetRaceUI(promptEl, inputEl) {
    var promptObj = pickPrompt();
    resetRaceUIToPrompt(promptEl, inputEl, promptObj);
  }

  // Countdown state (cancellable; avoids updating DOM after navigation)
  var countdownState = {
    active: false,
    timers: []
  };

  function cancelCountdown() {
    if (!countdownState.active && (!countdownState.timers || !countdownState.timers.length)) {
      // Still ensure overlay is hidden if present.
      var o = getEl("raceCountdown");
      if (o) {
        try { o.classList.remove("is-visible"); } catch (e0) {}
        try { o.setAttribute("aria-hidden", "true"); } catch (e1) {}
        try {
          var n0 = getEl("raceCountdownNum");
          if (n0) n0.textContent = "3";
          var m0 = o.querySelector ? o.querySelector(".race-countdown__msg") : null;
          if (m0) m0.textContent = "Get ready…";
        } catch (e2) {}
      }
      return;
    }

    countdownState.active = false;
    try {
      for (var i = 0; i < countdownState.timers.length; i++) {
        try { clearTimeout(countdownState.timers[i]); } catch (e2) {}
      }
    } catch (e3) {}
    countdownState.timers = [];

    var overlay = getEl("raceCountdown");
    if (overlay) {
      try { overlay.classList.remove("is-visible"); } catch (e4) {}
      try { overlay.setAttribute("aria-hidden", "true"); } catch (e5) {}
      try {
        var n1 = getEl("raceCountdownNum");
        if (n1) n1.textContent = "3";
        var m1 = overlay.querySelector ? overlay.querySelector(".race-countdown__msg") : null;
        if (m1) m1.textContent = "Get ready…";
      } catch (e6) {}
    }
  }

  function runCountdown(done) {
    cancelCountdown();

    var overlay = getEl("raceCountdown");
    var numEl = getEl("raceCountdownNum");
    var msgEl = null;

    if (!overlay || !numEl) {
      if (typeof done === "function") done();
      return;
    }

    try {
      msgEl = overlay.querySelector ? overlay.querySelector(".race-countdown__msg") : null;
      if (msgEl) msgEl.textContent = "Get ready…";
    } catch (e00) {
      msgEl = null;
    }

    // Ensure polite announcements without treating this as a dialog.
    try {
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");
      overlay.setAttribute("aria-atomic", "true");
    } catch (e0) {}

    countdownState.active = true;

    function schedule(fn, ms) {
      var id = setTimeout(fn, ms);
      countdownState.timers.push(id);
      return id;
    }

    try { overlay.classList.add("is-visible"); } catch (e1) {}
    try { overlay.setAttribute("aria-hidden", "false"); } catch (e2) {}

    var n = 3;
    function step() {
      if (!countdownState.active) return;

      // If countdown is active but DOM is missing (navigation/markup change), fail open.
      try {
        if (!overlay || !numEl) {
          cancelCountdown();
          if (typeof done === "function") done();
          return;
        }
        if (document && document.body && document.body.contains) {
          if (!document.body.contains(overlay) || !document.body.contains(numEl)) {
            cancelCountdown();
            if (typeof done === "function") done();
            return;
          }
        }
      } catch (e0) {}

      if (n >= 1) {
        try { numEl.textContent = String(n); } catch (e3) {}
        try { if (msgEl) msgEl.textContent = "Get ready…"; } catch (e3b) {}
        n -= 1;
        schedule(step, 650);
        return;
      }

      try { numEl.textContent = "Go"; } catch (e4) {}
      try { if (msgEl) msgEl.textContent = "Type now"; } catch (e4b) {}
      schedule(function() {
        if (!countdownState.active) return;
        try { overlay.classList.remove("is-visible"); } catch (e5) {}
        try { overlay.setAttribute("aria-hidden", "true"); } catch (e6) {}
        countdownState.active = false;
        countdownState.timers = [];
        try { if (msgEl) msgEl.textContent = "Get ready…"; } catch (e7) {}
        if (typeof done === "function") done();
      }, 350);
    }

    step();
  }

  // Typing Race-only countdown helper.
  // Ensures input stays disabled until the GO moment.
  function startTypingCountdown(onGoCallback) {
    // Guard: keep the typing input disabled during the countdown.
    try {
      var inputEl = findActiveTypingInputEl() || getEl("raceInput");
      if (inputEl) {
        inputEl.disabled = true;
        try { if (document && document.activeElement === inputEl && inputEl.blur) inputEl.blur(); } catch (e1) {}
      }
    } catch (e0) {}

    runCountdown(function() {
      if (typeof onGoCallback === "function") onGoCallback();
    });
  }

  function bindTypingCenter() {
    var race = getEl("typingModeRace");
    var practice = getEl("typingModePractice");
    var timeTrial = getEl("typingModeTimeTrial");
    var ngrams = getEl("typingModeNgrams");
    var typeDefine = getEl("typingModeTypeDefine");

    var ngramsStart = getEl("typingNgramsStartBtn");
    var ppReviewMistakesBtn = getEl("ppReviewMistakesBtn");
    var ppModeSlider = getEl("ppModeSlider");
    var ppModeHint = getEl("ppModeHint");

    var ppChangePackBtn = getEl("ppChangePackBtn");
    var ppPackChooserCloseBtn = getEl("ppPackChooserCloseBtn");

    var tt30 = getEl("typingTimeTrial30Btn");
    var tt60 = getEl("typingTimeTrial60Btn");
    var ttStart = getEl("typingTimeTrialStartBtn");

    var centerScreen = getEl("screen-typing-center");

    var premiumBtn = getEl("typingPremiumBtn");

    var deckViewport = getEl("typingDeckViewport");
    var deckDots = getEl("typingDeckDots");
    var deckPrevBtn = getEl("typingDeckPrevBtn");
    var deckNextBtn = getEl("typingDeckNextBtn");
    var centerStartBtn = getEl("typingCenterStartBtn");

    var raceStatsBtn = getEl("typingRaceStatsBtn");

    function isTypingModeCardDisabled(cardEl) {
      if (!cardEl) return false;
      var ariaDisabled = String(cardEl.getAttribute("aria-disabled") || "") === "true";
      var status = String(cardEl.getAttribute("data-status") || "").toLowerCase();
      var classDisabled = !!(cardEl.classList && (cardEl.classList.contains("is-disabled") || cardEl.classList.contains("is-coming-soon")));
      try {
        if (cardEl.disabled === true) return true;
      } catch (e0) {}
      return ariaDisabled || status === "comingsoon" || classDisabled;
    }


    function bindTypingModeCardKeyboard(cardEl, onActivate) {
      if (!cardEl) return;

      try { cardEl.setAttribute("tabindex", "0"); } catch (e0) {}
      try { cardEl.setAttribute("role", "button"); } catch (e1) {}
      try { cardEl.setAttribute("aria-keyshortcuts", "Enter Space"); } catch (e2) {}

      if (cardEl.dataset && cardEl.dataset.typingKeyBound) return;
      try { if (cardEl.dataset) cardEl.dataset.typingKeyBound = "1"; } catch (e3) {}

      cardEl.addEventListener("keydown", function(ev) {
        var key = ev && ev.key;
        if (key !== "Enter" && key !== " " && key !== "Spacebar") return;
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e4) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e5) {}
        if (isTypingModeCardDisabled(cardEl)) return;
        if (typeof onActivate === "function") onActivate();
      });
    }

    // Restore last selected mode (optional convenience)
    var savedMode = readLastMode();
    if (savedMode) {
      runState.mode = normalizeTypingCenterMode(savedMode);
      runState.timerEnabled = (runState.mode === "race" || runState.mode === "timeTrial");
    }

    // Keep Typing Center highlight aligned on first load.
    if (!readTypingCenterSelectedMode()) {
      writeTypingCenterSelectedMode(normalizeTypingCenterMode(savedMode || (runState && runState.mode) || "practice"));
    }

    refreshTypingCenterUI();

    function syncPpModeUi() {
      var m = readPpMode();

      if (ppModeSlider) {
        try { ppModeSlider.value = String(ppModeToSliderValue(m)); } catch (e0) {}
      }

      if (ppModeHint) {
        ppModeHint.textContent = (m === "pairs") ? "Pairs" : ((m === "patterns") ? "Patterns" : "Mix");
      }

      try {
        var root = getEl("ngramsControls");
        if (root && root.querySelectorAll) {
          var btns = root.querySelectorAll("button[data-pp-mode-jump]");
          for (var i = 0; i < btns.length; i++) {
            var b = btns[i];
            var v = String(b.getAttribute("data-pp-mode-jump") || "");
            b.setAttribute("aria-pressed", v === m ? "true" : "false");
          }
        }
      } catch (e1) {}
    }

    function setPpMode(mode) {
      writePpMode(mode);
      syncPpModeUi();

      // Close chooser on mode changes (keeps card compact and avoids stale lists).
      try { setPpPackChooserOpen(false); } catch (eC0) {}

      // If a previously-selected pack is now ineligible, clear it.
      try {
        var data = getTypingDrillData();
        var packs = (data && data.packs) ? data.packs : [];
        ensureSelectedPackEligibleOrClear(packs, readPpMode());
      } catch (eSel0) {}

      // Update recommended pack + objective line, but never auto-start.
      try { renderNgramRecommendedOnCard(); } catch (e0) {}
      try { refreshTypingCenterUI(); } catch (e1) {}

      // If chooser remains open for any reason, keep it in sync.
      try { if (isPpPackChooserOpen()) renderPpPackChooser(); } catch (eCh0) {}
    }

    // Initial sync for persisted Pairs/Patterns/Mix selection
    try { syncPpModeUi(); } catch (ePP0) {}

    if (ppChangePackBtn && !ppChangePackBtn.dataset.typingBound) {
      ppChangePackBtn.dataset.typingBound = "1";
      ppChangePackBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}

        var willOpen = !isPpPackChooserOpen();
        setPpPackChooserOpen(willOpen);
        if (willOpen) {
          try { renderPpPackChooser(); } catch (e2) {}
        }
      });
    }

    if (ppPackChooserCloseBtn && !ppPackChooserCloseBtn.dataset.typingBound) {
      ppPackChooserCloseBtn.dataset.typingBound = "1";
      ppPackChooserCloseBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        setPpPackChooserOpen(false);
      });
    }

    if (premiumBtn && !premiumBtn.dataset.typingBound) {
      premiumBtn.dataset.typingBound = "1";
      premiumBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        toast("Premium is coming soon.");
      });
    }

    function openRace(mode) {
      cancelTypingDrillSession();
      cancelTypeDefineSession();
      var m = normalizeTypingCenterMode(mode || "race");
      runState.mode = m;
      runState.timerEnabled = (m === "race" || m === "timeTrial");

      writeTypingCenterSelectedMode(m);
      setActiveLesson(null);

      writeLastMode(runState.mode);

      refreshTypingCenterUI();

      // Reset UI immediately so mode + Punjabi hint are correct on entry
      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      resetRaceUI(promptEl, inputEl);

      showScreenSafe("screen-typing-race");

      // Desktop ergonomics: focus input after navigation settles.
      // On coarse pointers (phones/tablets), avoid surprise keyboard pop; user can tap Start/Focus.
      var isCoarsePointer = false;
      try { isCoarsePointer = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch (eCP) {}
      if (!isCoarsePointer) {
        setTimeout(function() {
          if (document.getElementById("typingResultModal")) return;
          var input2 = findActiveTypingInputEl();
          var start2 = findActiveTypingPrimaryButton();
          var focus2 = findActiveTypingFocusButton();
          if (input2 && !input2.disabled) {
            try { input2.focus(); } catch (e) {}
          } else if (start2 && start2.focus) {
            try { start2.focus(); } catch (e2) {}
          } else if (focus2 && focus2.focus) {
            try { focus2.focus(); } catch (e3) {}
          }
          var card2 = getEl("racePromptCard");
          if (card2 && card2.scrollIntoView) {
            try {
              card2.scrollIntoView({ block: "center" });
            } catch (e2) {
              try { card2.scrollIntoView(true); } catch (e3) {}
            }
          }
        }, 90);
      }
    }

    function openPracticeFromTypingCenter() {
      cancelTypingDrillSession();
      cancelTypeDefineSession();
      cancelCountdown();

      writeTypingCenterSelectedMode("practice");
      refreshTypingCenterUI();

      try {
        if (window.PracticeStorage && typeof window.PracticeStorage.setSettings === "function") {
          window.PracticeStorage.setSettings("typing", { packId: "P_TYPING_SHORT_SENTENCES" });
        }
      } catch (e0) {}

      try {
        if (window.Practice && typeof window.Practice.open === "function") {
          window.Practice.open({ fromScreenId: "screen-typing-center" });
          return;
        }
      } catch (e1) {}

      try {
        if (window.PracticeUI && typeof window.PracticeUI.open === "function") {
          window.PracticeUI.open({ fromScreenId: "screen-typing-center" });
        } else {
          showScreenSafe("screen-practice");
        }
      } catch (e2) {
        showScreenSafe("screen-practice");
      }
    }

    function openNgramsFromCenter() {
      try {
        if (ngrams && (ngrams.disabled || String(ngrams.getAttribute("aria-disabled") || "") === "true")) return;
      } catch (e0) {}

      cancelTypingDrillSession();
      cancelTypeDefineSession();
      var s = startNgramDrillSession(readPpMode());
      if (!s) {
        toast("No drill packs available");
        return;
      }

      // Run the drill using the existing Practice engine (no timers/scoring changes)
      runState.mode = "practice";
      runState.timerEnabled = false;
      setActiveLesson(null);
      writeLastMode("practice");
      writeTypingCenterSelectedMode("ngrams");
      refreshTypingCenterUI();

      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      var text = getNgramPromptTextAt(0);
      resetRaceUIToPrompt(promptEl, inputEl, { en: text, pa: "" });
      showScreenSafe("screen-typing-race");
    }

    function openNgramReviewFromCenter() {
      try {
        if (ppReviewMistakesBtn && ppReviewMistakesBtn.disabled) return;
      } catch (e0) {}

      cancelTypingDrillSession();
      cancelTypeDefineSession();

      var s = startNgramReviewSession(readPpMode());
      if (!s) {
        toast("No mistakes to review");
        return;
      }

      // Run the drill using the existing Practice engine (no timers/scoring changes)
      runState.mode = "practice";
      runState.timerEnabled = false;
      setActiveLesson(null);
      writeLastMode("practice");
      writeTypingCenterSelectedMode("ngrams");
      refreshTypingCenterUI();

      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      var text = getNgramPromptTextAt(0);
      resetRaceUIToPrompt(promptEl, inputEl, { en: text, pa: "" });
      showScreenSafe("screen-typing-race");
    }

    function selectNgramsCard() {
      writeTypingCenterSelectedMode("ngrams");
      refreshTypingCenterUI();
    }

    function selectTypeDefineCard() {
      writeTypingCenterSelectedMode("typeDefine");
      refreshTypingCenterUI();
    }

    function selectTimeTrialCard() {
      writeTypingCenterSelectedMode("timeTrial");
      refreshTypingCenterUI();
    }

    function syncTimeTrialDurationButtons() {
      var d = 30;
      try { d = normalizeTimeTrialDurationSec(readTimeTrialDurationSec()); } catch (e0) { d = 30; }
      if (tt30) tt30.setAttribute("aria-pressed", d === 30 ? "true" : "false");
      if (tt60) tt60.setAttribute("aria-pressed", d === 60 ? "true" : "false");
    }

    function openTypeDefineGame() {
      cancelTypingDrillSession();
      cancelTypeDefineSession();

      var vocab = getTypeDefineVocab();
      if (!vocab || !vocab.length) {
        toast("Type & Define vocab missing");
        return;
      }

      // Adaptive selection (cross-session): build a 10-card base queue using long-term stats.
      // Hotlist reinsertion still runs on top of this queue.
      var queue = buildTypeDefineSessionQueue({ totalCards: TYPE_DEFINE_MATCH_TOTAL_CARDS, vocab: vocab });

      var byId = {};
      for (var i = 0; i < vocab.length; i++) {
        var it = vocab[i];
        if (!it) continue;
        var id = String(it.id || it.word || "");
        if (id) byId[id] = it;
      }

      typeDefineStats = typeDefineLoadStats();

      typeDefineSession = {
        active: true,
        phase: "typing",
        typingPhase: "typeWord",
        item: null,
        mainQueue: queue,
        vocabById: byId,
        hotlist: {},
        cardsServed: 0,
        totalPlanned: (queue && queue.length ? queue.length : TYPE_DEFINE_MATCH_TOTAL_CARDS),
        doubleClearStreak: 0,
        bestDoubleClearStreak: 0,
        bossRound: false,
        bossFailed: false,
        retryUsed: false,
        defAttempts: 0,
        mcqTimerId: null,
        mcqTickId: null,
        mcqResolved: false,
        mcqEndsAt: 0,
        stopOnError: false,
        lockIndex: -1,
        step: 0,
        hotInARow: 0,
        lastItemId: "",
        typedCorrect: false,
        fullClearCount: 0,
        recentFullClears: [],
        prevValue: "",
        _submitting: false
      };

      runState.mode = "typeDefine";
      runState.timerEnabled = false;
      setActiveLesson(null);

      writeLastMode("typeDefine");
      writeTypingCenterSelectedMode("typeDefine");
      refreshTypingCenterUI();

      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      resetRaceUIToPrompt(promptEl, inputEl, { en: "", pa: "" });

      typeDefineSetHudVisible(true);
      typeDefineUpdateHudPhase("type");
      typeDefineUpdateHudProgress();
      typeDefineUpdateDoubleClearStreakUi();

      showScreenSafe("screen-typing-race");

      setTimeout(function() {
        var pEl = getEl("racePrompt");
        var iEl = getEl("raceInput");
        typeDefineServeItem(pEl, iEl);
      }, 60);
    }

    function openTypeDefineReviewMistakes() {
      cancelTypingDrillSession();
      cancelTypeDefineSession();

      var vocab = getTypeDefineVocab();
      if (!vocab || !vocab.length) {
        toast("Type & Define vocab missing");
        return;
      }

      var byId = {};
      for (var i = 0; i < vocab.length; i++) {
        var it = vocab[i];
        if (!it) continue;
        var id = String(it.id || it.word || "");
        if (id) byId[id] = it;
      }

      typeDefineStats = typeDefineLoadStats();
      var queue = buildTypeDefineReviewQueue({ totalCards: TYPE_DEFINE_MATCH_TOTAL_CARDS, vocab: vocab });

      if (!queue || !queue.length) {
        toast("No mistakes to review");
        return;
      }

      typeDefineSession = {
        active: true,
        phase: "typing",
        typingPhase: "typeWord",
        reviewMistakes: true,
        item: null,
        mainQueue: queue,
        vocabById: byId,
        hotlist: {},
        cardsServed: 0,
        totalPlanned: TYPE_DEFINE_MATCH_TOTAL_CARDS,
        doubleClearStreak: 0,
        bestDoubleClearStreak: 0,
        bossRound: false,
        bossFailed: false,
        retryUsed: false,
        defAttempts: 0,
        mcqTimerId: null,
        mcqTickId: null,
        mcqResolved: false,
        mcqEndsAt: 0,
        stopOnError: false,
        lockIndex: -1,
        step: 0,
        hotInARow: 0,
        lastItemId: "",
        typedCorrect: false,
        fullClearCount: 0,
        recentFullClears: [],
        prevValue: "",
        _submitting: false
      };

      runState.mode = "typeDefine";
      runState.timerEnabled = false;
      setActiveLesson(null);

      writeLastMode("typeDefine");
      writeTypingCenterSelectedMode("typeDefine");
      refreshTypingCenterUI();

      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      resetRaceUIToPrompt(promptEl, inputEl, { en: "", pa: "" });

      typeDefineSetHudVisible(true);
      typeDefineUpdateHudPhase("type");
      typeDefineUpdateHudProgress();
      typeDefineUpdateDoubleClearStreakUi();

      showScreenSafe("screen-typing-race");

      setTimeout(function() {
        var pEl = getEl("racePrompt");
        var iEl = getEl("raceInput");
        typeDefineServeItem(pEl, iEl);
      }, 60);
    }

    if (centerStartBtn && !centerStartBtn.dataset.typingBound) {
      centerStartBtn.dataset.typingBound = "1";
      centerStartBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}

        var selected = normalizeTypingCenterMode(readTypingCenterSelectedMode() || "practice");
        if (selected === "typeDefine") {
          openTypeDefineGame();
          return;
        }
        if (selected === "race") {
          openRace("race");
          return;
        }
        openPracticeFromTypingCenter();
      });
    }

    if (raceStatsBtn && !raceStatsBtn.dataset.typingBound) {
      raceStatsBtn.dataset.typingBound = "1";
      raceStatsBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}

        var best = getBestForMode("race");
        var parts = ["Race stats"]; 
        try {
          if (best && best.bestWpm > 0) parts.push("Best WPM: " + String(Math.round(best.bestWpm)));
          if (best && best.bestAcc > 0) parts.push("Accuracy: " + String(best.bestAcc | 0) + "%");
          if (best && best.bestTimeMs > 0) parts.push("Time: " + formatTime(best.bestTimeMs | 0));
        } catch (e2) {}
        if (parts.length === 1) parts.push("No stats yet");
        toast(parts.join(" • "));
      });
    }

    // NOTE: Typing Race is featured and has explicit CTAs.
    // The generic Typing Center click-delegation still allows tapping the card body.

    if (timeTrial && !timeTrial.dataset.typingBound) {
      timeTrial.dataset.typingBound = "1";
      timeTrial.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        // Select-only so the 30s/60s panel can be used.
        selectTimeTrialCard();
      });
    }

    if (tt30 && !tt30.dataset.typingBound) {
      tt30.dataset.typingBound = "1";
      tt30.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        writeTimeTrialDurationSec(30);
        syncTimeTrialDurationButtons();
        renderTimeTrialBestPassOnCard();
        refreshTypingCenterUI();
      });
    }

    if (tt60 && !tt60.dataset.typingBound) {
      tt60.dataset.typingBound = "1";
      tt60.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        writeTimeTrialDurationSec(60);
        syncTimeTrialDurationButtons();
        renderTimeTrialBestPassOnCard();
        refreshTypingCenterUI();
      });
    }

    if (ttStart && !ttStart.dataset.typingBound) {
      ttStart.dataset.typingBound = "1";
      ttStart.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        selectTimeTrialCard();
        syncTimeTrialDurationButtons();
        openRace("timeTrial");
      });
    }

    // Keyboard support for card-style controls (Enter/Space)
    bindTypingModeCardKeyboard(practice, function() {
      writeTypingCenterSelectedMode("practice");
      refreshTypingCenterUI();
    });
    bindTypingModeCardKeyboard(race, function() {
      writeTypingCenterSelectedMode("race");
      refreshTypingCenterUI();
    });
    bindTypingModeCardKeyboard(timeTrial, function() {
      selectTimeTrialCard();
    });
    bindTypingModeCardKeyboard(ngrams, function() {
      selectNgramsCard();
    });
    bindTypingModeCardKeyboard(typeDefine, function() {
      selectTypeDefineCard();
    });

    // Initial sync for toggle state
    try { syncTimeTrialDurationButtons(); } catch (eTT0) {}
    if (practice && !practice.dataset.typingBound) {
      practice.dataset.typingBound = "1";
      practice.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        if (isTypingModeCardDisabled(practice)) return;
        writeTypingCenterSelectedMode("practice");
        refreshTypingCenterUI();
      });
    }

    if (race && !race.dataset.typingBound) {
      race.dataset.typingBound = "1";
      race.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        if (isTypingModeCardDisabled(race)) return;
        writeTypingCenterSelectedMode("race");
        refreshTypingCenterUI();
      });
    }
    if (ngrams && !ngrams.dataset.typingBound) {
      ngrams.dataset.typingBound = "1";
      ngrams.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        if (isTypingModeCardDisabled(ngrams)) return;
        // Select only. User must press Start to begin.
        selectNgramsCard();
      });
    }

    if (ngramsStart && !ngramsStart.dataset.typingBound) {
      ngramsStart.dataset.typingBound = "1";
      ngramsStart.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        selectNgramsCard();
        openNgramsFromCenter();
      });
    }

    if (ppReviewMistakesBtn && !ppReviewMistakesBtn.dataset.typingBound) {
      ppReviewMistakesBtn.dataset.typingBound = "1";
      ppReviewMistakesBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
        try { selectNgramsCard(); } catch (e2) {}
        openNgramReviewFromCenter();
      });
    }

    if (ppModeSlider && !ppModeSlider.dataset.typingBound) {
      ppModeSlider.dataset.typingBound = "1";
      ppModeSlider.addEventListener("input", function(ev) {
        // Live update while dragging; never starts the drill.
        var m = sliderValueToPpMode(ppModeSlider.value);
        setPpMode(m);
      });
      ppModeSlider.addEventListener("change", function() {
        var m = sliderValueToPpMode(ppModeSlider.value);
        setPpMode(m);
      });
    }

    try {
      var ppRoot = getEl("ngramsControls");
      if (ppRoot && ppRoot.querySelectorAll && !(ppRoot.dataset && ppRoot.dataset.ppModeBound)) {
        if (ppRoot.dataset) ppRoot.dataset.ppModeBound = "1";
        var jumpBtns = ppRoot.querySelectorAll("button[data-pp-mode-jump]");
        for (var jb = 0; jb < jumpBtns.length; jb++) {
          (function(btn) {
            btn.addEventListener("click", function(ev) {
              try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
              try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e1) {}
              var m = String(btn.getAttribute("data-pp-mode-jump") || "");
              setPpMode(m);
            });
          })(jumpBtns[jb]);
        }
      }
    } catch (ePP1) {}

    if (typeDefine && !typeDefine.dataset.typingBound) {
      typeDefine.dataset.typingBound = "1";

      // Card click updates active highlight (does not start game)
      typeDefine.addEventListener("click", function(ev) {
        if (isTypingModeCardDisabled(typeDefine)) return;
        selectTypeDefineCard();
      });
    }

    var typeDefineReview = getEl("reviewTypeDefineMistakesBtn");
    if (typeDefineReview && !typeDefineReview.dataset.typingBound) {
      typeDefineReview.dataset.typingBound = "1";
      typeDefineReview.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        try { if (typeDefineReview.disabled) return; } catch (e1) {}
        try { selectTypeDefineCard(); } catch (e2) {}
        openTypeDefineReviewMistakes();
      });
    }

    // Fallback: click delegation for mode cards (covers edge cases where individual bindings
    // are skipped/interrupted on some WebViews).
    if (centerScreen && !(centerScreen.dataset && centerScreen.dataset.typingCenterDelegationBound)) {
      if (centerScreen.dataset) centerScreen.dataset.typingCenterDelegationBound = "1";
      centerScreen.addEventListener("click", function(ev) {
        var t = ev && ev.target;
        if (!t || !t.closest) return;

        // Ignore clicks on explicit interactive controls inside cards.
        try {
          var inner = t.closest("button, input, label, a");
          if (inner && inner.id && inner.id !== "typingModePractice" && inner.id !== "typingModeRace" && inner.id !== "typingModeTimeTrial" && inner.id !== "typingModeNgrams" && inner.id !== "typingModeTypeDefine") {
            return;
          }
        } catch (e0) {}

        var card = null;
        try { card = t.closest(".typing-mode-card"); } catch (e1) { card = null; }
        if (!card || !card.id) return;
        if (isTypingModeCardDisabled(card)) return;

        // If a direct handler is already bound on the card, it will stopPropagation.
        // This handler is for the cases where that didn't happen.
        var id = String(card.id);

        if (id === "typingModePractice") {
          writeTypingCenterSelectedMode("practice");
          refreshTypingCenterUI();
        } else if (id === "typingModeRace") {
          writeTypingCenterSelectedMode("race");
          refreshTypingCenterUI();
        } else if (id === "typingModeTimeTrial") {
          selectTimeTrialCard();
        } else if (id === "typingModeNgrams") {
          // Select only. User must press Start to begin.
          selectNgramsCard();
        } else if (id === "typingModeTypeDefine") {
          selectTypeDefineCard();
        }
      });
    }

    function shiftTypingDeck(step) {
      var current = normalizeTypingCenterMode(readTypingCenterSelectedMode() || "practice");
      var idx = getTypingCenterDeckModeIndex(current);
      var len = TYPING_CENTER_DECK_ORDER.length;
      var nextIdx = idx;
      if (len > 0) {
        nextIdx = (idx + (step | 0)) % len;
        if (nextIdx < 0) nextIdx += len;
      }
      var nextMode = TYPING_CENTER_DECK_ORDER[nextIdx] || "practice";
      try {
        var deckRoot = getEl("typingModeDeck");
        var progressHost = null;
        try { progressHost = document.querySelector("#screen-typing-center .typing-hero-progress"); } catch (ePH) { progressHost = null; }
        var host = progressHost || deckRoot;
        var direction = step > 0 ? 1 : (step < 0 ? -1 : 0);
        if (host && direction) {
          var cls = direction > 0 ? "indicator-shift-next" : "indicator-shift-prev";
          host.classList.remove("indicator-shift-next", "indicator-shift-prev");
          void host.offsetWidth;
          host.classList.add(cls);
          window.setTimeout(function() {
            try { host.classList.remove(cls); } catch (eTypingNudgeRemove) {}
          }, 220);
        }
      } catch (eTypingNudge) {}
      writeTypingCenterSelectedMode(nextMode);
      refreshTypingCenterUI();
    }

    function setTypingDeckTransition(enabled) {
      var track = getEl("typingDeckTrack");
      if (!track || !track.style) return;
      var reduceMotion = typingDeckReduceMotionEnabled();
      if (reduceMotion) {
        track.style.transition = "none";
        return;
      }
      if (enabled) track.style.transition = (typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.swipeSnapTransition) ? BOLO_DECK_UX.swipeSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
      else track.style.transition = "none";
    }

    function getTypingDeckSwipeThresholdPx() {
      if (typeof getDeckSwipeThresholdPx === "function") return getDeckSwipeThresholdPx(deckViewport);
      var width = 0;
      try {
        width = (deckViewport && deckViewport.clientWidth) ? (deckViewport.clientWidth | 0) : 0;
      } catch (e0) { width = 0; }
      if (width <= 0) {
        try { width = (window && window.innerWidth) ? (window.innerWidth | 0) : 320; } catch (e1) { width = 320; }
      }
      var px = Math.round(width * 0.18);
      if (px < 36) px = 36;
      return px;
    }

    function isTypingDeckArrowEditableTarget(target) {
      if (!target || !target.closest) return false;
      try {
        return !!target.closest('input, textarea, select, button, [contenteditable="true"], [role="textbox"]');
      } catch (e0) {
        return false;
      }
    }

    function isTypingDeckControlTarget(evt) {
      var t = evt && evt.target;
      if (!t || !t.closest) return false;
      try {
        return !!t.closest("button, input, textarea, select, a, label, [role='button'], [contenteditable='true']");
      } catch (e0) {
        return false;
      }
    }

    if (deckPrevBtn && !deckPrevBtn.dataset.typingBound) {
      deckPrevBtn.dataset.typingBound = "1";
      deckPrevBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        shiftTypingDeck(-1);
      });
    }

    if (deckNextBtn && !deckNextBtn.dataset.typingBound) {
      deckNextBtn.dataset.typingBound = "1";
      deckNextBtn.addEventListener("click", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        shiftTypingDeck(1);
      });
    }

    if (deckDots && !deckDots.dataset.typingBound) {
      deckDots.dataset.typingBound = "1";
      deckDots.addEventListener("click", function(ev) {
        var t = ev && ev.target;
        if (!t || !t.closest) return;
        var dot = t.closest(".deck-dot");
        if (!dot) return;
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        var mode = String(dot.getAttribute("data-typing-deck-dot") || "");
        writeTypingCenterSelectedMode(normalizeTypingCenterMode(mode));
        refreshTypingCenterUI();
      });
    }

    if (centerScreen && !centerScreen.dataset.typingDeckKeysBound) {
      centerScreen.dataset.typingDeckKeysBound = "1";
      centerScreen.addEventListener("keydown", function(ev) {
        var key = ev && ev.key;
        if (key !== "ArrowLeft" && key !== "ArrowRight") return;
        if (isTypingDeckArrowEditableTarget(ev && ev.target)) return;
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
        if (key === "ArrowRight") {
          shiftTypingDeck(1);
        } else {
          shiftTypingDeck(-1);
        }
      });
    }

    if (deckViewport && !deckViewport.dataset.typingSwipeBound) {
      deckViewport.dataset.typingSwipeBound = "1";
      var dragState = {
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchDragging: false,
        touchMoved: false,
        pointerStartX: null,
        pointerCurrentX: null,
        pointerDragging: false,
        pointerMoved: false,
        pointerId: null
      };

      function renderTypingDeckDrag(deltaX) {
        var width = 0;
        try { width = (deckViewport && deckViewport.clientWidth) ? deckViewport.clientWidth : 0; } catch (e0) { width = 0; }
        if (!(width > 0)) return;
        var current = normalizeTypingCenterMode(readTypingCenterSelectedMode() || "practice");
        syncTypingCenterDeckUi(current, deltaX / width);
      }

      function resetTypingDeckDragVisuals() {
        var current = normalizeTypingCenterMode(readTypingCenterSelectedMode() || "practice");
        syncTypingCenterDeckUi(current, 0);
      }

      function finishTouchDrag(commit, fallbackDeltaX) {
        var startX = dragState.touchStartX;
        if (startX == null) return;

        var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
          ? fallbackDeltaX
          : ((dragState.touchCurrentX == null) ? 0 : (dragState.touchCurrentX - startX));

        dragState.touchStartX = null;
        dragState.touchStartY = null;
        dragState.touchCurrentX = null;
        var wasDragging = dragState.touchDragging;
        dragState.touchDragging = false;
        dragState.touchMoved = false;

        if (!wasDragging) return;

        setTypingDeckTransition(true);
        if (!commit) {
          resetTypingDeckDragVisuals();
          return;
        }

        var threshold = getTypingDeckSwipeThresholdPx();
        if (Math.abs(deltaX) >= threshold) {
          if (deltaX > 0) shiftTypingDeck(-1);
          else shiftTypingDeck(1);
          return;
        }

        resetTypingDeckDragVisuals();
      }

      function finishPointerDrag(commit) {
        if (!dragState.pointerDragging) return;
        var deltaX = (dragState.pointerCurrentX == null || dragState.pointerStartX == null)
          ? 0
          : (dragState.pointerCurrentX - dragState.pointerStartX);

        dragState.pointerDragging = false;
        dragState.pointerMoved = false;
        dragState.pointerStartX = null;
        dragState.pointerCurrentX = null;
        dragState.pointerId = null;

        setTypingDeckTransition(true);
        if (!commit) {
          resetTypingDeckDragVisuals();
          return;
        }

        var threshold = getTypingDeckSwipeThresholdPx();
        if (Math.abs(deltaX) >= threshold) {
          if (deltaX > 0) shiftTypingDeck(-1);
          else shiftTypingDeck(1);
          return;
        }

        resetTypingDeckDragVisuals();
      }

      deckViewport.addEventListener("touchstart", function(ev) {
        if (isTypingDeckControlTarget(ev)) return;
        var t = ev && ev.touches && ev.touches[0];
        if (!t) return;
        dragState.touchStartX = t.clientX;
        dragState.touchStartY = t.clientY;
        dragState.touchCurrentX = t.clientX;
        dragState.touchDragging = true;
        dragState.touchMoved = false;
      }, { passive: true });

      deckViewport.addEventListener("touchmove", function(ev) {
        if (!dragState.touchDragging || dragState.touchStartX == null) return;
        var t = ev && ev.touches && ev.touches[0];
        if (!t) return;
        dragState.touchCurrentX = t.clientX;
        var dx = dragState.touchCurrentX - dragState.touchStartX;
        var dy = (dragState.touchStartY == null) ? 0 : (t.clientY - dragState.touchStartY);

        if (!dragState.touchMoved) {
          var horizontalIntent = (typeof hasDeckHorizontalIntent === "function")
            ? hasDeckHorizontalIntent(dx, dy)
            : (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.1);
          if (!horizontalIntent) return;
          dragState.touchMoved = true;
          setTypingDeckTransition(false);
        }

        renderTypingDeckDrag(dx);
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (eMovePrevent) {}
      }, { passive: false });

      deckViewport.addEventListener("touchend", function(ev) {
        if (dragState.touchStartX == null) return;
        var t = ev && ev.changedTouches && ev.changedTouches[0];
        if (!t) {
          finishTouchDrag(false, 0);
          return;
        }
        var dx = t.clientX - dragState.touchStartX;
        if (dragState.touchMoved) {
          finishTouchDrag(true, dx);
          return;
        }

        dragState.touchDragging = false;
        dragState.touchMoved = false;
        dragState.touchStartX = null;
        dragState.touchStartY = null;
        dragState.touchCurrentX = null;

        var threshold = getTypingDeckSwipeThresholdPx();
        if (Math.abs(dx) < threshold) return;
        if (dx > 0) shiftTypingDeck(-1);
        else shiftTypingDeck(1);
      }, { passive: true });

      deckViewport.addEventListener("touchcancel", function() {
        finishTouchDrag(false, 0);
      }, { passive: true });

      deckViewport.addEventListener("pointerdown", function(ev) {
        if (!ev || ev.pointerType === "touch") return;
        if (ev.button != null && ev.button !== 0) return;
        if (isTypingDeckControlTarget(ev)) return;

        dragState.pointerDragging = true;
        dragState.pointerMoved = false;
        dragState.pointerId = ev.pointerId;
        dragState.pointerStartX = ev.clientX;
        dragState.pointerCurrentX = ev.clientX;
        try { deckViewport.setPointerCapture(dragState.pointerId); } catch (eCapture) {}
        setTypingDeckTransition(false);
      });

      deckViewport.addEventListener("pointermove", function(ev) {
        if (!dragState.pointerDragging) return;
        if (dragState.pointerId != null && ev.pointerId !== dragState.pointerId) return;
        dragState.pointerCurrentX = ev.clientX;

        var dx = dragState.pointerCurrentX - dragState.pointerStartX;
        if (!dragState.pointerMoved && Math.abs(dx) > 3) dragState.pointerMoved = true;
        if (!dragState.pointerMoved) return;

        renderTypingDeckDrag(dx);
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (ePtrPrevent) {}
      });

      deckViewport.addEventListener("pointerup", function(ev) {
        if (!dragState.pointerDragging) return;
        if (dragState.pointerId != null && ev.pointerId !== dragState.pointerId) return;
        finishPointerDrag(true);
      });

      deckViewport.addEventListener("pointercancel", function(ev) {
        if (!dragState.pointerDragging) return;
        if (dragState.pointerId != null && ev.pointerId !== dragState.pointerId) return;
        finishPointerDrag(false);
      });

      deckViewport.addEventListener("pointerleave", function() {
        if (!dragState.pointerDragging) return;
        finishPointerDrag(true);
      });
    }

  }

  function bindTypingRace() {
    var back = getEl("typingRaceBackBtn");
    var fsBtn = getEl("raceFullscreenBtn");

    var promptEl = getEl("racePrompt");
    var inputEl = getEl("raceInput");

    // Type & Define MCQ wiring (buttons are inert unless the session is active)
    (function bindTypeDefineMcqUiOnce() {
      var panel = getEl("tadMcqPanel");
      var wrap = getEl("tadChoices");
      if (!panel || !wrap || !wrap.querySelectorAll) return;
      if (wrap.dataset && wrap.dataset.tadBound) return;
      if (wrap.dataset) wrap.dataset.tadBound = "1";

      try { panel.classList.add("is-hidden"); } catch (e0) {}
      try { panel.setAttribute("aria-hidden", "true"); } catch (e1) {}

      var btns = wrap.querySelectorAll("button[data-tad-choice]");
      for (var i = 0; i < btns.length; i++) {
        (function(idx) {
          btns[idx].addEventListener("click", function() {
            if (!isTypeDefineActive()) return;
            if (!typeDefineSession || typeDefineSession.phase !== "mcq") return;
            typeDefineResolveMcq(idx, false, promptEl, inputEl);
          });
        })(i);
      }
    })();

    // Type & Define: English audio buttons (word + definition)
    (function bindTypeDefineTtsUiOnce() {
      var wordBtn = getEl("tadSpeakWordBtn");
      var meaningBtn = getEl("tadSpeakMeaningBtn");
      if (!wordBtn || !meaningBtn) return;
      if (wordBtn.dataset && wordBtn.dataset.tadBound) return;
      if (wordBtn.dataset) wordBtn.dataset.tadBound = "1";

      function briefDisable(btn) {
        if (!btn) return;
        try { btn.disabled = true; } catch (e0) {}
        setTimeout(function() {
          try {
            // Re-apply UI state rather than blindly enabling.
            typeDefineApplyAudioUI();
          } catch (e1) {}
        }, 200);
      }

      wordBtn.addEventListener("click", function() {
        if (!isTypeDefineActive()) return;
        if (!typeDefineSession || !typeDefineSession.item) return;

        var item = typeDefineSession.item;
        var url = String(item.audioEnUrl || "").replace(/^\s+|\s+$/g, "");
        var txt = String(item.word || "");

        if (url) {
          playAudioUrl(url).then(function(started) {
            if (started) {
              briefDisable(wordBtn);
              return;
            }
            var ok = speakText(txt, "en");
            if (!ok) {
              try { typeDefineShowHudFeedback("Audio not available", 900); } catch (eNA0) {}
            }
            try { typeDefineApplyAudioUI(); } catch (e2) {}
            briefDisable(wordBtn);
          });
          return;
        }

        var ok = speakText(txt, "en");
        if (!ok) {
          try { typeDefineShowHudFeedback("Audio not available", 900); } catch (eNA1) {}
          try { typeDefineApplyAudioUI(); } catch (e3) {}
          return;
        }
        briefDisable(wordBtn);
      });

      meaningBtn.addEventListener("click", function() {
        if (!isTypeDefineActive()) return;
        if (!typeDefineSession || !typeDefineSession.item) return;

        var item = typeDefineSession.item;
        var url = String(item.audioDefEnUrl || "").replace(/^\s+|\s+$/g, "");
        var txtDefEn = String(item.defEn || "");

        if (url) {
          playAudioUrl(url).then(function(started) {
            if (started) {
              briefDisable(meaningBtn);
              return;
            }
            var ok = txtDefEn ? speakText(txtDefEn, "en") : false;
            if (!ok) {
              try { typeDefineShowHudFeedback("Audio not available", 900); } catch (eNA2) {}
            }
            try { typeDefineApplyAudioUI(); } catch (e4) {}
            briefDisable(meaningBtn);
          });
          return;
        }

        var ok = txtDefEn ? speakText(txtDefEn, "en") : false;
        if (!ok) {
          try { typeDefineShowHudFeedback("Audio not available", 900); } catch (eNA3) {}
          try { typeDefineApplyAudioUI(); } catch (e5) {}
          return;
        }
        briefDisable(meaningBtn);
      });
    })();

    // Type & Define: Dev diagnostics panel close button
    (function bindTypeDefineDevPanelOnce() {
      if (!typeDefineIsDevOn()) return;
      var btn = getEl("tadDevPanelCloseBtn");
      if (!btn) return;
      if (btn.dataset && btn.dataset.tadBound) return;
      if (btn.dataset) btn.dataset.tadBound = "1";

      btn.addEventListener("click", function() {
        try {
          if (typeDefineSession && typeDefineSession.active === true) typeDefineSession._devPanelDismissed = true;
        } catch (e0) {}
        try { typeDefineSetDevPanelVisible(false); } catch (e1) {}
      });
    })();

    // Type & Define Checkpoint: Continue wiring
    (function bindTypeDefineCheckpointUiOnce() {
      var panel = getEl("tadCheckpointPanel");
      var btn = getEl("tadCheckpointContinueBtn");
      if (!panel || !btn) return;
      if (btn.dataset && btn.dataset.tadBound) return;
      if (btn.dataset) btn.dataset.tadBound = "1";

      try { panel.classList.add("is-hidden"); } catch (e0) {}
      try { panel.setAttribute("aria-hidden", "true"); } catch (e1) {}

      btn.addEventListener("click", function() {
        if (!isTypeDefineActive()) return;
        if (!typeDefineSession || typeDefineSession.phase !== "checkpoint") return;
        hideTypeDefineCheckpointPanel();
        // Resume by serving the next card (which re-initializes phases).
        try { typeDefineSession.phase = "typing"; } catch (e2) {}
        typeDefineServeItem(promptEl, inputEl);
      });
    })();

    var focusBtn = getEl("raceFocusBtn");

    var promptCardEl = getEl("racePromptCard");
    var intentEl = getEl("raceIntentLine");
    var shakeTimer = 0;

    var raceScreenEl = getEl("screen-typing-race");

    // Keyboard shortcuts (low-risk, additive)
    // - Enter: Start/Next (when not typing into the input)
    // - Esc: Back (when safe)
    // - 1-4: Type & Define MCQ choices (during MCQ phase)
    (function bindTypingRaceHotkeysOnce() {
      if (!raceScreenEl) return;
      if (raceScreenEl.dataset && raceScreenEl.dataset.typingHotkeysBound) return;
      if (raceScreenEl.dataset) raceScreenEl.dataset.typingHotkeysBound = "1";

      raceScreenEl.addEventListener("keydown", function(ev) {
        try {
          if (!ev) return;
          if (ev.defaultPrevented) return;
          if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

          var key = String(ev.key || "");
          if (!key && (ev.keyCode != null)) key = String(ev.keyCode);

          // Type & Define MCQ: numeric hotkeys
          if (isTypeDefineActive() && typeDefineSession && typeDefineSession.phase === "mcq") {
            if (key === "1" || key === "2" || key === "3" || key === "4") {
              var idx = (parseInt(key, 10) | 0) - 1;
              if (idx >= 0 && idx <= 3) {
                try { ev.preventDefault(); } catch (e0) {}
                var wrap = getEl("tadChoices");
                if (wrap && wrap.querySelectorAll) {
                  var btns = wrap.querySelectorAll("button[data-tad-choice]");
                  if (btns && btns[idx] && !btns[idx].disabled) {
                    btns[idx].click();
                  }
                }
              }
              return;
            }
          }

          // Enter: Start/Next (but never while typing in the input)
          if (key === "Enter" || key === "13") {
            var ae = null;
            try { ae = document && document.activeElement; } catch (e1) { ae = null; }
            if (ae && ae.tagName) {
              var tag = String(ae.tagName || "").toLowerCase();
              if (tag === "input" || tag === "textarea") return;
            }

            var startBtn = getEl("raceStartBtn");
            var nextBtn = getEl("raceNextBtn");
            if (runState && runState.finished) {
              if (nextBtn && nextBtn.click) {
                try { ev.preventDefault(); } catch (e2) {}
                nextBtn.click();
              }
              return;
            }
            if (!state.running) {
              if (startBtn && startBtn.click) {
                try { ev.preventDefault(); } catch (e3) {}
                startBtn.click();
              }
            }
            return;
          }

          // Esc: Back (only when not running; avoid interrupting Type & Define phases)
          if (key === "Escape" || key === "Esc" || key === "27") {
            if (state && state.running) return;
            if (isTypeDefineActive()) return;
            var backBtn = getEl("typingRaceBackBtn");
            if (backBtn && backBtn.click) {
              try { ev.preventDefault(); } catch (e4) {}
              backBtn.click();
            }
          }
        } catch (e) {
          // no-op
        }
      });
    })();

    function isFocusModeSupported() {
      if (isTypeDefineActive()) return false;
      if (runState && runState.mode === "timeTrial") return false;
      return true;
    }

    function applyFocusModeUI() {
      var on = !!(runState && runState.focusMode);
      if (raceScreenEl && raceScreenEl.classList) {
        try {
          if (on) raceScreenEl.classList.add("typing-focus-mode");
          else raceScreenEl.classList.remove("typing-focus-mode");
        } catch (e0) {}
      }

      if (focusBtn) {
        try {
          focusBtn.setAttribute("aria-pressed", on ? "true" : "false");
        } catch (e1) {}
        try {
          if (focusBtn.classList) {
            if (on) focusBtn.classList.add("is-active");
            else focusBtn.classList.remove("is-active");
          }
        } catch (e2) {}
        try {
          focusBtn.title = on
            ? "Focus mode: hide distractions • clean run required"
            : "Focus mode: hide distractions • clean run required";
        } catch (e3) {}
      }
    }

    function toggleFocusMode() {
      if (!isFocusModeSupported()) {
        // Keep original behavior where Focus just centers.
        return;
      }
      runState.focusMode = !runState.focusMode;
      applyFocusModeUI();
      if (runState.focusMode) {
        toast("Focus mode on: clean run required");
      } else {
        toast("Focus mode off");
      }
    }

    function setIntent(text, tone) {
      if (!intentEl) return;
      intentEl.textContent = String(text || "");
      try {
        intentEl.classList.remove("is-ok");
        intentEl.classList.remove("is-warn");
      } catch (e0) {}
      if (tone === "ok") {
        try { intentEl.classList.add("is-ok"); } catch (e1) {}
      } else if (tone === "warn") {
        try { intentEl.classList.add("is-warn"); } catch (e2) {}
      }
    }

    function getDefaultIntentText() {
      if (isNgramDrillActive()) return "Type the pattern carefully • Accuracy first";
      if (isTypeDefineActive()) return "Type carefully • Then choose the meaning";
      if (runState && runState.mode === "timeTrial") return "Smooth and accurate • Watch the target time";
      if (runState && runState.mode === "lessons") return "One clean run • Accuracy first";
      if (runState && runState.mode === "practice") return "Type the word carefully • Accuracy first";
      return "Type carefully • Accuracy first";
    }

    function setBtnVisible(btn, show) {
      if (!btn) return;
      btn.style.display = show ? "" : "none";
    }

    function setPillVariant(btn, variant) {
      if (!btn || !btn.classList) return;
      try {
        btn.classList.remove("is-primary");
        btn.classList.remove("is-accent");
      } catch (e0) {}
      if (variant === "primary") {
        try { btn.classList.add("is-primary"); } catch (e1) {}
      } else if (variant === "accent") {
        try { btn.classList.add("is-accent"); } catch (e2) {}
      }
    }

    function syncDockButtons(phase) {
      // phase: 'pre' | 'running' | 'finished'
      if (isTypeDefineActive()) {
        // Type & Define: keep flow uninterrupted; Start/Next are not used.
        setBtnVisible(startBtn, false);
        setBtnVisible(resetBtn, true);
        setBtnVisible(focusBtn, false);
        setBtnVisible(nextBtn, false);
        setPillVariant(startBtn, "primary");
        setPillVariant(nextBtn, "accent");
        return;
      }

      if (!phase) {
        if (runState && runState.finished) phase = "finished";
        else if (state && state.running) phase = "running";
        else phase = "pre";
      }

      if (phase === "pre") {
        setBtnVisible(startBtn, true);
        setBtnVisible(resetBtn, false);
        setBtnVisible(focusBtn, false);
        setBtnVisible(nextBtn, false);
        setPillVariant(startBtn, "primary");
        setPillVariant(nextBtn, "accent");
        return;
      }

      if (phase === "running") {
        setBtnVisible(startBtn, false);
        setBtnVisible(resetBtn, true);
        setBtnVisible(focusBtn, true);
        setBtnVisible(nextBtn, false);
        setPillVariant(startBtn, "primary");
        setPillVariant(nextBtn, "accent");
        return;
      }

      if (phase === "retry") {
        setBtnVisible(startBtn, false);
        setBtnVisible(resetBtn, true);
        setBtnVisible(focusBtn, true);
        setBtnVisible(nextBtn, false);
        setPillVariant(startBtn, "primary");
        setPillVariant(nextBtn, "accent");
        return;
      }

      // finished
      setBtnVisible(startBtn, false);
      setBtnVisible(resetBtn, true);
      setBtnVisible(focusBtn, false);
      setBtnVisible(nextBtn, true);
      setPillVariant(nextBtn, "primary");
      setPillVariant(startBtn, "primary");
    }

    function setPromptCardState(active, success) {
      if (!promptCardEl || !promptCardEl.classList) return;
      try {
        if (active) promptCardEl.classList.add("is-active");
        else promptCardEl.classList.remove("is-active");
      } catch (e0) {}
      try {
        if (success) promptCardEl.classList.add("is-success");
        else promptCardEl.classList.remove("is-success");
      } catch (e1) {}
    }

    function updateIntentProgress(typedLen, totalLen, mistakes) {
      var t = Math.max(0, typedLen | 0);
      var n = Math.max(0, totalLen | 0);
      var m = Math.max(0, mistakes | 0);
      if (!(n > 0)) {
        setIntent(getDefaultIntentText(), "");
        return;
      }
      var prefix = (runState && runState.focusMode) ? "Focus: clean run • " : "";
      setIntent(prefix + "Progress: " + String(t) + "/" + String(n) + " • Mistakes: " + String(m), m ? "warn" : "");
    }

    var scrollUnlockTimer = 0;
    function addScrollLock() {
      try {
        document.documentElement.classList.add("typing-scroll-lock");
        document.body.classList.add("typing-scroll-lock");
      } catch (e0) {}
    }

    function removeScrollLock() {
      try {
        document.documentElement.classList.remove("typing-scroll-lock");
        document.body.classList.remove("typing-scroll-lock");
      } catch (e0) {}
    }

    function scrollPromptCardIntoView() {
      if (!promptCardEl || !promptCardEl.scrollIntoView) return;
      try {
        promptCardEl.scrollIntoView({ block: "center" });
      } catch (e) {
        try { promptCardEl.scrollIntoView(true); } catch (e2) {}
      }
    }

    function focusInputAndCenter() {
      if (document.getElementById("typingResultModal")) return;
      var liveInput = findActiveTypingInputEl() || inputEl;
      if (liveInput && !liveInput.disabled) {
        try { liveInput.focus(); } catch (e) {}
      } else {
        var startFallback = findActiveTypingPrimaryButton() || getEl("raceStartBtn");
        if (startFallback && startFallback.focus) {
          try { startFallback.focus(); } catch (e2) {}
        }
      }
      scrollPromptCardIntoView();
    }

    if (focusBtn && !focusBtn.dataset.typingBound) {
      focusBtn.dataset.typingBound = "1";
      focusBtn.addEventListener("click", function() {
        if (!isTypeDefineActive()) {
          toggleFocusMode();
        }
        focusInputAndCenter();
      });
    }
    function pulseShake() {
      if (!promptCardEl) return;
      try {
        if (shakeTimer) clearTimeout(shakeTimer);
      } catch (e) {}
      promptCardEl.classList.remove("is-shake");
      // Force reflow so the animation can re-trigger
      try { void promptCardEl.offsetWidth; } catch (e2) {}
      promptCardEl.classList.add("is-shake");
      shakeTimer = setTimeout(function() {
        promptCardEl.classList.remove("is-shake");
      }, 220);
    }

    var startBtn = getEl("raceStartBtn");
    var resetBtn = getEl("raceResetBtn");
    var nextBtn = getEl("raceNextBtn");

    function setRetryUI(force) {
      // Drills (Pairs & Patterns) should stay simple: Restart + Next Pattern.
      if (isNgramDrillActive()) {
        runState.forceRetry = false;
        if (resetBtn) resetBtn.textContent = "Restart";
        if (nextBtn) nextBtn.textContent = "Next Pattern";
        return;
      }
      runState.forceRetry = !!force;
      if (resetBtn) resetBtn.textContent = runState.forceRetry ? "Retry (same prompt)" : "Reset";
      if (nextBtn) nextBtn.textContent = runState.forceRetry ? "Next (after retry)" : "Next";
    }

    function beginRunNow() {
      state.running = true;
      state.startedAt = (window.performance && performance.now) ? performance.now() : Date.now();
      runState.startTs = Date.now();
      if (inputEl) {
        inputEl.disabled = false;
        try { inputEl.focus(); } catch (e) {}
      }

      applyFocusModeUI();
      setPromptCardState(true, false);
      syncDockButtons("running");
      updateIntentProgress(0, state && state.prompt ? state.prompt.length : 0, 0);

      if (runState.timerEnabled) tick();
      else updateStatsOnce();
    }

    function startCurrentPromptRun() {
      if (runState.mode === "race") {
        startTypingCountdown(function() {
          beginRunNow();
        });
        return;
      }

      // All other Typing modes start immediately (no countdown).
      beginRunNow();
    }

    function restartSamePromptWithMessage() {
      toast("Try that one again—aim for " + String(ACC_GOAL) + "%+ accuracy.");
      var same = { en: runState.promptEn, pa: runState.promptPa };
      resetRaceUIToPrompt(promptEl, inputEl, same);
      setRetryUI(false);
      startCurrentPromptRun();
    }

    function restartSamePromptTimeTrial(message) {
      toast(message || ("Try again—aim for ≤ " + String(getTimeTrialTargetSec()) + "s and " + String(TIME_TRIAL_ACC_MIN) + "%+ accuracy."));
      var same = { en: runState.promptEn, pa: runState.promptPa };
      resetRaceUIToPrompt(promptEl, inputEl, same);
      setRetryUI(false);
      startCurrentPromptRun();
    }

    function restartSamePromptPractice() {
      var same = { en: runState.promptEn, pa: runState.promptPa };
      resetRaceUIToPrompt(promptEl, inputEl, same);
      setRetryUI(false);
      startCurrentPromptRun();
    }

    function endNgramDrillToCenter() {
      cancelTypingDrillSession();
      cancelCountdown();
      removeScrollLock();
      showScreenSafe("screen-typing-center");
      refreshTypingCenterUI();
    }

    function loadNgramDrillPromptAt(index) {
      if (!isNgramDrillActive()) return false;
      var text = getNgramPromptTextAt(index);
      if (!text) return false;

      try {
        typingDrillSession.i = index | 0;
        runState.drillStep = (typingDrillSession.i | 0) + 1;
        runState.drillTotal = (typingDrillSession.queue && typingDrillSession.queue.length) ? typingDrillSession.queue.length : runState.drillTotal;
      } catch (e0) {}

      resetRaceUIToPrompt(promptEl, inputEl, { en: text, pa: "" });
      setRetryUI(false);
      return true;
    }

    function loadNextNgramDrillPrompt() {
      if (!isNgramDrillActive()) return false;
      var nextIndex = (typingDrillSession.i | 0) + 1;
      if (!typingDrillSession.queue || nextIndex >= typingDrillSession.queue.length) {
        toast("Pack complete");
        endNgramDrillToCenter();
        return true;
      }
      return loadNgramDrillPromptAt(nextIndex);
    }

    function startNextNgramDrillPromptRun() {
      if (!loadNextNgramDrillPrompt()) return;
      startCurrentPromptRun();
    }

    function startNextPromptRun() {
      resetRaceUI(promptEl, inputEl);
      setRetryUI(false);
      startCurrentPromptRun();
    }

    if (back && !back.dataset.typingBound) {
      back.dataset.typingBound = "1";
      back.addEventListener("click", function() {
        cancelCountdown();
        cancelTypeDefineSession();
        try { resetRaceMatch(); } catch (eRM) {}
        removeScrollLock();
        if (isNgramDrillActive()) {
          endNgramDrillToCenter();
          return;
        }
        showScreenSafe("screen-typing-center");
        refreshTypingCenterUI();
      });
    }

    if (fsBtn && !fsBtn.dataset.typingBound) {
      fsBtn.dataset.typingBound = "1";
      fsBtn.addEventListener("click", function() {
        toggleFullscreen(document.documentElement, fsBtn);
      });

      document.addEventListener("fullscreenchange", function() {
        try {
          fsBtn.setAttribute("aria-pressed", document.fullscreenElement ? "true" : "false");
        } catch (e) {
          // no-op
        }
      });
    }

    resetRaceUI(promptEl, inputEl);
    setRetryUI(false);

    if (nextBtn && !nextBtn.dataset.typingBound) {
      nextBtn.dataset.typingBound = "1";
      nextBtn.addEventListener("click", function() {
        cancelCountdown();

        if (isTypeDefineActive()) {
          // v2.1: do not allow skipping during MCQ; user must choose the correct meaning.
          if (typeDefineSession && typeDefineSession.phase === "mcq") {
            toast("Choose the correct meaning");
          }
          return;
        }

        if (runState.forceRetry && !state.running) {
          restartSamePromptWithMessage();
          return;
        }

        if (isNgramDrillActive()) {
          loadNextNgramDrillPrompt();
          return;
        }

        // Typing Race match: Next advances the round (no menu bounce).
        if (runState && runState.mode === "race" && raceMatch && raceMatch.active) {
          var accNow = computeAcc(runState.totalAdded, runState.totalErrors);
          var secNow = (hudSnapshot && typeof hudSnapshot.seconds === "number" && hudSnapshot.seconds > 0) ? hudSnapshot.seconds : 0;
          var wpmNow = computeWpm(state && state.prompt ? state.prompt.length : 0, secNow);
          raceMatch.nextBand = decideNextRaceBand(accNow, wpmNow);
          raceMatch.roundIndex = Math.min((raceMatch.roundIndex | 0) + 1, (raceMatch.maxRounds | 0) || RACE_MATCH_MAX_ROUNDS);
          var pObj = pickRaceRoundPrompt(raceMatch.nextBand);
          raceMatch.currentPrompt = pObj;
          resetRaceUIToPrompt(promptEl, inputEl, pObj);
          setRetryUI(false);
          startCurrentPromptRun();
          return;
        }

        resetRaceUI(promptEl, inputEl);
        setRetryUI(false);
      });
    }

    if (resetBtn && !resetBtn.dataset.typingBound) {
      resetBtn.dataset.typingBound = "1";
      resetBtn.addEventListener("click", function() {
        cancelCountdown();

        if (isTypeDefineActive()) {
          if (typeDefineSession && typeDefineSession.phase === "checkpoint") {
            return;
          }
          hideTypeDefineMcqPanel();
          hideTypeDefineCheckpointPanel();
          clearTypeDefineMcqTimers();
          if (typeDefineSession) {
            typeDefineSession.phase = "typing";
            typeDefineSession.typingPhase = "typeWord";
            typeDefineSession.retryUsed = false;
            typeDefineSession.lockIndex = -1;
            typeDefineSession.prevValue = "";
            typeDefineSession._submitting = false;
            typeDefineSession.typedCorrect = false;
            typeDefineSession.defTarget = "";
            typeDefineSession.defAttempts = 0;
          }
          if (inputEl) inputEl.value = "";
          state.running = true;
          typeDefineUpdateHudPhase("type");
          typeDefineSetHudStepText("type");
          typeDefineSyncTutorHint(-1);
          typeDefineSetTypingPhase("typeWord", promptEl, inputEl);
          if (inputEl) {
            inputEl.disabled = false;
            try { inputEl.focus(); } catch (e1) {}
          }
          return;
        }

        if (runState.forceRetry && !state.running) {
          restartSamePromptWithMessage();
          return;
        }

        if (isNgramDrillActive()) {
          // Reset current drill prompt (do not change the queue)
          resetRaceUIToPrompt(promptEl, inputEl, { en: runState.promptEn, pa: runState.promptPa });
          setRetryUI(false);
          return;
        }

        // Typing Race match: Reset behaves like “Retry Round” (same snippet).
        if (runState && runState.mode === "race" && raceMatch && raceMatch.active) {
          var same = raceMatch.currentPrompt || { en: runState.promptEn, pa: runState.promptPa };
          resetRaceUIToPrompt(promptEl, inputEl, same);
          setRetryUI(false);
          startCurrentPromptRun();
          return;
        }

        resetRaceUI(promptEl, inputEl);
        setRetryUI(false);
      });
    }

    if (startBtn && !startBtn.dataset.typingBound) {
      startBtn.dataset.typingBound = "1";
      startBtn.addEventListener("click", function() {
        cancelCountdown();

        // Start/Next should never compete visually.
        syncDockButtons("running");
        setPromptCardState(true, false);

        if (isTypeDefineActive()) {
          if (typeDefineSession && typeDefineSession.phase === "checkpoint") {
            return;
          }
          // In Type & Define, Start just enables typing (no countdown)
          if (inputEl) {
            inputEl.disabled = false;
            try { inputEl.focus(); } catch (e0) {}
          }
          state.running = true;
          updateIntentProgress((inputEl && inputEl.value ? inputEl.value.length : 0), state && state.prompt ? state.prompt.length : 0, runState && runState.totalErrors ? runState.totalErrors : 0);
          return;
        }

        if (isNgramDrillActive()) {
          setRetryUI(false);
          startCurrentPromptRun();
          return;
        }

        // Typing Race match: initialize once, then keep the same round prompt
        // until the learner picks Retry/Next.
        if (runState && runState.mode === "race") {
          if (!raceMatch || !raceMatch.active) {
            resetRaceMatch();
            raceMatch.active = true;
            raceMatch.roundIndex = 1;
            raceMatch.maxRounds = RACE_MATCH_MAX_ROUNDS;
            raceMatch.nextBand = "short";
            var p0 = pickRaceRoundPrompt("short");
            raceMatch.currentPrompt = p0;
            resetRaceUIToPrompt(promptEl, inputEl, p0);
          }
          setRetryUI(false);
          startCurrentPromptRun();
          return;
        }

        resetRaceUI(promptEl, inputEl);
        setRetryUI(false);
        startCurrentPromptRun();
      });
    }

    var lastPasteToastAt = 0;
    function toastCooldown(msg, cooldownMs) {
      cooldownMs = cooldownMs || 1200;
      var t = Date.now ? Date.now() : (new Date()).getTime();
      if (t - lastPasteToastAt < cooldownMs) return;
      lastPasteToastAt = t;
      toast(msg);
    }

    if (inputEl && promptEl && !inputEl.dataset.typingBound) {
      inputEl.dataset.typingBound = "1";

      var composing = false;
      inputEl.addEventListener("compositionstart", function() { composing = true; });
      inputEl.addEventListener("compositionend", function() { composing = false; });

      // Mobile stability: lock page scroll while the input is focused.
      inputEl.addEventListener("focus", function() {
        try { if (scrollUnlockTimer) clearTimeout(scrollUnlockTimer); } catch (e0) {}
        addScrollLock();
        scrollPromptCardIntoView();
      });

      inputEl.addEventListener("blur", function() {
        try { if (scrollUnlockTimer) clearTimeout(scrollUnlockTimer); } catch (e0) {}
        scrollUnlockTimer = setTimeout(function() {
          removeScrollLock();
        }, 120);
      });

      inputEl.addEventListener("paste", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
        toastCooldown("Paste disabled");
      });

      inputEl.addEventListener("dragover", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
      });

      inputEl.addEventListener("drop", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e1) {}
        toastCooldown("Paste disabled");
      });

      inputEl.addEventListener("beforeinput", function(ev) {
        // Best-effort: block paste/drop insertions where supported
        if (!ev) return;
        if (ev.inputType === "insertFromPaste" || ev.inputType === "insertFromDrop") {
          try { ev.preventDefault(); } catch (e) {}
          toastCooldown("Paste disabled");
        }
      });

      // Optional: Enter submits in Type & Define
      inputEl.addEventListener("keydown", function(ev) {
        if (!isTypeDefineActive()) return;
        if (!typeDefineSession) return;
        if (typeDefineSession.phase === "checkpoint" || typeDefineSession.phase === "mcq") return;
        var k = ev && (ev.key || ev.keyCode);
        if (k === "Enter" || k === 13) {
          try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e0) {}
          var phaseNow = typeDefineGetTypingPhase();
          if (phaseNow === "typeWord") {
            try { typeDefineTrySubmitTypedWord(inputEl.value || "", promptEl, inputEl); } catch (e1) {}
          } else {
            try { console.warn("[Type&Define] Enter submit with unexpected typingPhase", phaseNow); } catch (eW) {}
          }
        }
      });

      inputEl.addEventListener("input", function(ev) {
        // Type & Define uses a separate per-word loop (do not run race metrics)
        if (isTypeDefineActive()) {
          typeDefineHandleTypingInput(ev, promptEl, inputEl);
          return;
        }

        if (!state.running) return;
        if (runState.finished) return;

        var v = inputEl.value || "";
        var prev = runState.prevValue || "";
        var maxLen = state.prompt.length;

        var isComp = composing || (ev && ev.isComposing);

        // Force cursor to end (avoid mid-string edits that break metrics)
        if (!isComp) {
          try { inputEl.setSelectionRange(v.length, v.length); } catch (err) {}
        }

        // cap to prompt length
        if (v.length > maxLen) {
          inputEl.value = v.slice(0, maxLen);
          v = inputEl.value;
        }

        // Enforce prefix-only editing to keep stats honest.
        // Allow: append at end, backspace from end. Disallow: mid-string edits.
        if (prev && !isComp) {
          if (v.length >= prev.length) {
            if (v.slice(0, prev.length) !== prev) {
              inputEl.value = prev;
              v = prev;
              toastCooldown("Keep typing at the end");
            }
          } else {
            if (prev.slice(0, v.length) !== v) {
              inputEl.value = prev.slice(0, v.length);
              v = inputEl.value;
              toastCooldown("Keep typing at the end");
            }
          }
        }

        runState.progressLen = v.length;

        // Block multi-character jumps (paste/autofill/teleport typing).
        // Allow deletion and 1-char growth; clamp the rest.
        if (!isComp && (v.length - prev.length > 1)) {
          var nextCh = v.charAt(prev.length);
          inputEl.value = prev + nextCh;
          v = inputEl.value;
          toastCooldown("Paste disabled");
        }

        // Count only newly added characters (do not subtract on delete/backspace)
        if (v.length > prev.length) {
          var addedCount = v.length - prev.length;
          var startPos = prev.length;
          runState.totalAdded += addedCount;
          for (var i = 0; i < addedCount; i++) {
            var pos = startPos + i;
            var typedCh = v.charAt(pos);
            var targetCh = state.prompt.charAt(pos);
            if (typedCh !== targetCh) {
              runState.totalErrors += 1;
              if (!runState.missCounts) runState.missCounts = {};
              var key = (targetCh === " ") ? "[space]" : String(targetCh).toLowerCase();
              runState.missCounts[key] = (runState.missCounts[key] || 0) + 1;

              pulseShake();

              // Bigram heuristic: count expected bigram around the error
              if (!runState.bigramCounts) runState.bigramCounts = {};
              var bi = "";
              if (pos + 1 < state.prompt.length) {
                bi = targetCh + state.prompt.charAt(pos + 1);
              } else if (pos - 1 >= 0) {
                bi = state.prompt.charAt(pos - 1) + targetCh;
              }
              if (bi) {
                var biKey = String(bi).toLowerCase();
                runState.bigramCounts[biKey] = (runState.bigramCounts[biKey] || 0) + 1;
              }
            }
          }
        }

        runState.prevValue = v;

        schedulePromptHighlightRender(promptEl, v, state.prompt);
        setProgress((v.length / state.prompt.length) * 100);

        updateIntentProgress(v.length, state && state.prompt ? state.prompt.length : 0, runState && runState.totalErrors ? runState.totalErrors : 0);

        updateGoalProgress(v);

        // Practice: no timer loop, so repaint stats on input
        if (!runState.timerEnabled) updateStatsOnce();

        // Finish condition: must match exactly
        if (stringsMatchExactly(v, state.prompt)) {
          runState.finished = true;
          state.running = false;
          stopTick();
          inputEl.disabled = true;

          // Use the same clock as the HUD (state.startedAt uses performance.now when available).
          var nowClock = (window.performance && performance.now) ? performance.now() : Date.now();
          var elapsedMs = Math.max(0, Math.round(nowClock - (state.startedAt || nowClock)));
          var elapsedSeconds = elapsedMs / 1000;
          var wpm = computeWpm(state.prompt.length, elapsedSeconds);
          var accPct = computeAcc(runState.totalAdded, runState.totalErrors);

          var focusNeedsClean = !!(runState && runState.focusMode) && isFocusModeSupported();
          var clean = ((runState.totalErrors | 0) === 0);
          if (focusNeedsClean && !clean) {
            syncDockButtons("retry");
            setPromptCardState(false, false);
            setIntent("Focus mode: clean run required", "warn");
          } else {
            syncDockButtons("finished");
            setPromptCardState(false, clean);
            if (clean) {
              setIntent("Clean", "ok");
            } else {
              setIntent("Done • Accuracy: " + String(accPct) + "%", "");
            }
          }

          // (Intent line set above; keep the rest of feedback and result logic unchanged.)

          var top = computeTopMistakes(state.prompt, v, runState.missCounts);
          var tips = formatTopMistakes(top);

          // Coaching based on accuracy
          if (accPct < ACC_COACH_LOW) {
            if (isNgramDrillActive()) tips = tips + " • Tip: slow down and aim for 0 mistakes.";
            else tips = tips + " • Tip: slow down and aim for " + String(ACC_GOAL) + "%+ before speed.";
          } else if (accPct < ACC_GOAL) {
            tips = tips + " • Almost there—push for " + String(ACC_GOAL) + "%+.";
          } else {
            if (isNgramDrillActive()) tips = tips + " • Nice—keep it clean and smooth.";
            else tips = tips + " • Nice—now you can safely chase speed.";
          }

          var isPractice = (runState.mode === "practice");
          var isTimeTrial = (runState.mode === "timeTrial");
          var isLessons = (runState.mode === "lessons");
          var needsRetry = (!isPractice) && (accPct < ACC_RETRY_THRESHOLD);
          setRetryUI(needsRetry);

          var feedbackText = buildRaceFeedbackText(runState.missCounts, runState.bigramCounts);

          // Persist weaknesses per profile (chars + bigrams).
          // Record once per completed prompt (not per keystroke) across all Typing modes.
          try {
            if (window.State && typeof State.recordTypingWeakness === "function") {
              var src = "";
              if (isNgramDrillActive()) src = "ngrams";
              else if (runState && runState.mode) src = String(runState.mode);
              if (!src) src = "race";
              State.recordTypingWeakness(runState.missCounts, runState.bigramCounts, { source: src });
            }
          } catch (eTW) {}

          // Pairs & Patterns: award small, capped practice XP into the profile level system.
          // Mechanics unchanged: +1 XP only when accuracy meets ACC_GOAL.
          // Messaging clarified so users know why XP was/wasn't awarded.
          if (isNgramDrillActive()) {
            var xpMsg = "";

            if (accPct >= ACC_GOAL) {
              try {
                if (window.State && typeof State.awardTypingPracticeXp === "function") {
                  var packId = normalizeTypingXpKeyPart(runState && runState.drillPackId ? runState.drillPackId : "");
                  var promptKey = normalizeTypingXpKeyPart(state && state.prompt ? state.prompt : "");
                  var key = "typing:ngrams:" + packId + ":" + promptKey;
                  var res = State.awardTypingPracticeXp(1, { key: key, reason: "typing_ngrams_practice" });

                  if (res && res.awarded) {
                    xpMsg = "+" + String(res.amount || 1) + " XP (95%+ accuracy)";
                  } else {
                    // Prefer the most informative reason: cap > duplicate > generic
                    var r = res ? String(res.reason || "") : "";
                    if (r === "cap") xpMsg = "Saved (daily XP cap reached)";
                    else if (r === "duplicate") xpMsg = "Saved (already counted today)";
                    else xpMsg = "Saved";
                  }
                }
              } catch (eTXP) {
                xpMsg = "";
              }
            } else {
              xpMsg = "Saved (need 95%+ accuracy for XP)";
            }

            if (xpMsg) {
              feedbackText = String(feedbackText || "") + "\n\n" + xpMsg;
            }
          }

          // Lessons: award small, capped practice XP when meeting the accuracy goal.
          // (Race has its own XP block; Time Trial awards only on PASS; Practice mode awards no XP.)
          if (!isNgramDrillActive() && isLessons && accPct >= ACC_GOAL && !needsRetry) {
            try {
              if (window.State && typeof State.awardTypingPracticeXp === "function") {
                var modeKey = "lessons";
                var promptKey2 = normalizeTypingXpKeyPart(state && state.prompt ? state.prompt : "");
                var key2 = "typing:" + modeKey + ":" + promptKey2;
                State.awardTypingPracticeXp(1, { key: key2, reason: "typing_" + modeKey + "_prompt" });
              }
            } catch (eTPXP) {}
          }

          var coachText = "";
          if (isPractice) {
            if ((runState.totalErrors || 0) === 0) coachText = "Nice—clean run. Now try to go a little smoother.";
            else coachText = "Slow down and aim for clean spaces and punctuation.";
          }

          // Save bests (keep Typing-only keys). Time Trial best time is separate and only updates on PASS.
          if (isTimeTrial) saveBest(wpm, accPct, elapsedMs, { skipTime: true });
          else saveBest(wpm, accPct, elapsedMs);

          var ttPassed = false;
          if (isTimeTrial) {
            var tsec = getTimeTrialTargetSec();
            ttPassed = (accPct >= TIME_TRIAL_ACC_MIN) && ((elapsedMs / 1000) <= tsec);
            if (ttPassed) saveBestTimeTrial(elapsedMs);

            // Time Trial: award small, capped XP only on PASS.
            try {
              if (ttPassed && window.State && typeof State.awardTypingPracticeXp === "function") {
                var promptKeyTT = normalizeTypingXpKeyPart(state && state.prompt ? state.prompt : "");
                var keyTT = "typing:timeTrial:" + promptKeyTT;
                State.awardTypingPracticeXp(1, { key: keyTT, reason: "typing_time_trial_pass" });
              }
            } catch (eTTXP) {}

            // Actionable “why failed” feedback (Time Trial only)
            // Keep scoring/pass logic unchanged; this is messaging only.
            if (!ttPassed) {
              var targetAcc = TIME_TRIAL_ACC_MIN;
              var targetSec = tsec;

              // Prefer HUD time so the modal explanation matches what the learner saw.
              var elapsedSecUi = 0;
              try {
                if (hudSnapshot && typeof hudSnapshot.seconds === "number" && hudSnapshot.seconds > 0) {
                  elapsedSecUi = hudSnapshot.seconds;
                }
              } catch (eHud) {
                elapsedSecUi = 0;
              }
              try {
                var timeEl = getEl("raceTime");
                var txt = timeEl ? String(timeEl.textContent || "") : "";
                var m = txt.match(/([0-9]+(?:\.[0-9])?)/);
                if (m) elapsedSecUi = parseFloat(m[1]) || 0;
              } catch (e0) {
                elapsedSecUi = 0;
              }
              if (!(elapsedSecUi > 0)) elapsedSecUi = (elapsedMs / 1000);
              var elapsedSec1 = Math.max(0, Math.round(elapsedSecUi * 10) / 10);

              var okAcc = (accPct >= targetAcc);
              var okTime = (elapsedSec1 <= targetSec);

              var missAcc = okAcc ? 0 : Math.max(0, targetAcc - accPct);
              var missTime = okTime ? 0 : Math.max(0, Math.round((elapsedSec1 - targetSec) * 10) / 10);

              var reason = "";
              if (!okAcc && !okTime) reason = "You missed the goal on accuracy and time.";
              else if (!okAcc) reason = "Accuracy was the only thing holding you back.";
              else if (!okTime) reason = "You were accurate—now try to go a little faster.";

              var lines = [];
              if (!okAcc) {
                lines.push(
                  "Accuracy: " + String(accPct) + "% (need " + String(targetAcc) + "%, short by " + String(missAcc) + "%)"
                );
              }
              if (!okTime) {
                lines.push(
                  "Time: " + String(elapsedSec1.toFixed(1)) + "s (goal " + String(targetSec) + "s, over by " + String(missTime.toFixed(1)) + "s)"
                );
              }

              var near = "";
              var nearParts = [];
              if (!okTime && missTime > 0 && missTime <= TIME_TRIAL_NEAR_PASS_SEC) {
                nearParts.push(String(missTime.toFixed(1)) + "s faster");
              }
              if (!okAcc && missAcc > 0 && missAcc <= TIME_TRIAL_NEAR_PASS_ACC_PCT) {
                nearParts.push(String(missAcc) + "% more accuracy");
              }
              if (nearParts.length === 1) {
                near = "So close—just " + nearParts[0] + ".";
              } else if (nearParts.length === 2) {
                near = "So close—just " + nearParts[0] + " and " + nearParts[1] + ".";
              }

              // Race feedback block supports newlines via CSS (white-space: pre-line)
              var extra = [];
              if (reason) extra.push(reason);
              for (var li = 0; li < lines.length; li++) extra.push(lines[li]);
              if (near) extra.push(near);
              if (extra.length) feedbackText = String(feedbackText || "") + "\n\n" + extra.join("\n");
            }
          }
          renderBestOnCenter(runState && runState.mode);

          // ----- Typing Race short rounds (best-of-N) -----
          // Show a clean round results panel with Retry/Next.
          if (!isPractice && !isLessons && !isTimeTrial && !isNgramDrillActive() && runState && runState.mode === "race") {
            try {
              if (!raceMatch || !raceMatch.active) {
                resetRaceMatch();
                raceMatch.active = true;
                raceMatch.roundIndex = 1;
                raceMatch.maxRounds = RACE_MATCH_MAX_ROUNDS;
              }
              // Remember current prompt for retries.
              if (!raceMatch.currentPrompt) raceMatch.currentPrompt = { en: runState.promptEn, pa: runState.promptPa };
            } catch (eRM0) {}

            // Round-end mastery + XP hooks (at round end only)
            try {
              var correct = (accPct >= ACC_GOAL);
              var trackId = RACE_MATCH_TRACK_ID;
              if (window.State && typeof State.recordQuestionAttempt === "function") {
                State.recordQuestionAttempt(trackId, correct);
              }
              if (window.State && typeof State.awardXP === "function") {
                var xp = 2;
                if (correct) xp += 2;
                var perfect = ((runState.totalErrors | 0) === 0);
                if (perfect) xp += 1;
                State.awardXP(xp, { trackId: trackId, reason: "typing_race_round" }, { section: "practice", reason: "typing_race_round" });

                // Reward feedback (messaging only; XP logic unchanged)
                var lines = [];
                lines.push("Race reward: +" + String(xp) + " XP");
                if (perfect) lines.push("Perfect run bonus: +1 XP");
                if (lines.length) feedbackText = String(feedbackText || "") + "\n\n" + lines.join("\n");
              }
            } catch (eXP0) {}

            var isLastRound = false;
            try {
              var iNow = (raceMatch.roundIndex | 0);
              var nNow = (raceMatch.maxRounds | 0) || RACE_MATCH_MAX_ROUNDS;
              if (iNow < 1) iNow = 1;
              isLastRound = (iNow >= nNow);
            } catch (eRM1) { isLastRound = false; }

            var title = isLastRound ? "Match Complete" : getRaceRoundLabel();

            showResultModal(
              wpm,
              accPct,
              elapsedMs,
              runState.totalErrors,
              tips,
              feedbackText,
              coachText,
              isLastRound ? "Finish Match" : "Next Round",
              function() {
                // Advance to next round (or finish match)
                if (isLastRound) {
                  try { resetRaceMatch(); } catch (eRM2) {}
                  showScreenSafe("screen-typing-center");
                  refreshTypingCenterUI();
                  return;
                }

                try {
                  var nextBand = decideNextRaceBand(accPct, wpm);
                  raceMatch.nextBand = nextBand;
                  raceMatch.roundIndex = (raceMatch.roundIndex | 0) + 1;
                  var p1 = pickRaceRoundPrompt(nextBand);
                  raceMatch.currentPrompt = p1;
                  resetRaceUIToPrompt(promptEl, inputEl, p1);
                  setRetryUI(false);
                  startCurrentPromptRun();
                } catch (eRM3) {
                  // Fallback: behave like existing next prompt
                  startNextPromptRun();
                }
              },
              "Retry Round",
              function() {
                try {
                  var same = (raceMatch && raceMatch.currentPrompt) ? raceMatch.currentPrompt : { en: runState.promptEn, pa: runState.promptPa };
                  resetRaceUIToPrompt(promptEl, inputEl, same);
                  setRetryUI(false);
                  startCurrentPromptRun();
                } catch (eRM4) {
                  restartSamePromptWithMessage();
                }
              },
              { title: title }
            );
            return;
          }

          if (isTimeTrial) {
            showResultModal(
              wpm,
              accPct,
              elapsedMs,
              runState.totalErrors,
              tips,
              feedbackText,
              ttPassed ? "PASS" : "TRY AGAIN",
              "Retry (same prompt)",
              function() {
                restartSamePromptTimeTrial(ttPassed ? "Try again—can you beat your best?" : "Try again—beat the target!");
              },
              "Next prompt",
              startNextPromptRun,
              { title: ttPassed ? "PASS" : "TRY AGAIN" }
            );
            return;
          }

          var modalTitle = isPractice ? "Practice Complete" : (isLessons ? "Lesson Complete" : "Race Complete");

          if (isNgramDrillActive()) {
            var step = (runState && runState.drillStep) ? (runState.drillStep | 0) : ((typingDrillSession && typingDrillSession.i != null) ? ((typingDrillSession.i | 0) + 1) : 1);
            var total = (runState && runState.drillTotal) ? (runState.drillTotal | 0) : ((typingDrillSession && typingDrillSession.queue) ? typingDrillSession.queue.length : 0);
            var title = (runState && runState.drillLabel) ? String(runState.drillLabel) : "Pairs & Patterns";
            if (total > 0) title = title + " • " + String(step) + "/" + String(total);

            showResultModal(
              wpm,
              accPct,
              elapsedMs,
              runState.totalErrors,
              tips,
              feedbackText,
              coachText,
              "Next drill",
              startNextNgramDrillPromptRun,
              "Back",
              endNgramDrillToCenter,
              { title: title, isDrill: true }
            );
            return;
          }

          showResultModal(
            wpm,
            accPct,
            elapsedMs,
            runState.totalErrors,
            tips,
            feedbackText,
            coachText,
            isPractice ? "Try again" : (needsRetry ? "Retry same prompt" : "Next prompt"),
            isPractice ? restartSamePromptPractice : (needsRetry ? restartSamePromptWithMessage : startNextPromptRun),
            isPractice ? "Next prompt" : (needsRetry ? "Next prompt" : "Back"),
            isPractice ? startNextPromptRun : (needsRetry ? startNextPromptRun : function() { showScreenSafe("screen-typing-center"); }),
            { title: modalTitle }
          );
        }
      });
    }

    // Best-effort cleanup on lifecycle events (prevents stuck scroll lock)
    if (!window.__boloTypingScrollLockBound) {
      window.__boloTypingScrollLockBound = true;
      window.addEventListener("pagehide", function() {
        cancelCountdown();
        removeScrollLock();
        try {
          var i = getEl("raceInput");
          if (i && i.blur) i.blur();
        } catch (e) {}
      });
      document.addEventListener("visibilitychange", function() {
        try {
          if (document.hidden) {
            cancelCountdown();
            removeScrollLock();
            var i2 = getEl("raceInput");
            if (i2 && i2.blur) i2.blur();
          }
        } catch (e2) {}
      });
    }
  }

  // Optional debug self-test: verifies key IDs exist.
  // Enable by setting DEBUG_TYPING_SELF_TEST = true.
  function typingSelfTest() {
    var ids = [
      "screen-typing-center",
      "typingCenterSubtitle",
      "typingCenterObjective",
      "typingLastModeLine",
      "typingModePractice",
      "typingModeTimeTrial",
      "typingModeRace",
      "typingRaceStartBtn",
      "typingRaceStatsBtn",
      "typingRaceStatWpm",
      "typingRaceStatAcc",
      "typingRaceStatTime",
      "typingModeNgrams",
      "typingCardMeta_ngrams",
      "typingCardMeta_timeTrial",
      "typingTypeDefineStartBtn",
      "screen-typing-race",
      "typingRaceBackBtn",
      "raceSubtitle",
      "raceGoalLine",
      "racePromptCard",
      "racePrompt",
      "raceInput",
      "raceStartBtn",
      "raceResetBtn",
      "raceNextBtn",
      "raceFocusBtn",
      "raceCountdown",
      "raceCountdownNum"
    ];

    var missing = [];
    for (var i = 0; i < ids.length; i++) {
      if (!document.getElementById(ids[i])) missing.push(ids[i]);
    }

    try {
      if (typeof console !== "undefined" && console && typeof console.warn === "function") {
        if (missing.length) console.warn("[TypingPremium][self-test] Missing IDs:", missing);
        else console.log("[TypingPremium][self-test] OK");
      }
    } catch (e0) {}

    return { ok: missing.length === 0, missing: missing };
  }

  try {
    window.TYPING_SELF_TEST = function() {
      if (!DEBUG_TYPING_SELF_TEST) {
        return { ok: false, missing: ["SELF_TEST_DISABLED"] };
      }
      return typingSelfTest();
    };
  } catch (e1) {}

  function init() {
    setupKeyboardInsetVar();
    ensureBestV2Migrated();
    try { runState.targetTimeSeconds = readTimeTrialTargetSec(); } catch (e0) {}
    bindTypingCenter();
    bindTypingRace();
    renderBestOnCenter(readLastMode() || (runState && runState.mode) || "practice");
  }

  function getTypingHeaderHelperText() {
    if (runState && runState.drillKind === "ngrams") return "Type › Pairs & Patterns";

    var mode = (runState && runState.mode) ? String(runState.mode) : "";
    if (mode === "practice") return "Type › Practice";
    if (mode === "typeDefine") return "Type › Type & Define";
    if (mode === "timeTrial") return "Type › Time Trial";
    if (mode === "lessons") return "Type › Lessons";
    return "Type › Race";
  }

  var _typingPremiumPrev = window.TypingPremium || {};
  window.TypingPremium = {
    _inited: false,
    platform: _typingPremiumPrev.platform || {},
    storage: _typingPremiumPrev.storage || {},
    getCurrentMode: function() {
      if (runState && runState.drillKind === "ngrams") return "ngrams";
      return (runState && runState.mode) ? String(runState.mode) : "race";
    },
    getHeaderHelperText: function() {
      return getTypingHeaderHelperText();
    },
    pickSharedPrompt: function() {
      return pickSharedTypingPrompt();
    },
    init: function() {
      if (window.TypingPremium._inited) return;
      try {
        init();
        window.TypingPremium._inited = true;
      } catch (e0) {
        window.TypingPremium._inited = false;
        try {
          if (typeof console !== "undefined" && console && typeof console.error === "function") {
            console.error("[TypingPremium] init failed (will allow retry)", e0);
          }
        } catch (e1) {}
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      window.TypingPremium.init();
    });
  } else {
    window.TypingPremium.init();
  }
})();
