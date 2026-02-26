#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.cwd();
const yesNoPath = path.join(root, 'app/data/tapYesNoOverrides.js');
const nonYesNoPath = path.join(root, 'app/data/nonYesNoQuestionOverrides.js');
const outPath = path.join(root, 'app/data/templates/all_cards_with_arrays.json');

function loadArray(filePath, symbol) {
  const source = fs.readFileSync(filePath, 'utf8');
  const context = vm.createContext({});
  vm.runInContext(`${source}\nthis.__out = ${symbol};`, context, { filename: filePath });
  const value = context.__out;
  if (!Array.isArray(value)) {
    throw new Error(`${symbol} is not an array in ${filePath}`);
  }
  return value;
}

const yesNo = loadArray(yesNoPath, 'TAP_YES_NO_OVERRIDES');
const nonYesNo = loadArray(nonYesNoPath, 'NON_YES_NO_QUESTION_OVERRIDES');
const all = [...yesNo, ...nonYesNo].sort((a, b) => {
  const ka = `${a.lessonId || ''}::${a.stepId || ''}`;
  const kb = `${b.lessonId || ''}::${b.stepId || ''}`;
  return ka.localeCompare(kb);
});

fs.writeFileSync(outPath, JSON.stringify(all, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({
  ok: true,
  outPath: path.relative(root, outPath),
  totalCards: all.length,
  yesNo: yesNo.length,
  nonYesNo: nonYesNo.length
}, null, 2));
