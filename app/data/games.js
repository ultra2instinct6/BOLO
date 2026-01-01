// -------------------- GAME QUESTION BANKS --------------------

// NOTE: This file is loaded as a vanilla script (no imports).
// A few small helpers are defined here defensively so Daily Quest
// normalization can run even if other modules are not loaded.

if (typeof trimSpaces !== "function") {
  function trimSpaces(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }
}

if (typeof shuffleArrayCopy !== "function") {
  function shuffleArrayCopy(arr) {
    var a = Array.isArray(arr) ? arr.slice() : [];
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }
}

if (typeof sanitizeSentenceText !== "function") {
  function sanitizeSentenceText(s) {
    // Keep it conservative: normalize whitespace only.
    return trimSpaces(s);
  }
}

if (typeof sanitizeOptionText !== "function") {
  function sanitizeOptionText(s) {
    // Keep it conservative: normalize whitespace only.
    return trimSpaces(s);
  }
}

if (typeof warnSanitizationChange !== "function") {
  function warnSanitizationChange(before, after, meta) {
    try {
      if (before === after) return;
      if (typeof window !== "undefined" && window && window.BOLO_DEBUG === true) {
        console.warn("Sanitized text", { before: before, after: after, meta: meta || {} });
      }
    } catch (e) {}
  }
}

if (typeof warnGame4 !== "function") {
  function warnGame4(msg, meta) {
    try {
      if (typeof window !== "undefined" && window && window.BOLO_DEBUG === true) {
        console.warn(msg, meta || {});
      }
    } catch (e) {}
  }
}

