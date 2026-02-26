const fs = require('fs');
const path = require('path');

const MIN_VERBS = 4;
const templatesDir = path.join(__dirname, '..', 'app', 'data', 'templates');

const AUXILIARY_VERBS = new Set([
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had',
  'do', 'does', 'did',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must'
]);

const COMMON_VERBS = new Set([
  'go', 'goes', 'went', 'gone',
  'come', 'comes', 'came',
  'walk', 'walks', 'walked', 'walking',
  'run', 'runs', 'ran', 'running',
  'play', 'plays', 'played', 'playing',
  'look', 'looks', 'looked', 'looking',
  'see', 'sees', 'saw', 'seen', 'seeing',
  'say', 'says', 'said', 'saying',
  'tell', 'tells', 'told',
  'ask', 'asks', 'asked', 'asking',
  'help', 'helps', 'helped', 'helping',
  'open', 'opens', 'opened', 'opening',
  'close', 'closes', 'closed', 'closing',
  'stand', 'stands', 'stood', 'standing',
  'sit', 'sits', 'sat', 'sitting',
  'wait', 'waits', 'waited', 'waiting',
  'learn', 'learns', 'learned', 'learning',
  'read', 'reads', 'reading',
  'write', 'writes', 'wrote', 'written', 'writing',
  'eat', 'eats', 'ate', 'eaten', 'eating',
  'drink', 'drinks', 'drank', 'drunk', 'drinking',
  'sleep', 'sleeps', 'slept', 'sleeping',
  'wake', 'wakes', 'woke', 'woken', 'waking',
  'arrive', 'arrives', 'arrived', 'arriving',
  'leave', 'leaves', 'left', 'leaving',
  'turn', 'turns', 'turned', 'turning',
  'stop', 'stops', 'stopped', 'stopping',
  'start', 'starts', 'started', 'starting',
  'carry', 'carries', 'carried', 'carrying',
  'hold', 'holds', 'held', 'holding',
  'line', 'lined', 'lining',
  'smile', 'smiles', 'smiled', 'smiling',
  'feel', 'feels', 'felt', 'feeling',
  'watch', 'watches', 'watched', 'watching',
  'find', 'finds', 'found', 'finding',
  'make', 'makes', 'made', 'making',
  'take', 'takes', 'took', 'taken', 'taking',
  'put', 'puts', 'putting',
  'give', 'gives', 'gave', 'given', 'giving',
  'get', 'gets', 'got', 'getting',
  'bring', 'brings', 'brought', 'bringing',
  'use', 'uses', 'used', 'using',
  'work', 'works', 'worked', 'working',
  'open', 'opens', 'opened', 'opening',
  'need', 'needs', 'needed', 'needing',
  'want', 'wants', 'wanted', 'wanting',
  'like', 'likes', 'liked', 'liking',
  'love', 'loves', 'loved', 'loving',
  'try', 'tries', 'tried', 'trying',
  'study', 'studies', 'studied', 'studying',
  'draw', 'draws', 'drew', 'drawn', 'drawing',
  'sing', 'sings', 'sang', 'sung', 'singing',
  'jump', 'jumps', 'jumped', 'jumping',
  'clap', 'claps', 'clapped', 'clapping',
  'count', 'counts', 'counted', 'counting',
  'clean', 'cleans', 'cleaned', 'cleaning',
  'cook', 'cooks', 'cooked', 'cooking'
]);

function parseBookNumbers(argv) {
  const numbers = [];
  for (const raw of argv) {
    const parts = String(raw).split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const num = Number.parseInt(trimmed, 10);
      if (Number.isInteger(num) && num > 0) numbers.push(num);
    }
  }
  return [...new Set(numbers)];
}

