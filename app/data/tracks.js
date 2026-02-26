// -------------------- TRACKS --------------------
var TRACKS = {
  T_WORDS: {
    id: "T_WORDS",
    name: "Words & Names",
    descEn: "Nouns and pronouns – names of people, places, things, and words that replace them.",
    descPa: "ਨਾਂ ਅਤੇ ਸਰਵਨਾਮ – ਲੋਕਾਂ, ਥਾਵਾਂ, ਚੀਜ਼ਾਂ ਦੇ ਨਾਮ ਅਤੇ ਉਹ ਸ਼ਬਦ ਜੋ ਉਨ੍ਹਾਂ ਦੀ ਥਾਂ ਲੈਂਦੇ ਹਨ।"
  },
  T_ACTIONS: {
    id: "T_ACTIONS",
    name: "Actions & Time",
    descEn: "Verbs, adverbs, and simple tenses – what happens and when.",
    descPa: "ਕਿਰਿਆ, ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਾਲ – ਕੀ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਕਦੋਂ।"
  },
  T_DESCRIBE: {
    id: "T_DESCRIBE",
    name: "Describing Words",
    descEn: "Adjectives and adverbs that add detail and color.",
    descPa: "ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਜੋ ਵਾਕ ਨੂੰ ਹੋਰ ਸਾਫ਼ ਅਤੇ ਦਿਲਚਸਪ ਬਣਾਉਂਦੇ ਹਨ।"
  },
  T_SENTENCE: {
    id: "T_SENTENCE",
    name: "Sentence Building",
    descEn: "Prepositions, conjunctions, articles, and subject–verb agreement.",
    descPa: "ਪੂਰਵ-ਬੋਧਕ, ਸੰਯੋਜਕ, ਲੇਖ ਅਤੇ ਕਿਰਿਆ ਦਾ ਸਹੀ ਰੂਪ – ਪੂਰੇ ਵਾਕ ਬਣਾਉਣ ਲਈ।"
  },
  T_READING: {
    id: "T_READING",
    name: "Reading & Stories",
    descEn: "Short bilingual passages to practice reading and understanding.",
    descPa: "ਛੋਟੀਆਂ ਕਹਾਣੀਆਂ ਅਤੇ ਪੈਸੇਜ – ਪੜ੍ਹਨ ਅਤੇ ਸਮਝਣ ਲਈ।"
  }
};

