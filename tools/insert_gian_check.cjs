#!/usr/bin/env node
/**
 * Inserts one gian_check step into each of the 29 canonical lessons,
 * immediately before the summary_bullets step (after fix_it_sentence).
 *
 * Run: node tools/insert_gian_check.cjs
 */
const fs = require('fs');
const path = require('path');

const LESSONS_PATH = path.join(__dirname, '..', 'app', 'data', 'lessons.js');

// All 29 Gian Check entries.
// Each is a 3-option MCQ that tests RULE TRANSFER in a new context (not error correction).
const GIAN_DATA = [
  {
    lessonId: "L_NOUNS_BASICS_01",
    id: "gian_l_nouns_basics_01",
    englishText: "Which word is the noun in this sentence? \"The bird sings loudly.\"",
    punjabiText: "ਇਸ ਵਾਕ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਹੈ? \"The bird sings loudly.\"",
    options: [
      { en: "bird", pa: "bird (ਪੰਛੀ)" },
      { en: "sings", pa: "sings (ਗਾਉਂਦਾ)" },
      { en: "loudly", pa: "loudly (ਉੱਚੀ)" }
    ],
    correctAnswer: "bird",
    explanation: { en: "'bird' is a noun — it names an animal.", pa: "'bird' ਨਾਂ ਹੈ — ਇਹ ਇੱਕ ਜਾਨਵਰ ਦਾ ਨਾਂ ਦੱਸਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_NOUNS_COMMON_01",
    id: "gian_l_nouns_common_01",
    englishText: "Which group has only common nouns?",
    punjabiText: "ਕਿਹੜੇ ਗਰੁੱਪ ਵਿੱਚ ਸਿਰਫ਼ ਆਮ ਨਾਂ ਹਨ?",
    options: [
      { en: "book, river, school", pa: "ਕਿਤਾਬ, ਦਰਿਆ, ਸਕੂਲ" },
      { en: "Ravi, Delhi, Monday", pa: "ਰਵੀ, ਦਿੱਲੀ, ਸੋਮਵਾਰ" },
      { en: "run, jump, read", pa: "ਦੌੜਨਾ, ਛਾਲ, ਪੜ੍ਹਨਾ" }
    ],
    correctAnswer: "book, river, school",
    explanation: { en: "'book', 'river', and 'school' are general names — common nouns.", pa: "'book', 'river' ਅਤੇ 'school' ਆਮ ਨਾਂ ਹਨ — ਇਹ ਸਧਾਰਨ ਨਾਂ ਹਨ।" }
  },
  {
    lessonId: "L_NOUNS_PROPER_01",
    id: "gian_l_nouns_proper_01",
    englishText: "Which sentence has a proper noun?",
    punjabiText: "ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਸ ਨਾਂ ਹੈ?",
    options: [
      { en: "Gurpreet lives in Ludhiana.", pa: "ਗੁਰਪ੍ਰੀਤ ਲੁਧਿਆਣੇ ਰਹਿੰਦਾ ਹੈ।" },
      { en: "The boy plays in the park.", pa: "ਮੁੰਡਾ ਪਾਰਕ ਵਿੱਚ ਖੇਡਦਾ ਹੈ।" },
      { en: "A teacher reads a book.", pa: "ਇੱਕ ਅਧਿਆਪਕ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ।" }
    ],
    correctAnswer: "Gurpreet lives in Ludhiana.",
    explanation: { en: "'Gurpreet' and 'Ludhiana' are proper nouns — specific names.", pa: "'ਗੁਰਪ੍ਰੀਤ' ਅਤੇ 'ਲੁਧਿਆਣਾ' ਖ਼ਾਸ ਨਾਂ ਹਨ — ਖ਼ਾਸ ਨਾਂ।" }
  },
  {
    lessonId: "L_PRONOUNS_BASICS_01",
    id: "gian_l_pronouns_basics_01",
    englishText: "\"The cat is sleepy. ___ is yawning.\" Pick the pronoun.",
    punjabiText: "\"ਬਿੱਲੀ ਨੀਂਦ ਵਾਲੀ ਹੈ। ___ ਉਬਾਸੀ ਲੈ ਰਹੀ ਹੈ।\" ਪੜਨਾਂਵ ਚੁਣੋ।",
    options: [
      { en: "It", pa: "ਇਹ" },
      { en: "She", pa: "ਉਹ" },
      { en: "Cat", pa: "ਬਿੱਲੀ" }
    ],
    correctAnswer: "It",
    explanation: { en: "'It' replaces 'the cat' — animals often use 'it' as a pronoun.", pa: "'It' 'ਬਿੱਲੀ' ਦੀ ਥਾਂ ਲੈਂਦਾ ਹੈ — ਜਾਨਵਰਾਂ ਲਈ ਅਕਸਰ 'it' ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PRONOUNS_PERSONAL_01",
    id: "gian_l_pronouns_personal_01",
    englishText: "\"Ravi called ___. We talked for an hour.\" Pick the correct pronoun.",
    punjabiText: "\"ਰਵੀ ਨੇ ___ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ। ਅਸੀਂ ਇੱਕ ਘੰਟਾ ਗੱਲ ਕੀਤੀ।\" ਸਹੀ ਪੜਨਾਂਵ ਚੁਣੋ।",
    options: [
      { en: "me", pa: "ਮੈਨੂੰ" },
      { en: "I", pa: "ਮੈਂ" },
      { en: "my", pa: "ਮੇਰਾ" }
    ],
    correctAnswer: "me",
    explanation: { en: "'me' is the object form — the person being called.", pa: "'me' ਕਰਮ ਰੂਪ ਹੈ — ਜਿਸ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ ਗਿਆ।" }
  },
  {
    lessonId: "L_SINGULAR_PLURAL_01",
    id: "gian_l_singular_plural_01",
    englishText: "What is the correct plural of \"box\"?",
    punjabiText: "\"box\" ਦਾ ਸਹੀ ਬਹੁਵਚਨ ਕੀ ਹੈ?",
    options: [
      { en: "boxes", pa: "boxes" },
      { en: "boxs", pa: "boxs" },
      { en: "boxen", pa: "boxen" }
    ],
    correctAnswer: "boxes",
    explanation: { en: "Nouns ending in x add -es: box → boxes.", pa: "x ਨਾਲ ਖ਼ਤਮ ਹੋਣ ਵਾਲੇ ਨਾਂ ਨੂੰ -es ਲੱਗਦਾ ਹੈ: box → boxes।" }
  },
  {
    lessonId: "L_NOUNS_PLURALS_POSSESSION_01",
    id: "gian_l_nouns_plurals_possession_01",
    englishText: "\"The ___ homework is on the desk.\" Which is correct?",
    punjabiText: "\"___ ਦਾ ਹੋਮਵਰਕ ਮੇਜ਼ ਉੱਤੇ ਹੈ।\" ਕਿਹੜਾ ਸਹੀ ਹੈ?",
    options: [
      { en: "student's", pa: "student's (ਵਿਦਿਆਰਥੀ ਦਾ)" },
      { en: "students", pa: "students (ਵਿਦਿਆਰਥੀ)" },
      { en: "student", pa: "student (ਵਿਦਿਆਰਥੀ)" }
    ],
    correctAnswer: "student's",
    explanation: { en: "'student's' with apostrophe-s shows the homework belongs to one student.", pa: "'student's' ਅਪੋਸਟ੍ਰੋਫ਼-s ਨਾਲ ਦੱਸਦਾ ਹੈ ਕਿ ਹੋਮਵਰਕ ਇੱਕ ਵਿਦਿਆਰਥੀ ਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_POSSESSIVE_NOUNS_01",
    id: "gian_l_possessive_nouns_01",
    englishText: "\"The ___ toys are colourful.\" (more than one baby)",
    punjabiText: "\"___ ਦੇ ਖਿਡੌਣੇ ਰੰਗੀਨ ਹਨ।\" (ਇੱਕ ਤੋਂ ਵੱਧ ਬੱਚੇ)",
    options: [
      { en: "babies'", pa: "babies'" },
      { en: "baby's", pa: "baby's" },
      { en: "babys", pa: "babys" }
    ],
    correctAnswer: "babies'",
    explanation: { en: "'babies'' — plural noun ending in s takes just an apostrophe.", pa: "'babies'' — s ਨਾਲ ਖ਼ਤਮ ਹੋਣ ਵਾਲੇ ਬਹੁਵਚਨ ਨਾਂ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ ਅਪੋਸਟ੍ਰੋਫ਼ ਲੱਗਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_POSSESSIVE_PRONOUNS_01",
    id: "gian_l_possessive_pronouns_01",
    englishText: "\"That pen is ___. I bought it.\" Pick the correct word.",
    punjabiText: "\"ਉਹ ਪੈੱਨ ___ ਹੈ। ਮੈਂ ਖ਼ਰੀਦਿਆ ਸੀ।\" ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।",
    options: [
      { en: "mine", pa: "ਮੇਰਾ" },
      { en: "my", pa: "ਮੇਰਾ" },
      { en: "me", pa: "ਮੈਨੂੰ" }
    ],
    correctAnswer: "mine",
    explanation: { en: "'mine' is the stand-alone possessive; 'my' needs a noun after it.", pa: "'mine' ਸੁਤੰਤਰ ਮਲਕੀਅਤ ਰੂਪ ਹੈ; 'my' ਤੋਂ ਬਾਅਦ ਨਾਂ ਚਾਹੀਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_VERBS_BASICS_01",
    id: "gian_l_verbs_basics_01",
    englishText: "Which word is the verb? \"The farmer grows wheat.\"",
    punjabiText: "ਕਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਹੈ? \"The farmer grows wheat.\"",
    options: [
      { en: "grows", pa: "grows (ਉਗਾਉਂਦਾ)" },
      { en: "farmer", pa: "farmer (ਕਿਸਾਨ)" },
      { en: "wheat", pa: "wheat (ਕਣਕ)" }
    ],
    correctAnswer: "grows",
    explanation: { en: "'grows' is the action verb — it shows what the farmer does.", pa: "'grows' ਕਿਰਿਆ ਹੈ — ਇਹ ਦੱਸਦਾ ਹੈ ਕਿ ਕਿਸਾਨ ਕੀ ਕਰਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_ADVERB_BASICS_01",
    id: "gian_l_adverb_basics_01",
    englishText: "\"She danced ___ on stage.\" Pick the adverb.",
    punjabiText: "\"ਉਹ ਸਟੇਜ ਤੇ ___ ਨੱਚੀ।\" ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।",
    options: [
      { en: "gracefully", pa: "ਸੁੰਦਰ ਢੰਗ ਨਾਲ" },
      { en: "graceful", pa: "ਸੁੰਦਰ" },
      { en: "grace", pa: "ਸੁੰਦਰਤਾ" }
    ],
    correctAnswer: "gracefully",
    explanation: { en: "'gracefully' is the adverb — it describes how she danced.", pa: "'gracefully' ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਹੈ — ਇਹ ਦੱਸਦਾ ਹੈ ਉਹ ਕਿਵੇਂ ਨੱਚੀ।" }
  },
  {
    lessonId: "L_SIMPLE_PRESENT_01",
    id: "gian_l_simple_present_01",
    englishText: "\"He ___ breakfast at 7 every day.\" Pick the correct verb.",
    punjabiText: "\"ਉਹ ਹਰ ਰੋਜ਼ 7 ਵਜੇ ਨਾਸ਼ਤਾ ___ ।\" ਸਹੀ ਕਿਰਿਆ ਚੁਣੋ।",
    options: [
      { en: "eats", pa: "ਖਾਂਦਾ ਹੈ" },
      { en: "eat", pa: "ਖਾਂਦੇ ਹਾਂ" },
      { en: "eating", pa: "ਖਾ ਰਿਹਾ ਹੈ" }
    ],
    correctAnswer: "eats",
    explanation: { en: "'He' is third-person singular — use verb + s in simple present.", pa: "'He' ਤੀਜਾ ਪੁਰਖ ਇੱਕ ਵਚਨ ਹੈ — ਸਧਾਰਣ ਵਰਤਮਾਨ ਵਿੱਚ ਕਿਰਿਆ + s ਵਰਤੋ।" }
  },
  {
    lessonId: "L_PROGRESSIVE_PRESENT_01",
    id: "gian_l_progressive_present_01",
    englishText: "\"Look! The baby ___ right now.\" Pick the correct form.",
    punjabiText: "\"ਵੇਖੋ! ਬੱਚਾ ਹੁਣੇ ___ ।\" ਸਹੀ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "is crawling", pa: "ਘੁੰਮ ਰਿਹਾ ਹੈ" },
      { en: "crawls", pa: "ਘੁੰਮਦਾ ਹੈ" },
      { en: "crawled", pa: "ਘੁੰਮਿਆ" }
    ],
    correctAnswer: "is crawling",
    explanation: { en: "'is crawling' is present progressive — action happening right now.", pa: "'is crawling' ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ ਹੈ — ਹੁਣੇ ਹੋ ਰਿਹਾ ਕੰਮ।" }
  },
  {
    lessonId: "L_SIMPLE_PAST_01",
    id: "gian_l_simple_past_01",
    englishText: "\"We ___ a movie last night.\" Pick the correct past form.",
    punjabiText: "\"ਅਸੀਂ ਕੱਲ੍ਹ ਰਾਤ ਫ਼ਿਲਮ ___ ।\" ਸਹੀ ਭੂਤਕਾਲ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "watched", pa: "ਵੇਖੀ" },
      { en: "watch", pa: "ਵੇਖਦੇ ਹਾਂ" },
      { en: "watches", pa: "ਵੇਖਦਾ ਹੈ" }
    ],
    correctAnswer: "watched",
    explanation: { en: "'watched' is the simple past — add -ed for regular verbs.", pa: "'watched' ਸਧਾਰਣ ਭੂਤਕਾਲ ਹੈ — ਨਿਯਮਿਤ ਕਿਰਿਆਵਾਂ ਵਿੱਚ -ed ਲੱਗਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PROGRESSIVE_PAST_01",
    id: "gian_l_progressive_past_01",
    englishText: "\"I ___ dinner when the phone rang.\" Pick the correct form.",
    punjabiText: "\"ਮੈਂ ਰਾਤ ਦਾ ਖਾਣਾ ___ ਜਦੋਂ ਫ਼ੋਨ ਵੱਜਿਆ।\" ਸਹੀ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "was cooking", pa: "ਬਣਾ ਰਿਹਾ ਸੀ" },
      { en: "cooked", pa: "ਬਣਾਇਆ" },
      { en: "am cooking", pa: "ਬਣਾ ਰਿਹਾ ਹਾਂ" }
    ],
    correctAnswer: "was cooking",
    explanation: { en: "'was cooking' is past progressive — background action when the phone rang.", pa: "'was cooking' ਭੂਤਕਾਲ ਜਾਰੀ ਹੈ — ਫ਼ੋਨ ਵੱਜਣ ਵੇਲੇ ਜਾਰੀ ਕੰਮ।" }
  },
  {
    lessonId: "L_SIMPLE_FUTURE_01",
    id: "gian_l_simple_future_01",
    englishText: "\"They ___ the match tomorrow.\" Pick the correct form.",
    punjabiText: "\"ਉਹ ਕੱਲ੍ਹ ਮੈਚ ___ ।\" ਸਹੀ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "will play", pa: "ਖੇਡਣਗੇ" },
      { en: "played", pa: "ਖੇਡੇ" },
      { en: "plays", pa: "ਖੇਡਦਾ ਹੈ" }
    ],
    correctAnswer: "will play",
    explanation: { en: "'will play' is simple future — will + base verb.", pa: "'will play' ਸਧਾਰਣ ਭਵਿੱਖ ਕਾਲ ਹੈ — will + ਮੂਲ ਕਿਰਿਆ।" }
  },
  {
    lessonId: "L_MODAL_VERBS_01",
    id: "gian_l_modal_verbs_01",
    englishText: "\"You ___ brush your teeth every night.\" Pick the best modal.",
    punjabiText: "\"ਤੁਹਾਨੂੰ ਹਰ ਰਾਤ ਦੰਦ ਸਾਫ਼ ___ ।\" ਸਭ ਤੋਂ ਵਧੀਆ ਸਹਾਇਕ ਚੁਣੋ।",
    options: [
      { en: "should", pa: "ਕਰਨੇ ਚਾਹੀਦੇ" },
      { en: "can", pa: "ਕਰ ਸਕਦੇ ਹੋ" },
      { en: "might", pa: "ਹੋ ਸਕਦਾ" }
    ],
    correctAnswer: "should",
    explanation: { en: "'should' gives advice — brushing teeth is a recommended habit.", pa: "'should' ਸਲਾਹ ਦਿੰਦਾ ਹੈ — ਦੰਦ ਸਾਫ਼ ਕਰਨਾ ਚੰਗੀ ਆਦਤ ਹੈ।" }
  },
  {
    lessonId: "L_ADJECTIVE_BASICS_01",
    id: "gian_l_adjective_basics_01",
    englishText: "Which word is the adjective? \"She wore a red dress.\"",
    punjabiText: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਿਸ਼ੇਸ਼ਣ ਹੈ? \"She wore a red dress.\"",
    options: [
      { en: "red", pa: "ਲਾਲ" },
      { en: "wore", pa: "ਪਾਈ" },
      { en: "dress", pa: "ਪੁਸ਼ਾਕ" }
    ],
    correctAnswer: "red",
    explanation: { en: "'red' is the adjective — it describes the colour of the dress.", pa: "'red' ਵਿਸ਼ੇਸ਼ਣ ਹੈ — ਇਹ ਪੁਸ਼ਾਕ ਦਾ ਰੰਗ ਦੱਸਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_ADJ_VS_ADV_01",
    id: "gian_l_adj_vs_adv_01",
    englishText: "\"The soup tastes ___.\" Pick the correct word.",
    punjabiText: "\"ਸੂਪ ਦਾ ਸੁਆਦ ___ ਹੈ।\" ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।",
    options: [
      { en: "delicious", pa: "ਸੁਆਦੀ" },
      { en: "deliciously", pa: "ਸੁਆਦੀ ਢੰਗ ਨਾਲ" },
      { en: "deliciousness", pa: "ਸੁਆਦ" }
    ],
    correctAnswer: "delicious",
    explanation: { en: "'tastes' is a linking verb — use an adjective, not an adverb, after it.", pa: "'tastes' ਜੋੜ ਕਿਰਿਆ ਹੈ — ਇਸ ਤੋਂ ਬਾਅਦ ਵਿਸ਼ੇਸ਼ਣ ਵਰਤੋ, ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ ਨਹੀਂ।" }
  },
  {
    lessonId: "L_COMPARATIVE_ADJECTIVES_01",
    id: "gian_l_comparative_adjectives_01",
    englishText: "\"This puzzle is ___ than the last one.\" Pick the correct form.",
    punjabiText: "\"ਇਹ ਪਹੇਲੀ ਪਿਛਲੀ ਨਾਲੋਂ ___ ਹੈ।\" ਸਹੀ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "harder", pa: "ਔਖੀ" },
      { en: "more hard", pa: "ਵੱਧ ਔਖੀ" },
      { en: "hardest", pa: "ਸਭ ਤੋਂ ਔਖੀ" }
    ],
    correctAnswer: "harder",
    explanation: { en: "'hard' is short — add -er for comparative: harder.", pa: "'hard' ਛੋਟਾ ਸ਼ਬਦ ਹੈ — ਤੁਲਨਾ ਲਈ -er ਲਗਾਓ: harder।" }
  },
  {
    lessonId: "L_SUPERLATIVE_ADJECTIVES_01",
    id: "gian_l_superlative_adjectives_01",
    englishText: "\"Mount Everest is ___ mountain in the world.\" Pick the correct form.",
    punjabiText: "\"ਮਾਊਂਟ ਐਵਰੈਸਟ ਦੁਨੀਆ ਦਾ ___ ਪਹਾੜ ਹੈ।\" ਸਹੀ ਰੂਪ ਚੁਣੋ।",
    options: [
      { en: "the tallest", pa: "ਸਭ ਤੋਂ ਉੱਚਾ" },
      { en: "taller", pa: "ਉੱਚਾ" },
      { en: "tallest", pa: "ਉੱਚਾ (ਬਿਨਾਂ the)" }
    ],
    correctAnswer: "the tallest",
    explanation: { en: "Superlatives need 'the' before them — 'the tallest'.", pa: "ਸਰਵੋਤਮ ਰੂਪ ਤੋਂ ਪਹਿਲਾਂ 'the' ਚਾਹੀਦਾ ਹੈ — 'the tallest'।" }
  },
  {
    lessonId: "L_PREPOSITION_BASICS_01",
    id: "gian_l_preposition_basics_01",
    englishText: "\"The keys are ___ the drawer.\" Pick the correct preposition.",
    punjabiText: "\"ਚਾਬੀਆਂ ਦਰਾਜ਼ ___ ਹਨ।\" ਸਹੀ ਸੰਬੰਧਕ ਚੁਣੋ।",
    options: [
      { en: "in", pa: "ਵਿੱਚ" },
      { en: "on", pa: "ਉੱਤੇ" },
      { en: "at", pa: "ਤੇ" }
    ],
    correctAnswer: "in",
    explanation: { en: "'in' shows position inside a container — the drawer.", pa: "'in' ਕਿਸੇ ਬੰਦ ਚੀਜ਼ ਅੰਦਰ ਹੋਣਾ ਦਰਸਾਉਂਦਾ ਹੈ — ਦਰਾਜ਼।" }
  },
  {
    lessonId: "L_PREP_PLACE_MOVE_01",
    id: "gian_l_prep_place_move_01",
    englishText: "\"The children ran ___ the field.\" Pick the correct preposition.",
    punjabiText: "\"ਬੱਚੇ ਮੈਦਾਨ ___ ਦੌੜੇ।\" ਸਹੀ ਸੰਬੰਧਕ ਚੁਣੋ।",
    options: [
      { en: "across", pa: "ਪਾਰ" },
      { en: "under", pa: "ਹੇਠਾਂ" },
      { en: "in", pa: "ਵਿੱਚ" }
    ],
    correctAnswer: "across",
    explanation: { en: "'across' shows movement from one side to the other.", pa: "'across' ਇੱਕ ਪਾਸੇ ਤੋਂ ਦੂਜੇ ਪਾਸੇ ਗਤੀ ਦਰਸਾਉਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_PREP_TIME_01",
    id: "gian_l_prep_time_01",
    englishText: "\"The train arrives ___ 5 o'clock.\" Pick the correct preposition.",
    punjabiText: "\"ਰੇਲ 5 ਵਜੇ ___ ਆਉਂਦੀ ਹੈ।\" ਸਹੀ ਸੰਬੰਧਕ ਚੁਣੋ।",
    options: [
      { en: "at", pa: "ਤੇ" },
      { en: "on", pa: "ਨੂੰ" },
      { en: "in", pa: "ਵਿੱਚ" }
    ],
    correctAnswer: "at",
    explanation: { en: "'at' is used for exact times — at 5 o'clock.", pa: "'at' ਪੱਕੇ ਸਮੇਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ — at 5 o'clock।" }
  },
  {
    lessonId: "L_CONJUNCTION_BASICS_01",
    id: "gian_l_conjunction_basics_01",
    englishText: "\"I studied hard ___ I wanted to pass.\" Pick the correct conjunction.",
    punjabiText: "\"ਮੈਂ ਸਖ਼ਤ ਪੜ੍ਹਾਈ ਕੀਤੀ ___ ਮੈਂ ਪਾਸ ਹੋਣਾ ਚਾਹੁੰਦਾ ਸੀ।\" ਸਹੀ ਯੋਜਕ ਚੁਣੋ।",
    options: [
      { en: "because", pa: "ਕਿਉਂਕਿ" },
      { en: "but", pa: "ਪਰ" },
      { en: "or", pa: "ਜਾਂ" }
    ],
    correctAnswer: "because",
    explanation: { en: "'because' shows reason — wanting to pass is the reason for studying.", pa: "'because' ਕਾਰਨ ਦੱਸਦਾ ਹੈ — ਪਾਸ ਹੋਣਾ ਪੜ੍ਹਾਈ ਦਾ ਕਾਰਨ ਹੈ।" }
  },
  {
    lessonId: "L_CONJ_JOINING_01",
    id: "gian_l_conj_joining_01",
    englishText: "\"Do you want tea ___ coffee?\" Pick the correct conjunction.",
    punjabiText: "\"ਤੁਸੀਂ ਚਾਹ ਲਓਗੇ ___ ਕੌਫ਼ੀ?\" ਸਹੀ ਯੋਜਕ ਚੁਣੋ।",
    options: [
      { en: "or", pa: "ਜਾਂ" },
      { en: "and", pa: "ਅਤੇ" },
      { en: "so", pa: "ਇਸ ਲਈ" }
    ],
    correctAnswer: "or",
    explanation: { en: "'or' shows a choice between two options.", pa: "'or' ਦੋ ਚੋਣਾਂ ਵਿੱਚੋਂ ਚੁਣਨਾ ਦਰਸਾਉਂਦਾ ਹੈ।" }
  },
  {
    lessonId: "L_ARTICLE_BASICS_01",
    id: "gian_l_article_basics_01",
    englishText: "\"She is ___ honest person.\" Pick the correct article.",
    punjabiText: "\"ਉਹ ___ ਇਮਾਨਦਾਰ ਇਨਸਾਨ ਹੈ।\" ਸਹੀ ਲੇਖ ਚੁਣੋ।",
    options: [
      { en: "an", pa: "an" },
      { en: "a", pa: "a" },
      { en: "the", pa: "the" }
    ],
    correctAnswer: "an",
    explanation: { en: "'honest' starts with a vowel sound (silent h), so use 'an'.", pa: "'honest' ਸਵਰ ਦੀ ਆਵਾਜ਼ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ (ਚੁੱਪ h), ਇਸ ਲਈ 'an' ਵਰਤੋ।" }
  },
  {
    lessonId: "L_INTERJECTIONS_01",
    id: "gian_l_interjections_01",
    englishText: "\"___ That hurt!\" Pick the best interjection.",
    punjabiText: "\"___ ਇਹ ਦੁੱਖਿਆ!\" ਸਭ ਤੋਂ ਵਧੀਆ ਵਿਸਮਿਕ ਚੁਣੋ।",
    options: [
      { en: "Ouch!", pa: "ਆਹ!" },
      { en: "Wow!", pa: "ਵਾਹ!" },
      { en: "Hello!", pa: "ਹੈਲੋ!" }
    ],
    correctAnswer: "Ouch!",
    explanation: { en: "'Ouch!' shows pain — the sentence says it hurt.", pa: "'Ouch!' ਦਰਦ ਦਰਸਾਉਂਦਾ ਹੈ — ਵਾਕ ਦੱਸਦਾ ਹੈ ਕਿ ਦੁੱਖਿਆ।" }
  },
  {
    lessonId: "L_SV_AGREEMENT_01",
    id: "gian_l_sv_agreement_01",
    englishText: "\"My sister ___ every morning.\" Pick the correct verb.",
    punjabiText: "\"ਮੇਰੀ ਭੈਣ ਹਰ ਸਵੇਰੇ ___ ।\" ਸਹੀ ਕਿਰਿਆ ਚੁਣੋ।",
    options: [
      { en: "jogs", pa: "ਦੌੜਦੀ ਹੈ" },
      { en: "jog", pa: "ਦੌੜਦੇ ਹਾਂ" },
      { en: "jogging", pa: "ਦੌੜ ਰਹੀ ਹੈ" }
    ],
    correctAnswer: "jogs",
    explanation: { en: "'sister' is singular — singular subject takes verb + s.", pa: "'sister' ਇੱਕ ਵਚਨ ਹੈ — ਇੱਕ ਵਚਨ ਕਰਤਾ ਨਾਲ ਕਿਰਿਆ + s ਆਉਂਦੀ ਹੈ।" }
  }
];

function buildGianStep(entry) {
  return {
    type: "gian_check",
    id: entry.id,
    englishText: entry.englishText,
    punjabiText: entry.punjabiText,
    options: entry.options,
    correctAnswer: entry.correctAnswer,
    points: 15,
    feedback: {
      correctEn: "Gian Level Up! 🌟",
      correctPa: "ਗਿਆਨ ਵਧਿਆ! 🌟",
      wrongEn: "Not quite — try again!",
      wrongPa: "ਬਿਲਕੁਲ ਨਹੀਂ — ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ!"
    },
    hint: entry.explanation,
    explanation: entry.explanation,
    correctOptionIndex: 0
  };
}

// Read file
const src = fs.readFileSync(LESSONS_PATH, 'utf8');
const lines = src.split('\n');

// For each lesson, find summary_bullets and insert before it
const insertions = [];
for (const entry of GIAN_DATA) {
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

  let nextLessonStart = lines.length;
  for (let i = lessonStart + 1; i < lines.length; i++) {
    if (/^\s+"L_/.test(lines[i]) && lines[i].includes('": {')) {
      nextLessonStart = i;
      break;
    }
  }

  // Find summary_bullets
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
    insertBeforeLine: openBrace,
    step: buildGianStep(entry)
  });
}

// Sort descending so line numbers don't shift
insertions.sort((a, b) => b.insertBeforeLine - a.insertBeforeLine);

let insertCount = 0;
for (const ins of insertions) {
  const stepJson = JSON.stringify(ins.step, null, 8);
  const indented = stepJson.split('\n').map(line => '      ' + line).join('\n');
  const insertion = indented + ',';
  const lineArr = insertion.split('\n');
  lines.splice(ins.insertBeforeLine, 0, ...lineArr);
  insertCount++;
}

fs.writeFileSync(LESSONS_PATH, lines.join('\n'), 'utf8');
console.log('Inserted ' + insertCount + ' gian_check steps.');
console.log('File written: ' + LESSONS_PATH);
