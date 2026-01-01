// =====================================
// Reading Module - owns screen-reading and screen-reading-detail
// =====================================

var Reading = {
  _initialized: false,
  _vocabPanelCollapsed: false,
  _vocabQuizState: null,
  _vocabEnabledFallback: null,
  _detailUiState: null,

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
  // ===== QUEST CONTEXT HELPERS =====

  getQuestContext: function() {
    return window.DQ_QUEST_CONTEXT || null;
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

  isQuestMode: function() {
    return window.DQ_QUEST_CONTEXT && window.DQ_QUEST_CONTEXT.mode === "reading";
  },

  clearQuestContext: function() {
    window.DQ_QUEST_CONTEXT = null;
  },

  startBundleMasteryReview: function(bundleId) {
    if (typeof State === "undefined" || !State.getUnmasteredQuestionsInBundle) return;
    
    var queueItems = State.getUnmasteredQuestionsInBundle(bundleId);
    if (!queueItems || queueItems.length === 0) {
      alert("No unmastered questions in this bundle.");
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
    Reading.openReadingDetail(readingId, null, true); // true = skipProgressUpdate
    
    // Mark that we're in review mode
    var header = document.getElementById("reading-detail-header");
    if (header) {
      var reviewLabel = document.createElement("span");
      reviewLabel.style.marginLeft = "10px";
      reviewLabel.style.fontSize = "0.9em";
      reviewLabel.style.opacity = "0.7";
      reviewLabel.textContent = "Mastery Review: " + (state.currentIndex + 1) + " of " + state.queue.length;
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
    
    // Check passage text exists
    if (!rd.english || typeof rd.english !== "string" || !rd.english.trim()) return false;
    if (!rd.punjabi || typeof rd.punjabi !== "string" || !rd.punjabi.trim()) return false;
    
    // Check questions array exists and has at least one
    if (!rd.questions || !Array.isArray(rd.questions) || rd.questions.length === 0) return false;
    
    // Check primary question has valid structure
    var q = rd.questions[0];
    if (!q || typeof q !== "object") return false;
    if (typeof q.q !== "string" || !q.q.trim()) return false;
    
    // Check options array
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    
    // Check correctIndex is valid and in range
    if (typeof q.correctIndex !== "number" || !Number.isInteger(q.correctIndex)) return false;
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) return false;
    
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
    title.textContent = "⚠️ Reading Not Available";
    title.style.color = "#d32f2f";
    
    var message = document.createElement("p");
    message.textContent = errorMsg || "This story could not be loaded.";
    message.style.marginTop = "16px";
    message.style.color = "#666";
    
    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn";
    backBtn.textContent = "← Back to Reading List";
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
    if (!rd || !rd.questions || !rd.questions[0]) {
      return null;
    }
    var q = rd.questions[0];
    if (typeof q.correctIndex !== "number") return null;
    if (!Array.isArray(q.options) || q.options.length <= q.correctIndex) return null;
    return q;
  },

  // ===== QUEST MODE OPENING =====

  openReadingForQuest: function(readingId, callback) {
    if (!Reading.validateReadingContent(readingId)) {
      alert("Content coming soon.");
      if (callback) callback();
      return;
    }

    window.DQ_QUEST_CONTEXT = {
      mode: "reading",
      readingId: readingId,
      callback: callback || function() {},
      startedAt: Date.now(),
      answeredCorrect: false,
      xpAwarded: false
    };

    Reading.openReadingDetail(readingId);
  },

  init: function() {
    if (Reading._initialized) return;
    Reading._initialized = true;
    Reading.wireOnce();
    Reading.renderReadingList();
    Reading.syncUI();
  },

  // ===== Reading Detail: local UI state (no persistence) =====

  _initDetailUiState: function(readingId) {
    // Preserve state if we're re-opening the same reading (rare), otherwise reset.
    if (Reading._detailUiState && Reading._detailUiState.readingId === readingId) return;
    Reading._detailUiState = {
      readingId: readingId,
      primaryLang: "en",
      secondaryExpanded: false,
      activeImageIndex: 0,
      selectedOptionIndex: null,
      checked: false,
      locked: false
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
        var nextBundleId = bundleId + 1;
        alert("🎉 Mastery achieved! Bundle " + nextBundleId + " unlocked.");
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
      collapseBtn.textContent = "Show";
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
        btn.textContent = st.secondaryExpanded ? "Hide" : "Show";
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

  _renderQuizFlow: function(rd, q) {
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
        Reading._handleAnswer(rd, q, st.selectedOptionIndex);

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
        var nextBtn = document.getElementById("reading-next-btn");
        if (nextBtn) nextBtn.style.display = "none";

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
    var nextBtn = document.getElementById("reading-next-btn");
    if (nextBtn) nextBtn.style.display = "none";

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
    Reading._wireReadingVocabToggle();
    Reading._wireReadingVocabCollapse();
    Reading._wireReadModeControls();
  },

  syncUI: function() {
    Reading._applyReadingUiSettings();
    Reading._updateReadingVocabToggleButton();
    Reading._updateReadingVocabCollapseButton();
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

  // ===== Bundle Card Helpers =====

  _getNextUnfinishedInBundle: function(bundleId) {
    var readings = (typeof State !== "undefined" && State.getBundleReadings) ? State.getBundleReadings(bundleId) : [];
    for (var i = 0; i < readings.length; i++) {
      var stars = (typeof State !== "undefined" && State.getReadingStars) ? State.getReadingStars(readings[i].id) : 0;
      if (stars < 2) {
        return readings[i].id;
      }
    }
    return readings.length > 0 ? readings[0].id : null;
  },

  _expandBundlePassages: function(bundleId) {
    var container = document.getElementById("bundle-passages-" + bundleId);
    if (!container) return;
    
    var isExpanded = container.style.display !== "none";
    container.style.display = isExpanded ? "none" : "block";
    
    var toggleBtn = document.getElementById("bundle-expand-" + bundleId);
    if (toggleBtn) {
      toggleBtn.textContent = isExpanded ? "View all passages" : "Hide passages";
    }
  },

  _handleBundleCardAction: function(bundleId, action) {
    if (typeof State === "undefined") return;
    
    var isLocked = !State.isBundleUnlocked(bundleId);
    if (isLocked) {
      alert("Complete the previous bundle and reach 70% mastery to unlock this bundle.");
      return;
    }
    
    if (action === "continue") {
      var nextReadingId = Reading._getNextUnfinishedInBundle(bundleId);
      if (nextReadingId) {
        Reading.openReadingDetail(nextReadingId);
      }
    } else if (action === "review") {
      Reading.startBundleMasteryReview(bundleId);
    } else if (action === "next") {
      if (bundleId < 5) {
        var nextReadingId = Reading._getNextUnfinishedInBundle(bundleId + 1);
        if (nextReadingId) {
          Reading.openReadingDetail(nextReadingId);
        }
      }
    }
  },

  renderReadingList: function() {
    var ul = document.getElementById("reading-list");
    if (!ul) return;
    ul.innerHTML = "";

    if (typeof State === "undefined" || !State.getBundleReadings || typeof BUNDLES === "undefined") return;

    // Render 5 bundle cards
    for (var bundleId = 1; bundleId <= BUNDLES.length; bundleId++) {
      var readings = State.getBundleReadings(bundleId);
      var isUnlocked = State.isBundleUnlocked(bundleId);
      var masteryPct = State.getBundleMasteryPct(bundleId);
      var isComplete = State.isBundleComplete(bundleId);
      var isReviewNeeded = isComplete && masteryPct < 0.7;

      var cardLi = document.createElement("li");
      cardLi.className = "bundle-card";
      if (!isUnlocked) cardLi.classList.add("bundle-card--locked");
      else if (isReviewNeeded) cardLi.classList.add("bundle-card--review-needed");
      else if (isComplete) cardLi.classList.add("bundle-card--complete");
      else cardLi.classList.add("bundle-card--in-progress");

      // Header with title and status chip
      var header = document.createElement("div");
      header.className = "bundle-card__header";

      var titleSpan = document.createElement("h3");
      titleSpan.className = "bundle-card__title";
      titleSpan.textContent = "Bundle " + bundleId;

      var statusChip = document.createElement("span");
      statusChip.className = "status-chip";
      if (!isUnlocked) statusChip.textContent = "🔒 Locked";
      else if (isReviewNeeded) statusChip.textContent = "📋 Review Needed";
      else if (isComplete) statusChip.textContent = "✓ Complete";
      else statusChip.textContent = "→ In Progress";

      header.appendChild(titleSpan);
      header.appendChild(statusChip);

      // Meta: completion + mastery
      var meta = document.createElement("div");
      meta.className = "bundle-card__meta";
      meta.innerHTML =
        '<div class="bundle-card__progress">' + readings.length + '/10 passages completed</div>' +
        '<div class="bundle-card__mastery">' + Math.round(masteryPct * 100) + '% mastery (needs 70%)</div>';

      // Actions: primary button + expand link
      var actions = document.createElement("div");
      actions.className = "bundle-card__actions";

      var primaryBtn = document.createElement("button");
      primaryBtn.type = "button";
      primaryBtn.className = "bundle-card__button btn";
      if (!isUnlocked) {
        primaryBtn.disabled = true;
        primaryBtn.textContent = "Locked";
      } else if (isReviewNeeded) {
        primaryBtn.textContent = "📚 Mastery Review";
        primaryBtn.addEventListener("click", (function(bId) {
          return function() { Reading._handleBundleCardAction(bId, "review"); };
        })(bundleId));
      } else if (isComplete) {
        if (bundleId < 5) {
          primaryBtn.textContent = "Start Bundle " + (bundleId + 1);
          primaryBtn.addEventListener("click", (function(bId) {
            return function() { Reading._handleBundleCardAction(bId, "next"); };
          })(bundleId));
        } else {
          primaryBtn.disabled = true;
          primaryBtn.textContent = "All bundles complete! 🎉";
        }
      } else {
        primaryBtn.textContent = "Continue";
        primaryBtn.addEventListener("click", (function(bId) {
          return function() { Reading._handleBundleCardAction(bId, "continue"); };
        })(bundleId));
      }

      var expandBtn = document.createElement("button");
      expandBtn.type = "button";
      expandBtn.id = "bundle-expand-" + bundleId;
      expandBtn.className = "bundle-card__expand btn-link";
      expandBtn.textContent = "View all passages";
      expandBtn.addEventListener("click", (function(bId) {
        return function() { Reading._expandBundlePassages(bId); };
      })(bundleId));

      actions.appendChild(primaryBtn);
      actions.appendChild(expandBtn);

      // Passages list (hidden by default)
      var passagesContainer = document.createElement("div");
      passagesContainer.id = "bundle-passages-" + bundleId;
      passagesContainer.className = "bundle-card__passages";
      passagesContainer.style.display = "none";
      passagesContainer.style.marginTop = "12px";
      passagesContainer.style.paddingTop = "12px";
      passagesContainer.style.borderTop = "1px solid #e0e0e0";

      var passagesList = document.createElement("ul");
      passagesList.style.listStyle = "none";
      passagesList.style.padding = "0";
      passagesList.style.margin = "0";

      for (var j = 0; j < readings.length; j++) {
        var r = readings[j];
        var passageLi = document.createElement("li");
        passageLi.style.marginBottom = "8px";

        var passageBtn = document.createElement("button");
        passageBtn.type = "button";
        passageBtn.className = "btn-link";
        passageBtn.style.fontSize = "0.95em";
        var rIdx = READINGS.findIndex(function(x) { return x.id === r.id; });
        var passageNum = rIdx >= 0 ? (rIdx + 1) : (j + 1);
        var pStars = (typeof State !== "undefined" && State.getReadingStars) ? State.getReadingStars(r.id) : 0;
        var starIndicator = pStars >= 2 ? "✓" : pStars === 1 ? "◐" : "○";

        passageBtn.textContent = starIndicator + " R" + passageNum + ": " + escapeHtml(r.titleEn || "Story");
        passageBtn.addEventListener("click", (function(id) {
          return function() { Reading.openReadingDetail(id); };
        })(r.id));

        passageLi.appendChild(passageBtn);
        passagesList.appendChild(passageLi);
      }

      passagesContainer.appendChild(passagesList);

      // Assemble card
      cardLi.appendChild(header);
      cardLi.appendChild(meta);
      cardLi.appendChild(actions);
      cardLi.appendChild(passagesContainer);

      ul.appendChild(cardLi);
    }
  },

  openReadingDetail: function(id) {
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

    var titleEl = document.getElementById("reading-detail-title");
    if (titleEl) {
      titleEl.textContent = rd.titleEn || "Story";
      titleEl.dataset.readingId = rd.id;  // Store reading ID for next button
    }
    var titlePaEl = document.getElementById("reading-detail-title-pa");
    if (titlePaEl) titlePaEl.textContent = rd.titlePa || "";
    var metaEl = document.getElementById("reading-detail-meta");
    if (metaEl) metaEl.textContent = "Level: " + (rd.levelHint || "–") + " · Track: Reading & Stories";

    var textEnEl = document.getElementById("reading-detail-text-en");
    if (textEnEl) textEnEl.textContent = rd.english || "";
    var textPaEl = document.getElementById("reading-detail-text-pa");
    if (textPaEl) textPaEl.textContent = rd.punjabi || "";

    // Apply persisted reading-only UI settings (font/spacing/lang)
    Reading._applyReadingUiSettings();

    // Bilingual focus mode (pure UI; no data changes)
    Reading._initDetailUiState(rd.id);
    Reading._ensureFocusModeDom();
    Reading._wireFocusModeToggle();
    Reading._applyFocusModeUI();

    // Render passage media (images) if available
    try { if (window.ReadingMedia && ReadingMedia.render) ReadingMedia.render(rd); } catch (e) {}

    Reading._updateReadingVocabToggleButton();
    Reading.syncVocabCollapseUI();
    Reading._renderReadingVocabPanel(rd);

    Reading._resetVocabQuizUI();

    // Render primary question with progress counter
    var q = Reading.getPrimaryQuestion(rd);

    // Calculate passage index and total (for progress)
    var passageIndex = READINGS.findIndex(function(r) { return r.id === id; }) + 1;
    var totalPassages = READINGS.length;
    var progressEl = document.getElementById("reading-progress-counter");
    if (progressEl) {
      progressEl.textContent = "Passage " + passageIndex + " of " + totalPassages;
    }

    Reading._renderQuizFlow(rd, q);

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
      var awardedStar3Xp = false;
      fb.classList.add("correct");

      // Star 3 + optional XP (once)
      if (typeof State !== "undefined" && State.awardReadingStar) {
        State.awardReadingStar(rd.id, 3);
        if (!State.hasReadingXpAwarded(rd.id, "star3")) {
          State.awardXP(5, { trackId: "T_READING", reason: "reading_star3" });
          State.markReadingXpAwarded(rd.id, "star3");
          awardedStar3Xp = true;
        }
        Reading.renderReadingList();
      }

      fb.textContent = awardedStar3Xp ? "✓ Great job! +5 XP" : "✓ Great job!";

      // Disable options
      var btns = opts.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
    } else {
      fb.textContent = "✗ Try again.";
      fb.classList.add("wrong");
    }
  },

  // Alias for openReadingDetail, supports quest mode
  openPassage: function(id) {
    Reading.openReadingDetail(id);
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

  // Internal: finish quest step and return to callback
  // Only called when in quest mode and question answered correctly
  finishQuestStep: function() {
    var questContext = Reading.getQuestContext();
    if (!questContext) return;

    // Capture callback before clearing context
    var callback = questContext.callback;

    // Atomically clear quest context
    Reading.clearQuestContext();

    // Call the callback
    if (callback) {
      callback();
    }
  },

  // Internal: handle answer selection
  _handleAnswer: function(rd, q, chosenIndex) {
    var feedbackEl = document.getElementById("reading-detail-feedback");
    if (!q || typeof q.correctIndex !== "number") return;

    var correct = (chosenIndex === q.correctIndex);

    // If in mastery review mode, use review handler
    if (Reading._masteryReviewState) {
      Reading._handleMasteryReviewAnswer(rd, q, chosenIndex);
      return;
    }

    // Track attempts for Reading track
    if (typeof State !== "undefined" && State.recordQuestionAttempt) {
      State.recordQuestionAttempt("T_READING", correct);
    }

    // Track per-question mastery (qIndex=0 for primary question)
    if (typeof State !== "undefined" && State.recordReadingAnswer && rd && rd.id) {
      State.recordReadingAnswer(rd.id, 0, correct);
    }

    if (feedbackEl) {
      feedbackEl.classList.remove("correct", "wrong");
      if (correct) {
        feedbackEl.textContent = "✓ Correct!";
        feedbackEl.classList.add("correct");

        // Star 2: correct MCQ (and award XP once)
        var awardedStar2Xp = false;
        if (typeof State !== "undefined" && State.awardReadingStar) {
          State.awardReadingStar(rd.id, 2);
          if (!State.hasReadingXpAwarded(rd.id, "star2")) {
            State.awardXP(10, { trackId: "T_READING", reason: "reading_star2" });
            State.markReadingXpAwarded(rd.id, "star2");
            awardedStar2Xp = true;
          }
          Reading.renderReadingList();
        }
        
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
          if (awardedStar2Xp) {
            xpEl.style.display = "block";
            xpEl.textContent = "+10 XP";
          } else {
            xpEl.style.display = "none";
            xpEl.textContent = "";
          }
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
        
        // Show Next button after delay
        setTimeout(function() {
          var nextBtn = document.getElementById("reading-next-btn");
          if (nextBtn) nextBtn.style.display = "block";
        }, 800);
      } else {
        feedbackEl.textContent = "✗ Try again.";
        feedbackEl.classList.add("wrong");
      }
    }

    // If in quest mode and correct, finish this step
    if (correct && Reading.isQuestMode()) {
      // Debounce finish to allow user to see feedback
      setTimeout(function() {
        Reading.finishQuestStep();
      }, 600);
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
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    state.activeIndex = idx;
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
