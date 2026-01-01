// =====================================
// Type Game (Standalone Parts of Speech)
// =====================================

var TypeGame = {
  state: {
    questions: [],
    idx: 0,
    correct: 0,
    total: 0,
    answered: false
  },

  parts: [
    { id: "noun", labelEn: "Noun", labelPa: "ਨਾਂ" },
    { id: "pronoun", labelEn: "Pronoun", labelPa: "ਸਰਵਨਾਮ" },
    { id: "verb", labelEn: "Verb", labelPa: "ਕਿਰਿਆ" },
    { id: "adjective", labelEn: "Adjective", labelPa: "ਵਿਸ਼ੇਸ਼ਣ" },
    { id: "adverb", labelEn: "Adverb", labelPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ" },
    { id: "preposition", labelEn: "Preposition", labelPa: "ਪੂਰਵ-ਬੋਧਕ" },
    { id: "conjunction", labelEn: "Conjunction", labelPa: "ਸੰਯੋਜਕ" },
    { id: "article", labelEn: "Article", labelPa: "ਲੇਖ" },
    { id: "interjection", labelEn: "Interjection", labelPa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ" }
  ],

  els: {},

  init: function() {
    TypeGame.cacheEls();
    TypeGame.bind();
    TypeGame.resetView();
  },

  cacheEls: function() {
    TypeGame.els.card = document.getElementById("type-game-card");
    TypeGame.els.word = document.getElementById("type-word");
    TypeGame.els.progress = document.getElementById("type-progress");
    TypeGame.els.options = document.getElementById("type-options");
    TypeGame.els.feedback = document.getElementById("type-feedback");
    TypeGame.els.next = document.getElementById("btn-type-next");
    TypeGame.els.restart = document.getElementById("btn-type-restart");
    TypeGame.els.summary = document.getElementById("type-summary");
    TypeGame.els.scoreLine = document.getElementById("type-score-line");
    TypeGame.els.accuracyLine = document.getElementById("type-accuracy-line");
    TypeGame.els.start = document.getElementById("btn-type-start");
  },

  bind: function() {
    var startBtn = TypeGame.els.start;
    if (startBtn && (!startBtn.dataset || !startBtn.dataset.bound)) {
      if (startBtn.dataset) startBtn.dataset.bound = "1";
      startBtn.addEventListener("click", function() {
        TypeGame.start();
      });
    }

    var nextBtn = TypeGame.els.next;
    if (nextBtn && (!nextBtn.dataset || !nextBtn.dataset.bound)) {
      if (nextBtn.dataset) nextBtn.dataset.bound = "1";
      nextBtn.addEventListener("click", function() {
        TypeGame.onNext();
      });
    }

    var restartBtn = TypeGame.els.restart;
    if (restartBtn && (!restartBtn.dataset || !restartBtn.dataset.bound)) {
      if (restartBtn.dataset) restartBtn.dataset.bound = "1";
      restartBtn.addEventListener("click", function() {
        TypeGame.start();
      });
    }
  },

  resetView: function() {
    if (TypeGame.els.card) {
      TypeGame.els.card.style.display = "none";
      TypeGame.els.card.setAttribute("aria-hidden", "true");
    }
    TypeGame.setFeedback("");
    if (TypeGame.els.next) {
      TypeGame.els.next.style.display = "none";
      TypeGame.els.next.disabled = true;
      TypeGame.els.next.textContent = "Next";
    }
    if (TypeGame.els.summary) {
      TypeGame.els.summary.style.display = "none";
      TypeGame.els.summary.setAttribute("aria-hidden", "true");
    }
    if (TypeGame.els.options) TypeGame.els.options.innerHTML = "";
  },

  start: function() {
    var bank = (typeof GAME2_QUESTIONS !== "undefined" && Array.isArray(GAME2_QUESTIONS)) ? GAME2_QUESTIONS.slice() : [];
    if (!bank.length) {
      TypeGame.setFeedback("No questions available.");
      return;
    }

    var qs = TypeGame.shuffle(bank).slice(0, 12);
    TypeGame.state.questions = qs;
    TypeGame.state.idx = 0;
    TypeGame.state.correct = 0;
    TypeGame.state.total = qs.length;
    TypeGame.state.answered = false;

    if (TypeGame.els.card) {
      TypeGame.els.card.style.display = "block";
      TypeGame.els.card.setAttribute("aria-hidden", "false");
    }
    if (TypeGame.els.summary) {
      TypeGame.els.summary.style.display = "none";
      TypeGame.els.summary.setAttribute("aria-hidden", "true");
    }
    if (TypeGame.els.next) {
      TypeGame.els.next.style.display = "inline-block";
      TypeGame.els.next.disabled = true;
      TypeGame.els.next.textContent = "Next";
    }
    TypeGame.setFeedback("");
    TypeGame.renderQuestion();
  },

  renderQuestion: function() {
    var q = TypeGame.state.questions[TypeGame.state.idx];
    if (!q) {
      TypeGame.finish();
      return;
    }

    if (TypeGame.els.progress) {
      TypeGame.els.progress.textContent = "Question " + (TypeGame.state.idx + 1) + " of " + TypeGame.state.total;
    }
    if (TypeGame.els.word) {
      TypeGame.els.word.textContent = String(q.word || "");
    }
    TypeGame.state.answered = false;
    TypeGame.setFeedback("");
    if (TypeGame.els.next) {
      TypeGame.els.next.disabled = true;
      TypeGame.els.next.textContent = (TypeGame.state.idx + 1 >= TypeGame.state.total) ? "Finish" : "Next";
    }
    TypeGame.renderOptions(q);
  },

  renderOptions: function(q) {
    var container = TypeGame.els.options;
    if (!container) return;
    container.innerHTML = "";

    var punjabiOn = (typeof State !== "undefined" && State && State.state && State.state.settings && State.state.settings.punjabiOn === true);

    for (var i = 0; i < TypeGame.parts.length; i++) {
      var part = TypeGame.parts[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-secondary";
      btn.style.margin = "6px";
      btn.dataset.partId = part.id;
      btn.textContent = punjabiOn ? (part.labelEn + " / " + part.labelPa) : part.labelEn;
      btn.addEventListener("click", function(evt) {
        var pid = evt.currentTarget && evt.currentTarget.dataset ? evt.currentTarget.dataset.partId : null;
        TypeGame.onChoice(pid);
      });
      container.appendChild(btn);
    }
  },

  onChoice: function(partId) {
    if (TypeGame.state.answered) return;
    var q = TypeGame.state.questions[TypeGame.state.idx];
    if (!q) return;
    var correct = (partId && partId === q.correctPartId);
    TypeGame.state.answered = true;
    if (correct) TypeGame.state.correct += 1;

    TypeGame.paintResults(partId, q.correctPartId);
    TypeGame.setFeedback(correct ? "Correct!" : "Try again next one.");
    if (TypeGame.els.next) TypeGame.els.next.disabled = false;
  },

  paintResults: function(chosenId, correctId) {
    var container = TypeGame.els.options;
    if (!container) return;
    var kids = container.children || [];
    for (var i = 0; i < kids.length; i++) {
      var btn = kids[i];
      var pid = btn && btn.dataset ? btn.dataset.partId : null;
      if (pid === correctId) {
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn");
        btn.style.background = "#0c7b12";
        btn.style.color = "#fff";
      }
      if (pid === chosenId && pid !== correctId) {
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn");
        btn.style.background = "#b91c1c";
        btn.style.color = "#fff";
      }
      btn.disabled = true;
    }
  },

  onNext: function() {
    if (TypeGame.state.idx + 1 >= TypeGame.state.total) {
      TypeGame.finish();
      return;
    }
    TypeGame.state.idx += 1;
    TypeGame.renderQuestion();
  },

  finish: function() {
    if (TypeGame.els.next) {
      TypeGame.els.next.disabled = true;
      TypeGame.els.next.textContent = "Finished";
    }
    if (TypeGame.els.options) {
      var kids = TypeGame.els.options.children || [];
      for (var i = 0; i < kids.length; i++) {
        kids[i].disabled = true;
      }
    }
    var score = TypeGame.state.correct;
    var total = TypeGame.state.total || 1;
    var accuracy = Math.round((score / total) * 100);
    if (TypeGame.els.summary) {
      TypeGame.els.summary.style.display = "block";
      TypeGame.els.summary.setAttribute("aria-hidden", "false");
    }
    if (TypeGame.els.scoreLine) TypeGame.els.scoreLine.textContent = "Score: " + score + "/" + total;
    if (TypeGame.els.accuracyLine) TypeGame.els.accuracyLine.textContent = "Accuracy: " + accuracy + "%";
    TypeGame.setFeedback("Round complete");
  },

  setFeedback: function(msg) {
    if (!TypeGame.els.feedback) return;
    TypeGame.els.feedback.textContent = msg || "";
  },

  shuffle: function(list) {
    var a = Array.isArray(list) ? list.slice() : [];
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }
};