if (typeof POS_HINTS === "undefined") {
  var POS_HINTS = {
    noun: { hintEn: "Noun = person/place/thing.", hintPa: "ਨਾਂ = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", explanationEn: "Pick the option that names a person, place, or thing.", explanationPa: "ਉਹ ਚੋਣ ਚੁਣੋ ਜੋ ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼ ਦੱਸਦੀ ਹੈ।" },
    verb: { hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।", explanationEn: "Pick the option that shows an action.", explanationPa: "ਉਹ ਚੋਣ ਚੁਣੋ ਜੋ ਕੰਮ/ਕਿਰਿਆ ਦੱਸਦੀ ਹੈ।" },
    adjective: { hintEn: "Adjective describes a noun.", hintPa: "ਵਿਸ਼ੇਸ਼ਣ noun ਦਾ ਵਰਣਨ ਕਰਦਾ ਹੈ।", explanationEn: "Pick the option that describes what something is like.", explanationPa: "ਉਹ ਚੋਣ ਚੁਣੋ ਜੋ ਵਰਣਨ ਕਰਦੀ ਹੈ।" },
    adverb: { hintEn: "Adverb tells how/when.", hintPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ।", explanationEn: "Pick the option that tells how/when an action happens.", explanationPa: "ਉਹ ਚੋਣ ਚੁਣੋ ਜੋ ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦੀ ਹੈ।" },
    _default: { hintEn: "Try again.", hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", explanationEn: "Pick the best answer.", explanationPa: "ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਚੁਣੋ।" }
  };
}

if (typeof TENSE_HINTS === "undefined") {
  var TENSE_HINTS = {
    present: { hintEn: "Present = now / every day.", hintPa: "ਵਰਤਮਾਨ = ਹੁਣ / ਹਰ ਰੋਜ਼।", explanationEn: "Present tense talks about now or usual actions.", explanationPa: "ਵਰਤਮਾਨ ਕਾਲ ਹੁਣ ਜਾਂ ਆਦਤ ਵਾਲੇ ਕੰਮਾਂ ਲਈ ਹੁੰਦਾ ਹੈ।" },
    past: { hintEn: "Past = already happened.", hintPa: "ਭੂਤਕਾਲ = ਹੋ ਚੁੱਕਾ।", explanationEn: "Past tense talks about what already happened.", explanationPa: "ਭੂਤਕਾਲ ਵਿੱਚ ਹੋ ਚੁੱਕੀਆਂ ਘਟਨਾਵਾਂ ਆਉਂਦੀਆਂ ਹਨ।" },
    future: { hintEn: "Future = will / tomorrow.", hintPa: "ਭਵਿੱਖ = will / ਕੱਲ੍ਹ।", explanationEn: "Future tense talks about what will happen.", explanationPa: "ਭਵਿੱਖ ਕਾਲ ਵਿੱਚ ਜੋ ਹੋਵੇਗਾ ਉਹ ਆਉਂਦਾ ਹੈ।" },
    _default: { hintEn: "Look for time words (yesterday / will / tomorrow).", hintPa: "ਸਮੇਂ ਦੇ ਸ਼ਬਦ ਲੱਭੋ (yesterday / will / tomorrow)।", explanationEn: "Tense tells when the action happens.", explanationPa: "ਕਾਲ ਦੱਸਦਾ ਹੈ ਕਿ ਕੰਮ ਕਦੋਂ ਹੁੰਦਾ ਹੈ।" }
  };
}

if (typeof GAME4_FALLBACK === "undefined") {
  var GAME4_FALLBACK = {
    hintEn: "Pick the sentence that sounds correct.",
    hintPa: "ਉਹ ਵਾਕ ਚੁਣੋ ਜੋ ਸਹੀ ਲੱਗਦਾ ਹੈ।",
    explanationEn: "Pick the sentence with correct grammar.",
    explanationPa: "ਵਿਆਕਰਨ ਅਨੁਸਾਰ ਸਹੀ ਵਾਕ ਚੁਣੋ।"
  };
}

if (typeof standardizeGame2Word !== "function") {
  function standardizeGame2Word(word, partId) {
    // Conservative: normalize whitespace only.
    return trimSpaces(word);
  }
}

if (typeof canonicalGame2WordLower !== "function") {
  function canonicalGame2WordLower(word, partId) {
    return String(standardizeGame2Word(word, partId) || "").toLowerCase();
  }
}

if (typeof sanitizeGame2StableIdToken !== "function") {
  function sanitizeGame2StableIdToken(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
  }
}

if (typeof validateNormalizedQuestions !== "function") {
  function validateNormalizedQuestions(list) {
    if (!Array.isArray(list)) return;
    // Lightweight validation to prevent hard crashes.
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if (!q || typeof q !== "object") continue;
      if (!q.id || !q.gameId) {
        if (typeof window !== "undefined" && window && window.BOLO_DEBUG === true) {
          console.warn("Normalized question missing id/gameId", { index: i, q: q });
        }
      }
    }
  }
}

// Game 2/3/4 banks (safe defaults; keep app bootable)
// Defined up-front so normalization/validation code can reference them safely.
var GAME2_QUESTIONS = [];
var GAME3_QUESTIONS = [];
var GAME4_QUESTIONS = [];

// Game 1: Tap the Word
var GAME1_QUESTIONS = [
  { sentence: "The cat drinks milk.", question: "Tap the noun", correctWord: "cat", trackId: "T_WORDS" },
  { sentence: "They play in the park.", question: "Tap the verb", correctWord: "play", trackId: "T_ACTIONS" },
  { sentence: "The red kite is high.", question: "Tap the adjective", correctWord: "red", trackId: "T_DESCRIBE" },
  { sentence: "She walks to school daily.", question: "Tap the adverb", correctWord: "daily", trackId: "T_ACTIONS" },
  { sentence: "The book is on the table.", question: "Tap the preposition", correctWord: "on", trackId: "T_SENTENCE" },
  { sentence: "A dog and a cat run.", question: "Tap the conjunction", correctWord: "and", trackId: "T_SENTENCE" },

  // New (spread across tracks)
  { sentence: "The apple is red", question: "Tap the noun", correctWord: "apple", trackId: "T_WORDS" },
  { sentence: "Birds fly high", question: "Tap the verb", correctWord: "fly", trackId: "T_ACTIONS" },
  { sentence: "We see a tall tree", question: "Tap the adjective", correctWord: "tall", trackId: "T_DESCRIBE" },
  { sentence: "She reads books", question: "Tap the pronoun", correctWord: "She", trackId: "T_SENTENCE" },
  { sentence: "The cat is under the table", question: "Tap the preposition", correctWord: "under", trackId: "T_READING" }

  // Phase 3 (+36): New (spread across tracks)
  ,{ sentence: "My sister paints pictures", question: "Tap the noun", correctWord: "sister", trackId: "T_WORDS" }
  ,{ sentence: "The teacher smiles", question: "Tap the noun", correctWord: "teacher", trackId: "T_WORDS" }
  ,{ sentence: "Dogs chase balls", question: "Tap the verb", correctWord: "chase", trackId: "T_ACTIONS" }
  ,{ sentence: "He ran quickly", question: "Tap the adverb", correctWord: "quickly", trackId: "T_ACTIONS" }
  ,{ sentence: "A tiny bird sings", question: "Tap the adjective", correctWord: "tiny", trackId: "T_DESCRIBE" }
  ,{ sentence: "The soup is hot", question: "Tap the adjective", correctWord: "hot", trackId: "T_DESCRIBE" }
  ,{ sentence: "The sun is bright", question: "Tap the article", correctWord: "The", trackId: "T_SENTENCE" }
  ,{ sentence: "Wow! That is fun", question: "Tap the interjection", correctWord: "Wow", trackId: "T_SENTENCE" }
  ,{ sentence: "She sat beside me", question: "Tap the preposition", correctWord: "beside", trackId: "T_READING" }
  ,{ sentence: "I read and I write", question: "Tap the conjunction", correctWord: "and", trackId: "T_READING" }

  // Phase 4 (+48): New (12 per game)
  ,{ sentence: "My brother rides a bike", question: "Tap the noun", correctWord: "brother", trackId: "T_WORDS", hintEn: "A noun is a person, place, or thing.", hintPa: "ਨਾਂ (noun) = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", explanationEn: "Brother is a person.", explanationPa: "Brother ਵਿਅਕਤੀ ਹੈ।" }
  ,{ sentence: "Her name is Maya", question: "Tap the noun", correctWord: "Maya", trackId: "T_WORDS", hintEn: "Names are nouns.", hintPa: "ਨਾਮ ਵੀ noun ਹੁੰਦੇ ਹਨ।", explanationEn: "Maya is a name.", explanationPa: "Maya ਨਾਮ ਹੈ।" }

  ,{ sentence: "Birds sing loudly", question: "Tap the verb", correctWord: "sing", trackId: "T_ACTIONS", hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ (verb) = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।" }
  ,{ sentence: "He jumps today", question: "Tap the verb", correctWord: "jumps", trackId: "T_ACTIONS", hintEn: "What is happening?", hintPa: "ਕੀ ਹੋ ਰਿਹਾ ਹੈ?" }
  ,{ sentence: "They listen quietly", question: "Tap the adverb", correctWord: "quietly", trackId: "T_ACTIONS", hintEn: "Adverb tells how/when.", hintPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ।" }

  ,{ sentence: "A happy dog runs", question: "Tap the adjective", correctWord: "happy", trackId: "T_DESCRIBE", hintEn: "Adjective describes a noun.", hintPa: "ਵਿਸ਼ੇਸ਼ਣ (adjective) ਵਰਣਨ ਕਰਦਾ ਹੈ।" }
  ,{ sentence: "The brave boy laughs", question: "Tap the adjective", correctWord: "brave", trackId: "T_DESCRIBE", hintEn: "Adjectives answer: what kind?", hintPa: "Adjective ਦੱਸਦਾ ਹੈ: ਕਿਹੋ ਜਿਹਾ?" }

  ,{ sentence: "An owl is here", question: "Tap the article", correctWord: "An", trackId: "T_SENTENCE", hintEn: "A/An/The are articles.", hintPa: "A/An/The ਲੇਖ (articles) ਹਨ।" }
  ,{ sentence: "We sit under trees", question: "Tap the preposition", correctWord: "under", trackId: "T_SENTENCE", hintEn: "Preposition shows place.", hintPa: "ਪੂਰਵ-ਬੋਧਕ ਥਾਂ ਦੱਸਦਾ ਹੈ।" }
  ,{ sentence: "I want juice but I wait", question: "Tap the conjunction", correctWord: "but", trackId: "T_SENTENCE", hintEn: "Conjunction joins words/ideas.", hintPa: "ਸੰਯੋਜਕ ਸ਼ਬਦ/ਖ਼ਿਆਲ ਜੋੜਦਾ ਹੈ।" }

  ,{ sentence: "Oops, I dropped it", question: "Tap the interjection", correctWord: "Oops", trackId: "T_READING", hintEn: "Interjection shows feeling.", hintPa: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ ਭਾਵਨਾ ਦੱਸਦਾ ਹੈ।" }
  ,{ sentence: "We read after lunch", question: "Tap the preposition", correctWord: "after", trackId: "T_READING", hintEn: "After tells time.", hintPa: "After ਸਮਾਂ ਦੱਸਦਾ ਹੈ।" }

  // Phase 5 (+40): New (10 per game; mixed everyday themes)
  ,{ sentence: "The baby sleeps now", question: "Tap the verb", correctWord: "sleeps", trackId: "T_ACTIONS", hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ (verb) = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।", explanationEn: "Sleeps is the action.", explanationPa: "Sleeps ਕੰਮ/ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।" }

];



// Game 2: Parts of Speech
// Authoring schema: { word: string, correctPartId: string, trackId: string }
var GAME2_QUESTIONS = [
  { trackId: "T_WORDS", word: "teacher", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "pencil", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "school", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "Maya", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "park", correctPartId: "noun" },

  { trackId: "T_ACTIONS", word: "run", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "jump", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "read", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "write", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "sing", correctPartId: "verb" },

  { trackId: "T_DESCRIBE", word: "happy", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "bright", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "tall", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "tiny", correctPartId: "adjective" },

  { trackId: "T_SENTENCE", word: "quickly", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "slowly", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "under", correctPartId: "preposition" },
  { trackId: "T_SENTENCE", word: "and", correctPartId: "conjunction" },
  { trackId: "T_SENTENCE", word: "but", correctPartId: "conjunction" },
  { trackId: "T_SENTENCE", word: "the", correctPartId: "article" },
  { trackId: "T_SENTENCE", word: "Wow!", correctPartId: "interjection" },

  { trackId: "T_READING", word: "she", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "after", correctPartId: "preposition" }
];

// Game 3: Tense Detective
// Authoring schema: { sentence: string, correctTense: "present"|"past"|"future", trackId: string }
var GAME3_QUESTIONS = [
  { trackId: "T_ACTIONS", sentence: "I play soccer every day.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "She runs fast.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "They are eating lunch now.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "We will walk to school tomorrow.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "He will help you later.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "I jumped yesterday.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "They played in the park.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "She will read tonight.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "We watched a movie last night.", correctTense: "past" },

  { trackId: "T_WORDS", sentence: "The dog is happy.", correctTense: "present" },
  { trackId: "T_WORDS", sentence: "The cat slept on the mat.", correctTense: "past" },

  { trackId: "T_DESCRIBE", sentence: "The sky will be bright tomorrow.", correctTense: "future" },
  { trackId: "T_DESCRIBE", sentence: "The flowers were beautiful.", correctTense: "past" },

  { trackId: "T_SENTENCE", sentence: "I am ready now.", correctTense: "present" },
  { trackId: "T_SENTENCE", sentence: "I was late yesterday.", correctTense: "past" },

  { trackId: "T_READING", sentence: "We will read after lunch.", correctTense: "future" },
  { trackId: "T_READING", sentence: "He read quietly last week.", correctTense: "past" }
];

// Game 4: Sentence Check (pick the best sentence)
// Authoring schema: { trackId: string, options: [string, string], optionsPa?: [string,string], correct: string }
var GAME4_QUESTIONS = [
  { trackId: "T_ACTIONS", options: ["My friends plays tag", "My friends play tag"], optionsPa: ["ਮੇਰੇ ਦੋਸਤ ਟੈਗ ਖੇਡਦੇ ਹਨ।", "ਮੇਰੇ ਦੋਸਤ ਟੈਗ ਖੇਡਦੇ ਹਨ।"], correct: "My friends play tag", explanationEn: "Plural (friends) uses the base verb.", explanationPa: "ਬਹੁ-ਵਚਨ (friends) ਨਾਲ ਸਾਧਾਰਣ ਕਿਰਿਆ ਆਉਂਦੀ ਹੈ।" },
  { trackId: "T_WORDS", options: ["There is many cars", "There are many cars"], optionsPa: ["ਇੱਥੇ ਬਹੁਤ ਸਾਰੀਆਂ ਗੱਡੀਆਂ ਹਨ।", "ਇੱਥੇ ਬਹੁਤ ਸਾਰੀਆਂ ਗੱਡੀਆਂ ਹਨ।"], correct: "There are many cars", explanationEn: "Many = plural, so use are.", explanationPa: "Many = ਬਹੁ-ਵਚਨ, ਇਸ ਲਈ are ਵਰਤੋ।" },
  { trackId: "T_READING", options: ["She read every night", "She reads every night"], optionsPa: ["ਉਹ ਹਰ ਰਾਤ ਪੜ੍ਹਦੀ ਹੈ।", "ਉਹ ਹਰ ਰਾਤ ਪੜ੍ਹਦੀ ਹੈ।"], correct: "She reads every night", explanationEn: "She uses verb + s.", explanationPa: "She ਨਾਲ ਕਿਰਿਆ 's' ਲੈਂਦੀ ਹੈ।" },
  { trackId: "T_DESCRIBE", options: ["The clouds is dark", "The clouds are dark"], optionsPa: ["ਬੱਦਲ ਕਾਲੇ ਹਨ।", "ਬੱਦਲ ਕਾਲੇ ਹਨ।"], correct: "The clouds are dark", explanationEn: "Clouds is plural, so use are.", explanationPa: "Clouds ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ are ਵਰਤੋ।" },
  { trackId: "T_SENTENCE", options: ["I am ready", "Me am ready"], optionsPa: ["ਮੈਂ ਤਿਆਰ ਹਾਂ।", "ਮੈਂ ਤਿਆਰ ਹਾਂ।"], correct: "I am ready", explanationEn: "Use I (subject) with am.", explanationPa: "am ਦੇ ਨਾਲ I (subject) ਵਰਤਦੇ ਹਨ।" },
  { trackId: "T_ACTIONS", options: ["He don't run fast", "He doesn't run fast"], optionsPa: ["ਉਹ ਤੇਜ਼ ਨਹੀਂ ਦੌੜਦਾ।", "ਉਹ ਤੇਜ਼ ਨਹੀਂ ਦੌੜਦਾ।"], correct: "He doesn't run fast", explanationEn: "He/She uses doesn't.", explanationPa: "He/She ਨਾਲ doesn't ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_WORDS", options: ["Those is my cookies", "Those are my cookies"], optionsPa: ["ਉਹ ਮੇਰੇ ਬਿਸਕੁਟ ਹਨ।", "ਉਹ ਮੇਰੇ ਬਿਸਕੁਟ ਹਨ।"], correct: "Those are my cookies", explanationEn: "Those is plural, so use are.", explanationPa: "Those ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ are ਵਰਤੋ।" },
  { trackId: "T_READING", options: ["An owl sat on a tree", "A owl sat on a tree"], optionsPa: ["ਇੱਕ ਉੱਲੂ ਦਰੱਖ਼ਤ ਉੱਤੇ ਬੈਠਿਆ ਸੀ।", "ਇੱਕ ਉੱਲੂ ਦਰੱਖ਼ਤ ਉੱਤੇ ਬੈਠਿਆ ਸੀ।"], correct: "An owl sat on a tree", explanationEn: "Use an before a vowel sound (owl).", explanationPa: "vowel sound (owl) ਤੋਂ ਪਹਿਲਾਂ an ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_DESCRIBE", options: ["The water taste sweet", "The water tastes sweet"], optionsPa: ["ਪਾਣੀ ਦਾ ਸੁਆਦ ਮਿੱਠਾ ਹੈ।", "ਪਾਣੀ ਦਾ ਸੁਆਦ ਮਿੱਠਾ ਹੈ।"], correct: "The water tastes sweet", explanationEn: "Water is singular, so use tastes.", explanationPa: "Water ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ tastes ਵਰਤੋ।" },
  { trackId: "T_SENTENCE", options: ["She are my friend", "She is my friend"], optionsPa: ["ਉਹ ਮੇਰੀ ਦੋਸਤ ਹਨ (ਗਲਤ)", "ਉਹ ਮੇਰੀ ਦੋਸਤ ਹੈ।"], correct: "She is my friend", explanationEn: "She is singular, so use is.", explanationPa: "She ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ is ਵਰਤੋ।" },
  { trackId: "T_WORDS", options: ["These is my books", "These are my books"], optionsPa: ["ਇਹ ਮੇਰੀਆਂ ਕਿਤਾਬਾਂ ਹੈ (ਗਲਤ)", "ਇਹ ਮੇਰੀਆਂ ਕਿਤਾਬਾਂ ਹਨ।"], correct: "These are my books", explanationEn: "These is plural, so use are.", explanationPa: "These ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ are ਵਰਤੋ।" },
  { trackId: "T_ACTIONS", options: ["He eat lunch", "He eats lunch"], optionsPa: ["ਉਹ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ ਖਾਂਦਾ (ਗਲਤ)", "ਉਹ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ ਖਾਂਦਾ ਹੈ।"], correct: "He eats lunch", explanationEn: "He/She uses verb + s.", explanationPa: "He/She ਨਾਲ ਕਿਰਿਆ 's' ਲੈਂਦੀ ਹੈ।" },
  { trackId: "T_ACTIONS", options: ["They goes home", "They go home"], optionsPa: ["ਉਹ ਘਰ ਜਾਂਦੇ ਹੈ (ਗਲਤ)", "ਉਹ ਘਰ ਜਾਂਦੇ ਹਨ।"], correct: "They go home", explanationEn: "They is plural, so use go.", explanationPa: "They ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ go ਵਰਤੋ।" },
  { trackId: "T_READING", options: ["I seen it", "I saw it"], optionsPa: ["ਮੈਂ ਵੇਖਿਆ ਹੈ (ਗਲਤ)", "ਮੈਂ ਇਹ ਵੇਖਿਆ।"], correct: "I saw it", explanationEn: "Saw is the past tense of see.", explanationPa: "Saw, see ਦਾ past tense ਹੈ।" },
  { trackId: "T_SENTENCE", options: ["Me like apples", "I like apples"], optionsPa: ["ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ (ਗਲਤ)", "ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ।"], correct: "I like apples", explanationEn: "Use I as the subject.", explanationPa: "Subject ਲਈ I ਵਰਤਦੇ ਹਨ।" },
  { trackId: "T_DESCRIBE", options: ["The flowers smells nice", "The flowers smell nice"], optionsPa: ["ਫੁੱਲ ਚੰਗੀ ਖੁਸ਼ਬੂ ਆਉਂਦੀ ਹੈ (ਗਲਤ)", "ਫੁੱਲਾਂ ਦੀ ਖੁਸ਼ਬੂ ਚੰਗੀ ਹੈ।"], correct: "The flowers smell nice", explanationEn: "Flowers is plural, so use smell.", explanationPa: "Flowers ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ smell ਵਰਤੋ।" },
  { trackId: "T_DESCRIBE", options: ["This shoes are new", "These shoes are new"], optionsPa: ["ਇਹ ਜੁੱਤੇ ਨਵੇਂ ਹਨ (ਗਲਤ)", "ਇਹ ਜੁੱਤੇ ਨਵੇਂ ਹਨ।"], correct: "These shoes are new", explanationEn: "Shoes is plural; use these.", explanationPa: "Shoes ਬਹੁ-ਵਚਨ ਹੈ; these ਵਰਤੋ।" },
  { trackId: "T_SENTENCE", options: ["Where you are going?", "Where are you going?"], optionsPa: ["ਤੂੰ ਕਿੱਥੇ ਜਾ ਰਿਹਾ? (ਗਲਤ)", "ਤੂੰ ਕਿੱਥੇ ਜਾ ਰਿਹਾ/ਰਹੀ ਹੈਂ?"], correct: "Where are you going?", explanationEn: "Questions need are before you.", explanationPa: "ਸਵਾਲ ਵਿੱਚ you ਤੋਂ ਪਹਿਲਾਂ are ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_READING", options: ["We was happy", "We were happy"], optionsPa: ["ਅਸੀਂ ਖੁਸ਼ ਸੀ (ਗਲਤ)", "ਅਸੀਂ ਖੁਸ਼ ਸੀ।"], correct: "We were happy", explanationEn: "We uses were.", explanationPa: "We ਨਾਲ were ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_WORDS", options: ["A apple", "An apple"], optionsPa: ["ਇੱਕ ਸੇਬ (ਗਲਤ)", "ਇੱਕ ਸੇਬ"], correct: "An apple", explanationEn: "Use an before vowel sounds.", explanationPa: "vowel sound ਤੋਂ ਪਹਿਲਾਂ an ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_ACTIONS", options: ["She don't like it", "She doesn't like it"], optionsPa: ["ਉਹਨੂੰ ਪਸੰਦ ਨਹੀਂ (ਗਲਤ)", "ਉਹਨੂੰ ਪਸੰਦ ਨਹੀਂ ਹੈ।"], correct: "She doesn't like it", explanationEn: "She uses doesn't.", explanationPa: "She ਨਾਲ doesn't ਆਉਂਦਾ ਹੈ।" },
  { trackId: "T_SENTENCE", options: ["There are a cat", "There is a cat"], optionsPa: ["ਇੱਥੇ ਇੱਕ ਬਿੱਲੀ ਹਨ (ਗਲਤ)", "ਇੱਥੇ ਇੱਕ ਬਿੱਲੀ ਹੈ।"], correct: "There is a cat", explanationEn: "A cat is singular, so use is.", explanationPa: "ਇੱਕ ਬਿੱਲੀ ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ is ਵਰਤੋ।" },
  { trackId: "T_READING", options: ["He have a book", "He has a book"], optionsPa: ["ਉਸ ਕੋਲ ਕਿਤਾਬ ਹੈ (ਗਲਤ)", "ਉਸ ਕੋਲ ਇੱਕ ਕਿਤਾਬ ਹੈ।"], correct: "He has a book", explanationEn: "He uses has.", explanationPa: "He ਨਾਲ has ਆਉਂਦਾ ਹੈ।" }
];


  // Game 5: Conversation Coach (Best Reply)
    // Author-friendly schema:
    // {
    //   id: "G5_001",
    //   difficulty: 1|2|3,
    //   trackId: "CONVO_REPLY",
    //   topic?: "apology",
    //   promptEn, promptPa?,
    //   choicesEn: [ ... ],
    //   choicesPa?: [ ... ],
    //   answerIndex: 0,
    //   hintEn, hintPa?,
    //   explainEn, explainPa?
    // }
    var RAW_GAME5_QUESTIONS = [
      {
        id: "G5_001",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "apology",
        promptEn: "Your friend says: \"I'm sorry I'm late.\" What do you say?",
        promptPa: "ਤੁਹਾਡਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਮਾਫ਼ ਕਰਨਾ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ/ਆਈ।\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["No worries.", "Go away.", "Why are you always late?", "I late too."],
        choicesPa: ["ਕੋਈ ਗੱਲ ਨਹੀਂ।", "ਚਲੇ ਜਾਓ।", "ਤੂੰ ਹਮੇਸ਼ਾਂ ਦੇਰ ਕਿਉਂ ਕਰਦਾ/ਕਰਦੀ ਹੈਂ?", "ਮੈਂ ਵੀ ਦੇਰ।"],
        answerIndex: 0,
        hintEn: "Pick a polite, common reply that accepts the apology.",
        hintPa: "ਮਾਫ਼ੀ ਨੂੰ ਸਵੀਕਾਰ ਕਰਨ ਵਾਲਾ ਨਮ੍ਰ ਜਵਾਬ ਚੁਣੋ।",
        explainEn: "\"No worries.\" is a natural, polite way to accept an apology. The other choices are rude or unnatural.",
        explainPa: "\"No worries.\" ਮਾਫ਼ੀ ਮਨਜ਼ੂਰ ਕਰਨ ਲਈ ਨਮ੍ਰ ਤੇ ਆਮ ਜਵਾਬ ਹੈ। ਬਾਕੀ ਚੋਣਾਂ ਰੁੱਖੀਆਂ ਜਾਂ ਅਜੀਬ ਹਨ।"
      },
      {
        id: "G5_002",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "thanks",
        promptEn: "Someone says: \"Thank you!\" What do you say?",
        promptPa: "ਕੋਈ ਕਹਿੰਦਾ ਹੈ: \"ਧੰਨਵਾਦ!\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["You're welcome.", "Same to you.", "Please.", "What?"],
        choicesPa: ["ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।", "ਤੈਨੂੰ ਵੀ।", "ਕਿਰਪਾ ਕਰਕੇ।", "ਕੀ?"],
        answerIndex: 0,
        hintEn: "Choose the standard reply to thanks.",
        hintPa: "ਧੰਨਵਾਦ ਦੇ ਜਵਾਬ ਲਈ ਆਮ ਵਾਕ ਚੁਣੋ।",
        explainEn: "\"You're welcome.\" is the usual response to thanks. The others do not match the situation.",
        explainPa: "\"You're welcome.\" ਧੰਨਵਾਦ ਦਾ ਆਮ ਜਵਾਬ ਹੈ। ਬਾਕੀਆਂ ਚੋਣਾਂ ਢੁੱਕਵੀਆਂ ਨਹੀਂ।"
      },
      {
        id: "G5_003",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "greeting",
        promptEn: "A classmate says: \"Hi! How are you?\" What do you say?",
        promptPa: "ਕਲਾਸਮੇਟ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ: \"ਹੈਲੋ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["I'm good, thanks. How about you?", "Because school.", "Go home.", "I am 15 years."],
        choicesPa: ["ਮੈਂ ਠੀਕ ਹਾਂ, ਧੰਨਵਾਦ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", "ਕਿਉਂਕਿ ਸਕੂਲ।", "ਘਰ ਚਲੇ ਜਾਓ।", "ਮੈਂ 15 ਸਾਲ ਹਾਂ (ਗਲਤ)।"],
        answerIndex: 0,
        hintEn: "Reply friendly and ask back.",
        hintPa: "ਦੋਸਤਾਨਾ ਜਵਾਬ ਦਿਓ ਅਤੇ ਵਾਪਸ ਪੁੱਛੋ।",
        explainEn: "The best reply answers the question and continues the conversation: \"I'm good... How about you?\"",
        explainPa: "ਚੰਗਾ ਜਵਾਬ ਸਵਾਲ ਦਾ ਜਵਾਬ ਵੀ ਦਿੰਦਾ ਹੈ ਅਤੇ ਗੱਲ ਵੀ ਅੱਗੇ ਵਧਾਉਂਦਾ ਹੈ।"
      },
      {
        id: "G5_004",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "borrow_item_yes",
        promptEn: "Your friend asks: \"Can I borrow your pen?\" You want to say yes. What do you say?",
        promptPa: "ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਕੀ ਮੈਂ ਤੇਰਾ ਪੈਨ ਉਧਾਰ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?\" ਤੁਸੀਂ ਹਾਂ ਕਹਿਣੀ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Sure—here you go.", "Maybe never.", "You must borrow it.", "I don't like pens."],
        choicesPa: ["ਹਾਂ—ਲੈ ਲਓ।", "ਸ਼ਾਇਦ ਕਦੇ ਨਹੀਂ।", "ਤੂੰ ਲੈਣਾ ਹੀ ਪਏਗਾ (ਅਜੀਬ)।", "ਮੈਨੂੰ ਪੈਨ ਪਸੰਦ ਨਹੀਂ।"],
        answerIndex: 0,
        hintEn: "Pick a simple, friendly yes.",
        hintPa: "ਸਾਦਾ ਤੇ ਦੋਸਤਾਨਾ “ਹਾਂ” ਚੁਣੋ।",
        explainEn: "\"Sure—here you go.\" is natural and helpful. The other choices are awkward or not a real yes.",
        explainPa: "\"Sure—here you go.\" ਕੁਦਰਤੀ ਤੇ ਮਦਦਗਾਰ ਹੈ। ਬਾਕੀਆਂ ਚੋਣਾਂ ਅਜੀਬ ਹਨ ਜਾਂ “ਹਾਂ” ਨਹੀਂ।"
      },
      {
        id: "G5_005",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "permission_teacher",
        promptEn: "You need to leave class. What is the best thing to say to the teacher?",
        promptPa: "ਤੁਹਾਨੂੰ ਕਲਾਸ ਤੋਂ ਬਾਹਰ ਜਾਣਾ ਹੈ। ਅਧਿਆਪਕ ਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["May I use the bathroom, please?", "I go bathroom now.", "Move.", "Bathroom is mine."],
        choicesPa: ["ਕੀ ਮੈਂ ਬਾਥਰੂਮ ਜਾ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਕਿਰਪਾ ਕਰਕੇ?", "ਮੈਂ ਹੁਣ ਬਾਥਰੂਮ ਜਾਂਦਾ/ਜਾਂਦੀ।", "ਹਟੋ।", "ਬਾਥਰੂਮ ਮੇਰਾ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Choose a polite permission question.",
        hintPa: "ਨਮ੍ਰ ਢੰਗ ਨਾਲ ਇਜਾਜ਼ਤ ਮੰਗੋ।",
        explainEn: "\"May I... please?\" is polite and appropriate for a teacher. The others are rude or incorrect.",
        explainPa: "\"May I... please?\" ਅਧਿਆਪਕ ਲਈ ਨਮ੍ਰ ਅਤੇ ਢੁੱਕਵਾਂ ਹੈ। ਬਾਕੀ ਰੁੱਖੇ ਜਾਂ ਗਲਤ ਹਨ।"
      },
      {
        id: "G5_006",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "invitation_accept",
        promptEn: "Your friend says: \"Come sit with us.\" You want to accept. What do you say?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਆ ਕੇ ਸਾਡੇ ਨਾਲ ਬੈਠ।\" ਤੁਸੀਂ ਸੱਦਾ ਕਬੂਲ ਕਰਨਾ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Thanks! I'd love to.", "No. Don't talk to me.", "You sit.", "Whatever."],
        choicesPa: ["ਧੰਨਵਾਦ! ਬਿਲਕੁਲ।", "ਨਹੀਂ। ਮੇਰੇ ਨਾਲ ਗੱਲ ਨਾ ਕਰ।", "ਤੂੰ ਬੈਠ।", "ਛੱਡ।"],
        answerIndex: 0,
        hintEn: "Accept warmly and politely.",
        hintPa: "ਨਮ੍ਰਤਾ ਨਾਲ ਸੱਦਾ ਕਬੂਲ ਕਰੋ।",
        explainEn: "\"Thanks! I'd love to.\" is a warm acceptance. The other choices are rude or dismissive.",
        explainPa: "\"Thanks! I'd love to.\" ਸੱਦਾ ਕਬੂਲ ਕਰਨ ਲਈ ਦੋਸਤਾਨਾ ਵਾਕ ਹੈ। ਬਾਕੀ ਰੁੱਖੇ ਹਨ।"
      },
      {
        id: "G5_007",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "compliment",
        promptEn: "Someone says: \"Nice shoes!\" What do you say?",
        promptPa: "ਕੋਈ ਕਹਿੰਦਾ ਹੈ: \"ਜੁੱਤੇ ਵਧੀਆ ਨੇ!\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Thanks!", "Yes, I know.", "Why are you looking?", "Give me money."],
        choicesPa: ["ਧੰਨਵਾਦ!", "ਹਾਂ, ਮੈਨੂੰ ਪਤਾ।", "ਤੂੰ ਕਿਉਂ ਵੇਖ ਰਿਹਾ/ਰਹੀ?", "ਮੈਨੂੰ ਪੈਸੇ ਦੇ।"],
        answerIndex: 0,
        hintEn: "Reply politely to a compliment.",
        hintPa: "ਤਾਰੀਫ਼ ਦਾ ਨਮ੍ਰ ਜਵਾਬ ਦਿਓ।",
        explainEn: "\"Thanks!\" is the normal, polite response. The others sound rude or strange.",
        explainPa: "\"Thanks!\" ਆਮ ਅਤੇ ਨਮ੍ਰ ਜਵਾਬ ਹੈ। ਬਾਕੀਆਂ ਰੁੱਖੇ ਜਾਂ ਅਜੀਬ ਲੱਗਦੇ ਹਨ।"
      },
      {
        id: "G5_008",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "minor_apology",
        promptEn: "You bump into someone in the hallway. What do you say?",
        promptPa: "ਤੁਸੀਂ ਰਸਤੇ ਵਿੱਚ ਕਿਸੇ ਨਾਲ ਟਕਰਾ ਜਾਂਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Sorry!", "Watch it!", "That's your fault.", "Don't touch me."],
        choicesPa: ["ਮਾਫ਼ ਕਰਨਾ!", "ਧਿਆਨ ਰੱਖ!", "ਤੇਰੀ ਗਲਤੀ ਹੈ।", "ਮੈਨੂੰ ਨਾ ਛੂਹ।"],
        answerIndex: 0,
        hintEn: "Choose a quick apology.",
        hintPa: "ਛੋਟੀ ਮਾਫ਼ੀ ਚੁਣੋ।",
        explainEn: "\"Sorry!\" is the standard quick apology. The other choices blame or escalate.",
        explainPa: "\"Sorry!\" ਆਮ ਮਾਫ਼ੀ ਹੈ। ਬਾਕੀ ਦੋਸ਼ ਲਗਾਉਂਦੇ ਹਨ ਜਾਂ ਗੱਲ ਵਧਾਉਂਦੇ ਹਨ।"
      },
      {
        id: "G5_009",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "goodbye",
        promptEn: "Your friend says: \"See you later!\" What do you say?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਫਿਰ ਮਿਲਾਂਗੇ!\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["See you!", "Yesterday!", "I am later.", "Don't speak."],
        choicesPa: ["ਠੀਕ ਹੈ, ਮਿਲਦੇ ਹਾਂ!", "ਕੱਲ੍ਹ! (ਗਲਤ)", "ਮੈਂ ਬਾਅਦ ਹਾਂ (ਗਲਤ)", "ਗੱਲ ਨਾ ਕਰ।"],
        answerIndex: 0,
        hintEn: "Pick a normal goodbye reply.",
        hintPa: "ਆਮ ਵਿਦਾਈ ਜਵਾਬ ਚੁਣੋ।",
        explainEn: "\"See you!\" matches naturally. The other options are incorrect or rude.",
        explainPa: "\"See you!\" ਕੁਦਰਤੀ ਜਵਾਬ ਹੈ। ਹੋਰ ਚੋਣਾਂ ਗਲਤ ਜਾਂ ਰੁੱਖੀਆਂ ਹਨ।"
      },
      {
        id: "G5_010",
        difficulty: 1,
        trackId: "CONVO_REPLY",
        topic: "offer_help",
        promptEn: "Someone says: \"I can't find my phone.\" What do you say?",
        promptPa: "ਕੋਈ ਕਹਿੰਦਾ ਹੈ: \"ਮੈਨੂੰ ਮੇਰਾ ਫੋਨ ਨਹੀਂ ਮਿਲ ਰਿਹਾ।\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Want me to help you look for it?", "That's your problem.", "Calm down.", "Buy a new one."],
        choicesPa: ["ਕੀ ਮੈਂ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰਾਂ?", "ਉਹ ਤੇਰੀ ਸਮੱਸਿਆ ਹੈ।", "ਸ਼ਾਂਤ ਹੋ ਜਾ।", "ਨਵਾਂ ਖਰੀਦ ਲੈ।"],
        answerIndex: 0,
        hintEn: "Offer help politely.",
        hintPa: "ਨਮ੍ਰਤਾ ਨਾਲ ਮਦਦ ਪੇਸ਼ ਕਰੋ।",
        explainEn: "Offering help is the most supportive response. The others are dismissive.",
        explainPa: "ਮਦਦ ਦੀ ਪੇਸ਼ਕਸ਼ ਸਭ ਤੋਂ ਸਹਾਇਕ ਜਵਾਬ ਹੈ। ਬਾਕੀ ਟਾਲਣ ਵਾਲੇ ਹਨ।"
      },
      {
        id: "G5_011",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "clarify_location",
        promptEn: "Your friend texts: \"Meet me by the office.\" You are not sure which office. What do you say?",
        promptPa: "ਦੋਸਤ ਮੈਸੇਜ ਕਰਦਾ ਹੈ: \"ਦਫ਼ਤਰ ਕੋਲ ਮਿਲ।\" ਤੁਹਾਨੂੰ ਪਤਾ ਨਹੀਂ ਕਿਹੜਾ ਦਫ਼ਤਰ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Which office do you mean?", "Okay.", "Office is good.", "Don't ask me."],
        choicesPa: ["ਕਿਹੜਾ ਦਫ਼ਤਰ ਮਤਲਬ?", "ਠੀਕ ਹੈ।", "ਦਫ਼ਤਰ ਚੰਗਾ ਹੈ (ਬੇਤੁਕਾ)।", "ਮੈਨੂੰ ਨਾ ਪੁੱਛ।"],
        answerIndex: 0,
        hintEn: "Ask a short clarifying question.",
        hintPa: "ਛੋਟਾ ਸਪਸ਼ਟੀਕਰਨ ਵਾਲਾ ਸਵਾਲ ਕਰੋ।",
        explainEn: "\"Which office do you mean?\" is clear and solves the problem. The others do not clarify.",
        explainPa: "ਇਹ ਸਪਸ਼ਟ ਹੈ ਅਤੇ ਸਮੱਸਿਆ ਹੱਲ ਕਰਦਾ ਹੈ। ਬਾਕੀਆਂ ਨਾਲ ਸਪਸ਼ਟੀਕਰਨ ਨਹੀਂ ਹੁੰਦਾ।"
      },
      {
        id: "G5_012",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "indirect_request_borrow",
        promptEn: "A classmate asks: \"Do you have a charger?\" They want to borrow it. What is the best reply?",
        promptPa: "ਕਲਾਸਮੇਟ ਪੁੱਛਦਾ ਹੈ: \"ਕੀ ਤੇਰੇ ਕੋਲ ਚਾਰਜਰ ਹੈ?\" ਉਹ ਉਧਾਰ ਲੈਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ। ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["Yeah, you can use mine.", "Yes, I have one.", "Chargers are expensive.", "You should buy one."],
        choicesPa: ["ਹਾਂ, ਤੂੰ ਮੇਰਾ ਵਰਤ ਲੈ।", "ਹਾਂ, ਮੇਰੇ ਕੋਲ ਹੈ।", "ਚਾਰਜਰ ਮਹਿੰਗੇ ਹੁੰਦੇ ਨੇ।", "ਤੂੰ ਖਰੀਦ ਲੈ।"],
        answerIndex: 0,
        hintEn: "Answer the real request: using/borrowing the charger.",
        hintPa: "ਅਸਲ ਬੇਨਤੀ (ਵਰਤਣਾ/ਉਧਾਰ) ਦਾ ਜਵਾਬ ਦਿਓ।",
        explainEn: "They are really asking to use it. \"You can use mine\" responds to the need.",
        explainPa: "ਉਹ ਅਸਲ ਵਿੱਚ ਵਰਤਣ ਲਈ ਪੁੱਛ ਰਹੇ ਹਨ। ਇਹ ਜਵਾਬ ਢੁੱਕਵਾਂ ਹੈ।"
      },
      {
        id: "G5_013",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "soft_no_reschedule",
        promptEn: "Your friend asks: \"Can you hang out today?\" You are busy. What do you say?",
        promptPa: "ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਅੱਜ ਮਿਲੀਏ?\" ਤੁਸੀਂ ਵਿਅਸਤ ਹੋ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["I can't today, but maybe tomorrow.", "No.", "Stop asking.", "I am busying."],
        choicesPa: ["ਅੱਜ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਪਰ ਕੱਲ੍ਹ ਸ਼ਾਇਦ।", "ਨਹੀਂ।", "ਪੁੱਛਣਾ ਬੰਦ ਕਰ।", "ਮੈਂ ਬਿਜ਼ੀਿੰਗ (ਗਲਤ)।"],
        answerIndex: 0,
        hintEn: "Refuse politely and offer another time.",
        hintPa: "ਨਮ੍ਰਤਾ ਨਾਲ ਇਨਕਾਰ ਕਰੋ ਅਤੇ ਹੋਰ ਸਮਾਂ ਦਿਓ।",
        explainEn: "A polite no plus an alternative keeps the friendship positive.",
        explainPa: "ਨਮ੍ਰ “ਨਾ” ਅਤੇ ਹੋਰ ਸਮਾਂ ਦਿਣਾ ਗੱਲ ਨੂੰ ਚੰਗਾ ਰੱਖਦਾ ਹੈ।"
      },
      {
        id: "G5_014",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "teacher_text_fix",
        promptEn: "You sent the wrong homework file. What should you text your teacher?",
        promptPa: "ਤੁਸੀਂ ਗਲਤ ਹੋਮਵਰਕ ਫ਼ਾਈਲ ਭੇਜ ਦਿੱਤੀ। ਅਧਿਆਪਕ ਨੂੰ ਕੀ ਮੈਸੇਜ ਕਰੋਗੇ?",
        choicesEn: ["Sorry—I sent the wrong file. Here is the correct one.", "You got it wrong.", "I don't care.", "Homework is done."],
        choicesPa: ["ਮਾਫ਼ ਕਰਨਾ—ਮੈਂ ਗਲਤ ਫ਼ਾਈਲ ਭੇਜੀ ਸੀ। ਇਹ ਸਹੀ ਫ਼ਾਈਲ ਹੈ।", "ਤੁਸੀਂ ਗਲਤ ਹੋ।", "ਮੈਨੂੰ ਪਰਵਾਹ ਨਹੀਂ।", "ਹੋਮਵਰਕ ਹੋ ਗਿਆ।"],
        answerIndex: 0,
        hintEn: "Take responsibility and fix the mistake.",
        hintPa: "ਗਲਤੀ ਮੰਨੋ ਅਤੇ ਠੀਕ ਕਰੋ।",
        explainEn: "A brief apology plus the correction is professional and clear.",
        explainPa: "ਛੋਟੀ ਮਾਫ਼ੀ ਅਤੇ ਸਹੀ ਫ਼ਾਈਲ ਭੇਜਣਾ ਸਭ ਤੋਂ ਚੰਗਾ ਹੈ।"
      },
      {
        id: "G5_015",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "congrats",
        promptEn: "Your friend says: \"I got an A on the test!\" What do you say?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਟੈਸਟ ਵਿੱਚ ਮੈਨੂੰ A ਆਇਆ!\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Congrats! That's awesome.", "Why did you do that?", "Bad job.", "I always get A too."],
        choicesPa: ["ਵਧਾਈਆਂ! ਬਹੁਤ ਵਧੀਆ।", "ਤੂੰ ਇਹ ਕਿਉਂ ਕੀਤਾ? (ਗਲਤ)", "ਮਾੜਾ ਕੰਮ।", "ਮੈਨੂੰ ਵੀ ਹਮੇਸ਼ਾਂ A ਆਉਂਦਾ (ਅਜੀਬ)।"],
        answerIndex: 0,
        hintEn: "Celebrate their good news.",
        hintPa: "ਉਨ੍ਹਾਂ ਦੀ ਖੁਸ਼ਖ਼ਬਰੀ ਦੀ ਖੁਸ਼ੀ ਮਨਾਓ।",
        explainEn: "Congratulating is the supportive, natural response.",
        explainPa: "ਵਧਾਈ ਦੇਣਾ ਦੋਸਤਾਨਾ ਅਤੇ ਢੁੱਕਵਾਂ ਜਵਾਬ ਹੈ।"
      },
      {
        id: "G5_016",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "boundary_studying",
        promptEn: "A friend keeps texting while you're studying. What is a polite boundary message?",
        promptPa: "ਦੋਸਤ ਪੜ੍ਹਾਈ ਵੇਲੇ ਵਾਰ-ਵਾਰ ਮੈਸੇਜ ਕਰਦਾ ਹੈ। ਨਮ੍ਰ ਹੱਦ ਵਾਲਾ ਮੈਸੇਜ ਕੀ ਹੈ?",
        choicesEn: ["I'm studying right now—can I text you later?", "Stop texting me forever.", "You're so annoying.", "Texting is stupid."],
        choicesPa: ["ਮੈਂ ਹੁਣ ਪੜ੍ਹ ਰਿਹਾ/ਰਹੀ ਹਾਂ—ਕੀ ਮੈਂ ਬਾਅਦ ਵਿੱਚ ਮੈਸੇਜ ਕਰਾਂ?", "ਹਮੇਸ਼ਾਂ ਲਈ ਮੈਸੇਜ ਨਾ ਕਰ।", "ਤੂੰ ਬਹੁਤ ਚਿੜਾਉਂਦਾ/ਚਿੜਾਉਂਦੀ ਹੈਂ।", "ਮੈਸੇਜ ਕਰਨਾ ਬੇਕਾਰ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Be clear and calm, not rude.",
        hintPa: "ਸਪਸ਼ਟ ਅਤੇ ਸ਼ਾਂਤ ਰਹੋ, ਰੁੱਖੇ ਨਾ ਬਣੋ।",
        explainEn: "It explains your situation and suggests a better time without attacking them.",
        explainPa: "ਇਹ ਆਪਣੀ ਸਥਿਤੀ ਦੱਸਦਾ ਹੈ ਅਤੇ ਬਿਨਾਂ ਰੁੱਖੇ ਬਣੇ ਬਾਅਦ ਦਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ।"
      },
      {
        id: "G5_017",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "ask_help",
        promptEn: "You didn't understand the homework. What should you ask a classmate?",
        promptPa: "ਤੁਹਾਨੂੰ ਹੋਮਵਰਕ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਲਾਸਮੇਟ ਨੂੰ ਕੀ ਪੁੱਛੋਗੇ?",
        choicesEn: ["Can you explain number 3 to me?", "Do it for me.", "This homework is trash.", "I hate homework."],
        choicesPa: ["ਕੀ ਤੂੰ ਮੈਨੂੰ ਨੰਬਰ 3 ਸਮਝਾ ਸਕਦਾ/ਸਕਦੀ ਹੈਂ?", "ਤੂੰ ਮੇਰੇ ਲਈ ਕਰ ਦੇ।", "ਇਹ ਹੋਮਵਰਕ ਬਕਵਾਸ ਹੈ।", "ਮੈਨੂੰ ਹੋਮਵਰਕ ਨਫ਼ਰਤ ਹੈ (ਅਜੀਬ)।"],
        answerIndex: 0,
        hintEn: "Ask respectfully and specifically.",
        hintPa: "ਨਮ੍ਰਤਾ ਨਾਲ ਅਤੇ ਖਾਸ ਤੌਰ ਤੇ ਪੁੱਛੋ।",
        explainEn: "A specific, polite question gets real help and keeps the tone friendly.",
        explainPa: "ਖਾਸ ਅਤੇ ਨਮ੍ਰ ਸਵਾਲ ਨਾਲ ਮਦਦ ਵੀ ਮਿਲਦੀ ਹੈ ਅਤੇ ਟੋਨ ਵੀ ਠੀਕ ਰਹਿੰਦੀ ਹੈ।"
      },
      {
        id: "G5_018",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "late_update",
        promptEn: "You're running late to meet a friend. What should you text?",
        promptPa: "ਤੁਸੀਂ ਦੋਸਤ ਨੂੰ ਮਿਲਣ ਲਈ ਦੇਰ ਕਰ ਰਹੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਮੈਸੇਜ ਕਰੋਗੇ?",
        choicesEn: ["I'm running a bit late—I'll be there in 10 minutes.", "I'm late. Bye.", "Wait forever.", "You are late."],
        choicesPa: ["ਮੈਂ ਥੋੜ੍ਹਾ ਦੇਰ ਨਾਲ ਆ ਰਿਹਾ/ਰਹੀ ਹਾਂ—10 ਮਿੰਟ ਵਿੱਚ ਪਹੁੰਚਦਾ/ਪਹੁੰਚਦੀ ਹਾਂ।", "ਮੈਂ ਦੇਰ। ਬਾਈ।", "ਹਮੇਸ਼ਾਂ ਉਡੀਕ ਕਰ।", "ਤੂੰ ਦੇਰ ਹੈਂ।"],
        answerIndex: 0,
        hintEn: "Apologize briefly and give a clear time.",
        hintPa: "ਛੋਟੀ ਮਾਫ਼ੀ ਅਤੇ ਸਪਸ਼ਟ ਸਮਾਂ ਦਿਓ।",
        explainEn: "It's polite and gives useful information.",
        explainPa: "ਇਹ ਨਮ੍ਰ ਹੈ ਅਤੇ ਮਦਦਗਾਰ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ।"
      },
      {
        id: "G5_019",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "accept_offer",
        promptEn: "Someone offers you food: \"Do you want some?\" You want to say yes politely. What do you say?",
        promptPa: "ਕੋਈ ਖਾਣਾ ਪੇਸ਼ ਕਰਦਾ ਹੈ: \"ਥੋੜ੍ਹਾ ਚਾਹੀਦਾ?\" ਤੁਸੀਂ ਨਮ੍ਰਤਾ ਨਾਲ ਹਾਂ ਕਹਿਣਾ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Yes, please. Thank you.", "Give it now.", "I deserve it.", "Food is mine."],
        choicesPa: ["ਹਾਂ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ। ਧੰਨਵਾਦ।", "ਹੁਣੇ ਦੇ।", "ਮੈਂ ਇਸ ਦਾ ਹੱਕਦਾਰ ਹਾਂ (ਅਜੀਬ)।", "ਖਾਣਾ ਮੇਰਾ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Choose a polite yes.",
        hintPa: "ਨਮ੍ਰ “ਹਾਂ” ਚੁਣੋ।",
        explainEn: "\"Yes, please. Thank you.\" is polite and natural in this situation.",
        explainPa: "\"ਹਾਂ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ। ਧੰਨਵਾਦ।\" ਨਮ੍ਰ ਅਤੇ ਕੁਦਰਤੀ ਹੈ।"
      },
      {
        id: "G5_020",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "polite_disagree",
        promptEn: "A friend says: \"That movie was terrible.\" You disagree but want to be polite. What do you say?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਉਹ ਫ਼ਿਲਮ ਬਹੁਤ ਮਾੜੀ ਸੀ।\" ਤੁਸੀਂ ਅਸਹਿਮਤ ਹੋ ਪਰ ਨਮ੍ਰ ਰਹਿਣਾ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["I actually liked it.", "You're wrong.", "Shut up.", "Movies are stupid."],
        choicesPa: ["ਮੈਨੂੰ ਤਾਂ ਚੰਗੀ ਲੱਗੀ।", "ਤੂੰ ਗਲਤ ਹੈਂ।", "ਚੁੱਪ ਕਰ।", "ਫ਼ਿਲਮਾਂ ਬੇਕਾਰ ਨੇ।"],
        answerIndex: 0,
        hintEn: "Disagree softly without attacking them.",
        hintPa: "ਹੌਲੀ ਅਸਹਿਮਤੀ ਕਰੋ, ਹਮਲਾ ਨਾ ਕਰੋ।",
        explainEn: "\"I actually liked it.\" is calm and respectful. The other options are aggressive or insulting.",
        explainPa: "ਇਹ ਸ਼ਾਂਤ ਅਤੇ ਨਮ੍ਰ ਅਸਹਿਮਤੀ ਹੈ। ਬਾਕੀ ਰੁੱਖੇ ਹਨ।"
      },
      {
        id: "G5_021",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "peer_pressure",
        promptEn: "A friend says: \"Skip class with me.\" You want to refuse without being rude. What do you say?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਮੇਰੇ ਨਾਲ ਕਲਾਸ ਛੱਡ ਦੇ।\" ਤੁਸੀਂ ਰੁੱਖੇ ਬਿਨਾਂ ਇਨਕਾਰ ਕਰਨਾ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Nah, I'm going to class. You should come too.", "No. You're bad.", "Fine, let's skip every time.", "Class is stupid."],
        choicesPa: ["ਨਹੀਂ, ਮੈਂ ਕਲਾਸ ਜਾ ਰਿਹਾ/ਰਹੀ ਹਾਂ। ਤੂੰ ਵੀ ਆ ਜਾ।", "ਨਹੀਂ। ਤੂੰ ਮਾੜਾ ਹੈਂ।", "ਹਾਂ, ਹਰ ਵਾਰੀ ਛੱਡੀਏ।", "ਕਲਾਸ ਬੇਕਾਰ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Refuse + suggest the better choice.",
        hintPa: "ਇਨਕਾਰ ਕਰੋ ਅਤੇ ਚੰਗੀ ਚੋਣ ਸੁਝਾਓ।",
        explainEn: "It keeps your boundary and encourages them, without insulting them.",
        explainPa: "ਇਹ ਆਪਣੀ ਹੱਦ ਰੱਖਦਾ ਹੈ ਅਤੇ ਬਿਨਾਂ ਬੇਇਜ਼ਤੀ ਕੀਤੇ ਚੰਗਾ ਸੁਝਾਅ ਦਿੰਦਾ ਹੈ।"
      },
      {
        id: "G5_022",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "misunderstanding",
        promptEn: "Your friend looks upset and says: \"So you didn't want to invite me?\" You DID want to invite them. What do you say?",
        promptPa: "ਦੋਸਤ ਉਦਾਸ ਹੋ ਕੇ ਕਹਿੰਦਾ ਹੈ: \"ਤੂੰ ਮੈਨੂੰ ਬੁਲਾਉਣਾ ਨਹੀਂ ਸੀ?\" ਤੁਸੀਂ ਬੁਲਾਉਣਾ ਚਾਹੁੰਦੇ ਸੀ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["I did want to invite you—there was a misunderstanding.", "Yeah, I didn't want you there.", "Whatever.", "You're too sensitive."],
        choicesPa: ["ਮੈਂ ਤਾਂ ਤੈਨੂੰ ਬੁਲਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਸੀ—ਗਲਤਫ਼ਹਮੀ ਹੋ ਗਈ।", "ਹਾਂ, ਮੈਂ ਨਹੀਂ ਚਾਹੁੰਦਾ ਸੀ।", "ਛੱਡ।", "ਤੂੰ ਬਹੁਤ ਜ਼ਿਆਦਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈਂ।"],
        answerIndex: 0,
        hintEn: "Reassure them and explain calmly.",
        hintPa: "ਭਰੋਸਾ ਦਿਓ ਅਤੇ ਸ਼ਾਂਤ ਢੰਗ ਨਾਲ ਸਮਝਾਓ।",
        explainEn: "This reassures your friend and reduces conflict by naming it as a misunderstanding.",
        explainPa: "ਇਹ ਦੋਸਤ ਨੂੰ ਭਰੋਸਾ ਦਿੰਦਾ ਹੈ ਅਤੇ ਗੱਲ ਨੂੰ ਸ਼ਾਂਤ ਕਰਦਾ ਹੈ।"
      },
      {
        id: "G5_023",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "refuse_cheating",
        promptEn: "A friend asks: \"Can you send me the answers?\" You do not want to cheat. What do you say?",
        promptPa: "ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਉੱਤਰ ਭੇਜ ਦੇ?\" ਤੁਸੀਂ ਚੀਟ ਨਹੀਂ ਕਰਨੀ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["I can't send answers, but I can help you understand it.", "Sure—I'll send everything.", "No. Don't talk to me.", "Cheating is fine."],
        choicesPa: ["ਮੈਂ ਉੱਤਰ ਨਹੀਂ ਭੇਜ ਸਕਦਾ/ਸਕਦੀ, ਪਰ ਮੈਂ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।", "ਹਾਂ—ਮੈਂ ਸਾਰੇ ਭੇਜ ਦਿਆਂਗਾ/ਦਿਆਂਗੀ।", "ਨਹੀਂ। ਮੇਰੇ ਨਾਲ ਗੱਲ ਨਾ ਕਰ।", "ਚੀਟ ਕਰਨੀ ਠੀਕ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Say no and offer a helpful alternative.",
        hintPa: "ਨਹੀਂ ਕਹੋ ਅਤੇ ਮਦਦ ਵਾਲਾ ਵਿਕਲਪ ਦਿਓ।",
        explainEn: "It protects integrity while still being supportive.",
        explainPa: "ਇਹ ਇਮਾਨਦਾਰੀ ਵੀ ਰੱਖਦਾ ਹੈ ਅਤੇ ਮਦਦ ਵੀ ਕਰਦਾ ਹੈ।"
      },
      {
        id: "G5_024",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "texting_tone",
        promptEn: "Someone texts: \"K.\" You think they might be annoyed. What is a calm, respectful reply?",
        promptPa: "ਕੋਈ ਮੈਸੇਜ ਕਰਦਾ ਹੈ: \"K.\" ਤੁਹਾਨੂੰ ਲੱਗਦਾ ਹੈ ਉਹ ਨਾਰਾਜ਼ ਹੋ ਸਕਦੇ ਹਨ। ਸ਼ਾਂਤ ਤੇ ਨਮ੍ਰ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["All good—did I upset you?", "Why are you mad???", "Stop being weird.", "K."],
        choicesPa: ["ਸਭ ਠੀਕ? ਕੀ ਮੈਂ ਤੈਨੂੰ ਨਾਰਾਜ਼ ਕਰ ਦਿੱਤਾ?", "ਤੂੰ ਗੁੱਸੇ ਕਿਉਂ???", "ਅਜੀਬ ਨਾ ਬਣ।", "K."],
        answerIndex: 0,
        hintEn: "Check in without accusing.",
        hintPa: "ਦੋਸ਼ ਲਗਾਏ ਬਿਨਾਂ ਪੁੱਛੋ।",
        explainEn: "It shows care and invites clarity. The other options escalate or sound rude.",
        explainPa: "ਇਹ ਪਰਵਾਹ ਦਿਖਾਉਂਦਾ ਹੈ ਅਤੇ ਸਪਸ਼ਟਤਾ ਮੰਗਦਾ ਹੈ। ਬਾਕੀਆਂ ਨਾਲ ਗੱਲ ਵਧਦੀ ਹੈ।"
      },
      {
        id: "G5_025",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "group_work_accountability",
        promptEn: "In a group project, one person isn't doing their part. What is a firm but respectful message?",
        promptPa: "ਗਰੁੱਪ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ਇੱਕ ਬੰਦਾ ਆਪਣਾ ਹਿੱਸਾ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਸਖ਼ਤ ਪਰ ਨਮ੍ਰ ਮੈਸੇਜ ਕੀ ਹੈ?",
        choicesEn: ["Hey—can you finish your part by tonight? We need it to submit.", "You're useless. Do it.", "I'll do everything. You do nothing.", "Whatever, it doesn't matter."],
        choicesPa: ["ਹੇ—ਕੀ ਤੂੰ ਅੱਜ ਰਾਤ ਤੱਕ ਆਪਣਾ ਹਿੱਸਾ ਮੁਕਾ ਸਕਦਾ/ਸਕਦੀ ਹੈਂ? ਸਬਮਿਟ ਲਈ ਚਾਹੀਦਾ।", "ਤੂੰ ਨਿਕੰਮਾ ਹੈਂ। ਕਰ ਕੰਮ।", "ਮੈਂ ਸਭ ਕਰ ਲਾਂਗਾ/ਲਾਂਗੀ। ਤੂੰ ਕੁਝ ਨਾ ਕਰ।", "ਛੱਡ, ਕੋਈ ਗੱਲ ਨਹੀਂ।"],
        answerIndex: 0,
        hintEn: "Be specific: what + deadline + reason.",
        hintPa: "ਖਾਸ ਬਣੋ: ਕੀ + ਕਦੋਂ ਤੱਕ + ਕਿਉਂ।",
        explainEn: "It sets expectations clearly without insulting the person.",
        explainPa: "ਇਹ ਬਿਨਾਂ ਬੇਇਜ਼ਤੀ ਕੀਤੇ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਉਮੀਦਾਂ ਰੱਖਦਾ ਹੈ।"
      }
    ];

    // Alias for consistency with other banks (safe)
    var GAME5_QUESTIONS = RAW_GAME5_QUESTIONS;

  // Game 6: Vocab Vault (Two-way Translation) | Ages 7–10
  // English mode: promptEn shows Punjabi; choicesEn are English.
  // Punjabi mode: promptPa shows English; choicesPa are Punjabi.
  var RAW_GAME6_QUESTIONS = [
    // ---------- EASY (10): very common nouns ----------
    {
      id: "G6_001",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "animals",
      promptEn: 'What does "ਬਿੱਲੀ" mean in English?',
      promptPa: '"cat" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["cat", "dog", "cow", "goat"],
      choicesPa: ["ਬਿੱਲੀ", "ਕੁੱਤਾ", "ਗਾਂ", "ਬੱਕਰੀ"],
      answerIndex: 0,
      hintEn: "It is a common pet.",
      hintPa: "ਇਹ ਘਰ ਵਿੱਚ ਪਾਲਣ ਵਾਲਾ ਜਾਨਵਰ ਹੈ।",
      explainEn: '"ਬਿੱਲੀ" = cat.',
      explainPa: '"cat" = ਬਿੱਲੀ।'
    },
    {
      id: "G6_002",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "animals",
      promptEn: 'What does "ਕੁੱਤਾ" mean in English?',
      promptPa: '"dog" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["horse", "dog", "cat", "bird"],
      choicesPa: ["ਘੋੜਾ", "ਕੁੱਤਾ", "ਬਿੱਲੀ", "ਪੰਛੀ"],
      answerIndex: 1,
      hintEn: "It barks.",
      hintPa: "ਇਹ ਭੌਂਕਦਾ ਹੈ।",
      explainEn: '"ਕੁੱਤਾ" = dog.',
      explainPa: '"dog" = ਕੁੱਤਾ।'
    },
    {
      id: "G6_003",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "food",
      promptEn: 'What does "ਸੇਬ" mean in English?',
      promptPa: '"apple" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["mango", "apple", "banana", "orange"],
      choicesPa: ["ਆਮ", "ਸੇਬ", "ਕੇਲਾ", "ਸੰਤਰਾ"],
      answerIndex: 1,
      hintEn: "A red or green fruit.",
      hintPa: "ਇਹ ਲਾਲ ਜਾਂ ਹਰਾ ਫਲ ਹੁੰਦਾ ਹੈ।",
      explainEn: '"ਸੇਬ" = apple.',
      explainPa: '"apple" = ਸੇਬ।'
    },
    {
      id: "G6_004",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "school",
      promptEn: 'What does "ਕਿਤਾਬ" mean in English?',
      promptPa: '"book" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["book", "pencil", "bag", "chair"],
      choicesPa: ["ਕਿਤਾਬ", "ਪੈਂਸਲ", "ਬੈਗ", "ਕੁਰਸੀ"],
      answerIndex: 0,
      hintEn: "You read it.",
      hintPa: "ਤੁਸੀਂ ਇਹ ਪੜ੍ਹਦੇ ਹੋ।",
      explainEn: '"ਕਿਤਾਬ" = book.',
      explainPa: '"book" = ਕਿਤਾਬ।'
    },
    {
      id: "G6_005",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "places",
      promptEn: 'What does "ਸਕੂਲ" mean in English?',
      promptPa: '"school" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["school", "home", "park", "shop"],
      choicesPa: ["ਸਕੂਲ", "ਘਰ", "ਪਾਰਕ", "ਦੁਕਾਨ"],
      answerIndex: 0,
      hintEn: "You go there to learn.",
      hintPa: "ਤੁਸੀਂ ਓਥੇ ਪੜ੍ਹਨ/ਸਿੱਖਣ ਜਾਂਦੇ ਹੋ।",
      explainEn: '"ਸਕੂਲ" = school.',
      explainPa: '"school" = ਸਕੂਲ।'
    },
    {
      id: "G6_006",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "drinks",
      promptEn: 'What does "ਪਾਣੀ" mean in English?',
      promptPa: '"water" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["tea", "milk", "water", "juice"],
      choicesPa: ["ਚਾਹ", "ਦੂਧ", "ਪਾਣੀ", "ਜੂਸ"],
      answerIndex: 2,
      hintEn: "You drink it every day.",
      hintPa: "ਤੁਸੀਂ ਇਹ ਹਰ ਰੋਜ਼ ਪੀਂਦੇ ਹੋ।",
      explainEn: '"ਪਾਣੀ" = water.',
      explainPa: '"water" = ਪਾਣੀ।'
    },
    {
      id: "G6_007",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "family",
      promptEn: 'What does "ਮਾਂ" mean in English?',
      promptPa: '"mother" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["mother", "father", "brother", "sister"],
      choicesPa: ["ਮਾਂ", "ਪਿਤਾ", "ਭਰਾ", "ਭੈਣ"],
      answerIndex: 0,
      hintEn: "Your mom.",
      hintPa: "ਤੁਹਾਡੀ ਮੰਮੀ।",
      explainEn: '"ਮਾਂ" = mother.',
      explainPa: '"mother" = ਮਾਂ।'
    },
    {
      id: "G6_008",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "family",
      promptEn: 'What does "ਪਿਤਾ" mean in English?',
      promptPa: '"father" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["friend", "father", "sister", "child"],
      choicesPa: ["ਦੋਸਤ", "ਪਿਤਾ", "ਭੈਣ", "ਬੱਚਾ"],
      answerIndex: 1,
      hintEn: "Your dad.",
      hintPa: "ਤੁਹਾਡੇ ਪਾਪਾ।",
      explainEn: '"ਪਿਤਾ" = father.',
      explainPa: '"father" = ਪਿਤਾ।'
    },
    {
      id: "G6_009",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "transport",
      promptEn: 'What does "ਗੱਡੀ" mean in English?',
      promptPa: '"car" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["car", "bus", "train", "bicycle"],
      choicesPa: ["ਗੱਡੀ", "ਬੱਸ", "ਰੇਲ", "ਸਾਈਕਲ"],
      answerIndex: 0,
      hintEn: "A vehicle with four wheels.",
      hintPa: "ਚਾਰ ਪਹੀਏ ਵਾਲੀ ਸਵਾਰੀ।",
      explainEn: '"ਗੱਡੀ" = car.',
      explainPa: '"car" = ਗੱਡੀ।'
    },
    {
      id: "G6_010",
      difficulty: 1,
      trackId: "VOCAB_TRANSLATION",
      topic: "home",
      promptEn: 'What does "ਘਰ" mean in English?',
      promptPa: '"house" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["house", "room", "door", "garden"],
      choicesPa: ["ਘਰ", "ਕਮਰਾ", "ਦਰਵਾਜ਼ਾ", "ਬਾਗ"],
      answerIndex: 0,
      hintEn: "You live there.",
      hintPa: "ਤੁਸੀਂ ਇੱਥੇ ਰਹਿੰਦੇ ਹੋ।",
      explainEn: '"ਘਰ" = house.',
      explainPa: '"house" = ਘਰ।'
    },
    {
      id: "G6_011",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "colors",
      promptEn: 'What does "ਲਾਲ" mean in English?',
      promptPa: '"red" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["red", "blue", "green", "yellow"],
      choicesPa: ["ਲਾਲ", "ਨੀਲਾ", "ਹਰਾ", "ਪੀਲਾ"],
      answerIndex: 0,
      hintEn: "Color of many apples.",
      hintPa: "ਅਕਸਰ ਸੇਬ ਦਾ ਰੰਗ।",
      explainEn: '"ਲਾਲ" = red.',
      explainPa: '"red" = ਲਾਲ।'
    },
    {
      id: "G6_012",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "colors",
      promptEn: 'What does "ਨੀਲਾ" mean in English?',
      promptPa: '"blue" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["yellow", "blue", "red", "black"],
      choicesPa: ["ਪੀਲਾ", "ਨੀਲਾ", "ਲਾਲ", "ਕਾਲਾ"],
      answerIndex: 1,
      hintEn: "Color of the sky (often).",
      hintPa: "ਅਕਸਰ ਆਸਮਾਨ ਦਾ ਰੰਗ।",
      explainEn: '"ਨੀਲਾ" = blue.',
      explainPa: '"blue" = ਨੀਲਾ।'
    },
    {
      id: "G6_013",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "verbs",
      promptEn: 'What does "ਦੌੜਨਾ" mean in English?',
      promptPa: '"run" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["run", "eat", "sleep", "sit"],
      choicesPa: ["ਦੌੜਨਾ", "ਖਾਣਾ", "ਸੋਣਾ", "ਬੈਠਣਾ"],
      answerIndex: 0,
      hintEn: "Move fast.",
      hintPa: "ਤੇਜ਼ ਦੌੜਨਾ।",
      explainEn: '"ਦੌੜਨਾ" = run.',
      explainPa: '"run" = ਦੌੜਨਾ।'
    },
    {
      id: "G6_014",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "verbs",
      promptEn: 'What does "ਖਾਣਾ" mean in English?',
      promptPa: '"eat" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["drink", "eat", "read", "write"],
      choicesPa: ["ਪੀਣਾ", "ਖਾਣਾ", "ਪੜ੍ਹਨਾ", "ਲਿਖਣਾ"],
      answerIndex: 1,
      hintEn: "Do this with food.",
      hintPa: "ਖਾਣੇ ਨਾਲ ਇਹ ਕਰਦੇ ਹੋ।",
      explainEn: '"ਖਾਣਾ" = eat.',
      explainPa: '"eat" = ਖਾਣਾ।'
    },
    {
      id: "G6_015",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "verbs",
      promptEn: 'What does "ਸੋਣਾ" mean in English?',
      promptPa: '"sleep" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["sleep", "wake up", "run", "dance"],
      choicesPa: ["ਸੋਣਾ", "ਜਾਗਣਾ", "ਦੌੜਨਾ", "ਨੱਚਣਾ"],
      answerIndex: 0,
      hintEn: "You do this at night.",
      hintPa: "ਤੁਸੀਂ ਇਹ ਰਾਤ ਨੂੰ ਕਰਦੇ ਹੋ।",
      explainEn: '"ਸੋਣਾ" = sleep.',
      explainPa: '"sleep" = ਸੋਣਾ।'
    },
    {
      id: "G6_016",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "verbs",
      promptEn: 'What does "ਖੇਡਣਾ" mean in English?',
      promptPa: '"play" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["play", "study", "write", "cry"],
      choicesPa: ["ਖੇਡਣਾ", "ਪੜ੍ਹਨਾ", "ਲਿਖਣਾ", "ਰੋਣਾ"],
      answerIndex: 0,
      hintEn: "Kids do this for fun.",
      hintPa: "ਬੱਚੇ ਮਜ਼ੇ ਲਈ ਇਹ ਕਰਦੇ ਹਨ।",
      explainEn: '"ਖੇਡਣਾ" = play.',
      explainPa: '"play" = ਖੇਡਣਾ।'
    },
    {
      id: "G6_017",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "feelings",
      promptEn: 'What does "ਖੁਸ਼" mean in English?',
      promptPa: '"happy" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["sad", "happy", "angry", "scared"],
      choicesPa: ["ਉਦਾਸ", "ਖੁਸ਼", "ਗੁੱਸੇ", "ਡਰੇ ਹੋਏ"],
      answerIndex: 1,
      hintEn: "Feel good.",
      hintPa: "ਚੰਗਾ ਅਹਿਸਾਸ।",
      explainEn: '"ਖੁਸ਼" = happy.',
      explainPa: '"happy" = ਖੁਸ਼।'
    },
    {
      id: "G6_018",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "feelings",
      promptEn: 'What does "ਉਦਾਸ" mean in English?',
      promptPa: '"sad" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["happy", "sad", "big", "fast"],
      choicesPa: ["ਖੁਸ਼", "ਉਦਾਸ", "ਵੱਡਾ", "ਤੇਜ਼"],
      answerIndex: 1,
      hintEn: "Not happy.",
      hintPa: "ਖੁਸ਼ ਨਹੀਂ।",
      explainEn: '"ਉਦਾਸ" = sad.',
      explainPa: '"sad" = ਉਦਾਸ।'
    },
    {
      id: "G6_019",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "size",
      promptEn: 'What does "ਵੱਡਾ" mean in English?',
      promptPa: '"big" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["small", "big", "cold", "new"],
      choicesPa: ["ਛੋਟਾ", "ਵੱਡਾ", "ਠੰਢਾ", "ਨਵਾਂ"],
      answerIndex: 1,
      hintEn: "Not small.",
      hintPa: "ਛੋਟਾ ਨਹੀਂ।",
      explainEn: '"ਵੱਡਾ" = big.',
      explainPa: '"big" = ਵੱਡਾ।'
    },
    {
      id: "G6_020",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "size",
      promptEn: 'What does "ਛੋਟਾ" mean in English?',
      promptPa: '"small" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["big", "small", "hot", "happy"],
      choicesPa: ["ਵੱਡਾ", "ਛੋਟਾ", "ਗਰਮ", "ਖੁਸ਼"],
      answerIndex: 1,
      hintEn: "Not big.",
      hintPa: "ਵੱਡਾ ਨਹੀਂ।",
      explainEn: '"ਛੋਟਾ" = small.',
      explainPa: '"small" = ਛੋਟਾ।'
    },
    {
      id: "G6_021",
      difficulty: 3,
      trackId: "VOCAB_TRANSLATION",
      topic: "greetings",
      promptEn: 'What does "ਸ਼ੁਭ ਸਵੇਰ" mean in English?',
      promptPa: '"Good morning" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["Good morning", "Good night", "Good afternoon", "Good evening"],
      choicesPa: ["ਸ਼ੁਭ ਸਵੇਰ", "ਸ਼ੁਭ ਰਾਤ", "ਸ਼ੁਭ ਦੁਪਹਿਰ", "ਸ਼ੁਭ ਸ਼ਾਮ"],
      answerIndex: 0,
      hintEn: "You say it in the morning.",
      hintPa: "ਇਹ ਸਵੇਰੇ ਕਹਿੰਦੇ ਹਨ।",
      explainEn: '"ਸ਼ੁਭ ਸਵੇਰ" = Good morning.',
      explainPa: '"Good morning" = ਸ਼ੁਭ ਸਵੇਰ।'
    },
    {
      id: "G6_022",
      difficulty: 3,
      trackId: "VOCAB_TRANSLATION",
      topic: "polite_words",
      promptEn: 'What does "ਧੰਨਵਾਦ" mean in English?',
      promptPa: '"Thank you" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["Thank you", "Sorry", "Please", "See you later"],
      choicesPa: ["ਧੰਨਵਾਦ", "ਮਾਫ਼ ਕਰਨਾ", "ਕਿਰਪਾ ਕਰਕੇ", "ਫਿਰ ਮਿਲਾਂਗੇ"],
      answerIndex: 0,
      hintEn: "You say it when someone helps you.",
      hintPa: "ਜਦੋਂ ਕੋਈ ਮਦਦ ਕਰੇ ਤਾਂ ਇਹ ਕਹਿੰਦੇ ਹਨ।",
      explainEn: '"ਧੰਨਵਾਦ" = Thank you.',
      explainPa: '"Thank you" = ਧੰਨਵਾਦ।'
    },
    {
      id: "G6_023",
      difficulty: 3,
      trackId: "VOCAB_TRANSLATION",
      topic: "needs",
      promptEn: 'What does "ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ" mean in English?',
      promptPa: '"I am hungry" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["I am hungry", "I am thirsty", "I am happy", "I am scared"],
      choicesPa: ["ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ", "ਮੈਨੂੰ ਪਿਆਸ ਲੱਗੀ ਹੈ", "ਮੈਂ ਖੁਸ਼ ਹਾਂ", "ਮੈਂ ਡਰ ਗਿਆ/ਗਈ ਹਾਂ"],
      answerIndex: 0,
      hintEn: "It means you want food.",
      hintPa: "ਇਸਦਾ ਮਤਲਬ ਹੈ ਤੁਹਾਨੂੰ ਖਾਣਾ ਚਾਹੀਦਾ ਹੈ।",
      explainEn: '"ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ" = I am hungry.',
      explainPa: '"I am hungry" = ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ।'
    },
    {
      id: "G6_024",
      difficulty: 3,
      trackId: "VOCAB_TRANSLATION",
      topic: "questions",
      promptEn: 'What does "ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?" mean in English?',
      promptPa: '"Where is the bathroom?" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["Where is the bathroom?", "Where is the school?", "Where is my book?", "How are you?"],
      choicesPa: ["ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?", "ਸਕੂਲ ਕਿੱਥੇ ਹੈ?", "ਮੇਰੀ ਕਿਤਾਬ ਕਿੱਥੇ ਹੈ?", "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?"],
      answerIndex: 0,
      hintEn: "Bathroom = place to wash/use toilet.",
      hintPa: "ਬਾਥਰੂਮ = ਨ੍ਹਾਉਣ/ਟਾਇਲਟ ਵਾਲੀ ਥਾਂ।",
      explainEn: '"ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?" = Where is the bathroom?',
      explainPa: '"Where is the bathroom?" = ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?'
    },
    {
      id: "G6_025",
      difficulty: 3,
      trackId: "VOCAB_TRANSLATION",
      topic: "help",
      promptEn: 'What does "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ" mean in English?',
      promptPa: '"Help me, please" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["Help me, please", "Come here", "Wait", "Stop"],
      choicesPa: ["ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ", "ਇੱਥੇ ਆਓ", "ਉਡੀਕ ਕਰੋ", "ਰੁਕੋ"],
      answerIndex: 0,
      hintEn: "It is asking for help politely.",
      hintPa: "ਇਹ ਨਮ੍ਰਤਾ ਨਾਲ ਮਦਦ ਮੰਗਣਾ ਹੈ।",
      explainEn: '"ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ" = Help me, please.',
      explainPa: '"Help me, please" = ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।'
    }
  ];

  // Alias for consistency with other banks (safe)
  var GAME6_QUESTIONS = RAW_GAME6_QUESTIONS;

// Game 7: Vocab Vault Jr (Translation Set 2)
// Same schema as Game 6 (Punjabi prompt → English choices)
var RAW_GAME7_QUESTIONS = [
  {
    id: "G7_001",
    difficulty: 1,
    trackId: "VOCAB_TRANSLATION",
    topic: "family",
    promptEn: 'What does "ਮਾਤਾ" mean in English?',
    promptPa: '"mother" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["mother", "father", "sister", "brother"],
    choicesPa: ["ਮਾਤਾ", "ਪਿਤਾ", "ਭੈਣ", "ਭਰਾ"],
    answerIndex: 0,
    hintEn: "The person who cares like a mom.",
    hintPa: "ਜੋ ਮਾਂ ਵਾਂਗ ਸਾਂਭਦੀ ਹੈ।",
    explainEn: '"ਮਾਤਾ" = mother.',
    explainPa: '"mother" = ਮਾਤਾ।'
  },
  {
    id: "G7_002",
    difficulty: 1,
    trackId: "VOCAB_TRANSLATION",
    topic: "body",
    promptEn: 'What does "ਅੱਖ" mean in English?',
    promptPa: '"eye" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["eye", "ear", "nose", "mouth"],
    choicesPa: ["ਅੱਖ", "ਕੰਨ", "ਨੱਕ", "ਮੂੰਹ"],
    answerIndex: 0,
    hintEn: "You see with it.",
    hintPa: "ਤੁਸੀਂ ਇਸ ਨਾਲ ਵੇਖਦੇ ਹੋ।",
    explainEn: '"ਅੱਖ" = eye.',
    explainPa: '"eye" = ਅੱਖ।'
  },
  {
    id: "G7_003",
    difficulty: 1,
    trackId: "VOCAB_TRANSLATION",
    topic: "food",
    promptEn: 'What does "ਦੁੱਧ" mean in English?',
    promptPa: '"milk" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["milk", "juice", "water", "tea"],
    choicesPa: ["ਦੁੱਧ", "ਜੂਸ", "ਪਾਣੀ", "ਚਾਹ"],
    answerIndex: 0,
    hintEn: "You pour it on cereal.",
    hintPa: "ਤੁਸੀਂ ਇਸ ਨੂੰ ਸੀਰੀਅਲ 'ਤੇ ਪਾਉਂਦੇ ਹੋ।",
    explainEn: '"ਦੁੱਧ" = milk.',
    explainPa: '"milk" = ਦੁੱਧ।'
  },
  {
    id: "G7_004",
    difficulty: 2,
    trackId: "VOCAB_TRANSLATION",
    topic: "weather",
    promptEn: 'What does "ਬਰਫ਼" mean in English?',
    promptPa: '"snow" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["snow", "rain", "wind", "sun"],
    choicesPa: ["ਬਰਫ਼", "ਮੀਂਹ", "ਹਵਾ", "ਸੂਰਜ"],
    answerIndex: 0,
    hintEn: "It is white and cold.",
    hintPa: "ਇਹ ਚਿੱਟੀ ਤੇ ਠੰਡੀ ਹੁੰਦੀ ਹੈ।",
    explainEn: '"ਬਰਫ਼" = snow.',
    explainPa: '"snow" = ਬਰਫ਼।'
  },
  {
    id: "G7_005",
    difficulty: 2,
    trackId: "VOCAB_TRANSLATION",
    topic: "actions",
    promptEn: 'What does "ਸੁਣਨਾ" mean in English?',
    promptPa: '"listen" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["listen", "speak", "run", "jump"],
    choicesPa: ["ਸੁਣਨਾ", "ਬੋਲਨਾ", "ਦੌੜਨਾ", "ਛਾਲ ਮਾਰਨਾ"],
    answerIndex: 0,
    hintEn: "You do this with your ears.",
    hintPa: "ਇਹ ਤੁਸੀਂ ਆਪਣੇ ਕੰਨਾਂ ਨਾਲ ਕਰਦੇ ਹੋ।",
    explainEn: '"ਸੁਣਨਾ" = listen.',
    explainPa: '"listen" = ਸੁਣਨਾ।'
  },
  {
    id: "G7_006",
    difficulty: 3,
    trackId: "VOCAB_TRANSLATION",
    topic: "feelings",
    promptEn: 'What does "ਖੁਸ਼" mean in English?',
    promptPa: '"happy" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["happy", "sad", "angry", "tired"],
    choicesPa: ["ਖੁਸ਼", "ਉਦਾਸ", "ਗੁੱਸੇ", "ਥੱਕਿਆ"],
    answerIndex: 0,
    hintEn: "A smile shows this feeling.",
    hintPa: "ਮੁਸਕਾਨ ਇਹ ਅਹਿਸਾਸ ਦਿਖਾਉਂਦੀ ਹੈ।",
    explainEn: '"ਖੁਸ਼" = happy.',
    explainPa: '"happy" = ਖੁਸ਼।'
  }
];

var GAME7_QUESTIONS = RAW_GAME7_QUESTIONS;

// Game 8: Vocab Vault Expert (Translation Set 3)
var RAW_GAME8_QUESTIONS = [
  {
    id: "G8_001",
    difficulty: 2,
    trackId: "VOCAB_TRANSLATION",
    topic: "objects",
    promptEn: 'What does "ਘੜੀ" mean in English?',
    promptPa: '"clock" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["clock", "door", "window", "chair"],
    choicesPa: ["ਘੜੀ", "ਦਰਵਾਜ਼ਾ", "ਖਿੜਕੀ", "ਕੁਰਸੀ"],
    answerIndex: 0,
    hintEn: "It tells time.",
    hintPa: "ਇਹ ਸਮਾਂ ਦੱਸਦੀ ਹੈ।",
    explainEn: '"ਘੜੀ" = clock.',
    explainPa: '"clock" = ਘੜੀ।'
  },
  {
    id: "G8_002",
    difficulty: 2,
    trackId: "VOCAB_TRANSLATION",
    topic: "nature",
    promptEn: 'What does "ਪਹਾੜ" mean in English?',
    promptPa: '"mountain" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["mountain", "river", "forest", "desert"],
    choicesPa: ["ਪਹਾੜ", "ਦਰੀਆ", "ਜੰਗਲ", "ਰੇਗਿਸਤਾਨ"],
    answerIndex: 0,
    hintEn: "Very tall land.",
    hintPa: "ਬਹੁਤ ਉੱਚੀ ਧਰਤੀ।",
    explainEn: '"ਪਹਾੜ" = mountain.',
    explainPa: '"mountain" = ਪਹਾੜ।'
  },
  {
    id: "G8_003",
    difficulty: 2,
    trackId: "VOCAB_TRANSLATION",
    topic: "school",
    promptEn: 'What does "ਸਵਾਲ" mean in English?',
    promptPa: '"question" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["question", "answer", "lesson", "teacher"],
    choicesPa: ["ਸਵਾਲ", "ਜਵਾਬ", "ਪਾਠ", "ਅਧਿਆਪਕ"],
    answerIndex: 0,
    hintEn: "You ask this to learn.",
    hintPa: "ਸਿੱਖਣ ਲਈ ਤੁਸੀਂ ਇਹ ਪੁੱਛਦੇ ਹੋ।",
    explainEn: '"ਸਵਾਲ" = question.',
    explainPa: '"question" = ਸਵਾਲ।'
  },
  {
    id: "G8_004",
    difficulty: 3,
    trackId: "VOCAB_TRANSLATION",
    topic: "actions",
    promptEn: 'What does "ਸੋਚਣਾ" mean in English?',
    promptPa: '"think" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["think", "sleep", "shout", "write"],
    choicesPa: ["ਸੋਚਣਾ", "ਸੌਣਾ", "ਚਿਲਾਉਣਾ", "ਲਿਖਣਾ"],
    answerIndex: 0,
    hintEn: "You do this with your mind.",
    hintPa: "ਇਹ ਤੁਸੀਂ ਆਪਣੇ ਮਨ ਨਾਲ ਕਰਦੇ ਹੋ।",
    explainEn: '"ਸੋਚਣਾ" = think.',
    explainPa: '"think" = ਸੋਚਣਾ।'
  },
  {
    id: "G8_005",
    difficulty: 3,
    trackId: "VOCAB_TRANSLATION",
    topic: "feelings",
    promptEn: 'What does "ਹੈਰਾਨ" mean in English?',
    promptPa: '"surprised" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["surprised", "bored", "calm", "angry"],
    choicesPa: ["ਹੈਰਾਨ", "ਉਕਤਾਇਆ", "ਸ਼ਾਂਤ", "ਗੁੱਸੇ"],
    answerIndex: 0,
    hintEn: "A big wow feeling.",
    hintPa: "ਵੱਡਾ ਅਚੰਭੇ ਵਾਲਾ ਅਹਿਸਾਸ।",
    explainEn: '"ਹੈਰਾਨ" = surprised.',
    explainPa: '"surprised" = ਹੈਰਾਨ।'
  },
  {
    id: "G8_006",
    difficulty: 3,
    trackId: "VOCAB_TRANSLATION",
    topic: "time",
    promptEn: 'What does "ਕੱਲ੍ਹ" mean in English?',
    promptPa: '"tomorrow" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
    choicesEn: ["tomorrow", "yesterday", "today", "always"],
    choicesPa: ["ਕੱਲ੍ਹ", "ਕੱਲ੍ਹ (ਬੀਤਿਆ)", "ਅੱਜ", "ਹਮੇਸ਼ਾਂ"],
    answerIndex: 0,
    hintEn: "The day after today.",
    hintPa: "ਅੱਜ ਤੋਂ ਅੱਗਲਾ ਦਿਨ।",
    explainEn: '"ਕੱਲ੍ਹ" = tomorrow.',
    explainPa: '"tomorrow" = ਕੱਲ੍ਹ।'
  }
];

var GAME8_QUESTIONS = RAW_GAME8_QUESTIONS;

function normalizeGame1Questions() {
  return GAME1_QUESTIONS.map(function(q, idx) {
    var cleanSentence = sanitizeSentenceText(q.sentence);
    warnSanitizationChange(q.sentence, cleanSentence, { gameId: "GAME1", index: idx, type: "sentence" });

    var tokens = tokenizeSentence(cleanSentence);
    var posKey = derivePosKeyFromTapPrompt(q.question);
    var posHint = POS_HINTS[posKey] || POS_HINTS._default;

    // Validate presence of correctWord as a token (case-insensitive)
    var matches = findTokenMatches(tokens, q.correctWord);
    if (matches.length === 0) {
      console.warn("G1 correctWord not found as token", { index: idx, correctWord: q.correctWord, tokens: tokens, sentence: cleanSentence });
    }
    if (matches.length > 1) {
      console.warn("G1 correctWord appears multiple times", { index: idx, correctWord: q.correctWord, tokens: tokens, sentence: cleanSentence });
    }

    // Use the actual token text for display if we found it; else fallback to q.correctWord
    var correctDisplay = q.correctWord;
    if (matches.length >= 1) {
      correctDisplay = tokens[matches[0]];
    }
    var correctId = canonicalTokenId(correctDisplay);

    // Build distractors
    var distractorTexts = [];
    var have = {}; // case-insensitive id set for uniqueness
    have[correctId] = true;

    // Function-word categories use curated pools
    function addFromPool(pool, count, caseLikeToken) {
      var shuffled = shuffleArrayCopy(pool);
      for (var i = 0; i < shuffled.length && distractorTexts.length < count; i++) {
        var candText = applyCaseLike(caseLikeToken, shuffled[i]);
        var candId = canonicalTokenId(shuffled[i]);
        if (!have[candId] && candId !== correctId) {
          have[candId] = true;
          distractorTexts.push(candText);
        }
      }
    }

    // Function-word targets: prioritize in-sentence function words first.
    // This reduces “only in-sentence option” cues for articles/prepositions/etc.
    var isFunctionTarget =
      posKey === "article" ||
      posKey === "preposition" ||
      posKey === "conjunction" ||
      posKey === "pronoun" ||
      posKey === "interjection";

    function canonicalFunctionWordByIdLower(idLower) {
      // Articles / prepositions / conjunctions: display lowercase
      if (POOL_ARTICLES.indexOf(idLower) !== -1) return idLower;
      if (POOL_PREPOSITIONS.indexOf(idLower) !== -1) return idLower;
      if (POOL_CONJUNCTIONS.indexOf(idLower) !== -1) return idLower;

      // Pronouns / interjections: display canonical pool casing
      for (var p = 0; p < POOL_PRONOUNS.length; p++) {
        if (String(POOL_PRONOUNS[p]).toLowerCase() === idLower) return POOL_PRONOUNS[p];
      }
      for (var j = 0; j < POOL_INTERJECTIONS.length; j++) {
        if (String(POOL_INTERJECTIONS[j]).toLowerCase() === idLower) return POOL_INTERJECTIONS[j];
      }
      return idLower;
    }

    if (isFunctionTarget) {
      var sentFn = shuffleArrayCopy(collectSentenceFunctionWords(tokens));
      for (var sf = 0; sf < sentFn.length && distractorTexts.length < 3; sf++) {
        var candIdLower = canonicalTokenId(sentFn[sf]);
        if (!have[candIdLower] && candIdLower !== correctId) {
          have[candIdLower] = true;
          var canon = canonicalFunctionWordByIdLower(candIdLower);
          distractorTexts.push(applyCaseLike(correctDisplay, canon));
        }
      }

      // If still short, fill from global function-word pool
      addFromPool(POOL_FUNCTION_WORDS, 3, correctDisplay);
    } else if (posKey === "article") {
      addFromPool(POOL_ARTICLES, 3, correctDisplay);
    } else if (posKey === "preposition") {
      addFromPool(POOL_PREPOSITIONS, 3, correctDisplay);
    } else if (posKey === "conjunction") {
      addFromPool(POOL_CONJUNCTIONS, 3, correctDisplay);
    } else if (posKey === "pronoun") {
      addFromPool(POOL_PRONOUNS, 3, correctDisplay);
    } else if (posKey === "interjection") {
      addFromPool(POOL_INTERJECTIONS, 3, correctDisplay);
    }

    // Content words: prefer same-sentence plausible tokens first
    if (!isFunctionTarget && distractorTexts.length < 3) {
      var sameSentenceCandidates = [];
      for (var t = 0; t < tokens.length; t++) {
        var tokText = tokens[t];
        var tokId = canonicalTokenId(tokText);
        if (tokId === correctId) continue;
        if (!isAlpha(tokId)) continue;
        if (tokId.length < 3) continue;
        if (_FUNCTION_WORD_SET[tokId]) continue;
        if (!have[tokId]) {
          sameSentenceCandidates.push(tokText);
        }
      }
      sameSentenceCandidates = shuffleArrayCopy(sameSentenceCandidates);
      for (var s = 0; s < sameSentenceCandidates.length && distractorTexts.length < 3; s++) {
        var txt = applyCaseLike(correctDisplay, sameSentenceCandidates[s]);
        var idLower = canonicalTokenId(txt);
        if (!have[idLower]) {
          have[idLower] = true;
          distractorTexts.push(txt);
        }
      }
    }

    // If still short, pad from the global content pool (lowercase tokens)
    if (!isFunctionTarget && distractorTexts.length < 3) {
      var content = shuffleArrayCopy(buildContentWordPool());
      for (var c = 0; c < content.length && distractorTexts.length < 3; c++) {
        var candLower = content[c];
        var candId = canonicalTokenId(candLower);
        if (!have[candId] && candId !== correctId) {
          have[candId] = true;
          distractorTexts.push(applyCaseLike(correctDisplay, candLower));
        }
      }
    }

    // Assemble choices: correct + 3 distractors, ensure uniqueness and 4 total
    var allChoices = [{ id: correctId, text: correctDisplay }];
    for (var d = 0; d < distractorTexts.length && allChoices.length < 4; d++) {
      var disp = distractorTexts[d];
      var idL = canonicalTokenId(disp);
      if (have[idL] && idL !== correctId) {
        // it's already marked in have; just ensure not duplicating in allChoices
        var exists = false;
        for (var e = 0; e < allChoices.length; e++) {
          if (allChoices[e].id === idL) { exists = true; break; }
        }
        if (!exists) {
          allChoices.push({ id: idL, text: disp });
        }
      } else if (!have[idL]) {
        have[idL] = true;
        allChoices.push({ id: idL, text: disp });
      }
    }

    // If still not enough, pad from content pool safely
    var padPool = shuffleArrayCopy(buildContentWordPool());
    for (var p = 0; p < padPool.length && allChoices.length < 4; p++) {
      var padLower = padPool[p];
      var padId = canonicalTokenId(padLower);
      if (!have[padId] && padId !== correctId) {
        have[padId] = true;
        allChoices.push({ id: padId, text: applyCaseLike(correctDisplay, padLower) });
      }
    }

    // If more than 4 (shouldn't happen), trim
    if (allChoices.length > 4) {
      allChoices = allChoices.slice(0, 4);
    }

    // Final shuffle for randomness
    allChoices = shuffleArrayCopy(allChoices);

    return {
      id: "G1_" + idx,
      gameId: "GAME1",
      trackId: q.trackId,
      prompt: q.question + " in: \"" + cleanSentence + "\"",
      sentence: cleanSentence,
      choices: allChoices,
      correctChoiceId: correctId,
      hintEn: q.hintEn || posHint.hintEn,
      hintPa: q.hintPa || posHint.hintPa,
      explanationEn: q.explanationEn || posHint.explanationEn || "",
      explanationPa: q.explanationPa || posHint.explanationPa || "",
      uiMeta: {
        posKey: posKey,
        isFunctionTarget: isFunctionTarget,
        tokens: tokens.slice()
      }
    };
  });
}

function validateGame1Bank() {
  var report = {
    total: 0,
    byPos: {},
    missingTrackId: 0,
    missingQuestion: 0,
    missingCorrectWord: 0,
    posUnparseable: 0,
    correctWordNotInSentence: 0,
    ambiguousLowDifficulty: 0
  };

  var debug = (typeof window !== "undefined" && window && window.BOLO_DEBUG === true);

  function defaultDifficultyForPos(posKey) {
    if (posKey === "noun" || posKey === "verb" || posKey === "adjective") return 1;
    if (posKey === "pronoun" || posKey === "article" || posKey === "preposition" || posKey === "conjunction") return 2;
    if (posKey === "adverb" || posKey === "interjection") return 2;
    return 2;
  }

  var G1_AMBIGUOUS_TOKENS = {
    daily: { posRisk: ["adverb", "adjective"] },
    high: { posRisk: ["adverb", "adjective"] },
    fast: { posRisk: ["adverb", "adjective"] }
  };

  for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
    report.total += 1;
    var q = GAME1_QUESTIONS[i] || {};

    if (!q || typeof q !== "object") {
      if (debug) console.warn("G1 question is not an object", { index: i, q: q });
      report.missingQuestion += 1;
      report.byPos.unknown = (report.byPos.unknown || 0) + 1;
      continue;
    }

    if (!q.trackId) {
      report.missingTrackId += 1;
      if (debug) console.warn("G1 missing trackId", { index: i, q: q });
    }
    if (!q.question) {
      report.missingQuestion += 1;
      if (debug) console.warn("G1 missing question", { index: i, q: q });
    }
    if (!q.correctWord) {
      report.missingCorrectWord += 1;
      if (debug) console.warn("G1 missing correctWord", { index: i, q: q });
    }

    var posKey = derivePosKeyFromTapPrompt(q.question);
    if (!posKey) {
      report.posUnparseable += 1;
      if (debug) console.warn("G1 question POS not parseable", { index: i, question: q.question });
    }
    var posBucket = posKey || "unknown";
    report.byPos[posBucket] = (report.byPos[posBucket] || 0) + 1;

    var s = sanitizeSentenceText(q.sentence);
    var toks = tokenizeSentence(s);
    var matches = findTokenMatches(toks, q.correctWord);
    if (q.correctWord && matches.length === 0) {
      report.correctWordNotInSentence += 1;
      if (debug) {
        console.warn("G1 correctWord not found in sentence", {
          index: i,
          correctWord: q.correctWord,
          sentence: s,
          tokens: toks
        });
      }
    }

    var diff = (q.difficulty != null) ? q.difficulty : defaultDifficultyForPos(posKey);
    var cw = String(stripPunctToken(q.correctWord)).toLowerCase();
    if (cw && G1_AMBIGUOUS_TOKENS[cw] && diff < 2) {
      report.ambiguousLowDifficulty += 1;
      if (debug) {
        console.warn("G1 ambiguous token appears at low difficulty", {
          index: i,
          correctWord: q.correctWord,
          difficulty: diff,
          posKey: posKey,
          sentence: s
        });
      }
    }
  }

  var problems = report.missingTrackId + report.missingQuestion + report.missingCorrectWord + report.posUnparseable + report.correctWordNotInSentence + report.ambiguousLowDifficulty;
  if (debug) {
    console.group("GAME1 bank preflight summary");
    console.log(report);
    try { console.table(report.byPos); } catch (e) {}
    console.groupEnd();
  } else {
    if (problems > 0) {
      console.warn("GAME1 bank has issues (enable BOLO_DEBUG for full report)", report);
    }
  }
}

function validateGame2Bank() {
  function editDistance(a, b) {
    var s1 = String(a || "");
    var s2 = String(b || "");
    var n = s1.length;
    var m = s2.length;
    if (n === 0) return m;
    if (m === 0) return n;

    var dp = [];
    for (var i = 0; i <= n; i++) {
      dp[i] = [];
      dp[i][0] = i;
    }
    for (var j = 0; j <= m; j++) dp[0][j] = j;

    for (var i2 = 1; i2 <= n; i2++) {
      for (var j2 = 1; j2 <= m; j2++) {
        var cost = (s1.charAt(i2 - 1) === s2.charAt(j2 - 1)) ? 0 : 1;
        var del = dp[i2 - 1][j2] + 1;
        var ins = dp[i2][j2 - 1] + 1;
        var sub = dp[i2 - 1][j2 - 1] + cost;
        dp[i2][j2] = Math.min(del, ins, sub);
      }
    }
    return dp[n][m];
  }

  function suggestClosestKey(badKey, whitelist) {
    var keys = Array.isArray(whitelist) ? whitelist : [];
    if (!badKey || !keys.length) return null;
    var target = String(badKey);
    var best = null;
    var bestScore = Infinity;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var d = editDistance(target, k);
      if (d < bestScore) {
        bestScore = d;
        best = k;
      }
    }
    // Very small guard: avoid suggesting something totally unrelated.
    if (bestScore > Math.max(3, Math.floor(String(target).length / 2))) return null;
    return best;
  }

  var report = {
    total: 0,
    missingTrackId: 0,
    missingWord: 0,
    missingCorrectPartId: 0,
    invalidCorrectPartId: 0,
    duplicateWordAndPart: 0,
    wordCanonicalMismatch: 0
  };

  var debug = (typeof window !== "undefined" && window && window.BOLO_DEBUG === true);
  var whitelist = Object.keys(PARTS_OF_SPEECH_LABELS || {});
  var seen = {};
  var examples = [];

  function addExample(type, payload) {
    if (debug) return;
    if (examples.length >= 5) return;
    var p = payload || {};
    p.type = type;
    examples.push(p);
  }

  for (var i = 0; i < GAME2_QUESTIONS.length; i++) {
    report.total += 1;
    var q = GAME2_QUESTIONS[i] || {};

    if (!q || typeof q !== "object") {
      report.missingWord += 1;
      report.missingCorrectPartId += 1;
      if (debug) console.warn("G2 question is not an object", { index: i, q: q });
      addExample("notObject", { index: i });
      continue;
    }

    if (!q.trackId) {
      report.missingTrackId += 1;
      if (debug) console.warn("G2 missing trackId", { index: i, q: q });
      addExample("missingTrackId", { index: i, word: q.word, correctPartId: q.correctPartId });
    }

    var word = trimSpaces(q.word);
    if (!word) {
      report.missingWord += 1;
      if (debug) console.warn("G2 missing word", { index: i, q: q });
      addExample("missingWord", { index: i, trackId: q.trackId, correctPartId: q.correctPartId });
    }

    var partId = q.correctPartId;
    if (!partId) {
      report.missingCorrectPartId += 1;
      if (debug) console.warn("G2 missing correctPartId", { index: i, q: q });
      addExample("missingCorrectPartId", { index: i, trackId: q.trackId, word: word });
    } else if (!PARTS_OF_SPEECH_LABELS || !PARTS_OF_SPEECH_LABELS[partId]) {
      report.invalidCorrectPartId += 1;
      var suggestion = suggestClosestKey(partId, whitelist);
      if (debug) {
        console.warn("G2 invalid correctPartId", { index: i, correctPartId: partId, suggestion: suggestion, q: q });
      }
      addExample("invalidCorrectPartId", { index: i, word: word, correctPartId: partId, suggestion: suggestion });
    }

    var canonicalWord = (word && partId) ? standardizeGame2Word(word, partId) : "";
    var canonicalTrim = trimSpaces(canonicalWord);

    if (word && canonicalTrim && trimSpaces(word) !== canonicalTrim) {
      report.wordCanonicalMismatch += 1;
      if (debug) {
        console.warn("G2 word differs from canonicalWord (case/normalization mismatch)", {
          index: i,
          word: word,
          canonicalWord: canonicalTrim,
          correctPartId: partId,
          q: q
        });
      }
      addExample("wordCanonicalMismatch", { index: i, word: word, canonicalWord: canonicalTrim, correctPartId: partId });
    }

    if (canonicalTrim && partId) {
      var canonicalLower = canonicalGame2WordLower(word, partId);
      var dupKey = canonicalLower + "|" + String(partId);
      if (seen[dupKey]) {
        var first = seen[dupKey];
        var crossTrack = (first.trackId && q.trackId && first.trackId !== q.trackId);
        if (crossTrack) {
          // Allowed duplicates are still visible, but labeled differently.
          var allowed = (q.allowDuplicate === true) || (first.allowDuplicate === true);
          report.duplicateWordAndPart += 1;
          if (debug) {
            console.warn(
              allowed
                ? "G2 allowed duplicate across tracks (canonicalWord, correctPartId)"
                : "G2 unexpected duplicate across tracks (canonicalWord, correctPartId)",
              {
                firstIndex: first.index,
                index: i,
                firstQ: first.q,
                q: q,
                firstTrackId: first.trackId,
                trackId: q.trackId,
                canonicalWordFirst: first.canonicalWord,
                canonicalWord: canonicalTrim,
                correctPartId: partId
              }
            );
          }
          addExample(
            allowed ? "allowedDuplicateAcrossTracks" : "unexpectedDuplicateAcrossTracks",
            {
              firstIndex: first.index,
              index: i,
              trackId1: first.trackId,
              trackId2: q.trackId,
              canonicalWord: canonicalLower,
              correctPartId: partId
            }
          );
        }
      } else {
        seen[dupKey] = {
          index: i,
          trackId: q.trackId,
          allowDuplicate: (q.allowDuplicate === true),
          canonicalWord: canonicalTrim,
          q: q
        };
      }
    }
  }

  var problems = report.missingTrackId + report.missingWord + report.missingCorrectPartId + report.invalidCorrectPartId + report.duplicateWordAndPart + report.wordCanonicalMismatch;
  if (debug) {
    console.group("GAME2 bank preflight summary");
    console.log(report);
    console.groupEnd();
  } else {
    if (problems > 0) {
      console.warn("GAME2 bank has issues (enable BOLO_DEBUG for full report)", { report: report, examples: examples });
    }
  }
}