// -------------------- LESSON METADATA --------------------
var LESSON_META = [
  // One Learning Path (Punjabi-native beginner progression, age 5–7)
  { id: "L_NOUNS_BASICS_01", labelEn: "Noun Basics", labelPa: "ਨਾਂ ਮੁੱਢ", trackId: "T_WORDS", difficulty: 1, order: 1 },
  { id: "L_NOUNS_COMMON_01", labelEn: "Nouns: Common Basics", labelPa: "ਨਾਂ: ਆਮ ਮੁੱਢਲਾ", trackId: "T_WORDS", difficulty: 1, order: 2 },
  { id: "L_NOUNS_PROPER_01", labelEn: "Nouns: Proper Names", labelPa: "ਨਾਂ: ਖ਼ਾਸ ਨਾਂ", trackId: "T_WORDS", difficulty: 1, order: 3 },
  { id: "L_PRONOUNS_BASICS_01", labelEn: "Pronoun Basics", labelPa: "ਸਰਵਨਾਮ ਮੁੱਢ", trackId: "T_WORDS", difficulty: 1, order: 4 },
  { id: "L_PRONOUNS_PERSONAL_01", labelEn: "Pronouns: Personal", labelPa: "ਸਰਵਨਾਮ: ਵਿਅਕਤੀਵਾਚਕ", trackId: "T_WORDS", difficulty: 1, order: 5 },
  { id: "L_SINGULAR_PLURAL_01", labelEn: "Singular & Plural", labelPa: "ਇਕਵਚਨ / ਬਹੁਵਚਨ", trackId: "T_WORDS", difficulty: 1, order: 6 },
  { id: "L_NOUNS_PLURALS_POSSESSION_01", labelEn: "Nouns: Plurals & Possession", labelPa: "ਨਾਂ: ਬਹੁਵਚਨ ਅਤੇ ਮਾਲਕੀ", trackId: "T_WORDS", difficulty: 2, order: 7 },
  { id: "L_POSSESSIVE_NOUNS_01", labelEn: "Possessive Nouns", labelPa: "ਮਾਲਕਾਨਾ ਨਾਂ", trackId: "T_WORDS", difficulty: 2, order: 8 },
  { id: "L_POSSESSIVE_PRONOUNS_01", labelEn: "Possessive Pronouns", labelPa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ", trackId: "T_WORDS", difficulty: 2, order: 9 },

  { id: "L_VERBS_BASICS_01", labelEn: "Verbs: Basics", labelPa: "ਕਿਰਿਆ: ਮੁੱਢਲੇ", trackId: "T_ACTIONS", difficulty: 1, order: 10 },
  { id: "L_ADVERB_BASICS_01", labelEn: "Adverb Basics", labelPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਮੁੱਢ", trackId: "T_ACTIONS", difficulty: 1, order: 11 },
  { id: "L_SIMPLE_PRESENT_01", labelEn: "Simple Present", labelPa: "ਸਧਾਰਣ ਵਰਤਮਾਨ", trackId: "T_ACTIONS", difficulty: 1, order: 12 },
  { id: "L_PROGRESSIVE_PRESENT_01", labelEn: "Present Progressive", labelPa: "ਵਰਤਮਾਨ ਜਾਰੀ", trackId: "T_ACTIONS", difficulty: 2, order: 13 },
  { id: "L_SIMPLE_PAST_01", labelEn: "Simple Past", labelPa: "ਸਧਾਰਣ ਭੂਤਕਾਲ", trackId: "T_ACTIONS", difficulty: 2, order: 14 },
  { id: "L_PROGRESSIVE_PAST_01", labelEn: "Past Progressive", labelPa: "ਭੂਤਕਾਲੀ ਜਾਰੀ", trackId: "T_ACTIONS", difficulty: 2, order: 15 },
  { id: "L_SIMPLE_FUTURE_01", labelEn: "Simple Future", labelPa: "ਸਧਾਰਣ ਭਵਿੱਖ", trackId: "T_ACTIONS", difficulty: 2, order: 16 },
  { id: "L_MODAL_VERBS_01", labelEn: "Modal Verbs", labelPa: "ਮੋਡਲ ਕਿਰਿਆਵਾਂ", trackId: "T_ACTIONS", difficulty: 2, order: 17 },

  { id: "L_ADJECTIVE_BASICS_01", labelEn: "Adjective Basics", labelPa: "ਵਿਸ਼ੇਸ਼ਣ ਮੁੱਢ", trackId: "T_DESCRIBE", difficulty: 1, order: 18 },
  { id: "L_ADJ_VS_ADV_01", labelEn: "Adjectives vs Adverbs", labelPa: "ਵਿਸ਼ੇਸ਼ਣ ਵਸ. ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ", trackId: "T_DESCRIBE", difficulty: 2, order: 19 },
  { id: "L_COMPARATIVE_ADJECTIVES_01", labelEn: "Comparative Adjectives", labelPa: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ", trackId: "T_DESCRIBE", difficulty: 2, order: 20 },
  { id: "L_SUPERLATIVE_ADJECTIVES_01", labelEn: "Superlative Adjectives", labelPa: "ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ", trackId: "T_DESCRIBE", difficulty: 2, order: 21 },

  { id: "L_PREPOSITION_BASICS_01", labelEn: "Preposition Basics", labelPa: "ਪੂਰਵ-ਬੋਧਕ ਮੁੱਢ", trackId: "T_SENTENCE", difficulty: 1, order: 22 },
  { id: "L_PREP_PLACE_MOVE_01", labelEn: "Prepositions: Place/Movement", labelPa: "ਪੂਰਵ-ਬੋਧਕ: ਥਾਂ/ਹਿਲਚਲ", trackId: "T_SENTENCE", difficulty: 1, order: 23 },
  { id: "L_PREP_TIME_01", labelEn: "Prepositions: Time", labelPa: "ਪੂਰਵ-ਬੋਧਕ: ਸਮਾਂ", trackId: "T_SENTENCE", difficulty: 2, order: 24 },
  { id: "L_CONJUNCTION_BASICS_01", labelEn: "Conjunction Basics", labelPa: "ਸੰਯੋਜਕ ਮੁੱਢ", trackId: "T_SENTENCE", difficulty: 1, order: 25 },
  { id: "L_CONJ_JOINING_01", labelEn: "Conjunctions: Joining Ideas", labelPa: "ਸੰਯੋਜਕ: ਖ਼ਿਆਲ ਜੋੜਨਾ", trackId: "T_SENTENCE", difficulty: 1, order: 26 },
  { id: "L_ARTICLE_BASICS_01", labelEn: "Article Basics", labelPa: "ਲੇਖ ਮੁੱਢ", trackId: "T_SENTENCE", difficulty: 1, order: 27 },
  { id: "L_INTERJECTIONS_01", labelEn: "Interjections: Feelings", labelPa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ: ਭਾਵਨਾ", trackId: "T_SENTENCE", difficulty: 1, order: 28 },
  { id: "L_SV_AGREEMENT_01", labelEn: "Subject–Verb Agreement", labelPa: "ਕਰਤਾ–ਕਿਰਿਆ ਸਹਿਮਤੀ", trackId: "T_SENTENCE", difficulty: 2, order: 29 },
  { id: "L_IRREGULAR_VERBS_01", labelEn: "Irregular Verbs", labelPa: "ਅਨਿਯਮਤ ਕਿਰਿਆਵਾਂ", trackId: "T_ACTIONS", difficulty: 2, order: 30 },
  { id: "L_QUESTION_FORMATION_01", labelEn: "Question Formation", labelPa: "ਸਵਾਲ ਬਣਾਉਣਾ", trackId: "T_SENTENCE", difficulty: 2, order: 31 },
  { id: "L_NEGATIVE_SENTENCES_01", labelEn: "Negative Sentences", labelPa: "ਨਾਂਹ-ਵਾਚਕ ਵਾਕ", trackId: "T_SENTENCE", difficulty: 2, order: 32 }
];
