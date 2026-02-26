#!/usr/bin/env node
/**
 * fix_generic_wrong_explanations.cjs
 * 
 * Replaces ~153 generic wrongOptionExplanation templates in app/data/lessons.js
 * with topic-specific, educationally useful feedback.
 *
 * Generic pattern (EN):
 *   "<wrong>" is not correct in this context. "<correct>" is correct because
 *   it best fits what the question asks.
 *
 * Generic pattern (PA):
 *   "<wrong>" ਇਸ ਸੰਦਰਭ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੈ। "<correct>" ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ
 *   ਸਵਾਲ ਦੀ ਲੋੜ ਨਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਮਿਲਦਾ ਹੈ।
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'app', 'data', 'lessons.js');

// ── helpers ──────────────────────────────────────────────────

/** POS knowledge map — what POS does a word likely belong to? */
const KNOWN_POS = {
  // verbs / verb forms
  run: 'verb', runs: 'verb', running: 'verb', ran: 'verb',
  eat: 'verb', eats: 'verb', eating: 'verb', ate: 'verb',
  go: 'verb', goes: 'verb', going: 'verb', went: 'verb',
  play: 'verb', plays: 'verb', played: 'verb', playing: 'verb',
  jump: 'verb', jumps: 'verb', jumped: 'verb', jumping: 'verb',
  read: 'verb', reads: 'verb', reading: 'verb',
  write: 'verb', writes: 'verb', writing: 'verb', wrote: 'verb',
  sing: 'verb', sings: 'verb', singing: 'verb', sang: 'verb',
  swim: 'verb', swims: 'verb', swimming: 'verb', swam: 'verb',
  walk: 'verb', walks: 'verb', walked: 'verb', walking: 'verb',
  sleep: 'verb', sleeps: 'verb', sleeping: 'verb', slept: 'verb',
  dance: 'verb', dances: 'verb', danced: 'verb', dancing: 'verb',
  talk: 'verb', talks: 'verb', talked: 'verb', talking: 'verb',
  listen: 'verb', listens: 'verb', listened: 'verb', listening: 'verb',
  cook: 'verb', cooks: 'verb', cooked: 'verb', cooking: 'verb',
  draw: 'verb', draws: 'verb', drew: 'verb', drawing: 'verb',
  teach: 'verb', teaches: 'verb', taught: 'verb', teaching: 'verb',
  help: 'verb', helps: 'verb', helped: 'verb', helping: 'verb',
  study: 'verb', studies: 'verb', studied: 'verb', studying: 'verb',
  drink: 'verb', drinks: 'verb', drank: 'verb', drinking: 'verb',
  sit: 'verb', sits: 'verb', sat: 'verb', sitting: 'verb',
  open: 'verb', opens: 'verb', opened: 'verb', opening: 'verb',
  close: 'verb', closes: 'verb', closed: 'verb', closing: 'verb',
  drive: 'verb', drives: 'verb', drove: 'verb', driving: 'verb',
  fly: 'verb', flies: 'verb', flew: 'verb', flying: 'verb',
  climb: 'verb', climbs: 'verb', climbed: 'verb', climbing: 'verb',
  throw: 'verb', throws: 'verb', threw: 'verb', throwing: 'verb',
  catch: 'verb', catches: 'verb', caught: 'verb', catching: 'verb',
  paint: 'verb', paints: 'verb', painted: 'verb', painting: 'verb',
  clean: 'verb', cleans: 'verb', cleaned: 'verb', cleaning: 'verb',
  wash: 'verb', washes: 'verb', washed: 'verb', washing: 'verb',
  laugh: 'verb', laughs: 'verb', laughed: 'verb', laughing: 'verb',
  cry: 'verb', cries: 'verb', cried: 'verb', crying: 'verb',
  smile: 'verb', smiles: 'verb', smiled: 'verb', smiling: 'verb',
  grow: 'verb', grows: 'verb', grew: 'verb', growing: 'verb',
  build: 'verb', builds: 'verb', built: 'verb', building: 'verb',
  carry: 'verb', carries: 'verb', carried: 'verb', carrying: 'verb',
  push: 'verb', pushes: 'verb', pushed: 'verb', pushing: 'verb',
  pull: 'verb', pulls: 'verb', pulled: 'verb', pulling: 'verb',
  fall: 'verb', falls: 'verb', fell: 'verb', falling: 'verb',
  rise: 'verb', rises: 'verb', rose: 'verb', rising: 'verb',
  fix: 'verb', fixes: 'verb', fixed: 'verb', fixing: 'verb',
  buy: 'verb', buys: 'verb', bought: 'verb', buying: 'verb',
  sell: 'verb', sells: 'verb', sold: 'verb', selling: 'verb',
  is: 'verb', am: 'verb', are: 'verb', was: 'verb', were: 'verb',
  has: 'verb', have: 'verb', had: 'verb',
  do: 'verb', does: 'verb', did: 'verb',
  give: 'verb', gave: 'verb', gives: 'verb',
  take: 'verb', took: 'verb', takes: 'verb',
  make: 'verb', made: 'verb', makes: 'verb',
  see: 'verb', saw: 'verb', sees: 'verb',
  know: 'verb', knew: 'verb', knows: 'verb',
  think: 'verb', thought: 'verb', thinks: 'verb',
  come: 'verb', came: 'verb', comes: 'verb',
  want: 'verb', wanted: 'verb', wants: 'verb',
  say: 'verb', said: 'verb', says: 'verb',
  tell: 'verb', told: 'verb', tells: 'verb',

  // nouns
  cat: 'noun', dog: 'noun', bird: 'noun', fish: 'noun', horse: 'noun',
  apple: 'noun', mango: 'noun', banana: 'noun', orange: 'noun',
  book: 'noun', table: 'noun', chair: 'noun', pen: 'noun', ball: 'noun',
  tree: 'noun', flower: 'noun', river: 'noun', mountain: 'noun',
  house: 'noun', school: 'noun', park: 'noun', garden: 'noun',
  teacher: 'noun', student: 'noun', boy: 'noun', girl: 'noun',
  mother: 'noun', father: 'noun', brother: 'noun', sister: 'noun',
  city: 'noun', village: 'noun', road: 'noun', door: 'noun',
  sun: 'noun', moon: 'noun', star: 'noun', sky: 'noun', rain: 'noun',
  car: 'noun', bus: 'noun', train: 'noun', bike: 'noun',
  food: 'noun', water: 'noun', milk: 'noun', bread: 'noun',
  hand: 'noun', eye: 'noun', nose: 'noun', ear: 'noun',
  clock: 'noun', toy: 'noun', box: 'noun', bag: 'noun',
  animal: 'noun', baby: 'noun', child: 'noun', children: 'noun',
  friend: 'noun', man: 'noun', woman: 'noun', people: 'noun',
  name: 'noun', family: 'noun', place: 'noun', thing: 'noun',
  story: 'noun', song: 'noun', picture: 'noun', game: 'noun',
  class: 'noun', team: 'noun', group: 'noun', country: 'noun',
  room: 'noun', bed: 'noun', wall: 'noun', window: 'noun',
  mat: 'noun', nest: 'noun', cage: 'noun', kite: 'noun',

  // proper nouns — still nouns
  'Aman': 'proper noun', 'Gurpreet': 'proper noun', 'Simran': 'proper noun',
  'Ravi': 'proper noun', 'Punjab': 'proper noun', 'Lahore': 'proper noun',
  'London': 'proper noun', 'India': 'proper noun', 'Monday': 'proper noun',
  'January': 'proper noun', 'Diwali': 'proper noun',

  // adjectives
  big: 'adjective', small: 'adjective', tall: 'adjective', short: 'adjective',
  long: 'adjective', fast: 'adjective', slow: 'adjective',
  happy: 'adjective', sad: 'adjective', angry: 'adjective',
  red: 'adjective', blue: 'adjective', green: 'adjective', yellow: 'adjective',
  hot: 'adjective', cold: 'adjective', warm: 'adjective',
  old: 'adjective', young: 'adjective', new: 'adjective',
  good: 'adjective', bad: 'adjective', nice: 'adjective', kind: 'adjective',
  beautiful: 'adjective', ugly: 'adjective', pretty: 'adjective',
  strong: 'adjective', weak: 'adjective', hard: 'adjective', soft: 'adjective',
  loud: 'adjective', quiet: 'adjective', bright: 'adjective', dark: 'adjective',
  clean: 'adjective', dirty: 'adjective', wet: 'adjective', dry: 'adjective',
  thick: 'adjective', thin: 'adjective', heavy: 'adjective', light: 'adjective',
  rich: 'adjective', poor: 'adjective', cheap: 'adjective', dear: 'adjective',
  brave: 'adjective', lazy: 'adjective', clever: 'adjective', wise: 'adjective',
  funny: 'adjective', silly: 'adjective', scary: 'adjective',
  sweet: 'adjective', sour: 'adjective', salty: 'adjective', bitter: 'adjective',
  round: 'adjective', flat: 'adjective', sharp: 'adjective', smooth: 'adjective',
  bigger: 'adjective', smaller: 'adjective', taller: 'adjective', faster: 'adjective',
  biggest: 'adjective', smallest: 'adjective', tallest: 'adjective', fastest: 'adjective',
  better: 'adjective', worse: 'adjective', best: 'adjective', worst: 'adjective',
  redder: 'adjective',
  'more beautiful': 'adjective', 'most beautiful': 'adjective',
  'more interesting': 'adjective', 'most interesting': 'adjective',

  // adverbs
  quickly: 'adverb', slowly: 'adverb', softly: 'adverb', loudly: 'adverb',
  happily: 'adverb', sadly: 'adverb', carefully: 'adverb', gently: 'adverb',
  brightly: 'adverb', neatly: 'adverb', quietly: 'adverb',
  always: 'adverb', never: 'adverb', sometimes: 'adverb', often: 'adverb',
  usually: 'adverb', already: 'adverb', ever: 'adverb',
  very: 'adverb', really: 'adverb', quite: 'adverb', just: 'adverb',
  today: 'adverb', yesterday: 'adverb', tomorrow: 'adverb',
  here: 'adverb', there: 'adverb', everywhere: 'adverb',
  soon: 'adverb', now: 'adverb', then: 'adverb',
  well: 'adverb', badly: 'adverb',

  // pronouns
  I: 'pronoun', you: 'pronoun', he: 'pronoun', she: 'pronoun', it: 'pronoun',
  we: 'pronoun', they: 'pronoun', me: 'pronoun', him: 'pronoun', her: 'pronoun',
  us: 'pronoun', them: 'pronoun',
  He: 'pronoun', She: 'pronoun', They: 'pronoun', We: 'pronoun', It: 'pronoun',
  my: 'possessive', your: 'possessive', his: 'possessive', its: 'possessive',
  our: 'possessive', their: 'possessive',
  mine: 'possessive pronoun', yours: 'possessive pronoun', hers: 'possessive pronoun',
  ours: 'possessive pronoun', theirs: 'possessive pronoun',
  this: 'demonstrative', that: 'demonstrative', these: 'demonstrative', those: 'demonstrative',
  myself: 'reflexive pronoun', himself: 'reflexive pronoun', herself: 'reflexive pronoun',

  // prepositions
  in: 'preposition', on: 'preposition', at: 'preposition', under: 'preposition',
  above: 'preposition', below: 'preposition', behind: 'preposition', beside: 'preposition',
  between: 'preposition', near: 'preposition', from: 'preposition', to: 'preposition',
  into: 'preposition', onto: 'preposition', through: 'preposition', across: 'preposition',
  along: 'preposition', around: 'preposition', over: 'preposition', up: 'preposition',
  down: 'preposition', off: 'preposition', with: 'preposition', without: 'preposition',
  during: 'preposition', before: 'preposition', after: 'preposition', until: 'preposition',
  since: 'preposition', by: 'preposition', for: 'preposition', about: 'preposition',

  // conjunctions
  and: 'conjunction', but: 'conjunction', or: 'conjunction', so: 'conjunction',
  because: 'conjunction', although: 'conjunction', while: 'conjunction',
  if: 'conjunction', when: 'conjunction', unless: 'conjunction',
  yet: 'conjunction', nor: 'conjunction', either: 'conjunction', neither: 'conjunction',

  // articles
  a: 'article', an: 'article', the: 'article',

  // interjections
  wow: 'interjection', oh: 'interjection', oops: 'interjection', yay: 'interjection',
  hurray: 'interjection', ouch: 'interjection', hello: 'interjection', hey: 'interjection',
  bravo: 'interjection', alas: 'interjection', hooray: 'interjection',
  'Wow!': 'interjection', 'Oh!': 'interjection', 'Oops!': 'interjection',
  'Hurray!': 'interjection', 'Ouch!': 'interjection', 'Yeah!': 'interjection',
  'Yay!': 'interjection', 'Bravo!': 'interjection',

  // modals
  can: 'modal verb', could: 'modal verb', may: 'modal verb', might: 'modal verb',
  shall: 'modal verb', should: 'modal verb', will: 'modal verb', would: 'modal verb',
  must: 'modal verb',

  // Yes/No
  Yes: 'affirmation', No: 'negation',
};

