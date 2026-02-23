// Typing storage + shared helpers (no DOM)
(function() {
  if (!window.TypingPremium || typeof window.TypingPremium !== "object") {
    window.TypingPremium = {};
  }

  var TP = window.TypingPremium;
  if (!TP.storage || typeof TP.storage !== "object") TP.storage = {};

  var storage = TP.storage;

  // Keys (keep stable; used in older releases)
  storage.TIME_TRIAL_TARGET_SEC_KEY = "bolo_typing_time_trial_target_sec";
  storage.TIME_TRIAL_BEST_META_KEY = "bolo_typing_best_time_trial_v1";
  // New: explicit Time Trial duration modes (UI: 30s / 60s)
  storage.TIME_TRIAL_DURATION_SEC_KEY = "bolo_typing_time_trial_duration_sec";
  storage.TIME_TRIAL_BEST_META_KEY_60 = "bolo_typing_best_time_trial_v1_60";

  storage.normalizeTimeTrialDurationSec = function normalizeTimeTrialDurationSec(sec, defaultSec) {
    var def = (typeof defaultSec === "number" && isFinite(defaultSec)) ? (defaultSec | 0) : 30;
    var v = parseInt(sec, 10);
    if (!isFinite(v)) v = def;
    // Only allow the two supported modes.
    if (v === 60) return 60;
    return 30;
  };

  storage.readTimeTrialDurationSec = function readTimeTrialDurationSec(defaultSec) {
    var def = (typeof defaultSec === "number" && isFinite(defaultSec)) ? (defaultSec | 0) : 30;
    try {
      var raw = localStorage.getItem(storage.TIME_TRIAL_DURATION_SEC_KEY);
      return storage.normalizeTimeTrialDurationSec(raw, def);
    } catch (e) {
      return storage.normalizeTimeTrialDurationSec(def, 30);
    }
  };

  storage.writeTimeTrialDurationSec = function writeTimeTrialDurationSec(sec, defaultSec) {
    var def = (typeof defaultSec === "number" && isFinite(defaultSec)) ? (defaultSec | 0) : 30;
    try {
      var v = storage.normalizeTimeTrialDurationSec(sec, def);
      localStorage.setItem(storage.TIME_TRIAL_DURATION_SEC_KEY, String(v));
    } catch (e) {}
  };

  storage.clampNumber = function clampNumber(n, min, max) {
    var v = (typeof n === "number" && isFinite(n)) ? n : parseFloat(n);
    if (!isFinite(v)) v = min;
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
  };

  storage.countWordsInText = function countWordsInText(text) {
    if (!text) return 0;
    var s = String(text);
    s = s.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
    if (!s) return 0;
    var parts = s.split(" ");
    var n = 0;
    for (var i = 0; i < parts.length; i++) if (parts[i]) n += 1;
    return n;
  };

  storage.promptCleanLen = function promptCleanLen(en) {
    if (!en) return 0;
    var s = String(en);
    s = s.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
    return s.length;
  };

  storage.countPunctuationChars = function countPunctuationChars(en) {
    if (!en) return 0;
    var s = String(en);
    var m = s.match(/[\.,;:!?\"'\(\)\[\]\{\}\-—]/g);
    return m ? m.length : 0;
  };

  // Defaults are provided by typing runtime; these helpers accept explicit values.
  storage.computeTimeTrialTargetSec = function computeTimeTrialTargetSec(en, opts) {
    // Simple, explainable model:
    // targetSec ≈ words / (TARGET_WPM / 60)
    opts = opts || {};
    var targetWpm = (typeof opts.targetWpm === "number" && isFinite(opts.targetWpm)) ? opts.targetWpm : 40;
    var minSec = (typeof opts.minSec === "number" && isFinite(opts.minSec)) ? opts.minSec : 20;
    var maxSec = (typeof opts.maxSec === "number" && isFinite(opts.maxSec)) ? opts.maxSec : 75;
    var defaultSec = (typeof opts.defaultSec === "number" && isFinite(opts.defaultSec)) ? opts.defaultSec : 30;

    var w = storage.countWordsInText(en);
    // If word count is low due to punctuation/formatting, use a chars→words estimate.
    var chars = storage.promptCleanLen(en);
    var estWords = Math.max(w, Math.round(chars / 5));
    var wps = targetWpm / 60;
    var sec = (estWords > 0 && wps > 0) ? (estWords / wps) : defaultSec;
    sec = Math.round(sec);
    sec = storage.clampNumber(sec, minSec, maxSec);
    return (sec | 0) || defaultSec;
  };

  storage.clampTimeTrialTargetSec = function clampTimeTrialTargetSec(n, minSec, maxSec) {
    var minV = (typeof minSec === "number" && isFinite(minSec)) ? minSec : 20;
    var maxV = (typeof maxSec === "number" && isFinite(maxSec)) ? maxSec : 75;

    var v = parseInt(n, 10);
    if (!isFinite(v)) v = 0;
    // Keep conservative bounds (avoids absurd values from storage)
    if (v < minV) v = 0;
    if (v > maxV) v = 0;
    return v;
  };

  storage.readTimeTrialTargetSec = function readTimeTrialTargetSec(defaultSec, minSec, maxSec) {
    var def = (typeof defaultSec === "number" && isFinite(defaultSec)) ? defaultSec : 30;
    var minV = (typeof minSec === "number" && isFinite(minSec)) ? minSec : 20;
    var maxV = (typeof maxSec === "number" && isFinite(maxSec)) ? maxSec : 75;
    try {
      var raw = localStorage.getItem(storage.TIME_TRIAL_TARGET_SEC_KEY);
      var v = storage.clampTimeTrialTargetSec(raw, minV, maxV);
      if (v > 0) return v;
    } catch (e) {}
    return def;
  };

  storage.writeTimeTrialTargetSec = function writeTimeTrialTargetSec(sec, defaultSec, minSec, maxSec) {
    var def = (typeof defaultSec === "number" && isFinite(defaultSec)) ? defaultSec : 30;
    var minV = (typeof minSec === "number" && isFinite(minSec)) ? minSec : 20;
    var maxV = (typeof maxSec === "number" && isFinite(maxSec)) ? maxSec : 75;
    try {
      var v = storage.clampTimeTrialTargetSec(sec, minV, maxV);
      if (!(v > 0)) v = def;
      localStorage.setItem(storage.TIME_TRIAL_TARGET_SEC_KEY, String(v));
    } catch (e) {}
  };

  storage.safeJsonParse = function safeJsonParse(raw, fallback) {
    try {
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return (v == null) ? fallback : v;
    } catch (e) {
      return fallback;
    }
  };

  storage.formatSeconds1 = function formatSeconds1(n) {
    var v = (typeof n === "number" && isFinite(n)) ? n : parseFloat(n);
    if (!isFinite(v) || !(v > 0)) return "";
    v = Math.round(v * 10) / 10;
    return v.toFixed(1);
  };

  storage.getTimeTrialBestMeta = function getTimeTrialBestMeta() {
    try {
      var raw = localStorage.getItem(storage.TIME_TRIAL_BEST_META_KEY);
      return storage.safeJsonParse(raw, null);
    } catch (e) {
      return null;
    }
  };

  storage.getTimeTrialBestMetaForDuration = function getTimeTrialBestMetaForDuration(durationSec) {
    var d = storage.normalizeTimeTrialDurationSec(durationSec, 30);
    try {
      if (d === 60) {
        var raw60 = localStorage.getItem(storage.TIME_TRIAL_BEST_META_KEY_60);
        return storage.safeJsonParse(raw60, null);
      }
      // 30s uses the legacy key.
      return storage.getTimeTrialBestMeta();
    } catch (e) {
      return null;
    }
  };

  storage.setTimeTrialBestMeta = function setTimeTrialBestMeta(rec) {
    try {
      localStorage.setItem(storage.TIME_TRIAL_BEST_META_KEY, JSON.stringify(rec));
    } catch (e) {}
  };

  storage.setTimeTrialBestMetaForDuration = function setTimeTrialBestMetaForDuration(durationSec, rec) {
    var d = storage.normalizeTimeTrialDurationSec(durationSec, 30);
    try {
      if (d === 60) {
        localStorage.setItem(storage.TIME_TRIAL_BEST_META_KEY_60, JSON.stringify(rec));
        return;
      }
      // 30s uses the legacy key.
      storage.setTimeTrialBestMeta(rec);
    } catch (e) {}
  };
})();
