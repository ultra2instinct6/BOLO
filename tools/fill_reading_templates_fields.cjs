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

const DEFAULT_DEFINITIONS = {
  nouns: {
    definitionEn: 'A noun is a person, place, or thing.',
    definitionPa: 'ਨਾਂਵ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ।'
  },
  verbs: {
    definitionEn: 'A verb shows an action or a state (being).',
    definitionPa: 'ਕਿਰਿਆ ਕੰਮ ਜਾਂ ਹਾਲਤ (ਹੋਣਾ) ਦੱਸਦੀ ਹੈ।'
  },
  pronouns: {
    definitionEn: 'A pronoun replaces a noun (I, you, my).',
    definitionPa: 'ਸਰਵਨਾਮ ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (ਮੈਂ, ਤੂੰ/ਤੁਸੀਂ, ਮੇਰਾ)।'
  },
  adjectives: {
    definitionEn: 'An adjective describes a noun.',
    definitionPa: 'ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ।'
  },
  adverbs: {
    definitionEn: 'An adverb describes a verb, adjective, or another adverb (how, when, where).',
    definitionPa: 'ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਰਿਆ, ਵਿਸ਼ੇਸ਼ਣ ਜਾਂ ਹੋਰ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਬਾਰੇ ਦੱਸਦਾ ਹੈ (ਕਿਵੇਂ, ਕਦੋਂ, ਕਿੱਥੇ)।'
  },
  prepositions: {
    definitionEn: 'A preposition shows location or relationship (in, on, by).',
    definitionPa: 'ਸਬੰਧ ਬੋਧਕ ਥਾਂ ਜਾਂ ਸਬੰਧ ਦੱਸਦਾ ਹੈ (ਵਿੱਚ, ਉੱਤੇ, ਦੇ ਕੋਲ)।'
  },
  conjunctions: {
    definitionEn: 'A conjunction joins words, phrases, or clauses (and, but, because).',
    definitionPa: 'ਸੰਯੋਜਕ ਸ਼ਬਦ, ਭਾਗਾਂ ਜਾਂ ਵਾਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ (ਅਤੇ, ਪਰ, ਕਿਉਂਕਿ)।'
  },
  articles: {
    definitionEn: 'An article introduces a noun as specific or general (a, an, the).',
    definitionPa: 'ਲੇਖ (ਆਰਟਿਕਲ) ਨਾਂਵ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ ਅਤੇ ਖ਼ਾਸ ਜਾਂ ਆਮ ਅਰਥ ਦਿੰਦਾ ਹੈ (a, an, the)।'
  },
  interjections: {
    definitionEn: 'An interjection shows sudden feeling or reaction (wow!, oh!, yay!).',
    definitionPa: 'ਵਿਸਮਿਆਦਿਬੋਧਕ ਅਚਾਨਕ ਭਾਵਨਾ ਜਾਂ ਪ੍ਰਤੀਕਿਰਿਆ ਦੱਸਦਾ ਹੈ (ਵਾਹ!, ਓਹ!, ਯੇ!).'
  }
};

function nonEmpty(value) {
  return String(value ?? '').trim().length > 0;
}