const POS_PA = {
  'verb': 'ਕਿਰਿਆ',
  'noun': 'ਨਾਂ',
  'proper noun': 'ਖ਼ਾਸ ਨਾਂ',
  'adjective': 'ਵਿਸ਼ੇਸ਼ਣ',
  'adverb': 'ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ',
  'pronoun': 'ਪੜਨਾਂਵ',
  'possessive': 'ਮਾਲਕਾਨਾ',
  'possessive pronoun': 'ਮਾਲਕਾਨਾ ਪੜਨਾਂਵ',
  'demonstrative': 'ਨਿਸ਼ਚੇਵਾਚਕ',
  'reflexive pronoun': 'ਨਿੱਜਵਾਚਕ ਪੜਨਾਂਵ',
  'preposition': 'ਪੂਰਵ-ਬੋਧਕ',
  'conjunction': 'ਸੰਯੋਜਕ',
  'article': 'ਲੇਖ',
  'interjection': 'ਵਿਸਮਿਆਦਿ ਬੋਧਕ',
  'modal verb': 'ਸਹਾਇਕ ਕਿਰਿਆ',
  'affirmation': 'ਹਾਂ',
  'negation': 'ਨਾਂ',
};

/** Infer the lesson topic from its ID */
function lessonTopic(lessonId) {
  if (!lessonId) return null;
  const id = lessonId.toUpperCase();
  if (id.includes('NOUN') && id.includes('COMMON')) return 'common nouns';
  if (id.includes('NOUN') && id.includes('PROPER')) return 'proper nouns';
  if (id.includes('NOUN') && id.includes('POSSESSIVE')) return 'possessive nouns';
  if (id.includes('NOUN') && id.includes('PLURAL')) return 'plural nouns';
  if (id.includes('NOUN')) return 'nouns';
  if (id.includes('PRONOUN') && id.includes('POSSESSIVE')) return 'possessive pronouns';
  if (id.includes('PRONOUN') && id.includes('PERSONAL')) return 'personal pronouns';
  if (id.includes('PRONOUN')) return 'pronouns';
  if (id.includes('SINGULAR_PLURAL')) return 'singular and plural';
  if (id.includes('VERB') && id.includes('MODAL')) return 'modal verbs';
  if (id.includes('VERB')) return 'verbs';
  if (id.includes('ADVERB')) return 'adverbs';
  if (id.includes('ADJ') && id.includes('COMPARATIVE')) return 'comparative adjectives';
  if (id.includes('ADJ') && id.includes('SUPERLATIVE')) return 'superlative adjectives';
  if (id.includes('ADJ') && id.includes('ADV')) return 'adjectives vs adverbs';
  if (id.includes('ADJ')) return 'adjectives';
  if (id.includes('PREP') && id.includes('TIME')) return 'time prepositions';
  if (id.includes('PREP') && id.includes('PLACE')) return 'place prepositions';
  if (id.includes('PREP')) return 'prepositions';
  if (id.includes('CONJ')) return 'conjunctions';
  if (id.includes('ARTICLE')) return 'articles';
  if (id.includes('INTERJ')) return 'interjections';
  if (id.includes('PRESENT') && id.includes('PROG')) return 'present progressive tense';
  if (id.includes('PAST') && id.includes('PROG')) return 'past progressive tense';
  if (id.includes('PRESENT')) return 'simple present tense';
  if (id.includes('PAST')) return 'simple past tense';
  if (id.includes('FUTURE')) return 'simple future tense';
  if (id.includes('SV_AGREEMENT')) return 'subject-verb agreement';
  return null;
}

