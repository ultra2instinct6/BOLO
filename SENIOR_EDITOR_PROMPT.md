# Prompt for Senior Editor Review: BOLO Production Readiness

## Context

I've completed a comprehensive production readiness assessment of the BOLO app (vanilla JS SPA for kids, English grammar + reading for Punjabi speakers). The review identified critical issues, architectural debt, and a 4-week execution plan to ship v1.0.

---

## Request for Your Input

I need your guidance as a senior engineer/architect on three fronts:

### 1. **Prioritization Validation**
I've extracted a **Top 10 prioritized list** of improvements (blocking bugs, high-ROI features, stabilization). Please review:
- Is the sequencing correct? (Should anything move up/down?)
- Are the effort estimates reasonable for our team?
- Which items have hidden dependencies I've missed?
- Should we tackle any of these in parallel differently?

**Key decisions**: 
- Start with browser testing (Games, Lessons fixes, Daily Quest)?
- Or should we begin with state persistence hardening first?
- Is 4-week timeline realistic with 1–2 devs?

---

### 2. **Technical Debt Strategy**
The codebase has **tight coupling via globals** and **mixed responsibilities** (e.g., Lessons.js and Games.js both handle question rendering independently). 

Questions:
- Should we refactor these patterns now, or stabilize first then refactor post-launch?
- Is the "vanilla JS no bundler" decision sustainable as we grow content + features?
- How much technical debt can we carry into v1.0 without regret?

---

### 3. **Dev Environment & Tooling Gaps**
We're using **vanilla JS + HTML/CSS with no build step**. This is intentionally simple, but I want your take on:
- What development tooling would help us move faster without violating the "no bundler" philosophy?
- Should we add linting, type checking, or testing frameworks? (If yes, which minimal ones?)
- Are there VS Code extensions or local tools that would catch bugs earlier?
- Should we implement a simple validation layer (QA console utilities) before each release?

---

### 4. **Risk Assessment**
Which of these concerns you most?
- **Data loss** (localStorage corruption, resume failures)
- **Accessibility** (WCAG compliance for inclusive learning)
- **Performance** (low-end Android devices, CSS thrash)
- **Security** (XSS, PII storage, app store requirements)
- **Engagement** (Daily Quest + Progress features not yet live)

---

### 5. **Post-Launch Plan**
Once we ship v1.0, what should our next phase focus on?
- **Bug fixes + stabilization** (assume ~20% of dev time post-launch)
- **Content scaling** (add 20+ more lessons + games)
- **Parent/teacher dashboard** (real-time progress + insights)
- **Multiplayer/social** (not for v1.0, but planning)
- **Offline support** (service worker + sync)

---

## Deliverables I'd Value From You

1. **Execution Sequencing**: Recommended day-by-day task order (with reasoning)
2. **Risk Mitigation**: Top 3–5 things that could derail the timeline (+ how to prevent)
3. **Go/No-Go Criteria**: What are the hard requirements before shipping?
4. **Team Capacity**: Is 1–2 devs realistic? Should we hire or adjust scope?
5. **Testing Strategy**: How do we validate a kids' app thoroughly without extensive manual testing?

---

## Current Status (Context)

- **Codebase**: 7,700 lines of production JS; 9 screens; 41 lessons; 4 games; 10 readings
- **Team**: Small (1–2 developers available)
- **Timeline**: Want to ship v1.0 by end of January 2026
- **Target Audience**: Kids, Punjabi-speaking families, low-end Android primary
- **Product Goals**: Simple, fast, no frameworks, locally resilient, engaging

---

## Attachments
- Full Production Readiness Review (details on P0/P1/P2 issues, module coupling, tech debt)
- 4-Week Execution Plan (phases, tasks, dependencies, effort estimates)
- Top 10 Prioritized Changes (ranked by impact/effort)

---

**Thanks for your perspective. This is a high-bar project, and I want to get it right.** 🚀
