# Phase 2: XP/Streak Browser Test Guide

Complete manual verification checklist for XP awards, daily quest completion, streak tracking, and Progress wiring.

**Setup:** Open `app/index.html` in browser, open DevTools (F12), go to Console tab.

---

## Test 1: Normal Game XP Awards

### 1.1 Play a normal game and verify +5 XP per correct answer

```javascript
// Go to Play screen and start Game 2
UI.goTo("screen-play")
Games.startGame(2)

// Check initial state
console.log("Initial totalXP:", State.state.progress.totalXP)
console.log("Initial score:", Games.currentGameScore)

// Answer one correct (click any button or simulate)
// After clicking a button, check:
console.log("After 1 correct - totalXP:", State.state.progress.totalXP)
console.log("After 1 correct - score:", Games.currentGameScore)
// Expected: totalXP increased by 5, score increased by 5

// Check track stats
var trackId = "T_WORDS" // or whatever track the question was from
console.log("Track stats:", State.state.progress.trackXP[trackId])
// Expected: { xp: 5, questionsAttempted: 1, questionsCorrect: 1, ... }
```

**Expected Results:**
- ✅ Each correct answer adds +5 to `State.state.progress.totalXP`
- ✅ Each correct answer adds +5 to game score
- ✅ Track `xp` increases by 5, `questionsCorrect` and `questionsAttempted` both increment by 1

### 1.2 Answer one wrong

```javascript
// Click a wrong answer button
// After feedback shows "Not quite":
console.log("After 1 wrong - totalXP:", State.state.progress.totalXP)
console.log("Track stats:", State.state.progress.trackXP[trackId])
// Expected: totalXP unchanged, questionsAttempted +1, questionsCorrect unchanged
```

**Expected Results:**
- ✅ Total XP does not increase
- ✅ `questionsAttempted` increments by 1
- ✅ `questionsCorrect` stays the same

---

## Test 2: Daily Quest XP & Score Display

### 2.1 Start Daily Quest and verify custom quiz score displays

```javascript
// Go to Daily Quest screen
UI.goTo("screen-daily-quest")
DailyQuest.render()

// Check counter shows 0/3
console.log("Quest counter should show: 0/3")

// Start first game
document.getElementById("btn-daily-quest-start").click()

// Wait for game to load, then check initial score
console.log("Custom quiz score:", Games.currentCustomQuiz ? Games.currentCustomQuiz.score : "N/A")
// Expected: 0

// Play UI score element should also show 0
console.log("Play score display:", document.getElementById("play-score").textContent)
// Expected: "0"
```

### 2.2 Answer questions in Daily Quest

```javascript
// Answer one correct
// After clicking correct answer:
console.log("Custom quiz score after 1 correct:", Games.currentCustomQuiz.score)
console.log("Play score display:", document.getElementById("play-score").textContent)
console.log("Total XP:", State.state.progress.totalXP)

// Expected: 
// - currentCustomQuiz.score = 5
// - play-score element shows "5"
// - totalXP increased by 5
```

**Expected Results:**
- ✅ Daily Quest score increases by 5 per correct answer
- ✅ Play UI score element shows the custom quiz score (not 0)
- ✅ Total XP increases by 5 per correct answer
- ✅ Track stats update correctly

### 2.3 Complete first game and return to Daily Quest

```javascript
// Answer 3 questions to complete the game
// You'll be returned to Daily Quest screen automatically

// Check counter
console.log("Quest counter should show: 1/3")
document.getElementById("daily-quest-counter").textContent
// Expected: "Daily Quest: 1/3 / ਰੋਜ਼ਾਨਾ ਖੇਡਾਂ: 1/3"

// Check first checkbox
console.log("First checkbox:", document.getElementById("quest-check-learn").textContent)
// Expected: "☑" (checked)
```

---

## Test 3: Daily Quest Completion (+25 XP) - Idempotent

### 3.1 Complete all 3 games

```javascript
// Record XP before completing all 3
var xpBefore = State.state.progress.totalXP
console.log("XP before completing quest:", xpBefore)

// Start and complete game 2
document.getElementById("btn-daily-quest-start").click()
// ... complete 3 questions ...

// Start and complete game 3
document.getElementById("btn-daily-quest-start").click()
// ... complete 3 questions ...

// You'll be returned to Daily Quest screen
// Check XP after
var xpAfter = State.state.progress.totalXP
console.log("XP after completing quest:", xpAfter)
console.log("XP gained:", xpAfter - xpBefore)

// Expected: XP gained = (questions answered correctly × 5) + 25
// The +25 is the daily quest completion bonus
```

### 3.2 Verify idempotency (no double-award on refresh)