const TOPIC_PA = {
  'nouns': 'ਨਾਂ',
  'common nouns': 'ਆਮ ਨਾਂ',
  'proper nouns': 'ਖ਼ਾਸ ਨਾਂ',
  'possessive nouns': 'ਮਾਲਕਾਨਾ ਨਾਂ',
  'plural nouns': 'ਬਹੁਵਚਨ ਨਾਂ',
  'pronouns': 'ਪੜਨਾਂਵ',
  'personal pronouns': 'ਵਿਅਕਤੀਵਾਚਕ ਪੜਨਾਂਵ',
  'possessive pronouns': 'ਮਾਲਕਾਨਾ ਪੜਨਾਂਵ',
  'singular and plural': 'ਇਕਵਚਨ ਅਤੇ ਬਹੁਵਚਨ',
  'verbs': 'ਕਿਰਿਆਵਾਂ',
  'modal verbs': 'ਸਹਾਇਕ ਕਿਰਿਆਵਾਂ',
  'adverbs': 'ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ',
  'adjectives': 'ਵਿਸ਼ੇਸ਼ਣ',
  'comparative adjectives': 'ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ',
  'superlative adjectives': 'ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ',
  'adjectives vs adverbs': 'ਵਿਸ਼ੇਸ਼ਣ ਬਨਾਮ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ',
  'prepositions': 'ਪੂਰਵ-ਬੋਧਕ',
  'time prepositions': 'ਸਮੇਂ ਦੇ ਪੂਰਵ-ਬੋਧਕ',
  'place prepositions': 'ਥਾਂ ਦੇ ਪੂਰਵ-ਬੋਧਕ',
  'conjunctions': 'ਸੰਯੋਜਕ',
  'articles': 'ਲੇਖ',
  'interjections': 'ਵਿਸਮਿਆਦਿ ਬੋਧਕ',
  'simple present tense': 'ਸਧਾਰਣ ਵਰਤਮਾਨ ਕਾਲ',
  'present progressive tense': 'ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ',
  'simple past tense': 'ਸਧਾਰਣ ਭੂਤਕਾਲ',
  'past progressive tense': 'ਭੂਤਕਾਲ ਜਾਰੀ',
  'simple future tense': 'ਸਧਾਰਣ ਭਵਿੱਖ ਕਾਲ',
  'subject-verb agreement': 'ਕਰਤਾ-ਕਿਰਿਆ ਸਹਿਮਤੀ',
};

