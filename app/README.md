# BOLO – English Grammar for Punjabi Learners

A bilingual educational app for children to build strong English grammar skills with Punjabi support.

## Features

- **Learn**: Structured lessons on 5 skill tracks
  - Words & Names (nouns, pronouns)
  - Actions & Time (verbs, adverbs, tenses)
  - Describing Words (adjectives)
  - Sentence Building (prepositions, conjunctions, articles, subject–verb agreement)
  - Reading & Stories (26 bilingual passages)

- **Play**: Four interactive games to practice grammar
  - Game 1: Tap the Word (easy–medium)
  - Game 2: Part of Speech (medium)
  - Game 3: Tense Detective (medium–hard)
  - Game 4: Sentence Check (medium–hard)

- **Progress Tracking**: XP system, levels 1–100, track completion rates

- **Local Storage**: Save up to 3 profiles per device with individual progress

- **Bilingual**: English + Punjabi throughout

## Project Structure

```
app/
├── index.html              # Main HTML entry point
├── css/
│   └── main.css            # All styling
├── js/
│   ├── app.js              # Initialization & event wiring
│   ├── state.js            # Profile & XP management
│   ├── ui.js               # Screen navigation & modals
│   ├── lessons.js          # Lesson rendering & logic
│   ├── reading.js          # Reading passage display
│   ├── games.js            # Game logic for all 4 games
│   └── progress.js         # Progress view rendering
└── data/
    ├── tracks.js           # Track definitions
    ├── lessons.js          # All lesson content (13 lessons)
    ├── readings.js         # All 26 reading passages
    └── games.js            # Game question banks
```

## Getting Started

### Run Locally

1. Open `app/index.html` in a modern web browser
2. Create or select a profile
3. Start learning!

### No Build Process Needed

This is a vanilla HTML/CSS/JavaScript app with no dependencies. Just open the file in a browser.

## How It Works

- **Profiles**: Each child can have their own account with separate progress
- **XP System**: Complete lessons and answer questions to earn XP
- **Levels**: Progress from Level 1 to 100 as XP accumulates
- **Tracks**: Each skill area is tracked independently
- **Local Storage**: All progress saved to browser's localStorage

## Bilingual Content

- All interface text available in English and Punjabi
- Lessons include explanations in both languages
- Reading passages with Punjabi translations
- Games use English terminology with Punjabi options

## Lessons Included

- Noun
- Pronoun
- Singular & Plural
- Verb
- Adverb
- Simple Present
- Simple Past
- Simple Future
- Adjective
- Preposition
- Conjunction
- Interjection
- Article
- Subject–Verb Agreement

## Game Types

1. **Tap the Word**: Select the correct word from a sentence based on the prompt
2. **Part of Speech**: Identify which part of speech a word is
3. **Tense Detective**: Determine whether a sentence is past, present, or future
4. **Sentence Check**: Choose the grammatically correct sentence from two options

## Browser Compatibility

Works on modern browsers (Chrome, Firefox, Safari, Edge) with:
- ES5 JavaScript support
- localStorage API
- CSS Flexbox

## Created By

Dr. Daroach

## License

Educational use only.
