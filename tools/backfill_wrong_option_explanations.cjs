/* eslint-disable no-var */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');
const tracksPath = path.join(root, 'app', 'data', 'tracks.js');
const reportPath = path.join(root, 'tools', 'wrong_option_phase1_report.json');

const isApply = process.argv.includes('--apply');

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

function norm(text) {
  return String(text || '').trim().toLowerCase();
}

function detectOptionFormat(options) {
  if (!Array.isArray(options)) return 'mixed';
  if (options.every((opt) => typeof opt === 'string')) return 'string[]';
  if (
    options.every(
      (opt) => opt && typeof opt === 'object' && typeof opt.en === 'string' && typeof opt.pa === 'string'
    )
  ) {
    return 'bilingual object[]';
  }
  return 'mixed';
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

function generateWrongExplanation(step, wrongKey, correctKey) {
  const promptEn = String(step.englishText || step.english_text || step.promptEn || '').trim();
  const promptPa = String(step.punjabiText || step.punjabi_text || step.promptPa || '').trim();
  const notPattern = /\bnot\b|\bNOT\b|n't\b/;
  const asksNot = notPattern.test(promptEn);

  const en = asksNot
    ? `"${wrongKey}" does not match what this question asks for. "${correctKey}" is correct because it satisfies the required contrast in the sentence.`
    : `"${wrongKey}" is not correct in this context. "${correctKey}" is correct because it best fits what the question asks.`;

  const pa = asksNot
    ? `"${wrongKey}" ਇਸ ਸਵਾਲ ਦੀ ਮੰਗ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ। "${correctKey}" ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਵਾਕ ਵਿੱਚ ਮੰਗੀ ਗਈ ਤੁਲਨਾ ਪੂਰੀ ਕਰਦਾ ਹੈ।`
    : `"${wrongKey}" ਇਸ ਸੰਦਰਭ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੈ। "${correctKey}" ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਸਵਾਲ ਦੀ ਲੋੜ ਨਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਮਿਲਦਾ ਹੈ।`;

  const out = { en, pa };
  if (!promptEn && !promptPa) {
    out.en = `"${wrongKey}" is not the best choice here. "${correctKey}" is the correct option for this rule.`;
    out.pa = `"${wrongKey}" ਇੱਥੇ ਸਭ ਤੋਂ ਠੀਕ ਚੋਣ ਨਹੀਂ ਹੈ। ਇਸ ਨਿਯਮ ਲਈ "${correctKey}" ਸਹੀ ਚੋਣ ਹੈ।`;
  }
  return out;
}

function loadData() {
  const context = { console, window: {} };
  runFileIntoContext(tracksPath, context);
  runFileIntoContext(lessonsPath, context);

  const lessons = context.LESSONS && typeof context.LESSONS === 'object' ? context.LESSONS : null;
  const lessonMeta = Array.isArray(context.LESSON_META) ? context.LESSON_META : [];
  if (!lessons) throw new Error('LESSONS was not loaded as an object.');

  const orderedLessonIds = lessonMeta
    .filter((m) => m && typeof m.id === 'string' && m.id.indexOf('L_') === 0)
    .sort((a, b) => {
      const ao = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const bo = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
      return ao - bo;
    })
    .map((m) => m.id);

  return { lessons, orderedLessonIds };
}

function buildAudit(lessons, orderedLessonIds) {
  const phase1Rows = [];
  const skipped = [];
  const byLesson = {};
  const formatCounts = { 'string[]': 0, 'bilingual object[]': 0, mixed: 0 };

  for (const lessonId of orderedLessonIds) {
    const lesson = lessons[lessonId];
    const steps = Array.isArray(lesson && lesson.steps) ? lesson.steps : [];
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex] || {};
      const type = step.type || step.step_type;
      if (type !== 'question') continue;

      const options = Array.isArray(step.options) ? step.options : [];
      if (options.length === 0) continue;

      const rowBase = {
        filePath: 'app/data/lessons.js',
        lessonId,
        questionId: step.id || `step_index_${stepIndex}`,
        stepIndex,
        optionFormat: detectOptionFormat(options),
        optionCount: options.length
      };

      if (options.length < 2) {
        skipped.push({ ...rowBase, reason: 'fewer than 2 options' });
        continue;
      }

      const keys = options.map(optionToKey);
      if (keys.some((k) => !k)) {
        skipped.push({ ...rowBase, reason: 'non-standard option key (missing en/string)' });
        continue;
      }

      let correctIndex = Number.isInteger(step.correctOptionIndex) ? step.correctOptionIndex : -1;
      if (correctIndex < 0 || correctIndex >= keys.length) {
        const correctAnswerRaw = step.correctAnswer || step.correct_answer;
        if (typeof correctAnswerRaw !== 'string' || !correctAnswerRaw.trim()) {
          skipped.push({ ...rowBase, reason: 'missing correctAnswer' });
          continue;
        }
        const correctAnswer = correctAnswerRaw.trim();
        const matchedIndexes = [];
        for (let index = 0; index < keys.length; index++) {
          if (norm(keys[index]) === norm(correctAnswer)) matchedIndexes.push(index);
        }
        if (matchedIndexes.length !== 1) {
          skipped.push({ ...rowBase, reason: 'ambiguous correctAnswer mapping' });
          continue;
        }
        correctIndex = matchedIndexes[0];
      }

      const canonicalCorrect = keys[correctIndex];
      const existing = step.wrongOptionExplanations && typeof step.wrongOptionExplanations === 'object'
        ? step.wrongOptionExplanations
        : null;
      const useExactKeyMatch = hasDuplicateNormalizedKeys(keys);

      const missingWrongKeys = [];
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (index === correctIndex) continue;
        const hasEntry = existing
          ? (useExactKeyMatch
            ? Object.prototype.hasOwnProperty.call(existing, key)
            : hasKeyCaseInsensitive(existing, key))
          : false;
        if (!hasEntry) {
          missingWrongKeys.push(key);
        }
      }

      if (missingWrongKeys.length === 0) continue;

      const row = {
        ...rowBase,
        correctAnswer: canonicalCorrect,
        missingIncorrectOptions: missingWrongKeys
      };
      phase1Rows.push(row);
      byLesson[lessonId] = (byLesson[lessonId] || 0) + 1;
      formatCounts[row.optionFormat] = (formatCounts[row.optionFormat] || 0) + 1;
    }
  }

  const top5Lessons = Object.entries(byLesson)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lessonId, count]) => ({ lessonId, count }));

  return {
    phase1Rows,
    skipped,
    totals: {
      totalQuestionsMissingWrongOptionExplanations: phase1Rows.length,
      byOptionFormat: formatCounts,
      top5Lessons
    }
  };
}

