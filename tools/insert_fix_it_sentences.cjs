#!/usr/bin/env node
/**
 * Inserts one fix_it_sentence step into each of the 29 canonical lessons,
 * immediately before the summary_bullets step (always the last step).
 *
 * Run: node tools/insert_fix_it_sentences.cjs
 */
const fs = require('fs');
const path = require('path');

const LESSONS_PATH = path.join(__dirname, '..', 'app', 'data', 'lessons.js');

// All 29 fix-it entries. Each targets the grammar rule of its lesson.
// brokenEn/Pa = sentence with an error; correctEn/Pa = fixed version
const FIX_IT_DATA = [
  {
    lessonId: "L_NOUNS_BASICS_01",
    id: "fix_l_nouns_basics_01",
    englishText: "Which sentence uses the noun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਨਾਂ ਨੂੰ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She has a big run in the park.",
    brokenPa: "ਉਸ ਦੀ ਪਾਰਕ ਵਿੱਚ ਵੱਡੀ ਦੌੜ ਹੈ।",
    correctEn: "She has a big dog in the park.",
    correctPa: "ਉਸ ਦਾ ਪਾਰਕ ਵਿੱਚ ਵੱਡਾ ਕੁੱਤਾ ਹੈ।",
    hint: { en: "A noun names a person, place, animal, or thing — not an action.", pa: "ਨਾਂ ਕਿਸੇ ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਨਵਰ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ — ਕਿਰਿਆ ਨਹੀਂ।" },
    explanation: { en: "'dog' is a noun (animal). 'run' is a verb, not a noun here.", pa: "'dog' ਨਾਂ ਹੈ (ਜਾਨਵਰ)। 'run' ਇੱਥੇ ਕਿਰਿਆ ਹੈ, ਨਾਂ ਨਹੀਂ।" }
  },
  {
    lessonId: "L_NOUNS_COMMON_01",
    id: "fix_l_nouns_common_01",
    englishText: "Which sentence uses a common noun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਆਮ ਨਾਂ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "I saw a Teacher at the school.",
    brokenPa: "ਮੈਂ ਸਕੂਲ ਵਿੱਚ ਇੱਕ Teacher ਵੇਖਿਆ।",
    correctEn: "I saw a teacher at the school.",
    correctPa: "ਮੈਂ ਸਕੂਲ ਵਿੱਚ ਇੱਕ ਅਧਿਆਪਕ ਵੇਖਿਆ।",
    hint: { en: "Common nouns do not start with a capital letter.", pa: "ਆਮ ਨਾਂ ਵੱਡੇ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਨਹੀਂ ਹੁੰਦੇ।" },
    explanation: { en: "'teacher' is a common noun and should not be capitalized mid-sentence.", pa: "'teacher' ਆਮ ਨਾਂ ਹੈ ਅਤੇ ਵਿਚਕਾਰ ਵਾਕ ਵਿੱਚ ਵੱਡੇ ਅੱਖਰ ਨਾਲ ਨਹੀਂ ਲਿਖਿਆ ਜਾਂਦਾ।" }
  },
  {
    lessonId: "L_NOUNS_PROPER_01",
    id: "fix_l_nouns_proper_01",
    englishText: "Which sentence uses the proper noun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਖ਼ਾਸ ਨਾਂ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "We visited amritsar last summer.",
    brokenPa: "ਅਸੀਂ ਪਿਛਲੀਆਂ ਗਰਮੀਆਂ ਵਿੱਚ amritsar ਗਏ।",
    correctEn: "We visited Amritsar last summer.",
    correctPa: "ਅਸੀਂ ਪਿਛਲੀਆਂ ਗਰਮੀਆਂ ਵਿੱਚ Amritsar ਗਏ।",
    hint: { en: "Proper nouns always start with a capital letter.", pa: "ਖ਼ਾਸ ਨਾਂ ਹਮੇਸ਼ਾ ਵੱਡੇ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ।" },
    explanation: { en: "'Amritsar' is a proper noun (city name) and must start with a capital letter.", pa: "'Amritsar' ਖ਼ਾਸ ਨਾਂ ਹੈ (ਸ਼ਹਿਰ ਦਾ ਨਾਂ) ਅਤੇ ਵੱਡੇ ਅੱਖਰ ਨਾਲ ਲਿਖਿਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PRONOUNS_BASICS_01",
    id: "fix_l_pronouns_basics_01",
    englishText: "Which sentence uses the pronoun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਪੜਨਾਂਵ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "Rina is smart. Rina reads every day.",
    brokenPa: "ਰੀਨਾ ਹੁਸ਼ਿਆਰ ਹੈ। ਰੀਨਾ ਹਰ ਰੋਜ਼ ਪੜ੍ਹਦੀ ਹੈ।",
    correctEn: "Rina is smart. She reads every day.",
    correctPa: "ਰੀਨਾ ਹੁਸ਼ਿਆਰ ਹੈ। ਉਹ ਹਰ ਰੋਜ਼ ਪੜ੍ਹਦੀ ਹੈ।",
    hint: { en: "A pronoun replaces a noun to avoid repeating it.", pa: "ਪੜਨਾਂਵ ਨਾਂ ਦੀ ਥਾਂ ਲੈਂਦਾ ਹੈ ਤਾਂ ਜੋ ਦੁਹਰਾਅ ਨਾ ਹੋਵੇ।" },
    explanation: { en: "Use 'She' instead of repeating 'Rina' in the second sentence.", pa: "ਦੂਜੇ ਵਾਕ ਵਿੱਚ 'ਰੀਨਾ' ਦੁਹਰਾਉਣ ਦੀ ਥਾਂ 'ਉਹ' ਵਰਤੋ।" }
  },
  {
    lessonId: "L_PRONOUNS_PERSONAL_01",
    id: "fix_l_pronouns_personal_01",
    englishText: "Which sentence uses the personal pronoun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਨਿੱਜੀ ਪੜਨਾਂਵ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "The teacher gave the books to I.",
    brokenPa: "ਅਧਿਆਪਕ ਨੇ ਕਿਤਾਬਾਂ I ਨੂੰ ਦਿੱਤੀਆਂ।",
    correctEn: "The teacher gave the books to me.",
    correctPa: "ਅਧਿਆਪਕ ਨੇ ਕਿਤਾਬਾਂ ਮੈਨੂੰ ਦਿੱਤੀਆਂ।",
    hint: { en: "Use the object form of the pronoun after a preposition.", pa: "ਸੰਬੰਧਕ ਤੋਂ ਬਾਅਦ ਪੜਨਾਂਵ ਦਾ ਕਰਮ ਰੂਪ ਵਰਤੋ।" },
    explanation: { en: "'me' is the object form; 'I' is the subject form and cannot follow 'to'.", pa: "'me' ਕਰਮ ਰੂਪ ਹੈ; 'I' ਕਰਤਾ ਰੂਪ ਹੈ ਅਤੇ 'to' ਤੋਂ ਬਾਅਦ ਨਹੀਂ ਆ ਸਕਦਾ।" }
  },
  {
    lessonId: "L_SINGULAR_PLURAL_01",
    id: "fix_l_singular_plural_01",
    englishText: "Which sentence has the correct plural?",
    punjabiText: "ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ਸਹੀ ਬਹੁਵਚਨ ਹੈ?",
    brokenEn: "The childs are playing outside.",
    brokenPa: "childs ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।",
    correctEn: "The children are playing outside.",
    correctPa: "ਬੱਚੇ ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।",
    hint: { en: "Some plurals are irregular — child becomes children.", pa: "ਕੁਝ ਬਹੁਵਚਨ ਅਨਿਯਮਤ ਹੁੰਦੇ ਹਨ — child ਤੋਂ children ਬਣਦਾ ਹੈ।" },
    explanation: { en: "'child' has an irregular plural: 'children', not 'childs'.", pa: "'child' ਦਾ ਅਨਿਯਮਤ ਬਹੁਵਚਨ 'children' ਹੈ, 'childs' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_NOUNS_PLURALS_POSSESSION_01",
    id: "fix_l_nouns_plurals_possession_01",
    englishText: "Which sentence correctly shows possession?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਮਾਲਕੀ ਸਹੀ ਦਰਸਾਉਂਦਾ ਹੈ?",
    brokenEn: "The dogs toys are in the yard.",
    brokenPa: "dogs ਦੇ ਖਿਡੌਣੇ ਵਿਹੜੇ ਵਿੱਚ ਹਨ।",
    correctEn: "The dogs' toys are in the yard.",
    correctPa: "ਕੁੱਤਿਆਂ ਦੇ ਖਿਡੌਣੇ ਵਿਹੜੇ ਵਿੱਚ ਹਨ।",
    hint: { en: "Use an apostrophe after plural nouns ending in s to show possession.", pa: "s ਨਾਲ ਖ਼ਤਮ ਹੁੰਦੇ ਬਹੁਵਚਨ ਨਾਂ ਤੋਂ ਬਾਅਦ ਅਪੋਸਟ੍ਰੋਫ਼ ਲਗਾਓ ਮਾਲਕੀ ਦਰਸਾਉਣ ਲਈ।" },
    explanation: { en: "'dogs'' (with apostrophe after s) shows the toys belong to more than one dog.", pa: "'dogs'' (s ਤੋਂ ਬਾਅਦ ਅਪੋਸਟ੍ਰੋਫ਼) ਦੱਸਦਾ ਹੈ ਕਿ ਖਿਡੌਣੇ ਇੱਕ ਤੋਂ ਵੱਧ ਕੁੱਤਿਆਂ ਦੇ ਹਨ।" }
  },
  {
    lessonId: "L_POSSESSIVE_NOUNS_01",
    id: "fix_l_possessive_nouns_01",
    englishText: "Which sentence correctly shows possession?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਮਾਲਕੀ ਸਹੀ ਦਰਸਾਉਂਦਾ ਹੈ?",
    brokenEn: "The cat tail is long.",
    brokenPa: "cat ਦੀ ਪੂਛ ਲੰਬੀ ਹੈ।",
    correctEn: "The cat's tail is long.",
    correctPa: "ਬਿੱਲੀ ਦੀ ਪੂਛ ਲੰਬੀ ਹੈ।",
    hint: { en: "Use noun + 's to show a singular noun owns something.", pa: "ਇੱਕ ਵਚਨ ਨਾਂ ਦੀ ਮਾਲਕੀ ਦਰਸਾਉਣ ਲਈ ਨਾਂ + 's ਵਰਤੋ।" },
    explanation: { en: "'cat's' with an apostrophe-s shows the tail belongs to the cat.", pa: "'cat's' ਅਪੋਸਟ੍ਰੋਫ਼-s ਨਾਲ ਦੱਸਦਾ ਹੈ ਕਿ ਪੂਛ ਬਿੱਲੀ ਦੀ ਹੈ।" }
  },
  {
    lessonId: "L_POSSESSIVE_PRONOUNS_01",
    id: "fix_l_possessive_pronouns_01",
    englishText: "Which sentence uses the possessive pronoun correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਮਲਕੀਅਤ ਵਾਲਾ ਪੜਨਾਂਵ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "This book is her.",
    brokenPa: "ਇਹ ਕਿਤਾਬ her ਹੈ।",
    correctEn: "This book is hers.",
    correctPa: "ਇਹ ਕਿਤਾਬ ਉਸ ਦੀ ਹੈ।",
    hint: { en: "Use the stand-alone possessive form when the pronoun replaces noun + possession.", pa: "ਜਦੋਂ ਪੜਨਾਂਵ ਨਾਂ + ਮਾਲਕੀ ਦੀ ਥਾਂ ਲਵੇ ਤਾਂ ਸੁਤੰਤਰ ਮਲਕੀਅਤ ਰੂਪ ਵਰਤੋ।" },
    explanation: { en: "'hers' is the stand-alone possessive; 'her' is used before a noun (e.g., her book).", pa: "'hers' ਸੁਤੰਤਰ ਮਲਕੀਅਤ ਰੂਪ ਹੈ; 'her' ਨਾਂ ਤੋਂ ਪਹਿਲਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (ਜਿਵੇਂ her book)।" }
  },
  {
    lessonId: "L_VERBS_BASICS_01",
    id: "fix_l_verbs_basics_01",
    englishText: "Which sentence uses the verb correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਕਿਰਿਆ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She happy every day.",
    brokenPa: "ਉਹ ਹਰ ਰੋਜ਼ ਖ਼ੁਸ਼।",
    correctEn: "She is happy every day.",
    correctPa: "ਉਹ ਹਰ ਰੋਜ਼ ਖ਼ੁਸ਼ ਹੈ।",
    hint: { en: "A sentence needs a verb — use a be-verb to show state.", pa: "ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਜ਼ਰੂਰੀ ਹੈ — ਹਾਲਤ ਦਰਸਾਉਣ ਲਈ be-ਕਿਰਿਆ ਵਰਤੋ।" },
    explanation: { en: "The sentence needs the be-verb 'is' to link the subject with the adjective.", pa: "ਵਾਕ ਵਿੱਚ ਕਰਤਾ ਅਤੇ ਵਿਸ਼ੇਸ਼ਣ ਜੋੜਨ ਲਈ 'is' ਕਿਰਿਆ ਚਾਹੀਦੀ ਹੈ।" }
  },
  {
    lessonId: "L_ADVERB_BASICS_01",
    id: "fix_l_adverb_basics_01",
    englishText: "Which sentence uses the adverb correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She sings beautiful.",
    brokenPa: "ਉਹ beautiful ਗਾਉਂਦੀ ਹੈ।",
    correctEn: "She sings beautifully.",
    correctPa: "ਉਹ ਸੁੰਦਰ ਢੰਗ ਨਾਲ ਗਾਉਂਦੀ ਹੈ।",
    hint: { en: "Use an adverb (not an adjective) to describe how an action happens.", pa: "ਕਿਰਿਆ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ ਦੱਸਣ ਲਈ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਵਰਤੋ, ਵਿਸ਼ੇਸ਼ਣ ਨਹੀਂ।" },
    explanation: { en: "'beautifully' is the adverb form; 'beautiful' is an adjective and describes a noun, not a verb.", pa: "'beautifully' ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ; 'beautiful' ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਅਤੇ ਨਾਂ ਬਾਰੇ ਦੱਸਦਾ ਹੈ, ਕਿਰਿਆ ਬਾਰੇ ਨਹੀਂ।" }
  },
  {
    lessonId: "L_SIMPLE_PRESENT_01",
    id: "fix_l_simple_present_01",
    englishText: "Which sentence uses the simple present correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਧਾਰਣ ਵਰਤਮਾਨ ਕਾਲ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She go to school every day.",
    brokenPa: "ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦਾ ਹੈ।",
    correctEn: "She goes to school every day.",
    correctPa: "ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦੀ ਹੈ।",
    hint: { en: "With he, she, or it in simple present, add -s or -es to the verb.", pa: "ਸਧਾਰਣ ਵਰਤਮਾਨ ਵਿੱਚ he, she, ਜਾਂ it ਨਾਲ ਕਿਰਿਆ ਵਿੱਚ -s ਜਾਂ -es ਲਗਾਓ।" },
    explanation: { en: "'She goes' is correct because third-person singular needs verb + s.", pa: "'She goes' ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਤੀਜੇ ਪੁਰਖ ਇੱਕ ਵਚਨ ਨਾਲ ਕਿਰਿਆ + s ਚਾਹੀਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PROGRESSIVE_PRESENT_01",
    id: "fix_l_progressive_present_01",
    englishText: "Which sentence uses the present progressive correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She is read a book right now.",
    brokenPa: "ਉਹ ਹੁਣੇ ਕਿਤਾਬ read ਰਹੀ ਹੈ।",
    correctEn: "She is reading a book right now.",
    correctPa: "ਉਹ ਹੁਣੇ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।",
    hint: { en: "Present progressive uses am/is/are + verb-ing.", pa: "ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ ਵਿੱਚ am/is/are + ਕਿਰਿਆ-ing ਵਰਤੋ।" },
    explanation: { en: "'is reading' is the correct present progressive form, not 'is read'.", pa: "'is reading' ਸਹੀ ਵਰਤਮਾਨ ਜਾਰੀ ਰੂਪ ਹੈ, 'is read' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_SIMPLE_PAST_01",
    id: "fix_l_simple_past_01",
    englishText: "Which sentence uses the simple past correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਧਾਰਣ ਭੂਤਕਾਲ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She goed to the market yesterday.",
    brokenPa: "ਉਹ ਕੱਲ੍ਹ ਬਜ਼ਾਰ goed।",
    correctEn: "She went to the market yesterday.",
    correctPa: "ਉਹ ਕੱਲ੍ਹ ਬਜ਼ਾਰ ਗਈ।",
    hint: { en: "Some verbs are irregular in the past — go becomes went.", pa: "ਕੁਝ ਕਿਰਿਆਵਾਂ ਭੂਤਕਾਲ ਵਿੱਚ ਅਨਿਯਮਤ ਹੁੰਦੀਆਂ ਹਨ — go ਤੋਂ went ਬਣਦਾ ਹੈ।" },
    explanation: { en: "'went' is the correct past tense of 'go'; 'goed' is not a real word.", pa: "'went' 'go' ਦਾ ਸਹੀ ਭੂਤਕਾਲ ਹੈ; 'goed' ਕੋਈ ਸ਼ਬਦ ਨਹੀਂ ਹੈ।" }
  },
  {
    lessonId: "L_PROGRESSIVE_PAST_01",
    id: "fix_l_progressive_past_01",
    englishText: "Which sentence uses the past progressive correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਭੂਤਕਾਲ ਜਾਰੀ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "They was playing when it rained.",
    brokenPa: "ਉਹ was ਖੇਡ ਰਹੇ ਸਨ ਜਦੋਂ ਮੀਂਹ ਪਿਆ।",
    correctEn: "They were playing when it rained.",
    correctPa: "ਉਹ ਖੇਡ ਰਹੇ ਸਨ ਜਦੋਂ ਮੀਂਹ ਪਿਆ।",
    hint: { en: "Use was with I/he/she/it and were with we/you/they.", pa: "I/he/she/it ਨਾਲ was ਅਤੇ we/you/they ਨਾਲ were ਵਰਤੋ।" },
    explanation: { en: "'They were playing' is correct; 'they' takes 'were', not 'was'.", pa: "'They were playing' ਸਹੀ ਹੈ; 'they' ਨਾਲ 'were' ਆਉਂਦਾ ਹੈ, 'was' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_SIMPLE_FUTURE_01",
    id: "fix_l_simple_future_01",
    englishText: "Which sentence uses the simple future correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਧਾਰਣ ਭਵਿੱਖ ਕਾਲ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She will goes to the park tomorrow.",
    brokenPa: "ਉਹ ਕੱਲ੍ਹ ਪਾਰਕ will goes।",
    correctEn: "She will go to the park tomorrow.",
    correctPa: "ਉਹ ਕੱਲ੍ਹ ਪਾਰਕ ਜਾਵੇਗੀ।",
    hint: { en: "After 'will', always use the base verb — no -s or -es.", pa: "'will' ਤੋਂ ਬਾਅਦ ਹਮੇਸ਼ਾ ਮੂਲ ਕਿਰਿਆ ਵਰਤੋ — ਕੋਈ -s ਜਾਂ -es ਨਹੀਂ।" },
    explanation: { en: "'will go' is correct; after a modal like 'will', use the base form of the verb.", pa: "'will go' ਸਹੀ ਹੈ; 'will' ਵਰਗੇ ਸਹਾਇਕ ਤੋਂ ਬਾਅਦ ਕਿਰਿਆ ਦਾ ਮੂਲ ਰੂਪ ਵਰਤੋ।" }
  },
  {
    lessonId: "L_MODAL_VERBS_01",
    id: "fix_l_modal_verbs_01",
    englishText: "Which sentence uses the modal verb correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਹਾਇਕ ਕਿਰਿਆ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "You should goes to bed early.",
    brokenPa: "ਤੁਹਾਨੂੰ ਜਲਦੀ ਸੌਣਾ should goes।",
    correctEn: "You should go to bed early.",
    correctPa: "ਤੁਹਾਨੂੰ ਜਲਦੀ ਸੌਣਾ ਚਾਹੀਦਾ ਹੈ।",
    hint: { en: "After a modal verb, always use the base verb.", pa: "ਸਹਾਇਕ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਹਮੇਸ਼ਾ ਮੂਲ ਕਿਰਿਆ ਵਰਤੋ।" },
    explanation: { en: "'should go' is correct; after 'should', use the base form, not 'goes'.", pa: "'should go' ਸਹੀ ਹੈ; 'should' ਤੋਂ ਬਾਅਦ ਮੂਲ ਰੂਪ ਵਰਤੋ, 'goes' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_ADJECTIVE_BASICS_01",
    id: "fix_l_adjective_basics_01",
    englishText: "Which sentence uses the adjective correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਵਿਸ਼ੇਸ਼ਣ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "The tall is standing near the gate.",
    brokenPa: "ਲੰਬਾ ਗੇਟ ਕੋਲ ਖੜ੍ਹਾ ਹੈ।",
    correctEn: "The tall boy is standing near the gate.",
    correctPa: "ਲੰਬਾ ਮੁੰਡਾ ਗੇਟ ਕੋਲ ਖੜ੍ਹਾ ਹੈ।",
    hint: { en: "An adjective needs a noun after it — it describes the noun.", pa: "ਵਿਸ਼ੇਸ਼ਣ ਤੋਂ ਬਾਅਦ ਨਾਂ ਚਾਹੀਦਾ ਹੈ — ਇਹ ਨਾਂ ਬਾਰੇ ਦੱਸਦਾ ਹੈ।" },
    explanation: { en: "'tall' is an adjective and needs a noun like 'boy' to describe.", pa: "'tall' ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਅਤੇ ਇਸ ਨੂੰ 'boy' ਵਰਗੇ ਨਾਂ ਦੀ ਲੋੜ ਹੈ ਜਿਸ ਬਾਰੇ ਦੱਸੇ।" }
  },
  {
    lessonId: "L_ADJ_VS_ADV_01",
    id: "fix_l_adj_vs_adv_01",
    englishText: "Which sentence uses the correct word form?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਹੀ ਸ਼ਬਦ ਰੂਪ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "He runs quick in the race.",
    brokenPa: "ਉਹ ਦੌੜ ਵਿੱਚ quick ਦੌੜਦਾ ਹੈ।",
    correctEn: "He runs quickly in the race.",
    correctPa: "ਉਹ ਦੌੜ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਦਾ ਹੈ।",
    hint: { en: "Use an adverb to describe how an action happens, not an adjective.", pa: "ਕਿਰਿਆ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ ਦੱਸਣ ਲਈ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਵਰਤੋ, ਵਿਸ਼ੇਸ਼ਣ ਨਹੀਂ।" },
    explanation: { en: "'quickly' is the adverb that describes how he runs; 'quick' is the adjective form.", pa: "'quickly' ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ ਜੋ ਦੱਸਦਾ ਹੈ ਉਹ ਕਿਵੇਂ ਦੌੜਦਾ ਹੈ; 'quick' ਵਿਸ਼ੇਸ਼ਣ ਰੂਪ ਹੈ।" }
  },
  {
    lessonId: "L_COMPARATIVE_ADJECTIVES_01",
    id: "fix_l_comparative_adjectives_01",
    englishText: "Which sentence uses the comparative form correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਤੁਲਨਾਤਮਕ ਰੂਪ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She is more taller than her brother.",
    brokenPa: "ਉਹ ਆਪਣੇ ਭਰਾ ਨਾਲੋਂ more taller ਹੈ।",
    correctEn: "She is taller than her brother.",
    correctPa: "ਉਹ ਆਪਣੇ ਭਰਾ ਨਾਲੋਂ ਲੰਬੀ ਹੈ।",
    hint: { en: "Don't use 'more' with adjectives that already end in -er.", pa: "ਜਿਹੜੇ ਵਿਸ਼ੇਸ਼ਣ ਪਹਿਲਾਂ ਹੀ -er ਨਾਲ ਖ਼ਤਮ ਹੁੰਦੇ ਹਨ ਉਨ੍ਹਾਂ ਨਾਲ 'more' ਨਾ ਵਰਤੋ।" },
    explanation: { en: "'taller' already contains the comparative -er; adding 'more' is a double comparison error.", pa: "'taller' ਵਿੱਚ ਪਹਿਲਾਂ ਹੀ ਤੁਲਨਾਤਮਕ -er ਹੈ; 'more' ਲਗਾਉਣਾ ਦੋਹਰੀ ਤੁਲਨਾ ਦੀ ਗਲਤੀ ਹੈ।" }
  },
  {
    lessonId: "L_SUPERLATIVE_ADJECTIVES_01",
    id: "fix_l_superlative_adjectives_01",
    englishText: "Which sentence uses the superlative form correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਰਵੋਤਮ ਰੂਪ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She is tallest girl in the class.",
    brokenPa: "ਉਹ ਕਲਾਸ ਵਿੱਚ tallest ਕੁੜੀ ਹੈ।",
    correctEn: "She is the tallest girl in the class.",
    correctPa: "ਉਹ ਕਲਾਸ ਵਿੱਚ ਸਭ ਤੋਂ ਲੰਬੀ ਕੁੜੀ ਹੈ।",
    hint: { en: "Use 'the' before a superlative adjective.", pa: "ਸਰਵੋਤਮ ਵਿਸ਼ੇਸ਼ਣ ਤੋਂ ਪਹਿਲਾਂ 'the' ਵਰਤੋ।" },
    explanation: { en: "Superlatives need 'the' — 'the tallest', not just 'tallest'.", pa: "ਸਰਵੋਤਮ ਰੂਪ ਨਾਲ 'the' ਚਾਹੀਦਾ ਹੈ — 'the tallest', ਸਿਰਫ਼ 'tallest' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_PREPOSITION_BASICS_01",
    id: "fix_l_preposition_basics_01",
    englishText: "Which sentence uses the preposition correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸੰਬੰਧਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "The book is at the table.",
    brokenPa: "ਕਿਤਾਬ ਮੇਜ਼ at ਹੈ।",
    correctEn: "The book is on the table.",
    correctPa: "ਕਿਤਾਬ ਮੇਜ਼ ਉੱਤੇ ਹੈ।",
    hint: { en: "Use the preposition that matches where the object is — on a surface, not at.", pa: "ਜਿੱਥੇ ਚੀਜ਼ ਹੈ ਉਸ ਮੁਤਾਬਕ ਸੰਬੰਧਕ ਵਰਤੋ — ਸਤ੍ਹਾ ਉੱਤੇ ਲਈ on ਵਰਤੋ।" },
    explanation: { en: "'on' shows something resting on a surface; 'at' shows a general location.", pa: "'on' ਦੱਸਦਾ ਹੈ ਕਿ ਕੋਈ ਚੀਜ਼ ਸਤ੍ਹਾ ਉੱਤੇ ਹੈ; 'at' ਆਮ ਥਾਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PREP_PLACE_MOVE_01",
    id: "fix_l_prep_place_move_01",
    englishText: "Which sentence uses the preposition correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸੰਬੰਧਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "The cat jumped on the box.",
    brokenPa: "ਬਿੱਲੀ ਡੱਬੇ on ਛਾਲ ਮਾਰੀ।",
    correctEn: "The cat jumped into the box.",
    correctPa: "ਬਿੱਲੀ ਡੱਬੇ ਅੰਦਰ ਛਾਲ ਮਾਰੀ।",
    hint: { en: "Use a movement preposition for motion — into, not on.", pa: "ਗਤੀ ਲਈ ਗਤੀ ਵਾਲਾ ਸੰਬੰਧਕ ਵਰਤੋ — into, on ਨਹੀਂ।" },
    explanation: { en: "'into' shows movement inside; 'on' shows resting on a surface.", pa: "'into' ਅੰਦਰ ਗਤੀ ਦਰਸਾਉਂਦਾ ਹੈ; 'on' ਸਤ੍ਹਾ ਉੱਤੇ ਹੋਣਾ ਦਰਸਾਉਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PREP_TIME_01",
    id: "fix_l_prep_time_01",
    englishText: "Which sentence uses the time preposition correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਸਮੇਂ ਦਾ ਸੰਬੰਧਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "The class starts in Monday.",
    brokenPa: "ਕਲਾਸ Monday in ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
    correctEn: "The class starts on Monday.",
    correctPa: "ਕਲਾਸ ਸੋਮਵਾਰ ਨੂੰ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
    hint: { en: "Use 'on' for days; use 'in' for months and years.", pa: "ਦਿਨਾਂ ਲਈ 'on' ਵਰਤੋ; ਮਹੀਨਿਆਂ ਅਤੇ ਸਾਲਾਂ ਲਈ 'in' ਵਰਤੋ।" },
    explanation: { en: "'on Monday' is correct; we use 'on' with days of the week.", pa: "'on Monday' ਸਹੀ ਹੈ; ਹਫ਼ਤੇ ਦੇ ਦਿਨਾਂ ਨਾਲ 'on' ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_CONJUNCTION_BASICS_01",
    id: "fix_l_conjunction_basics_01",
    englishText: "Which sentence uses the conjunction correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਯੋਜਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "I like tea but I like coffee.",
    brokenPa: "ਮੈਨੂੰ ਚਾਹ ਪਸੰਦ ਹੈ but ਮੈਨੂੰ ਕੌਫ਼ੀ ਪਸੰਦ ਹੈ।",
    correctEn: "I like tea and I like coffee.",
    correctPa: "ਮੈਨੂੰ ਚਾਹ ਪਸੰਦ ਹੈ ਅਤੇ ਮੈਨੂੰ ਕੌਫ਼ੀ ਪਸੰਦ ਹੈ।",
    hint: { en: "Use 'and' to add similar ideas; use 'but' to show contrast.", pa: "ਮਿਲਦੇ-ਜੁਲਦੇ ਵਿਚਾਰ ਜੋੜਨ ਲਈ 'and' ਵਰਤੋ; ਫ਼ਰਕ ਦੱਸਣ ਲਈ 'but' ਵਰਤੋ।" },
    explanation: { en: "Both ideas are similar (liking), so 'and' is correct. 'but' shows contrast.", pa: "ਦੋਵੇਂ ਵਿਚਾਰ ਮਿਲਦੇ ਹਨ (ਪਸੰਦ), ਇਸ ਲਈ 'and' ਸਹੀ ਹੈ। 'but' ਫ਼ਰਕ ਦਰਸਾਉਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_CONJ_JOINING_01",
    id: "fix_l_conj_joining_01",
    englishText: "Which sentence uses the conjunction correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਯੋਜਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "It was raining, and we stayed inside.",
    brokenPa: "ਮੀਂਹ ਪੈ ਰਿਹਾ ਸੀ, and ਅਸੀਂ ਅੰਦਰ ਰਹੇ।",
    correctEn: "It was raining, so we stayed inside.",
    correctPa: "ਮੀਂਹ ਪੈ ਰਿਹਾ ਸੀ, ਇਸ ਲਈ ਅਸੀਂ ਅੰਦਰ ਰਹੇ।",
    hint: { en: "Use 'so' to show result; use 'and' just to add ideas.", pa: "ਨਤੀਜਾ ਦੱਸਣ ਲਈ 'so' ਵਰਤੋ; ਸਿਰਫ਼ ਵਿਚਾਰ ਜੋੜਨ ਲਈ 'and' ਵਰਤੋ।" },
    explanation: { en: "Staying inside is the result of rain, so 'so' is correct, not 'and'.", pa: "ਅੰਦਰ ਰਹਿਣਾ ਮੀਂਹ ਦਾ ਨਤੀਜਾ ਹੈ, ਇਸ ਲਈ 'so' ਸਹੀ ਹੈ, 'and' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_ARTICLE_BASICS_01",
    id: "fix_l_article_basics_01",
    englishText: "Which sentence uses the article correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਲੇਖ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "She ate a apple for lunch.",
    brokenPa: "ਉਸ ਨੇ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਵਿੱਚ a apple ਖਾਧਾ।",
    correctEn: "She ate an apple for lunch.",
    correctPa: "ਉਸ ਨੇ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਵਿੱਚ ਇੱਕ ਸੇਬ ਖਾਧਾ।",
    hint: { en: "Use 'an' before a vowel sound, and 'a' before a consonant sound.", pa: "ਸਵਰ ਦੀ ਆਵਾਜ਼ ਤੋਂ ਪਹਿਲਾਂ 'an' ਅਤੇ ਵਿਅੰਜਨ ਦੀ ਆਵਾਜ਼ ਤੋਂ ਪਹਿਲਾਂ 'a' ਵਰਤੋ।" },
    explanation: { en: "'apple' starts with a vowel sound, so use 'an', not 'a'.", pa: "'apple' ਸਵਰ ਦੀ ਆਵਾਜ਼ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ 'an' ਵਰਤੋ, 'a' ਨਹੀਂ।" }
  },
  {
    lessonId: "L_INTERJECTIONS_01",
    id: "fix_l_interjections_01",
    englishText: "Which sentence uses the interjection correctly?",
    punjabiText: "ਕਿਹੜਾ ਵਾਕ ਵਿਸਮਿਕ ਸਹੀ ਵਰਤਦਾ ਹੈ?",
    brokenEn: "Wow. That was amazing.",
    brokenPa: "Wow. ਇਹ ਬਹੁਤ ਵਧੀਆ ਸੀ।",
    correctEn: "Wow! That was amazing.",
    correctPa: "ਵਾਹ! ਇਹ ਬਹੁਤ ਵਧੀਆ ਸੀ।",
    hint: { en: "An interjection usually has an exclamation mark to show strong feeling.", pa: "ਵਿਸਮਿਕ ਤੋਂ ਬਾਅਦ ਆਮ ਤੌਰ ਤੇ ਵਿਸਮਿਕ ਚਿੰਨ੍ਹ (!) ਲੱਗਦਾ ਹੈ।" },
    explanation: { en: "'Wow!' with an exclamation mark shows sudden excitement; a period is too weak.", pa: "'Wow!' ਵਿਸਮਿਕ ਚਿੰਨ੍ਹ ਨਾਲ ਅਚਾਨਕ ਖ਼ੁਸ਼ੀ ਦਰਸਾਉਂਦਾ ਹੈ; ਪੂਰਨ ਵਿਰਾਮ ਕਮਜ਼ੋਰ ਹੈ।" }
  },
  {
    lessonId: "L_SV_AGREEMENT_01",
    id: "fix_l_sv_agreement_01",
    englishText: "Which sentence has correct subject-verb agreement?",
    punjabiText: "ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ਕਰਤਾ-ਕਿਰਿਆ ਦਾ ਮੇਲ ਸਹੀ ਹੈ?",
    brokenEn: "The dogs runs in the park.",
    brokenPa: "ਕੁੱਤੇ ਪਾਰਕ ਵਿੱਚ runs ਹਨ।",
    correctEn: "The dogs run in the park.",
    correctPa: "ਕੁੱਤੇ ਪਾਰਕ ਵਿੱਚ ਦੌੜਦੇ ਹਨ।",
    hint: { en: "A plural subject takes the base verb — no -s.", pa: "ਬਹੁਵਚਨ ਕਰਤਾ ਨਾਲ ਮੂਲ ਕਿਰਿਆ ਆਉਂਦੀ ਹੈ — ਕੋਈ -s ਨਹੀਂ।" },
    explanation: { en: "'dogs' is plural, so use 'run' (base verb), not 'runs'.", pa: "'dogs' ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ 'run' (ਮੂਲ ਕਿਰਿਆ) ਵਰਤੋ, 'runs' ਨਹੀਂ।" }
  }
];

// Build the step JSON for each entry
function buildFixItStep(entry) {
  // Options: correct and broken, randomly ordered per lesson
  // We use a deterministic order: option A = correct, option B = broken
  // The renderer will rely on correctAnswer matching
  const step = {
    type: "fix_it_sentence",
    id: entry.id,
    englishText: entry.englishText,
    punjabiText: entry.punjabiText,
    options: [
      { en: entry.correctEn, pa: entry.correctPa },
      { en: entry.brokenEn, pa: entry.brokenPa }
    ],
    correctAnswer: entry.correctEn,
    points: 5,
    hint: entry.hint,
    explanation: entry.explanation,
    correctOptionIndex: 0
  };
  return step;
}

// Read the file
let src = fs.readFileSync(LESSONS_PATH, 'utf8');
const lines = src.split('\n');

// For each lesson, find the summary_bullets line and insert before it
// We process in reverse order so line numbers don't shift
const insertions = [];
for (const entry of FIX_IT_DATA) {
  // Find the summary_bullets for this lesson
  // Strategy: find the lesson key, then find the NEXT summary_bullets after it
  const lessonKeyPattern = '"' + entry.lessonId + '"';
  let lessonStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(lessonKeyPattern)) {
      lessonStart = i;
      break;
    }
  }
  if (lessonStart === -1) {
    console.error('Could not find lesson: ' + entry.lessonId);
    continue;
  }

  // Find the next lesson boundary or end of file
  let nextLessonStart = lines.length;
  for (let i = lessonStart + 1; i < lines.length; i++) {
    if (/^\s+"L_/.test(lines[i]) && lines[i].includes('": {')) {
      nextLessonStart = i;
      break;
    }
  }

  // Find the LAST summary_bullets in this lesson range
  let summaryLine = -1;
  for (let i = lessonStart; i < nextLessonStart; i++) {
    if (lines[i].includes('"type": "summary_bullets"')) {
      summaryLine = i;
    }
  }
  if (summaryLine === -1) {
    console.error('Could not find summary_bullets for: ' + entry.lessonId);
    continue;
  }

  // The { that opens the summary_bullets step is the line before "type": "summary_bullets"
  // We need to insert BEFORE that opening {
  // Find the { that opens the summary_bullets block
  let openBrace = summaryLine;
  for (let i = summaryLine; i >= lessonStart; i--) {
    if (lines[i].trim() === '{') {
      openBrace = i;
      break;
    }
  }

  insertions.push({
    lessonId: entry.lessonId,
    insertBeforeLine: openBrace, // 0-indexed
    step: buildFixItStep(entry)
  });
}

// Sort insertions by line number descending so we don't shift indices
insertions.sort((a, b) => b.insertBeforeLine - a.insertBeforeLine);

let insertCount = 0;
for (const ins of insertions) {
  const stepJson = JSON.stringify(ins.step, null, 8);
  // Indent to match lessons.js (6 spaces for step object)
  const indented = stepJson.split('\n').map((line, i) => {
    if (i === 0) return '      ' + line;
    return '      ' + line;
  }).join('\n');

  // Insert the step + trailing comma before the summary_bullets opening brace
  const insertion = indented + ',';
  const lineArr = insertion.split('\n');
  
  // Splice into lines array
  lines.splice(ins.insertBeforeLine, 0, ...lineArr);
  insertCount++;
}

const result = lines.join('\n');
fs.writeFileSync(LESSONS_PATH, result, 'utf8');

console.log('Inserted ' + insertCount + ' fix_it_sentence steps.');
console.log('File written: ' + LESSONS_PATH);
