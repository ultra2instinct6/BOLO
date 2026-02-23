// Practice Mode v1.2
// Minimal-but-complete Practice UI (no framework)
// Binds to PracticeSession + PracticeModes.typing

(function() {
  "use strict";

  if (window.PracticeUI) return;

  var SCREEN_ID = "screen-practice";
  var ROOT_ID = "practice-root";

  var _inited = false;
  var _screenEl = null;
  var _rootEl = null;
  var _backBtn = null;
  var _prevScreenId = null;

  // UI-local state
  var _hintText = "";
  var _hintUsedThisItem = false;
  var _lastActiveIndex = null;
  var _lastSummarySignature = null;

  // Dev-only instrumentation (gated by debug enablement)
  var _activeItemShownAtMs = 0;

  // Listener registry for leak self-test
  var _listenerRegistry = [];

  // Resilience state
  var _submitLocked = false;
  var _nudgeText = "";
  var _resumeSnapshot = null;
  var _showHistory = false;

  // Event handler references (for cleanup)
  var _backClickHandler = null;
  var _rootInputHandler = null;

  // Navigation resilience
  var _isOpen = false;
  var _isClosing = false;
  var _screenObserver = null;

  // Debug (optional)
  var DEBUG_LS_KEY = "practiceDebug";

  function _nowMs() {
    try {
      return Date.now();
    } catch (e) {
      return +new Date();
    }
  }

  function _getPracticeLog() {
    if (!_isDebugEnabled()) return null;
    try {
      if (typeof window === "undefined" || !window) return null;
      if (!window.__practiceLog) window.__practiceLog = [];
      if (!Array.isArray(window.__practiceLog)) window.__practiceLog = [];
      return window.__practiceLog;
    } catch (e) {
      return null;
    }
  }

  function _logPracticeEvent(type, fields) {
    if (!_isDebugEnabled()) return;
    var log = _getPracticeLog();
    if (!log) return;
    var evt = {
      t: _nowMs(),
      type: String(type || ""),
      packId: fields && fields.packId != null ? String(fields.packId) : null,
      promptId: fields && fields.promptId != null ? String(fields.promptId) : null,
      difficulty: fields && fields.difficulty != null ? fields.difficulty : null,
      inputLen: fields && typeof fields.inputLen === "number" ? fields.inputLen : null,
      correct: fields && typeof fields.correct === "boolean" ? fields.correct : null,
      latencyMs: fields && typeof fields.latencyMs === "number" ? fields.latencyMs : null
    };
    try {
      log.push(evt);
      while (log.length > 200) log.shift();
    } catch (e) {}
  }

  function _inferPackId(snapshot, item) {
    try {
      if (snapshot && typeof snapshot.selectedPackId === "string") return snapshot.selectedPackId;
    } catch (e0) {}
    try {
      if (item && item.meta && typeof item.meta.packId === "string") return item.meta.packId;
    } catch (e1) {}
    return null;
  }

  function _inferPromptId(item) {
    try {
      if (item && item.id != null) return String(item.id);
    } catch (e0) {}
    try {
      if (item && item.key != null) return String(item.key);
    } catch (e1) {}
    try {
      if (item && item.meta && item.meta.promptId != null) return String(item.meta.promptId);
    } catch (e2) {}
    try {
      if (item && item.meta && item.meta.qid != null) return String(item.meta.qid);
    } catch (e3) {}
    return null;
  }

  function _inferDifficulty(snapshot, item) {
    try {
      if (snapshot && snapshot.rampDifficulty != null) return snapshot.rampDifficulty;
    } catch (e0) {}
    try {
      if (item && item.meta && item.meta.difficulty != null) return item.meta.difficulty;
    } catch (e1) {}
    return null;
  }

  function _bindTracked(el, type, handler, options) {
    if (!el || !type || !handler) return;
    try {
      el.addEventListener(type, handler, options);
    } catch (e0) {}
    try {
      _listenerRegistry.push({ el: el, type: type, handler: handler, options: options });
    } catch (e1) {}
  }

  function _unbindTracked(el, type, handler, options) {
    if (!el || !type || !handler) return;
    try {
      el.removeEventListener(type, handler, options);
    } catch (e0) {}
    try {
      for (var i = _listenerRegistry.length - 1; i >= 0; i--) {
        var r = _listenerRegistry[i];
        if (r && r.el === el && r.type === type && r.handler === handler) {
          _listenerRegistry.splice(i, 1);
        }
      }
    } catch (e1) {}
  }

  function _startScreenObserver() {
    if (_screenObserver) return;
    if (!_screenEl || typeof MutationObserver === "undefined") return;

    try {
      _screenObserver = new MutationObserver(function() {
        if (_isClosing) return;
        if (!_isOpen) return;
        // If Practice screen is no longer active, treat this as an unmount.
        var isActive = false;
        try {
          isActive = !!(_screenEl && _screenEl.classList && _screenEl.classList.contains("active"));
        } catch (e0) {
          isActive = false;
        }
        if (!isActive) {
          // User navigated away without calling Practice.close().
          try {
            var st = _storage();
            var ss = _session();
            if (st && ss && typeof st.setResume === "function" && typeof st.clearResume === "function") {
              var snap = ss.getSnapshot();
              var isMidSession = snap && (snap.phase === "active" || snap.phase === "feedback") && Array.isArray(snap.queue) && snap.queue.length;
              if (isMidSession) st.setResume(snap);
              else st.clearResume();
            }
          } catch (e1) {}

          stop();

          try {
            if (window.PracticeSession && typeof window.PracticeSession.reset === "function") {
              window.PracticeSession.reset();
            }
          } catch (e2) {}

          _isOpen = false;
          destroy();
        }
      });

      _screenObserver.observe(_screenEl, { attributes: true, attributeFilter: ["class"] });
    } catch (e3) {
      _screenObserver = null;
    }
  }

  function _stopScreenObserver() {
    try {
      if (_screenObserver) _screenObserver.disconnect();
    } catch (e) {}
    _screenObserver = null;
  }

  function _qs(sel, parent) {
    try {
      return (parent || document).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function _getActiveScreenId() {
    var active = _qs("section.screen.active");
    return active && active.id ? active.id : null;
  }

  function _safeGoTo(screenId) {
    try {
      if (window.UI && typeof window.UI.goTo === "function") {
        window.UI.goTo(screenId);
        return;
      }
    } catch (e) {}

    // Fallback: toggle active class
    try {
      var screens = document.querySelectorAll("section.screen");
      for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
      }
      var el = document.getElementById(screenId);
      if (el) el.classList.add("active");
    } catch (e2) {}
  }

  function _timer() {
    return (window.PracticeTimer && typeof window.PracticeTimer.clearAll === "function") ? window.PracticeTimer : null;
  }

  function _isDebugEnabled() {
    var urlEnabled = false;
    var lsEnabled = false;

    try {
      var qs = (typeof window !== "undefined" && window && window.location) ? String(window.location.search || "") : "";
      urlEnabled = (qs.indexOf("debug=1") !== -1) || (qs.indexOf("practiceDebug=1") !== -1);
    } catch (e0) {
      urlEnabled = false;
    }

    try {
      if (typeof localStorage !== "undefined" && localStorage) {
        var v = localStorage.getItem(DEBUG_LS_KEY);
        lsEnabled = (v === "1" || v === "true" || v === "yes");
      }
    } catch (e1) {
      lsEnabled = false;
    }

    return urlEnabled || lsEnabled;
  }

  function _setDebugEnabled(enabled) {
    try {
      if (typeof localStorage === "undefined" || !localStorage) return;
      if (enabled) localStorage.setItem(DEBUG_LS_KEY, "true");
      else localStorage.removeItem(DEBUG_LS_KEY);
    } catch (e) {}
  }

  function _renderDebugPanel(snapshot) {
    if (!_isDebugEnabled()) return "";

    var ss = _session();
    var st = _storage();
    var t = _timer();
    var tmCount = 0;
    var tmNames = [];
    try { tmCount = t && typeof t.count === "function" ? t.count() : 0; } catch (e0) { tmCount = 0; }
    try { tmNames = t && typeof t.names === "function" ? t.names() : []; } catch (e1) { tmNames = []; }

    var item = null;
    try { item = ss && typeof ss.getCurrentItem === "function" ? ss.getCurrentItem() : null; } catch (e2) { item = null; }

    var total = Array.isArray(snapshot.queue) ? snapshot.queue.length : 0;
    var idx = (typeof snapshot.currentIndex === "number") ? snapshot.currentIndex : 0;
    var lr = snapshot.lastResult || null;
    var meta = (lr && lr.meta && typeof lr.meta === "object") ? lr.meta : null;

    var expected = "";
    try { expected = item && typeof item.answer === "string" ? item.answer : ""; } catch (e3) { expected = ""; }
    if (meta && typeof meta.expected === "string") expected = meta.expected;

    var normalizedUser = meta && typeof meta.normalizedUser === "string" ? meta.normalizedUser : "";
    var toleranceUsed = meta && typeof meta.toleranceUsed === "string" ? meta.toleranceUsed : "";
    var assist = meta && typeof meta.assist === "string" ? meta.assist : "";
    var forced = meta && meta.debugForced ? "yes" : "";

    var seed = (snapshot && snapshot.seed != null) ? snapshot.seed : null;
    var rngState = (snapshot && snapshot.rngState != null) ? snapshot.rngState : null;
    var rampDifficulty = (snapshot && snapshot.rampDifficulty != null) ? snapshot.rampDifficulty : null;

    var logCount = 0;
    try {
      logCount = (window && Array.isArray(window.__practiceLog)) ? window.__practiceLog.length : 0;
    } catch (e4) { logCount = 0; }

    var listenerCount = 0;
    try { listenerCount = _listenerRegistry.length; } catch (e5) { listenerCount = 0; }

    var html = '';
    html += '<details class="practice-debug" style="margin-top:12px;">';
    html += '<summary style="cursor:pointer; font-weight:800;">Debug</summary>';
    html += '<div class="card" style="margin-top:8px;">';
    html += '<div class="section-subtitle">phase: ' + _escapeHtml(String(snapshot.phase || "")) + ' | mode: ' + _escapeHtml(String(snapshot.mode || "")) + '</div>';
    html += '<div class="section-subtitle" style="margin-top:4px;">idx: ' + String(idx + 1) + '/' + String(total || 0) + ' | streak: ' + String(snapshot.streak | 0) + ' | best: ' + String(snapshot.bestStreak | 0) + ' | assists: ' + String(snapshot.assistsCount | 0) + '</div>';
    if (seed != null || rngState != null || rampDifficulty != null) {
      html += '<div class="section-subtitle" style="margin-top:4px;">seed: ' + _escapeHtml(String(seed == null ? '' : seed)) + ' | rngState: ' + _escapeHtml(String(rngState == null ? '' : rngState)) + ' | rampDifficulty: ' + _escapeHtml(String(rampDifficulty == null ? '' : rampDifficulty)) + '</div>';
    }
    html += '<div class="section-subtitle" style="margin-top:4px;">submitLocked: ' + String(!!_submitLocked) + ' | timers: ' + String(tmCount) + (tmNames.length ? (' [' + _escapeHtml(tmNames.join(", ")) + ']') : '') + ' | listeners: ' + String(listenerCount) + ' | log: ' + String(logCount) + '</div>';

    if (expected) {
      html += '<div class="section-subtitle" style="margin-top:8px;">expected: <span style="font-weight:700;">' + _escapeHtml(expected) + '</span></div>';
    }
    if (normalizedUser || toleranceUsed || assist || forced) {
      html += '<div class="section-subtitle" style="margin-top:4px;">normalizedUser: ' + _escapeHtml(normalizedUser) + '</div>';
      html += '<div class="section-subtitle" style="margin-top:4px;">toleranceUsed: ' + _escapeHtml(toleranceUsed) + (assist ? (' | assist: ' + _escapeHtml(assist)) : '') + (forced ? ' | debugForced: yes' : '') + '</div>';
    }

    html += '<div class="button-row" style="margin-top:10px;">';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugToggle" aria-label="Toggle debug">Toggle debug</button>';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugReset" aria-label="Reset practice storage">Reset</button>';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugSkip" aria-label="Skip item">Skip</button>';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugForceCorrect" aria-label="Force correct">Force correct</button>';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugForceWrong" aria-label="Force wrong">Force wrong</button>';
    html += '<button class="btn btn-secondary btn-small" type="button" data-action="debugExportLog" aria-label="Export practice log">Export Log</button>';
    html += '</div>';

    html += '<div class="section-subtitle" style="margin-top:8px;">Enabled by `?debug=1` (or localStorage `' + _escapeHtml(DEBUG_LS_KEY) + '`).</div>';
    html += '</div>';
    html += '</details>';
    return html;
  }

  function _clearAllPracticeTimers() {
    try {
      var t = _timer();
      if (t) t.clearAll();
    } catch (e) {}
  }

  function _namedTimeout(name, fn, ms) {
    var t = _timer();
    if (t && typeof t.set === "function") {
      t.set(name, fn, ms);
      return;
    }
    setTimeout(fn, ms);
  }

  function _storage() {
    return (window.PracticeStorage && typeof window.PracticeStorage.load === "function") ? window.PracticeStorage : null;
  }

  function _session() {
    return (window.PracticeSession && typeof window.PracticeSession.getSnapshot === "function") ? window.PracticeSession : null;
  }

  function _typingMode() {
    return (window.PracticeModes && window.PracticeModes.typing) ? window.PracticeModes.typing : null;
  }
  function _packsModeEngine() {
    // Adapter layer so PracticeUI can stay mostly unchanged.
    // PracticeSession now generates next items via getNextPracticePrompt(), so generateQueue can be empty.
    if (typeof window.gradePrompt !== "function" || typeof window.coachPrompt !== "function") return null;

    return {
      id: "packs",
      label: "Packs",
      generateQueue: function() {
        return [];
      },
      grade: function(item, userAnswer, settings) {
        item = _isPlainObject(item) ? item : {};
        var p = item._packsPrompt || null;
        if (!p) {
          p = {
            type: (item.meta && (item.meta.packsType || item.meta.family)) ? "pattern" : "typing",
            expectedAnswer: (typeof item.answer === "string") ? item.answer : ""
          };
        }
        return window.gradePrompt(p, userAnswer, settings);
      },
      coach: function(item, result, settings) {
        item = _isPlainObject(item) ? item : {};
        var p = item._packsPrompt || null;
        if (!p) {
          p = {
            type: (item.meta && (item.meta.packsType || item.meta.family)) ? "pattern" : "typing",
            expectedAnswer: (typeof item.answer === "string") ? item.answer : ""
          };
        }
        return window.coachPrompt(p, result, settings);
      }
    };
  }

  function _modeEngineFor(mode) {
    // Prefer packs if available; otherwise fall back to typingMode.
    var packs = _packsModeEngine();
    if (packs) return packs;
    return _typingMode();
  }

  function _packsTypeForMode(mode) {
    if (mode === "typing") return "typing";
    return "pattern";
  }

  function _getPackOptionsForMode(mode) {
    try {
      if (!window.PracticePacks || !Array.isArray(window.PracticePacks.packs)) return [];
      var type = _packsTypeForMode(mode);
      var out = [];
      for (var i = 0; i < window.PracticePacks.packs.length; i++) {
        var p = window.PracticePacks.packs[i];
        if (!p || !p.enabled) continue;
        if (p.type !== type) continue;
        out.push(p);
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  function _getSelectedPackId(snapshot) {
    try {
      if (snapshot && typeof snapshot.selectedPackId === "string" && snapshot.selectedPackId) return snapshot.selectedPackId;
    } catch (e0) {}
    try {
      var s = (snapshot && snapshot.settings && typeof snapshot.settings === "object") ? snapshot.settings : {};
      if (typeof s.packId === "string" && s.packId) return s.packId;
    } catch (e1) {}
    var opts = _getPackOptionsForMode(snapshot ? snapshot.mode : "typing");
    return (opts && opts[0] && opts[0].packId) ? opts[0].packId : null;
  }

  function _getMasteryText(packId) {
    try {
      if (window.PracticeProgress && typeof window.PracticeProgress.getPackStats === "function") {
        var st = window.PracticeProgress.getPackStats(packId);
        var m = st && typeof st.mastery === "number" ? st.mastery : 0;
        return "Mastery: " + String(m) + "/100";
      }
    } catch (e) {}
    return "Mastery: 0/100";
  }

  function _getBankSizeText(packId) {
    try {
      if (!window.PracticePacks || typeof window.PracticePacks.getPackBankSize !== "function") return "";
      var n = window.PracticePacks.getPackBankSize(packId);
      if (typeof n !== "number" || !isFinite(n) || n <= 0) return "";
      return "Bank: " + String(n) + " items";
    } catch (e) {
      return "";
    }
  }

  function _formatSuggestedDifficulty(rec) {
    rec = String(rec || "").toLowerCase();
    if (rec === "easy") return "Easy";
    if (rec === "medium") return "Medium";
    if (rec === "hard") return "Hard";
    return "";
  }

  function _getSelectedPackMetaLine(packId, packOptions) {
    try {
      if (typeof packId !== "string" || !packId) return "";
      if (!packOptions || !packOptions.length) return "";

      var pack = null;
      for (var i = 0; i < packOptions.length; i++) {
        var p = packOptions[i];
        if (p && p.packId === packId) { pack = p; break; }
      }
      if (!pack) return "";

      var desc = (typeof pack.description === "string") ? pack.description.trim() : "";
      var sug = _formatSuggestedDifficulty(pack.recommendedDifficulty);

      // Spec: hide the info row entirely unless metadata fields exist.
      if (!desc || !sug) return "";
      return desc + " \u2022 Suggested: " + sug;
    } catch (e) {
      return "";
    }
  }

  function _formatDateTime(ms) {
    try {
      if (typeof ms !== "number") return "";
      var d = new Date(ms);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString();
    } catch (e) {
      return "";
    }
  }

  function _escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function _isPlainObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function _coerceBool(v, fallback) {
    if (typeof v === "boolean") return v;
    return fallback;
  }

  function _coerceMode(mode) {
    // Facts/Patterns tabs were removed; coerce any legacy mode to typing.
    if (mode === "typing") return mode;
    return "typing";
  }

  function _getSettings(snapshot) {
    var s = (snapshot && snapshot.settings && typeof snapshot.settings === "object") ? snapshot.settings : {};
    return {
      difficulty: (s.difficulty === "medium" || s.difficulty === "hard") ? s.difficulty : "easy",
      length: (s.length === "endless") ? "endless" : (typeof s.length === "number" ? s.length : 10),
      hints: (s.hints === "off") ? "off" : (s.hints === "on" ? "on" : _coerceBool(s.hints, true) ? "on" : "off"),
      autoAdvance: _coerceBool(s.autoAdvance, true),
      numberWords: _coerceBool(s.numberWords, true)
    };
  }

  function _setSetting(mode, key, value) {
    var st = _storage();
    if (!st) return;

    try {
      var patch = {};
      patch[key] = value;
      st.setSettings(mode, patch);
    } catch (e) {
      // no-op
    }
  }

  function _configureFromStorage() {
    var st = _storage();
    var ss = _session();
    if (!ss) return;

    var mode = "typing";
    var settings = {};
    try {
      if (st) {
        var data = st.load();
        mode = _coerceMode(data && data.lastMode);
        settings = st.getSettings(mode);
      }
    } catch (e0) {}

    // Normalize hints to "on"/"off" for UI; underlying engines accept both.
    if (_isPlainObject(settings)) {
      if (typeof settings.hints === "boolean") settings.hints = settings.hints ? "on" : "off";
      if (settings.hints !== "on" && settings.hints !== "off") settings.hints = "on";
    }

    try {
      ss.configure({ mode: mode, settings: settings });
    } catch (e1) {
      // no-op
    }
  }

  function _renderSetup(snapshot) {
    var mode = _coerceMode(snapshot.mode);

    var modeRow = '';
    modeRow += '<div class="button-row" role="group" aria-label="Mode">';
    modeRow += '<button class="btn ' + (mode === 'typing' ? '' : 'btn-secondary') + '" type="button" data-action="mode" data-mode="typing" aria-label="Typing mode">Typing</button>';
    modeRow += '</div>';

    var html = '';
    html += '<div aria-label="Practice setup">';
    html += '<div class="section-subtitle">Quick start: 5 easy words with hints on.</div>';
    html += modeRow;

    html += '<div class="button-row" style="margin-top:12px;">';
    html += '<button class="btn" type="button" data-action="start" aria-label="Start practice">Start 5-word practice</button>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  function _renderActive(snapshot) {
    var item = null;
    try {
      item = _session().getCurrentItem();
    } catch (e) {
      item = null;
    }

    var s = _getSettings(snapshot);
    var prompt = item && item.prompt ? String(item.prompt) : "";
    var promptPa = "";
    try {
      if (item && item._packsPrompt) {
        if (typeof item._packsPrompt.pa === "string") promptPa = item._packsPrompt.pa;
        else if (typeof item._packsPrompt.punjabi === "string") promptPa = item._packsPrompt.punjabi;
      }
      if (!promptPa && item && item.meta && typeof item.meta === "object" && typeof item.meta.pa === "string") {
        promptPa = item.meta.pa;
      }
      promptPa = String(promptPa || "").replace(/^\s+|\s+$/g, "");
    } catch (e0) {
      promptPa = "";
    }
    var hintEnabled = (s.hints === "on");

    var showPa = false;
    try {
      // Punjabi scaffolding is hint-only to avoid clutter.
      showPa = !!(promptPa && hintEnabled && _hintUsedThisItem && typeof uiIsPunjabiOn === "function" && uiIsPunjabiOn());
    } catch (e1) {
      showPa = false;
    }
    var idx = (typeof snapshot.currentIndex === "number") ? snapshot.currentIndex : 0;
    var plannedTotal = (typeof s.length === "number") ? s.length : 0;
    var total = plannedTotal || (Array.isArray(snapshot.queue) ? snapshot.queue.length : 0);

    var hintBlock = '';
    if (hintEnabled) {
      hintBlock += '<div class="button-row" style="margin-top:10px;">';
      hintBlock += '<button class="btn btn-secondary btn-small" type="button" data-action="hint" aria-label="Hint">Hint</button>';
      hintBlock += '</div>';
      if (_hintText) {
        hintBlock += '<div class="section-subtitle" style="margin-top:8px;">' + _escapeHtml(_hintText) + '</div>';
      }
    }

    var html = '';
    html += '<div aria-label="Practice active">';
    html += '<div class="section-subtitle">Item ' + (idx + 1) + (total ? (' / ' + total) : '') + '</div>';
    html += '<div class="card" style="margin-top:8px;">';
    html += '<div style="font-size:1.2em; font-weight:700;">' + _escapeHtml(prompt) + '</div>';
    if (showPa) {
      html += '<div class="lesson-text-pa" lang="pa" style="margin-top:6px;">' + _escapeHtml(promptPa) + '</div>';
    }
    html += '</div>';

    html += '<div style="margin-top:10px;">';
    var useTextarea = false;
    try {
      var cat = (item && item.meta && typeof item.meta === "object" && typeof item.meta.category === "string") ? String(item.meta.category) : "";
      useTextarea = (cat === "paragraph") || (prompt && prompt.length >= 140);
    } catch (eT0) {
      useTextarea = false;
    }
    if (useTextarea) {
      html += '<textarea id="practiceAnswerInput" rows="4" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type your answer" style="width:100%; min-height:110px;"></textarea>';
    } else {
      html += '<input id="practiceAnswerInput" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type your answer" style="width:100%;" />';
    }
    html += '</div>';

    if (_nudgeText) {
      html += '<div class="section-subtitle" style="margin-top:8px;">' + _escapeHtml(_nudgeText) + '</div>';
    }

    html += '<div class="button-row" style="margin-top:10px;">';
    html += '<button class="btn" type="button" data-action="submit" aria-label="Submit"' + (_submitLocked ? ' disabled aria-disabled="true"' : '') + '>Submit</button>';
    html += '</div>';

    html += hintBlock;
    html += '</div>';
    return html;
  }

  function _renderFeedback(snapshot) {
    var s = _getSettings(snapshot);
    var lr = snapshot.lastResult || null;
    var isCorrect = !!(lr && lr.correct);
    var title = isCorrect ? "Nice work" : "Good try";

    var coaching = (lr && typeof lr.coaching === "string") ? lr.coaching : "";
    coaching = coaching ? _escapeHtml(coaching).replace(/\n/g, "<br>") : "";

    var showTryAgain = !isCorrect;
    var showNext = (!s.autoAdvance) || !isCorrect;

    var html = '';
    html += '<div aria-label="Practice feedback">';
    html += '<div style="font-size:1.2em; font-weight:800;">' + title + '</div>';
    if (coaching) {
      html += '<div class="section-subtitle" style="margin-top:8px;">' + coaching + '</div>';
    }

    html += '<div class="button-row" style="margin-top:12px;">';
    if (showTryAgain) {
      html += '<button class="btn" type="button" data-action="retry" aria-label="Try again">Try this one again</button>';
      html += '<button class="btn btn-secondary" type="button" data-action="next" aria-label="Next">Next</button>';
    } else if (showNext) {
      html += '<button class="btn" type="button" data-action="next" aria-label="Next">Next</button>';
    } else {
      html += '<button class="btn btn-secondary" type="button" disabled aria-label="Auto-advancing">Auto-advancing…</button>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function _renderSummary(snapshot) {
    var attempts = (typeof snapshot.sessionAttempts === "number") ? snapshot.sessionAttempts : (Array.isArray(snapshot.queue) ? snapshot.queue.length : 0);
    var wrong = (typeof snapshot.sessionWrong === "number") ? snapshot.sessionWrong : (Array.isArray(snapshot.misses) ? snapshot.misses.length : 0);
    var correct = (typeof snapshot.sessionCorrect === "number") ? snapshot.sessionCorrect : Math.max(0, attempts - wrong);
    var acc = attempts ? Math.round((correct / attempts) * 100) : 0;
    var bestStreak = (typeof snapshot.bestStreak === "number") ? snapshot.bestStreak : 0;
    var assists = (typeof snapshot.assistsCount === "number") ? snapshot.assistsCount : 0;

    var packId = _getSelectedPackId(snapshot) || (snapshot && typeof snapshot.mode === "string" ? ("LEGACY_" + snapshot.mode.toUpperCase()) : "LEGACY_TYPING");
    var packLabel = packId;
    try {
      if (window.PracticeProgress && typeof window.PracticeProgress.getPackLabel === "function") {
        packLabel = window.PracticeProgress.getPackLabel(packId);
      }
    } catch (e0) { packLabel = packId; }
    var diffReached = (typeof snapshot.rampDifficulty === "number") ? snapshot.rampDifficulty : null;

    var html = '';
    html += '<div aria-label="Practice summary">';
    html += '<div style="font-size:1.2em; font-weight:800;">Summary</div>';
    html += '<div class="section-subtitle" style="margin-top:8px;">Pack: ' + _escapeHtml(String(packLabel || packId || "")) + '</div>';
    if (diffReached != null) {
      html += '<div class="section-subtitle" style="margin-top:4px;">Difficulty reached: ' + _escapeHtml(String(diffReached)) + '</div>';
    }
    html += '<div class="section-subtitle" style="margin-top:4px;">Attempts: ' + String(attempts) + ' | Correct: ' + String(correct) + ' | Wrong: ' + String(wrong) + ' | Accuracy: ' + String(acc) + '%</div>';
    html += '<div class="section-subtitle" style="margin-top:4px;">Best streak: ' + bestStreak + '</div>';
    html += '<div class="section-subtitle" style="margin-top:4px;">Hints used: ' + assists + '</div>';
    html += '<div class="section-subtitle" style="margin-top:4px;">' + _escapeHtml(_getMasteryText(packId)) + '</div>';

    html += '<div class="button-row" style="margin-top:12px;">';
    html += '<button class="btn" type="button" data-action="tryAgain" aria-label="Play again">Play again</button>';
    html += '<button class="btn btn-secondary" type="button" data-action="backHome" aria-label="Back to Home">Back to Home</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function _computeHint(item) {
    if (!item || typeof item.answer !== "string") return "";
    var ans = item.answer;
    var trimmed = ans.trim();
    if (!trimmed) return "";

    var words = trimmed.split(/\s+/);
    if (words.length > 1) {
      return "Hint: " + words.length + " words, starts with '" + words[0].charAt(0) + "'.";
    }

    return "Hint: starts with '" + trimmed.charAt(0) + "' (" + trimmed.length + " letters).";
  }

  function _saveSummaryOnce(snapshot) {
    // Persist a compact session summary; keep this idempotent per session outcome.
    var st = _storage();
    if (!st) return;

    var total = Array.isArray(snapshot.queue) ? snapshot.queue.length : 0;
    var wrong = Array.isArray(snapshot.misses) ? snapshot.misses.length : 0;
    var correct = Math.max(0, total - wrong);
    var signature = String(snapshot.mode) + "|" + total + "|" + correct + "|" + wrong + "|" + snapshot.bestStreak + "|" + snapshot.assistsCount;
    if (_lastSummarySignature === signature) return;
    _lastSummarySignature = signature;

    try {
      // Keep settings persisted as well.
      var s = _getSettings(snapshot);
      st.setSettings(snapshot.mode, {
        difficulty: s.difficulty,
        length: s.length,
        hints: (s.hints === "on"),
        autoAdvance: !!s.autoAdvance,
        numberWords: !!s.numberWords
      });
    } catch (e0) {}

    try {
      st.addSessionSummary({
        mode: snapshot.mode,
        correct: correct,
        wrong: wrong,
        bestStreak: (typeof snapshot.bestStreak === "number") ? snapshot.bestStreak : 0,
        assistsCount: (typeof snapshot.assistsCount === "number") ? snapshot.assistsCount : 0,
        playedAt: Date.now()
      });
    } catch (e1) {}
  }

  function render(snapshot) {
    if (!_rootEl) return;
    snapshot = snapshot && typeof snapshot === "object" ? snapshot : null;
    if (!snapshot) {
      try {
        snapshot = _session().getSnapshot();
      } catch (e) {
        snapshot = { phase: "idle", mode: "typing", settings: {} };
      }
    }

    // Reset hint/lock state when a new item becomes active.
    if (snapshot.phase === "active") {
      if (_lastActiveIndex !== snapshot.currentIndex) {
        _lastActiveIndex = snapshot.currentIndex;
        _hintText = "";
        _hintUsedThisItem = false;
        _submitLocked = false;
        _nudgeText = "";

        // Instrumentation: mark item shown time and log context.
        _activeItemShownAtMs = _nowMs();
        try {
          var ss0 = _session();
          var item0 = (ss0 && typeof ss0.getCurrentItem === "function") ? ss0.getCurrentItem() : null;
          _logPracticeEvent("item_shown", {
            packId: _inferPackId(snapshot, item0),
            promptId: _inferPromptId(item0),
            difficulty: _inferDifficulty(snapshot, item0),
            inputLen: null,
            correct: null,
            latencyMs: null
          });
        } catch (e0) {}
      }
    }

    if (snapshot.phase === "setup" || snapshot.phase === "summary" || snapshot.phase === "idle") {
      _submitLocked = false;
      _nudgeText = "";
    }

    var html = '';
    if (snapshot.phase === "idle") {
      // If we land here while screen is open, default to setup.
      _configureFromStorage();
      snapshot = _session().getSnapshot();
    }

    if (snapshot.phase === "setup") html = _renderSetup(snapshot);
    else if (snapshot.phase === "active") html = _renderActive(snapshot);
    else if (snapshot.phase === "feedback") html = _renderFeedback(snapshot);
    else if (snapshot.phase === "summary") html = _renderSummary(snapshot);
    else html = _renderSetup(snapshot);

    html += _renderDebugPanel(snapshot);

    _rootEl.innerHTML = html;

    if (snapshot.phase === "active") {
      // Focus input for touch-first flow.
      _namedTimeout("focusInput", function() {
        try {
          var input = document.getElementById("practiceAnswerInput");
          if (input && input.focus) input.focus();
        } catch (e) {}
      }, 0);
    }

    if (snapshot.phase === "summary") {
      // Session is completed; no reason to resume this one.
      try {
        var st0 = _storage();
        if (st0 && typeof st0.clearResume === "function") st0.clearResume();
      } catch (e0) {}
      _saveSummaryOnce(snapshot);
    }
  }

  function _handleStart() {
    var ss = _session();
    var snap = ss ? ss.getSnapshot() : null;
    var modeObj = _modeEngineFor(snap ? snap.mode : "typing");
    if (!ss || !modeObj || typeof modeObj.generateQueue !== "function") return;

    _submitLocked = false;
    _nudgeText = "";
    _resumeSnapshot = null;
    _clearAllPracticeTimers();

    try {
      var stClear = _storage();
      if (stClear && typeof stClear.clearResume === "function") stClear.clearResume();
    } catch (e0) {}

    var snap = ss.getSnapshot();
    var settingsToUse = {
      difficulty: "easy",
      length: 5,
      hints: "on",
      autoAdvance: true,
      numberWords: true
    };

    // Persist settings before starting.
    try {
      var st = _storage();
      if (st) {
        st.setSettings(snap.mode, {
          difficulty: settingsToUse.difficulty,
          length: settingsToUse.length,
          hints: (settingsToUse.hints === "on"),
          autoAdvance: !!settingsToUse.autoAdvance,
          numberWords: !!settingsToUse.numberWords
        });
      }
    } catch (e0) {}

    var queue = [];
    try {
      queue = modeObj.generateQueue(settingsToUse);
    } catch (e1) {
      queue = [];
    }

    // Ensure session uses the same settings.
    try {
      var packId = null;
      try {
        var st1 = _storage();
        var ssnap = ss.getSnapshot();
        var mode2 = _coerceMode(ssnap.mode);
        var set2 = st1 ? st1.getSettings(mode2) : ssnap.settings;
        if (set2 && typeof set2.packId === "string") packId = set2.packId;
      } catch (eP) { packId = null; }
      ss.configure({ mode: snap.mode, settings: settingsToUse, packId: packId });
    } catch (e2) {}

    try {
      ss.start(queue);
    } catch (e3) {}
  }

  function _handleSubmit() {
    var ss = _session();
    var snap0 = null;
    try { snap0 = ss ? ss.getSnapshot() : null; } catch (e0) { snap0 = null; }
    var modeObj = _modeEngineFor(snap0 ? snap0.mode : "typing");
    if (!ss || !modeObj || typeof modeObj.grade !== "function" || typeof modeObj.coach !== "function") return;

    if (_submitLocked) return;

    var snap = null;
    try {
      snap = ss.getSnapshot();
    } catch (e0) {
      snap = null;
    }
    if (!snap || snap.phase !== "active") return;

    var input = document.getElementById("practiceAnswerInput");
    var raw = input ? input.value : "";
    var val = (typeof raw === "string") ? raw.trim() : "";
    var hintUsed = !!_hintUsedThisItem;

    if (!val) {
      _nudgeText = "Type an answer first.";
      _namedTimeout("clearNudge", function() {
        _nudgeText = "";
        try { render(ss.getSnapshot()); } catch (e1) {}
      }, 1200);
      try {
        render(ss.getSnapshot());
      } catch (e2) {}
      return;
    }

    _submitLocked = true;

    function gradeWrapper(item, userAnswer, settings) {
      var r = null;
      try {
        r = modeObj.grade(item, userAnswer, settings);
      } catch (e) {
        r = { correct: false, assisted: false, meta: {} };
      }
      if (hintUsed && r && typeof r === "object") {
        r.assisted = true;
        if (!r.meta || typeof r.meta !== "object") r.meta = {};
        r.meta.assist = "hint";
      }

      // Instrumentation: submit event
      try {
        var latency = null;
        if (_activeItemShownAtMs && typeof _activeItemShownAtMs === "number") {
          latency = Math.max(0, _nowMs() - _activeItemShownAtMs);
        }
        _logPracticeEvent("submit", {
          packId: _inferPackId(snap, item),
          promptId: _inferPromptId(item),
          difficulty: _inferDifficulty(snap, item),
          inputLen: (typeof userAnswer === "string") ? userAnswer.length : 0,
          correct: !!(r && r.correct),
          latencyMs: (typeof latency === "number") ? latency : null
        });
      } catch (e2) {}

      return r;
    }

    try {
      ss.submitAnswer(val, gradeWrapper, modeObj.coach);
    } catch (e2) {}
  }

  function _handleHint() {
    var ss = _session();
    if (!ss) return;
    var snap = null;
    try { snap = ss.getSnapshot(); } catch (e0) { snap = null; }
    var s = _getSettings(snap);
    var hintEnabled = (s.hints === "on");
    var item = null;
    try {
      item = ss.getCurrentItem();
    } catch (e) {}
    _hintUsedThisItem = true;
    var promptPa = "";
    try {
      if (item && item._packsPrompt) {
        if (typeof item._packsPrompt.pa === "string") promptPa = item._packsPrompt.pa;
        else if (typeof item._packsPrompt.punjabi === "string") promptPa = item._packsPrompt.punjabi;
      }
      if (!promptPa && item && item.meta && typeof item.meta === "object" && typeof item.meta.pa === "string") {
        promptPa = item.meta.pa;
      }
      promptPa = String(promptPa || "").replace(/^\s+|\s+$/g, "");
    } catch (e1) {
      promptPa = "";
    }

    // If Punjabi is enabled and this prompt has Punjabi, show that as the hint.
    if (hintEnabled && promptPa) {
      try {
        if (typeof uiIsPunjabiOn === "function" && uiIsPunjabiOn()) {
          _hintText = promptPa;
        } else {
          _hintText = _computeHint(item);
        }
      } catch (e2) {
        _hintText = _computeHint(item);
      }
    } else {
      _hintText = _computeHint(item);
    }
    render(ss.getSnapshot());
  }

  function _handleNext() {
    var ss = _session();
    if (!ss) return;
    try {
      ss.next();
    } catch (e) {}
  }

  function _handleRetry() {
    var ss = _session();
    if (!ss) return;

    _submitLocked = false;
    _nudgeText = "";
    _hintText = "";
    _hintUsedThisItem = false;
    _clearAllPracticeTimers();

    try {
      if (typeof ss.retry === "function") ss.retry();
      else {
        // Fallback: if retry isn't supported, just return to active by re-rendering.
        render(ss.getSnapshot());
      }
    } catch (e) {}
  }

  function _handleTryAgain() {
    var ss = _session();
    var snap0 = null;
    try { snap0 = ss ? ss.getSnapshot() : null; } catch (e0) { snap0 = null; }
    var modeObj = _modeEngineFor(snap0 ? snap0.mode : "typing");
    if (!ss || !modeObj) return;

    _submitLocked = false;
    _nudgeText = "";
    _resumeSnapshot = null;
    _clearAllPracticeTimers();

    try {
      var stClear = _storage();
      if (stClear && typeof stClear.clearResume === "function") stClear.clearResume();
    } catch (e0) {}
    var snap = ss.getSnapshot();
    var settingsToUse = {
      difficulty: "easy",
      length: 5,
      hints: "on",
      autoAdvance: true,
      numberWords: true
    };
    try {
      var packId = null;
      try {
        var st1 = _storage();
        var ssnap = ss.getSnapshot();
        var mode2 = _coerceMode(ssnap.mode);
        var set2 = st1 ? st1.getSettings(mode2) : ssnap.settings;
        if (set2 && typeof set2.packId === "string") packId = set2.packId;
      } catch (eP) { packId = null; }
      ss.configure({ mode: snap.mode, settings: settingsToUse, packId: packId });
    } catch (e1) {}
    var queue = [];
    try {
      queue = modeObj.generateQueue(settingsToUse);
    } catch (e2) {
      queue = [];
    }
    try {
      ss.start(queue);
    } catch (e3) {}
  }

  function _handleResume() {
    var ss = _session();
    if (!ss || !_resumeSnapshot) return;
    if (typeof ss.restore !== "function") return;

    _submitLocked = false;
    _nudgeText = "";
    _clearAllPracticeTimers();

    try {
      var st = _storage();
      if (st && typeof st.clearResume === "function") st.clearResume();
    } catch (e0) {}

    try {
      ss.restore(_resumeSnapshot);
    } catch (e1) {}

    _resumeSnapshot = null;
  }

  function _handleResetResume() {
    _resumeSnapshot = null;
    _submitLocked = false;
    _nudgeText = "";
    _clearAllPracticeTimers();
    try {
      var st = _storage();
      if (st && typeof st.clearResume === "function") st.clearResume();
    } catch (e0) {}
    _configureFromStorage();
    try {
      render(_session() ? _session().getSnapshot() : null);
    } catch (e1) {}
  }

  function _handleClose() {
    // If user quits mid-session, show summary panel instead of shifting away.
    try {
      var ss = _session();
      if (ss) {
        var snap = ss.getSnapshot();
        if (snap && (snap.phase === "active" || snap.phase === "feedback")) {
          _submitLocked = false;
          _nudgeText = "";
          _hintText = "";
          _hintUsedThisItem = false;
          _clearAllPracticeTimers();
          try { ss.end(); } catch (e0) {}
          return;
        }
      }
    } catch (e1) {}

    try {
      if (window.Practice && typeof window.Practice.close === "function") {
        window.Practice.close();
        return;
      }
    } catch (e) {}
  }

  function _handleBackHome() {
    // Explicit close from summary.
    try {
      if (window.Practice && typeof window.Practice.close === "function") {
        window.Practice.close();
        return;
      }
    } catch (e) {}
  }

  function _handleDebugToggle() {
    // If enabled only via URL, toggle may not fully disable.
    var enabled = _isDebugEnabled();
    _setDebugEnabled(!enabled);
    try {
      render(_session() ? _session().getSnapshot() : null);
    } catch (e) {}
  }

  function _handleDebugReset() {
    _clearAllPracticeTimers();
    _submitLocked = false;
    _nudgeText = "";
    _hintText = "";
    _hintUsedThisItem = false;
    _resumeSnapshot = null;

    try {
      var st = _storage();
      if (st && typeof st.resetAll === "function") st.resetAll();
    } catch (e0) {}

    try {
      if (window.PracticeSession && typeof window.PracticeSession.reset === "function") {
        window.PracticeSession.reset();
      }
    } catch (e1) {}

    _configureFromStorage();
    try { render(_session() ? _session().getSnapshot() : null); } catch (e2) {}
  }

  function _handleDebugSkip() {
    var ss = _session();
    if (!ss) return;
    var snap = null;
    try { snap = ss.getSnapshot(); } catch (e0) { snap = null; }
    if (!snap || (snap.phase !== "active" && snap.phase !== "feedback")) return;

    _submitLocked = false;
    _nudgeText = "";
    _hintText = "";
    _hintUsedThisItem = false;
    _clearAllPracticeTimers();

    try { ss.next(); } catch (e1) {}
  }

  function _handleDebugForceResult(isCorrect) {
    var ss = _session();
    var snap0 = null;
    try { snap0 = ss ? ss.getSnapshot() : null; } catch (e0) { snap0 = null; }
    var modeObj = _modeEngineFor(snap0 ? snap0.mode : "typing");
    if (!ss || !modeObj || typeof ss.submitAnswer !== "function") return;

    var snap = null;
    try { snap = ss.getSnapshot(); } catch (e0) { snap = null; }
    if (!snap || snap.phase !== "active") return;

    var item = null;
    try { item = ss.getCurrentItem(); } catch (e1) { item = null; }
    if (!item) return;

    var input = document.getElementById("practiceAnswerInput");
    var raw = input ? input.value : "";
    var userVal = (typeof raw === "string") ? raw.trim() : "";
    if (!userVal) userVal = "(debug)";

    _submitLocked = true;

    function gradeForced(it, userAnswer, settings) {
      var base = null;
      var nu = "";
      var expected = "";
      try {
        if (typeof modeObj.grade === "function") base = modeObj.grade(it, userAnswer, settings) || null;
      } catch (e2) {
        base = null;
      }

      try {
        if (base && base.meta && typeof base.meta === "object" && typeof base.meta.normalizedUser === "string") {
          nu = base.meta.normalizedUser;
        }
      } catch (e3) {}

      try {
        if (base && base.meta && typeof base.meta === "object" && typeof base.meta.expected === "string") {
          expected = base.meta.expected;
        }
      } catch (e4) {}

      if (!expected) {
        try { expected = (it && typeof it.answer === "string") ? it.answer : ""; } catch (e5) { expected = ""; }
      }

      return {
        correct: !!isCorrect,
        assisted: false,
        meta: {
          debugForced: true,
          expected: expected,
          normalizedUser: nu,
          toleranceUsed: "debugForced"
        }
      };
    }

    try {
      ss.submitAnswer(userVal, gradeForced, (typeof modeObj.coach === "function") ? modeObj.coach : null);
    } catch (e3) {}
  }

  function _handleDebugExportLog() {
    if (!_isDebugEnabled()) return;
    var payload = "[]";
    try {
      payload = JSON.stringify((window && Array.isArray(window.__practiceLog)) ? window.__practiceLog : [], null, 2);
    } catch (e0) {
      payload = String((window && window.__practiceLog) ? window.__practiceLog : "[]");
    }

    // Clipboard first, console fallback.
    try {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(payload)
          .then(function() {
            try { console.log("[Practice] Exported __practiceLog to clipboard (" + payload.length + " chars)"); } catch (e1) {}
          })
          .catch(function() {
            try { console.log("[Practice] __practiceLog (clipboard failed):", payload); } catch (e2) {}
          });
        return;
      }
    } catch (e3) {}

    try {
      console.log("[Practice] __practiceLog:", payload);
    } catch (e4) {}
  }

  function _onRootClick(e) {
    var t = e && e.target;
    if (!t) return;

    // Walk up to find data-action
    var el = t;
    for (var i = 0; i < 6 && el; i++) {
      if (el.getAttribute && el.getAttribute("data-action")) break;
      el = el.parentNode;
    }
    if (!el || !el.getAttribute) return;

    var action = el.getAttribute("data-action");
    if (!action) return;

    if (action === "start") return _handleStart();
    if (action === "resume") return _handleResume();
    if (action === "resetResume") return _handleResetResume();
    if (action === "submit") return _handleSubmit();
    if (action === "hint") return _handleHint();
    if (action === "retry") return _handleRetry();
    if (action === "next") return _handleNext();
    if (action === "tryAgain") return _handleTryAgain();
    if (action === "close") return _handleClose();
    if (action === "backHome") return _handleBackHome();
    if (action === "toggleHistory") {
      _showHistory = !_showHistory;
      try { render(_session() ? _session().getSnapshot() : null); } catch (e0) {}
      return;
    }

    if (action === "debugToggle") return _handleDebugToggle();
    if (action === "debugReset") return _handleDebugReset();
    if (action === "debugSkip") return _handleDebugSkip();
    if (action === "debugForceCorrect") return _handleDebugForceResult(true);
    if (action === "debugForceWrong") return _handleDebugForceResult(false);
    if (action === "debugExportLog") return _handleDebugExportLog();

    if (action === "mode") {
      var mode = el.getAttribute("data-mode");
      mode = _coerceMode(mode);
      if (mode !== "typing") return;
      try {
        var st = _storage();
        if (st) {
          var data = st.load();
          data.lastMode = mode;
          st.save(data);
        }
      } catch (e0) {}
      _configureFromStorage();
      return;
    }
  }

  function _onRootChange(e) {
    var t = e && e.target;
    if (!t || !t.getAttribute) return;
    var action = t.getAttribute("data-action");
    if (action !== "setting" && action !== "toggle") return;

    var ss = _session();
    if (!ss) return;
    var snap = ss.getSnapshot();
    if (snap.phase !== "setup") return;

    var mode = _coerceMode(snap.mode);
    var key = t.getAttribute("data-key");
    if (!key) return;

    var nextVal;
    if (action === "toggle") {
      nextVal = !!t.checked;
      if (key === "hints") nextVal = nextVal ? "on" : "off";
    } else {
      nextVal = t.value;
      if (key === "length") {
        nextVal = (nextVal === "endless") ? "endless" : Number(nextVal);
      }
    }

    // Persist
    if (key === "hints") {
      // Stored as boolean in PracticeStorage
      _setSetting(mode, "hints", (nextVal === "on"));
    } else {
      _setSetting(mode, key, nextVal);
    }

    // Update session setup snapshot
    try {
      var st = _storage();
      var newSettings = st ? st.getSettings(mode) : snap.settings;
      if (_isPlainObject(newSettings)) {
        if (typeof newSettings.hints === "boolean") newSettings.hints = newSettings.hints ? "on" : "off";
      }
      var packId = (newSettings && typeof newSettings.packId === "string") ? newSettings.packId : null;
      ss.configure({ mode: mode, settings: newSettings, packId: packId });
    } catch (e2) {
      // no-op
    }
  }

  function _onRootKeydown(e) {
    var t = e && e.target;
    if (!t) return;
    if (t.id !== "practiceAnswerInput") return;
    if (e.key !== "Enter") return;

    // If multi-line ever becomes possible: Shift+Enter should not submit.
    if (e.shiftKey) return;

    // Prevent default form submission / page reload behavior.
    try { e.preventDefault(); } catch (e0) {}

    var ss = _session();
    if (!ss) return;
    var snap = null;
    try { snap = ss.getSnapshot(); } catch (e1) { snap = null; }
    if (!snap || snap.phase !== "active") return;

    var val = "";
    try {
      val = (typeof t.value === "string") ? t.value.trim() : "";
    } catch (e2) {
      val = "";
    }

    if (!val) {
      _nudgeText = "Type an answer first.";
      _namedTimeout("clearNudge", function() {
        _nudgeText = "";
        try { render(ss.getSnapshot()); } catch (e3) {}
      }, 1200);
      try { render(ss.getSnapshot()); } catch (e4) {}
      return;
    }

    _handleSubmit();
  }

  function _onRootInput(e) {
    var t = e && e.target;
    if (!t || t.id !== "practiceAnswerInput") return;
    if (_nudgeText) {
      _nudgeText = "";
    }
  }

  function destroy() {
    // Remove listeners that PracticeUI attached.
    _stopScreenObserver();

    try {
      if (_backBtn && _backClickHandler) {
        _unbindTracked(_backBtn, "click", _backClickHandler);
      }
    } catch (e0) {}

    try {
      if (_rootEl) {
        _unbindTracked(_rootEl, "click", _onRootClick);
        _unbindTracked(_rootEl, "change", _onRootChange);
        _unbindTracked(_rootEl, "keydown", _onRootKeydown);
        if (_rootInputHandler) _unbindTracked(_rootEl, "input", _rootInputHandler);
      }
    } catch (e1) {}

    try {
      if (window.PracticeSession && typeof window.PracticeSession.offChange === "function") {
        window.PracticeSession.offChange(render);
      }
    } catch (e2) {}

    try {
      if (_backBtn && _backBtn.dataset) {
        delete _backBtn.dataset.practiceBound;
      }
      if (_rootEl && _rootEl.dataset) {
        delete _rootEl.dataset.practiceDelegationBound;
      }
    } catch (e3) {}

    _backClickHandler = null;
    _rootInputHandler = null;
    _screenEl = null;
    _rootEl = null;
    _backBtn = null;
    _inited = false;

    // Defensive: ensure registry doesn't keep stale refs.
    try { _listenerRegistry = []; } catch (e4) {}
  }

  function init() {
    if (_inited) return;
    _inited = true;

    _screenEl = document.getElementById(SCREEN_ID);
    _rootEl = document.getElementById(ROOT_ID);
    _backBtn = document.getElementById("btn-practice-back");

    if (_backBtn && !(_backBtn.dataset && _backBtn.dataset.practiceBound)) {
      try {
        _backBtn.dataset.practiceBound = "1";
      } catch (e0) {}
      _backClickHandler = function() { _handleClose(); };
      _bindTracked(_backBtn, "click", _backClickHandler);
    }

    if (_rootEl && !(_rootEl.dataset && _rootEl.dataset.practiceDelegationBound)) {
      try {
        _rootEl.dataset.practiceDelegationBound = "1";
      } catch (e1) {}
      _bindTracked(_rootEl, "click", _onRootClick);
      _bindTracked(_rootEl, "change", _onRootChange);
      _bindTracked(_rootEl, "keydown", _onRootKeydown);
      _rootInputHandler = _onRootInput;
      _bindTracked(_rootEl, "input", _rootInputHandler);
    }

    // Subscribe to session state transitions
    try {
      if (window.PracticeSession && typeof window.PracticeSession.onChange === "function") {
        window.PracticeSession.onChange(render);
      }
    } catch (e2) {}
  }

  function open(opts) {
    init();
    opts = _isPlainObject(opts) ? opts : {};

    _isClosing = false;
    _isOpen = true;

    // Remember where we came from.
    _prevScreenId = _getActiveScreenId();
    if (opts.fromScreenId) _prevScreenId = opts.fromScreenId;

    // Clear any stray timers before opening.
    _clearAllPracticeTimers();

    // Load resumable snapshot (if any)
    _resumeSnapshot = null;
    try {
      var st = _storage();
      if (st && typeof st.getResume === "function") {
        var r = st.getResume();
        if (r && r.snapshot && typeof r.snapshot === "object") {
          if (r.snapshot.phase === "active" || r.snapshot.phase === "feedback") {
            if (Array.isArray(r.snapshot.queue) && r.snapshot.queue.length) {
              _resumeSnapshot = r.snapshot;
            }
          }
        }
      }
    } catch (e0) {}

    // Configure setup state from storage.
    _configureFromStorage();

    _safeGoTo(SCREEN_ID);
    render(_session() ? _session().getSnapshot() : null);

    // Watch for external navigation away from Practice screen.
    _startScreenObserver();
  }

  function stop() {
    _clearAllPracticeTimers();
    _submitLocked = false;
    _nudgeText = "";
  }

  function close() {
    _isClosing = true;
    _isOpen = false;

    // Persist a resumable snapshot when leaving mid-session.
    try {
      var st = _storage();
      var ss = _session();
      if (st && ss && typeof st.setResume === "function" && typeof st.clearResume === "function") {
        var snap = ss.getSnapshot();
        var isMidSession = snap && (snap.phase === "active" || snap.phase === "feedback") && Array.isArray(snap.queue) && snap.queue.length;
        if (isMidSession) st.setResume(snap);
        else st.clearResume();
      }
    } catch (e0) {}

    stop();

    // Reset session so it doesn't keep running off-screen.
    try {
      if (window.PracticeSession && typeof window.PracticeSession.reset === "function") {
        window.PracticeSession.reset();
      }
    } catch (e1) {}

    var backTo = _prevScreenId || "screen-home";
    _prevScreenId = null;
    _safeGoTo(backTo);

    // Remove listeners to avoid duplicates on re-entry.
    destroy();

    _isClosing = false;
  }

  window.PracticeUI = {
    init: init,
    open: open,
    close: close,
    stop: stop,
    destroy: destroy,
    render: render,

    // Debug helpers (used by leak self-test)
    __debugListenerCount: function() {
      try { return _listenerRegistry.length; } catch (e) { return 0; }
    }
  };
})();
