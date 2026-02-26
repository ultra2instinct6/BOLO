#!/usr/bin/env node
/**
 * Differentiates gian_check explanation text from hint text.
 * Currently all 29 gian_check entries have identical hint and explanation.
 * This script updates explanations to be more detailed post-answer elaborations.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'app', 'data', 'lessons.js');
let src = fs.readFileSync(FILE, 'utf8');

const replacements = [
  {
    id: 'gian_l_nouns_basics_01',
    en: "'bird' is a living thing — nouns name people, animals, places, and things. 'sings' is a verb, 'loudly' is an adverb.",
    pa: "'bird' ਜੀਵ ਹੈ — ਨਾਂ ਲੋਕਾਂ, ਜਾਨਵਰਾਂ, ਥਾਵਾਂ ਅਤੇ ਚੀਜ਼ਾਂ ਦਾ ਨਾਂ ਦੱਸਦੇ ਹਨ। 'sings' ਕਿਰਿਆ ਹੈ, 'loudly' ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ।"
  },
  {
    id: 'gian_l_nouns_common_01',
    en: "Common nouns are general names for people, places, or things. 'book', 'river', and 'school' don't name one specific item.",
    pa: "ਸਧਾਰਨ ਨਾਂ ਲੋਕਾਂ, ਥਾਵਾਂ ਜਾਂ ਚੀਜ਼ਾਂ ਦੇ ਆਮ ਨਾਂ ਹਨ। 'book', 'river' ਅਤੇ 'school' ਕਿਸੇ ਖ਼ਾਸ ਚੀਜ਼ ਦਾ ਨਾਂ ਨਹੀਂ ਦੱਸਦੇ।"
  },
  {
    id: 'gian_l_nouns_proper_01',
    en: "Proper nouns name specific people, places, or things and always start with a capital letter. 'Gurpreet' and 'Ludhiana' are both proper nouns.",
    pa: "ਖ਼ਾਸ ਨਾਂ ਵਿਸ਼ੇਸ਼ ਵਿਅਕਤੀਆਂ, ਥਾਵਾਂ ਜਾਂ ਚੀਜ਼ਾਂ ਦਾ ਨਾਂ ਦੱਸਦੇ ਹਨ ਅਤੇ ਹਮੇਸ਼ਾ ਵੱਡੇ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ। 'ਗੁਰਪ੍ਰੀਤ' ਅਤੇ 'ਲੁਧਿਆਣਾ' ਦੋਵੇਂ ਖ਼ਾਸ ਨਾਂ ਹਨ।"
  },
  {
    id: 'gian_l_pronouns_basics_01',
    en: "'It' is the correct pronoun for animals in general. It replaces 'the cat' so we don't repeat the noun.",
    pa: "'It' ਜਾਨਵਰਾਂ ਲਈ ਆਮ ਤੌਰ ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਪੜਨਾਂਵ ਹੈ। ਇਹ 'ਬਿੱਲੀ' ਦੀ ਥਾਂ ਲੈਂਦਾ ਹੈ ਤਾਂ ਜੋ ਨਾਂ ਨੂੰ ਦੁਹਰਾਉਣਾ ਨਾ ਪਵੇ।"
  },
  {
    id: 'gian_l_pronouns_personal_01',
    en: "'me' is the object pronoun — used when someone does something to you. 'I' is used as a subject, and 'my' shows possession.",
    pa: "'me' ਕਰਮ ਪੜਨਾਂਵ ਹੈ — ਜਦੋਂ ਕੋਈ ਤੁਹਾਡੇ ਨਾਲ ਕੁਝ ਕਰੇ। 'I' ਕਰਤਾ ਵਜੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਅਤੇ 'my' ਮਾਲਕੀ ਦਰਸਾਉਂਦਾ ਹੈ।"
  },
  {
    id: 'gian_l_singular_plural_01',
    en: "Words ending in -x, -s, -sh, -ch add -es for plural. So box → boxes, not boxs or boxen.",
    pa: "-x, -s, -sh, -ch ਨਾਲ ਖ਼ਤਮ ਹੋਣ ਵਾਲੇ ਸ਼ਬਦਾਂ ਨੂੰ ਬਹੁਵਚਨ ਲਈ -es ਲੱਗਦਾ ਹੈ। ਇਸ ਲਈ box → boxes, boxs ਜਾਂ boxen ਨਹੀਂ।"
  },
  {
    id: 'gian_l_nouns_plurals_possession_01',
    en: "The apostrophe-s ('s) shows that one student owns the homework. Without the apostrophe, 'students' is just a plural noun.",
    pa: "ਅਪੋਸਟ੍ਰੋਫ਼-s ('s) ਦੱਸਦਾ ਹੈ ਕਿ ਹੋਮਵਰਕ ਇੱਕ ਵਿਦਿਆਰਥੀ ਦਾ ਹੈ। ਅਪੋਸਟ੍ਰੋਫ਼ ਤੋਂ ਬਿਨਾਂ 'students' ਸਿਰਫ਼ ਬਹੁਵਚਨ ਨਾਂ ਹੈ।"
  },
  {
    id: 'gian_l_possessive_nouns_01',
    en: "For plural nouns already ending in -s, just add an apostrophe. baby → babies (plural) → babies' (possessive plural).",
    pa: "ਜੋ ਬਹੁਵਚਨ ਨਾਂ ਪਹਿਲਾਂ ਹੀ -s ਨਾਲ ਖ਼ਤਮ ਹੁੰਦੇ ਹਨ, ਉਨ੍ਹਾਂ ਵਿੱਚ ਸਿਰਫ਼ ਅਪੋਸਟ੍ਰੋਫ਼ ਲਗਾਓ। baby → babies → babies'।"
  },
  {
    id: 'gian_l_possessive_pronouns_01',
    en: "'mine' stands alone as a possessive (That pen is mine). 'my' must come before a noun (my pen). 'me' is an object pronoun, not possessive.",
    pa: "'mine' ਸੁਤੰਤਰ ਮਲਕੀਅਤ ਰੂਪ ਹੈ (ਉਹ ਪੈੱਨ ਮੇਰਾ ਹੈ)। 'my' ਨਾਂ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ (my pen)। 'me' ਕਰਮ ਪੜਨਾਂਵ ਹੈ, ਮਲਕੀਅਤ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_verbs_basics_01',
    en: "'grows' is the action word — verbs show what someone does. 'farmer' is a noun (person) and 'wheat' is a noun (thing).",
    pa: "'grows' ਕਿਰਿਆ ਸ਼ਬਦ ਹੈ — ਕਿਰਿਆ ਦੱਸਦੀ ਹੈ ਕੋਈ ਕੀ ਕਰਦਾ ਹੈ। 'farmer' ਨਾਂ ਹੈ (ਵਿਅਕਤੀ) ਅਤੇ 'wheat' ਨਾਂ ਹੈ (ਚੀਜ਼)।"
  },
  {
    id: 'gian_l_adverb_basics_01',
    en: "'gracefully' ends in -ly and modifies the verb 'danced'. 'graceful' is an adjective, and 'grace' is a noun.",
    pa: "'gracefully' -ly ਨਾਲ ਖ਼ਤਮ ਹੁੰਦਾ ਹੈ ਅਤੇ ਕਿਰਿਆ 'danced' ਬਾਰੇ ਦੱਸਦਾ ਹੈ। 'graceful' ਵਿਸ਼ੇਸ਼ਣ ਹੈ, ਅਤੇ 'grace' ਨਾਂ ਹੈ।"
  },
  {
    id: 'gian_l_simple_present_01',
    en: "Third-person singular subjects (he, she, it) need verb + s/es in simple present. So 'He eats', not 'He eat' or 'He eating'.",
    pa: "ਤੀਜੇ ਪੁਰਖ ਇੱਕ ਵਚਨ (he, she, it) ਨਾਲ ਸਧਾਰਣ ਵਰਤਮਾਨ ਵਿੱਚ ਕਿਰਿਆ + s/es ਚਾਹੀਦਾ ਹੈ। ਇਸ ਲਈ 'He eats', 'He eat' ਜਾਂ 'He eating' ਨਹੀਂ।"
  },
  {
    id: 'gian_l_progressive_present_01',
    en: "Present progressive uses is/am/are + verb-ing for actions happening right now. 'is crawling' matches the signal word 'right now'.",
    pa: "ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ ਵਿੱਚ is/am/are + ਕਿਰਿਆ-ing ਵਰਤੀ ਜਾਂਦੀ ਹੈ। 'is crawling' 'right now' ਸੰਕੇਤ ਸ਼ਬਦ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"
  },
  {
    id: 'gian_l_simple_past_01',
    en: "Simple past uses verb + -ed for regular verbs. 'watched' tells us the action is finished. 'last night' signals past tense.",
    pa: "ਸਧਾਰਣ ਭੂਤਕਾਲ ਵਿੱਚ ਨਿਯਮਿਤ ਕਿਰਿਆ + -ed ਵਰਤੀ ਜਾਂਦੀ ਹੈ। 'watched' ਦੱਸਦਾ ਹੈ ਕੰਮ ਮੁੱਕ ਗਿਆ। 'last night' ਭੂਤਕਾਲ ਦਾ ਸੰਕੇਤ ਹੈ।"
  },
  {
    id: 'gian_l_progressive_past_01',
    en: "Past progressive (was/were + verb-ing) shows an ongoing action interrupted by another event. 'was cooking' was the background action when 'the phone rang'.",
    pa: "ਭੂਤਕਾਲ ਜਾਰੀ (was/were + ਕਿਰਿਆ-ing) ਇੱਕ ਚੱਲ ਰਿਹਾ ਕੰਮ ਦਰਸਾਉਂਦਾ ਹੈ ਜੋ ਕਿਸੇ ਹੋਰ ਘਟਨਾ ਨਾਲ ਟੁੱਟਿਆ। 'was cooking' ਪਿਛੋਕੜ ਕੰਮ ਸੀ ਜਦੋਂ 'ਫ਼ੋਨ ਵੱਜਿਆ'।"
  },
  {
    id: 'gian_l_simple_future_01',
    en: "Simple future is will + base verb. 'will play' shows a plan for tomorrow. 'played' is past, and 'plays' is present.",
    pa: "ਸਧਾਰਣ ਭਵਿੱਖ ਕਾਲ will + ਮੂਲ ਕਿਰਿਆ ਹੈ। 'will play' ਕੱਲ੍ਹ ਦੀ ਯੋਜਨਾ ਦਰਸਾਉਂਦਾ ਹੈ। 'played' ਭੂਤਕਾਲ ਹੈ, 'plays' ਵਰਤਮਾਨ।"
  },
  {
    id: 'gian_l_modal_verbs_01',
    en: "'should' gives advice or recommendation. 'can' shows ability, and 'might' shows possibility — neither fits advice about a daily habit.",
    pa: "'should' ਸਲਾਹ ਦਿੰਦਾ ਹੈ। 'can' ਸਮਰੱਥਾ ਦਰਸਾਉਂਦਾ ਹੈ, ਅਤੇ 'might' ਸੰਭਾਵਨਾ — ਕੋਈ ਵੀ ਰੋਜ਼ ਦੀ ਆਦਤ ਬਾਰੇ ਸਲਾਹ ਲਈ ਫਿੱਟ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_adjective_basics_01',
    en: "'red' is the adjective — it describes the noun 'dress'. 'wore' is a verb (action) and 'dress' is a noun (thing).",
    pa: "'red' ਵਿਸ਼ੇਸ਼ਣ ਹੈ — ਇਹ ਨਾਂ 'dress' ਬਾਰੇ ਦੱਸਦਾ ਹੈ। 'wore' ਕਿਰਿਆ ਹੈ (ਕੰਮ) ਅਤੇ 'dress' ਨਾਂ ਹੈ (ਚੀਜ਼)।"
  },
  {
    id: 'gian_l_adj_vs_adv_01',
    en: "After linking verbs like 'tastes', 'looks', 'feels', use an adjective to describe the subject. 'delicious' describes the soup, not the action of tasting.",
    pa: "'tastes', 'looks', 'feels' ਵਰਗੀਆਂ ਜੋੜ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਵਿਸ਼ੇਸ਼ਣ ਵਰਤੋ। 'delicious' ਸੂਪ ਬਾਰੇ ਦੱਸਦਾ ਹੈ, ਚੱਖਣ ਦੀ ਕਿਰਿਆ ਬਾਰੇ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_comparative_adjectives_01',
    en: "Short adjectives (one syllable) add -er for comparison. 'hard' → 'harder'. 'more hard' is incorrect, and 'hardest' is superlative.",
    pa: "ਛੋਟੇ ਵਿਸ਼ੇਸ਼ਣ (ਇੱਕ ਅੱਖਰ) ਤੁਲਨਾ ਲਈ -er ਲੈਂਦੇ ਹਨ। 'hard' → 'harder'। 'more hard' ਗ਼ਲਤ ਹੈ, ਅਤੇ 'hardest' ਸਰਵੋਤਮ ਹੈ।"
  },
  {
    id: 'gian_l_superlative_adjectives_01',
    en: "Superlative adjectives always need 'the' — 'the tallest'. Without 'the', the superlative is incomplete. 'taller' is comparative, not superlative.",
    pa: "ਸਰਵੋਤਮ ਵਿਸ਼ੇਸ਼ਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ 'the' ਚਾਹੀਦਾ — 'the tallest'। 'the' ਤੋਂ ਬਿਨਾਂ ਸਰਵੋਤਮ ਅਧੂਰਾ ਹੈ। 'taller' ਤੁਲਨਾਤਮਕ ਹੈ, ਸਰਵੋਤਮ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_preposition_basics_01',
    en: "'in' means inside a container or enclosed space. A drawer is enclosed, so keys are 'in' it, not 'on' or 'at'.",
    pa: "'in' ਕਿਸੇ ਬੰਦ ਥਾਂ ਜਾਂ ਡੱਬੇ ਅੰਦਰ ਹੋਣਾ ਦਰਸਾਉਂਦਾ ਹੈ। ਦਰਾਜ਼ ਬੰਦ ਥਾਂ ਹੈ, ਇਸ ਲਈ ਚਾਬੀਆਂ ਇਸ 'ਵਿੱਚ' ਹਨ।"
  },
  {
    id: 'gian_l_prep_place_move_01',
    en: "'across' shows horizontal movement from one side to the other — perfect for running across a field. 'under' and 'in' don't show that kind of movement.",
    pa: "'across' ਇੱਕ ਪਾਸੇ ਤੋਂ ਦੂਜੇ ਪਾਸੇ ਗਤੀ ਦਰਸਾਉਂਦਾ ਹੈ — ਮੈਦਾਨ ਪਾਰ ਦੌੜਨ ਲਈ ਬਿਲਕੁਲ ਸਹੀ। 'under' ਅਤੇ 'in' ਇਸ ਤਰ੍ਹਾਂ ਦੀ ਗਤੀ ਨਹੀਂ ਦਰਸਾਉਂਦੇ।"
  },
  {
    id: 'gian_l_prep_time_01',
    en: "'at' is used for exact clock times (at 5 o'clock). 'on' is for days/dates (on Monday), and 'in' is for months/years (in June).",
    pa: "'at' ਪੱਕੇ ਸਮੇਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (at 5 o'clock)। 'on' ਦਿਨਾਂ/ਤਾਰੀਖ਼ਾਂ ਲਈ (on Monday), ਅਤੇ 'in' ਮਹੀਨਿਆਂ/ਸਾਲਾਂ ਲਈ (in June)।"
  },
  {
    id: 'gian_l_conjunction_basics_01',
    en: "'because' introduces a reason. Wanting to pass explains why I studied hard. 'but' shows contrast and 'or' shows choice — neither fits here.",
    pa: "'because' ਕਾਰਨ ਦੱਸਦਾ ਹੈ। ਪਾਸ ਹੋਣ ਦੀ ਇੱਛਾ ਸਖ਼ਤ ਪੜ੍ਹਾਈ ਦਾ ਕਾਰਨ ਹੈ। 'but' ਫ਼ਰਕ ਦਰਸਾਉਂਦਾ ਹੈ ਅਤੇ 'or' ਚੋਣ — ਕੋਈ ਵੀ ਇੱਥੇ ਫਿੱਟ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_conj_joining_01',
    en: "'or' presents a choice between two options — tea or coffee. 'and' would mean you want both, and 'so' would imply result.",
    pa: "'or' ਦੋ ਚੋਣਾਂ ਵਿੱਚੋਂ ਇੱਕ ਚੁਣਨਾ ਦਰਸਾਉਂਦਾ ਹੈ — ਚਾਹ ਜਾਂ ਕੌਫ਼ੀ। 'and' ਦਾ ਮਤਲਬ ਦੋਵੇਂ ਚਾਹੀਦੇ, ਅਤੇ 'so' ਨਤੀਜਾ ਦਰਸਾਉਂਦਾ।"
  },
  {
    id: 'gian_l_article_basics_01',
    en: "We choose 'a' or 'an' based on sound, not spelling. 'honest' has a silent 'h' — it sounds like it starts with a vowel, so use 'an'.",
    pa: "'a' ਜਾਂ 'an' ਆਵਾਜ਼ ਮੁਤਾਬਕ ਚੁਣੋ, ਸਪੈਲਿੰਗ ਮੁਤਾਬਕ ਨਹੀਂ। 'honest' ਵਿੱਚ 'h' ਚੁੱਪ ਹੈ — ਸਵਰ ਵਾਂਗ ਸੁਣਦਾ ਹੈ, ਇਸ ਲਈ 'an' ਵਰਤੋ।"
  },
  {
    id: 'gian_l_interjections_01',
    en: "'Ouch!' expresses sudden pain — matching 'That hurt!'. 'Wow!' shows surprise and 'Hello!' is a greeting — neither fits pain.",
    pa: "'Ouch!' ਅਚਾਨਕ ਦਰਦ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ — 'ਦੁੱਖਿਆ!' ਨਾਲ ਮੇਲ ਖਾਂਦਾ। 'Wow!' ਹੈਰਾਨੀ ਦਰਸਾਉਂਦਾ ਅਤੇ 'Hello!' ਮਿਲਣੀ ਹੈ — ਕੋਈ ਵੀ ਦਰਦ ਨਾਲ ਫਿੱਟ ਨਹੀਂ।"
  },
  {
    id: 'gian_l_sv_agreement_01',
    en: "'My sister' is third-person singular, so the verb needs an -s: 'jogs'. 'jog' is the base form used with plural subjects like 'they'.",
    pa: "'ਮੇਰੀ ਭੈਣ' ਤੀਜਾ ਪੁਰਖ ਇੱਕ ਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਨੂੰ -s ਚਾਹੀਦਾ: 'jogs'। 'jog' ਮੂਲ ਰੂਪ ਹੈ ਜੋ 'they' ਵਰਗੇ ਬਹੁਵਚਨ ਕਰਤਾ ਨਾਲ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"
  }
];

let updated = 0;
let failed = [];

for (const r of replacements) {
  // Find the gian_check block by its id
  const idPattern = `"id": "${r.id}"`;
  const idIdx = src.indexOf(idPattern);
  if (idIdx === -1) {
    failed.push(r.id + ' (id not found)');
    continue;
  }

  // Find the "explanation" key after the id (but before the next step entry)
  // We look for "explanation": { ... } within ~500 chars after "hint"
  const hintIdx = src.indexOf('"hint":', idIdx);
  if (hintIdx === -1 || hintIdx - idIdx > 2000) {
    failed.push(r.id + ' (hint not found)');
    continue;
  }

  const explIdx = src.indexOf('"explanation":', hintIdx);
  if (explIdx === -1 || explIdx - hintIdx > 500) {
    failed.push(r.id + ' (explanation not found)');
    continue;
  }

  // Find the opening { of the explanation object
  const explObjStart = src.indexOf('{', explIdx);
  // Find matching closing }
  let depth = 0;
  let explObjEnd = -1;
  for (let i = explObjStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        explObjEnd = i;
        break;
      }
    }
  }

  if (explObjEnd === -1) {
    failed.push(r.id + ' (could not find explanation closing brace)');
    continue;
  }

  // Build the new explanation object
  const newExpl = `{\n          "en": "${r.en}",\n          "pa": "${r.pa}"\n        }`;

  // Replace
  src = src.substring(0, explObjStart) + newExpl + src.substring(explObjEnd + 1);
  updated++;
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`Updated ${updated}/29 gian_check explanations.`);
if (failed.length) {
  console.log('Failed:', failed);
}