function normalizeGame2Questions() {
  var partKeys = Object.keys(PARTS_OF_SPEECH_LABELS);

  return GAME2_QUESTIONS.map(function(q, idx) {
    var stablePart = String(q.correctPartId || "");
    if (!stablePart) stablePart = "unknown";

    var canonicalWord = standardizeGame2Word(q.word, q.correctPartId);
    var canonicalWordLower = canonicalGame2WordLower(q.word, q.correctPartId);
    var safeWord = sanitizeGame2StableIdToken(canonicalWordLower) || "unknown";
    var stableId = "G2_" + safeWord + "_" + stablePart;
    var displayWord = canonicalWord;
    var posHint = POS_HINTS[q.correctPartId] || POS_HINTS._default;
    var shuffledKeys = shuffleArrayCopy(partKeys);
    return {
      id: "G2_" + idx,
      stableId: stableId,
      gameId: "GAME2",
      trackId: q.trackId,
      prompt: "Which part of speech is: \"" + displayWord + "\"?",
      choices: shuffledKeys.map(function(k) {
        return { id: k, text: getPosLabel(k, { bilingual: true }) };
      }),
      correctChoiceId: q.correctPartId,
      hintEn: q.hintEn || posHint.hintEn,
      hintPa: q.hintPa || posHint.hintPa,
      explanationEn: q.explanationEn || posHint.explanationEn || "",
      explanationPa: q.explanationPa || posHint.explanationPa || ""
    };
  });
}

