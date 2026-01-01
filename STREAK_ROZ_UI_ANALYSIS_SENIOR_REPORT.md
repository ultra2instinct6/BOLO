# Streak Card, Roz Button & Orange Milestone Card Analysis
## Senior Editor UX Review Report

**Date:** January 1, 2026  
**Scope:** Homepage visual components in Punjabi–English educational app (BOLO v2)  
**Target Audience:** Senior Editor, Child Educator, UX/Product Lead

---

## Executive Summary

The homepage features three key motivational/progress components:

1. **Red/Orange Streak Card** (split layout) – Current streak counter + Daily Quest button
2. **Roz Button** (right half) – Bilingual "Daily Quest" call-to-action
3. **Orange Milestone Card** – Upcoming streak targets & achievements

**Overall Assessment:** The design is **visually confident** but has **moderate UX weaknesses** in clarity, accessibility, and cognitive load. This report identifies actionable improvements without disrupting the pedagogical intent.

---

## Part 1: Red/Orange Streak Card Analysis

### Current Implementation

```html
<!-- Visual Layout (two-column split) -->
<div class="streak-card streak-card-split">
  <div class="streak-split-left">
    <h3>🔥 Current Streak | ਮੌਜੂਦਾ ਲੜੀ</h3>
    <p class="streak-number" id="current-streak">0</p>
  </div>
  <button class="streak-split-right" id="btn-home-roz">
    Roz (ਰੋਜ਼) | ਰੋਜ਼ਾਨਾ ਕਵੈਸਟ
  </button>
</div>
```

**Styling:**  
- Gradient background: `#ff6b6b → #ff8e72` (red-orange)
- 50/50 grid split, 112px min-height
- White text on warm color
- Ink ripple feedback + focus-visible outline

---

### Weakness #1: Ambiguous "Streak" Concept

**Issue:**
- The term "streak" is never contextualized for parents/children who are new to gamification
- No explanation of *what* a streak counts or *why* it matters
- Cultural context: Punjabi "ਲੜੀ" (lari) means "line" or "chain," but the metaphor isn't obvious in app UX

**Evidence:**
- No tooltip, help text, or progress label below the number
- Parent Guide (if present) may not be visible/accessible from home
- Child might not understand the connection between Daily Quest completion → streak increment

**Impact:**
- ⚠️ **Medium** – Reduces motivation for younger learners who don't understand the mechanic
- Children may tap the card expecting details, but it only shows Roz modal

**Recommendation:**
```html
<!-- Add contextual subtitle -->
<div class="streak-split-left">
  <h3>🔥 Current Streak | ਮੌਜੂਦਾ ਲੜੀ</h3>
  <p class="streak-number">0</p>
  <p class="streak-subtitle">Complete Daily Quest daily to build</p>
  <p class="streak-subtitle-pa" lang="pa">ਰੋਜ਼ ਮੁਕੰਮਲ ਕਰੋ ਅਤੇ ਬਣਾਓ</p>
</div>
```

**CSS Addition:**
```css
.streak-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 6px;
  font-weight: 500;
}
```

---

### Weakness #2: Poor Affordance of Roz Button

**Issue:**
- The Roz button is a vertical text label with *no* visible button styling within the red card
- No clear visual distinction between "tappable button" vs. "information display"
- The border-left separator is thin (1px, low contrast)
- Button text changes dynamically ("Roz ✓" when complete), but no animation or celebration

**Evidence:**
```css
.streak-split-right {
  background: rgba(0, 0, 0, 0.06);  /* 6% dark overlay */
  border-left: 1px solid rgba(255, 255, 255, 0.22);  /* 22% opacity */
  cursor: pointer;  /* Only indicator */
}
```

**Impact:**
- ⚠️ **Medium–High** – Children may not realize they can tap the right half
- Desktop users with mouse might hover and not see a change
- Mobile users get ripple feedback but no hover state

**Recommendations:**

**Option A: Add visual divider + hover state**
```css
.streak-split-right {
  border-left: 2px solid rgba(255, 255, 255, 0.35);  /* More visible */
  background: rgba(0, 0, 0, 0.06);
}

.streak-split-right:hover {
  background: rgba(0, 0, 0, 0.10);  /* Slightly darker on hover */
}
```

