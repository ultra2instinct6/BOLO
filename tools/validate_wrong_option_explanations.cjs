/* eslint-disable no-var */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');
const tracksPath = path.join(root, 'app', 'data', 'tracks.js');

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

function norm(text) {
  return String(text || '').trim().toLowerCase();
}

function optionToKey(option) {
  if (typeof option === 'string') return option;
  if (option && typeof option === 'object' && typeof option.en === 'string') return option.en;
  return '';
}

function hasKeyCaseInsensitive(mapObj, key) {
  if (!mapObj || typeof mapObj !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(mapObj, key)) return true;
  const target = norm(key);
  return Object.keys(mapObj).some((k) => norm(k) === target);
}

function hasDuplicateNormalizedKeys(keys) {
  const seen = new Set();
  for (const key of keys) {
    const n = norm(key);
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

function main() {
  const context = { console, window: {} };
  runFileIntoContext(tracksPath, context);
  runFileIntoContext(lessonsPath, context);

  const lessons = context.LESSONS && typeof context.LESSONS === 'object' ? context.LESSONS : {};
  const lessonMeta = Array.isArray(context.LESSON_META) ? context.LESSON_META : [];
  const orderedLessonIds = lessonMeta
    .filter((m) => m && typeof m.id === 'string' && m.id.indexOf('L_') === 0)
    .sort((a, b) => {
      const ao = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const bo = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
      return ao - bo;
    })
    .map((m) => m.id);

  const missingCases = [];
  const countMismatchCases = [];
  const skipped = [];

  for (const lessonId of orderedLessonIds) {
    const lesson = lessons[lessonId];
    const steps = Array.isArray(lesson && lesson.steps) ? lesson.steps : [];
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex] || {};
      const type = step.type || step.step_type;
      if (type !== 'question') continue;

      const options = Array.isArray(step.options) ? step.options : [];
      if (options.length === 0) continue;

      const questionId = step.id || `step_index_${stepIndex}`;
      if (options.length < 2) {
        skipped.push({ lessonId, questionId, reason: 'fewer than 2 options' });
        continue;
      }

      const keys = options.map(optionToKey);
      if (keys.some((k) => !k)) {
        skipped.push({ lessonId, questionId, reason: 'non-standard option key (missing en/string)' });
        continue;
      }

      let correctIndex = Number.isInteger(step.correctOptionIndex) ? step.correctOptionIndex : -1;
      if (correctIndex < 0 || correctIndex >= keys.length) {
        const correctAnswerRaw = step.correctAnswer || step.correct_answer;
        if (typeof correctAnswerRaw !== 'string' || !correctAnswerRaw.trim()) {
          skipped.push({ lessonId, questionId, reason: 'missing correctAnswer' });
          continue;
        }
        const correctAnswer = correctAnswerRaw.trim();
        const matchedIndexes = [];
        for (let index = 0; index < keys.length; index++) {
          if (norm(keys[index]) === norm(correctAnswer)) matchedIndexes.push(index);
        }
        if (matchedIndexes.length !== 1) {
          skipped.push({ lessonId, questionId, reason: 'ambiguous correctAnswer mapping' });
          continue;
        }
        correctIndex = matchedIndexes[0];
      }

      const wrongKeys = keys.filter((_, index) => index !== correctIndex);
      const useExactKeyMatch = hasDuplicateNormalizedKeys(keys);
      const mapObj = step.wrongOptionExplanations;
      const existingCount = mapObj && typeof mapObj === 'object' ? Object.keys(mapObj).length : 0;

      const missingWrongKeys = wrongKeys.filter((wk) => {
        if (!mapObj || typeof mapObj !== 'object') return true;
        return useExactKeyMatch
          ? !Object.prototype.hasOwnProperty.call(mapObj, wk)
          : !hasKeyCaseInsensitive(mapObj, wk);
      });
      if (missingWrongKeys.length > 0) {
        missingCases.push({ lessonId, questionId, missingWrongKeys });
      }

      if (missingWrongKeys.length === 0 && existingCount !== (options.length - 1)) {
        countMismatchCases.push({
          lessonId,
          questionId,
          optionCount: options.length,
          expectedWrongOptionExplanations: options.length - 1,
          actualWrongOptionExplanations: existingCount
        });
      }
    }
  }

  const out = {
    remainingMissingCount: missingCases.length,
    countMismatchCount: countMismatchCases.length,
    skippedEdgeCases: skipped.length,
    missingCases,
    countMismatchCases,
    skipped
  };

  console.log(JSON.stringify(out, null, 2));

  if (missingCases.length > 0 || countMismatchCases.length > 0) {
    process.exit(1);
  }
}

main();