```javascript
// Check quest completion state
var cont = State.getDailyQuestProfileContainer()
console.log("Quest container:", cont)
// Expected: lastQuestCompletionAwardedDateKey = today's date (YYYY-MM-DD)

// Record current XP
var xpBeforeRefresh = State.state.progress.totalXP

// Refresh the page
location.reload()

// After page reloads, in console:
console.log("XP after refresh:", State.state.progress.totalXP)
console.log("XP should be unchanged:", xpBeforeRefresh === State.state.progress.totalXP)
// Expected: true (no additional +25 awarded)
```

**Expected Results:**
- ✅ Completing all 3 games awards +25 XP once
- ✅ Refreshing the page does NOT re-award the +25
- ✅ `lastQuestCompletionAwardedDateKey` matches today's date
- ✅ Quest counter shows 3/3
- ✅ Button shows "Quest Complete!" and is disabled
- ✅ Streak badge displays with current streak count

---

## Test 4: Streak Tracking

### 4.1 Check today's completion

```javascript
// After completing today's quest
var cont = State.getDailyQuestProfileContainer()
console.log("Streak count:", cont.streakCount)
console.log("Last completed:", cont.lastCompletedDateKey)
console.log("Last award date:", cont.lastQuestCompletionAwardedDateKey)

// Expected:
// - streakCount: 1 (first day) or incremented from previous
// - lastCompletedDateKey: today's date
// - lastQuestCompletionAwardedDateKey: today's date
```

### 4.2 Simulate completing tomorrow (streak +1)

```javascript
// Get tomorrow's date
var tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
var tomorrowKey = State.toISODateLocal(tomorrow)
console.log("Tomorrow's date key:", tomorrowKey)

// Record XP before
var xpBefore = State.state.progress.totalXP

// Simulate completing tomorrow
var result = State.markDailyQuestCompleted(tomorrowKey)
console.log("Mark completed result:", result)
console.log("XP gained:", State.state.progress.totalXP - xpBefore)

// Check streak
var cont = State.getDailyQuestProfileContainer()
console.log("New streak count:", cont.streakCount)
console.log("Last completed:", cont.lastCompletedDateKey)

// Expected:
// - streak incremented by 1
// - XP gained = 25 (no milestone yet if streak < 5)
```

**Expected Results:**
- ✅ Streak increments when completing the next consecutive day
- ✅ `lastCompletedDateKey` updates to the new date
- ✅ Daily +25 XP is awarded for the new day

### 4.3 Test streak reset (skip a day)

```javascript
// Simulate skipping a day and completing day after tomorrow
var dayAfterTomorrow = new Date()
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3) // skip 1 day
var futureKey = State.toISODateLocal(dayAfterTomorrow)

var result = State.markDailyQuestCompleted(futureKey)
console.log("Result after skip:", result)

var cont = State.getDailyQuestProfileContainer()
console.log("Streak after skip:", cont.streakCount)
// Expected: streakCount = 1 (reset because we skipped a day)
```

**Expected Results:**
- ✅ Streak resets to 1 when a day is skipped

---

## Test 5: Milestone Awards

### 5.1 Simulate reaching milestone 5

```javascript
// Set streak to 4 manually, then complete another day
var cont = State.getDailyQuestProfileContainer()
cont.streakCount = 4
cont.lastCompletedDateKey = "2025-12-16" // yesterday
cont.lastStreakMilestoneGranted = 0 // reset milestone tracker
State.save()

console.log("Setup: streak=4, last completed yesterday")

// Record XP
var xpBefore = State.state.progress.totalXP

// Complete today (should increment to 5)
var result = State.markDailyQuestCompleted("2025-12-17")
console.log("Result:", result)
console.log("XP gained:", State.state.progress.totalXP - xpBefore)

// Check container
var cont = State.getDailyQuestProfileContainer()
console.log("New streak:", cont.streakCount)
console.log("Last milestone granted:", cont.lastStreakMilestoneGranted)

// Expected:
// - streakCount = 5
// - XP gained = 25 (daily) + 10 (milestone 5) = 35
// - lastStreakMilestoneGranted = 5
```

**Expected Results:**
- ✅ Reaching streak 5 awards +10 XP bonus
- ✅ Total XP gain = 25 (daily) + 10 (milestone) = 35
- ✅ `lastStreakMilestoneGranted` = 5
- ✅ Calling `markDailyQuestCompleted` again with same date does NOT re-award

### 5.2 Verify milestone is idempotent

```javascript
// Try to award again for the same day
var xpBefore = State.state.progress.totalXP
var result = State.markDailyQuestCompleted("2025-12-17")
console.log("Second call result:", result)
console.log("XP change:", State.state.progress.totalXP - xpBefore)
// Expected: XP change = 0, awardedDaily = false
```

### 5.3 Test milestone 10

```javascript
// Set streak to 9, complete to reach 10
var cont = State.getDailyQuestProfileContainer()
cont.streakCount = 9
cont.lastCompletedDateKey = "2025-12-16"
cont.lastStreakMilestoneGranted = 5 // already got 5
State.save()

var xpBefore = State.state.progress.totalXP
var result = State.markDailyQuestCompleted("2025-12-17")
console.log("Result:", result)
console.log("XP gained:", State.state.progress.totalXP - xpBefore)

// Expected:
// - streakCount = 10
// - XP gained = 25 (daily) + 20 (milestone 10) = 45
// - lastStreakMilestoneGranted = 10
```

