/* =========================================================
   BOLO – Reading Vocabulary (R1–R10)
   Improved version: kid-friendly definitions + consistent schema
   Paste into: data/readingVocab.js

   Schema:
   READING_VOCAB_DETAIL = {
     R1: { phrases: [{term,pos,defEn,defPa}], words: [{term,pos,defEn,defPa,forms?}] },
     ...
   }

   Notes:
   - “forms” is optional and only used when it helps (e.g., bought, drank, walked).
  - I avoided overly-abstract words and kept definitions short/simple for kids.
   ========================================================= */

var READING_VOCAB_DETAIL = {
  /* ----------------------------- R1: The Park ----------------------------- */
  R1: {
    phrases: [
      { term: "hold hands", pos: "phrase", defEn: "to hold someone’s hand", defPa: "ਹੱਥ ਫੜਨਾ" },
      { term: "go home", pos: "phrase", defEn: "to return to your house", defPa: "ਘਰ ਜਾਣਾ" },
      { term: "drink water", pos: "phrase", defEn: "to drink water", defPa: "ਪਾਣੀ ਪੀਣਾ" },
      { term: "wag its tail", pos: "phrase", defEn: "move the tail side to side", defPa: "ਪੁੱਛ ਹਿਲਾਉਣਾ" },
      { term: "wet grass", pos: "phrase", defEn: "grass with water on it", defPa: "ਭਿੱਜਾ ਘਾਹ" }
    ],
    words: [
      { term: "park", pos: "noun", defEn: "a place outside to walk and play", defPa: "ਪਾਰਕ" },
      { term: "pond", pos: "noun", defEn: "a small lake", defPa: "ਛੋਟਾ ਤਲਾਬ" },
      { term: "swings", pos: "noun", defEn: "playground seats that swing", defPa: "ਝੂਲੇ" },
      { term: "slide", pos: "noun", defEn: "playground ramp you slide down", defPa: "ਫਿਸਲਣ ਵਾਲੀ ਪੱਟੀ" },
      { term: "bench", pos: "noun", defEn: "a long seat", defPa: "ਬੈਂਚ" },
      { term: "path", pos: "noun", defEn: "a walkway", defPa: "ਰਸਤਾ" },
      { term: "birds", pos: "noun", defEn: "animals with wings", defPa: "ਪੰਛੀ" },
      { term: "rain", pos: "noun/verb", defEn: "water that falls from the sky", defPa: "ਮੀਂਹ", forms: ["rained"] },
      { term: "walk", pos: "verb", defEn: "move by stepping", defPa: "ਤੁਰਨਾ", forms: ["walked"] },
      { term: "run", pos: "verb", defEn: "move fast", defPa: "ਦੌੜਨਾ" },
      { term: "laugh", pos: "verb", defEn: "make a happy sound", defPa: "ਹੱਸਣਾ", forms: ["laughed"] }
    ]
  },

  /* ----------------------------- R2: A School Day ----------------------------- */
  R2: {
    phrases: [
      { term: "wake up", pos: "phrase", defEn: "stop sleeping", defPa: "ਜਾਗਣਾ" },
      { term: "good morning", pos: "phrase", defEn: "morning greeting", defPa: "ਗੁੱਡ ਮੋਰਨਿੰਗ / ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
      { term: "walk to school", pos: "phrase", defEn: "go to school by walking", defPa: "ਸਕੂਲ ਤੁਰ ਕੇ ਜਾਣਾ" },
      { term: "stand in a line", pos: "phrase", defEn: "stand one behind another", defPa: "ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਨਾ" },
      { term: "lunch box", pos: "phrase", defEn: "a box for lunch food", defPa: "ਲੰਚ ਬਾਕਸ / ਡੱਬਾ" }
    ],
    words: [
      { term: "Monday", pos: "proper noun", defEn: "a day of the week", defPa: "ਸੋਮਵਾਰ" },
      { term: "breakfast", pos: "noun", defEn: "first meal of the day", defPa: "ਨਾਸਤਾ" },
      { term: "teacher", pos: "noun", defEn: "a person who teaches", defPa: "ਅਧਿਆਪਕ/ਅਧਿਆਪਕਾ" },
      { term: "board", pos: "noun", defEn: "where the teacher writes", defPa: "ਬੋਰਡ" },
      { term: "words", pos: "noun", defEn: "letters with meaning", defPa: "ਸ਼ਬਦ" },
      { term: "read", pos: "verb", defEn: "look at words and understand", defPa: "ਪੜ੍ਹਨਾ" },
      { term: "listen", pos: "verb", defEn: "use your ears carefully", defPa: "ਧਿਆਨ ਨਾਲ ਸੁਣਨਾ" },
      { term: "question", pos: "noun", defEn: "something you ask", defPa: "ਸਵਾਲ", forms: ["questions"] },
      { term: "share", pos: "verb", defEn: "give some to someone", defPa: "ਸਾਂਝਾ ਕਰਨਾ", forms: ["shared"] },
      { term: "paint", pos: "verb", defEn: "make a picture with paint", defPa: "ਪੇਂਟ ਕਰਨਾ", forms: ["painted"] },
      { term: "count", pos: "verb", defEn: "say numbers in order", defPa: "ਗਿਣਨਾ" },
      { term: "coin", pos: "noun", defEn: "small round money", defPa: "ਸਿੱਕਾ", forms: ["coins"] }
    ]
  },

  /* ----------------------------- R3: What I Did ----------------------------- */
  R3: {
    phrases: [
      { term: "busy day", pos: "phrase", defEn: "a day with lots to do", defPa: "ਰੁੱਝਿਆ ਦਿਨ" },
      { term: "clean my room", pos: "phrase", defEn: "make the room tidy", defPa: "ਕਮਰਾ ਸਾਫ਼ ਕਰਨਾ" },
      { term: "fold clothes", pos: "phrase", defEn: "make clothes neat by folding", defPa: "ਕੱਪੜੇ ਮੋੜਨਾ" },
      { term: "wash the car", pos: "phrase", defEn: "clean the car with water", defPa: "ਗੱਡੀ ਧੋਣਾ" },
      { term: "board game", pos: "phrase", defEn: "a game played on a board", defPa: "ਬੋਰਡ ਵਾਲੀ ਖੇਡ" }
    ],
    words: [
      { term: "Saturday", pos: "proper noun", defEn: "a day of the week", defPa: "ਸ਼ਨੀਵਾਰ" },
      { term: "cousin", pos: "noun", defEn: "your aunt/uncle’s child", defPa: "ਕਜ਼ਨ" },
      { term: "popcorn", pos: "noun", defEn: "a crunchy snack", defPa: "ਪੌਪਕੌਰਨ" },
      { term: "store", pos: "noun", defEn: "a shop", defPa: "ਦੁਕਾਨ" },
      { term: "milk", pos: "noun", defEn: "a white drink", defPa: "ਦੁੱਧ" },
      { term: "tired", pos: "adj", defEn: "needing rest", defPa: "ਥੱਕਿਆ" },
      { term: "rest", pos: "verb", defEn: "take a break", defPa: "ਆਰਾਮ ਕਰਨਾ" },
      { term: "clean", pos: "verb", defEn: "make not dirty", defPa: "ਸਾਫ਼ ਕਰਨਾ", forms: ["cleaned"] },
      { term: "fold", pos: "verb", defEn: "bend and make neat", defPa: "ਮੋੜਨਾ", forms: ["folded"] },
      { term: "buy", pos: "verb", defEn: "get by paying money", defPa: "ਖਰੀਦਣਾ", forms: ["bought"] },
      { term: "carry", pos: "verb", defEn: "hold and take with you", defPa: "ਢੋਣਾ/ਲੈ ਜਾਣਾ", forms: ["carried"] }
    ]
  },

  /* ----------------------------- R4: My Family ----------------------------- */
  R4: {
    phrases: [
      { term: "funny stories", pos: "phrase", defEn: "stories that make you laugh", defPa: "ਮਜ਼ੇਦਾਰ ਕਹਾਣੀਆਂ" },
      { term: "on the fridge", pos: "phrase", defEn: "placed on the refrigerator", defPa: "ਫ੍ਰਿਜ਼ ਤੇ" },
      { term: "near the door", pos: "phrase", defEn: "close to the door", defPa: "ਦਰਵਾਜ਼ੇ ਦੇ ਨੇੜੇ" },
      { term: "warm hug", pos: "phrase", defEn: "a loving hug", defPa: "ਪਿਆਰ ਵਾਲੀ ਜੱਫੀ" }
    ],
    words: [
      { term: "family", pos: "noun", defEn: "people you live with", defPa: "ਪਰਿਵਾਰ" },
      { term: "grandparents", pos: "noun", defEn: "grandma and grandpa", defPa: "ਦਾਦਾ-ਦਾਦੀ/ਨਾਨਾ-ਨਾਨੀ" },
      { term: "grandma", pos: "noun", defEn: "your grandmother", defPa: "ਦਾਦੀ/ਨਾਨੀ" },
      { term: "grandpa", pos: "noun", defEn: "your grandfather", defPa: "ਦਾਦਾ/ਨਾਨਾ" },
      { term: "drawing", pos: "noun", defEn: "a picture you draw", defPa: "ਡਰਾਇੰਗ/ਚਿੱਤਰ" },
      { term: "soccer", pos: "noun", defEn: "a sport played with a ball", defPa: "ਫੁਟਬਾਲ" },
      { term: "fix", pos: "verb", defEn: "make it work again", defPa: "ਠੀਕ ਕਰਨਾ", forms: ["fixed"] },
      { term: "visit", pos: "verb", defEn: "go see someone", defPa: "ਮਿਲਣ ਜਾਣਾ", forms: ["visited"] },
      { term: "tea", pos: "noun", defEn: "a warm drink", defPa: "ਚਾਹ" }
    ]
  },

  /* ----------------------------- R5: Tomorrow’s Plan ----------------------------- */
  R5: {
    phrases: [
      { term: "finish homework", pos: "phrase", defEn: "complete homework", defPa: "ਘਰ ਦਾ ਕੰਮ ਮੁਕਾਉਣਾ" },
      { term: "water bottle", pos: "phrase", defEn: "a bottle for water", defPa: "ਪਾਣੀ ਦੀ ਬੋਤਲ" },
      { term: "go to the bakery", pos: "phrase", defEn: "go to a shop that bakes bread/cookies", defPa: "ਬੇਕਰੀ ਜਾਣਾ" },
      { term: "make a salad", pos: "phrase", defEn: "prepare a salad", defPa: "ਸਲਾਦ ਬਣਾਉਣਾ" }
    ],
    words: [
      { term: "tomorrow", pos: "noun/adv", defEn: "the day after today", defPa: "ਕੱਲ੍ਹ" },
      { term: "aunt", pos: "noun", defEn: "your parent’s sister", defPa: "ਮਾਸੀ/ਚਾਚੀ/ਤਾਈ" },
      { term: "library", pos: "noun", defEn: "a place to read/borrow books", defPa: "ਪੁਸਤਕਾਲਾ" },
      { term: "bakery", pos: "noun", defEn: "shop for baked food", defPa: "ਬੇਕਰੀ" },
      { term: "cookie", pos: "noun", defEn: "a small sweet snack", defPa: "ਬਿਸਕੁਟ" },
      { term: "salad", pos: "noun", defEn: "food made with vegetables", defPa: "ਸਲਾਦ" },
      { term: "wash", pos: "verb", defEn: "clean with water", defPa: "ਧੋਣਾ", forms: ["washed"] },
      { term: "cut", pos: "verb", defEn: "make pieces with a knife", defPa: "ਕੱਟਣਾ" },
      { term: "try", pos: "verb", defEn: "test something new", defPa: "ਕੋਸ਼ਿਸ਼ ਕਰਨਾ", forms: ["tried"] }
    ]
  },

  /* ----------------------------- R6: Colors and Things ----------------------------- */
  R6: {
    phrases: [
      { term: "draw a picture", pos: "phrase", defEn: "make a picture by drawing", defPa: "ਚਿੱਤਰ ਬਣਾਉਣਾ" },
      { term: "clean my desk", pos: "phrase", defEn: "make the desk tidy", defPa: "ਮੇਜ਼ ਸਾਫ਼ ਕਰਨਾ" },
      { term: "neat stack", pos: "phrase", defEn: "a tidy pile", defPa: "ਸੁਥਰੀ ਢੇਰੀ" }
    ],
    words: [
      { term: "pillow", pos: "noun", defEn: "soft thing for your head", defPa: "ਤਕੀਆ" },
      { term: "notebook", pos: "noun", defEn: "book of pages for writing", defPa: "ਕਾਪੀ" },
      { term: "crayons", pos: "noun", defEn: "colored sticks for drawing", defPa: "ਕ੍ਰੇਯੋਨ/ਰੰਗ" },
      { term: "sticker", pos: "noun", defEn: "small label that sticks", defPa: "ਸਟਿਕਰ" },
      { term: "bright", pos: "adj", defEn: "full of light", defPa: "ਚਮਕਦਾਰ" },
      { term: "calm", pos: "adj", defEn: "quiet and peaceful", defPa: "ਸ਼ਾਂਤ" },
      { term: "draw", pos: "verb", defEn: "make a picture", defPa: "ਡਰਾਇੰਗ ਕਰਨਾ", forms: ["drew"] },
      { term: "find", pos: "verb", defEn: "discover something", defPa: "ਲੱਭਣਾ", forms: ["found"] }
    ]
  },

  /* ----------------------------- R7: Where Is It? ----------------------------- */
  R7: {
    phrases: [
      { term: "look for", pos: "phrase", defEn: "try to find", defPa: "ਲੱਭਣਾ" },
      { term: "under the bed", pos: "phrase", defEn: "below the bed", defPa: "ਬਿਸਤਰ ਹੇਠਾਂ" },
      { term: "behind the door", pos: "phrase", defEn: "at the back of the door", defPa: "ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ" },
      { term: "same place", pos: "phrase", defEn: "one fixed spot", defPa: "ਇੱਕੋ ਜਗ੍ਹਾ" }
    ],
    words: [
      { term: "shoe", pos: "noun", defEn: "something you wear on your foot", defPa: "ਜੁੱਤਾ" },
      { term: "closet", pos: "noun", defEn: "place to keep clothes", defPa: "ਅਲਮਾਰੀ" },
      { term: "shelf", pos: "noun", defEn: "flat board for holding things", defPa: "ਸ਼ੈਲਫ" },
      { term: "floor", pos: "noun", defEn: "ground inside a room", defPa: "ਫਰਸ਼" },
      { term: "remember", pos: "verb", defEn: "keep it in your mind", defPa: "ਯਾਦ ਰੱਖਣਾ" },
      { term: "check", pos: "verb", defEn: "look to see if it’s there", defPa: "ਚੈੱਕ ਕਰਨਾ", forms: ["checked"] },
      { term: "ask", pos: "verb", defEn: "say a question", defPa: "ਪੁੱਛਣਾ", forms: ["asked"] }
    ]
  },

  /* ----------------------------- R8: My Friend and Me ----------------------------- */
  R8: {
    phrases: [
      { term: "best friend", pos: "phrase", defEn: "your closest friend", defPa: "ਸਭ ਤੋਂ ਚੰਗਾ ਦੋਸਤ" },
      { term: "share snacks", pos: "phrase", defEn: "give snacks to each other", defPa: "ਨਾਸਤਾ ਸਾਂਝਾ ਕਰਨਾ" },
      { term: "apple slices", pos: "phrase", defEn: "thin pieces of apple", defPa: "ਸੇਬ ਦੇ ਟੁਕੜੇ" },
      { term: "draw a picture", pos: "phrase", defEn: "make a picture by drawing", defPa: "ਚਿੱਤਰ ਬਣਾਉਣਾ" }
    ],
    words: [
      { term: "Sara", pos: "proper noun", defEn: "a friend’s name", defPa: "ਸਾਰਾ (ਨਾਮ)" },
      { term: "snack", pos: "noun", defEn: "small food between meals", defPa: "ਨਾਸਤਾ", forms: ["snacks"] },
      { term: "trade", pos: "verb", defEn: "swap with someone", defPa: "ਅਦਲ-ਬਦਲ ਕਰਨਾ" },
      { term: "playground", pos: "noun", defEn: "a place to play outside", defPa: "ਖੇਡ ਦਾ ਮੈਦਾਨ" },
      { term: "sick", pos: "adj", defEn: "not feeling well", defPa: "ਬਿਮਾਰ" },
      { term: "sad", pos: "adj", defEn: "unhappy", defPa: "ਉਦਾਸ" },
      { term: "show", pos: "verb", defEn: "let someone see", defPa: "ਵਿਖਾਉਣਾ", forms: ["showed"] }
    ]
  },

  /* ----------------------------- R9: My Birthday ----------------------------- */
  R9: {
    phrases: [
      { term: "bake a cake", pos: "phrase", defEn: "cook a cake in the oven", defPa: "ਕੇਕ ਬੇਕ ਕਰਨਾ" },
      { term: "chocolate frosting", pos: "phrase", defEn: "sweet chocolate topping on a cake", defPa: "ਕੇਕ ਉੱਤੇ ਚਾਕਲੇਟ ਮਿੱਠੀ ਪਰਤ" },
      { term: "handmade card", pos: "phrase", defEn: "a card made by hand", defPa: "ਹੱਥ ਨਾਲ ਬਣਾਇਆ ਕਾਰਡ" },
      { term: "living room", pos: "phrase", defEn: "main room for sitting at home", defPa: "ਡਰਾਇੰਗ ਰੂਮ" },
      { term: "musical chairs", pos: "phrase", defEn: "game: sit when music stops", defPa: "ਸੰਗੀਤ ਵਾਲੀਆਂ ਕੁਰਸੀਆਂ" },
      { term: "make a wish", pos: "phrase", defEn: "hope for something you want", defPa: "ਇੱਛਾ ਮੰਗਣਾ" },
      { term: "blow out candles", pos: "phrase", defEn: "use breath to turn off flames", defPa: "ਮੋਮਬੱਤੀਆਂ ਬੁਝਾਉਣਾ" }
    ],
    words: [
      { term: "birthday", pos: "noun", defEn: "a day you celebrate being born", defPa: "ਜਨਮਦਿਨ" },
      { term: "balloon", pos: "noun", defEn: "air-filled party decoration", defPa: "ਗੁਬਾਰਾ", forms: ["balloons"] },
      { term: "gift", pos: "noun", defEn: "a present", defPa: "ਤੋਹਫ਼ਾ" },
      { term: "candle", pos: "noun", defEn: "wax stick with a flame", defPa: "ਮੋਮਬੱਤੀ", forms: ["candles"] },
      { term: "excited", pos: "adj", defEn: "very happy and eager", defPa: "ਉਤਸਾਹਿਤ" },
      { term: "sing", pos: "verb", defEn: "use your voice to make a song", defPa: "ਗਾਉਣਾ" },
      { term: "bake", pos: "verb", defEn: "cook in an oven", defPa: "ਬੇਕ ਕਰਨਾ", forms: ["baked"] },
      { term: "hang", pos: "verb", defEn: "put up (decorate)", defPa: "ਲਟਕਾਉਣਾ", forms: ["hung"] }
    ]
  },

  /* ----------------------------- R10: At the Market ----------------------------- */
  R10: {
    phrases: [
      { term: "go to the market", pos: "phrase", defEn: "go to a place to buy food/items", defPa: "ਬਾਜ਼ਾਰ ਜਾਣਾ" },
      { term: "fruit stall", pos: "phrase", defEn: "a small place selling fruit", defPa: "ਫਲਾਂ ਦਾ ਠੇਲਾ" },
      { term: "vegetable stall", pos: "phrase", defEn: "a small place selling vegetables", defPa: "ਸਬਜ਼ੀਆਂ ਦਾ ਠੇਲਾ" },
      { term: "for free", pos: "phrase", defEn: "without paying money", defPa: "ਮੁਫ਼ਤ" },
      { term: "save money", pos: "phrase", defEn: "not spend money", defPa: "ਪੈਸੇ ਬਚਾਉਣਾ" },
      { term: "roasted corn", pos: "phrase", defEn: "corn cooked over heat", defPa: "ਭੁੰਨੀ ਹੋਈ ਮੱਕੀ" }
    ],
    words: [
      { term: "Sunday", pos: "proper noun", defEn: "a day of the week", defPa: "ਐਤਵਾਰ" },
      { term: "market", pos: "noun", defEn: "busy place to buy things", defPa: "ਬਾਜ਼ਾਰ" },
      { term: "seller", pos: "noun", defEn: "a person who sells", defPa: "ਵਿਕਰੇਤਾ" },
      { term: "mint", pos: "noun", defEn: "a plant with a fresh smell", defPa: "ਪੁਦੀਂਨਾ" },
      { term: "rice", pos: "noun", defEn: "small grains used as food", defPa: "ਚਾਵਲ" },
      { term: "salty", pos: "adj", defEn: "tastes like salt", defPa: "ਨਮਕੀਨ" },
      { term: "sweet", pos: "adj", defEn: "tastes like sugar", defPa: "ਮਿੱਠਾ" },
      { term: "buy", pos: "verb", defEn: "get by paying money", defPa: "ਖਰੀਦਣਾ", forms: ["bought"] },
      { term: "choose", pos: "verb", defEn: "pick one or more", defPa: "ਚੁਣਨਾ" },
      { term: "decide", pos: "verb", defEn: "choose after thinking", defPa: "ਫੈਸਲਾ ਕਰਨਾ", forms: ["decided"] }
    ]
  }
};

// -------------------- Compatibility Export --------------------
// The BOLO app runtime expects a global `READING_VOCAB` shaped like:
//   READING_VOCAB[readingId] = { vocabWords: [], vocabPhrases: [], vocabForms: {} }
//
// Your richer schema above stays available as `READING_VOCAB_DETAIL` for future UI upgrades.
var READING_VOCAB = (typeof READING_VOCAB !== "undefined" && READING_VOCAB) ? READING_VOCAB : {};

(function buildReadingVocabCompat() {
  if (!READING_VOCAB_DETAIL || typeof READING_VOCAB_DETAIL !== "object") return;

  var out = {};
  for (var readingId in READING_VOCAB_DETAIL) {
    if (!READING_VOCAB_DETAIL.hasOwnProperty(readingId)) continue;
    var entry = READING_VOCAB_DETAIL[readingId];
    if (!entry || typeof entry !== "object") continue;

    // Phrases
    var vocabPhrases = [];
    if (Array.isArray(entry.phrases)) {
      for (var i = 0; i < entry.phrases.length; i++) {
        var ph = entry.phrases[i];
        if (ph && typeof ph.term === "string" && ph.term.trim()) {
          vocabPhrases.push(ph.term.trim());
        }
      }
    }

    // Words + Forms
    var vocabWords = [];
    var vocabForms = {};
    if (Array.isArray(entry.words)) {
      for (var j = 0; j < entry.words.length; j++) {
        var w = entry.words[j];
        if (!w || typeof w.term !== "string") continue;
        var base = w.term.trim();
        if (!base) continue;
        vocabWords.push(base);

        if (Array.isArray(w.forms) && w.forms.length) {
          vocabForms[base] = w.forms.slice();
        }
      }
    }

    out[readingId] = {
      vocabWords: vocabWords,
      vocabPhrases: vocabPhrases,
      vocabForms: vocabForms
    };
  }

  Object.assign(READING_VOCAB, out);
})();
