// =====================================
// Games Module - owns screen-play
// =====================================

// Feature flag: gentle difficulty ramp for Games 1–6 only (normal mode)
const ENABLE_GENTLE_RAMP = true;
const DEBUG_GENTLE_RAMP = false;

// =====================================
// BOLO v2 Shared Utilities (stability)
// =====================================
// Minimum time to keep feedback visible before advancing/continuing.
// Not wired into gameplay yet; utility only.
const MIN_FEEDBACK_MS = 750;

// Canonicalize text for robust matching.
// - trim
// - collapse internal whitespace
// - normalize curly quotes/apostrophes → straight
// - default: lowercase
// - optional: strip terminal punctuation
function canonText(s, opts) {
  var options = (opts && typeof opts === "object") ? opts : {};
  var out = String(s == null ? "" : s);

  // Normalize common curly quotes/apostrophes.
  // ’ (U+2019), ‘ (U+2018) → '
  // “ (U+201C), ” (U+201D) → "
  out = out
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');

  // Collapse all whitespace to single spaces.
  out = out.replace(/\s+/g, " ").trim();

  if (options.stripTerminalPunct === true) {
    out = out.replace(/[\.,!?;:]+$/g, "").trim();
  }

  return out;
}

// Canonicalize a single word token for robust matching.
// - lowercases
// - trims
// - strips leading/trailing punctuation
// - preserves internal apostrophes/hyphens (e.g., can't, mother-in-law)
function canonWord(s) {
  var out = canonText(s, { stripTerminalPunct: true });
  out = String(out == null ? "" : out).toLowerCase().trim();
  // Remove leading/trailing non-word chars (keep letters/digits and apostrophes/hyphens inside word).
  out = out.replace(/^[^a-z0-9]+/g, "").replace(/[^a-z0-9]+$/g, "");
  return out;
}

// V2 tokenizer for Game 1 (TapWord).
// Returns:
// - wordTokens: tappable word strings
// - spans: inline render tokens: {type:"word"|"punct", text, isOpener?, isCloser?, isJoiner?}
function tokenizeTapWordSentenceV2(sentenceEn) {
  var s = String(sentenceEn == null ? "" : sentenceEn);
  var spans = [];
  var wordTokens = [];

  function isWs(ch) {
    return /\s/.test(ch);
  }

  function isAlphaNum(ch) {
    // ASCII + basic Latin-1 supplement letters (covers common accented characters)
    return /[A-Za-z0-9\u00C0-\u024F]/.test(ch);
  }

  function isOpener(ch) {
    return ch === "(" || ch === "[" || ch === "{" || ch === "\"" || ch === "“" || ch === "‘";
  }

  function isCloser(ch) {
    return ch === ")" || ch === "]" || ch === "}" || ch === "\"" || ch === "”" || ch === "’" || ch === "." || ch === "," || ch === "!" || ch === "?" || ch === ";" || ch === ":";
  }

  function isJoiner(ch) {
    return ch === "-" || ch === "/";
  }

  var i = 0;
  while (i < s.length) {
    var ch = s.charAt(i);
    if (isWs(ch)) {
      i++;
      continue;
    }

    // Word token
    if (isAlphaNum(ch)) {
      var buf = ch;
      i++;
      while (i < s.length) {
        var c = s.charAt(i);
        if (isAlphaNum(c)) {
          buf += c;
          i++;
          continue;
        }

        // Allow apostrophe inside a word if followed by alnum
        if ((c === "'" || c === "’") && i + 1 < s.length && isAlphaNum(s.charAt(i + 1))) {
          buf += c;
          i++;
          continue;
        }

        // Allow hyphen inside a word if followed by alnum
        if (c === "-" && i + 1 < s.length && isAlphaNum(s.charAt(i + 1))) {
          buf += c;
          i++;
          continue;
        }

        break;
      }

      spans.push({ type: "word", text: buf });
      wordTokens.push(buf);
      continue;
    }

    // Punctuation token (one character)
    spans.push({
      type: "punct",
      text: ch,
      isOpener: isOpener(ch),
      isCloser: isCloser(ch),
      isJoiner: isJoiner(ch)
    });
    i++;
  }

  return { wordTokens: wordTokens, spans: spans };
}

// Shared dwell gate: ensure at least MIN_FEEDBACK_MS elapsed since startTs.
// - callback form: withFeedbackDwell(ts, () => { ... })
// - promise form: await withFeedbackDwell(ts)
function withFeedbackDwell(startTs, cb) {
  var began = (typeof startTs === "number" && isFinite(startTs)) ? startTs : Date.now();
  var elapsed = Math.max(0, Date.now() - began);
  var waitMs = Math.max(0, (MIN_FEEDBACK_MS | 0) - elapsed);

  if (typeof cb === "function") {
    if (waitMs <= 0) {
      try { cb(); } catch (e0) {}
      return;
    }
    setTimeout(function() {
      try { cb(); } catch (e1) {}
    }, waitMs);
    return;
  }

  return new Promise(function(resolve) {
    if (waitMs <= 0) return resolve();
    setTimeout(resolve, waitMs);
  });
}

// =====================================
// BOLO v2 Unified Normalizers (Any Source)
// =====================================

function normalizeGame1QuestionAnySource(raw, meta) {
  if (!raw || typeof raw !== "object") return null;
  var out = (window.Games && typeof Games._baseNormalized === "function") ? Games._baseNormalized("tapWord") : null;
  if (!out) return null;

  var m = (meta && typeof meta === "object") ? meta : {};
  var sourceType = String(m.sourceType || "");
  var idx = (typeof m.idx === "number" && isFinite(m.idx)) ? (m.idx | 0) : 0;
  var stableId = String(m.stableId || raw.id || raw.qid || (sourceType === "custom_quiz" ? "CQ_G1_" + String(idx) : "G1_" + String(idx)));

  out.gameType = "tapWord";
  out.qid = String(m.qid || (sourceType === "custom_quiz" ? stableId : ("N_tapWord_" + String(idx))));
  out.trackId = String(raw.trackId || m.trackId || "T_WORDS");
  out.source = m.source || { type: sourceType || "unknown", id: stableId };

  // Optional authored feedback fields
  // V2 scaffold fields (optional): hint/explain/tag (do not require full coverage)
  if (raw.hint != null) out.hint = String(raw.hint);
  if (raw.explain != null) out.explain = String(raw.explain);
  if (raw.tag != null && String(raw.tag).trim()) out.tag = String(raw.tag).trim();
  else if (Array.isArray(raw.tags) && raw.tags.length && String(raw.tags[0] || "").trim()) out.tag = String(raw.tags[0] || "").trim();
  else out.tag = null;

  if (raw.hintEn != null) out.hintEn = String(raw.hintEn);
  if (raw.hintPa != null) out.hintPa = String(raw.hintPa);
  if (raw.explanationEn != null) out.explanationEn = String(raw.explanationEn);
  if (raw.explanationPa != null) out.explanationPa = String(raw.explanationPa);

  // Prompt + sentence
  var promptEn = (raw.promptEn != null) ? String(raw.promptEn)
    : (raw.prompt != null) ? String(raw.prompt)
    : (raw.question != null) ? String(raw.question)
    : String(m.promptEn || "Tap the word.");
  out.promptEn = promptEn;
  out.promptPa = String(raw.promptPa || raw.questionPa || "");

  var sentenceEn = String(raw.sentenceEn || raw.sentence || "").trim();
  if (!sentenceEn && Array.isArray(raw.tokens) && raw.tokens.length) {
    sentenceEn = raw.tokens.map(function(t) { return String(t == null ? "" : t); }).join(" ").trim();
  }
  if (!sentenceEn) return null;
  out.sentenceEn = sentenceEn;
  out.sentencePa = String(raw.sentencePa || "");

  // V2 tokenization: word tokens are tappable; punctuation tokens are inline non-tappable spans.
  var tokV2 = tokenizeTapWordSentenceV2(sentenceEn);
  if (!tokV2 || !Array.isArray(tokV2.wordTokens) || tokV2.wordTokens.length < 2) return null;

  out.tokens = tokV2.wordTokens.slice();
  out.tokenSpans = Array.isArray(tokV2.spans) ? tokV2.spans : [];

  // Correct indices (allow multiple matches; do NOT reject duplicates)
  var correctWord = String(raw.correctWord || raw.correct || "").trim();
  var correctKey = canonWord(correctWord);
  if (!correctKey) return null;

  var correctTokenIndices = [];
  for (var i = 0; i < out.tokens.length; i++) {
    var tk = canonWord(out.tokens[i]);
    if (tk && tk === correctKey) correctTokenIndices.push(i);
  }

  if (!correctTokenIndices.length) {
    try {
      console.warn("G1 invalid question excluded (correctWord not found)", {
        qid: out.qid,
        stableId: stableId,
        correctWord: correctWord,
        sentenceEn: sentenceEn,
        tokens: out.tokens
      });
    } catch (eG1W) {}
    return null;
  }

  out.correctTokenIndices = correctTokenIndices;
  out.correctTokenIndex = correctTokenIndices[0];

  // Difficulty: infer from token count unless provided.
  var d = (typeof raw.difficulty === "number" && isFinite(raw.difficulty)) ? (raw.difficulty | 0) : 0;
  if (!(d >= 1 && d <= 3)) d = (out.tokens.length <= 5) ? 1 : (out.tokens.length <= 8 ? 2 : 3);
  out.difficulty = Math.max(1, Math.min(3, d));

  out.tags = ["TAPWORD"];

  // Additive stable seed key for deterministic behaviors.
  out.seedKey = stableId;
  return out;
}

function normalizeGame4QuestionAnySource(raw, meta) {
  if (!raw || typeof raw !== "object") return null;
  var out = (window.Games && typeof Games._baseNormalized === "function") ? Games._baseNormalized("sentenceCheck") : null;
  if (!out) return null;

  var m = (meta && typeof meta === "object") ? meta : {};
  var sourceType = String(m.sourceType || "");
  var idx = (typeof m.idx === "number" && isFinite(m.idx)) ? (m.idx | 0) : 0;
  var stableId = String(m.stableId || raw.id || raw.qid || (sourceType === "custom_quiz" ? "CQ_G4_" + String(idx) : "G4_" + String(idx)));

  out.gameType = "sentenceCheck";
  out.qid = String(m.qid || (sourceType === "custom_quiz" ? stableId : ("N_sentenceCheck_" + String(idx))));
  out.trackId = String(raw.trackId || m.trackId || "T_SENTENCE");
  out.source = m.source || { type: sourceType || "unknown", id: stableId };

  // Feedback fields
  // V2 scaffold fields (optional): hint/explain/tag (do not require full coverage)
  if (raw.hint != null) out.hint = String(raw.hint);
  if (raw.explain != null) out.explain = String(raw.explain);

  if (raw.hintEn != null) out.hintEn = String(raw.hintEn);
  if (raw.hintPa != null) out.hintPa = String(raw.hintPa);
  if (raw.explanationEn != null) out.explanationEn = String(raw.explanationEn);
  if (raw.explanationPa != null) out.explanationPa = String(raw.explanationPa);

  // Prompt
  var promptEn = (raw.promptEn != null) ? String(raw.promptEn)
    : (raw.prompt != null) ? String(raw.prompt)
    : String(m.promptEn || "Pick the correct sentence:");
  out.promptEn = promptEn;
  out.promptPa = String(raw.promptPa || "");

  // Options: support DQ shape (choices[{id,text}]) and raw shape (options array)
  var optionsEn = [];
  var optionsPa = null;
  var choiceIds = null;

  if (Array.isArray(raw.choices) && raw.choices.length >= 2) {
    choiceIds = raw.choices.map(function(c) { return (c && c.id != null) ? String(c.id) : ""; });
    optionsEn = raw.choices.map(function(c) { return (c && c.text != null) ? String(c.text) : ""; });
  } else if (Array.isArray(raw.optionsEn) && raw.optionsEn.length >= 2) {
    if (raw.optionsEn[0] && typeof raw.optionsEn[0] === "object") {
      optionsEn = raw.optionsEn.map(function(o) { return (o && o.en != null) ? String(o.en) : ""; });
      optionsPa = raw.optionsEn.map(function(o) { return (o && o.pa != null) ? String(o.pa) : ""; });
    } else {
      optionsEn = raw.optionsEn.map(function(s) { return String(s == null ? "" : s); });
    }
  } else if (Array.isArray(raw.options) && raw.options.length >= 2) {
    optionsEn = raw.options.map(function(s) { return String(s == null ? "" : s); });
    if (Array.isArray(raw.optionsPa) && raw.optionsPa.length >= 2) {
      optionsPa = raw.optionsPa.map(function(s) { return String(s == null ? "" : s); });
    }
  }

  if (!optionsEn || optionsEn.length < 2) return null;
  if (optionsEn.length !== 2) {
    try {
      console.warn("G4 invalid question excluded (options length != 2)", {
        qid: out.qid,
        stableId: stableId,
        optionsLen: optionsEn.length,
        optionsEn: optionsEn
      });
    } catch (eLen) {}
    return null;
  }

  // Deterministic seed key (required formula)
  var optionA = String(optionsEn[0] == null ? "" : optionsEn[0]);
  var optionB = String(optionsEn[1] == null ? "" : optionsEn[1]);
  var rawId = (raw.id != null) ? String(raw.id) : "";
  var rawSentence = String(raw.sentenceEn || raw.sentence || "");
  var seedKey = "G4|" + (rawId || rawSentence || (optionA + "|" + optionB));

  // Correctness detection (required): canonical match against exactly one option.
  // IMPORTANT: punctuation can be the learning target in Game 4, so do NOT strip terminal punctuation.
  var correctText = "";
  if (raw.correct != null || raw.correctText != null) {
    correctText = String((raw.correct != null) ? raw.correct : raw.correctText);
  } else {
    // DQ shape fallback: infer correct text from choice id/index (then still do canonical match)
    var cid = (raw.correctChoiceId != null) ? String(raw.correctChoiceId) : "";
    if (cid && Array.isArray(choiceIds)) {
      var ci = choiceIds.indexOf(cid);
      if (ci >= 0 && ci < optionsEn.length) correctText = String(optionsEn[ci] || "");
    }
    if (!correctText && typeof raw.correctIndex === "number" && isFinite(raw.correctIndex)) {
      var ri = raw.correctIndex | 0;
      if (ri >= 0 && ri < optionsEn.length) correctText = String(optionsEn[ri] || "");
    }
  }

  var keyCorrect = canonText(correctText, { stripTerminalPunct: false });
  var keyA = canonText(optionA, { stripTerminalPunct: false });
  var keyB = canonText(optionB, { stripTerminalPunct: false });
  var matchesA = !!(keyCorrect && keyA && keyCorrect === keyA);
  var matchesB = !!(keyCorrect && keyB && keyCorrect === keyB);
  var correctIndex = -1;

  if (matchesA && !matchesB) correctIndex = 0;
  else if (matchesB && !matchesA) correctIndex = 1;
  else {
    try {
      console.warn("G4 invalid question excluded (correct match ambiguous/not found)", {
        qid: out.qid,
        stableId: stableId,
        seedKey: seedKey,
        correctText: correctText,
        optionA: optionA,
        optionB: optionB,
        keyCorrect: keyCorrect,
        keyA: keyA,
        keyB: keyB,
        matchesA: matchesA,
        matchesB: matchesB
      });
    } catch (eMatch) {}
    return null;
  }

  // Deterministic A/B swap (stable across sessions/rerenders)
  var swapApplied = false;
  try {
    var rng = makeRng(hashSeed(seedKey));
    swapApplied = (rng() < 0.5);
  } catch (eRng) {
    swapApplied = false;
  }

  if (swapApplied) {
    optionsEn = [optionB, optionA];
    if (Array.isArray(optionsPa) && optionsPa.length === 2) {
      optionsPa = [String(optionsPa[1] || ""), String(optionsPa[0] || "")];
    }
    correctIndex = (correctIndex === 0) ? 1 : 0;
  } else {
    // Ensure we store the original order strings
    optionsEn = [optionA, optionB];
  }

  out.optionsEn = optionsEn;
  out.optionsPa = optionsPa;
  out.correctIndex = correctIndex;
  out.answerIndex = correctIndex;
  out.correctChoiceId = (optionsEn.length === 2) ? (correctIndex === 0 ? "a" : "b") : "";

  // Store normalized fields requested by V2
  out.id = rawId || stableId;
  out.key = seedKey;
  out.options = optionsEn.slice(0, 2);
  out.swapApplied = swapApplied;

  if (raw.tag != null && String(raw.tag).trim()) {
    out.tag = String(raw.tag).trim();
  } else if (Array.isArray(raw.tags) && raw.tags.length && String(raw.tags[0] || "").trim()) {
    out.tag = String(raw.tags[0] || "").trim();
  } else {
    out.tag = null;
  }

  out.tags = ["SENTENCE:CHECK"];
  out.difficulty = Math.max(1, Math.min(3, (typeof raw.difficulty === "number" && isFinite(raw.difficulty)) ? (raw.difficulty | 0) : 2));

  out.seedKey = seedKey;
  return out;
}

function setVisible(el, visible) {
  if (!el) return;
  try { el.classList.toggle("is-hidden", !visible); } catch (e0) {}
}

// ==============================
// ClashStability (Game 10) — V2 scaffold (safe / no behavior change)
// ==============================

const CS_V2_ENABLED = true; // Keep true; V2 will be activated gradually

const CS_LS_KEYS = {
  level: "cs_v2_level",              // "1" | "2" | "3"
  punjabiHelp: "cs_v2_punjabi_help", // "on" | "fade" | "off"
  lowFx: "cs_v2_low_fx"              // "1" | "0"
};

// V2 finite round queue: warm-up / core / boss
const CS_ROUND_COUNTS = { warmup: 2, core: 10, boss: 2 };

function csPhaseForIndex(i) {
  var idx = (typeof i === "number" && isFinite(i)) ? (i | 0) : 0;
  var w = CS_ROUND_COUNTS.warmup;
  var c = CS_ROUND_COUNTS.core;
  var b = CS_ROUND_COUNTS.boss;
  if (idx < w) return "warmup";
  if (idx < w + c) return "core";
  if (idx < w + c + b) return "boss";
  return "end";
}

function csRoundTotalCount() {
  return CS_ROUND_COUNTS.warmup + CS_ROUND_COUNTS.core + CS_ROUND_COUNTS.boss;
}

function csSetStandardPlayHeaderRowsVisible(visible) {
  // In this app, the "standard" play header area is made of individual nodes (not strict row wrappers).
  // Hide them directly to avoid leaving blank vertical gaps.
  try { setVisible(document.getElementById("play-track-label"), !!visible); } catch (e0) {}
  try { setVisible(document.getElementById("play-goal-line"), !!visible); } catch (e1) {}
  try { setVisible(document.getElementById("play-example-line"), !!visible); } catch (e2) {}
  try { setVisible(document.getElementById("play-question-text"), !!visible); } catch (e3) {}
  try { setVisible(document.getElementById("play-next-row"), !!visible); } catch (e4) {}

  // Language label sits with the standard header; scope to play screen.
  try { setVisible(document.querySelector("#screen-play .lang-label"), !!visible); } catch (e5) {}
}

function csApplyHudMode(cs, rootEl) {
  var root = rootEl || document.querySelector(".cs");
  if (!root) return;

  // Always-on
  setVisible(root.querySelector(".cs-beambar"), true);
  setVisible(root.querySelector(".cs-stabbar"), true);
  setVisible(root.querySelector(".cs-pill--time"), true);
  setVisible(root.querySelector(".cs-pill--combo"), true);

  // Optional/secondary: hide decorative/status clutter in V2
  // Guardrail: do not hide input controls (e.g., mode toggle, focus selector).
  try {
    var extras = root.querySelectorAll(
      ".cs-momentum, .cs-clash-badge, .cs-active-pill, .cs-chiprow, .cs-packchip"
    );
    for (var i = 0; i < extras.length; i++) setVisible(extras[i], false);
  } catch (e0) {}
}

function csEnsureContextChip(cs, rootEl) {
  var root = rootEl || document.querySelector(".cs");
  if (!root) return null;

  var chip = null;
  try { chip = root.querySelector(".cs-contextchip"); } catch (e0) { chip = null; }
  if (!chip) {
    chip = document.createElement("div");
    chip.className = "cs-contextchip";
    root.appendChild(chip);
  }
  return chip;
}

function csUpdateContextChip(cs, rootEl) {
  var chip = csEnsureContextChip(cs, rootEl);
  if (!chip || !cs) return;

  var packId = String(cs.focusMode || "mixed");
  var packText = (packId === "mixed") ? "Mixed" : (Games && Games._csPackLabelForId ? (Games._csPackLabelForId(packId) || packId) : packId);
  var lvl = (cs.settings && cs.settings.level) ? cs.settings.level : 1;
  var phaseRaw = (cs.round && cs.round.phase) ? String(cs.round.phase || "") : "";
  if (phaseRaw === "end") phaseRaw = "";
  var phase = phaseRaw ? (phaseRaw.charAt(0).toUpperCase() + phaseRaw.slice(1)) : "";

  chip.textContent = packText + " • L" + String(lvl) + (phase ? (" • " + phase) : "");
}

// -------------------- Data integrity versions (V2) --------------------
// Defined in app/data/games.js as globals; fall back safely if missing.
var DATA_VERSION = (typeof window !== "undefined" && window && typeof window.DATA_VERSION === "string")
  ? window.DATA_VERSION
  : "v2.0";
var BANK_VERSION_GAME1 = (typeof window !== "undefined" && window && typeof window.BANK_VERSION_GAME1 === "string")
  ? window.BANK_VERSION_GAME1
  : "g1_v2.0";
var BANK_VERSION_GAME4 = (typeof window !== "undefined" && window && typeof window.BANK_VERSION_GAME4 === "string")
  ? window.BANK_VERSION_GAME4
  : "g4_v2.0";

const DATA_INTEGRITY_LS_KEY = "bolo_data_integrity_v2";

function csLoadSettings() {
  var levelRaw = null;
  var paRaw = null;
  var lowFxRaw = null;

  try {
    levelRaw = localStorage.getItem(CS_LS_KEYS.level);
    paRaw = localStorage.getItem(CS_LS_KEYS.punjabiHelp);
    lowFxRaw = localStorage.getItem(CS_LS_KEYS.lowFx);
  } catch (e0) {
    levelRaw = null;
    paRaw = null;
    lowFxRaw = null;
  }

  var level = 1;
  try {
    var n = parseInt(levelRaw || "1", 10);
    if (n === 1 || n === 2 || n === 3) level = n;
  } catch (e1) { level = 1; }

  var punjabiHelp = (paRaw === "on" || paRaw === "fade" || paRaw === "off") ? paRaw : "fade";
  var lowFx = (lowFxRaw === "1");

  return { level: level, punjabiHelp: punjabiHelp, lowFx: lowFx };
}

function csSaveSettings(s) {
  if (!s) return;
  try {
    localStorage.setItem(CS_LS_KEYS.level, String(s.level || 1));
    localStorage.setItem(CS_LS_KEYS.punjabiHelp, s.punjabiHelp || "fade");
    localStorage.setItem(CS_LS_KEYS.lowFx, s.lowFx ? "1" : "0");
  } catch (e0) {}
}

/**
 * Initializes V2 containers on the ClashStability runtime object.
 * IMPORTANT: This must not change gameplay yet. It only adds state fields.
 */
function csInitV2Scaffold(cs) {
  if (!cs || cs._v2Scaffolded) return;

  cs._v2Scaffolded = true;
  cs.v2 = !!CS_V2_ENABLED;
  cs.settings = csLoadSettings();

  // Round container: will be used later; does not drive logic yet
  cs.round = {
    phase: "warmup",     // warmup | core | boss | end (future)
    idx: 0,
    queue: [],
    retrying: false,
    allowRetry: true,
    lastAnswerWasSlow: false // for Punjabi Help "fade" mode
  };
}

function csEnsureFeedbackEl(cs, rootEl) {
  var root = rootEl || document.querySelector(".cs");
  if (!root) return null;

  var el = null;
  try { el = root.querySelector(".cs-feedback"); } catch (e0) { el = null; }
  if (!el) {
    el = document.createElement("div");
    el.className = "cs-feedback";
    el.style.display = "none";
    root.appendChild(el);
  }
  try { cs._feedbackEl = el; } catch (e1) {}
  return el;
}

function csShowFeedback(cs, payload) {
  if (!cs || !payload) return;

  var root = document.querySelector(".cs");
  var el = csEnsureFeedbackEl(cs, root);
  if (!el) return;

  var correct = !!payload.correct;
  var why = payload.why ? String(payload.why || "") : "";
  var paHint = payload.paHint ? String(payload.paHint || "") : "";
  var punjabiMode = payload.punjabiMode ? String(payload.punjabiMode || "") : "fade";
  var showPunjabi = !!payload.showPunjabi;

  // Punjabi display logic:
  // - on: show if paHint exists
  // - fade: show only if showPunjabi=true (wrong or slow)
  // - off: never show
  var showPa = (punjabiMode === "on")
    ? !!paHint
    : (punjabiMode === "fade")
      ? (!!paHint && !!showPunjabi)
      : false;

  // Keep HTML injection-safe: escape by inserting as text.
  el.innerHTML = "";

  var line = document.createElement("div");
  line.className = "cs-feedback-line cs-feedback-" + (correct ? "ok" : "bad");
  line.textContent = correct ? "Correct" : "Try again";
  el.appendChild(line);

  if (why && why.trim()) {
    var whyEl = document.createElement("div");
    whyEl.className = "cs-feedback-why";
    whyEl.textContent = String(why || "").trim();
    el.appendChild(whyEl);
  }

  if (showPa) {
    var paEl = document.createElement("div");
    paEl.className = "cs-feedback-pa";
    paEl.textContent = String(paHint || "").trim();
    el.appendChild(paEl);
  }

  el.style.display = "block";

  try { if (cs._feedbackT) clearTimeout(cs._feedbackT); } catch (eT0) {}
  cs._feedbackT = setTimeout(function() {
    try {
      if (cs._feedbackEl) cs._feedbackEl.style.display = "none";
    } catch (eT1) {}
  }, correct ? 600 : 900);
}

function csGetWhyLineCompat(q) {
  if (q && typeof q.why === "string" && q.why.trim()) return q.why.trim();
  if (q && typeof q.explain === "string" && q.explain.trim()) return q.explain.trim();
  if (q && typeof q.explanation === "string" && q.explanation.trim()) return q.explanation.trim();

  // Common pack fallback: use the English tip if present.
  if (q && typeof q.tipEn === "string" && q.tipEn.trim()) return q.tipEn.trim();
  return "";
}

function csGetPaHintCompat(q) {
  if (q && typeof q.paHint === "string" && q.paHint.trim()) return q.paHint.trim();
  if (q && typeof q.punjabi === "string" && q.punjabi.trim()) return q.punjabi.trim();
  if (q && typeof q.pa === "string" && q.pa.trim()) return q.pa.trim();

  // Common pack fallback: use the Punjabi tip if present.
  if (q && typeof q.tipPa === "string" && q.tipPa.trim()) return q.tipPa.trim();
  return "";
}

function csResolveAnswer_V2Compat(cs, isCorrect, opts) {
  // If V2 not active, do not interfere.
  if (!cs || !cs.v2 || !cs.round || !Array.isArray(cs.round.queue) || !cs.round.queue.length) return;

  var q = csGetCurrentQueuedQuestion(cs) || cs.currentItem || null;
  var kind = (opts && opts.kind) ? String(opts.kind || "") : "";
  var isTimeout = (kind === "timeout") || !!(opts && opts.isTimeout);
  var allowRetryOnTimeout = !!(opts && opts.allowRetryOnTimeout);

  var why = (opts && typeof opts.why === "string") ? String(opts.why || "").trim() : "";
  var paHint = (opts && typeof opts.paHint === "string") ? String(opts.paHint || "").trim() : "";
  if (!why) why = csGetWhyLineCompat(q);
  if (!paHint) paHint = csGetPaHintCompat(q);

  // Determine if Punjabi should show in Fade mode
  var showPunjabi = !isCorrect || !!cs.round.lastAnswerWasSlow;
  if (isTimeout) showPunjabi = true;

  try {
    csShowFeedback(cs, {
      correct: !!isCorrect,
      why: why,
      paHint: paHint,
      punjabiMode: (cs.settings && cs.settings.punjabiHelp) ? cs.settings.punjabiHelp : "fade",
      showPunjabi: showPunjabi
    });
  } catch (eFB) {}

  // IMPORTANT: Do not change scoring/beam/stability/combo math here.
  // This ONLY decides: retry vs advance.

  if (isCorrect) {
    cs.round.retrying = false;
    cs._csIsRetry = false;
    cs.round.idx = (cs.round.idx | 0) + 1;
    return;
  }

  // Timeout is treated as "wrong" but we avoid retry by default.
  if (isTimeout && !allowRetryOnTimeout) {
    cs.round.retrying = false;
    cs._csIsRetry = false;
    cs.round.idx = (cs.round.idx | 0) + 1;
    return;
  }

  // Wrong (non-timeout): single retry
  if (!cs.round.retrying && cs.round.allowRetry) {
    cs.round.retrying = true;
    cs._csIsRetry = true;
    return;
  }

  // Wrong on retry -> advance
  cs.round.retrying = false;
  cs._csIsRetry = false;
  cs.round.idx = (cs.round.idx | 0) + 1;
}

function csApplyLowFxClass(cs, rootEl) {
  // rootEl optional; fall back to closest .cs root if available
  var root = rootEl || document.querySelector(".cs");
  if (!root || !cs || !cs.settings) return;
  try { root.classList.toggle("cs-lowfx", !!cs.settings.lowFx); } catch (e0) {}
}

function csRenderV2OptionsPanel(cs, mountEl, rootEl) {
  if (!cs || !cs.settings || !mountEl) return;

  // Prevent duplicates on re-render
  try {
    var existing = mountEl.querySelector(".cs-v2opts");
    if (existing) existing.remove();
  } catch (e0) {}

  var s = cs.settings;

  var wrap = document.createElement("div");
  wrap.className = "cs-v2opts";
  wrap.innerHTML = (
    '<div class="cs-v2opts-title">Options</div>' +

    '<div class="cs-v2row">' +
      '<div class="cs-v2label">Level</div>' +
      '<div class="cs-v2ctrl">' +
        '<select class="cs-v2select" id="csV2Level">' +
          '<option value="1">Level 1 (Easy)</option>' +
          '<option value="2">Level 2 (Normal)</option>' +
          '<option value="3">Level 3 (Hard)</option>' +
        '</select>' +
      '</div>' +
    '</div>' +

    '<div class="cs-v2row">' +
      '<div class="cs-v2label">Punjabi Help</div>' +
      '<div class="cs-v2ctrl">' +
        '<select class="cs-v2select" id="csV2PaHelp">' +
          '<option value="on">On</option>' +
          '<option value="fade">Fade</option>' +
          '<option value="off">Off</option>' +
        '</select>' +
      '</div>' +
    '</div>' +

    '<div class="cs-v2row">' +
      '<div class="cs-v2label">Low FX</div>' +
      '<div class="cs-v2ctrl">' +
        '<label class="cs-v2check">' +
          '<input type="checkbox" id="csV2LowFx" />' +
          '<span>Reduce effects</span>' +
        '</label>' +
      '</div>' +
    '</div>'
  );

  mountEl.appendChild(wrap);

  // Initialize values
  var elLevel = wrap.querySelector("#csV2Level");
  var elPa = wrap.querySelector("#csV2PaHelp");
  var elFx = wrap.querySelector("#csV2LowFx");
  if (!elLevel || !elPa || !elFx) return;

  elLevel.value = String(s.level);
  elPa.value = s.punjabiHelp;
  elFx.checked = !!s.lowFx;

  // Persist handlers
  elLevel.addEventListener("change", function() {
    try { cs.settings.level = parseInt(elLevel.value, 10); } catch (e1) { cs.settings.level = 1; }
    csSaveSettings(cs.settings);
  });

  elPa.addEventListener("change", function() {
    cs.settings.punjabiHelp = elPa.value;
    csSaveSettings(cs.settings);
  });

  elFx.addEventListener("change", function() {

/**
 * Compatibility adapter:
 * Returns the next question object using the existing V1 selection logic.
 *
 * Requirements:
 * - Must return an object that your existing renderer can handle
 * - If your V1 logic returns different shapes per pack, just pass them through.
 */
function csGetNextQuestionCompat(cs, focusPackId, phase, level) {
  // phase: "warmup"|"core"|"boss"
  // level: 1|2|3 (not used yet; plumbed for V2)
  // focusPackId: whatever your current focus identifier is

  // Uses existing ClashPacks + pack router behavior (no pack refactor yet).
  // NOTE: Builds against a temporary routerState snapshot stored on cs.
  var q = csPickNextQuestion_V1(cs, focusPackId);
  return q || null;
}

// V1-compatible picker for Game 10 (uses ClashPacks.nextItem and existing pack router rules).
// Returns a pack item object, augmented with _csPackId so the existing renderer can pick a pack.
function csPickNextQuestion_V1(cs, focusPackId) {
  if (!cs) return null;

  var focus = String(focusPackId || (cs.focusMode || "mixed"));
  var routerState = (cs && cs._v2QueueRouterState && typeof cs._v2QueueRouterState === "object")
    ? cs._v2QueueRouterState
    : { lastPacks: [] };

  if (!routerState || typeof routerState !== "object") routerState = { lastPacks: [] };
  if (!Array.isArray(routerState.lastPacks)) routerState.lastPacks = [];

  var primaryPid = "tapWord";
  try {
    if (focus === "tapWord" || focus === "pos" || focus === "tense" || focus === "sentenceCheck") {
      primaryPid = focus;
    } else {
      // Call the existing router (mixed rotation) using a temp cs-like object.
      primaryPid = String(Games._csChooseNextPackId({
        focusMode: focus,
        routerState: routerState,
        timeLeftMs: (typeof cs.timeLeftMs === "number" ? cs.timeLeftMs : 45000),
        phase: String(cs.phase || "early")
      }) || "tapWord");
    }
  } catch (eP0) {
    primaryPid = (focus === "pos" || focus === "tense" || focus === "sentenceCheck") ? focus : "tapWord";
  }

  // Mirror the V1 multi-try behavior: in mixed mode, fall back to other packs before failing.
  var isMixed = (focus === "mixed");
  var tryPids = [primaryPid];
  if (isMixed) {
    var all = ["tapWord", "pos", "tense", "sentenceCheck"];
    for (var i = 0; i < all.length; i++) {
      if (tryPids.indexOf(all[i]) === -1) tryPids.push(all[i]);
    }
  }

  var usedPid = "";
  var picked = null;
  for (var j = 0; j < tryPids.length; j++) {
    var pid = String(tryPids[j] || "");
    if (!pid) continue;
    var pack = null;
    try { pack = ClashPacks[pid] || ClashPacks.tapWord; } catch (eP1) { pack = ClashPacks.tapWord; }

    try {
      picked = (pack && typeof pack.nextItem === "function")
        ? pack.nextItem(cs.difficulty || 2, routerState)
        : null;
    } catch (eNI) {
      picked = null;
    }

    if (picked) {
      usedPid = pid;
      break;
    }
  }

  if (!picked) return null;

  // Track last packs (for mixed behavior parity during queue building).
  try {
    routerState.lastPacks.push(usedPid);
    while (routerState.lastPacks.length > 2) routerState.lastPacks.shift();
  } catch (eLP) {}

  try { picked._csPackId = String(usedPid || "tapWord"); } catch (eTag) {}
  cs._v2QueueRouterState = routerState;
  return picked;
}

function csBuildRoundQueue(cs, focusPackId) {
  if (!cs || !cs.round) return;

  var level = (cs.settings && cs.settings.level) ? cs.settings.level : 1;

  var queue = [];
  var total = csRoundTotalCount();

  // Seed queue[0] with the already-prepared pre-start item when available.
  // This avoids changing the visible first prompt before the first interaction.
  if (cs.currentItem) {
    try {
      if (!cs.currentItem._csPackId) cs.currentItem._csPackId = String(cs.activePackId || "tapWord");
    } catch (eS0) {}
    try {
      cs.currentItem._csPhase = csPhaseForIndex(0);
      cs.currentItem._csLevel = level;
    } catch (eM0) {}
    queue.push(cs.currentItem);
  }

  // Build against a snapshot of the current routerState so we don't disturb live gameplay state.
  var rs = { lastPacks: [] };
  try {
    var src = (cs.routerState && typeof cs.routerState === "object") ? cs.routerState : null;
    if (src && Array.isArray(src.lastPacks)) rs.lastPacks = src.lastPacks.slice();
  } catch (eRS0) { rs.lastPacks = []; }

  // If we seeded with an item, ensure lastPacks reflects it.
  if (queue.length) {
    try {
      var pid0 = String(queue[0]._csPackId || cs.activePackId || "tapWord");
      rs.lastPacks = [pid0];
    } catch (eLP0) {}
  }

  cs._v2QueueRouterState = rs;

  for (var i = queue.length; i < total; i++) {
    var phase = csPhaseForIndex(i);
    try {
      cs._v2QueueRouterState.promptIndex = (i + 1) | 0;
      cs._v2QueueRouterState.phase = "early";
    } catch (ePI) {}

    // For now, phase/level don’t alter selection; they are just plumbed.
    var q = csGetNextQuestionCompat(cs, focusPackId, phase, level);

    // Fail-safe: if content runs out, stop building and let end screen handle it
    if (!q) break;

    // Attach optional metadata (harmless if unused)
    try {
      q._csPhase = phase;
      q._csLevel = level;
    } catch (eMeta) {}

    queue.push(q);
  }

  try { delete cs._v2QueueRouterState; } catch (eDel) { cs._v2QueueRouterState = null; }

  cs.round.queue = queue;
  cs.round.idx = 0;
  cs.round.phase = queue.length ? csPhaseForIndex(0) : "end";
  cs.round.retrying = false;
  cs.round.allowRetry = true;
}

function csGetCurrentQueuedQuestion(cs) {
  if (!cs || !cs.round || !Array.isArray(cs.round.queue)) return null;
  return cs.round.queue[cs.round.idx] || null;
}

function csEndRound_V1Compat(cs) {
  // End the Clash run using the existing end handler.
  try {
    if (window.Games && typeof Games._csEndRun === "function") {
      var outcome = (cs && typeof cs.beamPos === "number" && cs.beamPos > 0) ? "win" : "lose";
      return Games._csEndRun(outcome);
    }
  } catch (e0) {}

  console.warn("[CS V2] No end-round handler found; queue ended.");
}

/**
 * Render the current queued question using your existing V1 renderer.
 * This is a compat layer: we do NOT change how prompts are drawn yet.
 */
function csRenderQueuedQuestion(cs) {
  var q = csGetCurrentQueuedQuestion(cs);

  if (cs && cs.round) {
    cs.round.phase = csPhaseForIndex(cs.round.idx | 0);
  }

  if (!q) {
    if (cs && cs.round) cs.round.phase = "end";
    csEndRound_V1Compat(cs);
    return;
  }

  // Apply pack id to runtime so the existing renderer picks the correct pack.
  try {
    var prevPid = String(cs.activePackId || "");
    var nextPid = String(q._csPackId || prevPid || "tapWord");
    cs.activePackId = nextPid;
    cs.currentItem = q;

    if (prevPid && nextPid && prevPid !== nextPid) {
      cs.packLabelText = Games._csPackLabelForId(nextPid) || "";
      cs.packLabelUntilMs = Date.now() + 600;
    }
  } catch (e1) {
    cs.currentItem = q;
  }

  // Existing renderer reads cs.currentItem + cs.activePackId
  try { if (window.Games && typeof Games._csRenderPromptAndAnswers === "function") Games._csRenderPromptAndAnswers(); } catch (e2) {}

  // HUD simplification + context chip update (V2)
  try { csApplyHudMode(cs, cs._els && cs._els.root ? cs._els.root : null); } catch (eH0) {}
  try { csUpdateContextChip(cs, cs._els && cs._els.root ? cs._els.root : null); } catch (eC0) {}
}
    cs.settings.lowFx = !!elFx.checked;
    csSaveSettings(cs.settings);
    csApplyLowFxClass(cs, rootEl);
  });

  // Apply initial Low FX class so start screen matches saved setting
  csApplyLowFxClass(cs, rootEl);
}

// =====================================
// Clash (Game 10) pack adapters
// =====================================
// Note: Kept as a standalone constant to keep Game 10 logic isolated.
// Legacy articles pack adapter is disabled.
const ClashPacks = {
  tapWord: {
    id: "tapWord",
    label: "GAME 1",

    _pool: null,

    _escapeHtml: function(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    _hashInt: function(s) {
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h | 0);
    },

    _getPool: function() {
      if (Array.isArray(this._pool) && this._pool.length) return this._pool;
      try {
        if (window.Games && typeof window.Games.buildPoolForGameNum === "function") {
          var p = window.Games.buildPoolForGameNum(1);
          if (Array.isArray(p)) {
            this._pool = p.filter(function(q) { return q && q.gameType === "tapWord" && Array.isArray(q.tokens) && q.tokens.length >= 2 && typeof q.correctTokenIndex === "number"; });
            return this._pool;
          }
        }
      } catch (e0) {}
      this._pool = [];
      return this._pool;
    },

    nextItem: function(difficulty, routerState) {
      var pool = this._getPool();
      if (!Array.isArray(pool) || !pool.length) return null;

      var promptIndex = (routerState && typeof routerState.promptIndex === "number") ? (routerState.promptIndex | 0) : 1;
      if (promptIndex < 1) promptIndex = 1;
      var seed = this._hashInt("tapWord|" + String(promptIndex) + "|" + String(difficulty || 2));

      var q = pool[seed % pool.length];
      if (!q || q.gameType !== "tapWord") return null;
      var tokens = Array.isArray(q.tokens) ? q.tokens : null;
      if (!tokens || tokens.length < 2) return null;
      var correctIdx = (typeof q.correctTokenIndex === "number" && isFinite(q.correctTokenIndex)) ? (q.correctTokenIndex | 0) : -1;
      if (correctIdx < 0 || correctIdx >= tokens.length) return null;

      var tipPa = String(q.explanationPa || q.hintPa || "").trim();
      var tipEn = String(q.explanationEn || q.hintEn || "").trim();

      return {
        id: String(q.qid || ("G1_TW:" + String(seed % pool.length))),
        promptEn: String(q.promptEn || "Tap the word."),
        sentenceEn: String(q.sentenceEn || tokens.join(" ") || ""),
        tokens: tokens.slice(),
        correctTokenIndex: correctIdx,
        tipPa: tipPa,
        tipEn: tipEn
      };
    },

    renderPrompt: function(item) {
      if (!item) return "";
      var q = String(item.promptEn || "Tap the word.");
      var s = String(item.sentenceEn || "");
      return (
        "<div class=\"cs-wo\">" +
          "<div class=\"cs-wo-q\">" + this._escapeHtml(q) + "</div>" +
          "<div class=\"cs-wo-preview\">" + this._escapeHtml(s) + "</div>" +
        "</div>"
      );
    },

    renderAnswers: function(item) {
      if (!item || !Array.isArray(item.tokens) || !item.tokens.length) return "";
      var out = [];
      out.push("<div class=\"cs-wo-chunks\" role=\"group\" aria-label=\"Tap the word\">");
      for (var i = 0; i < item.tokens.length; i++) {
        var t = String(item.tokens[i] == null ? "" : item.tokens[i]);
        out.push(
          "<button type=\"button\" class=\"cs-woch\" data-choice=\"" + String(i) + "\" aria-label=\"Choose word: " + this._escapeHtml(t) + "\">" +
            this._escapeHtml(t) +
          "</button>"
        );
      }
      out.push("</div>");
      return out.join("");
    },

    bindHandlers: function(rootEl, item, onChoice) {
      if (!rootEl || typeof onChoice !== "function") return;
      if (rootEl.dataset && rootEl.dataset.csBound === "1") return;
      if (rootEl.dataset) rootEl.dataset.csBound = "1";

      var lastFireTs = 0;

      function fire(choiceValue) {
        var now = Date.now();
        if (now - lastFireTs < 250) return; // Prevent rapid firing
        lastFireTs = now;
        try {
          var cs = window.Games && window.Games.runtime && window.Games.runtime.cs;
          if (!cs || cs.isOver || cs.locked || cs.resolving) return;
        } catch (e0) {}
        onChoice(String(choiceValue || ""));
      }

      var buttons = rootEl.querySelectorAll("button[data-choice]");
      for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
          try {
            btn.addEventListener("pointerup", function(ev) {
              if (ev && typeof ev.button === "number" && ev.button !== 0) return;
              fire(btn.getAttribute("data-choice") || "");
            }, { passive: true });

            try {
              btn.addEventListener("click", function() {
                fire(btn.getAttribute("data-choice") || "");
              });
            } catch (eCL) {}
          } catch (ePU) {}

          try {
            btn.addEventListener("keydown", function(ev) {
              var k = ev && (ev.key || ev.code);
              if (k !== "Enter" && k !== " " && k !== "Spacebar" && k !== "Space") return;
              try { ev.preventDefault(); } catch (eP) {}
              fire(btn.getAttribute("data-choice") || "");
            });
          } catch (eKD) {}
        })(buttons[i]);
      }
    },

    check: function(item, choiceValue) {
      if (!item) return null;
      var idx = parseInt(String(choiceValue || ""), 10);
      if (!isFinite(idx)) return null;

      var idxs = Array.isArray(item.correctTokenIndices) ? item.correctTokenIndices.slice() : null;
      if (!idxs || !idxs.length) {
        if (typeof item.correctTokenIndex === "number" && isFinite(item.correctTokenIndex)) idxs = [item.correctTokenIndex | 0];
      }
      if (!Array.isArray(idxs) || !idxs.length) return null;

      var ok = (idxs.indexOf(idx | 0) !== -1);
      return {
        correct: ok,
        tipPa: String((item && item.tipPa) || "").trim(),
        tipEn: String((item && item.tipEn) || "").trim(),
        ruleTag: ""
      };
    }
  },

  // ===== P0 V2 data integrity (versions, validators, cache migration) =====
  _readDataIntegrityStamp: function() {
    try {
      var raw = localStorage.getItem(DATA_INTEGRITY_LS_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : null;
    } catch (e) {
      return null;
    }
  },

  _writeDataIntegrityStamp: function(stamp) {
    try { localStorage.setItem(DATA_INTEGRITY_LS_KEY, JSON.stringify(stamp || {})); } catch (e) {}
  },

  _clearLocalStorageByPrefix: function(prefix) {
    try {
      if (!prefix) return 0;
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && String(k).indexOf(prefix) === 0) keys.push(String(k));
      }
      for (var j = 0; j < keys.length; j++) {
        try { localStorage.removeItem(keys[j]); } catch (e2) {}
      }
      return keys.length;
    } catch (e3) {
      return 0;
    }
  },

  _resetGame1Game4Caches: function() {
    // Runtime caches
    try {
      if (Games.runtime) {
        Games.runtime._optionSetCache = {};
        Games.runtime._g4RecapByQid = {};
      }
    } catch (e0) {}

    // LocalStorage caches
    var removed = 0;
    removed += Games._clearLocalStorageByPrefix("bolo_g4_sentencecheck_recap_v1:");
    removed += Games._clearLocalStorageByPrefix("bolo_g4_sentencecheck_reports_v1:");
    return removed;
  },

  _summarizeReasonsTopN: function(reasonsCount, n) {
    var rc = (reasonsCount && typeof reasonsCount === "object") ? reasonsCount : {};
    var pairs = Object.keys(rc).map(function(k) { return { reason: k, count: rc[k] | 0 }; });
    pairs.sort(function(a, b) { return (b.count | 0) - (a.count | 0); });
    return pairs.slice(0, Math.max(1, n | 0));
  },

  _devValidateAndQuarantineBanksV2: function() {
    var debug = (typeof window !== "undefined" && window && window.BOLO_DEBUG === true);
    if (!debug) return;

    if (!Games.runtime) Games.runtime = {};
    if (!Games.runtime._rawQuarantine) Games.runtime._rawQuarantine = {};

    // Game 1
    try {
      if (typeof window.validateGame1Bank === "function" && typeof GAME1_QUESTIONS !== "undefined") {
        var r1 = window.validateGame1Bank(GAME1_QUESTIONS);
        var q1 = {};
        if (r1 && Array.isArray(r1.invalidItems)) {
          for (var i = 0; i < r1.invalidItems.length; i++) {
            var idx = r1.invalidItems[i] ? (r1.invalidItems[i].index | 0) : -1;
            if (idx >= 0) q1[idx] = true;
          }
        }
        Games.runtime._rawQuarantine.GAME1 = q1;

        var top1 = Games._summarizeReasonsTopN(r1 ? r1.reasonsCount : null, 5);
        console.warn("[DATA] GAME1 bank validation (V2)", {
          valid: r1 ? r1.valid : 0,
          invalid: r1 ? r1.invalid : 0,
          topReasons: top1,
          quarantinedCount: Object.keys(q1).length
        });

        if (r1 && r1.invalidItems && r1.invalidItems.length) {
          try { console.warn("[DATA] GAME1 invalid sample", r1.invalidItems.slice(0, 5)); } catch (e1) {}
        }
      }
    } catch (eG1) {}

    // Game 4
    try {
      if (typeof window.validateGame4Bank === "function" && typeof GAME4_QUESTIONS !== "undefined") {
        var r4 = window.validateGame4Bank(GAME4_QUESTIONS);
        var q4 = {};
        if (r4 && Array.isArray(r4.invalidItems)) {
          for (var j = 0; j < r4.invalidItems.length; j++) {
            var idx2 = r4.invalidItems[j] ? (r4.invalidItems[j].index | 0) : -1;
            if (idx2 >= 0) q4[idx2] = true;
          }
        }
        Games.runtime._rawQuarantine.GAME4 = q4;

        var top4 = Games._summarizeReasonsTopN(r4 ? r4.reasonsCount : null, 5);
        console.warn("[DATA] GAME4 bank validation (V2)", {
          valid: r4 ? r4.valid : 0,
          invalid: r4 ? r4.invalid : 0,
          topReasons: top4,
          quarantinedCount: Object.keys(q4).length
        });

        if (r4 && r4.invalidItems && r4.invalidItems.length) {
          try { console.warn("[DATA] GAME4 invalid sample", r4.invalidItems.slice(0, 5)); } catch (e2) {}
        }
      }
    } catch (eG4) {}
  },

  _initDataIntegrityV2: function() {
    var current = {
      dataVersion: DATA_VERSION,
      banks: {
        GAME1: BANK_VERSION_GAME1,
        GAME4: BANK_VERSION_GAME4
      }
    };

    var prev = Games._readDataIntegrityStamp();
    var changed = false;
    if (!prev || typeof prev !== "object") {
      changed = true;
    } else {
      if (String(prev.dataVersion || "") !== String(current.dataVersion || "")) changed = true;
      if (!prev.banks || typeof prev.banks !== "object") changed = true;
      if (!changed) {
        if (String(prev.banks.GAME1 || "") !== String(current.banks.GAME1 || "")) changed = true;
        if (String(prev.banks.GAME4 || "") !== String(current.banks.GAME4 || "")) changed = true;
      }
    }

    if (changed) {
      var removed = 0;
      try { removed = Games._resetGame1Game4Caches(); } catch (e0) {}
      try {
        if (typeof window !== "undefined" && window && window.BOLO_DEBUG === true) {
          console.warn("[DATA] Version changed; cleared Game1/Game4 caches", {
            prev: prev || null,
            current: current,
            removedLocalStorageKeys: removed
          });
        }
      } catch (e1) {}
    }

    current.ts = Date.now();
    Games._writeDataIntegrityStamp(current);

    // Dev-only: validate banks and quarantine invalid raw indices.
    Games._devValidateAndQuarantineBanksV2();
  },

  pos: {
    id: "pos",
    label: "GAME 2",

    _pool: null,

    _escapeHtml: function(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    _hashInt: function(s) {
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h | 0);
    },

    _getPool: function() {
      if (Array.isArray(this._pool) && this._pool.length) return this._pool;
      try {
        if (window.Games && typeof window.Games.buildPoolForGameNum === "function") {
          var p = window.Games.buildPoolForGameNum(2);
          if (Array.isArray(p)) {
            this._pool = p.filter(function(q) {
              return q && q.gameType === "pos" && Array.isArray(q._choiceIds) && Array.isArray(q._choiceLabels) && typeof q.correctIndex === "number";
            });
            return this._pool;
          }
        }
      } catch (e0) {}
      this._pool = [];
      return this._pool;
    },

    nextItem: function(difficulty, routerState) {
      var pool = this._getPool();
      if (!Array.isArray(pool) || !pool.length) return null;

      var promptIndex = (routerState && typeof routerState.promptIndex === "number") ? (routerState.promptIndex | 0) : 1;
      if (promptIndex < 1) promptIndex = 1;
      var seed = this._hashInt("pos|" + String(promptIndex) + "|" + String(difficulty || 2));

      var q = pool[seed % pool.length];
      if (!q || q.gameType !== "pos") return null;

      var ids = Array.isArray(q._choiceIds) ? q._choiceIds : [];
      var labels = Array.isArray(q._choiceLabels) ? q._choiceLabels : [];
      if (!ids.length || !labels.length || ids.length !== labels.length) return null;

      var correctIdx = (typeof q.correctIndex === "number" && isFinite(q.correctIndex)) ? (q.correctIndex | 0) : -1;
      if (correctIdx < 0 || correctIdx >= ids.length) return null;

      var tipPa = String(q.explanationPa || q.hintPa || "").trim();
      var tipEn = String(q.explanationEn || q.hintEn || "").trim();

      return {
        id: String(q.qid || ("G2_POS:" + String(seed % pool.length))),
        promptEn: String(q.promptEn || "Pick the word type."),
        choiceIds: ids.slice(),
        choiceLabels: labels.slice(),
        correctChoiceId: String(ids[correctIdx] || ""),
        tipPa: tipPa,
        tipEn: tipEn
      };
    },

    renderPrompt: function(item) {
      if (!item) return "";
      var q = String(item.promptEn || "Pick the word type.");
      return (
        "<div class=\"cs-wo\">" +
          "<div class=\"cs-wo-q\">" + this._escapeHtml(q) + "</div>" +
        "</div>"
      );
    },

    renderAnswers: function(item) {
      if (!item || !Array.isArray(item.choiceIds) || !Array.isArray(item.choiceLabels) || !item.choiceIds.length) return "";
      var out = [];
      out.push("<div class=\"cs-wo-chunks cs-wo-chunks--two\" role=\"group\" aria-label=\"Choose the word type\">");
      for (var i = 0; i < item.choiceIds.length; i++) {
        var id = String(item.choiceIds[i] || "");
        var lbl = String(item.choiceLabels[i] == null ? "" : item.choiceLabels[i]);
        if (!id) continue;
        out.push(
          "<button type=\"button\" class=\"cs-woch\" data-choice=\"" + this._escapeHtml(id) + "\" aria-label=\"Choose: " + this._escapeHtml(lbl) + "\">" +
            this._escapeHtml(lbl || id) +
          "</button>"
        );
      }
      out.push("</div>");
      return out.join("");
    },

    bindHandlers: function(rootEl, item, onChoice) {
      if (!rootEl || typeof onChoice !== "function") return;
      if (rootEl.dataset && rootEl.dataset.csBound === "1") return;
      if (rootEl.dataset) rootEl.dataset.csBound = "1";

      var lastFireTs = 0;

      function fire(choiceValue) {
        var now = Date.now();
        if (now - lastFireTs < 250) return;
        lastFireTs = now;
        try {
          var cs = window.Games && window.Games.runtime && window.Games.runtime.cs;
          if (!cs || cs.isOver || cs.locked || cs.resolving) return;
        } catch (e0) {}
        onChoice(String(choiceValue || ""));
      }

      var buttons = rootEl.querySelectorAll("button[data-choice]");
      for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
          try {
            btn.addEventListener("pointerup", function(ev) {
              if (ev && typeof ev.button === "number" && ev.button !== 0) return;
              fire(btn.getAttribute("data-choice") || "");
            }, { passive: true });

            try {
              btn.addEventListener("click", function() {
                fire(btn.getAttribute("data-choice") || "");
              });
            } catch (eCL) {}
          } catch (ePU) {}

          try {
            btn.addEventListener("keydown", function(ev) {
              var k = ev && (ev.key || ev.code);
              if (k !== "Enter" && k !== " " && k !== "Spacebar" && k !== "Space") return;
              try { ev.preventDefault(); } catch (eP) {}
              fire(btn.getAttribute("data-choice") || "");
            });
          } catch (eKD) {}
        })(buttons[i]);
      }
    },

    check: function(item, choiceValue) {
      if (!item) return null;
      var chosen = String(choiceValue || "").trim();
      var correct = String(item.correctChoiceId || "").trim();
      if (!chosen || !correct) return null;
      var ok = (chosen === correct);
      return {
        correct: ok,
        tipPa: String((item && item.tipPa) || "").trim(),
        tipEn: String((item && item.tipEn) || "").trim(),
        ruleTag: ""
      };
    }
  },

  tense: {
    id: "tense",
    label: "GAME 3",

    _pool: null,

    _escapeHtml: function(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    _hashInt: function(s) {
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h | 0);
    },

    _getPool: function() {
      if (Array.isArray(this._pool) && this._pool.length) return this._pool;
      try {
        if (window.Games && typeof window.Games.buildPoolForGameNum === "function") {
          var p = window.Games.buildPoolForGameNum(3);
          if (Array.isArray(p)) {
            this._pool = p.filter(function(q) {
              return q && q.gameType === "tense" && Array.isArray(q._choiceIds) && Array.isArray(q._choiceLabels) && typeof q.correctIndex === "number";
            });
            return this._pool;
          }
        }
      } catch (e0) {}
      this._pool = [];
      return this._pool;
    },

    nextItem: function(difficulty, routerState) {
      var pool = this._getPool();
      if (!Array.isArray(pool) || !pool.length) return null;

      var promptIndex = (routerState && typeof routerState.promptIndex === "number") ? (routerState.promptIndex | 0) : 1;
      if (promptIndex < 1) promptIndex = 1;
      var seed = this._hashInt("tense|" + String(promptIndex) + "|" + String(difficulty || 2));

      var q = pool[seed % pool.length];
      if (!q || q.gameType !== "tense") return null;

      var ids = Array.isArray(q._choiceIds) ? q._choiceIds : [];
      var labels = Array.isArray(q._choiceLabels) ? q._choiceLabels : [];
      if (!ids.length || !labels.length || ids.length !== labels.length) return null;

      var correctIdx = (typeof q.correctIndex === "number" && isFinite(q.correctIndex)) ? (q.correctIndex | 0) : -1;
      if (correctIdx < 0 || correctIdx >= ids.length) return null;

      var tipPa = String(q.explanationPa || q.hintPa || "").trim();
      var tipEn = String(q.explanationEn || q.hintEn || "").trim();

      return {
        id: String(q.qid || ("G3_TENSE:" + String(seed % pool.length))),
        sentenceEn: String(q.promptEn || ""),
        choiceIds: ids.slice(),
        choiceLabels: labels.slice(),
        correctChoiceId: String(ids[correctIdx] || ""),
        tipPa: tipPa,
        tipEn: tipEn
      };
    },

    renderPrompt: function(item) {
      if (!item) return "";
      var s = String(item.sentenceEn || "");
      return (
        "<div class=\"cs-wo\">" +
          "<div class=\"cs-wo-q\">Choose the tense</div>" +
          "<div class=\"cs-wo-preview\">" + this._escapeHtml(s) + "</div>" +
        "</div>"
      );
    },

    renderAnswers: function(item) {
      if (!item || !Array.isArray(item.choiceIds) || !Array.isArray(item.choiceLabels) || !item.choiceIds.length) return "";
      var out = [];
      out.push("<div class=\"cs-wo-chunks cs-wo-chunks--three\" role=\"group\" aria-label=\"Choose the tense\">");
      for (var i = 0; i < item.choiceIds.length; i++) {
        var id = String(item.choiceIds[i] || "");
        var lbl = String(item.choiceLabels[i] == null ? "" : item.choiceLabels[i]);
        if (!id) continue;
        out.push(
          "<button type=\"button\" class=\"cs-woch\" data-choice=\"" + this._escapeHtml(id) + "\" aria-label=\"Choose: " + this._escapeHtml(lbl) + "\">" +
            this._escapeHtml(lbl || id) +
          "</button>"
        );
      }
      out.push("</div>");
      return out.join("");
    },

    bindHandlers: function(rootEl, item, onChoice) {
      if (!rootEl || typeof onChoice !== "function") return;
      if (rootEl.dataset && rootEl.dataset.csBound === "1") return;
      if (rootEl.dataset) rootEl.dataset.csBound = "1";

      var lastFireTs = 0;

      function fire(choiceValue) {
        var now = Date.now();
        if (now - lastFireTs < 250) return;
        lastFireTs = now;
        try {
          var cs = window.Games && window.Games.runtime && window.Games.runtime.cs;
          if (!cs || cs.isOver || cs.locked || cs.resolving) return;
        } catch (e0) {}
        onChoice(String(choiceValue || ""));
      }

      var buttons = rootEl.querySelectorAll("button[data-choice]");
      for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
          try {
            btn.addEventListener("pointerup", function(ev) {
              if (ev && typeof ev.button === "number" && ev.button !== 0) return;
              fire(btn.getAttribute("data-choice") || "");
            }, { passive: true });

            try {
              btn.addEventListener("click", function() {
                fire(btn.getAttribute("data-choice") || "");
              });
            } catch (eCL) {}
          } catch (ePU) {}

          try {
            btn.addEventListener("keydown", function(ev) {
              var k = ev && (ev.key || ev.code);
              if (k !== "Enter" && k !== " " && k !== "Spacebar" && k !== "Space") return;
              try { ev.preventDefault(); } catch (eP) {}
              fire(btn.getAttribute("data-choice") || "");
            });
          } catch (eKD) {}
        })(buttons[i]);
      }
    },

    check: function(item, choiceValue) {
      if (!item) return null;
      var chosen = String(choiceValue || "").trim();
      var correct = String(item.correctChoiceId || "").trim();
      if (!chosen || !correct) return null;
      var ok = (chosen === correct);
      return {
        correct: ok,
        tipPa: String((item && item.tipPa) || "").trim(),
        tipEn: String((item && item.tipEn) || "").trim(),
        ruleTag: ""
      };
    }
  },

  articles: {
    id: "articles",
    label: "ARTICLES",
    nextItem: function() {
      return null;
    },

    renderPrompt: function() {
      return "";
    },

    renderAnswers: function() {
      return "";
    },

    bindHandlers: function() {},

    check: function() {
      return null;
    }
  },

  sentenceCheck: {
    id: "sentenceCheck",
    label: "GAME 4",

    _pool: null,

    _escapeHtml: function(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    _hashInt: function(s) {
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h | 0);
    },

    _getPool: function() {
      if (Array.isArray(this._pool) && this._pool.length) return this._pool;
      try {
        if (window.Games && typeof window.Games.buildPoolForGameNum === "function") {
          var p = window.Games.buildPoolForGameNum(4);
          if (Array.isArray(p)) {
            this._pool = p.filter(function(q) { return q && q.gameType === "sentenceCheck" && Array.isArray(q.optionsEn) && q.optionsEn.length >= 2 && typeof q.correctIndex === "number"; });
            return this._pool;
          }
        }
      } catch (e0) {}
      this._pool = [];
      return this._pool;
    },

    nextItem: function(difficulty, routerState) {
      var pool = this._getPool();
      if (!Array.isArray(pool) || !pool.length) return null;

      var promptIndex = (routerState && typeof routerState.promptIndex === "number") ? (routerState.promptIndex | 0) : 1;
      if (promptIndex < 1) promptIndex = 1;
      var seed = this._hashInt("sentence|" + String(promptIndex) + "|" + String(difficulty || 2));

      var q = pool[seed % pool.length];
      if (!q || q.gameType !== "sentenceCheck") return null;
      var opts = Array.isArray(q.optionsEn) ? q.optionsEn : [];
      if (opts.length < 2) return null;
      var correctIdx = (typeof q.correctIndex === "number" && isFinite(q.correctIndex)) ? (q.correctIndex | 0) : 0;
      if (correctIdx < 0 || correctIdx > 1) correctIdx = 0;

      var tipPa = String(q.explanationPa || q.hintPa || "").trim();
      var tipEn = String(q.explanationEn || q.hintEn || "").trim();

      return {
        id: String(q.qid || ("G4_SC:" + String(seed % pool.length))),
        optionsEn: [String(opts[0] || "").trim(), String(opts[1] || "").trim()],
        correctIndex: correctIdx,
        tipPa: tipPa,
        tipEn: tipEn
      };
    },

    renderPrompt: function(item) {
      if (!item || !Array.isArray(item.optionsEn) || item.optionsEn.length < 2) return "";
      return (
        "<div class=\"cs-sc\">" +
          "<div class=\"cs-sc-q\">Pick the best sentence</div>" +
        "</div>"
      );
    },

    renderAnswers: function(item) {
      if (!item || !Array.isArray(item.optionsEn) || item.optionsEn.length < 2) return "";
      var a = String(item.optionsEn[0] || "");
      var b = String(item.optionsEn[1] || "");
      return (
        "<div class=\"cs-wo-chunks cs-wo-chunks--one\" role=\"group\" aria-label=\"Pick the best sentence\">" +
          "<button type=\"button\" class=\"cs-woch cs-woch--sentence\" data-choice=\"0\" aria-label=\"Choose sentence option 1\">" + this._escapeHtml(a) + "</button>" +
          "<button type=\"button\" class=\"cs-woch cs-woch--sentence\" data-choice=\"1\" aria-label=\"Choose sentence option 2\">" + this._escapeHtml(b) + "</button>" +
        "</div>"
      );
    },

    bindHandlers: function(rootEl, item, onChoice) {
      if (!rootEl || typeof onChoice !== "function") return;
      if (rootEl.dataset && rootEl.dataset.csBound === "1") return;
      if (rootEl.dataset) rootEl.dataset.csBound = "1";

      var lastFireTs = 0;

      function fire(choiceValue) {
        var now = Date.now();
        if (now - lastFireTs < 250) return;
        lastFireTs = now;
        try {
          var cs = window.Games && window.Games.runtime && window.Games.runtime.cs;
          if (!cs || cs.isOver || cs.locked || cs.resolving) return;
        } catch (e0) {}
        onChoice(String(choiceValue || ""));
      }

      var buttons = rootEl.querySelectorAll("button[data-choice]");
      for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
          try {
            btn.addEventListener("pointerup", function(ev) {
              if (ev && typeof ev.button === "number" && ev.button !== 0) return;
              fire(btn.getAttribute("data-choice") || "");
            }, { passive: true });

          try {
            btn.addEventListener("click", function() {
              fire(btn.getAttribute("data-choice") || "");
            });
          } catch (eCL) {}
          } catch (ePU) {}

          try {
            btn.addEventListener("keydown", function(ev) {
              var k = ev && (ev.key || ev.code);
              if (k !== "Enter" && k !== " " && k !== "Spacebar" && k !== "Space") return;
              try { ev.preventDefault(); } catch (eP) {}
              fire(btn.getAttribute("data-choice") || "");
            });
          } catch (eKD) {}
        })(buttons[i]);
      }
    },

    check: function(item, choiceValue) {
      if (!item || typeof item.correctIndex !== "number") return null;
      var idx = parseInt(String(choiceValue || ""), 10);
      if (!isFinite(idx) || idx < 0 || idx > 1) return null;
      var ok = ((idx | 0) === (item.correctIndex | 0));

      return {
        correct: ok,
        tipPa: String((item && item.tipPa) || "").trim(),
        tipEn: String((item && item.tipEn) || "").trim(),
        ruleTag: ""
      };
    }
  },

  wordOrderMicro: {
    id: "wordOrderMicro",
    label: "WORD ORDER",

    _pool: null,

    _escapeHtml: function(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    _hashInt: function(s) {
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
      return Math.abs(h | 0);
    },

    _seededRng: function(seedInt) {
      var x = (seedInt | 0) || 1;
      return function() {
        x = (x * 1664525 + 1013904223) | 0;
        return (x >>> 0) / 4294967296;
      };
    },

    _arraysEqual: function(a, b) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (String(a[i]) !== String(b[i])) return false;
      }
      return true;
    },

    _getBasePool: function() {
      if (Array.isArray(this._pool) && this._pool.length) return this._pool;
      try {
        if (window.Games && typeof window.Games.normalizeGame8WordOrderQuestions === "function") {
          var raw = [];
          try {
            if (typeof RAW_GAME8_WORD_ORDER !== "undefined" && Array.isArray(RAW_GAME8_WORD_ORDER)) raw = RAW_GAME8_WORD_ORDER;
          } catch (eR) {}
          var p = window.Games.normalizeGame8WordOrderQuestions(raw);
          if (Array.isArray(p)) {
            this._pool = p.filter(function(q) { return q && q.gameType === "wordOrderSurgery" && Array.isArray(q.targetChunks) && q.targetChunks.length >= 3; });
            return this._pool;
          }
        }
      } catch (e0) {}
      this._pool = [];
      return this._pool;
    },

    nextItem: function(difficulty, routerState) {
      var pool = this._getBasePool();
      if (!Array.isArray(pool) || !pool.length) return null;

      var promptIndex = (routerState && typeof routerState.promptIndex === "number") ? (routerState.promptIndex | 0) : 1;
      if (promptIndex < 1) promptIndex = 1;
      var seed = this._hashInt("woMicro|" + String(promptIndex) + "|" + String(difficulty || 2));

      var phase = (routerState && typeof routerState.phase === "string") ? routerState.phase : "";
      var isEarly = (String(phase) === "early");

      function toFilteredChunks(base) {
        if (!base || !Array.isArray(base.targetChunks)) return null;
        var filtered = base.targetChunks.filter(function(t) {
          var s = String(t || "").trim();
          if (!s) return false;
          return !(/^[\.,\?!]$/.test(s));
        });
        if (filtered.length < 3) filtered = base.targetChunks.slice();
        if (filtered.length < 3) return null;
        return filtered;
      }

      var base = null;
      var filtered = null;
      var start = 0;
      var bestScore = Infinity;
      var bestPick = null;
      var scanN = isEarly ? Math.min(8, pool.length) : 1;
      for (var k = 0; k < scanN; k++) {
        var idxTry = isEarly ? ((seed + (k * 13)) % pool.length) : (seed % pool.length);
        var bTry = pool[idxTry];
        var fTry = toFilteredChunks(bTry);
        if (!fTry) continue;
        var startTry = (seed + k) % Math.max(1, (fTry.length - 2));
        var t0 = String(fTry[startTry] || "");
        var t1 = String(fTry[startTry + 1] || "");
        var t2 = String(fTry[startTry + 2] || "");
        if (!t0 || !t1 || !t2) continue;
        var score = (t0.length + t1.length + t2.length);
        if (!isFinite(score)) score = 999999;

        if (!isEarly) {
          bestPick = { base: bTry, filtered: fTry, start: startTry };
          break;
        }

        if (score < bestScore) {
          bestScore = score;
          bestPick = { base: bTry, filtered: fTry, start: startTry, k: k };
        }
      }

      if (!bestPick) return null;
      base = bestPick.base;
      filtered = bestPick.filtered;
      start = bestPick.start;

      var target3 = [String(filtered[start] || ""), String(filtered[start + 1] || ""), String(filtered[start + 2] || "")];
      if (!target3[0] || !target3[1] || !target3[2]) return null;

      // Scramble (not solved)
      var extraSeed = (bestPick && typeof bestPick.k === "number") ? (bestPick.k | 0) : 0;
      var rng = this._seededRng((seed ^ 0xA51) ^ (extraSeed * 97));
      var chunks = target3.slice();
      for (var i = chunks.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = chunks[i];
        chunks[i] = chunks[j];
        chunks[j] = tmp;
      }
      if (this._arraysEqual(chunks, target3)) {
        var t0 = chunks[0];
        chunks[0] = chunks[1];
        chunks[1] = t0;
      }

      var tipPa = String(base.tipPa || "").trim();
      var tipEn = String(base.tipEn || "").trim();

      return {
        id: String(base.qid || base.id || "G8_WO") + ":M:" + String(start),
        targetChunks: target3,
        chunks: chunks,
        _selectedIndex: null,
        tipPa: tipPa,
        tipEn: tipEn
      };
    },

    renderPrompt: function(item) {
      if (!item || !Array.isArray(item.chunks)) return "";
      var txt = item.chunks.map(function(s) { return String(s || "").trim(); }).filter(function(s) { return !!s; }).join(" ");
      return (
        "<div class=\"cs-wo\">" +
          "<div class=\"cs-wo-q\">Tap two chunks to swap.</div>" +
          "<div class=\"cs-wo-preview\">" + this._escapeHtml(txt) + "</div>" +
        "</div>"
      );
    },

    renderAnswers: function(item) {
      if (!item || !Array.isArray(item.chunks) || item.chunks.length !== 3) return "";
      var out = [];
      out.push("<div class=\"cs-wo-chunks\" role=\"group\" aria-label=\"Swap chunks\">");
      for (var i = 0; i < 3; i++) {
        var t = String(item.chunks[i] || "");
        var sel = (item._selectedIndex === i) ? " is-selected" : "";
        out.push(
          "<button type=\"button\" class=\"cs-woch\" data-idx=\"" + String(i) + "\" aria-label=\"Swap chunk: " + this._escapeHtml(t) + "\" >" +
            this._escapeHtml(t) +
          "</button>"
        );
      }
      out.push("</div>");
      return out.join("");
    },

    bindHandlers: function(rootEl, item, onChoice) {
      if (!rootEl || !item || typeof onChoice !== "function") return;
      if (rootEl.dataset && rootEl.dataset.csBound === "1") return;
      if (rootEl.dataset) rootEl.dataset.csBound = "1";

      var lastTapTs = 0;

      function canInteract() {
        try {
          var cs = window.Games && window.Games.runtime && window.Games.runtime.cs;
          if (!cs || cs.isOver || cs.locked || cs.resolving) return false;
          return true;
        } catch (e0) {
          return false;
        }
      }

      function setSelected(idx) {
        item._selectedIndex = (typeof idx === "number") ? idx : null;
        try {
          var btns = rootEl.querySelectorAll("button[data-idx]");
          for (var bi = 0; bi < btns.length; bi++) {
            var b = btns[bi];
            var di = parseInt(b.getAttribute("data-idx") || "-1", 10);
            b.classList.toggle("is-selected", di === item._selectedIndex);
          }
        } catch (eR) {}
      }

      function onTap(idx) {
        var now = Date.now();
        if (now - lastTapTs < 250) return;
        lastTapTs = now;
        if (!canInteract()) return;
        if (typeof idx !== "number" || idx < 0 || idx > 2) return;
        var sel = (typeof item._selectedIndex === "number") ? item._selectedIndex : null;
        if (sel == null) {
          setSelected(idx);
          return;
        }
        if (sel === idx) {
          setSelected(null);
          return;
        }
        // Swap attempt
        setSelected(null);
        onChoice("swap:" + String(sel) + ":" + String(idx));
      }

      var buttons = rootEl.querySelectorAll("button[data-idx]");
      for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
          var idx = parseInt(btn.getAttribute("data-idx") || "-1", 10);
          try {
            btn.addEventListener("pointerup", function(ev) {
              if (ev && typeof ev.button === "number" && ev.button !== 0) return;
              onTap(idx);
            }, { passive: true });

          try {
            btn.addEventListener("click", function() {
              onTap(idx);
            });
          } catch (eCL) {}
          } catch (ePU) {}

          try {
            btn.addEventListener("keydown", function(ev) {
              var k = ev && (ev.key || ev.code);
              if (k !== "Enter" && k !== " " && k !== "Spacebar" && k !== "Space") return;
              try { ev.preventDefault(); } catch (eP) {}
              onTap(idx);
            });
          } catch (eKD) {}
        })(buttons[i]);
      }
    },

    check: function(item, choiceValue) {
      if (!item || !Array.isArray(item.chunks) || !Array.isArray(item.targetChunks)) return null;
      var v = String(choiceValue || "");
      var m = v.match(/^swap:(\d+):(\d+)$/);
      if (!m) return null;
      var a = parseInt(m[1], 10);
      var b = parseInt(m[2], 10);
      if (!isFinite(a) || !isFinite(b) || a < 0 || a > 2 || b < 0 || b > 2) return null;

      var tmp = item.chunks[a];
      item.chunks[a] = item.chunks[b];
      item.chunks[b] = tmp;

      var ok = this._arraysEqual(item.chunks, item.targetChunks);
      return {
        correct: ok,
        tipPa: String((item && item.tipPa) || "").trim(),
        tipEn: String((item && item.tipEn) || "").trim(),
        ruleTag: ""
      };
    }
  }
};

// Dev-only: validate Game 8 bank on first debug start.
var DEBUG_VALIDATE_G8_BANK = (function() {
  try {
    var h = (window.location && window.location.hostname) ? String(window.location.hostname) : "";
    var isDev = (h === "localhost" || h === "127.0.0.1" || h === "" || h.endsWith(".local"));
    return !!isDev;
  } catch (e) {
    return false;
  }
})();

// =====================================
// Game 8 (MVP, dev-start only): Word Order Surgery
// =====================================
// Schema:
// { id, difficulty:"easy|normal|hard", pattern:"TIME|AUX|NEG|QUESTION|...",
//   targetChunks:[...], acceptableTargets:null, distractors:[], tipPa, tipEn }
// NOTE: This lives in games.js (not app/data) by design for the MVP.
var RAW_GAME8_WORD_ORDER = [
  // --- TIME (6+) ---
  {
    id: "G8_WO_001",
    difficulty: "easy",
    pattern: "TIME",
    targetChunks: ["Yesterday", "I", "played", "soccer", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "TIME ਵਾਲਾ ਸ਼ਬਦ ਅਕਸਰ ਸ਼ੁਰੂ 'ਤੇ ਆਉਂਦਾ ਹੈ।",
    tipEn: "Time words often go at the start."
  },
  {
    id: "G8_WO_002",
    difficulty: "easy",
    pattern: "TIME",
    targetChunks: ["Today", "we", "read", "a", "story", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "TIME + subject + verb = ਸਾਫ਼ ਆਰਡਰ।",
    tipEn: "Time + subject + verb is a clean order."
  },
  {
    id: "G8_WO_003",
    difficulty: "normal",
    pattern: "TIME",
    targetChunks: ["In the morning", ",", "she", "drinks", "tea", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "TIME phrase ਪਹਿਲਾਂ, ਫਿਰ subject ਆਉਂਦਾ ਹੈ।",
    tipEn: "Put the time phrase first, then the subject."
  },
  {
    id: "G8_WO_004",
    difficulty: "normal",
    pattern: "TIME",
    targetChunks: ["After school", ",", "they", "do", "homework", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Comma ਨਾਲ TIME phrase ਨੂੰ ਵੱਖ ਕਰੋ।",
    tipEn: "Use a comma after a fronted time phrase."
  },
  {
    id: "G8_WO_005",
    difficulty: "hard",
    pattern: "TIME",
    targetChunks: ["Next week", ",", "I", "will", "visit", "my", "grandparents", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Future ਵਿੱਚ will verb ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "In future, 'will' comes before the verb."
  },
  {
    id: "G8_WO_006",
    difficulty: "hard",
    pattern: "TIME",
    targetChunks: ["Last night", ",", "we", "were", "very", "tired", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "TIME phrase + comma + sentence.",
    tipEn: "Time phrase + comma + sentence."
  },

  // --- AUX (6+) ---
  {
    id: "G8_WO_007",
    difficulty: "easy",
    pattern: "AUX",
    targetChunks: ["I", "am", "reading", "now", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "am/is/are verb ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "am/is/are comes before the verb."
  },
  {
    id: "G8_WO_008",
    difficulty: "easy",
    pattern: "AUX",
    targetChunks: ["She", "is", "playing", "outside", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "He/She/It ਨਾਲ is ਵਰਤਦੇ ਹਾਂ।",
    tipEn: "Use 'is' with he/she/it."
  },
  {
    id: "G8_WO_009",
    difficulty: "normal",
    pattern: "AUX",
    targetChunks: ["They", "are", "going", "to", "the", "park", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "They ਨਾਲ are ਆਉਂਦਾ ਹੈ।",
    tipEn: "With 'they', use 'are'."
  },
  {
    id: "G8_WO_010",
    difficulty: "normal",
    pattern: "AUX",
    targetChunks: ["We", "have", "finished", "the", "work", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "have/has verb ਦੇ past form ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "have/has comes before the past form."
  },
  {
    id: "G8_WO_011",
    difficulty: "hard",
    pattern: "AUX",
    targetChunks: ["He", "has", "already", "eaten", "lunch", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "already ਆਮ ਤੌਰ 'ਤੇ has/have ਤੋਂ ਬਾਅਦ ਆਉਂਦਾ ਹੈ।",
    tipEn: "'already' often goes after has/have."
  },
  {
    id: "G8_WO_012",
    difficulty: "hard",
    pattern: "AUX",
    targetChunks: ["I", "will", "be", "waiting", "here", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "will + be + verb-ing = future continuous।",
    tipEn: "will + be + verb-ing = future continuous."
  },

  // --- NEG (6+) ---
  {
    id: "G8_WO_013",
    difficulty: "easy",
    pattern: "NEG",
    targetChunks: ["I", "do", "not", "like", "milk", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "do not verb ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "'do not' comes before the verb."
  },
  {
    id: "G8_WO_014",
    difficulty: "easy",
    pattern: "NEG",
    targetChunks: ["She", "does", "not", "want", "candy", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "He/She/It ਨਾਲ does not ਵਰਤਦੇ ਹਾਂ।",
    tipEn: "Use 'does not' with he/she/it."
  },
  {
    id: "G8_WO_015",
    difficulty: "normal",
    pattern: "NEG",
    targetChunks: ["We", "cannot", "go", "today", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "cannot ਇੱਕ ਹੀ ਸ਼ਬਦ ਹੈ।",
    tipEn: "'cannot' is one word."
  },
  {
    id: "G8_WO_016",
    difficulty: "normal",
    pattern: "NEG",
    targetChunks: ["They", "are", "not", "ready", "yet", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "are not = subject + are + not.",
    tipEn: "are not = subject + are + not."
  },
  {
    id: "G8_WO_017",
    difficulty: "hard",
    pattern: "NEG",
    targetChunks: ["He", "did", "not", "finish", "his", "homework", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "did not ਤੋਂ ਬਾਅਦ verb ਦਾ base form ਆਉਂਦਾ ਹੈ।",
    tipEn: "After 'did not', use the base verb."
  },
  {
    id: "G8_WO_018",
    difficulty: "hard",
    pattern: "NEG",
    targetChunks: ["I", "have", "not", "seen", "that", "movie", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "have not = have + not + past form.",
    tipEn: "have not = have + not + past form."
  },

  // --- QUESTION (6+) ---
  {
    id: "G8_WO_019",
    difficulty: "easy",
    pattern: "QUESTION",
    targetChunks: ["Do", "you", "like", "apples", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Question ਵਿੱਚ do ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "In questions, 'do' comes first."
  },
  {
    id: "G8_WO_020",
    difficulty: "easy",
    pattern: "QUESTION",
    targetChunks: ["Does", "she", "play", "today", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Does ਨਾਲ verb base form ਰਹਿੰਦਾ ਹੈ।",
    tipEn: "After 'does', keep the verb base form."
  },
  {
    id: "G8_WO_021",
    difficulty: "normal",
    pattern: "QUESTION",
    targetChunks: ["Are", "they", "coming", "now", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "are/is/am question ਵਿੱਚ ਅੱਗੇ ਆ ਜਾਂਦਾ ਹੈ।",
    tipEn: "am/is/are moves to the front in questions."
  },
  {
    id: "G8_WO_022",
    difficulty: "normal",
    pattern: "QUESTION",
    targetChunks: ["Did", "you", "see", "it", "yesterday", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Did ਤੋਂ ਬਾਅਦ base verb ਆਉਂਦਾ ਹੈ।",
    tipEn: "After 'did', use the base verb."
  },
  {
    id: "G8_WO_023",
    difficulty: "hard",
    pattern: "QUESTION",
    targetChunks: ["Where", "are", "you", "going", "after", "school", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Wh- word ਪਹਿਲਾਂ, ਫਿਰ are/is/am.",
    tipEn: "Wh-word first, then am/is/are."
  },
  {
    id: "G8_WO_024",
    difficulty: "hard",
    pattern: "QUESTION",
    targetChunks: ["Why", "did", "he", "leave", "so", "early", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Why + did + subject + base verb.",
    tipEn: "Why + did + subject + base verb."
  },
  {
    id: "G8_WO_025",
    difficulty: "normal",
    pattern: "TIME",
    targetChunks: ["Before dinner", ",", "we", "finish", "our", "homework", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "TIME phrase ਤੋਂ ਬਾਅਦ comma, ਫਿਰ subject + verb ਆਉਂਦਾ ਹੈ।",
    tipEn: "After a time phrase, use a comma, then subject + verb."
  },
  {
    id: "G8_WO_026",
    difficulty: "normal",
    pattern: "TIME",
    targetChunks: ["At night", ",", "she", "reads", "quietly", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "At night ਵਰਗਾ time phrase ਪਹਿਲਾਂ ਲਿਆ ਸਕਦੇ ਹੋ।",
    tipEn: "A time phrase like 'At night' can come first."
  },
  {
    id: "G8_WO_027",
    difficulty: "normal",
    pattern: "AUX",
    targetChunks: ["He", "is", "writing", "a", "letter", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "present continuous ਵਿੱਚ is + verb-ing ਆਉਂਦਾ ਹੈ।",
    tipEn: "In present continuous, use is + verb-ing."
  },
  {
    id: "G8_WO_028",
    difficulty: "normal",
    pattern: "AUX",
    targetChunks: ["They", "have", "already", "started", "the", "game", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "have ਤੋਂ ਬਾਅਦ already ਅਤੇ ਫਿਰ past participle ਆ ਸਕਦਾ ਹੈ।",
    tipEn: "After have, 'already' can come before the past participle."
  },
  {
    id: "G8_WO_029",
    difficulty: "normal",
    pattern: "NEG",
    targetChunks: ["She", "is", "not", "at", "home", "today", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "be verb ਨਾਲ not ਸਿੱਧਾ ਉਸ ਤੋਂ ਬਾਅਦ ਆਉਂਦਾ ਹੈ।",
    tipEn: "With be-verbs, 'not' comes directly after the verb."
  },
  {
    id: "G8_WO_030",
    difficulty: "normal",
    pattern: "NEG",
    targetChunks: ["We", "do", "not", "watch", "TV", "on", "weekdays", "."],
    acceptableTargets: null,
    distractors: [],
    tipPa: "do not ਤੋਂ ਬਾਅਦ main verb ਦਾ base form ਵਰਤੋ।",
    tipEn: "After do not, use the base form of the main verb."
  },
  {
    id: "G8_WO_031",
    difficulty: "normal",
    pattern: "QUESTION",
    targetChunks: ["Can", "you", "help", "me", "with", "this", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Modal verb (can) question ਵਿੱਚ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।",
    tipEn: "In questions, the modal verb (can) comes first."
  },
  {
    id: "G8_WO_032",
    difficulty: "normal",
    pattern: "QUESTION",
    targetChunks: ["What", "are", "they", "doing", "there", "?"],
    acceptableTargets: null,
    distractors: [],
    tipPa: "Wh-word + be verb + subject ਆਰਡਰ ਫਾਲੋ ਕਰੋ।",
    tipEn: "Follow Wh-word + be-verb + subject order."
  }
];

/*
QA / MANUAL TEST CHECKLIST
- Normal mode: each game reaches Round Complete (no last-question loop)
- Punjabi help always on: Punjabi lines render consistently; no blank Punjabi lines
- Missing Punjabi strings: English-only fallback; never empty UI
- Wrong once: shows hint/cue; can try again
- Wrong twice: shows correct answer + explanation and applies Help:
  - tapWord highlights correct token
  - other games disable/gray 1–2 distractors
- Double-click/rapid tap: XP awards at most once per question
- Difficulty cycles and changes option count/pool selection
*/

// CHANGELOG vNext:
// - Adds normalized-question round engine with explicit Next flow
// - Adds in-place Round Complete panel
// - Adds kid-friendly Goal/Example lines and improved feedback microcopy
// - Adds attempts-based hint/help and near-miss tips
// - Adds difficulty cycling (persisted) and hooks for session resume

var Games = {
  // Legacy fields (kept for compatibility / existing tests)
  currentGameType: null,
  currentGameQuestionIndex: 0,
  currentGameScore: 0,
  currentGameStreak: 0,
  currentGameBest: 0,
  currentCustomQuiz: null,

  // ===== Play Home (Game Home Menu) state =====
  playHome: {
    selectedGameNum: null,
    selectedDifficulty: null
  },

  // ===== Runtime (single source of truth for active round) =====
  runtime: {
    round: null,
    submitted: false,
    // UI safety: used to prevent double-submit / rapid taps (Game 5 scope)
    inputLocked: false,
    _answeredQid: null,
    attemptsByQid: {},
    missesByQid: {},
    correctTags: {},
    correctCount: 0,
    totalCount: 0,
    mode: "normal",
    onDone: null,
    seed: null,

    // UI/runtime-only caches (per round)
    _lastRenderedQid: null,
    _optionSetCache: {},
    _posHintWhyStateByQid: {},

    // Game 5 (convoReply): ensures Why auto-opens at most once per question.
    _g5WhyAutoOpenedByQid: {},

    // Game 11: Maze Trace runtime (set/maze + quiz phases)
    maze11: null
  },

  // ===== How-to (first launch overlay) =====
  _howtoOverlayEl: null,

  _profileScopedLsKey: function(baseKey) {
    var base = String(baseKey || "").replace(/^\s+|\s+$/g, "");
    if (!base) return "";
    try {
      if (window.State && typeof State._getProfileScopedStorageKey === "function") {
        return State._getProfileScopedStorageKey(base);
      }
    } catch (e0) {}
    return base + "_p1";
  },

  _howtoSeenKeyForGameNum: function(gameNum) {
    return Games._profileScopedLsKey("bolo_howto_seen_game_" + String(gameNum | 0));
  },

  _woTutorialKey: function() {
    return Games._profileScopedLsKey("bolo_wo_tutorial_v1");
  },

  _parseGameNumFromKey: function(gameKey) {
    // startGame uses "game" + N (e.g., game6)
    var s = String(gameKey || "");
    if (!s) return null;
    if (s.indexOf("game") !== 0) return null;
    var n = parseInt(s.slice(4), 10);
    if (!isFinite(n)) return null;
    return n;
  },

  _getHowtoBulletsForGame: function(gameNum, gameType) {
    if (gameNum === 1 || gameType === "tapWord") {
      return ["Tap the correct word.", "Move fast for streak."];
    }
    if (gameNum === 2 || gameType === "pos") {
      return ["Pick the correct part of speech."];
    }
    if (gameNum === 3 || gameType === "tense") {
      return ["Pick the correct tense."];
    }
    if (gameNum === 4 || gameType === "sentenceCheck") {
      return ["Choose the correct sentence."];
    }
    if (gameNum === 5 || gameType === "convoReply") {
      return ["Pick the best reply."];
    }
    if (gameNum === 6 || gameType === "vocabTranslation") {
      return ["Choose the correct English meaning."];
    }
    return ["Start the round."];
  },

  _setRoundHeaderUi: function(r, q) {
    if (!r || !q) return;
    var howtoEl = document.getElementById("play-howto-line");
    var counterEl = document.getElementById("play-progress-counter");
    var fillEl = document.getElementById("play-progress-bar-fill");

    // P0 v2: unified status bar hooks
    var titleElV2 = document.getElementById("play-status-title");
    var tagElV2 = document.getElementById("play-status-tag");
    var progElV2 = document.getElementById("play-status-progress-text");
    var settingsBtn = document.getElementById("btn-play-settings");

    var total = (Array.isArray(r.questions) ? r.questions.length : 0) | 0;
    var idx = ((typeof r.idx === "number" ? r.idx : 0) | 0) + 1;

    // P0 v2: status title + optional tag chip
    try {
      if (titleElV2) {
        var labelEl = document.getElementById("play-game-label");
        var labelText = labelEl ? String(labelEl.textContent || "").trim() : "";
        titleElV2.textContent = labelText || "Game";
      }
    } catch (eT0) {}

    try {
      if (tagElV2) {
        // Prompt 10: show a focused Practice chip during tagPractice.
        var ctx = (Games.runtime && Games.runtime.currentSession) ? Games.runtime.currentSession : null;
        var isTagPractice = !!(ctx && String(ctx.mode || "") === "tagPractice" && ctx.tagPractice && ctx.tagPractice.tag);

        if (isTagPractice) {
          var pretty = (Games._prettyTagNameV2 ? Games._prettyTagNameV2(ctx.tagPractice.tag) : String(ctx.tagPractice.tag));
          tagElV2.textContent = "Practice: " + String(pretty || ctx.tagPractice.tag);
          tagElV2.style.display = "inline-flex";
          tagElV2.setAttribute("aria-hidden", "false");

          // Settings is non-functional; hide during focused practice.
          if (settingsBtn) settingsBtn.style.display = "none";
        } else {
          if (settingsBtn) settingsBtn.style.display = "inline-flex";

          var tag = (Array.isArray(q.tags) && q.tags.length) ? String(q.tags[0] || "").trim() : "";
          // Hide generic tags that don't help the child.
          var hide = (!tag) || (tag === "TAPWORD") || (tag === "SENTENCE:CHECK");
          if (hide) {
            tagElV2.textContent = "";
            tagElV2.style.display = "none";
            tagElV2.setAttribute("aria-hidden", "true");
          } else {
            tagElV2.textContent = tag;
            tagElV2.style.display = "inline-flex";
            tagElV2.setAttribute("aria-hidden", "false");
          }
        }
      }
    } catch (eTag0) {}

    // P0 v2: progress text as x/20 (or x/10) based on session segment.
    try {
      if (progElV2) {
        var segment = total;
        if (Games.runtime && Games.runtime.unlimitedMode) {
          segment = (Games.runtime.checkpointEvery | 0) || (Games.runtime.batchSize | 0) || 20;
          if (segment <= 0) segment = 20;
          // If total is smaller than the segment (short rounds), respect the true total.
          if (total > 0 && total < segment) segment = total;
        }
        var showIdx = idx;
        if (segment > 0 && Games.runtime && Games.runtime.unlimitedMode) {
          showIdx = ((r.idx | 0) % segment) + 1;
        }
        progElV2.textContent = (segment > 0) ? (String(showIdx) + "/" + String(segment)) : "";
      }
    } catch (eP0) {}

    if (counterEl) {
      if (total > 0) {
        var punjabiOn = Games.isPunjabiOn();
        var en = "Question " + String(idx) + " of " + String(total);
        var pa = "ਸਵਾਲ " + String(idx) + " / " + String(total);

        // Game 6: add an explicit round streak meter line (round-only).
        var gameNum = Games._parseGameNumFromKey(r.gameId);
        if ((r.mode === "normal") && gameNum === 6 && q.gameType === "vocabTranslation") {
          var st = (Games.currentGameStreak | 0) || 0;
          en += " • Streak: " + String(st);
          pa += " • Streak: " + String(st);
        }

        counterEl.textContent = punjabiOn ? (en + " / " + pa) : en;
      } else {
        counterEl.textContent = "";
      }
    }

    if (fillEl) {
      var pct = 0;

      // Progress bar should not feel "ahead" before the user answers.
      // Use Next-enabled state as a conservative signal that the current question is completed.
      var answered = false;
      try {
        var nextBtn = document.getElementById("btn-play-next");
        answered = !!(nextBtn && !nextBtn.disabled);
      } catch (e) {}

      var doneIdx = answered ? idx : (idx - 1);
      if (doneIdx < 0) doneIdx = 0;
      if (doneIdx > total) doneIdx = total;
      if (total > 0) pct = Math.max(0, Math.min(100, Math.round((doneIdx / total) * 100)));
      fillEl.style.width = String(pct) + "%";
    }

    if (howtoEl) {
      var gameNum = Games._parseGameNumFromKey(r.gameId);
      var showHowto = false;
      var howtoText = "";

      // Requirement: show only for this game, sourced from metadata (not hardcoded here).
      if (gameNum === 7) {
        var entry = Games._getPlayHomeEntry(7);
        howtoText = entry && entry.objectiveText ? String(entry.objectiveText || "").trim() : "";
        showHowto = !!howtoText;
      }

      if (showHowto) {
        howtoEl.textContent = "How to win: " + howtoText;
        howtoEl.style.display = "";
        howtoEl.setAttribute("aria-hidden", "false");
      } else {
        howtoEl.style.display = "none";
        howtoEl.setAttribute("aria-hidden", "true");
      }
    }
  },

  // Progress UI wrapper (requested by implementation spec).
  // Uses existing header hook logic and relies on #play-progress-counter + #play-progress-bar-fill.
  updateProgressUI: function() {
    var r = Games.runtime.round;
    if (!r || r.completed) return;
    var q = (r.questions && r.questions[r.idx]) ? r.questions[r.idx] : null;
    if (!q) return;
    Games._setRoundHeaderUi(r, q);
  },

  _pickTipForQuestion: function(q, chosenText, correctText) {
    if (!q) return { en: "", pa: "" };

    // Prefer authored tip/hint first.
    var en = String(q.hintEn || "").trim();
    var pa = String(q.hintPa || "").trim();

    if (!en && !pa) {
      var m = Games.MICROCOPY[q.gameType] || {};
      var near = Games.getNearMissTip(q, chosenText || "", correctText || "");
      en = String((near.en || m.wrongCueEn || "Look carefully and try again.") || "").trim();
      pa = String((near.pa || m.wrongCuePa || "ਧਿਆਨ ਨਾਲ ਵੇਖੋ ਅਤੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।") || "").trim();
    }

    // If Punjabi is missing, fall back to English to avoid blank UI in Punjabi mode.
    if (!pa) pa = en;
    return { en: en, pa: pa };
  },

  _pickWhyNoRevealForWrong: function(q, chosenText) {
    if (!q) return { en: "", pa: "" };
    var en = "That choice doesn't fit this question.";
    var pa = "ਇਹ ਚੋਣ ਇਸ ਸਵਾਲ ਲਈ ਠੀਕ ਨਹੀਂ ਹੈ।";

    if (q.gameType === "tapWord") {
      en = "That isn't the best word to tap.";
      pa = "ਇਹ ਟੈਪ ਕਰਨ ਲਈ ਸਭ ਤੋਂ ਸਹੀ ਸ਼ਬਦ ਨਹੀਂ ਹੈ।";
    } else if (q.gameType === "vocabTranslation") {
      en = "That meaning doesn't match the word.";
      pa = "ਇਹ ਅਰਥ ਸ਼ਬਦ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ।";
    } else if (q.gameType === "sentenceCheck") {
      en = "This sentence still has a grammar issue.";
      pa = "ਇਸ ਵਾਕ ਵਿੱਚ ਹਾਲੇ ਵੀ grammar ਦੀ ਗਲਤੀ ਹੈ।";
    } else if (q.gameType === "convoReply") {
      en = "That reply isn't the best match.";
      pa = "ਇਹ ਜਵਾਬ ਸਭ ਤੋਂ ਚੰਗਾ ਨਹੀਂ ਹੈ।";
    } else if (q.gameType === "pos") {
      en = "That word type doesn't match how the word is used.";
      pa = "ਇਹ ਸ਼ਬਦ ਦੀ ਕਿਸਮ ਇਸਦੀ ਵਰਤੋਂ ਨਾਲ ਨਹੀਂ ਮਿਲਦੀ।";
    }

    // Ensure Punjabi isn't blank.
    if (!pa) pa = en;
    return { en: en, pa: pa };
  },

  _removeHowtoOverlay: function() {
    try {
      if (Games._howtoOverlayEl && Games._howtoOverlayEl.parentNode) {
        Games._howtoOverlayEl.parentNode.removeChild(Games._howtoOverlayEl);
      }
    } catch (e) {}
    Games._howtoOverlayEl = null;
  },

  _showHowtoOverlayForGame: function(gameNum, gameType, onStart) {
    // Safety: ensure only one overlay exists
    Games._removeHowtoOverlay();

    var bullets = Games._getHowtoBulletsForGame(gameNum, gameType);
    var prevActive = null;
    try { prevActive = document.activeElement; } catch (e) {}

    var overlay = document.createElement("div");
    overlay.className = "howto-overlay";

    var backdrop = document.createElement("div");
    backdrop.className = "howto-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    var card = document.createElement("div");
    card.className = "howto-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "How to play");
    card.setAttribute("tabindex", "-1");

    var title = document.createElement("div");
    title.className = "section-title";
    title.textContent = "How to play";
    card.appendChild(title);

    var ul = document.createElement("ul");
    ul.style.margin = "6px 0 10px 18px";
    ul.style.color = "var(--text)";
    ul.style.fontSize = "13px";
    for (var i = 0; i < bullets.length; i++) {
      var li = document.createElement("li");
      li.textContent = String(bullets[i]);
      ul.appendChild(li);
    }
    card.appendChild(ul);

    var dontWrap = document.createElement("label");
    dontWrap.style.display = "flex";
    dontWrap.style.alignItems = "center";
    dontWrap.style.gap = "8px";
    dontWrap.style.fontSize = "13px";
    dontWrap.style.color = "var(--muted)";

    var dontCb = document.createElement("input");
    dontCb.type = "checkbox";
    dontCb.id = "howto-dont-show";
    dontWrap.appendChild(dontCb);

    var dontText = document.createElement("span");
    dontText.textContent = "Don\u2019t show again";
    dontWrap.appendChild(dontText);
    card.appendChild(dontWrap);

    var actions = document.createElement("div");
    actions.className = "howto-actions";

    var startBtn = document.createElement("button");
    startBtn.type = "button";
    startBtn.className = "btn btn-primary";
    startBtn.textContent = "Start";
    actions.appendChild(startBtn);
    card.appendChild(actions);

    overlay.appendChild(backdrop);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    Games._howtoOverlayEl = overlay;

    function cleanupAndStart(shouldPersist) {
      if (shouldPersist) {
        try {
          localStorage.setItem(Games._howtoSeenKeyForGameNum(gameNum), "1");
        } catch (e) {}
      }
      Games._removeHowtoOverlay();
      try { if (prevActive && typeof prevActive.focus === "function") prevActive.focus(); } catch (e2) {}
      if (typeof onStart === "function") onStart();
    }

    startBtn.addEventListener("click", function() {
      cleanupAndStart(!!dontCb.checked);
    });

    // Minimal focus trap + Escape
    function getFocusables() {
      try {
        return card.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      } catch (e) {
        return [];
      }
    }

    overlay.addEventListener("keydown", function(ev) {
      var e = ev || window.event;
      var key = e && (e.key || e.keyCode);
      if (key === "Escape" || key === "Esc" || key === 27) {
        try { e.preventDefault(); } catch (e3) {}
        // Escape closes and proceeds (does NOT persist)
        cleanupAndStart(false);
        return;
      }

      if (key === "Tab" || key === 9) {
        var focusables = getFocusables();
        if (!focusables || !focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        var active = null;
        try { active = document.activeElement; } catch (e4) {}

        var shift = !!(e && e.shiftKey);
        if (shift && active === first) {
          try { e.preventDefault(); } catch (e5) {}
          try { last.focus(); } catch (e6) {}
        } else if (!shift && active === last) {
          try { e.preventDefault(); } catch (e7) {}
          try { first.focus(); } catch (e8) {}
        }
      }
    });

    // Initial focus
    try { startBtn.focus(); } catch (e9) {}
  },

  // ===== Feedback + Microcopy =====
  GAME3_UI: {
    howtoEn: "How to play: Choose the tense (Present / Past / Future).",
    howtoPa: "ਖੇਡਣ ਦਾ ਤਰੀਕਾ: ਵਾਕ ਦਾ ਕਾਲ ਚੁਣੋ (ਵਰਤਮਾਨ / ਭੂਤ / ਭਵਿੱਖ)।",
    progressEn: function(i, total) { return "Question " + String(i) + " of " + String(total); },
    progressPa: function(i, total) { return "ਸਵਾਲ " + String(i) + " / " + String(total); },
    wrongCompareEn: function(chosen, correct) { return "You chose " + String(chosen) + " / Correct is " + String(correct); },
    wrongComparePa: function(chosen, correct) { return "ਤੁਸੀਂ ਚੁਣਿਆ " + String(chosen) + " / ਸਹੀ ਜਵਾਬ " + String(correct); }
  },
  MICROCOPY: {
    tapWord: {
      goalEn: "Goal: Tap the action/target word.",
      goalPa: "ਮਕਸਦ: ਸਹੀ ਸ਼ਬਦ 'ਤੇ ਟੈਪ ਕਰੋ।",
      exampleEn: "Example: runs",
      examplePa: "ਉਦਾਹਰਨ: runs",
      wrongCueEn: "Look for the action word.",
      wrongCuePa: "ਕਿਰਿਆ ਵਾਲਾ ਸ਼ਬਦ ਲੱਭੋ।"
    },
    pos: {
      goalEn: "Goal: Pick the word type.",
      goalPa: "ਮਕਸਦ: ਸ਼ਬਦ ਦੀ ਕਿਸਮ ਚੁਣੋ।",
      exampleEn: "Example: dog → noun",
      examplePa: "ਉਦਾਹਰਨ: dog → noun",
      wrongCueEn: "Think: person/place/thing? (noun)",
      wrongCuePa: "ਸੋਚੋ: ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼? (noun)"
    },
    tense: {
      goalEn: "Goal: Pick the time.",
      goalPa: "ਮਕਸਦ: ਸਮਾਂ ਚੁਣੋ।",
      exampleEn: "Example: walked → past",
      examplePa: "ਉਦਾਹਰਨ: walked → past",
      wrongCueEn: "Find time words: yesterday / will / every day.",
      wrongCuePa: "ਸਮੇਂ ਵਾਲੇ ਸ਼ਬਦ ਲੱਭੋ: yesterday / will / every day"
    },
    sentenceCheck: {
      goalEn: "Goal: Pick the best sentence.",
      goalPa: "ਮਕਸਦ: ਸਭ ਤੋਂ ਸਹੀ ਵਾਕ ਚੁਣੋ।",
      exampleEn: "Example: He goes…",
      examplePa: "ਉਦਾਹਰਨ: He goes…",
      wrongCueEn: "Check the verb with the subject.",
      wrongCuePa: "ਕਰਤਾ ਦੇ ਨਾਲ ਕਿਰਿਆ ਮਿਲਾਓ।"
    },
    convoReply: {
      goalEn: "Goal: Choose the best reply.",
      goalPa: "ਮਕਸਦ: ਸਭ ਤੋਂ ਚੰਗਾ ਜਵਾਬ ਚੁਣੋ।",
      exampleEn: "Example: Sorry → That’s okay.",
      examplePa: "ਉਦਾਹਰਨ: ਮਾਫ਼ ਕਰਨਾ → ਕੋਈ ਗੱਲ ਨਹੀਂ।",
      wrongCueEn: "Pick the reply that is kind, clear, and polite.",
      wrongCuePa: "ਦਇਆਲੂ, ਸਪੱਸ਼ਟ ਅਤੇ ਸ਼ਿਸ਼ਟ ਜਵਾਬ ਚੁਣੋ।"
    },
    vocabTranslation: {
      goalEn: "Goal: Pick the correct translation.",
      goalPa: "ਮਕਸਦ: ਸਹੀ ਅਨੁਵਾਦ ਚੁਣੋ।",
      exampleEn: "Example: ਬਿੱਲੀ → cat",
      examplePa: "ਉਦਾਹਰਨ: ਬਿੱਲੀ → cat",
      wrongCueEn: "Look at the word carefully. Think about what it means.",
      wrongCuePa: "ਸ਼ਬਦ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਇਸਦੇ ਅਰਥ ਬਾਰੇ ਸੋਚੋ।"
    }
  },

  // Generic fallback microcopy (used when question lacks authored hint/explanation)
  GENERIC_FEEDBACK: {
    tapWord: {
      hintEn: "Try again. Look for the action word (the verb).",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਕਿਰਿਆ ਵਾਲਾ ਸ਼ਬਦ (verb) ਲੱਭੋ।",
      explanationEn: "The correct answer is the verb—the word that shows the action.",
      explanationPa: "ਸਹੀ ਜਵਾਬ verb ਹੈ—ਜੋ ਸ਼ਬਦ ਕੰਮ/ਕਿਰਿਆ ਦੱਸਦਾ ਹੈ।"
    },
    pos: {
      hintEn: "Try again. Ask: is it a person/place/thing (noun) or an action (verb)?",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸੋਚੋ: ਵਿਅਕਤੀ/ਥਾਂ/ਚੀਜ਼ (noun) ਜਾਂ ਕੰਮ (verb)?",
      explanationEn: "Choose the word type based on how the word is used.",
      explanationPa: "ਸ਼ਬਦ ਦੀ ਕਿਸਮ ਉਸਦੀ ਵਰਤੋਂ ਦੇ ਅਧਾਰ ’ਤੇ ਚੁਣੀਦੀ ਹੈ।"
    },
    tense: {
      hintEn: "Try again. Look for time clues like yesterday, now, will, tomorrow.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸਮੇਂ ਦੇ ਇਸ਼ਾਰੇ ਲੱਭੋ: yesterday, now, will, tomorrow।",
      explanationEn: "Tense tells when the action happens: past, present, or future.",
      explanationPa: "Tense ਦੱਸਦਾ ਹੈ ਕਿ ਕੰਮ ਕਦੋਂ ਹੁੰਦਾ ਹੈ: past, present ਜਾਂ future।"
    },
    sentenceCheck: {
      hintEn: "Try again. Pick the sentence that sounds correct.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਜੋ ਵਾਕ ਸਹੀ ਲੱਗਦਾ ਹੈ ਉਹ ਚੁਣੋ।",
      explanationEn: "Pick the sentence with correct grammar (often subject–verb agreement).",
      explanationPa: "ਉਹ ਵਾਕ ਚੁਣੋ ਜਿਸਦੀ grammar ਸਹੀ ਹੋਵੇ (ਅਕਸਰ subject–verb ਮਿਲਾਪ)।"
    },
    convoReply: {
      hintEn: "Try again. Pick the most polite and helpful reply.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸਭ ਤੋਂ ਸ਼ਿਸ਼ਟ ਅਤੇ ਮਦਦਗਾਰ ਜਵਾਬ ਚੁਣੋ।",
      explanationEn: "A good reply is kind, clear, and respectful.",
      explanationPa: "ਚੰਗਾ ਜਵਾਬ ਦਇਆਲੂ, ਸਪੱਸ਼ਟ ਅਤੇ ਆਦਰ ਵਾਲਾ ਹੁੰਦਾ ਹੈ।"
    },
    vocabTranslation: {
      hintEn: "Try again. Look at the word carefully.",
      hintPa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਸ਼ਬਦ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ।",
      explanationEn: "Think about what the word means in English or Punjabi.",
      explanationPa: "ਸੋਚੋ ਕਿ ਸ਼ਬਦ ਦਾ ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਕੀ ਮਤਲਬ ਹੈ।"
    }
  },

  // ===== Init + UI wiring =====
  init: function() {
    function onClick(id, fn) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("click", fn);
    }

    // --- Play Home (new) ---
    onClick("btn-playhome-game1", function() { Games.selectPlayHomeGame(1); });
    onClick("btn-playhome-game2", function() { Games.selectPlayHomeGame(2); });
    onClick("btn-playhome-game3", function() { Games.selectPlayHomeGame(3); });
    onClick("btn-playhome-game4", function() { Games.selectPlayHomeGame(4); });
    onClick("btn-playhome-game5", function() { Games.selectPlayHomeGame(5); });
    onClick("btn-playhome-game6", function() { Games.selectPlayHomeGame(6); });
    onClick("btn-playhome-game8", function() { Games.selectPlayHomeGame(8); });
    onClick("btn-playhome-game10", function() { Games.selectPlayHomeGame(10); });
    onClick("btn-playhome-game11", function() { Games.selectPlayHomeGame(11); });

    onClick("btn-playhome-diff-1", function() { Games.setPlayHomeDifficulty(1); });
    onClick("btn-playhome-diff-2", function() { Games.setPlayHomeDifficulty(2); });
    onClick("btn-playhome-diff-3", function() { Games.setPlayHomeDifficulty(3); });
    onClick("btn-playhome-start", function() { Games.startSelectedFromPlayHome(); });

    onClick("btn-how-to-play", function() { UI.openModal("modal-howto"); });
    onClick("btn-play-next", function() { Games.next(); });

    onClick("btn-play-again", function() { Games.playAgain(); });
    onClick("btn-play-back-menu", function() { Games.backToPlayMenu(); });

    // Round back buttons should return to Play Home (menu)
    onClick("btn-play-back-games", function() { Games.backToPlayMenu(); });
    onClick("btnChooseAnotherGame", function() { Games.backToPlayMenu(); });

    // P0 V2 data integrity: migrate caches on version change and (in dev)
    // validate & quarantine invalid bank items before selection.
    try { Games._initDataIntegrityV2(); } catch (eDI) {}

    // --- Game Picker Toggle Logic ---
    var toggleBtn = document.getElementById("btnToggleGamePicker");
    var pickerPanel = document.getElementById("gamePickerPanel");
    if (toggleBtn && pickerPanel) {
      toggleBtn.addEventListener("click", function() {
        var isOpen = !pickerPanel.classList.contains("is-hidden");
        if (isOpen) {
          pickerPanel.classList.add("is-hidden");
          pickerPanel.setAttribute("aria-hidden", "true");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.textContent = "Show games";
        } else {
          pickerPanel.classList.remove("is-hidden");
          pickerPanel.setAttribute("aria-hidden", "false");
          toggleBtn.setAttribute("aria-expanded", "true");
          toggleBtn.textContent = "Hide games";
        }
      });
      // Set initial state
      pickerPanel.classList.add("is-hidden");
      pickerPanel.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "Show games";
    }

    // Render Play Home defaults (safe if the screen isn't present)
    Games.renderPlayHome();
  },

  // ===== Play Home (Game Home Menu) =====
  _handleComingSoonTileClick: function(e, gameNum) {
    try {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    } catch (e2) {}

    // Required copy (keep exact)
    var msg = "Coming soon — try Vocab Vault (Game 6) for now.";
    try {
      if (window.UI && typeof UI.showToast === "function") {
        UI.showToast(msg, 2500);
        return;
      }
    } catch (e3) {}

    // Fallback: use the existing toast host directly
    try {
      var host = document.getElementById("toastHost");
      if (!host) return;
      host.textContent = msg;
      host.classList.add("is-visible");
      setTimeout(function() {
        try { host.classList.remove("is-visible"); } catch (e4) {}
      }, 2500);
    } catch (e5) {}
  },

  getPlayHomeRegistry: function() {
    return [
      {
        num: 1,
        id: "GAME1",
        enabled: true,
        title: "Tap the Word",
        description: "quick",
        goalEn: "Tap the action/target word.",
        trackTags: ["Words", "Actions"],
        instructions: [
          "Read the sentence.",
          "Tap the best word.",
          "If you miss, you’ll get a hint."
        ]
      },
      {
        num: 2,
        id: "GAME2",
        enabled: true,
        title: "Parts of Speech",
        description: "multiple choice",
        goalEn: "Pick the word type.",
        trackTags: ["Words", "Word Types"],
        instructions: [
          "Look at the word.",
          "Choose the correct type.",
          "Try again if you miss."
        ]
      },
      {
        num: 3,
        id: "GAME3",
        enabled: true,
        title: "Tense Detective",
        description: "multiple choice",
        goalEn: "Pick the time (past/present/future).",
        trackTags: ["Actions", "Time"],
        instructions: [
          "Read the sentence.",
          "Find time clues.",
          "Choose the tense."
        ]
      },
      {
        num: 4,
        id: "GAME4",
        enabled: true,
        title: "Sentence Check",
        description: "pick the best sentence",
        goalEn: "Pick the best sentence.",
        trackTags: ["Sentences", "Grammar"],
        instructions: [
          "Read both sentences.",
          "Pick the one that sounds correct.",
          "Watch subject–verb agreement."
        ]
      },
      {
        num: 5,
        id: "GAME5",
        enabled: true,
        title: "Conversation Coach",
        description: "best reply",
        goalEn: "Choose the best reply.",
        trackTags: ["Conversation", "Polite replies"],
        instructions: [
          "Read the message.",
          "Choose the best reply.",
          "If you miss, you’ll get a hint and can try again."
        ]
      },
      {
        num: 6,
        id: "GAME6",
        enabled: true,
        title: "Vocab Vault",
        description: "translation",
        goalEn: "Pick the correct translation.",
        trackTags: ["Vocabulary", "Translation"],
        instructions: [
          "Look at the word.",
          "Pick the correct translation.",
          "If you miss, you'll get a hint and can try again."
        ]
      },
      {
        num: 8,
        id: "GAME8",
        enabled: true,
        comingSoon: false,
        title: "Word Order Surgery",
        description: "swap chunks",
        goalEn: "Put the chunks in the correct order.",
        trackTags: ["Sentences", "Word Order"],
        instructions: [
          "Tap two chunks to swap them.",
          "Build the correct sentence from left to right.",
          "Use Hint/Undo/Reset if you get stuck."
        ]
      },
      {
        num: 10,
        id: "GAME10",
        enabled: true,
        comingSoon: false,
        title: "Beam Training",
        description: "Hold the beam under pressure",
        goalEn: "Fast grammar battles",
        trackTags: ["Speed", "Accuracy"],
        instructions: [
          "Press Correct/Wrong to test the engine.",
          "Hold stability while pushing the beam.",
          "Packs coming next."
        ]
      },
      {
        num: 11,
        id: "GAME11",
        enabled: true,
        comingSoon: false,
        title: "Maze Trace",
        description: "drag + quiz",
        goalEn: "Trace through mazes before energy runs out.",
        trackTags: ["Focus", "Speed", "Basics"],
        instructions: [
          "Press and hold from Start, then drag to Exit.",
          "Touching walls drains energy.",
          "After each maze, answer 1 question matched to difficulty.",
          "Wrong answer or zero energy restarts the set."
        ]
      },
      {
        num: 12,
        id: "GAME12",
        enabled: true,
        comingSoon: false,
        title: "AI Story Detective",
        description: "find + fix 3 mistakes",
        goalEn: "Find and fix the 3 hidden mistakes.",
        trackTags: ["Grammar", "Reading", "Attention"],
        instructions: [
          "Read the short story carefully.",
          "Tap the best fix for each hidden mistake.",
          "Solve all 3 to close the case."
        ]
      },
    ];
  },

  _getPlayHomeEntry: function(gameNum) {
    var list = Games.getPlayHomeRegistry();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].num === gameNum) return list[i];
    }
    return null;
  },

  _gameSupportsPlayHomeDifficulty: function(gameNum) {
    var n = gameNum | 0;
    return n === 1 || n === 2 || n === 6 || n === 11 || n === 12;
  },

  _setPlayHomeDifficultyVisibility: function(gameNum) {
    var setup = document.getElementById("playhome-setup");
    if (!setup) return;
    var wrap = setup.querySelector(".playhome-difficulty");
    if (!wrap) return;

    var show = Games._gameSupportsPlayHomeDifficulty(gameNum);
    wrap.style.display = show ? "" : "none";
    wrap.setAttribute("aria-hidden", show ? "false" : "true");
  },

  renderPlayHome: function() {
    // Safe no-op if screen isn't in DOM
    var setup = document.getElementById("playhome-setup");
    if (!setup) return;

    // Keep selected difficulty in sync with State's difficulty
    var d = Games.playHome.selectedDifficulty;
    if (!(d === 1 || d === 2 || d === 3)) {
      d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
      Games.playHome.selectedDifficulty = d;
    }
    Games._setPlayHomeDifficultyVisibility(Games.playHome.selectedGameNum || 0);
    Games._renderPlayHomeDifficultyButtons(d);

    var startBtn = document.getElementById("btn-playhome-start");
    if (startBtn) startBtn.disabled = !(Games.playHome.selectedGameNum && Games._getPlayHomeEntry(Games.playHome.selectedGameNum) && Games._getPlayHomeEntry(Games.playHome.selectedGameNum).enabled);
  },

  _renderPlayHomeDifficultyButtons: function(diff) {
    function setActive(id, active) {
      var el = document.getElementById(id);
      if (!el) return;
      if (active) el.classList.add("is-selected");
      else el.classList.remove("is-selected");
    }
    setActive("btn-playhome-diff-1", diff === 1);
    setActive("btn-playhome-diff-2", diff === 2);
    setActive("btn-playhome-diff-3", diff === 3);
  },

  setPlayHomeDifficulty: function(diff) {
    var gameNum = Games.playHome.selectedGameNum | 0;
    if (!Games._gameSupportsPlayHomeDifficulty(gameNum)) return;

    var d = Math.max(1, Math.min(3, diff | 0));
    Games.playHome.selectedDifficulty = d;
    if (State && State.setPlayDifficulty) State.setPlayDifficulty(d);
    Games._renderPlayHomeDifficultyButtons(d);
  },

  selectPlayHomeGame: function(gameNum) {
    var entry = Games._getPlayHomeEntry(gameNum);
    if (!entry || !entry.enabled) return;

    Games.playHome.selectedGameNum = gameNum;

    // Tile selection state
    var registry = Games.getPlayHomeRegistry();
    for (var i = 0; i < registry.length; i++) {
      var n = registry[i] && registry[i].num;
      var tile = document.getElementById("btn-playhome-game" + String(n));
      if (!tile) continue;
      if (n === gameNum) tile.classList.add("is-selected");
      else tile.classList.remove("is-selected");
    }

    // Setup panel
    var setup = document.getElementById("playhome-setup");
    if (setup) {
      setup.classList.remove("is-hidden");
      setup.setAttribute("aria-hidden", "false");
    }
    Games._setPlayHomeDifficultyVisibility(gameNum);

    var titleEl = document.getElementById("playhome-setup-title");
    if (titleEl) titleEl.textContent = entry.title;
    var goalEl = document.getElementById("playhome-setup-goal");
    if (goalEl) goalEl.textContent = "Goal: " + entry.goalEn;

    var chips = document.getElementById("playhome-practice-chips");
    if (chips) {
      chips.innerHTML = "";
      for (var c = 0; c < entry.trackTags.length; c++) {
        var chip = document.createElement("div");
        chip.className = "track-pill";
        chip.innerHTML = '<span class="dot"></span>' + String(entry.trackTags[c]);
        chips.appendChild(chip);
      }
    }

    var list = document.getElementById("playhome-instructions");
    if (list) {
      list.innerHTML = "";
      for (var j = 0; j < entry.instructions.length; j++) {
        var li = document.createElement("li");
        li.textContent = String(entry.instructions[j]);
        list.appendChild(li);
      }
    }

    var startBtn = document.getElementById("btn-playhome-start");
    if (startBtn) startBtn.disabled = false;
    Games.renderPlayHome();
  },

  startSelectedFromPlayHome: function() {
    var gameNum = Games.playHome.selectedGameNum;
    var entry = Games._getPlayHomeEntry(gameNum);
    if (!entry || !entry.enabled) return;

    var supportsDifficulty = Games._gameSupportsPlayHomeDifficulty(gameNum);
    var d = 2;
    if (supportsDifficulty) {
      d = Games.playHome.selectedDifficulty;
      if (!(d === 1 || d === 2 || d === 3)) d = (State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2;
      if (State && State.setPlayDifficulty) State.setPlayDifficulty(d);
    }

    Games.startGame(gameNum, { forcedDifficulty: d });
  },

  // ===== Helpers =====
  _setGame6AestheticMode: function(isOn) {
    var screen = document.getElementById("screen-play");
    if (!screen) return;
    if (isOn) screen.classList.add("is-game6");
    else screen.classList.remove("is-game6");
  },

  // Game 4 (Sentence Check) UI-only styling hook.
  // Why: keep tap/feedback polish safely scoped to this game only.
  _setGame4Mode: function(isOn) {
    var screen = document.getElementById("screen-play");
    if (!screen) return;
    if (isOn) screen.classList.add("is-game4");
    else screen.classList.remove("is-game4");

    var bar = document.getElementById("g4-status-bar");
    if (bar) {
      if (isOn) {
        bar.classList.remove("is-hidden");
        bar.setAttribute("aria-hidden", "false");
      } else {
        bar.classList.add("is-hidden");
        bar.setAttribute("aria-hidden", "true");
      }
    }

    // Explanation panel is enabled only after an answer; default hidden.
    var exp = document.getElementById("g4-explanation");
    if (exp && !isOn) {
      exp.classList.add("is-hidden");
      exp.setAttribute("aria-hidden", "true");
      try { exp.open = false; } catch (e0) {}
    }

    if (!isOn) {
      try { Games._unbindGame4Keys(); } catch (e1) {}
    }
  },

  _updateGame4StatusUi: function(r) {
    try {
      if (!r || !Array.isArray(r.questions)) return;
      var total = (r.questions.length | 0) || 0;
      var idx = ((typeof r.idx === "number" ? r.idx : 0) | 0) + 1;

      var countEl = document.getElementById("g4-question-count");
      if (countEl) countEl.textContent = "Question " + String(idx) + " / " + String(total);

      var prog = document.getElementById("g4-progress");
      if (prog) {
        prog.max = Math.max(1, total);
        prog.value = Math.max(0, Math.min(total, idx));
      }
    } catch (e) {}
  },

  _resetGame4UiForNewQuestion: function() {
    try {
      var exp = document.getElementById("g4-explanation");
      var body = document.getElementById("g4-explanation-body");
      if (exp) {
        exp.classList.add("is-hidden");
        exp.setAttribute("aria-hidden", "true");
        exp.open = false;
      }
      if (body) body.textContent = "";
    } catch (e0) {}

    try {
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      var btns = optionsEl.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("is-selected", "is-correct", "is-wrong");
        var lab = btns[i].querySelector(".g4-option-state");
        if (lab && lab.parentNode) lab.parentNode.removeChild(lab);
      }
    } catch (e1) {}
  },

  _showGame4ExplanationIfPresent: function(q) {
    try {
      if (!q) return;
      var expEn = String(q.explanationEn || "").trim();
      var expPa = String(q.explanationPa || "").trim();

      var exp = document.getElementById("g4-explanation");
      var body = document.getElementById("g4-explanation-body");
      if (!exp || !body) return;

      var punjabiOn = Games.isPunjabiOn();
      body.innerHTML = "";

      if (punjabiOn) {
        if (expEn) {
          var en = document.createElement("div");
          en.textContent = expEn;
          body.appendChild(en);
        }
        if (expPa || expEn) {
          var pa = document.createElement("div");
          pa.setAttribute("lang", "pa");
          pa.textContent = expPa || expEn;
          body.appendChild(pa);
        }
      } else {
        body.textContent = expEn || expPa;
      }

      exp.classList.remove("is-hidden");
      exp.setAttribute("aria-hidden", "false");
      exp.open = false;
    } catch (e) {}
  },

  _applyGame4ChoiceUi: function(chosenIndex, correctIndex, attemptIndex, isCorrect, revealCorrect) {
    // UI-only: mark selection and guard against double-taps.
    // IMPORTANT: For attempt 1 wrong, do NOT reveal the correct option.
    try {
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      var btns = optionsEl.querySelectorAll("button");
      if (!btns || !btns.length) return;

      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add("g4-option");
        btns[i].classList.remove("is-selected", "is-correct", "is-wrong");
        var old = btns[i].querySelector(".g4-option-state");
        if (old && old.parentNode) old.parentNode.removeChild(old);
      }

      // Lock immediately to prevent rapid double-taps.
      for (var j = 0; j < btns.length; j++) btns[j].disabled = true;

      if (typeof chosenIndex === "number" && chosenIndex >= 0 && btns[chosenIndex]) {
        btns[chosenIndex].classList.add("is-selected");
      }

      if (!isCorrect && typeof chosenIndex === "number" && chosenIndex >= 0 && btns[chosenIndex]) {
        btns[chosenIndex].classList.add("is-wrong");
        var wLab = document.createElement("span");
        wLab.className = "g4-option-state";
        wLab.textContent = "✖ Incorrect";
        btns[chosenIndex].appendChild(wLab);
      }

      if (!!revealCorrect && typeof correctIndex === "number" && correctIndex >= 0 && btns[correctIndex]) {
        btns[correctIndex].classList.add("is-correct");
        var cLab = document.createElement("span");
        cLab.className = "g4-option-state";
        cLab.textContent = "✔ Correct";
        btns[correctIndex].appendChild(cLab);
      }

      // Preserve existing behavior: allow retry on attempt 1 wrong.
      if (!isCorrect && (attemptIndex | 0) === 0) {
        for (var k = 0; k < btns.length; k++) btns[k].disabled = false;
      }
    } catch (e) {}
  },

  _g4ProfileIdSafe: function() {
    try {
      if (window.State && typeof State.getActiveProfile === "function") {
        var p = State.getActiveProfile();
        if (p && p.id) return String(p.id);
      }
    } catch (e) {}
    return "p1";
  },

  _g4RecapKey: function() {
    return "bolo_g4_sentencecheck_recap_v1:" + Games._g4ProfileIdSafe();
  },

  _g4ReportsKey: function() {
    return "bolo_g4_sentencecheck_reports_v1:" + Games._g4ProfileIdSafe();
  },

  _g4LoadJson: function(key, fallback) {
    try {
      var raw = localStorage.getItem(String(key || ""));
      if (!raw) return fallback;
      var obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : fallback;
    } catch (e) {
      return fallback;
    }
  },

  _g4SaveJson: function(key, obj) {
    try { localStorage.setItem(String(key || ""), JSON.stringify(obj || {})); } catch (e) {}
  },

  _g4RecordRecapResolved: function(qid, q, chosenEn, chosenPa, correctEn, correctPa, resolvedCorrect, attemptCount) {
    try {
      if (!Games.runtime || !Games.runtime.round) return;
      if (!Games.runtime._g4RecapByQid) Games.runtime._g4RecapByQid = {};
      if (!qid) return;

      var entry = {
        qid: String(qid),
        trackId: String((q && q.trackId) || ""),
        promptEn: String((q && q.promptEn) || ""),
        promptPa: String((q && q.promptPa) || ""),
        chosenEn: String(chosenEn || ""),
        chosenPa: String(chosenPa || ""),
        correctEn: String(correctEn || ""),
        correctPa: String(correctPa || ""),
        resolvedCorrect: !!resolvedCorrect,
        attemptCount: Math.max(1, attemptCount | 0),
        ts: Date.now()
      };

      Games.runtime._g4RecapByQid[String(qid)] = entry;

      var store = {
        updatedAt: Date.now(),
        round: {
          gameId: String(Games.runtime.round.gameId || ""),
          mode: String(Games.runtime.round.mode || ""),
          label: String(Games.runtime.round.label || ""),
          total: (Games.runtime.round.questions && Games.runtime.round.questions.length) ? Games.runtime.round.questions.length : 0,
          entries: Object.keys(Games.runtime._g4RecapByQid).map(function(k) { return Games.runtime._g4RecapByQid[k]; })
        }
      };

      Games._g4SaveJson(Games._g4RecapKey(), store);
    } catch (e) {}
  },

  _g4ReportConfusing: function(q) {
    try {
      if (!q) return;
      var store = Games._g4LoadJson(Games._g4ReportsKey(), { updatedAt: 0, reports: [] });
      if (!store || typeof store !== "object") store = { updatedAt: 0, reports: [] };
      if (!Array.isArray(store.reports)) store.reports = [];

      store.reports.unshift({
        ts: Date.now(),
        qid: String(q.qid || ""),
        trackId: String(q.trackId || ""),
        promptEn: String(q.promptEn || ""),
        promptPa: String(q.promptPa || ""),
        explanationEn: String(q.explanationEn || ""),
        explanationPa: String(q.explanationPa || "")
      });

      if (store.reports.length > 100) store.reports = store.reports.slice(0, 100);
      store.updatedAt = Date.now();
      Games._g4SaveJson(Games._g4ReportsKey(), store);

      if (Games.runtime) {
        Games.runtime._g4ReportCountInRound = (Games.runtime._g4ReportCountInRound | 0) + 1;
      }
    } catch (e) {}
  },

  _focusGame4AfterRender: function() {
    try {
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      var first = optionsEl.querySelector("button");
      if (first && typeof first.focus === "function") first.focus({ preventScroll: true });
    } catch (e) {}
  },

  _focusGame4AfterAnswer: function(nextEnabled) {
    try {
      if (nextEnabled) {
        var nextBtn = document.getElementById("btn-play-next");
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.focus({ preventScroll: true });
          return;
        }
      }
      var fb = document.getElementById("play-feedback");
      if (fb && typeof fb.focus === "function") fb.focus({ preventScroll: true });
    } catch (e) {}
  },

  _bindGame4Keys: function() {
    try {
      if (Games.runtime && Games.runtime._g4KeysBound) return;
      if (!Games.runtime) return;
      Games.runtime._g4KeysBound = true;

      Games.runtime._g4KeyHandler = function(ev) {
        try {
          var r = Games.runtime.round;
          if (!r || r.completed) return;
          var q = (r.questions && r.questions[r.idx]) ? r.questions[r.idx] : null;
          if (!q || q.gameType !== "sentenceCheck") return;

          var tag = "";
          try { tag = (ev && ev.target && ev.target.tagName) ? String(ev.target.tagName).toLowerCase() : ""; } catch (e0) {}
          if (tag === "input" || tag === "textarea" || tag === "select") return;

          var key = String(ev.key || "");

          if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
            var optionsElA = document.getElementById("play-options");
            var btnsA = optionsElA ? optionsElA.querySelectorAll("button") : null;
            if (btnsA && btnsA.length) {
              ev.preventDefault();
              var active = document.activeElement;
              var activeIndex = -1;
              for (var ai = 0; ai < btnsA.length; ai++) {
                if (btnsA[ai] === active) { activeIndex = ai; break; }
              }
              if (activeIndex < 0) activeIndex = 0;
              var dir = (key === "ArrowLeft" || key === "ArrowUp") ? -1 : 1;
              var nextIndex = (activeIndex + dir + btnsA.length) % btnsA.length;
              if (btnsA[nextIndex] && typeof btnsA[nextIndex].focus === "function") {
                btnsA[nextIndex].focus({ preventScroll: true });
              }
            }
            return;
          }

          if (key === " " || key === "Spacebar") {
            var ae = document.activeElement;
            if (ae && ae.tagName && String(ae.tagName).toLowerCase() === "button" && !ae.disabled) {
              ev.preventDefault();
              try { ae.click(); } catch (eSp) {}
            }
            return;
          }

          if (key === "1" || key === "2") {
            var idx = (key === "1") ? 0 : 1;
            var optionsEl = document.getElementById("play-options");
            var btns = optionsEl ? optionsEl.querySelectorAll("button") : null;
            if (btns && btns[idx] && !btns[idx].disabled) {
              ev.preventDefault();
              btns[idx].click();
            }
            return;
          }

          if (key === "Enter") {
            var nextBtn = document.getElementById("btn-play-next");
            if (nextBtn && !nextBtn.disabled) {
              ev.preventDefault();
              Games.next();
              return;
            }

            var activeBtn = document.activeElement;
            if (activeBtn && activeBtn.tagName && String(activeBtn.tagName).toLowerCase() === "button" && !activeBtn.disabled) {
              ev.preventDefault();
              try { activeBtn.click(); } catch (eEn) {}
            }
            return;
          }

          if (key === "Escape") {
            ev.preventDefault();
            var ok = true;
            try { ok = window.confirm("Exit this round?"); } catch (e1) { ok = true; }
            if (ok) Games.backToPlayMenu();
            return;
          }
        } catch (e) {}
      };

      document.addEventListener("keydown", Games.runtime._g4KeyHandler);
    } catch (e2) {}
  },

  _unbindGame4Keys: function() {
    try {
      if (!Games.runtime) return;
      if (Games.runtime._g4KeyHandler) document.removeEventListener("keydown", Games.runtime._g4KeyHandler);
    } catch (e) {}
    if (Games.runtime) {
      Games.runtime._g4KeysBound = false;
      Games.runtime._g4KeyHandler = null;
    }
  },

  // Game 3 (Tense Detective) styling hook.
  // Why: keep tense-only UI tweaks safely scoped without affecting other game types.
  _setTenseMode: function(isOn) {
    try {
      if (!document || !document.body) return;
      if (isOn) document.body.classList.add("game-tense");
      else document.body.classList.remove("game-tense");
    } catch (e) {}
  },

  isPunjabiOn: function() {
    try {
      return !!(State && State.state && State.state.settings && State.state.settings.punjabiOn);
    } catch (e) {
      return true;
    }
  },

  _getActiveProfileIdSafe: function() {
    try {
      if (State && typeof State.getActiveProfile === "function") {
        var p = State.getActiveProfile();
        if (p && p.id) return String(p.id);
      }
    } catch (e) {}
    return "p1";
  },

  _ensurePersistentMissStore: function() {
    try {
      if (!State || !State.state) return null;
      if (!State.state.progress || typeof State.state.progress !== "object") State.state.progress = {};
      if (!State.state.progress.gamesMissedByProfile || typeof State.state.progress.gamesMissedByProfile !== "object") {
        State.state.progress.gamesMissedByProfile = {};
      }
      var pid = Games._getActiveProfileIdSafe();
      var map = State.state.progress.gamesMissedByProfile[pid];
      if (!map || typeof map !== "object") map = {};
      State.state.progress.gamesMissedByProfile[pid] = map;
      return map;
    } catch (e) {
      return null;
    }
  },

  _wasPersistentlyMissed: function(qid) {
    if (!qid) return false;
    var map = Games._ensurePersistentMissStore();
    if (!map) return false;
    return map[qid] === true;
  },

  _markPersistentlyMissed: function(qid) {
    if (!qid) return;
    var map = Games._ensurePersistentMissStore();
    if (!map) return;
    if (map[qid] === true) return;
    map[qid] = true;
    try { if (State && State.save) State.save(); } catch (e) {}
  },

  _clearPersistentlyMissed: function(qid) {
    if (!qid) return;
    var map = Games._ensurePersistentMissStore();
    if (!map) return;
    if (!Object.prototype.hasOwnProperty.call(map, qid)) return;
    delete map[qid];
    try { if (State && State.save) State.save(); } catch (e) {}
  },

  _pickActiveHintText: function(q, chosenText, correctText) {
    if (!q) return "";
    var punjabiOn = Games.isPunjabiOn();
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var near = Games.getNearMissTip(q, chosenText || "", correctText || "");

    // Prefer authored hint in active language; then near-miss; then generic fallback.
    var t = "";
    if (punjabiOn) {
      t = (q.hintPa || "") || (q.hintEn || "") || (near.pa || "") || (near.en || "") || (fb.hintPa || "") || (fb.hintEn || "");
    } else {
      t = (q.hintEn || "") || (near.en || "") || (fb.hintEn || "");
    }
    return String(t || "").trim();
  },

  _pickActiveExplanationText: function(q) {
    if (!q) return "";
    var punjabiOn = Games.isPunjabiOn();
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var t = "";
    if (punjabiOn) {
      t = (q.explanationPa || "") || (q.explanationEn || "") || (fb.explanationPa || "") || (fb.explanationEn || "");
    } else {
      t = (q.explanationEn || "") || (fb.explanationEn || "");
    }
    return String(t || "").trim();
  },

  _pickExplanationBoth: function(q) {
    if (!q) return { en: "", pa: "" };
    var fb = Games.GENERIC_FEEDBACK[q.gameType] || {};
    var en = String((q.explanationEn || "") || (fb.explanationEn || "") || "").trim();
    var pa = String((q.explanationPa || "") || (fb.explanationPa || "") || "").trim();
    // If Punjabi is missing but English exists, leave Punjabi blank (no forced translation).
    return { en: en, pa: pa };
  },

  _xpEach: function() {
    return (State && typeof State.XP_PER_CORRECT === "number") ? State.XP_PER_CORRECT : 5;
  },

  _getGameKey: function(gameNum) {
    return "game" + gameNum;
  },

  _mapGameNumToType: function(gameNum) {
    if (gameNum === 1) return "tapWord";
    if (gameNum === 2) return "pos";
    if (gameNum === 3) return "tense";
    if (gameNum === 4) return "sentenceCheck";
    if (gameNum === 5) return "convoReply";
    if (gameNum === 6) return "vocabTranslation";
    if (gameNum === 8) return "wordOrderSurgery";
    if (gameNum === 10) return "clashStability";
    if (gameNum === 11) return "mazeTraceQuest";
    if (gameNum === 12) return "storyDetective";
    return null;
  },

  _mapGameIdToType: function(gameId) {
    if (gameId === "GAME1") return "tapWord";
    if (gameId === "GAME2") return "pos";
    if (gameId === "GAME3") return "tense";
    if (gameId === "GAME4") return "sentenceCheck";
    if (gameId === "GAME5") return "convoReply";
    if (gameId === "GAME6") return "vocabTranslation";
    if (gameId === "GAME8") return "wordOrderSurgery";
    if (gameId === "GAME10") return "clashStability";
    if (gameId === "GAME11") return "mazeTraceQuest";
    if (gameId === "GAME12") return "storyDetective";
    return null;
  },

  _difficultyLabel: function(d) {
    if (d === 1) return "Easy";
    if (d === 2) return "Medium";
    return "Hard";
  },

  // Base normalized question shape (used by all normalizers)
  _baseNormalized: function(gameType) {
    return {
      gameType: gameType || "",
      qid: "",
      trackId: "T_WORDS",
      difficulty: 2,

      // Prompts (bilingual)
      promptEn: "",
      promptPa: "",

      // TapWord-specific
      sentenceEn: "",
      sentencePa: "",
      tokens: null,
      correctTokenIndex: -1,

      // Multiple-choice (generic)
      optionsEn: [],
      optionsPa: null,
      correctIndex: -1,
      answerIndex: -1,
      correctChoiceId: "",

      // Optional choice metadata for POS/Tense (additive)
      _choiceIds: null,
      _choiceLabels: null,
      _choiceLabelsPa: null,

      // Optional feedback (additive)
      hintEn: "",
      hintPa: "",
      explanationEn: "",
      explanationPa: "",

      tags: [],
      source: null
    };
  },

  normalizeFromCustomQuestion: function(q) {
    if (!q || typeof q !== "object") return null;
    var gameId = (q.gameId != null) ? String(q.gameId) : "";
    var gameType = Games._mapGameIdToType(gameId);
    if (!gameType) return null;

    var qid = (q.id != null) ? String(q.id) : (gameId + "_" + String(Math.random()));
    var meta = {
      sourceType: "custom_quiz",
      idx: 0,
      qid: qid,
      stableId: qid,
      seedKey: qid,
      trackId: (q.trackId != null) ? String(q.trackId) : "T_WORDS",
      source: { type: "custom_quiz", id: qid, gameId: gameId }
    };

    // Unified V2 normalizers for drift-free behavior.
    if (gameType === "tapWord") {
      return normalizeGame1QuestionAnySource(q, meta);
    }
    if (gameType === "sentenceCheck") {
      return normalizeGame4QuestionAnySource(q, meta);
    }

    var out = Games._baseNormalized(gameType);
    out.qid = qid;
    out.trackId = meta.trackId;
    out.source = meta.source;

    // Optional feedback fields (additive)
    if (q.hintEn != null) out.hintEn = String(q.hintEn);
    if (q.hintPa != null) out.hintPa = String(q.hintPa);
    if (q.explanationEn != null) out.explanationEn = String(q.explanationEn);
    if (q.explanationPa != null) out.explanationPa = String(q.explanationPa);

    // Prompt
    out.promptEn = (q.prompt != null) ? String(q.prompt) : String(q.promptEn || "");
    out.promptPa = String(q.promptPa || "");

    // Difficulty (optional)
    if (typeof q.difficulty === "number" && isFinite(q.difficulty)) {
      out.difficulty = Math.max(1, Math.min(3, q.difficulty | 0));
    }

    var choices = Array.isArray(q.choices) ? q.choices : [];
    out.correctChoiceId = (q.correctChoiceId != null) ? String(q.correctChoiceId) : "";

    if (gameType === "pos") {
      var partIds = Object.keys(PARTS_OF_SPEECH_LABELS);
      out._choiceIds = partIds.slice();
      out._choiceLabels = partIds.map(function(pid) {
        if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "en" });
        return PARTS_OF_SPEECH_LABELS[pid];
      });

      try {
        if (typeof PARTS_OF_SPEECH_LABELS_PA !== "undefined" && PARTS_OF_SPEECH_LABELS_PA) {
          out._choiceLabelsPa = partIds.map(function(pid) {
            if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "pa" }) || "";
            return PARTS_OF_SPEECH_LABELS_PA[pid] || "";
          });
        }
      } catch (e1) {}

      out.correctIndex = partIds.indexOf(String(q.correctChoiceId || ""));
    } else if (gameType === "tense") {
      // Standardize custom tense tracking to actions.
      out.trackId = "T_ACTIONS";

      var tenseIds = Object.keys(TENSE_LABELS);
      out._choiceIds = tenseIds.slice();
      out._choiceLabels = tenseIds.map(function(tid) {
        if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "en" });
        return TENSE_LABELS[tid];
      });

      try {
        if (typeof TENSE_LABELS_PA !== "undefined" && TENSE_LABELS_PA) {
          out._choiceLabelsPa = tenseIds.map(function(tid) {
            if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "pa" }) || "";
            return TENSE_LABELS_PA[tid] || "";
          });
        }
      } catch (e2) {}

      out.correctIndex = tenseIds.indexOf(String(q.correctChoiceId || ""));
    } else {
      // Generic choice question (e.g., sentenceCheck)
      out.optionsEn = choices.map(function(c) { return c && c.text != null ? String(c.text) : ""; });
      out.optionsPa = null;
      var correctIdx = -1;
      for (var i = 0; i < choices.length; i++) {
        if (choices[i] && String(choices[i].id) === String(q.correctChoiceId)) {
          correctIdx = i;
          break;
        }
      }
      out.correctIndex = correctIdx;
    }

    // Tags
    if (gameType === "pos" && q.correctChoiceId) out.tags = ["POS:" + String(q.correctChoiceId).toUpperCase()];
    if (gameType === "tense" && q.correctChoiceId) out.tags = ["TENSE:" + String(q.correctChoiceId).toUpperCase()];
    if (gameType === "sentenceCheck") out.tags = ["SENTENCE:CHECK"]; 

    return out;
  },

  normalizeFromRawGame: function(gameNum, q, idx) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType || !q) return null;

    var qid = "N_" + gameType + "_" + String(idx);
    var stableId = (gameType === "tapWord") ? ("G1_" + String(idx)) : (gameType === "sentenceCheck" ? ("G4_" + String(idx)) : qid);
    var meta = {
      sourceType: "raw_game",
      idx: idx,
      qid: qid,
      stableId: stableId,
      seedKey: stableId,
      trackId: q.trackId || "T_WORDS",
      source: { type: "raw_game", id: qid }
    };

    // Unified V2 normalizers for drift-free behavior.
    if (gameType === "tapWord") {
      return normalizeGame1QuestionAnySource(q, meta);
    }
    if (gameType === "sentenceCheck") {
      return normalizeGame4QuestionAnySource(q, meta);
    }

    var out = Games._baseNormalized(gameType);
    out.qid = qid;
    out.trackId = meta.trackId;
    out.source = meta.source;

    // Optional authored feedback fields (additive)
    if (q.hintEn != null) out.hintEn = String(q.hintEn);
    if (q.hintPa != null) out.hintPa = String(q.hintPa);
    if (q.explanationEn != null) out.explanationEn = String(q.explanationEn);
    if (q.explanationPa != null) out.explanationPa = String(q.explanationPa);

    if (gameType === "pos") {
      var word = String(q.word || "");
      out.promptEn = "What word type is: \"" + word + "\"?";
      out.promptPa = "";

      var partIds = Object.keys(PARTS_OF_SPEECH_LABELS);
      out._choiceIds = partIds.slice();
      out._choiceLabels = partIds.map(function(pid) {
        if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "en" });
        return PARTS_OF_SPEECH_LABELS[pid];
      });

      // Optional Punjabi labels (additive; safe fallback if missing)
      try {
        if (typeof PARTS_OF_SPEECH_LABELS_PA !== "undefined" && PARTS_OF_SPEECH_LABELS_PA) {
          out._choiceLabelsPa = partIds.map(function(pid) {
            if (typeof getPosLabel === "function") return getPosLabel(pid, { lang: "pa" }) || "";
            return PARTS_OF_SPEECH_LABELS_PA[pid] || "";
          });
        }
      } catch (e) {}

      out.correctIndex = partIds.indexOf(q.correctPartId);
      out.tags = ["POS:" + String(q.correctPartId || "").toUpperCase()];
      out.difficulty = 2;
      return out;
    }

    if (gameType === "tense") {
      // Standardize Game 3 tracking to the tense/action skill.
      out.trackId = "T_ACTIONS";
      out.promptEn = String(q.sentence || "");
      out.promptPa = String(q.sentencePa || q.promptPa || "");
      var tenseIds = Object.keys(TENSE_LABELS);
      out._choiceIds = tenseIds.slice();
      out._choiceLabels = tenseIds.map(function(tid) {
        if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "en" });
        return TENSE_LABELS[tid];
      });

      // Optional Punjabi labels (additive; safe fallback if missing)
      try {
        if (typeof TENSE_LABELS_PA !== "undefined" && TENSE_LABELS_PA) {
          out._choiceLabelsPa = tenseIds.map(function(tid) {
            if (typeof getTenseLabel === "function") return getTenseLabel(tid, { lang: "pa" }) || "";
            return TENSE_LABELS_PA[tid] || "";
          });
        }
      } catch (e) {}

      out.correctIndex = tenseIds.indexOf(q.correctTense);
      out.tags = ["TENSE:" + String(q.correctTense || "").toUpperCase()];
      out.difficulty = 2;
      return out;
    }

    return null;
  },

  normalizeGame5Questions: function(rawArray) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var out = [];
    var seen = {};

    for (var i = 0; i < raw.length; i++) {
      var q = raw[i] || {};
      var id = String(q.id || ("G5_" + String(i + 1)));
      if (!id || seen[id]) continue;
      seen[id] = true;

      var choicesEn = Array.isArray(q.choicesEn)
        ? q.choicesEn
        : (Array.isArray(q.optionsEn)
          ? q.optionsEn
          : (Array.isArray(q.options)
            ? q.options
            : []));

      var choicesPa = Array.isArray(q.choicesPa)
        ? q.choicesPa
        : (Array.isArray(q.optionsPa)
          ? q.optionsPa
          : null);

      var answerIndex = (typeof q.answerIndex === "number")
        ? (q.answerIndex | 0)
        : ((typeof q.correctIndex === "number")
          ? (q.correctIndex | 0)
          : ((typeof q.correctChoiceIndex === "number")
            ? (q.correctChoiceIndex | 0)
            : -1));

      if (choicesEn.length < 3 || choicesEn.length > 8) continue;
      if (answerIndex < 0 || answerIndex >= choicesEn.length) continue;

      var base = Games._baseNormalized("convoReply");
      base.qid = id;
      base.trackId = String(q.trackId || "CONVO_REPLY");
      base.difficulty = Math.max(1, Math.min(3, (q.difficulty | 0) || 2));

      base.promptEn = String(q.promptEn || "");
      base.promptPa = String(q.promptPa || "");

      base.optionsEn = choicesEn.map(function(s) { return String(s || ""); });
      if (choicesPa) {
        base.optionsPa = choicesEn.map(function(_, idx) {
          return (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        });
      } else {
        base.optionsPa = null;
      }

      base.correctIndex = answerIndex;
      base.answerIndex = answerIndex;

      base.hintEn = String(q.hintEn || q.hint || "");
      base.hintPa = String(q.hintPa || "");
      base.explanationEn = String(q.explainEn || q.explanationEn || q.explain || q.explanation || "");
      base.explanationPa = String(q.explainPa || q.explanationPa || "");

      // Additive, richer shape (safe for older renderer)
      base.id = id;
      base.gameId = 5;
      base.prompt = { en: base.promptEn, pa: base.promptPa || undefined };
      base.choices = base.optionsEn.map(function(en, idx) {
        var pa = (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        return { en: en, pa: pa || undefined };
      });
      base.hint = { en: base.hintEn, pa: base.hintPa || undefined };
      base.explanation = { en: base.explanationEn, pa: base.explanationPa || undefined };

      if (q.topic) base.tags = ["CONVO:" + String(q.topic).toUpperCase()];

      out.push(base);
    }

    return out;
  },

  normalizeGame6Questions: function(rawArray, gameNum) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var out = [];
    var seen = {};
    var gameNumber = (typeof gameNum === "number" && gameNum > 0) ? gameNum : 6;
    var gameKey = "GAME" + String(gameNumber);

    for (var i = 0; i < raw.length; i++) {
      var q = raw[i] || {};
      var id = String(q.id || ("G" + String(gameNumber) + "_" + String(i + 1)));
      if (!id || seen[id]) continue;
      seen[id] = true;

      var choicesEn = Array.isArray(q.choicesEn)
        ? q.choicesEn
        : (Array.isArray(q.optionsEn)
          ? q.optionsEn
          : (Array.isArray(q.options)
            ? q.options
            : []));

      var choicesPa = Array.isArray(q.choicesPa)
        ? q.choicesPa
        : (Array.isArray(q.optionsPa)
          ? q.optionsPa
          : null);

      var answerIndex = (typeof q.answerIndex === "number")
        ? (q.answerIndex | 0)
        : ((typeof q.correctIndex === "number")
          ? (q.correctIndex | 0)
          : ((typeof q.correctChoiceIndex === "number")
            ? (q.correctChoiceIndex | 0)
            : -1));

      if (choicesEn.length < 3 || choicesEn.length > 8) continue;
      if (answerIndex < 0 || answerIndex >= choicesEn.length) continue;

      var base = Games._baseNormalized("vocabTranslation");
      base.qid = id;
      var rawTrackId = String(q.trackId || "VOCAB_TRANSLATION");
      // Keep track ids consistent with the rest of the app's T_* track catalog.
      if (rawTrackId && rawTrackId.toUpperCase && rawTrackId.toUpperCase() === "VOCAB_TRANSLATION") {
        rawTrackId = "T_WORDS";
      }
      base.trackId = rawTrackId;
      base.difficulty = Math.max(1, Math.min(3, (q.difficulty | 0) || 2));

      base.promptEn = String(q.promptEn || "");
      base.promptPa = String(q.promptPa || "");

      base.optionsEn = choicesEn.map(function(s) { return String(s || ""); });
      if (choicesPa) {
        base.optionsPa = choicesEn.map(function(_, idx) {
          return (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        });
      } else {
        base.optionsPa = null;
      }

      base.correctIndex = answerIndex;
      base.answerIndex = answerIndex;

      base.hintEn = String(q.hintEn || q.hint || "");
      base.hintPa = String(q.hintPa || "");
      base.explanationEn = String(q.explainEn || q.explanationEn || q.explain || q.explanation || "");
      base.explanationPa = String(q.explainPa || q.explanationPa || "");

      // Additive, richer shape (safe for older renderer)
      base.id = id;
      base.gameId = gameNumber;
      base.gameKey = gameKey;
      base.prompt = { en: base.promptEn, pa: base.promptPa || undefined };
      base.choices = base.optionsEn.map(function(en, idx) {
        var pa = (choicesPa && choicesPa[idx] != null) ? String(choicesPa[idx] || "") : "";
        return { en: en, pa: pa || undefined };
      });
      base.hint = { en: base.hintEn, pa: base.hintPa || undefined };
      base.explanation = { en: base.explanationEn, pa: base.explanationPa || undefined };

      if (q.topic) base.tags = ["VOCAB:" + String(q.topic).toUpperCase()];

      // === TRANSLATION GAME UX FIX ===
      // For translation questions (Punjabi → English), showing Punjabi on choice buttons
      // creates a visual-matching task instead of translation task, because the correct
      // button will contain the exact Punjabi word from the prompt.
      // Solution: suppress Punjabi choices for this game type.
      // This is DATA-DRIVEN: set a flag that the renderer respects (not game-type check).
      base.suppressChoicePa = true;  // Punjabi → English UX: avoid visual matching giveaway
      
      // ALSO suppress Punjabi PROMPT: showing the translated question is redundant and
      // can give away answer structure. Translation games should show question in ONE language.
      base.suppressPromptPa = true;  // Show the question in ONE language for clarity

      // GUARDRAIL: Auto-detect if prompt contains a Punjabi choice string.
      // If so, ensure Punjabi choices are suppressed (prevents accidental regressions).
      if (base.promptPa && base.optionsPa && Array.isArray(base.optionsPa)) {
        for (var j = 0; j < base.optionsPa.length; j++) {
          var pChoice = String(base.optionsPa[j] || "");
          if (pChoice && base.promptPa.indexOf(pChoice) !== -1) {
            base.suppressChoicePa = true;  // Force suppress if giveaway detected
            break;
          }
        }
      }

      out.push(base);
    }

    return out;
  },

  normalizeGame12StoryDetectiveQuestions: function(rawArray) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var out = [];

    function normLine(s) {
      return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
    }

    function splitWords(s) {
      return String(s || "").split(" ");
    }

    function cleanWord(w) {
      return String(w || "").replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
    }

    function replaceTokenPreservePunct(originalToken, newCore) {
      var t = String(originalToken || "");
      var m = t.match(/^([^A-Za-z']*)([A-Za-z']+)([^A-Za-z']*)$/);
      if (!m) return String(newCore || t);
      return String(m[1] || "") + String(newCore || "") + String(m[3] || "");
    }

    function nearbyWrongCore(word) {
      var w = String(word || "");
      var lower = w.toLowerCase();
      if (!lower) return w;

      var irregular = {
        "is": "are",
        "are": "is",
        "was": "were",
        "were": "was",
        "has": "have",
        "have": "has",
        "does": "do",
        "do": "does",
        "goes": "go",
        "go": "goes",
        "makes": "make",
        "make": "makes"
      };
      if (irregular[lower]) {
        var rep = irregular[lower];
        if (w[0] === w[0].toUpperCase()) rep = rep.charAt(0).toUpperCase() + rep.slice(1);
        return rep;
      }

      if (/ies$/.test(lower) && lower.length > 3) {
        var baseY = lower.slice(0, -3) + "y";
        return (w[0] === w[0].toUpperCase()) ? (baseY.charAt(0).toUpperCase() + baseY.slice(1)) : baseY;
      }
      if (/es$/.test(lower) && lower.length > 2) {
        var baseEs = lower.slice(0, -2);
        return (w[0] === w[0].toUpperCase()) ? (baseEs.charAt(0).toUpperCase() + baseEs.slice(1)) : baseEs;
      }
      if (/s$/.test(lower) && lower.length > 1) {
        var baseS = lower.slice(0, -1);
        return (w[0] === w[0].toUpperCase()) ? (baseS.charAt(0).toUpperCase() + baseS.slice(1)) : baseS;
      }

      return w;
    }

    function buildNearMisses(wrong, fix) {
      var misses = [];
      function add(v) {
        var n = normLine(v);
        if (!n) return;
        if (misses.indexOf(n) !== -1) return;
        misses.push(n);
      }

      var wrongWords = splitWords(wrong);
      var fixWords = splitWords(fix);
      var minLen = Math.min(wrongWords.length, fixWords.length);
      var diffs = [];
      for (var di = 0; di < minLen; di++) {
        if (normLine(wrongWords[di]).toLowerCase() !== normLine(fixWords[di]).toLowerCase()) {
          diffs.push(di);
        }
      }
      if (wrongWords.length !== fixWords.length) {
        for (var de = minLen; de < Math.max(wrongWords.length, fixWords.length); de++) diffs.push(de);
      }

      add(wrong);

      for (var p = 0; p < diffs.length; p++) {
        var keepWrongAt = diffs[p];
        var partial = [];
        var maxLen = Math.max(wrongWords.length, fixWords.length);
        for (var wi = 0; wi < maxLen; wi++) {
          var fromFix = (wi < fixWords.length) ? fixWords[wi] : "";
          var fromWrong = (wi < wrongWords.length) ? wrongWords[wi] : "";
          if (wi === keepWrongAt) partial.push(fromWrong || fromFix);
          else partial.push(fromFix || fromWrong);
        }
        add(partial.join(" "));
      }

      for (var fj = 0; fj < fixWords.length; fj++) {
        var fixCore = cleanWord(fixWords[fj]);
        if (!fixCore) continue;
        var wrongCore = nearbyWrongCore(fixCore);
        if (!wrongCore || wrongCore.toLowerCase() === fixCore.toLowerCase()) continue;
        var variant = fixWords.slice();
        variant[fj] = replaceTokenPreservePunct(fixWords[fj], wrongCore);
        add(variant.join(" "));
      }

      return misses;
    }

    function stableInt(str) {
      var s = String(str || "");
      var h = 0;
      for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
      }
      return Math.abs(h | 0);
    }

    for (var i = 0; i < raw.length; i++) {
      var seed = raw[i] || {};
      var mistakes = Array.isArray(seed.mistakes) ? seed.mistakes.slice(0, 3) : [];
      if (mistakes.length < 3) continue;

      var title = normLine(seed.title || ("Case " + String(i + 1)));
      var storyLines = [];
      for (var m = 0; m < 3; m++) {
        storyLines.push(normLine((mistakes[m] && mistakes[m].wrong) || ""));
      }
      if (!storyLines[0] || !storyLines[1] || !storyLines[2]) continue;

      var storyText = "1) " + storyLines[0] + "\n2) " + storyLines[1] + "\n3) " + storyLines[2];

      for (var step = 0; step < 3; step++) {
        var mk = mistakes[step] || {};
        var fix = normLine(mk.fix || "");
        var wrong = normLine(mk.wrong || "");
        if (!fix || !wrong) continue;

        var optionPool = [];
        function pushOption(v) {
          var t = normLine(v);
          if (!t) return;
          if (optionPool.indexOf(t) !== -1) return;
          optionPool.push(t);
        }

        pushOption(fix);
        var nearMisses = buildNearMisses(wrong, fix);
        for (var nm = 0; nm < nearMisses.length; nm++) pushOption(nearMisses[nm]);
        for (var d1 = 0; d1 < mistakes.length; d1++) {
          if (d1 === step) continue;
          var otherWrong = normLine(mistakes[d1] && mistakes[d1].wrong);
          if (otherWrong) pushOption(otherWrong);
        }

        var selected = optionPool.slice(0, 6);
        if (selected.length < 3) continue;

        var correctIndex = selected.indexOf(fix);
        if (correctIndex < 0) {
          selected[0] = fix;
          correctIndex = 0;
        }

        var desired = stableInt(String(seed.id || i) + "|" + String(step)) % selected.length;
        if (desired !== correctIndex) {
          var tmp = selected[desired];
          selected[desired] = selected[correctIndex];
          selected[correctIndex] = tmp;
          correctIndex = desired;
        }

        var q = Games._baseNormalized("storyDetective");
        q.qid = String(seed.id || ("G12_" + String(i + 1))) + "_M" + String(step + 1);
        q.trackId = String(seed.trackId || "T_SENTENCE");
        q.difficulty = Math.max(1, Math.min(3, (seed.difficulty | 0) || 2));

        q.promptEn = "Case " + title + " • Fix " + String(step + 1) + " of 3";
        q.promptPa = "ਕੇਸ " + title + " • ਠੀਕ " + String(step + 1) + " / 3";
        q.optionsEn = selected.slice();
        q.optionsPa = null;
        q.correctIndex = correctIndex;
        q.answerIndex = correctIndex;

        q.storyTitleEn = title;
        q.storyTitlePa = "ਕਹਾਣੀ";
        q.storyLinesEn = storyLines.slice();
        q.currentStoryLineIndex = step;
        q.totalStoryMistakes = 3;
        q.currentWrongLineEn = wrong;

        q.hintEn = String(mk.hintEn || "Look for subject-verb agreement and punctuation.");
        q.hintPa = String(mk.hintPa || "Subject-verb ਮਿਲਾਪ ਅਤੇ punctuation ਧਿਆਨ ਨਾਲ ਵੇਖੋ।");
        q.explanationEn = String(mk.explainEn || ("Fix: \"" + wrong + "\" → \"" + fix + "\""));
        q.explanationPa = String(mk.explainPa || "ਇਹ ਵਾਕ grammar ਅਨੁਸਾਰ ਇਸ ਤਰ੍ਹਾਂ ਠੀਕ ਹੁੰਦਾ ਹੈ।");

        q.goalEn = "Goal: Find and fix all 3 mistakes.";
        q.goalPa = "ਮਕਸਦ: 3 ਗਲਤੀਆਂ ਲੱਭ ਕੇ ਠੀਕ ਕਰੋ।";
        q.exampleEn = "Example: She go → She goes";
        q.examplePa = "ਉਦਾਹਰਨ: She go → She goes";
        q.tags = ["STORY:DETECTIVE"];

        out.push(q);
      }
    }

    return out;
  },

  normalizeFromLessonStepTapWord: function(lessonId, step, stepIndex) {
    if (!lessonId || !step || step.step_type !== "question") return null;
    if (!Array.isArray(step.options) || typeof step.correct_answer !== "string") return null;

    var tokens = step.options.map(function(t) { return String(t); });
    var correct = String(step.correct_answer);
    var correctIdxs = [];
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === correct) correctIdxs.push(i);
    }
    if (correctIdxs.length === 0) return null;

    var out = Games._baseNormalized("tapWord");
    out.qid = "LQ_" + lessonId + "_" + String(stepIndex);
    out.trackId = "T_WORDS";
    try {
      if (typeof LESSON_META !== "undefined" && Array.isArray(LESSON_META)) {
        for (var m = 0; m < LESSON_META.length; m++) {
          if (LESSON_META[m] && LESSON_META[m].id === lessonId) {
            out.trackId = LESSON_META[m].trackId || out.trackId;
            break;
          }
        }
      }
    } catch (e) {}

    out.promptEn = String(step.english_text || "Tap the word.");
    out.promptPa = String(step.punjabi_text || "");
    out.sentenceEn = tokens.join(" ");
    out.tokens = tokens;
    out.correctTokenIndices = correctIdxs;
    out.correctTokenIndex = correctIdxs[0];
    out.source = { type: "lesson_step", id: lessonId, stepId: String(stepIndex) };
    out.tags = ["TAPWORD"]; 
    out.difficulty = (tokens.length <= 5) ? 1 : (tokens.length <= 8 ? 2 : 3);

    // Optional authored feedback fields from lesson steps (if present)
    if (step.hint && typeof step.hint === "object") {
      if (step.hint.en) out.hintEn = String(step.hint.en);
      if (step.hint.pa) out.hintPa = String(step.hint.pa);
    }
    if (step.explanation && typeof step.explanation === "object") {
      if (step.explanation.en) out.explanationEn = String(step.explanation.en);
      if (step.explanation.pa) out.explanationPa = String(step.explanation.pa);
    }

    return out;
  },

  // ===== Selection + Difficulty =====
  buildPoolForGameNum: function(gameNum) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType) return [];

    // Game 8: Word Order Surgery (MVP, dev-start only)
    if (gameType === "wordOrderSurgery") {
      return Games.normalizeGame8WordOrderQuestions((typeof RAW_GAME8_WORD_ORDER !== "undefined") ? RAW_GAME8_WORD_ORDER : []);
    }

    // tapWord: prefer normalized GAME1_QUESTIONS + also include lesson-derived tapWord
    if (gameType === "tapWord") {
      var pool = [];
      if (typeof GAME1_QUESTIONS !== "undefined" && Array.isArray(GAME1_QUESTIONS)) {
        for (var i = 0; i < GAME1_QUESTIONS.length; i++) {
          try {
            if (Games.runtime && Games.runtime._rawQuarantine && Games.runtime._rawQuarantine.GAME1 && Games.runtime._rawQuarantine.GAME1[i]) {
              continue;
            }
          } catch (eQ1) {}
          var nq = Games.normalizeFromRawGame(1, GAME1_QUESTIONS[i], i);
          if (nq) pool.push(nq);
        }
      }

      // Add lesson-derived (legacy + new format via Lessons.getSteps when available)
      try {
        if (typeof LESSONS !== "undefined" && LESSONS) {
          for (var lessonId in LESSONS) {
            if (!LESSONS.hasOwnProperty(lessonId)) continue;
            var steps = null;
            if (typeof Lessons !== "undefined" && Lessons && typeof Lessons.getSteps === "function") {
              steps = Lessons.getSteps(lessonId);
            } else {
              steps = LESSONS[lessonId];
            }
            if (!Array.isArray(steps)) continue;
            for (var si = 0; si < steps.length; si++) {
              var step = steps[si];
              var n2 = Games.normalizeFromLessonStepTapWord(lessonId, step, si);
              if (n2) pool.push(n2);
            }
          }
        }
      } catch (e) {}

      return pool;
    }

    // Game 5: Conversation Coach (Best Reply)
    if (gameType === "convoReply") {
      var raw5 = (typeof RAW_GAME5_QUESTIONS !== "undefined") ? RAW_GAME5_QUESTIONS : [];
      if (!Array.isArray(raw5)) raw5 = [];
      return Games.normalizeGame5Questions(raw5);
    }

    // Game 6+: Vocab Vault (Translation)
    if (gameType === "vocabTranslation") {
      var raw6 = (typeof RAW_GAME6_QUESTIONS !== "undefined") ? RAW_GAME6_QUESTIONS : [];
      var dataKey = "GAME" + String(gameNum || 6);
      var raw = raw6;

      try {
        if (typeof GAMES_DATA !== "undefined" && GAMES_DATA[dataKey]) {
          raw = GAMES_DATA[dataKey];
          if (raw && Array.isArray(raw.questions)) raw = raw.questions; // tolerate object-wrapped banks
        }
      } catch (e) {}

      if (!Array.isArray(raw)) raw = raw6;
      if (!Array.isArray(raw)) raw = [];
      return Games.normalizeGame6Questions(raw, gameNum);
    }

    if (gameType === "storyDetective") {
      var raw12 = [];
      try {
        if (typeof GAMES_DATA !== "undefined" && GAMES_DATA && Array.isArray(GAMES_DATA.GAME12)) {
          raw12 = GAMES_DATA.GAME12;
        }
      } catch (e12) {}
      if (!Array.isArray(raw12) && typeof RAW_GAME12_STORY_SEEDS !== "undefined" && Array.isArray(RAW_GAME12_STORY_SEEDS)) {
        raw12 = RAW_GAME12_STORY_SEEDS;
      }
      if (!Array.isArray(raw12)) raw12 = [];
      return Games.normalizeGame12StoryDetectiveQuestions(raw12);
    }

    var raw = null;
    if (gameType === "pos") raw = (typeof GAME2_QUESTIONS !== "undefined") ? GAME2_QUESTIONS : [];
    if (gameType === "tense") raw = (typeof GAME3_QUESTIONS !== "undefined") ? GAME3_QUESTIONS : [];
    if (gameType === "sentenceCheck") raw = (typeof GAME4_QUESTIONS !== "undefined") ? GAME4_QUESTIONS : [];
    if (!Array.isArray(raw)) raw = [];

    var out = [];
    for (var r = 0; r < raw.length; r++) {
      try {
        if (gameType === "sentenceCheck" && Games.runtime && Games.runtime._rawQuarantine && Games.runtime._rawQuarantine.GAME4 && Games.runtime._rawQuarantine.GAME4[r]) {
          continue;
        }
      } catch (eQ4) {}
      var nq2 = Games.normalizeFromRawGame(gameNum, raw[r], r);
      if (nq2) out.push(nq2);
    }
    return out;
  },

  applyDifficultyToQuestion: function(q, difficulty) {
    if (!q || typeof q !== "object") return q;
    var d = Math.max(1, Math.min(3, difficulty | 0));

    // tapWord: filter by token count via selection (handled at pool selection), but keep as-is.
    if (q.gameType === "pos" || q.gameType === "tense") {
      // Build choices list: small set for easy/medium, full for hard.
      var allIds = Array.isArray(q._choiceIds) ? q._choiceIds.slice() : [];
      var allLabels = Array.isArray(q._choiceLabels) ? q._choiceLabels.slice() : [];
      var allLabelsPa = Array.isArray(q._choiceLabelsPa) ? q._choiceLabelsPa.slice() : null;
      if (!allIds.length || !allLabels.length) return q;

      var correctId = (q.correctIndex >= 0 && q.correctIndex < allIds.length) ? allIds[q.correctIndex] : null;
      var keepCount = (d === 1) ? 5 : (d === 2 ? 7 : allIds.length);
      keepCount = Math.max(3, Math.min(allIds.length, keepCount));

      // Always include correct.
      var keepIds = [];
      var keepLabels = [];
      if (correctId != null) {
        keepIds.push(correctId);
        keepLabels.push(allLabels[allIds.indexOf(correctId)]);
      }

      // Add distractors deterministically/random depending on mode; caller provides RNG.
      q._difficultyKeepCount = keepCount;
      q._difficultyAllIds = allIds;
      q._difficultyAllLabels = allLabels;
      if (allLabelsPa) q._difficultyAllLabelsPa = allLabelsPa;
      return q;
    }

    // Game 12 storyDetective: option density scales with difficulty.
    // Easy: 3 options, Medium: 4 options, Hard: up to 5 options.
    if (q.gameType === "storyDetective" && Array.isArray(q.optionsEn) && typeof q.correctIndex === "number") {
      var labels = q.optionsEn.map(function(s) { return String(s || ""); });
      if (!labels.length) return q;

      var ids = labels.map(function(_, i) { return String(i); });
      var keepCount = (d === 1) ? 3 : (d === 2 ? 4 : 5);
      keepCount = Math.max(3, Math.min(ids.length, keepCount));

      q._difficultyKeepCount = keepCount;
      q._difficultyAllIds = ids;
      q._difficultyAllLabels = labels;
      return q;
    }
    return q;
  },

  // ===== Round Engine =====
  _roundDateKey: function() {
    try {
      // YYYY-MM-DD (local-only determinism)
      return (new Date()).toISOString().slice(0, 10);
    } catch (e) {
      return "";
    }
  },

  _roundSeedKeyV2: function(gameNum, mode, difficulty, batchIndex) {
    var g = (gameNum | 0) || 0;
    var m = String(mode || "normal");
    var d = (difficulty | 0) || 2;
    var b = (batchIndex | 0) || 0;
    return "ROUND|" + String(g) + "|" + m + "|" + Games._roundDateKey() + "|d" + String(d) + "|b" + String(b);
  },

  _rngFromSeedKeyV2: function(seedKey) {
    // Prefer V2 deterministic RNG if available; fall back to existing seeded LCG.
    try {
      if (typeof makeRng === "function" && typeof hashSeed === "function") {
        var r = makeRng(hashSeed(String(seedKey || "")));
        return (typeof r === "function") ? r : Math.random;
      }
    } catch (e0) {}

    // Fallback: hash string to int for LCG
    var s = String(seedKey || "");
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Games._seededRng(h || 1);
  },

  // Prompt 10: pretty tag names for remediation mini-sets
  _prettyTagNameV2: function(tag) {
    var t = String(tag == null ? "" : tag).trim();
    if (!t) return "";
    var map = {
      articles: "Articles",
      subjectVerb: "Subject–Verb",
      punctuation: "Punctuation",
      contractions: "Contractions",
      tense: "Tense",
      prepositions: "Prepositions"
    };
    if (map[t]) return map[t];

    var spaced = t
      .replace(/[_\-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim();
    if (!spaced) return t;
    return spaced.split(/\s+/).map(function(w) {
      var s = String(w || "");
      return s ? (s.charAt(0).toUpperCase() + s.slice(1)) : "";
    }).join(" ");
  },

  buildTagPracticeSet: function(gameNum, tag, size, rng, candidateQuestions) {
    var g = (gameNum | 0) || 0;
    var t = String(tag == null ? "" : tag).trim();
    var n = Math.max(1, size | 0);
    var pool = Array.isArray(candidateQuestions) ? candidateQuestions : [];
    if (!g || !t || !pool.length) return [];

    var matches = pool.filter(function(q) {
      if (!q || typeof q !== "object") return false;
      var qt = (q.tag != null) ? String(q.tag).trim() : "";
      return qt === t;
    });
    if (!matches.length) return [];

    var r = (typeof rng === "function") ? rng : Math.random;
    var copy = matches.slice();
    try {
      if (typeof rngShuffle === "function") copy = rngShuffle(copy, r);
      else {
        for (var i = copy.length - 1; i > 0; i--) {
          var j = Math.floor(r() * (i + 1));
          var tmp = copy[i];
          copy[i] = copy[j];
          copy[j] = tmp;
        }
      }
    } catch (eS) {}

    return copy.slice(0, Math.min(n, copy.length));
  },

  startTagPracticeFromSummaryV2: function(tag, size) {
    var r = Games.runtime.round;
    if (!r) return;
    if (Games.runtime.mode !== "normal") return;

    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId) || 0;
    if (!((gameNum | 0) === 1 || (gameNum | 0) === 4)) return;

    var t = String(tag == null ? "" : tag).trim();
    if (!t) return;

    var gameType = Games._mapGameNumToType(gameNum);
    var difficulty = (r && typeof r.difficulty === "number") ? (r.difficulty | 0) : ((State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2);
    var desired = Math.max(1, (size | 0) || 8);

    var seedKey = "TAGPRACTICE|" + String(gameNum | 0) + "|" + t + "|" + Games._roundDateKey();
    var rng = Games._rngFromSeedKeyV2(seedKey);

    var fullPool = Games.buildPoolForGameNum(gameNum);
    var candidates = Games._filterPoolForDifficultyV2(fullPool, gameType, difficulty, desired);
    var picked = Games.buildTagPracticeSet(gameNum, t, desired, rng, candidates);
    if (!picked.length) return;

    // Keep the last non-tagPractice summary so we can return to it.
    try {
      if (Games.runtime && Games.runtime._lastRoundSummary) {
        Games.runtime._lastMainRoundSummaryV2 = Games.runtime._lastMainRoundSummaryV2 || Games.runtime._lastRoundSummary;
      }
    } catch (eKeep) {}

    Games.beginRound({
      mode: "normal",
      gameId: r.gameId,
      label: r.label,
      difficulty: difficulty,
      questions: picked,
      onDone: null,
      seed: null,
      unlimitedMode: false,
      sessionContext: {
        gameNum: gameNum | 0,
        mode: "tagPractice",
        tagPractice: { tag: t, size: picked.length },
        seedKey: seedKey
      }
    });

    UI.goTo("screen-play");
  },

  selectBalancedByTag: function(questions, n, rng, opts) {
    if (!Array.isArray(questions)) questions = [];
    var want = Math.max(1, n | 0);
    if (questions.length <= want) return questions.slice();

    var options = (opts && typeof opts === "object") ? opts : {};
    var maxStreak = (typeof options.maxSameTagStreak === "number" && isFinite(options.maxSameTagStreak)) ? (options.maxSameTagStreak | 0) : 1;
    if (maxStreak < 1) maxStreak = 1;
    var allowUntagged = (options.allowUntagged !== false);

    var r = (typeof rng === "function") ? rng : Math.random;

    function shuffle(arr) {
      if (!Array.isArray(arr) || arr.length < 2) return arr;
      try {
        if (typeof rngShuffle === "function") return rngShuffle(arr, r);
      } catch (eS) {}
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(r() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    }

    function effectiveTag(q) {
      var t = (q && q.tag != null) ? String(q.tag) : "";
      t = t.trim();
      if (!t) t = "untagged";
      return t;
    }

    // Group by tag
    var buckets = {};
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (!q) continue;
      var tag = effectiveTag(q);
      if (!allowUntagged && tag === "untagged") continue;
      if (!buckets[tag]) buckets[tag] = [];
      buckets[tag].push(q);
    }

    var tags = Object.keys(buckets);
    if (!tags.length) return questions.slice(0, want);

    // If everything is untagged (or only one tag), fall back to deterministic shuffle.
    if (tags.length === 1 && tags[0] === "untagged") {
      var flat = questions.slice();
      shuffle(flat);
      return flat.slice(0, want);
    }

    // Shuffle buckets and tag order for fairness but deterministic.
    for (var t = 0; t < tags.length; t++) {
      shuffle(buckets[tags[t]]);
    }
    shuffle(tags);

    var out = [];
    var prevTag = null;
    var streak = 0;
    var cursor = 0;

    function remainingTagsCount() {
      var c = 0;
      for (var i = 0; i < tags.length; i++) {
        if (buckets[tags[i]] && buckets[tags[i]].length) c++;
      }
      return c;
    }

    while (out.length < want) {
      var active = remainingTagsCount();
      if (!active) break;

      var pickedTag = null;

      // Prefer a different tag than previous (avoid immediate repeats)
      for (var tries = 0; tries < tags.length; tries++) {
        var idx = (cursor + tries) % tags.length;
        var cand = tags[idx];
        if (!buckets[cand] || !buckets[cand].length) continue;

        var wouldRepeat = (prevTag != null && cand === prevTag);
        var canAvoid = (active > 1);
        var overStreak = wouldRepeat && canAvoid && (streak >= maxStreak);

        if (!overStreak) {
          pickedTag = cand;
          cursor = (idx + 1) % tags.length;
          break;
        }
      }

      // If forced, allow repeats.
      if (!pickedTag) {
        for (var t2 = 0; t2 < tags.length; t2++) {
          var idx2 = (cursor + t2) % tags.length;
          var cand2 = tags[idx2];
          if (buckets[cand2] && buckets[cand2].length) {
            pickedTag = cand2;
            cursor = (idx2 + 1) % tags.length;
            break;
          }
        }
      }

      if (!pickedTag) break;
      var qPick = buckets[pickedTag].shift();
      if (!qPick) continue;
      out.push(qPick);

      if (prevTag === pickedTag) streak += 1;
      else { prevTag = pickedTag; streak = 1; }
    }

    // Fill shortfall (rare) from remaining questions, shuffled.
    if (out.length < want) {
      var remaining = [];
      for (var k = 0; k < tags.length; k++) {
        var bk = buckets[tags[k]];
        if (bk && bk.length) {
          for (var x = 0; x < bk.length; x++) remaining.push(bk[x]);
        }
      }
      shuffle(remaining);
      for (var z = 0; z < remaining.length && out.length < want; z++) out.push(remaining[z]);
    }

    return out;
  },

  _filterPoolForDifficultyV2: function(pool, gameType, difficulty, wantCount) {
    if (!Array.isArray(pool)) pool = [];
    var d = Math.max(1, Math.min(3, difficulty | 0));

    // Game 1 uses inferred difficulty by token length.
    if (gameType === "tapWord") {
      var filtered = pool.filter(function(q) {
        if (!q || !Array.isArray(q.tokens)) return false;
        if (d === 1) return q.tokens.length <= 5;
        if (d === 2) return q.tokens.length <= 8;
        return true;
      });
      if (filtered.length) return filtered;
      return pool.slice();
    }

    // Game 4 currently does not have a strict authored difficulty filter; keep as-is.
    return pool.slice();
  },

  _selectRoundQuestionsV2: function(pool, gameNum, gameType, difficulty, count, batchIndex) {
    if (!Array.isArray(pool)) pool = [];
    var n = Math.max(1, count | 0);

    // Only Games 1 & 4: tag-aware balancing + anti-streak.
    if ((gameNum | 0) === 1 || (gameNum | 0) === 4) {
      var candidates = Games._filterPoolForDifficultyV2(pool, gameType, difficulty, n);
      if (!candidates.length) candidates = pool.slice();
      if (candidates.length <= n) return candidates.slice();

      // Detect whether any meaningful tags exist.
      var hasRealTags = false;
      var seen = {};
      for (var i = 0; i < candidates.length; i++) {
        var q = candidates[i];
        if (!q) continue;
        var t = (q.tag != null) ? String(q.tag).trim() : "";
        if (!t) t = "untagged";
        seen[t] = true;
        if (t !== "untagged") hasRealTags = true;
        if (hasRealTags) break;
      }

      var seedKey = Games._roundSeedKeyV2(gameNum, "normal", difficulty, batchIndex);
      var rng = Games._rngFromSeedKeyV2(seedKey);

      if (hasRealTags) {
        return Games.selectBalancedByTag(candidates, n, rng, { maxSameTagStreak: 1, allowUntagged: true, fallbackShuffle: true });
      }

      // No tags: fall back to existing random selection (but deterministic for stability).
      return Games.selectQuestions(candidates, gameType, difficulty, n, true, (typeof hashSeed === "function") ? hashSeed(seedKey) : 1);
    }

    // Other games: unchanged.
    return (gameType === "tense")
      ? Games.selectQuestionsTenseRamped(pool, difficulty, n, false, null)
      : Games.selectQuestions(pool, gameType, difficulty, n, false, null);
  },

  startGame: function(gameNum, options) {
    var gameType = Games._mapGameNumToType(gameNum);
    if (!gameType) return;

    var opts = (options && typeof options === "object") ? options : {};
    var forcedDifficulty = (typeof opts.forcedDifficulty === "number" && isFinite(opts.forcedDifficulty))
      ? (opts.forcedDifficulty | 0)
      : null;
    if (forcedDifficulty != null) forcedDifficulty = Math.max(1, Math.min(3, forcedDifficulty));

    // Game 10: Beam Training (clashStability) is a single-player wrapper engine
    // and does not consume the question banks yet.
    if (gameType === "clashStability") {
      return Games._startClashStability(gameNum, forcedDifficulty);
    }

    // Game 11: Maze Trace has a dedicated runtime flow.
    if (gameType === "mazeTraceQuest") {
      return Games._startMaze11(gameNum, forcedDifficulty);
    }

    var key = Games._getGameKey(gameNum);
    var entry = Games._getPlayHomeEntry(gameNum);
    Games.currentGameType = gameNum;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;

    Games.currentGameBest = 0;

    State.state.session.currentGameId = key;
    State.save();

    var pool = Games.buildPoolForGameNum(gameNum);
    var difficulty = (forcedDifficulty != null)
      ? forcedDifficulty
      : ((State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2);
    var selected = null;

    // Unlimited practice: run in batches of 20 (player is prompted every 20).
    var batchSize = 20;
    var desiredCount = batchSize;

    selected = Games._selectRoundQuestionsV2(pool, gameNum, gameType, difficulty, desiredCount, 0);

    // Gentle ramp: reorder only (do not change which questions were selected)
    selected = Games._applyGentleRampOrdering(selected, gameNum);

    Games.beginRound({
      mode: "normal",
      gameId: key,
      label: (entry && entry.title) ? entry.title : Games.defaultLabelForGameType(gameType),
      difficulty: difficulty,
      questions: selected,
      onDone: null,
      seed: null,
      unlimitedMode: true,
      checkpointEvery: batchSize,
      batchSize: batchSize,
      sourcePool: pool,
      sourceGameNum: gameNum,
      sourceGameType: gameType
    });

    UI.goTo("screen-play");
  },

  _maze11SetTrackText: function() {
    var round = Games.runtime && Games.runtime.round;
    var m = Games.runtime && Games.runtime.maze11;
    var diffLabel = Games._difficultyLabel((round && round.difficulty) || 2);
    var profile = m && m.difficultyProfile;
    var moodEn = "Balanced";
    var moodPa = "ਸੰਤੁਲਿਤ";
    if (profile && profile.id === 1) {
      moodEn = "Gentle";
      moodPa = "ਸੌਖਾ";
    } else if (profile && profile.id === 3) {
      moodEn = "Intense";
      moodPa = "ਤੀਖਾ";
    }

    var tr = document.getElementById("play-track-label");
    if (tr) tr.textContent = "Track: Focus • Basics | ਟਰੈਕ: ਧਿਆਨ • ਬੇਸਿਕ • " + diffLabel + " (" + moodEn + " | " + moodPa + ")";
    var goal = document.getElementById("play-goal-line");
    if (goal) goal.textContent = "Goal: Clear all mazes in a set before energy runs out. | ਲੱਖਯ: ਊਰਜਾ ਖਤਮ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਸੈੱਟ ਦੀਆਂ ਸਭ ਭੁਲਭੁਲਈਆਂ ਪੂਰੀਆਂ ਕਰੋ।";
    var ex = document.getElementById("play-example-line");
    if (ex) ex.textContent = "Tip: Maze + quiz both scale with difficulty. | ਸੁਝਾਅ: ਭੁਲਭੁਲਈ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦੋਵੇਂ ਮੁਸ਼ਕਲਤਾ ਨਾਲ ਬਦਲਦੇ ਹਨ।";
  },

  _maze11GetDifficultyProfile: function(difficulty) {
    var d = Math.max(1, Math.min(3, difficulty | 0));
    if (d === 1) {
      return {
        id: 1,
        setIndexes: [0],
        energyMultiplier: 1.2,
        baseDrainPerSec: 1.0,
        wallHitPenalty: 2.2,
        questionTierMin: 1,
        questionTierMax: 2,
        preferredQuestionTier: 1
      };
    }
    if (d === 3) {
      return {
        id: 3,
        setIndexes: [1, 2],
        energyMultiplier: 0.9,
        baseDrainPerSec: 1.95,
        wallHitPenalty: 4.6,
        questionTierMin: 2,
        questionTierMax: 3,
        preferredQuestionTier: 3
      };
    }
    return {
      id: 2,
      setIndexes: [0, 1],
      energyMultiplier: 1.0,
      baseDrainPerSec: 1.4,
      wallHitPenalty: 3.2,
      questionTierMin: 1,
      questionTierMax: 3,
      preferredQuestionTier: 2
    };
  },

  _maze11QuestionTierFromId: function(questionId) {
    var idText = String(questionId || "");
    var m = idText.match(/(?:^|_)(\d+)$/);
    var n = m ? parseInt(m[1], 10) : NaN;
    if (!isFinite(n) || n <= 0) return 2;
    if (n <= 32) return 1;
    if (n <= 64) return 2;
    return 3;
  },

  _maze11SetTierFromSourceIndex: function(sourceIndex) {
    var n = sourceIndex | 0;
    if (n <= 1) return 1;
    if (n === 2) return 2;
    return 3;
  },

  _maze11ShuffleArray: function(arr) {
    var out = Array.isArray(arr) ? arr.slice() : [];
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i];
      out[i] = out[j];
      out[j] = t;
    }
    return out;
  },

  _maze11ParseMaze: function(mazeDef) {
    var grid = (mazeDef && Array.isArray(mazeDef.grid)) ? mazeDef.grid.slice() : [];
    var rows = grid.length;
    var cols = rows ? String(grid[0] || "").length : 0;
    var start = null;
    var end = null;
    for (var y = 0; y < rows; y++) {
      var row = String(grid[y] || "");
      for (var x = 0; x < cols; x++) {
        var ch = row.charAt(x);
        if (ch === "S") start = { x: x, y: y };
        if (ch === "E") end = { x: x, y: y };
      }
    }
    if (!start) start = { x: 1, y: 1 };
    if (!end) end = { x: Math.max(1, cols - 2), y: Math.max(1, rows - 2) };
    return {
      id: String((mazeDef && mazeDef.id) || "maze"),
      topic: String((mazeDef && mazeDef.topic) || "basics"),
      grid: grid,
      rows: rows,
      cols: cols,
      start: start,
      end: end
    };
  },

  _maze11PickQuestion: function(topic) {
    var all = (typeof GAME11_BEGINNER_QUESTIONS !== "undefined" && Array.isArray(GAME11_BEGINNER_QUESTIONS)) ? GAME11_BEGINNER_QUESTIONS : [];
    if (!all.length) return null;

    var m = Games.runtime && Games.runtime.maze11;
    var t = String(topic || "");
    var pool = [];
    for (var i = 0; i < all.length; i++) {
      if (String(all[i] && all[i].topic || "") === t) pool.push(all[i]);
    }
    if (!pool.length) pool = all;

    var key = t || "_all";
    if (m && (!m.questionUsageById || typeof m.questionUsageById !== "object")) m.questionUsageById = {};
    if (m && (!m.questionRecentByTopic || typeof m.questionRecentByTopic !== "object")) m.questionRecentByTopic = {};
    if (m && (!m.questionRecentCorrectByTopic || typeof m.questionRecentCorrectByTopic !== "object")) m.questionRecentCorrectByTopic = {};

    var recentIds = (m && m.questionRecentByTopic && Array.isArray(m.questionRecentByTopic[key])) ? m.questionRecentByTopic[key] : [];
    var recentCorrect = (m && m.questionRecentCorrectByTopic && Array.isArray(m.questionRecentCorrectByTopic[key])) ? m.questionRecentCorrectByTopic[key] : [];

    var tierMin = (m && typeof m.questionTierMin === "number") ? (m.questionTierMin | 0) : 1;
    var tierMax = (m && typeof m.questionTierMax === "number") ? (m.questionTierMax | 0) : 3;
    if (tierMin < 1) tierMin = 1;
    if (tierMax > 3) tierMax = 3;
    if (tierMax < tierMin) tierMax = tierMin;

    var preferredTier = (m && typeof m.preferredQuestionTier === "number") ? (m.preferredQuestionTier | 0) : 2;
    var setTier = (m && typeof m.currentSetQuestionTier === "number") ? (m.currentSetQuestionTier | 0) : preferredTier;
    if (setTier < 1) setTier = 1;
    if (setTier > 3) setTier = 3;
    preferredTier = Math.round((preferredTier + setTier) / 2);
    if (preferredTier < tierMin) preferredTier = tierMin;
    if (preferredTier > tierMax) preferredTier = tierMax;

    function buildCandidates(enforceRecentId, enforceRecentCorrect) {
      var out = [];
      var minScore = Number.POSITIVE_INFINITY;
      for (var pi = 0; pi < pool.length; pi++) {
        var qq = pool[pi];
        if (!qq) continue;
        var qid = String(qq.id || (key + "_" + String(pi)));
        var qTier = Games._maze11QuestionTierFromId(qid);
        if (qTier < tierMin || qTier > tierMax) continue;
        var qAns = "";
        if (Array.isArray(qq.choicesEn)) {
          var ai = qq.answerIndex | 0;
          if (ai >= 0 && ai < qq.choicesEn.length) qAns = String(qq.choicesEn[ai] || "").toLowerCase();
        }

        if (enforceRecentId && recentIds.indexOf(qid) !== -1) continue;
        if (enforceRecentCorrect && qAns && recentCorrect.indexOf(qAns) !== -1) continue;

        var used = (m && m.questionUsageById && typeof m.questionUsageById[qid] === "number") ? (m.questionUsageById[qid] | 0) : 0;
        var tierPenalty = Math.abs(qTier - preferredTier);
        var score = used * 10 + tierPenalty;
        if (score < minScore) {
          minScore = score;
          out = [{ q: qq, id: qid, ans: qAns }];
        } else if (score === minScore) {
          out.push({ q: qq, id: qid, ans: qAns });
        }
      }
      return out;
    }

    var candidates = buildCandidates(true, true);
    if (!candidates.length) candidates = buildCandidates(true, false);
    if (!candidates.length) candidates = buildCandidates(false, true);
    if (!candidates.length) candidates = buildCandidates(false, false);

    if (!candidates.length) return null;

    var picked = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
    var raw = picked ? picked.q : null;
    if (!raw) return null;

    if (m && m.questionUsageById) {
      var uid = String(picked.id || raw.id || "");
      if (uid) m.questionUsageById[uid] = ((m.questionUsageById[uid] | 0) + 1);
    }

    if (m && m.questionRecentByTopic) {
      if (!Array.isArray(m.questionRecentByTopic[key])) m.questionRecentByTopic[key] = [];
      m.questionRecentByTopic[key].push(String(picked.id || raw.id || ""));
      if (m.questionRecentByTopic[key].length > 5) m.questionRecentByTopic[key].shift();
    }

    if (m && m.questionRecentCorrectByTopic) {
      if (!Array.isArray(m.questionRecentCorrectByTopic[key])) m.questionRecentCorrectByTopic[key] = [];
      var ansK = String(picked.ans || "").toLowerCase();
      if (ansK) {
        m.questionRecentCorrectByTopic[key].push(ansK);
        if (m.questionRecentCorrectByTopic[key].length > 4) m.questionRecentCorrectByTopic[key].shift();
      }
    }

    var choicesEn = Array.isArray(raw.choicesEn) ? raw.choicesEn.slice() : [];
    var choicesPa = Array.isArray(raw.choicesPa) ? raw.choicesPa.slice() : [];
    var answerIndex = (raw.answerIndex | 0);
    var order = [];
    for (var oi = 0; oi < choicesEn.length; oi++) order.push(oi);
    order = Games._maze11ShuffleArray(order);

    var shuffledEn = [];
    var shuffledPa = [];
    var shuffledAnswerIndex = 0;
    for (var si = 0; si < order.length; si++) {
      var src = order[si] | 0;
      shuffledEn.push(String(choicesEn[src] || ""));
      shuffledPa.push(String(choicesPa[src] || ""));
      if (src === answerIndex) shuffledAnswerIndex = si;
    }

    return {
      id: String(raw.id || ""),
      topic: String(raw.topic || ""),
      promptEn: String(raw.promptEn || ""),
      promptPa: String(raw.promptPa || ""),
      choicesEn: shuffledEn,
      choicesPa: shuffledPa,
      answerIndex: shuffledAnswerIndex,
      trackId: String(raw.trackId || "T_WORDS")
    };
  },

  _maze11GetCellAt: function(maze, px, py) {
    if (!maze || !maze.rows || !maze.cols) return "#";
    var cx = Math.floor(px);
    var cy = Math.floor(py);
    if (cx < 0 || cy < 0 || cx >= maze.cols || cy >= maze.rows) return "#";
    var row = String(maze.grid[cy] || "");
    var ch = row.charAt(cx);
    if (!ch) return "#";
    return ch;
  },

  _maze11IsWall: function(ch) {
    return String(ch || "#") === "#";
  },

  _maze11RenderScene: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || !m.canvas || !m.ctx || !m.currentMaze) return;
    var maze = m.currentMaze;
    var ctx = m.ctx;
    var canvas = m.canvas;
    var W = canvas.width;
    var H = canvas.height;
    var cellW = W / maze.cols;
    var cellH = H / maze.rows;

    var cs = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, W, H);

    var bgTop = cs.getPropertyValue("--primary-50").trim() || "#f3f7ff";
    var bgBottom = cs.getPropertyValue("--surface").trim() || "#ffffff";
    var bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, bgTop);
    bgGrad.addColorStop(1, bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    var wallColor = cs.getPropertyValue("--border").trim() || "#e7e2d8";
    var pathColor = cs.getPropertyValue("--surface-2").trim() || "#fff7ed";
    var startColor = cs.getPropertyValue("--success").trim() || "#16a34a";
    var endColor = cs.getPropertyValue("--accent").trim() || "#f97316";
    var playerColor = cs.getPropertyValue("--primary").trim() || "#0050a8";
    var lineColor = cs.getPropertyValue("--border").trim() || "#e7e2d8";

    for (var y = 0; y < maze.rows; y++) {
      var row = String(maze.grid[y] || "");
      for (var x = 0; x < maze.cols; x++) {
        var ch = row.charAt(x) || "#";
        if (ch === "#") ctx.fillStyle = wallColor;
        else ctx.fillStyle = pathColor;
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
      }
    }

    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    for (var gx = 0; gx <= maze.cols; gx++) {
      var px = gx * cellW + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, H);
      ctx.stroke();
    }
    for (var gy = 0; gy <= maze.rows; gy++) {
      var py = gy * cellH + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(W, py);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = startColor;
    ctx.fillRect(maze.start.x * cellW, maze.start.y * cellH, cellW, cellH);

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold " + String(Math.max(10, Math.floor(Math.min(cellW, cellH) * 0.45))) + "px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", (maze.start.x + 0.5) * cellW, (maze.start.y + 0.5) * cellH);
    ctx.restore();

    var pulse = 0.78 + 0.22 * Math.sin(Date.now() / 220);
    var endCx = (maze.end.x + 0.5) * cellW;
    var endCy = (maze.end.y + 0.5) * cellH;
    var glowR = Math.max(8, Math.min(cellW, cellH) * (0.52 + 0.18 * pulse));
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = endColor;
    ctx.beginPath();
    ctx.arc(endCx, endCy, glowR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = endColor;
    ctx.fillRect(maze.end.x * cellW, maze.end.y * cellH, cellW, cellH);

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold " + String(Math.max(10, Math.floor(Math.min(cellW, cellH) * 0.45))) + "px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", endCx, endCy);
    ctx.restore();

    var pr = Math.max(6, Math.min(cellW, cellH) * 0.3);
    var pCx = m.player.x * cellW;
    var pCy = m.player.y * cellH;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(pCx, pCy, pr + 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.arc(pCx, pCy, pr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    var eyeR = Math.max(1.2, pr * 0.16);
    ctx.beginPath();
    ctx.arc(pCx - pr * 0.26, pCy - pr * 0.14, eyeR, 0, Math.PI * 2);
    ctx.arc(pCx + pr * 0.26, pCy - pr * 0.14, eyeR, 0, Math.PI * 2);
    ctx.fill();
  },

  _maze11RefreshEnergyUi: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m) return;
    var fill = document.getElementById("maze11-energy-fill");
    var txt = document.getElementById("maze11-energy-text");
    var pct = (m.maxEnergy > 0) ? Math.max(0, Math.min(100, Math.round((m.energy / m.maxEnergy) * 100))) : 0;
    if (fill) fill.style.width = String(pct) + "%";
    if (fill) {
      var lvl = (pct <= 25) ? "low" : ((pct <= 55) ? "mid" : "high");
      fill.setAttribute("data-level", lvl);
    }
    if (txt) txt.textContent = "⚡ Energy ਊਰਜਾ: " + String(Math.max(0, Math.round(m.energy))) + "%";
  },

  _maze11FailSet: function(reasonText) {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m) return;
    Games._maze11StopLoop();
    var fb = document.getElementById("play-feedback");
    if (fb) fb.textContent = String(reasonText || "Oops! Let’s try this set again. | ਓਹੋ! ਆਓ ਇਹ ਸੈੱਟ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੀਏ।");

    m.phase = "resetting";
    setTimeout(function() {
      var now = Games.runtime && Games.runtime.maze11;
      if (!now) return;
      now.mazeIndex = 0;
      now.energy = now.maxEnergy;
      Games._maze11LoadCurrentMaze();
      Games._maze11Render();
    }, 900);
  },

  _maze11HandleMazeComplete: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m) return;
    Games._maze11StopLoop();
    m.phase = "quiz";
    m.quizLocked = false;
    m.nextAction = null;
    m.currentQuestion = Games._maze11PickQuestion(m.currentMaze && m.currentMaze.topic);
    Games._maze11Render();
  },

  _maze11ContinueFromQuiz: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || m.phase !== "quiz" || !m.nextAction) return;

    var action = String(m.nextAction || "");
    m.nextAction = null;

    if (action === "restart_set") {
      Games._maze11FailSet("Wrong answer. Restarting set... | ਗਲਤ ਜਵਾਬ। ਸੈੱਟ ਮੁੜ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...");
      return;
    }

    if (action !== "advance_maze") return;

    m.mazeIndex += 1;
    if (m.mazeIndex >= m.currentSet.mazes.length) {
      m.setIndex += 1;
      if (m.setIndex >= m.sets.length) {
        Games._maze11FinishGame();
        return;
      }
      m.currentSet = m.sets[m.setIndex];
      m.maxEnergy = (m.currentSet && m.currentSet.maxEnergy) ? (m.currentSet.maxEnergy | 0) : 100;
      m.energy = m.maxEnergy;
      m.mazeIndex = 0;
      m.currentSetQuestionTier = Games._maze11SetTierFromSourceIndex((m.currentSet && m.currentSet._sourceSetIndex) || ((m.setIndex | 0) + 1));
      try {
        if (State && typeof State.awardXP === "function") {
          State.awardXP(5, { trackId: "T_WORDS", reason: "game11_set_complete" }, { section: "games", reason: "game11_set_complete" });
        }
      } catch (e2) {}
    }

    Games._maze11LoadCurrentMaze();
    Games._maze11Render();
  },

  _maze11SubmitQuiz: function(choiceIndex) {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || m.phase !== "quiz" || !m.currentQuestion || m.quizLocked) return;
    m.quizLocked = true;

    var q = m.currentQuestion;
    var isCorrect = (choiceIndex | 0) === (q.answerIndex | 0);
    var trackId = String(q.trackId || "T_WORDS");

    var optionsWrap = document.getElementById("play-options");
    var btns = optionsWrap ? optionsWrap.querySelectorAll(".maze11-option") : null;
    if (btns && btns.length) {
      for (var bi = 0; bi < btns.length; bi++) {
        var btn = btns[bi];
        btn.disabled = true;
        try { btn.setAttribute("aria-disabled", "true"); } catch (eAD) {}
        if ((bi | 0) === (q.answerIndex | 0)) {
          try { btn.classList.add("is-correct"); } catch (eC) {}
        }
      }
      if (!isCorrect && (choiceIndex | 0) >= 0 && (choiceIndex | 0) < btns.length) {
        try { btns[choiceIndex | 0].classList.add("is-wrong"); } catch (eW) {}
      }
    }

    var fb0 = document.getElementById("play-feedback");

    try {
      if (State && typeof State.recordQuestionAttempt === "function") {
        State.recordQuestionAttempt(trackId, !!isCorrect);
      }
    } catch (e0) {}

    if (!isCorrect) {
      if (fb0) {
        var rightEn = (Array.isArray(q.choicesEn) && q.choicesEn[q.answerIndex | 0]) ? String(q.choicesEn[q.answerIndex | 0]) : "";
        var rightPa = (Array.isArray(q.choicesPa) && q.choicesPa[q.answerIndex | 0]) ? String(q.choicesPa[q.answerIndex | 0]) : "";
        fb0.textContent = "❌ Not correct. Correct answer: " + rightEn + (rightPa ? (" (" + rightPa + ")") : "") + ". Press Continue. | ❌ ਇਹ ਸਹੀ ਨਹੀਂ। ਸਹੀ ਜਵਾਬ: " + (rightPa || rightEn) + "। ਜਾਰੀ ਰੱਖੋ ਬਟਨ ਦਬਾਓ।";
      }
      m.nextAction = "restart_set";
      if (optionsWrap) {
        var btnWrong = document.createElement("button");
        btnWrong.type = "button";
        btnWrong.className = "btn";
        btnWrong.textContent = "Continue | ਜਾਰੀ ਰੱਖੋ";
        btnWrong.addEventListener("click", function() {
          btnWrong.disabled = true;
          Games._maze11ContinueFromQuiz();
        });
        optionsWrap.appendChild(btnWrong);
      }
      return;
    }

    if (fb0) fb0.textContent = "✅ Correct! Press Continue for next maze. | ✅ ਸਹੀ! ਅਗਲੀ ਭੁਲਭੁਲਈ ਲਈ ਜਾਰੀ ਰੱਖੋ ਦਬਾਓ।";

    try {
      if (State && typeof State.awardXP === "function") {
        State.awardXP(3, { trackId: trackId, reason: "game11_maze_quiz_correct" }, { section: "games", reason: "game11_maze_quiz_correct" });
      }
    } catch (e1) {}

    Games.currentGameScore = (Games.currentGameScore | 0) + 1;
    Games.currentGameStreak = (Games.currentGameStreak | 0) + 1;
    if ((Games.currentGameStreak | 0) > (Games.currentGameBest | 0)) Games.currentGameBest = Games.currentGameStreak | 0;
    Games.updateScoreUI();

    m.nextAction = "advance_maze";
    if (optionsWrap) {
      var btnNext = document.createElement("button");
      btnNext.type = "button";
      btnNext.className = "btn";
      btnNext.textContent = "Continue | ਜਾਰੀ ਰੱਖੋ";
      btnNext.addEventListener("click", function() {
        btnNext.disabled = true;
        Games._maze11ContinueFromQuiz();
      });
      optionsWrap.appendChild(btnNext);
    }
  },

  _maze11FinishGame: function() {
    var r = Games.runtime.round;
    if (!r) return;
    r.completed = true;
    Games.runtime.correctCount = Games.currentGameScore | 0;
    Games.runtime.totalCount = Math.max(1, Games.currentGameScore | 0);
    Games.runtime.submitted = true;
    var fb = document.getElementById("play-feedback");
    if (fb) fb.textContent = "Amazing! You finished all maze sets. 🌟 | ਸ਼ਾਬਾਸ਼! ਤੁਸੀਂ ਸਾਰੇ ਭੁਲਭੁਲਈ ਸੈੱਟ ਪੂਰੇ ਕਰ ਲਏ। 🌟";
    Games.showCompletionPanel();
  },

  _maze11LoadCurrentMaze: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || !m.currentSet || !Array.isArray(m.currentSet.mazes)) return;
    var rawMaze = m.currentSet.mazes[m.mazeIndex];
    m.currentMaze = Games._maze11ParseMaze(rawMaze);
    m.currentSetQuestionTier = Games._maze11SetTierFromSourceIndex((m.currentSet && m.currentSet._sourceSetIndex) || ((m.setIndex | 0) + 1));
    var start = m.currentMaze.start;
    m.player = { x: start.x + 0.5, y: start.y + 0.5 };
    m.pointerActive = false;
    m.phase = "maze";
    m.lastTickMs = Date.now();
  },

  _maze11StopLoop: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m) return;
    if (m.rafId) cancelAnimationFrame(m.rafId);
    m.rafId = 0;
  },

  _maze11StartLoop: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || m.rafId || m.phase !== "maze") return;
    function tick() {
      var s = Games.runtime && Games.runtime.maze11;
      if (!s || s.phase !== "maze") return;
      var now = Date.now();
      var dt = Math.max(0, (now - (s.lastTickMs || now)) / 1000);
      s.lastTickMs = now;
      s.energy -= (s.baseDrainPerSec * dt);
      if (s.energy <= 0) {
        s.energy = 0;
        Games._maze11RefreshEnergyUi();
        Games._maze11RenderScene();
        Games._maze11FailSet("Out of energy. Restarting set... | ਊਰਜਾ ਖਤਮ। ਸੈੱਟ ਮੁੜ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...");
        return;
      }
      Games._maze11RefreshEnergyUi();
      Games._maze11RenderScene();
      s.rafId = requestAnimationFrame(tick);
    }
    m.rafId = requestAnimationFrame(tick);
  },

  _maze11BindCanvas: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m || !m.canvas || m.bound) return;
    var canvas = m.canvas;

    function getPoint(ev) {
      var rect = canvas.getBoundingClientRect();
      var nx = (ev.clientX - rect.left) / Math.max(1, rect.width);
      var ny = (ev.clientY - rect.top) / Math.max(1, rect.height);
      return {
        x: nx * m.currentMaze.cols,
        y: ny * m.currentMaze.rows
      };
    }

    function onDown(ev) {
      if (!m || m.phase !== "maze") return;
      var pt = getPoint(ev);
      var sx = m.currentMaze.start.x + 0.5;
      var sy = m.currentMaze.start.y + 0.5;
      var dx = pt.x - sx;
      var dy = pt.y - sy;
      if (Math.sqrt(dx * dx + dy * dy) > 0.8) return;
      m.pointerActive = true;
      m.player.x = sx;
      m.player.y = sy;
      try { canvas.setPointerCapture(ev.pointerId); } catch (e0) {}
      Games._maze11StartLoop();
      Games._maze11RenderScene();
    }

    function onMove(ev) {
      if (!m || !m.pointerActive || m.phase !== "maze") return;
      var pt = getPoint(ev);
      if (pt.x < 0 || pt.y < 0 || pt.x >= m.currentMaze.cols || pt.y >= m.currentMaze.rows) {
        Games._maze11FailSet("Touched the edge. Restarting set... | ਕਿਨਾਰੇ ਨੂੰ ਛੂਹਿਆ। ਸੈੱਟ ਮੁੜ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...");
        return;
      }

      var ch = Games._maze11GetCellAt(m.currentMaze, pt.x, pt.y);
      var isWall = Games._maze11IsWall(ch);
      var speedFactor = isWall ? 0.22 : 0.65;
      m.player.x += (pt.x - m.player.x) * speedFactor;
      m.player.y += (pt.y - m.player.y) * speedFactor;

      var ch2 = Games._maze11GetCellAt(m.currentMaze, m.player.x, m.player.y);
      if (Games._maze11IsWall(ch2)) {
        m.energy -= m.wallHitPenalty;
        if (m.energy <= 0) {
          m.energy = 0;
          Games._maze11RefreshEnergyUi();
          Games._maze11RenderScene();
          Games._maze11FailSet("Out of energy. Restarting set... | ਊਰਜਾ ਖਤਮ। ਸੈੱਟ ਮੁੜ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ...");
          return;
        }
      }

      var ex = m.currentMaze.end.x + 0.5;
      var ey = m.currentMaze.end.y + 0.5;
      var ddx = m.player.x - ex;
      var ddy = m.player.y - ey;
      if (Math.sqrt(ddx * ddx + ddy * ddy) <= 0.45) {
        Games._maze11HandleMazeComplete();
        return;
      }

      Games._maze11RefreshEnergyUi();
      Games._maze11RenderScene();
    }

    function onUp() {
      if (!m) return;
      m.pointerActive = false;
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    m.unbindCanvas = function() {
      try { canvas.removeEventListener("pointerdown", onDown); } catch (e1) {}
      try { canvas.removeEventListener("pointermove", onMove); } catch (e2) {}
      try { canvas.removeEventListener("pointerup", onUp); } catch (e3) {}
      try { canvas.removeEventListener("pointercancel", onUp); } catch (e4) {}
    };

    m.bound = true;
  },

  _maze11Render: function() {
    var r = Games.runtime.round;
    var m = Games.runtime && Games.runtime.maze11;
    if (!r || !m) return;

    var labelEl = document.getElementById("play-game-label");
    if (labelEl) {
      var mazeTotal = m.currentSet && m.currentSet.mazes ? m.currentSet.mazes.length : 0;
      labelEl.textContent = "Game 11: Maze Trace | ਗੇਮ 11: ਮਿਜ਼ ਟ੍ਰੇਸ • Set ਸੈੱਟ " + String((m.setIndex | 0) + 1) + "/" + String(m.sets.length) + " • Maze ਭੁਲਭੁਲਈ " + String((m.mazeIndex | 0) + 1) + "/" + String(mazeTotal);
    }
    try {
      var titleElV2 = document.getElementById("play-status-title");
      if (titleElV2) titleElV2.textContent = "Maze Trace";
      var progElV2 = document.getElementById("play-status-progress-text");
      if (progElV2) {
        var mt = m.currentSet && m.currentSet.mazes ? m.currentSet.mazes.length : 0;
        progElV2.textContent = "Set " + String((m.setIndex | 0) + 1) + "/" + String(m.sets.length) + " • Maze " + String((m.mazeIndex | 0) + 1) + "/" + String(mt);
      }
    } catch (eTitle11) {}
    Games._maze11SetTrackText();

    var nextRow = document.getElementById("play-next-row");
    if (nextRow) nextRow.style.display = "none";

    var qTextEl = document.getElementById("play-question-text");
    var optionsEl = document.getElementById("play-options");
    var feedbackEl = document.getElementById("play-feedback");
    if (!qTextEl || !optionsEl) return;

    if (m.phase === "maze") {
      qTextEl.innerHTML = "" +
        '<div class="maze11-wrap">' +
          '<div class="maze11-topline"><span class="maze11-en">Guide your dot from <strong>Start</strong> to <strong>Star Exit</strong>. Touching walls costs energy.</span><span class="maze11-pa">ਆਪਣੇ ਡਾਟ ਨੂੰ <strong>ਸ਼ੁਰੂ</strong> ਤੋਂ <strong>ਸਟਾਰ ਐਗਜ਼ਿਟ</strong> ਤੱਕ ਲਿਜਾਓ। ਦਿਵਾਰ ਨੂੰ ਛੂਹਣ ਨਾਲ ਊਰਜਾ ਘਟਦੀ ਹੈ।</span></div>' +
          '<div class="maze11-energy"><div id="maze11-energy-fill" class="maze11-energy-fill"></div></div>' +
          '<div id="maze11-energy-text" class="maze11-energy-text">Energy: 100%</div>' +
          '<div class="maze11-legend"><span class="maze11-chip maze11-chip-start">S Start | ਸ਼ੁਰੂ</span><span class="maze11-chip maze11-chip-end">★ Exit | ਬਾਹਰ</span></div>' +
          '<canvas id="maze11-canvas" class="maze11-canvas" width="336" height="240" aria-label="Maze"></canvas>' +
        '</div>';
      optionsEl.innerHTML = "";
      if (feedbackEl) feedbackEl.textContent = "Trace smoothly to save energy. | ਊਰਜਾ ਬਚਾਉਣ ਲਈ ਨਰਮੀ ਨਾਲ ਟ੍ਰੇਸ ਕਰੋ।";

      m.canvas = document.getElementById("maze11-canvas");
      m.ctx = m.canvas ? m.canvas.getContext("2d") : null;
      if (m.canvas && m.currentMaze) {
        var holderW = 0;
        try {
          var parent = m.canvas.parentElement;
          holderW = parent ? (parent.clientWidth | 0) : 0;
        } catch (eCW) {
          holderW = 0;
        }
        if (!(holderW > 0)) holderW = 336;
        var targetW = Math.max(280, holderW - 2);
        var ratio = (m.currentMaze && m.currentMaze.cols > 0) ? (m.currentMaze.rows / m.currentMaze.cols) : (240 / 336);
        var targetH = Math.max(200, Math.round(targetW * ratio));
        m.canvas.width = targetW;
        m.canvas.height = targetH;
      }
      m.bound = false;
      Games._maze11BindCanvas();
      Games._maze11RefreshEnergyUi();
      Games._maze11RenderScene();
      Games._maze11StartLoop();
      return;
    }

    if (m.phase === "quiz" && m.currentQuestion) {
      var q = m.currentQuestion;
      qTextEl.innerHTML = '<div class="maze11-quiz-title">Great trace! Quick brain check: | ਵਧੀਆ ਟ੍ਰੇਸ! ਛੋਟੀ ਸਮਝ ਪੜਤਾਲ:</div><div class="maze11-quiz-prompt"><span class="maze11-en">' + String(q.promptEn || "") + '</span><span class="maze11-pa">' + String(q.promptPa || "") + '</span></div>';
      optionsEl.innerHTML = "";

      var choices = Array.isArray(q.choicesEn) ? q.choicesEn : [];
      var choicesPa = Array.isArray(q.choicesPa) ? q.choicesPa : [];
      for (var i = 0; i < choices.length; i++) {
        (function(idx) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "btn btn-secondary maze11-option";
          b.innerHTML = '<span class="maze11-en">' + String(choices[idx] || "") + '</span><span class="maze11-pa">' + String(choicesPa[idx] || "") + '</span>';
          b.addEventListener("click", function() {
            Games._maze11SubmitQuiz(idx);
          });
          optionsEl.appendChild(b);
        })(i);
      }
      if (feedbackEl) feedbackEl.textContent = "";
    }
  },

  _maze11Teardown: function() {
    var m = Games.runtime && Games.runtime.maze11;
    if (!m) return;
    Games._maze11StopLoop();
    try { if (typeof m.unbindCanvas === "function") m.unbindCanvas(); } catch (e0) {}
    Games.runtime.maze11 = null;

    var nextRow = document.getElementById("play-next-row");
    if (nextRow) nextRow.style.display = "";
  },

  _startMaze11: function(gameNum, forcedDifficulty) {
    var allSets = (typeof GAME11_MAZE_SETS !== "undefined" && Array.isArray(GAME11_MAZE_SETS)) ? GAME11_MAZE_SETS : [];
    if (!allSets.length) {
      try { if (window.UI && typeof UI.showToast === "function") UI.showToast("Maze data is missing.", 2400); } catch (e0) {}
      return;
    }

    var selectedDifficulty = (typeof forcedDifficulty === "number" && isFinite(forcedDifficulty))
      ? (forcedDifficulty | 0)
      : ((State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2);
    selectedDifficulty = Math.max(1, Math.min(3, selectedDifficulty));
    var profile = Games._maze11GetDifficultyProfile(selectedDifficulty);
    var sets = [];
    var pickIndexes = Array.isArray(profile.setIndexes) ? profile.setIndexes : [];
    for (var si = 0; si < pickIndexes.length; si++) {
      var srcIdx = pickIndexes[si] | 0;
      if (srcIdx < 0 || srcIdx >= allSets.length) continue;
      var src = allSets[srcIdx];
      if (!src) continue;
      var scaledEnergy = Math.round(((src.maxEnergy | 0) || 100) * (profile.energyMultiplier || 1));
      if (scaledEnergy < 70) scaledEnergy = 70;
      if (scaledEnergy > 160) scaledEnergy = 160;
      sets.push({
        id: src.id,
        title: src.title,
        maxEnergy: scaledEnergy,
        mazes: Array.isArray(src.mazes) ? src.mazes : [],
        _sourceSetIndex: srcIdx + 1
      });
    }
    if (!sets.length) {
      sets.push({
        id: allSets[0].id,
        title: allSets[0].title,
        maxEnergy: (allSets[0].maxEnergy | 0) || 100,
        mazes: Array.isArray(allSets[0].mazes) ? allSets[0].mazes : [],
        _sourceSetIndex: 1
      });
    }

    Games.currentGameType = gameNum | 0;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;
    Games.currentGameBest = 0;

    Games.runtime.round = {
      mode: "maze11",
      gameId: Games._getGameKey(gameNum),
      label: "Maze Trace",
      difficulty: selectedDifficulty,
      questions: [{ gameType: "mazeTraceQuest", qid: "maze11_runtime" }],
      idx: 0,
      completed: false,
      lastPickedIndex: null
    };

    Games.runtime.mode = "maze11";
    Games.runtime.correctCount = 0;
    Games.runtime.totalCount = 1;
    Games.runtime.submitted = false;

    var firstSet = sets[0];
    Games.runtime.maze11 = {
      difficultyProfile: profile,
      sets: sets,
      setIndex: 0,
      mazeIndex: 0,
      currentSet: firstSet,
      currentMaze: null,
      currentQuestion: null,
      phase: "maze",
      maxEnergy: (firstSet && firstSet.maxEnergy) ? (firstSet.maxEnergy | 0) : 100,
      energy: (firstSet && firstSet.maxEnergy) ? (firstSet.maxEnergy | 0) : 100,
      baseDrainPerSec: profile.baseDrainPerSec,
      wallHitPenalty: profile.wallHitPenalty,
      questionTierMin: profile.questionTierMin,
      questionTierMax: profile.questionTierMax,
      preferredQuestionTier: profile.preferredQuestionTier,
      currentSetQuestionTier: Games._maze11SetTierFromSourceIndex((firstSet && firstSet._sourceSetIndex) || 1),
      questionBagByTopic: {},
      questionUsageById: {},
      questionRecentByTopic: {},
      questionRecentCorrectByTopic: {},
      player: { x: 0, y: 0 },
      pointerActive: false,
      lastTickMs: Date.now(),
      canvas: null,
      ctx: null,
      rafId: 0,
      bound: false,
      unbindCanvas: null
    };

    Games._maze11LoadCurrentMaze();
    Games._clearCompletionUI();
    Games._saveSessionToState();
    UI.goTo("screen-play");
    Games.render();
  },

  // ===== Game 3 selection (ramp + marker-free mix) =====
  _TENSTimeMarkerRe: /(\byesterday\b|\btomorrow\b|\bnext\b|\blast\b|\bago\b|\bevery\b|\btoday\b|\btonight\b|\bnow\b|\bright now\b|\bsoon\b)/i,

  _tenseTierForSentence: function(sentenceEn) {
    var s = String(sentenceEn || "");
    if (!s) return 2;
    if (Games._TENSTimeMarkerRe.test(s)) return 1;

    // Marker-free but clear verb-form cues.
    // Future: will ...
    if (/\bwill\b/i.test(s)) return 2;
    // Present progressive: am/is/are + -ing
    if (/\b(am|is|are)\b/i.test(s) && /\b\w+ing\b/i.test(s)) return 2;
    // Past: was/were or common -ed
    if (/\b(was|were)\b/i.test(s)) return 2;
    if (/\b\w+ed\b/i.test(s)) return 2;

    // Otherwise treat as harder marker-free.
    return 3;
  },

  selectQuestionsTenseRamped: function(pool, difficulty, count, deterministic, seed) {
    if (!Array.isArray(pool)) pool = [];
    var n = Math.max(1, count | 0);

    var rng = deterministic ? Games._seededRng(seed || 1) : Math.random;
    function shuffleInPlace(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    }

    // Helper: normalize sentence for near-duplicate detection
    function normalizeSentence(s) {
      return String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Helper: check if two normalized sentences are too similar (token overlap > 60%)
    function areSimilar(s1, s2) {
      var n1 = normalizeSentence(s1).split(" ");
      var n2 = normalizeSentence(s2).split(" ");
      if (!n1.length || !n2.length) return false;
      var common = 0;
      for (var ci = 0; ci < n1.length; ci++) {
        for (var cj = 0; cj < n2.length; cj++) {
          if (n1[ci] === n2[cj]) { common++; break; }
        }
      }
      var overlapRatio = common / Math.max(n1.length, n2.length);
      return overlapRatio > 0.6;
    }

    var tier1 = [];
    var tier2 = [];
    var tier3 = [];
    for (var i = 0; i < pool.length; i++) {
      var q = pool[i];
      if (!q || q.gameType !== "tense") continue;
      var tier = Games._tenseTierForSentence(q.promptEn || "");
      if (tier === 1) tier1.push(q);
      else if (tier === 2) tier2.push(q);
      else tier3.push(q);
    }

    shuffleInPlace(tier1);
    shuffleInPlace(tier2);
    shuffleInPlace(tier3);

    // Ramp template for a 10-question round.
    // Q1–Q4: mostly Tier 1
    // Q5–Q8: mix Tier 1/2
    // Q9–Q10: include Tier 2 (and Tier 3 if available)
    var plan = [];
    if (n === 10) {
      plan = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3];
    } else {
      // General fallback: early easier, late harder.
      for (var p = 0; p < n; p++) {
        var frac = (n <= 1) ? 1 : (p / (n - 1));
        plan.push(frac < 0.4 ? 1 : (frac < 0.8 ? 2 : 3));
      }
    }

    function pickFromTier(t) {
      if (t === 1 && tier1.length) return tier1.shift();
      if (t === 2 && tier2.length) return tier2.shift();
      if (t === 3 && tier3.length) return tier3.shift();
      return null;
    }

    var out = [];
    var seen = {};
    var lastTense = null;
    var tenseRunLength = 0;
    var lastSentence = "";

    for (var k = 0; k < plan.length && out.length < n; k++) {
      var tierWanted = plan[k];
      var qPick = pickFromTier(tierWanted) || pickFromTier(2) || pickFromTier(1) || pickFromTier(3);
      if (!qPick) break;
      var key = qPick.qid || (qPick.promptEn + "|" + String(out.length));
      if (seen[key]) { k--; continue; }

      // Guard: skip if same tense repeated >2 times in a row (Enhancement 1)
      var currentTense = qPick.correctChoiceId || qPick.correctTense || "";
      if (currentTense === lastTense) {
        tenseRunLength++;
        if (tenseRunLength > 2) { k--; continue; } // skip and try next
      } else {
        lastTense = currentTense;
        tenseRunLength = 1;
      }

      // Guard: skip if near-duplicate of last sentence (Enhancement 1)
      if (lastSentence && areSimilar(qPick.promptEn || "", lastSentence)) {
        k--; continue;
      }

      seen[key] = true;
      lastSentence = qPick.promptEn || "";
      out.push(qPick);
    }

    // If we still need more, fall back to a shuffled pool (preserve uniqueness).
    if (out.length < n) {
      var rest = pool.filter(function(q) { return q && q.gameType === "tense"; }).slice();
      shuffleInPlace(rest);
      for (var r = 0; r < rest.length && out.length < n; r++) {
        var q2 = rest[r];
        var key2 = q2.qid || (q2.promptEn + "|" + String(out.length));
        if (seen[key2]) continue;

        // Also check tense run and similarity in fallback
        var fallbackTense = q2.correctChoiceId || q2.correctTense || "";
        if (fallbackTense === lastTense && tenseRunLength > 2) continue;
        if (lastSentence && areSimilar(q2.promptEn || "", lastSentence)) continue;

        seen[key2] = true;
        lastSentence = q2.promptEn || "";
        out.push(q2);
      }
    }

    if (!out.length) {
      // Last resort: use existing generic selector.
      return Games.selectQuestions(pool, "tense", difficulty, n, deterministic, seed);
    }

    return out;
  },

  startCustomQuiz: function(options) {
    // Accept externally supplied normalized questions.
    var questionsIn = (options && Array.isArray(options.questions)) ? options.questions : [];
    var normalized = [];
    for (var i = 0; i < questionsIn.length; i++) {
      var nq = Games.normalizeFromCustomQuestion(questionsIn[i]);
      if (nq) normalized.push(nq);
    }

    var label = (options && options.label) ? String(options.label) : "Custom Quiz";
    var d = (options && typeof options.difficulty === "string") ? options.difficulty : "Medium";
    var diffNum = (d.indexOf("Hard") >= 0) ? 3 : (d.indexOf("Easy") >= 0 ? 1 : 2);

    // Reset per-round counters for custom round
    Games.currentGameType = null;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;
    Games.currentGameBest = 0;

    Games.beginRound({
      mode: "custom",
      gameId: "custom",
      label: label,
      difficulty: diffNum,
      questions: normalized,
      onDone: (options && typeof options.onDone === "function") ? options.onDone : null,
      seed: null
    });

    UI.goTo("screen-play");
  },

  beginRound: function(opts) {
    var questions = (opts && Array.isArray(opts.questions)) ? opts.questions : [];
    var gameType = (questions[0] && questions[0].gameType) ? questions[0].gameType : null;
    var gameNum = Games._parseGameNumFromKey(opts && opts.gameId ? opts.gameId : null);

    // Game 6 premium look (normal play only).
    var isNormal = !!(opts && opts.mode === "normal");
    var isGame6 = isNormal && String(opts && opts.gameId ? opts.gameId : "") === "game6";
    Games._setGame6AestheticMode(isGame6);

    var label = opts.label || Games.defaultLabelForGameType(gameType);
    // Game 6 clarity: make direction explicit (kids-first).
    // Note: Game 6 suppresses Punjabi prompt/choices by design, so we label direction here.
    if (isGame6 && label && label.indexOf("→") === -1) {
      label += " (Punjabi → English)";
    }

    Games.runtime.round = {
      mode: opts.mode || "normal",
      gameId: opts.gameId || null,
      label: label,
      difficulty: opts.difficulty || 2,
      questions: questions,
      idx: 0,
      completed: false,
      lastPickedIndex: null,

      // Game 8 mastery: per-round delta tracking (wordOrderSurgery only)
      _g8DeltasByPattern: {},
      _g8TouchedPatterns: {}
    };

    Games.runtime.submitted = false;
    Games.runtime.attemptsByQid = {};
    Games.runtime.missesByQid = {};
    Games.runtime.correctTags = {};
    Games.runtime.correctCount = 0;
    Games.runtime.totalCount = questions.length;
    Games.runtime.bestStreakInRound = 0;
    Games.runtime.mode = opts.mode || "normal";
    Games.runtime.onDone = opts.onDone || null;
    Games.runtime.seed = opts.seed || null;

    // Unlimited practice support (normal play only).
    Games.runtime.unlimitedMode = !!(opts && opts.unlimitedMode);
    Games.runtime.checkpointEvery = (opts && typeof opts.checkpointEvery === "number") ? (opts.checkpointEvery | 0) : 0;
    Games.runtime.batchSize = (opts && typeof opts.batchSize === "number") ? (opts.batchSize | 0) : 0;
    Games.runtime.answeredCount = 0;
    Games.runtime._checkpointLock = false;
    Games.runtime._sourcePool = (opts && Array.isArray(opts.sourcePool)) ? opts.sourcePool : null;
    Games.runtime._sourceGameNum = (opts && typeof opts.sourceGameNum === "number") ? (opts.sourceGameNum | 0) : null;
    Games.runtime._sourceGameType = (opts && opts.sourceGameType) ? String(opts.sourceGameType) : null;

    Games.runtime._lastRenderedQid = null;
    Games.runtime._optionSetCache = {};
    Games.runtime._posHintWhyStateByQid = {};

    // Game 4 (Sentence Check): per-round recap + local report tracking (UI-only).
    Games.runtime._g4RecapByQid = {};
    Games.runtime._g4ReportCountInRound = 0;

    // Prompt 10: per-round session context (local-only)
    try {
      var ctx = (opts && opts.sessionContext && typeof opts.sessionContext === "object") ? opts.sessionContext : null;
      if (!ctx) {
        ctx = {
          gameNum: (typeof gameNum === "number" && isFinite(gameNum)) ? (gameNum | 0) : (Games.currentGameType | 0) || null,
          mode: "normal", // normal | retryMissed | tagPractice
          tagPractice: null,
          seedKey: ""
        };
      }
      Games.runtime.currentSession = ctx;
    } catch (eCtx) {
      Games.runtime.currentSession = { gameNum: null, mode: "normal", tagPractice: null, seedKey: "" };
    }

    // V2 round metrics (in-memory)
    Games.runtime._roundStartTs = Date.now();
    Games.runtime._roundEndTs = null;

    // V2 learning scaffold counters (Prompt 7): keep per-round.
    Games.runtime._scaffoldStats = { hintUsed: 0, whyUsed: 0 };

    // Prompt 8: last round summary (used for Retry Missed in Games 1 & 4)
    Games.runtime._lastRoundSummary = null;

    Games._clearCompletionUI();
    Games._saveSessionToState();

    // How-to micro overlay: first launch only for Games 1–6 (NOT 7–8)
    if ((opts && opts.mode === "normal") && (gameNum != null) && gameNum >= 1 && gameNum <= 6) {
      var seen = false;
      try { seen = localStorage.getItem(Games._howtoSeenKeyForGameNum(gameNum)) === "1"; } catch (e) {}
      if (!seen) {
        Games._showHowtoOverlayForGame(gameNum, gameType, function() {
          Games.render();
        });
        return;
      }
    }

    Games.render();
  },

  _openPlayCheckpointModal: function() {
    try {
      var txt = document.getElementById("play-checkpoint-text");
      if (txt) {
        var n = (Games.runtime && typeof Games.runtime.answeredCount === "number") ? (Games.runtime.answeredCount | 0) : 0;
        txt.textContent = "You’ve done " + String(n) + " questions.";
      }
    } catch (e0) {}

    try {
      if (window.UI && UI.openModal) UI.openModal("modal-play-checkpoint");
    } catch (e1) {}

    setTimeout(function() {
      try {
        var b = document.getElementById("btn-play-checkpoint-continue");
        if (b) b.focus();
      } catch (e2) {}
    }, 0);
  },

  _bindPlayCheckpointModalOnce: function() {
    try {
      var cont = document.getElementById("btn-play-checkpoint-continue");
      var back = document.getElementById("btn-play-checkpoint-back");
      if (cont && !cont.dataset.bound) {
        cont.dataset.bound = "1";
        cont.addEventListener("click", function() {
          Games._checkpointContinue();
        });
      }
      if (back && !back.dataset.bound) {
        back.dataset.bound = "1";
        back.addEventListener("click", function() {
          Games._checkpointBack();
        });
      }
    } catch (e) {}
  },

  _checkpointBack: function() {
    try {
      if (window.UI && UI.closeModal) UI.closeModal("modal-play-checkpoint");
    } catch (e0) {}

    try {
      Games.runtime._checkpointLock = false;
    } catch (e1) {}

    try {
      Games._csCleanup();
      Games._setGame6AestheticMode(false);
      Games._setTenseMode(false);
      Games._clearSessionInState();
      if (Games.runtime && Games.runtime.round) Games.runtime.round.completed = true;
    } catch (e2) {}

    try { if (window.UI && UI.goTo) UI.goTo("screen-play-home"); } catch (e3) {}
  },

  _appendUnlimitedBatch: function() {
    var r = Games.runtime.round;
    if (!r || r.completed) return false;
    if (Games.runtime.mode !== "normal") return false;
    if (!Games.runtime.unlimitedMode) return false;

    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId);
    var gameType = Games._mapGameNumToType(gameNum);
    var pool = Games.runtime._sourcePool;
    if (!Array.isArray(pool)) pool = Games.buildPoolForGameNum(gameNum);

    var count = (Games.runtime.batchSize | 0) || 20;
    var batch = null;
    if (gameType === "tense") {
      batch = Games.selectQuestionsTenseRamped(pool, r.difficulty, count, false, null);
    } else {
      // Games 1 & 4: tag-aware selection (deterministic per-day + batch index)
      var batchIndex = Math.floor((r.questions ? r.questions.length : 0) / Math.max(1, count));
      batch = Games._selectRoundQuestionsV2(pool, gameNum, gameType, r.difficulty, count, batchIndex);
    }

    batch = Games._applyGentleRampOrdering(batch, gameNum);
    if (!Array.isArray(batch) || !batch.length) return false;

    for (var i = 0; i < batch.length; i++) r.questions.push(batch[i]);
    Games.runtime.totalCount = r.questions.length;
    Games._saveSessionToState();
    return true;
  },

  _checkpointContinue: function() {
    try {
      if (window.UI && UI.closeModal) UI.closeModal("modal-play-checkpoint");
    } catch (e0) {}

    try {
      Games.runtime._checkpointLock = false;
    } catch (e1) {}

    // Append the next batch so play can continue.
    try { Games._appendUnlimitedBatch(); } catch (e2) {}

    Games.render();
    Games.updateProgressUI();
    setTimeout(function() { Games._focusFirstOption(); }, 0);
  },

  // Re-queue missed questions within 3–5 questions (guarded).
  _requeueMissedQuestion: function(qid, q) {
    try {
      if (!Games.runtime || Games.runtime.mode !== "normal") return;
      var r = Games.runtime.round;
      if (!r || r.completed) return;
      if (!qid || !q) return;
      if (!Array.isArray(r.questions) || !(r.questions.length >= 1)) return;
      if (q.gameType === "clashStability") return;
      if (!Games.runtime.unlimitedMode) return;

      if (!Games.runtime._requeueCountsByQid || typeof Games.runtime._requeueCountsByQid !== "object") {
        Games.runtime._requeueCountsByQid = {};
      }

      var count = Games.runtime._requeueCountsByQid[qid] | 0;
      if (count >= 2) return;

      // If it already exists later, don't duplicate.
      for (var i = (r.idx | 0) + 1; i < r.questions.length; i++) {
        var q2 = r.questions[i];
        var q2id = q2 && (q2.qid || ("Q_" + String(i)));
        if (q2id === qid) return;
      }

      Games.runtime._requeueCountsByQid[qid] = count + 1;

      var gap = 3 + Math.floor(Math.random() * 3); // 3–5
      var insertAt = Math.min(r.questions.length, (r.idx | 0) + gap);

      var clone = {};
      for (var k in q) {
        if (!Object.prototype.hasOwnProperty.call(q, k)) continue;
        clone[k] = q[k];
      }
      delete clone._effectiveOptionIds;
      delete clone._effectiveCorrectIndex;
      delete clone._effectiveOptionSet;

      r.questions.splice(insertAt, 0, clone);
      Games.runtime.totalCount = r.questions.length;
    } catch (e) {}
  },

  selectQuestions: function(pool, gameType, difficulty, count, deterministic, seed) {
    if (!Array.isArray(pool)) pool = [];
    var d = Math.max(1, Math.min(3, difficulty | 0));
    var out = [];
    var n = Math.max(1, count | 0);

    // Filter by difficulty for tapWord based on token count
    var filtered = pool.slice();
    if (gameType === "tapWord") {
      filtered = pool.filter(function(q) {
        if (!q || !Array.isArray(q.tokens)) return false;
        if (d === 1) return q.tokens.length <= 5;
        if (d === 2) return q.tokens.length <= 8;
        return true;
      });
      if (!filtered.length) filtered = pool.slice();
    }

    // Filter by authored difficulty for vocabTranslation (Game 6/8).
    // Easy: prefer difficulty 1 only; Medium: prefer 1–2; Hard: allow all.
    if (gameType === "vocabTranslation") {
      function byMaxDifficulty(maxD) {
        return pool.filter(function(q) {
          if (!q || typeof q !== "object") return false;
          var qd = (typeof q.difficulty === "number" && isFinite(q.difficulty)) ? (q.difficulty | 0) : 2;
          qd = Math.max(1, Math.min(3, qd));
          return qd <= maxD;
        });
      }

      if (d === 1) {
        filtered = byMaxDifficulty(1);
        if (filtered.length < n) filtered = byMaxDifficulty(2);
        if (filtered.length < n) filtered = pool.slice();
      } else if (d === 2) {
        filtered = byMaxDifficulty(2);
        if (filtered.length < n) filtered = pool.slice();
      } else {
        filtered = pool.slice();
      }
    }

    // Filter by authored difficulty for storyDetective (Game 12).
    // Easy: prefer authored d1; Medium: prefer d1–2; Hard: allow all (includes d3).
    if (gameType === "storyDetective") {
      function byMaxDifficultyG12(maxD) {
        return pool.filter(function(q) {
          if (!q || typeof q !== "object") return false;
          var qd = (typeof q.difficulty === "number" && isFinite(q.difficulty)) ? (q.difficulty | 0) : 2;
          qd = Math.max(1, Math.min(3, qd));
          return qd <= maxD;
        });
      }

      if (d === 1) {
        filtered = byMaxDifficultyG12(1);
        if (filtered.length < n) filtered = byMaxDifficultyG12(2);
      } else if (d === 2) {
        filtered = byMaxDifficultyG12(2);
      } else {
        filtered = pool.slice();
      }

      if (!filtered.length) filtered = pool.slice();
    }

    var rng = deterministic ? Games._seededRng(seed || 1) : Math.random;

    // Game 12: better variety randomizer.
    // Strategy: pick one question per story first, then fill remaining slots.
    if (gameType === "storyDetective") {
      var groups = {};
      var storyKeys = [];

      function storyKeyForQuestion(q) {
        var id = String((q && q.qid) || "");
        var cut = id.lastIndexOf("_M");
        if (cut > 0) return id.slice(0, cut);
        return id || ("story_" + String(Math.floor(rng() * 1000000)));
      }

      for (var sg = 0; sg < filtered.length; sg++) {
        var qq = filtered[sg];
        var sk = storyKeyForQuestion(qq);
        if (!groups[sk]) {
          groups[sk] = [];
          storyKeys.push(sk);
        }
        groups[sk].push(qq);
      }

      // Shuffle story order and each story bucket.
      for (var si = storyKeys.length - 1; si > 0; si--) {
        var sj = Math.floor(rng() * (si + 1));
        var stmp = storyKeys[si];
        storyKeys[si] = storyKeys[sj];
        storyKeys[sj] = stmp;
      }
      for (var sb = 0; sb < storyKeys.length; sb++) {
        var bucket = groups[storyKeys[sb]];
        for (var bi = bucket.length - 1; bi > 0; bi--) {
          var bj = Math.floor(rng() * (bi + 1));
          var btmp = bucket[bi];
          bucket[bi] = bucket[bj];
          bucket[bj] = btmp;
        }
      }

      // Pass 1: one per story
      for (var p1 = 0; p1 < storyKeys.length && out.length < n; p1++) {
        var k1 = storyKeys[p1];
        if (groups[k1] && groups[k1].length) out.push(groups[k1].shift());
      }

      // Pass 2: fill from remaining items (shuffled)
      var remaining = [];
      for (var p2 = 0; p2 < storyKeys.length; p2++) {
        var k2 = storyKeys[p2];
        var rem = groups[k2] || [];
        for (var r2 = 0; r2 < rem.length; r2++) remaining.push(rem[r2]);
      }
      for (var ri = remaining.length - 1; ri > 0; ri--) {
        var rj = Math.floor(rng() * (ri + 1));
        var rtmp = remaining[ri];
        remaining[ri] = remaining[rj];
        remaining[rj] = rtmp;
      }
      for (var rx = 0; rx < remaining.length && out.length < n; rx++) out.push(remaining[rx]);

      if (!out.length) out = filtered.slice(0, Math.min(filtered.length, n));
      if (!out.length) out = pool.slice(0, Math.min(pool.length, n));
      return out;
    }

    var copy = filtered.slice();
    // Fisher-Yates shuffle
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }

    for (var k = 0; k < copy.length && out.length < n; k++) out.push(copy[k]);
    if (!out.length) out = pool.slice(0, Math.min(pool.length, n));
    return out;
  },

  _seededRng: function(seedInt) {
    var x = (seedInt | 0) || 1;
    return function() {
      // LCG
      x = (x * 1664525 + 1013904223) | 0;
      var u = (x >>> 0) / 4294967296;
      return u;
    };
  },

  // ===== Gentle Ramp Ordering (Games 1–6, normal mode only) =====
  _estimateDifficulty: function(q) {
    // Lower score = easier.
    if (!q || typeof q !== "object") return 9999;

    var score = 0;

    // Prefer authored difficulty if present.
    if (typeof q.difficulty === "number" && isFinite(q.difficulty)) {
      // Keep this dominant, but not absolute.
      score += Math.max(1, Math.min(3, q.difficulty | 0)) * 100;
    }

    // Fewer choices -> easier.
    var choiceCount = null;
    if (Array.isArray(q.optionsEn)) choiceCount = q.optionsEn.length;
    else if (Array.isArray(q.choices)) choiceCount = q.choices.length;
    else if (Array.isArray(q._choiceIds)) choiceCount = q._choiceIds.length;
    if (typeof choiceCount === "number" && isFinite(choiceCount) && choiceCount > 0) {
      score += choiceCount * 10;
    }

    // Shorter prompt -> easier.
    var p = String(q.promptEn || q.prompt || "");
    if (p) score += Math.min(200, p.length) / 4;

    // tapWord: fewer tokens -> easier
    if (Array.isArray(q.tokens) && q.tokens.length) {
      score += q.tokens.length * 6;
    }

    return score;
  },

  _applyGentleRampOrdering: function(selectedQuestions, gameNum) {
    if (!ENABLE_GENTLE_RAMP) return selectedQuestions;
    if (!(gameNum >= 1 && gameNum <= 6)) return selectedQuestions;
    if (!Array.isArray(selectedQuestions)) return selectedQuestions;
    if (selectedQuestions.length < 2) return selectedQuestions;

    // If small set, do a simple ascending sort and return.
    if (selectedQuestions.length < 6) {
      var small = selectedQuestions.map(function(q, idx) {
        return { q: q, idx: idx, d: Games._estimateDifficulty(q) };
      });
      small.sort(function(a, b) {
        if (a.d < b.d) return -1;
        if (a.d > b.d) return 1;
        return a.idx - b.idx; // stable tie-break
      });
      var outSmall = small.map(function(x) { return x.q; });
      if (DEBUG_GENTLE_RAMP) {
        try { console.log("[GentleRamp] game", gameNum, small.map(function(x) { return x.d; })); } catch (e) {}
      }
      return outSmall;
    }

    // For normal-size sets: pick 2 easiest + 2 hardest by estimated difficulty.
    // Keep the middle in original order to preserve the “normal” feel.
    var scored = selectedQuestions.map(function(q, idx) {
      return { q: q, idx: idx, d: Games._estimateDifficulty(q) };
    });

    var sorted = scored.slice().sort(function(a, b) {
      if (a.d < b.d) return -1;
      if (a.d > b.d) return 1;
      return a.idx - b.idx;
    });

    var easyA = sorted[0];
    var easyB = sorted[1];
    var hardA = sorted[sorted.length - 1];
    var hardB = sorted[sorted.length - 2];

    // Exclude the chosen indices from the middle.
    var exclude = {};
    exclude[easyA.idx] = true;
    exclude[easyB.idx] = true;
    exclude[hardA.idx] = true;
    exclude[hardB.idx] = true;

    var middle = [];
    for (var i = 0; i < scored.length; i++) {
      if (!exclude[scored[i].idx]) middle.push(scored[i]);
    }

    var out = [easyA.q, easyB.q];
    for (var j = 0; j < middle.length; j++) out.push(middle[j].q);
    // End with harder ones (harder-last). Reverse the two for a stronger finish.
    out.push(hardB.q);
    out.push(hardA.q);

    if (DEBUG_GENTLE_RAMP) {
      try {
        console.log("[GentleRamp] game", gameNum, {
          easy: [easyA.d, easyB.d],
          hard: [hardB.d, hardA.d],
          all: out.map(function(q) { return Games._estimateDifficulty(q); })
        });
      } catch (e2) {}
    }

    return out;
  },

  defaultLabelForGameType: function(gameType) {
    if (gameType === "tapWord") return "Game 1: Tap the Word";
    if (gameType === "pos") return "Game 2: Part of Speech";
    if (gameType === "tense") return "Game 3: Tense Detective";
    if (gameType === "sentenceCheck") return "Game 4: Sentence Check";
    if (gameType === "convoReply") return "Game 5: Conversation Coach";
    if (gameType === "vocabTranslation") return "Vocab Vault (Translation)";
    if (gameType === "wordOrderSurgery") return "Game 8: Word Order Surgery";
    if (gameType === "clashStability") return "Game 10: Beam Training";
    if (gameType === "storyDetective") return "Game 12: AI Story Detective";
    return "Game";
  },

  // =====================================
  // Game 10: Beam Training (clashStability)
  // =====================================

  _csEnsureRuntime: function() {
    if (!Games.runtime) Games.runtime = {};
    if (Games.runtime.cs && typeof Games.runtime.cs === "object") return Games.runtime.cs;
    Games.runtime.cs = {
      started: false,
      isOver: false,
      locked: false,
      resolving: false,
      mode: "battle",

      // Pack router (v1)
      activePackId: "tapWord",
      routerState: { lastPacks: [], promptIndex: 0 },
      currentItem: null,
      // If a pack cannot supply an item, show a safe fallback UI (never blank prompt).
      contentError: null,
      _contentErrorWasStarted: false,
      _renderedPromptIndex: 0,
      _answerInsertChoice: "",
      _answerInsertUntilMs: 0,

      beamPos: 0,
      stability: 100,
      combo: 0,
      bestCombo: 0,
      timeLeftMs: 45000,
      lastTickMs: 0,
      rafId: 0,
      momentumText: "",
      momentumUntilMs: 0,
      momentumKind: "",

      // Beam VFX state (visual only)
      _beamFxKind: "",
      _beamFlashUntilMs: 0,
      _beamShockUntilMs: 0,
      _beamEndUntilMs: 0,

      // UI feedback (visual only)
      _lastChoiceValue: "",
      _lastChoiceCorrect: false,
      _lastChoiceUntilMs: 0,

      // Prompt cadence state
      promptIndex: 0,
      promptStartedAtMs: 0,
      promptDeadlineMs: 0,
      promptTimeoutMs: 0,
      phase: "early",
      tipText: "",
      tipUntilMs: 0,
      packLabelText: "",
      packLabelUntilMs: 0,
      driftUntilMs: 0,
      lastAnswerAtMs: 0,

      // internal
      outcome: "",
      peakBeamPos: 0,
      _unlockTimerId: 0,
      _els: null,
      _endRendered: false
    };
    return Games.runtime.cs;
  },

  _csResetRuntime: function() {
    var cs = Games._csEnsureRuntime();
    cs.started = false;
    cs.isOver = false;
    cs.locked = false;
    cs.resolving = false;
    cs.mode = "battle";

    // Pack routing: focusMode selects a pack (or "mixed"), activePackId is the current exchange pack.
    cs.focusMode = "mixed";
    cs.activePackId = "tapWord";
    cs.routerState = { lastPacks: [], promptIndex: 0 };
    cs.currentItem = null;
    cs.contentError = null;
    cs._contentErrorWasStarted = false;
    cs._renderedPromptIndex = 0;
    cs._answerInsertChoice = "";
    cs._answerInsertUntilMs = 0;
    cs._masteryRunStart = null;
    cs._masterySummary = null;
    cs.rank = "";

    cs.beamPos = 0;
    cs.stability = 100;
    cs.combo = 0;
    cs.bestCombo = 0;
    cs.timeLeftMs = 45000;
    cs.lastTickMs = 0;
    cs.rafId = 0;
    cs.momentumText = "";
    cs.momentumUntilMs = 0;
    cs.momentumKind = "";

    cs._beamFxKind = "";
    cs._beamFlashUntilMs = 0;
    cs._beamShockUntilMs = 0;
    cs._beamEndUntilMs = 0;

    cs._lastChoiceValue = "";
    cs._lastChoiceCorrect = false;
    cs._lastChoiceUntilMs = 0;

    cs.promptIndex = 0;
    cs.promptStartedAtMs = 0;
    cs.promptDeadlineMs = 0;
    cs.promptTimeoutMs = 0;
    cs.phase = "early";
    cs.tipText = "";
    cs.tipUntilMs = 0;
    cs.packLabelText = "";
    cs.packLabelUntilMs = 0;
    cs.driftUntilMs = 0;
    cs.lastAnswerAtMs = 0;

    cs.outcome = "";
    cs.peakBeamPos = 0;
    cs._endRendered = false;
    try { if (cs._unlockTimerId) clearTimeout(cs._unlockTimerId); } catch (e0) {}
    cs._unlockTimerId = 0;
  },

  _csCleanup: function() {
    var cs = Games.runtime && Games.runtime.cs;
    if (!cs) return;
    try { if (cs.rafId) cancelAnimationFrame(cs.rafId); } catch (e0) {}
    cs.rafId = 0;
    try { if (cs._unlockTimerId) clearTimeout(cs._unlockTimerId); } catch (e1) {}
    cs._unlockTimerId = 0;
    cs.locked = false;
    cs.resolving = false;
  },

  _startClashStability: function(gameNum, forcedDifficulty) {
    var key = Games._getGameKey(gameNum);
    var entry = Games._getPlayHomeEntry(gameNum);

    Games.currentGameType = gameNum;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;
    Games.currentGameBest = 0;

    try {
      if (State && State.state && State.state.session) {
        State.state.session.currentGameId = key;
        if (State.save) State.save();
      }
    } catch (e0) {}

    Games._csCleanup();
    Games._csResetRuntime();
    var cs = Games._csEnsureRuntime();
    cs.activePackId = "tapWord";
    cs.focusMode = "mixed";
    cs.routerState = { lastPacks: [], promptIndex: 0 };
    cs.currentItem = null;
    var chosenDifficulty = (typeof forcedDifficulty === "number" && isFinite(forcedDifficulty))
      ? (forcedDifficulty | 0)
      : ((State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2);
    chosenDifficulty = Math.max(1, Math.min(3, chosenDifficulty));
    cs.difficulty = chosenDifficulty;
    try { cs._masteryRunStart = Games._csGetMasterySnapshot(); } catch (eM0) { cs._masteryRunStart = null; }

    // Game 10 V2 scaffold: settings + round containers only (no behavior changes).
    try {
      csInitV2Scaffold(cs);
    } catch (eV20) {}

    var q = {
      gameType: "clashStability",
      qid: "CS_RUN",
      trackId: "T_ACTIONS",
      goalEn: "",
      exampleEn: "",
      promptEn: ""
    };

    Games.beginRound({
      mode: "normal",
      gameId: key,
      label: (entry && entry.title) ? entry.title : Games.defaultLabelForGameType("clashStability"),
      difficulty: chosenDifficulty,
      questions: [q],
      onDone: null,
      seed: null
    });

    try { if (window.UI && UI.goTo) UI.goTo("screen-play"); } catch (e1) {}
  },

  _csFormatTimeMs: function(ms) {
    var t = Math.max(0, ms | 0);
    var sec = Math.ceil(t / 1000);
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return String(m) + ":" + (s < 10 ? ("0" + String(s)) : String(s));
  },

  _csClamp: function(v, lo, hi) {
    var n = (typeof v === "number" && isFinite(v)) ? v : 0;
    if (n < lo) return lo;
    if (n > hi) return hi;
    return n;
  },

  // ===== Game 10: Mastery (localStorage) =====
  _csMasteryKey: function() {
    return Games._profileScopedLsKey("bolo_clash_mastery_v1");
  },

  _csEnsureMasteryShape: function(obj) {
    var base = {
      attempts: 0,
      correct: 0,
      accEMA: 0.5,
      tier: "New"
    };

    function coerceStat(s) {
      var o = (s && typeof s === "object") ? s : {};
      var attempts = (typeof o.attempts === "number" && isFinite(o.attempts)) ? (o.attempts | 0) : 0;
      var correct = (typeof o.correct === "number" && isFinite(o.correct)) ? (o.correct | 0) : 0;
      var accEMA = (typeof o.accEMA === "number" && isFinite(o.accEMA)) ? o.accEMA : 0.5;
      var tier = String(o.tier || "").trim();
      if (!tier) tier = "New";
      return {
        attempts: Math.max(0, attempts),
        correct: Math.max(0, correct),
        accEMA: Games._csClamp(accEMA, 0, 1),
        tier: tier
      };
    }

    var out = (obj && typeof obj === "object") ? obj : {};
    out.ARTICLES = coerceStat(out.ARTICLES);
    out.SENTENCE = coerceStat(out.SENTENCE);
    out.WORD_ORDER = coerceStat(out.WORD_ORDER);
    return out;
  },

  _csComputeTierFromAccEMA: function(accEMA) {
    var v = Games._csClamp((typeof accEMA === "number" && isFinite(accEMA)) ? accEMA : 0.5, 0, 1);
    if (v < 0.55) return "New";
    if (v < 0.70) return "Learning";
    if (v < 0.85) return "Strong";
    return "Mastered";
  },

  _csLoadMastery: function() {
    var key = Games._csMasteryKey();
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return Games._csEnsureMasteryShape({});
      var parsed = JSON.parse(raw);
      return Games._csEnsureMasteryShape(parsed);
    } catch (e0) {
      return Games._csEnsureMasteryShape({});
    }
  },

  _csSaveMastery: function(masteryObj) {
    var key = Games._csMasteryKey();
    try {
      var safe = Games._csEnsureMasteryShape(masteryObj);
      localStorage.setItem(key, JSON.stringify(safe));
    } catch (e0) {}
  },

  _csSkillTagForPackId: function(packId) {
    var pid = String(packId || "");
    if (pid === "tapWord") return "GAME1";
    if (pid === "pos") return "GAME2";
    if (pid === "tense") return "GAME3";
    if (pid === "sentenceCheck") return "GAME4";
    return "GAME1";
  },

  _csSkillLabel: function(skillTag) {
    var t = String(skillTag || "");
    if (t === "GAME1") return "TAP WORD";
    if (t === "GAME2") return "WORD TYPE";
    if (t === "GAME3") return "TENSE";
    if (t === "GAME4") return "SENTENCE";
    return t || "";
  },

  _csPackLabelForId: function(packId) {
    var pid = String(packId || "");
    if (pid === "tapWord") return "TAP WORD";
    if (pid === "pos") return "WORD TYPE";
    if (pid === "tense") return "TENSE";
    if (pid === "sentenceCheck") return "SENTENCE";
    return "";
  },

  _csUpdateMastery: function(skillTag, isCorrect) {
    var mastery = Games._csLoadMastery();
    var tag = String(skillTag || "");
    if (!mastery[tag]) mastery[tag] = { attempts: 0, correct: 0, accEMA: 0.5, tier: "New" };

    var s = mastery[tag];
    var oldAcc = (typeof s.accEMA === "number" && isFinite(s.accEMA)) ? s.accEMA : 0.5;
    var x = isCorrect ? 1 : 0;
    s.attempts = (s.attempts | 0) + 1;
    s.correct = (s.correct | 0) + x;
    s.accEMA = (0.25 * x) + (0.75 * oldAcc);
    s.tier = Games._csComputeTierFromAccEMA(s.accEMA);

    mastery[tag] = s;
    Games._csSaveMastery(mastery);
    return mastery;
  },

  _csGetMasterySnapshot: function() {
    var m = Games._csLoadMastery();
    return {
      GAME1: (m.GAME1 && typeof m.GAME1.accEMA === "number") ? m.GAME1.accEMA : 0.5,
      GAME2: (m.GAME2 && typeof m.GAME2.accEMA === "number") ? m.GAME2.accEMA : 0.5,
      GAME3: (m.GAME3 && typeof m.GAME3.accEMA === "number") ? m.GAME3.accEMA : 0.5,
      GAME4: (m.GAME4 && typeof m.GAME4.accEMA === "number") ? m.GAME4.accEMA : 0.5
    };
  },

  _csComputeMasterySummaryForRun: function(cs) {
    var start = (cs && cs._masteryRunStart) ? cs._masteryRunStart : Games._csGetMasterySnapshot();
    var endStore = Games._csLoadMastery();
    var end = {
      GAME1: (endStore.GAME1 && typeof endStore.GAME1.accEMA === "number") ? endStore.GAME1.accEMA : 0.5,
      GAME2: (endStore.GAME2 && typeof endStore.GAME2.accEMA === "number") ? endStore.GAME2.accEMA : 0.5,
      GAME3: (endStore.GAME3 && typeof endStore.GAME3.accEMA === "number") ? endStore.GAME3.accEMA : 0.5,
      GAME4: (endStore.GAME4 && typeof endStore.GAME4.accEMA === "number") ? endStore.GAME4.accEMA : 0.5
    };
    var deltas = {
      GAME1: end.GAME1 - start.GAME1,
      GAME2: end.GAME2 - start.GAME2,
      GAME3: end.GAME3 - start.GAME3,
      GAME4: end.GAME4 - start.GAME4
    };

    var bestTag = "GAME1";
    var bestDelta = deltas.GAME1;
    var tags = ["GAME1", "GAME2", "GAME3", "GAME4"];
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (deltas[t] > bestDelta) {
        bestDelta = deltas[t];
        bestTag = t;
      }
    }

    var needsTag = "GAME1";
    var needsAcc = end.GAME1;
    for (var j = 0; j < tags.length; j++) {
      var t2 = tags[j];
      if (end[t2] < needsAcc) {
        needsAcc = end[t2];
        needsTag = t2;
      }
    }

    var bestTier = (endStore[bestTag] && endStore[bestTag].tier) ? String(endStore[bestTag].tier) : Games._csComputeTierFromAccEMA(end[bestTag]);
    var needsTier = (endStore[needsTag] && endStore[needsTag].tier) ? String(endStore[needsTag].tier) : Games._csComputeTierFromAccEMA(end[needsTag]);

    return {
      bestTag: bestTag,
      bestTier: bestTier,
      needsTag: needsTag,
      needsTier: needsTier
    };
  },

  // ===== Game 10: Pack routing =====
  _csChooseNextPackId: function(cs) {
    var c = cs || Games._csEnsureRuntime();
    var focus = String(c.focusMode || "mixed");
    if (focus === "tapWord" || focus === "pos" || focus === "tense" || focus === "sentenceCheck") return focus;

    // Mixed: balanced rotation among Games 1–4 with max-2-in-a-row constraint.
    var phase = "mid";
    try { phase = Games._csComputePhase(c); } catch (eP0) { phase = String(c.phase || "mid"); }
    if (!(phase === "early" || phase === "mid" || phase === "late")) phase = "mid";

    var choices = [
      { id: "tapWord", w: 25 },
      { id: "pos", w: 25 },
      { id: "tense", w: 25 },
      { id: "sentenceCheck", w: 25 }
    ];

    var last = (c.routerState && Array.isArray(c.routerState.lastPacks)) ? c.routerState.lastPacks : [];
    var last1 = last.length ? String(last[last.length - 1] || "") : "";
    var last2 = (last.length >= 2) ? String(last[last.length - 2] || "") : "";
    var blocked = (last1 && last2 && last1 === last2) ? last1 : "";

    var filtered = choices.filter(function(x) { return x && x.id && x.id !== blocked; });
    if (!filtered.length) filtered = choices;

    var total = 0;
    for (var i = 0; i < filtered.length; i++) total += (filtered[i].w | 0);
    if (total <= 0) return "tapWord";
    var r = Math.random() * total;
    for (var j = 0; j < filtered.length; j++) {
      r -= (filtered[j].w | 0);
      if (r <= 0) return filtered[j].id;
    }
    return filtered[filtered.length - 1].id;
  },

  _csComputeRank: function(cs) {
    var peak = (cs && typeof cs.peakBeamPos === "number") ? cs.peakBeamPos : 0;
    var stab = (cs && typeof cs.stability === "number") ? cs.stability : 0;
    var bestCombo = (cs && typeof cs.bestCombo === "number") ? (cs.bestCombo | 0) : 0;
    var win = !!(cs && cs.outcome === "win");

    if (peak >= 85 || (win && stab >= 35 && bestCombo >= 6)) return "Gold";
    if (peak >= 55 || win) return "Silver";
    return "Bronze";
  },

  _csComputePhase: function(cs) {
    var CS_ROUND_MS = 45000;
    var CS_EARLY_MS = 10000;
    var CS_LATE_MS = 15000;
    var tLeft = (cs && typeof cs.timeLeftMs === "number") ? (cs.timeLeftMs | 0) : CS_ROUND_MS;
    tLeft = Games._csClamp(tLeft, 0, CS_ROUND_MS);
    var elapsed = CS_ROUND_MS - tLeft;
    if (elapsed < CS_EARLY_MS) return "early";
    if (tLeft <= CS_LATE_MS) return "late";
    return "mid";
  },

  _csGetPromptTimeoutMs: function(phase) {
    var CS_TIMEOUT_EARLY_MS = 9000;
    var CS_TIMEOUT_MID_MS = 8000;
    var CS_TIMEOUT_LATE_MS = 7000;
    if (phase === "late") return CS_TIMEOUT_LATE_MS;
    if (phase === "mid") return CS_TIMEOUT_MID_MS;
    return CS_TIMEOUT_EARLY_MS;
  },

  _csGetModeTipMs: function(mode) {
    var CS_TIP_BATTLE_MS = 550;
    var CS_TIP_TRAINING_MS = 1050;
    return (mode === "training") ? CS_TIP_TRAINING_MS : CS_TIP_BATTLE_MS;
  },

  _csGetModeBeatMs: function(mode) {
    var CS_CARD_BEAT_BATTLE_MS = 450;
    var CS_CARD_BEAT_TRAINING_MS = 750;
    return (mode === "training") ? CS_CARD_BEAT_TRAINING_MS : CS_CARD_BEAT_BATTLE_MS;
  },

  _csRandBetweenMs: function(minMs, maxMs) {
    var a = (minMs | 0);
    var b = (maxMs | 0);
    if (!isFinite(a) || a < 0) a = 0;
    if (!isFinite(b) || b < 0) b = a;
    if (b < a) { var tmp = a; a = b; b = tmp; }
    var span = (b - a);
    return a + Math.floor(Math.random() * (span + 1));
  },

  _csSetContentError: function(packId, where, err) {
    var cs = Games._csEnsureRuntime();
    var pid = String(packId || "");
    var msg = "This pack has no items right now.";
    var now = Date.now();

    cs.contentError = {
      packId: pid,
      message: msg,
      where: String(where || ""),
      atMs: now,
      details: err ? String((err && err.message) ? err.message : err) : ""
    };

    // Pause gameplay safely (no blank prompt, no timers/drain continuing).
    cs._contentErrorWasStarted = !!cs.started;
    cs.started = false;
    cs.locked = true;
    cs.resolving = false;
    cs.promptStartedAtMs = 0;
    cs.promptDeadlineMs = 0;
    cs.promptTimeoutMs = 0;

    cs.currentItem = null;
    cs._answerInsertChoice = "";
    cs._answerInsertUntilMs = 0;

    // Force re-render.
    cs._renderedPromptIndex = 0;
    cs._renderedInsertKey = "";
    try {
      if (cs._els && cs._els.answersRoot && cs._els.answersRoot.dataset) {
        delete cs._els.answersRoot.dataset.csPromptIndex;
      }
    } catch (e0) {}

    try { Games._csStopTick(); } catch (e1) {}
    try { if (cs._unlockTimerId) clearTimeout(cs._unlockTimerId); } catch (e2) {}
    cs._unlockTimerId = 0;

    try {
      console.warn("[Game10] Content unavailable", {
        packId: pid,
        where: String(where || ""),
        focusMode: String(cs.focusMode || ""),
        activePackId: String(cs.activePackId || ""),
        phase: String(cs.phase || ""),
        promptIndex: cs.promptIndex | 0,
        difficulty: cs.difficulty,
        routerState: cs.routerState
      });
    } catch (eW) {}
  },

  _csClearContentError: function() {
    var cs = Games._csEnsureRuntime();
    cs.contentError = null;
    cs._contentErrorWasStarted = false;
    cs.locked = false;
    cs.resolving = false;
  },

  _csContentRetry: function() {
    var cs = Games._csEnsureRuntime();
    var wasStarted = !!cs._contentErrorWasStarted;

    Games._csClearContentError();

    // If user was focused on a single pack, retry switches to Mixed automatically.
    if (String(cs.focusMode || "") !== "mixed") cs.focusMode = "mixed";

    cs.currentItem = null;
    cs._renderedPromptIndex = 0;
    try {
      if (cs._els && cs._els.answersRoot && cs._els.answersRoot.dataset) {
        delete cs._els.answersRoot.dataset.csPromptIndex;
      }
    } catch (e0) {}

    if (wasStarted) {
      cs.started = true;
      cs.lastTickMs = Date.now();
      cs.lastAnswerAtMs = cs.lastTickMs;
      Games._csStartPrompt();
      Games._csStartTick();
      return;
    }

    // Pre-start retry: prepare without arming timers.
    cs.started = false;
    cs.promptIndex = 0;
    cs.promptStartedAtMs = 0;
    cs.promptDeadlineMs = 0;
    cs.promptTimeoutMs = 0;
    cs.routerState = { lastPacks: [], promptIndex: 0 };
    cs.activePackId = "tapWord";
    Games._csPrepareFirstPromptIfNeeded();
    Games._csRenderPromptAndAnswers();
    Games._csUpdateUi();
  },

  _csContentBack: function() {
    try { Games._csCleanup(); } catch (e0) {}
    try { if (window.UI && UI.goTo) UI.goTo("screen-play-home"); } catch (e1) {}
  },

  _csStartPrompt: function() {
    var cs = Games._csEnsureRuntime();
    if (cs.isOver) return;
    var now = Date.now();

    // Clear prior choice feedback so nothing looks pre-selected on the new prompt.
    cs._lastChoiceValue = "";
    cs._lastChoiceCorrect = false;
    cs._lastChoiceUntilMs = 0;

    cs.phase = Games._csComputePhase(cs);
    cs.promptTimeoutMs = Games._csGetPromptTimeoutMs(cs.phase);
    cs.promptStartedAtMs = now;
    cs.promptDeadlineMs = now + (cs.promptTimeoutMs | 0);
    cs.promptIndex = (cs.promptIndex | 0) + 1;

    // V2 round queue: pull the current item from the finite queue.
    // This keeps V1 timers/beam/scoring intact while making prompt sequencing finite.
    if (cs && cs.v2 && cs.round && Array.isArray(cs.round.queue) && cs.round.queue.length) {
      cs.currentItem = null;

      try { cs.round.phase = csPhaseForIndex(cs.round.idx | 0); } catch (ePh0) {}

      var queued = csGetCurrentQueuedQuestion(cs);
      if (!queued) {
        cs.round.phase = "end";
        csEndRound_V1Compat(cs);
        return;
      }

      cs._answerInsertChoice = "";
      cs._answerInsertUntilMs = 0;

      if (!cs.tipUntilMs || cs.tipUntilMs <= now) {
        cs.tipText = "";
        cs.tipUntilMs = 0;
      }

      // Render via compat layer (sets activePackId/currentItem then calls the V1 renderer).
      try { csRenderQueuedQuestion(cs); } catch (eRQ0) {}
      Games._csUpdateUi();
      return;
    }

    // Choose pack for this exchange (mixed/focus). If mixed + empty pack, try others before contentError.
    var prevPid = "";
    var primaryPid = "tapWord";
    try {
      if (!cs.routerState || typeof cs.routerState !== "object") cs.routerState = { lastPacks: [] };
      if (!Array.isArray(cs.routerState.lastPacks)) cs.routerState.lastPacks = [];
      prevPid = String(cs.activePackId || "");
      primaryPid = String(Games._csChooseNextPackId(cs) || "tapWord");
    } catch (eRP) { primaryPid = "tapWord"; }

    try {
      if (!cs.routerState || typeof cs.routerState !== "object") cs.routerState = { lastPacks: [] };
      cs.routerState.promptIndex = cs.promptIndex | 0;
      cs.routerState.phase = String(cs.phase || "mid");
    } catch (eRS) {}

    cs.currentItem = null;
    var usedPid = "";
    try {
      var isMixed = (String(cs.focusMode || "mixed") === "mixed");
      var tryPids = [primaryPid];
      if (isMixed) {
        var allPids = ["tapWord", "pos", "tense", "sentenceCheck"];
        for (var iTP = 0; iTP < allPids.length; iTP++) {
          if (tryPids.indexOf(allPids[iTP]) === -1) tryPids.push(allPids[iTP]);
        }
      }

      for (var iTry = 0; iTry < tryPids.length; iTry++) {
        var pidTry = String(tryPids[iTry] || "");
        if (!pidTry) continue;
        var packTry = null;
        try { packTry = ClashPacks[pidTry] || ClashPacks.tapWord; } catch (eP0) { packTry = ClashPacks.tapWord; }
        var itemTry = null;
        try {
          itemTry = (packTry && typeof packTry.nextItem === "function")
            ? packTry.nextItem(cs.difficulty || 2, cs.routerState)
            : null;
        } catch (eNI) { itemTry = null; }
        if (itemTry) {
          cs.currentItem = itemTry;
          usedPid = pidTry;
          break;
        }
      }
    } catch (eNI2) { cs.currentItem = null; usedPid = ""; }

    if (cs.currentItem && usedPid) {
      cs.activePackId = String(usedPid || "tapWord");
      try {
        if (!cs.routerState || typeof cs.routerState !== "object") cs.routerState = { lastPacks: [] };
        if (!Array.isArray(cs.routerState.lastPacks)) cs.routerState.lastPacks = [];
        cs.routerState.lastPacks.push(cs.activePackId);
        while (cs.routerState.lastPacks.length > 2) cs.routerState.lastPacks.shift();
      } catch (eRP2) {}

      if (prevPid && cs.activePackId && prevPid !== cs.activePackId) {
        cs.packLabelText = Games._csPackLabelForId(cs.activePackId) || "";
        cs.packLabelUntilMs = now + 600;
      }
    }

    if (!cs.currentItem) {
      var failPid = "";
      try {
        cs.activePackId = String(primaryPid || "tapWord");
        failPid = String(cs.activePackId || "");
      } catch (eP) { failPid = ""; }
      Games._csSetContentError(failPid, "_csStartPrompt", null);
      Games._csRenderPromptAndAnswers();
      Games._csUpdateUi();
      return;
    }

    cs._answerInsertChoice = "";
    cs._answerInsertUntilMs = 0;

    // Keep any currently active tip; otherwise clear.
    if (!cs.tipUntilMs || cs.tipUntilMs <= now) {
      cs.tipText = "";
      cs.tipUntilMs = 0;
    }
    Games._csRenderPromptAndAnswers();
    Games._csUpdateUi();
  },

  _csPrepareFirstPromptIfNeeded: function() {
    var cs = Games._csEnsureRuntime();
    if (cs.isOver) return;
    if ((cs.promptIndex | 0) > 0 && cs.currentItem) return;

    // Clear prior choice feedback so nothing looks pre-selected.
    cs._lastChoiceValue = "";
    cs._lastChoiceCorrect = false;
    cs._lastChoiceUntilMs = 0;

    // Prepare Exchange 1 without starting its countdown yet.
    cs.promptIndex = Math.max(1, cs.promptIndex | 0);
    cs.promptStartedAtMs = 0;
    cs.promptDeadlineMs = 0;
    cs.promptTimeoutMs = 0;
    cs.phase = Games._csComputePhase(cs);

    // Choose pack for exchange 1 (mixed/focus). If mixed + empty pack, try others before contentError.
    var primaryPid0 = "tapWord";
    try {
      if (!cs.routerState || typeof cs.routerState !== "object") cs.routerState = { lastPacks: [] };
      if (!Array.isArray(cs.routerState.lastPacks)) cs.routerState.lastPacks = [];
      primaryPid0 = String(Games._csChooseNextPackId(cs) || "tapWord");
    } catch (eRP0) { primaryPid0 = "tapWord"; }

    try {
      if (!cs.routerState || typeof cs.routerState !== "object") cs.routerState = { lastPacks: [] };
      cs.routerState.promptIndex = cs.promptIndex | 0;
      cs.routerState.phase = String(cs.phase || "mid");
    } catch (eRS) {}

    cs.currentItem = null;
    var usedPid0 = "";
    try {
      var isMixed0 = (String(cs.focusMode || "mixed") === "mixed");
      var tryPids0 = [primaryPid0];
      if (isMixed0) {
        var allPids0 = ["tapWord", "pos", "tense", "sentenceCheck"];
        for (var iTP0 = 0; iTP0 < allPids0.length; iTP0++) {
          if (tryPids0.indexOf(allPids0[iTP0]) === -1) tryPids0.push(allPids0[iTP0]);
        }
      }

      for (var iTry0 = 0; iTry0 < tryPids0.length; iTry0++) {
        var pidTry0 = String(tryPids0[iTry0] || "");
        if (!pidTry0) continue;
        var pack0 = null;
        try { pack0 = ClashPacks[pidTry0] || ClashPacks.tapWord; } catch (eP0) { pack0 = ClashPacks.tapWord; }
        var item0 = null;
        try {
          item0 = (pack0 && typeof pack0.nextItem === "function")
            ? pack0.nextItem(cs.difficulty || 2, cs.routerState)
            : null;
        } catch (eNI0) { item0 = null; }
        if (item0) {
          cs.currentItem = item0;
          usedPid0 = pidTry0;
          break;
        }
      }
    } catch (eNI2) { cs.currentItem = null; usedPid0 = ""; }

    if (cs.currentItem && usedPid0) {
      cs.activePackId = String(usedPid0 || "tapWord");
      try { cs.routerState.lastPacks = [cs.activePackId]; } catch (eLP0) {}
    } else {
      try {
        cs.activePackId = String(primaryPid0 || "tapWord");
        cs.routerState.lastPacks = [cs.activePackId];
      } catch (eLP1) {}
    }

    if (!cs.currentItem) {
      var failPid0 = "";
      try { failPid0 = String(cs.activePackId || ""); } catch (eP) { failPid0 = ""; }
      Games._csSetContentError(failPid0, "_csPrepareFirstPromptIfNeeded", null);
    }
  },

  _csArmCurrentPromptTimersIfNeeded: function() {
    var cs = Games._csEnsureRuntime();
    if (!cs.started || cs.isOver) return;
    if (typeof cs.promptDeadlineMs === "number" && isFinite(cs.promptDeadlineMs) && cs.promptDeadlineMs > 0) return;
    var now = Date.now();
    cs.phase = Games._csComputePhase(cs);
    cs.promptTimeoutMs = Games._csGetPromptTimeoutMs(cs.phase);
    cs.promptStartedAtMs = now;
    cs.promptDeadlineMs = now + (cs.promptTimeoutMs | 0);
  },

  _csRenderPromptAndAnswers: function() {
    var cs = Games.runtime && Games.runtime.cs;
    if (!cs || !cs._els) return;
    var now = Date.now();

    // Content-unavailable fallback: never render a blank prompt surface.
    if (cs.contentError && cs._els.promptRoot) {
      try {
        cs._els.promptRoot.innerHTML = (
          "<div class=\"cs-errorcard\" role=\"alert\">" +
            "<div class=\"cs-errtitle\">Content unavailable</div>" +
            "<div class=\"cs-errtext\">This pack has no items right now.</div>" +
            "<div class=\"cs-seg cs-answers\" role=\"group\" aria-label=\"Content unavailable actions\">" +
              "<button type=\"button\" class=\"cs-segbtn\" data-action=\"retry\" aria-label=\"Retry\">Retry</button>" +
              "<button type=\"button\" class=\"cs-segbtn\" data-action=\"back\" aria-label=\"Back\">Back</button>" +
            "</div>" +
          "</div>"
        );
      } catch (eE0) {}

      try {
        if (cs._els.answersRoot) {
          cs._els.answersRoot.innerHTML = "";
          if (cs._els.answersRoot.dataset) delete cs._els.answersRoot.dataset.csPromptIndex;
        }
      } catch (eE1) {}

      try {
        var btnRetry = cs._els.promptRoot.querySelector("button[data-action=\"retry\"]");
        var btnBack = cs._els.promptRoot.querySelector("button[data-action=\"back\"]");
        if (btnRetry) Games._csBindPress(btnRetry, function() { Games._csContentRetry(); });
        if (btnBack) Games._csBindPress(btnBack, function() { Games._csContentBack(); });
      } catch (eE2) {}

      return;
    }

    // If we have no current item (but no contentError), avoid blanking the prompt.
    // If prompt is currently empty, show a small placeholder and clear answers.
    if (!cs.currentItem) {
      try {
        if (cs._els && cs._els.promptRoot) {
          var existing = "";
          try { existing = String(cs._els.promptRoot.innerHTML || ""); } catch (e0) { existing = ""; }
          if (!existing || !existing.trim()) {
            cs._els.promptRoot.innerHTML = (
              "<div class=\"cs-startcard\">" +
                "<div class=\"cs-starttitle\">Preparing…</div>" +
                "<div class=\"cs-startsub\">Next prompt is loading.</div>" +
              "</div>"
            );

            if (cs._els.answersRoot) {
              cs._els.answersRoot.innerHTML = "";
              if (cs._els.answersRoot.dataset) delete cs._els.answersRoot.dataset.csPromptIndex;
            }
          }
        }
      } catch (ePH) {}
      return;
    }

    var insertChoice = (typeof cs._answerInsertUntilMs === "number" && isFinite(cs._answerInsertUntilMs) && cs._answerInsertUntilMs > now)
      ? String(cs._answerInsertChoice || "")
      : "";
    var insertKey = insertChoice ? ("ins:" + insertChoice) : "ins:";
    var samePrompt = (cs._renderedPromptIndex === (cs.promptIndex | 0));
    var sameAnswers = !!(cs._els.answersRoot && cs._els.answersRoot.dataset && cs._els.answersRoot.dataset.csPromptIndex === String(cs.promptIndex | 0));
    var sameInsert = (cs._renderedInsertKey === insertKey);
    if (samePrompt && sameAnswers && sameInsert) return;

    cs._renderedPromptIndex = cs.promptIndex | 0;
    cs._renderedInsertKey = insertKey;

    var pack = null;
    try {
      var pid = String(cs.activePackId || "tapWord");
      pack = ClashPacks[pid] || ClashPacks.tapWord;
    } catch (eP0) { pack = ClashPacks.tapWord; }

    // Prompt
    try {
      if (cs._els.promptRoot) {
        var html = (pack && typeof pack.renderPrompt === "function") ? pack.renderPrompt(cs.currentItem, { insertChoice: insertChoice }) : "";
        cs._els.promptRoot.innerHTML = html || "";
      }
    } catch (ePR) {}

    // Answers
    try {
      if (cs._els.answersRoot) {
        cs._els.answersRoot.innerHTML = (pack && typeof pack.renderAnswers === "function") ? (pack.renderAnswers(cs.currentItem) || "") : "";
        if (cs._els.answersRoot.dataset) delete cs._els.answersRoot.dataset.csBound;
        if (cs._els.answersRoot.dataset) cs._els.answersRoot.dataset.csPromptIndex = String(cs.promptIndex | 0);
        if (pack && typeof pack.bindHandlers === "function") {
          pack.bindHandlers(cs._els.answersRoot, cs.currentItem, function(choiceValue) {
            Games._csOnPackChoice(choiceValue);
          });
        }

        // Visual feedback (safe): selected/correct/wrong during the beat window.
        try {
          var beatActive = !!(cs._lastChoiceUntilMs && cs._lastChoiceUntilMs > now);
          var chosen = beatActive ? String(cs._lastChoiceValue || "") : "";
          var btns = cs._els.answersRoot.querySelectorAll("button[data-choice]");
          for (var bi = 0; bi < btns.length; bi++) {
            var b = btns[bi];
            var v = b.getAttribute("data-choice") || "";
            var isSel = (chosen && String(v) === chosen);
            b.classList.toggle("is-selected", !!(beatActive && isSel));
            b.classList.toggle("is-correct", !!(beatActive && isSel && cs._lastChoiceCorrect));
            b.classList.toggle("is-wrong", !!(beatActive && isSel && !cs._lastChoiceCorrect));
          }
          cs._els.answersRoot.classList.toggle("is-locked", !!(cs.locked || cs.resolving));
        } catch (eFB0) {}
      }
    } catch (eAR) {}
  },

  _csOnPackChoice: function(choiceValue) {
    var cs = Games._csEnsureRuntime();
    if (cs.isOver || cs.locked || cs.resolving) return;
    Games._csStartIfNeeded();

    var item = cs.currentItem;
    var pack = null;
    try {
      var pid = String(cs.activePackId || "tapWord");
      pack = ClashPacks[pid] || ClashPacks.tapWord;
    } catch (eP0) { pack = ClashPacks.tapWord; }

    var result = null;
    try { result = (pack && typeof pack.check === "function") ? pack.check(item, choiceValue) : null; } catch (eC0) { result = null; }
    if (!result) return;

    // V2 retry/advance decision (does not change scoring math; only controls queue idx).
    try {
      csResolveAnswer_V2Compat(cs, !!result.correct, {
        kind: result.correct ? "correct" : "wrong",
        why: String(result.tipEn || "").trim(),
        paHint: String(result.tipPa || "").trim()
      });
    } catch (eV2R) {}

    // Track attempts + award XP for correct answers.
    // Keep this lightweight and safe: 1 XP per correct prompt in Clash mode.
    try {
      if (State && typeof State.recordQuestionAttempt === "function") {
        State.recordQuestionAttempt("T_ACTIONS", !!result.correct);
      }
    } catch (eAT0) {}

    if (result.correct) {
      try {
        // Guard against any accidental double-awards on the same prompt.
        var px = (cs.promptIndex | 0);
        if (cs._xpAwardedPromptIndex !== px) {
          cs._xpAwardedPromptIndex = px;

          // Use a small constant so this fast-paced game can't dominate leveling.
          var xp10 = 1;
          Games.currentGameScore = (Games.currentGameScore || 0) + xp10;
          Games.runtime.correctCount = (Games.runtime.correctCount || 0) + 1;

          if (State && typeof State.awardXP === "function") {
            State.awardXP(xp10, { reason: "game10_correct_answer", trackId: "T_ACTIONS" }, { section: "games", reason: "game10_correct_answer" });
          }
        }
      } catch (eXP10) {}
    }

    // Mastery update (per resolved prompt)
    try {
      var skill = Games._csSkillTagForPackId(cs.activePackId);
      Games._csUpdateMastery(skill, !!result.correct);
    } catch (eMU) {}

    var CS_CLASH_ZONE = 10;
    var CS_CORRECT_BEAM = 12;
    var CS_CORRECT_STAB = 14;
    var CS_CORRECT_BEAM_CLASH = 14;
    var CS_CORRECT_STAB_CLASH = 16;
    var CS_WRONG_BEAM = 10;
    var CS_WRONG_STAB = 12;
    var CS_WRONG_BEAM_CLASH = 12;
    var CS_WRONG_STAB_CLASH = 14;

    var clash = Math.abs(cs.beamPos) <= CS_CLASH_ZONE;
    var dBeam = result.correct ? (clash ? CS_CORRECT_BEAM_CLASH : CS_CORRECT_BEAM) : (clash ? CS_WRONG_BEAM_CLASH : CS_WRONG_BEAM);
    var dStab = result.correct ? (clash ? CS_CORRECT_STAB_CLASH : CS_CORRECT_STAB) : (clash ? CS_WRONG_STAB_CLASH : CS_WRONG_STAB);

    var now = Date.now();
    cs.lastAnswerAtMs = now;
    cs._answerInsertChoice = String(choiceValue || "");
    cs._answerInsertUntilMs = now + Games._csGetModeBeatMs(cs.mode);

    // UI feedback (visual only): remember the selected option for the beat
    try {
      cs._lastChoiceValue = String(choiceValue || "");
      cs._lastChoiceCorrect = !!result.correct;
      cs._lastChoiceUntilMs = now + Games._csGetModeBeatMs(cs.mode);
    } catch (eLC0) {}

    var tipPa = String(result.tipPa || "").trim();
    var tipEn = String(result.tipEn || "").trim();
    var tipText = "";
    if (tipPa && tipEn) tipText = tipPa + "\n" + tipEn;
    else tipText = tipPa || tipEn || (result.correct ? "ਸਹੀ!\nCorrect." : "ਗਲਤ।\nWrong.");

    // Re-render prompt immediately to show inserted token during beat.
    Games._csRenderPromptAndAnswers();

    Games._csResolveExchange({
      kind: result.correct ? "correct" : "wrong",
      beamDelta: result.correct ? dBeam : -dBeam,
      stabDelta: result.correct ? dStab : -dStab,
      momentumText: (result.correct ? "+" : "-") + String(dBeam),
      momentumKind: "answer",
      tipText: tipText
    });
  },

  _csStartIfNeeded: function() {
    var cs = Games._csEnsureRuntime();
    if (cs.started || cs.isOver) return;
    var now = Date.now();
    cs.started = true;
    cs.lastTickMs = now;
    cs.lastAnswerAtMs = now;
    cs.driftUntilMs = now + Games._csRandBetweenMs(10000, 14000);
    try { if (!cs._masteryRunStart) cs._masteryRunStart = Games._csGetMasterySnapshot(); } catch (eMS) {}

    // V2: build a finite queue once per run.
    // Seeded from the already-prepared pre-start prompt to avoid UI mismatch on first tap.
    try { csInitV2Scaffold(cs); } catch (eV2S0) {}
    try {
      if (cs && cs.v2 && cs.round && (!Array.isArray(cs.round.queue) || !cs.round.queue.length)) {
        csBuildRoundQueue(cs, String(cs.focusMode || "mixed"));
      }
    } catch (eV2Q0) {}

    var useQueue = !!(cs && cs.v2 && cs.round && Array.isArray(cs.round.queue) && cs.round.queue.length);

    if (!useQueue) {
      Games._csPrepareFirstPromptIfNeeded();
    } else {
      // Ensure runtime points at the queued item before arming timers.
      try {
        var q0 = csGetCurrentQueuedQuestion(cs);
        if (q0) {
          cs.currentItem = q0;
          cs.activePackId = String(q0._csPackId || cs.activePackId || "tapWord");
        }
      } catch (eQ0) {}
    }
    Games._csArmCurrentPromptTimersIfNeeded();
    Games._csRenderPromptAndAnswers();
    Games._csStartTick();
  },

  _csStartTick: function() {
    var cs = Games._csEnsureRuntime();
    if (cs.rafId) return;

    function step() {
      var cs2 = Games.runtime && Games.runtime.cs;
      if (!cs2 || cs2.isOver) {
        try { if (cs2) cs2.rafId = 0; } catch (e0) {}
        return;
      }
      Games._csTick();
      cs2.rafId = requestAnimationFrame(step);
    }

    cs.rafId = requestAnimationFrame(step);
  },

  _csStopTick: function() {
    var cs = Games.runtime && Games.runtime.cs;
    if (!cs) return;
    try { if (cs.rafId) cancelAnimationFrame(cs.rafId); } catch (e0) {}
    cs.rafId = 0;
  },

  _csEndRun: function(outcome) {
    var cs = Games._csEnsureRuntime();
    if (cs.isOver) return;
    cs.isOver = true;
    cs.outcome = (outcome === "win") ? "win" : "lose";

    // Beam collapse beat (visual only)
    try {
      var now = Date.now();
      cs._beamFxKind = "end";
      cs._beamEndUntilMs = now + 260;
      cs._beamFlashUntilMs = now + 140;
      cs._beamShockUntilMs = 0;
    } catch (eEndFx) {}
    Games._csStopTick();
    try { if (cs._unlockTimerId) clearTimeout(cs._unlockTimerId); } catch (e0) {}
    cs._unlockTimerId = 0;
    cs.locked = false;
    cs.resolving = false;
    try { cs.rank = Games._csComputeRank(cs); } catch (eR0) { cs.rank = ""; }
    try { cs._masterySummary = Games._csComputeMasterySummaryForRun(cs); } catch (eM0) { cs._masterySummary = null; }

    // Optional analytics hook (if present)
    try {
      if (State && typeof State.trackEvent === "function") {
        State.trackEvent("clashStability_end", { outcome: cs.outcome, rank: cs.rank || "" });
      }
    } catch (eA0) {}
    Games._csUpdateUi();
  },

  _csResolveExchange: function(opts) {
    var cs = Games._csEnsureRuntime();
    if (cs.isOver || cs.locked || cs.resolving) return;
    Games._csStartIfNeeded();

    cs.resolving = true;

    var CS_BEAM_MIN = -100;
    var CS_BEAM_MAX = 100;
    var now = Date.now();
    var kind = (opts && opts.kind) ? String(opts.kind) : "";
    var beatMs = Games._csGetModeBeatMs(cs.mode);
    var tipMs = Games._csGetModeTipMs(cs.mode);

    // V2 queue advance is handled by csResolveAnswer_V2Compat (called from answer/timeout sites)

    // Beam VFX trigger (visual only)
    try {
      var k = (kind === "correct" || kind === "wrong" || kind === "timeout") ? kind : "";
      if (k) {
        cs._beamFxKind = k;
        cs._beamFlashUntilMs = now + (k === "correct" ? 170 : k === "wrong" ? 140 : 150);
        cs._beamShockUntilMs = now + (k === "correct" ? 280 : k === "wrong" ? 220 : 240);
      }
    } catch (eFx0) {}

    if (kind === "correct" || kind === "wrong") cs.lastAnswerAtMs = now;

    var beamDelta = (opts && typeof opts.beamDelta === "number") ? opts.beamDelta : 0;
    var stabDelta = (opts && typeof opts.stabDelta === "number") ? opts.stabDelta : 0;
    cs.beamPos += beamDelta;
    cs.stability += stabDelta;

    if (kind === "correct") {
      cs.combo += 1;
      if (cs.combo > cs.bestCombo) cs.bestCombo = cs.combo;
    } else {
      cs.combo = 0;
    }

    cs.momentumText = String(opts && opts.momentumText != null ? opts.momentumText : "");
    cs.momentumKind = (opts && opts.momentumKind) ? String(opts.momentumKind) : "answer";
    cs.momentumUntilMs = now + (typeof opts.momentumMs === "number" ? (opts.momentumMs | 0) : (beatMs | 0));

    cs.tipText = String(opts && opts.tipText != null ? opts.tipText : "");
    cs.tipUntilMs = now + (tipMs | 0);

    cs.locked = true;
    try { if (cs._unlockTimerId) clearTimeout(cs._unlockTimerId); } catch (e0) {}
    cs._unlockTimerId = setTimeout(function() {
      var cs2 = Games.runtime && Games.runtime.cs;
      if (!cs2 || cs2.isOver) return;
      cs2.resolving = false;
      cs2.locked = false;
      Games._csStartPrompt();
      Games._csUpdateUi();
    }, beatMs);

    cs.beamPos = Games._csClamp(cs.beamPos, CS_BEAM_MIN, CS_BEAM_MAX);
    cs.stability = Games._csClamp(cs.stability, 0, 100);
    if (cs.beamPos > cs.peakBeamPos) cs.peakBeamPos = cs.beamPos;
    Games._csUpdateUi();
  },

  _csTick: function() {
    var cs = Games.runtime && Games.runtime.cs;
    if (!cs || cs.isOver) return;

    // Constants (local to clashStability)
    var CS_ROUND_MS = 45000;
    var CS_STAB_DRAIN_PER_SEC = 5;
    var CS_BEAM_MIN = -100;
    var CS_BEAM_MAX = 100;

    // Training-mode pause while tips are visible (optional; local-only)
    var CS_PAUSE_TIMER_DURING_TIP_TRAINING = true;
    var CS_PAUSE_DRAIN_DURING_TIP_TRAINING = true;

    var CS_DRIFT_EVERY_MIN_MS = 10000;
    var CS_DRIFT_EVERY_MAX_MS = 14000;
    var CS_DRIFT_BEAM_PENALTY = 2;

    if (!cs.started) {
      Games._csUpdateUi();
      return;
    }

    var now = Date.now();
    var last = (typeof cs.lastTickMs === "number" && isFinite(cs.lastTickMs) && cs.lastTickMs > 0) ? cs.lastTickMs : now;
    var dtMs = Math.max(0, now - last);
    cs.lastTickMs = now;

    var tipActive = !!(cs.mode === "training" && CS_PAUSE_TIMER_DURING_TIP_TRAINING && cs.tipUntilMs && cs.tipUntilMs > now);
    if (tipActive && cs.promptDeadlineMs && cs.promptDeadlineMs > 0 && !cs.locked && !cs.resolving) {
      // Pause prompt countdown by extending the deadline while tip is showing.
      cs.promptDeadlineMs = cs.promptDeadlineMs + dtMs;
    }

    var dtTimerMs = tipActive ? 0 : dtMs;
    var dtDrainMs = (tipActive && CS_PAUSE_DRAIN_DURING_TIP_TRAINING) ? 0 : dtMs;

    cs.timeLeftMs = (cs.timeLeftMs | 0) - (dtTimerMs | 0);
    cs.stability = cs.stability - (CS_STAB_DRAIN_PER_SEC * (dtDrainMs / 1000));

    cs.timeLeftMs = Games._csClamp(cs.timeLeftMs, 0, CS_ROUND_MS);
    cs.stability = Games._csClamp(cs.stability, 0, 100);
    cs.beamPos = Games._csClamp(cs.beamPos, CS_BEAM_MIN, CS_BEAM_MAX);
    if (cs.beamPos > cs.peakBeamPos) cs.peakBeamPos = cs.beamPos;

    // Automatic prompt timeout
    if (!cs.isOver && cs.promptDeadlineMs && !cs.locked && !cs.resolving) {
      if (now >= cs.promptDeadlineMs) {
        // V2 retry/advance decision (timeouts advance; no retry by default)
        try {
          csResolveAnswer_V2Compat(cs, false, {
            kind: "timeout",
            isTimeout: true,
            allowRetryOnTimeout: false,
            why: "Too slow — time out.",
            paHint: "ਤੇਜ਼ ਜਵਾਬ ਦਿਓ — time out ਹੋ ਗਿਆ।"
          });
        } catch (eV2TO) {}

        // Mastery update (timeout counts as an attempt; incorrect)
        try {
          var skillT = Games._csSkillTagForPackId(cs.activePackId);
          Games._csUpdateMastery(skillT, false);
        } catch (eMT) {}
        cs.currentItem = null;
        cs._answerInsertChoice = "";
        cs._answerInsertUntilMs = 0;
        Games._csRenderPromptAndAnswers();
        Games._csResolveExchange({
          kind: "timeout",
          beamDelta: -8,
          stabDelta: -10,
          momentumText: "-8",
          momentumKind: "answer",
          tipText: "ਤੇਜ਼ ਜਵਾਬ ਦਿਓ — time out ਹੋ ਗਿਆ।\nToo slow — time out."
        });
        return;
      }
    }

    // Pressure drift (solo opponent feel) - only when idle
    if (!cs.isOver && cs.started && cs.driftUntilMs && !cs.locked) {
      if (now >= cs.driftUntilMs) {
        if ((now - (cs.lastAnswerAtMs || 0)) > 1200) {
          cs.beamPos -= CS_DRIFT_BEAM_PENALTY;
          cs.beamPos = Games._csClamp(cs.beamPos, CS_BEAM_MIN, CS_BEAM_MAX);
          cs.momentumText = "-" + String(CS_DRIFT_BEAM_PENALTY);
          cs.momentumKind = "drift";
          cs.momentumUntilMs = now + 300;

          // Beam VFX (visual only)
          try {
            cs._beamFxKind = "drift";
            cs._beamFlashUntilMs = now + 120;
            cs._beamShockUntilMs = 0;
          } catch (eFxD) {}
        }
        cs.driftUntilMs = now + Games._csRandBetweenMs(CS_DRIFT_EVERY_MIN_MS, CS_DRIFT_EVERY_MAX_MS);
      }
    }

    // End rules
    if (cs.timeLeftMs <= 0) {
      Games._csEndRun((cs.beamPos > 0) ? "win" : "lose");
      return;
    }
    if (cs.stability <= 0) {
      Games._csEndRun("lose");
      return;
    }
    if (cs.beamPos >= CS_BEAM_MAX) {
      Games._csEndRun("win");
      return;
    }
    if (cs.beamPos <= CS_BEAM_MIN) {
      Games._csEndRun("lose");
      return;
    }

    Games._csUpdateUi();
  },

  _csBindPress: function(el, onPress) {
    if (!el || typeof onPress !== "function") return;
    var armed = false;
    var lastPointerId = null;
    var lastFireTs = 0;

    try {
      el.addEventListener("pointerdown", function(ev) {
        armed = true;
        lastPointerId = (ev && typeof ev.pointerId === "number") ? ev.pointerId : null;
      }, { passive: true });
    } catch (ePD) {}

    try {
      el.addEventListener("pointerup", function(ev) {
        if (!armed) return;
        if (lastPointerId != null && ev && typeof ev.pointerId === "number" && ev.pointerId !== lastPointerId) return;
        armed = false;
        lastFireTs = Date.now();
        onPress(ev);
      }, { passive: true });
    } catch (ePU) {}

    try {
      el.addEventListener("click", function(ev) {
        var now = Date.now();
        if (now - lastFireTs < 450) return;
        lastFireTs = now;
        onPress(ev);
      });
    } catch (eC) {}
  },

  _csOnCorrect: function() {
    var cs = Games._csEnsureRuntime();

    var CS_CLASH_ZONE = 10;
    var CS_CORRECT_BEAM = 12;
    var CS_CORRECT_STAB = 14;
    var CS_CORRECT_BEAM_CLASH = 14;
    var CS_CORRECT_STAB_CLASH = 16;

    if (cs.isOver || cs.locked) return;
    Games._csStartIfNeeded();

    var clash = Math.abs(cs.beamPos) <= CS_CLASH_ZONE;
    var dBeam = clash ? CS_CORRECT_BEAM_CLASH : CS_CORRECT_BEAM;
    var dStab = clash ? CS_CORRECT_STAB_CLASH : CS_CORRECT_STAB;

    Games._csResolveExchange({
      kind: "correct",
      beamDelta: dBeam,
      stabDelta: dStab,
      momentumText: "+" + String(dBeam),
      momentumKind: "answer",
      tipText: "ਵਧੀਆ! ਤੁਸੀਂ beam ਅੱਗੇ ਧੱਕੀ। • Good! You pushed forward."
    });
  },

  _csOnWrong: function() {
    var cs = Games._csEnsureRuntime();

    var CS_CLASH_ZONE = 10;
    var CS_WRONG_BEAM = 10;
    var CS_WRONG_STAB = 12;
    var CS_WRONG_BEAM_CLASH = 12;
    var CS_WRONG_STAB_CLASH = 14;

    if (cs.isOver || cs.locked) return;
    Games._csStartIfNeeded();

    var clash = Math.abs(cs.beamPos) <= CS_CLASH_ZONE;
    var dBeam = clash ? CS_WRONG_BEAM_CLASH : CS_WRONG_BEAM;
    var dStab = clash ? CS_WRONG_STAB_CLASH : CS_WRONG_STAB;

    Games._csResolveExchange({
      kind: "wrong",
      beamDelta: -dBeam,
      stabDelta: -dStab,
      momentumText: "-" + String(dBeam),
      momentumKind: "answer",
      tipText: "ਓਹੋ! beam ਪਿੱਛੇ ਗਈ। • Oops—pushed back."
    });
  },

  _renderClashStability: function(optionsEl) {
    var cs = Games._csEnsureRuntime();

    // Ensure V2 settings scaffold exists (UI-only; no gameplay change)
    try { csInitV2Scaffold(cs); } catch (eV2S) {}

    try { Games._hideCompletionPanel(); } catch (e0) {}
    try { Games.renderFeedback(null); } catch (e1) {}

    // Hide shared "standard" play header rows to eliminate blank gaps.
    try { csSetStandardPlayHeaderRowsVisible(false); } catch (eHdr0) {}
    try { Games.disableNext(); } catch (e2) {}

    if (!cs._els || !cs._els.root || !cs._els.root.isConnected) {
      optionsEl.innerHTML = "";

      var root = document.createElement("div");
      root.className = "cs cs-wrap";

      var hud = document.createElement("div");
      hud.className = "cs-hud";

      var barWrap = document.createElement("div");
      barWrap.className = "cs-bars";

      var beamBar = document.createElement("div");
      beamBar.className = "cs-beambar";
      var beamMarker = document.createElement("div");
      beamMarker.className = "cs-marker";
      beamMarker.setAttribute("aria-hidden", "true");
      beamBar.appendChild(beamMarker);

      var stabBar = document.createElement("div");
      stabBar.className = "cs-stabbar";
      var stabFill = document.createElement("div");
      stabFill.className = "cs-stabfill";
      stabBar.appendChild(stabFill);

      barWrap.appendChild(beamBar);
      barWrap.appendChild(stabBar);
      hud.appendChild(barWrap);

      var pills = document.createElement("div");
      pills.className = "cs-pills";

      var timePill = document.createElement("div");
      timePill.className = "cs-pill cs-pill--stat cs-pill--time";
      pills.appendChild(timePill);

      var comboPill = document.createElement("div");
      comboPill.className = "cs-pill cs-pill--stat cs-pill--combo";
      pills.appendChild(comboPill);

      var activePill = document.createElement("div");
      activePill.className = "cs-pill cs-active-pill cs-pill--primary";
      pills.appendChild(activePill);

      var modeSeg = document.createElement("div");
      modeSeg.className = "cs-seg cs-mode-toggle";
      var btnBattle = document.createElement("button");
      btnBattle.type = "button";
      btnBattle.className = "cs-seg-btn";
      btnBattle.textContent = "Battle";
      var btnTraining = document.createElement("button");
      btnTraining.type = "button";
      btnTraining.className = "cs-seg-btn";
      btnTraining.textContent = "Training";
      modeSeg.appendChild(btnBattle);
      modeSeg.appendChild(btnTraining);
      pills.appendChild(modeSeg);

      var clashBadge = document.createElement("div");
      clashBadge.className = "cs-pill cs-clash-badge";
      clashBadge.textContent = "CLASH";
      pills.appendChild(clashBadge);

      var momentum = document.createElement("div");
      momentum.className = "cs-pill cs-momentum";
      pills.appendChild(momentum);

      hud.appendChild(pills);
      root.appendChild(hud);

      var card = document.createElement("div");
      card.className = "cs-card";

      // Pre-start card (focus selector). Visible only before the first interaction.
      var startCard = document.createElement("div");
      startCard.className = "cs-startcard";

      var startTitle = document.createElement("div");
      startTitle.className = "cs-starttitle";
      startTitle.textContent = "Beam Training";
      startCard.appendChild(startTitle);

      var startSub = document.createElement("div");
      startSub.className = "cs-startsub";
      startSub.textContent = "Choose your focus (or Mixed)";
      startCard.appendChild(startSub);

      var focusGrid = document.createElement("div");
      focusGrid.className = "cs-focusgrid";

      function mkFocusBtn(label, focusValue) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cs-focusbtn";
        b.textContent = label;
        b.setAttribute("data-focus", String(focusValue || "mixed"));
        return b;
      }

      function mkFocusBtn2(label, subLabel, focusValue) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cs-focusbtn";
        b.setAttribute("data-focus", String(focusValue || "mixed"));

        var main = document.createElement("div");
        main.className = "cs-focusbtn-main";
        main.textContent = String(label || "");
        b.appendChild(main);

        if (subLabel) {
          var sub = document.createElement("div");
          sub.className = "cs-focusbtn-sub";
          sub.textContent = String(subLabel || "");
          b.appendChild(sub);
        }
        return b;
      }

      var btnFocusMixed = mkFocusBtn("Mixed", "mixed");
      var btnFocusGame1 = mkFocusBtn2("Tap Word", "Tap the action word", "tapWord");
      var btnFocusGame2 = mkFocusBtn2("Word Type", "noun / verb / etc.", "pos");
      var btnFocusGame3 = mkFocusBtn2("Tense", "past / present / future", "tense");
      var btnFocusGame4 = mkFocusBtn2("Sentence", "pick the best sentence", "sentenceCheck");

      focusGrid.appendChild(btnFocusMixed);
      focusGrid.appendChild(btnFocusGame1);
      focusGrid.appendChild(btnFocusGame2);
      focusGrid.appendChild(btnFocusGame3);
      focusGrid.appendChild(btnFocusGame4);
      startCard.appendChild(focusGrid);

      // V2 Options panel (start screen only)
      try {
        var csRoot = root;
        var mount = (startCard && startCard.querySelector(".cs-start-body")) || startCard || root;
        csRenderV2OptionsPanel(cs, mount, csRoot);
      } catch (eV2UI) {}

      card.appendChild(startCard);

      var promptMeta = document.createElement("div");
      promptMeta.className = "cs-promptmeta";
      var promptMetaLeft = document.createElement("div");
      var promptMetaRight = document.createElement("div");

      // Timer layout: value + sublabel (e.g., paused indicator)
      promptMetaRight.className = "cs-timer";
      var promptTimerVal = document.createElement("div");
      promptTimerVal.className = "cs-timer-val";
      promptTimerVal.textContent = "—";
      var promptTimerSub = document.createElement("div");
      promptTimerSub.className = "cs-timer-sub";
      promptTimerSub.textContent = "";
      promptMetaRight.appendChild(promptTimerVal);
      promptMetaRight.appendChild(promptTimerSub);

      promptMeta.appendChild(promptMetaLeft);
      promptMeta.appendChild(promptMetaRight);
      card.appendChild(promptMeta);

      // Reserved chip row (prevents layout shift)
      var chipRow = document.createElement("div");
      chipRow.className = "cs-chiprow";
      var packChip = document.createElement("div");
      packChip.className = "cs-packchip";
      packChip.setAttribute("aria-hidden", "true");
      chipRow.appendChild(packChip);
      card.appendChild(chipRow);

      var promptRoot = document.createElement("div");
      promptRoot.className = "cs-prompt";
      card.appendChild(promptRoot);

      var tip = document.createElement("div");
      tip.className = "cs-tip";
      tip.setAttribute("aria-live", "polite");
      tip.style.display = "none";
      card.appendChild(tip);

      root.appendChild(card);

      var dock = document.createElement("div");
      dock.className = "cs-dock";

      var answersRoot = document.createElement("div");
      answersRoot.className = "cs-answerswrap";
      dock.appendChild(answersRoot);
      root.appendChild(dock);

      optionsEl.appendChild(root);

      // Feedback overlay (V2 "Why" + retry messaging)
      try { csEnsureFeedbackEl(cs, root); } catch (eFB0) {}

      // V2 HUD simplification + context chip
      try { csApplyHudMode(cs, root); } catch (eHUD0) {}
      try { csUpdateContextChip(cs, root); } catch (eCTX0) {}

      cs._els = {
        root: root,
        beamBar: beamBar,
        beamMarker: beamMarker,
        stabFill: stabFill,
        timePill: timePill,
        comboPill: comboPill,
        activePill: activePill,
        btnBattle: btnBattle,
        btnTraining: btnTraining,
        clashBadge: clashBadge,
        momentum: momentum,
        startCard: startCard,
        btnFocusMixed: btnFocusMixed,
        btnFocusGame1: btnFocusGame1,
        btnFocusGame2: btnFocusGame2,
        btnFocusGame3: btnFocusGame3,
        btnFocusGame4: btnFocusGame4,
        promptMetaLeft: promptMetaLeft,
        promptMetaRight: promptMetaRight,
        promptTimerVal: promptTimerVal,
        promptTimerSub: promptTimerSub,
        chipRow: chipRow,
        packChip: packChip,
        promptRoot: promptRoot,
        tip: tip,
        card: card,
        dock: dock,
        answersRoot: answersRoot
      };
      Games._csBindPress(btnBattle, function() {
        var cs2 = Games._csEnsureRuntime();
        cs2.mode = "battle";
        Games._csUpdateUi();
      });
      Games._csBindPress(btnTraining, function() {
        var cs2 = Games._csEnsureRuntime();
        cs2.mode = "training";
        Games._csUpdateUi();
      });

      function setFocusModeIfAllowed(nextMode) {
        var cs2 = Games._csEnsureRuntime();
        if (cs2.isOver || cs2.started) return;
        cs2.focusMode = String(nextMode || "mixed");

        // Force re-prepare Exchange 1 using the selected pack, but do NOT arm timers.
        cs2.currentItem = null;
        cs2.promptIndex = 0;
        cs2.promptStartedAtMs = 0;
        cs2.promptDeadlineMs = 0;
        cs2.promptTimeoutMs = 0;
        cs2.routerState = { lastPacks: [], promptIndex: 0 };
        cs2.activePackId = "tapWord";
        cs2._renderedPromptIndex = 0;
        if (cs2._els && cs2._els.answersRoot && cs2._els.answersRoot.dataset) {
          try { delete cs2._els.answersRoot.dataset.csPromptIndex; } catch (e0) {}
        }

        Games._csPrepareFirstPromptIfNeeded();
        Games._csRenderPromptAndAnswers();
        Games._csUpdateUi();
      }

      Games._csBindPress(btnFocusMixed, function() { setFocusModeIfAllowed("mixed"); });
      Games._csBindPress(btnFocusGame1, function() { setFocusModeIfAllowed("tapWord"); });
      Games._csBindPress(btnFocusGame2, function() { setFocusModeIfAllowed("pos"); });
      Games._csBindPress(btnFocusGame3, function() { setFocusModeIfAllowed("tense"); });
      Games._csBindPress(btnFocusGame4, function() { setFocusModeIfAllowed("sentenceCheck"); });
    }

    Games._csPrepareFirstPromptIfNeeded();
    Games._csRenderPromptAndAnswers();
    try { csApplyHudMode(cs, cs._els && cs._els.root ? cs._els.root : null); } catch (eHUD1) {}
    try { csUpdateContextChip(cs, cs._els && cs._els.root ? cs._els.root : null); } catch (eCTX1) {}
    Games._csUpdateUi();
  },

  _csUpdateUi: function() {
    var cs = Games.runtime && Games.runtime.cs;
    if (!cs || !cs._els) return;

    var CS_CLASH_ZONE = 10;
    var CS_BEAM_MIN = -100;
    var CS_BEAM_MAX = 100;

    var now = Date.now();
    var clash = Math.abs(cs.beamPos) <= CS_CLASH_ZONE;
    var showMomentum = !!(cs.momentumUntilMs && cs.momentumUntilMs > now);
    var showTip = !!(cs.tipText && cs.tipUntilMs && cs.tipUntilMs > now);

    // Beam VFX (visual only): charge from prompt progress + flash/shock from resolves.
    try {
      var beamBarEl = cs._els.beamBar;
      var beamMarkerEl = cs._els.beamMarker;
      if (beamBarEl && beamBarEl.classList) {
        var flashOn = !!(cs._beamFlashUntilMs && cs._beamFlashUntilMs > now);
        var shockOn = !!(cs._beamShockUntilMs && cs._beamShockUntilMs > now);
        var endOn = !!(cs._beamEndUntilMs && cs._beamEndUntilMs > now) || !!cs.isOver;
        var kind = String(cs._beamFxKind || "");

        var charge = 0;
        if (cs.started && cs.promptDeadlineMs && cs.promptTimeoutMs && cs.promptDeadlineMs > now) {
          var leftMs = Math.max(0, cs.promptDeadlineMs - now);
          var totalMs = Math.max(1, cs.promptTimeoutMs);
          charge = 1 - (leftMs / totalMs);
          if (!isFinite(charge)) charge = 0;
          charge = Math.max(0, Math.min(1, charge));
        }

        try { beamBarEl.style.setProperty("--cs-charge", charge.toFixed(3)); } catch (eV0) {}
        beamBarEl.classList.toggle("is-clash", !!clash);
        beamBarEl.classList.toggle("is-flash", flashOn);
        beamBarEl.classList.toggle("is-shock", shockOn);
        beamBarEl.classList.toggle("is-end", endOn);
        beamBarEl.classList.toggle("is-correct", kind === "correct");
        beamBarEl.classList.toggle("is-wrong", kind === "wrong");
        beamBarEl.classList.toggle("is-timeout", kind === "timeout");
        beamBarEl.classList.toggle("is-drift", kind === "drift");
      }
      if (beamMarkerEl && beamMarkerEl.classList) {
        beamMarkerEl.classList.toggle("is-clash", !!clash);
        beamMarkerEl.classList.toggle("is-shock", !!(cs._beamShockUntilMs && cs._beamShockUntilMs > now));
        beamMarkerEl.classList.toggle("is-flash", !!(cs._beamFlashUntilMs && cs._beamFlashUntilMs > now));
      }
    } catch (eVFX0) {}

    var pct = ((cs.beamPos - CS_BEAM_MIN) / (CS_BEAM_MAX - CS_BEAM_MIN)) * 100;
    if (!isFinite(pct)) pct = 50;
    pct = Math.max(0, Math.min(100, pct));
    try { cs._els.beamMarker.style.left = String(pct) + "%"; } catch (e0) {}
    try { cs._els.stabFill.style.width = String(Math.round(Games._csClamp(cs.stability, 0, 100))) + "%"; } catch (e1) {}

    if (cs._els.timePill) cs._els.timePill.textContent = "Time: " + Games._csFormatTimeMs(cs.timeLeftMs);
    if (cs._els.comboPill) cs._els.comboPill.textContent = "Combo: " + String(cs.combo | 0);
    if (cs._els.activePill) {
      var lbl = Games._csPackLabelForId(cs.activePackId);
      cs._els.activePill.textContent = "Active: " + (lbl || "—");
    }

    if (cs._els.promptMetaLeft || cs._els.promptMetaRight) {
      var exNum = Math.max(1, cs.promptIndex | 0);
      var retryTag = (cs && cs.round && cs.round.retrying) ? " • Retry" : "";
      if (cs._els.promptMetaLeft) cs._els.promptMetaLeft.textContent = "Exchange " + String(exNum) + retryTag;
      if (cs._els.promptMetaRight) {
        var tipActive = !!(cs.mode === "training" && cs.tipUntilMs && cs.tipUntilMs > now);
        try { cs._els.promptMetaRight.classList.toggle("is-paused", !!tipActive); } catch (eTP0) {}

        if (!cs.started || !cs.promptDeadlineMs) {
          if (cs._els.promptTimerVal) cs._els.promptTimerVal.textContent = "—";
          if (cs._els.promptTimerSub) cs._els.promptTimerSub.textContent = "";
          if (!cs._els.promptTimerVal) cs._els.promptMetaRight.textContent = "Time: —";
        } else {
          var pLeftMs = Math.max(0, cs.promptDeadlineMs - now);
          var tStr = (pLeftMs / 1000).toFixed(1) + "s";
          if (cs._els.promptTimerVal) cs._els.promptTimerVal.textContent = tStr;
          if (cs._els.promptTimerSub) cs._els.promptTimerSub.textContent = tipActive ? "Paused (Training tip)" : "";
          if (!cs._els.promptTimerVal) cs._els.promptMetaRight.textContent = "Time: " + tStr;
        }
      }
    }

    if (cs._els.btnBattle) cs._els.btnBattle.classList.toggle("is-selected", cs.mode === "battle");
    if (cs._els.btnTraining) cs._els.btnTraining.classList.toggle("is-selected", cs.mode === "training");

    // Pre-start focus selector
    try {
      if (cs._els.startCard) {
        var showStart = !cs.started && !cs.isOver && !cs.contentError;
        cs._els.startCard.style.display = showStart ? "block" : "none";
      }
      if (!cs.started && !cs.isOver) {
        var fm = String(cs.focusMode || "mixed");
        if (cs._els.btnFocusMixed) cs._els.btnFocusMixed.classList.toggle("is-selected", fm === "mixed");
        if (cs._els.btnFocusGame1) cs._els.btnFocusGame1.classList.toggle("is-selected", fm === "tapWord");
        if (cs._els.btnFocusGame2) cs._els.btnFocusGame2.classList.toggle("is-selected", fm === "pos");
        if (cs._els.btnFocusGame3) cs._els.btnFocusGame3.classList.toggle("is-selected", fm === "tense");
        if (cs._els.btnFocusGame4) cs._els.btnFocusGame4.classList.toggle("is-selected", fm === "sentenceCheck");
      }
    } catch (eFS) {}

    // Prompt/answers are only re-rendered when promptIndex changes, but the insert token
    // needs to update during the impact beat.
    if (cs._answerInsertUntilMs && cs._answerInsertUntilMs > now) {
      Games._csRenderPromptAndAnswers();
    }

    if (cs._els.clashBadge) {
      cs._els.clashBadge.style.display = clash ? "inline-flex" : "none";
      cs._els.clashBadge.setAttribute("aria-hidden", clash ? "false" : "true");
    }
    if (cs._els.momentum) {
      cs._els.momentum.style.display = showMomentum ? "inline-flex" : "none";
      cs._els.momentum.setAttribute("aria-hidden", showMomentum ? "false" : "true");
      if (showMomentum) cs._els.momentum.textContent = cs.momentumText || "";
      try {
        cs._els.momentum.classList.toggle("cs-momentum--drift", showMomentum && cs.momentumKind === "drift");
      } catch (eM0) {}
    }

    if (cs._els.tip) {
      cs._els.tip.style.display = showTip ? "inline-flex" : "none";
      cs._els.tip.setAttribute("aria-hidden", showTip ? "false" : "true");
      if (showTip) cs._els.tip.textContent = cs.tipText || "";
    }

    // Pack transition chip (reserved row to prevent layout shift)
    try {
      if (cs._els.packChip) {
        var showChip = !!(cs.packLabelText && cs.packLabelUntilMs && cs.packLabelUntilMs > now);
        cs._els.packChip.textContent = showChip ? String(cs.packLabelText || "") : "";
        cs._els.packChip.classList.toggle("is-on", showChip);
        cs._els.packChip.setAttribute("aria-hidden", showChip ? "false" : "true");
      }
    } catch (eCH) {}

    try {
      if (cs._els.answersRoot) {
        cs._els.answersRoot.style.pointerEvents = (cs.locked || cs.isOver) ? "none" : "auto";
        cs._els.answersRoot.style.opacity = (cs.locked || cs.isOver) ? "0.7" : "1";
      }
    } catch (e2) {}

    if (cs.isOver && !cs._endRendered && cs._els.card && cs._els.dock) {
      cs._endRendered = true;
      cs._els.card.innerHTML = "";

      var badgeRow = document.createElement("div");
      badgeRow.className = "cs-endrow";

      var title = document.createElement("div");
      title.className = "section-title";
      title.style.fontSize = "16px";
      title.textContent = (cs.outcome === "win") ? "WIN" : "LOSE";
      badgeRow.appendChild(title);

      var rankBadge = document.createElement("div");
      rankBadge.className = "cs-rankbadge";
      rankBadge.textContent = String(cs.rank || Games._csComputeRank(cs) || "Bronze");
      badgeRow.appendChild(rankBadge);

      cs._els.card.appendChild(badgeRow);

      var summary = document.createElement("div");
      summary.className = "cs-summaryline";
      var peak = Math.round(cs.peakBeamPos || 0);
      var peakStr = (peak > 0 ? "+" : "") + String(peak);
      summary.textContent = "Peak Beam: " + peakStr + " • Stability: " + String(Math.round(cs.stability || 0)) + " • Best Combo: " + String(cs.bestCombo | 0);
      cs._els.card.appendChild(summary);

      // Mastery mini-card
      var ms = cs._masterySummary;
      if (!ms) {
        try { ms = Games._csComputeMasterySummaryForRun(cs); } catch (eMS0) { ms = null; }
      }
      if (ms) {
        var mcard = document.createElement("div");
        mcard.className = "cs-masterycard";

        var mtitle = document.createElement("div");
        mtitle.className = "cs-masterytitle";
        mtitle.textContent = "Mastery";
        mcard.appendChild(mtitle);

        var row1 = document.createElement("div");
        row1.className = "cs-masteryrow";
        var l1 = document.createElement("div");
        l1.className = "cs-masterylabel";
        l1.textContent = "Best today: " + Games._csSkillLabel(ms.bestTag);
        var p1 = document.createElement("div");
        p1.className = "cs-masterytier";
        p1.textContent = String(ms.bestTier || "");
        row1.appendChild(l1);
        row1.appendChild(p1);
        mcard.appendChild(row1);

        var row2 = document.createElement("div");
        row2.className = "cs-masteryrow";
        var l2 = document.createElement("div");
        l2.className = "cs-masterylabel";
        l2.textContent = "Needs work: " + Games._csSkillLabel(ms.needsTag);
        var p2 = document.createElement("div");
        p2.className = "cs-masterytier";
        p2.textContent = String(ms.needsTier || "");
        row2.appendChild(l2);
        row2.appendChild(p2);
        mcard.appendChild(row2);

        cs._els.card.appendChild(mcard);
      }

      cs._els.dock.innerHTML = "";
      var again = document.createElement("button");
      again.type = "button";
      again.className = "btn btn-primary";
      again.textContent = "Play again";

      var back = document.createElement("button");
      back.type = "button";
      back.className = "btn btn-secondary";
      back.textContent = "Back";

      cs._els.dock.appendChild(again);
      cs._els.dock.appendChild(back);

      Games._csBindPress(again, function() { Games.startGame(10); });
      Games._csBindPress(back, function() { Games.backToPlayMenu(); });
    }
  },

  // ===== Game 8: Word Order Surgery (MVP) =====
  normalizeGame8WordOrderQuestions: function(rawArray) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var out = [];
    var seen = {};

    function clampDifficultyStr(s) {
      var t = String(s || "").toLowerCase().trim();
      if (t === "easy" || t === "normal" || t === "hard") return t;
      return "normal";
    }

    function difficultyNumFromStr(s) {
      if (s === "easy") return 1;
      if (s === "hard") return 3;
      return 2;
    }

    function hashToInt(s) {
      try {
        if (typeof hashStringToInt === "function") return hashStringToInt(String(s || ""));
      } catch (e) {}
      var str = String(s || "");
      var h = 0;
      for (var i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) | 0;
      }
      return Math.abs(h);
    }

    function seededRng(seedInt) {
      var x = (seedInt | 0) || 1;
      return function() {
        x = (x * 1664525 + 1013904223) | 0;
        return (x >>> 0) / 4294967296;
      };
    }

    function arraysEqual(a, b) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (String(a[i]) !== String(b[i])) return false;
      }
      return true;
    }

    function scrambleNotSolved(targetChunks, seed) {
      var t = Array.isArray(targetChunks) ? targetChunks.slice() : [];
      if (t.length <= 1) return t.slice();

      var rng = seededRng(seed);
      var best = t.slice();

      for (var attempt = 0; attempt < 12; attempt++) {
        var copy = t.slice();
        for (var i = copy.length - 1; i > 0; i--) {
          var j = Math.floor(rng() * (i + 1));
          var tmp = copy[i];
          copy[i] = copy[j];
          copy[j] = tmp;
        }

        if (!arraysEqual(copy, t)) return copy;
        best = copy;
      }

      // Last resort: swap first two
      var fallback = t.slice();
      var tmp2 = fallback[0];
      fallback[0] = fallback[1];
      fallback[1] = tmp2;
      return fallback;
    }

    for (var i = 0; i < raw.length; i++) {
      var q = raw[i] || {};
      var id = String(q.id || ("G8_WO_" + String(i + 1)));
      if (!id || seen[id]) continue;
      seen[id] = true;

      var targetChunks = Array.isArray(q.targetChunks) ? q.targetChunks.map(function(s) { return String(s || ""); }) : [];
      targetChunks = targetChunks.filter(function(s) { return !!String(s || "").trim(); });
      if (targetChunks.length < 3) continue;

      var dStr = clampDifficultyStr(q.difficulty);
      var dNum = difficultyNumFromStr(dStr);
      var seed = hashToInt(id + "|" + String(q.pattern || ""));
      var initial = scrambleNotSolved(targetChunks, seed);

      // Warn if we accidentally returned solved state (should not happen).
      if (arraysEqual(initial, targetChunks)) {
        console.warn("[G8] scramble equals solved (unexpected)", { id: id, pattern: q.pattern, target: targetChunks });
      }

      var base = Games._baseNormalized("wordOrderSurgery");
      base.qid = id;
      base.trackId = "T_SENTENCE";
      base.difficulty = dNum;
      base.promptEn = "";
      base.promptPa = "";

      // Game 8-specific authored fields
      base.id = id;
      base.gameId = 8;
      base.gameKey = "GAME8";
      base.pattern = String(q.pattern || "");
      base.difficultyStr = dStr;
      base.targetChunks = targetChunks.slice();
      base.acceptableTargets = null;
      base.distractors = Array.isArray(q.distractors) ? q.distractors.slice() : [];
      base.tipEn = String(q.tipEn || "").trim();
      base.tipPa = String(q.tipPa || "").trim();

      // Mutable gameplay state
      base._initialChunks = initial.slice();
      base.chunks = initial.slice();
      base._undoStack = [];
      base._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
      base._selectedIndex = null;
      base._solved = false;
      base._awarded = false;

      // Heuristic: optimal swaps based on misplaced chunks at start.
      base._misplacedAtStart = (function() {
        var mis = 0;
        for (var mi = 0; mi < Math.min(base._initialChunks.length, base.targetChunks.length); mi++) {
          if (String(base._initialChunks[mi]) !== String(base.targetChunks[mi])) mis++;
        }
        return mis;
      })();
      base._optimalSwaps = Math.ceil((base._misplacedAtStart || 0) / 2);

      out.push(base);
    }

    return out;
  },

  _wordOrderPrefixMatchCount: function(chunks, targetChunks) {
    if (!Array.isArray(chunks) || !Array.isArray(targetChunks)) return 0;
    var n = Math.min(chunks.length, targetChunks.length);
    var count = 0;
    for (var i = 0; i < n; i++) {
      if (String(chunks[i]) === String(targetChunks[i])) count++;
      else break;
    }
    return count;
  },

  _isWordOrderSolved: function(q) {
    if (!q || !Array.isArray(q.chunks) || !Array.isArray(q.targetChunks)) return false;
    if (q.chunks.length !== q.targetChunks.length) return false;
    for (var i = 0; i < q.chunks.length; i++) {
      if (String(q.chunks[i]) !== String(q.targetChunks[i])) return false;
    }
    return true;
  },

  _g8ScheduleWordOrderAutoNext: function(q) {
    if (!q) return;

    try {
      if (q._autoNextTimer) clearTimeout(q._autoNextTimer);
    } catch (e0) {}

    // Premium feel: short, predictable cadence. Still shows a Next button to skip.
    var ms = 1200;
    q._autoNextTimer = setTimeout(function() {
      try {
        var r = Games.runtime.round;
        if (!r || r.completed) return;
        var cur = r.questions && r.questions[r.idx];
        if (cur !== q) return;
        if (!Games._isWordOrderSolved(q)) return;
        Games.next();
      } catch (e1) {}
    }, ms);
  },

  _g8SetWordOrderSolvedState: function(q) {
    if (!q) return;

    q._solved = true;
    q._solvedTs = Date.now();
    q._solvedFlash = ((q._solvedFlash | 0) || 0) + 1;

    // Lock-in the correct moment and allow Next.
    try { Games.runtime.submitted = true; } catch (e0) {}

    // Light haptic feedback when available (no-op elsewhere).
    try {
      if (typeof navigator !== "undefined" && navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate([18, 28, 18]);
      }
    } catch (e1) {}

    // Schedule smooth transition.
    try { Games._g8ScheduleWordOrderAutoNext(q); } catch (e2) {}
  },

  _maybeStartWordOrderTimer: function(q) {
    try {
      if (!q || !q._stats) return;
      if (!q._stats.startTs) q._stats.startTs = Date.now();
    } catch (e) {}
  },

  _markWordOrderSolvedOnce: function(q) {
    var r = Games.runtime.round;
    if (!r || r.completed) return;
    if (!q) return;
    if (q._awarded) return;

    q._solved = true;
    q._awarded = true;
    Games.runtime.submitted = true;

    // Game 8 mastery tracking (local)
    try { Games._g8UpdateMasteryOnSolved(q); } catch (eM0) {}

    // Award score/XP once per puzzle
    var xp = Games._xpEach();
    Games.currentGameScore = (Games.currentGameScore || 0) + xp;
    Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
    Games.runtime.bestStreakInRound = Math.max((Games.runtime.bestStreakInRound | 0) || 0, (Games.currentGameStreak | 0) || 0);
    Games.runtime.correctCount += 1;

    try {
      if (State && State.awardXP) {
        State.awardXP(xp, { reason: "game_correct_answer", trackId: q.trackId || "T_SENTENCE" }, { section: "games", reason: "game_correct_answer" });
      }
    } catch (e) {}

    Games.updateScoreUI();
    Games._saveSessionToState();
  },

  _renderWordOrderSurgeryQuestion: function(q, optionsEl) {
    var r = Games.runtime.round;
    if (!q || !optionsEl || !r) return;

    // Ensure required state
    if (!Array.isArray(q.chunks)) q.chunks = Array.isArray(q._initialChunks) ? q._initialChunks.slice() : [];
    if (!Array.isArray(q._undoStack)) q._undoStack = [];
    if (!q._stats) q._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
    if (typeof q._stats.hintUsed !== "boolean") q._stats.hintUsed = false;

    var isSolvedNow = Games._isWordOrderSolved(q) || !!q._solved;

    // Root
    var wrap = document.createElement("div");
    wrap.className = "g8-wo";

    try {
      if (q._enteredTs && (Date.now() - q._enteredTs) < 260) wrap.classList.add("is-enter");
    } catch (eET) {}

    if (isSolvedNow) {
      wrap.classList.add("is-solved");
      try {
        if (q._solvedTs && (Date.now() - q._solvedTs) < 1200) wrap.classList.add("is-solved-flash");
      } catch (eST) {}
    }

    // Sticky header (title + progress + pills)
    var header = document.createElement("div");
    header.className = "g8-wo__header";

    var title = document.createElement("div");
    title.className = "g8-wo__title";
    title.textContent = "Word Order Surgery";

    var meta = document.createElement("div");
    meta.className = "g8-wo__meta";
    meta.textContent = "Q " + String((r.idx | 0) + 1) + "/" + String(r.questions.length || 8);

    var pills = document.createElement("div");
    pills.className = "g8-wo__pills";

    var pillSwaps = document.createElement("div");
    pillSwaps.className = "g8-wo__pill";
    pillSwaps.textContent = "Swaps: " + String((q._stats && q._stats.swaps) ? q._stats.swaps : 0);

    var pillCombo = document.createElement("div");
    pillCombo.className = "g8-wo__pill";
    pillCombo.textContent = "Combo: " + String((q._stats && q._stats.combo) ? q._stats.combo : 0);

    pills.appendChild(pillSwaps);
    pills.appendChild(pillCombo);

    header.appendChild(title);
    header.appendChild(meta);
    header.appendChild(pills);
    wrap.appendChild(header);

    // Instruction strip (Punjabi first, English second) - always visible
    var instr = document.createElement("div");
    instr.className = "g8-wo__instr";
    var instrPa = document.createElement("div");
    instrPa.className = "g8-wo__instr-pa";
    instrPa.setAttribute("lang", "pa");
    instrPa.textContent = "ਦੋ ਟੁਕੜਿਆਂ 'ਤੇ ਟੈਪ ਕਰਕੇ ਥਾਂ ਬਦਲੋ।";
    var instrEn = document.createElement("div");
    instrEn.className = "g8-wo__instr-en";
    instrEn.textContent = "Tap two chunks to swap them.";
    instr.appendChild(instrPa);
    instr.appendChild(instrEn);
    wrap.appendChild(instr);

    // Premium correct signal (only when solved)
    if (isSolvedNow) {
      var success = document.createElement("div");
      success.className = "g8-wo__success";
      success.setAttribute("role", "status");
      success.setAttribute("aria-live", "polite");

      var check = document.createElement("div");
      check.className = "g8-wo__success-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      var text = document.createElement("div");
      text.className = "g8-wo__success-text";

      var linePa = document.createElement("div");
      linePa.className = "g8-wo__success-pa";
      linePa.setAttribute("lang", "pa");
      linePa.textContent = "ਸ਼ਾਬਾਸ਼! ਸਹੀ ਕ੍ਰਮ।";

      var lineEn = document.createElement("div");
      lineEn.className = "g8-wo__success-en";
      lineEn.textContent = "Correct! Nice order.";

      var sub = document.createElement("div");
      sub.className = "g8-wo__success-sub";
      sub.textContent = "Continuing…";

      text.appendChild(linePa);
      text.appendChild(lineEn);
      text.appendChild(sub);

      success.appendChild(check);
      success.appendChild(text);
      wrap.appendChild(success);
    }

    // Hint chip (hidden by default)
    var hintChip = document.createElement("div");
    hintChip.className = "g8-wo__hint is-hidden";
    hintChip.setAttribute("aria-live", "polite");
    wrap.appendChild(hintChip);

    // Main card
    var card = document.createElement("div");
    card.className = "g8-wo__card";

    // Progress meter (prefix match)
    var prefix = Games._wordOrderPrefixMatchCount(q.chunks, q.targetChunks);
    var total = Array.isArray(q.targetChunks) ? q.targetChunks.length : 0;

    var meterRow = document.createElement("div");
    meterRow.className = "g8-wo__meter-row";
    var meterLabel = document.createElement("div");
    meterLabel.className = "g8-wo__meter-label";
    meterLabel.textContent = (isSolvedNow ? "Perfect order: " : "Correct from start: ") + String(prefix) + "/" + String(total);
    var meter = document.createElement("div");
    meter.className = "g8-wo__meter";
    var meterFill = document.createElement("div");
    meterFill.className = "g8-wo__meter-fill";
    var pct = total > 0 ? Math.round((prefix / total) * 100) : 0;
    meterFill.style.width = String(Math.max(0, Math.min(100, pct))) + "%";
    meter.appendChild(meterFill);
    meterRow.appendChild(meterLabel);
    meterRow.appendChild(meter);
    card.appendChild(meterRow);

    // Chunk buttons (vertical stack)
    var list = document.createElement("div");
    list.className = "g8-wo__chunks";

    function rerender() {
      try {
        Games.render();
      } catch (e) {}
    }

    function bindPress(el, fn) {
      if (!el) return;

      // Pointer Events path (touch/mouse/pen)
      el.addEventListener("pointerdown", function(e) {
        try {
          // Avoid duplicate mouse events and prevent accidental text selection.
          if (e && typeof e.preventDefault === "function") e.preventDefault();
        } catch (e0) {}
        fn();
      });

      // Keyboard accessibility: Enter/Space triggers same behavior
      el.addEventListener("keydown", function(e) {
        var k = e && (e.key || e.code);
        if (k === "Enter" || k === " " || k === "Space" || k === "Spacebar") {
          try {
            if (e && typeof e.preventDefault === "function") e.preventDefault();
          } catch (e1) {}
          fn();
        }
      });
    }

    function setSelected(idx) {
      q._selectedIndex = (typeof idx === "number") ? idx : null;
    }

    function pushUndoState() {
      if (!Array.isArray(q._undoStack)) q._undoStack = [];
      // Store snapshot
      q._undoStack.push(q.chunks.slice());
      // Depth 3
      while (q._undoStack.length > 3) q._undoStack.shift();
    }

    function updateComboAfterChange() {
      var newPrefix = Games._wordOrderPrefixMatchCount(q.chunks, q.targetChunks);
      var prevPrefix = (q._stats && typeof q._stats._lastPrefix === "number") ? q._stats._lastPrefix : 0;
      if (!q._stats) q._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
      if (typeof q._stats.hintUsed !== "boolean") q._stats.hintUsed = false;
      if (newPrefix > prevPrefix) q._stats.combo = (q._stats.combo | 0) + 1;
      else q._stats.combo = 0;
      q._stats._lastPrefix = newPrefix;
    }

    function onChunkTap(idx) {
      if (q._solved) return;
      Games._maybeStartWordOrderTimer(q);

      // One-time tutorial progression (non-modal coach marks)
      try {
        var done = localStorage.getItem(Games._woTutorialKey()) === "1";
        if (!done) {
          if (!Games.runtime._woTutorial || typeof Games.runtime._woTutorial !== "object") {
            Games.runtime._woTutorial = { step: 0 };
          }
          if (Games.runtime._woTutorial.step == null) Games.runtime._woTutorial.step = 0;
        }
      } catch (eTut0) {}

      var selected = (typeof q._selectedIndex === "number") ? q._selectedIndex : null;
      if (selected == null) {
        setSelected(idx);

        // Tutorial: after the first selection, show the second coach mark.
        try {
          var done2 = localStorage.getItem(Games._woTutorialKey()) === "1";
          if (!done2 && Games.runtime._woTutorial && (Games.runtime._woTutorial.step | 0) === 0) {
            Games.runtime._woTutorial.step = 1;
          }
        } catch (eTut1) {}

        rerender();
        return;
      }
      if (selected === idx) {
        setSelected(null);
        rerender();
        return;
      }

      // Swap
      pushUndoState();
      var tmp = q.chunks[selected];
      q.chunks[selected] = q.chunks[idx];
      q.chunks[idx] = tmp;

      setSelected(null);

      if (!q._stats) q._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
      if (typeof q._stats.hintUsed !== "boolean") q._stats.hintUsed = false;
      q._stats.swaps = (q._stats.swaps | 0) + 1;
      updateComboAfterChange();

      // Solved?
      if (Games._isWordOrderSolved(q)) {
        Games._g8SetWordOrderSolvedState(q);
        Games._markWordOrderSolvedOnce(q);
      }

      // Tutorial: after the first successful swap, persist completion and stop showing coach marks.
      try {
        var done3 = localStorage.getItem(Games._woTutorialKey()) === "1";
        if (!done3) {
          localStorage.setItem(Games._woTutorialKey(), "1");
          Games.runtime._woTutorial = { step: 2 };
        }
      } catch (eTut2) {}

      rerender();
    }

    for (var i = 0; i < q.chunks.length; i++) {
      (function(idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "g8-wo__chunk-btn";
        btn.textContent = String(q.chunks[idx] || "");
        if (q._selectedIndex === idx) btn.classList.add("is-selected");
        if (isSolvedNow) {
          btn.classList.add("is-correct");
          btn.disabled = true;
        }

        // Coach marks tutorial (one-time, non-modal)
        try {
          var tutorialDone = localStorage.getItem(Games._woTutorialKey()) === "1";
          if (!tutorialDone) {
            if (!Games.runtime._woTutorial || typeof Games.runtime._woTutorial !== "object") {
              Games.runtime._woTutorial = { step: 0 };
            }
            var step = Games.runtime._woTutorial.step | 0;
            var selectedIdx = (typeof q._selectedIndex === "number") ? q._selectedIndex : null;

            // Step 0: on first render, highlight the first chunk.
            if (step === 0 && idx === 0 && selectedIdx == null) {
              btn.classList.add("is-coach-target");
              var coach = document.createElement("div");
              coach.className = "g8-wo__coach";
              coach.innerHTML = '<div class="g8-wo__coach-pa" lang="pa">ਇੱਕ ਟੁਕੜੇ ‘ਤੇ ਟੈਪ ਕਰੋ</div><div class="g8-wo__coach-en">Tap a piece</div>';
              btn.appendChild(coach);
            }

            // Step 1: after a chunk is selected, highlight another chunk.
            if (step === 1 && selectedIdx != null && idx !== selectedIdx) {
              // Prefer the first non-selected chunk as the target
              var targetIdx = (selectedIdx === 0) ? 1 : 0;
              if (targetIdx >= 0 && targetIdx < q.chunks.length && idx === targetIdx) {
                btn.classList.add("is-coach-target");
                var coach2 = document.createElement("div");
                coach2.className = "g8-wo__coach";
                coach2.innerHTML = '<div class="g8-wo__coach-pa" lang="pa">ਦੂਜੇ ਟੁਕੜੇ ‘ਤੇ ਟੈਪ ਕਰੋ (swap)</div><div class="g8-wo__coach-en">Tap another to swap</div>';
                btn.appendChild(coach2);
              }
            }
          }
        } catch (eTutR) {}

        bindPress(btn, function() { onChunkTap(idx); });
        list.appendChild(btn);
      })(i);
    }

    card.appendChild(list);
    wrap.appendChild(card);

    // Sticky bottom dock
    var dock = document.createElement("div");
    dock.className = "g8-wo__dock";

    var btnHint = document.createElement("button");
    btnHint.type = "button";
    btnHint.className = "btn g8-wo__dock-btn";
    btnHint.textContent = "Hint";
    if (isSolvedNow) btnHint.disabled = true;
    bindPress(btnHint, function() {
      Games._maybeStartWordOrderTimer(q);
      if (!hintChip) return;

      try {
        if (!q._stats) q._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
        q._stats.hintUsed = true;
      } catch (eHU) {}

      var en = String(q.tipEn || "").trim();
      var pa = String(q.tipPa || "").trim();
      if (!en && !pa) return;

      hintChip.classList.remove("is-hidden");
      hintChip.innerHTML = "";

      // One-line tip chip; show Punjabi briefly.
      var lineEn = document.createElement("div");
      lineEn.textContent = en || pa;
      hintChip.appendChild(lineEn);

      if (pa) {
        var linePa = document.createElement("div");
        linePa.setAttribute("lang", "pa");
        linePa.className = "g8-wo__hint-pa";
        linePa.textContent = pa;
        hintChip.appendChild(linePa);

        try {
          if (q._hintTimer) clearTimeout(q._hintTimer);
        } catch (e) {}

        q._hintTimer = setTimeout(function() {
          try {
            if (linePa && linePa.parentNode) linePa.parentNode.removeChild(linePa);
          } catch (e2) {}
        }, 1400);
      }

      rerender();
    });

    var btnUndo = document.createElement("button");
    btnUndo.type = "button";
    btnUndo.className = "btn btn-secondary g8-wo__dock-btn";
    btnUndo.textContent = "Undo";
    btnUndo.disabled = isSolvedNow || !(Array.isArray(q._undoStack) && q._undoStack.length);
    bindPress(btnUndo, function() {
      Games._maybeStartWordOrderTimer(q);
      if (!Array.isArray(q._undoStack) || !q._undoStack.length) return;
      try {
        if (q._autoNextTimer) clearTimeout(q._autoNextTimer);
      } catch (eAT0) {}
      var prev = q._undoStack.pop();
      if (Array.isArray(prev)) q.chunks = prev.slice();
      q._solved = false;
      Games.runtime.submitted = false;
      setSelected(null);
      updateComboAfterChange();
      rerender();
    });

    var btnReset = document.createElement("button");
    btnReset.type = "button";
    btnReset.className = "btn btn-secondary g8-wo__dock-btn";
    btnReset.textContent = "Reset";
    if (isSolvedNow) btnReset.disabled = true;
    bindPress(btnReset, function() {
      try {
        if (q._autoNextTimer) clearTimeout(q._autoNextTimer);
      } catch (eAT1) {}
      if (Array.isArray(q._initialChunks)) q.chunks = q._initialChunks.slice();
      q._undoStack = [];
      q._solved = false;
      Games.runtime.submitted = false;
      setSelected(null);
      if (!q._stats) q._stats = { swaps: 0, startTs: null, combo: 0, _lastPrefix: 0, hintUsed: false };
      q._stats.swaps = 0;
      q._stats.combo = 0;
      q._stats._lastPrefix = Games._wordOrderPrefixMatchCount(q.chunks, q.targetChunks);
      q._stats.startTs = null;
      q._stats.hintUsed = false;
      try {
        if (q._hintTimer) clearTimeout(q._hintTimer);
      } catch (e) {}
      rerender();
    });

    dock.appendChild(btnHint);
    dock.appendChild(btnUndo);
    dock.appendChild(btnReset);

    // Next appears only when solved
    if (isSolvedNow) {
      var btnNext = document.createElement("button");
      btnNext.type = "button";
      btnNext.className = "btn g8-wo__dock-btn g8-wo__dock-next";
      btnNext.textContent = (r.idx + 1 >= r.questions.length) ? "Finish" : "Next →";
      bindPress(btnNext, function() {
        try {
          if (q._autoNextTimer) clearTimeout(q._autoNextTimer);
        } catch (eAT2) {}
        Games.next();
      });
      dock.appendChild(btnNext);
    }

    wrap.appendChild(dock);
    optionsEl.appendChild(wrap);
  },

  // ===== Renderers =====
  render: function() {
    var r = Games.runtime.round;
    if (!r) {
      Games._setGame4Mode(false);
      Games.backToPlayMenu();
      return;
    }

    if (r.mode === "maze11") {
      // Ensure round-only panels are visible for dedicated Game 11 renderer.
      var activePanel11 = document.getElementById("playActivePanel");
      if (activePanel11) {
        activePanel11.classList.remove("is-hidden");
        activePanel11.setAttribute("aria-hidden", "false");
      }
      var roundPanel11 = document.getElementById("playRound");
      if (roundPanel11) {
        roundPanel11.classList.remove("is-hidden");
        roundPanel11.setAttribute("aria-hidden", "false");
      }
      var completeWrap11 = document.getElementById("playCompletePanel");
      if (completeWrap11) {
        completeWrap11.classList.remove("is-hidden");
        completeWrap11.setAttribute("aria-hidden", "false");
      }
      Games._maze11Render();
      Games.updateScoreUI();
      return;
    }

    // Reset any per-game screen classes; re-applied later for active questions.
    try {
      var sp0 = document.getElementById("screen-play");
      if (sp0) sp0.classList.remove("is-word-order-surgery", "is-game4");
    } catch (e0a) {}

    // Safety net: enforce Game 6 aesthetic class for normal play only.
    Games._setGame6AestheticMode(!!(r && r.mode === "normal" && String(r.gameId || "") === "game6"));

    // Ensure round-only panels are visible
    var activePanel = document.getElementById("playActivePanel");
    if (activePanel) {
      activePanel.classList.remove("is-hidden");
      activePanel.setAttribute("aria-hidden", "false");
    }
    var roundPanel = document.getElementById("playRound");
    if (roundPanel) {
      roundPanel.classList.remove("is-hidden");
      roundPanel.setAttribute("aria-hidden", "false");
    }
    var completeWrap = document.getElementById("playCompletePanel");
    if (completeWrap) {
      completeWrap.classList.remove("is-hidden");
      completeWrap.setAttribute("aria-hidden", "false");
    }

    var labelEl = document.getElementById("play-game-label");
    var g6Chip = document.getElementById("play-game6-direction-chip");
    var diffEl = document.getElementById("play-difficulty-tag");
    var trackLabelEl = document.getElementById("play-track-label");
    var goalEl = document.getElementById("play-goal-line");
    var exEl = document.getElementById("play-example-line");
    var qTextEl = document.getElementById("play-question-text");
    var optionsEl = document.getElementById("play-options");
    var nextRow = document.getElementById("play-next-row");
    var nextBtn = document.getElementById("btn-play-next");

    if (labelEl) labelEl.textContent = r.label;
    if (diffEl) diffEl.textContent = Games._difficultyLabel(r.difficulty);

    // Direction chip (Game 6 normal play only)
    if (g6Chip) {
      var show = !!(r.mode === "normal" && String(r.gameId || "") === "game6");
      g6Chip.style.display = show ? "inline-flex" : "none";
      g6Chip.setAttribute("aria-hidden", show ? "false" : "true");
    }

    // Completion?
    if (r.completed || r.idx >= r.questions.length) {
      Games._setTenseMode(false);
      Games._setGame4Mode(false);
      Games.showCompletionPanel();
      return;
    }

    var q = r.questions[r.idx];
    if (!q || typeof q !== "object") {
      r.completed = true;
      Games._setTenseMode(false);
      Games._setGame4Mode(false);
      Games.showCompletionPanel();
      return;
    }

    // Game 10: Beam Training owns the entire play surface.
    if (q.gameType === "clashStability") {
      Games._setTenseMode(false);
      Games._setGame4Mode(false);
      if (optionsEl) Games._renderClashStability(optionsEl);
      return;
    }

    // Not Game 10: restore standard play header rows (Game 10 hides them).
    try { csSetStandardPlayHeaderRowsVisible(true); } catch (eHdr1) {}

    // Apply tense styling hook per-active question.
    Games._setTenseMode(!!(q && q.gameType === "tense"));

    // Game 4: enable scoped UI-only enhancements.
    var isGame4 = !!(q && q.gameType === "sentenceCheck");
    Games._setGame4Mode(isGame4);
    if (isGame4) {
      Games._updateGame4StatusUi(r);
      Games._bindGame4Keys();
    }

    // Track when a new question becomes active (for per-question UI reset).
    var qidForUi = q.qid || ("Q_" + String(r.idx));
    if (Games.runtime._lastRenderedQid !== qidForUi) {
      Games.runtime._lastRenderedQid = qidForUi;

      // Per-question input safety reset (used by Game 5 single-submit UX).
      Games.runtime.inputLocked = false;
      Games.runtime._answeredQid = null;

      if (q.gameType === "pos") {
        Games.runtime._posHintWhyStateByQid[qidForUi] = { hintOpen: false, whyOpen: false };
      }

      if (q && q.gameType === "wordOrderSurgery") {
        try { q._enteredTs = Date.now(); } catch (eG8E) {}
      }
    }

    // Reset UI blocks
    Games._hideCompletionPanel();
    if (optionsEl) {
      optionsEl.innerHTML = "";
      // Ensure tapWord-only layout classes do not affect other game types
      optionsEl.classList.remove("g1-sentence");
    }
    // Some game types may request a one-shot rerender
    // while preserving the current feedback panel.
    var _preserveFeedback = null;
    try {
      _preserveFeedback = (Games.runtime && Games.runtime._preserveFeedbackOnce) ? Games.runtime._preserveFeedbackOnce : null;
    } catch (ePF0) {
      _preserveFeedback = null;
    }
    if (!_preserveFeedback) Games.renderFeedback(null);

    // Reset the shared Why panel (Game 5 uses it; hidden elsewhere).
    Games._resetPlayWhyUi();

    // Game 3: ensure + reset injected UI blocks (How-to / Progress / Why panel)
    Games._resetGame3RoundUi(q, r);

    // Game 4: reset per-question UI blocks
    if (isGame4) {
      Games._resetGame4UiForNewQuestion();
    }

    Games.disableNext();
    if (nextBtn) nextBtn.textContent = (r.idx + 1 >= r.questions.length) ? "Finish" : "Next →";
    Games.runtime.submitted = false;

    // Tense-only a11y: link prompt to options and enable keyboard navigation.
    try {
      if (optionsEl) {
        if (q && q.gameType === "tense") {
          optionsEl.setAttribute("aria-describedby", "play-question-text");
          Games._wireTenseKeyboardNav();
        } else {
          optionsEl.removeAttribute("aria-describedby");
        }
      }
    } catch (eAD) {}

    // Game 8 Word Order Surgery: lock UI to custom renderer (no Punjabi toggle behavior)
    var screenPlay = document.getElementById("screen-play");
    var isWordOrder = !!(q && q.gameType === "wordOrderSurgery");
    try {
      if (screenPlay && isWordOrder) screenPlay.classList.add("is-word-order-surgery");
    } catch (e0) {}

    // Hide default Next row for this game; Next is rendered in the bottom dock only when solved.
    if (nextRow) nextRow.style.display = isWordOrder ? "none" : "";

    // Goal + example
    var punjabiOn = Games.isPunjabiOn();
    if (goalEl) goalEl.textContent = punjabiOn && q.goalPa ? (q.goalEn + " / " + q.goalPa) : q.goalEn;
    if (exEl) exEl.textContent = punjabiOn && q.examplePa ? (q.exampleEn + " / " + q.examplePa) : q.exampleEn;

    // How-to + progress (shared across games)
    Games.updateProgressUI();

    // Track label
    var tn = (typeof TRACKS !== "undefined" && TRACKS && TRACKS[q.trackId]) ? TRACKS[q.trackId].name : "";
    if (trackLabelEl) trackLabelEl.textContent = tn ? ("Track: " + tn) : ("Track: " + String(q.trackId || ""));

    // Prompt (supports either promptEn/promptPa or prompt:{en,pa})
    if (qTextEl) {
      // Word Order Surgery owns its own instruction strip; keep this area empty.
      if (isWordOrder) {
        qTextEl.textContent = "";
      }

      var promptEn = q.promptEn || "";
      var promptPa = q.promptPa || "";
      try {
        if (q.prompt && typeof q.prompt === "object") {
          if (!promptEn && q.prompt.en) promptEn = String(q.prompt.en || "");
          if (!promptPa && q.prompt.pa) promptPa = String(q.prompt.pa || "");
        }
      } catch (e) {}

      // Game 6: Punjabi → English only. Display the Punjabi word as the prompt.
      // (Avoid long English question framing for younger learners.)
      var isGame6 = (r.mode === "normal") && String(r.gameId || "") === "game6" && q.gameType === "vocabTranslation";
      if (!isWordOrder && isGame6) {
        var m = String(promptEn || "");
        var extracted = "";
        try {
          var match = m.match(/"([^"]+)"/);
          if (match && match[1]) extracted = String(match[1] || "");
        } catch (e3) {}
        var wordPa = extracted || m;

        qTextEl.innerHTML = "";
        var paOnly = document.createElement("div");
        paOnly.className = "g6-prompt-pa";
        paOnly.setAttribute("lang", "pa");
        paOnly.textContent = wordPa;
        qTextEl.appendChild(paOnly);
      }

      // Respect suppressPromptPa flag (data-driven UX policy for translation games).
      // For translation questions, showing the Punjabi prompt is redundant: the question
      // is essentially asked twice with the same structure, which can leak answer patterns.
      // Example: "What is ਨੀਲਾ in English?" + "ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਨੀਲਾ ਕੀ ਹੈ?" (same structure, different language)
      var suppressPromptPa = !!(q && q.suppressPromptPa);
      var showPromptPa = !suppressPromptPa && punjabiOn && promptPa;

      // Game 3: show clue chips above the highlighted sentence (tense only).
      var isStoryDetectivePrompt = !!(q && q.gameType === "storyDetective");
      var isTensePrompt = !!(q && q.gameType === "tense");
      if (!isWordOrder && !isGame6 && isStoryDetectivePrompt) {
        qTextEl.textContent = punjabiOn ? "ਗਲਤ ਲਾਈਨ ਠੀਕ ਕਰੋ / Fix the wrong line" : "Fix the wrong line";
      } else if (!isWordOrder && !isGame6 && isTensePrompt) {
        var promptEnHtml = Games._highlightTenseCluesHtml(promptEn || "");
        var clues = Games._extractTenseClues(promptEn || "");

        qTextEl.innerHTML = "";

        if (clues && clues.length) {
          var chips = document.createElement("div");
          chips.className = "g3-clue-chips";
          for (var ci = 0; ci < clues.length; ci++) {
            var chip = document.createElement("span");
            chip.className = "tense-clue-chip";
            chip.textContent = clues[ci];
            chips.appendChild(chip);
          }
          qTextEl.appendChild(chips);
        }

        var sentence = document.createElement("div");
        sentence.className = "g3-sentence";
        sentence.innerHTML = promptEnHtml;
        qTextEl.appendChild(sentence);

        if (showPromptPa) {
          var pa = document.createElement("div");
          pa.setAttribute("lang", "pa");
          pa.textContent = promptPa;
          qTextEl.appendChild(pa);
        }
      } else if (!isWordOrder && !isGame6 && showPromptPa) {
        qTextEl.innerHTML = "";
        var en = document.createElement("div");
        en.textContent = promptEn || "";
        qTextEl.appendChild(en);
        var pa2 = document.createElement("div");
        pa2.setAttribute("lang", "pa");
        pa2.textContent = promptPa;
        qTextEl.appendChild(pa2);
      } else if (!isWordOrder && !isGame6) {
        qTextEl.textContent = promptEn || "";
      }
    }

    // Render options per game type
    if (!optionsEl) return;

    if (q.gameType === "tapWord") {
      Games._renderTapWordQuestion(q, optionsEl);
    } else if (q.gameType === "pos") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "tense") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "sentenceCheck") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "convoReply") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "vocabTranslation") {
      Games._renderChoiceQuestion(q, optionsEl);
    } else if (q.gameType === "wordOrderSurgery") {
      Games._renderWordOrderSurgeryQuestion(q, optionsEl);
    } else if (q.gameType === "storyDetective") {
      Games._renderStoryDetectiveQuestion(q, optionsEl);
    }

    // Re-apply preserved feedback if requested.
    if (_preserveFeedback) {
      try {
        Games.renderFeedback(_preserveFeedback);
      } catch (ePF1) {}
      try {
        if (Games.runtime) Games.runtime._preserveFeedbackOnce = null;
      } catch (ePF2) {}
    }

    // Game 4: ergonomics + focus
    if (isGame4) {
      try {
        var btns4 = optionsEl.querySelectorAll("button");
        for (var b4 = 0; b4 < btns4.length; b4++) btns4[b4].classList.add("g4-option");
      } catch (e4a) {}
      Games._focusGame4AfterRender();
    }

    // Game 2 only: show Hint/Why toggles (injected above feedback)
    Games._renderPosHintWhy(q);

    Games.updateScoreUI();
    Games._saveSessionToState();
  },

  _renderRemovedLegacyRenderer: function() {
    return;
  },

  // ===== Debug-only start hook for Game 8 =====
  _debugStartGame8WordOrder: function(difficultyStr) {
    // Dev-only: bank lint
    try { Games._validateGame8BankOnce(); } catch (e0) {}

    var diff = String(difficultyStr || "normal").toLowerCase().trim();
    if (diff !== "easy" && diff !== "normal" && diff !== "hard") diff = "normal";
    var diffNum = (diff === "easy") ? 1 : (diff === "hard" ? 3 : 2);

    // Setup legacy fields used by score panel
    var key = Games._getGameKey(8);
    Games.currentGameType = 8;
    Games.currentGameQuestionIndex = 0;
    Games.currentGameScore = 0;
    Games.currentGameStreak = 0;
    Games.currentGameBest = 0;

    try {
      if (State && State.state && State.state.session) {
        State.state.session.currentGameId = key;
        State.save();
      }
    } catch (e) {}

    var pool = Games.buildPoolForGameNum(8);
    if (!Array.isArray(pool)) pool = [];

    // Filter by authored difficulty; fallback to any if not enough.
    var filtered = pool.filter(function(q) { return q && (q.difficultyStr === diff); });
    if (filtered.length < 8) filtered = pool.slice();

    // Deterministic-ish selection per load, but still shuffled.
    var selected = Games.selectQuestions(filtered, "wordOrderSurgery", diffNum, 8, false, null);

    Games.beginRound({
      mode: "normal",
      gameId: key,
      label: "Game 8: Word Order Surgery",
      difficulty: diffNum,
      questions: selected,
      onDone: null,
      seed: null
    });

    try { UI.goTo("screen-play"); } catch (e2) {}
  },

  _ensureGame3RoundUi: function() {
    var anchor = document.getElementById("play-track-label");
    if (!anchor || !anchor.parentNode) return null;

    var wrap = document.getElementById("g3-ui-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "g3-ui-wrap";
      // Insert directly under the title row (before Track label)
      anchor.parentNode.insertBefore(wrap, anchor);
    }

    function ensureEl(id, tag, className) {
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement(tag);
        el.id = id;
        if (className) el.className = className;
        wrap.appendChild(el);
      }
      return el;
    }

    var howto = ensureEl("g3-howto", "div", "section-subtitle");
    var progress = ensureEl("g3-progress", "div", "section-subtitle");
    var streak = ensureEl("g3-streak", "div", "section-subtitle g3-streak");
    var rule = ensureEl("g3-rule-reminder", "div", "section-subtitle rule-reminder");
    var feedback = ensureEl("g3-feedback", "div", "feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("aria-atomic", "true");

    var target = ensureEl("g3-target-tense", "div", "section-subtitle g3-target-tense");

    // Enhancement 3: Static verb-form cues (shown first 3 Qs)
    var cuesRow = ensureEl("g3-cues-row", "div", "section-subtitle");
    try { cuesRow.classList.add("g3-cues-row"); } catch (e) {}

    var btnRow = ensureEl("g3-why-row", "div", "button-row");

    // Enhancement 2: Focus button
    var focusBtn = document.getElementById("g3-focus-button");
    if (!focusBtn) {
      focusBtn = document.createElement("button");
      focusBtn.type = "button";
      focusBtn.id = "g3-focus-button";
      focusBtn.className = "btn btn-secondary btn-small";
      focusBtn.innerHTML = '<span class="btn-label-en">Focus sentence</span><span class="btn-label-pa" lang="pa">ਵਾਕ \'ਤੇ ਫੋਕਸ</span>';
      btnRow.insertBefore(focusBtn, btnRow.firstChild);

      // Bind focus logic once
      try {
        if (!(focusBtn.dataset && focusBtn.dataset.bound)) {
          focusBtn.dataset.bound = "1";
          focusBtn.addEventListener("click", function() {
            var prompt = document.getElementById("play-question-text");
            if (prompt) {
              if (!prompt.hasAttribute("tabindex")) {
                prompt.setAttribute("tabindex", "-1");
              }
              prompt.focus();
              try { prompt.scrollIntoView({ block: "nearest" }); } catch (e) {}
            }
          });
        }
      } catch (e) {}
    }

    var whyBtn = document.getElementById("g3-why-toggle");
    if (!whyBtn) {
      whyBtn = document.createElement("button");
      whyBtn.type = "button";
      whyBtn.id = "g3-why-toggle";
      whyBtn.className = "btn btn-secondary btn-small";
      whyBtn.setAttribute("aria-controls", "g3-explanation");
      whyBtn.setAttribute("aria-expanded", "false");
      whyBtn.innerHTML = '<span class="btn-label-en">Explanation</span><span class="btn-label-pa" lang="pa">ਵਜਾਹ</span>';
      btnRow.appendChild(whyBtn);
    }

    var newClueBtn = document.getElementById("g3-newclue");
    if (!newClueBtn) {
      newClueBtn = document.createElement("button");
      newClueBtn.type = "button";
      newClueBtn.id = "g3-newclue";
      newClueBtn.className = "btn btn-secondary btn-small";
      newClueBtn.textContent = "New clue";
      btnRow.appendChild(newClueBtn);
    }
    try {
      if (!(newClueBtn.dataset && newClueBtn.dataset.bound)) {
        newClueBtn.dataset.bound = "1";
        newClueBtn.addEventListener("click", function() {
          try { Games.next(); } catch (eN0) {}
        });
      }
    } catch (eN1) {}

    var confRow = document.getElementById("g3-confidence");
    try {
      if (confRow && confRow.parentNode) confRow.parentNode.removeChild(confRow);
    } catch (e4) {}

    var traps = ensureEl("g3-traps", "details", "g3-traps");
    try {
      if (!(traps.dataset && traps.dataset.built === "1")) {
        traps.dataset.built = "1";
        traps.innerHTML = "";
        var sum = document.createElement("summary");
        sum.textContent = "Common tense traps";
        traps.appendChild(sum);
        var trapsBody = document.createElement("div");
        trapsBody.className = "g3-traps__body";
        trapsBody.innerHTML = "<div>will → future</div><div>ago / yesterday → past</div><div>now / today → present</div>";
        traps.appendChild(trapsBody);
      }
    } catch (e5) {}

    var exp = ensureEl("g3-explanation", "div", "section-subtitle");
    exp.setAttribute("role", "region");
    exp.setAttribute("aria-label", "Explanation");
    if (!exp.hasAttribute("tabindex")) exp.setAttribute("tabindex", "-1");

    // Bind once
    try {
      if (!(whyBtn.dataset && whyBtn.dataset.bound)) {
        whyBtn.dataset.bound = "1";
        whyBtn.addEventListener("click", function() {
          var panel = document.getElementById("g3-explanation");
          if (!panel) return;
          var open = !(panel.dataset && panel.dataset.open === "1");
          Games._setGame3ExplanationOpen(open);
        });
      }
    } catch (e) {}

    return { wrap: wrap, howto: howto, progress: progress, streak: streak, rule: rule, feedback: feedback, target: target, cuesRow: cuesRow, focusBtn: focusBtn, whyBtn: whyBtn, newClueBtn: newClueBtn, confRow: null, traps: traps, exp: exp };
  },

  _setGame3ExplanationOpen: function(isOpen) {
    var panel = document.getElementById("g3-explanation");
    var btn = document.getElementById("g3-why-toggle");
    if (panel) {
      panel.dataset.open = isOpen ? "1" : "0";
      panel.style.display = isOpen ? "block" : "none";

      // Why: when auto-opened after a wrong answer, keep it discoverable on small screens.
      if (isOpen) {
        try { panel.scrollIntoView({ block: "nearest" }); } catch (e0) {}
        try { panel.focus({ preventScroll: true }); } catch (e1) {}
      }
    }
    if (btn) {
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  },

  _escapeHtml: function(s) {
    // Why: prompts can be authored content; keep HTML injection impossible.
    var str = String(s == null ? "" : s);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  _highlightTenseCluesHtml: function(textEn) {
    var safe = Games._escapeHtml(textEn);

    // Minimal, explicit list only (no NLP).
    var clues = ["yesterday", "today", "tomorrow", "now", "last", "next", "will", "ago"];
    try {
      var re = new RegExp("\\b(" + clues.join("|") + ")\\b", "gi");
      return safe.replace(re, function(m) {
        return '<span class="tense-clue">' + m + "</span>";
      });
    } catch (e) {
      return safe;
    }
  },

  _extractTenseClues: function(textEn) {
    var s0 = String(textEn || "");
    var out = [];
    var seen = {};
    var clues = ["yesterday", "today", "tomorrow", "now", "last", "next", "will", "ago"];
    for (var i = 0; i < clues.length; i++) {
      try {
        var w = clues[i];
        var re = new RegExp("\\b" + w + "\\b", "i");
        if (re.test(s0) && !seen[w]) {
          seen[w] = true;
          out.push(w);
        }
      } catch (e) {}
    }
    return out;
  },

  _getTenseIdForQuestion: function(q) {
    if (!q) return "";
    try {
      if (q.correctChoiceId) return String(q.correctChoiceId).toUpperCase();
      if (q.correctTense) return String(q.correctTense).toUpperCase();
      var tag = (Array.isArray(q.tags) && q.tags[0]) ? String(q.tags[0]) : "";
      if (tag.indexOf("TENSE:") === 0) return (tag.split(":")[1] || "");
    } catch (e) {}
    return "";
  },

  _formatGame3Explanation: function(q, correctAnswerEn, correctAnswerPa) {
    var punjabiOn = Games.isPunjabiOn();
    var clueList = Games._extractTenseClues(q && q.promptEn ? q.promptEn : "");
    var clueText = clueList.length ? clueList.join(", ") : "time clue";

    var tenseId = Games._getTenseIdForQuestion(q);
    var tenseEn = (typeof getTenseLabel === "function") ? (getTenseLabel(tenseId, { lang: "en" }) || "") : "";
    if (!tenseEn && typeof TENSE_LABELS !== "undefined" && TENSE_LABELS) tenseEn = TENSE_LABELS[tenseId] || "";
    if (!tenseEn) tenseEn = tenseId ? tenseId : "tense";

    var tensePa = "";
    if (punjabiOn) {
      tensePa = (typeof getTenseLabel === "function") ? (getTenseLabel(tenseId, { lang: "pa" }) || "") : "";
      if (!tensePa && typeof TENSE_LABELS_PA !== "undefined" && TENSE_LABELS_PA) tensePa = TENSE_LABELS_PA[tenseId] || "";
    }

    var expText = Games._pickActiveExplanationText(q) || "";
    var becauseEn = "Because: " + clueText + " → " + tenseEn + (expText ? (" • " + expText) : "");
    var becausePa = punjabiOn ? ("ਕਿਉਂ: " + clueText + " → " + (tensePa || tenseEn) + (expText ? (" • " + expText) : "")) : "";
    var exampleEn = "Example: " + String(correctAnswerEn || "");
    var examplePa = punjabiOn ? ("ਉਦਾਹਰਨ: " + String(correctAnswerPa || correctAnswerEn || "")) : "";
    return { becauseEn: becauseEn, becausePa: becausePa, exampleEn: exampleEn, examplePa: examplePa, tenseEn: tenseEn, tenseId: tenseId };
  },

  _wireTenseKeyboardNav: function() {
    try {
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      if (optionsEl.dataset && optionsEl.dataset.tenseKeysBound === "1") return;
      if (!optionsEl.dataset) optionsEl.dataset = {};
      optionsEl.dataset.tenseKeysBound = "1";
      optionsEl.addEventListener("keydown", function(e) {
        try {
          var r = Games.runtime.round;
          if (!r || r.completed) return;
          var q = r.questions[r.idx];
          if (!q || q.gameType !== "tense") return;
          var key = e.key || "";
          if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Enter") return;
          var btns = optionsEl.querySelectorAll("button");
          if (!btns || !btns.length) return;
          var active = document.activeElement;
          var idx = -1;
          for (var i = 0; i < btns.length; i++) { if (btns[i] === active) { idx = i; break; } }
          if (key === "ArrowDown" || key === "ArrowUp") {
            e.preventDefault();
            if (idx < 0) idx = 0;
            var next = (key === "ArrowDown") ? (idx + 1) : (idx - 1);
            if (next < 0) next = btns.length - 1;
            if (next >= btns.length) next = 0;
            try { btns[next].focus(); } catch (e2) {}
            return;
          }
          if (key === "Enter") {
            if (idx >= 0 && btns[idx] && !btns[idx].disabled) {
              e.preventDefault();
              try { btns[idx].click(); } catch (e3) {}
            }
          }
        } catch (e0) {}
      });
    } catch (e) {}
  },

  _applyTenseChoiceLockAndMarks: function(chosenIndex, correctIndex) {
    // Why: Game 3 is single-attempt; locking prevents double-taps and clarifies the right answer.
    try {
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      var btns = optionsEl.querySelectorAll("button");
      if (!btns || !btns.length) return;

      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        b.disabled = true;
        b.classList.remove("is-selected", "is-correct", "is-wrong");
      }

      if (chosenIndex != null && btns[chosenIndex]) {
        btns[chosenIndex].classList.add("is-selected");
      }
      if (typeof correctIndex === "number" && correctIndex >= 0 && btns[correctIndex]) {
        btns[correctIndex].classList.add("is-correct");
      }
      if (typeof correctIndex === "number" && chosenIndex !== correctIndex && btns[chosenIndex]) {
        btns[chosenIndex].classList.add("is-wrong");
      }
    } catch (e) {}
  },

  _resetGame3RoundUi: function(q, r) {
    var fb = document.getElementById("play-feedback");
    var isTense = !!(q && q.gameType === "tense");

    // Show default play-feedback for non-tense games.
    if (fb) fb.style.display = isTense ? "none" : "";

    // If not a tense question, also hide the injected wrapper if present.
    var wrap = document.getElementById("g3-ui-wrap");
    if (!isTense) {
      if (wrap) wrap.style.display = "none";
      return;
    }

    var ui = Games._ensureGame3RoundUi();
    if (!ui) return;
    ui.wrap.style.display = "block";

    var punjabiOn = Games.isPunjabiOn();
    var idx = (r && typeof r.idx === "number") ? r.idx : 0;
    var total = (r && Array.isArray(r.questions)) ? r.questions.length : 10;

    // How-to: first 2 questions only.
    if (idx < 2) {
      ui.howto.style.display = "block";
      ui.howto.textContent = punjabiOn ? (Games.GAME3_UI.howtoEn + " / " + Games.GAME3_UI.howtoPa) : Games.GAME3_UI.howtoEn;
    } else {
      ui.howto.textContent = "";
      ui.howto.style.display = "none";
    }

    // Enhancement 3: Static verb-form cues (shown first 3 Qs only)
    if (idx < 3) {
      ui.cuesRow.style.display = "block";
      ui.cuesRow.textContent = punjabiOn
        ? "Present: ਹੁਣ / ਹਰ ਰੋਜ਼ / am-is-are + -ing  |  Past: ਭੀਤਾ / -ed / was-were  |  Future: will / ਭਲਕੇ"
        : "Present: now / every day / am-is-are + -ing  |  Past: -ed / was-were  |  Future: will / tomorrow";
    } else {
      ui.cuesRow.textContent = "";
      ui.cuesRow.style.display = "none";
    }

    // Progress: always visible.
    ui.progress.style.display = "block";
    ui.progress.textContent = punjabiOn
      ? (Games.GAME3_UI.progressEn(idx + 1, total) + " / " + Games.GAME3_UI.progressPa(idx + 1, total))
      : Games.GAME3_UI.progressEn(idx + 1, total);

    try {
      ui.streak.style.display = "block";
      ui.streak.textContent = "Streak: " + String(Games.currentGameStreak || 0);
    } catch (eS1) {}

    try {
      ui.rule.style.display = "block";
      ui.rule.textContent = "Pick the tense that matches the time clue.";
    } catch (eR1) {}

    try { if (ui.traps) ui.traps.style.display = "block"; } catch (eTR) {}

    // Clear feedback + hide Why/explanation until answered.
    ui.feedback.className = "feedback";
    ui.feedback.innerHTML = "";
    try { ui.target.textContent = ""; ui.target.style.display = "none"; } catch (eT1) {}
    ui.focusBtn.style.display = "inline-flex";
    ui.whyBtn.style.display = "none";
    try { ui.newClueBtn.style.display = "none"; } catch (eNC0) {}
    ui.exp.textContent = "";
    Games._setGame3ExplanationOpen(false);
  },

  _renderTapWordQuestion: function(q, optionsEl) {
    optionsEl.classList.add("g1-sentence");
    // Preserve existing token styling but render inline (natural spacing).
    try {
      optionsEl.style.display = "block";
      optionsEl.style.gap = "";
    } catch (e0) {}

    var wordTokens = Array.isArray(q.tokens) ? q.tokens : [];
    var spans = Array.isArray(q.tokenSpans) ? q.tokenSpans : null;

    function needsSpace(prev, cur) {
      if (!prev || !cur) return false;
      if (cur.type === "punct") {
        if (cur.isJoiner) return false;
        if (cur.isCloser) return false;
        // opener punctuation
        return (prev.type === "word") || (prev.type === "punct" && prev.isCloser);
      }
      // cur is word
      if (prev.type === "punct") {
        if (prev.isJoiner) return false;
        if (prev.isOpener) return false;
        return true;
      }
      return true;
    }

    // V2 path (preferred)
    if (spans && spans.length) {
      var prev = null;
      var wIdx = 0;
      for (var i = 0; i < spans.length; i++) {
        var t = spans[i];
        if (!t || !t.type) continue;

        if (needsSpace(prev, t)) {
          optionsEl.appendChild(document.createTextNode(" "));
        }

        if (t.type === "word") {
          (function(idxWord, textWord) {
            var btn = document.createElement("button");
            btn.className = "btn btn-secondary g1-token";
            btn.type = "button";
            btn.textContent = String(textWord == null ? "" : textWord);
            btn.setAttribute("data-word-idx", String(idxWord));
            btn.addEventListener("click", function() {
              Games.submitChoice(idxWord);
            });
            optionsEl.appendChild(btn);
          })(wIdx, t.text);
          wIdx++;
        } else {
          var sp = document.createElement("span");
          sp.className = "g1-punct";
          sp.textContent = String(t.text == null ? "" : t.text);
          optionsEl.appendChild(sp);
        }

        prev = t;
      }
      return;
    }

    // Fallback (legacy): all tokens are tappable
    for (var j = 0; j < wordTokens.length; j++) {
      (function(idx) {
        var btn2 = document.createElement("button");
        btn2.className = "btn btn-secondary g1-token";
        btn2.type = "button";
        btn2.textContent = String(wordTokens[idx]);
        btn2.addEventListener("click", function() {
          Games.submitChoice(idx);
        });
        optionsEl.appendChild(btn2);
      })(j);
      if (j < wordTokens.length - 1) optionsEl.appendChild(document.createTextNode(" "));
    }
  },

  _buildOptionSetForDifficulty: function(q) {
    // For pos/tense/storyDetective, reduce option count based on difficulty.
    if (q && (q.gameType === "pos" || q.gameType === "tense" || q.gameType === "storyDetective") && Array.isArray(q._difficultyAllIds)) {
      var allIds = q._difficultyAllIds;
      var allLabels = q._difficultyAllLabels;
      var allLabelsPa = Array.isArray(q._difficultyAllLabelsPa) ? q._difficultyAllLabelsPa : null;
      var keepCount = q._difficultyKeepCount || allIds.length;
      keepCount = Math.max(3, Math.min(allIds.length, keepCount));

      var correctId = (q.correctIndex >= 0 && q.correctIndex < allIds.length) ? allIds[q.correctIndex] : null;

      // Cache stable option subsets per question in normal mode (prevents reshuffle on re-render).
      // Keep logic deterministic in custom mode.
      var qid = q.qid || "";
      var cacheKey = null;
      if (q.gameType === "pos" || q.gameType === "tense" || q.gameType === "storyDetective") {
        cacheKey = String(qid) + ":" + String(keepCount);
        var cached = Games.runtime && Games.runtime._optionSetCache ? Games.runtime._optionSetCache[cacheKey] : null;
        if (cached && Array.isArray(cached.optionIds) && Array.isArray(cached.optionLabels)) {
          return cached;
        }
      }

      // Deterministic in custom mode, random (but cached) in normal
      var rng = (Games.runtime.mode === "custom")
        ? Games._seededRng(hashStringToInt((qid || "") + ":" + String(keepCount)))
        : Math.random;

      var distractorIds = allIds.filter(function(id) { return id !== correctId; });
      // shuffle
      for (var i = distractorIds.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = distractorIds[i];
        distractorIds[i] = distractorIds[j];
        distractorIds[j] = tmp;
      }

      var chosenIds = [];
      if (correctId != null) chosenIds.push(correctId);
      for (var k = 0; k < distractorIds.length && chosenIds.length < keepCount; k++) {
        chosenIds.push(distractorIds[k]);
      }

      // shuffle final
      for (var a = chosenIds.length - 1; a > 0; a--) {
        var b = Math.floor(rng() * (a + 1));
        var t2 = chosenIds[a];
        chosenIds[a] = chosenIds[b];
        chosenIds[b] = t2;
      }

      var opts = chosenIds.map(function(id) {
        var idx = allIds.indexOf(id);
        return { id: id, label: allLabels[idx], labelPa: allLabelsPa ? (allLabelsPa[idx] || "") : "" };
      });

      var built = {
        optionIds: opts.map(function(o) { return o.id; }),
        optionLabels: opts.map(function(o) { return o.label; }),
        optionLabelsPa: opts.map(function(o) { return o.labelPa; }),
        correctIndex: chosenIds.indexOf(correctId)
      };

      if ((q.gameType === "pos" || q.gameType === "tense" || q.gameType === "storyDetective") && cacheKey && Games.runtime && Games.runtime._optionSetCache) {
        Games.runtime._optionSetCache[cacheKey] = built;
      }

      return built;
    }

    // sentenceCheck (and other simple choice games) use optionsEn
    if (q && Array.isArray(q.optionsEn) && typeof q.correctIndex === "number") {
      var labelsEn = [];
      var labelsPa = null;

      // Allow optionsEn to be either strings OR bilingual objects {en,pa}.
      if (q.optionsEn.length && q.optionsEn[0] && typeof q.optionsEn[0] === "object") {
        labelsEn = q.optionsEn.map(function(o) { return (o && o.en != null) ? String(o.en || "") : ""; });
        labelsPa = q.optionsEn.map(function(o) { return (o && o.pa != null) ? String(o.pa || "") : ""; });
      } else {
        labelsEn = q.optionsEn.map(function(s) { return String(s || ""); });
      }

      // If explicit optionsPa exists, prefer it (supports partial Punjabi arrays).
      if (Array.isArray(q.optionsPa)) {
        labelsPa = labelsEn.map(function(_, i) {
          return (q.optionsPa && q.optionsPa[i] != null) ? String(q.optionsPa[i] || "") : "";
        });
      }

      // Game 5 (convoReply): shuffle answer placement so the correct answer
      // isn't consistently in the same visual position.
      // - Custom mode: deterministic per question.
      // - Non-custom modes: randomized but cached to avoid reshuffle on re-render.
      if (q.gameType === "convoReply") {
        var qid2 = q.qid || "";
        var cacheKey2 = null;
        if (Games.runtime && Games.runtime.mode !== "custom") {
          cacheKey2 = "g5:" + String(qid2 || "") + ":full";
          var cached2 = Games.runtime && Games.runtime._optionSetCache ? Games.runtime._optionSetCache[cacheKey2] : null;
          if (cached2 && Array.isArray(cached2.optionIds) && Array.isArray(cached2.optionLabels)) {
            return cached2;
          }
        }

        var rng2 = (Games.runtime && Games.runtime.mode === "custom")
          ? Games._seededRng(hashStringToInt("g5:" + String(qid2 || "") + ":full"))
          : Math.random;

        var order = labelsEn.map(function(_, i) { return i; });
        for (var s = order.length - 1; s > 0; s--) {
          var j2 = Math.floor(rng2() * (s + 1));
          var tmp2 = order[s];
          order[s] = order[j2];
          order[j2] = tmp2;
        }

        var origCorrect2 = q.correctIndex | 0;
        var built2 = {
          optionIds: order.map(function(i) { return String(i); }),
          optionLabels: order.map(function(i) { return String(labelsEn[i] || ""); }),
          optionLabelsPa: labelsPa ? order.map(function(i) { return (labelsPa && labelsPa[i] != null) ? String(labelsPa[i] || "") : ""; }) : null,
          correctIndex: order.indexOf(origCorrect2)
        };

        if (cacheKey2 && Games.runtime && Games.runtime._optionSetCache) {
          Games.runtime._optionSetCache[cacheKey2] = built2;
        }

        return built2;
      }

      return {
        optionIds: labelsEn.map(function(_, i) { return String(i); }),
        optionLabels: labelsEn.slice(),
        optionLabelsPa: labelsPa,
        correctIndex: q.correctIndex
      };
    }

    return { optionIds: [], optionLabels: [], optionLabelsPa: null, correctIndex: -1 };
  },

  _renderChoiceQuestion: function(q, optionsEl) {
    // Apply difficulty config
    Games.applyDifficultyToQuestion(q, Games.runtime.round ? Games.runtime.round.difficulty : 2);
    var set = Games._buildOptionSetForDifficulty(q);

    // Store the effective correctIndex for this render
    q._effectiveOptionIds = set.optionIds;
    q._effectiveCorrectIndex = set.correctIndex;
    q._effectiveOptionSet = set;

    var punjabiOn = Games.isPunjabiOn();

    for (var i = 0; i < set.optionLabels.length; i++) {
      (function(idx) {
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary";

        var en = String(set.optionLabels[idx] || "");
        var pa = (set.optionLabelsPa && set.optionLabelsPa[idx]) ? String(set.optionLabelsPa[idx]) : "";
        
        // Respect suppressChoicePa flag (data-driven approach, not game-type specific).
        // This prevents answer giveaway in translation games where the prompt already
        // contains the Punjabi word, making the correct button an exact visual match.
        // Example: prompt "What is ਬਿੱਲੀ?" with choice "cat / ਬਿੱਲੀ" creates visual matching instead of translation.
        var suppressPa = !!(q && q.suppressChoicePa);
        var showChoicePa = !suppressPa && punjabiOn && pa;
        
        if (showChoicePa) {
          btn.innerHTML = "";
          // Game 2: Punjabi-first labels when Punjabi mode is on.
          if (q && q.gameType === "pos") {
            var paDivFirst = document.createElement("div");
            paDivFirst.setAttribute("lang", "pa");
            paDivFirst.textContent = pa;
            btn.appendChild(paDivFirst);
            var enDivSecond = document.createElement("div");
            enDivSecond.style.opacity = "0.9";
            enDivSecond.textContent = en;
            btn.appendChild(enDivSecond);
          } else if (q && q.gameType === "tense") {
            // Game 3: bilingual label in one line when Punjabi mode is on.
            btn.textContent = en + " (" + pa + ")";
          } else {
            var enDiv = document.createElement("div");
            enDiv.textContent = en;
            btn.appendChild(enDiv);
            var paDiv = document.createElement("div");
            paDiv.setAttribute("lang", "pa");
            paDiv.style.opacity = "0.9";
            paDiv.textContent = pa;
            btn.appendChild(paDiv);
          }
        } else {
          btn.textContent = en;
        }

        btn.addEventListener("click", function() {
          Games.submitChoice(idx);
        });
        optionsEl.appendChild(btn);
      })(i);
    }
  },

  _renderStoryDetectiveQuestion: function(q, optionsEl) {
    if (!q || !optionsEl) return;

    var punjabiOn = Games.isPunjabiOn();
    var lines = Array.isArray(q.storyLinesEn) ? q.storyLinesEn : [];
    var currentIdx = (typeof q.currentStoryLineIndex === "number" && isFinite(q.currentStoryLineIndex)) ? (q.currentStoryLineIndex | 0) : 0;
    var total = (typeof q.totalStoryMistakes === "number" && isFinite(q.totalStoryMistakes)) ? (q.totalStoryMistakes | 0) : 3;
    if (total <= 0) total = 3;

    var top = document.createElement("div");
    top.className = "section-subtitle";
    var enTop = "Step " + String(currentIdx + 1) + "/" + String(total) + ": fix the highlighted sentence.";
    var paTop = "ਕਦਮ " + String(currentIdx + 1) + "/" + String(total) + ": ਹਾਈਲਾਈਟ ਕੀਤੀ ਲਾਈਨ ਠੀਕ ਕਰੋ।";
    top.textContent = punjabiOn ? (enTop + " / " + paTop) : enTop;
    optionsEl.appendChild(top);

    var storyCard = document.createElement("div");
    storyCard.className = "card";
    storyCard.style.marginTop = "8px";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "14px";
    title.textContent = "Story: " + String(q.storyTitleEn || "Case");
    storyCard.appendChild(title);

    for (var i = 0; i < lines.length; i++) {
      var line = document.createElement("div");
      line.className = "section-subtitle";
      line.style.marginTop = "4px";
      line.style.padding = "4px 6px";
      line.style.borderRadius = "8px";
      if (i === currentIdx) {
        line.style.fontWeight = "700";
        line.style.border = "1px solid rgba(0,0,0,0.12)";
      }
      line.textContent = String(i + 1) + ") " + String(lines[i] || "");
      storyCard.appendChild(line);
    }

    optionsEl.appendChild(storyCard);

    var choose = document.createElement("div");
    choose.className = "section-subtitle";
    choose.style.marginTop = "8px";
    var enChoose = "Choose the best correction:";
    var paChoose = "ਸਭ ਤੋਂ ਵਧੀਆ ਠੀਕ ਵਾਕ ਚੁਣੋ:";
    choose.textContent = punjabiOn ? (enChoose + " / " + paChoose) : enChoose;
    optionsEl.appendChild(choose);

    Games._renderChoiceQuestion(q, optionsEl);
  },

  // ===== Submission / Feedback =====
  submitChoice: function(choiceIndex) {
    var r = Games.runtime.round;
    if (!r || r.completed) return;
    var q = r.questions[r.idx];
    if (!q) return;

    // Guard: if question already completed (Next enabled), ignore.
    var nextBtn = document.getElementById("btn-play-next");
    if (nextBtn && !nextBtn.disabled) return;

    var qid = q.qid;
    if (!qid) qid = "Q_" + String(r.idx);

    // P0 v2 dwell gate: if this question has resolved and we're waiting to enable Next,
    // ignore further taps to prevent extra attempts/side-effects.
    try {
      if (Games.runtime && Games.runtime._nextPending && String(Games.runtime._nextPendingQid || "") === String(qid)) {
        return;
      }
    } catch (eNP) {}

    var resolveStartTs = Date.now();

    // Game 5 (convoReply): single-submit UX + input lock to prevent double-awards.
    // This is scoped to convoReply so other games can keep multi-attempt learning flow.
    if (q.gameType === "convoReply") {
      if (Games.runtime.inputLocked) return;
      if (Games.runtime._answeredQid === qid) return;
      Games.runtime.inputLocked = true;
      Games.runtime._answeredQid = qid;
      Games._setPlayOptionsEnabled(false);
    }
    if (typeof Games.runtime.attemptsByQid[qid] !== "number") Games.runtime.attemptsByQid[qid] = 0;
    var attemptIndex = Games.runtime.attemptsByQid[qid] | 0;
    Games.runtime.attemptsByQid[qid] = attemptIndex + 1;

    var isCorrect = false;
    var chosenEn = "";
    var chosenPa = "";
    var correctAnswerEn = "";
    var correctAnswerPa = "";
    var correctIndexForUi = null;

    if (q.gameType === "tapWord") {
      var tokens = Array.isArray(q.tokens) ? q.tokens : [];
      var correctIdxs = Array.isArray(q.correctTokenIndices) ? q.correctTokenIndices.slice() : null;
      if (!correctIdxs || !correctIdxs.length) {
        if (typeof q.correctTokenIndex === "number" && isFinite(q.correctTokenIndex)) correctIdxs = [q.correctTokenIndex | 0];
      }
      if (Array.isArray(correctIdxs)) {
        correctIdxs = correctIdxs.filter(function(x) { return typeof x === "number" && isFinite(x) && x >= 0 && x < tokens.length; });
      }
      if (!tokens.length || !Array.isArray(correctIdxs) || !correctIdxs.length) {
        Games.renderFeedback({
          correct: false,
          gameType: q.gameType,
          showChosen: false,
          showCorrectAnswer: false,
          hintEn: "This question is unavailable. Tap Next.",
          hintPa: "ਇਹ ਸਵਾਲ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। Next ਦਬਾਓ।"
        });
          Games._enableNextAfterDwell(resolveStartTs, qid);
        return;
      }
      chosenEn = tokens[choiceIndex] != null ? String(tokens[choiceIndex]) : "";
      correctAnswerEn = (correctIdxs[0] != null && tokens[correctIdxs[0]] != null) ? String(tokens[correctIdxs[0]]) : "";
      // No per-token Punjabi available; avoid blanks by falling back to English token.
      chosenPa = chosenEn;
      correctAnswerPa = correctAnswerEn;
      isCorrect = (correctIdxs.indexOf(choiceIndex | 0) !== -1);

      // Token-local feedback (UI-only): mark just the clicked token as correct/wrong.
      // Keep this independent of scoring/flow.
      try {
        var optionsEl = document.getElementById("play-options");
        if (optionsEl) {
          var btns = optionsEl.querySelectorAll("button");
          for (var bi = 0; bi < btns.length; bi++) {
            btns[bi].classList.remove("is-correct", "is-wrong");
          }
          if (btns && btns[choiceIndex]) {
            btns[choiceIndex].classList.add(isCorrect ? "is-correct" : "is-wrong");
          }

          // If correct, keep all correct indices highlighted.
          if (isCorrect) {
            for (var ci = 0; ci < correctIdxs.length; ci++) {
              var k = correctIdxs[ci] | 0;
              if (btns && btns[k]) btns[k].classList.add("is-correct");
            }
          }

          // Auto-clear the wrong flash after a short delay
          if (!isCorrect) {
            if (Games.runtime._tapWordFlashTimer) {
              clearTimeout(Games.runtime._tapWordFlashTimer);
            }
            Games.runtime._tapWordFlashTimer = setTimeout(function() {
              try {
                var btns2 = optionsEl.querySelectorAll("button");
                if (btns2 && btns2[choiceIndex]) btns2[choiceIndex].classList.remove("is-wrong");
              } catch (e) {}
            }, 550);
          }
        }
      } catch (e) {}
    } else {
      // IMPORTANT: Use the same option set that was rendered.
      var set = q._effectiveOptionSet || Games._buildOptionSetForDifficulty(q);
      if (!set || !Array.isArray(set.optionLabels) || set.optionLabels.length < 2 || typeof set.correctIndex !== "number" || set.correctIndex < 0 || set.correctIndex >= set.optionLabels.length) {
        Games.renderFeedback({
          correct: false,
          gameType: q.gameType,
          showChosen: false,
          showCorrectAnswer: false,
          hintEn: "This question is unavailable. Tap Next.",
          hintPa: "ਇਹ ਸਵਾਲ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। Next ਦਬਾਓ।"
        });
          Games._enableNextAfterDwell(resolveStartTs, qid);
        return;
      }
      chosenEn = set.optionLabels[choiceIndex] != null ? String(set.optionLabels[choiceIndex]) : "";
      correctAnswerEn = set.optionLabels[set.correctIndex] != null ? String(set.optionLabels[set.correctIndex]) : "";
      chosenPa = (set.optionLabelsPa && set.optionLabelsPa[choiceIndex] != null) ? String(set.optionLabelsPa[choiceIndex]) : chosenEn;
      correctAnswerPa = (set.optionLabelsPa && set.optionLabelsPa[set.correctIndex] != null) ? String(set.optionLabelsPa[set.correctIndex]) : correctAnswerEn;
      isCorrect = (choiceIndex === set.correctIndex);
      correctIndexForUi = set.correctIndex;

    }

    // Game 4 (Sentence Check): UI-only option locking/marking.
    // Reveal correct only when the learning flow already reveals it (correct answer or attempt 2+ wrong).
    if (q.gameType === "sentenceCheck") {
      var revealCorrectNow = !!(isCorrect || (attemptIndex | 0) >= 1);
      Games._applyGame4ChoiceUi(choiceIndex, correctIndexForUi, attemptIndex, isCorrect, revealCorrectNow);
    }

    // Record attempt
    if (State && State.recordQuestionAttempt) {
      State.recordQuestionAttempt(q.trackId || "T_WORDS", !!isCorrect);
    }

    // ===== Game 5 (Conversation Coach) UX =====
    // - Single attempt per question (locks input)
    // - Minimal feedback: Correct / Not quite
    // - Optional Why? toggle (uses explanation fields when present)
    if (q.gameType === "convoReply") {
      var expBothG5 = Games._pickExplanationBoth(q);
      var lockCueBoth = "Answer locked — tap Next • ਜਵਾਬ ਲਾਕ ਹੋ ਗਿਆ — ਅੱਗੇ ਜਾਓ";

      if (isCorrect) {
        // XP award only once per question
        if (!Games.runtime.submitted) {
          Games.runtime.submitted = true;
          var xp5 = Games._xpEach();
          Games.currentGameScore = (Games.currentGameScore || 0) + xp5;
          Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
          Games.runtime.bestStreakInRound = Math.max((Games.runtime.bestStreakInRound | 0) || 0, (Games.currentGameStreak | 0) || 0);
          Games.runtime.correctCount += 1;

          if (State && State.awardXP) {
            State.awardXP(xp5, { reason: "game_correct_answer", trackId: q.trackId }, { section: "games", reason: "game_correct_answer" });
          }
        }

        Games.renderFeedback({
          gameType: q.gameType,
          correct: true,
          correctTextEn: "Correct",
          correctTextPa: "ਠੀਕ ਹੈ!",
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          hintEn: lockCueBoth,
          hintPa: lockCueBoth,
          explanationEn: "",
          explanationPa: ""
        });
      } else {
        Games.currentGameStreak = 0;
        Games.runtime.missesByQid[qid] = true;

        // Persistently mark missed for future "Nice improvement" detection
        Games._markPersistentlyMissed(qid);

        // Missed questions return within a few questions.
        Games._requeueMissedQuestion(qid, q);

        Games.renderFeedback({
          gameType: q.gameType,
          correct: false,
          showChosen: false,
          showCorrectAnswer: false,
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          hintEn: "Not quite.",
          hintPa: "ਠੀਕ ਨਹੀਂ।",
          explanationEn: lockCueBoth,
          explanationPa: lockCueBoth
        });
      }

      // Optional Why panel (only if explanation exists)
      Games._setPlayWhyExplanation(expBothG5);

      // Auto-open Why on wrong (once per question) when explanation exists.
      try {
        var hasWhy = !!(expBothG5 && (String(expBothG5.en || "").trim() || String(expBothG5.pa || "").trim()));
        var opened = Games.runtime._g5WhyAutoOpenedByQid || (Games.runtime._g5WhyAutoOpenedByQid = {});
        if (!isCorrect && hasWhy && !opened[qid]) {
          opened[qid] = true;
          var whyUi = Games._ensurePlayWhyUi();
          if (whyUi && whyUi.panel && whyUi.btn) {
            whyUi.panel.dataset.open = "1";
            whyUi.panel.style.display = "block";
            whyUi.btn.setAttribute("aria-expanded", "true");
          }
        }
      } catch (eWhy) {}

      Games.enableNext();

      // Keep header progress in sync (Game 5 uses Next-enabled as "answered" signal).
      Games.updateProgressUI();

      // Accessibility: announce feedback then focus the primary action.
      try {
        var fbEl = document.getElementById("play-feedback");
        if (fbEl) fbEl.focus();
      } catch (eF) {}
      setTimeout(function() {
        try {
          var nbtn = document.getElementById("btn-play-next");
          if (nbtn && !nbtn.disabled) nbtn.focus();
        } catch (eN) {}
      }, 0);

      Games.updateScoreUI();
      Games._saveSessionToState();
      return;
    }

    // ===== Game 3 (Tense) special UX =====
    // Low-risk learning UX: after any answer, show Why toggle; on wrong show chosen vs correct then auto-open explanation.
    // Keep scoring logic unchanged.
    if (q.gameType === "tense") {
      var ui = Games._ensureGame3RoundUi();
      var punjabiOnG3 = Games.isPunjabiOn();
      if (ui) {
        ui.whyBtn.style.display = "inline-flex";
      }

      // Lock answer choices + visually mark selected/correct (UI-only).
      Games._applyTenseChoiceLockAndMarks(choiceIndex, (typeof q._effectiveCorrectIndex === "number") ? q._effectiveCorrectIndex : (q._effectiveOptionSet ? q._effectiveOptionSet.correctIndex : null));

      try {
        if (ui) {
          ui.rule.style.display = "none";
          ui.newClueBtn.style.display = "inline-flex";
        }
      } catch (eG3P0) {}

      if (isCorrect) {
        // Preserve existing correct scoring behavior, but render Game 3 feedback in the injected panel.
        if (!Games.runtime.submitted) {
          Games.runtime.submitted = true;
          var xpG3 = Games._xpEach();
          Games.currentGameScore = (Games.currentGameScore || 0) + xpG3;
          Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
          Games.runtime.bestStreakInRound = Math.max((Games.runtime.bestStreakInRound | 0) || 0, (Games.currentGameStreak | 0) || 0);
          Games.runtime.correctCount += 1;

          if (State && State.awardXP) {
            State.awardXP(xpG3, { reason: "game_correct_answer", trackId: q.trackId }, { section: "games", reason: "game_correct_answer" });
          }

          if (Array.isArray(q.tags) && q.tags.length) {
            for (var tg = 0; tg < q.tags.length; tg++) {
              var tag2 = q.tags[tg];
              if (!Games.runtime.correctTags[tag2]) Games.runtime.correctTags[tag2] = 0;
              Games.runtime.correctTags[tag2] += 1;
            }
          }
        }

        // Render brief correct + keep explanation closed by default.
        try {
          if (ui) {
            ui.feedback.className = "feedback correct";
            ui.feedback.textContent = "Correct! +" + Games._xpEach() + " XP";

            // Enhancement 4: Streak reinforcement cues
            if (Games.currentGameStreak >= 2) {
              ui.feedback.textContent += " • Nice—keep watching the verb form.";
            }

            var fmt = Games._formatGame3Explanation(q, correctAnswerEn, correctAnswerPa);
            ui.exp.innerHTML = "";
            var l1 = document.createElement("div");
            l1.textContent = fmt.becauseEn;
            ui.exp.appendChild(l1);
            if (punjabiOnG3 && fmt.becausePa) {
              var l1pa = document.createElement("div");
              l1pa.setAttribute("lang", "pa");
              l1pa.textContent = fmt.becausePa;
              ui.exp.appendChild(l1pa);
            }
            var l2 = document.createElement("div");
            l2.textContent = fmt.exampleEn;
            ui.exp.appendChild(l2);
            if (punjabiOnG3 && fmt.examplePa) {
              var l2pa = document.createElement("div");
              l2pa.setAttribute("lang", "pa");
              l2pa.textContent = fmt.examplePa;
              ui.exp.appendChild(l2pa);
            }

            try {
              ui.target.style.display = "block";
              ui.target.textContent = fmt.tenseEn ? ("Target tense: " + fmt.tenseEn) : "";
            } catch (eT2) {}

            try { ui.streak.textContent = "Streak: " + String(Games.currentGameStreak || 0); } catch (eS3) {}
            Games._setGame3ExplanationOpen(false);
          }
        } catch (e) {}

        // Still emit toast for consistency
        Games._showPlayFeedbackToast({
          gameType: q.gameType,
          correct: true,
          correctTextEn: "Correct!",
          correctTextPa: "ਠੀਕ ਹੈ!",
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          explanationEn: "",
          explanationPa: ""
        });

        Games.enableNext();
        Games.updateScoreUI();
        Games._saveSessionToState();
        return;
      }

      // Wrong: single-attempt for tense questions (clear learning loop).
      Games.currentGameStreak = 0;
      Games.runtime.missesByQid[qid] = true;
      Games._markPersistentlyMissed(qid);

      // Missed questions return within a few questions.
      Games._requeueMissedQuestion(qid, q);

      try {
        if (ui) {
          ui.feedback.className = "feedback wrong";
          ui.feedback.textContent = punjabiOnG3
            ? Games.GAME3_UI.wrongComparePa(chosenPa || chosenEn, correctAnswerPa || correctAnswerEn)
            : Games.GAME3_UI.wrongCompareEn(chosenEn, correctAnswerEn);

          // Explanation: active language; auto-open after a short delay.
          var fmt2 = Games._formatGame3Explanation(q, correctAnswerEn, correctAnswerPa);
          ui.exp.innerHTML = "";
          var wl1 = document.createElement("div");
          wl1.textContent = fmt2.becauseEn;
          ui.exp.appendChild(wl1);
          if (punjabiOnG3 && fmt2.becausePa) {
            var wl1pa = document.createElement("div");
            wl1pa.setAttribute("lang", "pa");
            wl1pa.textContent = fmt2.becausePa;
            ui.exp.appendChild(wl1pa);
          }
          var wl2 = document.createElement("div");
          wl2.textContent = fmt2.exampleEn;
          ui.exp.appendChild(wl2);
          if (punjabiOnG3 && fmt2.examplePa) {
            var wl2pa = document.createElement("div");
            wl2pa.setAttribute("lang", "pa");
            wl2pa.textContent = fmt2.examplePa;
            ui.exp.appendChild(wl2pa);
          }

          try {
            ui.target.style.display = "block";
            ui.target.textContent = fmt2.tenseEn ? ("Target tense: " + fmt2.tenseEn) : "";
          } catch (eT3) {}
          try { ui.streak.textContent = "Streak: " + String(Games.currentGameStreak || 0); } catch (eS4) {}
          Games._setGame3ExplanationOpen(false);

          if (Games.runtime._g3AutoOpenTimer) clearTimeout(Games.runtime._g3AutoOpenTimer);
          Games.runtime._g3AutoOpenTimer = setTimeout(function() {
            try { Games._setGame3ExplanationOpen(true); } catch (e) {}
          }, 950);
        }
      } catch (e) {}

      // Toast (active language lines are handled by overlay); keep simple.
      Games._showPlayFeedbackToast({
        gameType: q.gameType,
        correct: false,
        showChosen: true,
        showCorrectAnswer: true,
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        explanationEn: Games._pickExplanationBoth(q).en || "",
        explanationPa: Games._pickExplanationBoth(q).pa || ""
      });

      Games.enableNext();
      try {
        if (ui && ui.newClueBtn) ui.newClueBtn.focus();
        else {
          var nb = document.getElementById("btn-play-next");
          if (nb && !nb.disabled) nb.focus();
        }
      } catch (eF0) {}
      Games.updateScoreUI();
      Games._saveSessionToState();
      return;
    }

    if (isCorrect) {
      // XP award only once per question
      if (!Games.runtime.submitted) {
        Games.runtime.submitted = true;
        var xp = Games._xpEach();
        Games.currentGameScore = (Games.currentGameScore || 0) + xp;
        Games.currentGameStreak = (Games.currentGameStreak || 0) + 1;
        Games.runtime.bestStreakInRound = Math.max((Games.runtime.bestStreakInRound | 0) || 0, (Games.currentGameStreak | 0) || 0);
        Games.runtime.correctCount += 1;

        if (State && State.awardXP) {
          State.awardXP(xp, { reason: "game_correct_answer", trackId: q.trackId }, { section: "games", reason: "game_correct_answer" });
        }

        // Track top tag
        if (Array.isArray(q.tags) && q.tags.length) {
          for (var t = 0; t < q.tags.length; t++) {
            var tag = q.tags[t];
            if (!Games.runtime.correctTags[tag]) Games.runtime.correctTags[tag] = 0;
            Games.runtime.correctTags[tag] += 1;
          }
        }
      }

      var punjabiOn = Games.isPunjabiOn();
      var wasMissedBefore = !!(Games.runtime.missesByQid && Games.runtime.missesByQid[qid]) || Games._wasPersistentlyMissed(qid);
      var expBoth = Games._pickExplanationBoth(q);

      // BOLO v2 adaptive feedback rules:
      // - Attempt 0 correct: brief Correct (no explanation)
      // - Attempt 2+ correct: Correct + explanation
      // - Previously missed + first-try correct: Nice improvement! + explanation
      var correctPayload = {
        qid: qid,
        gameType: q.gameType,
        correct: true,
        correctTextEn: "Correct!",
        correctTextPa: "ਠੀਕ ਹੈ!",
        chosenEn: chosenEn,
        chosenPa: chosenPa,
        correctAnswerEn: correctAnswerEn,
        correctAnswerPa: correctAnswerPa,
        explanationEn: "",
        explanationPa: ""
      };

      if (attemptIndex === 0 && wasMissedBefore) {
        correctPayload.correctTextEn = "Nice improvement!";
        correctPayload.correctTextPa = "ਵਧੀਆ ਸੁਧਾਰ!";
        // Keep Game 1 & 4 explanation behind Why? (V2 scaffold); other games preserve legacy behavior.
        if (q.gameType !== "tapWord" && q.gameType !== "sentenceCheck") {
          correctPayload.explanationEn = expBoth.en || "";
          correctPayload.explanationPa = expBoth.pa || "";
        }
        Games._clearPersistentlyMissed(qid);
      } else if (attemptIndex >= 1) {
        if (q.gameType !== "tapWord" && q.gameType !== "sentenceCheck") {
          correctPayload.explanationEn = expBoth.en || "";
          correctPayload.explanationPa = expBoth.pa || "";
        }
      }

      // V2 learning scaffold (Games 1 & 4): show Why? without forcing explanation.
      if (q.gameType === "tapWord" || q.gameType === "sentenceCheck") {
        var v2Exp = Games._pickV2ScaffoldExplainBoth(q);
        correctPayload.v2Scaffold = true;
        correctPayload.scaffoldExplainEn = v2Exp.en || "";
        correctPayload.scaffoldExplainPa = v2Exp.pa || "";
        correctPayload.scaffoldAutoOpenWhy = false;
      }

      Games.renderFeedback(correctPayload);

      if (q.gameType === "sentenceCheck") {
        Games._g4RecordRecapResolved(qid, q, chosenEn, chosenPa, correctAnswerEn, correctAnswerPa, true, attemptIndex + 1);
      }

      Games._enableNextAfterDwell(resolveStartTs, qid, function() {
        try {
          if (ui && ui.newClueBtn) ui.newClueBtn.focus();
          else {
            var nb = document.getElementById("btn-play-next");
            if (nb && !nb.disabled) nb.focus();
          }
        } catch (eF0) {}
      });

      if (q.gameType === "sentenceCheck") {
        Games._focusGame4AfterAnswer(true);
      }
      Games.updateScoreUI();
      Games._saveSessionToState();
      return;
    }

    // Wrong
    Games.currentGameStreak = 0;
    Games.runtime.missesByQid[qid] = true;

    // Persistently mark missed for future "Nice improvement" detection
    Games._markPersistentlyMissed(qid);

    // Only requeue on the first miss (avoid ballooning the queue on repeated wrong taps).
    if ((attemptIndex | 0) === 0) {
      Games._requeueMissedQuestion(qid, q);
    }

    var punjabiOn2 = Games.isPunjabiOn();

    if (attemptIndex === 0) {
      // Attempt 1 wrong: legacy behavior is Why + Tip (no reveal); Next disabled.
      // Games 1 & 4 V2 scaffold: show Try again + hint (auto) and do not reveal answer.
      var isV2Scaffold14 = (q.gameType === "tapWord" || q.gameType === "sentenceCheck");
      var why1 = isV2Scaffold14 ? null : Games._pickWhyNoRevealForWrong(q, chosenEn);
      var tip1 = isV2Scaffold14 ? null : Games._pickTipForQuestion(q, chosenEn, correctAnswerEn);
      var v2Hint1 = isV2Scaffold14 ? Games._pickV2ScaffoldHintBoth(q) : null;

      // Kids-first clarity for Game 6: explicitly instruct retry action.
      if (q.gameType === "vocabTranslation") {
        var retryEn = "Tap a different option to try again.";
        var retryPa = "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਲਈ ਹੋਰ ਵਿਕਲਪ ਦਬਾਓ।";
        tip1 = {
          en: (tip1 && tip1.en) ? (String(tip1.en) + " " + retryEn) : retryEn,
          pa: (tip1 && tip1.pa) ? (String(tip1.pa) + " " + retryPa) : retryPa
        };
      }

      if (isV2Scaffold14) {
        // Optional session stats
        try {
          if (Games.runtime) {
            if (!Games.runtime._scaffoldStats) Games.runtime._scaffoldStats = { hintUsed: 0, whyUsed: 0 };
            if (v2Hint1 && (String(v2Hint1.en || "").trim() || String(v2Hint1.pa || "").trim())) {
              Games.runtime._scaffoldStats.hintUsed = (Games.runtime._scaffoldStats.hintUsed | 0) + 1;
            }
          }
        } catch (eHs) {}

        Games.renderFeedback({
          qid: qid,
          gameType: q.gameType,
          correct: false,
          showChosen: false,
          showCorrectAnswer: false,
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          hintEn: (v2Hint1 && v2Hint1.en) ? v2Hint1.en : "",
          hintPa: (v2Hint1 && v2Hint1.pa) ? v2Hint1.pa : "",
          explanationEn: "",
          explanationPa: "",
          v2Scaffold: true,
          scaffoldExplainEn: "",
          scaffoldExplainPa: "",
          scaffoldAutoOpenWhy: false
        });
      } else {
        Games.renderFeedback({
          gameType: q.gameType,
          correct: false,
          showChosen: true,
          showCorrectAnswer: false,
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          hintEn: why1.en ? ("Explanation: " + why1.en) : "",
          hintPa: why1.pa ? ("ਕਿਉਂ: " + why1.pa) : (why1.en ? ("ਕਿਉਂ: " + why1.en) : ""),
          explanationEn: tip1.en ? ("Tip: " + tip1.en) : "",
          explanationPa: tip1.pa ? ("ਟਿਪ: " + tip1.pa) : (tip1.en ? ("ਟਿਪ: " + tip1.en) : "")
        });
      }
      Games.disableNext();

      if (q.gameType === "sentenceCheck") {
        Games._focusGame4AfterAnswer(false);
      }
    } else {
      // Attempt 2+ wrong: show correct answer + explanation (active language), apply Help, enable Next
      Games.applyHelp(q);
      var expBoth2 = Games._pickExplanationBoth(q);
      var tip2 = Games._pickTipForQuestion(q, chosenEn, correctAnswerEn);

      if (q.gameType === "tapWord" || q.gameType === "sentenceCheck") {
        var v2Exp2 = Games._pickV2ScaffoldExplainBoth(q);
        Games.renderFeedback({
          qid: qid,
          gameType: q.gameType,
          correct: false,
          showChosen: false,
          showCorrectAnswer: true,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          hintEn: "",
          hintPa: "",
          explanationEn: "",
          explanationPa: "",
          v2Scaffold: true,
          scaffoldExplainEn: v2Exp2.en || "",
          scaffoldExplainPa: v2Exp2.pa || "",
          scaffoldAutoOpenWhy: true
        });
      } else {
        Games.renderFeedback({
          gameType: q.gameType,
          correct: false,
          showChosen: true,
          showCorrectAnswer: true,
          correctAnswerEn: correctAnswerEn,
          correctAnswerPa: correctAnswerPa,
          chosenEn: chosenEn,
          chosenPa: chosenPa,
          hintEn: expBoth2.en ? ("Explanation: " + expBoth2.en) : "",
          hintPa: (expBoth2.pa || expBoth2.en) ? ("ਕਿਉਂ: " + String(expBoth2.pa || expBoth2.en)) : "",
          explanationEn: tip2.en ? ("Tip: " + tip2.en) : "",
          explanationPa: (tip2.pa || tip2.en) ? ("ਟਿਪ: " + String(tip2.pa || tip2.en)) : ""
        });
      }
      Games._enableNextAfterDwell(resolveStartTs, qid);

      if (q.gameType === "sentenceCheck") {
        Games._g4RecordRecapResolved(qid, q, chosenEn, chosenPa, correctAnswerEn, correctAnswerPa, false, attemptIndex + 1);
        Games._focusGame4AfterAnswer(true);
      }
    }

    Games.updateScoreUI();
    Games._saveSessionToState();
  },

  _pickV2ScaffoldHintBoth: function(q) {
    if (!q) return { en: "", pa: "" };
    var en = "";
    var pa = "";

    // Prefer new V2 field
    if (q.hint != null) {
      en = String(q.hint || "").trim();
      pa = en;
    }

    // Fall back to existing authored bilingual fields
    if (q.hintEn != null && String(q.hintEn || "").trim()) en = String(q.hintEn || "").trim();
    if (q.hintPa != null && String(q.hintPa || "").trim()) pa = String(q.hintPa || "").trim();

    if (!pa && en) pa = en;
    return { en: en, pa: pa };
  },

  _pickV2ScaffoldExplainBoth: function(q) {
    if (!q) return { en: "", pa: "" };
    var en = "";
    var pa = "";

    // Prefer new V2 field
    if (q.explain != null) {
      en = String(q.explain || "").trim();
      pa = en;
    }

    // Fall back to existing authored bilingual fields
    if (q.explanationEn != null && String(q.explanationEn || "").trim()) en = String(q.explanationEn || "").trim();
    if (q.explanationPa != null && String(q.explanationPa || "").trim()) pa = String(q.explanationPa || "").trim();

    if (!pa && en) pa = en;
    return { en: en, pa: pa };
  },

  _pickHintForQuestion: function(q, chosenText, correctText) {
    var m = Games.MICROCOPY[q.gameType] || {};
    var near = Games.getNearMissTip(q, chosenText, correctText);
    var en = "Try again. " + (near.en || m.wrongCueEn || "");
    var pa = "";
    if (Games.isPunjabiOn()) {
      pa = "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ। " + (near.pa || m.wrongCuePa || "");
    }
    // Prefer authored hint
    if (q.hintEn) en = q.hintEn;
    if (Games.isPunjabiOn() && q.hintPa) pa = q.hintPa;
    return { en: en, pa: pa };
  },

  getNearMissTip: function(q, chosenText, correctText) {
    // Minimum: 6 near-miss cases across POS + Tense.
    if (!q) return { en: "", pa: "" };
    var type = q.gameType;

    // For pos/tense we can infer by tag.
    if (type === "pos") {
      var tag = (Array.isArray(q.tags) && q.tags[0]) ? q.tags[0] : "";
      if (tag === "POS:NOUN") return { en: "Noun = person, place, or thing.", pa: "Noun = ਵਿਅਕਤੀ, ਥਾਂ, ਜਾਂ ਚੀਜ਼।" };
      if (tag === "POS:VERB") return { en: "Verb = action word (run, eat, play).", pa: "Verb = ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ (run, eat, play)।" };
      if (tag === "POS:ADJECTIVE") return { en: "Adjective describes (big, red, happy).", pa: "Adjective ਵਰਣਨ ਕਰਦਾ ਹੈ (big, red, happy)।" };
      if (tag === "POS:ADVERB") return { en: "Adverb tells how/when (quickly, yesterday).", pa: "Adverb ਕਿਵੇਂ/ਕਦੋਂ ਦੱਸਦਾ ਹੈ (quickly, yesterday)।" };
      if (tag === "POS:PRONOUN") return { en: "Pronoun replaces a name (he, she, they).", pa: "Pronoun ਨਾਮ ਦੀ ਥਾਂ ਆਉਂਦਾ ਹੈ (he, she, they)।" };
      if (tag === "POS:PREPOSITION") return { en: "Preposition shows place (on, under, in).", pa: "Preposition ਥਾਂ ਦੱਸਦਾ ਹੈ (on, under, in)।" };
    }

    if (type === "tense") {
      var ttag = (Array.isArray(q.tags) && q.tags[0]) ? q.tags[0] : "";
      if (ttag === "TENSE:PAST") return { en: "Past = yesterday/last… (played, walked).", pa: "ਭੂਤਕਾਲ = yesterday/last… (played, walked)।" };
      if (ttag === "TENSE:PRESENT") return { en: "Present = every day/now (walks, reads).", pa: "ਵਰਤਮਾਨ = every day/now (walks, reads)।" };
      if (ttag === "TENSE:FUTURE") return { en: "Future = will… / tomorrow.", pa: "ਭਵਿੱਖ = will… / tomorrow।" };
    }

    return { en: "", pa: "" };
  },

  applyHelp: function(q) {
    var optionsEl = document.getElementById("play-options");
    if (!optionsEl) return false;

    // tapWord: highlight correct token
    if (q.gameType === "tapWord") {
      var buttons = optionsEl.querySelectorAll("button");
      if (!buttons || !buttons.length) return false;

      var idxs = Array.isArray(q.correctTokenIndices) ? q.correctTokenIndices.slice() : null;
      if (!idxs || !idxs.length) {
        if (typeof q.correctTokenIndex === "number" && isFinite(q.correctTokenIndex)) idxs = [q.correctTokenIndex | 0];
      }
      if (!Array.isArray(idxs) || !idxs.length) return false;

      var idxMap = {};
      for (var ii = 0; ii < idxs.length; ii++) {
        var v = idxs[ii] | 0;
        if (v >= 0 && v < buttons.length) idxMap[String(v)] = true;
      }
      if (!Object.keys(idxMap).length) return false;

      // Help behavior without new colors: disable all distractors and emphasize correct
      for (var i = 0; i < buttons.length; i++) {
        if (idxMap[String(i)]) continue;
        buttons[i].disabled = true;
      }
      var marked = 0;
      for (var j = 0; j < buttons.length; j++) {
        if (!idxMap[String(j)]) continue;
        buttons[j].classList.add("is-help");
        buttons[j].classList.add("is-correct");
        marked++;
      }
      return marked > 0;
    }

    // Other games: disable/gray out 1–2 distractors
    var correctIdx = -1;
    if (q.gameType === "pos" || q.gameType === "tense") {
      correctIdx = q._effectiveCorrectIndex;
    } else {
      correctIdx = q.correctIndex;
    }
    if (typeof correctIdx !== "number") return false;

    var btns = optionsEl.querySelectorAll("button");
    if (!btns || btns.length < 3) return false;
    var removed = 0;
    for (var i = 0; i < btns.length; i++) {
      if (i === correctIdx) continue;
      if (removed >= 2) break;
      btns[i].disabled = true;
      removed++;
    }
    return removed > 0;
  },

  renderFeedback: function(payload) {
    var fb = document.getElementById("play-feedback");
    if (!fb) return;

    if (!payload) {
      fb.innerHTML = "";
      fb.className = "feedback";
      Games._hidePlayFeedbackToast();
      try {
        if (Games.runtime && Games.runtime._scaffoldState) {
          Games.runtime._scaffoldState.qid = "";
          Games.runtime._scaffoldState.whyOpen = false;
        }
      } catch (eScR) {}
      return;
    }

    // Reset per-question scaffold state when question changes.
    try {
      var qidNow = (payload && payload.qid != null) ? String(payload.qid) : "";
      if (Games.runtime) {
        if (!Games.runtime._scaffoldState) Games.runtime._scaffoldState = { qid: "", whyOpen: false };
        if (qidNow && Games.runtime._scaffoldState.qid !== qidNow) {
          Games.runtime._scaffoldState.qid = qidNow;
          Games.runtime._scaffoldState.whyOpen = false;
        }
      }
    } catch (eSc0) {}

    var punjabiOn = Games.isPunjabiOn();
    fb.innerHTML = "";
    fb.className = "feedback " + (payload.correct ? "correct" : "wrong") + (payload.v2Scaffold ? " has-scaffold" : "");

    // P0 v2: single stable feedback area with two lines.
    var line1 = document.createElement("div");
    line1.className = "play-feedback-line1";
    var line2 = document.createElement("div");
    line2.className = "play-feedback-line2";
    fb.appendChild(line1);
    fb.appendChild(line2);

    // Optional V2 scaffold actions area (Hint / Why?) integrated into feedback.
    var actionsRow = null;
    var whyBtn = null;
    var extra = null;
    if (payload && payload.v2Scaffold) {
      actionsRow = document.createElement("div");
      actionsRow.className = "play-feedback-actions";
      fb.appendChild(actionsRow);

      extra = document.createElement("div");
      extra.className = "play-feedback-extra";
      fb.appendChild(extra);
    }

    function pickActive(en, pa) {
      var e = String(en || "").trim();
      var p = String(pa || "").trim();
      return punjabiOn ? (p || e) : e;
    }

    function stripPrefix(s) {
      var t = String(s || "").trim();
      t = t.replace(/^(Explanation:|Tip:|Answer:|Correct answer:|Corrected:|You picked:|Let's learn|Try again)\s*/i, "");
      t = t.replace(/^(ਕਿਉਂ:|ਟਿਪ:|ਜਵਾਬ:|ਸਹੀ ਜਵਾਬ:)\s*/i, "");
      return t.trim();
    }

    // Line 1
    if (payload.correct) {
      var title = String(payload.correctTextEn || "Correct").trim() || "Correct";
      line1.textContent = title + " +" + Games._xpEach() + " XP";
    } else {
      var reveal = (payload.showCorrectAnswer === true) || (payload.showCorrectAnswer !== false && !!payload.correctAnswerEn);
      if (reveal && payload.correctAnswerEn) {
        line1.textContent = "Correct answer: " + String(payload.correctAnswerEn || "");
      } else {
        line1.textContent = "Try again";
      }
    }

    // Line 2 (Hint/Why). Keep it blank if nothing exists.
    var secondary = "";
    if (payload.correct && payload.gameType === "pos" && payload.correctAnswerEn) {
      // Preserve useful POS feedback without adding extra lines.
      secondary = punjabiOn
        ? ("ਜਵਾਬ: " + String(payload.correctAnswerPa || payload.correctAnswerEn))
        : ("Answer: " + String(payload.correctAnswerEn || ""));
    } else {
      secondary = pickActive(payload.hintEn, payload.hintPa) || pickActive(payload.explanationEn, payload.explanationPa);
    }
    secondary = stripPrefix(secondary);
    line2.textContent = secondary;

    // V2 scaffold "Why?" (explanation) toggle.
    if (payload && payload.v2Scaffold && actionsRow && extra) {
      var explainText = stripPrefix(pickActive(payload.scaffoldExplainEn, payload.scaffoldExplainPa));
      var showWhy = !!String(explainText || "").trim();
      var autoOpenWhy = !!payload.scaffoldAutoOpenWhy;

      // Keep height stable: extra area always reserves space.
      var state = (Games.runtime && Games.runtime._scaffoldState) ? Games.runtime._scaffoldState : { whyOpen: false };
      if (autoOpenWhy) state.whyOpen = true;

      if (showWhy) {
        whyBtn = document.createElement("button");
        whyBtn.type = "button";
        whyBtn.className = "btn btn-secondary btn-small play-feedback-action";
        whyBtn.textContent = punjabiOn ? "Why? / ਕਿਉਂ?" : "Why?";
        whyBtn.setAttribute("aria-expanded", state.whyOpen ? "true" : "false");
        actionsRow.appendChild(whyBtn);

        var applyWhy = function(open) {
          state.whyOpen = !!open;
          try { whyBtn.setAttribute("aria-expanded", state.whyOpen ? "true" : "false"); } catch (e1) {}
          extra.textContent = state.whyOpen ? explainText : "";
          extra.classList.toggle("is-open", !!state.whyOpen);
        };

        applyWhy(state.whyOpen);

        whyBtn.addEventListener("click", function() {
          try {
            // Session stats (optional)
            if (Games.runtime) {
              if (!Games.runtime._scaffoldStats) Games.runtime._scaffoldStats = { hintUsed: 0, whyUsed: 0 };
              Games.runtime._scaffoldStats.whyUsed = (Games.runtime._scaffoldStats.whyUsed | 0) + 1;
            }
          } catch (eS) {}
          applyWhy(!state.whyOpen);
        });
      } else {
        extra.textContent = "";
        extra.classList.remove("is-open");
      }
    }

    // P0 v2: toast overlay is disabled; keep a single stable area.
    Games._hidePlayFeedbackToast();
    return;
  },

  // ===== Shared Why panel (used by Game 5) =====
  _ensurePlayWhyUi: function() {
    var anchor = document.getElementById("play-feedback");
    if (!anchor || !anchor.parentNode) return null;

    var row = document.getElementById("play-why-row");
    var btn = document.getElementById("btn-play-why");
    var panel = document.getElementById("play-why-text");

    if (!row) {
      row = document.createElement("div");
      row.id = "play-why-row";
      row.className = "button-row play-why-row";
      row.style.marginTop = "8px";
      anchor.parentNode.insertBefore(row, anchor.nextSibling);
    }

    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btn-play-why";
      btn.className = "btn btn-secondary btn-small";
      btn.innerHTML = '<span class="btn-label-en">Explanation</span><span class="btn-label-pa" lang="pa">ਵਜਾਹ</span>';
      btn.setAttribute("aria-controls", "play-why-text");
      btn.setAttribute("aria-expanded", "false");
      row.appendChild(btn);
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "play-why-text";
      panel.className = "section-subtitle play-why-text";
      panel.setAttribute("role", "region");
      panel.style.display = "none";
      row.parentNode.insertBefore(panel, row.nextSibling);
    }

    // Bind once
    try {
      if (!(btn.dataset && btn.dataset.bound)) {
        btn.dataset.bound = "1";
        btn.addEventListener("click", function() {
          var p = document.getElementById("play-why-text");
          if (!p) return;
          var isOpen = !(p.dataset && p.dataset.open === "1");
          p.dataset.open = isOpen ? "1" : "0";
          p.style.display = isOpen ? "block" : "none";
          btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
      }
    } catch (e) {}

    return { row: row, btn: btn, panel: panel };
  },

  _resetPlayWhyUi: function() {
    var row = document.getElementById("play-why-row");
    var btn = document.getElementById("btn-play-why");
    var panel = document.getElementById("play-why-text");
    if (row) row.style.display = "none";
    if (panel) {
      panel.textContent = "";
      panel.style.display = "none";
      panel.dataset.open = "0";
    }
    if (btn) btn.setAttribute("aria-expanded", "false");
  },

  _setPlayWhyExplanation: function(expBoth) {
    var en = expBoth && expBoth.en ? String(expBoth.en || "").trim() : "";
    var pa = expBoth && expBoth.pa ? String(expBoth.pa || "").trim() : "";
    if (!en && !pa) {
      Games._resetPlayWhyUi();
      return;
    }
    var ui = Games._ensurePlayWhyUi();
    if (!ui) return;

    var punjabiOn = Games.isPunjabiOn();
    ui.panel.textContent = punjabiOn ? (pa || en) : (en || pa);
    ui.row.style.display = "flex";
    ui.btn.style.display = "inline-flex";
    ui.btn.setAttribute("aria-expanded", "false");
    ui.panel.style.display = "none";
    ui.panel.dataset.open = "0";
  },

  _setPlayOptionsEnabled: function(enabled) {
    var optionsEl = document.getElementById("play-options");
    if (!optionsEl) return;
    var btns = optionsEl.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = !enabled;
    }
  },
  _focusFirstOption: function() {
    // Keep it conservative: only focus if we're in-round and options exist.
    try {
      var r = Games.runtime.round;
      if (!r || r.completed) return;
      var q = (r.questions && r.questions[r.idx]) ? r.questions[r.idx] : null;
      if (q && q.gameType === "wordOrderSurgery") return;
      var optionsEl = document.getElementById("play-options");
      if (!optionsEl) return;
      var first = optionsEl.querySelector("button");
      if (first) first.focus();
    } catch (e) {}
  },

  _renderGame6MissedMiniReviewCard: function() {
    var r = Games.runtime.round;
    if (!r || r.mode !== "normal" || String(r.gameId || "") !== "game6") return;

    var panel = document.getElementById("play-complete-panel");
    if (!panel) return;

    // Remove previous instance (avoid duplicates).
    var old = document.getElementById("g6-missed-mini-card");
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var misses = Games.runtime.missesByQid || {};
    var missed = [];
    for (var i = 0; i < (r.questions ? r.questions.length : 0); i++) {
      var q = r.questions[i];
      var qid = q && q.qid;
      if (qid && misses[qid] === true) missed.push(q);
    }

    if (!missed.length) return;

    var card = document.createElement("div");
    card.className = "round-summary-card";
    card.id = "g6-missed-mini-card";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "15px";
    title.textContent = "Quick Review";
    card.appendChild(title);

    var subtitle = document.createElement("div");
    subtitle.className = "section-subtitle";
    subtitle.textContent = "Review missed words (no penalty).";
    card.appendChild(subtitle);

    // Show up to 5 missed items.
    var max = Math.min(5, missed.length);
    for (var j = 0; j < max; j++) {
      var qq = missed[j] || {};
      var pe = String(qq.promptEn || "");
      var wordPa = "";
      try {
        var m = pe.match(/"([^"]+)"/);
        if (m && m[1]) wordPa = String(m[1] || "");
      } catch (e2) {}
      var answer = "";
      try {
        if (Array.isArray(qq.optionsEn) && typeof qq.correctIndex === "number" && qq.correctIndex >= 0 && qq.correctIndex < qq.optionsEn.length) {
          answer = String(qq.optionsEn[qq.correctIndex] || "");
        }
      } catch (e3) {}

      var line = document.createElement("div");
      line.className = "section-subtitle";
      line.innerHTML = "";

      if (wordPa) {
        var w = document.createElement("span");
        w.setAttribute("lang", "pa");
        w.textContent = wordPa;
        line.appendChild(w);
      }
      if (answer) {
        var sep = document.createElement("span");
        sep.textContent = " — ";
        line.appendChild(sep);
        var a = document.createElement("span");
        a.textContent = answer;
        line.appendChild(a);
      }
      card.appendChild(line);
    }

    var btnRow = document.createElement("div");
    btnRow.className = "button-row";
    btnRow.style.marginTop = "10px";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary";
    btn.textContent = "Practice missed";
    btn.addEventListener("click", function() {
      try { Games.retryMissed(); } catch (e) {}
    });
    btnRow.appendChild(btn);

    card.appendChild(btnRow);

    var firstBtnRow = panel.querySelector(".button-row");
    if (firstBtnRow && firstBtnRow.parentNode) {
      firstBtnRow.parentNode.insertBefore(card, firstBtnRow);
    } else {
      panel.appendChild(card);
    }
  },

  _pickHintPreviewBoth: function(q) {
    // For pre-answer hint toggle: prefer authored hint, else near-miss tip, else microcopy.
    if (!q) return { en: "", pa: "" };
    var m = Games.MICROCOPY[q.gameType] || {};
    var near = Games.getNearMissTip(q, "", "");
    var en = String((q.hintEn || "") || (near.en || "") || (m.wrongCueEn || "") || "").trim();
    var pa = String((q.hintPa || "") || (near.pa || "") || (m.wrongCuePa || "") || "").trim();
    return { en: en, pa: pa };
  },

  _renderPosHintWhy: function(q) {
    // Low-risk UI injection: show Hint/Why toggles only for Game 2 (pos).
    var fb = document.getElementById("play-feedback");
    if (!fb) return;

    var row = document.getElementById("play-pos-hintwhy-row");
    var panel = document.getElementById("play-pos-hintwhy-panel");

    function ensure() {
      if (!row) {
        row = document.createElement("div");
        row.id = "play-pos-hintwhy-row";
        row.className = "button-row";
        fb.parentNode.insertBefore(row, fb);
      }
      if (!panel) {
        panel = document.createElement("div");
        panel.id = "play-pos-hintwhy-panel";
        panel.className = "section-subtitle";
        fb.parentNode.insertBefore(panel, fb);
      }

      // Build buttons once
      try {
        if (!(row.dataset && row.dataset.bound)) {
          row.dataset.bound = "1";
          row.innerHTML = "";

          var hintBtn = document.createElement("button");
          hintBtn.type = "button";
          hintBtn.className = "btn btn-secondary btn-small";
          hintBtn.id = "btn-play-pos-hint";
          hintBtn.innerHTML = '<span class="btn-label-en">Hint</span><span class="btn-label-pa" lang="pa">ਸੰਕੇਤ</span>';

          var whyBtn = document.createElement("button");
          whyBtn.type = "button";
          whyBtn.className = "btn btn-secondary btn-small";
          whyBtn.id = "btn-play-pos-why";
          whyBtn.innerHTML = '<span class="btn-label-en">Explanation</span><span class="btn-label-pa" lang="pa">ਵਜਾਹ</span>';

          hintBtn.addEventListener("click", function() {
            var r = Games.runtime.round;
            if (!r || r.completed) return;
            var q2 = r.questions[r.idx];
            if (!q2 || q2.gameType !== "pos") return;
            var qid2 = q2.qid || ("Q_" + String(r.idx));
            var st = Games.runtime._posHintWhyStateByQid[qid2] || { hintOpen: false, whyOpen: false };
            st.hintOpen = !st.hintOpen;
            Games.runtime._posHintWhyStateByQid[qid2] = st;
            Games._renderPosHintWhy(q2);
          });

          whyBtn.addEventListener("click", function() {
            var r = Games.runtime.round;
            if (!r || r.completed) return;
            var q2 = r.questions[r.idx];
            if (!q2 || q2.gameType !== "pos") return;
            var qid2 = q2.qid || ("Q_" + String(r.idx));
            var st = Games.runtime._posHintWhyStateByQid[qid2] || { hintOpen: false, whyOpen: false };
            st.whyOpen = !st.whyOpen;
            Games.runtime._posHintWhyStateByQid[qid2] = st;
            Games._renderPosHintWhy(q2);
          });

          row.appendChild(hintBtn);
          row.appendChild(whyBtn);
        }
      } catch (e) {}
    }

    // Hide for non-pos questions
    if (!q || q.gameType !== "pos") {
      if (row) row.style.display = "none";
      if (panel) panel.style.display = "none";
      return;
    }

    ensure();

    // Update enabled/disabled + content
    var qid = q.qid || ("Q_" + String((Games.runtime.round && typeof Games.runtime.round.idx === "number") ? Games.runtime.round.idx : 0));
    var st2 = Games.runtime._posHintWhyStateByQid[qid] || { hintOpen: false, whyOpen: false };
    Games.runtime._posHintWhyStateByQid[qid] = st2;

    var hintBoth = Games._pickHintPreviewBoth(q);
    var expBoth = Games._pickExplanationBoth(q);
    var hasHint = !!(hintBoth.en || hintBoth.pa);
    var hasWhy = !!(expBoth.en || expBoth.pa);

    var hintBtnEl = document.getElementById("btn-play-pos-hint");
    var whyBtnEl = document.getElementById("btn-play-pos-why");
    if (hintBtnEl) hintBtnEl.disabled = !hasHint;
    if (whyBtnEl) whyBtnEl.disabled = !hasWhy;

    var punjabiOn = Games.isPunjabiOn();
    row.style.display = (hasHint || hasWhy) ? "flex" : "none";

    panel.innerHTML = "";
    panel.style.display = (st2.hintOpen && hasHint) || (st2.whyOpen && hasWhy) ? "block" : "none";
    if (panel.style.display === "none") return;

    function addBlock(titleEn, titlePa, body) {
      if (!body) return;
      var wrap = document.createElement("div");
      var title = document.createElement("div");
      title.className = "section-subtitle";
      title.textContent = titleEn;
      wrap.appendChild(title);
      if (punjabiOn && titlePa) {
        var title2 = document.createElement("div");
        title2.className = "section-subtitle";
        title2.setAttribute("lang", "pa");
        title2.textContent = titlePa;
        wrap.appendChild(title2);
      }

      var enLine = String(body.en || "").trim();
      var paLine = String(body.pa || "").trim();
      if (enLine) {
        var enDiv = document.createElement("div");
        enDiv.textContent = enLine;
        wrap.appendChild(enDiv);
      }
      if (punjabiOn && paLine) {
        var paDiv = document.createElement("div");
        paDiv.setAttribute("lang", "pa");
        paDiv.textContent = paLine;
        wrap.appendChild(paDiv);
      }
      panel.appendChild(wrap);
    }

    if (st2.hintOpen && hasHint) addBlock("Hint", "ਸੰਕੇਤ", hintBoth);
    if (st2.whyOpen && hasWhy) addBlock("Explanation", "ਵਜਾਹ", expBoth);
  },

  _toastTimer: null,

  _hidePlayFeedbackToast: function() {
    if (Games._toastTimer) {
      clearTimeout(Games._toastTimer);
      Games._toastTimer = null;
    }
  },

  _showPlayFeedbackToast: function(payload) {
    return;
  },

  enableNext: function() {
    var row = document.getElementById("play-next-row");
    var btn = document.getElementById("btn-play-next");
    var helper = document.getElementById("play-next-helper");
    if (row) {
      row.classList.remove("is-hidden");
      row.style.display = "flex";
    }
    if (btn) {
      btn.disabled = false;
      btn.className = "btn";
    }
    if (helper) {
      helper.style.display = "none";
      helper.textContent = "";
    }
  },

  disableNext: function(suppressHelper) {
    var row = document.getElementById("play-next-row");
    var btn = document.getElementById("btn-play-next");
    var helper = document.getElementById("play-next-helper");
    if (row) {
      row.classList.remove("is-hidden");
      row.style.display = "flex";
    }
    if (btn) {
      btn.disabled = true;
      btn.className = "btn btn-secondary";
    }
    if (helper) {
      if (suppressHelper) {
        helper.style.display = "none";
        helper.textContent = "";
      } else {
        helper.style.display = "block";
        helper.textContent = "Answer to continue";
      }
    }
  },

  // P0 v2: prevent instant Next after resolution.
  // Keeps the feedback state visible for at least MIN_FEEDBACK_MS.
  _enableNextAfterDwell: function(startTs, qid, after) {
    try {
      if (Games.runtime) {
        Games.runtime._nextPending = true;
        Games.runtime._nextPendingQid = String(qid || "");
      }
    } catch (e0) {}

    // Keep Next visible but disabled while we dwell (no helper text).
    Games.disableNext(true);

    withFeedbackDwell(startTs, function() {
      try {
        if (Games.runtime) {
          Games.runtime._nextPending = false;
          Games.runtime._nextPendingQid = null;
        }
      } catch (e1) {}

      Games.enableNext();
      if (typeof after === "function") {
        try { after(); } catch (e2) {}
      }
    });
  },

  next: function() {
    var r = Games.runtime.round;
    if (!r || r.completed) return;

    // Clear any pending dwell gate.
    try {
      if (Games.runtime) {
        Games.runtime._nextPending = false;
        Games.runtime._nextPendingQid = null;
      }
    } catch (eNP0) {}

    // If a checkpoint modal is open, block Next.
    try {
      if (Games.runtime && Games.runtime._checkpointLock) return;
    } catch (e0) {}

    // Interleaved review: after every 3 correct, swap next question with a missed one.
    if (Games.runtime.mode === "normal" && Games.runtime.correctCount > 0 && (Games.runtime.correctCount % 3 === 0)) {
      Games._maybeInsertReviewQuestion();
    }

    r.idx += 1;

    // Count questions completed (used for 20-question checkpoints).
    if (Games.runtime && Games.runtime.mode === "normal" && Games.runtime.unlimitedMode) {
      if (typeof Games.runtime.answeredCount !== "number") Games.runtime.answeredCount = 0;
      Games.runtime.answeredCount = (Games.runtime.answeredCount | 0) + 1;
    }

    // If we hit the end in unlimited mode, auto-append another batch.
    if (r.idx >= r.questions.length && Games.runtime.mode === "normal" && Games.runtime.unlimitedMode) {
      try { Games._appendUnlimitedBatch(); } catch (eA) {}
    }

    // Checkpoint prompt every N questions.
    var every = (Games.runtime && typeof Games.runtime.checkpointEvery === "number") ? (Games.runtime.checkpointEvery | 0) : 0;
    if (Games.runtime.mode === "normal" && Games.runtime.unlimitedMode && every > 0 && (Games.runtime.answeredCount % every === 0)) {
      Games.runtime._checkpointLock = true;
      Games._bindPlayCheckpointModalOnce();
      Games._openPlayCheckpointModal();

      // If we're currently at the end of the queue, wait for Continue (do not complete/render).
      if (r.idx >= r.questions.length) return;
    }

    if (r.idx >= r.questions.length) {
      r.completed = true;
      Games._clearSessionInState();
    }

    Games.runtime.submitted = false;

    // Unlock input for the next question (Game 5 safety).
    Games.runtime.inputLocked = false;
    Games.runtime._answeredQid = null;

    Games.render();

    // Ensure header progress stays in sync (also supports DOM-only progress hooks).
    Games.updateProgressUI();

    // Accessibility: move focus to first option after Next.
    setTimeout(function() { Games._focusFirstOption(); }, 0);
  },

  _maybeInsertReviewQuestion: function() {
    var r = Games.runtime.round;
    if (!r) return;
    var idx = r.idx;
    var missedQids = Object.keys(Games.runtime.missesByQid || {});
    if (!missedQids.length) return;

    // Find a missed question later in the list and swap with next.
    var nextPos = idx + 1;
    if (nextPos >= r.questions.length) return;

    for (var mi = 0; mi < missedQids.length; mi++) {
      var qid = missedQids[mi];
      for (var j = nextPos + 1; j < r.questions.length; j++) {
        if (r.questions[j] && r.questions[j].qid === qid) {
          var tmp = r.questions[nextPos];
          r.questions[nextPos] = r.questions[j];
          r.questions[j] = tmp;
          return;
        }
      }
    }
  },

  // ===== Completion panel =====
  _nextTipForGameType: function(gameType) {
    if (gameType === "tapWord") return "Tip: scan the whole line before tapping.";
    if (gameType === "pos") return "Tip: look for function words (the, a, to).";
    if (gameType === "tense") return "Tip: time words (yesterday/now/tomorrow) help.";
    if (gameType === "sentenceCheck") return "Tip: check subject–verb agreement first.";
    if (gameType === "convoReply") return "Tip: pick the most polite + relevant reply.";
    if (gameType === "vocabTranslation") return "Tip: visualize the word in a sentence.";
    return "";
  },

  _renderRoundSummaryAndTipCard: function() {
    var r = Games.runtime.round;
    if (!r) return;

    // Only Games 1–7 (never 8), only normal rounds.
    if (Games.runtime.mode !== "normal") return;
    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId);
    if (!(gameNum >= 1 && gameNum <= 7)) return;

    var panel = document.getElementById("play-complete-panel");
    if (!panel) return;

    // Remove existing injected card (if any)
    var existing = document.getElementById("round-summary-card");
    if (existing && existing.parentNode) {
      try { existing.parentNode.removeChild(existing); } catch (e0) {}
    }

    var gameType = (r.questions && r.questions[0] && r.questions[0].gameType) ? r.questions[0].gameType : Games._mapGameNumToType(gameNum);

    var correct = (typeof Games.runtime.correctCount === "number") ? Games.runtime.correctCount : null;
    var total = (typeof Games.runtime.totalCount === "number") ? Games.runtime.totalCount : null;

    var card = document.createElement("div");
    card.className = "round-summary-card";
    card.id = "round-summary-card";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "15px";
    title.textContent = "Round Summary";
    card.appendChild(title);

    var metrics = document.createElement("div");
    metrics.className = "round-summary-metrics";

    // a) Score (always show using existing counters when available)
    if (correct != null && total != null && total > 0) {
      var scoreLine = document.createElement("div");
      scoreLine.className = "section-subtitle";
      scoreLine.textContent = "Score: " + String(correct) + "/" + String(total);
      metrics.appendChild(scoreLine);
    }

    // b) Accuracy
    if (correct != null && total != null && total > 0) {
      var acc = Math.round((correct / total) * 100);
      if (isFinite(acc)) {
        var accLine = document.createElement("div");
        accLine.className = "section-subtitle";
        accLine.textContent = "Accuracy: " + String(acc) + "%";
        metrics.appendChild(accLine);
      }
    }

    // c) Best streak in round
    if (typeof Games.runtime.bestStreakInRound === "number" && isFinite(Games.runtime.bestStreakInRound)) {
      var bs = Games.runtime.bestStreakInRound | 0;
      if (bs > 0) {
        var bsLine = document.createElement("div");
        bsLine.className = "section-subtitle";
        bsLine.textContent = "Best streak: " + String(bs);
        metrics.appendChild(bsLine);
      }
    }

    if (metrics.childNodes && metrics.childNodes.length) {
      card.appendChild(metrics);
    }

    var tip = Games._nextTipForGameType(gameType);
    if (tip) {
      var tipLine = document.createElement("div");
      tipLine.className = "round-summary-tip";
      tipLine.textContent = tip;
      card.appendChild(tipLine);
    }

    // Buttons under the card (reuse existing logic)
    var actions = document.createElement("div");
    actions.className = "button-row";
    actions.style.marginTop = "10px";

    var btnAgain = document.createElement("button");
    btnAgain.type = "button";
    btnAgain.className = "btn btn-secondary";
    btnAgain.textContent = "Play again";

    var btnRetry = document.createElement("button");
    btnRetry.type = "button";
    btnRetry.className = "btn btn-secondary";
    btnRetry.textContent = "Retry missed";

    // Hide/disable if nothing missed in THIS session
    var missedCount = 0;
    try {
      missedCount = Object.keys(Games.runtime.missesByQid || {}).length;
    } catch (eMC) {
      missedCount = 0;
    }
    if (!missedCount) {
      btnRetry.disabled = true;
      btnRetry.style.display = "none";
    }

    var btnBack = document.createElement("button");
    btnBack.type = "button";
    btnBack.className = "btn";
    btnBack.textContent = "Back to Play";

    actions.appendChild(btnBack);
    actions.appendChild(btnRetry);
    actions.appendChild(btnAgain);
    card.appendChild(actions);

    // Bind once per render
    try {
      if (!(card.dataset && card.dataset.bound)) {
        if (card.dataset) card.dataset.bound = "1";
        btnAgain.addEventListener("click", function() { Games.playAgain(); });
        btnRetry.addEventListener("click", function() { Games.retryMissed(); });
        btnBack.addEventListener("click", function() { Games.backToPlayMenu(); });
      }
    } catch (e1) {}

    // Insert before the existing completion buttons (safe append if not found)
    var firstBtnRow = panel.querySelector(".button-row");
    if (firstBtnRow && firstBtnRow.parentNode) {
      firstBtnRow.parentNode.insertBefore(card, firstBtnRow);
    } else {
      panel.appendChild(card);
    }
  },

  // ===== Game 8: Dev bank validator (warn-only) =====
  _g8BankValidated: false,

  validateGame8Bank: function(rawArray) {
    var raw = Array.isArray(rawArray) ? rawArray : [];
    var requiredPatterns = ["TIME", "AUX", "NEG", "QUESTION"];
    var counts = { TIME: 0, AUX: 0, NEG: 0, QUESTION: 0 };
    var seenPhrase = {};

    function warn(msg, obj) {
      console.warn("[G8_BANK] " + msg, obj || "");
    }

    for (var i = 0; i < raw.length; i++) {
      var q = raw[i] || {};
      var missing = [];
      if (!q.id) missing.push("id");
      if (!q.pattern) missing.push("pattern");
      if (!q.difficulty) missing.push("difficulty");
      if (!Array.isArray(q.targetChunks) || !q.targetChunks.length) missing.push("targetChunks");
      if (!q.tipPa) missing.push("tipPa");
      if (!q.tipEn) missing.push("tipEn");
      if (missing.length) warn("Missing fields: " + missing.join(", "), { index: i, id: q.id, missing: missing });

      var pat = String(q.pattern || "").toUpperCase().trim();
      if (counts.hasOwnProperty(pat)) counts[pat] += 1;

      // Duplicate target text check
      try {
        var phrase = Array.isArray(q.targetChunks) ? q.targetChunks.join(" ").trim() : "";
        if (phrase) {
          var k = phrase.toLowerCase();
          if (seenPhrase[k]) warn("Duplicate targetChunks text", { index: i, id: q.id, phrase: phrase });
          seenPhrase[k] = true;
        }
      } catch (eP) {}

      // Chunk length check
      if (Array.isArray(q.targetChunks)) {
        for (var c = 0; c < q.targetChunks.length; c++) {
          var chunk = String(q.targetChunks[c] || "");
          if (chunk.length > 32) {
            warn("Chunk > 32 chars", { index: i, id: q.id, chunkIndex: c, len: chunk.length, chunk: chunk });
          }
        }
      }
    }

    for (var p = 0; p < requiredPatterns.length; p++) {
      var rp = requiredPatterns[p];
      if ((counts[rp] | 0) < 6) {
        warn("Insufficient coverage for pattern " + rp + " (need >= 6)", { pattern: rp, count: counts[rp] | 0 });
      }
    }

    return { total: raw.length, counts: counts };
  },

  _validateGame8BankOnce: function() {
    if (!DEBUG_VALIDATE_G8_BANK) return;
    if (Games._g8BankValidated) return;
    Games._g8BankValidated = true;
    try {
      Games.validateGame8Bank((typeof RAW_GAME8_WORD_ORDER !== "undefined") ? RAW_GAME8_WORD_ORDER : []);
    } catch (e) {
      console.warn("[G8_BANK] validator exception", e && e.message ? e.message : e);
    }
  },

  // ===== Game 8: Mastery tracking (localStorage) =====
  _g8MasteryKey: "bolo_g8_mastery_v1",

  _g8LoadMasteryStore: function() {
    var raw = null;
    try { raw = localStorage.getItem(Games._g8MasteryKey); } catch (e) { raw = null; }
    var store = null;
    try { store = raw ? JSON.parse(raw) : null; } catch (e2) { store = null; }
    if (!store || typeof store !== "object") store = {};
    if (!store.patterns || typeof store.patterns !== "object") store.patterns = {};
    if (!Array.isArray(store.events)) store.events = [];
    return store;
  },

  _g8SaveMasteryStore: function(store) {
    try { localStorage.setItem(Games._g8MasteryKey, JSON.stringify(store || {})); } catch (e) {}
  },

  _g8Clamp01: function(x) {
    var n = Number(x);
    if (!isFinite(n)) n = 0;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  },

  _g8SpeedTo01: function(timeMs) {
    var t = Math.max(0, Number(timeMs) || 0);
    if (t <= 8000) return 1;
    if (t >= 35000) return 0;
    var frac = 1 - ((t - 8000) / (35000 - 8000));
    return Games._g8Clamp01(frac);
  },

  _g8ScoreFromStats: function(s) {
    if (!s || typeof s !== "object") return 0;
    var acc = Games._g8Clamp01(s.accEMA);
    var eff = Games._g8Clamp01(s.effEMA);
    var spd = Games._g8Clamp01(s.speedEMA);
    var hint = Games._g8Clamp01(s.hintEMA);
    var score01 = (0.35 * acc) + (0.35 * eff) + (0.20 * spd) + (0.10 * (1 - hint));
    return Math.max(0, Math.min(100, Math.round(score01 * 100)));
  },

  _g8TierForScore: function(score) {
    var s = Number(score) || 0;
    if (s < 25) return "New";
    if (s < 50) return "Learning";
    if (s < 75) return "Strong";
    return "Mastered";
  },

  _g8UpdateMasteryOnSolved: function(q) {
    if (!q || q.gameType !== "wordOrderSurgery") return;

    var pattern = String(q.pattern || "").toUpperCase().trim() || "UNKNOWN";
    var difficulty = String(q.difficultyStr || "normal").toLowerCase().trim();
    var swapsUsed = (q._stats && typeof q._stats.swaps === "number") ? (q._stats.swaps | 0) : 0;
    var hintUsed = !!(q._stats && q._stats.hintUsed);
    var now = Date.now();
    var timeMs = 0;
    if (q._stats && q._stats.startTs) timeMs = Math.max(0, now - (q._stats.startTs | 0));

    var store = Games._g8LoadMasteryStore();
    var patterns = store.patterns;
    var prev = patterns[pattern] && typeof patterns[pattern] === "object" ? patterns[pattern] : {};
    var oldScore = Games._g8ScoreFromStats(prev);

    var misplaced = (typeof q._misplacedAtStart === "number") ? (q._misplacedAtStart | 0) : 0;
    var optimalSwaps = (typeof q._optimalSwaps === "number") ? (q._optimalSwaps | 0) : Math.ceil(misplaced / 2);
    if (optimalSwaps < 0) optimalSwaps = 0;

    var effLatest = 0;
    if (misplaced === 0 && swapsUsed === 0) effLatest = 1;
    else effLatest = Games._g8Clamp01(optimalSwaps / Math.max(1, swapsUsed));

    var speedLatest = Games._g8SpeedTo01(timeMs);
    var hintLatest = hintUsed ? 1 : 0;

    function ema(latest, old) {
      var o = Number(old);
      if (!isFinite(o)) o = 0;
      return (0.25 * latest) + (0.75 * o);
    }

    var next = {
      accEMA: ema(1, prev.accEMA),
      effEMA: ema(effLatest, prev.effEMA),
      speedEMA: ema(speedLatest, prev.speedEMA),
      hintEMA: ema(hintLatest, prev.hintEMA),
      lastTs: now,
      plays: ((prev.plays | 0) || 0) + 1
    };

    var newScore = Games._g8ScoreFromStats(next);
    next.score = newScore;
    next.tier = Games._g8TierForScore(newScore);
    patterns[pattern] = next;

    store.events.push({ pattern: pattern, difficulty: difficulty, swapsUsed: swapsUsed, timeMs: timeMs, hintUsed: hintUsed, ts: now });
    if (store.events.length > 200) store.events = store.events.slice(store.events.length - 200);

    Games._g8SaveMasteryStore(store);

    try {
      var r = Games.runtime.round;
      if (r && r._g8DeltasByPattern && typeof r._g8DeltasByPattern === "object") {
        var delta = newScore - oldScore;
        if (typeof r._g8DeltasByPattern[pattern] !== "number") r._g8DeltasByPattern[pattern] = 0;
        r._g8DeltasByPattern[pattern] += delta;
        if (r._g8TouchedPatterns && typeof r._g8TouchedPatterns === "object") r._g8TouchedPatterns[pattern] = true;
      }
    } catch (eD) {}
  },

  _renderGame8MasteryMiniCard: function() {
    var r = Games.runtime.round;
    if (!r) return;
    if (Games.runtime.mode !== "normal") return;

    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId);
    if ((gameNum | 0) !== 8) return;
    var q0 = (r.questions && r.questions[0]) ? r.questions[0] : null;
    if (!q0 || q0.gameType !== "wordOrderSurgery") return;

    var panel = document.getElementById("play-complete-panel");
    if (!panel) return;

    var existing = document.getElementById("g8-mastery-mini-card");
    if (existing && existing.parentNode) {
      try { existing.parentNode.removeChild(existing); } catch (e0) {}
    }

    var deltas = (r._g8DeltasByPattern && typeof r._g8DeltasByPattern === "object") ? r._g8DeltasByPattern : {};
    var patterns = Object.keys(deltas);
    if (!patterns.length) return;

    var best = patterns[0];
    var worst = patterns[0];
    var bestDelta = Number(deltas[best]) || 0;
    var worstDelta = Number(deltas[worst]) || 0;
    for (var i = 1; i < patterns.length; i++) {
      var p = patterns[i];
      var d = Number(deltas[p]) || 0;
      if (d > bestDelta) { bestDelta = d; best = p; }
      if (d < worstDelta) { worstDelta = d; worst = p; }
    }

    var store = Games._g8LoadMasteryStore();
    var bestTier = (store.patterns && store.patterns[best]) ? String(store.patterns[best].tier || "") : "";
    var worstTier = (store.patterns && store.patterns[worst]) ? String(store.patterns[worst].tier || "") : "";

    var card = document.createElement("div");
    card.className = "round-summary-card";
    card.id = "g8-mastery-mini-card";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "15px";
    title.textContent = "Word Order Mastery";
    card.appendChild(title);

    var line1 = document.createElement("div");
    line1.className = "section-subtitle";
    line1.textContent = "Best today: " + best + (bestTier ? (" (" + bestTier + ")") : "");
    card.appendChild(line1);

    var line2 = document.createElement("div");
    line2.className = "section-subtitle";
    line2.textContent = "Needs work: " + worst + (worstTier ? (" (" + worstTier + ")") : "");
    card.appendChild(line2);

    var firstBtnRow = panel.querySelector(".button-row");
    if (firstBtnRow && firstBtnRow.parentNode) {
      firstBtnRow.parentNode.insertBefore(card, firstBtnRow);
    } else {
      panel.appendChild(card);
    }
  },

  showCompletionPanel: function() {
    var r = Games.runtime.round;
    if (!r) return;
    r.completed = true;

    try {
      if (Games.runtime) Games.runtime._roundEndTs = Date.now();
    } catch (eTs) {}

    // Why: completion screen is shared; ensure tense-only styling doesn't leak.
    Games._setTenseMode(false);

    Games._hideQuestionUI();

    var panel = document.getElementById("play-complete-panel");
    if (panel) panel.style.display = "block";

    var scoreEl = document.getElementById("play-complete-score");
    if (scoreEl) {
      if ((Games.runtime.totalCount | 0) <= 0) scoreEl.textContent = "No questions available for this game.";
      else scoreEl.textContent = "Score: " + Games.runtime.correctCount + "/" + Games.runtime.totalCount;
    }

    // Best score: compute from stored XP if available
    var bestEl = document.getElementById("play-complete-best");
    var bestXP = Games.currentGameBest || 0;
    var bestCorrect = Math.floor(bestXP / Games._xpEach());
    if (bestEl) {
      if ((Games.runtime.totalCount | 0) <= 0) bestEl.textContent = "";
      else bestEl.textContent = "Best: " + bestCorrect + "/" + Games.runtime.totalCount;
    }

    var praiseEl = document.getElementById("play-complete-praise");
    var skillEl = document.getElementById("play-complete-skill");

    var punjabiOn = Games.isPunjabiOn();
    if ((Games.runtime.totalCount | 0) <= 0) {
      if (praiseEl) praiseEl.textContent = punjabiOn ? "No questions yet. / ਹਾਲੇ ਸਵਾਲ ਨਹੀਂ ਹਨ।" : "No questions yet.";
      if (skillEl) skillEl.textContent = punjabiOn ? "Try another game from Play. / Play ਤੋਂ ਹੋਰ ਖੇਡ ਚੁਣੋ।" : "Try another game from Play.";
    } else {
      if (praiseEl) praiseEl.textContent = punjabiOn ? "Nice work! / ਵਧੀਆ!" : "Nice work!";
      if (skillEl) {
        var line = Games._buildImprovedAtLine();
        skillEl.textContent = punjabiOn && line.pa ? (line.en + " / " + line.pa) : line.en;
      }
    }

    // Append enhanced summary card (Games 1–6 only)
    if ((Games.runtime.totalCount | 0) > 0) {
      Games._renderRoundSummaryAndTipCard();
    }

    // Prompt 8: V2 end-of-round summary + Retry Missed (local-only) for Games 1 & 4.
    if ((Games.runtime.totalCount | 0) > 0) {
      try {
        Games._captureLastRoundSummaryV2();
        Games._renderG14EndOfRoundSummaryV2();
      } catch (eS14) {}
    }

    // Game 6-only: quick review of missed words
    if ((Games.runtime.totalCount | 0) > 0) {
      Games._renderGame6MissedMiniReviewCard();
    }

    // Game 8-only: mastery mini-card
    if ((Games.runtime.totalCount | 0) > 0) {
      Games._renderGame8MasteryMiniCard();
    }

    // Game 4-only: sentence check recap mini-card
    if ((Games.runtime.totalCount | 0) > 0) {
      try { Games._renderGame4RecapMiniCard(); } catch (eG4) {}
    }

    Games.disableNext();
    Games.updateScoreUI();
  },

  _stableKeyForQuestion: function(q) {
    if (!q || typeof q !== "object") return "";
    var k = "";
    try {
      if (q.key != null && String(q.key).trim()) k = String(q.key).trim();
      else if (q.seedKey != null && String(q.seedKey).trim()) k = String(q.seedKey).trim();
      else if (q.id != null && String(q.id).trim()) k = String(q.id).trim();
      else if (q.qid != null && String(q.qid).trim()) k = String(q.qid).trim();
    } catch (e0) { k = ""; }
    return k;
  },

  _captureLastRoundSummaryV2: function() {
    var r = Games.runtime.round;
    if (!r) return null;
    if (Games.runtime.mode !== "normal") return null;

    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId);
    if (!((gameNum | 0) === 1 || (gameNum | 0) === 4)) return null;

    var total = (typeof Games.runtime.totalCount === "number" && isFinite(Games.runtime.totalCount)) ? (Games.runtime.totalCount | 0) : (r.questions ? r.questions.length : 0);
    if (total < 0) total = 0;
    var correct = (typeof Games.runtime.correctCount === "number" && isFinite(Games.runtime.correctCount)) ? (Games.runtime.correctCount | 0) : 0;
    if (correct < 0) correct = 0;
    var wrong = Math.max(0, total - correct);

    var missesByQid = Games.runtime.missesByQid || {};
    var missedKeys = [];
    var missedQuestions = [];
    var missCountsByTag = {};
    var seenKey = {};

    for (var i = 0; i < (r.questions ? r.questions.length : 0); i++) {
      var q = r.questions[i];
      if (!q || !q.qid) continue;
      if (missesByQid[q.qid] !== true) continue;

      var key = Games._stableKeyForQuestion(q);
      if (!key) continue;
      if (seenKey[key]) continue;
      seenKey[key] = true;

      missedKeys.push(key);
      missedQuestions.push(q);

      var tag = (q.tag != null && String(q.tag).trim()) ? String(q.tag).trim() : "";
      if (tag) {
        if (typeof missCountsByTag[tag] !== "number") missCountsByTag[tag] = 0;
        missCountsByTag[tag] += 1;
      }
    }

    var hintUsed = 0;
    var whyUsed = 0;
    try {
      if (Games.runtime._scaffoldStats) {
        hintUsed = Games.runtime._scaffoldStats.hintUsed | 0;
        whyUsed = Games.runtime._scaffoldStats.whyUsed | 0;
      }
    } catch (eS) { hintUsed = 0; whyUsed = 0; }

    var summary = {
      date: (new Date()).toISOString(),
      gameNum: gameNum | 0,
      total: total,
      correct: correct,
      wrong: wrong,
      missedIds: missedKeys,
      missedQuestions: missedQuestions,
      missCountsByTag: missCountsByTag,
      hintUsedCount: hintUsed,
      whyUsedCount: whyUsed,
      startTs: (Games.runtime && typeof Games.runtime._roundStartTs === "number") ? (Games.runtime._roundStartTs | 0) : null,
      endTs: (Games.runtime && typeof Games.runtime._roundEndTs === "number") ? (Games.runtime._roundEndTs | 0) : null,
      versions: {
        data: (typeof DATA_VERSION !== "undefined") ? String(DATA_VERSION || "") : "",
        banks: {
          GAME1: (typeof BANK_VERSION_GAME1 !== "undefined") ? String(BANK_VERSION_GAME1 || "") : "",
          GAME4: (typeof BANK_VERSION_GAME4 !== "undefined") ? String(BANK_VERSION_GAME4 || "") : ""
        }
      }
    };

    Games.runtime._lastRoundSummary = summary;

    // Prompt 10: remember last non-tagPractice summary for remediation navigation.
    try {
      var ctx = (Games.runtime && Games.runtime.currentSession) ? Games.runtime.currentSession : null;
      var mode = ctx && ctx.mode ? String(ctx.mode) : "normal";
      if (mode !== "tagPractice") {
        Games.runtime._lastMainRoundSummaryV2 = summary;
      }
    } catch (eMS) {}

    // Optional persistence (local-only): last round summary per game.
    try {
      var kLs = "lastRoundSummary_" + String(summary.gameNum);
      var toStore = {
        date: summary.date,
        score: { correct: summary.correct, total: summary.total },
        missedIds: summary.missedIds,
        missCountsByTag: summary.missCountsByTag,
        versions: summary.versions
      };
      localStorage.setItem(kLs, JSON.stringify(toStore));
    } catch (eLs) {}

    return summary;
  },

  _renderG14EndOfRoundSummaryV2: function() {
    var r = Games.runtime.round;
    if (!r) return;
    if (Games.runtime.mode !== "normal") return;

    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId);
    if (!((gameNum | 0) === 1 || (gameNum | 0) === 4)) return;

    var panel = document.getElementById("play-complete-panel");
    if (!panel) return;

    // Remove old instance.
    var existing = document.getElementById("g14-round-complete-card");
    if (existing && existing.parentNode) {
      try { existing.parentNode.removeChild(existing); } catch (e0) {}
    }

    var summary = (Games.runtime && Games.runtime._lastRoundSummary) ? Games.runtime._lastRoundSummary : null;
    if (!summary) summary = Games._captureLastRoundSummaryV2();
    if (!summary) return;

    var ctxNow = (Games.runtime && Games.runtime.currentSession) ? Games.runtime.currentSession : null;
    var isTagPractice = !!(ctxNow && String(ctxNow.mode || "") === "tagPractice" && ctxNow.tagPractice && ctxNow.tagPractice.tag);

    // Hide the default completion action rows to avoid duplicate actions for Games 1 & 4.
    try {
      var btnBackMenu = document.getElementById("btn-play-back-menu");
      var btnAgain = document.getElementById("btn-play-again");
      var btnChoose = document.getElementById("btnChooseAnotherGame");
      if (btnBackMenu && btnBackMenu.parentNode) btnBackMenu.parentNode.style.display = "none";
      if (btnAgain && btnAgain.parentNode) btnAgain.parentNode.style.display = "none";
      if (btnChoose && btnChoose.parentNode) btnChoose.parentNode.style.display = "none";
    } catch (eHide) {}

    var card = document.createElement("div");
    card.className = "round-summary-card g14-round-complete";
    card.id = "g14-round-complete-card";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "15px";
    if (isTagPractice) {
      var prettyTp = Games._prettyTagNameV2(ctxNow.tagPractice.tag);
      title.textContent = prettyTp ? ("Practice complete: " + prettyTp) : "Practice complete";
    } else {
      title.textContent = "Round complete";
    }
    card.appendChild(title);

    var scoreLine = document.createElement("div");
    scoreLine.className = "section-subtitle";
    var pct = (summary.total > 0) ? Math.round((summary.correct / summary.total) * 100) : 0;
    scoreLine.textContent = "Score: " + String(summary.correct) + "/" + String(summary.total) + " (" + String(pct) + "%)";
    card.appendChild(scoreLine);

    if ((summary.hintUsedCount | 0) > 0 || (summary.whyUsedCount | 0) > 0) {
      var hw = document.createElement("div");
      hw.className = "section-subtitle";
      var parts = [];
      if ((summary.hintUsedCount | 0) > 0) parts.push("Hints used: " + String(summary.hintUsedCount | 0));
      if ((summary.whyUsedCount | 0) > 0) parts.push("Why used: " + String(summary.whyUsedCount | 0));
      hw.textContent = parts.join(" • ");
      card.appendChild(hw);
    }

    // Needs practice: show top miss tags if present.
    var tags = summary.missCountsByTag || {};
    var tagKeys = [];
    try { tagKeys = Object.keys(tags); } catch (eT) { tagKeys = []; }
    if (tagKeys.length) {
      tagKeys.sort(function(a, b) { return (tags[b] | 0) - (tags[a] | 0); });
      var topN = Math.min(3, tagKeys.length);
      var needs = document.createElement("div");
      needs.className = "section-subtitle";
      needs.style.marginTop = "8px";
      needs.textContent = "Needs practice";
      card.appendChild(needs);

      // Prompt 10: Fix<Tag> (8) remediation buttons (main summary only).
      if (!isTagPractice) {
        var fixWrap = document.createElement("div");
        fixWrap.className = "play-summary-actions";
        fixWrap.style.marginTop = "8px";

        var gameType = Games._mapGameNumToType(gameNum);
        var difficulty = (r && typeof r.difficulty === "number") ? (r.difficulty | 0) : ((State && State.getPlayDifficulty) ? State.getPlayDifficulty() : 2);
        var fullPool = Games.buildPoolForGameNum(gameNum);
        var candidates = Games._filterPoolForDifficultyV2(fullPool, gameType, difficulty, 8);

        for (var i = 0; i < topN; i++) {
          (function(tagRaw) {
            var tagClean = String(tagRaw || "").trim();
            var pretty = Games._prettyTagNameV2(tagClean) || tagClean;
            var avail = 0;
            for (var k = 0; k < candidates.length; k++) {
              var qq = candidates[k];
              if (!qq) continue;
              if (String(qq.tag || "").trim() === tagClean) avail++;
            }
            if (avail <= 0) return;
            var size = Math.min(8, Math.max(1, avail));

            var btnFix = document.createElement("button");
            btnFix.type = "button";
            btnFix.className = "btn btn-secondary";
            btnFix.textContent = "Fix " + pretty + " (" + String(size) + ")";
            btnFix.addEventListener("click", function() {
              Games.startTagPracticeFromSummaryV2(tagClean, size);
            });
            fixWrap.appendChild(btnFix);
          })(tagKeys[i]);
        }

        if (fixWrap.childNodes && fixWrap.childNodes.length) {
          card.appendChild(fixWrap);
        }
      }

      // Always show the top misses summary lines.
      for (var i2 = 0; i2 < topN; i2++) {
        var t2 = String(tagKeys[i2] || "").trim();
        var c2 = tags[t2] | 0;
        var line2 = document.createElement("div");
        line2.className = "section-subtitle";
        line2.textContent = "• " + String(Games._prettyTagNameV2(t2) || t2) + ": " + String(c2) + (c2 === 1 ? " miss" : " misses");
        card.appendChild(line2);
      }
    }

    var actions = document.createElement("div");
    actions.className = "play-summary-actions";
    actions.style.marginTop = "12px";

    var btnRetry = document.createElement("button");
    btnRetry.type = "button";
    btnRetry.className = "btn";
    btnRetry.textContent = "Retry missed";

    var btnPlayAgain = document.createElement("button");
    btnPlayAgain.type = "button";
    btnPlayAgain.className = "btn btn-secondary";
    btnPlayAgain.textContent = "Play again";

    var btnBack = document.createElement("button");
    btnBack.type = "button";
    btnBack.className = "btn btn-secondary";
    btnBack.textContent = "Back to Games";

    var btnAnother = null;
    if (isTagPractice && Games.runtime && Games.runtime._lastMainRoundSummaryV2 && Games.runtime._lastMainRoundSummaryV2.gameNum === (gameNum | 0)) {
      btnAnother = document.createElement("button");
      btnAnother.type = "button";
      btnAnother.className = "btn btn-secondary";
      btnAnother.textContent = "Practice another tag";
    }

    // Disable/hide retry if nothing missed.
    if (!Array.isArray(summary.missedIds) || !summary.missedIds.length) {
      btnRetry.disabled = true;
      btnRetry.style.display = "none";
    }

    if (btnAnother) actions.appendChild(btnAnother);
    actions.appendChild(btnRetry);
    actions.appendChild(btnPlayAgain);
    actions.appendChild(btnBack);
    card.appendChild(actions);

    try {
      if (!card.dataset.bound) {
        card.dataset.bound = "1";
        btnRetry.addEventListener("click", function() { Games.retryMissed(); });
        btnPlayAgain.addEventListener("click", function() { Games.playAgain(); UI.goTo("screen-play"); });
        btnBack.addEventListener("click", function() { Games.backToPlayMenu(); });
        if (btnAnother) {
          btnAnother.addEventListener("click", function() {
            try {
              Games.runtime._lastRoundSummary = Games.runtime._lastMainRoundSummaryV2;
              Games.runtime.currentSession = { gameNum: gameNum | 0, mode: "normal", tagPractice: null, seedKey: "" };
            } catch (e0) {}
            try { Games._renderG14EndOfRoundSummaryV2(); } catch (e1) {}
          });
        }
      }
    } catch (eB) {}

    // Insert before the first visible button row if possible.
    var firstBtnRow = panel.querySelector(".button-row");
    if (firstBtnRow && firstBtnRow.parentNode) {
      firstBtnRow.parentNode.insertBefore(card, firstBtnRow);
    } else {
      panel.appendChild(card);
    }
  },

  _renderGame4RecapMiniCard: function() {
    var r = Games.runtime.round;
    if (!r || !Array.isArray(r.questions) || !r.questions.length) return;
    var q0 = r.questions[0];
    if (!q0 || q0.gameType !== "sentenceCheck") return;

    var panel = document.getElementById("play-complete-panel");
    if (!panel) return;

    var existing = document.getElementById("g4-recap-mini-card");
    if (existing && existing.parentNode) {
      try { existing.parentNode.removeChild(existing); } catch (e0) {}
    }

    var store = Games._g4LoadJson(Games._g4RecapKey(), null);
    var entries = (store && store.round && Array.isArray(store.round.entries)) ? store.round.entries : [];
    if (!entries.length) return;

    var wrongCount = 0;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i] && entries[i].resolvedCorrect === false) wrongCount++;
    }

    var card = document.createElement("div");
    card.className = "round-summary-card";
    card.id = "g4-recap-mini-card";

    var title = document.createElement("div");
    title.className = "section-title";
    title.style.fontSize = "15px";
    title.textContent = "Sentence Check Recap";
    card.appendChild(title);

    var line1 = document.createElement("div");
    line1.className = "section-subtitle";
    line1.textContent = wrongCount ? ("Missed: " + wrongCount) : "No misses — nice!";
    card.appendChild(line1);

    // Show up to 3 missed prompts (English only to keep compact).
    var shown = 0;
    for (var j = 0; j < entries.length && shown < 3; j++) {
      var e = entries[j];
      if (!e || e.resolvedCorrect !== false) continue;
      var p = document.createElement("div");
      p.className = "section-subtitle";
      p.textContent = "• " + String(e.promptEn || "");
      card.appendChild(p);
      shown++;
    }

    var reports = Games._g4LoadJson(Games._g4ReportsKey(), { reports: [] });
    var reportCount = (reports && Array.isArray(reports.reports)) ? reports.reports.length : 0;
    var line2 = document.createElement("div");
    line2.className = "section-subtitle";
    line2.textContent = "Reports saved on this device: " + String(reportCount);
    card.appendChild(line2);

    var firstBtnRow = panel.querySelector(".button-row");
    if (firstBtnRow && firstBtnRow.parentNode) {
      firstBtnRow.parentNode.insertBefore(card, firstBtnRow);
    } else {
      panel.appendChild(card);
    }
  },

  _buildImprovedAtLine: function() {
    var tags = Games.runtime.correctTags || {};
    var topTag = null;
    var topCount = 0;
    for (var k in tags) {
      if (!tags.hasOwnProperty(k)) continue;
      if (tags[k] > topCount) {
        topTag = k;
        topCount = tags[k];
      }
    }
    if (!topTag) return { en: "You improved at: Practice", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਅਭਿਆਸ" };
    if (topTag.indexOf("POS:") === 0) return { en: "You improved at: Word Types", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਸ਼ਬਦ ਦੀਆਂ ਕਿਸਮਾਂ" };
    if (topTag.indexOf("TENSE:") === 0) return { en: "You improved at: Tense", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਕਾਲ" };
    if (topTag.indexOf("SENTENCE:") === 0) return { en: "You improved at: Sentences", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਵਾਕ" };
    return { en: "You improved at: Practice", pa: "ਤੁਸੀਂ ਸੁਧਾਰ ਕੀਤਾ: ਅਭਿਆਸ" };
  },

  _hideQuestionUI: function() {
    var optionsEl = document.getElementById("play-options");
    if (optionsEl) optionsEl.innerHTML = "";
    var qTextEl = document.getElementById("play-question-text");
    if (qTextEl) qTextEl.textContent = "";
    Games.renderFeedback(null);
  },

  _hideCompletionPanel: function() {
    var panel = document.getElementById("play-complete-panel");
    if (panel) panel.style.display = "none";
  },

  _clearCompletionUI: function() {
    Games._hideCompletionPanel();
    Games.disableNext();
  },

  playAgain: function() {
    var r = Games.runtime.round;
    if (!r) return;

    if (Games.runtime.mode === "maze11") {
      Games._maze11Teardown();
      Games._startMaze11(Games.currentGameType || 11);
      return;
    }

    var mode = Games.runtime.mode;
    var gameId = r.gameId;
    var label = r.label;
    var difficulty = r.difficulty;
    var questions = r.questions;

    // Restart with the same question list (non-normal modes) or reselect (normal)
    if (mode === "normal") {
      var gameNum = Games.currentGameType || Games._parseGameNumFromKey(gameId) || 1;
      var gameType = Games._mapGameNumToType(gameNum);
      var pool = Games.buildPoolForGameNum(gameNum);
      var selected = null;

      // Preserve existing special selectors
      if (gameType === "tense") {
        selected = Games.selectQuestionsTenseRamped(pool, difficulty, 10, false, null);
      } else if ((gameNum | 0) === 1 || (gameNum | 0) === 4) {
        selected = Games._selectRoundQuestionsV2(pool, gameNum, gameType, difficulty, 10, 0);
      } else {
        selected = Games.selectQuestions(pool, gameType, difficulty, 10, false, null);
      }

      selected = Games._applyGentleRampOrdering(selected, gameNum);
      questions = selected;
    }

    Games.beginRound({ mode: mode, gameId: gameId, label: label, difficulty: difficulty, questions: questions, onDone: Games.runtime.onDone, seed: Games.runtime.seed });
  },

  retryMissed: function() {
    var r = Games.runtime.round;
    if (!r) return;
    if (Games.runtime.mode !== "normal") return;

    // Prompt 8: Games 1 & 4 use the just-finished round summary (stable keys, no re-normalization).
    var gameNum = Games.currentGameType || Games._parseGameNumFromKey(r.gameId) || 0;
    if ((gameNum | 0) === 1 || (gameNum | 0) === 4) {
      var s = (Games.runtime && Games.runtime._lastRoundSummary) ? Games.runtime._lastRoundSummary : null;
      if (!s) {
        try { s = Games._captureLastRoundSummaryV2(); } catch (eC) { s = null; }
      }

      var missedQuestionsV2 = (s && Array.isArray(s.missedQuestions)) ? s.missedQuestions : [];
      if (!missedQuestionsV2.length) {
        return;
      }

      Games.beginRound({
        mode: "normal",
        gameId: r.gameId,
        label: r.label,
        difficulty: r.difficulty,
        questions: missedQuestionsV2,
        onDone: null,
        seed: null
      });
      UI.goTo("screen-play");
      return;
    }

    var misses = Games.runtime.missesByQid || {};
    var missedQids = [];
    try { missedQids = Object.keys(misses); } catch (e) { missedQids = []; }
    if (!missedQids.length) {
      try { if (window.UI && typeof UI.showToast === "function") UI.showToast("No missed questions to retry.", 2000); } catch (e2) {}
      return;
    }

    var missedQuestions = [];
    for (var i = 0; i < (r.questions ? r.questions.length : 0); i++) {
      var q = r.questions[i];
      var qid = q && q.qid;
      if (qid && misses[qid] === true) missedQuestions.push(q);
    }

    if (!missedQuestions.length) {
      try { if (window.UI && typeof UI.showToast === "function") UI.showToast("No missed questions to retry.", 2000); } catch (e3) {}
      return;
    }

    Games.beginRound({
      mode: "normal",
      gameId: r.gameId,
      label: r.label,
      difficulty: r.difficulty,
      questions: missedQuestions,
      onDone: null,
      seed: null
    });
    UI.goTo("screen-play");
  },

  backToPlayMenu: function() {
    Games._maze11Teardown();
    Games._setGame6AestheticMode(false);
    Games._setTenseMode(false);
    Games._csCleanup();
    Games.runtime.round = null;
    Games.runtime.submitted = false;
    Games.runtime.attemptsByQid = {};
    Games.runtime.missesByQid = {};
    Games.runtime.correctTags = {};
    Games.runtime.correctCount = 0;
    Games.runtime.totalCount = 0;
    Games.runtime.onDone = null;
    Games.runtime.mode = "normal";
    Games._clearSessionInState();

    Games._hideQuestionUI();
    Games._hideCompletionPanel();
    Games.updateScoreUI();

    // Hide round containers (round-only screen)
    var activePanel = document.getElementById("playActivePanel");
    if (activePanel) {
      activePanel.classList.add("is-hidden");
      activePanel.setAttribute("aria-hidden", "true");
    }
    var roundPanel = document.getElementById("playRound");
    if (roundPanel) {
      roundPanel.classList.add("is-hidden");
      roundPanel.setAttribute("aria-hidden", "true");
    }
    var completeWrap = document.getElementById("playCompletePanel");
    if (completeWrap) {
      completeWrap.classList.add("is-hidden");
      completeWrap.setAttribute("aria-hidden", "true");
    }

    // Return to the menu screen
    try { if (UI && UI.goTo) UI.goTo("screen-play-home"); } catch (e) {}
  },

  // ===== Session Persistence =====
  _saveSessionToState: function() {
    try {
      if (!State || !State.state || !State.state.session) return;
      var r = Games.runtime.round;
      if (!r || r.completed) {
        State.state.session.gameSession = null;
        State.save();
        return;
      }

      var qids = [];
      for (var i = 0; i < r.questions.length; i++) {
        if (r.questions[i] && r.questions[i].qid) qids.push(r.questions[i].qid);
      }

      State.state.session.gameSession = {
        gameId: (Games.currentGameType ? Games._getGameKey(Games.currentGameType) : (r.gameId || null)),
        mode: Games.runtime.mode,
        idx: r.idx,
        correctCount: Games.runtime.correctCount,
        qids: qids,
        difficulty: r.difficulty
      };
      State.save();
    } catch (e) {
      // Non-fatal
    }
  },

  _clearSessionInState: function() {
    try {
      if (State && State.state && State.state.session) {
        State.state.session.gameSession = null;
        State.save();
      }
    } catch (e) {}
  },

  // ===== Validator (console-only) =====
  validateQuestionBank: function(list) {
    if (!Array.isArray(list)) {
      console.warn("[Games.validateQuestionBank] list is not an array");
      return false;
    }
    var seen = {};
    var ok = true;
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if (!q || typeof q !== "object") {
        console.warn("[Games] q[" + i + "] not an object");
        ok = false;
        continue;
      }
      if (!q.qid) {
        console.warn("[Games] missing qid at index", i);
        ok = false;
      } else if (seen[q.qid]) {
        console.warn("[Games] duplicate qid:", q.qid);
        ok = false;
      } else {
        seen[q.qid] = true;
      }
      if (!q.gameType) {
        console.warn("[Games] missing gameType for", q.qid);
        ok = false;
      }
      if (!q.promptEn) {
        console.warn("[Games] missing promptEn for", q.qid);
        ok = false;
      }
      if (q.gameType === "tapWord") {
        var hasTokens = Array.isArray(q.tokens);
        var hasSingle = (typeof q.correctTokenIndex === "number");
        var hasMulti = Array.isArray(q.correctTokenIndices) && q.correctTokenIndices.length > 0;
        if (!hasTokens || (!hasSingle && !hasMulti)) {
          console.warn("[Games] tapWord missing tokens/correctTokenIndex(correctTokenIndices) for", q.qid);
          ok = false;
        }
      } else {
        // For choice games, correctIndex should be present (effective index computed at render)
      }
      if (Games.isPunjabiOn()) {
        // Warn only
        if (q.goalPa === "" || typeof q.goalPa === "undefined") {
          console.warn("[Games] Punjabi missing goalPa (warn):", q.qid);
        }
      }
    }
    return ok;
  },

  // ===== Score UI =====
  updateScoreUI: function() {
    var scoreEl = document.getElementById("play-score");
    if (scoreEl) scoreEl.textContent = Games.currentGameScore || 0;
    var streakEl = document.getElementById("play-streak");
    if (streakEl) streakEl.textContent = Games.currentGameStreak || 0;
    var bestEl = document.getElementById("play-best");
    if (bestEl) bestEl.textContent = Games.currentGameBest || 0;

    // Best score kept in-memory for this run only
    if (Games.runtime.mode === "normal" && Games.currentGameType) {
      if (Games.currentGameScore > Games.currentGameBest) {
        Games.currentGameBest = Games.currentGameScore;
      }
    }
  }
};

// =====================================
// Dev-only start for Game 8 (keep tile locked)
// =====================================
(function() {
  function isDevHost() {
    try {
      var h = (window.location && window.location.hostname) ? String(window.location.hostname) : "";
      return (h === "localhost" || h === "127.0.0.1" || h === "" || h.endsWith(".local"));
    } catch (e) {
      return false;
    }
  }

  function parseDifficultyStrToNum(s) {
    var t = String(s || "normal").toLowerCase().trim();
    if (t === "easy") return 1;
    if (t === "hard") return 3;
    return 2;
  }

  window.startGameById = window.startGameById || function(gameNum, opts) {
    var n = gameNum | 0;
    if (!window.Games) return;

    // Game 8 is dev-only; never enable via normal UI tile.
    if (n === 8) {
      if (!isDevHost()) {
        try {
          if (window.UI && typeof UI.showToast === "function") {
            UI.showToast("Coming soon — try Vocab Vault (Game 6) for now.", 2500);
          }
        } catch (e2) {}
        return;
      }
      var d = (opts && typeof opts.difficulty === "string") ? opts.difficulty : "normal";
      return window.Games._debugStartGame8WordOrder(d);
    }

    return window.Games.startGame(n);
  };
})();

// =====================================
// Debug-only: Game 4 Content QA Report
// =====================================
(function() {
  try {
    if (typeof window === "undefined" || !window) return;
    var BOLO_DEBUG = (window.BOLO_DEBUG === true) || (window.BOLO_QA === true);
    if (!BOLO_DEBUG) return;

    window.BOLO_QA = window.BOLO_QA || {};

    window.BOLO_QA.runGame4Report = function runGame4Report(opts) {
      opts = opts || {};
      var includeRaw = !!opts.includeRaw;
      var includeNormalized = (opts.includeNormalized !== false);
      var maxIssues = (typeof opts.maxIssues === "number") ? opts.maxIssues : Infinity;
      var consoleSummary = (opts.consoleSummary !== false);
      var consoleJSON = !!opts.consoleJSON;

      var debug = BOLO_DEBUG;
      var generatedAtISO = (new Date()).toISOString();

      var sanitizeOpt = (typeof sanitizeOptionText === "function")
        ? sanitizeOptionText
        : function(s) { return String(s == null ? "" : s).trim(); };

      var trimFn = (typeof trimSpaces === "function")
        ? trimSpaces
        : function(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); };

      var bank = (typeof GAME4_QUESTIONS !== "undefined" && Array.isArray(GAME4_QUESTIONS)) ? GAME4_QUESTIONS : [];

      var report = {
        meta: {
          generatedAtISO: generatedAtISO,
          totalQuestions: bank.length,
          debug: debug
        },
        summary: {
          issueCount: 0,
          byType: {},
          bySeverity: {}
        },
        issues: []
      };

      function bump(map, key) {
        if (!key) return;
        map[key] = (map[key] || 0) + 1;
      }

      function addIssue(issue) {
        if (report.issues.length >= maxIssues) return;
        report.issues.push(issue);
        bump(report.summary.byType, issue.type);
        bump(report.summary.bySeverity, issue.severity);
      }

      function makeNormalizedPreview(idx, trackId, aClean, bClean, correctChoiceId, q) {
        return {
          id: "G4_" + idx,
          gameId: "GAME4",
          trackId: trackId,
          prompt: "Pick the correct sentence:",
          choices: [
            { id: "a", text: aClean },
            { id: "b", text: bClean }
          ],
          correctChoiceId: correctChoiceId,
          hintEn: (q && q.hintEn) ? q.hintEn : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.hintEn) ? GAME4_FALLBACK.hintEn : "",
          hintPa: (q && q.hintPa) ? q.hintPa : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.hintPa) ? GAME4_FALLBACK.hintPa : "",
          explanationEn: (q && q.explanationEn) ? q.explanationEn : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.explanationEn) ? GAME4_FALLBACK.explanationEn : "",
          explanationPa: (q && q.explanationPa) ? q.explanationPa : (typeof GAME4_FALLBACK !== "undefined" && GAME4_FALLBACK && GAME4_FALLBACK.explanationPa) ? GAME4_FALLBACK.explanationPa : ""
        };
      }

      for (var i = 0; i < bank.length; i++) {
        var q = bank[i] || {};
        var trackId = q.trackId;

        try {
          var optsArr = Array.isArray(q.options) ? q.options : null;
          if (!optsArr || optsArr.length < 2) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "MISSING_OPTIONS",
              details: "options missing or has < 2 entries",
              raw: includeRaw ? { options: q.options, correct: q.correct, optionsPa: q.optionsPa } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, "", "", "a", q) : undefined
            });
          }

          var aRaw = (optsArr && optsArr[0] != null) ? String(optsArr[0]) : "";
          var bRaw = (optsArr && optsArr[1] != null) ? String(optsArr[1]) : "";
          var aClean = sanitizeOpt(aRaw);
          var bClean = sanitizeOpt(bRaw);

          if (!aClean || !bClean) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "EMPTY_AFTER_SANITIZE",
              details: "one or both options empty after sanitization",
              raw: includeRaw ? { a: aRaw, b: bRaw } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, "a", q) : undefined
            });
          }

          var correctRaw = (q.correct != null) ? String(q.correct) : "";
          if (!trimFn(correctRaw)) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "error",
              type: "CORRECT_MISSING",
              details: "correct field missing/empty",
              raw: includeRaw ? { correct: q.correct } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, "a", q) : undefined
            });
          }

          var correctClean = sanitizeOpt(correctRaw);

          // Matching only: trimmed + case-insensitive (must mirror normalizeGame4Questions behavior)
          var keyCorrect = trimFn(correctClean).toLowerCase();
          var keyA = trimFn(aClean).toLowerCase();
          var keyB = trimFn(bClean).toLowerCase();
          var matchesA = (keyCorrect && keyA) ? (keyCorrect === keyA) : false;
          var matchesB = (keyCorrect && keyB) ? (keyCorrect === keyB) : false;

          var correctChoiceId = "a";
          if (matchesA && !matchesB) correctChoiceId = "a";
          else if (matchesB && !matchesA) correctChoiceId = "b";
          else correctChoiceId = "a";

          if (keyCorrect) {
            if (matchesA && matchesB) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "warn",
                type: "CORRECT_AMBIGUOUS",
                details: "correct matches both options after sanitize/trim/casefold",
                raw: includeRaw ? { correct: correctRaw, a: aRaw, b: bRaw } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            } else if (!matchesA && !matchesB) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "error",
                type: "CORRECT_NO_MATCH",
                details: "correct does not match either option after sanitize/trim/casefold",
                raw: includeRaw ? { correct: correctRaw, a: aRaw, b: bRaw } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            }
          }

          // Punjabi checks
          if (!Array.isArray(q.optionsPa) || q.optionsPa.length < 2) {
            addIssue({
              index: i,
              trackId: trackId,
              severity: "warn",
              type: "PUNJABI_MISSING",
              details: "optionsPa missing or has < 2 entries",
              raw: includeRaw ? { optionsPa: q.optionsPa } : undefined,
              normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
            });
          } else {
            var pa0 = (q.optionsPa[0] != null) ? String(q.optionsPa[0]) : "";
            var pa1 = (q.optionsPa[1] != null) ? String(q.optionsPa[1]) : "";
            var t0 = trimFn(pa0);
            var t1 = trimFn(pa1);
            if (t0 && t1 && t0 === t1) {
              addIssue({
                index: i,
                trackId: trackId,
                severity: "info",
                type: "PUNJABI_OPTIONS_DUPLICATE",
                details: "optionsPa[0] equals optionsPa[1] after trim",
                raw: includeRaw ? { pa0: pa0, pa1: pa1 } : undefined,
                normalized: includeNormalized ? makeNormalizedPreview(i, trackId, aClean, bClean, correctChoiceId, q) : undefined
              });
            }
          }
        } catch (e) {
          addIssue({
            index: i,
            trackId: trackId,
            severity: "error",
            type: "INTERNAL_ERROR",
            details: "exception while analyzing question: " + (e && e.message ? e.message : String(e)),
            raw: includeRaw ? { q: q } : undefined,
            normalized: undefined
          });
        }
      }

      report.summary.issueCount = report.issues.length;

      if (consoleSummary) {
        try {
          console.group("[BOLO_QA] Game 4 Report");
          console.log("Questions:", report.meta.totalQuestions, "Issues:", report.summary.issueCount);
          console.log("By type:", report.summary.byType);
          console.log("By severity:", report.summary.bySeverity);

          var preview = report.issues.slice(0, 10).map(function(it) {
            return {
              index: it.index,
              trackId: it.trackId,
              severity: it.severity,
              type: it.type,
              details: it.details
            };
          });
          if (preview.length) console.table(preview);
          else console.log("No issues found.");
          console.groupEnd();
        } catch (e2) {
          // ignore
        }
      }

      if (consoleJSON) {
        try { console.log(JSON.stringify(report, null, 2)); } catch (e3) {}
      }

      return report;
    };
  } catch (e) {
    // ignore
  }
})();

/*

## Phase 2 Manual QA (pass/fail)

- Normal Play (each game 1–4): correct → Next enabled → advances
- 1 wrong then correct: hint shown; Next stays disabled until correct
- 2nd wrong: correct answer shown; Help applied; Next enabled
- Completion panel: score, best, praise, “improved at” line visible
- Buttons: Play Again restarts; Back to Play Menu exits

- Difficulty: tap cycles label; next round reflects difficulty

*/
