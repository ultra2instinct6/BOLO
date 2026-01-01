# ChatGPT Prompt: BOLO Games Module – Next Implementation Steps

Copy and paste this prompt into ChatGPT to get help with the next phases of implementation.

---

## PROMPT START

**Context:**
I'm working on a bilingual reading app (BOLO) for children. I just unblocked the Games module by removing 1 blocking line of code. All 4 games (Game 1: Tap the Word, Game 2: Part of Speech, Game 3: Tense Detective, Game 4: Sentence Check) are now fully functional with complete logic and data.

**Current Status:**
- ✅ Games 1-4 logic is complete and ready
- ✅ All 28 questions loaded (6 for Game 1, 12 for Game 2, 6 for Game 3, 4 for Game 4)
- ✅ UI/HTML/CSS all ready
- ✅ State management (best scores, XP tracking) ready
- ✅ Syntax validated
- ⏳ **Next:** Manual browser testing to verify games work correctly

**What I Need Help With:**

### Phase 1: Browser Testing & Validation (If Needed)
I've prepared comprehensive browser test checklists. If games don't work after manual testing, I may need help debugging:
1. Question not rendering → DOM selector issues, data loading issues
2. Buttons not responding → Event listener problems
3. Score not updating → State.save() not called
4. Games not advancing → Next question logic broken

**If this happens, please help with:**
- Identifying console errors in browser DevTools
- Tracing the issue to specific code location
- Providing fix with minimal code changes

### Phase 2: Daily Quest Integration (Next Big Feature)
After games are verified working, I need to integrate them with the Daily Quest system.

**Daily Quest Requirements:**
- Assign 3 random games to the user each day (one from Game 2, Game 3, Game 4; Game 1 excluded)
- Queue them in a specific order
- Track completion of each
- Award XP for each correct answer
- Implement streak tracking (consecutive days of quest completion)
- Show "Quest Complete" when all 3 games done
- Display quest progress bar

**Questions for you:**
1. What's the cleanest way to randomly select 3 games daily without repetition?
2. Should each game in the quest have a separate high score, or shared score?
3. How should we display which quest game is "current" vs "pending"?
4. Should completing a quest unlock cosmetics, badges, or just XP?

### Phase 3: Progress Dashboard Wiring (If Games Work)
Once games are verified, fix the Progress Dashboard to show:
- Total XP earned (sum of all games + lessons + readings)
- Current level (based on XP thresholds)
- Track-specific progress (XP per track, lessons completed per track)
- Reading progress (X of 26 passages completed)
- Games stats (best scores, games played, win rate)

**Technical question:** Should XP be awarded in games.js when answer is correct, or should games just track score and XP awarded elsewhere?

### Phase 4: Bilingual Game Support (Enhancement)
Currently games are English-only. Should I add Punjabi translations?

**Questions:**
1. Should game prompts be bilingual (e.g., "What tense?" in English + Punjabi)?
2. Should answer options be bilingual where applicable?
3. Can you suggest strategy for adding ਪੰਜਾਬੀ without major refactoring?

### Phase 5: Difficulty & Question Shuffling (Polish)
Games data has difficulty labels but questions aren't filtered by difficulty.

**Improvements:**
1. Filter questions by difficulty level (Easy = Game 1 only, Medium = Games 1-3, Hard = all games)
2. Shuffle question order each game (prevent always showing same 6 questions)
3. Limit questions per session (e.g., play 6 random questions instead of all)

---

## IMPORTANT CONTEXT (Reference)

### Games Module Status
- File: `app/js/games.js`
- Key functions: `startGame(gameNum)`, `renderGameQuestion()`, `handleAnswer(isCorrect, trackId)`
- All functions already written and complete (260+ lines of logic)
- Only blocker was 1 `return;` statement (now removed)

### Game Data
- File: `app/data/games.js`
- 28 questions total across 4 games
- All normalized via: `normalizeGame1Questions()`, `normalizeGame2Questions()`, `normalizeGame3Questions()`, `normalizeGame4Questions()`
- Available objects: `GAME1_QUESTIONS`, `GAME2_QUESTIONS`, `GAME3_QUESTIONS`, `GAME4_QUESTIONS`, `PARTS_OF_SPEECH_LABELS`, `TENSE_LABELS`

### Screen Layout
- File: `app/index.html` (lines 418-495)
- DOM elements: `#play-game-label`, `#play-difficulty-tag`, `#play-track-label`, `#play-question-text`, `#play-options`, `#play-feedback`, `#play-score`, `#play-streak`, `#play-best`

### State Management
- File: `app/js/state.js`
- State.state.progress.bestScores[gameId] = score (persisted)
- State.state.progress.trackXP[trackId] = xp (persisted)
- State.save() called after each answer

### Bilingual Support
- All UI text supports {en, pa} pairs (Punjabi in Gurmukhi script)
- Current games: English questions only (future: add Punjabi translations)

---

## EXPECTED HELP (From You)

Please help me with:
1. **Debugging strategy** – If browser testing finds issues, guide me through systematic troubleshooting
2. **Architecture decisions** – Best patterns for Daily Quest integration, XP flow, streak tracking
3. **Code snippets** – If fixes needed, provide exact code with line locations
4. **Feature prioritization** – Which features matter most for MVP? (Daily Quest > Bilingual > Difficulty filtering > Polish)

---

## NEXT STEPS I'M TAKING

1. **Today:** Manual browser test of all 4 games
2. **If working:** Integrate Daily Quest system
3. **If failing:** Debug with your help
4. **Then:** Fix Progress Dashboard, add XP wiring
5. **Finally:** Bilingual enhancements + Polish

---

## KEY FILES FOR REFERENCE
```
app/js/games.js                 ← Main games module (260+ lines, complete)
app/data/games.js               ← Game questions & data (195 lines, complete)
app/index.html                  ← screen-play HTML (78 lines, complete)
app/css/main.css                ← Game styling (all ready)
app/js/state.js                 ← State management (all ready)
app/js/dailyQuest.js            ← Quest system (partial, needs games integration)
```

---

## HELP REQUEST

**I'm ready to tackle:** [Choose one]
- [ ] **Phase 1:** Browser testing & debugging (if games don't work)
- [ ] **Phase 2:** Daily Quest integration (next big feature)
- [ ] **Phase 3:** Progress Dashboard wiring (data layer)
- [ ] **Phase 4:** Bilingual game translations (enhancement)
- [ ] **Phase 5:** Difficulty & shuffling (polish)
- [ ] **All of the above** – Comprehensive roadmap with priorities

Please provide guidance on which phase is most impactful to tackle first, and any blockers I should know about.

---

## PROMPT END

Use this prompt to get targeted help for the next steps of BOLO games implementation.
