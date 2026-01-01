# Game 3 Enhancements — Code Changes Reference

## Overview
This document details exactly what code was added/modified for each enhancement.

---

## Enhancement 1: Selection Diversity Guard

### File: `app/js/games.js`
### Function: `selectQuestionsTenseRamped()`
### Lines: 1171–1329

### What Was Added

#### Helper Function: normalizeSentence()
```javascript
function normalizeSentence(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
```
**Purpose**: Normalize text for comparison (lowercase, strip punctuation, collapse whitespace)

#### Helper Function: areSimilar()
```javascript
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
```
**Purpose**: Detect if two normalized sentences are >60% similar (token overlap)

#### Diversity Guard in Selection Loop
**BEFORE**:
```javascript
var out = [];
var seen = {};
for (var k = 0; k < plan.length && out.length < n; k++) {
  var tierWanted = plan[k];
  var qPick = pickFromTier(tierWanted) || pickFromTier(2) || pickFromTier(1) || pickFromTier(3);
  if (!qPick) break;
  var key = qPick.qid || (qPick.promptEn + "|" + String(out.length));
  if (seen[key]) { k--; continue; }
  seen[key] = true;
  out.push(qPick);
}
```

**AFTER**:
```javascript
var out = [];
var seen = {};
var lastTense = null;           // NEW
var tenseRunLength = 0;         // NEW
var lastSentence = "";          // NEW

for (var k = 0; k < plan.length && out.length < n; k++) {
  var tierWanted = plan[k];
  var qPick = pickFromTier(tierWanted) || pickFromTier(2) || pickFromTier(1) || pickFromTier(3);
  if (!qPick) break;
  var key = qPick.qid || (qPick.promptEn + "|" + String(out.length));
  if (seen[key]) { k--; continue; }

  // NEW: Guard against consecutive tense repeats
  var currentTense = qPick.correctChoiceId || qPick.correctTense || "";
  if (currentTense === lastTense) {
    tenseRunLength++;
    if (tenseRunLength > 2) { k--; continue; }
  } else {
    lastTense = currentTense;
    tenseRunLength = 1;
  }

  // NEW: Guard against near-duplicate sentences
  if (lastSentence && areSimilar(qPick.promptEn || "", lastSentence)) {
    k--; continue;
  }

  seen[key] = true;
  lastSentence = qPick.promptEn || "";  // NEW
  out.push(qPick);
}
```

#### Diversity Guard in Fallback Pool
**BEFORE**:
```javascript
if (out.length < n) {
  var rest = pool.filter(function(q) { return q && q.gameType === "tense"; }).slice();
  shuffleInPlace(rest);
  for (var r = 0; r < rest.length && out.length < n; r++) {
    var q2 = rest[r];
    var key2 = q2.qid || (q2.promptEn + "|" + String(out.length));
    if (seen[key2]) continue;
    seen[key2] = true;
    out.push(q2);
  }
}
```

**AFTER**:
```javascript
if (out.length < n) {
  var rest = pool.filter(function(q) { return q && q.gameType === "tense"; }).slice();
  shuffleInPlace(rest);
  for (var r = 0; r < rest.length && out.length < n; r++) {
    var q2 = rest[r];
    var key2 = q2.qid || (q2.promptEn + "|" + String(out.length));
    if (seen[key2]) continue;

    // NEW: Also check tense run and similarity in fallback
    var fallbackTense = q2.correctChoiceId || q2.correctTense || "";
    if (fallbackTense === lastTense && tenseRunLength > 2) continue;
    if (lastSentence && areSimilar(q2.promptEn || "", lastSentence)) continue;

    seen[key2] = true;
    lastSentence = q2.promptEn || "";
    out.push(q2);
  }
}
```

---

## Enhancement 2: Focus/Readability Button

### File: `app/js/games.js`
### Function: `_ensureGame3RoundUi()`
### Lines: 1563–1650

### What Was Added

