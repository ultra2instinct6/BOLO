// =====================================
// Lessons Module - owns screen-learn and screen-lesson
// =====================================

// Learn screen UI shortening
var LEARN_PREVIEW_COUNT = 6;

// Learn screen persistence + library (localStorage)
var BOLO_RECENT_LESSONS_KEY = 'BOLO_RECENT_LESSONS_V1';
var LEARN_RECENT_CAP = 5;
var BOLO_LEARN_RETIRE_RESET_KEY = 'BOLO_LEARN_RETIRE_RESET_V1';

var Lessons = {
  _initialized: false,
  _keyboardBound: false,
  currentLessonId: null,
  currentLessonTrackId: null,
  currentLessonSteps: [],
  currentStepIndex: 0,
  currentExampleIndex: 0,
  inExamplesPhase: false,
  _yesNoAutoAdvanceTimer: null,

  // Review queue (Leitner-lite) storage key
  REVIEW_STORAGE_KEY: 'boloReviewQueue_v2',
  REVIEW_STORAGE_KEY_LEGACY: 'boloReviewQueue_v1',

  // Session-only runtime store (DO NOT persist)
  runtime: {
    attemptsByStepKey: {},
    activeLessonKey: null
  },
  swipeState: {
    touchStartX: null,
    touchStartY: null,
    isBound: false,
    thresholdPx: 42
  },
  
  // Enable full multi-step rendering for new-format lessons only
  isFullLessonEnabled: function(lessonId) {
    var l = LESSONS[lessonId];
    return !!(l && l.metadata && l.steps && Array.isArray(l.steps));
  },

  // Learn listing state
  lessonsPerPage: LEARN_PREVIEW_COUNT,
  currentPage: 1,
  _learnDelegationBound: false,
  learnDeckState: {
    activeIndex: 0,
    peekDirection: 1,
    isBound: false,
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
    wheelLastTs: 0,
    ordered: [],
    unlockIndex: 0
  },

  LESSON_ALIAS_MAP: {},

  resolveCanonicalLessonId: function(lessonId) {
    return lessonId;
  },

  isRetiredLessonId: function(lessonId) {
    return false;
  },

  isLearnVisibleLessonId: function(lessonId) {
    if (!lessonId || typeof lessonId !== 'string') return false;
    if (lessonId.indexOf('L_') !== 0) return false;
    if (!Array.isArray(LESSON_META)) return false;
    for (var i = 0; i < LESSON_META.length; i++) {
      if (LESSON_META[i] && LESSON_META[i].id === lessonId) return true;
    }
    return false;
  },

  normalizeTopicKey: function(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  resetRetiredLessonProgressOnce: function() {
    if (Lessons._loadJson(BOLO_LEARN_RETIRE_RESET_KEY, false) === true) return;

    var recent = Lessons._loadRecentLessons();
    var filteredRecent = [];
    for (var i = 0; i < recent.length; i++) {
      var canonicalRecent = Lessons.resolveCanonicalLessonId(recent[i]);
      if (!Lessons.isLearnVisibleLessonId(canonicalRecent)) continue;
      if (filteredRecent.indexOf(canonicalRecent) >= 0) continue;
      filteredRecent.push(canonicalRecent);
    }
    if (filteredRecent.length !== recent.length) {
      Lessons._saveJson(BOLO_RECENT_LESSONS_KEY, filteredRecent.slice(0, LEARN_RECENT_CAP));
    }

    Lessons._saveJson(BOLO_LEARN_RETIRE_RESET_KEY, true);
  },

  // ===== CATALOG SYNC (LESSONS <-> LESSON_META) =====

  // Keeps lesson content (LESSONS) and lesson listing (LESSON_META) in sync.
  // - Ensures every L_* entry in LESSONS exists in LESSON_META
  // - Ensures every LESSON_META id exists in LESSONS (creates a safe stub if missing)
  // - Aligns shared fields (trackId/difficulty/labels) by filling missing values only
  ensureLessonCatalogSync: function() {
    if (typeof LESSONS !== 'object' || !LESSONS) return;

    // Ensure LESSON_META exists
    if (typeof LESSON_META === 'undefined' || !Array.isArray(LESSON_META)) {
      window.LESSON_META = [];
    }

    // De-dupe LESSON_META by id and build index
    var metaById = {};
    var deduped = [];
    for (var i = 0; i < LESSON_META.length; i++) {
      var m = LESSON_META[i];
      if (!m || !m.id) continue;
      var canonicalMetaId = Lessons.resolveCanonicalLessonId(m.id);
      if (!Lessons.isLearnVisibleLessonId(canonicalMetaId)) continue;
      if (metaById[canonicalMetaId]) continue;

      var outMeta = m;
      if (canonicalMetaId !== m.id) {
        outMeta = {
          id: canonicalMetaId,
          labelEn: m.labelEn,
          labelPa: m.labelPa,
          trackId: m.trackId,
          difficulty: m.difficulty,
          order: m.order
        };
      }

      metaById[canonicalMetaId] = outMeta;
      deduped.push(outMeta);
    }
    LESSON_META = deduped;

    var addedMeta = 0;
    var createdStubs = 0;
    var aligned = 0;

    var addedMetaIds = [];
    var stubbedLessonIds = [];

    // 1) Ensure every LESSON_META id exists in LESSONS (create stub if missing)
    for (var mi = 0; mi < LESSON_META.length; mi++) {
      var meta = LESSON_META[mi];
      var id = meta && meta.id;
      if (!id) continue;
      if (id.indexOf('L_') !== 0) continue;
      if (!Lessons.isLearnVisibleLessonId(id)) continue;

      if (!LESSONS[id]) {
        LESSONS[id] = {
          metadata: {
            titleEn: meta.labelEn || 'Lesson',
            titlePa: meta.labelPa || 'ਪਾਠ',
            labelEn: meta.labelEn || 'Lesson',
            labelPa: meta.labelPa || 'ਪਾਠ',
            trackId: meta.trackId || 'T_WORDS',
            difficulty: meta.difficulty || 1
          },
          steps: [
            { type: 'definition', contentEn: 'Content coming soon.', contentPa: 'ਸਮੱਗਰੀ ਜਲਦੀ ਆ ਰਹੀ ਹੈ।', points: 0 }
          ]
        };
        createdStubs++;
        stubbedLessonIds.push(id);
      }

      var lessonObj = Lessons.normalizeLesson(id);
      if (lessonObj && lessonObj.metadata) {
        if (!lessonObj.metadata.trackId && meta.trackId) { lessonObj.metadata.trackId = meta.trackId; aligned++; }
        if (!lessonObj.metadata.difficulty && meta.difficulty) { lessonObj.metadata.difficulty = meta.difficulty; aligned++; }
        if (!lessonObj.metadata.labelEn && meta.labelEn) { lessonObj.metadata.labelEn = meta.labelEn; aligned++; }
        if (!lessonObj.metadata.labelPa && meta.labelPa) { lessonObj.metadata.labelPa = meta.labelPa; aligned++; }

        // If both sides define a value, keep them correlated by treating LESSON_META as canonical.
        if (meta.trackId && lessonObj.metadata.trackId && lessonObj.metadata.trackId !== meta.trackId) {
          lessonObj.metadata.trackId = meta.trackId;
          aligned++;
        }
        if (meta.difficulty && lessonObj.metadata.difficulty && lessonObj.metadata.difficulty !== meta.difficulty) {
          lessonObj.metadata.difficulty = meta.difficulty;
          aligned++;
        }
        if (meta.labelEn && lessonObj.metadata.labelEn && lessonObj.metadata.labelEn !== meta.labelEn) {
          lessonObj.metadata.labelEn = meta.labelEn;
          aligned++;
        }
        if (meta.labelPa && lessonObj.metadata.labelPa && lessonObj.metadata.labelPa !== meta.labelPa) {
          lessonObj.metadata.labelPa = meta.labelPa;
          aligned++;
        }
      }

      if (lessonObj && lessonObj.metadata) {
        var md = lessonObj.metadata;
        if (!meta.trackId && md.trackId) { meta.trackId = md.trackId; aligned++; }
        if (!meta.difficulty && md.difficulty) { meta.difficulty = md.difficulty; aligned++; }
        if (!meta.labelEn && (md.labelEn || md.titleEn)) { meta.labelEn = md.labelEn || md.titleEn; aligned++; }
        if (!meta.labelPa && (md.labelPa || md.titlePa)) { meta.labelPa = md.labelPa || md.titlePa; aligned++; }
      }
    }

    // 2) Ensure every L_* lesson in LESSONS exists in LESSON_META
    for (var lessonId in LESSONS) {
      if (!LESSONS.hasOwnProperty(lessonId)) continue;
      var canonicalId = Lessons.resolveCanonicalLessonId(lessonId);
      if (!Lessons.isLearnVisibleLessonId(canonicalId)) continue;
      if (metaById[canonicalId]) continue;
      if (canonicalId !== lessonId) continue;

      var norm = Lessons.normalizeLesson(canonicalId);
      var md2 = (norm && norm.metadata) ? norm.metadata : {};

      var trackId = md2.trackId || 'T_WORDS';
      if (typeof TRACKS === 'object' && TRACKS && trackId && !TRACKS[trackId]) trackId = 'T_WORDS';

      var newMeta = {
        id: canonicalId,
        labelEn: md2.labelEn || md2.titleEn || canonicalId,
        labelPa: md2.labelPa || md2.titlePa || '',
        trackId: trackId,
        difficulty: md2.difficulty || 1,
        order: (typeof md2.order === 'number') ? md2.order : 999
      };

      LESSON_META.push(newMeta);
      metaById[canonicalId] = newMeta;
      addedMeta++;
      addedMetaIds.push(canonicalId);
    }

    // Final de-dupe in case anything changed
    var seen2 = {};
    var deduped2 = [];
    for (var ii = 0; ii < LESSON_META.length; ii++) {
      var mm = LESSON_META[ii];
      if (!mm || !mm.id) continue;
      if (seen2[mm.id]) continue;
      seen2[mm.id] = true;
      deduped2.push(mm);
    }
    LESSON_META = deduped2;
    Lessons.resetRetiredLessonProgressOnce();

    var qaOn = false;
    try {
      qaOn = (typeof LearnQA !== 'undefined' && LearnQA.enabled && LearnQA.enabled());
    } catch (e) {
      qaOn = false;
    }
    if (qaOn) {
      var report = {
        addedMeta: addedMeta,
        createdStubs: createdStubs,
        aligned: aligned,
        totalMeta: LESSON_META.length
      };

      // Keep logs readable (avoid dumping massive arrays)
      if (addedMetaIds.length) report.addedMetaIds = addedMetaIds.slice(0, 50);
      if (stubbedLessonIds.length) report.stubbedLessonIds = stubbedLessonIds.slice(0, 50);
      console.log('🎓 [Learn] Catalog sync:', report);
    }
  },

  // ===== VALIDATION & SELECTION =====

  hashStringToInt: function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  },

  getDayKey: function() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  },

  validateLessonContent: function(lessonId) {
    var steps = Lessons.getSteps(lessonId);
    if (!steps || !steps.length) {
      return false;
    }

    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var stepType = step.type || step.step_type;
      var correct = step.correctAnswer || step.correct_answer;
      
      if (stepType === "question" &&
          step.options && Array.isArray(step.options) && step.options.length >= 2 &&
          correct && typeof correct === "string" &&
          step.options.indexOf(correct) >= 0) {
        return true;
      }
    }
    return false;
  },

  // Escape helpers for safe HTML and regex use
  escapeHtml: function(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  // ===== RUNTIME / FEEDBACK HELPERS (Two-stage question feedback) =====

  resetRuntime: function(activeLessonKey) {
    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    Lessons.runtime.attemptsByStepKey = {};
    Lessons.runtime.activeLessonKey = activeLessonKey || null;
    Lessons.runtime.seenReviewKeys = {};
    Lessons.runtime.selectedAnswerByStepKey = {};
    Lessons.runtime.submittedAnswerByStepKey = {};
  },

  // =============================
  // Canonical Step Helpers (Phase 1)
  // =============================

  // Maps existing step.type/step_type to a small canonical enum.
  // This is intentionally conservative to avoid changing runtime behavior.
  toCanonicalKind: function(step) {
    var t = step ? (step.type || step.step_type) : '';
    if (t === 'definition') return 'info';
    if (t === 'example') return 'example';
    if (t === 'guided_practice') return 'tap_word';
    if (t === 'question') return 'mcq';
    if (t === 'summary') return 'summary';
    return 'info';
  },

  // Derive a short, consistent instruction line (EN/PA) for the step.
  // Authors can override later via step.instructionEn/Pa or step.instruction.{en,pa}.
  getInstructionForStep: function(step) {
    if (!step) return { en: '', pa: '' };

    // Author-provided overrides
    var direct = Lessons._asBilingual(step.instruction);
    if (direct) return direct;
    if (typeof step.instructionEn === 'string' || typeof step.instructionPa === 'string') {
      return { en: step.instructionEn || '', pa: step.instructionPa || '' };
    }

    var kind = Lessons.toCanonicalKind(step);
    if (kind === 'example') return { en: 'Read the example.', pa: 'ਉਦਾਹਰਨ ਪੜ੍ਹੋ।' };
    if (kind === 'info') return { en: 'Read and remember.', pa: 'ਪੜ੍ਹੋ ਅਤੇ ਯਾਦ ਰੱਖੋ।' };
    if (kind === 'tap_word') return { en: 'Tap the correct word.', pa: 'ਸਹੀ ਸ਼ਬਦ ਤੇ ਟੈਪ ਕਰੋ।' };
    if (kind === 'mcq') return { en: 'Choose the best answer.', pa: 'ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਚੁਣੋ।' };
    if (kind === 'summary') return { en: 'Review what you learned.', pa: 'ਸਿੱਖਿਆ ਹੋਇਆ ਦੁਹਰਾਓ।' };
    return { en: '', pa: '' };
  },

  // Produces a canonical step envelope without altering the original step.
  // Not yet used for rendering; this is scaffolding for the unified renderer.
  toCanonicalStep: function(lessonId, stepIndex, step) {
    var lid = lessonId || Lessons.currentLessonId || 'lesson';
    var kind = Lessons.toCanonicalKind(step);
    var id = (step && typeof step.id === 'string' && step.id) ? step.id : ('idx' + String(stepIndex | 0));
    var instruction = Lessons.getInstructionForStep(step);
    var reviewKey = Lessons.getReviewKey(lid, stepIndex, step);

    return {
      id: id,
      kind: kind,
      instruction: instruction,
      reviewKey: reviewKey,
      raw: step
    };
  },

  // =============================
  // Review Queue (Phase 1: capture misses)
  // =============================

  _getReviewStorageKey: function() {
    var base = Lessons.REVIEW_STORAGE_KEY || 'boloReviewQueue_v2';
    try {
      if (window.State && typeof State._getProfileScopedStorageKey === 'function') {
        return State._getProfileScopedStorageKey(base);
      }
    } catch (e0) {}
    return base + '_p1';
  },

  _reviewLoad: function() {
    var key = Lessons._getReviewStorageKey();
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }

      // One-way migration: old global queue -> active profile queue.
      var legacyRaw = localStorage.getItem(Lessons.REVIEW_STORAGE_KEY_LEGACY);
      if (!legacyRaw) return [];
      var legacyParsed = JSON.parse(legacyRaw);
      var migrated = Array.isArray(legacyParsed) ? legacyParsed : [];
      if (migrated.length) {
        try { localStorage.setItem(key, JSON.stringify(migrated)); } catch (e1) {}
      }
      return migrated;
    } catch (e) {
      return [];
    }
  },

  _reviewSave: function(items) {
    var key = Lessons._getReviewStorageKey();
    try {
      localStorage.setItem(key, JSON.stringify(items || []));
    } catch (e) {
      // no-op
    }
  },

  getReviewKey: function(lessonId, stepIndex, step) {
    // Prefer explicitly carried reviewKey for injected review steps.
    if (step && typeof step.reviewKey === 'string' && step.reviewKey) return step.reviewKey;
    return Lessons.getStepKey(lessonId, stepIndex, step);
  },

  getDueReviewItems: function(limit) {
    var n = (typeof limit === 'number' && isFinite(limit)) ? Math.max(0, Math.floor(limit)) : 3;
    if (n <= 0) return [];

    var now = Date.now();
    var items = Lessons._reviewLoad();
    var due = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it || !it.reviewKey) continue;
      if (typeof it.dueAt !== 'number' || !isFinite(it.dueAt)) continue;
      if (it.dueAt <= now) due.push(it);
    }
    due.sort(function(a, b) { return (a.dueAt || 0) - (b.dueAt || 0); });
    return due.slice(0, n);
  },

  _safeReviewStepId: function(reviewKey) {
    try {
      return 'review_' + String(reviewKey).replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 80);
    } catch (e) {
      return 'review_idx';
    }
  },

  buildInjectedReviewSteps: function(dueItems) {
    if (!dueItems || !Array.isArray(dueItems) || !dueItems.length) return [];
    var out = [];
    for (var i = 0; i < dueItems.length; i++) {
      var it = dueItems[i];
      if (!it || !it.reviewKey || !it.options || !Array.isArray(it.options) || it.options.length < 2) continue;

      // Avoid repeating a review key within the same lesson session.
      try {
        if (!Lessons.runtime || typeof Lessons.runtime !== 'object') Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
        if (!Lessons.runtime.seenReviewKeys) Lessons.runtime.seenReviewKeys = {};
        if (Lessons.runtime.seenReviewKeys[it.reviewKey]) continue;
        Lessons.runtime.seenReviewKeys[it.reviewKey] = true;
      } catch (e) {
        // no-op
      }

      out.push({
        id: Lessons._safeReviewStepId(it.reviewKey),
        type: 'question',
        isReview: true,
        reviewKey: it.reviewKey,
        promptEn: (it.prompt && it.prompt.en) ? it.prompt.en : '',
        promptPa: (it.prompt && it.prompt.pa) ? it.prompt.pa : '',
        options: it.options.slice(0),
        correctAnswer: it.answer,
        explanationEn: (it.explanation && it.explanation.en) ? it.explanation.en : '',
        explanationPa: (it.explanation && it.explanation.pa) ? it.explanation.pa : ''
      });
    }
    return out;
  },

  buildReviewItemFromStep: function(lessonId, stepIndex, step) {
    if (!step) return null;
    var stepType = step.type || step.step_type;

    // Only queue steps we can re-render safely without new UI.
    if (stepType !== 'question') return null;

    var options = step.options;
    if (!options || !Array.isArray(options) || options.length < 2) return null;

    var correctAnswer = step.correctAnswer || step.correct_answer;
    if (!correctAnswer || typeof correctAnswer !== 'string') return null;

    var promptEn = step.englishText || step.english_text || step.promptEn || step.contentEn || '';
    var promptPa = step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || '';

    var explanation = Lessons._asBilingual(step.explanation) || {
      en: step.explanationEn || '',
      pa: step.explanationPa || ''
    };

    var item = {
      reviewKey: Lessons.getReviewKey(lessonId, stepIndex, step),
      lessonId: lessonId,
      trackId: Lessons.currentLessonTrackId || null,
      kind: 'mcq',
      prompt: { en: String(promptEn || ''), pa: String(promptPa || '') },
      options: options.slice(0),
      answer: String(correctAnswer),
      explanation: explanation,
      intervalMs: 6 * 60 * 60 * 1000,
      dueAt: Date.now() + (6 * 60 * 60 * 1000),
      stage: 0,
      lastResult: 'miss'
    };

    return item;
  },

  addReviewMiss: function(item) {
    if (!item || !item.reviewKey) return;
    var items = Lessons._reviewLoad();

    // De-dupe by reviewKey (keep earliest dueAt, update payload if needed)
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i] && items[i].reviewKey === item.reviewKey) {
        found = items[i];
        break;
      }
    }

    if (found) {
      found.lessonId = item.lessonId || found.lessonId;
      found.trackId = item.trackId || found.trackId;
      found.kind = item.kind || found.kind;
      found.prompt = item.prompt || found.prompt;
      found.options = item.options || found.options;
      found.answer = item.answer || found.answer;
      found.explanation = item.explanation || found.explanation;
      found.lastResult = 'miss';
      // Keep dueAt as the sooner of the two.
      if (typeof item.dueAt === 'number' && isFinite(item.dueAt)) {
        found.dueAt = Math.min(found.dueAt || item.dueAt, item.dueAt);
      }
      Lessons._reviewSave(items);
      return;
    }

    items.push(item);

    // Guardrails: cap size (drop oldest by dueAt)
    if (items.length > 50) {
      items.sort(function(a, b) {
        return (a && a.dueAt ? a.dueAt : 0) - (b && b.dueAt ? b.dueAt : 0);
      });
      items = items.slice(items.length - 50);
    }

    Lessons._reviewSave(items);
  },

  markReviewResult: function(reviewKey, correct) {
    if (!reviewKey) return;
    var items = Lessons._reviewLoad();
    var changed = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it || it.reviewKey !== reviewKey) continue;

      var stages = [
        1 * 24 * 60 * 60 * 1000,
        3 * 24 * 60 * 60 * 1000,
        7 * 24 * 60 * 60 * 1000,
        14 * 24 * 60 * 60 * 1000
      ];

      if (correct) {
        it.stage = Math.min((it.stage || 0) + 1, stages.length);
        var next = (it.stage >= 1 && it.stage <= stages.length) ? stages[it.stage - 1] : (14 * 24 * 60 * 60 * 1000);
        it.intervalMs = next;
        it.dueAt = Date.now() + next;
        it.lastResult = 'correct';
      } else {
        it.stage = 0;
        it.intervalMs = 6 * 60 * 60 * 1000;
        it.dueAt = Date.now() + (6 * 60 * 60 * 1000);
        it.lastResult = 'miss';
      }
      changed = true;
      break;
    }
    if (changed) Lessons._reviewSave(items);
  },

  getStepKey: function(lessonId, stepIndex, step) {
    var lid = lessonId || Lessons.currentLessonId || 'lesson';
    if (step && typeof step.id === 'string' && step.id) {
      return lid + '::' + step.id;
    }
    return lid + '::idx' + String(stepIndex | 0);
  },

  getLang: function() {
    try {
      var on = !!(State && State.state && State.state.settings && State.state.settings.punjabiOn);
      return on ? 'pa' : 'en';
    } catch (e) {
      return 'en';
    }
  },

  shouldShowPunjabi: function() {
    try {
      return !!(State && State.state && State.state.settings && State.state.settings.punjabiOn);
    } catch (e) {
      return false;
    }
  },

  getText: function(obj, fallbackEn) {
    if (!obj) return fallbackEn || '';
    if (typeof obj === 'string') return obj;
    var lang = Lessons.getLang();
    if (lang === 'pa' && typeof obj.pa === 'string' && obj.pa) return obj.pa;
    if (typeof obj.en === 'string' && obj.en) return obj.en;
    if (typeof obj.pa === 'string' && obj.pa) return obj.pa;
    return fallbackEn || '';
  },

  _asBilingual: function(v) {
    if (!v) return null;
    if (typeof v === 'string') return { en: v, pa: v };
    if (typeof v === 'object') {
      var out = { en: '', pa: '' };
      if (typeof v.en === 'string') out.en = v.en;
      if (typeof v.pa === 'string') out.pa = v.pa;
      if (out.en || out.pa) return out;
    }
    return null;
  },

  _classifyQuestion: function(step) {
    var correct = (step && (step.correctAnswer || step.correct_answer)) ? String(step.correctAnswer || step.correct_answer) : '';
    var prompt = (step && (step.englishText || step.english_text || step.promptEn || step.contentEn || ''))
      ? String(step.englishText || step.english_text || step.promptEn || step.contentEn || '')
      : '';
    var hay = (correct + ' ' + prompt).toLowerCase();

    var hasIng = (hay.indexOf(' ing') >= 0) || (correct.toLowerCase().indexOf('ing') >= 0);
    if ((hay.indexOf(' am ') >= 0 || hay.indexOf(' is ') >= 0 || hay.indexOf(' are ') >= 0) && hasIng) return 'present_progressive';
    if ((hay.indexOf(' was ') >= 0 || hay.indexOf(' were ') >= 0) && hasIng) return 'past_progressive';

    if (/(\bcan\b|\bcould\b|\bshould\b|\bmust\b|\bmay\b|\bmight\b|\bwill\b|\bwould\b|\bshall\b)/i.test(hay)) return 'modals';
    if (/(\bmy\b|\byour\b|\bhis\b|\bher\b|\bour\b|\btheir\b|\bits\b)/i.test(hay) || hay.indexOf("'s") >= 0) return 'possessives';
    if (/(\bmore\b|\bless\b)/i.test(hay) || /(\w+er\b)/i.test(correct.toLowerCase())) return 'comparative';
    if (/(\bmost\b|\bleast\b)/i.test(hay) || /(\w+est\b)/i.test(correct.toLowerCase())) return 'superlative';
    if (/(\bhas\b|\bhave\b|\bhad\b)/i.test(hay)) return 'have_has';
    if (/(\bam\b|\bis\b|\bare\b|\bwas\b|\bwere\b)/i.test(hay)) return 'be_verbs';
    return 'generic';
  },

  _generateHint: function(step) {
    var kind = Lessons._classifyQuestion(step);
    if (kind === 'present_progressive') {
      return { en: "Look for: am/is/are + verb-ing.", pa: "ਇਸ਼ਾਰਾ: am/is/are + ਕਿਰਿਆ-ing (ਜਿਵੇਂ: is playing)." };
    }
    if (kind === 'past_progressive') {
      return { en: "Look for: was/were + verb-ing.", pa: "ਇਸ਼ਾਰਾ: was/were + ਕਿਰਿਆ-ing (ਭੂਤਕਾਲੀ ਜਾਰੀ)." };
    }
    if (kind === 'modals') {
      return { en: "Find the modal (can/could/should/must…) + base verb.", pa: "ਇਸ਼ਾਰਾ: ਮੋਡਲ ਕਿਰਿਆ (can/should/must…) + ਮੂਲ ਕਿਰਿਆ।" };
    }
    if (kind === 'possessives') {
      return { en: "Ask: who owns it? (my/your/his/her/their… or ’s)", pa: "ਇਸ਼ਾਰਾ: ਇਹ ਕਿਸ ਦਾ ਹੈ? (my/your/his… ਜਾਂ ’s)" };
    }
    if (kind === 'comparative') {
      return { en: "Comparative = comparing two things (…er / more …).", pa: "ਇਸ਼ਾਰਾ: Comparative = ਦੋ ਚੀਜ਼ਾਂ ਦੀ ਤੁਲਨਾ (…er / more …)." };
    }
    if (kind === 'superlative') {
      return { en: "Superlative = the top one (…est / most …).", pa: "ਇਸ਼ਾਰਾ: Superlative = ਸਭ ਤੋਂ ਵੱਧ/ਘੱਟ (…est / most …)." };
    }
    if (kind === 'have_has') {
      return { en: "Match the subject: I/you/we/they → have; he/she/it → has.", pa: "ਇਸ਼ਾਰਾ: I/you/we/they → have; he/she/it → has." };
    }
    if (kind === 'be_verbs') {
      return { en: "Match the subject: I→am, he/she/it→is, we/you/they→are.", pa: "ਇਸ਼ਾਰਾ: I→am, he/she/it→is, we/you/they→are." };
    }
    return { en: "Grammar tip: read the full sentence, then pick the form that fits both meaning and grammar.", pa: "ਵਿਆਕਰਨ ਸੁਝਾਅ: ਪੂਰਾ ਵਾਕ ਪੜ੍ਹੋ, ਫਿਰ ਉਹ ਰੂਪ ਚੁਣੋ ਜੋ ਅਰਥ ਅਤੇ ਵਿਆਕਰਨ ਦੋਵਾਂ ਨਾਲ ਮਿਲਦਾ ਹੋਵੇ।" };
  },

  _generateExplanation: function(step, correctBool) {
    var kind = Lessons._classifyQuestion(step);
    var correct = (step && (step.correctAnswer || step.correct_answer)) ? String(step.correctAnswer || step.correct_answer) : '';
    var promptEn = (step && (step.englishText || step.english_text || step.promptEn || step.contentEn || ''))
      ? String(step.englishText || step.english_text || step.promptEn || step.contentEn || '')
      : '';
    var promptPa = (step && (step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || ''))
      ? String(step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || '')
      : '';
    var rule = Lessons._generateHint(step);
    var statePrefixEn = correctBool ? 'Correct choice.' : 'Check this rule.';
    var statePrefixPa = correctBool ? 'ਇਹ ਸਹੀ ਚੋਣ ਹੈ।' : 'ਇਹ ਨਿਯਮ ਵੇਖੋ।';

    var explainEn = statePrefixEn + ' Use the sentence and answer to verify grammar.';
    var explainPa = statePrefixPa + ' ਵਾਕ ਅਤੇ ਜਵਾਬ ਨੂੰ ਮਿਲਾ ਕੇ ਵਿਆਕਰਨ ਚੈੱਕ ਕਰੋ।';

    if (promptEn && correct) {
      explainEn = statePrefixEn + ' In "' + promptEn + '", "' + correct + '" fits this blank. Rule hint: ' + (rule.en || 'Pick the option that fits the sentence.') ;
    } else if (correct) {
      explainEn = statePrefixEn + ' "' + correct + '" is the expected answer. Rule hint: ' + (rule.en || 'Pick the option that fits the sentence.') ;
    }

    if (promptPa && correct) {
      explainPa = statePrefixPa + ' "' + promptPa + '" ਵਿੱਚ "' + correct + '" ਠੀਕ ਬੈਠਦਾ ਹੈ। ਨਿਯਮ ਸੁਝਾਅ: ' + (rule.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਾਕ ਨਾਲ ਮਿਲੇ।');
    } else if (correct) {
      explainPa = statePrefixPa + ' "' + correct + '" ਉਮੀਦ ਕੀਤਾ ਜਵਾਬ ਹੈ। ਨਿਯਮ ਸੁਝਾਅ: ' + (rule.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਾਕ ਨਾਲ ਮਿਲੇ।');
    }

    return { en: explainEn, pa: explainPa };
  },

  _generateWrongAnswerExplanation: function(step, chosenAnswer) {
    if (!step || !chosenAnswer) return null;
    var correct = (step && (step.correctAnswer || step.correct_answer)) ? String(step.correctAnswer || step.correct_answer) : '';
    if (!correct) return null;

    var chosen = String(chosenAnswer);
    if (!chosen || chosen === correct) return null;

    var optionExplanations = (step && step.wrongOptionExplanations && typeof step.wrongOptionExplanations === 'object')
      ? step.wrongOptionExplanations
      : null;

    if (optionExplanations) {
      var matched = null;
      if (Object.prototype.hasOwnProperty.call(optionExplanations, chosen)) {
        matched = optionExplanations[chosen];
      } else {
        var chosenLower = chosen.toLowerCase();
        var keys = Object.keys(optionExplanations);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (String(key).toLowerCase() === chosenLower) {
            matched = optionExplanations[key];
            break;
          }
        }
      }

      if (matched && typeof matched === 'object') {
        var matchEn = matched.en ? String(matched.en) : '';
        var matchPa = matched.pa ? String(matched.pa) : '';
        var posEn = matched.posEn ? String(matched.posEn) : '';
        var posPa = matched.posPa ? String(matched.posPa) : '';
        var posSegmentEn = posEn ? (' Part of speech: ' + posEn + '.') : '';
        var posSegmentPa = posPa ? (' ਸ਼ਬਦ ਭੇਦ: ' + posPa + '।') : '';

        return {
          en: '"' + chosen + '" is not correct here. ' + matchEn + posSegmentEn + ' Correct answer: "' + correct + '".',
          pa: '"' + chosen + '" ਇੱਥੇ ਸਹੀ ਨਹੀਂ ਹੈ। ' + matchPa + posSegmentPa + ' ਸਹੀ ਜਵਾਬ: "' + correct + '".'
        };
      }
    }

    var promptEn = (step && (step.englishText || step.english_text || step.promptEn || step.contentEn || ''))
      ? String(step.englishText || step.english_text || step.promptEn || step.contentEn || '')
      : '';
    var promptPa = (step && (step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || ''))
      ? String(step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || '')
      : '';
    var rule = Lessons._generateHint(step);

    var en = 'Nice try. "' + chosen + '" does not fit this sentence. The better answer is "' + correct + '". Try this tip: ' + (rule.en || 'Use the option that fits grammar and meaning.');
    var pa = 'ਵਿਆਕਰਨ ਪਾਠ: "' + chosen + '" ਇਸ ਵਾਕ ਵਿੱਚ ਠੀਕ ਨਹੀਂ ਬੈਠਦਾ। "' + correct + '" ਸਹੀ ਹੈ। ਨਿਯਮ ਸੁਝਾਅ: ' + (rule.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਿਆਕਰਨ ਅਤੇ ਅਰਥ ਨਾਲ ਮਿਲੇ।');

    if (promptEn) {
      en = 'In "' + promptEn + '", "' + chosen + '" is not the best fit. "' + correct + '" completes the sentence. Try this tip: ' + (rule.en || 'Use the option that fits grammar and meaning.');
    }
    if (promptPa) {
      pa = '"' + promptPa + '" ਵਿੱਚ "' + chosen + '" ਠੀਕ ਨਹੀਂ ਬੈਠਦਾ। "' + correct + '" ਨਾਲ ਵਾਕ ਠੀਕ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਨਿਯਮ ਸੁਝਾਅ: ' + (rule.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਿਆਕਰਨ ਅਤੇ ਅਰਥ ਨਾਲ ਮਿਲੇ।');
    }

    return { en: en, pa: pa };
  },

  _getHint: function(step) {
    if (!step) return null;
    var explicit = Lessons._asBilingual(step.hint) || Lessons._asBilingual({ en: step.hintEn, pa: step.hintPa });
    if (explicit && (explicit.en || explicit.pa)) return explicit;
    return Lessons._generateHint(step);
  },

  _getExplanation: function(step) {
    if (!step) return null;
    var fallback = Lessons._generateExplanation(step, true);
    var explicit = (
      Lessons._asBilingual(step.explanation) ||
      Lessons._asBilingual({ en: step.explainEn || step.englishExplain, pa: step.explainPa || step.punjabiExplain })
    );
    if (explicit && (explicit.en || explicit.pa)) {
      return {
        en: explicit.en || (fallback && fallback.en) || '',
        pa: explicit.pa || (fallback && fallback.pa) || ''
      };
    }

    // Prefer examples[0] explanation if present
    var examples = Lessons.normalizeQuestionExamples(step);
    if (examples && examples.length) {
      var ex0 = examples[0] || {};
      var exExpl = Lessons._asBilingual({ en: ex0.explainEn || ex0.noteEn, pa: ex0.explainPa || ex0.notePa });
      if (exExpl && (exExpl.en || exExpl.pa)) {
        return {
          en: exExpl.en || (fallback && fallback.en) || '',
          pa: exExpl.pa || (fallback && fallback.pa) || ''
        };
      }
    }

    return fallback;
  },

  _getWorkedExample: function(step) {
    if (!step) return null;

    function normalizeHighlightTokens(raw) {
      if (!raw) return null;

      function toTokenList(value) {
        if (value === null || value === undefined) return [];
        var parts = [];
        if (Array.isArray(value)) {
          for (var ai = 0; ai < value.length; ai++) {
            var av = value[ai];
            if (av === null || av === undefined) continue;
            var as = String(av).trim();
            if (as) parts.push(as);
          }
          return parts;
        }
        if (typeof value === 'string') {
          var split = value.split(',');
          for (var si = 0; si < split.length; si++) {
            var s = String(split[si] || '').trim();
            if (s) parts.push(s);
          }
          if (!parts.length) {
            var one = String(value).trim();
            if (one) parts.push(one);
          }
          return parts;
        }
        var v = String(value).trim();
        if (v) parts.push(v);
        return parts;
      }

      if (typeof raw === 'string' || Array.isArray(raw)) {
        var list = toTokenList(raw);
        return list.length ? { en: list, pa: list.slice(0) } : null;
      }

      if (typeof raw === 'object') {
        var enList = toTokenList(raw.en);
        var paList = toTokenList(raw.pa);
        if (!enList.length && !paList.length) return null;
        if (!enList.length) enList = paList.slice(0);
        if (!paList.length) paList = enList.slice(0);
        return { en: enList, pa: paList };
      }

      return null;
    }

    var generatedWorked = undefined;
    var getGeneratedWorked = function() {
      if (generatedWorked !== undefined) return generatedWorked;

      // Auto-generate a worked example from prompt + correct answer
      var correct = step && (step.correctAnswer || step.correct_answer);
      var promptEn = step && (step.englishText || step.english_text || step.promptEn || step.contentEn || '');
      var promptPa = step && (step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || '');
      var hint = Lessons._generateHint(step);
      if (correct) {
        var c = String(correct);
        var tokens = [];
        var parts = c.split(/\s+/);
        if (parts.length) tokens.push(parts.slice(0, Math.min(2, parts.length)).join(' '));
        var solvedEn = '';
        var solvedPa = '';
        if (promptEn) {
          solvedEn = String(promptEn).replace(/[_]{2,}/, c);
        }
        if (promptPa) {
          solvedPa = String(promptPa).replace(/[_]{2,}/, c);
        }
        generatedWorked = {
          en: solvedEn
            ? 'Try this example: "' + solvedEn + '". Tip: ' + (hint.en || 'Pick the option that fits the sentence.')
            : 'Try this example: choose "' + c + '" for this prompt. Tip: ' + (hint.en || 'Pick the option that fits the sentence.'),
          pa: solvedPa
            ? 'ਵਿਆਕਰਨ ਉਦਾਹਰਨ: "' + solvedPa + '"। ਨਿਯਮ ਸੁਝਾਅ: ' + (hint.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਾਕ ਨਾਲ ਮਿਲੇ।')
            : 'ਵਿਆਕਰਨ ਉਦਾਹਰਨ: ਇਸ ਪ੍ਰਸ਼ਨ ਲਈ "' + c + '" ਚੁਣੋ। ਨਿਯਮ ਸੁਝਾਅ: ' + (hint.pa || 'ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਾਕ ਨਾਲ ਮਿਲੇ।'),
          highlight: { en: tokens, pa: ['ਸਹੀ'] }
        };
        return generatedWorked;
      }

      generatedWorked = null;
      return generatedWorked;
    };

    // New schema
    if (step.workedExample && typeof step.workedExample === 'object') {
      var normalizedHighlight = normalizeHighlightTokens(step.workedExample.highlight);
      var we = {
        en: typeof step.workedExample.en === 'string' ? step.workedExample.en : '',
        pa: typeof step.workedExample.pa === 'string' ? step.workedExample.pa : '',
        highlight: normalizedHighlight
      };
      if (we.en || we.pa) {
        if (!we.en || !we.pa) {
          var weFallback = getGeneratedWorked();
          if (weFallback) {
            if (!we.en) we.en = weFallback.en || '';
            if (!we.pa) we.pa = weFallback.pa || '';
            if (!we.highlight && weFallback.highlight) we.highlight = weFallback.highlight;
          }
        }
        if (!we.highlight) {
          var weHighlightFallback = getGeneratedWorked();
          if (weHighlightFallback && weHighlightFallback.highlight) {
            we.highlight = weHighlightFallback.highlight;
          }
        }
        return we;
      }
    }

    // Backward compatibility: reuse first examples[0]
    var examples = Lessons.normalizeQuestionExamples(step);
    if (examples && examples.length) {
      var ex = examples[0] || {};
      var en = ex.sentenceEn || ex.exampleEn || ex.contentEn || '';
      var pa = ex.sentencePa || ex.examplePa || ex.contentPa || '';
      var h = ex.highlight;
      var highlight = null;
      if (typeof h === 'string' && h) {
        highlight = { en: [h], pa: [h] };
      }
      if (en || pa) {
        if (!en || !pa) {
          var exFallback = getGeneratedWorked();
          if (exFallback) {
            if (!en) en = exFallback.en || '';
            if (!pa) pa = exFallback.pa || '';
            if (!highlight && exFallback.highlight) highlight = exFallback.highlight;
          }
        }
        return { en: en, pa: pa, highlight: highlight };
      }
    }

    return getGeneratedWorked();
  },

  applyHighlights: function(rawText, tokens) {
    var text = (rawText === null || rawText === undefined) ? '' : String(rawText);
    if (!tokens || !Array.isArray(tokens) || !tokens.length) {
      return Lessons.escapeHtml(text);
    }

    // Normalize tokens: strings only, de-dupe, longest first
    var uniq = {};
    var list = [];
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (typeof t !== 'string') continue;
      t = t.trim();
      if (!t) continue;
      if (uniq[t]) continue;
      uniq[t] = true;
      list.push(t);
    }
    if (!list.length) return Lessons.escapeHtml(text);
    list.sort(function(a, b) { return b.length - a.length; });

    // Collect non-overlapping matches
    var matches = [];
    function overlaps(start, end) {
      for (var mi = 0; mi < matches.length; mi++) {
        var m = matches[mi];
        if (start < m.end && end > m.start) return true;
      }
      return false;
    }

    for (var ti = 0; ti < list.length; ti++) {
      var tok = list[ti];
      var from = 0;
      while (from < text.length) {
        var idx = text.indexOf(tok, from);
        if (idx === -1) break;
        var start = idx;
        var end = idx + tok.length;
        if (!overlaps(start, end)) {
          matches.push({ start: start, end: end });
        }
        from = idx + Math.max(1, tok.length);
      }
    }

    if (!matches.length) return Lessons.escapeHtml(text);
    matches.sort(function(a, b) { return a.start - b.start; });

    var out = '';
    var cur = 0;
    for (var k = 0; k < matches.length; k++) {
      var mm = matches[k];
      if (mm.start < cur) continue;
      out += Lessons.escapeHtml(text.slice(cur, mm.start));
      var cls = (k % 2 === 0) ? 'ex-hi ex-hi--primary' : 'ex-hi ex-hi--secondary';
      out += '<mark class="' + cls + '">' + Lessons.escapeHtml(text.slice(mm.start, mm.end)) + '</mark>';
      cur = mm.end;
    }
    out += Lessons.escapeHtml(text.slice(cur));
    return out;
  },

  renderFeedback: function(opts) {
    var el = document.getElementById('lesson-feedback');
    if (!el) return;

    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    var step = opts && opts.step;
    var correct = !!(opts && opts.correct);
    var showHint = !!(opts && opts.showHint);
    var canContinue = !!(opts && opts.canContinue);
    var selectedAnswer = (opts && opts.selectedAnswer !== undefined && opts.selectedAnswer !== null)
      ? String(opts.selectedAnswer)
      : '';

    var punjabiOn = Lessons.shouldShowPunjabi();

    var feedback = (step && step.feedback && typeof step.feedback === 'object') ? step.feedback : null;
    var statusEn = correct
      ? (feedback && (feedback.correctEn || feedback.correct))
      : (feedback && (feedback.wrongEn || feedback.wrong));
    var statusPa = correct
      ? (feedback && (feedback.correctPa || feedback.correct))
      : (feedback && (feedback.wrongPa || feedback.wrong));

    if (!statusEn) statusEn = correct ? 'Correct!' : 'Not quite.';
    if (!statusPa) statusPa = correct ? 'ਠੀਕ ਹੈ!' : 'ਠੀਕ ਨਹੀਂ।';

    var hint = showHint ? Lessons._getHint(step) : null;
    var explanation = (!showHint) ? Lessons._getExplanation(step) : null;
    var worked = (!showHint) ? Lessons._getWorkedExample(step) : null;

    var explainFallback = Lessons._generateExplanation(step, correct);
    if (!explainFallback || (!explainFallback.en && !explainFallback.pa)) {
      explainFallback = correct
        ? { en: 'Great choice. This word fits the sentence well.', pa: 'ਵਿਆਕਰਨ ਪਾਠ: ਇਹ ਚੋਣ ਵਾਕ ਦੇ ਪ੍ਰਸ਼ਨ ਅਤੇ ਵਿਆਕਰਨ ਨਿਯਮ ਨਾਲ ਮਿਲਦੀ ਹੈ।' }
        : { en: 'Try again. Pick the option that makes the sentence sound right.', pa: 'ਵਿਆਕਰਨ ਪਾਠ: ਉਹ ਚੋਣ ਕਰੋ ਜੋ ਵਾਕ ਦਾ ਢਾਂਚਾ ਅਤੇ ਅਰਥ ਸਹੀ ਰੱਖੇ।' };
    }

    if (!explanation) explanation = explainFallback;

    if (!correct && !showHint && selectedAnswer) {
      var wrongExplanation = Lessons._generateWrongAnswerExplanation(step, selectedAnswer);
      if (wrongExplanation && (wrongExplanation.en || wrongExplanation.pa)) {
        explanation = wrongExplanation;
      }
    }

    var we = worked;
    if (!we) {
      we = { en: '', pa: '', highlight: null };
    }

    var highlightEn = (we.highlight && Array.isArray(we.highlight.en)) ? we.highlight.en : [];
    var highlightPa = (we.highlight && Array.isArray(we.highlight.pa)) ? we.highlight.pa : [];

    var html = '';
    html += '<div class="lesson-feedback-panel ' + (correct ? 'is-correct' : 'is-wrong') + '">';
    html += '  <div class="lesson-feedback-status">';
    html += '    <div class="lesson-feedback-status-en">' + Lessons.escapeHtml(statusEn) + '</div>';
    if (punjabiOn) html += '    <div class="lesson-feedback-status-pa" lang="pa">' + Lessons.escapeHtml(statusPa) + '</div>';
    html += '  </div>';

    if (selectedAnswer.trim()) {
      html += '  <div class="lesson-feedback-choice">';
      html += '    <div class="lesson-feedback-choice-en">You chose: ' + Lessons.escapeHtml(selectedAnswer) + '</div>';
      if (punjabiOn) html += '    <div class="lesson-feedback-choice-pa" lang="pa">ਤੁਸੀਂ ਚੁਣਿਆ: ' + Lessons.escapeHtml(selectedAnswer) + '</div>';
      html += '  </div>';
    }

    if (hint && (hint.en || hint.pa)) {
      html += '  <div class="lesson-hint">';
      html += '    <div class="lesson-hint-title">Hint</div>';
      if (hint.en) html += '    <div class="lesson-hint-en">' + Lessons.escapeHtml(hint.en) + '</div>';
      if (punjabiOn && hint.pa) html += '    <div class="lesson-hint-pa" lang="pa">' + Lessons.escapeHtml(hint.pa) + '</div>';
      html += '  </div>';
    }

    if (!hint) {
      if (explanation && (explanation.en || explanation.pa)) {
        html += '  <div class="lesson-explain">';
        html += '    <div class="lesson-explain-title">Grammar Lesson</div>';
        if (explanation.en) html += '    <div class="lesson-explain-en">' + Lessons.escapeHtml(explanation.en) + '</div>';
        if (punjabiOn && explanation.pa) html += '    <div class="lesson-explain-pa" lang="pa">' + Lessons.escapeHtml(explanation.pa) + '</div>';
        html += '  </div>';
      }

      if ((we.en || we.pa)) {
        html += '  <div class="lesson-example">';
        html += '    <div class="lesson-example-title">Grammar Example</div>';
        if (we.en) html += '    <div class="lesson-example-en">' + Lessons.applyHighlights(we.en, highlightEn) + '</div>';
        if (punjabiOn && we.pa) html += '    <div class="lesson-example-pa" lang="pa">' + Lessons.applyHighlights(we.pa, highlightPa) + '</div>';
        html += '  </div>';
      }
    }

    if (canContinue) {
      html += '  <div class="lesson-continue"><span class="lesson-continue-pill">Tap Next to continue.</span></div>';
    }

    html += '</div>';

    el.innerHTML = html;
    el.className = 'feedback ' + (correct ? 'correct' : 'wrong');

  },

  escapeRegex: function(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  normalizeQuestionExamples: function(step) {
    if (Array.isArray(step.examples) && step.examples.length) {
      return step.examples;
    }

    // Backward compatibility: single fields to examples[0]
    var hasLegacyExample = step.exampleEn || step.examplePa || step.explainEn || step.explainPa || step.highlight || step.exampleHighlight;
    if (hasLegacyExample) {
      return [{
        sentenceEn: step.exampleEn || step.englishExample || "",
        sentencePa: step.examplePa || step.punjabiExample || "",
        explainEn: step.explainEn || step.englishExplain || "",
        explainPa: step.explainPa || step.punjabiExplain || "",
        highlight: step.highlight || step.exampleHighlight || ""
      }];
    }

    return [];
  },

  renderQuestionExample: function(step) {
    var container = document.getElementById("question-examples");
    if (!container) return;

    var examples = Lessons.normalizeQuestionExamples(step);
    if (!examples.length) {
      container.innerHTML = "";
      Lessons.inExamplesPhase = false;
      Lessons.currentExampleIndex = 0;
      return;
    }

    var idx = Lessons.currentExampleIndex || 0;
    if (idx < 0) idx = 0;
    if (idx >= examples.length) idx = examples.length - 1;

    var ex = examples[idx];
    var sentenceEnRaw = ex.sentenceEn || ex.exampleEn || ex.contentEn || "";
    var sentencePaRaw = ex.sentencePa || ex.examplePa || ex.contentPa || "";
    var explainEnRaw = ex.explainEn || ex.noteEn || "";
    var explainPaRaw = ex.explainPa || ex.notePa || "";
    var highlight = ex.highlight || step.highlight || step.exampleHighlight || "";

    function toTokenList(raw) {
      if (raw === null || raw === undefined) return [];
      var out = [];
      function pushOne(v) {
        if (v === null || v === undefined) return;
        var s = String(v).trim();
        if (!s) return;
        if (out.indexOf(s) === -1) out.push(s);
      }
      if (Array.isArray(raw)) {
        for (var ai = 0; ai < raw.length; ai++) pushOne(raw[ai]);
        return out;
      }
      if (typeof raw === 'string') {
        var parts = raw.split(',');
        for (var si = 0; si < parts.length; si++) pushOne(parts[si]);
        if (!out.length) pushOne(raw);
        return out;
      }
      if (typeof raw === 'object') {
        if (raw.en !== undefined) {
          var enList = toTokenList(raw.en);
          for (var ei = 0; ei < enList.length; ei++) pushOne(enList[ei]);
        }
        if (raw.pa !== undefined) {
          var paList = toTokenList(raw.pa);
          for (var pi = 0; pi < paList.length; pi++) pushOne(paList[pi]);
        }
        return out;
      }
      pushOne(raw);
      return out;
    }

    function toLangTokenList(raw, langKey) {
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        var own = toTokenList(raw[langKey]);
        if (own.length) return own;
        if (langKey === 'en') {
          var paFallback = toTokenList(raw.pa);
          if (paFallback.length) return paFallback;
        } else {
          var enFallback = toTokenList(raw.en);
          if (enFallback.length) return enFallback;
        }
      }
      return toTokenList(raw);
    }

    var highlightEnTokens = toLangTokenList(highlight, 'en');
    var highlightPaTokens = toLangTokenList(highlight, 'pa');

    var safeSentenceEn = Lessons.applyHighlights(sentenceEnRaw, highlightEnTokens);
    var safeSentencePa = Lessons.applyHighlights(sentencePaRaw, highlightPaTokens);

    var html = "";
    html += "<div class='question-example-block'>";
    html += "  <div class='example-row'>";
    html += "    <div class='example-label'>English</div>";
    html += "    <div class='example-sentence'>" + (safeSentenceEn || safeSentencePa || "") + "</div>";
    if (explainEnRaw) {
      html += "    <div class='example-explain'>" + Lessons.escapeHtml(explainEnRaw) + "</div>";
    }
    html += "  </div>";

    html += "  <div class='example-row'>";
    html += "    <div class='example-label'>ਪੰਜਾਬੀ</div>";
    html += "    <div class='example-sentence'>" + (safeSentencePa || safeSentenceEn || "") + "</div>";
    if (explainPaRaw) {
      html += "    <div class='example-explain'>" + Lessons.escapeHtml(explainPaRaw) + "</div>";
    }
    html += "  </div>";

    html += "  <div class='example-index'>" + (idx + 1) + " / " + examples.length + "</div>";
    
        // Add hint about what Next will do
        if (examples.length > 1 && idx < examples.length - 1) {
          html += "  <div class='example-hint'>→ Next to see more examples</div>";
        } else {
          html += "  <div class='example-hint'>→ Next to continue</div>";
        }
    
    html += "</div>";

    container.innerHTML = html;
  },

  // ===== LESSON NORMALIZATION & STRUCTURE =====

  normalizeLesson: function(lessonId) {
    var lesson = LESSONS[lessonId];
    if (!lesson) return null;

    // Already normalized (new format with metadata & steps)
    if (lesson.steps && lesson.metadata) {
      return lesson;
    }

    // Convert old array format to new object format
    if (Array.isArray(lesson)) {
      return {
        metadata: {
          titleEn: "Lesson",
          titlePa: "ਪਾਠ",
          difficulty: 1
        },
        steps: lesson
      };
    }

    return lesson;
  },

  getSteps: function(lessonId) {
    var lesson = Lessons.normalizeLesson(lessonId);
    return lesson && lesson.steps ? lesson.steps : [];
  },

  getPlayableSteps: function(lessonId) {
    var steps = Lessons.getSteps(lessonId);
    if (!steps || !steps.length) return [];
    var out = [];
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var stepType = step ? (step.type || step.step_type) : null;
      if (stepType === 'objective') continue;
      out.push(step);
    }
    return out;
  },

  initLesson: function(lessonId) {
    if (!State.state.session.lessonProgress) {
      State.state.session.lessonProgress = {};
    }
    if (!State.state.session.lessonProgress[lessonId]) {
      State.state.session.lessonProgress[lessonId] = {
        stepsCompleted: 0,
        pointsEarned: 0,
        stepAwarded: {},
        stepResolved: {},
        initiallyWrong: {}
      };
      return;
    }

    var progress = State.state.session.lessonProgress[lessonId];
    if (!progress.stepAwarded || typeof progress.stepAwarded !== 'object') progress.stepAwarded = {};
    if (!progress.stepResolved || typeof progress.stepResolved !== 'object') progress.stepResolved = {};
    if (!progress.initiallyWrong || typeof progress.initiallyWrong !== 'object') progress.initiallyWrong = {};
  },

  markStepResolved: function(stepIndex, resolved) {
    var lessonId = Lessons.currentLessonId;
    if (!lessonId && lessonId !== 0) return;
    Lessons.initLesson(lessonId);
    var progress = State.state.session.lessonProgress[lessonId];
    if (!progress) return;
    progress.stepResolved[stepIndex] = !!resolved;
  },

  markInitialWrong: function(stepIndex) {
    var lessonId = Lessons.currentLessonId;
    if (!lessonId && lessonId !== 0) return;
    Lessons.initLesson(lessonId);
    var progress = State.state.session.lessonProgress[lessonId];
    if (!progress) return;
    if (!progress.initiallyWrong[stepIndex]) {
      progress.initiallyWrong[stepIndex] = true;
      State.save();
    }
  },

  isReviewMode: function() {
    return false;
  },

  canNavigateBack: function() {
    return Lessons.currentStepIndex > 0;
  },

  canAdvanceFromCurrentStep: function() {
    var step = Lessons.currentLessonSteps && Lessons.currentLessonSteps[Lessons.currentStepIndex];
    if (!step) return false;

    var stepType = step.type || step.step_type;
    if (stepType === 'question' || stepType === 'guided_practice') {
      Lessons.initLesson(Lessons.currentLessonId);
      var progress = State.state.session.lessonProgress[Lessons.currentLessonId] || null;
      return !!(progress && progress.stepResolved && progress.stepResolved[Lessons.currentStepIndex]);
    }
    return true;
  },

  bindLessonSwipeGestures: function() {
    if (Lessons.swipeState.isBound) return;
    var card = document.getElementById('lessonDeckCard') || document.querySelector('#screen-lesson .card');
    if (!card) return;

    Lessons.swipeState.isBound = true;

    card.addEventListener('touchstart', function(e) {
      if (!e.touches || !e.touches.length) return;
      Lessons.swipeState.touchStartX = e.touches[0].clientX;
      Lessons.swipeState.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', function(e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      if (Lessons.swipeState.touchStartX === null || Lessons.swipeState.touchStartY === null) return;

      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      var dx = endX - Lessons.swipeState.touchStartX;
      var dy = endY - Lessons.swipeState.touchStartY;

      Lessons.swipeState.touchStartX = null;
      Lessons.swipeState.touchStartY = null;

      if (Math.abs(dx) < Lessons.swipeState.thresholdPx) return;
      if (Math.abs(dx) < Math.abs(dy)) return;

      if (dx > 0) {
        Lessons.nextStep();
      } else {
        Lessons.prevStep();
      }
    }, { passive: true });
  },

  animateLessonCard: function() {
    var card = document.getElementById('lessonDeckCard') || document.querySelector('#screen-lesson .card');
    if (!card) return;
    card.classList.remove('lesson-card-swipe-enter');
    void card.offsetWidth;
    card.classList.add('lesson-card-swipe-enter');
  },

  renderSwipeProgress: function() {
    var dotsWrap = document.getElementById('lesson-step-dots');
    var hintEl = document.getElementById('lesson-swipe-hint');
    var wrap = document.getElementById('lesson-swipe-progress');
    var lessonHeroProgress = document.querySelector('#screen-lesson .lesson-step-progress');
    if (!wrap || !hintEl) return;

    if (!Lessons.currentLessonSteps || !Lessons.currentLessonSteps.length) {
      if (dotsWrap) dotsWrap.innerHTML = '';
      hintEl.textContent = '';
      return;
    }

    var totalSteps = Lessons.currentLessonSteps.length;
    var isAtStart = Lessons.currentStepIndex <= 0;
    var isAtEnd = Lessons.currentStepIndex >= (totalSteps - 1);
    try {
      wrap.classList.toggle('is-at-start', isAtStart);
      wrap.classList.toggle('is-at-end', isAtEnd);
      if (lessonHeroProgress) {
        lessonHeroProgress.classList.toggle('is-at-start', isAtStart);
        lessonHeroProgress.classList.toggle('is-at-end', isAtEnd);
      }
    } catch (eWrapState) {}
    if (dotsWrap) {
      dotsWrap.classList.toggle('is-at-start', isAtStart);
      dotsWrap.classList.toggle('is-at-end', isAtEnd);
    }
    var lessonPrevBtn = document.getElementById('btn-lesson-prev');
    var lessonNextBtn = document.getElementById('btn-lesson-next');
    if (lessonPrevBtn) lessonPrevBtn.classList.toggle('is-endpoint-fade', isAtStart);
    if (lessonNextBtn) lessonNextBtn.classList.toggle('is-endpoint-fade', isAtEnd);

    Lessons.initLesson(Lessons.currentLessonId);
    var progress = State.state.session.lessonProgress[Lessons.currentLessonId] || {};
    var resolved = progress.stepResolved || {};
    var isReview = Lessons.isReviewMode();

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      var maxVisibleDots = 8;
      var totalDots = Lessons.currentLessonSteps.length;
      var visibleDots = Math.min(totalDots, maxVisibleDots);
      var dotStart = 0;
      if (totalDots > visibleDots) {
        dotStart = Lessons.currentStepIndex - Math.floor(visibleDots / 2);
        if (dotStart < 0) dotStart = 0;
        if (dotStart > (totalDots - visibleDots)) dotStart = totalDots - visibleDots;
      }

      for (var i = dotStart; i < (dotStart + visibleDots); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'lesson-step-dot';
        dot.setAttribute('aria-label', 'Step ' + (i + 1));
        if (i === Lessons.currentStepIndex) dot.classList.add('is-active');
        if (i < Lessons.currentStepIndex || !!resolved[i]) dot.classList.add('is-done');

        if (isReview && i < Lessons.currentStepIndex) {
          (function(targetIdx) {
            dot.addEventListener('click', function() {
              Lessons.currentStepIndex = targetIdx;
              State.state.session.currentLessonStep = Lessons.currentStepIndex;
              State.save();
              Lessons.renderLessonStep();
            });
          })(i);
        } else {
          dot.disabled = true;
        }

        dotsWrap.appendChild(dot);
      }
    }

    var step = Lessons.currentLessonSteps[Lessons.currentStepIndex] || null;
    var stepType = step ? (step.type || step.step_type) : '';
    if (!isReview && (stepType === 'question' || stepType === 'guided_practice') && !Lessons.canAdvanceFromCurrentStep()) {
      hintEl.textContent = '';
      return;
    }

    if (!isReview) {
      hintEl.textContent = '';
      return;
    }

    hintEl.textContent = '';
  },

  awardStepPoints: function(stepIndex, step) {
    var lessonId = Lessons.currentLessonId;
    Lessons.initLesson(lessonId);

    var progress = State.state.session.lessonProgress[lessonId];
    if (!progress) return;

    // Only award once per step
    if (progress.stepAwarded[stepIndex]) {
      return;
    }

    var points = step.points || 0;
    if (points > 0) {
      progress.pointsEarned = (progress.pointsEarned || 0) + points;
      progress.stepAwarded[stepIndex] = true;

      // Award to track XP
      var trackId = Lessons.currentLessonTrackId;
      var savedByAwardXP = false;
      if (trackId && typeof State !== "undefined" && State && typeof State.awardXP === "function") {
        State.awardXP(points, { trackId: trackId }, { section: "learn", reason: "lesson_step_points" });
        savedByAwardXP = true;
      } else if (trackId && State.state.progress.trackXP && State.state.progress.trackXP[trackId]) {
        State.state.progress.trackXP[trackId].xp = (State.state.progress.trackXP[trackId].xp || 0) + points;
      }

      if (!savedByAwardXP) State.save();
    }
  },

  // ===== RENDERING: EXAMPLE STEP (WITH AUTO-HIGHLIGHT) =====

  renderExampleStep: function(step) {
    var container = document.getElementById("lesson-options");
    if (!container) return;

    var exampleText = step.exampleEn || step.contentEn || "";
    var highlightedWords = step.highlightedWords || [];

    // Parse text into words and create spans with highlighting
    var words = exampleText.split(/\s+/);
    var html = "<div class='example-text-display'>";

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var isHighlighted = highlightedWords.indexOf(word) >= 0;
      
      if (isHighlighted) {
        html += `<span class="highlight-word">${word}</span>`;
      } else {
        html += `<span>${word}</span>`;
      }
      html += " ";
    }

    html += "</div>";
    container.innerHTML = html;

    // Auto-award points for viewing example
    Lessons.awardStepPoints(Lessons.currentStepIndex, step);

    var nextBtn = document.getElementById("btn-lesson-next");
    if (nextBtn) nextBtn.disabled = false;
  },

  // ===== RENDERING: GUIDED PRACTICE (TAP-TO-SELECT, THEN HIGHLIGHT) =====

  renderGuidedPracticeStep: function(step) {
    var container = document.getElementById("lesson-options");
    if (!container) return;

    var words = (step.sentenceEn || "").split(/\s+/);
    var clickableWords = step.clickableWords || [];
    var correctAnswers = step.correctAnswers || [];
    var selectedWords = [];
    var isPhase2 = false; // Track if we're in confirmation phase

    var html = "<div class='guided-practice-container'><div class='word-container'>";

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      // Important UX: do not visually leak the answer by pre-disabling or de-emphasizing
      // non-target words. Correctness is still enforced via correctAnswers.
      html += `<button class="word-btn clickable" data-word="${word}" data-clickable="true">${word}</button>`;
    }

    html += "</div></div>";
    container.innerHTML = html;

    var nextBtn = document.getElementById("btn-lesson-next");

    // Attach click handlers to all clickable word buttons
    var buttons = container.querySelectorAll(".word-btn.clickable");
    for (var bi = 0; bi < buttons.length; bi++) {
      (function(btn) {
        btn.addEventListener("click", function() {
          // Phase 2: if already confirmed, don't allow further clicks
          if (isPhase2) return;

          var word = btn.getAttribute("data-word");
          var isSelected = selectedWords.indexOf(word) >= 0;

          if (isSelected) {
            selectedWords = selectedWords.filter(w => w !== word);
            btn.classList.remove("selected");
            btn.style.backgroundColor = "#f0f7ff";
            btn.style.color = "#333";
          } else {
            selectedWords.push(word);
            btn.classList.add("selected");
            btn.style.backgroundColor = "#ffd700";
            btn.style.color = "#000";
          }

          // Check if user got it right
          var allCorrect = correctAnswers.length === selectedWords.length &&
                          correctAnswers.every(a => selectedWords.indexOf(a) >= 0);

          if (allCorrect && selectedWords.length > 0) {
            // Phase 1 complete: user selected correctly
            Lessons.handleGuidedPracticeCorrect(step, container, buttons);
            isPhase2 = true;
          }
        });
      })(buttons[bi]);
    }
  },

  handleGuidedPracticeCorrect: function(step, container, buttons) {
    var lessonFeedbackEl = document.getElementById("lesson-feedback");
    if (lessonFeedbackEl) {
      lessonFeedbackEl.textContent = step.feedbackCorrect || "Correct! / ਠੀਕ ਹੈ!";
      lessonFeedbackEl.className = "feedback correct";
    }

    // Phase 2: highlight the correct words with green to show final confirmation
    if (container && buttons) {
      for (var bi = 0; bi < buttons.length; bi++) {
        var btn = buttons[bi];
        var word = btn.getAttribute("data-word");
        var isCorrect = (step.correctAnswers || []).indexOf(word) >= 0;
        
        if (isCorrect) {
          btn.classList.add("correct-highlight");
          btn.style.backgroundColor = "#4caf50";
          btn.style.color = "#fff";
        }
      }
    }

    // Disable all buttons to prevent further interaction
    var allBtns = container.querySelectorAll(".word-btn");
    for (var abi = 0; abi < allBtns.length; abi++) {
      allBtns[abi].disabled = true;
    }

    Lessons.awardStepPoints(Lessons.currentStepIndex, step);
    Lessons.markStepResolved(Lessons.currentStepIndex, true);

    var nextBtn = document.getElementById("btn-lesson-next");
    if (nextBtn) nextBtn.disabled = false;
  },

  // ===== RENDERING: SUMMARY SCREEN =====

  renderSummaryStep: function(step) {
    var container = document.getElementById("lesson-options");
    if (!container) return;

    var html = `
      <div class="lesson-summary">
        <h3 class="summary-title-en">${step.titleEn || ""}</h3>
        <h3 class="summary-title-pa">${step.titlePa || ""}</h3>
        
        <p class="summary-text-en">${step.summaryEn || ""}</p>
        <p class="summary-text-pa">${step.summaryPa || ""}</p>
        
        <div class="summary-examples">
          <h4 class="examples-title-en">Key Examples:</h4>
          <h4 class="examples-title-pa">ਮੁੱਖ ਉਦਾਹਰਨਾਂ:</h4>
          <div class="examples-list">
            ${(step.keyExamplesEn || []).map((ex, i) => `
              <div class="example-pair">
                <span class="en">${ex}</span>
                <span class="pa">${step.keyExamplesPa && step.keyExamplesPa[i] ? step.keyExamplesPa[i] : ""}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="summary-points">
          <span class="points-label-en">Total Points:</span>
          <span class="points-label-pa">ਕੁਲ ਪੁਆਇੰਟ:</span>
          <span class="points-value">+${step.totalPoints || 10} XP</span>
        </div>
      </div>
    `;

    container.innerHTML = html;

    var nextBtn = document.getElementById("btn-lesson-next");
    if (nextBtn) nextBtn.disabled = false;
    Lessons.markStepResolved(Lessons.currentStepIndex, true);
  },

  // ===== EXISTING METHODS (MODIFIED) =====

  init: function() {
    if (Lessons._initialized) return;
    Lessons._initialized = true;
    // Bind buttons
    var btnNext = document.getElementById("btn-lesson-next");
    if (btnNext) {
      if (!btnNext.dataset.lessonNextBound) {
        btnNext.dataset.lessonNextBound = "1";
        btnNext.addEventListener("click", function() { Lessons.nextStep(); });
      }
    }

    var btnPrev = document.getElementById("btn-lesson-prev");
    if (btnPrev) {
      if (!btnPrev.dataset.lessonPrevBound) {
        btnPrev.dataset.lessonPrevBound = "1";
        btnPrev.addEventListener("click", function() { Lessons.prevStep(); });
      }
    }

    var btnCheck = document.getElementById("btn-lesson-check");
    if (btnCheck) {
      if (!btnCheck.dataset.lessonCheckBound) {
        btnCheck.dataset.lessonCheckBound = "1";
        btnCheck.addEventListener("click", function() {
          var step = Lessons.currentLessonSteps && Lessons.currentLessonSteps[Lessons.currentStepIndex];
          if (!step) return;
          var stepType = step.type || step.step_type;
          if (stepType !== 'question') return;
          Lessons.submitSelectedQuestionAnswer(Lessons.currentStepIndex, step);
        });
      }
    }

    Lessons.bindLessonSwipeGestures();

    // Ensure catalog consistency before any filtering/rendering
    Lessons.ensureLessonCatalogSync();

    // Render learn sections on startup
    Lessons.renderLearnSections();
  },

  // Lifecycle: wire once, sync controls, and render dynamic content
  wireOnce: function() {
    Lessons.init();
  },

  syncUI: function() {},

  renderContent: function() {
    Lessons.renderLearnSections();
  },

  mount: function() {
    Lessons.wireOnce();
    Lessons.ensureLessonCatalogSync();
    Lessons.syncUI();
    Lessons.renderContent();
  },

  // Render learn screen with lesson cards

  _getSafeLessonMetaById: function(lessonId) {
    lessonId = Lessons.resolveCanonicalLessonId(lessonId);
    if (!lessonId) return null;
    for (var i = 0; i < LESSON_META.length; i++) {
      if (LESSON_META[i] && LESSON_META[i].id === lessonId) return LESSON_META[i];
    }
    return null;
  },

  _loadJson: function(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  _saveJson: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  _isLearnScreenActive: function() {
    try {
      var el = document.getElementById('screen-learn');
      return !!(el && el.classList.contains('active'));
    } catch (e) {
      return false;
    }
  },

  // ===== Recent Lessons =====

  _loadRecentLessons: function() {
    var arr = Lessons._loadJson(BOLO_RECENT_LESSONS_KEY, []);
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var id = Lessons.resolveCanonicalLessonId(arr[i]);
      if (Lessons.isLearnVisibleLessonId(id) && out.indexOf(id) === -1) out.push(id);
      if (out.length >= LEARN_RECENT_CAP) break;
    }
    return out;
  },

  _pushRecentLesson: function(lessonId) {
    lessonId = Lessons.resolveCanonicalLessonId(lessonId);
    if (!Lessons.isLearnVisibleLessonId(lessonId)) return;
    var list = Lessons._loadRecentLessons();
    var idx = list.indexOf(lessonId);
    if (idx >= 0) list.splice(idx, 1);
    list.unshift(lessonId);
    if (list.length > LEARN_RECENT_CAP) list = list.slice(0, LEARN_RECENT_CAP);
    Lessons._saveJson(BOLO_RECENT_LESSONS_KEY, list);
  },

  _bindLearnDelegationOnce: function() {},

  _learnDeckElements: function() {
    var deck = document.getElementById('learnSwipeDeck');
    if (!deck) return null;
    return {
      deck: deck,
      progressHost: document.querySelector('#screen-learn .learn-hero-progress'),
      viewport: document.getElementById('learnDeckViewport'),
      track: document.getElementById('learnDeckTrack'),
      dots: document.getElementById('learnDeckDots'),
      progressText: document.getElementById('learnDeckProgressText'),
      prevBtn: document.getElementById('btn-learn-prev-deck'),
      nextBtn: document.getElementById('btn-learn-next-deck'),
      startBtn: document.getElementById('btn-learn-deck-start'),
      hint: document.getElementById('learnSwipeHint')
    };
  },

  _getLearnDeckCards: function() {
    var track = document.getElementById('learnDeckTrack');
    if (!track) return [];
    return Array.prototype.slice.call(track.querySelectorAll('.deck-card'));
  },

  _learnWrappedDelta: function(index, current, total) {
    var delta = index - current;
    if (total <= 2) return delta;
    var half = total / 2;
    if (delta > half) delta -= total;
    else if (delta < -half) delta += total;
    return delta;
  },

  _learnClamp: function(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  _markLearnDeckHintSeen: function() {
    var els = Lessons._learnDeckElements();
    if (!els || !els.hint) return;
    els.hint.style.display = 'none';
    try { localStorage.setItem('learnDeckHintSeen_v1', '1'); } catch (e) {}
  },

  _applyLearnDeckLook: function(progress) {
    var els = Lessons._learnDeckElements();
    if (!els || !els.deck) return;
    var state = Lessons.learnDeckState;
    var cards = Lessons._getLearnDeckCards();
    if (!cards.length) return;

    if (state.reduceMotion) {
      els.deck.classList.toggle('is-swipe-moving', false);
      for (var r = 0; r < cards.length; r++) {
        cards[r].style.transform = '';
        cards[r].style.opacity = '';
        cards[r].style.filter = '';
        cards[r].style.zIndex = '';
      }
      return;
    }

    var p = (typeof progress === 'number' && isFinite(progress)) ? Lessons._learnClamp(progress, -1.2, 1.2) : 0;
    els.deck.classList.toggle('is-swipe-moving', Math.abs(p) > 0.015);

    for (var i = 0; i < cards.length; i++) {
      var baseDelta = Lessons._learnWrappedDelta(i, state.activeIndex, cards.length);
      var rel = baseDelta + p;
      var absRel = Math.abs(rel);
      var depthFactor = Lessons._learnClamp(absRel, 0, 2.2);
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
        slideX = Lessons._learnClamp(rel, -1.2, 1.2) * -18;
        scale = 1 - (Math.min(depthFactor, 1.2) * 0.015);
        liftY = Math.round(Math.min(depthFactor, 1.0) * 1);
        rotateY = Lessons._learnClamp(rel * -3, -4, 4);
      } else if (isPeekCard) {
        slideX = Lessons._learnClamp(rel, -1.6, 1.6) * -34;
        scale = 0.97 - (Math.min(depthFactor, 1.7) * 0.02);
        liftY = 4 + Math.round(Math.min(depthFactor, 1.5) * 2);
        rotateY = Lessons._learnClamp(rel * -3.4, -5, 5);
        opacity = 0.74 - (Math.min(depthFactor, 2.0) * 0.08);
        saturate = 0.9 - (Math.min(depthFactor, 1.8) * 0.06);
        brightness = 0.98;
        z = 360 - Math.round(depthFactor * 24);
      } else {
        slideX = Lessons._learnClamp(rel, -1.8, 1.8) * -12;
        scale = 0.92 - (Math.min(depthFactor, 2.0) * 0.02);
        liftY = 7 + Math.round(Math.min(depthFactor, 1.8) * 3);
        rotateY = Lessons._learnClamp(rel * -2.4, -4, 4);
        opacity = 0.34;
        saturate = 0.74;
        brightness = 0.94;
        z = 150;
      }
      if (z < 90) z = 90;

      cards[i].style.transform = 'translateX(' + slideX.toFixed(2) + '%) translateY(' + liftY + 'px) scale(' + scale.toFixed(3) + ') rotateY(' + rotateY.toFixed(2) + 'deg)';
      cards[i].style.opacity = opacity.toFixed(3);
      cards[i].style.filter = 'saturate(' + saturate.toFixed(3) + ') brightness(' + brightness.toFixed(3) + ')';
      cards[i].style.zIndex = String(z);
    }
  },

  _renderLearnDeckState: function() {
    var els = Lessons._learnDeckElements();
    if (!els || !els.track) return;
    var state = Lessons.learnDeckState;
    var cards = Lessons._getLearnDeckCards();
    if (!cards.length) return;

    if (state.activeIndex < 0) state.activeIndex = 0;
    if (state.activeIndex >= cards.length) state.activeIndex = cards.length - 1;

    var isAtStart = state.activeIndex === 0;
    var isAtEnd = state.activeIndex === (cards.length - 1);
    try {
      els.deck.classList.toggle('is-at-start', isAtStart);
      els.deck.classList.toggle('is-at-end', isAtEnd);
      if (els.progressHost) {
        els.progressHost.classList.toggle('is-at-start', isAtStart);
        els.progressHost.classList.toggle('is-at-end', isAtEnd);
      }
    } catch (eDeckState) {}
    if (els.prevBtn) els.prevBtn.classList.toggle('is-endpoint-fade', isAtStart);
    if (els.nextBtn) els.nextBtn.classList.toggle('is-endpoint-fade', isAtEnd);

    els.track.style.transform = 'translateX(-' + (state.activeIndex * 100) + '%)';

    for (var i = 0; i < cards.length; i++) {
      var isActive = i === state.activeIndex;
      var delta = Lessons._learnWrappedDelta(i, state.activeIndex, cards.length);
      cards[i].classList.toggle('is-active', isActive);
      cards[i].classList.toggle('is-stack-prev', delta === -1);
      cards[i].classList.toggle('is-stack-next', delta === 1);
      cards[i].classList.toggle('is-stack-far', Math.abs(delta) >= 2);
      cards[i].classList.toggle('is-stack-peek', !isActive && delta === state.peekDirection);
      cards[i].classList.toggle('is-stack-muted', !isActive && delta !== state.peekDirection);
      cards[i].setAttribute('aria-hidden', isActive ? 'false' : 'true');
      cards[i].setAttribute('tabindex', isActive ? '0' : '-1');
    }

    if (els.dots) {
      var dotNodes = els.dots.querySelectorAll('.deck-dot');
      for (var d = 0; d < dotNodes.length; d++) {
        var dotIndex = parseInt(dotNodes[d].getAttribute('data-index'), 10);
        var isDotActive = isFinite(dotIndex) ? (dotIndex === state.activeIndex) : (d === state.activeIndex);
        dotNodes[d].classList.toggle('is-active', isDotActive);
        dotNodes[d].setAttribute('aria-pressed', isDotActive ? 'true' : 'false');
        if (isDotActive) dotNodes[d].setAttribute('aria-current', 'true');
        else dotNodes[d].removeAttribute('aria-current');
      }
    }

    var activeCard = cards[state.activeIndex];
    var lessonId = activeCard ? activeCard.getAttribute('data-lesson-id') : null;
    var isLocked = activeCard && activeCard.getAttribute('data-locked') === '1';
    var kind = activeCard ? (activeCard.getAttribute('data-kind') || 'lesson') : 'lesson';
    var isMoreCard = kind === 'more';
    var status = activeCard ? (activeCard.getAttribute('data-status') || '') : '';
    var isCurrentCard = !!(activeCard && activeCard.classList && activeCard.classList.contains('learn-deck-card--current'));

    if (els.startBtn) {
      var enEl = els.startBtn.querySelector('.btn-label-en');
      var paEl = els.startBtn.querySelector('.btn-label-pa');
      if (isMoreCard) {
        if (enEl) enEl.textContent = 'More ahead';
        if (paEl) paEl.textContent = 'ਹੋਰ ਆ ਰਿਹਾ ਹੈ';
      } else if (isLocked) {
        if (enEl) enEl.textContent = 'Locked';
        if (paEl) paEl.textContent = 'ਲਾਕ';
      } else if (status === 'Done') {
        if (enEl) enEl.textContent = 'Review Lesson';
        if (paEl) paEl.textContent = 'ਪਾਠ ਦੁਹਰਾਓ';
      } else {
        if (enEl) enEl.textContent = 'Start Lesson';
        if (paEl) paEl.textContent = 'ਪਾਠ ਸ਼ੁਰੂ ਕਰੋ';
      }
      els.startBtn.disabled = !!isLocked || !lessonId || isMoreCard;
      els.startBtn.setAttribute('aria-disabled', els.startBtn.disabled ? 'true' : 'false');
      els.startBtn.classList.toggle('is-current-target', isCurrentCard && !els.startBtn.disabled);
    }

    if (els.progressText) {
      var totalLessons = (state.ordered && state.ordered.length) ? state.ordered.length : cards.length;
      var activeLessonNumber = 1;
      if (activeCard) {
        var activeIndexRaw = Number(activeCard.getAttribute('data-index'));
        if (isFinite(activeIndexRaw)) activeLessonNumber = Math.max(1, Math.min(totalLessons, Math.floor(activeIndexRaw) + 1));
      }
      els.progressText.textContent = activeLessonNumber + '/' + totalLessons;
    }

    Lessons._syncLearnDeckCardHeights();

    try {
      els.deck.style.setProperty('--active-module-accent-rgb', '33, 125, 255');
    } catch (e) {}

    Lessons._applyLearnDeckLook(0);
  },

  _syncLearnDeckCardHeights: function() {
    var cards = Lessons._getLearnDeckCards();
    if (!cards || !cards.length) return;

    var maxHeight = 0;
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.minHeight = '';
    }

    for (var j = 0; j < cards.length; j++) {
      var h = 0;
      try { h = cards[j].offsetHeight || 0; } catch (eHeight) { h = 0; }
      if (h > maxHeight) maxHeight = h;
    }

    if (!(maxHeight > 0)) return;
    for (var k = 0; k < cards.length; k++) {
      cards[k].style.minHeight = maxHeight + 'px';
    }
  },

  _goToLearnDeckIndex: function(index, interacted, directionHint) {
    var cards = Lessons._getLearnDeckCards();
    if (!cards.length) return;
    var state = Lessons.learnDeckState;
    var next = index;
    while (next < 0) next += cards.length;
    next = next % cards.length;

    var direction = 0;
    if (typeof directionHint === 'number' && directionHint !== 0) {
      direction = directionHint > 0 ? 1 : -1;
      state.peekDirection = direction;
    } else {
      var toward = Lessons._learnWrappedDelta(next, state.activeIndex, cards.length);
      if (toward !== 0) {
        direction = toward > 0 ? 1 : -1;
        state.peekDirection = direction;
      }
    }

    try {
      var learnDeck = document.getElementById('learnSwipeDeck');
      var learnProgressHost = document.querySelector('#screen-learn .learn-hero-progress');
      var host = learnProgressHost || learnDeck;
      if (host && direction) {
        if (typeof nudgeCounterIndicator === 'function') {
          nudgeCounterIndicator(host, direction);
        } else {
          var cls = direction > 0 ? 'indicator-shift-next' : 'indicator-shift-prev';
          host.classList.remove('indicator-shift-next', 'indicator-shift-prev');
          void host.offsetWidth;
          host.classList.add(cls);
          window.setTimeout(function() {
            try { host.classList.remove(cls); } catch (eLearnNudgeRemove) {}
          }, 220);
        }
      }
    } catch (eLearnNudge) {}

    state.activeIndex = next;
    Lessons._renderLearnDeckState();
    if (interacted) Lessons._markLearnDeckHintSeen();
  },

  _goLearnDeckNext: function(interacted) {
    Lessons._goToLearnDeckIndex(Lessons.learnDeckState.activeIndex + 1, interacted, 1);
  },

  _isLearnDeckControlTarget: function(evt) {
    var target = evt && evt.target;
    if (!target || !target.closest) return false;
    return !!target.closest('#btn-learn-prev-deck, #btn-learn-next-deck, #btn-learn-deck-start, .deck-dot');
  },

  _wireLearnDeckOnce: function() {
    var els = Lessons._learnDeckElements();
    if (!els || !els.deck || !els.viewport || !els.track) return;
    var state = Lessons.learnDeckState;
    if (state.isBound) return;

    try {
      state.reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      state.reduceMotion = false;
    }
    if (state.reduceMotion) {
      try { els.track.style.transition = 'none'; } catch (e2) {}
    }

    if (els.dots) {
      UI.bindOnce(els.dots, 'learnDeckDotsBound', 'click', function(evt) {
        var t = evt && evt.target;
        var dot = t && t.closest ? t.closest('.deck-dot[data-index]') : null;
        if (!dot) return;
        var idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isFinite(idx)) return;
        Lessons._goToLearnDeckIndex(idx, true);
      });
    }

    UI.bindOnce(els.track, 'learnDeckTrackClickBound', 'click', function(evt) {
      var t = evt && evt.target;
      var card = t && t.closest ? t.closest('.deck-card[data-index]') : null;
      if (!card) return;
      if (Date.now() < state.suppressCardClickUntil) return;
      var idx = parseInt(card.getAttribute('data-index'), 10);
      if (!isFinite(idx)) return;
      Lessons._goToLearnDeckIndex(idx, true);
    });

    UI.bindOnce(els.nextBtn, 'learnDeckNextBound', 'click', function() {
      Lessons._goLearnDeckNext(true);
    });

    UI.bindOnce(els.prevBtn, 'learnDeckPrevBound', 'click', function() {
      Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
    });

    UI.bindOnce(els.startBtn, 'learnDeckStartBound', 'click', function() {
      var cards = Lessons._getLearnDeckCards();
      var active = cards[state.activeIndex];
      if (!active) return;
      var locked = active.getAttribute('data-locked') === '1';
      if (locked) return;
      var lessonId = active.getAttribute('data-lesson-id');
      if (lessonId) Lessons.startLesson(lessonId);
    });

    UI.bindOnce(els.deck, 'learnDeckKeyBound', 'keydown', function(evt) {
      var key = evt && evt.key;
      if (key === 'ArrowRight') {
        evt.preventDefault();
        Lessons._goLearnDeckNext(true);
      } else if (key === 'ArrowLeft') {
        evt.preventDefault();
        Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
      }
    });

    function stopTouchDrag(commit, fallbackDeltaX) {
      if (state.touchStartX == null) return;
      var deltaX = (typeof fallbackDeltaX === 'number' && isFinite(fallbackDeltaX))
        ? fallbackDeltaX
        : ((state.touchCurrentX == null || state.touchStartX == null) ? 0 : (state.touchCurrentX - state.touchStartX));
      var threshold = (typeof getDeckSwipeThresholdPx === 'function')
        ? getDeckSwipeThresholdPx(els.viewport)
        : Math.max(36, Math.round(((els.viewport && els.viewport.clientWidth) ? els.viewport.clientWidth : 0) * 0.18));

      state.touchStartX = null;
      state.touchStartY = null;
      state.touchCurrentX = null;

      if (!state.touchDragging) return;
      state.touchDragging = false;

      if (!state.reduceMotion) {
        try { els.track.style.transition = (typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.swipeSnapTransition) ? BOLO_DECK_UX.swipeSnapTransition : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)'; } catch (eTrackTransition) {}
      }

      if (!commit) {
        Lessons._renderLearnDeckState();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.suppressClickMs) ? BOLO_DECK_UX.suppressClickMs : 260);
        if (deltaX > 0) Lessons._goLearnDeckNext(true);
        else Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
        return;
      }

      Lessons._renderLearnDeckState();
    }

    UI.bindOnce(els.viewport, 'learnDeckTouchStartBound', 'touchstart', function(evt) {
      if (Lessons._isLearnDeckControlTarget(evt)) {
        state.touchStartX = null;
        state.touchStartY = null;
        state.touchCurrentX = null;
        state.touchDragging = false;
        state.touchMoved = false;
        return;
      }
      if (!evt.touches || !evt.touches.length) return;
      state.touchStartX = evt.touches[0].clientX;
      state.touchStartY = evt.touches[0].clientY;
      state.touchCurrentX = state.touchStartX;
      state.touchDragging = true;
      state.touchMoved = false;
    });

    UI.bindOnce(els.viewport, 'learnDeckTouchMoveBound', 'touchmove', function(evt) {
      if (!state.touchDragging || state.touchStartX == null || !evt.touches || !evt.touches.length) return;
      var touch = evt.touches[0];
      state.touchCurrentX = touch.clientX;
      var currentY = touch.clientY;
      var deltaX = state.touchCurrentX - state.touchStartX;
      var deltaY = (state.touchStartY == null) ? 0 : (currentY - state.touchStartY);

      if (!state.touchMoved) {
        var horizontalIntent = (typeof hasDeckHorizontalIntent === 'function')
          ? hasDeckHorizontalIntent(deltaX, deltaY)
          : (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1);
        if (!horizontalIntent) return;
        state.touchMoved = true;
        if (!state.reduceMotion) {
          try { els.track.style.transition = 'none'; } catch (eTouchMoveTransition) {}
        }
      }

      var width = els.viewport && els.viewport.clientWidth ? els.viewport.clientWidth : 0;
      var basePx = state.activeIndex * width;
      var targetPx = -basePx + deltaX;
      els.track.style.transform = 'translateX(' + targetPx + 'px)';
      if (width > 0) {
        if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
        Lessons._applyLearnDeckLook(deltaX / width);
      }
      try { evt.preventDefault(); } catch (eTouchPrevent) {}
    }, { passive: false });

    UI.bindOnce(els.viewport, 'learnDeckTouchEndBound', 'touchend', function(evt) {
      if (state.touchStartX == null) return;
      var touch = (evt.changedTouches && evt.changedTouches[0]) ? evt.changedTouches[0] : null;
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
      if (deltaX > 0) Lessons._goLearnDeckNext(true);
      else Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
    });

    UI.bindOnce(els.viewport, 'learnDeckTouchCancelBound', 'touchcancel', function() {
      stopTouchDrag(false, 0);
    });

    function stopPointerDrag(commit) {
      if (!state.pointerDragging) return;
      var width = els.viewport && els.viewport.clientWidth ? els.viewport.clientWidth : 0;
      var deltaX = (state.pointerCurrentX == null || state.pointerStartX == null) ? 0 : (state.pointerCurrentX - state.pointerStartX);
      var threshold = (typeof getDeckSwipeThresholdPx === 'function')
        ? getDeckSwipeThresholdPx(els.viewport)
        : Math.max(36, Math.round(width * 0.18));

      state.pointerDragging = false;
      state.pointerStartX = null;
      state.pointerCurrentX = null;
      state.pointerId = null;

      if (!state.reduceMotion) {
        try { els.track.style.transition = (typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.pointerSnapTransition) ? BOLO_DECK_UX.pointerSnapTransition : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)'; } catch (eTrackTransition2) {}
      }

      if (!commit) {
        Lessons._renderLearnDeckState();
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.suppressClickMs) ? BOLO_DECK_UX.suppressClickMs : 260);
        if (deltaX > 0) Lessons._goLearnDeckNext(true);
        else Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
        return;
      }

      Lessons._renderLearnDeckState();
    }

    UI.bindOnce(els.viewport, 'learnDeckPointerDownBound', 'pointerdown', function(evt) {
      if (!evt || evt.pointerType === 'touch') return;
      if (evt.button != null && evt.button !== 0) return;
      if (Lessons._isLearnDeckControlTarget(evt)) return;

      state.pointerId = evt.pointerId;
      state.pointerStartX = evt.clientX;
      state.pointerCurrentX = evt.clientX;
      state.pointerDragging = true;
      state.pointerMoved = false;

      try { els.viewport.setPointerCapture(state.pointerId); } catch (eCapture) {}
      if (!state.reduceMotion) {
        try { els.track.style.transition = 'none'; } catch (eTrackTransition3) {}
      }
    });

    UI.bindOnce(els.viewport, 'learnDeckPointerMoveBound', 'pointermove', function(evt) {
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;

      state.pointerCurrentX = evt.clientX;
      var deltaX = state.pointerCurrentX - state.pointerStartX;
      if (Math.abs(deltaX) > 3) state.pointerMoved = true;

      if (state.pointerMoved) {
        var width = els.viewport && els.viewport.clientWidth ? els.viewport.clientWidth : 0;
        var basePx = state.activeIndex * width;
        var targetPx = -basePx + deltaX;
        els.track.style.transform = 'translateX(' + targetPx + 'px)';
        if (width > 0) {
          if (deltaX !== 0) state.peekDirection = deltaX > 0 ? 1 : -1;
          Lessons._applyLearnDeckLook(deltaX / width);
        }
        try { evt.preventDefault(); } catch (ePrevent) {}
      }
    });

    UI.bindOnce(els.viewport, 'learnDeckPointerUpBound', 'pointerup', function(evt) {
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
      stopPointerDrag(true);
    });

    UI.bindOnce(els.viewport, 'learnDeckPointerCancelBound', 'pointercancel', function(evt) {
      if (!state.pointerDragging) return;
      if (state.pointerId != null && evt.pointerId !== state.pointerId) return;
      stopPointerDrag(false);
    });

    UI.bindOnce(els.viewport, 'learnDeckPointerLeaveBound', 'pointerleave', function() {
      if (!state.pointerDragging) return;
      stopPointerDrag(true);
    });

    UI.bindOnce(els.viewport, 'learnDeckWheelBound', 'wheel', function(evt) {
      if (!evt || Lessons._isLearnDeckControlTarget(evt)) return;

      var dx = (typeof evt.deltaX === 'number' && isFinite(evt.deltaX)) ? evt.deltaX : 0;
      var dy = (typeof evt.deltaY === 'number' && isFinite(evt.deltaY)) ? evt.deltaY : 0;
      if (Math.abs(dx) < 1 && evt.shiftKey) dx = dy;

      var absX = Math.abs(dx);
      var absY = Math.abs(dy);
      var horizontalIntent = absX > 6 && absX >= (absY * 0.85);
      if (!horizontalIntent) return;

      var now = Date.now();
      if (now - state.wheelLastTs > ((typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.wheelResetMs) ? BOLO_DECK_UX.wheelResetMs : 280)) state.wheelAccumX = 0;
      state.wheelLastTs = now;
      state.wheelAccumX += dx;

      try { evt.preventDefault(); } catch (eWheelPrevent) {}

      if (Math.abs(state.wheelAccumX) < ((typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.wheelTriggerPx) ? BOLO_DECK_UX.wheelTriggerPx : 54)) return;
      state.suppressCardClickUntil = Date.now() + ((typeof BOLO_DECK_UX !== 'undefined' && BOLO_DECK_UX.suppressWheelClickMs) ? BOLO_DECK_UX.suppressWheelClickMs : 180);
      if (state.wheelAccumX > 0) Lessons._goLearnDeckNext(true);
      else Lessons._goToLearnDeckIndex(state.activeIndex - 1, true, -1);
      state.wheelAccumX = 0;
    });

    if (els.hint) {
      var seenHint = false;
      try { seenHint = localStorage.getItem('learnDeckHintSeen_v1') === '1'; } catch (eHint) { seenHint = false; }
      if (seenHint || state.reduceMotion) els.hint.style.display = 'none';
    }

    state.isBound = true;
  },

  _getOnePathLessonOrder: function() {
    var out = [];
    var seenId = {};
    var seenTopic = {};
    var trackRank = {
      T_WORDS: 1,
      T_ACTIONS: 2,
      T_DESCRIBE: 3,
      T_SENTENCE: 4,
      T_READING: 5
    };

    for (var i = 0; i < LESSON_META.length; i++) {
      var meta = LESSON_META[i];
      if (!meta || !meta.id) continue;
      var canonicalId = Lessons.resolveCanonicalLessonId(meta.id);
      if (!Lessons.isLearnVisibleLessonId(canonicalId)) continue;
      if (seenId[canonicalId]) continue;

      var topicKey = Lessons.normalizeTopicKey(meta.labelEn || canonicalId);
      if (topicKey && seenTopic[topicKey]) continue;

      var item = meta;
      if (canonicalId !== meta.id) {
        item = {
          id: canonicalId,
          labelEn: meta.labelEn,
          labelPa: meta.labelPa,
          trackId: meta.trackId,
          difficulty: meta.difficulty,
          order: meta.order
        };
      }

      seenId[canonicalId] = true;
      if (topicKey) seenTopic[topicKey] = true;
      out.push(item);
    }

    out.sort(function(a, b) {
      var aHasOrder = typeof a.order === 'number';
      var bHasOrder = typeof b.order === 'number';
      if (aHasOrder && bHasOrder && a.order !== b.order) return a.order - b.order;
      if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;

      var aTrack = trackRank[a.trackId] || 99;
      var bTrack = trackRank[b.trackId] || 99;
      if (aTrack !== bTrack) return aTrack - bTrack;

      var aDiff = (typeof a.difficulty === 'number') ? a.difficulty : 99;
      var bDiff = (typeof b.difficulty === 'number') ? b.difficulty : 99;
      if (aDiff !== bDiff) return aDiff - bDiff;

      return (a.labelEn || a.id || '').localeCompare(b.labelEn || b.id || '');
    });

    return out;
  },

  _getOnePathUnlockIndex: function(ordered) {
    var list = Array.isArray(ordered) ? ordered : [];
    if (!list.length) return 0;

    for (var i = 0; i < list.length; i++) {
      var item = list[i] || {};
      var lessonId = item.id;
      if (Lessons.getLessonStatus(lessonId) !== 'Done') {
        return i;
      }
    }

    return list.length - 1;
  },

  _renderOnePathLearnView: function() {
    var els = Lessons._learnDeckElements();
    if (!els || !els.track) return;

    var ordered = Lessons._getOnePathLessonOrder();
    var unlockIndex = Lessons._getOnePathUnlockIndex(ordered);
    Lessons.learnDeckState.ordered = ordered;
    Lessons.learnDeckState.unlockIndex = unlockIndex;

    var futurePreviewCap = 1;
    var maxLessonCardIndex = Math.min(ordered.length - 1, unlockIndex + futurePreviewCap);
    var hasMoreBeyondPreview = maxLessonCardIndex < (ordered.length - 1);

    var html = '';
    for (var i = 0; i <= maxLessonCardIndex; i++) {
      var meta = ordered[i];
      var status = Lessons.getLessonStatus(meta.id);
      var isUnlocked = i <= unlockIndex;
      var isLocked = !isUnlocked;
      var isCurrent = (i === unlockIndex) && !isLocked && status !== 'Done';
      var isCompleted = status === 'Done';
      var titleEn = (meta.labelEn || meta.id || 'Lesson');
      var titlePa = (meta.labelPa || 'ਪਾਠ');
      var statusText = isLocked ? 'Locked' : status;
      var statusTextPa = isLocked ? 'ਲਾਕ' : (status === 'Done' ? 'ਮੁਕੰਮਲ' : (status === 'In progress' ? 'ਜਾਰੀ' : 'ਸ਼ੁਰੂ ਨਹੀਂ ਕੀਤਾ'));
      var badgeText = isLocked ? 'Locked' : (isCurrent ? 'Now' : (isCompleted ? 'Done' : 'Now'));
      var badgeTextPa = isLocked ? 'ਲਾਕ' : (isCurrent ? 'ਹੁਣ' : (isCompleted ? 'ਮੁਕੰਮਲ' : 'ਹੁਣ'));

      var variantClass = 'learn-deck-card--open';
      if (isLocked) variantClass = 'learn-deck-card--locked';
      else if (isCurrent) variantClass = 'learn-deck-card--current';
      else if (isCompleted) variantClass = 'learn-deck-card--completed';

      html += '<article class="deck-card module-card deck-card--learn ' + variantClass + (i === Lessons.learnDeckState.activeIndex ? ' is-active' : '') + (isLocked ? ' is-locked' : '') + '"';
      html += ' data-kind="lesson" data-status="' + Lessons.escapeHtml(status) + '" data-index="' + i + '" data-lesson-id="' + Lessons.escapeHtml(meta.id) + '" data-locked="' + (isLocked ? '1' : '0') + '"';
      html += ' aria-label="' + Lessons.escapeHtml((i + 1) + '. ' + titleEn + ' (' + statusText + ')') + '">';
      html += '  <div class="deck-card-kicker">Lesson ' + (i + 1) + '</div>';
      html += '  <div class="deck-card-title">' + Lessons.escapeHtml(titleEn) + '</div>';
      html += '  <div class="deck-card-subtitle" lang="pa">' + Lessons.escapeHtml(titlePa) + '</div>';
      html += '  <div class="learn-deck-badges">';
      html += '    <span class="learn-deck-badge">' + Lessons.escapeHtml(badgeText) + '</span>';
      html += '    <span class="learn-deck-badge learn-deck-badge-pa" lang="pa">' + Lessons.escapeHtml(badgeTextPa) + '</span>';
      html += '  </div>';
      html += '  <div class="learn-deck-meta">';
      html += '    <span class="learn-deck-status">' + Lessons.escapeHtml(statusText) + '</span>';
      html += '    <span class="learn-deck-status-pa" lang="pa">' + Lessons.escapeHtml(statusTextPa) + '</span>';
      html += '  </div>';
      if (isLocked) {
        html += '  <div class="learn-deck-lock-reason">Complete previous lesson to unlock</div>';
        html += '  <div class="learn-deck-lock-reason-pa" lang="pa">ਪਿਛਲਾ ਪਾਠ ਮੁਕੰਮਲ ਕਰੋ ਤਾਂ ਖੁੱਲੇਗਾ</div>';
      }
      html += '</article>';
    }

    if (hasMoreBeyondPreview) {
      var moreIndex = maxLessonCardIndex + 1;
      var remaining = (ordered.length - 1) - maxLessonCardIndex;
      html += '<article class="deck-card module-card deck-card--learn learn-deck-card--more" data-kind="more" data-status="More" data-index="' + moreIndex + '" data-locked="1" aria-label="More lessons ahead">';
      html += '  <div class="deck-card-kicker">More</div>';
      html += '  <div class="deck-card-title">More Lessons Ahead</div>';
      html += '  <div class="deck-card-subtitle" lang="pa">ਹੋਰ ਪਾਠ ਅੱਗੇ ਹਨ</div>';
      html += '  <div class="learn-deck-badges">';
      html += '    <span class="learn-deck-badge">More</span>';
      html += '    <span class="learn-deck-badge learn-deck-badge-pa" lang="pa">ਹੋਰ</span>';
      html += '  </div>';
      html += '  <div class="learn-deck-meta">';
      html += '    <span class="learn-deck-status">+' + remaining + ' lessons ahead</span>';
      html += '    <span class="learn-deck-status-pa" lang="pa">ਮੌਜੂਦਾ ਪਾਠ ਮੁਕੰਮਲ ਕਰੋ</span>';
      html += '  </div>';
      html += '</article>';
    }

    els.track.innerHTML = html;

    if (els.dots) {
      var dotsHtml = '';
      var totalCards = maxLessonCardIndex + 1 + (hasMoreBeyondPreview ? 1 : 0);
      var maxVisibleDots = 8;
      var visibleDots = Math.min(totalCards, maxVisibleDots);
      var dotStart = 0;
      if (totalCards > visibleDots) {
        dotStart = Lessons.learnDeckState.activeIndex - Math.floor(visibleDots / 2);
        if (dotStart < 0) dotStart = 0;
        if (dotStart > (totalCards - visibleDots)) dotStart = totalCards - visibleDots;
      }
      for (var d = 0; d < visibleDots; d++) {
        var actualIndex = dotStart + d;
        dotsHtml += '<button type="button" class="deck-dot" data-index="' + actualIndex + '" aria-label="Go to lesson ' + (actualIndex + 1) + '"></button>';
      }
      els.dots.innerHTML = dotsHtml;
    }

    var renderedCards = maxLessonCardIndex + 1 + (hasMoreBeyondPreview ? 1 : 0);
    if (Lessons.learnDeckState.activeIndex >= renderedCards) Lessons.learnDeckState.activeIndex = Math.max(0, renderedCards - 1);
    Lessons._wireLearnDeckOnce();
    Lessons._renderLearnDeckState();
  },

  renderLearnSections: function() {
    Lessons._renderOnePathLearnView();
  },

  // Update progress summary cards
  updateProgressSummary: function() {
    var totalEl = document.getElementById("total-lessons");
    var completedEl = document.getElementById("completed-lessons");
    var progressEl = document.getElementById("progress-lessons");
    var xpEl = document.getElementById("total-xp");
    
    if (!totalEl) return;

    var orderedForSummary = Lessons._getOnePathLessonOrder();
    var total = orderedForSummary.length;
    var completed = 0;
    var inProgress = 0;
    
    totalEl.textContent = total;
    completedEl.textContent = completed;
    progressEl.textContent = inProgress;
  },

  // Get lessons by track ID
  getLessonsByTrack: function(trackId) {
    var arr = [];
    for (var i = 0; i < LESSON_META.length; i++) {
      var meta = LESSON_META[i];
      if (!meta || !meta.id) continue;
      if (!Lessons.isLearnVisibleLessonId(meta.id)) continue;
      if (meta.trackId === trackId) {
        arr.push(meta);
      }
    }
    return arr;
  },

  // Get lesson status
  getLessonStatus: function(lessonId) {
    var canonicalId = Lessons.resolveCanonicalLessonId(lessonId);
    if (!canonicalId) return 'Not started';

    if (typeof State !== 'undefined' && State && typeof State.ensureTracksInitialized === 'function') {
      State.ensureTracksInitialized();
    }

    var progress = (typeof State !== 'undefined' && State && State.state && State.state.progress) ? State.state.progress : null;
    var session = (typeof State !== 'undefined' && State && State.state && State.state.session) ? State.state.session : null;

    var doneMap = progress && progress.lessonDone && typeof progress.lessonDone === 'object' ? progress.lessonDone : {};
    if (doneMap[canonicalId] === true) return 'Done';

    var persistentProgressMap = progress && progress.lessonProgress && typeof progress.lessonProgress === 'object'
      ? progress.lessonProgress
      : {};
    var persistentEntry = persistentProgressMap[canonicalId];
    if (persistentEntry && typeof persistentEntry === 'object') {
      if ((persistentEntry.stepsCompleted | 0) > 0) return 'In progress';
      if (persistentEntry.started === true) return 'In progress';
    }

    var sessionProgressMap = session && session.lessonProgress && typeof session.lessonProgress === 'object'
      ? session.lessonProgress
      : {};
    var sessionEntry = sessionProgressMap[canonicalId];
    if (sessionEntry && typeof sessionEntry === 'object') {
      if ((sessionEntry.stepsCompleted | 0) > 0) return 'In progress';
      if ((sessionEntry.pointsEarned | 0) > 0) return 'In progress';
      if (sessionEntry.started === true) return 'In progress';

      var resolved = sessionEntry.stepResolved;
      if (resolved && typeof resolved === 'object') {
        for (var key in resolved) {
          if (!Object.prototype.hasOwnProperty.call(resolved, key)) continue;
          if (resolved[key]) return 'In progress';
        }
      }
    }

    return 'Not started';
  },

  // Find lesson metadata by ID
  findLessonMeta: function(lessonId) {
    lessonId = Lessons.resolveCanonicalLessonId(lessonId);
    for (var i = 0; i < LESSON_META.length; i++) {
      if (LESSON_META[i].id === lessonId) return LESSON_META[i];
    }
    return null;
  },

  // Start a lesson
  startLesson: function(lessonId) {
    lessonId = Lessons.resolveCanonicalLessonId(lessonId);
    var meta = Lessons.findLessonMeta(lessonId);
    if (!meta) {
      alert("Lesson not found.");
      return;
    }

    // Record recent lesson
    try {
      Lessons._pushRecentLesson(lessonId);
    } catch (e) {}

    LearnQA.logLessonLaunch(lessonId, meta.trackId);

    // Reset session-only attempts when starting a lesson
    Lessons.resetRuntime(lessonId);

    Lessons.currentLessonId = lessonId;
    Lessons.currentLessonTrackId = meta.trackId;
    
    var baseSteps = Lessons.getPlayableSteps(lessonId);

    // Inject up to N due review items while keeping the existing linear flow.
    var injected = [];
    try {
      var due = Lessons.getDueReviewItems(3);
      injected = Lessons.buildInjectedReviewSteps(due);
    } catch (e) {
      injected = [];
    }

    if (injected.length && baseSteps.length) {
      Lessons.currentLessonSteps = injected.concat(baseSteps);
    } else {
      Lessons.currentLessonSteps = baseSteps;
    }
    
    if (!Lessons.currentLessonSteps.length) {
      alert("Content coming soon.");
      return;
    }

    // Start directly on first playable lesson step
    Lessons.initLesson(lessonId);
    Lessons.renderLessonHeader(meta);
    Lessons.currentStepIndex = 0;
    Lessons.renderLessonStep();
    UI.goTo("screen-lesson");

    State.state.session.currentLessonId = lessonId;
    State.state.session.currentLessonStep = Lessons.currentStepIndex;

    if (State.state.progress && typeof State.state.progress === 'object') {
      if (!State.state.progress.lessonProgress || typeof State.state.progress.lessonProgress !== 'object') {
        State.state.progress.lessonProgress = {};
      }
      var persisted = State.state.progress.lessonProgress[lessonId];
      if (!persisted || typeof persisted !== 'object') persisted = {};
      if (typeof persisted.stepsCompleted !== 'number' || !isFinite(persisted.stepsCompleted)) persisted.stepsCompleted = 0;
      persisted.started = true;
      persisted.lastStartedAt = Date.now();
      State.state.progress.lessonProgress[lessonId] = persisted;
    }

    State.save(); // ✅ Persist lesson start position
  },

  // Open lesson (alias for startLesson)
  openLesson: function(lessonId) {
    Lessons.startLesson(lessonId);
  },

  // Render lesson header
  renderLessonHeader: function(meta) {
    var lessonTitleEl = document.getElementById("lesson-title");
    if (lessonTitleEl) lessonTitleEl.textContent = meta.labelEn;
    
    var lessonTitlePaEl = document.getElementById("lesson-title-pa");
    if (lessonTitlePaEl) {
      lessonTitlePaEl.textContent = "";
    }
  },

  // Get step type label (enhanced for new types)
  getStepTypeLabel: function(step) {
    if (step && step.isReview === true) return "Review / ਦੁਹਰਾਈ";
    var type = step.type || step.step_type;
    if (type === "definition") return "Definition / ਪਰਿਭਾਸ਼ਾ";
    if (type === "example") return "Example / ਉਦਾਹਰਨ";
    if (type === "guided_practice") return "Practice / ਅਭਿਆਸ";
    if (type === "question") return "Question / ਪ੍ਰਸ਼ਨ";
    if (type === "summary") return "Summary / ਸਾਰਾਂਸ਼";
    return "";
  },

  // Render current lesson step (enhanced with new types and bilingual 50/50)
  renderLessonStep: function() {
    if (!Lessons.currentLessonSteps.length) return;
    if (Lessons.currentStepIndex < 0) Lessons.currentStepIndex = 0;
    if (Lessons.currentStepIndex >= Lessons.currentLessonSteps.length) {
      Lessons.currentStepIndex = Lessons.currentLessonSteps.length - 1;
    }

    State.state.session.currentLessonStep = Lessons.currentStepIndex;
    var step = Lessons.currentLessonSteps[Lessons.currentStepIndex];
    Lessons.inExamplesPhase = false;
    Lessons.currentExampleIndex = 0;
    
    Lessons.initLesson(Lessons.currentLessonId);
    var lessonProgress = State.state.session.lessonProgress[Lessons.currentLessonId] || {};
    var resolvedMap = lessonProgress.stepResolved || {};

    var lessonFeedbackEl = document.getElementById("lesson-feedback");
    if (lessonFeedbackEl) {
      lessonFeedbackEl.innerHTML = "";
      lessonFeedbackEl.className = "feedback";
    }

    var lessonOptionsEl = document.getElementById("lesson-options");
    if (lessonOptionsEl) lessonOptionsEl.innerHTML = "";

    var lessonStepTypeEl = document.getElementById("lesson-step-type");
    if (lessonStepTypeEl) {
      var full = Lessons.isFullLessonEnabled(Lessons.currentLessonId);
      if (Lessons.currentStepIndex === 0 || full) {
        lessonStepTypeEl.textContent = Lessons.getStepTypeLabel(step);
      } else {
        lessonStepTypeEl.textContent = "Coming Soon";
      }
    }

    var stepText = (Lessons.currentStepIndex + 1) + "/" + Lessons.currentLessonSteps.length;
    var lessonStepIndicatorEl = document.getElementById("lesson-step-indicator");
    if (lessonStepIndicatorEl) lessonStepIndicatorEl.textContent = stepText;

    var stepType = step.type || step.step_type;
    Lessons.syncHeroQuestionAction(Lessons.currentStepIndex, step);

    // Instruction line (always, consistent placement)
    var instructionEnText = '';
    var instructionPaText = '';
    try {
      var inst = Lessons.getInstructionForStep(step);
      var instEnEl = document.getElementById('lesson-instruction-en');
      var instPaEl = document.getElementById('lesson-instruction-pa');
      instructionEnText = (inst && inst.en) ? String(inst.en) : '';
      instructionPaText = (inst && inst.pa) ? String(inst.pa) : '';
      if (instEnEl) instEnEl.textContent = instructionEnText;
      if (instPaEl) {
        instPaEl.textContent = instructionPaText;
        var showPa = Lessons.shouldShowPunjabi();
        instPaEl.style.display = showPa ? '' : 'none';
      }
    } catch (e) {
      // no-op
    }

    var lessonSwipeDeckEl = document.getElementById('lessonSwipeDeck');
    var lessonInstructionEl = document.getElementById('lesson-instruction');
    var isQuestionLike = (stepType === 'question' || stepType === 'guided_practice');
    var isTwoChoiceQuestionStep = (stepType === 'question') && Lessons.isTwoOptionQuestionStep(step);
    if (lessonSwipeDeckEl) {
      lessonSwipeDeckEl.classList.toggle('is-question-step', isQuestionLike);
      lessonSwipeDeckEl.classList.toggle('is-two-choice-question-step', isTwoChoiceQuestionStep);
    }
    if (lessonInstructionEl) {
      lessonInstructionEl.classList.toggle('is-question-step', isQuestionLike);
      lessonInstructionEl.classList.toggle('is-empty', !instructionEnText.trim() && !instructionPaText.trim());
    }

    // Render bilingual content (50/50 equal height)
    var lessonTextEnEl = document.getElementById("lesson-text-en");
    var lessonTextPaEl = document.getElementById("lesson-text-pa");
    
    if (lessonTextEnEl && lessonTextPaEl) {
      // Let CSS control height so cards shrink to content
      lessonTextEnEl.style.minHeight = "";
      lessonTextPaEl.style.minHeight = "";
      lessonTextEnEl.style.height = "";
      lessonTextPaEl.style.height = "";

      var full = Lessons.isFullLessonEnabled(Lessons.currentLessonId);
      if (Lessons.currentStepIndex === 0 || full) {
        // For questions, show the question prompt in EN/PA boxes only
        // For definitions/examples, show their content
        var en, pa;
        if (stepType === "question") {
          en = step.englishText || step.english_text || step.promptEn || step.contentEn || "";
          pa = step.punjabiText || step.punjabi_text || step.promptPa || step.contentPa || "";
        } else {
          en = step.contentEn || step.exampleEn || step.englishText || step.english_text || "";
          pa = step.contentPa || step.examplePa || step.punjabiText || step.punjabi_text || "";
        }

        var shouldUsePromptCard = (stepType === 'question') && Lessons.isTwoOptionQuestionStep(step);
        if (shouldUsePromptCard) {
          lessonTextEnEl.innerHTML = Lessons.buildLessonPromptMarkup(en, pa, {
            kind: 'question'
          });
          lessonTextPaEl.innerHTML = '';
          lessonTextPaEl.style.display = 'none';
        } else {
          lessonTextEnEl.innerHTML = en;
          lessonTextPaEl.innerHTML = pa;
          lessonTextPaEl.style.display = '';
        }
      } else {
        lessonTextEnEl.innerHTML = "Coming Soon!";
        lessonTextPaEl.innerHTML = "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!";
        lessonTextPaEl.style.display = '';
      }
    }

    var nextBtn = document.getElementById("btn-lesson-next");
    var prevBtn = document.getElementById("btn-lesson-prev");

    if (Lessons._yesNoAutoAdvanceTimer) {
      clearTimeout(Lessons._yesNoAutoAdvanceTimer);
      Lessons._yesNoAutoAdvanceTimer = null;
    }
    
    if (prevBtn) {
      prevBtn.style.display = "block";
      prevBtn.disabled = !Lessons.canNavigateBack();
    }

    // Step-specific rendering
    // For steps beyond the first, show placeholder only if not enabled
    var fullEnabled = Lessons.isFullLessonEnabled(Lessons.currentLessonId);
    if (Lessons.currentStepIndex > 0 && !fullEnabled) {
      if (nextBtn) nextBtn.disabled = false;
      return;
    }
    
    switch(stepType) {
      case "definition":
        // Auto-award completion points
        Lessons.awardStepPoints(Lessons.currentStepIndex, step);
        Lessons.markStepResolved(Lessons.currentStepIndex, true);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      case "example":
        // Render example with auto-highlighted words
        Lessons.renderExampleStep(step);
        Lessons.markStepResolved(Lessons.currentStepIndex, true);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      case "guided_practice":
        Lessons.renderGuidedPracticeStep(step);
        if (!Lessons.isReviewMode() && !resolvedMap[Lessons.currentStepIndex]) {
          Lessons.markStepResolved(Lessons.currentStepIndex, false);
        }
        if (nextBtn) {
          if (Lessons.isReviewMode()) nextBtn.disabled = false;
          else nextBtn.disabled = !!resolvedMap[Lessons.currentStepIndex] ? false : true;
        }
        break;
        
      case "question":
        Lessons.renderQuestionStep(step);
        if (!Lessons.isReviewMode() && !resolvedMap[Lessons.currentStepIndex]) {
          Lessons.markStepResolved(Lessons.currentStepIndex, false);
        }
        if (nextBtn) {
          if (Lessons.isReviewMode()) nextBtn.disabled = false;
          else nextBtn.disabled = !!resolvedMap[Lessons.currentStepIndex] ? false : true;
        }
        break;
        
      case "summary":
        Lessons.renderSummaryStep(step);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      default:
        // Fallback for old format
        if (step.options && step.options.length) {
          Lessons.renderQuestionStep(step);
          if (!Lessons.isReviewMode() && !resolvedMap[Lessons.currentStepIndex]) {
            Lessons.markStepResolved(Lessons.currentStepIndex, false);
          }
          if (nextBtn) {
            if (Lessons.isReviewMode()) nextBtn.disabled = false;
            else nextBtn.disabled = !!resolvedMap[Lessons.currentStepIndex] ? false : true;
          }
        } else {
          Lessons.awardStepPoints(Lessons.currentStepIndex, step);
          Lessons.markStepResolved(Lessons.currentStepIndex, true);
          if (nextBtn) nextBtn.disabled = false;
        }
    }

    Lessons.animateLessonCard();
    Lessons.renderSwipeProgress();
    State.save();
  },

  // Render question step
  renderQuestionStep: function(step) {
    if (Lessons.currentStepIndex > 0 && !Lessons.isFullLessonEnabled(Lessons.currentLessonId)) {
      var lessonOptionsElPlaceholder = document.getElementById("lesson-options");
      if (lessonOptionsElPlaceholder) {
        lessonOptionsElPlaceholder.innerHTML = "<div class='lesson-text-en'>Coming Soon!</div><div class='lesson-text-pa' lang='pa'>ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!</div>";
      }
      return;
    }
    var lessonOptionsEl = document.getElementById("lesson-options");
    if (!lessonOptionsEl) return;

    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    if (!Lessons.runtime.selectedAnswerByStepKey || typeof Lessons.runtime.selectedAnswerByStepKey !== 'object') {
      Lessons.runtime.selectedAnswerByStepKey = {};
    }
    if (!Lessons.runtime.submittedAnswerByStepKey || typeof Lessons.runtime.submittedAnswerByStepKey !== 'object') {
      Lessons.runtime.submittedAnswerByStepKey = {};
    }

    lessonOptionsEl.innerHTML = '';
    
    Lessons.inExamplesPhase = false;
    Lessons.currentExampleIndex = 0;

    var stepIndex = Lessons.currentStepIndex;
    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    var selectedAnswer = Lessons.runtime.selectedAnswerByStepKey[stepKey] || '';
    var submittedAnswer = Lessons.runtime.submittedAnswerByStepKey[stepKey] || '';
    var options = step.options || [];
    var isTwoOptionQuestion = Lessons.isTwoOptionQuestionStep(step);
    var optionsWrap = document.createElement('div');
    optionsWrap.className = 'lesson-question-options lesson-question-options--cards';
    if (isTwoOptionQuestion) {
      optionsWrap.classList.add('is-two-option-question');
    }

    for (var i = 0; i < options.length; i++) {
      (function(opt, optionIndex) {
        var optionText = Lessons.getQuestionOptionText(opt);
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary lesson-option-btn";
        btn.type = 'button';
        btn.setAttribute('data-option', optionText.en);
        btn.setAttribute('data-option-index', String(optionIndex));
        btn.setAttribute('aria-pressed', 'false');

        var chip = document.createElement('span');
        chip.className = 'lesson-option-chip';
        chip.setAttribute('aria-hidden', 'true');
        chip.textContent = String.fromCharCode(65 + (optionIndex % 26));

        var textWrap = document.createElement('span');
        textWrap.className = 'lesson-option-text';

        var enLine = document.createElement('span');
        enLine.className = 'lesson-option-line-en';
        enLine.textContent = optionText.en;
        textWrap.appendChild(enLine);

        if (Lessons.shouldShowPunjabi() && optionText.pa) {
          var paLine = document.createElement('span');
          paLine.className = 'lesson-option-line-pa';
          paLine.setAttribute('lang', 'pa');
          paLine.textContent = optionText.pa;
          textWrap.appendChild(paLine);
        }

        btn.appendChild(chip);
        btn.appendChild(textWrap);

        var stateBadge = document.createElement('span');
        stateBadge.className = 'lesson-option-state';
        stateBadge.setAttribute('aria-hidden', 'true');
        btn.appendChild(stateBadge);

        btn.addEventListener("click", function() {
          Lessons.selectQuestionOption(optionText.en, stepIndex, step);
        });
        optionsWrap.appendChild(btn);
      })(options[i], i);
    }

    lessonOptionsEl.appendChild(optionsWrap);

    Lessons.applyQuestionSelectionUi(stepIndex, step, selectedAnswer);
    Lessons.syncHeroQuestionAction(stepIndex, step);

    var correctAnswer = step.correctAnswer || step.correct_answer;
    if (submittedAnswer) {
      Lessons.applyQuestionResultUi(submittedAnswer, correctAnswer, false);
    }
  },

  selectQuestionOption: function(chosen, stepIndex, step) {
    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }

    if (!step) {
      step = Lessons.currentLessonSteps[stepIndex];
    }
    if (!step) return;

    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    if (!Lessons.runtime.selectedAnswerByStepKey || typeof Lessons.runtime.selectedAnswerByStepKey !== 'object') {
      Lessons.runtime.selectedAnswerByStepKey = {};
    }
    if (!Lessons.runtime.submittedAnswerByStepKey || typeof Lessons.runtime.submittedAnswerByStepKey !== 'object') {
      Lessons.runtime.submittedAnswerByStepKey = {};
    }

    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    Lessons.runtime.selectedAnswerByStepKey[stepKey] = chosen;

    var optionsEl = document.getElementById('lesson-options');
    if (!optionsEl) return;

    var optionBtns = optionsEl.querySelectorAll('.lesson-option-btn');
    for (var i = 0; i < optionBtns.length; i++) {
      optionBtns[i].classList.remove('is-correct', 'is-wrong', 'is-neutral');
      Lessons.updateQuestionOptionBadge(optionBtns[i], '');
    }

    Lessons.applyQuestionSelectionUi(stepIndex, step, chosen);

  },

  syncHeroQuestionAction: function(stepIndex, step) {
    var checkBtn = document.getElementById('btn-lesson-check');
    if (!checkBtn) return;
    var checkBtnEn = checkBtn.querySelector('.btn-label-en');
    var checkBtnPa = checkBtn.querySelector('.btn-label-pa');

    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }
    if (!step) {
      step = Lessons.currentLessonSteps && Lessons.currentLessonSteps[stepIndex];
    }

    var stepType = step ? (step.type || step.step_type) : '';
    var isQuestion = stepType === 'question';

    if (!isQuestion) {
      checkBtn.hidden = true;
      checkBtn.setAttribute('aria-hidden', 'true');
      checkBtn.disabled = true;
      return;
    }

    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    if (!Lessons.runtime.selectedAnswerByStepKey || typeof Lessons.runtime.selectedAnswerByStepKey !== 'object') {
      Lessons.runtime.selectedAnswerByStepKey = {};
    }
    if (!Lessons.runtime.submittedAnswerByStepKey || typeof Lessons.runtime.submittedAnswerByStepKey !== 'object') {
      Lessons.runtime.submittedAnswerByStepKey = {};
    }

    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    var selectedAnswer = Lessons.runtime.selectedAnswerByStepKey[stepKey] || '';
    var submittedAnswer = Lessons.runtime.submittedAnswerByStepKey[stepKey] || '';
    var correctAnswer = step.correctAnswer || step.correct_answer;
    var isCorrectLocked = !!submittedAnswer && submittedAnswer === correctAnswer;

    var labelEn = 'Start';
    var labelPa = 'ਸ਼ੁਰੂ ਕਰੋ';
    var ariaLabel = 'Start question';

    if (isCorrectLocked) {
      labelEn = 'Done';
      labelPa = 'ਪੂਰਾ';
      ariaLabel = 'Answer checked';
    } else if (selectedAnswer) {
      labelEn = 'Check';
      labelPa = 'ਚੈੱਕ';
      ariaLabel = 'Check answer';
    }

    if (checkBtnEn) checkBtnEn.textContent = labelEn;
    if (checkBtnPa) checkBtnPa.textContent = labelPa;
    checkBtn.setAttribute('aria-label', ariaLabel);

    checkBtn.hidden = false;
    checkBtn.setAttribute('aria-hidden', 'false');
    checkBtn.disabled = (!selectedAnswer || isCorrectLocked);
  },

  applyQuestionSelectionUi: function(stepIndex, step, selectedAnswer) {
    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }
    if (!step) {
      step = Lessons.currentLessonSteps[stepIndex];
    }

    var optionsEl = document.getElementById('lesson-options');
    if (!optionsEl) return;

    var optionBtns = optionsEl.querySelectorAll('.lesson-option-btn');
    for (var i = 0; i < optionBtns.length; i++) {
      var btn = optionBtns[i];
      var opt = btn.getAttribute('data-option') || '';
      var isSelected = !!selectedAnswer && opt === selectedAnswer;
      btn.classList.toggle('is-selected', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      Lessons.updateQuestionOptionBadge(btn, isSelected ? 'selected' : '');
    }

    Lessons.syncHeroQuestionAction(stepIndex, step);
  },

  applyQuestionResultUi: function(chosen, correct, lockOptions) {
    var optionsEl = document.getElementById('lesson-options');
    if (!optionsEl) return;

    var optionBtns = optionsEl.querySelectorAll('.lesson-option-btn');
    for (var i = 0; i < optionBtns.length; i++) {
      var btn = optionBtns[i];
      var opt = btn.getAttribute('data-option') || '';
      btn.classList.remove('is-correct', 'is-wrong', 'is-neutral', 'is-celebrate');

      if (opt === correct) btn.classList.add('is-correct');
      else if (opt === chosen) btn.classList.add('is-wrong');
      else btn.classList.add('is-neutral');

      if (opt === correct && chosen === correct) btn.classList.add('is-celebrate');

      var badgeState = '';
      if (opt === correct) badgeState = 'correct';
      else if (opt === chosen) badgeState = 'wrong';
      Lessons.updateQuestionOptionBadge(btn, badgeState);

      if (lockOptions) btn.disabled = true;
    }

    if (lockOptions) {
      var checkBtn = document.getElementById('btn-lesson-check');
      if (checkBtn) checkBtn.disabled = true;
    }
  },

  updateQuestionOptionBadge: function(btn, state) {
    if (!btn || !btn.querySelector) return;
    var badge = btn.querySelector('.lesson-option-state');
    if (!badge) return;
    var usePunjabi = !!(typeof Lessons.shouldShowPunjabi === 'function' && Lessons.shouldShowPunjabi());

    var token = String(state || '').trim();
    badge.classList.remove('is-selected', 'is-correct', 'is-wrong', 'is-neutral');

    if (!token) {
      badge.textContent = '';
      badge.removeAttribute('lang');
      return;
    }

    if (token === 'selected') {
      badge.classList.add('is-selected');
      badge.textContent = usePunjabi ? 'ਚੁਣਿਆ' : 'Selected';
      if (usePunjabi) badge.setAttribute('lang', 'pa');
      else badge.removeAttribute('lang');
      return;
    }
    if (token === 'correct') {
      badge.classList.add('is-correct');
      badge.textContent = usePunjabi ? 'ਸਹੀ' : 'Correct';
      if (usePunjabi) badge.setAttribute('lang', 'pa');
      else badge.removeAttribute('lang');
      return;
    }
    if (token === 'wrong') {
      badge.classList.add('is-wrong');
      badge.textContent = usePunjabi ? 'ਮੁੜ ਕੋਸ਼ਿਸ਼' : 'Try again';
      if (usePunjabi) badge.setAttribute('lang', 'pa');
      else badge.removeAttribute('lang');
      return;
    }

    badge.classList.add('is-neutral');
    badge.textContent = '';
    badge.removeAttribute('lang');
  },

  splitPunjabiPromptLines: function(contentPa) {
    var text = (contentPa === null || contentPa === undefined) ? '' : String(contentPa).trim();
    if (!text) return [];

    var explicitLines = text.split(/\r?\n+/)
      .map(function(line) { return String(line || '').trim(); })
      .filter(function(line) { return !!line; });
    if (explicitLines.length >= 2) {
      return [explicitLines[0], explicitLines.slice(1).join(' ')];
    }

    var normalized = text.replace(/\s+/g, ' ').trim();
    var labeledMatch = normalized.match(/^(.*?)(ਸਵਾਲ\s*[:：].*)$/);
    if (labeledMatch && labeledMatch[1] && labeledMatch[2]) {
      return [labeledMatch[1].trim(), labeledMatch[2].trim()];
    }

    var match = normalized.match(/^(.*?ਵਿੱਚ),?\s*(ਕੀ.*)$/);
    if (match && match[1] && match[2]) {
      return [match[1].trim(), match[2].trim()];
    }

    return [normalized];
  },

  splitEnglishPromptLines: function(contentEn) {
    var text = (contentEn === null || contentEn === undefined) ? '' : String(contentEn).trim();
    if (!text) return [];

    var explicitLines = text.split(/\r?\n+/)
      .map(function(line) { return String(line || '').trim(); })
      .filter(function(line) { return !!line; });
    if (explicitLines.length >= 2) {
      return [explicitLines[0], explicitLines.slice(1).join(' ')];
    }

    var normalized = text.replace(/\s+/g, ' ').trim();
    var labeledMatch = normalized.match(/^(.*?)(((?:Question|Q)\s*[:：].*))$/i);
    if (labeledMatch && labeledMatch[1] && labeledMatch[2]) {
      return [labeledMatch[1].trim(), labeledMatch[2].trim()];
    }

    return [normalized];
  },

  buildLessonPromptMarkup: function(contentEn, contentPa, opts) {
    var payloadEn = (contentEn === null || contentEn === undefined) ? '' : String(contentEn);
    var payloadPa = (contentPa === null || contentPa === undefined) ? '' : String(contentPa);
    var enLines = Lessons.splitEnglishPromptLines(payloadEn);
    var paLines = Lessons.splitPunjabiPromptLines(payloadPa);

    var enHtml = '';
    for (var j = 0; j < enLines.length; j++) {
      enHtml += '<span class="lesson-prompt-line-en-segment">' + enLines[j] + '</span>';
    }

    if (!enHtml && payloadEn) {
      enHtml = '<span class="lesson-prompt-line-en-segment">' + payloadEn + '</span>';
    }

    var paHtml = '';
    for (var i = 0; i < paLines.length; i++) {
      paHtml += '<span class="lesson-prompt-line-pa-segment">' + paLines[i] + '</span>';
    }

    if (!paHtml && payloadPa) {
      paHtml = '<span class="lesson-prompt-line-pa-segment">' + payloadPa + '</span>';
    }

    return [
      '<div class="lesson-prompt-card lesson-prompt-card--question">',
        '<div class="lesson-prompt-label">',
          '<span class="lesson-prompt-label-en">Question</span>',
        '</div>',
        '<div class="lesson-prompt-section">',
          '<div class="lesson-prompt-line-en">' + enHtml + '</div>',
          '<div class="lesson-prompt-line-pa" lang="pa">' + paHtml + '</div>',
        '</div>',
      '</div>'
    ].join('');
  },

  getQuestionOptionText: function(opt) {
    if (opt === null || opt === undefined) return { en: '', pa: '' };

    if (typeof opt === 'string' || typeof opt === 'number' || typeof opt === 'boolean') {
      return { en: String(opt), pa: '' };
    }

    if (typeof opt === 'object') {
      var en = '';
      var pa = '';

      if (typeof opt.en === 'string') en = opt.en;
      else if (typeof opt.textEn === 'string') en = opt.textEn;
      else if (typeof opt.text === 'string') en = opt.text;
      else if (typeof opt.value === 'string') en = opt.value;

      if (typeof opt.pa === 'string') pa = opt.pa;
      else if (typeof opt.textPa === 'string') pa = opt.textPa;

      if (!en && pa) en = pa;
      return { en: String(en || ''), pa: String(pa || '') };
    }

    return { en: String(opt), pa: '' };
  },

  isYesNoQuestionStep: function(step) {
    if (!step || !Array.isArray(step.options) || step.options.length !== 2) return false;

    var labels = [];
    for (var i = 0; i < step.options.length; i++) {
      labels.push(Lessons.getQuestionOptionText(step.options[i]).en.trim().toLowerCase());
    }

    var hasYes = labels.indexOf('yes') >= 0;
    var hasNo = labels.indexOf('no') >= 0;
    return hasYes && hasNo;
  },

  isTwoOptionQuestionStep: function(step) {
    return !!(step && Array.isArray(step.options) && step.options.length === 2);
  },

  submitSelectedQuestionAnswer: function(stepIndex, step) {
    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }

    if (!step) {
      step = Lessons.currentLessonSteps[stepIndex];
    }
    if (!step) return;

    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    if (!Lessons.runtime.selectedAnswerByStepKey || typeof Lessons.runtime.selectedAnswerByStepKey !== 'object') {
      Lessons.runtime.selectedAnswerByStepKey = {};
    }
    if (!Lessons.runtime.submittedAnswerByStepKey || typeof Lessons.runtime.submittedAnswerByStepKey !== 'object') {
      Lessons.runtime.submittedAnswerByStepKey = {};
    }

    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    var chosen = Lessons.runtime.selectedAnswerByStepKey[stepKey] || '';
    if (!chosen) return;

    Lessons.runtime.submittedAnswerByStepKey[stepKey] = chosen;

    var correctAnswer = step.correctAnswer || step.correct_answer;
    Lessons.handleAnswer(chosen, correctAnswer, stepIndex);
  },

  // Handle answer - award XP once on correct
  handleAnswer: function(chosen, correct, stepIndex) {
    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }

    var correctBool = (chosen === correct);
    var nextBtn = document.getElementById("btn-lesson-next");
    var step = Lessons.currentLessonSteps[stepIndex];

    // Ensure runtime scope is correct
    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {}, selectedAnswerByStepKey: {}, submittedAnswerByStepKey: {} };
    }
    if (Lessons.runtime.activeLessonKey !== Lessons.currentLessonId) {
      Lessons.resetRuntime(Lessons.currentLessonId);
    }
    if (!Lessons.runtime.selectedAnswerByStepKey || typeof Lessons.runtime.selectedAnswerByStepKey !== 'object') {
      Lessons.runtime.selectedAnswerByStepKey = {};
    }
    if (!Lessons.runtime.submittedAnswerByStepKey || typeof Lessons.runtime.submittedAnswerByStepKey !== 'object') {
      Lessons.runtime.submittedAnswerByStepKey = {};
    }

    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    var attempts = Lessons.runtime.attemptsByStepKey[stepKey] || 0;
    Lessons.runtime.selectedAnswerByStepKey[stepKey] = chosen;
    Lessons.runtime.submittedAnswerByStepKey[stepKey] = chosen;

    var optionsEl = document.getElementById("lesson-options");
    if (correctBool) {
      Lessons.applyQuestionResultUi(chosen, correct, true);

      // If this question exists in the review queue, mark it correct.
      try {
        var rkOk = Lessons.getReviewKey(Lessons.currentLessonId, stepIndex, step);
        Lessons.markReviewResult(rkOk, true);
      } catch (e) {
        // no-op
      }

      Lessons.renderFeedback({ correct: true, step: step, attempts: attempts, showHint: false, canContinue: true, selectedAnswer: chosen });

      Lessons.markStepResolved(stepIndex, true);

      // Disable all option buttons to prevent re-clicking
      if (optionsEl) {
        var btns = optionsEl.querySelectorAll("button.btn");
        for (var bi = 0; bi < btns.length; bi++) {
          btns[bi].disabled = true;
        }
      }
      if (nextBtn) nextBtn.disabled = false;
      Lessons.renderSwipeProgress();
      State.save();
      return;
    }

    // Wrong answer
    Lessons.applyQuestionResultUi(chosen, correct, false);

    attempts += 1;
    Lessons.runtime.attemptsByStepKey[stepKey] = attempts;
    if (attempts === 1) {
      Lessons.markInitialWrong(stepIndex);
    }

    var hint = Lessons._getHint(step);
    var hasHint = !!(hint && (hint.en || hint.pa));

    if (attempts === 1 && hasHint) {
      // Stage 1: gentle hint, retry (no continue)
      Lessons.renderFeedback({ correct: false, step: step, attempts: attempts, showHint: true, canContinue: false, selectedAnswer: chosen });
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    // Stage 2: worked example + explanation
  Lessons.renderFeedback({ correct: false, step: step, attempts: attempts, showHint: false, canContinue: true, selectedAnswer: chosen });

    // Queue for spaced review once we reach the "worked example" stage.
    try {
      var rk = Lessons.getReviewKey(Lessons.currentLessonId, stepIndex, step);
      var item = Lessons.buildReviewItemFromStep(Lessons.currentLessonId, stepIndex, step);
      if (item) {
        // Preserve existing dueAt if already queued; otherwise schedule next review.
        item.reviewKey = rk;
        Lessons.addReviewMiss(item);
      }
      Lessons.markReviewResult(rk, false);
    } catch (e) {
      // no-op
    }

    if (Lessons.isReviewMode()) {
      if (nextBtn) nextBtn.disabled = false;
      Lessons.renderSwipeProgress();
      return;
    }

    // Escape hatch enabled after stage 2
    Lessons.markStepResolved(stepIndex, false);
    if (nextBtn) nextBtn.disabled = true;
    Lessons.renderSwipeProgress();
  },

  // Next step - handles summary completion
  nextStep: function() {
    if (!Lessons.currentLessonSteps || !Lessons.currentLessonSteps.length) return;
    
    var step = Lessons.currentLessonSteps[Lessons.currentStepIndex];

    if (!Lessons.canAdvanceFromCurrentStep()) {
      return;
    }

    // Handle examples phase for question steps before moving on
    if (step && (step.type === "question" || step.step_type === "question") && Lessons.inExamplesPhase) {
      var examples = Lessons.normalizeQuestionExamples(step);
      if (Lessons.currentExampleIndex < examples.length - 1) {
        Lessons.currentExampleIndex++;
        Lessons.renderQuestionExample(step);
        return;
      } else {
        Lessons.inExamplesPhase = false;
        Lessons.currentExampleIndex = 0;
      }
    }
    
    // If at summary step, complete the lesson
    if (step && (step.type === "summary" || step.step_type === "summary")) {
      Lessons.completeLesson();
      return;
    }
    
    // Normal lesson progression
    if (Lessons.currentStepIndex < Lessons.currentLessonSteps.length - 1) {
      try {
        var lessonProgress = document.getElementById('lesson-swipe-progress');
        var lessonHeroProgress = document.querySelector('#screen-lesson .lesson-step-progress');
        var host = lessonHeroProgress || lessonProgress;
        if (host) {
          if (typeof nudgeCounterIndicator === 'function') {
            nudgeCounterIndicator(host, 1);
          } else {
            if (lessonProgress) lessonProgress.classList.remove('indicator-shift-next', 'indicator-shift-prev');
            if (lessonHeroProgress && lessonHeroProgress !== lessonProgress) {
              lessonHeroProgress.classList.remove('indicator-shift-next', 'indicator-shift-prev');
            }
            void host.offsetWidth;
            host.classList.add('indicator-shift-next');
            window.setTimeout(function() {
              try { host.classList.remove('indicator-shift-next'); } catch (eLessonNextRemove) {}
            }, 220);
          }
        }
      } catch (eLessonNextNudge) {}
      Lessons.currentStepIndex++;
      State.state.session.currentLessonStep = Lessons.currentStepIndex;
      State.save(); // ✅ Persist forward navigation
      Lessons.renderLessonStep();
    } else {
      Lessons.completeLesson();
    }
  },

  // Previous step
  prevStep: function() {
    if (!Lessons.currentLessonSteps || !Lessons.currentLessonSteps.length) return;

    if (!Lessons.canNavigateBack()) return;
    try {
      var lessonProgress = document.getElementById('lesson-swipe-progress');
      var lessonHeroProgress = document.querySelector('#screen-lesson .lesson-step-progress');
      var host = lessonHeroProgress || lessonProgress;
      if (host) {
        if (typeof nudgeCounterIndicator === 'function') {
          nudgeCounterIndicator(host, -1);
        } else {
          if (lessonProgress) lessonProgress.classList.remove('indicator-shift-next', 'indicator-shift-prev');
          if (lessonHeroProgress && lessonHeroProgress !== lessonProgress) {
            lessonHeroProgress.classList.remove('indicator-shift-next', 'indicator-shift-prev');
          }
          void host.offsetWidth;
          host.classList.add('indicator-shift-prev');
          window.setTimeout(function() {
            try { host.classList.remove('indicator-shift-prev'); } catch (eLessonPrevRemove) {}
          }, 220);
        }
      }
    } catch (eLessonPrevNudge) {}
    State.save(); // ✅ Persist backward navigation
    Lessons.currentStepIndex--;
    State.state.session.currentLessonStep = Lessons.currentStepIndex;
    Lessons.renderLessonStep();
  },

  // Complete lesson (marks full lesson done, used only in normal flow)
  completeLesson: function() {
    var lessonId = Lessons.resolveCanonicalLessonId(Lessons.currentLessonId);
    if (lessonId && typeof State !== 'undefined' && State && State.state) {
      if (typeof State.ensureTracksInitialized === 'function') State.ensureTracksInitialized();

      if (!State.state.progress || typeof State.state.progress !== 'object') State.state.progress = {};
      if (!State.state.progress.lessonDone || typeof State.state.progress.lessonDone !== 'object') {
        State.state.progress.lessonDone = {};
      }
      if (!State.state.progress.lessonProgress || typeof State.state.progress.lessonProgress !== 'object') {
        State.state.progress.lessonProgress = {};
      }

      var wasAlreadyDone = State.state.progress.lessonDone[lessonId] === true;
      State.state.progress.lessonDone[lessonId] = true;

      var persisted = State.state.progress.lessonProgress[lessonId];
      if (!persisted || typeof persisted !== 'object') persisted = {};
      var totalSteps = (Lessons.currentLessonSteps && Lessons.currentLessonSteps.length)
        ? Lessons.currentLessonSteps.length
        : (Lessons.getPlayableSteps(lessonId).length || 0);
      var prevCompleted = (typeof persisted.stepsCompleted === 'number' && isFinite(persisted.stepsCompleted))
        ? persisted.stepsCompleted
        : 0;
      persisted.stepsCompleted = Math.max(prevCompleted, totalSteps);
      persisted.started = true;
      persisted.completedAt = Date.now();
      State.state.progress.lessonProgress[lessonId] = persisted;

      if (!wasAlreadyDone && Lessons.currentLessonTrackId) {
        if (!State.state.progress.trackXP || typeof State.state.progress.trackXP !== 'object') {
          State.state.progress.trackXP = {};
        }
        if (!State.state.progress.trackXP[Lessons.currentLessonTrackId]) {
          State.state.progress.trackXP[Lessons.currentLessonTrackId] = {
            xp: 0,
            lessonsCompleted: 0,
            questionsAttempted: 0,
            questionsCorrect: 0
          };
        }
        var bucket = State.state.progress.trackXP[Lessons.currentLessonTrackId];
        if (typeof bucket.lessonsCompleted !== 'number' || !isFinite(bucket.lessonsCompleted)) bucket.lessonsCompleted = 0;
        bucket.lessonsCompleted += 1;
      }

      if (!State.state.session || typeof State.state.session !== 'object') State.state.session = {};
      State.state.session.currentLessonId = null;
      State.state.session.currentLessonStep = 0;
      State.save();
    }
    
    Lessons.renderLearnSections();
    alert("Lesson Complete! / ਪਾਠ ਮੁਕਤ ਹੋ ਗਿਆ!");
    UI.goTo("screen-learn");
  },

  _updateStreakBadge: function() {}
};

// =====================================
// LearnQA Helper - Debug & QA Logging
// Enable with: localStorage.LEARN_QA = "1"
// =====================================
var LearnQA = {
  enabled: function() {
    if (typeof State !== 'undefined' && State.getLearnQAEnabled) {
      return !!State.getLearnQAEnabled();
    }
    return false;
  },

  // Validate lesson object has all required fields
  validateLesson: function(lessonId, lesson) {
    if (!this.enabled()) return;
    
    var errors = [];
    if (!lessonId) errors.push("Missing lessonId");
    if (!lesson) errors.push("Lesson object null/undefined");
    if (lesson && !lesson.metadata) errors.push("Missing metadata");
    if (lesson && lesson.metadata) {
      if (!lesson.metadata.titleEn) errors.push("Missing titleEn");
      if (!lesson.metadata.titlePa) errors.push("Missing titlePa");
      if (!lesson.metadata.trackId) errors.push("Missing trackId");
    }
    if (lesson && !Array.isArray(lesson.steps)) errors.push("Missing or non-array steps");
    
    if (errors.length) {
      console.warn("⚠️ [Learn] Lesson validation failed for " + lessonId + ":", errors);
    }
    return errors.length === 0;
  },

  // Log lessons per track
  logLessonsPerTrack: function() {
    if (!this.enabled()) return;
    
    var tracks = {};
    for (var trackId in TRACKS) {
      if (TRACKS.hasOwnProperty(trackId)) {
        var count = Lessons.getLessonsByTrack(trackId).length;
        tracks[trackId] = count;
      }
    }
    console.log("🎓 [Learn] Lessons per track:", tracks);
  },

  // Log lesson card render
  logCardRendered: function(lessonId, titleEn, titlePa) {
    if (!this.enabled()) return;
    console.log("🎓 [Learn] Card rendered: " + lessonId + " (" + titleEn + " / " + titlePa + ")");
  },

  // Log lesson launch
  logLessonLaunch: function(lessonId, trackId) {
    if (!this.enabled()) return;
    console.log("🎓 [Learn] Lesson launched: " + lessonId + " from track " + trackId);
  }
};
