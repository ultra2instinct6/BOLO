const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const readingsPath = path.join(root, 'app/data/readings.js');
const templatePath = path.join(root, 'app/data/templates/book2_first10_stories.template.json');

const code = fs.readFileSync(readingsPath, 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: readingsPath });

const readings = (sandbox.READINGS || [])
  .filter((item) => Number(item.bundleId) === 2)
  .sort((a, b) => (Number(a.orderInBundle) || 0) - (Number(b.orderInBundle) || 0));

const mapped = readings.map((item) => ({
  storyId: item.id || item.storyId,
  bundleId: Number(item.bundleId) || 2,
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

console.log(JSON.stringify({
  written: templatePath,
  stories: mapped.length,
  ids: mapped.map((s) => s.storyId)
}, null, 2));