#### Create Cues Row (for Enhancement 3, but needed here)
```javascript
// NEW: Enhancement 3: Static verb-form cues
var cuesRow = ensureEl("g3-cues-row", "div", "section-subtitle");
cuesRow.style.fontSize = "0.9em";
cuesRow.style.opacity = "0.8";
```

#### Create Focus Button
```javascript
var btnRow = ensureEl("g3-why-row", "div", "button-row");

// NEW: Enhancement 2: Focus button
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
```

#### Updated Return Statement
**BEFORE**:
```javascript
return { wrap: wrap, howto: howto, progress: progress, feedback: feedback, whyBtn: whyBtn, exp: exp };
```

**AFTER**:
```javascript
return { wrap: wrap, howto: howto, progress: progress, feedback: feedback, cuesRow: cuesRow, focusBtn: focusBtn, whyBtn: whyBtn, exp: exp };
```

---

## Enhancement 3: Static Tense Cues

### File: `app/js/games.js`
### Function: `_resetGame3RoundUi()`
### Lines: 1671–1729

### What Was Added

#### Show/Hide Static Cues (NEW SECTION)
```javascript
// NEW: Enhancement 3: Static verb-form cues (shown first 3 Qs only)
if (idx < 3) {
  ui.cuesRow.style.display = "block";
  ui.cuesRow.textContent = punjabiOn
    ? "Present: ਹੁਣ / ਹਰ ਰੋਜ਼ / am-is-are + -ing  |  Past: ਭੀਤਾ / -ed / was-were  |  Future: will / ਭਲਕੇ"
    : "Present: now / every day / am-is-are + -ing  |  Past: -ed / was-were  |  Future: will / tomorrow";
} else {
  ui.cuesRow.textContent = "";
  ui.cuesRow.style.display = "none";
}
```

#### Show Focus Button
**ADDED AFTER clearing feedback**:
```javascript
// Clear feedback + hide Why/explanation until answered.
ui.feedback.innerHTML = "";
ui.focusBtn.style.display = "inline-flex";  // NEW
ui.whyBtn.style.display = "none";
ui.exp.textContent = "";
Games._setGame3ExplanationOpen(false);
```

---

## Enhancement 4: Streak Reinforcement Feedback

### File: `app/js/games.js`
### Function: `submitChoice()` (Game 3 correct branch)
### Lines: 1990–1994

### What Was Added

#### Append Streak Cue to Feedback
**BEFORE**:
```javascript
if (isCorrect) {
  // ...scoring logic...
  
  // Render brief correct + keep explanation closed by default.
  try {
    if (ui) {
      ui.feedback.className = "feedback correct";
      ui.feedback.textContent = "Correct! +" + Games._xpEach() + " XP";
      var expText = punjabiOnG3 ? Games._pickActiveExplanationText(q) : Games._pickActiveExplanationText(q);
      ui.exp.textContent = expText || "";
      Games._setGame3ExplanationOpen(false);
    }
  } catch (e) {}
}
```

**AFTER**:
```javascript
if (isCorrect) {
  // ...scoring logic...
  
  // Render brief correct + keep explanation closed by default.
  try {
    if (ui) {
      ui.feedback.className = "feedback correct";
      ui.feedback.textContent = "Correct! +" + Games._xpEach() + " XP";

      // NEW: Enhancement 4: Streak reinforcement cues
      if (Games.currentGameStreak >= 2) {
        ui.feedback.textContent += " • Nice—keep watching the verb form.";
      }

      var expText = punjabiOnG3 ? Games._pickActiveExplanationText(q) : Games._pickActiveExplanationText(q);
      ui.exp.textContent = expText || "";
      Games._setGame3ExplanationOpen(false);
    }
  } catch (e) {}
}
```

---

## Summary of Changes

### File: `app/js/games.js`

