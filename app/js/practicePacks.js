// Practice Mode v1.2
// Practice Packs (global, no deps)
// Exposes: window.getNextPracticePrompt(state), window.gradePrompt(prompt, userAnswer, settings), window.coachPrompt(prompt, result, settings)
// Also: window.PracticePacks (packs + helpers), window.__practicePacksExamples()

(function() {
  "use strict";

  if (!window.PracticePacks) window.PracticePacks = {};
  if (window.PracticePacks._v12PracticePacksLoaded) return;
  window.PracticePacks._v12PracticePacksLoaded = true;

  // ---------------------------
  // Helpers: basic type guards
  // ---------------------------
  function _isPlainObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function _toInt(n, fallback) {
    var v = Number(n);
    if (!isFinite(v) || isNaN(v)) return fallback;
    return (v | 0);
  }

  function _clampDifficulty(n) {
    var d = _toInt(n, 1);
    if (d < 1) d = 1;
    if (d > 5) d = 5;
    return d;
  }

  function _normalizeType(modeOrType) {
    var t = String(modeOrType || "").toLowerCase();
    if (t === "typing") return "typing";
    if (t === "pattern" || t === "patterns") return "pattern";
    // fallback: PracticeStorage uses "patterns" mode naming
    if (t === "facts") return "pattern"; // best-effort (patterns/facts both numeric-like)
    return "typing";
  }

  function _collapseWhitespace(s) {
    return String(s).replace(/\s+/g, " ").trim();
  }

  function _normalizeTypingAnswer(s) {
    // Case-insensitive, whitespace-collapsing, punctuation-preserving.
    return _collapseWhitespace(String(s)).toLowerCase();
  }

  function _stripEdgePunct(token) {
    return String(token).replace(/^[^a-z0-9]+/i, "").replace(/[^a-z0-9]+$/i, "");
  }

  // ---------------------------
  // Structured typing banks (v1)
  // ---------------------------
  // Bank item schema:
  // { t: string, level: 1|2|3, tags: string[], features?: { punct?, apostrophe?, numbers?, caps? }, pa?: string }
  function _normalizeTags(tags) {
    if (!Array.isArray(tags)) return [];
    var out = [];
    var seen = Object.create(null);
    for (var i = 0; i < tags.length; i++) {
      var s = String(tags[i] || "").trim();
      if (!s) continue;
      s = s.toLowerCase();
      if (seen[s]) continue;
      seen[s] = true;
      out.push(s);
    }
    return out;
  }

  function _detectFeatures(text) {
    var t = String(text || "");
    return {
      punct: /[.?!,;:]/.test(t),
      apostrophe: /['’]/.test(t),
      numbers: /\d/.test(t),
      caps: /[A-Z]/.test(t)
    };
  }

  function _coerceLevel(level) {
    var l = _toInt(level, 1);
    if (l < 1) l = 1;
    if (l > 3) l = 3;
    return l;
  }

  function _bankItem(t, level, tags, features, pa) {
    var text = _collapseWhitespace(String(t || "")).trim();
    var out = {
      t: text,
      level: _coerceLevel(level),
      tags: _normalizeTags(tags)
    };
    if (_isPlainObject(features)) out.features = features;
    else out.features = _detectFeatures(text);
    if (typeof pa === "string" && pa.trim()) out.pa = String(pa).trim();
    return out;
  }

  // Normalization layer for typing bank items.
  // Bank items may be:
  // - "string prompt"
  // - { text: "...", tags: [...] }
  // - (existing internal shape) { t: "...", level, tags, features, pa }
  function normalizePracticeItem(item) {
    var text = "";
    var tags = [];

    if (typeof item === "string") {
      text = _collapseWhitespace(item).trim();
    } else if (_isPlainObject(item)) {
      if (typeof item.text === "string") text = _collapseWhitespace(item.text).trim();
      else if (typeof item.t === "string") text = _collapseWhitespace(item.t).trim();
      tags = Array.isArray(item.tags) ? item.tags : [];
    }

    return { text: text, tags: _normalizeTags(tags) };
  }

  function _coerceAnyBankItem(raw, defaultLevel) {
    defaultLevel = _coerceLevel(defaultLevel == null ? 1 : defaultLevel);
    if (raw == null) return null;

    // Already in internal shape.
    if (_isPlainObject(raw) && typeof raw.t === "string") {
      raw.t = _collapseWhitespace(raw.t).trim();
      raw.level = _coerceLevel(raw.level);
      raw.tags = _normalizeTags(raw.tags);
      if (!raw.features || typeof raw.features !== "object") raw.features = _detectFeatures(raw.t);
      if (typeof raw.pa === "string") {
        raw.pa = raw.pa.trim();
        if (!raw.pa) delete raw.pa;
      }
      return raw;
    }

    // String or {text,tags}.
    var norm = normalizePracticeItem(raw);
    if (!norm.text) return null;

    var level = defaultLevel;
    if (_isPlainObject(raw) && raw.level != null) level = raw.level;

    var features = (_isPlainObject(raw) && _isPlainObject(raw.features)) ? raw.features : null;
    var pa = (_isPlainObject(raw) && typeof raw.pa === "string") ? raw.pa : null;
    return _bankItem(norm.text, level, norm.tags, features, pa);
  }

  function _difficultyToMaxLevel(d) {
    // Practice UI maps easy/medium/hard to rampDifficulty 1/3/5.
    if (d <= 1) return 1;
    if (d <= 3) return 2;
    return 3;
  }

  function _difficultySoftAllows(item, d) {
    // Soft rules (hinted, not absolute):
    // - Easy: avoid apostrophes/digits and heavy punctuation; allow normal sentence capitalization and period-only endings.
    // - Medium: avoid digits; allow caps and simple punctuation.
    // - Hard: allow everything.
    if (!item) return false;
    var text = String(item.t || "");
    var f = (item.features && typeof item.features === "object") ? item.features : _detectFeatures(text);
    var hasSpace = (text.indexOf(" ") !== -1);
    var hardPunct = /[?!,;:]/.test(text);
    var periodOnly = /\.$/.test(text) && !hardPunct;

    if (d <= 1) {
      if (f.apostrophe) return false;
      if (f.numbers) return false;
      // Allow period-only endings for sentences; otherwise avoid punctuation.
      if (f.punct && !periodOnly) return false;
      // Caps are OK for multi-word phrases/sentences; avoid caps for single tokens.
      if (!hasSpace && f.caps) return false;
      return true;
    }

    if (d <= 3) {
      if (f.numbers) return false;
      return true;
    }

    return true;
  }

  function _hasAnyTag(item, tags) {
    if (!item || !Array.isArray(item.tags) || !tags || !tags.length) return false;
    for (var i = 0; i < tags.length; i++) {
      if (item.tags.indexOf(tags[i]) !== -1) return true;
    }
    return false;
  }

  function _extractPrimaryTags(item) {
    // Prefer topic tags; de-prioritize grammar tags for variety.
    var tags = (item && Array.isArray(item.tags)) ? item.tags : [];
    var out = [];
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (!t) continue;
      if (t.indexOf("grammar:") === 0) continue;
      out.push(t);
    }
    // If only grammar tags exist, fall back to those.
    if (!out.length) out = tags.slice(0);
    return out;
  }

  function _chooseFromBank(ctx, bankItems, opts) {
    opts = _isPlainObject(opts) ? opts : {};

    var d = _clampDifficulty(ctx && ctx.difficulty);
    var maxLevel = _difficultyToMaxLevel(d);
    var recentTexts = Array.isArray(opts.recentTexts) ? opts.recentTexts : [];
    var recentTags = Array.isArray(opts.recentTags) ? opts.recentTags : [];
    var preferredTags = Array.isArray(opts.preferredTags) ? opts.preferredTags : [];

    // Build candidate lists (strict then relaxed).
    var strict = [];
    var relaxed = [];
    for (var i = 0; i < (bankItems ? bankItems.length : 0); i++) {
      var it = _coerceAnyBankItem(bankItems[i], 1);
      if (!it || typeof it.t !== "string" || !it.t.trim()) continue;
      if (_coerceLevel(it.level) > maxLevel) continue;

      var norm = _normalizeTypingAnswer(it.t);
      var isRecent = (recentTexts.indexOf(norm) !== -1);

      // Variety: avoid repeating the immediate last topic tag (don't block all recent tags).
      var primary = _extractPrimaryTags(it);
      var repeatsTag = false;
      var lastTag = recentTags.length ? recentTags[recentTags.length - 1] : null;
      if (lastTag && primary.indexOf(lastTag) !== -1) repeatsTag = true;

      var okSoft = _difficultySoftAllows(it, d);

      if (!isRecent && okSoft && !repeatsTag) strict.push(it);
      if (!isRecent) relaxed.push(it);
    }

    // If user requested a themed set (future UI), lightly prefer matching tags.
    function maybePrefer(list) {
      if (!preferredTags.length || !list.length) return list;
      var preferred = [];
      for (var i = 0; i < list.length; i++) {
        if (_hasAnyTag(list[i], preferredTags)) preferred.push(list[i]);
      }
      return preferred.length ? preferred : list;
    }

    var pool = maybePrefer(strict);
    if (!pool.length) pool = maybePrefer(relaxed);
    if (!pool.length) pool = bankItems || [];

    return _pick(ctx && ctx.rng, pool) || null;
  }

  function _validateBank(name, items, opts) {
    opts = _isPlainObject(opts) ? opts : {};
    var allowEmpty = !!opts.allowEmpty;
    var requireSentencePunct = !!opts.requireSentencePunct;

    var issues = [];
    var seen = Object.create(null);
    var count = 0;

    for (var i = 0; i < (items ? items.length : 0); i++) {
      var it = items[i];
      if (!it || typeof it.t !== "string") { issues.push(name + ": item " + i + " missing t"); continue; }
      var text = String(it.t);
      var trimmed = text.replace(/^\s+|\s+$/g, "");
      if (trimmed !== text) issues.push(name + ": item " + i + " has leading/trailing whitespace");
      var collapsed = _collapseWhitespace(text);
      if (collapsed !== text) issues.push(name + ": item " + i + " has repeated whitespace");

      var key = _normalizeTypingAnswer(text);
      if (seen[key]) issues.push(name + ": duplicate (case-insensitive) '" + collapsed + "'");
      seen[key] = true;

      var l = _coerceLevel(it.level);
      if (l < 1 || l > 3) issues.push(name + ": item " + i + " has invalid level");
      if (!Array.isArray(it.tags) || !it.tags.length) issues.push(name + ": item " + i + " missing tags");

      if (requireSentencePunct) {
        var endsOk = /[.?!]$/.test(collapsed);
        if (!endsOk) issues.push(name + ": item " + i + " sentence should end with . ? or !");
      }

      count++;
    }

    if (!allowEmpty && !count) issues.push(name + ": empty bank");
    return { name: name, count: count, issues: issues };
  }

  function _maybeRunDevValidators() {
    try {
      if (typeof window === "undefined" || !window || !window.location) return;
      var search = String(window.location.search || "");
      if (search.indexOf("validatePracticeBanks=1") === -1) return;
      if (!window.console || typeof window.console.log !== "function") return;
      var report = window.__practiceBanksValidate ? window.__practiceBanksValidate() : null;
      window.console.log("[PracticePacks] validatePracticeBanks=1", report);
    } catch (e) {}
  }

  // ---------------------------
  // Helpers: session seed/state
  // ---------------------------
  var _SESSION_SEED_KEY = "bolo.practicePacks.seed.v1";
  var _SESSION_RNGSTATE_KEY = "bolo.practicePacks.rngState.v1";

  function _hasSessionStorage() {
    try {
      return typeof sessionStorage !== "undefined" && sessionStorage;
    } catch (e) {
      return false;
    }
  }

  function _readSessionNumber(key) {
    if (!_hasSessionStorage()) return null;
    try {
      var raw = sessionStorage.getItem(key);
      if (raw == null) return null;
      var n = Number(raw);
      if (!isFinite(n) || isNaN(n)) return null;
      return n;
    } catch (e) {
      return null;
    }
  }

  function _writeSessionNumber(key, value) {
    if (!_hasSessionStorage()) return false;
    try {
      sessionStorage.setItem(key, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  var _SESSION_RECENT_TYPING_NORM_KEY = "bolo.practicePacks.recentTypingNorm.v1";
  var _SESSION_RECENT_TYPING_TAGS_KEY = "bolo.practicePacks.recentTypingTags.v1";
  var _SESSION_LAST_PROMPT_TEXT_NORM_KEY = "bolo.practicePacks.lastPromptTextNorm.v1";

  function _readSessionJson(key, fallback) {
    if (!_hasSessionStorage()) return fallback;
    try {
      var raw = sessionStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function _writeSessionJson(key, value) {
    if (!_hasSessionStorage()) return false;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------------------------
  // Deterministic RNG (optional)
  // ---------------------------
  function _hashStringToUint32(str) {
    // FNV-1a-ish, compact.
    var h = 2166136261;
    str = String(str);
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0);
  }

  function _seedToUint32(seed) {
    if (seed == null) return 0;
    if (typeof seed === "number") return ((seed | 0) >>> 0);
    return _hashStringToUint32(String(seed));
  }

  function _mulberry32Next(state) {
    // Returns { state, value } where value is float in [0,1).
    var t = (state + 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    var out = ((t ^ (t >>> 14)) >>> 0);
    return { state: (state + 0x6D2B79F5) >>> 0, value: out / 4294967296 };
  }

  function _makeRng(seed, rngState) {
    // If seed is provided but rngState is missing, derive a starting state.
    var s = (rngState == null) ? ((_seedToUint32(seed) ^ 0xA5A5A5A5) >>> 0) : ((_seedToUint32(rngState)) >>> 0);
    if (!s) s = 0x12345678;

    return {
      next: function() {
        var r = _mulberry32Next(s);
        s = r.state;
        return r.value;
      },
      nextInt: function(maxExclusive) {
        var m = _toInt(maxExclusive, 0);
        if (m <= 0) return 0;
        return Math.floor(this.next() * m);
      },
      getState: function() {
        return (s >>> 0);
      }
    };
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
    if (expectedNorm.indexOf(" ") !== -1) return false;
    if (userNorm.indexOf(" ") !== -1) return false;
    if (expectedNorm.length < 5) return false;
    return _levenshteinWithin1(expectedNorm, userNorm);
  }

  // ---------------------------
  // Packs (data model)
  // ---------------------------
  function _pick(rng, arr) {
    if (!arr || !arr.length) return null;
    if (!rng) return arr[Math.floor(Math.random() * arr.length)];
    return arr[rng.nextInt(arr.length)];
  }

  function _makeTypingPrompt(packId, difficulty, text, category, paText, tags, features) {
    var q = String(text || "");
    var id = packId + ":" + String(difficulty) + ":" + _normalizeTypingAnswer(q);
    return {
      id: id,
      packId: packId,
      type: "typing",
      difficulty: difficulty,
      questionText: q,
      pa: (typeof paText === "string" && paText.trim()) ? String(paText) : "",
      expectedAnswer: q,
      meta: {
        category: category || "typing",
        isSingleWord: (q.indexOf(" ") === -1),
        length: q.length,
        tags: _normalizeTags(tags),
        features: _isPlainObject(features) ? features : _detectFeatures(q)
      }
    };
  }

  function _makeTypingPromptFromSharedSelector(packId, difficulty) {
    try {
      if (!window.TypingPremium || typeof window.TypingPremium.pickSharedPrompt !== "function") return null;
      var picked = window.TypingPremium.pickSharedPrompt();
      if (!picked || typeof picked.en !== "string") return null;

      var text = String(picked.en || "").trim();
      if (!text) return null;

      var pa = (typeof picked.pa === "string") ? picked.pa : "";
      var band = (typeof picked.band === "string" && picked.band) ? picked.band : "short";

      var prompt = _makeTypingPrompt(packId || "P_TYPING_SHORT_SENTENCES", difficulty, text, "sentence", pa, ["source:typing-shared", "band:" + band], null);
      try {
        if (prompt && prompt.meta) prompt.meta.sharedSelector = true;
      } catch (e0) {}
      return prompt;
    } catch (e1) {
      return null;
    }
  }

  function _buildStructuredTypingBanks() {
    // Canonical fallback banks aligned to packs. These are intentionally modest (MVP) but structured.
    // If TYPING_PROMPTS* globals exist, we will *append* them in a best-effort way.

    var words = [
      // core
      _bankItem("make", 1, ["core", "verbs"], null, "ਬਣਾਉ"),
      _bankItem("help", 1, ["core", "verbs"], null, "ਮਦਦ"),
      _bankItem("play", 1, ["core", "verbs"], null, "ਖੇਡੋ"),
      _bankItem("look", 1, ["core", "verbs"], null, "ਵੇਖੋ"),
      _bankItem("come", 1, ["core", "verbs"], null, "ਆਓ"),
      _bankItem("good", 1, ["core"], null, "ਚੰਗਾ"),
      _bankItem("small", 1, ["core"], null, "ਛੋਟਾ"),
      _bankItem("today", 1, ["core", "time"], null, "ਅੱਜ"),
      // school
      _bankItem("pencil", 1, ["school"], null, "ਪੈਂਸਿਲ"),
      _bankItem("eraser", 1, ["school"], null, "ਰਬੜ"),
      _bankItem("teacher", 1, ["school"], null, "ਅਧਿਆਪਕ"),
      _bankItem("class", 1, ["school"], null, "ਕਲਾਸ"),
      _bankItem("homework", 2, ["school"], null, "ਘਰ ਦਾ ਕੰਮ"),
      _bankItem("page", 1, ["school"], null, "ਸਫ਼ਾ"),
      // home & family
      _bankItem("door", 1, ["home"], null, "ਦਰਵਾਜ਼ਾ"),
      _bankItem("window", 1, ["home"], null, "ਖਿੜਕੀ"),
      _bankItem("kitchen", 2, ["home"], null, "ਰਸੋਈ"),
      _bankItem("mother", 1, ["family"], null, "ਮਾਂ"),
      _bankItem("father", 1, ["family"], null, "ਪਿਤਾ"),
      _bankItem("sister", 1, ["family"], null, "ਭੈਣ"),
      // food
      _bankItem("water", 1, ["food"], null, "ਪਾਣੀ"),
      _bankItem("milk", 1, ["food"], null, "ਦੁੱਧ"),
      _bankItem("rice", 1, ["food"], null, "ਚੌਲ"),
      _bankItem("bread", 1, ["food"], null, "ਰੋਟੀ"),
      _bankItem("apple", 1, ["food"], null, "ਸੇਬ"),
      _bankItem("banana", 1, ["food"], null, "ਕੇਲਾ"),
      // feelings
      _bankItem("happy", 1, ["feelings"], null, "ਖੁਸ਼"),
      _bankItem("sad", 1, ["feelings"], null, "ਉਦਾਸ"),
      _bankItem("tired", 2, ["feelings"], null, "ਥੱਕਿਆ"),
      _bankItem("angry", 2, ["feelings"], null, "ਗੁੱਸੇ"),
      // colors/shapes
      _bankItem("red", 1, ["colors"], null, "ਲਾਲ"),
      _bankItem("blue", 1, ["colors"], null, "ਨੀਲਾ"),
      _bankItem("circle", 1, ["shapes"], null, "ਗੋਲ"),
      _bankItem("square", 2, ["shapes"], null, "ਚੌਰਸ"),
      // numbers/time (words only)
      _bankItem("one", 1, ["numbers"], null, "ਇੱਕ"),
      _bankItem("two", 1, ["numbers"], null, "ਦੋ"),
      _bankItem("ten", 1, ["numbers"], null, "ਦਸ"),
      _bankItem("morning", 1, ["time"], null, "ਸਵੇਰ"),
      _bankItem("night", 1, ["time"], null, "ਰਾਤ"),
      _bankItem("later", 2, ["time"], null, "ਬਾਅਦ ਵਿੱਚ")
    ];

    // Kid-friendly short phrases (ages ~4–8): short, everyday classroom/home language.
    // These are used for typing practice as "phrases" (not necessarily full sentences).
    var phrases = [
      _bankItem("Hello", 1, ["greetings"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Good morning", 1, ["greetings", "time"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Good night", 1, ["greetings", "time"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Please", 1, ["polite"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Thank you", 1, ["polite"], { punct: false, apostrophe: false, numbers: false, caps: true }, "ਧੰਨਵਾਦ"),
      _bankItem("You're welcome", 2, ["polite"], { punct: false, apostrophe: true, numbers: false, caps: true }, null),
      _bankItem("Excuse me", 1, ["polite"], { punct: false, apostrophe: false, numbers: false, caps: true }, "ਮਾਫ਼ ਕਰਨਾ"),
      _bankItem("I'm sorry", 2, ["polite"], { punct: false, apostrophe: true, numbers: false, caps: true }, null),
      _bankItem("My turn", 1, ["play", "school"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Your turn", 1, ["play", "school"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("All done", 1, ["core"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Not yet", 1, ["core"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Try again", 1, ["core", "mindset"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Good job", 1, ["core", "praise"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Be careful", 1, ["core"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Slow down", 1, ["core"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Help me please", 2, ["polite", "requests"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Can you help me?", 2, ["polite", "requests", "questions"], { punct: true, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("Where is it?", 2, ["questions"], { punct: true, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("What is that?", 2, ["questions"], { punct: true, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("I need help", 1, ["school", "requests"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("I don't know", 2, ["core"], { punct: false, apostrophe: true, numbers: false, caps: true }, null),
      _bankItem("I am hungry", 1, ["home", "food"], { punct: false, apostrophe: false, numbers: false, caps: true }, "ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ"),
      _bankItem("I need water", 1, ["home", "food"], { punct: false, apostrophe: false, numbers: false, caps: true }, "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ"),
      _bankItem("I am tired", 1, ["feelings"], { punct: false, apostrophe: false, numbers: false, caps: true }, "ਮੈਂ ਥੱਕ ਗਿਆ/ਗਈ ਹਾਂ"),
      _bankItem("I am happy", 1, ["feelings"], { punct: false, apostrophe: false, numbers: false, caps: true }, null),
      _bankItem("I am sad", 1, ["feelings"], { punct: false, apostrophe: false, numbers: false, caps: true }, null)
    ];

    var sentences = [
      _bankItem("I am ready.", 1, ["grammar:be"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੈਂ ਤਿਆਰ ਹਾਂ।"),
      _bankItem("I am in class.", 1, ["grammar:be", "school"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਹਾਂ।"),
      _bankItem("I have a book.", 1, ["grammar:have", "school"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੇਰੇ ਕੋਲ ਇੱਕ ਕਿਤਾਬ ਹੈ।"),
      _bankItem("This is my bag.", 1, ["grammar:have", "school"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਇਹ ਮੇਰਾ ਬੈਗ ਹੈ।"),
      _bankItem("I like apples.", 1, ["grammar:like", "food"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ।"),
      _bankItem("I like to play.", 1, ["grammar:like", "play"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੈਨੂੰ ਖੇਡਣਾ ਪਸੰਦ ਹੈ।"),
      _bankItem("Can I have water?", 2, ["polite", "requests", "questions"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਕੀ ਮੈਨੂੰ ਪਾਣੀ ਮਿਲ ਸਕਦਾ ਹੈ?"),
      _bankItem("Please help me.", 1, ["polite", "requests"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ।"),
      _bankItem("Where is my pencil?", 2, ["questions", "school"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਮੇਰੀ ਪੈਂਸਿਲ ਕਿੱਥੇ ਹੈ?"),
      _bankItem("What is your name?", 2, ["questions"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?"),
      _bankItem("It is on the table.", 1, ["prepositions"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਇਹ ਮੇਜ਼ ਉੱਤੇ ਹੈ।"),
      _bankItem("Stand near the door.", 2, ["directions", "prepositions", "home"], { punct: true, apostrophe: false, numbers: false, caps: true }, "ਦਰਵਾਜ਼ੇ ਕੋਲ ਖੜ੍ਹੇ ਹੋਵੋ।"),
      _bankItem("I don't know.", 3, ["negation"], { punct: true, apostrophe: true, numbers: false, caps: true }, "ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ।"),
      _bankItem("I can't see it.", 3, ["negation"], { punct: true, apostrophe: true, numbers: false, caps: true }, "ਮੈਂ ਇਹ ਨਹੀਂ ਦੇਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।"),
      _bankItem("I wake up at 7.", 3, ["time"], { punct: true, apostrophe: false, numbers: true, caps: true }, "ਮੈਂ 7 ਵਜੇ ਉੱਠਦਾ/ਉੱਠਦੀ ਹਾਂ।")
    ];

    var paragraphs = [
      _bankItem("Plants need water and light. Roots drink water from the soil. Leaves catch light from the sun.", 1, ["paragraph", "topic:science"], null, null),
      _bankItem("A noun is a person place or thing. A dog is a noun. A school is a noun. Your name is a noun.", 1, ["paragraph", "topic:grammar", "grammar:noun"], null, null),
      _bankItem("In BOLO, pick a track to start. You can read a short story. You can play a game and earn XP.", 1, ["paragraph", "topic:bolo"], null, null),
      _bankItem("I can be kind at school. I can share pencils and crayons. I can use gentle words when I speak.", 1, ["paragraph", "topic:kindness"], null, null),
      _bankItem("Today I feel curious. I ask one good question. I listen to the answer. I learn something new.", 1, ["paragraph", "topic:feelings", "topic:vocab"], null, null),
      _bankItem("A magnet can pull some metals. It does not pull paper or wood. We can test objects and see what happens.", 2, ["paragraph", "topic:science"], null, null),
      _bankItem("A sentence starts with a capital letter. A sentence ends with a period. A sentence tells one clear idea.", 2, ["paragraph", "topic:grammar", "grammar:sentence"], null, null),
      _bankItem("I learned a new word today. The word is brave. Brave means I try even when I feel scared. I can be brave and ask for help.", 2, ["paragraph", "topic:vocab"], null, null),
      _bankItem("When I make a plan, I take one small step. Then I take the next step. Small steps can grow into big progress.", 2, ["paragraph", "topic:skills"], null, null),
      _bankItem("Mia found a smooth stone. She painted a star on it. She left it on the playground to share with someone.", 2, ["paragraph", "topic:story"], null, null),
      _bankItem("If I type the wrong answer, I can try again. I can slow down and check each word. I can fix my mistakes and keep going.", 2, ["paragraph", "topic:bolo", "topic:mindset"], null, null),
      _bankItem("The water cycle has three simple steps. Water can turn into vapor. Vapor can make clouds. Clouds can make rain.", 3, ["paragraph", "topic:science"], null, null)
    ];

    // Scaffolding banks (empty for now; safe defaults).
    // These are intended to back new typing packs without affecting existing ones.
    var animalFacts = [];
    var careerSentences = [];
    

    function _looksLikeFullSentence(text) {
      var t = String(text || "").trim();
      if (!t) return false;

      // Allow imperatives and common auxiliaries/modals.
      if (/^(please\s+)?(go|come|take|look|listen|stop|wait|help|try|start|finish|open|close|keep|put|get|give|make|let|ask|tell|read|write|play|run|walk|eat|drink|sleep|sit|stand|share|hold)\b/i.test(t)) return true;
      if (/\b(am|is|are|was|were|be|been|being|have|has|had|do|does|did|can|could|will|would|shall|should|may|might|must|need|needs|needed)\b/i.test(t)) return true;
      return false;
    }

    function _rewriteSentenceFragmentToSentence(text) {
      var t = _collapseWhitespace(String(text || ""));
      if (!t) return "";

      // Explicit fix: common fragment called out in UX review.
      if (t === "One step at a time." || t === "One step at a time") return "Take it one step at a time.";

      // Common "Label: examples" fragments.
      var m = t.match(/^([A-Za-z][A-Za-z ]{1,30}):\s*(.+)$/);
      if (m) {
        var label = m[1].trim();
        var rest = m[2].trim();

        // Grammar patterns.
        if (/^subject\s*\+\s*verb\s*\+\s*object\.?$/i.test(rest) || /^subject\s*\+\s*verb\s*\+\s*object\.?$/i.test(label)) {
          return "A simple sentence can follow this pattern: subject + verb + object.";
        }

        if (/^present tense$/i.test(label)) return "In the present tense, you can say: " + rest;
        if (/^past tense$/i.test(label)) return "In the past tense, you can say: " + rest;
        if (/^future tense$/i.test(label)) return "In the future tense, you can say: " + rest;
        if (/^singular$/i.test(label)) return "Singular means " + rest;
        if (/^plural$/i.test(label)) return "Plural means " + rest;

        if (/^prepositions$/i.test(label)) return "Common prepositions are " + rest;
        if (/^articles$/i.test(label)) return "The articles are " + rest;
        if (/^colors$/i.test(label)) return "The colors are " + rest;
        if (/^numbers$/i.test(label)) return "The numbers are " + rest;

        if (/^make a negative$/i.test(label)) return "To make a negative sentence, you can say: " + rest;
        if (/^make a question$/i.test(label)) return "To make a question, you can ask: " + rest;
      }

      // Common list-like fragments that end with punctuation.
      if (t === "Comma, then a space." || t === "Comma, then a space") return "After a comma, type one space.";
      if (t === "Slow and steady." || t === "Slow and steady") return "Go slow and steady.";
      if (t === "Up and down." || t === "Up and down") return "Move up and down.";
      if (t === "Near and far." || t === "Near and far") return "Things can be near or far.";
      if (t === "Morning, afternoon, night." || t === "Morning, afternoon, night") return "The parts of the day are morning, afternoon, and night.";
      if (t === "Please and thank you." || t === "Please and thank you") return "Say please and thank you.";

      return t;
    }

    // Best-effort: append any existing prompt pools (legacy format) as level 1–2.
    function appendFromPool(pool, target, kindTag) {
      if (!Array.isArray(pool)) return;
      for (var i = 0; i < pool.length; i++) {
        var it = pool[i] || {};
        var en = (typeof it.en === "string") ? _collapseWhitespace(it.en) : "";
        var pa = (typeof it.pa === "string") ? String(it.pa).trim() : "";
        if (!en) continue;

        if (kindTag === "sentences") {
          en = _rewriteSentenceFragmentToSentence(en);
          if (!_looksLikeFullSentence(en)) continue;
        }

        // Keep it conservative.
        if (en.length < 2 || en.length > 90) continue;
        target.push(_bankItem(en, 2, [kindTag, "legacy"], null, pa));
      }
    }

    try {
      if (typeof window.TYPING_PROMPTS_SHORT_SENTENCES !== "undefined" && Array.isArray(window.TYPING_PROMPTS_SHORT_SENTENCES)) {
        appendFromPool(window.TYPING_PROMPTS_SHORT_SENTENCES, sentences, "sentences");
      } else if (typeof TYPING_PROMPTS_SHORT_SENTENCES !== "undefined" && Array.isArray(TYPING_PROMPTS_SHORT_SENTENCES)) {
        appendFromPool(TYPING_PROMPTS_SHORT_SENTENCES, sentences, "sentences");
      }
    } catch (e0) {}

    try {
      if (typeof window.TYPING_PROMPTS !== "undefined" && Array.isArray(window.TYPING_PROMPTS)) {
        appendFromPool(window.TYPING_PROMPTS, sentences, "sentences");
      } else if (typeof TYPING_PROMPTS !== "undefined" && Array.isArray(TYPING_PROMPTS)) {
        appendFromPool(TYPING_PROMPTS, sentences, "sentences");
      }
    } catch (e1) {}

    // Normalize + dedupe.
    function dedupe(items) {
      var out = [];
      var seen = Object.create(null);
      for (var i = 0; i < items.length; i++) {
        var it = _coerceAnyBankItem(items[i], 1);
        if (!it || typeof it.t !== "string") continue;
        var key = _normalizeTypingAnswer(it.t);
        if (!key) continue;
        if (seen[key]) continue;
        seen[key] = true;
        out.push(it);
      }
      return out;
    }

    var banks = {
      words: dedupe(words),
      phrases: dedupe(phrases),
      sentences: dedupe(sentences),
      paragraphs: dedupe(paragraphs)
    };

    // USMLE Step Top 500 Facts (typing bank)
    // Source data lives in app/data/usmleFacts.js as USMLE_STEP_TOP_500_FACTS.
    // We map it into the internal bank item shape.
    banks.usmleStepTopFacts = dedupe((function() {
      var src = [];
      try {
        if (typeof window !== "undefined" && Array.isArray(window.USMLE_STEP_TOP_500_FACTS)) src = window.USMLE_STEP_TOP_500_FACTS;
        else if (typeof USMLE_STEP_TOP_500_FACTS !== "undefined" && Array.isArray(USMLE_STEP_TOP_500_FACTS)) src = USMLE_STEP_TOP_500_FACTS;
      } catch (eU) {
        src = [];
      }

      var out = [];
      for (var i = 0; i < src.length; i++) {
        var it = src[i] || {};
        var text = (typeof it.text === "string") ? it.text : (typeof it.t === "string" ? it.t : "");
        if (!text) continue;
        var tags = Array.isArray(it.tags) ? it.tags : [];
        // Level 2: show on medium/hard (difficulty>=2), hide on easy.
        out.push(_bankItem(text, 2, ["topic:usmle", "topic:medicine"].concat(tags), null, null));
      }
      return out;
    })());

    banks.animalFacts = dedupe(([
      { text: "Cats have soft paws and sharp claws.", tags: ["topic:animals", "habitat:farm", "scale:small"] },
      { text: "Dogs wag their tails when they feel happy.", tags: ["topic:animals", "habitat:farm", "scale:small"] },
      { text: "Rabbits have long ears that help them hear.", tags: ["topic:animals", "habitat:farm", "scale:small"] },
      { text: "Cows chew grass slowly for a long time.", tags: ["topic:animals", "habitat:farm", "scale:big"] },
      { text: "Horses can run fast across open fields.", tags: ["topic:animals", "habitat:farm", "skill:fast", "scale:big"] },
      { text: "Chickens lay eggs in nests on the farm.", tags: ["topic:animals", "habitat:farm", "scale:small"] },
      { text: "Ducks have waterproof feathers for swimming.", tags: ["topic:animals", "habitat:farm", "skill:can-swim", "scale:small"] },
      { text: "Goats can climb on rocks and small hills.", tags: ["topic:animals", "habitat:farm", "skill:climb", "scale:small"] },
      { text: "Sheep have wool that keeps them warm.", tags: ["topic:animals", "habitat:farm", "scale:big"] },
      { text: "Pigs use their noses to find food.", tags: ["topic:animals", "habitat:farm", "scale:big"] },

      { text: "Squirrels climb trees and store nuts for later.", tags: ["topic:animals", "habitat:forest", "skill:climb", "scale:small"] },
      { text: "Deer have hooves that help them walk quietly.", tags: ["topic:animals", "habitat:forest", "scale:big"] },
      { text: "Owls are nocturnal and active at night.", tags: ["topic:animals", "habitat:forest", "skill:nocturnal", "scale:small"] },
      { text: "Bears have thick fur for cold weather.", tags: ["topic:animals", "habitat:forest", "scale:big"] },
      { text: "Foxes have fluffy tails and quick feet.", tags: ["topic:animals", "habitat:forest", "skill:fast", "scale:small"] },
      { text: "Woodpeckers tap trees to find insects inside.", tags: ["topic:animals", "habitat:forest", "skill:can-fly", "scale:small"] },
      { text: "Raccoons use their paws like little hands.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Beavers build dams to make deep ponds.", tags: ["topic:animals", "habitat:forest", "skill:can-swim", "scale:small"] },
      { text: "Hedgehogs curl up into a tight ball.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Butterflies can fly and taste with their feet.", tags: ["topic:animals", "habitat:forest", "skill:can-fly", "scale:small"] },

      { text: "Dolphins can swim fast and jump over waves.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "skill:fast"] },
      { text: "Whales breathe air at the surface.", tags: ["topic:animals", "habitat:ocean", "scale:big"] },
      { text: "Octopuses have eight arms with strong suckers.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },
      { text: "Sea turtles can swim long distances in oceans.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:big"] },
      { text: "Seahorses swim upright using tiny fins.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Crabs walk sideways on sand near the water.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },
      { text: "Starfish can regrow an arm if needed.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },
      { text: "Penguins can swim well but cannot fly.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Seals rest on rocks and swim in cold water.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:big"] },
      { text: "Clownfish live in coral reefs near the shore.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },

      { text: "Camels store fat in their humps.", tags: ["topic:animals", "habitat:desert", "scale:big"] },
      { text: "Lizards can climb rocks in hot deserts.", tags: ["topic:animals", "habitat:desert", "skill:climb", "scale:small"] },
      { text: "Snakes move without legs across warm sand.", tags: ["topic:animals", "habitat:desert", "scale:small"] },
      { text: "Meerkats stand tall to watch their family.", tags: ["topic:animals", "habitat:desert", "scale:small"] },
      { text: "Scorpions are nocturnal and hide under rocks.", tags: ["topic:animals", "habitat:desert", "skill:nocturnal", "scale:small"] },
      { text: "Desert foxes have big ears that release heat.", tags: ["topic:animals", "habitat:desert", "scale:small"] },
      { text: "Roadrunners can run fast across desert ground.", tags: ["topic:animals", "habitat:desert", "skill:fast", "scale:small"] },
      { text: "Tortoises move slowly and carry their shells.", tags: ["topic:animals", "habitat:desert", "scale:small"] },
      { text: "Cactus wrens build nests inside prickly cactus.", tags: ["topic:animals", "habitat:desert", "skill:can-fly", "scale:small"] },
      { text: "Kangaroo rats get water from the food they eat.", tags: ["topic:animals", "habitat:desert", "scale:small"] },

      { text: "Monkeys can climb trees and swing on vines.", tags: ["topic:animals", "habitat:jungle", "skill:climb", "scale:small"] },
      { text: "Parrots can fly and mimic simple sounds.", tags: ["topic:animals", "habitat:jungle", "skill:can-fly", "scale:small"] },
      { text: "Tigers have stripes that help them blend in.", tags: ["topic:animals", "habitat:jungle", "scale:big"] },
      { text: "Elephants have trunks that pick up food.", tags: ["topic:animals", "habitat:jungle", "scale:big"] },
      { text: "Frogs can breathe through their skin in rain.", tags: ["topic:animals", "habitat:jungle", "scale:small"] },
      { text: "Sloths move slowly and sleep many hours.", tags: ["topic:animals", "habitat:jungle", "scale:small"] },
      { text: "Toucan beaks are big but feel light.", tags: ["topic:animals", "habitat:jungle", "skill:can-fly", "scale:small"] },
      { text: "Gorillas are big animals that live in groups.", tags: ["topic:animals", "habitat:jungle", "scale:big"] },
      { text: "Butterflies drink nectar from bright flowers.", tags: ["topic:animals", "habitat:jungle", "skill:can-fly", "scale:small"] },
      { text: "Crocodiles can swim and float very still.", tags: ["topic:animals", "habitat:jungle", "skill:can-swim", "scale:big"] },

      { text: "Polar bears have thick fur and warm fat.", tags: ["topic:animals", "habitat:arctic", "scale:big"] },
      { text: "Arctic foxes have white fur in winter.", tags: ["topic:animals", "habitat:arctic", "scale:small"] },
      { text: "Reindeer live in cold places and eat plants.", tags: ["topic:animals", "habitat:arctic", "scale:big"] },
      { text: "Walruses have long tusks and thick whiskers.", tags: ["topic:animals", "habitat:arctic", "scale:big"] },
      { text: "Snowy owls can fly silently over snow.", tags: ["topic:animals", "habitat:arctic", "skill:can-fly", "scale:small"] },
      { text: "Seals can swim under ice and breathe air.", tags: ["topic:animals", "habitat:arctic", "skill:can-swim", "scale:big"] },
      { text: "Arctic hares have thick fur and fast legs.", tags: ["topic:animals", "habitat:arctic", "skill:fast", "scale:small"] },
      { text: "Puffins can fly and dive for small fish.", tags: ["topic:animals", "habitat:arctic", "skill:can-fly", "scale:small"] },
      { text: "Huskies pull sleds and love cold weather.", tags: ["topic:animals", "habitat:arctic", "scale:big"] },
      { text: "Narwhals have a long tusk like a horn.", tags: ["topic:animals", "habitat:ocean", "scale:big", "difficulty:hard"] },

      { text: "Ants carry food and work together in lines.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Bees can fly and help flowers make seeds.", tags: ["topic:animals", "habitat:forest", "skill:can-fly", "scale:small"] },
      { text: "Frogs live near ponds and jump very far.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Swans can swim and have long necks.", tags: ["topic:animals", "habitat:forest", "skill:can-swim", "scale:big"] },
      { text: "Hummingbirds can fly and beat wings very fast.", tags: ["topic:animals", "habitat:forest", "skill:can-fly", "skill:fast"] },
      { text: "Bats sleep upside down in caves.", tags: ["topic:animals", "habitat:forest", "skill:nocturnal", "scale:small"] },
      { text: "Spiders make webs to catch tiny insects.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Earthworms help soil stay soft and healthy.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Skunks have stripes and a strong smell.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Porcupines have sharp quills for protection.", tags: ["topic:animals", "habitat:forest", "scale:small", "difficulty:hard"] },

      { text: "Goldfish can swim and remember simple paths.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Hamsters run on wheels and sleep in nests.", tags: ["topic:animals", "habitat:farm", "scale:small"] },
      { text: "Parakeets can fly and chirp in the morning.", tags: ["topic:animals", "habitat:farm", "skill:can-fly", "scale:small"] },
      { text: "Geese can fly in a V shape.", tags: ["topic:animals", "habitat:farm", "skill:can-fly", "scale:big"] },
      { text: "Turkeys have feathers and make gobbling sounds.", tags: ["topic:animals", "habitat:farm", "scale:big"] },
      { text: "Donkeys carry loads and bray very loudly.", tags: ["topic:animals", "habitat:farm", "scale:big"] },
      { text: "Alpacas have soft wool and gentle faces.", tags: ["topic:animals", "habitat:farm", "scale:big"] },
      { text: "Bees make wax to build their honeycomb homes.", tags: ["topic:animals", "habitat:forest", "skill:can-fly", "scale:small"] },
      { text: "Jellyfish can swim by pulsing their bodies.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Sharks must keep moving to breathe well.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:big"] },

      { text: "Manta rays glide through water like flying kites.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:big"] },
      { text: "Lobsters have hard shells and strong claws.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },
      { text: "Oysters can make pearls inside their shells.", tags: ["topic:animals", "habitat:ocean", "scale:small"] },
      { text: "Sea otters can swim and hold hands.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Sardines swim in groups called schools.", tags: ["topic:animals", "habitat:ocean", "skill:can-swim", "scale:small"] },
      { text: "Blue whales are the biggest animals on Earth.", tags: ["topic:animals", "habitat:ocean", "scale:big"] },
      { text: "Jackrabbits can run fast in the desert.", tags: ["topic:animals", "habitat:desert", "skill:fast", "scale:small"] },
      { text: "Vultures can fly high using warm air.", tags: ["topic:animals", "habitat:desert", "skill:can-fly", "scale:big"] },
      { text: "Owls in deserts are nocturnal and quiet.", tags: ["topic:animals", "habitat:desert", "skill:nocturnal", "scale:small"] },
      { text: "Armadillos have armor plates on their backs.", tags: ["topic:animals", "habitat:desert", "scale:small", "difficulty:hard"] },

      { text: "Chameleons change colors to match their surroundings.", tags: ["topic:animals", "habitat:jungle", "scale:small", "difficulty:hard"] },
      { text: "Orangutans climb trees and use tools to eat.", tags: ["topic:animals", "habitat:jungle", "skill:climb", "difficulty:hard"] },
      { text: "Snakes in jungles can climb trees at night.", tags: ["topic:animals", "habitat:jungle", "skill:climb", "skill:nocturnal"] },
      { text: "Termites build tall mounds that have many rooms.", tags: ["topic:animals", "habitat:jungle", "scale:small"] },
      { text: "Hippos stay in water and keep cool.", tags: ["topic:animals", "habitat:jungle", "skill:can-swim", "scale:big"] },
      { text: "Flamingos can stand on one leg to rest.", tags: ["topic:animals", "habitat:ocean", "skill:can-fly", "scale:big"] },
      { text: "Koalas sleep in trees and eat leaves.", tags: ["topic:animals", "habitat:forest", "scale:small"] },
      { text: "Pandas eat bamboo and rest for many hours.", tags: ["topic:animals", "habitat:forest", "scale:big"] },
      { text: "Kangaroos use strong legs to hop very far.", tags: ["topic:animals", "habitat:desert", "skill:fast", "scale:big"] },
      { text: "Peacocks can fly short distances and show bright feathers.", tags: ["topic:animals", "habitat:jungle", "skill:can-fly", "scale:big"] }
    ]).map(function(it) {
      if (!it || typeof it.text !== "string") return null;
      var tags = Array.isArray(it.tags) ? it.tags : [];
      var level = (tags.indexOf("difficulty:hard") !== -1) ? 3 : 1;
      return _bankItem(it.text, level, tags, null, null);
    }));
    banks.careerSentences = dedupe(([
      { text: "A teacher helps students learn each day.", tags: ["topic:jobs", "place:school", "frame:helps"] },
      { text: "A teacher teaches reading and writing at school.", tags: ["topic:jobs", "place:school", "frame:teaches"] },
      { text: "A teacher uses books to share new ideas.", tags: ["topic:jobs", "place:school", "frame:uses", "vocab:tools"] },
      { text: "A librarian helps you find the right book.", tags: ["topic:jobs", "place:library", "frame:helps"] },
      { text: "A librarian works at the library and sorts books.", tags: ["topic:jobs", "place:library", "frame:works"] },
      { text: "A librarian uses a computer to check books out.", tags: ["topic:jobs", "place:library", "frame:uses", "vocab:tools"] },
      { text: "A coach teaches kids how to play as a team.", tags: ["topic:jobs", "place:park", "frame:teaches"] },
      { text: "A coach helps players practice and improve.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A coach uses a whistle to start the game.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "A crossing guard helps children cross the street safely.", tags: ["topic:jobs", "place:school", "frame:helps"] },

      { text: "A nurse helps patients feel calm and cared for.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A nurse works at the hospital with the doctors.", tags: ["topic:jobs", "place:hospital", "frame:works"] },
      { text: "A nurse uses a thermometer to check temperature.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },
      { text: "A doctor helps people stay healthy.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A doctor works in a hospital or clinic.", tags: ["topic:jobs", "place:hospital", "frame:works"] },
      { text: "A doctor uses a stethoscope to listen carefully.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },
      { text: "A dentist helps keep teeth clean and strong.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A dentist works in a clean office with bright lights.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A dentist uses a small mirror to see teeth.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "Doctors use charts to track health.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },

      { text: "A cashier helps you pay for your items.", tags: ["topic:jobs", "place:store", "frame:helps"] },
      { text: "A cashier works at the store near the register.", tags: ["topic:jobs", "place:store", "frame:works"] },
      { text: "A cashier uses a scanner to read barcodes.", tags: ["topic:jobs", "place:store", "frame:uses", "vocab:tools"] },
      { text: "A stocker helps keep shelves neat and full.", tags: ["topic:jobs", "place:store", "frame:helps"] },
      { text: "A stocker works in a store and moves boxes.", tags: ["topic:jobs", "place:store", "frame:works"] },
      { text: "A stocker uses a cart to carry groceries.", tags: ["topic:jobs", "place:store", "frame:uses", "vocab:tools"] },
      { text: "A bagger helps pack groceries with care.", tags: ["topic:jobs", "place:store", "frame:helps"] },
      { text: "A bagger works at the store near the checkout.", tags: ["topic:jobs", "place:store", "frame:works"] },
      { text: "A bagger uses bags to protect food.", tags: ["topic:jobs", "place:store", "frame:uses", "vocab:tools"] },
      { text: "Cashiers work with money and receipts.", tags: ["topic:jobs", "place:store", "frame:works"] },

      { text: "A cook helps make meals for hungry families.", tags: ["topic:jobs", "place:restaurant", "frame:helps"] },
      { text: "A cook works in a restaurant kitchen.", tags: ["topic:jobs", "place:restaurant", "frame:works"] },
      { text: "A cook uses a pan to heat food.", tags: ["topic:jobs", "place:restaurant", "frame:uses", "vocab:tools"] },
      { text: "A baker helps make bread and sweet treats.", tags: ["topic:jobs", "place:restaurant", "frame:helps"] },
      { text: "A baker works early in the morning.", tags: ["topic:jobs", "place:restaurant", "frame:works"] },
      { text: "A baker uses an oven to bake bread.", tags: ["topic:jobs", "place:restaurant", "frame:uses", "vocab:tools"] },
      { text: "A server helps bring food to your table.", tags: ["topic:jobs", "place:restaurant", "frame:helps"] },
      { text: "A server works at a restaurant and smiles.", tags: ["topic:jobs", "place:restaurant", "frame:works"] },
      { text: "A server uses a tray to carry plates.", tags: ["topic:jobs", "place:restaurant", "frame:uses", "vocab:tools"] },
      { text: "Bakers use measuring cups for recipes.", tags: ["topic:jobs", "place:restaurant", "frame:uses", "vocab:tools"] },

      { text: "A farmer helps grow food for many people.", tags: ["topic:jobs", "place:farm", "frame:helps"] },
      { text: "A farmer works on a farm in many seasons.", tags: ["topic:jobs", "place:farm", "frame:works"] },
      { text: "A farmer uses a tractor to move heavy things.", tags: ["topic:jobs", "place:farm", "frame:uses", "vocab:tools"] },
      { text: "A gardener helps plants grow strong and green.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A gardener works in parks and gardens.", tags: ["topic:jobs", "place:park", "frame:works"] },
      { text: "A gardener uses a shovel to dig in soil.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "A groundskeeper helps keep the park clean.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A groundskeeper works in a park every week.", tags: ["topic:jobs", "place:park", "frame:works"] },
      { text: "A groundskeeper uses a rake to gather leaves.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "Farmers use tools to plant seeds.", tags: ["topic:jobs", "place:farm", "frame:uses", "vocab:tools"] },

      { text: "A pilot helps fly planes to new places.", tags: ["topic:jobs", "place:airport", "frame:helps"] },
      { text: "A pilot works at the airport and in the sky.", tags: ["topic:jobs", "place:airport", "frame:works"] },
      { text: "A pilot uses controls to guide the plane.", tags: ["topic:jobs", "place:airport", "frame:uses", "vocab:tools"] },
      { text: "A flight attendant helps passengers feel comfortable.", tags: ["topic:jobs", "place:airport", "frame:helps"] },
      { text: "A flight attendant works on a plane during trips.", tags: ["topic:jobs", "place:airport", "frame:works"] },
      { text: "A flight attendant uses a cart to serve snacks.", tags: ["topic:jobs", "place:airport", "frame:uses", "vocab:tools"] },
      { text: "An airport worker helps guide planes on the ground.", tags: ["topic:jobs", "place:airport", "frame:helps"] },
      { text: "An airport worker works outside near the runway.", tags: ["topic:jobs", "place:airport", "frame:works"] },
      { text: "An airport worker uses cones to mark safe areas.", tags: ["topic:jobs", "place:airport", "frame:uses", "vocab:tools"] },
      { text: "Pilots work with maps and weather reports.", tags: ["topic:jobs", "place:airport", "frame:works"] },

      { text: "A mail carrier helps deliver letters to homes.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "A mail carrier works in a neighborhood.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A mail carrier uses a bag to carry mail.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "A delivery driver helps bring packages to people.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "A delivery driver works on roads all day.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A delivery driver uses a van to carry boxes.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "A bus driver helps students get to school.", tags: ["topic:jobs", "place:school", "frame:helps"] },
      { text: "A bus driver works in the morning and afternoon.", tags: ["topic:jobs", "place:school", "frame:works"] },
      { text: "A bus driver uses mirrors to watch the road.", tags: ["topic:jobs", "place:school", "frame:uses", "vocab:tools"] },
      { text: "Mail carriers use boxes for letters.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },

      { text: "A janitor helps keep buildings clean and safe.", tags: ["topic:jobs", "place:school", "frame:helps"] },
      { text: "A janitor works at a school or an office.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A janitor uses a mop to clean the floor.", tags: ["topic:jobs", "place:school", "frame:uses", "vocab:tools"] },
      { text: "A receptionist helps greet visitors with a smile.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "A receptionist works at an office desk.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A receptionist uses a phone to answer calls.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "An office assistant helps organize papers neatly.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "An office assistant works at a desk with files.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "An office assistant uses folders to sort papers.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "Janitors use brooms to sweep floors.", tags: ["topic:jobs", "place:school", "frame:uses", "vocab:tools"] },

      { text: "A veterinarian helps pets stay healthy.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A veterinarian works at an animal clinic.", tags: ["topic:jobs", "place:hospital", "frame:works"] },
      { text: "A veterinarian uses a scale to weigh pets.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },
      { text: "A pharmacist helps prepare medicine with care.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A pharmacist works at a hospital or store.", tags: ["topic:jobs", "place:hospital", "frame:works"] },
      { text: "A pharmacist uses labels to mark each bottle.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },
      { text: "A therapist helps people practice new skills.", tags: ["topic:jobs", "place:hospital", "frame:helps"] },
      { text: "A therapist works in a clinic and listens.", tags: ["topic:jobs", "place:hospital", "frame:works"] },
      { text: "A therapist uses games to teach calm breathing.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },
      { text: "Nurses use gloves to stay clean.", tags: ["topic:jobs", "place:hospital", "frame:uses", "vocab:tools"] },

      { text: "A mechanic helps fix cars so they run well.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "A mechanic works in a garage with cars.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A mechanic uses a wrench to tighten bolts.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "An electrician helps keep lights working.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "An electrician works in homes and buildings.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "An electrician uses a tool belt to carry tools.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "A plumber helps keep sinks and pipes working.", tags: ["topic:jobs", "place:office", "frame:helps"] },
      { text: "A plumber works in buildings with many pipes.", tags: ["topic:jobs", "place:office", "frame:works"] },
      { text: "A plumber uses a plunger to clear a drain.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },
      { text: "Mechanics use tools to fix engines.", tags: ["topic:jobs", "place:office", "frame:uses", "vocab:tools"] },

      { text: "A park ranger helps protect plants and animals.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A park ranger works in parks and forests.", tags: ["topic:jobs", "place:park", "frame:works"] },
      { text: "A park ranger uses maps to guide visitors.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "A guide helps people learn about the park.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A guide works at the park and leads walks.", tags: ["topic:jobs", "place:park", "frame:works"] },
      { text: "A guide uses signs to share rules and tips.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "A lifeguard helps swimmers follow pool rules.", tags: ["topic:jobs", "place:park", "frame:helps"] },
      { text: "A lifeguard works at a pool and watches carefully.", tags: ["topic:jobs", "place:park", "frame:works"] },
      { text: "A lifeguard uses a whistle to get attention.", tags: ["topic:jobs", "place:park", "frame:uses", "vocab:tools"] },
      { text: "Park rangers work outside in all seasons.", tags: ["topic:jobs", "place:park", "frame:works"] },

      { text: "A shopper helper helps you find items in store.", tags: ["topic:jobs", "place:store", "frame:helps"] },
      { text: "A store helper works near the aisles.", tags: ["topic:jobs", "place:store", "frame:works"] },
      { text: "A store helper uses signs to guide customers.", tags: ["topic:jobs", "place:store", "frame:uses", "vocab:tools"] },
      { text: "A barista helps make drinks with care.", tags: ["topic:jobs", "place:restaurant", "frame:helps"] },
      { text: "A barista works at a cafe and greets people.", tags: ["topic:jobs", "place:restaurant", "frame:works"] },
      { text: "A barista uses a machine to make coffee.", tags: ["topic:jobs", "place:restaurant", "frame:uses", "vocab:tools"] },
      { text: "A cashier helps at a store with quick math.", tags: ["topic:jobs", "place:store", "frame:helps"] },
      { text: "A cook teaches helpers how to follow recipes.", tags: ["topic:jobs", "place:restaurant", "frame:teaches"] },
      { text: "A farmer teaches kids how plants grow.", tags: ["topic:jobs", "place:farm", "frame:teaches"] },
      { text: "Teachers teach numbers, stories, and songs.", tags: ["topic:jobs", "place:school", "frame:teaches"] }
    ]).map(function(it) {
      if (!it || typeof it.text !== "string") return null;
      var tags = Array.isArray(it.tags) ? it.tags : [];
      return _bankItem(it.text, 1, tags, null, null);
    }));

    banks.karnanaBangaFacts = dedupe(([
      // Karnana (village)
      { text: "Karnana is a village in Punjab, India.", tags: ["topic:places", "place:karnana", "topic:punjab"] },
      { text: "Karnana is part of Shaheed Bhagat Singh Nagar district.", tags: ["topic:places", "place:karnana", "place:sbs-nagar"] },
      { text: "Karnana is near the town of Banga.", tags: ["topic:places", "place:karnana", "place:banga"] },
      { text: "Many families in Karnana live close to fields and farms.", tags: ["topic:places", "place:karnana", "topic:farming"] },
      { text: "Farming is an important part of life around Karnana.", tags: ["topic:places", "place:karnana", "topic:farming"] },
      { text: "Wheat is a common crop in many villages near Karnana.", tags: ["topic:farming", "place:karnana", "topic:crops"] },
      { text: "Rice is also grown in some areas with strong irrigation.", tags: ["topic:farming", "topic:water", "topic:crops"] },
      { text: "Irrigation brings water to fields when rain is not enough.", tags: ["topic:water", "topic:farming"] },
      { text: "Canals carry water to farms in many parts of Punjab.", tags: ["topic:water", "topic:punjab", "topic:farming"] },
      { text: "Tube wells bring groundwater up for farming and homes.", tags: ["topic:water", "topic:farming"] },
      { text: "Groundwater is stored under the ground in soil and rocks.", tags: ["topic:water", "topic:science"] },
      { text: "Saving water helps farms and families in the future.", tags: ["topic:water", "topic:community"] },
      { text: "Village lanes in Karnana can be narrow and quiet.", tags: ["topic:places", "place:karnana"] },
      { text: "Small roads connect Karnana to nearby villages and towns.", tags: ["topic:places", "place:karnana", "topic:transport"] },
      { text: "Bicycles and motorbikes are common ways to travel locally.", tags: ["topic:transport", "topic:community"] },
      { text: "Tractors often move along roads near fields during farm work.", tags: ["topic:farming", "topic:transport"] },
      { text: "Trees along field edges can give shade and reduce wind.", tags: ["topic:nature", "topic:farming"] },
      { text: "Many homes in villages have courtyards for family life.", tags: ["topic:community", "topic:home"] },
      { text: "A gurdwara is an important community place in many villages.", tags: ["topic:community", "topic:places"] },
      { text: "Community places bring people together for learning and support.", tags: ["topic:community"] },
      { text: "Local shops sell daily items like soap and notebooks.", tags: ["topic:community", "topic:shopping"] },
      { text: "Weekly markets in the area can sell fruits and vegetables.", tags: ["topic:shopping", "topic:food"] },
      { text: "Students often travel from villages to towns for school.", tags: ["topic:school", "topic:transport"] },
      { text: "Travel helps people reach schools, clinics, and markets.", tags: ["topic:transport", "topic:community"] },
      { text: "Local geography helps students understand their own community.", tags: ["topic:geography", "topic:community"] },
      { text: "Knowing nearby places helps students read maps with confidence.", tags: ["topic:geography", "topic:school"] },
      { text: "Road signs help travelers find towns and important buildings.", tags: ["topic:transport", "topic:safety"] },
      { text: "A bridge helps people cross water and connect roads.", tags: ["topic:transport", "topic:water"] },
      { text: "Fields often change colors across seasons in Punjab.", tags: ["topic:punjab", "topic:nature"] },
      { text: "Many villages in Punjab are surrounded by open farmland.", tags: ["topic:punjab", "topic:farming"] },

      // Banga (town)
      { text: "Banga is a town in Punjab, India.", tags: ["topic:places", "place:banga", "topic:punjab"] },
      { text: "Banga is in Shaheed Bhagat Singh Nagar district.", tags: ["topic:places", "place:banga", "place:sbs-nagar"] },
      { text: "Banga serves nearby villages for shopping and services.", tags: ["topic:community", "place:banga"] },
      { text: "Markets in Banga sell food, clothes, and school supplies.", tags: ["topic:shopping", "place:banga"] },
      { text: "Town streets in Banga can be busier than village lanes.", tags: ["topic:places", "place:banga"] },
      { text: "Banga has schools that many students attend each day.", tags: ["topic:school", "place:banga"] },
      { text: "Town schools can serve students from nearby villages.", tags: ["topic:school", "topic:community"] },
      { text: "Clinics and pharmacies support health care in many towns.", tags: ["topic:health", "topic:community"] },
      { text: "A post office helps people send letters and parcels.", tags: ["topic:community", "topic:services"] },
      { text: "Banks help families save money and manage payments.", tags: ["topic:community", "topic:services"] },
      { text: "Public roads in towns support travel and local trade.", tags: ["topic:transport", "topic:community"] },
      { text: "Bus travel connects Banga with nearby places.", tags: ["topic:transport", "place:banga"] },
      { text: "Transport helps crops and goods move to markets.", tags: ["topic:transport", "topic:farming"] },
      { text: "A library is a place for reading and learning.", tags: ["topic:school", "topic:community"] },
      { text: "A playground gives children space to run and play.", tags: ["topic:community", "topic:play"] },
      { text: "A timetable helps students remember class times.", tags: ["topic:school"] },
      { text: "Notebooks help students practice writing and homework.", tags: ["topic:school"] },
      { text: "Teachers help students learn step by step.", tags: ["topic:school"] },
      { text: "Clear rules help classrooms stay calm and focused.", tags: ["topic:school"] },
      { text: "Clean streets support good health in a town.", tags: ["topic:health", "topic:community"] },
      { text: "Street shops often sell snacks and cold drinks.", tags: ["topic:shopping", "topic:food"] },
      { text: "Fruit sellers and vegetable sellers serve daily needs.", tags: ["topic:food", "topic:shopping"] },
      { text: "Some families visit towns for work, banking, and shopping.", tags: ["topic:community", "topic:services"] },
      { text: "Many people use mobile phones for calls and messages.", tags: ["topic:community"] },
      { text: "Town life can include markets, schools, and busy roads.", tags: ["topic:places", "place:banga"] },
      { text: "Local services help families solve everyday problems.", tags: ["topic:services", "topic:community"] },
      { text: "Knowing your town helps you plan safe travel routes.", tags: ["topic:safety", "topic:community"] },
      { text: "Local place names connect learning to real life.", tags: ["topic:geography", "topic:school"] },
      { text: "Learning about nearby towns builds community awareness.", tags: ["topic:community"] },
      { text: "Good habits in towns include safety, cleanliness, and kindness.", tags: ["topic:community", "topic:safety"] },

      // District + geography
      { text: "Shaheed Bhagat Singh Nagar is a district in Punjab, India.", tags: ["topic:places", "place:sbs-nagar", "topic:punjab"] },
      { text: "The district name honors Shaheed Bhagat Singh.", tags: ["topic:history", "person:bhagat-singh"] },
      { text: "History and geography connect people to places on a map.", tags: ["topic:history", "topic:geography"] },
      { text: "A district is a region that includes many towns and villages.", tags: ["topic:geography"] },
      { text: "District maps can show roads, rivers, and important towns.", tags: ["topic:geography", "topic:maps"] },
      { text: "Punjab is known for plains that support farming.", tags: ["topic:punjab", "topic:farming"] },
      { text: "Plains are large areas of flat land.", tags: ["topic:geography"] },
      { text: "Flat land often makes travel easier by road.", tags: ["topic:geography", "topic:transport"] },
      { text: "Rivers and canals support farming in many parts of Punjab.", tags: ["topic:water", "topic:punjab", "topic:farming"] },
      { text: "A river is a natural flowing waterway.", tags: ["topic:water", "topic:geography"] },
      { text: "A canal is a man-made waterway.", tags: ["topic:water", "topic:geography"] },
      { text: "Water from canals can help fields during dry weeks.", tags: ["topic:water", "topic:farming"] },
      { text: "Monsoon winds bring seasonal rain to many parts of India.", tags: ["topic:weather", "topic:geography"] },
      { text: "Monsoon rain can fill ponds and support crops.", tags: ["topic:weather", "topic:farming"] },
      { text: "Summer days in Punjab can be hot and bright.", tags: ["topic:weather", "topic:punjab"] },
      { text: "Winter mornings in Punjab can be cold and foggy.", tags: ["topic:weather", "topic:punjab"] },
      { text: "Fog can make it harder to see far on roads.", tags: ["topic:weather", "topic:safety"] },
      { text: "A map shows where places are located.", tags: ["topic:maps", "topic:geography"] },
      { text: "A map key explains symbols used on a map.", tags: ["topic:maps", "topic:geography"] },
      { text: "A compass helps people understand direction.", tags: ["topic:maps", "topic:geography"] },
      { text: "North is often shown at the top of a map.", tags: ["topic:maps", "topic:geography"] },
      { text: "East is the direction of sunrise in the morning.", tags: ["topic:maps", "topic:geography"] },
      { text: "West is the direction of sunset in the evening.", tags: ["topic:maps", "topic:geography"] },
      { text: "Roads connect villages to towns and cities.", tags: ["topic:transport", "topic:geography"] },
      { text: "Highways connect bigger cities across long distances.", tags: ["topic:transport", "topic:geography"] },

      // Bhagat Singh
      { text: "Bhagat Singh is remembered for India's freedom movement.", tags: ["topic:history", "person:bhagat-singh"] },
      { text: "Bhagat Singh is often called Shaheed Bhagat Singh.", tags: ["topic:history", "person:bhagat-singh"] },
      { text: "Bhagat Singh was born in a village named Banga.", tags: ["topic:history", "person:bhagat-singh"] },
      { text: "That birthplace village is in present-day Punjab, Pakistan.", tags: ["topic:history", "topic:geography"] },
      { text: "Some place names are shared across different regions.", tags: ["topic:geography"] },
      { text: "Careful map reading helps students avoid place-name confusion.", tags: ["topic:maps", "topic:school"] },
      { text: "Local history can build pride and responsibility in students.", tags: ["topic:history", "topic:school"] },
      { text: "Memorials and museums can teach history through real stories.", tags: ["topic:history"] },
      { text: "Learning history can inspire students to serve their community.", tags: ["topic:history", "topic:community"] },
      { text: "Geography helps students understand land, water, and people together.", tags: ["topic:geography", "topic:school"] },

      // Dr. Gian Daroach
      { text: "Dr. Gian Daroach was born and raised in Karnana, Punjab.", tags: ["topic:role-models", "person:gian-daroach", "place:karnana"] },
      { text: "Dr. Gian Daroach studied medicine in Amritsar, Punjab.", tags: ["topic:role-models", "person:gian-daroach", "topic:health"] },
      { text: "Dr. Gian Daroach practiced internal medicine in Wisconsin, USA for thirty years.", tags: ["topic:role-models", "person:gian-daroach", "topic:health"] },
      { text: "Local role models can inspire students to study and work hard.", tags: ["topic:role-models", "topic:school"] },
      { text: "Education can help students reach goals while staying connected to their roots.", tags: ["topic:school", "topic:community"] }
    ]).map(function(it) {
      if (!it || typeof it.text !== "string") return null;
      var tags = Array.isArray(it.tags) ? it.tags : [];
      return _bankItem(it.text, 1, tags, null, null);
    }));

    function _weatherTagsFor(text) {
      var t = String(text || "").toLowerCase();
      var tags = ["topic:weather"];
      if (/\bsun\b|sunny|sunlight|sunscreen|shade/.test(t)) tags.push("sub:sun");
      if (/cloud|cloudy/.test(t)) tags.push("sub:clouds");
      if (/rain|rainy|umbrella|raincoat|puddle|mud|wet/.test(t)) tags.push("sub:rain");
      if (/wind|windy/.test(t)) tags.push("sub:wind");
      if (/storm|thunder|lightning/.test(t)) tags.push("sub:storm");
      if (/fog|foggy|mist/.test(t)) tags.push("sub:fog");
      if (/\bdew\b/.test(t)) tags.push("sub:dew");
      if (/temperature|thermometer|hot|cold|warm|chilly/.test(t)) tags.push("sub:temperature");
      if (/season|spring|summer|autumn|winter/.test(t)) tags.push("sub:seasons");
      if (/humidity|humid|dry air|water vapor/.test(t)) tags.push("sub:humidity");
      if (/forecast|warning|warnings/.test(t)) tags.push("sub:forecast");
      if (/safe|safer|risky|danger|dangerous|slippery|headlights|roads|walking carefully|staying indoors|closing windows/.test(t)) tags.push("topic:safety");
      if (/flood|flooding/.test(t)) tags.push("sub:flood");
      if (/drought/.test(t)) tags.push("sub:drought");
      return tags;
    }

    banks.weatherFacts = dedupe(([
      "Weather tells what the sky and air are like today.",
      "People use weather words to describe the day.",
      "Sunny weather means the sun is bright in the sky.",
      "Cloudy weather means many clouds cover the sky.",
      "Rainy weather means water falls from clouds.",
      "Windy weather means the air is moving fast.",
      "Hot weather means the air feels warm on your skin.",
      "Cold weather means the air feels cool or chilly.",
      "A weather forecast tells what may happen next.",
      "A forecast helps families plan clothes and travel.",

      "The sun warms the ground and the air.",
      "Sunlight can help wet ground dry faster.",
      "Shade can feel cooler than direct sunlight.",
      "Clouds can block some sunlight.",
      "Clouds are made of tiny drops of water.",
      "Some clouds look white and fluffy.",
      "Some clouds look gray and thick.",
      "Dark clouds can bring rain later.",
      "Wind can push clouds across the sky.",
      "Wind can make flags move and trees sway.",

      "Rain makes plants and grass grow.",
      "Rain fills ponds, rivers, and lakes.",
      "Rain can make the ground muddy.",
      "Mud can make shoes dirty and heavy.",
      "Puddles form when rainwater collects on the ground.",
      "Puddles can hide small holes in the road.",
      "Wet floors and wet roads can be slippery.",
      "Walking carefully helps prevent slipping.",
      "An umbrella helps keep rain off your head.",
      "A raincoat helps keep clothes dry.",

      "Thunder and lightning can happen in storms.",
      "Lightning is a bright flash in the sky.",
      "Thunder is the loud sound after lightning.",
      "Storms can bring strong wind and heavy rain.",
      "Staying indoors can be safer during a storm.",
      "Open fields can be risky during lightning.",
      "Tall trees can be risky during lightning.",
      "Strong winds can move loose objects.",
      "Closing windows can help during strong winds.",
      "Weather warnings help people stay safe.",

      "Fog is a cloud close to the ground.",
      "Fog can make far things hard to see.",
      "Foggy mornings can make roads dangerous.",
      "Headlights help drivers see better in fog.",
      "Mist is light fog in the air.",
      "Dew is tiny water drops on grass in the morning.",
      "Dew forms when air cools near the ground.",
      "Cool mornings can become warmer later in the day.",
      "Weather can change from morning to afternoon.",
      "Looking at the sky helps you notice changes.",

      "Temperature tells how hot or cold it is.",
      "A thermometer measures temperature.",
      "Warm clothes help the body stay warm.",
      "A jacket helps on cold and windy days.",
      "Gloves help keep fingers warm in winter.",
      "A hat can help keep the head warm in cold weather.",
      "Drinking water helps the body on hot days.",
      "Resting in shade helps on very hot days.",
      "Sunscreen helps protect skin in strong sun.",
      "A cap can shade your face on sunny days.",

      "Seasons are times of the year with different weather.",
      "Spring can bring new leaves and flowers.",
      "Spring weather can change quickly.",
      "Summer can bring hot days and strong sunshine.",
      "Summer afternoons can feel very warm.",
      "Autumn can bring cooler air and falling leaves.",
      "Winter can bring cold mornings and warm blankets.",
      "Rainy season can bring more rainy days.",
      "Season changes can change what we wear.",
      "Season changes can change what foods grow.",

      "Humidity means water vapor is in the air.",
      "Humid air can feel sticky on the skin.",
      "Dry air can make skin feel rough.",
      "Wind can make hot days feel cooler.",
      "Wind can make cold days feel colder.",
      "Clouds can bring shade and cooler air.",
      "Clear skies can bring bright sunshine.",
      "Clear nights can feel cooler than cloudy nights.",
      "Air can carry heat and moisture around.",
      "Weather happens because the air is always moving.",

      "Flooding can happen after very heavy rain.",
      "Flood water can cover roads and fields.",
      "Staying away from flood water is safer.",
      "A drought is a long time with little rain.",
      "Drought can make soil dry and hard.",
      "Saving water helps during dry times.",
      "Plants need water, sunlight, and air to grow.",
      "Farmers watch weather to protect crops.",
      "Weather affects what people do each day.",
      "Learning weather words helps you talk about the day."
    ]).map(function(text) {
      if (typeof text !== "string") return null;
      return _bankItem(text, 1, _weatherTagsFor(text), null, null);
    }));

    banks.agricultureBank01 = dedupe(([
      "A farm is a place where food is grown.",
      "Farmers grow crops in fields.",
      "Farmers also take care of animals.",
      "A crop is a plant grown for food.",
      "Wheat is a crop.",
      "Rice is a crop.",
      "Corn is a crop.",
      "A seed is small but it can grow.",
      "Seeds need water to grow.",
      "Seeds need sunlight to grow.",
      "Seeds need air to grow.",
      "Soil helps plants grow strong roots.",
      "Roots hold the plant in the soil.",
      "Roots drink water from the soil.",
      "A stem holds the plant up.",
      "Leaves help the plant make food.",
      "Flowers can grow on some plants.",
      "Fruits can grow after flowers.",
      "Vegetables can grow in gardens and fields.",
      "Farmers plant seeds in the soil.",
      "Farmers water the plants.",
      "Rain can help water the fields.",
      "Too little rain can make soil dry.",
      "Too much rain can flood a field.",
      "Farmers watch the weather.",
      "Irrigation brings water to fields.",
      "A canal can carry water to farms.",
      "A tube well can bring water from the ground.",
      "A tractor helps farmers do heavy work.",
      "A plow helps turn the soil.",
      "Turning soil helps prepare for planting.",
      "Weeds are plants that farmers do not want.",
      "Weeds can steal water from crops.",
      "Farmers remove weeds to protect crops.",
      "Some insects can hurt plants.",
      "Some insects can help plants.",
      "Bees can help flowers make fruit.",
      "A scarecrow can scare birds away.",
      "A fence can help protect a field.",
      "Farm animals can live on a farm.",
      "A cow gives milk.",
      "A buffalo gives milk.",
      "A goat can give milk.",
      "Chickens can lay eggs.",
      "A hen is a female chicken.",
      "A chick is a baby chicken.",
      "Farmers feed farm animals every day.",
      "Animals need clean water too.",
      "A barn is a place for animals or tools.",
      "A tool helps a farmer work faster.",
      "Harvest means collecting crops from the field.",
      "Farmers harvest crops when they are ready.",
      "Grain is the seed part of some crops.",
      "Wheat grains can make flour.",
      "Flour can be used to make bread or roti.",
      "Rice grains can be cooked as food.",
      "Vegetables are eaten fresh or cooked.",
      "Fruits can be sweet and juicy.",
      "Milk can be used to make curd.",
      "Cows need grass and fodder to eat.",
      "Fodder is food for farm animals.",
      "Straw can be used for animals.",
      "A farmer works hard in every season.",
      "Spring can be a planting time.",
      "Summer can be hot for farm work.",
      "Rainy days can help crops grow.",
      "Winter can be cold in the mornings.",
      "Farmers store grain to keep it safe.",
      "A sack can hold grains.",
      "A market is where farmers sell crops.",
      "A truck can carry crops to the market.",
      "Fresh food can come from farms.",
      "Farm work starts early in the morning.",
      "Farmers keep fields clean and healthy.",
      "Healthy soil helps grow healthy plants.",
      "Compost can help soil become rich.",
      "Compost is made from old leaves and food waste.",
      "Worms can help break down compost.",
      "Water is important for every living thing.",
      "Sunlight helps plants grow.",
      "Plants grow slowly day by day.",
      "A garden is a small place to grow plants.",
      "A field is a large place to grow crops.",
      "A pond can store water for animals and farms.",
      "A river can give water to farms and towns.",
      "A canal is made by people to move water.",
      "Farmers use careful steps to grow food.",
      "Growing food helps families and communities.",
      "Food from farms helps people stay healthy.",
      "We should not waste food.",

      "Agriculture means growing crops and raising animals for food.",
      "Farmers plan their work by season and by weather.",
      "A crop cycle includes planting, growing, and harvesting.",
      "Soil quality affects how well crops can grow.",
      "Healthy soil contains air, water, and nutrients.",
      "Nutrients are helpful substances that plants need to grow.",
      "Compost adds nutrients back into the soil.",
      "Manure from animals can also improve soil.",
      "Farmers often mix compost into soil before planting.",
      "Loose soil helps roots spread and take in water.",
      "Seeds can be planted in rows to keep a field organized.",
      "Spacing plants helps each plant get enough sunlight.",
      "Sunlight helps leaves make food for the plant.",
      "This plant food making process supports growth and fruit.",
      "Too much shade can slow a plants growth.",
      "Water moves through soil to reach plant roots.",
      "Overwatering can harm roots by removing air from soil.",
      "Dry soil can crack and make it hard for seeds to sprout.",
      "Farmers check fields often to notice problems early.",
      "Early care can prevent small problems from becoming big ones.",
      "Irrigation is used when rain does not arrive on time.",
      "Canals can carry water from rivers to far fields.",
      "A tube well pulls groundwater from under the ground.",
      "A pump can move water through pipes to crops.",
      "Sprinklers spread water like light rain over plants.",
      "Drip irrigation sends water slowly near the roots.",
      "Drip irrigation can save water in dry weather.",
      "Farmers choose irrigation methods based on the crop.",
      "Water management helps protect crops and the environment.",
      "Saving water supports farms for future years.",
      "Weeds compete with crops for water, space, and sunlight.",
      "Weeding keeps crops stronger and healthier.",
      "Some weeds are removed by hand or small tools.",
      "Some weeds are controlled by machines in large fields.",
      "Pests are insects or animals that damage crops.",
      "Pests can eat leaves, stems, or fruit.",
      "Farmers use safe methods to protect plants from pests.",
      "Natural helpers like ladybugs can eat harmful insects.",
      "Birds can help by eating some insects in fields.",
      "Farmers try to protect crops while keeping nature balanced.",
      "A tractor provides power for many farm machines.",
      "A plow turns soil to prepare a field for planting.",
      "A harrow breaks soil into smaller pieces after plowing.",
      "A seed drill can place seeds evenly in rows.",
      "Even planting helps crops grow more uniformly.",
      "Tools and machines save time during busy seasons.",
      "Farmers also use simple tools like sickles and spades.",
      "A sickle can cut some crops during harvest.",
      "Machines must be used carefully for safety.",
      "Safety rules protect farmers, families, and helpers.",
      "Harvest happens when a crop is fully grown and ready.",
      "Wheat is harvested when the plants turn golden.",
      "Rice is harvested when the grains are firm and mature.",
      "After harvest, grain is separated from the plant.",
      "Threshing means separating grain from stalks and husks.",
      "Winnowing means removing lighter chaff from heavier grain.",
      "Clean grain is stored to keep it safe and dry.",
      "Dry storage helps prevent spoilage and insects.",
      "Farmers use sacks, bins, or storage rooms for grain.",
      "Careful storage protects food for many months.",
      "Many crops become products that people use every day.",
      "Wheat grain can be milled into flour.",
      "Flour can be used for roti, bread, or noodles.",
      "Rice grain can be cooked or ground into rice flour.",
      "Sugar comes from sugarcane in some regions.",
      "Oil can come from crops like mustard or sunflower.",
      "Cotton is a crop used to make cloth.",
      "Fruits and vegetables provide vitamins and minerals.",
      "Fresh food supports strong bodies and healthy minds.",
      "Farmers help feed many families through their work.",
      "Dairy farming focuses on milk and milk products.",
      "Cows and buffaloes need clean water every day.",
      "Animals also need shade and clean living spaces.",
      "Fodder is grown or collected to feed animals.",
      "Green fodder can come from grass and leafy plants.",
      "Dry fodder can come from straw and stored feed.",
      "Farm animals need regular care to stay healthy.",
      "A veterinarian helps treat sick animals.",
      "Clean barns can reduce sickness in animals.",
      "Good animal care improves milk and farm success.",
      "A market is where crops and goods are bought and sold.",
      "Farmers may sell crops in local markets or big markets.",
      "Transportation moves crops from fields to markets.",
      "Trucks can carry sacks of grain and boxes of vegetables.",
      "Some crops must be sold quickly to stay fresh.",
      "Cold storage helps keep fruits and vegetables fresh longer.",
      "Packing protects fruits and vegetables during travel.",
      "Careful handling reduces waste and damage.",
      "Less food waste helps families and communities.",
      "Respecting food begins with respecting farm work.",
      "Weather can affect farming in many ways.",
      "Rain at the right time helps seeds sprout and grow.",
      "Strong storms can damage crops and knock plants down.",
      "Heat waves can dry soil and stress plants.",
      "Cold nights can harm some sensitive crops.",
      "Farmers watch forecasts to plan watering and harvest.",
      "Crop rotation means changing crops in the same field over time.",
      "Crop rotation can help reduce pests and improve soil.",
      "Planting trees near fields can reduce wind and erosion.",
      "Erosion happens when wind or water carries soil away.",
      "Mulch can help keep soil moist.",
      "Mulch can help stop weeds from growing.",
      "A greenhouse can protect plants from cold weather.",
      "A nursery is a place where young plants can grow.",
      "Seedlings are young plants that need gentle care.",
      "A farmer can use a hose to water small plants.",
      "A water tank can store water for dry days.",
      "A clean tool can work better and last longer.",
      "A farmer can dry grain in the sun before storage.",
      "A farm needs teamwork during busy harvest days."
    ]).map(function(text) {
      if (typeof text !== "string") return null;
      return _bankItem(text, 1, ["topic:agriculture", "topic:farming"], null, null);
    }));

    banks.punjabiCities = ([
      "Punjab is a state in northern India.",
      "Punjab has many cities, towns, and villages.",
      "Cities in Punjab are connected by roads and highways.",
      "Trains and buses help people travel between cities in Punjab.",
      "Markets in Punjab sell food, clothes, and school supplies.",
      "Many people in Punjab use Punjabi and English words each day.",
      "A map helps students find cities and towns.",
      "Road signs help travelers choose the correct route.",
      "Learning city names helps with travel and directions.",
      "Learning local places helps students feel confident in their region.",
      "Karnana is a village in Punjab, India.",
      "Karnana is near the town of Banga.",
      "Karnana has homes close to fields and farms.",
      "Farming work is common around Karnana.",
      "Local roads connect Karnana to nearby villages.",
      "People from Karnana travel to nearby towns for shopping and services.",
      "Students from Karnana may travel to town schools and coaching centers.",
      "A gurdwara is an important community place in many villages like Karnana.",
      "Village life often includes family, farms, and community events.",
      "Knowing Karnana on a map helps connect learning to real life.",
      "Banga is a town in Punjab, India.",
      "Banga has markets and shops for daily needs.",
      "Banga connects nearby villages with services like schools and clinics.",
      "Banga has bus travel for nearby routes.",
      "Banga streets can be busier than village lanes.",
      "Banga is smaller than the biggest cities in Punjab.",
      "Banga is a useful town name to recognize on road signs.",
      "Many people visit Banga for shopping, school work, or banking.",
      "Town markets often have fruit, vegetables, and household goods.",
      "Learning about Banga helps students understand local travel.",
      "Chandigarh is a planned city and a shared capital for Punjab and Haryana.",
      "Chandigarh has many government offices and large public buildings.",
      "Banga is a smaller town, while Chandigarh is a large capital city.",
      "Travel from Banga to Chandigarh usually takes more time than local travel.",
      "Ludhiana is a major city with many factories and businesses.",
      "Ludhiana is much larger than Banga in size and population.",
      "Jalandhar is a major city and is larger than Banga.",
      "Jalandhar is known for sports goods and busy markets.",
      "Chandigarh is more planned, while Banga feels more local and small.",
      "Ludhiana has more large industries than Banga.",
      "Mohali is next to Chandigarh and is part of the tri city area.",
      "Mohali has many offices, schools, and sports facilities.",
      "Mohali is closer to Chandigarh than most Punjab cities are.",
      "Rupnagar is also called Ropar.",
      "Rupnagar is near the Sutlej River.",
      "Rupnagar is known for education and institutions in the area.",
      "Patiala is a major city in southeastern Punjab.",
      "Patiala is known for its history and old royal buildings.",
      "Patiala is an important cultural city in Punjab.",
      "Patiala has schools, colleges, and busy local markets.",
      "Ludhiana is one of the largest cities in Punjab.",
      "Ludhiana is an important industrial and business city.",
      "Ludhiana has many factories and workshops.",
      "Ludhiana is also known for education and sports facilities.",
      "Punjab Agricultural University is located in Ludhiana.",
      "Ludhiana is a key city for jobs and trade in Punjab.",
      "Jalandhar is a major city in the Doaba region of Punjab.",
      "Jalandhar is known for sports goods and manufacturing.",
      "Jalandhar has busy roads, markets, and many schools.",
      "Jalandhar connects many nearby towns by road and rail.",
      "Hoshiarpur is a city known for education in the region.",
      "Hoshiarpur has many schools, colleges, and busy markets.",
      "Kapurthala is known for beautiful buildings and palaces.",
      "Kapurthala is a district headquarters city in Punjab.",
      "Moga is a district headquarters city in Punjab.",
      "Moga has grain markets and many farming towns nearby.",
      "Sangrur is a city in the Malwa region of Punjab.",
      "Sangrur is surrounded by farming areas and local markets.",
      "Bathinda is a major city in the Malwa region of Punjab.",
      "Bathinda is an important rail and road junction in Punjab.",
      "Amritsar is one of the most famous cities in Punjab.",
      "The Golden Temple is located in Amritsar.",
      "Amritsar is a major cultural and tourist center in Punjab.",
      "Gurdaspur is a city in northern Punjab.",
      "Gurdaspur district is between the Ravi and Beas rivers.",
      "Firozpur is a city in Punjab near the border region.",
      "Firozpur has a large cantonment area and important rail links.",
      "Pathankot is a city near the foothills in northern Punjab.",
      "Pathankot is a travel gateway toward Himachal Pradesh and Jammu.",
      "Learning major Punjab cities helps students understand maps and travel.",

      "Karnana is a village, while Banga is a town.",
      "A village is usually quieter than a busy town.",
      "Banga has more shops than a small village.",
      "Banga offers more services than many nearby villages.",
      "People from villages often visit Banga for daily needs.",
      "Village roads are often narrower than town roads.",
      "Town streets can have more traffic than village lanes.",
      "A town market usually has more variety than a small shop.",
      "A bus stand helps people travel from a town to other places.",
      "A railway station helps people travel between bigger towns and cities.",
      "Chandigarh is a large capital city, while Banga is a smaller town.",
      "Chandigarh has many government offices and public buildings.",
      "Chandigarh is known for planned roads and organized sectors.",
      "Mohali is close to Chandigarh and grows quickly.",
      "Mohali and Chandigarh are part of the tri city area.",
      "Many families travel to Chandigarh for big hospitals and offices.",
      "Many families travel to Chandigarh for big shopping areas.",
      "Chandigarh usually has more traffic than smaller Punjab towns.",
      "Chandigarh has many parks and public spaces.",
      "Learning the capital city helps students understand state maps.",
      "Ludhiana is a large city, and Banga is a smaller town.",
      "Ludhiana is known for business, factories, and trade.",
      "Ludhiana has more industries than most towns in Punjab.",
      "Ludhiana has more large roads and flyovers than small towns.",
      "Many people travel to Ludhiana for jobs and markets.",
      "Ludhiana is an important city for buying and selling goods.",
      "Ludhiana is a key place for education and sports training.",
      "Ludhiana is often busier than Jalandhar during work hours.",
      "Ludhiana connects many places by road and rail.",
      "Big cities often have more hospitals than small towns.",
      "Jalandhar is a major city, and it is larger than Banga.",
      "Jalandhar is known for sports goods and manufacturing.",
      "Jalandhar has many schools, colleges, and coaching centers.",
      "Jalandhar has many markets and busy road crossings.",
      "Jalandhar Cantonment is an important area near the city.",
      "Jalandhar has more factories than many smaller towns.",
      "Jalandhar and Ludhiana are both important Punjab cities.",
      "Ludhiana is more industrial, while Jalandhar is strong in sports goods.",
      "Chandigarh is the capital area, while Jalandhar is a major city center.",
      "Banga is closer to local village life than a big city like Jalandhar.",
      "Amritsar is famous for the Golden Temple.",
      "Amritsar is an important cultural and tourist city in Punjab.",
      "Amritsar is more tourist focused than many other Punjab cities.",
      "Patiala is known for history and royal buildings.",
      "Patiala is known for Punjabi culture and traditional style.",
      "Bathinda is an important city in the Malwa region.",
      "Bathinda has strong rail links in southern Punjab.",
      "Firozpur is known for its cantonment and border region location.",
      "Gurdaspur is a northern Punjab district area with rivers nearby.",
      "Pathankot is a travel gateway toward hills and mountains.",
      "Hoshiarpur is known for education and busy markets.",
      "Hoshiarpur is in the Doaba area of Punjab.",
      "Kapurthala is known for historic buildings and palaces.",
      "Kapurthala is a district headquarters city in Punjab.",
      "Moga is a district headquarters city with grain markets.",
      "Sangrur is a district headquarters city in the Malwa region.",
      "Rupnagar is near the Sutlej River in Punjab.",
      "Rupnagar is also called Ropar in common use.",
      "Cities and towns grow where roads and markets bring people together.",
      "Towns often serve nearby villages with schools and clinics.",
      "A district includes many towns and villages.",
      "Shaheed Bhagat Singh Nagar is a district in Punjab.",
      "District names help people organize places on a map.",
      "Majha, Doaba, and Malwa are region names inside Punjab.",
      "Doaba is known as a region between rivers in Punjab.",
      "A region name can help students learn where places belong.",
      "A highway connects important cities over long distances.",
      "A route is the path taken to travel from one place to another.",
      "Road signs help drivers choose the correct direction.",
      "A landmark helps people recognize where they are.",
      "A market is a common center of town life.",
      "A bus route connects towns with regular travel.",
      "A train route connects cities with stations along the way.",
      "A junction is a place where roads meet and cross.",
      "A crossing is a place where traffic must move carefully.",
      "A flyover helps traffic move above a busy crossing.",
      "A bridge connects roads over water or drains.",
      "Maps can show roads, rivers, and railway lines.",
      "A map key explains symbols like roads and buildings.",
      "Learning map words helps students understand travel language.",
      "Local comparisons help students remember places more clearly.",
      "Chandigarh is planned, while many older cities grew more naturally.",
      "Banga is local and small, while Ludhiana is large and busy.",
      "Banga is smaller than Jalandhar, Ludhiana, and Amritsar.",
      "Jalandhar and Ludhiana are both important for jobs and trade.",
      "Amritsar is famous for a major Sikh shrine.",
      "Pathankot is closer to hill travel routes than many Punjab cities.",
      "Firozpur is closer to the border region than Chandigarh.",
      "Towns connect village life to city life through roads and markets.",
      "Learning Punjab city names builds confidence for travel and reading signs.",

      "Chandigarh is often a starting point for travel in Punjab.",
      "Many families travel from small towns to Chandigarh for big services.",
      "Chandigarh is more planned than many older Punjab cities.",
      "Mohali is closer to Chandigarh than Ludhiana is.",
      "Kharar is a town near Chandigarh and Mohali.",
      "Rupnagar is closer to Chandigarh than Amritsar is.",
      "Patiala is closer to Chandigarh than Bathinda is in many trips.",
      "Ludhiana is a bigger business city than most towns in Punjab.",
      "Jalandhar and Ludhiana both have busy markets and main roads.",
      "Amritsar is more tourist focused than Ludhiana.",
      "Amritsar is known for history and pilgrimage travel.",
      "Patiala is known for culture and traditional dress styles.",
      "Bathinda is an important city in southern Punjab.",
      "Pathankot is closer to hill routes than Bathinda is.",
      "Gurdaspur and Pathankot are in northern Punjab.",
      "Firozpur is closer to the border region than Patiala is.",
      "Hoshiarpur and Jalandhar are in the Doaba area of Punjab.",
      "Doaba includes many towns between major rivers in Punjab.",
      "Malwa includes many large farming areas in southern Punjab.",
      "Majha includes important cities in northwestern Punjab.",
      "A district headquarters is a place where many offices are located.",
      "A tehsil is a local area used for administration.",
      "A city usually has more hospitals than a small town.",
      "A town usually has more shops than a village.",
      "A village often has farms close to homes.",
      "Highways help trucks carry goods between cities.",
      "A bus route can connect villages to the nearest town.",
      "A train station helps people travel long distances.",
      "Learning comparisons helps students remember place names.",
      "Punjab city knowledge helps students read signboards and maps."
    ]).map(function(text) {
      if (typeof text !== "string") return null;
      return _bankItem(text, 1, ["topic:places", "topic:punjab", "topic:maps"], null, null);
    });
    return banks;
  }

  var _TYPING_BANKS_V1 = _buildStructuredTypingBanks();

  // Expose dev-only validator.
  window.__practiceBanksValidate = function() {
    var rep = {
      words: _validateBank("words", _TYPING_BANKS_V1.words, { allowEmpty: false, requireSentencePunct: false }),
      phrases: _validateBank("phrases", _TYPING_BANKS_V1.phrases, { allowEmpty: false, requireSentencePunct: false }),
      sentences: _validateBank("sentences", _TYPING_BANKS_V1.sentences, { allowEmpty: false, requireSentencePunct: true }),
      paragraphs: _validateBank("paragraphs", _TYPING_BANKS_V1.paragraphs, { allowEmpty: false, requireSentencePunct: true }),
      usmleStepTopFacts: _validateBank("usmleStepTopFacts", _TYPING_BANKS_V1.usmleStepTopFacts || [], { allowEmpty: true, requireSentencePunct: true })
    };
    rep.ok = (!rep.words.issues.length && !rep.phrases.issues.length && !rep.sentences.issues.length && !rep.paragraphs.issues.length);
    return rep;
  };

  _maybeRunDevValidators();

  function _genTypingWords(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var it = _chooseFromBank(ctx, _TYPING_BANKS_V1.words, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);
    var text = n && n.text ? n.text : "hello";
    return _makeTypingPrompt(ctx.packId, d, text, "word", (it && it.pa) ? it.pa : "", n ? n.tags : null, (it && it.features) ? it.features : null);
  }

  function _genTypingPhrases(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var it = _chooseFromBank(ctx, _TYPING_BANKS_V1.phrases, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);
    var text = n && n.text ? n.text : "Thank you";
    return _makeTypingPrompt(ctx.packId, d, text, "phrase", (it && it.pa) ? it.pa : "", n ? n.tags : null, (it && it.features) ? it.features : null);
  }

  function _genTypingShortSentences(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var it = _chooseFromBank(ctx, _TYPING_BANKS_V1.sentences, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);
    var text = n && n.text ? n.text : "I can do this.";
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", n ? n.tags : null, (it && it.features) ? it.features : null);
  }

  function _genTypingParagraphs(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var it = _chooseFromBank(ctx, _TYPING_BANKS_V1.paragraphs, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);
    var text = n && n.text ? n.text : "I can type a short paragraph.";
    return _makeTypingPrompt(ctx.packId, d, text, "paragraph", (it && it.pa) ? it.pa : "", n ? n.tags : null, (it && it.features) ? it.features : null);
  }

  function _genTypingAnimalFacts(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.animalFacts)) ? _TYPING_BANKS_V1.animalFacts : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    // Safe fallback while bank is empty.
    var fallback = "Cats have whiskers.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:animals"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingCareerSentences(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.careerSentences)) ? _TYPING_BANKS_V1.careerSentences : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    // Safe fallback while bank is empty.
    var fallback = "A firefighter helps people.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:jobs"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingKarnanaBangaFacts(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.karnanaBangaFacts)) ? _TYPING_BANKS_V1.karnanaBangaFacts : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    var fallback = "Karnana is a village in Punjab, India.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:places", "topic:punjab"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingWeatherFacts(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.weatherFacts)) ? _TYPING_BANKS_V1.weatherFacts : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    var fallback = "Weather tells what the sky and air are like today.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:weather"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingAgricultureBank01(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.agricultureBank01)) ? _TYPING_BANKS_V1.agricultureBank01 : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    var fallback = "Farms grow crops to feed people.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:agriculture", "topic:farming"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingPunjabiCities(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.punjabiCities)) ? _TYPING_BANKS_V1.punjabiCities : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    var fallback = "Punjab has many cities, towns, and villages.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:places", "topic:punjab", "topic:maps"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _genTypingUsmleStepTopFacts(ctx) {
    var d = ctx.difficulty;
    var state = _isPlainObject(ctx && ctx.state) ? ctx.state : {};
    var recentTexts = Array.isArray(state.recentTypingNorm) ? state.recentTypingNorm : [];
    var recentTags = Array.isArray(state.recentTypingTags) ? state.recentTypingTags : [];

    var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1.usmleStepTopFacts)) ? _TYPING_BANKS_V1.usmleStepTopFacts : [];
    var it = _chooseFromBank(ctx, bank, { recentTexts: recentTexts, recentTags: recentTags });
    var n = normalizePracticeItem(it);

    var fallback = "The heart has four chambers.";
    var text = (n && n.text) ? n.text : fallback;
    var tags = (n && n.tags && n.tags.length) ? n.tags : ["topic:usmle", "topic:medicine"];
    var features = (it && it.features) ? it.features : _detectFeatures(text);
    return _makeTypingPrompt(ctx.packId, d, text, "sentence", (it && it.pa) ? it.pa : "", tags, features);
  }

  function _makePatternPrompt(packId, difficulty, family, seq, expected, meta) {
    var question = "What comes next? " + seq.join(", ");
    var id = packId + ":" + String(difficulty) + ":" + family + ":" + seq.join("_") + ":" + String(expected);
    return {
      id: id,
      packId: packId,
      type: "pattern",
      difficulty: difficulty,
      questionText: question,
      expectedAnswer: String(expected),
      meta: (function() {
        var out = { family: family, sequence: seq.slice(0) };
        if (_isPlainObject(meta)) {
          for (var k in meta) out[k] = meta[k];
        }
        return out;
      })()
    };
  }

  function _randIntInclusive(rng, min, max) {
    min = _toInt(min, 0);
    max = _toInt(max, 0);
    if (max < min) { var t = min; min = max; max = t; }
    if (!rng) return (min + Math.floor(Math.random() * (max - min + 1)));
    return (min + rng.nextInt(max - min + 1));
  }

  function _genPatternSkip(ctx) {
    var d = ctx.difficulty;
    var stepOptions = (d <= 1) ? [2, 5] : (d === 2 ? [2, 5, 10] : [2, 5, 10]);
    var step = _pick(ctx.rng, stepOptions) || 2;
    var startMax = (d <= 1) ? 20 : (d === 2 ? 50 : 80);
    var start = _randIntInclusive(ctx.rng, 0, startMax);
    // Align start to step sometimes.
    if (ctx.rng && ctx.rng.next() < 0.6) start = start - (start % step);

    var a0 = start;
    var seq = [a0, a0 + step, a0 + 2 * step, a0 + 3 * step, "?"];
    var expected = a0 + 4 * step;

    return _makePatternPrompt(ctx.packId, d, "skip", seq, expected, { step: step });
  }

  function _genPatternAdd(ctx) {
    var d = ctx.difficulty;
    var stepMin = (d <= 1) ? 1 : (d === 2 ? 3 : (d === 3 ? 4 : (d === 4 ? 7 : 10)));
    var stepMax = (d <= 1) ? 3 : (d === 2 ? 6 : (d === 3 ? 9 : (d === 4 ? 20 : 30)));
    var step = _randIntInclusive(ctx.rng, stepMin, stepMax);
    var start = _randIntInclusive(ctx.rng, 0, (d <= 2 ? 20 : 50));

    var a0 = start;
    var seq = [a0, a0 + step, a0 + 2 * step, a0 + 3 * step, "?"];
    var expected = a0 + 4 * step;

    return _makePatternPrompt(ctx.packId, d, "add", seq, expected, { step: step });
  }

  function _genPatternMul(ctx) {
    var d = ctx.difficulty;
    var kOptions = (d <= 2) ? [2] : (d === 3 ? [2, 3] : (d === 4 ? [2, 3, 4, 5] : [3, 4, 5, 6, 7, 8]));
    var k = _pick(ctx.rng, kOptions) || 2;
    var startMax = (d <= 3) ? 12 : 20;
    var start = _randIntInclusive(ctx.rng, 1, startMax);

    // Build 4 visible terms.
    var a0 = start;
    var a1 = a0 * k;
    var a2 = a1 * k;
    var a3 = a2 * k;
    var expected = a3 * k;

    // Keep numbers from exploding too much.
    if (expected > 20000) {
      // Soften by lowering start.
      a0 = _randIntInclusive(ctx.rng, 1, 6);
      a1 = a0 * k;
      a2 = a1 * k;
      a3 = a2 * k;
      expected = a3 * k;
    }

    var seq = [a0, a1, a2, a3, "?"];
    return _makePatternPrompt(ctx.packId, d, "mul", seq, expected, { factor: k });
  }

  function _genPatternAlt(ctx) {
    var d = ctx.difficulty;
    var s1Options = (d >= 5) ? [2, 3, 4] : [2, 3];
    var s2Options = (d >= 5) ? [5, 7, 9] : [5, 7];
    var s1 = _pick(ctx.rng, s1Options) || 2;
    var s2 = _pick(ctx.rng, s2Options) || 5;
    var start = _randIntInclusive(ctx.rng, 0, (d >= 4 ? 50 : 30));

    var a0 = start;
    var a1 = a0 + s1;
    var a2 = a1 + s2;
    var a3 = a2 + s1;
    var expected = a3 + s2;

    var seq = [a0, a1, a2, a3, "?"];
    return _makePatternPrompt(ctx.packId, d, "alt", seq, expected, { steps: [s1, s2] });
  }

  function _genPatternSequence(ctx) {
    var d = ctx.difficulty;
    var families = [];
    if (d <= 1) families = ["skip", "add", "add", "skip"]; // bias to skip/add
    else if (d === 2) families = ["skip", "add", "mul", "add"];
    else if (d === 3) families = ["add", "mul", "alt", "skip"];
    else if (d === 4) families = ["add", "mul", "alt", "mul"];
    else families = ["mul", "alt", "add", "mul"]; 

    // Alternating only >= 3
    if (d < 3) {
      families = families.filter(function(x) { return x !== "alt"; });
      if (!families.length) families = ["add", "skip"]; 
    }

    var family = _pick(ctx.rng, families) || "add";
    if (family === "skip") return _genPatternSkip(ctx);
    if (family === "mul") return _genPatternMul(ctx);
    if (family === "alt") return _genPatternAlt(ctx);
    return _genPatternAdd(ctx);
  }

  var PRACTICE_PACKS = [
    {
      packId: "P_TYPING_WORDS",
      title: "Typing: Words",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: true,
      generator: function(ctx) {
        return _genTypingWords(ctx);
      }
    },
    {
      packId: "P_TYPING_PHRASES",
      title: "Typing: Phrases",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: true,
      generator: function(ctx) {
        return _genTypingPhrases(ctx);
      }
    },
    {
      packId: "P_TYPING_SHORT_SENTENCES",
      title: "Typing: Short Sentences",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: true,
      generator: function(ctx) {
        return _genTypingShortSentences(ctx);
      }
    },
    {
      packId: "P_TYPING_PARAGRAPHS",
      title: "Typing: Paragraphs",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingParagraphs(ctx);
      }
    },
    {
      packId: "P_TYPING_ANIMAL_FACTS",
      title: "Typing: Animal Facts",
      description: "Short, kid-safe animal facts to build vocabulary.",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingAnimalFacts(ctx);
      }
    },
    {
      packId: "P_TYPING_CAREER_SENTENCES",
      title: "Typing: Jobs and Helpers",
      description: "Kid-friendly sentences about community helper jobs.",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingCareerSentences(ctx);
      }
    },
    {
      packId: "P_TYPING_KARNANA_BANGA_FACTS",
      title: "Typing: Karnana and Banga Facts",
      description: "Kid-safe facts about Karnana, Banga, and local geography.",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingKarnanaBangaFacts(ctx);
      }
    },
    {
      packId: "P_TYPING_WEATHER_FACTS",
      title: "Typing: Weather Facts",
      description: "Simple weather facts, safety tips, and observation skills for young learners.",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingWeatherFacts(ctx);
      }
    },
    {
      packId: "P_TYPING_AGRICULTURE_BANK_01",
      title: "Typing: Agriculture Bank 01",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingAgricultureBank01(ctx);
      }
    },
    {
      packId: "P_TYPING_PUNJABI_CITIES",
      title: "Typing: Punjabi Cities",
      description: "Simple statements about Punjab cities, towns, travel, and maps.",
      recommendedDifficulty: "easy",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingPunjabiCities(ctx);
      }
    },
    {
      packId: "P_TYPING_USMLE_STEP_TOP_500_FACTS",
      title: "Typing: USMLE Step Top 500 Facts",
      description: "High-yield one-sentence USMLE-style facts (adult content).",
      recommendedDifficulty: "hard",
      type: "typing",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genTypingUsmleStepTopFacts(ctx);
      }
    },
    {
      packId: "P_PATTERN_FAMILIES",
      title: "Patterns: Families",
      type: "pattern",
      difficultyBands: [1, 2, 3, 4, 5],
      enabled: false,
      generator: function(ctx) {
        return _genPatternSequence(ctx);
      }
    }
  ];

  // ---------------------------
  // Core: next prompt generator
  // ---------------------------
  function getNextPracticePrompt(state) {
    state = _isPlainObject(state) ? state : {};

    // PracticeSession currently calls us with a fresh object each time.
    // Persist typing repeat/tag memory in sessionStorage so selection quality works in-session.
    try {
      if (!Array.isArray(state.recentTypingNorm)) state.recentTypingNorm = _readSessionJson(_SESSION_RECENT_TYPING_NORM_KEY, []);
      if (!Array.isArray(state.recentTypingTags)) state.recentTypingTags = _readSessionJson(_SESSION_RECENT_TYPING_TAGS_KEY, []);
      if (typeof state.lastPromptTextNorm !== "string") {
        state.lastPromptTextNorm = String(_readSessionJson(_SESSION_LAST_PROMPT_TEXT_NORM_KEY, "") || "");
      }
    } catch (eS) {
      if (!Array.isArray(state.recentTypingNorm)) state.recentTypingNorm = [];
      if (!Array.isArray(state.recentTypingTags)) state.recentTypingTags = [];
      if (typeof state.lastPromptTextNorm !== "string") state.lastPromptTextNorm = "";
    }

    var type = _normalizeType(state.type || state.mode);
    var difficulty = _clampDifficulty(state.rampDifficulty);
    var lastPromptId = (typeof state.lastPromptId === "string") ? state.lastPromptId : "";
    var desiredPackId = (typeof state.packId === "string" && state.packId) ? state.packId : null;

    if (type === "typing") {
      var sharedPackId = desiredPackId || "P_TYPING_SHORT_SENTENCES";
      var sharedPrompt = _makeTypingPromptFromSharedSelector(sharedPackId, difficulty);
      if (sharedPrompt && typeof sharedPrompt.id === "string") {
        try {
          if (lastPromptId && sharedPrompt.id === lastPromptId) {
            var retryPrompt = _makeTypingPromptFromSharedSelector(sharedPackId, difficulty);
            if (retryPrompt && typeof retryPrompt.id === "string") sharedPrompt = retryPrompt;
          }
        } catch (eSR0) {}
        return { prompt: sharedPrompt, nextRngState: null };
      }
    }

    // Deterministic RNG is enabled if a seed/rngState is provided OR exists in session.
    var seed = (state.seed != null) ? state.seed : _readSessionNumber(_SESSION_SEED_KEY);
    var rngState = (state.rngState != null) ? state.rngState : _readSessionNumber(_SESSION_RNGSTATE_KEY);

    var deterministic = (seed != null || rngState != null);

    var rng = null;
    if (deterministic) {
      rng = _makeRng(seed, rngState);
      // Persist for the session so callers can omit seed/rngState on subsequent calls.
      if (seed != null) _writeSessionNumber(_SESSION_SEED_KEY, _seedToUint32(seed));
      _writeSessionNumber(_SESSION_RNGSTATE_KEY, rng.getState());
    }

    // Candidate packs
    var candidates = [];
    for (var i = 0; i < PRACTICE_PACKS.length; i++) {
      var p = PRACTICE_PACKS[i];
      if (!p || !p.enabled) continue;
      if (p.type !== type) continue;
      if (desiredPackId && p.packId !== desiredPackId) continue;
      if (!Array.isArray(p.difficultyBands) || p.difficultyBands.indexOf(difficulty) === -1) continue;
      if (typeof p.generator !== "function") continue;
      candidates.push(p);
    }

    // Fallback: if mode is weird or no pack matches, fall back to typing words.
    if (!candidates.length) {
      type = "typing";
      for (var j = 0; j < PRACTICE_PACKS.length; j++) {
        var pp = PRACTICE_PACKS[j];
        if (pp && pp.enabled && pp.type === "typing" && pp.packId === "P_TYPING_WORDS") candidates.push(pp);
      }
    }

    var prompt = null;
    var tries = 0;
    while (tries < 7) {
      tries++;
      var chosen = _pick(rng, candidates) || candidates[0];
      if (!chosen) break;

      try {
        prompt = chosen.generator({
          packId: chosen.packId,
          type: chosen.type,
          difficulty: difficulty,
          rng: rng,
          lastPromptId: lastPromptId,
          // Thread through state for better selection (repeat avoidance, tag variety).
          state: state
        });
      } catch (e) {
        prompt = null;
      }

      if (!prompt || typeof prompt.id !== "string") {
        prompt = null;
        continue;
      }

      // Avoid immediate repeats
      if (lastPromptId && prompt.id === lastPromptId) {
        prompt = null;
        continue;
      }

      // Also avoid immediate repeats by normalized text within the session.
      // This is more robust than id-only (e.g., when ids differ but text is the same).
      try {
        if (prompt.type === "typing" && typeof prompt.questionText === "string") {
          var nowNorm = _normalizeTypingAnswer(prompt.questionText);
          var lastNorm = (typeof state.lastPromptTextNorm === "string") ? state.lastPromptTextNorm : "";
          if (lastNorm && nowNorm && nowNorm === lastNorm) {
            prompt = null;
            continue;
          }
        }
      } catch (eT) {}
      break;
    }

    // Update in-session selection memory for typing prompts.
    try {
      if (prompt && prompt.type === "typing" && typeof prompt.questionText === "string") {
        var normQ = _normalizeTypingAnswer(prompt.questionText);
        if (normQ) {
          state.recentTypingNorm.push(normQ);
          if (state.recentTypingNorm.length > 10) state.recentTypingNorm = state.recentTypingNorm.slice(-10);
        }

        // Track last prompt text (normalized) to avoid immediate repeats.
        state.lastPromptTextNorm = normQ || "";
        _writeSessionJson(_SESSION_LAST_PROMPT_TEXT_NORM_KEY, state.lastPromptTextNorm);

        // Capture one primary tag to enforce variety.
        var tag = null;
        if (prompt.meta && typeof prompt.meta === "object") {
          if (Array.isArray(prompt.meta.tags) && prompt.meta.tags.length) {
            for (var ti = 0; ti < prompt.meta.tags.length; ti++) {
              var t0 = String(prompt.meta.tags[ti] || "").toLowerCase();
              if (!t0) continue;
              if (t0.indexOf("grammar:") === 0) continue;
              tag = t0;
              break;
            }
            if (!tag) tag = String(prompt.meta.tags[0] || "").toLowerCase();
          }
        }
        if (tag) {
          state.recentTypingTags.push(tag);
          if (state.recentTypingTags.length > 4) state.recentTypingTags = state.recentTypingTags.slice(-4);
        }

        // Persist for the session.
        _writeSessionJson(_SESSION_RECENT_TYPING_NORM_KEY, state.recentTypingNorm);
        _writeSessionJson(_SESSION_RECENT_TYPING_TAGS_KEY, state.recentTypingTags);
      }
    } catch (eM) {}

    // Absolute fallback
    if (!prompt) {
      prompt = _makeTypingPrompt("P_TYPING_WORDS", difficulty, "hello", "word");
    }

    var nextRngState = deterministic && rng ? rng.getState() : null;
    if (deterministic && rng) _writeSessionNumber(_SESSION_RNGSTATE_KEY, nextRngState);

    return { prompt: prompt, nextRngState: nextRngState };
  }

  // ---------------------------
  // Grading + coaching
  // ---------------------------
  function gradePrompt(prompt, userAnswer, settings) {
    prompt = _isPlainObject(prompt) ? prompt : {};
    settings = _isPlainObject(settings) ? settings : {};

    var expected = (typeof prompt.expectedAnswer === "string") ? prompt.expectedAnswer : "";
    var toleranceUsed = "exact";

    if (prompt.type === "pattern") {
      var expectedTrim = _collapseWhitespace(expected);
      var userTrim = _collapseWhitespace(userAnswer);

      function cleanNum(s) {
        s = String(s || "");
        s = s.replace(/[\s,]+/g, "");
        s = s.replace(/[.?!]+$/g, "");
        return s;
      }

      var expClean = cleanNum(expectedTrim);
      var usrClean = cleanNum(userTrim);

      var expOk = /^-?\d+$/.test(expClean);
      var usrOk = /^-?\d+$/.test(usrClean);

      var correct = false;
      if (expOk && usrOk) {
        correct = (Number(expClean) === Number(usrClean));
        if (correct && expClean !== usrClean) toleranceUsed = "numeric";
      } else {
        // Last resort: string compare
        correct = (expClean === usrClean);
      }

      return {
        correct: !!correct,
        assisted: false,
        meta: {
          expected: expected,
          normalizedUser: usrClean,
          toleranceUsed: toleranceUsed
        }
      };
    }

    // typing (default)
    var expectedNorm = _normalizeTypingAnswer(expected);
    var userNorm = _normalizeTypingAnswer(userAnswer);
    var hard = (settings.difficulty === "hard") || (prompt.difficulty >= 5);
    var allowMinorTypos = (typeof settings.allowMinorTypos === "boolean") ? settings.allowMinorTypos : !hard;

    var correctTyping = (userNorm === expectedNorm);
    if (!correctTyping) {
      var singleWord = false;
      try {
        singleWord = !!(prompt.meta && prompt.meta.isSingleWord);
      } catch (e0) {
        singleWord = (expectedNorm.indexOf(" ") === -1);
      }

      if (singleWord && _maybeMinorTypoMatch(expectedNorm, userNorm, allowMinorTypos)) {
        correctTyping = true;
        toleranceUsed = "minorTypo";
      }
    }

    return {
      correct: !!correctTyping,
      assisted: false,
      meta: {
        expected: expected,
        normalizedUser: userNorm,
        toleranceUsed: toleranceUsed
      }
    };
  }

  function coachPrompt(prompt, result, settings) {
    prompt = _isPlainObject(prompt) ? prompt : {};
    result = _isPlainObject(result) ? result : {};
    settings = _isPlainObject(settings) ? settings : {};

    var expected = (typeof prompt.expectedAnswer === "string") ? prompt.expectedAnswer : "";

    var line1 = result.correct ? "Nice!" : ("Correct: " + expected);
    var tip = "Tip: go slow and be consistent.";

    if (prompt.type === "pattern") {
      tip = "Tip: look for a step (+n), a factor (×k), or an alternating rule.";
      if (prompt.meta && prompt.meta.family === "alt") tip = "Tip: alternating means two steps repeating.";
    } else {
      // typing
      if ((settings.difficulty === "hard") || (prompt.difficulty >= 5)) tip = "Tip: hard mode is strict—match spacing and letters exactly.";
      else if (prompt.meta && prompt.meta.category === "phrase") tip = "Tip: type one space between words.";
      else tip = "Tip: focus on each letter—accuracy first.";
    }

    return line1 + "\n" + tip;
  }

  // ---------------------------
  // Examples
  // ---------------------------
  function __practicePacksExamples() {
    var seed = 123456;

    function runSet(label, type, diff) {
      var state = { type: type, rampDifficulty: diff, seed: seed, rngState: null, lastPromptId: null };
      window.console.log("\n[PracticePacks examples]", label);
      for (var i = 0; i < 10; i++) {
        var res = getNextPracticePrompt(state);
        var p = res && res.prompt;
        if (!p) break;
        window.console.log(
          (i + 1) + ".", p.questionText, "→", p.expectedAnswer,
          "(" + p.packId + ", d" + p.difficulty + ")"
        );
        state.rngState = res.nextRngState;
        state.lastPromptId = p.id;
      }
    }

    runSet("typing diff1", "typing", 1);
    runSet("typing diff4", "typing", 4);
    runSet("pattern diff1", "pattern", 1);
    runSet("pattern diff4", "pattern", 4);

    window.console.log("\nTip: call getNextPracticePrompt({type:'typing', rampDifficulty:2, seed:123}) to get deterministic prompts.");
  }

  // ---------------------------
  // Export globals
  // ---------------------------
  function _packIdToTypingBankKey(packId) {
    packId = String(packId || "");
    if (!packId) return null;

    if (packId === "P_TYPING_WORDS") return "words";
    if (packId === "P_TYPING_PHRASES") return "phrases";
    if (packId === "P_TYPING_SHORT_SENTENCES") return "sentences";
    if (packId === "P_TYPING_PARAGRAPHS") return "paragraphs";
    if (packId === "P_TYPING_ANIMAL_FACTS") return "animalFacts";
    if (packId === "P_TYPING_CAREER_SENTENCES") return "careerSentences";
    if (packId === "P_TYPING_KARNANA_BANGA_FACTS") return "karnanaBangaFacts";
    if (packId === "P_TYPING_WEATHER_FACTS") return "weatherFacts";
    if (packId === "P_TYPING_AGRICULTURE_BANK_01") return "agricultureBank01";
    if (packId === "P_TYPING_PUNJABI_CITIES") return "punjabiCities";
    if (packId === "P_TYPING_USMLE_STEP_TOP_500_FACTS") return "usmleStepTopFacts";
    return null;
  }

  function getPackBankSize(packId) {
    try {
      var key = _packIdToTypingBankKey(packId);
      if (!key) return null;
      var bank = (_TYPING_BANKS_V1 && Array.isArray(_TYPING_BANKS_V1[key])) ? _TYPING_BANKS_V1[key] : null;
      return bank ? bank.length : null;
    } catch (e) {
      return null;
    }
  }

  window.PracticePacks.packs = PRACTICE_PACKS;
  window.PracticePacks.getNextPracticePrompt = getNextPracticePrompt;
  window.PracticePacks.gradePrompt = gradePrompt;
  window.PracticePacks.coachPrompt = coachPrompt;
  window.PracticePacks._makeRng = _makeRng;
  window.PracticePacks.getPackBankSize = getPackBankSize;

  window.getNextPracticePrompt = getNextPracticePrompt;
  window.gradePrompt = gradePrompt;
  window.coachPrompt = coachPrompt;

  window.__practicePacksExamples = __practicePacksExamples;
})();
