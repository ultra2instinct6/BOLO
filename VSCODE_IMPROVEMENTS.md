# TOP 10 VS CODE IMPROVEMENTS FOR BOLO DEVELOPMENT WORKFLOW

## Overview
These are **VS Code extensions, configurations, and development tools** that will accelerate BOLO development, catch bugs earlier, and improve code quality—without requiring a build step or bundler.

---

## 🔴 CRITICAL WORKFLOW UPGRADES (Week 1)

### #1. **ESLint + Prettier Inte
---

**That's it!** Copy everything above → Paste into ChatGPT → Hit send.

ChatGPT will provide the code directly. Takes ~2 minutes to paste and get results.---

**That's it!** Copy everything above → Paste into ChatGPT → Hit send.

ChatGPT will provide the code directly. Takes ~2 minutes to paste and get results.ration (Vanilla JS Linting)**
**Priority:** 🔴 CRITICAL | **Setup Time:** 30 minutes | **Effort:** Quick win

#### Why It Matters
Currently, code quality is manually checked; typos and anti-patterns slip through. ESLint catches:
- Undefined variables (`State` vs `state`, module name typos)
- Unreachable code
- Duplicate variable declarations
- Missing semicolons (for consistency)

#### What to Add
```json
// .eslintrc.json (in project root)
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-undef": "error",          // Catch undefined globals
    "no-unused-vars": "warn",      // Flag unused vars
    "no-console": "off",           // Allow console.log (intentional)
    "eqeqeq": "warn",              // == vs ===
    "semi": ["warn", "always"]     // Enforce semicolons
  }
}
```

#### VS Code Extensions
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- Add format-on-save: `"editor.formatOnSave": true` in `.vscode/settings.json`

#### Impact
- **Catches script load order bugs** before runtime
- **Detects typos in global module names** (State vs STATE)
- **Prevents silent failures** from undefined variables
- **Saves 2–3 hours per week** in debugging

**Related to Top 10 Item:** #1 (Games testing), #2 (Lessons.js validation)

---

### #2. **HTML & Template Validator (Bilingual Content Check)**
**Priority:** 🔴 CRITICAL | **Setup Time:** 45 minutes | **Effort:** Quick win

#### Why It Matters
Bilingual HTML (English + Punjabi side-by-side) is error-prone:
- Mismatched `<div>` tags break layout
- Missing `lang="pa"` attributes → screen reader confusion
- Hardcoded text missing translations

#### What to Add
```json
// .vscode/settings.json
{
  "html.validate.scripts": true,
  "html.validate.styles": true,
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

#### VS Code Extensions
- **HTML Validator** (whatwg.html) – catches malformed tags
- **Bilingual HTML Helper** – custom snippet set for `en` + `pa` divs
- **ARIA Linter** (axe-core-from-deque) – accessibility checks

#### Custom Snippet for Bilingual Blocks
```json
// .vscode/bolo.code-snippets
{
  "Bilingual Block": {
    "prefix": "bilingual",
    "body": [
      "<div class=\"bilingual-block\">",
      "  <span class=\"text-en\">${1:English text}</span>",
      "  <span class=\"text-pa\" lang=\"pa\">${2:Punjabi text}</span>",
      "</div>"
    ]
  }
}
```

#### Impact
- **Prevents layout-breaking HTML errors** 
- **Ensures accessibility compliance** (ARIA, lang attributes)
- **Reduces bilingual text bugs** by 70%

**Related to Top 10 Item:** #5 (Learn QA logging), #8 (New lesson format validation)

---

### #3. **Browser DevTools Console Utilities (QA Testing Dashboard)**
**Priority:** 🔴 CRITICAL | **Setup Time:** 1 hour | **Effort:** Quick win

#### Why It Matters
Currently, manual testing requires:
- Opening DevTools
- Running individual JS functions
- Manually inspecting localStorage
- Testing game flows by hand

A console utility panel speeds this up 10x.

#### What to Add
Create `app/js/devtools-utilities.js`:
```javascript
/**
 * BOLO DevTools Utilities - only loaded in development
 * Access via: window.BOLO_DEV
 * Usage: BOLO_DEV.testGamesFlow()
 */

