"""One-off patch: Game 2 (pos) UI enhancements in app/js/games.js.

Why this exists: apply_patch is disabled in this environment.
This script performs targeted, assertion-based edits so changes are safe.

Run:
  python3 tools/patch_game2_ui_runner.py
"""

from __future__ import annotations

import re
from pathlib import Path


def must_find(pattern: str, text: str, desc: str) -> None:
    if not re.search(pattern, text, flags=re.M):
        raise SystemExit(f"Missing expected pattern for {desc}: {pattern}")


def main() -> None:
    path = Path("app/js/games.js")
    src = path.read_text(encoding="utf-8")
    orig = src

    # 1) Add runtime caches after seed
    must_find(r"runtime:\s*\{", src, "runtime object")
    must_find(r"\n\s*seed:\s*null\s*\n\s*\}\s*,", src, "runtime.seed field")
    src = re.sub(
        r"(\n\s*seed:\s*null)\s*\n(\s*\}\s*,)",
        r"\1,\n\n    // UI/runtime-only caches (per round)\n    _lastRenderedQid: null,\n    _optionSetCache: {},\n    _posHintWhyStateByQid: {}\n\2",
        src,
        count=1,
        flags=re.M,
    )

    # 2) Reset caches in beginRound after seed assignment
    must_find(r"beginRound:\s*function\(opts\)\s*\{", src, "beginRound")
    must_find(r"Games\.runtime\.seed\s*=\s*opts\.seed\s*\|\|\s*null;", src, "beginRound seed assignment")
    src = re.sub(
        r"(Games\.runtime\.seed\s*=\s*opts\.seed\s*\|\|\s*null;)",
        r"\1\n\n    Games.runtime._lastRenderedQid = null;\n    Games.runtime._optionSetCache = {};\n    Games.runtime._posHintWhyStateByQid = {};",
        src,
        count=1,
        flags=re.M,
    )

    # 3) In render(): add qid tracking right after q validity check
    must_find(r"var q = r\.questions\[r\.idx\];", src, "render current question")
    pat_q_invalid = (
        r"var q = r\.questions\[r\.idx\];\n"
        r"\s*if \(!q \|\| typeof q !== \"object\"\) \{\n"
        r"\s*r\.completed = true;\n"
        r"\s*Games\.showCompletionPanel\(\);\n"
        r"\s*return;\n"
        r"\s*\}\n"
    )
    must_find(pat_q_invalid, src, "render invalid-q guard")
    insert_qid = (
        "\n    // Track when a new question becomes active (for per-question UI reset).\n"
        "    var qidForUi = q.qid || (\"Q_\" + String(r.idx));\n"
        "    if (Games.runtime._lastRenderedQid !== qidForUi) {\n"
        "      Games.runtime._lastRenderedQid = qidForUi;\n"
        "      if (q.gameType === \"pos\") {\n"
        "        Games.runtime._posHintWhyStateByQid[qidForUi] = { hintOpen: false, whyOpen: false };\n"
        "      }\n"
        "    }\n"
    )
    src = re.sub(pat_q_invalid, lambda m: m.group(0) + insert_qid, src, count=1, flags=re.M)

    # Add call to _renderPosHintWhy(q) after options render blocks
    must_find(
        r"else if \(q\.gameType === \"sentenceCheck\"\) \{\n\s*Games\._renderChoiceQuestion\(q, optionsEl\);\n\s*\}\n\n\s*Games\.updateScoreUI\(\);",
        src,
        "render options section",
    )
    src = re.sub(
        r"(else if \(q\.gameType === \"sentenceCheck\"\) \{\n\s*Games\._renderChoiceQuestion\(q, optionsEl\);\n\s*\}\n)",
        r"\1\n    // Game 2 only: show Hint/Why toggles (injected above feedback)\n    Games._renderPosHintWhy(q);\n",
        src,
        count=1,
        flags=re.M,
    )

    # 4) Cache option subset for pos in _buildOptionSetForDifficulty
    must_find(r"_buildOptionSetForDifficulty:\s*function\(q\)\s*\{", src, "_buildOptionSetForDifficulty")
    must_find(
        r"// Deterministic in quest mode, random in normal\n\s*var rng = \(Games\.runtime\.mode === \"quest\"\) \? Games\._seededRng\(hashStringToInt\(\(q\.qid \|\| \"\"\) \+ \"\:\" \+ String\(keepCount\)\)\) : Math\.random;",
        src,
        "difficulty rng line",
    )
    repl_rng = (
        "// Game 2: cache stable option subsets per question in normal mode (prevents reshuffle on re-render).\n"
        "      // Keep logic deterministic in quest mode.\n"
        "      var qid = q.qid || \"\";\n"
        "      var cacheKey = null;\n"
        "      if (q.gameType === \"pos\") {\n"
        "        cacheKey = String(qid) + \":\" + String(keepCount);\n"
        "        var cached = Games.runtime && Games.runtime._optionSetCache ? Games.runtime._optionSetCache[cacheKey] : null;\n"
        "        if (cached && Array.isArray(cached.optionIds) && Array.isArray(cached.optionLabels)) {\n"
        "          return cached;\n"
        "        }\n"
        "      }\n\n"
        "      // Deterministic in quest mode, random (but cached) in normal\n"
        "      var rng = (Games.runtime.mode === \"quest\")\n"
        "        ? Games._seededRng(hashStringToInt((qid || \"\") + \":\" + String(keepCount)))\n"
        "        : Math.random;"
    )
    src = re.sub(
        r"// Deterministic in quest mode, random in normal\n\s*var rng = \(Games\.runtime\.mode === \"quest\"\) \? Games\._seededRng\(hashStringToInt\(\(q\.qid \|\| \"\"\) \+ \"\:\" \+ String\(keepCount\)\)\) : Math\.random;",
        repl_rng,
        src,
        count=1,
        flags=re.M,
    )

    must_find(
        r"return \{\n\s*optionIds: opts\.map\(function\(o\) \{ return o\.id; \}\),\n\s*optionLabels: opts\.map\(function\(o\) \{ return o\.label; \}\),\n\s*optionLabelsPa: opts\.map\(function\(o\) \{ return o\.labelPa; \}\),\n\s*correctIndex: chosenIds\.indexOf\(correctId\)\n\s*\};",
        src,
        "option set return",
    )
    return_repl = (
        "var built = {\n"
        "        optionIds: opts.map(function(o) { return o.id; }),\n"
        "        optionLabels: opts.map(function(o) { return o.label; }),\n"
        "        optionLabelsPa: opts.map(function(o) { return o.labelPa; }),\n"
        "        correctIndex: chosenIds.indexOf(correctId)\n"
        "      };\n\n"
        "      if (q.gameType === \"pos\" && cacheKey && Games.runtime && Games.runtime._optionSetCache) {\n"
        "        Games.runtime._optionSetCache[cacheKey] = built;\n"
        "      }\n\n"
        "      return built;"
    )
    src = re.sub(
        r"return \{\n\s*optionIds: opts\.map\(function\(o\) \{ return o\.id; \}\),\n\s*optionLabels: opts\.map\(function\(o\) \{ return o\.label; \}\),\n\s*optionLabelsPa: opts\.map\(function\(o\) \{ return o\.labelPa; \}\),\n\s*correctIndex: chosenIds\.indexOf\(correctId\)\n\s*\};",
        return_repl,
        src,
        count=1,
        flags=re.M,
    )

    # 5) Punjabi-first labels for pos in _renderChoiceQuestion
    must_find(r"if \(punjabiOn && pa\) \{\n\s*btn\.innerHTML = \"\";\n\s*var enDiv = document\.createElement\(\"div\"\);", src, "choice render punjabi block")
    choice_block = (
        "if (punjabiOn && pa) {\n"
        "          btn.innerHTML = \"\";\n"
        "          // Game 2: Punjabi-first labels when Punjabi mode is on.\n"
        "          if (q && q.gameType === \"pos\") {\n"
        "            var paDivFirst = document.createElement(\"div\");\n"
        "            paDivFirst.setAttribute(\"lang\", \"pa\");\n"
        "            paDivFirst.textContent = pa;\n"
        "            btn.appendChild(paDivFirst);\n"
        "            var enDivSecond = document.createElement(\"div\");\n"
        "            enDivSecond.style.opacity = \"0.9\";\n"
        "            enDivSecond.textContent = en;\n"
        "            btn.appendChild(enDivSecond);\n"
        "          } else {\n"
        "            var enDiv = document.createElement(\"div\");\n"
        "            enDiv.textContent = en;\n"
        "            btn.appendChild(enDiv);\n"
        "            var paDiv = document.createElement(\"div\");\n"
        "            paDiv.setAttribute(\"lang\", \"pa\");\n"
        "            paDiv.style.opacity = \"0.9\";\n"
        "            paDiv.textContent = pa;\n"
        "            btn.appendChild(paDiv);\n"
        "          }\n"
        "        } else {\n"
        "          btn.textContent = en;\n"
        "        }"
    )
    src = re.sub(
        r"if \(punjabiOn && pa\) \{\n\s*btn\.innerHTML = \"\";\n\s*var enDiv = document\.createElement\(\"div\"\);\n\s*enDiv\.textContent = en;\n\s*btn\.appendChild\(enDiv\);\n\s*var paDiv = document\.createElement\(\"div\"\);\n\s*paDiv\.setAttribute\(\"lang\", \"pa\"\);\n\s*paDiv\.style\.opacity = \"0\.9\";\n\s*paDiv\.textContent = pa;\n\s*btn\.appendChild\(paDiv\);\n\s*\} else \{\n\s*btn\.textContent = en;\n\s*\}",
        choice_block,
        src,
        count=1,
        flags=re.M,
    )

    # 6) Add gameType to feedback payloads and richer correct feedback for pos
    must_find(r"var correctPayload = \{\n\s*correct: true,", src, "correctPayload")
    src = re.sub(
        r"var correctPayload = \{\n\s*correct: true,",
        "var correctPayload = {\n        gameType: q.gameType,\n        correct: true,",
        src,
        count=1,
        flags=re.M,
    )

    src = re.sub(
        r"Games\.renderFeedback\(\{\n\s*correct: false,",
        "Games.renderFeedback({\n        gameType: q.gameType,\n        correct: false,",
        src,
        count=2,
        flags=re.M,
    )

    must_find(
        r"if \(payload\.correct\) \{\n\s*addLine\(\(payload\.correctTextEn \|\| \"Correct!\"\) \+ \" \+\" \+ Games\._xpEach\(\) \+ \" XP\", null\);\n\s*if \(punjabiOn && payload\.correctTextPa\) addLine\(payload\.correctTextPa, \"pa\"\);",
        src,
        "renderFeedback correct block",
    )
    insert_answer = (
        "      // Game 2: richer correct feedback (also show the answer)\n"
        "      if (payload.gameType === \"pos\" && payload.correctAnswerEn) {\n"
        "        addLine(\"Answer: \" + payload.correctAnswerEn, null);\n"
        "        if (punjabiOn) addLine(\"ਜਵਾਬ: \" + (payload.correctAnswerPa || payload.correctAnswerEn), \"pa\");\n"
        "      }\n"
    )
    src = re.sub(
        r"(if \(payload\.correct\) \{\n\s*addLine\(\(payload\.correctTextEn \|\| \"Correct!\"\) \+ \" \+\" \+ Games\._xpEach\(\) \+ \" XP\", null\);\n\s*if \(punjabiOn && payload\.correctTextPa\) addLine\(payload\.correctTextPa, \"pa\"\);\n)",
        lambda m: m.group(1) + insert_answer,
        src,
        count=1,
        flags=re.M,
    )

    # 7) Add helpers before _toastTimer
    must_find(r"Games\._showPlayFeedbackToast\(payload\);\n\s*\}\,\n\n\s*_toastTimer:\s*null,", src, "renderFeedback end before _toastTimer")

    helpers = """
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
        row.style.marginTop = "8px";
        fb.parentNode.insertBefore(row, fb);
      }
      if (!panel) {
        panel = document.createElement("div");
        panel.id = "play-pos-hintwhy-panel";
        panel.className = "section-subtitle";
        panel.style.marginTop = "6px";
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
          whyBtn.innerHTML = '<span class="btn-label-en">Why?</span><span class="btn-label-pa" lang="pa">ਕਿਉਂ?</span>';

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
      wrap.style.marginTop = "6px";
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
    if (st2.whyOpen && hasWhy) addBlock("Why?", "ਕਿਉਂ?", expBoth);
  },
""".strip("\n")

    src = re.sub(
        r"(Games\._showPlayFeedbackToast\(payload\);\n\s*\}\,)\n\n\s*_toastTimer:\s*null,",
        lambda m: m.group(1) + ",\n\n" + helpers + "\n\n  _toastTimer: null,",
        src,
        count=1,
        flags=re.M,
    )

    if src == orig:
        raise SystemExit("No changes applied; aborting")
    # Basic duplicate guards
    if src.count("_renderPosHintWhy: function") != 1:
        raise SystemExit(f"Unexpected _renderPosHintWhy definitions: {src.count('_renderPosHintWhy: function')}")
    if not re.search(r"Games\._renderPosHintWhy\(q\);", src):
        raise SystemExit("Missing call to Games._renderPosHintWhy(q) in render()")

    path.write_text(src, encoding="utf-8")
    print("Patched app/js/games.js")


if __name__ == "__main__":
    main()
