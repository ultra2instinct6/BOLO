// =====================================
// State Management
// =====================================

var State = {
  // Leveling/progress removed: keep neutral constants for compatibility
  XP_PER_CORRECT: 0,
  MAX_LEVEL: 1,
  FREEZE_XP_AT_CAP: false,
  VERSION: 2,
  STORAGE_KEY: "boloAppState_v2",
  _recoveryNeeded: false,
  _defaultState: {
    version: 1,
    profile: {
      activeProfileId: "p1",
      profiles: [
        { id: "p1", name: "Player 1" }
      ]
    },
    settings: {
      punjabiOn: true,
      onboardingHintDismissed: false
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
    }
  },
  state: null,

  _freshState: function() {
    return JSON.parse(JSON.stringify(State._defaultState));
  },

  _isFiniteNumber: function(value) {
    return typeof value === "number" && isFinite(value);
  },

  _cloneJsonSafe: function(obj, fallback) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return (typeof fallback === "undefined") ? null : fallback;
    }
  },

  _runReadingDatasetResetMigration: function() {
    if (!State.state || typeof State.state !== "object") return false;
    if (!State.state.progress || typeof State.state.progress !== "object") State.state.progress = {};
    if (!State.state.settings || typeof State.state.settings !== "object") State.state.settings = {};
    if (!State.state.session || typeof State.state.session !== "object") State.state.session = {};

    var marker = "_readingDatasetReset_20260219";
    if (State.state.progress[marker] === true) return false;

    var changed = false;

    if (!State.state.progress.byProfile || typeof State.state.progress.byProfile !== "object") {
      State.state.progress.byProfile = {};
    }

    if (State.state.progress.readingDone && typeof State.state.progress.readingDone === "object" && Object.keys(State.state.progress.readingDone).length) {
      changed = true;
    }
    State.state.progress.readingDone = {};

    if (State.state.progress.readingByProfile && typeof State.state.progress.readingByProfile === "object" && Object.keys(State.state.progress.readingByProfile).length) {
      changed = true;
    }
    State.state.progress.readingByProfile = {};

    if (State.state.progress.readingQuestionStatsByProfile && typeof State.state.progress.readingQuestionStatsByProfile === "object" && Object.keys(State.state.progress.readingQuestionStatsByProfile).length) {
      changed = true;
    }
    State.state.progress.readingQuestionStatsByProfile = {};

    for (var pid in State.state.progress.byProfile) {
      if (!Object.prototype.hasOwnProperty.call(State.state.progress.byProfile, pid)) continue;
      var cont = State.state.progress.byProfile[pid];
      if (!cont || typeof cont !== "object") continue;
      if (cont.readingDone && typeof cont.readingDone === "object" && Object.keys(cont.readingDone).length) {
        changed = true;
      }
      cont.readingDone = {};
    }

    if (State.state.session.currentReadingId != null) changed = true;
    State.state.session.currentReadingId = null;

    if (State.state.settings.readingDeckUi && typeof State.state.settings.readingDeckUi === "object") {
      var ui = State.state.settings.readingDeckUi;
      if ((ui.bundleIndex | 0) !== 0 || (ui.storyIndex | 0) !== 0 || String(ui.detailStep || "read") !== "read") changed = true;
    }
    State.state.settings.readingDeckUi = { bundleIndex: 0, storyIndex: 0, detailStep: "read" };

    if (State.state.settings.readingDeckUiByProfile && typeof State.state.settings.readingDeckUiByProfile === "object" && Object.keys(State.state.settings.readingDeckUiByProfile).length) {
      changed = true;
    }
    State.state.settings.readingDeckUiByProfile = {};

    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k) keys.push(k);
      }
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        if (key.indexOf("boloReadBookStorySelection_") === 0 || key.indexOf("readDeckHintSeen_") === 0) {
          localStorage.removeItem(key);
          changed = true;
        }
      }
    } catch (e0) {}

    State.state.progress[marker] = true;
    return changed;
  },

  ensureProfileProgressContainer: function(profileId) {
    if (!State.state) State.state = State._freshState();
    if (!State.state.progress || typeof State.state.progress !== "object") State.state.progress = {};

    var pid = profileId ? String(profileId) : "p1";
    var progress = State.state.progress;
    if (!progress.byProfile || typeof progress.byProfile !== "object") progress.byProfile = {};

    var cont = progress.byProfile[pid];
    if (!cont || typeof cont !== "object") {
      cont = {
        totalXP: 0,
        trackXP: {},
        lessonDone: {},
        lessonProgress: {},
        readingDone: {},
        bestScores: { game1: 0, game2: 0, game3: 0, game4: 0 }
      };
      progress.byProfile[pid] = cont;
    }

    if (typeof cont.totalXP !== "number" || !isFinite(cont.totalXP)) cont.totalXP = +cont.totalXP || 0;
    if (cont.totalXP < 0) cont.totalXP = 0;
    if (!cont.trackXP || typeof cont.trackXP !== "object") cont.trackXP = {};
    if (!cont.lessonDone || typeof cont.lessonDone !== "object") cont.lessonDone = {};
    if (!cont.lessonProgress || typeof cont.lessonProgress !== "object") cont.lessonProgress = {};
    if (!cont.readingDone || typeof cont.readingDone !== "object") cont.readingDone = {};
    if (!cont.bestScores || typeof cont.bestScores !== "object") cont.bestScores = {};
    if (typeof cont.bestScores.game1 !== "number") cont.bestScores.game1 = 0;
    if (typeof cont.bestScores.game2 !== "number") cont.bestScores.game2 = 0;
    if (typeof cont.bestScores.game3 !== "number") cont.bestScores.game3 = 0;
    if (typeof cont.bestScores.game4 !== "number") cont.bestScores.game4 = 0;

    return cont;
  },

  _bindActiveProfileProgress: function() {
    if (!State.state || !State.state.progress || typeof State.state.progress !== "object") return;

    var profile = State.getActiveProfile();
    var pid = (profile && profile.id) ? String(profile.id) : "p1";
    var cont = State.ensureProfileProgressContainer(pid);
    var progress = State.state.progress;

    progress.trackXP = cont.trackXP;
    progress.lessonDone = cont.lessonDone;
    progress.lessonProgress = cont.lessonProgress;
    progress.readingDone = cont.readingDone;
    progress.bestScores = cont.bestScores;
    progress.totalXP = cont.totalXP;
  },

  _remapProfileKeysInObject: function(obj, idMap, allowedIds) {
    if (!obj || typeof obj !== "object") return;
    if (!idMap || typeof idMap !== "object") idMap = {};

    for (var oldId in idMap) {
      if (!idMap.hasOwnProperty(oldId)) continue;
      var nextId = idMap[oldId];
      if (!nextId || oldId === nextId) continue;
      if (Object.prototype.hasOwnProperty.call(obj, oldId)) {
        if (!Object.prototype.hasOwnProperty.call(obj, nextId)) {
          obj[nextId] = obj[oldId];
        }
        delete obj[oldId];
      }
    }

    if (!allowedIds || !allowedIds.length) return;
    var allow = {};
    for (var i = 0; i < allowedIds.length; i++) allow[allowedIds[i]] = true;
    for (var key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      if (!allow[key]) delete obj[key];
    }
  },

  _normalizeProfileSlots: function() {
    if (!State.state || typeof State.state !== "object") State.state = State._freshState();
    if (!State.state.profile || typeof State.state.profile !== "object") State.state.profile = { activeProfileId: "p1", profiles: [] };
    if (!Array.isArray(State.state.profile.profiles)) State.state.profile.profiles = [];

    var raw = State.state.profile.profiles;
    var bySlot = { p1: null, p2: null, p3: null };
    var extras = [];
    var idMap = {};

    for (var i = 0; i < raw.length; i++) {
      var p = raw[i];
      if (!p || typeof p !== "object") continue;
      var oldId = (typeof p.id === "string") ? p.id : "";
      var valid = (oldId === "p1" || oldId === "p2" || oldId === "p3");
      if (valid && !bySlot[oldId]) {
        bySlot[oldId] = p;
      } else {
        extras.push(p);
      }
    }

    var slots = ["p1", "p2", "p3"];
    for (var s = 0; s < slots.length; s++) {
      var slotId = slots[s];
      if (bySlot[slotId]) continue;
      if (extras.length === 0) continue;
      var ex = extras.shift();
      var prevId = (ex && typeof ex.id === "string") ? ex.id : null;
      ex.id = slotId;
      bySlot[slotId] = ex;
      if (prevId && prevId !== slotId) idMap[prevId] = slotId;
    }

    if (!bySlot.p1) {
      bySlot.p1 = { id: "p1", name: "Player 1" };
    }

    var normalized = [];
    for (var n = 0; n < slots.length; n++) {
      if (bySlot[slots[n]]) normalized.push(bySlot[slots[n]]);
    }
    State.state.profile.profiles = normalized;

    var active = State.state.profile.activeProfileId;
    if (idMap[active]) active = idMap[active];
    var hasActive = false;
    for (var j = 0; j < normalized.length; j++) {
      if (normalized[j] && normalized[j].id === active) {
        hasActive = true;
        break;
      }
    }
    if (!hasActive) active = normalized[0] ? normalized[0].id : "p1";
    State.state.profile.activeProfileId = active;

    var allowed = [];
    for (var a = 0; a < normalized.length; a++) {
      if (normalized[a] && normalized[a].id) allowed.push(normalized[a].id);
    }

    if (State.state.progress && typeof State.state.progress === "object") {
      State._remapProfileKeysInObject(State.state.progress.byProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.lastSeenXPByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.readingByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.readingQuestionStatsByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.gamesMissedByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.typingWeaknessByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.progress.typingXpByProfile, idMap, allowed);
    }

    if (State.state.settings && typeof State.state.settings === "object") {
      State._remapProfileKeysInObject(State.state.settings.playDifficultyByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.settings.readingVocabByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.settings.readingVocabCollapsedByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.settings.readingUiByProfile, idMap, allowed);
      State._remapProfileKeysInObject(State.state.settings.typingDeckUiByProfile, idMap, allowed);
    }

    if (State.state.session && typeof State.state.session === "object") {
      State._remapProfileKeysInObject(State.state.session.lessonProgressByProfile, idMap, allowed);
    }
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
    function doResetAndReload() {
      try {
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
    }

    if (confirmMsg && typeof UI !== "undefined" && UI && typeof UI.showConfirmDialog === "function") {
      try {
        UI.showConfirmDialog(confirmMsg, {
          title: "Reset state",
          confirmText: "Reset",
          cancelText: "Cancel",
          allowCancel: true
        }).then(function(ok) {
          if (!ok) return;
          doResetAndReload();
        });
      } catch (e0) {
        console.warn("Failed to reset state:", e0);
      }
      return false;
    }

    try {
      if (confirmMsg) {
        var ok = window.confirm(confirmMsg);
        if (!ok) return false;
      }
    } catch (e) {
      console.warn("Failed to reset state:", e);
    }
    return doResetAndReload();
  },

  // Ensure defaults and track buckets exist (safe if TRACKS is missing)
  ensureTracksInitialized: function() {
    State._normalizeProfileSlots();

    var keyIndex;
    var keysToRemove = [
      "bolo_mc_round_len_v1",
      "mc_daily_done_date",
      "mc_badge_stats_v1",
      "mc_badges_unlocked_v1",
      "bolo_tables_prefs_v1_2",
      "bolo_facts_firstRun_v1_7",
      "bolo_facts_stats_v1_7",
      "bolo_mc_frac_level_v1"
    ];

    try {
      for (keyIndex = 0; keyIndex < keysToRemove.length; keyIndex++) {
        localStorage.removeItem(keysToRemove[keyIndex]);
      }
    } catch (e) {}

    // Ensure settings container exists
    if (!State.state.settings || typeof State.state.settings !== "object") State.state.settings = {};
    State.state.settings.punjabiOn = true;

    // One-time onboarding hint (default shown)
    if (typeof State.state.settings.onboardingHintDismissed !== "boolean") State.state.settings.onboardingHintDismissed = false;

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

    // Reading view mode (Kid/Full), persisted per profile
    if (!State.state.settings.readingViewModeByProfile || typeof State.state.settings.readingViewModeByProfile !== "object") {
      State.state.settings.readingViewModeByProfile = {};
    }
    if (typeof State.state.settings.readingViewMode !== "string") {
      State.state.settings.readingViewMode = "kid";
    }
    if (State.state.settings.readingViewMode !== "kid" && State.state.settings.readingViewMode !== "full") {
      State.state.settings.readingViewMode = "kid";
    }

    // Reading deck UI state (bundle/story/detail step), persisted per profile
    if (!State.state.settings.readingDeckUiByProfile || typeof State.state.settings.readingDeckUiByProfile !== "object") {
      State.state.settings.readingDeckUiByProfile = {};
    }
    if (!State.state.settings.readingDeckUi || typeof State.state.settings.readingDeckUi !== "object") {
      State.state.settings.readingDeckUi = { bundleIndex: 0, storyIndex: 0, detailStep: "read" };
    }

    // Typing deck UI state (selected mode), persisted per profile
    if (!State.state.settings.typingDeckUiByProfile || typeof State.state.settings.typingDeckUiByProfile !== "object") {
      State.state.settings.typingDeckUiByProfile = {};
    }
    if (!State.state.settings.typingDeckUi || typeof State.state.settings.typingDeckUi !== "object") {
      State.state.settings.typingDeckUi = { selectedMode: "practice" };
    }

    // Ensure progress containers exist
    if (!State.state.progress) State.state.progress = {};
    if (!State.state.progress.byProfile || typeof State.state.progress.byProfile !== "object") State.state.progress.byProfile = {};

    // One-time migration: move legacy shared core-progress buckets into active profile container.
    if (State.state.progress._coreByProfileMigrated !== true) {
      var profileForMigration = State.getActiveProfile();
      var migrationPid = (profileForMigration && profileForMigration.id) ? String(profileForMigration.id) : "p1";
      var hasLegacyCore = false;

      if (State.state.progress.trackXP && typeof State.state.progress.trackXP === "object" && Object.keys(State.state.progress.trackXP).length) hasLegacyCore = true;
      if (State.state.progress.lessonDone && typeof State.state.progress.lessonDone === "object" && Object.keys(State.state.progress.lessonDone).length) hasLegacyCore = true;
      if (State.state.progress.lessonProgress && typeof State.state.progress.lessonProgress === "object" && Object.keys(State.state.progress.lessonProgress).length) hasLegacyCore = true;
      if (State.state.progress.readingDone && typeof State.state.progress.readingDone === "object" && Object.keys(State.state.progress.readingDone).length) hasLegacyCore = true;
      if (State.state.progress.bestScores && typeof State.state.progress.bestScores === "object" && Object.keys(State.state.progress.bestScores).length) hasLegacyCore = true;
      if (typeof State.state.progress.totalXP === "number" && isFinite(State.state.progress.totalXP) && State.state.progress.totalXP > 0) hasLegacyCore = true;

      if (hasLegacyCore && !State.state.progress.byProfile[migrationPid]) {
        State.state.progress.byProfile[migrationPid] = {
          totalXP: (typeof State.state.progress.totalXP === "number" && isFinite(State.state.progress.totalXP)) ? State.state.progress.totalXP : 0,
          trackXP: State._cloneJsonSafe(State.state.progress.trackXP || {}, {}),
          lessonDone: State._cloneJsonSafe(State.state.progress.lessonDone || {}, {}),
          lessonProgress: State._cloneJsonSafe(State.state.progress.lessonProgress || {}, {}),
          readingDone: State._cloneJsonSafe(State.state.progress.readingDone || {}, {}),
          bestScores: State._cloneJsonSafe(State.state.progress.bestScores || {}, {})
        };
      }
      State.state.progress._coreByProfileMigrated = true;
    }

    // Footer/UI helpers (additive): track XP last seen on Progress screen per profile
    if (!State.state.progress.lastSeenXPByProfile || typeof State.state.progress.lastSeenXPByProfile !== "object") {
      State.state.progress.lastSeenXPByProfile = {};
    }
    if (!State.state.progress.trackXP || typeof State.state.progress.trackXP !== "object") State.state.progress.trackXP = {};
    if (!State.state.progress.bestScores || typeof State.state.progress.bestScores !== "object") State.state.progress.bestScores = {};
    if (!State.state.progress.lessonProgress || typeof State.state.progress.lessonProgress !== "object") State.state.progress.lessonProgress = {};

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

    // Typing: weakness tracking (per profile)
    // Stores recent miss counts for characters and bigrams; used for Typing Center drills.
    if (!State.state.progress.typingWeaknessByProfile || typeof State.state.progress.typingWeaknessByProfile !== "object") {
      State.state.progress.typingWeaknessByProfile = {};
    }

    // Typing: XP practice credit (per profile)
    // Used to safely award small, capped XP from typing drills without double-awards.
    if (!State.state.progress.typingXpByProfile || typeof State.state.progress.typingXpByProfile !== "object") {
      State.state.progress.typingXpByProfile = {};
    }

    // Bind legacy core-progress pointers to active profile container.
    State._bindActiveProfileProgress();

    // One-time reset after reading dataset replacement (5 books x 10 stories).
    // Clears stale reading completion/question stats and selector UI state from previous dataset.
    var readingResetChanged = State._runReadingDatasetResetMigration();
    if (readingResetChanged) State._bindActiveProfileProgress();

    // Game best scores defaults (non-breaking)
    if (typeof State.state.progress.bestScores.game1 !== "number") State.state.progress.bestScores.game1 = 0;
    if (typeof State.state.progress.bestScores.game2 !== "number") State.state.progress.bestScores.game2 = 0;
    if (typeof State.state.progress.bestScores.game3 !== "number") State.state.progress.bestScores.game3 = 0;
    if (typeof State.state.progress.bestScores.game4 !== "number") State.state.progress.bestScores.game4 = 0;

    // Ensure session container exists (older saves safety)
    if (!State.state.session || typeof State.state.session !== "object") {
      State.state.session = {
        screenId: "screen-home",
        currentLessonId: null,
        currentLessonStep: 0,
        currentReadingId: null,
        currentGameId: null,
        gameSession: null,
        lessonProgressByProfile: {},
        lessonProgress: {}
      };
    } else {
      if (typeof State.state.session.screenId !== "string") State.state.session.screenId = "screen-home";
      if (typeof State.state.session.currentLessonId === "undefined") State.state.session.currentLessonId = null;
      if (typeof State.state.session.currentLessonStep !== "number") State.state.session.currentLessonStep = 0;
      if (typeof State.state.session.currentReadingId === "undefined") State.state.session.currentReadingId = null;
      if (typeof State.state.session.currentGameId === "undefined") State.state.session.currentGameId = null;
      if (typeof State.state.session.gameSession === "undefined") State.state.session.gameSession = null;
      if (!State.state.session.lessonProgressByProfile || typeof State.state.session.lessonProgressByProfile !== "object") State.state.session.lessonProgressByProfile = {};
      if (!State.state.session.lessonProgress || typeof State.state.session.lessonProgress !== "object") State.state.session.lessonProgress = {};
    }

    // Migrate legacy shared lesson runtime progress into active profile once.
    if (State.state.session._lessonProgressByProfileMigrated !== true) {
      var activePidForLesson = State.state.profile.activeProfileId || "p1";
      var legacyLesson = State.state.session.lessonProgress;
      var hasLegacyLesson = false;
      if (legacyLesson && typeof legacyLesson === "object") {
        for (var lk in legacyLesson) {
          if (Object.prototype.hasOwnProperty.call(legacyLesson, lk)) {
            hasLegacyLesson = true;
            break;
          }
        }
      }
      if (hasLegacyLesson && !State.state.session.lessonProgressByProfile[activePidForLesson]) {
        State.state.session.lessonProgressByProfile[activePidForLesson] = State._cloneJsonSafe(legacyLesson, {});
      }
      State.state.session._lessonProgressByProfileMigrated = true;
    }

    // Bind lesson runtime progress to active profile container.
    var activePid = State.state.profile.activeProfileId || "p1";
    if (!State.state.session.lessonProgressByProfile[activePid] || typeof State.state.session.lessonProgressByProfile[activePid] !== "object") {
      State.state.session.lessonProgressByProfile[activePid] = {};
    }
    State.state.session.lessonProgress = State.state.session.lessonProgressByProfile[activePid];

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
    if (State.state && State.state.settings) State.state.settings.punjabiOn = true;
    return true;
  },

  setPunjabiEnabled: function(isOn) {
    State.ensureTracksInitialized();
    State.state.settings.punjabiOn = true;
    State.save();
    return true;
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

  // ===== Typing weakness tracking (per profile) =====

  _TYPING_WEAKNESS_WEEK_MS: 7 * 24 * 60 * 60 * 1000,
  _TYPING_WEAKNESS_WEEKLY_DECAY: 0.90,
  _TYPING_WEAKNESS_MAX_CHARS: 80,
  _TYPING_WEAKNESS_MAX_BIGRAMS: 180,

  _clampNonNegInt: function(n) {
    if (typeof n !== "number" || !isFinite(n)) return 0;
    n = n | 0;
    if (n < 0) return 0;
    return n;
  },

  _pruneCountMap: function(map, maxItems) {
    if (!map || typeof map !== "object") return;
    maxItems = (typeof maxItems === "number" && isFinite(maxItems)) ? (maxItems | 0) : 0;
    if (maxItems <= 0) return;

    var keys = [];
    for (var k in map) {
      if (!map.hasOwnProperty(k)) continue;
      var v = map[k];
      if (typeof v !== "number" || !isFinite(v) || v <= 0) {
        try { delete map[k]; } catch (e0) {}
        continue;
      }
      keys.push(k);
    }

    if (keys.length <= maxItems) return;

    keys.sort(function(a, b) {
      return (map[b] || 0) - (map[a] || 0);
    });

    for (var i = maxItems; i < keys.length; i++) {
      try { delete map[keys[i]]; } catch (e1) {}
    }
  },

  _applyTypingWeeklyDecay: function(container, nowMs) {
    if (!container || typeof container !== "object") return false;
    if (typeof nowMs !== "number" || !isFinite(nowMs)) nowMs = Date.now();

    var last = (typeof container.lastDecayAt === "number" && isFinite(container.lastDecayAt)) ? container.lastDecayAt : 0;
    if (!(last > 0)) {
      container.lastDecayAt = nowMs;
      return true;
    }

    var dt = nowMs - last;
    if (dt < State._TYPING_WEAKNESS_WEEK_MS) return false;

    var weeks = Math.floor(dt / State._TYPING_WEAKNESS_WEEK_MS);
    if (weeks <= 0) return false;
    if (weeks > 52) weeks = 52;

    var factor = Math.pow(State._TYPING_WEAKNESS_WEEKLY_DECAY, weeks);
    var changed = false;

    function decayMap(m) {
      if (!m || typeof m !== "object") return;
      for (var k in m) {
        if (!m.hasOwnProperty(k)) continue;
        var v = m[k];
        if (typeof v !== "number" || !isFinite(v)) {
          try { delete m[k]; } catch (e0) {}
          changed = true;
          continue;
        }
        var next = Math.floor(v * factor);
        if (next <= 0) {
          try { delete m[k]; } catch (e1) {}
          changed = true;
        } else if (next !== v) {
          m[k] = next;
          changed = true;
        }
      }
    }

    decayMap(container.chars);
    decayMap(container.bigrams);

    container.lastDecayAt = nowMs;
    return true;
  },

  ensureTypingWeaknessProfileDefaults: function(profileId) {
    State.ensureTracksInitialized();
    if (!profileId) return null;
    var map = State.state.progress.typingWeaknessByProfile;
    if (!map || typeof map !== "object") {
      State.state.progress.typingWeaknessByProfile = {};
      map = State.state.progress.typingWeaknessByProfile;
    }

    var obj = map[profileId];
    if (!obj || typeof obj !== "object") obj = {};
    if (!obj.chars || typeof obj.chars !== "object") obj.chars = {};
    if (!obj.bigrams || typeof obj.bigrams !== "object") obj.bigrams = {};
    if (typeof obj.lastDecayAt !== "number" || !isFinite(obj.lastDecayAt)) obj.lastDecayAt = 0;
    map[profileId] = obj;
    return obj;
  },

  getTypingWeaknessStats: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (!p) return { chars: {}, bigrams: {}, lastDecayAt: 0 };

    var cont = State.ensureTypingWeaknessProfileDefaults(p.id);
    if (!cont) return { chars: {}, bigrams: {}, lastDecayAt: 0 };

    var now = Date.now();
    var decayed = false;
    try { decayed = State._applyTypingWeeklyDecay(cont, now); } catch (e0) { decayed = false; }
    try {
      State._pruneCountMap(cont.chars, State._TYPING_WEAKNESS_MAX_CHARS);
      State._pruneCountMap(cont.bigrams, State._TYPING_WEAKNESS_MAX_BIGRAMS);
    } catch (e1) {}
    if (decayed) State.save();

    // Return copies to avoid accidental external mutation
    var outChars = {};
    var outBigrams = {};
    var k;
    for (k in cont.chars) if (cont.chars.hasOwnProperty(k)) outChars[k] = cont.chars[k];
    for (k in cont.bigrams) if (cont.bigrams.hasOwnProperty(k)) outBigrams[k] = cont.bigrams[k];
    return { chars: outChars, bigrams: outBigrams, lastDecayAt: cont.lastDecayAt || 0 };
  },

  recordTypingWeakness: function(missCounts, bigramCounts, opts) {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (!p) return;

    var cont = State.ensureTypingWeaknessProfileDefaults(p.id);
    if (!cont) return;

    var now = Date.now();
    var dirty = false;
    try { if (State._applyTypingWeeklyDecay(cont, now)) dirty = true; } catch (e0) {}

    function addCounts(targetMap, sourceMap) {
      if (!sourceMap || typeof sourceMap !== "object") return;
      for (var k in sourceMap) {
        if (!sourceMap.hasOwnProperty(k)) continue;
        var n = sourceMap[k];
        if (typeof n !== "number" || !isFinite(n)) continue;
        n = State._clampNonNegInt(n);
        if (!n) continue;
        var key = String(k);
        if (!key) continue;
        targetMap[key] = (targetMap[key] || 0) + n;
        dirty = true;
      }
    }

    addCounts(cont.chars, missCounts);
    addCounts(cont.bigrams, bigramCounts);

    try {
      State._pruneCountMap(cont.chars, State._TYPING_WEAKNESS_MAX_CHARS);
      State._pruneCountMap(cont.bigrams, State._TYPING_WEAKNESS_MAX_BIGRAMS);
    } catch (e1) {}

    if (dirty) State.save();
  },

  // ===== Typing XP credit (per profile) =====

  _TYPING_XP_DAILY_CAP: 10,
  _TYPING_XP_KEEP_DAYS: 14,

  _dayKeyLocal: function(nowMs) {
    var d = (typeof nowMs === "number" && isFinite(nowMs)) ? new Date(nowMs) : new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var dd = d.getDate();
    function pad2(n) { return (n < 10 ? ("0" + n) : String(n)); }
    return String(y) + "-" + pad2(m) + "-" + pad2(dd);
  },

  ensureTypingXpProfileDefaults: function(profileId) {
    State.ensureTracksInitialized();
    if (!profileId) return null;
    var map = State.state.progress.typingXpByProfile;
    if (!map || typeof map !== "object") {
      State.state.progress.typingXpByProfile = {};
      map = State.state.progress.typingXpByProfile;
    }

    var obj = map[profileId];
    if (!obj || typeof obj !== "object") obj = {};
    if (!obj.days || typeof obj.days !== "object") obj.days = {};
    map[profileId] = obj;
    return obj;
  },

  _pruneTypingXpDays: function(container, nowMs) {
    if (!container || typeof container !== "object" || !container.days || typeof container.days !== "object") return false;
    var keep = State._TYPING_XP_KEEP_DAYS;
    keep = (typeof keep === "number" && isFinite(keep)) ? (keep | 0) : 14;
    if (keep < 3) keep = 3;

    var dayMs = 24 * 60 * 60 * 1000;
    var cutoff = ((typeof nowMs === "number" && isFinite(nowMs)) ? nowMs : Date.now()) - (keep * dayMs);
    var changed = false;

    // Keys are ISO-ish YYYY-MM-DD; lexical compare is safe for cutoffKey.
    var cutoffKey = State._dayKeyLocal(cutoff);
    for (var k in container.days) {
      if (!container.days.hasOwnProperty(k)) continue;
      if (String(k) < cutoffKey) {
        try { delete container.days[k]; } catch (e0) {}
        changed = true;
      }
    }
    return changed;
  },

  awardTypingPracticeXp: function(amount, meta) {
    amount = (typeof amount === "number" && isFinite(amount)) ? (amount | 0) : 0;
    if (amount <= 0) return { awarded: false, reason: "invalid_amount", amount: 0, xpToday: 0, cap: State._TYPING_XP_DAILY_CAP };

    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (!p) return { awarded: false, reason: "no_profile", amount: 0, xpToday: 0, cap: State._TYPING_XP_DAILY_CAP };

    var cont = State.ensureTypingXpProfileDefaults(p.id);
    if (!cont) return { awarded: false, reason: "no_container", amount: 0, xpToday: 0, cap: State._TYPING_XP_DAILY_CAP };

    var now = Date.now();
    var dayKey = State._dayKeyLocal(now);
    if (!cont.days[dayKey] || typeof cont.days[dayKey] !== "object") cont.days[dayKey] = { xp: 0, keys: {} };
    var day = cont.days[dayKey];
    if (typeof day.xp !== "number" || !isFinite(day.xp)) day.xp = 0;
    if (!day.keys || typeof day.keys !== "object") day.keys = {};

    var cap = State._TYPING_XP_DAILY_CAP;
    cap = (typeof cap === "number" && isFinite(cap)) ? (cap | 0) : 10;
    if (cap < 1) cap = 1;

    var key = "";
    try {
      if (meta && meta.key != null) key = String(meta.key);
    } catch (eKey) {
      key = "";
    }
    if (!key) {
      // Still allow awarding, but cannot be idempotent.
      key = "typing:" + dayKey + ":" + String(Math.random()).slice(2);
    }

    if (day.keys[key] === true) {
      return { awarded: false, reason: "duplicate", amount: 0, xpToday: day.xp, cap: cap };
    }
    if ((day.xp | 0) >= cap) {
      return { awarded: false, reason: "cap", amount: 0, xpToday: day.xp, cap: cap };
    }

    var awardAmt = Math.min(amount, Math.max(0, cap - (day.xp | 0)));
    if (awardAmt <= 0) {
      return { awarded: false, reason: "cap", amount: 0, xpToday: day.xp, cap: cap };
    }

    // Mark before awarding; awardXP saves state.
    day.keys[key] = true;
    day.xp = (day.xp | 0) + awardAmt;
    cont.days[dayKey] = day;

    // Keep the container bounded.
    var pruned = false;
    try { pruned = State._pruneTypingXpDays(cont, now); } catch (ePrune) { pruned = false; }
    if (pruned) State.state.progress.typingXpByProfile[p.id] = cont;

    // Award into the global/profile XP system.
    State.awardXP(awardAmt, { reason: (meta && meta.reason) ? meta.reason : "typing_practice" }, { section: "practice", reason: (meta && meta.reason) ? meta.reason : "typing_practice" });

    return { awarded: true, reason: "ok", amount: awardAmt, xpToday: day.xp, cap: cap };
  },

  getTypingPracticeXpSummary: function(nowMs) {
    State.ensureTracksInitialized();
    var cap = State._TYPING_XP_DAILY_CAP;
    cap = (typeof cap === "number" && isFinite(cap)) ? (cap | 0) : 10;
    if (cap < 1) cap = 1;

    var p = null;
    try { p = State.getActiveProfile(); } catch (e0) { p = null; }
    if (!p || !p.id) return { xpToday: 0, cap: cap };

    var cont = State.ensureTypingXpProfileDefaults(p.id);
    if (!cont || !cont.days || typeof cont.days !== "object") return { xpToday: 0, cap: cap };

    var now = (typeof nowMs === "number" && isFinite(nowMs)) ? nowMs : Date.now();
    var dayKey = State._dayKeyLocal(now);
    var day = cont.days[dayKey];

    var xpToday = 0;
    if (day && typeof day === "object") {
      var x = day.xp;
      if (typeof x === "number" && isFinite(x)) xpToday = (x | 0);
    }
    if (!(xpToday > 0)) xpToday = 0;

    var pruned = false;
    try { pruned = State._pruneTypingXpDays(cont, now); } catch (e1) { pruned = false; }
    if (pruned) State.save();

    return { xpToday: xpToday, cap: cap };
  },

  // ===== Profile-scoped localStorage helpers =====

  _getActiveProfileIdSafe: function() {
    try {
      var p = State.getActiveProfile();
      if (p && p.id) return String(p.id);
    } catch (e0) {}
    try {
      if (State.state && State.state.profile && State.state.profile.activeProfileId) {
        return String(State.state.profile.activeProfileId);
      }
    } catch (e1) {}
    return "p1";
  },

  _getProfileScopedStorageKey: function(baseKey, profileId) {
    var base = String(baseKey || "").replace(/^\s+|\s+$/g, "");
    if (!base) return "";
    var pid = (profileId != null) ? String(profileId) : State._getActiveProfileIdSafe();
    pid = pid.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!pid) pid = "p1";
    return base + "_" + pid;
  },

  // ===== Typing Center: Type & Define (per-profile, localStorage) =====

  _typeDefineProfileIdSafe: function() {
    return State._getActiveProfileIdSafe();
  },

  _normalizeTypeDefineSettings: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    return {
      v: 1,
      stopOnError: (obj.stopOnError === true)
    };
  },

  getTypeDefineSettings: function() {
    var pid = State._typeDefineProfileIdSafe();
    var key = "bolo_typedefine_settings_v1_" + pid;
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return State._normalizeTypeDefineSettings({});
      var parsed = JSON.parse(raw);
      return State._normalizeTypeDefineSettings(parsed);
    } catch (e0) {
      return State._normalizeTypeDefineSettings({});
    }
  },

  saveTypeDefineSettings: function(obj) {
    var pid = State._typeDefineProfileIdSafe();
    var key = "bolo_typedefine_settings_v1_" + pid;
    var next = State._normalizeTypeDefineSettings(obj);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e0) {}
    return next;
  },

  _normalizeTypeDefineStats: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    var out = { v: 1, wordStats: {} };
    var ws = obj.wordStats;
    if (ws && typeof ws === "object") {
      for (var k in ws) {
        if (!ws.hasOwnProperty(k)) continue;
        var id = String(k);
        if (!id) continue;
        var s = ws[k];
        if (!s || typeof s !== "object") s = {};

        function nn(v) {
          v = (typeof v === "number" && isFinite(v)) ? (v | 0) : (parseInt(v, 10) | 0);
          if (!(v > 0)) v = 0;
          return v;
        }

        var last = 0;
        if (typeof s.lastSeenAt === "number" && isFinite(s.lastSeenAt)) last = s.lastSeenAt;

        out.wordStats[id] = {
          seen: nn(s.seen),
          typeMiss: nn(s.typeMiss),
          meaningMiss: nn(s.meaningMiss),
          lastSeenAt: last
        };
      }
    }
    return out;
  },

  _normalizeTypeDefineStatsV2: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    var out = { v: 2, wordStats: {} };
    var ws = obj.wordStats;
    if (ws && typeof ws === "object") {
      for (var k in ws) {
        if (!ws.hasOwnProperty(k)) continue;
        var id = String(k);
        if (!id) continue;
        var s = ws[k];
        if (!s || typeof s !== "object") s = {};

        function nn(v) {
          var n = (typeof v === "number" && isFinite(v)) ? v : parseInt(v, 10);
          if (!isFinite(n) || n < 0) n = 0;
          return Math.floor(n);
        }

        function ts(v) {
          var n = (typeof v === "number" && isFinite(v)) ? v : parseInt(v, 10);
          if (!isFinite(n) || n < 0) n = 0;
          return n;
        }

        // Backward compatibility: if callers still pass meaningMiss (v1), treat it as mcqMiss.
        var mcqRaw = (s.hasOwnProperty("mcqMiss") ? s.mcqMiss : s.meaningMiss);

        out.wordStats[id] = {
          seen: nn(s.seen),
          typeMiss: nn(s.typeMiss),
          mcqMiss: nn(mcqRaw),
          defMiss: nn(s.defMiss),
          lastSeenAt: ts(s.lastSeenAt)
        };
      }
    }
    return out;
  },

  getTypeDefineStats: function() {
    var pid = State._typeDefineProfileIdSafe();
    var key2 = "bolo_typedefine_stats_v2_" + pid;
    var key1 = "bolo_typedefine_stats_v1_" + pid;
    try {
      // 1) Prefer v2 if present.
      var raw2 = localStorage.getItem(key2);
      if (raw2) {
        var parsed2 = JSON.parse(raw2);
        return State._normalizeTypeDefineStatsV2(parsed2);
      }

      // 2) Migrate v1 -> v2 once (do not delete v1).
      var raw1 = localStorage.getItem(key1);
      if (raw1) {
        var parsed1 = JSON.parse(raw1);
        var migrated = State._normalizeTypeDefineStatsV2(parsed1);
        try { State.saveTypeDefineStats(migrated); } catch (eSave) {}
        return migrated;
      }

      // 3) Fresh v2.
      return State._normalizeTypeDefineStatsV2({});
    } catch (e0) {
      return State._normalizeTypeDefineStatsV2({});
    }
  },

  saveTypeDefineStats: function(obj) {
    var pid = State._typeDefineProfileIdSafe();
    var key2 = "bolo_typedefine_stats_v2_" + pid;
    var next = State._normalizeTypeDefineStatsV2(obj);
    try {
      localStorage.setItem(key2, JSON.stringify(next));
    } catch (e0) {}
    return next;
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

  getProfiles: function() {
    if (!State.state || !State.state.profile || !Array.isArray(State.state.profile.profiles)) {
      return [];
    }
    return State.state.profile.profiles.slice();
  },

  renameProfile: function(profileId, name) {
    if (!profileId || !State.state || !State.state.profile || !Array.isArray(State.state.profile.profiles)) {
      return false;
    }

    var nextName = (typeof name === "string") ? name.replace(/^\s+|\s+$/g, "") : "";
    if (!nextName) return false;
    if (nextName.length > 24) nextName = nextName.slice(0, 24);

    var id = String(profileId);
    for (var i = 0; i < State.state.profile.profiles.length; i++) {
      var p = State.state.profile.profiles[i];
      if (p && p.id === id) {
        p.name = nextName;
        State.save();
        return true;
      }
    }
    return false;
  },

  getLevel: function(profile) {
    return 1;
  },

  getLevelInfo: function(profile) {
    return {
      level: 1,
      isMax: true,
      xp: 0,
      xpIntoLevel: 0,
      xpToNext: 0,
      pct: 0
    };
  },

  // Set active profile
  setActiveProfile: function(profileId) {
    if (!profileId || !State.state || !State.state.profile || !Array.isArray(State.state.profile.profiles)) {
      return false;
    }

    var nextId = String(profileId);
    var exists = false;
    for (var i = 0; i < State.state.profile.profiles.length; i++) {
      var p = State.state.profile.profiles[i];
      if (p && p.id === nextId) {
        exists = true;
        break;
      }
    }
    if (!exists) return false;

    State.state.profile.activeProfileId = nextId;
    State.ensureTracksInitialized();
    State.save();
    return true;
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

  // ===== Reading view mode (Kid/Full, persisted per profile) =====

  getReadingViewMode: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingViewModeByProfile) {
      var byProfile = State.state.settings.readingViewModeByProfile[p.id];
      if (byProfile === "kid" || byProfile === "full") return byProfile;
    }
    var fallback = State.state.settings.readingViewMode;
    if (fallback === "kid" || fallback === "full") return fallback;
    return "kid";
  },

  setReadingViewMode: function(mode) {
    State.ensureTracksInitialized();
    var next = (mode === "full") ? "full" : "kid";
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingViewModeByProfile) {
      State.state.settings.readingViewModeByProfile[p.id] = next;
    } else {
      State.state.settings.readingViewMode = next;
    }
    State.save();
    return next;
  },

  // ===== Reading deck UI state (persisted per profile) =====

  _normalizeReadingDeckUiState: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    var out = {
      bundleIndex: (typeof obj.bundleIndex === "number") ? (obj.bundleIndex | 0) : 0,
      storyIndex: (typeof obj.storyIndex === "number") ? (obj.storyIndex | 0) : 0,
      detailStep: (typeof obj.detailStep === "string") ? obj.detailStep : "read"
    };
    if (out.bundleIndex < 0) out.bundleIndex = 0;
    if (out.storyIndex < 0) out.storyIndex = 0;
    if (out.detailStep !== "read" && out.detailStep !== "questions" && out.detailStep !== "vocab" && out.detailStep !== "complete") {
      out.detailStep = "read";
    }
    return out;
  },

  getReadingDeckUiState: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.readingDeckUiByProfile) {
      var byProfile = State.state.settings.readingDeckUiByProfile[p.id];
      if (byProfile && typeof byProfile === "object") {
        return State._normalizeReadingDeckUiState(byProfile);
      }
    }
    return State._normalizeReadingDeckUiState(State.state.settings.readingDeckUi);
  },

  setReadingDeckUiState: function(partial) {
    State.ensureTracksInitialized();
    var cur = State.getReadingDeckUiState();
    var next = {
      bundleIndex: (partial && typeof partial.bundleIndex === "number") ? partial.bundleIndex : cur.bundleIndex,
      storyIndex: (partial && typeof partial.storyIndex === "number") ? partial.storyIndex : cur.storyIndex,
      detailStep: (partial && typeof partial.detailStep === "string") ? partial.detailStep : cur.detailStep
    };
    next = State._normalizeReadingDeckUiState(next);

    var p = State.getActiveProfile();
    if (p && State.state.settings.readingDeckUiByProfile) {
      State.state.settings.readingDeckUiByProfile[p.id] = next;
    } else {
      State.state.settings.readingDeckUi = next;
    }
    State.save();
    return next;
  },

  // ===== Typing deck UI state (persisted per profile) =====

  _normalizeTypingDeckUiState: function(obj) {
    if (!obj || typeof obj !== "object") obj = {};
    var mode = String(obj.selectedMode || "practice");
    if (mode !== "practice" && mode !== "typeDefine" && mode !== "race") mode = "practice";
    return { selectedMode: mode };
  },

  getTypingDeckUiState: function() {
    State.ensureTracksInitialized();
    var p = State.getActiveProfile();
    if (p && State.state.settings.typingDeckUiByProfile) {
      var byProfile = State.state.settings.typingDeckUiByProfile[p.id];
      if (byProfile && typeof byProfile === "object") {
        return State._normalizeTypingDeckUiState(byProfile);
      }
    }
    return State._normalizeTypingDeckUiState(State.state.settings.typingDeckUi);
  },

  setTypingDeckUiState: function(partial) {
    State.ensureTracksInitialized();
    var cur = State.getTypingDeckUiState();
    var next = {
      selectedMode: (partial && typeof partial.selectedMode === "string") ? partial.selectedMode : cur.selectedMode
    };
    next = State._normalizeTypingDeckUiState(next);

    var p = State.getActiveProfile();
    if (p && State.state.settings.typingDeckUiByProfile) {
      State.state.settings.typingDeckUiByProfile[p.id] = next;
    } else {
      State.state.settings.typingDeckUi = next;
    }
    State.save();
    return next;
  },

  // ===== Reading stars + XP guards (persisted per profile) =====

  ensureReadingProfileDefaults: function(profileId) {
    State.ensureTracksInitialized();
    var pid = profileId ? String(profileId) : State._getActiveProfileIdSafe();
    if (!pid) pid = "p1";

    if (!State.state.progress.readingByProfile || typeof State.state.progress.readingByProfile !== "object") {
      State.state.progress.readingByProfile = {};
    }

    var map = State.state.progress.readingByProfile;
    var cont = map[pid];
    if (!cont || typeof cont !== "object") cont = {};
    if (!cont.stars || typeof cont.stars !== "object") cont.stars = {};
    if (!cont.xpAwards || typeof cont.xpAwards !== "object") cont.xpAwards = {};

    for (var rid in cont.stars) {
      if (!Object.prototype.hasOwnProperty.call(cont.stars, rid)) continue;
      var sv = cont.stars[rid];
      if (typeof sv !== "number" || !isFinite(sv)) sv = parseInt(sv, 10);
      if (!isFinite(sv)) sv = 0;
      sv = sv | 0;
      if (sv < 0) sv = 0;
      if (sv > 3) sv = 3;
      cont.stars[rid] = sv;
    }

    for (var xr in cont.xpAwards) {
      if (!Object.prototype.hasOwnProperty.call(cont.xpAwards, xr)) continue;
      var awards = cont.xpAwards[xr];
      if (!awards || typeof awards !== "object") {
        cont.xpAwards[xr] = {};
        continue;
      }
      for (var ak in awards) {
        if (!Object.prototype.hasOwnProperty.call(awards, ak)) continue;
        awards[ak] = (awards[ak] === true);
      }
    }

    map[pid] = cont;
    return cont;
  },

  getReadingProfileContainer: function() {
    return State.ensureReadingProfileDefaults(State._getActiveProfileIdSafe());
  },

  getReadingStars: function(readingId) {
    var rid = (readingId == null) ? "" : String(readingId);
    if (!rid) return 0;
    var cont = State.getReadingProfileContainer();
    if (!cont || !cont.stars || typeof cont.stars !== "object") return 0;
    var v = cont.stars[rid];
    if (typeof v !== "number" || !isFinite(v)) v = parseInt(v, 10);
    if (!isFinite(v)) return 0;
    v = v | 0;
    if (v < 0) v = 0;
    if (v > 3) v = 3;
    return v;
  },

  setReadingStars: function(readingId, stars) {
    var rid = (readingId == null) ? "" : String(readingId);
    if (!rid) return 0;
    var next = (typeof stars === "number" && isFinite(stars)) ? (stars | 0) : parseInt(stars, 10);
    if (!isFinite(next)) next = 0;
    if (next < 0) next = 0;
    if (next > 3) next = 3;

    var cont = State.getReadingProfileContainer();
    var prev = State.getReadingStars(rid);
    if (!cont.stars || typeof cont.stars !== "object") cont.stars = {};
    cont.stars[rid] = next;

    // Legacy compatibility: keep readingDone in sync for complete stories.
    if (!State.state.progress.readingDone || typeof State.state.progress.readingDone !== "object") {
      State.state.progress.readingDone = {};
    }
    if (next >= 3) {
      State.state.progress.readingDone[rid] = true;
    } else if (Object.prototype.hasOwnProperty.call(State.state.progress.readingDone, rid)) {
      delete State.state.progress.readingDone[rid];
    }

    if (prev !== next) State.save();
    return next;
  },

  awardReadingStar: function(readingId, starNum) {
    var rid = (readingId == null) ? "" : String(readingId);
    if (!rid) return 0;
    var star = (typeof starNum === "number" && isFinite(starNum)) ? (starNum | 0) : parseInt(starNum, 10);
    if (!isFinite(star)) star = 0;
    if (star < 1) star = 1;
    if (star > 3) star = 3;

    var current = State.getReadingStars(rid);
    var next = Math.max(current, star);
    return State.setReadingStars(rid, next);
  },

  hasReadingXpAwarded: function(readingId, key) {
    var rid = (readingId == null) ? "" : String(readingId);
    var awardKey = (key == null) ? "" : String(key);
    if (!rid || !awardKey) return false;

    var cont = State.getReadingProfileContainer();
    if (!cont || !cont.xpAwards || typeof cont.xpAwards !== "object") return false;
    var readingAwards = cont.xpAwards[rid];
    if (!readingAwards || typeof readingAwards !== "object") return false;
    return readingAwards[awardKey] === true;
  },

  markReadingXpAwarded: function(readingId, key) {
    var rid = (readingId == null) ? "" : String(readingId);
    var awardKey = (key == null) ? "" : String(key);
    if (!rid || !awardKey) return;

    var cont = State.getReadingProfileContainer();
    if (!cont.xpAwards || typeof cont.xpAwards !== "object") cont.xpAwards = {};
    if (!cont.xpAwards[rid] || typeof cont.xpAwards[rid] !== "object") cont.xpAwards[rid] = {};
    if (cont.xpAwards[rid][awardKey] === true) return;
    cont.xpAwards[rid][awardKey] = true;
    State.save();
    return;
  },

  // ===== Reading question mastery tracking (per profile) =====

  _getReadingQuestionStatsContainer: function() {
    State.ensureTracksInitialized();
    var pid = State._getActiveProfileIdSafe();
    if (!State.state.progress.readingQuestionStatsByProfile || typeof State.state.progress.readingQuestionStatsByProfile !== "object") {
      State.state.progress.readingQuestionStatsByProfile = {};
    }
    var map = State.state.progress.readingQuestionStatsByProfile;
    if (!map[pid] || typeof map[pid] !== "object") map[pid] = {};
    return map[pid];
  },

  recordReadingAnswer: function(readingId, qIndex, isCorrect) {
    var rid = (readingId == null) ? "" : String(readingId);
    if (!rid) return;

    var qi = (typeof qIndex === "number" && isFinite(qIndex)) ? (qIndex | 0) : parseInt(qIndex, 10);
    if (!isFinite(qi) || qi < 0) qi = 0;

    var key = rid + ":" + qi;
    var stats = State._getReadingQuestionStatsContainer();
    var row = stats[key];
    if (!row || typeof row !== "object") {
      row = { attempts: 0, correctEver: false, lastAttemptAt: 0 };
    }

    var attempts = (typeof row.attempts === "number" && isFinite(row.attempts)) ? (row.attempts | 0) : parseInt(row.attempts, 10);
    if (!isFinite(attempts) || attempts < 0) attempts = 0;
    row.attempts = attempts + 1;
    if (isCorrect === true) row.correctEver = true;
    row.lastAttemptAt = Date.now();

    stats[key] = row;
    State.save();
    return;
  },

  isQuestionMastered: function(readingId, qIndex) {
    var rid = (readingId == null) ? "" : String(readingId);
    if (!rid) return false;

    var qi = (typeof qIndex === "number" && isFinite(qIndex)) ? (qIndex | 0) : parseInt(qIndex, 10);
    if (!isFinite(qi) || qi < 0) qi = 0;

    var key = rid + ":" + qi;
    var stats = State._getReadingQuestionStatsContainer();
    var row = stats[key];
    if (!row || typeof row !== "object") return false;
    return row.correctEver === true;
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
    if (!readings.length) return false;
    for (var i = 0; i < readings.length; i++) {
      var rid = readings[i] && readings[i].id;
      if (!rid) continue;
      if (State.getReadingStars(rid) < 3) return false;
    }
    return true;
  },

  getBundleMasteryPct: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    if (readings.length === 0) return 0;
    var total = 0;
    var mastered = 0;

    for (var i = 0; i < readings.length; i++) {
      var r = readings[i] || {};
      var rid = r.id;
      if (!rid) continue;

      var questions = (r.questions && Array.isArray(r.questions)) ? r.questions : [];
      var qCount = questions.length > 0 ? questions.length : 1;
      for (var q = 0; q < qCount; q++) {
        total++;
        if (State.isQuestionMastered(rid, q)) mastered++;
      }
    }

    if (total <= 0) return 0;
    return mastered / total;
  },

  isBundleUnlocked: function(bundleId) {
    var id = (typeof bundleId === "number") ? bundleId : (+bundleId);
    if (!isFinite(id) || id < 1 || Math.floor(id) !== id) return false;
    return State.getBundleReadings(id).length > 0;
  },

  isBundleReviewNeeded: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    if (!readings.length) return false;
    if (State.getUnmasteredQuestionsInBundle(bundleId).length === 0) return false;
    return State.getBundleMasteryPct(bundleId) < 0.7;
  },

  getUnmasteredQuestionsInBundle: function(bundleId) {
    var readings = State.getBundleReadings(bundleId);
    var out = [];
    if (!readings.length) return out;

    for (var i = 0; i < readings.length; i++) {
      var r = readings[i] || {};
      var rid = r.id;
      if (!rid) continue;

      var questions = (r.questions && Array.isArray(r.questions)) ? r.questions : [];
      var qCount = questions.length > 0 ? questions.length : 1;
      for (var q = 0; q < qCount; q++) {
        if (!State.isQuestionMastered(rid, q)) {
          out.push({ readingId: rid, qIndex: q });
        }
      }
    }

    return out;
  },

  // Add a new profile
  addProfile: function(name) {
    var MAX_PROFILES = 3;
    if (State.state.profile.profiles.length >= MAX_PROFILES) {
      return false;
    }
    var maxNum = 0;
    for (var i = 0; i < State.state.profile.profiles.length; i++) {
      var pid = State.state.profile.profiles[i] && State.state.profile.profiles[i].id;
      if (typeof pid === "string" && pid.charAt(0) === "p") {
        var n = parseInt(pid.slice(1), 10);
        if (isFinite(n) && n > maxNum) maxNum = n;
      }
    }
    var newId = "p" + (maxNum + 1);
    var trimmedName = (typeof name === "string") ? name.replace(/^\s+|\s+$/g, "") : "";
    var displayName = trimmedName || ("Player " + (State.state.profile.profiles.length + 1));
    State.state.profile.profiles.push({
      id: newId,
      name: displayName
    });
    State.ensureProfileProgressContainer(newId);
    State.save();
    return true;
  },

  addProfileAtSlot: function(slotNumber, name) {
    var MAX_PROFILES = 3;
    var slot = parseInt(slotNumber, 10);
    if (!isFinite(slot) || slot < 1 || slot > MAX_PROFILES) return false;
    if (!State.state || !State.state.profile || !Array.isArray(State.state.profile.profiles)) return false;

    var slotId = "p" + slot;
    for (var i = 0; i < State.state.profile.profiles.length; i++) {
      var existing = State.state.profile.profiles[i];
      if (existing && existing.id === slotId) return false;
    }

    if (State.state.profile.profiles.length >= MAX_PROFILES) return false;

    var trimmedName = (typeof name === "string") ? name.replace(/^\s+|\s+$/g, "") : "";
    var displayName = trimmedName || ("Player " + slot);

    State.state.profile.profiles.push({
      id: slotId,
      name: displayName
    });
    State.ensureProfileProgressContainer(slotId);
    State.save();
    return true;
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

  awardXP: function(amount, opts, meta) {
    return 0;
  },

  recordQuestionAttempt: function(trackId, correct) {
    return;
  }
};

// Load state on startup
State.load();
State.ensureTracksInitialized();