function normalizeGame3Questions() {
  var tenseKeys = Object.keys(TENSE_LABELS);

  // Punjabi mode is a global, persisted setting (safe, defensive reads).
  var punjabiOn = true;
  try {
    if (typeof State !== "undefined" && State && typeof State.getPunjabiEnabled === "function") {
      punjabiOn = !!State.getPunjabiEnabled();
    } else if (typeof State !== "undefined" && State && State.state && State.state.settings) {
      punjabiOn = !!State.state.settings.punjabiOn;
    }
  } catch (e) {
    punjabiOn = true;
  }

  // Standardize Game 3 tracking to the tense/action skill.
  var TRACK_ID_GAME3 = "T_ACTIONS";

  return GAME3_QUESTIONS.map(function(q, idx) {
    var cleanSentence = sanitizeSentenceText(q.sentence);
    warnSanitizationChange(q.sentence, cleanSentence, { gameId: "GAME3", index: idx, type: "sentence" });
    var tenseHint = TENSE_HINTS[q.correctTense] || TENSE_HINTS._default;
    // Shuffle per question (not globally) so each sentence has its own randomized order.
    var shuffledKeys = shuffleArrayCopy(tenseKeys);
    return {
      id: "G3_" + idx,
      gameId: "GAME3",
      trackId: TRACK_ID_GAME3,
      prompt: cleanSentence,
      choices: shuffledKeys.map(function(k) {
        // Punjabi mode ON: show bilingual labels in one string; OFF: English-only.
        return { id: k, text: punjabiOn ? getTenseLabel(k, { bilingual: true }) : getTenseLabel(k, { lang: "en" }) };
      }),
      correctChoiceId: q.correctTense,
      hintEn: q.hintEn || tenseHint.hintEn,
      hintPa: q.hintPa || tenseHint.hintPa,
      explanationEn: q.explanationEn || tenseHint.explanationEn || "",
      explanationPa: q.explanationPa || tenseHint.explanationPa || ""
    };
  });
}