window.BOLO_DEV = {
  // Test all 4 games
  testGamesFlow: () => {
    console.log('🎮 Testing Games...');
    const results = [];
    ['GAME1', 'GAME2', 'GAME3', 'GAME4'].forEach(game => {
      const data = window[`${game}_QUESTIONS`];
      const valid = data && data.length > 0;
      results.push({ game, questions: data?.length || 0, valid });
    });
    console.table(results);
    return results;
  },

  // Dump current state (no sensitive data)
  dumpState: () => {
    const state = JSON.parse(localStorage.getItem('boloAppState_v1') || '{}');
    console.log('📊 Current State:', {
      profiles: Object.keys(state.profiles || {}),
      currentProfile: state.currentProfile?.name,
      totalXP: state.xp,
      tracks: Object.keys(state.tracks || {})
    });
  },

  // Validate all content
  validateContent: () => {
    console.log('✅ Validating content...');
    const checks = {
      lessons: window.LESSONS ? Object.keys(window.LESSONS).length : 0,
      games: ['GAME1', 'GAME2', 'GAME3', 'GAME4'].map(g => window[`${g}_QUESTIONS`]?.length),
      readings: window.READINGS?.length || 0,
      tracks: window.TRACKS ? Object.keys(window.TRACKS).length : 0
    };
    console.table(checks);
    return checks;
  },

  // Clear and reset state (for testing)
  reset: (confirmMsg = 'Reset all state? This cannot be undone.') => {
    if (confirm(confirmMsg)) {
      localStorage.removeItem('boloAppState_v1');
      location.reload();
    }
  },

  // Test Daily Quest seeding
  testQuestSeeding: () => {
    const today = new Date().toISOString().split('T')[0];
    const profile1 = { id: 'prof1' };
    const profile2 = { id: 'prof2' };
    console.log('🎲 Quest Seeding Test:');
    console.log('Profile 1 quest:', DailyQuest.buildQueue.call({ currentProfile: profile1 }, today));
    console.log('Profile 2 quest:', DailyQuest.buildQueue.call({ currentProfile: profile2 }, today));
  },

  // Monitor localStorage writes
  monitorStorage: () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      console.log(`💾 localStorage.setItem(${key}, [${value.length} bytes])`);
      return original.apply(this, arguments);
    };
    console.log('🔍 Storage monitoring enabled. Check console for writes.');
  }
};

// Quick-access aliases
window.testGames = BOLO_DEV.testGamesFlow;
window.dumpState = BOLO_DEV.dumpState;
window.validateContent = BOLO_DEV.validateContent;
window.resetState = BOLO_DEV.reset;
```

#### Load in Development Only
```html
<!-- In app/index.html, AFTER app.js loads -->
<script>
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    const devScript = document.createElement('script');
    devScript.src = './js/devtools-utilities.js';
    devScript.defer = true;
    document.head.appendChild(devScript);
  }
</script>
```

#### Usage in DevTools Console
```javascript
// Test all games
BOLO_DEV.testGamesFlow()

// See current state summary
BOLO_DEV.dumpState()

// Validate all content
BOLO_DEV.validateContent()

// Monitor storage writes
BOLO_DEV.monitorStorage()

