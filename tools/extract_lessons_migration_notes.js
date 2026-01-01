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

const context = {
  console,
  window: {},
};

runFileIntoContext(tracksPath, context);
runFileIntoContext(lessonsPath, context);

const notes = context.window.__LESSONS_MIGRATION_NOTES__;
if (!notes) {
  console.error('No migration notes found.');
  process.exit(1);
}

const outPath = path.join(root, 'tools', 'lessons_migration_notes.json');
fs.writeFileSync(outPath, JSON.stringify(notes, null, 2) + '\n', 'utf8');
console.log('Wrote', outPath);