function normalizeGame4Questions() {
  return GAME4_QUESTIONS.map(function(q, idx) {
    // Backward-compatible defensive reads
    var hasOptionsArray = (q && Array.isArray(q.options));
    var opts = hasOptionsArray ? q.options : [];
    if (!hasOptionsArray || opts.length < 2) {
      warnGame4("GAME4 options missing or has < 2 entries", {
        index: idx,
        optionsType: (q && q.options === null) ? "null" : (q ? typeof q.options : "undefined"),
        optionsLength: (Array.isArray(opts) ? opts.length : null)
      });
    }
    var a = (opts[0] != null) ? String(opts[0]) : "";
    var b = (opts[1] != null) ? String(opts[1]) : "";

    // Sanitize displayed options (ensures terminal punctuation)
    var aClean = sanitizeOptionText(a);
    var bClean = sanitizeOptionText(b);
    warnSanitizationChange(a, aClean, { gameId: "GAME4", index: idx, option: "a" });
    warnSanitizationChange(b, bClean, { gameId: "GAME4", index: idx, option: "b" });

    if (!aClean || !bClean) {
      warnGame4("GAME4 option empty after sanitization", { index: idx, aClean: aClean, bClean: bClean });
    }

    // Data-quality warnings only (throttled)
    if (aClean && bClean && aClean === bClean) {
      warnGame4("GAME4 options identical after sanitization", { index: idx, aClean: aClean, bClean: bClean });
    }

    // Punjabi options checks (warnings only; do not modify content)
    if (q && q.optionsPa != null) {
      if (!Array.isArray(q.optionsPa) || q.optionsPa.length < 2) {
        warnGame4("GAME4 optionsPa present but has < 2 entries", {
          index: idx,
          optionsPaType: (q.optionsPa === null) ? "null" : typeof q.optionsPa,
          optionsPaLength: (Array.isArray(q.optionsPa) ? q.optionsPa.length : null)
        });
      } else {
        var pa0 = (q.optionsPa[0] != null) ? String(q.optionsPa[0]) : "";
        var pa1 = (q.optionsPa[1] != null) ? String(q.optionsPa[1]) : "";
        if (!trimSpaces(pa0) || !trimSpaces(pa1)) {
          warnGame4("GAME4 optionsPa contains empty string(s)", { index: idx, pa0: pa0, pa1: pa1 });
        }
        if (trimSpaces(pa0) && trimSpaces(pa1) && pa0 === pa1) {
          warnGame4("GAME4 Punjabi options duplicated (optionsPa[0] === optionsPa[1])", { index: idx, pa0: pa0 });
        }
      }
    }

    // Robust correct-answer detection (compare sanitized strings)
    var correctRaw = (q && q.correct != null) ? String(q.correct) : "";
    var correctClean = sanitizeOptionText(correctRaw);
    warnSanitizationChange(correctRaw, correctClean, { gameId: "GAME4", index: idx, field: "correct" });

    var correctChoiceId = "a"; // fail-safe default

    // Matching only: case-insensitive + trimmed comparison (do not change displayed text)
    var keyCorrect = trimSpaces(correctClean).toLowerCase();
    var keyA = trimSpaces(aClean).toLowerCase();
    var keyB = trimSpaces(bClean).toLowerCase();
    var matchesA = (keyCorrect && keyA) ? (keyCorrect === keyA) : false;
    var matchesB = (keyCorrect && keyB) ? (keyCorrect === keyB) : false;

    if (matchesA && !matchesB) {
      correctChoiceId = "a";
    } else if (matchesB && !matchesA) {
      correctChoiceId = "b";
    } else if (matchesA && matchesB) {
      // Ambiguous (likely identical options) — warn and keep fail-safe default
      warnGame4("GAME4 correct answer matches both options after sanitization (ambiguous)", {
        index: idx,
        aClean: aClean,
        bClean: bClean,
        correctClean: correctClean
      });
      correctChoiceId = "a";
    } else {
      // Not found — warn with requested strings and keep fail-safe default
      warnGame4("GAME4 correct answer not found after sanitization; defaulting to 'a'", {
        index: idx,
        aClean: aClean,
        bClean: bClean,
        correctClean: correctClean
      });
      correctChoiceId = "a";
    }

    var fallback = GAME4_FALLBACK;

    return {
      id: "G4_" + idx,
      gameId: "GAME4",
      trackId: q.trackId,
      prompt: "Pick the correct sentence:",
      choices: [
        { id: "a", text: aClean },
        { id: "b", text: bClean }
      ],
      correctChoiceId: correctChoiceId,
      hintEn: q.hintEn || fallback.hintEn,
      hintPa: q.hintPa || fallback.hintPa,
      explanationEn: q.explanationEn || fallback.explanationEn || "",
      explanationPa: q.explanationPa || fallback.explanationPa || ""
    };
  });
}