function lookupPos(word) {
  if (!word) return null;
  // Try exact
  if (KNOWN_POS[word]) return KNOWN_POS[word];
  // Try lowercase
  if (KNOWN_POS[word.toLowerCase()]) return KNOWN_POS[word.toLowerCase()];
  // Try without trailing punctuation
  const stripped = word.replace(/[!?.,;]+$/, '');
  if (KNOWN_POS[stripped]) return KNOWN_POS[stripped];
  if (KNOWN_POS[stripped.toLowerCase()]) return KNOWN_POS[stripped.toLowerCase()];
  return null;
}

/**
 * Build a topic-specific explanation for why wrongWord is wrong
 * and correctWord is correct.
 */
function buildExplanation(wrongWord, correctWord, topic, questionText) {
  const wrongPos = lookupPos(wrongWord);
  const correctPos = lookupPos(correctWord);
  const topicPa = TOPIC_PA[topic] || topic;

  // — Yes/No questions —
  if (wrongWord === 'Yes' || wrongWord === 'No') {
    const isYesCorrect = correctWord === 'Yes';
    if (isYesCorrect) {
      return {
        en: `The answer is "Yes" because the word in the question is indeed a ${topic ? topic.replace(/s$/, '') : 'correct match'}.`,
        pa: `ਜਵਾਬ "ਹਾਂ" ਹੈ ਕਿਉਂਕਿ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ਸ਼ਬਦ ਸੱਚਮੁੱਚ ${topicPa} ਹੈ।`
      };
    } else {
      return {
        en: `The answer is "No" because the word in the question does not belong to this category.`,
        pa: `ਜਵਾਬ "ਨਹੀਂ" ਹੈ ਕਿਉਂਕਿ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤਾ ਸ਼ਬਦ ਇਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`
      };
    }
  }

  // — Matching / multi-word answers (commas in options) —
  if (wrongWord.includes(',') || correctWord.includes(',')) {
    return {
      en: `"${wrongWord}" is not the right match. Look at each word carefully — "${correctWord}" matches because each word fits the ${topic || 'pattern'} correctly.`,
      pa: `"${wrongWord}" ਸਹੀ ਮੇਲ ਨਹੀਂ ਹੈ। ਹਰ ਸ਼ਬਦ ਧਿਆਨ ਨਾਲ ਵੇਖੋ — "${correctWord}" ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਹਰ ਸ਼ਬਦ ${topicPa} ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`
    };
  }

  // — We know the POS of the wrong word —
  if (wrongPos && correctPos && wrongPos !== correctPos) {
    const wrongPosEn = wrongPos;
    const wrongPosPa = POS_PA[wrongPos] || wrongPos;
    const correctPosEn = correctPos;
    const correctPosPa = POS_PA[correctPos] || correctPos;
    return {
      en: `"${wrongWord}" is ${wrongPos.startsWith('a') || wrongPos.startsWith('i') ? 'an' : 'a'} ${wrongPosEn}, not ${correctPos.startsWith('a') || correctPos.startsWith('i') ? 'an' : 'a'} ${correctPosEn}. "${correctWord}" is the correct ${correctPosEn}.`,
      pa: `"${wrongWord}" ${wrongPosPa} ਹੈ, ${correctPosPa} ਨਹੀਂ। "${correctWord}" ਸਹੀ ${correctPosPa} ਹੈ।`
    };
  }

  // — We know the POS of the wrong word but not the correct one —
  if (wrongPos) {
    const wrongPosEn = wrongPos;
    const wrongPosPa = POS_PA[wrongPos] || wrongPos;
    return {
      en: `"${wrongWord}" is ${wrongPos.startsWith('a') || wrongPos.startsWith('i') ? 'an' : 'a'} ${wrongPosEn}. This lesson is about ${topic || 'a different concept'}. The correct answer is "${correctWord}".`,
      pa: `"${wrongWord}" ${wrongPosPa} ਹੈ। ਇਹ ਪਾਠ ${topicPa} ਬਾਰੇ ਹੈ। ਸਹੀ ਜਵਾਬ "${correctWord}" ਹੈ।`
    };
  }

  // — We know the correct POS but not the wrong one —
  if (correctPos) {
    const correctPosEn = correctPos;
    const correctPosPa = POS_PA[correctPos] || correctPos;
    return {
      en: `"${wrongWord}" does not fit here. "${correctWord}" is the correct ${correctPosEn} for this ${topic || 'question'}.`,
      pa: `"${wrongWord}" ਇੱਥੇ ਸਹੀ ਨਹੀਂ। "${correctWord}" ਇਸ ${topicPa} ਸਵਾਲ ਲਈ ਸਹੀ ${correctPosPa} ਹੈ।`
    };
  }

  // — Tense-specific fallback —
  if (topic && topic.includes('tense')) {
    return {
      en: `"${wrongWord}" does not show the ${topic}. "${correctWord}" is the correct form for the ${topic}.`,
      pa: `"${wrongWord}" ${topicPa} ਨਹੀਂ ਦਰਸਾਉਂਦਾ। "${correctWord}" ${topicPa} ਦਾ ਸਹੀ ਰੂਪ ਹੈ।`
    };
  }

  // — Subject-verb agreement —
  if (topic === 'subject-verb agreement') {
    return {
      en: `"${wrongWord}" does not agree with the subject. "${correctWord}" matches the subject correctly.`,
      pa: `"${wrongWord}" ਕਰਤਾ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। "${correctWord}" ਕਰਤਾ ਨਾਲ ਸਹੀ ਮੇਲ ਖਾਂਦਾ ਹੈ।`
    };
  }

  // — Generic but still better than "best fits" —
  if (topic) {
    return {
      en: `"${wrongWord}" does not fit this ${topic} question. "${correctWord}" is the correct answer for this ${topic} lesson.`,
      pa: `"${wrongWord}" ਇਸ ${topicPa} ਸਵਾਲ ਵਿੱਚ ਸਹੀ ਨਹੀਂ। "${correctWord}" ਇਸ ${topicPa} ਪਾਠ ਲਈ ਸਹੀ ਜਵਾਬ ਹੈ।`
    };
  }

  // — Absolute fallback —
  return {
    en: `"${wrongWord}" is not the right choice here. "${correctWord}" is the correct answer.`,
    pa: `"${wrongWord}" ਇੱਥੇ ਸਹੀ ਨਹੀਂ। "${correctWord}" ਸਹੀ ਜਵਾਬ ਹੈ।`
  };
}

