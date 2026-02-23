// Practice Mode v1.2
// Centralized named timer manager (singleton)
// Global module pattern (no imports/exports)

(function() {
  "use strict";

  // Idempotent: do not overwrite if already present.
  if (window.PracticeTimer) return;

  var _timers = Object.create(null); // name -> timeoutId

  function _log() {
    try {
      if (!window.PracticeTimer || !window.PracticeTimer.DEBUG) return;
      if (!window.console || typeof window.console.log !== "function") return;
      window.console.log.apply(window.console, arguments);
    } catch (e) {
      // no-op
    }
  }

  function _isValidName(name) {
    return (typeof name === "string") && name.trim().length > 0;
  }

  function _coerceMs(ms) {
    var n = Number(ms);
    if (!isFinite(n) || isNaN(n)) return 0;
    if (n < 0) return 0;
    return Math.floor(n);
  }

  function has(name) {
    if (!_isValidName(name)) return false;
    return _timers[name] != null;
  }

  function count() {
    var c = 0;
    for (var k in _timers) {
      if (_timers[k] != null) c++;
    }
    return c;
  }

  function names() {
    var out = [];
    for (var k in _timers) {
      if (_timers[k] != null) out.push(k);
    }
    out.sort();
    return out;
  }

  function clear(name) {
    if (!_isValidName(name)) return;
    var id = _timers[name];
    if (id == null) return;
    try {
      window.clearTimeout(id);
    } catch (e) {
      // ignore
    }
    delete _timers[name];
    _log("[PracticeTimer] clear", name);
  }

  function clearAll() {
    for (var name in _timers) {
      if (_timers[name] == null) continue;
      try {
        window.clearTimeout(_timers[name]);
      } catch (e) {
        // ignore
      }
      delete _timers[name];
    }
    _log("[PracticeTimer] clearAll");
  }

  function set(name, fn, ms) {
    if (!_isValidName(name)) return null;
    if (typeof fn !== "function") return null;

    // Requirement: repeated set(name) must not create multiple timers.
    clear(name);

    var delay = _coerceMs(ms);
    var timeoutId = null;

    try {
      timeoutId = window.setTimeout(function() {
        // Requirement: timer removes itself after firing.
        delete _timers[name];
        _log("[PracticeTimer] fired", name);
        try {
          fn();
        } catch (e) {
          // Never let a timer callback crash the app.
          try {
            if (window.console && typeof window.console.warn === "function") {
              window.console.warn("[PracticeTimer] callback error for", name, e);
            }
          } catch (e2) {}
        }
      }, delay);
    } catch (e0) {
      return null;
    }

    _timers[name] = timeoutId;
    _log("[PracticeTimer] set", name, delay);
    return timeoutId;
  }

  window.PracticeTimer = {
    DEBUG: false,
    set: set,
    clear: clear,
    clearAll: clearAll,
    has: has,
    count: count,
    names: names
  };
})();