**Expected Results:**
- ✅ Milestone 10 awards +20 XP
- ✅ Total gain = 45 XP

---

## Test 6: Progress Screen Rendering

### 6.1 Verify totals and level

```javascript
// Open Progress screen
UI.goTo("screen-progress")
Progress.refresh()

// Check displayed values
console.log("Level display:", document.getElementById("progress-level").textContent)
console.log("XP display:", document.getElementById("progress-xp").textContent)
console.log("XP to next:", document.getElementById("progress-xp-next").textContent)
console.log("Bar width:", document.getElementById("progress-xp-bar").style.width)

// Check profile
var profile = State.getActiveProfile()
console.log("Profile XP:", profile.xp)
console.log("Profile level:", profile.level)
console.log("State totalXP:", State.state.progress.totalXP)

// Expected:
// - Level = Math.floor(profile.xp / 100) + 1
// - XP display shows totalXP
// - XP to next = 100 - (profile.xp % 100)
// - Bar width = percentage of current level progress
```

**Expected Results:**
- ✅ Level displays correctly based on XP / 100
- ✅ Total XP matches accumulated XP
- ✅ "XP to next level" calculation is accurate
- ✅ Progress bar width reflects percentage to next level

### 6.2 Verify per-track stats

```javascript
// Check track list rendering
var tracksList = document.getElementById("progress-tracks-list")
console.log("Track items:", tracksList.children.length)

// Manually inspect first track
var firstTrack = tracksList.children[0]
console.log("First track HTML:", firstTrack.innerHTML)

// Should show format: "TrackName: X XP (Q: correct/attempted, YY%)"

// Verify stats match state
console.log("Track XP state:", State.state.progress.trackXP)
```

**Expected Results:**
- ✅ Each track shows: name, XP, questions correct/attempted, accuracy %
- ✅ Accuracy = (correct / attempted × 100) rounded
- ✅ Punjabi name displayed below English name

### 6.3 Verify streak summary

```javascript
// Check streak summary in reading summary area
var streakText = document.getElementById("progress-reading-summary").textContent
console.log("Streak summary:", streakText)

// Should show format:
// "Daily Quest Streak: N | Last: YYYY-MM-DD | Next at M (K to go) / ਰੋਜ਼ਾਨਾ ਲੜੀ: N | ..."

var cont = State.getDailyQuestProfileContainer()
console.log("Actual streak:", cont.streakCount)
console.log("Last completed:", cont.lastCompletedDateKey)

var nextMilestone = State.getNextStreakMilestone(cont.streakCount)
console.log("Next milestone:", nextMilestone)
console.log("Days to go:", nextMilestone ? nextMilestone - cont.streakCount : "none")
```

**Expected Results:**
- ✅ Streak summary shows current streak count
- ✅ Last completed date displays correctly
- ✅ Next milestone and days remaining are accurate
- ✅ Bilingual text (English / Punjabi)

---

## Test 7: Profile XP Sync

### 7.1 Verify profile XP mirrors total XP

```javascript
// Award some XP
State.awardXP(15, { trackId: "T_WORDS" })

var profile = State.getActiveProfile()
console.log("Profile XP:", profile.xp)
console.log("Total XP:", State.state.progress.totalXP)
console.log("Profile level:", profile.level)

// Expected:
// - profile.xp should equal totalXP
// - profile.level = Math.floor(profile.xp / 100) + 1
```

**Expected Results:**
- ✅ `profile.xp` stays in sync with `progress.totalXP`
- ✅ `profile.level` recalculates automatically
- ✅ State saves after XP award

---

## Summary Checklist

Run through all tests above and verify:

- ✅ Normal games award +5 XP per correct answer
- ✅ Custom quiz (Daily Quest) awards +5 XP per correct answer
- ✅ Custom quiz score displays correctly in Play UI
- ✅ Track stats (attempted, correct, XP, accuracy) update correctly
- ✅ Daily Quest completion awards +25 XP once per day (idempotent)
- ✅ Quest counter shows X/3 progress
- ✅ Streak increments on consecutive days
- ✅ Streak resets when days are skipped
- ✅ Milestone awards trigger at 5, 10, 25, 50, 100, 250, 365, 500, 750, 1000
- ✅ Milestone awards are idempotent (only once per milestone)
- ✅ Progress screen displays correct totals, level, XP bar, track stats, streak summary
- ✅ Profile XP and level stay in sync with progress totals

---

## Quick Reset (if needed)

```javascript
// Clear all progress and start fresh
localStorage.removeItem("boloAppState_v1")
location.reload()
```

---

**Status:** Ready for browser testing
**Next:** Polish quest progress bar and resilience improvements