function toPaFallback(enValue, fallback) {
  if (nonEmpty(enValue)) return String(enValue);
  return fallback;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureQuestionFields(question) {
  let changed = 0;
  if (!nonEmpty(question.question)) {
    question.question = 'Question';
    changed += 1;
  }
  if (!nonEmpty(question.questionPa)) {
    question.questionPa = toPaFallback(question.question, 'ਸਵਾਲ');
    changed += 1;
  }

  question.choices = ensureArray(question.choices).map((choice) => String(choice ?? ''));
  if (question.choices.length < 2) {
    question.choices = ['Option 1', 'Option 2'];
    changed += 1;
  }

  const choicesPa = ensureArray(question.choicesPa).map((choice) => String(choice ?? ''));
  if (choicesPa.length !== question.choices.length) {
    question.choicesPa = question.choices.map((choice, index) => toPaFallback(choicesPa[index], choice));
    changed += 1;
  } else if (choicesPa.some((choice) => !nonEmpty(choice))) {
    question.choicesPa = question.choices.map((choice, index) => toPaFallback(choicesPa[index], choice));
    changed += 1;
  }

  if (typeof question.correctChoiceIndex !== 'number' || question.correctChoiceIndex < 0 || question.correctChoiceIndex >= question.choices.length) {
    question.correctChoiceIndex = 0;
    changed += 1;
  }

  if (!nonEmpty(question.explanation)) {
    question.explanation = 'Review the story to find the correct answer.';
    changed += 1;
  }
  if (!nonEmpty(question.explanationPa)) {
    question.explanationPa = 'ਸਹੀ ਜਵਾਬ ਲਈ ਕਹਾਣੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ।';
    changed += 1;
  }

  return changed;
}

function ensureVocabFields(vocab) {
  let changed = 0;
  if (!nonEmpty(vocab.word)) {
    vocab.word = 'word';
    changed += 1;
  }
  if (!nonEmpty(vocab.meaningEn)) {
    vocab.meaningEn = 'word meaning';
    changed += 1;
  }
  if (!nonEmpty(vocab.meaningPa)) {
    vocab.meaningPa = 'ਸ਼ਬਦ ਦਾ ਅਰਥ';
    changed += 1;
  }
  return changed;
}

function ensureGrammarEntry(entry) {
  let changed = 0;
  if (!nonEmpty(entry.en)) {
    entry.en = 'word';
    changed += 1;
  }
  if (!nonEmpty(entry.pa)) {
    entry.pa = 'ਸ਼ਬਦ';
    changed += 1;
  }
  return changed;
}

function fixStory(story) {
  let changed = 0;

  if (!nonEmpty(story.storyId)) {
    story.storyId = 'STORY_ID';
    changed += 1;
  }
  if (typeof story.bundleId !== 'number') {
    story.bundleId = Number(story.bundleId) || 1;
    changed += 1;
  }
  if (typeof story.orderInBundle !== 'number') {
    story.orderInBundle = Number(story.orderInBundle) || 1;
    changed += 1;
  }
  if (!nonEmpty(story.titleEn)) {
    story.titleEn = 'Story';
    changed += 1;
  }
  if (!nonEmpty(story.titlePa)) {
    story.titlePa = 'ਕਹਾਣੀ';
    changed += 1;
  }
  if (!nonEmpty(story.englishStory)) {
    story.englishStory = 'Story content coming soon.';
    changed += 1;
  }
  if (!nonEmpty(story.punjabiStory)) {
    story.punjabiStory = 'ਕਹਾਣੀ ਦੀ ਸਮੱਗਰੀ ਜਲਦੀ ਆ ਰਹੀ ਹੈ।';
    changed += 1;
  }

  story.multipleChoiceQuestions = ensureArray(story.multipleChoiceQuestions);
  if (story.multipleChoiceQuestions.length === 0) {
    story.multipleChoiceQuestions.push({
      question: 'What is this story about?',
      questionPa: 'ਇਹ ਕਹਾਣੀ ਕਿਸ ਬਾਰੇ ਹੈ?',
      choices: ['Story topic', 'Not related'],
      choicesPa: ['ਕਹਾਣੀ ਦਾ ਵਿਸ਼ਾ', 'ਸੰਬੰਧਿਤ ਨਹੀਂ'],
      correctChoiceIndex: 0,
      explanation: 'Pick the option that matches the story.',
      explanationPa: 'ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜੋ ਕਹਾਣੀ ਨਾਲ ਮਿਲਦਾ ਹੋਵੇ।'
    });
    changed += 1;
  }
  for (const question of story.multipleChoiceQuestions) {
    changed += ensureQuestionFields(question);
  }

  story.vocabularyWords = ensureArray(story.vocabularyWords);
  if (story.vocabularyWords.length === 0) {
    story.vocabularyWords.push({
      word: 'word',
      meaningEn: 'word meaning',
      meaningPa: 'ਸ਼ਬਦ ਦਾ ਅਰਥ'
    });
    changed += 1;
  }
  for (const vocab of story.vocabularyWords) {
    changed += ensureVocabFields(vocab);
  }

  if (!story.partsOfGrammar || typeof story.partsOfGrammar !== 'object') {
    story.partsOfGrammar = {};
    changed += 1;
  }
  if (!story.partsOfGrammar.definitions || typeof story.partsOfGrammar.definitions !== 'object') {
    story.partsOfGrammar.definitions = {};
    changed += 1;
  }
  for (const key of POS_KEYS) {
    if (!story.partsOfGrammar.definitions[key] || typeof story.partsOfGrammar.definitions[key] !== 'object') {
      story.partsOfGrammar.definitions[key] = { ...DEFAULT_DEFINITIONS[key] };
      changed += 1;
    } else {
      if (!nonEmpty(story.partsOfGrammar.definitions[key].definitionEn)) {
        story.partsOfGrammar.definitions[key].definitionEn = DEFAULT_DEFINITIONS[key].definitionEn;
        changed += 1;
      }
      if (!nonEmpty(story.partsOfGrammar.definitions[key].definitionPa)) {
        story.partsOfGrammar.definitions[key].definitionPa = DEFAULT_DEFINITIONS[key].definitionPa;
        changed += 1;
      }
    }

    story.partsOfGrammar[key] = ensureArray(story.partsOfGrammar[key]);
    if (story.partsOfGrammar[key].length === 0) {
      story.partsOfGrammar[key].push({ en: key.slice(0, -1), pa: 'ਸ਼ਬਦ' });
      changed += 1;
    }
    for (const entry of story.partsOfGrammar[key]) {
      changed += ensureGrammarEntry(entry);
    }
  }

  return changed;
}

const summary = [];

for (const name of files) {
  const filePath = path.join(templatesDir, name);
  const stories = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fileChanges = 0;

  for (const story of stories) {
    fileChanges += fixStory(story);
  }

  if (fileChanges > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(stories, null, 2)}\n`, 'utf8');
  }

  summary.push({ file: name, stories: stories.length, changes: fileChanges });
}

console.log(JSON.stringify(summary, null, 2));
