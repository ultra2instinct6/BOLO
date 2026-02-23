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
  { en: "See you tomorrow.", pa: "ਕੱਲ੍ਹ ਮਿਲਾਂਗੇ।" },

  // --- Grammar + parts of speech (short/medium prompts) ---
  { en: "Nouns name people, places, and things.", pa: "Noun ਲੋਕਾਂ, ਥਾਵਾਂ, ਅਤੇ ਚੀਜ਼ਾਂ ਦੇ ਨਾਮ ਹੁੰਦੇ ਹਨ।" },
  { en: "A verb shows action or a state.", pa: "Verb ਕਰਮ ਜਾਂ ਹਾਲਤ ਦੱਸਦਾ ਹੈ।" },
  { en: "An adjective describes a noun.", pa: "Adjective noun ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ।" },
  { en: "An adverb describes a verb.", pa: "Adverb verb ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।" },
  { en: "A pronoun replaces a noun.", pa: "Pronoun noun ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।" },

  { en: "Subject + verb + object.", pa: "Subject + verb + object." },
  { en: "I read a book.", pa: "ਮੈਂ ਇੱਕ ਕਿਤਾਬ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ।" },
  { en: "She writes a message.", pa: "ਉਹ ਇੱਕ ਸੁਨੇਹਾ ਲਿਖਦੀ ਹੈ।" },
  { en: "They play in the park.", pa: "ਉਹ ਪਾਰਕ ਵਿੱਚ ਖੇਡਦੇ ਹਨ।" },
  { en: "He walks to school.", pa: "ਉਹ ਸਕੂਲ ਤੱਕ ਤੁਰ ਕੇ ਜਾਂਦਾ ਹੈ।" },

  { en: "Present tense: I eat.", pa: "Present tense: ਮੈਂ ਖਾਂਦਾ/ਖਾਂਦੀ ਹਾਂ।" },
  { en: "Past tense: I ate.", pa: "Past tense: ਮੈਂ ਖਾਧਾ/ਖਾਧੀ।" },
  { en: "Future tense: I will eat.", pa: "Future tense: ਮੈਂ ਖਾਵਾਂਗਾ/ਖਾਵਾਂਗੀ।" },
  { en: "I am eating now.", pa: "ਮੈਂ ਹੁਣ ਖਾ ਰਿਹਾ/ਰਹੀ ਹਾਂ।" },
  { en: "I was eating then.", pa: "ਮੈਂ ਉਸ ਵੇਲੇ ਖਾ ਰਿਹਾ/ਰਹੀ ਸੀ।" },

  { en: "Singular: one book.", pa: "Singular: ਇੱਕ ਕਿਤਾਬ।" },
  { en: "Plural: two books.", pa: "Plural: ਦੋ ਕਿਤਾਬਾਂ।" },
  { en: "This book is new.", pa: "ਇਹ ਕਿਤਾਬ ਨਵੀਂ ਹੈ।" },
  { en: "These books are new.", pa: "ਇਹ ਕਿਤਾਬਾਂ ਨਵੀਆਂ ਹਨ।" },

  { en: "Use a period at the end.", pa: "ਵਾਕ ਦੇ ਅੰਤ ਵਿੱਚ ਪੂਰਨ ਵਿਸਰਾਮ (.) ਲਗਾਓ।" },
  { en: "Use a question mark?", pa: "ਸਵਾਲ ਦੇ ਅੰਤ ਵਿੱਚ question mark (?) ਲਗਦਾ ਹੈ।" },
  { en: "Comma, then a space.", pa: "Comma ਤੋਂ ਬਾਅਦ ਇੱਕ space।" },
  { en: "Don't forget the apostrophe in don't.", pa: "don't ਵਿੱਚ apostrophe ਨਾ ਭੁੱਲੋ।" },

  { en: "Prepositions: in, on, under.", pa: "Prepositions: in, on, under." },
  { en: "The pencil is on the table.", pa: "ਪੈਂਸਿਲ ਮੇਜ਼ ਤੇ ਹੈ।" },
  { en: "The ball is under the chair.", pa: "ਗੇਂਦ ਕੁਰਸੀ ਹੇਠਾਂ ਹੈ।" },
  { en: "The book is in the bag.", pa: "ਕਿਤਾਬ ਬੈਗ ਵਿੱਚ ਹੈ।" },

  { en: "Articles: a, an, the.", pa: "Articles: a, an, the." },
  { en: "I saw a cat.", pa: "ਮੈਂ ਇੱਕ ਬਿੱਲੀ ਵੇਖੀ।" },
  { en: "I ate an apple.", pa: "ਮੈਂ ਇੱਕ ਸੇਬ ਖਾਧਾ/ਖਾਧੀ।" },
  { en: "The cat is sleeping.", pa: "ਬਿੱਲੀ ਸੋ ਰਹੀ ਹੈ।" },

  { en: "Make a negative: I do not know.", pa: "Negative: ਮੈਂ ਨਹੀਂ ਜਾਣਦਾ/ਜਾਣਦੀ।" },
  { en: "Make a question: Do you know?", pa: "Question: ਕੀ ਤੈਨੂੰ ਪਤਾ ਹੈ?" },
  { en: "Yes, I do.", pa: "ਹਾਂ, ਹੈ।" },
  { en: "No, I do not.", pa: "ਨਹੀਂ, ਨਹੀਂ ਹੈ।" },

  { en: "Noun: teacher. Verb: teach. Adjective: helpful.", pa: "Noun: teacher. Verb: teach. Adjective: helpful." },
  { en: "Quick words: noun, verb, adjective, adverb.", pa: "Quick words: noun, verb, adjective, adverb." },

  // --- Basic concepts (Batch 2: 30 prompts) ---
  { en: "I am here.", pa: "ਮੈਂ ਇੱਥੇ ਹਾਂ।" },
  { en: "You are there.", pa: "ਤੂੰ ਉੱਥੇ ਹੈਂ।" },
  { en: "We are together.", pa: "ਅਸੀਂ ਇਕੱਠੇ ਹਾਂ।" },
  { en: "I am on time.", pa: "ਮੈਂ ਸਮੇਂ ਤੇ ਹਾਂ।" },
  { en: "I am late today.", pa: "ਮੈਂ ਅੱਜ ਦੇਰ ਨਾਲ ਹਾਂ।" },

  { en: "This is easy.", pa: "ਇਹ ਆਸਾਨ ਹੈ।" },
  { en: "This is hard.", pa: "ਇਹ ਮੁਸ਼ਕਲ ਹੈ।" },
  { en: "Try again.", pa: "ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" },
  { en: "Slow and steady.", pa: "ਹੌਲੀ ਅਤੇ ਧੀਰਜ ਨਾਲ।" },
  { en: "One step at a time.", pa: "ਇੱਕ-ਇੱਕ ਕਦਮ।" },

  { en: "Left, right, forward, back.", pa: "ਖੱਬੇ, ਸੱਜੇ, ਅੱਗੇ, ਪਿੱਛੇ।" },
  { en: "Up and down.", pa: "ਉੱਪਰ ਅਤੇ ਹੇਠਾਂ।" },
  { en: "Near and far.", pa: "ਨੇੜੇ ਅਤੇ ਦੂਰ।" },
  { en: "Open and close.", pa: "ਖੋਲ੍ਹੋ ਅਤੇ ਬੰਦ ਕਰੋ।" },
  { en: "Start and stop.", pa: "ਸ਼ੁਰੂ ਅਤੇ ਰੋਕੋ।" },

  { en: "Colors: red, blue, green.", pa: "ਰੰਗ: ਲਾਲ, ਨੀਲਾ, ਹਰਾ।" },
  { en: "My shirt is blue.", pa: "ਮੇਰੀ ਕਮੀਜ਼ ਨੀਲੀ ਹੈ।" },
  { en: "The sky is blue.", pa: "ਅਸਮਾਨ ਨੀਲਾ ਹੈ।" },
  { en: "The grass is green.", pa: "ਘਾਹ ਹਰਾ ਹੈ।" },
  { en: "The apple is red.", pa: "ਸੇਬ ਲਾਲ ਹੈ।" },

  { en: "Numbers: one, two, three.", pa: "ਅੰਕ: ਇੱਕ, ਦੋ, ਤਿੰਨ।" },
  { en: "I have two hands.", pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਹੱਥ ਹਨ।" },
  { en: "I have ten fingers.", pa: "ਮੇਰੇ ਕੋਲ ਦਸ ਉਂਗਲਾਂ ਹਨ।" },
  { en: "Count slowly: 1, 2, 3.", pa: "ਹੌਲੀ ਗਿਣੋ: 1, 2, 3।" },
  { en: "Add and subtract.", pa: "ਜੋੜੋ ਅਤੇ ਘਟਾਓ।" },

  { en: "Today is Monday.", pa: "ਅੱਜ ਸੋਮਵਾਰ ਹੈ।" },
  { en: "Tomorrow is Tuesday.", pa: "ਕੱਲ੍ਹ ਮੰਗਲਵਾਰ ਹੈ।" },
  { en: "Morning, afternoon, night.", pa: "ਸਵੇਰ, ਦੁਪਹਿਰ, ਰਾਤ।" },
  { en: "Please and thank you.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਤੇ ਧੰਨਵਾਦ।" },
  { en: "Hello! How are you?", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?" },

  // --- Story-inspired prompts (Bundle 1: 30 prompts) ---
  { en: "Today my sister and I go to the park.", pa: "ਅੱਜ ਮੈਂ ਅਤੇ ਮੇਰੀ ਭੈਣ ਪਾਰਕ ਜਾਂਦੇ ਹਾਂ।" },
  { en: "The park looks big and green.", pa: "ਪਾਰਕ ਵੱਡਾ ਅਤੇ ਹਰਾ ਲੱਗਦਾ ਹੈ।" },
  { en: "Kids play on the swings and the slide.", pa: "ਬੱਚੇ ਝੂਲਿਆਂ ਅਤੇ ਫਿਸਲਪੱਟੀ ਤੇ ਖੇਡਦੇ ਹਨ।" },
  { en: "A friendly dog walks by and wags its tail.", pa: "ਇੱਕ ਪਿਆਰਾ ਕੁੱਤਾ ਨੇੜੇ ਤੁਰਦਾ ਹੈ ਅਤੇ ਪੁੱਛ ਹਿਲਾਉਂਦਾ ਹੈ।" },
  { en: "After rain, the grass feels wet.", pa: "ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਘਾਹ ਭਿੱਜਾ ਲੱਗਦਾ ਹੈ।" },
  { en: "We hear birds in the trees.", pa: "ਅਸੀਂ ਰੁੱਖਾਂ ਵਿੱਚ ਪੰਛੀਆਂ ਦੀਆਂ ਆਵਾਜ਼ਾਂ ਸੁਣਦੇ ਹਾਂ।" },
  { en: "Before we go home, we drink water.", pa: "ਘਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਪਾਣੀ ਪੀਂਦੇ ਹਾਂ।" },

  { en: "On Monday, I wake up early and wash my face.", pa: "ਸੋਮਵਾਰ ਨੂੰ ਮੈਂ ਜਲਦੀ ਉੱਠਦਾ/ਉੱਠਦੀ ਹਾਂ ਅਤੇ ਮੂੰਹ ਧੋਂਦਾ/ਧੋਂਦੀ ਹਾਂ।" },
  { en: "I put my books in my bag.", pa: "ਮੈਂ ਆਪਣੀਆਂ ਕਿਤਾਬਾਂ ਬੈਗ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।" },
  { en: "My friend meets me near the corner.", pa: "ਮੇਰਾ ਦੋਸਤ ਮੈਨੂੰ ਮੋੜ ਦੇ ਨੇੜੇ ਮਿਲਦਾ ਹੈ।" },
  { en: "We walk to school together.", pa: "ਅਸੀਂ ਇਕੱਠੇ ਸਕੂਲ ਤੁਰਕੇ ਜਾਂਦੇ ਹਾਂ।" },
  { en: "We stand in a line and say good morning.", pa: "ਅਸੀਂ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਹਿੰਦੇ ਹਾਂ।" },
  { en: "The teacher writes words on the board.", pa: "ਅਧਿਆਪਕ/ਅਧਿਆਪਕਾ ਬੋਰਡ ਤੇ ਸ਼ਬਦ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ।" },
  { en: "At lunch, I share an apple.", pa: "ਦੁਪਹਿਰ ਨੂੰ ਮੈਂ ਇੱਕ ਸੇਬ ਸਾਂਝਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।" },
  { en: "In math, we count coins.", pa: "ਗਣਿਤ ਵਿੱਚ ਅਸੀਂ ਸਿੱਕੇ ਗਿਣਦੇ ਹਾਂ।" },
  { en: "After school, I go home and do homework.", pa: "ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਮੈਂ ਘਰ ਜਾ ਕੇ ਘਰ ਦਾ ਕੰਮ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।" },

  { en: "On Saturday, I cleaned my room.", pa: "ਸ਼ਨੀਵਾਰ ਨੂੰ ਮੈਂ ਆਪਣਾ ਕਮਰਾ ਸਾਫ਼ ਕੀਤਾ।" },
  { en: "I folded my clothes neatly.", pa: "ਮੈਂ ਆਪਣੇ ਕੱਪੜੇ ਸਾਫ਼-ਸੁਥਰੇ ਮੋੜੇ।" },
  { en: "I helped my dad wash the car.", pa: "ਮੈਂ ਪਾਪਾ ਦੀ ਗੱਡੀ ਧੋਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ।" },
  { en: "The water was cold, but we laughed.", pa: "ਪਾਣੀ ਠੰਢਾ ਸੀ, ਪਰ ਅਸੀਂ ਹੱਸਦੇ ਰਹੇ।" },
  { en: "We played a board game and ate popcorn.", pa: "ਅਸੀਂ ਬੋਰਡ ਗੇਮ ਖੇਡੀ ਅਤੇ ਪੌਪਕੌਰਨ ਖਾਧਾ।" },
  { en: "We walked to the store and bought milk.", pa: "ਅਸੀਂ ਦੁਕਾਨ ਤੁਰਕੇ ਗਏ ਅਤੇ ਦੁੱਧ ਲਿਆ।" },
  { en: "I carried the bag carefully.", pa: "ਮੈਂ ਥੈਲਾ ਧਿਆਨ ਨਾਲ ਫੜਿਆ।" },

  { en: "My mother cooks dinner, and we eat together.", pa: "ਮੇਰੀ ਮਾਂ ਖਾਣਾ ਬਣਾਉਂਦੀ ਹੈ, ਅਤੇ ਅਸੀਂ ਇਕੱਠੇ ਖਾਂਦੇ ਹਾਂ।" },
  { en: "My father tells funny stories.", pa: "ਮੇਰੇ ਪਿਤਾ ਮਜ਼ੇਦਾਰ ਕਹਾਣੀਆਂ ਸੁਣਾਉਂਦੇ ਹਨ।" },
  { en: "Grandma gives me a warm hug.", pa: "ਦਾਦੀ/ਨਾਨੀ ਮੈਨੂੰ ਗਰਮ ਗਲੇ ਲਾਉਂਦੀ ਹੈ।" },
  { en: "Grandpa fixes my toy car.", pa: "ਦਾਦਾ/ਨਾਨਾ ਮੇਰੀ ਖਿਡੌਣਾ ਗੱਡੀ ਠੀਕ ਕਰਦਾ ਹੈ।" },

  { en: "Tomorrow I will visit my aunt near the library.", pa: "ਕੱਲ੍ਹ ਮੈਂ ਆਪਣੀ ਮਾਸੀ ਨੂੰ ਮਿਲਣ ਜਾਵਾਂਗਾ/ਜਾਵਾਂਗੀ ਜੋ ਪੁਸਤਕਾਲੇ ਦੇ ਨੇੜੇ ਰਹਿੰਦੀ ਹੈ।" },
  { en: "I will bring my backpack and water bottle.", pa: "ਮੈਂ ਆਪਣਾ ਬੈਗ ਅਤੇ ਪਾਣੀ ਦੀ ਬੋਤਲ ਲੈ ਕੇ ਜਾਵਾਂਗਾ/ਜਾਵਾਂਗੀ।" },
  { en: "We will read new books together.", pa: "ਅਸੀਂ ਇਕੱਠੇ ਨਵੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹਾਂਗੇ/ਪੜ੍ਹਾਂਗੀਆਂ।" },
  { en: "At the bakery, I can choose one cookie.", pa: "ਬੇਕਰੀ ਤੋਂ ਮੈਂ ਇੱਕ ਬਿਸਕੁਟ ਚੁਣ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।" },
  { en: "In the evening, I wash tomatoes and cut cucumber.", pa: "ਸ਼ਾਮ ਨੂੰ ਮੈਂ ਟਮਾਟਰ ਧੋਂਦਾ/ਧੋਂਦੀ ਹਾਂ ਅਤੇ ਖੀਰਾ ਕੱਟਦਾ/ਕੱਟਦੀ ਹਾਂ।" },

  // --- Time Trial-safe (longer) prompts: more consistent difficulty ---
  { en: "When you type, focus on accuracy first; speed will come later with practice.", pa: "ਜਦੋਂ ਤੁਸੀਂ ਟਾਈਪ ਕਰੋ, ਪਹਿਲਾਂ ਸਹੀਪਨ ਤੇ ਧਿਆਨ ਦਿਓ; ਰਫ਼ਤਾਰ ਬਾਅਦ ਵਿੱਚ ਆ ਜਾਏਗੀ।" },
  { en: "If you make a mistake, pause, fix it calmly, and continue without rushing.", pa: "ਜੇ ਗਲਤੀ ਹੋਵੇ, ਰੁਕੋ, ਸ਼ਾਂਤੀ ਨਾਲ ਠੀਕ ਕਰੋ, ਅਤੇ ਜਲਦੀ ਕੀਤੇ ਬਿਨਾਂ ਜਾਰੀ ਰੱਖੋ।" },
  { en: "Type one space between words, and keep your eyes moving forward on the sentence.", pa: "ਸ਼ਬਦਾਂ ਵਿਚਕਾਰ ਇੱਕ ਸਪੇਸ ਟਾਈਪ ਕਰੋ, ਅਤੇ ਅੱਖਾਂ ਵਾਕ ਵਿੱਚ ਅੱਗੇ ਵਧਾਉਂਦੇ ਰਹੋ।" },
  { en: "I will try again, and I will keep my spelling and spacing clean every time.", pa: "ਮੈਂ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਅਤੇ ਹਰ ਵਾਰੀ spelling ਅਤੇ spacing ਸਾਫ਼ ਰੱਖਾਂਗਾ/ਰੱਖਾਂਗੀ।" },
  { en: "Today we learn a small rule, and we use it in a sentence to remember it.", pa: "ਅੱਜ ਅਸੀਂ ਇੱਕ ਛੋਟਾ ਨਿਯਮ ਸਿੱਖਦੇ ਹਾਂ, ਅਤੇ ਉਸਨੂੰ ਵਾਕ ਵਿੱਚ ਵਰਤ ਕੇ ਯਾਦ ਕਰਦੇ ਹਾਂ।" },
  { en: "Please speak slowly so I can understand, and I will answer with a full sentence.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ ਤਾਂ ਕਿ ਮੈਂ ਸਮਝ ਸਕਾਂ, ਅਤੇ ਮੈਂ ਪੂਰੇ ਵਾਕ ਨਾਲ ਜਵਾਬ ਦੇਵਾਂਗਾ/ਦੇਵਾਂਗੀ।" },
  { en: "We will eat dinner at seven, and then we will read a short story together.", pa: "ਅਸੀਂ ਸੱਤ ਵਜੇ ਰਾਤ ਦਾ ਖਾਣਾ ਖਾਵਾਂਗੇ, ਅਤੇ ਫਿਰ ਇਕ ਛੋਟੀ ਕਹਾਣੀ ਇਕੱਠੇ ਪੜ੍ਹਾਂਗੇ।" },
  { en: "The bus is coming soon, so I will stand in line and wait with patience.", pa: "ਬੱਸ ਜਲਦੀ ਆ ਰਹੀ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹ ਕੇ ਧੀਰਜ ਨਾਲ ਉਡੀਕ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।" },
  { en: "She is going to school today because she wants to learn and do her best.", pa: "ਉਹ ਅੱਜ ਸਕੂਲ ਜਾ ਰਹੀ ਹੈ ਕਿਉਂਕਿ ਉਹ ਸਿੱਖਣਾ ਅਤੇ ਆਪਣਾ ਵਧੀਆ ਕਰਨਾ ਚਾਹੁੰਦੀ ਹੈ।" },
  { en: "I forgot my keys, but I will check my bag and my pocket before I worry.", pa: "ਮੈਂ ਆਪਣੀਆਂ ਚਾਬੀਆਂ ਭੁੱਲ ਗਿਆ/ਗਈ, ਪਰ ਚਿੰਤਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਬੈਗ ਅਤੇ ਜੇਬ ਚੈੱਕ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।" },
  { en: "My favorite game is fun, but I also want to practice reading and writing daily.", pa: "ਮੇਰੀ ਮਨਪਸੰਦ ਖੇਡ ਮਜ਼ੇਦਾਰ ਹੈ, ਪਰ ਮੈਂ ਰੋਜ਼ ਪੜ੍ਹਨ ਅਤੇ ਲਿਖਣ ਦਾ ਅਭਿਆਸ ਵੀ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।" },
  { en: "We are in a hurry, but we can still be careful and make fewer mistakes.", pa: "ਅਸੀਂ ਜਲਦੀ ਵਿੱਚ ਹਾਂ, ਪਰ ਫਿਰ ਵੀ ਧਿਆਨ ਨਾਲ ਰਹਿ ਕੇ ਘੱਟ ਗਲਤੀਆਂ ਕਰ ਸਕਦੇ ਹਾਂ।" },

  // --- Vocabulary expansion prompts (child-friendly; bilingual) ---
  { en: "The animal is friendly and likes to play.", pa: "ਉਹ ਜਾਨਵਰ ਦੋਸਤਾਨਾ ਹੈ ਅਤੇ ਖੇਡਣਾ ਪਸੰਦ ਕਰਦਾ ਹੈ।" },
  { en: "I have a red balloon at the fair.", pa: "ਮੇਰੇ ਕੋਲ ਮੇਲੇ ਵਿੱਚ ਲਾਲ ਗੁਬਾਰਾ ਹੈ।" },
  { en: "My bicycle is blue and very fast.", pa: "ਮੇਰੀ ਸਾਈਕਲ ਨੀਲੀ ਹੈ ਅਤੇ ਬਹੁਤ ਤੇਜ਼ ਹੈ।" },
  { en: "Today is my birthday, and I am very happy.", pa: "ਅੱਜ ਮੇਰਾ ਜਨਮਦਿਨ ਹੈ, ਅਤੇ ਮੈਂ ਬਹੁਤ ਖੁਸ਼ ਹਾਂ।" },
  { en: "I got one candy after lunch.", pa: "ਮੈਨੂੰ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਇੱਕ ਟੌਫੀ ਮਿਲੀ।" },
  { en: "We saw a big castle in the storybook.", pa: "ਅਸੀਂ ਕਹਾਣੀ ਦੀ ਕਿਤਾਬ ਵਿੱਚ ਇੱਕ ਵੱਡਾ ਕਿਲ੍ਹਾ ਵੇਖਿਆ।" },
  { en: "Please share your crayons with your friend.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਕ੍ਰੇਅਨ ਆਪਣੇ ਦੋਸਤ ਨਾਲ ਸਾਂਝੇ ਕਰੋ।" },
  { en: "A dolphin can jump high in the water.", pa: "ਡੋਲਫਿਨ ਪਾਣੀ ਵਿੱਚ ਉੱਚਾ ਛਾਲ ਮਾਰ ਸਕਦੀ ਹੈ।" },
  { en: "We planted flowers in the garden.", pa: "ਅਸੀਂ ਬਾਗ ਵਿੱਚ ਫੁੱਲ ਲਗਾਏ।" },
  { en: "My kite flies high in the sky.", pa: "ਮੇਰੀ ਪਤੰਗ ਅਸਮਾਨ ਵਿੱਚ ਉੱਚੀ ਉੱਡਦੀ ਹੈ।" },
  { en: "The moon is bright tonight.", pa: "ਅੱਜ ਰਾਤ ਚੰਦ ਚਮਕਦਾ ਹੈ।" },
  { en: "A rainbow appears after the rain.", pa: "ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਇੰਦ੍ਰਧਨੁਸ਼ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।" },
  { en: "The toy rocket goes up quickly.", pa: "ਖਿਡੌਣੇ ਵਾਲਾ ਰਾਕੇਟ ਜਲਦੀ ਉੱਪਰ ਜਾਂਦਾ ਹੈ।" },
  { en: "I sleep with my teddy every night.", pa: "ਮੈਂ ਹਰ ਰਾਤ ਆਪਣੇ ਟੈੱਡੀ ਭਾਲੂ ਨਾਲ ਸੌਂਦਾ/ਸੌਂਦੀ ਹਾਂ।" },
  { en: "This puzzle has many small pieces.", pa: "ਇਸ ਪਹੇਲੀ ਵਿੱਚ ਕਈ ਛੋਟੇ ਟੁਕੜੇ ਹਨ।" },
  { en: "I ate a sandwich at school break.", pa: "ਮੈਂ ਸਕੂਲ ਦੀ ਛੁੱਟੀ ਵਿੱਚ ਸੈਂਡਵਿਚ ਖਾਧਾ।" },
  { en: "The blanket is warm and soft.", pa: "ਕੰਬਲ ਗਰਮ ਅਤੇ ਨਰਮ ਹੈ।" },
  { en: "Her painting is full of bright colors.", pa: "ਉਸ ਦੀ ਪੇਂਟਿੰਗ ਚਮਕੀਲੇ ਰੰਗਾਂ ਨਾਲ ਭਰੀ ਹੈ।" },
  { en: "I can see one star in the dark sky.", pa: "ਮੈਂ ਹਨੇਰੇ ਅਸਮਾਨ ਵਿੱਚ ਇੱਕ ਤਾਰਾ ਦੇਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।" },
  { en: "We play outside in the sunshine.", pa: "ਅਸੀਂ ਧੁੱਪ ਵਿੱਚ ਬਾਹਰ ਖੇਡਦੇ ਹਾਂ।" },

  // --- Vocabulary expansion prompts (themed set 2; child-friendly; bilingual) ---
  { en: "A squirrel runs up the tree quickly.", pa: "ਇੱਕ ਗਿਲਹਿਰੀ ਰੁੱਖ ਉੱਤੇ ਜਲਦੀ ਚੜ੍ਹਦੀ ਹੈ।" },
  { en: "The turtle walks slowly near the pond.", pa: "ਕੱਛੂਆ ਤਲਾਬ ਦੇ ਨੇੜੇ ਹੌਲੀ ਹੌਲੀ ਤੁਰਦਾ ਹੈ।" },
  { en: "The zebra has black and white stripes.", pa: "ਜ਼ੀਬਰਾ ਦੇ ਕਾਲੇ ਅਤੇ ਚਿੱਟੇ ਧੱਬੇ ਹੁੰਦੇ ਹਨ।" },
  { en: "The rabbit jumps across the grass.", pa: "ਖਰਗੋਸ਼ ਘਾਹ ਉੱਤੇ ਛਾਲਾਂ ਮਾਰਦਾ ਹੈ।" },
  { en: "I wrote my homework in my notebook.", pa: "ਮੈਂ ਆਪਣਾ ਘਰ ਦਾ ਕੰਮ ਆਪਣੀ ਕਾਪੀ ਵਿੱਚ ਲਿਖਿਆ।" },
  { en: "Please use an eraser to fix mistakes.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਗਲਤੀਆਂ ਠੀਕ ਕਰਨ ਲਈ ਰਬੜ ਵਰਤੋ।" },
  { en: "Draw a straight line with a ruler.", pa: "ਸਕੇਲ ਨਾਲ ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਖਿੱਚੋ।" },
  { en: "My backpack is ready for school.", pa: "ਮੇਰਾ ਬੈਕਪੈਕ ਸਕੂਲ ਲਈ ਤਿਆਰ ਹੈ।" },
  { en: "Our classroom is clean and bright.", pa: "ਸਾਡਾ ਕਲਾਸਰੂਮ ਸਾਫ਼ ਅਤੇ ਰੌਸ਼ਨ ਹੈ।" },
  { en: "We run and play in the playground.", pa: "ਅਸੀਂ ਖੇਡ ਮੈਦਾਨ ਵਿੱਚ ਦੌੜਦੇ ਅਤੇ ਖੇਡਦੇ ਹਾਂ।" },
  { en: "My pillow is soft and cozy.", pa: "ਮੇਰਾ ਤਕੀਆ ਨਰਮ ਅਤੇ ਆਰਾਮਦਾਇਕ ਹੈ।" },
  { en: "I brush my teeth with a toothbrush.", pa: "ਮੈਂ ਦੰਦਾਂ ਦਾ ਬਰਸ਼ ਨਾਲ ਆਪਣੇ ਦੰਦ ਸਾਫ਼ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।" },
  { en: "I wear slippers at home.", pa: "ਮੈਂ ਘਰ ਵਿੱਚ ਚੱਪਲਾਂ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ।" },
  { en: "The milk is cold in the fridge.", pa: "ਦੁੱਧ ਫ੍ਰਿਜ ਵਿੱਚ ਠੰਢਾ ਹੈ।" },
  { en: "Use a spoon to eat soup.", pa: "ਸੂਪ ਖਾਣ ਲਈ ਚਮਚ ਵਰਤੋ।" },
  { en: "Kindness makes everyone feel better.", pa: "ਦਇਆ ਨਾਲ ਸਭ ਨੂੰ ਚੰਗਾ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ।" },
  { en: "Be brave and try one more time.", pa: "ਬਹਾਦਰ ਬਣੋ ਅਤੇ ਇੱਕ ਵਾਰੀ ਹੋਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" },
  { en: "Use gentle hands with small pets.", pa: "ਛੋਟੇ ਪਾਲਤੂ ਜਾਨਵਰਾਂ ਨਾਲ ਨਰਮ ਹੱਥ ਵਰਤੋ।" },
  { en: "We heard laughter during the game.", pa: "ਅਸੀਂ ਖੇਡ ਦੌਰਾਨ ਹਾਸਾ ਸੁਣਿਆ।" },
  { en: "A smile can brighten the day.", pa: "ਮੁਸਕਾਨ ਦਿਨ ਨੂੰ ਚਮਕਦਾਰ ਬਣਾ ਸਕਦੀ ਹੈ।" },

  // --- Vocabulary expansion prompts (themed set 3; child-friendly; bilingual) ---
  { en: "A parrot can say funny words.", pa: "ਤੋਤਾ ਮਜ਼ੇਦਾਰ ਸ਼ਬਦ ਬੋਲ ਸਕਦਾ ਹੈ।" },
  { en: "The monkey swings from branch to branch.", pa: "ਬਾਂਦਰ ਟਾਹਣੀ ਤੋਂ ਟਾਹਣੀ ਝੂਲਦਾ ਹੈ।" },
  { en: "The lion sleeps under the tree.", pa: "ਸ਼ੇਰ ਰੁੱਖ ਹੇਠਾਂ ਸੌਂਦਾ ਹੈ।" },
  { en: "My grandparents live in a village.", pa: "ਮੇਰੇ ਦਾਦਾ-ਦਾਦੀ ਇੱਕ ਪਿੰਡ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ।" },
  { en: "The river flows near our town.", pa: "ਦਰਿਆ ਸਾਡੇ ਸ਼ਹਿਰ ਦੇ ਨੇੜੇ ਵਗਦਾ ਹੈ।" },
  { en: "We saw a mountain on our trip.", pa: "ਅਸੀਂ ਆਪਣੀ ਯਾਤਰਾ ਵਿੱਚ ਇੱਕ ਪਹਾੜ ਵੇਖਿਆ।" },
  { en: "Many birds live in the forest.", pa: "ਜੰਗਲ ਵਿੱਚ ਬਹੁਤ ਪੰਛੀ ਰਹਿੰਦੇ ਹਨ।" },
  { en: "I took a photo with my camera.", pa: "ਮੈਂ ਆਪਣੇ ਕੈਮਰੇ ਨਾਲ ਫੋਟੋ ਖਿੱਚੀ।" },
  { en: "Wear your helmet before riding.", pa: "ਸਵਾਰੀ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣਾ ਹੈਲਮੈਟ ਪਹਿਨੋ।" },
  { en: "We borrowed two books from the library.", pa: "ਅਸੀਂ ਪੁਸਤਕਾਲੇ ਤੋਂ ਦੋ ਕਿਤਾਬਾਂ ਲਈਆਂ।" },
  { en: "We waited at the bus stop in the morning.", pa: "ਅਸੀਂ ਸਵੇਰੇ ਬਸ ਅੱਡੇ ਤੇ ਉਡੀਕ ਕੀਤੀ।" },
  { en: "Use scissors carefully in art class.", pa: "ਕਲਾ ਕਲਾਸ ਵਿੱਚ ਕੈਂਚੀ ਧਿਆਨ ਨਾਲ ਵਰਤੋ।" },
  { en: "I used glue to finish my project.", pa: "ਮੈਂ ਆਪਣਾ ਪ੍ਰੋਜੈਕਟ ਪੂਰਾ ਕਰਨ ਲਈ ਗੂੰਦ ਵਰਤੀ।" },
  { en: "Write your name with a marker.", pa: "ਮਾਰਕਰ ਨਾਲ ਆਪਣਾ ਨਾਮ ਲਿਖੋ।" },
  { en: "Keep a napkin near your lunch box.", pa: "ਆਪਣੇ ਲੰਚ ਬਾਕਸ ਕੋਲ ਇੱਕ ਰੁਮਾਲ ਰੱਖੋ।" },
  { en: "Wash your hands with soap.", pa: "ਆਪਣੇ ਹੱਥ ਸਾਬਣ ਨਾਲ ਧੋਵੋ।" },
  { en: "Fill the bucket with clean water.", pa: "ਬਾਲਟੀ ਨੂੰ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ ਭਰੋ।" },
  { en: "The magnet sticks to the metal door.", pa: "ਚੁੰਬਕ ਲੋਹੇ ਦੇ ਦਰਵਾਜ਼ੇ ਨਾਲ ਚੰਬੜ ਜਾਂਦਾ ਹੈ।" },
  { en: "The coach blew a whistle to start the game.", pa: "ਖੇਡ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕੋਚ ਨੇ ਸੀਟੀ ਵਜਾਈ।" },
  { en: "We danced to the beat of the drum.", pa: "ਅਸੀਂ ਢੋਲ ਦੀ ਧੁਨ ਤੇ ਨੱਚੇ।" }

  // --- Grammar-focused longer prompts (Time Trial-friendly) ---
  ,{ en: "In a sentence, the subject tells who, the verb tells what happens, and the object receives the action.", pa: "ਵਾਕ ਵਿੱਚ subject ਦੱਸਦਾ ਹੈ ਕੌਣ, verb ਦੱਸਦਾ ਹੈ ਕੀ ਹੁੰਦਾ ਹੈ, ਅਤੇ object ਕਰਮ ਨੂੰ ਲੈਂਦਾ ਹੈ।" }
  ,{ en: "Use one clear subject and one clear verb, then add details with adjectives and prepositional phrases.", pa: "ਇੱਕ ਸਪਸ਼ਟ subject ਅਤੇ ਇੱਕ ਸਪਸ਼ਟ verb ਵਰਤੋ, ਫਿਰ adjective ਅਤੇ prepositional phrase ਨਾਲ ਵੇਰਵਾ ਜੋੜੋ।" }
  ,{ en: "To make a question, move the helping verb forward: 'Are you ready?' not 'You are ready?'.", pa: "ਸਵਾਲ ਬਣਾਉਣ ਲਈ helping verb ਅੱਗੇ ਲਿਆਓ: 'Are you ready?' ਨਾ ਕਿ 'You are ready?'." }
  ,{ en: "To make a negative, add 'not' after the helping verb: 'I am not late' and 'He is not here'.", pa: "Negative ਲਈ helping verb ਤੋਂ ਬਾਅਦ 'not' ਲਗਾਓ: 'I am not late' ਅਤੇ 'He is not here'." }
  ,{ en: "Practice clean spacing: one space after a comma, and no extra spaces before a period.", pa: "ਸਾਫ਼ spacing ਦਾ ਅਭਿਆਸ ਕਰੋ: comma ਤੋਂ ਬਾਅਦ ਇੱਕ space, ਅਤੇ period ਤੋਂ ਪਹਿਲਾਂ extra space ਨਾ ਹੋਵੇ।" }
  ,{ en: "Use simple tenses clearly: present for habits, past for finished actions, and future for plans.", pa: "tenses ਸਾਫ਼ ਰੱਖੋ: ਆਦਤ ਲਈ present, ਮੁਕੰਮਲ ਕੰਮ ਲਈ past, ਅਤੇ ਯੋਜਨਾ ਲਈ future।" }
  ,{ en: "Write short, correct sentences first; then combine two ideas with 'and' or 'but' when you are ready.", pa: "ਪਹਿਲਾਂ ਛੋਟੇ ਅਤੇ ਸਹੀ ਵਾਕ ਲਿਖੋ; ਫਿਰ ਤਿਆਰ ਹੋਣ ਤੇ 'and' ਜਾਂ 'but' ਨਾਲ ਦੋ ਵਿਚਾਰ ਜੋੜੋ।" }
  ,{ en: "Use prepositions to show place and time: in the morning, on Monday, at seven, under the table.", pa: "ਥਾਂ ਅਤੇ ਸਮਾਂ ਦੱਸਣ ਲਈ preposition ਵਰਤੋ: in the morning, on Monday, at seven, under the table।" }
  ,{ en: "Remember: adjectives describe nouns, and adverbs describe verbs, so choose the word that fits the job.", pa: "ਯਾਦ ਰੱਖੋ: adjectives noun ਨੂੰ, ਅਤੇ adverbs verb ਨੂੰ describe ਕਰਦੇ ਹਨ; ਇਸ ਲਈ ਸਹੀ ਕੰਮ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।" }
  ,{ en: "Type slowly enough to stay accurate, and read the whole sentence so punctuation does not surprise you.", pa: "ਇੰਨਾ ਹੌਲੀ ਟਾਈਪ ਕਰੋ ਕਿ ਸਹੀਪਨ ਬਣਿਆ ਰਹੇ, ਅਤੇ ਪੂਰਾ ਵਾਕ ਪੜ੍ਹੋ ਤਾਂ punctuation ਅਚਾਨਕ ਨਾ ਲੱਗੇ।" }
];

// Additional pool for Practice Mode packs (bilingual).
// Schema: { en: string, pa: string }
// Designed for ages ~6–10: short, modern, clean grammar, kid-safe.
var TYPING_PROMPTS_SHORT_SENTENCES = [
  { en: "I can do this.", pa: "ਮੈਂ ਇਹ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।" },
  { en: "Let me try again.", pa: "ਮੈਨੂੰ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਦਿਓ।" },
  { en: "I am getting better.", pa: "ਮੈਂ ਹੋਰ ਚੰਗਾ/ਚੰਗੀ ਹੋ ਰਿਹਾ/ਰਹੀ ਹਾਂ।" },
  { en: "I will do my best.", pa: "ਮੈਂ ਆਪਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।" },
  { en: "Please give me a minute.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇੱਕ ਮਿੰਟ ਦਿਓ।" },
  { en: "I need a short break.", pa: "ਮੈਨੂੰ ਥੋੜ੍ਹਾ ਵਿਸਰਾਮ ਚਾਹੀਦਾ ਹੈ।" },
  { en: "I can stay calm.", pa: "ਮੈਂ ਸ਼ਾਂਤ ਰਹਿ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।" },
  { en: "I can focus now.", pa: "ਮੈਂ ਹੁਣ ਧਿਆਨ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।" },
  { en: "I will go slow and careful.", pa: "ਮੈਂ ਹੌਲੀ ਅਤੇ ਧਿਆਨ ਨਾਲ ਜਾਵਾਂਗਾ/ਜਾਵਾਂਗੀ।" },
  { en: "I will not give up.", pa: "ਮੈਂ ਹਾਰ ਨਹੀਂ ਮੰਨਾਂਗਾ/ਮੰਨਾਂਗੀ।" },

  { en: "The small dog runs fast.", pa: "ਛੋਟਾ ਕੁੱਤਾ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ।" },
  { en: "The bright sun shines today.", pa: "ਅੱਜ ਚਮਕਦਾ ਸੂਰਜ ਚਮਕ ਰਿਹਾ ਹੈ।" },
  { en: "The red ball rolls away.", pa: "ਲਾਲ ਗੇਂਦ ਲੁੜਕ ਕੇ ਦੂਰ ਚਲੀ ਜਾਂਦੀ ਹੈ।" },
  { en: "The quiet cat sleeps here.", pa: "ਸ਼ਾਂਤ ਬਿੱਲੀ ਇੱਥੇ ਸੋਂਦੀ ਹੈ।" },
  { en: "The tall tree sways softly.", pa: "ਉੱਚਾ ਰੁੱਖ ਹੌਲੀ ਹੌਲੀ ਝੂਲਦਾ ਹੈ।" },
  { en: "A happy child smiles.", pa: "ਖੁਸ਼ ਬੱਚਾ ਮੁਸਕਰਾਉਂਦਾ ਹੈ।" },
  { en: "The funny story makes me laugh.", pa: "ਮਜ਼ੇਦਾਰ ਕਹਾਣੀ ਮੈਨੂੰ ਹਸਾਉਂਦੀ ਹੈ।" },

  { en: "I read a book.", pa: "ਮੈਂ ਇੱਕ ਕਿਤਾਬ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ।" },
  { en: "She writes a short note.", pa: "ਉਹ ਇੱਕ ਛੋਟਾ ਨੋਟ ਲਿਖਦੀ ਹੈ।" },
  { en: "He plays after school.", pa: "ਉਹ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਖੇਡਦਾ ਹੈ।" },
  { en: "We walk to the park.", pa: "ਅਸੀਂ ਪਾਰਕ ਤੱਕ ਤੁਰ ਕੇ ਜਾਂਦੇ ਹਾਂ।" },
  { en: "They sit near the window.", pa: "ਉਹ ਖਿੜਕੀ ਦੇ ਨੇੜੇ ਬੈਠਦੇ ਹਨ।" },
  { en: "I drink water after lunch.", pa: "ਮੈਂ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਪਾਣੀ ਪੀਂਦਾ/ਪੀਂਦੀ ਹਾਂ।" },

  { en: "The pencil is on the table.", pa: "ਪੈਂਸਿਲ ਮੇਜ਼ ਤੇ ਹੈ।" },
  { en: "The ball is under the chair.", pa: "ਗੇਂਦ ਕੁਰਸੀ ਹੇਠਾਂ ਹੈ।" },
  { en: "The book is in my bag.", pa: "ਕਿਤਾਬ ਮੇਰੇ ਬੈਗ ਵਿੱਚ ਹੈ।" },
  { en: "Put the book on the shelf.", pa: "ਕਿਤਾਬ ਨੂੰ ਰੈਕ ਉੱਤੇ ਰੱਖੋ।" },
  { en: "Take the pencil from the box.", pa: "ਡੱਬੇ ਵਿੱਚੋਂ ਪੈਂਸਿਲ ਲਵੋ।" },
  { en: "Walk between the cones.", pa: "ਕੋਨਾਂ ਦੇ ਵਿਚਕਾਰ ਤੁਰੋ।" },

  { en: "Because I practiced, I improved.", pa: "ਕਿਉਂਕਿ ਮੈਂ ਅਭਿਆਸ ਕੀਤਾ, ਮੈਂ ਸੁਧਰ ਗਿਆ/ਗਈ।" },
  { en: "If I listen, I learn.", pa: "ਜੇ ਮੈਂ ਸੁਣਾਂ, ਮੈਂ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹਾਂ।" },
  { en: "I wanted to play, but I waited.", pa: "ਮੈਂ ਖੇਡਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਸੀ, ਪਰ ਮੈਂ ਉਡੀਕ ਕੀਤੀ।" },
  { en: "I will try, and I will practice.", pa: "ਮੈਂ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਅਤੇ ਮੈਂ ਅਭਿਆਸ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।" },

  { en: "Can you help me, please?", pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ, ਕਿਰਪਾ ਕਰਕੇ?" },
  { en: "What is the next step?", pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?" },
  { en: "Where is my notebook?", pa: "ਮੇਰੀ ਕਾਪੀ ਕਿੱਥੇ ਹੈ?" },
  { en: "Which pencil is mine?", pa: "ਕਿਹੜੀ ਪੈਂਸਿਲ ਮੇਰੀ ਹੈ?" },

  { en: "I will share with my friend.", pa: "ਮੈਂ ਆਪਣੇ ਦੋਸਤ ਨਾਲ ਸਾਂਝਾ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।" },
  { en: "We can take turns.", pa: "ਅਸੀਂ ਵਾਰੀ ਵਾਰੀ ਕਰ ਸਕਦੇ ਹਾਂ।" },
  { en: "Please speak slowly.", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।" },
  { en: "Thank you for helping me.", pa: "ਮੇਰੀ ਮਦਦ ਕਰਨ ਲਈ ਧੰਨਵਾਦ।" },
  { en: "It is okay to make mistakes.", pa: "ਗਲਤੀਆਂ ਕਰਨਾ ਠੀਕ ਹੈ।" },

  { en: "I clean my desk.", pa: "ਮੈਂ ਆਪਣਾ ਡੈਸਕ ਸਾਫ਼ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।" },
  { en: "I pack my bag neatly.", pa: "ਮੈਂ ਆਪਣਾ ਬੈਗ ਸਾਫ਼ ਸੁਥਰੇ ਤਰੀਕੇ ਨਾਲ ਤਿਆਰ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।" },
  { en: "I finish my homework.", pa: "ਮੈਂ ਆਪਣਾ ਘਰ ਦਾ ਕੰਮ ਮੁਕਾ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।" },
  { en: "I read before bed.", pa: "ਮੈਂ ਸੌਣ ਤੋਂ ਪਹਿਲਾਂ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ।" }
];
