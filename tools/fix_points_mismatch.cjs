#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'app', 'data', 'lessons.js');
const src = fs.readFileSync(FILE, 'utf8');
eval(src);

let mismatches = [];
for (const key of Object.keys(LESSONS)) {
  if (!key.startsWith('L_')) continue;
  const lesson = LESSONS[key];
  let sum = 0;
  for (const s of lesson.steps) sum += (s.points || 0);
  const meta = lesson.metadata.objective.pointsAvailable;
  if (sum !== meta) {
    mismatches.push({ key, actual: sum, meta });
    console.log(key, 'actual:', sum, 'meta:', meta);
  }
}
if (mismatches.length === 0) {
  console.log('All pointsAvailable values correct.');
} else {
  // Auto-fix
  let fixed = src;
  for (const m of mismatches) {
    const lessonStart = fixed.indexOf('"' + m.key + '"');
    const ptsIdx = fixed.indexOf('"pointsAvailable":', lessonStart);
    if (ptsIdx === -1) continue;
    // Find the number
    const colonIdx = fixed.indexOf(':', ptsIdx + 18);
    const lineEnd = fixed.indexOf('\n', colonIdx);
    const numStr = fixed.substring(colonIdx + 1, lineEnd).trim().replace(',', '');
    const num = parseInt(numStr, 10);
    if (num === m.meta) {
      fixed = fixed.substring(0, colonIdx + 1) + ' ' + m.actual + fixed.substring(colonIdx + 1 + (' ' + numStr).length);
      console.log('Fixed', m.key, num, '->', m.actual);
    }
  }
  fs.writeFileSync(FILE, fixed, 'utf8');
}
