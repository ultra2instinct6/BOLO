/* eslint-disable no-var */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

const root = path.resolve(__dirname, '..');
const tracksPath = path.join(root, 'app', 'data', 'tracks.js');
const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');

const context = { console, window: {} };
runFileIntoContext(tracksPath, context);
runFileIntoContext(lessonsPath, context);

const lessons = context.LESSONS;
if (!lessons || typeof lessons !== 'object') {
  console.error('LESSONS not defined as object');
  process.exit(1);
}

const errors = [];
const lessonIds = Object.keys(lessons).filter((k) => k.startsWith('L_'));

const VALID_TRACK_IDS = ['T_WORDS', 'T_ACTIONS', 'T_DESCRIBE', 'T_SENTENCE'];

function pushError(message) {
  errors.push(message);
}

function norm(text) {
  return String(text || '').trim().toLowerCase();
}

function getStepType(step) {
  if (!step || typeof step !== 'object') return '';
  return typeof step.type === 'string'
    ? step.type
    : (typeof step.step_type === 'string' ? step.step_type : '');
}

function isSummaryType(type) {
  return type === 'summary' || type === 'summary_bullets';
}

function optionToKey(option) {
  if (typeof option === 'string') return option;
  if (option && typeof option === 'object' && typeof option.en === 'string') return option.en;
  return '';
}

function isBilingualOption(option) {
  return !!option && typeof option === 'object' && typeof option.en === 'string' && typeof option.pa === 'string';
}

function resolveCorrectIndex(step, optionKeys) {
  const byIndex = Number.isInteger(step.correctOptionIndex) ? step.correctOptionIndex : -1;
  if (byIndex >= 0 && byIndex < optionKeys.length) return byIndex;

  const correctAnswerRaw = step.correctAnswer || step.correct_answer;
  if (typeof correctAnswerRaw !== 'string' || !correctAnswerRaw.trim()) return -1;

  const target = norm(correctAnswerRaw);
  const matches = [];
  for (let index = 0; index < optionKeys.length; index++) {
    if (norm(optionKeys[index]) === target) matches.push(index);
  }
  if (matches.length !== 1) return -1;
  return matches[0];
}

function sumPoints(steps) {
  return steps.reduce((acc, s) => {
    const type = getStepType(s);
    if (!s || isSummaryType(type)) return acc;
    return acc + (typeof s.points === 'number' ? s.points : 0);
  }, 0);
}

for (const id of lessonIds) {
  const lesson = lessons[id];
  if (!lesson || typeof lesson !== 'object') {
    pushError(`${id}: not an object`);
    continue;
  }
  if (!lesson.metadata || typeof lesson.metadata !== 'object') pushError(`${id}: missing metadata`);
  if (!Array.isArray(lesson.steps)) pushError(`${id}: missing steps array`);

  const m = lesson.metadata || {};
  const requiredMeta = ['titleEn', 'titlePa', 'labelEn', 'labelPa', 'trackId', 'objective', 'difficulty'];
  for (const key of requiredMeta) {
    if (m[key] === undefined || m[key] === '') pushError(`${id}: metadata.${key} missing/empty`);
  }
  if (m.trackId && !VALID_TRACK_IDS.includes(m.trackId)) {
    pushError(`${id}: metadata.trackId invalid: ${m.trackId}`);
  }
  if (typeof m.difficulty !== 'number' || m.difficulty < 1 || m.difficulty > 3) {
    pushError(`${id}: metadata.difficulty invalid: ${m.difficulty}`);
  }
  if (!m.objective || typeof m.objective !== 'object') {
    pushError(`${id}: metadata.objective missing`);
  } else {
    const o = m.objective;
    const reqObj = ['titleEn', 'titlePa', 'descEn', 'descPa', 'pointsAvailable'];
    for (const key of reqObj) {
      if (o[key] === undefined) pushError(`${id}: metadata.objective.${key} missing`);
    }
    if (typeof o.pointsAvailable !== 'number') pushError(`${id}: objective.pointsAvailable not number`);
    if (Array.isArray(lesson.steps)) {
      const expected = sumPoints(lesson.steps);
      if (o.pointsAvailable !== expected) pushError(`${id}: pointsAvailable mismatch ${o.pointsAvailable} != ${expected}`);
    }
  }

  if (Array.isArray(lesson.steps)) {
    const seenQ = new Set();
    for (const step of lesson.steps) {
      if (!step || typeof step !== 'object') {
        pushError(`${id}: step not object`);
        continue;
      }
      const type = getStepType(step);
      if (!type) pushError(`${id}: step missing type`);
      if (typeof step.points !== 'number') pushError(`${id}: step(${type || 'unknown'}) missing points`);

      const questionId = step.id || `step_index_${lesson.steps.indexOf(step)}`;

      if (type === 'question') {
        if (!step.id) pushError(`${id}:${questionId}: question missing id`);
        else {
          if (seenQ.has(step.id)) pushError(`${id}:${questionId}: duplicate question id: ${step.id}`);
          seenQ.add(step.id);
        }

        const options = Array.isArray(step.options) ? step.options : [];
        if (options.length < 2) {
          pushError(`${id}:${questionId}: question must have at least 2 options`);
          continue;
        }

        const allStrings = options.every((x) => typeof x === 'string');
        const allBilingual = options.every((x) => isBilingualOption(x));
        if (!allStrings && !allBilingual) {
          pushError(`${id}:${questionId}: question options must be string[] or bilingual object[]`);
          continue;
        }

        const keys = options.map(optionToKey);
        if (keys.some((k) => !k)) {
          pushError(`${id}:${questionId}: question option key resolution failed`);
          continue;
        }

        if (Number.isInteger(step.correctOptionIndex) && (step.correctOptionIndex < 0 || step.correctOptionIndex >= keys.length)) {
          pushError(`${id}:${questionId}: correctOptionIndex out of range`);
        }

        const resolved = resolveCorrectIndex(step, keys);
        if (resolved < 0) {
          pushError(`${id}:${questionId}: unable to resolve correct answer (index/text)`);
        }
      }

      if (type === 'guided_practice') {
        // clickableWords is optional — renderer auto-generates from sentenceEn
        if (!Array.isArray(step.correctAnswers)) pushError(`${id}: guided_practice missing correctAnswers[]`);
      }

      if (isSummaryType(type)) {
        if (type === 'summary') {
          const req = ['titleEn', 'titlePa', 'summaryEn', 'summaryPa'];
          for (const k of req) {
            if (!step[k]) pushError(`${id}: ${type} missing ${k}`);
          }
        }
        if (type === 'summary_bullets') {
          const req = ['titleEn', 'titlePa'];
          for (const k of req) {
            if (!step[k]) pushError(`${id}: ${type} missing ${k}`);
          }
          if (!Array.isArray(step.bullets) || step.bullets.length === 0) {
            pushError(`${id}: ${type} missing bullets[]`);
          }
        }
        if (step.points !== 0) pushError(`${id}: ${type} points must be 0`);
      }
    }
  }
}

const uniqueErrors = [...new Set(errors)];

if (uniqueErrors.length) {
  console.error(`Found ${uniqueErrors.length} issues:`);
  for (const e of uniqueErrors.slice(0, 200)) console.error(' -', e);
  if (uniqueErrors.length > 200) console.error(`...and ${uniqueErrors.length - 200} more`);
  process.exit(1);
}

console.log(`OK: validated ${lessonIds.length} canonical lessons`);