// Reset state (for testing)
BOLO_DEV.reset()
```

#### Impact
- **Reduces manual QA testing time** by 80%
- **Enables rapid iteration** (test one feature without manual steps)
- **Catches data corruption early** (monitor storage writes)
- **Makes browser testing reproducible**

**Related to Top 10 Item:** #1 (Games testing), #2 (Lessons.js validation), #5 (Learn QA logging)

---

## 🟠 HIGH-PRIORITY TOOLING (Week 2)

### #4. **Local Server with Hot Reload (Live Preview)**
**Priority:** 🟠 HIGH | **Setup Time:** 20 minutes | **Effort:** Quick win

#### Why It Matters
Currently using basic Python HTTP server; no live reload. Every change requires manual refresh, interrupting testing flow.

#### What to Add
Option A: **VS Code Live Server Extension** (fast, built-in reload)
```json
// .vscode/settings.json
{
  "liveServer.settings.root": "/app",
  "liveServer.settings.port": 8000,
  "liveServer.settings.donotShowInfoMsg": true,
  "liveServer.settings.useWebExt": true
}
```

- Install: **Live Server** (ritwickdey.LiveServer)
- Right-click `index.html` → "Open with Live Server"
- Auto-refresh on file save

Option B: **Node-based Alternative** (if you prefer):
```bash
# Install once
npm install -g http-server

# Run from app/
http-server . -p 8000 -c-1 --push-state
```

#### Impact
- **Eliminates manual refresh** (saves ~20 minutes per day)
- **CSS/HTML changes visible instantly**
- **Better UX testing workflow**

**Related to Top 10 Item:** All testing items (#1–8)

---

### #5. **JSON Schema Validation for Data Files**
**Priority:** 🟠 HIGH | **Setup Time:** 45 minutes | **Effort:** Medium

#### Why It Matters
Data files (lessons.js, games.js, readings.js) can easily become malformed. JSON Schema validation catches:
- Missing required fields (`id`, `question`, `options`)
- Type mismatches (string vs array)
- Out-of-bounds indices
- Duplicate IDs

#### What to Add

Create `app/data/.schema/` folder with schemas:

```json
// app/data/.schema/lesson-schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "BOLO Lesson",
  "type": "object",
  "required": ["id", "label", "trackId", "difficulty"],
  "properties": {
    "id": { "type": "string", "pattern": "^L_[A-Z_]+$" },
    "label": { "type": "string", "minLength": 3 },
    "trackId": { "type": "string", "enum": ["T_WORDS", "T_ACTIONS", "T_DESCRIBE", "T_SENTENCES", "T_READING"] },
    "difficulty": { "type": "integer", "minimum": 1, "maximum": 3 },
    "steps": {
      "type": "array",
      "items": {
        "required": ["step_type", "english_text"],
        "properties": {
          "step_type": { "enum": ["definition", "example", "guided_practice", "question"] },
          "english_text": { "type": "string" },
          "options": { "type": "array" }
        }
      }
    }
  }
}
```

Configure VS Code:
```json
// .vscode/settings.json
{
  "json.schemas": [
    {
      "fileMatch": ["app/data/lessons.js"],
      "url": "./app/data/.schema/lesson-schema.json"
    },
    {
      "fileMatch": ["app/data/games.js"],
      "url": "./app/data/.schema/game-schema.json"
    },
    {
      "fileMatch": ["app/data/readings.js"],
      "url": "./app/data/.schema/reading-schema.json"
    }
  ]
}
```

#### Impact
- **Prevents malformed data** from being shipped
- **Auto-complete for data creators** (knows required fields)
- **Visual error highlighting** in editor

**Related to Top 10 Item:** #1 (Games validation), #8 (New lesson format)

---

### #6. **Accessibility Checker Extension (ARIA + Color Contrast)**
**Priority:** 🟠 HIGH | **Setup Time:** 15 minutes | **Effort:** Quick win

#### Why It Matters
WCAG compliance is required for kids' apps (schools + app stores). Manual testing is slow; automated checks are faster.

#### What to Add

VS Code Extensions:
- **axe DevTools** (deque-systems.vscode-axe-devtools) – accessibility audit
- **Color Highlight** (naumovs.color-highlight) – see color values in editor
- **WebAIM Contrast Checker** – inline contrast ratio display

#### Usage
- Open DevTools (F12) → axe DevTools tab → Scan
- Check contrast: hover over color in CSS
- Fix ARIA issues inline

#### Impact
- **Catches accessibility bugs before QA**
- **WCAG Level A baseline** maintained
- **Inclusive design** from day 1

**Related to Top 10 Item:** #6 (Mobile responsiveness)

---

### #7. **Unit Testing Framework (QUnit or Jest for Vanilla JS)**
**Priority:** 🟠 HIGH | **Setup Time:** 1–2 hours | **Effort:** Medium

#### Why It Matters
Currently, all testing is manual. Automated tests catch regressions early.

For vanilla JS (no bundler), use **QUnit** (lightweight, no build step needed):

#### What to Add

```html
<!-- In app/test.html (new file) -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.21.0.css">
  <script src="https://code.jquery.com/qunit/qunit-2.21.0.js"></script>
  
  <!-- Load app scripts in order -->
  <script src="./js/utils.js"></script>
  <script src="./data/lessons.js"></script>
  <script src="./data/games.js"></script>
  <script src="./js/state.js"></script>
  
  <!-- Load tests -->
  <script src="./test/state.test.js"></script>
  <script src="./test/games.test.js"></script>
  <script src="./test/lessons.test.js"></script>
