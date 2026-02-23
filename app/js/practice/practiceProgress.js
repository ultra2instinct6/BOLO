// Practice Mode v1.2
// Practice Progress + Session History (offline localStorage, versioned, fails soft)
// Keys:
// - practiceProgressV1_2
// - practiceSessionHistory

(function() {
  "use strict";

  if (window.PracticeProgress) return;

  var PROGRESS_KEY = "practiceProgressV1_2";
  var HISTORY_KEY = "practiceSessionHistory";
  var SCHEMA_VERSION = "1.2";
  var HISTORY_MAX = 10;

  function _hasLocalStorage() {
    try {
      return typeof localStorage !== "undefined" && !!localStorage;
    } catch (e) {
      return false;
    }
  }

  function _safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function _safeStringify(obj) {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return "";
    }
  }

  function _isPlainObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function _toInt(n, fallback) {
    var v = Number(n);
    if (!isFinite(v) || isNaN(v)) return fallback;
    return Math.floor(v);
  }

  function _clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function _defaultProgress() {
    return {
      schemaVersion: SCHEMA_VERSION,
      totals: { attempts: 0, correct: 0, wrong: 0, bestStreak: 0 },
      byPack: {},
      lastSession: { startedAt: null, endedAt: null, packId: null, attempts: 0, correct: 0, wrong: 0, bestStreak: 0 }
    };
  }

  function _repairPackStats(value) {
    var v = _isPlainObject(value) ? value : {};
    return {
      attempts: Math.max(0, _toInt(v.attempts, 0)),
      correct: Math.max(0, _toInt(v.correct, 0)),
      wrong: Math.max(0, _toInt(v.wrong, 0)),
      bestStreak: Math.max(0, _toInt(v.bestStreak, 0)),
      lastPlayedAt: (typeof v.lastPlayedAt === "number") ? v.lastPlayedAt : null,
      mastery: _clamp(_toInt(v.mastery, 0), 0, 100)
    };
  }

  function _migrateProgress(raw) {
    // Never throw; return a valid v1.2 object.
    try {
      var base = _defaultProgress();
      if (!_isPlainObject(raw)) return base;

      // If already v1.2, still repair values.
      var out = _defaultProgress();
      out.schemaVersion = SCHEMA_VERSION;

      var totals = _isPlainObject(raw.totals) ? raw.totals : {};
      out.totals = {
        attempts: Math.max(0, _toInt(totals.attempts, 0)),
        correct: Math.max(0, _toInt(totals.correct, 0)),
        wrong: Math.max(0, _toInt(totals.wrong, 0)),
        bestStreak: Math.max(0, _toInt(totals.bestStreak, 0))
      };

      var byPack = _isPlainObject(raw.byPack) ? raw.byPack : {};
      out.byPack = {};
      for (var k in byPack) {
        if (!Object.prototype.hasOwnProperty.call(byPack, k)) continue;
        if (typeof k !== "string" || !k) continue;
        out.byPack[k] = _repairPackStats(byPack[k]);
      }

      var ls = _isPlainObject(raw.lastSession) ? raw.lastSession : {};
      out.lastSession = {
        startedAt: (typeof ls.startedAt === "number") ? ls.startedAt : null,
        endedAt: (typeof ls.endedAt === "number") ? ls.endedAt : null,
        packId: (typeof ls.packId === "string") ? ls.packId : null,
        attempts: Math.max(0, _toInt(ls.attempts, 0)),
        correct: Math.max(0, _toInt(ls.correct, 0)),
        wrong: Math.max(0, _toInt(ls.wrong, 0)),
        bestStreak: Math.max(0, _toInt(ls.bestStreak, 0))
      };

      return out;
    } catch (e) {
      return _defaultProgress();
    }
  }

  function loadProgress() {
    try {
      if (!_hasLocalStorage()) return _defaultProgress();
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return _defaultProgress();
      return _migrateProgress(_safeParse(raw));
    } catch (e) {
      return _defaultProgress();
    }
  }

  function saveProgress(progress) {
    try {
      if (!_hasLocalStorage()) return false;
      var repaired = _migrateProgress(progress);
      var json = _safeStringify(repaired);
      if (!json) return false;
      localStorage.setItem(PROGRESS_KEY, json);
      return true;
    } catch (e) {
      return false;
    }
  }

  function _defaultHistory() {
    return [];
  }

  function _repairHistoryEntry(e) {
    e = _isPlainObject(e) ? e : {};
    var attempts = Math.max(0, _toInt(e.attempts, 0));
    var correct = Math.max(0, _toInt(e.correct, 0));
    var wrong = Math.max(0, _toInt(e.wrong, 0));
    return {
      startedAt: (typeof e.startedAt === "number") ? e.startedAt : null,
      endedAt: (typeof e.endedAt === "number") ? e.endedAt : null,
      packId: (typeof e.packId === "string") ? e.packId : null,
      attempts: attempts,
      correct: correct,
      wrong: wrong,
      bestStreak: Math.max(0, _toInt(e.bestStreak, 0)),
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0
    };
  }

  function loadHistory() {
    try {
      if (!_hasLocalStorage()) return _defaultHistory();
      var raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return _defaultHistory();
      var parsed = _safeParse(raw);
      if (!Array.isArray(parsed)) return _defaultHistory();
      var out = [];
      for (var i = 0; i < parsed.length; i++) out.push(_repairHistoryEntry(parsed[i]));
      return out.slice(0, HISTORY_MAX);
    } catch (e) {
      return _defaultHistory();
    }
  }

  function saveHistory(history) {
    try {
      if (!_hasLocalStorage()) return false;
      var arr = Array.isArray(history) ? history : [];
      var out = [];
      for (var i = 0; i < arr.length; i++) out.push(_repairHistoryEntry(arr[i]));
      out = out.slice(0, HISTORY_MAX);
      var json = _safeStringify(out);
      if (!json) return false;
      localStorage.setItem(HISTORY_KEY, json);
      return true;
    } catch (e) {
      return false;
    }
  }

  function _ensurePack(progress, packId) {
    if (!_isPlainObject(progress.byPack)) progress.byPack = {};
    if (!progress.byPack[packId]) progress.byPack[packId] = _repairPackStats(null);
    progress.byPack[packId] = _repairPackStats(progress.byPack[packId]);
    return progress.byPack[packId];
  }

  function recordAttempt(packId, isCorrect, bestStreakNow, atMs) {
    try {
      if (typeof packId !== "string" || !packId) packId = "UNKNOWN";

      var progress = loadProgress();

      progress.totals.attempts = Math.max(0, _toInt(progress.totals.attempts, 0)) + 1;
      if (isCorrect) progress.totals.correct = Math.max(0, _toInt(progress.totals.correct, 0)) + 1;
      else progress.totals.wrong = Math.max(0, _toInt(progress.totals.wrong, 0)) + 1;

      var bs = Math.max(0, _toInt(bestStreakNow, 0));
      if (bs > Math.max(0, _toInt(progress.totals.bestStreak, 0))) progress.totals.bestStreak = bs;

      var p = _ensurePack(progress, packId);
      p.attempts++;
      if (isCorrect) p.correct++;
      else p.wrong++;
      if (bs > p.bestStreak) p.bestStreak = bs;
      p.lastPlayedAt = (typeof atMs === "number") ? atMs : Date.now();

      // Mastery: +2 correct, -3 wrong, clamp 0..100
      var delta = isCorrect ? 2 : -3;
      p.mastery = _clamp(_toInt(p.mastery, 0) + delta, 0, 100);

      saveProgress(progress);
      return true;
    } catch (e) {
      return false;
    }
  }

  function applySessionBonus(packId, attempts, correct) {
    try {
      if (typeof packId !== "string" || !packId) return false;
      attempts = Math.max(0, _toInt(attempts, 0));
      correct = Math.max(0, _toInt(correct, 0));
      if (attempts < 10) return false;
      var acc = attempts ? (correct / attempts) : 0;
      if (acc < 0.8) return false;

      var progress = loadProgress();
      var p = _ensurePack(progress, packId);
      p.mastery = _clamp(_toInt(p.mastery, 0) + 5, 0, 100);
      saveProgress(progress);
      return true;
    } catch (e) {
      return false;
    }
  }

  function finalizeSession(session) {
    // session: {startedAt, endedAt, packId, attempts, correct, wrong, bestStreak}
    try {
      session = _repairHistoryEntry(session);
      var packId = session.packId || "UNKNOWN";

      // Update lastSession
      var progress = loadProgress();
      progress.lastSession = {
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        packId: packId,
        attempts: session.attempts,
        correct: session.correct,
        wrong: session.wrong,
        bestStreak: session.bestStreak
      };
      saveProgress(progress);

      // Optional mastery bonus
      applySessionBonus(packId, session.attempts, session.correct);

      // Append to history (most recent first)
      var history = loadHistory();
      history.unshift(session);
      history = history.slice(0, HISTORY_MAX);
      saveHistory(history);

      return true;
    } catch (e) {
      return false;
    }
  }

  function getPackStats(packId) {
    try {
      var progress = loadProgress();
      if (!_isPlainObject(progress.byPack)) return _repairPackStats(null);
      return _repairPackStats(progress.byPack[packId]);
    } catch (e) {
      return _repairPackStats(null);
    }
  }

  function getPackLabel(packId) {
    try {
      if (window.PracticePacks && Array.isArray(window.PracticePacks.packs)) {
        for (var i = 0; i < window.PracticePacks.packs.length; i++) {
          var p = window.PracticePacks.packs[i];
          if (p && p.packId === packId) return p.title || packId;
        }
      }
    } catch (e) {}
    return packId;
  }

  function init() {
    // Ensures keys exist and are repaired to v1.2 shape; never throws.
    try {
      if (!_hasLocalStorage()) return false;

      var p0 = null;
      try { p0 = _safeParse(localStorage.getItem(PROGRESS_KEY)); } catch (e0) { p0 = null; }
      var repaired = _migrateProgress(p0);
      saveProgress(repaired);

      var h0 = null;
      try { h0 = _safeParse(localStorage.getItem(HISTORY_KEY)); } catch (e1) { h0 = null; }
      if (!Array.isArray(h0)) saveHistory([]);
      else saveHistory(h0);

      return true;
    } catch (e) {
      return false;
    }
  }

  window.PracticeProgress = {
    PROGRESS_KEY: PROGRESS_KEY,
    HISTORY_KEY: HISTORY_KEY,
    SCHEMA_VERSION: SCHEMA_VERSION,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    loadHistory: loadHistory,
    saveHistory: saveHistory,
    recordAttempt: recordAttempt,
    finalizeSession: finalizeSession,
    applySessionBonus: applySessionBonus,
    getPackStats: getPackStats,
    getPackLabel: getPackLabel,
    init: init
  };
})();
