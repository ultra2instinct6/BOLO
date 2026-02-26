#!/usr/bin/env node

const fs = require('fs');

const batchPath = process.argv[2] || 'app/data/templates/core_updates_batch5.json';
const yesNoPath = process.argv[3] || 'app/data/tapYesNoOverrides.js';
const nonYesNoPath = process.argv[4] || 'app/data/nonYesNoQuestionOverrides.js';

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function readOverrideArray(filePath, symbol) {
  const source = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`root\\.${symbol}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*;`);
  const match = source.match(re);
  if (!match) throw new Error(`Could not find ${symbol} in ${filePath}`);
  return JSON.parse(match[1]);
}

function keyOf(row) {
  return `${row.lessonId}::${row.stepId}`;
}

function normalize(value) {
  return JSON.stringify(value);
}

function expectedForYesNo(update) {
  return {
    lessonId: update.lessonId,
    stepId: update.stepId,
    questionEn: update?.prompt?.en || '',
    questionPa: update?.prompt?.pa || '',
    options: update.options || [],
    correctAnswerEn:
      update.correctAnswer ||
      (Array.isArray(update.options) && Number.isInteger(update.correctOptionIndex) ? update.options[update.correctOptionIndex]?.en : ''),
    hintEn: update?.hint?.en || '',
    hintPa: update?.hint?.pa || '',
    explanationEn: update?.explanation?.en || '',
    explanationPa: update?.explanation?.pa || ''
  };
}

function expectedForNonYesNo(update) {
  const out = {
    lessonId: update.lessonId,
    stepId: update.stepId
  };
  if (Object.prototype.hasOwnProperty.call(update, 'prompt')) out.prompt = update.prompt;
  if (Object.prototype.hasOwnProperty.call(update, 'options')) out.options = update.options;
  if (Object.prototype.hasOwnProperty.call(update, 'correctOptionIndex')) out.correctOptionIndex = update.correctOptionIndex;
  if (Object.prototype.hasOwnProperty.call(update, 'hint')) out.hint = update.hint;
  if (Object.prototype.hasOwnProperty.call(update, 'explanation')) out.explanation = update.explanation;
  if (Object.prototype.hasOwnProperty.call(update, 'workedExample')) out.workedExample = update.workedExample;
  if (Object.prototype.hasOwnProperty.call(update, 'points')) out.points = update.points;
  return out;
}

function pick(obj, keys) {
  const out = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) out[key] = obj[key];
  }
  return out;
}

const batch = readJson(batchPath);
const yesNo = readOverrideArray(yesNoPath, 'TAP_YES_NO_OVERRIDES');
const nonYesNo = readOverrideArray(nonYesNoPath, 'NON_YES_NO_QUESTION_OVERRIDES');

const yesNoMap = new Map(yesNo.map((row) => [keyOf(row), row]));
const nonYesNoMap = new Map(nonYesNo.map((row) => [keyOf(row), row]));

const result = {
  ok: true,
  total: batch.length,
  exact: 0,
  missing: 0,
  different: 0,
  diffs: []
};

for (const update of batch) {
  const key = keyOf(update);
  if (update.source === 'yesNo') {
    const target = yesNoMap.get(key);
    if (!target) {
      result.missing += 1;
      result.diffs.push({ key, reason: 'missing-yesNo' });
      continue;
    }
    const actual = pick(target, ['lessonId', 'stepId', 'questionEn', 'questionPa', 'options', 'correctAnswerEn', 'hintEn', 'hintPa', 'explanationEn', 'explanationPa']);
    const expected = expectedForYesNo(update);
    if (normalize(actual) === normalize(expected)) result.exact += 1;
    else {
      result.different += 1;
      result.diffs.push({ key, reason: 'different-yesNo' });
    }
  } else {
    const target = nonYesNoMap.get(key);
    if (!target) {
      result.missing += 1;
      result.diffs.push({ key, reason: 'missing-nonYesNo' });
      continue;
    }
    const keys = Object.keys(expectedForNonYesNo(update));
    const actual = pick(target, keys);
    const expected = expectedForNonYesNo(update);
    if (normalize(actual) === normalize(expected)) result.exact += 1;
    else {
      result.different += 1;
      result.diffs.push({ key, reason: 'different-nonYesNo' });
    }
  }
}

result.ok = result.missing === 0 && result.different === 0;
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
