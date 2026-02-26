#!/usr/bin/env node

const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node tools/normalize_core_updates_style.cjs <updates.json>');
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
if (!Array.isArray(rows)) {
  console.error('Expected top-level array.');
  process.exit(1);
}

const normalized = rows.map((row) => {
  const out = { ...row };
  if (out.source === 'nonYesNo' && (out.points === undefined || out.points === null)) {
    out.points = 5;
  }
  return out;
});

fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ ok: true, rows: normalized.length }, null, 2));
