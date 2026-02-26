#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SHARED_DEFINITIONS = {
  nouns: {
    definitionEn: 'A noun is a person, place, or thing.',
    definitionPa: 'ਨਾਂਵ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ।'
  },
  verbs: {
    definitionEn: 'A verb shows an action or a state (being).',
    definitionPa: 'ਕਿਰਿਆ ਕੰਮ ਜਾਂ ਹਾਲਤ (ਹੋਣਾ) ਦੱਸਦੀ ਹੈ।'
  },
  adjectives: {
    definitionEn: 'An adjective describes a noun.',
    definitionPa: 'ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ।'
  },
  pronouns: {
    definitionEn: 'A pronoun replaces a noun (I, you, my).',
    definitionPa: 'ਸਰਵਨਾਮ ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (ਮੈਂ, ਤੂੰ/ਤੁਸੀਂ, ਮੇਰਾ)।'
  },
  prepositions: {
    definitionEn: 'A preposition shows location or relationship (in, on, by).',
    definitionPa: 'ਸਬੰਧ ਬੋਧਕ ਥਾਂ ਜਾਂ ਸਬੰਧ ਦੱਸਦਾ ਹੈ (ਵਿੱਚ, ਉੱਤੇ, ਦੇ ਕੋਲ)।'
  }
};

const PA_FALLBACK = {
  nouns: 'ਸ਼ਬਦ',
  verbs: 'ਕਿਰਿਆ',
  adjectives: 'ਵਿਸ਼ੇਸ਼ਣ',
  pronouns: 'ਸਰਵਨਾਮ',
  prepositions: 'ਸਬੰਧ ਬੋਧਕ'
};

const CATEGORY_ORDER = ['nouns', 'verbs', 'adjectives', 'pronouns', 'prepositions'];

const PRONOUNS = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'mine', 'yours', 'ours', 'theirs',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'
]);

const PREPOSITIONS = new Set([
  'in', 'on', 'at', 'by', 'to', 'from', 'with', 'for', 'of', 'into', 'onto',
  'under', 'over', 'behind', 'between', 'through', 'across', 'near', 'inside',
  'outside', 'before', 'after', 'around', 'during', 'without', 'against', 'toward', 'towards'
]);

const ADJECTIVES = new Set([
  'big', 'small', 'happy', 'sad', 'brave', 'kind', 'careful', 'curious', 'proud', 'neat',
  'clear', 'new', 'old', 'young', 'strong', 'smart', 'quick', 'slow', 'loud', 'quiet',
  'warm', 'cold', 'clean', 'dirty', 'bright', 'dark', 'easy', 'hard', 'ready', 'complete'
]);

const VERBS = new Set([
  'am', 'is', 'are', 'was', 'were', 'be', 'being', 'been',
  'do', 'does', 'did', 'have', 'has', 'had', 'can', 'will',
  'go', 'goes', 'went', 'come', 'comes', 'came',
  'play', 'plays', 'played', 'read', 'reads', 'write', 'writes', 'wrote',
  'walk', 'walks', 'walked', 'run', 'runs', 'ran',
  'say', 'says', 'said', 'ask', 'asks', 'asked',
  'help', 'helps', 'helped', 'learn', 'learns', 'learned',
  'study', 'studies', 'practice', 'practices', 'practiced',
  'open', 'opens', 'opened', 'close', 'closes', 'closed',
  'see', 'sees', 'saw', 'look', 'looks', 'looked',
  'listen', 'listens', 'listened', 'feel', 'feels', 'felt',
  'make', 'makes', 'made', 'take', 'takes', 'took',
  'eat', 'eats', 'ate', 'drink', 'drinks', 'drank',
  'sit', 'sits', 'sat', 'stand', 'stands', 'stood'
]);

function parseBooks(arg) {
  if (!arg) {
    throw new Error('Usage: node tools/fill_template_pos.cjs "5,6,7"');
  }
  const books = arg
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 10);

  if (!books.length) {
    throw new Error('No valid books provided. Expected comma-separated values in range 1..10.');
  }

  return Array.from(new Set(books));
}

function normalizeToken(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z']/g, '');
}

function capitalize(word) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function toEntry(value, category) {
  if (!value) return null;
  if (typeof value === 'string') {
    const en = value.trim();
    if (!en) return null;
    return { en, pa: PA_FALLBACK[category] };
  }
  if (typeof value === 'object') {
    const en = (value.en || value.word || '').toString().trim();
    if (!en) return null;
    const pa = (value.pa || value.meaningPa || '').toString().trim() || PA_FALLBACK[category];
    return { en, pa };
  }
  return null;
}

function addUniqueEntries(targetArray, sourceEntries, category) {
  const seen = new Set(targetArray.map((entry) => normalizeToken(entry.en)));
  for (const item of sourceEntries) {
    const entry = toEntry(item, category);
    if (!entry) continue;
    const key = normalizeToken(entry.en);
    if (!key || seen.has(key)) continue;
    targetArray.push(entry);
    seen.add(key);
  }
}

function tokenizeText(story) {
  const text = [story.englishStory || '', ...(story.vocabularyWords || []).map((v) => v.word || '')].join(' ');
  return text
    .split(/\s+/)
    .map((token) => normalizeToken(token))
    .filter(Boolean);
}

