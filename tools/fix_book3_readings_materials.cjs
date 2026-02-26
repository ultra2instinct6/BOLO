const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const readingsPath = path.join(root, 'app', 'data', 'readings.js');
const source = fs.readFileSync(readingsPath, 'utf8');

const context = { console, window: {}, globalThis: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: readingsPath });

if (!Array.isArray(context.BOOK3_CUSTOM_STORIES)) {
  throw new Error('BOOK3_CUSTOM_STORIES not found in readings.js');
}

const MIN_VOCAB = 10;
const MIN_VERBS = 4;

const COMMON_VERBS = new Set([
  'am', 'is', 'are', 'was', 'were', 'be',
  'open', 'opens', 'stand', 'stands', 'help', 'helps',
  'eat', 'eats', 'drink', 'drinks', 'sit', 'sits', 'walk', 'walks',
  'go', 'goes', 'play', 'plays', 'look', 'looks', 'read', 'reads',
  'write', 'writes', 'sleep', 'sleeps', 'wash', 'washes', 'clean', 'cleans',
  'talk', 'talks', 'learn', 'learns', 'draw', 'draws', 'count', 'counts',
  'turn', 'turns', 'stop', 'stops', 'wait', 'waits'
]);

const FALLBACK_VERBS = ['go', 'look', 'help', 'play', 'read'];

function trimText(value) {
  return String(value || '').trim();
}

function normalizeWord(value) {
  return trimText(value).toLowerCase();
}

function pickPa(entry) {
  const raw = trimText(entry && entry.pa);
  if (!raw) return 'ਸ਼ਬਦ';
  return raw.split(';')[0].trim() || raw;
}

function tokenize(text) {
  return (String(text || '').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).map((w) => w.toLowerCase());
}

function defaultMeaningEn(word, category) {
  if (category === 'verbs') return `action word from the story: ${word}`;
  if (category === 'adjectives') return `describing word from the story: ${word}`;
  if (category === 'prepositions') return `position word from the story: ${word}`;
  return `story word: ${word}`;
}

function ensureVocab(story) {
  const pos = story.partsOfSpeech && typeof story.partsOfSpeech === 'object' ? story.partsOfSpeech : {};
  const existing = Array.isArray(story.vocabularyWords) ? story.vocabularyWords : [];

  const out = [];
  const seen = new Set();

  for (const item of existing) {
    const word = trimText(item && item.word);
    if (!word) continue;
    const key = normalizeWord(word);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      word,
      meaningEn: trimText(item.meaningEn) || defaultMeaningEn(word, 'nouns'),
      meaningPa: trimText(item.meaningPa) || 'ਸ਼ਬਦ'
    });
  }

  const feedCategories = ['nouns', 'verbs', 'adjectives', 'prepositions', 'adverbs', 'conjunctions', 'articles', 'interjections', 'pronouns'];

  for (const cat of feedCategories) {
    const arr = Array.isArray(pos[cat]) ? pos[cat] : [];
    for (const entry of arr) {
      if (out.length >= MIN_VOCAB) break;
      const word = trimText(entry && entry.en);
      if (!word) continue;
      const key = normalizeWord(word);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        word,
        meaningEn: defaultMeaningEn(word, cat),
        meaningPa: pickPa(entry)
      });
    }
    if (out.length >= MIN_VOCAB) break;
  }

  if (out.length < MIN_VOCAB) {
    const tokens = tokenize(story.englishStory);
    for (const token of tokens) {
      if (out.length >= MIN_VOCAB) break;
      if (token.length < 3) continue;
      const key = normalizeWord(token);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        word: token,
        meaningEn: `story word: ${token}`,
        meaningPa: 'ਸ਼ਬਦ'
      });
    }
  }

  story.vocabularyWords = out;
  return out.length;
}

function ensureVerbs(story) {
  if (!story.partsOfSpeech || typeof story.partsOfSpeech !== 'object') {
    story.partsOfSpeech = {};
  }
  if (!Array.isArray(story.partsOfSpeech.verbs)) {
    story.partsOfSpeech.verbs = [];
  }

  const verbs = story.partsOfSpeech.verbs;
  const seen = new Set(verbs.map((v) => normalizeWord(v && v.en)).filter(Boolean));

  if (verbs.length >= MIN_VERBS) return 0;

  const tokens = tokenize(story.englishStory);
  let added = 0;
  for (const token of tokens) {
    if (verbs.length >= MIN_VERBS) break;
    if (!COMMON_VERBS.has(token)) continue;
    if (seen.has(token)) continue;
    seen.add(token);
    verbs.push({ en: token, pa: 'ਕਿਰਿਆ' });
    added += 1;
  }

  for (const fallback of FALLBACK_VERBS) {
    if (verbs.length >= MIN_VERBS) break;
    if (seen.has(fallback)) continue;
    seen.add(fallback);
    verbs.push({ en: fallback, pa: 'ਕਿਰਿਆ' });
    added += 1;
  }

  return added;
}

const stories = context.BOOK3_CUSTOM_STORIES;
let vocabTouched = 0;
let verbsTouched = 0;

for (const story of stories) {
  const beforeVocab = Array.isArray(story.vocabularyWords) ? story.vocabularyWords.length : 0;
  const afterVocab = ensureVocab(story);
  if (afterVocab !== beforeVocab) vocabTouched += 1;

  const addedVerbs = ensureVerbs(story);
  if (addedVerbs > 0) verbsTouched += 1;
}

const replacement = `var BOOK3_CUSTOM_STORIES = ${JSON.stringify(stories, null, 2)};`;
const blockRegex = /var BOOK3_CUSTOM_STORIES = \[[\s\S]*?\n\];/;
if (!blockRegex.test(source)) {
  throw new Error('BOOK3_CUSTOM_STORIES block not found in readings.js');
}

const next = source.replace(blockRegex, replacement);
if (next !== source) {
  fs.writeFileSync(readingsPath, next, 'utf8');
}

console.log(JSON.stringify({
  ok: true,
  stories: stories.length,
  vocabStoriesUpdated: vocabTouched,
  verbsStoriesUpdated: verbsTouched,
  minVocabTarget: MIN_VOCAB,
  minVerbsTarget: MIN_VERBS
}, null, 2));