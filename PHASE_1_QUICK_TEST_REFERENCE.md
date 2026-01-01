# Phase 1: Quick Test Reference Card

## Copy-Paste Commands for Browser Console

### 1. Initial Sanity Check
```javascript
window.BOLO_TEST_GAMES.sanityCheck()
```
**Expected:** 8+ ✅ checks (modules, data, DOM elements all present)

---

### 2. Test Game 1: Tap the Word
```javascript
window.BOLO_TEST_GAMES.start(1)
```
**Then click an answer button, then:**
```javascript
window.BOLO_TEST_GAMES.dumpState()
```

---

### 3. Test Game 2: Part of Speech
```javascript
window.BOLO_TEST_GAMES.testGameFlow(2, 3)
```
**Auto-runs 3 questions** (you'll see console log for each answer)

---

### 4. Test Game 3: Tense Detective
```javascript
window.BOLO_TEST_GAMES.testGameFlow(3, 3)
```

---

### 5. Test Game 4: Sentence Check
```javascript
window.BOLO_TEST_GAMES.testGameFlow(4, 3)
```

---

### 6. Validate Button Listeners
```javascript
window.BOLO_TEST_GAMES.validateEventListeners()
```
**Expected:** "Found 4 answer buttons" (or 9 for Game 2, 3 for Game 3)

---

### 7. Check State Persistence
```javascript
window.BOLO_TEST_GAMES.validateStatePersistence()
```
**Then play a game and watch for State.save() calls in console**

---

## What Should Happen

### When You Start a Game
- ✅ Question text appears
- ✅ Answer buttons render (4, 9, 3, or 2 depending on game)
- ✅ "Score: 0" displays
- ✅ "Streak: 0" displays

### When You Click an Answer
- ✅ Feedback appears: "Correct! / ਠੀਕ ਹੈ! +5 XP" or "Not quite..."
- ✅ Feedback color: green for correct, red for wrong
- ✅ Score updates (if correct)
- ✅ Next question renders after ~700ms

### When Game Ends (All Questions Done)
- ✅ Best score updates if you beat previous best
- ✅ State saved to localStorage

---

## If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| "DOM element not found" warning | Check app/index.html has required elements |
| Buttons don't appear | Run `window.BOLO_TEST_GAMES.validateEventListeners()` |
| Score doesn't update | Run `window.BOLO_TEST_GAMES.validateStatePersistence()` |
| Game won't start | Run `window.BOLO_TEST_GAMES.sanityCheck()` |
| Crashes/errors | Check browser console (F12) for red error messages |

---

## Full Testing Checklist

```
PHASE 1 TESTING CHECKLIST
========================

Game 1: Tap the Word
  [ ] Start game (window.BOLO_TEST_GAMES.start(1))
  [ ] Question renders with 4 word buttons
  [ ] Click a button → feedback appears
  [ ] Score updates (if correct)
  [ ] Next question appears
  
Game 2: Part of Speech
  [ ] Auto-flow test (window.BOLO_TEST_GAMES.testGameFlow(2, 3))
  [ ] 9 grammar buttons appear
  [ ] Correct/wrong feedback works
  
Game 3: Tense Detective
  [ ] Auto-flow test (window.BOLO_TEST_GAMES.testGameFlow(3, 3))
  [ ] 3 tense buttons appear
  [ ] Flow completes without errors
  
Game 4: Sentence Check
  [ ] Auto-flow test (window.BOLO_TEST_GAMES.testGameFlow(4, 3))
  [ ] 2 sentence buttons appear
  [ ] Score tracking works

State Persistence
  [ ] Best score saved (close/reopen, score persists)
  [ ] State.save() called after each answer
  [ ] localStorage shows "boloAppState_v1"

Event Listeners
  [ ] All answer buttons have click events
  [ ] No console errors when clicking
  [ ] Rapid clicks handled correctly (no duplicates)
```

---

## One-Command Full Test

Run all 4 games with 3 questions each:
```javascript
// Run one at a time, wait for previous to complete
window.BOLO_TEST_GAMES.testGameFlow(1, 3)
// [Wait 4 seconds]
window.BOLO_TEST_GAMES.testGameFlow(2, 3)
// [Wait 4 seconds]
window.BOLO_TEST_GAMES.testGameFlow(3, 3)
// [Wait 4 seconds]
window.BOLO_TEST_GAMES.testGameFlow(4, 3)
```

Or run sanity + all games:
```javascript
window.BOLO_TEST_GAMES.sanityCheck();
window.BOLO_TEST_GAMES.start(1);
window.BOLO_TEST_GAMES.printChecklist();
```

---

## Browser Console Keyboard Shortcuts

| Browser | Shortcut |
|---------|----------|
| Chrome | F12 or Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac) |
| Firefox | F12 or Ctrl+Shift+K (Windows) / Cmd+Option+K (Mac) |
| Safari | Cmd+Option+I (requires enabling in Preferences) |
| Edge | F12 or Ctrl+Shift+I |

---

## Success = All These Logs

When everything works, you'll see:
```
[BOLO_TEST] Testing utilities ready
[BOLO_TEST] Sanity Check
✅ Games module exists: true
✅ State module exists: true
[BOLO_TEST] Starting Game 1
[BOLO_TEST] Game State Dump
Current Game Type: 1
Question Index: 0
Score: 0
```

---

**Status:** Phase 1 ✅ COMPLETE — Ready for browser testing
**Next:** Phase 2 (Daily Quest Integration)
