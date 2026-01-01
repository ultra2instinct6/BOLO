# BOLO App State Refactoring Summary

## Overview
Refactored the app from scattered global state variables to a unified AppState object.

## New AppState Structure
```javascript
AppState = {
  profile: {
    activeProfileId: "p1",
    profiles: [{ id, name, xp, level }]
  },
  settings: {
    punjabiOn: true
  },
  progress: {
    trackXP: { trackId: { xp, lessonsCompleted, questionsAttempted, questionsCorrect } },
    lessonDone: { lessonId: boolean },
    readingDone: { readingId: boolean },
    bestScores: { gameId: score }
  },
  session: {
    screenId: string,
    currentLessonId: lessonId,
    currentLessonStep: number,
    currentReadingId: readingId,
    currentGameId: gameId
  }
}
```

## Files Updated

### 1. state.js (COMPLETE REWRITE)
- Created unified AppState object
- Replaced `loadProfiles()`/`saveProfiles()` with `loadState()`/`saveState()`
- Changed localStorage key from "boloProfiles_v2" to "boloAppState_v1"
- Added `initializeState()` for one-time setup
- Added `setActiveProfile(profileId)` for profile switching
- Updated `getActiveProfile()` to find profile by ID
- XP now stored in `profile.xp` and tracked in `AppState.progress.trackXP[trackId]`
- Lesson completion now boolean: `AppState.progress.lessonDone[lessonId]`

### 2. ui.js (PARTIAL UPDATE)
- `showScreen(name)` now saves `AppState.session.screenId`
- `getLessonStatus(lessonId)` checks `AppState.progress.lessonDone[lessonId]`
- `buildProfilesList()` uses `AppState.profile.activeProfileId` for visual highlighting
- Profile switching via `setActiveProfile(profileId)` with immediate UI refresh

### 3. lessons.js (UPDATED)
- `startLesson()` now saves `AppState.session.currentLessonId` and `currentLessonStep`
- `renderLessonStep()` updates `AppState.session.currentLessonStep`
- `markLessonCompleted()` now marks `AppState.progress.lessonDone[lessonId] = true`
- Calls `saveState()` instead of `saveProfiles()`

### 4. reading.js (UPDATED)
- `openReadingDetail()` marks reading completion with `AppState.progress.readingDone[id] = true`
- Calls `saveState()` instead of `saveProfiles()`
- Uses `awardXP()` to track XP by track

### 5. games.js (UPDATED)
- `startGame()` saves `AppState.session.currentGameId`
- `handleGameAnswer()` updates `AppState.progress.bestScores[gameId]`
- Calls `saveState()` after scoring
- Best score tracking integrated with unified state

### 6. progress.js (UPDATED)
- `refreshProgress()` uses `getActiveProfile()` for profile data
- References `AppState.progress.trackXP[trackId]` instead of `profile.trackStats`
- References `AppState.progress.readingDone` for reading completion stats
- XP calculations use `profile.xp` instead of `profile.xpTotal`

### 7. app.js (UPDATED INITIALIZATION)
- Changed `loadProfiles()` to `loadState()` and `initializeState()`
- Rest of button handlers remain the same (they use the module functions)

## Storage Schema
- **Old Key:** "boloProfiles_v2" → Array of profile objects
- **New Key:** "boloAppState_v1" → Single AppState object with all state

## Key Improvements
1. **Single Source of Truth:** All state in one AppState object
2. **Logical Grouping:** Profile, settings, progress, and session state separated
3. **Profile Switching:** Easy profile management via `setActiveProfile()`
4. **Scalability:** Session state (currentLessonId, currentGameId) centralized
5. **Persistence:** All state saved to localStorage atomically

## Migration Notes
- Profiles no longer have `lessonStatus`, `readingStatus`, or `trackStats`
- Instead, all progress tracked in `AppState.progress` object
- Profile ID format changed to string-based ("p1", "p2", etc.)
- XP calculations now based on `profile.xp` with computed levels

## Testing Checklist
✅ All JS files have valid syntax
✅ State initialization works
✅ localStorage persistence functioning
✅ Profile switching operational
✅ Lesson completion tracking
✅ Reading completion tracking
✅ Game score tracking
✅ XP/Level calculations
