const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'app', 'data', 'templates');
const files = fs.readdirSync(templatesDir).filter((name) => name.endsWith('.template.json'));

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

function nonEmpty(value) {
  return String(value ?? '').trim().length > 0;
}

let totalIssues = 0;

for (const name of files) {
  const filePath = path.join(templatesDir, name);
  const stories = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const issues = [];

  for (const story of stories) {
    const id = story.storyId || 'UNKNOWN_STORY';

    for (const field of ['storyId', 'bundleId', 'orderInBundle', 'titleEn', 'titlePa', 'englishStory', 'punjabiStory']) {
      if (!(field in story) || story[field] === null || (typeof story[field] === 'string' && !nonEmpty(story[field]))) {
        issues.push(`${id}:missing:${field}`);
      }
    }

    if (!Array.isArray(story.multipleChoiceQuestions) || story.multipleChoiceQuestions.length === 0) {
      issues.push(`${id}:empty:multipleChoiceQuestions`);
    } else {
      for (const [index, question] of story.multipleChoiceQuestions.entries()) {
        for (const field of ['question', 'questionPa', 'correctChoiceIndex', 'explanation', 'explanationPa']) {
          if (!(field in question) || question[field] === null || (typeof question[field] === 'string' && !nonEmpty(question[field]))) {
            issues.push(`${id}:q${index}:missing:${field}`);
          }
        }

        if (!Array.isArray(question.choices) || question.choices.length < 2) {
          issues.push(`${id}:q${index}:bad:choices`);
        }

        if (!Array.isArray(question.choicesPa) || !Array.isArray(question.choices) || question.choicesPa.length !== question.choices.length) {
          issues.push(`${id}:q${index}:bad:choicesPa`);
        }
      }
    }

    if (!Array.isArray(story.vocabularyWords) || story.vocabularyWords.length === 0) {
      issues.push(`${id}:empty:vocabularyWords`);
    } else {
      for (const [index, vocab] of story.vocabularyWords.entries()) {
        for (const field of ['word', 'meaningEn', 'meaningPa']) {
          if (!(field in vocab) || !nonEmpty(vocab[field])) {
            issues.push(`${id}:v${index}:missing:${field}`);
          }
        }
      }
    }

    if (!story.partsOfGrammar || typeof story.partsOfGrammar !== 'object') {
      issues.push(`${id}:missing:partsOfGrammar`);
      continue;
    }

    const definitions = story.partsOfGrammar.definitions;
    if (!definitions || typeof definitions !== 'object') {
      issues.push(`${id}:missing:definitions`);
    }

    for (const key of POS_KEYS) {
      if (!definitions || !definitions[key] || !nonEmpty(definitions[key].definitionEn) || !nonEmpty(definitions[key].definitionPa)) {
        issues.push(`${id}:missing:def:${key}`);
      }

      if (!Array.isArray(story.partsOfGrammar[key]) || story.partsOfGrammar[key].length === 0) {
        issues.push(`${id}:empty:pos:${key}`);
      } else {
        for (const [index, entry] of story.partsOfGrammar[key].entries()) {
          if (!nonEmpty(entry.en) || !nonEmpty(entry.pa)) {
            issues.push(`${id}:pos:${key}:${index}:missing:enpa`);
          }
        }
      }
    }
  }

  totalIssues += issues.length;
  console.log(`${name}: stories=${stories.length}, issues=${issues.length}`);
  if (issues.length > 0) {
    console.log(issues.slice(0, 25).join('\n'));
  }
}

console.log(`TOTAL_ISSUES=${totalIssues}`);
