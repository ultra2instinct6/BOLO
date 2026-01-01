// BOLO Games Data (minimal, boot-safe)
//
// This file exists to keep the app bootable if app/data/games.js is corrupted.
// It defines the required globals:
// - GAME1_QUESTIONS, GAME2_QUESTIONS, GAME3_QUESTIONS, GAME4_QUESTIONS
// - RAW_GAME5_QUESTIONS
// - GAMES_DATA
// - buildAllGameQuestions()
//
// IMPORTANT: Vanilla script (no imports/exports). Loaded before app/js/*.js.

// -------------------- RAW BANKS (author-friendly) --------------------

// Game 1: Tap the Word
// Schema: { sentence, question, correctWord, trackId, hintEn?, hintPa?, explanationEn?, explanationPa? }
var GAME1_QUESTIONS = [
  { sentence: "The cat drinks milk.", question: "Tap the noun", correctWord: "cat", trackId: "T_WORDS" },
  { sentence: "They play in the park.", question: "Tap the verb", correctWord: "play", trackId: "T_ACTIONS" },
  { sentence: "The red kite is high.", question: "Tap the adjective", correctWord: "red", trackId: "T_DESCRIBE" },
  { sentence: "She walks to school daily.", question: "Tap the adverb", correctWord: "daily", trackId: "T_ACTIONS" },
  { sentence: "The book is on the table.", question: "Tap the preposition", correctWord: "on", trackId: "T_SENTENCE" },
  { sentence: "A dog and a cat run.", question: "Tap the conjunction", correctWord: "and", trackId: "T_SENTENCE" }
];

// Game 2: Word Type (Parts of Speech)
// Schema: { word, correctPartId, trackId, hintEn?, hintPa?, explanationEn?, explanationPa? }
var GAME2_QUESTIONS = [
  { trackId: "T_WORDS", word: "teacher", correctPartId: "noun" },
  { trackId: "T_ACTIONS", word: "run", correctPartId: "verb" },
  { trackId: "T_DESCRIBE", word: "happy", correctPartId: "adjective" },
  { trackId: "T_SENTENCE", word: "quickly", correctPartId: "adverb" },
  { trackId: "T_SENTENCE", word: "and", correctPartId: "conjunction" }
];

// Game 3: Tense Detective
// Schema: { sentence, correctTense: "present"|"past"|"future", trackId? }
var GAME3_QUESTIONS = [
  { trackId: "T_ACTIONS", sentence: "I play soccer every day.", correctTense: "present" },
  { trackId: "T_ACTIONS", sentence: "She jumped yesterday.", correctTense: "past" },
  { trackId: "T_ACTIONS", sentence: "They will visit tomorrow.", correctTense: "future" }
];

// Game 4: Sentence Check (pick correct sentence)
// Schema: { trackId, options: [a,b], optionsPa?: [aPa,bPa], correct: one of options, hintEn?, hintPa?, explanationEn?, explanationPa? }
var GAME4_QUESTIONS = [
  {
    trackId: "T_ACTIONS",
    options: ["He don't run fast", "He doesn't run fast"],
    optionsPa: ["ਉਹ ਤੇਜ਼ ਨਹੀਂ ਦੌੜਦਾ (ਗਲਤ)", "ਉਹ ਤੇਜ਼ ਨਹੀਂ ਦੌੜਦਾ।"],
    correct: "He doesn't run fast",
    explanationEn: "He/She uses doesn't."
  },
  {
    trackId: "T_WORDS",
    options: ["A apple", "An apple"],
    optionsPa: ["ਇੱਕ ਸੇਬ (ਗਲਤ)", "ਇੱਕ ਸੇਬ"],
    correct: "An apple",
    explanationEn: "Use an before vowel sounds."
  }
];