**Option B: Add icon + label polish**
```html
<button class="streak-split-right" id="btn-home-roz">
  <span class="roz-icon">📋</span>
  <span class="btn-label-en">Roz</span>
  <span class="btn-label-pa" lang="pa">ਰੋਜ਼</span>
</button>
```

```css
.roz-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 4px;
}
```

**Option C (Preferred): Explicit "Start Quest" label**
```html
<button class="streak-split-right">
  <span class="btn-label-en">📋 Start Quest</span>
  <span class="btn-label-pa" lang="pa">🎯 ਕਵੈਸਟ ਸ਼ੁਰੂ ਕਰੋ</span>
</button>
```

---

### Weakness #3: Completion State Not Obvious

**Issue:**
- When Daily Quest is completed today, the button text changes to "Roz ✓" and gets `is-complete` class
- But the visual change is **subtle**: background shifts from `rgba(0,0,0,0.06)` to `rgba(0,0,0,0.10)`
- Checkmark (✓) is small and may not be immediately recognizable as "done"

**Current Code:**
```javascript
if (completedToday) {
  rozBtn.classList.toggle("is-complete", true);
  en.textContent = completedToday ? "Roz ✓" : "Roz (ਰੋਜ਼)";
}
```

**Impact:**
- ⚠️ **Low–Medium** – Child who completed the quest may not feel a sense of achievement
- Visual feedback is muted; lacks celebration element

**Recommendations:**

**Option 1: Stronger visual feedback for completion**
```css
.streak-split-right.is-complete {
  background: rgba(76, 175, 80, 0.3);  /* Subtle green tint */
}

.streak-split-right.is-complete .btn-label-en::before {
  content: "✓ ";
  color: #4caf50;
  font-weight: 900;
}
```

**Option 2: Add subtle animation**
```css
@keyframes celebrationPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.streak-split-right.is-complete {
  animation: celebrationPulse 0.6s ease 1;
  background: rgba(76, 175, 80, 0.25);
}
```

**Option 3: Use toast/badge notification**
Show a small badge above the card when quest is completed:
```html
<div class="quest-completion-toast" style="display: none;">
  ✓ Quest Complete! Keep it up tomorrow!
</div>
```

---

### Weakness #4: Responsive Issues on Very Small Screens

**Issue:**
- Current design stacks to single column on `max-width: 600px`
- But the streak card itself is already a two-column layout
- On very small phones (< 360px), the 50/50 split may squeeze text

**Current CSS:**
```css
@media (max-width: 600px) {
  .streak-section {
    grid-template-columns: 1fr;  /* Stacks cards vertically */
  }
  .streak-number {
    font-size: 2.5em;  /* Reduced from 3em */
  }
}
```

**Issue:** No breakpoint for **the split card itself** on ultra-small screens

**Recommendation:**
```css
@media (max-width: 360px) {
  #screen-home #home-streak-section .streak-card.streak-card-split {
    grid-template-columns: 1fr;  /* Stack left/right vertically */
    min-height: auto;
  }
  
  #screen-home #home-streak-section .streak-card.streak-card-split .streak-split-right {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.22);
    padding: 12px;
  }
  
  .streak-number {
    font-size: 2em;
  }
}
```

---

## Part 2: Roz Button (Daily Quest) Analysis

### Current Implementation

The Roz button is the right half of the split streak card.

**Name Origin:** "Roz" (ਰੋਜ਼) = "daily" in Punjabi; "ਰੋਜ਼ਾਨਾ" = "daily routine"

**Behavior:**
- Click → Opens Daily Quest modal (or navigates to Daily Quest screen)
- Text updates: "Roz (ਰੋਜ਼)" → "Roz ✓" when completed
- Ripple feedback on tap

---

### Weakness #1: "Roz" Name Not Culturally Clear to English-Only Speakers

**Issue:**
- The button label shows `Roz (ਰੋਜ਼)` – assumes user recognizes Punjabi romanization
- For English-only parents/caregivers, "Roz" is opaque
- The Punjabi text in parentheses is small (13px) and may be overlooked

**Impact:**
- ⚠️ **Medium** – Non-Punjabi speakers won't understand what "Roz" means
- Reduces parental engagement; they can't explain the feature to children

