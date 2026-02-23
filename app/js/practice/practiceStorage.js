// Practice Mode v1.2
// Robust, versioned localStorage persistence (singleton)
// Global module pattern (no imports/exports)

(function() {
  "use strict";

  if (window.PracticeStorage) return;

  var STORAGE_KEY = "bolo.practice.v1";
  var STORAGE_VERSION = 1;
  var HISTORY_MAX = 20;

  var DEFAULT_SETTINGS_BY_MODE = {
    typing: {
      difficulty: "easy",
      length: 10,
      hints: true,
      autoAdvance: true,
      numberWords: true,
      sound: false
    },
    facts: {
      difficulty: "easy",
      length: 10,
      hints: true,
      autoAdvance: true,
      numberWords: true,
      sound: false
    },
    patterns: {
      difficulty: "easy",
      length: 10,
      hints: true,
      autoAdvance: true,
      numberWords: true,
      sound: false
    }
  };

  function _defaultData() {
    return {
      STORAGE_VERSION: STORAGE_VERSION,
      settingsByMode: {
        typing: _shallowClone(DEFAULT_SETTINGS_BY_MODE.typing),
        facts: _shallowClone(DEFAULT_SETTINGS_BY_MODE.facts),
        patterns: _shallowClone(DEFAULT_SETTINGS_BY_MODE.patterns)
      },
      lastMode: "typing",
      resume: null,
      stats: {
        sessionsCompleted: 0,
        totalCorrect: 0,
        totalWrong: 0,
        bestStreakEver: 0,
        lastPlayedAt: null
      },
      history: []
    };
  }

  function _hasLocalStorage() {
    try {
      return typeof localStorage !== "undefined" && localStorage;
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

  function _shallowClone(obj) {
    if (!obj || typeof obj !== "object") return {};
    var out = {};
    for (var k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
    }
    return out;
  }

  function _isPlainObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function _toInt(n, fallback) {
    var v = Number(n);
    if (!isFinite(v) || isNaN(v)) return fallback;
    return Math.floor(v);
  }

  function _toBool(v, fallback) {
    if (typeof v === "boolean") return v;
    return fallback;
  }

  function _toStr(v, fallback) {
    if (typeof v === "string" && v.trim().length) return v;
    return fallback;
  }

  function _normalizeMode(mode) {
    // Facts/Patterns modes were removed from the UI; keep storage robust by
    // coercing any legacy values back to typing.
    if (mode === "typing") return mode;
    return "typing";
  }

  function _repairSettings(mode, value) {
    var m = _normalizeMode(mode);
    var defaults = DEFAULT_SETTINGS_BY_MODE[m];
    var out = _shallowClone(defaults);

    if (_isPlainObject(value)) {
      for (var k in value) {
        if (!Object.prototype.hasOwnProperty.call(value, k)) continue;
        out[k] = value[k];
      }
    }

    // Light type repairs for common fields
    if (typeof out.length === "number") {
      if (!isFinite(out.length) || isNaN(out.length)) out.length = defaults.length;
      if (out.length < 1) out.length = 1;
    } else if (out.length !== "endless") {
      out.length = defaults.length;
    }

    out.hints = _toBool(out.hints, defaults.hints);
    out.autoAdvance = _toBool(out.autoAdvance, defaults.autoAdvance);
    out.numberWords = _toBool(out.numberWords, defaults.numberWords);
    out.sound = _toBool(out.sound, defaults.sound);

    out.difficulty = (typeof out.difficulty === "string") ? out.difficulty : defaults.difficulty;
    return out;
  }

  function _repairData(data) {
    var d = _defaultData();
    if (!_isPlainObject(data)) return d;

    // Version
    d.STORAGE_VERSION = _toInt(data.STORAGE_VERSION, STORAGE_VERSION);

    // settingsByMode
    var sbm = _isPlainObject(data.settingsByMode) ? data.settingsByMode : {};
    d.settingsByMode = {
      typing: _repairSettings("typing", sbm.typing),
      facts: _repairSettings("facts", sbm.facts),
      patterns: _repairSettings("patterns", sbm.patterns)
    };

    // lastMode
    d.lastMode = _normalizeMode(_toStr(data.lastMode, "typing"));

    // stats
    var st = _isPlainObject(data.stats) ? data.stats : {};
    d.stats = {
      sessionsCompleted: Math.max(0, _toInt(st.sessionsCompleted, 0)),
      totalCorrect: Math.max(0, _toInt(st.totalCorrect, 0)),
      totalWrong: Math.max(0, _toInt(st.totalWrong, 0)),
      bestStreakEver: Math.max(0, _toInt(st.bestStreakEver, 0)),
      lastPlayedAt: (typeof st.lastPlayedAt === "number") ? st.lastPlayedAt : null
    };

    // history
    var h = Array.isArray(data.history) ? data.history.slice(0, HISTORY_MAX) : [];
    d.history = h;

    // resume (optional)
    if (_isPlainObject(data.resume)) {
      var r = data.resume;
      d.resume = {
        savedAt: _toInt(r.savedAt, 0),
        phase: (typeof r.phase === "string") ? r.phase : null,
        mode: _normalizeMode(_toStr(r.mode, "typing")),
        snapshot: _isPlainObject(r.snapshot) ? r.snapshot : null
      };
    } else {
      d.resume = null;
    }

    return d;
  }

  function _migrate(oldData) {
    // v1 is the first version. If future versions exist, transform here.
    // Always return an object; never throw.
    try {
      var v = _toInt(oldData && oldData.STORAGE_VERSION, 0);
      if (v === STORAGE_VERSION) return oldData;

      // Example placeholder for future migrations:
      // if (v === 0) { ... }

      // For unknown versions, fall back to defaults but keep what we can.
      return oldData;
    } catch (e) {
      return null;
    }
  }

  function load() {
    var raw = null;
    var parsed = null;

    if (_hasLocalStorage()) {
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        raw = null;
      }
    }

    if (raw && typeof raw === "string") {
      parsed = _safeParse(raw);
    }

    if (!parsed) {
      return _defaultData();
    }

    var migrated = _migrate(parsed);
    var repaired = _repairData(migrated);
    repaired.STORAGE_VERSION = STORAGE_VERSION;
    return repaired;
  }

  function save(data) {
    try {
      var repaired = _repairData(_migrate(data));
      repaired.STORAGE_VERSION = STORAGE_VERSION;

      if (!_hasLocalStorage()) return false;
      var json = _safeStringify(repaired);
      if (!json) return false;
      localStorage.setItem(STORAGE_KEY, json);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getSettings(mode) {
    var d = load();
    var m = _normalizeMode(mode);
    var merged = _repairSettings(m, d.settingsByMode && d.settingsByMode[m]);
    return _shallowClone(merged);
  }

  function setSettings(mode, partialSettings) {
    var d = load();
    var m = _normalizeMode(mode);
    var current = (d.settingsByMode && d.settingsByMode[m]) ? d.settingsByMode[m] : null;
    var next = _repairSettings(m, _isPlainObject(current) ? current : {});

    if (_isPlainObject(partialSettings)) {
      for (var k in partialSettings) {
        if (!Object.prototype.hasOwnProperty.call(partialSettings, k)) continue;
        next[k] = partialSettings[k];
      }
    }

    d.settingsByMode[m] = _repairSettings(m, next);
    d.lastMode = m;
    save(d);
    return _shallowClone(d.settingsByMode[m]);
  }

  function getResume() {
    var d = load();
    if (!_isPlainObject(d.resume)) return null;
    return {
      savedAt: _toInt(d.resume.savedAt, 0),
      phase: (typeof d.resume.phase === "string") ? d.resume.phase : null,
      mode: _normalizeMode(_toStr(d.resume.mode, "typing")),
      snapshot: _isPlainObject(d.resume.snapshot) ? d.resume.snapshot : null
    };
  }

  function setResume(snapshot) {
    var d = load();
    if (!_isPlainObject(snapshot)) {
      d.resume = null;
      save(d);
      return null;
    }
    d.resume = {
      savedAt: Date.now(),
      phase: (typeof snapshot.phase === "string") ? snapshot.phase : null,
      mode: _normalizeMode(snapshot.mode),
      snapshot: snapshot
    };
    save(d);
    return getResume();
  }

  function clearResume() {
    var d = load();
    d.resume = null;
    save(d);
    return true;
  }

  function addSessionSummary(summary) {
    var d = load();
    if (!Array.isArray(d.history)) d.history = [];

    var s = _isPlainObject(summary) ? summary : {};
    if (typeof s.playedAt !== "number") s.playedAt = Date.now();

    d.history.unshift(s);
    if (d.history.length > HISTORY_MAX) d.history.length = HISTORY_MAX;

    // Update stats (best-effort; tolerate missing fields)
    d.stats.sessionsCompleted = Math.max(0, _toInt(d.stats.sessionsCompleted, 0) + 1);
    d.stats.totalCorrect = Math.max(0, _toInt(d.stats.totalCorrect, 0) + Math.max(0, _toInt(s.correct, 0)));
    d.stats.totalWrong = Math.max(0, _toInt(d.stats.totalWrong, 0) + Math.max(0, _toInt(s.wrong, 0)));

    var best = Math.max(0, _toInt(s.bestStreak, 0));
    d.stats.bestStreakEver = Math.max(_toInt(d.stats.bestStreakEver, 0), best);
    d.stats.lastPlayedAt = s.playedAt;

    save(d);
    return d;
  }

  function resetAll() {
    try {
      if (!_hasLocalStorage()) return false;
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.PracticeStorage = {
    key: STORAGE_KEY,
    STORAGE_VERSION: STORAGE_VERSION,
    load: load,
    save: save,
    getSettings: getSettings,
    setSettings: setSettings,
    getResume: getResume,
    setResume: setResume,
    clearResume: clearResume,
    addSessionSummary: addSessionSummary,
    resetAll: resetAll
  };
})();
