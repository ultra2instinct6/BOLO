// =====================================
// Daily Quest Module (RESET / PLACEHOLDER)
// The Daily Quest feature is being rebuilt.
// For now: reset saved DQ state + render a disabled "coming soon" UI.
// =====================================

var DailyQuest = {
  quest: null,

  resetAll: function() {
    try {
      if (!window.State || !State.state) return;
      if (!State.state.progress) State.state.progress = {};
      if (!State.state.progress.bestScores) State.state.progress.bestScores = {};
      State.state.progress.bestScores.dailyQuestByProfile = {};
      State.save();
    } catch (e) {}
  },

  getOrCreate: function(profileId) {
    DailyQuest.quest = {
      profileId: profileId || null,
      status: "placeholder",
      queue: [],
      currentIndex: 0,
      completed: false
    };
    return DailyQuest.quest;
  },

  startNext: function() {
    try {
      DailyQuest.render();
      if (window.UI && typeof UI.goTo === "function") UI.goTo("screen-daily-quest");
    } catch (e) {}
  },

  render: function() {
    var check1 = document.getElementById("quest-check-learn");
    var check2 = document.getElementById("quest-check-reading");
    var check3 = document.getElementById("quest-check-games");
    var labelNodes = document.querySelectorAll('.quest-label');

    var btn = document.getElementById("btn-daily-quest-start");
    var btnLabelEn = document.getElementById("daily-quest-start-en");
    var btnLabelPa = document.getElementById("daily-quest-start-pa");
    var badge = document.getElementById("daily-quest-complete-badge");
    var streakEl = document.getElementById("daily-quest-streak");
    var counterEl = document.getElementById("daily-quest-counter");

    if (check1) check1.textContent = "☐";
    if (check2) check2.textContent = "☐";
    if (check3) check3.textContent = "☐";

    for (var i = 0; i < labelNodes.length; i++) {
      labelNodes[i].textContent = "Coming soon";
    }

    if (counterEl) counterEl.textContent = "Daily Quest: 0/3";
    if (badge) badge.style.display = "none";

    if (streakEl) {
      try {
        if (window.State && typeof State.getDailyQuestProfileContainer === "function") {
          var cont = State.getDailyQuestProfileContainer();
          streakEl.textContent = (cont && typeof cont.streakCount === "number") ? String(cont.streakCount) : "0";
        } else {
          streakEl.textContent = "0";
        }
      } catch (e2) {
        streakEl.textContent = "0";
      }
    }

    if (btn) {
      if (btnLabelEn) btnLabelEn.textContent = "Daily Quest (rebuilding)";
      if (btnLabelPa) btnLabelPa.textContent = "";
      btn.disabled = true;
    }
  },

  init: function() {
    DailyQuest.resetAll();

    var btnBack = document.getElementById("btn-daily-quest-back");
    if (btnBack) {
      btnBack.addEventListener("click", function() {
        UI.goTo("screen-home");
      });
    }

    var btnStart = document.getElementById("btn-daily-quest-start");
    if (btnStart) {
      btnStart.addEventListener("click", function(e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
      });
    }

    try { DailyQuest.render(); } catch (e3) {}
  }
};