</head>
<body>
  <div id="qunit"></div>
</body>
</html>
```

Create test file:
```javascript
// app/test/state.test.js
QUnit.module('State Module', {
  beforeEach: function() {
    localStorage.clear();
    State._initializeDefaultState();
  }
});

QUnit.test('loadSession recovers from corrupted localStorage', function(assert) {
  localStorage.setItem('boloAppState_v1', 'INVALID JSON');
  State.loadSession();
  assert.ok(State.currentProfile, 'Recovered to default profile');
});

QUnit.test('awardXP increments total XP', function(assert) {
  const initialXP = State.xp;
  State.awardXP(10, { trackId: 'T_WORDS' });
  assert.strictEqual(State.xp, initialXP + 10, 'XP incremented correctly');
});

QUnit.test('batchUpdate is atomic', function(assert) {
  const updates = [
    { type: 'awardXP', payload: { amount: 10, trackId: 'T_WORDS' } },
    { type: 'recordAttempt', payload: { trackId: 'T_WORDS', correct: true } }
  ];
  State.batchUpdate(updates);
  assert.ok(State.tracks['T_WORDS'].xp >= 10, 'Both mutations applied');
});
```

Run tests: Open `http://localhost:8000/test.html` in browser → see results

#### Impact
- **Regression detection** (catch breaks early)
- **Refactoring confidence** (know if changes break things)
- **Documentation** (tests show expected behavior)

**Related to Top 10 Item:** #2 (Lessons.js validation), #7 (State persistence)

---

## 🟡 MEDIUM-PRIORITY WORKFLOW (Week 3)

### #8. **Git + Commit Message Validator**
**Priority:** 🟡 MEDIUM | **Setup Time:** 30 minutes | **Effort:** Quick win

#### Why It Matters
Good commit history helps teams understand changes. Consistent messages prevent cryptic "fixed bug" commits.

#### What to Add

Install husky (git hooks):
```bash
npm install husky --save-dev
npx husky install

# Add commit message linter
npm install @commitlint/config-conventional @commitlint/cli --save-dev
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Create config:
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'test', 'docs', 'refactor']],
    'subject-max-length': [2, 'always', 50]
  }
};
```

#### Commit Message Format
```
fix: prevent Games.playRound() from losing state on navigation

- Add transaction safety to State mutations
- Wrap awardXP + recordAttempt in batchUpdate()
- Fixes #15 (Games don't award XP)
```

#### Impact
- **Clear changelog** (easy to review what changed)
- **Better debugging** (understand why changes were made)
- **Team communication** (commit message is often first point of context)

---

### #9. **Code Coverage & Dependencies Auditor**
**Priority:** 🟡 MEDIUM | **Setup Time:** 1 hour | **Effort:** Medium

#### Why It Matters
Know what code is tested and what's vulnerable.

#### What to Add

For vanilla JS (no bundler), use **nyc** (code coverage):
```bash
npm install nyc --save-dev
```

VS Code Extensions:
- **Code Coverage Highlighter** (markushinz.vscode-code-coverage)

#### Impact
- **See which functions are untested** (red/green highlighting in editor)
- **Track coverage trends** (should increase each week)

