# Reading Vocabulary Schema (BOLO)

## Source of truth
- `app/data/readingVocab.js` defines a rich, kid-friendly vocab dataset:
  - `READING_VOCAB_DETAIL`

This is the **recommended** schema for authoring because it supports bilingual definitions and metadata.

## `READING_VOCAB_DETAIL` shape
```js
var READING_VOCAB_DETAIL = {
  R1: {
    phrases: [
      { term: "hold hands", pos: "phrase", defEn: "…", defPa: "…" }
    ],
    words: [
      { term: "park", pos: "noun", defEn: "…", defPa: "…", forms: ["parks"] }
    ]
  },
  // ... R2..R10
};
```

Notes:
- `phrases` and `words` should be arrays (or omitted).
- Each item should have a non-empty `term` string.
- `forms` is optional; if present it should be an array of strings.

## Runtime compatibility (`READING_VOCAB`)
The app’s older runtime expects:
```js
READING_VOCAB["R1"] = {
  vocabWords: ["park", "pond"],
  vocabPhrases: ["hold hands"],
  vocabForms: { buy: ["buys", "bought"] }
};
```

To stay backward compatible, `app/data/readingVocab.js` also builds `READING_VOCAB` from `READING_VOCAB_DETAIL` at load time.

## UI behavior
- Reading detail screen prefers `READING_VOCAB_DETAIL` when available.
- It falls back to `READING_VOCAB` if detailed data is missing.

## Adding more batches
Add additional readings (or updates) by appending more keys to `READING_VOCAB_DETAIL`.
