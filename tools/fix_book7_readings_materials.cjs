const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const readingsPath = path.join(root, 'app', 'data', 'readings.js');
const source = fs.readFileSync(readingsPath, 'utf8');

const context = { console, window: {}, globalThis: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: readingsPath });

if (!Array.isArray(context.BOOK7_CUSTOM_STORIES)) {
  throw new Error('BOOK7_CUSTOM_STORIES not found in readings.js');
}

const MIN_VERBS = 4;

const COMMON_VERBS = new Set([
  'am', 'is', 'are', 'was', 'were', 'be',
  'go', 'goes', 'went', 'come', 'comes',
  'look', 'looks', 'help', 'helps',
  'play', 'plays', 'read', 'reads',
  'write', 'writes', 'draw', 'draws',
  'learn', 'learns', 'count', 'counts',
  'stand', 'stands', 'sit', 'sits',
  'walk', 'walks', 'turn', 'turns',
  'open', 'opens', 'close', 'closes',
  'stop', 'stops', 'wait', 'waits',
  'grow', 'grows', 'need', 'needs',
  'use', 'uses', 'make', 'makes',
  'share', 'shares', 'explain', 'explains',
  'disagree', 'agrees', 'agree'
]);

const FALLBACK_VERBS = ['go', 'look', 'help', 'play', 'read'];

function trimText(value) {
  return String(value || '').trim();
}

function normalizeWord(value) {
  return trimText(value).toLowerCase();
}

function tokenize(text) {
  return (String(text || '').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).map((w) => w.toLowerCase());
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

  let added = 0;
  const tokens = tokenize(story.englishStory);
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

const stories = context.BOOK7_CUSTOM_STORIES;
let verbsTouched = 0;

for (const story of stories) {
  const beforeCount = Array.isArray(story?.partsOfSpeech?.verbs) ? story.partsOfSpeech.verbs.length : 0;
  ensureVerbs(story);
  const afterCount = Array.isArray(story?.partsOfSpeech?.verbs) ? story.partsOfSpeech.verbs.length : 0;
  if (afterCount !== beforeCount) {
    verbsTouched += 1;
  }
}

const replacement = `var BOOK7_CUSTOM_STORIES = ${JSON.stringify(stories, null, 2)};`;
const blockRegex = /var BOOK7_CUSTOM_STORIES = \[[\s\S]*?\n\];/;
if (!blockRegex.test(source)) {
  throw new Error('BOOK7_CUSTOM_STORIES block not found in readings.js');
}

const next = source.replace(blockRegex, replacement);
if (next !== source) {
  fs.writeFileSync(readingsPath, next, 'utf8');
}

console.log(JSON.stringify({
  ok: true,
  stories: stories.length,
  verbsStoriesUpdated: verbsTouched,
  minVerbsTarget: MIN_VERBS
}, null, 2));