function buildAllGameQuestions() {
  var results = [];
  // Daily Quest only uses GAME2–GAME4 today; skip GAME1 here to keep
  // normalization independent from the heavier GAME1 token utilities.
  validateGame2Bank();
  results = results.concat(normalizeGame2Questions());
  results = results.concat(normalizeGame3Questions());
  results = results.concat(normalizeGame4Questions());
  // Game 5 is new and safe to include in validation (does not affect Daily Quest selection).
  results = results.concat(normalizeGame5Questions());
  validateNormalizedQuestions(results);
  return results;
}

function normalizeGame5Questions() {
  var fallback = {
    hintEn: "Pick the most polite and helpful reply.",
    hintPa: "ਸਭ ਤੋਂ ਸ਼ਿਸ਼ਟ ਅਤੇ ਮਦਦਗਾਰ ਜਵਾਬ ਚੁਣੋ।",
    explanationEn: "A good reply is kind, clear, and respectful.",
    explanationPa: "ਚੰਗਾ ਜਵਾਬ ਦਇਆਲੂ, ਸਪੱਸ਼ਟ ਅਤੇ ਆਦਰ ਵਾਲਾ ਹੁੰਦਾ ਹੈ।"
  };

  var raw = (typeof RAW_GAME5_QUESTIONS !== "undefined" && Array.isArray(RAW_GAME5_QUESTIONS)) ? RAW_GAME5_QUESTIONS : [];
  var out = [];
  var seen = {};

  for (var i = 0; i < raw.length; i++) {
    var q = raw[i] || {};
    var id = String(q.id || ("G5_" + String(i)));
    if (seen[id]) continue;
    seen[id] = true;

    var choicesEn = Array.isArray(q.choicesEn)
      ? q.choicesEn
      : (Array.isArray(q.optionsEn)
        ? q.optionsEn
        : (Array.isArray(q.options)
          ? q.options
          : []));

    var answerIndex = (typeof q.answerIndex === "number")
      ? q.answerIndex
      : ((typeof q.correctIndex === "number")
        ? q.correctIndex
        : ((typeof q.correctChoiceIndex === "number")
          ? q.correctChoiceIndex
          : -1));

    if (choicesEn.length < 3 || choicesEn.length > 8) continue;
    if (answerIndex < 0 || answerIndex >= choicesEn.length) continue;

    var letters = "abcdefghijklmnopqrstuvwxyz";
    var choices = [];
    for (var c = 0; c < choicesEn.length; c++) {
      choices.push({ id: letters[c], text: String(choicesEn[c] || "") });
    }

    out.push({
      id: id,
      gameId: "GAME5",
      trackId: String(q.trackId || "CONVO_REPLY"),
      prompt: String(q.promptEn || ""),
      choices: choices,
      correctChoiceId: letters[answerIndex],
      hintEn: String(q.hintEn || q.hint || fallback.hintEn),
      hintPa: String(q.hintPa || fallback.hintPa),
      explanationEn: String(q.explainEn || q.explanationEn || q.explain || q.explanation || fallback.explanationEn),
      explanationPa: String(q.explainPa || q.explanationPa || fallback.explanationPa)
    });
  }

  return out;
}