function isWord(token) {
  return /^[a-z]+(?:'[a-z]+)?$/i.test(token);
}

function tokenizeEnglishStory(text) {
  const source = String(text || '');
  const tokens = source.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
  return tokens.filter(isWord).map((word) => word.toLowerCase());
}

function buildPaLookup(story) {
  const map = new Map();
  const add = (en, pa) => {
    const key = String(en || '').trim().toLowerCase();
    const value = String(pa || '').trim();
    if (!key || !value) return;
    if (!map.has(key)) map.set(key, value);
  };

  if (story.partsOfGrammar && typeof story.partsOfGrammar === 'object') {
    for (const value of Object.values(story.partsOfGrammar)) {
      if (!Array.isArray(value)) continue;
      for (const entry of value) {
        if (!entry || typeof entry !== 'object') continue;
        add(entry.en, entry.pa);
      }
    }
  }

  const vocabArrays = [];
  if (Array.isArray(story.vocabularyWords)) vocabArrays.push(story.vocabularyWords);
  if (Array.isArray(story.verocabularyWords)) vocabArrays.push(story.verocabularyWords);

  for (const vocabArray of vocabArrays) {
    for (const vocab of vocabArray) {
      if (!vocab || typeof vocab !== 'object') continue;
      add(vocab.word, vocab.meaningPa);
      add(vocab.en, vocab.pa);
    }
  }

  return map;
}

function isHeuristicVerb(token) {
  if (!isWord(token)) return false;
  const word = token.toLowerCase();
  if (COMMON_VERBS.has(word) || AUXILIARY_VERBS.has(word)) return true;
  if (word.length >= 4 && (word.endsWith('ing') || word.endsWith('ed'))) return true;
  if (word.length >= 4 && word.endsWith('es')) {
    const stem = word.slice(0, -2);
    if (COMMON_VERBS.has(stem) || COMMON_VERBS.has(`${stem}e`)) return true;
  }
  if (word.length >= 3 && word.endsWith('s')) {
    const stem = word.slice(0, -1);
    if (COMMON_VERBS.has(stem)) return true;
  }
  return false;
}

function collectCandidates(tokens, existingVerbSet) {
  const lexical = [];
  const auxiliaries = [];
  const seen = new Set(existingVerbSet);

  for (const token of tokens) {
    if (!isHeuristicVerb(token)) continue;
    const normalized = token.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    if (AUXILIARY_VERBS.has(normalized)) {
      auxiliaries.push(normalized);
    } else {
      lexical.push(normalized);
    }
  }

  return { lexical, auxiliaries };
}

function ensureStoryMinVerbs(story) {
  if (!story.partsOfGrammar || typeof story.partsOfGrammar !== 'object') {
    story.partsOfGrammar = {};
  }
  if (!Array.isArray(story.partsOfGrammar.verbs)) {
    story.partsOfGrammar.verbs = [];
  }

  const beforeCount = story.partsOfGrammar.verbs.length;
  const existingVerbSet = new Set(
    story.partsOfGrammar.verbs
      .map((entry) => String(entry && entry.en ? entry.en : '').trim().toLowerCase())
      .filter(Boolean)
  );

  const needed = Math.max(0, MIN_VERBS - beforeCount);
  if (needed === 0) {
    return {
      beforeCount,
      afterCount: beforeCount,
      addedVerbs: []
    };
  }

  const tokens = tokenizeEnglishStory(story.englishStory);
  const { lexical, auxiliaries } = collectCandidates(tokens, existingVerbSet);
  const paLookup = buildPaLookup(story);

  const additions = [];
  for (const word of lexical) {
    if (additions.length >= needed) break;
    const pa = paLookup.get(word) || 'ਕਿਰਿਆ';
    additions.push({ en: word, pa });
  }

  if (additions.length < needed) {
    for (const word of auxiliaries) {
      if (additions.length >= needed) break;
      const pa = paLookup.get(word) || 'ਕਿਰਿਆ';
      additions.push({ en: word, pa });
    }
  }

  if (additions.length > 0) {
    story.partsOfGrammar.verbs.push(...additions);
  }

  return {
    beforeCount,
    afterCount: story.partsOfGrammar.verbs.length,
    addedVerbs: additions.map((entry) => entry.en)
  };
}

function processFile(filePath) {
  const stories = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(stories)) {
    throw new Error(`Template root is not an array: ${filePath}`);
  }

  const changedStories = [];

  for (const story of stories) {
    const result = ensureStoryMinVerbs(story);
    if (result.afterCount !== result.beforeCount) {
      changedStories.push({
        storyId: story.storyId || 'UNKNOWN_STORY',
        beforeCount: result.beforeCount,
        afterCount: result.afterCount,
        addedVerbs: result.addedVerbs
      });
    }
  }

  if (changedStories.length > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(stories, null, 2)}\n`, 'utf8');
  }

  return {
    file: path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/'),
    storyCount: stories.length,
    changedStories
  };
}

function main() {
  const books = parseBookNumbers(process.argv.slice(2));
  if (books.length === 0) {
    console.error('Usage: node tools/ensure_story_verbs_min4.cjs <bookNumbers...>');
    console.error('Example: node tools/ensure_story_verbs_min4.cjs 1,2,3 or node tools/ensure_story_verbs_min4.cjs 1 2 3');
    process.exit(1);
  }

  const files = [];

  for (const book of books) {
    const filename = `book${book}_first10_stories.template.json`;
    const filePath = path.join(templatesDir, filename);

    if (!fs.existsSync(filePath)) {
      files.push({
        file: path.join('app', 'data', 'templates', filename).replace(/\\/g, '/'),
        missing: true,
        storyCount: 0,
        changedStories: []
      });
      continue;
    }

    const result = processFile(filePath);
    files.push({
      ...result,
      missing: false
    });
  }

  const summary = {
    script: 'ensure_story_verbs_min4',
    minVerbs: MIN_VERBS,
    books,
    files,
    totals: {
      filesProcessed: files.filter((f) => !f.missing).length,
      filesMissing: files.filter((f) => f.missing).length,
      storiesChanged: files.reduce((sum, file) => sum + file.changedStories.length, 0)
    }
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
