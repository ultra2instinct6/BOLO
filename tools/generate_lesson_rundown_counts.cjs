const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatesDir = path.join(root, 'app', 'data', 'templates');

const POS_KEYS = [
  'nouns',
  'verbs',
  'pronouns',
  'adjectives',
  'adverbs',
  'prepositions',
  'conjunctions',
  'articles',
  'interjections'
];

const files = fs.readdirSync(templatesDir)
  .filter((name) => /^book\d+_first10_stories\.template\.json$/.test(name))
  .sort((a, b) => Number(a.match(/^book(\d+)_/)[1]) - Number(b.match(/^book(\d+)_/)[1]));

const report = [];

for (const file of files) {
  const filePath = path.join(templatesDir, file);
  const stories = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const story of stories) {
    const pos = story.partsOfGrammar || {};
    const posBreakdown = {};
    let posTotal = 0;

    for (const key of POS_KEYS) {
      const count = Array.isArray(pos[key]) ? pos[key].length : 0;
      posBreakdown[key] = count;
      posTotal += count;
    }

    const questions = Array.isArray(story.multipleChoiceQuestions) ? story.multipleChoiceQuestions : [];
    const optionsPerQuestion = questions.map((q) => (Array.isArray(q.choices) ? q.choices.length : 0));
    const optionsTotal = optionsPerQuestion.reduce((sum, count) => sum + count, 0);

    const vocabCount = Array.isArray(story.vocabularyWords) ? story.vocabularyWords.length : 0;

    report.push({
      file,
      storyId: story.storyId || null,
      titleEn: story.titleEn || '',
      counts: {
        partsOfSpeechTotal: posTotal,
        partsOfSpeechBreakdown: posBreakdown,
        vocabularyWords: vocabCount,
        multipleChoiceQuestions: questions.length,
        multipleChoiceOptionsTotal: optionsTotal,
        multipleChoiceOptionsPerQuestion: optionsPerQuestion
      }
    });
  }
}

const totals = report.reduce(
  (acc, row) => {
    acc.lessons += 1;
    acc.vocabularyWords += row.counts.vocabularyWords;
    acc.multipleChoiceQuestions += row.counts.multipleChoiceQuestions;
    acc.multipleChoiceOptions += row.counts.multipleChoiceOptionsTotal;

    for (const [key, value] of Object.entries(row.counts.partsOfSpeechBreakdown)) {
      acc.partsOfSpeech[key] = (acc.partsOfSpeech[key] || 0) + value;
    }

    return acc;
  },
  {
    lessons: 0,
    vocabularyWords: 0,
    multipleChoiceQuestions: 0,
    multipleChoiceOptions: 0,
    partsOfSpeech: {}
  }
);

const outPath = path.join(templatesDir, 'lesson_rundown_counts.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log(
  JSON.stringify(
    {
      ok: true,
      files: files.length,
      output: path.relative(root, outPath),
      totals
    },
    null,
    2
  )
);
