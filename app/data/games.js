// -------------------- GAME QUESTION BANKS --------------------

// NOTE: This file is loaded as a vanilla script (no imports).
// A few small helpers are defined here defensively so custom-quiz
// normalization can run even if other modules are not loaded.

// -------------------- Data/Bank versions (V2) --------------------
// These are read by app/js/games.js for cache migration.
// Keep them simple strings (semver/date/tag).
if (typeof DATA_VERSION === "undefined") {
  var DATA_VERSION = "v2.0";
}
if (typeof BANK_VERSION_GAME1 === "undefined") {
  var BANK_VERSION_GAME1 = "g1_v2.0";
}
if (typeof BANK_VERSION_GAME4 === "undefined") {
  var BANK_VERSION_GAME4 = "g4_v2.0";
}

// -------------------- Minimal V2 canonicalizers --------------------
// Duplicated here (no imports) so bank validation can run without app/js/games.js.
if (typeof _boloNormalizeQuotesV2 !== "function") {
  function _boloNormalizeQuotesV2(s) {
    return String(s == null ? "" : s)
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
  }
}

if (typeof canonWordV2Data !== "function") {
  function canonWordV2Data(s) {
    var t = _boloNormalizeQuotesV2(s);
    t = t.toLowerCase();
    t = t.replace(/\s+/g, " ").trim();

    // Strip leading/trailing punctuation; keep inner apostrophes (contractions/possessives).
    t = t.replace(/^[^a-z0-9']+/g, "").replace(/[^a-z0-9']+$/g, "");
    return t;
  }
}

if (typeof canonTextV2Data !== "function") {
  function canonTextV2Data(s, opts) {
    var o = opts || {};
    var t = _boloNormalizeQuotesV2(s);
    t = t.replace(/\s+/g, " ").trim().toLowerCase();
    if (o.stripTerminalPunct) {
      t = t.replace(/[.!?]+$/g, "").replace(/\s+/g, " ").trim();
    }
    return t;
  }
}