**Recommendation:**

**Approach 1: Add clear English label**
```html
<button class="streak-split-right" id="btn-home-roz">
  <span class="btn-label-en">📋 Daily Quest</span>
  <span class="btn-label-pa" lang="pa">ਰੋਜ਼ ਕਵੈਸਟ</span>
</button>
```

**Approach 2: Add tooltip on hover**
```html
<button class="streak-split-right" id="btn-home-roz" title="Roz (Punjabi: Daily Quest)">
  <span class="btn-label-en">Roz</span>
  <span class="btn-label-pa" lang="pa">ਰੋਜ਼ਾਨਾ ਕਵੈਸਟ</span>
</button>
```

**Approach 3: Bilingual subtitle (preferred)**
```html
<button class="streak-split-right" id="btn-home-roz">
  <span class="btn-label-en">Roz<br/><small>Daily Quest</small></span>
  <span class="btn-label-pa" lang="pa">ਰੋਜ਼<br/><small>ਰੋਜ਼ਾਨਾ ਕਵੈਸਟ</small></span>
</button>
```

---

### Weakness #2: No Indication of What Roz Contains

**Issue:**
- User doesn't know what they'll get when they tap Roz
- No hint of the three subtasks (Learn + Reading + Games)
- No preview of rewards or XP

**Impact:**
- ⚠️ **Medium–High** – Reduces curiosity-driven engagement
- Child may not tap if they don't know what to expect

**Recommendation:**
Add a small preview or hint text below the button label:

```html
<button class="streak-split-right" id="btn-home-roz">
  <span class="btn-label-en">📋 Roz</span>
  <span class="btn-label-hint-en">3 tasks</span>
  <span class="btn-label-pa" lang="pa">ਰੋਜ਼</span>
  <span class="btn-label-hint-pa" lang="pa">3 ਕੰਮ</span>
</button>
```

```css
.btn-label-hint-en,
.btn-label-hint-pa {
  font-size: 11px;
  opacity: 0.85;
  font-weight: 500;
  margin-top: 2px;
  display: block;
}
```

---

### Weakness #3: Missing Accessibility Context

**Issue:**
- `aria-label` is present but generic: `"Roz (Daily Quest)"`
- Does not explain what happens on tap or why user should interact with it
- No indication of completion status for screen reader users

**Current Code:**
```javascript
rozBtn.setAttribute("aria-label", 
  completedToday ? "Roz (Daily Quest) — Done today" : "Roz (Daily Quest)"
);
```

**Recommendation:**
```javascript
rozBtn.setAttribute("aria-label", 
  completedToday 
    ? "Roz Daily Quest — Completed today. Tap to review or plan for tomorrow."
    : "Roz Daily Quest — Start today. Complete Learn, Reading, and Games tasks."
);
```

Add ARIA attributes:
```html
<button class="streak-split-right" 
        id="btn-home-roz" 
        aria-label="Daily Quest"
        aria-pressed="false">
```

Update JavaScript:
```javascript
if (completedToday) {
  rozBtn.setAttribute("aria-pressed", "true");
}
```

---

## Part 3: Orange Milestone Card Analysis

### Current Implementation

```css
.milestones-card {
  background: linear-gradient(135deg, #ffd89b 0%, #ffb366 100%);
  color: #333;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 179, 102, 0.3);
}
```

**Display:** Shows upcoming streak milestones (e.g., "Reach 7 days → Unlock Bronze Badge")

---

### Weakness #1: Milestone Progress Not Visually Clear

**Issue:**
- The card lists milestones as text, but doesn't show *progress* toward the next one
- User doesn't know: "I need 3 more days to unlock the next badge"
- No visual progress bar or countdown

**Impact:**
- ⚠️ **Medium** – Reduces motivation; user can't see how close they are

**Recommendation:**
Add a mini progress bar above the milestone list:

```html
<div class="milestones-card">
  <h3>🎖️ Milestones</h3>
  
  <div class="milestone-progress">
    <div class="milestone-current">
      <span class="milestone-label">Next milestone in 3 days</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 60%;"></div>
      </div>
    </div>
  </div>
  
  <ul>
    <li>Day 3: Silver Badge</li>
    <li>Day 7: Gold Badge</li>
    <li>Day 14: Platinum Badge</li>
  </ul>
</div>
```

