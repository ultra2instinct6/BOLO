// =====================================
// Games Module - owns screen-play
// =====================================

/*
QA / MANUAL TEST CHECKLIST
- Normal mode: each game reaches Round Complete (no last-question loop)
- Quest mode: completion shows Continue Quest button; clicking returns via callback
- Punjabi toggle ON/OFF mid-round: Punjabi lines hide/show; no blank Punjabi lines
- Missing Punjabi strings: English-only fallback; never empty UI
- Wrong once: shows hint/cue; can try again
- Wrong twice: shows correct answer + explanation and applies Help:
  - tapWord highlights correct token
  - other games disable/gray 1–2 distractors
- Double-click/rapid tap: XP awards at most once per question
- Difficulty cycles and changes option count/pool selection
*/

// CHANGELOG vNext:
// - Adds normalized-question round engine with explicit Next flow
// - Adds in-place Round Complete panel and Continue Quest handling
// - Adds kid-friendly Goal/Example lines and improved feedback microcopy
// - Adds attempts-based hint/help and near-miss tips
// - Adds difficulty cycling (persisted) and hooks for session resume

var Games = {
  // Legacy fields (kept for compatibility / existing tests)
  currentGameType: null,
  currentGameQuestionIndex: 0,
  currentGameScore: 0,
  currentGameStreak: 0,
  currentGameBest: 0,
  currentCustomQuiz: null,

  // ===== Play Home (Game Home Menu) state =====
  playHome: {
    selectedGameNum: null,
    selectedDifficulty: null
  },

  // ===== Runtime (single source of truth for active round) =====
  runtime: {
    round: null,
    submitted: false,
    attemptsByQid: {},
    missesByQid: {},
    correctTags: {},
    correctCount: 0,
    totalCount: 0,
    mode: "normal",
    onDone: null,
    seed: null,

    // UI/runtime-only caches (per round)
    _lastRenderedQid: null,
    _optionSetCache: {},
    _posHintWhyStateByQid: {}
  },

  // ===== Feedback + Microcopy =====
  GAME3_UI: {
    howtoEn: "How to play: Choose the tense (Present / Past / Future).",
    howtoPa: "ਖੇਡਣ ਦਾ ਤਰੀਕਾ: ਵਾਕ ਦਾ ਕਾਲ ਚੁਣੋ (ਵਰਤਮਾਨ / ਭੂਤ / ਭਵਿੱਖ)।",
    progressEn: function(i, total) { return "Question " + String(i) + " of " + String(total); },
    progressPa: function(i, total) { return "ਸਵਾਲ " + String(i) + " / " + String(total); },
    wrongCompareEn: function(chosen, correct) { return "You chose " + String(chosen) + " / Correct is " + String(correct); },
    wrongComparePa: function(chosen, correct) { return "ਤੁਸੀਂ ਚੁਣਿਆ " + String(chosen) + " / ਸਹੀ ਜਵਾਬ " + String(correct); }
  },
  MICROCOPY: {
    tapWord: {
      goalEn: "Goal: Tap the action/target word.",
      goalPa: "ਮਕਸਦ: ਸਹੀ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      exampleEn: "Example: runs",
      examplePa: "ਉਦਾਹਰਨ: runs",
      wrongCueEn: "Look for the action word.",
      wrongCuePa: "ਕਿਰਿਆ ਵਾਲਾ ਸ਼ਬਦ ਲੱਭੋ।"
    },
    pos: {
      goalEn: "Goal: Pick the word type.",
      goalPa: "ਮਕਸਦ: ਸ਼ਬਦ ਦੀ ਕਿਸਮ ਚੁਣੋ।",
      exampleEn: "Example: dog → noun",
      examplePa: "ਉਦਾਹਰਨ: dog → noun",
      wrongCueEn: "Think: person/place/thing? (noun)",
      wrongCuePa: "ਸੋਚੋ: ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼? (noun)"
    },
    tense: {
      goalEn: "Goal: Pick the time.",
      goalPa: "ਮਕਸਦ: ਸਮਾਂ ਚੁਣੋ।",
      exampleEn: "Example: walked → past",
      examplePa: "ਉਦਾਹਰਨ: walked → past",
      wrongCueEn: "Find time words: yesterday / will / every day.",
      wrongCuePa: "ਸਮੇਂ ਵਾਲੇ ਸ਼ਬਦ ਲੱਭੋ: yesterday / will / every day"
    },
    sentenceCheck: {
      goalEn: "Goal: Pick the best sentence.",
      goalPa: "ਮਕਸਦ: ਸਭ ਤੋਂ ਸਹੀ ਵਾਕ ਚੁਣੋ।",
      exampleEn: "Example: He goes…",
      examplePa: "ਉਦਾਹਰਨ: He goes…",
      wrongCueEn: "Check the verb with the subject.",
      wrongCuePa: "ਕਰਤਾ ਦੇ ਨਾਲ ਕਿਰਿਆ ਮਿਲਾਓ।"
    },
    convoReply: {
      goalEn: "Goal: Choose the best reply.",
      goalPa: "ਮਕਸਦ: ਸਭ ਤੋਂ ਚੰਗਾ ਜਵਾਬ ਚੁਣੋ।",
      exampleEn: "Example: Sorry → That’s okay.",
      examplePa: "ਉਦਾਹਰਨ: ਮਾਫ਼ ਕਰਨਾ → ਕੋਈ ਗੱਲ ਨਹੀਂ।",
      wrongCueEn: "Pick the reply that is kind, clear, and polite.",
      wrongCuePa: "ਦਇਆਲੂ, ਸਪੱਸ਼ਟ ਅਤੇ ਸ਼ਿਸ਼ਟ ਜਵਾਬ ਚੁਣੋ।"
    }
  },

  // Generic fallback microcopy (used when question lacks authored hint/explanation)
  GENERIC_FEEDBACK: {
    tapWord: {
      hintEn: "Try again. Look for the action word (the verb).",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਕਿਰਿਆ ਵਾਲਾ ਸ਼ਬਦ (verb) ਲੱਭੋ।",
      explanationEn: "The correct answer is the verb—the word that shows the action.",
      explanationPa: "ਸਹੀ ਜਵਾਬ verb ਹੈ—ਜੋ ਸ਼ਬਦ ਕੰਮ/ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।"
    },
    pos: {
      hintEn: "Try again. Ask: is it a person/place/thing (noun) or an action (verb)?",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸੋਚੋ: ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼ (noun) ਜਾਂ ਕੰਮ (verb)?",
      explanationEn: "Choose the word type based on how the word is used.",
      explanationPa: "ਸ਼ਬਦ ਦੀ ਕਿਸਮ ਉਸਦੀ ਵਰਤੋਂ ਦੇ ਅਧਾਰ ’ਤੇ ਚੁਣੀਦੀ ਹੈ।"
    },
    tense: {
      hintEn: "Try again. Look for time clues like yesterday, now, will, tomorrow.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸਮੇਂ ਦੇ ਇਸ਼ਾਰੇ ਲੱਭੋ: yesterday, now, will, tomorrow।",
      explanationEn: "Tense tells when the action happens: past, present, or future.",
      explanationPa: "Tense ਦੱਸਦਾ ਹੈ ਕਿ ਕੰਮ ਕਦੋਂ ਹੁੰਦਾ ਹੈ: past, present ਜਾਂ future।"
    },
    sentenceCheck: {
      hintEn: "Try again. Pick the sentence that sounds correct.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਜੋ ਵਾਕ ਸਹੀ ਲੱਗਦਾ ਹੈ ਉਹ ਚੁਣੋ।",
      explanationEn: "Pick the sentence with correct grammar (often subject–verb agreement).",
      explanationPa: "ਉਹ ਵਾਕ ਚੁਣੋ ਜਿਸਦੀ grammar ਸਹੀ ਹੋਵੇ (ਅਕਸਰ subject–verb ਮਿਲਾਪ)।"
    },
    convoReply: {
      hintEn: "Try again. Pick the most polite and helpful reply.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸਭ ਤੋਂ ਸ਼ਿਸ਼ਟ ਅਤੇ ਮਦਦਗਾਰ ਜਵਾਬ ਚੁਣੋ।",
      explanationEn: "A good reply is kind, clear, and respectful.",
      explanationPa: "ਚੰਗਾ ਜਵਾਬ ਦਇਆਲੂ, ਸਪੱਸ਼ਟ ਅਤੇ ਆਦਰ ਵਾਲਾ ਹੁੰਦਾ ਹੈ।"
    }
  },

  // ===== Init + UI wiring =====
  init: function() {
    function onClick(id, fn) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("click", fn);
    }

    // --- Play Home (new) ---
    onClick("btn-playhome-game1", function() { Games.selectPlayHomeGame(1); });
    onClick("btn-playhome-game2", function() { Games.selectPlayHomeGame(2); });
    onClick("btn-playhome-game3", function() { Games.selectPlayHomeGame(3); });
    onClick("btn-playhome-game4", function() { Games.selectPlayHomeGame(4); });
    onClick("btn-playhome-game5", function() { Games.selectPlayHomeGame(5); });

    onClick("btn-playhome-diff-1", function() { Games.setPlayHomeDifficulty(1); });
    onClick("btn-playhome-diff-2", function() { Games.setPlayHomeDifficulty(2); });
    onClick("btn-playhome-diff-3", function() { Games.setPlayHomeDifficulty(3); });
    onClick("btn-playhome-start", function() { Games.startSelectedFromPlayHome(); });

    onClick("btn-how-to-play", function() { UI.openModal("modal-howto"); });
    onClick("btn-play-next", function() { Games.next(); });

    onClick("btn-play-again", function() { Games.playAgain(); });
    onClick("btn-play-back-menu", function() { Games.backToPlayMenu(); });
    onClick("btn-play-continue-quest", function() { Games.continueQuest(); });
    onClick("btn-play-difficulty", function() { Games.cycleDifficulty(); });

    // Round back buttons should return to Play Home (menu)
    onClick("btn-play-back-games", function() { Games.backToPlayMenu(); });
    onClick("btnChooseAnotherGame", function() { Games.backToPlayMenu(); });

    Games.updateDifficultyButton();

    // --- Game Picker Toggle Logic ---
    var toggleBtn = document.getElementById("btnToggleGamePicker");
    var pickerPanel = document.getElementById("gamePickerPanel");
    if (toggleBtn && pickerPanel) {
      toggleBtn.addEventListener("click", function() {
        var isOpen = !pickerPanel.classList.contains("is-hidden");
        if (isOpen) {
          pickerPanel.classList.add("is-hidden");
          pickerPanel.setAttribute("aria-hidden", "true");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.textContent = "Show games";
        } else {
          pickerPanel.classList.remove("is-hidden");
          pickerPanel.setAttribute("aria-hidden", "false");
          toggleBtn.setAttribute("aria-expanded", "true");
          toggleBtn.textContent = "Hide games";
        }
      });
      // Set initial state
      pickerPanel.classList.add("is-hidden");
      pickerPanel.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "Show games";
    }

    // Render Play Home defaults (safe if the screen isn't present)
    Games.renderPlayHome();
  },

  // ===== Play Home (Game Home Menu) =====
  getPlayHomeRegistry: function() {
    return [
      {
        num: 1,
        id: "GAME1",
        enabled: true,
        title: "Tap the Word",
        description: "10 questions • quick",
        goalEn: "Tap the action/target word.",
        trackTags: ["Words", "Actions"],
        instructions: [
          "Read the sentence.",
          "Tap the best word.",
          "If you miss, you’ll get a hint."
        ]
      },
      {
        num: 2,
        id: "GAME2",
        enabled: true,
        title: "Parts of Speech",
        description: "10 questions • multiple choice",
        goalEn: "Pick the word type.",
        trackTags: ["Words", "Word Types"],
        instructions: [
          "Look at the word.",
          "Choose the correct type.",
          "Try again if you miss."
        ]
      },
      {
        num: 3,
        id: "GAME3",
        enabled: true,
        title: "Tense Detective",
        description: "10 questions • multiple choice",
        goalEn: "Pick the time (past/present/future).",
        trackTags: ["Actions", "Time"],
        instructions: [
          "Read the sentence.",
          "Find time clues.",
          "Choose the tense."
        ]
      },
      {
        num: 4,
        id: "GAME4",
        enabled: true,
        title: "Sentence Check",
        description: "10 questions • pick the best sentence",
        goalEn: "Pick the best sentence.",
        trackTags: ["Sentences", "Grammar"],
        instructions: [
          "Read both sentences.",
          "Pick the one that sounds correct.",
          "Watch subject–verb agreement."
        ]
      },
      {
        num: 5,
        id: "GAME5",
        enabled: true,
        title: "Conversation Coach",
        description: "10 questions • best reply",
        goalEn: "Choose the best reply.",
        trackTags: ["Conversation", "Polite replies"],
        instructions: [
          "Read the message.",
          "Choose the best reply.",
          "If you miss, you’ll get a hint and can try again."
        ]
      }
    ];
  },

  _getPlayHomeEntry: function(gameNum) {
    var list = Games.getPlayHomeRegistry();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].num === gameNum) return list[i];
    }
    return null;
  },

  renderPlayHome: function() {
    // Safe no-op if screen isn't in DOM
    var setup = document.getElementById("playhome-setup");
    if (!setup) return;

    // Keep selected difficulty in sync with State's difficulty
    var d = Games.playHome.selectedDifficulty;
    if (!(d === 1 || d === 2 || d === 3)) {
      d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
      Games.playHome.selectedDifficulty = d;
    }
    Games._renderPlayHomeDifficultyButtons(d);

    var startBtn = document.getElementById("btn-playhome-start");
    if (startBtn) startBtn.disabled = !(Games.playHome.selectedGameNum && Games._getPlayHomeEntry(Games.playHome.selectedGameNum) && Games._getPlayHomeEntry(Games.playHome.selectedGameNum).enabled);
  },

  _renderPlayHomeDifficultyButtons: function(diff) {
    function setActive(id, active) {
      var el = document.getElementById(id);
      if (!el) return;
      if (active) el.classList.add("is-selected");
      else el.classList.remove("is-selected");
    }
    setActive("btn-playhome-diff-1", diff === 1);
    setActive("btn-playhome-diff-2", diff === 2);
    setActive("btn-playhome-diff-3", diff === 3);
  },

  setPlayHomeDifficulty: function(diff) {
    var d = Math.max(1, Math.min(3, diff | 0));
    Games.playHome.selectedDifficulty = d;
    if (State && State.setPlayDifficulty) State.setPlayDifficulty(d);
    Games._renderPlayHomeDifficultyButtons(d);
  },

  selectPlayHomeGame: function(gameNum) {
    var entry = Games._getPlayHomeEntry(gameNum);
    if (!entry || !entry.enabled) return;

    Games.playHome.selectedGameNum = gameNum;

    // Tile selection state
    for (var i = 1; i <= 5; i++) {
      var tile = document.getElementById("btn-playhome-game" + i);
      if (!tile) continue;
      if (i === gameNum) tile.classList.add("is-selected");
      else tile.classList.remove("is-selected");
    }

    // Setup panel
    var setup = document.getElementById("playhome-setup");
    if (setup) {
      setup.classList.remove("is-hidden");
      setup.setAttribute("aria-hidden", "false");
    }

    var titleEl = document.getElementById("playhome-setup-title");
    if (titleEl) titleEl.textContent = entry.title;
    var goalEl = document.getElementById("playhome-setup-goal");
    if (goalEl) goalEl.textContent = "Goal: " + entry.goalEn;

    var chips = document.getElementById("playhome-practice-chips");
    if (chips) {
      chips.innerHTML = "";
      for (var c = 0; c < entry.trackTags.length; c++) {
        var chip = document.createElement("div");
        chip.className = "track-pill";
        chip.innerHTML = '<span class="dot"></span>' + String(entry.trackTags[c]);
        chips.appendChild(chip);
      }
    }

    var list = document.getElementById("playhome-instructions");
    if (list) {
      list.innerHTML = "";
      for (var j = 0; j < entry.instructions.length; j++) {
        var li = document.createElement("li");
        li.textContent = String(entry.instructions[j]);
        list.appendChild(li);
      }
    }

    var startBtn = document.getElementById("btn-playhome-start");
    if (startBtn) startBtn.disabled = false;
    Games.renderPlayHome();
  },

  startSelectedFromPlayHome: function() {
    var gameNum = Games.playHome.selectedGameNum;
    var entry = Games._getPlayHomeEntry(gameNum);
    if (!entry || !entry.enabled) return;

    // Ensure chosen difficulty is applied for the next round
    var d = Games.playHome.selectedDifficulty;
    if (!(d === 1 || d === 2 || d === 3)) d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
    if (State && State.setPlayDifficulty) State.setPlayDifficulty(d);

    Games.startGame(gameNum);
  },

  // ===== Helpers =====
  isPunjabiOn: function() {
    try {
      return !!(State && State.state && State.state.settings && State.state.settings.punjabiOn);
    } catch (e) {
      return true;
    }
  },

  _getActiveProfileIdSafe: function() {
    try {
      if (State && typeof State.getActiveProfile === "function") {
        var p = State.getActiveProfile();
        if (p && p.id) return String(p.id);
      }
    } catch (e) {}
    return "p1";
  },

  _ensurePersistentMissStore: function() {
    try {
      if (!State || !State.state) return null;
      if (!State.state.progress || typeof State.state.progress !== "object") State.state.progress = {};
      if (!State.state.progress.gamesMissedByProfile || typeof State.state.progress.gamesMissedByProfile !== "object") {
        State.state.progress.gamesMissedByProfile = {};
      }
      var pid = Games._getActiveProfileIdSafe();
      var map = State.state.progress.gamesMissedByProfile[pid];
      if (!map || typeof map !== "object") map = {};
      State.state.progress.gamesMissedByProfile[pid] = map;
      return map;
    } catch (e) {
      return null;
    }
  },

  _wasPersistentlyMissed: function(qid) {
    if (!qid) return false;
    var map = Games._ensurePersistentMissStore();
    if (!map) return false;
    return map[qid] === true;
  },

  _markPersistentlyMissed: function(qid) {
    if (!qid) return;
    var map = Games._ensurePersistentMissStore();
    if (!map) return;
    if (map[qid] === true) return;
    map[qid] = true;
    try { if (State && State.save) State.save(); } catch (e) {}
  },

  _clearPersistentlyMissed: function(qid) {
    if (!qid) return;
    var map = Games._ensurePersistentMissStore();
    if (!map) return;
    if (!Object.prototype.hasOwnProperty.call(map, qid)) return;
    delete map[qid];
    try { if (State && State.save) State.save(); } catch (e) {}
  },

  _pickActiveHintText: function(q, chosenText, correctText) {
    if (!q) return "";
    var punjabiOn = Games.isPunjabiOn();
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var near = Games.getNearMissTip(q, chosenText || "", correctText || "");

    // Prefer authored hint in active language; then near-miss; then generic fallback.
    var t = "";
    if (punjabiOn) {
      t = (q.hintPa || "") || (q.hintEn || "") || (near.pa || "") || (near.en || "") || (fb.hintPa || "") || (fb.hintEn || "");
    } else {
      t = (q.hintEn || "") || (near.en || "") || (fb.hintEn || "");
    }
    return String(t || "").trim();
  },

  _pickActiveExplanationText: function(q) {
    if (!q) return "";
    var punjabiOn = Games.isPunjabiOn();
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var t = "";
    if (punjabiOn) {
      t = (q.explanationPa || "") || (q.explanationEn || "") || (fb.explanationPa || "") || (fb.explanationEn || "");
    } else {
      t = (q.explanationEn || "") || (fb.explanationEn || "");
    }
    return String(t || "").trim();
  },

  _pickExplanationBoth: function(q) {
    if (!q) return { en: "", pa: "" };
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var en = String((q.explanationEn || "") || (fb.explanationEn || "") || "").trim();
    var pa = String((q.explanationPa || "") || (fb.explanationPa || "") || "").trim();
    // If Punjabi is missing but English exists, leave Punjabi blank (no forced translation).
    return { en: en, pa: pa };
  },

  _xpEach: function() {
    return (State && typeof State.XP_PER_CORRECT === "number") ? State.XP_PER_CORRECT : 5;
  },

  _getGameKey: function(gameNum) {
    return "game" + gameNum;
  },

  _mapGameNumToType: function(gameNum) {
    if (gameNum === 1) return "tapWord";
    if (gameNum === 2) return "pos";
    if (gameNum === 3) return "tense";
    if (gameNum === 4) return "sentenceCheck";
    if (gameNum === 5) return "convoReply";
    return null;
  },

  _mapGameIdToType: function(gameId) {
    if (gameId === "GAME1") return "tapWord";
    if (gameId === "GAME2") return "pos";
    if (gameId === "GAME3") return "tense";
    if (gameId === "GAME4") return "sentenceCheck";
    if (gameId === "GAME5") return "convoReply";
    return null;
  },

  _difficultyLabel: function(d) {
    if (d === 1) return "Easy";
    if (d === 2) return "Medium";
    return "Hard";
  },

  updateDifficultyButton: function() {
    var btn = document.getElementById("btn-play-difficulty");
    if (!btn) return;
    var d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
    btn.textContent = "Difficulty: " + Games._difficultyLabel(d);
  },

  cycleDifficulty: function() {
    var d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
    var next = (d % 3) + 1;
    if (State && State.setPlayDifficulty) State.setPlayDifficulty(next);
    Games.updateDifficultyButton();

    // If a round is active, re-render (selection rules may change next round only)
    if (Games.runtime.round && Games.runtime.mode === "normal") {
      Games.render();
    }
  },

  // ===== Normalization + Adapters =====
  // NormalizedQuestion shape (additive runtime object):
  // {
  //   qid, gameType, trackId,
  //   goalEn, goalPa, exampleEn, examplePa,
  //   promptEn, promptPa,
  //   optionsEn, optionsPa,
  //   correctIndex,
  //   hintEn, hintPa,
  //   explanationEn, explanationPa,
  //   difficulty, tags, source,
  //   // tapWord subtype:
  //   tokens, correctTokenIndex, sentenceEn
  // }

  _baseNormalized: function(gameType) {
    var m = Games.MICROCOPY[gameType] || {};
    return {
      gameType: gameType,
      goalEn: m.goalEn || "Goal: —",
      goalPa: m.goalPa || "",
      exampleEn: m.exampleEn || "Example: —",
      examplePa: m.examplePa || "",
      hintEn: "",
      hintPa: "",
      explanationEn: "",
      explanationPa: "",
      difficulty: 2,
      tags: []
    };
  },

  normalizeFromDQQuestion: function(q) {
    if (!q || typeof q !== "object") return null;
    var gameType = Games._mapGameIdToType(q.gameId);
    if (!gameType) return null;

    var out = Games._baseNormalized(gameType);
    out.qid = String(q.id || "");
    // Standardize Game 3/DQ tense tracking to actions.
    if (gameType === "tense") out.trackId = "T_ACTIONS";
    else out.trackId = q.trackId || "T_WORDS";
    out.promptEn = String(q.prompt || "");
    out.promptPa = "";
    out.source = { type: "dq_normalized", id: out.qid };

    var choices = Array.isArray(q.choices) ? q.choices : [];

    // For pos/tense, preserve stable IDs so difficulty + shuffling can work (and Punjabi labels can render).
    if (gameType === "pos" || gameType === "tense") {
      var ids = choices.map(function(c) { return (c && c.id != null) ? String(c.id) : ""; }).filter(function(id) { return !!id; });
      out._choiceIds = ids.slice();

      out._choiceLabels = ids.map(function(id) {
        try {
          if (gameType === "pos") {
            if (typeof getPosLabel === "function") return getPosLabel(id, { lang: "en" });
            if (typeof PARTS_OF_SPEECH_LABELS !== "undefined" && PARTS_OF_SPEECH_LABELS && PARTS_OF_SPEECH_LABELS[id]) return PARTS_OF_SPEECH_LABELS[id];
          }
          if (gameType === "tense") {
            if (typeof getTenseLabel === "function") return getTenseLabel(id, { lang: "en" });
            if (typeof TENSE_LABELS !== "undefined" && TENSE_LABELS && TENSE_LABELS[id]) return TENSE_LABELS[id];
          }
        } catch (e) {}
        return id;
      });

      // Optional Punjabi labels (additive; safe fallback if missing)
      try {
        if (gameType === "pos" && typeof PARTS_OF_SPEECH_LABELS_PA !== "undefined" && PARTS_OF_SPEECH_LABELS_PA) {
          out._choiceLabelsPa = ids.map(function(id) {
            if (typeof getPosLabel === "function") return getPosLabel(id, { lang: "pa" }) || "";
            return PARTS_OF_SPEECH_LABELS_PA[id] || "";
          });
        }
        if (gameType === "tense" && typeof TENSE_LABELS_PA !== "undefined" && TENSE_LABELS_PA) {
          out._choiceLabelsPa = ids.map(function(id) {
            if (typeof getTenseLabel === "function") return getTenseLabel(id, { lang: "pa" }) || "";
            return TENSE_LABELS_PA[id] || "";
          });
        }
      } catch (e) {}

      out.correctIndex = ids.indexOf(String(q.correctChoiceId || ""));
    } else {
      // Convert choices -> optionsEn + correctIndex (sentenceCheck)
      out.optionsEn = choices.map(function(c) { return c && c.text != null ? String(c.text) : ""; });
      out.optionsPa = null;
      var correctIdx = -1;
      for (var i = 0; i < choices.length; i++) {
        if (choices[i] && choices[i].id === q.correctChoiceId) {
          correctIdx = i;
          break;
        }
      }
      out.correctIndex = correctIdx;
    }

    // Tags
    if (gameType === "pos" && q.correctChoiceId) out.tags = ["POS:" + String(q.correctChoiceId).toUpperCase()];
    if (gameType === "tense" && q.correctChoiceId) out.tags = ["TENSE:" + String(q.correctChoiceId).toUpperCase()];
    if (gameType === "sentenceCheck") out.tags = ["SENTENCE:CHECK"]; 

    return out;
  },

  normalizeFromRawGame: function(gameNum, q, idx) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType || !q) return null;

    var out = Games._baseNormalized(gameType);
    out.qid = "N_" + gameType + "_" + String(idx);
    out.trackId = q.trackId || "T_WORDS";
    out.source = { type: "raw_game", id: out.qid };

    // Optional authored feedback fields (additive)
    if (q.hintEn != null) out.hintEn = String(q.hintEn);
    if (q.hintPa != null) out.hintPa = String(q.hintPa);
    if (q.explanationEn != null) out.explanationEn = String(q.explanationEn);
    if (q.explanationPa != null) out.explanationPa = String(q.explanationPa);

    if (gameType === "tapWord") {
      var sentence = String(q.sentence || "").trim();
      var correctWord = String(q.correctWord || "").trim();
      if (!sentence || !correctWord) return null;

      var rawTokens = sentence.split(/\s+/);
      var tokens = rawTokens.map(function(t) { return String(t).replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, ""); });
      var correctTokenIndex = -1;
      for (var ti = 0; ti < tokens.length; ti++) {
        if (tokens[ti].toLowerCase() === correctWord.toLowerCase()) {
          if (correctTokenIndex !== -1) return null; // ambiguous
          correctTokenIndex = ti;
        }
      }
      if (correctTokenIndex < 0) return null;

      out.promptEn = String(q.question || "Tap the word.");
      out.promptPa = "";
      out.sentenceEn = sentence;
      out.tokens = rawTokens;
      out.correctTokenIndex = correctTokenIndex;
      out.tags = ["TAPWORD"]; 

      // Infer difficulty from token count
      out.difficulty = (rawTokens.length <= 5) ? 1 : (rawTokens.length <= 8 ? 2 : 3);
      return out;
    }

    if (gameType === "pos") {
      var word = String(q.word || "");
      out.promptEn = "What word type is: \"" + word + "\"?";
      out.promptPa = "";

      var partIds = Object.keys(PARTS_OF_SPEECH_LABELS);
      out._choiceIds = partIds.slice();
      out._choiceLabels = partIds.map(function(pid) {
        if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "en" });
        return PARTS_OF_SPEECH_LABELS[pid];
      });

      // Optional Punjabi labels (additive; safe fallback if missing)
      try {
        if (typeof PARTS_OF_SPEECH_LABELS_PA !== "undefined" && PARTS_OF_SPEECH_LABELS_PA) {
          out._choiceLabelsPa = partIds.map(function(pid) {
            if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "pa" }) || "";
            return PARTS_OF_SPEECH_LABELS_PA[pid] || "";
          });
        }
      } catch (e) {}

      out.correctIndex = partIds.indexOf(q.correctPartId);
      out.tags = ["POS:" + String(q.correctPartId || "").toUpperCase()];
      out.difficulty = 2;
      return out;
    }

    if (gameType === "tense") {
      // Standardize Game 3 tracking to the tense/action skill.
      out.trackId = "T_ACTIONS";
      out.promptEn = String(q.sentence || "");
      out.promptPa = "";
      var tenseIds = Object.keys(TENSE_LABELS);
      out._choiceIds = tenseIds.slice();
      out._choiceLabels = tenseIds.map(function(tid) {
        if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "en" });
        return TENSE_LABELS[tid];
      });

      // Optional Punjabi labels (additive; safe fallback if missing)
      try {
        if (typeof TENSE_LABELS_PA !== "undefined" && TENSE_LABELS_PA) {
          out._choiceLabelsPa = tenseIds.map(function(tid) {
            if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "pa" }) || "";
            return TENSE_LABELS_PA[tid] || "";
          });
        }
      } catch (e) {}

      out.correctIndex = tenseIds.indexOf(q.correctTense);
      out.tags = ["TENSE:" + String(q.correctTense || "").toUpperCase()];
      out.difficulty = 2;
      return out;
    }

    if (gameType === "sentenceCheck") {
      out.promptEn = "Pick the best sentence:";
      out.promptPa = "";
      var opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length < 2) return null;
      out.optionsEn = [String(opts[0]), String(opts[1])];

      // Optional Punjabi options (additive)
      if (Array.isArray(q.optionsPa) && q.optionsPa.length >= 2) {
        out.optionsPa = [String(q.optionsPa[0] || ""), String(q.optionsPa[1] || "")];
      }

      out.correctIndex = (q.correct === opts[0]) ? 0 : 1;
      out.tags = ["SENTENCE:CHECK"]; 
      out.difficulty = 2;
      return out;
    }

    return null;
  },

  normalizeGame5Questions: function(rawArray) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var out = [];
    var seen = {};

    for (var i = 0; i < raw.length; i++) {
      var q = raw[i] || {};
      var id = String(q.id || ("G5_" + String(i + 1)));
      if (!id || seen[id]) continue;
      seen[id] = true;

      var choicesEn = Array.isArray(q.choicesEn)
        ? q.choicesEn
        : (Array.isArray(q.optionsEn)
          ? q.optionsEn
          : (Array.isArray(q.options)
            ? q.options
            : []));

      var choicesPa = Array.isArray(q.choicesPa)
        ? q.choicesPa
        : (Array.isArray(q.optionsPa)
          ? q.optionsPa
          : null);

      var answerIndex = (typeof q.answerIndex === "number")
        ? (q.answerIndex | 0)
        : ((typeof q.correctIndex === "number")
          ? (q.correctIndex | 0)
          : ((typeof q.correctChoiceIndex === "number")
            ? (q.correctChoiceIndex | 0)
            : -1));

      if (choicesEn.length < 3 || choicesEn.length > 8) continue;
      if (answerIndex < 0 || answerIndex >= choicesEn.length) continue;

      var base = Games._baseNormalized("convoReply");
      base.qid = id;
      base.trackId = String(q.trackId || "CONVO_REPLY");
      base.difficulty = Math.max(1, Math.min(3, (q.difficulty | 0) || 2));

      base.promptEn = String(q.promptEn || "");
      base.promptPa = String(q.promptPa || "");

      base.optionsEn = choicesEn.map(function(s) { return String(s || ""); });
      if (choicesPa) {
        base.optionsPa = choicesEn.map(function(_, idx) {
          return (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        });
      } else {
        base.optionsPa = null;
      }

      base.correctIndex = answerIndex;
      base.answerIndex = answerIndex;

      base.hintEn = String(q.hintEn || q.hint || "");
      base.hintPa = String(q.hintPa || "");
      base.explanationEn = String(q.explainEn || q.explanationEn || q.explain || q.explanation || "");
      base.explanationPa = String(q.explainPa || q.explanationPa || "");

      // Additive, richer shape (safe for older renderer)
      base.id = id;
      base.gameId = 5;
      base.prompt = { en: base.promptEn, pa: base.promptPa || undefined };
      base.choices = base.optionsEn.map(function(en, idx) {
        var pa = (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        return { en: en, pa: pa || undefined };
      });
      base.hint = { en: base.hintEn, pa: base.hintPa || undefined };
      base.explanation = { en: base.explanationEn, pa: base.explanationPa || undefined };

      if (q.topic) base.tags = ["CONVO:" + String(q.topic).toUpperCase()];

      out.push(base);
    }

    return out;
  },

  normalizeFromLessonStepTapWord: function(lessonId, step, stepIndex) {
    if (!lessonId || !step || step.step_type !== "question") return null;
    if (!Array.isArray(step.options) || typeof step.correct_answer !== "string") return null;

    var tokens = step.options.map(function(t) { return String(t); });
    var correct = String(step.correct_answer);
    var correctIdx = -1;
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === correct) {
        if (correctIdx !== -1) return null;
        correctIdx = i;
      }
    }
    if (correctIdx < 0) return null;

    var out = Games._baseNormalized("tapWord");
    out.qid = "LQ_" + lessonId + "_" + String(stepIndex);
    out.trackId = "T_WORDS";
    try {
      if (typeof LESSON_META !== "undefined" && Array.isArray(LESSON_META)) {
        for (var m = 0; m < LESSON_META.length; m++) {
          if (LESSON_META[m] && LESSON_META[m].id === lessonId) {
            out.trackId = LESSON_META[m].trackId || out.trackId;
            break;
          }
        }
      }
    } catch (e) {}

    out.promptEn = String(step.english_text || "Tap the word.");
    out.promptPa = String(step.punjabi_text || "");
    out.sentenceEn = tokens.join(" ");
    out.tokens = tokens;
    out.correctTokenIndex = correctIdx;
    out.source = { type: "lesson_step", id: lessonId, stepId: String(stepIndex) };
    out.tags = ["TAPWORD"]; 
    out.difficulty = (tokens.length <= 5) ? 1 : (tokens.length <= 8 ? 2 : 3);

    // Optional authored feedback fields from lesson steps (if present)
    if (step.hint && typeof step.hint === "object") {
      if (step.hint.en) out.hintEn = String(step.hint.en);
      if (step.hint.pa) out.hintPa = String(step.hint.pa);
    }
    if (step.explanation && typeof step.explanation === "object") {
      if (step.explanation.en) out.explanationEn = String(step.explanation.en);
      if (step.explanation.pa) out.explanationPa = String(step.explanation.pa);
    }

    return out;
  },

  // ===== Selection + Difficulty =====
  buildPoolForGameNum: function(gameNum) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType) return [];

    // tapWord: prefer normalized GAME1_QUESTIONS + also include lesson-derived tapWord
    if (gameType === "tapWord") {
      var pool = [];
      if (typeof GAME1_QUESTIONS !== "undefined" && Array.isArray(GAME1_QUESTIONS)) {
        for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
          var nq = Games.normalizeFromRawGame(1, GAME1_QUESTIONS[i], i);
          if (nq) pool.push(nq);
        }
      }

      // Add lesson-derived (legacy + new format via Lessons.getSteps when available)
      try {
        if (typeof LESSONS !== "undefined" && LESSONS) {
          for (var lessonId in LESSONS) {
            if (!LESSONS.hasOwnProperty(lessonId)) continue;
            var steps = null;
            if (typeof Lessons !== "undefined" && Lessons && typeof Lessons.getSteps === "function") {
              steps = Lessons.getSteps(lessonId);
            } else {
              steps = LESSONS[lessonId];
            }
            if (!Array.isArray(steps)) continue;
            for (var si = 0; si < steps.length; si++) {
              var step = steps[si];
              var n2 = Games.normalizeFromLessonStepTapWord(lessonId, step, si);
              if (n2) pool.push(n2);
            }
          }
        }
      } catch (e) {}

      return pool;
    }

    // Game 5: Conversation Coach (Best Reply)
    if (gameType === "convoReply") {
      var raw5 = (typeof RAW_GAME5_QUESTIONS !== "undefined") ? RAW_GAME5_QUESTIONS : [];
      if (!Array.isArray(raw5)) raw5 = [];
      return Games.normalizeGame5Questions(raw5);
    }

    var raw = null;
    if (gameType === "pos") raw = (typeof GAME2_QUESTIONS !== "undefined") ? GAME2_QUESTIONS : [];
    if (gameType === "tense") raw = (typeof GAME3_QUESTIONS !== "undefined") ? GAME3_QUESTIONS : [];
    if (gameType === "sentenceCheck") raw = (typeof GAME4_QUESTIONS !== "undefined") ? GAME4_QUESTIONS : [];
    if (!Array.isArray(raw)) raw = [];

    var out = [];
    for (var r = 0; r < raw.length; r++) {
      var nq2 = Games.normalizeFromRawGame(gameNum, raw[r], r);
      if (nq2) out.push(nq2);
    }
    return out;
  },

  applyDifficultyToQuestion: function(q, difficulty) {
    if (!q || typeof q !== "object") return q;
    var d = Math.max(1, Math.min(3, difficulty | 0));

    // tapWord: filter by token count via selection (handled at pool selection), but keep as-is.
    if (q.gameType === "pos" || q.gameType === "tense") {
      // Build choices list: small set for easy/medium, full for hard.
      var allIds = Array.isArray(q._choiceIds) ? q._choiceIds.slice() : [];
      var allLabels = Array.isArray(q._choiceLabels) ? q._choiceLabels.slice() : [];
      var allLabelsPa = Array.isArray(q._choiceLabelsPa) ? q._choiceLabelsPa.slice() : null;
      if (!allIds.length || !allLabels.length) return q;

      var correctId = (q.correctIndex >= 0 && q.correctIndex < allIds.length) ? allIds[q.correctIndex] : null;
      var keepCount = (d === 1) ? 5 : (d === 2 ? 7 : allIds.length);
      keepCount = Math.max(3, Math.min(allIds.length, keepCount));

      // Always include correct.
      var keepIds = [];
      var keepLabels = [];
      if (correctId != null) {
        keepIds.push(correctId);
        keepLabels.push(allLabels[allIds.indexOf(correctId)]);
      }

      // Add distractors deterministically/random depending on mode; caller provides RNG.
      q._difficultyKeepCount = keepCount;
      q._difficultyAllIds = allIds;
      q._difficultyAllLabels = allLabels;
      if (allLabelsPa) q._difficultyAllLabelsPa = allLabelsPa;
      return q;
    }
    return q;
  },

  // ===== Round Engine =====
  startGame: function(gameNum) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType) return;

    var key = Games._getGameKey(gameNum);
    Games.currentGameType = gameNum;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;

    Games.currentGameBest = (State.state.progress.bestScores && typeof State.state.progress.bestScores[key] === "number")
      ? State.state.progress.bestScores[key]
      : 0;

    State.state.session.currentGameId = key;
    State.save();

    var pool = Games.buildPoolForGameNum(gameNum);
    var difficulty = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
    var selected = (gameType === "tense")
      ? Games.selectQuestionsTenseRamped(pool, difficulty, 10, false, null)
      : Games.selectQuestions(pool, gameType, difficulty, 10, false, null);

    Games.beginRound({
      mode: "normal",
      gameId: key,
      label: Games.defaultLabelForGameType(gameType),
      difficulty: difficulty,
      questions: selected,
      onDone: null,
      seed: null
    });

    UI.goTo("screen-play");
  },

  // ===== Game 3 selection (ramp + marker-free mix) =====
  _TENSTimeMarkerRe: /(\byesterday\b|\btomorrow\b|\bnext\b|\blast\b|\bago\b|\bevery\b|\btoday\b|\btonight\b|\bnow\b|\bright now\b|\bsoon\b)/i,

  _tenseTierForSentence: function(sentenceEn) {
    var s = String(sentenceEn || "");
    if (!s) return 2;
    if (Games._TENSTimeMarkerRe.test(s)) return 1;

    // Marker-free but clear verb-form cues.
    // Future: will ...
    if (/\bwill\b/i.test(s)) return 2;
    // Present progressive: am/is/are + -ing
    if (/\b(am|is|are)\b/i.test(s) && /\b\w+ing\b/i.test(s)) return 2;
    // Past: was/were or common -ed
    if (/\b(was|were)\b/i.test(s)) return 2;
    if (/\b\w+ed\b/i.test(s)) return 2;

    // Otherwise treat as harder marker-free.
    return 3;
  },

  selectQuestionsTenseRamped: function(pool, difficulty, count, deterministic, seed) {
    if (!Array.isArray(pool)) pool = [];
    var n = Math.max(1, count | 0);

    var rng = deterministic ? Games._seededRng(seed || 1) : Math.random;
    function shuffleInPlace(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    }

    var tier1 = [];
    var tier2 = [];
    var tier3 = [];
    for (var i = 0; i < pool.length; i++) {
      var q = pool[i];
      if (!q || q.gameType !== "tense") continue;
      var tier = Games._tenseTierForSentence(q.promptEn || "");
      if (tier === 1) tier1.push(q);
      else if (tier === 2) tier2.push(q);
      else tier3.push(q);
    }

    shuffleInPlace(tier1);
    shuffleInPlace(tier2);
    shuffleInPlace(tier3);

    // Ramp template for a 10-question round.
    // Q1–Q4: mostly Tier 1
    // Q5–Q8: mix Tier 1/2
    // Q9–Q10: include Tier 2 (and Tier 3 if available)
    var plan = [];
    if (n === 10) {
      plan = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
    } else {
      // General fallback: early easier, late harder.
      for (var p = 0; p < n; p++) {
        var frac = (n <= 1) ? 1 : (p / (n - 1));
        plan.push(frac < 0.4 ? 1 : (frac < 0.8 ? 2 : 3));
      }
    }

    function pickFromTier(t) {
      if (t === 1 && tier1.length) return tier1.shift();
      if (t === 2 && tier2.length) return tier2.shift();
      if (t === 3 && tier3.length) return tier3.shift();
      return null;
    }

    var out = [];
    var seen = {};
    for (var k = 0; k < plan.length && out.length < n; k++) {
      var tierWanted = plan[k];
      var qPick = pickFromTier(tierWanted) || pickFromTier(2) || pickFromTier(1) || pickFromTier(3);
      if (!qPick) break;
      var key = qPick.qid || (qPick.promptEn + "|" + String(out.length));
      if (seen[key]) { k--; continue; }
      seen[key] = true;
      out.push(qPick);
    }

    // If we still need more, fall back to a shuffled pool (preserve uniqueness).
    if (out.length < n) {
      var rest = pool.filter(function(q) { return q && q.gameType === "tense"; }).slice();
      shuffleInPlace(rest);
      for (var r = 0; r < rest.length && out.length < n; r++) {
        var q2 = rest[r];
        var key2 = q2.qid || (q2.promptEn + "|" + String(out.length));
        if (seen[key2]) continue;
        seen[key2] = true;
        out.push(q2);
      }
    }

    if (!out.length) {
      // Last resort: use existing generic selector.
      return Games.selectQuestions(pool, "tense", difficulty, n, deterministic, seed);
    }

    return out;
  },

  startCustomQuiz: function(options) {
    // Daily Quest passes already-normalized questions from buildAllGameQuestions()
    var questionsIn = (options && Array.isArray(options.questions)) ? options.questions : [];
    var normalized = [];
    for (var i = 0; i < questionsIn.length; i++) {
      var nq = Games.normalizeFromDQQuestion(questionsIn[i]);
      if (nq) normalized.push(nq);
    }

    var label = (options && options.label) ? String(options.label) : "Daily Quest";
    var d = (options && typeof options.difficulty === "string") ? options.difficulty : "Medium";
    var diffNum = (d.indexOf("Hard") >= 0) ? 3 : (d.indexOf("Easy") >= 0 ? 1 : 2);

    // Reset per-round counters for quest play
    Games.currentGameType = null;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;
    Games.currentGameBest = 0;

    Games.beginRound({
      mode: "quest",
      gameId: "quest",
      label: label,
      difficulty: diffNum,
      questions: normalized,
      onDone: (options && typeof options.onDone === "function") ? options.onDone : null,
      seed: null
    });

    UI.goTo("screen-play");
  },

  beginRound: function(opts) {
    var questions = (opts && Array.isArray(opts.questions)) ? opts.questions : [];
    var gameType = (questions[0] && questions[0].gameType) ? questions[0].gameType : null;
    Games.runtime.round = {
      mode: opts.mode || "normal",
      gameId: opts.gameId || null,
      label: opts.label || Games.defaultLabelForGameType(gameType),
      difficulty: opts.difficulty || 2,
      questions: questions,
      idx: 0,
      completed: false,
      lastPickedIndex: null
    };

    Games.runtime.submitted = false;
    Games.runtime.attemptsByQid = {};
    Games.runtime.missesByQid = {};
    Games.runtime.correctTags = {};
    Games.runtime.correctCount = 0;
    Games.runtime.totalCount = questions.length;
    Games.runtime.mode = opts.mode || "normal";
    Games.runtime.onDone = opts.onDone || null;
    Games.runtime.seed = opts.seed || null;

    Games.runtime._lastRenderedQid = null;
    Games.runtime._optionSetCache = {};
    Games.runtime._posHintWhyStateByQid = {};

    Games._clearCompletionUI();
    Games._saveSessionToState();
    Games.render();
  },

  selectQuestions: function(pool, gameType, difficulty, count, deterministic, seed) {
    if (!Array.isArray(pool)) pool = [];
    var d = Math.max(1, Math.min(3, difficulty | 0));
    var out = [];

    // Filter by difficulty for tapWord based on token count
    var filtered = pool.slice();
    if (gameType === "tapWord") {
      filtered = pool.filter(function(q) {
        if (!q || !Array.isArray(q.tokens)) return false;
        if (d === 1) return q.tokens.length <= 5;
        if (d === 2) return q.tokens.length <= 8;
        return true;
      });
      if (!filtered.length) filtered = pool.slice();
    }

    var rng = deterministic ? Games._seededRng(seed || 1) : Math.random;
    var copy = filtered.slice();
    // Fisher-Yates shuffle
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }

    var n = Math.max(1, count | 0);
    for (var k = 0; k < copy.length && out.length < n; k++) out.push(copy[k]);
    if (!out.length) out = pool.slice(0, Math.min(pool.length, n));
    return out;
  },

  _seededRng: function(seedInt) {
    var x = (seedInt | 0) || 1;
    return function() {
      // LCG
      x = (x * 1664525 + 1013904223) | 0;
      var u = (x >>> 0) / 4294967296;
      return u;
    };
  },

  defaultLabelForGameType: function(gameType) {
    if (gameType === "tapWord") return "Game 1: Tap the Word";
    if (gameType === "pos") return "Game 2: Part of Speech";
    if (gameType === "tense") return "Game 3: Tense Detective";
    if (gameType === "sentenceCheck") return "Game 4: Sentence Check";
    if (gameType === "convoReply") return "Game 5: Conversation Coach";
    return "Game";
  },

  // ===== Renderers =====
  render: function() {
    var r = Games.runtime.round;
    if (!r) {
      Games.backToPlayMenu();
      return;
    }

    // Ensure round-only panels are visible
    var activePanel = document.getElementById("playActivePanel");
    if (activePanel) {
      activePanel.classList.remove("is-hidden");
      activePanel.setAttribute("aria-hidden", "false");
    }
    var roundPanel = document.getElementById("playRound");
    if (roundPanel) {
      roundPanel.classList.remove("is-hidden");
      roundPanel.setAttribute("aria-hidden", "false");
    }
    var completeWrap = document.getElementById("playCompletePanel");
    if (completeWrap) {
      completeWrap.classList.remove("is-hidden");
      completeWrap.setAttribute("aria-hidden", "false");
    }

    Games.updateDifficultyButton();

    var labelEl = document.getElementById("play-game-label");
    var diffEl = document.getElementById("play-difficulty-tag");
    var trackLabelEl = document.getElementById("play-track-label");
    var goalEl = document.getElementById("play-goal-line");
    var exEl = document.getElementById("play-example-line");
    var qTextEl = document.getElementById("play-question-text");
    var optionsEl = document.getElementById("play-options");
    var nextRow = document.getElementById("play-next-row");
    var nextBtn = document.getElementById("btn-play-next");

    if (labelEl) labelEl.textContent = r.label;
    if (diffEl) diffEl.textContent = Games._difficultyLabel(r.difficulty);

    // Completion?
    if (r.completed || r.idx >= r.questions.length) {
      Games.showCompletionPanel();
      return;
    }

    var q = r.questions[r.idx];
    if (!q || typeof q !== "object") {
      r.completed = true;
      Games.showCompletionPanel();
      return;
    }

    // Track when a new question becomes active (for per-question UI reset).
    var qidForUi = q.qid || ("Q_" + String(r.idx));
    if (Games.runtime._lastRenderedQid !== qidForUi) {
      Games.runtime._lastRenderedQid = qidForUi;
      if (q.gameType === "pos") {
        Games.runtime._posHintWhyStateByQid[qidForUi] = { hintOpen: false, whyOpen: false };
      }
    }

    // Reset UI blocks
    Games._hideCompletionPanel();
    if (optionsEl) {
      optionsEl.innerHTML = "";
      // Ensure tapWord-only layout classes do not affect other game types
      optionsEl.classList.remove("g1-sentence");
    }
    Games.renderFeedback(null);

    // Game 3: ensure + reset injected UI blocks (How-to / Progress / Why panel)
    Games._resetGame3RoundUi(q, r);

    Games.disableNext();
    if (nextBtn) nextBtn.textContent = (r.idx + 1 >= r.questions.length) ? "Finish" : "Next →";
    Games.runtime.submitted = false;

    // Goal + example
    var punjabiOn = Games.isPunjabiOn();
    if (goalEl) goalEl.textContent = punjabiOn && q.goalPa ? (q.goalEn + " / " + q.goalPa) : q.goalEn;
    if (exEl) exEl.textContent = punjabiOn && q.examplePa ? (q.exampleEn + " / " + q.examplePa) : q.exampleEn;

    // Track label
    var tn = (typeof TRACKS !== "undefined" && TRACKS && TRACKS[q.trackId]) ? TRACKS[q.trackId].name : "";
    if (trackLabelEl) trackLabelEl.textContent = tn ? ("Track: " + tn) : ("Track: " + String(q.trackId || ""));

    // Prompt (supports either promptEn/promptPa or prompt:{en,pa})
    if (qTextEl) {
      var promptEn = q.promptEn || "";
      var promptPa = q.promptPa || "";
      try {
        if (q.prompt && typeof q.prompt === "object") {
          if (!promptEn && q.prompt.en) promptEn = String(q.prompt.en || "");
          if (!promptPa && q.prompt.pa) promptPa = String(q.prompt.pa || "");
        }
      } catch (e) {}

      if (punjabiOn && promptPa) {
        qTextEl.innerHTML = "";
        var en = document.createElement("div");
        en.textContent = promptEn || "";
        qTextEl.appendChild(en);
        var pa = document.createElement("div");
        pa.setAttribute("lang", "pa");
        pa.textContent = promptPa;
        qTextEl.appendChild(pa);
      } else {
        qTextEl.textContent = promptEn || "";
      }
    }

    // Render options per game type
    if (!optionsEl) return;

    if (q.gameType === "tapWord") {
      Games._renderTapWordQuestion(q, optionsEl);
    } else if (q.gameType === "pos") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "tense") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "sentenceCheck") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "convoReply") {
      Games._renderChoiceQuestion(q, optionsEl);
    }

    // Game 2 only: show Hint/Why toggles (injected above feedback)
    Games._renderPosHintWhy(q);

    Games.updateScoreUI();
    Games._saveSessionToState();
  },

  _ensureGame3RoundUi: function() {
    var anchor = document.getElementById("play-track-label");
    if (!anchor || !anchor.parentNode) return null;

    var wrap = document.getElementById("g3-ui-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "g3-ui-wrap";
      // Insert directly under the title row (before Track label)
      anchor.parentNode.insertBefore(wrap, anchor);
    }

    function ensureEl(id, tag, className) {
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement(tag);
        el.id = id;
        if (className) el.className = className;
        wrap.appendChild(el);
      }
      return el;
    }

    var howto = ensureEl("g3-howto", "div", "section-subtitle");
    var progress = ensureEl("g3-progress", "div", "section-subtitle");
    var feedback = ensureEl("g3-feedback", "div", "feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("aria-atomic", "true");

    var btnRow = ensureEl("g3-why-row", "div", "button-row");
    var whyBtn = document.getElementById("g3-why-toggle");
    if (!whyBtn) {
      whyBtn = document.createElement("button");
      whyBtn.type = "button";
      whyBtn.id = "g3-why-toggle";
      whyBtn.className = "btn btn-secondary btn-small";
      whyBtn.setAttribute("aria-controls", "g3-explanation");
      whyBtn.setAttribute("aria-expanded", "false");
      whyBtn.innerHTML = '<span class="btn-label-en">Why?</span><span class="btn-label-pa" lang="pa">ਕਿਉਂ?</span>';
      btnRow.appendChild(whyBtn);
    }

    var exp = ensureEl("g3-explanation", "div", "section-subtitle");
    exp.setAttribute("role", "region");

    // Bind once
    try {
      if (!(whyBtn.dataset && whyBtn.dataset.bound)) {
        whyBtn.dataset.bound = "1";
        whyBtn.addEventListener("click", function() {
          var panel = document.getElementById("g3-explanation");
          if (!panel) return;
          var open = !(panel.dataset && panel.dataset.open === "1");
          Games._setGame3ExplanationOpen(open);
        });
      }
    } catch (e) {}

    return { wrap: wrap, howto: howto, progress: progress, feedback: feedback, whyBtn: whyBtn, exp: exp };
  },

  _setGame3ExplanationOpen: function(isOpen) {
    var panel = document.getElementById("g3-explanation");
    var btn = document.getElementById("g3-why-toggle");
    if (panel) {
      panel.dataset.open = isOpen ? "1" : "0";
      panel.style.display = isOpen ? "block" : "none";
    }
    if (btn) {
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  },

  _resetGame3RoundUi: function(q, r) {
    var fb = document.getElementById("play-feedback");
    var isTense = !!(q && q.gameType === "tense");

    // Show default play-feedback for non-tense games.
    if (fb) fb.style.display = isTense ? "none" : "";

    // If not a tense question, also hide the injected wrapper if present.
    var wrap = document.getElementById("g3-ui-wrap");
    if (!isTense) {
      if (wrap) wrap.style.display = "none";
      return;
    }

    var ui = Games._ensureGame3RoundUi();
    if (!ui) return;
    ui.wrap.style.display = "block";

    var punjabiOn = Games.isPunjabiOn();
    var idx = (r && typeof r.idx === "number") ? r.idx : 0;
    var total = (r && Array.isArray(r.questions)) ? r.questions.length : 10;

    // How-to: first 2 questions only.
    if (idx < 2) {
      ui.howto.style.display = "block";
      ui.howto.textContent = punjabiOn ? (Games.GAME3_UI.howtoEn + " / " + Games.GAME3_UI.howtoPa) : Games.GAME3_UI.howtoEn;
    } else {
      ui.howto.textContent = "";
      ui.howto.style.display = "none";
    }

    // Progress: always visible.
    ui.progress.style.display = "block";
    ui.progress.textContent = punjabiOn
      ? (Games.GAME3_UI.progressEn(idx + 1, total) + " / " + Games.GAME3_UI.progressPa(idx + 1, total))
      : Games.GAME3_UI.progressEn(idx + 1, total);

    // Clear feedback + hide Why/explanation until answered.
    ui.feedback.innerHTML = "";
    ui.whyBtn.style.display = "none";
    ui.exp.textContent = "";
    Games._setGame3ExplanationOpen(false);
  },

  _renderTapWordQuestion: function(q, optionsEl) {
    optionsEl.classList.add("g1-sentence");
    var tokens = Array.isArray(q.tokens) ? q.tokens : [];
    for (var i = 0; i < tokens.length; i++) {
      (function(idx) {
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary g1-token";
        btn.type = "button";
        btn.textContent = String(tokens[idx]);
        btn.addEventListener("click", function() {
          Games.submitChoice(idx);
        });
        optionsEl.appendChild(btn);
      })(i);
    }
  },

  _buildOptionSetForDifficulty: function(q) {
    // For pos/tense, reduce option count based on difficulty.
    if (q && (q.gameType === "pos" || q.gameType === "tense") && Array.isArray(q._difficultyAllIds)) {
      var allIds = q._difficultyAllIds;
      var allLabels = q._difficultyAllLabels;
      var allLabelsPa = Array.isArray(q._difficultyAllLabelsPa) ? q._difficultyAllLabelsPa : null;
      var keepCount = q._difficultyKeepCount || allIds.length;
      keepCount = Math.max(3, Math.min(allIds.length, keepCount));

      var correctId = (q.correctIndex >= 0 && q.correctIndex < allIds.length) ? allIds[q.correctIndex] : null;

      // Cache stable option subsets per question in normal mode (prevents reshuffle on re-render).
      // Keep logic deterministic in quest mode.
      var qid = q.qid || "";
      var cacheKey = null;
      if (q.gameType === "pos" || q.gameType === "tense") {
        cacheKey = String(qid) + ":" + String(keepCount);
        var cached = Games.runtime && Games.runtime._optionSetCache ? Games.runtime._optionSetCache[cacheKey] : null;
        if (cached && Array.isArray(cached.optionIds) && Array.isArray(cached.optionLabels)) {
          return cached;
        }
      }

      // Deterministic in quest mode, random (but cached) in normal
      var rng = (Games.runtime.mode === "quest")
        ? Games._seededRng(hashStringToInt((qid || "") + ":" + String(keepCount)))
        : Math.random;

      var distractorIds = allIds.filter(function(id) { return id !== correctId; });
      // shuffle
      for (var i = distractorIds.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = distractorIds[i];
        distractorIds[i] = distractorIds[j];
        distractorIds[j] = tmp;
      }

      var chosenIds = [];
      if (correctId != null) chosenIds.push(correctId);
      for (var k = 0; k < distractorIds.length && chosenIds.length < keepCount; k++) {
        chosenIds.push(distractorIds[k]);
      }

      // shuffle final
      for (var a = chosenIds.length - 1; a > 0; a--) {
        var b = Math.floor(rng() * (a + 1));
        var t2 = chosenIds[a];
        chosenIds[a] = chosenIds[b];
        chosenIds[b] = t2;
      }

      var opts = chosenIds.map(function(id) {
        var idx = allIds.indexOf(id);
        return { id: id, label: allLabels[idx], labelPa: allLabelsPa ? (allLabelsPa[idx] || "") : "" };
      });

      var built = {
        optionIds: opts.map(function(o) { return o.id; }),
        optionLabels: opts.map(function(o) { return o.label; }),
        optionLabelsPa: opts.map(function(o) { return o.labelPa; }),
        correctIndex: chosenIds.indexOf(correctId)
      };

      if ((q.gameType === "pos" || q.gameType === "tense") && cacheKey && Games.runtime && Games.runtime._optionSetCache) {
        Games.runtime._optionSetCache[cacheKey] = built;
      }

      return built;
    }

    // sentenceCheck (and other simple choice games) use optionsEn
    if (q && Array.isArray(q.optionsEn) && typeof q.correctIndex === "number") {
      var labelsEn = [];
      var labelsPa = null;

      // Allow optionsEn to be either strings OR bilingual objects {en,pa}.
      if (q.optionsEn.length && q.optionsEn[0] && typeof q.optionsEn[0] === "object") {
        labelsEn = q.optionsEn.map(function(o) { return (o && o.en != null) ? String(o.en || "") : ""; });
        labelsPa = q.optionsEn.map(function(o) { return (o && o.pa != null) ? String(o.pa || "") : ""; });
      } else {
        labelsEn = q.optionsEn.map(function(s) { return String(s || ""); });
      }

      // If explicit optionsPa exists, prefer it (supports partial Punjabi arrays).
      if (Array.isArray(q.optionsPa)) {
        labelsPa = labelsEn.map(function(_, i) {
          return (q.optionsPa && q.optionsPa[i] != null) ? String(q.optionsPa[i] || "") : "";
        });
      }

      return {
        optionIds: labelsEn.map(function(_, i) { return String(i); }),
        optionLabels: labelsEn.slice(),
        optionLabelsPa: labelsPa,
        correctIndex: q.correctIndex
      };
    }

    return { optionIds: [], optionLabels: [], optionLabelsPa: null, correctIndex: -1 };
  },

  _renderChoiceQuestion: function(q, optionsEl) {
    // Apply difficulty config
    Games.applyDifficultyToQuestion(q, Games.runtime.round ? Games.runtime.round.difficulty : 2);
    var set = Games._buildOptionSetForDifficulty(q);

    // Store the effective correctIndex for this render
    q._effectiveOptionIds = set.optionIds;
    q._effectiveCorrectIndex = set.correctIndex;
    q._effectiveOptionSet = set;

    var punjabiOn = Games.isPunjabiOn();

    for (var i = 0; i < set.optionLabels.length; i++) {
      (function(idx) {
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary";

        var en = String(set.optionLabels[idx] || "");
        var pa = (set.optionLabelsPa && set.optionLabelsPa[idx]) ? String(set.optionLabelsPa[idx]) : "";
        if (punjabiOn && pa) {
          btn.innerHTML = "";
          // Game 2: Punjabi-first labels when Punjabi mode is on.
          if (q && q.gameType === "pos") {
            var paDivFirst = document.createElement("div");
            paDivFirst.setAttribute("lang", "pa");
            paDivFirst.textContent = pa;
            btn.appendChild(paDivFirst);
            var enDivSecond = document.createElement("div");
            enDivSecond.style.opacity = "0.9";
            enDivSecond.textContent = en;
            btn.appendChild(enDivSecond);
          } else if (q && q.gameType === "tense") {
            // Game 3: bilingual label in one line when Punjabi mode is on.
            btn.textContent = en + " (" + pa + ")";
          } else {
            var enDiv = document.createElement("div");
            enDiv.textContent = en;
            btn.appendChild(enDiv);
            var paDiv = document.createElement("div");
            paDiv.setAttribute("lang", "pa");
            paDiv.style.opacity = "0.9";
            paDiv.textContent = pa;
            btn.appendChild(paDiv);
          }
        } else {
          btn.textContent = en;
        }

        btn.addEventListener("click", function() {
          Games.submitChoice(idx);
        });
        optionsEl.appendChild(btn);
      })(i);
    }
  },

  // ===== Submission / Feedback =====
  submitChoice: function(choiceIndex) {
    var r = Games.runtime.round;
    if (!r || r.completed) return;
    var q = r.questions[r.idx];
    if (!q) return;

    // Guard: if question already completed (Next enabled), ignore.
    var nextBtn = document.getElementById("btn-play-next");
    if (nextBtn && !nextBtn.disabled) return;

    var qid = q.qid;
    if (!qid) qid = "Q_" + String(r.idx);
    if (typeof Games.runtime.attemptsByQid[qid] !== "number") Games.runtime.attemptsByQid[qid] = 0;
    var attemptIndex = Games.runtime.attemptsByQid[qid] | 0;
    Games.runtime.attemptsByQid[qid] = attemptIndex + 1;

    var isCorrect = false;
    var chosenEn = "";
    var chosenPa = "";
    var correctAnswerEn = "";
    var correctAnswerPa = "";

    if (q.gameType === "tapWord") {
      var tokens = Array.isArray(q.tokens) ? q.tokens : [];
      chosenEn = tokens[choiceIndex] != null ? String(tokens[choiceIndex]) : "";
      correctAnswerEn = (q.correctTokenIndex != null && tokens[q.correctTokenIndex] != null) ? String(tokens[q.correctTokenIndex]) : "";
      // No per-token Punjabi available; avoid blanks by falling back to English token.
      chosenPa = chosenEn;
      correctAnswerPa = correctAnswerEn;
      isCorrect = (choiceIndex === q.correctTokenIndex);

      // Token-local feedback (UI-only): mark just the clicked token as correct/wrong.
      // Keep this independent of scoring/flow.
      try {
        var optionsEl = document.getElementById("play-options");
        if (optionsEl) {
          var btns = optionsEl.querySelectorAll("button");
          for (var bi = 0; bi < btns.length; bi++) {
            btns[bi].classList.remove("is-correct", "is-wrong");
          }
          if (btns && btns[choiceIndex]) {
            btns[choiceIndex].classList.add(isCorrect ? "is-correct" : "is-wrong");
          }

          // Auto-clear the wrong flash after a short delay
          if (!isCorrect) {
            if (Games.runtime._tapWordFlashTimer) {
              clearTimeout(Games.runtime._tapWordFlashTimer);
            }
            Games.runtime._tapWordFlashTimer = setTimeout(function() {
              try {
                var btns2 = optionsEl.querySelectorAll("button");
                if (btns2 && btns2[choiceIndex]) btns2[choiceIndex].classList.remove("is-wrong");
              } catch (e) {}
            }, 550);
          }
        }
      } catch (e) {}
    } else {
      // IMPORTANT: Use the same option set that was rendered.
      var set = q._effectiveOptionSet || Games._buildOptionSetForDifficulty(q);
      chosenEn = set.optionLabels[choiceIndex] != null ? String(set.optionLabels[choiceIndex]) : "";
      correctAnswerEn = set.optionLabels[set.correctIndex] != null ? String(set.optionLabels[set.correctIndex]) : "";
      chosenPa = (set.optionLabelsPa && set.optionLabelsPa[choiceIndex] != null) ? String(set.optionLabelsPa[choiceIndex]) : chosenEn;
      correctAnswerPa = (set.optionLabelsPa && set.optionLabelsPa[set.correctIndex] != null) ? String(set.optionLabelsPa[set.correctIndex]) : correctAnswerEn;
      isCorrect = (choiceIndex === set.correctIndex);
    }

    // Record attempt
    if (State && State.recordQuestionAttempt) {
      State.recordQuestionAttempt(q.trackId || "T_WORDS", !!isCorrect);
    }

    // ===== Game 3 (Tense) special UX =====
    // Low-risk learning UX: after any answer, show Why toggle; on wrong show chosen vs correct then auto-open explanation.
    // Keep scoring logic unchanged.
    if (q.gameType === "tense") {
      var ui = Games._ensureGame3RoundUi();
      var punjabiOnG3 = Games.isPunjabiOn();
      if (ui) {
        ui.whyBtn.style.display = "inline-flex";
      }

      if (isCorrect) {
        // Preserve existing correct scoring behavior, but render Game 3 feedback in the injected panel.
        if (!Games.runtime.submitted) {
          Games.runtime.submitted = true;
          var xpG3 = Games._xpEach();
          Games.currentGameScore = (Games.currentGameScore || 0) + xpG3;
          Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
          Games.runtime.correctCount += 1;

          if (State && State.awardXP) {
            State.awardXP(xpG3, { reason: (Games.runtime.mode === "quest") ? "dq_correct_answer" : "game_correct_answer", trackId: q.trackId });
          }

          if (Array.isArray(q.tags) && q.tags.length) {
            for (var tg = 0; tg < q.tags.length; tg++) {
              var tag2 = q.tags[tg];
              if (!Games.runtime.correctTags[tag2]) Games.runtime.correctTags[tag2] = 0;
              Games.runtime.correctTags[tag2] += 1;
            }
          }
        }

        // Render brief correct + keep explanation closed by default.
        try {
          if (ui) {
            ui.feedback.className = "feedback correct";
            ui.feedback.textContent = "Correct! +" + Games._xpEach() + " XP";
            var expText = punjabiOnG3 ? Games._pickActiveExplanationText(q) : Games._pickActiveExplanationText(q);
            ui.exp.textContent = expText || "";
            Games._setGame3ExplanationOpen(false);
          }
        } catch (e) {}

        // Still emit toast for consistency
        Games._showPlayFeedbackToast({
          gameType: q.gameType,
          correct: true,
          correctTextEn: "Correct!",
          correctTextPa: "ਠੀਕ ਹੈ!",
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          explanationEn: "",
          explanationPa: ""
        });

        Games.enableNext();
        Games.updateScoreUI();
        Games._saveSessionToState();
        return;
      }

      // Wrong: single-attempt for tense questions (clear learning loop).
      Games.currentGameStreak = 0;
      Games.runtime.missesByQid[qid] = true;
      Games._markPersistentlyMissed(qid);

      try {
        if (ui) {
          ui.feedback.className = "feedback wrong";
          ui.feedback.textContent = punjabiOnG3
            ? Games.GAME3_UI.wrongComparePa(chosenPa || chosenEn, correctAnswerPa || correctAnswerEn)
            : Games.GAME3_UI.wrongCompareEn(chosenEn, correctAnswerEn);

          // Explanation: active language; auto-open after a short delay.
          ui.exp.textContent = Games._pickActiveExplanationText(q) || "";
          Games._setGame3ExplanationOpen(false);

          if (Games.runtime._g3AutoOpenTimer) clearTimeout(Games.runtime._g3AutoOpenTimer);
          Games.runtime._g3AutoOpenTimer = setTimeout(function() {
            try { Games._setGame3ExplanationOpen(true); } catch (e) {}
          }, 950);
        }
      } catch (e) {}

      // Toast (active language lines are handled by overlay); keep simple.
      Games._showPlayFeedbackToast({
        gameType: q.gameType,
        correct: false,
        showChosen: true,
        showCorrectAnswer: true,
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        explanationEn: Games._pickExplanationBoth(q).en || "",
        explanationPa: Games._pickExplanationBoth(q).pa || ""
      });

      Games.enableNext();
      Games.updateScoreUI();
      Games._saveSessionToState();
      return;
    }

    if (isCorrect) {
      // XP award only once per question
      if (!Games.runtime.submitted) {
        Games.runtime.submitted = true;
        var xp = Games._xpEach();
        Games.currentGameScore = (Games.currentGameScore || 0) + xp;
        Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
        Games.runtime.correctCount += 1;

        if (State && State.awardXP) {
          State.awardXP(xp, { reason: (Games.runtime.mode === "quest") ? "dq_correct_answer" : "game_correct_answer", trackId: q.trackId });
        }

        // Track top tag
        if (Array.isArray(q.tags) && q.tags.length) {
          for (var t = 0; t < q.tags.length; t++) {
            var tag = q.tags[t];
            if (!Games.runtime.correctTags[tag]) Games.runtime.correctTags[tag] = 0;
            Games.runtime.correctTags[tag] += 1;
          }
        }
      }

      var punjabiOn = Games.isPunjabiOn();
      var wasMissedBefore = !!(Games.runtime.missesByQid && Games.runtime.missesByQid[qid]) || Games._wasPersistentlyMissed(qid);
      var expBoth = Games._pickExplanationBoth(q);

      // BOLO v2 adaptive feedback rules:
      // - Attempt 0 correct: brief Correct (no explanation)
      // - Attempt 2+ correct: Correct + explanation
      // - Previously missed + first-try correct: Nice improvement! + explanation
      var correctPayload = {
        gameType: q.gameType,
        correct: true,
        correctTextEn: "Correct!",
        correctTextPa: "ਠੀਕ ਹੈ!",
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        explanationEn: "",
        explanationPa: ""
      };

      if (attemptIndex === 0 && wasMissedBefore) {
        correctPayload.correctTextEn = "Nice improvement!";
        correctPayload.correctTextPa = "ਵਧੀਆ ਸੁਧਾਰ!";
        // Include both languages (toast can show both when Punjabi is on)
        correctPayload.explanationEn = expBoth.en || "";
        correctPayload.explanationPa = expBoth.pa || "";
        Games._clearPersistentlyMissed(qid);
      } else if (attemptIndex >= 1) {
        correctPayload.explanationEn = expBoth.en || "";
        correctPayload.explanationPa = expBoth.pa || "";
      }

      Games.renderFeedback(correctPayload);

      Games.enableNext();
      Games.updateScoreUI();
      Games._saveSessionToState();
      return;
    }

    // Wrong
    Games.currentGameStreak = 0;
    Games.runtime.missesByQid[qid] = true;

    // Persistently mark missed for future "Nice improvement" detection
    Games._markPersistentlyMissed(qid);

    var punjabiOn2 = Games.isPunjabiOn();

    if (attemptIndex === 0) {
      // Attempt 1 wrong: show hint only (active language); Next disabled; do NOT reveal answer
      var hintBoth = Games._pickHintForQuestion(q, chosenEn, correctAnswerEn);
      Games.renderFeedback({
        gameType: q.gameType,
        correct: false,
        showChosen: true,
        showCorrectAnswer: false,
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        // Keep inline feedback as active language only; toast can use both
        hintEn: hintBoth.en || "",
        hintPa: hintBoth.pa || ""
      });
      Games.disableNext();
    } else {
      // Attempt 2+ wrong: show correct answer + explanation (active language), apply Help, enable Next
      Games.applyHelp(q);
      var expBoth2 = Games._pickExplanationBoth(q);
      Games.renderFeedback({
        gameType: q.gameType,
        correct: false,
        showChosen: true,
        showCorrectAnswer: true,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        explanationEn: expBoth2.en || "",
        explanationPa: expBoth2.pa || ""
      });
      Games.enableNext();
    }

    Games.updateScoreUI();
    Games._saveSessionToState();
  },

  _pickHintForQuestion: function(q, chosenText, correctText) {
    var m = Games.MICROCOPY[q.gameType] || {};
    var near = Games.getNearMissTip(q, chosenText, correctText);
    var en = "Try again. " + (near.en || m.wrongCueEn || "");
    var pa = "";
    if (Games.isPunjabiOn()) {
      pa = "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। " + (near.pa || m.wrongCuePa || "");
    }
    // Prefer authored hint
    if (q.hintEn) en = q.hintEn;
    if (Games.isPunjabiOn() && q.hintPa) pa = q.hintPa;
    return { en: en, pa: pa };
  },

  getNearMissTip: function(q, chosenText, correctText) {
    // Minimum: 6 near-miss cases across POS + Tense.
    if (!q) return { en: "", pa: "" };
    var type = q.gameType;

    // For pos/tense we can infer by tag.
    if (type === "pos") {
      var tag = (Array.isArray(q.tags) && q.tags[0]) ? q.tags[0] : "";
      if (tag === "POS:NOUN") return { en: "Noun = person, place, or thing.", pa: "Noun = ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਂ ਚੀਜ਼।" };
      if (tag === "POS:VERB") return { en: "Verb = action word (run, eat, play).", pa: "Verb = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ (run, eat, play)।" };
      if (tag === "POS:ADJECTIVE") return { en: "Adjective describes (big, red, happy).", pa: "Adjective ਵਰਣਨ ਕਰਦਾ ਹੈ (big, red, happy)।" };
      if (tag === "POS:ADVERB") return { en: "Adverb tells how/when (quickly, yesterday).", pa: "Adverb ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ (quickly, yesterday)।" };
      if (tag === "POS:PRONOUN") return { en: "Pronoun replaces a name (he, she, they).", pa: "Pronoun ਨਾਮ ਦੀ ਥਾਂ ਆਉਂਦਾ ਹੈ (he, she, they)।" };
      if (tag === "POS:PREPOSITION") return { en: "Preposition shows place (on, under, in).", pa: "Preposition ਥਾਂ ਦੱਸਦਾ ਹੈ (on, under, in)।" };
    }

    if (type === "tense") {
      var ttag = (Array.isArray(q.tags) && q.tags[0]) ? q.tags[0] : "";
      if (ttag === "TENSE:PAST") return { en: "Past = yesterday/last… (played, walked).", pa: "ਭੂਤਕਾਲ = yesterday/last… (played, walked)।" };
      if (ttag === "TENSE:PRESENT") return { en: "Present = every day/now (walks, reads).", pa: "ਵਰਤਮਾਨ = every day/now (walks, reads)।" };
      if (ttag === "TENSE:FUTURE") return { en: "Future = will… / tomorrow.", pa: "ਭਵਿੱਖ = will… / tomorrow।" };
    }

    return { en: "", pa: "" };
  },

  applyHelp: function(q) {
    var optionsEl = document.getElementById("play-options");
    if (!optionsEl) return false;

    // tapWord: highlight correct token
    if (q.gameType === "tapWord") {
      var buttons = optionsEl.querySelectorAll("button");
      if (!buttons || !buttons.length) return false;
      if (typeof q.correctTokenIndex !== "number") return false;

      // Help behavior without new colors: disable all distractors and emphasize correct
      for (var i = 0; i < buttons.length; i++) {
        if (i === q.correctTokenIndex) continue;
        buttons[i].disabled = true;
      }
      var b = buttons[q.correctTokenIndex];
      if (b) {
        // Do not overwrite className; preserve token styling.
        b.classList.add("is-help");
        b.classList.add("is-correct");
        return true;
      }
      return false;
    }

    // Other games: disable/gray out 1–2 distractors
    var correctIdx = -1;
    if (q.gameType === "pos" || q.gameType === "tense") {
      correctIdx = q._effectiveCorrectIndex;
    } else {
      correctIdx = q.correctIndex;
    }
    if (typeof correctIdx !== "number") return false;

    var btns = optionsEl.querySelectorAll("button");
    if (!btns || btns.length < 3) return false;
    var removed = 0;
    for (var i = 0; i < btns.length; i++) {
      if (i === correctIdx) continue;
      if (removed >= 2) break;
      btns[i].disabled = true;
      removed++;
    }
    return removed > 0;
  },

  renderFeedback: function(payload) {
    var fb = document.getElementById("play-feedback");
    if (!fb) return;

    if (!payload) {
      fb.textContent = "";
      fb.className = "feedback";
      Games._hidePlayFeedbackToast();
      return;
    }

    var punjabiOn = Games.isPunjabiOn();
    fb.innerHTML = "";
    fb.className = "feedback " + (payload.correct ? "correct" : "wrong");

    function addLine(text, lang) {
      if (!text) return;
      var div = document.createElement("div");
      if (lang) div.setAttribute("lang", lang);
      div.textContent = text;
      fb.appendChild(div);
    }

    if (payload.correct) {
      addLine((payload.correctTextEn || "Correct!") + " +" + Games._xpEach() + " XP", null);
      if (punjabiOn && payload.correctTextPa) addLine(payload.correctTextPa, "pa");
      // Game 2: richer correct feedback (also show the answer)
      if (payload.gameType === "pos" && payload.correctAnswerEn) {
        addLine("Answer: " + payload.correctAnswerEn, null);
        if (punjabiOn) addLine("ਜਵਾਬ: " + (payload.correctAnswerPa || payload.correctAnswerEn), "pa");
      }
    } else {
      var showChosen = (payload.showChosen !== false);
      var showCorrect = (payload.showCorrectAnswer !== false);
      if (showChosen && payload.chosenEn) {
        addLine("You picked: " + payload.chosenEn, null);
        if (punjabiOn) addLine("ਤੁਸੀਂ ਚੁਣਿਆ: " + (payload.chosenPa || payload.chosenEn), "pa");
      }
      if (showCorrect && payload.correctAnswerEn) {
        addLine("Correct answer: " + payload.correctAnswerEn, null);
        if (punjabiOn) addLine("ਸਹੀ ਜਵਾਬ: " + (payload.correctAnswerPa || payload.correctAnswerEn), "pa");
      }
    }

    // Hint/explanation: active language only (no blank lines)
    var hint = punjabiOn ? (payload.hintPa || "") : (payload.hintEn || "");
    var exp = punjabiOn ? (payload.explanationPa || "") : (payload.explanationEn || "");
    if (hint) addLine(hint, punjabiOn ? "pa" : null);
    if (exp) addLine(exp, punjabiOn ? "pa" : null);

    Games._showPlayFeedbackToast(payload);
  },

  _pickHintPreviewBoth: function(q) {
    // For pre-answer hint toggle: prefer authored hint, else near-miss tip, else microcopy.
    if (!q) return { en: "", pa: "" };
    var m = Games.MICROCOPY[q.gameType] || {};
    var near = Games.getNearMissTip(q, "", "");
    var en = String((q.hintEn || "") || (near.en || "") || (m.wrongCueEn || "") || "").trim();
    var pa = String((q.hintPa || "") || (near.pa || "") || (m.wrongCuePa || "") || "").trim();
    return { en: en, pa: pa };
  },

  _renderPosHintWhy: function(q) {
    // Low-risk UI injection: show Hint/Why toggles only for Game 2 (pos).
    var fb = document.getElementById("play-feedback");
    if (!fb) return;

    var row = document.getElementById("play-pos-hintwhy-row");
    var panel = document.getElementById("play-pos-hintwhy-panel");

    function ensure() {
      if (!row) {
        row = document.createElement("div");
        row.id = "play-pos-hintwhy-row";
        row.className = "button-row";
        fb.parentNode.insertBefore(row, fb);
      }
      if (!panel) {
        panel = document.createElement("div");
        panel.id = "play-pos-hintwhy-panel";
        panel.className = "section-subtitle";
        fb.parentNode.insertBefore(panel, fb);
      }

      // Build buttons once
      try {
        if (!(row.dataset && row.dataset.bound)) {
          row.dataset.bound = "1";
          row.innerHTML = "";

          var hintBtn = document.createElement("button");
          hintBtn.type = "button";
          hintBtn.className = "btn btn-secondary btn-small";
          hintBtn.id = "btn-play-pos-hint";
          hintBtn.innerHTML = '<span class="btn-label-en">Hint</span><span class="btn-label-pa" lang="pa">ਸੰਕੇਤ</span>';

          var whyBtn = document.createElement("button");
          whyBtn.type = "button";
          whyBtn.className = "btn btn-secondary btn-small";
          whyBtn.id = "btn-play-pos-why";
          whyBtn.innerHTML = '<span class="btn-label-en">Why?</span><span class="btn-label-pa" lang="pa">ਕਿਉਂ?</span>';

          hintBtn.addEventListener("click", function() {
            var r = Games.runtime.round;
            if (!r || r.completed) return;
            var q2 = r.questions[r.idx];
            if (!q2 || q2.gameType !== "pos") return;
            var qid2 = q2.qid || ("Q_" + String(r.idx));
            var st = Games.runtime._posHintWhyStateByQid[qid2] || { hintOpen: false, whyOpen: false };
            st.hintOpen = !st.hintOpen;
            Games.runtime._posHintWhyStateByQid[qid2] = st;
            Games._renderPosHintWhy(q2);
          });

          whyBtn.addEventListener("click", function() {
            var r = Games.runtime.round;
            if (!r || r.completed) return;
            var q2 = r.questions[r.idx];
            if (!q2 || q2.gameType !== "pos") return;
            var qid2 = q2.qid || ("Q_" + String(r.idx));
            var st = Games.runtime._posHintWhyStateByQid[qid2] || { hintOpen: false, whyOpen: false };
            st.whyOpen = !st.whyOpen;
            Games.runtime._posHintWhyStateByQid[qid2] = st;
            Games._renderPosHintWhy(q2);
          });

          row.appendChild(hintBtn);
          row.appendChild(whyBtn);
        }
      } catch (e) {}
    }

    // Hide for non-pos questions
    if (!q || q.gameType !== "pos") {
      if (row) row.style.display = "none";
      if (panel) panel.style.display = "none";
      return;
    }

    ensure();

    // Update enabled/disabled + content
    var qid = q.qid || ("Q_" + String((Games.runtime.round && typeof Games.runtime.round.idx === "number") ? Games.runtime.round.idx : 0));
    var st2 = Games.runtime._posHintWhyStateByQid[qid] || { hintOpen: false, whyOpen: false };
    Games.runtime._posHintWhyStateByQid[qid] = st2;

    var hintBoth = Games._pickHintPreviewBoth(q);
    var expBoth = Games._pickExplanationBoth(q);
    var hasHint = !!(hintBoth.en || hintBoth.pa);
    var hasWhy = !!(expBoth.en || expBoth.pa);

    var hintBtnEl = document.getElementById("btn-play-pos-hint");
    var whyBtnEl = document.getElementById("btn-play-pos-why");
    if (hintBtnEl) hintBtnEl.disabled = !hasHint;
    if (whyBtnEl) whyBtnEl.disabled = !hasWhy;

    var punjabiOn = Games.isPunjabiOn();
    row.style.display = (hasHint || hasWhy) ? "flex" : "none";

    panel.innerHTML = "";
    panel.style.display = (st2.hintOpen && hasHint) || (st2.whyOpen && hasWhy) ? "block" : "none";
    if (panel.style.display === "none") return;

    function addBlock(titleEn, titlePa, body) {
      if (!body) return;
      var wrap = document.createElement("div");
      var title = document.createElement("div");
      title.className = "section-subtitle";
      title.textContent = titleEn;
      wrap.appendChild(title);
      if (punjabiOn && titlePa) {
        var title2 = document.createElement("div");
        title2.className = "section-subtitle";
        title2.setAttribute("lang", "pa");
        title2.textContent = titlePa;
        wrap.appendChild(title2);
      }

      var enLine = String(body.en || "").trim();
      var paLine = String(body.pa || "").trim();
      if (enLine) {
        var enDiv = document.createElement("div");
        enDiv.textContent = enLine;
        wrap.appendChild(enDiv);
      }
      if (punjabiOn && paLine) {
        var paDiv = document.createElement("div");
        paDiv.setAttribute("lang", "pa");
        paDiv.textContent = paLine;
        wrap.appendChild(paDiv);
      }
      panel.appendChild(wrap);
    }

    if (st2.hintOpen && hasHint) addBlock("Hint", "ਸੰਕੇਤ", hintBoth);
    if (st2.whyOpen && hasWhy) addBlock("Why?", "ਕਿਉਂ?", expBoth);
  },

  _toastTimer: null,

  _hidePlayFeedbackToast: function() {
    var overlay = document.getElementById("play-feedback-overlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    if (Games._toastTimer) {
      clearTimeout(Games._toastTimer);
      Games._toastTimer = null;
    }
  },

  _showPlayFeedbackToast: function(payload) {
    var overlay = document.getElementById("play-feedback-overlay");
    var card = document.getElementById("play-feedback-overlay-card");
    var statusEl = document.getElementById("play-feedback-overlay-status");
    var statusPaEl = document.getElementById("play-feedback-overlay-status-pa");
    var bodyEl = document.getElementById("play-feedback-overlay-body");
    if (!overlay || !card || !statusEl || !bodyEl) return;

    if (Games._toastTimer) {
      clearTimeout(Games._toastTimer);
      Games._toastTimer = null;
    }

    var punjabiOn = Games.isPunjabiOn();

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    card.className = "overlay-card " + (payload.correct ? "correct" : "wrong");

    // Status line
    if (payload.correct) {
      statusEl.textContent = (payload.correctTextEn || "Correct!") + " +" + Games._xpEach() + " XP";
      if (statusPaEl) {
        if (punjabiOn && payload.correctTextPa) {
          statusPaEl.style.display = "block";
          statusPaEl.textContent = payload.correctTextPa;
        } else {
          statusPaEl.style.display = "none";
          statusPaEl.textContent = "";
        }
      }
    } else {
      // Keep wrong status short/kid-friendly
      var wrongTitle = (payload.showCorrectAnswer === true) ? "Let’s learn" : "Try again";
      statusEl.textContent = wrongTitle;
      if (statusPaEl) {
        if (punjabiOn) {
          statusPaEl.style.display = "block";
          statusPaEl.textContent = (payload.showCorrectAnswer === true) ? "ਆਓ ਸਿੱਖੀਏ" : "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ";
        } else {
          statusPaEl.style.display = "none";
          statusPaEl.textContent = "";
        }
      }
    }

    // Body lines (chosen/correct/hint/explanation)
    bodyEl.innerHTML = "";
    function addBodyLine(text, lang) {
      if (!text) return;
      var div = document.createElement("div");
      div.className = "overlay-line" + (lang === "pa" ? " overlay-pa" : "");
      if (lang) div.setAttribute("lang", lang);
      div.textContent = text;
      bodyEl.appendChild(div);
    }

    if (!payload.correct) {
      if (payload.showChosen !== false && payload.chosenEn) {
        addBodyLine("You picked: " + payload.chosenEn, null);
        if (punjabiOn) addBodyLine("ਤੁਸੀਂ ਚੁਣਿਆ: " + (payload.chosenPa || payload.chosenEn), "pa");
      }
      if (payload.showCorrectAnswer !== false && payload.correctAnswerEn) {
        addBodyLine("Correct answer: " + payload.correctAnswerEn, null);
        if (punjabiOn) addBodyLine("ਸਹੀ ਜਵਾਬ: " + (payload.correctAnswerPa || payload.correctAnswerEn), "pa");
      }
    }

    // Prefer showing English; add Punjabi below when Punjabi mode is on.
    var hintEn = String(payload.hintEn || "").trim();
    var hintPa = String(payload.hintPa || "").trim();
    var expEn = String(payload.explanationEn || "").trim();
    var expPa = String(payload.explanationPa || "").trim();

    if (hintEn) addBodyLine(hintEn, null);
    if (punjabiOn && hintPa) addBodyLine(hintPa, "pa");

    if (expEn) addBodyLine(expEn, null);
    if (punjabiOn && expPa) addBodyLine(expPa, "pa");

    // Tap to dismiss
    try {
      if (!(card.dataset && card.dataset.toastBound)) {
        card.dataset.toastBound = "1";
        card.addEventListener("click", function() {
          Games._hidePlayFeedbackToast();
        });
      }
    } catch (e) {}

    // Auto-hide after a short time
    var ms = payload.correct ? 1400 : ((payload.showCorrectAnswer === true) ? 2600 : 2000);
    Games._toastTimer = setTimeout(function() {
      Games._hidePlayFeedbackToast();
    }, ms);
  },

  enableNext: function() {
    var row = document.getElementById("play-next-row");
    var btn = document.getElementById("btn-play-next");
    if (row) {
      row.classList.remove("is-hidden");
      row.style.display = "flex";
    }
    if (btn) btn.disabled = false;
  },

  disableNext: function() {
    var row = document.getElementById("play-next-row");
    var btn = document.getElementById("btn-play-next");
    if (row) {
      row.classList.add("is-hidden");
      row.style.display = "none";
    }
    if (btn) btn.disabled = true;
  },

  next: function() {
    var r = Games.runtime.round;
    if (!r || r.completed) return;

    // Interleaved review: after every 3 correct, swap next question with a missed one.
    if (Games.runtime.mode === "normal" && Games.runtime.correctCount > 0 && (Games.runtime.correctCount % 3 === 0)) {
      Games._maybeInsertReviewQuestion();
    }

    r.idx += 1;
    if (r.idx >= r.questions.length) {
      r.completed = true;
      Games._clearSessionInState();
    }

    Games.runtime.submitted = false;
    Games.render();
  },

  _maybeInsertReviewQuestion: function() {
    var r = Games.runtime.round;
    if (!r) return;
    var idx = r.idx;
    var missedQids = Object.keys(Games.runtime.missesByQid || {});
    if (!missedQids.length) return;

    // Find a missed question later in the list and swap with next.
    var nextPos = idx + 1;
    if (nextPos >= r.questions.length) return;

    for (var mi = 0; mi < missedQids.length; mi++) {
      var qid = missedQids[mi];
      for (var j = nextPos + 1; j < r.questions.length; j++) {
        if (r.questions[j] && r.questions[j].qid === qid) {
          var tmp = r.questions[nextPos];
          r.questions[nextPos] = r.questions[j];
          r.questions[j] = tmp;
          return;
        }
      }
    }
  },

  // ===== Completion panel =====
  showCompletionPanel: function() {
    var r = Games.runtime.round;
    if (!r) return;
    r.completed = true;

    Games._hideQuestionUI();

    var panel = document.getElementById("play-complete-panel");
    if (panel) panel.style.display = "block";

    var scoreEl = document.getElementById("play-complete-score");
    if (scoreEl) scoreEl.textContent = "Score: " + Games.runtime.correctCount + "/" + Games.runtime.totalCount;

    // Best score: compute from stored XP if available
    var bestEl = document.getElementById("play-complete-best");
    var bestXP = Games.currentGameBest || 0;
    var bestCorrect = Math.floor(bestXP / Games._xpEach());
    if (bestEl) bestEl.textContent = "Best: " + bestCorrect + "/" + Games.runtime.totalCount;

    var praiseEl = document.getElementById("play-complete-praise");
    var skillEl = document.getElementById("play-complete-skill");

    var punjabiOn = Games.isPunjabiOn();
    if (praiseEl) praiseEl.textContent = punjabiOn ? "Nice work! / ਵਧੀਆ!" : "Nice work!";
    if (skillEl) {
      var line = Games._buildImprovedAtLine();
      skillEl.textContent = punjabiOn && line.pa ? (line.en + " / " + line.pa) : line.en;
    }

    // Continue Quest button only in quest mode
    var btnCQ = document.getElementById("btn-play-continue-quest");
    if (btnCQ) {
      btnCQ.style.display = (Games.runtime.mode === "quest") ? "inline-block" : "none";
    }

    Games.disableNext();
    Games.updateScoreUI();
  },

  _buildImprovedAtLine: function() {
    var tags = Games.runtime.correctTags || {};
    var topTag = null;
    var topCount = 0;
    for (var k in tags) {
      if (!tags.hasOwnProperty(k)) continue;
      if (tags[k] > topCount) {
        topTag = k;
        topCount = tags[k];
      }
    }
    if (!topTag) return { en: "You improved at: Practice", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਅਭਿਆਸ" };
    if (topTag.indexOf("POS:") === 0) return { en: "You improved at: Word Types", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਸ਼ਬਦ ਦੀਆਂ ਕਿਸਮਾਂ" };
    if (topTag.indexOf("TENSE:") === 0) return { en: "You improved at: Tense", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਕਾਲ" };
    if (topTag.indexOf("SENTENCE:") === 0) return { en: "You improved at: Sentences", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਵਾਕ" };
    return { en: "You improved at: Practice", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਅਭਿਆਸ" };
  },

  _hideQuestionUI: function() {
    var optionsEl = document.getElementById("play-options");
    if (optionsEl) optionsEl.innerHTML = "";
    var qTextEl = document.getElementById("play-question-text");
    if (qTextEl) qTextEl.textContent = "";
    Games.renderFeedback(null);
  },

  _hideCompletionPanel: function() {
    var panel = document.getElementById("play-complete-panel");
    if (panel) panel.style.display = "none";
  },

  _clearCompletionUI: function() {
    Games._hideCompletionPanel();
    Games.disableNext();
  },

  playAgain: function() {
    var r = Games.runtime.round;
    if (!r) return;

    var mode = Games.runtime.mode;
    var gameId = r.gameId;
    var label = r.label;
    var difficulty = r.difficulty;
    var questions = r.questions;

    // Restart with the same question list (quest) or reselect (normal)
    if (mode === "normal") {
      var gameNum = Games.currentGameType || 1;
      var pool = Games.buildPoolForGameNum(gameNum);
      var selected = Games.selectQuestions(pool, Games._mapGameNumToType(gameNum), difficulty, 10, false, null);
      questions = selected;
    }

    Games.beginRound({ mode: mode, gameId: gameId, label: label, difficulty: difficulty, questions: questions, onDone: Games.runtime.onDone, seed: Games.runtime.seed });
  },

  backToPlayMenu: function() {
    Games.runtime.round = null;
    Games.runtime.submitted = false;
    Games.runtime.attemptsByQid = {};
    Games.runtime.missesByQid = {};
    Games.runtime.correctTags = {};
    Games.runtime.correctCount = 0;
    Games.runtime.totalCount = 0;
    Games.runtime.onDone = null;
    Games.runtime.mode = "normal";
    Games._clearSessionInState();

    Games._hideQuestionUI();
    Games._hideCompletionPanel();
    Games.updateScoreUI();

    // Hide round containers (round-only screen)
    var activePanel = document.getElementById("playActivePanel");
    if (activePanel) {
      activePanel.classList.add("is-hidden");
      activePanel.setAttribute("aria-hidden", "true");
    }
    var roundPanel = document.getElementById("playRound");
    if (roundPanel) {
      roundPanel.classList.add("is-hidden");
      roundPanel.setAttribute("aria-hidden", "true");
    }
    var completeWrap = document.getElementById("playCompletePanel");
    if (completeWrap) {
      completeWrap.classList.add("is-hidden");
      completeWrap.setAttribute("aria-hidden", "true");
    }

    // Return to the menu screen
    try { if (UI && UI.goTo) UI.goTo("screen-play-home"); } catch (e) {}
  },

  continueQuest: function() {
    if (Games.runtime.mode !== "quest") return;
    var fn = Games.runtime.onDone;
    Games._clearSessionInState();
    Games.runtime.round = null;
    Games.runtime.onDone = null;
    if (typeof fn === "function") fn();
  },

  // ===== Session Persistence =====
  _saveSessionToState: function() {
    try {
      if (!State || !State.state || !State.state.session) return;
      var r = Games.runtime.round;
      if (!r || r.completed) {
        State.state.session.gameSession = null;
        State.save();
        return;
      }

      var qids = [];
      for (var i = 0; i < r.questions.length; i++) {
        if (r.questions[i] && r.questions[i].qid) qids.push(r.questions[i].qid);
      }

      State.state.session.gameSession = {
        gameId: (Games.currentGameType ? Games._getGameKey(Games.currentGameType) : (r.gameId || null)),
        mode: Games.runtime.mode,
        idx: r.idx,
        correctCount: Games.runtime.correctCount,
        qids: qids,
        difficulty: r.difficulty
      };
      State.save();
    } catch (e) {
      // Non-fatal
    }
  },

  _clearSessionInState: function() {
    try {
      if (State && State.state && State.state.session) {
        State.state.session.gameSession = null;
        State.save();
      }
    } catch (e) {}
  },

  // ===== Validator (console-only) =====
  validateQuestionBank: function(list) {
    if (!Array.isArray(list)) {
      console.warn("[Games.validateQuestionBank] list is not an array");
      return false;
    }
    var seen = {};
    var ok = true;
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if (!q || typeof q !== "object") {
        console.warn("[Games] q[" + i + "] not an object");
        ok = false;
        continue;
      }
      if (!q.qid) {
        console.warn("[Games] missing qid at index", i);
        ok = false;
      } else if (seen[q.qid]) {
        console.warn("[Games] duplicate qid:", q.qid);
        ok = false;
      } else {
        seen[q.qid] = true;
      }
      if (!q.gameType) {
        console.warn("[Games] missing gameType for", q.qid);
        ok = false;
      }
      if (!q.promptEn) {
        console.warn("[Games] missing promptEn for", q.qid);
        ok = false;
      }
      if (q.gameType === "tapWord") {
        if (!Array.isArray(q.tokens) || typeof q.correctTokenIndex !== "number") {
          console.warn("[Games] tapWord missing tokens/correctTokenIndex for", q.qid);
          ok = false;
        }
      } else {
        // For choice games, correctIndex should be present (effective index computed at render)
      }
      if (Games.isPunjabiOn()) {
        // Warn only
        if (q.goalPa === "" || typeof q.goalPa === "undefined") {
          console.warn("[Games] Punjabi missing goalPa (warn):", q.qid);
        }
      }
    }
    return ok;
  },

  // ===== Score UI =====
  updateScoreUI: function() {
    var scoreEl = document.getElementById("play-score");
    if (scoreEl) scoreEl.textContent = Games.currentGameScore || 0;
    var streakEl = document.getElementById("play-streak");
    if (streakEl) streakEl.textContent = Games.currentGameStreak || 0;
    var bestEl = document.getElementById("play-best");
    if (bestEl) bestEl.textContent = Games.currentGameBest || 0;

    // Best score save for normal rounds only
    if (Games.runtime.mode === "normal" && Games.currentGameType) {
      if (Games.currentGameScore > Games.currentGameBest) {
        Games.currentGameBest = Games.currentGameScore;
        var key = "game" + Games.currentGameType;
        if (!State.state.progress.bestScores) State.state.progress.bestScores = {};
        State.state.progress.bestScores[key] = Games.currentGameBest;
        State.save();
      }
    }
  }
};

// =====================================
// Phase 2: Question Bank Validation (dev-only)
// =====================================

window.GamesDebug = window.GamesDebug || {};

window.GamesDebug.runPhase2Validation = function() {
  var out = {
    GAME1: { totalRaw: 0, totalNormalized: 0, dropped: 0, warnings: 0, errors: 0 },
    GAME2: { totalRaw: 0, totalNormalized: 0, dropped: 0, warnings: 0, errors: 0 },
    GAME3: { totalRaw: 0, totalNormalized: 0, dropped: 0, warnings: 0, errors: 0 },
    GAME4: { totalRaw: 0, totalNormalized: 0, dropped: 0, warnings: 0, errors: 0 },
    overall: { errors: 0, warnings: 0 }
  };

  function err(msg, obj) {
    out.overall.errors += 1;
    console.error("[PHASE2] " + msg, obj || "");
  }

  function warn(msg, obj) {
    out.overall.warnings += 1;
    console.warn("[PHASE2] " + msg, obj || "");
  }

  function assertGlobals() {
    var ok = true;
    var need = [
      "GAME1_QUESTIONS", "GAME2_QUESTIONS", "GAME3_QUESTIONS", "GAME4_QUESTIONS",
      "PARTS_OF_SPEECH_LABELS", "TENSE_LABELS",
      "normalizeGame1Questions", "normalizeGame2Questions", "normalizeGame3Questions", "normalizeGame4Questions",
      "buildAllGameQuestions"
    ];
    for (var i = 0; i < need.length; i++) {
      if (typeof window[need[i]] === "undefined") {
        err("Missing global: " + need[i]);
        ok = false;
      }
    }
    return ok;
  }

  function countTokenMatches(sentence, word) {
    if (typeof sentence !== "string" || typeof word !== "string") return 0;
    var tokens = sentence.split(/\s+/).map(function(t) { return t.replace(/[.,!?;:]/g, ""); });
    var c = 0;
    for (var i = 0; i < tokens.length; i++) if (tokens[i] === word) c += 1;
    return c;
  }

  function checkRawSchemas() {
    // GAME1
    if (!Array.isArray(GAME1_QUESTIONS)) {
      err("GAME1_QUESTIONS is not an array");
    } else {
      out.GAME1.totalRaw = GAME1_QUESTIONS.length;
      for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
        var q1 = GAME1_QUESTIONS[i];
        if (!q1 || typeof q1 !== "object") { err("GAME1 raw item not an object at index " + i); out.GAME1.errors++; continue; }
        if (typeof q1.sentence !== "string" || !q1.sentence) { err("GAME1 missing sentence at index " + i, q1); out.GAME1.errors++; }
        if (typeof q1.question !== "string" || !q1.question) { err("GAME1 missing question at index " + i, q1); out.GAME1.errors++; }
        if (typeof q1.correctWord !== "string" || !q1.correctWord) { err("GAME1 missing correctWord at index " + i, q1); out.GAME1.errors++; }
        if (typeof q1.trackId !== "string" || !q1.trackId) { err("GAME1 missing trackId at index " + i, q1); out.GAME1.errors++; }

        // Strong correctness check: correctWord should appear exactly once in tokenized sentence.
        var mc = countTokenMatches(q1.sentence, q1.correctWord);
        if (mc !== 1) { err("GAME1 correctWord token count != 1 at index " + i + " (" + mc + ")", q1); out.GAME1.errors++; }
      }
    }

    // GAME2
    if (!Array.isArray(GAME2_QUESTIONS)) {
      err("GAME2_QUESTIONS is not an array");
    } else {
      out.GAME2.totalRaw = GAME2_QUESTIONS.length;
      for (var j = 0; j < GAME2_QUESTIONS.length; j++) {
        var q2 = GAME2_QUESTIONS[j];
        if (!q2 || typeof q2 !== "object") { err("GAME2 raw item not an object at index " + j); out.GAME2.errors++; continue; }
        if (typeof q2.word !== "string" || !q2.word) { err("GAME2 missing word at index " + j, q2); out.GAME2.errors++; }
        if (typeof q2.correctPartId !== "string" || !q2.correctPartId) { err("GAME2 missing correctPartId at index " + j, q2); out.GAME2.errors++; }
        if (typeof q2.trackId !== "string" || !q2.trackId) { err("GAME2 missing trackId at index " + j, q2); out.GAME2.errors++; }
        if (q2.correctPartId && !PARTS_OF_SPEECH_LABELS[q2.correctPartId]) { err("GAME2 correctPartId not in PARTS_OF_SPEECH_LABELS at index " + j, q2); out.GAME2.errors++; }
      }
    }

    // GAME3
    if (!Array.isArray(GAME3_QUESTIONS)) {
      err("GAME3_QUESTIONS is not an array");
    } else {
      out.GAME3.totalRaw = GAME3_QUESTIONS.length;
      for (var k = 0; k < GAME3_QUESTIONS.length; k++) {
        var q3 = GAME3_QUESTIONS[k];
        if (!q3 || typeof q3 !== "object") { err("GAME3 raw item not an object at index " + k); out.GAME3.errors++; continue; }
        if (typeof q3.sentence !== "string" || !q3.sentence) { err("GAME3 missing sentence at index " + k, q3); out.GAME3.errors++; }
        if (typeof q3.correctTense !== "string" || !q3.correctTense) { err("GAME3 missing correctTense at index " + k, q3); out.GAME3.errors++; }
        if (typeof q3.trackId !== "string" || !q3.trackId) { err("GAME3 missing trackId at index " + k, q3); out.GAME3.errors++; }
        if (q3.correctTense && !TENSE_LABELS[q3.correctTense]) { err("GAME3 correctTense not in TENSE_LABELS at index " + k, q3); out.GAME3.errors++; }
      }
    }

    // GAME4
    if (!Array.isArray(GAME4_QUESTIONS)) {
      err("GAME4_QUESTIONS is not an array");
    } else {
      out.GAME4.totalRaw = GAME4_QUESTIONS.length;
      for (var m = 0; m < GAME4_QUESTIONS.length; m++) {
        var q4 = GAME4_QUESTIONS[m];
        if (!q4 || typeof q4 !== "object") { err("GAME4 raw item not an object at index " + m); out.GAME4.errors++; continue; }
        if (!Array.isArray(q4.options) || q4.options.length < 2) { err("GAME4 missing options[2] at index " + m, q4); out.GAME4.errors++; }
        if (typeof q4.correct !== "string" || !q4.correct) { err("GAME4 missing correct at index " + m, q4); out.GAME4.errors++; }
        if (typeof q4.trackId !== "string" || !q4.trackId) { err("GAME4 missing trackId at index " + m, q4); out.GAME4.errors++; }
        if (Array.isArray(q4.options) && q4.options.length >= 2 && typeof q4.correct === "string") {
          if (q4.correct !== q4.options[0] && q4.correct !== q4.options[1]) {
            err("GAME4 correct must match option[0] or option[1] at index " + m, q4);
            out.GAME4.errors++;
          }
        }
      }
    }
  }

  function validateUniquenessRaw() {
    // Duplicate combo warnings per spec
    var seen1 = {};
    for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
      var q1 = GAME1_QUESTIONS[i];
      var key1 = q1.trackId + "|" + q1.correctWord;
      if (seen1[key1]) warn("GAME1 duplicate combo trackId+correctWord: " + key1);
      seen1[key1] = true;
    }

    var seen2 = {};
    for (var j = 0; j < GAME2_QUESTIONS.length; j++) {
      var q2 = GAME2_QUESTIONS[j];
      var key2 = q2.trackId + "|" + q2.correctPartId + "|" + q2.word;
      if (seen2[key2]) warn("GAME2 duplicate combo trackId+correctPartId+word: " + key2);
      seen2[key2] = true;
    }

    var seen3 = {};
    for (var k = 0; k < GAME3_QUESTIONS.length; k++) {
      var q3 = GAME3_QUESTIONS[k];
      var key3 = q3.trackId + "|" + q3.correctTense + "|" + q3.sentence;
      if (seen3[key3]) warn("GAME3 duplicate combo trackId+correctTense+sentence: " + key3);
      seen3[key3] = true;
    }

    var seen4 = {};
    for (var m = 0; m < GAME4_QUESTIONS.length; m++) {
      var q4 = GAME4_QUESTIONS[m];
      var opts = Array.isArray(q4.options) ? q4.options.join("|") : "";
      var key4 = q4.trackId + "|" + q4.correct + "|" + opts;
      if (seen4[key4]) warn("GAME4 duplicate combo trackId+correct+options: " + key4);
      seen4[key4] = true;
    }
  }

  function validateNormalizerPassEngine() {
    // Use the runtime normalizer (Games.normalizeFromRawGame) to prove normal play won't drop questions.
    function check(gameNum, rawList, bucket) {
      var okCount = 0;
      for (var i = 0; i < rawList.length; i++) {
        try {
          var nq = Games.normalizeFromRawGame(gameNum, rawList[i], i);
          if (nq) okCount++;
          else {
            err("Games.normalizeFromRawGame dropped item (game" + gameNum + ") at index " + i, rawList[i]);
            out[bucket].errors += 1;
          }
        } catch (e) {
          err("Exception normalizing (game" + gameNum + ") index " + i + ": " + (e && e.message ? e.message : e), rawList[i]);
          out[bucket].errors += 1;
        }
      }
      out[bucket].totalNormalized = okCount;
      out[bucket].dropped = out[bucket].totalRaw - okCount;
    }

    check(1, GAME1_QUESTIONS, "GAME1");
    check(2, GAME2_QUESTIONS, "GAME2");
    check(3, GAME3_QUESTIONS, "GAME3");
    check(4, GAME4_QUESTIONS, "GAME4");
  }

  function validateDailyQuestBank() {
    // Use the data-bank builder to prove quest-mode normalized questions are valid and IDs are unique.
    var all = [];
    try {
      all = buildAllGameQuestions();
    } catch (e) {
      err("Exception calling buildAllGameQuestions: " + (e && e.message ? e.message : e));
      return;
    }

    if (!Array.isArray(all)) {
      err("buildAllGameQuestions did not return an array");
      return;
    }

    var idSeen = {};
    for (var i = 0; i < all.length; i++) {
      var q = all[i];
      if (!q || typeof q !== "object") {
        err("DQ normalized item not an object at index " + i);
        continue;
      }
      if (!q.id || typeof q.id !== "string") err("DQ normalized missing id at index " + i, q);
      if (!q.gameId || typeof q.gameId !== "string") err("DQ normalized missing gameId at index " + i, q);
      if (!q.trackId || typeof q.trackId !== "string") err("DQ normalized missing trackId at index " + i, q);
      if (!q.prompt || typeof q.prompt !== "string") err("DQ normalized missing prompt at index " + i, q);
      if (!Array.isArray(q.choices) || !q.choices.length) err("DQ normalized missing choices at index " + i, q);
      if (!q.correctChoiceId || typeof q.correctChoiceId !== "string") err("DQ normalized missing correctChoiceId at index " + i, q);

      if (q.id) {
        if (idSeen[q.id]) err("Duplicate DQ normalized id: " + q.id, q);
        idSeen[q.id] = true;
      }

      // correctChoiceId must exist in choices[].id
      if (Array.isArray(q.choices) && q.correctChoiceId) {
        var found = false;
        for (var c = 0; c < q.choices.length; c++) {
          if (q.choices[c] && q.choices[c].id === q.correctChoiceId) { found = true; break; }
        }
        if (!found) err("DQ normalized correctChoiceId not found in choices for id=" + q.id, q);
      }
    }
  }

  console.group("[PHASE2] Games question bank validation");
  var globalsOk = assertGlobals();
  if (!globalsOk) {
    console.groupEnd();
    console.error("[PHASE2] Phase2 validation FAILED (missing globals)");
    return out;
  }

  checkRawSchemas();
  validateUniquenessRaw();
  validateNormalizerPassEngine();
  validateDailyQuestBank();

  // Summary
  function summarize(gameId) {
    var b = out[gameId];
    console.log(
      gameId + ": raw=" + b.totalRaw +
      ", normalized=" + b.totalNormalized +
      ", dropped=" + b.dropped +
      ", errors=" + b.errors
    );
  }

  console.log("[PHASE2] Summary:");
  summarize("GAME1");
  summarize("GAME2");
  summarize("GAME3");
  summarize("GAME4");
  console.log("[PHASE2] warnings=" + out.overall.warnings + ", errors=" + out.overall.errors);

  if (out.overall.errors > 0) {
    console.error("[PHASE2] Phase2 validation FAILED");
  } else {
    console.log("[PHASE2] Phase2 validation PASSED");
  }

  console.groupEnd();
  return out;
};

// Autorun when requested (dev-only)
(function() {
  try {
    if (typeof location === "undefined") return;
    if (location.search.indexOf("debugGames=1") === -1) return;
    if (window.__BOLO_PHASE2_GAMES_VALIDATION_RAN) return;
    window.__BOLO_PHASE2_GAMES_VALIDATION_RAN = true;
    window.addEventListener("DOMContentLoaded", function() {
      if (window.GamesDebug && typeof window.GamesDebug.runPhase2Validation === "function") {
        window.GamesDebug.runPhase2Validation();
      }
    });
  } catch (e) {
    // ignore
  }
})();

// =====================================
// Phase 1: Browser Testing & Validation Utilities
// =====================================

// Centralized DOM selector helper for consistent element access
var getEl = function(id) {
  var el = document.getElementById(id);
  if (!el) {
    console.warn("[BOLO_TEST] DOM element not found: #" + id);
  }
  return el;
};

// BOLO_TEST_GAMES: Browser testing utility (use in DevTools console)
// Usage: window.BOLO_TEST_GAMES.sanityCheck() to validate setup
window.BOLO_TEST_GAMES = {
  // Sanity check: Verify games module is properly initialized
  sanityCheck: function() {
    console.group("[BOLO_TEST] Sanity Check");
    
    // Check 1: Games module exists
    console.log("✅ Games module exists:", typeof Games === "object");
    
    // Check 2: State module exists
    console.log("✅ State module exists:", typeof State === "object");
    
    // Check 3: Game data loaded
    console.log("✅ GAME1_QUESTIONS loaded:", typeof GAME1_QUESTIONS !== "undefined" && GAME1_QUESTIONS.length > 0);
    console.log("✅ GAME2_QUESTIONS loaded:", typeof GAME2_QUESTIONS !== "undefined" && GAME2_QUESTIONS.length > 0);
    console.log("✅ GAME3_QUESTIONS loaded:", typeof GAME3_QUESTIONS !== "undefined" && GAME3_QUESTIONS.length > 0);
    console.log("✅ GAME4_QUESTIONS loaded:", typeof GAME4_QUESTIONS !== "undefined" && GAME4_QUESTIONS.length > 0);
    
    // Check 4: DOM elements exist
    console.log("✅ #play-question-text exists:", !!getEl("play-question-text"));
    console.log("✅ #play-options exists:", !!getEl("play-options"));
    console.log("✅ #play-feedback exists:", !!getEl("play-feedback"));
    console.log("✅ #play-score exists:", !!getEl("play-score"));
    
    // Check 5: State initialized
    console.log("✅ State.state.progress exists:", !!State.state.progress);
    console.log("✅ bestScores initialized:", !!State.state.progress.bestScores);
    
    // Check 6: Game buttons bound
    console.log("✅ #btn-game1 exists:", !!getEl("btn-game1"));
    console.log("✅ #btn-game2 exists:", !!getEl("btn-game2"));
    console.log("✅ #btn-game3 exists:", !!getEl("btn-game3"));
    console.log("✅ #btn-game4 exists:", !!getEl("btn-game4"));
    
    console.groupEnd();
    return true;
  },
  
  // Start a specific game
  // Usage: window.BOLO_TEST_GAMES.start(1) to start Game 1
  start: function(gameNum) {
    console.log("[BOLO_TEST] Starting Game " + gameNum);
    Games.startGame(gameNum);
    window.BOLO_TEST_GAMES.dumpState();
  },
  
  // Simulate answering a question (helps test flow)
  // Usage: window.BOLO_TEST_GAMES.answerQuestion(true) to answer correctly
  answerQuestion: function(isCorrect) {
    console.log("[BOLO_TEST] Simulating answer: " + (isCorrect ? "CORRECT" : "WRONG"));
    if (!Games.runtime || !Games.runtime.round) {
      console.warn("[BOLO_TEST] No active round. Start a game first.");
      return false;
    }

    var r = Games.runtime.round;
    var q = r.questions[r.idx];
    if (!q) {
      console.warn("[BOLO_TEST] No current question.");
      return false;
    }

    var correctIdx = 0;
    if (q.gameType === "tapWord") {
      correctIdx = q.correctTokenIndex || 0;
    } else {
      // Prefer the effective option set if present; else compute.
      var set = q._effectiveOptionSet || (Games._buildOptionSetForDifficulty ? Games._buildOptionSetForDifficulty(q) : null);
      if (set && typeof set.correctIndex === "number" && set.correctIndex >= 0) correctIdx = set.correctIndex;
      else if (typeof q.correctIndex === "number" && q.correctIndex >= 0) correctIdx = q.correctIndex;
    }

    var choiceIdx = isCorrect ? correctIdx : (correctIdx === 0 ? 1 : 0);
    Games.submitChoice(choiceIdx);
    window.BOLO_TEST_GAMES.dumpState();
    return true;
  },
  
  // Dump current game state to console
  dumpState: function() {
    console.group("[BOLO_TEST] Game State Dump");
    console.log("Current Game Type:", Games.currentGameType);
    console.log("Question Index:", Games.currentGameQuestionIndex);
    console.log("Score:", Games.currentGameScore);
    console.log("Streak:", Games.currentGameStreak);
    console.log("Best Score:", Games.currentGameBest);
    console.log("State.state.progress.bestScores:", State.state.progress.bestScores);
    console.groupEnd();
  },
  
  // Validate event listeners on play-options
  // Usage: window.BOLO_TEST_GAMES.validateEventListeners()
  validateEventListeners: function() {
    console.group("[BOLO_TEST] Event Listener Validation");
    var options = getEl("play-options");
    if (!options) {
      console.warn("⚠️ #play-options not found");
      console.groupEnd();
      return false;
    }
    
    var buttons = options.querySelectorAll("button");
    console.log("Found " + buttons.length + " answer buttons");
    
    if (buttons.length === 0) {
      console.warn("⚠️ No buttons rendered in #play-options");
      console.groupEnd();
      return false;
    }
    
    buttons.forEach(function(btn, idx) {
      // Note: addEventListener handlers aren't visible via btn.onclick.
      console.log("Button " + (idx + 1) + ":", btn.textContent);
    });
    
    console.log("✅ Event listeners validated");
    console.groupEnd();
    return true;
  },
  
  // Test a complete game flow
  // Usage: window.BOLO_TEST_GAMES.testGameFlow(1) to test Game 1 with random answers
  testGameFlow: function(gameNum, numQuestions) {
    numQuestions = numQuestions || 3;
    console.group("[BOLO_TEST] Testing Game " + gameNum + " Flow (" + numQuestions + " questions)");
    
    Games.startGame(gameNum);
    console.log("Game started");
    
    var questionCount = 0;
    var testInterval = setInterval(function() {
      if (questionCount >= numQuestions) {
        console.log("✅ Test flow completed");
        clearInterval(testInterval);
        console.groupEnd();
        window.BOLO_TEST_GAMES.dumpState();
        return;
      }
      
      // Random answer (50% correct)
      var isCorrect = Math.random() > 0.5;
      console.log("Question " + (questionCount + 1) + ": answering " + (isCorrect ? "CORRECT" : "WRONG"));
      window.BOLO_TEST_GAMES.answerQuestion(isCorrect);
      // If Next is enabled, advance.
      var btnNext = document.getElementById("btn-play-next");
      if (btnNext && !btnNext.disabled) {
        Games.next();
      }
      questionCount++;
    }, 1000);
  },
  
  // Verify State.save() is being called
  // Usage: window.BOLO_TEST_GAMES.validateStatePersistence()
  validateStatePersistence: function() {
    console.group("[BOLO_TEST] State Persistence Validation");
    
    var originalSave = State.save;
    var saveCallCount = 0;
    
    State.save = function() {
      saveCallCount++;
      console.log("[State.save] Called (" + saveCallCount + "x)");
      originalSave.call(State);
    };
    
    console.log("Instrumented State.save() - play a game and check call count");
    console.log("To stop testing: run window.BOLO_TEST_GAMES.restoreStateSave()");
    console.groupEnd();
  },
  
  // Restore original State.save() after testing
  restoreStateSave: function() {
    console.log("[BOLO_TEST] Restored original State.save()");
    // Re-load state module to restore original
    location.reload();
  },
  
  // Quick test checklist
  printChecklist: function() {
    console.log("%c=== PHASE 1: BROWSER TESTING CHECKLIST ===", "font-weight: bold; font-size: 14px;");
    console.log("Run these commands in order:");
    console.log("1. window.BOLO_TEST_GAMES.sanityCheck()           → Verify setup");
    console.log("2. window.BOLO_TEST_GAMES.start(1)               → Start Game 1");
    console.log("3. window.BOLO_TEST_GAMES.validateEventListeners() → Check buttons");
    console.log("4. [MANUAL] Click an answer button");
    console.log("5. window.BOLO_TEST_GAMES.dumpState()            → Check updated state");
    console.log("6. window.BOLO_TEST_GAMES.testGameFlow(2, 3)     → Auto-test Game 2 (3 questions)");
    console.log("");
    console.log("If any step fails, check console for error messages.");
  }
};

// Log a message when testing utilities are available
console.log("[BOLO_TEST] Testing utilities ready. Type: window.BOLO_TEST_GAMES.printChecklist()");

// =====================================
// Debug-only: Game 4 Content QA Report
// =====================================
(function() {
  try {
    if (typeof window === "undefined" || !window) return;
    var BOLO_DEBUG = (window.BOLO_DEBUG === true) || (window.BOLO_QA === true);
    if (!BOLO_DEBUG) return;

    window.BOLO_QA = window.BOLO_QA || {};

    window.BOLO_QA.runGame4Report = function runGame4Report(opts) {
      opts = opts || {};
      var includeRaw = !!opts.includeRaw;
      var includeNormalized = (opts.includeNormalized !== false);
      var maxIssues = (typeof opts.maxIssues === "number") ? opts.maxIssues : Infinity;
      var consoleSummary = (opts.consoleSummary !== false);
      var consoleJSON = !!opts.consoleJSON;

      var debug = BOLO_DEBUG;
      var generatedAtISO = (new Date()).toISOString();

      var sanitizeOpt = (typeof sanitizeOptionText === "function")
        ? sanitizeOptionText
        : function(s) { return String(s == null ? "" : s).trim(); };

      var trimFn = (typeof trimSpaces === "function")
        ? trimSpaces
        : function(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); };

      var bank = (typeof GAME4_QUESTIONS !== "undefined" && Array.isArray(GAME4_QUESTIONS)) ? GAME4_QUESTIONS : [];

      var report = {
        meta: {
          generatedAtISO: generatedAtISO,
          totalQuestions: bank.length,
          debug: debug
        },
        summary: {
          issueCount: 0,
          byType: {},
          bySeverity: {}
        },
        issues: []
      };

      function bump(map, key) {
        if (!key) return;
        map[key] = (map[key] || 0) + 1;
      }

      function addIssue(issue) {
        if (report.issues.length >= maxIssues) return;
        report.issues.push(issue);
        bump(report.summary.byType, issue.type);
        bump(report.summary.bySeverity, issue.severity);
      }

      function makeNormalizedPreview(idx, trackId, aClean, bClean, correctChoiceId, q) {
        return {
          id: "G4_" + idx,
          gameId: "GAME4",
          trackId: trackId,
          prompt: "Pick the correct sentence:",
          choices: [
            { id: "a", text: aClean },
            { id: "b", text: bClean }
          ],
          correctChoiceId: correctChoiceId,
          hintEn: (q && q.hintEn) ? q.hintEn : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.hintEn) ? GAME4_FALLBACK.hintEn : "",
          hintPa: (q && q.hintPa) ? q.hintPa : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.hintPa) ? GAME4_FALLBACK.hintPa : "",
          explanationEn: (q && q.explanationEn) ? q.explanationEn : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.explanationEn) ? GAME4_FALLBACK.explanationEn : "",
          explanationPa: (q && q.explanationPa) ? q.explanationPa : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.explanationPa) ? GAME4_FALLBACK.explanationPa : ""
        };
      }

      for (var i = 0; i < bank.length; i++) {
        var q = bank[i] || {};
        var trackId = q.trackId;

        try {
          var optsArr = Array.isArray(q.options) ? q.options : null;
          if (!optsArr || optsArr.length < 2) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "MISSING_OPTIONS",
              details: "options missing or has < 2 entries",
              raw: includeRaw ? { options: q.options, correct: q.correct, optionsPa: q.optionsPa } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, "", "", "a", q) : undefined
            });
          }

          var aRaw = (optsArr && optsArr[0] != null) ? String(optsArr[0]) : "";
          var bRaw = (optsArr && optsArr[1] != null) ? String(optsArr[1]) : "";
          var aClean = sanitizeOpt(aRaw);
          var bClean = sanitizeOpt(bRaw);

          if (!aClean || !bClean) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "EMPTY_AFTER_SANITIZE",
              details: "one or both options empty after sanitization",
              raw: includeRaw ? { a: aRaw, b: bRaw } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, "a", q) : undefined
            });
          }

          var correctRaw = (q.correct != null) ? String(q.correct) : "";
          if (!trimFn(correctRaw)) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "CORRECT_MISSING",
              details: "correct field missing/empty",
              raw: includeRaw ? { correct: q.correct } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, "a", q) : undefined
            });
          }

          var correctClean = sanitizeOpt(correctRaw);

          // Matching only: trimmed + case-insensitive (must mirror normalizeGame4Questions behavior)
          var keyCorrect = trimFn(correctClean).toLowerCase();
          var keyA = trimFn(aClean).toLowerCase();
          var keyB = trimFn(bClean).toLowerCase();
          var matchesA = (keyCorrect && keyA) ? (keyCorrect === keyA) : false;
          var matchesB = (keyCorrect && keyB) ? (keyCorrect === keyB) : false;

          var correctChoiceId = "a";
          if (matchesA && !matchesB) correctChoiceId = "a";
          else if (matchesB && !matchesA) correctChoiceId = "b";
          else correctChoiceId = "a";

          if (keyCorrect) {
            if (matchesA && matchesB) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "warn",
                type: "CORRECT_AMBIGUOUS",
                details: "correct matches both options after sanitize/trim/casefold",
                raw: includeRaw ? { correct: correctRaw, a: aRaw, b: bRaw } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            } else if (!matchesA && !matchesB) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "error",
                type: "CORRECT_NO_MATCH",
                details: "correct does not match either option after sanitize/trim/casefold",
                raw: includeRaw ? { correct: correctRaw, a: aRaw, b: bRaw } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            }
          }

          // Punjabi checks
          if (!Array.isArray(q.optionsPa) || q.optionsPa.length < 2) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "warn",
              type: "PUNJABI_MISSING",
              details: "optionsPa missing or has < 2 entries",
              raw: includeRaw ? { optionsPa: q.optionsPa } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
            });
          } else {
            var pa0 = (q.optionsPa[0] != null) ? String(q.optionsPa[0]) : "";
            var pa1 = (q.optionsPa[1] != null) ? String(q.optionsPa[1]) : "";
            var t0 = trimFn(pa0);
            var t1 = trimFn(pa1);
            if (t0 && t1 && t0 === t1) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "info",
                type: "PUNJABI_OPTIONS_DUPLICATE",
                details: "optionsPa[0] equals optionsPa[1] after trim",
                raw: includeRaw ? { pa0: pa0, pa1: pa1 } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            }
          }
        } catch (e) {
          addIssue({
            index: i,
            trackId: trackId,
            severity: "error",
            type: "INTERNAL_ERROR",
            details: "exception while analyzing question: " + (e && e.message ? e.message : String(e)),
            raw: includeRaw ? { q: q } : undefined,
            normalized: undefined
          });
        }
      }

      report.summary.issueCount = report.issues.length;

      if (consoleSummary) {
        try {
          console.group("[BOLO_QA] Game 4 Report");
          console.log("Questions:", report.meta.totalQuestions, "Issues:", report.summary.issueCount);
          console.log("By type:", report.summary.byType);
          console.log("By severity:", report.summary.bySeverity);

          var preview = report.issues.slice(0, 10).map(function(it) {
            return {
              index: it.index,
              trackId: it.trackId,
              severity: it.severity,
              type: it.type,
              details: it.details
            };
          });
          if (preview.length) console.table(preview);
          else console.log("No issues found.");
          console.groupEnd();
        } catch (e2) {
          // ignore
        }
      }

      if (consoleJSON) {
        try { console.log(JSON.stringify(report, null, 2)); } catch (e3) {}
      }

      return report;
    };
  } catch (e) {
    // ignore
  }
})();

/*

## Phase 2 Manual QA (pass/fail)

- Normal Play (each game 1–4): correct → Next enabled → advances
- 1 wrong then correct: hint shown; Next stays disabled until correct
- 2nd wrong: correct answer shown; Help applied; Next enabled
- Completion panel: score, best, praise, “improved at” line visible
- Buttons: Play Again restarts; Back to Play Menu exits

- Difficulty: tap cycles label; next round reflects difficulty

- Daily Quest: finish round → completion panel shows Continue Quest → returns to quest screen and advances checklist


- Validator: open `/?debugGames=1` OR run `window.GamesDebug.runPhase2Validation()`; expect 0 errors

*/