if (typeof extractWordTokensV2Data !== "function") {
  function extractWordTokensV2Data(sentenceEn) {
    // Conservative (ASCII) word extraction: letters/digits with internal apostrophes.
    // This aligns with the Tap Word V2 rule: punctuation is not tappable.
    var s = _boloNormalizeQuotesV2(sentenceEn);
    var out = [];
    var re = /[A-Za-z0-9]+(?:'[A-Za-z0-9]+)*/g;
    var m;
    while ((m = re.exec(s)) !== null) {
      out.push(m[0]);
    }
    return out;
  }
}

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
  { sentence: "The cat drinks.", question: "Tap the noun", correctWord: "cat", trackId: "T_WORDS", tag: "NOUN:COMMON" },
  { sentence: "They play in the park.", question: "Tap the verb", correctWord: "play", trackId: "T_ACTIONS" },
  { sentence: "The red kite is high.", question: "Tap the adjective", correctWord: "red", trackId: "T_DESCRIBE" },
  { sentence: "She walks to school daily.", question: "Tap the adverb", correctWord: "daily", trackId: "T_ACTIONS" },
  { sentence: "The book is on the table.", question: "Tap the preposition", correctWord: "on", trackId: "T_SENTENCE" },
  { sentence: "A dog and a cat run.", question: "Tap the conjunction", correctWord: "and", trackId: "T_SENTENCE" },

  // New (spread across tracks)
  { sentence: "The apple is red", question: "Tap the noun", correctWord: "apple", trackId: "T_WORDS", tag: "NOUN:COMMON" },
  { sentence: "Birds fly high", question: "Tap the verb", correctWord: "fly", trackId: "T_ACTIONS" },
  { sentence: "We see a tall tree", question: "Tap the adjective", correctWord: "tall", trackId: "T_DESCRIBE" },
  { sentence: "She reads books", question: "Tap the pronoun", correctWord: "She", trackId: "T_SENTENCE" },
  { sentence: "The cat is under the table", question: "Tap the preposition", correctWord: "under", trackId: "T_READING" }

  // Phase 3 (+36): New (spread across tracks)
  ,{ sentence: "My sister paints.", question: "Tap the noun", correctWord: "sister", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The teacher smiles", question: "Tap the noun", correctWord: "teacher", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "Dogs chase balls", question: "Tap the verb", correctWord: "chase", trackId: "T_ACTIONS" }
  ,{ sentence: "He ran quickly", question: "Tap the adverb", correctWord: "quickly", trackId: "T_ACTIONS" }
  ,{ sentence: "A tiny bird sings", question: "Tap the adjective", correctWord: "tiny", trackId: "T_DESCRIBE" }
  ,{ sentence: "The soup is hot", question: "Tap the adjective", correctWord: "hot", trackId: "T_DESCRIBE" }
  ,{ sentence: "The sun is bright", question: "Tap the article", correctWord: "The", trackId: "T_SENTENCE" }
  ,{ sentence: "Wow! That is fun", question: "Tap the interjection", correctWord: "Wow", trackId: "T_SENTENCE" }
  ,{ sentence: "She sat beside me", question: "Tap the preposition", correctWord: "beside", trackId: "T_READING" }
  ,{ sentence: "I read and I write", question: "Tap the conjunction", correctWord: "and", trackId: "T_READING" }

  // Phase 4 (+48): New (12 per game)
  ,{ sentence: "My brother rides.", question: "Tap the noun", correctWord: "brother", trackId: "T_WORDS", hintEn: "A noun is a person, place, or thing.", hintPa: "ਨਾਂ (noun) = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", explanationEn: "Brother is a person.", explanationPa: "Brother ਵਿਅਕਤੀ ਹੈ।", tag: "NOUN:COMMON" }
  ,{ sentence: "Maya is here.", question: "Tap the noun", correctWord: "Maya", trackId: "T_WORDS", hintEn: "Names are nouns.", hintPa: "ਨਾਮ ਵੀ noun ਹੁੰਦੇ ਹਨ।", explanationEn: "Maya is a name.", explanationPa: "Maya ਨਾਮ ਹੈ।", tag: "NOUN:PROPER" }

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

  // Jan 2026 (+5): New (Game 1)
  ,{ sentence: "The train is late.", question: "Tap the noun", correctWord: "train", trackId: "T_WORDS", hintEn: "A noun is a person, place, or thing.", hintPa: "ਨਾਂ (noun) = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", tag: "NOUN:COMMON" }
  ,{ sentence: "We build a sandcastle", question: "Tap the verb", correctWord: "build", trackId: "T_ACTIONS", hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ (verb) = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।" }
  ,{ sentence: "She has a blue backpack", question: "Tap the adjective", correctWord: "blue", trackId: "T_DESCRIBE", hintEn: "Adjective describes a noun.", hintPa: "ਵਿਸ਼ੇਸ਼ਣ (adjective) ਵਰਣਨ ਕਰਦਾ ਹੈ।" }
  ,{ sentence: "He speaks softly", question: "Tap the adverb", correctWord: "softly", trackId: "T_ACTIONS", hintEn: "Adverb tells how/when.", hintPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ।" }
  ,{ sentence: "The shoes are in the closet", question: "Tap the preposition", correctWord: "in", trackId: "T_SENTENCE", hintEn: "Preposition shows place.", hintPa: "ਪੂਰਵ-ਬੋਧਕ ਥਾਂ ਦੱਸਦਾ ਹੈ।" }

  // Jan 2026 (+5): BOLO-themed (Game 1)
  ,{ sentence: "I practice typing daily", question: "Tap the verb", correctWord: "practice", trackId: "T_ACTIONS", hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ (verb) = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।" }
  ,{ sentence: "The keyboard helps me type", question: "Tap the noun", correctWord: "keyboard", trackId: "T_WORDS", hintEn: "A noun is a person, place, or thing.", hintPa: "ਨਾਂ (noun) = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", tag: "NOUN:COMMON" }
  ,{ sentence: "We read short lessons", question: "Tap the adjective", correctWord: "short", trackId: "T_DESCRIBE", hintEn: "Adjective describes a noun.", hintPa: "ਵਿਸ਼ੇਸ਼ਣ (adjective) ਵਰਣਨ ਕਰਦਾ ਹੈ।" }
  ,{ sentence: "She types carefully", question: "Tap the adverb", correctWord: "carefully", trackId: "T_ACTIONS", hintEn: "Adverb tells how/when.", hintPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ।" }
  ,{ sentence: "I study with BOLO", question: "Tap the preposition", correctWord: "with", trackId: "T_SENTENCE", hintEn: "Preposition shows relation.", hintPa: "ਪੂਰਵ-ਬੋਧਕ ਸੰਬੰਧ ਦੱਸਦਾ ਹੈ।" }

  // Jan 2026 (+5): Readings 1–10 themed (Game 1)
  ,{ sentence: "Our teacher writes clearly.", question: "Tap the noun", correctWord: "teacher", trackId: "T_READING", hintEn: "A noun is a person, place, or thing.", hintPa: "ਨਾਂ (noun) = ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼।", tag: "NOUN:COMMON" }
  ,{ sentence: "Some kids are playing on the swings", question: "Tap the verb", correctWord: "playing", trackId: "T_READING", hintEn: "Verb = action word.", hintPa: "ਕਿਰਿਆ (verb) = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ।" }
  ,{ sentence: "Look on the floor behind the door", question: "Tap the preposition", correctWord: "behind", trackId: "T_READING", hintEn: "Preposition shows place.", hintPa: "ਪੂਰਵ-ਬੋਧਕ ਥਾਂ ਦੱਸਦਾ ਹੈ।" }
  ,{ sentence: "My father hangs colorful balloons", question: "Tap the adjective", correctWord: "colorful", trackId: "T_READING", hintEn: "Adjective describes a noun.", hintPa: "ਵਿਸ਼ੇਸ਼ਣ (adjective) ਵਰਣਨ ਕਰਦਾ ਹੈ।" }
  ,{ sentence: "We carry two empty bags", question: "Tap the adjective", correctWord: "empty", trackId: "T_READING", hintEn: "Adjectives answer: what kind?", hintPa: "Adjective ਦੱਸਦਾ ਹੈ: ਕਿਹੋ ਜਿਹਾ?" }

  // Jan 2026 (+40): Simple 3–4 word sentences (mixed; common kid vocab)
  ,{ sentence: "The dog runs.", question: "Tap the noun", correctWord: "dog", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "A cat sleeps.", question: "Tap the noun", correctWord: "cat", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The boy jumps.", question: "Tap the noun", correctWord: "boy", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "My mom smiles.", question: "Tap the noun", correctWord: "mom", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The sun shines.", question: "Tap the noun", correctWord: "sun", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "A bird flies.", question: "Tap the noun", correctWord: "bird", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The baby laughs.", question: "Tap the noun", correctWord: "baby", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "My dad cooks.", question: "Tap the noun", correctWord: "dad", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The fish swims.", question: "Tap the noun", correctWord: "fish", trackId: "T_WORDS", tag: "NOUN:COMMON" }
  ,{ sentence: "The kid reads.", question: "Tap the noun", correctWord: "kid", trackId: "T_WORDS", tag: "NOUN:COMMON" }

  ,{ sentence: "Birds fly high.", question: "Tap the verb", correctWord: "fly", trackId: "T_ACTIONS" }
  ,{ sentence: "Dogs run quickly.", question: "Tap the verb", correctWord: "run", trackId: "T_ACTIONS" }
  ,{ sentence: "I like it.", question: "Tap the verb", correctWord: "like", trackId: "T_ACTIONS" }
  ,{ sentence: "We play today.", question: "Tap the verb", correctWord: "play", trackId: "T_ACTIONS" }
  ,{ sentence: "They help me.", question: "Tap the verb", correctWord: "help", trackId: "T_ACTIONS" }
  ,{ sentence: "Kids laugh loudly.", question: "Tap the verb", correctWord: "laugh", trackId: "T_ACTIONS" }
  ,{ sentence: "She reads now.", question: "Tap the verb", correctWord: "reads", trackId: "T_ACTIONS" }
  ,{ sentence: "He writes carefully.", question: "Tap the verb", correctWord: "writes", trackId: "T_ACTIONS" }
  ,{ sentence: "I eat it.", question: "Tap the verb", correctWord: "eat", trackId: "T_ACTIONS" }
  ,{ sentence: "We sing together.", question: "Tap the verb", correctWord: "sing", trackId: "T_ACTIONS" }

  ,{ sentence: "The dog is big.", question: "Tap the adjective", correctWord: "big", trackId: "T_DESCRIBE" }
  ,{ sentence: "The cat is small.", question: "Tap the adjective", correctWord: "small", trackId: "T_DESCRIBE" }
  ,{ sentence: "The sky is blue.", question: "Tap the adjective", correctWord: "blue", trackId: "T_DESCRIBE" }
  ,{ sentence: "The tea is hot.", question: "Tap the adjective", correctWord: "hot", trackId: "T_DESCRIBE" }
  ,{ sentence: "The ice is cold.", question: "Tap the adjective", correctWord: "cold", trackId: "T_DESCRIBE" }
  ,{ sentence: "The boy is happy.", question: "Tap the adjective", correctWord: "happy", trackId: "T_DESCRIBE" }
  ,{ sentence: "The girl is sad.", question: "Tap the adjective", correctWord: "sad", trackId: "T_DESCRIBE" }
  ,{ sentence: "The room is clean.", question: "Tap the adjective", correctWord: "clean", trackId: "T_DESCRIBE" }
  ,{ sentence: "The bag is heavy.", question: "Tap the adjective", correctWord: "heavy", trackId: "T_DESCRIBE" }
  ,{ sentence: "The cake is sweet.", question: "Tap the adjective", correctWord: "sweet", trackId: "T_DESCRIBE" }

  ,{ sentence: "She walks slowly.", question: "Tap the adverb", correctWord: "slowly", trackId: "T_ACTIONS" }
  ,{ sentence: "He runs quickly.", question: "Tap the adverb", correctWord: "quickly", trackId: "T_ACTIONS" }
  ,{ sentence: "Birds sing loudly.", question: "Tap the adverb", correctWord: "loudly", trackId: "T_ACTIONS" }
  ,{ sentence: "The baby sleeps now.", question: "Tap the adverb", correctWord: "now", trackId: "T_ACTIONS" }
  ,{ sentence: "I listen carefully.", question: "Tap the adverb", correctWord: "carefully", trackId: "T_ACTIONS" }
  ,{ sentence: "We speak softly.", question: "Tap the adverb", correctWord: "softly", trackId: "T_ACTIONS" }
  ,{ sentence: "She reads quietly.", question: "Tap the adverb", correctWord: "quietly", trackId: "T_ACTIONS" }
  ,{ sentence: "He smiles happily.", question: "Tap the adverb", correctWord: "happily", trackId: "T_ACTIONS" }
  ,{ sentence: "They wait calmly.", question: "Tap the adverb", correctWord: "calmly", trackId: "T_ACTIONS" }
  ,{ sentence: "I move gently.", question: "Tap the adverb", correctWord: "gently", trackId: "T_ACTIONS" }

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
  { trackId: "T_SENTENCE", word: "Wow!", correctPartId: "interjection" },

  { trackId: "T_READING", word: "she", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "after", correctPartId: "preposition" },

  // Expansion batch (+40)
  { trackId: "T_WORDS", word: "doctor", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "friend", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "family", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "cookie", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "garden", correctPartId: "noun" },
  { trackId: "T_WORDS", word: "bus", correctPartId: "noun" },

  { trackId: "T_ACTIONS", word: "walk", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "talk", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "help", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "listen", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "play", correctPartId: "verb" },
  { trackId: "T_ACTIONS", word: "sleep", correctPartId: "verb" },

  { trackId: "T_DESCRIBE", word: "small", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "big", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "cold", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "hot", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "quiet", correctPartId: "adjective" },
  { trackId: "T_DESCRIBE", word: "loud", correctPartId: "adjective" },

  { trackId: "T_SENTENCE", word: "always", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "never", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "often", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "now", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "soon", correctPartId: "adverb" },

  { trackId: "T_READING", word: "I", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "you", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "he", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "they", correctPartId: "pronoun" },
  { trackId: "T_READING", word: "we", correctPartId: "pronoun" },

  { trackId: "T_SENTENCE", word: "before", correctPartId: "preposition" },
  { trackId: "T_SENTENCE", word: "between", correctPartId: "preposition" },
  { trackId: "T_SENTENCE", word: "behind", correctPartId: "preposition" },
  { trackId: "T_SENTENCE", word: "inside", correctPartId: "preposition" },

  { trackId: "T_SENTENCE", word: "or", correctPartId: "conjunction" },
  { trackId: "T_SENTENCE", word: "because", correctPartId: "conjunction" },
  { trackId: "T_SENTENCE", word: "so", correctPartId: "conjunction" },

  { trackId: "T_SENTENCE", word: "a", correctPartId: "article" },
  { trackId: "T_SENTENCE", word: "an", correctPartId: "article" },
  { trackId: "T_SENTENCE", word: "the", correctPartId: "article" },

  { trackId: "T_SENTENCE", word: "Yay!", correctPartId: "interjection" },
  { trackId: "T_SENTENCE", word: "Oh!", correctPartId: "interjection" }

  // Jan 2026 (+5): New (Game 2)
  ,{ trackId: "T_WORDS", word: "balloon", correctPartId: "noun" }
  ,{ trackId: "T_ACTIONS", word: "laugh", correctPartId: "verb" }
  ,{ trackId: "T_DESCRIBE", word: "purple", correctPartId: "adjective" }
  ,{ trackId: "T_SENTENCE", word: "carefully", correctPartId: "adverb" }
  ,{ trackId: "T_SENTENCE", word: "across", correctPartId: "preposition" }

  // Jan 2026 (+5): BOLO-themed (Game 2)
  ,{ trackId: "T_WORDS", word: "lesson", correctPartId: "noun" }
  ,{ trackId: "T_ACTIONS", word: "type", correctPartId: "verb" }
  ,{ trackId: "T_DESCRIBE", word: "correct", correctPartId: "adjective" }
  ,{ trackId: "T_SENTENCE", word: "daily", correctPartId: "adverb" }
  ,{ trackId: "T_SENTENCE", word: "during", correctPartId: "preposition" }

  // Jan 2026 (+5): Readings 1–10 themed (Game 2)
  ,{ trackId: "T_READING", word: "market", correctPartId: "noun" }
  ,{ trackId: "T_READING", word: "mix", correctPartId: "verb" }
  ,{ trackId: "T_READING", word: "excited", correctPartId: "adjective" }
  ,{ trackId: "T_READING", word: "together", correctPartId: "adverb" }
  ,{ trackId: "T_READING", word: "near", correctPartId: "preposition" }
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
  { trackId: "T_READING", sentence: "He read quietly last week.", correctTense: "past" },

  // --- Expansion batch (40) ---
  { trackId: "T_ACTIONS", sentence: "I brush my teeth every morning.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "She is drawing right now.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "They walk to the bus stop each day.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "We are cleaning our room now.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "He drinks water after school.", correctTense: "present" },
  { trackId: "T_WORDS", sentence: "The baby is laughing now.", correctTense: "present" },
  { trackId: "T_DESCRIBE", sentence: "The sun shines in the morning.", correctTense: "present" },
  { trackId: "T_SENTENCE", sentence: "I feel sleepy tonight.", correctTense: "present" },
  { trackId: "T_READING", sentence: "We read a short story every weekend.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "My friends are playing outside right now.", correctTense: "present" },
  { trackId: "T_DESCRIBE", sentence: "The soup smells good.", correctTense: "present" },
  { trackId: "T_WORDS", sentence: "The bird is singing now.", correctTense: "present" },
  { trackId: "T_SENTENCE", sentence: "I am waiting for the bell.", correctTense: "present" },

  { trackId: "T_ACTIONS", sentence: "I visited my grandma last weekend.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "She washed her hands yesterday.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "They opened the box a minute ago.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "We cleaned the kitchen this morning.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "He dropped his pencil in class.", correctTense: "past" },
  { trackId: "T_WORDS", sentence: "The dog barked all night.", correctTense: "past" },
  { trackId: "T_READING", sentence: "I read two pages yesterday.", correctTense: "past" },
  { trackId: "T_SENTENCE", sentence: "We were tired after the game.", correctTense: "past" },
  { trackId: "T_DESCRIBE", sentence: "The sky was cloudy yesterday.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "She helped her brother earlier.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "They played cards after dinner.", correctTense: "past" },
  { trackId: "T_READING", sentence: "He wrote a note last night.", correctTense: "past" },
  { trackId: "T_WORDS", sentence: "The cat hid under the bed.", correctTense: "past" },

  { trackId: "T_ACTIONS", sentence: "I will pack my bag tonight.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "She will call you after school.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "They will go to the zoo on Saturday.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "We will play a new game tomorrow.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "He will clean his desk later.", correctTense: "future" },
  { trackId: "T_WORDS", sentence: "The puppy will learn a trick soon.", correctTense: "future" },
  { trackId: "T_DESCRIBE", sentence: "The weather will be cool tomorrow.", correctTense: "future" },
  { trackId: "T_READING", sentence: "We will read a longer story next week.", correctTense: "future" },
  { trackId: "T_SENTENCE", sentence: "I will be ready in five minutes.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "They will eat lunch at noon.", correctTense: "future" },
  { trackId: "T_ACTIONS", sentence: "She will help her friend tomorrow.", correctTense: "future" },
  { trackId: "T_DESCRIBE", sentence: "The room will be quiet later.", correctTense: "future" },
  { trackId: "T_WORDS", sentence: "The bird will fly away soon.", correctTense: "future" },
  { trackId: "T_SENTENCE", sentence: "We will meet after class.", correctTense: "future" }

  // Jan 2026 (+5): New (Game 3)
  ,{ trackId: "T_ACTIONS", sentence: "I eat breakfast every morning.", correctTense: "present" }
  ,{ trackId: "T_READING", sentence: "We visited the museum yesterday.", correctTense: "past" }
  ,{ trackId: "T_SENTENCE", sentence: "They will finish homework tonight.", correctTense: "future" }
  ,{ trackId: "T_WORDS", sentence: "The baby is crying now.", correctTense: "present" }
  ,{ trackId: "T_ACTIONS", sentence: "She cooked dinner last night.", correctTense: "past" }

  // Jan 2026 (+5): BOLO-themed (Game 3)
  ,{ trackId: "T_ACTIONS", sentence: "I practice English every day.", correctTense: "present" }
  ,{ trackId: "T_ACTIONS", sentence: "I typed three words yesterday.", correctTense: "past" }
  ,{ trackId: "T_READING", sentence: "We will read a lesson tomorrow.", correctTense: "future" }
  ,{ trackId: "T_SENTENCE", sentence: "I am studying right now.", correctTense: "present" }
  ,{ trackId: "T_ACTIONS", sentence: "She practiced typing last week.", correctTense: "past" }

  // Jan 2026 (+5): Readings 1–10 themed (Game 3)
  ,{ trackId: "T_READING", sentence: "On Sunday I go to the market.", correctTense: "present" }
  ,{ trackId: "T_READING", sentence: "Yesterday it rained.", correctTense: "past" }
  ,{ trackId: "T_READING", sentence: "Tomorrow I will visit my aunt.", correctTense: "future" }
  ,{ trackId: "T_READING", sentence: "Last Saturday I cleaned my room.", correctTense: "past" }
  ,{ trackId: "T_READING", sentence: "Today I clean my desk.", correctTense: "present" }

  // Feb 2026 (+8): Punjabi-supported expansion (Game 3)
  ,{ trackId: "T_ACTIONS", sentence: "Every evening, I revise my notes.", sentencePa: "ਹਰ ਸ਼ਾਮ ਮੈਂ ਆਪਣੇ ਨੋਟ ਦੁਹਰਾਂਦਾ/ਦੁਹਰਾਂਦੀ ਹਾਂ।", correctTense: "present" }
  ,{ trackId: "T_READING", sentence: "Last Sunday, we visited the science museum.", sentencePa: "ਪਿਛਲੇ ਐਤਵਾਰ ਅਸੀਂ ਸਾਇੰਸ ਮਿਊਜ਼ੀਅਮ ਗਏ ਸੀ।", correctTense: "past" }
  ,{ trackId: "T_SENTENCE", sentence: "Next month, she will join the reading club.", sentencePa: "ਅਗਲੇ ਮਹੀਨੇ ਉਹ ਰੀਡਿੰਗ ਕਲੱਬ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੇਗੀ।", correctTense: "future" }
  ,{ trackId: "T_ACTIONS", sentence: "Right now, they are waiting at the gate.", sentencePa: "ਇਸ ਵੇਲੇ ਉਹ ਗੇਟ ਤੇ ਉਡੀਕ ਕਰ ਰਹੇ ਹਨ।", correctTense: "present" }
  ,{ trackId: "T_DESCRIBE", sentence: "Yesterday, the classroom was very quiet.", sentencePa: "ਕੱਲ੍ਹ ਕਲਾਸਰੂਮ ਬਹੁਤ ਸ਼ਾਂਤ ਸੀ।", correctTense: "past" }
  ,{ trackId: "T_READING", sentence: "Tonight, I will finish this chapter.", sentencePa: "ਅੱਜ ਰਾਤ ਮੈਂ ਇਹ ਅਧਿਆਇ ਪੂਰਾ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।", correctTense: "future" }
  ,{ trackId: "T_WORDS", sentence: "The bus arrives at eight every morning.", sentencePa: "ਬੱਸ ਹਰ ਸਵੇਰੇ ਅੱਠ ਵਜੇ ਆਉਂਦੀ ਹੈ।", correctTense: "present" }
  ,{ trackId: "T_SENTENCE", sentence: "Before dinner, he cleaned his desk.", sentencePa: "ਰਾਤ ਦੇ ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ ਉਸਨੇ ਆਪਣੀ ਡੈਸਕ ਸਾਫ਼ ਕੀਤੀ।", correctTense: "past" }
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

  // Jan 2026 (+5): New (Game 4)
  ,{ trackId: "T_ACTIONS", options: ["The dogs barks", "The dogs bark"], optionsPa: ["ਕੁੱਤੇ ਭੌਂਕਦੇ ਹਨ।", "ਕੁੱਤੇ ਭੌਂਕਦੇ ਹਨ।"], correct: "The dogs bark", explanationEn: "Dogs is plural, so use bark (no s).", explanationPa: "Dogs ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ bark (ਬਿਨਾਂ s) ਵਰਤੋ।" }
  ,{ trackId: "T_WORDS", options: ["A orange", "An orange"], optionsPa: ["ਇੱਕ ਸੰਤਰਾ (ਗਲਤ)", "ਇੱਕ ਸੰਤਰਾ"], correct: "An orange", explanationEn: "Use an before vowel sounds (orange).", explanationPa: "vowel sound (orange) ਤੋਂ ਪਹਿਲਾਂ an ਆਉਂਦਾ ਹੈ।" }
  ,{ trackId: "T_READING", options: ["He goed home", "He went home"], optionsPa: ["ਉਹ ਘਰ ਗਿਆ।", "ਉਹ ਘਰ ਗਿਆ।"], correct: "He went home", explanationEn: "Went is the past tense of go.", explanationPa: "Went, go ਦਾ past tense ਹੈ।" }
  ,{ trackId: "T_SENTENCE", options: ["Where you live?", "Where do you live?"], optionsPa: ["ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?", "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?"], correct: "Where do you live?", explanationEn: "In questions, use do before the subject.", explanationPa: "ਸਵਾਲ ਵਿੱਚ subject ਤੋਂ ਪਹਿਲਾਂ do ਆਉਂਦਾ ਹੈ।" }
  ,{ trackId: "T_SENTENCE", options: ["Her and me are friends", "She and I are friends"], optionsPa: ["ਉਹ ਅਤੇ ਮੈਂ ਦੋਸਤ ਹਾਂ।", "ਉਹ ਅਤੇ ਮੈਂ ਦੋਸਤ ਹਾਂ।"], correct: "She and I are friends", explanationEn: "Use subject pronouns: she and I.", explanationPa: "Subject ਲਈ she ਅਤੇ I ਵਰਤਦੇ ਹਨ।" }

  // Jan 2026 (+5): BOLO-themed (Game 4)
  ,{ trackId: "T_ACTIONS", options: ["I practices every day", "I practice every day"], optionsPa: ["ਮੈਂ ਹਰ ਰੋਜ਼ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।", "ਮੈਂ ਹਰ ਰੋਜ਼ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।"], correct: "I practice every day", explanationEn: "I uses the base verb: practice (no s).", explanationPa: "I ਨਾਲ ਕਿਰਿਆ ਦਾ ਸਾਧਾਰਣ ਰੂਪ ਆਉਂਦਾ ਹੈ (practice, s ਨਹੀਂ)।" }
  ,{ trackId: "T_ACTIONS", options: ["She type quickly", "She types quickly"], optionsPa: ["ਉਹ ਤੇਜ਼ ਟਾਈਪ ਕਰਦੀ ਹੈ।", "ਉਹ ਤੇਜ਼ ਟਾਈਪ ਕਰਦੀ ਹੈ।"], correct: "She types quickly", explanationEn: "She uses verb + s: types.", explanationPa: "She ਨਾਲ ਕਿਰਿਆ 's' ਲੈਂਦੀ ਹੈ: types।" }
  ,{ trackId: "T_SENTENCE", options: ["We is learning English", "We are learning English"], optionsPa: ["ਅਸੀਂ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖ ਰਹੇ ਹਾਂ।", "ਅਸੀਂ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖ ਰਹੇ ਹਾਂ।"], correct: "We are learning English", explanationEn: "We uses are (not is).", explanationPa: "We ਨਾਲ are ਆਉਂਦਾ ਹੈ (is ਨਹੀਂ)।" }
  ,{ trackId: "T_READING", options: ["I saw the hint", "I seen the hint"], optionsPa: ["ਮੈਂ ਹਿੰਟ ਵੇਖੀ।", "ਮੈਂ ਹਿੰਟ ਵੇਖੀ।"], correct: "I saw the hint", explanationEn: "Saw is the past tense of see.", explanationPa: "Saw, see ਦਾ past tense ਹੈ।" }
  ,{ trackId: "T_SENTENCE", options: ["Can I practice typing?", "Can I practice typing."], optionsPa: ["ਕੀ ਮੈਂ ਟਾਈਪਿੰਗ ਦਾ ਅਭਿਆਸ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?", "ਕੀ ਮੈਂ ਟਾਈਪਿੰਗ ਦਾ ਅਭਿਆਸ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"], correct: "Can I practice typing?", explanationEn: "Questions end with a question mark.", explanationPa: "ਸਵਾਲ ਦੇ ਅਖੀਰ ਵਿੱਚ ? ਆਉਂਦਾ ਹੈ।" }

  // Jan 2026 (+5): Readings 1–10 themed (Game 4)
  ,{ trackId: "T_READING", options: ["We walk to school together", "We walks to school together"], optionsPa: ["ਅਸੀਂ ਇਕੱਠੇ ਸਕੂਲ ਜਾਂਦੇ ਹਾਂ।", "ਅਸੀਂ ਇਕੱਠੇ ਸਕੂਲ ਜਾਂਦੇ ਹਾਂ।"], correct: "We walk to school together", explanationEn: "We is plural, so use walk (no s).", explanationPa: "We ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ walk (s ਨਹੀਂ) ਵਰਤੋ।" }
  ,{ trackId: "T_READING", options: ["Some kids are playing on the swings", "Some kids is playing on the swings"], optionsPa: ["ਕੁਝ ਬੱਚੇ ਝੂਲਿਆਂ ਤੇ ਖੇਡ ਰਹੇ ਹਨ।", "ਕੁਝ ਬੱਚੇ ਝੂਲਿਆਂ ਤੇ ਖੇਡ ਰਹੇ ਹਨ।"], correct: "Some kids are playing on the swings", explanationEn: "Kids is plural, so use are.", explanationPa: "Kids ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ are ਵਰਤੋ।" }
  ,{ trackId: "T_READING", options: ["I found my shoe behind the door", "I finded my shoe behind the door"], optionsPa: ["ਮੈਂ ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ ਆਪਣਾ ਜੁੱਤਾ ਲੱਭ ਲਿਆ।", "ਮੈਂ ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ ਆਪਣਾ ਜੁੱਤਾ ਲੱਭ ਲਿਆ।"], correct: "I found my shoe behind the door", explanationEn: "Found is the past tense of find.", explanationPa: "Found, find ਦਾ past tense ਹੈ।" }
  ,{ trackId: "T_READING", options: ["My mother bakes a cake", "My mother bake a cake"], optionsPa: ["ਮੇਰੀ ਮਾਂ ਕੇਕ ਬਣਾਉਂਦੀ ਹੈ।", "ਮੇਰੀ ਮਾਂ ਕੇਕ ਬਣਾਉਂਦੀ ਹੈ।"], correct: "My mother bakes a cake", explanationEn: "Mother is singular, so use bakes.", explanationPa: "Mother ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ bakes ਵਰਤੋ।" }
  ,{ trackId: "T_READING", options: ["We bought four apples", "We buyed four apples"], optionsPa: ["ਅਸੀਂ ਚਾਰ ਸੇਬ ਖਰੀਦੇ।", "ਅਸੀਂ ਚਾਰ ਸੇਬ ਖਰੀਦੇ।"], correct: "We bought four apples", explanationEn: "Bought is the past tense of buy.", explanationPa: "Bought, buy ਦਾ past tense ਹੈ।" }

  // Feb 2026 (+8): Quality expansion with clearer Punjabi contrasts (Game 4)
  ,{ trackId: "T_ACTIONS", options: ["He go to school daily", "He goes to school daily"], optionsPa: ["ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਣਾ (ਗਲਤ)", "ਉਹ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਜਾਂਦਾ ਹੈ।"], correct: "He goes to school daily", explanationEn: "He is singular, so use goes.", explanationPa: "He ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ goes ਵਰਤੋ।" }
  ,{ trackId: "T_SENTENCE", options: ["Do she like mangoes?", "Does she like mangoes?"], optionsPa: ["ਕੀ ਉਹਨੂੰ ਆਮ ਪਸੰਦ ਹੈ? (ਗਲਤ ਰੂਪ)", "ਕੀ ਉਸਨੂੰ ਆਮ ਪਸੰਦ ਹਨ?"], correct: "Does she like mangoes?", explanationEn: "Use does with she in questions.", explanationPa: "ਸਵਾਲ ਵਿੱਚ she ਨਾਲ does ਆਉਂਦਾ ਹੈ।" }
  ,{ trackId: "T_READING", options: ["We was ready for class", "We were ready for class"], optionsPa: ["ਅਸੀਂ ਕਲਾਸ ਲਈ ਤਿਆਰ ਸੀ (ਗਲਤ ਰੂਪ)", "ਅਸੀਂ ਕਲਾਸ ਲਈ ਤਿਆਰ ਸੀ।"], correct: "We were ready for class", explanationEn: "Use were with we.", explanationPa: "We ਨਾਲ were ਵਰਤਦੇ ਹਨ।" }
  ,{ trackId: "T_WORDS", options: ["This apples are fresh", "These apples are fresh"], optionsPa: ["ਇਹ ਸੇਬ ਤਾਜ਼ਾ ਹੈ (ਗਲਤ ਰੂਪ)", "ਇਹ ਸੇਬ ਤਾਜ਼ੇ ਹਨ।"], correct: "These apples are fresh", explanationEn: "Apples is plural, so use these.", explanationPa: "Apples ਬਹੁ-ਵਚਨ ਹੈ, ਇਸ ਲਈ these ਵਰਤੋ।" }
  ,{ trackId: "T_DESCRIBE", options: ["The milk smell sour", "The milk smells sour"], optionsPa: ["ਦੂਧ ਖੱਟੀ ਸੁੱਗ ਆਉਣਾ (ਗਲਤ ਰੂਪ)", "ਦੂਧ ਵਿੱਚ ਖੱਟੀ ਸੁੱਗ ਆ ਰਹੀ ਹੈ।"], correct: "The milk smells sour", explanationEn: "Milk is singular, so use smells.", explanationPa: "Milk ਇਕ-ਵਚਨ ਹੈ, ਇਸ ਲਈ smells ਵਰਤੋ।" }
  ,{ trackId: "T_ACTIONS", options: ["They doesn't need help", "They don't need help"], optionsPa: ["ਉਹਨਾਂ ਨੂੰ ਮਦਦ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ (ਗਲਤ ਰੂਪ)", "ਉਹਨਾਂ ਨੂੰ ਮਦਦ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"], correct: "They don't need help", explanationEn: "Use don't with they.", explanationPa: "They ਨਾਲ don't ਵਰਤੋ।" }
  ,{ trackId: "T_SENTENCE", options: ["Where did she went?", "Where did she go?"], optionsPa: ["ਉਹ ਕਿੱਥੇ ਗਈ ਸੀ? (ਗਲਤ ਰੂਪ)", "ਉਹ ਕਿੱਥੇ ਗਈ?"], correct: "Where did she go?", explanationEn: "After did, use base verb (go).", explanationPa: "did ਤੋਂ ਬਾਅਦ base verb (go) ਆਉਂਦਾ ਹੈ।" }
  ,{ trackId: "T_READING", options: ["An university is nearby", "A university is nearby"], optionsPa: ["ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਨੇੜੇ ਹੈ (ਗਲਤ article)", "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ ਨੇੜੇ ਹੈ।"], correct: "A university is nearby", explanationEn: "Use a before 'university' (starts with 'you' sound).", explanationPa: "'university' ਤੋਂ ਪਹਿਲਾਂ a ਆਉਂਦਾ ਹੈ (ਯੂ-ਸਾਊਂਡ)।" }
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
      },
      {
        id: "G5_026",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "vegetarian_choice",
        promptEn: "Someone offers you chicken. You are vegetarian. What do you say?",
        promptPa: "ਕੋਈ ਤੁਹਾਨੂੰ ਚਿਕਨ ਪੇਸ਼ ਕਰਦਾ ਹੈ। ਤੁਸੀਂ ਸ਼ਾਕਾਹਾਰੀ ਹੋ। ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["No thanks—I'm vegetarian. Do you have a veg option?", "Yes, give me chicken.", "Vegetables are stupid.", "Go away."],
        choicesPa: ["ਨਹੀਂ ਧੰਨਵਾਦ—ਮੈਂ ਸ਼ਾਕਾਹਾਰੀ ਹਾਂ। ਕੀ ਕੋਈ ਵੇਜ/ਸਬਜ਼ੀ ਵਾਲਾ ਵਿਕਲਪ ਹੈ?", "ਹਾਂ, ਮੈਨੂੰ ਚਿਕਨ ਦੇ ਦਿਓ।", "ਸਬਜ਼ੀਆਂ ਬੇਕਾਰ ਨੇ।", "ਚਲੇ ਜਾਓ।"],
        answerIndex: 0,
        hintEn: "Be polite and explain your choice.",
        hintPa: "ਨਮ੍ਰ ਰਹੋ ਅਤੇ ਆਪਣੀ ਪਸੰਦ ਦੱਸੋ।",
        explainEn: "It refuses politely and asks for a vegetarian option.",
        explainPa: "ਇਹ ਨਮ੍ਰਤਾ ਨਾਲ ਇਨਕਾਰ ਕਰਦਾ ਹੈ ਅਤੇ ਵੇਜ ਵਿਕਲਪ ਪੁੱਛਦਾ ਹੈ।"
      },
      {
        id: "G5_027",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "school_lunch",
        promptEn: "At school lunch, a friend asks: \"What do you want to eat?\" What is a good reply?",
        promptPa: "ਸਕੂਲ ਲੰਚ ਵੇਲੇ ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਤੂੰ ਕੀ ਖਾਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈਂ?\" ਚੰਗਾ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["I'd like a veggie sandwich, please.", "I want eat sandwich.", "Food now.", "I hate lunch."],
        choicesPa: ["ਮੈਨੂੰ ਵੇਜ ਸੈਂਡਵਿਚ ਚਾਹੀਦਾ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ।", "ਮੈਂ ਸੈਂਡਵਿਚ ਖਾਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ।", "ਖਾਣਾ ਹੁਣੇ।", "ਮੈਨੂੰ ਲੰਚ ਨਫ਼ਰਤ ਹੈ (ਅਜੀਬ)।"],
        answerIndex: 0,
        hintEn: "Use a polite, complete sentence.",
        hintPa: "ਨਮ੍ਰ ਅਤੇ ਪੂਰਾ ਵਾਕ ਵਰਤੋ।",
        explainEn: "It is polite and clear: \"I'd like... please.\"",
        explainPa: "ਇਹ ਨਮ੍ਰ ਅਤੇ ਸਪਸ਼ਟ ਹੈ: \"ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ।\""
      },
      {
        id: "G5_028",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "going_to_school",
        promptEn: "A parent says: \"It's time for school. Are you ready?\" What do you say?",
        promptPa: "ਮਾਤਾ-ਪਿਤਾ ਕਹਿੰਦੇ ਹਨ: \"ਸਕੂਲ ਦਾ ਸਮਾਂ ਹੋ ਗਿਆ। ਤੂੰ ਤਿਆਰ ਹੈਂ?\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Yes—my bag is packed.", "Ready yesterday.", "School is mine.", "Don't talk."],
        choicesPa: ["ਹਾਂ—ਮੇਰਾ ਬੈਗ ਤਿਆਰ ਹੈ।", "ਕੱਲ੍ਹ ਤਿਆਰ ਸੀ (ਅਜੀਬ)।", "ਸਕੂਲ ਮੇਰਾ ਹੈ।", "ਗੱਲ ਨਾ ਕਰੋ।"],
        answerIndex: 0,
        hintEn: "Answer clearly and politely.",
        hintPa: "ਸਪਸ਼ਟ ਅਤੇ ਨਮ੍ਰ ਜਵਾਬ ਦਿਓ।",
        explainEn: "It answers the question and sounds natural.",
        explainPa: "ਇਹ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿੰਦਾ ਹੈ ਅਤੇ ਕੁਦਰਤੀ ਲੱਗਦਾ ਹੈ।"
      },
      {
        id: "G5_029",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "sports_invite_accept",
        promptEn: "A friend asks: \"Do you want to play badminton after school?\" You want to say yes. What do you say?",
        promptPa: "ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਬੈਡਮਿੰਟਨ ਖੇਡਣੀ ਹੈ?\" ਤੁਸੀਂ ਹਾਂ ਕਹਿਣੀ ਹੈ। ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Sure! What time?", "Badminton is stupid.", "Maybe never.", "You must play."],
        choicesPa: ["ਹਾਂ! ਕਿਹੜੇ ਸਮੇਂ?", "ਬੈਡਮਿੰਟਨ ਬੇਕਾਰ ਹੈ।", "ਸ਼ਾਇਦ ਕਦੇ ਨਹੀਂ।", "ਤੂੰ ਖੇਡਣੀ ਹੀ ਪਏਗੀ (ਅਜੀਬ)।"],
        answerIndex: 0,
        hintEn: "Accept and ask for details.",
        hintPa: "ਹਾਂ ਕਹੋ ਅਤੇ ਵੇਰਵਾ ਪੁੱਛੋ।",
        explainEn: "It accepts warmly and keeps the plan clear.",
        explainPa: "ਇਹ ਦੋਸਤਾਨਾ ਢੰਗ ਨਾਲ ਕਬੂਲ ਕਰਦਾ ਹੈ ਅਤੇ ਯੋਜਨਾ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।"
      },
      {
        id: "G5_030",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "sports_invite_decline",
        promptEn: "A friend asks: \"Come play football (soccer) with us.\" You have homework. What is a polite reply?",
        promptPa: "ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਸਾਡੇ ਨਾਲ ਫੁਟਬਾਲ (ਸਾਕਰ) ਖੇਡਣ ਆ।\" ਤੁਹਾਡੇ ਕੋਲ ਹੋਮਵਰਕ ਹੈ। ਨਮ੍ਰ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["I'd love to, but I have homework. Maybe tomorrow?", "No. Leave me.", "You're annoying.", "Homework is trash."],
        choicesPa: ["ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ, ਪਰ ਮੇਰੇ ਕੋਲ ਹੋਮਵਰਕ ਹੈ। ਸ਼ਾਇਦ ਕੱਲ੍ਹ?", "ਨਹੀਂ। ਮੈਨੂੰ ਛੱਡ।", "ਤੂੰ ਤੰਗ ਕਰਦਾ/ਕਰਦੀ ਹੈਂ।", "ਹੋਮਵਰਕ ਬਕਵਾਸ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Decline kindly and offer another time.",
        hintPa: "ਨਰਮੀ ਨਾਲ ਇਨਕਾਰ ਕਰੋ ਅਤੇ ਹੋਰ ਸਮਾਂ ਸੁਝਾਓ।",
        explainEn: "It says no without being rude and keeps the friendship.",
        explainPa: "ਇਹ ਰੁੱਖੇ ਬਿਨਾਂ “ਨਹੀਂ” ਕਹਿੰਦਾ ਹੈ ਅਤੇ ਦੋਸਤੀ ਵੀ ਬਣੀ ਰਹਿੰਦੀ ਹੈ।"
      },
      {
        id: "G5_031",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "share_food",
        promptEn: "You brought dal and rice. A friend says: \"Can I try some?\" What do you say?",
        promptPa: "ਤੁਸੀਂ ਦਾਲ ਅਤੇ ਚਾਵਲ ਲਿਆਂਦੇ ਹੋ। ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਕੀ ਮੈਂ ਥੋੜ੍ਹਾ ਚੱਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Of course—here you go.", "No, never.", "Eat it all.", "Why are you asking?"],
        choicesPa: ["ਹਾਂ ਬਿਲਕੁਲ—ਲੈ ਲਓ।", "ਨਹੀਂ, ਕਦੇ ਨਹੀਂ।", "ਸਾਰਾ ਖਾ ਲੈ (ਅਜੀਬ)।", "ਤੂੰ ਪੁੱਛ ਕਿਉਂ ਰਿਹਾ/ਰਹੀ ਹੈਂ?"],
        answerIndex: 0,
        hintEn: "Be friendly when sharing.",
        hintPa: "ਸਾਂਝਾ ਕਰਦੇ ਸਮੇਂ ਦੋਸਤਾਨਾ ਰਹੋ।",
        explainEn: "It is kind and natural when someone asks to try your food.",
        explainPa: "ਜਦੋਂ ਕੋਈ ਚੱਖਣ ਲਈ ਪੁੱਛੇ ਤਾਂ ਇਹ ਮਿਹਰਬਾਨ ਅਤੇ ਕੁਦਰਤੀ ਜਵਾਬ ਹੈ।"
      },
      {
        id: "G5_032",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "late_to_school",
        promptEn: "The teacher asks: \"Why are you late?\" What is the best reply?",
        promptPa: "ਅਧਿਆਪਕ ਪੁੱਛਦਾ ਹੈ: \"ਤੂੰ ਦੇਰ ਨਾਲ ਕਿਉਂ ਆਇਆ/ਆਈ?\" ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["Sorry—the bus was late.", "Because you.", "I don't care.", "Late is fine."],
        choicesPa: ["ਮਾਫ਼ ਕਰਨਾ—ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ ਸੀ।", "ਤੁਹਾਡੇ ਕਰਕੇ।", "ਮੈਨੂੰ ਪਰਵਾਹ ਨਹੀਂ।", "ਦੇਰ ਨਾਲ ਆਉਣਾ ਠੀਕ ਹੈ।"],
        answerIndex: 0,
        hintEn: "Apologize and give a simple reason.",
        hintPa: "ਮਾਫ਼ੀ ਮੰਗੋ ਅਤੇ ਸਧਾਰਣ ਕਾਰਨ ਦਿਓ।",
        explainEn: "It is respectful and explains what happened.",
        explainPa: "ਇਹ ਨਮ੍ਰ ਹੈ ਅਤੇ ਕੀ ਹੋਇਆ ਸੀ ਉਹ ਦੱਸਦਾ ਹੈ।"
      },
      {
        id: "G5_033",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "sports_good_game",
        promptEn: "After a basketball game, a teammate says: \"Good game!\" What do you say?",
        promptPa: "ਬਾਸਕਟਬਾਲ ਮੈਚ ਤੋਂ ਬਾਅਦ ਟੀਮਮੇਟ ਕਹਿੰਦਾ ਹੈ: \"ਗੁੱਡ ਗੇਮ!\" ਤੁਸੀਂ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Thanks! You played well too.", "No, you were bad.", "Go away.", "Whatever."],
        choicesPa: ["ਧੰਨਵਾਦ! ਤੂੰ ਵੀ ਚੰਗਾ ਖੇਡਿਆ/ਖੇਡੀ।", "ਨਹੀਂ, ਤੂੰ ਮਾੜਾ ਖੇਡਿਆ।", "ਚਲੇ ਜਾਓ।", "ਛੱਡ।"],
        answerIndex: 0,
        hintEn: "Thank them and be positive.",
        hintPa: "ਧੰਨਵਾਦ ਕਹੋ ਅਤੇ ਸਕਾਰਾਤਮਕ ਰਹੋ।",
        explainEn: "A short thank-you and a compliment keeps good teamwork.",
        explainPa: "ਛੋਟਾ ਧੰਨਵਾਦ ਅਤੇ ਤਾਰੀਫ਼ ਨਾਲ ਟੀਮ ਵਰਕ ਚੰਗਾ ਰਹਿੰਦਾ ਹੈ।"
      },
      {
        id: "G5_034",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "vegetarian_menu",
        promptEn: "At a restaurant, you want a vegetarian meal. What is the best thing to ask?",
        promptPa: "ਰੈਸਟੋਰੈਂਟ ਵਿੱਚ ਤੁਸੀਂ ਵੇਜ ਖਾਣਾ ਚਾਹੁੰਦੇ ਹੋ। ਸਭ ਤੋਂ ਵਧੀਆ ਕੀ ਪੁੱਛੋਗੇ?",
        choicesEn: ["Do you have vegetarian options?", "Give me meat.", "Food is bad.", "You cook now."],
        choicesPa: ["ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸ਼ਾਕਾਹਾਰੀ ਵਿਕਲਪ ਹਨ?", "ਮੈਨੂੰ ਮੀਟ ਦੇ ਦਿਓ।", "ਖਾਣਾ ਮਾੜਾ ਹੈ।", "ਤੂੰ ਹੁਣੇ ਪਕਾ (ਰੁੱਖਾ)।"],
        answerIndex: 0,
        hintEn: "Ask a clear, polite question.",
        hintPa: "ਸਪਸ਼ਟ ਅਤੇ ਨਮ੍ਰ ਸਵਾਲ ਪੁੱਛੋ।",
        explainEn: "It is a polite question and gets you the right food.",
        explainPa: "ਇਹ ਨਮ੍ਰ ਸਵਾਲ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਢੁੱਕਵਾਂ ਖਾਣਾ ਮਿਲਦਾ ਹੈ।"
      },
      {
        id: "G5_035",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "favorite_sport",
        promptEn: "A friend asks: \"Which sport do you like?\" What is a good reply?",
        promptPa: "ਦੋਸਤ ਪੁੱਛਦਾ ਹੈ: \"ਤੈਨੂੰ ਕਿਹੜੀ ਖੇਡ ਪਸੰਦ ਹੈ?\" ਚੰਗਾ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["I like volleyball. It's fun.", "Because sport.", "Sports are mine.", "Go school."],
        choicesPa: ["ਮੈਨੂੰ ਵਾਲੀਬਾਲ ਪਸੰਦ ਹੈ। ਇਹ ਮਜ਼ੇਦਾਰ ਹੈ।", "ਕਿਉਂਕਿ ਖੇਡ (ਅਜੀਬ)।", "ਖੇਡਾਂ ਮੇਰੀਆਂ ਨੇ।", "ਜਾ ਸਕੂਲ (ਅਜੀਬ)।"],
        answerIndex: 0,
        hintEn: "Answer with one sport + a short reason.",
        hintPa: "ਇੱਕ ਖੇਡ ਦੱਸੋ ਅਤੇ ਛੋਟਾ ਕਾਰਨ ਦਿਓ।",
        explainEn: "It answers clearly and keeps the conversation going.",
        explainPa: "ਇਹ ਸਪਸ਼ਟ ਜਵਾਬ ਦਿੰਦਾ ਹੈ ਅਤੇ ਗੱਲ ਅੱਗੇ ਵਧਾਉਂਦਾ ਹੈ।"
      }
      ,{
        id: "G5_036",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "group_project_update",
        promptEn: "Your teammate asks: \"Did you finish your part?\" What is the best reply?",
        promptPa: "ਤੁਹਾਡਾ ਟੀਮਮੇਟ ਪੁੱਛਦਾ ਹੈ: \"ਕੀ ਤੁਸੀਂ ਆਪਣਾ ਹਿੱਸਾ ਪੂਰਾ ਕੀਤਾ?\" ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["Yes, I finished it and shared it in the group.", "Maybe. Not sure.", "Why are you asking me?", "Do it yourself."],
        choicesPa: ["ਹਾਂ, ਮੈਂ ਪੂਰਾ ਕਰ ਕੇ ਗਰੁੱਪ ਵਿੱਚ ਭੇਜ ਦਿੱਤਾ ਹੈ।", "ਸ਼ਾਇਦ। ਪਤਾ ਨਹੀਂ।", "ਤੂੰ ਮੈਨੂੰ ਕਿਉਂ ਪੁੱਛ ਰਿਹਾ/ਰਹੀ ਹੈਂ?", "ਤੂੰ ਆਪ ਕਰ।"],
        answerIndex: 0,
        hintEn: "Be clear and cooperative.",
        hintPa: "ਸਪਸ਼ਟ ਅਤੇ ਸਹਿਯੋਗੀ ਜਵਾਬ ਦਿਓ।",
        explainEn: "It gives a clear status update and supports teamwork.",
        explainPa: "ਇਹ ਸਪਸ਼ਟ ਅਪਡੇਟ ਦਿੰਦਾ ਹੈ ਅਤੇ ਟੀਮ ਵਰਕ ਨੂੰ ਸਹਿਯੋਗ ਦਿੰਦਾ ਹੈ।"
      }
      ,{
        id: "G5_037",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "ask_repeat_politely",
        promptEn: "You did not hear the teacher. What should you say?",
        promptPa: "ਤੁਸੀਂ ਅਧਿਆਪਕ ਦੀ ਗੱਲ ਨਹੀਂ ਸੁਣੀ। ਤੁਹਾਨੂੰ ਕੀ ਕਹਿਣਾ ਚਾਹੀਦਾ ਹੈ?",
        choicesEn: ["Sorry, could you please repeat that?", "Speak louder!", "I wasn't listening.", "Never mind."],
        choicesPa: ["ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋਗੇ?", "ਉੱਚਾ ਬੋਲੋ!", "ਮੈਂ ਧਿਆਨ ਨਹੀਂ ਦੇ ਰਿਹਾ/ਰਹੀ ਸੀ।", "ਛੱਡੋ।"],
        answerIndex: 0,
        hintEn: "Use polite language with teachers.",
        hintPa: "ਅਧਿਆਪਕ ਨਾਲ ਨਮ੍ਰ ਭਾਸ਼ਾ ਵਰਤੋ।",
        explainEn: "A polite repeat request is respectful and effective.",
        explainPa: "ਨਮ੍ਰਤਾ ਨਾਲ ਦੁਬਾਰਾ ਪੁੱਛਣਾ ਆਦਰਪੂਰਣ ਅਤੇ ਢੁੱਕਵਾਂ ਹੈ।"
      }
      ,{
        id: "G5_038",
        difficulty: 2,
        trackId: "CONVO_REPLY",
        topic: "decline_snack_politely",
        promptEn: "A friend offers chips, but you are full. What is the best reply?",
        promptPa: "ਦੋਸਤ ਚਿਪਸ ਆਫਰ ਕਰਦਾ ਹੈ, ਪਰ ਤੁਹਾਡਾ ਪੇਟ ਭਰਿਆ ਹੈ। ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["No thanks, I'm full right now.", "I hate chips.", "Stop offering me food.", "Give me later maybe whatever."],
        choicesPa: ["ਨਹੀਂ ਧੰਨਵਾਦ, ਮੇਰਾ ਪੇਟ ਇਸ ਵੇਲੇ ਭਰਿਆ ਹੈ।", "ਮੈਨੂੰ ਚਿਪਸ ਨਾਲ ਨਫ਼ਰਤ ਹੈ।", "ਮੈਨੂੰ ਖਾਣਾ ਆਫਰ ਕਰਨਾ ਬੰਦ ਕਰ।", "ਬਾਅਦ ਵਿੱਚ ਦੇ ਦੇ, ਜੋ ਵੀ।"],
        answerIndex: 0,
        hintEn: "Decline politely without sounding rude.",
        hintPa: "ਰੁੱਖੇ ਬਿਨਾਂ ਨਮ੍ਰਤਾ ਨਾਲ ਇਨਕਾਰ ਕਰੋ।",
        explainEn: "It politely declines while keeping the tone friendly.",
        explainPa: "ਇਹ ਨਮ੍ਰਤਾ ਨਾਲ ਇਨਕਾਰ ਕਰਦਾ ਹੈ ਅਤੇ ਲਹਿਜ਼ਾ ਦੋਸਤਾਨਾ ਰੱਖਦਾ ਹੈ।"
      }
      ,{
        id: "G5_039",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "resolve_misunderstanding",
        promptEn: "Your friend says: \"You ignored my message.\" What is the best response?",
        promptPa: "ਤੁਹਾਡਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ: \"ਤੂੰ ਮੇਰਾ ਮੈਸੇਜ ਨਜ਼ਰਅੰਦਾਜ਼ ਕੀਤਾ।\" ਸਭ ਤੋਂ ਵਧੀਆ ਜਵਾਬ ਕੀ ਹੈ?",
        choicesEn: ["Sorry—I missed it. I wasn't ignoring you.", "You're overreacting.", "So what?", "I saw it and didn't reply."],
        choicesPa: ["ਮਾਫ਼ ਕਰਨਾ—ਮੇਰੇ ਤੋਂ ਰਹਿ ਗਿਆ ਸੀ। ਮੈਂ ਤੈਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਨਹੀਂ ਕੀਤਾ।", "ਤੂੰ ਵੱਧ ਰਿਐਕਟ ਕਰ ਰਿਹਾ/ਰਹੀ ਹੈਂ।", "ਫਿਰ ਕੀ ਹੋਇਆ?", "ਮੈਂ ਦੇਖਿਆ ਸੀ ਪਰ ਜਵਾਬ ਨਹੀਂ ਦਿੱਤਾ।"],
        answerIndex: 0,
        hintEn: "Acknowledge feelings and clarify calmly.",
        hintPa: "ਭਾਵਨਾਵਾਂ ਮੰਨੋ ਅਤੇ ਸ਼ਾਂਤੀ ਨਾਲ ਗੱਲ ਸਪਸ਼ਟ ਕਰੋ।",
        explainEn: "It apologizes and clears the misunderstanding respectfully.",
        explainPa: "ਇਹ ਮਾਫ਼ੀ ਮੰਗਦਾ ਹੈ ਅਤੇ ਗਲਤਫ਼ਹਮੀ ਨੂੰ ਆਦਰ ਨਾਲ ਦੂਰ ਕਰਦਾ ਹੈ।"
      }
      ,{
        id: "G5_040",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "borrow_and_return",
        promptEn: "You borrowed a book and are returning it late. What is best to say?",
        promptPa: "ਤੁਸੀਂ ਕਿਤਾਬ ਉਧਾਰ ਲਈ ਸੀ ਅਤੇ ਦੇਰ ਨਾਲ ਵਾਪਸ ਕਰ ਰਹੇ ਹੋ। ਸਭ ਤੋਂ ਵਧੀਆ ਕੀ ਕਹੋਗੇ?",
        choicesEn: ["Sorry for the delay—thank you for waiting.", "Here. Take it.", "You have too many books anyway.", "I forgot. Not my problem."],
        choicesPa: ["ਦੇਰ ਲਈ ਮਾਫ਼ ਕਰਨਾ—ਉਡੀਕ ਕਰਨ ਲਈ ਧੰਨਵਾਦ।", "ਲੈ, ਰੱਖ ਲੈ।", "ਤੇਰੇ ਕੋਲ ਤਾਂ ਬਹੁਤ ਕਿਤਾਬਾਂ ਹਨ ਹੀ।", "ਮੈਂ ਭੁੱਲ ਗਿਆ/ਗਈ। ਇਹ ਮੇਰੀ ਸਮੱਸਿਆ ਨਹੀਂ।"],
        answerIndex: 0,
        hintEn: "Apologize and show appreciation.",
        hintPa: "ਮਾਫ਼ੀ ਮੰਗੋ ਅਤੇ ਧੰਨਵਾਦ ਦਿਖਾਓ।",
        explainEn: "It is responsible and polite in a delayed return situation.",
        explainPa: "ਦੇਰ ਨਾਲ ਵਾਪਸੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਇਹ ਜ਼ਿੰਮੇਵਾਰ ਅਤੇ ਨਮ੍ਰ ਜਵਾਬ ਹੈ।"
      }
      ,{
        id: "G5_041",
        difficulty: 3,
        trackId: "CONVO_REPLY",
        topic: "set_boundary_politely",
        promptEn: "A friend keeps calling during study time. What is the best message?",
        promptPa: "ਦੋਸਤ ਪੜ੍ਹਾਈ ਸਮੇਂ ਵਾਰ-ਵਾਰ ਕਾਲ ਕਰਦਾ ਹੈ। ਸਭ ਤੋਂ ਵਧੀਆ ਮੈਸੇਜ ਕੀ ਹੈ?",
        choicesEn: ["I'm studying now—can we talk after 8 PM?", "Stop calling me.", "You're so annoying.", "I'll never answer again."],
        choicesPa: ["ਮੈਂ ਹੁਣ ਪੜ੍ਹ ਰਿਹਾ/ਰਹੀ ਹਾਂ—ਕੀ ਅਸੀਂ 8 ਵਜੇ ਤੋਂ ਬਾਅਦ ਗੱਲ ਕਰ ਸਕਦੇ ਹਾਂ?", "ਮੈਨੂੰ ਕਾਲ ਕਰਨੀ ਬੰਦ ਕਰ।", "ਤੂੰ ਬਹੁਤ ਤੰਗ ਕਰਦਾ/ਕਰਦੀ ਹੈਂ।", "ਮੈਂ ਹੁਣ ਕਦੇ ਜਵਾਬ ਨਹੀਂ ਦੇਵਾਂਗਾ/ਦੇਵਾਂਗੀ।"],
        answerIndex: 0,
        hintEn: "Set a clear boundary politely.",
        hintPa: "ਸੀਮਾ ਸਪਸ਼ਟ ਪਰ ਨਮ੍ਰਤਾ ਨਾਲ ਰੱਖੋ।",
        explainEn: "It protects study time while staying respectful.",
        explainPa: "ਇਹ ਪੜ੍ਹਾਈ ਦਾ ਸਮਾਂ ਬਚਾਉਂਦਾ ਹੈ ਅਤੇ ਆਦਰਪੂਰਣ ਵੀ ਰਹਿੰਦਾ ਹੈ।"
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
    },
    {
      id: "G6_026",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "vegetarian_food",
      promptEn: 'What does "ਦਾਲ" mean in English?',
      promptPa: '"lentils" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["lentils", "rice", "milk", "bread"],
      choicesPa: ["ਦਾਲ", "ਚਾਵਲ", "ਦੂਧ", "ਰੋਟੀ"],
      answerIndex: 0,
      hintEn: "It is a common vegetarian dish.",
      hintPa: "ਇਹ ਆਮ ਸ਼ਾਕਾਹਾਰੀ ਖਾਣਾ ਹੈ।",
      explainEn: '"ਦਾਲ" = lentils.',
      explainPa: '"lentils" = ਦਾਲ।'
    },
    {
      id: "G6_027",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "vegetarian_food",
      promptEn: 'What does "ਸਬਜ਼ੀ" mean in English?',
      promptPa: '"vegetables" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["vegetables", "chicken", "fish", "egg"],
      choicesPa: ["ਸਬਜ਼ੀਆਂ", "ਚਿਕਨ", "ਮੱਛੀ", "ਅੰਡਾ"],
      answerIndex: 0,
      hintEn: "Carrots and spinach are examples.",
      hintPa: "ਗਾਜਰ ਅਤੇ ਪਾਲਕ ਉਦਾਹਰਣ ਹਨ।",
      explainEn: '"ਸਬਜ਼ੀ" = vegetables.',
      explainPa: '"vegetables" = ਸਬਜ਼ੀ/ਸਬਜ਼ੀਆਂ।'
    },
    {
      id: "G6_028",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "vegetarian_food",
      promptEn: 'What does "ਰੋਟੀ" mean in English?',
      promptPa: '"bread" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["bread", "juice", "salt", "sugar"],
      choicesPa: ["ਰੋਟੀ", "ਜੂਸ", "ਨਮਕ", "ਚੀਨੀ"],
      answerIndex: 0,
      hintEn: "You eat it with dal or vegetables.",
      hintPa: "ਇਹ ਦਾਲ ਜਾਂ ਸਬਜ਼ੀ ਨਾਲ ਖਾਂਦੇ ਹਨ।",
      explainEn: '"ਰੋਟੀ" = bread.',
      explainPa: '"bread" = ਰੋਟੀ।'
    },
    {
      id: "G6_029",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "vegetarian_food",
      promptEn: 'What does "ਚਾਵਲ" mean in English?',
      promptPa: '"rice" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["rice", "beans", "cheese", "butter"],
      choicesPa: ["ਚਾਵਲ", "ਬੀਨਜ਼", "ਪਨੀਰ", "ਮੱਖਣ"],
      answerIndex: 0,
      hintEn: "People often eat it with curry.",
      hintPa: "ਅਕਸਰ ਇਸ ਨੂੰ ਦਾਲ/ਕੜੀ ਨਾਲ ਖਾਂਦੇ ਹਨ।",
      explainEn: '"ਚਾਵਲ" = rice.',
      explainPa: '"rice" = ਚਾਵਲ।'
    },
    {
      id: "G6_030",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "school",
      promptEn: 'What does "ਹੋਮਵਰਕ" mean in English?',
      promptPa: '"homework" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["homework", "holiday", "teacher", "sports"],
      choicesPa: ["ਹੋਮਵਰਕ", "ਛੁੱਟੀ", "ਅਧਿਆਪਕ", "ਖੇਡ"],
      answerIndex: 0,
      hintEn: "You do it after school.",
      hintPa: "ਇਹ ਤੁਸੀਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਕਰਦੇ ਹੋ।",
      explainEn: '"ਹੋਮਵਰਕ" = homework.',
      explainPa: '"homework" = ਹੋਮਵਰਕ।'
    },
    {
      id: "G6_031",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "school",
      promptEn: 'What does "ਅਧਿਆਪਕ" mean in English?',
      promptPa: '"teacher" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["teacher", "student", "doctor", "driver"],
      choicesPa: ["ਅਧਿਆਪਕ", "ਵਿਦਿਆਰਥੀ", "ਡਾਕਟਰ", "ਡਰਾਈਵਰ"],
      answerIndex: 0,
      hintEn: "This person teaches you.",
      hintPa: "ਇਹ ਵਿਅਕਤੀ ਤੁਹਾਨੂੰ ਪੜ੍ਹਾਉਂਦਾ/ਪੜ੍ਹਾਉਂਦੀ ਹੈ।",
      explainEn: '"ਅਧਿਆਪਕ" = teacher.',
      explainPa: '"teacher" = ਅਧਿਆਪਕ।'
    },
    {
      id: "G6_032",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "sports",
      promptEn: 'What does "ਵਾਲੀਬਾਲ" mean in English?',
      promptPa: '"volleyball" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["volleyball", "basketball", "badminton", "soccer"],
      choicesPa: ["ਵਾਲੀਬਾਲ", "ਬਾਸਕਟਬਾਲ", "ਬੈਡਮਿੰਟਨ", "ਫੁਟਬਾਲ"],
      answerIndex: 0,
      hintEn: "You hit the ball over a net.",
      hintPa: "ਇਹ ਜਾਲ (net) ਦੇ ਉਪਰੋਂ ਗੇਂਦ ਮਾਰ ਕੇ ਖੇਡੀ ਜਾਂਦੀ ਹੈ।",
      explainEn: '"ਵਾਲੀਬਾਲ" = volleyball.',
      explainPa: '"volleyball" = ਵਾਲੀਬਾਲ।'
    },
    {
      id: "G6_033",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "sports",
      promptEn: 'What does "ਬੈਡਮਿੰਟਨ" mean in English?',
      promptPa: '"badminton" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["badminton", "tennis", "volleyball", "hockey"],
      choicesPa: ["ਬੈਡਮਿੰਟਨ", "ਟੈਨਿਸ", "ਵਾਲੀਬਾਲ", "ਹਾਕੀ"],
      answerIndex: 0,
      hintEn: "You use a racket and a shuttlecock.",
      hintPa: "ਇਸ ਵਿੱਚ ਰੈਕਟ ਅਤੇ ਸ਼ਟਲ ਵਰਤਦੇ ਹਨ।",
      explainEn: '"ਬੈਡਮਿੰਟਨ" = badminton.',
      explainPa: '"badminton" = ਬੈਡਮਿੰਟਨ।'
    },
    {
      id: "G6_034",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "sports",
      promptEn: 'What does "ਫੁਟਬਾਲ" mean in English?',
      promptPa: '"soccer" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["soccer", "basketball", "cricket", "badminton"],
      choicesPa: ["ਫੁਟਬਾਲ", "ਬਾਸਕਟਬਾਲ", "ਕ੍ਰਿਕਟ", "ਬੈਡਮਿੰਟਨ"],
      answerIndex: 0,
      hintEn: "You kick the ball into a goal.",
      hintPa: "ਇਸ ਵਿੱਚ ਗੇਂਦ ਨੂੰ ਲੱਤ ਨਾਲ ਮਾਰ ਕੇ ਗੋਲ ਕਰਦੇ ਹਨ।",
      explainEn: '"ਫੁਟਬਾਲ" = soccer.',
      explainPa: '"soccer" = ਫੁਟਬਾਲ।'
    },
    {
      id: "G6_035",
      difficulty: 2,
      trackId: "VOCAB_TRANSLATION",
      topic: "sports",
      promptEn: 'What does "ਬਾਸਕਟਬਾਲ" mean in English?',
      promptPa: '"basketball" ਦਾ ਪੰਜਾਬੀ ਕੀ ਹੈ?',
      choicesEn: ["basketball", "volleyball", "soccer", "baseball"],
      choicesPa: ["ਬਾਸਕਟਬਾਲ", "ਵਾਲੀਬਾਲ", "ਫੁਟਬਾਲ", "ਬੇਸਬਾਲ"],
      answerIndex: 0,
      hintEn: "You bounce the ball and shoot it into a hoop.",
      hintPa: "ਇਸ ਵਿੱਚ ਗੇਂਦ ਟਪਾ ਕੇ ਰਿੰਗ ਵਿੱਚ ਸੁੱਟਦੇ ਹਨ।",
      explainEn: '"ਬਾਸਕਟਬਾਲ" = basketball.',
      explainPa: '"basketball" = ਬਾਸਕਟਬਾਲ।'
    }
  ];

  // Alias for consistency with other banks (safe)
  var GAME6_QUESTIONS = RAW_GAME6_QUESTIONS;

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

// V2 validator required by P0 integrity work.
// Returns a structured report and does not throw.
function validateGame1Bank(rawBank) {
  var bank = Array.isArray(rawBank) ? rawBank : [];
  var reasonsCount = {};
  var invalidItems = [];
  var valid = 0;
  var invalid = 0;

  function bump(reason) {
    reasonsCount[reason] = (reasonsCount[reason] || 0) + 1;
  }

  for (var i = 0; i < bank.length; i++) {
    var q = bank[i];
    var reasons = [];

    if (!q || typeof q !== "object") {
      reasons.push("not_object");
    } else {
      var s = trimSpaces(q.sentence);
      var cw = trimSpaces(q.correctWord);
      if (!s) reasons.push("missing_sentence");
      if (!cw) reasons.push("missing_correctWord");

      if (s && cw) {
        var tokens = extractWordTokensV2Data(s);
        if (!tokens.length) {
          reasons.push("no_word_tokens");
        } else {
          var want = canonWordV2Data(cw);
          var matches = [];
          for (var t = 0; t < tokens.length; t++) {
            if (canonWordV2Data(tokens[t]) === want) matches.push(t);
          }
          if (matches.length === 0) reasons.push("correctWord_not_found");
        }
      }
    }

    if (reasons.length) {
      invalid += 1;
      for (var r = 0; r < reasons.length; r++) bump(reasons[r]);
      invalidItems.push({
        index: i,
        id: (q && q.id != null) ? String(q.id) : null,
        sentence: (q && q.sentence != null) ? String(q.sentence) : "",
        correctWord: (q && q.correctWord != null) ? String(q.correctWord) : "",
        reasons: reasons
      });
    } else {
      valid += 1;
    }
  }

  return {
    valid: valid,
    invalid: invalid,
    reasonsCount: reasonsCount,
    invalidItems: invalidItems
  };
}

function validateGame4Bank(rawBank) {
  var bank = Array.isArray(rawBank) ? rawBank : [];
  var reasonsCount = {};
  var invalidItems = [];
  var valid = 0;
  var invalid = 0;

  function bump(reason) {
    reasonsCount[reason] = (reasonsCount[reason] || 0) + 1;
  }

  for (var i = 0; i < bank.length; i++) {
    var q = bank[i];
    var reasons = [];

    if (!q || typeof q !== "object") {
      reasons.push("not_object");
    } else {
      var opts = Array.isArray(q.options) ? q.options : [];
      if (opts.length !== 2) {
        reasons.push("options_count_not_2");
      }
      var a = (opts.length > 0) ? trimSpaces(opts[0]) : "";
      var b = (opts.length > 1) ? trimSpaces(opts[1]) : "";
      if (!a || !b) reasons.push("empty_option");

      if (a && b) {
        var ca = canonTextV2Data(a, { stripTerminalPunct: false });
        var cb = canonTextV2Data(b, { stripTerminalPunct: false });
        if (ca === cb) reasons.push("options_identical_after_canon");
      }

      var correct = trimSpaces(q.correct);
      if (!correct) {
        reasons.push("missing_correct");
      } else if (a && b) {
        // IMPORTANT: punctuation can be the learning target in Game 4.
        // Treat terminal punctuation as meaningful for correct matching.
        var cc = canonTextV2Data(correct, { stripTerminalPunct: false });
        var ma = (canonTextV2Data(a, { stripTerminalPunct: false }) === cc);
        var mb = (canonTextV2Data(b, { stripTerminalPunct: false }) === cc);
        var matchCount = (ma ? 1 : 0) + (mb ? 1 : 0);
        if (matchCount !== 1) reasons.push("correct_match_not_unique");
      }
    }

    if (reasons.length) {
      invalid += 1;
      for (var r = 0; r < reasons.length; r++) bump(reasons[r]);
      invalidItems.push({
        index: i,
        id: (q && q.id != null) ? String(q.id) : null,
        options: (q && Array.isArray(q.options)) ? q.options.slice(0, 2) : [],
        correct: (q && q.correct != null) ? String(q.correct) : "",
        reasons: reasons
      });
    } else {
      valid += 1;
    }
  }

  return {
    valid: valid,
    invalid: invalid,
    reasonsCount: reasonsCount,
    invalidItems: invalidItems
  };
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
  var results = [];

  function canonTextV2(s) {
    var t = String(s == null ? "" : s);
    // Normalize quotes/apostrophes and whitespace, lowercase, strip terminal punctuation.
    t = t.replace(/[\u2018\u2019\u02BC]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    t = trimSpaces(t).replace(/\s+/g, " ").toLowerCase();
    // Strip trailing sentence punctuation (but keep internal punctuation)
    t = t.replace(/[.!?]+$/g, "");
    t = trimSpaces(t);
    return t;
  }

  for (var idx = 0; idx < GAME4_QUESTIONS.length; idx++) {
    var q = GAME4_QUESTIONS[idx];
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

    // Randomize A/B placement so the correct answer isn't always option 'b'.
    // IMPORTANT: do this once per normalized question (not per render).
    // NOTE (v2): Do not randomize here. Normalization should be deterministic so
    // normal play and custom-quiz flows can converge on identical A/B ordering via the
    // shared normalizer in app/js/games.js.

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

    // Correctness detection (V2): canonical match must hit exactly one option.
    var keyCorrect = canonTextV2(correctRaw);
    var keyA = canonTextV2(aClean);
    var keyB = canonTextV2(bClean);
    var matchesA = (keyCorrect && keyA) ? (keyCorrect === keyA) : false;
    var matchesB = (keyCorrect && keyB) ? (keyCorrect === keyB) : false;

    var correctChoiceId = "";
    if (matchesA && !matchesB) {
      correctChoiceId = "a";
    } else if (matchesB && !matchesA) {
      correctChoiceId = "b";
    } else {
      warnGame4("GAME4 invalid question excluded (correct match ambiguous/not found)", {
        index: idx,
        aClean: aClean,
        bClean: bClean,
        correctRaw: correctRaw,
        correctClean: correctClean,
        keyCorrect: keyCorrect,
        keyA: keyA,
        keyB: keyB,
        matchesA: matchesA,
        matchesB: matchesB
      });
      continue;
    }

    var fallback = GAME4_FALLBACK;

    var out = {
      id: String((q && q.id != null) ? q.id : ("G4_" + idx)),
      gameId: "GAME4",
      trackId: q.trackId,
      prompt: "Pick the correct sentence:",
      choices: [
        { id: "a", text: aClean },
        { id: "b", text: bClean }
      ],
      correctChoiceId: correctChoiceId,
      // Preserve the authored correct string for V2 canonical matching downstream.
      correct: String(correctRaw || ""),
      hintEn: q.hintEn || fallback.hintEn,
      hintPa: q.hintPa || fallback.hintPa,
      explanationEn: q.explanationEn || fallback.explanationEn || "",
      explanationPa: q.explanationPa || fallback.explanationPa || ""
    };

    if (q && q.tag != null && trimSpaces(String(q.tag))) out.tag = trimSpaces(String(q.tag));

    results.push(out);
  }

  return results;
}

function buildAllGameQuestions() {
  var results = [];
  // Custom-quiz flow only uses GAME2–GAME4 today; skip GAME1 here to keep
  // normalization independent from the heavier GAME1 token utilities.
  validateGame2Bank();
  results = results.concat(normalizeGame2Questions());
  results = results.concat(normalizeGame3Questions());
  results = results.concat(normalizeGame4Questions());
  // Game 5 is new and safe to include in validation (does not affect custom-quiz selection).
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

var GAME11_MAZE_SETS = [
  {
    id: "G11_SET_1",
    title: "Set 1",
    maxEnergy: 100,
    mazes: [
      {
        id: "G11_S1_M1",
        topic: "nouns",
        grid: [
          "#############",
          "#S....#.....#",
          "###.#.#.###.#",
          "#...#...#...#",
          "#.#####.#.#.#",
          "#.....#...#E#",
          "#############"
        ]
      },
      {
        id: "G11_S1_M2",
        topic: "verbs",
        grid: [
          "#############",
          "#S..#.......#",
          "#.#.#.#####.#",
          "#.#...#...#.#",
          "#.#####.#.#.#",
          "#.......#..E#",
          "#############"
        ]
      },
      {
        id: "G11_S1_M3",
        topic: "adjectives",
        grid: [
          "#############",
          "#S......#...#",
          "#.#######.#.#",
          "#.....#...#.#",
          "###.#.#.###.#",
          "#...#.....#E#",
          "#############"
        ]
      },
      {
        id: "G11_S1_M4",
        topic: "nouns",
        grid: [
          "#############",
          "#S....#.....#",
          "#.#.###.###.#",
          "#.#...#...#.#",
          "#.###.###.#.#",
          "#.....#...#E#",
          "#############"
        ]
      },
      {
        id: "G11_S1_M5",
        topic: "verbs",
        grid: [
          "#############",
          "#S......#...#",
          "#.#####.#.#.#",
          "#.....#.#.#.#",
          "###.#.#.#.#.#",
          "#...#...#..E#",
          "#############"
        ]
      }
    ]
  },
  {
    id: "G11_SET_2",
    title: "Set 2",
    maxEnergy: 110,
    mazes: [
      {
        id: "G11_S2_M1",
        topic: "articles",
        grid: [
          "###############",
          "#S....#...#...#",
          "###.#.#.#.#.#.#",
          "#...#...#...#.#",
          "#.#####.#####.#",
          "#.....#.....#E#",
          "###############"
        ]
      },
      {
        id: "G11_S2_M2",
        topic: "prepositions",
        grid: [
          "###############",
          "#S....#.......#",
          "#.###.#.#####.#",
          "#...#.#...#...#",
          "###.#.###.#.###",
          "#.....#...#..E#",
          "###############"
        ]
      },
      {
        id: "G11_S2_M3",
        topic: "pronouns",
        grid: [
          "###############",
          "#S....#.......#",
          "#.###.#.#####.#",
          "#.#...#.....#.#",
          "#.#.#######.#.#",
          "#...#.......#E#",
          "###############"
        ]
      },
      {
        id: "G11_S2_M4",
        topic: "articles",
        grid: [
          "###############",
          "#S....#...#...#",
          "#.#.###.#.#.#.#",
          "#.#.....#...#.#",
          "#.#####.#####.#",
          "#.....#.....#E#",
          "###############"
        ]
      },
      {
        id: "G11_S2_M5",
        topic: "prepositions",
        grid: [
          "###############",
          "#S......#.....#",
          "###.###.#.###.#",
          "#...#...#...#.#",
          "#.###.#####.#.#",
          "#.....#.....#E#",
          "###############"
        ]
      }
    ]
  },
  {
    id: "G11_SET_3",
    title: "Set 3",
    maxEnergy: 120,
    mazes: [
      {
        id: "G11_S3_M1",
        topic: "nouns",
        grid: [
          "#################",
          "#S.....#.....#..#",
          "#.###.#.###.#.#.#",
          "#...#.#...#...#.#",
          "###.#.###.#####.#",
          "#...#...#.....#.#",
          "#.#####.#####.#E#",
          "#################"
        ]
      },
      {
        id: "G11_S3_M2",
        topic: "verbs",
        grid: [
          "#################",
          "#S..#.....#.....#",
          "#.#.#.###.#.###.#",
          "#.#...#...#...#.#",
          "#.#####.#####.#.#",
          "#.....#.....#.#.#",
          "#.###.#####.#.#E#",
          "#################"
        ]
      },
      {
        id: "G11_S3_M3",
        topic: "adjectives",
        grid: [
          "#################",
          "#S....#.......#.#",
          "#.##.#.#####.#.#.#",
          "#....#.....#.#...#",
          "#.#########.#.###.#",
          "#.........#...#...#",
          "#.#######.#####.#E#",
          "#################"
        ]
      },
      {
        id: "G11_S3_M4",
        topic: "prepositions",
        grid: [
          "#################",
          "#S.....#...#....#",
          "###.#.#.#.#.##.#.#",
          "#...#...#.#....#.#",
          "#.#######.####.#.#",
          "#.......#......#.#",
          "#.#####.########E#",
          "#################"
        ]
      },
      {
        id: "G11_S3_M5",
        topic: "pronouns",
        grid: [
          "#################",
          "#S....#.....#...#",
          "#.###.#.###.#.#.#",
          "#...#.#.#...#.#.#",
          "###.#.#.#.###.#.#",
          "#...#...#.....#.#",
          "#.###########.#E#",
          "#################"
        ]
      }
    ]
  }
];

var GAME11_BEGINNER_QUESTIONS = [
  { id: "G11_Q_1", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ (noun) ਹੈ?", choicesEn: ["apple", "run", "quick", "under"], choicesPa: ["ਸੇਬ", "ਦੌੜਨਾ", "ਤੇਜ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_2", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ (noun) ਹੈ?", choicesEn: ["teacher", "jump", "slowly", "after"], choicesPa: ["ਅਧਿਆਪਕ", "ਛਾਲ ਮਾਰਨਾ", "ਹੌਲੀ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_3", topic: "nouns", promptEn: "Pick the naming word.", promptPa: "ਨਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["book", "sing", "happy", "behind"], choicesPa: ["ਕਿਤਾਬ", "ਗਾਉਣਾ", "ਖੁਸ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_4", topic: "nouns", promptEn: "Which one is a thing?", promptPa: "ਕਿਹੜਾ ਇਕ ਚੀਜ਼ ਹੈ?", choicesEn: ["table", "dance", "green", "under"], choicesPa: ["ਮੇਜ਼", "ਨੱਚਣਾ", "ਹਰਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_5", topic: "verbs", promptEn: "Which word is an action word?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ (action word) ਹੈ?", choicesEn: ["blue", "jump", "table", "happy"], choicesPa: ["ਨੀਲਾ", "ਛਾਲ ਮਾਰਨਾ", "ਮੇਜ਼", "ਖੁਸ਼"], answerIndex: 1, trackId: "T_ACTIONS" },
  { id: "G11_Q_6", topic: "verbs", promptEn: "Which word shows action?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["run", "small", "school", "under"], choicesPa: ["ਦੌੜਨਾ", "ਛੋਟਾ", "ਸਕੂਲ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_7", topic: "verbs", promptEn: "Pick the verb.", promptPa: "ਕਿਰਿਆ ਚੁਣੋ।", choicesEn: ["sing", "yellow", "park", "behind"], choicesPa: ["ਗਾਉਣਾ", "ਪੀਲਾ", "ਪਾਰਕ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_8", topic: "verbs", promptEn: "Which word tells what to do?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿ ਕੀ ਕਰਨਾ ਹੈ?", choicesEn: ["write", "tall", "bag", "after"], choicesPa: ["ਲਿਖਣਾ", "ਲੰਮਾ", "ਬੈਗ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_9", topic: "adjectives", promptEn: "Which word describes a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਦਾ ਵਰਣਨ ਕਰਦਾ ਹੈ?", choicesEn: ["slow", "eat", "school", "beside"], choicesPa: ["ਹੌਲਾ", "ਖਾਣਾ", "ਸਕੂਲ", "ਨਾਲ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_10", topic: "adjectives", promptEn: "Pick the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["happy", "jump", "book", "under"], choicesPa: ["ਖੁਸ਼", "ਛਾਲ ਮਾਰਨਾ", "ਕਿਤਾਬ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_11", topic: "adjectives", promptEn: "Which word tells what kind?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["red", "run", "teacher", "behind"], choicesPa: ["ਲਾਲ", "ਦੌੜਨਾ", "ਅਧਿਆਪਕ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_12", topic: "adjectives", promptEn: "Which one is an adjective?", promptPa: "ਕਿਹੜਾ ਇਕ ਵਿਸ਼ੇਸ਼ਣ (adjective) ਹੈ?", choicesEn: ["small", "sing", "park", "after"], choicesPa: ["ਛੋਟਾ", "ਗਾਉਣਾ", "ਪਾਰਕ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },

  { id: "G11_Q_13", topic: "articles", promptEn: "Which word is an article?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਲੇਖ (article) ਹੈ?", choicesEn: ["the", "jump", "green", "after"], choicesPa: ["the", "ਛਾਲ ਮਾਰਨਾ", "ਹਰਾ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_14", topic: "articles", promptEn: "Pick the article.", promptPa: "ਲੇਖ (article) ਚੁਣੋ।", choicesEn: ["a", "run", "happy", "under"], choicesPa: ["a", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_15", topic: "articles", promptEn: "Which one is an article?", promptPa: "ਕਿਹੜਾ ਇਕ ਲੇਖ (article) ਹੈ?", choicesEn: ["an", "sing", "school", "behind"], choicesPa: ["an", "ਗਾਉਣਾ", "ਸਕੂਲ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_16", topic: "articles", promptEn: "Choose the small helper word (article).", promptPa: "ਛੋਟਾ ਸਹਾਇਕ ਸ਼ਬਦ (article) ਚੁਣੋ।", choicesEn: ["the", "table", "blue", "after"], choicesPa: ["the", "ਮੇਜ਼", "ਨੀਲਾ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_17", topic: "prepositions", promptEn: "Which word can show place?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਥਾਂ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["behind", "sing", "small", "book"], choicesPa: ["ਪਿੱਛੇ", "ਗਾਉਣਾ", "ਛੋਟਾ", "ਕਿਤਾਬ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_18", topic: "prepositions", promptEn: "Pick the preposition.", promptPa: "ਪੂਰਵ-ਬੋਧਕ (preposition) ਚੁਣੋ।", choicesEn: ["under", "jump", "red", "teacher"], choicesPa: ["ਹੇਠਾਂ", "ਛਾਲ ਮਾਰਨਾ", "ਲਾਲ", "ਅਧਿਆਪਕ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_19", topic: "prepositions", promptEn: "Which one tells position?", promptPa: "ਕਿਹੜਾ ਇਕ ਥਾਂ/ਸਥਿਤੀ ਦੱਸਦਾ ਹੈ?", choicesEn: ["in", "run", "happy", "school"], choicesPa: ["ਵਿੱਚ", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਸਕੂਲ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_20", topic: "prepositions", promptEn: "Choose the place word.", promptPa: "ਥਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["on", "eat", "green", "bag"], choicesPa: ["ਉੱਤੇ", "ਖਾਣਾ", "ਹਰਾ", "ਬੈਗ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_21", topic: "pronouns", promptEn: "Which word is a pronoun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਰਵਨਾਮ (pronoun) ਹੈ?", choicesEn: ["they", "garden", "yellow", "swim"], choicesPa: ["ਉਹ", "ਬਾਗ", "ਪੀਲਾ", "ਤੈਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_22", topic: "pronouns", promptEn: "Pick the pronoun.", promptPa: "ਸਰਵਨਾਮ (pronoun) ਚੁਣੋ।", choicesEn: ["she", "table", "small", "run"], choicesPa: ["ਉਹ (ਲੜਕੀ)", "ਮੇਜ਼", "ਛੋਟਾ", "ਦੌੜਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_23", topic: "pronouns", promptEn: "Which one can replace a noun?", promptPa: "ਕਿਹੜਾ ਇਕ ਨਾਂ ਦੀ ਥਾਂ ਆ ਸਕਦਾ ਹੈ?", choicesEn: ["he", "book", "happy", "under"], choicesPa: ["ਉਹ (ਲੜਕਾ)", "ਕਿਤਾਬ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_24", topic: "pronouns", promptEn: "Choose the pronoun word.", promptPa: "ਸਰਵਨਾਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["we", "park", "blue", "jump"], choicesPa: ["ਅਸੀਂ", "ਪਾਰਕ", "ਨੀਲਾ", "ਛਾਲ ਮਾਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_25", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਹੈ?", choicesEn: ["garden", "eat", "quickly", "after"], choicesPa: ["ਬਾਗ", "ਖਾਣਾ", "ਜਲਦੀ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_26", topic: "nouns", promptEn: "Pick the noun.", promptPa: "ਨਾਂ ਚੁਣੋ।", choicesEn: ["teacher", "run", "happy", "under"], choicesPa: ["ਅਧਿਆਪਕ", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_27", topic: "nouns", promptEn: "Which one names a place?", promptPa: "ਕਿਹੜਾ ਇਕ ਥਾਂ ਦਾ ਨਾਂ ਹੈ?", choicesEn: ["school", "jump", "soft", "behind"], choicesPa: ["ਸਕੂਲ", "ਛਾਲ ਮਾਰਨਾ", "ਨਰਮ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_28", topic: "nouns", promptEn: "Choose the thing word.", promptPa: "ਚੀਜ਼ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["pencil", "sing", "slowly", "after"], choicesPa: ["ਪੈਂਸਿਲ", "ਗਾਉਣਾ", "ਹੌਲੀ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_29", topic: "verbs", promptEn: "Which word is a verb?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕਿਰਿਆ ਹੈ?", choicesEn: ["dance", "yellow", "bag", "under"], choicesPa: ["ਨੱਚਣਾ", "ਪੀਲਾ", "ਬੈਗ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_30", topic: "verbs", promptEn: "Pick the action word.", promptPa: "ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["write", "green", "book", "behind"], choicesPa: ["ਲਿਖਣਾ", "ਹਰਾ", "ਕਿਤਾਬ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_31", topic: "verbs", promptEn: "Which one shows doing?", promptPa: "ਕਿਹੜਾ ਇਕ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["read", "small", "table", "after"], choicesPa: ["ਪੜ੍ਹਨਾ", "ਛੋਟਾ", "ਮੇਜ਼", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_32", topic: "verbs", promptEn: "Choose the verb word.", promptPa: "ਕਿਰਿਆ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["swim", "blue", "park", "under"], choicesPa: ["ਤੈਰਨਾ", "ਨੀਲਾ", "ਪਾਰਕ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_33", topic: "adjectives", promptEn: "Which word is an adjective?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਿਸ਼ੇਸ਼ਣ ਹੈ?", choicesEn: ["bright", "jump", "school", "under"], choicesPa: ["ਚਮਕੀਲਾ", "ਛਾਲ ਮਾਰਨਾ", "ਸਕੂਲ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_34", topic: "adjectives", promptEn: "Pick the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["heavy", "sing", "garden", "after"], choicesPa: ["ਭਾਰੀ", "ਗਾਉਣਾ", "ਬਾਗ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_35", topic: "adjectives", promptEn: "Which one tells what kind?", promptPa: "ਕਿਹੜਾ ਇਕ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["clean", "run", "table", "behind"], choicesPa: ["ਸਾਫ਼", "ਦੌੜਨਾ", "ਮੇਜ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_36", topic: "adjectives", promptEn: "Choose the adjective.", promptPa: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।", choicesEn: ["sweet", "eat", "book", "under"], choicesPa: ["ਮੀਠਾ", "ਖਾਣਾ", "ਕਿਤਾਬ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },

  { id: "G11_Q_37", topic: "articles", promptEn: "Which one is an article?", promptPa: "ਕਿਹੜਾ ਇਕ ਲੇਖ ਹੈ?", choicesEn: ["a", "run", "happy", "under"], choicesPa: ["a", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_38", topic: "articles", promptEn: "Pick the article.", promptPa: "ਲੇਖ ਚੁਣੋ।", choicesEn: ["the", "jump", "blue", "behind"], choicesPa: ["the", "ਛਾਲ ਮਾਰਨਾ", "ਨੀਲਾ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_39", topic: "articles", promptEn: "Choose the helper article.", promptPa: "ਸਹਾਇਕ ਲੇਖ ਚੁਣੋ।", choicesEn: ["an", "sing", "park", "after"], choicesPa: ["an", "ਗਾਉਣਾ", "ਪਾਰਕ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_40", topic: "articles", promptEn: "Which word is article only?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਿਰਫ਼ ਲੇਖ ਹੈ?", choicesEn: ["the", "book", "tall", "under"], choicesPa: ["the", "ਕਿਤਾਬ", "ਲੰਮਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_41", topic: "prepositions", promptEn: "Which word shows place?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਥਾਂ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["behind", "write", "small", "bag"], choicesPa: ["ਪਿੱਛੇ", "ਲਿਖਣਾ", "ਛੋਟਾ", "ਬੈਗ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_42", topic: "prepositions", promptEn: "Pick the preposition.", promptPa: "ਪੂਰਵ-ਬੋਧਕ ਚੁਣੋ।", choicesEn: ["under", "run", "happy", "book"], choicesPa: ["ਹੇਠਾਂ", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਕਿਤਾਬ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_43", topic: "prepositions", promptEn: "Which one can tell position?", promptPa: "ਕਿਹੜਾ ਇਕ ਸਥਿਤੀ ਦੱਸ ਸਕਦਾ ਹੈ?", choicesEn: ["in", "eat", "green", "table"], choicesPa: ["ਵਿੱਚ", "ਖਾਣਾ", "ਹਰਾ", "ਮੇਜ਼"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_44", topic: "prepositions", promptEn: "Choose the place relation word.", promptPa: "ਥਾਂ ਦਾ ਸੰਬੰਧ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["on", "jump", "yellow", "park"], choicesPa: ["ਉੱਤੇ", "ਛਾਲ ਮਾਰਨਾ", "ਪੀਲਾ", "ਪਾਰਕ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_45", topic: "pronouns", promptEn: "Which word is a pronoun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਰਵਨਾਮ ਹੈ?", choicesEn: ["they", "garden", "blue", "run"], choicesPa: ["ਉਹ", "ਬਾਗ", "ਨੀਲਾ", "ਦੌੜਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_46", topic: "pronouns", promptEn: "Pick the pronoun.", promptPa: "ਸਰਵਨਾਮ ਚੁਣੋ।", choicesEn: ["we", "book", "small", "sing"], choicesPa: ["ਅਸੀਂ", "ਕਿਤਾਬ", "ਛੋਟਾ", "ਗਾਉਣਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_47", topic: "pronouns", promptEn: "Which one replaces a name?", promptPa: "ਕਿਹੜਾ ਇਕ ਨਾਮ ਦੀ ਥਾਂ ਲੈਂਦਾ ਹੈ?", choicesEn: ["he", "table", "happy", "under"], choicesPa: ["ਉਹ (ਲੜਕਾ)", "ਮੇਜ਼", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_48", topic: "pronouns", promptEn: "Choose the pronoun word.", promptPa: "ਸਰਵਨਾਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["she", "park", "green", "jump"], choicesPa: ["ਉਹ (ਲੜਕੀ)", "ਪਾਰਕ", "ਹਰਾ", "ਛਾਲ ਮਾਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_49", topic: "nouns", promptEn: "Choose the noun.", promptPa: "ਨਾਂ ਚੁਣੋ।", choicesEn: ["river", "sing", "soft", "under"], choicesPa: ["ਨਦੀ", "ਗਾਉਣਾ", "ਨਰਮ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_50", topic: "nouns", promptEn: "Which is a naming word?", promptPa: "ਕਿਹੜਾ ਨਾਂ ਵਾਲਾ ਸ਼ਬਦ ਹੈ?", choicesEn: ["family", "run", "green", "after"], choicesPa: ["ਪਰਿਵਾਰ", "ਦੌੜਨਾ", "ਹਰਾ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_51", topic: "nouns", promptEn: "Pick the person/place/thing word.", promptPa: "ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["market", "jump", "happy", "behind"], choicesPa: ["ਬਜ਼ਾਰ", "ਛਾਲ ਮਾਰਨਾ", "ਖੁਸ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_52", topic: "nouns", promptEn: "Which one is a noun?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਨਾਂ ਹੈ?", choicesEn: ["cookie", "swim", "quickly", "in"], choicesPa: ["ਬਿਸਕੁਟ", "ਤੈਰਨਾ", "ਜਲਦੀ", "ਵਿੱਚ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_53", topic: "verbs", promptEn: "Pick the verb.", promptPa: "ਕਿਰਿਆ ਚੁਣੋ।", choicesEn: ["clap", "yellow", "park", "on"], choicesPa: ["ਤਾਲੀ ਮਾਰਨਾ", "ਪੀਲਾ", "ਪਾਰਕ", "ਉੱਤੇ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_54", topic: "verbs", promptEn: "Which word tells action?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਦੱਸਦਾ ਹੈ?", choicesEn: ["cook", "small", "garden", "under"], choicesPa: ["ਪਕਾਉਣਾ", "ਛੋਟਾ", "ਬਾਗ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_55", topic: "verbs", promptEn: "Choose the doing word.", promptPa: "ਕੰਮ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["open", "blue", "table", "after"], choicesPa: ["ਖੋਲ੍ਹਣਾ", "ਨੀਲਾ", "ਮੇਜ਼", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_56", topic: "verbs", promptEn: "Which one is a verb?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਕਿਰਿਆ ਹੈ?", choicesEn: ["laugh", "happy", "school", "behind"], choicesPa: ["ਹੱਸਣਾ", "ਖੁਸ਼", "ਸਕੂਲ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_57", topic: "adjectives", promptEn: "Choose the adjective.", promptPa: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।", choicesEn: ["bright", "run", "teacher", "on"], choicesPa: ["ਚਮਕੀਲਾ", "ਦੌੜਨਾ", "ਅਧਿਆਪਕ", "ਉੱਤੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_58", topic: "adjectives", promptEn: "Which word describes?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਰਣਨ ਕਰਦਾ ਹੈ?", choicesEn: ["quiet", "eat", "bag", "under"], choicesPa: ["ਸ਼ਾਂਤ", "ਖਾਣਾ", "ਬੈਗ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_59", topic: "adjectives", promptEn: "Pick the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["warm", "sing", "park", "after"], choicesPa: ["ਗਰਮ", "ਗਾਉਣਾ", "ਪਾਰਕ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_60", topic: "adjectives", promptEn: "Which one tells what kind?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["strong", "jump", "book", "in"], choicesPa: ["ਮਜ਼ਬੂਤ", "ਛਾਲ ਮਾਰਨਾ", "ਕਿਤਾਬ", "ਵਿੱਚ"], answerIndex: 0, trackId: "T_DESCRIBE" },

  { id: "G11_Q_61", topic: "articles", promptEn: "Pick the article word.", promptPa: "ਲੇਖ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["the", "run", "blue", "under"], choicesPa: ["the", "ਦੌੜਨਾ", "ਨੀਲਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_62", topic: "articles", promptEn: "Which one is article?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਲੇਖ ਹੈ?", choicesEn: ["a", "eat", "happy", "behind"], choicesPa: ["a", "ਖਾਣਾ", "ਖੁਸ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_63", topic: "articles", promptEn: "Choose the tiny helper word.", promptPa: "ਛੋਟਾ ਸਹਾਇਕ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["an", "sing", "table", "after"], choicesPa: ["an", "ਗਾਉਣਾ", "ਮੇਜ਼", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_64", topic: "articles", promptEn: "Pick the article.", promptPa: "ਲੇਖ ਚੁਣੋ।", choicesEn: ["the", "jump", "small", "on"], choicesPa: ["the", "ਛਾਲ ਮਾਰਨਾ", "ਛੋਟਾ", "ਉੱਤੇ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_65", topic: "prepositions", promptEn: "Choose the preposition.", promptPa: "ਪੂਰਵ-ਬੋਧਕ ਚੁਣੋ।", choicesEn: ["near", "run", "yellow", "book"], choicesPa: ["ਨੇੜੇ", "ਦੌੜਨਾ", "ਪੀਲਾ", "ਕਿਤਾਬ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_66", topic: "prepositions", promptEn: "Which word shows position?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਥਿਤੀ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["between", "eat", "green", "bag"], choicesPa: ["ਵਿਚਕਾਰ", "ਖਾਣਾ", "ਹਰਾ", "ਬੈਗ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_67", topic: "prepositions", promptEn: "Pick the place word.", promptPa: "ਥਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["inside", "sing", "happy", "table"], choicesPa: ["ਅੰਦਰ", "ਗਾਉਣਾ", "ਖੁਸ਼", "ਮੇਜ਼"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_68", topic: "prepositions", promptEn: "Which one is preposition?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਪੂਰਵ-ਬੋਧਕ ਹੈ?", choicesEn: ["outside", "jump", "blue", "park"], choicesPa: ["ਬਾਹਰ", "ਛਾਲ ਮਾਰਨਾ", "ਨੀਲਾ", "ਪਾਰਕ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_69", topic: "pronouns", promptEn: "Choose the pronoun.", promptPa: "ਸਰਵਨਾਮ ਚੁਣੋ।", choicesEn: ["I", "garden", "small", "run"], choicesPa: ["ਮੈਂ", "ਬਾਗ", "ਛੋਟਾ", "ਦੌੜਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_70", topic: "pronouns", promptEn: "Which one can replace a noun?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਨਾਂ ਦੀ ਥਾਂ ਆ ਸਕਦਾ ਹੈ?", choicesEn: ["you", "book", "green", "sing"], choicesPa: ["ਤੂੰ/ਤੁਸੀਂ", "ਕਿਤਾਬ", "ਹਰਾ", "ਗਾਉਣਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_71", topic: "pronouns", promptEn: "Pick the pronoun word.", promptPa: "ਸਰਵਨਾਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["it", "table", "happy", "under"], choicesPa: ["ਇਹ/ਉਹ", "ਮੇਜ਼", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_72", topic: "pronouns", promptEn: "Which word is pronoun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਰਵਨਾਮ ਹੈ?", choicesEn: ["they", "park", "blue", "jump"], choicesPa: ["ਉਹ", "ਪਾਰਕ", "ਨੀਲਾ", "ਛਾਲ ਮਾਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_73", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਹੈ?", choicesEn: ["river", "run", "slow", "under"], choicesPa: ["ਨਦੀ", "ਦੌੜਨਾ", "ਹੌਲਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_74", topic: "nouns", promptEn: "Pick the noun.", promptPa: "ਨਾਂ ਚੁਣੋ।", choicesEn: ["student", "jump", "quickly", "after"], choicesPa: ["ਵਿਦਿਆਰਥੀ", "ਛਾਲ ਮਾਰਨਾ", "ਜਲਦੀ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_75", topic: "nouns", promptEn: "Which word names a thing?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੈ?", choicesEn: ["house", "sing", "happy", "behind"], choicesPa: ["ਘਰ", "ਗਾਉਣਾ", "ਖੁਸ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_76", topic: "nouns", promptEn: "Choose the place word.", promptPa: "ਥਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["city", "eat", "green", "under"], choicesPa: ["ਸ਼ਹਿਰ", "ਖਾਣਾ", "ਹਰਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_77", topic: "verbs", promptEn: "Which word shows action?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["dance", "yellow", "chair", "under"], choicesPa: ["ਨੱਚਣਾ", "ਪੀਲਾ", "ਕੁਰਸੀ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_78", topic: "verbs", promptEn: "Pick the verb.", promptPa: "ਕਿਰਿਆ ਚੁਣੋ।", choicesEn: ["write", "blue", "garden", "after"], choicesPa: ["ਲਿਖਣਾ", "ਨੀਲਾ", "ਬਾਗ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_79", topic: "verbs", promptEn: "Which word tells what to do?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿ ਕੀ ਕਰਨਾ ਹੈ?", choicesEn: ["sleep", "tall", "book", "behind"], choicesPa: ["ਸੌਣਾ", "ਲੰਮਾ", "ਕਿਤਾਬ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_80", topic: "verbs", promptEn: "Choose the doing word.", promptPa: "ਕੰਮ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["swim", "small", "school", "under"], choicesPa: ["ਤੈਰਨਾ", "ਛੋਟਾ", "ਸਕੂਲ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_81", topic: "adjectives", promptEn: "Which word describes?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਰਣਨ ਕਰਦਾ ਹੈ?", choicesEn: ["tall", "run", "teacher", "after"], choicesPa: ["ਲੰਮਾ", "ਦੌੜਨਾ", "ਅਧਿਆਪਕ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_82", topic: "adjectives", promptEn: "Pick the adjective.", promptPa: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।", choicesEn: ["soft", "sing", "park", "under"], choicesPa: ["ਨਰਮ", "ਗਾਉਣਾ", "ਪਾਰਕ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_83", topic: "adjectives", promptEn: "Which one tells what kind?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["bright", "eat", "bag", "behind"], choicesPa: ["ਚਮਕੀਲਾ", "ਖਾਣਾ", "ਬੈਗ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_84", topic: "adjectives", promptEn: "Choose the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["cold", "jump", "book", "after"], choicesPa: ["ਠੰਡਾ", "ਛਾਲ ਮਾਰਨਾ", "ਕਿਤਾਬ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },

  { id: "G11_Q_85", topic: "articles", promptEn: "Which word is an article?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਲੇਖ ਹੈ?", choicesEn: ["a", "run", "happy", "under"], choicesPa: ["a", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_86", topic: "articles", promptEn: "Pick the article word.", promptPa: "ਲੇਖ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["an", "sing", "table", "behind"], choicesPa: ["an", "ਗਾਉਣਾ", "ਮੇਜ਼", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_87", topic: "articles", promptEn: "Choose the article.", promptPa: "ਲੇਖ ਚੁਣੋ।", choicesEn: ["the", "jump", "green", "after"], choicesPa: ["the", "ਛਾਲ ਮਾਰਨਾ", "ਹਰਾ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_88", topic: "articles", promptEn: "Which one is an article?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਲੇਖ ਹੈ?", choicesEn: ["the", "book", "tall", "under"], choicesPa: ["the", "ਕਿਤਾਬ", "ਲੰਮਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_89", topic: "prepositions", promptEn: "Which word shows place?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਥਾਂ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["above", "eat", "blue", "book"], choicesPa: ["ਉੱਪਰ", "ਖਾਣਾ", "ਨੀਲਾ", "ਕਿਤਾਬ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_90", topic: "prepositions", promptEn: "Pick the preposition.", promptPa: "ਪੂਰਵ-ਬੋਧਕ ਚੁਣੋ।", choicesEn: ["between", "run", "happy", "table"], choicesPa: ["ਵਿਚਕਾਰ", "ਦੌੜਨਾ", "ਖੁਸ਼", "ਮੇਜ਼"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_91", topic: "prepositions", promptEn: "Which one tells position?", promptPa: "ਕਿਹੜਾ ਇਕ ਸਥਿਤੀ ਦੱਸਦਾ ਹੈ?", choicesEn: ["inside", "jump", "green", "park"], choicesPa: ["ਅੰਦਰ", "ਛਾਲ ਮਾਰਨਾ", "ਹਰਾ", "ਪਾਰਕ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_92", topic: "prepositions", promptEn: "Choose the place word.", promptPa: "ਥਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["around", "sing", "small", "under"], choicesPa: ["ਚਾਰਾਂ ਪਾਸੇ", "ਗਾਉਣਾ", "ਛੋਟਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_93", topic: "pronouns", promptEn: "Which word is a pronoun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਰਵਨਾਮ ਹੈ?", choicesEn: ["they", "garden", "yellow", "swim"], choicesPa: ["ਉਹ", "ਬਾਗ", "ਪੀਲਾ", "ਤੈਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_94", topic: "pronouns", promptEn: "Pick the pronoun.", promptPa: "ਸਰਵਨਾਮ ਚੁਣੋ।", choicesEn: ["she", "table", "small", "run"], choicesPa: ["ਉਹ (ਲੜਕੀ)", "ਮੇਜ਼", "ਛੋਟਾ", "ਦੌੜਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_95", topic: "pronouns", promptEn: "Which one can replace a noun?", promptPa: "ਕਿਹੜਾ ਇਕ ਨਾਂ ਦੀ ਥਾਂ ਆ ਸਕਦਾ ਹੈ?", choicesEn: ["him", "book", "happy", "under"], choicesPa: ["ਉਸਨੂੰ", "ਕਿਤਾਬ", "ਖੁਸ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_96", topic: "pronouns", promptEn: "Choose the pronoun word.", promptPa: "ਸਰਵਨਾਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["we", "park", "blue", "jump"], choicesPa: ["ਅਸੀਂ", "ਪਾਰਕ", "ਨੀਲਾ", "ਛਾਲ ਮਾਰਨਾ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_97", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਹੈ?", choicesEn: ["runner", "run", "quick", "under"], choicesPa: ["ਦੌੜਾਕ", "ਦੌੜਨਾ", "ਤੇਜ਼", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_98", topic: "nouns", promptEn: "Pick the naming word.", promptPa: "ਨਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["teacher", "teach", "teaching", "after"], choicesPa: ["ਅਧਿਆਪਕ", "ਪੜ੍ਹਾਉਣਾ", "ਪੜ੍ਹਾਉਣਾ (ਕਿਰਿਆ)", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_99", topic: "nouns", promptEn: "Which word names a place?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਥਾਂ ਦਾ ਨਾਂ ਹੈ?", choicesEn: ["market", "mark", "marked", "under"], choicesPa: ["ਬਜ਼ਾਰ", "ਨਿਸ਼ਾਨ ਲਗਾਉਣਾ", "ਨਿਸ਼ਾਨ ਲਾਇਆ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_100", topic: "nouns", promptEn: "Choose the thing word.", promptPa: "ਚੀਜ਼ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["bottle", "bottled", "bottle up", "behind"], choicesPa: ["ਬੋਤਲ", "ਬੰਦ ਕੀਤਾ", "ਦਬਾਉਣਾ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_101", topic: "verbs", promptEn: "Which word shows action?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["paint", "painted", "painter", "under"], choicesPa: ["ਰੰਗਣਾ", "ਰੰਗਿਆ", "ਚਿੱਤਰਕਾਰ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_102", topic: "verbs", promptEn: "Pick the verb.", promptPa: "ਕਿਰਿਆ ਚੁਣੋ।", choicesEn: ["swim", "swimmer", "swimming", "after"], choicesPa: ["ਤੈਰਨਾ", "ਤੈਰਾਕ", "ਤੈਰਨਾ (ਕਿਰਿਆ)", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_103", topic: "verbs", promptEn: "Which word tells what to do?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿ ਕੀ ਕਰਨਾ ਹੈ?", choicesEn: ["build", "builder", "building", "under"], choicesPa: ["ਬਣਾਉਣਾ", "ਨਿਰਮਾਤਾ", "ਇਮਾਰਤ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_104", topic: "verbs", promptEn: "Choose the doing word.", promptPa: "ਕੰਮ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["clean", "cleaner", "cleaning", "behind"], choicesPa: ["ਸਾਫ਼ ਕਰਨਾ", "ਸਫਾਈ ਕਰਤਾ", "ਸਫਾਈ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_105", topic: "adjectives", promptEn: "Which word describes?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਰਣਨ ਕਰਦਾ ਹੈ?", choicesEn: ["shiny", "shine", "shining", "under"], choicesPa: ["ਚਮਕੀਲਾ", "ਚਮਕਣਾ", "ਚਮਕਦਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_106", topic: "adjectives", promptEn: "Pick the adjective.", promptPa: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।", choicesEn: ["sleepy", "sleep", "sleeper", "after"], choicesPa: ["ਉਂਘਿਆ", "ਸੌਣਾ", "ਸੋਣ ਵਾਲਾ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_107", topic: "adjectives", promptEn: "Which one tells what kind?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["noisy", "noise", "noises", "behind"], choicesPa: ["ਸ਼ੋਰ ਵਾਲਾ", "ਸ਼ੋਰ", "ਸ਼ੋਰ (ਬਹੁਵਚਨ)", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_108", topic: "adjectives", promptEn: "Choose the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["gentle", "gently", "gentleness", "under"], choicesPa: ["ਨਰਮ", "ਨਰਮੀ ਨਾਲ", "ਨਰਮੀ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },

  { id: "G11_Q_109", topic: "articles", promptEn: "Which word is an article?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਲੇਖ ਹੈ?", choicesEn: ["an", "and", "any", "after"], choicesPa: ["an", "ਅਤੇ", "ਕੋਈ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_110", topic: "articles", promptEn: "Pick the article word.", promptPa: "ਲੇਖ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["a", "at", "as", "under"], choicesPa: ["a", "ਤੇ", "ਵਾਂਗ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_111", topic: "pronouns", promptEn: "Which word is a pronoun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਸਰਵਨਾਮ ਹੈ?", choicesEn: ["hers", "her", "here", "after"], choicesPa: ["ਉਸਦੀ (ਇਸਦਾ)", "ਉਸਨੂੰ", "ਇੱਥੇ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_SENTENCE" },
  { id: "G11_Q_112", topic: "pronouns", promptEn: "Pick the pronoun.", promptPa: "ਸਰਵਨਾਮ ਚੁਣੋ।", choicesEn: ["them", "then", "there", "under"], choicesPa: ["ਉਹਨਾਂ ਨੂੰ", "ਫਿਰ", "ਉੱਥੇ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_SENTENCE" },

  { id: "G11_Q_113", topic: "nouns", promptEn: "Which word is a noun?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਨਾਂ ਹੈ?", choicesEn: ["driver", "drive", "driving", "after"], choicesPa: ["ਡਰਾਈਵਰ", "ਚਲਾਉਣਾ", "ਚਲਾਉਣਾ (ਕਿਰਿਆ)", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_114", topic: "nouns", promptEn: "Pick the naming word.", promptPa: "ਨਾਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["player", "play", "playing", "under"], choicesPa: ["ਖਿਡਾਰੀ", "ਖੇਡਣਾ", "ਖੇਡਣਾ (ਕਿਰਿਆ)", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_115", topic: "nouns", promptEn: "Which word names a person?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਿਅਕਤੀ ਦਾ ਨਾਂ ਹੈ?", choicesEn: ["baker", "bake", "baked", "behind"], choicesPa: ["ਬੇਕਰ", "ਬੇਕ ਕਰਨਾ", "ਬੇਕ ਕੀਤਾ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_WORDS" },
  { id: "G11_Q_116", topic: "nouns", promptEn: "Choose the thing word.", promptPa: "ਚੀਜ਼ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["ticket", "tick", "ticking", "under"], choicesPa: ["ਟਿਕਟ", "ਟਿਕ ਕਰਨਾ", "ਟਿਕਟਿਕ ਕਰਨਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_WORDS" },

  { id: "G11_Q_117", topic: "verbs", promptEn: "Which word shows action?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਕੰਮ ਦਿਖਾਉਂਦਾ ਹੈ?", choicesEn: ["arrive", "arrival", "arriving", "after"], choicesPa: ["ਪਹੁੰਚਣਾ", "ਪਹੁੰਚ", "ਪਹੁੰਚਣਾ (ਕਿਰਿਆ)", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_118", topic: "verbs", promptEn: "Pick the verb.", promptPa: "ਕਿਰਿਆ ਚੁਣੋ।", choicesEn: ["listen", "listener", "listening", "under"], choicesPa: ["ਸੁਣਨਾ", "ਸੁਣਨ ਵਾਲਾ", "ਸੁਣਨਾ (ਕਿਰਿਆ)", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_119", topic: "verbs", promptEn: "Which word tells what to do?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਦੱਸਦਾ ਹੈ ਕਿ ਕੀ ਕਰਨਾ ਹੈ?", choicesEn: ["carry", "carrier", "carrying", "behind"], choicesPa: ["ਢੋਣਾ", "ਢੋਣ ਵਾਲਾ", "ਢੋਣਾ (ਕਿਰਿਆ)", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_ACTIONS" },
  { id: "G11_Q_120", topic: "verbs", promptEn: "Choose the doing word.", promptPa: "ਕੰਮ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["choose", "choice", "chosen", "under"], choicesPa: ["ਚੁਣਨਾ", "ਚੋਣ", "ਚੁਣਿਆ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_ACTIONS" },

  { id: "G11_Q_121", topic: "adjectives", promptEn: "Which word describes?", promptPa: "ਕਿਹੜਾ ਸ਼ਬਦ ਵਰਣਨ ਕਰਦਾ ਹੈ?", choicesEn: ["careful", "care", "carefully", "after"], choicesPa: ["ਸਾਵਧਾਨ", "ਸੰਭਾਲ", "ਸਾਵਧਾਨੀ ਨਾਲ", "ਬਾਅਦ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_122", topic: "adjectives", promptEn: "Pick the adjective.", promptPa: "ਵਿਸ਼ੇਸ਼ਣ ਚੁਣੋ।", choicesEn: ["cloudy", "cloud", "clouding", "under"], choicesPa: ["ਧੁੰਦਲਾ", "ਬੱਦਲ", "ਧੁੰਦ ਪਾਉਣਾ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_123", topic: "adjectives", promptEn: "Which one tells what kind?", promptPa: "ਕਿਹੜਾ ਇੱਕ ਦੱਸਦਾ ਹੈ ਕਿਹੋ ਜਿਹਾ?", choicesEn: ["tidy", "tidy up", "tidiness", "behind"], choicesPa: ["ਸੁਥਰਾ", "ਸੁਧਾਰਨਾ", "ਸੁਥਰਾਪਣ", "ਪਿੱਛੇ"], answerIndex: 0, trackId: "T_DESCRIBE" },
  { id: "G11_Q_124", topic: "adjectives", promptEn: "Choose the describing word.", promptPa: "ਵਰਣਨ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।", choicesEn: ["brave", "bravery", "bravely", "under"], choicesPa: ["ਬਹਾਦਰ", "ਬਹਾਦਰੀ", "ਬਹਾਦਰੀ ਨਾਲ", "ਹੇਠਾਂ"], answerIndex: 0, trackId: "T_DESCRIBE" }
];

var RAW_GAME12_STORY_SEEDS = [
  {
    id: "G12_S_1",
    title: "School Morning",
    trackId: "T_SENTENCE",
    difficulty: 1,
    mistakes: [
      { wrong: "Ria go to school in the morning.", fix: "Ria goes to school in the morning.", explainEn: "Use 'goes' with singular subject 'Ria'." },
      { wrong: "She read a story in class.", fix: "She reads a story in class.", explainEn: "In present simple, 'she' takes verb + s." },
      { wrong: "After lunch she play with friends.", fix: "After lunch, she plays with friends.", explainEn: "Add a comma after intro phrase and use 'plays' with 'she'." }
    ]
  },
  {
    id: "G12_S_2",
    title: "Library Visit",
    trackId: "T_READING",
    difficulty: 2,
    mistakes: [
      { wrong: "The library open at ten o'clock.", fix: "The library opens at ten o'clock.", explainEn: "Use 'opens' with singular subject 'library'." },
      { wrong: "Maya are looking for a science book.", fix: "Maya is looking for a science book.", explainEn: "Use 'is' with singular subject 'Maya'." },
      { wrong: "She return the book before leaving.", fix: "She returns the book before leaving.", explainEn: "Use present simple 'returns' with 'she'." }
    ]
  },
  {
    id: "G12_S_3",
    title: "Rainy Day",
    trackId: "T_ACTIONS",
    difficulty: 2,
    mistakes: [
      { wrong: "It rain heavily in the afternoon.", fix: "It rains heavily in the afternoon.", explainEn: "Use 'rains' with subject 'it'." },
      { wrong: "The children was inside the house.", fix: "The children were inside the house.", explainEn: "Use 'were' with plural subject 'children'." },
      { wrong: "They makes hot tea for everyone.", fix: "They make hot tea for everyone.", explainEn: "Use base verb 'make' with plural subject 'they'." }
    ]
  },
  {
    id: "G12_S_4",
    title: "Market Trip",
    trackId: "T_WORDS",
    difficulty: 3,
    mistakes: [
      { wrong: "Aman buy two apples and one banana.", fix: "Aman buys two apples and one banana.", explainEn: "Use 'buys' with singular subject 'Aman'." },
      { wrong: "The shopkeeper give him a small discount.", fix: "The shopkeeper gives him a small discount.", explainEn: "Use 'gives' with singular subject 'shopkeeper'." },
      { wrong: "He carry the bags back to home.", fix: "He carries the bags back home.", explainEn: "Use 'carries' with 'he' and natural phrase is 'back home'." }
    ]
  },
  {
    id: "G12_S_5",
    title: "Morning Bus Stop",
    trackId: "T_SENTENCE",
    difficulty: 1,
    mistakes: [
      { wrong: "Karan wait for the bus every day.", fix: "Karan waits for the bus every day.", explainEn: "Use 'waits' with singular subject 'Karan'." },
      { wrong: "His sister carry a water bottle.", fix: "His sister carries a water bottle.", explainEn: "Use 'carries' with singular subject 'sister'." },
      { wrong: "The bus arrive on time most days.", fix: "The bus arrives on time most days.", explainEn: "Use 'arrives' with singular subject 'bus'." }
    ]
  },
  {
    id: "G12_S_6",
    title: "Classroom Cleanup",
    trackId: "T_ACTIONS",
    difficulty: 2,
    mistakes: [
      { wrong: "The monitor check the desks after school.", fix: "The monitor checks the desks after school.", explainEn: "Use 'checks' with singular subject 'monitor'." },
      { wrong: "Two students was wiping the board.", fix: "Two students were wiping the board.", explainEn: "Use 'were' with plural subject 'students'." },
      { wrong: "The teacher remind everyone about homework.", fix: "The teacher reminds everyone about homework.", explainEn: "Use 'reminds' with singular subject 'teacher'." }
    ]
  },
  {
    id: "G12_S_7",
    title: "Family Dinner",
    trackId: "T_READING",
    difficulty: 1,
    mistakes: [
      { wrong: "Mother cook dal in the evening.", fix: "Mother cooks dal in the evening.", explainEn: "Use 'cooks' with singular subject 'Mother'." },
      { wrong: "My brothers is setting the table.", fix: "My brothers are setting the table.", explainEn: "Use 'are' with plural subject 'brothers'." },
      { wrong: "Father serve food after prayer.", fix: "Father serves food after prayer.", explainEn: "Use 'serves' with singular subject 'Father'." }
    ]
  },
  {
    id: "G12_S_8",
    title: "Park Practice",
    trackId: "T_DESCRIBE",
    difficulty: 3,
    mistakes: [
      { wrong: "Coach teach us new drills every Saturday.", fix: "Coach teaches us new drills every Saturday.", explainEn: "Use 'teaches' with singular subject 'Coach'." },
      { wrong: "One player run faster than the others.", fix: "One player runs faster than the others.", explainEn: "Use 'runs' with singular subject 'player'." },
      { wrong: "After practice we drinks lemon water.", fix: "After practice, we drink lemon water.", explainEn: "Use comma after introductory phrase and base verb 'drink' with 'we'." }
    ]
  }
];

function _boloDedupeKeepLatest(list, keyFn) {
  if (!Array.isArray(list)) return [];
  var seen = {};
  var kept = [];
  var i;
  for (i = list.length - 1; i >= 0; i--) {
    var row = list[i];
    var key;
    try {
      key = keyFn(row, i);
    } catch (e) {
      key = String(i);
    }
    if (key == null || key === "") key = String(i);
    key = String(key);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      kept.push(row);
    }
  }
  kept.reverse();
  return kept;
}

if (typeof GAME1_QUESTIONS !== "undefined") {
  GAME1_QUESTIONS = _boloDedupeKeepLatest(GAME1_QUESTIONS, function(row) {
    var sentence = String((row && row.sentence) == null ? "" : row.sentence).replace(/^\s+|\s+$/g, "").toLowerCase();
    var question = String((row && row.question) == null ? "" : row.question).replace(/^\s+|\s+$/g, "").toLowerCase();
    var correctWord = String((row && row.correctWord) == null ? "" : row.correctWord).replace(/^\s+|\s+$/g, "").toLowerCase();
    var trackId = String((row && row.trackId) == null ? "" : row.trackId).replace(/^\s+|\s+$/g, "").toLowerCase();
    return sentence + "|" + question + "|" + correctWord + "|" + trackId;
  });
}
if (typeof GAME2_QUESTIONS !== "undefined") {
  GAME2_QUESTIONS = _boloDedupeKeepLatest(GAME2_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof GAME3_QUESTIONS !== "undefined") {
  GAME3_QUESTIONS = _boloDedupeKeepLatest(GAME3_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof GAME4_QUESTIONS !== "undefined") {
  GAME4_QUESTIONS = _boloDedupeKeepLatest(GAME4_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof RAW_GAME5_QUESTIONS !== "undefined") {
  RAW_GAME5_QUESTIONS = _boloDedupeKeepLatest(RAW_GAME5_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof RAW_GAME6_QUESTIONS !== "undefined") {
  RAW_GAME6_QUESTIONS = _boloDedupeKeepLatest(RAW_GAME6_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof GAME8_QUESTIONS !== "undefined") {
  GAME8_QUESTIONS = _boloDedupeKeepLatest(GAME8_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof GAME10_QUESTIONS !== "undefined") {
  GAME10_QUESTIONS = _boloDedupeKeepLatest(GAME10_QUESTIONS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}
if (typeof RAW_GAME12_STORY_SEEDS !== "undefined") {
  RAW_GAME12_STORY_SEEDS = _boloDedupeKeepLatest(RAW_GAME12_STORY_SEEDS, function(row) {
    return row && row.id ? row.id : JSON.stringify(row);
  });
}

// Unified game data registry for sanity checks and counts
var GAMES_DATA = {
  GAME1: GAME1_QUESTIONS,
  GAME2: (typeof GAME2_QUESTIONS !== "undefined") ? GAME2_QUESTIONS : [],
  GAME3: (typeof GAME3_QUESTIONS !== "undefined") ? GAME3_QUESTIONS : [],
  GAME4: (typeof GAME4_QUESTIONS !== "undefined") ? GAME4_QUESTIONS : [],
  GAME5: RAW_GAME5_QUESTIONS,
  GAME6: RAW_GAME6_QUESTIONS,
  GAME11: {
    sets: (typeof GAME11_MAZE_SETS !== "undefined") ? GAME11_MAZE_SETS : [],
    questions: (typeof GAME11_BEGINNER_QUESTIONS !== "undefined") ? GAME11_BEGINNER_QUESTIONS : []
  },
  GAME12: (typeof RAW_GAME12_STORY_SEEDS !== "undefined") ? RAW_GAME12_STORY_SEEDS : [],
  GAME8: (typeof GAME8_QUESTIONS !== "undefined") ? GAME8_QUESTIONS : [],
  GAME10: (typeof GAME10_QUESTIONS !== "undefined") ? GAME10_QUESTIONS : []
};