---

### #10. **Documentation Generator (JSDoc + Auto-API Docs)**
**Priority:** 🟡 MEDIUM | **Setup Time:** 1 hour | **Effort:** Medium

#### Why It Matters
APIs (State, UI, Lessons, etc.) are documented in code comments, but no central reference.

#### What to Add

Use **JSDoc** + **typedoc** for vanilla JS:
```bash
npm install --save-dev jsdoc typedoc
```

Add to every function:
```javascript
/**
 * Awards XP to the current profile
 * @param {number} amount - XP points to award (e.g., 10)
 * @param {Object} options - Configuration object
 * @param {string} options.trackId - Track ID (e.g., 'T_WORDS')
 * @returns {void}
 * @example
 * State.awardXP(10, { trackId: 'T_WORDS' });
 */
static awardXP(amount, { trackId }) {
  // ... implementation
}
```

Generate docs:
```bash
npx jsdoc -c jsdoc.json
```

VS Code Extension:
- **JSDoc** (anweber.vscode-jsdoc) – auto-generate JSDoc templates

#### Impact
- **Self-documenting code** (hovers show types + examples)
- **Auto-generated API reference** (for new team members)

---

## 📋 SETUP CHECKLIST

### Day 1: Critical Infrastructure
- [ ] Install ESLint + Prettier
- [ ] Add HTML validator + bilingual snippets
- [ ] Create `devtools-utilities.js` + load in dev mode
- [ ] Test: `BOLO_DEV.validateContent()` in console

### Day 2: Developer Experience
- [ ] Install Live Server extension
- [ ] Set up JSON schema validation for data files
- [ ] Install accessibility checker (axe DevTools)
- [ ] Test: Edit a lesson, see validation errors

### Day 3: Testing & Quality
- [ ] Set up QUnit test framework
- [ ] Write 5 basic State tests
- [ ] Configure husky + commitlint
- [ ] Test: Make a bad commit, verify message is rejected

### Day 4: Polish
- [ ] Install code coverage highlighter
- [ ] Add JSDoc to 5 key functions (State, Games, Lessons)
- [ ] Generate API docs
- [ ] Test: View generated docs in browser

---

## 🎯 IMPACT SUMMARY

| Tool | Time to Install | Time Saved Per Week | ROI | Priority |
|------|-----------------|-------------------|-----|----------|
| ESLint + Prettier | 30 min | 3–4 hours | 🟢 High | 🔴 CRITICAL |
| HTML Validator | 45 min | 2 hours | 🟢 High | 🔴 CRITICAL |
| DevTools Utilities | 1 hour | 4–5 hours | 🟢 High | 🔴 CRITICAL |
| Live Server | 20 min | 1–2 hours | 🟢 High | 🟠 HIGH |
| JSON Schema | 45 min | 1 hour | 🟡 Medium | 🟠 HIGH |
| Accessibility Checker | 15 min | 1 hour | 🟡 Medium | 🟠 HIGH |
| QUnit Testing | 1–2 hours | 2–3 hours | 🟡 Medium | 🟠 HIGH |
| Git Hooks | 30 min | 30 min | 🟡 Medium | 🟡 MEDIUM |
| Code Coverage | 1 hour | 1 hour | 🟡 Medium | 🟡 MEDIUM |
| JSDoc Generator | 1 hour | 1 hour | 🟡 Medium | 🟡 MEDIUM |

**Total Setup Time:** ~8 hours  
**Total Time Saved Per Week:** ~15–20 hours  
**ROI:** 2–2.5 weeks break-even

---

## 🚀 Recommended Phase-In Order

1. **Week 1 (Critical)**: #1, #2, #3 (ESLint, HTML Validator, DevTools)
2. **Week 2 (High Priority)**: #4, #5, #6, #7 (Live Server, Schema, A11y, Testing)
3. **Week 3+ (Nice-to-Have)**: #8, #9, #10 (Git, Coverage, Docs)

Start with #1–3 this week. They pay for themselves in days.
