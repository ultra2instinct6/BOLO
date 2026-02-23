// =====================================
// Reading Module - owns screen-reading and screen-reading-detail
// =====================================

var Reading = {
  _initialized: false,
  _vocabPanelCollapsed: false,
  _vocabQuizState: null,
  _vocabEnabledFallback: null,
  _detailUiState: null,
  _readingDeckUi: null,
  _readingBundleDeckUi: null,
  _readingDetailDeckUi: null,
  _storyReaderUi: null,
  _activeBundleId: null,
  _bookStorySelectionByBundle: null,
  _storySheetBundleId: null,
  _storySheetTriggerEl: null,
  _readingDeckMaxPreviewAhead: 4,
  _readingViewModeFallback: "kid",
  _kidFlowStep: "read",
  _readingDeckUiStateFallback: { bundleIndex: 0, storyIndex: 0, detailStep: "read" },

  // ===== HTML & Validation Helpers =====

  _escapeHtml: function(text) {
    if (!text || typeof text !== "string") return "";
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, function(c) { return map[c]; });
  },
  _getReadingVocabEnabledSafe: function() {
    try {
      if (typeof State !== "undefined" && State && typeof State.getReadingVocabEnabled === "function") {
        return !!State.getReadingVocabEnabled();
      }
    } catch (e) { /* no-op */ }

    // Fallback: reflect what the UI last painted.
    var btn = document.getElementById("toggle-reading-vocab");
    if (btn) return btn.getAttribute("aria-pressed") === "true";

    return !!Reading._vocabEnabledFallback;
  },

  _getReadingDeckUiStateSafe: function() {
    try {
      if (typeof State !== "undefined" && State && typeof State.getReadingDeckUiState === "function") {
        var v = State.getReadingDeckUiState();
        if (v && typeof v === "object") {
          Reading._readingDeckUiStateFallback = {
            bundleIndex: (typeof v.bundleIndex === "number") ? (v.bundleIndex | 0) : 0,
            storyIndex: (typeof v.storyIndex === "number") ? (v.storyIndex | 0) : 0,
            detailStep: (typeof v.detailStep === "string") ? v.detailStep : "read"
          };
          return Reading._readingDeckUiStateFallback;
        }
      }
    } catch (e) { /* no-op */ }
    return Reading._readingDeckUiStateFallback || { bundleIndex: 0, storyIndex: 0, detailStep: "read" };
  },

  _setReadingDeckUiStateSafe: function(partial) {
    var cur = Reading._getReadingDeckUiStateSafe();
    var next = {
      bundleIndex: (partial && typeof partial.bundleIndex === "number") ? (partial.bundleIndex | 0) : (cur.bundleIndex | 0),
      storyIndex: (partial && typeof partial.storyIndex === "number") ? (partial.storyIndex | 0) : (cur.storyIndex | 0),
      detailStep: (partial && typeof partial.detailStep === "string") ? partial.detailStep : (cur.detailStep || "read")
    };
    if (next.bundleIndex < 0) next.bundleIndex = 0;
    if (next.storyIndex < 0) next.storyIndex = 0;
    if (next.detailStep !== "read" && next.detailStep !== "questions" && next.detailStep !== "vocab" && next.detailStep !== "complete") {
      next.detailStep = "read";
    }
    Reading._readingDeckUiStateFallback = next;
    try {
      if (typeof State !== "undefined" && State && typeof State.setReadingDeckUiState === "function") {
        State.setReadingDeckUiState(next);
      }
    } catch (e) { /* no-op */ }
    return next;
  },

  startBundleMasteryReview: function(bundleId) {
    if (typeof State === "undefined" || !State.getUnmasteredQuestionsInBundle) return;
    
    var queueItems = State.getUnmasteredQuestionsInBundle(bundleId);
    if (!queueItems || queueItems.length === 0) {
      alert(uiText({
        en: "No unmastered questions in this bundle.",
        pa: "ਇਸ ਬੰਡਲ ਵਿੱਚ ਕੋਈ ਬਾਕੀ ਸਵਾਲ ਨਹੀਂ ਹਨ।"
      }, { autoPunjabi: true }));
      return;
    }
    
    Reading._initMasteryReviewState(bundleId, queueItems);
    UI.goTo("screen-reading-detail");
    Reading._renderNextMasteryReviewQuestion();
  },

  _renderNextMasteryReviewQuestion: function() {
    var state = Reading._masteryReviewState;
    if (!state || !state.queue) return;
    
    if (state.currentIndex >= state.queue.length) {
      // All questions answered; check mastery
      var masteryPct = State.getBundleMasteryPct(state.bundleId);
      if (masteryPct >= 0.7) {
        Reading._endMasteryReview();
      } else {
        // Recalculate unmastered questions (some may have been mastered)
        var remaining = State.getUnmasteredQuestionsInBundle(state.bundleId);
        if (remaining.length === 0) {
          Reading._endMasteryReview();
        } else {
          // Continue with remaining questions
          state.queue = remaining;
          state.currentIndex = 0;
          Reading._renderNextMasteryReviewQuestion();
        }
      }
      return;
    }
    
    var item = state.queue[state.currentIndex];
    var readingId = item.readingId;
    var qIndex = item.qIndex;
    
    // Find the reading
    var rd = null;
    if (typeof READINGS !== "undefined" && Array.isArray(READINGS)) {
      for (var i = 0; i < READINGS.length; i++) {
        if (READINGS[i].id === readingId) {
          rd = READINGS[i];
          break;
        }
      }
    }
    
    if (!rd || !rd.questions || !rd.questions[qIndex]) {
      // Skip this question
      state.currentIndex++;
      Reading._renderNextMasteryReviewQuestion();
      return;
    }
    
    // Set detail UI state for this reading
    Reading._initDetailUiState(readingId);
    
    // Render the passage and question
    Reading._initDetailUiState(readingId);
    Reading.openReadingDetail(readingId, qIndex, true);
    
    // Mark that we're in review mode
    var header = document.getElementById("reading-detail-header");
    if (header) {
      var reviewLabel = document.createElement("span");
      reviewLabel.style.marginLeft = "10px";
      reviewLabel.style.fontSize = "0.9em";
      reviewLabel.style.opacity = "0.7";
      reviewLabel.textContent = uiText({
        en: "Mastery Review: " + (state.currentIndex + 1) + " of " + state.queue.length,
        pa: "ਦੁਹਰਾਈ: " + (state.currentIndex + 1) + " / " + state.queue.length
      }, { autoPunjabi: true });
      if (header.lastChild) {
        header.insertBefore(reviewLabel, header.lastChild);
      }
    }
  },

  _handleMasteryReviewAnswer: function(rd, q, chosenIndex) {
    if (!Reading._masteryReviewState) return;
    
    var state = Reading._masteryReviewState;
    var item = state.queue[state.currentIndex];
    var isCorrect = (chosenIndex === q.correctIndex);
    
    // Record the answer
    if (typeof State !== "undefined" && State.recordReadingAnswer) {
      State.recordReadingAnswer(rd.id, item.qIndex, isCorrect);
    }
    
    // Advance to next question
    state.currentIndex++;
    setTimeout(function() {
      Reading._renderNextMasteryReviewQuestion();
    }, 1000);
  },

  // ===== VALIDATION & SAFE ACCESS =====

  validateReadingContent: function(readingId) {
    if (!readingId || typeof readingId !== "string") return false;
    var rd = READINGS.find(function(r) { return r.id === readingId; });
    if (!rd) return false;
    if (typeof rd.id !== "string" || !rd.id.trim()) return false;

    var storyEn = Reading._getStoryTextEn(rd);
    var storyPa = Reading._getStoryTextPa(rd);
    if (!storyEn || !storyPa) return false;

    var questions = Reading._getReadingQuestions(rd);
    if (!questions.length) return false;

    return true;
  },

  _renderErrorFallback: function(errorMsg) {
    UI.goTo("screen-reading-detail");
    var detailScreen = document.getElementById("screen-reading-detail");
    if (!detailScreen) return;
    
    detailScreen.innerHTML = "";
    
    var container = document.createElement("div");
    container.style.padding = "20px";
    container.style.textAlign = "center";
    container.style.marginTop = "40px";
    
    var title = document.createElement("h2");
    title.textContent = uiText({
      en: "⚠️ Reading Not Available",
      pa: "⚠️ ਪੜ੍ਹਾਈ ਉਪਲਬਧ ਨਹੀਂ"
    }, { autoPunjabi: true });
    title.style.color = "#d32f2f";
    
    var message = document.createElement("p");
    message.textContent = errorMsg || uiText({
      en: "This story could not be loaded.",
      pa: "ਇਹ ਕਹਾਣੀ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ।"
    }, { autoPunjabi: true });
    message.style.marginTop = "16px";
    message.style.color = "#666";
    
    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn";
    backBtn.textContent = uiText({
      en: "← Back to Reading List",
      pa: "← ਪੜ੍ਹਾਈ ਸੂਚੀ ਵਾਪਸ"
    }, { autoPunjabi: true });
    backBtn.style.marginTop = "20px";
    backBtn.addEventListener("click", function() {
      UI.goTo("screen-reading");
      Reading.renderReadingList();
    });
    
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(backBtn);
    detailScreen.appendChild(container);
  },

  getPrimaryQuestion: function(rd) {
    var questions = Reading._getReadingQuestions(rd);
    if (!questions.length) return null;
    return questions[0];
  },

  _getStoryTextEn: function(rd) {
    if (!rd || typeof rd !== "object") return "";
    if (typeof rd.englishStory === "string" && rd.englishStory.trim()) return rd.englishStory.trim();
    if (typeof rd.english === "string" && rd.english.trim()) return rd.english.trim();
    return "";
  },

  _getStoryTextPa: function(rd) {
    if (!rd || typeof rd !== "object") return "";
    if (typeof rd.punjabiStory === "string" && rd.punjabiStory.trim()) return rd.punjabiStory.trim();
    if (typeof rd.punjabi === "string" && rd.punjabi.trim()) return rd.punjabi.trim();
    return "";
  },

  _normalizeReadingQuestion: function(rawQuestion) {
    if (!rawQuestion || typeof rawQuestion !== "object") return null;

    var choicesEn = null;
    var choicesPa = null;
    var correctIndex = null;
    var questionEn = "";
    var questionPa = "";
    var explanationEn = "";
    var explanationPa = "";

    if (Array.isArray(rawQuestion.choices) && rawQuestion.choices.length >= 2) {
      choicesEn = rawQuestion.choices.slice(0);
      choicesPa = Array.isArray(rawQuestion.choicesPa) ? rawQuestion.choicesPa.slice(0) : [];
      correctIndex = (typeof rawQuestion.correctChoiceIndex === "number") ? (rawQuestion.correctChoiceIndex | 0) : null;
      questionEn = (typeof rawQuestion.question === "string") ? rawQuestion.question : "";
      questionPa = (typeof rawQuestion.questionPa === "string") ? rawQuestion.questionPa : "";
      explanationEn = (typeof rawQuestion.explanation === "string") ? rawQuestion.explanation : "";
      explanationPa = (typeof rawQuestion.explanationPa === "string") ? rawQuestion.explanationPa : "";
    } else if (Array.isArray(rawQuestion.options) && rawQuestion.options.length >= 2) {
      choicesEn = rawQuestion.options.slice(0);
      correctIndex = (typeof rawQuestion.correctIndex === "number") ? (rawQuestion.correctIndex | 0) : null;
      questionEn = (typeof rawQuestion.qEn === "string" && rawQuestion.qEn.trim()) ? rawQuestion.qEn : ((typeof rawQuestion.q === "string") ? rawQuestion.q : "");
      questionPa = (typeof rawQuestion.qPa === "string") ? rawQuestion.qPa : "";
      if (rawQuestion.explanation && typeof rawQuestion.explanation === "object") {
        explanationEn = (typeof rawQuestion.explanation.en === "string") ? rawQuestion.explanation.en : "";
        explanationPa = (typeof rawQuestion.explanation.pa === "string") ? rawQuestion.explanation.pa : "";
      } else if (typeof rawQuestion.explanation === "string") {
        explanationEn = rawQuestion.explanation;
      }
    } else {
      return null;
    }

    if (!questionEn || !Array.isArray(choicesEn) || choicesEn.length < 2) return null;
    if (typeof correctIndex !== "number" || !isFinite(correctIndex)) return null;
    if (correctIndex < 0 || correctIndex >= choicesEn.length) return null;

    var options = [];
    for (var i = 0; i < choicesEn.length; i++) {
      var enOpt = choicesEn[i];
      var paOpt = Array.isArray(choicesPa) ? choicesPa[i] : null;
      if (typeof enOpt === "object" && enOpt && typeof enOpt.en === "string") {
        options.push({
          en: enOpt.en,
          pa: (typeof enOpt.pa === "string") ? enOpt.pa : ((typeof paOpt === "string") ? paOpt : "")
        });
      } else {
        options.push({
          en: String(enOpt == null ? "" : enOpt),
          pa: (typeof paOpt === "string") ? paOpt : ""
        });
      }
    }

    return {
      q: questionEn,
      qEn: questionEn,
      qPa: questionPa,
      options: options,
      correctIndex: correctIndex,
      explanation: {
        en: explanationEn,
        pa: explanationPa
      }
    };
  },

  _getReadingQuestions: function(rd) {
    if (!rd || typeof rd !== "object") return [];
    var out = [];
    var sourceQuestions = [];
    if (Array.isArray(rd.multipleChoiceQuestions) && rd.multipleChoiceQuestions.length) {
      sourceQuestions = rd.multipleChoiceQuestions;
    } else if (Array.isArray(rd.questions) && rd.questions.length) {
      sourceQuestions = rd.questions;
    }

    for (var i = 0; i < sourceQuestions.length; i++) {
      var normalized = Reading._normalizeReadingQuestion(sourceQuestions[i]);
      if (normalized) out.push(normalized);
    }
    return out;
  },

  _appendStudyPairs: function(parent, items) {
    if (!parent || !Array.isArray(items) || !items.length) return;
    var list = document.createElement("ul");
    list.className = "reading-study-list";
    for (var i = 0; i < items.length; i++) {
      var it = items[i] || {};
      var li = document.createElement("li");
      li.className = "reading-study-list__item";
      var en = document.createElement("div");
      en.className = "reading-study-list__en";
      en.textContent = it.en || "";
      var pa = document.createElement("div");
      pa.className = "reading-study-list__pa";
      pa.setAttribute("lang", "pa");
      pa.textContent = it.pa || "";
      li.appendChild(en);
      li.appendChild(pa);
      list.appendChild(li);
    }
    parent.appendChild(list);
  },

  _buildStudyElement: function(rd) {
    var wrap = document.createElement("div");
    wrap.className = "reading-study-kit";

    var heading = document.createElement("div");
    heading.className = "section-title";
    heading.textContent = "Study Elements";
    wrap.appendChild(heading);

    var subtitle = document.createElement("div");
    subtitle.className = "section-subtitle";
    subtitle.textContent = "Grammar, vocabulary, questions, and speaking prompts for this story.";
    wrap.appendChild(subtitle);

    var pos = (rd && rd.partsOfSpeech && typeof rd.partsOfSpeech === "object") ? rd.partsOfSpeech : {};
    var posKeys = [
      { key: "pronouns", label: "Pronouns" },
      { key: "nouns", label: "Nouns" },
      { key: "verbs", label: "Verbs" },
      { key: "adjectives", label: "Adjectives" },
      { key: "prepositions", label: "Prepositions" }
    ];

    var posDetails = document.createElement("details");
    posDetails.className = "reading-study-block reading-study-block--pos";
    posDetails.open = true;
    var posSummary = document.createElement("summary");
    posSummary.textContent = "Parts of Speech";
    posDetails.appendChild(posSummary);
    for (var p = 0; p < posKeys.length; p++) {
      var cfg = posKeys[p];
      var arr = Array.isArray(pos[cfg.key]) ? pos[cfg.key] : [];
      if (!arr.length) continue;
      var blockTitle = document.createElement("div");
      blockTitle.className = "lang-label reading-study-subhead";
      blockTitle.textContent = cfg.label;
      posDetails.appendChild(blockTitle);
      Reading._appendStudyPairs(posDetails, arr);
    }
    wrap.appendChild(posDetails);

    var vocab = Array.isArray(rd && rd.vocabularyWords) ? rd.vocabularyWords : [];
    if (vocab.length) {
      var vocabDetails = document.createElement("details");
      vocabDetails.className = "reading-study-block reading-study-block--vocab";
      var vocabSummary = document.createElement("summary");
      vocabSummary.textContent = "Vocabulary Words";
      vocabDetails.appendChild(vocabSummary);
      var vocabList = document.createElement("ul");
      vocabList.className = "reading-study-list";
      for (var v = 0; v < vocab.length; v++) {
        var vw = vocab[v] || {};
        var row = document.createElement("li");
        row.className = "reading-study-list__item";
        var w = document.createElement("div");
        w.className = "reading-study-list__en";
        w.textContent = (vw.word || "") + (vw.meaningEn ? (" — " + vw.meaningEn) : "");
        var pw = document.createElement("div");
        pw.className = "reading-study-list__pa";
        pw.setAttribute("lang", "pa");
        pw.textContent = vw.meaningPa || "";
        row.appendChild(w);
        row.appendChild(pw);
        vocabList.appendChild(row);
      }
      vocabDetails.appendChild(vocabList);
      wrap.appendChild(vocabDetails);
    }

    var questions = Reading._getReadingQuestions(rd);
    if (questions.length) {
      var qDetails = document.createElement("details");
      qDetails.className = "reading-study-block reading-study-block--mcq";
      var qSummary = document.createElement("summary");
      qSummary.textContent = "Multiple Choice Questions";
      qDetails.appendChild(qSummary);
      for (var q = 0; q < questions.length; q++) {
        var item = questions[q];
        var block = document.createElement("div");
        block.className = "reading-study-question";
        var qEn = document.createElement("div");
        qEn.className = "reading-study-question__en";
        qEn.textContent = (q + 1) + ". " + (item.qEn || item.q || "");
        block.appendChild(qEn);
        if (item.qPa) {
          var qPa = document.createElement("div");
          qPa.className = "reading-study-question__pa";
          qPa.setAttribute("lang", "pa");
          qPa.textContent = item.qPa;
          block.appendChild(qPa);
        }
        var ol = document.createElement("ol");
        ol.className = "reading-study-question__options";
        for (var c = 0; c < item.options.length; c++) {
          var op = item.options[c] || {};
          var li = document.createElement("li");
          li.className = "reading-study-question__option";
          li.textContent = op.en || "";
          if (c === item.correctIndex) li.classList.add("is-correct");
          if (op.pa) {
            var opPa = document.createElement("div");
            opPa.className = "reading-study-question__option-pa";
            opPa.setAttribute("lang", "pa");
            opPa.textContent = op.pa;
            li.appendChild(opPa);
          }
          ol.appendChild(li);
        }
        block.appendChild(ol);
        if (item.explanation && (item.explanation.en || item.explanation.pa)) {
          var exp = document.createElement("div");
          exp.className = "section-subtitle reading-study-question__explanation";
          exp.textContent = "Explanation: " + (item.explanation.en || "");
          block.appendChild(exp);
          if (item.explanation.pa) {
            var expPa = document.createElement("div");
            expPa.className = "section-subtitle reading-study-question__explanation";
            expPa.setAttribute("lang", "pa");
            expPa.textContent = item.explanation.pa;
            block.appendChild(expPa);
          }
        }
        qDetails.appendChild(block);
      }
      wrap.appendChild(qDetails);
    }

    var extras = (rd && rd.extras && typeof rd.extras === "object") ? rd.extras : {};
    var extrasDetails = document.createElement("details");
    extrasDetails.className = "reading-study-block reading-study-block--extras";
    var extrasSummary = document.createElement("summary");
    extrasSummary.textContent = "Practice Extras";
    extrasDetails.appendChild(extrasSummary);

    if (Array.isArray(extras.sayItSentenceFrames) && extras.sayItSentenceFrames.length) {
      var frameLabel = document.createElement("div");
      frameLabel.className = "lang-label reading-study-subhead";
      frameLabel.textContent = "Say It";
      extrasDetails.appendChild(frameLabel);
      Reading._appendStudyPairs(extrasDetails, extras.sayItSentenceFrames);
    }
    if (Array.isArray(extras.panelPrompts) && extras.panelPrompts.length) {
      var panelLabel = document.createElement("div");
      panelLabel.className = "lang-label reading-study-subhead";
      panelLabel.textContent = "Panel Prompts";
      extrasDetails.appendChild(panelLabel);
      var panelPairs = extras.panelPrompts.map(function(p) { return { en: p.en || "", pa: p.pa || "" }; });
      Reading._appendStudyPairs(extrasDetails, panelPairs);
    }
    if (Array.isArray(extras.actItOutCommands) && extras.actItOutCommands.length) {
      var actLabel = document.createElement("div");
      actLabel.className = "lang-label reading-study-subhead";
      actLabel.textContent = "Act It Out";
      extrasDetails.appendChild(actLabel);
      Reading._appendStudyPairs(extrasDetails, extras.actItOutCommands);
    }
    if (Array.isArray(extras.quickYesNo) && extras.quickYesNo.length) {
      var yesNoLabel = document.createElement("div");
      yesNoLabel.className = "lang-label reading-study-subhead";
      yesNoLabel.textContent = "Quick Yes/No";
      extrasDetails.appendChild(yesNoLabel);
      var yesNoPairs = extras.quickYesNo.map(function(p) {
        var enText = p.en || "";
        if (p.answer) enText += " [" + p.answer + "]";
        return { en: enText, pa: p.pa || "" };
      });
      Reading._appendStudyPairs(extrasDetails, yesNoPairs);
    }
    if (extras.homeConnection && typeof extras.homeConnection === "object") {
      var homeLabel = document.createElement("div");
      homeLabel.className = "lang-label reading-study-subhead";
      homeLabel.textContent = "Home Connection";
      extrasDetails.appendChild(homeLabel);
      Reading._appendStudyPairs(extrasDetails, [{ en: extras.homeConnection.en || "", pa: extras.homeConnection.pa || "" }]);
    }
    wrap.appendChild(extrasDetails);

    return wrap;
  },

  _getSafeQuestionIndex: function(rd, index) {
    var questions = Reading._getReadingQuestions(rd);
    if (!questions.length) return 0;
    var next = (typeof index === "number" && isFinite(index)) ? (index | 0) : 0;
    if (next < 0) next = 0;
    if (next >= questions.length) next = questions.length - 1;
    return next;
  },

  _isKidMode: function() {
    return Reading._getReadingViewModeSafe() === "kid";
  },

  _getReadingViewModeSafe: function() {
    try {
      if (typeof State !== "undefined" && State && typeof State.getReadingViewMode === "function") {
        var mode = State.getReadingViewMode();
        if (mode === "kid" || mode === "full") {
          Reading._readingViewModeFallback = mode;
          return mode;
        }
      }
    } catch (e) { /* no-op */ }
    return Reading._readingViewModeFallback || "kid";
  },

  _setReadingViewMode: function(mode) {
    var next = (mode === "full") ? "full" : "kid";
    try {
      if (typeof State !== "undefined" && State && typeof State.setReadingViewMode === "function") {
        next = State.setReadingViewMode(next) || next;
      }
    } catch (e) { /* no-op */ }
    Reading._readingViewModeFallback = next;
    if (next === "kid") {
      Reading._kidFlowStep = "read";
    }
    Reading._applyReadingViewMode();
  },

  _wireReadingModeToggle: function() {
    var kidBtn = document.getElementById("btn-reading-mode-kid");
    var fullBtn = document.getElementById("btn-reading-mode-full");
    if (!kidBtn || !fullBtn) return;
    if (kidBtn.dataset && kidBtn.dataset.modeBound === "1") return;
    if (kidBtn.dataset) kidBtn.dataset.modeBound = "1";

    kidBtn.addEventListener("click", function() {
      Reading._setReadingViewMode("kid");
    });
    fullBtn.addEventListener("click", function() {
      Reading._setReadingViewMode("full");
    });

    var stepBtn = document.getElementById("btn-reading-kid-next-step");
    if (stepBtn && (!stepBtn.dataset || stepBtn.dataset.modeBound !== "1")) {
      if (stepBtn.dataset) stepBtn.dataset.modeBound = "1";
      stepBtn.addEventListener("click", function() {
        Reading._goToKidFlowStep("questions");
        Reading._setDetailDeckStep("questions");
        var qCard = document.getElementById("readingDetailDeck");
        if (qCard && qCard.scrollIntoView) qCard.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  },

  _applyReadingViewMode: function() {
    var screen = document.getElementById("screen-reading-detail");
    if (!screen) return;
    var mode = Reading._getReadingViewModeSafe();
    screen.classList.toggle("reading-mode-kid", mode === "kid");
    screen.classList.toggle("reading-mode-full", mode === "full");

    var kidBtn = document.getElementById("btn-reading-mode-kid");
    var fullBtn = document.getElementById("btn-reading-mode-full");
    if (kidBtn) kidBtn.setAttribute("aria-pressed", mode === "kid" ? "true" : "false");
    if (fullBtn) fullBtn.setAttribute("aria-pressed", mode === "full" ? "true" : "false");

    Reading._goToKidFlowStep(Reading._kidFlowStep || "read");
  },

  _goToKidFlowStep: function(step) {
    var screen = document.getElementById("screen-reading-detail");
    if (!screen) return;
    var mode = Reading._getReadingViewModeSafe();
    var normalizedStep = step || "read";
    if (normalizedStep !== "read" && normalizedStep !== "questions" && normalizedStep !== "vocab" && normalizedStep !== "complete") {
      normalizedStep = "read";
    }
    Reading._kidFlowStep = normalizedStep;

    screen.classList.remove("reading-kid-step-read", "reading-kid-step-questions", "reading-kid-step-vocab", "reading-kid-step-complete");
    screen.classList.add("reading-kid-step-" + normalizedStep);

    var helper = document.getElementById("reading-kid-helper");
    var helperText = document.getElementById("reading-kid-helper-text");
    var helperBtn = document.getElementById("btn-reading-kid-next-step");
    if (!helper || !helperText || !helperBtn) return;

    if (mode !== "kid") {
      helper.style.display = "none";
      return;
    }

    helper.style.display = "block";
    helperBtn.style.display = "none";

    if (normalizedStep === "read") {
      helperText.textContent = "Step 1: Read the story first.";
      helperBtn.style.display = "inline-flex";
      helperBtn.textContent = "I finished reading";
    } else if (normalizedStep === "questions") {
      helperText.textContent = "Step 2: Answer the question.";
    } else if (normalizedStep === "vocab") {
      helperText.textContent = "Step 3: Practice vocabulary (optional).";
    } else {
      helperText.textContent = "Great job! You can move to the next story.";
    }

    Reading._setDetailDeckStep(normalizedStep);
  },

  _ensureDetailSwipeDeck: function() {
    var screen = document.getElementById("screen-reading-detail");
    var storyCard = document.getElementById("reading-story-card");
    var questionCard = document.getElementById("reading-detail-question-card");
    var vocabCard = document.getElementById("reading-vocab-card");
    var completionCard = document.getElementById("reading-completion-card");
    if (!screen || !storyCard || !questionCard || !vocabCard || !completionCard) return;

    var modeCard = document.getElementById("reading-mode-card");
    var deck = document.getElementById("readingDetailDeck");
    if (!deck) {
      deck = document.createElement("div");
      deck.id = "readingDetailDeck";
      deck.className = "reading-detail-deck";
      deck.tabIndex = 0;

      var viewport = document.createElement("div");
      viewport.id = "readingDetailDeckViewport";
      viewport.className = "reading-detail-deck__viewport";

      var track = document.createElement("div");
      track.id = "readingDetailDeckTrack";
      track.className = "reading-detail-deck__track";

      viewport.appendChild(track);
      deck.appendChild(viewport);

      var nav = document.createElement("div");
      nav.className = "reading-detail-deck__nav";
      nav.innerHTML = '' +
        '<button type="button" class="btn deck-prev-handle" id="btn-reading-detail-prev" aria-label="Previous step">←</button>' +
        '<div class="deck-nav-center">' +
          '<div id="readingDetailDeckDots" aria-label="Reading step position"></div>' +
          '<div id="readingDetailDeckProgress" class="deck-progress-text" aria-live="polite">1/4</div>' +
        '</div>' +
        '<button type="button" class="btn deck-next-handle" id="btn-reading-detail-next" aria-label="Next step">→</button>';
      deck.appendChild(nav);
    }

    var trackEl = document.getElementById("readingDetailDeckTrack");
    if (!trackEl) return;
    var desired = [storyCard, questionCard, vocabCard, completionCard];
    for (var i = 0; i < desired.length; i++) {
      var card = desired[i];
      if (card && card.parentElement !== trackEl) trackEl.appendChild(card);
      if (card) card.classList.add("reading-detail-deck__card", "deck-card", "module-card", "deck-card--reading");
    }
    storyCard.setAttribute("data-step", "read");
    questionCard.setAttribute("data-step", "questions");
    vocabCard.setAttribute("data-step", "vocab");
    completionCard.setAttribute("data-step", "complete");

    if (modeCard && modeCard.nextSibling !== deck) {
      screen.insertBefore(deck, modeCard.nextSibling);
    }

    if (!Reading._readingDetailDeckUi) {
      Reading._readingDetailDeckUi = {
        activeIndex: 0,
        reduceMotion: false,
        peekDirection: 1,
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
    }

    Reading._wireDetailSwipeDeck();
    Reading._renderDetailSwipeDeck();
  },

  _getDetailStepOrder: function() {
    return ["read", "questions", "vocab", "complete"];
  },

  _getDetailDeckStepIndex: function(step) {
    var order = Reading._getDetailStepOrder();
    var idx = order.indexOf(step);
    return idx >= 0 ? idx : 0;
  },

  _setDetailDeckStep: function(step) {
    Reading._setReadingDeckUiStateSafe({ detailStep: step });
    if (!Reading._readingDetailDeckUi) return;
    Reading._readingDetailDeckUi.activeIndex = Reading._getDetailDeckStepIndex(step);
    Reading._renderDetailSwipeDeck();
  },

  _detailDeckClamp: function(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  _detailDeckWrappedDelta: function(index, current, total) {
    var delta = index - current;
    if (total <= 2) return delta;
    var half = total / 2;
    if (delta > half) delta -= total;
    else if (delta < -half) delta += total;
    return delta;
  },

  _applyDetailDeckLook: function(progress) {
    var ui = Reading._readingDetailDeckUi;
    var deck = document.getElementById("readingDetailDeck");
    var track = document.getElementById("readingDetailDeckTrack");
    if (!ui || !deck || !track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll(".reading-detail-deck__card"));
    if (!cards.length) return;

    if (ui.reduceMotion) {
      if (deck.classList) deck.classList.remove("is-swipe-moving");
      for (var r = 0; r < cards.length; r++) {
        cards[r].style.transform = "";
        cards[r].style.opacity = "";
        cards[r].style.filter = "";
        cards[r].style.zIndex = "";
      }
      return;
    }

    var p = (typeof progress === "number" && isFinite(progress)) ? Reading._detailDeckClamp(progress, -1.2, 1.2) : 0;
    if (deck.classList) deck.classList.toggle("is-swipe-moving", Math.abs(p) > 0.015);

    for (var i = 0; i < cards.length; i++) {
      var baseDelta = Reading._detailDeckWrappedDelta(i, ui.activeIndex, cards.length);
      var rel = baseDelta + p;
      var absRel = Math.abs(rel);
      var depthFactor = Reading._detailDeckClamp(absRel, 0, 2.2);
      var isActive = i === ui.activeIndex;
      var slideX = 0;
      var scale = 1;
      var liftY = 0;
      var rotateY = 0;
      var opacity = 1;
      var saturate = 1;
      var brightness = 1;
      var z = 620;

      if (isActive) {
        slideX = Reading._detailDeckClamp(rel, -1.2, 1.2) * -42;
        scale = 1 - (Math.min(depthFactor, 1.2) * 0.036);
        liftY = Math.round(Math.min(depthFactor, 1.0) * 2);
        rotateY = Reading._detailDeckClamp(rel * -7, -10, 10);
      } else if (Math.abs(baseDelta) === 1) {
        slideX = Reading._detailDeckClamp(rel, -1.6, 1.6) * -36;
        scale = 0.92 - (Math.min(depthFactor, 1.7) * 0.04);
        liftY = Math.round(Math.min(depthFactor, 1.5) * 10);
        rotateY = Reading._detailDeckClamp(rel * -9, -12, 12);
        opacity = 0.58 - (Math.min(depthFactor, 2.0) * 0.08);
        saturate = 0.84 - (Math.min(depthFactor, 1.8) * 0.08);
        brightness = 0.95;
        z = 290 - Math.round(depthFactor * 40);
      } else {
        slideX = Reading._detailDeckClamp(rel, -1.8, 1.8) * -20;
        scale = 0.86 - (Math.min(depthFactor, 2.0) * 0.02);
        liftY = Math.round(Math.min(depthFactor, 1.8) * 12);
        rotateY = Reading._detailDeckClamp(rel * -6, -9, 9);
        opacity = 0.22;
        saturate = 0.68;
        brightness = 0.9;
        z = 96;
      }

      if (z < 90) z = 90;
      cards[i].style.transform = "translateX(" + slideX.toFixed(2) + "%) translateY(" + liftY + "px) scale(" + scale.toFixed(3) + ") rotateY(" + rotateY.toFixed(2) + "deg)";
      cards[i].style.opacity = opacity.toFixed(3);
      cards[i].style.filter = "saturate(" + saturate.toFixed(3) + ") brightness(" + brightness.toFixed(3) + ")";
      cards[i].style.zIndex = String(z);
    }
  },

  _renderDetailSwipeDeck: function() {
    var ui = Reading._readingDetailDeckUi;
    var track = document.getElementById("readingDetailDeckTrack");
    var dots = document.getElementById("readingDetailDeckDots");
    var progress = document.getElementById("readingDetailDeckProgress");
    var prevBtn = document.getElementById("btn-reading-detail-prev");
    var nextBtn = document.getElementById("btn-reading-detail-next");
    if (!ui || !track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll(".reading-detail-deck__card"));
    if (!cards.length) return;
    if (ui.activeIndex < 0) ui.activeIndex = 0;
    if (ui.activeIndex >= cards.length) ui.activeIndex = cards.length - 1;

    track.style.transform = "translateX(-" + (ui.activeIndex * 100) + "%)";

    for (var c = 0; c < cards.length; c++) {
      var isActive = c === ui.activeIndex;
      var delta = Reading._detailDeckWrappedDelta(c, ui.activeIndex, cards.length);
      cards[c].classList.toggle("is-active", isActive);
      cards[c].classList.toggle("is-stack-prev", delta === -1);
      cards[c].classList.toggle("is-stack-next", delta === 1);
      cards[c].classList.toggle("is-stack-far", Math.abs(delta) >= 2);
      cards[c].classList.toggle("is-stack-muted", !isActive && Math.abs(delta) >= 2);
      cards[c].setAttribute("aria-hidden", isActive ? "false" : "true");
      cards[c].setAttribute("tabindex", isActive ? "0" : "-1");
    }

    if (dots) {
      if (!dots.children.length || dots.children.length !== cards.length) {
        dots.innerHTML = "";
        for (var d = 0; d < cards.length; d++) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "deck-dot";
          dot.setAttribute("data-index", String(d));
          dot.setAttribute("aria-label", "Go to step " + (d + 1));
          dots.appendChild(dot);
        }
      }
      var allDots = dots.querySelectorAll(".deck-dot");
      for (var i = 0; i < allDots.length; i++) {
        var active = i === ui.activeIndex;
        allDots[i].classList.toggle("is-active", active);
        allDots[i].setAttribute("aria-pressed", active ? "true" : "false");
        if (active) allDots[i].setAttribute("aria-current", "true");
        else allDots[i].removeAttribute("aria-current");
      }
    }

    if (progress) progress.textContent = (ui.activeIndex + 1) + "/" + cards.length;
    if (prevBtn) prevBtn.disabled = ui.activeIndex <= 0;
    if (nextBtn) nextBtn.disabled = ui.activeIndex >= cards.length - 1;

    Reading._applyDetailDeckLook(0);
  },

  _wireDetailSwipeDeck: function() {
    var deck = document.getElementById("readingDetailDeck");
    var viewport = document.getElementById("readingDetailDeckViewport");
    var track = document.getElementById("readingDetailDeckTrack");
    var dots = document.getElementById("readingDetailDeckDots");
    var prevBtn = document.getElementById("btn-reading-detail-prev");
    var nextBtn = document.getElementById("btn-reading-detail-next");
    if (!deck || !viewport || !track || !Reading._readingDetailDeckUi) return;
    if (deck.dataset && deck.dataset.swipeBound === "1") return;
    if (deck.dataset) deck.dataset.swipeBound = "1";
    try { viewport.style.touchAction = "pan-y"; } catch (eTouchAction) {}

    var ui = Reading._readingDetailDeckUi;
    try {
      ui.reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (eReduce) {
      ui.reduceMotion = false;
    }
    if (ui.reduceMotion) {
      try { track.style.transition = "none"; } catch (eTrack) {}
    }

    function allowManualStepNav() {
      return !Reading._isKidMode();
    }

    function setTrackTransition(enabled) {
      if (ui.reduceMotion) {
        try { track.style.transition = "none"; } catch (e0) {}
        return;
      }
      try {
        track.style.transition = enabled
          ? ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.swipeSnapTransition) ? BOLO_DECK_UX.swipeSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)")
          : "none";
      } catch (e1) {}
    }

    function getSwipeThresholdPx() {
      if (typeof getDeckSwipeThresholdPx === "function") return getDeckSwipeThresholdPx(viewport);
      var width = 0;
      try { width = viewport.clientWidth ? viewport.clientWidth : 0; } catch (e0) { width = 0; }
      if (!(width > 0)) {
        try { width = (window && window.innerWidth) ? window.innerWidth : 320; } catch (e1) { width = 320; }
      }
      var px = Math.round(width * 0.18);
      if (px < 36) px = 36;
      return px;
    }

    function goTo(index) {
      if (!allowManualStepNav()) return;
      if (!Reading._readingDetailDeckUi) return;
      var track = document.getElementById("readingDetailDeckTrack");
      if (!track) return;
      var cards = track.querySelectorAll(".reading-detail-deck__card");
      if (!cards.length) return;
      var prevIndex = Reading._readingDetailDeckUi.activeIndex | 0;
      var i = index;
      if (i < 0) i = 0;
      if (i >= cards.length) i = cards.length - 1;
      if (i !== Reading._readingDetailDeckUi.activeIndex) {
        Reading._readingDetailDeckUi.peekDirection = i > Reading._readingDetailDeckUi.activeIndex ? 1 : -1;
      }
      if (i !== prevIndex) {
        try {
          var detailHeroProgress = document.querySelector('#screen-reading-detail .read-hero-progress');
          var detailNudgeHost = detailHeroProgress || deck;
          var detailDirection = i > prevIndex ? 1 : -1;
          if (detailNudgeHost && detailDirection) {
            if (typeof nudgeCounterIndicator === 'function') {
              nudgeCounterIndicator(detailNudgeHost, detailDirection);
            } else {
              var detailCls = detailDirection > 0 ? 'indicator-shift-next' : 'indicator-shift-prev';
              detailNudgeHost.classList.remove('indicator-shift-next', 'indicator-shift-prev');
              void detailNudgeHost.offsetWidth;
              detailNudgeHost.classList.add(detailCls);
              window.setTimeout(function() {
                try { detailNudgeHost.classList.remove(detailCls); } catch (eDetailNudgeRemove) {}
              }, 220);
            }
          }
        } catch (eDetailNudge) {}
      }
      Reading._readingDetailDeckUi.activeIndex = i;
      var step = cards[i] && cards[i].getAttribute("data-step");
      if (step) Reading._kidFlowStep = step;
      Reading._renderDetailSwipeDeck();
      Reading._goToKidFlowStep(step || "read");
    }

    function isControlTarget(evt) {
      var t = evt && evt.target;
      if (!t || !t.closest) return false;
      return !!t.closest("button, input, textarea, select, a, label, .reading-quiz-option, #passageCarousel, #passageThumbs, #reading-vocab-panel");
    }

    function renderDrag(deltaX) {
      var width = 0;
      try { width = viewport.clientWidth ? viewport.clientWidth : 0; } catch (e0) { width = 0; }
      if (!(width > 0)) return;
      var basePx = ui.activeIndex * width;
      var targetPx = -basePx + deltaX;
      track.style.transform = "translateX(" + targetPx + "px)";
      if (deltaX !== 0) ui.peekDirection = deltaX > 0 ? -1 : 1;
      Reading._applyDetailDeckLook(deltaX / width);
    }

    function finishTouchDrag(commit, fallbackDeltaX) {
      if (ui.touchStartX == null) return;
      var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
        ? fallbackDeltaX
        : ((ui.touchCurrentX == null) ? 0 : (ui.touchCurrentX - ui.touchStartX));

      ui.touchStartX = null;
      ui.touchStartY = null;
      ui.touchCurrentX = null;
      var wasDragging = ui.touchDragging;
      ui.touchDragging = false;
      ui.touchMoved = false;
      if (!wasDragging) return;

      setTrackTransition(true);
      if (!commit) {
        Reading._renderDetailSwipeDeck();
        return;
      }

      if (Math.abs(deltaX) >= getSwipeThresholdPx()) {
        if (deltaX > 0) goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1);
        else goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1);
        return;
      }

      Reading._renderDetailSwipeDeck();
    }

    function finishPointerSwipe(commit) {
      if (!allowManualStepNav()) return;
      if (!ui || !ui.pointerDragging) return;
      var delta = (ui.pointerCurrentX == null || ui.pointerStartX == null) ? 0 : (ui.pointerCurrentX - ui.pointerStartX);
      ui.pointerDragging = false;
      ui.pointerMoved = false;
      ui.pointerStartX = null;
      ui.pointerCurrentX = null;
      ui.pointerId = null;

      setTrackTransition(true);
      if (!commit) {
        Reading._renderDetailSwipeDeck();
        return;
      }
      if (Math.abs(delta) < getSwipeThresholdPx()) {
        Reading._renderDetailSwipeDeck();
        return;
      }
      if (delta > 0) goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1);
      else goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1);
    }

    if (prevBtn) prevBtn.addEventListener("click", function() { goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function() { goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1); });

    if (dots) {
      dots.addEventListener("click", function(e) {
        if (!allowManualStepNav()) return;
        var dot = e.target && e.target.closest ? e.target.closest(".deck-dot") : null;
        if (!dot) return;
        var idx = parseInt(dot.getAttribute("data-index"), 10);
        if (isFinite(idx)) goTo(idx);
      });
    }

    deck.addEventListener("keydown", function(e) {
      if (!allowManualStepNav()) return;
      var key = e.key || "";
      if (key === "ArrowRight") {
        e.preventDefault();
        goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1);
      }
    });

    viewport.addEventListener("touchstart", function(e) {
      if (!allowManualStepNav()) return;
      if (isControlTarget(e)) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui) return;
      var touch = e.touches && e.touches[0];
      if (!touch) return;
      ui.touchStartX = touch.clientX;
      ui.touchStartY = touch.clientY;
      ui.touchCurrentX = touch.clientX;
      ui.touchDragging = true;
      ui.touchMoved = false;
    }, { passive: true });

    viewport.addEventListener("touchmove", function(e) {
      if (!allowManualStepNav()) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui || !ui.touchDragging) return;
      var touch = e.touches && e.touches[0];
      if (!touch) return;
      ui.touchCurrentX = touch.clientX;
      var currentY = touch.clientY;
      var deltaX = ui.touchCurrentX - ui.touchStartX;
      var deltaY = (ui.touchStartY == null) ? 0 : (currentY - ui.touchStartY);

      if (!ui.touchMoved) {
        var horizontalIntent = (typeof hasDeckHorizontalIntent === "function")
          ? hasDeckHorizontalIntent(deltaX, deltaY)
          : (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1);
        if (!horizontalIntent) return;
        ui.touchMoved = true;
        setTrackTransition(false);
      }

      renderDrag(deltaX);
      try { e.preventDefault(); } catch (eTouchPrevent) {}
    }, { passive: false });

    viewport.addEventListener("touchend", function(e) {
      if (!allowManualStepNav()) return;
      if (ui.touchStartX == null) return;
      var touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
      if (!touch) {
        finishTouchDrag(false, 0);
        return;
      }
      var deltaX = touch.clientX - ui.touchStartX;
      if (ui.touchMoved) {
        finishTouchDrag(true, deltaX);
        return;
      }

      ui.touchDragging = false;
      ui.touchMoved = false;
      ui.touchStartX = null;
      ui.touchStartY = null;
      ui.touchCurrentX = null;
      if (Math.abs(deltaX) < getSwipeThresholdPx()) return;
      if (deltaX > 0) goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1);
      else goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1);
    });

    viewport.addEventListener("touchcancel", function() {
      finishTouchDrag(false, 0);
    });

    viewport.addEventListener("pointerdown", function(e) {
      if (!allowManualStepNav()) return;
      if (!e || e.pointerType === "touch") return;
      if (e.button != null && e.button !== 0) return;
      if (isControlTarget(e)) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui) return;
      ui.pointerDragging = true;
      ui.pointerMoved = false;
      ui.pointerId = e.pointerId;
      ui.pointerStartX = e.clientX;
      ui.pointerCurrentX = e.clientX;
      try { viewport.setPointerCapture(ui.pointerId); } catch (ePtrCapture) {}
      setTrackTransition(false);
    });

    viewport.addEventListener("pointermove", function(e) {
      if (!allowManualStepNav()) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui || !ui.pointerDragging) return;
      if (ui.pointerId != null && e.pointerId !== ui.pointerId) return;
      ui.pointerCurrentX = e.clientX;
      var deltaX = ui.pointerCurrentX - ui.pointerStartX;
      if (!ui.pointerMoved && Math.abs(deltaX) > 3) ui.pointerMoved = true;
      if (!ui.pointerMoved) return;
      renderDrag(deltaX);
      try { e.preventDefault(); } catch (ePointerPrevent) {}
    });

    viewport.addEventListener("pointerup", function(e) {
      if (!allowManualStepNav()) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui || !ui.pointerDragging) return;
      if (ui.pointerId != null && e.pointerId !== ui.pointerId) return;
      finishPointerSwipe(true);
    });

    viewport.addEventListener("pointercancel", function(e) {
      if (!allowManualStepNav()) return;
      var ui = Reading._readingDetailDeckUi;
      if (!ui || !ui.pointerDragging) return;
      if (ui.pointerId != null && e.pointerId !== ui.pointerId) return;
      finishPointerSwipe(false);
    });

    viewport.addEventListener("pointerleave", function() {
      var ui = Reading._readingDetailDeckUi;
      if (!ui || !ui.pointerDragging) return;
      finishPointerSwipe(true);
    });

    viewport.addEventListener("wheel", function(e) {
      if (!allowManualStepNav()) return;
      if (!e || isControlTarget(e)) return;
      var dx = (typeof e.deltaX === "number" && isFinite(e.deltaX)) ? e.deltaX : 0;
      var dy = (typeof e.deltaY === "number" && isFinite(e.deltaY)) ? e.deltaY : 0;
      if (Math.abs(dx) < 1 && e.shiftKey) dx = dy;
      var absX = Math.abs(dx);
      var absY = Math.abs(dy);
      if (!(absX > 10 && absX >= (absY * 0.8))) return;
      try { e.preventDefault(); } catch (eWheelPrevent) {}
      if (dx > 0) goTo((Reading._readingDetailDeckUi.activeIndex | 0) + 1);
      else goTo((Reading._readingDetailDeckUi.activeIndex | 0) - 1);
    }, { passive: false });
  },

  _wireReadingCompletionActions: function() {
    var nextBtn = document.getElementById("btn-reading-complete-next");
    var againBtn = document.getElementById("btn-reading-complete-again");
    if (nextBtn && (!nextBtn.dataset || nextBtn.dataset.bound !== "1")) {
      if (nextBtn.dataset) nextBtn.dataset.bound = "1";
      nextBtn.addEventListener("click", function() {
        var rid = Reading._detailUiState && Reading._detailUiState.readingId;
        if (rid) Reading.goToNextPassage(rid);
      });
    }
    if (againBtn && (!againBtn.dataset || againBtn.dataset.bound !== "1")) {
      if (againBtn.dataset) againBtn.dataset.bound = "1";
      againBtn.addEventListener("click", function() {
        var rid = Reading._detailUiState && Reading._detailUiState.readingId;
        if (!rid) return;
        Reading.openReadingDetail(rid, 0, true);
        Reading._goToKidFlowStep("read");
      });
    }
  },

  _renderCurrentQuestion: function(rd, requestedIndex) {
    var questions = Reading._getReadingQuestions(rd);
    if (!questions.length) return;
    var qIndex = Reading._getSafeQuestionIndex(rd, requestedIndex);
    var q = questions[qIndex];

    if (!Reading._detailUiState) {
      Reading._initDetailUiState(rd.id, true);
    }
    Reading._detailUiState.currentQuestionIndex = qIndex;
    Reading._detailUiState.totalQuestions = questions.length;

    var progressEl = document.getElementById("reading-progress-counter");
    var passageIndex = Reading._detailUiState && Reading._detailUiState.passageIndex ? Reading._detailUiState.passageIndex : 1;
    var totalPassages = Reading._detailUiState && Reading._detailUiState.totalPassages ? Reading._detailUiState.totalPassages : (Array.isArray(READINGS) ? READINGS.length : 1);
    if (progressEl) {
      progressEl.textContent = "Passage " + passageIndex + " of " + totalPassages + " · Question " + (qIndex + 1) + " of " + questions.length;
    }

    Reading._renderQuizFlow(rd, q, qIndex);
  },

  init: function() {
    if (Reading._initialized) return;
    Reading._initialized = true;
    Reading.wireOnce();
    Reading.renderReadingList();
    Reading.syncUI();
  },

  // ===== Reading Detail: local UI state (no persistence) =====

  _initDetailUiState: function(readingId, forceReset) {
    // Preserve state if we're re-opening the same reading (rare), otherwise reset.
    if (!forceReset && Reading._detailUiState && Reading._detailUiState.readingId === readingId) return;
    Reading._detailUiState = {
      readingId: readingId,
      primaryLang: "en",
      secondaryExpanded: false,
      activeImageIndex: 0,
      selectedOptionIndex: null,
      checked: false,
      locked: false,
      currentQuestionIndex: 0,
      totalQuestions: 1,
      passageIndex: 1,
      totalPassages: (Array.isArray(READINGS) && READINGS.length) ? READINGS.length : 1
    };
  },

  // ===== Mastery Review mode (bundle-level unmastered question review) =====

  _masteryReviewState: null,

  _initMasteryReviewState: function(bundleId, queueItems) {
    Reading._masteryReviewState = {
      bundleId: bundleId,
      queue: queueItems,
      currentIndex: 0,
      startedAt: Date.now()
    };
  },

  _endMasteryReview: function() {
    var bundleId = Reading._masteryReviewState ? Reading._masteryReviewState.bundleId : null;
    Reading._masteryReviewState = null;
    
    if (bundleId && typeof State !== "undefined" && State.isBundleReviewNeeded) {
      // Check if mastery is now >= 70%
      var masteryPct = State.getBundleMasteryPct(bundleId);
      if (masteryPct >= 0.7) {
        alert(uiText({
          en: "🎉 Mastery achieved! Great work.",
          pa: "🎉 ਵਧਾਈ! ਮਾਹਰਤਾ ਹਾਸਲ ਹੋ ਗਈ।"
        }, { autoPunjabi: true }));
      }
    }
    
    // Return to reading list
    UI.goTo("screen-reading");
    Reading.renderReadingList();
  },

  _ensureFocusModeDom: function() {
    var storyCard = document.getElementById("reading-story-card");
    if (!storyCard) return;
    if (storyCard.dataset && storyCard.dataset.focusModeBound === "1") return;
    if (storyCard.dataset) storyCard.dataset.focusModeBound = "1";

    storyCard.classList.add("reading-focus-mode");

    // Hide legacy language row (EN+PA/English/ਪੰਜਾਬੀ) — replaced by focus toggle.
    try {
      var row = document.getElementById("btn-reading-lang-both");
      if (row && row.parentElement) row.parentElement.classList.add("reading-controls-row--legacy-lang");
    } catch (e) { /* no-op */ }

    // Insert focus toggle row after the spacing row.
    var controls = storyCard.querySelector(".reading-readmode-controls");
    if (controls && !document.getElementById("reading-focus-toggle")) {
      var toggleRow = document.createElement("div");
      toggleRow.id = "reading-focus-toggle";
      toggleRow.className = "reading-focus-toggle";
      toggleRow.setAttribute("role", "group");
      toggleRow.setAttribute("aria-label", "Primary language");

      var btnEn = document.createElement("button");
      btnEn.type = "button";
      btnEn.id = "btn-reading-focus-en";
      btnEn.className = "reading-focus-toggle__btn";
      btnEn.textContent = "Primary: English";
      btnEn.setAttribute("aria-pressed", "true");

      var btnPa = document.createElement("button");
      btnPa.type = "button";
      btnPa.id = "btn-reading-focus-pa";
      btnPa.className = "reading-focus-toggle__btn";
      btnPa.textContent = "Primary: ਪੰਜਾਬੀ";
      btnPa.setAttribute("aria-pressed", "false");

      toggleRow.appendChild(btnEn);
      toggleRow.appendChild(btnPa);

      // Insert before vocab toggle row (keeps it near read controls).
      var vocabRow = controls.querySelector(".reading-vocab-toggle-row");
      if (vocabRow) controls.insertBefore(toggleRow, vocabRow);
      else controls.appendChild(toggleRow);
    }

    // Build two stacked cards by re-parenting the existing EN/PA nodes.
    var labelEn = document.getElementById("reading-detail-label-en");
    var textEn = document.getElementById("reading-detail-text-en");
    var labelPa = document.getElementById("reading-detail-label-pa");
    var textPa = document.getElementById("reading-detail-text-pa");
    if (!labelEn || !textEn || !labelPa || !textPa) return;

    if (document.getElementById("reading-passages")) return;

    var passages = document.createElement("div");
    passages.id = "reading-passages";
    passages.className = "reading-passages";

    function makeCard(lang) {
      var card = document.createElement("div");
      card.className = "reading-card";
      card.dataset.lang = lang;

      var header = document.createElement("div");
      header.className = "reading-card__header";

      var headerLeft = document.createElement("div");
      headerLeft.className = "reading-card__headerLeft";

      var headerRight = document.createElement("div");
      headerRight.className = "reading-card__headerRight";

      var collapseBtn = document.createElement("button");
      collapseBtn.type = "button";
      collapseBtn.className = "reading-card__collapseBtn";
      collapseBtn.dataset.lang = lang;
      collapseBtn.textContent = uiText({ en: "Show", pa: "ਵੇਖਾਓ" }, { autoPunjabi: true });
      collapseBtn.setAttribute("aria-expanded", "false");
      collapseBtn.addEventListener("click", function() {
        var st = Reading._detailUiState;
        if (!st) return;
        // Only meaningful for the secondary card.
        var isSecondary = (st.primaryLang !== lang);
        if (!isSecondary) return;
        st.secondaryExpanded = !st.secondaryExpanded;
        Reading._applyFocusModeUI();
      });

      headerRight.appendChild(collapseBtn);
      header.appendChild(headerLeft);
      header.appendChild(headerRight);
      card.appendChild(header);

      var body = document.createElement("div");
      body.className = "reading-card__body";
      card.appendChild(body);

      // Attach nodes
      if (lang === "en") {
        headerLeft.appendChild(labelEn);
        body.appendChild(textEn);
      } else {
        headerLeft.appendChild(labelPa);
        body.appendChild(textPa);
      }

      return card;
    }

    var enCard = makeCard("en");
    var paCard = makeCard("pa");

    passages.appendChild(enCard);
    passages.appendChild(paCard);

    // Insert after media.
    var media = document.getElementById("passageMedia");
    if (media && media.parentElement === storyCard) {
      storyCard.insertBefore(passages, media.nextSibling);
    } else {
      storyCard.appendChild(passages);
    }
  },

  _wireFocusModeToggle: function() {
    var enBtn = document.getElementById("btn-reading-focus-en");
    var paBtn = document.getElementById("btn-reading-focus-pa");
    if (!enBtn || !paBtn) return;
    if (enBtn.dataset && enBtn.dataset.bound === "1") return;
    if (enBtn.dataset) enBtn.dataset.bound = "1";

    enBtn.addEventListener("click", function() {
      if (!Reading._detailUiState) return;
      Reading._detailUiState.primaryLang = "en";
      Reading._applyFocusModeUI();
    });
    paBtn.addEventListener("click", function() {
      if (!Reading._detailUiState) return;
      Reading._detailUiState.primaryLang = "pa";
      Reading._applyFocusModeUI();
    });
  },

  _applyFocusModeUI: function() {
    var st = Reading._detailUiState;
    var passages = document.getElementById("reading-passages");
    if (!st || !passages) return;

    var enCard = passages.querySelector('.reading-card[data-lang="en"]');
    var paCard = passages.querySelector('.reading-card[data-lang="pa"]');
    if (!enCard || !paCard) return;

    // Reorder cards: primary first
    var primary = (st.primaryLang === "pa") ? paCard : enCard;
    var secondary = (st.primaryLang === "pa") ? enCard : paCard;
    passages.innerHTML = "";
    passages.appendChild(primary);
    passages.appendChild(secondary);

    // Apply primary/secondary styling and collapse behavior
    [enCard, paCard].forEach(function(card) {
      card.classList.remove("reading-card--primary", "reading-card--secondary", "reading-card--collapsed");
      var lang = card.dataset.lang;
      var isPrimary = (lang === st.primaryLang);
      card.classList.add(isPrimary ? "reading-card--primary" : "reading-card--secondary");
      if (!isPrimary && !st.secondaryExpanded) card.classList.add("reading-card--collapsed");

      var btn = card.querySelector(".reading-card__collapseBtn");
      if (btn) {
        // Only show the collapse control for the secondary card.
        btn.style.display = isPrimary ? "none" : "inline-flex";
        btn.textContent = st.secondaryExpanded
          ? uiText({ en: "Hide", pa: "ਲੁਕਾਓ" }, { autoPunjabi: true })
          : uiText({ en: "Show", pa: "ਵੇਖਾਓ" }, { autoPunjabi: true });
        btn.setAttribute("aria-expanded", st.secondaryExpanded ? "true" : "false");
      }
    });

    // Update toggle pressed state
    var enBtn = document.getElementById("btn-reading-focus-en");
    var paBtn = document.getElementById("btn-reading-focus-pa");
    if (enBtn) enBtn.setAttribute("aria-pressed", st.primaryLang === "en" ? "true" : "false");
    if (paBtn) paBtn.setAttribute("aria-pressed", st.primaryLang === "pa" ? "true" : "false");
  },

  _scrollToPassageTop: function() {
    var story = document.getElementById("reading-story-card");
    if (!story) return;
    story.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  _renderQuizFlow: function(rd, q, qIndex) {
    var st = Reading._detailUiState;
    if (!st) return;

    st.selectedOptionIndex = null;
    st.checked = false;
    st.locked = false;

    var qEl = document.getElementById("reading-detail-question-text");
    if (qEl) qEl.textContent = q ? (q.qEn || q.q || "") : "";

    var opts = document.getElementById("reading-detail-options");
    if (opts) {
      opts.innerHTML = "";
      if (q && Array.isArray(q.options)) {
        q.options.forEach(function(opt, idx) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "reading-quiz-option";
          btn.dataset.index = String(idx);
          btn.setAttribute("aria-pressed", "false");

          if (typeof opt === "object" && opt.en && opt.pa) {
            var enSpan = document.createElement("span");
            enSpan.textContent = opt.en;
            enSpan.className = "reading-quiz-option__en";

            var paSpan = document.createElement("span");
            paSpan.textContent = opt.pa;
            paSpan.className = "reading-quiz-option__pa";
            paSpan.setAttribute("lang", "pa");

            btn.appendChild(enSpan);
            btn.appendChild(paSpan);
          } else {
            btn.textContent = String(opt);
          }

          btn.addEventListener("click", function() {
            if (st.locked) return;
            st.selectedOptionIndex = idx;
            Reading._updateQuizOptionUI();
          });

          opts.appendChild(btn);
        });
      }
    }

    // Ensure action row (Read again + Check answer)
    var actionRow = document.getElementById("reading-quiz-actions");
    if (!actionRow) {
      actionRow = document.createElement("div");
      actionRow.id = "reading-quiz-actions";
      actionRow.className = "reading-quiz-actions";

      var readAgainBtn = document.createElement("button");
      readAgainBtn.type = "button";
      readAgainBtn.className = "reading-quiz-readagain";
      readAgainBtn.textContent = "Read again";
      readAgainBtn.addEventListener("click", function() {
        Reading._scrollToPassageTop();
      });

      var checkBtn = document.createElement("button");
      checkBtn.type = "button";
      checkBtn.id = "reading-quiz-check";
      checkBtn.className = "btn";
      checkBtn.textContent = "Check answer";
      checkBtn.disabled = true;
      checkBtn.addEventListener("click", function() {
        if (st.selectedOptionIndex == null || !q) return;
        st.checked = true;
        st.locked = true;
        Reading._updateQuizOptionUI();
        Reading._handleAnswer(rd, q, st.selectedOptionIndex, qIndex);

        // If wrong, allow changing answer.
        if (st.selectedOptionIndex !== q.correctIndex) {
          var changeBtn = document.getElementById("reading-quiz-change");
          if (changeBtn) changeBtn.style.display = "inline-flex";
        }
      });

      var changeBtn = document.createElement("button");
      changeBtn.type = "button";
      changeBtn.id = "reading-quiz-change";
      changeBtn.className = "btn btn-secondary btn-small";
      changeBtn.textContent = "Change answer";
      changeBtn.style.display = "none";
      changeBtn.addEventListener("click", function() {
        st.checked = false;
        st.locked = false;
        var fb = document.getElementById("reading-detail-feedback");
        if (fb) {
          fb.textContent = "";
          fb.classList.remove("correct", "wrong");
        }
        var explanationEl = document.getElementById("reading-detail-explanation");
        if (explanationEl) {
          explanationEl.style.display = "none";
          explanationEl.textContent = "";
          explanationEl.innerHTML = "";
        }
        var xpEl = document.getElementById("reading-xp-badge");
        if (xpEl) {
          xpEl.style.display = "none";
          xpEl.textContent = "";
        }

        changeBtn.style.display = "none";
        Reading._updateQuizOptionUI();
      });

      actionRow.appendChild(readAgainBtn);
      actionRow.appendChild(changeBtn);
      actionRow.appendChild(checkBtn);
    }

    // Insert actions after options
    var optionsHost = document.getElementById("reading-detail-options");
    if (optionsHost && optionsHost.parentElement) {
      if (!document.getElementById("reading-quiz-actions")) {
        // Shouldn't happen, but guard.
        optionsHost.parentElement.appendChild(actionRow);
      } else {
        // Ensure it's in the right place
        if (actionRow.parentElement !== optionsHost.parentElement) {
          optionsHost.parentElement.appendChild(actionRow);
        }
        if (actionRow.previousSibling !== optionsHost) {
          optionsHost.parentElement.insertBefore(actionRow, optionsHost.nextSibling);
        }
      }
    }

    // Clear feedback/explanation/xp/next
    var feedbackEl = document.getElementById("reading-detail-feedback");
    if (feedbackEl) {
      feedbackEl.textContent = "";
      feedbackEl.classList.remove("correct", "wrong");
    }
    var explanationEl = document.getElementById("reading-detail-explanation");
    if (explanationEl) {
      explanationEl.style.display = "none";
      explanationEl.textContent = "";
      explanationEl.innerHTML = "";
    }
    var xpEl = document.getElementById("reading-xp-badge");
    if (xpEl) {
      xpEl.style.display = "none";
      xpEl.textContent = "";
    }

    Reading._updateQuizOptionUI();
  },

  _updateQuizOptionUI: function() {
    var st = Reading._detailUiState;
    if (!st) return;
    var buttons = document.querySelectorAll("#reading-detail-options .reading-quiz-option");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var idx = parseInt(btn.dataset.index, 10);
      var selected = (st.selectedOptionIndex === idx);
      btn.classList.toggle("reading-quiz-option--selected", selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
      btn.disabled = st.locked;
    }

    var checkBtn = document.getElementById("reading-quiz-check");
    if (checkBtn) {
      checkBtn.disabled = (st.selectedOptionIndex == null) || st.checked;
    }
  },

  // Lifecycle helpers for navigation safety
  wireOnce: function() {
    Reading._ensureDetailSwipeDeck();
    Reading._wireReadingCompletionActions();
    Reading._wireReadingVocabToggle();
    Reading._wireReadingVocabCollapse();
    Reading._wireReadModeControls();
    Reading._wireReadingModeToggle();
  },

  syncUI: function() {
    Reading._ensureDetailSwipeDeck();
    Reading._applyReadingUiSettings();
    Reading._updateReadingVocabToggleButton();
    Reading._updateReadingVocabCollapseButton();
    Reading._applyReadingViewMode();
    Reading._renderDetailSwipeDeck();
  },

  mountList: function() {
    Reading.wireOnce();
    Reading.renderReadingList();
    Reading.syncUI();
  },

  mountDetail: function() {
    Reading.wireOnce();
    Reading.syncUI();
  },

  // ===== Read Mode Controls (detail screen) =====

  _wireReadModeControls: function() {
    var root = document.getElementById("reading-story-card");
    if (!root) return;
    if (root.dataset && root.dataset.readModeBound === "1") return;
    if (root.dataset) root.dataset.readModeBound = "1";

    function onClick(id, fn) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("click", fn);
    }

    onClick("btn-reading-font-dec", function() {
      var s = State.getReadingUiSettings();
      State.setReadingUiSettings({ fontStep: Math.max(0, (s.fontStep | 0) - 1) });
      Reading._applyReadingUiSettings();
    });

    onClick("btn-reading-font-inc", function() {
      var s = State.getReadingUiSettings();
      State.setReadingUiSettings({ fontStep: Math.min(3, (s.fontStep | 0) + 1) });
      Reading._applyReadingUiSettings();
    });

    onClick("btn-reading-spacing", function() {
      var s = State.getReadingUiSettings();
      var next = (s.lineSpacing === "wide") ? "normal" : "wide";
      State.setReadingUiSettings({ lineSpacing: next });
      Reading._applyReadingUiSettings();
    });

    onClick("btn-reading-lang-both", function() {
      State.setReadingUiSettings({ langMode: "both" });
      Reading._applyReadingUiSettings();
      try { if (window.ReadingMedia && ReadingMedia.updateCaptionForCurrent) ReadingMedia.updateCaptionForCurrent(); } catch (e) {}
    });
    onClick("btn-reading-lang-en", function() {
      State.setReadingUiSettings({ langMode: "en" });
      Reading._applyReadingUiSettings();
      try { if (window.ReadingMedia && ReadingMedia.updateCaptionForCurrent) ReadingMedia.updateCaptionForCurrent(); } catch (e) {}
    });
    onClick("btn-reading-lang-pa", function() {
      State.setReadingUiSettings({ langMode: "pa" });
      Reading._applyReadingUiSettings();
      try { if (window.ReadingMedia && ReadingMedia.updateCaptionForCurrent) ReadingMedia.updateCaptionForCurrent(); } catch (e) {}
    });

    Reading._applyReadingUiSettings();
  },

  _applyReadingUiSettings: function() {
    var card = document.getElementById("reading-story-card");
    if (!card) return;

    var s = State.getReadingUiSettings();

    // Focus Mode expects both language blocks to exist and be controlled by Focus UI.
    // So we ignore persisted langMode hiding while focus mode is active.
    var effectiveLangMode = (card.classList && card.classList.contains("reading-focus-mode")) ? "both" : (s.langMode || "both");

    // Remove prior classes
    var cls = card.className || "";
    cls = cls
      .replace(/\bread-font-\d\b/g, "")
      .replace(/\bread-line-(normal|wide)\b/g, "")
      .replace(/\bread-lang-(both|en|pa)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    card.className = (cls ? (cls + " ") : "") +
      ("read-font-" + s.fontStep + " ") +
      ("read-line-" + s.lineSpacing + " ") +
      ("read-lang-" + effectiveLangMode);

    // Update buttons (labels + aria-pressed)
    var btnSpacing = document.getElementById("btn-reading-spacing");
    if (btnSpacing) {
      btnSpacing.textContent = "Spacing: " + (s.lineSpacing === "wide" ? "Wide" : "Normal");
      btnSpacing.setAttribute("aria-pressed", s.lineSpacing === "wide" ? "true" : "false");
    }

    function setPressed(id, pressed) {
      var b = document.getElementById(id);
      if (!b) return;
      b.setAttribute("aria-pressed", pressed ? "true" : "false");
    }
    setPressed("btn-reading-lang-both", s.langMode === "both");
    setPressed("btn-reading-lang-en", s.langMode === "en");
    setPressed("btn-reading-lang-pa", s.langMode === "pa");
  },

  _wireReadingVocabToggle: function() {
    var btn = document.getElementById("toggle-reading-vocab");
    if (!btn) return;
    if (btn.dataset && btn.dataset.vocabBound === "1") return;
    if (btn.dataset) btn.dataset.vocabBound = "1";

    btn.addEventListener("click", function() {
      var next = !Reading._getReadingVocabEnabledSafe();
      try {
        State.setReadingVocabEnabled(next);
      } catch (e) { /* no-op */ }

      // Keep an in-memory fallback in case persistence/state access is broken.
      Reading._vocabEnabledFallback = next;

      // Always update the button state, even if persistence fails.
      Reading._updateReadingVocabToggleButton();

      // Ensure an immediate visible change: hide the card when toggled off.
      var card = document.getElementById("reading-vocab-card");
      var panel = document.getElementById("reading-vocab-panel");
      if (!next) {
        if (card) card.style.display = "none";
        if (panel) panel.innerHTML = "";
        return;
      }

      // Re-render vocab panel for the currently-open passage.
      var rid = null;
      var titleEl = document.getElementById("reading-detail-title");
      if (titleEl && titleEl.dataset) rid = titleEl.dataset.readingId;
      if (!rid) {
        try {
          if (State && State.state && State.state.session && State.state.session.currentReadingId) {
            rid = State.state.session.currentReadingId;
          }
        } catch (e2) { /* no-op */ }
      }
      if (rid) {
        var rd = READINGS.find(function(r) { return r.id === rid; });
        if (rd) {
          Reading.syncVocabCollapseUI();
          Reading._renderReadingVocabPanel(rd);
        }
      }
    });

    Reading._updateReadingVocabToggleButton();
  },

  // Painter: synchronize vocab toggle UI with canonical state
  syncVocabToggleUI: function() {
    try { Reading._updateReadingVocabToggleButton(); } catch (e) {}
  },

  _updateReadingVocabToggleButton: function() {
    var btn = document.getElementById("toggle-reading-vocab");
    if (!btn) return;
    var isOn = Reading._getReadingVocabEnabledSafe();

    // If the button has the new span markup, only update the status chip.
    var statusEl = document.getElementById("reading-vocab-status");
    if (statusEl) {
      statusEl.textContent = isOn ? "On" : "Off";
    } else {
      // Fallback for older markup
      btn.textContent = "Vocabulary / ਸ਼ਬਦਾਵਲੀ: " + (isOn ? "On" : "Off");
    }
    btn.setAttribute("aria-pressed", isOn ? "true" : "false");
    btn.setAttribute("aria-label", "Vocabulary: " + (isOn ? "On" : "Off"));
  },

  _wireReadingVocabCollapse: function() {
    var btn = document.getElementById("btn-reading-vocab-collapse");
    if (!btn) return;
    if (btn.dataset && btn.dataset.vocabCollapseBound === "1") return;
    if (btn.dataset) btn.dataset.vocabCollapseBound = "1";

    btn.addEventListener("click", function() {
      Reading._vocabPanelCollapsed = !Reading._vocabPanelCollapsed;
      Reading._updateReadingVocabCollapseButton();

      // Persist collapse state
      try {
        if (typeof State !== 'undefined' && State.setReadingVocabCollapsed) {
          State.setReadingVocabCollapsed(Reading._vocabPanelCollapsed);
        }
      } catch (e) { /* no-op */ }

      // Apply visibility immediately
      var panel = document.getElementById("reading-vocab-panel");
      if (panel) panel.style.display = Reading._vocabPanelCollapsed ? "none" : "block";
    });

    Reading._updateReadingVocabCollapseButton();
  },

  // Painter: synchronize vocab collapse UI (persist + aria-expanded + labels)
  syncVocabCollapseUI: function() {
    try {
      if (typeof State !== 'undefined' && State.getReadingVocabCollapsed) {
        Reading._vocabPanelCollapsed = !!State.getReadingVocabCollapsed();
      }
    } catch (e) { /* no-op */ }
    try { Reading._updateReadingVocabCollapseButton(); } catch (e) {}
  },

  _updateReadingVocabCollapseButton: function() {
    var btn = document.getElementById("btn-reading-vocab-collapse");
    if (!btn) return;
    var expanded = !Reading._vocabPanelCollapsed;

    // Prefer span updates if present (keeps styling consistent)
    var enEl = document.getElementById("reading-vocab-collapse-en");
    var paEl = document.getElementById("reading-vocab-collapse-pa");
    if (enEl && paEl) {
      enEl.textContent = expanded ? "Hide" : "Show";
      paEl.textContent = expanded ? "ਲੁਕਾਓ" : "ਵੇਖਾਓ";
    } else {
      // Fallback for older markup
      btn.textContent = expanded ? "Hide / ਲੁਕਾਓ" : "Show / ਵੇਖਾਓ";
    }
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  },

  _normalizeVocabTerm: function(term) {
    if (term == null) return "";
    return String(term)
      .replace(/\s+/g, " ")
      .trim();
  },

  _dedupeAndSortByTerm: function(items) {
    if (!Array.isArray(items)) return [];
    var seen = {};
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i] || {};
      var t = Reading._normalizeVocabTerm(it.term);
      if (!t) continue;
      var key = t.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      it.term = t;
      out.push(it);
    }
    out.sort(function(a, b) {
      return a.term.toLowerCase().localeCompare(b.term.toLowerCase());
    });
    return out;
  },

  _getReadingVocabDetail: function(rd) {
    if (!rd) return null;
    if (typeof READING_VOCAB_DETAIL === "undefined" || !READING_VOCAB_DETAIL) return null;
    var entry = READING_VOCAB_DETAIL[rd.id];
    if (!entry || typeof entry !== "object") return null;

    var phrases = Reading._dedupeAndSortByTerm((entry.phrases || []).map(function(p) {
      return {
        term: p && p.term,
        pos: p && p.pos,
        defEn: p && p.defEn,
        defPa: p && p.defPa
      };
    }));

    var words = Reading._dedupeAndSortByTerm((entry.words || []).map(function(w) {
      return {
        term: w && w.term,
        pos: w && w.pos,
        defEn: w && w.defEn,
        defPa: w && w.defPa,
        forms: Array.isArray(w && w.forms) ? w.forms : null
      };
    }));

    // Build forms map from word entries
    var forms = {};
    for (var i = 0; i < words.length; i++) {
      var base = words[i].term;
      var f = words[i].forms;
      if (!base || !Array.isArray(f) || !f.length) continue;
      // Normalize + dedupe forms (preserve order)
      var seenF = {};
      var clean = [];
      for (var j = 0; j < f.length; j++) {
        var ff = Reading._normalizeVocabTerm(f[j]);
        if (!ff) continue;
        var k = ff.toLowerCase();
        if (seenF[k]) continue;
        seenF[k] = true;
        clean.push(ff);
      }
      if (clean.length) forms[base] = clean;
    }

    return { phrases: phrases, words: words, forms: forms };
  },

  _getReadingVocabData: function(rd) {
    var words = (rd && Array.isArray(rd.vocabWords)) ? rd.vocabWords : [];
    var phrases = (rd && Array.isArray(rd.vocabPhrases)) ? rd.vocabPhrases : [];
    var forms = (rd && rd.vocabForms && typeof rd.vocabForms === "object") ? rd.vocabForms : {};
    return { words: words, phrases: phrases, forms: forms };
  },

  _renderReadingVocabPanel: function(rd) {
    var card = document.getElementById("reading-vocab-card");
    var panel = document.getElementById("reading-vocab-panel");
    if (!card || !panel) return;

    if (!Reading._getReadingVocabEnabledSafe()) {
      card.style.display = "none";
      panel.innerHTML = "";
      return;
    }

    // Prefer rich detail vocab when present; fallback to legacy arrays.
    var detail = Reading._getReadingVocabDetail(rd);
    var vLegacy = detail ? null : Reading._getReadingVocabData(rd);

    var hasPhrases = detail ? (detail.phrases.length > 0) : (vLegacy.phrases && vLegacy.phrases.length > 0);
    var hasWords = detail ? (detail.words.length > 0) : (vLegacy.words && vLegacy.words.length > 0);
    var formsObj = detail ? detail.forms : (vLegacy.forms || {});
    var formKeys = Object.keys(formsObj || {});
    var hasForms = formKeys.length > 0;

    card.style.display = "block";
    panel.innerHTML = "";

    // Collapsible behavior
    panel.style.display = Reading._vocabPanelCollapsed ? "none" : "block";
    Reading._updateReadingVocabCollapseButton();

    function renderDetailCardsSection(title, items) {
      var section = document.createElement("div");
      section.className = "vocab-section";

      var label = document.createElement("div");
      label.className = "lang-label";
      label.textContent = title;
      section.appendChild(label);

      var list = document.createElement("div");
      list.className = "vocab-cards";

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var cardEl = document.createElement("div");
        cardEl.className = "vocab-item-card";

        var topRow = document.createElement("div");
        topRow.className = "vocab-item-top";

        var termEl = document.createElement("div");
        termEl.className = "vocab-item-term";
        termEl.textContent = it.term;
        topRow.appendChild(termEl);

        if (it.pos) {
          var posEl = document.createElement("span");
          posEl.className = "vocab-pos";
          posEl.textContent = String(it.pos);
          topRow.appendChild(posEl);
        }

        cardEl.appendChild(topRow);

        if (it.defEn) {
          var defEn = document.createElement("div");
          defEn.className = "vocab-def vocab-def-en";
          defEn.textContent = String(it.defEn);
          cardEl.appendChild(defEn);
        }

        if (it.defPa) {
          var defPa = document.createElement("div");
          defPa.className = "vocab-def vocab-def-pa";
          defPa.setAttribute("lang", "pa");
          defPa.textContent = String(it.defPa);
          cardEl.appendChild(defPa);
        }

        list.appendChild(cardEl);
      }

      section.appendChild(list);
      panel.appendChild(section);
    }

    function renderChipSection(title, items) {
      var section = document.createElement("div");
      section.className = "vocab-section";

      var label = document.createElement("div");
      label.className = "lang-label";
      label.textContent = title;
      section.appendChild(label);

      var list = document.createElement("div");
      list.className = "vocab-chip-list";
      for (var i = 0; i < items.length; i++) {
        var chip = document.createElement("span");
        chip.className = "vocab-chip";
        chip.textContent = String(items[i]);
        list.appendChild(chip);
      }
      section.appendChild(list);
      panel.appendChild(section);
    }

    if (hasPhrases) {
      if (detail) {
        renderDetailCardsSection("Phrases / ਵਾਕਾਂਸ਼", detail.phrases);
      } else {
        // Legacy strings
        var normalized = [];
        var seen = {};
        for (var pi = 0; pi < vLegacy.phrases.length; pi++) {
          var t = Reading._normalizeVocabTerm(vLegacy.phrases[pi]);
          if (!t) continue;
          var k = t.toLowerCase();
          if (seen[k]) continue;
          seen[k] = true;
          normalized.push(t);
        }
        normalized.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
        renderChipSection("Phrases / ਵਾਕਾਂਸ਼", normalized);
      }
    }

    if (hasWords) {
      if (detail) {
        renderDetailCardsSection("Words / ਸ਼ਬਦ", detail.words);
      } else {
        var normalizedW = [];
        var seenW = {};
        for (var wi = 0; wi < vLegacy.words.length; wi++) {
          var tw = Reading._normalizeVocabTerm(vLegacy.words[wi]);
          if (!tw) continue;
          var kw = tw.toLowerCase();
          if (seenW[kw]) continue;
          seenW[kw] = true;
          normalizedW.push(tw);
        }
        normalizedW.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
        renderChipSection("Words / ਸ਼ਬਦ", normalizedW);
      }
    }

    if (hasForms) {
      var sectionForms = document.createElement("div");
      sectionForms.className = "vocab-section";

      var labelForms = document.createElement("div");
      labelForms.className = "lang-label";
      labelForms.textContent = "Word Forms / ਸ਼ਬਦ ਦੇ ਰੂਪ";
      sectionForms.appendChild(labelForms);

      formKeys.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
      for (var k = 0; k < formKeys.length; k++) {
        var base = formKeys[k];
        var formsVal = formsObj[base];

        var formsText = "";
        if (Array.isArray(formsVal)) {
          formsText = formsVal.join(", ");
        } else if (typeof formsVal === "string") {
          formsText = formsVal;
        } else if (formsVal && typeof formsVal === "object") {
          // If someone stores an object, show its values.
          var vals = [];
          for (var kk in formsVal) {
            if (formsVal.hasOwnProperty(kk)) vals.push(formsVal[kk]);
          }
          formsText = vals.join(", ");
        }

        var row = document.createElement("div");
        row.className = "vocab-form-row";

        var baseSpan = document.createElement("span");
        baseSpan.className = "vocab-form-base";
        baseSpan.textContent = base;

        var arrowSpan = document.createElement("span");
        arrowSpan.textContent = " → ";

        var formsSpan = document.createElement("span");
        formsSpan.className = "vocab-form-forms";
        formsSpan.textContent = formsText;

        row.appendChild(baseSpan);
        row.appendChild(arrowSpan);
        row.appendChild(formsSpan);
        sectionForms.appendChild(row);
      }

      panel.appendChild(sectionForms);
    }

    if (!hasPhrases && !hasWords && !hasForms) {
      var empty = document.createElement("div");
      empty.className = "section-subtitle";
      empty.textContent = "No vocabulary for this story yet.";
      panel.appendChild(empty);
    }
  },

  // ===== Read Deck Helpers =====

  _getReadingsForBundle: function(bundleId) {
    var out = [];
    if (typeof State !== "undefined" && State && typeof State.getBundleReadings === "function") {
      out = State.getBundleReadings(bundleId) || [];
    }
    if ((!out || !out.length) && typeof READINGS !== "undefined" && Array.isArray(READINGS)) {
      out = READINGS.filter(function(r) {
        return r && ((r.bundleId | 0) === (bundleId | 0) || (r.bundle | 0) === (bundleId | 0));
      });
    }
    return Array.isArray(out) ? out : [];
  },

  _getReadingBundleIds: function() {
    var ids = [];
    if (typeof BUNDLES !== "undefined" && Array.isArray(BUNDLES) && BUNDLES.length) {
      for (var i = 0; i < BUNDLES.length; i++) {
        var bundle = BUNDLES[i] || {};
        var bundleId = bundle.id | 0;
        if (bundleId > 0) ids.push(bundleId);
      }
      if (ids.length) return ids;
    }
    if (typeof READINGS !== "undefined" && Array.isArray(READINGS)) {
      var seen = {};
      for (var j = 0; j < READINGS.length; j++) {
        var r = READINGS[j] || {};
        var b = (r.bundleId | 0) || (r.bundle | 0);
        if (b > 0 && !seen[b]) {
          seen[b] = true;
          ids.push(b);
        }
      }
      ids.sort(function(a, b) { return a - b; });
    }
    return ids;
  },

  _getBundleMeta: function(bundleId) {
    if (typeof BUNDLES === "undefined" || !Array.isArray(BUNDLES) || !BUNDLES.length) return null;
    var targetId = parseInt(bundleId, 10);
    if (!isFinite(targetId) || targetId < 1) return null;
    for (var i = 0; i < BUNDLES.length; i++) {
      var bundle = BUNDLES[i] || {};
      if ((bundle.id | 0) === (targetId | 0)) return bundle;
    }
    return null;
  },

  _getBookDeckIds: function() {
    var ids = Reading._getReadingBundleIds();
    return ids;
  },

  _getBookStorySelectionStorageKey: function() {
    var profileId = "default";
    try {
      if (typeof State !== "undefined" && State && typeof State.getActiveProfile === "function") {
        var profile = State.getActiveProfile();
        if (profile && profile.id) profileId = String(profile.id);
      }
    } catch (e0) {}
    return "boloReadBookStorySelection_v2_" + profileId;
  },

  _ensureBookStorySelectionsLoaded: function() {
    if (Reading._bookStorySelectionByBundle && typeof Reading._bookStorySelectionByBundle === "object") return;
    var deckIds = Reading._getBookDeckIds();
    if (!deckIds.length) deckIds = [1, 2, 3, 4, 5];
    var out = {};
    for (var d = 0; d < deckIds.length; d++) out[deckIds[d]] = 1;
    try {
      var raw = localStorage.getItem(Reading._getBookStorySelectionStorageKey());
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          for (var i = 0; i < deckIds.length; i++) {
            var id = deckIds[i];
            var v = parsed[id];
            var n = parseInt(v, 10);
            if (isFinite(n) && n >= 1 && n <= 10) out[id] = n;
          }
        }
      }
    } catch (e1) {}
    Reading._bookStorySelectionByBundle = out;
  },

  _saveBookStorySelections: function() {
    if (!Reading._bookStorySelectionByBundle) return;
    try {
      localStorage.setItem(Reading._getBookStorySelectionStorageKey(), JSON.stringify(Reading._bookStorySelectionByBundle));
    } catch (e) {}
  },

  _getSelectedStoryForBook: function(bundleId) {
    Reading._ensureBookStorySelectionsLoaded();
    var key = (bundleId | 0);
    var n = Reading._bookStorySelectionByBundle[key];
    var maxStories = Reading._getOrderedStoriesForBook(bundleId).length;
    if (!maxStories || maxStories < 1) maxStories = 1;
    if (!isFinite(n) || n < 1 || n > maxStories) n = 1;
    return n;
  },

  _setSelectedStoryForBook: function(bundleId, storyNum) {
    Reading._ensureBookStorySelectionsLoaded();
    var key = (bundleId | 0);
    var n = parseInt(storyNum, 10);
    var maxStories = Reading._getOrderedStoriesForBook(bundleId).length;
    if (!maxStories || maxStories < 1) maxStories = 1;
    if (!isFinite(n)) n = 1;
    if (n < 1) n = 1;
    if (n > maxStories) n = maxStories;
    Reading._bookStorySelectionByBundle[key] = n;
    Reading._saveBookStorySelections();
  },

  _getOrderedStoriesForBook: function(bundleId) {
    var list = Reading._getReadingsForBundle(bundleId) || [];
    list.sort(function(a, b) {
      var ao = (a && typeof a.orderInBundle === "number") ? a.orderInBundle : 999;
      var bo = (b && typeof b.orderInBundle === "number") ? b.orderInBundle : 999;
      if (ao !== bo) return ao - bo;
      var aid = (a && a.id) ? String(a.id) : "";
      var bid = (b && b.id) ? String(b.id) : "";
      return aid.localeCompare(bid);
    });
    return list;
  },

  _getStoryForBookSelection: function(bundleId) {
    var list = Reading._getOrderedStoriesForBook(bundleId);
    if (!list.length) return null;
    var selected = Reading._getSelectedStoryForBook(bundleId);
    var idx = selected - 1;
    if (idx < 0) idx = 0;
    if (idx >= list.length) idx = list.length - 1;
    return list[idx] || null;
  },

  _getReadingDetailHeroMeta: function(rd) {
    var story = rd || {};
    var bundleId = parseInt(story.bundleId || story.bundle || Reading._activeBundleId, 10);
    if (!isFinite(bundleId) || bundleId < 1) bundleId = 1;
    var bundleMeta = Reading._getBundleMeta(bundleId) || {};

    var storyNumber = 1;
    var orderedStories = Reading._getOrderedStoriesForBook(bundleId);
    if (orderedStories && orderedStories.length) {
      var storyId = story.id ? String(story.id) : "";
      for (var i = 0; i < orderedStories.length; i++) {
        var candidate = orderedStories[i] || {};
        if (storyId && String(candidate.id || "") === storyId) {
          storyNumber = i + 1;
          break;
        }
      }
    } else {
      var orderInBundle = parseInt(story.orderInBundle, 10);
      if (isFinite(orderInBundle) && orderInBundle > 0) storyNumber = orderInBundle;
    }

    if (!isFinite(storyNumber) || storyNumber < 1) storyNumber = 1;

    var rawStoryTitle = (story.titleEn || "").trim();
    var cleanedStoryTitle = rawStoryTitle
      .replace(/^\s*book\s*\d+\s*[|•·:\-]?\s*story\s*\d+\s*[:•·\-]\s*/i, "")
      .replace(/^\s*story\s*\d+\s*[:•·\-]\s*/i, "")
      .trim();
    if (!cleanedStoryTitle) cleanedStoryTitle = rawStoryTitle || "Story Reader";
    var storyTitlePa = (typeof story.titlePa === "string") ? story.titlePa.trim() : "";

    return {
      subtitle: "Book " + bundleId + " | Story " + storyNumber,
      titleEn: cleanedStoryTitle,
      titlePa: storyTitlePa,
      readingId: story.id || ""
    };
  },

  _updateReadingDetailHero: function(rd) {
    if (!rd) return;
    var heroMeta = Reading._getReadingDetailHeroMeta(rd);

    var titleEl = document.getElementById("reading-detail-title");
    if (titleEl) {
      titleEl.textContent = heroMeta.titleEn;
      titleEl.dataset.readingId = heroMeta.readingId;
    }

    var titlePaEl = document.getElementById("reading-detail-title-pa");
    if (titlePaEl) {
      titlePaEl.textContent = heroMeta.titlePa;
      if (heroMeta.titlePa) titlePaEl.setAttribute("lang", "pa");
      else titlePaEl.removeAttribute("lang");
    }

    var metaEl = document.getElementById("reading-detail-meta");
    if (metaEl) metaEl.textContent = heroMeta.subtitle;
  },

  _formatStorySelectorLabel: function(storyNum) {
    var n = parseInt(storyNum, 10);
    if (!isFinite(n) || n < 1) n = 1;
    return "Story " + n;
  },

  _getBundleCardStoryName: function(bundleId) {
    var story = Reading._getStoryForBookSelection(bundleId);
    if (!story) return "Story Reader";
    var heroMeta = Reading._getReadingDetailHeroMeta(story) || {};
    var title = (heroMeta.titleEn || "").trim();
    if (!title) title = (story.titleEn || "").trim();
    return title || "Story Reader";
  },

  _closeStorySelectorSheet: function(options) {
    var opts = options || {};
    var shouldRestoreFocus = opts.restoreFocus !== false;
    var sheet = document.getElementById("readingStorySheet");
    var trigger = Reading._storySheetTriggerEl;
    if (sheet) {
      sheet.hidden = true;
      sheet.setAttribute("aria-hidden", "true");
    }
    try {
      var openSelectors = document.querySelectorAll(".read-book-story-select[aria-expanded='true']");
      for (var i = 0; i < openSelectors.length; i++) {
        openSelectors[i].setAttribute("aria-expanded", "false");
      }
    } catch (eAriaReset) { /* no-op */ }
    Reading._storySheetBundleId = null;
    Reading._storySheetTriggerEl = null;

    if (shouldRestoreFocus && trigger && typeof trigger.focus === "function") {
      setTimeout(function() {
        try { trigger.focus({ preventScroll: true }); } catch (eFocus) { try { trigger.focus(); } catch (eFocus2) {} }
      }, 0);
    }
  },

  _openStorySelectorSheet: function(bundleId) {
    var sheet = document.getElementById("readingStorySheet");
    var list = document.getElementById("readingStorySheetList");
    var title = document.getElementById("readingStorySheetTitle");
    if (!sheet || !list) return;

    var bId = parseInt(bundleId, 10);
    if (!isFinite(bId) || bId < 1) bId = 1;
    Reading._storySheetBundleId = bId;
    Reading._storySheetTriggerEl = (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("read-book-story-select"))
      ? document.activeElement
      : null;

    try {
      var selectors = document.querySelectorAll(".read-book-story-select");
      for (var s = 0; s < selectors.length; s++) {
        var selectorBookId = parseInt(selectors[s].getAttribute("data-book-id"), 10);
        selectors[s].setAttribute("aria-expanded", (isFinite(selectorBookId) && selectorBookId === bId) ? "true" : "false");
      }
    } catch (eSelectors) { /* no-op */ }

    var bundleMeta = Reading._getBundleMeta(bId) || {};
    var bundleNameEn = bundleMeta.nameEn || ("Book " + bId);
    if (title) title.textContent = "Choose a story · " + bundleNameEn;
    var stories = Reading._getOrderedStoriesForBook(bId);
    var storyCount = stories.length;
    if (!storyCount || storyCount < 1) storyCount = 1;
    var selected = Reading._getSelectedStoryForBook(bId);
    if (selected > storyCount) selected = storyCount;
    list.innerHTML = "";
    for (var i = 1; i <= storyCount; i++) {
      var button = document.createElement("button");
      button.type = "button";
      var story = stories[i - 1] || {};
      var isDisabled = !!(story && (story.locked || story.disabled || story.isLocked || story.isUnavailable || story.unavailable));
      button.className = "reading-story-sheet__item" + (i === selected ? " is-selected" : "") + (isDisabled ? " is-disabled" : "");
      button.setAttribute("data-story-num", String(i));
      button.textContent = Reading._formatStorySelectorLabel(i);
      if (isDisabled) button.setAttribute("aria-disabled", "true");
      if (isDisabled) button.disabled = true;
      button.setAttribute("aria-selected", i === selected ? "true" : "false");
      if (i === selected) button.setAttribute("aria-current", "true");
      list.appendChild(button);
    }

    sheet.hidden = false;
    sheet.setAttribute("aria-hidden", "false");

    var focusTarget = list.querySelector(".reading-story-sheet__item.is-selected:not([disabled])") || list.querySelector(".reading-story-sheet__item:not([disabled])");
    if (focusTarget && typeof focusTarget.focus === "function") {
      setTimeout(function() {
        try { focusTarget.focus({ preventScroll: true }); } catch (eFocusOpen) { try { focusTarget.focus(); } catch (eFocusOpen2) {} }
      }, 0);
    }
  },

  _ensureStorySheetWired: function() {
    var sheet = document.getElementById("readingStorySheet");
    var closeBtn = document.getElementById("readingStorySheetClose");
    var backdrop = document.getElementById("readingStorySheetBackdrop");
    var list = document.getElementById("readingStorySheetList");
    if (!sheet || !closeBtn || !backdrop || !list) return;
    if (sheet.dataset && sheet.dataset.bound === "1") return;
    if (sheet.dataset) sheet.dataset.bound = "1";

    closeBtn.addEventListener("click", function() {
      Reading._closeStorySelectorSheet();
    });
    backdrop.addEventListener("click", function() {
      Reading._closeStorySelectorSheet();
    });

    sheet.addEventListener("keydown", function(e) {
      var key = (e && e.key) ? e.key : "";
      if (key !== "Escape") return;
      try { e.preventDefault(); } catch (ePreventEsc) {}
      Reading._closeStorySelectorSheet();
    });

    list.addEventListener("click", function(e) {
      var item = e.target && e.target.closest ? e.target.closest(".reading-story-sheet__item") : null;
      if (!item || item.disabled || item.getAttribute("aria-disabled") === "true") return;
      var storyNum = parseInt(item.getAttribute("data-story-num"), 10);
      var bundleId = Reading._storySheetBundleId;
      if (!isFinite(storyNum) || !isFinite(bundleId)) return;
      Reading._setSelectedStoryForBook(bundleId, storyNum);
      Reading._closeStorySelectorSheet();
      if (typeof Reading._readingBundleDeckRender === "function") Reading._readingBundleDeckRender();
    });
  },

  _ensureActiveBundleId: function() {
    var ids = Reading._getReadingBundleIds();
    if (!ids.length) {
      Reading._activeBundleId = null;
      return null;
    }
    if (ids.indexOf(Reading._activeBundleId) === -1) {
      Reading._activeBundleId = ids[0];
    }
    return Reading._activeBundleId;
  },

  _getBundleProgressMeta: function(bundleId) {
    var readings = Reading._getReadingsForBundle(bundleId);
    var completed = 0;
    var nextReadingId = null;
    for (var i = 0; i < readings.length; i++) {
      var rd = readings[i] || {};
      if (!nextReadingId && rd.id) nextReadingId = rd.id;
    }
    if (!nextReadingId && readings.length) nextReadingId = readings[0].id;
    return {
      completed: completed,
      total: readings.length,
      nextReadingId: nextReadingId
    };
  },

  _getLockedReadingQueue: function(bundleId) {
    var readings = Reading._getReadingsForBundle(bundleId);
    var queue = [];
    for (var i = 0; i < readings.length; i++) {
      var rd = readings[i] || {};
      if (rd.id) queue.push(rd);
    }
    return queue;
  },

  _buildReadingDeckEntries: function(bundleId) {
    var queue = Reading._getLockedReadingQueue(bundleId);
    var entries = [];

    if (!queue.length) {
      return [{
        kind: "empty",
        bundleId: bundleId
      }];
    }

    var currentIdx = 0;
    for (var c = 0; c < queue.length; c++) {
      if (c === 0) {
        currentIdx = 0;
        break;
      }
    }

    var previewWindow = 1;
    for (var i = 0; i < queue.length; i++) {
      var rd = queue[i] || {};
      var isCompleted = false;
      var isCurrent = i === currentIdx;
      var isPreviewLocked = false;
      entries.push({
        kind: "reading",
        id: rd.id,
        index: READINGS.findIndex(function(x) { return x && x.id === rd.id; }) + 1,
        titleEn: rd.titleEn,
        titlePa: rd.titlePa,
        levelHint: rd.levelHint,
        isCurrent: isCurrent,
        isPreviewLocked: isPreviewLocked,
        isCompleted: isCompleted
      });
    }

    var lockedAhead = entries.filter(function(e) { return e && e.kind === "reading" && e.isPreviewLocked; }).length;
    if (lockedAhead > 0) {
      entries.push({
        kind: "more",
        bundleId: bundleId
      });
    }
    return entries;
  },

  _renderBundleDeckCards: function(bundleIds) {
    var track = document.getElementById("readingBundleTrack");
    var dotsContainer = document.getElementById("readingBundleDots");
    if (!track || !dotsContainer) return;

    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    var activeBundleId = Reading._ensureActiveBundleId();
    var activeBundleIndex = 0;
    for (var ai = 0; ai < bundleIds.length; ai++) {
      if (bundleIds[ai] === activeBundleId) {
        activeBundleIndex = ai;
        break;
      }
    }
    for (var i = 0; i < bundleIds.length; i++) {
      var bundleId = bundleIds[i];
      var bundleMeta = Reading._getBundleMeta(bundleId) || {};
      var bundleNameEn = bundleMeta.nameEn || ("Book " + bundleId);
      var bundleNamePa = bundleMeta.namePa || ("ਕਿਤਾਬ " + bundleId);

      var card = document.createElement("article");
      card.className = "deck-card module-card deck-card--reading";
      card.setAttribute("data-index", String(i));
      card.setAttribute("data-kind", "bundle");
      card.setAttribute("data-bundle-id", String(bundleId));
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Select " + bundleNameEn);

      var title = document.createElement("h3");
      title.className = "deck-card-title";
      title.textContent = bundleNameEn;

      var kicker = document.createElement("div");
      kicker.className = "deck-card-kicker";
      kicker.textContent = "BOOK";

      var subtitle = document.createElement("p");
      subtitle.className = "deck-card-subtitle";
      subtitle.setAttribute("lang", "pa");
      subtitle.textContent = bundleNamePa;

      var storySelection = Reading._getSelectedStoryForBook(bundleId);

      var selector = document.createElement("button");
      selector.type = "button";
      selector.className = "read-book-story-select";
      selector.setAttribute("data-book-id", String(bundleId));
      selector.setAttribute("aria-label", "Choose story for " + bundleNameEn);
      selector.setAttribute("aria-haspopup", "dialog");
      selector.setAttribute("aria-controls", "readingStorySheet");
      selector.setAttribute("aria-expanded", "false");
      selector.textContent = Reading._formatStorySelectorLabel(storySelection);
      selector.addEventListener("pointerdown", function(e) {
        try { e.stopPropagation(); } catch (eStopPointerDown) {}
      });
      selector.addEventListener("touchstart", function(e) {
        try { e.stopPropagation(); } catch (eStopTouchStart) {}
      }, { passive: true });
      selector.addEventListener("click", function(e) {
        try { e.preventDefault(); } catch (e0) {}
        try { e.stopPropagation(); } catch (e1) {}
        var bookId = parseInt(this.getAttribute("data-book-id"), 10);
        if (isFinite(bookId)) Reading._openStorySelectorSheet(bookId);
      });

      var storyName = document.createElement("p");
      storyName.className = "read-book-story-name";
      storyName.setAttribute("data-book-id", String(bundleId));
      storyName.textContent = Reading._getBundleCardStoryName(bundleId);

      card.appendChild(kicker);
      card.appendChild(title);
      card.appendChild(subtitle);
      card.appendChild(selector);
      card.appendChild(storyName);
      track.appendChild(card);

    }

    var maxVisibleDots = 8;
    var totalCards = bundleIds.length;
    var visibleDots = Math.min(totalCards, maxVisibleDots);
    var dotStart = 0;
    if (totalCards > visibleDots) {
      dotStart = activeBundleIndex - Math.floor(visibleDots / 2);
      if (dotStart < 0) dotStart = 0;
      if (dotStart > (totalCards - visibleDots)) dotStart = totalCards - visibleDots;
    }

    for (var d = 0; d < visibleDots; d++) {
      var actualIndex = dotStart + d;
      var dotBundleId = bundleIds[actualIndex];
      var dotBundleMeta = Reading._getBundleMeta(dotBundleId) || {};
      var dotBundleNameEn = dotBundleMeta.nameEn || ("Book " + dotBundleId);
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "deck-dot";
      dot.setAttribute("data-index", String(actualIndex));
      dot.setAttribute("aria-label", "Go to " + dotBundleNameEn);
      dotsContainer.appendChild(dot);
    }
  },

  _ensureReadingBundleDeckWired: function() {
    var root = document.getElementById("readingBundleDeck");
    var viewport = document.getElementById("readingBundleViewport");
    var track = document.getElementById("readingBundleTrack");
    var dotsContainer = document.getElementById("readingBundleDots");
    var progressText = document.getElementById("readingBundleProgressText");
    var progressHost = document.querySelector("#screen-reading .read-hero-progress");
    var prevBtn = document.getElementById("btn-reading-prev-bundle");
    var nextBtn = document.getElementById("btn-reading-next-bundle");
    var startBtn = document.getElementById("btn-reading-book-start");
    if (!root || !track || !dotsContainer) return;
    if (root.dataset && root.dataset.readingBundleDeckBound === "1") return;
    if (root.dataset) root.dataset.readingBundleDeckBound = "1";

    Reading._readingBundleDeckUi = {
      activeIndex: 0,
      peekDirection: 1,
      suppressCardClickUntil: 0,
      reduceMotion: false,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchDragging: false,
      touchMoved: false,
      pointerStartX: null,
      pointerCurrentX: null,
      pointerDragging: false,
      pointerId: null,
      pointerMoved: false,
      wheelAccumX: 0,
      wheelLastTs: 0
    };

    try {
      Reading._readingBundleDeckUi.reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (eReduce) {
      Reading._readingBundleDeckUi.reduceMotion = false;
    }
    if (Reading._readingBundleDeckUi.reduceMotion) {
      try { track.style.transition = "none"; } catch (eTrackTransition0) {}
    }

    function getCards() {
      return Array.prototype.slice.call(track.querySelectorAll(".deck-card"));
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function wrappedDelta(index, current, total) {
      var delta = index - current;
      if (total <= 2) return delta;
      var half = total / 2;
      if (delta > half) delta -= total;
      else if (delta < -half) delta += total;
      return delta;
    }

    function applyBundleDeckLook(progress) {
      var state = Reading._readingBundleDeckUi;
      var cards = getCards();
      if (!cards.length) return;

      if (state.reduceMotion) {
        root.classList.toggle("is-swipe-moving", false);
        for (var r = 0; r < cards.length; r++) {
          cards[r].style.transform = "";
          cards[r].style.opacity = "";
          cards[r].style.filter = "";
          cards[r].style.zIndex = "";
        }
        return;
      }

      var p = (typeof progress === "number" && isFinite(progress)) ? clamp(progress, -1.0, 1.0) : 0;
      root.classList.toggle("is-swipe-moving", Math.abs(p) > 0.015);

      for (var i = 0; i < cards.length; i++) {
        var baseDelta = wrappedDelta(i, state.activeIndex, cards.length);
        var rel = baseDelta + p;
        var absRel = Math.abs(rel);
        var depthFactor = clamp(absRel, 0, 2.2);
        var isActiveCard = i === state.activeIndex;
        var isPeekCard = !isActiveCard && baseDelta === state.peekDirection;
        var slideX = 0;
        var scale = 1;
        var liftY = 0;
        var rotateY = 0;
        var opacity = 1;
        var saturate = 1;
        var brightness = 1;
        var z = 620;

        if (isActiveCard) {
          slideX = clamp(rel, -1.0, 1.0) * -18;
          scale = 1 - (Math.min(depthFactor, 1.0) * 0.014);
          liftY = Math.round(Math.min(depthFactor, 1.0) * 1);
          rotateY = clamp(rel * -2.8, -4, 4);
          z = 700;
        } else if (isPeekCard) {
          slideX = clamp(rel, -1.5, 1.5) * -34;
          scale = 0.97 - (Math.min(depthFactor, 1.6) * 0.018);
          liftY = 4 + Math.round(Math.min(depthFactor, 1.5) * 2);
          rotateY = clamp(rel * -3.2, -5, 5);
          opacity = 0.74 - (Math.min(depthFactor, 1.7) * 0.08);
          saturate = 0.9 - (Math.min(depthFactor, 1.6) * 0.05);
          brightness = 0.98;
          z = 420 - Math.round(depthFactor * 22);
        } else {
          slideX = clamp(rel, -2.0, 2.0) * -12;
          scale = 0.92 - (Math.min(depthFactor, 2.0) * 0.02);
          liftY = 7 + Math.round(Math.min(depthFactor, 1.8) * 3);
          rotateY = clamp(rel * -2.2, -4, 4);
          opacity = 0.32;
          saturate = 0.72;
          brightness = 0.94;
          z = 170;
        }
        if (z < 90) z = 90;

        cards[i].style.transform = "translateX(" + slideX.toFixed(2) + "%) translateY(" + liftY + "px) scale(" + scale.toFixed(3) + ") rotateY(" + rotateY.toFixed(2) + "deg)";
        cards[i].style.opacity = opacity.toFixed(3);
        cards[i].style.filter = "saturate(" + saturate.toFixed(3) + ") brightness(" + brightness.toFixed(3) + ")";
        cards[i].style.zIndex = String(z);
      }
    }

    function render() {
      var cards = getCards();
      if (!cards.length) return;
      var i = Reading._readingBundleDeckUi.activeIndex | 0;
      if (i < 0) i = 0;
      if (i >= cards.length) i = cards.length - 1;
      Reading._readingBundleDeckUi.activeIndex = i;
      var isAtStart = i === 0;
      var isAtEnd = i === (cards.length - 1);
      try {
        root.classList.toggle('is-at-start', isAtStart);
        root.classList.toggle('is-at-end', isAtEnd);
        if (progressHost) {
          progressHost.classList.toggle('is-at-start', isAtStart);
          progressHost.classList.toggle('is-at-end', isAtEnd);
        }
      } catch (eDeckState) {}
      track.style.transform = "translateX(-" + (i * 100) + "%)";

      for (var c = 0; c < cards.length; c++) {
        var isActive = c === i;
        var delta = wrappedDelta(c, i, cards.length);
        var cardBundleId = parseInt(cards[c].getAttribute("data-bundle-id"), 10);
        if (isFinite(cardBundleId)) {
          var selector = cards[c].querySelector(".read-book-story-select");
          if (selector) {
            var selectedStoryNum = Reading._getSelectedStoryForBook(cardBundleId);
            var selectorLabel = Reading._formatStorySelectorLabel(selectedStoryNum);
            selector.textContent = selectorLabel;
            selector.setAttribute("aria-label", "Choose story for Book " + cardBundleId + ": " + selectorLabel);
          }
          var storyNameEl = cards[c].querySelector(".read-book-story-name");
          if (storyNameEl) {
            storyNameEl.textContent = Reading._getBundleCardStoryName(cardBundleId);
          }
        }
        cards[c].classList.toggle("is-active", isActive);
        cards[c].classList.toggle("is-stack-prev", delta === -1);
        cards[c].classList.toggle("is-stack-next", delta === 1);
        cards[c].classList.toggle("is-stack-far", Math.abs(delta) >= 2);
        cards[c].classList.toggle("is-stack-peek", !isActive && delta === Reading._readingBundleDeckUi.peekDirection);
        cards[c].classList.toggle("is-stack-muted", !isActive && delta !== Reading._readingBundleDeckUi.peekDirection);
        cards[c].setAttribute("aria-hidden", isActive ? "false" : "true");
        cards[c].setAttribute("tabindex", isActive ? "0" : "-1");
      }
      var dots = dotsContainer.querySelectorAll(".deck-dot");
      for (var d = 0; d < dots.length; d++) {
        var dotIndex = parseInt(dots[d].getAttribute("data-index"), 10);
        var isDotActive = isFinite(dotIndex) ? (dotIndex === i) : (d === i);
        dots[d].classList.toggle("is-active", isDotActive);
        dots[d].setAttribute("aria-pressed", isDotActive ? "true" : "false");
        if (isDotActive) dots[d].setAttribute("aria-current", "true");
        else dots[d].removeAttribute("aria-current");
      }

      var disableNav = cards.length <= 1;
      if (nextBtn) {
        nextBtn.disabled = disableNav;
        nextBtn.hidden = disableNav;
        nextBtn.setAttribute("aria-disabled", disableNav ? "true" : "false");
        nextBtn.setAttribute("aria-hidden", disableNav ? "true" : "false");
        nextBtn.classList.toggle('is-endpoint-fade', !disableNav && isAtEnd);
      }
      if (prevBtn) {
        prevBtn.disabled = disableNav;
        prevBtn.hidden = disableNav;
        prevBtn.setAttribute("aria-disabled", disableNav ? "true" : "false");
        prevBtn.setAttribute("aria-hidden", disableNav ? "true" : "false");
        prevBtn.classList.toggle('is-endpoint-fade', !disableNav && isAtStart);
      }

      if (dotsContainer) {
        dotsContainer.style.display = disableNav ? "none" : "flex";
      }

      if (progressText) {
        progressText.textContent = (i + 1) + "/" + cards.length;
      }

      var active = cards[i];
      if (active) {
        var bundleId = parseInt(active.getAttribute("data-bundle-id"), 10);
        if (isFinite(bundleId) && bundleId !== Reading._activeBundleId) {
          Reading._activeBundleId = bundleId;
        }
        Reading._setReadingDeckUiStateSafe({ bundleIndex: i });
      }

      if (startBtn && active) {
        var activeBundleId = parseInt(active.getAttribute("data-bundle-id"), 10);
        var activeStoryNum = isFinite(activeBundleId) ? Reading._getSelectedStoryForBook(activeBundleId) : 1;
        var en = startBtn.querySelector(".btn-label-en");
        var pa = startBtn.querySelector(".btn-label-pa");
        if (en) en.textContent = "Start Story " + activeStoryNum;
        if (pa) pa.textContent = "ਕਹਾਣੀ ਸ਼ੁਰੂ ਕਰੋ";
      }

      syncCardHeights(cards);

      applyBundleDeckLook(0);
    }

    function syncCardHeights(cards) {
      if (!cards || !cards.length) return;
      var maxHeight = 0;
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.minHeight = "";
      }
      for (var j = 0; j < cards.length; j++) {
        var h = 0;
        try { h = cards[j].offsetHeight || 0; } catch (eH) { h = 0; }
        if (h > maxHeight) maxHeight = h;
      }
      if (!(maxHeight > 0)) return;
      for (var k = 0; k < cards.length; k++) {
        cards[k].style.minHeight = maxHeight + "px";
      }
    }

    function goTo(index) {
      var cards = getCards();
      if (!cards.length) return;
      var currentIndex = Reading._readingBundleDeckUi.activeIndex | 0;
      var i = index;
      while (i < 0) i += cards.length;
      i = i % cards.length;
      var direction = 0;
      try {
        var toward = wrappedDelta(i, currentIndex, cards.length);
        if (toward !== 0) direction = toward > 0 ? 1 : -1;
      } catch (eToward) {}

      try {
        var host = progressHost || root;
        if (host && direction) {
          if (typeof nudgeCounterIndicator === 'function') {
            nudgeCounterIndicator(host, direction);
          } else {
            var cls = direction > 0 ? 'indicator-shift-next' : 'indicator-shift-prev';
            host.classList.remove('indicator-shift-next', 'indicator-shift-prev');
            void host.offsetWidth;
            host.classList.add(cls);
            window.setTimeout(function() {
              try { host.classList.remove(cls); } catch (eReadingNudgeRemove) {}
            }, 220);
          }
        }
      } catch (eReadingNudge) {}

      Reading._setReadingDeckUiStateSafe({ bundleIndex: i, storyIndex: 0 });
      Reading._readingBundleDeckUi.activeIndex = i;
      render();
    }

    function isControlTarget(evt) {
      var t = evt && evt.target;
      if (!t || !t.closest) return false;
      return !!t.closest("#btn-reading-prev-bundle, #btn-reading-next-bundle, #readingBundleDots .deck-dot, .read-book-story-select, #readingStorySheet, #readingStorySheetBackdrop, #readingStorySheetClose, .reading-story-sheet__item");
    }

    function stopTouchDrag(commit, fallbackDeltaX) {
      var state = Reading._readingBundleDeckUi;
      if (state.touchStartX == null) return;
      var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
        ? fallbackDeltaX
        : ((state.touchCurrentX == null || state.touchStartX == null) ? 0 : (state.touchCurrentX - state.touchStartX));
      var threshold = (typeof getDeckSwipeThresholdPx === "function")
        ? getDeckSwipeThresholdPx(viewport)
        : Math.max(36, Math.round(((viewport && viewport.clientWidth) ? viewport.clientWidth : 0) * 0.18));

      state.touchStartX = null;
      state.touchStartY = null;
      state.touchCurrentX = null;

      if (!state.touchDragging) return;
      state.touchDragging = false;

      if (!state.reduceMotion) {
        try { track.style.transition = (typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.swipeSnapTransition) ? BOLO_DECK_UX.swipeSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)"; } catch (eTouchTransition) {}
      }

      if (!commit) {
        render();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.suppressClickMs) ? BOLO_DECK_UX.suppressClickMs : 260);
        if (deltaX > 0) goTo(state.activeIndex + 1);
        else goTo(state.activeIndex - 1);
        return;
      }

      render();
    }

    function stopPointerDrag(commit) {
      var state = Reading._readingBundleDeckUi;
      if (!state.pointerDragging) return;
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var deltaX = (state.pointerCurrentX == null || state.pointerStartX == null) ? 0 : (state.pointerCurrentX - state.pointerStartX);
      var threshold = (typeof getDeckSwipeThresholdPx === "function")
        ? getDeckSwipeThresholdPx(viewport)
        : Math.max(36, Math.round(width * 0.18));

      state.pointerDragging = false;
      state.pointerStartX = null;
      state.pointerCurrentX = null;
      state.pointerId = null;

      if (!state.reduceMotion) {
        try { track.style.transition = (typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.pointerSnapTransition) ? BOLO_DECK_UX.pointerSnapTransition : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)"; } catch (ePointerTransition) {}
      }

      if (!commit) {
        render();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.suppressClickMs) ? BOLO_DECK_UX.suppressClickMs : 260);
        if (deltaX > 0) goTo(state.activeIndex + 1);
        else goTo(state.activeIndex - 1);
        return;
      }

      render();
    }

    track.addEventListener("click", function(e) {
      var selector = e.target && e.target.closest ? e.target.closest(".read-book-story-select") : null;
      if (selector) {
        try { e.preventDefault(); } catch (ePreventSel) {}
        try { e.stopPropagation(); } catch (eStopSel) {}
        var cardForSelector = selector.closest ? selector.closest(".deck-card") : null;
        if (cardForSelector) {
          var idxForSelector = parseInt(cardForSelector.getAttribute("data-index"), 10);
          if (isFinite(idxForSelector)) goTo(idxForSelector);
        }
        var bookId = parseInt(selector.getAttribute("data-book-id"), 10);
        if (isFinite(bookId)) Reading._openStorySelectorSheet(bookId);
        return;
      }

      if (Date.now() < Reading._readingBundleDeckUi.suppressCardClickUntil) return;
      var card = e.target && e.target.closest ? e.target.closest(".deck-card") : null;
      if (!card) return;
      var idx = parseInt(card.getAttribute("data-index"), 10);
      if (isFinite(idx)) goTo(idx);
    });

    track.addEventListener("keydown", function(e) {
      var card = e.target && e.target.closest ? e.target.closest(".deck-card") : null;
      if (!card) return;
      var key = e.key || "";
      if (key !== "Enter" && key !== " ") return;
      e.preventDefault();
      var idx = parseInt(card.getAttribute("data-index"), 10);
      if (isFinite(idx)) goTo(idx);
    });

    dotsContainer.addEventListener("click", function(e) {
      var dot = e.target && e.target.closest ? e.target.closest(".deck-dot") : null;
      if (!dot) return;
      var idx = parseInt(dot.getAttribute("data-index"), 10);
      if (isFinite(idx)) goTo(idx);
    });

    if (nextBtn) nextBtn.addEventListener("click", function() { goTo(Reading._readingBundleDeckUi.activeIndex + 1); });
    if (prevBtn) prevBtn.addEventListener("click", function() { goTo(Reading._readingBundleDeckUi.activeIndex - 1); });

    if (startBtn) {
      startBtn.addEventListener("click", function() {
        var cards = getCards();
        if (!cards.length) return;
        var active = cards[Reading._readingBundleDeckUi.activeIndex] || cards[0];
        if (!active) return;
        var bookId = parseInt(active.getAttribute("data-bundle-id"), 10);
        if (!isFinite(bookId)) return;
        var story = Reading._getStoryForBookSelection(bookId);
        if (story && story.id) {
          Reading.openReadingDetail(story.id);
        }
      });
    }

    root.addEventListener("keydown", function(e) {
      var key = e.key || "";
      if (key === "ArrowRight") {
        e.preventDefault();
        goTo(Reading._readingBundleDeckUi.activeIndex + 1);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        goTo(Reading._readingBundleDeckUi.activeIndex - 1);
      }
    });

    if (viewport) {
      viewport.addEventListener("touchstart", function(e) {
        var state = Reading._readingBundleDeckUi;
        if (isControlTarget(e)) {
          state.touchStartX = null;
          state.touchStartY = null;
          state.touchCurrentX = null;
          state.touchDragging = false;
          state.touchMoved = false;
          return;
        }
        if (!e.touches || !e.touches.length) return;
        state.touchStartX = e.touches[0].clientX;
        state.touchStartY = e.touches[0].clientY;
        state.touchCurrentX = state.touchStartX;
        state.touchDragging = true;
        state.touchMoved = false;
      }, { passive: true });

      viewport.addEventListener("touchmove", function(e) {
        var state = Reading._readingBundleDeckUi;
        if (!state.touchDragging || state.touchStartX == null || !e.touches || !e.touches.length) return;
        var touch = e.touches[0];
        state.touchCurrentX = touch.clientX;
        var currentY = touch.clientY;
        var deltaX = state.touchCurrentX - state.touchStartX;
        var deltaY = (state.touchStartY == null) ? 0 : (currentY - state.touchStartY);

        if (!state.touchMoved) {
          var horizontalIntent = (typeof hasDeckHorizontalIntent === "function")
            ? hasDeckHorizontalIntent(deltaX, deltaY)
            : (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1);
          if (!horizontalIntent) return;
          state.touchMoved = true;
          if (!state.reduceMotion) {
            try { track.style.transition = "none"; } catch (eTouchMoveTransition) {}
          }
        }

        var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
        var basePx = state.activeIndex * width;
        var targetPx = -basePx + deltaX;
        track.style.transform = "translateX(" + targetPx + "px)";
        if (width > 0) {
          if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
          applyBundleDeckLook(deltaX / width);
        }
        try { e.preventDefault(); } catch (eTouchPrevent) {}
      }, { passive: false });

      viewport.addEventListener("touchend", function(e) {
        var state = Reading._readingBundleDeckUi;
        if (state.touchStartX == null) return;
        var touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
        if (!touch) {
          stopTouchDrag(false, 0);
          return;
        }
        var deltaX = touch.clientX - state.touchStartX;
        if (state.touchMoved) {
          stopTouchDrag(true, deltaX);
          return;
        }

        state.touchDragging = false;
        state.touchStartX = null;
        state.touchStartY = null;
        state.touchCurrentX = null;
        if (Math.abs(deltaX) < 36) return;
        if (deltaX > 0) goTo(state.activeIndex + 1);
        else goTo(state.activeIndex - 1);
      }, { passive: true });

      viewport.addEventListener("touchcancel", function() {
        stopTouchDrag(false, 0);
      }, { passive: true });

      viewport.addEventListener("pointerdown", function(evt) {
        var state = Reading._readingBundleDeckUi;
        if (!evt || evt.pointerType === "touch") return;
        if (evt.button != null && evt.button !== 0) return;
        if (isControlTarget(evt)) return;

        state.pointerId = evt.pointerId;
        state.pointerStartX = evt.clientX;
        state.pointerCurrentX = evt.clientX;
        state.pointerDragging = true;
        state.pointerMoved = false;
        try { viewport.setPointerCapture(state.pointerId); } catch (eCapture) {}
        if (!state.reduceMotion) {
          try { track.style.transition = "none"; } catch (eTrackTransition3) {}
        }
      });

      viewport.addEventListener("pointermove", function(evt) {
        var state = Reading._readingBundleDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;

        state.pointerCurrentX = evt.clientX;
        var deltaX = state.pointerCurrentX - state.pointerStartX;
        if (Math.abs(deltaX) > 3) state.pointerMoved = true;
        if (!state.pointerMoved) return;

        var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
        var basePx = state.activeIndex * width;
        var targetPx = -basePx + deltaX;
        track.style.transform = "translateX(" + targetPx + "px)";
        if (width > 0) {
          if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
          applyBundleDeckLook(deltaX / width);
        }
        try { evt.preventDefault(); } catch (ePrevent) {}
      });

      viewport.addEventListener("pointerup", function(evt) {
        var state = Reading._readingBundleDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
        stopPointerDrag(true);
      });

      viewport.addEventListener("pointercancel", function(evt) {
        var state = Reading._readingBundleDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
        stopPointerDrag(false);
      });

      viewport.addEventListener("pointerleave", function() {
        if (!Reading._readingBundleDeckUi.pointerDragging) return;
        stopPointerDrag(true);
      });

      viewport.addEventListener("wheel", function(evt) {
        if (!evt || isControlTarget(evt)) return;
        var state = Reading._readingBundleDeckUi;
        var dx = (typeof evt.deltaX === "number" && isFinite(evt.deltaX)) ? evt.deltaX : 0;
        var dy = (typeof evt.deltaY === "number" && isFinite(evt.deltaY)) ? evt.deltaY : 0;
        if (Math.abs(dx) < 1 && evt.shiftKey) dx = dy;

        var absX = Math.abs(dx);
        var absY = Math.abs(dy);
        var horizontalIntent = absX > 6 && absX >= (absY * 0.85);
        if (!horizontalIntent) return;

        var now = Date.now();
        if (now - state.wheelLastTs > ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.wheelResetMs) ? BOLO_DECK_UX.wheelResetMs : 280)) state.wheelAccumX = 0;
        state.wheelLastTs = now;
        state.wheelAccumX += dx;
        try { evt.preventDefault(); } catch (eWheelPrevent) {}

        if (Math.abs(state.wheelAccumX) < ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.wheelTriggerPx) ? BOLO_DECK_UX.wheelTriggerPx : 54)) return;
        state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== "undefined" && BOLO_DECK_UX.suppressWheelClickMs) ? BOLO_DECK_UX.suppressWheelClickMs : 180);
        if (state.wheelAccumX > 0) goTo(state.activeIndex + 1);
        else goTo(state.activeIndex - 1);
        state.wheelAccumX = 0;
      }, { passive: false });
    }

    Reading._readingBundleDeckRender = render;
    Reading._ensureStorySheetWired();
  },

  _renderReadingDeckCards: function(entries) {
    var track = document.getElementById("readingDeckTrack");
    if (!track) return;

    track.innerHTML = "";

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i] || {};
      var card = document.createElement("article");
      card.className = "deck-card module-card deck-card--reading";
      card.setAttribute("data-index", String(i));
      card.setAttribute("tabindex", "0");

      var kicker = document.createElement("div");
      kicker.className = "deck-card-kicker";
      var title = document.createElement("h3");
      title.className = "deck-card-title";

      var subtitle = document.createElement("p");
      subtitle.className = "deck-card-subtitle";
      subtitle.setAttribute("lang", "pa");

      var meta = document.createElement("div");
      meta.className = "deck-meta";

      if (entry.kind === "more") {
        card.classList.add("deck-card--more");
        card.classList.add("reading-deck-card--locked");
        card.setAttribute("data-kind", "more");
        kicker.textContent = "STEP 2 · CHOOSE STORY";
        title.textContent = "More stories ahead";
        subtitle.textContent = "ਹੋਰ ਕਹਾਣੀਆਂ ਆ ਰਹੀਆਂ ਹਨ";
        meta.textContent = "Finish current stories to open this card";
      } else if (entry.kind === "empty") {
        card.classList.add("deck-card--more");
        card.classList.add("reading-deck-card--locked");
        card.setAttribute("data-kind", "empty");
        kicker.textContent = "STEP 2 · CHOOSE STORY";
        title.textContent = "No content yet";
        subtitle.textContent = "ਇਸ ਬੰਡਲ ਵਿੱਚ ਹਾਲੇ ਸਮੱਗਰੀ ਨਹੀਂ";
        meta.textContent = "Add stories to this bundle to begin reading";
      } else {
        card.setAttribute("data-kind", "reading");
        card.setAttribute("data-reading-id", String(entry.id || ""));
        if (entry.isPreviewLocked) card.classList.add("deck-preview-locked");
        if (entry.isPreviewLocked) card.classList.add("reading-deck-card--locked");
        if (entry.isCompleted) card.classList.add("reading-deck-card--completed");
        if (entry.isCurrent) card.classList.add("reading-deck-card--current");
        kicker.textContent = "STEP 2 · CHOOSE STORY";
        var storyTitleEn = "R" + (entry.index || i + 1) + ": " + (entry.titleEn || "Story");
        var storyTitlePa = entry.titlePa || "ਕਹਾਣੀ";
        card.setAttribute("data-reading-title-en", storyTitleEn);
        card.setAttribute("data-reading-title-pa", storyTitlePa);
        title.textContent = storyTitleEn;
        subtitle.textContent = storyTitlePa;
        if (entry.isPreviewLocked) {
          meta.textContent = "Preview card: complete earlier reads first";
        } else {
          meta.textContent = "Level: " + (entry.levelHint || "Easy");
        }
      }

      card.appendChild(kicker);
      card.appendChild(title);
      card.appendChild(subtitle);
      card.appendChild(meta);
      track.appendChild(card);
    }
  },

  _ensureReadingDeckWired: function() {
    var root = document.getElementById("readingSwipeDeck");
    var viewport = document.getElementById("readingDeckViewport");
    var track = document.getElementById("readingDeckTrack");
    var progressBar = document.getElementById("readingDeckProgressBar");
    var progressFill = document.getElementById("readingDeckProgressFill");
    var prevBtn = document.getElementById("btn-reading-prev-deck");
    var nextBtn = document.getElementById("btn-reading-next-deck");
    var progressText = document.getElementById("readingDeckProgressText");
    var startBtn = document.getElementById("btn-reading-deck-start");
    var hint = document.getElementById("readingSwipeHint");
    if (!root || !track || !startBtn) return;
    if (root.dataset && root.dataset.readingDeckBound === "1") return;
    if (root.dataset) root.dataset.readingDeckBound = "1";

    Reading._readingDeckUi = {
      activeIndex: 0,
      peekDirection: 1,
      suppressCardClickUntil: 0,
      reduceMotion: false,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchDragging: false,
      touchMoved: false,
      pointerStartX: null,
      pointerCurrentX: null,
      pointerDragging: false,
      pointerId: null,
      pointerMoved: false,
      wheelAccumX: 0,
      wheelLastTs: 0
    };

    try {
      Reading._readingDeckUi.reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (eReduce) {
      Reading._readingDeckUi.reduceMotion = false;
    }
    if (Reading._readingDeckUi.reduceMotion) {
      try { track.style.transition = "none"; } catch (eTrackTransition0) {}
    }

    function getCards() {
      return Array.prototype.slice.call(track.querySelectorAll(".deck-card"));
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function wrappedDelta(index, current, total) {
      var delta = index - current;
      if (total <= 2) return delta;
      var half = total / 2;
      if (delta > half) delta -= total;
      else if (delta < -half) delta += total;
      return delta;
    }

    function applyStoryDeckLook(progress) {
      var state = Reading._readingDeckUi;
      var cards = getCards();
      if (!cards.length) return;

      if (state.reduceMotion) {
        root.classList.toggle("is-swipe-moving", false);
        for (var r = 0; r < cards.length; r++) {
          cards[r].style.transform = "";
          cards[r].style.opacity = "";
          cards[r].style.filter = "";
          cards[r].style.zIndex = "";
        }
        return;
      }

      var p = (typeof progress === "number" && isFinite(progress)) ? clamp(progress, -1.2, 1.2) : 0;
      root.classList.toggle("is-swipe-moving", Math.abs(p) > 0.015);

      for (var i = 0; i < cards.length; i++) {
        var baseDelta = wrappedDelta(i, state.activeIndex, cards.length);
        var rel = baseDelta + p;
        var absRel = Math.abs(rel);
        var depthFactor = clamp(absRel, 0, 2.2);
        var isActiveCard = i === state.activeIndex;
        var isPeekCard = !isActiveCard && baseDelta === state.peekDirection;
        var slideX = 0;
        var scale = 1;
        var liftY = 0;
        var rotateY = 0;
        var opacity = 1;
        var saturate = 1;
        var brightness = 1;
        var z = 620;

        if (isActiveCard) {
          slideX = clamp(rel, -1.2, 1.2) * -44;
          scale = 1 - (Math.min(depthFactor, 1.2) * 0.04);
          liftY = Math.round(Math.min(depthFactor, 1.0) * 3);
          rotateY = clamp(rel * -8, -10, 10);
        } else if (isPeekCard) {
          slideX = clamp(rel, -1.6, 1.6) * -42;
          scale = 0.9 - (Math.min(depthFactor, 1.7) * 0.04);
          liftY = Math.round(Math.min(depthFactor, 1.5) * 11);
          rotateY = clamp(rel * -11, -14, 14);
          opacity = 0.5 - (Math.min(depthFactor, 2.0) * 0.08);
          saturate = 0.8 - (Math.min(depthFactor, 1.8) * 0.08);
          brightness = 0.94;
          z = 290 - Math.round(depthFactor * 45);
        } else {
          slideX = clamp(rel, -1.8, 1.8) * -24;
          scale = 0.84 - (Math.min(depthFactor, 2.0) * 0.02);
          liftY = Math.round(Math.min(depthFactor, 1.8) * 14);
          rotateY = clamp(rel * -7, -10, 10);
          opacity = 0.12;
          saturate = 0.56;
          brightness = 0.88;
          z = 95;
        }
        if (z < 90) z = 90;

        cards[i].style.transform = "translateX(" + slideX.toFixed(2) + "%) translateY(" + liftY + "px) scale(" + scale.toFixed(3) + ") rotateY(" + rotateY.toFixed(2) + "deg)";
        cards[i].style.opacity = opacity.toFixed(3);
        cards[i].style.filter = "saturate(" + saturate.toFixed(3) + ") brightness(" + brightness.toFixed(3) + ")";
        cards[i].style.zIndex = String(z);
      }
    }

    function hideHint() {
      if (!hint) return;
      hint.style.display = "none";
      try { localStorage.setItem("readDeckHintSeen_v2", "1"); } catch (e) {}
    }

    function updateStartCta() {
      var cards = getCards();
      var card = cards[Reading._readingDeckUi.activeIndex] || cards[0];
      var en = startBtn.querySelector(".btn-label-en");
      var pa = startBtn.querySelector(".btn-label-pa");
      var isMore = !card || card.getAttribute("data-kind") === "more";
      var isEmpty = !!(card && card.getAttribute("data-kind") === "empty");
      var isPreviewLocked = !!(card && card.classList && card.classList.contains("deck-preview-locked"));

      if (isEmpty) {
        startBtn.disabled = true;
        startBtn.setAttribute("aria-disabled", "true");
        startBtn.classList.remove("is-current-target");
        if (en) en.textContent = "No content";
        if (pa) pa.textContent = "ਸਮੱਗਰੀ ਨਹੀਂ";
        return;
      }

      if (isMore) {
        startBtn.disabled = true;
        startBtn.setAttribute("aria-disabled", "true");
        startBtn.classList.remove("is-current-target");
        if (en) en.textContent = "More ahead";
        if (pa) pa.textContent = "ਹੋਰ ਆਉਣੇ ਹਨ";
        return;
      }

      if (isPreviewLocked) {
        startBtn.disabled = true;
        startBtn.setAttribute("aria-disabled", "true");
        startBtn.classList.remove("is-current-target");
        if (en) en.textContent = "Locked preview";
        if (pa) pa.textContent = "ਲਾਕ ਪੂਰਵ-ਝਲਕ";
        return;
      }

      startBtn.disabled = false;
      startBtn.setAttribute("aria-disabled", "false");
      startBtn.classList.add("is-current-target");
      if (en) en.textContent = "Start Story";
      if (pa) pa.textContent = "ਕਹਾਣੀ ਸ਼ੁਰੂ ਕਰੋ";
    }

    function render() {
      var cards = getCards();
      if (!cards.length) return;
      var i = Reading._readingDeckUi.activeIndex | 0;
      if (i < 0) i = 0;
      if (i >= cards.length) i = cards.length - 1;
      Reading._readingDeckUi.activeIndex = i;
      track.style.transform = "translateX(-" + (i * 100) + "%)";

      for (var c = 0; c < cards.length; c++) {
        var isActive = c === i;
        var delta = wrappedDelta(c, i, cards.length);
        cards[c].classList.toggle("is-active", isActive);
        cards[c].classList.toggle("is-stack-prev", delta === -1);
        cards[c].classList.toggle("is-stack-next", delta === 1);
        cards[c].classList.toggle("is-stack-far", Math.abs(delta) >= 2);
        cards[c].classList.toggle("is-stack-peek", !isActive && delta === Reading._readingDeckUi.peekDirection);
        cards[c].classList.toggle("is-stack-muted", !isActive && delta !== Reading._readingDeckUi.peekDirection);
        cards[c].setAttribute("aria-hidden", isActive ? "false" : "true");
        cards[c].setAttribute("tabindex", isActive ? "0" : "-1");
      }
      if (progressFill) {
        var progressRatio = cards.length > 1 ? (i / (cards.length - 1)) : 1;
        progressFill.style.width = Math.round(progressRatio * 100) + "%";
      }
      if (progressBar) {
        progressBar.setAttribute("aria-valuemin", "1");
        progressBar.setAttribute("aria-valuemax", String(cards.length));
        progressBar.setAttribute("aria-valuenow", String(i + 1));
      }
      if (progressText) {
        progressText.textContent = (i + 1) + "/" + cards.length;
      }

      var disableNav = cards.length <= 1;
      if (nextBtn) {
        nextBtn.disabled = disableNav;
        nextBtn.setAttribute("aria-disabled", disableNav ? "true" : "false");
      }
      if (prevBtn) {
        prevBtn.disabled = disableNav;
        prevBtn.setAttribute("aria-disabled", disableNav ? "true" : "false");
      }

      updateStartCta();
      applyStoryDeckLook(0);
    }

    function goTo(index, interacted) {
      var cards = getCards();
      if (!cards.length) return;
      var prevIndex = Reading._readingDeckUi.activeIndex | 0;
      var i = index;
      while (i < 0) i += cards.length;
      i = i % cards.length;
      if (i !== prevIndex) {
        try {
          var storyProgressHost = document.querySelector('#screen-reading .read-hero-progress');
          var storyNudgeHost = storyProgressHost || root;
          var storyDirection = i > prevIndex ? 1 : -1;
          if (storyNudgeHost && storyDirection) {
            if (typeof nudgeCounterIndicator === 'function') {
              nudgeCounterIndicator(storyNudgeHost, storyDirection);
            } else {
              var storyCls = storyDirection > 0 ? 'indicator-shift-next' : 'indicator-shift-prev';
              storyNudgeHost.classList.remove('indicator-shift-next', 'indicator-shift-prev');
              void storyNudgeHost.offsetWidth;
              storyNudgeHost.classList.add(storyCls);
              window.setTimeout(function() {
                try { storyNudgeHost.classList.remove(storyCls); } catch (eStoryNudgeRemove) {}
              }, 220);
            }
          }
        } catch (eStoryNudge) {}
      }
      Reading._readingDeckUi.activeIndex = i;
      Reading._setReadingDeckUiStateSafe({ storyIndex: i });
      render();
      if (interacted) hideHint();
    }

    function isControlTarget(evt) {
      var t = evt && evt.target;
      if (!t || !t.closest) return false;
      return !!t.closest("#btn-reading-prev-deck, #btn-reading-next-deck, #btn-reading-deck-start");
    }

    function stopTouchDrag(commit, fallbackDeltaX) {
      var state = Reading._readingDeckUi;
      if (state.touchStartX == null) return;
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
        ? fallbackDeltaX
        : ((state.touchCurrentX == null || state.touchStartX == null) ? 0 : (state.touchCurrentX - state.touchStartX));
      var threshold = Math.max(36, Math.round(width * 0.18));

      state.touchStartX = null;
      state.touchStartY = null;
      state.touchCurrentX = null;

      if (!state.touchDragging) return;
      state.touchDragging = false;

      if (!state.reduceMotion) {
        try { track.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)"; } catch (eTouchTransition) {}
      }

      if (!commit) {
        render();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + 260;
        if (deltaX > 0) goTo(state.activeIndex + 1, true);
        else goTo(state.activeIndex - 1, true);
        return;
      }

      render();
    }

    function stopPointerDrag(commit) {
      var state = Reading._readingDeckUi;
      if (!state.pointerDragging) return;
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var deltaX = (state.pointerCurrentX == null || state.pointerStartX == null) ? 0 : (state.pointerCurrentX - state.pointerStartX);
      var threshold = Math.max(36, Math.round(width * 0.18));

      state.pointerDragging = false;
      state.pointerStartX = null;
      state.pointerCurrentX = null;
      state.pointerId = null;

      if (!state.reduceMotion) {
        try { track.style.transition = "transform 220ms ease"; } catch (ePointerTransition) {}
      }

      if (!commit) {
        render();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + 260;
        if (deltaX > 0) goTo(state.activeIndex + 1, true);
        else goTo(state.activeIndex - 1, true);
        return;
      }

      render();
    }

    track.addEventListener("click", function(e) {
      if (Date.now() < Reading._readingDeckUi.suppressCardClickUntil) return;
      var card = e.target && e.target.closest ? e.target.closest(".deck-card") : null;
      if (!card) return;
      var idx = parseInt(card.getAttribute("data-index"), 10);
      if (isFinite(idx)) goTo(idx, true);
    });

    track.addEventListener("keydown", function(e) {
      var card = e.target && e.target.closest ? e.target.closest(".deck-card") : null;
      if (!card) return;
      var key = e.key || "";
      if (key !== "Enter" && key !== " ") return;
      e.preventDefault();
      var idx = parseInt(card.getAttribute("data-index"), 10);
      if (isFinite(idx)) goTo(idx, true);
    });

    if (nextBtn) nextBtn.addEventListener("click", function() { goTo(Reading._readingDeckUi.activeIndex + 1, true); });
    if (prevBtn) prevBtn.addEventListener("click", function() { goTo(Reading._readingDeckUi.activeIndex - 1, true); });

    root.addEventListener("keydown", function(e) {
      var key = e.key || "";
      if (key === "ArrowRight") {
        e.preventDefault();
        goTo(Reading._readingDeckUi.activeIndex + 1, true);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        goTo(Reading._readingDeckUi.activeIndex - 1, true);
      }
    });

    if (viewport) {
      viewport.addEventListener("touchstart", function(e) {
        var state = Reading._readingDeckUi;
        if (isControlTarget(e)) {
          state.touchStartX = null;
          state.touchStartY = null;
          state.touchCurrentX = null;
          state.touchDragging = false;
          state.touchMoved = false;
          return;
        }
        if (!e.touches || !e.touches.length) return;
        state.touchStartX = e.touches[0].clientX;
        state.touchStartY = e.touches[0].clientY;
        state.touchCurrentX = state.touchStartX;
        state.touchDragging = true;
        state.touchMoved = false;
      }, { passive: true });

      viewport.addEventListener("touchmove", function(e) {
        var state = Reading._readingDeckUi;
        if (!state.touchDragging || state.touchStartX == null || !e.touches || !e.touches.length) return;
        var touch = e.touches[0];
        state.touchCurrentX = touch.clientX;
        var currentY = touch.clientY;
        var deltaX = state.touchCurrentX - state.touchStartX;
        var deltaY = (state.touchStartY == null) ? 0 : (currentY - state.touchStartY);

        if (!state.touchMoved) {
          var horizontalIntent = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
          if (!horizontalIntent) return;
          state.touchMoved = true;
          if (!state.reduceMotion) {
            try { track.style.transition = "none"; } catch (eTouchMoveTransition) {}
          }
        }

        var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
        var basePx = state.activeIndex * width;
        var targetPx = -basePx + deltaX;
        track.style.transform = "translateX(" + targetPx + "px)";
        if (width > 0) {
          if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
          applyStoryDeckLook(deltaX / width);
        }
        try { e.preventDefault(); } catch (eTouchPrevent) {}
      }, { passive: false });

      viewport.addEventListener("touchend", function(e) {
        var state = Reading._readingDeckUi;
        if (state.touchStartX == null) return;
        var touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
        if (!touch) {
          stopTouchDrag(false, 0);
          return;
        }
        var deltaX = touch.clientX - state.touchStartX;
        if (state.touchMoved) {
          stopTouchDrag(true, deltaX);
          return;
        }

        state.touchDragging = false;
        state.touchStartX = null;
        state.touchStartY = null;
        state.touchCurrentX = null;
        if (Math.abs(deltaX) < 36) return;
        if (deltaX > 0) goTo(state.activeIndex + 1, true);
        else goTo(state.activeIndex - 1, true);
      }, { passive: true });

      viewport.addEventListener("touchcancel", function() {
        stopTouchDrag(false, 0);
      }, { passive: true });

      viewport.addEventListener("pointerdown", function(evt) {
        var state = Reading._readingDeckUi;
        if (!evt || evt.pointerType === "touch") return;
        if (evt.button != null && evt.button !== 0) return;
        if (isControlTarget(evt)) return;

        state.pointerId = evt.pointerId;
        state.pointerStartX = evt.clientX;
        state.pointerCurrentX = evt.clientX;
        state.pointerDragging = true;
        state.pointerMoved = false;
        try { viewport.setPointerCapture(state.pointerId); } catch (eCapture) {}
        if (!state.reduceMotion) {
          try { track.style.transition = "none"; } catch (eTrackTransition3) {}
        }
      });

      viewport.addEventListener("pointermove", function(evt) {
        var state = Reading._readingDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;

        state.pointerCurrentX = evt.clientX;
        var deltaX = state.pointerCurrentX - state.pointerStartX;
        if (Math.abs(deltaX) > 3) state.pointerMoved = true;
        if (!state.pointerMoved) return;

        var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
        var basePx = state.activeIndex * width;
        var targetPx = -basePx + deltaX;
        track.style.transform = "translateX(" + targetPx + "px)";
        if (width > 0) {
          if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
          applyStoryDeckLook(deltaX / width);
        }
        try { evt.preventDefault(); } catch (ePrevent) {}
      });

      viewport.addEventListener("pointerup", function(evt) {
        var state = Reading._readingDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
        stopPointerDrag(true);
      });

      viewport.addEventListener("pointercancel", function(evt) {
        var state = Reading._readingDeckUi;
        if (!state.pointerDragging) return;
        if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
        stopPointerDrag(false);
      });

      viewport.addEventListener("pointerleave", function() {
        if (!Reading._readingDeckUi.pointerDragging) return;
        stopPointerDrag(true);
      });

      viewport.addEventListener("wheel", function(evt) {
        if (!evt || isControlTarget(evt)) return;
        var state = Reading._readingDeckUi;
        var dx = (typeof evt.deltaX === "number" && isFinite(evt.deltaX)) ? evt.deltaX : 0;
        var dy = (typeof evt.deltaY === "number" && isFinite(evt.deltaY)) ? evt.deltaY : 0;
        if (Math.abs(dx) < 1 && evt.shiftKey) dx = dy;

        var absX = Math.abs(dx);
        var absY = Math.abs(dy);
        var horizontalIntent = absX > 6 && absX >= (absY * 0.85);
        if (!horizontalIntent) return;

        var now = Date.now();
        if (now - state.wheelLastTs > 280) state.wheelAccumX = 0;
        state.wheelLastTs = now;
        state.wheelAccumX += dx;
        try { evt.preventDefault(); } catch (eWheelPrevent) {}

        if (Math.abs(state.wheelAccumX) < 54) return;
        state.suppressCardClickUntil = Date.now() + 180;
        if (state.wheelAccumX > 0) goTo(state.activeIndex + 1, true);
        else goTo(state.activeIndex - 1, true);
        state.wheelAccumX = 0;
      }, { passive: false });
    }

    startBtn.addEventListener("click", function() {
      if (startBtn.disabled) return;
      var cards = getCards();
      var card = cards[Reading._readingDeckUi.activeIndex] || cards[0];
      if (!card || card.getAttribute("data-kind") !== "reading") return;
      if (card.classList && card.classList.contains("deck-preview-locked")) return;
      var id = card.getAttribute("data-reading-id");
      if (id) Reading.openReadingDetail(id);
    });

    if (hint) {
      var seen = false;
      try { seen = localStorage.getItem("readDeckHintSeen_v2") === "1"; } catch (e2) { seen = false; }
      hint.style.display = seen ? "none" : "block";
    }

    Reading._readingDeckRender = render;
  },

  _renderPassageDeckForActiveBundle: function() {
    var bundleId = Reading._ensureActiveBundleId();
    var entries = Reading._buildReadingDeckEntries(bundleId);
    Reading._renderReadingDeckCards(entries);
    Reading._ensureReadingDeckWired();
    if (Reading._readingDeckUi) {
      var persisted = Reading._getReadingDeckUiStateSafe();
      var storyIndex = (persisted && typeof persisted.storyIndex === "number") ? (persisted.storyIndex | 0) : 0;
      if (storyIndex < 0) storyIndex = 0;
      if (storyIndex >= entries.length) storyIndex = Math.max(0, entries.length - 1);
      Reading._readingDeckUi.activeIndex = storyIndex;
      Reading._setReadingDeckUiStateSafe({ storyIndex: storyIndex });
    }
    if (typeof Reading._readingDeckRender === "function") Reading._readingDeckRender();
  },

  _splitStoryIntoSentences: function(text) {
    if (!text || typeof text !== "string") return [];
    var normalized = text.replace(/\s+/g, " ").trim();
    if (!normalized) return [];
    var parts = normalized.match(/[^.!?।]+[.!?।]?/g) || [];
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var piece = Reading._stripPanelPrefix((parts[i] || "").trim());
      if (piece) out.push(piece);
    }
    if (!out.length && normalized) out.push(Reading._stripPanelPrefix(normalized));
    return out;
  },

  _stripPanelPrefix: function(text) {
    if (!text || typeof text !== "string") return "";
    var t = text.trim();
    t = t.replace(/^Panel\s*\d+\s*(?:\([^)]*\))?\s*:\s*/i, "");
    t = t.replace(/^ਪੈਨਲ\s*\d+\s*(?:\([^)]*\))?\s*:\s*/i, "");
    return t.trim();
  },

  _splitStoryIntoPanels: function(text) {
    if (!text || typeof text !== "string") return [];
    var lines = text.split(/\n+/);
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var raw = (lines[i] || "").trim();
      if (!raw) continue;
      var cleaned = Reading._stripPanelPrefix(raw);
      if (cleaned) out.push(cleaned);
    }
    return out;
  },

  _buildReaderSentenceRanges: function(count) {
    var total = (typeof count === "number" && isFinite(count)) ? (count | 0) : 0;
    if (total < 1) return [{ start: 0, end: 1 }];
    if (total <= 3) return [{ start: 0, end: total }];

    var ranges = [];
    var index = 0;
    while (index < total) {
      var remaining = total - index;
      var chunkSize = 3;
      if (remaining === 4) chunkSize = 2;
      else if (remaining <= 3) chunkSize = remaining;
      ranges.push({ start: index, end: index + chunkSize });
      index += chunkSize;
    }
    return ranges;
  },

  _chunkArray: function(items, chunkSize) {
    if (!Array.isArray(items) || !items.length) return [];
    var size = (typeof chunkSize === "number" && isFinite(chunkSize)) ? (chunkSize | 0) : 0;
    if (size < 1) size = 1;
    var out = [];
    for (var i = 0; i < items.length; i += size) {
      out.push(items.slice(i, i + size));
    }
    return out;
  },

  _appendStoryReaderQuestionCard: function(parent, cfg) {
    if (!parent || !cfg || !cfg.item) return;
    var item = cfg.item;
    var qNumber = (typeof cfg.qNumber === "number" && isFinite(cfg.qNumber)) ? (cfg.qNumber | 0) : 0;
    var showOptions = cfg.showOptions !== false;
    var showExplanation = !!cfg.showExplanation;

    var block = document.createElement("div");
    block.className = "reading-study-question";

    var qEn = document.createElement("div");
    qEn.className = "reading-study-question__en";
    qEn.textContent = (qNumber > 0 ? (qNumber + ". ") : "") + (item.qEn || item.q || "");
    block.appendChild(qEn);

    if (item.qPa) {
      var qPa = document.createElement("div");
      qPa.className = "reading-study-question__pa";
      qPa.setAttribute("lang", "pa");
      qPa.textContent = item.qPa;
      block.appendChild(qPa);
    }

    if (showOptions && Array.isArray(item.options) && item.options.length) {
      var ol = document.createElement("ol");
      ol.className = "reading-study-question__options";
      if (typeof cfg.pageIndex === "number" && isFinite(cfg.pageIndex)) {
        ol.setAttribute("data-page-index", String(cfg.pageIndex | 0));
      }
      for (var c = 0; c < item.options.length; c++) {
        var op = item.options[c] || {};
        var li = document.createElement("li");
        li.className = "reading-study-question__option-row";

        var optionBtn = document.createElement("button");
        optionBtn.type = "button";
        optionBtn.className = "reading-study-question__option";
        optionBtn.setAttribute("aria-pressed", "false");
        optionBtn.setAttribute("data-option-index", String(c));
        if (typeof cfg.pageIndex === "number" && isFinite(cfg.pageIndex)) {
          optionBtn.setAttribute("data-page-index", String(cfg.pageIndex | 0));
        }
        optionBtn.textContent = op.en || "";
        if (op.pa) {
          var opPa = document.createElement("div");
          opPa.className = "reading-study-question__option-pa";
          opPa.setAttribute("lang", "pa");
          opPa.textContent = op.pa;
          optionBtn.appendChild(opPa);
        }
        li.appendChild(optionBtn);
        ol.appendChild(li);
      }
      block.appendChild(ol);
    }

    if (showExplanation && item.explanation && (item.explanation.en || item.explanation.pa)) {
      var exp = document.createElement("div");
      exp.className = "section-subtitle reading-study-question__explanation";
      exp.textContent = "Explanation: " + (item.explanation.en || "");
      block.appendChild(exp);
      if (item.explanation.pa) {
        var expPa = document.createElement("div");
        expPa.className = "section-subtitle reading-study-question__explanation";
        expPa.setAttribute("lang", "pa");
        expPa.textContent = item.explanation.pa;
        block.appendChild(expPa);
      }
    }

    parent.appendChild(block);
  },

  _buildStoryReaderStudyPages: function(rd) {
    var pages = [];
    var pos = (rd && rd.partsOfSpeech && typeof rd.partsOfSpeech === "object") ? rd.partsOfSpeech : {};
    var posKeys = [
      { key: "pronouns", label: "Pronouns" },
      { key: "nouns", label: "Nouns" },
      { key: "verbs", label: "Verbs" },
      { key: "adjectives", label: "Adjectives" },
      { key: "prepositions", label: "Prepositions" }
    ];
    for (var p = 0; p < posKeys.length; p++) {
      var posCfg = posKeys[p];
      var posItems = Array.isArray(pos[posCfg.key]) ? pos[posCfg.key] : [];
      if (!posItems.length) continue;
      var posChunks = Reading._chunkArray(posItems, 3);
      for (var pc = 0; pc < posChunks.length; pc++) {
        pages.push({
          kind: "study",
          title: "Parts of Speech",
          subtitle: posCfg.label,
          pairs: posChunks[pc]
        });
      }
    }

    var vocab = Array.isArray(rd && rd.vocabularyWords) ? rd.vocabularyWords : [];
    if (vocab.length) {
      var vocabPairs = [];
      for (var v = 0; v < vocab.length; v++) {
        var vw = vocab[v] || {};
        vocabPairs.push({
          en: (vw.word || "") + (vw.meaningEn ? (" — " + vw.meaningEn) : ""),
          pa: vw.meaningPa || ""
        });
      }
      var vocabChunks = Reading._chunkArray(vocabPairs, 4);
      for (var vc = 0; vc < vocabChunks.length; vc++) {
        pages.push({
          kind: "study",
          title: "Vocabulary",
          subtitle: "Key words",
          pairs: vocabChunks[vc]
        });
      }
    }

    var questions = Reading._getReadingQuestions(rd);
    for (var q = 0; q < questions.length; q++) {
      pages.push({
        kind: "study-question",
        title: "Questions",
        subtitle: "Check understanding",
        questions: [{ qNumber: q + 1, item: questions[q] }]
      });
    }

    var explained = [];
    for (var e = 0; e < questions.length; e++) {
      var it = questions[e];
      if (it && it.explanation && (it.explanation.en || it.explanation.pa)) {
        explained.push({ qNumber: e + 1, item: it });
      }
    }
    var explanationChunks = Reading._chunkArray(explained, 2);
    for (var ec = 0; ec < explanationChunks.length; ec++) {
      pages.push({
        kind: "study-explanation",
        title: "Explanations",
        subtitle: "Why answers are correct",
        questions: explanationChunks[ec]
      });
    }

    var extras = (rd && rd.extras && typeof rd.extras === "object") ? rd.extras : {};
    var extrasGroups = [];
    if (Array.isArray(extras.sayItSentenceFrames) && extras.sayItSentenceFrames.length) {
      extrasGroups.push({ label: "Say It", pairs: extras.sayItSentenceFrames });
    }
    if (Array.isArray(extras.panelPrompts) && extras.panelPrompts.length) {
      extrasGroups.push({
        label: "Panel Prompts",
        pairs: extras.panelPrompts.map(function(pItem) { return { en: pItem.en || "", pa: pItem.pa || "" }; })
      });
    }
    if (Array.isArray(extras.actItOutCommands) && extras.actItOutCommands.length) {
      extrasGroups.push({ label: "Act It Out", pairs: extras.actItOutCommands });
    }
    if (Array.isArray(extras.quickYesNo) && extras.quickYesNo.length) {
      extrasGroups.push({
        label: "Quick Yes/No",
        pairs: extras.quickYesNo.map(function(pItem) {
          var enText = pItem.en || "";
          if (pItem.answer) enText += " [" + pItem.answer + "]";
          return { en: enText, pa: pItem.pa || "" };
        })
      });
    }
    if (extras.homeConnection && typeof extras.homeConnection === "object") {
      extrasGroups.push({
        label: "Home Connection",
        pairs: [{ en: extras.homeConnection.en || "", pa: extras.homeConnection.pa || "" }]
      });
    }

    for (var g = 0; g < extrasGroups.length; g++) {
      var group = extrasGroups[g];
      var pairChunks = Reading._chunkArray(group.pairs || [], 3);
      for (var gc = 0; gc < pairChunks.length; gc++) {
        pages.push({
          kind: "study",
          title: "Extras",
          subtitle: group.label,
          pairs: pairChunks[gc]
        });
      }
    }

    return pages;
  },

  _renderStoryReaderStudyPage: function(card, page, pageIndex) {
    if (!card || !page) return;
    var title = document.createElement("div");
    title.className = "section-title";
    title.textContent = page.title || "Study";
    card.appendChild(title);

    if (page.subtitle) {
      var subtitle = document.createElement("div");
      subtitle.className = "section-subtitle";
      subtitle.textContent = page.subtitle;
      card.appendChild(subtitle);
    }

    if ((page.kind === "study-question" || page.kind === "study-explanation") && Array.isArray(page.questions)) {
      for (var q = 0; q < page.questions.length; q++) {
        var qItem = page.questions[q] || {};
        Reading._appendStoryReaderQuestionCard(card, {
          qNumber: qItem.qNumber,
          item: qItem.item,
          pageIndex: pageIndex,
          showOptions: page.kind === "study-question",
          showExplanation: page.kind === "study-explanation"
        });
      }
      return;
    }

    if (Array.isArray(page.pairs) && page.pairs.length) {
      Reading._appendStudyPairs(card, page.pairs);
    }
  },

  _renderStoryReader: function(rd) {
    var host = document.getElementById("reading-detail-selection-host");
    var heroNavHost = document.getElementById("reading-detail-hero-nav-host");
    if (!host || !rd) return;
    var hintStorageKey = "readerSwipeHintSeen_v1";
    var hintSeen = false;
    try { hintSeen = localStorage.getItem(hintStorageKey) === "1"; } catch (eHintSeen) { hintSeen = false; }

    host.innerHTML = "";
    if (heroNavHost) heroNavHost.innerHTML = "";

    var pages = [];
    var enPanels = Reading._splitStoryIntoPanels(Reading._getStoryTextEn(rd));
    var paPanels = Reading._splitStoryIntoPanels(Reading._getStoryTextPa(rd));
    var panelCount = Math.max(enPanels.length, paPanels.length);

    if (panelCount > 1) {
      for (var i = 0; i < panelCount; i++) {
        pages.push({
          kind: "story",
          en: [enPanels[i] || ""],
          pa: [paPanels[i] || ""]
        });
      }
    } else {
      var englishSentences = Reading._splitStoryIntoSentences(Reading._getStoryTextEn(rd));
      var punjabiSentences = Reading._splitStoryIntoSentences(Reading._getStoryTextPa(rd));
      var baseCount = englishSentences.length || punjabiSentences.length || 1;
      var ranges = Reading._buildReaderSentenceRanges(baseCount);
      for (var j = 0; j < ranges.length; j++) {
        var range = ranges[j];
        var enSlice = englishSentences.slice(range.start, range.end);
        var paSlice = punjabiSentences.slice(range.start, range.end);
        pages.push({
          kind: "story",
          en: enSlice,
          pa: paSlice
        });
      }
    }
    if (!pages.length) pages.push({ kind: "story", en: [Reading._getStoryTextEn(rd)], pa: [Reading._getStoryTextPa(rd)] });
    pages.push({ kind: "complete-intro" });
    var studyPages = Reading._buildStoryReaderStudyPages(rd);
    for (var sp = 0; sp < studyPages.length; sp++) pages.push(studyPages[sp]);
    pages.push({ kind: "complete-actions" });

    var deck = document.createElement("div");
    deck.className = "reading-detail-deck reading-detail-deck--page-turn";

    var heroCounterDots = document.getElementById("readingDetailHeroDots");
    var heroCounterText = document.getElementById("readingDetailHeroProgressText");

    var swipeHint = document.createElement("div");
    swipeHint.className = "reading-reader-hint";
    swipeHint.setAttribute("aria-live", "polite");
    swipeHint.textContent = "Swipe left to continue";
    deck.appendChild(swipeHint);

    var viewport = document.createElement("div");
    viewport.className = "reading-detail-deck__viewport";

    var track = document.createElement("div");
    track.className = "reading-detail-deck__track";

    for (var p = 0; p < pages.length; p++) {
      var page = pages[p];
      var card = document.createElement("article");
      card.className = "card reading-detail-deck__card deck-card module-card deck-card--reading" + (p === 0 ? " is-active" : "");
      card.setAttribute("data-index", String(p));
      card.setAttribute("aria-hidden", p === 0 ? "false" : "true");

      if (page.kind === "complete-intro") {
        card.classList.add("reading-detail-deck__card--complete");

        var introTitle = document.createElement("div");
        introTitle.className = "section-title";
        introTitle.textContent = "Story complete";
        card.appendChild(introTitle);

        var introSubtitle = document.createElement("div");
        introSubtitle.className = "section-subtitle";
        introSubtitle.textContent = "Great job! Swipe to review study cards.";
        card.appendChild(introSubtitle);
      } else if (page.kind === "complete-actions") {
        card.classList.add("reading-detail-deck__card--complete");

        var doneTitle = document.createElement("div");
        doneTitle.className = "section-title";
        doneTitle.textContent = "All done";
        card.appendChild(doneTitle);

        var doneSubtitle = document.createElement("div");
        doneSubtitle.className = "section-subtitle";
        doneSubtitle.textContent = "Replay this story or continue.";
        card.appendChild(doneSubtitle);

        var completeActions = document.createElement("div");
        completeActions.className = "reading-complete-actions";

        var replayBtn = document.createElement("button");
        replayBtn.type = "button";
        replayBtn.className = "btn";
        replayBtn.textContent = "Replay";
        replayBtn.addEventListener("click", function() {
          render(0);
        });

        var continueBtn = document.createElement("button");
        continueBtn.type = "button";
        continueBtn.className = "btn cta-primary";
        continueBtn.textContent = "Continue";
        continueBtn.addEventListener("click", function() {
          UI.goTo("screen-reading");
          Reading.renderReadingList();
        });

        completeActions.appendChild(replayBtn);
        completeActions.appendChild(continueBtn);
        card.appendChild(completeActions);
      } else if (page.kind === "study" || page.kind === "study-question" || page.kind === "study-explanation") {
        card.classList.add("reading-detail-deck__card--study");
        Reading._renderStoryReaderStudyPage(card, page, p);
      } else {
        var enLabel = document.createElement("div");
        enLabel.className = "lang-label";
        enLabel.textContent = "ENGLISH";
        card.appendChild(enLabel);

        var enText = document.createElement("div");
        enText.className = "lesson-text-en";
        enText.textContent = (page.en && page.en.length) ? page.en.join(" ") : "";
        card.appendChild(enText);

        var paLabel = document.createElement("div");
        paLabel.className = "lang-label";
        paLabel.style.marginTop = "8px";
        paLabel.textContent = "ਪੰਜਾਬੀ";
        card.appendChild(paLabel);

        var paText = document.createElement("div");
        paText.className = "lesson-text-pa";
        paText.setAttribute("lang", "pa");
        paText.textContent = (page.pa && page.pa.length) ? page.pa.join(" ") : "";
        card.appendChild(paText);
      }

      track.appendChild(card);
    }

    viewport.appendChild(track);
    deck.appendChild(viewport);

    var nav = document.createElement("div");
    nav.className = "reading-detail-hero-nav";

    var navRow = document.createElement("div");
    navRow.className = "reading-detail-hero-nav-row";

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "btn deck-prev-handle";
    prevBtn.setAttribute("aria-label", "Previous page");
    prevBtn.textContent = "←";

    var startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.className = "btn cta-primary reading-detail-start-btn";
    startBtn.setAttribute("aria-label", "Start from first page");
    var startEnSpan = document.createElement("span");
    startEnSpan.className = "btn-label-en";
    startEnSpan.textContent = "Start";
    var startPaSpan = document.createElement("span");
    startPaSpan.className = "btn-label-pa";
    startPaSpan.setAttribute("lang", "pa");
    startPaSpan.textContent = "\u0A38\u0A3C\u0A41\u0A30\u0A42 \u0A15\u0A30\u0A4B";
    startBtn.appendChild(startEnSpan);
    startBtn.appendChild(startPaSpan);

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn deck-next-handle";
    nextBtn.setAttribute("aria-label", "Next page");
    nextBtn.textContent = "→";

    navRow.appendChild(prevBtn);
    navRow.appendChild(nextBtn);
    nav.appendChild(navRow);

    var startWrap = document.createElement("div");
    startWrap.className = "reading-detail-hero-actions";
    startWrap.appendChild(startBtn);
    nav.appendChild(startWrap);

    if (heroNavHost) heroNavHost.appendChild(nav);
    else deck.appendChild(nav);
    host.appendChild(deck);

    Reading._storyReaderUi = {
      activeIndex: 0,
      total: pages.length,
      questionStateByPage: {},
      reduceMotion: false,
      turnDirection: 0,
      turnResetTimer: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchDragging: false,
      touchMoved: false,
      pointerStartX: null,
      pointerCurrentX: null,
      pointerDragging: false,
      pointerMoved: false,
      pointerId: null,
      wheelAccumX: 0,
      wheelLastTs: 0
    };

    try {
      Reading._storyReaderUi.reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (eReduceMotion) {
      Reading._storyReaderUi.reduceMotion = false;
    }

    function clamp(index) {
      if (index < 0) return 0;
      if (index >= Reading._storyReaderUi.total) return Reading._storyReaderUi.total - 1;
      return index;
    }

    function getPage(index) {
      var i = (typeof index === "number" && isFinite(index)) ? (index | 0) : 0;
      return pages[i] || null;
    }

    function getQuestionState(pageIndex) {
      var idx = (typeof pageIndex === "number" && isFinite(pageIndex)) ? (pageIndex | 0) : 0;
      var state = Reading._storyReaderUi;
      if (!state.questionStateByPage) state.questionStateByPage = {};
      if (!state.questionStateByPage[idx]) {
        state.questionStateByPage[idx] = { selectedOptionIndex: null, confirmed: false };
      }
      return state.questionStateByPage[idx];
    }

    function updateQuestionOptionsUi(pageIndex) {
      var idx = (typeof pageIndex === "number" && isFinite(pageIndex)) ? (pageIndex | 0) : 0;
      var page = getPage(idx);
      if (!page || page.kind !== "study-question" || !Array.isArray(page.questions) || !page.questions.length) return;
      var qItem = page.questions[0] || {};
      var item = qItem.item || {};
      var correctIndex = (typeof item.correctIndex === "number" && isFinite(item.correctIndex)) ? (item.correctIndex | 0) : -1;
      var card = track.querySelector('.reading-detail-deck__card[data-index="' + idx + '"]');
      if (!card) return;
      var options = card.querySelectorAll('.reading-study-question__option[data-option-index]');
      var qState = getQuestionState(idx);
      for (var oi = 0; oi < options.length; oi++) {
        var optionEl = options[oi];
        var optIndex = parseInt(optionEl.getAttribute("data-option-index"), 10);
        var selected = isFinite(optIndex) && qState.selectedOptionIndex === optIndex;
        optionEl.classList.toggle("is-selected", selected);
        optionEl.classList.remove("is-correct", "is-wrong", "is-correct-answer");
        optionEl.setAttribute("aria-pressed", selected ? "true" : "false");
        optionEl.setAttribute("aria-disabled", qState.confirmed ? "true" : "false");
        if (qState.confirmed) {
          if (isFinite(optIndex) && optIndex === correctIndex) optionEl.classList.add("is-correct-answer");
          if (selected && optIndex === correctIndex) optionEl.classList.add("is-correct");
          if (selected && optIndex !== correctIndex) optionEl.classList.add("is-wrong");
        }
      }
    }

    function setQuestionSelection(pageIndex, optionIndex) {
      var idx = (typeof pageIndex === "number" && isFinite(pageIndex)) ? (pageIndex | 0) : 0;
      var opt = (typeof optionIndex === "number" && isFinite(optionIndex)) ? (optionIndex | 0) : -1;
      if (opt < 0) return;
      var qState = getQuestionState(idx);
      if (qState.confirmed) return;
      qState.selectedOptionIndex = opt;
      updateQuestionOptionsUi(idx);
      render(Reading._storyReaderUi.activeIndex);
    }

    function confirmCurrentQuestion() {
      var idx = Reading._storyReaderUi.activeIndex | 0;
      var page = getPage(idx);
      if (!page || page.kind !== "study-question") return false;
      var qState = getQuestionState(idx);
      if (qState.selectedOptionIndex == null) return false;
      qState.confirmed = true;
      updateQuestionOptionsUi(idx);
      return true;
    }

    function canAdvanceFromCurrentPage() {
      var idx = Reading._storyReaderUi.activeIndex | 0;
      var page = getPage(idx);
      if (!page || page.kind !== "study-question") return true;
      return !!getQuestionState(idx).confirmed;
    }

    function getCards() {
      return Array.prototype.slice.call(track.querySelectorAll(".reading-detail-deck__card"));
    }

    function setTurnDirection(dir) {
      var state = Reading._storyReaderUi;
      var nextDir = 0;
      if (dir > 0) nextDir = 1;
      else if (dir < 0) nextDir = -1;
      state.turnDirection = nextDir;
      deck.classList.toggle("is-turning-next", nextDir > 0);
      deck.classList.toggle("is-turning-prev", nextDir < 0);
    }

    function queueIdleTurnReset() {
      var state = Reading._storyReaderUi;
      if (state.turnResetTimer) clearTimeout(state.turnResetTimer);
      state.turnResetTimer = setTimeout(function() {
        setTurnDirection(0);
        applyBookLook(0);
      }, state.reduceMotion ? 0 : 280);
    }

    function applyBookLook(dragRatio) {
      var cards = getCards();
      var active = Reading._storyReaderUi.activeIndex;
      var ratio = (typeof dragRatio === "number" && isFinite(dragRatio)) ? dragRatio : 0;
      if (ratio > 1) ratio = 1;
      if (ratio < -1) ratio = -1;
      var state = Reading._storyReaderUi;
      var swipeDir = ratio < -0.01 ? 1 : (ratio > 0.01 ? -1 : state.turnDirection);
      var swipeMag = Math.min(1, Math.abs(ratio));
      var dragActive = swipeMag > 0.001;
      var openingPrev = swipeDir < 0 ? swipeMag : 0;
      var openingNext = swipeDir > 0 ? swipeMag : 0;

      for (var iCard = 0; iCard < cards.length; iCard++) {
        var card = cards[iCard];
        var distance = iCard - active;
        var isActive = distance === 0;

        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-stack-prev", distance < 0 && Math.abs(distance) <= 2);
        card.classList.toggle("is-stack-next", distance > 0 && Math.abs(distance) <= 2);
        card.classList.toggle("is-stack-far", Math.abs(distance) > 2);
        card.setAttribute("aria-hidden", isActive ? "false" : "true");

        var rotate = 0;
        var translate = 0;
        var lift = 0;
        var scale = 1;
        var opacity = 1;
        var edge = 0.08;
        var bend = 0;

        if (distance === 0) {
          rotate = ratio * (dragActive ? -18 : -10);
          translate = ratio * (dragActive ? 30 : 18);
          lift = dragActive ? (-swipeMag * 3.5) : 0;
          scale = 1 - (swipeMag * (dragActive ? 0.022 : 0.012));
          opacity = 1;
          edge = 0.12 + (swipeMag * (dragActive ? 0.2 : 0.12));
          bend = dragActive ? (0.18 + (swipeMag * 0.52)) : 0.1;
        } else if (distance === -1) {
          rotate = 10 - (openingPrev * 12);
          translate = -20 + (openingPrev * 20);
          scale = 0.966 + (openingPrev * 0.028);
          opacity = 0.76 + (openingPrev * 0.22);
          edge = 0.1 + (openingPrev * 0.1);
          bend = 0.08 + (openingPrev * 0.18);
        } else if (distance === 1) {
          rotate = -10 + (openingNext * 12);
          translate = 20 - (openingNext * 20);
          scale = 0.966 + (openingNext * 0.028);
          opacity = 0.76 + (openingNext * 0.22);
          edge = 0.1 + (openingNext * 0.1);
          bend = 0.08 + (openingNext * 0.18);
        } else if (distance < 0) {
          rotate = 14;
          translate = -30;
          scale = 0.95;
          opacity = 0.64;
          edge = 0.08;
          bend = 0.06;
        } else {
          rotate = -14;
          translate = 30;
          scale = 0.95;
          opacity = 0.64;
          edge = 0.08;
          bend = 0.06;
        }

        card.style.transform = "translateX(" + translate + "px) translateY(" + lift + "px) rotateY(" + rotate + "deg) scale(" + scale + ")";
        card.style.opacity = String(opacity);
        card.style.setProperty("--reader-turn-edge", String(edge));
        card.style.setProperty("--reader-turn-bend", String(bend));
      }
    }

    function applyDragResistance(deltaX) {
      var d = (typeof deltaX === "number" && isFinite(deltaX)) ? deltaX : 0;
      if (!d) return 0;
      var i = Reading._storyReaderUi.activeIndex | 0;
      var maxI = (Reading._storyReaderUi.total | 0) - 1;
      if ((i <= 0 && d > 0) || (i >= maxI && d < 0)) {
        return d * 0.3;
      }
      return d;
    }

    function setTrackTransform(index, dragPx) {
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      if (width > 0) {
        var basePx = index * width;
        var targetPx = -basePx + (dragPx || 0);
        track.style.transform = "translateX(" + targetPx + "px)";
      } else {
        track.style.transform = "translateX(-" + (index * 100) + "%)";
      }
    }

    function renderReaderCounter(index, total) {
      var active = (typeof index === "number" && isFinite(index)) ? (index | 0) : 0;
      var count = (typeof total === "number" && isFinite(total) && total > 0) ? (total | 0) : 1;
      if (heroCounterText) heroCounterText.textContent = (active + 1) + "/" + count;
      if (!heroCounterDots) return;
      heroCounterDots.innerHTML = "";
      var maxVisibleDots = 7;
      var windowStart = 0;
      var windowEnd = count;
      if (count > maxVisibleDots) {
        var side = Math.floor(maxVisibleDots / 2);
        windowStart = active - side;
        windowEnd = windowStart + maxVisibleDots;
        if (windowStart < 0) {
          windowStart = 0;
          windowEnd = maxVisibleDots;
        }
        if (windowEnd > count) {
          windowEnd = count;
          windowStart = count - maxVisibleDots;
        }
      }
      for (var iDot = windowStart; iDot < windowEnd; iDot++) {
        var dot = document.createElement("span");
        dot.className = "deck-dot" + (iDot === active ? " is-active" : "");
        heroCounterDots.appendChild(dot);
      }
    }

    function render(index) {
      Reading._storyReaderUi.activeIndex = clamp(index);
      var iActive = Reading._storyReaderUi.activeIndex;
      var total = Reading._storyReaderUi.total || 1;
      var activePage = getPage(iActive);
      var startEn = null;
      var startPa = null;
      try {
        startEn = startBtn && startBtn.querySelector ? startBtn.querySelector(".btn-label-en") : null;
        startPa = startBtn && startBtn.querySelector ? startBtn.querySelector(".btn-label-pa") : null;
      } catch (eStartLabels) {
        startEn = null;
        startPa = null;
      }

      function setStartLabel(enText, paText) {
        if (startEn) startEn.textContent = enText;
        if (startPa) startPa.textContent = paText;
        if (!startEn && !startPa) startBtn.textContent = enText;
      }

      if (!Reading._storyReaderUi.reduceMotion) {
        track.style.transition = "transform 220ms var(--ease-standard)";
      } else {
        track.style.transition = "none";
      }
      setTrackTransform(iActive, 0);
      renderReaderCounter(iActive, total);
      prevBtn.disabled = iActive <= 0;
      if (activePage && activePage.kind === "study-question") {
        var qState = getQuestionState(iActive);
        setStartLabel(qState.confirmed ? "Answered" : "Confirm", qState.confirmed ? "ਜਵਾਬ ਦਿੱਤਾ" : "ਪੁਸ਼ਟੀ ਕਰੋ");
        startBtn.disabled = qState.confirmed || qState.selectedOptionIndex == null;
      } else {
        startBtn.disabled = iActive <= 0;
        setStartLabel(iActive <= 0 ? "Start" : "Start Over", iActive <= 0 ? "ਸ਼ੁਰੂ ਕਰੋ" : "ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ");
      }
      nextBtn.disabled = iActive >= (Reading._storyReaderUi.total - 1) || !canAdvanceFromCurrentPage();
      swipeHint.style.display = (!hintSeen && iActive === 0 && total > 1) ? "block" : "none";
      if (activePage && activePage.kind === "study-question") updateQuestionOptionsUi(iActive);
      Reading._updateReadingDetailHero(rd);
      applyBookLook(0);
      queueIdleTurnReset();
    }

    function markHintSeen() {
      if (hintSeen) return;
      hintSeen = true;
      try { localStorage.setItem(hintStorageKey, "1"); } catch (eHintSave) {}
      swipeHint.style.display = "none";
    }

    function goNext() {
      if (!canAdvanceFromCurrentPage()) return;
      var cur = Reading._storyReaderUi.activeIndex;
      var next = clamp(cur + 1);
      setTurnDirection(1);
      if (next !== cur) {
        try {
          var heroProgress = document.querySelector('#screen-reading-detail .read-hero-progress');
          var heroHost = heroProgress || deck;
          if (heroHost) {
            if (typeof nudgeCounterIndicator === 'function') {
              nudgeCounterIndicator(heroHost, 1);
            } else {
              heroHost.classList.remove('indicator-shift-next', 'indicator-shift-prev');
              void heroHost.offsetWidth;
              heroHost.classList.add('indicator-shift-next');
              window.setTimeout(function() {
                try { heroHost.classList.remove('indicator-shift-next'); } catch (eRdNextRemove) {}
              }, 220);
            }
          }
        } catch (eRdNextNudge) {}
      }
      if (next !== cur) markHintSeen();
      render(next);
    }

    function goPrev() {
      var cur = Reading._storyReaderUi.activeIndex;
      var prev = clamp(cur - 1);
      setTurnDirection(-1);
      if (prev !== cur) {
        try {
          var heroProgress = document.querySelector('#screen-reading-detail .read-hero-progress');
          var heroHost = heroProgress || deck;
          if (heroHost) {
            if (typeof nudgeCounterIndicator === 'function') {
              nudgeCounterIndicator(heroHost, -1);
            } else {
              heroHost.classList.remove('indicator-shift-next', 'indicator-shift-prev');
              void heroHost.offsetWidth;
              heroHost.classList.add('indicator-shift-prev');
              window.setTimeout(function() {
                try { heroHost.classList.remove('indicator-shift-prev'); } catch (eRdPrevRemove) {}
              }, 220);
            }
          }
        } catch (eRdPrevNudge) {}
      }
      if (prev !== cur) markHintSeen();
      render(prev);
    }

    function stopTouchDrag(commit, fallbackDeltaX) {
      var state = Reading._storyReaderUi;
      if (state.touchStartX == null) return;
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var deltaX = (typeof fallbackDeltaX === "number" && isFinite(fallbackDeltaX))
        ? fallbackDeltaX
        : ((state.touchCurrentX == null || state.touchStartX == null) ? 0 : (state.touchCurrentX - state.touchStartX));
      var threshold = Math.max(36, Math.round(width * 0.18));

      state.touchStartX = null;
      state.touchStartY = null;
      state.touchCurrentX = null;

      if (!state.touchDragging) return;
      state.touchDragging = false;
      state.touchMoved = false;
      deck.classList.remove("is-swipe-moving");

      if (!state.reduceMotion) track.style.transition = "transform 240ms cubic-bezier(0.2, 0.72, 0.18, 1)";

      if (!commit) {
        setTurnDirection(0);
        render(state.activeIndex);
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        if (deltaX < 0) goNext();
        else goPrev();
        return;
      }

      render(state.activeIndex);
    }

    function stopPointerDrag(commit) {
      var state = Reading._storyReaderUi;
      if (!state.pointerDragging) return;
      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var deltaX = (state.pointerCurrentX == null || state.pointerStartX == null) ? 0 : (state.pointerCurrentX - state.pointerStartX);
      var threshold = Math.max(36, Math.round(width * 0.18));

      state.pointerDragging = false;
      state.pointerMoved = false;
      state.pointerStartX = null;
      state.pointerCurrentX = null;
      state.pointerId = null;
      deck.classList.remove("is-swipe-moving");

      if (!state.reduceMotion) track.style.transition = "transform 240ms cubic-bezier(0.2, 0.72, 0.18, 1)";

      if (!commit) {
        setTurnDirection(0);
        render(state.activeIndex);
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        if (deltaX < 0) goNext();
        else goPrev();
        return;
      }

      render(state.activeIndex);
    }

    prevBtn.addEventListener("click", goPrev);
    startBtn.addEventListener("click", function() {
      var activePage = getPage(Reading._storyReaderUi.activeIndex | 0);
      if (activePage && activePage.kind === "study-question") {
        if (confirmCurrentQuestion()) render(Reading._storyReaderUi.activeIndex);
        return;
      }
      setTurnDirection(0);
      render(0);
    });
    nextBtn.addEventListener("click", goNext);

    function applySelectionFromOptionElement(optionEl) {
      if (!optionEl) return false;
      var pageIndex = parseInt(optionEl.getAttribute("data-page-index"), 10);
      var optionIndex = parseInt(optionEl.getAttribute("data-option-index"), 10);
      if (!isFinite(pageIndex) || !isFinite(optionIndex)) return false;
      setQuestionSelection(pageIndex, optionIndex);
      return true;
    }

    function bindQuestionOptionHandlers() {
      var options = track.querySelectorAll('.reading-study-question__option[data-option-index][data-page-index]');
      for (var oi = 0; oi < options.length; oi++) {
        var optionEl = options[oi];
        if (!optionEl || optionEl.dataset.optionBound === "1") continue;
        optionEl.dataset.optionBound = "1";

        var activate = function(evt) {
          if (applySelectionFromOptionElement(this)) {
            try { evt.preventDefault(); } catch (ePrevent) {}
            try { evt.stopPropagation(); } catch (eStop) {}
          }
        };

        optionEl.addEventListener("click", activate);
        optionEl.addEventListener("touchend", activate, { passive: false });
        optionEl.addEventListener("pointerup", activate);
        optionEl.addEventListener("keydown", function(e) {
          var key = e.key || "";
          if (key !== "Enter" && key !== " ") return;
          if (applySelectionFromOptionElement(this)) {
            try { e.preventDefault(); } catch (ePreventKey) {}
            try { e.stopPropagation(); } catch (eStopKey) {}
          }
        });
      }
    }

    function isQuestionOptionTarget(target) {
      if (!target) return false;
      var el = target;
      if (el.nodeType === 3 && el.parentElement) el = el.parentElement;
      return !!(el && el.closest && el.closest('.reading-study-question__option[data-option-index][data-page-index]'));
    }

    bindQuestionOptionHandlers();

    deck.addEventListener("keydown", function(e) {
      var key = e.key || "";
      if (key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    });

    viewport.addEventListener("touchstart", function(e) {
      var state = Reading._storyReaderUi;
      if (isQuestionOptionTarget(e && e.target)) return;
      if (!e.touches || !e.touches.length) return;
      state.touchStartX = e.touches[0].clientX;
      state.touchStartY = e.touches[0].clientY;
      state.touchCurrentX = state.touchStartX;
      state.touchDragging = true;
      state.touchMoved = false;
    }, { passive: true });

    viewport.addEventListener("touchmove", function(e) {
      var state = Reading._storyReaderUi;
      if (!state.touchDragging || state.touchStartX == null || !e.touches || !e.touches.length) return;

      var touch = e.touches[0];
      state.touchCurrentX = touch.clientX;
      var deltaX = state.touchCurrentX - state.touchStartX;
      var deltaY = (state.touchStartY == null) ? 0 : (touch.clientY - state.touchStartY);

      if (!state.touchMoved) {
        var horizontalIntent = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
        if (!horizontalIntent) return;
        state.touchMoved = true;
        deck.classList.add("is-swipe-moving");
        if (!state.reduceMotion) track.style.transition = "none";
      }

      setTurnDirection(deltaX < 0 ? 1 : -1);

      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var dragX = applyDragResistance(deltaX);
      setTrackTransform(state.activeIndex, dragX);
      if (width > 0) applyBookLook(dragX / width);
      try { e.preventDefault(); } catch (eTouchPrevent) {}
    }, { passive: false });

    viewport.addEventListener("touchend", function(e) {
      var state = Reading._storyReaderUi;
      if (state.touchStartX == null) return;
      var touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
      if (!touch) {
        stopTouchDrag(false, 0);
        return;
      }
      var deltaX = touch.clientX - state.touchStartX;
      if (state.touchMoved) {
        stopTouchDrag(true, deltaX);
        return;
      }

      state.touchDragging = false;
      state.touchStartX = null;
      state.touchStartY = null;
      state.touchCurrentX = null;
      if (Math.abs(deltaX) < 36) return;
      if (deltaX < 0) goNext();
      else goPrev();
    }, { passive: true });

    viewport.addEventListener("touchcancel", function() {
      stopTouchDrag(false, 0);
    }, { passive: true });

    viewport.addEventListener("pointerdown", function(evt) {
      var state = Reading._storyReaderUi;
      if (!evt || evt.pointerType === "touch") return;
      if (evt.button != null && evt.button !== 0) return;
      if (isQuestionOptionTarget(evt.target)) return;

      state.pointerId = evt.pointerId;
      state.pointerStartX = evt.clientX;
      state.pointerCurrentX = evt.clientX;
      state.pointerDragging = true;
      state.pointerMoved = false;
      try { viewport.setPointerCapture(state.pointerId); } catch (eCapture) {}
      if (!state.reduceMotion) track.style.transition = "none";
    });

    viewport.addEventListener("pointermove", function(evt) {
      var state = Reading._storyReaderUi;
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;

      state.pointerCurrentX = evt.clientX;
      var deltaX = state.pointerCurrentX - state.pointerStartX;
      if (Math.abs(deltaX) > 3) state.pointerMoved = true;
      if (!state.pointerMoved) return;
      deck.classList.add("is-swipe-moving");
      setTurnDirection(deltaX < 0 ? 1 : -1);

      var width = viewport && viewport.clientWidth ? viewport.clientWidth : 0;
      var dragX = applyDragResistance(deltaX);
      setTrackTransform(state.activeIndex, dragX);
      if (width > 0) applyBookLook(dragX / width);
      try { evt.preventDefault(); } catch (ePointerPrevent) {}
    });

    viewport.addEventListener("pointerup", function(evt) {
      var state = Reading._storyReaderUi;
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
      stopPointerDrag(true);
    });

    viewport.addEventListener("pointercancel", function(evt) {
      var state = Reading._storyReaderUi;
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
      stopPointerDrag(false);
    });

    viewport.addEventListener("pointerleave", function() {
      if (!Reading._storyReaderUi.pointerDragging) return;
      stopPointerDrag(true);
    });

    viewport.addEventListener("wheel", function(evt) {
      if (!evt) return;
      var state = Reading._storyReaderUi;
      var dx = (typeof evt.deltaX === "number" && isFinite(evt.deltaX)) ? evt.deltaX : 0;
      var dy = (typeof evt.deltaY === "number" && isFinite(evt.deltaY)) ? evt.deltaY : 0;
      if (Math.abs(dx) < 1 && evt.shiftKey) dx = dy;

      var absX = Math.abs(dx);
      var absY = Math.abs(dy);
      var horizontalIntent = absX > 6 && absX >= (absY * 0.85);
      if (!horizontalIntent) return;

      var now = Date.now();
      if (now - state.wheelLastTs > 280) state.wheelAccumX = 0;
      state.wheelLastTs = now;
      state.wheelAccumX += dx;
      try { evt.preventDefault(); } catch (eWheelPrevent) {}

      if (Math.abs(state.wheelAccumX) < 54) return;
      if (state.wheelAccumX > 0) goNext();
      else goPrev();
      state.wheelAccumX = 0;
    }, { passive: false });

    render(0);
  },

      _showRetiredReadingDetail: function(rd) {
        var retiredCard = document.getElementById("reading-detail-retired-card");
        var retiredMessage = document.getElementById("reading-detail-retired-message");
        var hideIds = [
          "reading-mode-card",
          "readingDetailDeck",
          "reading-story-card",
          "reading-vocab-card",
          "reading-detail-question-card",
          "reading-completion-card"
        ];

        for (var i = 0; i < hideIds.length; i++) {
          var el = document.getElementById(hideIds[i]);
          if (!el) continue;
          el.style.display = "none";
          el.setAttribute("aria-hidden", "true");
        }

        if (retiredCard) {
          retiredCard.style.display = "block";
          retiredCard.setAttribute("aria-hidden", "false");
        }
        if (retiredMessage) {
          var title = (rd && rd.titleEn) ? rd.titleEn : "This story";
          retiredMessage.textContent = title + " is currently unavailable.";
        }
      },

  _renderLegacyReadingListFallback: function(bundleIds) {
    var ul = document.getElementById("reading-list");
    if (!ul) return;
    ul.innerHTML = "";

    for (var b = 0; b < bundleIds.length; b++) {
      var bundleId = bundleIds[b];
      var header = document.createElement("li");
      header.textContent = "Bundle " + bundleId;
      ul.appendChild(header);

      var readings = Reading._getReadingsForBundle(bundleId);
      for (var r = 0; r < readings.length; r++) {
        var reading = readings[r] || {};
        if (!reading.id) continue;

        var visibleIndex = 0;
        if (typeof READINGS !== "undefined" && Array.isArray(READINGS)) {
          for (var i = 0; i < READINGS.length; i++) {
            if (READINGS[i] && READINGS[i].id === reading.id) {
              visibleIndex = i + 1;
              break;
            }
          }
        }
        if (!visibleIndex) visibleIndex = r + 1;

        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-link";
        btn.textContent = "R" + visibleIndex + ": " + (reading.titleEn || "Story");
        (function(readingId) {
          btn.addEventListener("click", function() { Reading.openReadingDetail(readingId); });
        })(reading.id);
        li.appendChild(btn);
        ul.appendChild(li);
      }
    }
  },

  renderReadingList: function() {
    var bundleIds = Reading._getBookDeckIds();
    if (!bundleIds.length) return;

    var bundleDeck = document.getElementById("readingBundleDeck");
    var bundleTrack = document.getElementById("readingBundleTrack");
    var bundleDots = document.getElementById("readingBundleDots");
    var deckStartBtn = document.getElementById("btn-reading-book-start");
    var hasDeckNodes = !!(bundleDeck && bundleTrack && bundleDots && deckStartBtn);
    if (!hasDeckNodes) return;

    Reading._ensureActiveBundleId();
    Reading._ensureBookStorySelectionsLoaded();
    Reading._ensureStorySheetWired();
    var savedDeckUi = Reading._getReadingDeckUiStateSafe();
    var savedBundleIndex = (savedDeckUi && typeof savedDeckUi.bundleIndex === "number") ? (savedDeckUi.bundleIndex | 0) : 0;
    if (savedBundleIndex < 0) savedBundleIndex = 0;
    if (savedBundleIndex >= bundleIds.length) savedBundleIndex = bundleIds.length - 1;
    if (savedBundleIndex < 0) savedBundleIndex = 0;
    Reading._activeBundleId = bundleIds[savedBundleIndex] || bundleIds[0];

    Reading._renderBundleDeckCards(bundleIds);
    Reading._ensureReadingBundleDeckWired();

    if (Reading._readingBundleDeckUi) {
      var idx = bundleIds.indexOf(Reading._activeBundleId);
      Reading._readingBundleDeckUi.activeIndex = idx >= 0 ? idx : 0;
      Reading._setReadingDeckUiStateSafe({ bundleIndex: Reading._readingBundleDeckUi.activeIndex });
      if (typeof Reading._readingBundleDeckRender === "function") Reading._readingBundleDeckRender();
    }
  },

  openReadingDetail: function(id, requestedQuestionIndex, skipProgressUpdate) {
    if (!id || typeof id !== "string") {
      Reading._renderErrorFallback("Invalid reading ID.");
      return;
    }
    var rd = READINGS.find(function(r) { return r.id === id; });
    if (!rd) {
      console.warn("Reading not found: " + id);
      Reading._renderErrorFallback("This story does not exist.");
      return;
    }
    if (!Reading.validateReadingContent(id)) {
      console.warn("Reading content invalid: " + id);
      Reading._renderErrorFallback("This story has incomplete data.");
      return;
    }

    // Persist last opened reading for Home resume card
    try {
      if (typeof State !== "undefined" && State && State.state && State.state.session) {
        State.state.session.currentReadingId = rd.id;
        if (typeof State.save === "function") State.save();
      }
    } catch (e) {
      // no-op
    }

    // Star 1: opened
    if (typeof State !== "undefined" && State.awardReadingStar) {
      State.awardReadingStar(rd.id, 1);
      Reading.renderReadingList();
    }

    Reading._initDetailUiState(rd.id, true);
    Reading._updateReadingDetailHero(rd);

    Reading._renderStoryReader(rd);
    UI.goTo("screen-reading-detail");
    return;

    var textEnEl = document.getElementById("reading-detail-text-en");
    if (textEnEl) textEnEl.textContent = rd.english || "";
    var textPaEl = document.getElementById("reading-detail-text-pa");
    if (textPaEl) textPaEl.textContent = rd.punjabi || "";

    var safeQuestionIndex = Reading._getSafeQuestionIndex(rd, requestedQuestionIndex);

    // Apply persisted reading-only UI settings (font/spacing/lang)
    Reading._applyReadingUiSettings();

    // Bilingual focus mode (pure UI; no data changes)
    Reading._ensureFocusModeDom();
    Reading._wireFocusModeToggle();
    Reading._applyFocusModeUI();

    // Render passage media (images) if available
    try { if (window.ReadingMedia && ReadingMedia.render) ReadingMedia.render(rd); } catch (e) {}

    Reading._updateReadingVocabToggleButton();
    Reading.syncVocabCollapseUI();
    Reading._renderReadingVocabPanel(rd);
    Reading._ensureDetailSwipeDeck();
    Reading._wireReadingCompletionActions();

    Reading._resetVocabQuizUI();

    var passageIndex = READINGS.findIndex(function(r) { return r.id === id; }) + 1;
    var totalPassages = READINGS.length;
    var bundleId = Reading._ensureActiveBundleId();
    var bundleReadings = Reading._getReadingsForBundle(bundleId);
    if (Array.isArray(bundleReadings) && bundleReadings.length) {
      var bundlePassageIndex = 0;
      for (var b = 0; b < bundleReadings.length; b++) {
        if (bundleReadings[b] && bundleReadings[b].id === id) {
          bundlePassageIndex = b + 1;
          break;
        }
      }
      if (bundlePassageIndex > 0) {
        passageIndex = bundlePassageIndex;
        totalPassages = bundleReadings.length;
      }
    }
    if (Reading._detailUiState) {
      if (!skipProgressUpdate) {
        Reading._detailUiState.passageIndex = passageIndex > 0 ? passageIndex : 1;
      }
      Reading._detailUiState.totalPassages = totalPassages;
    }

    Reading._renderCurrentQuestion(rd, safeQuestionIndex);
    var persistedDeckUi = Reading._getReadingDeckUiStateSafe();
    var persistedStep = (persistedDeckUi && typeof persistedDeckUi.detailStep === "string") ? persistedDeckUi.detailStep : null;
    var defaultStep = Reading._isKidMode() ? "read" : "questions";
    var nextStep = persistedStep || defaultStep;
    if (nextStep !== "read" && nextStep !== "questions" && nextStep !== "vocab" && nextStep !== "complete") {
      nextStep = defaultStep;
    }
    Reading._goToKidFlowStep(nextStep);
    Reading._applyReadingViewMode();

    UI.goTo("screen-reading-detail");
  },

  _resetVocabQuizUI: function() {
    Reading._vocabQuizState = null;
    var card = document.getElementById("reading-vocab-quiz-card");
    var prompt = document.getElementById("reading-vocab-quiz-prompt");
    var opts = document.getElementById("reading-vocab-quiz-options");
    var fb = document.getElementById("reading-vocab-quiz-feedback");
    if (card) card.style.display = "none";
    if (prompt) prompt.textContent = "";
    if (opts) opts.innerHTML = "";
    if (fb) {
      fb.textContent = "";
      fb.classList.remove("correct", "wrong");
    }
  },

  _getVocabQuizPool: function(rd) {
    var items = [];

    // Prefer detailed vocab
    if (typeof READING_VOCAB_DETAIL !== "undefined" && READING_VOCAB_DETAIL && READING_VOCAB_DETAIL[rd.id]) {
      var entry = READING_VOCAB_DETAIL[rd.id];
      if (entry && Array.isArray(entry.words)) {
        entry.words.forEach(function(w) {
          if (!w || !w.term) return;
          items.push({
            term: Reading._normalizeVocabTerm(w.term),
            defEn: w.defEn || "",
            defPa: w.defPa || "",
            kind: "word"
          });
        });
      }
      // If not enough words, allow phrases
      if (items.length < 3 && entry && Array.isArray(entry.phrases)) {
        entry.phrases.forEach(function(p) {
          if (!p || !p.term) return;
          items.push({
            term: Reading._normalizeVocabTerm(p.term),
            defEn: p.defEn || "",
            defPa: p.defPa || "",
            kind: "phrase"
          });
        });
      }
    } else {
      // Fallback to compatibility fields (terms only; no defs)
      var legacy = Reading._getReadingVocabData(rd);
      (legacy.words || []).forEach(function(t) {
        var term = Reading._normalizeVocabTerm(t);
        if (term) items.push({ term: term, defEn: "", defPa: "", kind: "word" });
      });
      if (items.length < 3) {
        (legacy.phrases || []).forEach(function(t) {
          var term = Reading._normalizeVocabTerm(t);
          if (term) items.push({ term: term, defEn: "", defPa: "", kind: "phrase" });
        });
      }
    }

    // Dedupe by term (case-insensitive)
    var seen = {};
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it || !it.term) continue;
      var key = it.term.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(it);
    }
    return out;
  },

  _pickVocabQuizItem: function(pool) {
    if (!pool || pool.length === 0) return null;
    var idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  },

  _shuffleArray: function(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  },

  _maybeShowVocabQuiz: function(rd) {
    var card = document.getElementById("reading-vocab-quiz-card");
    var prompt = document.getElementById("reading-vocab-quiz-prompt");
    var opts = document.getElementById("reading-vocab-quiz-options");
    var fb = document.getElementById("reading-vocab-quiz-feedback");
    if (!card || !prompt || !opts || !fb) return;

    // Already earned Star 3? Hide.
    if (typeof State !== "undefined" && State.getReadingStars) {
      if (State.getReadingStars(rd.id) >= 3) {
        card.style.display = "none";
        return;
      }
    }

    var pool = Reading._getVocabQuizPool(rd);
    if (!pool || pool.length < 3) {
      // Vocab missing/insufficient: auto-award Star 3 when Star 2 is earned (handled by caller).
      card.style.display = "none";
      return;
    }

    // Pick correct + 2 distractors
    var correct = Reading._pickVocabQuizItem(pool);
    if (!correct) {
      card.style.display = "none";
      return;
    }

    // Prefer prompting with meaning; if missing defs, prompt with Punjabi label only.
    var meaningEn = correct.defEn || "";
    var meaningPa = correct.defPa || "";

    prompt.innerHTML = "";
    var line1 = document.createElement("div");
    line1.className = "reading-vocab-quiz-line";
    line1.textContent = meaningEn ? ("Which word/phrase means: \"" + meaningEn + "\"?") : "Which word/phrase matches this meaning?";
    prompt.appendChild(line1);
    if (meaningPa) {
      var line2 = document.createElement("div");
      line2.className = "reading-vocab-quiz-line";
      line2.setAttribute("lang", "pa");
      line2.textContent = "ਕਿਹੜਾ ਸ਼ਬਦ/ਵਾਕਾਂਸ਼ ਦਾ ਅਰਥ ਹੈ: \"" + meaningPa + "\"?";
      prompt.appendChild(line2);
    }

    // Build options
    var distractors = pool.filter(function(it) { return it.term.toLowerCase() !== correct.term.toLowerCase(); });
    Reading._shuffleArray(distractors);
    var chosen = [correct, distractors[0], distractors[1]];
    Reading._shuffleArray(chosen);

    Reading._vocabQuizState = {
      readingId: rd.id,
      correctTerm: correct.term
    };

    fb.textContent = "";
    fb.classList.remove("correct", "wrong");
    opts.innerHTML = "";

    chosen.forEach(function(it) {
      var b = document.createElement("button");
      b.className = "btn btn-secondary btn-small";
      b.style.marginRight = "6px";
      b.style.marginTop = "6px";
      b.textContent = it.term;
      b.addEventListener("click", function() {
        Reading._handleVocabQuizAnswer(rd, it.term);
      });
      opts.appendChild(b);
    });

    card.style.display = "block";
  },

  _handleVocabQuizAnswer: function(rd, chosenTerm) {
    var fb = document.getElementById("reading-vocab-quiz-feedback");
    var opts = document.getElementById("reading-vocab-quiz-options");
    if (!fb || !opts || !Reading._vocabQuizState) return;

    var correctTerm = Reading._vocabQuizState.correctTerm;
    var correct = (String(chosenTerm).toLowerCase() === String(correctTerm).toLowerCase());

    fb.classList.remove("correct", "wrong");
    if (correct) {
      fb.classList.add("correct");
      fb.textContent = "✓ Great job!";

      // Disable options
      var btns = opts.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
    } else {
      fb.textContent = "✗ Try again.";
      fb.classList.add("wrong");
    }
  },

  // Handle Next button click
  goToNextPassage: function(currentId) {
    var currentIndex = READINGS.findIndex(function(r) { return r.id === currentId; });
    if (currentIndex === -1) return;
    
    if (currentIndex + 1 < READINGS.length) {
      // More passages available
      Reading.openReadingDetail(READINGS[currentIndex + 1].id);
    } else {
      // All passages completed - go back to list
      Reading.renderReadingList();
      UI.goTo("screen-reading");
    }
  },

  // Internal: handle answer selection
  _handleAnswer: function(rd, q, chosenIndex, qIndex) {
    var feedbackEl = document.getElementById("reading-detail-feedback");
    if (!q || typeof q.correctIndex !== "number") return;

    var correct = (chosenIndex === q.correctIndex);

    // If in mastery review mode, use review handler
    if (Reading._masteryReviewState) {
      Reading._handleMasteryReviewAnswer(rd, q, chosenIndex);
      return;
    }

    // Track per-question mastery (qIndex=0 for primary question)
    var currentQIndex = (typeof qIndex === "number" && isFinite(qIndex)) ? (qIndex | 0) : ((Reading._detailUiState && typeof Reading._detailUiState.currentQuestionIndex === "number") ? Reading._detailUiState.currentQuestionIndex : 0);
    if (typeof State !== "undefined" && State.recordReadingAnswer && rd && rd.id) {
      State.recordReadingAnswer(rd.id, currentQIndex, correct);
    }

    if (feedbackEl) {
      feedbackEl.classList.remove("correct", "wrong");
      if (correct) {
        feedbackEl.textContent = "✓ Correct!";
        feedbackEl.classList.add("correct");
        
        // Add explanation if available
        if (q.explanation) {
          var explanationEl = document.getElementById("reading-detail-explanation");
          if (explanationEl) {
            explanationEl.style.display = "block";
            explanationEl.innerHTML = "";
            
            var enLabel = document.createElement("div");
            enLabel.className = "lang-label";
            enLabel.textContent = "English";
            explanationEl.appendChild(enLabel);
            
            var enText = document.createElement("div");
            enText.textContent = q.explanation.en || "";
            explanationEl.appendChild(enText);
            
            var paLabel = document.createElement("div");
            paLabel.className = "lang-label";
            paLabel.style.marginTop = "8px";
            paLabel.textContent = "ਪੰਜਾਬੀ";
            explanationEl.appendChild(paLabel);
            
            var paText = document.createElement("div");
            paText.textContent = q.explanation.pa || "";
            explanationEl.appendChild(paText);
          }
        }
        
        // Show XP badge
        var xpEl = document.getElementById("reading-xp-badge");
        if (xpEl) {
          xpEl.style.display = "none";
          xpEl.textContent = "";
        }

        // Vocab micro-quiz (Star 3): show if possible, otherwise auto-award if vocab missing
        var pool = Reading._getVocabQuizPool(rd);
        if (!pool || pool.length < 3) {
          if (typeof State !== "undefined" && State.awardReadingStar) {
            State.awardReadingStar(rd.id, 3);
            Reading.renderReadingList();
          }
          Reading._resetVocabQuizUI();
        } else {
          Reading._maybeShowVocabQuiz(rd);
        }
        
        var questions = Reading._getReadingQuestions(rd);
        var isLastQuestion = (currentQIndex >= (questions.length - 1));
        if (Reading._isKidMode()) {
          var hasVocabEnabled = Reading._getReadingVocabEnabledSafe();
          if (hasVocabEnabled) Reading._goToKidFlowStep("vocab");
          else Reading._goToKidFlowStep("complete");
        }
        if (!Reading._isKidMode() && isLastQuestion) {
          Reading._goToKidFlowStep("complete");
        }

      } else {
        if (Reading._isKidMode()) Reading._goToKidFlowStep("questions");
        feedbackEl.textContent = "✗ Try again.";
        feedbackEl.classList.add("wrong");
      }
    }
  }
};

