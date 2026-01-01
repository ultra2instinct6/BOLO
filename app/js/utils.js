// =====================================
// Utility Functions
// =====================================

// -----------------------------------------------------
// Shared labels/helpers used by Games 2/3 and DQ
// -----------------------------------------------------

// Parts of speech labels (EN)
if (typeof PARTS_OF_SPEECH_LABELS === "undefined") {
  var PARTS_OF_SPEECH_LABELS = {
    noun: "Noun",
    verb: "Verb",
    adjective: "Adjective",
    adverb: "Adverb",
    pronoun: "Pronoun",
    preposition: "Preposition",
    conjunction: "Conjunction",
    article: "Article",
    interjection: "Interjection"
  };
}

// Parts of speech labels (PA) — additive; safe fallback if Punjabi text is missing.
if (typeof PARTS_OF_SPEECH_LABELS_PA === "undefined") {
  var PARTS_OF_SPEECH_LABELS_PA = {
    noun: "ਨਾਂ",
    verb: "ਕਿਰਿਆ",
    adjective: "ਵਿਸ਼ੇਸ਼ਣ",
    adverb: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ",
    pronoun: "ਸਰਵਨਾਮ",
    preposition: "ਪੂਰਵ-ਬੋਧਕ",
    conjunction: "ਸੰਯੋਜਕ",
    article: "ਲੇਖ",
    interjection: "ਵਿਸਮਿਆਦਿ ਬੋਧਕ"
  };
}

// Tense labels (EN)
if (typeof TENSE_LABELS === "undefined") {
  var TENSE_LABELS = {
    present: "Present",
    past: "Past",
    future: "Future"
  };
}

// Tense labels (PA)
if (typeof TENSE_LABELS_PA === "undefined") {
  var TENSE_LABELS_PA = {
    present: "ਵਰਤਮਾਨ",
    past: "ਭੂਤਕਾਲ",
    future: "ਭਵਿੱਖ"
  };
}

// Label helpers used by app/data/games.js and app/js/games.js
if (typeof getPosLabel !== "function") {
  function getPosLabel(partId, opts) {
    var id = String(partId || "");
    var o = opts || {};
    var en = (PARTS_OF_SPEECH_LABELS && PARTS_OF_SPEECH_LABELS[id]) ? PARTS_OF_SPEECH_LABELS[id] : id;
    var pa = (PARTS_OF_SPEECH_LABELS_PA && PARTS_OF_SPEECH_LABELS_PA[id]) ? PARTS_OF_SPEECH_LABELS_PA[id] : "";
    if (o && o.bilingual) return pa ? (en + " / " + pa) : en;
    if (o && o.lang === "pa") return pa || "";
    return en;
  }
}

if (typeof getTenseLabel !== "function") {
  function getTenseLabel(tenseId, opts) {
    var id = String(tenseId || "");
    var o = opts || {};
    var en = (TENSE_LABELS && TENSE_LABELS[id]) ? TENSE_LABELS[id] : id;
    var pa = (TENSE_LABELS_PA && TENSE_LABELS_PA[id]) ? TENSE_LABELS_PA[id] : "";
    if (o && o.bilingual) return pa ? (en + " / " + pa) : en;
    if (o && o.lang === "pa") return pa || "";
    return en;
  }
}

// Extract a POS key from prompts like "Tap the noun"
if (typeof derivePosKeyFromTapPrompt !== "function") {
  function derivePosKeyFromTapPrompt(promptText) {
    var s = String(promptText || "").toLowerCase();
    if (!s) return null;

    // Normalize punctuation to spaces
    s = s.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();

    var keys = [
      "noun",
      "verb",
      "adjective",
      "adverb",
      "pronoun",
      "preposition",
      "conjunction",
      "article",
      "interjection"
    ];

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (s.indexOf(" " + k + " ") !== -1 || s.endsWith(" " + k) || s.startsWith(k + " ") || s === k) {
        return k;
      }
    }

    // Common variations
    if (s.indexOf("word type") !== -1) return null;
    return null;
  }
}

// Convert Date to local ISO format (YYYY-MM-DD)
function toISODateLocal(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

// Simple stable hash from string to integer
function hashStringToInt(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Pick a game consistently for a given date
function pickDailyGameId(dateKey) {
  var games = ["GAME2", "GAME3", "GAME4"];
  var idx = hashStringToInt(dateKey) % games.length;
  return games[idx];
}

// Get today's daily game
function getTodaysDailyGame() {
  var today = new Date();
  var dateKey = toISODateLocal(today);
  return pickDailyGameId(dateKey);
}

// Seeded pseudo-random number generator (deterministic)
function seededRng(seedInt) {
  var s = seedInt % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Pick N items from array using seeded RNG with Fisher-Yates shuffle
function pickNSeeded(arr, n, seedInt) {
  var rng = seededRng(seedInt);
  var copy = arr.slice();

  // Fisher-Yates shuffle with seeded RNG
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy.slice(0, Math.min(n, copy.length));
}

// Build daily quest payload with 3 questions from today's game
function buildDailyQuestGamesPayload(now) {
  if (!now) now = new Date();
  
  var dateKey = toISODateLocal(now);
  var all = buildAllGameQuestions();

  var gameId = pickDailyGameId(dateKey);
  var pool = all.filter(function(q) {
    return q.gameId === gameId;
  });

  // Seed with dateKey so it's stable for the day
  var seed = hashStringToInt(dateKey + ":" + gameId);
  var chosen = pickNSeeded(pool, 3, seed);

  return {
    dateKey: dateKey,           // "2025-12-16"
    gameId: gameId,             // "GAME2" | "GAME3" | "GAME4"
    gameQuestions: chosen       // array of 3 normalized questions
  };
}
