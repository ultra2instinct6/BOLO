# BOLO Learn Section – QA Mode Quick Start

## Enable QA Mode (2 steps)

1. **Open browser DevTools** (F12 or Cmd+Option+I on Mac)
2. **Paste into Console:**
   ```javascript
   localStorage.LEARN_QA = "1";
   location.reload();
   ```

## What You'll See in Console

After enabling QA mode, every interaction logs to the console with 🎓 emoji prefix:

### On Page Load
```
🎓 [Learn] Lessons per track:
  T_WORDS: 15 lessons
  T_ACTIONS: 12 lessons
  T_DESCRIBE: 8 lessons
  T_SENTENCE: 20 lessons
  T_READING: 8 lessons

🎓 [Learn] Filters applied:
  search: "(none)"
  status: "all"
  difficulty: [1, 2, 3]
  track: "all"
  resultCount: 63
```

### When You Change a Filter
```
🎓 [Learn] Search filter changed to: plural
🎓 [Learn] Status filter changed to: not-started
🎓 [Learn] Difficulty filter changed to: 1,2
🎓 [Learn] Track filter changed to: T_WORDS
```

### When You Click a Lesson Card
```
🎓 [Learn] Lesson launched: T01 from track T_WORDS
```

## Disable QA Mode

```javascript
delete localStorage.LEARN_QA;
location.reload();
```

---

## Quick Troubleshooting

| Problem | Console Check | Fix |
|---------|---|---|
| Lessons don't appear | "Lessons per track" should show >40 total | Refresh page, check LESSON_META loaded |
| Filters don't work | No filter log messages appear | Check selectors exist: #lesson-search, .filter-btn, etc. |
| Lesson won't open | No "Lesson launched" message | Lesson ID may not be in LESSON_META; check browser console |
| Bilingual text missing | Inspect element → should see .lesson-pa div | Check titlePa exists in LESSON_META |

---

## Test the 10 New Lessons (T01–T10)

### Quick Smoke Test (5 min)
1. Enable QA mode
2. Filter track dropdown → "Words & Names"
3. Verify console shows T_WORDS with 15+ lessons
4. Click "Make Plurals with -s" (T01)
5. Verify "Lesson launched: T01" in console
6. Step through 5+ steps
7. Return to Learn → filter state preserved

### Full Feature Test (15 min)
1. Test all 4 filters: search, status, difficulty, track
2. Each change should log "Filter changed to:" message
3. Card count should update each time
4. Click T04 "Whose? Use 's" → verify launch message
5. Click T10 "Polite Requests" → verify full lesson flow
6. Refresh page → filters should persist (check localStorage)

---

## Code Locations (For Developers)

**QA Helper:** [app/js/lessons.js](app/js/lessons.js) lines 1438–1495  
**Filter Logging:** [app/js/lessons.js](app/js/lessons.js) lines 569–627  
**Lesson Launch Logging:** [app/js/lessons.js](app/js/lessons.js) line 991

---

## Expected Results for All Tests

- ✅ 50+ lessons load (40 original + 10 new)
- ✅ Track filter dropdown works; cards update
- ✅ Search, status, difficulty filters work independently
- ✅ All new lessons (T01–T10) appear with correct track assignment
- ✅ Bilingual text (English + Punjabi) renders on all cards
- ✅ Lesson detail screen loads without errors
- ✅ Filter state persists after page refresh
- ✅ No console errors
- ✅ No 404s in Network tab
