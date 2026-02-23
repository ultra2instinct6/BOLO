// Practice Mode v1.2
// Practice Session Controller (logic core)
// Deterministic state machine; UI-agnostic; integrates with window.PracticeTimer

(function() {
  "use strict";

  // Idempotent: do not overwrite if already present.
  if (window.PracticeSession && typeof window.PracticeSession === "object") return;

  var PHASES = {
    idle: true,
    setup: true,
    active: true,
    feedback: true,
    summary: true
  };

  var MODES = {
    typing: true
  };

  var DEFAULT_SETTINGS = {
    difficulty: "easy",
    length: 10,
    hints: true,
    autoAdvance: true,
    numberWords: true,
    sound: false
  };

  function _coerceRampDifficultyFromSettings(settings) {
    // Map UI difficulty (easy/medium/hard) into ramp difficulty (1..5)
    var d = settings && settings.difficulty;
    if (d === "hard") return 5;
    if (d === "medium") return 3;
    return 1;
  }

  function _clampRampDifficulty(n) {
    n = (typeof n === "number") ? (n | 0) : 1;
    if (n < 1) n = 1;
    if (n > 5) n = 5;
    return n;
  }

  function _packsAvailable() {
    return (typeof window.getNextPracticePrompt === "function");
  }

  function _defaultPackIdForMode(mode) {
    // Best-effort: pick first enabled pack matching type.
    try {
      if (!window.PracticePacks || !Array.isArray(window.PracticePacks.packs)) return null;
      var type = _packsTypeForMode(mode);
      for (var i = 0; i < window.PracticePacks.packs.length; i++) {
        var p = window.PracticePacks.packs[i];
        if (!p || !p.enabled) continue;
        if (p.type !== type) continue;
        if (typeof p.packId === "string" && p.packId) return p.packId;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function _isValidPackIdForMode(packId, mode) {
    try {
      if (typeof packId !== "string" || !packId) return false;
      if (!window.PracticePacks || !Array.isArray(window.PracticePacks.packs)) return false;
      var type = _packsTypeForMode(mode);
      for (var i = 0; i < window.PracticePacks.packs.length; i++) {
        var p = window.PracticePacks.packs[i];
        if (!p || !p.enabled) continue;
        if (p.type !== type) continue;
        if (p.packId === packId) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function _packsTypeForMode(mode) {
    // Packs layer uses: typing | pattern
    if (mode === "typing") return "typing";
    return "pattern"; // facts/patterns
  }

  function _derivePackIdFromMode(mode) {
    mode = _coerceMode(mode);
    if (mode === "typing") return "LEGACY_TYPING";
    if (mode === "facts") return "LEGACY_FACTS";
    if (mode === "patterns") return "LEGACY_PATTERNS";
    return "LEGACY_TYPING";
  }

  function _getPackIdForItem(item) {
    try {
      if (item && item.meta && typeof item.meta === "object" && typeof item.meta.packId === "string" && item.meta.packId) {
        return item.meta.packId;
      }
    } catch (e0) {}
    if (_state && typeof _state.selectedPackId === "string" && _state.selectedPackId) return _state.selectedPackId;
    return _derivePackIdFromMode(_state ? _state.mode : "typing");
  }

  function _ensureQueueHasIndex(targetIndex) {
    if (!_packsAvailable()) return false;
    if (!_state || !Array.isArray(_state.queue)) return false;
    var idx = (typeof targetIndex === "number") ? (targetIndex | 0) : 0;
    if (idx < 0) idx = 0;

    var guard = 0;
    while (_state.queue.length <= idx && guard < 12) {
      guard++;

      var res = null;
      try {
        res = window.getNextPracticePrompt({
          type: _packsTypeForMode(_state.mode),
          rampDifficulty: _clampRampDifficulty(_state.rampDifficulty),
          seed: _state.seed,
          rngState: _state.rngState,
          packId: (_state && typeof _state.selectedPackId === "string" && _state.selectedPackId) ? _state.selectedPackId : null,
          lastPromptId: (typeof _state.lastPromptId === "string") ? _state.lastPromptId : null
        });
      } catch (e0) {
        res = null;
      }

      var prompt = res && res.prompt ? res.prompt : null;
      if (!prompt || typeof prompt !== "object") return false;
      if (typeof prompt.questionText !== "string" || typeof prompt.expectedAnswer !== "string") return false;

      var item = {
        id: (typeof prompt.id === "string") ? prompt.id : null,
        prompt: String(prompt.questionText),
        answer: String(prompt.expectedAnswer),
        meta: (prompt.meta && typeof prompt.meta === "object") ? _safeObjectCopy(prompt.meta) : {},
        _packsPrompt: prompt
      };

      try {
        item.meta.packId = prompt.packId || item.meta.packId || null;
        item.meta.packsType = prompt.type || item.meta.packsType || null;
        item.meta.rampDifficulty = prompt.difficulty || item.meta.rampDifficulty || null;
      } catch (e1) {}

      _state.queue.push(item);

      if (res && res.nextRngState != null) _state.rngState = res.nextRngState;
      if (prompt && typeof prompt.id === "string") _state.lastPromptId = prompt.id;
    }

    return (_state.queue.length > idx);
  }

  var _listeners = [];
  var _sessionToken = 0;

  var _state = null;

  function _safeArrayCopy(arr) {
    return Array.isArray(arr) ? arr.slice() : [];
  }

  function _safeObjectCopy(obj) {
    if (!obj || typeof obj !== "object") return {};
    var out = {};
    for (var k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
    }
    return out;
  }

  function _cloneForSnapshot() {
    // Deep-ish copy (safe for UI): primitives + shallow objects/arrays.
    try {
      return {
        phase: _state.phase,
        mode: _state.mode,
        settings: _safeObjectCopy(_state.settings),
        queue: _safeArrayCopy(_state.queue),
        currentIndex: _state.currentIndex,
        streak: _state.streak,
        bestStreak: _state.bestStreak,
        misses: _safeArrayCopy(_state.misses),
        assistsCount: _state.assistsCount,
        lastResult: _state.lastResult ? _safeObjectCopy(_state.lastResult) : null,

        // Packs scheduler state (additive)
        seed: _state.seed,
        rngState: _state.rngState,
        rampDifficulty: _state.rampDifficulty,
        recentOutcomes: _safeArrayCopy(_state.recentOutcomes),
        lastPromptId: _state.lastPromptId,

        // Progress + session meta
        selectedPackId: _state.selectedPackId,
        sessionStartedAt: _state.sessionStartedAt,
        sessionEndedAt: _state.sessionEndedAt,
        sessionAttempts: _state.sessionAttempts,
        sessionCorrect: _state.sessionCorrect,
        sessionWrong: _state.sessionWrong
      };
    } catch (e) {
      return { phase: "idle" };
    }
  }

  function _emitChange() {
    var snap = _cloneForSnapshot();
    for (var i = 0; i < _listeners.length; i++) {
      var cb = _listeners[i];
      if (typeof cb !== "function") continue;
      try {
        cb(snap);
      } catch (e) {
        // Listener errors must never crash the app.
      }
    }
  }

  function _ensureTimer() {
    return (window.PracticeTimer && typeof window.PracticeTimer.set === "function") ? window.PracticeTimer : null;
  }

  function _clearAutoAdvanceTimer() {
    var t = _ensureTimer();
    if (!t) return;
    try {
      t.clear("autoAdvance");
    } catch (e) {}
  }

  function _clearAllTimers() {
    var t = _ensureTimer();
    if (!t) return;
    try {
      t.clearAll();
    } catch (e) {}
  }

  function _isPhase(p) {
    return !!PHASES[p];
  }

  function _coerceMode(mode) {
    if (typeof mode !== "string") return "typing";
    return MODES[mode] ? mode : "typing";
  }

  function _mergeSettings(partial) {
    var merged = _safeObjectCopy(DEFAULT_SETTINGS);
    if (partial && typeof partial === "object") {
      for (var k in partial) {
        if (!Object.prototype.hasOwnProperty.call(partial, k)) continue;
        merged[k] = partial[k];
      }
    }
    return merged;
  }

  function reset() {
    _sessionToken++;
    _clearAllTimers();

    _state = {
      phase: "idle",
      mode: "typing",
      settings: _mergeSettings(null),
      queue: [],
      currentIndex: 0,
      streak: 0,
      bestStreak: 0,
      misses: [],
      assistsCount: 0,
      lastResult: null,

      // Packs scheduler state (additive; safe if packs layer not loaded)
      seed: null,
      rngState: null,
      rampDifficulty: 1,
      recentOutcomes: [],
      lastPromptId: null,

      // Per-session tracking for progress
      selectedPackId: null,
      sessionStartedAt: null,
      sessionEndedAt: null,
      sessionAttempts: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      _progressFinalized: false
    };

    _emitChange();
  }

  function configure(cfg) {
    cfg = (cfg && typeof cfg === "object") ? cfg : {};

    _sessionToken++;
    _clearAutoAdvanceTimer();

    var nextMode = _coerceMode(cfg.mode);
    var nextSettings = _mergeSettings(cfg.settings);
    var nextPackId = (typeof cfg.packId === "string" && cfg.packId) ? cfg.packId : null;
    if (!nextPackId && _packsAvailable()) nextPackId = _defaultPackIdForMode(nextMode);
    if (nextPackId && _packsAvailable() && !_isValidPackIdForMode(nextPackId, nextMode)) {
      nextPackId = _defaultPackIdForMode(nextMode);
    }

    // Seed can be provided by caller; otherwise generate a stable per-session seed.
    var nextSeed = (cfg.seed != null) ? cfg.seed : (_state ? _state.seed : null);
    if (nextSeed == null) {
      try {
        nextSeed = ((Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0);
      } catch (e0) {
        nextSeed = (Math.floor(Math.random() * 0x7fffffff) >>> 0);
      }
    }

    _state.phase = "setup";
    _state.mode = nextMode;
    _state.settings = nextSettings;
    _state.queue = [];
    _state.currentIndex = 0;
    _state.streak = 0;
    _state.bestStreak = 0;
    _state.misses = [];
    _state.assistsCount = 0;
    _state.lastResult = null;

    _state.seed = nextSeed;
    _state.rngState = (cfg.rngState != null) ? cfg.rngState : null;
    _state.rampDifficulty = _clampRampDifficulty(
      (cfg.rampDifficulty != null) ? cfg.rampDifficulty : _coerceRampDifficultyFromSettings(nextSettings)
    );
    _state.recentOutcomes = [];
    _state.lastPromptId = null;

    _state.selectedPackId = nextPackId;
    _state.sessionStartedAt = null;
    _state.sessionEndedAt = null;
    _state.sessionAttempts = 0;
    _state.sessionCorrect = 0;
    _state.sessionWrong = 0;
    _state._progressFinalized = false;

    _emitChange();
    return _cloneForSnapshot();
  }

  function start(queue) {
    _sessionToken++;
    _clearAutoAdvanceTimer();

    if (!_state) reset();

    var q = Array.isArray(queue) ? queue.slice() : [];

    _state.queue = q;
    _state.currentIndex = 0;
    _state.streak = 0;
    _state.bestStreak = 0;
    _state.misses = [];
    _state.assistsCount = 0;
    _state.lastResult = null;
    _state.phase = "active";

    _state.sessionStartedAt = Date.now();
    _state.sessionEndedAt = null;
    _state.sessionAttempts = 0;
    _state.sessionCorrect = 0;
    _state.sessionWrong = 0;
    _state._progressFinalized = false;

    // If packs layer is available and queue is empty, generate the first item.
    if ((!_state.queue || _state.queue.length === 0) && _packsAvailable()) {
      try {
        _ensureQueueHasIndex(0);
      } catch (e4) {}
    }

    _emitChange();
    return _cloneForSnapshot();
  }

  function getCurrentItem() {
    if (!_state || !Array.isArray(_state.queue)) return null;
    var idx = _state.currentIndex | 0;
    if (idx < 0 || idx >= _state.queue.length) return null;
    return _state.queue[idx];
  }

  function submitAnswer(userAnswer, gradeFn, coachingFn, opts) {
    opts = (opts && typeof opts === "object") ? opts : {};

    if (!_state) reset();
    if (_state.phase !== "active") return null;
    if (typeof gradeFn !== "function") return null;

    _clearAutoAdvanceTimer();

    var item = getCurrentItem();
    if (item == null) {
      // No current item; end safely.
      end();
      return null;
    }

    var result = null;
    try {
      result = gradeFn(item, userAnswer, _state.settings) || null;
    } catch (e) {
      // Defensive: grading failures should not crash.
      result = null;
    }

    if (!result || typeof result !== "object") {
      result = { correct: false };
    }

    var correct = !!result.correct;
    var assisted = !!result.assisted;

    _state.sessionAttempts = Math.max(0, (_state.sessionAttempts | 0)) + 1;
    if (correct) _state.sessionCorrect = Math.max(0, (_state.sessionCorrect | 0)) + 1;
    else _state.sessionWrong = Math.max(0, (_state.sessionWrong | 0)) + 1;

    if (assisted) _state.assistsCount++;

    if (correct) {
      _state.streak++;
      if (_state.streak > _state.bestStreak) _state.bestStreak = _state.streak;
    } else {
      _state.streak = 0;
      _state.misses.push({
        index: _state.currentIndex,
        item: item,
        itemId: (item && (item.id || item.key || item.qid)) ? (item.id || item.key || item.qid) : null,
        userAnswer: userAnswer,
        result: _safeObjectCopy(result)
      });
    }

    // Persist progress (fails soft)
    try {
      if (window.PracticeProgress && typeof window.PracticeProgress.recordAttempt === "function") {
        window.PracticeProgress.recordAttempt(_getPackIdForItem(item), correct, _state.bestStreak, Date.now());
      }
    } catch (e2) {}

    // Difficulty ramp: track last-4 outcomes.
    try {
      if (!Array.isArray(_state.recentOutcomes)) _state.recentOutcomes = [];
      _state.recentOutcomes.push(!!correct);
      if (_state.recentOutcomes.length > 20) _state.recentOutcomes = _state.recentOutcomes.slice(-20);

      if (_state.recentOutcomes.length >= 4) {
        var last4 = _state.recentOutcomes.slice(-4);
        var correctCount = 0;
        for (var oi = 0; oi < last4.length; oi++) if (last4[oi]) correctCount++;
        var wrongCount = 4 - correctCount;

        if (correctCount >= 3) _state.rampDifficulty = _clampRampDifficulty((_state.rampDifficulty | 0) + 1);
        else if (wrongCount >= 3) _state.rampDifficulty = _clampRampDifficulty((_state.rampDifficulty | 0) - 1);
      }
    } catch (e3) {}

    var coaching = "";
    if (typeof coachingFn === "function") {
      try {
        coaching = coachingFn(item, result, _state.settings) || "";
      } catch (e2) {
        coaching = "";
      }
    }

    _state.lastResult = {
      correct: correct,
      assisted: assisted,
      coaching: coaching,
      meta: (result.meta && typeof result.meta === "object") ? result.meta : null
    };

    _state.phase = "feedback";
    _emitChange();

    // Auto-advance: only if correct and enabled.
    if (correct && _state.settings && _state.settings.autoAdvance) {
      var t = _ensureTimer();
      if (t) {
        var tokenAtSet = _sessionToken;
        t.set("autoAdvance", function() {
          // Ignore stale timer fires from prior sessions.
          if (tokenAtSet !== _sessionToken) return;
          next();
        }, 650);
      }
    }

    return _cloneForSnapshot();
  }

  function next() {
    if (!_state) reset();
    if (_state.phase !== "feedback" && _state.phase !== "active") return null;

    _clearAutoAdvanceTimer();

    var idx = (_state.currentIndex | 0) + 1;

    var desiredLength = (_state.settings && _state.settings.length === "endless") ? "endless" : Number(_state.settings && _state.settings.length);
    var isFiniteLength = (desiredLength !== "endless") && isFinite(desiredLength) && !isNaN(desiredLength);
    if (isFiniteLength) desiredLength = Math.max(1, Math.floor(desiredLength));

    // If finite-length session and we reached the planned end, end now.
    if (isFiniteLength && idx >= desiredLength) {
      end();
      return _cloneForSnapshot();
    }

    // Generate the next item on demand (packs layer), so the ramp can affect what comes next.
    if (_packsAvailable()) {
      try {
        _ensureQueueHasIndex(idx);
      } catch (e0) {}
    }

    var hasMore = Array.isArray(_state.queue) && idx < _state.queue.length;

    if (!hasMore) {
      // Endless placeholder hook: request more items later.
      if (_state.settings && _state.settings.length === "endless") {
        if (typeof window.PracticeSession.onNeedMoreItems === "function") {
          try {
            window.PracticeSession.onNeedMoreItems(_cloneForSnapshot());
          } catch (e) {}
        }
        // If packs are available, try once more to generate after callback.
        if (_packsAvailable()) {
          try { _ensureQueueHasIndex(idx); } catch (e2) {}
        }
        if (!Array.isArray(_state.queue) || idx >= _state.queue.length) {
          end();
          return _cloneForSnapshot();
        }
      } else {
        end();
        return _cloneForSnapshot();
      }
    }

    _state.currentIndex = idx;
    _state.lastResult = null;
    _state.phase = "active";
    _emitChange();
    return _cloneForSnapshot();
  }

  function retry() {
    if (!_state) reset();
    if (_state.phase !== "feedback") return null;

    _clearAutoAdvanceTimer();

    _state.lastResult = null;
    _state.phase = "active";
    _emitChange();
    return _cloneForSnapshot();
  }

  function end() {
    if (!_state) reset();

    _sessionToken++;
    _clearAllTimers();

    _state.sessionEndedAt = Date.now();

    _state.phase = "summary";
    _emitChange();

    // Finalize session summary + history (fails soft). Ensure idempotence.
    try {
      if (!_state._progressFinalized && window.PracticeProgress && typeof window.PracticeProgress.finalizeSession === "function") {
        _state._progressFinalized = true;

        var packId = (_state && typeof _state.selectedPackId === "string" && _state.selectedPackId)
          ? _state.selectedPackId
          : _derivePackIdFromMode(_state.mode);

        if (_packsAvailable() && !_isValidPackIdForMode(packId, _state.mode)) {
          packId = _defaultPackIdForMode(_state.mode) || _derivePackIdFromMode(_state.mode);
        }

        window.PracticeProgress.finalizeSession({
          startedAt: (typeof _state.sessionStartedAt === "number") ? _state.sessionStartedAt : null,
          endedAt: (typeof _state.sessionEndedAt === "number") ? _state.sessionEndedAt : null,
          packId: packId,
          attempts: Math.max(0, _state.sessionAttempts | 0),
          correct: Math.max(0, _state.sessionCorrect | 0),
          wrong: Math.max(0, _state.sessionWrong | 0),
          bestStreak: Math.max(0, _state.bestStreak | 0)
        });
      }
    } catch (e2) {}

    return _cloneForSnapshot();
  }

  function restore(saved) {
    // Restore a previously-saved snapshot (best-effort).
    // Conservative by design: if required fields are missing, fall back to setup.
    if (!_state) reset();

    _sessionToken++;
    _clearAllTimers();

    if (!saved || typeof saved !== "object") {
      _state.phase = "setup";
      _emitChange();
      return _cloneForSnapshot();
    }

    var queue = Array.isArray(saved.queue) ? saved.queue : null;
    var mode = _coerceMode(saved.mode);
    var idx = (typeof saved.currentIndex === "number") ? (saved.currentIndex | 0) : 0;

    if (!queue || queue.length === 0) {
      _state.mode = mode;
      _state.phase = "setup";
      _emitChange();
      return _cloneForSnapshot();
    }

    if (idx < 0) idx = 0;
    if (idx >= queue.length) idx = queue.length - 1;

    _state.mode = mode;
    _state.settings = _safeObjectCopy(saved.settings);
    _state.queue = queue;
    _state.currentIndex = idx;
    _state.streak = Math.max(0, (saved.streak | 0));
    _state.bestStreak = Math.max(0, (saved.bestStreak | 0));
    _state.misses = Array.isArray(saved.misses) ? saved.misses : [];
    _state.assistsCount = Math.max(0, (saved.assistsCount | 0));
    _state.lastResult = (saved.lastResult && typeof saved.lastResult === "object") ? saved.lastResult : null;

    // Packs scheduler state (best-effort)
    _state.seed = (saved.seed != null) ? saved.seed : (_state.seed != null ? _state.seed : null);
    _state.rngState = (saved.rngState != null) ? saved.rngState : null;
    _state.rampDifficulty = _clampRampDifficulty((saved.rampDifficulty != null) ? saved.rampDifficulty : _coerceRampDifficultyFromSettings(_state.settings));
    _state.recentOutcomes = Array.isArray(saved.recentOutcomes) ? saved.recentOutcomes.slice(-20) : [];
    _state.lastPromptId = (typeof saved.lastPromptId === "string") ? saved.lastPromptId : null;

    _state.selectedPackId = (typeof saved.selectedPackId === "string" && saved.selectedPackId) ? saved.selectedPackId : null;
    if (!_state.selectedPackId && _packsAvailable()) _state.selectedPackId = _defaultPackIdForMode(_state.mode);
    if (_state.selectedPackId && _packsAvailable() && !_isValidPackIdForMode(_state.selectedPackId, _state.mode)) {
      _state.selectedPackId = _defaultPackIdForMode(_state.mode);
    }
    _state.sessionStartedAt = (typeof saved.sessionStartedAt === "number") ? saved.sessionStartedAt : null;
    _state.sessionEndedAt = (typeof saved.sessionEndedAt === "number") ? saved.sessionEndedAt : null;
    _state.sessionAttempts = (typeof saved.sessionAttempts === "number") ? Math.max(0, saved.sessionAttempts | 0) : 0;
    _state.sessionCorrect = (typeof saved.sessionCorrect === "number") ? Math.max(0, saved.sessionCorrect | 0) : 0;
    _state.sessionWrong = (typeof saved.sessionWrong === "number") ? Math.max(0, saved.sessionWrong | 0) : 0;
    _state._progressFinalized = !!saved._progressFinalized;

    // If restoring an in-progress session without explicit counters, derive best-effort.
    try {
      if (!_state.sessionStartedAt) _state.sessionStartedAt = Date.now();

      var derivedAttempts = null;
      if (typeof saved.sessionAttempts !== "number") {
        if (_state.phase === "feedback") derivedAttempts = (_state.currentIndex | 0) + 1;
        else if (_state.phase === "active") derivedAttempts = (_state.currentIndex | 0);
        else derivedAttempts = 0;
      }

      if (derivedAttempts != null) {
        _state.sessionAttempts = Math.max(0, derivedAttempts | 0);
        var wrongCt = Array.isArray(_state.misses) ? _state.misses.length : 0;
        _state.sessionWrong = Math.max(0, wrongCt | 0);
        _state.sessionCorrect = Math.max(0, (_state.sessionAttempts - _state.sessionWrong) | 0);
      }
    } catch (e3) {}

    var phase = (typeof saved.phase === "string") ? saved.phase : "setup";
    if (phase !== "active" && phase !== "feedback") phase = "setup";
    _state.phase = phase;

    _emitChange();
    return _cloneForSnapshot();
  }

  function getSnapshot() {
    if (!_state) reset();
    return _cloneForSnapshot();
  }

  function onChange(cb) {
    if (typeof cb !== "function") return;
    for (var i = 0; i < _listeners.length; i++) {
      if (_listeners[i] === cb) return;
    }
    _listeners.push(cb);
  }

  function offChange(cb) {
    for (var i = _listeners.length - 1; i >= 0; i--) {
      if (_listeners[i] === cb) _listeners.splice(i, 1);
    }
  }

  // Initialize state once on load.
  reset();

  window.PracticeSession = {
    reset: reset,
    configure: configure,
    start: start,
    getCurrentItem: getCurrentItem,
    submitAnswer: submitAnswer,
    retry: retry,
    next: next,
    end: end,
    restore: restore,
    getSnapshot: getSnapshot,
    onChange: onChange,
    offChange: offChange,

    // Placeholder hook: UI or mode can set this later.
    onNeedMoreItems: null
  };
})();