// ── Main ──────────────────────────────────────────────────────

const src = fs.readFileSync(FILE, 'utf8');

// We match the generic EN pattern and its corresponding PA pattern together.
// The structure in JSON is:
//   "en": "\"<wrong>\" is not correct in this context. \"<correct>\" is correct because it best fits what the question asks.",
//   "pa": "\"<wrong>\" ਇਸ ਸੰਦਰਭ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੈ। \"<correct>\" ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਸਵਾਲ ਦੀ ਲੋੜ ਨਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਮਿਲਦਾ ਹੈ।"

// Strategy: parse the whole file as text, find each generic en+pa pair,
// trace back up to figure out the lesson context, and replace.

// We'll work line by line to find context
const lines = src.split('\n');

// First pass: build a map of (line index → current lesson ID)
const lessonIdByLine = [];
let currentLessonId = null;
for (let i = 0; i < lines.length; i++) {
  // Lesson keys look like: L_NOUNS_BASICS_01: {
  const keyMatch = lines[i].match(/^\s*(?:"(L_[A-Z0-9_]+)"|(L_[A-Z0-9_]+))\s*:\s*\{/);
  if (keyMatch) {
    currentLessonId = keyMatch[1] || keyMatch[2];
  }
  lessonIdByLine[i] = currentLessonId;
}

// Second pass: find each generic EN line and get context
const genericEnRe = /^(\s*"en":\s*)"\\?"([^"]*?)\\?"\s+is not correct in this context\.\s+\\?"([^"]*?)\\?"\s+is correct because it best fits what the question asks\."(,?\s*)$/;
const genericPaRe = /ਇਸ ਸੰਦਰਭ ਵਿੱਚ ਸਹੀ ਨਹੀਂ ਹੈ।.*ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਸਵਾਲ ਦੀ ਲੋੜ ਨਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਮਿਲਦਾ ਹੈ।/;

let replacementCount = 0;

for (let i = 0; i < lines.length; i++) {
  const enMatch = lines[i].match(genericEnRe);
  if (!enMatch) continue;

  const wrongWord = enMatch[2];
  const correctWord = enMatch[3];
  const lid = lessonIdByLine[i];
  const topic = lessonTopic(lid);

  const betterExpl = buildExplanation(wrongWord, correctWord, topic, '');

  // Replace EN line
  const escapedWrong = wrongWord.replace(/"/g, '\\"');
  const escapedCorrect = correctWord.replace(/"/g, '\\"');
  const escapedEn = betterExpl.en.replace(/"/g, '\\"');
  const indent = enMatch[1]; // preserves whitespace + "en": 
  const trailing = enMatch[4]; // preserves comma
  lines[i] = `${indent}"${escapedEn}"${trailing}`;

  // Replace PA line (next line or line after)
  for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
    if (genericPaRe.test(lines[j])) {
      const escapedPa = betterExpl.pa.replace(/"/g, '\\"');
      // Preserve the PA line's structure
      const paLineMatch = lines[j].match(/^(\s*"pa":\s*)".*"(,?\s*)$/);
      if (paLineMatch) {
        lines[j] = `${paLineMatch[1]}"${escapedPa}"${paLineMatch[2]}`;
      }
      break;
    }
  }

  replacementCount++;
}

const out = lines.join('\n');
fs.writeFileSync(FILE, out, 'utf8');

console.log(`✅ Replaced ${replacementCount} generic wrong-option explanations with topic-specific feedback.`);

// Verify no generics remain
const remaining = (out.match(/is not correct in this context/g) || []).length;
console.log(`   Remaining generic patterns: ${remaining}`);