function deriveCategoryCandidates(story) {
  const tokens = tokenizeText(story);
  const nouns = [];
  const verbs = [];
  const adjectives = [];
  const pronouns = [];
  const prepositions = [];

  for (const token of tokens) {
    if (PRONOUNS.has(token)) {
      pronouns.push({ en: token === 'i' ? 'I' : token, pa: PA_FALLBACK.pronouns });
      continue;
    }
    if (PREPOSITIONS.has(token)) {
      prepositions.push({ en: token, pa: PA_FALLBACK.prepositions });
      continue;
    }
    if (ADJECTIVES.has(token)) {
      adjectives.push({ en: token, pa: PA_FALLBACK.adjectives });
      continue;
    }
    if (VERBS.has(token) || /(?:ing|ed)$/.test(token)) {
      verbs.push({ en: token, pa: PA_FALLBACK.verbs });
      continue;
    }
    if (token.length > 2) {
      nouns.push({ en: token, pa: PA_FALLBACK.nouns });
    }
  }

  for (const vocab of story.vocabularyWords || []) {
    const word = (vocab.word || '').trim();
    const meaningEn = (vocab.meaningEn || '').toLowerCase();
    const meaningPa = (vocab.meaningPa || '').trim();
    if (!word) continue;
    const payload = { en: word, pa: meaningPa || PA_FALLBACK.nouns };

    if (meaningEn.includes('pronoun')) {
      pronouns.push({ en: word, pa: meaningPa || PA_FALLBACK.pronouns });
    } else if (meaningEn.includes('preposition')) {
      prepositions.push({ en: word, pa: meaningPa || PA_FALLBACK.prepositions });
    } else if (meaningEn.includes('adjective')) {
      adjectives.push({ en: word, pa: meaningPa || PA_FALLBACK.adjectives });
    } else if (meaningEn.includes('verb')) {
      verbs.push({ en: word, pa: meaningPa || PA_FALLBACK.verbs });
    } else if (meaningEn.includes('noun')) {
      nouns.push({ en: word, pa: meaningPa || PA_FALLBACK.nouns });
    } else {
      nouns.push(payload);
    }
  }

  return { nouns, verbs, adjectives, pronouns, prepositions };
}

function fallbackEntry(category) {
  const fallbackByCategory = {
    nouns: { en: 'word', pa: PA_FALLBACK.nouns },
    verbs: { en: 'do', pa: PA_FALLBACK.verbs },
    adjectives: { en: 'good', pa: PA_FALLBACK.adjectives },
    pronouns: { en: 'I', pa: PA_FALLBACK.pronouns },
    prepositions: { en: 'in', pa: PA_FALLBACK.prepositions }
  };
  return fallbackByCategory[category];
}

function ensureStoryPOS(story) {
  let changed = false;
  if (!story.partsOfGrammar || typeof story.partsOfGrammar !== 'object') {
    story.partsOfGrammar = {};
    changed = true;
  }

  const existingDefinitions = story.partsOfGrammar.definitions;
  if (!existingDefinitions || typeof existingDefinitions !== 'object') {
    story.partsOfGrammar.definitions = JSON.parse(JSON.stringify(SHARED_DEFINITIONS));
    changed = true;
  } else {
    for (const category of CATEGORY_ORDER) {
      if (!existingDefinitions[category] || typeof existingDefinitions[category] !== 'object') {
        existingDefinitions[category] = { ...SHARED_DEFINITIONS[category] };
        changed = true;
      } else {
        if (!existingDefinitions[category].definitionEn) {
          existingDefinitions[category].definitionEn = SHARED_DEFINITIONS[category].definitionEn;
          changed = true;
        }
        if (!existingDefinitions[category].definitionPa) {
          existingDefinitions[category].definitionPa = SHARED_DEFINITIONS[category].definitionPa;
          changed = true;
        }
      }
    }
  }

  const candidates = deriveCategoryCandidates(story);
  for (const category of CATEGORY_ORDER) {
    const existingRaw = Array.isArray(story.partsOfGrammar[category]) ? story.partsOfGrammar[category] : [];
    const normalizedExisting = existingRaw
      .map((item) => toEntry(item, category))
      .filter(Boolean);

    if (!Array.isArray(story.partsOfGrammar[category])) {
      story.partsOfGrammar[category] = normalizedExisting;
      changed = true;
    } else if (normalizedExisting.length !== existingRaw.length) {
      story.partsOfGrammar[category] = normalizedExisting;
      changed = true;
    }

    const beforeLength = story.partsOfGrammar[category].length;
    addUniqueEntries(story.partsOfGrammar[category], candidates[category], category);
    if (story.partsOfGrammar[category].length !== beforeLength) {
      changed = true;
    }

    if (!story.partsOfGrammar[category].length) {
      story.partsOfGrammar[category].push(fallbackEntry(category));
      changed = true;
    }

    story.partsOfGrammar[category] = story.partsOfGrammar[category].map((entry) => ({
      en: category === 'pronouns' && normalizeToken(entry.en) === 'i' ? 'I' : capitalize(entry.en),
      pa: entry.pa || PA_FALLBACK[category]
    }));
  }

  return changed;
}

function processBook(bookNumber, rootDir) {
  const filePath = path.join(rootDir, 'app', 'data', 'templates', `book${bookNumber}_first10_stories.template.json`);
  if (!fs.existsSync(filePath)) {
    return { book: bookNumber, filePath, exists: false, changed: false, stories: 0, storiesChanged: 0 };
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const stories = JSON.parse(raw);
  if (!Array.isArray(stories)) {
    throw new Error(`Template is not an array: ${filePath}`);
  }

  let storiesChanged = 0;
  for (const story of stories) {
    if (ensureStoryPOS(story)) {
      storiesChanged += 1;
    }
  }

  const changed = storiesChanged > 0;
  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(stories, null, 2)}\n`, 'utf8');
  }

  return { book: bookNumber, filePath, exists: true, changed, stories: stories.length, storiesChanged };
}

function main() {
  const books = parseBooks(process.argv[2]);
  const rootDir = path.resolve(__dirname, '..');
  const results = books.map((book) => processBook(book, rootDir));
  console.log(JSON.stringify({ books, results }, null, 2));
}

main();