// Helper to escape HTML for safe rendering
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =====================================
// ReadingMedia: 4-image carousel + thumbs + lightbox
// =====================================
window.ReadingMedia = (function() {
  var api = {};
  var state = {
    activeIndex: 0,
    passage: null,
    bound: false,
    touchStartX: null,
    getActiveIndex: null,
    setActiveIndex: null
  };

  var els = {
    media: null,
    carousel: null,
    activeImg: null,
    counter: null,
    thumbs: null,
    caption: null
  };

  function q(id) { return document.getElementById(id); }

  function getLangMode() {
    try {
      var s = State.getReadingUiSettings();
      return (s && s.langMode) || "both";
    } catch (e) {
      return "both";
    }
  }

  function ensureEls() {
    els.media = q("passageMedia");
    els.carousel = q("passageCarousel");
    els.activeImg = q("passageActiveImg");
    els.counter = q("passageCounter");
    els.thumbs = q("passageThumbs");
    if (!els.media || !els.carousel || !els.activeImg || !els.counter || !els.thumbs) return false;

    // Caption container is created dynamically to avoid HTML edits.
    els.caption = q("passageCaption");
    if (!els.caption) {
      els.caption = document.createElement("div");
      els.caption.id = "passageCaption";
      els.caption.className = "passage-caption";
      // Insert between carousel and thumbs.
      if (els.carousel && els.carousel.parentElement === els.media) {
        els.media.insertBefore(els.caption, els.thumbs);
      } else {
        els.media.appendChild(els.caption);
      }
    }

    return true;
  }

  function setPortraitClassFromActive() {
    if (!els.media || !els.activeImg) return;
    if (!els.activeImg.naturalWidth || !els.activeImg.naturalHeight) return;
    var ratio = els.activeImg.naturalWidth / els.activeImg.naturalHeight;
    els.media.classList.toggle("is-portrait", ratio < 0.95);
  }

  function hideMediaOnError() {
    if (!els.media) return;
    els.media.style.display = "none";
    els.media.classList.remove("is-portrait");
    if (els.carousel) els.carousel.removeAttribute("aria-live");
    if (els.activeImg) {
      els.activeImg.src = "";
      els.activeImg.alt = "";
    }
    if (els.thumbs) els.thumbs.innerHTML = "";
    if (els.caption) els.caption.innerHTML = "";
    state.passage = null;
  }

  function ensureActiveImgHooks() {
    if (!els.activeImg || els.activeImg.dataset.fitBound === "1") return;
    els.activeImg.dataset.fitBound = "1";
    try { els.activeImg.decoding = "async"; } catch (e) {}

    els.activeImg.addEventListener("load", function() {
      setPortraitClassFromActive();
    });
    els.activeImg.addEventListener("error", function() {
      hideMediaOnError();
    });
  }

  function renderThumbs(images) {
    els.thumbs.innerHTML = "";
    for (var i = 0; i < images.length; i++) {
      var wrap = document.createElement("button");
      wrap.type = "button";
      wrap.className = "passage-thumb" + (i === state.activeIndex ? " passage-thumb-active" : "");
      wrap.setAttribute("aria-label", "Show image " + (i + 1));
      wrap.setAttribute("aria-current", i === state.activeIndex ? "true" : "false");
      wrap.dataset.index = String(i);

      var im = document.createElement("img");
      im.loading = "lazy";
      im.src = images[i].src;
      im.alt = images[i].alt || ("Image " + (i + 1));
      wrap.appendChild(im);

      wrap.addEventListener("click", function(ev) {
        var idx = parseInt(ev.currentTarget.dataset.index, 10) || 0;
        changeActive(idx);
      });

      els.thumbs.appendChild(wrap);
    }
  }

  function updateCounter() {
    if (!els.counter) return;
    var total = (state.passage && state.passage.images) ? state.passage.images.length : 0;
    if (total <= 1) {
      els.counter.style.display = "none";
      els.counter.textContent = "";
      return;
    }
    els.counter.style.display = "block";
    els.counter.textContent = (state.activeIndex + 1) + "/" + total;
  }

  function prefetchAdjacent() {
    if (!state.passage || !Array.isArray(state.passage.images)) return;
    var total = state.passage.images.length;
    if (total <= 1) return;
    var next = (state.activeIndex + 1) % total;
    var prev = (state.activeIndex - 1 + total) % total;
    [next, prev].forEach(function(idx) {
      var src = state.passage.images[idx] && state.passage.images[idx].src;
      if (!src) return;
      var img = new Image();
      img.src = src;
    });
  }

  function updateActiveImg() {
    if (!els.activeImg || !state.passage) return;
    var it = state.passage.images[state.activeIndex];
    els.activeImg.src = it.src;
    els.activeImg.alt = it.alt || ("Image " + (state.activeIndex + 1));

    if (els.activeImg.complete) setPortraitClassFromActive();
  }

  function updateThumbActive() {
    var nodes = els.thumbs ? els.thumbs.querySelectorAll(".passage-thumb") : [];
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle("passage-thumb-active", i === state.activeIndex);
      nodes[i].setAttribute("aria-current", i === state.activeIndex ? "true" : "false");
    }
  }

  function updateCaption() {
    if (!els.caption) return;
    if (!state.passage || !Array.isArray(state.passage.images) || !state.passage.images[state.activeIndex]) {
      els.caption.innerHTML = "";
      return;
    }

    var it = state.passage.images[state.activeIndex];
    var en = it.captionEn || "";
    var pa = it.captionPa || "";
    var mode = getLangMode();

    var html = "";
    if (mode !== "pa" && en) {
      html += '<div class="passage-caption__line passage-caption__en">' + escapeHtml(en) + "</div>";
    }
    if (mode !== "en" && pa) {
      html += '<div class="passage-caption__line passage-caption__pa" lang="pa">' + escapeHtml(pa) + "</div>";
    }
    els.caption.innerHTML = html;
  }

  function changeActive(idx) {
    if (!state.passage) return;
    var total = state.passage.images.length;
    var prevIndex = state.activeIndex | 0;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    state.activeIndex = idx;

    try {
      var direction = 0;
      if (total > 1 && state.activeIndex !== prevIndex) {
        var rawDelta = state.activeIndex - prevIndex;
        var wrappedDelta = rawDelta;
        var half = total / 2;
        if (wrappedDelta > half) wrappedDelta -= total;
        else if (wrappedDelta < -half) wrappedDelta += total;
        direction = wrappedDelta > 0 ? 1 : (wrappedDelta < 0 ? -1 : 0);
      }
      if (direction && els.media) {
        if (typeof nudgeCounterIndicator === "function") {
          nudgeCounterIndicator(els.media, direction);
        } else {
          var cls = direction > 0 ? "indicator-shift-next" : "indicator-shift-prev";
          els.media.classList.remove("indicator-shift-next", "indicator-shift-prev");
          void els.media.offsetWidth;
          els.media.classList.add(cls);
          window.setTimeout(function() {
            try { els.media.classList.remove(cls); } catch (eReadingMediaNudgeRemove) {}
          }, 220);
        }
      }
    } catch (eReadingMediaNudge) {}

    try { if (typeof state.setActiveIndex === "function") state.setActiveIndex(state.activeIndex); } catch (e) {}
    updateActiveImg();
    updateCounter();
    updateThumbActive();
    updateCaption();
    prefetchAdjacent();
  }

  function next() {
    var t = state.passage ? state.passage.images.length : 0;
    if (t <= 1) return;
    changeActive((state.activeIndex + 1) % t);
  }
  function prev() {
    var t = state.passage ? state.passage.images.length : 0;
    if (t <= 1) return;
    changeActive((state.activeIndex - 1 + t) % t);
  }

  function wireSwipe() {
    if (!els.carousel) return;
    // Remove previous
    els.carousel.ontouchstart = null;
    els.carousel.ontouchend = null;

    els.carousel.addEventListener("touchstart", function(ev) {
      try { state.touchStartX = ev.changedTouches[0].clientX; } catch (e) { state.touchStartX = null; }
    }, { passive: true });
    els.carousel.addEventListener("touchend", function(ev) {
      var x = null;
      try { x = ev.changedTouches[0].clientX; } catch (e) { x = null; }
      if (x == null || state.touchStartX == null) return;
      var dx = x - state.touchStartX;
      var threshold = 35;
      if (dx <= -threshold) next();
      else if (dx >= threshold) prev();
      state.touchStartX = null;
    });
  }

  // Public API
  api.render = function(passage, opts) {
    if (!ensureEls()) return;
    ensureActiveImgHooks();
    // Hide if missing images
    if (!passage || !Array.isArray(passage.images) || passage.images.length === 0) {
      els.media.style.display = "none";
      els.media.classList.remove("is-portrait");
      els.carousel.removeAttribute("aria-live");
      els.activeImg.src = "";
      els.activeImg.alt = "";
      els.thumbs.innerHTML = "";
      if (els.caption) els.caption.innerHTML = "";
      state.passage = null;
      return;
    }
    // Show and render
    els.media.style.display = "block";
    state.passage = passage;

    state.getActiveIndex = (opts && typeof opts.getActiveIndex === "function") ? opts.getActiveIndex : null;
    state.setActiveIndex = (opts && typeof opts.setActiveIndex === "function") ? opts.setActiveIndex : null;

    var initial = 0;
    try { if (state.getActiveIndex) initial = state.getActiveIndex() | 0; } catch (e0) { initial = 0; }
    if (initial < 0) initial = 0;
    if (initial >= passage.images.length) initial = 0;
    state.activeIndex = initial;

    updateActiveImg();
    updateCounter();
    if (passage.images.length <= 1) {
      els.thumbs.style.display = "none";
      els.thumbs.innerHTML = "";
      els.carousel.removeAttribute("aria-live");
    } else {
      els.thumbs.style.display = "flex";
      els.carousel.setAttribute("aria-live", "polite");
      renderThumbs(passage.images);
    }
    updateCaption();
    prefetchAdjacent();
    wireSwipe();

    // No modal/lightbox: keep click a no-op.
    els.activeImg.onclick = null;
  };

  api.updateCaptionForCurrent = function() {
    updateCaption();
  };

  return api;
})();
