// =====================================
// State Management
// =====================================

var State = {
  // ==== XP / Level / Streak constants (ES5) ====
  XP_PER_CORRECT: 5,
  XP_DAILY_QUEST_COMPLETE: 25,
  XP_PER_LEVEL: 100,
  STREAK_MILESTONES: [5, 10, 25, 50, 100, 250, 365, 500, 750, 1000],
  STREAK_MILESTONE_XP: {
    5: 10, 10: 20, 25: 40, 50: 75, 100: 150, 250: 300, 365: 500, 500: 800, 750: 1200, 1000: 1600
  },
  VERSION: 2,
  STORAGE_KEY: "boloAppState_v2",
  _recoveryNeeded: false,
  _defaultState: {
    version: 1,
    profile: {
      activeProfileId: "p1",
      profiles: [
        { id: "p1", name: "Player 1", xp: 0, level: 1 }
      ]
    },
    settings: {
      punjabiOn: true
    },
    progress: {
      trackXP: {},
      lessonDone: {},
      lessonProgress: {},
      readingDone: {},
      bestScores: {},
      totalXP: 0
    },
    session: {
      screenId: "screen-home",
      currentLessonId: null,
      currentLessonStep: 0,
      currentReadingId: null,
      currentGameId: null
    },
    parentData: {
      notes: {},
      goals: [],
      preferences: {
        showTips: true,
        language: "en"
      }
    }
  },
  state: null,

  _freshState: function() {
    return JSON.parse(JSON.stringify(State._defaultState));
  },

  _isFiniteNumber: function(value) {
    return typeof value === "number" && isFinite(value);
  },

  _validateState: function(candidate) {
    if (!candidate || typeof candidate !== "object") return false;
    if (!candidate.profile || typeof candidate.profile !== "object") return false;
    if (!candidate.profile.profiles || !Array.isArray(candidate.profile.profiles) || candidate.profile.profiles.length === 0) return false;
    if (typeof candidate.profile.activeProfileId !== "string") return false;

    var hasActive = false;
    for (var i = 0; i < candidate.profile.profiles.length; i++) {
      var p = candidate.profile.profiles[i];
      if (!p || typeof p !== "object") return false;
      if (typeof p.id !== "string" || !p.id) return false;
      if (typeof p.name !== "string") return false;
      if (!State._isFiniteNumber(p.xp)) return false;
      if (!State._isFiniteNumber(p.level)) return false;
      if (p.id === candidate.profile.activeProfileId) hasActive = true;
    }
    if (!hasActive) return false;

    if (!candidate.settings || typeof candidate.settings !== "object") return false;

    return true;
  },

  // Create a backup before writing main state
  _createBackup: function() {
    try {
      // Rotate backups: backup_1 → backup_2, current → backup_1
      var backup1Key = State.STORAGE_KEY + "_backup_1";
      var backup2Key = State.STORAGE_KEY + "_backup_2";
      
      var current = localStorage.getItem(backup1Key);
      if (current) {
        localStorage.setItem(backup2Key, current);
      }
      
      // Save current state as backup_1
      if (State.state && typeof State.state === "object") {
        localStorage.setItem(backup1Key, JSON.stringify(State.state));
      }
    } catch (e) {
      console.warn("Failed to create backup:", e.message);
      // Don't throw; backup failure shouldn't prevent save
    }
  },

  // Try to restore from a specific backup slot (1 or 2)
  _tryRestoreFromBackup: function(slotIndex) {
    try {
      var backupKey = State.STORAGE_KEY + "_backup_" + slotIndex;
      var raw = localStorage.getItem(backupKey);
      if (!raw) {
        return false;
      }
      var loaded = JSON.parse(raw);
      if (State._validateState(loaded)) {
        State.state = loaded;
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Backup slot " + slotIndex + " corrupt:", e.message);
      return false;
    }
  },

  // Load state from localStorage with validation and safe fallback
  load: function() {
    State.state = State._freshState();
    try {
      var raw = localStorage.getItem(State.STORAGE_KEY);
      if (raw) {
        var loaded = JSON.parse(raw);
        if (State._validateState(loaded)) {
          if (typeof loaded.version !== "number") loaded.version = State.VERSION;
          State.state = loaded;
          State._recoveryNeeded = false;
        } else {
          State._recoveryNeeded = true;
          console.warn("State validation failed; attempting recovery from backup...");
          // Try backup_1 (most recent)
          if (State._tryRestoreFromBackup(1)) {
            console.log("✅ State recovered from backup_1");
            return;
          }
          // Try backup_2 (older backup)
          if (State._tryRestoreFromBackup(2)) {
            console.log("✅ State recovered from backup_2");
            return;
          }
          // All failed; use default
          console.error("All backups corrupt or missing; using default state.");
        }
      }
    } catch (e) {
      State._recoveryNeeded = true;
      console.error("Failed to load state:", e);
      // Try recovery from backup
      if (State._tryRestoreFromBackup(1)) {
        console.log("✅ State recovered from backup_1 after parse error");
        return;
      }
      if (State._tryRestoreFromBackup(2)) {
        console.log("✅ State recovered from backup_2 after parse error");
        return;
      }
    }
    // Ensure all tracks are initialized
    State.ensureTracksInitialized();
  },

  // Save state to localStorage with backup rotation
  save: function() {
    try {
      // Create backup before writing
      State._createBackup();
      
      if (State.state && typeof State.state === "object") {
        State.state.version = State.VERSION;
      }
      localStorage.setItem(State.STORAGE_KEY, JSON.stringify(State.state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  },

  // Clear all persisted state (main + backups) and reload
  resetAll: function(confirmMsg) {
    try {
      if (confirmMsg) {
        var ok = window.confirm(confirmMsg);
        if (!ok) return false;
      }

      localStorage.removeItem(State.STORAGE_KEY);
      localStorage.removeItem(State.STORAGE_KEY + "_backup_1");
      localStorage.removeItem(State.STORAGE_KEY + "_backup_2");
    } catch (e) {
      console.warn("Failed to reset state:", e);
    }

    try {
      window.location.reload();
    } catch (e2) {
      // As a fallback, allow caller to handle reload issues
    }
    return true;
  },

  // Ensure defaults and track buckets exist (safe if TRACKS is missing)
  ensureTracksInitialized: function() {
    // Ensure settings container exists
    if (!State.state.settings || typeof State.state.settings !== "object") State.state.settings = {};
    if (typeof State.state.settings.punjabiOn !== "boolean") State.state.settings.punjabiOn = true;

    // Learn QA logging (debug): default OFF, migrate legacy localStorage key
    if (typeof State.state.settings.learnQAOn !== "boolean") State.state.settings.learnQAOn = false;
    try {
      var legacyQA = localStorage.getItem('LEARN_QA');
      if (legacyQA === '1') {
        State.state.state && State.state.state; // no-op placeholder for old guards
        State.state.settings.learnQAOn = true;
        // Remove legacy key after migration for cleanliness
        localStorage.removeItem('LEARN_QA');
      }
    } catch (e) { /* ignore parse/migration errors */ }

    // Play / Games difficulty (default MEDIUM=2)
    if (!State.state.settings.playDifficultyByProfile || typeof State.state.settings.playDifficultyByProfile !== "object") {
      State.state.settings.playDifficultyByProfile = {};
    }
    if (typeof State.state.settings.playDifficulty !== "number") State.state.settings.playDifficulty = 2;

    // Reading vocab toggle (default OFF)
    if (!State.state.settings.readingVocabByProfile || typeof State.state.settings.readingVocabByProfile !== "object") {
      State.state.settings.readingVocabByProfile = {};
    }
    if (typeof State.state.settings.readingVocabOn !== "boolean") State.state.settings.readingVocabOn = false;

    // Reading vocab collapse (persisted): default NOT collapsed
    if (!State.state.settings.readingVocabCollapsedByProfile || typeof State.state.settings.readingVocabCollapsedByProfile !== "object") {
      State.state.settings.readingVocabCollapsedByProfile = {};
    }
    if (typeof State.state.settings.readingVocabCollapsed !== "boolean") State.state.settings.readingVocabCollapsed = false;

    // Reading UI controls (default values)
    if (!State.state.settings.readingUiByProfile || typeof State.state.settings.readingUiByProfile !== "object") {
      State.state.settings.readingUiByProfile = {};
    }
    if (!State.state.settings.readingUi || typeof State.state.settings.readingUi !== "object") {
      State.state.settings.readingUi = { fontStep: 1, langMode: "both", lineSpacing: "normal" };
    } else {
      if (typeof State.state.settings.readingUi.fontStep !== "number") State.state.settings.readingUi.fontStep = 1;
      if (typeof State.state.settings.readingUi.langMode !== "string") State.state.settings.readingUi.langMode = "both";
      if (typeof State.state.settings.readingUi.lineSpacing !== "string") State.state.settings.readingUi.lineSpacing = "normal";
    }

    // Ensure progress containers exist
    if (!State.state.progress) State.state.progress = {};
    if (typeof State.state.progress.totalXP !== "number") State.state.progress.totalXP = 0;

    // Footer/UI helpers (additive): track XP last seen on Progress screen per profile
    if (!State.state.progress.lastSeenXPByProfile || typeof State.state.progress.lastSeenXPByProfile !== "object") {
      State.state.progress.lastSeenXPByProfile = {};
    }
    if (!State.state.progress.trackXP || typeof State.state.progress.trackXP !== "object") State.state.progress.trackXP = {};
    if (!State.state.progress.bestScores || typeof State.state.progress.bestScores !== "object") State.state.progress.bestScores = {};
    if (!State.state.progress.lessonProgress) State.state.progress.lessonProgress = {};

    // Reading progress (per profile): 0–3 stars + XP award guards
    if (!State.state.progress.readingByProfile || typeof State.state.progress.readingByProfile !== "object") {
      State.state.progress.readingByProfile = {};
    }

    // Reading question mastery stats (per profile)
    // Keyed by readingId:qIndex, stores {attempts, correctEver, lastAttemptAt}
    if (!State.state.progress.readingQuestionStatsByProfile || typeof State.state.progress.readingQuestionStatsByProfile !== "object") {
      State.state.progress.readingQuestionStatsByProfile = {};
    }

    // Games: persistent missed-question flags (per profile)
    // Used for BOLO v2 adaptive feedback ("Nice improvement!" on first-try correct after a previous miss)
    if (!State.state.progress.gamesMissedByProfile || typeof State.state.progress.gamesMissedByProfile !== "object") {
      State.state.progress.gamesMissedByProfile = {};
    }

    // Game best scores defaults (non-breaking)
    if (typeof State.state.progress.bestScores.game1 !== "number") State.state.progress.bestScores.game1 = 0;
    if (typeof State.state.progress.bestScores.game2 !== "number") State.state.progress.bestScores.game2 = 0;
    if (typeof State.state.progress.bestScores.game3 !== "number") State.state.progress.bestScores.game3 = 0;
    if (typeof State.state.progress.bestScores.game4 !== "number") State.state.progress.bestScores.game4 = 0;

    // Daily Quest container (per profile)
    if (!State.state.progress.bestScores.dailyQuestByProfile) State.state.progress.bestScores.dailyQuestByProfile = {};

    // Ensure session container exists (older saves safety)
    if (!State.state.session || typeof State.state.session !== "object") {
      State.state.session = {
        screenId: "screen-home",
        currentLessonId: null,
        currentLessonStep: 0,
        currentReadingId: null,
        currentGameId: null,
        gameSession: null
      };
    } else {
      if (typeof State.state.session.screenId !== "string") State.state.session.screenId = "screen-home";
      if (typeof State.state.session.currentLessonId === "undefined") State.state.session.currentLessonId = null;
      if (typeof State.state.session.currentLessonStep !== "number") State.state.session.currentLessonStep = 0;
      if (typeof State.state.session.currentReadingId === "undefined") State.state.session.currentReadingId = null;
      if (typeof State.state.session.currentGameId === "undefined") State.state.session.currentGameId = null;
      if (typeof State.state.session.gameSession === "undefined") State.state.session.gameSession = null;
    }

    // Initialize known TRACKS if available
    if (typeof TRACKS === "object") {
      for (var key in TRACKS) {
        if (!State.state.progress.trackXP[key]) {
          State.state.progress.trackXP[key] = {
            xp: 0,
            lessonsCompleted: 0,
            questionsAttempted: 0,
            questionsCorrect: 0
          };
        }
      }
    }
  },

  // ===== Punjabi mode (persisted, global) =====

  getPunjabiEnabled: function() {
    State.ensureTracksInitialized();
    return !!(State.state && State.state.settings && State.state.settings.punjabiOn);
  },

  setPunjabiEnabled: function(isOn) {
    State.ensureTracksInitialized();
    State.state.settings.punjabiOn = !!isOn;
    State.save();
    return State.state.settings.punjabiOn;
  },

  // ===== Learn QA logging (persisted, global) =====

  getLearnQAEnabled: function() {
    State.ensureTracksInitialized();
    var v = State.state && State.state.settings ? State.state.settings.learnQAOn : false;
    return !!v;
  },

  setLearnQAEnabled: function(isOn) {
    State.ensureTracksInitialized();
    State.state.settings.learnQAOn = !!isOn;
    State.save();
    return State.state.settings.learnQAOn;
  },

  // ===== Play / Games difficulty (persisted per profile) =====

  getPlayDifficulty: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.playDifficultyByProfile) {
      var v = State.state.settings.playDifficultyByProfile[p.id];
      if (typeof v === "number") {
        v = v | 0;
        return Math.max(1, Math.min(3, v));
      }
    }
    if (typeof State.state.settings.playDifficulty === "number") {
      var g = State.state.settings.playDifficulty | 0;
      return Math.max(1, Math.min(3, g));
    }
    return 2;
  },

  setPlayDifficulty: function(difficulty) {
    State.ensureTracksInitialized();
    var d = Math.max(1, Math.min(3, difficulty | 0));
    var p = State.getActiveProfile();
    if (p && State.state.settings.playDifficultyByProfile) {
      State.state.settings.playDifficultyByProfile[p.id] = d;
    } else {
      State.state.settings.playDifficulty = d;
    }
    State.save();
    return d;
  },

  // Get active profile
  getActiveProfile: function() {
    var profileId = State.state.profile.activeProfileId;
    for (var i = 0; i < State.state.profile.profiles.length; i++) {
      if (State.state.profile.profiles[i].id === profileId) {
        return State.state.profile.profiles[i];
      }
    }
    return State.state.profile.profiles[0] || null;
  },

  // Set active profile
  setActiveProfile: function(profileId) {
    State.state.profile.activeProfileId = profileId;
    State.save();
  },

  // ===== Reading Vocabulary toggle (persisted) =====

  getReadingVocabEnabled: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingVocabByProfile) {
      var v = State.state.settings.readingVocabByProfile[p.id];
      if (typeof v === "boolean") return v;
    }
    if (typeof State.state.settings.readingVocabOn === "boolean") return State.state.settings.readingVocabOn;
    return false;
  },

  setReadingVocabEnabled: function(isOn) {
    State.ensureTracksInitialized();
    var next = !!isOn;
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingVocabByProfile) {
      State.state.settings.readingVocabByProfile[p.id] = next;
    } else {
      State.state.settings.readingVocabOn = next;
    }
    State.save();
  },

  // ===== Reading Vocabulary collapse (persisted) =====

  getReadingVocabCollapsed: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingVocabCollapsedByProfile) {
      var v = State.state.settings.readingVocabCollapsedByProfile[p.id];
      if (typeof v === "boolean") return v;
    }
    if (typeof State.state.settings.readingVocabCollapsed === "boolean") return State.state.settings.readingVocabCollapsed;
    return false;
  },

  setReadingVocabCollapsed: function(isCollapsed) {
    State.ensureTracksInitialized();
    var next = !!isCollapsed;
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingVocabCollapsedByProfile) {
      State.state.settings.readingVocabCollapsedByProfile[p.id] = next;
    } else {
      State.state.settings.readingVocabCollapsed = next;
    }
    State.save();
    return next;
  },

  // ===== Reading UI controls (persisted per profile) =====

  _normalizeReadingUiSettings: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    var out = {
      fontStep: (typeof obj.fontStep === "number") ? obj.fontStep : 1,
      langMode: (typeof obj.langMode === "string") ? obj.langMode : "both",
      lineSpacing: (typeof obj.lineSpacing === "string") ? obj.lineSpacing : "normal"
    };

    // Clamp / coerce
    out.fontStep = Math.max(0, Math.min(3, out.fontStep | 0));
    if (out.langMode !== "both" && out.langMode !== "en" && out.langMode !== "pa") out.langMode = "both";
    if (out.lineSpacing !== "normal" && out.lineSpacing !== "wide") out.lineSpacing = "normal";
    return out;
  },

  getReadingUiSettings: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingUiByProfile) {
      var v = State.state.settings.readingUiByProfile[p.id];
      if (v && typeof v === "object") return State._normalizeReadingUiSettings(v);
    }
    return State._normalizeReadingUiSettings(State.state.settings.readingUi);
  },

  setReadingUiSettings: function(partial) {
    State.ensureTracksInitialized();
    var current = State.getReadingUiSettings();
    var next = {
      fontStep: (partial && typeof partial.fontStep === "number") ? partial.fontStep : current.fontStep,
      langMode: (partial && typeof partial.langMode === "string") ? partial.langMode : current.langMode,
      lineSpacing: (partial && typeof partial.lineSpacing === "string") ? partial.lineSpacing : current.lineSpacing
    };
    next = State._normalizeReadingUiSettings(next);

    var p = State.getActiveProfile();
    if (p && State.state.settings.readingUiByProfile) {
      State.state.settings.readingUiByProfile[p.id] = next;
    } else {
      State.state.settings.readingUi = next;
    }
    State.save();
    return next;
  },

  // ===== Reading stars + XP guards (persisted per profile) =====

  ensureReadingProfileDefaults: function(profileId) {
    State.ensureTracksInitialized();
    if (!profileId) return null;
    var map = State.state.progress.readingByProfile;
    var obj = map[profileId];
    if (!obj || typeof obj !== "object") obj = {};
    if (!obj.starsByReadingId || typeof obj.starsByReadingId !== "object") obj.starsByReadingId = {};
    if (!obj.xpByReadingId || typeof obj.xpByReadingId !== "object") obj.xpByReadingId = {};
    map[profileId] = obj;
    return obj;
  },

  getReadingProfileContainer: function() {
    var p = State.getActiveProfile();
    if (!p) return null;
    return State.ensureReadingProfileDefaults(p.id);
  },

  getReadingStars: function(readingId) {
    var cont = State.getReadingProfileContainer();
    if (!cont || !readingId) return 0;
    var v = cont.starsByReadingId[readingId];
    if (typeof v !== "number") return 0;
    v = v | 0;
    return Math.max(0, Math.min(3, v));
  },

  setReadingStars: function(readingId, stars) {
    var cont = State.getReadingProfileContainer();
    if (!cont || !readingId) return 0;
    var next = Math.max(0, Math.min(3, stars | 0));
    var cur = State.getReadingStars(readingId);
    if (next < cur) next = cur; // keep best
    cont.starsByReadingId[readingId] = next;
    State.save();
    return next;
  },

  awardReadingStar: function(readingId, starNum) {
    var cur = State.getReadingStars(readingId);
    var next = Math.max(cur, Math.max(0, Math.min(3, starNum | 0)));
    return State.setReadingStars(readingId, next);
  },

  hasReadingXpAwarded: function(readingId, key) {
    var cont = State.getReadingProfileContainer();
    if (!cont || !readingId || !key) return false;
    var obj = cont.xpByReadingId[readingId];
    return !!(obj && typeof obj === "object" && obj[key] === true);
  },

  markReadingXpAwarded: function(readingId, key) {
    var cont = State.getReadingProfileContainer();
    if (!cont || !readingId || !key) return;
    var obj = cont.xpByReadingId[readingId];
    if (!obj || typeof obj !== "object") obj = {};
    obj[key] = true;
    cont.xpByReadingId[readingId] = obj;
    State.save();
  },

  // ===== Reading question mastery tracking (per profile) =====

  _getReadingQuestionStatsContainer: function() {
    var p = State.getActiveProfile();
    if (!p) return null;
    State.ensureTracksInitialized();
    var map = State.state.progress.readingQuestionStatsByProfile;
    var obj = map[p.id];
    if (!obj || typeof obj !== "object") obj = {};
    map[p.id] = obj;
    return obj;
  },

  recordReadingAnswer: function(readingId, qIndex, isCorrect) {
    if (!readingId || typeof qIndex !== "number") return;
    var cont = State._getReadingQuestionStatsContainer();
    if (!cont) return;
    
    var qKey = readingId + ":" + qIndex;
    var stat = cont[qKey];
    if (!stat || typeof stat !== "object") {
      stat = { attempts: 0, correctEver: false, lastAttemptAt: 0 };
    }
    
    stat.attempts = (stat.attempts || 0) + 1;
    if (isCorrect) stat.correctEver = true; // idempotent: once true stays true
    stat.lastAttemptAt = Date.now();
    
    cont[qKey] = stat;
    State.save();
  },

  isQuestionMastered: function(readingId, qIndex) {
    if (!readingId || typeof qIndex !== "number") return false;
    var cont = State._getReadingQuestionStatsContainer();
    if (!cont) return false;
    
    var qKey = readingId + ":" + qIndex;
    var stat = cont[qKey];
    return !!(stat && stat.correctEver === true);
  },

  // ===== Bundle helpers (use READINGS global from readings.js) =====

  getBundleReadings: function(bundleId) {
    if (typeof READINGS === "undefined" || !Array.isArray(READINGS)) return [];
    var result = [];
    for (var i = 0; i < READINGS.length; i++) {
      var r = READINGS[i];
      // Fallback: if bundleId missing, treat as bundle 1
      var rBundleId = (typeof r.bundleId === "number") ? r.bundleId : 1;
      if (rBundleId === bundleId) result.push(r);
    }
    return result;
  },

  isBundleComplete: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    if (readings.length === 0) return false;
    
    for (var i = 0; i < readings.length; i++) {
      var stars = State.getReadingStars(readings[i].id);
      if (stars < 2) return false; // Star 2 = completed (answered correctly)
    }
    return true;
  },

  getBundleMasteryPct: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    if (readings.length === 0) return 0;
    
    var totalQuestions = 0;
    var masteredQuestions = 0;
    
    for (var i = 0; i < readings.length; i++) {
      var r = readings[i];
      if (r.questions && Array.isArray(r.questions)) {
        for (var q = 0; q < r.questions.length; q++) {
          totalQuestions++;
          if (State.isQuestionMastered(r.id, q)) {
            masteredQuestions++;
          }
        }
      }
    }
    
    return totalQuestions > 0 ? (masteredQuestions / totalQuestions) : 0;
  },

  isBundleUnlocked: function(bundleId) {
    if (bundleId === 1) return true; // Bundle 1 always unlocked
    
    var prevBundleId = bundleId - 1;
    if (prevBundleId < 1) return false;
    
    // Unlock if previous bundle is complete AND mastery >= 70%
    if (!State.isBundleComplete(prevBundleId)) return false;
    
    var masteryPct = State.getBundleMasteryPct(prevBundleId);
    return masteryPct >= 0.7;
  },

  isBundleReviewNeeded: function(bundleId) {
    if (!State.isBundleComplete(bundleId)) return false;
    var masteryPct = State.getBundleMasteryPct(bundleId);
    return masteryPct < 0.7;
  },

  getUnmasteredQuestionsInBundle: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    var result = [];
    
    for (var i = 0; i < readings.length; i++) {
      var r = readings[i];
      if (r.questions && Array.isArray(r.questions)) {
        for (var q = 0; q < r.questions.length; q++) {
          if (!State.isQuestionMastered(r.id, q)) {
            result.push({ readingId: r.id, qIndex: q });
          }
        }
      }
    }
    
    return result;
  },

  // Add a new profile
  addProfile: function(name) {
    var MAX_PROFILES = 3;
    if (State.state.profile.profiles.length >= MAX_PROFILES) {
      return false;
    }
    var newId = "p" + (State.state.profile.profiles.length + 1);
    State.state.profile.profiles.push({
      id: newId,
      name: name || "Player " + (State.state.profile.profiles.length + 1),
      xp: 0,
      level: 1
    });
    State.save();
    return true;
  },

  // Legacy wrapper: use DailyQuest module instead
  ensureDailyQuest: function() {
    if (typeof DailyQuest !== "undefined" && DailyQuest.getOrCreate) {
      var p = State.getActiveProfile();
      if (p) return DailyQuest.getOrCreate(p.id);
    }
    return null;
  },

  // Legacy wrapper: use DailyQuest module instead
  getActiveDailyQuest: function() {
    if (typeof DailyQuest !== "undefined" && DailyQuest.getOrCreate) {
      var p = State.getActiveProfile();
      if (p) return DailyQuest.getOrCreate(p.id);
    }
    return null;
  },

  // ==== XP / stats helpers (ES5) ====
  ensureTrackBucket: function(trackId) {
    State.ensureTracksInitialized();
    if (!trackId) return null;
    var b = State.state.progress.trackXP[trackId];
    if (!b) {
      b = { xp: 0, lessonsCompleted: 0, questionsAttempted: 0, questionsCorrect: 0 };
      State.state.progress.trackXP[trackId] = b;
    } else {
      if (typeof b.xp !== "number") b.xp = +b.xp || 0;
      if (typeof b.lessonsCompleted !== "number") b.lessonsCompleted = +b.lessonsCompleted || 0;
      if (typeof b.questionsAttempted !== "number") b.questionsAttempted = +b.questionsAttempted || 0;
      if (typeof b.questionsCorrect !== "number") b.questionsCorrect = +b.questionsCorrect || 0;
    }
    return b;
  },

  awardXP: function(amount, opts) {
    if (!amount) return;
    State.ensureTracksInitialized();
    var trackId = opts && opts.trackId;
    State.state.progress.totalXP += amount;
    if (trackId) {
      var b = State.ensureTrackBucket(trackId);
      if (b) b.xp += amount;
    }
    var profile = State.getActiveProfile();
    if (profile) {
      if (typeof profile.xp !== "number") profile.xp = 0;
      profile.xp += amount;
      var lvl = Math.floor(profile.xp / State.XP_PER_LEVEL) + 1;
      profile.level = lvl;
    }
    State.save();
  },

  recordQuestionAttempt: function(trackId, correct) {
    if (!trackId) return;
    var b = State.ensureTrackBucket(trackId);
    if (!b) return;
    b.questionsAttempted += 1;
    if (correct) b.questionsCorrect += 1;
    State.save();
  },

  // Daily Quest streak container helpers
  ensureDailyQuestProfileDefaults: function(profileId) {
    State.ensureTracksInitialized();
    var map = State.state.progress.bestScores.dailyQuestByProfile;
    var obj = map[profileId];
    if (!obj || typeof obj !== "object") obj = {};
    // Minimal migration: if legacy per-day keys exist, reset to {} to avoid collisions
    var k;
    var hasLegacy = false;
    for (k in obj) {
      if (obj.hasOwnProperty(k) && typeof k === "string" && k.indexOf("quest_") === 0) {
        hasLegacy = true; break;
      }
    }
    if (hasLegacy) obj = {};

    if (typeof obj.streakCount !== "number") obj.streakCount = 0;
    if (typeof obj.lastCompletedDateKey !== "string") obj.lastCompletedDateKey = null;
    if (typeof obj.lastStreakMilestoneGranted !== "number") obj.lastStreakMilestoneGranted = 0;
    if (typeof obj.lastQuestCompletionAwardedDateKey !== "string") obj.lastQuestCompletionAwardedDateKey = null;
    map[profileId] = obj;
    return obj;
  },

  getDailyQuestProfileContainer: function() {
    var p = State.getActiveProfile();
    if (!p) return null;
    return State.ensureDailyQuestProfileDefaults(p.id);
  },

  getNextStreakMilestone: function(streakCount) {
    var arr = State.STREAK_MILESTONES;
    for (var i = 0; i < arr.length; i++) if (streakCount < arr[i]) return arr[i];
    return null;
  },

  markDailyQuestCompleted: function(dateKey) {
    State.ensureTracksInitialized();
    var cont = State.getDailyQuestProfileContainer();
    if (!cont) return { awardedDaily: false, awardedMilestone: 0, newStreak: 0 };

    // Idempotent daily completion award
    if (cont.lastQuestCompletionAwardedDateKey === dateKey) {
      return { awardedDaily: false, awardedMilestone: 0, newStreak: cont.streakCount || 0 };
    }

    // Streak logic: increment if yesterday, else reset to 1 for a new streak
    var prev = cont.lastCompletedDateKey;
    var y = new Date(dateKey + "T00:00:00");
    var prevPlusOne = null;
    if (prev) {
      var p = new Date(prev + "T00:00:00");
      p.setDate(p.getDate() + 1);
      prevPlusOne = toISODateLocal(p);
    }
    if (prev && prevPlusOne === dateKey) {
      cont.streakCount = (cont.streakCount || 0) + 1;
    } else if (prev === dateKey) {
      // same day: keep
      cont.streakCount = cont.streakCount || 1;
    } else {
      cont.streakCount = 1;
    }
    cont.lastCompletedDateKey = dateKey;

    // Daily completion XP (+25 once per day)
    State.awardXP(State.XP_DAILY_QUEST_COMPLETE, { reason: "daily_quest_complete" });
    cont.lastQuestCompletionAwardedDateKey = dateKey;

    // Milestone award
    var sc = cont.streakCount;
    var awardedMilestone = 0;
    if (sc > (cont.lastStreakMilestoneGranted || 0)) {
      // Check if sc is one of the milestones
      if (State.STREAK_MILESTONE_XP.hasOwnProperty(sc)) {
        var bonus = State.STREAK_MILESTONE_XP[sc] || 0;
        if (bonus) {
          State.awardXP(bonus, { reason: "daily_quest_streak_" + sc });
          cont.lastStreakMilestoneGranted = sc;
          awardedMilestone = sc;
        }
      }
    }

    State.save();
    return { awardedDaily: true, awardedMilestone: awardedMilestone, newStreak: sc };
  }
};

// Load state on startup
State.load();
State.ensureTracksInitialized();
