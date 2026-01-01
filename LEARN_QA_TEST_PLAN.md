# BOLO Learn Section – QA Test Plan & Debug Checklist

## A. Manual Test Checklist (15 Steps)

### Setup
- [ ] **1. Open BOLO in browser** → Navigate to `http://localhost:8000`
- [ ] **2. Click "Learn" button** in main menu → Verify navigation to Learn screen succeeds
- [ ] **3. Open browser DevTools** (F12) → Console tab active, check for errors/warnings

### UI Rendering & Styling
- [ ] **4. Verify Learn screen layout** 
  - **Expected:** Progress summary card (4 stats) at top, track section titles below, lesson cards in grid
  - **Look for:** Styled divs with colors, not bare HTML; no missing images/icons
  - **Failure signal:** Plain text layout, missing borders, grayed out elements

- [ ] **5. Check bilingual text in Progress Summary**
  - **Expected:** "Words (X/10)", "Phrases (X/10)", "Sentences (X/10)", "Reading (X/10)" in English (blue, 14px), with matching Punjabi below (orange, 12px)
  - **Failure signal:** Only English showing, Punjabi garbled, font sizes mismatched, colors wrong (#003f7f blue, #ff7a00 orange)

- [ ] **6. Verify lesson cards display bilingual titles**
  - **Expected:** English title (bold, 14px, #003f7f blue) above Punjabi title (12px, #ff7a00 orange) on each card
  - **Example card:** "Make Plurals with -s" / "ਬਹੁ ਮਾਨਵ ਅਲਾ"
  - **Failure signal:** Only one language showing, misaligned text, color/font inconsistency

### Track Filtering
- [ ] **7. Test "All Tracks" (default state)**
  - **Expected:** All 5 sections visible: "Words & Names", "Describing Things", "Doing Things", "Sentence Building", "Reading Stories"
  - **Count:** 40+ lesson cards total (original + 10 new from Pass 1-3)
  - **Failure signal:** Missing sections, fewer than 40 cards, wrong section order

- [ ] **8. Click track filter dropdown** → Select "Words & Names" only
  - **Expected:** Only T_WORDS section visible with ~15 lesson cards (original T_WORDS lessons + T01, T04, T06, T07 new)
  - **Failure signal:** Other tracks still showing, card count doesn't change, dropdown unresponsive

- [ ] **9. Select "Sentence Building"** from track dropdown
  - **Expected:** Only T_SENTENCE section visible with ~20 lesson cards
  - **Check:** Both T02 "Use Some/Any", T08 "Polite Commands", T10 "Polite Requests" appear in this section
  - **Failure signal:** New lessons missing, wrong section displayed, cards vanish

- [ ] **10. Test "All Tracks" again** → Verify all sections return
  - **Expected:** Full Learn screen restored, all 5 sections visible
  - **Failure signal:** Sections don't reappear, duplicate cards, filter persists incorrectly

### Status & Difficulty Filters
- [ ] **11. Apply difficulty filter** → Check "1 ⭐ Easy" checkbox only
  - **Expected:** Card count drops to ~15 (only difficulty 1 lessons visible); other difficulties hidden
  - **Check:** T01, T04, T06, T08 still visible (all difficulty 1 from Pass 1-3)
  - **Failure signal:** Checkboxes unresponsive, no change in card display, wrong lessons filtered

- [ ] **12. Apply status filter** → Click "Not Started" button
  - **Expected:** Only lessons never attempted show; "In Progress" and "Done" lessons disappear
  - **Failure signal:** Button doesn't highlight, all lessons still show, status tracking broken

### Lesson Launch Flow
- [ ] **13. Click on a new lesson card** → Click "Make Plurals with -s" (T01)
  - **Expected:** 
    - Screen transitions to lesson detail (smooth nav, no blank page)
    - Header shows lesson title bilingual + track tag
    - First step renders (definition or example)
    - English text left-aligned (blue accent), Punjabi below (orange accent)
  - **Failure signal:** No transition, blank lesson screen, step content missing/garbled, console error

- [ ] **14. Click through lesson steps** → T01 full lesson
  - **Expected:**
    - Each step type renders correctly: definition, example, question, summary
    - Bilingual content (EN + PA) present on every step
    - Multiple choice questions show 4 options bilingual
    - Answer options clickable, feedback appears (correct/incorrect)
  - **Failure signal:** Steps don't advance, content missing, buttons unresponsive, text cutoff

- [ ] **15. Return to Learn section** → Click back/home button
  - **Expected:** Learn screen reappears with previous filter state intact, card selection still visible
  - **Failure signal:** Lost filter state, crashed back to home, lesson state not saved

---

## B. Quick Debug Checklist – Failure Points & Detection

| Failure Scenario | Cause | How to Spot It | Console Check |
|---|---|---|---|
| **No Learn sections appear** | LESSON_META not loaded or renderLearnSections() crashes | Blank Learn screen, no card grid | Search console for `Cannot read property 'map' of undefined` or `LESSON_META is not defined` |
| **Cards show English only** | Punjabi text property missing (titlePa undefined) or CSS display:none | Cards half-sized, only "Make Plurals..." visible | DevTools Inspector: check card DIV for .lesson-pa element; if missing, data schema broken |
| **Track filter dropdown doesn't work** | Event listener not bound or selector wrong (#select-track-filter) | Click dropdown, nothing happens | Console: type `document.querySelector('#select-track-filter')` → should return HTMLSelectElement, not null |
| **"No lessons found" after filtering** | Filter logic excludes all results (typo in track ID, empty LESSON_META) | Cards disappear, message shows | Console: `localStorage.LEARN_QA = "1"` then refresh, check filter log output |
| **Lesson detail screen blank** | startLesson() fails to find lessonId in LESSON_META or LESSONS object | Click card, blank screen appears | Console: Search for `lessonId not found` or `Cannot read property 'steps' of undefined` |
| **Lesson steps don't show** | steps array missing from LESSONS object or step.type not recognized | Lesson screen appears but content blank | DevTools: type `LESSONS['L_NOUNS_COMMON_01'].steps` → should return array with 5+ items |
| **"Content coming soon" appears** | Lesson object corrupted or getFormattedLesson() fails to normalize | Yellow alert box on lesson screen | Likely cause: lesson data schema mismatch; check console for type errors |
| **Bilingual text alignment broken** | CSS for .lesson-name or .lesson-pa missing/overridden | English title large, Punjabi squeezed below wrong | DevTools Inspector: right-click card → Inspect → Check computed styles for width, margin, padding |
| **Filter state doesn't persist** | localStorage save/load fails (corrupt JSON or state.js error) | Refresh page, filters reset | Console: type `localStorage.getItem('learn_activeFilters')` → should return JSON string, not null |
| **New lessons (T01, T04, T10) don't appear** | Not added to LESSON_META array (only in LESSONS object) | Card count wrong, T01/T04/T10 missing | Console: `Object.keys(LESSON_META).length` should be 40+; search for T01 in output |

---

## C. QA Mode Activation & Log Parsing

### Enable QA Mode
```javascript
// In browser DevTools Console:
localStorage.LEARN_QA = "1";
location.reload();
```

### What QA Mode Logs

When enabled, you will see console messages like:

```
🎓 [Learn] Lessons per track:
  T_WORDS: 15 lessons
  T_ACTIONS: 12 lessons
  T_DESCRIBE: 8 lessons
  T_SENTENCE: 20 lessons
  T_READING: 8 lessons

🎓 [Learn] Filter applied: search=""
  Result: 63 lessons shown

🎓 [Learn] Card rendered: L_NOUNS_COMMON_01 (Nouns: Common Basics)

🎓 [Learn] Lesson launched: T01 (Make Plurals) from T_WORDS track
```

### Disable QA Mode
```javascript
delete localStorage.LEARN_QA;
location.reload();
```

---

## D. Bilingual Text Verification Guide

### English Text Specs
- **Font size:** 14–16px (cards), 18px (lesson steps)
- **Font weight:** 700 (bold) for titles
- **Color:** #003f7f (dark blue)
- **Line height:** 1.4
- **Example in card:** "Make Plurals with -s"

### Punjabi Text Specs
- **Font size:** 12px (cards), 20px (lesson steps) — **slightly larger than English**
- **Font weight:** 400 (regular)
- **Color:** #ff7a00 (orange)
- **Script:** Gurmukhi (ਪੰ ਜ ਾ ਬ ੀ)
- **Example in card:** "ਬਹੁ ਮਾਨਵ ਅਲਾ"

### Verification Method
1. Open DevTools (F12) → Elements tab
2. Right-click on lesson card → "Inspect"
3. Look for `.lesson-name` (English) and `.lesson-pa` (Punjabi) divs
4. Check computed styles:
   - `.lesson-name` should have `color: rgb(0, 63, 127)` and `font-size: 14px`
   - `.lesson-pa` should have `color: rgb(255, 122, 0)` and `font-size: 12px`
5. **If colors/sizes wrong:** Issue is in [main.css](../app/css/main.css) (not data schema)
6. **If one language missing entirely:** Issue is in LESSON_META (missing titlePa/labelPa field)

---

## E. New Lesson Coverage (Pass 1–3)

### Test These 10 New Lessons Specifically

| Lesson ID | Title | Track | Difficulty | Test Method |
|---|---|---|---|---|
| T01 | Make Plurals with -s | T_WORDS | 1 | Click card → step through 5+ steps → answer question |
| T02 | Use Some/Any | T_SENTENCE | 2 | Verify in "Sentence Building" section; click → verify 2+ examples |
| T03 | Doing It Now: -ing | T_ACTIONS | 2 | Check "Doing Things" section; launch → verify -ing examples |
| T04 | Whose? Use 's | T_WORDS | 1 | Track filter to "Words"; card should appear; bilingual text check |
| T05 | Compare with -er | T_DESCRIBE | 2 | "Describing Things" section; click → verify comparatives |
| T06 | In, On, Under, Next To | T_WORDS | 1 | "Words" section; step through prepositions |
| T07 | Ask Where with Is/Are | T_SENTENCE | 2 | "Sentences" section; question step should ask "Where is...?" |
| T08 | Polite Classroom Commands | T_SENTENCE | 1 | "Sentences" section; should appear before T02 (earlier ID) |
| T09 | Daily Routines with Time | T_ACTIONS | 2 | "Doing Things" section; time preposition examples |
| T10 | Polite Requests: Can/Could | T_SENTENCE | 2 | Last in T_SENTENCE; highest difficulty; "Could I..." politeness |

**Test sequence:** Filter to T_WORDS → verify T01, T04, T06 appear → click T04 → verify bilingual → go back → filter to T_SENTENCE → verify T02, T07, T08, T10 appear → click T10 → verify full lesson flow

---

## F. Asset & Dependency Checklist

- [ ] **CSS loaded:** DevTools → Network → search `main.css` → 200 status, not 404
- [ ] **JS modules loaded:** Search console for `Cannot find module` or `js/lessons.js failed` → should see nothing
- [ ] **Data loaded:** Console should show startup message `📚 Loaded [n] lessons` at page load
- [ ] **Fonts rendered:** Open DevTools → Computetd tab on any Punjabi text → Font should be system font or custom (not Arial fallback)
- [ ] **No mixed content warnings:** Console should have no "Mixed Content" messages (HTTP/HTTPS mismatch)

---

## G. Performance & State Checks

- [ ] **No memory leaks:** Open DevTools → Memory tab → heap snapshot before/after filter 5 times → check for growing retained memory
- [ ] **localStorage not corrupted:** Console: `Object.keys(localStorage).filter(k => k.includes('learn'))` → should show ~5 keys, all valid JSON
- [ ] **Lesson completion state tracking:** Complete a new lesson (T01) → close browser tab → reopen → return to Learn → verify "Done" status persists
- [ ] **XP tracking:** After completing T01, check if XP counter increased (visible in header or quest section)

---

## H. ChatGPT-Friendly Prompt (See end of document)

[See Section I below]

---

## I. Standalone ChatGPT Prompt

**Copy-paste the following into ChatGPT for peer review/automation:**

---

### BOLO Learn Section – QA Test Plan for ChatGPT

**Context:**
I'm building a bilingual reading app (English + Punjabi) with a "Learn" section featuring:
- 50+ lessons (40 original + 10 new from recent implementation Pass 1-3)
- Multi-track filtering (Words, Actions, Describe, Sentence, Reading)
- Lesson detail screens with bilingual content
- Progress tracking & XP rewards

**Recent changes:**
- Added 10 new bilingual lessons (T01-T10) to app/data/lessons.js
- Updated rendering to support track filters + status filters + difficulty levels
- All lessons follow {titleEn, titlePa, steps[], primaryTrackId, difficulty} schema

**Test goals:**
1. Verify Learn screen renders styled UI (not bare HTML)
2. Confirm track filters actually filter lesson cards correctly
3. Ensure lesson cards show English + Punjabi bilingual text
4. Verify lesson launch opens detail screen with full step progression
5. Check no console errors; all assets (CSS/JS/data) load correctly

**Manual test checklist (15 steps):**
1. Open BOLO at http://localhost:8000
2. Click Learn button → verify navigation
3. Open browser DevTools (F12) → check console
4. Verify Learn screen has progress summary + lesson grid
5. Check bilingual text on progress summary (English blue 14px, Punjabi orange 12px)
6. Verify lesson cards show both English title + Punjabi title
7. Test "All Tracks" filter → all 5 sections visible, 50+ cards
8. Click track dropdown → select "Words & Names" → verify only ~15 cards show
9. Select "Sentence Building" → verify T02, T08, T10 appear
10. Switch back to "All Tracks" → all sections return
11. Check "1 ⭐ Easy" difficulty checkbox → card count drops to ~15
12. Click "Not Started" status button → only untouched lessons show
13. Click "Make Plurals with -s" (T01) lesson card → lesson detail opens
14. Step through 5+ steps → verify bilingual content on each, questions work
15. Return to Learn section → filter state preserved

**Failure point reference (10 common issues):**
- LESSON_META not loaded → blank Learn screen, check console for undefined error
- Punjabi text missing → cards half-sized, inspect .lesson-pa DIV
- Track filter broken → dropdown unresponsive, check selector #select-track-filter exists
- Lesson not launching → blank detail screen, search console for "lessonId not found"
- Steps missing → content blank, verify steps[] array exists in LESSONS object
- Bilingual alignment broken → titles misaligned, inspect CSS .lesson-name and .lesson-pa
- localStorage corrupt → filters reset on refresh, check localStorage in console
- New lessons not appearing → use QA mode (localStorage.LEARN_QA="1") to count per track
- Assets 404 → check Network tab for main.css, lessons.js, lessons.json (should all be 200)

**QA Mode (optional debug helper):**
Enable in console: `localStorage.LEARN_QA = "1"; location.reload()`
Logs:
- Lesson count per track
- Filter state changes
- Lesson card renders
- Lesson launch events

**New lessons to specifically test (T01-T10):**
- T01: Make Plurals (T_WORDS, diff 1) – shortest, good smoke test
- T04: Whose? Use 's (T_WORDS, diff 1) – possessive focus
- T10: Polite Requests (T_SENTENCE, diff 2) – longest, full feature test

**Expected results for good run:**
- ✅ Learn screen styled (blue/orange text, grid layout)
- ✅ Track filter dropdown works; cards change count when filtered
- ✅ All 50+ cards render with English + Punjabi
- ✅ Click T01 → lesson loads → 5+ steps appear → questions answerable → return to Learn
- ✅ Progress summary updates (Reads: X/10 et al.)
- ✅ No console errors or 404s
- ✅ Filter state persists on refresh
- ✅ Bilingual text sizes/colors correct (EN 14px blue, PA 12px orange on cards)

**Report format:**
- Pass/Fail per manual test step
- Any console errors (full stack)
- Asset 404s (if any)
- Bilingual text rendering issues
- Filter logic bugs
- Lesson launch failures
- Recommendations for fixes

---

**End of ChatGPT Prompt**