// Game 5: Conversation Coach (Best Reply)
// Schema:
// { id, difficulty: 1|2|3, trackId: "CONVO_REPLY", promptEn, promptPa?, choicesEn, choicesPa?, answerIndex,
//   hintEn?, hintPa?, explainEn?, explainPa? }
var RAW_GAME5_QUESTIONS = [
  {
    id: "G5_001",
    difficulty: 1,
    trackId: "CONVO_REPLY",
    promptEn: "Friend: Hi! How are you?",
    promptPa: "ਦੋਸਤ: ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    choicesEn: ["I’m good, thanks!", "Go away.", "I don’t know you."],
    choicesPa: ["ਮੈਂ ਠੀਕ ਹਾਂ, ਧੰਨਵਾਦ!", "ਦੂਰ ਜਾਓ।", "ਮੈਂ ਤੁਹਾਨੂੰ ਨਹੀਂ ਜਾਣਦਾ/ਜਾਣਦੀ।"],
    answerIndex: 0,
    hintEn: "Pick the polite, friendly reply.",
    hintPa: "ਸ਼ਿਸ਼ਟ ਅਤੇ ਦੋਸਤਾਨਾ ਜਵਾਬ ਚੁਣੋ।"
  },
  {
    id: "G5_002",
    difficulty: 1,
    trackId: "CONVO_REPLY",
    promptEn: "Teacher: Great job today!",
    promptPa: "ਅਧਿਆਪਕ: ਅੱਜ ਬਹੁਤ ਵਧੀਆ ਕੰਮ ਕੀਤਾ!",
    choicesEn: ["Thank you!", "No.", "I hate it."],
    choicesPa: ["ਧੰਨਵਾਦ!", "ਨਹੀਂ।", "ਮੈਨੂੰ ਇਹ ਨਫ਼ਰਤ ਹੈ।"],
    answerIndex: 0,
    hintEn: "A compliment → say thanks.",
    hintPa: "ਤਾਰੀਫ਼ → ਧੰਨਵਾਦ ਕਹੋ।"
  }
];

// Required by app startup checks
var GAMES_DATA = {
  GAME1: GAME1_QUESTIONS,
  GAME2: GAME2_QUESTIONS,
  GAME3: GAME3_QUESTIONS,
  GAME4: GAME4_QUESTIONS,
  GAME5: RAW_GAME5_QUESTIONS
};

// -------------------- Daily Quest normalized bank --------------------

function _dqChoice(id, text) {
  return { id: String(id), text: String(text) };
}

function _safeIdToken(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "x";
}

