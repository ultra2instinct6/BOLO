const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const readingsPath = path.join(root, 'app/data/readings.js');
const templatesDir = path.join(root, 'app/data/templates');

const arg = process.argv[2] || '';
const bundleIds = Array.from(new Set(
  arg
    .split(',')
    .map((value) => Number(String(value).trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
));

if (bundleIds.length === 0) {
  console.error('Usage: node tools/sync_book_templates_from_readings.cjs <bundleId|bundleId1,bundleId2,...>');
  process.exit(1);
}

const code = fs.readFileSync(readingsPath, 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: readingsPath });

const allReadings = Array.isArray(sandbox.READINGS) ? sandbox.READINGS : [];

const books = [];
const outputFiles = [];

for (const bundleId of bundleIds) {
  const templatePath = path.join(templatesDir, `book${bundleId}_first10_stories.template.json`);

  const readings = allReadings
    .filter((item) => Number(item.bundleId) === bundleId)
    .sort((a, b) => (Number(a.orderInBundle) || 0) - (Number(b.orderInBundle) || 0));

  const mapped = readings.map((item) => ({
    storyId: item.id || item.storyId,
    bundleId: Number(item.bundleId) || bundleId,
    orderInBundle: Number(item.orderInBundle) || 0,
    titleEn: item.titleEn || '',
    titlePa: item.titlePa || '',
    englishStory: item.englishStory || item.english || '',
    punjabiStory: item.punjabiStory || item.punjabi || '',
    multipleChoiceQuestions: Array.isArray(item.multipleChoiceQuestions)
      ? item.multipleChoiceQuestions
      : (Array.isArray(item.questions)
        ? item.questions.map((q) => ({
            question: q.qEn || q.q || q.question || '',
            choices: Array.isArray(q.options)
              ? q.options.map((opt) => (typeof opt === 'string' ? opt : (opt && opt.en) || ''))
              : [],
            correctChoiceIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: (q.explanation && q.explanation.en) || q.explanation || ''
          }))
        : []),
    vocabularyWords: Array.isArray(item.vocabularyWords) ? item.vocabularyWords : [],
    partsOfGrammar: item.partsOfGrammar || item.partsOfSpeech || {}
  }));

  fs.writeFileSync(templatePath, `${JSON.stringify(mapped, null, 2)}\n`, 'utf8');

  books.push({
    bundleId,
    outputFile: templatePath,
    stories: mapped.length,
    ids: mapped.map((s) => s.storyId)
  });
  outputFiles.push(templatePath);
}

console.log(JSON.stringify({
  books,
  outputFiles
}, null, 2));