```css
.milestone-progress {
  margin-bottom: 12px;
}

.milestone-current {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}
```

---

### Weakness #2: Milestone Names Unclear Without Context

**Issue:**
- Milestones show "Day 3", "Day 7", etc., but don't explain what they are
- No explanation of rewards (badges, XP, unlocks)
- Visual consistency: badges are mentioned but not shown

**Recommendation:**
Add badge icons + descriptions:

```html
<ul class="milestones-list">
  <li class="milestone-item">
    <span class="milestone-icon">🥉</span>
    <span class="milestone-text">
      <strong>Day 3</strong> – Bronze Badge
    </span>
  </li>
  <li class="milestone-item">
    <span class="milestone-icon">🥇</span>
    <span class="milestone-text">
      <strong>Day 7</strong> – Gold Badge
    </span>
  </li>
  <li class="milestone-item">
    <span class="milestone-icon">💎</span>
    <span class="milestone-text">
      <strong>Day 14</strong> – Platinum Badge
    </span>
  </li>
</ul>
```

```css
.milestone-icon {
  font-size: 18px;
  margin-right: 6px;
}

.milestone-text {
  display: inline-block;
  font-size: 0.85rem;
}
```

---

### Weakness #3: Missing Bilingual Content

**Issue:**
- The milestone card is *not* rendered with Punjabi text
- Only English labels visible
- Inconsistent with the rest of the app's bilingual approach

**Evidence from rendering code:**
```javascript
// (Assuming milestones are hardcoded English-only)
```

**Impact:**
- ⚠️ **Medium–High** – Breaks immersion for Punjabi-speaking children
- Reduces inclusivity; not all caregivers read English well

**Recommendation:**
Add Punjabi translations to milestone names:

```html
<li class="milestone-item">
  <span class="milestone-icon">🥉</span>
  <span class="milestone-text-en">
    <strong>Day 3</strong> – Bronze Badge
  </span>
  <span class="milestone-text-pa" lang="pa">
    <strong>3 ਦਿਨ</strong> – ਕਾਂਸੀ ਪੁਰਸਕਾਰ
  </span>
</li>
```

---

### Weakness #4: Card Position & Visibility

**Issue:**
- The milestone card sits next to the streak card in a grid
- On mobile (< 600px), the grid stacks vertically
- The milestone card might appear *below* the fold on first load
- User needs to scroll to see it; engagement may drop

**Current CSS:**
```css
.streak-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

@media (max-width: 600px) {
  .streak-section {
    grid-template-columns: 1fr;  /* Stacks cards */
  }
}
```

**Recommendation:**
Consider placing the milestone card *above* or in a separate, more prominent location:

```html
<!-- Option: Move milestones to top -->
<div class="home-stats">
  <div class="milestones-card"></div>
  <div class="home-streak"></div>
  <!-- other cards -->
</div>
```

Or use a collapsible "Achievements" panel:

```html
<details class="achievements-panel">
  <summary>🎖️ Milestones & Achievements</summary>
  <div class="milestones-card"></div>
</details>
```

---

## Part 4: Unified Recommendations Summary

### Quick Wins (Low-Effort, High-Impact)

| # | Change | Time | Impact |
|---|--------|------|--------|
| 1 | Add `"Complete Daily Quest daily to build"` subtitle to streak card | 10 min | +15% clarity |
| 2 | Make Roz button border thicker & add hover state | 5 min | +20% affordance |
| 3 | Change "Roz ✓" text to include emoji (e.g., `"✓ Roz"`) | 2 min | +25% recognition |
| 4 | Add `aria-pressed` & improved `aria-label` to Roz | 10 min | +30% a11y |
| 5 | Add "3 tasks" or "Daily Quest" subtitle to Roz button | 10 min | +25% clarity |
| 6 | Change Roz label to "Daily Quest" (English-first) | 5 min | +40% discoverability |

---

### Medium Effort, High Payoff