function buildAllGameQuestions() {
  var out = [];

  // GAME1 → choices are sentence tokens (simple, deterministic)
  for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
    var q1 = GAME1_QUESTIONS[i] || {};
    var sentence = String(q1.sentence || "").trim();
    var correctWord = String(q1.correctWord || "").trim();
    if (!sentence || !correctWord) continue;

    var tokens = sentence.split(/\s+/);
    var choices = [];
    var seen = {};

    function addToken(tok) {
      var t = String(tok || "").replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
      if (!t) return;
      var id = _safeIdToken(t);
      if (seen[id]) return;
      seen[id] = true;
      choices.push(_dqChoice(id, t));
    }

    addToken(correctWord);
    for (var ti = 0; ti < tokens.length && choices.length < 4; ti++) addToken(tokens[ti]);
    // Fallback distractors
    var fallback = ["the", "a", "is", "and", "in", "on"]; 
    for (var fi = 0; fi < fallback.length && choices.length < 4; fi++) addToken(fallback[fi]);

    var correctId = _safeIdToken(correctWord);
    if (!seen[correctId]) continue;

    out.push({
      id: "G1_" + String(i),
      gameId: "GAME1",
      trackId: String(q1.trackId || "T_WORDS"),
      prompt: String(q1.question || "Tap the word") + " in: \"" + sentence + "\"",
      choices: choices,
      correctChoiceId: correctId,
      hintEn: q1.hintEn ? String(q1.hintEn) : "",
      hintPa: q1.hintPa ? String(q1.hintPa) : "",
      explanationEn: q1.explanationEn ? String(q1.explanationEn) : "",
      explanationPa: q1.explanationPa ? String(q1.explanationPa) : ""
    });
  }

  // GAME2
  var posChoices = [
    { id: "noun", text: "Noun" },
    { id: "verb", text: "Verb" },
    { id: "adjective", text: "Adjective" },
    { id: "adverb", text: "Adverb" },
    { id: "preposition", text: "Preposition" },
    { id: "conjunction", text: "Conjunction" },
    { id: "pronoun", text: "Pronoun" },
    { id: "article", text: "Article" },
    { id: "interjection", text: "Interjection" }
  ];
  for (var j = 0; j < GAME2_QUESTIONS.length; j++) {
    var q2 = GAME2_QUESTIONS[j] || {};
    var pid = String(q2.correctPartId || "");
    if (!pid) continue;
    out.push({
      id: "G2_" + String(j),
      gameId: "GAME2",
      trackId: String(q2.trackId || "T_WORDS"),
      prompt: "What word type is: \"" + String(q2.word || "") + "\"?",
      choices: posChoices.slice(),
      correctChoiceId: pid,
      hintEn: q2.hintEn ? String(q2.hintEn) : "",
      hintPa: q2.hintPa ? String(q2.hintPa) : "",
      explanationEn: q2.explanationEn ? String(q2.explanationEn) : "",
      explanationPa: q2.explanationPa ? String(q2.explanationPa) : ""
    });
  }

  // GAME3
  var tenseChoices = [
    { id: "present", text: "Present" },
    { id: "past", text: "Past" },
    { id: "future", text: "Future" }
  ];
  for (var k = 0; k < GAME3_QUESTIONS.length; k++) {
    var q3 = GAME3_QUESTIONS[k] || {};
    var tid = String(q3.correctTense || "");
    if (!tid) continue;
    out.push({
      id: "G3_" + String(k),
      gameId: "GAME3",
      trackId: "T_ACTIONS",
      prompt: String(q3.sentence || ""),
      choices: tenseChoices.slice(),
      correctChoiceId: tid,
      hintEn: q3.hintEn ? String(q3.hintEn) : "",
      hintPa: q3.hintPa ? String(q3.hintPa) : "",
      explanationEn: q3.explanationEn ? String(q3.explanationEn) : "",
      explanationPa: q3.explanationPa ? String(q3.explanationPa) : ""
    });
  }

  // GAME4
  for (var m = 0; m < GAME4_QUESTIONS.length; m++) {
    var q4 = GAME4_QUESTIONS[m] || {};
    var opts = Array.isArray(q4.options) ? q4.options : [];
    if (opts.length < 2) continue;
    var a = String(opts[0]);
    var b = String(opts[1]);
    var correct = String(q4.correct || a);
    var correctId4 = (correct === b) ? "b" : "a";
    out.push({
      id: "G4_" + String(m),
      gameId: "GAME4",
      trackId: String(q4.trackId || "T_SENTENCE"),
      prompt: "Pick the correct sentence:",
      choices: [_dqChoice("a", a), _dqChoice("b", b)],
      correctChoiceId: correctId4,
      hintEn: q4.hintEn ? String(q4.hintEn) : "",
      hintPa: q4.hintPa ? String(q4.hintPa) : "",
      explanationEn: q4.explanationEn ? String(q4.explanationEn) : "",
      explanationPa: q4.explanationPa ? String(q4.explanationPa) : ""
    });
  }

  // GAME5
  for (var n = 0; n < RAW_GAME5_QUESTIONS.length; n++) {
    var q5 = RAW_GAME5_QUESTIONS[n] || {};
    var id = String(q5.id || ("G5_" + String(n)));
    var choicesEn = Array.isArray(q5.choicesEn) ? q5.choicesEn : [];
    var answerIndex = (typeof q5.answerIndex === "number") ? q5.answerIndex : -1;
    if (!choicesEn.length || answerIndex < 0 || answerIndex >= choicesEn.length) continue;

    var choices5 = [];
    for (var ci = 0; ci < choicesEn.length; ci++) {
      choices5.push(_dqChoice(String(ci), String(choicesEn[ci] || "")));
    }

    out.push({
      id: id,
      gameId: "GAME5",
      trackId: String(q5.trackId || "CONVO_REPLY"),
      prompt: String(q5.promptEn || ""),
      choices: choices5,
      correctChoiceId: String(answerIndex),
      hintEn: q5.hintEn ? String(q5.hintEn) : "",
      hintPa: q5.hintPa ? String(q5.hintPa) : "",
      explanationEn: q5.explainEn ? String(q5.explainEn) : "",
      explanationPa: q5.explainPa ? String(q5.explainPa) : ""
    });
  }

  return out;
}
