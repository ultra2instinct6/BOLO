/* =========================================================
   BOLO – Reading Vocabulary (R1–R100)
   Fresh dataset aligned to 10 books x 10 stories.
   ========================================================= */

var READING_VOCAB_DETAIL = {};

(function buildReadingVocabDetail() {
  for (var bookId = 1; bookId <= 10; bookId++) {
    for (var storyInBook = 1; storyInBook <= 10; storyInBook++) {
      var idx = ((bookId - 1) * 10) + storyInBook;
      var rid = "R" + idx;

      READING_VOCAB_DETAIL[rid] = {
        phrases: [
          { term: "book " + bookId, pos: "phrase", defEn: "the selected book", defPa: "ਚੁਣੀ ਹੋਈ ਕਿਤਾਬ" },
          { term: "story " + storyInBook, pos: "phrase", defEn: "the selected story", defPa: "ਚੁਣੀ ਹੋਈ ਕਹਾਣੀ" },
          { term: "read aloud", pos: "phrase", defEn: "read using your voice", defPa: "ਆਵਾਜ਼ ਨਾਲ ਪੜ੍ਹਨਾ" },
          { term: "new words", pos: "phrase", defEn: "words you are learning", defPa: "ਨਵੇਂ ਸ਼ਬਦ" },
          { term: "answer question", pos: "phrase", defEn: "give the correct answer", defPa: "ਸਹੀ ਜਵਾਬ ਦੇਣਾ" }
        ],
        words: [
          { term: "book", pos: "noun", defEn: "a set of pages to read", defPa: "ਪੜ੍ਹਨ ਲਈ ਪੰਨਿਆਂ ਦਾ ਸਮੂਹ" },
          { term: "story", pos: "noun", defEn: "a short reading passage", defPa: "ਛੋਟਾ ਪਾਠ" },
          { term: "read", pos: "verb", defEn: "look at words and understand", defPa: "ਸ਼ਬਦਾਂ ਨੂੰ ਸਮਝ ਕੇ ਪੜ੍ਹਨਾ", forms: ["reads", "reading", "read"] },
          { term: "learn", pos: "verb", defEn: "gain new knowledge", defPa: "ਨਵੀਂ ਜਾਣਕਾਰੀ ਲੈਣਾ", forms: ["learns", "learning", "learned"] },
          { term: "answer", pos: "verb", defEn: "respond to a question", defPa: "ਸਵਾਲ ਦਾ ਜਵਾਬ ਦੇਣਾ", forms: ["answers", "answered"] },
          { term: "word", pos: "noun", defEn: "a unit of language", defPa: "ਭਾਸ਼ਾ ਦੀ ਇਕ ਇਕਾਈ", forms: ["words"] },
          { term: "sentence", pos: "noun", defEn: "a full line of meaning", defPa: "ਪੂਰਾ ਅਰਥ ਵਾਲੀ ਲਾਈਨ", forms: ["sentences"] },
          { term: "practice", pos: "noun/verb", defEn: "repeat to improve", defPa: "ਸੁਧਾਰ ਲਈ ਦੁਹਰਾਈ", forms: ["practices", "practiced"] }
        ]
      };
    }
  }
})();

// -------------------- Compatibility Export --------------------
// Runtime expects:
// READING_VOCAB[readingId] = { vocabWords: [], vocabPhrases: [], vocabForms: {} }
var READING_VOCAB = (typeof READING_VOCAB !== "undefined" && READING_VOCAB) ? READING_VOCAB : {};

(function buildReadingVocabCompat() {
  if (!READING_VOCAB_DETAIL || typeof READING_VOCAB_DETAIL !== "object") return;

  var out = {};
  for (var readingId in READING_VOCAB_DETAIL) {
    if (!READING_VOCAB_DETAIL.hasOwnProperty(readingId)) continue;
    var entry = READING_VOCAB_DETAIL[readingId];
    if (!entry || typeof entry !== "object") continue;

    var vocabPhrases = [];
    if (Array.isArray(entry.phrases)) {
      for (var i = 0; i < entry.phrases.length; i++) {
        var ph = entry.phrases[i];
        if (ph && typeof ph.term === "string" && ph.term.trim()) vocabPhrases.push(ph.term.trim());
      }
    }

    var vocabWords = [];
    var vocabForms = {};
    if (Array.isArray(entry.words)) {
      for (var j = 0; j < entry.words.length; j++) {
        var w = entry.words[j];
        if (!w || typeof w.term !== "string") continue;
        var base = w.term.trim();
        if (!base) continue;
        vocabWords.push(base);
        if (Array.isArray(w.forms) && w.forms.length) vocabForms[base] = w.forms.slice();
      }
    }

    out[readingId] = {
      vocabWords: vocabWords,
      vocabPhrases: vocabPhrases,
      vocabForms: vocabForms
    };
  }

  Object.assign(READING_VOCAB, out);
})();
