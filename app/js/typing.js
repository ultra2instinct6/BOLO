/* =========================================================
   Typing Center + Typing Race (Premium)
   - Keyboard inset -> CSS var --kb-inset
   - Fullscreen toggle
   - Simple typing race engine (WPM/accuracy/progress)
   ========================================================= */

(function() {
  if (window.TypingPremium && window.TypingPremium._inited) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- 1) Keyboard inset helper (VisualViewport) ----------
  function setupKeyboardInsetVar() {
    var root = document.documentElement;

    var lastInsetPx = 0;
    var kbScrollTimer = 0;

    function update() {
      var vv = window.visualViewport;
      if (!vv) {
        root.style.setProperty("--kb-inset", "0px");
        return;
      }

      // On many mobile browsers, keyboard reduces visualViewport.height.
      var inset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
      var insetPx = Math.round(inset);
      root.style.setProperty("--kb-inset", String(insetPx) + "px");

      // When the keyboard opens, keep the prompt card centered.
      // Debounced and only triggers when the Race input is focused.
      try {
        var delta = insetPx - lastInsetPx;
        lastInsetPx = insetPx;
        if (delta > 20 && insetPx >= 60) {
          var raceScreen = document.getElementById("screen-typing-race");
          var isActive = !!(raceScreen && raceScreen.classList && raceScreen.classList.contains("active"));
          if (!isActive) return;

          // Avoid scrolling under modal overlays
          if (document.getElementById("typingResultModal")) return;

          var inputEl = document.getElementById("raceInput");
          if (!inputEl) return;
          if (document.activeElement !== inputEl) return;

          var card = document.getElementById("racePromptCard");
          if (!card) return;

          if (kbScrollTimer) clearTimeout(kbScrollTimer);
          kbScrollTimer = setTimeout(function() {
            try {
              if (card.scrollIntoView) {
                try {
                  card.scrollIntoView({ block: "center" });
                } catch (e2) {
                  card.scrollIntoView(true);
                }
              }
            } catch (e3) {}
          }, 150);
        }
      } catch (e1) {
        // no-op
      }
    }

    try {
      if (window.visualViewport && window.visualViewport.addEventListener) {
        window.visualViewport.addEventListener("resize", update);
        window.visualViewport.addEventListener("scroll", update);
      }
    } catch (e) {
      // no-op
    }

    window.addEventListener("orientationchange", function() {
      setTimeout(update, 80);
    });
    window.addEventListener("resize", function() {
      setTimeout(update, 80);
    });

    update();
  }

  // ---------- 2) Fullscreen helper ----------
  function toggleFullscreen(targetEl, btnEl) {
    var isFs = !!document.fullscreenElement;

    function setPressed(val) {
      try {
        if (btnEl) btnEl.setAttribute("aria-pressed", val ? "true" : "false");
      } catch (e) {
        // no-op
      }
    }

    try {
      if (!isFs) {
        var el = targetEl || document.documentElement;
        if (el && el.requestFullscreen) {
          var p = el.requestFullscreen();
          if (p && typeof p.then === "function") {
            p.then(function() {
              setPressed(true);
            }).catch(function() {
              setPressed(false);
            });
          } else {
            setPressed(true);
          }
        }
      } else {
        if (document.exitFullscreen) {
          var p2 = document.exitFullscreen();
          if (p2 && typeof p2.then === "function") {
            p2.then(function() {
              setPressed(false);
            }).catch(function() {
              setPressed(false);
            });
          } else {
            setPressed(false);
          }
        }
      }
    } catch (e) {
      // Fail silently: many WebViews/iOS restrict fullscreen.
      setPressed(false);
    }
  }

  // ---------- 3) Navigation glue (idiomatic for BOLO: UI.goTo) ----------
  function showScreenSafe(screenId) {
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
    lessons: "Structured levels (coming soon)"
  };

  var ACC_GOAL = 95;      // display goal copy
  var ACC_COACH_LOW = 92; // coaching threshold
  var ACC_RETRY_THRESHOLD = 92;

  // Prompt bank: prefer global data file (app/data/typing.js), fall back to local.
  var PROMPTS = ((typeof TYPING_PROMPTS !== "undefined") && TYPING_PROMPTS && TYPING_PROMPTS.length)
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
    { en: "See you tomorrow.", pa: "ਕੱਲ੍ਹ ਮਿਲਾਂਗੇ।" }
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
    return { en: en, pa: pa, band: band };
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

  function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
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

  function pickPromptForMode(mode) {
    var m = mode || "race";

    // Practice: short only (fallback if empty)
    if (m === "practice") {
      return pickFromBand("short") || pickFromBand("medium") || pickFromBand("long") || { en: "", pa: "", band: "short" };
    }

    // Race: weighted mix (50% short, 35% medium, 15% long)
    var r = Math.floor(Math.random() * 100);
    var band = (r < 50) ? "short" : ((r < 85) ? "medium" : "long");
    return pickFromBand(band) || pickFromBand("short") || pickFromBand("medium") || pickFromBand("long") || { en: "", pa: "", band: "short" };
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
    mode: "race",        // "race" | "practice"
    timerEnabled: true,   // race: true, practice: false
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
    forceRetry: false
  };

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
    runState.goalMode = (mode === "practice") ? "practice" : "race";
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

    // Race
    var mainTextRace = "Goal: " + String(ACC_GOAL) + "%+ accuracy" +
      " • Accuracy: " + String(accPct) + "% (goal " + String(ACC_GOAL) + "%)";
    var okRace = (accPct >= ACC_GOAL);
    renderGoalLine(mainTextRace, okRace, "Goal met", "Keep going");
  }

  function setRaceSubtitle(modeLabel, punjabiHint) {
    var el = document.getElementById("raceSubtitle");
    if (!el) return;

    var s = String(modeLabel || "Typing Race");
    if (s === "Typing Race") s += " • Accuracy goal: " + String(ACC_GOAL) + "%+";
    else s += " • Accuracy first";
    if (punjabiHint) s += " • " + String(punjabiHint);
    el.textContent = s;
  }

  function setRaceModeUI() {
    if (runState.mode === "practice") setRaceSubtitle("Practice", runState.promptPa);
    else setRaceSubtitle("Typing Race", runState.promptPa);

    var startBtn = getEl("raceStartBtn");
    if (startBtn) startBtn.textContent = (runState.mode === "practice") ? "Start Practice" : "Start Race";

    setGoalForRun(runState.mode);
    updateGoalProgress();
  }

  function resetRun(promptObj) {
    runState.startTs = Date.now();
    runState.promptEn = (promptObj && promptObj.en) ? String(promptObj.en) : "";
    runState.promptPa = (promptObj && promptObj.pa) ? String(promptObj.pa) : "";
    runState.finished = false;
    runState.prevValue = "";
    runState.progressLen = 0;
    runState.totalAdded = 0;
    runState.totalErrors = 0;
    runState.missCounts = {};
    runState.bigramCounts = {};
    runState.forceRetry = false;
  }

  function renderPromptWithHighlight(promptEl, typed, target) {
    if (!promptEl) return;
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
      var ch = target.charAt(i);
      span.textContent = ch;

      if (i < typed.length) {
        span.className = (typed.charAt(i) === ch) ? "is-correct" : "is-wrong";
      } else {
        // Pending characters can be highlighted as part of the current word
        var cls = "is-pending";
        if (i === nextPos) cls += " is-next";
        if (i >= wordStart && i <= wordEnd) cls += " is-current-word";
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
    var m = mode || "race";

    // Keep copy simple and learning-first (matches the upgrade pack prompt)
    if (m === "practice") {
      el.textContent = "Focus: Accuracy first • Smooth spaces • Common words";
      return;
    }

    el.textContent = "Focus: Accuracy goal " + String(ACC_GOAL) + "%+ • Correctness first";
  }

  function setTypingCenterLastModeUI(mode, hasStoredValue) {
    var line = getEl("typingLastModeLine");
    var resumeBtn = getEl("typingResumeBtn");

    var m = (mode === "practice" || mode === "race") ? mode : "practice";
    if (line) line.textContent = "Last: " + (m === "practice" ? "Practice" : "Race");

    // Optional: show/hide Resume depending on whether we actually have a stored last mode.
    // Spec allows either; default here is: always show.
    if (resumeBtn) {
      resumeBtn.style.display = "inline";
      resumeBtn.setAttribute("aria-label", "Resume " + (m === "practice" ? "Practice" : "Race"));
    }

    // If you prefer hiding when no stored value exists, flip this switch:
    if (resumeBtn && hasStoredValue === false) {
      // keep visible but still predictable
      resumeBtn.style.display = "inline";
    }
  }

  function refreshTypingCenterUI() {
    renderBestOnCenter();
    var stored = readLastMode();
    var m = stored || (runState && runState.mode) || "practice";
    setTypingCenterObjective(m);
    setTypingCenterLastModeUI(m, !!stored);
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

  function stopTick() {
    if (state.rafId) {
      try { cancelAnimationFrame(state.rafId); } catch (e) {}
    }
    state.rafId = 0;
  }

  function tick() {
    if (!state.running) return;

    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var seconds = (now - state.startedAt) / 1000;

    // WPM should reflect prompt progress, not raw keystrokes (so retries/backspaces don't inflate speed).
    var wpm = computeWpm(runState.progressLen || 0, seconds);
    var acc = computeAcc(runState.totalAdded, runState.totalErrors);

    setText("raceWpm", String(wpm));
    setText("raceAcc", String(acc) + "%");
    setText("raceTime", seconds.toFixed(1) + "s");
    setText("raceMistakes", String(runState.totalErrors || 0));

    updateGoalProgress();

    state.rafId = requestAnimationFrame(tick);
  }

  function updateStatsOnce() {
    if (!state.running) return;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var seconds = (now - state.startedAt) / 1000;

    var wpm = computeWpm(runState.progressLen || 0, seconds);
    var acc = computeAcc(runState.totalAdded, runState.totalErrors);

    setText("raceWpm", String(wpm));
    setText("raceAcc", String(acc) + "%");
    setText("raceTime", seconds.toFixed(1) + "s");
    setText("raceMistakes", String(runState.totalErrors || 0));

    updateGoalProgress();
  }

  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return String(m) + ":" + (s < 10 ? ("0" + String(s)) : String(s));
  }

  function getBest() {
    try {
      var wpm = parseFloat(localStorage.getItem("bolo_typing_best_wpm") || "0") || 0;
      var acc = parseFloat(localStorage.getItem("bolo_typing_best_acc") || "0") || 0;
      var timeMs = parseInt(localStorage.getItem("bolo_typing_best_time") || "0", 10) || 0;
      return { wpm: wpm, acc: acc, timeMs: timeMs };
    } catch (e) {
      return { wpm: 0, acc: 0, timeMs: 0 };
    }
  }

  function renderBestOnCenter() {
    var el = getEl("typingCenterSubtitle");
    if (!el) return;
    var best = getBest();
    if (best && best.wpm > 0) {
      el.textContent = "Practice, race, and build speed • Best WPM: " + String(Math.round(best.wpm));
    } else {
      el.textContent = "Practice, race, and build speed";
    }
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

    lines.push("Tip: slow down for accuracy, then speed up.");
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
      var v = localStorage.getItem(LAST_MODE_KEY);
      return (v === "practice" || v === "race") ? v : null;
    } catch (e) {
      return null;
    }
  }

  function writeLastMode(mode) {
    try {
      localStorage.setItem(LAST_MODE_KEY, String(mode || ""));
    } catch (e) {
      // no-op
    }
  }

  function saveBest(wpm, acc, elapsedMs) {
    try {
      var bestWpm = parseFloat(localStorage.getItem("bolo_typing_best_wpm") || "0") || 0;
      if (wpm > bestWpm) {
        localStorage.setItem("bolo_typing_best_wpm", String(wpm));
        localStorage.setItem("bolo_typing_best_acc", String(acc));
        localStorage.setItem("bolo_typing_best_time", String(elapsedMs));
      }
    } catch (e) {
      // no-op
    }
  }

  function showResultModal(wpm, acc, elapsedMs, errors, tipsText, feedbackText, coachText, primaryLabel, onPrimary, secondaryLabel, onSecondary) {
    var old = getEl("typingResultModal");
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var backdrop = document.createElement("div");
    backdrop.id = "typingResultModal";
    backdrop.className = "modal-backdrop active";
    backdrop.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Race result");

    var card = document.createElement("div");
    card.className = "modal-card";

    var title = document.createElement("h3");
    title.textContent = "Race Complete";
    card.appendChild(title);

    var p = document.createElement("p");
    p.style.marginTop = "6px";
    p.textContent =
      "Time: " + formatTime(elapsedMs) +
      " • WPM: " + String(Math.round(wpm)) +
      " • Accuracy: " + String(Math.round(acc)) + "%" +
      " • Mistakes: " + String(errors);
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
    copyBtn.className = "btn btn-secondary";
    copyBtn.type = "button";
    copyBtn.textContent = "Copy feedback";
    copyBtn.addEventListener("click", function() {
      var parts = [];
      if (tipsText) parts.push(String(tipsText));
      if (feedbackText) parts.push(String(feedbackText));
      if (coachText) parts.push(String(coachText));
      var text = parts.join("\n\n").replace(/^\s+|\s+$/g, "");
      if (!text) {
        toast("Nothing to copy");
        return;
      }

      try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            toast("Copied");
          }).catch(function() {
            toast("Copy not supported");
          });
        } else {
          toast("Copy not supported");
        }
      } catch (e) {
        toast("Copy not supported");
      }
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
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      if (typeof onPrimary === "function") onPrimary();
    });

    var secondary = document.createElement("button");
    secondary.className = "btn btn-secondary";
    secondary.type = "button";
    secondary.textContent = String(secondaryLabel || "Back");
    secondary.addEventListener("click", function() {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      if (typeof onSecondary === "function") onSecondary();
    });

    row.appendChild(primary);
    row.appendChild(secondary);
    card.appendChild(row);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function(ev) {
      if (ev.target === backdrop) {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
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
    setProgress(0);

    renderRaceTips("");

    var fb = document.getElementById("raceFeedback");
    if (fb) fb.textContent = "";

    setRaceModeUI();
    updateGoalProgress("");
  }

  function resetRaceUI(promptEl, inputEl) {
    var promptObj = pickPrompt();
    resetRaceUIToPrompt(promptEl, inputEl, promptObj);
  }

  function runCountdown(done) {
    var overlay = getEl("raceCountdown");
    var numEl = getEl("raceCountdownNum");

    if (!overlay || !numEl) {
      if (typeof done === "function") done();
      return;
    }

    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");

    var n = 3;
    function step() {
      if (n >= 1) {
        numEl.textContent = String(n);
        n -= 1;
        setTimeout(step, 650);
        return;
      }

      numEl.textContent = "Go";
      setTimeout(function() {
        overlay.classList.remove("is-visible");
        overlay.setAttribute("aria-hidden", "true");
        if (typeof done === "function") done();
      }, 350);
    }

    step();
  }

  function bindTypingCenter() {
    var back = getEl("typingCenterBackBtn");
    var race = getEl("typingModeRace");
    var practice = getEl("typingModePractice");
    var time = getEl("typingModeTime");
    var lessons = getEl("typingModeLessons");

    var heroPractice = getEl("typingHeroPracticeBtn");
    var heroRace = getEl("typingHeroRaceBtn");

    // Restore last selected mode (optional convenience)
    var savedMode = readLastMode();
    if (savedMode) {
      runState.mode = savedMode;
      runState.timerEnabled = (savedMode !== "practice");
    }

    refreshTypingCenterUI();

    if (back && !back.dataset.typingBound) {
      back.dataset.typingBound = "1";
      back.addEventListener("click", function() {
        showScreenSafe("screen-home");
      });
    }

    function openRace(mode) {
      runState.mode = mode || "race";
      runState.timerEnabled = (runState.mode !== "practice");
      writeLastMode(runState.mode);

      refreshTypingCenterUI();

      // Reset UI immediately so mode + Punjabi hint are correct on entry
      var promptEl = getEl("racePrompt");
      var inputEl = getEl("raceInput");
      resetRaceUI(promptEl, inputEl);

      showScreenSafe("screen-typing-race");

      // Mobile ergonomics: attempt to focus input after navigation settles.
      // If the input isn't enabled yet (pre-start), this is best-effort.
      setTimeout(function() {
        if (document.getElementById("typingResultModal")) return;
        var input2 = getEl("raceInput");
        if (input2) {
          try { input2.focus(); } catch (e) {}
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

    if (heroPractice && !heroPractice.dataset.typingBound) {
      heroPractice.dataset.typingBound = "1";
      heroPractice.addEventListener("click", function() {
        openRace("practice");
      });
    }
    if (heroRace && !heroRace.dataset.typingBound) {
      heroRace.dataset.typingBound = "1";
      heroRace.addEventListener("click", function() {
        openRace("race");
      });
    }

    if (race && !race.dataset.typingBound) {
      race.dataset.typingBound = "1";
      race.addEventListener("click", function() {
        openRace("race");
      });
    }
    if (practice && !practice.dataset.typingBound) {
      practice.dataset.typingBound = "1";
      practice.addEventListener("click", function() {
        openRace("practice");
      });
    }
    if (time && !time.dataset.typingBound) {
      time.dataset.typingBound = "1";
      time.addEventListener("click", function(ev) {
        // Integrity: never navigate into race from Time Trial until implemented
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e2) {}
        toast("Time Trial (Coming soon): beat your best time with accuracy goals.");
      });
    }
    if (lessons && !lessons.dataset.typingBound) {
      lessons.dataset.typingBound = "1";
      lessons.addEventListener("click", function(ev) {
        // Integrity: keep Lessons disabled until implemented
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
        try { if (ev && ev.stopPropagation) ev.stopPropagation(); } catch (e2) {}
        toast("Lessons (Coming soon): structured levels for accuracy and speed.");
      });
    }

    var classicBtn = getEl("btn-typing-center-classic");
    if (classicBtn && !classicBtn.dataset.typingBound) {
      classicBtn.dataset.typingBound = "1";
      classicBtn.addEventListener("click", function() {
        showScreenSafe("screen-type");
      });
    }
  }

  function bindTypingRace() {
    var back = getEl("typingRaceBackBtn");
    var fsBtn = getEl("raceFullscreenBtn");

    var promptEl = getEl("racePrompt");
    var inputEl = getEl("raceInput");

    var focusBtn = getEl("raceFocusBtn");

    var promptCardEl = getEl("racePromptCard");
    var shakeTimer = 0;

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
      if (inputEl) {
        try { inputEl.focus(); } catch (e) {}
      }
      scrollPromptCardIntoView();
    }

    if (focusBtn && !focusBtn.dataset.typingBound) {
      focusBtn.dataset.typingBound = "1";
      focusBtn.addEventListener("click", function() {
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

      if (runState.timerEnabled) tick();
      else updateStatsOnce();
    }

    function startCurrentPromptRun() {
      if (runState.mode === "practice") {
        beginRunNow();
      } else {
        runCountdown(function() {
          beginRunNow();
        });
      }
    }

    function restartSamePromptWithMessage() {
      toast("Try that one again—aim for " + String(ACC_GOAL) + "%+ accuracy.");
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

    function startNextPromptRun() {
      resetRaceUI(promptEl, inputEl);
      setRetryUI(false);
      startCurrentPromptRun();
    }

    if (back && !back.dataset.typingBound) {
      back.dataset.typingBound = "1";
      back.addEventListener("click", function() {
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
        if (runState.forceRetry && !state.running) {
          restartSamePromptWithMessage();
          return;
        }

        resetRaceUI(promptEl, inputEl);
        setRetryUI(false);
      });
    }

    if (resetBtn && !resetBtn.dataset.typingBound) {
      resetBtn.dataset.typingBound = "1";
      resetBtn.addEventListener("click", function() {
        if (runState.forceRetry && !state.running) {
          restartSamePromptWithMessage();
          return;
        }

        resetRaceUI(promptEl, inputEl);
        setRetryUI(false);
      });
    }

    if (startBtn && !startBtn.dataset.typingBound) {
      startBtn.dataset.typingBound = "1";
      startBtn.addEventListener("click", function() {
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

      // Mobile stability: toggle a focused class to reduce scroll jump.
      (function() {
        var screen = document.getElementById("screen-typing-race");
        if (!screen) return;
        inputEl.addEventListener("focus", function() {
          try { screen.classList.add("is-input-focused"); } catch (e) {}
        });
        inputEl.addEventListener("blur", function() {
          try { screen.classList.remove("is-input-focused"); } catch (e) {}
        });
      })();

      inputEl.addEventListener("paste", function(ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (e) {}
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

      inputEl.addEventListener("input", function(ev) {
        if (!state.running) return;
        if (runState.finished) return;

        var v = inputEl.value || "";
        var prev = runState.prevValue || "";
        var maxLen = state.prompt.length;

        // Force cursor to end (avoid mid-string edits that break metrics)
        try { inputEl.setSelectionRange(v.length, v.length); } catch (err) {}

        // cap to prompt length
        if (v.length > maxLen) {
          inputEl.value = v.slice(0, maxLen);
          v = inputEl.value;
        }

        runState.progressLen = v.length;

        // Block multi-character jumps (paste/autofill/teleport typing).
        // Allow deletion and 1-char growth; clamp the rest.
        if ((!ev || !ev.isComposing) && (v.length - prev.length > 1)) {
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

        renderPromptWithHighlight(promptEl, v, state.prompt);
        setProgress((v.length / state.prompt.length) * 100);

        updateGoalProgress(v);

        // Practice: no timer loop, so repaint stats on input
        if (!runState.timerEnabled) updateStatsOnce();

        // Finish condition: must match exactly
        if (stringsMatchExactly(v, state.prompt)) {
          runState.finished = true;
          state.running = false;
          stopTick();
          inputEl.disabled = true;

          var elapsedMs = Date.now() - runState.startTs;
          var elapsedSeconds = elapsedMs / 1000;
          var wpm = computeWpm(state.prompt.length, elapsedSeconds);
          var accPct = computeAcc(runState.totalAdded, runState.totalErrors);

          var top = computeTopMistakes(state.prompt, v, runState.missCounts);
          var tips = formatTopMistakes(top);

          // Coaching based on accuracy
          if (accPct < ACC_COACH_LOW) {
            tips = tips + " • Tip: slow down and aim for " + String(ACC_GOAL) + "%+ before speed.";
          } else if (accPct < ACC_GOAL) {
            tips = tips + " • Almost there—push for " + String(ACC_GOAL) + "%+.";
          } else {
            tips = tips + " • Nice—now you can safely chase speed.";
          }

          var isPractice = (runState.mode === "practice");
          var needsRetry = (!isPractice) && (accPct < ACC_RETRY_THRESHOLD);
          setRetryUI(needsRetry);

          var feedbackText = buildRaceFeedbackText(runState.missCounts, runState.bigramCounts);

          var coachText = "";
          if (isPractice) {
            if ((runState.totalErrors || 0) === 0) coachText = "Nice—clean run. Now try to go a little smoother.";
            else coachText = "Slow down and aim for clean spaces and punctuation.";
          }

          saveBest(wpm, accPct / 100, elapsedMs);
          renderBestOnCenter();

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
            isPractice ? startNextPromptRun : (needsRetry ? startNextPromptRun : function() { showScreenSafe("screen-typing-center"); })
          );
        }
      });
    }
  }

  function init() {
    setupKeyboardInsetVar();
    bindTypingCenter();
    bindTypingRace();
    renderBestOnCenter();
  }

  window.TypingPremium = {
    _inited: false,
    init: function() {
      if (window.TypingPremium._inited) return;
      window.TypingPremium._inited = true;
      init();
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