function printPhase1Report(audit) {
  console.log('PHASE 1 REPORT');
  console.log('==============' );
  for (const row of audit.phase1Rows) {
    console.log(
      [
        row.filePath,
        row.lessonId,
        row.questionId,
        row.optionFormat,
        String(row.optionCount),
        'missing=' + row.missingIncorrectOptions.join('|')
      ].join(' | ')
    );
  }

  console.log('\nPHASE 1 TOTALS');
  console.log('--------------');
  console.log('total missing:', audit.totals.totalQuestionsMissingWrongOptionExplanations);
  console.log('by format:', JSON.stringify(audit.totals.byOptionFormat));
  console.log('top 5 lessons:', JSON.stringify(audit.totals.top5Lessons));
  console.log('skipped edge cases:', audit.skipped.length);
}

function applyFixes(lessons, audit) {
  let updatedQuestions = 0;
  let insertedExplanations = 0;

  for (const row of audit.phase1Rows) {
    const lesson = lessons[row.lessonId];
    const step = lesson && lesson.steps && lesson.steps[row.stepIndex];
    if (!step) continue;

    if (!step.wrongOptionExplanations || typeof step.wrongOptionExplanations !== 'object') {
      step.wrongOptionExplanations = {};
    }

    const optionKeys = (Array.isArray(step.options) ? step.options : []).map(optionToKey).filter(Boolean);
    const useExactKeyMatch = hasDuplicateNormalizedKeys(optionKeys);

    let touched = false;
    for (const wrongKey of row.missingIncorrectOptions) {
      const hasEntry = useExactKeyMatch
        ? Object.prototype.hasOwnProperty.call(step.wrongOptionExplanations, wrongKey)
        : hasKeyCaseInsensitive(step.wrongOptionExplanations, wrongKey);
      if (hasEntry) continue;
      step.wrongOptionExplanations[wrongKey] = generateWrongExplanation(step, wrongKey, row.correctAnswer);
      insertedExplanations++;
      touched = true;
    }
    if (touched) updatedQuestions++;
  }

  return { updatedQuestions, insertedExplanations };
}

function saveLessons(lessons) {
  const original = fs.readFileSync(lessonsPath, 'utf8');
  const prefixMatch = original.match(/^([\s\S]*?var LESSONS = )/);
  const prefix = prefixMatch ? prefixMatch[1] : 'var LESSONS = ';
  const serialized = prefix + JSON.stringify(lessons, null, 2) + ';\n';
  fs.writeFileSync(lessonsPath, serialized, 'utf8');
}

function main() {
  const { lessons, orderedLessonIds } = loadData();
  const audit = buildAudit(lessons, orderedLessonIds);

  fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2) + '\n', 'utf8');
  printPhase1Report(audit);

  if (!isApply) return;

  const applyResult = applyFixes(lessons, audit);
  saveLessons(lessons);

  console.log('\nAPPLY SUMMARY');
  console.log('-------------');
  console.log('updated questions:', applyResult.updatedQuestions);
  console.log('inserted wrong-option explanations:', applyResult.insertedExplanations);
}

main();
