#!/usr/bin/env node

const fs = require('fs');

const updatesPath = process.argv[2] || 'app/data/templates/core_updates_batch5.json';
const yesNoPath = process.argv[3] || 'app/data/tapYesNoOverrides.js';
const nonYesNoPath = process.argv[4] || 'app/data/nonYesNoQuestionOverrides.js';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractArrayFromJs(filePath, symbol) {
  const source = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`root\\.${symbol}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*;`);
  const match = source.match(re);
  if (!match) throw new Error(`Unable to locate ${symbol} array in ${filePath}`);
  const arr = JSON.parse(match[1]);
  return { source, arr, rawArrayText: match[1] };
}

function writeArrayToJs(filePath, symbol, source, oldArrayText, arr) {
  const newArrayText = JSON.stringify(arr, null, 2);
  const next = source.replace(oldArrayText, newArrayText);
  fs.writeFileSync(filePath, next, 'utf8');
}

function keyOf(row) {
  return `${row.lessonId}::${row.stepId}`;
}

function toYesNo(update, existing) {
  return {
    ...(existing || {}),
    lessonId: update.lessonId,
    stepId: update.stepId,
    questionEn: update?.prompt?.en || existing?.questionEn || '',
    questionPa: update?.prompt?.pa || existing?.questionPa || '',
    options: Array.isArray(update.options) ? update.options : (existing?.options || []),
    correctAnswerEn:
      update.correctAnswer ||
      (Array.isArray(update.options) && Number.isInteger(update.correctOptionIndex) ? update.options[update.correctOptionIndex]?.en : undefined) ||
      existing?.correctAnswerEn ||
      '',
    hintEn: update?.hint?.en || existing?.hintEn || '',
    hintPa: update?.hint?.pa || existing?.hintPa || '',
    explanationEn: update?.explanation?.en || existing?.explanationEn || '',
    explanationPa: update?.explanation?.pa || existing?.explanationPa || ''
  };
}

function toNonYesNo(update, existing) {
  const out = {
    ...(existing || {}),
    lessonId: update.lessonId,
    stepId: update.stepId,
    prompt: update.prompt || existing?.prompt || { en: '', pa: '' },
    options: Array.isArray(update.options) ? update.options : (existing?.options || []),
    correctOptionIndex: Number.isInteger(update.correctOptionIndex) ? update.correctOptionIndex : (existing?.correctOptionIndex ?? 0),
    hint: update.hint || existing?.hint || { en: '', pa: '' },
    explanation: update.explanation || existing?.explanation || { en: '', pa: '' },
    points: Number.isFinite(update.points) ? update.points : (existing?.points ?? 5)
  };

  if (update.workedExample || existing?.workedExample) {
    out.workedExample = update.workedExample || existing.workedExample;
  } else {
    delete out.workedExample;
  }

  return out;
}

function upsert(targetArr, updates, mapper) {
  const byKey = new Map(targetArr.map((row, idx) => [keyOf(row), idx]));
  let replaced = 0;
  let added = 0;

  for (const update of updates) {
    const key = keyOf(update);
    const idx = byKey.get(key);
    if (idx === undefined) {
      targetArr.push(mapper(update, null));
      byKey.set(key, targetArr.length - 1);
      added += 1;
    } else {
      targetArr[idx] = mapper(update, targetArr[idx]);
      replaced += 1;
    }
  }

  return { replaced, added, total: targetArr.length };
}

function main() {
  const updates = readJson(updatesPath);
  if (!Array.isArray(updates)) throw new Error('Updates JSON must be an array');

  const yesNoUpdates = updates.filter((row) => row && row.source === 'yesNo');
  const nonYesNoUpdates = updates.filter((row) => row && row.source !== 'yesNo');

  const yesNoData = extractArrayFromJs(yesNoPath, 'TAP_YES_NO_OVERRIDES');
  const nonYesNoData = extractArrayFromJs(nonYesNoPath, 'NON_YES_NO_QUESTION_OVERRIDES');

  const yesNoResult = upsert(yesNoData.arr, yesNoUpdates, toYesNo);
  const nonYesNoResult = upsert(nonYesNoData.arr, nonYesNoUpdates, toNonYesNo);

  writeArrayToJs(yesNoPath, 'TAP_YES_NO_OVERRIDES', yesNoData.source, yesNoData.rawArrayText, yesNoData.arr);
  writeArrayToJs(nonYesNoPath, 'NON_YES_NO_QUESTION_OVERRIDES', nonYesNoData.source, nonYesNoData.rawArrayText, nonYesNoData.arr);

  console.log(JSON.stringify({
    ok: true,
    updatesProvided: updates.length,
    yesNo: { updates: yesNoUpdates.length, ...yesNoResult },
    nonYesNo: { updates: nonYesNoUpdates.length, ...nonYesNoResult }
  }, null, 2));
}

main();
