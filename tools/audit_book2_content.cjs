const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const readingsPath = path.join(root, 'app/data/readings.js');
const templatePath = path.join(root, 'app/data/templates/book2_first10_stories.template.json');

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

const code = fs.readFileSync(readingsPath, 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: readingsPath });

const runtimeStories = (sandbox.READINGS || [])
  .filter((item) => Number(item.bundleId) === 2)
  .sort((a, b) => (Number(a.orderInBundle) || 0) - (Number(b.orderInBundle) || 0));

let runtimeEmptyBuckets = 0;
let runtimeEmptyFields = 0;

for (const story of runtimeStories) {
  const pos = story.partsOfSpeech || {};
  for (const key of POS_KEYS) {
    const arr = Array.isArray(pos[key]) ? pos[key] : [];
    if (!arr.length) runtimeEmptyBuckets += 1;
    for (const item of arr) {
      const en = String((item && item.en) || '').trim();
      const pa = String((item && item.pa) || '').trim();
      if (!en || !pa) runtimeEmptyFields += 1;
    }
  }
}

const templateStories = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
let templateStoriesWithIssues = 0;
const templateIssueIds = [];

for (const story of templateStories) {
  const issues = [];
  if (!String(story.titleEn || '').trim() || !String(story.titlePa || '').trim()) issues.push('title');
  if (!String(story.englishStory || '').trim() || !String(story.punjabiStory || '').trim()) issues.push('story');

  const vocab = Array.isArray(story.vocabularyWords) ? story.vocabularyWords : [];
  if (vocab.length < 3) issues.push('vocab<3');
  for (const item of vocab) {
    if (!String(item.word || '').trim() || !String(item.meaningEn || '').trim() || !String(item.meaningPa || '').trim()) {
      issues.push('bad_vocab');
      break;
    }
  }

  const questions = Array.isArray(story.multipleChoiceQuestions) ? story.multipleChoiceQuestions : [];
  if (questions.length < 5) issues.push('questions<5');
  for (const q of questions) {
    const choices = Array.isArray(q.choices) ? q.choices : [];
    if (!String(q.question || '').trim() || choices.length < 2 || typeof q.correctChoiceIndex !== 'number') {
      issues.push('bad_question');
      break;
    }
  }

  const pog = story.partsOfGrammar || {};
  const defs = pog.definitions || {};
  for (const key of POS_KEYS) {
    const arr = Array.isArray(pog[key]) ? pog[key] : [];
    if (!arr.length) issues.push(`pos:${key}`);
    if (!defs[key] || !String(defs[key].definitionPa || '').trim()) issues.push(`def:${key}`);
  }

  if (issues.length) {
    templateStoriesWithIssues += 1;
    templateIssueIds.push({ id: story.storyId || story.id, issues: [...new Set(issues)] });
  }
}

console.log(JSON.stringify({
  runtime: {
    stories: runtimeStories.length,
    emptyBuckets: runtimeEmptyBuckets,
    emptyFields: runtimeEmptyFields
  },
  template: {
    stories: templateStories.length,
    storiesWithIssues: templateStoriesWithIssues,
    issueIds: templateIssueIds
  }
}, null, 2));