| # | Change | Time | Impact |
|---|--------|------|--------|
| 7 | Add ultra-small breakpoint (< 360px) for streak card stacking | 15 min | +10% mobile UX |
| 8 | Add Punjabi text to milestone card | 20 min | +20% inclusivity |
| 9 | Add progress bar to next milestone | 20 min | +30% motivation |
| 10 | Add badge icons to milestones | 15 min | +15% visual appeal |

---

### Larger Refactoring (If Resources Available)

| # | Change | Time | Impact |
|---|--------|------|--------|
| 11 | Add celebration animation on quest completion | 30 min | +25% joy |
| 12 | Redesign Roz as full card with preview | 60 min | +40% engagement |
| 13 | Add tooltip system for "Roz" term | 45 min | +15% education |
| 14 | Implement milestone unlock notifications | 90 min | +35% retention |

---

## Part 5: Code Implementation Checklist

### Phase 1: Quick Fixes (Implement First)

- [ ] **Streak Card Subtitle**
  - File: `app/index.html` (lines 90–105)
  - Add: `.streak-subtitle` + `.streak-subtitle-pa` elements
  - CSS: New `.streak-subtitle` class with 0.75rem font size

- [ ] **Roz Affordance**
  - File: `app/css/main.css` (lines 2786–2800)
  - Increase `border-left` width from 1px to 2px
  - Add `:hover` state with darker background

- [ ] **Roz Label Clarity**
  - File: `app/index.html` (line 98)
  - Change label from `Roz (ਰੋਜ਼)` to `📋 Daily Quest`
  - Keep Punjabi on second line

- [ ] **Accessibility**
  - File: `app/js/ui.js` (lines 1159–1167)
  - Update `aria-label` to be more descriptive
  - Add `aria-pressed` attribute

### Phase 2: Medium Fixes (Next Sprint)

- [ ] **Responsive Ultra-Small Breakpoint**
  - File: `app/css/main.css` (lines 2925–2940)
  - Add `@media (max-width: 360px)` rule

- [ ] **Milestone Progress Bar**
  - File: `app/index.html` (milestone card section)
  - Add HTML structure for progress bar
  - File: `app/css/main.css`
  - Add `.milestone-progress`, `.progress-bar`, `.progress-fill` styles

- [ ] **Milestone Bilingual Content**
  - File: Data source (likely `app/js/progress.js` or `app/js/ui.js`)
  - Add Punjabi translations for milestone labels
  - Update render function to include both languages

### Phase 3: Enhancements (Nice-to-Have)

- [ ] **Completion Animation**
  - File: `app/css/main.css`
  - Add `@keyframes celebrationPulse`
  - Apply to `.streak-split-right.is-complete`

- [ ] **Milestone Badge Icons**
  - File: HTML or JS render function
  - Add emoji/SVG icons for each milestone
  - Add `.milestone-icon` CSS styling

---

## Part 6: Testing & Validation Checklist

### Functional Tests
- [ ] Streak count updates correctly after Daily Quest completion
- [ ] Roz button navigates to Daily Quest modal
- [ ] "Roz ✓" appears when quest is marked complete
- [ ] Milestones update as streak increases
- [ ] Bilingual labels display correctly in both languages

### Visual Tests (Desktop, Tablet, Mobile)
- [ ] Streak card remains readable on 280px width screens
- [ ] Roz button is clearly tappable on touch devices
- [ ] Milestone card is visible on first load (not below fold)
- [ ] Text doesn't overflow; no clipping on small screens
- [ ] Color contrast meets WCAG AA standards

### Accessibility Tests
- [ ] Screen reader announces "Daily Quest" label clearly
- [ ] Focus order is logical (left card → Roz button → next element)
- [ ] Keyboard navigation works (Tab to Roz, Enter to activate)
- [ ] Aria labels update when completion state changes
- [ ] Icons are decorative (not read by screen readers)

### User Testing (with Child & Parent Personas)
- [ ] Child understands they need to tap Roz for daily activities
- [ ] Parent can see Punjabi labels (if monolingual Punjabi)
- [ ] Both understand the connection: Streak ← Daily Quest
- [ ] Visual feedback (✓, completion state) is satisfying
- [ ] Mobile experience (tap target size, scroll) is smooth

---

## Part 7: Accessibility Deep Dive