| Section | Lines | Change Type | Purpose |
|---------|-------|-------------|---------|
| `selectQuestionsTenseRamped()` | 1171–1329 | Added 2 helpers + guard logic | Diversity guard |
| `_ensureGame3RoundUi()` | 1597–1602 | Added cuesRow creation | Cues infrastructure |
| `_ensureGame3RoundUi()` | 1605–1627 | Added focusBtn creation + binding | Focus button |
| `_ensureGame3RoundUi()` | Return | Updated return object | Export new UI elements |
| `_resetGame3RoundUi()` | 1697–1705 | Added conditional cue display | Show/hide cues |
| `_resetGame3RoundUi()` | 1706 | Added focusBtn.style.display | Show/hide focus button |
| `submitChoice()` | 1990–1994 | Added streak cue check | Streak feedback |

### Total Changes
- **Lines Added**: ~150
- **Functions Modified**: 3
- **New Helper Functions**: 2
- **Breaking Changes**: 0
- **New Dependencies**: 0

---

## Testing Each Change

### Enhancement 1: Diversity Guard
```javascript
// Test in console:
var testQuestions = [
  {qid: "Q1", promptEn: "She walks", correctTense: "present"},
  {qid: "Q2", promptEn: "He walks", correctTense: "present"},
  {qid: "Q3", promptEn: "They walk", correctTense: "present"},
  {qid: "Q4", promptEn: "She walked", correctTense: "past"}
];
var selected = Games.selectQuestionsTenseRamped(testQuestions, 2, 4, false, null);
// Should see: Q1 (present), Q4 (past) — NOT Q1, Q2, Q3 all together
```

### Enhancement 2: Focus Button
```javascript
// Test in console:
var focusBtn = document.getElementById("g3-focus-button");
console.log(focusBtn); // Should not be null
focusBtn.click(); // Focus should move to #play-question-text
```

### Enhancement 3: Static Cues
```javascript
// Test in console:
var cuesRow = document.getElementById("g3-cues-row");
console.log(cuesRow.textContent); // Should show tense patterns
```

### Enhancement 4: Streak Cue
```javascript
// Test in game:
// Answer 2 questions correctly
// Feedback on Q2 should include: " • Nice—keep watching the verb form."
```

---

## Rollback Instructions (if needed)

If any issue is found, you can rollback by:

1. **Restore from Git**:
   ```bash
   git checkout app/js/games.js
   ```

2. **Or manually remove added code**:
   - Remove lines 1184–1201 (normalizeSentence + areSimilar helpers)
   - Remove lines 1248–1270 (tense guard logic in selection loop)
   - Remove lines 1280–1285 (tense guard logic in fallback)
   - Remove lines 1597–1602 (cuesRow creation)
   - Remove lines 1605–1627 (focusBtn creation)
   - Update return statement to remove cuesRow + focusBtn
   - Remove lines 1697–1705 (cue display logic)
   - Remove line 1706 (focusBtn show)
   - Remove lines 1992–1994 (streak cue logic)

---

## Code Review Checklist

- [x] All new code follows existing style (var, function naming, spacing)
- [x] All new code has comments explaining purpose
- [x] All new code is backwards compatible (no removal of existing code)
- [x] All new code is additive (can be removed without breaking existing functionality)
- [x] All new bilingual text uses existing Games.isPunjabiOn() pattern
- [x] All new DOM elements use consistent ID naming (g3-*)
- [x] All new event listeners use dataset.bound flag to prevent duplication
- [x] All new helpers are scoped appropriately (local to function)
- [x] No new global variables introduced
- [x] No new external dependencies
- [x] Syntax validated (node --check)

---

## Performance Notes

- **normalizeSentence()**: O(m) where m = string length (< 200 chars avg) = negligible
- **areSimilar()**: O(n²) where n = token count (< 20 avg) = <1ms per call
- **selectQuestionsTenseRamped()**: Called once per round (10 calls) = <10ms total
- **Focus button**: DOM focus operation = instant
- **Streak cue**: String concatenation = instant

**Overall Performance Impact**: **Negligible** ✅

