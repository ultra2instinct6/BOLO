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

function sumPoints(steps) {
  return steps.reduce((acc, s) => {
    if (!s || s.type === 'summary') return acc;
    return acc + (typeof s.points === 'number' ? s.points : 0);
  }, 0);
}

for (const id of lessonIds) {
  const lesson = lessons[id];
  if (!lesson || typeof lesson !== 'object') {
    errors.push(`${id}: not an object`);
    continue;
  }
  if (!lesson.metadata || typeof lesson.metadata !== 'object') errors.push(`${id}: missing metadata`);
  if (!Array.isArray(lesson.steps)) errors.push(`${id}: missing steps array`);

  const m = lesson.metadata || {};
  const requiredMeta = ['titleEn', 'titlePa', 'labelEn', 'labelPa', 'trackId', 'objective', 'difficulty'];
  for (const key of requiredMeta) {
    if (m[key] === undefined || m[key] === '') errors.push(`${id}: metadata.${key} missing/empty`);
  }
  if (m.trackId && !['T_WORDS', 'T_ACTIONS', 'T_DESCRIBE', 'T_SENTENCE'].includes(m.trackId)) {
    errors.push(`${id}: metadata.trackId invalid: ${m.trackId}`);
  }
  if (typeof m.difficulty !== 'number' || m.difficulty < 1 || m.difficulty > 3) {
    errors.push(`${id}: metadata.difficulty invalid: ${m.difficulty}`);
  }
  if (!m.objective || typeof m.objective !== 'object') {
    errors.push(`${id}: metadata.objective missing`);
  } else {
    const o = m.objective;
    const reqObj = ['titleEn', 'titlePa', 'descEn', 'descPa', 'pointsAvailable'];
    for (const key of reqObj) {
      if (o[key] === undefined) errors.push(`${id}: metadata.objective.${key} missing`);
    }
    if (typeof o.pointsAvailable !== 'number') errors.push(`${id}: objective.pointsAvailable not number`);
    if (Array.isArray(lesson.steps)) {
      const expected = sumPoints(lesson.steps);
      if (o.pointsAvailable !== expected) errors.push(`${id}: pointsAvailable mismatch ${o.pointsAvailable} != ${expected}`);
    }
  }

  if (Array.isArray(lesson.steps)) {
    const seenQ = new Set();
    for (const step of lesson.steps) {
      if (!step || typeof step !== 'object') {
        errors.push(`${id}: step not object`);
        continue;
      }
      if (!step.type) errors.push(`${id}: step missing type`);
      if (typeof step.points !== 'number') errors.push(`${id}: step(${step.type}) missing points`);

      if (step.type === 'question') {
        if (!step.id) errors.push(`${id}: question missing id`);
        else {
          if (seenQ.has(step.id)) errors.push(`${id}: duplicate question id: ${step.id}`);
          seenQ.add(step.id);
        }
        if (!Array.isArray(step.options) || step.options.some((x) => typeof x !== 'string')) errors.push(`${id}: question options not string[]`);
        if (typeof step.correctAnswer !== 'string') errors.push(`${id}: question correctAnswer not string`);
        else if (Array.isArray(step.options) && !step.options.includes(step.correctAnswer)) errors.push(`${id}: correctAnswer not in options`);
      }

      if (step.type === 'guided_practice') {
        if (!Array.isArray(step.clickableWords)) errors.push(`${id}: guided_practice missing clickableWords[]`);
        if (!Array.isArray(step.correctAnswers)) errors.push(`${id}: guided_practice missing correctAnswers[]`);
      }

      if (step.type === 'summary') {
        const req = ['titleEn', 'titlePa', 'summaryEn', 'summaryPa'];
        for (const k of req) {
          if (!step[k]) errors.push(`${id}: summary missing ${k}`);
        }
        if (step.points !== 0) errors.push(`${id}: summary points must be 0`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Found ${errors.length} issues:`);
  for (const e of errors.slice(0, 200)) console.error(' -', e);
  if (errors.length > 200) console.error(`...and ${errors.length - 200} more`);
  process.exit(1);
}

console.log(`OK: validated ${lessonIds.length} canonical lessons`);