function validateNormalizedQuestions(allQs) {
  if (!Array.isArray(allQs)) {
    console.warn("validateNormalizedQuestions: expected array", allQs);
    return;
  }

  var warnGame4Safe = (typeof warnGame4 === "function")
    ? warnGame4
    : function(message, payload) { console.warn(message, payload || {}); };

  for (var i = 0; i < allQs.length; i++) {
    var q = allQs[i] || {};
    var missing = [];
    if (!q.id) missing.push("id");
    if (!q.gameId) missing.push("gameId");
    if (!q.trackId) missing.push("trackId");
    if (!q.prompt) missing.push("prompt");
    if (!Array.isArray(q.choices) || !q.choices.length) missing.push("choices");
    if (!q.correctChoiceId && q.correctChoiceId !== 0) missing.push("correctChoiceId");

    if (missing.length) {
      console.warn("Normalized game question missing fields", { index: i, id: q.id, missing: missing });
    }

    if (!q.hintEn || !String(q.hintEn).trim()) {
      console.warn("Normalized game question missing hintEn", { index: i, id: q.id, gameId: q.gameId });
    }
    if (!q.hintPa || !String(q.hintPa).trim()) {
      console.warn("Normalized game question missing hintPa", { index: i, id: q.id, gameId: q.gameId });
    }

    if (q.gameId === "GAME4") {
      // Game 4 validations (warnings only)
      if (q.correctChoiceId !== "a" && q.correctChoiceId !== "b") {
        warnGame4Safe("GAME4 correctChoiceId should be 'a' or 'b'", { index: i, id: q.id, correctChoiceId: q.correctChoiceId });
      }

      var choices = Array.isArray(q.choices) ? q.choices : [];
      if (choices.length !== 2) {
        warnGame4Safe("GAME4 should have exactly 2 choices", { index: i, id: q.id, choicesCount: choices.length });
      }

      var correctInChoices = false;
      for (var c = 0; c < choices.length; c++) {
        if (choices[c] && choices[c].id === q.correctChoiceId) { correctInChoices = true; break; }
      }
      if (!correctInChoices) {
        warnGame4Safe("GAME4 correctChoiceId not present among choices", { index: i, id: q.id, correctChoiceId: q.correctChoiceId, choices: choices });
      }

      if ((!q.explanationEn && !q.explanationPa)) {
        warnGame4Safe("GAME4 question missing explanation", { index: i, id: q.id });
      }
    }

    // Additional Game 1 validations (Batch 3)
    if (q.gameId === "GAME1") {
      if (!Array.isArray(q.choices) || q.choices.length !== 4) {
        console.warn("GAME1 should have exactly 4 choices", { index: i, id: q.id, choicesCount: (q.choices || []).length });
      }
      // uniqueness case-insensitive
      var idsSeen = {};
      var dupFound = false;
      for (var k = 0; k < (q.choices || []).length; k++) {
        var cid = (q.choices[k] && q.choices[k].id != null) ? String(q.choices[k].id).toLowerCase() : "";
        if (!cid) continue;
        if (idsSeen[cid]) { dupFound = true; break; }
        idsSeen[cid] = true;
      }
      if (dupFound) {
        console.warn("GAME1 choices contain duplicates (case-insensitive)", { index: i, id: q.id, choices: q.choices });
      }
      // ensure correctChoiceId matches a choice id (case-insensitive)
      var foundCorrect = false;
      var targetId = String(q.correctChoiceId).toLowerCase();
      for (var m = 0; m < (q.choices || []).length; m++) {
        if (String(q.choices[m].id).toLowerCase() === targetId) { foundCorrect = true; break; }
      }
      if (!foundCorrect) {
        console.warn("GAME1 correctChoiceId not present among choices (case-insensitive)", { index: i, id: q.id, correctChoiceId: q.correctChoiceId, choices: q.choices });
      }
    }
  }
}

// Unified game data registry for sanity checks and counts
var GAMES_DATA = {
  GAME1: GAME1_QUESTIONS,
  GAME2: (typeof GAME2_QUESTIONS !== "undefined") ? GAME2_QUESTIONS : [],
  GAME3: (typeof GAME3_QUESTIONS !== "undefined") ? GAME3_QUESTIONS : [],
  GAME4: (typeof GAME4_QUESTIONS !== "undefined") ? GAME4_QUESTIONS : [],
  GAME5: RAW_GAME5_QUESTIONS,
  GAME6: RAW_GAME6_QUESTIONS,
  // Placeholder slot for upcoming game 7 content
  GAME7: (typeof GAME7_QUESTIONS !== "undefined") ? GAME7_QUESTIONS : [],
  GAME8: (typeof GAME8_QUESTIONS !== "undefined") ? GAME8_QUESTIONS : []
};