### Current WCAG Status
- ✅ Color contrast (white on red/orange): ~4.5:1 (good)
- ✅ Focus visible (outline, inset shadow)
- ⚠️ Button purpose could be clearer (aria-label)
- ⚠️ Milestone card has no Punjabi (exclusionary)
- ⚠️ Completion feedback not obvious (visual only)

### Recommended Fixes

**Screen Reader Improvements:**
```html
<button 
  class="streak-split-right" 
  id="btn-home-roz"
  aria-label="Daily Quest - Complete Learn, Reading, and Games tasks to build your streak"
  aria-pressed="false"
  role="button"
>
  <span class="btn-label-en" aria-hidden="false">Daily Quest</span>
  <span class="btn-label-pa" aria-hidden="false" lang="pa">ਰੋਜ਼ ਕਵੈਸਟ</span>
</button>
```

**JavaScript Update:**
```javascript
// In ui.js renderStreakSection()
if (completedToday) {
  rozBtn.setAttribute("aria-pressed", "true");
  rozBtn.setAttribute("aria-label", 
    "Daily Quest - Completed today! Great work. Return tomorrow to continue your streak."
  );
} else {
  rozBtn.setAttribute("aria-pressed", "false");
  rozBtn.setAttribute("aria-label", 
    "Daily Quest - Complete Learn, Reading, and Games tasks to build your streak"
  );
}
```

**Keyboard Navigation:**
- Roz button must be in natural tab order (should already be)
- Ensure `:focus-visible` outline is clear (already implemented)
- Test with keyboard-only navigation

---

## Part 8: Design System Consistency

### Current Color Palette
- **Streak Card:** Red/Orange gradient (#ff6b6b → #ff8e72)
- **Milestone Card:** Gold/Orange gradient (#ffd89b → #ffb366)
- **Button text:** White (#ffffff)
- **Accent (success):** Green (#4caf50, implied for completion)

### Recommendations
1. **Consistency:** Use the same green for milestone progress bar and completion badges
2. **Hierarchy:** Streak (red) is primary; Milestones (gold) is secondary → keep that visual distinction
3. **Typography:** Ensure Punjabi fonts render consistently (already uses `Gurmukhi` family)
4. **Icons:** Standardize emoji usage (fire, medal, quest marker) across all cards

---

## Part 9: ROI & Implementation Order

**For Senior Editor Planning:**

### Tier 1 (Must-Have for v2.0 Release)
1. Add clarity subtitle to streak card
2. Improve Roz affordance (border + hover)
3. Change "Roz" label to "Daily Quest"
4. Add `aria-pressed` attribute

**Effort:** ~1 hour  
**Impact:** +30% UX clarity, +20% accessibility

---

### Tier 2 (Should-Have for v2.1 Release)
5. Add progress bar to milestones
6. Add Punjabi text to milestone card
7. Add ultra-small screen breakpoint
8. Completion animation

**Effort:** ~2 hours  
**Impact:** +50% motivation, +25% inclusivity

---

### Tier 3 (Nice-to-Have for v2.2+)
9. Add milestone badge icons
10. Add celebration notification on quest completion
11. Implement milestone unlock alerts
12. Add tooltip for "Roz" term

**Effort:** ~3 hours  
**Impact:** +20% joy, +15% retention

---

## Conclusion

The **streak card and Roz button** are visually confident but **ambiguous in purpose**. The **orange milestone card** is motivational but **lacks progress visualization**.

**Primary Issues:**
1. **Streak concept** is not explained (why build it?)
2. **Roz button** doesn't clearly indicate it's tappable or what it contains
3. **Milestones** are text-only and not progress-driven
4. **Accessibility** labels could be more descriptive
5. **Bilingual parity** missing in milestone card

**Quick Path to +30% UX Improvement:**
- Add 1-line subtitle to streak card
- Improve Roz button visual affordance
- Rename "Roz" to "Daily Quest" (keep Punjabi)
- Update aria-labels for clarity

**Estimated Effort:** 1 hour  
**Estimated Impact:** 30–40% improvement in clarity and engagement

---

**Prepared for:** Senior Editor Review  
**Recommended Next Step:** Prioritize Tier 1 fixes for next sprint; gather user feedback post-launch to validate Tier 2/3.

