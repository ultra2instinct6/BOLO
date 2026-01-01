// =====================================
// Lessons Module - owns screen-learn and screen-lesson
// =====================================

// Learn screen UI shortening
var LEARN_PREVIEW_COUNT = 6;
var LEARN_SHOW_MORE_INCREMENT = 6;

// Learn screen persistence + library (localStorage)
var BOLO_LEARN_UI_STATE_KEY = 'BOLO_LEARN_UI_STATE_V1';
var BOLO_RECENT_LESSONS_KEY = 'BOLO_RECENT_LESSONS_V1';
var BOLO_FAVORITES_KEY = 'BOLO_FAVORITES_V1';
var LEARN_RECENT_CAP = 5;
var LEARN_SAVED_PREVIEW_CAP = 6;
var LEARN_SCROLL_SAVE_THROTTLE_MS = 350;

var Lessons = {
  _initialized: false,
  _keyboardBound: false,
  currentLessonId: null,
  currentLessonTrackId: null,
  currentLessonSteps: [],
  currentStepIndex: 0,
  currentExampleIndex: 0,
  inExamplesPhase: false,

  // Review queue (Leitner-lite) storage key
  REVIEW_STORAGE_KEY: 'boloReviewQueue_v1',

  // Session-only runtime store (DO NOT persist)
  runtime: {
    attemptsByStepKey: {},
    activeLessonKey: null
  },
  
  // Enable full multi-step rendering for new-format lessons only
  isFullLessonEnabled: function(lessonId) {
    var l = LESSONS[lessonId];
    return !!(l && l.metadata && l.steps && Array.isArray(l.steps));
  },

  // Pagination & Filtering
  lessonsPerPage: LEARN_PREVIEW_COUNT,
  currentPage: 1,
  expandedTracks: {},
  _learnDelegationBound: false,
  _learnTrackLimits: {},
  _learnLastByTrack: {},
  _savedShowAll: false,
  _learnQuickFilter: 'all', // all|easy|medium|hard|saved
  _learnStickyBound: false,
  _learnScrollBound: false,
  _learnScrollSaveTimer: null,
  _learnLastScrollSavedAt: 0,
  _learnPendingScrollY: null,
  activeFilters: {
    search: '',
    status: 'all',
    difficulty: [1, 2, 3],
    track: 'all'
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
      if (metaById[m.id]) continue;
      metaById[m.id] = m;
      deduped.push(m);
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

      if (!LESSONS[id]) {
        LESSONS[id] = {
          metadata: {
            titleEn: meta.labelEn || 'Lesson',
            titlePa: meta.labelPa || 'ਪਾਠ',
            labelEn: meta.labelEn || 'Lesson',
            labelPa: meta.labelPa || 'ਪਾਠ',
            trackId: meta.trackId || 'T_WORDS',
            objective: {
              titleEn: 'Start Lesson',
              titlePa: 'ਪਾਠ ਸ਼ੁਰੂ ਕਰੋ',
              descEn: 'Content coming soon.',
              descPa: 'ਸਮੱਗਰੀ ਜਲਦੀ ਆ ਰਹੀ ਹੈ।',
              pointsAvailable: 0
            },
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
      if (lessonId.indexOf('L_') !== 0) continue;
      if (metaById[lessonId]) continue;

      var norm = Lessons.normalizeLesson(lessonId);
      var md2 = (norm && norm.metadata) ? norm.metadata : {};

      var trackId = md2.trackId || 'T_WORDS';
      if (typeof TRACKS === 'object' && TRACKS && trackId && !TRACKS[trackId]) trackId = 'T_WORDS';

      var newMeta = {
        id: lessonId,
        labelEn: md2.labelEn || md2.titleEn || lessonId,
        labelPa: md2.labelPa || md2.titlePa || '',
        trackId: trackId,
        difficulty: md2.difficulty || 1
      };

      LESSON_META.push(newMeta);
      metaById[lessonId] = newMeta;
      addedMeta++;
      addedMetaIds.push(lessonId);
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

  // ===== QUEST CONTEXT HELPERS =====

  getQuestContext: function() {
    return window.DQ_QUEST_CONTEXT || null;
  },

  isQuestMode: function() {
    return window.DQ_QUEST_CONTEXT && window.DQ_QUEST_CONTEXT.mode === true;
  },

  clearQuestContext: function() {
    window.DQ_QUEST_CONTEXT = null;
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
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {} };
    }
    Lessons.runtime.attemptsByStepKey = {};
    Lessons.runtime.activeLessonKey = activeLessonKey || null;
    Lessons.runtime.seenReviewKeys = {};
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
    if (t === 'objective') return 'objective';
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
    if (kind === 'objective') return { en: 'Get ready for this lesson.', pa: 'ਇਸ ਪਾਠ ਲਈ ਤਿਆਰ ਹੋਵੋ।' };
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

  _reviewLoad: function() {
    try {
      var raw = localStorage.getItem(Lessons.REVIEW_STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  _reviewSave: function(items) {
    try {
      localStorage.setItem(Lessons.REVIEW_STORAGE_KEY, JSON.stringify(items || []));
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
        if (!Lessons.runtime || typeof Lessons.runtime !== 'object') Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null, seenReviewKeys: {} };
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
    return { en: "Read the sentence and pick the best English form.", pa: "ਵਾਕ ਪੜ੍ਹੋ ਅਤੇ ਸਭ ਤੋਂ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਰੂਪ ਚੁਣੋ।" };
  },

  _generateExplanation: function(step, correctBool) {
    var kind = Lessons._classifyQuestion(step);
    if (kind === 'present_progressive') {
      return { en: "Present progressive uses am/is/are + verb-ing for actions happening now.", pa: "ਵਰਤਮਾਨ ਜਾਰੀ ਵਿੱਚ am/is/are + ਕਿਰਿਆ-ing ਹੁੰਦੀ ਹੈ (ਹੁਣ ਚੱਲ ਰਹੀ ਕਿਰਿਆ)।" };
    }
    if (kind === 'past_progressive') {
      return { en: "Past progressive uses was/were + verb-ing for actions happening in the past.", pa: "ਭੂਤਕਾਲੀ ਜਾਰੀ ਵਿੱਚ was/were + ਕਿਰਿਆ-ing ਹੁੰਦੀ ਹੈ (ਭੂਤਕਾਲ ਦੀ ਚੱਲਦੀ ਕਿਰਿਆ)।" };
    }
    if (kind === 'modals') {
      return { en: "A modal (can/should/must…) is followed by the base verb (no -s, no -ing).", pa: "ਮੋਡਲ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਮੂਲ ਕਿਰਿਆ ਆਉਂਦੀ ਹੈ (ਨਾ -s, ਨਾ -ing)।" };
    }
    if (kind === 'possessives') {
      return { en: "Possessives show ownership (my/your/his… or ’s).", pa: "Possessive ਦਾ ਅਰਥ ਹੈ ‘ਕਿਸ ਦਾ’ (my/your/his… ਜਾਂ ’s)।" };
    }
    if (kind === 'comparative') {
      return { en: "Comparatives compare two things (…er / more …).", pa: "Comparative ਦੋ ਚੀਜ਼ਾਂ ਦੀ ਤੁਲਨਾ ਲਈ ਹੁੰਦਾ ਹੈ (…er / more …)।" };
    }
    if (kind === 'superlative') {
      return { en: "Superlatives show the extreme (…est / most …).", pa: "Superlative ‘ਸਭ ਤੋਂ’ ਦੱਸਦਾ ਹੈ (…est / most …)।" };
    }
    if (kind === 'have_has') {
      return { en: "Use have/has based on the subject (he/she/it → has).", pa: "ਕਰਤਾ ਦੇ ਅਨੁਸਾਰ have/has ਵਰਤੋ (he/she/it → has)।" };
    }
    if (kind === 'be_verbs') {
      return { en: "Use am/is/are based on the subject.", pa: "ਕਰਤਾ ਦੇ ਅਨੁਸਾਰ am/is/are ਵਰਤੋ।" };
    }

    return correctBool
      ? { en: "This option matches the correct English pattern.", pa: "ਇਹ ਵਿਕਲਪ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਨਿਯਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।" }
      : { en: "This is the correct pattern to remember.", pa: "ਇਹ ਸਹੀ ਨਿਯਮ ਹੈ—ਇਸਨੂੰ ਯਾਦ ਰੱਖੋ।" };
  },

  _getHint: function(step) {
    if (!step) return null;
    var explicit = Lessons._asBilingual(step.hint) || Lessons._asBilingual({ en: step.hintEn, pa: step.hintPa });
    if (explicit && (explicit.en || explicit.pa)) return explicit;
    return Lessons._generateHint(step);
  },

  _getExplanation: function(step) {
    if (!step) return null;
    var explicit = (
      Lessons._asBilingual(step.explanation) ||
      Lessons._asBilingual({ en: step.explainEn || step.englishExplain, pa: step.explainPa || step.punjabiExplain })
    );
    if (explicit && (explicit.en || explicit.pa)) return explicit;

    // Prefer examples[0] explanation if present
    var examples = Lessons.normalizeQuestionExamples(step);
    if (examples && examples.length) {
      var ex0 = examples[0] || {};
      var exExpl = Lessons._asBilingual({ en: ex0.explainEn || ex0.noteEn, pa: ex0.explainPa || ex0.notePa });
      if (exExpl && (exExpl.en || exExpl.pa)) return exExpl;
    }

    return Lessons._generateExplanation(step, true);
  },

  _getWorkedExample: function(step) {
    if (!step) return null;

    // New schema
    if (step.workedExample && typeof step.workedExample === 'object') {
      var we = {
        en: typeof step.workedExample.en === 'string' ? step.workedExample.en : '',
        pa: typeof step.workedExample.pa === 'string' ? step.workedExample.pa : '',
        highlight: step.workedExample.highlight && typeof step.workedExample.highlight === 'object' ? step.workedExample.highlight : null
      };
      if (we.en || we.pa) return we;
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
      return { en: en, pa: pa, highlight: highlight };
    }

    // Auto-generate a minimal worked example from the correct answer
    var correct = step && (step.correctAnswer || step.correct_answer);
    if (correct) {
      var c = String(correct);
      var tokens = [];
      var parts = c.split(/\s+/);
      if (parts.length) tokens.push(parts.slice(0, Math.min(2, parts.length)).join(' '));
      return {
        en: c,
        pa: 'ਸਹੀ: ' + c,
        highlight: { en: tokens, pa: ['ਸਹੀ'] }
      };
    }

    return null;
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
      out += '<mark class="ex-hi">' + Lessons.escapeHtml(text.slice(mm.start, mm.end)) + '</mark>';
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

    var explainFallback = correct
      ? { en: 'Nice work — here is why this is correct.', pa: 'ਵਧੀਆ — ਇਹ ਸਹੀ ਕਿਉਂ ਹੈ, ਵੇਖੋ।' }
      : { en: 'Let’s learn from this — here is the correct pattern.', pa: 'ਆਓ ਇਸ ਤੋਂ ਸਿੱਖੀਏ — ਸਹੀ ਨਿਯਮ ਵੇਖੋ।' };

    if (!explanation) explanation = explainFallback;

    var we = worked;
    if (!we) {
      we = { en: '', pa: '', highlight: null };
    }

    var highlightEn = (we.highlight && Array.isArray(we.highlight.en)) ? we.highlight.en : [];
    var highlightPa = (we.highlight && Array.isArray(we.highlight.pa)) ? we.highlight.pa : [];

    var html = '';
    html += '<div class="lesson-feedback-panel">';
    html += '  <div class="lesson-feedback-status">';
    html += '    <div class="lesson-feedback-status-en">' + Lessons.escapeHtml(statusEn) + '</div>';
    if (punjabiOn) html += '    <div class="lesson-feedback-status-pa" lang="pa">' + Lessons.escapeHtml(statusPa) + '</div>';
    html += '  </div>';

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
        html += '    <div class="lesson-explain-title">Why</div>';
        if (explanation.en) html += '    <div class="lesson-explain-en">' + Lessons.escapeHtml(explanation.en) + '</div>';
        if (punjabiOn && explanation.pa) html += '    <div class="lesson-explain-pa" lang="pa">' + Lessons.escapeHtml(explanation.pa) + '</div>';
        html += '  </div>';
      }

      if ((we.en || we.pa)) {
        html += '  <div class="lesson-example">';
        html += '    <div class="lesson-example-title">Worked example</div>';
        if (we.en) html += '    <div class="lesson-example-en">' + Lessons.applyHighlights(we.en, highlightEn) + '</div>';
        if (punjabiOn && we.pa) html += '    <div class="lesson-example-pa" lang="pa">' + Lessons.applyHighlights(we.pa, highlightPa) + '</div>';
        html += '  </div>';
      }
    }

    if (canContinue) {
      html += '  <div class="lesson-continue">Tap Next to continue.</div>';
    }

    html += '</div>';

    el.innerHTML = html;
    el.className = 'feedback lesson-feedback-panel ' + (correct ? 'correct' : 'wrong');

    Lessons.showFeedbackOverlay({
      statusEn: statusEn,
      statusPa: punjabiOn ? statusPa : '',
      hint: hint,
      explanation: (!hint && explanation) ? explanation : null,
      worked: (!hint && we) ? we : null,
      correct: correct,
      canContinue: canContinue
    });
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

  renderQuestionExample: function(step, applyHighlight) {
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

    var safeSentenceEn = Lessons.escapeHtml(sentenceEnRaw);
    var safeSentencePa = Lessons.escapeHtml(sentencePaRaw);

    if (applyHighlight && highlight && sentenceEnRaw) {
      var regex = new RegExp("(\\b" + Lessons.escapeRegex(highlight) + "\\b)", "gi");
      safeSentenceEn = safeSentenceEn.replace(regex, '<span class="inline-highlight">$1</span>');
    }

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

  getQuestQuestionStepIndex: function(lessonId) {
    var steps = Lessons.getSteps(lessonId);
    if (!steps || !steps.length) {
      return 0;
    }

    var validIndices = [];
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var stepType = step.type || step.step_type;
      var correct = step.correctAnswer || step.correct_answer;
      
      if (stepType === "question" &&
          step.options && Array.isArray(step.options) && step.options.length >= 2 &&
          correct && typeof correct === "string" &&
          step.options.indexOf(correct) >= 0) {
        validIndices.push(i);
      }
    }

    if (!validIndices.length) {
      return 0;
    }

    // Defensive profile seeding: avoid crash if State not ready
    var profile = (State.getActiveProfile && State.getActiveProfile()) || null;
    var profileId = (profile && profile.id) ? profile.id : "default";
    
    var seedStr = Lessons.getDayKey() + ":" + lessonId + ":" + profileId;
    var seedInt = Lessons.hashStringToInt(seedStr);
    var selectedIdx = seedInt % validIndices.length;
    return validIndices[selectedIdx];
  },

  // ===== QUEST MODE OPENING =====

  openLessonForQuest: function(lessonId, callback, optStepIndex) {
    if (!Lessons.validateLessonContent(lessonId)) {
      alert("Content coming soon.");
      if (callback) callback();
      return;
    }

    var stepsForBounds = Lessons.getSteps(lessonId) || [];
    var targetStep;
    if (optStepIndex !== null && optStepIndex !== undefined && 
        optStepIndex >= 0 && optStepIndex < stepsForBounds.length) {
      targetStep = optStepIndex;
    } else {
      targetStep = Lessons.getQuestQuestionStepIndex(lessonId);
    }

    window.DQ_QUEST_CONTEXT = {
      mode: true,
      lessonId: lessonId,
      targetStep: targetStep,
      callback: callback || function() {},
      startedAt: Date.now(),
      answeredCorrect: false,
      xpAwarded: false
    };

    Lessons.startLesson(lessonId);
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
          objective: {
            titleEn: "Learn",
            titlePa: "ਸਿੱਖੋ",
            descEn: "Complete this lesson",
            descPa: "ਇਹ ਪਾਠ ਮੁਕਤ ਕਰੋ",
            pointsAvailable: 5
          },
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

  initLesson: function(lessonId) {
    if (!State.state.session.lessonProgress) {
      State.state.session.lessonProgress = {};
    }
    if (!State.state.session.lessonProgress[lessonId]) {
      State.state.session.lessonProgress[lessonId] = {
        stepsCompleted: 0,
        pointsEarned: 0,
        stepAwarded: {}
      };
    }
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
      if (trackId && State.state.progress.trackXP && State.state.progress.trackXP[trackId]) {
        State.state.progress.trackXP[trackId].xp = (State.state.progress.trackXP[trackId].xp || 0) + points;
      }

      State.save();
    }
  },

  // ===== RENDERING: OBJECTIVE SCREEN =====

  renderObjectiveScreen: function(meta) {
    var lesson = Lessons.normalizeLesson(Lessons.currentLessonId);
    if (!lesson || !lesson.metadata) return;

    var obj = lesson.metadata.objective || {};
    var difficulty = lesson.metadata.difficulty || 1;

    var container = document.getElementById("lesson-options");
    if (!container) return;

    var html = `
      <div class="objective-content">
        <div class="objective-icon">🎯</div>
        
        <h2 class="objective-title-en">${obj.titleEn || "Start Lesson"}</h2>
        <h2 class="objective-title-pa">${obj.titlePa || "ਪਾਠ ਸ਼ੁਰੂ ਕਰੋ"}</h2>
        
        <p class="objective-desc-en">${obj.descEn || ""}</p>
        <p class="objective-desc-pa">${obj.descPa || ""}</p>
        
        <div class="objective-points-badge">
          <span class="badge-label-en">Points available:</span>
          <span class="badge-label-pa">ਉਪਲਬਧ ਪੁਆਇੰਟ:</span>
          <span class="badge-value">+${obj.pointsAvailable || 10} XP</span>
        </div>
        
        <div class="objective-difficulty">
          <span class="difficulty-label-en">Difficulty:</span>
          <span class="difficulty-label-pa">ਮੁਸ਼ਕਲਤਾ:</span>
          <div class="difficulty-stars">
            ${[1,2,3].map(i => `<span class="star ${i <= difficulty ? 'filled' : 'empty'}">★</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    var nextBtn = document.getElementById("btn-lesson-next");
    if (nextBtn) nextBtn.disabled = false;
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

    Lessons.showFeedbackOverlay({
      statusEn: step.feedbackCorrect || "Correct!",
      statusPa: step.feedbackCorrectPa || "ਠੀਕ ਹੈ!",
      hint: null,
      explanation: null,
      worked: null,
      correct: true,
      canContinue: true
    });

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

    var questContext = Lessons.getQuestContext();
    if (questContext) {
      questContext.answeredCorrect = true;
    }

    Lessons.awardStepPoints(Lessons.currentStepIndex, step);

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

    // Bind filter controls
    var searchInput = document.getElementById("lesson-search");
    if (searchInput) {
      if (!searchInput.dataset.lessonSearchBound) {
        searchInput.dataset.lessonSearchBound = "1";
        searchInput.addEventListener("input", function() {
          Lessons.activeFilters.search = this.value;
          if (LearnQA.enabled()) console.log("🎓 [Learn] Search filter changed to: " + this.value);
          Lessons.saveFiltersToState();
          Lessons.renderLearnSections();
        });
      }
    }

    // Status filter buttons
    var filterBtns = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < filterBtns.length; i++) {
      var fb = filterBtns[i];
      if (fb && (!fb.dataset || !fb.dataset.filterBtnBound)) {
        if (fb.dataset) fb.dataset.filterBtnBound = "1";
        fb.addEventListener("click", function() {
          // Remove active from all
          var allBtns = document.querySelectorAll(".filter-btn");
          for (var j = 0; j < allBtns.length; j++) {
            allBtns[j].classList.remove("active");
            allBtns[j].setAttribute("aria-pressed", "false");
          }
          // Add active to clicked
          this.classList.add("active");
          this.setAttribute("aria-pressed", "true");
          Lessons.activeFilters.status = this.getAttribute("data-filter");
          if (LearnQA.enabled()) console.log("🎓 [Learn] Status filter changed to: " + Lessons.activeFilters.status);
          Lessons.saveFiltersToState();
          Lessons.renderLearnSections();
        });
      }
    }

    // Difficulty checkboxes
    var diffCheckboxes = document.querySelectorAll(".diff-filter");
    for (var k = 0; k < diffCheckboxes.length; k++) {
      var dc = diffCheckboxes[k];
      if (dc && (!dc.dataset || !dc.dataset.diffFilterBound)) {
        if (dc.dataset) dc.dataset.diffFilterBound = "1";
        dc.addEventListener("change", function() {
          var diff = parseInt(this.getAttribute("data-difficulty"), 10);
          if (this.checked) {
            if (Lessons.activeFilters.difficulty.indexOf(diff) === -1) {
              Lessons.activeFilters.difficulty.push(diff);
            }
          } else {
            var idx = Lessons.activeFilters.difficulty.indexOf(diff);
            if (idx !== -1) {
              Lessons.activeFilters.difficulty.splice(idx, 1);
            }
          }
          // Normalize ordering
          Lessons.activeFilters.difficulty.sort();
          if (LearnQA.enabled()) console.log("🎓 [Learn] Difficulty filter changed to: " + Lessons.activeFilters.difficulty.join(","));
          Lessons.saveFiltersToState();
          Lessons.renderLearnSections();
        });
      }
    }

    // Track dropdown
    var trackFilter = document.getElementById("track-filter");
    if (trackFilter) {
      if (!trackFilter.dataset.trackFilterBound) {
        trackFilter.dataset.trackFilterBound = "1";
        trackFilter.addEventListener("change", function() {
          Lessons.activeFilters.track = this.value;
          if (LearnQA.enabled()) console.log("🎓 [Learn] Track filter changed to: " + this.value);
          Lessons.saveFiltersToState();
          Lessons.renderLearnSections();
        });
      }
    }

    // Clear filters
    var btnClearFilters = document.getElementById("btn-clear-filters");
    if (btnClearFilters) {
      if (!btnClearFilters.dataset.clearFiltersBound) {
        btnClearFilters.dataset.clearFiltersBound = "1";
        btnClearFilters.addEventListener("click", function() { Lessons.clearFilters(); });
      }
    }

    // Keyboard: focus search with '/'
    if (!Lessons._keyboardBound) {
      Lessons._keyboardBound = true;
      document.addEventListener("keydown", function(e) {
        if (e.key === "/") {
          var learnScreen = document.getElementById("screen-learn");
          if (learnScreen && learnScreen.classList.contains("active")) {
            var inp = document.getElementById("lesson-search");
            if (inp) {
              e.preventDefault();
              inp.focus();
            }
          }
        }
      });
    }

    // Ensure catalog consistency before any filtering/rendering
    Lessons.ensureLessonCatalogSync();

    // Restore saved filters (if any) and sync UI controls
    Lessons.restoreFiltersFromState();
    Lessons.syncFilterControls();

    // Wire QA toggle
    Lessons.bindQAToggle();
    Lessons.syncQAToggle();

    // Render learn sections on startup
    Lessons.renderLearnSections();
  },

  // Lifecycle: wire once, sync controls, and render dynamic content
  wireOnce: function() {
    Lessons.init();
  },

  syncUI: function() {
    Lessons.syncFilterControls();
    Lessons.syncQAToggle();
  },

  renderContent: function() {
    Lessons.renderLearnSections();
  },

  mount: function() {
    Lessons.wireOnce();
    Lessons.ensureLessonCatalogSync();
    Lessons.restoreFiltersFromState();
    Lessons.syncUI();

    // Restore persisted Learn UI (expanded tracks, show-more limits, scroll)
    Lessons._restoreLearnUiStateForMount();

    Lessons._bindLearnScrollPersistenceOnce();
    Lessons.renderContent();
    Lessons._restoreLearnScrollAfterNav();
  },

  // Render learn screen with lesson cards

  _getSafeLessonMetaById: function(lessonId) {
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

  // ===== Learn UI State (expanded/limits/scroll) =====

  _loadLearnUiState: function() {
    var d = Lessons._loadJson(BOLO_LEARN_UI_STATE_KEY, null);
    if (!d || typeof d !== 'object') {
      return { expandedTrackIds: [], trackLimits: {}, scrollY: 0, updatedAt: 0 };
    }
    var expanded = Array.isArray(d.expandedTrackIds) ? d.expandedTrackIds.filter(Boolean) : [];
    var limits = (d.trackLimits && typeof d.trackLimits === 'object') ? d.trackLimits : {};
    var cleanedLimits = {};
    for (var k in limits) {
      if (!limits.hasOwnProperty(k)) continue;
      var n = limits[k];
      if (typeof n === 'number' && isFinite(n) && n > 0) cleanedLimits[k] = Math.round(n);
    }
    var y = (typeof d.scrollY === 'number' && isFinite(d.scrollY) && d.scrollY >= 0) ? Math.round(d.scrollY) : 0;
    var ts = (typeof d.updatedAt === 'number' && isFinite(d.updatedAt) && d.updatedAt > 0) ? Math.round(d.updatedAt) : 0;
    return { expandedTrackIds: expanded, trackLimits: cleanedLimits, scrollY: y, updatedAt: ts };
  },

  _saveLearnUiStateNow: function() {
    var expandedIds = [];
    for (var tid in Lessons.expandedTracks) {
      if (!Lessons.expandedTracks.hasOwnProperty(tid)) continue;
      if (Lessons.expandedTracks[tid]) expandedIds.push(tid);
    }

    var limitsOut = {};
    for (var k in Lessons._learnTrackLimits) {
      if (!Lessons._learnTrackLimits.hasOwnProperty(k)) continue;
      var n = Lessons._learnTrackLimits[k];
      if (typeof n === 'number' && isFinite(n) && n > 0) limitsOut[k] = Math.round(n);
    }

    var y = 0;
    try { y = window.scrollY || window.pageYOffset || 0; } catch (e) { y = 0; }

    var payload = {
      expandedTrackIds: expandedIds,
      trackLimits: limitsOut,
      scrollY: Math.max(0, Math.round(y)),
      updatedAt: Date.now()
    };
    Lessons._saveJson(BOLO_LEARN_UI_STATE_KEY, payload);
  },

  _restoreLearnUiStateForMount: function() {
    var st = Lessons._loadLearnUiState();

    // Restore expand + limits
    var expandedMap = {};
    for (var i = 0; i < st.expandedTrackIds.length; i++) {
      expandedMap[st.expandedTrackIds[i]] = true;
    }
    for (var tl in st.trackLimits) {
      if (st.trackLimits.hasOwnProperty(tl)) expandedMap[tl] = true;
    }
    Lessons.expandedTracks = expandedMap;
    Lessons._learnTrackLimits = st.trackLimits || {};

    // Defer scroll restore until after Learn render and UI.goTo() scroll-to-top
    Lessons._learnPendingScrollY = (typeof st.scrollY === 'number' && isFinite(st.scrollY) && st.scrollY > 0) ? st.scrollY : null;
  },

  _restoreLearnScrollAfterNav: function() {
    if (!Lessons._isLearnScreenActive()) return;
    var y = Lessons._learnPendingScrollY;
    if (!(typeof y === 'number' && isFinite(y) && y > 0)) return;

    // Clear pending immediately to avoid repeated jumps.
    Lessons._learnPendingScrollY = null;

    // Run after UI.goTo() finishes and after DOM height exists.
    setTimeout(function() {
      try { window.scrollTo(0, y); } catch (e) {}
    }, 25);
  },

  _bindLearnScrollPersistenceOnce: function() {
    if (Lessons._learnScrollBound) return;
    Lessons._learnScrollBound = true;

    function scheduleSave() {
      if (Lessons._learnScrollSaveTimer) return;
      Lessons._learnScrollSaveTimer = setTimeout(function() {
        Lessons._learnScrollSaveTimer = null;
        Lessons._learnLastScrollSavedAt = Date.now();
        Lessons._saveLearnUiStateNow();
      }, LEARN_SCROLL_SAVE_THROTTLE_MS);
    }

    window.addEventListener('scroll', function() {
      if (!Lessons._isLearnScreenActive()) return;

      // Sticky header polish: add shadow only once the user scrolls
      try {
        var sticky = document.getElementById('learn-sticky-header');
        if (sticky) {
          var yNow = 0;
          try { yNow = window.scrollY || window.pageYOffset || 0; } catch (e0) { yNow = 0; }
          sticky.classList.toggle('is-scrolled', yNow > 0);
        }
      } catch (e1) {}

      var now = Date.now();
      if (!Lessons._learnLastScrollSavedAt || (now - Lessons._learnLastScrollSavedAt) >= LEARN_SCROLL_SAVE_THROTTLE_MS) {
        Lessons._learnLastScrollSavedAt = now;
        Lessons._saveLearnUiStateNow();
        return;
      }
      scheduleSave();
    }, { passive: true });
  },

  // ===== Recent Lessons =====

  _loadRecentLessons: function() {
    var arr = Lessons._loadJson(BOLO_RECENT_LESSONS_KEY, []);
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var id = arr[i];
      if (typeof id === 'string' && id.indexOf('L_') === 0 && out.indexOf(id) === -1) out.push(id);
      if (out.length >= LEARN_RECENT_CAP) break;
    }
    return out;
  },

  _pushRecentLesson: function(lessonId) {
    if (!lessonId || typeof lessonId !== 'string') return;
    var list = Lessons._loadRecentLessons();
    var idx = list.indexOf(lessonId);
    if (idx >= 0) list.splice(idx, 1);
    list.unshift(lessonId);
    if (list.length > LEARN_RECENT_CAP) list = list.slice(0, LEARN_RECENT_CAP);
    Lessons._saveJson(BOLO_RECENT_LESSONS_KEY, list);
  },

  // ===== Favorites =====

  _loadFavorites: function() {
    var arr = Lessons._loadJson(BOLO_FAVORITES_KEY, []);
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var id = arr[i];
      if (typeof id === 'string' && id.indexOf('L_') === 0 && out.indexOf(id) === -1) out.push(id);
    }
    return out;
  },

  _saveFavorites: function(list) {
    if (!Array.isArray(list)) list = [];
    Lessons._saveJson(BOLO_FAVORITES_KEY, list);
  },

  _isFavorite: function(lessonId) {
    var favs = Lessons._loadFavorites();
    return favs.indexOf(lessonId) >= 0;
  },

  _toggleFavorite: function(lessonId) {
    if (!lessonId || typeof lessonId !== 'string') return;
    var favs = Lessons._loadFavorites();
    var idx = favs.indexOf(lessonId);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.unshift(lessonId);
    Lessons._saveFavorites(favs);
  },

  _renderSavedSection: function(parentEl, filteredById) {
    if (!parentEl) return;
    var favIds = Lessons._loadFavorites();
    if (!favIds.length) return;

    var metas = [];
    for (var i = 0; i < favIds.length; i++) {
      var id = favIds[i];
      if (filteredById && filteredById[id] !== true) continue;
      var meta = Lessons.findLessonMeta(id);
      if (meta) metas.push(meta);
    }
    if (!metas.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.style.marginTop = '10px';

    var title = document.createElement('div');
    title.className = 'learn-section-title';
    title.textContent = 'Saved';
    wrap.appendChild(title);

    var strip = document.createElement('div');
    strip.className = 'tracks-strip';

    var limit = Lessons._savedShowAll ? metas.length : Math.min(LEARN_SAVED_PREVIEW_CAP, metas.length);
    for (var j = 0; j < limit; j++) {
      var m = metas[j];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'track-pill';
      btn.setAttribute('data-lesson-id', m.id);
      btn.textContent = (m.labelEn || m.id) + (m.labelPa ? (' — ' + m.labelPa) : '');
      strip.appendChild(btn);
    }
    wrap.appendChild(strip);

    if (metas.length > LEARN_SAVED_PREVIEW_CAP) {
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'btn btn-secondary btn-small';
      toggle.setAttribute('data-action', 'saved-toggle');
      toggle.textContent = Lessons._savedShowAll ? 'Show less' : ('Show all (' + metas.length + ')');
      wrap.appendChild(toggle);
    }

    parentEl.appendChild(wrap);
  },

  _renderRecentSection: function(parentEl, filteredById) {
    if (!parentEl) return;
    var ids = Lessons._loadRecentLessons();
    if (!ids.length) return;

    var metas = [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      if (filteredById && filteredById[id] !== true) continue;
      var meta = Lessons.findLessonMeta(id);
      if (meta) metas.push(meta);
    }
    if (!metas.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.style.marginTop = '10px';

    var title = document.createElement('div');
    title.className = 'learn-section-title';
    title.textContent = 'Recent';
    wrap.appendChild(title);

    var strip = document.createElement('div');
    strip.className = 'tracks-strip';
    for (var j = 0; j < metas.length; j++) {
      var m = metas[j];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'track-pill';
      btn.setAttribute('data-lesson-id', m.id);
      btn.textContent = (m.labelEn || m.id) + (m.labelPa ? (' — ' + m.labelPa) : '');
      strip.appendChild(btn);
    }
    wrap.appendChild(strip);

    parentEl.appendChild(wrap);
  },

  _renderContinueCard: function(containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    var suggestion = Lessons.getAdaptiveSuggestion();
    var lessonId = suggestion && suggestion.lessonId ? suggestion.lessonId : null;

    if (!lessonId && Array.isArray(LESSON_META) && LESSON_META.length) {
      lessonId = LESSON_META[0].id;
    }
    if (!lessonId) return;

    var meta = Lessons._getSafeLessonMetaById(lessonId) || {};
    var titleEn = meta.labelEn || (suggestion && suggestion.labelEn) || 'Continue';
    var titlePa = meta.labelPa || (suggestion && suggestion.labelPa) || '';
    var trackName = (suggestion && suggestion.trackName) || ((TRACKS[meta.trackId] && (TRACKS[meta.trackId].nameEn || TRACKS[meta.trackId].name)) || '');

    var card = document.createElement('div');
    card.className = 'card';
    card.style.marginTop = '10px';

    var t = document.createElement('div');
    t.className = 'section-title';
    t.textContent = 'Continue';

    var sub = document.createElement('p');
    sub.className = 'section-subtitle';
    sub.textContent = (trackName ? (trackName + ' • ') : '') + titleEn;

    // Compact progress subtext: prefer last opened lesson label when available
    var sub2 = document.createElement('p');
    sub2.className = 'section-subtitle';
    var lastId = null;
    try {
      lastId = (State && State.state && State.state.session && State.state.session.currentLessonId) ? State.state.session.currentLessonId : null;
    } catch (e) {
      lastId = null;
    }
    if (!lastId) {
      try {
        var rec = Lessons._loadRecentLessons();
        lastId = (rec && rec.length) ? rec[0] : null;
      } catch (e2) {
        lastId = null;
      }
    }
    if (lastId) {
      var lm = Lessons.findLessonMeta(lastId);
      sub2.textContent = lm ? ('Last: ' + (lm.labelEn || lastId)) : 'Pick up where you left off';
    } else {
      sub2.textContent = 'Pick up where you left off';
    }

    var pa = document.createElement('p');
    pa.className = 'section-subtitle';
    pa.setAttribute('lang', 'pa');
    pa.textContent = titlePa || '';

    var row = document.createElement('div');
    row.className = 'button-row';
    row.style.marginTop = '10px';

    var btn = document.createElement('button');
    btn.className = 'btn btn-small';
    btn.setAttribute('data-action', 'learn-continue');
    btn.setAttribute('data-lesson-id', lessonId);
    btn.textContent = 'Continue Lesson';

    row.appendChild(btn);
    card.appendChild(t);
    card.appendChild(sub);
    card.appendChild(sub2);
    if (pa.textContent) card.appendChild(pa);
    card.appendChild(row);
    containerEl.appendChild(card);
  },

  _renderLearnQuickFilters: function(slotEl) {
    if (!slotEl) return;
    slotEl.innerHTML = '';

    var row = document.createElement('div');
    row.className = 'learn-quick-filters';

    function addChip(key, label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'learn-chip' + (Lessons._learnQuickFilter === key ? ' is-active' : '');
      btn.setAttribute('data-action', 'learn-chip');
      btn.setAttribute('data-chip', key);
      btn.setAttribute('aria-pressed', Lessons._learnQuickFilter === key ? 'true' : 'false');
      btn.textContent = label;
      row.appendChild(btn);
    }

    addChip('all', 'All');
    addChip('easy', 'Easy');
    addChip('medium', 'Medium');
    addChip('hard', 'Hard');
    addChip('saved', 'Saved');

    slotEl.appendChild(row);
  },

  _applyQuickFilterToMetaList: function(list) {
    var out = Array.isArray(list) ? list.slice() : [];
    var qf = Lessons._learnQuickFilter || 'all';
    if (qf === 'all') return out;

    if (qf === 'saved') {
      var favIds = Lessons._loadFavorites();
      if (!favIds.length) return [];
      var favMap = {};
      for (var i = 0; i < favIds.length; i++) favMap[favIds[i]] = true;
      return out.filter(function(m) { return m && m.id && favMap[m.id] === true; });
    }

    var target = (qf === 'easy') ? 1 : (qf === 'medium' ? 2 : (qf === 'hard' ? 3 : null));
    if (!target) return out;
    return out.filter(function(m) {
      if (!m) return false;
      // If difficulty missing, treat as pass-through (All) per spec
      if (!m.difficulty) return true;
      return m.difficulty === target;
    });
  },

  _bindLearnStickyDelegationOnce: function() {
    var header = document.getElementById('learn-sticky-header');
    if (!header || Lessons._learnStickyBound) return;
    Lessons._learnStickyBound = true;

    header.addEventListener('click', function(e) {
      var t = e.target;
      if (!t) return;

      var chip = t.closest ? t.closest('[data-action="learn-chip"]') : null;
      if (chip) {
        var key = chip.getAttribute('data-chip') || 'all';
        Lessons._learnQuickFilter = key;

        // Map quick difficulty filters into existing checkboxes for consistency
        if (key === 'easy') Lessons.activeFilters.difficulty = [1];
        else if (key === 'medium') Lessons.activeFilters.difficulty = [2];
        else if (key === 'hard') Lessons.activeFilters.difficulty = [3];
        else if (key === 'all' || key === 'saved') Lessons.activeFilters.difficulty = [1, 2, 3];

        Lessons.syncFilterControls();
        Lessons.saveFiltersToState();
        Lessons.renderLearnSections();
      }
    });
  },

  _renderLessonCardForLearn: function(meta, track) {
    var card = document.createElement('div');
    card.className = 'lesson-card';
    card.style.cursor = 'pointer';
    card.style.position = 'relative';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-lesson-id', meta.id);
    card.setAttribute('data-track-id', meta.trackId);

    var statusLabel = Lessons.getLessonStatus(meta.id);
    card.setAttribute('aria-label', (meta.labelEn || meta.id) + ' (' + statusLabel + ')');

    var nameEl = document.createElement('div');
    nameEl.className = 'lesson-name';
    nameEl.textContent = meta.labelEn || meta.id;

    var paEl = document.createElement('div');
    paEl.className = 'lesson-pa';
    paEl.textContent = meta.labelPa || '';

    var tagRow = document.createElement('div');
    tagRow.className = 'lesson-tag-row';

    if (meta.difficulty) {
      var diffSpan = document.createElement('span');
      diffSpan.className = 'lesson-difficulty';
      var stars = '';
      for (var s = 0; s < meta.difficulty; s++) stars += '★';
      diffSpan.textContent = stars;
      tagRow.appendChild(diffSpan);
    }

    var trackSpan = document.createElement('span');
    trackSpan.textContent = (track && track.name) ? track.name : (meta.trackId || '');
    trackSpan.style.color = '#6b7fa3';

    var statusSpan = document.createElement('span');
    statusSpan.className = 'lesson-status-pill';
    statusSpan.textContent = statusLabel;

    tagRow.appendChild(trackSpan);
    tagRow.appendChild(statusSpan);

    card.appendChild(nameEl);
    if (paEl.textContent) card.appendChild(paEl);
    card.appendChild(tagRow);

    // Favorite toggle (Learn screen only)
    var favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.className = 'learn-fav-btn' + (Lessons._isFavorite(meta.id) ? ' is-fav' : '');
    favBtn.setAttribute('data-action', 'toggle-favorite');
    favBtn.setAttribute('data-lesson-id', meta.id);
    favBtn.setAttribute('aria-label', Lessons._isFavorite(meta.id) ? 'Unsave lesson' : 'Save lesson');
    favBtn.textContent = Lessons._isFavorite(meta.id) ? '★' : '☆';
    card.appendChild(favBtn);

    LearnQA.logCardRendered(meta.id, meta.labelEn, meta.labelPa);
    return card;
  },

  _renderTrackLessonsInto: function(trackId, bodyEl, limit, lessonsSorted, track) {
    if (!bodyEl) return;
    bodyEl.style.display = '';
    bodyEl.innerHTML = '';

    var list = Array.isArray(lessonsSorted) ? lessonsSorted : [];
    var toShow = Math.min(list.length, Math.max(0, limit || LEARN_PREVIEW_COUNT));

    var grid = document.createElement('div');
    grid.className = 'parts-grid';
    grid.setAttribute('data-track', trackId);

    for (var i = 0; i < toShow; i++) {
      grid.appendChild(Lessons._renderLessonCardForLearn(list[i], track));
    }

    bodyEl.appendChild(grid);

    if (list.length > toShow) {
      var remaining = list.length - toShow;
      var showMoreBtn = document.createElement('button');
      showMoreBtn.className = 'btn btn-secondary show-more-btn';
      showMoreBtn.setAttribute('data-action', 'show-more');
      showMoreBtn.setAttribute('data-track-id', trackId);
      showMoreBtn.textContent = 'Show More (' + remaining + ' more)';
      bodyEl.appendChild(showMoreBtn);
    }
  },

  _renderTrackSectionShell: function(trackId, track, lessonsSorted, shownInTrack, totalInTrack) {
    var sectionEl = document.createElement('div');
    sectionEl.className = 'learn-track-section';
    sectionEl.setAttribute('data-track-id', trackId);

    var header = document.createElement('div');
    header.className = 'learn-section-title';

    var left = document.createElement('div');
    left.textContent = (track.name || track.nameEn || trackId);

    var right = document.createElement('div');
    right.className = 'learn-track-header-meta';

    // Stats: N lessons + S saved
    var savedCount = 0;
    try {
      var favs = Lessons._loadFavorites();
      if (favs && favs.length) {
        var favMap = {};
        for (var fi = 0; fi < favs.length; fi++) favMap[favs[fi]] = true;
        for (var li = 0; li < lessonsSorted.length; li++) {
          if (lessonsSorted[li] && favMap[lessonsSorted[li].id] === true) savedCount++;
        }
      }
    } catch (e) {
      savedCount = 0;
    }

    var stats = document.createElement('span');
    stats.textContent = lessonsSorted.length + ' lessons' + (savedCount ? (' • ' + savedCount + ' saved') : '');

    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-secondary btn-small';
    toggleBtn.setAttribute('data-action', 'toggle-track');
    toggleBtn.setAttribute('data-track-id', trackId);
    toggleBtn.setAttribute('aria-expanded', Lessons.expandedTracks[trackId] ? 'true' : 'false');

    var chev = document.createElement('span');
    chev.className = 'learn-chevron' + (Lessons.expandedTracks[trackId] ? ' is-open' : '');
    chev.textContent = '▾';
    toggleBtn.textContent = Lessons.expandedTracks[trackId] ? 'Hide ' : 'Show ';
    toggleBtn.appendChild(chev);

    right.appendChild(stats);
    right.appendChild(toggleBtn);

    header.appendChild(left);
    header.appendChild(right);

    // Attach track health indicators (data attributes for CSS)
    Lessons._attachTrackHealthIndicators(header, trackId);

    var sub = document.createElement('div');
    sub.className = 'learn-section-sub';
    sub.textContent = track.descEn || '';

    var body = document.createElement('div');
    body.className = 'learn-track-body';
    body.setAttribute('data-track-body', '1');
    body.setAttribute('data-track-id', trackId);

    sectionEl.appendChild(header);
    sectionEl.appendChild(sub);

    // Collapsed preview chips (2–3), only when collapsed
    if (!Lessons.expandedTracks[trackId]) {
      var preview = document.createElement('div');
      preview.className = 'tracks-strip';
      var max = Math.min(3, lessonsSorted.length);
      for (var pi = 0; pi < max; pi++) {
        var m = lessonsSorted[pi];
        if (!m) continue;
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'track-pill';
        chip.setAttribute('data-lesson-id', m.id);
        chip.textContent = (m.labelEn || m.id) + (m.labelPa ? (' — ' + m.labelPa) : '');
        preview.appendChild(chip);
      }
      sectionEl.appendChild(preview);
    }
    sectionEl.appendChild(body);

    if (Lessons.expandedTracks[trackId]) {
      var limit = Lessons._learnTrackLimits[trackId] || LEARN_PREVIEW_COUNT;
      Lessons._renderTrackLessonsInto(trackId, body, limit, lessonsSorted, track);
    } else {
      body.style.display = 'none';
      body.innerHTML = '';
    }

    return sectionEl;
  },

  _bindLearnDelegationOnce: function() {
    var learnTrackSectionsEl = document.getElementById('learn-track-sections');
    if (!learnTrackSectionsEl || Lessons._learnDelegationBound) return;
    Lessons._learnDelegationBound = true;

    learnTrackSectionsEl.addEventListener('click', function(e) {
      var t = e.target;
      if (!t) return;

      var actionEl = t.closest ? t.closest('[data-action]') : null;
      if (actionEl) {
        var action = actionEl.getAttribute('data-action');
        var tid = actionEl.getAttribute('data-track-id');

        if (action === 'toggle-favorite') {
          var fid = actionEl.getAttribute('data-lesson-id');
          if (fid) {
            e.preventDefault();
            try { e.stopPropagation(); } catch (err) {}
            Lessons._toggleFavorite(fid);
            Lessons.renderLearnSections();
          }
          return;
        }

        if (action === 'saved-toggle') {
          e.preventDefault();
          Lessons._savedShowAll = !Lessons._savedShowAll;
          Lessons.renderLearnSections();
          return;
        }

        if (action === 'toggle-track' && tid) {
          if (Lessons.expandedTracks[tid]) Lessons.collapseTrack(tid);
          else Lessons.expandTrack(tid);
          return;
        }
        if (action === 'show-more' && tid) {
          var cur = Lessons._learnTrackLimits[tid] || LEARN_PREVIEW_COUNT;
          Lessons._learnTrackLimits[tid] = cur + LEARN_SHOW_MORE_INCREMENT;
          Lessons._saveLearnUiStateNow();
          Lessons.renderLearnSections();
          return;
        }
      }

      var cardEl = t.closest ? t.closest('[data-lesson-id]') : null;
      if (cardEl) {
        var lessonId = cardEl.getAttribute('data-lesson-id');
        if (lessonId) Lessons.startLesson(lessonId);
      }
    });

    learnTrackSectionsEl.addEventListener('keydown', function(e) {
      if (!(e.key === 'Enter' || e.key === ' ')) return;
      var t = e.target;

      // If focused on the favorite control, toggle without opening the lesson
      var actionEl = t && t.closest ? t.closest('[data-action]') : null;
      if (actionEl && actionEl.getAttribute('data-action') === 'toggle-favorite') {
        var fid = actionEl.getAttribute('data-lesson-id');
        if (fid) {
          e.preventDefault();
          Lessons._toggleFavorite(fid);
          Lessons.renderLearnSections();
        }
        return;
      }

      var cardEl = t && t.closest ? t.closest('[data-lesson-id]') : null;
      if (!cardEl) return;
      var lessonId = cardEl.getAttribute('data-lesson-id');
      if (!lessonId) return;
      e.preventDefault();
      Lessons.startLesson(lessonId);
    });

    var continueSlot = document.getElementById('learn-continue-slot');
    if (continueSlot && !continueSlot.dataset.bound) {
      continueSlot.dataset.bound = '1';
      continueSlot.addEventListener('click', function(e) {
        var btn = e.target && e.target.closest ? e.target.closest('[data-action="learn-continue"]') : null;
        if (!btn) return;
        var lessonId = btn.getAttribute('data-lesson-id');
        if (lessonId) Lessons.startLesson(lessonId);
      });
    }
  },

  renderLearnSections: function() {
    Lessons._bindLearnDelegationOnce();
    Lessons._bindLearnStickyDelegationOnce();

    var continueSlot = document.getElementById('learn-continue-slot');
    var filtersSlot = document.getElementById('learn-filters-slot');
    var learnTrackSectionsEl = document.getElementById("learn-track-sections");
    if (!learnTrackSectionsEl) return;
    learnTrackSectionsEl.innerHTML = "";
    if (continueSlot) continueSlot.innerHTML = '';
    if (filtersSlot) filtersSlot.innerHTML = '';
    
    // Update progress summary
    Lessons.updateProgressSummary();

    if (continueSlot) Lessons._renderContinueCard(continueSlot);
    if (filtersSlot) Lessons._renderLearnQuickFilters(filtersSlot);
    
    // Apply filters to get filtered lessons
    var filtered = Lessons.applyFilters();
    filtered = Lessons._applyQuickFilterToMetaList(filtered);
    LearnQA.logLessonsPerTrack();
    LearnQA.logFilterState(filtered);
    
    Lessons.renderActiveFilters();

    // Display results count
    Lessons._updateResultsCount(filtered.length);

    // Update filters summary badge
    Lessons._updateFiltersSummary();

    // Map filtered ids (used to keep Saved/Recent consistent with filters)
    var filteredById = {};
    for (var fi = 0; fi < filtered.length; fi++) {
      if (filtered[fi] && filtered[fi].id) filteredById[filtered[fi].id] = true;
    }

    // Saved then Recent (above track accordions)
    Lessons._renderSavedSection(learnTrackSectionsEl, filteredById);
    Lessons._renderRecentSection(learnTrackSectionsEl, filteredById);

    if (filtered.length === 0) {
      var noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.innerHTML = "No lessons match your filters." +
        "<div class='suggestions'><button class='btn btn-secondary btn-small' id='btn-clear-filters-inline'>Clear Filters</button></div>";
      learnTrackSectionsEl.appendChild(noResults);
      var inlineClear = document.getElementById("btn-clear-filters-inline");
      if (inlineClear) inlineClear.addEventListener("click", function() { Lessons.clearFilters(); });
      return;
    }
    
    // Group by track
    // Keep known order, but never drop lessons that belong to additional tracks.
    var order = ["T_WORDS", "T_ACTIONS", "T_DESCRIBE", "T_SENTENCE", "T_READING"];
    var byTrack = {};
    for (var i = 0; i < filtered.length; i++) {
      var meta = filtered[i];
      if (!byTrack[meta.trackId]) byTrack[meta.trackId] = [];
      byTrack[meta.trackId].push(meta);
    }

    // Append any tracks present in results (defensive: prevents silent drops)
    for (var tid in byTrack) {
      if (byTrack.hasOwnProperty(tid) && order.indexOf(tid) === -1) {
        order.push(tid);
      }
    }
    
    // Render each track section
    for (var oi = 0; oi < order.length; oi++) {
      var trackId = order[oi];
      var lessons = Lessons.sortLessonsAdaptive(byTrack[trackId] || [], trackId);
      if (!lessons || !lessons.length) continue;
      
      var track = TRACKS[trackId] || { name: trackId };
      
      var totalInTrack = Lessons.getLessonsByTrack(trackId).length;
      var shownInTrack = lessons.length;

      Lessons._learnLastByTrack[trackId] = lessons;

      // Default collapsed (unless user already expanded)
      if (typeof Lessons.expandedTracks[trackId] === 'undefined') {
        Lessons.expandedTracks[trackId] = false;
      }

      var sectionEl = Lessons._renderTrackSectionShell(trackId, track, lessons, shownInTrack, totalInTrack);
      learnTrackSectionsEl.appendChild(sectionEl);
    }

    // After dynamic render, re-sync local controls (idempotent)
    try { if (typeof Lessons.syncFilterControls === 'function') Lessons.syncFilterControls(); } catch (e) {}
    try { if (typeof Lessons.syncQAToggle === 'function') Lessons.syncQAToggle(); } catch (e) {}
  },

  // Get lessons by track ID
  
  // Apply current filters and return filtered lessons
  applyFilters: function() {
    var filtered = [];
    for (var i = 0; i < LESSON_META.length; i++) {
      var meta = LESSON_META[i];
      
      // Search filter
      if (Lessons.activeFilters.search) {
        var search = Lessons.activeFilters.search.toLowerCase();
        var matchEn = meta.labelEn && meta.labelEn.toLowerCase().indexOf(search) !== -1;
        var matchPa = meta.labelPa && meta.labelPa.toLowerCase().indexOf(search) !== -1;
        if (!matchEn && !matchPa) continue;
      }
      
      // Status filter
      var status = Lessons.getLessonStatus(meta.id);
      if (Lessons.activeFilters.status === 'not-started' && status !== 'Not started') continue;
      if (Lessons.activeFilters.status === 'done' && status !== 'Done') continue;
      if (Lessons.activeFilters.status === 'in-progress') {
        // In progress means started but not done
        var lpSess = (State.state.session && State.state.session.lessonProgress) ? State.state.session.lessonProgress : {};
        var p = lpSess[meta.id];
        var started = !!(p && (p.stepsCompleted > 0 || p.pointsEarned > 0));
        var done = State.state.progress.lessonDone[meta.id];
        if (!started || done) continue;
      }
      
      // Difficulty filter
      if (meta.difficulty && Lessons.activeFilters.difficulty.indexOf(meta.difficulty) === -1) continue;
      
      // Track filter
      if (Lessons.activeFilters.track !== 'all' && meta.trackId !== Lessons.activeFilters.track) continue;
      
      filtered.push(meta);
    }
    return filtered;
  },

  // Adaptive sorting helpers
  computeTrackStats: function(trackId, cache) {
    var store = cache || {};
    if (store[trackId]) return store[trackId];
    var bucket = (State.state.progress && State.state.progress.trackXP && State.state.progress.trackXP[trackId]) ? State.state.progress.trackXP[trackId] : null;
    var attempts = bucket && bucket.questionsAttempted ? bucket.questionsAttempted : 0;
    var correct = bucket && bucket.questionsCorrect ? bucket.questionsCorrect : 0;
    var pct = attempts ? Math.round((correct / attempts) * 100) : null;
    var stats = { attempts: attempts, correct: correct, accuracyPct: pct };
    store[trackId] = stats;
    return stats;
  },

  getTrackTargetDifficulty: function(trackId, cache) {
    var stats = Lessons.computeTrackStats(trackId, cache);
    if (!stats || stats.attempts < 3 || stats.accuracyPct === null) return 2;
    if (stats.accuracyPct >= 85) return 3;
    if (stats.accuracyPct >= 60) return 2;
    return 1;
  },

  compareLessonsAdaptive: function(a, b, targetDiff) {
    var statusOrder = { "Not started": 0, "In progress": 1, "Done": 2 };
    var sa = statusOrder[Lessons.getLessonStatus(a.id)] || 0;
    var sb = statusOrder[Lessons.getLessonStatus(b.id)] || 0;
    if (sa !== sb) return sa - sb;

    var da = Math.abs(((a.difficulty || 2) - (targetDiff || 2)));
    var db = Math.abs(((b.difficulty || 2) - (targetDiff || 2)));
    if (da !== db) return da - db;

    return (a.order || 0) - (b.order || 0) || (a.labelEn || a.id || '').localeCompare(b.labelEn || b.id || '');
  },

  sortLessonsAdaptive: function(list, trackId) {
    var lessons = Array.isArray(list) ? list.slice() : [];
    var target = Lessons.getTrackTargetDifficulty(trackId);
    lessons.sort(function(a, b) { return Lessons.compareLessonsAdaptive(a, b, target); });
    return lessons;
  },

  getAdaptiveSuggestion: function() {
    var cache = {};
    var best = null;
    var bestScore = Infinity;

    for (var i = 0; i < LESSON_META.length; i++) {
      var meta = LESSON_META[i];
      if (!meta) continue;

      var status = Lessons.getLessonStatus(meta.id);
      var statusPenalty = (status === 'In progress') ? 0 : (status === 'Not started' ? 0.5 : 3);
      if (status === 'Done') statusPenalty = 3;

      var target = Lessons.getTrackTargetDifficulty(meta.trackId, cache);
      var diffPenalty = Math.abs(((meta.difficulty || 2) - (target || 2)));
      var stats = Lessons.computeTrackStats(meta.trackId, cache);
      var attemptPenalty = (!stats || !stats.attempts) ? 0.25 : 0;
      var score = statusPenalty + diffPenalty + attemptPenalty;

      if (score < bestScore) {
        bestScore = score;
        var trackMeta = (typeof TRACKS === 'object' && TRACKS[meta.trackId]) ? TRACKS[meta.trackId] : null;
        var trackName = trackMeta ? (trackMeta.nameEn || trackMeta.name || meta.trackId) : meta.trackId;
        best = {
          meta: meta,
          trackName: trackName,
          stats: stats,
          target: target
        };
      }
    }

    if (!best) return null;

    var accText;
    if (!best.stats || best.stats.accuracyPct === null) {
      accText = "No attempts yet";
    } else {
      accText = best.stats.accuracyPct + "% accuracy in " + best.trackName;
    }

    var reason;
    if (!best.stats || best.stats.accuracyPct === null) {
      reason = "No data yet — starting at difficulty " + (best.target || 2) + ".";
    } else {
      reason = "Targeting difficulty " + (best.target || 2) + " based on " + best.stats.accuracyPct + "% accuracy.";
    }

    return {
      lessonId: best.meta.id,
      labelEn: best.meta.labelEn,
      labelPa: best.meta.labelPa,
      trackName: best.trackName,
      accuracyText: accText,
      reason: reason
    };
  },

  // ===== Feedback Overlay (lightweight, reusable) =====
  ensureFeedbackOverlay: function() {
    var overlay = document.getElementById('lesson-feedback-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'lesson-feedback-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = "<div class='overlay-card'><div class='overlay-status'></div><div class='overlay-body'></div><div class='overlay-actions'><button type='button' class='btn btn-small overlay-btn' id='overlay-close-btn'>Close</button></div></div>";
    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('#overlay-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        Lessons.hideFeedbackOverlay();
      });
    }

    return overlay;
  },

  showFeedbackOverlay: function(payload) {
    if (!payload || !payload.statusEn) return;
    var overlay = Lessons.ensureFeedbackOverlay();
    if (!overlay) return;

    var card = overlay.querySelector('.overlay-card');
    var statusEl = overlay.querySelector('.overlay-status');
    var bodyEl = overlay.querySelector('.overlay-body');
    var closeBtn = overlay.querySelector('#overlay-close-btn');

    var parts = [];
    if (payload.hint && (payload.hint.en || payload.hint.pa)) {
      parts.push({ label: 'Hint', en: payload.hint.en, pa: payload.hint.pa });
    }
    if (payload.explanation && (payload.explanation.en || payload.explanation.pa)) {
      parts.push({ label: 'Why', en: payload.explanation.en, pa: payload.explanation.pa });
    }

    // Worked example (English only for brevity)
    if (payload.worked && (payload.worked.en || payload.worked.pa)) {
      parts.push({ label: 'Example', en: payload.worked.en, pa: payload.worked.pa });
    }

    statusEl.textContent = payload.statusEn;
    var punjabiOn = Lessons.shouldShowPunjabi();
    if (payload.statusPa && punjabiOn) {
      var paLine = document.createElement('div');
      paLine.className = 'overlay-status-pa';
      paLine.textContent = payload.statusPa;
      statusEl.appendChild(paLine);
    }

    var html = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      html += "<div class='overlay-block'><div class='overlay-block-label'>" + Lessons.escapeHtml(p.label) + "</div>";
      if (p.en) html += "<div class='overlay-line overlay-en'>" + Lessons.escapeHtml(p.en) + "</div>";
      if (punjabiOn && p.pa) html += "<div class='overlay-line overlay-pa' lang='pa'>" + Lessons.escapeHtml(p.pa) + "</div>";
      html += "</div>";
    }
    if (!html) {
      html = "<div class='overlay-line overlay-en'>Keep going!</div>";
    }
    bodyEl.innerHTML = html;

    if (card) {
      card.classList.toggle('correct', !!payload.correct);
      card.classList.toggle('wrong', !payload.correct);
    }

    if (closeBtn) {
      closeBtn.textContent = payload.correct ? 'Great!' : (payload.canContinue ? 'Next' : 'Try again');
    }

    overlay.classList.add('active');
  },

  hideFeedbackOverlay: function() {
    var overlay = document.getElementById('lesson-feedback-overlay');
    if (overlay) overlay.classList.remove('active');
  },
  
  // Expand a track to show all lessons
  expandTrack: function(trackId) {
    Lessons.expandedTracks[trackId] = true;
    if (!Lessons._learnTrackLimits[trackId]) Lessons._learnTrackLimits[trackId] = LEARN_PREVIEW_COUNT;
    Lessons._saveLearnUiStateNow();
    Lessons.renderLearnSections();
  },
  collapseTrack: function(trackId) {
    Lessons.expandedTracks[trackId] = false;
    delete Lessons._learnTrackLimits[trackId];
    Lessons._saveLearnUiStateNow();
    Lessons.renderLearnSections();
  },
  
  // Update progress summary cards
  updateProgressSummary: function() {
    var totalEl = document.getElementById("total-lessons");
    var completedEl = document.getElementById("completed-lessons");
    var progressEl = document.getElementById("progress-lessons");
    var xpEl = document.getElementById("total-xp");
    
    if (!totalEl) return;

    if (State && State.ensureTracksInitialized) State.ensureTracksInitialized();
    
    var total = LESSON_META.length;
    var completed = 0;
    var inProgress = 0;

    var lpSess = (State.state.session && State.state.session.lessonProgress) ? State.state.session.lessonProgress : {};
    
    for (var i = 0; i < LESSON_META.length; i++) {
      var meta = LESSON_META[i];
      if (State.state.progress.lessonDone[meta.id]) {
        completed++;
      } else {
        var p = lpSess[meta.id];
        var started = !!(p && (p.stepsCompleted > 0 || p.pointsEarned > 0));
        if (started) inProgress++;
      }
    }
    
    totalEl.textContent = total;
    completedEl.textContent = completed;
    progressEl.textContent = inProgress;
    // Prefer computed XP from tracks; fallback to stored totalXP
    var trackXP = State.state.progress.trackXP || {};
    var xpSum = 0;
    for (var k in trackXP) {
      if (trackXP.hasOwnProperty(k) && typeof trackXP[k].xp === 'number') {
        xpSum += trackXP[k].xp;
      }
    }
    if (xpEl) xpEl.textContent = xpSum || State.state.progress.totalXP || 0;

    // Adaptive highlights
    var suggestion = Lessons.getAdaptiveSuggestion();
    var nextEl = document.getElementById('learn-next-lesson');
    var reasonEl = document.getElementById('learn-next-reason');
    var accEl = document.getElementById('learn-accuracy');
    var streakEl = document.getElementById('learn-streak');

    if (nextEl) {
      nextEl.textContent = suggestion ? (suggestion.labelEn + ' (' + suggestion.trackName + ')') : 'Pick any lesson to begin';
    }
    if (reasonEl) {
      reasonEl.textContent = suggestion ? suggestion.reason : 'No data yet — explore a track to personalize.';
    }
    if (accEl) {
      accEl.textContent = suggestion && suggestion.accuracyText ? suggestion.accuracyText : 'No attempts yet';
    }
    if (streakEl) {
      var dq = (typeof State !== 'undefined' && State.getDailyQuestProfileContainer) ? State.getDailyQuestProfileContainer() : null;
      var streak = dq && dq.streakCount ? dq.streakCount : 0;
      Lessons._updateStreakBadge(streak);
    }
  },

  // Active filters chips rendering
  renderActiveFilters: function() {
    var container = document.getElementById("active-filters");
    if (!container) return;
    container.innerHTML = "";

    var defaults = { search: '', status: 'all', difficulty: [1,2,3], track: 'all' };
    var f = Lessons.activeFilters;
    var any = false;

    function addChip(label, onRemove) {
      any = true;
      var chip = document.createElement("span");
      chip.className = "filter-chip";
      chip.innerHTML = label + " <span class='chip-x' aria-label='Remove' role='button'>✕</span>";
      chip.querySelector('.chip-x').addEventListener('click', onRemove);
      container.appendChild(chip);
    }

    if (f.search && f.search.trim()) {
      addChip("Search: " + f.search.trim(), function(){ f.search=''; Lessons.syncFilterControls(); Lessons.saveFiltersToState(); Lessons.renderLearnSections(); });
    }
    if (f.status !== 'all') {
      var statusLabel = f.status === 'done' ? 'Completed' : (f.status === 'not-started' ? 'Not Started' : 'In Progress');
      addChip("Status: " + statusLabel, function(){ f.status='all'; Lessons.syncFilterControls(); Lessons.saveFiltersToState(); Lessons.renderLearnSections(); });
    }
    var diffStr = f.difficulty.join('');
    if (diffStr !== '123') {
      addChip("Difficulty: " + f.difficulty.map(function(d){ return '★'.repeat(d); }).join(' '), function(){ f.difficulty=[1,2,3]; Lessons.syncFilterControls(); Lessons.saveFiltersToState(); Lessons.renderLearnSections(); });
    }
    if (f.track !== 'all') {
      var tName = (TRACKS[f.track] && TRACKS[f.track].name) || f.track;
      addChip("Track: " + tName, function(){ f.track='all'; Lessons.syncFilterControls(); Lessons.saveFiltersToState(); Lessons.renderLearnSections(); });
    }

    // Toggle clear button visibility
    var clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) clearBtn.style.display = any ? 'inline-block' : 'none';
  },

  clearFilters: function() {
    Lessons.activeFilters = { search: '', status: 'all', difficulty: [1,2,3], track: 'all' };
    Lessons.expandedTracks = {};
    Lessons._learnTrackLimits = {};
    Lessons._saveLearnUiStateNow();
    Lessons.syncFilterControls();
    Lessons.saveFiltersToState();
    Lessons.renderLearnSections();
  },

  syncFilterControls: function() {
    var f = Lessons.activeFilters;
    var searchInput = document.getElementById('lesson-search');
    if (searchInput && searchInput.value !== f.search) searchInput.value = f.search;

    var btns = document.querySelectorAll('.filter-btn');
    for (var i=0;i<btns.length;i++){
      btns[i].classList.remove('active');
      btns[i].setAttribute('aria-pressed','false');
    }
    var btn = document.querySelector('.filter-btn[data-filter="'+f.status+'"]');
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
    }

    var diffs = document.querySelectorAll('.diff-filter');
    for (var j=0;j<diffs.length;j++){
      var d = parseInt(diffs[j].getAttribute('data-difficulty'),10);
      diffs[j].checked = f.difficulty.indexOf(d) !== -1;
    }

    var sel = document.getElementById('track-filter');
    if (sel) sel.value = f.track;
  },

  bindQAToggle: function() {
    var qaToggle = document.getElementById('learn-qa-toggle');
    if (!qaToggle || qaToggle.dataset.bound) return;
    qaToggle.dataset.bound = 'true';

    qaToggle.addEventListener('change', function() {
      State.setLearnQAEnabled(!!qaToggle.checked);
      console.log('🎓 [Learn] QA logging ' + (qaToggle.checked ? 'enabled' : 'disabled') + ' via toggle');
      Lessons.syncQAToggle();
      Lessons.renderLearnSections();
    });
  },

  syncQAToggle: function() {
    var qaToggle = document.getElementById('learn-qa-toggle');
    if (!qaToggle) return;
    var enabled = (typeof State !== 'undefined' && State.getLearnQAEnabled) ? State.getLearnQAEnabled() : false;
    qaToggle.checked = enabled;
    qaToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  },

  saveFiltersToState: function() {
    State.state.session = State.state.session || {};
    State.state.session.learnFilters = Lessons.activeFilters;
    State.save();
  },

  restoreFiltersFromState: function() {
    var sf = State.state && State.state.session && State.state.session.learnFilters;
    if (sf) {
      // Defensive normalization
      var status = sf.status || 'all';
      if ([ 'all', 'not-started', 'in-progress', 'done' ].indexOf(status) === -1) status = 'all';

      var difficulty = Array.isArray(sf.difficulty) && sf.difficulty.length ? sf.difficulty.slice().sort() : [1,2,3];
      var cleaned = [];
      for (var i = 0; i < difficulty.length; i++) {
        var d = parseInt(difficulty[i], 10);
        if ((d === 1 || d === 2 || d === 3) && cleaned.indexOf(d) === -1) cleaned.push(d);
      }
      if (!cleaned.length) cleaned = [1,2,3];

      var track = sf.track || 'all';
      if (track !== 'all') {
        if (typeof TRACKS !== 'object' || !TRACKS || !TRACKS[track]) track = 'all';
      }

      Lessons.activeFilters = {
        search: typeof sf.search === 'string' ? sf.search : '',
        status: status,
        difficulty: cleaned,
        track: track
      };
    }
  },

  // Get lessons by track ID
  getLessonsByTrack: function(trackId) {
    var arr = [];
    for (var i = 0; i < LESSON_META.length; i++) {
      if (LESSON_META[i].trackId === trackId) {
        arr.push(LESSON_META[i]);
      }
    }
    return arr;
  },

  // Get lesson status
  getLessonStatus: function(lessonId) {
    if (State.state.progress.lessonDone[lessonId]) {
      return "Done";
    }
    var lpSess = (State.state.session && State.state.session.lessonProgress) ? State.state.session.lessonProgress : {};
    var p = lpSess[lessonId];
    var started = !!(p && (p.stepsCompleted > 0 || p.pointsEarned > 0));
    if (started) return "In progress";
    return "Not started";
  },

  // Find lesson metadata by ID
  findLessonMeta: function(lessonId) {
    for (var i = 0; i < LESSON_META.length; i++) {
      if (LESSON_META[i].id === lessonId) return LESSON_META[i];
    }
    return null;
  },

  // Start a lesson - respects quest context if active
  startLesson: function(lessonId) {
    var meta = Lessons.findLessonMeta(lessonId);
    if (!meta) {
      alert("Lesson not found.");
      return;
    }

    // Persist Learn UI state and record recent lesson (applies even when launched from Continue/Recent/Saved)
    try {
      if (Lessons._isLearnScreenActive()) Lessons._saveLearnUiStateNow();
    } catch (e) {}
    try {
      Lessons._pushRecentLesson(lessonId);
    } catch (e) {}

    LearnQA.logLessonLaunch(lessonId, meta.trackId);

    // Reset session-only attempts when starting a lesson
    Lessons.resetRuntime(lessonId);

    Lessons.currentLessonId = lessonId;
    Lessons.currentLessonTrackId = meta.trackId;
    
    var lesson = Lessons.normalizeLesson(lessonId);
    var baseSteps = (lesson && lesson.steps) ? lesson.steps : [];

    // Inject up to N due review items (non-quest only) while keeping the existing linear flow.
    // Guardrails:
    // - Never inject in quest mode
    // - Preserve objective as the first step if present
    var injected = [];
    try {
      if (!Lessons.isQuestMode()) {
        var due = Lessons.getDueReviewItems(3);
        injected = Lessons.buildInjectedReviewSteps(due);
      }
    } catch (e) {
      injected = [];
    }

    if (injected.length && baseSteps.length) {
      var t0 = baseSteps[0] ? (baseSteps[0].type || baseSteps[0].step_type) : null;
      if (t0 === 'objective') {
        Lessons.currentLessonSteps = [baseSteps[0]].concat(injected).concat(baseSteps.slice(1));
      } else {
        Lessons.currentLessonSteps = injected.concat(baseSteps);
      }
    } else {
      Lessons.currentLessonSteps = baseSteps;
    }
    
    if (!Lessons.currentLessonSteps.length) {
      alert("Content coming soon.");
      return;
    }

    // Respect quest context target step
    var questContext = Lessons.getQuestContext();
    if (questContext && questContext.lessonId === lessonId && questContext.targetStep !== null && questContext.targetStep !== undefined) {
      Lessons.currentStepIndex = questContext.targetStep;
      // Skip objective in quest mode
      Lessons.initLesson(lessonId);
      Lessons.renderLessonHeader(meta);
      Lessons.renderLessonStep();
      UI.goTo("screen-lesson");
    } else {
      // Show objective first in normal mode
      Lessons.initLesson(lessonId);
      Lessons.renderLessonHeader(meta);
      Lessons.currentStepIndex = 0;  // Will render objective
      Lessons.renderLessonStep();
      UI.goTo("screen-lesson");
    }

    State.state.session.currentLessonId = lessonId;
    State.state.session.currentLessonStep = Lessons.currentStepIndex;
    State.save(); // ✅ Persist lesson start position
  },

  // Open lesson (alias for startLesson)
  openLesson: function(lessonId) {
    Lessons.startLesson(lessonId);
  },

  // Render lesson header with quest mode signaling
  renderLessonHeader: function(meta) {
    var lessonTitleEl = document.getElementById("lesson-title");
    var title = meta.labelEn;
    
    // Add Daily Quest prefix if in quest mode
    if (Lessons.isQuestMode()) {
      title = "Daily Quest: " + title;
    }
    
    if (lessonTitleEl) lessonTitleEl.textContent = title;
    
    var lessonTitlePaEl = document.getElementById("lesson-title-pa");
    if (lessonTitlePaEl) {
      var titlePa = meta.labelPa;
      if (Lessons.isQuestMode()) {
        titlePa = "ਰੋਜ਼ਮਰਾਹ - " + titlePa;
      }
      lessonTitlePaEl.textContent = titlePa;
    }
  },

  // Get step type label (enhanced for new types)
  getStepTypeLabel: function(step) {
    if (step && step.isReview === true) return "Review / ਦੁਹਰਾਈ";
    var type = step.type || step.step_type;
    if (type === "objective") return "Objective / ਉਦੇਸ਼";
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

    Lessons.hideFeedbackOverlay();

    State.state.session.currentLessonStep = Lessons.currentStepIndex;
    var step = Lessons.currentLessonSteps[Lessons.currentStepIndex];
    Lessons.inExamplesPhase = false;
    Lessons.currentExampleIndex = 0;
    
    Lessons.initLesson(Lessons.currentLessonId);

    var lessonFeedbackEl = document.getElementById("lesson-feedback");
    if (lessonFeedbackEl) {
      lessonFeedbackEl.innerHTML = "";
      lessonFeedbackEl.className = "feedback";
    }

    Lessons.hideFeedbackOverlay();

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

    var stepText = "Step " + (Lessons.currentStepIndex + 1) + " / " + Lessons.currentLessonSteps.length;
    var lessonStepIndicatorEl = document.getElementById("lesson-step-indicator");
    if (lessonStepIndicatorEl) lessonStepIndicatorEl.textContent = stepText;

    // Instruction line (always, consistent placement)
    try {
      var inst = Lessons.getInstructionForStep(step);
      var instEnEl = document.getElementById('lesson-instruction-en');
      var instPaEl = document.getElementById('lesson-instruction-pa');
      if (instEnEl) instEnEl.textContent = (inst && inst.en) ? String(inst.en) : '';
      if (instPaEl) {
        instPaEl.textContent = (inst && inst.pa) ? String(inst.pa) : '';
        var showPa = Lessons.shouldShowPunjabi();
        instPaEl.style.display = showPa ? '' : 'none';
      }
    } catch (e) {
      // no-op
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
        var stepType = step.type || step.step_type;
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
        lessonTextEnEl.innerHTML = en;
        lessonTextPaEl.innerHTML = pa;
      } else {
        lessonTextEnEl.innerHTML = "Coming Soon!";
        lessonTextPaEl.innerHTML = "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!";
      }
    }

    var nextBtn = document.getElementById("btn-lesson-next");
    var prevBtn = document.getElementById("btn-lesson-prev");
    
    if (prevBtn) {
      if (Lessons.isQuestMode()) {
        prevBtn.style.display = "none";
      } else {
        prevBtn.style.display = "block";
        prevBtn.disabled = (Lessons.currentStepIndex === 0);
      }
    }

    // Step-specific rendering
    var stepType = step.type || step.step_type;

    // For steps beyond the first, show placeholder only if not enabled
    var fullEnabled = Lessons.isFullLessonEnabled(Lessons.currentLessonId);
    if (Lessons.currentStepIndex > 0 && !fullEnabled) {
      if (nextBtn) nextBtn.disabled = false;
      return;
    }
    
    switch(stepType) {
      case "objective":
        Lessons.renderObjectiveScreen(Lessons.findLessonMeta(Lessons.currentLessonId));
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      case "definition":
        // Auto-award completion points
        Lessons.awardStepPoints(Lessons.currentStepIndex, step);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      case "example":
        // Render example with auto-highlighted words
        Lessons.renderExampleStep(step);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      case "guided_practice":
        Lessons.renderGuidedPracticeStep(step);
        if (nextBtn) nextBtn.disabled = true;
        break;
        
      case "question":
        Lessons.renderQuestionStep(step);
        if (nextBtn) nextBtn.disabled = true;
        break;
        
      case "summary":
        Lessons.renderSummaryStep(step);
        if (nextBtn) nextBtn.disabled = false;
        break;
        
      default:
        // Fallback for old format
        if (step.options && step.options.length) {
          Lessons.renderQuestionStep(step);
          if (nextBtn) nextBtn.disabled = true;
        } else {
          Lessons.awardStepPoints(Lessons.currentStepIndex, step);
          if (nextBtn) nextBtn.disabled = false;
        }
    }
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
    
    Lessons.inExamplesPhase = false;
    Lessons.currentExampleIndex = 0;
    
    var options = step.options || [];
    for (var i = 0; i < options.length; i++) {
      (function(opt) {
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary";
        btn.textContent = opt;
        btn.addEventListener("click", function() {
          var correctAnswer = step.correctAnswer || step.correct_answer;
          Lessons.handleAnswer(opt, correctAnswer, Lessons.currentStepIndex);
        });
        lessonOptionsEl.appendChild(btn);
      })(options[i]);
    }
  },

  // Handle answer - award XP once on correct (supports both quest and normal modes)
  handleAnswer: function(chosen, correct, stepIndex) {
    if (stepIndex === null || stepIndex === undefined) {
      stepIndex = Lessons.currentStepIndex;
    }

    var correctBool = (chosen === correct);
    var nextBtn = document.getElementById("btn-lesson-next");
    var questContext = Lessons.getQuestContext();
    var isQuest = !!questContext;
    var step = Lessons.currentLessonSteps[stepIndex];

    // Ensure runtime scope is correct
    if (!Lessons.runtime || typeof Lessons.runtime !== 'object') {
      Lessons.runtime = { attemptsByStepKey: {}, activeLessonKey: null };
    }
    if (Lessons.runtime.activeLessonKey !== Lessons.currentLessonId) {
      Lessons.resetRuntime(Lessons.currentLessonId);
    }

    var stepKey = Lessons.getStepKey(Lessons.currentLessonId, stepIndex, step);
    var attempts = Lessons.runtime.attemptsByStepKey[stepKey] || 0;

    var optionsEl = document.getElementById("lesson-options");
    var trackId = Lessons.currentLessonTrackId;

    // Quest mode: do not allow escape hatch; must be correct to proceed
    if (correctBool) {
      if (questContext) questContext.answeredCorrect = true;

      // If this question exists in the review queue, mark it correct.
      try {
        var rkOk = Lessons.getReviewKey(Lessons.currentLessonId, stepIndex, step);
        Lessons.markReviewResult(rkOk, true);
      } catch (e) {
        // no-op
      }

      Lessons.renderFeedback({ correct: true, step: step, attempts: attempts, showHint: false, canContinue: true });

      // Instrumentation (once per resolved question)
      if (trackId) {
        State.recordQuestionAttempt(trackId, true);
      }

      // Award XP once (quest-safe)
      var xpAmount = (step && typeof step.points === 'number') ? step.points : 0;
      if (!xpAmount) xpAmount = (State && typeof State.XP_PER_CORRECT === 'number') ? State.XP_PER_CORRECT : 5;

      if (isQuest) {
        if (!questContext.xpAwarded) {
          questContext.xpAwarded = true;
          State.awardXP(xpAmount, { trackId: trackId });
        }
      } else {
        // Use session progress guard to prevent double-award
        Lessons.initLesson(Lessons.currentLessonId);
        var prog = State.state.session.lessonProgress[Lessons.currentLessonId];
        if (prog && !prog.stepAwarded[stepIndex]) {
          prog.stepAwarded[stepIndex] = true;
          prog.pointsEarned = (prog.pointsEarned || 0) + xpAmount;
          State.awardXP(xpAmount, { trackId: trackId });
        }
      }

      // Disable all option buttons to prevent re-clicking
      if (optionsEl) {
        var btns = optionsEl.querySelectorAll("button.btn");
        for (var bi = 0; bi < btns.length; bi++) {
          btns[bi].disabled = true;
        }
      }
      if (nextBtn) nextBtn.disabled = false;
      return;
    }

    // Wrong answer
    attempts += 1;
    Lessons.runtime.attemptsByStepKey[stepKey] = attempts;

    var hint = Lessons._getHint(step);
    var hasHint = !!(hint && (hint.en || hint.pa));

    if (attempts === 1 && hasHint) {
      // Stage 1: gentle hint, retry (no continue)
      Lessons.renderFeedback({ correct: false, step: step, attempts: attempts, showHint: true, canContinue: false });
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    // Stage 2: worked example + explanation
    Lessons.renderFeedback({ correct: false, step: step, attempts: attempts, showHint: false, canContinue: !isQuest });

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

    if (isQuest) {
      // Quest safety: must still answer correctly
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    // Non-quest: escape hatch enabled after stage 2
    if (trackId) {
      State.recordQuestionAttempt(trackId, false);
    }

    if (optionsEl) {
      var btns2 = optionsEl.querySelectorAll("button.btn");
      for (var bj = 0; bj < btns2.length; bj++) {
        btns2[bj].disabled = true;
      }
    }
    if (nextBtn) nextBtn.disabled = false;
  },

  // Next step - exits quest mode on quest target step, handles summary completion
  nextStep: function() {
    if (!Lessons.currentLessonSteps || !Lessons.currentLessonSteps.length) return;
    
    var step = Lessons.currentLessonSteps[Lessons.currentStepIndex];

    // Handle examples phase for question steps before moving on
    if (step && (step.type === "question" || step.step_type === "question") && Lessons.inExamplesPhase) {
      var examples = Lessons.normalizeQuestionExamples(step);
      if (Lessons.currentExampleIndex < examples.length - 1) {
        Lessons.currentExampleIndex++;
        Lessons.renderQuestionExample(step, true);
        return;
      } else {
        Lessons.inExamplesPhase = false;
        Lessons.currentExampleIndex = 0;
      }
    }
    
    var questContext = Lessons.getQuestContext();
    
    // If in quest mode on target step, only proceed if answered correctly
    if (questContext && Lessons.currentStepIndex === questContext.targetStep) {
      if (!questContext.answeredCorrect) {
        return; // User must answer correctly first
      }
      // Answer was correct, finish quest
      Lessons.finishQuestStep();
      return;
    }
    
    // If at summary step, complete the lesson
    if (step && (step.type === "summary" || step.step_type === "summary")) {
      Lessons.completeLesson();
      return;
    }
    
    // Normal lesson progression
    if (Lessons.currentStepIndex < Lessons.currentLessonSteps.length - 1) {
      Lessons.currentStepIndex++;
      State.save(); // ✅ Persist forward navigation
      State.state.session.currentLessonStep = Lessons.currentStepIndex;
      Lessons.renderLessonStep();
    } else {
      Lessons.completeLesson();
    }
  },

  // Previous step - blocked in quest mode
  prevStep: function() {
    if (!Lessons.currentLessonSteps || !Lessons.currentLessonSteps.length) return;
    
    // Block backwards navigation in quest mode
    if (Lessons.isQuestMode()) {
      return;
    }
    
    if (Lessons.currentStepIndex > 0) {
      State.save(); // ✅ Persist backward navigation
      Lessons.currentStepIndex--;
      State.state.session.currentLessonStep = Lessons.currentStepIndex;
      Lessons.renderLessonStep();
    }
  },

  // Internal: finish quest step and return to callback
  // Only called when in quest mode and quest step is complete
  finishQuestStep: function() {
    var questContext = Lessons.getQuestContext();
    if (!questContext) return;

    // Capture callback before clearing context
    var callback = questContext.callback;
    
    // Atomically clear quest context
    Lessons.clearQuestContext();

    // Call the callback
    if (callback) {
      callback();
    }
  },

  // Complete lesson (marks full lesson done, used only in normal flow)
  // Prevents marking as done during quest mode
  completeLesson: function() {
    // Don't mark as done if in quest mode - quest completes via dailyQuest
    if (Lessons.isQuestMode()) {
      return;
    }
    
    State.state.progress.lessonDone[Lessons.currentLessonId] = true;
    State.save();
    
    Lessons.renderLearnSections();
    alert("Lesson Complete! / ਪਾਠ ਮੁਕਤ ਹੋ ਗਿਆ!");
    UI.goTo("screen-learn");
  },

  // Results count display
  _updateResultsCount: function(count) {
    var countDisplay = document.getElementById('learn-results-count');
    if (countDisplay) {
      countDisplay.textContent = 'Showing ' + count + ' lesson' + (count === 1 ? '' : 's');
    }
  },

  // Count active filters for badge display
  _countActiveFilters: function() {
    var f = Lessons.activeFilters;
    var count = 0;
    if (f.search && f.search.trim()) count++;
    if (f.status !== 'all') count++;
    if (f.difficulty && f.difficulty.join('') !== '123') count++;
    if (f.track !== 'all') count++;
    return count;
  },

  // Update Filters summary label with active count
  _updateFiltersSummary: function() {
    var summary = document.querySelector('.learn-filters-summary');
    if (!summary) return;
    var activeCount = Lessons._countActiveFilters();
    var label = 'Filters';
    if (activeCount > 0) label += ' (' + activeCount + ')';
    summary.textContent = label;
  },

  // Streak Badge: Update display with tier styling
  _updateStreakBadge: function(streakDays) {
    streakDays = parseInt(streakDays) || 0;
    var el = document.getElementById('learn-streak');
    if (!el) return;
    
    // Set tier for CSS styling
    var tier = 'none';
    if (streakDays >= 30) tier = 'platinum';
    else if (streakDays >= 7) tier = 'gold';
    else if (streakDays > 0) tier = 'warm';
    
    el.dataset.streakTier = tier;
    el.className = 'learn-streak-badge';
    
    // Set display text
    if (streakDays === 0) {
      el.textContent = '0d';
    } else {
      el.textContent = '🔥 ' + streakDays + 'd';
    }
  },

  // Track Health: Attach completion % and progress bar via data attributes
  _attachTrackHealthIndicators: function(trackHeaderEl, trackId) {
    if (!trackHeaderEl || !trackId) return;
    
    // Get lessons for this track using existing helper
    var trackLessons = Lessons.getLessonsByTrack(trackId);
    if (!trackLessons || trackLessons.length === 0) return;
    
    var total = trackLessons.length;
    var completed = 0;
    
    // Count completed lessons
    try {
      if (typeof State !== 'undefined' && State && typeof State.getProfileContainer === 'function') {
        var profile = State.getProfileContainer();
        if (profile && profile.lessonProgress) {
          trackLessons.forEach(function(meta) {
            if (profile.lessonProgress[meta.id] && profile.lessonProgress[meta.id].completed) {
              completed++;
            }
          });
        }
      }
    } catch (e) {
      // Graceful degradation: no completion stats
      return;
    }
    
    if (total === 0) return;
    
    var pct = Math.round((completed / total) * 100);
    
    // Set data attributes for CSS pseudo-element rendering
    trackHeaderEl.dataset.trackSummary = completed + '/' + total + ' (' + pct + '%)';
    trackHeaderEl.style.setProperty('--track-pct', pct);
  }
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

  // Log filter state and results
  logFilterState: function(filtered) {
    if (!this.enabled()) return;
    
    console.log("🎓 [Learn] Filters applied:", {
      search: Lessons.activeFilters.search || "(none)",
      status: Lessons.activeFilters.status,
      difficulty: Lessons.activeFilters.difficulty,
      track: Lessons.activeFilters.track,
      resultCount: filtered.length
    });
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
