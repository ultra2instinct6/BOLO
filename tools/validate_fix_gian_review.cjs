#!/usr/bin/env node
/**
 * Validates all 29 L_ lessons have:
 *   fix_it_sentence → gian_check → summary_bullets
 * in correct order, with correct option counts.
 */
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('app/data/lessons.js', 'utf8');
const sandbox = { console, window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const LESSONS = sandbox.LESSONS || sandbox.window.LESSONS;
const ids = Object.keys(LESSONS).filter(k => k.startsWith('L_'));

const results = [];
for (const id of ids) {
  const lesson = LESSONS[id];
  const steps = lesson.steps || [];
  const types = steps.map(s => s.step_type || s.type);

  const fixItIdx = types.lastIndexOf('fix_it_sentence');
  const gianIdx  = types.lastIndexOf('gian_check');
  const summaryIdx = types.lastIndexOf('summary_bullets');

  const hasFixIt  = fixItIdx !== -1;
  const hasGian   = gianIdx  !== -1;
  const hasSummary = summaryIdx !== -1;

  const fixStep  = hasFixIt ? steps[fixItIdx] : null;
  const gianStep = hasGian  ? steps[gianIdx]  : null;
  const fixOpts  = fixStep  ? (fixStep.options  || []).length : 0;
  const gianOpts = gianStep ? (gianStep.options || []).length : 0;

  const issues = [];
  if (!hasFixIt)   issues.push('MISSING fix_it_sentence');
  if (!hasGian)    issues.push('MISSING gian_check');
  if (!hasSummary) issues.push('MISSING summary_bullets');
  if (hasFixIt  && fixOpts  !== 2) issues.push('fix_it has ' + fixOpts + ' options (expected 2)');
  if (hasGian   && gianOpts !== 3) issues.push('gian_check has ' + gianOpts + ' options (expected 3)');
  if (hasFixIt  && hasGian    && fixItIdx  > gianIdx)   issues.push('fix_it AFTER gian_check');
  if (hasGian   && hasSummary && gianIdx   > summaryIdx) issues.push('gian_check AFTER summary_bullets');
  if (hasSummary && summaryIdx !== types.length - 1)     issues.push('summary_bullets not last step');

  // Check fix_it points = 5, gian_check points = 15
  if (fixStep  && fixStep.points  !== 5)  issues.push('fix_it points=' + fixStep.points + ' (expected 5)');
  if (gianStep && gianStep.points !== 15) issues.push('gian_check points=' + gianStep.points + ' (expected 15)');

  // Check gian_check has feedback
  if (gianStep && (!gianStep.feedback || !gianStep.feedback.correctEn)) {
    issues.push('gian_check missing custom feedback');
  }

  results.push({ id, hasFixIt, hasGian, hasSummary, fixOpts, gianOpts, issueCount: issues.length, issues });
}

const passing = results.filter(r => r.issueCount === 0);
const failing = results.filter(r => r.issueCount > 0);

console.log(JSON.stringify({
  total: results.length,
  passing: passing.length,
  failing: failing.length,
  failDetails: failing.map(f => ({ id: f.id, issues: f.issues }))
}, null, 2));

process.exit(failing.length > 0 ? 1 : 0);
