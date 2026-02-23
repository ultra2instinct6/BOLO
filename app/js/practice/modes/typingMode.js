// Practice Mode v1.2
// Typing Mode content engine (no UI)
// Exposes: generateQueue(settings), grade(item, userAnswer, settings), coach(item, result, settings)

(function() {
  "use strict";

  if (!window.PracticeModes) window.PracticeModes = {};
  if (window.PracticeModes.typing) return;

  // ---------------------------
  // Helpers: normalization
  // ---------------------------
  function _collapseWhitespace(s) {
    return String(s).replace(/\s+/g, " ").trim();
  }

  function _normalizeAnswer(s) {
    // Case-insensitive, whitespace-collapsing, punctuation-preserving.
    return _collapseWhitespace(String(s)).toLowerCase();
  }

  function _stripEdgePunct(token) {
    // For word/phrase extraction only (not grading).
    return String(token).replace(/^[^a-z0-9]+/i, "").replace(/[^a-z0-9]+$/i, "");
  }

  function _isPlainObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function _settings(settings) {
    settings = _isPlainObject(settings) ? settings : {};
    var difficulty = (settings.difficulty === "hard" || settings.difficulty === "medium") ? settings.difficulty : "easy";
    var length = (settings.length === "endless") ? "endless" : (typeof settings.length === "number" ? settings.length : 10);
    var numberWords = (typeof settings.numberWords === "boolean") ? settings.numberWords : true;
    var allowMinorTypos = (typeof settings.allowMinorTypos === "boolean") ? settings.allowMinorTypos : (difficulty !== "hard");
    // hints is allowed to be boolean or "on"/"off"; normalize but not used here yet.
    var hints = settings.hints;
    if (hints === "on") hints = true;
    if (hints === "off") hints = false;
    if (typeof hints !== "boolean") hints = true;

    return {
      difficulty: difficulty,
      length: length,
      hints: hints,
      autoAdvance: !!settings.autoAdvance,
      numberWords: numberWords,
      allowMinorTypos: allowMinorTypos
    };
  }

  // ---------------------------
  // Helpers: tiny number mapping
  // ---------------------------
  var _NUM_TO_WORD = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty"
  };

  var _WORD_TO_NUM = (function() {
    var out = Object.create(null);
    for (var k in _NUM_TO_WORD) out[_NUM_TO_WORD[k]] = Number(k);
    // common variants
    out["oh"] = 0;
    return out;
  })();

  function _parseSmallNumberWord(word) {
    // Supports 0–20 only (intentionally small + offline).
    var w = _normalizeAnswer(word);
    if (_WORD_TO_NUM[w] != null) return _WORD_TO_NUM[w];
    return null;
  }

  function _parseDigits(s) {
    var t = _normalizeAnswer(s);
    if (!/^\d{1,2}$/.test(t)) return null;
    var n = Number(t);
    if (!isFinite(n) || isNaN(n)) return null;
    if (n < 0 || n > 20) return null;
    return n;
  }

  function _numberEquivalents(expected) {
    // Returns array of normalized strings that are equivalent for easy/medium.
    var out = [];
    var n = _parseDigits(expected);
    if (n != null) {
      out.push(_normalizeAnswer(String(n)));
      if (_NUM_TO_WORD[n]) out.push(_normalizeAnswer(_NUM_TO_WORD[n]));
      return out;
    }
    var wn = _parseSmallNumberWord(expected);
    if (wn != null) {
      out.push(_normalizeAnswer(_NUM_TO_WORD[wn] != null ? String(wn) : String(wn)));
      out.push(_normalizeAnswer(_NUM_TO_WORD[wn] != null ? _NUM_TO_WORD[wn] : _NUM_TO_WORD[wn]));
    }
    // Fix above bug-like line: simpler
    out = [];
    wn = _parseSmallNumberWord(expected);
    if (wn != null) {
      out.push(_normalizeAnswer(String(wn)));
      if (_NUM_TO_WORD[wn]) out.push(_normalizeAnswer(_NUM_TO_WORD[wn]));
      return out;
    }
    return [ _normalizeAnswer(expected) ];
  }

  // ---------------------------
  // Helpers: minor typo tolerance
  // ---------------------------
  function _levenshteinWithin1(a, b) {
    // Early-exit distance <= 1 check.
    if (a === b) return true;
    var la = a.length;
    var lb = b.length;
    if (Math.abs(la - lb) > 1) return false;

    // If same length: at most one substitution.
    if (la === lb) {
      var diffs = 0;
      for (var i = 0; i < la; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
          diffs++;
          if (diffs > 1) return false;
        }
      }
      return true;
    }

    // One insertion/deletion.
    var s1 = la < lb ? a : b;
    var s2 = la < lb ? b : a;
    var i1 = 0;
    var i2 = 0;
    var usedEdit = false;
    while (i1 < s1.length && i2 < s2.length) {
      if (s1.charCodeAt(i1) === s2.charCodeAt(i2)) {
        i1++; i2++;
        continue;
      }
      if (usedEdit) return false;
      usedEdit = true;
      i2++; // skip one char from longer string
    }
    return true;
  }

  function _maybeMinorTypoMatch(expectedNorm, userNorm, allow) {
    if (!allow) return false;
    if (!expectedNorm || !userNorm) return false;
    if (expectedNorm.indexOf(" ") !== -1) return false; // single word only
    if (userNorm.indexOf(" ") !== -1) return false;
    if (expectedNorm.length < 5) return false;
    return _levenshteinWithin1(expectedNorm, userNorm);
  }

  // ---------------------------
  // Content sources
  // ---------------------------
  function _getTypingSentences() {
    // Uses existing global typing prompts if available.
    if (typeof window.TYPING_PROMPTS !== "undefined" && Array.isArray(window.TYPING_PROMPTS)) {
      return window.TYPING_PROMPTS;
    }
    if (typeof TYPING_PROMPTS !== "undefined" && Array.isArray(TYPING_PROMPTS)) {
      return TYPING_PROMPTS;
    }
    return [];
  }

  function _buildWordBank() {
    var prompts = _getTypingSentences();
    var seen = Object.create(null);
    var words = [];

    for (var i = 0; i < prompts.length; i++) {
      var en = prompts[i] && prompts[i].en;
      if (typeof en !== "string") continue;
      var tokens = en.split(/\s+/);
      for (var j = 0; j < tokens.length; j++) {
        var w = _stripEdgePunct(tokens[j]).toLowerCase();
        if (!w) continue;
        if (w.length < 3) continue;
        if (!/^[a-z]+$/.test(w)) continue;
        if (seen[w]) continue;
        seen[w] = true;
        words.push(w);
      }
    }

    // Fallback minimal bank
    if (!words.length) {
      words = ["hello", "please", "thank", "today", "school", "apple", "water", "friend"]; 
    }
    return words;
  }

  function _buildPhraseBank() {
    var prompts = _getTypingSentences();
    var phrases = [];
    var seen = Object.create(null);

    for (var i = 0; i < prompts.length; i++) {
      var en = prompts[i] && prompts[i].en;
      if (typeof en !== "string") continue;
      // Remove punctuation for phrase extraction (grading still uses exact phrase text).
      var cleaned = en.replace(/[^a-z0-9\s']/gi, " ");
      cleaned = _collapseWhitespace(cleaned);
      if (!cleaned) continue;
      var parts = cleaned.split(" ");
      if (parts.length < 2) continue;

      // Create some 2–4 word phrases
      for (var start = 0; start < parts.length; start++) {
        for (var len = 2; len <= 4; len++) {
          if (start + len > parts.length) continue;
          var ph = parts.slice(start, start + len).join(" ").toLowerCase();
          if (ph.length < 5) continue;
          if (seen[ph]) continue;
          seen[ph] = true;
          phrases.push(ph);
        }
      }
    }

    // Fallback
    if (!phrases.length) {
      phrases = ["please sit", "open the door", "i am ready", "thank you"]; 
    }
    return phrases;
  }

  function _getDrillItems() {
    // Optional: provides short pattern prompts (can be used as phrases).
    try {
      var drills = window.BOLO_TYPING_DRILLS_V1;
      if (!drills || !Array.isArray(drills.packs)) return [];
      var out = [];
      for (var i = 0; i < drills.packs.length; i++) {
        var pack = drills.packs[i];
        if (!pack || !Array.isArray(pack.items)) continue;
        for (var j = 0; j < pack.items.length; j++) {
          if (typeof pack.items[j] === "string" && pack.items[j].trim()) out.push(pack.items[j]);
        }
      }
      return out;
    } catch (e) {
      return [];
    }
  }

  // ---------------------------
  // Queue generation
  // ---------------------------
  var _wordBank = null;
  var _phraseBank = null;
  var _drillBank = null;
  var _idCounter = 0;

  function _pick(arr, idx) {
    if (!arr || !arr.length) return null;
    return arr[idx % arr.length];
  }

  function _makeItem(category, prompt, answer, meta) {
    _idCounter++;
    var id = "t_" + Date.now() + "_" + _idCounter;
    meta = _isPlainObject(meta) ? meta : {};
    meta.category = meta.category || category;
    meta.normalizedAnswer = _normalizeAnswer(answer);
    return {
      id: id,
      prompt: String(prompt),
      answer: String(answer),
      meta: meta
    };
  }

  function _generateNumberItem(s) {
    // Documented rule:
    // - easy/medium: numberWords=true accepts both "7" and "seven" as equivalent.
    // - hard: strict (must match expected exactly after normalization; no number equivalence).
    var n = Math.floor(Math.random() * 21); // 0..20
    var word = _NUM_TO_WORD[n] || String(n);

    var prompt = s.numberWords ? String(n) : word;
    var answer = s.numberWords ? word : String(n);

    var accepts = [ _normalizeAnswer(answer) ];
    if (s.difficulty !== "hard") {
      // Accept equivalent for easy/medium.
      accepts = _numberEquivalents(answer);
    }

    return _makeItem(
      "numbers",
      prompt,
      answer,
      {
        difficulty: s.difficulty,
        accepts: accepts
      }
    );
  }

  function _generateWordItem(s, idx) {
    if (!_wordBank) _wordBank = _buildWordBank();
    var w = _pick(_wordBank, idx);
    return _makeItem(
      "word",
      w,
      w,
      {
        difficulty: s.difficulty,
        accepts: [ _normalizeAnswer(w) ]
      }
    );
  }

  function _generatePhraseItem(s, idx) {
    if (!_phraseBank) _phraseBank = _buildPhraseBank();
    var ph = _pick(_phraseBank, idx);
    return _makeItem(
      "phrase",
      ph,
      ph,
      {
        difficulty: s.difficulty,
        accepts: [ _normalizeAnswer(ph) ]
      }
    );
  }

  function _generateDrillItem(s, idx) {
    if (!_drillBank) _drillBank = _getDrillItems();
    if (!_drillBank.length) return _generatePhraseItem(s, idx);
    var d = _pick(_drillBank, idx);
    return _makeItem(
      "drill",
      d,
      d,
      {
        difficulty: s.difficulty,
        accepts: [ _normalizeAnswer(d) ]
      }
    );
  }

  function generateQueue(settings) {
    var s = _settings(settings);
    var n = (s.length === "endless") ? 20 : Math.max(1, Math.floor(Number(s.length) || 10));

    var queue = [];
    var i;

    // Simple category mix by difficulty
    for (i = 0; i < n; i++) {
      var r = Math.random();
      var item;

      if (s.difficulty === "easy") {
        if (r < 0.35) item = _generateNumberItem(s);
        else if (r < 0.75) item = _generateWordItem(s, i * 3 + 1);
        else item = _generatePhraseItem(s, i * 5 + 2);
      } else if (s.difficulty === "medium") {
        if (r < 0.30) item = _generateNumberItem(s);
        else if (r < 0.55) item = _generateWordItem(s, i * 7 + 3);
        else if (r < 0.90) item = _generatePhraseItem(s, i * 11 + 4);
        else item = _generateDrillItem(s, i * 13 + 5);
      } else {
        // hard
        if (r < 0.20) item = _generateNumberItem(s);
        else if (r < 0.35) item = _generateWordItem(s, i * 17 + 6);
        else if (r < 0.85) item = _generatePhraseItem(s, i * 19 + 7);
        else item = _generateDrillItem(s, i * 23 + 8);
      }

      queue.push(item);
    }

    return queue;
  }

  // ---------------------------
  // Grading + coaching
  // ---------------------------
  function grade(item, userAnswer, settings) {
    var s = _settings(settings);
    item = _isPlainObject(item) ? item : {};
    var meta = _isPlainObject(item.meta) ? item.meta : {};

    var expected = (typeof item.answer === "string") ? item.answer : "";
    var expectedNorm = _normalizeAnswer(expected);
    var userNorm = _normalizeAnswer(userAnswer);

    var accepts = Array.isArray(meta.accepts) ? meta.accepts : [expectedNorm];
    var toleranceUsed = "exact";

    // Ensure accepts are normalized
    var normalizedAccepts = [];
    for (var i = 0; i < accepts.length; i++) {
      normalizedAccepts.push(_normalizeAnswer(accepts[i]));
    }

    var correct = false;
    for (var j = 0; j < normalizedAccepts.length; j++) {
      if (userNorm === normalizedAccepts[j]) {
        correct = true;
        // If accepts included more than expected, count as equivalence.
        if (normalizedAccepts[j] !== expectedNorm) toleranceUsed = "numberEquivalent";
        break;
      }
    }

    if (!correct) {
      // Minor typo tolerance (single words only)
      if (_maybeMinorTypoMatch(expectedNorm, userNorm, s.allowMinorTypos)) {
        correct = true;
        toleranceUsed = "minorTypo";
      }
    }

    return {
      correct: !!correct,
      assisted: false,
      meta: {
        expected: expected,
        normalizedUser: userNorm,
        toleranceUsed: toleranceUsed
      }
    };
  }

  function coach(item, result, settings) {
    var s = _settings(settings);
    item = _isPlainObject(item) ? item : {};
    result = _isPlainObject(result) ? result : {};
    var meta = _isPlainObject(item.meta) ? item.meta : {};

    var expected = (typeof item.answer === "string") ? item.answer : "";
    var line1 = "Correct: " + expected;

    var tip = "Tip: go slow and keep spacing clean.";
    if (meta.category === "numbers") {
      if (s.difficulty === "hard") {
        tip = "Tip: hard mode is strict—match the expected form exactly.";
      } else {
        tip = "Tip: on easy/medium, digits and words are both accepted.";
      }
    } else if (meta.category === "word") {
      tip = "Tip: focus on the middle letters—avoid skipping.";
    } else if (meta.category === "phrase") {
      tip = "Tip: type one space between words.";
    } else if (meta.category === "drill") {
      tip = "Tip: keep a steady rhythm—accuracy first.";
    }

    // 1–2 lines
    return line1 + "\n" + tip;
  }

  window.PracticeModes.typing = {
    id: "typing",
    label: "Typing",
    generateQueue: generateQueue,
    grade: grade,
    coach: coach
  };
})();
