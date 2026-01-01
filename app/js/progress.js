// =====================================
// Progress Module - owns screen-progress
// =====================================

var Progress = {
  init: function() {
    // Render progress on startup
    Progress.refresh();
  },

  refresh: function() {
    // Ensure defaults
    if (window.State && State.ensureTracksInitialized) State.ensureTracksInitialized();
    var prog = (State.state && State.state.progress) ? State.state.progress : { totalXP: 0, trackXP: {} };
    var totalXP = typeof prog.totalXP === "number" ? prog.totalXP : 0;

    var xpPerLevel = (typeof State !== "undefined" && State.XP_PER_LEVEL) ? State.XP_PER_LEVEL : 100;
    var profile = (typeof State !== "undefined" && State.getActiveProfile) ? State.getActiveProfile() : null;
    var level = 1, xpInto = 0, need = xpPerLevel, pct = 0;

    if (profile && typeof profile.xp === "number") {
      level = profile.level || (Math.floor(profile.xp / xpPerLevel) + 1);
      xpInto = profile.xp % xpPerLevel;
      need = xpPerLevel - xpInto;
      pct = Math.max(0, Math.min(100, Math.floor((xpInto / xpPerLevel) * 100)));
    } else {
      level = Math.floor(totalXP / xpPerLevel) + 1;
      xpInto = totalXP % xpPerLevel;
      need = xpPerLevel - xpInto;
      pct = Math.max(0, Math.min(100, Math.floor((xpInto / xpPerLevel) * 100)));
    }

    // Header
    var levelEl = document.getElementById("progress-level");
    if (levelEl) levelEl.textContent = "" + level;

    var xpEl = document.getElementById("progress-xp");
    if (xpEl) xpEl.textContent = totalXP + " XP";

    var xpNextEl = document.getElementById("progress-xp-next");
    if (xpNextEl) xpNextEl.textContent = need + " XP to next level";

    var xpBar = document.getElementById("progress-xp-bar");
    if (xpBar) xpBar.style.width = pct + "%";

    // Tracks list
    var tracksList = document.getElementById("progress-tracks-list");
    if (tracksList) {
      tracksList.innerHTML = "";
      var ids = [];
      if (typeof TRACKS === "object") {
        for (var k in TRACKS) if (TRACKS.hasOwnProperty(k)) ids.push(k);
      }
      for (var k2 in prog.trackXP) if (prog.trackXP.hasOwnProperty(k2) && ids.indexOf(k2) === -1) ids.push(k2);

      if (!ids.length) {
        var li0 = document.createElement("li");
        li0.innerHTML = "<div class='lesson-text-en'>No track data yet</div><div class='lesson-text-pa' lang='pa'>ਹਾਲੇ ਡਾਟਾ ਨਹੀਂ</div>";
        tracksList.appendChild(li0);
      } else {
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i];
          var bucket = prog.trackXP[id] || { xp: 0, questionsAttempted: 0, questionsCorrect: 0 };
          var tMeta = (typeof TRACKS === "object" && TRACKS[id]) ? TRACKS[id] : null;
          var nameEn = (tMeta && (tMeta.nameEn || tMeta.name)) ? (tMeta.nameEn || tMeta.name) : id;
          var namePa = tMeta && tMeta.namePa ? tMeta.namePa : id;
          var attempted = bucket.questionsAttempted || 0;
          var correct = bucket.questionsCorrect || 0;
          var acc = (attempted > 0) ? Math.round((correct / attempted) * 100) + "%" : "–";

          var li = document.createElement("li");
          li.innerHTML =
            "<div class='lesson-text-en'>" + nameEn + ": " + (bucket.xp||0) + " XP (Q: " + correct + "/" + attempted + ", " + acc + ")</div>" +
            "<div class='lesson-text-pa' lang='pa'>" + namePa + "</div>";
          tracksList.appendChild(li);
        }
      }
    }

    // Daily Quest streak summary (reuse reading summary area)
    var readingSum = document.getElementById("progress-reading-summary");
    if (readingSum) {
      var dq = (typeof State !== "undefined" && State.getDailyQuestProfileContainer) ? State.getDailyQuestProfileContainer() : { streakCount: 0, lastCompletedDateKey: null };
      var streak = dq && dq.streakCount ? dq.streakCount : 0;
      var last = dq && dq.lastCompletedDateKey ? dq.lastCompletedDateKey : "–";
      var nextM = (typeof State !== "undefined" && State.getNextStreakMilestone) ? State.getNextStreakMilestone(streak) : null;
      var toGo = nextM ? (nextM - streak) : 0;
      var en = "Daily Quest Streak: " + streak + " | Last: " + last;
      if (nextM) en += " | Next at " + nextM + " (" + toGo + " to go)";
      var pa = "ਰੋਜ਼ਾਨਾ ਲੜੀ: " + streak + " | ਆਖਰੀ: " + last;
      if (nextM) pa += " | ਅਗਲਾ " + nextM + " (ਬਾਕੀ " + toGo + ")";
      readingSum.textContent = en + " / " + pa;
    }
  }
};
