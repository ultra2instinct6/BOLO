// ===== NORMALIZED LESSONS (CANONICAL) =====
var LESSONS = {};

// -------------------- RAW / LEGACY LESSON CONTENT (SOURCE) --------------------
// NOTE: This block preserves the original mixed schemas (arrays, L_* objects, tutorials).
// The canonical LESSONS object is generated from this raw data at the bottom of this file.
var __RAW_LESSONS = {
  noun: [
    { step_type: "definition", english_text: "A noun is a word for a person, place, animal, or thing.", punjabi_text: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਕਿਸੇ ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਨਵਰ ਜਾਂ ਚੀਜ਼ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
    { step_type: "example", english_text: "The <mark>cat</mark> is on the bed.", punjabi_text: "\"cat\" ਜਾਨਵਰ ਦਾ ਨਾਮ ਹੈ।" },
    { step_type: "question", english_text: "Tap the noun.", punjabi_text: "ਨਾਮ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["cat", "is", "on"], correct_answer: "cat" },
    { step_type: "example", english_text: "My <mark>brother</mark> is at school.", punjabi_text: "\"brother\" ਵਿਅਕਤੀ ਦਾ ਨਾਮ ਹੈ।" },
    { step_type: "question", english_text: "Tap the noun.", punjabi_text: "ਨਾਮ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["brother", "is", "at"], correct_answer: "brother" },
    { step_type: "example", english_text: "We went to the <mark>park</mark>.", punjabi_text: "\"park\" ਥਾਂ ਦਾ ਨਾਮ ਹੈ।" },
    { step_type: "question", english_text: "Tap the noun.", punjabi_text: "ਨਾਮ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["We", "went", "park"], correct_answer: "park" }
  ],
  pronoun: [
    { step_type: "definition", english_text: "A pronoun is a word that takes the place of a noun, like he, she, it, we, they.", punjabi_text: "ਸਰਵਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਨਾਮ ਦੀ ਥਾਂ ਲੱਗਦਾ ਹੈ, ਜਿਵੇਂ he, she, it, we, they।" },
    { step_type: "question",
      english_text: "Tap the pronoun.",
      punjabi_text: "ਸਰਵਨਾਮ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      options: ["friend", "She", "my"],
      correct_answer: "She",
      examples: [
        {
          sentenceEn: "She is my friend.",
          sentencePa: "ਉਹ ਮੇਰੀ ਸਹेली ਹੈ।",
          explainEn: "'She' replaces the girl's name (pronoun).",
          explainPa: "'She' ਲੜਕੀ ਦਾ ਨਾਮ ਬਦਲਦਾ ਹੈ (ਸਰਵਨਾਮ)।",
          highlight: "She"
        },
        {
          sentenceEn: "They are playing outside.",
          sentencePa: "ਉਹ ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।",
          explainEn: "'They' replaces multiple people (pronoun).",
          explainPa: "'They' ਕਈ ਲੋਕਾਂ ਦੀ ਥਾਂ ਲੈਂਦਾ ਹੈ (ਸਰਵਨਾਮ)।",
          highlight: "They"
        }
      ]
    }
  ],
  plural_singular: [
    { step_type: "definition", english_text: "Singular means one. Plural means more than one.", punjabi_text: "ਏਕ ਵਚਨ ਇੱਕ ਚੀਜ਼ ਲਈ, ਬਹੁ ਵਚਨ ਇੱਕ ਤੋਂ ਵੱਧ ਚੀਜ਼ਾਂ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },
    { step_type: "example", english_text: "One <mark>book</mark>, many <mark>books</mark>.", punjabi_text: "\"book\" ਏਕ ਵਚਨ ਹੈ, \"books\" ਬਹੁ ਵਚਨ ਹੈ।" },
    { step_type: "question", english_text: "Tap the plural word.", punjabi_text: "ਬਹੁ ਵਚਨ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["book", "books", "a"], correct_answer: "books" },
    { step_type: "example", english_text: "One <mark>child</mark>, many <mark>children</mark>.", punjabi_text: "\"child\" ਇੱਕ ਬੱਚਾ, \"children\" ਕਈ ਬੱਚੇ।" },
    { step_type: "question", english_text: "Tap the singular word.", punjabi_text: "ਏਕ ਵਚਨ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["children", "child", "many"], correct_answer: "child" }
  ],
  verb: [
    { step_type: "definition", english_text: "A verb is a word that shows action or a state of being.", punjabi_text: "ਕਿਰਿਆ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਕੰਮ ਜਾਂ ਹਾਲਤ ਦੱਸਦਾ ਹੈ, ਜਿਵੇਂ run, eat, is।" },
    { step_type: "example", english_text: "The dog <mark>runs</mark> fast.", punjabi_text: "\"runs\" ਦੱਸਦਾ ਹੈ ਕਿ ਕੁੱਤਾ ਕੀ ਕਰ ਰਿਹਾ ਹੈ, ਇਹ ਕਿਰਿਆ ਹੈ।" },
    { step_type: "question", english_text: "Tap the verb.", punjabi_text: "ਕਿਰਿਆ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["dog", "runs", "fast"], correct_answer: "runs" },
    { step_type: "example", english_text: "She <mark>is</mark> happy.", punjabi_text: "\"is\" ਹਾਲਤ ਦੱਸਣ ਵਾਲਾ ਕਿਰਿਆ-ਸ਼ਬਦ ਹੈ।" },
    { step_type: "question", english_text: "Tap the verb.", punjabi_text: "ਕਿਰਿਆ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["She", "is", "happy"], correct_answer: "is" }
  ],
  adverb: [
    { step_type: "definition", english_text: "An adverb tells how, when, or where an action happens, like quickly, yesterday, here.", punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਦੱਸਦਾ ਹੈ ਕੰਮ ਕਿਵੇਂ, ਕਦੋਂ ਜਾਂ ਕਿੱਥੇ ਹੁੰਦਾ ਹੈ।" },
    { step_type: "example", english_text: "She sings <mark>softly</mark>.", punjabi_text: "\"softly\" ਦੱਸਦਾ ਹੈ ਕਿ ਉਹ ਕਿਵੇਂ ਗਾਂਦੀ ਹੈ, ਇਹ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।" },
    { step_type: "question", english_text: "Tap the adverb.", punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["She", "sings", "softly"], correct_answer: "softly" },
    { step_type: "example", english_text: "He came <mark>yesterday</mark>.", punjabi_text: "\"yesterday\" ਦੱਸਦਾ ਹੈ ਕਿ ਕਦੋਂ ਆਇਆ, ਇਹ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।" },
    { step_type: "question", english_text: "Tap the adverb.", punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["He", "came", "yesterday"], correct_answer: "yesterday" }
  ],
  tense_present: [
    { step_type: "definition", english_text: "Simple present tells about actions that happen regularly or are true now.", punjabi_text: "ਸਧਾਰਣ ਵਰਤਮਾਨ ਉਹ ਕੰਮ ਦੱਸਦਾ ਹੈ ਜੋ ਰੋਜ਼ ਹੁੰਦਾ ਹੈ ਜਾਂ ਇਸ ਸਮੇਂ ਸੱਚ ਹੈ।" },
    { step_type: "example", english_text: "She <mark>walks</mark> to school every day.", punjabi_text: "\"walks\" ਰੋਜ਼ ਹੋਣ ਵਾਲਾ ਕੰਮ ਹੈ, ਸਧਾਰਣ ਵਰਤਮਾਨ।" },
    { step_type: "question", english_text: "Which verb is in simple present?", punjabi_text: "ਕਿਹੜੀ ਕਿਰਿਆ ਸਧਾਰਣ ਵਰਤਮਾਨ ਵਿੱਚ ਹੈ?", options: ["walks", "walked", "will walk"], correct_answer: "walks" }
  ],
  tense_past: [
    { step_type: "definition", english_text: "Simple past tells about actions that happened before.", punjabi_text: "ਸਧਾਰਣ ਭੂਤਕਾਲ ਉਹ ਕੰਮ ਦੱਸਦਾ ਹੈ ਜੋ ਪਹਿਲਾਂ ਹੋ ਚੁੱਕਿਆ ਹੈ।" },
    { step_type: "example", english_text: "They <mark>played</mark> football yesterday.", punjabi_text: "\"played\" ਪਿਤਾ ਹੋਏ ਕੰਮ ਨੂੰ ਦੱਸਦਾ ਹੈ, ਭੂਤਕਾਲ।" },
    { step_type: "question", english_text: "Which verb is in simple past?", punjabi_text: "ਕਿਹੜੀ ਕਿਰਿਆ ਭੂਤਕਾਲ ਹੈ?", options: ["play", "played", "will play"], correct_answer: "played" }
  ],
  tense_future: [
    { step_type: "definition", english_text: "Simple future tells about actions that will happen later.", punjabi_text: "ਸਧਾਰਣ ਭਵਿੱਖ ਉਹ ਕੰਮ ਦੱਸਦਾ ਹੈ ਜੋ ਅੱਗੇ ਹੋਵੇਗਾ।" },
    { step_type: "example", english_text: "We <mark>will visit</mark> the zoo tomorrow.", punjabi_text: "\"will visit\" ਭਵਿੱਖ ਦਾ ਕੰਮ ਦੱਸਦਾ ਹੈ।" },
    { step_type: "question", english_text: "Which verb is in simple future?", punjabi_text: "ਕਿਹੜੀ ਕਿਰਿਆ ਭਵਿੱਖ ਦੱਸਦੀ ਹੈ?", options: ["visit", "visited", "will visit"], correct_answer: "will visit" }
  ],
  adjective: [
    { step_type: "definition", english_text: "An adjective is a word that describes a noun, like big, red, happy.", punjabi_text: "ਵਿਸ਼ੇਸ਼ਣ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਨਾਮ ਦੀ ਖਾਸੀਅਤ ਦੱਸਦਾ ਹੈ, ਜਿਵੇਂ ਵੱਡਾ, ਲਾਲ, ਖੁਸ਼।" },
    { step_type: "example", english_text: "It is a <mark>big</mark> house.", punjabi_text: "\"big\" ਘਰ ਦਾ ਆਕਾਰ ਦੱਸਦਾ ਹੈ, ਇਹ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।" },
    { step_type: "question", english_text: "Tap the adjective.", punjabi_text: "ਵਿਸ਼ੇਸ਼ਣ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["house", "big", "It"], correct_answer: "big" },
    { step_type: "example", english_text: "She has a <mark>red</mark> bag.", punjabi_text: "\"red\" ਰੰਗ ਦੱਸਦਾ ਹੈ, ਇਹ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।" },
    { step_type: "question", english_text: "Tap the adjective.", punjabi_text: "ਵਿਸ਼ੇਸ਼ਣ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["red", "bag", "has"], correct_answer: "red" }
  ],
  preposition: [
    { step_type: "definition", english_text: "A preposition shows the relationship of a noun or pronoun to another word, like in, on, under.", punjabi_text: "ਪੂਰਵ-ਬੋਧਕ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਨਾਮ/ਸਰਵਨਾਮ ਦਾ ਦੂਜੇ ਸ਼ਬਦ ਨਾਲ ਸੰਬੰਧ ਦੱਸਦਾ ਹੈ, ਜਿਵੇਂ in, on, under।" },
    { step_type: "example", english_text: "The ball is <mark>under</mark> the table.", punjabi_text: "\"under\" ਦੱਸਦਾ ਹੈ ਕਿ ਗੇਂਦ ਮੇਜ਼ ਦੇ ਹੇਠਾਂ ਹੈ।" },
    { step_type: "question", english_text: "Tap the preposition.", punjabi_text: "ਪੂਰਵ-ਬੋਧਕ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["ball", "under", "table"], correct_answer: "under" }
  ],
  conjunction: [
    { step_type: "definition", english_text: "A conjunction joins words or sentences, like and, but, or.", punjabi_text: "ਸੰਯੋਜਕ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਦੋ ਸ਼ਬਦਾਂ ਜਾਂ ਵਾਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ, ਜਿਵੇਂ and, but, or।" },
    { step_type: "example", english_text: "I like apples <mark>and</mark> bananas.", punjabi_text: "\"and\" ਦੋ ਚੀਜ਼ਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ, ਇਹ ਸੰਯੋਜਕ ਹੈ।" },
    { step_type: "question", english_text: "Tap the conjunction.", punjabi_text: "ਸੰਯੋਜਕ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["apples", "and", "bananas"], correct_answer: "and" }
  ],
  interjection: [
    { step_type: "definition", english_text: "An interjection is a short word that shows strong feeling, like wow, oh no, hooray.", punjabi_text: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਛੋਟਾ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਅਚਾਨਕ ਭਾਵਨਾ ਦੱਸਦਾ ਹੈ, ਜਿਵੇਂ wow, oh no, hooray।" },
    { step_type: "example", english_text: "<mark>Wow</mark>, this cake is tasty!", punjabi_text: "\"Wow\" ਹੈਰਾਨੀ ਅਤੇ ਖੁਸ਼ੀ ਦੱਸਦਾ ਹੈ, ਇਹ ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਹੈ।" },
    { step_type: "question", english_text: "Tap the interjection.", punjabi_text: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["Wow", "cake", "tasty"], correct_answer: "Wow" }
  ],
  article: [
    { step_type: "definition", english_text: "An article is a small word used before a noun: a, an, or the.", punjabi_text: "ਲੇਖ ਛੋਟਾ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਨਾਮ ਤੋਂ ਪਹਿਲਾਂ ਲਗਦਾ ਹੈ: a, an, the।" },
    { step_type: "example", english_text: "This is <mark>a</mark> cat.", punjabi_text: "\"a\" ਇੱਕ ਬਿੱਲੀ ਲਈ ਵਰਤਿਆ ਲੇਖ ਹੈ।" },
    { step_type: "question", english_text: "Tap the article.", punjabi_text: "ਲੇਖ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["cat", "This", "a"], correct_answer: "a" },
    { step_type: "example", english_text: "Open <mark>the</mark> door, please.", punjabi_text: "\"the\" ਖ਼ਾਸ ਦਰਵਾਜ਼ੇ ਲਈ ਵਰਤਿਆ ਲੇਖ ਹੈ।" },
    { step_type: "question", english_text: "Tap the article.", punjabi_text: "ਲੇਖ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["Open", "door", "the"], correct_answer: "the" }
  ],
  sv_agreement: [
    { step_type: "definition", english_text: "Subject–verb agreement means the verb must match the subject (one vs many).", punjabi_text: "ਕਰਤਾ–ਕਿਰਿਆ ਸਹਿਮਤੀ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਕਰਤਾ ਇੱਕ ਹੋਵੇ ਜਾਂ ਕਈ, ਕਿਰਿਆ ਉਸ ਦੇ ਨਾਲ ਮੇਲ ਖਾਏ।" },
    { step_type: "example", english_text: "<mark>He runs</mark> fast. (correct)\nHe run fast. (wrong)", punjabi_text: "\"He runs\" ਠੀਕ ਹੈ ਕਿਉਂਕਿ he ਏਕ ਵਚਨ ਹੈ, ਇਸ ਲਈ runs ਆਇਆ ਹੈ।" },
    { step_type: "question", english_text: "Tap the correct sentence.", punjabi_text: "ਸਹੀ ਵਾਕ 'ਤੇ ਟੈਪ ਕਰੋ।", options: ["They walks to school.", "They walk to school."], correct_answer: "They walk to school." }
  ],
  
  // ===== NEW FORMAT: Example lesson with enhanced pedagogy =====
  L_EXAMPLE_NEW_FORMAT: {
    metadata: {
      titleEn: "Nouns - Example Lesson",
      titlePa: "ਨਾਮ - ਉਦਾਹਰਨ ਪਾਠ",
      labelEn: "Nouns (New Format)",
      labelPa: "ਨਾਮ (ਨਿਆ ਢੰਗ)",
      trackId: "T_WORDS",
      objective: {
        titleEn: "Learn: What Are Nouns?",
        titlePa: "ਸਿੱਖੋ: ਨਾਮ ਕੀ ਹਨ?",
        descEn: "Identify nouns in sentences and understand how they work",
        descPa: "ਵਾਕਾਂ ਵਿੱਚ ਨਾਮ ਨੂੰ ਪਛਾਣ ਕਰੋ ਅਤੇ ਸਮਝੋ ਕਿ ਉਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ",
        pointsAvailable: 15
      },
      difficulty: 1
    },
    steps: [
      {
        type: "definition",
        contentEn: "A noun is a word that names a person, place, animal, or thing.",
        contentPa: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ ਜੋ ਕਿਸੇ ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਨਵਰ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਮ ਹੁੰਦਾ ਹੈ।",
        points: 1
      },
      {
        type: "example",
        exampleEn: "The cat is sleeping on the bed.",
        examplePa: "ਬਿੱਲੀ ਬਿਸਤਰੇ 'ਤੇ ਸੋ ਰਹੀ ਹੈ।",
        highlightedWords: ["cat", "bed"],
        points: 1
      },
      {
        type: "guided_practice",
        sentenceEn: "The teacher gave a book to the student.",
        sentencePa: "ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀ ਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।",
        clickableWords: ["teacher", "book", "student"],
        correctAnswers: ["teacher", "book", "student"],
        feedbackCorrect: "Perfect! You found all 3 nouns! / ਸ਼ਾਨਦਾਰ! ਤੁਸੀਂ ਸਾਰੇ 3 ਨਾਮ ਲੱਭ ਗਏ!",
        points: 3
      },
      {
        type: "question",
        englishText: "Which word is a noun?",
        punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਮ ਹੈ?",
        options: ["run", "quick", "dog", "very"],
        correctAnswer: "dog",
        points: 5
      },
      {
        type: "example",
        exampleEn: "Sarah visited Paris during her vacation.",
        examplePa: "ਸਾਰਾਹ ਨੇ ਆਪਣੀ ਛੁੱਟੀ ਦੌਰਾਨ ਪੈਰਿਸ ਦਾ ਦੌਰਾ ਕੀਤਾ।",
        highlightedWords: ["Sarah", "Paris"],
        points: 1
      },
      {
        type: "guided_practice",
        sentenceEn: "The doctor examined the patient in the hospital.",
        sentencePa: "ਡਾਕਟਰ ਨੇ ਹਸਪਤਾਲ ਵਿੱਚ ਮਰੀਜ਼ ਦੀ ਜਾਂਚ ਕੀਤੀ।",
        clickableWords: ["doctor", "patient", "hospital"],
        correctAnswers: ["doctor", "patient", "hospital"],
        feedbackCorrect: "Excellent! You identified all the nouns correctly! / ਸ਼ਾਨਦਾਰ! ਤੁਸੀਂ ਸਾਰੇ ਨਾਮ ਸਹੀ ਤਰ੍ਹਾਂ ਪਛਾਣ ਲਿਏ!",
        points: 3
      },
      {
        type: "question",
        englishText: "Tap the sentence with the most nouns.",
        punjabi_text: "ਸਭ ਤੋਂ ਵੱਧ ਨਾਮਾਂ ਵਾਲਾ ਵਾਕ ਟੈਪ ਕਰੋ।",
        options: ["Dogs run fast.", "The boy found a book in the library."],
        correctAnswer: "The boy found a book in the library.",
        points: 5
      },
      {
        type: "summary",
        titleEn: "You've Mastered Nouns!",
        titlePa: "ਤੁਸੀਂ ਨਾਮਾਂ ਨੂੰ ਸਮਝ ਗਏ!",
        summaryEn: "Nouns are words that name people, places, animals, and things. They are essential building blocks of sentences.",
        summaryPa: "ਨਾਮ ਉਹ ਸ਼ਬਦ ਹਨ ਜੋ ਲੋਕਾਂ, ਥਾਵਾਂ, ਜਾਨਵਰਾਂ ਅਤੇ ਚੀਜ਼ਾਂ ਦਾ ਨਾਮ ਰੱਖਦੇ ਹਨ। ਉਹ ਵਾਕਾਂ ਦੇ ਬੁਨਿਆਦੀ ਬਲਾਕ ਹਨ।",
        keyExamplesEn: ["person: teacher, doctor, student", "place: Paris, school, hospital", "animal: cat, dog, bird", "thing: book, table, pen"],
        keyExamplesPa: ["ਵਿਅਕਤੀ: ਅਧਿਆਪਕ, ਡਾਕਟਰ, ਵਿਦਿਆਰਥੀ", "ਥਾਂ: ਪੈਰਿਸ, ਸਕੂਲ, ਹਸਪਤਾਲ", "ਜਾਨਵਰ: ਬਿੱਲੀ, ਕੁੱਤਾ, ਪੰਛੀ", "ਚੀਜ਼: ਕਿਤਾਬ, ਮੇਜ਼, ਕਲਮ"],
        totalPoints: 18
      }
    ]
  }};

// -------------------- PILOT NEW-FORMAT LESSONS (Batch 1,4,5) --------------------
// L_NOUNS_COMMON_01 — Common nouns basics
__RAW_LESSONS["L_NOUNS_COMMON_01"] = {
  metadata: {
    titleEn: "Nouns: Common Basics",
    titlePa: "ਨਾਂ: ਸਧਾਰਣ ਮੁੱਢਲਾ",
    labelEn: "Nouns: Common Basics",
    labelPa: "ਨਾਂ: ਸਧਾਰਣ ਮੁੱਢਲਾ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Common Nouns",
      titlePa: "ਸਿੱਖੋ: ਸਧਾਰਣ ਨਾਂ",
      descEn: "Identify common nouns in simple sentences and daily life.",
      descPa: "ਸਧਾਰਣ ਵਾਕਾਂ ਅਤੇ ਰੋਜ਼ਾਨਾ ਜੀਵਨ ਵਿੱਚ ਸਧਾਰਣ ਨਾਂ ਪਛਾਣੋ।",
      pointsAvailable: 15
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "A common noun is a general name for a person, place, or thing (like teacher, city, book).",
      contentPa: "ਸਧਾਰਣ ਨਾਂ ਇੱਕ ਆਮ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ (ਜਿਵੇਂ ਅਧਿਆਪਕ, ਸ਼ਹਿਰ, ਕਿਤਾਬ)।", points: 1 },
    { type: "example", exampleEn: "The teacher helps the students.", examplePa: "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਮਦਦ ਕਰਦਾ ਹੈ।", highlightedWords: ["teacher"], points: 1 },
    { type: "question", english_text: "Which word is a common noun?", punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਧਾਰਣ ਨਾਂ ਹੈ?",
      options: ["teacher", "London", "Gurpreet", "Monday"], correctAnswer: "teacher", points: 5,
      examples: [
        { sentenceEn: "The teacher helps the students.", sentencePa: "ਅਧਿਆਪਕ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਮਦਦ ਕਰਦਾ ਹੈ।", explainEn: "\"Teacher\" is a general job word.", explainPa: "\"ਅਧਿਆਪਕ\" ਇੱਕ ਆਮ ਪੇਸ਼ੇ ਦਾ ਨਾਂ ਹੈ।", highlight: "teacher" },
        { sentenceEn: "A teacher can work in many schools.", sentencePa: "ਇੱਕ ਅਧਿਆਪਕ ਕਈ ਸਕੂਲਾਂ ਵਿੱਚ ਕੰਮ ਕਰ ਸਕਦਾ ਹੈ।", explainEn: "Common nouns are general.", explainPa: "ਸਧਾਰਣ ਨਾਂ ਆਮ ਹੁੰਦੇ ਹਨ।", highlight: "teacher" }
      ]
    },
    { type: "question", english_text: "In the sentence ‘The dog is sleeping.’ which word is the common noun?",
      punjabi_text: "ਵਾਕ ‘The dog is sleeping.’ ਵਿੱਚ ਕਿਹੜਾ ਸ਼ਬਦ ਸਧਾਰਣ ਨਾਂ ਹੈ?",
      options: ["dog", "sleeping", "is", "The"], correctAnswer: "dog", points: 5,
      examples: [
        { sentenceEn: "The dog is sleeping on the floor.", sentencePa: "ਕੁੱਤਾ ਫਰਸ਼ ਤੇ ਸੋ ਰਿਹਾ ਹੈ।", explainEn: "\"Dog\" is a general animal.", explainPa: "\"ਕੁੱਤਾ\" ਇੱਕ ਆਮ ਜਾਨਵਰ ਹੈ।", highlight: "dog" },
        { sentenceEn: "That dog is very friendly.", sentencePa: "ਉਹ ਕੁੱਤਾ ਬਹੁਤ ਦੋਸਤਾਨਾ ਹੈ।", explainEn: "Common noun fits many dogs.", explainPa: "ਸਧਾਰਣ ਨਾਂ ਕਈ ਕੁੱਤਿਆਂ ਲਈ।", highlight: "dog" }
      ]
    },
    { type: "question", english_text: "Which word is a common noun?", punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਧਾਰਣ ਨਾਂ ਹੈ?",
      options: ["city", "Amritsar", "Punjab", "Mr. Khan"], correctAnswer: "city", points: 5,
      examples: [
        { sentenceEn: "This city is busy.", sentencePa: "ਇਹ ਸ਼ਹਿਰ ਰੁੱਝਿਆ ਹੋਇਆ ਹੈ।", explainEn: "\"City\" is general place word.", explainPa: "\"ਸ਼ਹਿਰ\" ਆਮ ਥਾਂ ਦਾ ਸ਼ਬਦ।", highlight: "city" }
      ]
    }
  ]
};

// L_NOUNS_PROPER_01 — Proper nouns basics
__RAW_LESSONS["L_NOUNS_PROPER_01"] = {
  metadata: {
    titleEn: "Nouns: Proper Names",
    titlePa: "ਨਾਂ: ਖ਼ਾਸ ਨਾਮ",
    labelEn: "Nouns: Proper Names",
    labelPa: "ਨਾਂ: ਖ਼ਾਸ ਨਾਮ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Proper Nouns",
      titlePa: "ਸਿੱਖੋ: ਖ਼ਾਸ ਨਾਮ",
      descEn: "Identify specific names of people and places (capitalized in English).",
      descPa: "ਵਿਅਕਤੀਆਂ ਅਤੇ ਥਾਵਾਂ ਦੇ ਖ਼ਾਸ ਨਾਮ ਪਛਾਣੋ (ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੱਡੇ ਅੱਖਰ ਨਾਲ)।",
      pointsAvailable: 12
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "A proper noun is a specific name (like Gurpreet, Amritsar, India).",
      contentPa: "ਖ਼ਾਸ ਨਾਮ ਕਿਸੇ ਵਿਲੱਖਣ ਵਿਅਕਤੀ ਜਾਂ ਥਾਂ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ (ਜਿਵੇਂ ਗੁਰਪ੍ਰੀਤ, ਅੰਮ੍ਰਿਤਸਰ, ਭਾਰਤ)।", points: 1 },
    { type: "example", exampleEn: "Gurpreet is my friend.", examplePa: "ਗੁਰਪ੍ਰੀਤ ਮੇਰਾ ਦੋਸਤ ਹੈ।", highlightedWords: ["Gurpreet"], points: 1 },
    { type: "question", english_text: "Which word is a proper noun?", punjabi_text: "ਖ਼ਾਸ ਨਾਮ ਚੁਣੋ।",
      options: ["Gurpreet", "girl", "school", "city"], correctAnswer: "Gurpreet", points: 5,
      examples: [
        { sentenceEn: "Gurpreet is my friend.", sentencePa: "ਗੁਰਪ੍ਰੀਤ ਮੇਰਾ ਦੋਸਤ ਹੈ।", explainEn: "Specific person’s name.", explainPa: "ਖ਼ਾਸ ਵਿਅਕਤੀ ਦਾ ਨਾਂ।", highlight: "Gurpreet" }
      ]
    },
    { type: "question", english_text: "Choose the proper noun.", punjabi_text: "ਖ਼ਾਸ ਨਾਮ ਚੁਣੋ।",
      options: ["Amritsar", "temple", "river", "street"], correctAnswer: "Amritsar", points: 5,
      examples: [
        { sentenceEn: "Amritsar is a city in Punjab.", sentencePa: "ਅੰਮ੍ਰਿਤਸਰ ਪੰਜਾਬ ਦਾ ਇੱਕ ਸ਼ਹਿਰ ਹੈ।", explainEn: "Name of a specific city.", explainPa: "ਖ਼ਾਸ ਸ਼ਹਿਰ ਦਾ ਨਾਮ।", highlight: "Amritsar" }
      ]
    }
  ]
};

// L_PRONOUNS_PERSONAL_01 — Personal pronouns basics
__RAW_LESSONS["L_PRONOUNS_PERSONAL_01"] = {
  metadata: {
    titleEn: "Pronouns: Personal",
    titlePa: "ਸਰਵਨਾਮ: ਵਿਅਕਤੀਵਾਚਕ",
    labelEn: "Pronouns: Personal",
    labelPa: "ਸਰਵਨਾਮ: ਵਿਅਕਤੀਵਾਚਕ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Personal Pronouns",
      titlePa: "ਸਿੱਖੋ: ਵਿਅਕਤੀਵਾਚਕ ਸਰਵਨਾਮ",
      descEn: "Identify I/you/he/she/it/we/they in sentences.",
      descPa: "ਵਾਕਾਂ ਵਿੱਚ I/you/he/she/it/we/they ਪਛਾਣੋ।",
      pointsAvailable: 12
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Personal pronouns replace names (he, she, it, we, they).",
      contentPa: "ਵਿਅਕਤੀਵਾਚਕ ਸਰਵਨਾਮ ਨਾਂ ਦੀ ਥਾਂ ਲੈਂਦੇ ਹਨ (he, she, it, we, they)।", points: 1 },
    { type: "example", exampleEn: "They are playing outside.", examplePa: "ਉਹ ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।", highlightedWords: ["They"], points: 1 },
    { type: "question", english_text: "Tap the pronoun.", punjabi_text: "ਸਰਵਨਾਮ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      options: ["friend", "She", "my"], correct_answer: "She", points: 5,
      examples: [
        { sentenceEn: "She is my friend.", sentencePa: "ਉਹ ਮੇਰੀ ਸਹেली ਹੈ।", explainEn: "'She' replaces a girl's name.", explainPa: "'She' ਲੜਕੀ ਦੇ ਨਾਂ ਦੀ ਥਾਂ।", highlight: "She" },
        { sentenceEn: "They are playing outside.", sentencePa: "ਉਹ ਬਾਹਰ ਖੇਡ ਰਹੇ ਹਨ।", explainEn: "'They' replaces multiple people.", explainPa: "'They' ਕਈ ਲੋਕਾਂ ਦੀ ਥਾਂ।", highlight: "They" }
      ]
    },
    { type: "question", english_text: "Choose the correct pronoun.", punjabi_text: "ਸਹੀ ਸਰਵਨਾਮ ਚੁਣੋ।",
      options: ["I", "Me", "Mine"], correct_answer: "I", points: 5,
      examples: [
        { sentenceEn: "I like to read books.", sentencePa: "ਮੈਨੂੰ ਕਿਤਾਬਾਂ ਪੜ੍ਹਨਾ ਪਸੰਦ ਹੈ।", explainEn: "Use 'I' as the subject.", explainPa: "ਮੁਹਾਵਰੇ ਵਿੱਚ 'I' ਵਰਤੋ।", highlight: "I" }
      ]
    },
    { type: "question", english_text: "Which pronoun is correct?", punjabi_text: "ਕਿਹੜਾ ਸਰਵਨਾਮ ਸਹੀ ਹੈ?",
      options: ["him", "He", "His"], correct_answer: "He", points: 5,
      examples: [
        { sentenceEn: "He plays football.", sentencePa: "ਉਹ ਫੁੱਟਬਾਲ ਖੇਡਦਾ ਹੈ।", explainEn: "'He' is the subject pronoun.", explainPa: "'He' ਕਰਤਾ ਸਰਵਨਾਮ ਹੈ।", highlight: "He" }
      ]
    }
  ]
};

// L_VERBS_BASICS_01 — Verbs basics
__RAW_LESSONS["L_VERBS_BASICS_01"] = {
  metadata: {
    titleEn: "Verbs: Basics",
    titlePa: "ਕਿਰਿਆ: ਮੁੱਢਲੇ",
    labelEn: "Verbs: Basics",
    labelPa: "ਕਿਰਿਆ: ਮੁੱਢਲੇ",
    trackId: "T_ACTIONS",
    objective: {
      titleEn: "Learn: Verbs",
      titlePa: "ਸਿੱਖੋ: ਕਿਰਿਆ",
      descEn: "Identify action and 'be' verbs in simple sentences.",
      descPa: "ਸਧਾਰਣ ਵਾਕਾਂ ਵਿੱਚ ਕੰਮ ਅਤੇ 'is/are' ਕਿਰਿਆ ਪਛਾਣੋ।",
      pointsAvailable: 12
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "A verb shows an action or a state of being.", contentPa: "ਕਿਰਿਆ ਕੰਮ ਜਾਂ ਹਾਲਤ ਦੱਸਦੀ ਹੈ।", points: 1 },
    { type: "example", exampleEn: "The dog runs fast.", examplePa: "ਕੁੱਤਾ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ।", highlightedWords: ["runs"], points: 1 },
    { type: "question", id: "q_verbs_basics_tap_runs", english_text: "Tap the verb.", punjabi_text: "ਕਿਰਿਆ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      options: ["dog", "runs", "fast"], correct_answer: "runs", points: 5,
      hint: { en: "Which word shows an action?", pa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ/ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ?" },
      explanation: { en: "A verb is the action word in a sentence.", pa: "ਕਿਰਿਆ = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।" },
      workedExample: { en: "Birds run.", pa: "ਪੰਛੀ ਦੌੜਦੇ ਹਨ।", highlight: { en: ["run"], pa: ["ਦੌੜਦੇ"] } },
      examples: [
        { sentenceEn: "The dog runs fast.", sentencePa: "ਕੁੱਤਾ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ।", explainEn: "'runs' shows action.", explainPa: "'runs' ਕੰਮ ਦੱਸਦਾ ਹੈ।", highlight: "runs" }
      ]
    },
    { type: "question", id: "q_verbs_basics_tap_is", english_text: "Tap the verb.", punjabi_text: "ਕਿਰਿਆ ਵਾਲੇ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      options: ["She", "is", "happy"], correct_answer: "is", points: 5,
      hint: { en: "Look for a “be” word: am/is/are.", pa: "am/is/are ਵਾਲਾ ਸ਼ਬਦ ਵੇਖੋ।" },
      explanation: { en: "‘is’ is a be-verb. It tells a state, not an action.", pa: "‘is’ ਹਾਲਤ ਦੱਸਦੀ ਕਿਰਿਆ ਹੈ।" },
      workedExample: { en: "He is tired.", pa: "ਉਹ ਥੱਕਿਆ ਹੈ।", highlight: { en: ["is"], pa: ["ਹੈ"] } },
      examples: [
        { sentenceEn: "She is happy.", sentencePa: "ਉਹ ਖੁਸ਼ ਹੈ।", explainEn: "'is' shows a state (be verb).", explainPa: "'is' ਹਾਲਤ ਦੱਸਦਾ ਹੈ।", highlight: "is" }
      ]
    },
    { type: "question", id: "q_verbs_basics_action_eat", english_text: "Find the action verb.", punjabi_text: "ਕਰਮ ਕਿਰਿਆ ਲੱਭੋ।",
      options: ["eat", "is", "the"], correct_answer: "eat", points: 5,
      hint: { en: "Which word is something you DO?", pa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਹੈ ਜੋ ਤੁਸੀਂ ਕਰਦੇ ਹੋ?" },
      explanation: { en: "Action verbs show doing: eat, run, play.", pa: "ਕਰਮ ਕਿਰਿਆ = ਖਾਣਾ/ਦੌੜਣਾ/ਖੇਡਣਾ।" },
      workedExample: { en: "I eat mango.", pa: "ਮੈਂ ਆਮ ਖਾਂਦਾ ਹਾਂ।", highlight: { en: ["eat"], pa: ["ਖਾਂਦਾ"] } },
      examples: [
        { sentenceEn: "I eat apples every day.", sentencePa: "ਮੈਂ ਹਰ ਦਿਨ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।", explainEn: "'eat' shows action.", explainPa: "'eat' ਕਰਮ ਹੈ।", highlight: "eat" }
      ]
    },
    { type: "question", id: "q_verbs_basics_be_am", english_text: "Which is a be verb?", punjabi_text: "ਕਿਹੜੀ 'be' ਕਿਰਿਆ ਹੈ?",
      options: ["am", "run", "jump"], correct_answer: "am", points: 5,
      hint: { en: "With “I”, we use…", pa: "“I/ਮੈਂ” ਨਾਲ ਕੀ ਲੱਗਦਾ?" },
      explanation: { en: "I + am. (Not is/are.)", pa: "I + am. (is/are ਨਹੀਂ।)" },
      workedExample: { en: "I am happy.", pa: "ਮੈਂ ਖੁਸ਼ ਹਾਂ।", highlight: { en: ["am"], pa: ["ਹਾਂ"] } },
      examples: [
        { sentenceEn: "I am a student.", sentencePa: "ਮੈਂ ਇੱਕ ਵਿਦਿਆਰਥੀ ਹਾਂ।", explainEn: "'am' is a be verb (state of being).", explainPa: "'am' ਹਾਲਤ ਦੀ ਕਿਰਿਆ ਹੈ।", highlight: "am" }
      ]
    }
  ]
};

// L_NOUNS_PLURALS_POSSESSION_01 — Plurals & Possession
__RAW_LESSONS["L_NOUNS_PLURALS_POSSESSION_01"] = {
  metadata: {
    titleEn: "Nouns: Plurals & Possession",
    titlePa: "ਨਾਂ: ਬਹੁਵਚਨ ਅਤੇ ਮਾਲਕੀ",
    labelEn: "Nouns: Plurals & Possession",
    labelPa: "ਨਾਂ: ਬਹੁਵਚਨ ਅਤੇ ਮਾਲਕੀ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Plurals and Possessives",
      titlePa: "ਸਿੱਖੋ: ਬਹੁਵਚਨ ਅਤੇ ਮਾਲਕੀ",
      descEn: "Form regular/irregular plurals and show possession (’s, of).",
      descPa: "ਨਿਯਮਤ/ਅਨਿਯਮਤ ਬਹੁਵਚਨ ਬਣਾਉ ਅਤੇ ਮਾਲਕੀ ਦਿਖਾਉ (’s, of).",
      pointsAvailable: 12
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Plural means more than one (books, children). Possession shows ownership (Sara’s book).",
      contentPa: "ਬਹੁਵਚਨ ਇੱਕ ਤੋਂ ਵੱਧ (books, children)। ਮਾਲਕੀ ਦਾ ਮਤਲਬ ਮਾਲਕਾਨਾ (Sara’s book)।", points: 1 },
    { type: "example", exampleEn: "One child → two children; the boy’s pen.", examplePa: "ਇੱਕ child → ਦੋ children; ਮੁੰਡੇ ਦੀ ਕਲਮ।", highlightedWords: ["children", "boy’s"], points: 1 },
    { type: "question", english_text: "Choose the correct plural.", punjabi_text: "ਸਹੀ ਬਹੁਵਚਨ ਚੁਣੋ।",
      options: ["mouses", "mice", "mices"], correct_answer: "mice", points: 5,
      examples: [
        { sentenceEn: "We saw two mice.", sentencePa: "ਅਸੀਂ ਦੋ mice ਵੇਖੇ।", explainEn: "Irregular plural of mouse is mice.", explainPa: "mouse ਦਾ ਅਨਿਯਮਤ ਬਹੁਵਚਨ mice ਹੈ।", highlight: "mice" }
      ]
    },
    { type: "question", english_text: "Which shows possession correctly?", punjabi_text: "ਕਿਹੜਾ ਮਾਲਕੀ ਠੀਕ ਹੈ?",
      options: ["the girls bag", "the girl's bag", "the girls's bag"], correct_answer: "the girl's bag", points: 5,
      examples: [
        { sentenceEn: "This is the girl's bag.", sentencePa: "ਇਹ ਕੁੜੀ ਦੀ ਥੈਲੀ ਹੈ।", explainEn: "Use 's for singular possession.", explainPa: "ਇੱਕਵਚਨ ਮਾਲਕੀ ਲਈ 's ਵਰਤੋ।", highlight: "girl's" }
      ]
    },
    { type: "question", english_text: "Form the plural of 'child'.", punjabi_text: "'child' ਦਾ ਬਹੁਵਚਨ ਬਣਾਓ।",
      options: ["childs", "children", "childses"], correct_answer: "children", points: 5,
      examples: [
        { sentenceEn: "The children are playing.", sentencePa: "ਬੱਚੇ ਖੇਡ ਰਹੇ ਹਨ।", explainEn: "Irregular plural: child → children.", explainPa: "child ਦਾ ਬਹੁਵਚਨ children ਹੈ।", highlight: "children" }
      ]
    },
    { type: "question", english_text: "Which is the possessive form?", punjabi_text: "ਮਾਲਕਾਨਾ ਰੂਪ ਕਿਹੜਾ ਹੈ?",
      options: ["books", "book's", "books's"], correct_answer: "book's", points: 5,
      examples: [
        { sentenceEn: "The book's cover is red.", sentencePa: "ਕਿਤਾਬ ਦਾ ਕਵਰ ਲਾਲ ਹੈ।", explainEn: "Book's = possession.", explainPa: "Book's = ਮਾਲਕਾਨਾ।", highlight: "book's" }
      ]
    },
    { type: "question", english_text: "Choose the correct plural.", punjabi_text: "ਸਹੀ ਬਹੁਵਚਨ ਚੁਣੋ।",
      options: ["feet", "foots", "feets"], correct_answer: "feet", points: 5,
      examples: [
        { sentenceEn: "She has two feet.", sentencePa: "ਉਸਦੇ ਦੋ ਪੈਰ ਹਨ।", explainEn: "Irregular: foot → feet.", explainPa: "foot ਦਾ ਬਹੁਵਚਨ feet ਹੈ।", highlight: "feet" }
      ]
    }
  ]
};

// L_VERBS_POWERUPS_01 — Helping verbs, modals, phrasal
__RAW_LESSONS["L_VERBS_POWERUPS_01"] = {
  metadata: {
    titleEn: "Verbs: Power-Ups",
    titlePa: "ਕਿਰਿਆ: ਸਹਾਇਕ/ਮੋਡਲ",
    labelEn: "Verbs: Power-Ups",
    labelPa: "ਕਿਰਿਆ: ਸਹਾਇਕ/ਮੋਡਲ",
    trackId: "T_ACTIONS",
    objective: {
      titleEn: "Learn: Helping & Modal Verbs",
      titlePa: "ਸਿੱਖੋ: ਸਹਾਇਕ ਅਤੇ ਮੋਡਲ ਕਿਰਿਆ",
      descEn: "Use helping verbs (is/are/was), modals (can/must), and simple phrasal verbs.",
      descPa: "ਸਹਾਇਕ ਕਿਰਿਆ (is/are/was), ਮੋਡਲ (can/must) ਅਤੇ ਸਧਾਰਣ phrasal verbs ਵਰਤੋ।",
      pointsAvailable: 12
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Helping verbs support main verbs (is running). Modals add meaning (can, must).",
      contentPa: "ਸਹਾਇਕ ਕਿਰਿਆ ਮੁੱਖ ਕਿਰਿਆ ਦੀ ਮਦਦ ਕਰਦੀ ਹੈ (is running)। ਮੋਡਲ ਅਰਥ ਜੋੜਦੇ ਹਨ (can, must)।", points: 1 },
    { type: "example", exampleEn: "She can swim. They are working.", examplePa: "ਉਹ ਤੈਰ ਸਕਦੀ ਹੈ। ਉਹ ਕੰਮ ਕਰ ਰਹੇ ਹਨ।", highlightedWords: ["can", "are"], points: 1 },
    { type: "question", id: "q_verbs_powerups_modal_must", english_text: "Choose the sentence with a modal verb.", punjabi_text: "ਮੋਡਲ ਕਿਰਿਆ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
      options: ["He must finish.", "He finishes now.", "He finished yesterday."], correct_answer: "He must finish.", points: 5,
      hint: { en: "Modal = can/should/must/may.", pa: "Modal = can/should/must/may।" },
      explanation: { en: "‘must’ means something is necessary (a rule).", pa: "‘must’ = ਲਾਜ਼ਮੀ (ਨਿਯਮ)।" },
      workedExample: { en: "You must listen.", pa: "ਤੁਹਾਨੂੰ ਸੁਣਨਾ ਲਾਜ਼ਮੀ ਹੈ।", highlight: { en: ["must"], pa: ["ਲਾਜ਼ਮੀ"] } },
      examples: [
        { sentenceEn: "You must wear a helmet.", sentencePa: "ਤੁਹਾਨੂੰ helmet ਪਹਿਨਣਾ ਚਾਹੀਦਾ ਹੈ।", explainEn: "'must' is a modal showing necessity.", explainPa: "'must' ਲਾਜ਼ਮੀ ਹੋਣ ਦੱਸਦਾ ਹੈ।", highlight: "must" }
      ]
    },
    { type: "question", id: "q_verbs_powerups_helping_are", english_text: "Pick the helping verb.", punjabi_text: "ਸਹਾਇਕ ਕਿਰਿਆ ਚੁਣੋ।",
      options: ["are", "play", "quickly"], correct_answer: "are", points: 5,
      hint: { en: "Helping verb comes before the main verb.", pa: "ਸਹਾਇਕ ਕਿਰਿਆ ਮੁੱਖ ਕਿਰਿਆ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ।" },
      explanation: { en: "‘are’ helps ‘playing’ to make the tense.", pa: "‘are’ ‘playing’ ਦੀ ਮਦਦ ਕਰਦਾ ਹੈ।" },
      workedExample: { en: "We are reading.", pa: "ਅਸੀਂ ਪੜ੍ਹ ਰਹੇ ਹਾਂ।", highlight: { en: ["are"], pa: ["ਹਾਂ"] } },
      examples: [
        { sentenceEn: "They are playing.", sentencePa: "ਉਹ ਖੇਡ ਰਹੇ ਹਨ।", explainEn: "'are' helps the main verb.", explainPa: "'are' ਮੁੱਖ ਕਿਰਿਆ ਦੀ ਮਦਦ ਕਰਦਾ ਹੈ।", highlight: "are" }
      ]
    },
    { type: "question", id: "q_verbs_powerups_modal_can", english_text: "Which modal means ability?", punjabi_text: "ਕਿਹੜਾ ਮੋਡਲ ਸਮਰੱਥਾ ਦੱਸਦਾ ਹੈ?",
      options: ["can", "should", "may"], correct_answer: "can", points: 5,
      hint: { en: "Ability = “can”.", pa: "ਸਮਰੱਥਾ = “can”।" },
      explanation: { en: "‘can’ means you are able to do it.", pa: "‘can’ = ਕਰ ਸਕਦੇ ਹਾਂ।" },
      workedExample: { en: "I can draw.", pa: "ਮੈਂ ਡਰਾਇੰਗ ਕਰ ਸਕਦਾ ਹਾਂ।", highlight: { en: ["can"], pa: ["ਸਕਦਾ"] } },
      examples: [
        { sentenceEn: "She can swim very well.", sentencePa: "ਉਹ ਬਹੁਤ ਚੰਗੀ ਤਰ੍ਹਾਂ ਤੈਰ ਸਕਦੀ ਹੈ।", explainEn: "'can' shows ability.", explainPa: "'can' ਸਮਰੱਥਾ ਦੱਸਦਾ ਹੈ।", highlight: "can" }
      ]
    },
    { type: "question", id: "q_verbs_powerups_form_is_going", english_text: "Choose the correct form.", punjabi_text: "ਸਹੀ ਰੂਪ ਚੁਣੋ।",
      options: ["He going.", "He is going.", "He go."], correct_answer: "He is going.", points: 5,
      hint: { en: "Right now = is/are + -ing.", pa: "ਹੁਣ = is/are + -ing।" },
      explanation: { en: "‘is’ + ‘going’ makes “happening now”.", pa: "‘is’ + ‘going’ = ਹੁਣ ਹੋ ਰਿਹਾ ਹੈ।" },
      workedExample: { en: "She is eating.", pa: "ਉਹ ਖਾ ਰਹੀ ਹੈ।", highlight: { en: ["is"], pa: ["ਰਹੀ"] } },
      examples: [
        { sentenceEn: "He is going to school.", sentencePa: "ਉਹ ਸਕੂਲ ਜਾ ਰਿਹਾ ਹੈ।", explainEn: "'is going' is present continuous (helping + action verb).", explainPa: "'is going' ਮੌਜੂਦਾ ਅਨੁ ਹੈ।", highlight: "is going" }
      ]
    }
  ]
};

// L_ADJ_COMPARISON_01 — Comparative/superlative
__RAW_LESSONS["L_ADJ_COMPARISON_01"] = {
  metadata: {
    titleEn: "Adjectives: Comparison",
    titlePa: "ਵਿਸ਼ੇਸ਼ਣ: ਤੁਲਨਾ",
    labelEn: "Adjectives: Comparison",
    labelPa: "ਵਿਸ਼ੇਸ਼ਣ: ਤੁਲਨਾ",
    trackId: "T_DESCRIBE",
    objective: {
      titleEn: "Learn: Comparative & Superlative",
      titlePa: "ਸਿੱਖੋ: ਤੁਲਨਾਤਮਕ/ਸਰਵੋਤਮ",
      descEn: "Use -er/-est and 'more/most' to compare.",
      descPa: "-er/-est ਅਤੇ 'more/most' ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
      pointsAvailable: 12
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Comparative compares two (taller). Superlative compares three+ (tallest).",
      contentPa: "ਤੁਲਨਾਤਮਕ ਦੋ ਦੀ ਤੁਲਨਾ (taller)। ਸਰਵੋਤਮ ਕਈ ਦੀ (tallest)।", points: 1 },
    { type: "example", exampleEn: "Riya is taller than Neha.", examplePa: "ਰੀਆ ਨੇਹਾ ਨਾਲੋਂ ਲੰਮੀ ਹੈ।", highlightedWords: ["taller"], points: 1 },
    { type: "question", id: "q_adj_comp_super_fastest", english_text: "Choose the superlative form.", punjabi_text: "ਸਰਵੋਤਮ ਰੂਪ ਚੁਣੋ।",
      options: ["fast", "faster", "fastest"], correct_answer: "fastest", points: 5,
      hint: { en: "Superlative = the MOST (-est).", pa: "ਸਰਵੋਤਮ = ਸਭ ਤੋਂ (-est)।" },
      explanation: { en: "fast → fastest means #1 in a group.", pa: "fast → fastest = ਸਮੂਹ ਵਿੱਚ ਸਭ ਤੋਂ ਤੇਜ਼।" },
      workedExample: { en: "He is the fastest runner.", pa: "ਉਹ ਸਭ ਤੋਂ ਤੇਜ਼ ਦੌੜਾਕ ਹੈ।", highlight: { en: ["fastest"], pa: ["ਸਭ ਤੋਂ"] } }
    },
    { type: "question", id: "q_adj_comp_sentence_taller", english_text: "Pick the sentence with a comparative.", punjabi_text: "ਤੁਲਨਾਤਮਕ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
      options: ["He is tall.", "He is taller.", "He is the tallest."], correct_answer: "He is taller.", points: 5,
      hint: { en: "Comparative = comparing two (often -er).", pa: "ਤੁਲਨਾਤਮਕ = ਦੋ ਦੀ ਤੁਲਨਾ (-er)।" },
      explanation: { en: "tall → taller compares two people/things.", pa: "tall → taller ਦੋ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ।" },
      workedExample: { en: "This bag is bigger.", pa: "ਇਹ ਬੈਗ ਵੱਡਾ ਹੈ।", highlight: { en: ["bigger"], pa: ["ਵੱਡਾ"] } }
    },
    { type: "question", english_text: "Which is the comparative of 'good'?", punjabi_text: "'good' ਦਾ ਤੁਲਨਾਤਮਕ ਕੀ ਹੈ?",
      options: ["gooder", "better", "goodest"], correct_answer: "better", points: 5,
      examples: [
        { sentenceEn: "This book is better than that one.", sentencePa: "ਇਹ ਕਿਤਾਬ ਉਸ ਨਾਲੋਂ ਬਿਹਤਰ ਹੈ।", explainEn: "'better' is the comparative of 'good'.", explainPa: "'better' 'good' ਦਾ ਤੁਲਨਾਤਮਕ ਹੈ।", highlight: "better" }
      ]
    },
    { type: "question", english_text: "Complete: My house is ___ than yours.", punjabi_text: "ਪੂਰਾ ਕਰੋ: My house is ___ than yours.",
      options: ["big", "bigger", "biggest"], correct_answer: "bigger", points: 5,
      examples: [
        { sentenceEn: "His car is bigger than mine.", sentencePa: "ਉਸ ਦੀ ਕਾਰ ਮੇਰੀ ਨਾਲੋਂ ਵੱਡੀ ਹੈ।", explainEn: "Use comparative with 'than'.", explainPa: "'than' ਦੇ ਨਾਲ ਤੁਲਨਾਤਮਕ ਵਰਤੋ।", highlight: "bigger" }
      ]
    }
  ]
};

// L_ADJ_VS_ADV_01 — Adjectives vs Adverbs
__RAW_LESSONS["L_ADJ_VS_ADV_01"] = {
  metadata: {
    titleEn: "Adjectives vs Adverbs",
    titlePa: "ਵਿਸ਼ੇਸ਼ਣ ਵਸ. ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ",
    labelEn: "Adjectives vs Adverbs",
    labelPa: "ਵਿਸ਼ੇਸ਼ਣ ਵਸ. ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ",
    trackId: "T_DESCRIBE",
    objective: {
      titleEn: "Learn: Describe Nouns vs Actions",
      titlePa: "ਸਿੱਖੋ: ਨਾਮ ਵਸ. ਕੰਮ ਦੀ ਵਰਣਨਾ",
      descEn: "Use adjectives for nouns and adverbs for verbs.",
      descPa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਲਈ, ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕੰਮ ਲਈ ਵਰਤੋ।",
      pointsAvailable: 12
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Adjectives describe nouns (a red bag). Adverbs describe verbs (runs quickly).",
      contentPa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਦੀ ਵਰਣਨਾ, ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕੰਮ ਦੀ।", points: 1 },
    { type: "example", exampleEn: "She sings beautifully.", examplePa: "ਉਹ ਸੁੰਦਰਤਾ ਨਾਲ ਗਾਂਦੀ ਹੈ।", highlightedWords: ["beautifully"], points: 1 },
    { type: "question", id: "q_adj_vs_adv_choose_quickly", english_text: "Choose the adverb.", punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।",
      options: ["happy", "quickly", "red"], correct_answer: "quickly", points: 5,
      hint: { en: "Adverb = tells HOW.", pa: "Adverb = ਕਿਵੇਂ?" },
      explanation: { en: "‘quickly’ describes an action (a verb).", pa: "‘quickly’ ਕੰਮ/ਕਿਰਿਆ ਨੂੰ ਦੱਸਦਾ ਹੈ।" },
      workedExample: { en: "He runs quickly.", pa: "ਉਹ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਦਾ ਹੈ।", highlight: { en: ["quickly"], pa: ["ਤੇਜ਼ੀ ਨਾਲ"] } }
    },
    { type: "question", id: "q_adj_vs_adv_choose_blue", english_text: "Which word is an adjective?", punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?",
      options: ["carefully", "blue", "slowly"], correct_answer: "blue", points: 5,
      hint: { en: "Adjective = describes a noun (thing).", pa: "ਵਿਸ਼ੇਸ਼ਣ = ਨਾਮ/ਚੀਜ਼ ਨੂੰ ਦੱਸਦਾ ਹੈ।" },
      explanation: { en: "‘blue’ describes a thing: blue sky/ball.", pa: "‘blue’ ਚੀਜ਼ ਦੀ ਵਰਣਨਾ ਕਰਦਾ ਹੈ।" },
      workedExample: { en: "a blue bag", pa: "ਨੀਲਾ ਬੈਗ", highlight: { en: ["blue"], pa: ["ਨੀਲਾ"] } }
    },
    { type: "question", english_text: "She sings ___.", punjabi_text: "She sings ___.",
      options: ["beautiful", "beautifully", "beauty"], correct_answer: "beautifully", points: 5,
      examples: [
        { sentenceEn: "She sings beautifully.", sentencePa: "ਉਹ ਸੁੰਦਰਤਾ ਨਾਲ ਗਾਂਦੀ ਹੈ।", explainEn: "Adverbs modify verbs (how she sings).", explainPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਰਿਆ ਨੂੰ ਮੋਡੀਫਾਈ ਕਰਦੇ ਹਨ।", highlight: "beautifully" }
      ]
    },
    { type: "question", english_text: "Complete: The ___ dog is running.", punjabi_text: "ਪੂਰਾ ਕਰੋ: The ___ dog is running.",
      options: ["quickly", "quick", "quicker"], correct_answer: "quick", points: 5,
      examples: [
        { sentenceEn: "The quick dog is running.", sentencePa: "ਤੇਜ਼ ਕੁੱਤਾ ਦੌੜ ਰਿਹਾ ਹੈ।", explainEn: "Adjectives describe nouns (what kind of dog).", explainPa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਦੀ ਵਰਣਨਾ ਕਰਦੇ ਹਨ।", highlight: "quick" }
      ]
    }
  ]
};

// L_PREP_PLACE_MOVE_01 — Prepositions (place/movement)
__RAW_LESSONS["L_PREP_PLACE_MOVE_01"] = {
  metadata: {
    titleEn: "Prepositions: Place/Movement",
    titlePa: "ਪੂਰਵ-ਬੋਧਕ: ਥਾਂ/ਹਿਲਚਲ",
    labelEn: "Prepositions: Place/Movement",
    labelPa: "ਪੂਰਵ-ਬੋਧਕ: ਥਾਂ/ਹਿਲਚਲ",
    trackId: "T_SENTENCE",
    objective: {
      titleEn: "Learn: in/on/under/into/across",
      titlePa: "ਸਿੱਖੋ: in/on/under/into/across",
      descEn: "Use place & movement prepositions in sentences.",
      descPa: "ਵਾਕਾਂ ਵਿੱਚ ਥਾਂ ਅਤੇ ਹਿਲਚਲ ਦੇ ਪੂਰਵ-ਬੋਧਕ ਵਰਤੋ।",
      pointsAvailable: 12
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Prepositions show relationships of place or movement.", contentPa: "ਪੂਰਵ-ਬੋਧਕ ਥਾਂ ਜਾਂ ਹਿਲਚਲ ਦਾ ਸੰਬੰਧ ਦਿਖਾਉਂਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "The ball is under the table.", examplePa: "ਗੇਂਦ ਮੇਜ਼ ਦੇ ਹੇਠਾਂ ਹੈ।", highlightedWords: ["under"], points: 1 },
    { type: "question", english_text: "Choose the correct preposition.", punjabi_text: "ਸਹੀ ਪੂਰਵ-ਬੋਧਕ ਚੁਣੋ।",
      options: ["in", "quickly", "happy"], correct_answer: "in", points: 5 },
    { type: "question", english_text: "He walked ____ the bridge.", punjabi_text: "ਉਹ ਪੁਲ ____ ਤੁਰਿਆ।",
      options: ["across", "blue", "slowly"], correct_answer: "across", points: 5 },
    { type: "question", english_text: "The book is ____ the shelf.", punjabi_text: "ਕਿਤਾਬ ਸ਼ੈਲਫ ____ ਹੈ।",
      options: ["on", "under", "into"], correct_answer: "on", points: 5,
      examples: [
        { sentenceEn: "The book is on the shelf.", sentencePa: "ਕਿਤਾਬ ਸ਼ੈਲਫ ਉੱਪਰ ਹੈ।", explainEn: "'on' shows position on a surface.", explainPa: "'on' ਸਤ੍ਹਾ ਉੱਪਰ ਦਾ ਸਥਾਨ ਦੱਸਦਾ ਹੈ।", highlight: "on" }
      ]
    },
    { type: "question", english_text: "The cat is ____ the box.", punjabi_text: "ਬਿੱਲੀ ਡੱਬਾ ____ ਹੈ।",
      options: ["under", "over", "next"], correct_answer: "under", points: 5,
      examples: [
        { sentenceEn: "The cat is under the table.", sentencePa: "ਬਿੱਲੀ ਮੇਜ਼ ਦੇ ਹੇਠਾਂ ਹੈ।", explainEn: "'under' means below.", explainPa: "'under' ਮਤਲਬ ਹੇਠਾਂ।", highlight: "under" }
      ]
    },
    { type: "question", english_text: "She ran ____ the park.", punjabi_text: "ਉਹ ਪਾਰਕ ____ ਦੌੜੀ।",
      options: ["into", "from", "over"], correct_answer: "into", points: 5,
      examples: [
        { sentenceEn: "She ran into the park.", sentencePa: "ਉਹ ਪਾਰਕ ਵਿੱਚ ਦੌੜੀ।", explainEn: "'into' shows movement toward a place.", explainPa: "'into' ਥਾਂ ਵੱਲ ਹਿਲਚਲ ਦੱਸਦਾ ਹੈ।", highlight: "into" }
      ]
    }
  ]
};

// L_PREP_TIME_01 — Prepositions (time)
__RAW_LESSONS["L_PREP_TIME_01"] = {
  metadata: {
    titleEn: "Prepositions: Time",
    titlePa: "ਪੂਰਵ-ਬੋਧਕ: ਸਮਾਂ",
    labelEn: "Prepositions: Time",
    labelPa: "ਪੂਰਵ-ਬੋਧਕ: ਸਮਾਂ",
    trackId: "T_SENTENCE",
    objective: {
      titleEn: "Learn: at/on/in/since/for/by",
      titlePa: "ਸਿੱਖੋ: at/on/in/since/for/by",
      descEn: "Use common time prepositions accurately.",
      descPa: "ਆਮ ਸਮੇਂ ਵਾਲੇ ਪੂਰਵ-ਬੋਧਕ ਠੀਕ ਵਰਤੋ।",
      pointsAvailable: 12
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Use at (exact time), on (days), in (months/years).",
      contentPa: "at (ਠੀਕ ਸਮਾਂ), on (ਦਿਨ), in (ਮਹੀਨੇ/ਸਾਲ)।", points: 1 },
    { type: "example", exampleEn: "School starts at 8 AM on Monday in June.", examplePa: "ਸਕੂਲ 8 ਵਜੇ, ਸੋਮਵਾਰ ਨੂੰ, ਜੂਨ ਵਿੱਚ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।", highlightedWords: ["at", "on", "in"], points: 1 },
    { type: "question", english_text: "We meet ___ Sunday.", punjabi_text: "ਅਸੀਂ ___ ਐਤਵਾਰ ਨੂੰ ਮਿਲਦੇ ਹਾਂ।",
      options: ["on", "at", "in"], correct_answer: "on", points: 5 },
    { type: "question", english_text: "He lived here ___ 2019.", punjabi_text: "ਉਹ ਇੱਥੇ ___ 2019 ਤੋਂ ਰਹਿ ਰਿਹਾ ਹੈ।",
      options: ["since", "for", "by"], correct_answer: "since", points: 5 },
    { type: "question", english_text: "School starts ___ 8 AM.", punjabi_text: "ਸਕੂਲ ___ 8 ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।",
      options: ["on", "at", "in"], correct_answer: "at", points: 5,
      examples: [
        { sentenceEn: "School starts at 8 AM.", sentencePa: "ਸਕੂਲ 8 ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।", explainEn: "Use 'at' for exact times.", explainPa: "'at' ਠੀਕ ਸਮੇਂ ਲਈ।", highlight: "at" }
      ]
    },
    { type: "question", english_text: "They waited ___ an hour.", punjabi_text: "ਉਨ੍ਹਾਂ ___ ਘੰਟੇ ਦੀ ਉਡੀਕ ਕੀਤੀ।",
      options: ["since", "for", "during"], correct_answer: "for", points: 5,
      examples: [
        { sentenceEn: "She waited for two hours.", sentencePa: "ਉਹ ਦੋ ਘੰਟੇ ਉਡੀਕ ਕਰਦੀ ਰਹੀ।", explainEn: "Use 'for' with a duration.", explainPa: "'for' ਸਮਾਨਾਵਧੀ ਨਾਲ।", highlight: "for" }
      ]
    },
    { type: "question", english_text: "She's been here ___ Monday.", punjabi_text: "ਉਹ ___ ਸੋਮਵਾਰ ਨੋਂ ਇੱਥੇ ਹੈ।",
      options: ["since", "for", "at"], correct_answer: "since", points: 5,
      examples: [
        { sentenceEn: "We've been friends since 2020.", sentencePa: "ਅਸੀਂ 2020 ਤੋਂ ਦੋਸਤ ਹਾਂ।", explainEn: "Use 'since' with a start point.", explainPa: "'since' ਬਿਨਾਂ ਦੇ ਨਾਲ।", highlight: "since" }
      ]
    }
  ]
};

// L_CONJ_JOINING_01 — Conjunctions
__RAW_LESSONS["L_CONJ_JOINING_01"] = {
  metadata: {
    titleEn: "Conjunctions: Joining Ideas",
    titlePa: "ਸੰਯੋਜਕ: ਖ਼ਿਆਲ ਜੋੜਨਾ",
    labelEn: "Conjunctions: Joining Ideas",
    labelPa: "ਸੰਯੋਜਕ: ਖ਼ਿਆਲ ਜੋੜਨਾ",
    trackId: "T_SENTENCE",
    objective: {
      titleEn: "Learn: and/but/or/so/because",
      titlePa: "ਸਿੱਖੋ: and/but/or/so/because",
      descEn: "Join words and clauses with common conjunctions.",
      descPa: "ਆਮ ਸੰਯੋਜਕਾਂ ਨਾਲ ਸ਼ਬਦ ਅਤੇ ਵਾਕ-ਖੰਡ ਜੋੜੋ।",
      pointsAvailable: 12
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Conjunctions connect words or clauses (and, but, or).",
      contentPa: "ਸੰਯੋਜਕ ਸ਼ਬਦਾਂ ਜਾਂ ਵਾਕ-ਖੰਡਾਂ ਨੂੰ ਜੋੜਦੇ ਹਨ (and, but, or)।", points: 1 },
    { type: "example", exampleEn: "I like apples and bananas.", examplePa: "ਮੈਨੂੰ ਸੇਬ ਅਤੇ ਕੇਲੇ ਪਸੰਦ ਹਨ।", highlightedWords: ["and"], points: 1 },
    { type: "question", english_text: "Choose the best conjunction.", punjabi_text: "ਸਭ ਤੋਂ ਵਧੀਆ ਸੰਯੋਜਕ ਚੁਣੋ।",
      options: ["and", "blue", "slowly"], correct_answer: "and", points: 5 },
    { type: "question", english_text: "He was tired, ___ he kept working.", punjabi_text: "ਉਹ ਥੱਕਿਆ ਹੋਇਆ ਸੀ, ___ ਉਹ ਕੰਮ ਕਰਦਾ ਰਿਹਾ।",
      options: ["so", "but", "or"], correct_answer: "but", points: 5 },
    { type: "question", english_text: "Complete: ___ you ready?", punjabi_text: "ਪੂਰਾ ਕਰੋ: ___ you ready?",
      options: ["and", "but", "or"], correct_answer: "or", points: 5,
      examples: [
        { sentenceEn: "Would you like tea or coffee?", sentencePa: "ਤੁਹਾਨੂੰ ਚਾਹ ਜਾਂ ਕਾਫ਼ੀ ਪਸੰਦ ਹੈ?", explainEn: "'or' offers a choice.", explainPa: "'or' ਚੋਣ ਦਿੰਦਾ ਹੈ।", highlight: "or" }
      ]
    },
    { type: "question", english_text: "She was late, ___ she ran.", punjabi_text: "ਉਹ ਦੇਰ ਸੀ, ___ ਉਹ ਭਾਜੀ।",
      options: ["and", "because", "or"], correct_answer: "because", points: 5,
      examples: [
        { sentenceEn: "He didn't go because he was ill.", sentencePa: "ਉਹ ਬਿਮਾਰ ਸੀ ਇਸ ਲਈ ਨਹੀਂ ਗਿਆ।", explainEn: "'because' shows a reason.", explainPa: "'because' ਕਾਰਨ ਦੱਸਦਾ ਹੈ।", highlight: "because" }
      ]
    },
    { type: "question", english_text: "You can come ___ stay home.", punjabi_text: "ਤੁਸੀਂ ਆ ਸਕਦੇ ਹੋ ___ ਘਰ ਰਹ ਸਕਦੇ ਹੋ।",
      options: ["and", "but", "or"], correct_answer: "or", points: 5 }
  ]
};

// L_INTERJECTIONS_01 — Interjections
__RAW_LESSONS["L_INTERJECTIONS_01"] = {
  metadata: {
    titleEn: "Interjections: Feelings",
    titlePa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ: ਭਾਵਨਾ",
    labelEn: "Interjections: Feelings",
    labelPa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ: ਭਾਵਨਾ",
    trackId: "T_SENTENCE",
    objective: {
      titleEn: "Learn: Wow/Ouch/Oops/Shh/Phew",
      titlePa: "ਸਿੱਖੋ: Wow/Ouch/Oops/Shh/Phew",
      descEn: "Recognize interjections that show sudden feelings.",
      descPa: "ਅਚਾਨਕ ਭਾਵਨਾ ਦੱਸਣ ਵਾਲੇ ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਪਛਾਣੋ।",
      pointsAvailable: 10
    },
    difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Interjections express sudden emotion (Wow!, Ouch!).",
      contentPa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਅਚਾਨਕ ਭਾਵਨਾ ਦੱਸਦੇ ਹਨ (Wow!, Ouch!)।", points: 1 },
    { type: "example", exampleEn: "Wow, this cake is tasty!", examplePa: "ਵਾਹ, ਇਹ ਕੇਕ ਸੁਆਦਲਾ ਹੈ!", highlightedWords: ["Wow"], points: 1 },
    { type: "question", english_text: "Tap the interjection.", punjabi_text: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਚੁਣੋ।",
      options: ["Wow", "cake", "tasty"], correct_answer: "Wow", points: 5 },
    { type: "question", english_text: "Which shows pain?", punjabi_text: "ਕਿਹੜਾ ਦਰਦ ਦੱਸਦਾ ਹੈ?",
      options: ["Phew!", "Ouch!", "Shh!"], correct_answer: "Ouch!", points: 3 },
    { type: "question", english_text: "Choose the interjection.", punjabi_text: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਚੁਣੋ।",
      options: ["help", "Oops!", "quickly"], correct_answer: "Oops!", points: 5,
      examples: [
        { sentenceEn: "Oops! I dropped the cup.", sentencePa: "ਅਰੇ! ਮੈਂ ਕੱਪ ਡੁੱਬਿਆ।", explainEn: "'Oops!' shows a mistake.", explainPa: "'Oops!' ਗਲਤੀ ਦਿਖਾਉਂਦਾ ਹੈ।", highlight: "Oops" }
      ]
    },
    { type: "question", english_text: "Shh! means ___.", punjabi_text: "Shh! ਦਾ ਮਤਲਬ ___ ।",
      options: ["be quiet", "hello", "goodbye"], correct_answer: "be quiet", points: 5,
      examples: [
        { sentenceEn: "Shh! The baby is sleeping.", sentencePa: "ਸਸ਼! ਬੱਚਾ ਸੋ ਰਿਹਾ ਹੈ।", explainEn: "'Shh!' requests silence.", explainPa: "'Shh!' ਖਾਮੋਸ਼ ਰਹਿਣ ਨੂੰ ਕਹਿੰਦਾ ਹੈ।", highlight: "Shh" }
      ]
    },
    { type: "question", english_text: "Which shows relief?", punjabi_text: "ਕਿਹੜਾ ਰਾਹਤ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["Wow!", "Phew!", "Yay!"], correct_answer: "Phew!", points: 5,
      examples: [
        { sentenceEn: "Phew! That was close.", sentencePa: "ਵਾ! ਇਹ ਲਗਭਗ ਸੀ।", explainEn: "'Phew!' shows relief.", explainPa: "'Phew!' ਰਾਹਤ ਦੀ ਭਾਵਨਾ ਦੀ ਨਿਸ਼ਾਨੀ ਹੈ।", highlight: "Phew" }
      ]
    }
  ]
};

// Stage 1: T_WORDS Lessons
__RAW_LESSONS["L_NOUNS_BASICS_01"] = {
  metadata: {
    titleEn: "Noun Basics", titlePa: "ਨਾਮ ਮੁੱਢ",
    trackId: "T_WORDS", objective: { titleEn: "Learn: Nouns", titlePa: "ਸਿੱਖੋ: ਨਾਮ",
    descEn: "Identify what nouns are.", descPa: "ਨਾਮ ਕੀ ਹਨ ਜਾਣੋ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "A noun is a word for a person, place, animal, or thing.",
      contentPa: "ਨਾਮ ਇੱਕ ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਨਵਰ ਜਾਂ ਚੀਜ਼ ਦਾ ਸ਼ਬਦ ਹੁੰਦਾ ਹੈ।", points: 1 },
    { type: "example", exampleEn: "Dog, teacher, apple, London", examplePa: "ਕੁੱਤਾ, ਅਧਿਆਪਕ, ਸੇਬ, ਲੰਡਨ", points: 1 },
    { type: "question", english_text: "Which is a noun?", punjabi_text: "ਕਿਹੜਾ ਨਾਮ ਹੈ?",
      options: ["run", "cat", "quickly"], correct_answer: "cat", points: 5,
      examples: [{ sentenceEn: "A cat is sleeping.", sentencePa: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।", explainEn: "Cat is a noun (an animal).", explainPa: "cat ਨਾਮ ਹੈ।", highlight: "cat" }]
    },
    { type: "question", english_text: "Pick the noun.", punjabi_text: "ਨਾਮ ਚੁਣੋ।",
      options: ["happy", "book", "run"], correct_answer: "book", points: 5,
      examples: [{ sentenceEn: "I read a book.", sentencePa: "ਮੈਂ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹਾਂ।", explainEn: "Book is a noun.", explainPa: "book ਨਾਮ ਹੈ।", highlight: "book" }]
    },
    { type: "question", english_text: "Find the noun in: She played in the garden.",
      punjabi_text: "ਵਾਕ ਵਿਚ ਨਾਮ ਲੱਭੋ: She played in the garden.",
      options: ["played", "She", "garden"], correct_answer: "garden", points: 5,
      examples: [{ sentenceEn: "We went to the garden.", sentencePa: "ਅਸੀਂ ਬਾਗ ਗਏ।", explainEn: "Garden is a noun (a place).", explainPa: "garden ਥਾਂ ਦਾ ਨਾਮ ਹੈ।", highlight: "garden" }]
    },
    { type: "question", english_text: "Nouns can be people. Which is a person?",
      punjabi_text: "ਨਾਮ ਵਿਅਕਤੀ ਹੋ ਸਕਦੇ ਹਨ। ਕਿਹੜਾ ਵਿਅਕਤੀ ਹੈ?",
      options: ["doctor", "beautiful", "quickly"], correct_answer: "doctor", points: 5,
      examples: [{ sentenceEn: "The doctor helped me.", sentencePa: "ਡਾਕਟਰ ਨੇ ਮੇਰੀ ਮਦਦ ਕੀਤੀ।", explainEn: "Doctor is a noun (a person).", explainPa: "doctor ਵਿਅਕਤੀ ਦਾ ਨਾਮ ਹੈ।", highlight: "doctor" }]
    },
    { type: "question", english_text: "Which word is NOT a noun?",
      punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਮ ਨਹੀਂ ਹੈ?",
      options: ["table", "laugh", "phone"], correct_answer: "laugh", points: 5,
      examples: [{ sentenceEn: "Don't laugh loudly.", sentencePa: "ਰੋਵ ਮਤ ਹਾਸੋ।", explainEn: "Laugh is a verb (an action).", explainPa: "laugh ਇੱਕ ਕਿਰਿਆ ਹੈ।", highlight: "laugh" }]
    },
    { type: "question", english_text: "What type of noun is 'India'?",
      punjabi_text: "'India' ਕਿਸ ਤਰ੍ਹਾਂ ਦਾ ਨਾਮ ਹੈ?",
      options: ["common noun", "proper noun", "action noun"], correct_answer: "proper noun", points: 5,
      examples: [{ sentenceEn: "I live in India.", sentencePa: "ਮੈਂ ਭਾਰਤ ਵਿੱਚ ਰਹਿੰਦਾ ਹਾਂ।", explainEn: "India is a proper noun (a specific place).", explainPa: "India ਖਾਸ ਥਾਂ ਦਾ ਨਾਮ ਹੈ।", highlight: "India" }]
    }
  ]
};

__RAW_LESSONS["L_PRONOUNS_BASICS_01"] = {
  metadata: {
    titleEn: "Pronoun Basics", titlePa: "ਸਰਵਨਾਮ ਮੁੱਢ",
    trackId: "T_WORDS", objective: { titleEn: "Learn: Pronouns", titlePa: "ਸਿੱਖੋ: ਸਰਵਨਾਮ",
    descEn: "Pronouns replace nouns.", descPa: "ਸਰਵਨਾਮ ਨਾਮ ਦੀ ਥਾਂ ਲੈਂਦੇ ਹਨ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Pronouns replace nouns (I, you, he, she, it, we, they).",
      contentPa: "ਸਰਵਨਾਮ ਨਾਮ ਦੀ ਥਾਂ ਲੈਂਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "She plays. They run. It is here.", examplePa: "ਉਹ ਖੇਡਦੀ ਹੈ। ਉਹ ਦੌੜਦੇ ਹਨ।", points: 1 },
    { type: "question", english_text: "Pick the pronoun.", punjabi_text: "ਸਰਵਨਾਮ ਚੁਣੋ।",
      options: ["John", "He", "apple"], correct_answer: "He", points: 5,
      examples: [{ sentenceEn: "He went to school.", sentencePa: "ਉਹ ਸਕੂਲ ਗਿਆ।", explainEn: "He is a pronoun.", explainPa: "He ਸਰਵਨਾਮ ਹੈ।", highlight: "He" }]
    },
    { type: "question", english_text: "Which is a pronoun?", punjabi_text: "ਕਿਹੜਾ ਸਰਵਨਾਮ ਹੈ?",
      options: ["dog", "they", "run"], correct_answer: "they", points: 5,
      examples: [{ sentenceEn: "They like pizza.", sentencePa: "ਉਹ ਪਿਜ਼ਾ ਪਸੰਦ ਕਰਦੇ ਹਨ।", explainEn: "They replaces a group.", explainPa: "They ਗਰੁੱਪ ਦੀ ਥਾਂ।", highlight: "They" }]
    },
    { type: "question", english_text: "Complete: ___ am happy.",
      punjabi_text: "ਪੂਰਾ ਕਰੋ: ___ am happy.",
      options: ["We", "I", "You"], correct_answer: "I", points: 5,
      examples: [{ sentenceEn: "I am happy.", sentencePa: "ਮੈਂ ਖੁਸ਼ ਹਾਂ।", explainEn: "I is used for yourself.", explainPa: "I ਆਪ ਲਈ।", highlight: "I" }]
    },
    { type: "question", english_text: "What pronoun replaces 'Mary'?",
      punjabi_text: "'Mary' ਦੀ ਥਾਂ ਕਿਹੜਾ ਸਰਵਨਾਮ ਆਉਂਦਾ ਹੈ?",
      options: ["He", "She", "It"], correct_answer: "She", points: 5,
      examples: [{ sentenceEn: "Mary is smart. She studies hard.", sentencePa: "Mary ਹੋਸ਼ਿਆਰ ਹੈ। ਉਹ ਸਖਤ ਪੜ੍ਹਦੀ ਹੈ।", explainEn: "She replaces Mary (female).", explainPa: "She Mary ਦੀ ਥਾਂ।", highlight: "She" }]
    },
    { type: "question", english_text: "Choose the sentence using pronouns correctly.",
      punjabi_text: "ਸਰਵਨਾਮ ਦੀ ਸਹੀ ਵਰਤੋਂ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
      options: ["Him goes to school", "He goes to school", "They goes to school"], correct_answer: "He goes to school", points: 5,
      examples: [{ sentenceEn: "They go to school.", sentencePa: "ਉਹ ਸਕੂਲ ਜਾਂਦੇ ਹਨ।", explainEn: "They (plural) + go (plural verb).", explainPa: "They + go ਸਹੀ ਮੇਲ ਹੈ।", highlight: "They go" }]
    },
    { type: "question", english_text: "What does 'we' mean?",
      punjabi_text: "'we' ਦਾ ਮਤਲਬ ਕੀ ਹੈ?",
      options: ["just you", "me and others", "just one person"], correct_answer: "me and others", points: 5,
      examples: [{ sentenceEn: "We play together.", sentencePa: "ਅਸੀਂ ਇਕੱਠੇ ਖੇਡਦੇ ਹਾਂ।", explainEn: "We = me + other people.", explainPa: "We ਮੇरे ਅਤੇ ਹੋਰਾਂ ਨਾਲ।", highlight: "We" }]
    }
  ]
};

__RAW_LESSONS["L_SINGULAR_PLURAL_01"] = {
  metadata: {
    titleEn: "Singular & Plural", titlePa: "ਏਕ ਵਚਨ / ਬਹੁ ਵਚਨ",
    trackId: "T_WORDS", objective: { titleEn: "Learn: Numbers", titlePa: "ਸਿੱਖੋ: ਸੰਖਿਆ",
    descEn: "One vs. many.", descPa: "ਇੱਕ ਬਨਾਮ ਕਈ।", pointsAvailable: 32 }, difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Singular = one. Plural = more than one.",
      contentPa: "ਏਕ = ਇੱਕ। ਬਹੁ = ਇੱਕ ਤੋਂ ਵੱਧ।", points: 1 },
    { type: "example", exampleEn: "cat (singular) → cats (plural)", examplePa: "cat → cats", points: 1 },
    { type: "question", english_text: "Which is plural?", punjabi_text: "ਕਿਹੜਾ ਬਹੁਵਚਨ ਹੈ?",
      options: ["book", "books"], correct_answer: "books", points: 5,
      examples: [{ sentenceEn: "Many books are here.", sentencePa: "ਕਈ ਕਿਤਾਬਾਂ ਇੱਥੇ ਹਨ।", explainEn: "Books is plural.", explainPa: "books ਬਹੁਵਚਨ ਹੈ।", highlight: "books" }]
    },
    { type: "question", english_text: "Form plural of 'dog'.", punjabi_text: "'dog' ਦਾ ਬਹੁਵਚਨ ਬਣਾਓ।",
      options: ["dog", "dogs", "doges"], correct_answer: "dogs", points: 5,
      examples: [{ sentenceEn: "Three dogs are playing.", sentencePa: "ਤਿੰਨ ਕੁੱਤੇ ਖੇਡ ਰਹੇ ਹਨ।", explainEn: "Add -s for plural.", explainPa: "-s ਜੋੜ ਕੇ ਬਹੁਵਚਨ ਬਣਾਓ।", highlight: "dogs" }]
    },
    { type: "question", english_text: "Which is singular?", punjabi_text: "ਕਿਹੜਾ ਏਕਵਚਨ ਹੈ?",
      options: ["chairs", "pencil", "apples"], correct_answer: "pencil", points: 5,
      examples: [{ sentenceEn: "One pencil is red.", sentencePa: "ਇੱਕ ਪੈਨਸਿਲ ਲਾਲ ਹੈ।", explainEn: "Pencil is singular.", explainPa: "pencil ਏਕਵਚਨ ਹੈ।", highlight: "pencil" }]
    },
    { type: "question", english_text: "Form plural of 'box'.", punjabi_text: "'box' ਦਾ ਬਹੁਵਚਨ ਬਣਾਓ।",
      options: ["boxs", "boxes", "box"], correct_answer: "boxes", points: 5,
      examples: [{ sentenceEn: "I have two boxes.", sentencePa: "ਮੇ ਕੋਲ ਦੋ ਡੱਬੇ ਹਨ।", explainEn: "Words ending in x add -es.", explainPa: "x ਨਾਲ ਖ਼ਤਮ -es ਜੋੜੋ।", highlight: "boxes" }]
    },
    { type: "question", english_text: "Which pair is correct (singular/plural)?",
      punjabi_text: "ਕਿਹੜਾ ਜੋੜਾ ਸਹੀ ਹੈ (ਇੱਕ/ਬਹੁ)?",
      options: ["child/childs", "child/children", "child/childes"], correct_answer: "child/children", points: 5,
      examples: [{ sentenceEn: "The children are playing.", sentencePa: "ਬੱਚੇ ਖੇਡ ਰਹੇ ਹਨ।", explainEn: "Child is irregular (child → children).", explainPa: "child ਅਨਿਯਮਤ ਹੈ।", highlight: "children" }]
    },
    { type: "question", english_text: "Count the singular nouns: cat, dogs, apple, birds",
      punjabi_text: "ਇੱਕਵਚਨ ਨਾਮਾਂ ਦੀ ਗਣਨਾ ਕਰੋ: cat, dogs, apple, birds",
      options: ["one", "two", "three"], correct_answer: "two", points: 5,
      examples: [{ sentenceEn: "I see a cat and an apple.", sentencePa: "ਮੈਂ ਇੱਕ ਬਿੱਲੀ ਅਤੇ ਇੱਕ ਸੇਬ ਵੇਖਦਾ ਹਾਂ।", explainEn: "Cat and apple are singular.", explainPa: "cat ਅਤੇ apple ਇੱਕਵਚਨ ਹਨ।", highlight: "cat, apple" }]
    }
  ]
};

// Stage 2: T_ACTIONS Lessons
__RAW_LESSONS["L_ADVERB_BASICS_01"] = {
  metadata: {
    titleEn: "Adverb Basics", titlePa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਮੁੱਢ",
    trackId: "T_ACTIONS", objective: { titleEn: "Learn: Adverbs", titlePa: "ਸਿੱਖੋ: ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ",
    descEn: "Adverbs tell how actions happen.", descPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਦੱਸਦੇ ਹਨ ਕਿ ਕੰਮ ਕਿਵੇਂ ਹੁੰਦਾ ਹੈ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Adverbs modify verbs. Many end in -ly (quickly, slowly).",
      contentPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਅਕਸਰ -ly ਨਾਲ ਮੁੱਠ ਹੁੰਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "She runs quickly. He speaks softly.", examplePa: "ਉਹ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਦੀ ਹੈ।", points: 1 },
    { type: "question", id: "q_adverbs_pick_quickly", english_text: "Pick the adverb.", punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।",
      options: ["happy", "quickly", "dog"], correct_answer: "quickly", points: 5,
      hint: { en: "Adverb answers: how?", pa: "Adverb = ਕਿਵੇਂ?" },
      explanation: { en: "Adverbs tell how an action happens.", pa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕੰਮ ਕਿਵੇਂ ਹੁੰਦਾ ਦੱਸਦਾ ਹੈ।" },
      workedExample: { en: "He talks softly.", pa: "ਉਹ ਹੌਲੀ ਬੋਲਦਾ ਹੈ।", highlight: { en: ["softly"], pa: ["ਹੌਲੀ"] } },
      examples: [{ sentenceEn: "She works quickly.", sentencePa: "ਉਹ ਤੇਜ਼ੀ ਨਾਲ ਕੰਮ ਕਰਦੀ ਹੈ।", explainEn: "Quickly tells how she works.", explainPa: "quickly ਦੱਸਦਾ ਹੈ ਕਿਵੇਂ।", highlight: "quickly" }]
    },
    { type: "question", id: "q_adverbs_modifies_slowly", english_text: "Which modifies the verb?", punjabi_text: "ਕਿਹੜਾ ਕਿਰਿਆ ਨੂੰ ਮੋਡੀਫਾਈ ਕਰਦਾ ਹੈ?",
      options: ["slow", "slowly", "slowness"], correct_answer: "slowly", points: 5,
      hint: { en: "Look for the -ly word.", pa: "-ly ਵਾਲਾ ਸ਼ਬਦ ਲੱਭੋ।" },
      explanation: { en: "‘slowly’ describes the verb (walk).", pa: "‘slowly’ ਕਿਰਿਆ (ਚਲੋ) ਨੂੰ ਦੱਸਦਾ ਹੈ।" },
      workedExample: { en: "Run slowly.", pa: "ਹੌਲੀ ਦੌੜੋ।", highlight: { en: ["slowly"], pa: ["ਹੌਲੀ"] } },
      examples: [{ sentenceEn: "Walk slowly.", sentencePa: "ਹੌਲੀ-ਹੌਲੀ ਚਲੋ।", explainEn: "Slowly is an adverb.", explainPa: "slowly ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।", highlight: "slowly" }]
    },
    { type: "question", id: "q_adverbs_complete_beautifully", english_text: "Complete: She dances ___.", punjabi_text: "ਪੂਰਾ ਕਰੋ: She dances ___.",
      options: ["beautiful", "beautifully", "beauty"], correct_answer: "beautifully", points: 5,
      hint: { en: "To tell ‘how’, use -ly.", pa: "“ਕਿਵੇਂ” ਲਈ -ly ਵਰਤੋ।" },
      explanation: { en: "Dances needs an adverb: beautifully.", pa: "dances ਲਈ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ: beautifully।" },
      workedExample: { en: "She sings loudly.", pa: "ਉਹ ਉੱਚੀ ਆਵਾਜ਼ ਨਾਲ ਗਾਂਦੀ ਹੈ।", highlight: { en: ["loudly"], pa: ["ਉੱਚੀ ਆਵਾਜ਼"] } },
      examples: [{ sentenceEn: "She dances beautifully.", sentencePa: "ਉਹ ਸੁੰਦਰਤਾ ਨਾਲ ਨੱਚਦੀ ਹੈ।", explainEn: "Beautifully is an adverb.", explainPa: "beautifully ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।", highlight: "beautifully" }]
    },
    { type: "question", id: "q_adverbs_ly_honestly", english_text: "Which -ly word is an adverb?",
      punjabi_text: "ਕਿਹੜਾ -ly ਸ਼ਬਦ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?",
      options: ["friendly", "honestly", "lonely"], correct_answer: "honestly", points: 5,
      hint: { en: "Which word tells HOW he spoke?", pa: "ਉਸਨੇ ਕਿਵੇਂ ਬੋਲਿਆ?" },
      explanation: { en: "‘honestly’ tells the manner of speaking.", pa: "‘honestly’ ਬੋਲਣ ਦਾ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।" },
      workedExample: { en: "She answered honestly.", pa: "ਉਸਨੇ ਸੱਚ-ਸੱਚ ਜਵਾਬ ਦਿੱਤਾ।", highlight: { en: ["honestly"], pa: ["ਸੱਚ"] } },
      examples: [{ sentenceEn: "He spoke honestly.", sentencePa: "ਉਸਨੇ ਸੱਚ ਨਾਲ ਬੋਲਿਆ।", explainEn: "Honestly modifies 'spoke' (verb).", explainPa: "honestly ਕਿਰਿਆ ਨੂੰ ਮੋਡੀਫਾਈ ਕਰਦਾ ਹੈ।", highlight: "honestly" }]
    },
    { type: "question", id: "q_adverbs_non_ly_fast", english_text: "The boy ran ___. Choose the adverb.",
      punjabi_text: "ਲੜਕਾ ___ ਦੌੜਿਆ। ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।",
      options: ["fast", "fastly", "rapid"], correct_answer: "fast", points: 5,
      hint: { en: "Some adverbs don’t end in -ly.", pa: "ਕੁਝ adverbs -ly ਨਾਲ ਨਹੀਂ ਹੁੰਦੇ।" },
      explanation: { en: "‘fast’ can be an adverb: ran fast.", pa: "‘fast’ adverb ਵੀ ਹੁੰਦਾ: ran fast।" },
      workedExample: { en: "He ran fast.", pa: "ਉਹ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਿਆ।", highlight: { en: ["fast"], pa: ["ਤੇਜ਼ੀ ਨਾਲ"] } },
      examples: [{ sentenceEn: "The boy ran fast.", sentencePa: "ਲੜਕਾ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਿਆ।", explainEn: "Fast tells how he ran.", explainPa: "fast ਕਿਵੇਂ ਦੌੜਿਆ ਦੱਸਦਾ ਹੈ।", highlight: "fast" }]
    },
    { type: "question", id: "q_adverbs_sentence_loudly", english_text: "Pick the sentence with an adverb.",
      punjabi_text: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
      options: ["She is happy", "She sings loudly", "She has a book"], correct_answer: "She sings loudly", points: 5,
      hint: { en: "Find a word telling HOW.", pa: "“ਕਿਵੇਂ” ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ ਲੱਭੋ।" },
      explanation: { en: "An adverb modifies a verb: sings loudly.", pa: "Adverb ਕਿਰਿਆ ਨੂੰ ਦੱਸਦਾ: sings loudly।" },
      workedExample: { en: "He runs quickly.", pa: "ਉਹ ਤੇਜ਼ੀ ਨਾਲ ਦੌੜਦਾ ਹੈ।", highlight: { en: ["quickly"], pa: ["ਤੇਜ਼ੀ ਨਾਲ"] } },
      examples: [{ sentenceEn: "He played carefully.", sentencePa: "ਉਸਨੇ ਸਾਵਧਾਨੀ ਨਾਲ ਖੇਡਿਆ।", explainEn: "Carefully is an adverb.", explainPa: "carefully ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਹੈ।", highlight: "carefully" }]
    }
  ]
};

__RAW_LESSONS["L_SIMPLE_PRESENT_01"] = {
  metadata: {
    titleEn: "Simple Present", titlePa: "ਸਧਾਰਣ ਵਰਤਮਾਨ",
    trackId: "T_ACTIONS", objective: { titleEn: "Learn: Present Tense", titlePa: "ਸਿੱਖੋ: ਵਰਤਮਾਨ",
    descEn: "Actions happening now or regularly.", descPa: "ਕੰਮ ਹੁਣ ਜਾਂ ਰੋਜ਼ ਹੁੰਦੇ ਹਨ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Simple present: regular actions or current truth.",
      contentPa: "ਸਧਾਰਣ ਵਰਤਮਾਨ: ਆਮ ਕੰਮ ਜਾਂ ਸਚਾਈ।", points: 1 },
    { type: "example", exampleEn: "I eat. She runs. They play.", examplePa: "ਮੈਂ ਖਾਂਦਾ ਹਾਂ। ਉਹ ਦੌੜਦੀ ਹੈ।", points: 1 },
    { type: "question", id: "q_present_is_walks", english_text: "Which is present tense?", punjabi_text: "ਕਿਹੜਾ ਵਰਤਮਾਨ ਕਾਲ ਹੈ?",
      options: ["walks", "walked", "will walk"], correct_answer: "walks", points: 5,
      hint: { en: "Present = happens regularly/now.", pa: "Present = ਹੁਣ/ਰੋਜ਼।" },
      explanation: { en: "Simple present shows habits and routines.", pa: "ਸਧਾਰਣ ਵਰਤਮਾਨ = ਆਦਤਾਂ/ਰੋਜ਼ ਵਾਲੇ ਕੰਮ।" },
      workedExample: { en: "I play every day.", pa: "ਮੈਂ ਹਰ ਦਿਨ ਖੇਡਦਾ ਹਾਂ।", highlight: { en: ["play"], pa: ["ਹਰ ਦਿਨ"] } },
      examples: [{ sentenceEn: "She walks to school.", sentencePa: "ਉਹ ਸਕੂਲ ਜਾਂਦੀ ਹੈ।", explainEn: "Walks is simple present.", explainPa: "walks ਵਰਤਮਾਨ ਕਾਲ ਹੈ।", highlight: "walks" }]
    },
    { type: "question", id: "q_present_complete_runs", english_text: "Complete: He ___ every day.", punjabi_text: "ਪੂਰਾ ਕਰੋ: He ___ every day.",
      options: ["runs", "ran", "will run"], correct_answer: "runs", points: 5,
      hint: { en: "Every day = present habit.", pa: "ਹਰ ਦਿਨ = ਆਦਤ (present)।" },
      explanation: { en: "With he/she/it, we often add -s: runs.", pa: "he/she/it ਨਾਲ ਅਕਸਰ -s: runs।" },
      workedExample: { en: "She reads daily.", pa: "ਉਹ ਰੋਜ਼ ਪੜ੍ਹਦੀ ਹੈ।", highlight: { en: ["reads"], pa: ["ਰੋਜ਼"] } },
      examples: [{ sentenceEn: "He runs every day.", sentencePa: "ਉਹ ਹਰ ਦਿਨ ਦੌੜਦਾ ਹੈ।", explainEn: "Runs is present.", explainPa: "runs ਵਰਤਮਾਨ ਕਾਲ ਹੈ।", highlight: "runs" }]
    },
    { type: "question", id: "q_present_pick_eats", english_text: "Pick the simple present.", punjabi_text: "ਸਧਾਰਣ ਵਰਤਮਾਨ ਚੁਣੋ।",
      options: ["eats", "ate", "will eat"], correct_answer: "eats", points: 5,
      hint: { en: "Present (she) often ends with -s.", pa: "she ਨਾਲ present ਅਕਸਰ -s ਹੁੰਦਾ।" },
      explanation: { en: "‘eats’ = simple present for she.", pa: "‘eats’ = she ਲਈ ਵਰਤਮਾਨ।" },
      workedExample: { en: "He plays.", pa: "ਉਹ ਖੇਡਦਾ ਹੈ।", highlight: { en: ["plays"], pa: ["ਖੇਡਦਾ"] } },
      examples: [{ sentenceEn: "She eats breakfast.", sentencePa: "ਉਹ ਨਾਸ਼ਤਾ ਕਰਦੀ ਹੈ।", explainEn: "Eats is simple present.", explainPa: "eats ਵਰਤਮਾਨ ਕਾਲ ਹੈ।", highlight: "eats" }]
    },
    { type: "question", id: "q_present_doing_studies", english_text: "What is he doing?", punjabi_text: "ਉਹ ਕੀ ਕਰ ਰਿਹਾ ਹੈ?",
      options: ["studies", "studied", "will study"], correct_answer: "studies", points: 5,
      hint: { en: "Think: his routine (habit).", pa: "ਇਹ ਆਦਤ/ਰੂਟੀਨ ਵਾਲਾ ਕੰਮ ਹੈ।" },
      explanation: { en: "Simple present answers “What does he do (usually)?”", pa: "ਸਧਾਰਣ ਵਰਤਮਾਨ = ਉਹ ਆਮ ਤੌਰ ਤੇ ਕੀ ਕਰਦਾ?" },
      workedExample: { en: "He studies at night.", pa: "ਉਹ ਰਾਤ ਨੂੰ ਪੜ੍ਹਦਾ ਹੈ।", highlight: { en: ["studies"], pa: ["ਪੜ੍ਹਦਾ"] } },
      examples: [{ sentenceEn: "He studies English.", sentencePa: "ਉਹ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖਦਾ ਹੈ।", explainEn: "Studies (present) describes his habit.", explainPa: "studies ਉਸ ਦੀ ਆਦਤ ਹੈ।", highlight: "studies" }]
    },
    { type: "question", english_text: "Which sentence is present tense?",
      punjabi_text: "ਕਿਹੜਾ ਵਾਕ ਵਰਤਮਾਨ ਕਾਲ ਵਿੱਚ ਹੈ?",
      options: ["I played football", "I play football", "I will play football"], correct_answer: "I play football", points: 5,
      examples: [{ sentenceEn: "She works as a teacher.", sentencePa: "ਉਹ ਅਧਿਆਪਕ ਦੇ ਤੌਰ ਤੇ ਕੰਮ ਕਰਦੀ ਹੈ।", explainEn: "Works shows her current job.", explainPa: "works ਉਸ ਦਾ ਮੌਜੂਦਾ ਕੰਮ।", highlight: "works" }]
    },
    { type: "question", id: "q_present_form_drink", english_text: "Form present: I ___ water daily.",
      punjabi_text: "ਵਰਤਮਾਨ ਬਣਾਓ: I ___ water daily.",
      options: ["drink", "drinks", "drinking"], correct_answer: "drink", points: 5,
      hint: { en: "With I/we/they/you, use base verb.", pa: "I/we/they/you ਨਾਲ ਮੂਲ ਕਿਰਿਆ।" },
      explanation: { en: "I + drink (no -s).", pa: "I + drink (-s ਨਹੀਂ)।" },
      workedExample: { en: "We drink water.", pa: "ਅਸੀਂ ਪਾਣੀ ਪੀਂਦੇ ਹਾਂ।", highlight: { en: ["drink"], pa: ["ਪੀਂਦੇ"] } },
      examples: [{ sentenceEn: "They drink milk.", sentencePa: "ਉਹ ਦੁੱਧ ਪੀਂਦੇ ਹਨ।", explainEn: "Drink (plural) is present.", explainPa: "drink ਵਰਤਮਾਨ ਕਾਲ ਹੈ।", highlight: "drink" }]
    }
  ]
};

__RAW_LESSONS["L_SIMPLE_PAST_01"] = {
  metadata: {
    titleEn: "Simple Past", titlePa: "ਸਧਾਰਣ ਭੂਤਕਾਲ",
    trackId: "T_ACTIONS", objective: { titleEn: "Learn: Past Tense", titlePa: "ਸਿੱਖੋ: ਭੂਤਕਾਲ",
    descEn: "Actions that already happened.", descPa: "ਕੰਮ ਜੋ ਪਹਿਲਾਂ ਹੋ ਚੁੱਕੇ।", pointsAvailable: 32 }, difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Simple past: actions that finished. Most add -ed.",
      contentPa: "ਸਧਾਰਣ ਭੂਤਕਾਲ: ਖ਼ਤਮ ਹੋ ਚੁੱਕੇ ਕੰਮ। ਆਮ ਤੌਰ ਤੇ -ed ਜੋੜੋ।", points: 1 },
    { type: "example", exampleEn: "I played. She walked. They ran.", examplePa: "ਮੈਂ ਖੇਡਿਆ। ਉਹ ਚਲੀ।", points: 1 },
    { type: "question", id: "q_past_is_played", english_text: "Which is past tense?", punjabi_text: "ਕਿਹੜਾ ਭੂਤਕਾਲ ਹੈ?",
      options: ["plays", "played", "play"], correct_answer: "played", points: 5,
      hint: { en: "Past = already happened.", pa: "Past = ਪਹਿਲਾਂ ਹੋ ਚੁੱਕਾ।" },
      explanation: { en: "Many past verbs end in -ed.", pa: "ਕਈ ਭੂਤਕਾਲ ਵਿੱਚ -ed ਆਉਂਦਾ ਹੈ।" },
      workedExample: { en: "I jumped.", pa: "ਮੈਂ ਛਾਲ ਮਾਰੀ।", highlight: { en: ["jumped"], pa: ["ਮਾਰੀ"] } },
      examples: [{ sentenceEn: "She played football yesterday.", sentencePa: "ਕਲ ਉਹ ਫੁੱਟਬਾਲ ਖੇਡੀ।", explainEn: "Played is past tense.", explainPa: "played ਭੂਤਕਾਲ ਹੈ।", highlight: "played" }]
    },
    { type: "question", id: "q_past_form_walked", english_text: "Form past: 'walk'.", punjabi_text: "ਭੂਤਕਾਲ ਬਣਾਓ: 'walk'.",
      options: ["walk", "walked", "walks"], correct_answer: "walked", points: 5,
      hint: { en: "Add -ed.", pa: "ਅਖੀਰ ‘-ed’ ਜੋੜੋ।" },
      explanation: { en: "walk → walked for past.", pa: "walk → walked (ਭੂਤਕਾਲ)।" },
      workedExample: { en: "We walked home.", pa: "ਅਸੀਂ ਘਰ ਤੁਰ ਕੇ ਗਏ।", highlight: { en: ["walked"], pa: ["ਗਏ"] } },
      examples: [{ sentenceEn: "They walked to school.", sentencePa: "ਉਹ ਸਕੂਲ ਚਲੇ ਗਏ।", explainEn: "Walked is past (walk + ed).", explainPa: "walked ਭੂਤਕਾਲ ਹੈ।", highlight: "walked" }]
    },
    { type: "question", id: "q_past_complete_ate", english_text: "Complete: We ___ pizza last week.", punjabi_text: "ਪੂਰਾ ਕਰੋ: We ___ pizza last week.",
      options: ["eat", "ate", "eating"], correct_answer: "ate", points: 5,
      hint: { en: "Eat has a special past form.", pa: "eat ਦਾ past ਵੱਖਰਾ ਹੁੰਦਾ ਹੈ।" },
      explanation: { en: "eat → ate (not eated).", pa: "eat → ate (eated ਨਹੀਂ)।" },
      workedExample: { en: "I ate an apple.", pa: "ਮੈਂ ਸੇਬ ਖਾਧਾ।", highlight: { en: ["ate"], pa: ["ਖਾਧਾ"] } },
      examples: [{ sentenceEn: "We ate pizza yesterday.", sentencePa: "ਕਲ ਅਸੀਂ ਪਿਜ਼ਾ ਖਾਧਾ।", explainEn: "Ate is past (irregular).", explainPa: "ate ਭੂਤਕਾਲ ਹੈ।", highlight: "ate" }]
    },
    { type: "question", id: "q_past_time_yesterday", english_text: "What time word shows past?", punjabi_text: "ਕਿਹੜਾ ਸਮਾਂ ਭੂਤਕਾਲ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["tomorrow", "yesterday", "next week"], correct_answer: "yesterday", points: 5,
      hint: { en: "Past time word = yesterday.", pa: "ਭੂਤਕਾਲ ਦਾ ਸ਼ਬਦ = yesterday (ਕੱਲ)।" },
      explanation: { en: "Yesterday tells it happened before today.", pa: "yesterday = ਅੱਜ ਤੋਂ ਪਹਿਲਾਂ।" },
      workedExample: { en: "Yesterday I played.", pa: "ਕਲ ਮੈਂ ਖੇਡਿਆ।", highlight: { en: ["Yesterday"], pa: ["ਕਲ"] } },
      examples: [{ sentenceEn: "I went yesterday.", sentencePa: "ਮੈਂ ਕਲ ਗਿਆ।", explainEn: "Yesterday = past time.", explainPa: "yesterday ਭੂਤਕਾਲ ਦਾ ਸਮਾਂ।", highlight: "yesterday" }]
    },
    { type: "question", id: "q_past_form_saw", english_text: "Form past tense: 'see'", punjabi_text: "ਭੂਤਕਾਲ ਬਣਾਓ: 'see'",
      options: ["see", "seeд", "saw"], correct_answer: "saw", points: 5,
      hint: { en: "See → ?", pa: "See ਦਾ past ਕੀ?" },
      explanation: { en: "see → saw (special past form).", pa: "see → saw (ਵੱਖਰਾ ਰੂਪ)।" },
      workedExample: { en: "I saw a bird.", pa: "ਮੈਂ ਪੰਛੀ ਵੇਖਿਆ।", highlight: { en: ["saw"], pa: ["ਵੇਖਿਆ"] } },
      examples: [{ sentenceEn: "I saw a movie.", sentencePa: "ਮੈਂ ਇੱਕ ਫਿਲਮ ਵੇਖੀ।", explainEn: "Saw is irregular past.", explainPa: "saw ਅਨਿਯਮਤ ਭੂਤਕਾਲ।", highlight: "saw" }]
    },
    { type: "question", id: "q_past_completed_i_ate", english_text: "Which shows a completed action?",
      punjabi_text: "ਕਿਹੜਾ ਪੂਰਾ ਹੋਇਆ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["I eat", "I ate", "I will eat"], correct_answer: "I ate", points: 5,
      hint: { en: "Completed = past form.", pa: "ਪੂਰਾ ਹੋਇਆ = past ਰੂਪ।" },
      explanation: { en: "Past shows the action is already done.", pa: "ਭੂਤਕਾਲ = ਕੰਮ ਹੋ ਚੁੱਕਾ।" },
      workedExample: { en: "I ate.", pa: "ਮੈਂ ਖਾਧਾ।", highlight: { en: ["ate"], pa: ["ਖਾਧਾ"] } },
      examples: [{ sentenceEn: "She finished her homework.", sentencePa: "ਉਸਨੇ ਆਪਣਾ ਹੋਮਵਰਕ ਮੁਕਾ ਲਿਆ।", explainEn: "Finished (past) = already done.", explainPa: "finished ਪਹਿਲਾਂ ਜਾਂ ਪੂਰਾ ਹੋਇਆ।", highlight: "finished" }]
    }
  ]
};

__RAW_LESSONS["L_SIMPLE_FUTURE_01"] = {
  metadata: {
    titleEn: "Simple Future", titlePa: "ਸਧਾਰਣ ਭਵਿੱਖ",
    trackId: "T_ACTIONS", objective: { titleEn: "Learn: Future Tense", titlePa: "ਸਿੱਖੋ: ਭਵਿੱਖ",
    descEn: "Actions that will happen.", descPa: "ਕੰਮ ਜੋ ਹੋਣਗੇ।", pointsAvailable: 32 }, difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Simple future: will + base verb.",
      contentPa: "ਸਧਾਰਣ ਭਵਿੱਖ: will + ਮੂਲ ਸ਼ਬਦ।", points: 1 },
    { type: "example", exampleEn: "I will go. She will run. They will play.", examplePa: "ਮੈਂ ਜਾਵਾਂਗਾ। ਉਹ ਦੌੜੇਗੀ।", points: 1 },
    { type: "question", id: "q_future_is_will_visit", english_text: "Which is future?", punjabi_text: "ਕਿਹੜਾ ਭਵਿੱਖ ਕਾਲ ਹੈ?",
      options: ["visits", "visited", "will visit"], correct_answer: "will visit", points: 5,
      hint: { en: "Future = will + verb.", pa: "Future = will + ਕਿਰਿਆ।" },
      explanation: { en: "Use ‘will’ for things that will happen later.", pa: "‘will’ ਨਾਲ ਭਵਿੱਖ ਵਾਲਾ ਕੰਮ ਦੱਸਦੇ ਹਾਂ।" },
      workedExample: { en: "I will play.", pa: "ਮੈਂ ਖੇਡਾਂਗਾ/ਖੇਡਾਂਗੀ।", highlight: { en: ["will"], pa: ["ਗਾ", "ਗੀ"] } },
      examples: [{ sentenceEn: "We will visit next week.", sentencePa: "ਅਗਲੇ ਹਫ਼ਤੇ ਅਸੀਂ ਜਾਵਾਂਗੇ।", explainEn: "Will visit is future.", explainPa: "will visit ਭਵਿੱਖ ਕਾਲ ਹੈ।", highlight: "will visit" }]
    },
    { type: "question", id: "q_future_complete_will_read", english_text: "Complete: I ___ a book tomorrow.", punjabi_text: "ਪੂਰਾ ਕਰੋ: I ___ a book tomorrow.",
      options: ["read", "reads", "will read"], correct_answer: "will read", points: 5,
      hint: { en: "Tomorrow = future.", pa: "Tomorrow = ਭਵਿੱਖ।" },
      explanation: { en: "Tomorrow needs will + read.", pa: "tomorrow ਨਾਲ will + read।" },
      workedExample: { en: "We will read later.", pa: "ਅਸੀਂ ਬਾਅਦ ਵਿੱਚ ਪੜ੍ਹਾਂਗੇ।", highlight: { en: ["will read"], pa: ["ਪੜ੍ਹਾਂਗੇ"] } },
      examples: [{ sentenceEn: "She will read tomorrow.", sentencePa: "ਕਲ ਉਹ ਪੜ੍ਹੇਗੀ।", explainEn: "Will read is future.", explainPa: "will read ਭਵਿੱਖ ਕਾਲ ਹੈ।", highlight: "will read" }]
    },
    { type: "question", id: "q_future_pick_will_go", english_text: "Pick the future tense.", punjabi_text: "ਭਵਿੱਖ ਕਾਲ ਚੁਣੋ।",
      options: ["goes", "went", "will go"], correct_answer: "will go", points: 5,
      hint: { en: "Look for “will”.", pa: "“will” ਲੱਭੋ।" },
      explanation: { en: "Future tense usually has ‘will’.", pa: "ਭਵਿੱਖ ਕਾਲ ਵਿੱਚ ਅਕਸਰ ‘will’ ਹੁੰਦਾ ਹੈ।" },
      workedExample: { en: "He will go home.", pa: "ਉਹ ਘਰ ਜਾਵੇਗਾ।", highlight: { en: ["will go"], pa: ["ਜਾਵੇਗਾ"] } },
      examples: [{ sentenceEn: "They will go next month.", sentencePa: "ਅਗਲੇ ਮਹੀਨੇ ਉਹ ਜਾਵਾਂਗੇ।", explainEn: "Will go is future.", explainPa: "will go ਭਵਿੱਖ ਕਾਲ ਹੈ।", highlight: "will go" }]
    },
    { type: "question", id: "q_future_time_tomorrow", english_text: "What time word shows future?", punjabi_text: "ਕਿਹੜਾ ਸਮਾਂ ਭਵਿੱਖ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["yesterday", "now", "tomorrow"], correct_answer: "tomorrow", points: 5,
      hint: { en: "Future time word = tomorrow.", pa: "ਭਵਿੱਖ ਦਾ ਸ਼ਬਦ = tomorrow (ਕੱਲ)।" },
      explanation: { en: "Tomorrow means the next day (later).", pa: "tomorrow = ਅਗਲਾ ਦਿਨ।" },
      workedExample: { en: "Tomorrow I will come.", pa: "ਕੱਲ ਮੈਂ ਆਵਾਂਗਾ।", highlight: { en: ["Tomorrow"], pa: ["ਕੱਲ"] } },
      examples: [{ sentenceEn: "I will see you tomorrow.", sentencePa: "ਕਲ ਮੈਂ ਤੁਹਾਨੂੰ ਮਿਲਵਾਂ।", explainEn: "Tomorrow = future time.", explainPa: "tomorrow ਭਵਿੱਖ ਦਾ ਸਮਾਂ।", highlight: "tomorrow" }]
    },
    { type: "question", id: "q_future_form_will_bake", english_text: "Form future: I ___ cake next Sunday.",
      punjabi_text: "ਭਵਿੱਖ ਬਣਾਓ: I ___ cake next Sunday.",
      options: ["bake", "baked", "will bake"], correct_answer: "will bake", points: 5,
      hint: { en: "Next Sunday = will + verb.", pa: "ਅਗਲਾ ਐਤਵਾਰ = will + ਕਿਰਿਆ।" },
      explanation: { en: "Future plan: will bake.", pa: "ਭਵਿੱਖ ਦੀ ਯੋਜਨਾ: will bake।" },
      workedExample: { en: "I will bake a cake.", pa: "ਮੈਂ ਕੇਕ ਬਨਾਵਾਂਗਾ।", highlight: { en: ["will bake"], pa: ["ਬਨਾਵਾਂ"] } },
      examples: [{ sentenceEn: "She will bake cookies.", sentencePa: "ਉਹ ਕੂਕੀਜ਼ ਬਨਾਏਗੀ।", explainEn: "Will bake = future action.", explainPa: "will bake ਭਵਿੱਖ ਹੈ।", highlight: "will bake" }]
    },
    { type: "question", id: "q_future_not_yet_will_learn", english_text: "Which shows something NOT yet done?",
      punjabi_text: "ਕਿਹੜਾ ਅਜੇ ਨਾ ਹੋਇਆ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["I learned", "I learn", "I will learn"], correct_answer: "I will learn", points: 5,
      hint: { en: "Not yet done = will.", pa: "ਅਜੇ ਨਹੀਂ = will।" },
      explanation: { en: "‘will’ means it will happen later.", pa: "‘will’ = ਬਾਅਦ ਵਿੱਚ ਹੋਵੇਗਾ।" },
      workedExample: { en: "I will learn tomorrow.", pa: "ਮੈਂ ਕੱਲ ਸਿੱਖਾਂਗਾ।", highlight: { en: ["will learn"], pa: ["ਸਿੱਖਾਂ"] } },
      examples: [{ sentenceEn: "He will finish soon.", sentencePa: "ਉਹ ਜਲਦੀ ਜਾਂ ਪੂਰਾ ਕਰ ਲੇਵੇਗਾ।", explainEn: "Will finish = not yet done.", explainPa: "will finish ਅਜੇ ਨਹੀਂ ਹੋਇਆ।", highlight: "will finish" }]
    }
  ]
};

// Stage 3: T_DESCRIBE + T_SENTENCE Lessons
__RAW_LESSONS["L_ADJECTIVE_BASICS_01"] = {
  metadata: {
    titleEn: "Adjective Basics", titlePa: "ਵਿਸ਼ੇਸ਼ਣ ਮੁੱਢ",
    trackId: "T_DESCRIBE", objective: { titleEn: "Learn: Adjectives", titlePa: "ਸਿੱਖੋ: ਵਿਸ਼ੇਸ਼ਣ",
    descEn: "Words that describe nouns.", descPa: "ਸ਼ਬਦ ਜੋ ਨਾਮ ਦੀ ਵਰਣਨਾ ਕਰਦੇ ਹਨ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Adjectives describe nouns (big, red, happy).",
      contentPa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਦੀ ਵਰਣਨਾ ਕਰਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "A red apple. A big house. Happy children.", examplePa: "ਲਾਲ ਸੇਬ। ਵੱਡਾ ਘਰ। ਖੁਸ਼ ਬੱਚੇ।", points: 1 },
    { type: "question", id: "q_adj_is_blue", english_text: "Which is an adjective?", punjabi_text: "ਕਿਹੜਾ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?",
      options: ["blue", "run", "quickly"], correct_answer: "blue", points: 5,
      hint: { en: "Adjective = describing word.", pa: "ਵਿਸ਼ੇਸ਼ਣ = ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ।" },
      explanation: { en: "Adjectives tell what kind of noun.", pa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਬਾਰੇ ਦੱਸਦਾ (ਕਿਹੋ ਜਿਹਾ)।" },
      workedExample: { en: "a red ball", pa: "ਲਾਲ ਗੇਂਦ", highlight: { en: ["red"], pa: ["ਲਾਲ"] } },
      examples: [{ sentenceEn: "A blue sky.", sentencePa: "ਨੀਲਾ ਅਸਮਾਨ।", explainEn: "Blue describes the sky.", explainPa: "blue ਆਸਮਾਨ ਦੀ ਵਰਣਨਾ ਕਰਦਾ ਹੈ।", highlight: "blue" }]
    },
    { type: "question", id: "q_adj_pick_tall", english_text: "Pick the adjective.", punjabi_text: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।",
      options: ["tree", "tall", "grows"], correct_answer: "tall", points: 5,
      hint: { en: "Which word tells size/shape?", pa: "ਕਿਹੜਾ ਸ਼ਬਦ ਆਕਾਰ ਦੱਸਦਾ?" },
      explanation: { en: "‘tall’ describes the noun ‘tree’.", pa: "‘tall’ ‘tree’ ਨੂੰ ਵਰਣਨ ਕਰਦਾ ਹੈ।" },
      workedExample: { en: "a tall boy", pa: "ਲੰਬਾ ਮੁੰਡਾ", highlight: { en: ["tall"], pa: ["ਲੰਬਾ"] } },
      examples: [{ sentenceEn: "A tall tree.", sentencePa: "ਲੰਬਾ ਦਰਖ਼ਤ।", explainEn: "Tall describes the tree.", explainPa: "tall ਦਰਖ਼ਤ ਦੀ ਵਰਣਨਾ ਕਰਦਾ ਹੈ।", highlight: "tall" }]
    },
    { type: "question", id: "q_adj_complete_interesting", english_text: "Complete: An ___ book.", punjabi_text: "ਪੂਰਾ ਕਰੋ: An ___ book.",
      options: ["interesting", "read", "quickly"], correct_answer: "interesting", points: 5,
      hint: { en: "We need a describing word for book.", pa: "ਕਿਤਾਬ ਲਈ ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚਾਹੀਦਾ।" },
      explanation: { en: "Adjective goes before the noun: interesting book.", pa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਮ ਤੋਂ ਪਹਿਲਾਂ: interesting book।" },
      workedExample: { en: "an easy game", pa: "ਆਸਾਨ ਖੇਡ", highlight: { en: ["easy"], pa: ["ਆਸਾਨ"] } },
      examples: [{ sentenceEn: "An interesting book.", sentencePa: "ਦਿਲਚਸਪ ਕਿਤਾਬ।", explainEn: "Interesting describes the book.", explainPa: "interesting ਕਿਤਾਬ ਦੀ ਵਰਣਨਾ ਕਰਦਾ ਹੈ।", highlight: "interesting" }]
    },
    { type: "question", id: "q_adj_is_sweet", english_text: "Which word is an adjective?", punjabi_text: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?",
      options: ["sweet", "eat", "walk"], correct_answer: "sweet", points: 5,
      hint: { en: "Taste word = adjective.", pa: "ਸਵਾਦ ਵਾਲਾ ਸ਼ਬਦ = ਵਿਸ਼ੇਸ਼ਣ।" },
      explanation: { en: "Sweet tells what kind of candy.", pa: "sweet ਦੱਸਦਾ ਕਿਹੋ ਜਿਹੀ ਮਿਠਾਈ।" },
      workedExample: { en: "sweet mango", pa: "ਮਿੱਠਾ ਆਮ", highlight: { en: ["sweet"], pa: ["ਮਿੱਠਾ"] } },
      examples: [{ sentenceEn: "Sweet candy.", sentencePa: "ਮਿੱਠੀ ਮਿਠਾਈ।", explainEn: "Sweet describes the candy.", explainPa: "sweet ਮਿਠਾਈ ਦੀ ਵਰਣਨਾ ਕਰਦਾ ਹੈ।", highlight: "sweet" }]
    },
    { type: "question", english_text: "Adjectives can describe size. Which is size?",
      punjabi_text: "ਵਿਸ਼ੇਸ਼ਣ ਆਕਾਰ ਦਾ ਵਰਣਨ ਕਰ ਸਕਦੇ ਹਨ। ਕਿਹੜਾ ਆਕਾਰ ਹੈ?",
      options: ["tiny", "happy", "cold"], correct_answer: "tiny", points: 5,
      examples: [{ sentenceEn: "A tiny ant.", sentencePa: "ਬਹੁਤ ਛੋਟੀ ਚੀਂਟੀ।", explainEn: "Tiny describes size.", explainPa: "tiny ਆਕਾਰ ਦਾ ਵਰਣਨ ਹੈ।", highlight: "tiny" }]
    },
    { type: "question", id: "q_adj_sentence_smart", english_text: "Which sentence has an adjective?",
      punjabi_text: "ਕਿਹੜੇ ਵਾਕ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?",
      options: ["He runs", "She is smart", "I walked"], correct_answer: "She is smart", points: 5,
      hint: { en: "Find the describing word.", pa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਲੱਭੋ।" },
      explanation: { en: "‘smart’ is an adjective describing a person.", pa: "‘smart’ ਵਿਅਕਤੀ ਨੂੰ ਵਰਣਨ ਕਰਦਾ ਹੈ।" },
      workedExample: { en: "He is brave.", pa: "ਉਹ ਬਹਾਦੁਰ ਹੈ।", highlight: { en: ["brave"], pa: ["ਬਹਾਦੁਰ"] } },
      examples: [{ sentenceEn: "The smart student answered.", sentencePa: "ਹੋਸ਼ਿਆਰ ਵਿਦਿਆਰਥੀ ਨੇ ਜਵਾਬ ਦਿੱਤਾ।", explainEn: "Smart describes the student.", explainPa: "smart ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਰਣਨ ਕਰਦਾ ਹੈ।", highlight: "smart" }]
    }
  ]
};

__RAW_LESSONS["L_PREPOSITION_BASICS_01"] = {
  metadata: {
    titleEn: "Preposition Basics", titlePa: "ਪੂਰਵ-ਬੋਧਕ ਮੁੱਢ",
    trackId: "T_SENTENCE", objective: { titleEn: "Learn: Prepositions", titlePa: "ਸਿੱਖੋ: ਪੂਰਵ-ਬੋਧਕ",
    descEn: "Relationship words.", descPa: "ਸੰਬੰਧ ਦੇ ਸ਼ਬਦ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Prepositions show position (in, on, under, between).",
      contentPa: "ਪੂਰਵ-ਬੋਧਕ ਸਥਾਨ ਦਿਖਾਉਂਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "In the box. On the table. Under the bed.", examplePa: "ਡੱਬੇ ਵਿੱਚ। ਮੇਜ਼ ਉੱਪਰ। ਪਲੰਗ ਦੇ ਹੇਠਾਂ।", points: 1 },
    { type: "question", english_text: "Pick the preposition.", punjabi_text: "ਪੂਰਵ-ਬੋਧਕ ਚੁਣੋ।",
      options: ["to", "happy", "run"], correct_answer: "to", points: 5,
      examples: [{ sentenceEn: "I went to school.", sentencePa: "ਮੈਂ ਸਕੂਲ ਗਿਆ।", explainEn: "To shows direction.", explainPa: "to ਦਿਸ਼ਾ ਦਿਖਾਉਂਦਾ ਹੈ।", highlight: "to" }]
    },
    { type: "question", english_text: "Complete: The cat is ___ the chair.", punjabi_text: "ਪੂਰਾ ਕਰੋ: The cat is ___ the chair.",
      options: ["in", "run", "happy"], correct_answer: "in", points: 5,
      examples: [{ sentenceEn: "The cat is in the house.", sentencePa: "ਬਿੱਲੀ ਘਰ ਵਿੱਚ ਹੈ।", explainEn: "In shows location.", explainPa: "in ਜਗ੍ਹਾ ਦੀ ਥਾਂ।", highlight: "in" }]
    },
    { type: "question", english_text: "Which is a preposition?", punjabi_text: "ਕਿਹੜਾ ਪੂਰਵ-ਬੋਧਕ ਹੈ?",
      options: ["happy", "between", "walk"], correct_answer: "between", points: 5,
      examples: [{ sentenceEn: "Between two trees.", sentencePa: "ਦੋ ਦਰਖ਼ਤਾਂ ਦੇ ਵਿਚਲੇ।", explainEn: "Between shows position.", explainPa: "between ਥਾਂ ਨੂੰ ਦਿਖਾਉਂਦਾ ਹੈ।", highlight: "between" }]
    },
    { type: "question", english_text: "The book is ___ the desk.", punjabi_text: "ਕਿਤਾਬ ___ ਮੇਜ਼ ਹੈ।",
      options: ["on", "run", "big"], correct_answer: "on", points: 5,
      examples: [{ sentenceEn: "The pen is on the table.", sentencePa: "ਪੈਨ ਮੇਜ਼ ਉੱਪਰ ਹੈ।", explainEn: "On shows surface position.", explainPa: "on ਸਤ੍ਹਾ ਤੇ ਜਗ੍ਹਾ।", highlight: "on" }]
    },
    { type: "question", english_text: "Which preposition shows time?", punjabi_text: "ਕਿਹੜਾ ਪੂਰਵ-ਬੋਧਕ ਸਮਾਂ ਦਿਖਾਉਂਦਾ ਹੈ?",
      options: ["in", "at", "through"], correct_answer: "at", points: 5,
      examples: [{ sentenceEn: "I arrive at 3 PM.", sentencePa: "ਮੈਂ 3 ਵਜੇ ਪਹੁੰਚਦਾ ਹਾਂ।", explainEn: "At shows specific time.", explainPa: "at ਖਾਸ ਸਮਾਂ ਦਿਖਾਉਂਦਾ ਹੈ।", highlight: "at" }]
    },
    { type: "question", english_text: "Pick the sentence with a preposition.",
      punjabi_text: "ਪੂਰਵ-ਬੋਧਕ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
      options: ["She is happy", "He goes under the bridge", "It is blue"], correct_answer: "He goes under the bridge", points: 5,
      examples: [{ sentenceEn: "The bridge is over the river.", sentencePa: "ਪੁਲ ਨਦੀ ਉੱਪਰ ਹੈ।", explainEn: "Over is a preposition.", explainPa: "over ਪੂਰਵ-ਬੋਧਕ ਹੈ।", highlight: "over" }]
    }
  ]
};

__RAW_LESSONS["L_CONJUNCTION_BASICS_01"] = {
  metadata: {
    titleEn: "Conjunction Basics", titlePa: "ਸੰਯੋਜਕ ਮੁੱਢ",
    trackId: "T_SENTENCE", objective: { titleEn: "Learn: Conjunctions", titlePa: "ਸਿੱਖੋ: ਸੰਯੋਜਕ",
    descEn: "Connecting words.", descPa: "ਜੋੜਨ ਵਾਲੇ ਸ਼ਬਦ।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Conjunctions connect ideas (and, but, or).",
      contentPa: "ਸੰਯੋਜਕ ਵਿਚਾਰਾਂ ਨੂੰ ਜੋੜਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "Apples and oranges. Big but slow. Tea or coffee.", examplePa: "ਸੇਬ ਅਤੇ ਸੰਤਰੇ। ਵੱਡਾ ਪਰ ਹੌਲੀ।", points: 1 },
    { type: "question", english_text: "Pick the conjunction.", punjabi_text: "ਸੰਯੋਜਕ ਚੁਣੋ।",
      options: ["happy", "and", "run"], correct_answer: "and", points: 5,
      examples: [{ sentenceEn: "Cats and dogs.", sentencePa: "ਬਿੱਲੀਆਂ ਅਤੇ ਕੁੱਤੇ।", explainEn: "And connects two nouns.", explainPa: "and ਦੋ ਨਾਮਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।", highlight: "and" }]
    },
    { type: "question", english_text: "Complete: I like pizza ___ burger.", punjabi_text: "ਪੂਰਾ ਕਰੋ: I like pizza ___ burger.",
      options: ["or", "and", "but"], correct_answer: "or", points: 5,
      examples: [{ sentenceEn: "Tea or coffee?", sentencePa: "ਚਾਹ ਜਾਂ ਕਾਫ਼ੀ?", explainEn: "Or offers a choice.", explainPa: "or ਚੋਣ ਦਿੰਦਾ ਹੈ।", highlight: "or" }]
    },
    { type: "question", english_text: "Which is a conjunction?", punjabi_text: "ਕਿਹੜਾ ਸੰਯੋਜਕ ਹੈ?",
      options: ["fast", "because", "blue"], correct_answer: "because", points: 5,
      examples: [{ sentenceEn: "I am happy because you are here.", sentencePa: "ਮੈਂ ਖੁਸ਼ ਹਾਂ ਕਿਉਂਕਿ ਤੁਸੀਂ ਇੱਥੇ ਹੋ।", explainEn: "Because joins a reason.", explainPa: "because ਕਾਰਨ ਜੋੜਦਾ ਹੈ।", highlight: "because" }]
    },
    { type: "question", english_text: "This word shows contrast: ___", punjabi_text: "ਇਹ ਸ਼ਬਦ ਭਿੰਨਤਾ ਦਿਖਾਉਂਦਾ ਹੈ: ___",
      options: ["and", "but", "or"], correct_answer: "but", points: 5,
      examples: [{ sentenceEn: "He is tall but shy.", sentencePa: "ਉਹ ਲੰਬਾ ਪਰ ਸ਼ਰਮਾਲਾ ਹੈ।", explainEn: "But shows opposite ideas.", explainPa: "but ਵਿਪਰੀਤ ਵਿਚਾਰ ਜੋੜਦਾ ਹੈ।", highlight: "but" }]
    },
    { type: "question", english_text: "Choose the correct use of 'and'.",
      punjabi_text: "'and' ਦੀ ਸਹੀ ਵਰਤੋਂ ਚੁਣੋ।",
      options: ["Apples and oranges", "Run and quickly", "Happy and run"], correct_answer: "Apples and oranges", points: 5,
      examples: [{ sentenceEn: "Pens and pencils.", sentencePa: "ਪੈਨ ਅਤੇ ਪੈਨਸਿਲਾਂ।", explainEn: "And joins similar words.", explainPa: "and ਸਮਾਨ ਸ਼ਬਦ ਜੋੜਦਾ ਹੈ।", highlight: "and" }]
    },
    { type: "question", english_text: "Conjunctions connect ___ together.",
      punjabi_text: "ਸੰਯੋਜਕ ___ ਨੂੰ ਜੋੜਦੇ ਹਨ।",
      options: ["letters", "words or ideas", "sounds"], correct_answer: "words or ideas", points: 5,
      examples: [{ sentenceEn: "I like pizza and you like salad.", sentencePa: "ਮੈਂ ਪਿਜ਼ਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ ਅਤੇ ਤੁਸੀਂ ਸਲਾਦ ਪਸੰਦ ਕਰਦੇ ਹੋ।", explainEn: "And joins two ideas.", explainPa: "and ਦੋ ਵਿਚਾਰ ਜੋੜਦਾ ਹੈ।", highlight: "and" }]
    }
  ]
};

__RAW_LESSONS["L_ARTICLE_BASICS_01"] = {
  metadata: {
    titleEn: "Article Basics", titlePa: "ਲੇਖ ਮੁੱਢ",
    trackId: "T_SENTENCE", objective: { titleEn: "Learn: Articles", titlePa: "ਸਿੱਖੋ: ਲੇਖ",
    descEn: "A, An, The.", descPa: "A, An, The।", pointsAvailable: 32 }, difficulty: 1
  },
  steps: [
    { type: "definition", contentEn: "Articles go before nouns: a, an (indefinite), the (definite).",
      contentPa: "ਲੇਖ ਨਾਮ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦੇ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "A cat. An apple. The sky.", examplePa: "ਇੱਕ ਬਿੱਲੀ। ਇੱਕ ਸੇਬ। ਆਸਮਾਨ।", points: 1 },
    { type: "question", english_text: "Pick the article.", punjabi_text: "ਲੇਖ ਚੁਣੋ।",
      options: ["the", "cat", "happy"], correct_answer: "the", points: 5,
      examples: [{ sentenceEn: "The dog is sleeping.", sentencePa: "ਕੁੱਤਾ ਸੋ ਰਿਹਾ ਹੈ।", explainEn: "The is a definite article.", explainPa: "the ਨਿਸ਼ਚਿਤ ਲੇਖ ਹੈ।", highlight: "the" }]
    },
    { type: "question", english_text: "Complete: ___ apple.", punjabi_text: "ਪੂਰਾ ਕਰੋ: ___ apple.",
      options: ["a", "an", "the"], correct_answer: "an", points: 5,
      examples: [{ sentenceEn: "An apple a day.", sentencePa: "ਰੋਜ਼ ਇੱਕ ਸੇਬ।", explainEn: "An comes before vowel sounds.", explainPa: "an ਸਵਰ ਤੋਂ ਪਹਿਲਾਂ।", highlight: "an" }]
    },
    { type: "question", english_text: "Which is correct?", punjabi_text: "ਕਿਹੜਾ ਸਹੀ ਹੈ?",
      options: ["a apple", "an apple", "the apple"], correct_answer: "an apple", points: 5,
      examples: [{ sentenceEn: "I want an orange.", sentencePa: "ਮੈਂ ਸੰਤਰਾ ਚਾਹਦਾ ਹਾਂ।", explainEn: "An before vowel (orange starts with 'o').", explainPa: "an ਸਵਰ ਤੋਂ ਪਹਿਲਾਂ।", highlight: "an" }]
    },
    { type: "question", english_text: "When do we use 'the'?", punjabi_text: "ਅਸੀਂ 'the' ਕਦੋਂ ਵਰਤਦੇ ਹਾਂ?",
      options: ["for any noun", "for specific nouns", "for colors"], correct_answer: "for specific nouns", points: 5,
      examples: [{ sentenceEn: "The teacher is kind.", sentencePa: "ਅਧਿਆਪਕ ਮਿਹਰਬਾਨ ਹੈ।", explainEn: "The = specific teacher.", explainPa: "the ਖਾਸ ਅਧਿਆਪਕ।", highlight: "the" }]
    },
    { type: "question", english_text: "Choose the correct sentence.",
      punjabi_text: "ਸਹੀ ਵਾਕ ਚੁਣੋ।",
      options: ["I have a dog", "I have an dog", "I have the dogs"], correct_answer: "I have a dog", points: 5,
      examples: [{ sentenceEn: "She is a doctor.", sentencePa: "ਉਹ ਇੱਕ ਡਾਕਟਰ ਹੈ।", explainEn: "A before consonant.", explainPa: "a ਵਿਅੰਜਨ ਤੋਂ ਪਹਿਲਾਂ।", highlight: "a" }]
    },
    { type: "question", english_text: "What does 'a' mean?", punjabi_text: "'a' ਦਾ ਮਤਲਬ ਕੀ ਹੈ?",
      options: ["one of many", "something specific", "not important"], correct_answer: "one of many", points: 5,
      examples: [{ sentenceEn: "I saw a bird.", sentencePa: "ਮੈਂ ਇੱਕ ਪੰਛੀ ਵੇਖਿਆ।", explainEn: "A = any one bird, not specific.", explainPa: "a ਕਿਸੇ ਵੀ ਪੰਛੀ ਬਾਰੇ।", highlight: "a" }]
    }
  ]
};

__RAW_LESSONS["L_SV_AGREEMENT_01"] = {
  metadata: {
    titleEn: "Subject–Verb Agreement", titlePa: "ਕਰਤਾ–ਕਿਰਿਆ ਸਹਿਮਤੀ",
    trackId: "T_SENTENCE", objective: { titleEn: "Learn: Matching Subjects & Verbs", titlePa: "ਸਿੱਖੋ: ਮੈਲ",
    descEn: "Verbs must match subjects.", descPa: "ਕਿਰਿਆ ਕਰਤਾ ਨਾਲ ਮੇਲ ਖਾਵੇ।", pointsAvailable: 37 }, difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Singular subjects take singular verbs. Plural take plural.",
      contentPa: "ਇੱਕਵਚਨ ਕਰਤਾ ਨਾਲ ਇੱਕਵਚਨ ਕਿਰਿਆ।", points: 1 },
    { type: "example", exampleEn: "She runs (not run). They run (not runs).", examplePa: "She runs। They run।", points: 1 },
    { type: "question", english_text: "Which sentence is correct?", punjabi_text: "ਕਿਹੜਾ ਵਾਕ ਸਹੀ ਹੈ?",
      options: ["He go", "He goes", "He going"], correct_answer: "He goes", points: 5,
      examples: [{ sentenceEn: "She goes to school.", sentencePa: "ਉਹ ਸਕੂਲ ਜਾਂਦੀ ਹੈ।", explainEn: "Singular subject + singular verb.", explainPa: "She + goes ਸਹੀ ਮੇਲ।", highlight: "goes" }]
    },
    { type: "question", english_text: "Complete correctly: They ___ to school.",
      punjabi_text: "ਸਹੀ ਤਰ੍ਹਾਂ ਪੂਰਾ ਕਰੋ: They ___ to school.",
      options: ["goes", "go", "going"], correct_answer: "go", points: 5,
      examples: [{ sentenceEn: "The children go to school.", sentencePa: "ਬੱਚੇ ਸਕੂਲ ਜਾਂਦੇ ਹਨ।", explainEn: "Plural subject + plural verb.", explainPa: "They + go ਸਹੀ ਮੇਲ।", highlight: "go" }]
    },
    { type: "question", english_text: "Which is grammatically correct?", punjabi_text: "ਕਿਹੜਾ ਵਿਆਕਰਣ ਸਹੀ ਹੈ?",
      options: ["Dogs runs", "Dog run", "Dogs run"], correct_answer: "Dogs run", points: 5,
      examples: [{ sentenceEn: "Dogs run fast.", sentencePa: "ਕੁੱਤੇ ਤੇਜ਼ ਦੌੜਦੇ ਹਨ।", explainEn: "Plural subject + plural verb.", explainPa: "Dogs + run ਸਹੀ।", highlight: "run" }]
    },
    { type: "question", english_text: "Pick the correct form.", punjabi_text: "ਸਹੀ ਰੂਪ ਚੁਣੋ।",
      options: ["She have", "She has", "She haves"], correct_answer: "She has", points: 5,
      examples: [{ sentenceEn: "She has a book.", sentencePa: "ਉਸ ਕੋਲ ਇੱਕ ਕਿਤਾਬ ਹੈ।", explainEn: "She + has (singular).", explainPa: "has ਸਹੀ ਰੂਪ ਹੈ।", highlight: "has" }]
    },
    { type: "question", english_text: "Complete: It ___ beautiful.", punjabi_text: "ਪੂਰਾ ਕਰੋ: It ___ beautiful.",
      options: ["are", "is", "be"], correct_answer: "is", points: 5,
      examples: [{ sentenceEn: "It is sunny.", sentencePa: "ਇਹ ਧੁੱਪ ਵਾਲਾ ਹੈ।", explainEn: "It (singular) + is (singular).", explainPa: "It + is ਸਹੀ ਮੇਲ।", highlight: "is" }]
    },
    { type: "question", english_text: "Which subject-verb pair is correct?",
      punjabi_text: "ਕਰਤਾ-ਕਿਰਿਆ ਦਾ ਕਿਹੜਾ ਜੋੜਾ ਸਹੀ ਹੈ?",
      options: ["Birds flies", "Bird fly", "Birds fly"], correct_answer: "Birds fly", points: 5,
      examples: [{ sentenceEn: "The birds fly high.", sentencePa: "ਪੰਛੀ ਉੱਚਾ ਉੱਡਦੇ ਹਨ।", explainEn: "Birds (plural) + fly (plural).", explainPa: "Birds + fly ਸਹੀ।", highlight: "fly" }]
    },
    { type: "question", english_text: "I ___ happy today.", punjabi_text: "ਮੈਂ ਅੱਜ ___ ਖੁਸ਼ ਹਾਂ।",
      options: ["am", "are", "is"], correct_answer: "am", points: 5,
      examples: [{ sentenceEn: "I am excited.", sentencePa: "ਮੈਂ ਉਤਸ਼ਾਹਿਤ ਹਾਂ।", explainEn: "I (singular) + am (singular).", explainPa: "I + am ਸਹੀ ਮੇਲ।", highlight: "am" }]
    }
  ]
},

// ===== INTERMEDIATE LESSONS (Difficulty 2) =====

// L_PROGRESSIVE_PRESENT_01: Present Progressive Tense (is/are + -ing)
__RAW_LESSONS.L_PROGRESSIVE_PRESENT_01 = {
  metadata: {
    titleEn: "Present Progressive Tense",
    titlePa: "ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ",
    labelEn: "Present Progressive",
    labelPa: "ਵਰਤਮਾਨ ਜਾਰੀ",
    trackId: "T_ACTIONS",
    objective: {
      titleEn: "Learn: Present Progressive Tense",
      titlePa: "ਸਿੱਖੋ: ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ",
      descEn: "Understand 'is/are + -ing' for actions happening right now",
      descPa: "ਸਮਝੋ 'is/are + -ing' ਅਜਿਹੀ ਕਿਰਿਆਵਾਂ ਲਈ ਜੋ ਹਾਲੇ ਹੋ ਰਹੀ ਹਨ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Present progressive (is/are + verb-ing) shows an action happening right now, at this moment. Form: subject + is/are + verb-ing", contentPa: "ਵਰਤਮਾਨ ਜਾਰੀ (is/are + verb-ing) ਅਜਿਹੀ ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ ਜੋ ਇਸ ਸਮੇਂ ਹੋ ਰਹੀ ਹੈ।", points: 1 },
    { type: "example", exampleEn: "I am studying English right now.", examplePa: "ਮੈਂ ਹੁਣ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।", highlightedWords: ["am studying"], explainEn: "'am studying' = is/are + -ing form for current action", explainPa: "'am studying' ਵਰਤਮਾਨ ਜਾਰੀ ਕਾਲ ਹੈ", points: 1 },
    { type: "example", exampleEn: "They are playing in the park.", examplePa: "ਉਹ ਪਾਰਕ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।", highlightedWords: ["are playing"], explainEn: "Multiple people = 'are' + verb-ing", explainPa: "ਕਈ ਲੋਕ = 'are' + verb-ing", points: 1 },
    { type: "guidedPractice", contentEn: "Tap the progressive verb form.", contentPa: "ਜਾਰੀ ਕਿਰਿਆ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["She", "is", "singing", "beautifully"], correctAnswers: ["is singing"], points: 3 },
    { type: "question", id: "q_present_prog_correct", english_text: "Which sentence uses present progressive correctly?", punjabi_text: "ਕਿਹੜਾ ਵਾਕ ਵਰਤਮਾਨ ਜਾਰੀ ਸਹੀ ਵਰਤਦਾ ਹੈ?", options: ["I studying English.", "I am studying English.", "I studied English."], correct_answer: "I am studying English.", points: 5,
      hint: { en: "Look for: am/is/are + verb-ing.", pa: "ਇਸ਼ਾਰਾ: am/is/are + ਕਿਰਿਆ-ing (ਜਿਵੇਂ: is playing)." },
      explanation: { en: "Present progressive needs a helper (am/is/are) + verb-ing.", pa: "ਵਰਤਮਾਨ ਜਾਰੀ ਵਿੱਚ am/is/are + ਕਿਰਿਆ-ing ਲੱਗਦੀ ਹੈ।" },
      workedExample: {
        en: "She is writing a letter.",
        pa: "ਉਹ ਪੱਤਰ ਲਿਖ ਰਹੀ ਹੈ।",
        highlight: { en: ["is writing"], pa: ["ਲਿਖ ਰਹੀ"] }
      },
      feedback: { correctEn: "Great!", correctPa: "ਵਧੀਆ!", wrongEn: "Not yet.", wrongPa: "ਹਾਲੇ ਨਹੀਂ।" },
      examples: [{ sentenceEn: "She is writing a letter.", sentencePa: "ਉਹ ਪੱਤਰ ਲਿਖ ਰਹੀ ਹੈ।", explainEn: "is + writing = correct present progressive", explainPa: "is + writing = ਸਹੀ ਜਾਰੀ ਕਾਲ", highlight: "is writing" }]
    },
    { type: "example", exampleEn: "We are waiting for the bus.", examplePa: "ਅਸੀਂ ਬੱਸ ਦੀ ਉਡੀਕ ਕਰ ਰਹੇ ਹਾਂ।", highlightedWords: ["are waiting"], explainEn: "Right now action = progressive tense", explainPa: "ਹੁਣ ਹਾਲਾਂ ਦੀ ਕਿਰਿਆ = ਜਾਰੀ ਕਾਲ", points: 1 },
    { type: "question", id: "q_present_prog_fill_run", english_text: "Complete: She ___ (run) in the marathon.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: She ___ (run) ਮੈਰਾਥਨ ਵਿੱਚ।", options: ["runs", "is running", "ran"], correct_answer: "is running", points: 5,
      hint: { en: "Right now? Use is/are + running.", pa: "ਜੇ ਕਿਰਿਆ ਹੁਣ ਚੱਲ ਰਹੀ ਹੈ, is/are + running ਵਰਤੋ।" },
      explanation: { en: "For an action happening now: she + is + running.", pa: "ਹਾਲ ਦੀ ਕਿਰਿਆ ਲਈ: she + is + running।" },
      workedExample: {
        en: "She is running fast.",
        pa: "ਉਹ ਤੇਜ਼ ਦੌੜ ਰਹੀ ਹੈ।",
        highlight: { en: ["is running"], pa: ["ਦੌੜ ਰਹੀ"] }
      },
      examples: [{ sentenceEn: "The dog is barking loudly.", sentencePa: "ਕੁੱਤਾ ਜੋਰ ਨਾਲ ਭੌਂਕ ਰਿਹਾ ਹੈ।", explainEn: "is + -ing = present progressive", explainPa: "is + -ing = ਵਰਤਮਾਨ ਜਾਰੀ", highlight: "is barking" }]
    },
    { type: "summary", keyExamplesEn: ["is/are + verb-ing", "Right now actions", "They are learning.", "Current moment"], keyExamplesPa: ["is/are + ਕਿਰਿਆ-ing", "ਹਾਲ ਦੀ ਕਿਰਿਆ", "ਉਹ ਸਿੱਖ ਰਹੇ ਹਨ।", "ਮੌਜੂਦਾ ਲਮਹਾ"], points: 0 }
  ]
};

// L_PROGRESSIVE_PAST_01: Past Progressive Tense (was/were + -ing)
__RAW_LESSONS.L_PROGRESSIVE_PAST_01 = {
  metadata: {
    titleEn: "Past Progressive Tense",
    titlePa: "ਭੂਤਕਾਲੀ ਜਾਰੀ ਕਾਲ",
    labelEn: "Past Progressive",
    labelPa: "ਭੂਤਕਾਲੀ ਜਾਰੀ",
    trackId: "T_ACTIONS",
    objective: {
      titleEn: "Learn: Past Progressive Tense",
      titlePa: "ਸਿੱਖੋ: ਭੂਤਕਾਲੀ ਜਾਰੀ ਕਾਲ",
      descEn: "Understand 'was/were + -ing' for actions that were happening in the past",
      descPa: "ਸਮਝੋ 'was/were + -ing' ਅਜਿਹੀ ਕਿਰਿਆਵਾਂ ਲਈ ਜੋ ਭੂਤਕਾਲ ਵਿੱਚ ਹੋ ਰਹੀ ਸੀ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Past progressive (was/were + verb-ing) shows an action that was happening at a specific time in the past. Form: subject + was/were + verb-ing", contentPa: "ਭੂਤਕਾਲੀ ਜਾਰੀ (was/were + verb-ing) ਅਜਿਹੀ ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ ਜੋ ਭੂਤਕਾਲ ਦੇ ਇੱਕ ਖ਼ਾਸ ਸਮੇਂ ਹੋ ਰਹੀ ਸੀ।", points: 1 },
    { type: "example", exampleEn: "I was sleeping when the phone rang.", examplePa: "ਜਦੋਂ ਫੋਨ ਵੱਜਿਆ ਤਾਂ ਮੈਂ ਸੋ ਰਿਹਾ ਸਾ।", highlightedWords: ["was sleeping"], explainEn: "'was sleeping' = was + -ing, action interrupted by another", explainPa: "'was sleeping' = ਭੂਤਕਾਲ ਵਿੱਚ ਚੱਲਦੀ ਕਿਰਿਆ", points: 1 },
    { type: "example", exampleEn: "They were playing when it started raining.", examplePa: "ਜਦੋਂ ਮੀਂਹ ਪੈਣਾ ਸ਼ੁਰੂ ਹੋਇਆ ਤਾਂ ਉਹ ਖੇਡ ਰਹੇ ਸੀ।", highlightedWords: ["were playing"], explainEn: "Plural subject = were + -ing", explainPa: "ਕਈ ਲੋਕ = 'were' + verb-ing", points: 1 },
    { type: "guidedPractice", contentEn: "Tap the past progressive form.", contentPa: "ਭੂਤਕਾਲੀ ਜਾਰੀ ਕਿਰਿਆ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["He", "was", "watching", "TV"], correctAnswers: ["was watching"], points: 3 },
    { type: "question", id: "q_past_prog_correct", english_text: "Which uses past progressive correctly?", punjabi_text: "ਕਿਹੜਾ ਭੂਤਕਾਲੀ ਜਾਰੀ ਸਹੀ ਵਰਤਦਾ ਹੈ?", options: ["She was cooked dinner.", "She was cooking dinner.", "She were cooking dinner."], correct_answer: "She was cooking dinner.", points: 5,
      hint: { en: "Past in-progress = was/were + -ing.", pa: "ਭੂਤਕਾਲ ਵਿੱਚ ਚੱਲ ਰਿਹਾ = was/were + -ing।" },
      explanation: { en: "Past progressive shows something was happening then.", pa: "ਭੂਤਕਾਲੀ ਜਾਰੀ = ਉਸ ਵੇਲੇ ਹੋ ਰਿਹਾ ਸੀ।" },
      workedExample: { en: "He was sleeping.", pa: "ਉਹ ਸੋ ਰਿਹਾ ਸੀ।", highlight: { en: ["was sleeping"], pa: ["ਰਿਹਾ ਸੀ"] } },
      examples: [{ sentenceEn: "I was reading a book.", sentencePa: "ਮੈਂ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਸਾ।", explainEn: "was + -ing = past progressive", explainPa: "was + -ing = ਭੂਤਕਾਲੀ ਜਾਰੀ", highlight: "was reading" }] },
    { type: "example", exampleEn: "We were studying when you arrived.", examplePa: "ਜਦੋਂ ਤੁਸੀਂ ਆਏ ਤਾਂ ਅਸੀਂ ਪੜ੍ਹ ਰਹੇ ਸਾਂ।", highlightedWords: ["were studying"], explainEn: "Past action in progress at a point in time", explainPa: "ਭੂਤਕਾਲ ਦੀ ਜਾਰੀ ਕਿਰਿਆ", points: 1 },
    { type: "question", id: "q_past_prog_complete_were_eating", english_text: "Complete: They ___ (eat) when I called.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: They ___ (eat) ਜਦੋਂ ਮੈਂ ਫੋਨ ਕੀਤਾ।", options: ["ate", "were eating", "eat"], correct_answer: "were eating", points: 5,
      hint: { en: "They (plural) → were + eating.", pa: "They (ਕਈ) → were + eating।" },
      explanation: { en: "Plural subject uses ‘were’.", pa: "ਕਈ ਲੋਕਾਂ ਨਾਲ ‘were’ ਆਉਂਦਾ ਹੈ।" },
      workedExample: { en: "They were eating pizza.", pa: "ਉਹ ਪਿਜ਼ਾ ਖਾ ਰਹੇ ਸੀ।", highlight: { en: ["were eating"], pa: ["ਖਾ ਰਹੇ"] } },
      examples: [{ sentenceEn: "The rain was falling heavily.", sentencePa: "ਮੀਂਹ ਜ਼ੋਰ ਨਾਲ ਪੈ ਰਿਹਾ ਸਾ।", explainEn: "was + -ing = past progressive", explainPa: "was + -ing = ਭੂਤਕਾਲੀ ਜਾਰੀ", highlight: "was falling" }] },
    { type: "summary", keyExamplesEn: ["was/were + verb-ing", "Actions in past progress", "They were working.", "Interrupted actions"], keyExamplesPa: ["was/were + ਕਿਰਿਆ-ing", "ਭੂਤਕਾਲ ਦੀ ਜਾਰੀ ਕਿਰਿਆ", "ਉਹ ਕੰਮ ਕਰ ਰਹੇ ਸੀ।", "ਵਿੱਚ ਵਿੱਛਾ ਕਿਰਿਆ"], points: 0 }
  ]
};

// L_MODAL_VERBS_01: Modal Verbs (can, could, should, must, may)
__RAW_LESSONS.L_MODAL_VERBS_01 = {
  metadata: {
    titleEn: "Modal Verbs",
    titlePa: "ਸਹਾਇਕ ਕਿਰਿਆਵਾਂ",
    labelEn: "Modal Verbs",
    labelPa: "ਮੋਡਲ ਕਿਰਿਆਵਾਂ",
    trackId: "T_ACTIONS",
    objective: {
      titleEn: "Learn: Modal Verbs (can, could, should, must)",
      titlePa: "ਸਿੱਖੋ: ਸਹਾਇਕ ਕਿਰਿਆਵਾਂ",
      descEn: "Understand modal verbs that express ability, possibility, and obligation",
      descPa: "ਸਮਝੋ ਸਹਾਇਕ ਕਿਰਿਆਵਾਂ ਜੋ ਸਮਰੱਥਾ, ਸੰਭਾਵਨਾ, ਅਤੇ ਕਰਤਵ ਦੱਸਦੀ ਹਨ",
      pointsAvailable: 37
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Modal verbs (can, could, should, must, may) express ability, permission, obligation, or possibility. Form: subject + modal + base verb", contentPa: "ਮੋਡਲ ਕਿਰਿਆਵਾਂ (can, could, should, must, may) ਸਮਰੱਥਾ, ਅਜ਼ਾਦੀ, ਜ਼ਰੂਰਤ ਜਾਂ ਸੰਭਾਵਨਾ ਦੱਸਦੀ ਹਨ।", points: 1 },
    { type: "example", exampleEn: "I can swim very well.", examplePa: "ਮੈਂ ਬਹੁਤ ਚੰਗੀ ਤਰ੍ਹਾਂ ਤੈਰਾਕੀ ਕਰ ਸਕਦਾ ਹਾਂ।", highlightedWords: ["can"], explainEn: "'can' = ability to do something", explainPa: "'can' = ਕਰਨ ਦੀ ਸਮਰੱਥਾ", points: 1 },
    { type: "example", exampleEn: "You should eat healthy food.", examplePa: "ਤੁਹਾਨੂੰ ਸਹਿਮਤ ਖਾਣਾ ਖਾਣਾ ਚਾਹੀਦਾ ਹੈ।", highlightedWords: ["should"], explainEn: "'should' = advice or recommendation", explainPa: "'should' = ਸਲਾਹ ਜਾਂ ਸਿਫਾਰਿਸ਼", points: 1 },
    { type: "guidedPractice", contentEn: "Tap all modal verbs in the sentence.", contentPa: "ਵਾਕ ਵਿੱਚ ਸਾਰੀਆਂ ਮੋਡਲ ਕਿਰਿਆਵਾਂ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["He", "must", "finish", "his", "work"], correctAnswers: ["must"], points: 3 },
    { type: "question", id: "q_modal_must_necessary", english_text: "Which modal verb means 'it is necessary'?", punjabi_text: "ਕਿਹੜੀ ਮੋਡਲ ਕਿਰਿਆ 'ਜ਼ਰੂਰੀ ਹੈ' ਦਾ ਅਰਥ ਦੇਵੇ?", options: ["can", "must", "could"], correct_answer: "must", points: 5,
      hint: { en: "Think: a rule you must follow.", pa: "ਇਸ਼ਾਰਾ: ਜਦੋਂ ਕੋਈ ਨਿਯਮ/ਲਾਜ਼ਮੀ ਗੱਲ ਹੋਵੇ।" },
      explanation: { en: "‘Must’ shows necessity or obligation (a rule).", pa: "‘Must’ ਦਾ ਅਰਥ ਹੈ ਲਾਜ਼ਮੀ/ਕਰਨਾ ਹੀ ਪੈਂਦਾ ਹੈ।" },
      workedExample: {
        en: "You must wear a helmet.",
        pa: "ਤੁਹਾਨੂੰ ਹੈਲਮੈਟ ਪਹਿਨਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
        highlight: { en: ["must"], pa: ["ਲਾਜ਼ਮੀ"] }
      },
      examples: [{ sentenceEn: "You must wear a helmet.", sentencePa: "ਤੁਹਾਨੂੰ ਸਿਰ ਲਾਈਨ ਪਹਿਨਨੀ ਚਾਹੀਦੀ ਹੈ।", explainEn: "must = necessary, obligatory", explainPa: "must = ਜ਼ਰੂਰੀ, ਕਰਤਵ", highlight: "must" }]
    },
    { type: "example", exampleEn: "Could you help me please?", examplePa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਓ?", highlightedWords: ["Could"], explainEn: "'could' = polite request or past ability", explainPa: "'could' = ਨਿੱਜੀ ਬੇਨਤੀ ਜਾਂ ਭੂਤਕਾਲ ਦੀ ਸਮਰੱਥਾ", points: 1 },
    { type: "question", id: "q_modal_can_drive", english_text: "Complete: She ___ drive a car.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: She ___ ਗੱਡੀ ਚਲਾ ਸਕਦੀ ਹੈ।", options: ["can", "cans", "canning"], correct_answer: "can", points: 5,
      hint: { en: "Ability = can.", pa: "ਸਮਰੱਥਾ = can।" },
      explanation: { en: "Modal + base verb: can drive.", pa: "can + drive (ਮੂਲ ਕਿਰਿਆ)।" },
      workedExample: { en: "He can swim.", pa: "ਉਹ ਤੈਰ ਸਕਦਾ ਹੈ।", highlight: { en: ["can"], pa: ["ਸਕਦਾ"] } },
      examples: [{ sentenceEn: "I may come tomorrow.", sentencePa: "ਮੈਂ ਕੱਲ ਆ ਸਕਦਾ ਹਾਂ।", explainEn: "may = possibility, permission", explainPa: "may = ਸੰਭਾਵਨਾ, ਅਜ਼ਾਦੀ", highlight: "may" }] },
    { type: "example", exampleEn: "They should study for the exam.", examplePa: "ਉਨ੍ਹਾਂ ਨੂੰ ਪ੍ਰੀਖਿਆ ਲਈ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।", highlightedWords: ["should"], explainEn: "'should' = good advice", explainPa: "'should' = ਚੰਗੀ ਸਲਾਹ", points: 1 },
    { type: "question", id: "q_modal_could_polite", english_text: "Which modal for polite requests?", punjabi_text: "ਕਿਹੜਾ ਮੋਡਲ ਸਜੀਵ ਬੇਨਤੀ ਲਈ?", options: ["can", "could", "must"], correct_answer: "could", points: 5,
      hint: { en: "Polite asking = could you…?", pa: "ਸੋਹਣੀ ਬੇਨਤੀ = could you…?" },
      explanation: { en: "‘Could’ sounds more polite than ‘can’.", pa: "‘Could’ ‘can’ ਨਾਲੋਂ ਜ਼ਿਆਦਾ ਨਰਮ ਹੈ।" },
      workedExample: { en: "Could you help me?", pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", highlight: { en: ["Could"], pa: ["ਕੀ ਤੁਸੀਂ"] } },
      examples: [{ sentenceEn: "May I sit here?", sentencePa: "ਕੀ ਮੈਂ ਇਥੇ ਬੈਠ ਸਕਦਾ ਹਾਂ?", explainEn: "may = formal permission request", explainPa: "may = ਰਸਮੀ ਅਜ਼ਾਦੀ ਲਈ ਬੇਨਤੀ", highlight: "May" }] },
    { type: "summary", keyExamplesEn: ["can = ability", "should = advice", "must = necessity", "could = polite/past ability"], keyExamplesPa: ["can = ਸਮਰੱਥਾ", "should = ਸਲਾਹ", "must = ਜ਼ਰੂਰਤ", "could = ਸਜੀਵ/ਭੂਤਕਾਲ"], points: 0 }
  ]
};

// L_POSSESSIVE_NOUNS_01: Possessive Nouns (noun's, nouns')
__RAW_LESSONS.L_POSSESSIVE_NOUNS_01 = {
  metadata: {
    titleEn: "Possessive Nouns",
    titlePa: "ਮਾਲਕਾਨਾ ਨਾਮ",
    labelEn: "Possessive Nouns",
    labelPa: "ਮਾਲਕਾਨਾ ਨਾਮ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Possessive Nouns ('s and of)",
      titlePa: "ਸਿੱਖੋ: ਮਾਲਕਾਨਾ ਨਾਮ",
      descEn: "Show who owns or belongs to something using 's or of phrase",
      descPa: "ਦਿਖਾਓ ਕਿ ਕਿਸ ਦੀ ਚੀਜ਼ ਹੈ 's ਜਾਂ 'of' ਵਰਤ ਕੇ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Possessive nouns show that something belongs to someone. Add 's to singular nouns, and just ' after plural nouns ending in s. Also use 'of' to show possession.", contentPa: "ਮਾਲਕਾਨਾ ਨਾਮ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਕਿਸ ਕੋਲ ਕੁਝ ਹੈ। ਇੱਕ ਨਾਮ ਤਾਂ 's ਜੋੜੋ, ਕਈ ਤਾਂ ' ਬੇ।", points: 1 },
    { type: "example", exampleEn: "The boy's book is blue.", examplePa: "ਮੁੰਡੇ ਦੀ ਕਿਤਾਬ ਨੀਲੀ ਹੈ।", highlightedWords: ["boy's"], explainEn: "Singular noun + 's = possession", explainPa: "ਇੱਕ ਨਾਮ + 's = ਮਾਲਕਾਨਾ", points: 1 },
    { type: "example", exampleEn: "The girls' school has a big playground.", examplePa: "ਲੜਕੀਆਂ ਦਾ ਸਕੂਲ ਵੱਡਾ ਮੈਦਾਨ ਹੈ।", highlightedWords: ["girls'"], explainEn: "Plural noun ending in 's' + just ' = possession", explainPa: "ਕਈ ਨਾਮ + ' = ਮਾਲਕਾਨਾ", points: 1 },
    { type: "guidedPractice", contentEn: "Tap possessive nouns in the text.", contentPa: "ਮਾਲਕਾਨਾ ਨਾਮ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["Sarah's", "cat", "and", "Mike's", "dog"], correctAnswers: ["Sarah's", "Mike's"], points: 3 },
    { type: "question", english_text: "Which shows correct possession?", punjabi_text: "ਕਿਹੜਾ ਸਹੀ ਮਾਲਕਾਨਾ ਦੱਸਦਾ ਹੈ?", options: ["the students book", "the students' book", "the student's book"], correct_answer: "the students' book", points: 5, examples: [{ sentenceEn: "The teacher's classroom is clean.", sentencePa: "ਅਧਿਆਪਕ ਦੀ ਕਲਾਸ ਸਾਫ਼ ਹੈ।", explainEn: "Singular teacher's = one teacher", explainPa: "ਇੱਕ ਅਧਿਆਪਕ = teacher's", highlight: "teacher's" }] },
    { type: "example", exampleEn: "The color of the flower is beautiful.", examplePa: "ਫੁੱਲ ਦਾ ਰੰਗ ਸੁੰਦਰ ਹੈ।", highlightedWords: ["of the flower"], explainEn: "'of phrase' = another way to show possession", explainPa: "'of' = ਮਾਲਕਾਨਾ ਦਿਖਾਉਣ ਦਾ ਹੋਰ ਤਰੀਕਾ", points: 1 },
    { type: "question", english_text: "Complete: The ___ toy is in the corner.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: The ___ ਖਿਡੌਣਾ ਕੋਨੇ ਵਿੱਚ ਹੈ।", options: ["childs", "child's", "children's"], correct_answer: "child's", points: 5, examples: [{ sentenceEn: "The women's team won the game.", sentencePa: "ਔਰਤਾਂ ਦੀ ਟੀਮ ਨੇ ਖੇਡ ਜਿੱਤੀ।", explainEn: "women + 's = possessive (irregular plural)", explainPa: "women + 's = ਅਸਾਧਾਰਣ ਬਹੁਵਚਨ", highlight: "women's" }] },
    { type: "example", exampleEn: "My friend's house is next to mine.", examplePa: "ਮੇਰੇ ਦੋਸਤ ਦਾ ਘਰ ਮੇਰੇ ਕੋਲ ਹੈ।", highlightedWords: ["friend's"], explainEn: "Show relationship and ownership together", explainPa: "ਸੰਬੰਧ ਅਤੇ ਮਾਲਕਾਨਾ ਨੂੰ ਦਿਖਾਓ", points: 1 },
    { type: "summary", keyExamplesEn: ["John's book", "students' school", "color of the flower", "noun's = one, nouns' = many"], keyExamplesPa: ["John's ਕਿਤਾਬ", "ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਸਕੂਲ", "ਫੁੱਲ ਦਾ ਰੰਗ", "'s = ਇੱਕ, ' = ਕਈ"], points: 0 }
  ]
},

// L_POSSESSIVE_PRONOUNS_01: Possessive Pronouns (my, mine, his, her, their)
__RAW_LESSONS.L_POSSESSIVE_PRONOUNS_01 = {
  metadata: {
    titleEn: "Possessive Pronouns",
    titlePa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ",
    labelEn: "Possessive Pronouns",
    labelPa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ",
    trackId: "T_WORDS",
    objective: {
      titleEn: "Learn: Possessive Pronouns (my, mine, his, her, their)",
      titlePa: "ਸਿੱਖੋ: ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ",
      descEn: "Use possessive pronouns to show ownership without repeating the noun",
      descPa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ ਵਰਤੋ ਨਾਮ ਦੁਹਰਾਏ ਬਿਨਾਂ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Possessive pronouns (my, your, his, her, its, our, their, mine, yours, his, hers, ours, theirs) show who owns something. They replace 'possessive noun + noun'.", contentPa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ (my, your, his, her) ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ ਕਿਸ ਦੀ ਚੀਜ਼ ਹੈ।", points: 1 },
    { type: "example", exampleEn: "This is my pencil.", examplePa: "ਇਹ ਮੇਰਾ ਪੇਨਸਿਲ ਹੈ।", highlightedWords: ["my"], explainEn: "'my' = possessive adjective (goes with noun)", explainPa: "'my' = ਮਾਲਕਾਨਾ (ਨਾਮ ਨਾਲ)", points: 1 },
    { type: "example", exampleEn: "The pencil is mine.", examplePa: "ਪੇਨਸਿਲ ਮੇਰੀ ਹੈ।", highlightedWords: ["mine"], explainEn: "'mine' = possessive pronoun (stands alone)", explainPa: "'mine' = ਸਰਵਨਾਮ (ਅਕੇਲਾ)", points: 1 },
    { type: "guidedPractice", contentEn: "Tap possessive pronouns (not adjectives).", contentPa: "ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["yours", "book", "and", "hers"], correctAnswers: ["yours", "hers"], points: 3 },
    { type: "question", english_text: "Which is a possessive pronoun?", punjabi_text: "ਕਿਹੜਾ ਮਾਲਕਾਨਾ ਸਰਵਨਾਮ ਹੈ?", options: ["my", "mine", "her"], correct_answer: "mine", points: 5, examples: [{ sentenceEn: "His dog is bigger than hers.", sentencePa: "ਉਸ ਦਾ ਕੁੱਤਾ ਉਸ ਦੇ ਨਾਲੋਂ ਵੱਡਾ ਹੈ।", explainEn: "'his' with dog, 'hers' stands alone", explainPa: "'his' ਨਾਮ ਨਾਲ, 'hers' ਅਕੇਲਾ", highlight: "hers" }] },
    { type: "example", exampleEn: "Their house is big, and ours is small.", examplePa: "ਉਨ੍ਹਾਂ ਦਾ ਘਰ ਵੱਡਾ ਹੈ, ਅਸਾਂ ਦਾ ਛੋਟਾ ਹੈ।", highlightedWords: ["Their", "ours"], explainEn: "'Their' = adjective, 'ours' = pronoun standing alone", explainPa: "'Their' ਨਾਮ ਨਾਲ, 'ours' ਅਕੇਲਾ", points: 1 },
    { type: "question", english_text: "Complete: This is ___ notebook.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: ਇਹ ___ ਨੋਟਬੁੱਕ ਹੈ।", options: ["her", "hers", "he"], correct_answer: "her", points: 5, examples: [{ sentenceEn: "These books are theirs.", sentencePa: "ਇਹ ਕਿਤਾਬਾਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਹਨ।", explainEn: "'theirs' = possessive pronoun (stands alone)", explainPa: "'theirs' = ਸਰਵਨਾਮ (ਅਕੇਲਾ)", highlight: "theirs" }] },
    { type: "example", exampleEn: "Your answer is correct, but mine is wrong.", examplePa: "ਤੁਹਾਡਾ ਜਵਾਬ ਸਹੀ ਹੈ, ਪਰ ਮੇਰਾ ਗਲਤ ਹੈ।", highlightedWords: ["Your", "mine"], explainEn: "'Your' with answer, 'mine' alone", explainPa: "'Your' ਨਾਮ ਨਾਲ, 'mine' ਅਕੇਲਾ", points: 1 },
    { type: "summary", keyExamplesEn: ["my/mine, your/yours, his, her/hers, their/theirs", "With noun: my book", "Alone: the book is mine", "Possessive pronouns = ownership"], keyExamplesPa: ["my/mine, your/yours, his, her/hers", "ਨਾਮ ਨਾਲ: my book", "ਅਕੇਲਾ: ਕਿਤਾਬ ਮੇਰੀ ਹੈ", "ਮਾਲਕਾਨਾ = ਮਾਲਕੀ"], points: 0 }
  ]
};

// L_COMPARATIVE_ADJECTIVES_01: Comparative Adjectives (bigger, more beautiful)
__RAW_LESSONS.L_COMPARATIVE_ADJECTIVES_01 = {
  metadata: {
    titleEn: "Comparative Adjectives",
    titlePa: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ",
    labelEn: "Comparative Adjectives",
    labelPa: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ",
    trackId: "T_DESCRIBE",
    objective: {
      titleEn: "Learn: Comparative Adjectives",
      titlePa: "ਸਿੱਖੋ: ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ",
      descEn: "Compare two things using adjectives with -er or 'more'",
      descPa: "ਦੋ ਚੀਜ਼ਾਂ ਦੀ ਤੁਲਨਾ -er ਜਾਂ 'more' ਨਾਲ ਕਰੋ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Comparative adjectives compare two things. For short adjectives, add -er. For long adjectives, use 'more + adjective'. Form: adjective-er OR more + adjective + than", contentPa: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ ਦੋ ਚੀਜ਼ਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦੇ ਹਨ। ਛੋਟੇ ਤੋਂ -er, ਲੰਬੇ ਤੋਂ 'more' ਲਗਾਓ।", points: 1 },
    { type: "example", exampleEn: "The blue box is bigger than the red box.", examplePa: "ਨੀਲਾ ਬਕਸਾ ਲਾਲ ਨਾਲੋਂ ਵੱਡਾ ਹੈ।", highlightedWords: ["bigger"], explainEn: "big → bigger (short adjective + -er)", explainPa: "big → bigger (ਛੋਟਾ + -er)", points: 1 },
    { type: "example", exampleEn: "This flower is more beautiful than that one.", examplePa: "ਇਹ ਫੁੱਲ ਉਸ ਨਾਲੋਂ ਵੱਧ ਸੁੰਦਰ ਹੈ।", highlightedWords: ["more beautiful"], explainEn: "beautiful → more beautiful (long adjective + more)", explainPa: "beautiful → more beautiful (ਲੰਬਾ + more)", points: 1 },
    { type: "guidedPractice", contentEn: "Tap the comparative adjectives.", contentPa: "ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["The", "faster", "car", "is", "newer"], correctAnswers: ["faster", "newer"], points: 3 },
    { type: "question", id: "q_comp_correct_faster", english_text: "Which comparative is correct?", punjabi_text: "ਕਿਹੜਾ ਤੁਲਨਾ ਸਹੀ ਹੈ?", options: ["more fast", "faster", "most fast"], correct_answer: "faster", points: 5,
      hint: { en: "Two things? Use -er.", pa: "ਦੋ ਚੀਜ਼ਾਂ? -er ਵਰਤੋ।" },
      explanation: { en: "fast → faster (not more fast).", pa: "fast → faster (more fast ਨਹੀਂ)।" },
      workedExample: { en: "This bike is faster than that bike.", pa: "ਇਹ ਸਾਈਕਲ ਉਸ ਨਾਲੋਂ ਤੇਜ਼ ਹੈ।", highlight: { en: ["faster", "than"], pa: ["ਨਾਲੋਂ", "ਤੇਜ਼"] } },
      examples: [{ sentenceEn: "She is smarter than her brother.", sentencePa: "ਉਹ ਆਪਣੇ ਭਰਾ ਨਾਲੋਂ ਹੋਸ਼ਿਆਰ ਹੈ।", explainEn: "smart → smarter (short + -er)", explainPa: "smart → smarter (ਛੋਟਾ + -er)", highlight: "smarter" }] },
    { type: "example", exampleEn: "This book is more interesting than that magazine.", examplePa: "ਇਹ ਕਿਤਾਬ ਉਸ ਮੈਗਜ਼ੀਨ ਨਾਲੋਂ ਵੱਧ ਦਿਲਚਸਪ ਹੈ।", highlightedWords: ["more interesting"], explainEn: "'more' + long adjective = comparative", explainPa: "'more' + ਲੰਬਾ = ਤੁਲਨਾ", points: 1 },
    { type: "question", id: "q_comp_complete_redder", english_text: "Complete: This apple is ___ than that one.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: ਇਹ ਸੇਬ ਉਸ ਨਾਲੋਂ ___ ਹੈ।", options: ["red", "redder", "more red"], correct_answer: "redder", points: 5,
      hint: { en: "Short adjective + -er.", pa: "ਛੋਟਾ ਵਿਸ਼ੇਸ਼ਣ + -er।" },
      explanation: { en: "red → redder for comparing two apples.", pa: "red → redder (ਦੋ ਸੇਬਾਂ ਦੀ ਤੁਲਨਾ)।" },
      workedExample: { en: "This ball is bigger than that ball.", pa: "ਇਹ ਗੇਂਦ ਉਸ ਨਾਲੋਂ ਵੱਡੀ ਹੈ।", highlight: { en: ["bigger", "than"], pa: ["ਨਾਲੋਂ", "ਵੱਡੀ"] } },
      examples: [{ sentenceEn: "My pen is cheaper than yours.", sentencePa: "ਮੇਰੀ ਕਲਮ ਤੁਹਾਡੀ ਨਾਲੋਂ ਸਸਤੀ ਹੈ।", explainEn: "cheap → cheaper (short + -er)", explainPa: "cheap → cheaper (ਛੋਟਾ + -er)", highlight: "cheaper" }] },
    { type: "example", exampleEn: "The elephant is bigger than the mouse.", examplePa: "ਹਾਥੀ ਚੂਹੇ ਨਾਲੋਂ ਵੱਡਾ ਹੈ।", highlightedWords: ["bigger"], explainEn: "Comparing size of two animals", explainPa: "ਦੋ ਜਾਨਵਰਾਂ ਦਾ ਅਕਾਰ", points: 1 },
    { type: "summary", keyExamplesEn: ["Short: bigger, faster, redder", "Long: more beautiful, more interesting", "Always use 'than' to compare", "Comparative = two things"], keyExamplesPa: ["ਛੋਟਾ: bigger, faster", "ਲੰਬਾ: more beautiful", "'than' ਹਮੇਸ਼ਾ", "ਦੋ ਚੀਜ਼ਾਂ"], points: 0 }
  ]
};

// L_SUPERLATIVE_ADJECTIVES_01: Superlative Adjectives (biggest, most beautiful)
__RAW_LESSONS.L_SUPERLATIVE_ADJECTIVES_01 = {
  metadata: {
    titleEn: "Superlative Adjectives",
    titlePa: "ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ",
    labelEn: "Superlative Adjectives",
    labelPa: "ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ",
    trackId: "T_DESCRIBE",
    objective: {
      titleEn: "Learn: Superlative Adjectives",
      titlePa: "ਸਿੱਖੋ: ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ",
      descEn: "Describe the most or least using adjectives with -est or 'most'",
      descPa: "ਸਭ ਤੋਂ ਜ਼ਿਆਦਾ ਜਾਂ ਸਭ ਤੋਂ ਘੱਟ -est ਜਾਂ 'most' ਨਾਲ ਦੱਸੋ",
      pointsAvailable: 35
    },
    difficulty: 2
  },
  steps: [
    { type: "definition", contentEn: "Superlative adjectives describe the most or least of something in a group. For short adjectives, add -est. For long adjectives, use 'most + adjective'. Form: the + adjective-est OR the + most + adjective", contentPa: "ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ ਸਭ ਤੋਂ ਜ਼ਿਆਦਾ ਜਾਂ ਸਭ ਤੋਂ ਘੱਟ ਦੱਸਦੇ ਹਨ। ਛੋਟੇ ਤੋਂ -est, ਲੰਬੇ ਤੋਂ 'most' ਲਗਾਓ।", points: 1 },
    { type: "example", exampleEn: "Mount Everest is the highest mountain in the world.", examplePa: "ਮਾਉਂਟ ਐਵਰੈਸਟ ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਉੱਚਾ ਪਹਾੜ ਹੈ।", highlightedWords: ["highest"], explainEn: "high → highest (short adjective + -est)", explainPa: "high → highest (ਛੋਟਾ + -est)", points: 1 },
    { type: "example", exampleEn: "She is the most intelligent student in the class.", examplePa: "ਉਹ ਕਲਾਸ ਵਿੱਚ ਸਭ ਤੋਂ ਬੁੱਧੀਮਾਨ ਵਿਦਿਆਰਥੀ ਹੈ।", highlightedWords: ["most intelligent"], explainEn: "intelligent → most intelligent (long adjective + most)", explainPa: "intelligent → most intelligent (ਲੰਬਾ + most)", points: 1 },
    { type: "guidedPractice", contentEn: "Tap superlative adjectives.", contentPa: "ਉੱਚਤਮ ਵਿਸ਼ੇਸ਼ਣ 'ਤੇ ਟੈਪ ਕਰੋ।", clickableWords: ["This", "is", "the", "smallest", "box"], correctAnswers: ["smallest"], points: 3 },
    { type: "question", id: "q_super_fastest", english_text: "Which is superlative for 'fast'?", punjabi_text: "ਕਿਹੜਾ 'fast' ਦਾ ਉੱਚਤਮ ਹੈ?", options: ["more fast", "faster", "fastest"], correct_answer: "fastest", points: 5,
      hint: { en: "Superlative = -est.", pa: "ਸਰਵੋਤਮ = -est।" },
      explanation: { en: "fast → fastest means number 1 in a group.", pa: "fast → fastest = ਸਮੂਹ ਵਿੱਚ ਸਭ ਤੋਂ ਤੇਜ਼।" },
      workedExample: { en: "He is the fastest in class.", pa: "ਉਹ ਕਲਾਸ ਵਿੱਚ ਸਭ ਤੋਂ ਤੇਜ਼ ਹੈ।", highlight: { en: ["fastest"], pa: ["ਸਭ ਤੋਂ"] } },
      examples: [{ sentenceEn: "She is the tallest girl in her school.", sentencePa: "ਉਹ ਆਪਣੇ ਸਕੂਲ ਦੀ ਸਭ ਤੋਂ ਲੰਬੀ ਲੜਕੀ ਹੈ।", explainEn: "tall → tallest (short + -est)", explainPa: "tall → tallest (ਛੋਟਾ + -est)", highlight: "tallest" }] },
    { type: "example", exampleEn: "This is the most beautiful sunset I have ever seen.", examplePa: "ਇਹ ਸਭ ਤੋਂ ਸੁੰਦਰ ਸੂਰਜ ਡੁੱਬ ਹੈ ਜੋ ਮੈਂ ਕਦੇ ਦੇਖਿਆ।", highlightedWords: ["most beautiful"], explainEn: "'most' + long adjective = superlative", explainPa: "'most' + ਲੰਬਾ = ਉੱਚਤਮ", points: 1 },
    { type: "question", id: "q_super_complete_most_delicious", english_text: "Complete: This cake is the ___ in the bakery.", punjabi_text: "ਵਾਕ ਪੂਰਾ ਕਰੋ: ਇਹ ਕੇਕ ਬੇਕਰੀ ਵਿੱਚ ___ ਹੈ।", options: ["delicious", "more delicious", "most delicious"], correct_answer: "most delicious", points: 5,
      hint: { en: "Long adjective? Use most + word.", pa: "ਲੰਬਾ ਸ਼ਬਦ? most + ਸ਼ਬਦ।" },
      explanation: { en: "delicious is long, so we say most delicious.", pa: "delicious ਲੰਬਾ ਹੈ, ਇਸ ਲਈ most delicious।" },
      workedExample: { en: "This is the most beautiful picture.", pa: "ਇਹ ਸਭ ਤੋਂ ਸੁੰਦਰ ਤਸਵੀਰ ਹੈ।", highlight: { en: ["most"], pa: ["ਸਭ ਤੋਂ"] } },
      examples: [{ sentenceEn: "He got the best marks in the exam.", sentencePa: "ਉਸ ਨੇ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸਭ ਤੋਂ ਵਧੀਆ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ।", explainEn: "good → best (irregular superlative)", explainPa: "good → best (ਅਸਾਧਾਰਣ)", highlight: "best" }] },
    { type: "example", exampleEn: "This is the cheapest store in town.", examplePa: "ਇਹ ਸ਼ਹਿਰ ਵਿੱਚ ਸਭ ਤੋਂ ਸਸਤੀ ਦੁਕਾਨ ਹੈ।", highlightedWords: ["cheapest"], explainEn: "cheap → cheapest (short + -est)", explainPa: "cheap → cheapest (ਛੋਟਾ + -est)", points: 1 },
    { type: "summary", keyExamplesEn: ["Short: biggest, fastest, tallest", "Long: most beautiful, most interesting", "Always use 'the' before superlative", "Superlative = group of 3+"], keyExamplesPa: ["ਛੋਟਾ: biggest, fastest", "ਲੰਬਾ: most beautiful", "'the' ਹਮੇਸ਼ਾ", "ਸਮੂਹ ਵਿੱਚ"], points: 0 }
  ]
};
// T01: Make Plurals with -s
__RAW_LESSONS.T01 = {
  id: "T01",
  titleEn: "Make Plurals with -s",
  titlePa: "ਬਹੁਵਚਨ ਬਣਾਉਣਾ (-s)",
  objective: {
    en: "Learn to add -s to make regular nouns plural.",
    pa: "ਸਧਾਰਣ ਨਾਂਵਾਂ ਨੂੰ ਬਹੁਵਚਨ ਬਣਾਉਣ ਲਈ -s ਜੋੜਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Make this word plural: cat",
    pa: "ਇਸ ਸ਼ਬਦ ਨੂੰ ਬਹੁਵਚਨ ਬਣਾਓ: ਬਿੱਲੀ"
  },
  examples: [
    {
      label: "English",
      en: "One dog, two dogs.",
      pa: "ਇੱਕ ਕੁੱਤਾ, ਦੋ ਕੁੱਤੇ।"
    },
    {
      label: "Punjabi",
      en: "One book, many books.",
      pa: "ਇੱਕ ਕਿਤਾਬ, ਬਹੁਤ ਕਿਤਾਬਾਂ।"
    }
  ],
  answerChoices: [
    { en: "cats", pa: "ਬਿੱਲੀਆਂ" },
    { en: "cat", pa: "ਬਿੱਲੀ" },
    { en: "cates", pa: "ਕੇਟਸ" },
    { en: "cat's", pa: "ਬਿੱਲੀ ਦਾ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "We add -s to talk about more than one regular noun.",
    pa: "ਇੱਕ ਤੋਂ ਵੱਧ ਲਈ ਅਸੀਂ ਸਧਾਰਣ ਨਾਂਵਾਂ ਨਾਲ -s ਜੋੜਦੇ ਹਾਂ।"
  },
  difficulty: 1,
  primaryTrackId: "T_SENTENCE"
};

// T02: Use Some and Any
__RAW_LESSONS.T02 = {
  id: "T02",
  titleEn: "Use Some and Any",
  titlePa: "Some ਅਤੇ Any ਵਰਤੋ",
  objective: {
    en: "Learn to use \"some\" and \"any\" with things you can count or not count.",
    pa: "ਗਿਣ ਸਕਣ ਵਾਲੀਆਂ ਅਤੇ ਨਾ ਗਿਣ ਸਕਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਨਾਲ \"some\" ਅਤੇ \"any\" ਵਰਤਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the best word: I don't have ___ apples.",
    pa: "ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ: ਮੇਰੇ ਕੋਲ ___ ਸੇਬ ਨਹੀਂ ਹਨ।"
  },
  examples: [
    {
      label: "English",
      en: "I have some cookies.",
      pa: "ਮੇਰੇ ਕੋਲ ਕੁਝ ਬਿਸਕੁਟ ਹਨ।"
    },
    {
      label: "Punjabi",
      en: "Do you have any water?",
      pa: "ਕੀ ਤੇਰੇ ਕੋਲ ਕੁਝ ਪਾਣੀ ਹੈ?"
    }
  ],
  answerChoices: [
    { en: "any", pa: "any" },
    { en: "some", pa: "some" },
    { en: "many", pa: "ਬਹੁਤ" },
    { en: "a", pa: "ਇੱਕ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "In a negative sentence, we usually use \"any.\"",
    pa: "ਨਕਾਰਾਤਮਕ ਵਾਕ ਵਿੱਚ ਅਸੀਂ ਆਮ ਤੌਰ ਤੇ \"any\" ਵਰਤਦੇ ਹਾਂ।"
  },
  difficulty: 2,
  primaryTrackId: "T_SENTENCE"
};

// T06: In, On, Under, Next To
__RAW_LESSONS.T06 = {
  id: "T06",
  titleEn: "In, On, Under, Next To",
  titlePa: "ਜਗ੍ਹਾ ਵਾਲੇ ਸ਼ਬਦ",
  objective: {
    en: "Learn prepositions of place: in, on, under, and next to.",
    pa: "ਜਗ੍ਹਾ ਦੱਸਣ ਵਾਲੇ ਸ਼ਬਦ in, on, under, ਅਤੇ next to ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the best word: The cat is ___ the table.",
    pa: "ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ: ਬਿੱਲੀ ਮੇਜ਼ ਦੇ ___ ਹੈ।"
  },
  examples: [
    {
      label: "English",
      en: "The shoes are under the bed.",
      pa: "ਜੁੱਤੇ ਬਿਸਤਰ ਦੇ ਹੇਠਾਂ ਹਨ।"
    },
    {
      label: "Punjabi",
      en: "The book is on the chair.",
      pa: "ਕਿਤਾਬ ਕੁਰਸੀ ਤੇ ਹੈ।"
    }
  ],
  answerChoices: [
    { en: "under", pa: "ਹੇਠਾਂ" },
    { en: "on", pa: "ਤੇ" },
    { en: "in", pa: "ਵਿੱਚ" },
    { en: "next to", pa: "ਦੇ ਕੋਲ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "If the cat is below the table, we use \"under.\"",
    pa: "ਜੇ ਬਿੱਲੀ ਮੇਜ਼ ਦੇ ਹੇਠਾਂ ਹੈ, ਤਾਂ ਅਸੀਂ \"under\" ਵਰਤਦੇ ਹਾਂ।"
  },
  difficulty: 1,
  primaryTrackId: "T_SENTENCE"
};

// T07: Ask Where with Is/Are
__RAW_LESSONS.T07 = {
  id: "T07",
  titleEn: "Ask Where with Is/Are",
  titlePa: "Where ਨਾਲ ਸਵਾਲ",
  objective: {
    en: "Learn to ask Wh- questions using is/are.",
    pa: "is/are ਨਾਲ Wh- ਸਵਾਲ ਪੁੱਛਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the correct question.",
    pa: "ਸਹੀ ਸਵਾਲ ਚੁਣੋ।"
  },
  examples: [
    {
      label: "English",
      en: "Where is the ball?",
      pa: "ਗੇਂਦ ਕਿੱਥੇ ਹੈ?"
    },
    {
      label: "Punjabi",
      en: "Where are the books?",
      pa: "ਕਿਤਾਬਾਂ ਕਿੱਥੇ ਹਨ?"
    }
  ],
  answerChoices: [
    { en: "Where is the ball?", pa: "ਗੇਂਦ ਕਿੱਥੇ ਹੈ?" },
    { en: "Where the ball is?", pa: "ਗੇਂਦ ਕਿੱਥੇ ਹੈ?" },
    { en: "Where are the ball?", pa: "ਗੇਂਦ ਕਿੱਥੇ ਹੈ?" },
    { en: "Where is ball are?", pa: "ਗੇਂਦ ਕਿੱਥੇ ਹੈ?" }
  ],
  correctIndex: 0,
  explanation: {
    en: "We start with \"Where,\" then use \"is\" with one thing like \"the ball.\"",
    pa: "ਅਸੀਂ \"Where\" ਨਾਲ ਸ਼ੁਰੂ ਕਰਦੇ ਹਾਂ, ਫਿਰ ਇੱਕ ਚੀਜ਼ ਲਈ \"is\" ਵਰਤਦੇ ਹਾਂ।"
  },
  difficulty: 2,
  primaryTrackId: "T_SENTENCE"
};

// T08: Polite Classroom Commands
__RAW_LESSONS.T08 = {
  id: "T08",
  titleEn: "Polite Classroom Commands",
  titlePa: "ਕਲਾਸ ਦੇ ਨਿਮਰ ਹੁਕਮ",
  objective: {
    en: "Learn imperatives for simple, polite classroom requests.",
    pa: "ਕਲਾਸ ਵਿੱਚ ਸਧਾਰਣ ਅਤੇ ਨਿਮਰ ਹੁਕਮ ਵਾਲੇ ਵਾਕ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the best request: Please ___ your book.",
    pa: "ਸਹੀ ਬੇਨਤੀ ਚੁਣੋ: ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਕਿਤਾਬ ___."
  },
  examples: [
    {
      label: "English",
      en: "Please open your book.",
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਕਿਤਾਬ ਖੋਲ੍ਹੋ।"
    },
    {
      label: "Punjabi",
      en: "Please sit down.",
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਬੈਠ ਜਾਓ।"
    }
  ],
  answerChoices: [
    { en: "open", pa: "ਖੋਲ੍ਹੋ" },
    { en: "opens", pa: "ਖੋਲ੍ਹਦਾ ਹੈ" },
    { en: "opening", pa: "ਖੋਲ੍ਹ ਰਹੇ ਹੋ" },
    { en: "opened", pa: "ਖੋਲ੍ਹਿਆ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "Imperatives use the base verb, so \"open\" is correct.",
    pa: "ਆਦੇਸ਼ ਵਾਲੇ ਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਦਾ ਸਧਾਰਣ ਰੂਪ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ \"open\" ਸਹੀ ਹੈ।"
  },
  difficulty: 1,
  primaryTrackId: "T_SENTENCE"
};

// T03: Doing It Now: -ing
__RAW_LESSONS.T03 = {
  id: "T03",
  titleEn: "Doing It Now: -ing",
  titlePa: "ਹੁਣ ਵਾਲੀ ਕਿਰਿਆ (-ing)",
  objective: {
    en: "Learn to use am/is/are + -ing for actions happening right now.",
    pa: "ਇਸ ਵੇਲੇ ਹੋ ਰਹੀ ਕਿਰਿਆ ਲਈ am/is/are + -ing ਵਰਤਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the correct sentence for right now.",
    pa: "ਹੁਣ ਲਈ ਸਹੀ ਵਾਕ ਚੁਣੋ।"
  },
  examples: [
    {
      label: "English",
      en: "I am running now.",
      pa: "ਮੈਂ ਹੁਣ ਦੌੜ ਰਿਹਾ ਹਾਂ।"
    },
    {
      label: "Punjabi",
      en: "She is eating now.",
      pa: "ਉਹ ਹੁਣ ਖਾ ਰਹੀ ਹੈ।"
    }
  ],
  answerChoices: [
    { en: "He is jumping.", pa: "ਉਹ ਛਾਲਾਂ ਮਾਰ ਰਿਹਾ ਹੈ।" },
    { en: "He jump.", pa: "ਉਹ ਛਾਲ ਮਾਰਦਾ ਹੈ।" },
    { en: "He jumped.", pa: "ਉਹ ਛਾਲ ਮਾਰਿਆ।" },
    { en: "He will jump.", pa: "ਉਹ ਛਾਲ ਮਾਰੇਗਾ।" }
  ],
  correctIndex: 0,
  explanation: {
    en: "For an action happening now, we use \"is\" + the -ing word.",
    pa: "ਹੁਣ ਹੋ ਰਹੀ ਕਿਰਿਆ ਲਈ ਅਸੀਂ \"is\" + -ing ਵਾਲਾ ਸ਼ਬਦ ਵਰਤਦੇ ਹਾਂ।"
  },
  difficulty: 2,
  primaryTrackId: "T_ACTIONS"
};

// T05: Compare with -er
__RAW_LESSONS.T05 = {
  id: "T05",
  titleEn: "Compare with -er",
  titlePa: "ਤੁਲਨਾ ਲਈ -er",
  objective: {
    en: "Learn to use comparative adjectives like bigger and smaller.",
    pa: "bigger ਅਤੇ smaller ਵਰਗੇ ਤੁਲਨਾਤਮਕ ਵਿਸ਼ੇਸ਼ਣ ਵਰਤਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the correct word: The blue ball is ___ than the red ball.",
    pa: "ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ: ਨੀਲੀ ਗੇਂਦ ਲਾਲ ਗੇਂਦ ਨਾਲੋਂ ___ ਹੈ।"
  },
  examples: [
    {
      label: "English",
      en: "This box is bigger than that box.",
      pa: "ਇਹ ਡੱਬਾ ਉਸ ਡੱਬੇ ਨਾਲੋਂ ਵੱਡਾ ਹੈ।"
    },
    {
      label: "Punjabi",
      en: "My pencil is shorter than your pencil.",
      pa: "ਮੇਰੀ ਪੈਂਸਿਲ ਤੇਰੀ ਪੈਂਸਿਲ ਨਾਲੋਂ ਛੋਟੀ ਹੈ।"
    }
  ],
  answerChoices: [
    { en: "bigger", pa: "ਵੱਡੀ" },
    { en: "big", pa: "ਵੱਡੀ" },
    { en: "biggest", pa: "ਸਭ ਤੋਂ ਵੱਡੀ" },
    { en: "more big", pa: "ਹੋਰ ਵੱਡੀ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "When we compare two things, we often use the -er form like \"bigger.\"",
    pa: "ਦੋ ਚੀਜ਼ਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਲਈ ਅਸੀਂ ਅਕਸਰ -er ਵਾਲਾ ਰੂਪ ਵਰਤਦੇ ਹਾਂ, ਜਿਵੇਂ \"bigger।\""
  },
  difficulty: 2,
  primaryTrackId: "T_DESCRIBE"
};

// T09: Daily Routines with Time
__RAW_LESSONS.T09 = {
  id: "T09",
  titleEn: "Daily Routines with Time",
  titlePa: "ਰੋਜ਼ ਦੀਆਂ ਆਦਤਾਂ ਅਤੇ ਸਮਾਂ",
  objective: {
    en: "Learn to talk about everyday routines using a time like 7 a.m.",
    pa: "7 a.m. ਵਰਗੇ ਸਮੇਂ ਨਾਲ ਰੋਜ਼ ਦੀਆਂ ਆਦਤਾਂ ਬਾਰੇ ਬੋਲਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the best word: I brush my teeth ___ 7 a.m.",
    pa: "ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ: ਮੈਂ 7 a.m. ___ ਦੰਦ ਸਾਫ਼ ਕਰਦਾ ਹਾਂ।"
  },
  examples: [
    {
      label: "English",
      en: "I go to school at 9 a.m.",
      pa: "ਮੈਂ 9 ਵਜੇ ਸਵੇਰੇ ਸਕੂਲ ਜਾਂਦਾ ਹਾਂ।"
    },
    {
      label: "Punjabi",
      en: "She eats lunch at 1 p.m.",
      pa: "ਉਹ 1 ਵਜੇ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ ਖਾਂਦੀ ਹੈ।"
    }
  ],
  answerChoices: [
    { en: "at", pa: "ਤੇ" },
    { en: "in", pa: "ਵਿੱਚ" },
    { en: "on", pa: "ਤੇ (ਦਿਨ ਲਈ)" },
    { en: "under", pa: "ਹੇਠਾਂ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "We use \"at\" for clock times like 7 a.m.",
    pa: "7 a.m. ਵਰਗੇ ਘੜੀ ਦੇ ਸਮੇਂ ਲਈ ਅਸੀਂ \"at\" ਵਰਤਦੇ ਹਾਂ।"
  },
  difficulty: 2,
  primaryTrackId: "T_ACTIONS"
};

// T04: Whose? Use 's
__RAW_LESSONS.T04 = {
  id: "T04",
  titleEn: "Whose? Use 's",
  titlePa: "ਕਿਸ ਦੀ? 's ਵਰਤੋ",
  objective: {
    en: "Learn to use 's to show who owns something.",
    pa: "ਕਿਸ ਦੀ ਚੀਜ਼ ਹੈ ਦਿਖਾਉਣ ਲਈ 's ਵਰਤਣਾ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the correct sentence: This is ___ pencil.",
    pa: "ਸਹੀ ਵਾਕ ਚੁਣੋ: ਇਹ ___ ਪੈਂਸਿਲ ਹੈ।"
  },
  examples: [
    {
      label: "English",
      en: "Sara's book is new.",
      pa: "ਸਾਰਾ ਦੀ ਕਿਤਾਬ ਨਵੀਂ ਹੈ।"
    },
    {
      label: "Punjabi",
      en: "This is Ali's bag.",
      pa: "ਇਹ ਅਲੀ ਦਾ ਬੈਗ ਹੈ।"
    }
  ],
  answerChoices: [
    { en: "Ravi's", pa: "ਰਵੀ ਦਾ" },
    { en: "Ravis", pa: "ਰਵੀਸ" },
    { en: "Ravi", pa: "ਰਵੀ" },
    { en: "Ravi s", pa: "ਰਵੀ ਐੱਸ" }
  ],
  correctIndex: 0,
  explanation: {
    en: "We add 's after a name to show it belongs to that person.",
    pa: "ਨਾਮ ਤੋਂ ਬਾਅਦ 's ਲਗਾ ਕੇ ਅਸੀਂ ਮਾਲਕੀ ਦਿਖਾਂਦੇ ਹਾਂ।"
  },
  difficulty: 1,
  primaryTrackId: "T_WORDS"
};

// T10: Polite Requests: Can or Could
__RAW_LESSONS.T10 = {
  id: "T10",
  titleEn: "Polite Requests: Can or Could",
  titlePa: "ਨਿਮਰ ਬੇਨਤੀ: Can/Could",
  objective: {
    en: "Learn to ask politely using \"can\" or \"could.\"",
    pa: "\"can\" ਜਾਂ \"could\" ਨਾਲ ਨਿਮਰ ਤਰੀਕੇ ਨਾਲ ਬੇਨਤੀ ਕਰਨੀ ਸਿੱਖੋ।"
  },
  prompt: {
    en: "Choose the most polite request for water.",
    pa: "ਪਾਣੀ ਲਈ ਸਭ ਤੋਂ ਨਿਮਰ ਬੇਨਤੀ ਚੁਣੋ।"
  },
  examples: [
    {
      label: "English",
      en: "Could I have some water, please?",
      pa: "ਕੀ ਮੈਨੂੰ ਕੁਝ ਪਾਣੀ ਮਿਲ ਸਕਦਾ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ?"
    },
    {
      label: "Punjabi",
      en: "Can I go outside, please?",
      pa: "ਕੀ ਮੈਂ ਬਾਹਰ ਜਾ ਸਕਦਾ ਹਾਂ, ਕਿਰਪਾ ਕਰਕੇ?"
    }
  ],
  answerChoices: [
    { en: "Could I have water, please?", pa: "ਕੀ ਮੈਨੂੰ ਪਾਣੀ ਮਿਲ ਸਕਦਾ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ?" },
    { en: "Give me water.", pa: "ਮੈਨੂੰ ਪਾਣੀ ਦੇ।" },
    { en: "Water now!", pa: "ਹੁਣੇ ਪਾਣੀ!" },
    { en: "I want water.", pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।" }
  ],
  correctIndex: 0,
  explanation: {
    en: "\"Could I… please?\" is a very polite way to ask.",
    pa: "\"Could I… ਕਿਰਪਾ ਕਰਕੇ?\" ਪੁੱਛਣ ਦਾ ਬਹੁਤ ਨਿਮਰ ਤਰੀਕਾ ਹੈ।"
  },
  difficulty: 2,
  primaryTrackId: "T_SENTENCE"
};

// -------------------- NORMALIZATION: RAW -> CANONICAL --------------------
(function normalizeLessonsToCanonicalSchema() {
  // Normalizer hardening (data-only; no UX changes)
  // What changed / why safe:
  // - Adds small sanitizers (trim/whitespace normalize, <mark> stripping) and points coercion.
  // - Keeps canonical keys unchanged so the renderer continues working.
  // - Adds throttled warnings for authoring hygiene; never throws on bad data.
  // Manual test plan:
  // 1) Open a legacy lesson with <mark> in examples; confirm example text renders plain and highlight still works.
  // 2) Open a lesson question authored with english_text/punjabi_text; confirm prompt shows normally.
  // 3) Complete a lesson; confirm summary Total Points matches objective pointsAvailable.
  // 4) Try malformed options/correctAnswer; confirm app does not crash.

  var LESSON_WARN_LIMIT = 50;
  var __warnCount = 0;
  var __warnedKeys = Object.create(null);
  function __debugOn() {
    try { return typeof window !== 'undefined' && window && window.BOLO_DEBUG === true; } catch (e) { return false; }
  }
  function warnLessonOnce(type, context) {
    var key = String(type || 'warn') + ':' + (context && context.lessonId ? String(context.lessonId) : 'unknown');
    if (__warnedKeys[key] && !__debugOn()) return;
    if (!__debugOn() && __warnCount >= LESSON_WARN_LIMIT) return;
    __warnedKeys[key] = true;
    __warnCount++;
    try {
      if (typeof console !== 'undefined' && console && typeof console.warn === 'function') {
        console.warn('[Lessons][Normalize]', type, context || {});
      }
    } catch (e) {
      // ignore
    }
  }

  function cleanText(v) {
    // Minimal sanitization: coerce to string, trim, collapse internal whitespace.
    if (v === null || v === undefined) return '';
    var s = String(v);
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  function stripMarkAndCollect(v) {
    // Strips <mark ...>...</mark> but keeps inner text.
    // Collects highlighted words from marked segments (tokens, de-duped, order preserved).
    var s = (v === null || v === undefined) ? '' : String(v);
    var highlighted = [];
    var seen = Object.create(null);

    s = s.replace(/<mark\b[^>]*>([\s\S]*?)<\/mark>/gi, function(_m, inner) {
      var innerText = (inner === null || inner === undefined) ? '' : String(inner);
      var tokens = innerText.split(/\s+/);
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (!t) continue;
        // Strip surrounding punctuation; keep apostrophes (e.g., boy's)
        t = t.replace(/^[\s"'“”‘’.,!?;:()\[\]{}]+/, '').replace(/[\s"'“”‘’.,!?;:()\[\]{}]+$/, '');
        if (!t) continue;
        if (!seen[t]) {
          seen[t] = true;
          highlighted.push(t);
        }
      }
      return innerText;
    });

    return { text: s, highlightedWords: highlighted };
  }

  function expandHighlightsToMatchText(text, highlights) {
    // Renderer compares tokens from `text.split(/\s+/)` directly against `highlightedWords`.
    // If punctuation sits outside <mark> (e.g., "bed."), we add the token variant ("bed.")
    // when it normalizes to a collected highlight ("bed").
    if (!text || !Array.isArray(highlights) || !highlights.length) return highlights;

    var tokens = String(text).split(/\s+/);
    var baseSet = Object.create(null);
    for (var i = 0; i < highlights.length; i++) {
      var h = highlights[i];
      if (h) baseSet[String(h)] = true;
    }

    var out = highlights.slice();
    var seen = Object.create(null);
    for (var j = 0; j < out.length; j++) {
      if (out[j]) seen[String(out[j])] = true;
    }

    for (var t = 0; t < tokens.length; t++) {
      var tok = tokens[t];
      if (!tok) continue;
      var norm = tok
        .replace(/^[\s"'“”‘’.,!?;:()\[\]{}]+/, '')
        .replace(/[\s"'“”‘’.,!?;:()\[\]{}]+$/, '');
      if (!norm) continue;
      // Add token variant if it corresponds to an existing base highlight.
      if (baseSet[norm] && !seen[tok]) {
        seen[tok] = true;
        out.push(tok);
      }
    }

    return out;
  }

  function coercePoints(n, fallback) {
    // Coerce to finite integer >= 0.
    var v = (n === null || n === undefined || n === '') ? fallback : n;
    var num = Number(v);
    if (!isFinite(num)) num = Number(fallback);
    if (!isFinite(num)) num = 0;
    num = Math.round(num);
    if (num < 0) num = 0;
    return num;
  }

  var metaById = Object.create(null);
  if (typeof LESSON_META !== "undefined" && Array.isArray(LESSON_META)) {
    for (var i = 0; i < LESSON_META.length; i++) {
      var m = LESSON_META[i];
      if (m && typeof m.id === "string") metaById[m.id] = m;
    }
  }

  var notes = {
    normalizedKeys: [
      "step_type -> type",
      "english_text/englishText -> englishText (questions)",
      "punjabi_text -> punjabiText (questions)",
      "correct_answer/correctAnswer -> correctAnswer",
      "guidedPractice -> guided_practice",
      "definition/example text fields -> contentEn/contentPa or exampleEn/examplePa"
    ],
    generatedQuestionIds: [],
    correctedOptionMismatches: [],
    pointsAvailableAdjustments: [],
    punjabiEdits: []
  };

  function coerceString(v) {
    if (v === null || v === undefined) return "";
    return String(v);
  }

  function stripHtml(text) {
    return coerceString(text).replace(/<[^>]*>/g, "");
  }

  function slugify(text) {
    var s = stripHtml(text).toLowerCase();
    s = s.replace(/[^a-z0-9]+/g, "_");
    s = s.replace(/^_+|_+$/g, "");
    if (!s) s = "question";
    return s.slice(0, 32);
  }

  function ensureStringArray(arr) {
    if (!Array.isArray(arr)) return [];
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var v = arr[i];
      if (typeof v === "string") {
        out.push(v);
      } else if (v && typeof v === "object" && typeof v.en === "string") {
        out.push(v.en);
      } else {
        out.push(coerceString(v));
      }
    }
    return out;
  }

  function normalizeHighlightedWords(value) {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [value];
    return undefined;
  }

  function normalizeSummaryStep(step) {
    return {
      type: "summary",
      titleEn: coerceString(step.titleEn || "Summary"),
      titlePa: coerceString(step.titlePa || "ਸਾਰ"),
      summaryEn: coerceString(step.summaryEn || "Key points and examples."),
      summaryPa: coerceString(step.summaryPa || "ਮੁੱਖ ਬਿੰਦੂ ਅਤੇ ਉਦਾਹਰਨਾਂ।"),
      keyExamplesEn: Array.isArray(step.keyExamplesEn) ? step.keyExamplesEn : undefined,
      keyExamplesPa: Array.isArray(step.keyExamplesPa) ? step.keyExamplesPa : undefined,
      totalPoints: typeof step.totalPoints === "number" ? step.totalPoints : undefined,
      points: 0
    };
  }

  function normalizeQuestionStep(step, lessonId, usedIds) {
    // A) Standardize prompt keys to englishText/punjabiText with minimal sanitization.
    if (step && (step.english_text !== undefined || step.punjabi_text !== undefined)) {
      warnLessonOnce('snake_case_prompt_keys', { lessonId: lessonId, hasEnglishSnake: step.english_text !== undefined, hasPunjabiSnake: step.punjabi_text !== undefined });
    }

    var englishText = cleanText(step.englishText || step.english_text || step.english || step.promptEn || "");
    var punjabiText = cleanText(step.punjabiText || step.punjabi_text || step.punjabi || step.promptPa || "");

    var options = ensureStringArray(step.options || step.answerChoices);

    var correctAnswer = step.correctAnswer || step.correct_answer;
    if (correctAnswer === undefined && typeof step.correctIndex === "number" && Array.isArray(step.answerChoices)) {
      var choice = step.answerChoices[step.correctIndex];
      if (choice && typeof choice.en === "string") correctAnswer = choice.en;
    }
    correctAnswer = coerceString(correctAnswer);

    // Fix a known broken token: Cyrillic 'д' in "seeд" (likely intended ASCII).
    for (var i = 0; i < options.length; i++) {
      if (options[i] === "seeд") {
        options[i] = "seed";
        notes.correctedOptionMismatches.push({ lessonId: lessonId, detail: "Normalized option 'seeд' -> 'seed'" });
      }
    }

    // Ensure correctAnswer matches an option exactly.
    if (correctAnswer) {
      var foundExact = false;
      for (var j = 0; j < options.length; j++) {
        if (options[j] === correctAnswer) { foundExact = true; break; }
      }
      if (!foundExact) {
        var foundIndex = -1;
        var caNorm = correctAnswer.trim().toLowerCase();
        for (var k = 0; k < options.length; k++) {
          if (options[k].trim().toLowerCase() === caNorm) { foundIndex = k; break; }
        }
        if (foundIndex >= 0) {
          notes.correctedOptionMismatches.push({ lessonId: lessonId, detail: "Adjusted correctAnswer to match option exactly", from: correctAnswer, to: options[foundIndex] });
          correctAnswer = options[foundIndex];
        } else {
          notes.correctedOptionMismatches.push({ lessonId: lessonId, detail: "Added missing correctAnswer to options", correctAnswer: correctAnswer });
          options.push(correctAnswer);
        }
      }
    }

    var points = coercePoints(step.points, 5);
    var id = coerceString(step.id);
    if (!id) {
      var base = "q_" + lessonId.toLowerCase() + "_" + slugify(englishText);
      id = base;
      var n = 2;
      while (usedIds[id]) {
        id = base + "_" + n;
        n++;
      }
      notes.generatedQuestionIds.push(id);
    }
    usedIds[id] = true;

    var hint = undefined;
    if (step.hint !== undefined) {
      if (typeof step.hint === "string") {
        hint = { en: step.hint, pa: "" };
      } else if (step.hint && typeof step.hint === "object") {
        hint = { en: coerceString(step.hint.en || ""), pa: coerceString(step.hint.pa || "") };
      }
    }

    var explanation = undefined;
    if (step.explanation !== undefined) {
      if (typeof step.explanation === "string") {
        explanation = { en: step.explanation, pa: "" };
      } else if (step.explanation && typeof step.explanation === "object") {
        explanation = { en: coerceString(step.explanation.en || ""), pa: coerceString(step.explanation.pa || "") };
      }
    }

    // Preserve tutorial choice Punjabi text by appending into explanation when needed.
    if (Array.isArray(step.answerChoices)) {
      var paPairs = [];
      for (var c = 0; c < step.answerChoices.length; c++) {
        var ch = step.answerChoices[c];
        if (ch && typeof ch.en === "string" && typeof ch.pa === "string") {
          paPairs.push(ch.en + " = " + ch.pa);
        }
      }
      if (paPairs.length) {
        var extraPa = "Options (Punjabi): " + paPairs.join(" | ");
        var extraEn = "Options (Punjabi): " + paPairs.join(" | ");
        if (!explanation) explanation = { en: "", pa: "" };
        explanation.en = (explanation.en ? explanation.en + "\n\n" : "") + extraEn;
        explanation.pa = (explanation.pa ? explanation.pa + "\n\n" : "") + extraPa;
      }
    }

    // Preserve non-canonical feedback fields by folding into explanation.
    if (step.feedback && (step.feedback.correctEn || step.feedback.correctPa || step.feedback.wrongEn || step.feedback.wrongPa)) {
      if (!explanation) explanation = { en: "", pa: "" };
      var fEn = [];
      var fPa = [];
      if (step.feedback.correctEn) fEn.push("Correct: " + step.feedback.correctEn);
      if (step.feedback.wrongEn) fEn.push("Wrong: " + step.feedback.wrongEn);
      if (step.feedback.correctPa) fPa.push("ਸਹੀ: " + step.feedback.correctPa);
      if (step.feedback.wrongPa) fPa.push("ਗਲਤ: " + step.feedback.wrongPa);
      if (fEn.length) explanation.en = (explanation.en ? explanation.en + "\n\n" : "") + fEn.join("\n");
      if (fPa.length) explanation.pa = (explanation.pa ? explanation.pa + "\n\n" : "") + fPa.join("\n");
    }

    return {
      type: "question",
      id: id,
      englishText: englishText,
      punjabiText: punjabiText,
      options: options,
      correctAnswer: correctAnswer,
      points: points,
      hint: hint,
      explanation: explanation,
      workedExample: step.workedExample,
      examples: step.examples
    };
  }

  function normalizeGuidedPractice(step) {
    function stripEdgePunctuation(token) {
      // Keep internal punctuation (e.g., book's) but drop edge punctuation (e.g., student.).
      return coerceString(token).replace(/^[\s"'“”‘’()\[\]{}<>.,!?;:]+|[\s"'“”‘’()\[\]{}<>.,!?;:]+$/g, "");
    }

    function mapWordsToSentenceTokens(sentence, words) {
      var text = cleanText(sentence);
      var base = Array.isArray(words) ? words : [];
      if (!text || !base.length) return base;

      var tokens = text.split(/\s+/).filter(Boolean);
      if (!tokens.length) return base;

      var out = [];
      var seenLower = Object.create(null);

      for (var i = 0; i < base.length; i++) {
        var target = cleanText(base[i]);
        if (!target) continue;
        var targetLower = target.toLowerCase();
        if (seenLower[targetLower]) continue;

        var mapped = target;
        for (var t = 0; t < tokens.length; t++) {
          var tok = tokens[t];
          var stripped = stripEdgePunctuation(tok);
          if (!stripped) continue;
          if (stripped.toLowerCase() === targetLower) {
            mapped = tok;
            break;
          }
        }

        seenLower[targetLower] = true;
        out.push(mapped);
      }

      return out;
    }

    var sentenceEn = cleanText(step.sentenceEn || step.contentEn || step.english_text || step.englishText || "");
    var sentencePa = cleanText(step.sentencePa || step.contentPa || step.punjabi_text || step.punjabiText || "");
    var clickableWords = ensureStringArray(step.clickableWords).map(cleanText).filter(Boolean);
    var correctAnswers = ensureStringArray(step.correctAnswers).map(cleanText).filter(Boolean);
    var points = coercePoints(step.points, 3);

    var feedbackCorrect = undefined;
    var feedbackCorrectPa = undefined;
    // C) Preserve renderer contract: feedbackCorrect stays a string.
    if (typeof step.feedbackCorrect === "string") feedbackCorrect = cleanText(step.feedbackCorrect);
    else if (step.feedbackCorrect && typeof step.feedbackCorrect === 'object') {
      // Accept bilingual object and keep english in feedbackCorrect while preserving Punjabi separately.
      if (typeof step.feedbackCorrect.en === 'string') feedbackCorrect = cleanText(step.feedbackCorrect.en);
      else if (typeof step.feedbackCorrect.pa === 'string') feedbackCorrect = cleanText(step.feedbackCorrect.pa);
      if (typeof step.feedbackCorrect.pa === 'string') feedbackCorrectPa = cleanText(step.feedbackCorrect.pa);
    }

    if (typeof step.feedbackCorrectPa === 'string') feedbackCorrectPa = cleanText(step.feedbackCorrectPa);

    // If feedbackCorrect contains both languages in one string, split into EN/PA.
    if (typeof feedbackCorrect === 'string' && feedbackCorrect && !feedbackCorrectPa) {
      // Common delimiter pattern used in the dataset: "EN ... / PA ..."
      var parts = feedbackCorrect.split(/\s\/\s/);
      if (parts.length >= 2) {
        var maybePa = parts.slice(1).join(" / ").trim();
        if (/[\u0A00-\u0A7F]/.test(maybePa)) {
          feedbackCorrect = parts[0].trim();
          feedbackCorrectPa = maybePa;
        }
      }
    }

    // Map word lists to the renderer's exact tokenization (e.g., student -> student.).
    clickableWords = mapWordsToSentenceTokens(sentenceEn, clickableWords);
    correctAnswers = mapWordsToSentenceTokens(sentenceEn, correctAnswers);
    if ((!clickableWords || !clickableWords.length) && correctAnswers && correctAnswers.length) clickableWords = correctAnswers.slice();

    return {
      type: "guided_practice",
      sentenceEn: sentenceEn,
      sentencePa: sentencePa,
      clickableWords: clickableWords,
      correctAnswers: correctAnswers,
      feedbackCorrect: feedbackCorrect,
      feedbackCorrectPa: typeof feedbackCorrectPa === 'string' ? feedbackCorrectPa : undefined,
      points: points
    };
  }

  function normalizeStep(step, lessonId, usedQuestionIds) {
    if (!step || typeof step !== "object") return null;
    var type = step.type || step.step_type;
    if (type === "guidedPractice") type = "guided_practice";
    if (type === "guided_practice") return normalizeGuidedPractice(step);
    if (type === "definition") {
      return {
        type: "definition",
        contentEn: coerceString(step.contentEn || step.english_text || step.englishText || ""),
        contentPa: coerceString(step.contentPa || step.punjabi_text || step.punjabiText || ""),
        points: coercePoints(step.points, 1)
      };
    }
    if (type === "example") {
      // B) Strip <mark> and derive highlightedWords when absent.
      var rawEn = coerceString(step.exampleEn || step.english_text || step.englishText || "");
      var rawPa = coerceString(step.examplePa || step.punjabi_text || step.punjabiText || "");
      var enInfo = stripMarkAndCollect(rawEn);
      var paInfo = stripMarkAndCollect(rawPa);

      var existingHighlights = normalizeHighlightedWords(step.highlightedWords);
      var derived = [];
      var seen2 = Object.create(null);
      function pushAll(list) {
        for (var i = 0; i < list.length; i++) {
          var w = list[i];
          if (!w || seen2[w]) continue;
          seen2[w] = true;
          derived.push(w);
        }
      }
      pushAll(enInfo.highlightedWords);
      pushAll(paInfo.highlightedWords);

      if ((!existingHighlights || !existingHighlights.length) && derived.length) {
        derived = expandHighlightsToMatchText(enInfo.text, derived);
        derived = expandHighlightsToMatchText(paInfo.text, derived);
      }

      return {
        type: "example",
        exampleEn: enInfo.text,
        examplePa: paInfo.text,
        highlightedWords: (existingHighlights && existingHighlights.length) ? existingHighlights : (derived.length ? derived : undefined),
        explainEn: typeof step.explainEn === "string" ? step.explainEn : undefined,
        explainPa: typeof step.explainPa === "string" ? step.explainPa : undefined,
        points: coercePoints(step.points, 1)
      };
    }
    if (type === "summary") return normalizeSummaryStep(step);
    if (type === "question") return normalizeQuestionStep(step, lessonId, usedQuestionIds);

    // Fallback: treat unknown step types as definition to avoid data loss.
    return {
      type: "definition",
      contentEn: coerceString(step.contentEn || step.english_text || step.englishText || ""),
      contentPa: coerceString(step.contentPa || step.punjabi_text || step.punjabiText || ""),
      points: coercePoints(step.points, 1)
    };
  }

  function computePointsAvailable(steps) {
    var sum = 0;
    for (var i = 0; i < steps.length; i++) {
      var st = steps[i];
      if (!st || st.type === "summary") continue;
      sum += typeof st.points === "number" ? st.points : 0;
    }
    return sum;
  }

  var legacyCategoryConfig = {
    noun: { id: "L_LEGACY_NOUN_01", titleEn: "Noun (Legacy)", titlePa: "ਨਾਮ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_WORDS", difficulty: 1 },
    pronoun: { id: "L_LEGACY_PRONOUN_01", titleEn: "Pronoun (Legacy)", titlePa: "ਸਰਵਨਾਮ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_WORDS", difficulty: 1 },
    plural_singular: { id: "L_LEGACY_SINGULAR_PLURAL_01", titleEn: "Singular & Plural (Legacy)", titlePa: "ਏਕ/ਬਹੁ ਵਚਨ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_WORDS", difficulty: 2 },
    verb: { id: "L_LEGACY_VERB_01", titleEn: "Verb (Legacy)", titlePa: "ਕਿਰਿਆ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_ACTIONS", difficulty: 1 },
    adverb: { id: "L_LEGACY_ADVERB_01", titleEn: "Adverb (Legacy)", titlePa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_ACTIONS", difficulty: 1 },
    tense_present: { id: "L_LEGACY_SIMPLE_PRESENT_01", titleEn: "Simple Present (Legacy)", titlePa: "ਸਧਾਰਣ ਵਰਤਮਾਨ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_ACTIONS", difficulty: 1 },
    tense_past: { id: "L_LEGACY_SIMPLE_PAST_01", titleEn: "Simple Past (Legacy)", titlePa: "ਸਧਾਰਣ ਭੂਤਕਾਲ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_ACTIONS", difficulty: 2 },
    tense_future: { id: "L_LEGACY_SIMPLE_FUTURE_01", titleEn: "Simple Future (Legacy)", titlePa: "ਸਧਾਰਣ ਭਵਿੱਖ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_ACTIONS", difficulty: 2 },
    adjective: { id: "L_LEGACY_ADJECTIVE_01", titleEn: "Adjective (Legacy)", titlePa: "ਵਿਸ਼ੇਸ਼ਣ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_DESCRIBE", difficulty: 1 },
    preposition: { id: "L_LEGACY_PREPOSITION_01", titleEn: "Preposition (Legacy)", titlePa: "ਪੂਰਵ-ਬੋਧਕ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_SENTENCE", difficulty: 1 },
    conjunction: { id: "L_LEGACY_CONJUNCTION_01", titleEn: "Conjunction (Legacy)", titlePa: "ਸੰਯੋਜਕ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_SENTENCE", difficulty: 1 },
    interjection: { id: "L_LEGACY_INTERJECTION_01", titleEn: "Interjection (Legacy)", titlePa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_SENTENCE", difficulty: 1 },
    article: { id: "L_LEGACY_ARTICLE_01", titleEn: "Article (Legacy)", titlePa: "ਲੇਖ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_SENTENCE", difficulty: 1 },
    sv_agreement: { id: "L_LEGACY_SV_AGREEMENT_01", titleEn: "Subject–Verb Agreement (Legacy)", titlePa: "ਕਰਤਾ–ਕਿਰਿਆ ਸਹਿਮਤੀ (ਪੁਰਾਣਾ ਪਾਠ)", trackId: "T_SENTENCE", difficulty: 2 }
  };

  function buildMetadata(lessonId, raw) {
    var catalog = metaById[lessonId] || {};
    var rawMeta = raw && raw.metadata ? raw.metadata : {};

    var titleEn = coerceString(rawMeta.titleEn || raw.titleEn || catalog.labelEn || catalog.id || lessonId);
    var titlePa = coerceString(rawMeta.titlePa || raw.titlePa || catalog.labelPa || titleEn);

    var labelEn = coerceString(rawMeta.labelEn || catalog.labelEn || titleEn);
    var labelPa = coerceString(rawMeta.labelPa || catalog.labelPa || titlePa);

    var trackId = coerceString(rawMeta.trackId || raw.primaryTrackId || catalog.trackId || "T_SENTENCE");
    var difficulty = typeof rawMeta.difficulty === "number" ? rawMeta.difficulty : (typeof raw.difficulty === "number" ? raw.difficulty : (typeof catalog.difficulty === "number" ? catalog.difficulty : 1));

    var rawObj = rawMeta.objective || raw.objective || {};
    var objective = {
      titleEn: coerceString(rawObj.titleEn || (rawObj.en ? "Objective" : ("Learn: " + labelEn))),
      titlePa: coerceString(rawObj.titlePa || (rawObj.pa ? "ਉਦੇਸ਼" : ("ਸਿੱਖੋ: " + labelPa))),
      descEn: coerceString(rawObj.descEn || rawObj.en || ""),
      descPa: coerceString(rawObj.descPa || rawObj.pa || ""),
      pointsAvailable: typeof rawObj.pointsAvailable === "number" ? rawObj.pointsAvailable : 0
    };

    return {
      titleEn: titleEn,
      titlePa: titlePa,
      labelEn: labelEn,
      labelPa: labelPa,
      trackId: trackId,
      objective: objective,
      difficulty: Math.max(1, Math.min(3, difficulty))
    };
  }

  function normalizeLesson(lessonId, rawLesson) {
    var usedQuestionIds = Object.create(null);
    var stepsRaw = [];

    if (Array.isArray(rawLesson)) {
      stepsRaw = rawLesson;
      rawLesson = { metadata: {}, steps: rawLesson };
    } else if (rawLesson && Array.isArray(rawLesson.steps)) {
      stepsRaw = rawLesson.steps;
    } else if (rawLesson && rawLesson.prompt && rawLesson.answerChoices) {
      // Tutorial schema → canonical lesson steps
      stepsRaw = [
        { type: "definition", contentEn: rawLesson.objective && rawLesson.objective.en, contentPa: rawLesson.objective && rawLesson.objective.pa },
        // examples → example steps (preserve labels as explainEn/explainPa)
      ];
      if (Array.isArray(rawLesson.examples)) {
        for (var i = 0; i < rawLesson.examples.length; i++) {
          var ex = rawLesson.examples[i];
          stepsRaw.push({
            type: "example",
            exampleEn: ex && ex.en,
            examplePa: ex && ex.pa,
            explainEn: ex && ex.label ? String(ex.label) : undefined,
            explainPa: ex && ex.label ? String(ex.label) : undefined
          });
        }
      }
      stepsRaw.push({
        type: "question",
        englishText: rawLesson.prompt.en,
        punjabiText: rawLesson.prompt.pa,
        answerChoices: rawLesson.answerChoices,
        correctIndex: rawLesson.correctIndex,
        explanation: rawLesson.explanation ? { en: rawLesson.explanation.en || "", pa: rawLesson.explanation.pa || "" } : undefined
      });
    }

    var meta = buildMetadata(lessonId, rawLesson || {});
    var steps = [];
    for (var s = 0; s < stepsRaw.length; s++) {
      var normalized = normalizeStep(stepsRaw[s], lessonId, usedQuestionIds);
      if (normalized) steps.push(normalized);
    }

    // Insert an objective step first when missing.
    // This aligns with the enhanced flow without changing renderer logic.
    if (!steps.length || steps[0].type !== 'objective') {
      steps.unshift({ type: 'objective', points: 0 });
    }

    // Ensure every step has points (defaults)
    for (var p = 0; p < steps.length; p++) {
      var st = steps[p];
      if (!st || typeof st !== 'object') continue;
      if (st.type === 'summary') {
        // E) Summary points must always be 0
        st.points = 0;
      } else if (typeof st.points !== "number") {
        // E) Default by type (existing behavior), then coerce
        if (st.type === "guided_practice") st.points = 3;
        else if (st.type === "question") st.points = 5;
        else st.points = 1;
        st.points = coercePoints(st.points, 0);
      } else {
        st.points = coercePoints(st.points, 0);
      }
    }

    var pointsAvailable = computePointsAvailable(steps);
    var prev = meta.objective.pointsAvailable;
    meta.objective.pointsAvailable = pointsAvailable;
    if (typeof prev === "number" && prev !== pointsAvailable) {
      notes.pointsAvailableAdjustments.push({ lessonId: lessonId, from: prev, to: pointsAvailable });
    }

    // D) Ensure summary totalPoints is accurate when missing.
    for (var si = 0; si < steps.length; si++) {
      var st2 = steps[si];
      if (!st2 || st2.type !== 'summary') continue;
      if (typeof st2.totalPoints !== 'number') {
        st2.totalPoints = pointsAvailable;
      }
      st2.points = 0;
    }

    return { metadata: meta, steps: steps };
  }

  // Build canonical lessons.
  for (var key in __RAW_LESSONS) {
    if (!Object.prototype.hasOwnProperty.call(__RAW_LESSONS, key)) continue;
    var raw = __RAW_LESSONS[key];

    // Legacy category arrays
    if (Array.isArray(raw) && legacyCategoryConfig[key]) {
      var cfg = legacyCategoryConfig[key];
      var legacyLesson = { metadata: { titleEn: cfg.titleEn, titlePa: cfg.titlePa, labelEn: cfg.titleEn, labelPa: cfg.titlePa, trackId: cfg.trackId, difficulty: cfg.difficulty, objective: { titleEn: "Learn: " + cfg.titleEn, titlePa: "ਸਿੱਖੋ: " + cfg.titlePa, descEn: "", descPa: "" } }, steps: raw };
      LESSONS[cfg.id] = normalizeLesson(cfg.id, legacyLesson);
      continue;
    }

    // Tutorial objects (T01..)
    if (/^T\d+$/.test(key) && raw && typeof raw === "object") {
      var tutId = "L_TUTORIAL_" + key;
      var tutRaw = Object.assign({}, raw);
      tutRaw.metadata = { titleEn: raw.titleEn, titlePa: raw.titlePa, labelEn: raw.titleEn, labelPa: raw.titlePa, trackId: raw.primaryTrackId, difficulty: raw.difficulty, objective: { en: raw.objective && raw.objective.en ? raw.objective.en : "", pa: raw.objective && raw.objective.pa ? raw.objective.pa : "" } };
      LESSONS[tutId] = normalizeLesson(tutId, tutRaw);
      continue;
    }

    // Canonical lesson IDs
    if (typeof key === "string" && key.indexOf("L_") === 0 && raw && typeof raw === "object") {
      LESSONS[key] = normalizeLesson(key, raw);
      continue;
    }
  }

  // Expose notes for debugging/verification.
  if (typeof window !== "undefined") {
    window.__LESSONS_MIGRATION_NOTES__ = notes;
  }
})();

// ===== MIGRATION NOTES =====
/*
ORIGINAL KEYS NORMALIZED
- step_type -> type
- english_text/englishText -> englishText (questions)
- punjabi_text -> punjabiText (questions)
- correct_answer/correctAnswer -> correctAnswer
- guidedPractice -> guided_practice
- definition/example text fields -> contentEn/contentPa or exampleEn/examplePa

GENERATED QUESTION IDS (missing ids were generated)
- q_l_legacy_noun_01_tap_the_noun
- q_l_legacy_noun_01_tap_the_noun_2
- q_l_legacy_noun_01_tap_the_noun_3
- q_l_legacy_pronoun_01_tap_the_pronoun
- q_l_legacy_singular_plural_01_tap_the_plural_word
- q_l_legacy_singular_plural_01_tap_the_singular_word
- q_l_legacy_verb_01_tap_the_verb
- q_l_legacy_verb_01_tap_the_verb_2
- q_l_legacy_adverb_01_tap_the_adverb
- q_l_legacy_adverb_01_tap_the_adverb_2
- q_l_legacy_simple_present_01_which_verb_is_in_simple_present
- q_l_legacy_simple_past_01_which_verb_is_in_simple_past
- q_l_legacy_simple_future_01_which_verb_is_in_simple_future
- q_l_legacy_adjective_01_tap_the_adjective
- q_l_legacy_adjective_01_tap_the_adjective_2
- q_l_legacy_preposition_01_tap_the_preposition
- q_l_legacy_conjunction_01_tap_the_conjunction
- q_l_legacy_interjection_01_tap_the_interjection
- q_l_legacy_article_01_tap_the_article
- q_l_legacy_article_01_tap_the_article_2
- q_l_legacy_sv_agreement_01_tap_the_correct_sentence
- q_l_example_new_format_which_word_is_a_noun
- q_l_example_new_format_tap_the_sentence_with_the_most_n
- q_l_nouns_common_01_which_word_is_a_common_noun
- q_l_nouns_common_01_in_the_sentence_the_dog_is_sleep
- q_l_nouns_common_01_which_word_is_a_common_noun_2
- q_l_nouns_proper_01_which_word_is_a_proper_noun
- q_l_nouns_proper_01_choose_the_proper_noun
- q_l_pronouns_personal_01_tap_the_pronoun
- q_l_pronouns_personal_01_choose_the_correct_pronoun
- q_l_pronouns_personal_01_which_pronoun_is_correct
- q_l_nouns_plurals_possession_01_choose_the_correct_plural
- q_l_nouns_plurals_possession_01_which_shows_possession_correctly
- q_l_nouns_plurals_possession_01_form_the_plural_of_child
- q_l_nouns_plurals_possession_01_which_is_the_possessive_form
- q_l_nouns_plurals_possession_01_choose_the_correct_plural_2
- q_l_adj_comparison_01_which_is_the_comparative_of_good
- q_l_adj_comparison_01_complete_my_house_is_than_yours
- q_l_adj_vs_adv_01_she_sings
- q_l_adj_vs_adv_01_complete_the_dog_is_running
- q_l_prep_place_move_01_choose_the_correct_preposition
- q_l_prep_place_move_01_he_walked_the_bridge
- q_l_prep_place_move_01_the_book_is_the_shelf
- q_l_prep_place_move_01_the_cat_is_the_box
- q_l_prep_place_move_01_she_ran_the_park
- q_l_prep_time_01_we_meet_sunday
- q_l_prep_time_01_he_lived_here_2019
- q_l_prep_time_01_school_starts_8_am
- q_l_prep_time_01_they_waited_an_hour
- q_l_prep_time_01_she_s_been_here_monday
- q_l_conj_joining_01_choose_the_best_conjunction
- q_l_conj_joining_01_he_was_tired_he_kept_working
- q_l_conj_joining_01_complete_you_ready
- q_l_conj_joining_01_she_was_late_she_ran
- q_l_conj_joining_01_you_can_come_stay_home
- q_l_interjections_01_tap_the_interjection
- q_l_interjections_01_which_shows_pain
- q_l_interjections_01_choose_the_interjection
- q_l_interjections_01_shh_means
- q_l_interjections_01_which_shows_relief
- q_l_nouns_basics_01_which_is_a_noun
- q_l_nouns_basics_01_pick_the_noun
- q_l_nouns_basics_01_find_the_noun_in_she_played_in_t
- q_l_nouns_basics_01_nouns_can_be_people_which_is_a_p
- q_l_nouns_basics_01_which_word_is_not_a_noun
- q_l_nouns_basics_01_what_type_of_noun_is_india
- q_l_pronouns_basics_01_pick_the_pronoun
- q_l_pronouns_basics_01_which_is_a_pronoun
- q_l_pronouns_basics_01_complete_am_happy
- q_l_pronouns_basics_01_what_pronoun_replaces_mary
- q_l_pronouns_basics_01_choose_the_sentence_using_pronou
- q_l_pronouns_basics_01_what_does_we_mean
- q_l_singular_plural_01_which_is_plural
- q_l_singular_plural_01_form_plural_of_dog
- q_l_singular_plural_01_which_is_singular
- q_l_singular_plural_01_form_plural_of_box
- q_l_singular_plural_01_which_pair_is_correct_singular_p
- q_l_singular_plural_01_count_the_singular_nouns_cat_dog
- q_l_simple_present_01_which_sentence_is_present_tense
- q_l_adjective_basics_01_adjectives_can_describe_size_whi
- q_l_preposition_basics_01_pick_the_preposition
- q_l_preposition_basics_01_complete_the_cat_is_the_chair
- q_l_preposition_basics_01_which_is_a_preposition
- q_l_preposition_basics_01_the_book_is_the_desk
- q_l_preposition_basics_01_which_preposition_shows_time
- q_l_preposition_basics_01_pick_the_sentence_with_a_preposi
- q_l_conjunction_basics_01_pick_the_conjunction
- q_l_conjunction_basics_01_complete_i_like_pizza_burger
- q_l_conjunction_basics_01_which_is_a_conjunction
- q_l_conjunction_basics_01_this_word_shows_contrast
- q_l_conjunction_basics_01_choose_the_correct_use_of_and
- q_l_conjunction_basics_01_conjunctions_connect_together
- q_l_article_basics_01_pick_the_article
- q_l_article_basics_01_complete_apple
- q_l_article_basics_01_which_is_correct
- q_l_article_basics_01_when_do_we_use_the
- q_l_article_basics_01_choose_the_correct_sentence
- q_l_article_basics_01_what_does_a_mean
- q_l_sv_agreement_01_which_sentence_is_correct
- q_l_sv_agreement_01_complete_correctly_they_to_schoo
- q_l_sv_agreement_01_which_is_grammatically_correct
- q_l_sv_agreement_01_pick_the_correct_form
- q_l_sv_agreement_01_complete_it_beautiful
- q_l_sv_agreement_01_which_subject_verb_pair_is_corre
- q_l_sv_agreement_01_i_happy_today
- q_l_possessive_nouns_01_which_shows_correct_possession
- q_l_possessive_nouns_01_complete_the_toy_is_in_the_corne
- q_l_possessive_pronouns_01_which_is_a_possessive_pronoun
- q_l_possessive_pronouns_01_complete_this_is_notebook
- q_l_tutorial_t01_make_this_word_plural_cat
- q_l_tutorial_t02_choose_the_best_word_i_don_t_hav
- q_l_tutorial_t06_choose_the_best_word_the_cat_is_
- q_l_tutorial_t07_choose_the_correct_question
- q_l_tutorial_t08_choose_the_best_request_please_y
- q_l_tutorial_t03_choose_the_correct_sentence_for_
- q_l_tutorial_t05_choose_the_correct_word_the_blue
- q_l_tutorial_t09_choose_the_best_word_i_brush_my_
- q_l_tutorial_t04_choose_the_correct_sentence_this
- q_l_tutorial_t10_choose_the_most_polite_request_f

CORRECTED OPTIONS/CORRECTANSWER MISMATCHES
- L_SIMPLE_PAST_01: normalized option "seeд" -> "seed" (Cyrillic 'д' to ASCII)

PUNJABI EDITS
- none

NOTE
- Full generated notes are also written to tools/lessons_migration_notes.json by tools/extract_lessons_migration_notes.js
*/
