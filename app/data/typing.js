// BOLO Typing Data (vanilla, boot-safe)
//
// IMPORTANT: Vanilla script (no imports/exports). Loaded before app/js/*.js.
// Defines:
// - TYPING_PROMPTS

// Schema (simple): { en: string, pa?: string }
// `app/js/typing.js` will normalize prompts and derive difficulty bands.

var TYPING_PROMPTS = [
  { en: "My name is Aman.", pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।" },
  { en: "I like apples.", pa: "ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ।" },
  { en: "Please close the door.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰੋ।" },
  { en: "She is going to school today.", pa: "ਉਹ ਅੱਜ ਸਕੂਲ ਜਾ ਰਹੀ ਹੈ।" },
  { en: "We will eat dinner at seven.", pa: "ਅਸੀਂ ਸੱਤ ਵਜੇ ਰਾਤ ਦਾ ਖਾਣਾ ਖਾਵਾਂਗੇ।" },

  { en: "I am ready now.", pa: "ਮੈਂ ਹੁਣ ਤਿਆਰ ਹਾਂ।" },
  { en: "He is my friend.", pa: "ਉਹ ਮੇਰਾ ਦੋਸਤ ਹੈ।" },
  { en: "This is my book.", pa: "ਇਹ ਮੇਰੀ ਕਿਤਾਬ ਹੈ।" },
  { en: "I can help you.", pa: "ਮੈਂ ਤੇਰੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।" },
  { en: "Please sit here.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਬੈਠੋ।" },

  { en: "I am learning English.", pa: "ਮੈਂ ਅੰਗਰੇਜ਼ੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।" },
  { en: "Today is a good day.", pa: "ਅੱਜ ਚੰਗਾ ਦਿਨ ਹੈ।" },
  { en: "I want some water.", pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।" },
  { en: "The cat is sleeping.", pa: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।" },
  { en: "The sun is bright.", pa: "ਸੂਰਜ ਤੇਜ਼ ਹੈ।" },

  { en: "Open the window, please.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਖਿੜਕੀ ਖੋਲ੍ਹੋ।" },
  { en: "I see a small bird.", pa: "ਮੈਂ ਇੱਕ ਛੋਟਾ ਪੰਛੀ ਵੇਖਦਾ ਹਾਂ।" },
  { en: "We are going home.", pa: "ਅਸੀਂ ਘਰ ਜਾ ਰਹੇ ਹਾਂ।" },
  { en: "I have two pencils.", pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਪੈਂਸਿਲ ਹਨ।" },
  { en: "My bag is blue.", pa: "ਮੇਰਾ ਬੈਗ ਨੀਲਾ ਹੈ।" },

  { en: "I like to read.", pa: "ਮੈਨੂੰ ਪੜ੍ਹਨਾ ਪਸੰਦ ਹੈ।" },
  { en: "He can run fast.", pa: "ਉਹ ਤੇਜ਼ ਦੌੜ ਸਕਦਾ ਹੈ।" },
  { en: "She is very kind.", pa: "ਉਹ ਬਹੁਤ ਦਇਆਾਲੂ ਹੈ।" },
  { en: "We play after school.", pa: "ਅਸੀਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਖੇਡਦੇ ਹਾਂ।" },
  { en: "I am happy today.", pa: "ਮੈਂ ਅੱਜ ਖੁਸ਼ ਹਾਂ।" },

  { en: "Do you have a question?", pa: "ਕੀ ਤੇਰਾ ਕੋਈ ਸਵਾਲ ਹੈ?" },
  { en: "I will call you later.", pa: "ਮੈਂ ਤੈਨੂੰ ਬਾਅਦ ਵਿੱਚ ਫ਼ੋਨ ਕਰਾਂਗਾ।" },
  { en: "Please speak slowly.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।" },
  { en: "I forgot my keys.", pa: "ਮੈਂ ਆਪਣੀਆਂ ਚਾਬੀਆਂ ਭੁੱਲ ਗਿਆ।" },
  { en: "The food is hot.", pa: "ਖਾਣਾ ਗਰਮ ਹੈ।" },

  { en: "I need a new notebook.", pa: "ਮੈਨੂੰ ਨਵੀਂ ਕਾਪੀ ਚਾਹੀਦੀ ਹੈ।" },
  { en: "The bus is coming.", pa: "ਬੱਸ ਆ ਰਹੀ ਹੈ।" },
  { en: "We are in a hurry.", pa: "ਅਸੀਂ ਜਲਦੀ ਵਿੱਚ ਹਾਂ।" },
  { en: "This is my favorite game.", pa: "ਇਹ ਮੇਰੀ ਮਨਪਸੰਦ ਖੇਡ ਹੈ।" },
  { en: "I will try again.", pa: "ਮੈਂ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ।" },

  { en: "I can do it.", pa: "ਮੈਂ ਕਰ ਸਕਦਾ ਹਾਂ।" },
  { en: "Please be careful.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਨਾਲ ਰਹੋ।" },
  { en: "We are practicing now.", pa: "ਅਸੀਂ ਹੁਣ ਅਭਿਆਸ ਕਰ ਰਹੇ ਹਾਂ।" },
  { en: "I like this song.", pa: "ਮੈਨੂੰ ਇਹ ਗਾਣਾ ਪਸੰਦ ਹੈ।" },
  { en: "See you tomorrow.", pa: "ਕੱਲ੍ਹ ਮਿਲਾਂਗੇ।" }
];
