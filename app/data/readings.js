var BUNDLES = [
  {
    id: 1,
    nameEn: "Book 1 · Home & Family Life",
    namePa: "ਕਿਤਾਬ 1 · ਘਰ ਅਤੇ ਪਰਿਵਾਰਕ ਜੀਵਨ",
    descEn: "Familiar home routines, people, and everyday objects.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 2,
    nameEn: "Book 2 · School & Daily Routine",
    namePa: "ਕਿਤਾਬ 2 · ਸਕੂਲ ਅਤੇ ਰੋਜ਼ਾਨਾ ਰੁਟੀਨ",
    descEn: "School actions, timetable language, and sequence words.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 3,
    nameEn: "Book 3 · Neighborhood & Community",
    namePa: "ਕਿਤਾਬ 3 · ਪੜੋਸ ਅਤੇ ਕਮਿਊਨਟੀ",
    descEn: "Places, directions, helpers, and community life.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 4,
    nameEn: "Book 4 · Feelings, Choices & Small Challenges",
    namePa: "ਕਿਤਾਬ 4 · ਭਾਵਨਾਵਾਂ, ਚੋਣਾਂ ਅਤੇ ਛੋਟੀਆਂ ਚੁਣੌਤੀਆਂ",
    descEn: "Problem-solution stories that build inference.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 5,
    nameEn: "Book 5 · Dreams, Goals & Real-World Stories",
    namePa: "ਕਿਤਾਬ 5 · ਸੁਪਨੇ, ਲਕਸ਼ ਅਤੇ ਅਸਲੀ ਕਹਾਣੀਆਂ",
    descEn: "Longer stories with richer vocabulary and mixed tenses.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 6,
    nameEn: "Book 6 · Responsibility, Safety & Growth",
    namePa: "ਕਿਤਾਬ 6 · ਜ਼ਿੰਮੇਵਾਰੀ, ਸੁਰੱਖਿਆ ਅਤੇ ਵਿਕਾਸ",
    descEn: "Applied routines, safety language, and goal-oriented actions.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 7,
    nameEn: "Book 7 · Communication, Reasoning & Confidence",
    namePa: "ਕਿਤਾਬ 7 · ਸੰਚਾਰ, ਤਰਕ ਅਤੇ ਆਤਮਵਿਸ਼ਵਾਸ",
    descEn: "Conversation skills, explanations, comparisons, and thoughtful choices.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 8,
    nameEn: "Book 8 · Advanced Communication & Real-Life Decisions",
    namePa: "ਕਿਤਾਬ 8 · ਉੱਚ ਸੰਚਾਰ ਅਤੇ ਅਸਲ ਜੀਵਨ ਫ਼ੈਸਲੇ",
    descEn: "Deeper discussion, reasoning, and confident real-world language use.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 9,
    nameEn: "Book 9 · Mastery & Independent Communication",
    namePa: "ਕਿਤਾਬ 9 · ਨਿਪੁੰਨਤਾ ਅਤੇ ਸੁਤੰਤਰ ਸੰਚਾਰ",
    descEn: "Independent expression, stronger reasoning, and real-world communication mastery.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  },
  {
    id: 10,
    nameEn: "Book 10 · Capstone Communication & Leadership",
    namePa: "ਕਿਤਾਬ 10 · ਕੈਪਸਟੋਨ ਸੰਚਾਰ ਅਤੇ ਨੇਤ੍ਰਿਤਵ",
    descEn: "Capstone-level communication, confident decisions, and real-world leadership language.",
    masteryThreshold: 0.7,
    requiredPassages: 10
  }
];

var READINGS = [];

var BOOK1_CUSTOM_STORIES = [
  {
    "storyId": "B1_S01",
    "bundleId": 1,
    "orderInBundle": 1,
    "titleEn": "Book 1 · Story 1: My Big House",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 1: ਮੇਰਾ ਵੱਡਾ ਘਰ",
    "englishStory": "Panel 1 (Intro): I am at home.\nPanel 2 (Body): Mom and dad open the door.\nPanel 3 (Body): Sister and brother stand by the window.\nPanel 4 (Body): Grandma and grandpa help the baby.\nPanel 5 (Conclusion): My house is big. My room is small.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਘਰ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮਾਂ ਅਤੇ ਪਿਉ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦੇ ਹਨ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਭੈਣ ਅਤੇ ਭਰਾ ਖਿੜਕੀ ਦੇ ਕੋਲ ਖੜ੍ਹੇ ਹਨ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਦਾਦੀ ਅਤੇ ਦਾਦਾ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੇਰਾ ਘਰ ਵੱਡਾ ਹੈ। ਮੇਰਾ ਕਮਰਾ ਛੋਟਾ ਹੈ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "home",
          "pa": "ਘਰ"
        },
        {
          "en": "mom",
          "pa": "ਮਾਂ"
        },
        {
          "en": "dad",
          "pa": "ਪਿਉ"
        },
        {
          "en": "door",
          "pa": "ਦਰਵਾਜ਼ਾ"
        },
        {
          "en": "sister",
          "pa": "ਭੈਣ"
        },
        {
          "en": "brother",
          "pa": "ਭਰਾ"
        },
        {
          "en": "window",
          "pa": "ਖਿੜਕੀ"
        },
        {
          "en": "grandma",
          "pa": "ਦਾਦੀ"
        },
        {
          "en": "grandpa",
          "pa": "ਦਾਦਾ"
        },
        {
          "en": "baby",
          "pa": "ਬੱਚਾ"
        },
        {
          "en": "house",
          "pa": "ਘਰ"
        },
        {
          "en": "room",
          "pa": "ਕਮਰਾ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "open",
          "pa": "ਖੋਲ੍ਹਣਾ"
        },
        {
          "en": "stand",
          "pa": "ਖੜ੍ਹਾ ਹੋਣਾ"
        },
        {
          "en": "help",
          "pa": "ਮਦਦ ਕਰਨਾ"
        },
        {
          "en": "is",
          "pa": "ਹੈ"
        }
      ],
      "adjectives": [
        {
          "en": "big",
          "pa": "ਵੱਡਾ"
        },
        {
          "en": "small",
          "pa": "ਛੋਟਾ"
        }
      ],
      "prepositions": [
        {
          "en": "by",
          "pa": "ਦੇ ਕੋਲ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "home",
          "school",
          "park"
        ],
        "choicesPa": [
          "ਘਰ",
          "ਸਕੂਲ",
          "ਪਾਰਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says, “I am at home.”",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਘਰ ਵਿੱਚ ਹਾਂ।”"
      },
      {
        "question": "Who opens the door?",
        "questionPa": "ਦਰਵਾਜ਼ਾ ਕੌਣ ਖੋਲ੍ਹਦਾ ਹੈ?",
        "choices": [
          "mom and dad",
          "sister and brother",
          "the baby"
        ],
        "choicesPa": [
          "ਮਾਂ ਅਤੇ ਪਿਉ",
          "ਭੈਣ ਅਤੇ ਭਰਾ",
          "ਬੱਚਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “Mom and dad open the door.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮਾਂ ਅਤੇ ਪਿਉ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦੇ ਹਨ।”"
      },
      {
        "question": "Where do sister and brother stand?",
        "questionPa": "ਭੈਣ ਅਤੇ ਭਰਾ ਕਿੱਥੇ ਖੜ੍ਹੇ ਹਨ?",
        "choices": [
          "by the window",
          "on the bed",
          "in the bathroom"
        ],
        "choicesPa": [
          "ਖਿੜਕੀ ਦੇ ਕੋਲ",
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਬਾਥਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they stand by the window.",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਉਹ ਖਿੜਕੀ ਦੇ ਕੋਲ ਖੜ੍ਹੇ ਹਨ।"
      },
      {
        "question": "Who helps the baby?",
        "questionPa": "ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "grandma and grandpa",
          "mom and dad",
          "sister and brother"
        ],
        "choicesPa": [
          "ਦਾਦੀ ਅਤੇ ਦਾਦਾ",
          "ਮਾਂ ਅਤੇ ਪਿਉ",
          "ਭੈਣ ਅਤੇ ਭਰਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “Grandma and grandpa help the baby.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਦਾਦੀ ਅਤੇ ਦਾਦਾ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।”"
      },
      {
        "question": "Is the house big or small?",
        "questionPa": "ਘਰ ਵੱਡਾ ਹੈ ਜਾਂ ਛੋਟਾ?",
        "choices": [
          "big",
          "small",
          "cold"
        ],
        "choicesPa": [
          "ਵੱਡਾ",
          "ਛੋਟਾ",
          "ਠੰਢਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “My house is big.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੇਰਾ ਘਰ ਵੱਡਾ ਹੈ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "family",
        "meaningEn": "people in my home",
        "meaningPa": "ਪਰਿਵਾਰ"
      },
      {
        "word": "home",
        "meaningEn": "story word: home",
        "meaningPa": "ਘਰ"
      },
      {
        "word": "mom",
        "meaningEn": "story word: mom",
        "meaningPa": "ਮਾਂ"
      },
      {
        "word": "dad",
        "meaningEn": "story word: dad",
        "meaningPa": "ਪਿਉ"
      },
      {
        "word": "door",
        "meaningEn": "story word: door",
        "meaningPa": "ਦਰਵਾਜ਼ਾ"
      },
      {
        "word": "sister",
        "meaningEn": "story word: sister",
        "meaningPa": "ਭੈਣ"
      },
      {
        "word": "brother",
        "meaningEn": "story word: brother",
        "meaningPa": "ਭਰਾ"
      },
      {
        "word": "window",
        "meaningEn": "story word: window",
        "meaningPa": "ਖਿੜਕੀ"
      },
      {
        "word": "grandma",
        "meaningEn": "story word: grandma",
        "meaningPa": "ਦਾਦੀ"
      },
      {
        "word": "grandpa",
        "meaningEn": "story word: grandpa",
        "meaningPa": "ਦਾਦਾ"
      }
    ]
  },
  {
    "storyId": "B1_S02",
    "bundleId": 1,
    "orderInBundle": 2,
    "titleEn": "Book 1 · Story 2: In My Bedroom",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 2: ਮੇਰੇ ਸੋਣ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ",
    "englishStory": "Panel 1 (Intro): I am in the bedroom.\nPanel 2 (Body): I sit on the bed with my book.\nPanel 3 (Body): My toy is in my bag.\nPanel 4 (Body): My shoes are by the chair. I open the door.\nPanel 5 (Conclusion): I close the door.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਸੋਣ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਬਿਸਤਰ ਉੱਤੇ ਬੈਠਦਾ ਹਾਂ ਅਤੇ ਮੇਰੀ ਕਿਤਾਬ ਮੇਰੇ ਨਾਲ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੇਰਾ ਖਿਡੌਣਾ ਮੇਰੇ ਬੈਗ ਵਿੱਚ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੇਰੇ ਜੁੱਤੇ ਕੁਰਸੀ ਦੇ ਕੋਲ ਹਨ। ਮੈਂ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੈਂ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰਦਾ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "bedroom",
          "pa": "ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
        },
        {
          "en": "bed",
          "pa": "ਬਿਸਤਰ"
        },
        {
          "en": "book",
          "pa": "ਕਿਤਾਬ"
        },
        {
          "en": "toy",
          "pa": "ਖਿਡੌਣਾ"
        },
        {
          "en": "bag",
          "pa": "ਬੈਗ"
        },
        {
          "en": "shoes",
          "pa": "ਜੁੱਤੇ"
        },
        {
          "en": "chair",
          "pa": "ਕੁਰਸੀ"
        },
        {
          "en": "door",
          "pa": "ਦਰਵਾਜ਼ਾ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "sit",
          "pa": "ਬੈਠਣਾ"
        },
        {
          "en": "open",
          "pa": "ਖੋਲ੍ਹਣਾ"
        },
        {
          "en": "close",
          "pa": "ਬੰਦ ਕਰਨਾ"
        },
        {
          "en": "is/are",
          "pa": "ਹੈ/ਹਨ"
        }
      ],
      "adjectives": [],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        },
        {
          "en": "with",
          "pa": "ਨਾਲ"
        },
        {
          "en": "by",
          "pa": "ਦੇ ਕੋਲ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "bedroom",
          "kitchen",
          "bathroom"
        ],
        "choicesPa": [
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ",
          "ਰਸੋਈ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says, “I am in the bedroom.”",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਸੋਣ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।”"
      },
      {
        "question": "Where does the child sit?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਬੈਠਦਾ ਹੈ?",
        "choices": [
          "on the bed",
          "on the table",
          "by the window"
        ],
        "choicesPa": [
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਮੇਜ਼ ਉੱਤੇ",
          "ਖਿੜਕੀ ਦੇ ਕੋਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child sits on the bed.",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਬੱਚਾ ਬਿਸਤਰ ਉੱਤੇ ਬੈਠਦਾ ਹੈ।"
      },
      {
        "question": "Where is the toy?",
        "questionPa": "ਖਿਡੌਣਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "in the bag",
          "in the cup",
          "in the bathroom"
        ],
        "choicesPa": [
          "ਬੈਗ ਵਿੱਚ",
          "ਕੱਪ ਵਿੱਚ",
          "ਬਾਥਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “My toy is in my bag.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੇਰਾ ਖਿਡੌਣਾ ਮੇਰੇ ਬੈਗ ਵਿੱਚ ਹੈ।”"
      },
      {
        "question": "What is by the chair?",
        "questionPa": "ਕੁਰਸੀ ਦੇ ਕੋਲ ਕੀ ਹੈ?",
        "choices": [
          "shoes",
          "milk",
          "apple"
        ],
        "choicesPa": [
          "ਜੁੱਤੇ",
          "ਦੁੱਧ",
          "ਸੇਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “My shoes are by the chair.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੇਰੇ ਜੁੱਤੇ ਕੁਰਸੀ ਦੇ ਕੋਲ ਹਨ।”"
      },
      {
        "question": "What does the child do at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਕਰਦਾ ਹੈ?",
        "choices": [
          "close the door",
          "wash the door",
          "eat the door"
        ],
        "choicesPa": [
          "ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰਦਾ ਹੈ",
          "ਦਰਵਾਜ਼ਾ ਧੋਂਦਾ ਹੈ",
          "ਦਰਵਾਜ਼ਾ ਖਾਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I close the door.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰਦਾ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bedroom",
        "meaningEn": "a room for sleeping",
        "meaningPa": "ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
      },
      {
        "word": "bed",
        "meaningEn": "story word: bed",
        "meaningPa": "ਬਿਸਤਰ"
      },
      {
        "word": "book",
        "meaningEn": "story word: book",
        "meaningPa": "ਕਿਤਾਬ"
      },
      {
        "word": "toy",
        "meaningEn": "story word: toy",
        "meaningPa": "ਖਿਡੌਣਾ"
      },
      {
        "word": "bag",
        "meaningEn": "story word: bag",
        "meaningPa": "ਬੈਗ"
      },
      {
        "word": "shoes",
        "meaningEn": "story word: shoes",
        "meaningPa": "ਜੁੱਤੇ"
      },
      {
        "word": "chair",
        "meaningEn": "story word: chair",
        "meaningPa": "ਕੁਰਸੀ"
      },
      {
        "word": "door",
        "meaningEn": "story word: door",
        "meaningPa": "ਦਰਵਾਜ਼ਾ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਬੈਠਣਾ"
      }
    ]
  },
  {
    "storyId": "B1_S03",
    "bundleId": 1,
    "orderInBundle": 3,
    "titleEn": "Book 1 · Story 3: Kitchen Lunch",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 3: ਰਸੋਈ ਵਿੱਚ ਖਾਣਾ",
    "englishStory": "Panel 1 (Intro): I am in the kitchen.\nPanel 2 (Body): I eat bread and rice on a plate.\nPanel 3 (Body): I drink milk in a cup.\nPanel 4 (Body): I eat an apple and a banana.\nPanel 5 (Conclusion): The bread is hot. The milk is cold.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਰਸੋਈ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਪਲੇਟ ਉੱਤੇ ਰੋਟੀ ਅਤੇ ਚਾਵਲ ਖਾਂਦਾ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੈਂ ਕੱਪ ਵਿੱਚ ਦੁੱਧ ਪੀਦਾ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਸੇਬ ਅਤੇ ਕੇਲਾ ਖਾਂਦਾ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਰੋਟੀ ਗਰਮ ਹੈ। ਦੁੱਧ ਠੰਢਾ ਹੈ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        }
      ],
      "nouns": [
        {
          "en": "kitchen",
          "pa": "ਰਸੋਈ"
        },
        {
          "en": "bread",
          "pa": "ਰੋਟੀ"
        },
        {
          "en": "rice",
          "pa": "ਚਾਵਲ"
        },
        {
          "en": "plate",
          "pa": "ਪਲੇਟ"
        },
        {
          "en": "milk",
          "pa": "ਦੁੱਧ"
        },
        {
          "en": "cup",
          "pa": "ਕੱਪ"
        },
        {
          "en": "apple",
          "pa": "ਸੇਬ"
        },
        {
          "en": "banana",
          "pa": "ਕੇਲਾ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "eat",
          "pa": "ਖਾਣਾ"
        },
        {
          "en": "drink",
          "pa": "ਪੀਣਾ"
        },
        {
          "en": "is",
          "pa": "ਹੈ"
        }
      ],
      "adjectives": [
        {
          "en": "hot",
          "pa": "ਗਰਮ"
        },
        {
          "en": "cold",
          "pa": "ਠੰਢਾ"
        }
      ],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "kitchen",
          "bedroom",
          "bathroom"
        ],
        "choicesPa": [
          "ਰਸੋਈ",
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child is in the kitchen.",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਬੱਚਾ ਰਸੋਈ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "What does the child eat on a plate?",
        "questionPa": "ਬੱਚਾ ਪਲੇਟ ਉੱਤੇ ਕੀ ਖਾਂਦਾ ਹੈ?",
        "choices": [
          "bread and rice",
          "milk and water",
          "shoes and hat"
        ],
        "choicesPa": [
          "ਰੋਟੀ ਅਤੇ ਚਾਵਲ",
          "ਦੁੱਧ ਅਤੇ ਪਾਣੀ",
          "ਜੁੱਤੇ ਅਤੇ ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “I eat bread and rice on a plate.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਪਲੇਟ ਉੱਤੇ ਰੋਟੀ ਅਤੇ ਚਾਵਲ ਖਾਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "What does the child drink?",
        "questionPa": "ਬੱਚਾ ਕੀ ਪੀਦਾ ਹੈ?",
        "choices": [
          "milk",
          "rice",
          "banana"
        ],
        "choicesPa": [
          "ਦੁੱਧ",
          "ਚਾਵਲ",
          "ਕੇਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “I drink milk in a cup.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਕੱਪ ਵਿੱਚ ਦੁੱਧ ਪੀਦਾ ਹਾਂ।”"
      },
      {
        "question": "Which fruit is in the story?",
        "questionPa": "ਕਹਾਣੀ ਵਿੱਚ ਕਿਹੜਾ ਫਲ ਹੈ?",
        "choices": [
          "banana",
          "chair",
          "door"
        ],
        "choicesPa": [
          "ਕੇਲਾ",
          "ਕੁਰਸੀ",
          "ਦਰਵਾਜ਼ਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “I eat an apple and a banana.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਸੇਬ ਅਤੇ ਕੇਲਾ ਖਾਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "Is the bread hot or cold?",
        "questionPa": "ਰੋਟੀ ਗਰਮ ਹੈ ਜਾਂ ਠੰਢੀ?",
        "choices": [
          "hot",
          "cold",
          "small"
        ],
        "choicesPa": [
          "ਗਰਮ",
          "ਠੰਢੀ",
          "ਛੋਟੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “The bread is hot.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਰੋਟੀ ਗਰਮ ਹੈ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "plate",
        "meaningEn": "a flat dish for food",
        "meaningPa": "ਪਲੇਟ"
      },
      {
        "word": "kitchen",
        "meaningEn": "story word: kitchen",
        "meaningPa": "ਰਸੋਈ"
      },
      {
        "word": "bread",
        "meaningEn": "story word: bread",
        "meaningPa": "ਰੋਟੀ"
      },
      {
        "word": "rice",
        "meaningEn": "story word: rice",
        "meaningPa": "ਚਾਵਲ"
      },
      {
        "word": "milk",
        "meaningEn": "story word: milk",
        "meaningPa": "ਦੁੱਧ"
      },
      {
        "word": "cup",
        "meaningEn": "story word: cup",
        "meaningPa": "ਕੱਪ"
      },
      {
        "word": "apple",
        "meaningEn": "story word: apple",
        "meaningPa": "ਸੇਬ"
      },
      {
        "word": "banana",
        "meaningEn": "story word: banana",
        "meaningPa": "ਕੇਲਾ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "eat",
        "meaningEn": "action word from the story: eat",
        "meaningPa": "ਖਾਣਾ"
      }
    ]
  },
  {
    "storyId": "B1_S04",
    "bundleId": 1,
    "orderInBundle": 4,
    "titleEn": "Book 1 · Story 4: Wash Time",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 4: ਧੋਣ ਦਾ ਸਮਾਂ",
    "englishStory": "Panel 1 (Intro): I am in the bathroom.\nPanel 2 (Body): I wash with water.\nPanel 3 (Body): I wash my shirt.\nPanel 4 (Body): I wash my shoes and my hat.\nPanel 5 (Conclusion): You help me. I am happy.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਬਾਥਰੂਮ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਪਾਣੀ ਨਾਲ ਧੋਂਦਾ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੈਂ ਆਪਣੀ ਕਮੀਜ਼ ਧੋਂਦਾ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਆਪਣੇ ਜੁੱਤੇ ਅਤੇ ਆਪਣੀ ਟੋਪੀ ਧੋਂਦਾ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਤੂੰ ਮੇਰੀ ਮਦਦ ਕਰਦਾ ਹੈਂ। ਮੈਂ ਖੁਸ਼ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "you",
          "pa": "ਤੂੰ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "bathroom",
          "pa": "ਬਾਥਰੂਮ"
        },
        {
          "en": "water",
          "pa": "ਪਾਣੀ"
        },
        {
          "en": "shirt",
          "pa": "ਕਮੀਜ਼"
        },
        {
          "en": "shoes",
          "pa": "ਜੁੱਤੇ"
        },
        {
          "en": "hat",
          "pa": "ਟੋਪੀ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "wash",
          "pa": "ਧੋਣਾ"
        },
        {
          "en": "help",
          "pa": "ਮਦਦ ਕਰਨਾ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ],
      "adjectives": [
        {
          "en": "happy",
          "pa": "ਖੁਸ਼"
        }
      ],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "with",
          "pa": "ਨਾਲ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "bathroom",
          "kitchen",
          "bedroom"
        ],
        "choicesPa": [
          "ਬਾਥਰੂਮ",
          "ਰਸੋਈ",
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child is in the bathroom.",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਬੱਚਾ ਬਾਥਰੂਮ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "What does the child wash with?",
        "questionPa": "ਬੱਚਾ ਕਿਸ ਨਾਲ ਧੋਂਦਾ ਹੈ?",
        "choices": [
          "water",
          "milk",
          "bread"
        ],
        "choicesPa": [
          "ਪਾਣੀ",
          "ਦੁੱਧ",
          "ਰੋਟੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “I wash with water.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਪਾਣੀ ਨਾਲ ਧੋਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "What does the child wash?",
        "questionPa": "ਬੱਚਾ ਕੀ ਧੋਂਦਾ ਹੈ?",
        "choices": [
          "shirt",
          "book",
          "banana"
        ],
        "choicesPa": [
          "ਕਮੀਜ਼",
          "ਕਿਤਾਬ",
          "ਕੇਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “I wash my shirt.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੀ ਕਮੀਜ਼ ਧੋਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "What else does the child wash?",
        "questionPa": "ਬੱਚਾ ਹੋਰ ਕੀ ਧੋਂਦਾ ਹੈ?",
        "choices": [
          "shoes and hat",
          "door and window",
          "bed and chair"
        ],
        "choicesPa": [
          "ਜੁੱਤੇ ਅਤੇ ਟੋਪੀ",
          "ਦਰਵਾਜ਼ਾ ਅਤੇ ਖਿੜਕੀ",
          "ਬਿਸਤਰ ਅਤੇ ਕੁਰਸੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “I wash my shoes and my hat.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੇ ਜੁੱਤੇ ਅਤੇ ਆਪਣੀ ਟੋਪੀ ਧੋਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "How does the child feel at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
        "choices": [
          "happy",
          "cold",
          "hot"
        ],
        "choicesPa": [
          "ਖੁਸ਼",
          "ਠੰਢਾ",
          "ਗਰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I am happy.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਖੁਸ਼ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bathroom",
        "meaningEn": "a room for washing",
        "meaningPa": "ਬਾਥਰੂਮ"
      },
      {
        "word": "water",
        "meaningEn": "story word: water",
        "meaningPa": "ਪਾਣੀ"
      },
      {
        "word": "shirt",
        "meaningEn": "story word: shirt",
        "meaningPa": "ਕਮੀਜ਼"
      },
      {
        "word": "shoes",
        "meaningEn": "story word: shoes",
        "meaningPa": "ਜੁੱਤੇ"
      },
      {
        "word": "hat",
        "meaningEn": "story word: hat",
        "meaningPa": "ਟੋਪੀ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "wash",
        "meaningEn": "action word from the story: wash",
        "meaningPa": "ਧੋਣਾ"
      },
      {
        "word": "help",
        "meaningEn": "action word from the story: help",
        "meaningPa": "ਮਦਦ ਕਰਨਾ"
      },
      {
        "word": "happy",
        "meaningEn": "describing word from the story: happy",
        "meaningPa": "ਖੁਸ਼"
      },
      {
        "word": "in",
        "meaningEn": "position word from the story: in",
        "meaningPa": "ਵਿੱਚ"
      }
    ]
  },
  {
    "storyId": "B1_S05",
    "bundleId": 1,
    "orderInBundle": 5,
    "titleEn": "Book 1 · Story 5: Play Time",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 5: ਖੇਡ ਦਾ ਸਮਾਂ",
    "englishStory": "Panel 1 (Intro): I am in my room.\nPanel 2 (Body): I play with my toy.\nPanel 3 (Body): Mom sits on the chair.\nPanel 4 (Body): Dad sits at the table. My book is on the table.\nPanel 5 (Conclusion): I am happy.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਆਪਣੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਆਪਣੇ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡਦਾ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮਾਂ ਕੁਰਸੀ ਉੱਤੇ ਬੈਠਦੀ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਪਿਉ ਮੇਜ਼ ਤੇ ਬੈਠਦਾ ਹੈ। ਮੇਰੀ ਕਿਤਾਬ ਮੇਜ਼ ਉੱਤੇ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੈਂ ਖੁਸ਼ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "room",
          "pa": "ਕਮਰਾ"
        },
        {
          "en": "toy",
          "pa": "ਖਿਡੌਣਾ"
        },
        {
          "en": "mom",
          "pa": "ਮਾਂ"
        },
        {
          "en": "chair",
          "pa": "ਕੁਰਸੀ"
        },
        {
          "en": "dad",
          "pa": "ਪਿਉ"
        },
        {
          "en": "table",
          "pa": "ਮੇਜ਼"
        },
        {
          "en": "book",
          "pa": "ਕਿਤਾਬ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "play",
          "pa": "ਖੇਡਣਾ"
        },
        {
          "en": "sit(s)",
          "pa": "ਬੈਠਣਾ"
        },
        {
          "en": "is",
          "pa": "ਹੈ"
        }
      ],
      "adjectives": [
        {
          "en": "happy",
          "pa": "ਖੁਸ਼"
        }
      ],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "with",
          "pa": "ਨਾਲ"
        },
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        },
        {
          "en": "at",
          "pa": "ਤੇ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "room",
          "bathroom",
          "kitchen"
        ],
        "choicesPa": [
          "ਕਮਰਾ",
          "ਬਾਥਰੂਮ",
          "ਰਸੋਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says, “I am in my room.”",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।”"
      },
      {
        "question": "What does the child play with?",
        "questionPa": "ਬੱਚਾ ਕਿਸ ਨਾਲ ਖੇਡਦਾ ਹੈ?",
        "choices": [
          "toy",
          "spoon",
          "shoes"
        ],
        "choicesPa": [
          "ਖਿਡੌਣਾ",
          "ਚਮਚਾ",
          "ਜੁੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “I play with my toy.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੇ ਖਿਡੌਣੇ ਨਾਲ ਖੇਡਦਾ ਹਾਂ।”"
      },
      {
        "question": "Who sits on the chair?",
        "questionPa": "ਕੁਰਸੀ ਉੱਤੇ ਕੌਣ ਬੈਠਦਾ ਹੈ?",
        "choices": [
          "mom",
          "baby",
          "grandpa"
        ],
        "choicesPa": [
          "ਮਾਂ",
          "ਬੱਚਾ",
          "ਦਾਦਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “Mom sits on the chair.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮਾਂ ਕੁਰਸੀ ਉੱਤੇ ਬੈਠਦੀ ਹੈ।”"
      },
      {
        "question": "Where does dad sit?",
        "questionPa": "ਪਿਉ ਕਿੱਥੇ ਬੈਠਦਾ ਹੈ?",
        "choices": [
          "at the table",
          "on the bed",
          "by the window"
        ],
        "choicesPa": [
          "ਮੇਜ਼ ਤੇ",
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਖਿੜਕੀ ਦੇ ਕੋਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says dad sits at the table.",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਪਿਉ ਮੇਜ਼ ਤੇ ਬੈਠਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "happy",
          "cold",
          "hot"
        ],
        "choicesPa": [
          "ਖੁਸ਼",
          "ਠੰਢਾ",
          "ਗਰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I am happy.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਖੁਸ਼ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "play",
        "meaningEn": "have fun with toys or games",
        "meaningPa": "ਖੇਡਣਾ"
      },
      {
        "word": "room",
        "meaningEn": "story word: room",
        "meaningPa": "ਕਮਰਾ"
      },
      {
        "word": "toy",
        "meaningEn": "story word: toy",
        "meaningPa": "ਖਿਡੌਣਾ"
      },
      {
        "word": "mom",
        "meaningEn": "story word: mom",
        "meaningPa": "ਮਾਂ"
      },
      {
        "word": "chair",
        "meaningEn": "story word: chair",
        "meaningPa": "ਕੁਰਸੀ"
      },
      {
        "word": "dad",
        "meaningEn": "story word: dad",
        "meaningPa": "ਪਿਉ"
      },
      {
        "word": "table",
        "meaningEn": "story word: table",
        "meaningPa": "ਮੇਜ਼"
      },
      {
        "word": "book",
        "meaningEn": "story word: book",
        "meaningPa": "ਕਿਤਾਬ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "sit(s)",
        "meaningEn": "action word from the story: sit(s)",
        "meaningPa": "ਬੈਠਣਾ"
      }
    ]
  },
  {
    "storyId": "B1_S06",
    "bundleId": 1,
    "orderInBundle": 6,
    "titleEn": "Book 1 · Story 6: Baby Sleeps",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 6: ਬੱਚਾ ਸੌਂਦਾ ਹੈ",
    "englishStory": "Panel 1 (Intro): The baby is in the bedroom.\nPanel 2 (Body): Grandma opens the door.\nPanel 3 (Body): Grandpa closes the door.\nPanel 4 (Body): Mom and dad help the baby.\nPanel 5 (Conclusion): The baby sleeps on the bed.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਬੱਚਾ ਸੋਣ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਦਾਦੀ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦੀ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਦਾਦਾ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮਾਂ ਅਤੇ ਪਿਉ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।\nਪੈਨਲ 5 (ਅੰਤ): ਬੱਚਾ ਬਿਸਤਰ ਉੱਤੇ ਸੌਂਦਾ ਹੈ।",
    "partsOfSpeech": {
      "pronouns": [],
      "nouns": [
        {
          "en": "baby",
          "pa": "ਬੱਚਾ"
        },
        {
          "en": "bedroom",
          "pa": "ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
        },
        {
          "en": "grandma",
          "pa": "ਦਾਦੀ"
        },
        {
          "en": "grandpa",
          "pa": "ਦਾਦਾ"
        },
        {
          "en": "door",
          "pa": "ਦਰਵਾਜ਼ਾ"
        },
        {
          "en": "mom",
          "pa": "ਮਾਂ"
        },
        {
          "en": "dad",
          "pa": "ਪਿਉ"
        },
        {
          "en": "bed",
          "pa": "ਬਿਸਤਰ"
        }
      ],
      "verbs": [
        {
          "en": "open(s)",
          "pa": "ਖੋਲ੍ਹਣਾ"
        },
        {
          "en": "close(s)",
          "pa": "ਬੰਦ ਕਰਨਾ"
        },
        {
          "en": "help",
          "pa": "ਮਦਦ ਕਰਨਾ"
        },
        {
          "en": "sleep(s)",
          "pa": "ਸੋਣਾ"
        },
        {
          "en": "is",
          "pa": "ਹੈ"
        }
      ],
      "adjectives": [],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the baby?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "bedroom",
          "kitchen",
          "bathroom"
        ],
        "choicesPa": [
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ",
          "ਰਸੋਈ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the baby is in the bedroom.",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਬੱਚਾ ਸੋਣ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "Who opens the door?",
        "questionPa": "ਦਰਵਾਜ਼ਾ ਕੌਣ ਖੋਲ੍ਹਦਾ ਹੈ?",
        "choices": [
          "grandma",
          "dad",
          "sister"
        ],
        "choicesPa": [
          "ਦਾਦੀ",
          "ਪਿਉ",
          "ਭੈਣ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “Grandma opens the door.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਦਾਦੀ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦੀ ਹੈ।”"
      },
      {
        "question": "Who closes the door?",
        "questionPa": "ਦਰਵਾਜ਼ਾ ਕੌਣ ਬੰਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "grandpa",
          "mom",
          "brother"
        ],
        "choicesPa": [
          "ਦਾਦਾ",
          "ਮਾਂ",
          "ਭਰਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “Grandpa closes the door.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਦਾਦਾ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰਦਾ ਹੈ।”"
      },
      {
        "question": "Who helps the baby?",
        "questionPa": "ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "mom and dad",
          "sister and brother",
          "you"
        ],
        "choicesPa": [
          "ਮਾਂ ਅਤੇ ਪਿਉ",
          "ਭੈਣ ਅਤੇ ਭਰਾ",
          "ਤੂੰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “Mom and dad help the baby.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮਾਂ ਅਤੇ ਪਿਉ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।”"
      },
      {
        "question": "Where does the baby sleep?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਸੌਂਦਾ ਹੈ?",
        "choices": [
          "on the bed",
          "on the table",
          "by the window"
        ],
        "choicesPa": [
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਮੇਜ਼ ਉੱਤੇ",
          "ਖਿੜਕੀ ਦੇ ਕੋਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “The baby sleeps on the bed.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਬੱਚਾ ਬਿਸਤਰ ਉੱਤੇ ਸੌਂਦਾ ਹੈ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "grandma",
        "meaningEn": "your father's or mother's mother",
        "meaningPa": "ਦਾਦੀ/ਨਾਨੀ"
      },
      {
        "word": "baby",
        "meaningEn": "story word: baby",
        "meaningPa": "ਬੱਚਾ"
      },
      {
        "word": "bedroom",
        "meaningEn": "story word: bedroom",
        "meaningPa": "ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
      },
      {
        "word": "grandpa",
        "meaningEn": "story word: grandpa",
        "meaningPa": "ਦਾਦਾ"
      },
      {
        "word": "door",
        "meaningEn": "story word: door",
        "meaningPa": "ਦਰਵਾਜ਼ਾ"
      },
      {
        "word": "mom",
        "meaningEn": "story word: mom",
        "meaningPa": "ਮਾਂ"
      },
      {
        "word": "dad",
        "meaningEn": "story word: dad",
        "meaningPa": "ਪਿਉ"
      },
      {
        "word": "bed",
        "meaningEn": "story word: bed",
        "meaningPa": "ਬਿਸਤਰ"
      },
      {
        "word": "open(s)",
        "meaningEn": "action word from the story: open(s)",
        "meaningPa": "ਖੋਲ੍ਹਣਾ"
      },
      {
        "word": "close(s)",
        "meaningEn": "action word from the story: close(s)",
        "meaningPa": "ਬੰਦ ਕਰਨਾ"
      }
    ]
  },
  {
    "storyId": "B1_S07",
    "bundleId": 1,
    "orderInBundle": 7,
    "titleEn": "Book 1 · Story 7: Wash the Dishes",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 7: ਬਰਤਨ ਧੋਣਾ",
    "englishStory": "Panel 1 (Intro): I am in the kitchen.\nPanel 2 (Body): I wash a cup and a spoon with water.\nPanel 3 (Body): I wash a plate.\nPanel 4 (Body): I drink water.\nPanel 5 (Conclusion): The water is cold.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਰਸੋਈ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਪਾਣੀ ਨਾਲ ਕੱਪ ਅਤੇ ਚਮਚਾ ਧੋਂਦਾ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੈਂ ਪਲੇਟ ਧੋਂਦਾ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਪਾਣੀ ਪੀਦਾ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਪਾਣੀ ਠੰਢਾ ਹੈ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        }
      ],
      "nouns": [
        {
          "en": "kitchen",
          "pa": "ਰਸੋਈ"
        },
        {
          "en": "cup",
          "pa": "ਕੱਪ"
        },
        {
          "en": "spoon",
          "pa": "ਚਮਚਾ"
        },
        {
          "en": "plate",
          "pa": "ਪਲੇਟ"
        },
        {
          "en": "water",
          "pa": "ਪਾਣੀ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "wash",
          "pa": "ਧੋਣਾ"
        },
        {
          "en": "drink",
          "pa": "ਪੀਣਾ"
        },
        {
          "en": "is",
          "pa": "ਹੈ"
        }
      ],
      "adjectives": [
        {
          "en": "cold",
          "pa": "ਠੰਢਾ"
        }
      ],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "with",
          "pa": "ਨਾਲ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "kitchen",
          "bedroom",
          "bathroom"
        ],
        "choicesPa": [
          "ਰਸੋਈ",
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child is in the kitchen.",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਬੱਚਾ ਰਸੋਈ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "What does the child wash first?",
        "questionPa": "ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਧੋਂਦਾ ਹੈ?",
        "choices": [
          "cup and spoon",
          "shoes and hat",
          "bread and rice"
        ],
        "choicesPa": [
          "ਕੱਪ ਅਤੇ ਚਮਚਾ",
          "ਜੁੱਤੇ ਅਤੇ ਟੋਪੀ",
          "ਰੋਟੀ ਅਤੇ ਚਾਵਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “I wash a cup and a spoon with water.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਪਾਣੀ ਨਾਲ ਕੱਪ ਅਤੇ ਚਮਚਾ ਧੋਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "What does the child wash next?",
        "questionPa": "ਬੱਚਾ ਅਗਲਾ ਕੀ ਧੋਂਦਾ ਹੈ?",
        "choices": [
          "plate",
          "book",
          "window"
        ],
        "choicesPa": [
          "ਪਲੇਟ",
          "ਕਿਤਾਬ",
          "ਖਿੜਕੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “I wash a plate.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਪਲੇਟ ਧੋਂਦਾ ਹਾਂ।”"
      },
      {
        "question": "What does the child drink?",
        "questionPa": "ਬੱਚਾ ਕੀ ਪੀਦਾ ਹੈ?",
        "choices": [
          "water",
          "milk",
          "rice"
        ],
        "choicesPa": [
          "ਪਾਣੀ",
          "ਦੁੱਧ",
          "ਚਾਵਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “I drink water.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਪਾਣੀ ਪੀਦਾ ਹਾਂ।”"
      },
      {
        "question": "Is the water hot or cold?",
        "questionPa": "ਪਾਣੀ ਗਰਮ ਹੈ ਜਾਂ ਠੰਢਾ?",
        "choices": [
          "cold",
          "hot",
          "big"
        ],
        "choicesPa": [
          "ਠੰਢਾ",
          "ਗਰਮ",
          "ਵੱਡਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “The water is cold.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਪਾਣੀ ਠੰਢਾ ਹੈ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "kitchen",
        "meaningEn": "the room where food is made",
        "meaningPa": "ਰਸੋਈ"
      },
      {
        "word": "cup",
        "meaningEn": "story word: cup",
        "meaningPa": "ਕੱਪ"
      },
      {
        "word": "spoon",
        "meaningEn": "story word: spoon",
        "meaningPa": "ਚਮਚਾ"
      },
      {
        "word": "plate",
        "meaningEn": "story word: plate",
        "meaningPa": "ਪਲੇਟ"
      },
      {
        "word": "water",
        "meaningEn": "story word: water",
        "meaningPa": "ਪਾਣੀ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "wash",
        "meaningEn": "action word from the story: wash",
        "meaningPa": "ਧੋਣਾ"
      },
      {
        "word": "drink",
        "meaningEn": "action word from the story: drink",
        "meaningPa": "ਪੀਣਾ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਹੈ"
      },
      {
        "word": "cold",
        "meaningEn": "describing word from the story: cold",
        "meaningPa": "ਠੰਢਾ"
      }
    ]
  },
  {
    "storyId": "B1_S08",
    "bundleId": 1,
    "orderInBundle": 8,
    "titleEn": "Book 1 · Story 8: Shirt, Shoes, Hat",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 8: ਕਮੀਜ਼, ਜੁੱਤੇ, ਟੋਪੀ",
    "englishStory": "Panel 1 (Intro): I am at home.\nPanel 2 (Body): My shirt is on the bed.\nPanel 3 (Body): My shoes are by the door.\nPanel 4 (Body): My hat is on the table.\nPanel 5 (Conclusion): I open the door.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਘਰ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੇਰੀ ਕਮੀਜ਼ ਬਿਸਤਰ ਉੱਤੇ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੇਰੇ ਜੁੱਤੇ ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ ਹਨ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੇਰੀ ਟੋਪੀ ਮੇਜ਼ ਉੱਤੇ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੈਂ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "home",
          "pa": "ਘਰ"
        },
        {
          "en": "shirt",
          "pa": "ਕਮੀਜ਼"
        },
        {
          "en": "bed",
          "pa": "ਬਿਸਤਰ"
        },
        {
          "en": "shoes",
          "pa": "ਜੁੱਤੇ"
        },
        {
          "en": "door",
          "pa": "ਦਰਵਾਜ਼ਾ"
        },
        {
          "en": "hat",
          "pa": "ਟੋਪੀ"
        },
        {
          "en": "table",
          "pa": "ਮੇਜ਼"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "open",
          "pa": "ਖੋਲ੍ਹਣਾ"
        },
        {
          "en": "is/are",
          "pa": "ਹੈ/ਹਨ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ],
      "adjectives": [],
      "prepositions": [
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        },
        {
          "en": "by",
          "pa": "ਦੇ ਕੋਲ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "home",
          "kitchen",
          "bathroom"
        ],
        "choicesPa": [
          "ਘਰ",
          "ਰਸੋਈ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says, “I am at home.”",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਘਰ ਵਿੱਚ ਹਾਂ।”"
      },
      {
        "question": "Where is the shirt?",
        "questionPa": "ਕਮੀਜ਼ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "on the bed",
          "in the cup",
          "by the window"
        ],
        "choicesPa": [
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਕੱਪ ਵਿੱਚ",
          "ਖਿੜਕੀ ਦੇ ਕੋਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the shirt is on the bed.",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਕਮੀਜ਼ ਬਿਸਤਰ ਉੱਤੇ ਹੈ।"
      },
      {
        "question": "Where are the shoes?",
        "questionPa": "ਜੁੱਤੇ ਕਿੱਥੇ ਹਨ?",
        "choices": [
          "by the door",
          "on the plate",
          "in the bathroom"
        ],
        "choicesPa": [
          "ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ",
          "ਪਲੇਟ ਉੱਤੇ",
          "ਬਾਥਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the shoes are by the door.",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਜੁੱਤੇ ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ ਹਨ।"
      },
      {
        "question": "Where is the hat?",
        "questionPa": "ਟੋਪੀ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "on the table",
          "on the bed",
          "in the bag"
        ],
        "choicesPa": [
          "ਮੇਜ਼ ਉੱਤੇ",
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਬੈਗ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the hat is on the table.",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਟੋਪੀ ਮੇਜ਼ ਉੱਤੇ ਹੈ।"
      },
      {
        "question": "What does the child do at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਕਰਦਾ ਹੈ?",
        "choices": [
          "open the door",
          "wash the door",
          "drink the door"
        ],
        "choicesPa": [
          "ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ ਹੈ",
          "ਦਰਵਾਜ਼ਾ ਧੋਂਦਾ ਹੈ",
          "ਦਰਵਾਜ਼ਾ ਪੀਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I open the door.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "shirt",
        "meaningEn": "clothes worn on the upper body",
        "meaningPa": "ਕਮੀਜ਼"
      },
      {
        "word": "home",
        "meaningEn": "story word: home",
        "meaningPa": "ਘਰ"
      },
      {
        "word": "bed",
        "meaningEn": "story word: bed",
        "meaningPa": "ਬਿਸਤਰ"
      },
      {
        "word": "shoes",
        "meaningEn": "story word: shoes",
        "meaningPa": "ਜੁੱਤੇ"
      },
      {
        "word": "door",
        "meaningEn": "story word: door",
        "meaningPa": "ਦਰਵਾਜ਼ਾ"
      },
      {
        "word": "hat",
        "meaningEn": "story word: hat",
        "meaningPa": "ਟੋਪੀ"
      },
      {
        "word": "table",
        "meaningEn": "story word: table",
        "meaningPa": "ਮੇਜ਼"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "open",
        "meaningEn": "action word from the story: open",
        "meaningPa": "ਖੋਲ੍ਹਣਾ"
      },
      {
        "word": "is/are",
        "meaningEn": "action word from the story: is/are",
        "meaningPa": "ਹੈ/ਹਨ"
      }
    ]
  },
  {
    "storyId": "B1_S09",
    "bundleId": 1,
    "orderInBundle": 9,
    "titleEn": "Book 1 · Story 9: Family Lunch",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 9: ਪਰਿਵਾਰ ਦਾ ਖਾਣਾ",
    "englishStory": "Panel 1 (Intro): Mom and dad are in the kitchen.\nPanel 2 (Body): Grandma and grandpa sit at the table.\nPanel 3 (Body): Sister and brother eat rice.\nPanel 4 (Body): The baby drinks milk.\nPanel 5 (Conclusion): I drink water in my cup.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮਾਂ ਅਤੇ ਪਿਉ ਰਸੋਈ ਵਿੱਚ ਹਨ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਦਾਦੀ ਅਤੇ ਦਾਦਾ ਮੇਜ਼ ਤੇ ਬੈਠਦੇ ਹਨ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਭੈਣ ਅਤੇ ਭਰਾ ਚਾਵਲ ਖਾਂਦੇ ਹਨ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੈਂ ਆਪਣੇ ਕੱਪ ਵਿੱਚ ਪਾਣੀ ਪੀਦਾ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "mom",
          "pa": "ਮਾਂ"
        },
        {
          "en": "dad",
          "pa": "ਪਿਉ"
        },
        {
          "en": "kitchen",
          "pa": "ਰਸੋਈ"
        },
        {
          "en": "grandma",
          "pa": "ਦਾਦੀ"
        },
        {
          "en": "grandpa",
          "pa": "ਦਾਦਾ"
        },
        {
          "en": "table",
          "pa": "ਮੇਜ਼"
        },
        {
          "en": "sister",
          "pa": "ਭੈਣ"
        },
        {
          "en": "brother",
          "pa": "ਭਰਾ"
        },
        {
          "en": "rice",
          "pa": "ਚਾਵਲ"
        },
        {
          "en": "baby",
          "pa": "ਬੱਚਾ"
        },
        {
          "en": "milk",
          "pa": "ਦੁੱਧ"
        },
        {
          "en": "water",
          "pa": "ਪਾਣੀ"
        },
        {
          "en": "cup",
          "pa": "ਕੱਪ"
        }
      ],
      "verbs": [
        {
          "en": "are",
          "pa": "ਹਨ"
        },
        {
          "en": "sit",
          "pa": "ਬੈਠਣਾ"
        },
        {
          "en": "eat",
          "pa": "ਖਾਣਾ"
        },
        {
          "en": "drink(s)",
          "pa": "ਪੀਣਾ"
        }
      ],
      "adjectives": [],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "at",
          "pa": "ਤੇ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where are mom and dad?",
        "questionPa": "ਮਾਂ ਅਤੇ ਪਿਉ ਕਿੱਥੇ ਹਨ?",
        "choices": [
          "kitchen",
          "bedroom",
          "bathroom"
        ],
        "choicesPa": [
          "ਰਸੋਈ",
          "ਸੋਣ ਵਾਲਾ ਕਮਰਾ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says mom and dad are in the kitchen.",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਮਾਂ ਅਤੇ ਪਿਉ ਰਸੋਈ ਵਿੱਚ ਹਨ।"
      },
      {
        "question": "Who sits at the table?",
        "questionPa": "ਮੇਜ਼ ਤੇ ਕੌਣ ਬੈਠਦਾ ਹੈ?",
        "choices": [
          "grandma and grandpa",
          "sister and brother",
          "mom and dad"
        ],
        "choicesPa": [
          "ਦਾਦੀ ਅਤੇ ਦਾਦਾ",
          "ਭੈਣ ਅਤੇ ਭਰਾ",
          "ਮਾਂ ਅਤੇ ਪਿਉ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “Grandma and grandpa sit at the table.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਦਾਦੀ ਅਤੇ ਦਾਦਾ ਮੇਜ਼ ਤੇ ਬੈਠਦੇ ਹਨ।”"
      },
      {
        "question": "What do sister and brother eat?",
        "questionPa": "ਭੈਣ ਅਤੇ ਭਰਾ ਕੀ ਖਾਂਦੇ ਹਨ?",
        "choices": [
          "rice",
          "bread",
          "banana"
        ],
        "choicesPa": [
          "ਚਾਵਲ",
          "ਰੋਟੀ",
          "ਕੇਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “Sister and brother eat rice.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਭੈਣ ਅਤੇ ਭਰਾ ਚਾਵਲ ਖਾਂਦੇ ਹਨ।”"
      },
      {
        "question": "What does the baby drink?",
        "questionPa": "ਬੱਚਾ ਕੀ ਪੀਂਦਾ ਹੈ?",
        "choices": [
          "milk",
          "water",
          "rice"
        ],
        "choicesPa": [
          "ਦੁੱਧ",
          "ਪਾਣੀ",
          "ਚਾਵਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, “The baby drinks milk.”",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਬੱਚਾ ਦੁੱਧ ਪੀਂਦਾ ਹੈ।”"
      },
      {
        "question": "What does the child drink at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਪੀਂਦਾ ਹੈ?",
        "choices": [
          "water",
          "milk",
          "apple"
        ],
        "choicesPa": [
          "ਪਾਣੀ",
          "ਦੁੱਧ",
          "ਸੇਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I drink water in my cup.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੇ ਕੱਪ ਵਿੱਚ ਪਾਣੀ ਪੀਦਾ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "family",
        "meaningEn": "people in your home like mom, dad, and children",
        "meaningPa": "ਪਰਿਵਾਰ"
      },
      {
        "word": "mom",
        "meaningEn": "story word: mom",
        "meaningPa": "ਮਾਂ"
      },
      {
        "word": "dad",
        "meaningEn": "story word: dad",
        "meaningPa": "ਪਿਉ"
      },
      {
        "word": "kitchen",
        "meaningEn": "story word: kitchen",
        "meaningPa": "ਰਸੋਈ"
      },
      {
        "word": "grandma",
        "meaningEn": "story word: grandma",
        "meaningPa": "ਦਾਦੀ"
      },
      {
        "word": "grandpa",
        "meaningEn": "story word: grandpa",
        "meaningPa": "ਦਾਦਾ"
      },
      {
        "word": "table",
        "meaningEn": "story word: table",
        "meaningPa": "ਮੇਜ਼"
      },
      {
        "word": "sister",
        "meaningEn": "story word: sister",
        "meaningPa": "ਭੈਣ"
      },
      {
        "word": "brother",
        "meaningEn": "story word: brother",
        "meaningPa": "ਭਰਾ"
      },
      {
        "word": "rice",
        "meaningEn": "story word: rice",
        "meaningPa": "ਚਾਵਲ"
      }
    ]
  },
  {
    "storyId": "B1_S10",
    "bundleId": 1,
    "orderInBundle": 10,
    "titleEn": "Book 1 · Story 10: Open and Close",
    "titlePa": "ਕਿਤਾਬ 1 · ਕਹਾਣੀ 10: ਖੋਲ੍ਹੋ ਅਤੇ ਬੰਦ ਕਰੋ",
    "englishStory": "Panel 1 (Intro): I am in my room.\nPanel 2 (Body): I open the window.\nPanel 3 (Body): I close the window.\nPanel 4 (Body): My book and my toy are on the bed.\nPanel 5 (Conclusion): My room is small. I am happy.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਮੈਂ ਆਪਣੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਮੈਂ ਖਿੜਕੀ ਖੋਲ੍ਹਦਾ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮੈਂ ਖਿੜਕੀ ਬੰਦ ਕਰਦਾ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੇਰੀ ਕਿਤਾਬ ਅਤੇ ਮੇਰਾ ਖਿਡੌਣਾ ਬਿਸਤਰ ਉੱਤੇ ਹਨ।\nਪੈਨਲ 5 (ਅੰਤ): ਮੇਰਾ ਕਮਰਾ ਛੋਟਾ ਹੈ। ਮੈਂ ਖੁਸ਼ ਹਾਂ।",
    "partsOfSpeech": {
      "pronouns": [
        {
          "en": "I",
          "pa": "ਮੈਂ"
        },
        {
          "en": "my",
          "pa": "ਮੇਰਾ/ਮੇਰੀ"
        }
      ],
      "nouns": [
        {
          "en": "room",
          "pa": "ਕਮਰਾ"
        },
        {
          "en": "window",
          "pa": "ਖਿੜਕੀ"
        },
        {
          "en": "book",
          "pa": "ਕਿਤਾਬ"
        },
        {
          "en": "toy",
          "pa": "ਖਿਡੌਣਾ"
        },
        {
          "en": "bed",
          "pa": "ਬਿਸਤਰ"
        }
      ],
      "verbs": [
        {
          "en": "am",
          "pa": "ਹਾਂ"
        },
        {
          "en": "open",
          "pa": "ਖੋਲ੍ਹਣਾ"
        },
        {
          "en": "close",
          "pa": "ਬੰਦ ਕਰਨਾ"
        },
        {
          "en": "is/are",
          "pa": "ਹੈ/ਹਨ"
        }
      ],
      "adjectives": [
        {
          "en": "small",
          "pa": "ਛੋਟਾ"
        },
        {
          "en": "happy",
          "pa": "ਖੁਸ਼"
        }
      ],
      "prepositions": [
        {
          "en": "in",
          "pa": "ਵਿੱਚ"
        },
        {
          "en": "on",
          "pa": "ਉੱਤੇ"
        }
      ]
    },
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child?",
        "questionPa": "ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "room",
          "kitchen",
          "bathroom"
        ],
        "choicesPa": [
          "ਕਮਰਾ",
          "ਰਸੋਈ",
          "ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says, “I am in my room.”",
        "explanationPa": "ਪੈਨਲ 1 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਆਪਣੇ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।”"
      },
      {
        "question": "What does the child open?",
        "questionPa": "ਬੱਚਾ ਕੀ ਖੋਲ੍ਹਦਾ ਹੈ?",
        "choices": [
          "window",
          "door",
          "cup"
        ],
        "choicesPa": [
          "ਖਿੜਕੀ",
          "ਦਰਵਾਜ਼ਾ",
          "ਕੱਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says, “I open the window.”",
        "explanationPa": "ਪੈਨਲ 2 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਖਿੜਕੀ ਖੋਲ੍ਹਦਾ ਹਾਂ।”"
      },
      {
        "question": "What does the child close?",
        "questionPa": "ਬੱਚਾ ਕੀ ਬੰਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "window",
          "plate",
          "hat"
        ],
        "choicesPa": [
          "ਖਿੜਕੀ",
          "ਪਲੇਟ",
          "ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, “I close the window.”",
        "explanationPa": "ਪੈਨਲ 3 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਖਿੜਕੀ ਬੰਦ ਕਰਦਾ ਹਾਂ।”"
      },
      {
        "question": "Where are the book and toy?",
        "questionPa": "ਕਿਤਾਬ ਅਤੇ ਖਿਡੌਣਾ ਕਿੱਥੇ ਹਨ?",
        "choices": [
          "on the bed",
          "in the bag",
          "by the door"
        ],
        "choicesPa": [
          "ਬਿਸਤਰ ਉੱਤੇ",
          "ਬੈਗ ਵਿੱਚ",
          "ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they are on the bed.",
        "explanationPa": "ਪੈਨਲ 4 ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕਿ ਉਹ ਬਿਸਤਰ ਉੱਤੇ ਹਨ।"
      },
      {
        "question": "How does the child feel at the end?",
        "questionPa": "ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "happy",
          "cold",
          "hot"
        ],
        "choicesPa": [
          "ਖੁਸ਼",
          "ਠੰਢਾ",
          "ਗਰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says, “I am happy.”",
        "explanationPa": "ਪੈਨਲ 5 ਵਿੱਚ ਲਿਖਿਆ ਹੈ, “ਮੈਂ ਖੁਸ਼ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "window",
        "meaningEn": "an opening in a wall for light and air",
        "meaningPa": "ਖਿੜਕੀ"
      },
      {
        "word": "room",
        "meaningEn": "story word: room",
        "meaningPa": "ਕਮਰਾ"
      },
      {
        "word": "book",
        "meaningEn": "story word: book",
        "meaningPa": "ਕਿਤਾਬ"
      },
      {
        "word": "toy",
        "meaningEn": "story word: toy",
        "meaningPa": "ਖਿਡੌਣਾ"
      },
      {
        "word": "bed",
        "meaningEn": "story word: bed",
        "meaningPa": "ਬਿਸਤਰ"
      },
      {
        "word": "am",
        "meaningEn": "action word from the story: am",
        "meaningPa": "ਹਾਂ"
      },
      {
        "word": "open",
        "meaningEn": "action word from the story: open",
        "meaningPa": "ਖੋਲ੍ਹਣਾ"
      },
      {
        "word": "close",
        "meaningEn": "action word from the story: close",
        "meaningPa": "ਬੰਦ ਕਰਨਾ"
      },
      {
        "word": "is/are",
        "meaningEn": "action word from the story: is/are",
        "meaningPa": "ਹੈ/ਹਨ"
      },
      {
        "word": "small",
        "meaningEn": "describing word from the story: small",
        "meaningPa": "ਛੋਟਾ"
      }
    ]
  }
];

var BOOK2_CUSTOM_STORIES = [
  {
    "storyId": "B2_S01",
    "bundleId": 2,
    "orderInBundle": 1,
    "titleEn": "Book 2 · Story 1: Good Morning, School!",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 1: ਗੁੱਡ ਮੋਰਨਿੰਗ, ਸਕੂਲ!",
    "englishStory": "Panel 1 (Intro): It is morning today at school. I carry my bag and smile.\nPanel 2 (Body): First, I walk to my class slowly. I see my teacher at the door.\nPanel 3 (Body): Next, I line up with my friend quietly. We wait and stand still.\nPanel 4 (Body): Then the teacher says, “Sit down.” I sit down at my desk.\nPanel 5 (Conclusion): After that, we look at the board together. We are ready to learn now.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਕੂਲ ਵਿੱਚ ਸਵੇਰ ਹੈ। ਮੈਂ ਬੈਗ ਫੜਦਾ/ਫੜਦੀ ਹਾਂ ਅਤੇ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੌਲੀ ਕਲਾਸ ਵੱਲ ਤੁਰਦਾ/ਤੁਰਦੀ ਹਾਂ। ਮੈਂ ਦਰਵਾਜ਼ੇ ਤੇ ਟੀਚਰ ਨੂੰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਦੋਸਤ ਨਾਲ ਚੁੱਪਚਾਪ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ। ਅਸੀਂ ਉਡੀਕ ਕਰਦੇ ਹਾਂ ਅਤੇ ਹਿਲਦੇ ਨਹੀਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਬੈਠ ਜਾਓ।” ਮੈਂ ਡੈਸਕ ਤੇ ਬੈਠ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਬੋਰਡ ਵੱਲ ਇਕੱਠੇ ਵੇਖਦੇ ਹਾਂ। ਹੁਣ ਅਸੀਂ ਸਿੱਖਣ ਲਈ ਤਿਆਰ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "school / ਸਕੂਲ",
          "park / ਪਾਰਕ",
          "home / ਘਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the child goes to school. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਸਕੂਲ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "Who is at the door? / ਦਰਵਾਜ਼ੇ ਤੇ ਕੌਣ ਹੈ?",
        "choices": [
          "teacher / ਟੀਚਰ",
          "friend / ਦੋਸਤ",
          "baby / ਬੱਚਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child sees the teacher at the door. / ਬੱਚਾ ਦਰਵਾਜ਼ੇ ਤੇ ਟੀਚਰ ਨੂੰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "What do the children do next? / ਫਿਰ ਬੱਚੇ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "line up / ਕਤਾਰ ਬਣਾਉਂਦੇ ਹਨ",
          "run / ਦੌੜਦੇ ਹਨ",
          "sleep / ਸੌਂਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They line up and wait quietly. / ਉਹ ਕਤਾਰ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਚੁੱਪ ਰਹਿੰਦੇ ਹਨ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Sit down / ਬੈਠ ਜਾਓ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Eat lunch / ਲੰਚ ਖਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Sit down.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਬੈਠ ਜਾਓ।”"
      },
      {
        "question": "What do they look at after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕਿੱਧਰ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "board / ਬੋਰਡ",
          "bed / ਬਿਸਤਰ",
          "bathroom / ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They look at the board to learn. / ਉਹ ਸਿੱਖਣ ਲਈ ਬੋਰਡ ਵੱਲ ਵੇਖਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "morning",
        "meaningEn": "the early part of the day",
        "meaningPa": "ਸਵੇਰ"
      },
      {
        "word": "line up",
        "meaningEn": "stand in a line",
        "meaningPa": "ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਨਾ"
      },
      {
        "word": "ready",
        "meaningEn": "prepared to start",
        "meaningPa": "ਤਿਆਰ"
      },
      {
        "word": "classroom",
        "meaningEn": "the room where students learn",
        "meaningPa": "ਕਲਾਸਰੂਮ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "walk",
        "meaningEn": "action word from the story: walk",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "stand",
        "meaningEn": "action word from the story: stand",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S02",
    "bundleId": 2,
    "orderInBundle": 2,
    "titleEn": "Book 2 · Story 2: My Bag and My Desk",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 2: ਮੇਰਾ ਬੈਗ ਅਤੇ ਮੇਰੀ ਡੈਸਕ",
    "englishStory": "Panel 1 (Intro): I come into the classroom today. I usually go to my desk first.\nPanel 2 (Body): First, I put my bag by the desk. I sit down on my chair.\nPanel 3 (Body): Next, I take out my book and pencil. I put paper on the desk.\nPanel 4 (Body): Then the teacher says, “Write your name.” I find my eraser quickly.\nPanel 5 (Conclusion): After that, I write my name on paper. My desk looks clean and ready.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸਰੂਮ ਵਿੱਚ ਆਉਂਦਾ/ਆਉਂਦੀ ਹਾਂ। ਮੈਂ ਆਮ ਤੌਰ ਤੇ ਪਹਿਲਾਂ ਡੈਸਕ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਬੈਗ ਡੈਸਕ ਦੇ ਕੋਲ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਮੈਂ ਕੁਰਸੀ ਉੱਤੇ ਬੈਠ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਕਿਤਾਬ ਅਤੇ ਪੈਂਸਿਲ ਕੱਢਦਾ/ਕੱਢਦੀ ਹਾਂ। ਮੈਂ ਕਾਗਜ਼ ਡੈਸਕ ਉੱਤੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਆਪਣਾ ਨਾਮ ਲਿਖੋ।” ਮੈਂ ਜਲਦੀ ਰੱਬੜ ਲੱਭਦਾ/ਲੱਭਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਾਗਜ਼ ਉੱਤੇ ਆਪਣਾ ਨਾਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ। ਮੇਰੀ ਡੈਸਕ ਸਾਫ਼ ਅਤੇ ਤਿਆਰ ਲੱਗਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child usually go first? / ਬੱਚਾ ਆਮ ਤੌਰ ਤੇ ਪਹਿਲਾਂ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "desk / ਡੈਸਕ",
          "bathroom / ਬਾਥਰੂਮ",
          "playground / ਖੇਡ ਮੈਦਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child usually goes to the desk first. / ਬੱਚਾ ਆਮ ਤੌਰ ਤੇ ਪਹਿਲਾਂ ਡੈਸਕ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "Where does the bag go? / ਬੈਗ ਕਿੱਥੇ ਜਾਂਦਾ ਹੈ?",
        "choices": [
          "by the desk / ਡੈਸਕ ਦੇ ਕੋਲ",
          "on the board / ਬੋਰਡ ਉੱਤੇ",
          "in the bathroom / ਬਾਥਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The bag is put by the desk. / ਬੈਗ ਡੈਸਕ ਦੇ ਕੋਲ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।"
      },
      {
        "question": "What comes out next? / ਫਿਰ ਕੀ ਕੱਢਦਾ/ਕੱਢਦੀ ਹੈ?",
        "choices": [
          "book and pencil / ਕਿਤਾਬ ਅਤੇ ਪੈਂਸਿਲ",
          "milk and cup / ਦੁੱਧ ਅਤੇ ਕੱਪ",
          "shoes and hat / ਜੁੱਤੇ ਅਤੇ ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child takes out a book and pencil. / ਬੱਚਾ ਕਿਤਾਬ ਅਤੇ ਪੈਂਸਿਲ ਕੱਢਦਾ/ਕੱਢਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Write your name / ਆਪਣਾ ਨਾਮ ਲਿਖੋ",
          "Run / ਦੌੜੋ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Write your name.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਆਪਣਾ ਨਾਮ ਲਿਖੋ।”"
      },
      {
        "question": "How does the desk look at the end? / ਅੰਤ ਵਿੱਚ ਡੈਸਕ ਕਿਹੋ ਜਿਹੀ ਲੱਗਦੀ ਹੈ?",
        "choices": [
          "clean / ਸਾਫ਼",
          "dirty / ਗੰਦੀ",
          "broken / ਟੁੱਟੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The desk looks clean and ready. / ਡੈਸਕ ਸਾਫ਼ ਅਤੇ ਤਿਆਰ ਲੱਗਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "desk",
        "meaningEn": "a table you work at",
        "meaningPa": "ਡੈਸਕ"
      },
      {
        "word": "eraser",
        "meaningEn": "a tool to remove pencil marks",
        "meaningPa": "ਰੱਬੜ"
      },
      {
        "word": "usually",
        "meaningEn": "often; most days",
        "meaningPa": "ਆਮ ਤੌਰ ਤੇ"
      },
      {
        "word": "chair",
        "meaningEn": "a seat for one person",
        "meaningPa": "ਕੁਰਸੀ"
      },
      {
        "word": "go",
        "meaningEn": "action word from the story: go",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "write",
        "meaningEn": "action word from the story: write",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "looks",
        "meaningEn": "action word from the story: looks",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S03",
    "bundleId": 2,
    "orderInBundle": 3,
    "titleEn": "Book 2 · Story 3: Reading Time Together",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 3: ਇਕੱਠੇ ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ",
    "englishStory": "Panel 1 (Intro): Now it is reading time today. I sit with my book open.\nPanel 2 (Body): First, the teacher says, “Open your book.” I open to page one.\nPanel 3 (Body): Next, I read with my friend softly. We point and look at words.\nPanel 4 (Body): Then the teacher says, “Listen and answer.” I answer one short question.\nPanel 5 (Conclusion): After that, I close my book carefully. I feel ready for writing time.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ ਹੈ। ਮੈਂ ਕਿਤਾਬ ਖੋਲ੍ਹ ਕੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਕਿਤਾਬ ਖੋਲ੍ਹੋ।” ਮੈਂ ਪਹਿਲੇ ਸਫ਼ੇ ਤੇ ਖੋਲ੍ਹਦਾ/ਖੋਲ੍ਹਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਦੋਸਤ ਨਾਲ ਹੌਲੀ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ। ਅਸੀਂ ਸ਼ਬਦਾਂ ਵੱਲ ਉਂਗਲ ਕਰਕੇ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਸੁਣੋ ਅਤੇ ਜਵਾਬ ਦਿਓ।” ਮੈਂ ਇੱਕ ਛੋਟਾ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਿਤਾਬ ਧਿਆਨ ਨਾਲ ਬੰਦ ਕਰਦਾ/ਬੰਦ ਕਰਦੀ ਹਾਂ। ਮੈਂ ਲਿਖਣ ਲਈ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What time is it now? / ਹੁਣ ਕਿਹੜਾ ਸਮਾਂ ਹੈ?",
        "choices": [
          "reading time / ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ",
          "snack time / ਨਾਸ਼ਤੇ ਦਾ ਸਮਾਂ",
          "PE time / ਪੀ.ਈ. ਦਾ ਸਮਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says it is reading time. / ਕਹਾਣੀ ਵਿੱਚ ਪੜ੍ਹਨ ਦਾ ਸਮਾਂ ਹੈ।"
      },
      {
        "question": "What does the teacher say first? / ਟੀਚਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Open your book / ਕਿਤਾਬ ਖੋਲ੍ਹੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Stand up / ਖੜ੍ਹੇ ਹੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Open your book.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਕਿਤਾਬ ਖੋਲ੍ਹੋ।”"
      },
      {
        "question": "Who reads with the child? / ਬੱਚਾ ਕਿਨ੍ਹਾਂ ਨਾਲ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ?",
        "choices": [
          "friend / ਦੋਸਤ",
          "doctor / ਡਾਕਟਰ",
          "driver / ਡਰਾਈਵਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child reads with a friend. / ਬੱਚਾ ਦੋਸਤ ਨਾਲ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do then? / ਫਿਰ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "answer a question / ਸਵਾਲ ਦਾ ਜਵਾਬ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "jump / ਛਾਲ ਮਾਰਦਾ/ਮਾਰਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child answers one short question. / ਬੱਚਾ ਇੱਕ ਛੋਟਾ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹੈ।"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "close the book / ਕਿਤਾਬ ਬੰਦ",
          "throw the book / ਕਿਤਾਬ ਸੁੱਟਦਾ ਹੈ",
          "hide the book / ਕਿਤਾਬ ਛੁਪਾਉਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, the child closes the book. / ਉਸ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਕਿਤਾਬ ਬੰਦ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "read",
        "meaningEn": "look at words and say them",
        "meaningPa": "ਪੜ੍ਹਨਾ"
      },
      {
        "word": "answer",
        "meaningEn": "reply to a question",
        "meaningPa": "ਜਵਾਬ ਦੇਣਾ"
      },
      {
        "word": "open",
        "meaningEn": "make not closed",
        "meaningPa": "ਖੋਲ੍ਹਣਾ"
      },
      {
        "word": "page",
        "meaningEn": "one side of a book sheet",
        "meaningPa": "ਸਫ਼ਾ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "now",
        "meaningEn": "story word: now",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "reading",
        "meaningEn": "story word: reading",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "open",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S04",
    "bundleId": 2,
    "orderInBundle": 4,
    "titleEn": "Book 2 · Story 4: Writing Time",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 4: ਲਿਖਣ ਦਾ ਸਮਾਂ",
    "englishStory": "Panel 1 (Intro): Now it is writing time today. I have paper and a pencil.\nPanel 2 (Body): First, the teacher says, “Write slowly.” I write my name on paper.\nPanel 3 (Body): Next, I write one short word carefully. My friend writes too.\nPanel 4 (Body): Then the teacher says, “Show me.” I show my paper and smile.\nPanel 5 (Conclusion): After that, I put my pencil away. I feel ready for math time.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਲਿਖਣ ਦਾ ਸਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਗਜ਼ ਅਤੇ ਪੈਂਸਿਲ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਹੌਲੀ ਲਿਖੋ।” ਮੈਂ ਕਾਗਜ਼ ਉੱਤੇ ਆਪਣਾ ਨਾਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਇੱਕ ਛੋਟਾ ਸ਼ਬਦ ਧਿਆਨ ਨਾਲ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ। ਮੇਰਾ ਦੋਸਤ ਵੀ ਲਿਖਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਮੈਨੂੰ ਦਿਖਾਓ।” ਮੈਂ ਆਪਣਾ ਕਾਗਜ਼ ਦਿਖਾਉਂਦਾ/ਦਿਖਾਉਂਦੀ ਹਾਂ ਅਤੇ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਪੈਂਸਿਲ ਵਾਪਸ ਰੱਖ ਦਿੰਦਾ/ਰੱਖ ਦਿੰਦੀ ਹਾਂ। ਮੈਂ ਗਿਣਤੀ ਲਈ ਤਿਆਰ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What time is it now? / ਹੁਣ ਕਿਹੜਾ ਸਮਾਂ ਹੈ?",
        "choices": [
          "writing time / ਲਿਖਣ ਦਾ ਸਮਾਂ",
          "lunch time / ਲੰਚ ਦਾ ਸਮਾਂ",
          "PE time / ਪੀ.ਈ. ਦਾ ਸਮਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says it is writing time. / ਕਹਾਣੀ ਵਿੱਚ ਲਿਖਣ ਦਾ ਸਮਾਂ ਹੈ।"
      },
      {
        "question": "What does the teacher say first? / ਟੀਚਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Write slowly / ਹੌਲੀ ਲਿਖੋ",
          "Run / ਦੌੜੋ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Write slowly.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਹੌਲੀ ਲਿਖੋ।”"
      },
      {
        "question": "What does the child write? / ਬੱਚਾ ਕੀ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ?",
        "choices": [
          "name / ਨਾਮ",
          "banana / ਕੇਲਾ",
          "chair / ਕੁਰਸੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child writes a name on paper. / ਬੱਚਾ ਕਾਗਜ਼ ਉੱਤੇ ਨਾਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say then? / ਫਿਰ ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Show me / ਮੈਨੂੰ ਦਿਖਾਓ",
          "Close the door / ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰੋ",
          "Eat snack / ਨਾਸ਼ਤਾ ਖਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Show me.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਮੈਨੂੰ ਦਿਖਾਓ।”"
      },
      {
        "question": "What is next after writing? / ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਕੀ ਆਉਂਦਾ ਹੈ?",
        "choices": [
          "math time / ਗਿਣਤੀ",
          "bath time / ਨਹਾਉਣਾ",
          "bed time / ਸੌਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child is ready for math time. / ਬੱਚਾ ਗਿਣਤੀ ਲਈ ਤਿਆਰ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "write",
        "meaningEn": "make letters and words",
        "meaningPa": "ਲਿਖਣਾ"
      },
      {
        "word": "paper",
        "meaningEn": "you write on it",
        "meaningPa": "ਕਾਗਜ਼"
      },
      {
        "word": "pencil",
        "meaningEn": "a tool for writing",
        "meaningPa": "ਪੈਂਸਿਲ"
      },
      {
        "word": "show",
        "meaningEn": "let someone see your work",
        "meaningPa": "ਦਿਖਾਉਣਾ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "writes",
        "meaningEn": "action word from the story: writes",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "go",
        "meaningEn": "action word from the story: go",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "now",
        "meaningEn": "story word: now",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "writes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S05",
    "bundleId": 2,
    "orderInBundle": 5,
    "titleEn": "Book 2 · Story 5: Math on the Board",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 5: ਬੋਰਡ ਤੇ ਗਿਣਤੀ",
    "englishStory": "Panel 1 (Intro): Now it is math time today. We sit and look at the board.\nPanel 2 (Body): First, the teacher says, “Look here.” I look and listen carefully.\nPanel 3 (Body): Next, I write numbers on my paper. My pencil moves slowly.\nPanel 4 (Body): Then the teacher says, “Answer now.” I answer and show my paper.\nPanel 5 (Conclusion): After that, I feel happy and ready. We go to art time next.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਗਿਣਤੀ ਦਾ ਸਮਾਂ ਹੈ। ਅਸੀਂ ਬੈਠਦੇ ਹਾਂ ਅਤੇ ਬੋਰਡ ਵੱਲ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਇੱਥੇ ਵੇਖੋ।” ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਕਾਗਜ਼ ਉੱਤੇ ਨੰਬਰ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ। ਮੇਰੀ ਪੈਂਸਿਲ ਹੌਲੀ ਚਲਦੀ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਹੁਣ ਜਵਾਬ ਦਿਓ।” ਮੈਂ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਕਾਗਜ਼ ਦਿਖਾਉਂਦਾ/ਦਿਖਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਖੁਸ਼ ਅਤੇ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਅਸੀਂ ਅਗਲਾ ਆਰਟ ਕਰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What subject is this? / ਇਹ ਕਿਹੜਾ ਵਿਸ਼ਾ ਹੈ?",
        "choices": [
          "math / ਗਿਣਤੀ",
          "music / ਸੰਗੀਤ",
          "reading / ਪੜ੍ਹਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says it is math time. / ਕਹਾਣੀ ਵਿੱਚ ਗਿਣਤੀ ਦਾ ਸਮਾਂ ਹੈ।"
      },
      {
        "question": "What do children look at? / ਬੱਚੇ ਕਿੱਧਰ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "board / ਬੋਰਡ",
          "bed / ਬਿਸਤਰ",
          "window / ਖਿੜਕੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They look at the board during math. / ਉਹ ਗਿਣਤੀ ਵੇਲੇ ਬੋਰਡ ਵੱਲ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "What does the child write? / ਬੱਚਾ ਕੀ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ?",
        "choices": [
          "numbers / ਨੰਬਰ",
          "shoes / ਜੁੱਤੇ",
          "bananas / ਕੇਲੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child writes numbers on paper. / ਬੱਚਾ ਕਾਗਜ਼ ਉੱਤੇ ਨੰਬਰ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say then? / ਫਿਰ ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Answer now / ਹੁਣ ਜਵਾਬ ਦਿਓ",
          "Go home / ਘਰ ਜਾਓ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Answer now.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਹੁਣ ਜਵਾਬ ਦਿਓ।”"
      },
      {
        "question": "What comes next? / ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "art time / ਆਰਟ",
          "bathroom / ਬਾਥਰੂਮ",
          "bed / ਬਿਸਤਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After math, they go to art time. / ਗਿਣਤੀ ਤੋਂ ਬਾਅਦ ਆਰਟ ਹੁੰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "board",
        "meaningEn": "the teacher writes here",
        "meaningPa": "ਬੋਰਡ"
      },
      {
        "word": "math",
        "meaningEn": "numbers at school",
        "meaningPa": "ਗਿਣਤੀ"
      },
      {
        "word": "number",
        "meaningEn": "1, 2, 3 and more",
        "meaningPa": "ਨੰਬਰ"
      },
      {
        "word": "listen",
        "meaningEn": "hear with attention",
        "meaningPa": "ਸੁਣਨਾ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "look",
        "meaningEn": "action word from the story: look",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "write",
        "meaningEn": "action word from the story: write",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S06",
    "bundleId": 2,
    "orderInBundle": 6,
    "titleEn": "Book 2 · Story 6: Science Helpers",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 6: ਸਾਇੰਸ ਵਿੱਚ ਮਦਦ",
    "englishStory": "Panel 1 (Intro): Now it is science time today. I sit and feel curious.\nPanel 2 (Body): First, the teacher says, “Look and listen.” I look at the board.\nPanel 3 (Body): Next, I ask one small question kindly. My teacher helps me.\nPanel 4 (Body): Then the teacher says, “Try it.” I try and say, “Okay.”\nPanel 5 (Conclusion): After that, I smile and feel proud. I always listen and learn.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਇੰਸ ਦਾ ਸਮਾਂ ਹੈ। ਮੈਂ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ ਅਤੇ ਦਿਲਚਸਪੀ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਵੇਖੋ ਅਤੇ ਸੁਣੋ।” ਮੈਂ ਬੋਰਡ ਵੱਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਨਮਰਤਾ ਨਾਲ ਇੱਕ ਛੋਟਾ ਸਵਾਲ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ। ਮੇਰਾ ਟੀਚਰ ਮੇਰੀ ਮਦਦ ਕਰਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਕਰ ਕੇ ਵੇਖੋ।” ਮੈਂ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, “ਠੀਕ ਹੈ।”\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਹਮੇਸ਼ਾ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ ਅਤੇ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What time is it now? / ਹੁਣ ਕਿਹੜਾ ਸਮਾਂ ਹੈ?",
        "choices": [
          "science time / ਸਾਇੰਸ",
          "lunch time / ਲੰਚ",
          "PE time / ਪੀ.ਈ."
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says it is science time. / ਕਹਾਣੀ ਵਿੱਚ ਸਾਇੰਸ ਦਾ ਸਮਾਂ ਹੈ।"
      },
      {
        "question": "What does the teacher say first? / ਟੀਚਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Look and listen / ਵੇਖੋ ਅਤੇ ਸੁਣੋ",
          "Run / ਦੌੜੋ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Look and listen.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਵੇਖੋ ਅਤੇ ਸੁਣੋ।”"
      },
      {
        "question": "What does the child do next? / ਫਿਰ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "asks a question / ਸਵਾਲ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ",
          "cries / ਰੋਂਦਾ/ਰੋਂਦੀ ਹੈ",
          "hides / ਛੁਪਦਾ/ਛੁਪਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child asks a small question. / ਬੱਚਾ ਇੱਕ ਛੋਟਾ ਸਵਾਲ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "Who helps the child? / ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "teacher / ਟੀਚਰ",
          "driver / ਡਰਾਈਵਰ",
          "farmer / ਕਿਸਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher helps the child. / ਟੀਚਰ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "What does the child always do? / ਬੱਚਾ ਹਮੇਸ਼ਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "listen / ਸੁਣਦਾ/ਸੁਣਦੀ ਹੈ",
          "shout / ਚੀਕਦਾ/ਚੀਕਦੀ ਹੈ",
          "run away / ਭੱਜ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child says, “I always listen and learn.” / ਬੱਚਾ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, “ਮੈਂ ਹਮੇਸ਼ਾ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ।”"
      }
    ],
    "vocabularyWords": [
      {
        "word": "listen",
        "meaningEn": "use your ears to hear",
        "meaningPa": "ਸੁਣਨਾ"
      },
      {
        "word": "ask",
        "meaningEn": "say a question",
        "meaningPa": "ਪੁੱਛਣਾ"
      },
      {
        "word": "help",
        "meaningEn": "do something to make it easier",
        "meaningPa": "ਮਦਦ ਕਰਨੀ"
      },
      {
        "word": "curious",
        "meaningEn": "wanting to learn or know more",
        "meaningPa": "ਉਤਸੁਕ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "look",
        "meaningEn": "action word from the story: look",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "helps",
        "meaningEn": "action word from the story: helps",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S07",
    "bundleId": 2,
    "orderInBundle": 7,
    "titleEn": "Book 2 · Story 7: Art Time Sharing",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 7: ਆਰਟ ਵਿੱਚ ਸਾਂਝਾ ਕਰਨਾ",
    "englishStory": "Panel 1 (Intro): Now it is art time today. I sit at the table.\nPanel 2 (Body): First, I take a crayon and paper. I draw a big circle.\nPanel 3 (Body): Next, my friend wants a crayon. I share and help my friend.\nPanel 4 (Body): Then the teacher says, “Take turns.” We wait and draw again.\nPanel 5 (Conclusion): After that, we clean the table nicely. Our pictures look great now.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਆਰਟ ਦਾ ਸਮਾਂ ਹੈ। ਮੈਂ ਮੇਜ਼ ਤੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕ੍ਰੇਯੋਨ ਅਤੇ ਕਾਗਜ਼ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ। ਮੈਂ ਇੱਕ ਵੱਡਾ ਗੋਲ ਬਣਾਉਂਦਾ/ਬਣਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੇਰਾ ਦੋਸਤ ਕ੍ਰੇਯੋਨ ਮੰਗਦਾ ਹੈ। ਮੈਂ ਸਾਂਝਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਦੋਸਤ ਦੀ ਮਦਦ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਵਾਰੀ-ਵਾਰੀ ਕਰੋ।” ਅਸੀਂ ਉਡੀਕ ਕਰਦੇ ਹਾਂ ਅਤੇ ਫਿਰ ਬਣਾਉਂਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਮੇਜ਼ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਾਫ਼ ਕਰਦੇ ਹਾਂ। ਸਾਡੀਆਂ ਤਸਵੀਰਾਂ ਸੋਹਣੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।",
    "multipleChoiceQuestions": [
      {
        "question": "What time is it now? / ਹੁਣ ਕਿਹੜਾ ਸਮਾਂ ਹੈ?",
        "choices": [
          "art time / ਆਰਟ",
          "math time / ਗਿਣਤੀ",
          "bathroom / ਬਾਥਰੂਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says it is art time. / ਕਹਾਣੀ ਵਿੱਚ ਆਰਟ ਦਾ ਸਮਾਂ ਹੈ।"
      },
      {
        "question": "What does the child take first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਲੈਂਦਾ/ਲੈਂਦੀ ਹੈ?",
        "choices": [
          "crayon and paper / ਕ੍ਰੇਯੋਨ ਅਤੇ ਕਾਗਜ਼",
          "milk and cup / ਦੁੱਧ ਅਤੇ ਕੱਪ",
          "book and board / ਕਿਤਾਬ ਅਤੇ ਬੋਰਡ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child takes a crayon and paper. / ਬੱਚਾ ਕ੍ਰੇਯੋਨ ਅਤੇ ਕਾਗਜ਼ ਲੈਂਦਾ/ਲੈਂਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do next? / ਫਿਰ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "shares / ਸਾਂਝਾ ਕਰਦਾ/ਕਰਦੀ ਹੈ",
          "hides / ਛੁਪਾਉਂਦਾ/ਛੁਪਾਉਂਦੀ ਹੈ",
          "breaks / ਤੋੜਦਾ/ਤੋੜਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child shares the crayon with a friend. / ਬੱਚਾ ਦੋਸਤ ਨਾਲ ਕ੍ਰੇਯੋਨ ਸਾਂਝਾ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say then? / ਫਿਰ ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Take turns / ਵਾਰੀ-ਵਾਰੀ ਕਰੋ",
          "Run / ਦੌੜੋ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Take turns.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਵਾਰੀ-ਵਾਰੀ ਕਰੋ।”"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "clean the table / ਮੇਜ਼ ਸਾਫ਼",
          "go home / ਘਰ",
          "go to bed / ਬਿਸਤਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After art, they clean the table. / ਆਰਟ ਤੋਂ ਬਾਅਦ ਉਹ ਮੇਜ਼ ਸਾਫ਼ ਕਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "crayon",
        "meaningEn": "a colored stick for drawing",
        "meaningPa": "ਕ੍ਰੇਯੋਨ"
      },
      {
        "word": "share",
        "meaningEn": "let someone else use it too",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ"
      },
      {
        "word": "clean",
        "meaningEn": "make something tidy",
        "meaningPa": "ਸਾਫ਼ ਕਰਨਾ"
      },
      {
        "word": "draw",
        "meaningEn": "make a picture",
        "meaningPa": "ਚਿੱਤਰ ਬਣਾਉਣਾ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "help",
        "meaningEn": "action word from the story: help",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "now",
        "meaningEn": "story word: now",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "draw",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S08",
    "bundleId": 2,
    "orderInBundle": 8,
    "titleEn": "Book 2 · Story 8: Bathroom Break",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 8: ਬਾਥਰੂਮ ਬ੍ਰੇਕ",
    "englishStory": "Panel 1 (Intro): I need the bathroom during class. I want to follow the rule.\nPanel 2 (Body): First, I raise my hand and ask. The teacher says, “Go now.”\nPanel 3 (Body): Next, I walk to the bathroom quietly. I wait in line for my turn.\nPanel 4 (Body): Then I come back to class calmly. The teacher says, “Sit down.”\nPanel 5 (Conclusion): After that, I sit and listen again. I feel ready to work now.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਕਲਾਸ ਦੌਰਾਨ ਮੈਨੂੰ ਬਾਥਰੂਮ ਜਾਣਾ ਹੈ। ਮੈਂ ਨਿਯਮ ਮੰਨਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੱਥ ਚੁੱਕ ਕੇ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ। ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਹੁਣ ਜਾਓ।”\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਚੁੱਪਚਾਪ ਬਾਥਰੂਮ ਵੱਲ ਤੁਰਦਾ/ਤੁਰਦੀ ਹਾਂ। ਮੈਂ ਆਪਣੀ ਵਾਰੀ ਲਈ ਕਤਾਰ ਵਿੱਚ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਸ਼ਾਂਤ ਹੋ ਕੇ ਕਲਾਸ ਵਿੱਚ ਵਾਪਸ ਆਉਂਦਾ/ਆਉਂਦੀ ਹਾਂ। ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਬੈਠ ਜਾਓ।”\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਬੈਠ ਕੇ ਫਿਰ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ। ਹੁਣ ਮੈਂ ਕੰਮ ਲਈ ਤਿਆਰ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child need to go? / ਬੱਚੇ ਨੂੰ ਕਿੱਥੇ ਜਾਣਾ ਹੈ?",
        "choices": [
          "bathroom / ਬਾਥਰੂਮ",
          "bank / ਬੈਂਕ",
          "park / ਪਾਰਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child needs the bathroom. / ਬੱਚੇ ਨੂੰ ਬਾਥਰੂਮ ਜਾਣਾ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "asks the teacher / ਟੀਚਰ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ",
          "runs / ਦੌੜਦਾ/ਦੌੜਦੀ ਹੈ",
          "hides / ਛੁਪਦਾ/ਛੁਪਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, the child asks the teacher. / ਪਹਿਲਾਂ ਬੱਚਾ ਟੀਚਰ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "How does the child walk? / ਬੱਚਾ ਕਿਵੇਂ ਤੁਰਦਾ/ਤੁਰਦੀ ਹੈ?",
        "choices": [
          "quietly / ਚੁੱਪਚਾਪ",
          "loudly / ਸ਼ੋਰ ਨਾਲ",
          "jumping / ਛਾਲਾਂ ਮਾਰ ਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child walks quietly to the bathroom. / ਬੱਚਾ ਚੁੱਪਚਾਪ ਬਾਥਰੂਮ ਤੁਰਦਾ/ਤੁਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say then? / ਫਿਰ ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Sit down / ਬੈਠ ਜਾਓ",
          "Eat snack / ਨਾਸ਼ਤਾ ਖਾਓ",
          "Close the window / ਖਿੜਕੀ ਬੰਦ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Sit down.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਬੈਠ ਜਾਓ।”"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "the child listens / ਬੱਚਾ ਸੁਣਦਾ/ਸੁਣਦੀ ਹੈ",
          "the child sleeps / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "the child runs away / ਭੱਜ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, the child sits and listens again. / ਉਸ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਬੈਠ ਕੇ ਸੁਣਦਾ/ਸੁਣਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bathroom",
        "meaningEn": "a room for washing and toilet",
        "meaningPa": "ਬਾਥਰੂਮ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until your turn",
        "meaningPa": "ਉਡੀਕ ਕਰਨੀ"
      },
      {
        "word": "rule",
        "meaningEn": "a classroom rule",
        "meaningPa": "ਨਿਯਮ"
      },
      {
        "word": "raise",
        "meaningEn": "lift up",
        "meaningPa": "ਉੱਪਰ ਚੁੱਕਣਾ"
      },
      {
        "word": "go",
        "meaningEn": "action word from the story: go",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "walk",
        "meaningEn": "action word from the story: walk",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "sit",
        "meaningEn": "action word from the story: sit",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "look",
        "meaningEn": "action word from the story: look",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S09",
    "bundleId": 2,
    "orderInBundle": 9,
    "titleEn": "Book 2 · Story 9: PE Run and Stop",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 9: ਪੀ.ਈ. ਦੌੜੋ ਅਤੇ ਰੁੱਕੋ",
    "englishStory": "Panel 1 (Intro): Now it is PE time today. We go outside with the teacher.\nPanel 2 (Body): First, the teacher says, “Stand up.” We stand up in a line.\nPanel 3 (Body): Next, the teacher says, “Run.” We run fast for a short time.\nPanel 4 (Body): Then the teacher says, “Stop.” We stop and walk slowly back.\nPanel 5 (Conclusion): After that, we come back to class. We feel calm and ready again.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਪੀ.ਈ. ਦਾ ਸਮਾਂ ਹੈ। ਅਸੀਂ ਟੀਚਰ ਨਾਲ ਬਾਹਰ ਜਾਂਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਖੜ੍ਹੇ ਹੋ ਜਾਓ।” ਅਸੀਂ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹੇ ਹੋ ਜਾਂਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਦੌੜੋ।” ਅਸੀਂ ਥੋੜ੍ਹੀ ਦੇਰ ਤੇਜ਼ ਦੌੜਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਰੁੱਕੋ।” ਅਸੀਂ ਰੁਕਦੇ ਹਾਂ ਅਤੇ ਹੌਲੀ ਵਾਪਸ ਤੁਰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਵਾਪਸ ਕਲਾਸ ਵਿੱਚ ਆਉਂਦੇ ਹਾਂ। ਅਸੀਂ ਸ਼ਾਂਤ ਅਤੇ ਤਿਆਰ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go for PE? / ਪੀ.ਈ. ਲਈ ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "outside / ਬਾਹਰ",
          "bathroom / ਬਾਥਰੂਮ",
          "bedroom / ਸੋਣ ਵਾਲਾ ਕਮਰਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They go outside with the teacher. / ਉਹ ਟੀਚਰ ਨਾਲ ਬਾਹਰ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "What does the teacher say first? / ਟੀਚਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Stand up / ਖੜ੍ਹੇ ਹੋ ਜਾਓ",
          "Eat / ਖਾਓ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Stand up.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਖੜ੍ਹੇ ਹੋ ਜਾਓ।”"
      },
      {
        "question": "What do they do next? / ਫਿਰ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "run / ਦੌੜਦੇ ਹਨ",
          "write / ਲਿਖਦੇ ਹਨ",
          "read / ਪੜ੍ਹਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Next, they run fast. / ਫਿਰ ਉਹ ਤੇਜ਼ ਦੌੜਦੇ ਹਨ।"
      },
      {
        "question": "What does the teacher say then? / ਫਿਰ ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Stop / ਰੁੱਕੋ",
          "Sing / ਗਾਓ",
          "Close / ਬੰਦ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Then the teacher says, “Stop.” / ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਰੁੱਕੋ।”"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "back to class / ਵਾਪਸ ਕਲਾਸ",
          "go home / ਘਰ",
          "go to bed / ਬਿਸਤਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, they come back to class. / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕਲਾਸ ਵਿੱਚ ਵਾਪਸ ਆਉਂਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "stand up",
        "meaningEn": "rise to your feet",
        "meaningPa": "ਖੜ੍ਹੇ ਹੋਣਾ"
      },
      {
        "word": "run",
        "meaningEn": "move fast on your feet",
        "meaningPa": "ਦੌੜਨਾ"
      },
      {
        "word": "stop",
        "meaningEn": "do not move",
        "meaningPa": "ਰੁਕਣਾ"
      },
      {
        "word": "outside",
        "meaningEn": "not inside a building",
        "meaningPa": "ਬਾਹਰ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "go",
        "meaningEn": "action word from the story: go",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "stand",
        "meaningEn": "action word from the story: stand",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "walk",
        "meaningEn": "action word from the story: walk",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B2_S10",
    "bundleId": 2,
    "orderInBundle": 10,
    "titleEn": "Book 2 · Story 10: Before We Go Home",
    "titlePa": "ਕਿਤਾਬ 2 · ਕਹਾਣੀ 10: ਘਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ",
    "englishStory": "Panel 1 (Intro): It is afternoon now at school. The day is almost done.\nPanel 2 (Body): First, the teacher says, “Clean your desk.” I pick up paper and pencil.\nPanel 3 (Body): Next, I put my book and eraser in my bag. I close my bag carefully.\nPanel 4 (Body): Then we stand up and line up at the door. The teacher says, “Wait.”\nPanel 5 (Conclusion): After school, I go home with my family. I usually eat snack and read again.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਹੁਣ ਸਕੂਲ ਵਿੱਚ ਦੁਪਹਿਰ ਹੈ। ਦਿਨ ਲਗਭਗ ਮੁੱਕ ਗਿਆ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਡੈਸਕ ਸਾਫ਼ ਕਰੋ।” ਮੈਂ ਕਾਗਜ਼ ਅਤੇ ਪੈਂਸਿਲ ਚੁੱਕਦਾ/ਚੁੱਕਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਕਿਤਾਬ ਅਤੇ ਰੱਬੜ ਬੈਗ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਮੈਂ ਬੈਗ ਧਿਆਨ ਨਾਲ ਬੰਦ ਕਰਦਾ/ਬੰਦ ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਖੜ੍ਹੇ ਹੋ ਕੇ ਦਰਵਾਜ਼ੇ ਤੇ ਕਤਾਰ ਬਣਾਉਂਦੇ ਹਾਂ। ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਉਡੀਕ ਕਰੋ।”\nਪੈਨਲ 5 (ਅੰਤ): ਸਕੂਲ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਪਰਿਵਾਰ ਨਾਲ ਘਰ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਮੈਂ ਆਮ ਤੌਰ ਤੇ ਨਾਸ਼ਤਾ ਖਾਂਦਾ/ਖਾਂਦੀ ਹਾਂ ਅਤੇ ਫਿਰ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "When is it in the story? / ਕਹਾਣੀ ਵਿੱਚ ਕਦੋਂ ਹੈ?",
        "choices": [
          "afternoon / ਦੁਪਹਿਰ",
          "night / ਰਾਤ",
          "winter / ਸਰਦੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says it is afternoon. / ਪੈਨਲ 1 ਵਿੱਚ ਦੁਪਹਿਰ ਹੈ।"
      },
      {
        "question": "What does the teacher say first? / ਟੀਚਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Clean your desk / ਡੈਸਕ ਸਾਫ਼ ਕਰੋ",
          "Run / ਦੌੜੋ",
          "Sleep / ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The teacher says, “Clean your desk.” / ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, “ਡੈਸਕ ਸਾਫ਼ ਕਰੋ।”"
      },
      {
        "question": "What goes in the bag next? / ਫਿਰ ਬੈਗ ਵਿੱਚ ਕੀ ਜਾਂਦਾ ਹੈ?",
        "choices": [
          "book and eraser / ਕਿਤਾਬ ਅਤੇ ਰੱਬੜ",
          "milk and cup / ਦੁੱਧ ਅਤੇ ਕੱਪ",
          "shoes and hat / ਜੁੱਤੇ ਅਤੇ ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child puts a book and eraser in the bag. / ਬੱਚਾ ਕਿਤਾਬ ਅਤੇ ਰੱਬੜ ਬੈਗ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ।"
      },
      {
        "question": "Where do children line up then? / ਫਿਰ ਬੱਚੇ ਕਿੱਥੇ ਕਤਾਰ ਬਣਾਉਂਦੇ ਹਨ?",
        "choices": [
          "at the door / ਦਰਵਾਜ਼ੇ ਤੇ",
          "under the desk / ਡੈਸਕ ਹੇਠਾਂ",
          "in the bathroom / ਬਾਥਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They line up at the door and wait. / ਉਹ ਦਰਵਾਜ਼ੇ ਤੇ ਕਤਾਰ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਉਡੀਕ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "What does the child usually do at home? / ਘਰ ਬੱਚਾ ਆਮ ਤੌਰ ਤੇ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "eats snack and reads / ਨਾਸ਼ਤਾ ਖਾਂਦਾ/ਖਾਂਦੀ ਅਤੇ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ",
          "drives a car / ਗੱਡੀ ਚਲਾਉਂਦਾ ਹੈ",
          "cooks dinner / ਖਾਣਾ ਬਣਾਉਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child usually eats snack and reads again. / ਪੈਨਲ 5 ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ਨਾਸ਼ਤਾ ਖਾਂਦਾ/ਖਾਂਦੀ ਅਤੇ ਫਿਰ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "before",
        "meaningEn": "earlier than something",
        "meaningPa": "ਤੋਂ ਪਹਿਲਾਂ"
      },
      {
        "word": "after",
        "meaningEn": "later; when something is finished",
        "meaningPa": "ਤੋਂ ਬਾਅਦ"
      },
      {
        "word": "snack",
        "meaningEn": "a small meal",
        "meaningPa": "ਨਾਸ਼ਤਾ"
      },
      {
        "word": "afternoon",
        "meaningEn": "the time after noon",
        "meaningPa": "ਦੁਪਹਿਰ"
      },
      {
        "word": "is",
        "meaningEn": "action word from the story: is",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "clean",
        "meaningEn": "action word from the story: clean",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "stand",
        "meaningEn": "action word from the story: stand",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "go",
        "meaningEn": "action word from the story: go",
        "meaningPa": "ਕਿਰਿਆ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "clean",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK3_CUSTOM_STORIES = [
  {
    "storyId": "B3_S01",
    "bundleId": 3,
    "orderInBundle": 1,
    "titleEn": "Book 3 · Story 1: Turn Left to the Park",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 1: ਪਾਰਕ ਲਈ ਖੱਬੇ ਮੁੜੋ",
    "englishStory": "Panel 1 (Intro): It is morning, and I go to the park today. My friend walks with me and holds my hand.\nPanel 2 (Body): First, we go straight on the main street. We stop near the store and look for signs.\nPanel 3 (Body): Next, we turn left at the big store. The park is next to the store, very close.\nPanel 4 (Body): Then my friend says, \"Turn left and walk.\" We walk slowly and watch for the park gate.\nPanel 5 (Conclusion): After that, we arrive at the park gate. We play on the swings and feel very happy.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਵੇਰ ਹੈ, ਅਤੇ ਮੈਂ ਪਾਰਕ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਮੇਰਾ ਦੋਸਤ ਮੇਰੇ ਨਾਲ ਤੁਰਦਾ ਹੈ ਅਤੇ ਹੱਥ ਫੜਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਮੁੱਖ ਗਲੀ ਵਿੱਚ ਸਿੱਧੇ ਤੁਰਦੇ ਹਾਂ। ਅਸੀਂ ਦੁਕਾਨ ਦੇ ਨੇੜੇ ਰੁਕ ਕੇ ਸਾਈਨ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਅਸੀਂ ਵੱਡੀ ਦੁਕਾਨ ਤੋਂ ਖੱਬੇ ਮੁੜਦੇ ਹਾਂ। ਪਾਰਕ ਦੁਕਾਨ ਦੇ ਕੋਲ ਹੈ, ਬਹੁਤ ਨੇੜੇ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਖੱਬੇ ਮੁੜੋ ਅਤੇ ਤੁਰੋ।\" ਅਸੀਂ ਹੌਲੀ ਤੁਰਦੇ ਹਾਂ ਅਤੇ ਗੇਟ ਲੱਭਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਪਾਰਕ ਦੇ ਗੇਟ ਤੇ ਪਹੁੰਚਦੇ ਹਾਂ। ਅਸੀਂ ਝੂਲੇ ਤੇ ਖੇਡਦੇ ਹਾਂ ਅਤੇ ਬਹੁਤ ਖੁਸ਼ ਹੁੰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go today? / ਅੱਜ ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "park / ਪਾਰਕ",
          "hospital / ਹਸਪਤਾਲ",
          "library / ਲਾਇਬ੍ਰੇਰੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They go to the park today. / ਉਹ ਅੱਜ ਪਾਰਕ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "What do they do first? / ਉਹ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "go straight / ਸਿੱਧੇ ਜਾਂਦੇ ਹਨ",
          "turn right / ਸੱਜੇ ਮੁੜਦੇ ਹਨ",
          "sit down / ਬੈਠ ਜਾਂਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, they go straight on the street. / ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਉਹ ਗਲੀ ਵਿੱਚ ਸਿੱਧੇ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "Which way do they turn? / ਉਹ ਕਿਹੜੇ ਪਾਸੇ ਮੁੜਦੇ ਹਨ?",
        "choices": [
          "left / ਖੱਬੇ",
          "right / ਸੱਜੇ",
          "back / ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They turn left at the big store. / ਉਹ ਵੱਡੀ ਦੁਕਾਨ ਤੋਂ ਖੱਬੇ ਮੁੜਦੇ ਹਨ।"
      },
      {
        "question": "Where is the park? / ਪਾਰਕ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "next to the store / ਦੁਕਾਨ ਦੇ ਕੋਲ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "behind the bus / ਬੱਸ ਦੇ ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The park is next to the store. / ਪਾਰਕ ਦੁਕਾਨ ਦੇ ਕੋਲ ਹੈ।"
      },
      {
        "question": "What do they do after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "play on swings / ਝੂਲੇ ਤੇ ਖੇਡਦੇ ਹਨ",
          "buy food / ਖਾਣਾ ਖਰੀਦਦੇ ਹਨ",
          "go to bed / ਬਿਸਤਰ ਤੇ ਜਾਂਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, they arrive and play. / ਉਸ ਤੋਂ ਬਾਅਦ, ਉਹ ਪਹੁੰਚ ਕੇ ਖੇਡਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "park",
        "meaningEn": "a place to play outside",
        "meaningPa": "ਪਾਰਕ"
      },
      {
        "word": "left",
        "meaningEn": "the direction opposite of right",
        "meaningPa": "ਖੱਬੇ"
      },
      {
        "word": "next to",
        "meaningEn": "beside; very near",
        "meaningPa": "ਦੇ ਕੋਲ"
      },
      {
        "word": "gate",
        "meaningEn": "an entrance door to a place",
        "meaningPa": "ਗੇਟ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "morning",
        "meaningEn": "story word: morning",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "and",
        "meaningEn": "story word: and",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "the",
        "meaningEn": "story word: the",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S02",
    "bundleId": 3,
    "orderInBundle": 2,
    "titleEn": "Book 3 · Story 2: Bus Stop to School",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 2: ਬੱਸ ਸਟਾਪ ਤੋਂ ਸਕੂਲ",
    "englishStory": "Panel 1 (Intro): It is morning, and I go to school by bus. I wait at the bus stop with two friends.\nPanel 2 (Body): First, we stand in line and hold our bags. We stay quiet, and we watch the road.\nPanel 3 (Body): Next, the bus stops right in front of us. The driver opens the door and smiles kindly.\nPanel 4 (Body): Then the driver says, \"Step in and sit.\" We sit down and ride straight to school.\nPanel 5 (Conclusion): After that, we get off near the school gate. We wave goodbye and walk into our classroom.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਸਵੇਰ ਹੈ, ਅਤੇ ਮੈਂ ਬੱਸ ਨਾਲ ਸਕੂਲ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਮੈਂ ਦੋ ਦੋਸਤਾਂ ਨਾਲ ਬੱਸ ਸਟਾਪ ਤੇ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਬੈਗ ਫੜਦੇ ਹਾਂ। ਅਸੀਂ ਚੁੱਪ ਰਹਿੰਦੇ ਹਾਂ ਅਤੇ ਸੜਕ ਵੱਲ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਬੱਸ ਸਾਡੇ ਸਾਹਮਣੇ ਰੁਕਦੀ ਹੈ। ਡਰਾਈਵਰ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ ਹੈ ਅਤੇ ਮੁਸਕੁਰਾਉਂਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਡਰਾਈਵਰ ਕਹਿੰਦਾ ਹੈ, \"ਅੰਦਰ ਆਓ ਅਤੇ ਬੈਠ ਜਾਓ।\" ਅਸੀਂ ਬੈਠ ਜਾਂਦੇ ਹਾਂ ਅਤੇ ਸਿੱਧੇ ਸਕੂਲ ਜਾਂਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਸਕੂਲ ਦੇ ਗੇਟ ਦੇ ਨੇੜੇ ਉਤਰਦੇ ਹਾਂ। ਅਸੀਂ ਬਾਇ-ਬਾਇ ਕਰਦੇ ਹਾਂ ਅਤੇ ਕਲਾਸ ਵਿੱਚ ਤੁਰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child wait? / ਬੱਚਾ ਕਿੱਥੇ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "bus stop / ਬੱਸ ਸਟਾਪ",
          "park / ਪਾਰਕ",
          "bank / ਬੈਂਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child waits at the bus stop. / ਬੱਚਾ ਬੱਸ ਸਟਾਪ ਤੇ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What do they do first? / ਉਹ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "stand in line / ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਨ",
          "turn left / ਖੱਬੇ ਮੁੜਦੇ ਹਨ",
          "buy fruit / ਫਲ ਖਰੀਦਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, they stand in line. / ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਉਹ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਨ।"
      },
      {
        "question": "Where does the bus stop? / ਬੱਸ ਕਿੱਥੇ ਰੁਕਦੀ ਹੈ?",
        "choices": [
          "in front of them / ਉਹਨਾਂ ਦੇ ਸਾਹਮਣੇ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "behind the store / ਦੁਕਾਨ ਦੇ ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The bus stops right in front of them. / ਬੱਸ ਉਹਨਾਂ ਦੇ ਸਾਹਮਣੇ ਰੁਕਦੀ ਹੈ।"
      },
      {
        "question": "What does the driver say? / ਡਰਾਈਵਰ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Step in and sit / ਅੰਦਰ ਆਓ ਤੇ ਬੈਠੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Be quiet / ਚੁੱਪ ਰਹੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The driver says, \"Step in and sit.\" / ਡਰਾਈਵਰ ਕਹਿੰਦਾ ਹੈ, \"ਅੰਦਰ ਆਓ ਤੇ ਬੈਠੋ।\""
      },
      {
        "question": "Where do they get off? / ਉਹ ਕਿੱਥੇ ਉਤਰਦੇ ਹਨ?",
        "choices": [
          "near the school gate / ਸਕੂਲ ਗੇਟ ਦੇ ਨੇੜੇ",
          "at the market / ਮਾਰਕੀਟ ਤੇ",
          "at the park / ਪਾਰਕ ਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They get off near the school gate. / ਉਹ ਸਕੂਲ ਗੇਟ ਦੇ ਨੇੜੇ ਉਤਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bus stop",
        "meaningEn": "a place to wait for a bus",
        "meaningPa": "ਬੱਸ ਸਟਾਪ"
      },
      {
        "word": "driver",
        "meaningEn": "a person who drives a bus",
        "meaningPa": "ਡਰਾਈਵਰ"
      },
      {
        "word": "straight",
        "meaningEn": "forward, not left or right",
        "meaningPa": "ਸਿੱਧਾ"
      },
      {
        "word": "line",
        "meaningEn": "people standing one behind another",
        "meaningPa": "ਕਤਾਰ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "morning",
        "meaningEn": "story word: morning",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "and",
        "meaningEn": "story word: and",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "school",
        "meaningEn": "story word: school",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "bus",
        "meaningEn": "story word: bus",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S03",
    "bundleId": 3,
    "orderInBundle": 3,
    "titleEn": "Book 3 · Story 3: Market Map",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 3: ਮਾਰਕੀਟ ਦਾ ਨਕਸ਼ਾ",
    "englishStory": "Panel 1 (Intro): Today we go to the market to buy fruit. The market is busy, but we stay together.\nPanel 2 (Body): First, we walk to the store on the corner. I look at apples and point to red ones.\nPanel 3 (Body): Next, the bank is across from the store. The park is behind the bank, very quiet.\nPanel 4 (Body): Then Mom says, \"Turn right and go straight.\" We turn right and walk straight to the fruit stand.\nPanel 5 (Conclusion): After that, we buy apples and bananas. We say, \"Thank you,\" and carry our bag home.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਫਲ ਖਰੀਦਣ ਲਈ ਮਾਰਕੀਟ ਜਾਂਦੇ ਹਾਂ। ਮਾਰਕੀਟ ਭੀੜ ਵਾਲੀ ਹੈ, ਪਰ ਅਸੀਂ ਇਕੱਠੇ ਰਹਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਕੋਣੇ ਵਾਲੀ ਦੁਕਾਨ ਤੱਕ ਤੁਰਦੇ ਹਾਂ। ਮੈਂ ਸੇਬ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਲਾਲ ਵਾਲੇ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਬੈਂਕ ਦੁਕਾਨ ਦੇ ਸਾਹਮਣੇ ਹੈ। ਪਾਰਕ ਬੈਂਕ ਦੇ ਪਿੱਛੇ ਹੈ ਅਤੇ ਸ਼ਾਂਤ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਸੱਜੇ ਮੁੜੋ ਅਤੇ ਸਿੱਧੇ ਜਾਓ।\" ਅਸੀਂ ਸੱਜੇ ਮੁੜਦੇ ਹਾਂ ਅਤੇ ਫਲ ਵਾਲੀ ਥਾਂ ਤੱਕ ਤੁਰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਸੇਬ ਅਤੇ ਕੇਲੇ ਖਰੀਦਦੇ ਹਾਂ। ਅਸੀਂ \"ਥੈਂਕ ਯੂ\" ਕਹਿੰਦੇ ਹਾਂ ਅਤੇ ਬੈਗ ਘਰ ਲੈ ਜਾਂਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go today? / ਅੱਜ ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "market / ਮਾਰਕੀਟ",
          "hospital / ਹਸਪਤਾਲ",
          "school / ਸਕੂਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They go to the market today. / ਉਹ ਅੱਜ ਮਾਰਕੀਟ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "Where is the bank? / ਬੈਂਕ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "across from the store / ਦੁਕਾਨ ਦੇ ਸਾਹਮਣੇ",
          "under the bed / ਬਿਸਤਰ ਹੇਠਾਂ",
          "in the bus / ਬੱਸ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The bank is across from the store. / ਬੈਂਕ ਦੁਕਾਨ ਦੇ ਸਾਹਮਣੇ ਹੈ।"
      },
      {
        "question": "Which way do they turn? / ਉਹ ਕਿਹੜੇ ਪਾਸੇ ਮੁੜਦੇ ਹਨ?",
        "choices": [
          "right / ਸੱਜੇ",
          "left / ਖੱਬੇ",
          "back / ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Mom says to turn right. / ਮਾਂ ਸੱਜੇ ਮੁੜਨ ਲਈ ਕਹਿੰਦੀ ਹੈ।"
      },
      {
        "question": "Where is the park? / ਪਾਰਕ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "behind the bank / ਬੈਂਕ ਦੇ ਪਿੱਛੇ",
          "next to the bus / ਬੱਸ ਦੇ ਕੋਲ",
          "in front of the bed / ਬਿਸਤਰ ਦੇ ਸਾਹਮਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The park is behind the bank. / ਪਾਰਕ ਬੈਂਕ ਦੇ ਪਿੱਛੇ ਹੈ।"
      },
      {
        "question": "What do they buy? / ਉਹ ਕੀ ਖਰੀਦਦੇ ਹਨ?",
        "choices": [
          "apples and bananas / ਸੇਬ ਤੇ ਕੇਲੇ",
          "tickets / ਟਿਕਟਾਂ",
          "shoes / ਜੁੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They buy apples and bananas. / ਉਹ ਸੇਬ ਅਤੇ ਕੇਲੇ ਖਰੀਦਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "market",
        "meaningEn": "a place to buy food",
        "meaningPa": "ਮਾਰਕੀਟ"
      },
      {
        "word": "across from",
        "meaningEn": "on the other side",
        "meaningPa": "ਦੇ ਸਾਹਮਣੇ"
      },
      {
        "word": "buy",
        "meaningEn": "get something by paying",
        "meaningPa": "ਖਰੀਦਣਾ"
      },
      {
        "word": "corner",
        "meaningEn": "the point where two streets meet",
        "meaningPa": "ਮੋੜ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "the",
        "meaningEn": "story word: the",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "fruit",
        "meaningEn": "story word: fruit",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "busy",
        "meaningEn": "story word: busy",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S04",
    "bundleId": 3,
    "orderInBundle": 4,
    "titleEn": "Book 3 · Story 4: Library Day",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 4: ਲਾਇਬ੍ਰੇਰੀ ਦਾ ਦਿਨ",
    "englishStory": "Panel 1 (Intro): Today I go to the library with Dad. The library is quiet, and books are everywhere.\nPanel 2 (Body): First, we walk straight down the road slowly. The library is in front of the park entrance.\nPanel 3 (Body): Next, the door is between two big windows. I hold Dad’s hand and open the door.\nPanel 4 (Body): Then the librarian says, \"Please be quiet.\" We whisper, and we choose one small book.\nPanel 5 (Conclusion): After that, we sit at a table and read. We return the book and walk home calmly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਿਉ ਨਾਲ ਲਾਇਬ੍ਰੇਰੀ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਲਾਇਬ੍ਰੇਰੀ ਸ਼ਾਂਤ ਹੈ ਅਤੇ ਕਿਤਾਬਾਂ ਹਰ ਥਾਂ ਹਨ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਹੌਲੀ ਸੜਕ ਤੇ ਸਿੱਧੇ ਤੁਰਦੇ ਹਾਂ। ਲਾਇਬ੍ਰੇਰੀ ਪਾਰਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਦਰਵਾਜ਼ਾ ਦੋ ਵੱਡੀਆਂ ਖਿੜਕੀਆਂ ਦੇ ਵਿਚਕਾਰ ਹੈ। ਮੈਂ ਪਿਉ ਦਾ ਹੱਥ ਫੜਦਾ/ਫੜਦੀ ਹਾਂ ਅਤੇ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹਦਾ/ਖੋਲ੍ਹਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ ਕਹਿੰਦਾ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਚੁੱਪ ਰਹੋ।\" ਅਸੀਂ ਹੌਲੀ ਬੋਲਦੇ ਹਾਂ ਅਤੇ ਇੱਕ ਛੋਟੀ ਕਿਤਾਬ ਚੁਣਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਮੇਜ਼ ਤੇ ਬੈਠ ਕੇ ਪੜ੍ਹਦੇ ਹਾਂ। ਅਸੀਂ ਕਿਤਾਬ ਵਾਪਸ ਕਰਦੇ ਹਾਂ ਅਤੇ ਸ਼ਾਂਤ ਹੋ ਕੇ ਘਰ ਤੁਰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go today? / ਅੱਜ ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "library / ਲਾਇਬ੍ਰੇਰੀ",
          "market / ਮਾਰਕੀਟ",
          "hospital / ਹਸਪਤਾਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They go to the library today. / ਉਹ ਅੱਜ ਲਾਇਬ੍ਰੇਰੀ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "Where is the library? / ਲਾਇਬ੍ਰੇਰੀ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "in front of the park / ਪਾਰਕ ਦੇ ਸਾਹਮਣੇ",
          "behind the bus / ਬੱਸ ਦੇ ਪਿੱਛੇ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The library is in front of the park entrance. / ਲਾਇਬ੍ਰੇਰੀ ਪਾਰਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।"
      },
      {
        "question": "Where is the door? / ਦਰਵਾਜ਼ਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "between two windows / ਦੋ ਖਿੜਕੀਆਂ ਦੇ ਵਿਚਕਾਰ",
          "next to a spoon / ਚਮਚੇ ਦੇ ਕੋਲ",
          "in the bag / ਬੈਗ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The door is between two windows. / ਦਰਵਾਜ਼ਾ ਦੋ ਖਿੜਕੀਆਂ ਦੇ ਵਿਚਕਾਰ ਹੈ।"
      },
      {
        "question": "What does the librarian say? / ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Please be quiet / ਚੁੱਪ ਰਹੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Eat now / ਹੁਣ ਖਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The librarian says, \"Please be quiet.\" / ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ ਕਹਿੰਦਾ ਹੈ, \"ਚੁੱਪ ਰਹੋ।\""
      },
      {
        "question": "What do they do after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "sit and read / ਬੈਠ ਕੇ ਪੜ੍ਹਦੇ ਹਨ",
          "ride a bus / ਬੱਸ ਚੜ੍ਹਦੇ ਹਨ",
          "play soccer / ਫੁੱਟਬਾਲ ਖੇਡਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, they sit at a table and read. / ਉਸ ਤੋਂ ਬਾਅਦ, ਉਹ ਮੇਜ਼ ਤੇ ਬੈਠ ਕੇ ਪੜ੍ਹਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "library",
        "meaningEn": "a place with many books",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀ"
      },
      {
        "word": "between",
        "meaningEn": "in the middle of two things",
        "meaningPa": "ਦੇ ਵਿਚਕਾਰ"
      },
      {
        "word": "quiet",
        "meaningEn": "not loud",
        "meaningPa": "ਚੁੱਪ/ਸ਼ਾਂਤ"
      },
      {
        "word": "librarian",
        "meaningEn": "a person who helps in a library",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀ ਅਧਿਕਾਰੀ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "the",
        "meaningEn": "story word: the",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "with",
        "meaningEn": "story word: with",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "dad",
        "meaningEn": "story word: dad",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S05",
    "bundleId": 3,
    "orderInBundle": 5,
    "titleEn": "Book 3 · Story 5: Hospital Help",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 5: ਹਸਪਤਾਲ ਦੀ ਮਦਦ",
    "englishStory": "Panel 1 (Intro): Today I go to the hospital with Mom. My tummy hurts, and I feel a little tired.\nPanel 2 (Body): First, we walk straight to the front desk. We sit next to a nurse and wait.\nPanel 3 (Body): Next, the doctor comes and looks at me. The doctor smiles and asks, \"How do you feel?\"\nPanel 4 (Body): Then the doctor says, \"Sit here and rest.\" I drink water and breathe slowly with Mom.\nPanel 5 (Conclusion): After that, I feel better and safe. We go home and sleep early in bed.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਂ ਨਾਲ ਹਸਪਤਾਲ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਮੇਰਾ ਪੇਟ ਦਰਦ ਕਰਦਾ ਹੈ ਅਤੇ ਮੈਂ ਥੋੜ੍ਹਾ ਥੱਕਿਆ/ਥੱਕੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਸਾਹਮਣੇ ਵਾਲੀ ਡੈਸਕ ਤੱਕ ਸਿੱਧੇ ਜਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਨਰਸ ਦੇ ਕੋਲ ਬੈਠ ਕੇ ਉਡੀਕ ਕਰਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਡਾਕਟਰ ਆਉਂਦਾ ਹੈ ਅਤੇ ਮੈਨੂੰ ਵੇਖਦਾ ਹੈ। ਡਾਕਟਰ ਮੁਸਕੁਰਾਉਂਦਾ ਹੈ ਅਤੇ ਪੁੱਛਦਾ ਹੈ, \"ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਡਾਕਟਰ ਕਹਿੰਦਾ ਹੈ, \"ਇੱਥੇ ਬੈਠੋ ਅਤੇ ਆਰਾਮ ਕਰੋ।\" ਮੈਂ ਪਾਣੀ ਪੀਂਦਾ/ਪੀੰਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਠੀਕ ਅਤੇ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਅਸੀਂ ਘਰ ਜਾਂਦੇ ਹਾਂ ਅਤੇ ਜਲਦੀ ਸੋ ਜਾਂਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go today? / ਅੱਜ ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "hospital / ਹਸਪਤਾਲ",
          "park / ਪਾਰਕ",
          "bank / ਬੈਂਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They go to the hospital today. / ਉਹ ਅੱਜ ਹਸਪਤਾਲ ਜਾਂਦੇ ਹਨ।"
      },
      {
        "question": "Where do they sit? / ਉਹ ਕਿੱਥੇ ਬੈਠਦੇ ਹਨ?",
        "choices": [
          "next to a nurse / ਨਰਸ ਦੇ ਕੋਲ",
          "under the table / ਮੇਜ਼ ਹੇਠਾਂ",
          "behind the bus / ਬੱਸ ਦੇ ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They sit next to a nurse and wait. / ਉਹ ਨਰਸ ਦੇ ਕੋਲ ਬੈਠ ਕੇ ਉਡੀਕ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "Who asks, \"How do you feel?\" / \"ਕਿਵੇਂ ਹੋ?\" ਕੌਣ ਪੁੱਛਦਾ ਹੈ?",
        "choices": [
          "doctor / ਡਾਕਟਰ",
          "driver / ਡਰਾਈਵਰ",
          "librarian / ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The doctor asks how the child feels. / ਡਾਕਟਰ ਪੁੱਛਦਾ ਹੈ ਕਿ ਬੱਚਾ ਕਿਵੇਂ ਹੈ।"
      },
      {
        "question": "What does the doctor say? / ਡਾਕਟਰ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Sit here and rest / ਇੱਥੇ ਬੈਠੋ ਤੇ ਆਰਾਮ ਕਰੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Turn left / ਖੱਬੇ ਮੁੜੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The doctor says to sit and rest. / ਡਾਕਟਰ ਬੈਠਣ ਅਤੇ ਆਰਾਮ ਕਰਨ ਲਈ ਕਹਿੰਦਾ ਹੈ।"
      },
      {
        "question": "What does the child drink? / ਬੱਚਾ ਕੀ ਪੀਂਦਾ/ਪੀੰਦੀ ਹੈ?",
        "choices": [
          "water / ਪਾਣੀ",
          "juice / ਜੂਸ",
          "tea / ਚਾਹ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child drinks water in the story. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਪਾਣੀ ਪੀਂਦਾ/ਪੀੰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "hospital",
        "meaningEn": "a place for doctors and nurses",
        "meaningPa": "ਹਸਪਤਾਲ"
      },
      {
        "word": "nurse",
        "meaningEn": "a helper in a hospital",
        "meaningPa": "ਨਰਸ"
      },
      {
        "word": "rest",
        "meaningEn": "relax and not work",
        "meaningPa": "ਆਰਾਮ"
      },
      {
        "word": "doctor",
        "meaningEn": "a person who treats sick people",
        "meaningPa": "ਡਾਕਟਰ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "the",
        "meaningEn": "story word: the",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "with",
        "meaningEn": "story word: with",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "mom",
        "meaningEn": "story word: mom",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S06",
    "bundleId": 3,
    "orderInBundle": 6,
    "titleEn": "Book 3 · Story 6: Firefighter Safety",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 6: ਫਾਇਰਫਾਈਟਰ ਦੀ ਸੁਰੱਖਿਆ",
    "englishStory": "Panel 1 (Intro): Today we see a firefighter near our street. The red truck is loud, and we look carefully.\nPanel 2 (Body): First, we stop near the truck and watch. We stand behind the line and stay still.\nPanel 3 (Body): Next, the firefighter walks in front of us. He points to the truck and checks the tools.\nPanel 4 (Body): Then the firefighter says, \"Stay back, please.\" We step back and keep our hands to ourselves.\nPanel 5 (Conclusion): After that, the firefighter waves and smiles. We feel safe and walk home with Mom.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਸੜਕ ਦੇ ਨੇੜੇ ਫਾਇਰਫਾਈਟਰ ਵੇਖਦੇ ਹਾਂ। ਲਾਲ ਟਰੱਕ ਉੱਚਾ ਹੈ ਅਤੇ ਅਸੀਂ ਧਿਆਨ ਨਾਲ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਟਰੱਕ ਦੇ ਨੇੜੇ ਰੁਕ ਕੇ ਵੇਖਦੇ ਹਾਂ। ਅਸੀਂ ਲਾਈਨ ਦੇ ਪਿੱਛੇ ਖੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਹਿਲਦੇ ਨਹੀਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਫਾਇਰਫਾਈਟਰ ਸਾਡੇ ਸਾਹਮਣੇ ਤੁਰਦਾ ਹੈ। ਉਹ ਟਰੱਕ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ ਅਤੇ ਸਾਮਾਨ ਚੈੱਕ ਕਰਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਫਾਇਰਫਾਈਟਰ ਕਹਿੰਦਾ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਪਿੱਛੇ ਰਹੋ।\" ਅਸੀਂ ਪਿੱਛੇ ਹੁੰਦੇ ਹਾਂ ਅਤੇ ਹੱਥ ਆਪਣੇ ਕੋਲ ਰੱਖਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਫਾਇਰਫਾਈਟਰ ਹੱਥ ਹਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮੁਸਕੁਰਾਉਂਦਾ ਹੈ। ਅਸੀਂ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦੇ ਹਾਂ ਅਤੇ ਮਾਂ ਨਾਲ ਘਰ ਤੁਰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who do they see today? / ਅੱਜ ਉਹ ਕਿਨ੍ਹਾਂ ਨੂੰ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "firefighter / ਫਾਇਰਫਾਈਟਰ",
          "doctor / ਡਾਕਟਰ",
          "cashier / ਕੈਸ਼ੀਅਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They see a firefighter today. / ਉਹ ਅੱਜ ਫਾਇਰਫਾਈਟਰ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "What do they do first? / ਉਹ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "stop and watch / ਰੁਕ ਕੇ ਵੇਖਦੇ ਹਨ",
          "buy fruit / ਫਲ ਖਰੀਦਦੇ ਹਨ",
          "ride a bus / ਬੱਸ ਚੜ੍ਹਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, they stop near the truck and watch. / ਪਹਿਲਾਂ, ਉਹ ਟਰੱਕ ਦੇ ਨੇੜੇ ਰੁਕ ਕੇ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "Where do they stand? / ਉਹ ਕਿੱਥੇ ਖੜ੍ਹਦੇ ਹਨ?",
        "choices": [
          "behind the line / ਲਾਈਨ ਦੇ ਪਿੱਛੇ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "inside the truck / ਟਰੱਕ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They stand behind the line. / ਉਹ ਲਾਈਨ ਦੇ ਪਿੱਛੇ ਖੜ੍ਹਦੇ ਹਨ।"
      },
      {
        "question": "What does the firefighter say? / ਫਾਇਰਫਾਈਟਰ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Stay back / ਪਿੱਛੇ ਰਹੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Open the door / ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The firefighter says, \"Stay back, please.\" / ਫਾਇਰਫਾਈਟਰ ਕਹਿੰਦਾ ਹੈ, \"ਪਿੱਛੇ ਰਹੋ।\""
      },
      {
        "question": "How do they feel after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ?",
        "choices": [
          "safe / ਸੁਰੱਖਿਅਤ",
          "lost / ਗੁੰਮ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They feel safe after the firefighter talks. / ਫਾਇਰਫਾਈਟਰ ਦੇ ਕਹਿਣ ਤੋਂ ਬਾਅਦ ਉਹ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "firefighter",
        "meaningEn": "a person who helps in fires",
        "meaningPa": "ਫਾਇਰਫਾਈਟਰ"
      },
      {
        "word": "behind",
        "meaningEn": "at the back of something",
        "meaningPa": "ਦੇ ਪਿੱਛੇ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ"
      },
      {
        "word": "truck",
        "meaningEn": "a large road vehicle",
        "meaningPa": "ਟਰੱਕ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "see",
        "meaningEn": "story word: see",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "near",
        "meaningEn": "story word: near",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "our",
        "meaningEn": "story word: our",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S07",
    "bundleId": 3,
    "orderInBundle": 7,
    "titleEn": "Book 3 · Story 7: Treasure Walk",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 7: ਖਜ਼ਾਨੇ ਵਾਲੀ ਸੈਰ",
    "englishStory": "Panel 1 (Intro): Today we play a treasure game in the park. We want to find a small toy together.\nPanel 2 (Body): First, we go straight to the park bench. We look under the bench and search slowly.\nPanel 3 (Body): Next, we look between two trees quietly. We look behind the sign and listen closely.\nPanel 4 (Body): Then my friend says, \"Look on the rock.\" The toy is on the rock, bright and clean.\nPanel 5 (Conclusion): After that, we pick up the toy carefully. We cheer, and we put the toy in my bag.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਪਾਰਕ ਵਿੱਚ ਖਜ਼ਾਨੇ ਵਾਲਾ ਖੇਡ ਖੇਡਦੇ ਹਾਂ। ਅਸੀਂ ਇਕੱਠੇ ਇੱਕ ਛੋਟਾ ਖਿਡੌਣਾ ਲੱਭਣਾ ਚਾਹੁੰਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਸਿੱਧੇ ਬੈਂਚ ਤੱਕ ਜਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਬੈਂਚ ਹੇਠਾਂ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਹੌਲੀ ਲੱਭਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਅਸੀਂ ਚੁੱਪਚਾਪ ਦੋ ਦਰੱਖਤਾਂ ਦੇ ਵਿਚਕਾਰ ਵੇਖਦੇ ਹਾਂ। ਅਸੀਂ ਸਾਈਨ ਦੇ ਪਿੱਛੇ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਸੁਣਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਪੱਥਰ ਉੱਤੇ ਵੇਖੋ।\" ਖਿਡੌਣਾ ਪੱਥਰ ਉੱਤੇ ਹੈ ਅਤੇ ਸਾਫ਼ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਖਿਡੌਣਾ ਧਿਆਨ ਨਾਲ ਚੁੱਕਦੇ ਹਾਂ। ਅਸੀਂ ਖੁਸ਼ ਹੋ ਕੇ ਖਿਡੌਣਾ ਬੈਗ ਵਿੱਚ ਰੱਖਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What game do they play? / ਉਹ ਕਿਹੜਾ ਖੇਡ ਖੇਡਦੇ ਹਨ?",
        "choices": [
          "treasure game / ਖਜ਼ਾਨੇ ਵਾਲਾ ਖੇਡ",
          "bus game / ਬੱਸ ਖੇਡ",
          "school game / ਸਕੂਲ ਖੇਡ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They play a treasure game in the park. / ਉਹ ਪਾਰਕ ਵਿੱਚ ਖਜ਼ਾਨੇ ਵਾਲਾ ਖੇਡ ਖੇਡਦੇ ਹਨ।"
      },
      {
        "question": "Where do they look first? / ਉਹ ਪਹਿਲਾਂ ਕਿੱਥੇ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "in the bus / ਬੱਸ ਵਿੱਚ",
          "on the roof / ਛੱਤ ਉੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, they look under the bench. / ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਉਹ ਬੈਂਚ ਹੇਠਾਂ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "Where do they look next? / ਫਿਰ ਉਹ ਕਿੱਥੇ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "between two trees / ਦੋ ਦਰੱਖਤਾਂ ਦੇ ਵਿਚਕਾਰ",
          "in the hospital / ਹਸਪਤਾਲ ਵਿੱਚ",
          "in the bank / ਬੈਂਕ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Next, they look between two trees. / ਫਿਰ, ਉਹ ਦੋ ਦਰੱਖਤਾਂ ਦੇ ਵਿਚਕਾਰ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "Where is the toy? / ਖਿਡੌਣਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "on the rock / ਪੱਥਰ ਉੱਤੇ",
          "under the bed / ਬਿਸਤਰ ਹੇਠਾਂ",
          "across from the store / ਦੁਕਾਨ ਦੇ ਸਾਹਮਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The toy is on the rock. / ਖਿਡੌਣਾ ਪੱਥਰ ਉੱਤੇ ਹੈ।"
      },
      {
        "question": "What do they do after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "pick up the toy / ਖਿਡੌਣਾ ਚੁੱਕਦੇ ਹਨ",
          "throw the toy / ਖਿਡੌਣਾ ਸੁੱਟਦੇ ਹਨ",
          "leave the toy / ਖਿਡੌਣਾ ਛੱਡਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, they pick up the toy carefully. / ਉਸ ਤੋਂ ਬਾਅਦ, ਉਹ ਖਿਡੌਣਾ ਧਿਆਨ ਨਾਲ ਚੁੱਕਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "under",
        "meaningEn": "below something",
        "meaningPa": "ਹੇਠਾਂ"
      },
      {
        "word": "between",
        "meaningEn": "in the middle of two things",
        "meaningPa": "ਦੇ ਵਿਚਕਾਰ"
      },
      {
        "word": "rock",
        "meaningEn": "a hard stone",
        "meaningPa": "ਪੱਥਰ"
      },
      {
        "word": "bench",
        "meaningEn": "a long seat",
        "meaningPa": "ਬੈਂਚ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "play",
        "meaningEn": "story word: play",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "treasure",
        "meaningEn": "story word: treasure",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "game",
        "meaningEn": "story word: game",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S08",
    "bundleId": 3,
    "orderInBundle": 8,
    "titleEn": "Book 3 · Story 8: Lost Near the Store",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 8: ਦੁਕਾਨ ਦੇ ਨੇੜੇ ਗੁੰਮ",
    "englishStory": "Panel 1 (Intro): Today I feel lost near the store. I do not see my mom, and I worry.\nPanel 2 (Body): First, I stop and take a deep breath. I look around and stay calm in place.\nPanel 3 (Body): Next, I ask a helper, \"Excuse me, help.\" The helper is a police officer near the door.\nPanel 4 (Body): Then the officer says, \"Come with me.\" We walk to the front door and wait.\nPanel 5 (Conclusion): After that, I see my mom by the door. I hug her and feel safe and happy.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦੁਕਾਨ ਦੇ ਨੇੜੇ ਗੁੰਮ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਂ ਨਹੀਂ ਦਿਖਦੀ ਅਤੇ ਮੈਂ ਘਬਰਾਂਦਾ/ਘਬਰਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਰੁਕ ਕੇ ਡੂੰਘਾ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ। ਮੈਂ ਚਾਰੋਂ ਪਾਸੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਸ਼ਾਂਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਮਦਦ ਕਰੋ।\" ਮਦਦਗਾਰ ਦਰਵਾਜ਼ੇ ਦੇ ਨੇੜੇ ਪੁਲਿਸ ਅਫਸਰ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਪੁਲਿਸ ਅਫਸਰ ਕਹਿੰਦਾ ਹੈ, \"ਮੇਰੇ ਨਾਲ ਆਓ।\" ਅਸੀਂ ਸਾਹਮਣੇ ਵਾਲੇ ਦਰਵਾਜ਼ੇ ਤੱਕ ਤੁਰਦੇ ਹਾਂ ਅਤੇ ਉਡੀਕ ਕਰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਨੂੰ ਮਾਂ ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ ਦਿਖਦੀ ਹੈ। ਮੈਂ ਉਸਨੂੰ ਗਲੇ ਲਾਂਦਾ/ਲਾਂਦੀ ਹਾਂ ਅਤੇ ਖੁਸ਼ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child feel lost? / ਬੱਚਾ ਕਿੱਥੇ ਗੁੰਮ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "near the store / ਦੁਕਾਨ ਦੇ ਨੇੜੇ",
          "in the park / ਪਾਰਕ ਵਿੱਚ",
          "in the hospital / ਹਸਪਤਾਲ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child feels lost near the store. / ਬੱਚਾ ਦੁਕਾਨ ਦੇ ਨੇੜੇ ਗੁੰਮ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "stop and breathe / ਰੁਕਦਾ ਅਤੇ ਸਾਹ ਲੈਂਦਾ ਹੈ",
          "run away / ਭੱਜ ਜਾਂਦਾ ਹੈ",
          "hide / ਛੁਪ ਜਾਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, the child stops and takes a breath. / ਪਹਿਲਾਂ, ਬੱਚਾ ਰੁਕ ਕੇ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹੈ।"
      },
      {
        "question": "Who helps the child? / ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "police officer / ਪੁਲਿਸ ਅਫਸਰ",
          "doctor / ਡਾਕਟਰ",
          "driver / ਡਰਾਈਵਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "A police officer helps the child. / ਪੁਲਿਸ ਅਫਸਰ ਬੱਚੇ ਦੀ ਮਦਦ ਕਰਦਾ ਹੈ।"
      },
      {
        "question": "What does the officer say? / ਪੁਲਿਸ ਅਫਸਰ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Come with me / ਮੇਰੇ ਨਾਲ ਆਓ",
          "Turn left / ਖੱਬੇ ਮੁੜੋ",
          "Be quiet / ਚੁੱਪ ਰਹੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The officer says, \"Come with me.\" / ਪੁਲਿਸ ਅਫਸਰ ਕਹਿੰਦਾ ਹੈ, \"ਮੇਰੇ ਨਾਲ ਆਓ।\""
      },
      {
        "question": "Where does the child find mom? / ਬੱਚਾ ਮਾਂ ਕਿੱਥੇ ਲੱਭਦਾ/ਲੱਭਦੀ ਹੈ?",
        "choices": [
          "by the door / ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "across from the bank / ਬੈਂਕ ਦੇ ਸਾਹਮਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child sees mom by the door. / ਬੱਚਾ ਮਾਂ ਨੂੰ ਦਰਵਾਜ਼ੇ ਦੇ ਕੋਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "lost",
        "meaningEn": "not knowing where you are",
        "meaningPa": "ਗੁੰਮ"
      },
      {
        "word": "police officer",
        "meaningEn": "a helper who keeps people safe",
        "meaningPa": "ਪੁਲਿਸ ਅਫਸਰ"
      },
      {
        "word": "near",
        "meaningEn": "not far away",
        "meaningPa": "ਨੇੜੇ"
      },
      {
        "word": "worry",
        "meaningEn": "to feel afraid or nervous",
        "meaningPa": "ਚਿੰਤਾ ਕਰਨੀ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "feel",
        "meaningEn": "story word: feel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "the",
        "meaningEn": "story word: the",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "store",
        "meaningEn": "story word: store",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S09",
    "bundleId": 3,
    "orderInBundle": 9,
    "titleEn": "Book 3 · Story 9: Clean Park Team",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 9: ਪਾਰਕ ਸਾਫ਼ ਟੀਮ",
    "englishStory": "Panel 1 (Intro): Today our community helps clean the park. We work together, and we feel very proud.\nPanel 2 (Body): First, we meet near the bench with gloves. A helper says, \"Pick up trash, please.\"\nPanel 3 (Body): Next, we look under the slide and steps. We put trash in a bag and tie it.\nPanel 4 (Body): Then the helper says, \"Go right and check.\" We check behind the tree and find more trash.\nPanel 5 (Conclusion): After that, the park looks clean and bright. We smile and go home with our friends.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਮਿਊਨਟੀ ਪਾਰਕ ਸਾਫ਼ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ। ਅਸੀਂ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਾਂ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਦਸਤਾਨਿਆਂ ਨਾਲ ਬੈਂਚ ਦੇ ਨੇੜੇ ਮਿਲਦੇ ਹਾਂ। ਮਦਦਗਾਰ ਕਹਿੰਦਾ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਕੂੜਾ ਚੁੱਕੋ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਅਸੀਂ ਸਲਾਈਡ ਅਤੇ ਸੀੜ੍ਹੀਆਂ ਹੇਠਾਂ ਵੇਖਦੇ ਹਾਂ। ਅਸੀਂ ਕੂੜਾ ਬੈਗ ਵਿੱਚ ਰੱਖ ਕੇ ਬੰਨ੍ਹ ਦਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮਦਦਗਾਰ ਕਹਿੰਦਾ ਹੈ, \"ਸੱਜੇ ਜਾਓ ਅਤੇ ਚੈੱਕ ਕਰੋ।\" ਅਸੀਂ ਦਰੱਖਤ ਦੇ ਪਿੱਛੇ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਹੋਰ ਕੂੜਾ ਲੱਭਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਪਾਰਕ ਸਾਫ਼ ਅਤੇ ਚਮਕਦਾਰ ਲੱਗਦਾ ਹੈ। ਅਸੀਂ ਮੁਸਕੁਰਾਉਂਦੇ ਹਾਂ ਅਤੇ ਦੋਸਤਾਂ ਨਾਲ ਘਰ ਜਾਂਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they help today? / ਅੱਜ ਉਹ ਕਿੱਥੇ ਮਦਦ ਕਰਦੇ ਹਨ?",
        "choices": [
          "park / ਪਾਰਕ",
          "bank / ਬੈਂਕ",
          "bus stop / ਬੱਸ ਸਟਾਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They help clean the park today. / ਉਹ ਅੱਜ ਪਾਰਕ ਸਾਫ਼ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "What does the helper say first? / ਮਦਦਗਾਰ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Pick up trash / ਕੂੜਾ ਚੁੱਕੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Sleep now / ਹੁਣ ਸੋ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The helper says, \"Pick up trash, please.\" / ਮਦਦਗਾਰ ਕਹਿੰਦਾ ਹੈ, \"ਕੂੜਾ ਚੁੱਕੋ।\""
      },
      {
        "question": "Where do they look next? / ਫਿਰ ਉਹ ਕਿੱਥੇ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "under the slide / ਸਲਾਈਡ ਹੇਠਾਂ",
          "in the library / ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
          "on the bus / ਬੱਸ ਉੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Next, they look under the slide and steps. / ਫਿਰ ਉਹ ਸਲਾਈਡ ਅਤੇ ਸੀੜ੍ਹੀਆਂ ਹੇਠਾਂ ਵੇਖਦੇ ਹਨ।"
      },
      {
        "question": "Which direction do they go? / ਉਹ ਕਿਹੜੇ ਪਾਸੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "right / ਸੱਜੇ",
          "left / ਖੱਬੇ",
          "up / ਉੱਪਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The helper says to go right and check. / ਮਦਦਗਾਰ ਸੱਜੇ ਜਾਣ ਲਈ ਕਹਿੰਦਾ ਹੈ।"
      },
      {
        "question": "How does the park look after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਪਾਰਕ ਕਿਹੋ ਜਿਹਾ ਲੱਗਦਾ ਹੈ?",
        "choices": [
          "clean and bright / ਸਾਫ਼ ਅਤੇ ਚਮਕਦਾਰ",
          "dirty / ਗੰਦਾ",
          "broken / ਟੁੱਟਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "After that, the park looks clean and bright. / ਉਸ ਤੋਂ ਬਾਅਦ, ਪਾਰਕ ਸਾਫ਼ ਅਤੇ ਚਮਕਦਾਰ ਲੱਗਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "community",
        "meaningEn": "people in a neighborhood",
        "meaningPa": "ਕਮਿਊਨਟੀ/ਮੁਹੱਲਾ"
      },
      {
        "word": "trash",
        "meaningEn": "things to throw away",
        "meaningPa": "ਕੂੜਾ"
      },
      {
        "word": "together",
        "meaningEn": "with other people",
        "meaningPa": "ਇਕੱਠੇ"
      },
      {
        "word": "gloves",
        "meaningEn": "hand coverings for protection",
        "meaningPa": "ਦਸਤਾਨੇ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "our",
        "meaningEn": "story word: our",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "helps",
        "meaningEn": "story word: helps",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "clean",
        "meaningEn": "story word: clean",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "clean",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B3_S10",
    "bundleId": 3,
    "orderInBundle": 10,
    "titleEn": "Book 3 · Story 10: Festival Walk",
    "titlePa": "ਕਿਤਾਬ 3 · ਕਹਾਣੀ 10: ਮੇਲਾ ਵਾਲੀ ਸੈਰ",
    "englishStory": "Panel 1 (Intro): Today there is a festival in our town. We go with family, and we hear music.\nPanel 2 (Body): First, we walk straight down the main road. We see flags above us and people smiling.\nPanel 3 (Body): Next, the stage is in front of the library. Food tables are next to the stage, very close.\nPanel 4 (Body): Then Dad says, \"Turn right and stop here.\" We stop near the big sign and watch.\nPanel 5 (Conclusion): After that, we eat, clap, and dance together. We go home happy, tired, and very calm.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੇ ਸ਼ਹਿਰ ਵਿੱਚ ਮੇਲਾ ਹੈ। ਅਸੀਂ ਪਰਿਵਾਰ ਨਾਲ ਜਾਂਦੇ ਹਾਂ ਅਤੇ ਮਿਊਜ਼ਿਕ ਸੁਣਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਮੁੱਖ ਸੜਕ ਤੇ ਸਿੱਧੇ ਤੁਰਦੇ ਹਾਂ। ਅਸੀਂ ਝੰਡੇ ਉੱਪਰ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਲੋਕ ਮੁਸਕੁਰਾਉਂਦੇ ਹਨ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਸਟੇਜ ਲਾਇਬ੍ਰੇਰੀ ਦੇ ਸਾਹਮਣੇ ਹੈ। ਖਾਣੇ ਵਾਲੀਆਂ ਮੇਜ਼ਾਂ ਸਟੇਜ ਦੇ ਕੋਲ ਹਨ, ਬਹੁਤ ਨੇੜੇ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਸੱਜੇ ਮੁੜੋ ਅਤੇ ਇੱਥੇ ਰੁੱਕੋ।\" ਅਸੀਂ ਵੱਡੇ ਸਾਈਨ ਦੇ ਨੇੜੇ ਰੁਕ ਕੇ ਵੇਖਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਇਕੱਠੇ ਖਾਂਦੇ ਹਾਂ, ਤਾਲੀ ਵਜਾਂਦੇ ਹਾਂ, ਅਤੇ ਨੱਚਦੇ ਹਾਂ। ਅਸੀਂ ਖੁਸ਼, ਥੱਕੇ, ਅਤੇ ਸ਼ਾਂਤ ਘਰ ਜਾਂਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What is in town today? / ਅੱਜ ਸ਼ਹਿਰ ਵਿੱਚ ਕੀ ਹੈ?",
        "choices": [
          "festival / ਮੇਲਾ",
          "hospital / ਹਸਪਤਾਲ",
          "class / ਕਲਾਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Today there is a festival in town. / ਅੱਜ ਸ਼ਹਿਰ ਵਿੱਚ ਮੇਲਾ ਹੈ।"
      },
      {
        "question": "What do they do first? / ਉਹ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "walk straight / ਸਿੱਧੇ ਤੁਰਦੇ ਹਨ",
          "turn left / ਖੱਬੇ ਮੁੜਦੇ ਹਨ",
          "ride a bus / ਬੱਸ ਚੜ੍ਹਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "First, they walk straight on the main road. / ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਉਹ ਮੁੱਖ ਸੜਕ ਤੇ ਸਿੱਧੇ ਤੁਰਦੇ ਹਨ।"
      },
      {
        "question": "Where is the stage? / ਸਟੇਜ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "in front of the library / ਲਾਇਬ੍ਰੇਰੀ ਦੇ ਸਾਹਮਣੇ",
          "behind the bus / ਬੱਸ ਦੇ ਪਿੱਛੇ",
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The stage is in front of the library. / ਸਟੇਜ ਲਾਇਬ੍ਰੇਰੀ ਦੇ ਸਾਹਮਣੇ ਹੈ।"
      },
      {
        "question": "Where is the food? / ਖਾਣਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "next to the stage / ਸਟੇਜ ਦੇ ਕੋਲ",
          "in the bathroom / ਬਾਥਰੂਮ ਵਿੱਚ",
          "across from the hospital / ਹਸਪਤਾਲ ਦੇ ਸਾਹਮਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Food tables are next to the stage. / ਖਾਣੇ ਵਾਲੀਆਂ ਮੇਜ਼ਾਂ ਸਟੇਜ ਦੇ ਕੋਲ ਹਨ।"
      },
      {
        "question": "What does Dad say then? / ਫਿਰ ਪਿਉ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Turn right and stop / ਸੱਜੇ ਮੁੜੋ ਤੇ ਰੁੱਕੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Be quiet / ਚੁੱਪ ਰਹੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Dad says, \"Turn right and stop here.\" / ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਸੱਜੇ ਮੁੜੋ ਤੇ ਰੁੱਕੋ।\""
      }
    ],
    "vocabularyWords": [
      {
        "word": "festival",
        "meaningEn": "a fun community event",
        "meaningPa": "ਮੇਲਾ"
      },
      {
        "word": "in front of",
        "meaningEn": "before; facing",
        "meaningPa": "ਦੇ ਸਾਹਮਣੇ"
      },
      {
        "word": "stage",
        "meaningEn": "a place for music and shows",
        "meaningPa": "ਸਟੇਜ"
      },
      {
        "word": "music",
        "meaningEn": "sounds made by singing or instruments",
        "meaningPa": "ਸੰਗੀਤ"
      },
      {
        "word": "panel",
        "meaningEn": "story word: panel",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "intro",
        "meaningEn": "story word: intro",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "today",
        "meaningEn": "story word: today",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "there",
        "meaningEn": "story word: there",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "our",
        "meaningEn": "story word: our",
        "meaningPa": "ਸ਼ਬਦ"
      },
      {
        "word": "town",
        "meaningEn": "story word: town",
        "meaningPa": "ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK4_CUSTOM_STORIES = [
  {
    "storyId": "B4_S01",
    "bundleId": 4,
    "orderInBundle": 1,
    "titleEn": "Book 4 · Story 1: Lost Teddy at the Park",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 1: ਪਾਰਕ ਵਿੱਚ ਟੈਡੀ ਗੁੰਮ",
    "englishStory": "Panel 1 (Intro): Today I play at the park with my teddy bear. I look down at my hands, and teddy is missing.\nPanel 2 (Body): First, I stop my feet and take a slow, deep breath. I feel worried, but I try to stay calm inside.\nPanel 3 (Body): Next, I look under the bench and behind it very carefully. I ask a helper, \"Can you please help me find teddy?\"\nPanel 4 (Body): Then the helper says, \"Walk with me to the gate.\" We walk together slowly, and I breathe until I feel calm.\nPanel 5 (Conclusion): After that, teddy sits by the gate sign on the grass. I hug teddy tight and smile because I found my friend.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਟੈਡੀ ਬੇਅਰ ਨਾਲ ਪਾਰਕ ਵਿੱਚ ਖੇਡਦਾ/ਖੇਡਦੀ ਹਾਂ। ਮੈਂ ਹੇਠਾਂ ਆਪਣੇ ਹੱਥਾਂ ਵੱਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਤੇ ਟੈਡੀ ਗੁੰਮ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਪੈਰ ਰੋਕਦਾ/ਰੋਕਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਡੂੰਘਾ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਚਿੰਤਾ ਹੁੰਦੀ ਹੈ, ਪਰ ਮੈਂ ਆਪਣੇ ਆਪ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਬੈਂਚ ਹੇਠਾਂ ਅਤੇ ਬੈਂਚ ਦੇ ਪਿੱਛੇ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਂ ਮਦਦਗਾਰ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਮੇਰਾ ਟੈਡੀ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮਦਦਗਾਰ ਕਹਿੰਦਾ ਹੈ, \"ਮੇਰੇ ਨਾਲ ਗੇਟ ਵੱਲ ਤੁਰੋ।\" ਅਸੀਂ ਹੌਲੀ ਤੁਰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ ਜਦ ਤੱਕ ਮੈਂ ਸ਼ਾਂਤ ਨਹੀਂ ਹੁੰਦਾ/ਹੁੰਦੀ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਟੈਡੀ ਗੇਟ ਦੇ ਕੋਲ ਘਾਹ ਉੱਤੇ ਬੈਠਿਆ ਹੁੰਦਾ ਹੈ। ਮੈਂ ਟੈਡੀ ਨੂੰ ਕੱਸ ਕੇ ਗਲੇ ਲਾਂਦਾ/ਲਾਂਦੀ ਹਾਂ ਅਤੇ ਖੁਸ਼ੀ ਨਾਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "park / ਪਾਰਕ",
          "school / ਸਕੂਲ",
          "market / ਮਾਰਕੀਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the child is at the park. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਪਾਰਕ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "How does the child feel in Panel 2? / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "worried / ਚਿੰਤਿਤ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels worried. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਚਿੰਤਿਤ ਹੈ।"
      },
      {
        "question": "Where does the child look next? / ਫਿਰ ਬੱਚਾ ਕਿੱਥੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ?",
        "choices": [
          "under the bench / ਬੈਂਚ ਹੇਠਾਂ",
          "in the bag / ਬੈਗ ਵਿੱਚ",
          "on the bus / ਬੱਸ ਉੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child looks under the bench. / ਪੈਨਲ 3 ਵਿੱਚ ਬੈਂਚ ਹੇਠਾਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "Who helps the child? / ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "helper / ਮਦਦਗਾਰ",
          "driver / ਡਰਾਈਵਰ",
          "doctor / ਡਾਕਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The helper walks with the child to the gate. / ਮਦਦਗਾਰ ਬੱਚੇ ਨਾਲ ਗੇਟ ਵੱਲ ਤੁਰਦਾ ਹੈ।"
      },
      {
        "question": "Where is teddy at the end? / ਅੰਤ ਵਿੱਚ ਟੈਡੀ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "by the gate / ਗੇਟ ਦੇ ਕੋਲ",
          "under the slide / ਸਲਾਈਡ ਹੇਠਾਂ",
          "behind the tree / ਦਰੱਖਤ ਦੇ ਪਿੱਛੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says teddy is by the gate sign. / ਪੈਨਲ 5 ਵਿੱਚ ਟੈਡੀ ਗੇਟ ਦੇ ਕੋਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "teddy",
        "meaningEn": "a soft toy bear you can hug",
        "meaningPa": "ਟੈਡੀ; ਨਰਮ ਖਿਡੌਣਾ ਜਿਸਨੂੰ ਗਲੇ ਲਾ ਸਕਦੇ ਹਾਂ"
      },
      {
        "word": "missing",
        "meaningEn": "not there; you cannot see it",
        "meaningPa": "ਗੁੰਮ; ਚੀਜ਼ ਨਹੀਂ ਦਿਖਦੀ"
      },
      {
        "word": "worried",
        "meaningEn": "feeling scared something bad might happen",
        "meaningPa": "ਚਿੰਤਿਤ; ਡਰ ਕਿ ਕੁਝ ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ"
      },
      {
        "word": "calm",
        "meaningEn": "quiet inside; not scared or upset",
        "meaningPa": "ਸ਼ਾਂਤ; ਦਿਲ ਵਿੱਚ ਸੁਕੂਨ"
      },
      {
        "word": "helper",
        "meaningEn": "a person who helps you",
        "meaningPa": "ਮਦਦਗਾਰ; ਜੋ ਮਦਦ ਕਰਦਾ ਹੈ"
      },
      {
        "word": "bench",
        "meaningEn": "a long seat in the park",
        "meaningPa": "ਬੈਂਚ; ਪਾਰਕ ਵਿੱਚ ਬੈਠਣ ਵਾਲੀ ਸੀਟ"
      },
      {
        "word": "gate",
        "meaningEn": "the place you enter or leave",
        "meaningPa": "ਗੇਟ; ਅੰਦਰ-ਬਾਹਰ ਜਾਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "breathe",
        "meaningEn": "take air in and out slowly",
        "meaningPa": "ਸਾਹ ਲੈਣਾ; ਹੌਲੀ ਸਾਹ ਅੰਦਰ-ਬਾਹਰ"
      },
      {
        "word": "look",
        "meaningEn": "use your eyes to see",
        "meaningPa": "ਵੇਖਣਾ; ਅੱਖਾਂ ਨਾਲ ਦੇਖਣਾ"
      },
      {
        "word": "hug",
        "meaningEn": "hold close with your arms",
        "meaningPa": "ਗਲੇ ਲਾਉਣਾ; ਪਿਆਰ ਨਾਲ ਨੇੜੇ ਕਰਨਾ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S02",
    "bundleId": 4,
    "orderInBundle": 2,
    "titleEn": "Book 4 · Story 2: My Pencil Is Missing",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 2: ਮੇਰੀ ਪੈਂਸਿਲ ਗੁੰਮ ਹੈ",
    "englishStory": "Panel 1 (Intro): Today I am in class, and I need my pencil to write. I look on my desk, but my pencil is missing.\nPanel 2 (Body): First, I check my bag and chair, and I look carefully. I feel upset, but I choose a calm plan to find it.\nPanel 3 (Body): Next, I raise my hand and ask my teacher for help. I say, \"Can you please help me find my pencil?\"\nPanel 4 (Body): Then the teacher says, \"Look under your desk and check slowly.\" I look under the desk, and I find my pencil near my shoe.\nPanel 5 (Conclusion): After that, I write my name and finish my work with a smile. I feel proud and ready because I solved the problem kindly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਹਾਂ, ਅਤੇ ਮੈਨੂੰ ਲਿਖਣ ਲਈ ਪੈਂਸਿਲ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਡੈਸਕ ਉੱਤੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਪਰ ਮੇਰੀ ਪੈਂਸਿਲ ਗੁੰਮ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਬੈਗ ਅਤੇ ਕੁਰਸੀ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਨੂੰ ਪਰੇਸ਼ਾਨੀ ਹੁੰਦੀ ਹੈ, ਪਰ ਮੈਂ ਸ਼ਾਂਤ ਯੋਜਨਾ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਹੱਥ ਚੁੱਕਦਾ/ਚੁੱਕਦੀ ਹਾਂ ਅਤੇ ਟੀਚਰ ਤੋਂ ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਪੈਂਸਿਲ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਡੈਸਕ ਹੇਠਾਂ ਵੇਖੋ ਅਤੇ ਹੌਲੀ ਚੈੱਕ ਕਰੋ।\" ਮੈਂ ਹੇਠਾਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਜੁੱਤੇ ਦੇ ਕੋਲ ਪੈਂਸਿਲ ਲੱਭ ਲੈਂਦਾ/ਲੱਭ ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਆਪਣਾ ਨਾਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ ਅਤੇ ਕੰਮ ਮੁਕਾਉਂਦਾ/ਮੁਕਾਉਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ, ਕਿਉਂਕਿ ਮੈਂ ਸਮੱਸਿਆ ਹੱਲ ਕਰ ਲਈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What is missing? / ਕੀ ਗੁੰਮ ਹੈ?",
        "choices": [
          "pencil / ਪੈਂਸਿਲ",
          "shoe / ਜੁੱਤਾ",
          "apple / ਸੇਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the pencil is missing. / ਕਹਾਣੀ ਵਿੱਚ ਪੈਂਸਿਲ ਗੁੰਮ ਹੈ।"
      },
      {
        "question": "Where does the child check first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿੱਥੇ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "bag and chair / ਬੈਗ ਤੇ ਕੁਰਸੀ",
          "park / ਪਾਰਕ",
          "bus stop / ਬੱਸ ਸਟਾਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child checks the bag and chair. / ਪੈਨਲ 2 ਵਿੱਚ ਬੈਗ ਤੇ ਕੁਰਸੀ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "Who does the child ask for help? / ਬੱਚਾ ਮਦਦ ਕਿਨ੍ਹਾਂ ਤੋਂ ਮੰਗਦਾ/ਮੰਗਦੀ ਹੈ?",
        "choices": [
          "teacher / ਟੀਚਰ",
          "driver / ਡਰਾਈਵਰ",
          "police officer / ਪੁਲਿਸ ਅਫਸਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child asks the teacher. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਟੀਚਰ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "Where does the teacher say to look? / ਟੀਚਰ ਕਿੱਥੇ ਵੇਖਣ ਲਈ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "under the desk / ਡੈਸਕ ਹੇਠਾਂ",
          "on the roof / ਛੱਤ ਉੱਤੇ",
          "in the market / ਮਾਰਕੀਟ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says to look under the desk. / ਪੈਨਲ 4 ਵਿੱਚ ਡੈਸਕ ਹੇਠਾਂ ਵੇਖੋ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "proud / ਮਾਣ",
          "scared / ਡਰਿਆ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels proud. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "pencil",
        "meaningEn": "a tool for writing",
        "meaningPa": "ਪੈਂਸਿਲ; ਲਿਖਣ ਵਾਲੀ ਚੀਜ਼"
      },
      {
        "word": "missing",
        "meaningEn": "not there; you cannot find it",
        "meaningPa": "ਗੁੰਮ; ਚੀਜ਼ ਨਹੀਂ ਮਿਲ ਰਹੀ"
      },
      {
        "word": "check",
        "meaningEn": "look to see if it is there",
        "meaningPa": "ਚੈੱਕ ਕਰਨਾ; ਵੇਖਣਾ ਕਿ ਚੀਜ਼ ਹੈ ਜਾਂ ਨਹੀਂ"
      },
      {
        "word": "upset",
        "meaningEn": "sad or bothered",
        "meaningPa": "ਉਦਾਸ/ਪਰੇਸ਼ਾਨ; ਮਨ ਖਰਾਬ"
      },
      {
        "word": "choose",
        "meaningEn": "pick one thing to do",
        "meaningPa": "ਚੋਣ ਕਰਨਾ; ਇੱਕ ਕੰਮ ਚੁਣਨਾ"
      },
      {
        "word": "teacher",
        "meaningEn": "a person who helps you learn",
        "meaningPa": "ਟੀਚਰ; ਜੋ ਸਿਖਾਉਂਦਾ/ਸਿਖਾਉਂਦੀ ਹੈ"
      },
      {
        "word": "under",
        "meaningEn": "below something",
        "meaningPa": "ਹੇਠਾਂ; ਕਿਸੇ ਚੀਜ਼ ਦੇ ਨੀਚੇ"
      },
      {
        "word": "find",
        "meaningEn": "get it again after looking",
        "meaningPa": "ਲੱਭਣਾ; ਲੱਭ ਕੇ ਮਿਲ ਜਾਣਾ"
      },
      {
        "word": "please",
        "meaningEn": "a polite word when you ask",
        "meaningPa": "ਕਿਰਪਾ ਕਰਕੇ; ਨਮਰਤਾ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "ready",
        "meaningEn": "prepared to start",
        "meaningPa": "ਤਿਆਰ; ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "need",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S03",
    "bundleId": 4,
    "orderInBundle": 3,
    "titleEn": "Book 4 · Story 3: One Toy, Two Kids",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 3: ਇੱਕ ਖਿਡੌਣਾ, ਦੋ ਬੱਚੇ",
    "englishStory": "Panel 1 (Intro): Today I have one toy car, and I want to play first. My friend wants it too, and we both reach for it.\nPanel 2 (Body): First, I feel angry for a moment, and my face gets hot. I stop my hands and take one slow breath to calm down.\nPanel 3 (Body): Next, I choose to share the toy car and take turns. I say, \"My turn first, then your turn after the timer.\"\nPanel 4 (Body): Then my friend says, \"Okay, I can wait and be fair.\" We set a small timer, and we smile at each other.\nPanel 5 (Conclusion): After that, we switch turns and share the toy again. We feel calm and happy because we both got a turn.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੇਰੇ ਕੋਲ ਇੱਕ ਖਿਡੌਣਾ ਗੱਡੀ ਹੈ, ਅਤੇ ਮੈਂ ਪਹਿਲਾਂ ਖੇਡਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਮੇਰਾ ਦੋਸਤ ਵੀ ਗੱਡੀ ਚਾਹੁੰਦਾ ਹੈ, ਅਤੇ ਅਸੀਂ ਦੋਵੇਂ ਹੱਥ ਵਧਾਉਂਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਨੂੰ ਥੋੜ੍ਹਾ ਗੁੱਸਾ ਆਉਂਦਾ ਹੈ ਅਤੇ ਚਿਹਰਾ ਗਰਮ ਹੋ ਜਾਂਦਾ ਹੈ। ਮੈਂ ਹੱਥ ਰੋਕਦਾ/ਰੋਕਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈ ਕੇ ਸ਼ਾਂਤ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਖਿਡੌਣਾ ਸਾਂਝਾ ਕਰਨ ਅਤੇ ਵਾਰੀ ਲੈਣ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਪਹਿਲਾਂ ਮੇਰੀ ਵਾਰੀ, ਫਿਰ ਟਾਈਮਰ ਤੋਂ ਬਾਅਦ ਤੇਰੀ ਵਾਰੀ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਠੀਕ ਹੈ, ਮੈਂ ਉਡੀਕ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ ਅਤੇ ਨਿਆਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।\" ਅਸੀਂ ਛੋਟਾ ਟਾਈਮਰ ਲਗਾਉਂਦੇ ਹਾਂ ਅਤੇ ਇਕ-ਦੂਜੇ ਨੂੰ ਮੁਸਕੁਰਾਉਂਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਵਾਰੀ ਬਦਲਦੇ ਹਾਂ ਅਤੇ ਖਿਡੌਣਾ ਫਿਰ ਸਾਂਝਾ ਕਰਦੇ ਹਾਂ। ਅਸੀਂ ਸ਼ਾਂਤ ਅਤੇ ਖੁਸ਼ ਹੁੰਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਦੋਵੇਂ ਦੀ ਵਾਰੀ ਆਈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What toy is in the story? / ਕਹਾਣੀ ਵਿੱਚ ਕਿਹੜਾ ਖਿਡੌਣਾ ਹੈ?",
        "choices": [
          "toy car / ਖਿਡੌਣਾ ਗੱਡੀ",
          "ball / ਗੇਂਦ",
          "book / ਕਿਤਾਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story is about a toy car. / ਕਹਾਣੀ ਖਿਡੌਣਾ ਗੱਡੀ ਬਾਰੇ ਹੈ।"
      },
      {
        "question": "How does the child feel first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ",
          "sick / ਬਿਮਾਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels angry at first. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਪਹਿਲਾਂ ਗੁੱਸੇ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "What does the child choose to do? / ਬੱਚਾ ਕੀ ਕਰਨ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "share / ਸਾਂਝਾ ਕਰਨਾ",
          "hide it / ਛੁਪਾਉਣਾ",
          "break it / ਤੋੜਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child chooses to share. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਸਾਂਝਾ ਕਰਨ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the friend say? / ਦੋਸਤ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "I can wait / ਮੈਂ ਉਡੀਕ ਕਰ ਸਕਦਾ ਹਾਂ",
          "Go away / ਦੂਰ ਜਾਓ",
          "I am lost / ਮੈਂ ਗੁੰਮ ਹਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the friend can wait. / ਪੈਨਲ 4 ਵਿੱਚ ਦੋਸਤ ਉਡੀਕ ਕਰ ਸਕਦਾ ਹੈ।"
      },
      {
        "question": "How do they feel at the end? / ਅੰਤ ਵਿੱਚ ਉਹ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ?",
        "choices": [
          "happy / ਖੁਸ਼",
          "worried / ਚਿੰਤਿਤ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they feel calm and happy. / ਪੈਨਲ 5 ਵਿੱਚ ਉਹ ਸ਼ਾਂਤ ਅਤੇ ਖੁਸ਼ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "angry",
        "meaningEn": "feeling mad inside",
        "meaningPa": "ਗੁੱਸਾ; ਮਨ ਵਿੱਚ ਨਾਰਾਜ਼ਗੀ"
      },
      {
        "word": "share",
        "meaningEn": "let someone else use it too",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ; ਦੂਜੇ ਨੂੰ ਵੀ ਵਰਤਣ ਦੇਣਾ"
      },
      {
        "word": "turn",
        "meaningEn": "your time to do something",
        "meaningPa": "ਵਾਰੀ; ਤੁਹਾਡਾ ਮੌਕਾ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until it is your turn",
        "meaningPa": "ਉਡੀਕ ਕਰਨੀ; ਵਾਰੀ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      },
      {
        "word": "timer",
        "meaningEn": "a clock that counts time",
        "meaningPa": "ਟਾਈਮਰ; ਸਮਾਂ ਗਿਣਣ ਵਾਲੀ ਘੜੀ"
      },
      {
        "word": "calm",
        "meaningEn": "quiet inside; not angry",
        "meaningPa": "ਸ਼ਾਂਤ; ਗੁੱਸਾ ਨਹੀਂ"
      },
      {
        "word": "choose",
        "meaningEn": "pick what you will do",
        "meaningPa": "ਚੋਣ ਕਰਨੀ; ਕੀ ਕਰਨਾ ਹੈ ਚੁਣਨਾ"
      },
      {
        "word": "breath",
        "meaningEn": "air you take in and out",
        "meaningPa": "ਸਾਹ; ਹਵਾ ਅੰਦਰ-ਬਾਹਰ ਲੈਣਾ"
      },
      {
        "word": "fair",
        "meaningEn": "everyone gets the same chance",
        "meaningPa": "ਨਿਆਂਪੂਰਨ; ਸਭ ਨੂੰ ਬਰਾਬਰ ਮੌਕਾ"
      },
      {
        "word": "toy",
        "meaningEn": "something kids play with",
        "meaningPa": "ਖਿਡੌਣਾ; ਬੱਚਿਆਂ ਦੀ ਖੇਡਣ ਵਾਲੀ ਚੀਜ਼"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "share",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "turns",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S04",
    "bundleId": 4,
    "orderInBundle": 4,
    "titleEn": "Book 4 · Story 4: The Crayon Broke",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 4: ਕ੍ਰੇਯੋਨ ਟੁੱਟ ਗਿਆ",
    "englishStory": "Panel 1 (Intro): Today I color my picture with a blue crayon at my table. The crayon breaks in my hand, and I feel surprised.\nPanel 2 (Body): First, I feel sad and a little mad, and I stop coloring. I put the pieces down gently, and I keep my hands safe.\nPanel 3 (Body): Next, I decide to tell the truth, even though I feel shy. I say, \"I broke it by accident, and I am sorry.\"\nPanel 4 (Body): Then the teacher says, \"It is okay, and thank you for telling.\" We share another crayon, and we keep coloring our pictures.\nPanel 5 (Conclusion): After that, my picture looks bright and nice with new blue color. I feel better and proud because I made a good choice.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮੇਜ਼ ਤੇ ਨੀਲੇ ਕ੍ਰੇਯੋਨ ਨਾਲ ਤਸਵੀਰ ਰੰਗਦਾ/ਰੰਗਦੀ ਹਾਂ। ਕ੍ਰੇਯੋਨ ਮੇਰੇ ਹੱਥ ਵਿੱਚ ਟੁੱਟ ਜਾਂਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਹੈਰਾਨ ਹੋ ਜਾਂਦਾ/ਹੋ ਜਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਨੂੰ ਉਦਾਸੀ ਅਤੇ ਥੋੜ੍ਹਾ ਗੁੱਸਾ ਹੁੰਦਾ ਹੈ ਅਤੇ ਮੈਂ ਰੰਗਣਾ ਰੋਕ ਦਿੰਦਾ/ਰੋਕ ਦਿੰਦੀ ਹਾਂ। ਮੈਂ ਟੁਕੜੇ ਹੌਲੀ ਰੱਖ ਦਿੰਦਾ/ਰੱਖ ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਆਪਣੇ ਹੱਥ ਸੁਰੱਖਿਅਤ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਸੱਚ ਦੱਸਣ ਦਾ ਫੈਸਲਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਭਾਵੇਂ ਮੈਂ ਥੋੜ੍ਹਾ ਸ਼ਰਮੀਲਾ/ਸ਼ਰਮੀਲੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਅਣਜਾਣੇ ਵਿੱਚ ਇਹ ਮੇਰੇ ਤੋਂ ਟੁੱਟ ਗਿਆ, ਮਾਫ਼ ਕਰਨਾ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਕੋਈ ਗੱਲ ਨਹੀਂ, ਸੱਚ ਦੱਸਣ ਲਈ ਧੰਨਵਾਦ।\" ਅਸੀਂ ਹੋਰ ਕ੍ਰੇਯੋਨ ਸਾਂਝਾ ਕਰਦੇ ਹਾਂ ਅਤੇ ਤਸਵੀਰਾਂ ਰੰਗਦੇ ਰਹਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੇਰੀ ਤਸਵੀਰ ਨਵੇਂ ਨੀਲੇ ਰੰਗ ਨਾਲ ਸੋਹਣੀ ਲੱਗਦੀ ਹੈ। ਮੈਂ ਚੰਗਾ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਮੈਂ ਚੰਗੀ ਚੋਣ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What breaks? / ਕੀ ਟੁੱਟਦਾ ਹੈ?",
        "choices": [
          "crayon / ਕ੍ਰੇਯੋਨ",
          "chair / ਕੁਰਸੀ",
          "door / ਦਰਵਾਜ਼ਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the crayon breaks. / ਕਹਾਣੀ ਵਿੱਚ ਕ੍ਰੇਯੋਨ ਟੁੱਟਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "sad / ਉਦਾਸ",
          "excited / ਉਤਸਾਹਿਤ",
          "hungry / ਭੁੱਖਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels sad first. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਪਹਿਲਾਂ ਉਦਾਸ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do next? / ਫਿਰ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "tell the truth / ਸੱਚ ਦੱਸਣਾ",
          "hide it / ਛੁਪਾਉਣਾ",
          "run away / ਭੱਜ ਜਾਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child tells the truth. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਸੱਚ ਦੱਸਦਾ/ਦੱਸਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "It is okay / ਕੋਈ ਗੱਲ ਨਹੀਂ",
          "Go home / ਘਰ ਜਾਓ",
          "Be loud / ਸ਼ੋਰ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, \"It is okay.\" / ਪੈਨਲ 4 ਵਿੱਚ \"ਕੋਈ ਗੱਲ ਨਹੀਂ\" ਹੈ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "better and proud / ਚੰਗਾ ਅਤੇ ਮਾਣ",
          "lost / ਗੁੰਮ",
          "scared / ਡਰਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels better and proud. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਚੰਗਾ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "crayon",
        "meaningEn": "a colored stick for drawing",
        "meaningPa": "ਕ੍ਰੇਯੋਨ; ਰੰਗ ਕਰਨ ਵਾਲੀ ਡੰਡੀ"
      },
      {
        "word": "broke",
        "meaningEn": "split into pieces",
        "meaningPa": "ਟੁੱਟ ਗਿਆ; ਟੁਕੜੇ ਹੋ ਗਏ"
      },
      {
        "word": "surprised",
        "meaningEn": "shocked for a moment",
        "meaningPa": "ਹੈਰਾਨ; ਅਚਾਨਕ ਚੌਂਕ ਜਾਣਾ"
      },
      {
        "word": "truth",
        "meaningEn": "what really happened",
        "meaningPa": "ਸੱਚ; ਜੋ ਅਸਲ ਵਿੱਚ ਹੋਇਆ"
      },
      {
        "word": "accident",
        "meaningEn": "something that happens by mistake",
        "meaningPa": "ਅਣਜਾਣੀ ਘਟਨਾ; ਗਲਤੀ ਨਾਲ ਹੋ ਜਾਣਾ"
      },
      {
        "word": "sorry",
        "meaningEn": "words you say after a mistake",
        "meaningPa": "ਮਾਫ਼ ਕਰਨਾ; ਗਲਤੀ ਤੋਂ ਬਾਅਦ ਕਹਿਣਾ"
      },
      {
        "word": "pieces",
        "meaningEn": "small parts of something",
        "meaningPa": "ਟੁਕੜੇ; ਛੋਟੇ ਹਿੱਸੇ"
      },
      {
        "word": "safe",
        "meaningEn": "not hurt or in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਚੋਟ ਨਹੀਂ"
      },
      {
        "word": "share",
        "meaningEn": "use something together",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ; ਇਕੱਠੇ ਵਰਤਣਾ"
      },
      {
        "word": "choice",
        "meaningEn": "the thing you decide to do",
        "meaningPa": "ਚੋਣ; ਜੋ ਤੁਸੀਂ ਕਰਨ ਲਈ ਫੈਸਲਾ ਕਰੋ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S05",
    "bundleId": 4,
    "orderInBundle": 5,
    "titleEn": "Book 4 · Story 5: Spilled Water",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 5: ਪਾਣੀ ਡਿੱਗ ਗਿਆ",
    "englishStory": "Panel 1 (Intro): Today I drink water at the table, and my cup tips over. Water spills on the floor, and I see a wet puddle.\nPanel 2 (Body): First, I feel surprised and a bit worried, and I stop moving. I hold the cup still, so no more water spills out.\nPanel 3 (Body): Next, I ask for help right away, because I want it safe. I say, \"Please help me clean the water with a towel.\"\nPanel 4 (Body): Then Dad says, \"Get a towel now, and wipe the water slowly.\" We wipe and dry the floor, and we put the cup back.\nPanel 5 (Conclusion): After that, the floor is dry again, and nobody can slip. I feel proud and relieved because I helped fix the mess.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮੇਜ਼ ਤੇ ਪਾਣੀ ਪੀਂਦਾ/ਪੀੰਦੀ ਹਾਂ, ਅਤੇ ਮੇਰਾ ਕੱਪ ਢਲਕ ਜਾਂਦਾ ਹੈ। ਪਾਣੀ ਫਰਸ਼ ਤੇ ਡਿੱਗਦਾ ਹੈ, ਅਤੇ ਭਿੱਜੀ ਥਾਂ ਬਣ ਜਾਂਦੀ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੈਰਾਨ ਅਤੇ ਥੋੜ੍ਹਾ ਚਿੰਤਿਤ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ ਅਤੇ ਹਿਲਣਾ ਰੋਕ ਦਿੰਦਾ/ਰੋਕ ਦਿੰਦੀ ਹਾਂ। ਮੈਂ ਕੱਪ ਥਿਰ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਹੋਰ ਪਾਣੀ ਨਾ ਡਿੱਗੇ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਤੁਰੰਤ ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਮੈਂ ਇਸਨੂੰ ਸੁਰੱਖਿਅਤ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕਿਰਪਾ ਕਰਕੇ ਤੌਲੀਆ ਨਾਲ ਇਹ ਪਾਣੀ ਸਾਫ਼ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਹੁਣ ਤੌਲੀਆ ਲਿਆਓ ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਪੋਂਛੋ।\" ਅਸੀਂ ਪੋਂਛ ਕੇ ਫਰਸ਼ ਸੁਕਾਂਦੇ ਹਾਂ ਅਤੇ ਕੱਪ ਵਾਪਸ ਰੱਖ ਦਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਫਰਸ਼ ਫਿਰ ਸੁੱਕਾ ਹੋ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕੋਈ ਨਹੀਂ ਫਿਸਲਦਾ। ਮੈਨੂੰ ਮਾਣ ਅਤੇ ਸੁਕੂਨ ਹੁੰਦਾ ਹੈ, ਕਿਉਂਕਿ ਮੈਂ ਗੰਦ ਠੀਕ ਕਰ ਦਿੱਤਾ।",
    "multipleChoiceQuestions": [
      {
        "question": "What spills? / ਕੀ ਡਿੱਗਦਾ ਹੈ?",
        "choices": [
          "water / ਪਾਣੀ",
          "sand / ਰੇਤ",
          "juice / ਜੂਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Water spills from the cup. / ਕੱਪ ਤੋਂ ਪਾਣੀ ਡਿੱਗਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "surprised / ਹੈਰਾਨ",
          "happy / ਖੁਸ਼",
          "sleepy / ਨੀਂਦ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels surprised. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਹੈਰਾਨ ਹੈ।"
      },
      {
        "question": "What does the child do next? / ਫਿਰ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "asks for help / ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹੈ",
          "runs away / ਭੱਜ ਜਾਂਦਾ ਹੈ",
          "laughs loud / ਉੱਚੀ ਹੱਸਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child asks for help. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹੈ।"
      },
      {
        "question": "What does Dad say to get? / ਪਿਉ ਕੀ ਲਿਆਉਣ ਲਈ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "towel / ਤੌਲੀਆ",
          "toy / ਖਿਡੌਣਾ",
          "book / ਕਿਤਾਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says to get a towel. / ਪੈਨਲ 4 ਵਿੱਚ ਤੌਲੀਆ ਲਿਆਓ।"
      },
      {
        "question": "How is the floor at the end? / ਅੰਤ ਵਿੱਚ ਫਰਸ਼ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "dry and safe / ਸੁੱਕਾ ਤੇ ਸੁਰੱਖਿਅਤ",
          "wet / ਭਿੱਜਾ",
          "dirty / ਗੰਦਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the floor is dry and safe. / ਪੈਨਲ 5 ਵਿੱਚ ਫਰਸ਼ ਸੁੱਕਾ ਤੇ ਸੁਰੱਖਿਅਤ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "spill",
        "meaningEn": "drop liquid out of a cup",
        "meaningPa": "ਡਿੱਗਣਾ; ਕੱਪ ਤੋਂ ਤਰਲ ਬਾਹਰ ਨਿਕਲਣਾ"
      },
      {
        "word": "puddle",
        "meaningEn": "a small pool of water on the floor",
        "meaningPa": "ਭਿੱਜੀ ਥਾਂ; ਫਰਸ਼ ਉੱਤੇ ਪਾਣੀ ਦਾ ਛੋਟਾ ਢੇਰ"
      },
      {
        "word": "towel",
        "meaningEn": "cloth to dry water",
        "meaningPa": "ਤੌਲੀਆ; ਪਾਣੀ ਸੁਕਾਉਣ ਵਾਲਾ ਕਪੜਾ"
      },
      {
        "word": "wipe",
        "meaningEn": "clean by rubbing with a cloth",
        "meaningPa": "ਪੋਂਛਣਾ; ਕਪੜੇ ਨਾਲ ਸਾਫ਼ ਕਰਨਾ"
      },
      {
        "word": "dry",
        "meaningEn": "not wet",
        "meaningPa": "ਸੁੱਕਾ; ਭਿੱਜਾ ਨਹੀਂ"
      },
      {
        "word": "safe",
        "meaningEn": "not dangerous",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "slip",
        "meaningEn": "slide and almost fall",
        "meaningPa": "ਫਿਸਲਣਾ; ਪੈਰ ਸਲਿੱਪ ਹੋਣਾ"
      },
      {
        "word": "worried",
        "meaningEn": "thinking something bad might happen",
        "meaningPa": "ਚਿੰਤਿਤ; ਡਰ ਕਿ ਕੁਝ ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ"
      },
      {
        "word": "relieved",
        "meaningEn": "feeling better after worry is gone",
        "meaningPa": "ਸੁਕੂਨ; ਚਿੰਤਾ ਘੱਟ ਹੋ ਜਾਣੀ"
      },
      {
        "word": "mess",
        "meaningEn": "a dirty or mixed-up area",
        "meaningPa": "ਗੰਦ; ਬੇਤਰਤੀਬ ਗੰਦੀ ਥਾਂ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "ask",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S06",
    "bundleId": 4,
    "orderInBundle": 6,
    "titleEn": "Book 4 · Story 6: Snack Mix-Up",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 6: ਨਾਸ਼ਤੇ ਦੀ ਗਲਤੀ",
    "englishStory": "Panel 1 (Intro): Today I open my snack bag in class, and my snack falls out. The snack lands on the floor, so it is not clean now.\nPanel 2 (Body): First, I feel disappointed and a little sad, and I stop eating. I look at the mess, and I take a calm breath.\nPanel 3 (Body): Next, I choose kindness and ask my teacher for a clean snack. I say, \"Can I please have a clean snack, teacher?\"\nPanel 4 (Body): Then my friend says, \"You can share mine, and we will be fair.\" We share small bites, and I say, \"Thank you\" softly.\nPanel 5 (Conclusion): After that, my tummy feels better, and my smile comes back. I feel happy because we shared, and I made a kind choice.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਨਾਸ਼ਤੇ ਦਾ ਬੈਗ ਖੋਲ੍ਹਦਾ/ਖੋਲ੍ਹਦੀ ਹਾਂ, ਅਤੇ ਨਾਸ਼ਤਾ ਬਾਹਰ ਡਿੱਗ ਜਾਂਦਾ ਹੈ। ਨਾਸ਼ਤਾ ਫਰਸ਼ ਤੇ ਪੈ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਹੁਣ ਸਾਫ਼ ਨਹੀਂ ਰਹਿੰਦਾ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਨੂੰ ਨਿਰਾਸ਼ਾ ਅਤੇ ਥੋੜ੍ਹੀ ਉਦਾਸੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮੈਂ ਖਾਣਾ ਰੋਕ ਦਿੰਦਾ/ਰੋਕ ਦਿੰਦੀ ਹਾਂ। ਮੈਂ ਗੰਦ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈ ਕੇ ਸ਼ਾਂਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਦਇਆ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਟੀਚਰ ਤੋਂ ਸਾਫ਼ ਨਾਸ਼ਤਾ ਮੰਗਦਾ/ਮੰਗਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕੀ ਮੈਨੂੰ ਕਿਰਪਾ ਕਰਕੇ ਸਾਫ਼ ਨਾਸ਼ਤਾ ਮਿਲ ਸਕਦਾ ਹੈ, ਟੀਚਰ ਜੀ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਤੁਸੀਂ ਮੇਰਾ ਸਾਂਝਾ ਕਰੋ, ਅਤੇ ਅਸੀਂ ਨਿਆਂ ਕਰਾਂਗੇ।\" ਅਸੀਂ ਛੋਟੇ ਕੌਰ ਸਾਂਝੇ ਕਰਦੇ ਹਾਂ ਅਤੇ ਮੈਂ ਹੌਲੀ \"ਥੈਂਕ ਯੂ\" ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੇਰਾ ਪੇਟ ਚੰਗਾ ਲੱਗਦਾ ਹੈ ਅਤੇ ਮੇਰੀ ਮੁਸਕਾਨ ਵਾਪਸ ਆ ਜਾਂਦੀ ਹੈ। ਮੈਂ ਖੁਸ਼ ਹਾਂ, ਕਿਉਂਕਿ ਅਸੀਂ ਸਾਂਝਾ ਕੀਤਾ ਅਤੇ ਮੈਂ ਚੰਗੀ ਚੋਣ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What falls on the floor? / ਫਰਸ਼ ਤੇ ਕੀ ਡਿੱਗਦਾ ਹੈ?",
        "choices": [
          "snack / ਨਾਸ਼ਤਾ",
          "book / ਕਿਤਾਬ",
          "hat / ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The snack falls on the floor. / ਨਾਸ਼ਤਾ ਫਰਸ਼ ਤੇ ਡਿੱਗਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "disappointed / ਨਿਰਾਸ਼",
          "excited / ਉਤਸਾਹਿਤ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels disappointed. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਨਿਰਾਸ਼ ਹੈ।"
      },
      {
        "question": "What does the child choose next? / ਬੱਚਾ ਅਗਲਾ ਕੀ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ?",
        "choices": [
          "kindness / ਦਇਆ",
          "fighting / ਲੜਾਈ",
          "hiding / ਛੁਪਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child chooses kindness. / ਪੈਨਲ 3 ਵਿੱਚ ਦਇਆ ਦੀ ਚੋਣ ਹੈ।"
      },
      {
        "question": "What does the friend do? / ਦੋਸਤ ਕੀ ਕਰਦਾ ਹੈ?",
        "choices": [
          "shares snack / ਨਾਸ਼ਤਾ ਸਾਂਝਾ ਕਰਦਾ ਹੈ",
          "takes it away / ਲੈ ਜਾਂਦਾ ਹੈ",
          "cries / ਰੋਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the friend shares. / ਪੈਨਲ 4 ਵਿੱਚ ਦੋਸਤ ਸਾਂਝਾ ਕਰਦਾ ਹੈ।"
      },
      {
        "question": "Why is the child happy? / ਬੱਚਾ ਖੁਸ਼ ਕਿਉਂ ਹੈ?",
        "choices": [
          "they shared / ਉਹਨਾਂ ਨੇ ਸਾਂਝਾ ਕੀਤਾ",
          "the bell rang / ਘੰਟੀ ਵੱਜੀ",
          "they ran outside / ਬਾਹਰ ਦੌੜੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child is happy because they shared. / ਪੈਨਲ 5 ਵਿੱਚ ਸਾਂਝਾ ਕਰਨ ਕਰਕੇ ਬੱਚਾ ਖੁਸ਼ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "snack",
        "meaningEn": "a small food between meals",
        "meaningPa": "ਨਾਸ਼ਤਾ; ਥੋੜ੍ਹਾ ਖਾਣਾ"
      },
      {
        "word": "floor",
        "meaningEn": "the ground inside a room",
        "meaningPa": "ਫਰਸ਼; ਕਮਰੇ ਦੀ ਜ਼ਮੀਨ"
      },
      {
        "word": "clean",
        "meaningEn": "not dirty",
        "meaningPa": "ਸਾਫ਼; ਗੰਦ ਨਾ ਹੋਣਾ"
      },
      {
        "word": "disappointed",
        "meaningEn": "sad because it did not work",
        "meaningPa": "ਨਿਰਾਸ਼; ਮਨ ਮੁਤਾਬਕ ਨਾ ਹੋਇਆ"
      },
      {
        "word": "kindness",
        "meaningEn": "being nice and helpful",
        "meaningPa": "ਦਇਆ; ਚੰਗਾ ਅਤੇ ਮਦਦਗਾਰ ਹੋਣਾ"
      },
      {
        "word": "mess",
        "meaningEn": "a dirty, mixed-up area",
        "meaningPa": "ਗੰਦ; ਬੇਤਰਤੀਬ ਗੰਦੀ ਥਾਂ"
      },
      {
        "word": "share",
        "meaningEn": "give some to someone else",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ; ਦੂਜੇ ਨੂੰ ਵੀ ਦੇਣਾ"
      },
      {
        "word": "bite",
        "meaningEn": "a small piece you eat",
        "meaningPa": "ਕੌਰ; ਛੋਟਾ ਟੁਕੜਾ ਖਾਣਾ"
      },
      {
        "word": "thank you",
        "meaningEn": "polite words after help",
        "meaningPa": "ਥੈਂਕ ਯੂ; ਮਦਦ ਲਈ ਧੰਨਵਾਦ"
      },
      {
        "word": "choice",
        "meaningEn": "the thing you decide to do",
        "meaningPa": "ਚੋਣ; ਜੋ ਤੁਸੀਂ ਕਰਨ ਲਈ ਫੈਸਲਾ ਕਰੋ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "open",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S07",
    "bundleId": 4,
    "orderInBundle": 7,
    "titleEn": "Book 4 · Story 7: Waiting for the Slide",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 7: ਸਲਾਈਡ ਲਈ ਉਡੀਕ",
    "englishStory": "Panel 1 (Intro): Today I am at the playground with friends, and I want the slide. Many kids are in a line, and my turn is not yet.\nPanel 2 (Body): First, I feel excited and a bit impatient, and I wiggle my feet. I stop my feet and hold my hands, so I can wait.\nPanel 3 (Body): Next, I choose to wait my turn, and I count quietly to five. I watch the kids slide down, and I breathe slowly again.\nPanel 4 (Body): Then the teacher says, \"Wait nicely, and keep your hands to yourself.\" I nod my head and stand still in the line.\nPanel 5 (Conclusion): After that, it is my turn at last, and I climb the steps. I slide down fast and laugh because waiting helped me feel proud.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦੋਸਤਾਂ ਨਾਲ ਖੇਡ ਮੈਦਾਨ ਵਿੱਚ ਹਾਂ, ਅਤੇ ਮੈਨੂੰ ਸਲਾਈਡ ਚਾਹੀਦੀ ਹੈ। ਬਹੁਤ ਬੱਚੇ ਕਤਾਰ ਵਿੱਚ ਹਨ, ਅਤੇ ਮੇਰੀ ਵਾਰੀ ਹਾਲੇ ਨਹੀਂ ਆਈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਨੂੰ ਉਤਸਾਹ ਅਤੇ ਥੋੜ੍ਹੀ ਬੇਚੈਨੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮੈਂ ਪੈਰ ਹਿਲਾਉਂਦਾ/ਹਿਲਾਉਂਦੀ ਹਾਂ। ਮੈਂ ਪੈਰ ਰੋਕਦਾ/ਰੋਕਦੀ ਹਾਂ ਅਤੇ ਹੱਥ ਫੜ ਕੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਉਡੀਕ ਕਰ ਸਕਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਆਪਣੀ ਵਾਰੀ ਉਡੀਕ ਕਰਨ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਚੁੱਪਚਾਪ ਪੰਜ ਤੱਕ ਗਿਣਦਾ/ਗਿਣਦੀ ਹਾਂ। ਮੈਂ ਬੱਚਿਆਂ ਨੂੰ ਫਿਸਲਦਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਚੰਗੀ ਤਰ੍ਹਾਂ ਉਡੀਕ ਕਰੋ ਅਤੇ ਹੱਥ ਆਪਣੇ ਕੋਲ ਰੱਖੋ।\" ਮੈਂ ਸਿਰ ਹਿਲਾਉਂਦਾ/ਹਿਲਾਉਂਦੀ ਹਾਂ ਅਤੇ ਕਤਾਰ ਵਿੱਚ ਥਿਰ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਆਖਿਰ ਮੇਰੀ ਵਾਰੀ ਆ ਜਾਂਦੀ ਹੈ ਅਤੇ ਮੈਂ ਸੀੜ੍ਹੀਆਂ ਚੜ੍ਹਦਾ/ਚੜ੍ਹਦੀ ਹਾਂ। ਮੈਂ ਤੇਜ਼ੀ ਨਾਲ ਫਿਸਲਦਾ/ਫਿਸਲਦੀ ਹਾਂ ਅਤੇ ਹੱਸਦਾ/ਹੱਸਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਉਡੀਕ ਨਾਲ ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "playground / ਖੇਡ ਮੈਦਾਨ",
          "hospital / ਹਸਪਤਾਲ",
          "library / ਲਾਇਬ੍ਰੇਰੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the child is at the playground. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਖੇਡ ਮੈਦਾਨ ਵਿੱਚ ਹੈ।"
      },
      {
        "question": "What does the child want? / ਬੱਚਾ ਕੀ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "slide / ਸਲਾਈਡ",
          "book / ਕਿਤਾਬ",
          "bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants the slide. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਸਲਾਈਡ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child choose next? / ਬੱਚਾ ਅਗਲਾ ਕੀ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ?",
        "choices": [
          "wait / ਉਡੀਕ ਕਰਨਾ",
          "push / ਧੱਕਾ ਦੇਣਾ",
          "run away / ਭੱਜ ਜਾਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child chooses to wait. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਉਡੀਕ ਕਰਨ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Wait nicely / ਚੰਗੀ ਤਰ੍ਹਾਂ ਉਡੀਕ ਕਰੋ",
          "Eat now / ਹੁਣ ਖਾਓ",
          "Be loud / ਸ਼ੋਰ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says, \"Wait nicely.\" / ਪੈਨਲ 4 ਵਿੱਚ \"ਚੰਗੀ ਤਰ੍ਹਾਂ ਉਡੀਕ ਕਰੋ\" ਹੈ।"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "child slides / ਬੱਚਾ ਸਲਾਈਡ ਕਰਦਾ ਹੈ",
          "child sleeps / ਬੱਚਾ ਸੌਂਦਾ ਹੈ",
          "child cries / ਬੱਚਾ ਰੋਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says it becomes the child’s turn to slide. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚੇ ਦੀ ਵਾਰੀ ਆਉਂਦੀ ਹੈ ਅਤੇ ਬੱਚਾ ਫਿਸਲਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "playground",
        "meaningEn": "a place outside to play",
        "meaningPa": "ਖੇਡ ਮੈਦਾਨ; ਬਾਹਰ ਖੇਡਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "slide",
        "meaningEn": "a play thing you go down",
        "meaningPa": "ਸਲਾਈਡ; ਜਿਸ ਉੱਤੇ ਬੱਚੇ ਥੱਲੇ ਫਿਸਲਦੇ ਹਨ"
      },
      {
        "word": "line",
        "meaningEn": "people waiting in order",
        "meaningPa": "ਕਤਾਰ; ਵਾਰੀ ਲਈ ਖੜ੍ਹੇ ਲੋਕ"
      },
      {
        "word": "impatient",
        "meaningEn": "not wanting to wait",
        "meaningPa": "ਬੇਚੈਨ; ਉਡੀਕ ਨਾ ਕਰਨੀ ਚਾਹੁੰਨਾ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until your turn comes",
        "meaningPa": "ਉਡੀਕ ਕਰਨੀ; ਵਾਰੀ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      },
      {
        "word": "turn",
        "meaningEn": "your time to do something",
        "meaningPa": "ਵਾਰੀ; ਤੁਹਾਡਾ ਮੌਕਾ"
      },
      {
        "word": "count",
        "meaningEn": "say numbers in order",
        "meaningPa": "ਗਿਣਣਾ; ਨੰਬਰ ਕਹਿਣਾ"
      },
      {
        "word": "steps",
        "meaningEn": "stairs you climb up",
        "meaningPa": "ਸੀੜ੍ਹੀਆਂ; ਚੜ੍ਹਨ ਵਾਲੇ ਪੌੜੇ"
      },
      {
        "word": "excited",
        "meaningEn": "very happy and ready",
        "meaningPa": "ਉਤਸਾਹਿਤ; ਬਹੁਤ ਖੁਸ਼ ਅਤੇ ਤਿਆਰ"
      },
      {
        "word": "nicely",
        "meaningEn": "in a kind, good way",
        "meaningPa": "ਚੰਗੀ ਤਰ੍ਹਾਂ; ਨਮਰਤਾ ਨਾਲ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "turn",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S08",
    "bundleId": 4,
    "orderInBundle": 8,
    "titleEn": "Book 4 · Story 8: Quiet Voice Choice",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 8: ਹੌਲੀ ਆਵਾਜ਼ ਦੀ ਚੋਣ",
    "englishStory": "Panel 1 (Intro): Today I talk loudly in the classroom, and my voice fills the room. My friend looks tired and covers their ears with both hands.\nPanel 2 (Body): First, I notice my friend feels upset, and I stop talking right away. I put my hand on my mouth, and I take a slow breath.\nPanel 3 (Body): Next, I choose a quiet voice for class, so everyone can learn. I whisper, \"I will use a quiet voice now, I promise.\"\nPanel 4 (Body): Then the teacher says, \"Thank you for listening, and thank you for caring.\" I nod, sit still, and keep my voice soft all day.\nPanel 5 (Conclusion): After that, the classroom feels quiet and calm for everyone. My friend smiles at me, and I feel proud of my choice.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਉੱਚੀ ਆਵਾਜ਼ ਨਾਲ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ ਅਤੇ ਮੇਰੀ ਆਵਾਜ਼ ਕਮਰੇ ਵਿੱਚ ਗੂੰਜਦੀ ਹੈ। ਮੇਰਾ ਦੋਸਤ ਥੱਕਿਆ ਲੱਗਦਾ ਹੈ ਅਤੇ ਦੋਵੇਂ ਹੱਥਾਂ ਨਾਲ ਆਪਣੇ ਕੰਨ ਢੱਕਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਕਿ ਦੋਸਤ ਪਰੇਸ਼ਾਨ ਹੈ ਅਤੇ ਮੈਂ ਤੁਰੰਤ ਬੋਲਣਾ ਰੋਕ ਦਿੰਦਾ/ਰੋਕ ਦਿੰਦੀ ਹਾਂ। ਮੈਂ ਹੱਥ ਮੂੰਹ ਤੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਕਲਾਸ ਲਈ ਹੌਲੀ ਆਵਾਜ਼ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਸਭ ਸਿੱਖ ਸਕਣ। ਮੈਂ ਫੁਸਫੁਸਾ ਕੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਹੁਣ ਹੌਲੀ ਬੋਲਾਂਗਾ/ਬੋਲਾਂਗੀ, ਵਾਅਦਾ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਸੁਣਨ ਲਈ ਧੰਨਵਾਦ, ਅਤੇ ਪਰਵਾਹ ਕਰਨ ਲਈ ਵੀ ਧੰਨਵਾਦ।\" ਮੈਂ ਸਿਰ ਹਿਲਾਉਂਦਾ/ਹਿਲਾਉਂਦੀ ਹਾਂ, ਥਿਰ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ ਅਤੇ ਸਾਰੀ ਦਿਨ ਹੌਲੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਕਲਾਸ ਸਭ ਲਈ ਚੁੱਪ ਅਤੇ ਸ਼ਾਂਤ ਲੱਗਦੀ ਹੈ। ਮੇਰਾ ਦੋਸਤ ਮੈਨੂੰ ਮੁਸਕੁਰਾ ਕੇ ਵੇਖਦਾ ਹੈ ਅਤੇ ਮੈਨੂੰ ਆਪਣੀ ਚੋਣ ਤੇ ਮਾਣ ਹੁੰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "classroom / ਕਲਾਸ",
          "park / ਪਾਰਕ",
          "bus stop / ਬੱਸ ਸਟਾਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story happens in the classroom. / ਕਹਾਣੀ ਕਲਾਸ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "What is the problem? / ਸਮੱਸਿਆ ਕੀ ਹੈ?",
        "choices": [
          "talking loudly / ਉੱਚੀ ਆਵਾਜ਼",
          "lost toy / ਖਿਡੌਣਾ ਗੁੰਮ",
          "spilled water / ਪਾਣੀ ਡਿੱਗਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child talks loudly. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਉੱਚੀ ਆਵਾਜ਼ ਨਾਲ ਬੋਲਦਾ/ਬੋਲਦੀ ਹੈ।"
      },
      {
        "question": "What does the child choose next? / ਬੱਚਾ ਅਗਲਾ ਕੀ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ?",
        "choices": [
          "quiet voice / ਹੌਲੀ ਆਵਾਜ਼",
          "running / ਦੌੜਨਾ",
          "crying / ਰੋਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child chooses a quiet voice. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਹੌਲੀ ਆਵਾਜ਼ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Thank you for listening / ਧੰਨਵਾਦ",
          "Be louder / ਹੋਰ ਉੱਚਾ",
          "Go home / ਘਰ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the teacher thanks the child. / ਪੈਨਲ 4 ਵਿੱਚ ਟੀਚਰ ਧੰਨਵਾਦ ਕਹਿੰਦੇ ਹਨ।"
      },
      {
        "question": "How does the class feel at the end? / ਅੰਤ ਵਿੱਚ ਕਲਾਸ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "calm / ਸ਼ਾਂਤ",
          "messy / ਗੰਦੀ",
          "scary / ਡਰਾਉਣੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the classroom feels calm. / ਪੈਨਲ 5 ਵਿੱਚ ਕਲਾਸ ਸ਼ਾਂਤ ਲੱਗਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "loud",
        "meaningEn": "a strong sound; not quiet",
        "meaningPa": "ਉੱਚਾ; ਜ਼ੋਰ ਦੀ ਆਵਾਜ਼"
      },
      {
        "word": "quiet",
        "meaningEn": "a soft sound; not loud",
        "meaningPa": "ਹੌਲੀ/ਚੁੱਪ; ਜ਼ੋਰ ਨਹੀਂ"
      },
      {
        "word": "whisper",
        "meaningEn": "talk very softly",
        "meaningPa": "ਫੁਸਫੁਸਾ ਕੇ ਬੋਲਣਾ; ਬਹੁਤ ਹੌਲੀ ਬੋਲਣਾ"
      },
      {
        "word": "notice",
        "meaningEn": "see and understand something",
        "meaningPa": "ਧਿਆਨ ਦੇਣਾ; ਵੇਖ ਕੇ ਸਮਝਣਾ"
      },
      {
        "word": "upset",
        "meaningEn": "sad or bothered",
        "meaningPa": "ਉਦਾਸ/ਪਰੇਸ਼ਾਨ; ਮਨ ਖਰਾਬ"
      },
      {
        "word": "tired",
        "meaningEn": "needing rest",
        "meaningPa": "ਥੱਕਿਆ; ਆਰਾਮ ਦੀ ਲੋੜ"
      },
      {
        "word": "listen",
        "meaningEn": "use your ears to hear",
        "meaningPa": "ਸੁਣਣਾ; ਧਿਆਨ ਨਾਲ ਸੁਣਨਾ"
      },
      {
        "word": "care",
        "meaningEn": "to be kind and think about others",
        "meaningPa": "ਪਰਵਾਹ; ਦੂਜਿਆਂ ਬਾਰੇ ਸੋਚਣਾ"
      },
      {
        "word": "still",
        "meaningEn": "not moving",
        "meaningPa": "ਥਿਰ; ਨਾ ਹਿਲਣਾ"
      },
      {
        "word": "proud",
        "meaningEn": "happy about doing the right thing",
        "meaningPa": "ਮਾਣ; ਠੀਕ ਕੰਮ ਕਰਕੇ ਖੁਸ਼"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "talk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S09",
    "bundleId": 4,
    "orderInBundle": 9,
    "titleEn": "Book 4 · Story 9: Helping a Scared Friend",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 9: ਡਰੇ ਦੋਸਤ ਦੀ ਮਦਦ",
    "englishStory": "Panel 1 (Intro): Today my friend hears thunder outside, and my friend feels very scared. My friend holds my arm tightly and shakes a little.\nPanel 2 (Body): First, I stay close and speak softly, so my friend feels safe. I feel worried too, but I can help with kind words.\nPanel 3 (Body): Next, I choose gentle words and say, \"Breathe with me very slowly.\" We breathe in and out together, and we count to three.\nPanel 4 (Body): Then the teacher says, \"You are both safe, and you are doing well.\" We sit together on the rug, and the thunder sounds smaller.\nPanel 5 (Conclusion): After that, my friend feels calm again, and the shaking stops. We smile and go back to work, feeling brave and proud.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੇਰਾ ਦੋਸਤ ਬਾਹਰ ਗੱਜਣ ਸੁਣਦਾ ਹੈ ਅਤੇ ਬਹੁਤ ਡਰ ਜਾਂਦਾ ਹੈ। ਦੋਸਤ ਮੇਰੀ ਬਾਂਹ ਕੱਸ ਕੇ ਫੜਦਾ ਹੈ ਅਤੇ ਥੋੜ੍ਹਾ ਕੰਬਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਨੇੜੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਦੋਸਤ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰੇ। ਮੈਨੂੰ ਵੀ ਚਿੰਤਾ ਹੁੰਦੀ ਹੈ, ਪਰ ਮੈਂ ਚੰਗੇ ਸ਼ਬਦਾਂ ਨਾਲ ਮਦਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਨਰਮ ਸ਼ਬਦ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰੇ ਨਾਲ ਬਹੁਤ ਹੌਲੀ ਸਾਹ ਲਵੋ।\" ਅਸੀਂ ਇਕੱਠੇ ਸਾਹ ਅੰਦਰ-ਬਾਹਰ ਲੈਂਦੇ ਹਾਂ ਅਤੇ ਤਿੰਨ ਤੱਕ ਗਿਣਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਤੁਸੀਂ ਦੋਵੇਂ ਸੁਰੱਖਿਅਤ ਹੋ ਅਤੇ ਚੰਗਾ ਕਰ ਰਹੇ ਹੋ।\" ਅਸੀਂ ਚਟਾਈ ਤੇ ਇਕੱਠੇ ਬੈਠਦੇ ਹਾਂ ਅਤੇ ਗੱਜਣ ਘੱਟ ਡਰਾਉਣੀ ਲੱਗਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਦੋਸਤ ਫਿਰ ਸ਼ਾਂਤ ਹੋ ਜਾਂਦਾ ਹੈ ਅਤੇ ਕੰਬਣਾ ਰੁਕ ਜਾਂਦਾ ਹੈ। ਅਸੀਂ ਮੁਸਕੁਰਾ ਕੇ ਕੰਮ ਵੱਲ ਮੁੜਦੇ ਹਾਂ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਬਹਾਦਰ ਮਹਿਸੂਸ ਕਰਦੇ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the friend hear? / ਦੋਸਤ ਕੀ ਸੁਣਦਾ ਹੈ?",
        "choices": [
          "thunder / ਗੱਜਣ",
          "music / ਮਿਊਜ਼ਿਕ",
          "bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the friend hears thunder. / ਪੈਨਲ 1 ਵਿੱਚ ਦੋਸਤ ਗੱਜਣ ਸੁਣਦਾ ਹੈ।"
      },
      {
        "question": "How does the friend feel? / ਦੋਸਤ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
        "choices": [
          "scared / ਡਰਿਆ",
          "hungry / ਭੁੱਖਾ",
          "proud / ਮਾਣ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the friend feels scared. / ਪੈਨਲ 1 ਵਿੱਚ ਦੋਸਤ ਡਰਿਆ ਹੁੰਦਾ ਹੈ।"
      },
      {
        "question": "What does the child say next? / ਬੱਚਾ ਅਗਲਾ ਕੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "Breathe with me / ਮੇਰੇ ਨਾਲ ਸਾਹ ਲਵੋ",
          "Run fast / ਤੇਜ਼ ਦੌੜੋ",
          "Go away / ਦੂਰ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child says to breathe slowly. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਹੌਲੀ ਸਾਹ ਲੈਣ ਲਈ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ।"
      },
      {
        "question": "What does the teacher say? / ਟੀਚਰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "You are safe / ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ",
          "Be loud / ਸ਼ੋਰ ਕਰੋ",
          "Go outside / ਬਾਹਰ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they are safe. / ਪੈਨਲ 4 ਵਿੱਚ ਟੀਚਰ ਸੁਰੱਖਿਅਤ ਕਹਿੰਦੇ ਹਨ।"
      },
      {
        "question": "How does the friend feel after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਦੋਸਤ ਕਿਵੇਂ ਹੈ?",
        "choices": [
          "calm / ਸ਼ਾਂਤ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "lost / ਗੁੰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the friend feels calm again. / ਪੈਨਲ 5 ਵਿੱਚ ਦੋਸਤ ਫਿਰ ਸ਼ਾਂਤ ਹੁੰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "scared",
        "meaningEn": "feeling afraid",
        "meaningPa": "ਡਰਿਆ; ਡਰ ਮਹਿਸੂਸ ਕਰਨਾ"
      },
      {
        "word": "thunder",
        "meaningEn": "a loud sound in a storm",
        "meaningPa": "ਗੱਜਣ; ਤੂਫ਼ਾਨ ਦੀ ਉੱਚੀ ਆਵਾਜ਼"
      },
      {
        "word": "storm",
        "meaningEn": "rain and loud thunder outside",
        "meaningPa": "ਤੂਫ਼ਾਨ; ਮੀਂਹ ਅਤੇ ਗੱਜਣ ਵਾਲਾ ਮੌਸਮ"
      },
      {
        "word": "shake",
        "meaningEn": "move because you are scared",
        "meaningPa": "ਕੰਬਣਾ; ਡਰ ਨਾਲ ਹਿੱਲਣਾ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "softly",
        "meaningEn": "in a gentle, quiet way",
        "meaningPa": "ਹੌਲੀ; ਨਰਮ ਤਰੀਕੇ ਨਾਲ"
      },
      {
        "word": "breathe",
        "meaningEn": "take air in and out slowly",
        "meaningPa": "ਸਾਹ ਲੈਣਾ; ਹੌਲੀ ਸਾਹ ਅੰਦਰ-ਬਾਹਰ"
      },
      {
        "word": "count",
        "meaningEn": "say numbers in order",
        "meaningPa": "ਗਿਣਣਾ; ਨੰਬਰ ਕਹਿਣਾ"
      },
      {
        "word": "brave",
        "meaningEn": "not giving up even when scared",
        "meaningPa": "ਬਹਾਦਰ; ਡਰ ਹੋਵੇ ਵੀ ਹੌਸਲਾ"
      },
      {
        "word": "calm",
        "meaningEn": "peaceful again",
        "meaningPa": "ਸ਼ਾਂਤ; ਸੁਕੂਨ ਨਾਲ ਹੋ ਜਾਣਾ"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "count",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B4_S10",
    "bundleId": 4,
    "orderInBundle": 10,
    "titleEn": "Book 4 · Story 10: Telling the Truth",
    "titlePa": "ਕਿਤਾਬ 4 · ਕਹਾਣੀ 10: ਸੱਚ ਬੋਲਣਾ",
    "englishStory": "Panel 1 (Intro): Today I build a tall block tower with my friend at play time. I bump the tower by accident, and it falls down loudly.\nPanel 2 (Body): First, I feel nervous and worried inside, and my cheeks get warm. I stop and look at my friend, because I want to fix it.\nPanel 3 (Body): Next, I choose to tell the truth, even though I feel scared. I say, \"I did it by accident, and I am really sorry.\"\nPanel 4 (Body): Then my friend says, \"Thank you for telling the truth, and being kind.\" We rebuild together, one block at a time, until it stands again.\nPanel 5 (Conclusion): After that, the tower stands tall again, and we both smile. I feel proud because I told the truth and fixed the problem.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦੋਸਤ ਨਾਲ ਖੇਡ ਸਮੇਂ ਬਲੌਕਾਂ ਦਾ ਉੱਚਾ ਟਾਵਰ ਬਣਾਉਂਦਾ/ਬਣਾਉਂਦੀ ਹਾਂ। ਮੈਂ ਅਣਜਾਣੇ ਵਿੱਚ ਟਾਵਰ ਨੂੰ ਟੱਕਰ ਲਾ ਦਿੰਦਾ/ਲਾ ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਇਹ ਜ਼ੋਰ ਨਾਲ ਡਿੱਗ ਜਾਂਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਨੂੰ ਘਬਰਾਹਟ ਅਤੇ ਚਿੰਤਾ ਹੁੰਦੀ ਹੈ ਅਤੇ ਗੱਲਾਂ ਗਰਮ ਹੋ ਜਾਂਦੀਆਂ ਹਨ। ਮੈਂ ਰੁਕਦਾ/ਰੁਕਦੀ ਹਾਂ ਅਤੇ ਦੋਸਤ ਵੱਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਮੈਂ ਠੀਕ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਸੱਚ ਦੱਸਣ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਭਾਵੇਂ ਮੈਂ ਥੋੜ੍ਹਾ ਡਰਿਆ/ਡਰੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਅਣਜਾਣੇ ਵਿੱਚ ਮੈਂ ਕੀਤਾ, ਅਤੇ ਮੈਨੂੰ ਬਹੁਤ ਮਾਫ਼ ਕਰਨਾ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਸੱਚ ਦੱਸਣ ਲਈ ਧੰਨਵਾਦ, ਅਤੇ ਚੰਗਾ ਬਣਨ ਲਈ ਵੀ ਧੰਨਵਾਦ।\" ਅਸੀਂ ਇਕੱਠੇ ਇਕ-ਇਕ ਬਲੌਕ ਰੱਖ ਕੇ ਟਾਵਰ ਫਿਰ ਬਣਾਉਂਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਟਾਵਰ ਫਿਰ ਉੱਚਾ ਖੜਾ ਹੋ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਸੀਂ ਦੋਵੇਂ ਮੁਸਕੁਰਾਉਂਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ, ਕਿਉਂਕਿ ਮੈਂ ਸੱਚ ਬੋਲਿਆ ਅਤੇ ਸਮੱਸਿਆ ਠੀਕ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What falls down? / ਕੀ ਡਿੱਗਦਾ ਹੈ?",
        "choices": [
          "tower / ਟਾਵਰ",
          "bus / ਬੱਸ",
          "tree / ਦਰੱਖਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The block tower falls down. / ਬਲੌਕ ਟਾਵਰ ਡਿੱਗਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "nervous / ਘਬਰਾਇਆ",
          "excited / ਉਤਸਾਹਿਤ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child feels nervous. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਘਬਰਾਇਆ ਹੁੰਦਾ ਹੈ।"
      },
      {
        "question": "What choice does the child make? / ਬੱਚਾ ਕਿਹੜੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "tell the truth / ਸੱਚ ਦੱਸਣਾ",
          "hide / ਛੁਪਣਾ",
          "blame friend / ਦੋਸਤ ਨੂੰ ਦੋਸ਼"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child tells the truth. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਸੱਚ ਦੱਸਦਾ/ਦੱਸਦੀ ਹੈ।"
      },
      {
        "question": "What do they do then? / ਫਿਰ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "rebuild together / ਇਕੱਠੇ ਬਣਾਉਂਦੇ ਹਨ",
          "fight / ਲੜਦੇ ਹਨ",
          "leave / ਚਲੇ ਜਾਂਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they rebuild together. / ਪੈਨਲ 4 ਵਿੱਚ ਉਹ ਇਕੱਠੇ ਫਿਰ ਬਣਾਉਂਦੇ ਹਨ।"
      },
      {
        "question": "Why is the child proud? / ਬੱਚਾ ਮਾਣ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "told the truth / ਸੱਚ ਬੋਲਿਆ",
          "ate snack / ਨਾਸ਼ਤਾ ਖਾਇਆ",
          "ran fast / ਤੇਜ਼ ਦੌੜਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child is proud for telling the truth. / ਪੈਨਲ 5 ਵਿੱਚ ਸੱਚ ਬੋਲਣ ਕਰਕੇ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "blocks",
        "meaningEn": "toy pieces you stack to build",
        "meaningPa": "ਬਲੌਕ; ਖਿਡੌਣੇ ਦੇ ਟੁਕੜੇ ਬਣਾਉਣ ਲਈ"
      },
      {
        "word": "tower",
        "meaningEn": "a tall stack of blocks",
        "meaningPa": "ਟਾਵਰ; ਬਲੌਕਾਂ ਦਾ ਉੱਚਾ ਢੇਰ"
      },
      {
        "word": "bump",
        "meaningEn": "hit something by accident",
        "meaningPa": "ਟੱਕਰ ਲੱਗਣਾ; ਅਣਜਾਣੇ ਵਿੱਚ ਲੱਗ ਜਾਣਾ"
      },
      {
        "word": "accident",
        "meaningEn": "something that happens by mistake",
        "meaningPa": "ਅਣਜਾਣੀ ਘਟਨਾ; ਗਲਤੀ ਨਾਲ ਹੋ ਜਾਣਾ"
      },
      {
        "word": "nervous",
        "meaningEn": "worried and shaky inside",
        "meaningPa": "ਘਬਰਾਇਆ; ਮਨ ਵਿੱਚ ਡਰ ਅਤੇ ਚਿੰਤਾ"
      },
      {
        "word": "truth",
        "meaningEn": "what really happened",
        "meaningPa": "ਸੱਚ; ਜੋ ਅਸਲ ਵਿੱਚ ਹੋਇਆ"
      },
      {
        "word": "sorry",
        "meaningEn": "words you say after a mistake",
        "meaningPa": "ਮਾਫ਼ ਕਰਨਾ; ਗਲਤੀ ਤੋਂ ਬਾਅਦ ਕਹਿਣਾ"
      },
      {
        "word": "rebuild",
        "meaningEn": "build it again",
        "meaningPa": "ਫਿਰ ਬਣਾਉਣਾ; ਮੁੜ ਤਿਆਰ ਕਰਨਾ"
      },
      {
        "word": "fix",
        "meaningEn": "make it right again",
        "meaningPa": "ਠੀਕ ਕਰਨਾ; ਫਿਰ ਠੀਕ ਬਣਾਉਣਾ"
      },
      {
        "word": "proud",
        "meaningEn": "happy about doing the right thing",
        "meaningPa": "ਮਾਣ; ਠੀਕ ਕੰਮ ਕਰਕੇ ਖੁਸ਼"
      }
    ],
    "partsOfGrammar": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK5_CUSTOM_STORIES = [
  {
    "storyId": "B5_S01",
    "bundleId": 5,
    "orderInBundle": 1,
    "titleEn": "Book 5 · Story 1: I Want to Be a Doctor",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 1: ਮੈਂ ਡਾਕਟਰ ਬਣਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ",
    "englishStory": "Panel 1 (Intro): Today I visit the clinic with my mom after school. I see the doctor smile, and I feel curious and brave.\nPanel 2 (Body): First, I watch the doctor listen to my heart carefully. Tomorrow I will practice with my toy stethoscope at home.\nPanel 3 (Body): Next, I ask, \"How can I help people feel better?\" The doctor says, \"Study, practice, and be kind every day.\"\nPanel 4 (Body): Later, I write my goal in a notebook with a picture. I say, \"I am going to be a doctor someday.\"\nPanel 5 (Conclusion): After that, we say thank you and walk outside together. I feel proud because I have a dream and a plan.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਮਾਂ ਨਾਲ ਕਲੀਨਿਕ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਮੈਂ ਡਾਕਟਰ ਨੂੰ ਮੁਸਕੁਰਾਉਂਦਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਮੈਨੂੰ ਜਿਗਿਆਸਾ ਅਤੇ ਹੌਸਲਾ ਹੁੰਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਡਾਕਟਰ ਨੂੰ ਧਿਆਨ ਨਾਲ ਮੇਰਾ ਦਿਲ ਸੁਣਦਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਭਲਕੇ ਮੈਂ ਘਰ ਵਿੱਚ ਆਪਣੇ ਖਿਡੌਣੇ ਸਟੀਥੋਸਕੋਪ ਨਾਲ ਅਭਿਆਸ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਮੈਂ ਲੋਕਾਂ ਦੀ ਮਦਦ ਕਿਵੇਂ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?\" ਡਾਕਟਰ ਕਹਿੰਦਾ ਹੈ, \"ਪੜ੍ਹੋ, ਅਭਿਆਸ ਕਰੋ, ਅਤੇ ਹਰ ਰੋਜ਼ ਦਿਆਲੂ ਰਹੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮੈਂ ਕਾਪੀ ਵਿੱਚ ਆਪਣਾ ਲਕਸ਼ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ ਅਤੇ ਤਸਵੀਰ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਇਕ ਦਿਨ ਡਾਕਟਰ ਬਣਾਂਗਾ/ਬਣਾਂਗੀ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਧੰਨਵਾਦ ਕਹਿੰਦੇ ਹਾਂ ਅਤੇ ਇਕੱਠੇ ਬਾਹਰ ਤੁਰਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੇਰੇ ਕੋਲ ਸੁਪਨਾ ਅਤੇ ਯੋਜਨਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go today? / ਬੱਚਾ ਅੱਜ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "clinic / ਕਲੀਨਿਕ",
          "park / ਪਾਰਕ",
          "market / ਮਾਰਕੀਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the child visits the clinic. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਕਲੀਨਿਕ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What job does the child want? / ਬੱਚਾ ਕਿਹੜਾ ਕੰਮ ਬਣਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "doctor / ਡਾਕਟਰ",
          "driver / ਡਰਾਈਵਰ",
          "chef / ਰਸੋਈਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child says they want to be a doctor. / ਬੱਚਾ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ ਕਿ ਉਹ ਡਾਕਟਰ ਬਣਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "What will the child do tomorrow? / ਬੱਚਾ ਭਲਕੇ ਕੀ ਕਰੇਗਾ/ਕਰੇਗੀ?",
        "choices": [
          "practice with a toy stethoscope / ਖਿਡੌਣੇ ਸਟੀਥੋਸਕੋਪ ਨਾਲ ਅਭਿਆਸ",
          "sleep all day / ਸਾਰਾ ਦਿਨ ਸੋਣਾ",
          "ride a bus / ਬੱਸ ਚਲਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child will practice tomorrow at home. / ਪੈਨਲ 2 ਵਿੱਚ ਭਲਕੇ ਘਰ ਵਿੱਚ ਅਭਿਆਸ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the doctor say to do every day? / ਡਾਕਟਰ ਹਰ ਰੋਜ਼ ਕੀ ਕਰਨ ਲਈ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "study and be kind / ਪੜ੍ਹੋ ਤੇ ਦਿਆਲੂ ਰਹੋ",
          "shout loudly / ਉੱਚਾ ਚੀਕੋ",
          "hide toys / ਖਿਡੌਣੇ ਲੁਕਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The doctor says to study, practice, and be kind. / ਡਾਕਟਰ ਪੜ੍ਹਨ, ਅਭਿਆਸ, ਅਤੇ ਦਿਆਲਤਾ ਲਈ ਕਹਿੰਦਾ ਹੈ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "proud / ਮਾਣ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "lost / ਗੁੰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels proud. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "dream",
        "meaningEn": "a big hope for your future",
        "meaningPa": "ਸੁਪਨਾ; ਭਵਿੱਖ ਲਈ ਵੱਡੀ ਉਮੀਦ"
      },
      {
        "word": "goal",
        "meaningEn": "something you want to reach",
        "meaningPa": "ਲਕਸ਼; ਜੋ ਤੁਸੀਂ ਹਾਸਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ"
      },
      {
        "word": "plan",
        "meaningEn": "steps you will follow to reach a goal",
        "meaningPa": "ਯੋਜਨਾ; ਲਕਸ਼ ਲਈ ਬਣਾਏ ਕਦਮ"
      },
      {
        "word": "practice",
        "meaningEn": "do something again and again to improve",
        "meaningPa": "ਅਭਿਆਸ; ਵਧੀਆ ਬਣਨ ਲਈ ਵਾਰ-ਵਾਰ ਕਰਨਾ"
      },
      {
        "word": "clinic",
        "meaningEn": "a place where a doctor helps people",
        "meaningPa": "ਕਲੀਨਿਕ; ਜਿੱਥੇ ਡਾਕਟਰ ਮਦਦ ਕਰਦਾ ਹੈ"
      },
      {
        "word": "doctor",
        "meaningEn": "a person who helps sick people get better",
        "meaningPa": "ਡਾਕਟਰ; ਜੋ ਬਿਮਾਰ ਲੋਕਾਂ ਨੂੰ ਠੀਕ ਕਰਦਾ ਹੈ"
      },
      {
        "word": "stethoscope",
        "meaningEn": "a tool doctors use to listen to hearts",
        "meaningPa": "ਸਟੀਥੋਸਕੋਪ; ਦਿਲ ਸੁਣਨ ਵਾਲਾ ਸੰਦ"
      },
      {
        "word": "kind",
        "meaningEn": "nice and helpful to others",
        "meaningPa": "ਦਿਆਲੂ; ਚੰਗਾ ਅਤੇ ਮਦਦਗਾਰ"
      },
      {
        "word": "tomorrow",
        "meaningEn": "the day after today",
        "meaningPa": "ਭਲਕੇ; ਅੱਜ ਤੋਂ ਅਗਲਾ ਦਿਨ"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "be",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S02",
    "bundleId": 5,
    "orderInBundle": 2,
    "titleEn": "Book 5 · Story 2: My Soccer Goal Plan",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 2: ਮੇਰੀ ਫੁੱਟਬਾਲ ਯੋਜਨਾ",
    "englishStory": "Panel 1 (Intro): Today I play soccer with my team after school. I want to score a goal, so I feel excited.\nPanel 2 (Body): First, I practice kicking the ball toward the net slowly. Then my coach says, \"Aim, breathe, and try again.\"\nPanel 3 (Body): Next, I miss the goal, and I feel disappointed for a moment. I take a deep breath, and I practice one more time.\nPanel 4 (Body): Later, I pass the ball to my friend during the game. My friend passes back, and I kick with focus.\nPanel 5 (Conclusion): After that, the ball goes in, and everyone cheers loudly. I feel proud because practice and teamwork helped me succeed.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਟੀਮ ਨਾਲ ਫੁੱਟਬਾਲ ਖੇਡਦਾ/ਖੇਡਦੀ ਹਾਂ। ਮੈਨੂੰ ਗੋਲ ਕਰਨਾ ਹੈ, ਇਸ ਲਈ ਮੈਨੂੰ ਉਤਸਾਹ ਹੁੰਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਗੇਂਦ ਨੂੰ ਹੌਲੀ-ਹੌਲੀ ਜਾਲ ਵੱਲ ਲੱਤ ਮਾਰ ਕੇ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਫਿਰ ਕੋਚ ਕਹਿੰਦਾ ਹੈ, \"ਨਿਸ਼ਾਨਾ ਲਗਾਓ, ਸਾਹ ਲਵੋ, ਅਤੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੇਰਾ ਗੋਲ ਨਹੀਂ ਹੁੰਦਾ ਅਤੇ ਮੈਂ ਥੋੜ੍ਹਾ ਨਿਰਾਸ਼ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ। ਮੈਂ ਡੂੰਘਾ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ ਅਤੇ ਇਕ ਵਾਰੀ ਹੋਰ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮੈਂ ਖੇਡ ਵਿੱਚ ਦੋਸਤ ਨੂੰ ਪਾਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਦੋਸਤ ਵਾਪਸ ਪਾਸ ਕਰਦਾ ਹੈ ਅਤੇ ਮੈਂ ਧਿਆਨ ਨਾਲ ਲੱਤ ਮਾਰਦਾ/ਮਾਰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਗੇਂਦ ਜਾਲ ਵਿੱਚ ਚਲੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਸਭ ਖੁਸ਼ੀ ਨਾਲ ਚੀਕਦੇ ਹਨ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਅਭਿਆਸ ਅਤੇ ਟੀਮਵਰਕ ਨੇ ਮਦਦ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What sport does the child play? / ਬੱਚਾ ਕਿਹੜੀ ਖੇਡ ਖੇਡਦਾ/ਖੇਡਦੀ ਹੈ?",
        "choices": [
          "soccer / ਫੁੱਟਬਾਲ",
          "basketball / ਬਾਸਕਟਬਾਲ",
          "tennis / ਟੈਨਿਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story is about playing soccer. / ਕਹਾਣੀ ਫੁੱਟਬਾਲ ਬਾਰੇ ਹੈ।"
      },
      {
        "question": "What does the child want to do? / ਬੱਚਾ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "score a goal / ਗੋਲ ਕਰਨਾ",
          "eat lunch / ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ",
          "buy a toy / ਖਿਡੌਣਾ ਖਰੀਦਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants to score a goal. / ਪੈਨਲ 1 ਵਿੱਚ ਗੋਲ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the coach say? / ਕੋਚ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "Aim and try again / ਨਿਸ਼ਾਨਾ ਲਗਾਓ ਤੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
          "Stop forever / ਹਮੇਸ਼ਾਂ ਲਈ ਰੁਕੋ",
          "Be late / ਦੇਰ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows the coach encourages trying again. / ਪੈਨਲ 2 ਵਿੱਚ ਕੋਚ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਲਈ ਕਹਿੰਦਾ ਹੈ।"
      },
      {
        "question": "What helps the child succeed? / ਬੱਚੇ ਨੂੰ ਕਾਮਯਾਬ ਕੀ ਬਣਾਉਂਦਾ ਹੈ?",
        "choices": [
          "practice and teamwork / ਅਭਿਆਸ ਤੇ ਟੀਮਵਰਕ",
          "hiding / ਲੁਕਣਾ",
          "shouting / ਚੀਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says practice and teamwork help the child. / ਪੈਨਲ 5 ਵਿੱਚ ਅਭਿਆਸ ਅਤੇ ਟੀਮਵਰਕ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "proud / ਮਾਣ",
          "scared / ਡਰਿਆ",
          "sad / ਉਦਾਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child feels proud after scoring. / ਗੋਲ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "team",
        "meaningEn": "a group that plays together",
        "meaningPa": "ਟੀਮ; ਜੋ ਇਕੱਠੇ ਖੇਡਦੇ ਹਨ"
      },
      {
        "word": "goal",
        "meaningEn": "a point you score in soccer",
        "meaningPa": "ਗੋਲ; ਫੁੱਟਬਾਲ ਵਿੱਚ ਅੰਕ"
      },
      {
        "word": "coach",
        "meaningEn": "a person who teaches a sport",
        "meaningPa": "ਕੋਚ; ਜੋ ਖੇਡ ਸਿਖਾਂਦਾ ਹੈ"
      },
      {
        "word": "practice",
        "meaningEn": "do it again to get better",
        "meaningPa": "ਅਭਿਆਸ; ਵਧੀਆ ਬਣਨ ਲਈ ਮੁੜ ਕਰਨਾ"
      },
      {
        "word": "aim",
        "meaningEn": "point toward the target",
        "meaningPa": "ਨਿਸ਼ਾਨਾ; ਟਾਰਗੇਟ ਵੱਲ ਧਿਆਨ"
      },
      {
        "word": "net",
        "meaningEn": "the goal net where the ball goes",
        "meaningPa": "ਜਾਲ; ਗੋਲ ਦਾ ਜਾਲ"
      },
      {
        "word": "disappointed",
        "meaningEn": "sad because it did not work",
        "meaningPa": "ਨਿਰਾਸ਼; ਮਨ ਮੁਤਾਬਕ ਨਾ ਹੋਇਆ"
      },
      {
        "word": "focus",
        "meaningEn": "pay strong attention",
        "meaningPa": "ਧਿਆਨ; ਪੂਰਾ ਧਿਆਨ ਦੇਣਾ"
      },
      {
        "word": "cheer",
        "meaningEn": "happy shouting to support someone",
        "meaningPa": "ਹੌਸਲਾ ਦੇਣਾ; ਖੁਸ਼ੀ ਨਾਲ ਚੀਕਣਾ"
      },
      {
        "word": "teamwork",
        "meaningEn": "working together to succeed",
        "meaningPa": "ਟੀਮਵਰਕ; ਇਕੱਠੇ ਮਿਲ ਕੇ ਕੰਮ ਕਰਨਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "goes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S03",
    "bundleId": 5,
    "orderInBundle": 3,
    "titleEn": "Book 5 · Story 3: The Science Fair Poster",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 3: ਸਾਇੰਸ ਫੇਅਰ ਦਾ ਪੋਸਟਰ",
    "englishStory": "Panel 1 (Intro): Yesterday my class started a science fair project together. Today I bring my poster board and feel ready.\nPanel 2 (Body): First, I choose pictures and place them in a neat row. Then I glue them carefully, so they do not slide.\nPanel 3 (Body): Next, I write labels with big, clear letters for everyone. I ask my teacher, \"Can you help me spell these words correctly?\"\nPanel 4 (Body): Later, my teacher says, \"Great job, add one more step.\" Finally, I add one more sentence, and my poster looks complete.\nPanel 5 (Conclusion): After that, I practice talking about my project to my friend. I feel proud because my hard work shows clearly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਕੱਲ੍ਹ ਮੇਰੀ ਕਲਾਸ ਨੇ ਸਾਇੰਸ ਫੇਅਰ ਦਾ ਪ੍ਰੋਜੈਕਟ ਸ਼ੁਰੂ ਕੀਤਾ ਸੀ। ਅੱਜ ਮੈਂ ਪੋਸਟਰ ਬੋਰਡ ਲਿਆਉਂਦਾ/ਲਿਆਉਂਦੀ ਹਾਂ ਅਤੇ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਤਸਵੀਰਾਂ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ਸਾਫ਼ ਕਤਾਰ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਧਿਆਨ ਨਾਲ ਗੂੰਦ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਉਹ ਨਾ ਖਿਸਕਣ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਵੱਡੇ ਅਤੇ ਸਾਫ਼ ਅੱਖਰਾਂ ਨਾਲ ਲੇਬਲ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ। ਮੈਂ ਟੀਚਰ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਇਹ ਸ਼ਬਦ ਸਹੀ ਸਪੈਲ ਕਰਨਾ ਸਿਖਾ ਸਕਦੇ ਹੋ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਚੰਗਾ ਕੰਮ, ਇਕ ਕਦਮ ਹੋਰ ਜੋੜੋ।\" ਆਖਿਰਕਾਰ, ਮੈਂ ਇਕ ਵਾਕ ਹੋਰ ਜੋੜਦਾ/ਜੋੜਦੀ ਹਾਂ ਅਤੇ ਪੋਸਟਰ ਮੁਕੰਮਲ ਲੱਗਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਦੋਸਤ ਨੂੰ ਆਪਣਾ ਪ੍ਰੋਜੈਕਟ ਸਮਝਾਉਣ ਦਾ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੇਰੀ ਮਿਹਨਤ ਸਾਫ਼ ਦਿਖਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child make? / ਬੱਚਾ ਕੀ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹੈ?",
        "choices": [
          "science fair poster / ਸਾਇੰਸ ਫੇਅਰ ਪੋਸਟਰ",
          "cake / ਕੇਕ",
          "kite / ਪਤੰਗ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story is about making a science fair poster. / ਕਹਾਣੀ ਸਾਇੰਸ ਫੇਅਰ ਪੋਸਟਰ ਬਾਰੇ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "chooses pictures / ਤਸਵੀਰਾਂ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ",
          "runs outside / ਬਾਹਰ ਦੌੜਦਾ/ਦੌੜਦੀ ਹੈ",
          "takes a nap / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child chooses pictures first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਤਸਵੀਰਾਂ ਚੁਣਦਾ/ਚੁਣਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child glue carefully? / ਬੱਚਾ ਧਿਆਨ ਨਾਲ ਗੂੰਦ ਕਿਉਂ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "so pictures do not slide / ਤਾਂ ਜੋ ਤਸਵੀਰਾਂ ਨਾ ਖਿਸਕਣ",
          "to make noise / ਸ਼ੋਰ ਕਰਨ ਲਈ",
          "to hide it / ਲੁਕਾਉਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says careful glue helps pictures stay in place. / ਪੈਨਲ 2 ਵਿੱਚ ਤਸਵੀਰਾਂ ਥਾਂ ਤੇ ਰਹਿੰਦੀਆਂ ਹਨ।"
      },
      {
        "question": "Who helps the child? / ਬੱਚੇ ਦੀ ਮਦਦ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "teacher / ਟੀਚਰ",
          "driver / ਡਰਾਈਵਰ",
          "chef / ਰਸੋਈਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 and 4 show the teacher helps. / ਪੈਨਲ 3 ਅਤੇ 4 ਵਿੱਚ ਟੀਚਰ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "What does the child practice at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "talking about the project / ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ ਬੋਲਣਾ",
          "swimming / ਤੈਰਨਾ",
          "driving / ਗੱਡੀ ਚਲਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child practices talking about the project. / ਪੈਨਲ 5 ਵਿੱਚ ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ ਬੋਲਣਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "project",
        "meaningEn": "work you do to make or show something",
        "meaningPa": "ਪ੍ਰੋਜੈਕਟ; ਕੋਈ ਕੰਮ ਜੋ ਤੁਸੀਂ ਬਣਾਉਂਦੇ ਹੋ"
      },
      {
        "word": "poster",
        "meaningEn": "a big paper you use to show ideas",
        "meaningPa": "ਪੋਸਟਰ; ਵਿਚਾਰ ਦਿਖਾਉਣ ਵਾਲਾ ਵੱਡਾ ਕਾਗਜ਼"
      },
      {
        "word": "board",
        "meaningEn": "a strong paper for a poster",
        "meaningPa": "ਬੋਰਡ; ਪੋਸਟਰ ਲਈ ਮਜ਼ਬੂਤ ਕਾਗਜ਼"
      },
      {
        "word": "label",
        "meaningEn": "a name word you write near a picture",
        "meaningPa": "ਲੇਬਲ; ਤਸਵੀਰ ਕੋਲ ਲਿਖਿਆ ਨਾਮ"
      },
      {
        "word": "glue",
        "meaningEn": "sticky stuff that holds paper",
        "meaningPa": "ਗੂੰਦ; ਚੀਜ਼ਾਂ ਚਿਪਕਾਉਣ ਵਾਲੀ ਚੀਜ਼"
      },
      {
        "word": "neat",
        "meaningEn": "clean and in order",
        "meaningPa": "ਸਾਫ਼-ਸੁਥਰਾ; ਢੰਗ ਨਾਲ"
      },
      {
        "word": "spell",
        "meaningEn": "write a word with correct letters",
        "meaningPa": "ਸਪੈਲ ਕਰਨਾ; ਸ਼ਬਦ ਸਹੀ ਅੱਖਰਾਂ ਨਾਲ ਲਿਖਣਾ"
      },
      {
        "word": "yesterday",
        "meaningEn": "the day before today",
        "meaningPa": "ਕੱਲ੍ਹ; ਅੱਜ ਤੋਂ ਪਿਛਲਾ ਦਿਨ"
      },
      {
        "word": "finally",
        "meaningEn": "at the end",
        "meaningPa": "ਆਖਿਰਕਾਰ; ਅੰਤ ਵਿੱਚ"
      },
      {
        "word": "practice",
        "meaningEn": "do it again to improve",
        "meaningPa": "ਅਭਿਆਸ; ਵਧੀਆ ਬਣਨ ਲਈ ਦੁਹਰਾਉਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S04",
    "bundleId": 5,
    "orderInBundle": 4,
    "titleEn": "Book 5 · Story 4: My First Library Card",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 4: ਮੇਰਾ ਪਹਿਲਾ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ",
    "englishStory": "Panel 1 (Intro): Today my dad takes me to the library after dinner. I feel excited because I love books and stories.\nPanel 2 (Body): First, the librarian asks my name and address in a polite voice. Then I sign my name, and I get a library card.\nPanel 3 (Body): Next, I choose two picture books and one easy reader. I carry them carefully, so the pages stay safe.\nPanel 4 (Body): Later, the librarian says, \"Return books in two weeks, please.\" I nod and say, \"Thank you, I promise I will remember.\"\nPanel 5 (Conclusion): After that, we read together at home on the couch. I feel proud because I am responsible with borrowed books.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਰਾਤ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਪਿਉ ਮੈਨੂੰ ਲਾਇਬ੍ਰੇਰੀ ਲੈ ਜਾਂਦਾ ਹੈ। ਮੈਨੂੰ ਉਤਸਾਹ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਨੂੰ ਕਿਤਾਬਾਂ ਪਸੰਦ ਹਨ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ/ਵਾਲੀ ਨਮਰ ਆਵਾਜ਼ ਵਿੱਚ ਮੇਰਾ ਨਾਮ ਅਤੇ ਪਤਾ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ। ਫਿਰ ਮੈਂ ਆਪਣਾ ਨਾਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ ਅਤੇ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਮਿਲਦਾ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਦੋ ਤਸਵੀਰਾਂ ਵਾਲੀਆਂ ਕਿਤਾਬਾਂ ਅਤੇ ਇਕ ਸੌਖੀ ਰੀਡਰ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ। ਮੈਂ ਉਹਨਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਫੜਦਾ/ਫੜਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਪੰਨੇ ਸੁਰੱਖਿਅਤ ਰਹਿਣ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ/ਵਾਲੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਕਿਤਾਬਾਂ ਵਾਪਸ ਕਰ ਦਿਓ।\" ਮੈਂ ਸਿਰ ਹਿਲਾਉਂਦਾ/ਹਿਲਾਉਂਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਧੰਨਵਾਦ, ਮੈਂ ਵਾਅਦਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਮੈਂ ਯਾਦ ਰੱਖਾਂਗਾ/ਰੱਖਾਂਗੀ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਘਰ ਵਿੱਚ ਸੋਫੇ ਉੱਤੇ ਇਕੱਠੇ ਪੜ੍ਹਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਉਧਾਰ ਲਿਆਈਆਂ ਕਿਤਾਬਾਂ ਨਾਲ ਜ਼ਿੰਮੇਵਾਰ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "library / ਲਾਇਬ੍ਰੇਰੀ",
          "park / ਪਾਰਕ",
          "store / ਦੁਕਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says the child goes to the library. / ਕਹਾਣੀ ਵਿੱਚ ਬੱਚਾ ਲਾਇਬ੍ਰੇਰੀ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What does the child get? / ਬੱਚੇ ਨੂੰ ਕੀ ਮਿਲਦਾ ਹੈ?",
        "choices": [
          "library card / ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ",
          "bus ticket / ਬੱਸ ਟਿਕਟ",
          "toy car / ਖਿਡੌਣਾ ਗੱਡੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child gets a library card. / ਪੈਨਲ 2 ਵਿੱਚ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਮਿਲਦਾ ਹੈ।"
      },
      {
        "question": "How many weeks until return? / ਕਿੰਨੇ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਵਾਪਸ ਕਰਨਾ ਹੈ?",
        "choices": [
          "two weeks / ਦੋ ਹਫ਼ਤੇ",
          "one day / ਇੱਕ ਦਿਨ",
          "ten weeks / ਦਸ ਹਫ਼ਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says return books in two weeks. / ਪੈਨਲ 4 ਵਿੱਚ ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the child carry books carefully? / ਬੱਚਾ ਕਿਤਾਬਾਂ ਧਿਆਨ ਨਾਲ ਕਿਉਂ ਫੜਦਾ/ਫੜਦੀ ਹੈ?",
        "choices": [
          "to keep pages safe / ਪੰਨੇ ਸੁਰੱਖਿਅਤ ਰਹਿਣ",
          "to run faster / ਤੇਜ਼ ਦੌੜਨ ਲਈ",
          "to be loud / ਉੱਚਾ ਹੋਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says careful carrying keeps pages safe. / ਪੈਨਲ 3 ਵਿੱਚ ਪੰਨੇ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੇ ਹਨ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "proud / ਮਾਣ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "scared / ਡਰਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels proud. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "library",
        "meaningEn": "a place where you borrow books",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀ; ਜਿੱਥੇ ਕਿਤਾਬਾਂ ਉਧਾਰ ਮਿਲਦੀਆਂ ਹਨ"
      },
      {
        "word": "librarian",
        "meaningEn": "a person who helps you in the library",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀ ਵਾਲਾ/ਵਾਲੀ; ਜੋ ਮਦਦ ਕਰਦਾ/ਕਰਦੀ ਹੈ"
      },
      {
        "word": "card",
        "meaningEn": "a small card that shows your membership",
        "meaningPa": "ਕਾਰਡ; ਮੈਂਬਰਸ਼ਿਪ ਵਾਲਾ ਛੋਟਾ ਕਾਰਡ"
      },
      {
        "word": "borrow",
        "meaningEn": "take for a short time and return later",
        "meaningPa": "ਉਧਾਰ ਲੈਣਾ; ਕੁਝ ਸਮੇਂ ਲਈ ਲੈ ਕੇ ਵਾਪਸ ਕਰਨਾ"
      },
      {
        "word": "return",
        "meaningEn": "bring back to the place it came from",
        "meaningPa": "ਵਾਪਸ ਕਰਨਾ; ਮੁੜ ਦੇਣਾ"
      },
      {
        "word": "responsible",
        "meaningEn": "careful and doing the right thing",
        "meaningPa": "ਜ਼ਿੰਮੇਵਾਰ; ਧਿਆਨ ਨਾਲ ਠੀਕ ਕੰਮ ਕਰਨਾ"
      },
      {
        "word": "sign",
        "meaningEn": "write your name",
        "meaningPa": "ਦਸਤਖਤ/ਨਾਮ ਲਿਖਣਾ; ਆਪਣਾ ਨਾਮ ਲਿਖਣਾ"
      },
      {
        "word": "polite",
        "meaningEn": "kind words and good manners",
        "meaningPa": "ਨਮਰ; ਚੰਗੀ ਤਮੀਜ਼ ਨਾਲ"
      },
      {
        "word": "two weeks",
        "meaningEn": "fourteen days",
        "meaningPa": "ਦੋ ਹਫ਼ਤੇ; ਚੌਦਾਂ ਦਿਨ"
      },
      {
        "word": "promise",
        "meaningEn": "say you will do it for sure",
        "meaningPa": "ਵਾਅਦਾ; ਯਕੀਨ ਨਾਲ ਕਹਿਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S05",
    "bundleId": 5,
    "orderInBundle": 5,
    "titleEn": "Book 5 · Story 5: The Festival Lanterns",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 5: ਤਿਉਹਾਰ ਦੀਆਂ ਲੰਟਰਨਾਂ",
    "englishStory": "Panel 1 (Intro): Today our family gets ready for a community festival at night. I feel excited because the street will shine with lights.\nPanel 2 (Body): First, I fold paper and make a lantern with my sister. Then we draw stars and hearts with bright colors.\nPanel 3 (Body): Next, we hang the lanterns carefully on the porch outside. We check the string, so the lanterns do not fall.\nPanel 4 (Body): Later, neighbors arrive and say, \"Your lanterns look beautiful.\" I smile and say, \"Thank you, we made them together.\"\nPanel 5 (Conclusion): After that, we share snacks and watch the lights glow softly. I feel happy because our festival feels warm and friendly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡਾ ਪਰਿਵਾਰ ਰਾਤ ਨੂੰ ਹੋਣ ਵਾਲੇ ਕਮਿਊਨਿਟੀ ਤਿਉਹਾਰ ਲਈ ਤਿਆਰ ਹੁੰਦਾ ਹੈ। ਮੈਨੂੰ ਉਤਸਾਹ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਗਲੀ ਵਿੱਚ ਰੌਸ਼ਨੀਆਂ ਚਮਕਣਗੀਆਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕਾਗਜ਼ ਮੋੜਦਾ/ਮੋੜਦੀ ਹਾਂ ਅਤੇ ਭੈਣ ਨਾਲ ਲੰਟਰਨ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਫਿਰ ਅਸੀਂ ਚਮਕੀਲੇ ਰੰਗਾਂ ਨਾਲ ਤਾਰੇ ਅਤੇ ਦਿਲ ਬਣਾਂਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਅਸੀਂ ਬਾਹਰ ਵਰਾਂਡੇ ਤੇ ਲੰਟਰਨ ਧਿਆਨ ਨਾਲ ਟੰਗਦੇ ਹਾਂ। ਅਸੀਂ ਡੋਰ ਚੈੱਕ ਕਰਦੇ ਹਾਂ, ਤਾਂ ਜੋ ਲੰਟਰਨ ਨਾ ਡਿੱਗਣ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਪੜੋਸੀ ਆ ਕੇ ਕਹਿੰਦੇ ਹਨ, \"ਤੁਹਾਡੀਆਂ ਲੰਟਰਨਾਂ ਬਹੁਤ ਸੋਹਣੀਆਂ ਹਨ।\" ਮੈਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਧੰਨਵਾਦ, ਅਸੀਂ ਇਹ ਇਕੱਠੇ ਬਣਾਈਆਂ ਹਨ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਨਾਸ਼ਤਾ ਸਾਂਝਾ ਕਰਦੇ ਹਾਂ ਅਤੇ ਰੌਸ਼ਨੀਆਂ ਨੂੰ ਹੌਲੀ ਚਮਕਦਾ ਵੇਖਦੇ ਹਾਂ। ਮੈਨੂੰ ਖੁਸ਼ੀ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਤਿਉਹਾਰ ਗਰਮਜੋਸ਼ ਅਤੇ ਦੋਸਤਾਨਾ ਲੱਗਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What event is the family preparing for? / ਪਰਿਵਾਰ ਕਿਸ ਲਈ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ?",
        "choices": [
          "festival / ਤਿਉਹਾਰ",
          "test / ਟੈਸਟ",
          "doctor visit / ਡਾਕਟਰ ਕੋਲ ਜਾਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the family prepares for a festival. / ਪੈਨਲ 1 ਵਿੱਚ ਤਿਉਹਾਰ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they make? / ਉਹ ਕੀ ਬਣਾਂਦੇ ਹਨ?",
        "choices": [
          "lanterns / ਲੰਟਰਨਾਂ",
          "bicycles / ਸਾਈਕਲ",
          "robots / ਰੋਬੋਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they make lanterns. / ਪੈਨਲ 2 ਵਿੱਚ ਲੰਟਰਨਾਂ ਬਣਾਉਂਦੇ ਹਨ।"
      },
      {
        "question": "Where do they hang the lanterns? / ਉਹ ਲੰਟਰਨਾਂ ਕਿੱਥੇ ਟੰਗਦੇ ਹਨ?",
        "choices": [
          "on the porch / ਵਰਾਂਡੇ ਤੇ",
          "in the sink / ਸਿੰਕ ਵਿੱਚ",
          "on the bus / ਬੱਸ ਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they hang lanterns on the porch. / ਪੈਨਲ 3 ਵਿੱਚ ਵਰਾਂਡੇ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why do they check the string? / ਉਹ ਡੋਰ ਕਿਉਂ ਚੈੱਕ ਕਰਦੇ ਹਨ?",
        "choices": [
          "so lanterns do not fall / ਤਾਂ ਜੋ ਨਾ ਡਿੱਗਣ",
          "to make it loud / ਸ਼ੋਰ ਕਰਨ ਲਈ",
          "to lose it / ਗੁੰਮ ਕਰਨ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They check the string so lanterns stay up safely. / ਡੋਰ ਚੈੱਕ ਕਰਕੇ ਲੰਟਰਨ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੀਆਂ ਹਨ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "happy / ਖੁਸ਼",
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels happy. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਖੁਸ਼ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "festival",
        "meaningEn": "a special community celebration",
        "meaningPa": "ਤਿਉਹਾਰ; ਖਾਸ ਕਮਿਊਨਿਟੀ ਜਸ਼ਨ"
      },
      {
        "word": "lantern",
        "meaningEn": "a light you can hang up",
        "meaningPa": "ਲੰਟਰਨ; ਟੰਗਣ ਵਾਲੀ ਰੌਸ਼ਨੀ"
      },
      {
        "word": "fold",
        "meaningEn": "bend paper to make a shape",
        "meaningPa": "ਮੋੜਨਾ; ਕਾਗਜ਼ ਨੂੰ ਆਕਾਰ ਦੇਣਾ"
      },
      {
        "word": "hang",
        "meaningEn": "put something up on a hook or string",
        "meaningPa": "ਟੰਗਣਾ; ਡੋਰ ਜਾਂ ਕਿਲੀ ਤੇ ਲਗਾਉਣਾ"
      },
      {
        "word": "string",
        "meaningEn": "thin rope used to tie things",
        "meaningPa": "ਡੋਰ; ਪਤਲੀ ਰੱਸੀ"
      },
      {
        "word": "neighbors",
        "meaningEn": "people who live near you",
        "meaningPa": "ਪੜੋਸੀ; ਨੇੜੇ ਰਹਿਣ ਵਾਲੇ ਲੋਕ"
      },
      {
        "word": "beautiful",
        "meaningEn": "very pretty",
        "meaningPa": "ਸੋਹਣਾ; ਬਹੁਤ ਸੁੰਦਰ"
      },
      {
        "word": "together",
        "meaningEn": "with other people",
        "meaningPa": "ਇਕੱਠੇ; ਹੋਰਾਂ ਨਾਲ"
      },
      {
        "word": "glow",
        "meaningEn": "shine softly",
        "meaningPa": "ਹੌਲੀ ਚਮਕਣਾ; ਨਰਮ ਰੌਸ਼ਨੀ"
      },
      {
        "word": "share",
        "meaningEn": "give some to others",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ; ਦੂਜਿਆਂ ਨਾਲ ਵੰਡਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "draw",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "share",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S06",
    "bundleId": 5,
    "orderInBundle": 6,
    "titleEn": "Book 5 · Story 6: A Family Cooking Day",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 6: ਪਰਿਵਾਰ ਨਾਲ ਖਾਣਾ ਬਣਾਉਣਾ",
    "englishStory": "Panel 1 (Intro): Today my family cooks dinner together in our kitchen. We read a simple recipe together, and I get a helper job.\nPanel 2 (Body): First, I wash my hands with soap and warm water carefully. Then Mom says, \"Cut the soft vegetables slowly and safely.\"\nPanel 3 (Body): Next, I put vegetables in a bowl and stir them gently. I add salt with a small spoon, so it tastes good.\nPanel 4 (Body): Later, Dad says, \"Now we will cook it on the stove.\" I watch the pot and listen for the timer bell.\nPanel 5 (Conclusion): After that, we sit down and eat dinner with smiles. I feel proud because I helped and followed the steps.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡਾ ਪਰਿਵਾਰ ਰਸੋਈ ਵਿੱਚ ਇਕੱਠੇ ਰਾਤ ਦਾ ਖਾਣਾ ਬਣਾਂਦਾ ਹੈ। ਅਸੀਂ ਇਕ ਸੌਖੀ ਰੇਸਪੀ ਇਕੱਠੇ ਪੜ੍ਹਦੇ ਹਾਂ, ਅਤੇ ਮੈਨੂੰ ਮਦਦਗਾਰ ਕੰਮ ਮਿਲਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਸਾਬਣ ਅਤੇ ਗਰਮ ਪਾਣੀ ਨਾਲ ਹੱਥ ਧੋਦਾ/ਧੋਦੀ ਹਾਂ। ਫਿਰ ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਨਰਮ ਸਬਜ਼ੀਆਂ ਹੌਲੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਕੱਟੋ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਸਬਜ਼ੀਆਂ ਕਟੋਰੀ ਵਿੱਚ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਹਿਲਾਂਦਾ/ਹਿਲਾਂਦੀ ਹਾਂ। ਮੈਂ ਛੋਟੀ ਚਮਚੀ ਨਾਲ ਨਮਕ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਸੁਆਦ ਚੰਗਾ ਹੋਵੇ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਹੁਣ ਅਸੀਂ ਇਸਨੂੰ ਚੂਲੇ ਤੇ ਪਕਾਵਾਂਗੇ।\" ਮੈਂ ਪਤੀਲਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਟਾਈਮਰ ਦੀ ਘੰਟੀ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਬੈਠ ਕੇ ਮੁਸਕੁਰਾਉਂਦੇ ਹੋਏ ਖਾਣਾ ਖਾਂਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਕਦਮ ਫੋਲੋ ਕਰਕੇ ਮਦਦ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they cook? / ਉਹ ਕਿੱਥੇ ਖਾਣਾ ਬਣਾਂਦੇ ਹਨ?",
        "choices": [
          "kitchen / ਰਸੋਈ",
          "playground / ਖੇਡ ਮੈਦਾਨ",
          "bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they cook in the kitchen. / ਪੈਨਲ 1 ਵਿੱਚ ਰਸੋਈ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they read together? / ਉਹ ਇਕੱਠੇ ਕੀ ਪੜ੍ਹਦੇ ਹਨ?",
        "choices": [
          "recipe / ਰੇਸਪੀ",
          "map / ਨਕਸ਼ਾ",
          "ticket / ਟਿਕਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they read a simple recipe together. / ਪੈਨਲ 1 ਵਿੱਚ ਸੌਖੀ ਰੇਸਪੀ ਪੜ੍ਹਦੇ ਹਨ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "washes hands / ਹੱਥ ਧੋਦਾ/ਧੋਦੀ ਹੈ",
          "runs outside / ਬਾਹਰ ਦੌੜਦਾ/ਦੌੜਦੀ ਹੈ",
          "goes to sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child washes hands first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਹੱਥ ਧੋਣੇ ਹਨ।"
      },
      {
        "question": "What do they use to know the time? / ਸਮਾਂ ਜਾਣਨ ਲਈ ਉਹ ਕੀ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "timer / ਟਾਈਮਰ",
          "pillow / ਤਕੀਆ",
          "ball / ਗੇਂਦ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 mentions listening for the timer bell. / ਪੈਨਲ 4 ਵਿੱਚ ਟਾਈਮਰ ਦੀ ਘੰਟੀ ਹੈ।"
      },
      {
        "question": "Why is the child proud? / ਬੱਚਾ ਮਾਣ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "helped and followed steps / ਮਦਦ ਕੀਤੀ ਤੇ ਕਦਮ ਫੋਲੋ ਕੀਤੇ",
          "broke a plate / ਪਲੇਟ ਤੋੜੀ",
          "made a mess / ਗੰਦ ਕੀਤਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child is proud for helping. / ਪੈਨਲ 5 ਵਿੱਚ ਮਦਦ ਕਰਕੇ ਮਾਣ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "recipe",
        "meaningEn": "instructions for cooking food",
        "meaningPa": "ਰੇਸਪੀ; ਖਾਣਾ ਬਣਾਉਣ ਦੀ ਹਦਾਇਤ"
      },
      {
        "word": "steps",
        "meaningEn": "small parts of a plan you follow",
        "meaningPa": "ਕਦਮ; ਯੋਜਨਾ ਦੇ ਛੋਟੇ ਹਿੱਸੇ"
      },
      {
        "word": "wash",
        "meaningEn": "clean with water and soap",
        "meaningPa": "ਧੋਣਾ; ਪਾਣੀ ਅਤੇ ਸਾਬਣ ਨਾਲ ਸਾਫ਼ ਕਰਨਾ"
      },
      {
        "word": "cut",
        "meaningEn": "make pieces with a knife",
        "meaningPa": "ਕੱਟਣਾ; ਚਾਕੂ ਨਾਲ ਟੁਕੜੇ ਕਰਨਾ"
      },
      {
        "word": "stir",
        "meaningEn": "mix by moving a spoon around",
        "meaningPa": "ਹਿਲਾਉਣਾ; ਚਮਚੀ ਨਾਲ ਮਿਕਸ ਕਰਨਾ"
      },
      {
        "word": "bowl",
        "meaningEn": "a round dish for food",
        "meaningPa": "ਕਟੋਰੀ; ਖਾਣੇ ਲਈ ਗੋਲ ਬਰਤਨ"
      },
      {
        "word": "spoon",
        "meaningEn": "a tool for eating or measuring",
        "meaningPa": "ਚਮਚੀ; ਖਾਣ ਜਾਂ ਮਾਪਣ ਲਈ"
      },
      {
        "word": "stove",
        "meaningEn": "a place where food is cooked",
        "meaningPa": "ਚੂਲਾ; ਜਿੱਥੇ ਖਾਣਾ ਪਕਦਾ ਹੈ"
      },
      {
        "word": "timer",
        "meaningEn": "a clock that tells when time is done",
        "meaningPa": "ਟਾਈਮਰ; ਸਮਾਂ ਮੁਕਣ ਦੀ ਘੜੀ"
      },
      {
        "word": "safe",
        "meaningEn": "not dangerous or hurtful",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "cooks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "cook",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S07",
    "bundleId": 5,
    "orderInBundle": 7,
    "titleEn": "Book 5 · Story 7: Planting a Small Garden",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 7: ਛੋਟਾ ਬਾਗ ਲਗਾਉਣਾ",
    "englishStory": "Panel 1 (Intro): Today I plant seeds with my grandma in the backyard. I feel happy because we are starting something new.\nPanel 2 (Body): First, we dig a small hole and add soft soil gently. Then we drop seeds inside and cover them carefully.\nPanel 3 (Body): Next, I water the soil with a small cup every morning. I make a simple schedule, so I do not forget.\nPanel 4 (Body): Later, Grandma says, \"Plants need time, so be patient.\" I wait and watch, and I look for tiny green leaves.\nPanel 5 (Conclusion): After that, we see sprouts, and we clap our hands softly. I feel proud because care and patience helped our garden grow.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦਾਦੀ/ਨਾਨੀ ਨਾਲ ਪਿੱਛੇ ਆੰਗਣ ਵਿੱਚ ਬੀਜ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਖੁਸ਼ੀ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਅਸੀਂ ਕੁਝ ਨਵਾਂ ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਛੋਟਾ ਖੱਡਾ ਖੋਦਦੇ ਹਾਂ ਅਤੇ ਨਰਮ ਮਿੱਟੀ ਪਾਂਦੇ ਹਾਂ। ਫਿਰ ਅਸੀਂ ਬੀਜ ਅੰਦਰ ਪਾਂਦੇ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਢੱਕ ਦਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਹਰ ਸਵੇਰੇ ਛੋਟੀ ਕੱਪ ਨਾਲ ਮਿੱਟੀ ਨੂੰ ਪਾਣੀ ਦੇਂਦਾ/ਦੇਂਦੀ ਹਾਂ। ਮੈਂ ਸੌਖਾ ਸ਼ਡਿਊਲ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਭੁੱਲ ਨਾ ਜਾਵਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਦਾਦੀ/ਨਾਨੀ ਕਹਿੰਦੀ ਹੈ, \"ਪੌਦਿਆਂ ਨੂੰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ, ਧੀਰਜ ਰੱਖੋ।\" ਮੈਂ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਛੋਟੇ ਹਰੇ ਪੱਤੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਨੰਨੇ ਅੰਕੁਰ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਹੌਲੀ ਤਾਲੀ ਵਜਾਂਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਸੰਭਾਲ ਅਤੇ ਧੀਰਜ ਨਾਲ ਬਾਗ ਵਧਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What do they plant? / ਉਹ ਕੀ ਲਗਾਂਦੇ ਹਨ?",
        "choices": [
          "seeds / ਬੀਜ",
          "shoes / ਜੁੱਤੇ",
          "books / ਕਿਤਾਬਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they plant seeds. / ਪੈਨਲ 1 ਵਿੱਚ ਬੀਜ ਲਗਾਉਂਦੇ ਹਨ।"
      },
      {
        "question": "Where do they plant? / ਉਹ ਕਿੱਥੇ ਲਗਾਂਦੇ ਹਨ?",
        "choices": [
          "backyard / ਆੰਗਣ",
          "bus / ਬੱਸ",
          "store / ਦੁਕਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says they plant in the backyard. / ਕਹਾਣੀ ਵਿੱਚ ਆੰਗਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child do every morning? / ਬੱਚਾ ਹਰ ਸਵੇਰੇ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "waters the soil / ਮਿੱਟੀ ਨੂੰ ਪਾਣੀ ਦੇਂਦਾ/ਦੇਂਦੀ ਹੈ",
          "jumps on bed / ਬਿਸਤਰੇ ਤੇ ਕੂਦਦਾ/ਕੂਦਦੀ ਹੈ",
          "draws cars / ਗੱਡੀਆਂ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child waters the soil every morning. / ਪੈਨਲ 3 ਵਿੱਚ ਹਰ ਸਵੇਰੇ ਪਾਣੀ ਹੈ।"
      },
      {
        "question": "What does Grandma teach? / ਦਾਦੀ/ਨਾਨੀ ਕੀ ਸਿਖਾਂਦੀ ਹੈ?",
        "choices": [
          "be patient / ਧੀਰਜ ਰੱਖੋ",
          "be loud / ਸ਼ੋਰ ਕਰੋ",
          "run away / ਭੱਜ ਜਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says plants need time, so be patient. / ਪੈਨਲ 4 ਵਿੱਚ ਧੀਰਜ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they see at the end? / ਅੰਤ ਵਿੱਚ ਉਹ ਕੀ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "sprouts / ਅੰਕੁਰ",
          "snow / ਬਰਫ਼",
          "a bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they see sprouts. / ਪੈਨਲ 5 ਵਿੱਚ ਅੰਕੁਰ ਵੇਖਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "seed",
        "meaningEn": "a tiny thing that can grow into a plant",
        "meaningPa": "ਬੀਜ; ਜਿਸ ਤੋਂ ਪੌਦਾ ਬਣਦਾ ਹੈ"
      },
      {
        "word": "soil",
        "meaningEn": "dirt where plants grow",
        "meaningPa": "ਮਿੱਟੀ; ਜਿੱਥੇ ਪੌਦੇ ਉੱਗਦੇ ਹਨ"
      },
      {
        "word": "dig",
        "meaningEn": "make a hole in the ground",
        "meaningPa": "ਖੋਦਣਾ; ਜ਼ਮੀਨ ਵਿੱਚ ਖੱਡਾ ਕਰਨਾ"
      },
      {
        "word": "cover",
        "meaningEn": "put soil on top",
        "meaningPa": "ਢੱਕਣਾ; ਉੱਤੇ ਮਿੱਟੀ ਪਾਉਣਾ"
      },
      {
        "word": "water",
        "meaningEn": "give water to help it grow",
        "meaningPa": "ਪਾਣੀ ਦੇਣਾ; ਵਧਣ ਲਈ ਪਾਣੀ ਪਾਉਣਾ"
      },
      {
        "word": "schedule",
        "meaningEn": "a plan for when you do things",
        "meaningPa": "ਸ਼ਡਿਊਲ; ਕਦੋਂ ਕੀ ਕਰਨਾ ਹੈ ਯੋਜਨਾ"
      },
      {
        "word": "patient",
        "meaningEn": "able to wait calmly",
        "meaningPa": "ਧੀਰਜ ਵਾਲਾ; ਸ਼ਾਂਤ ਹੋ ਕੇ ਉਡੀਕ ਕਰਨਾ"
      },
      {
        "word": "sprout",
        "meaningEn": "a tiny new plant",
        "meaningPa": "ਅੰਕੁਰ; ਨੰਨਾ ਨਵਾਂ ਪੌਦਾ"
      },
      {
        "word": "grow",
        "meaningEn": "get bigger over time",
        "meaningPa": "ਵਧਣਾ; ਸਮੇਂ ਨਾਲ ਵੱਡਾ ਹੋਣਾ"
      },
      {
        "word": "care",
        "meaningEn": "help and protect something",
        "meaningPa": "ਸੰਭਾਲ; ਧਿਆਨ ਨਾਲ ਰੱਖਿਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "plant",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "plants",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S08",
    "bundleId": 5,
    "orderInBundle": 8,
    "titleEn": "Book 5 · Story 8: Saving Money for a Bike",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 8: ਸਾਈਕਲ ਲਈ ਪੈਸੇ ਬਚਾਉਣਾ",
    "englishStory": "Panel 1 (Intro): Today I see a bright bike in the store window. I want it a lot, so I make a savings goal.\nPanel 2 (Body): First, I save coins in a jar after doing small chores. Then I write the amount on a chart each week.\nPanel 3 (Body): Next, I choose to wait and not buy candy every day. I feel proud because I am learning self-control.\nPanel 4 (Body): Later, Mom says, \"Next month we will check your total money.\" I count carefully, and I smile at my growing jar.\nPanel 5 (Conclusion): After that, I am closer to buying my bike and a helmet. I feel happy because planning and saving help my dream.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦੁਕਾਨ ਦੀ ਖਿੜਕੀ ਵਿੱਚ ਚਮਕੀਲੀ ਸਾਈਕਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਨੂੰ ਬਹੁਤ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਬਚਤ ਦਾ ਲਕਸ਼ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਛੋਟੇ ਘਰੇਲੂ ਕੰਮ ਕਰ ਕੇ ਸਿੱਕੇ ਜਾਰ ਵਿੱਚ ਬਚਾਂਦਾ/ਬਚਾਂਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਹਰ ਹਫ਼ਤੇ ਚਾਰਟ ਤੇ ਰਕਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਉਡੀਕ ਕਰਨ ਦੀ ਚੋਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਹਰ ਰੋਜ਼ ਕੈਂਡੀ ਨਹੀਂ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਆਪਣੇ ਆਪ ਨੂੰ ਰੋਕਣਾ ਸਿੱਖ ਰਿਹਾ/ਰਿਹੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਅਗਲੇ ਮਹੀਨੇ ਅਸੀਂ ਤੇਰੀ ਕੁੱਲ ਰਕਮ ਵੇਖਾਂਗੇ।\" ਮੈਂ ਧਿਆਨ ਨਾਲ ਗਿਣਦਾ/ਗਿਣਦੀ ਹਾਂ ਅਤੇ ਜਾਰ ਵਧਦਾ ਵੇਖ ਕੇ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਸਾਈਕਲ ਅਤੇ ਹੈਲਮੈਟ ਖਰੀਦਣ ਦੇ ਨੇੜੇ ਹੋ ਜਾਂਦਾ/ਹੋ ਜਾਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਖੁਸ਼ੀ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਯੋਜਨਾ ਅਤੇ ਬਚਤ ਸੁਪਨੇ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child want to buy? / ਬੱਚਾ ਕੀ ਖਰੀਦਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "bike / ਸਾਈਕਲ",
          "book / ਕਿਤਾਬ",
          "dog / ਕੁੱਤਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants a bike. / ਪੈਨਲ 1 ਵਿੱਚ ਸਾਈਕਲ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Where does the child put coins? / ਬੱਚਾ ਸਿੱਕੇ ਕਿੱਥੇ ਪਾਂਦਾ/ਪਾਂਦੀ ਹੈ?",
        "choices": [
          "jar / ਜਾਰ",
          "shoe / ਜੁੱਤਾ",
          "pocket / ਜੇਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child saves coins in a jar. / ਪੈਨਲ 2 ਵਿੱਚ ਜਾਰ ਵਿੱਚ ਸਿੱਕੇ ਬਚਾਉਂਦਾ/ਬਚਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What does the child stop buying every day? / ਬੱਚਾ ਹਰ ਰੋਜ਼ ਕੀ ਨਹੀਂ ਖਰੀਦਦਾ/ਖਰੀਦਦੀ ਹੈ?",
        "choices": [
          "candy / ਕੈਂਡੀ",
          "water / ਪਾਣੀ",
          "pencils / ਪੈਂਸਿਲਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child does not buy candy every day. / ਪੈਨਲ 3 ਵਿੱਚ ਕੈਂਡੀ ਨਹੀਂ ਲੈਂਦਾ/ਲੈਂਦੀ।"
      },
      {
        "question": "When will Mom check the total money? / ਮਾਂ ਕਦੋਂ ਕੁੱਲ ਪੈਸੇ ਵੇਖੇਗੀ?",
        "choices": [
          "next month / ਅਗਲਾ ਮਹੀਨਾ",
          "yesterday / ਕੱਲ੍ਹ",
          "today / ਅੱਜ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says Mom will check next month. / ਪੈਨਲ 4 ਵਿੱਚ ਅਗਲੇ ਮਹੀਨੇ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why is the child happy at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਖੁਸ਼ ਕਿਉਂ ਹੈ?",
        "choices": [
          "saving helps the dream / ਬਚਤ ਸੁਪਨੇ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ",
          "it is raining / ਮੀਂਹ ਪੈਂਦਾ ਹੈ",
          "class is loud / ਕਲਾਸ ਸ਼ੋਰ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says planning and saving help the dream. / ਪੈਨਲ 5 ਵਿੱਚ ਯੋਜਨਾ ਅਤੇ ਬਚਤ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "save",
        "meaningEn": "keep money instead of spending it",
        "meaningPa": "ਬਚਾਉਣਾ; ਖਰਚ ਨਾ ਕਰਕੇ ਰੱਖਣਾ"
      },
      {
        "word": "money",
        "meaningEn": "coins and bills you use to buy things",
        "meaningPa": "ਪੈਸਾ; ਸਿੱਕੇ ਅਤੇ ਨੋਟ"
      },
      {
        "word": "jar",
        "meaningEn": "a container to hold coins",
        "meaningPa": "ਜਾਰ; ਸਿੱਕੇ ਰੱਖਣ ਵਾਲਾ ਬਰਤਨ"
      },
      {
        "word": "chores",
        "meaningEn": "small jobs at home",
        "meaningPa": "ਘਰੇਲੂ ਕੰਮ; ਛੋਟੇ ਕੰਮ"
      },
      {
        "word": "chart",
        "meaningEn": "a paper that shows numbers and progress",
        "meaningPa": "ਚਾਰਟ; ਨੰਬਰ ਅਤੇ ਤਰੱਕੀ ਦਿਖਾਉਣ ਵਾਲਾ ਕਾਗਜ਼"
      },
      {
        "word": "amount",
        "meaningEn": "how much you have",
        "meaningPa": "ਰਕਮ; ਕਿੰਨਾ ਪੈਸਾ ਹੈ"
      },
      {
        "word": "self-control",
        "meaningEn": "stopping yourself from doing something",
        "meaningPa": "ਆਪਣੇ ਆਪ ਨੂੰ ਰੋਕਣਾ; ਕਾਬੂ"
      },
      {
        "word": "total",
        "meaningEn": "all added together",
        "meaningPa": "ਕੁੱਲ; ਸਾਰਾ ਜੋੜ ਕੇ"
      },
      {
        "word": "helmet",
        "meaningEn": "a hard hat to keep your head safe",
        "meaningPa": "ਹੈਲਮੈਟ; ਸਿਰ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ ਟੋਪੀ"
      },
      {
        "word": "next month",
        "meaningEn": "the month after this one",
        "meaningPa": "ਅਗਲਾ ਮਹੀਨਾ; ਇਸ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਮਹੀਨਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "save",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S09",
    "bundleId": 5,
    "orderInBundle": 9,
    "titleEn": "Book 5 · Story 9: Helping at the Food Drive",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 9: ਫੂਡ ਡਰਾਈਵ ਵਿੱਚ ਮਦਦ",
    "englishStory": "Panel 1 (Intro): Today my class joins a food drive at our school. I feel proud because we are helping many families.\nPanel 2 (Body): First, we carry boxes of cans to the table carefully. Then we sort food by labels, like beans and rice.\nPanel 3 (Body): Next, I work with a volunteer who smiles and guides me. I ask, \"Where should this bag go, please?\"\nPanel 4 (Body): Later, the volunteer says, \"Put it in the donation bin over there.\" I follow the direction, and I move quickly but safely.\nPanel 5 (Conclusion): After that, we clean up the area and say thank you together. I feel happy because small help can make a big difference.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੇਰੀ ਕਲਾਸ ਸਕੂਲ ਵਿੱਚ ਫੂਡ ਡਰਾਈਵ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦੀ ਹੈ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਅਸੀਂ ਕਈ ਪਰਿਵਾਰਾਂ ਦੀ ਮਦਦ ਕਰ ਰਹੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਕੈਨਾਂ ਵਾਲੇ ਡੱਬੇ ਧਿਆਨ ਨਾਲ ਮੇਜ਼ ਤੱਕ ਲੈ ਜਾਂਦੇ ਹਾਂ। ਫਿਰ ਅਸੀਂ ਲੇਬਲ ਦੇ ਮੁਤਾਬਕ ਖਾਣਾ ਛਾਂਟਦੇ ਹਾਂ, ਜਿਵੇਂ ਬੀਨਸ ਅਤੇ ਚੌਲ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਇਕ ਵਲੰਟੀਅਰ ਨਾਲ ਕੰਮ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਜੋ ਮੁਸਕੁਰਾਉਂਦਾ ਹੈ ਅਤੇ ਮੈਨੂੰ ਦੱਸਦਾ ਹੈ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਬੈਗ ਕਿੱਥੇ ਰੱਖਾਂ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਵਲੰਟੀਅਰ ਕਹਿੰਦਾ ਹੈ, \"ਉਸ ਪਾਸੇ ਦਾਨ ਵਾਲੇ ਡੱਬੇ ਵਿੱਚ ਰੱਖ ਦਿਓ।\" ਮੈਂ ਹਦਾਇਤ ਮੰਨਦਾ/ਮੰਨਦੀ ਹਾਂ ਅਤੇ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਤੇਜ਼ੀ ਨਾਲ ਹਿਲਦਾ/ਹਿਲਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਥਾਂ ਸਾਫ਼ ਕਰਦੇ ਹਾਂ ਅਤੇ ਇਕੱਠੇ ਧੰਨਵਾਦ ਕਹਿੰਦੇ ਹਾਂ। ਮੈਨੂੰ ਖੁਸ਼ੀ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਛੋਟੀ ਮਦਦ ਵੀ ਵੱਡਾ ਫਰਕ ਪਾ ਸਕਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What event does the class join? / ਕਲਾਸ ਕਿਸ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦੀ ਹੈ?",
        "choices": [
          "food drive / ਫੂਡ ਡਰਾਈਵ",
          "movie night / ਫਿਲਮ ਰਾਤ",
          "birthday party / ਜਨਮਦਿਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the class joins a food drive. / ਪੈਨਲ 1 ਵਿੱਚ ਫੂਡ ਡਰਾਈਵ ਹੈ।"
      },
      {
        "question": "What do they carry? / ਉਹ ਕੀ ਲੈ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "boxes of cans / ਕੈਨਾਂ ਵਾਲੇ ਡੱਬੇ",
          "chairs / ਕੁਰਸੀਆਂ",
          "bicycles / ਸਾਈਕਲਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they carry boxes of cans. / ਪੈਨਲ 2 ਵਿੱਚ ਕੈਨਾਂ ਵਾਲੇ ਡੱਬੇ ਹਨ।"
      },
      {
        "question": "How do they sort the food? / ਉਹ ਖਾਣਾ ਕਿਵੇਂ ਛਾਂਟਦੇ ਹਨ?",
        "choices": [
          "by labels / ਲੇਬਲ ਮੁਤਾਬਕ",
          "by colors only / ਸਿਰਫ਼ ਰੰਗਾਂ ਨਾਲ",
          "by jokes / ਮਜ਼ਾਕਾਂ ਨਾਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they sort food by labels. / ਪੈਨਲ 2 ਵਿੱਚ ਲੇਬਲ ਮੁਤਾਬਕ ਛਾਂਟਣਾ ਹੈ।"
      },
      {
        "question": "Who guides the child? / ਬੱਚੇ ਨੂੰ ਕੌਣ ਦੱਸਦਾ ਹੈ?",
        "choices": [
          "volunteer / ਵਲੰਟੀਅਰ",
          "pilot / ਪਾਇਲਟ",
          "chef / ਰਸੋਈਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 and 4 show a volunteer guiding the child. / ਪੈਨਲ 3 ਅਤੇ 4 ਵਿੱਚ ਵਲੰਟੀਅਰ ਦੱਸਦਾ ਹੈ।"
      },
      {
        "question": "What does the child learn at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹੈ?",
        "choices": [
          "small help matters / ਛੋਟੀ ਮਦਦ ਵੀ ਮਹੱਤਵਪੂਰਨ ਹੈ",
          "to be rude / ਬਦਤਮੀਜ਼ ਬਣਨਾ",
          "to break rules / ਨਿਯਮ ਤੋੜਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says small help can make a big difference. / ਪੈਨਲ 5 ਵਿੱਚ ਛੋਟੀ ਮਦਦ ਦਾ ਫਰਕ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "food drive",
        "meaningEn": "a time when people collect food to help others",
        "meaningPa": "ਫੂਡ ਡਰਾਈਵ; ਦੂਜਿਆਂ ਲਈ ਖਾਣਾ ਇਕੱਠਾ ਕਰਨਾ"
      },
      {
        "word": "donation",
        "meaningEn": "a gift you give to help",
        "meaningPa": "ਦਾਨ; ਮਦਦ ਲਈ ਦਿੱਤਾ ਤੋਹਫ਼ਾ"
      },
      {
        "word": "volunteer",
        "meaningEn": "a helper who works without pay",
        "meaningPa": "ਵਲੰਟੀਅਰ; ਬਿਨਾਂ ਪੈਸੇ ਮਦਦ ਕਰਨ ਵਾਲਾ"
      },
      {
        "word": "sort",
        "meaningEn": "put things into groups",
        "meaningPa": "ਛਾਂਟਣਾ; ਗਰੁੱਪਾਂ ਵਿੱਚ ਰੱਖਣਾ"
      },
      {
        "word": "label",
        "meaningEn": "a name tag on food",
        "meaningPa": "ਲੇਬਲ; ਚੀਜ਼ ਦਾ ਨਾਮ ਵਾਲਾ ਟੈਗ"
      },
      {
        "word": "bin",
        "meaningEn": "a box or container for items",
        "meaningPa": "ਡੱਬਾ; ਚੀਜ਼ਾਂ ਰੱਖਣ ਵਾਲਾ ਬਕਸਾ"
      },
      {
        "word": "direction",
        "meaningEn": "information about where to go",
        "meaningPa": "ਹਦਾਇਤ; ਕਿੱਥੇ ਜਾਣਾ ਹੈ ਦੱਸਣਾ"
      },
      {
        "word": "carefully",
        "meaningEn": "slowly and safely",
        "meaningPa": "ਧਿਆਨ ਨਾਲ; ਹੌਲੀ ਅਤੇ ਸੁਰੱਖਿਅਤ"
      },
      {
        "word": "difference",
        "meaningEn": "a change that matters",
        "meaningPa": "ਫਰਕ; ਮਹੱਤਵਪੂਰਨ ਬਦਲਾਵ"
      },
      {
        "word": "together",
        "meaningEn": "as a group",
        "meaningPa": "ਇਕੱਠੇ; ਸਮੂਹ ਵਜੋਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B5_S10",
    "bundleId": 5,
    "orderInBundle": 10,
    "titleEn": "Book 5 · Story 10: My Role Model Promise",
    "titlePa": "ਕਿਤਾਬ 5 · ਕਹਾਣੀ 10: ਮੇਰੇ ਰੋਲ ਮਾਡਲ ਦਾ ਵਾਅਦਾ",
    "englishStory": "Panel 1 (Intro): Last week my teacher helped me read a hard storybook. I felt nervous at first, but my teacher stayed patient.\nPanel 2 (Body): First, my teacher said, \"Sound it out slowly, and try again.\" Then I practice each word, and I improve little by little.\nPanel 3 (Body): Next, I tell my mom, \"My teacher is my role model.\" I want to work hard and help others, just like that.\nPanel 4 (Body): Later, I make a promise in my notebook with a star. I write, \"I will practice reading every day this week.\"\nPanel 5 (Conclusion): After that, I read one page to my little brother at bedtime. I feel proud because my role model inspires my best effort.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਪਿਛਲੇ ਹਫ਼ਤੇ ਮੇਰੇ ਟੀਚਰ ਨੇ ਮੈਨੂੰ ਮੁਸ਼ਕਲ ਕਹਾਣੀ ਵਾਲੀ ਕਿਤਾਬ ਪੜ੍ਹਨ ਵਿੱਚ ਮਦਦ ਕੀਤੀ। ਮੈਂ ਪਹਿਲਾਂ ਘਬਰਾਇਆ/ਘਬਰਾਈ ਸੀ, ਪਰ ਟੀਚਰ ਧੀਰਜ ਨਾਲ ਰਹੇ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਨੇ ਕਿਹਾ, \"ਹੌਲੀ-ਹੌਲੀ ਅੱਖਰ ਪੜ੍ਹੋ ਅਤੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।\" ਫਿਰ ਮੈਂ ਹਰ ਸ਼ਬਦ ਦਾ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਸੁਧਾਰ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਮੈਂ ਮਾਂ ਨੂੰ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰੇ ਟੀਚਰ ਮੇਰਾ ਰੋਲ ਮਾਡਲ ਹਨ।\" ਮੈਂ ਵੀ ਮਿਹਨਤ ਕਰਨਾ ਅਤੇ ਹੋਰਾਂ ਦੀ ਮਦਦ ਕਰਨੀ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮੈਂ ਕਾਪੀ ਵਿੱਚ ਤਾਰੇ ਨਾਲ ਇਕ ਵਾਅਦਾ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ। ਮੈਂ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ, \"ਇਸ ਹਫ਼ਤੇ ਮੈਂ ਹਰ ਰੋਜ਼ ਪੜ੍ਹਨ ਦਾ ਅਭਿਆਸ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਸੋਣ ਵੇਲੇ ਆਪਣੇ ਛੋਟੇ ਭਰਾ ਨੂੰ ਇਕ ਸਫ਼ਾ ਪੜ੍ਹ ਕੇ ਸੁਣਾਂਦਾ/ਸੁਣਾਂਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਰੋਲ ਮਾਡਲ ਮੈਨੂੰ ਮਿਹਨਤ ਲਈ ਪ੍ਰੇਰਨਾ ਦਿੰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who helps the child read? / ਬੱਚੇ ਨੂੰ ਪੜ੍ਹਨ ਵਿੱਚ ਕੌਣ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "teacher / ਟੀਚਰ",
          "driver / ਡਰਾਈਵਰ",
          "shopkeeper / ਦੁਕਾਨਦਾਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the teacher helps the child read. / ਪੈਨਲ 1 ਵਿੱਚ ਟੀਚਰ ਮਦਦ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "How does the child feel at first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "nervous / ਘਬਰਾਇਆ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child feels nervous at first. / ਪੈਨਲ 1 ਵਿੱਚ ਪਹਿਲਾਂ ਘਬਰਾਹਟ ਹੈ।"
      },
      {
        "question": "What does the child do to improve? / ਬੱਚਾ ਸੁਧਾਰ ਲਈ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "practices each word / ਹਰ ਸ਼ਬਦ ਦਾ ਅਭਿਆਸ",
          "hides the book / ਕਿਤਾਬ ਲੁਕਾਉਣਾ",
          "stops reading / ਪੜ੍ਹਨਾ ਛੱਡਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child practices each word to improve. / ਪੈਨਲ 2 ਵਿੱਚ ਅਭਿਆਸ ਨਾਲ ਸੁਧਾਰ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What promise does the child make? / ਬੱਚਾ ਕਿਹੜਾ ਵਾਅਦਾ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "practice reading daily / ਹਰ ਰੋਜ਼ ਪੜ੍ਹਨ ਦਾ ਅਭਿਆਸ",
          "never read / ਕਦੇ ਨਾ ਪੜ੍ਹਨਾ",
          "skip school / ਸਕੂਲ ਛੱਡਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the child will practice reading every day. / ਪੈਨਲ 4 ਵਿੱਚ ਹਰ ਰੋਜ਼ ਅਭਿਆਸ ਹੈ।"
      },
      {
        "question": "Who does the child read to at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸੁਣਾਂਦਾ/ਸੁਣਾਂਦੀ ਹੈ?",
        "choices": [
          "little brother / ਛੋਟਾ ਭਰਾ",
          "bus driver / ਬੱਸ ਡਰਾਈਵਰ",
          "doctor / ਡਾਕਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child reads to a little brother. / ਪੈਨਲ 5 ਵਿੱਚ ਛੋਟੇ ਭਰਾ ਨੂੰ ਪੜ੍ਹ ਕੇ ਸੁਣਾਂਦਾ/ਸੁਣਾਂਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "role model",
        "meaningEn": "someone you want to be like",
        "meaningPa": "ਰੋਲ ਮਾਡਲ; ਜਿਸ ਵਰਗਾ ਤੁਸੀਂ ਬਣਨਾ ਚਾਹੁੰਦੇ ਹੋ"
      },
      {
        "word": "promise",
        "meaningEn": "a strong plan you say you will do",
        "meaningPa": "ਵਾਅਦਾ; ਯਕੀਨ ਨਾਲ ਕਹਿਣਾ ਕਿ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ"
      },
      {
        "word": "patient",
        "meaningEn": "able to wait calmly and kindly",
        "meaningPa": "ਧੀਰਜ ਵਾਲਾ; ਸ਼ਾਂਤ ਅਤੇ ਦਿਆਲੂ ਰਹਿਣਾ"
      },
      {
        "word": "practice",
        "meaningEn": "do it again to improve",
        "meaningPa": "ਅਭਿਆਸ; ਵਧੀਆ ਬਣਨ ਲਈ ਦੁਹਰਾਉਣਾ"
      },
      {
        "word": "effort",
        "meaningEn": "trying hard",
        "meaningPa": "ਮਿਹਨਤ; ਪੂਰੀ ਕੋਸ਼ਿਸ਼"
      },
      {
        "word": "nervous",
        "meaningEn": "worried and shaky inside",
        "meaningPa": "ਘਬਰਾਇਆ; ਮਨ ਵਿੱਚ ਡਰ ਅਤੇ ਚਿੰਤਾ"
      },
      {
        "word": "improve",
        "meaningEn": "get better over time",
        "meaningPa": "ਸੁਧਾਰਨਾ; ਸਮੇਂ ਨਾਲ ਵਧੀਆ ਹੋਣਾ"
      },
      {
        "word": "inspire",
        "meaningEn": "make you want to do your best",
        "meaningPa": "ਪ੍ਰੇਰਨਾ ਦੇਣਾ; ਆਪਣਾ ਵਧੀਆ ਕਰਨ ਲਈ ਉਤਸ਼ਾਹ"
      },
      {
        "word": "notebook",
        "meaningEn": "a book where you write notes",
        "meaningPa": "ਕਾਪੀ; ਜਿਸ ਵਿੱਚ ਲਿਖਦੇ ਹਾਂ"
      },
      {
        "word": "last week",
        "meaningEn": "the week before this one",
        "meaningPa": "ਪਿਛਲਾ ਹਫ਼ਤਾ; ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲਾ ਹਫ਼ਤਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK6_CUSTOM_STORIES = [
  {
    "storyId": "B6_S01",
    "bundleId": 6,
    "orderInBundle": 1,
    "titleEn": "Book 6 · Story 1: Safe Street Crossing",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 1: ਸੁਰੱਖਿਅਤ ਸੜਕ ਪਾਰ ਕਰਨਾ",
    "englishStory": "Panel 1 (Intro): Today I walk with my dad to a busy street corner. We see traffic near the crosswalk, and I feel very careful.\nPanel 2 (Body): First, I stop at the curb and wait beside my dad. I look left, then right, because cars can move very fast.\nPanel 3 (Body): Next, the walk sign turns on, and Dad says we should go. We walk together in the crosswalk, so I stay safe.\nPanel 4 (Body): Then I keep looking left and right while we cross slowly. The traffic stays back, and we reach the other side calmly.\nPanel 5 (Conclusion): After that, I smile and say, \"That was safe because we wait.\" Dad nods and says good choices keep us safe every day.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਿਉ ਨਾਲ ਰੌਲੇ ਵਾਲੇ ਸੜਕ ਕੋਨੇ ਵੱਲ ਤੁਰਦਾ/ਤੁਰਦੀ ਹਾਂ। ਅਸੀਂ ਪੈਦਲ ਪਾਰ ਲਾਈਨਾਂ ਕੋਲ ਆਵਾਜਾਈ ਵੇਖਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਧਿਆਨ ਵਾਲਾ/ਧਿਆਨ ਵਾਲੀ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕਰਬ ਤੇ ਰੁਕਦਾ/ਰੁਕਦੀ ਹਾਂ ਅਤੇ ਪਿਉ ਦੇ ਕੋਲ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਖੱਬੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਫਿਰ ਸੱਜੇ, ਕਿਉਂਕਿ ਗੱਡੀਆਂ ਬਹੁਤ ਤੇਜ਼ ਚੱਲ ਸਕਦੀਆਂ ਹਨ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ, ਵਾਕ ਸਾਈਨ ਜਲਦਾ ਹੈ ਅਤੇ ਪਿਉ ਕਹਿੰਦਾ ਹੈ ਕਿ ਅਸੀਂ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ। ਅਸੀਂ ਪੈਦਲ ਪਾਰ ਲਾਈਨਾਂ ਵਿੱਚ ਇਕੱਠੇ ਤੁਰਦੇ ਹਾਂ, ਇਸ ਲਈ ਮੈਂ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਹੌਲੀ ਪਾਰ ਕਰਦੇ ਸਮੇਂ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ। ਆਵਾਜਾਈ ਪਿੱਛੇ ਰਹਿੰਦੀ ਹੈ, ਅਤੇ ਅਸੀਂ ਸ਼ਾਂਤ ਨਾਲ ਦੂਜੇ ਪਾਸੇ ਪਹੁੰਚ ਜਾਂਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਮੁਸਕੁਰਾ ਕੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਇਹ ਸੁਰੱਖਿਅਤ ਸੀ ਕਿਉਂਕਿ ਅਸੀਂ ਉਡੀਕ ਕੀਤੀ।\" ਪਿਉ ਸਿਰ ਹਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਕਹਿੰਦਾ ਹੈ ਚੰਗੀਆਂ ਚੋਣਾਂ ਸਾਨੂੰ ਹਰ ਰੋਜ਼ ਸੁਰੱਖਿਅਤ ਰੱਖਦੀਆਂ ਹਨ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they cross? / ਉਹ ਕਿੱਥੇ ਪਾਰ ਕਰਦੇ ਹਨ?",
        "choices": [
          "crosswalk / ਪੈਦਲ ਪਾਰ",
          "kitchen / ਰਸੋਈ",
          "library / ਲਾਇਬ੍ਰੇਰੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They cross at the crosswalk in the story. / ਕਹਾਣੀ ਵਿੱਚ ਉਹ ਪੈਦਲ ਪਾਰ ਲਾਈਨਾਂ ਤੋਂ ਪਾਰ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "What should the child do first? / ਬੱਚੇ ਨੂੰ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "stop and wait / ਰੁਕੋ ਤੇ ਉਡੀਕ ਕਰੋ",
          "run fast / ਤੇਜ਼ ਦੌੜੋ",
          "close eyes / ਅੱਖਾਂ ਬੰਦ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to stop and wait at the curb. / ਪੈਨਲ 2 ਵਿੱਚ ਕਰਬ ਤੇ ਰੁਕਣ ਅਤੇ ਉਡੀਕ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child do next? / ਬੱਚਾ ਅਗਲਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "look left and right / ਖੱਬੇ ਤੇ ਸੱਜੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ",
          "eat lunch / ਲੰਚ ਖਾਂਦਾ/ਖਾਂਦੀ ਹੈ",
          "take a nap / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child looks left and right. / ਪੈਨਲ 2 ਵਿੱਚ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਵੇਖਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the child look left and right? / ਬੱਚਾ ਖੱਬੇ ਤੇ ਸੱਜੇ ਕਿਉਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ?",
        "choices": [
          "because of traffic / ਆਵਾਜਾਈ ਕਰਕੇ",
          "because of music / ਗਾਣੇ ਕਰਕੇ",
          "because of snow / ਬਰਫ਼ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child looks because traffic can move fast. / ਬੱਚਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ ਕਿਉਂਕਿ ਆਵਾਜਾਈ ਤੇਜ਼ ਹੋ ਸਕਦੀ ਹੈ।"
      },
      {
        "question": "What keeps the child safe? / ਬੱਚੇ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕੀ ਰੱਖਦਾ ਹੈ?",
        "choices": [
          "wait and follow rules / ਉਡੀਕ ਤੇ ਨਿਯਮ",
          "shout loudly / ਉੱਚਾ ਚੀਕਣਾ",
          "push others / ਧੱਕਾ ਦੇਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They stay safe by waiting and crossing carefully. / ਉਹ ਉਡੀਕ ਕਰਕੇ ਅਤੇ ਧਿਆਨ ਨਾਲ ਪਾਰ ਕਰਕੇ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "crosswalk",
        "meaningEn": "painted lines where people cross a street",
        "meaningPa": "ਪੈਦਲ ਪਾਰ ਲਾਈਨਾਂ; ਸੜਕ ਪਾਰ ਕਰਨ ਵਾਲੀਆਂ ਲਾਈਨਾਂ"
      },
      {
        "word": "traffic",
        "meaningEn": "cars and buses moving on a road",
        "meaningPa": "ਆਵਾਜਾਈ; ਸੜਕ ਉੱਤੇ ਗੱਡੀਆਂ ਦੀ ਚਲਚਲਾਹਟ"
      },
      {
        "word": "look",
        "meaningEn": "use your eyes to see",
        "meaningPa": "ਵੇਖਣਾ; ਅੱਖਾਂ ਨਾਲ ਦੇਖਣਾ"
      },
      {
        "word": "left",
        "meaningEn": "the side opposite right",
        "meaningPa": "ਖੱਬਾ; ਸੱਜੇ ਦੇ ਉਲਟ ਪਾਸਾ"
      },
      {
        "word": "right",
        "meaningEn": "the side opposite left",
        "meaningPa": "ਸੱਜਾ; ਖੱਬੇ ਦੇ ਉਲਟ ਪਾਸਾ"
      },
      {
        "word": "stop",
        "meaningEn": "do not move",
        "meaningPa": "ਰੁਕਣਾ; ਹਿਲਣਾ ਨਹੀਂ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until it is time",
        "meaningPa": "ਉਡੀਕ ਕਰਨੀ; ਸਮਾਂ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "should",
        "meaningEn": "a word for a good choice",
        "meaningPa": "ਚਾਹੀਦਾ ਹੈ; ਚੰਗੀ ਚੋਣ ਲਈ ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S02",
    "bundleId": 6,
    "orderInBundle": 2,
    "titleEn": "Book 6 · Story 2: Packing My Backpack",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 2: ਮੇਰਾ ਬੈਕਪੈਕ ਤਿਆਰ ਕਰਨਾ",
    "englishStory": "Panel 1 (Intro): Tonight I pack my backpack for school with my mom. I want to be ready tomorrow, so I use a checklist.\nPanel 2 (Body): First, I put my homework folder inside the backpack carefully. Next, I add a pencil, then I zip the bag closed.\nPanel 3 (Body): Then I place my lunch box and a water bottle on top. I check my checklist again, and I feel calm and ready.\nPanel 4 (Body): Later, Mom says my homework is safe inside the folder now. I put the backpack by the door for tomorrow morning.\nPanel 5 (Conclusion): After that, I sleep early and wake up smiling. I grab my backpack and feel ready because my plan worked.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਰਾਤ ਮੈਂ ਮਾਂ ਨਾਲ ਸਕੂਲ ਲਈ ਬੈਕਪੈਕ ਤਿਆਰ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਭਲਕੇ ਲਈ ਤਿਆਰ ਹੋਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ, ਇਸ ਲਈ ਮੈਂ ਚੈਕਲਿਸਟ ਵਰਤਦਾ/ਵਰਤਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੋਮਵਰਕ ਫੋਲਡਰ ਧਿਆਨ ਨਾਲ ਬੈਕਪੈਕ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਪੈਂਸਿਲ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ ਅਤੇ ਬੈਗ ਦੀ ਜ਼ਿੱਪ ਲਾ ਦਿੰਦਾ/ਲਾ ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਲੰਚ ਬਾਕਸ ਅਤੇ ਪਾਣੀ ਦੀ ਬੋਤਲ ਉੱਤੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਮੈਂ ਚੈਕਲਿਸਟ ਫਿਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਮੈਂ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮਾਂ ਕਹਿੰਦੀ ਹੈ ਕਿ ਹੋਮਵਰਕ ਹੁਣ ਫੋਲਡਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੈ। ਮੈਂ ਭਲਕੇ ਸਵੇਰੇ ਲਈ ਬੈਕਪੈਕ ਦਰਵਾਜ਼ੇ ਕੋਲ ਰੱਖ ਦਿੰਦਾ/ਰੱਖ ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਜਲਦੀ ਸੋ ਜਾਂਦਾ/ਸੋ ਜਾਂਦੀ ਹਾਂ ਅਤੇ ਮੁਸਕੁਰਾ ਕੇ ਜਾਗਦਾ/ਜਾਗਦੀ ਹਾਂ। ਮੈਂ ਬੈਕਪੈਕ ਚੁੱਕਦਾ/ਚੁੱਕਦੀ ਹਾਂ ਅਤੇ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੇਰੀ ਯੋਜਨਾ ਚੱਲ ਪਈ।",
    "multipleChoiceQuestions": [
      {
        "question": "When does the child pack the backpack? / ਬੱਚਾ ਬੈਕਪੈਕ ਕਦੋਂ ਪੈਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "tonight / ਅੱਜ ਰਾਤ",
          "yesterday / ਕੱਲ੍ਹ",
          "next week / ਅਗਲਾ ਹਫ਼ਤਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child packs tonight. / ਪੈਨਲ 1 ਵਿੱਚ ਅੱਜ ਰਾਤ ਪੈਕ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What helps the child remember items? / ਚੀਜ਼ਾਂ ਯਾਦ ਰੱਖਣ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "checklist / ਚੈਕਲਿਸਟ",
          "pillow / ਤਕੀਆ",
          "ball / ਗੇਂਦ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child uses a checklist to remember items. / ਬੱਚਾ ਚੀਜ਼ਾਂ ਯਾਦ ਰੱਖਣ ਲਈ ਚੈਕਲਿਸਟ ਵਰਤਦਾ/ਵਰਤਦੀ ਹੈ।"
      },
      {
        "question": "What goes in first? / ਪਹਿਲਾਂ ਕੀ ਜਾਂਦਾ ਹੈ?",
        "choices": [
          "folder / ਫੋਲਡਰ",
          "lunch / ਲੰਚ",
          "water / ਪਾਣੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the folder goes in first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਫੋਲਡਰ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ।"
      },
      {
        "question": "What does the child pack next after the folder? / ਫੋਲਡਰ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਅਗਲਾ ਕੀ ਪੈਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "pencil / ਪੈਂਸਿਲ",
          "bed / ਬਿਸਤਰਾ",
          "television / ਟੀਵੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child adds a pencil next. / ਪੈਨਲ 2 ਵਿੱਚ ਅਗਲਾ ਪੈਂਸਿਲ ਪਾਉਂਦਾ/ਪਾਂਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child feel ready tomorrow? / ਬੱਚਾ ਭਲਕੇ ਤਿਆਰ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "because the plan worked / ਯੋਜਨਾ ਚੱਲੀ",
          "because of rain / ਮੀਂਹ ਕਰਕੇ",
          "because of noise / ਸ਼ੋਰ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels ready because the plan worked. / ਪੈਨਲ 5 ਵਿੱਚ ਯੋਜਨਾ ਚੱਲਣ ਕਰਕੇ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "backpack",
        "meaningEn": "a bag you carry on your back",
        "meaningPa": "ਬੈਕਪੈਕ; ਪਿੱਠ ਉੱਤੇ ਚੁੱਕਣ ਵਾਲਾ ਬੈਗ"
      },
      {
        "word": "checklist",
        "meaningEn": "a list to help you remember things",
        "meaningPa": "ਚੈਕਲਿਸਟ; ਯਾਦ ਰੱਖਣ ਲਈ ਸੂਚੀ"
      },
      {
        "word": "homework",
        "meaningEn": "school work you do at home",
        "meaningPa": "ਹੋਮਵਰਕ; ਘਰ ਲਈ ਸਕੂਲ ਦਾ ਕੰਮ"
      },
      {
        "word": "folder",
        "meaningEn": "a cover to hold papers",
        "meaningPa": "ਫੋਲਡਰ; ਕਾਗਜ਼ ਰੱਖਣ ਵਾਲਾ ਕਵਰ"
      },
      {
        "word": "pencil",
        "meaningEn": "a tool for writing",
        "meaningPa": "ਪੈਂਸਿਲ; ਲਿਖਣ ਵਾਲੀ ਚੀਜ਼"
      },
      {
        "word": "lunch",
        "meaningEn": "food you eat in the middle of the day",
        "meaningPa": "ਲੰਚ; ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ"
      },
      {
        "word": "water",
        "meaningEn": "a drink your body needs",
        "meaningPa": "ਪਾਣੀ; ਸਰੀਰ ਲਈ ਜ਼ਰੂਰੀ ਪੀਣ ਵਾਲੀ ਚੀਜ਼"
      },
      {
        "word": "tomorrow",
        "meaningEn": "the day after today",
        "meaningPa": "ਭਲਕੇ; ਅੱਜ ਤੋਂ ਅਗਲਾ ਦਿਨ"
      },
      {
        "word": "first",
        "meaningEn": "before everything else",
        "meaningPa": "ਪਹਿਲਾਂ; ਸਭ ਤੋਂ ਪਹਿਲਾਂ"
      },
      {
        "word": "ready",
        "meaningEn": "prepared to start",
        "meaningPa": "ਤਿਆਰ; ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "pack",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "be",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S03",
    "bundleId": 6,
    "orderInBundle": 3,
    "titleEn": "Book 6 · Story 3: My Bus Ride Plan",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 3: ਮੇਰੀ ਬੱਸ ਯਾਤਰਾ ਦੀ ਯੋਜਨਾ",
    "englishStory": "Panel 1 (Intro): Today I ride the bus with my aunt, my trusted adult. We stand at the bus stop, and I feel excited and calm.\nPanel 2 (Body): First, we make a line and hold hands near the curb. My adult says I must stay close, so I stay safe.\nPanel 3 (Body): Next, the bus arrives, and we show our ticket to the driver. We find a seat, and I sit quiet and still.\nPanel 4 (Body): Then I hold the pole when we stand, because the bus moves. I use a quiet voice, and my adult watches me carefully.\nPanel 5 (Conclusion): After that, we get off at our stop and thank the driver. I feel safe because I follow the rules on the bus.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਆਪਣੀ ਆਂਟੀ ਨਾਲ ਬੱਸ ਵਿੱਚ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ, ਅਤੇ ਉਹ ਮੇਰਾ ਭਰੋਸੇਮੰਦ ਵੱਡਾ ਹੈ। ਅਸੀਂ ਬੱਸ ਸਟਾਪ ਤੇ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਉਤਸਾਹੀ ਅਤੇ ਸ਼ਾਂਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਕਤਾਰ ਬਣਾਂਦੇ ਹਾਂ ਅਤੇ ਕਰਬ ਕੋਲ ਹੱਥ ਫੜਦੇ ਹਾਂ। ਮੇਰਾ ਵੱਡਾ ਕਹਿੰਦਾ ਹੈ ਕਿ ਮੈਨੂੰ ਨੇੜੇ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਬੱਸ ਆਉਂਦੀ ਹੈ ਅਤੇ ਅਸੀਂ ਡਰਾਈਵਰ ਨੂੰ ਟਿਕਟ ਦਿਖਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਸੀਟ ਲੱਭਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਚੁੱਪ ਤੇ ਥਿਰ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਜਦੋਂ ਅਸੀਂ ਖੜ੍ਹੇ ਹੁੰਦੇ ਹਾਂ, ਮੈਂ ਪੋਲ ਫੜਦਾ/ਫੜਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਬੱਸ ਹਿੱਲਦੀ ਹੈ। ਮੈਂ ਹੌਲੀ ਆਵਾਜ਼ ਵਰਤਦਾ/ਵਰਤਦੀ ਹਾਂ, ਅਤੇ ਮੇਰਾ ਵੱਡਾ ਧਿਆਨ ਨਾਲ ਮੈਨੂੰ ਵੇਖਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਆਪਣੇ ਸਟਾਪ ਤੇ ਉਤਰਦੇ ਹਾਂ ਅਤੇ ਡਰਾਈਵਰ ਨੂੰ ਧੰਨਵਾਦ ਕਰਦੇ ਹਾਂ। ਮੈਂ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਬੱਸ ਦੇ ਨਿਯਮ ਮੰਨਦਾ/ਮੰਨਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who rides with the child? / ਬੱਚੇ ਨਾਲ ਕੌਣ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "adult / ਵੱਡਾ",
          "baby / ਬੱਚਾ",
          "dog / ਕੁੱਤਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child rides with a trusted adult. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਭਰੋਸੇਮੰਦ ਵੱਡੇ ਨਾਲ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "Where do they wait for the bus? / ਉਹ ਬੱਸ ਲਈ ਕਿੱਥੇ ਉਡੀਕ ਕਰਦੇ ਹਨ?",
        "choices": [
          "stop / ਸਟਾਪ",
          "roof / ਛੱਤ",
          "river / ਦਰਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they wait at the bus stop. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਸ ਸਟਾਪ ਤੇ ਉਡੀਕ ਹੈ।"
      },
      {
        "question": "What must the child do? / ਬੱਚੇ ਨੂੰ ਕੀ ਲਾਜ਼ਮੀ ਕਰਨਾ ਹੈ?",
        "choices": [
          "stay close / ਨੇੜੇ ਰਹਿਣਾ",
          "run away / ਭੱਜ ਜਾਣਾ",
          "shout loud / ਉੱਚਾ ਚੀਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child must stay close to the adult. / ਪੈਨਲ 2 ਵਿੱਚ ਵੱਡੇ ਦੇ ਨੇੜੇ ਰਹਿਣਾ ਲਾਜ਼ਮੀ ਹੈ।"
      },
      {
        "question": "What happens next after the bus arrives? / ਬੱਸ ਆਉਣ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "show ticket / ਟਿਕਟ ਦਿਖਾਉਣਾ",
          "eat dinner / ਰਾਤ ਦਾ ਖਾਣਾ",
          "go to sleep / ਸੌਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they show the ticket to the driver. / ਪੈਨਲ 3 ਵਿੱਚ ਡਰਾਈਵਰ ਨੂੰ ਟਿਕਟ ਦਿਖਾਉਂਦੇ ਹਨ।"
      },
      {
        "question": "Why does the child hold the pole? / ਬੱਚਾ ਪੋਲ ਕਿਉਂ ਫੜਦਾ/ਫੜਦੀ ਹੈ?",
        "choices": [
          "because the bus moves / ਬੱਸ ਹਿੱਲਦੀ ਹੈ",
          "because of candy / ਕੈਂਡੀ ਕਰਕੇ",
          "because of snow / ਬਰਫ਼ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the bus moves, so holding helps. / ਪੈਨਲ 4 ਵਿੱਚ ਬੱਸ ਹਿੱਲਦੀ ਹੈ, ਇਸ ਲਈ ਫੜਨਾ ਮਦਦ ਕਰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bus",
        "meaningEn": "a big vehicle that carries many people",
        "meaningPa": "ਬੱਸ; ਬਹੁਤ ਲੋਕਾਂ ਨੂੰ ਲਿਜਾਣ ਵਾਲੀ ਗੱਡੀ"
      },
      {
        "word": "stop",
        "meaningEn": "a place where the bus comes and goes",
        "meaningPa": "ਸਟਾਪ; ਬੱਸ ਰੁਕਣ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "line",
        "meaningEn": "people waiting in order",
        "meaningPa": "ਕਤਾਰ; ਵਾਰੀ ਨਾਲ ਖੜ੍ਹੇ ਲੋਕ"
      },
      {
        "word": "ticket",
        "meaningEn": "a paper or card for a ride",
        "meaningPa": "ਟਿਕਟ; ਸਫ਼ਰ ਲਈ ਕਾਗਜ਼/ਕਾਰਡ"
      },
      {
        "word": "seat",
        "meaningEn": "a place to sit",
        "meaningPa": "ਸੀਟ; ਬੈਠਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "quiet",
        "meaningEn": "not loud",
        "meaningPa": "ਹੌਲਾ/ਚੁੱਪ; ਉੱਚਾ ਨਹੀਂ"
      },
      {
        "word": "adult",
        "meaningEn": "a grown-up person",
        "meaningPa": "ਵੱਡਾ; ਬਾਲਗ ਵਿਅਕਤੀ"
      },
      {
        "word": "hold",
        "meaningEn": "keep in your hand",
        "meaningPa": "ਫੜਨਾ; ਹੱਥ ਵਿੱਚ ਰੱਖਣਾ"
      },
      {
        "word": "must",
        "meaningEn": "a word for something you have to do",
        "meaningPa": "ਲਾਜ਼ਮੀ; ਕਰਨਾ ਹੀ ਪੈਂਦਾ ਹੈ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S04",
    "bundleId": 6,
    "orderInBundle": 4,
    "titleEn": "Book 6 · Story 4: Helmet Rules",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 4: ਹੈਲਮੈਟ ਦੇ ਨਿਯਮ",
    "englishStory": "Panel 1 (Intro): Today I ride my bike in the park with my cousin. Before we start, I wear my helmet to protect my head.\nPanel 2 (Body): First, I check the straps and buckle them under my chin. My cousin says we should be careful, because bikes go fast.\nPanel 3 (Body): Next, I see a small rock, and my wheel slips on it. I almost fall, but I feel safer with my helmet.\nPanel 4 (Body): Then I stop, take a breath, and fix my balance. I ride slower around turns, so I stay careful.\nPanel 5 (Conclusion): After that, I tap my helmet and smile at my cousin. I feel safer because I wear my helmet on every bike ride.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਜ਼ਨ ਨਾਲ ਪਾਰਕ ਵਿੱਚ ਸਾਈਕਲ ਚਲਾਂਦਾ/ਚਲਾਂਦੀ ਹਾਂ। ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਸਿਰ ਲਈ ਹੈਲਮੈਟ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ ਤਾਂ ਜੋ ਸੁਰੱਖਿਅਤ ਰਹੇ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਸਟ੍ਰੈਪਸ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਬਕਲ ਠੋਡੀ ਹੇਠਾਂ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ। ਕਜ਼ਨ ਕਹਿੰਦਾ ਹੈ ਕਿ ਅਸੀਂ ਧਿਆਨ ਨਾਲ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਸਾਈਕਲ ਤੇਜ਼ ਹੋ ਸਕਦੀ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਛੋਟਾ ਪੱਥਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਪਹੀਆ ਉਸ ਉੱਤੇ ਖਿਸਕ ਜਾਂਦਾ ਹੈ। ਮੈਂ ਲਗਭਗ ਡਿੱਗ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ, ਪਰ ਹੈਲਮੈਟ ਨਾਲ ਮੈਂ ਹੋਰ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਰੁਕਦਾ/ਰੁਕਦੀ ਹਾਂ, ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ, ਅਤੇ ਸੰਤੁਲਨ ਠੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਮੋੜਾਂ ਕੋਲ ਹੋਰ ਹੌਲੀ ਚਲਾਂਦਾ/ਚਲਾਂਦੀ ਹਾਂ, ਇਸ ਲਈ ਮੈਂ ਧਿਆਨ ਨਾਲ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਹੈਲਮੈਟ ਨੂੰ ਛੂਹ ਕੇ ਕਜ਼ਨ ਵੱਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ। ਮੈਂ ਹੋਰ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਹਰ ਵਾਰੀ ਸਾਈਕਲ ਤੇ ਹੈਲਮੈਟ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child wear? / ਬੱਚਾ ਕੀ ਪਾਂਦਾ/ਪਾਂਦੀ ਹੈ?",
        "choices": [
          "helmet / ਹੈਲਮੈਟ",
          "gloves / ਦਸਤਾਨੇ",
          "scarf / ਮਫ਼ਲਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wears a helmet. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਹੈਲਮੈਟ ਪਾਂਦਾ/ਪਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What should the child be? / ਬੱਚੇ ਨੂੰ ਕੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "careful / ਧਿਆਨ ਵਾਲਾ",
          "rude / ਬਦਤਮੀਜ਼",
          "noisy / ਸ਼ੋਰ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says we should be careful. / ਪੈਨਲ 2 ਵਿੱਚ ਧਿਆਨ ਨਾਲ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।"
      },
      {
        "question": "What happens next when the wheel slips? / ਪਹੀਆ ਖਿਸਕਣ ਤੇ ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "almost fall / ਲਗਭਗ ਡਿੱਗਣਾ",
          "eat lunch / ਲੰਚ ਖਾਣਾ",
          "read book / ਕਿਤਾਬ ਪੜ੍ਹਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child almost falls. / ਪੈਨਲ 3 ਵਿੱਚ ਲਗਭਗ ਡਿੱਗਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the child feel safer? / ਬੱਚਾ ਹੋਰ ਸੁਰੱਖਿਅਤ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "because of the helmet / ਹੈਲਮੈਟ ਕਰਕੇ",
          "because of candy / ਕੈਂਡੀ ਕਰਕੇ",
          "because of rain / ਮੀਂਹ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The helmet helps protect the head, so the child feels safer. / ਹੈਲਮੈਟ ਸਿਰ ਦੀ ਰੱਖਿਆ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਬੱਚਾ ਹੋਰ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do after the slip? / ਖਿਸਕਣ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "stop and ride slower / ਰੁਕ ਕੇ ਹੌਲੀ ਚਲਾਉਂਦਾ/ਚਲਾਉਂਦੀ ਹੈ",
          "run away / ਭੱਜ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ",
          "throw helmet / ਹੈਲਮੈਟ ਸੁੱਟਦਾ/ਸੁੱਟਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the child stops, fixes balance, and rides slower. / ਪੈਨਲ 4 ਵਿੱਚ ਰੁਕ ਕੇ ਸੰਤੁਲਨ ਠੀਕ ਕਰਕੇ ਹੌਲੀ ਚਲਾਉਂਦਾ/ਚਲਾਉਂਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "helmet",
        "meaningEn": "a hard hat that protects your head",
        "meaningPa": "ਹੈਲਮੈਟ; ਸਿਰ ਬਚਾਉਣ ਵਾਲੀ ਸਖ਼ਤ ਟੋਪੀ"
      },
      {
        "word": "bike",
        "meaningEn": "a bicycle you ride",
        "meaningPa": "ਸਾਈਕਲ; ਦੋ ਪਹੀਿਆਂ ਵਾਲੀ ਗੱਡੀ"
      },
      {
        "word": "head",
        "meaningEn": "the top part of your body",
        "meaningPa": "ਸਿਰ; ਸਰੀਰ ਦਾ ਉੱਪਰਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "fall",
        "meaningEn": "drop down to the ground",
        "meaningPa": "ਡਿੱਗਣਾ; ਜ਼ਮੀਨ ਤੇ ਡਿੱਗ ਪੈਣਾ"
      },
      {
        "word": "safer",
        "meaningEn": "more safe than before",
        "meaningPa": "ਹੋਰ ਸੁਰੱਖਿਅਤ; ਪਹਿਲਾਂ ਨਾਲੋਂ ਵਧੇਰੇ ਸੁਰੱਖਿਅਤ"
      },
      {
        "word": "should",
        "meaningEn": "a word for a good choice",
        "meaningPa": "ਚਾਹੀਦਾ ਹੈ; ਚੰਗੀ ਚੋਣ ਲਈ ਸ਼ਬਦ"
      },
      {
        "word": "straps",
        "meaningEn": "bands that hold the helmet on",
        "meaningPa": "ਸਟ੍ਰੈਪਸ; ਹੈਲਮੈਟ ਫੜਨ ਵਾਲੀਆਂ ਪੱਟੀਆਂ"
      },
      {
        "word": "buckle",
        "meaningEn": "a clip that closes a strap",
        "meaningPa": "ਬਕਲ; ਪੱਟੀ ਬੰਦ ਕਰਨ ਵਾਲੀ ਕਲਿੱਪ"
      },
      {
        "word": "careful",
        "meaningEn": "paying attention to stay safe",
        "meaningPa": "ਧਿਆਨ ਵਾਲਾ; ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਲਈ ਧਿਆਨ"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "be",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "turns",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S05",
    "bundleId": 6,
    "orderInBundle": 5,
    "titleEn": "Book 6 · Story 5: Sink or Float",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 5: ਡੁੱਬਦਾ ਜਾਂ ਤਰਦਾ",
    "englishStory": "Panel 1 (Intro): Today we do a science test at school with our teacher. We fill a bowl with water, and I feel very curious.\nPanel 2 (Body): First, I predict the heavy rock will sink in water. Next, I predict the light leaf will float on top.\nPanel 3 (Body): Then we drop the rock, and we watch it sink right away. We drop the leaf, and we watch it float, because it is light.\nPanel 4 (Body): Later, we write the results in our notebooks with neat letters. The teacher says, \"Good scientists test and explain, because reasons matter.\"\nPanel 5 (Conclusion): After that, I share my results with a friend at lunch. I feel proud because my predict ideas matched our test today.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਸਕੂਲ ਵਿੱਚ ਟੀਚਰ ਨਾਲ ਸਾਇੰਸ ਟੈਸਟ ਕਰਦੇ ਹਾਂ। ਅਸੀਂ ਕਟੋਰੀ ਵਿੱਚ ਪਾਣੀ ਭਰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਬਹੁਤ ਜਿਗਿਆਸੂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਭਾਰੀ ਪੱਥਰ ਪਾਣੀ ਵਿੱਚ ਡੁੱਬੇਗਾ। ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਹਲਕਾ ਪੱਤਾ ਉੱਪਰ ਤਰੇਗਾ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਪੱਥਰ ਛੱਡਦੇ ਹਾਂ, ਅਤੇ ਅਸੀਂ ਉਸਨੂੰ ਤੁਰੰਤ ਡੁੱਬਦਾ ਵੇਖਦੇ ਹਾਂ। ਅਸੀਂ ਪੱਤਾ ਛੱਡਦੇ ਹਾਂ, ਅਤੇ ਅਸੀਂ ਉਸਨੂੰ ਤਰਦਾ ਵੇਖਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਉਹ ਹਲਕਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਅਸੀਂ ਨਤੀਜੇ ਕਾਪੀ ਵਿੱਚ ਸਾਫ਼ ਅੱਖਰਾਂ ਨਾਲ ਲਿਖਦੇ ਹਾਂ। ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਚੰਗੇ ਵਿਗਿਆਨੀ ਟੈਸਟ ਕਰਦੇ ਹਨ ਅਤੇ ਕਿਉਂਕਿ ਨਾਲ ਕਾਰਨ ਵੀ ਦੱਸਦੇ ਹਨ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਲੰਚ ਵੇਲੇ ਦੋਸਤ ਨੂੰ ਆਪਣੇ ਨਤੀਜੇ ਦੱਸਦਾ/ਦੱਸਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਅੱਜ ਦੇ ਟੈਸਟ ਨਾਲ ਮਿਲ ਗਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What do they do today? / ਉਹ ਅੱਜ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "test / ਟੈਸਟ",
          "dance / ਨੱਚਣਾ",
          "sleep / ਸੌਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they do a science test. / ਪੈਨਲ 1 ਵਿੱਚ ਸਾਇੰਸ ਟੈਸਟ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What is in the bowl? / ਕਟੋਰੀ ਵਿੱਚ ਕੀ ਹੈ?",
        "choices": [
          "water / ਪਾਣੀ",
          "sand / ਰੇਤ",
          "milk / ਦੁੱਧ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the bowl is filled with water. / ਪੈਨਲ 1 ਵਿੱਚ ਕਟੋਰੀ ਵਿੱਚ ਪਾਣੀ ਹੈ।"
      },
      {
        "question": "What does the rock do? / ਪੱਥਰ ਕੀ ਕਰਦਾ ਹੈ?",
        "choices": [
          "sink / ਡੁੱਬਣਾ",
          "float / ਤਰਨਾ",
          "fly / ਉੱਡਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the rock sinks right away. / ਪੈਨਲ 3 ਵਿੱਚ ਪੱਥਰ ਤੁਰੰਤ ਡੁੱਬਦਾ ਹੈ।"
      },
      {
        "question": "Why does the leaf float? / ਪੱਤਾ ਕਿਉਂ ਤਰਦਾ ਹੈ?",
        "choices": [
          "because it is light / ਕਿਉਂਕਿ ਉਹ ਹਲਕਾ ਹੈ",
          "because it is heavy / ਕਿਉਂਕਿ ਉਹ ਭਾਰੀ ਹੈ",
          "because it is hot / ਕਿਉਂਕਿ ਉਹ ਗਰਮ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the leaf floats because it is light. / ਪੈਨਲ 3 ਵਿੱਚ ਪੱਤਾ ਹਲਕਾ ਹੋਣ ਕਰਕੇ ਤਰਦਾ ਹੈ।"
      },
      {
        "question": "What do they write next? / ਉਹ ਅਗਲਾ ਕੀ ਲਿਖਦੇ ਹਨ?",
        "choices": [
          "results / ਨਤੀਜੇ",
          "songs / ਗਾਣੇ",
          "rules / ਨਿਯਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they write the results in notebooks. / ਪੈਨਲ 4 ਵਿੱਚ ਨਤੀਜੇ ਕਾਪੀ ਵਿੱਚ ਲਿਖਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "sink",
        "meaningEn": "go down in water",
        "meaningPa": "ਡੁੱਬਣਾ; ਪਾਣੀ ਵਿੱਚ ਹੇਠਾਂ ਜਾਣਾ"
      },
      {
        "word": "float",
        "meaningEn": "stay on top of water",
        "meaningPa": "ਤਰਨਾ; ਪਾਣੀ ਦੇ ਉੱਪਰ ਰਹਿਣਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen before",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਹੀ ਕਹਿਣਾ"
      },
      {
        "word": "heavy",
        "meaningEn": "not light; weighs a lot",
        "meaningPa": "ਭਾਰੀ; ਵਜ਼ਨ ਜ਼ਿਆਦਾ"
      },
      {
        "word": "light",
        "meaningEn": "not heavy; weighs little",
        "meaningPa": "ਹਲਕਾ; ਵਜ਼ਨ ਘੱਟ"
      },
      {
        "word": "water",
        "meaningEn": "a clear liquid to drink and wash",
        "meaningPa": "ਪਾਣੀ; ਸਾਫ਼ ਤਰਲ"
      },
      {
        "word": "bowl",
        "meaningEn": "a round dish that can hold water",
        "meaningPa": "ਕਟੋਰੀ; ਗੋਲ ਬਰਤਨ"
      },
      {
        "word": "test",
        "meaningEn": "a try to see what happens",
        "meaningPa": "ਟੈਸਟ; ਜਾਂਚ ਲਈ ਕੋਸ਼ਿਸ਼"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "results",
        "meaningEn": "what you find out at the end",
        "meaningPa": "ਨਤੀਜੇ; ਅੰਤ ਵਿੱਚ ਮਿਲੀ ਜਾਣਕਾਰੀ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S06",
    "bundleId": 6,
    "orderInBundle": 6,
    "titleEn": "Book 6 · Story 6: Recycling Day",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 6: ਰੀਸਾਇਕਲਿੰਗ ਦਿਵਸ",
    "englishStory": "Panel 1 (Intro): Today our class will recycle after snack time in school. We want a clean earth, so we know we can help.\nPanel 2 (Body): First, we sort paper and plastic into two big piles. Next, we read each label and choose the right bin.\nPanel 3 (Body): Then I rinse a bottle, and it becomes clean again. I put it in the plastic bin, and I smile proudly.\nPanel 4 (Body): Later, my teacher says, \"We can recycle every day at home too.\" I carry the paper pile to the bin and feel strong.\nPanel 5 (Conclusion): After that, our room looks clean and ready for learning. I say, \"I can recycle because I care for earth.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੇ ਸਕੂਲ ਵਿੱਚ ਨਾਸ਼ਤੇ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਰੀਸਾਇਕਲ ਕਰਾਂਗੇ। ਅਸੀਂ ਸਾਫ਼ ਧਰਤੀ ਚਾਹੁੰਦੇ ਹਾਂ, ਇਸ ਲਈ ਅਸੀਂ ਜਾਣਦੇ ਹਾਂ ਕਿ ਅਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਕਾਗਜ਼ ਅਤੇ ਪਲਾਸਟਿਕ ਨੂੰ ਦੋ ਵੱਡੇ ਢੇਰਾਂ ਵਿੱਚ ਛਾਂਟਦੇ ਹਾਂ। ਫਿਰ ਅਸੀਂ ਹਰ ਲੇਬਲ ਪੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਸਹੀ ਡੱਬਾ ਚੁਣਦੇ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਬੋਤਲ ਨੂੰ ਪਾਣੀ ਨਾਲ ਛੇਤੀ ਧੋਦਾ/ਧੋਦੀ ਹਾਂ, ਅਤੇ ਉਹ ਮੁੜ ਸਾਫ਼ ਹੋ ਜਾਂਦੀ ਹੈ। ਮੈਂ ਉਸਨੂੰ ਪਲਾਸਟਿਕ ਡੱਬੇ ਵਿੱਚ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ, ਅਤੇ ਮੈਂ ਮਾਣ ਨਾਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਅਸੀਂ ਘਰ ਵਿੱਚ ਵੀ ਹਰ ਰੋਜ਼ ਰੀਸਾਇਕਲ ਕਰ ਸਕਦੇ ਹਾਂ।\" ਮੈਂ ਕਾਗਜ਼ ਦਾ ਢੇਰ ਡੱਬੇ ਤੱਕ ਲੈ ਜਾਂਦਾ/ਲੈ ਜਾਂਦੀ ਹਾਂ ਅਤੇ ਮਜ਼ਬੂਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਕਲਾਸ ਸਾਫ਼ ਲੱਗਦੀ ਹੈ ਅਤੇ ਪੜ੍ਹਾਈ ਲਈ ਤਿਆਰ ਹੁੰਦੀ ਹੈ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਧਰਤੀ ਦੀ ਪਰਵਾਹ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਇਸ ਲਈ ਮੈਂ ਰੀਸਾਇਕਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "What does the class do today? / ਕਲਾਸ ਅੱਜ ਕੀ ਕਰਦੀ ਹੈ?",
        "choices": [
          "recycle / ਰੀਸਾਇਕਲ",
          "paint walls / ਕੰਧਾਂ ਰੰਗਣਾ",
          "sleep all day / ਸਾਰਾ ਦਿਨ ਸੌਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the class will recycle today. / ਪੈਨਲ 1 ਵਿੱਚ ਅੱਜ ਰੀਸਾਇਕਲ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they sort first? / ਉਹ ਪਹਿਲਾਂ ਕੀ ਛਾਂਟਦੇ ਹਨ?",
        "choices": [
          "paper and plastic / ਕਾਗਜ਼ ਤੇ ਪਲਾਸਟਿਕ",
          "cars and buses / ਗੱਡੀਆਂ ਤੇ ਬੱਸਾਂ",
          "shoes and hats / ਜੁੱਤੇ ਤੇ ਟੋਪੀਆਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they sort paper and plastic. / ਪੈਨਲ 2 ਵਿੱਚ ਕਾਗਜ਼ ਅਤੇ ਪਲਾਸਟਿਕ ਛਾਂਟਦੇ ਹਨ।"
      },
      {
        "question": "What helps them choose the bin? / ਡੱਬਾ ਚੁਣਨ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "label / ਲੇਬਲ",
          "song / ਗਾਣਾ",
          "cloud / ਬੱਦਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they read each label to choose the bin. / ਪੈਨਲ 2 ਵਿੱਚ ਲੇਬਲ ਪੜ੍ਹ ਕੇ ਡੱਬਾ ਚੁਣਦੇ ਹਨ।"
      },
      {
        "question": "What does the child do next with the bottle? / ਬੋਤਲ ਨਾਲ ਬੱਚਾ ਅਗਲਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "rinse / ਛੇਤੀ ਧੋਣਾ",
          "break / ਤੋੜਦਾ/ਤੋੜਦੀ ਹੈ",
          "hide / ਲੁਕਾਉਂਦਾ/ਲੁਕਾਉਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child rinses the bottle to make it clean. / ਪੈਨਲ 3 ਵਿੱਚ ਬੱਚਾ ਬੋਤਲ ਨੂੰ ਛੇਤੀ ਧੋ ਕੇ ਸਾਫ਼ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "Why do they recycle? / ਉਹ ਰੀਸਾਇਕਲ ਕਿਉਂ ਕਰਦੇ ਹਨ?",
        "choices": [
          "because they care for earth / ਧਰਤੀ ਦੀ ਪਰਵਾਹ ਕਰਕੇ",
          "because of noise / ਸ਼ੋਰ ਕਰਕੇ",
          "because of candy / ਕੈਂਡੀ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story says they care for earth, so they recycle. / ਕਹਾਣੀ ਵਿੱਚ ਧਰਤੀ ਦੀ ਪਰਵਾਹ ਕਰਕੇ ਰੀਸਾਇਕਲ ਕਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "recycle",
        "meaningEn": "use old items again in a new way",
        "meaningPa": "ਰੀਸਾਇਕਲ; ਪੁਰਾਣੀ ਚੀਜ਼ ਨੂੰ ਮੁੜ ਵਰਤਣਾ"
      },
      {
        "word": "paper",
        "meaningEn": "thin sheets used for writing",
        "meaningPa": "ਕਾਗਜ਼; ਲਿਖਣ ਵਾਲੇ ਪੱਤੇ"
      },
      {
        "word": "plastic",
        "meaningEn": "a light material used for bottles and bags",
        "meaningPa": "ਪਲਾਸਟਿਕ; ਬੋਤਲਾਂ ਅਤੇ ਬੈਗਾਂ ਵਾਲਾ ਸਮਾਨ"
      },
      {
        "word": "bin",
        "meaningEn": "a container for trash or recycling",
        "meaningPa": "ਡੱਬਾ; ਕੂੜਾ ਜਾਂ ਰੀਸਾਇਕਲ ਲਈ ਬਕਸਾ"
      },
      {
        "word": "label",
        "meaningEn": "words on an item that tell what it is",
        "meaningPa": "ਲੇਬਲ; ਚੀਜ਼ ਉੱਤੇ ਲਿਖੇ ਸ਼ਬਦ"
      },
      {
        "word": "rinse",
        "meaningEn": "wash quickly with water",
        "meaningPa": "ਛੇਤੀ ਧੋਣਾ; ਪਾਣੀ ਨਾਲ ਛੇਤੀ ਧੋਣਾ"
      },
      {
        "word": "sort",
        "meaningEn": "put things into groups",
        "meaningPa": "ਛਾਂਟਣਾ; ਚੀਜ਼ਾਂ ਨੂੰ ਗਰੁੱਪਾਂ ਵਿੱਚ ਰੱਖਣਾ"
      },
      {
        "word": "clean",
        "meaningEn": "not dirty",
        "meaningPa": "ਸਾਫ਼; ਗੰਦਾ ਨਹੀਂ"
      },
      {
        "word": "earth",
        "meaningEn": "our planet where we live",
        "meaningPa": "ਧਰਤੀ; ਸਾਡਾ ਗ੍ਰਹਿ"
      },
      {
        "word": "can",
        "meaningEn": "a word that means you are able to",
        "meaningPa": "ਕਰ ਸਕਦਾ/ਸਕਦੀ; ਸਮਰਥ ਹੋਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "recycle",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S07",
    "bundleId": 6,
    "orderInBundle": 7,
    "titleEn": "Book 6 · Story 7: I Am a Reading Helper",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 7: ਮੈਂ ਪੜ੍ਹਨ ਵਿੱਚ ਮਦਦਗਾਰ ਹਾਂ",
    "englishStory": "Panel 1 (Intro): Today I am a helper in class during reading time. I sit with a younger student who wants to read.\nPanel 2 (Body): First, I whisper, \"Sound the first letter and look at the word.\" I stay patient and smile, so my younger friend feels calm.\nPanel 3 (Body): Next, my friend wants to try, but the word feels tricky. I whisper praise and say, \"Try again, and you can read.\"\nPanel 4 (Body): Then my friend can read the word, and I smile right away. We read one more page together, and my friend feels proud.\nPanel 5 (Conclusion): After that, the younger student says, \"Thank you, helper.\" I feel proud because patient praise helps kids try again.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਪੜ੍ਹਨ ਵੇਲੇ ਮਦਦਗਾਰ ਬਣਦਾ/ਬਣਦੀ ਹਾਂ। ਮੈਂ ਇਕ ਛੋਟੇ ਵਿਦਿਆਰਥੀ ਨਾਲ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ ਜੋ ਪੜ੍ਹਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੌਲੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਪਹਿਲੇ ਅੱਖਰ ਦੀ ਧੁਨੀ ਕੱਢੋ ਅਤੇ ਸ਼ਬਦ ਵੇਖੋ।\" ਮੈਂ ਧੀਰਜ ਨਾਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ, ਇਸ ਲਈ ਛੋਟਾ ਦੋਸਤ ਸ਼ਾਂਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਦੋਸਤ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ/ਕਰਦੀ ਹੈ, ਪਰ ਸ਼ਬਦ ਔਖਾ ਲੱਗਦਾ ਹੈ। ਮੈਂ ਹੌਲੀ ਸ਼ਾਬਾਸ਼ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ, ਅਤੇ ਤੁਸੀਂ ਪੜ੍ਹ ਸਕਦੇ ਹੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਦੋਸਤ ਸ਼ਬਦ ਪੜ੍ਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਤੁਰੰਤ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ। ਅਸੀਂ ਇਕ ਪੰਨਾ ਹੋਰ ਇਕੱਠੇ ਪੜ੍ਹਦੇ ਹਾਂ, ਅਤੇ ਦੋਸਤ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਛੋਟਾ ਵਿਦਿਆਰਥੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, \"ਧੰਨਵਾਦ, ਮਦਦਗਾਰ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਧੀਰਜ ਵਾਲੀ ਸ਼ਾਬਾਸ਼ ਬੱਚਿਆਂ ਨੂੰ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who is the child today? / ਬੱਚਾ ਅੱਜ ਕੌਣ ਹੈ?",
        "choices": [
          "helper / ਮਦਦਗਾਰ",
          "driver / ਡਰਾਈਵਰ",
          "doctor / ਡਾਕਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child is a helper. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਮਦਦਗਾਰ ਹੈ।"
      },
      {
        "question": "Who is the younger person? / ਛੋਟਾ ਵਿਅਕਤੀ ਕੌਣ ਹੈ?",
        "choices": [
          "younger student / ਛੋਟਾ ਵਿਦਿਆਰਥੀ",
          "teacher / ਟੀਚਰ",
          "pilot / ਪਾਇਲਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The helper sits with a younger student who wants to read. / ਮਦਦਗਾਰ ਛੋਟੇ ਵਿਦਿਆਰਥੀ ਨਾਲ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।"
      },
      {
        "question": "What does the helper whisper first? / ਮਦਦਗਾਰ ਪਹਿਲਾਂ ਕੀ ਹੌਲੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "sound and word / ਧੁਨੀ ਤੇ ਸ਼ਬਦ",
          "run fast / ਤੇਜ਼ ਦੌੜੋ",
          "close eyes / ਅੱਖਾਂ ਬੰਦ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to sound the letter and look at the word. / ਪੈਨਲ 2 ਵਿੱਚ ਅੱਖਰ ਦੀ ਧੁਨੀ ਅਤੇ ਸ਼ਬਦ ਵੇਖਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the helper say next? / ਮਦਦਗਾਰ ਅਗਲਾ ਕੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "try again / ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
          "give up / ਛੱਡ ਦਿਓ",
          "be loud / ਸ਼ੋਰ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says, \"Try again.\" / ਪੈਨਲ 3 ਵਿੱਚ \"ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ\" ਹੈ।"
      },
      {
        "question": "Why does the younger student improve? / ਛੋਟਾ ਵਿਦਿਆਰਥੀ ਕਿਉਂ ਵਧੀਆ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "because of patient praise / ਧੀਰਜ ਵਾਲੀ ਸ਼ਾਬਾਸ਼ ਕਰਕੇ",
          "because of yelling / ਚੀਕਣ ਕਰਕੇ",
          "because of hiding / ਲੁਕਾਉਣ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says patient praise helps kids try again. / ਪੈਨਲ 5 ਵਿੱਚ ਧੀਰਜ ਵਾਲੀ ਸ਼ਾਬਾਸ਼ ਮਦਦ ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "helper",
        "meaningEn": "a person who helps someone",
        "meaningPa": "ਮਦਦਗਾਰ; ਜੋ ਮਦਦ ਕਰਦਾ/ਕਰਦੀ ਹੈ"
      },
      {
        "word": "younger",
        "meaningEn": "not as old; smaller age",
        "meaningPa": "ਛੋਟਾ; ਘੱਟ ਉਮਰ ਵਾਲਾ"
      },
      {
        "word": "read",
        "meaningEn": "say words from a book",
        "meaningPa": "ਪੜ੍ਹਨਾ; ਕਿਤਾਬ ਦੇ ਸ਼ਬਦ ਬੋਲਣਾ"
      },
      {
        "word": "sound",
        "meaningEn": "the noise a letter makes in a word",
        "meaningPa": "ਧੁਨੀ; ਅੱਖਰ ਦੀ ਆਵਾਜ਼"
      },
      {
        "word": "word",
        "meaningEn": "letters that make meaning",
        "meaningPa": "ਸ਼ਬਦ; ਅੱਖਰਾਂ ਨਾਲ ਬਣਿਆ ਮਤਲਬ"
      },
      {
        "word": "patient",
        "meaningEn": "able to wait calmly and kindly",
        "meaningPa": "ਧੀਰਜ ਵਾਲਾ; ਸ਼ਾਂਤ ਅਤੇ ਦਿਆਲੂ"
      },
      {
        "word": "praise",
        "meaningEn": "kind words like \"good job\"",
        "meaningPa": "ਸ਼ਾਬਾਸ਼; ਚੰਗੇ ਸ਼ਬਦ"
      },
      {
        "word": "try",
        "meaningEn": "make an effort to do something",
        "meaningPa": "ਕੋਸ਼ਿਸ਼ ਕਰਨੀ; ਯਤਨ ਕਰਨਾ"
      },
      {
        "word": "again",
        "meaningEn": "one more time",
        "meaningPa": "ਫਿਰ; ਇਕ ਵਾਰੀ ਹੋਰ"
      },
      {
        "word": "whisper",
        "meaningEn": "talk very softly",
        "meaningPa": "ਹੌਲੀ ਬੋਲਣਾ; ਫੁਸਫੁਸਾ ਕੇ ਬੋਲਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "read",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S08",
    "bundleId": 6,
    "orderInBundle": 8,
    "titleEn": "Book 6 · Story 8: A Water-Saving Habit",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 8: ਪਾਣੀ ਬਚਾਉਣ ਦੀ ਆਦਤ",
    "englishStory": "Panel 1 (Intro): Today I learn a new habit to save water at home. Dad says water is important, so we should use it wisely.\nPanel 2 (Body): First, I turn off the tap while I brush my teeth. Next, I take a short shower, not a long shower.\nPanel 3 (Body): Then I fill a bucket to catch cold water at first. We reuse that water for plants, because it is still clean.\nPanel 4 (Body): Later, Dad says, \"Good habit, you should do this every day.\" I smile and turn off the tap again after washing hands.\nPanel 5 (Conclusion): After that, I feel proud because I can save water each day. My family cheers, and this habit feels easy for me now.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਘਰ ਵਿੱਚ ਪਾਣੀ ਬਚਾਉਣ ਦੀ ਨਵੀਂ ਆਦਤ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹਾਂ। ਪਿਉ ਕਹਿੰਦਾ ਹੈ ਕਿ ਪਾਣੀ ਜ਼ਰੂਰੀ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਇਸਨੂੰ ਸਮਝਦਾਰੀ ਨਾਲ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਦੰਦ ਸਾਫ਼ ਕਰਦੇ ਸਮੇਂ ਟੈਪ ਬੰਦ ਕਰ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਛੋਟਾ ਸ਼ਾਵਰ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ, ਲੰਮਾ ਸ਼ਾਵਰ ਨਹੀਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਬਾਲਟੀ ਭਰਦਾ/ਭਰਦੀ ਹਾਂ ਤਾਂ ਜੋ ਸ਼ੁਰੂ ਦਾ ਠੰਢਾ ਪਾਣੀ ਫੜ ਸਕਾਂ। ਅਸੀਂ ਉਹ ਪਾਣੀ ਪੌਦਿਆਂ ਲਈ ਮੁੜ ਵਰਤਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਉਹ ਹਾਲੇ ਵੀ ਸਾਫ਼ ਰਹਿੰਦਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਚੰਗੀ ਆਦਤ, ਇਹ ਹਰ ਰੋਜ਼ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।\" ਮੈਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਅਤੇ ਹੱਥ ਧੋ ਕੇ ਟੈਪ ਫਿਰ ਬੰਦ ਕਰ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਹਰ ਰੋਜ਼ ਪਾਣੀ ਬਚਾ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ। ਮੇਰਾ ਪਰਿਵਾਰ ਖੁਸ਼ ਹੁੰਦਾ ਹੈ, ਅਤੇ ਇਹ ਆਦਤ ਹੁਣ ਮੈਨੂੰ ਸੌਖੀ ਲੱਗਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child want to save? / ਬੱਚਾ ਕੀ ਬਚਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "water / ਪਾਣੀ",
          "sand / ਰੇਤ",
          "toys / ਖਿਡੌਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants to save water. / ਪੈਨਲ 1 ਵਿੱਚ ਪਾਣੀ ਬਚਾਉਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should they do with the tap? / ਟੈਪ ਨਾਲ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "turn off / ਬੰਦ ਕਰਨਾ",
          "break it / ਤੋੜਨਾ",
          "paint it / ਰੰਗਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to turn off the tap while brushing. / ਪੈਨਲ 2 ਵਿੱਚ ਟੈਪ ਬੰਦ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What happens next after brushing? / ਦੰਦ ਸਾਫ਼ ਕਰਨ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "short shower / ਛੋਟਾ ਸ਼ਾਵਰ",
          "long movie / ਲੰਮੀ ਫ਼ਿਲਮ",
          "big party / ਵੱਡੀ ਪਾਰਟੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child takes a short shower next. / ਪੈਨਲ 2 ਵਿੱਚ ਅਗਲਾ ਛੋਟਾ ਸ਼ਾਵਰ ਹੈ।"
      },
      {
        "question": "Why do they reuse water? / ਉਹ ਪਾਣੀ ਮੁੜ ਕਿਉਂ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "because it is still clean / ਕਿਉਂਕਿ ਸਾਫ਼ ਹੈ",
          "because it is loud / ਕਿਉਂਕਿ ਸ਼ੋਰ ਹੈ",
          "because it is heavy / ਕਿਉਂਕਿ ਭਾਰੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they reuse water because it is still clean. / ਪੈਨਲ 3 ਵਿੱਚ ਸਾਫ਼ ਹੋਣ ਕਰਕੇ ਮੁੜ ਵਰਤਦੇ ਹਨ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "proud / ਮਾਣ",
          "lost / ਗੁੰਮ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels proud. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚਾ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "save",
        "meaningEn": "use less and keep for later",
        "meaningPa": "ਬਚਾਉਣਾ; ਘੱਟ ਵਰਤ ਕੇ ਰੱਖਣਾ"
      },
      {
        "word": "water",
        "meaningEn": "a clear liquid we need",
        "meaningPa": "ਪਾਣੀ; ਸਾਨੂੰ ਚਾਹੀਦਾ ਸਾਫ਼ ਤਰਲ"
      },
      {
        "word": "tap",
        "meaningEn": "the faucet where water comes out",
        "meaningPa": "ਟੈਪ; ਜਿੱਥੋਂ ਪਾਣੀ ਨਿਕਲਦਾ ਹੈ"
      },
      {
        "word": "turn off",
        "meaningEn": "stop the water by closing the tap",
        "meaningPa": "ਬੰਦ ਕਰਨਾ; ਟੈਪ ਬੰਦ ਕਰਨਾ"
      },
      {
        "word": "shower",
        "meaningEn": "washing your body with falling water",
        "meaningPa": "ਸ਼ਾਵਰ; ਪਾਣੀ ਨਾਲ ਨਹਾਉਣਾ"
      },
      {
        "word": "bucket",
        "meaningEn": "a container that can hold water",
        "meaningPa": "ਬਾਲਟੀ; ਪਾਣੀ ਰੱਖਣ ਵਾਲਾ ਬਰਤਨ"
      },
      {
        "word": "reuse",
        "meaningEn": "use again",
        "meaningPa": "ਮੁੜ ਵਰਤਣਾ; ਫਿਰ ਵਰਤਣਾ"
      },
      {
        "word": "should",
        "meaningEn": "a word for a good choice",
        "meaningPa": "ਚਾਹੀਦਾ ਹੈ; ਚੰਗੀ ਚੋਣ ਲਈ ਸ਼ਬਦ"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "habit",
        "meaningEn": "something you do often",
        "meaningPa": "ਆਦਤ; ਜੋ ਤੁਸੀਂ ਅਕਸਰ ਕਰਦੇ ਹੋ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "save",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S09",
    "bundleId": 6,
    "orderInBundle": 9,
    "titleEn": "Book 6 · Story 9: My Homework Schedule",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 9: ਮੇਰਾ ਹੋਮਵਰਕ ਸ਼ਡਿਊਲ",
    "englishStory": "Panel 1 (Intro): Today I make a schedule for my homework right after school. I set a timer, so I can work and take a break.\nPanel 2 (Body): First, I finish my math homework and check my answers carefully. Then I take a break, drink water, and breathe slowly.\nPanel 3 (Body): Next, I finish my reading homework before the timer rings. My schedule helps me focus, and I feel calm inside.\nPanel 4 (Body): Finally, I put my papers away and pack my bag neatly. Mom says, \"Great job, you are free to play now.\"\nPanel 5 (Conclusion): After that, I play outside and smile in the fresh air. I feel free because I finish my work on time today.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਹੋਮਵਰਕ ਲਈ ਸ਼ਡਿਊਲ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਮੈਂ ਟਾਈਮਰ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ, ਇਸ ਲਈ ਮੈਂ ਕੰਮ ਕਰ ਸਕਾਂ ਅਤੇ ਬ੍ਰੇਕ ਲੈ ਸਕਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਮੈਥ ਹੋਮਵਰਕ ਮੁਕਾਂਦਾ/ਮੁਕਾਂਦੀ ਹਾਂ ਅਤੇ ਜਵਾਬ ਧਿਆਨ ਨਾਲ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਬ੍ਰੇਕ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ, ਪਾਣੀ ਪੀਂਦਾ/ਪੀੰਦੀ ਹਾਂ, ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਅਗਲਾ, ਮੈਂ ਟਾਈਮਰ ਵੱਜਣ ਤੋਂ ਪਹਿਲਾਂ ਰੀਡਿੰਗ ਹੋਮਵਰਕ ਮੁਕਾਂਦਾ/ਮੁਕਾਂਦੀ ਹਾਂ। ਮੇਰਾ ਸ਼ਡਿਊਲ ਮੈਨੂੰ ਧਿਆਨ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਅੰਦਰੋਂ ਸ਼ਾਂਤ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਆਖਿਰਕਾਰ, ਮੈਂ ਕਾਗਜ਼ ਠੀਕ ਥਾਂ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ ਅਤੇ ਬੈਗ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਪੈਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਵਧੀਆ, ਹੁਣ ਤੂੰ ਖੇਡਣ ਲਈ ਫ੍ਰੀ ਹੈਂ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਬਾਹਰ ਖੇਡਦਾ/ਖੇਡਦੀ ਹਾਂ ਅਤੇ ਤਾਜ਼ੀ ਹਵਾ ਵਿੱਚ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ। ਮੈਂ ਫ੍ਰੀ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਅੱਜ ਸਮੇਂ ਤੇ ਕੰਮ ਮੁਕਾ ਲਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child make? / ਬੱਚਾ ਕੀ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹੈ?",
        "choices": [
          "schedule / ਸ਼ਡਿਊਲ",
          "sandcastle / ਰੇਤ ਦਾ ਘਰ",
          "kite / ਪਤੰਗ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child makes a schedule for homework. / ਪੈਨਲ 1 ਵਿੱਚ ਹੋਮਵਰਕ ਲਈ ਸ਼ਡਿਊਲ ਬਣਾਉਂਦਾ/ਬਣਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What helps the child track time? / ਸਮਾਂ ਦੇਖਣ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "timer / ਟਾਈਮਰ",
          "shoe / ਜੁੱਤਾ",
          "spoon / ਚਮਚੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 mentions a timer to track time. / ਪੈਨਲ 1 ਵਿੱਚ ਸਮਾਂ ਲਈ ਟਾਈਮਰ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "finish homework / ਹੋਮਵਰਕ ਮੁਕਾਉਂਦਾ/ਮੁਕਾਂਦੀ ਹੈ",
          "play games / ਖੇਡਦਾ/ਖੇਡਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 starts with first and finishing homework. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਹੋਮਵਰਕ ਮੁਕਾਉਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What happens next after math? / ਮੈਥ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "break / ਬ੍ਰੇਕ",
          "big storm / ਵੱਡਾ ਤੂਫ਼ਾਨ",
          "lost book / ਕਿਤਾਬ ਗੁੰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child takes a break after math. / ਪੈਨਲ 2 ਵਿੱਚ ਮੈਥ ਤੋਂ ਬਾਅਦ ਬ੍ਰੇਕ ਹੈ।"
      },
      {
        "question": "Why does the child feel free? / ਬੱਚਾ ਫ੍ਰੀ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "finish on time / ਸਮੇਂ ਤੇ ਮੁਕਾਇਆ",
          "ate candy / ਕੈਂਡੀ ਖਾਈ",
          "ran fast / ਤੇਜ਼ ਦੌੜਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels free because work is finished on time. / ਪੈਨਲ 5 ਵਿੱਚ ਸਮੇਂ ਤੇ ਕੰਮ ਮੁਕਾਉਣ ਕਰਕੇ ਫ੍ਰੀ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "schedule",
        "meaningEn": "a plan for when you do things",
        "meaningPa": "ਸ਼ਡਿਊਲ; ਕਦੋਂ ਕੀ ਕਰਨਾ ਹੈ ਯੋਜਨਾ"
      },
      {
        "word": "timer",
        "meaningEn": "a clock that counts time",
        "meaningPa": "ਟਾਈਮਰ; ਸਮਾਂ ਗਿਣਣ ਵਾਲੀ ਘੜੀ"
      },
      {
        "word": "homework",
        "meaningEn": "school work you do at home",
        "meaningPa": "ਹੋਮਵਰਕ; ਘਰ ਲਈ ਸਕੂਲ ਦਾ ਕੰਮ"
      },
      {
        "word": "break",
        "meaningEn": "a short rest time",
        "meaningPa": "ਬ੍ਰੇਕ; ਥੋੜ੍ਹਾ ਆਰਾਮ"
      },
      {
        "word": "finish",
        "meaningEn": "complete and end the work",
        "meaningPa": "ਮੁਕਾਉਣਾ; ਕੰਮ ਪੂਰਾ ਕਰਨਾ"
      },
      {
        "word": "first",
        "meaningEn": "before everything else",
        "meaningPa": "ਪਹਿਲਾਂ; ਸਭ ਤੋਂ ਪਹਿਲਾਂ"
      },
      {
        "word": "then",
        "meaningEn": "after that",
        "meaningPa": "ਫਿਰ; ਉਸ ਤੋਂ ਬਾਅਦ"
      },
      {
        "word": "next",
        "meaningEn": "the step after now",
        "meaningPa": "ਅਗਲਾ; ਅਗਲਾ ਕਦਮ"
      },
      {
        "word": "finally",
        "meaningEn": "at the end",
        "meaningPa": "ਆਖਿਰਕਾਰ; ਅੰਤ ਵਿੱਚ"
      },
      {
        "word": "free",
        "meaningEn": "not busy; able to play",
        "meaningPa": "ਫ੍ਰੀ; ਵਿਹਲਾ/ਵਿਹਲੀ, ਖੇਡ ਸਕਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "pack",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B6_S10",
    "bundleId": 6,
    "orderInBundle": 10,
    "titleEn": "Book 6 · Story 10: My Class Presentation",
    "titlePa": "ਕਿਤਾਬ 6 · ਕਹਾਣੀ 10: ਮੇਰੀ ਕਲਾਸ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ",
    "englishStory": "Panel 1 (Intro): Today I prepare a presentation for my class about my topic. I want to explain it clearly to the audience at school.\nPanel 2 (Body): First, I write three steps on a card and practice at home. Next, I use my voice and stand tall in the mirror.\nPanel 3 (Body): Then I feel confident, because I practice many times after dinner. My mom asks a question, and I answer calmly with a smile.\nPanel 4 (Body): Later, I start my presentation in class and smile at the audience. I explain my topic and follow the steps in order.\nPanel 5 (Conclusion): After that, my teacher says my presentation is clear and kind. I feel confident because my practice helps my voice stay strong.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਲਈ ਆਪਣੇ ਟਾਪਿਕ ਬਾਰੇ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਤਿਆਰ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਸਕੂਲ ਵਿੱਚ ਦਰਸ਼ਕਾਂ ਨੂੰ ਇਹ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਸਮਝਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕਾਰਡ ਤੇ ਤਿੰਨ ਕਦਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹਾਂ ਅਤੇ ਘਰ ਵਿੱਚ ਅਭਿਆਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਆਪਣੀ ਆਵਾਜ਼ ਵਰਤਦਾ/ਵਰਤਦੀ ਹਾਂ ਅਤੇ ਆਇਨੇ ਵਿੱਚ ਸਿੱਧਾ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਭਰੋਸੇ ਨਾਲ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਮੈਂ ਰਾਤ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਕਈ ਵਾਰ ਅਭਿਆਸ ਕੀਤਾ। ਮਾਂ ਸਵਾਲ ਪੁੱਛਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਮੁਸਕੁਰਾ ਕੇ ਸ਼ਾਂਤ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਬਾਅਦ ਵਿੱਚ, ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਆਪਣੀ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਦਰਸ਼ਕਾਂ ਵੱਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ। ਮੈਂ ਟਾਪਿਕ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ ਅਤੇ ਕਦਮ ਕ੍ਰਮ ਨਾਲ ਦੱਸਦਾ/ਦੱਸਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ ਕਿ ਮੇਰੀ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫ਼ ਅਤੇ ਚੰਗੀ ਹੈ। ਮੈਂ ਭਰੋਸੇ ਨਾਲ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੇਰਾ ਅਭਿਆਸ ਮੇਰੀ ਆਵਾਜ਼ ਮਜ਼ਬੂਤ ਰੱਖਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child prepare? / ਬੱਚਾ ਕੀ ਤਿਆਰ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "presentation / ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ",
          "pizza / ਪੀਜ਼ਾ",
          "bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child prepares a presentation. / ਪੈਨਲ 1 ਵਿੱਚ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਤਿਆਰ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who listens to the presentation? / ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਕੌਣ ਸੁਣਦਾ ਹੈ?",
        "choices": [
          "audience / ਦਰਸ਼ਕ",
          "fish / ਮੱਛੀ",
          "robot / ਰੋਬੋਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child explains to the audience. / ਪੈਨਲ 1 ਵਿੱਚ ਦਰਸ਼ਕਾਂ ਨੂੰ ਸਮਝਾਉਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child write first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ?",
        "choices": [
          "steps / ਕਦਮ",
          "songs / ਗਾਣੇ",
          "shoes / ਜੁੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child writes steps on a card first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਕਦਮ ਲਿਖਦਾ/ਲਿਖਦੀ ਹੈ।"
      },
      {
        "question": "What happens next at home? / ਘਰ ਵਿੱਚ ਅਗਲਾ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "practice / ਅਭਿਆਸ",
          "storm / ਤੂਫ਼ਾਨ",
          "sleep all day / ਸਾਰਾ ਦਿਨ ਸੌਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child practices at home. / ਪੈਨਲ 2 ਵਿੱਚ ਘਰ ਵਿੱਚ ਅਭਿਆਸ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the child feel confident? / ਬੱਚਾ confident ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "because of practice / ਅਭਿਆਸ ਕਰਕੇ",
          "because of candy / ਕੈਂਡੀ ਕਰਕੇ",
          "because of rain / ਮੀਂਹ ਕਰਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child feels confident because of practice. / ਪੈਨਲ 3 ਵਿੱਚ ਅਭਿਆਸ ਕਰਕੇ ਭਰੋਸਾ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "explain",
        "meaningEn": "tell in a clear way",
        "meaningPa": "ਸਮਝਾਉਣਾ; ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਦੱਸਣਾ"
      },
      {
        "word": "presentation",
        "meaningEn": "a short talk you give to a group",
        "meaningPa": "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ; ਸਮੂਹ ਅੱਗੇ ਛੋਟੀ ਗੱਲ"
      },
      {
        "word": "steps",
        "meaningEn": "parts you do in order",
        "meaningPa": "ਕਦਮ; ਕ੍ਰਮ ਨਾਲ ਕਰਨ ਵਾਲੇ ਹਿੱਸੇ"
      },
      {
        "word": "topic",
        "meaningEn": "what you are talking about",
        "meaningPa": "ਟਾਪਿਕ; ਜਿਸ ਬਾਰੇ ਗੱਲ ਹੁੰਦੀ ਹੈ"
      },
      {
        "word": "audience",
        "meaningEn": "people who listen and watch",
        "meaningPa": "ਦਰਸ਼ਕ; ਜੋ ਸੁਣਦੇ ਅਤੇ ਵੇਖਦੇ ਹਨ"
      },
      {
        "word": "practice",
        "meaningEn": "do it again to get better",
        "meaningPa": "ਅਭਿਆਸ; ਵਧੀਆ ਬਣਨ ਲਈ ਦੁਹਰਾਉਣਾ"
      },
      {
        "word": "voice",
        "meaningEn": "the sound you make when you speak",
        "meaningPa": "ਆਵਾਜ਼; ਬੋਲਣ ਦੀ ਧੁਨੀ"
      },
      {
        "word": "confident",
        "meaningEn": "feeling sure you can do it",
        "meaningPa": "ਭਰੋਸੇ ਵਾਲਾ; ਯਕੀਨ ਨਾਲ"
      },
      {
        "word": "question",
        "meaningEn": "words you ask to get an answer",
        "meaningPa": "ਸਵਾਲ; ਪੁੱਛਣ ਵਾਲੀ ਗੱਲ"
      },
      {
        "word": "answer",
        "meaningEn": "words you say to respond to a question",
        "meaningPa": "ਜਵਾਬ; ਸਵਾਲ ਦਾ ਉੱਤਰ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK7_CUSTOM_STORIES = [
  {
    "storyId": "B7_S01",
    "bundleId": 7,
    "orderInBundle": 1,
    "titleEn": "Book 7 · Story 1: Can You Say That Again?",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 1: ਕੀ ਤੁਸੀਂ ਫਿਰ ਕਹਿ ਸਕਦੇ ਹੋ?",
    "englishStory": "Panel 1 (Intro): Today I sit in class and listen to a new story. I hear one hard word, and I do not understand it yet.\nPanel 2 (Body): First, I raise my hand and ask my teacher politely. I say, \"Please repeat that word again, slowly.\"\nPanel 3 (Body): Next, my teacher repeats it slowly and points to the picture. I listen carefully and try to understand the meaning.\nPanel 4 (Body): Then I ask, \"What does it mean?\" and my teacher gives an answer. I nod my head and smile because I understand now.\nPanel 5 (Conclusion): After that, I use the word in my own sentence. I feel proud because asking helps me learn again and again.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਵਿੱਚ ਬੈਠ ਕੇ ਨਵੀਂ ਕਹਾਣੀ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ। ਮੈਨੂੰ ਇੱਕ ਔਖਾ ਸ਼ਬਦ ਸੁਣਾਈ ਦਿੰਦਾ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਹਾਲੇ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹੱਥ ਚੁੱਕਦਾ/ਚੁੱਕਦੀ ਹਾਂ ਅਤੇ ਟੀਚਰ ਨੂੰ ਨਮਰਤਾ ਨਾਲ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕਿਰਪਾ ਕਰਕੇ ਉਹ ਸ਼ਬਦ ਫਿਰ ਹੌਲੀ ਕਹੋ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਟੀਚਰ ਹੌਲੀ-ਹੌਲੀ ਫਿਰ ਦੱਸਦੇ ਹਨ ਅਤੇ ਤਸਵੀਰ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹਨ। ਮੈਂ ਧਿਆਨ ਨਾਲ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ ਅਤੇ ਮਤਲਬ ਸਮਝਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?\" ਅਤੇ ਟੀਚਰ ਜਵਾਬ ਦਿੰਦੇ ਹਨ। ਮੈਂ ਸਿਰ ਹਿਲਾਉਂਦਾ/ਹਿਲਾਉਂਦੀ ਹਾਂ ਅਤੇ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਕਿਉਂਕਿ ਹੁਣ ਸਮਝ ਆ ਜਾਂਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਉਹ ਸ਼ਬਦ ਆਪਣੀ ਵਾਕ ਵਿੱਚ ਵਰਤਦਾ/ਵਰਤਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਪੁੱਛਣਾ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "class / ਕਲਾਸ",
          "park / ਪਾਰਕ",
          "market / ਮਾਰਕੀਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child sits in class in Panel 1. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਕਲਾਸ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "ask / ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ",
          "run / ਦੌੜਦਾ/ਦੌੜਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child asks the teacher politely. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਟੀਚਰ ਨੂੰ ਨਮਰਤਾ ਨਾਲ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "What does the child ask the teacher to do? / ਬੱਚਾ ਟੀਚਰ ਨੂੰ ਕੀ ਕਰਨ ਲਈ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "repeat slowly / ਹੌਲੀ ਫਿਰ ਕਹਿਣਾ",
          "jump / ਕੂਦਣਾ",
          "sing / ਗਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child asks the teacher to repeat the word again, slowly. / ਬੱਚਾ ਟੀਚਰ ਨੂੰ ਸ਼ਬਦ ਹੌਲੀ-ਹੌਲੀ ਫਿਰ ਕਹਿਣ ਲਈ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child smile? / ਬੱਚਾ ਕਿਉਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹੈ?",
        "choices": [
          "understand / ਸਮਝ ਆ ਗਈ",
          "lost / ਗੁੰਮ ਹੋ ਗਿਆ",
          "hungry / ਭੁੱਖ ਲੱਗੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the child smiles because they understand now. / ਪੈਨਲ 4 ਵਿੱਚ ਬੱਚਾ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹੈ ਕਿਉਂਕਿ ਹੁਣ ਸਮਝ ਆ ਗਈ।"
      },
      {
        "question": "What helps the child learn? / ਬੱਚੇ ਨੂੰ ਸਿੱਖਣ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "ask / ਪੁੱਛਣਾ",
          "hide / ਲੁਕਾਉਣਾ",
          "shout / ਚੀਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 shows asking helps the child learn again and again. / ਪੈਨਲ 5 ਵਿੱਚ ਪੁੱਛਣਾ ਬੱਚੇ ਨੂੰ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "ask",
        "meaningEn": "say a question to get help or information",
        "meaningPa": "ਪੁੱਛਣਾ; ਸਵਾਲ ਕਰਨਾ"
      },
      {
        "word": "repeat",
        "meaningEn": "say something again",
        "meaningPa": "ਫਿਰ ਕਹਿਣਾ; ਦੁਬਾਰਾ ਦੱਸਣਾ"
      },
      {
        "word": "again",
        "meaningEn": "one more time",
        "meaningPa": "ਫਿਰ; ਇਕ ਵਾਰੀ ਹੋਰ"
      },
      {
        "word": "slowly",
        "meaningEn": "not fast; at a gentle speed",
        "meaningPa": "ਹੌਲੀ; ਧੀਰੇ-ਧੀਰੇ"
      },
      {
        "word": "please",
        "meaningEn": "a polite word when asking",
        "meaningPa": "ਕਿਰਪਾ ਕਰਕੇ; ਨਮਰ ਸ਼ਬਦ"
      },
      {
        "word": "mean",
        "meaningEn": "have a meaning",
        "meaningPa": "ਮਤਲਬ ਹੋਣਾ; ਅਰਥ ਹੋਣਾ"
      },
      {
        "word": "word",
        "meaningEn": "letters that make meaning",
        "meaningPa": "ਸ਼ਬਦ; ਅਰਥ ਵਾਲਾ ਲਫ਼ਜ਼"
      },
      {
        "word": "listen",
        "meaningEn": "use your ears to hear carefully",
        "meaningPa": "ਸੁਣਨਾ; ਧਿਆਨ ਨਾਲ ਸੁਣਨਾ"
      },
      {
        "word": "understand",
        "meaningEn": "know what it means",
        "meaningPa": "ਸਮਝਣਾ; ਮਤਲਬ ਸਮਝ ਲੈਣਾ"
      },
      {
        "word": "answer",
        "meaningEn": "a reply to a question",
        "meaningPa": "ਜਵਾਬ; ਸਵਾਲ ਦਾ ਉੱਤਰ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "sit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S02",
    "bundleId": 7,
    "orderInBundle": 2,
    "titleEn": "Book 7 · Story 2: Which One Do You Prefer?",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 2: ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਵਧੇਰੇ ਪਸੰਦ ਹੈ?",
    "englishStory": "Panel 1 (Intro): Today my friend and I choose a snack after school. Two snacks look good, and we both feel hungry.\nPanel 2 (Body): First, I look at each option and choose carefully. I ask, \"Which one do you prefer, and why?\"\nPanel 3 (Body): Next, my friend says, \"I prefer apples because they taste sweet.\" I think for a moment and pick my favorite snack.\nPanel 4 (Body): Then I say, \"I prefer yogurt, but apples are good too.\" The snacks are different, and they are not the same.\nPanel 5 (Conclusion): After that, we decide to share a little and be fair. We feel happy because choosing and sharing is better together.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਅਤੇ ਮੇਰਾ ਦੋਸਤ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਨਾਸ਼ਤਾ ਚੁਣਦੇ ਹਾਂ। ਦੋ ਨਾਸ਼ਤੇ ਚੰਗੇ ਲੱਗਦੇ ਹਨ, ਅਤੇ ਸਾਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੁੰਦੀ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹਰ ਚੋਣ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਸੋਚ ਕੇ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਤੈਨੂੰ ਕਿਹੜਾ ਵਧੇਰੇ ਪਸੰਦ ਹੈ, ਅਤੇ ਕਿਉਂ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਦੋਸਤ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, \"ਮੈਨੂੰ ਸੇਬ ਪਸੰਦ ਹਨ ਕਿਉਂਕਿ ਉਹ ਮਿੱਠੇ ਲੱਗਦੇ ਹਨ।\" ਮੈਂ ਥੋੜ੍ਹਾ ਸੋਚਦਾ/ਸੋਚਦੀ ਹਾਂ ਅਤੇ ਆਪਣਾ ਮਨਪਸੰਦ ਨਾਸ਼ਤਾ ਚੁਣਦਾ/ਚੁਣਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਨੂੰ ਦਹੀਂ ਵਧੇਰੇ ਪਸੰਦ ਹੈ, ਪਰ ਸੇਬ ਵੀ ਚੰਗੇ ਹਨ।\" ਨਾਸ਼ਤੇ ਵੱਖਰੇ ਹਨ, ਅਤੇ ਇੱਕੋ ਜਿਹੇ ਨਹੀਂ ਹਨ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਥੋੜ੍ਹਾ-ਥੋੜ੍ਹਾ ਸਾਂਝਾ ਕਰਨ ਦਾ ਫੈਸਲਾ ਕਰਦੇ ਹਾਂ। ਅਸੀਂ ਖੁਸ਼ ਹੁੰਦੇ ਹਾਂ ਕਿਉਂਕਿ ਚੋਣ ਅਤੇ ਸਾਂਝਾ ਦੋਵੇਂ ਮਿਲ ਕੇ ਚੰਗੇ ਲੱਗਦੇ ਹਨ।",
    "multipleChoiceQuestions": [
      {
        "question": "When do they choose a snack? / ਉਹ ਨਾਸ਼ਤਾ ਕਦੋਂ ਚੁਣਦੇ ਹਨ?",
        "choices": [
          "after school / ਸਕੂਲ ਤੋਂ ਬਾਅਦ",
          "at night / ਰਾਤ ਨੂੰ",
          "in winter / ਸਰਦੀ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they choose a snack after school. / ਪੈਨਲ 1 ਵਿੱਚ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਨਾਸ਼ਤਾ ਚੁਣਦੇ ਹਨ।"
      },
      {
        "question": "What word means a choice you can pick? / ਕਿਹੜਾ ਸ਼ਬਦ \"ਚੋਣ\" ਦੱਸਦਾ ਹੈ?",
        "choices": [
          "option / ਚੋਣ",
          "storm / ਤੂਫ਼ਾਨ",
          "pillow / ਤਕੀਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 uses the word option for a choice you can pick. / ਪੈਨਲ 2 ਵਿੱਚ option ਦਾ ਮਤਲਬ ਚੋਣ ਹੁੰਦਾ ਹੈ।"
      },
      {
        "question": "Why does the friend prefer apples? / ਦੋਸਤ ਸੇਬ ਕਿਉਂ ਪਸੰਦ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "sweet taste / ਮਿੱਠਾ ਸੁਆਦ",
          "cold / ਠੰਢਾ",
          "noisy / ਸ਼ੋਰ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says apples taste sweet. / ਪੈਨਲ 3 ਵਿੱਚ ਸੇਬ ਮਿੱਠੇ ਲੱਗਦੇ ਹਨ।"
      },
      {
        "question": "Are the snacks the same or different? / ਨਾਸ਼ਤੇ ਇੱਕੋ ਜਿਹੇ ਹਨ ਜਾਂ ਵੱਖਰੇ?",
        "choices": [
          "different / ਵੱਖਰੇ",
          "same / ਇੱਕੋ ਜਿਹੇ",
          "broken / ਟੁੱਟੇ ਹੋਏ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the snacks are different and not the same. / ਪੈਨਲ 4 ਵਿੱਚ ਨਾਸ਼ਤੇ ਵੱਖਰੇ ਅਤੇ ਇੱਕੋ ਜਿਹੇ ਨਹੀਂ ਹਨ।"
      },
      {
        "question": "What do they do at the end? / ਅੰਤ ਵਿੱਚ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "share / ਸਾਂਝਾ",
          "fight / ਲੜਾਈ",
          "cry / ਰੋਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they decide to share. / ਪੈਨਲ 5 ਵਿੱਚ ਉਹ ਸਾਂਝਾ ਕਰਨ ਦਾ ਫੈਸਲਾ ਕਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "prefer",
        "meaningEn": "like one thing more than another",
        "meaningPa": "ਵਧੇਰੇ ਪਸੰਦ ਕਰਨਾ; ਇੱਕ ਚੀਜ਼ ਨੂੰ ਜ਼ਿਆਦਾ ਚਾਹੁਣਾ"
      },
      {
        "word": "choose",
        "meaningEn": "pick one option",
        "meaningPa": "ਚੁਣਨਾ; ਇੱਕ ਵਿਕਲਪ ਲੈਣਾ"
      },
      {
        "word": "option",
        "meaningEn": "a choice you can pick",
        "meaningPa": "ਚੋਣ; ਚੁਣਨ ਵਾਲਾ ਵਿਕਲਪ"
      },
      {
        "word": "different",
        "meaningEn": "not the same",
        "meaningPa": "ਵੱਖਰਾ; ਇੱਕੋ ਜਿਹਾ ਨਹੀਂ"
      },
      {
        "word": "same",
        "meaningEn": "not different",
        "meaningPa": "ਇੱਕੋ ਜਿਹਾ; ਵੱਖਰਾ ਨਹੀਂ"
      },
      {
        "word": "favorite",
        "meaningEn": "the one you like the most",
        "meaningPa": "ਮਨਪਸੰਦ; ਸਭ ਤੋਂ ਵਧੇਰੇ ਪਸੰਦ"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "taste",
        "meaningEn": "the flavor of food",
        "meaningPa": "ਸੁਆਦ; ਖਾਣੇ ਦਾ ਰਸ"
      },
      {
        "word": "share",
        "meaningEn": "give some to someone else",
        "meaningPa": "ਸਾਂਝਾ ਕਰਨਾ; ਦੂਜੇ ਨੂੰ ਵੀ ਦੇਣਾ"
      },
      {
        "word": "decide",
        "meaningEn": "make a choice",
        "meaningPa": "ਫੈਸਲਾ ਕਰਨਾ; ਚੋਣ ਤੈਅ ਕਰਨਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "share",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "be",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S03",
    "bundleId": 7,
    "orderInBundle": 3,
    "titleEn": "Book 7 · Story 3: Planning a Playdate",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 3: ਖੇਡਣ ਦੀ ਯੋਜਨਾ",
    "englishStory": "Panel 1 (Intro): Today I want to meet my friend after school. I have an idea, and I feel excited to invite my friend.\nPanel 2 (Body): First, I call my friend and speak clearly. I say, \"Can you meet tomorrow at three o’clock?\"\nPanel 3 (Body): Next, we choose a place and make a simple schedule. We agree to meet at the park gate and bring a ball.\nPanel 4 (Body): Then my friend asks, \"What if it rains?\" I answer, \"We can meet at my home, and play inside.\"\nPanel 5 (Conclusion): After that, we say goodbye and feel ready for tomorrow. Planning helps us meet on time and have fun together.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਦੋਸਤ ਨੂੰ ਮਿਲਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਮੇਰੇ ਮਨ ਵਿੱਚ ਇੱਕ ਵਿਚਾਰ ਹੁੰਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਦੋਸਤ ਨੂੰ ਬੁਲਾਉਣ ਲਈ ਉਤਸਾਹੀ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਦੋਸਤ ਨੂੰ ਫ਼ੋਨ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਸਾਫ਼ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕੀ ਤੂੰ ਭਲਕੇ ਤਿੰਨ ਵਜੇ ਮਿਲ ਸਕਦਾ/ਸਕਦੀ ਹੈਂ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਥਾਂ ਚੁਣਦੇ ਹਾਂ ਅਤੇ ਸਾਦਾ ਸ਼ਡਿਊਲ ਬਣਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਪਾਰਕ ਦੇ ਗੇਟ ਤੇ ਮਿਲਣ ਅਤੇ ਗੇਂਦ ਲਿਆਂਦਣ ਤੇ ਸਹਿਮਤ ਹੁੰਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਦੋਸਤ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ, \"ਜੇ ਮੀਂਹ ਪਿਆ ਤਾਂ?\" ਮੈਂ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ, \"ਅਸੀਂ ਮੇਰੇ ਘਰ ਮਿਲ ਲਾਂਗੇ/ਲਾਂਗੀਆਂ ਅਤੇ ਅੰਦਰ ਖੇਡ ਲਾਂਗੇ/ਲਾਂਗੀਆਂ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਅਲਵਿਦਾ ਕਹਿੰਦੇ ਹਾਂ ਅਤੇ ਭਲਕੇ ਲਈ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦੇ ਹਾਂ। ਯੋਜਨਾ ਬਣਾਉਣਾ ਸਮੇਂ ਤੇ ਮਿਲਣ ਅਤੇ ਮਜ਼ੇ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child want to do? / ਬੱਚਾ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "meet a friend / ਦੋਸਤ ਨੂੰ ਮਿਲਣਾ",
          "fly a plane / ਜਹਾਜ਼ ਉਡਾਉਣਾ",
          "build a house / ਘਰ ਬਣਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants to meet a friend. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਦੋਸਤ ਨੂੰ ਮਿਲਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "call / ਫ਼ੋਨ ਕਰਦਾ/ਕਰਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "cry / ਰੋਂਦਾ/ਰੋਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child calls the friend. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਦੋਸਤ ਨੂੰ ਫ਼ੋਨ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "When do they plan to meet? / ਉਹ ਕਦੋਂ ਮਿਲਣ ਦੀ ਯੋਜਨਾ ਬਣਾਂਦੇ ਹਨ?",
        "choices": [
          "tomorrow / ਭਲਕੇ",
          "yesterday / ਕੱਲ੍ਹ",
          "next month / ਅਗਲਾ ਮਹੀਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they plan to meet tomorrow. / ਪੈਨਲ 2 ਵਿੱਚ ਭਲਕੇ ਮਿਲਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Where do they plan to meet first? / ਉਹ ਪਹਿਲਾਂ ਕਿੱਥੇ ਮਿਲਣ ਦੀ ਯੋਜਨਾ ਬਣਾਂਦੇ ਹਨ?",
        "choices": [
          "park gate / ਪਾਰਕ ਗੇਟ",
          "train / ਰੇਲ",
          "roof / ਛੱਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they meet at the park gate. / ਪੈਨਲ 3 ਵਿੱਚ ਪਾਰਕ ਗੇਟ ਤੇ ਮਿਲਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What is the backup plan if it rains? / ਜੇ ਮੀਂਹ ਪਏ ਤਾਂ ਯੋਜਨਾ ਕੀ ਹੈ?",
        "choices": [
          "meet at home / ਘਰ ਮਿਲਣਾ",
          "cancel forever / ਹਮੇਸ਼ਾ ਲਈ ਰੱਦ",
          "swim outside / ਬਾਹਰ ਤੈਰਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they can meet at home and play inside. / ਪੈਨਲ 4 ਵਿੱਚ ਘਰ ਮਿਲ ਕੇ ਅੰਦਰ ਖੇਡਣ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "plan",
        "meaningEn": "think about what to do and when",
        "meaningPa": "ਯੋਜਨਾ; ਪਹਿਲਾਂ ਤੋਂ ਤਿਆਰੀ"
      },
      {
        "word": "invite",
        "meaningEn": "ask someone to come",
        "meaningPa": "ਬੁਲਾਣਾ; ਆਉਣ ਲਈ ਕਹਿਣਾ"
      },
      {
        "word": "call",
        "meaningEn": "talk on the phone",
        "meaningPa": "ਫ਼ੋਨ ਕਰਨਾ; ਕਾਲ ਕਰਨੀ"
      },
      {
        "word": "tomorrow",
        "meaningEn": "the day after today",
        "meaningPa": "ਭਲਕੇ; ਅੱਜ ਤੋਂ ਅਗਲਾ ਦਿਨ"
      },
      {
        "word": "time",
        "meaningEn": "when something happens",
        "meaningPa": "ਸਮਾਂ; ਕਦੋਂ"
      },
      {
        "word": "place",
        "meaningEn": "where something happens",
        "meaningPa": "ਥਾਂ; ਕਿੱਥੇ"
      },
      {
        "word": "schedule",
        "meaningEn": "a plan with times",
        "meaningPa": "ਸ਼ਡਿਊਲ; ਸਮੇਂ ਵਾਲੀ ਯੋਜਨਾ"
      },
      {
        "word": "agree",
        "meaningEn": "say yes to the same plan",
        "meaningPa": "ਸਹਿਮਤ ਹੋਣਾ; ਹਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "bring",
        "meaningEn": "carry something with you",
        "meaningPa": "ਲਿਆਉਣਾ; ਨਾਲ ਲੈ ਆਉਣਾ"
      },
      {
        "word": "meet",
        "meaningEn": "come together in the same place",
        "meaningPa": "ਮਿਲਣਾ; ਇਕੱਠੇ ਹੋਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "agree",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S04",
    "bundleId": 7,
    "orderInBundle": 4,
    "titleEn": "Book 7 · Story 4: Same and Different",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 4: ਇੱਕੋ ਜਿਹੇ ਅਤੇ ਵੱਖਰੇ",
    "englishStory": "Panel 1 (Intro): Today my friend and I watch two animals at the park. One animal is a dog, and one animal is a cat.\nPanel 2 (Body): First, we compare them with our eyes and talk quietly. My friend says, \"They both have tails, but they move differently.\"\nPanel 3 (Body): Next, the dog runs faster, and the cat walks slower. The dog is bigger, and the cat is smaller than the dog.\nPanel 4 (Body): Then I ask, \"Which one do you like?\" My friend answers, \"I like both, because both are cute.\"\nPanel 5 (Conclusion): After that, we smile and say, \"Same and different is fun to learn.\" Comparing helps us think and talk clearly together.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਅਤੇ ਮੇਰਾ ਦੋਸਤ ਪਾਰਕ ਵਿੱਚ ਦੋ ਜਾਨਵਰ ਵੇਖਦੇ ਹਾਂ। ਇੱਕ ਕੁੱਤਾ ਹੈ, ਅਤੇ ਇੱਕ ਬਿੱਲੀ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਅਸੀਂ ਦੋਵੇਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖ ਕੇ ਤੁਲਨਾ ਕਰਦੇ ਹਾਂ। ਦੋਸਤ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, \"ਦੋਵਾਂ ਦੀ ਪੂੰਛ ਹੈ, ਪਰ ਦੋਵੇਂ ਵੱਖਰੇ ਤਰੀਕੇ ਨਾਲ ਹਿਲਦੇ ਹਨ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਕੁੱਤਾ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ, ਅਤੇ ਬਿੱਲੀ ਹੌਲੀ ਤੁਰਦੀ ਹੈ। ਕੁੱਤਾ ਵੱਡਾ ਹੈ, ਅਤੇ ਬਿੱਲੀ ਕੁੱਤੇ ਨਾਲੋਂ ਛੋਟੀ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਤੈਨੂੰ ਕਿਹੜਾ ਚੰਗਾ ਲੱਗਦਾ ਹੈ?\" ਦੋਸਤ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹੈ, \"ਮੈਨੂੰ ਦੋਵੇਂ ਪਸੰਦ ਹਨ ਕਿਉਂਕਿ ਦੋਵੇਂ ਸੋਹਣੇ ਹਨ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਮੁਸਕੁਰਾਉਂਦੇ ਹਾਂ ਅਤੇ ਕਹਿੰਦੇ ਹਾਂ, \"ਇੱਕੋ ਜਿਹਾ ਅਤੇ ਵੱਖਰਾ ਸਿੱਖਣਾ ਮਜ਼ੇਦਾਰ ਹੈ।\" ਤੁਲਨਾ ਕਰਨਾ ਸਾਨੂੰ ਸੋਚਣ ਅਤੇ ਸਾਫ਼ ਬੋਲਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What two animals do they see? / ਉਹ ਕਿਹੜੇ ਦੋ ਜਾਨਵਰ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "dog and cat / ਕੁੱਤਾ ਅਤੇ ਬਿੱਲੀ",
          "fish and bird / ਮੱਛੀ ਅਤੇ ਪੰਛੀ",
          "lion and tiger / ਸ਼ੇਰ ਅਤੇ ਬਾਘ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they see a dog and a cat. / ਪੈਨਲ 1 ਵਿੱਚ ਕੁੱਤਾ ਅਤੇ ਬਿੱਲੀ ਹਨ।"
      },
      {
        "question": "What do they do first? / ਉਹ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "compare / ਤੁਲਨਾ",
          "sleep / ਸੌਣਾ",
          "shout / ਚੀਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they compare and talk. / ਪੈਨਲ 2 ਵਿੱਚ ਤੁਲਨਾ ਕਰਦੇ ਅਤੇ ਗੱਲ ਕਰਦੇ ਹਨ।"
      },
      {
        "question": "Which animal runs faster? / ਕਿਹੜਾ ਜਾਨਵਰ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ?",
        "choices": [
          "dog / ਕੁੱਤਾ",
          "cat / ਬਿੱਲੀ",
          "both same / ਦੋਵੇਂ ਇੱਕੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the dog runs faster. / ਪੈਨਲ 3 ਵਿੱਚ ਕੁੱਤਾ ਤੇਜ਼ ਦੌੜਦਾ ਹੈ।"
      },
      {
        "question": "Which animal is smaller? / ਕਿਹੜਾ ਜਾਨਵਰ ਛੋਟਾ ਹੈ?",
        "choices": [
          "cat / ਬਿੱਲੀ",
          "dog / ਕੁੱਤਾ",
          "none / ਕੋਈ ਨਹੀਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the cat is smaller than the dog. / ਪੈਨਲ 3 ਵਿੱਚ ਬਿੱਲੀ ਕੁੱਤੇ ਨਾਲੋਂ ਛੋਟੀ ਹੈ।"
      },
      {
        "question": "Why does the friend like both? / ਦੋਸਤ ਨੂੰ ਦੋਵੇਂ ਕਿਉਂ ਪਸੰਦ ਹਨ?",
        "choices": [
          "because cute / ਕਿਉਂਕਿ ਸੋਹਣੇ",
          "because loud / ਕਿਉਂਕਿ ਸ਼ੋਰ",
          "because cold / ਕਿਉਂਕਿ ਠੰਢੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says both are cute. / ਪੈਨਲ 4 ਵਿੱਚ ਦੋਵੇਂ ਸੋਹਣੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "compare",
        "meaningEn": "look at two things to see same and different",
        "meaningPa": "ਤੁਲਨਾ ਕਰਨਾ; ਇੱਕੋ ਜਿਹਾ ਅਤੇ ਵੱਖਰਾ ਵੇਖਣਾ"
      },
      {
        "word": "same",
        "meaningEn": "not different",
        "meaningPa": "ਇੱਕੋ ਜਿਹਾ; ਵੱਖਰਾ ਨਹੀਂ"
      },
      {
        "word": "different",
        "meaningEn": "not the same",
        "meaningPa": "ਵੱਖਰਾ; ਇੱਕੋ ਜਿਹਾ ਨਹੀਂ"
      },
      {
        "word": "both",
        "meaningEn": "two together",
        "meaningPa": "ਦੋਵੇਂ; ਦੋਨਾਂ"
      },
      {
        "word": "but",
        "meaningEn": "a word that shows contrast",
        "meaningPa": "ਪਰ; ਵਿਰੋਧ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "bigger",
        "meaningEn": "larger in size",
        "meaningPa": "ਵੱਡਾ; ਆਕਾਰ ਵਿੱਚ ਵਧੇਰਾ"
      },
      {
        "word": "smaller",
        "meaningEn": "less in size",
        "meaningPa": "ਛੋਟਾ; ਆਕਾਰ ਵਿੱਚ ਘੱਟ"
      },
      {
        "word": "faster",
        "meaningEn": "more fast",
        "meaningPa": "ਤੇਜ਼; ਹੋਰ ਤੇਜ਼"
      },
      {
        "word": "slower",
        "meaningEn": "more slow",
        "meaningPa": "ਹੌਲਾ; ਹੋਰ ਹੌਲਾ"
      },
      {
        "word": "like",
        "meaningEn": "enjoy or prefer",
        "meaningPa": "ਪਸੰਦ ਕਰਨਾ; ਚੰਗਾ ਲੱਗਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S05",
    "bundleId": 7,
    "orderInBundle": 5,
    "titleEn": "Book 7 · Story 5: How to Make a Sandwich",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 5: ਸੈਂਡਵਿਚ ਕਿਵੇਂ ਬਣਾਉਣਾ",
    "englishStory": "Panel 1 (Intro): Today I want to make a sandwich at home with my mom. I feel ready to follow steps and keep the kitchen clean.\nPanel 2 (Body): First, I wash my hands with soap and water. Next, I take two slices of bread and put them on a plate.\nPanel 3 (Body): Then I spread butter on the bread and add cheese. I add cucumber, and I smile at the fresh smell.\nPanel 4 (Body): Next, I close the sandwich and cut it carefully. Mom says, \"Great job,\" and I clean the table slowly.\nPanel 5 (Conclusion): Finally, I eat my sandwich and feel full. Following steps helps me make food safely and share it kindly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਂ ਨਾਲ ਘਰ ਵਿੱਚ ਸੈਂਡਵਿਚ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਮੈਂ ਕਦਮ ਮੰਨਣ ਅਤੇ ਰਸੋਈ ਸਾਫ਼ ਰੱਖਣ ਲਈ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਸਾਬਣ ਅਤੇ ਪਾਣੀ ਨਾਲ ਹੱਥ ਧੋਦਾ/ਧੋਦੀ ਹਾਂ। ਫਿਰ ਮੈਂ ਰੋਟੀ ਦੇ ਦੋ ਟੁਕੜੇ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ ਅਤੇ ਪਲੇਟ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਰੋਟੀ ਉੱਤੇ ਮੱਖਣ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਅਤੇ ਚੀਜ਼ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਮੈਂ ਖੀਰਾ ਵੀ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ, ਅਤੇ ਤਾਜ਼ੀ ਖੁਸ਼ਬੂ ਨਾਲ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਸੈਂਡਵਿਚ ਬੰਦ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਕੱਟਦਾ/ਕੱਟਦੀ ਹਾਂ। ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਵਧੀਆ ਕੰਮ,\" ਅਤੇ ਮੈਂ ਹੌਲੀ-ਹੌਲੀ ਮੇਜ਼ ਸਾਫ਼ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਆਖਿਰਕਾਰ, ਮੈਂ ਸੈਂਡਵਿਚ ਖਾਂਦਾ/ਖਾਂਦੀ ਹਾਂ ਅਤੇ ਪੇਟ ਭਰਿਆ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਕਦਮ ਮੰਨਣਾ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਖਾਣਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child make? / ਬੱਚਾ ਕੀ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹੈ?",
        "choices": [
          "sandwich / ਸੈਂਡਵਿਚ",
          "kite / ਪਤੰਗ",
          "boat / ਕਿਸ਼ਤੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child wants to make a sandwich. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਸੈਂਡਵਿਚ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "wash hands / ਹੱਥ ਧੋਣਾ",
          "run outside / ਬਾਹਰ ਦੌੜਨਾ",
          "turn off lights / ਬੱਤੀਆਂ ਬੰਦ ਕਰਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says first the child washes hands. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਹੱਥ ਧੋਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child use for the sandwich? / ਸੈਂਡਵਿਚ ਲਈ ਬੱਚਾ ਕੀ ਵਰਤਦਾ/ਵਰਤਦੀ ਹੈ?",
        "choices": [
          "bread slices / ਰੋਟੀ ਦੇ ਟੁਕੜੇ",
          "stones / ਪੱਥਰ",
          "paper / ਕਾਗਜ਼"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child takes two slices of bread. / ਪੈਨਲ 2 ਵਿੱਚ ਰੋਟੀ ਦੇ ਦੋ ਟੁਕੜੇ ਹਨ।"
      },
      {
        "question": "What does the child do next after adding food? / ਖਾਣਾ ਪਾਉਣ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "cut / ਕੱਟਦਾ/ਕੱਟਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "cry / ਰੋਂਦਾ/ਰੋਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the child closes and cuts the sandwich. / ਪੈਨਲ 4 ਵਿੱਚ ਸੈਂਡਵਿਚ ਬੰਦ ਕਰਕੇ ਕੱਟਦਾ/ਕੱਟਦੀ ਹੈ।"
      },
      {
        "question": "Why does following steps help? / ਕਦਮ ਮੰਨਣਾ ਕਿਉਂ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "safe food / ਸੁਰੱਖਿਅਤ ਖਾਣਾ",
          "loud noise / ਉੱਚਾ ਸ਼ੋਰ",
          "cold rain / ਠੰਢਾ ਮੀਂਹ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says steps help make food safely. / ਪੈਨਲ 5 ਵਿੱਚ ਕਦਮ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਖਾਣਾ ਬਣਾਉਂਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "first",
        "meaningEn": "before everything else",
        "meaningPa": "ਪਹਿਲਾਂ; ਸਭ ਤੋਂ ਪਹਿਲਾਂ"
      },
      {
        "word": "next",
        "meaningEn": "the step after now",
        "meaningPa": "ਅਗਲਾ; ਅਗਲਾ ਕਦਮ"
      },
      {
        "word": "then",
        "meaningEn": "after that",
        "meaningPa": "ਫਿਰ; ਉਸ ਤੋਂ ਬਾਅਦ"
      },
      {
        "word": "finally",
        "meaningEn": "at the end",
        "meaningPa": "ਆਖਿਰਕਾਰ; ਅੰਤ ਵਿੱਚ"
      },
      {
        "word": "wash",
        "meaningEn": "clean with water",
        "meaningPa": "ਧੋਣਾ; ਪਾਣੀ ਨਾਲ ਸਾਫ਼ ਕਰਨਾ"
      },
      {
        "word": "bread",
        "meaningEn": "food you can make a sandwich with",
        "meaningPa": "ਰੋਟੀ; ਸੈਂਡਵਿਚ ਲਈ ਖਾਣਾ"
      },
      {
        "word": "spread",
        "meaningEn": "put a soft food on top",
        "meaningPa": "ਲਗਾਉਣਾ; ਉੱਤੇ ਫੈਲਾਉਣਾ"
      },
      {
        "word": "butter",
        "meaningEn": "a soft dairy food you can spread",
        "meaningPa": "ਮੱਖਣ; ਰੋਟੀ ਉੱਤੇ ਲਗਾਉਣ ਵਾਲਾ ਨਰਮ ਖਾਣਾ"
      },
      {
        "word": "cheese",
        "meaningEn": "a dairy food; often yellow or white",
        "meaningPa": "ਚੀਜ਼; ਦੁੱਧ ਤੋਂ ਬਣਿਆ ਖਾਣਾ"
      },
      {
        "word": "clean",
        "meaningEn": "not dirty",
        "meaningPa": "ਸਾਫ਼; ਗੰਦਾ ਨਹੀਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "share",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S06",
    "bundleId": 7,
    "orderInBundle": 6,
    "titleEn": "Book 7 · Story 6: I Disagree Kindly",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 6: ਨਮਰਤਾ ਨਾਲ ਅਸਹਿਮਤ ਹੋਣਾ",
    "englishStory": "Panel 1 (Intro): Today my friend and I choose a game to play. My friend has one idea, and I have a different idea.\nPanel 2 (Body): First, I take a breath and speak politely. I say, \"I disagree, but I respect your idea.\"\nPanel 3 (Body): Next, I say, \"I think this game is better because it is fair.\" My friend listens and says, \"Maybe you are right.\"\nPanel 4 (Body): Then we try a compromise and play both games. We take turns, and we stay calm together.\nPanel 5 (Conclusion): After that, we smile and feel proud of our choice. Kind words help us solve problems and stay friends.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਅਤੇ ਮੇਰਾ ਦੋਸਤ ਖੇਡ ਚੁਣਦੇ ਹਾਂ। ਦੋਸਤ ਦਾ ਇੱਕ ਵਿਚਾਰ ਹੈ, ਅਤੇ ਮੇਰਾ ਵੱਖਰਾ ਵਿਚਾਰ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ ਅਤੇ ਨਮਰਤਾ ਨਾਲ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਸਹਿਮਤ ਨਹੀਂ ਹਾਂ, ਪਰ ਮੈਂ ਤੇਰੇ ਵਿਚਾਰ ਦੀ ਇੱਜ਼ਤ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਇਹ ਖੇਡ ਚੰਗੀ ਹੈ ਕਿਉਂਕਿ ਇਹ ਨਿਆਂਪੂਰਨ ਹੈ।\" ਦੋਸਤ ਸੁਣਦਾ/ਸੁਣਦੀ ਹੈ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ, \"ਸ਼ਾਇਦ ਤੂੰ ਠੀਕ ਹੈਂ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਸਮਝੌਤਾ ਕਰਦੇ ਹਾਂ ਅਤੇ ਦੋਵੇਂ ਖੇਡਾਂ ਖੇਡਦੇ ਹਾਂ। ਅਸੀਂ ਵਾਰੀ-ਵਾਰੀ ਖੇਡਦੇ ਹਾਂ ਅਤੇ ਸ਼ਾਂਤ ਰਹਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਮੁਸਕੁਰਾਉਂਦੇ ਹਾਂ ਅਤੇ ਆਪਣੀ ਚੋਣ ਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦੇ ਹਾਂ। ਨਮਰ ਸ਼ਬਦ ਸਮੱਸਿਆ ਹੱਲ ਕਰਨ ਅਤੇ ਦੋਸਤ ਬਣੇ ਰਹਿਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।",
    "multipleChoiceQuestions": [
      {
        "question": "What problem do they have? / ਉਹਨਾਂ ਦੀ ਸਮੱਸਿਆ ਕੀ ਹੈ?",
        "choices": [
          "different ideas / ਵੱਖਰੇ ਵਿਚਾਰ",
          "lost bag / ਬੈਗ ਗੁੰਮ",
          "broken chair / ਕੁਰਸੀ ਟੁੱਟੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they have different ideas for a game. / ਪੈਨਲ 1 ਵਿੱਚ ਖੇਡ ਲਈ ਵੱਖਰੇ ਵਿਚਾਰ ਹਨ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "breathe / ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹੈ",
          "push / ਧੱਕਾ ਦਿੰਦਾ/ਦਿੰਦੀ ਹੈ",
          "shout / ਚੀਕਦਾ/ਚੀਕਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child takes a breath first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਸਾਹ ਲੈਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "How does the child disagree? / ਬੱਚਾ ਕਿਵੇਂ ਅਸਹਿਮਤ ਹੁੰਦਾ/ਹੁੰਦੀ ਹੈ?",
        "choices": [
          "politely / ਨਮਰਤਾ ਨਾਲ",
          "rudely / ਬਦਤਮੀਜ਼ੀ ਨਾਲ",
          "silently / ਚੁੱਪਚਾਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child speaks politely. / ਪੈਨਲ 2 ਵਿੱਚ ਨਮਰਤਾ ਨਾਲ ਬੋਲਦਾ/ਬੋਲਦੀ ਹੈ।"
      },
      {
        "question": "What do they do next? / ਅਗਲਾ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "compromise / ਸਮਝੌਤਾ",
          "fight / ਲੜਾਈ",
          "leave / ਚਲੇ ਜਾਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they try a compromise and play both games. / ਪੈਨਲ 4 ਵਿੱਚ ਸਮਝੌਤਾ ਕਰਕੇ ਦੋਵੇਂ ਖੇਡਦੇ ਹਨ।"
      },
      {
        "question": "What helps them stay friends? / ਉਹਨਾਂ ਨੂੰ ਦੋਸਤ ਬਣੇ ਰਹਿਣ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "kind words / ਨਮਰ ਸ਼ਬਦ",
          "loud yelling / ਉੱਚੀ ਚੀਕ",
          "hiding / ਲੁਕਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says kind words help them solve the problem. / ਪੈਨਲ 5 ਵਿੱਚ ਨਮਰ ਸ਼ਬਦ ਸਮੱਸਿਆ ਹੱਲ ਕਰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "disagree",
        "meaningEn": "not have the same idea",
        "meaningPa": "ਅਸਹਿਮਤ ਹੋਣਾ; ਸਹਿਮਤ ਨਾ ਹੋਣਾ"
      },
      {
        "word": "kindly",
        "meaningEn": "in a kind and polite way",
        "meaningPa": "ਨਮਰਤਾ ਨਾਲ; ਦਿਆਲੂ ਤਰੀਕੇ ਨਾਲ"
      },
      {
        "word": "polite",
        "meaningEn": "using respectful words",
        "meaningPa": "ਨਮਰ; ਆਦਰ ਵਾਲਾ"
      },
      {
        "word": "respect",
        "meaningEn": "treat someone kindly and fairly",
        "meaningPa": "ਇੱਜ਼ਤ; ਆਦਰ ਨਾਲ ਪੇਸ਼ ਆਉਣਾ"
      },
      {
        "word": "idea",
        "meaningEn": "a thought or plan",
        "meaningPa": "ਵਿਚਾਰ; ਸੋਚ"
      },
      {
        "word": "think",
        "meaningEn": "use your mind to decide",
        "meaningPa": "ਸੋਚਣਾ; ਮਨ ਨਾਲ ਫੈਸਲਾ ਕਰਨਾ"
      },
      {
        "word": "better",
        "meaningEn": "more good",
        "meaningPa": "ਵਧੀਆ; ਹੋਰ ਚੰਗਾ"
      },
      {
        "word": "fair",
        "meaningEn": "everyone gets a turn and rules",
        "meaningPa": "ਨਿਆਂਪੂਰਨ; ਸਭ ਨੂੰ ਬਰਾਬਰ ਮੌਕਾ"
      },
      {
        "word": "compromise",
        "meaningEn": "meet in the middle",
        "meaningPa": "ਸਮਝੌਤਾ; ਵਿਚਕਾਰਲਾ ਹੱਲ"
      },
      {
        "word": "together",
        "meaningEn": "with another person",
        "meaningPa": "ਇਕੱਠੇ; ਨਾਲ ਮਿਲ ਕੇ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "disagree",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S07",
    "bundleId": 7,
    "orderInBundle": 7,
    "titleEn": "Book 7 · Story 7: My Mini Report: Tigers",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 7: ਮੇਰੀ ਛੋਟੀ ਰਿਪੋਰਟ: ਬਾਘ",
    "englishStory": "Panel 1 (Intro): Today I make a mini report for class about a tiger. I want to share facts and speak clearly.\nPanel 2 (Body): First, I say, \"A tiger is a big animal with stripes.\" I point to my picture and look at the audience.\nPanel 3 (Body): Next, I say, \"Tigers live in a forest and can hunt for food.\" I speak slowly, so my friends can learn.\nPanel 4 (Body): Then I add, \"Tigers are strong, but we should protect them.\" My teacher smiles and says, \"Good facts and good care.\"\nPanel 5 (Conclusion): After that, I finish my report and feel proud. Learning facts helps me think, speak, and help animals too.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਲਈ ਬਾਘ ਬਾਰੇ ਇੱਕ ਛੋਟੀ ਰਿਪੋਰਟ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਮੈਂ ਤੱਥ ਸਾਂਝੇ ਕਰਨਾ ਅਤੇ ਸਾਫ਼ ਬੋਲਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਬਾਘ ਧਾਰੀਆਂ ਵਾਲਾ ਵੱਡਾ ਜਾਨਵਰ ਹੁੰਦਾ ਹੈ।\" ਮੈਂ ਤਸਵੀਰ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਦਰਸ਼ਕਾਂ ਵੱਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਬਾਘ ਜੰਗਲ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਖਾਣਾ ਲੱਭਣ ਲਈ ਸ਼ਿਕਾਰ ਕਰ ਸਕਦੇ ਹਨ।\" ਮੈਂ ਹੌਲੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ ਤਾਂ ਜੋ ਦੋਸਤ ਸਿੱਖ ਸਕਣ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਬਾਘ ਮਜ਼ਬੂਤ ਹੁੰਦੇ ਹਨ, ਪਰ ਸਾਨੂੰ ਉਹਨਾਂ ਦੀ ਰੱਖਿਆ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।\" ਟੀਚਰ ਮੁਸਕੁਰਾਉਂਦੇ ਹਨ ਅਤੇ ਕਹਿੰਦੇ ਹਨ, \"ਵਧੀਆ ਤੱਥ ਅਤੇ ਵਧੀਆ ਪਰਵਾਹ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਤੱਥ ਸਿੱਖਣਾ ਸਾਨੂੰ ਸੋਚਣ, ਬੋਲਣ ਅਤੇ ਜਾਨਵਰਾਂ ਦੀ ਮਦਦ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "What animal is the report about? / ਰਿਪੋਰਟ ਕਿਸ ਜਾਨਵਰ ਬਾਰੇ ਹੈ?",
        "choices": [
          "tiger / ਬਾਘ",
          "duck / ਬਤਖ",
          "horse / ਘੋੜਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the report is about a tiger. / ਪੈਨਲ 1 ਵਿੱਚ ਰਿਪੋਰਟ ਬਾਘ ਬਾਰੇ ਹੈ।"
      },
      {
        "question": "What does a tiger have? / ਬਾਘ ਕੋਲ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "stripes / ਧਾਰੀਆਂ",
          "wheels / ਪਹੀਏ",
          "books / ਕਿਤਾਬਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says a tiger has stripes. / ਪੈਨਲ 2 ਵਿੱਚ ਬਾਘ ਦੀਆਂ ਧਾਰੀਆਂ ਹਨ।"
      },
      {
        "question": "Where do tigers live? / ਬਾਘ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹਨ?",
        "choices": [
          "forest / ਜੰਗਲ",
          "ocean / ਸਮੁੰਦਰ",
          "classroom / ਕਲਾਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says tigers live in a forest. / ਪੈਨਲ 3 ਵਿੱਚ ਬਾਘ ਜੰਗਲ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ।"
      },
      {
        "question": "What can tigers do for food? / ਖਾਣੇ ਲਈ ਬਾਘ ਕੀ ਕਰ ਸਕਦੇ ਹਨ?",
        "choices": [
          "hunt / ਸ਼ਿਕਾਰ",
          "paint / ਰੰਗਣਾ",
          "drive / ਗੱਡੀ ਚਲਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says tigers can hunt for food. / ਪੈਨਲ 3 ਵਿੱਚ ਬਾਘ ਸ਼ਿਕਾਰ ਕਰ ਸਕਦੇ ਹਨ।"
      },
      {
        "question": "What should we do for tigers? / ਸਾਨੂੰ ਬਾਘਾਂ ਲਈ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "protect / ਰੱਖਿਆ",
          "ignore / ਅਣਡਿੱਠਾ",
          "scare / ਡਰਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says we should protect them. / ਪੈਨਲ 4 ਵਿੱਚ ਰੱਖਿਆ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "report",
        "meaningEn": "a short talk with facts",
        "meaningPa": "ਰਿਪੋਰਟ; ਤੱਥਾਂ ਵਾਲੀ ਛੋਟੀ ਗੱਲ"
      },
      {
        "word": "fact",
        "meaningEn": "something true",
        "meaningPa": "ਤੱਥ; ਸੱਚੀ ਗੱਲ"
      },
      {
        "word": "animal",
        "meaningEn": "a living creature like a tiger",
        "meaningPa": "ਜਾਨਵਰ; ਜੀਵ"
      },
      {
        "word": "stripes",
        "meaningEn": "long lines of color on fur",
        "meaningPa": "ਧਾਰੀਆਂ; ਰੰਗ ਦੀਆਂ ਲੰਬੀਆਂ ਲਾਈਨਾਂ"
      },
      {
        "word": "forest",
        "meaningEn": "a place with many trees",
        "meaningPa": "ਜੰਗਲ; ਬਹੁਤ ਦਰੱਖਤਾਂ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "hunt",
        "meaningEn": "look for food by chasing",
        "meaningPa": "ਸ਼ਿਕਾਰ ਕਰਨਾ; ਖਾਣਾ ਲੱਭਣਾ"
      },
      {
        "word": "big",
        "meaningEn": "large in size",
        "meaningPa": "ਵੱਡਾ; ਆਕਾਰ ਵਿੱਚ ਵਧੇਰਾ"
      },
      {
        "word": "strong",
        "meaningEn": "having a lot of power",
        "meaningPa": "ਮਜ਼ਬੂਤ; ਤਾਕਤਵਰ"
      },
      {
        "word": "protect",
        "meaningEn": "keep safe from harm",
        "meaningPa": "ਰੱਖਿਆ ਕਰਨਾ; ਸੁਰੱਖਿਅਤ ਰੱਖਣਾ"
      },
      {
        "word": "learn",
        "meaningEn": "get new knowledge",
        "meaningPa": "ਸਿੱਖਣਾ; ਨਵੀਂ ਜਾਣਕਾਰੀ ਲੈਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "share",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S08",
    "bundleId": 7,
    "orderInBundle": 8,
    "titleEn": "Book 7 · Story 8: The Best Playground Game",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 8: ਖੇਡ ਮੈਦਾਨ ਦੀ ਸਭ ਤੋਂ ਵਧੀਆ ਖੇਡ",
    "englishStory": "Panel 1 (Intro): Today our class goes to the playground for recess. We want the best game, and everyone has an idea.\nPanel 2 (Body): First, our teacher says, \"We will vote and follow a rule.\" I say, \"I vote for tag,\" and my friend smiles.\nPanel 3 (Body): Next, we count the votes and check the winner. Two teams cheer, and we agree to play fairly.\nPanel 4 (Body): Then one friend feels sad, so we talk kindly. We say, \"You can play too, and you can be on my team.\"\nPanel 5 (Conclusion): After that, we play the game and have fun together. Voting and fair rules help everyone feel included.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਲਾਸ ਰੀਸੈਸ ਵੇਲੇ ਖੇਡ ਮੈਦਾਨ ਜਾਂਦੀ ਹੈ। ਅਸੀਂ ਸਭ ਤੋਂ ਵਧੀਆ ਖੇਡ ਚਾਹੁੰਦੇ ਹਾਂ, ਅਤੇ ਹਰ ਕਿਸੇ ਦਾ ਇੱਕ ਵਿਚਾਰ ਹੁੰਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਅਸੀਂ ਵੋਟ ਕਰਾਂਗੇ ਅਤੇ ਨਿਯਮ ਮੰਨਿਆਂਗੇ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਟੈਗ ਲਈ ਵੋਟ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ,\" ਅਤੇ ਦੋਸਤ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਵੋਟ ਗਿਣਦੇ ਹਾਂ ਅਤੇ ਜੇਤੂ ਵੇਖਦੇ ਹਾਂ। ਦੋ ਟੀਮਾਂ ਖੁਸ਼ੀ ਨਾਲ ਨਾਅਰਾ ਲਗਾਉਂਦੀਆਂ ਹਨ, ਅਤੇ ਅਸੀਂ ਨਿਆਂ ਨਾਲ ਖੇਡਣ ਤੇ ਸਹਿਮਤ ਹੁੰਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਇੱਕ ਦੋਸਤ ਉਦਾਸ ਹੁੰਦਾ/ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਨਮਰਤਾ ਨਾਲ ਗੱਲ ਕਰਦੇ ਹਾਂ। ਅਸੀਂ ਕਹਿੰਦੇ ਹਾਂ, \"ਤੂੰ ਵੀ ਖੇਡ, ਤੂੰ ਮੇਰੀ ਟੀਮ ਵਿੱਚ ਆ ਜਾ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਖੇਡ ਖੇਡਦੇ ਹਾਂ ਅਤੇ ਇਕੱਠੇ ਮਜ਼ਾ ਕਰਦੇ ਹਾਂ। ਵੋਟ ਅਤੇ ਨਿਆਂਪੂਰਨ ਨਿਯਮ ਸਭ ਨੂੰ ਸ਼ਾਮਲ ਮਹਿਸੂਸ ਕਰਾਉਂਦੇ ਹਨ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go? / ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "playground / ਖੇਡ ਮੈਦਾਨ",
          "hospital / ਹਸਪਤਾਲ",
          "store / ਦੁਕਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they go to the playground. / ਪੈਨਲ 1 ਵਿੱਚ ਖੇਡ ਮੈਦਾਨ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they do first to choose the game? / ਖੇਡ ਚੁਣਨ ਲਈ ਉਹ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "vote / ਵੋਟ",
          "fight / ਲੜਾਈ",
          "hide / ਲੁਕਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they vote to choose. / ਪੈਨਲ 2 ਵਿੱਚ ਵੋਟ ਕਰਕੇ ਚੁਣਦੇ ਹਨ।"
      },
      {
        "question": "What do they count? / ਉਹ ਕੀ ਗਿਣਦੇ ਹਨ?",
        "choices": [
          "votes / ਵੋਟ",
          "clouds / ਬੱਦਲ",
          "shoes / ਜੁੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they count the votes. / ਪੈਨਲ 3 ਵਿੱਚ ਵੋਟ ਗਿਣਦੇ ਹਨ।"
      },
      {
        "question": "How do they play? / ਉਹ ਕਿਵੇਂ ਖੇਡਦੇ ਹਨ?",
        "choices": [
          "fair / ਨਿਆਂ ਨਾਲ",
          "rude / ਬਦਤਮੀਜ਼ੀ ਨਾਲ",
          "angry / ਗੁੱਸੇ ਨਾਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they agree to play fairly. / ਪੈਨਲ 3 ਵਿੱਚ ਨਿਆਂ ਨਾਲ ਖੇਡਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "How do they help the sad friend? / ਉਹ ਉਦਾਸ ਦੋਸਤ ਦੀ ਮਦਦ ਕਿਵੇਂ ਕਰਦੇ ਹਨ?",
        "choices": [
          "invite to team / ਟੀਮ ਵਿੱਚ ਬੁਲਾਉਂਦੇ ਹਨ",
          "ignore / ਅਣਡਿੱਠਾ ਕਰਦੇ ਹਨ",
          "laugh / ਹੱਸਦੇ ਹਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they invite the friend to play on a team. / ਪੈਨਲ 4 ਵਿੱਚ ਦੋਸਤ ਨੂੰ ਟੀਮ ਵਿੱਚ ਬੁਲਾਉਂਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "vote",
        "meaningEn": "choose by picking an option",
        "meaningPa": "ਵੋਟ; ਚੋਣ ਲਈ ਵੋਟ ਪਾਉਣਾ"
      },
      {
        "word": "rule",
        "meaningEn": "something you must follow",
        "meaningPa": "ਨਿਯਮ; ਮੰਨਣ ਵਾਲੀ ਗੱਲ"
      },
      {
        "word": "count",
        "meaningEn": "say numbers in order",
        "meaningPa": "ਗਿਣਣਾ; ਨੰਬਰ ਕਹਿਣਾ"
      },
      {
        "word": "winner",
        "meaningEn": "the one that gets the most votes",
        "meaningPa": "ਜੇਤੂ; ਜੋ ਜਿੱਤੇ"
      },
      {
        "word": "team",
        "meaningEn": "a group that plays together",
        "meaningPa": "ਟੀਮ; ਇਕੱਠੇ ਖੇਡਣ ਵਾਲਾ ਗਰੁੱਪ"
      },
      {
        "word": "agree",
        "meaningEn": "say yes to the same plan",
        "meaningPa": "ਸਹਿਮਤ ਹੋਣਾ; ਇੱਕੋ ਗੱਲ ਤੇ ਹਾਂ"
      },
      {
        "word": "fair",
        "meaningEn": "everyone follows rules and gets a chance",
        "meaningPa": "ਨਿਆਂਪੂਰਨ; ਸਭ ਨੂੰ ਮੌਕਾ"
      },
      {
        "word": "cheer",
        "meaningEn": "shout happily for a team",
        "meaningPa": "ਹੌਸਲਾ ਦੇਣਾ; ਖੁਸ਼ੀ ਨਾਲ ਨਾਅਰਾ"
      },
      {
        "word": "include",
        "meaningEn": "let someone join",
        "meaningPa": "ਸ਼ਾਮਲ ਕਰਨਾ; ਨਾਲ ਜੋੜਨਾ"
      },
      {
        "word": "play",
        "meaningEn": "do a fun game",
        "meaningPa": "ਖੇਡਣਾ; ਮਜ਼ੇ ਵਾਲੀ ਗਤੀਵਿਧੀ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "goes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "count",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "agree",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S09",
    "bundleId": 7,
    "orderInBundle": 9,
    "titleEn": "Book 7 · Story 9: Explaining My Drawing",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 9: ਮੇਰੀ ਡਰਾਇੰਗ ਸਮਝਾਉਣਾ",
    "englishStory": "Panel 1 (Intro): Today I make a drawing in art time at school. My picture has bright color, and I feel excited to describe it.\nPanel 2 (Body): First, I show my drawing and point to the background. I say, \"The sky is blue, and the sun is big.\"\nPanel 3 (Body): Next, I point to the front and describe my family. I say, \"This is my mom, and this is me, smiling.\"\nPanel 4 (Body): Then my friend asks why I chose these color choices. I answer, \"Because they make me feel happy and calm.\"\nPanel 5 (Conclusion): After that, my teacher says my picture tells a story. I smile because my imagination helps me explain clearly.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਵਿੱਚ ਆਰਟ ਟਾਈਮ ਦੌਰਾਨ ਡਰਾਇੰਗ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਮੇਰੀ ਤਸਵੀਰ ਵਿੱਚ ਚਟਖੇਲੇ ਰੰਗ ਹਨ, ਅਤੇ ਮੈਂ ਇਸਨੂੰ ਸਮਝਾਉਣ ਲਈ ਉਤਸਾਹੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਆਪਣੀ ਡਰਾਇੰਗ ਦਿਖਾਂਦਾ/ਦਿਖਾਂਦੀ ਹਾਂ ਅਤੇ ਪਿੱਛੋਕੜ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਆਸਮਾਨ ਨੀਲਾ ਹੈ, ਅਤੇ ਸੂਰਜ ਵੱਡਾ ਹੈ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੱਗੇ ਵਾਲੇ ਹਿੱਸੇ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਆਪਣੇ ਪਰਿਵਾਰ ਬਾਰੇ ਦੱਸਦਾ/ਦੱਸਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ, ਅਤੇ ਇਹ ਮੈਂ ਹਾਂ, ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਦੋਸਤ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ ਕਿ ਮੈਂ ਇਹ ਰੰਗ ਕਿਉਂ ਚੁਣੇ। ਮੈਂ ਜਵਾਬ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ, \"ਕਿਉਂਕਿ ਇਹ ਮੈਨੂੰ ਖੁਸ਼ ਅਤੇ ਸ਼ਾਂਤ ਮਹਿਸੂਸ ਕਰਾਉਂਦੇ ਹਨ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ ਕਿ ਮੇਰੀ ਤਸਵੀਰ ਇੱਕ ਕਹਾਣੀ ਦੱਸਦੀ ਹੈ। ਮੈਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੇਰੀ ਕਲਪਨਾ ਮੈਨੂੰ ਸਾਫ਼ ਸਮਝਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "When does the child draw? / ਬੱਚਾ ਕਦੋਂ ਡਰਾਇੰਗ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹੈ?",
        "choices": [
          "art time / ਆਰਟ ਟਾਈਮ",
          "midnight / ਅੱਧੀ ਰਾਤ",
          "winter only / ਸਿਰਫ਼ ਸਰਦੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child draws in art time. / ਪੈਨਲ 1 ਵਿੱਚ ਆਰਟ ਟਾਈਮ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child describe first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਦੱਸਦਾ/ਦੱਸਦੀ ਹੈ?",
        "choices": [
          "background / ਪਿੱਛੋਕੜ",
          "bus / ਬੱਸ",
          "shoe / ਜੁੱਤਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child points to the background first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਪਿੱਛੋਕੜ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who is in the front of the picture? / ਤਸਵੀਰ ਦੇ ਅੱਗੇ ਕੌਣ ਹੈ?",
        "choices": [
          "family / ਪਰਿਵਾਰ",
          "lion / ਸ਼ੇਰ",
          "robot / ਰੋਬੋਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child describes the family in the front. / ਪੈਨਲ 3 ਵਿੱਚ ਪਰਿਵਾਰ ਬਾਰੇ ਦੱਸਦਾ/ਦੱਸਦੀ ਹੈ।"
      },
      {
        "question": "Why did the child choose these colors? / ਬੱਚੇ ਨੇ ਇਹ ਰੰਗ ਕਿਉਂ ਚੁਣੇ?",
        "choices": [
          "feel happy / ਖੁਸ਼ ਮਹਿਸੂਸ",
          "feel sick / ਬਿਮਾਰ ਮਹਿਸੂਸ",
          "feel angry / ਗੁੱਸਾ ਮਹਿਸੂਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the colors make the child feel happy and calm. / ਪੈਨਲ 4 ਵਿੱਚ ਰੰਗ ਖੁਸ਼ ਅਤੇ ਸ਼ਾਂਤ ਮਹਿਸੂਸ ਕਰਾਉਂਦੇ ਹਨ।"
      },
      {
        "question": "What helps the child explain? / ਬੱਚੇ ਨੂੰ ਸਮਝਾਉਣ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "imagination / ਕਲਪਨਾ",
          "noise / ਸ਼ੋਰ",
          "fear / ਡਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says imagination helps the child explain. / ਪੈਨਲ 5 ਵਿੱਚ ਕਲਪਨਾ ਮਦਦ ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "drawing",
        "meaningEn": "a picture you make with pencil or crayon",
        "meaningPa": "ਡਰਾਇੰਗ; ਬਣਾਈ ਹੋਈ ਤਸਵੀਰ"
      },
      {
        "word": "picture",
        "meaningEn": "an image you can see",
        "meaningPa": "ਤਸਵੀਰ; ਚਿੱਤਰ"
      },
      {
        "word": "color",
        "meaningEn": "red, blue, yellow, and more",
        "meaningPa": "ਰੰਗ; ਲਾਲ, ਨੀਲਾ, ਪੀਲਾ ਆਦਿ"
      },
      {
        "word": "background",
        "meaningEn": "the back part of a picture",
        "meaningPa": "ਪਿੱਛੋਕੜ; ਤਸਵੀਰ ਦਾ ਪਿੱਛਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "front",
        "meaningEn": "the part closest to you",
        "meaningPa": "ਅੱਗੇ; ਨੇੜੇ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "describe",
        "meaningEn": "tell details about something",
        "meaningPa": "ਵਰਣਨ ਕਰਨਾ; ਵੇਰਵਾ ਦੱਸਣਾ"
      },
      {
        "word": "why",
        "meaningEn": "a question word for a reason",
        "meaningPa": "ਕਿਉਂ; ਕਾਰਨ ਪੁੱਛਣ ਵਾਲਾ ਸ਼ਬਦ"
      },
      {
        "word": "feel",
        "meaningEn": "have an emotion",
        "meaningPa": "ਮਹਿਸੂਸ ਕਰਨਾ; ਭਾਵਨਾ ਹੋਣੀ"
      },
      {
        "word": "story",
        "meaningEn": "a tale with events",
        "meaningPa": "ਕਹਾਣੀ; ਘਟਨਾਵਾਂ ਵਾਲੀ ਗੱਲ"
      },
      {
        "word": "imagination",
        "meaningEn": "making pictures in your mind",
        "meaningPa": "ਕਲਪਨਾ; ਮਨ ਵਿੱਚ ਤਸਵੀਰ ਬਣਾਉਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "explain",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B7_S10",
    "bundleId": 7,
    "orderInBundle": 10,
    "titleEn": "Book 7 · Story 10: Helping a New Student",
    "titlePa": "ਕਿਤਾਬ 7 · ਕਹਾਣੀ 10: ਨਵੇਂ ਵਿਦਿਆਰਥੀ ਦੀ ਮਦਦ",
    "englishStory": "Panel 1 (Intro): Today a new student comes to our classroom. The student looks nervous, and I want to help.\nPanel 2 (Body): First, I smile and say, \"Welcome.\" I introduce myself and ask, \"Do you have a question?\"\nPanel 3 (Body): Next, the new student asks for directions to the reading corner. I point and say, \"Walk straight, then turn left.\"\nPanel 4 (Body): Then I say, \"You can sit with me,\" and we open a book together. The new student smiles because they feel safe.\nPanel 5 (Conclusion): After that, we become friends and play at recess. Helping someone new is kind, and it makes our class stronger.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਲਾਸ ਵਿੱਚ ਇੱਕ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਆਉਂਦਾ/ਆਉਂਦੀ ਹੈ। ਉਹ ਘਬਰਾਇਆ/ਘਬਰਾਈ ਲੱਗਦਾ/ਲੱਗਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਸੁਆਗਤ ਹੈ।\" ਮੈਂ ਆਪਣਾ ਪਰਚਿਆ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੇਰਾ ਕੋਈ ਸਵਾਲ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਪੜ੍ਹਨ ਵਾਲੇ ਕੋਨੇ ਦਾ ਰਸਤਾ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ। ਮੈਂ ਇਸ਼ਾਰਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਸਿੱਧੇ ਤੁਰੋ, ਫਿਰ ਖੱਬੇ ਮੁੜੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਤੂੰ ਮੇਰੇ ਨਾਲ ਬੈਠ ਸਕਦਾ/ਸਕਦੀ ਹੈਂ,\" ਅਤੇ ਅਸੀਂ ਇਕੱਠੇ ਕਿਤਾਬ ਖੋਲ੍ਹਦੇ ਹਾਂ। ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਮੁਸਕੁਰਾਉਂਦਾ/ਮੁਸਕੁਰਾਉਂਦੀ ਹੈ ਕਿਉਂਕਿ ਉਹ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਦੋਸਤ ਬਣ ਜਾਂਦੇ ਹਾਂ ਅਤੇ ਰੀਸੈਸ ਵਿੱਚ ਖੇਡਦੇ ਹਾਂ। ਨਵੇਂ ਦੀ ਮਦਦ ਕਰਨੀ ਦਇਆ ਹੈ, ਅਤੇ ਇਸ ਨਾਲ ਕਲਾਸ ਹੋਰ ਮਜ਼ਬੂਤ ਬਣਦੀ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who comes to the classroom? / ਕਲਾਸ ਵਿੱਚ ਕੌਣ ਆਉਂਦਾ/ਆਉਂਦੀ ਹੈ?",
        "choices": [
          "new student / ਨਵਾਂ ਵਿਦਿਆਰਥੀ",
          "bus driver / ਬੱਸ ਡਰਾਈਵਰ",
          "chef / ਰਸੋਈਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says a new student comes to class. / ਪੈਨਲ 1 ਵਿੱਚ ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਆਉਂਦਾ/ਆਉਂਦੀ ਹੈ।"
      },
      {
        "question": "How does the new student look? / ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਕਿਵੇਂ ਲੱਗਦਾ/ਲੱਗਦੀ ਹੈ?",
        "choices": [
          "nervous / ਘਬਰਾਇਆ",
          "sleepy / ਨੀਂਦ ਵਾਲਾ",
          "angry / ਗੁੱਸੇ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the student looks nervous. / ਪੈਨਲ 1 ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਘਬਰਾਇਆ/ਘਬਰਾਈ ਲੱਗਦਾ/ਲੱਗਦੀ ਹੈ।"
      },
      {
        "question": "What does the child say first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "welcome / ਸੁਆਗਤ",
          "go away / ਦੂਰ ਜਾਓ",
          "be quiet / ਚੁੱਪ ਰਹੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child smiles and says welcome. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਸੁਆਗਤ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ।"
      },
      {
        "question": "What does the new student ask for? / ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਕੀ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ?",
        "choices": [
          "directions / ਰਸਤਾ",
          "candy / ਕੈਂਡੀ",
          "rain / ਮੀਂਹ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the student asks for directions to the reading corner. / ਪੈਨਲ 3 ਵਿੱਚ ਪੜ੍ਹਨ ਵਾਲੇ ਕੋਨੇ ਦਾ ਰਸਤਾ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "What happens at the end? / ਅੰਤ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "friends / ਦੋਸਤ",
          "fight / ਲੜਾਈ",
          "lost / ਗੁੰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they become friends. / ਪੈਨਲ 5 ਵਿੱਚ ਉਹ ਦੋਸਤ ਬਣ ਜਾਂਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "new",
        "meaningEn": "not old; just started",
        "meaningPa": "ਨਵਾਂ; ਹੁਣੇ ਆਇਆ"
      },
      {
        "word": "welcome",
        "meaningEn": "a kind greeting for someone new",
        "meaningPa": "ਸੁਆਗਤ; ਨਵਿਆਂ ਲਈ ਪਿਆਰਾ ਸਲਾਮ"
      },
      {
        "word": "introduce",
        "meaningEn": "tell your name to someone",
        "meaningPa": "ਪਰਚਿਆ ਦੇਣਾ; ਆਪਣਾ ਨਾਂ ਦੱਸਣਾ"
      },
      {
        "word": "question",
        "meaningEn": "words you ask to get an answer",
        "meaningPa": "ਸਵਾਲ; ਪੁੱਛਣ ਵਾਲੀ ਗੱਲ"
      },
      {
        "word": "directions",
        "meaningEn": "how to get to a place",
        "meaningPa": "ਰਸਤਾ; ਕਿੱਧਰ ਜਾਣਾ"
      },
      {
        "word": "classroom",
        "meaningEn": "a room where students learn",
        "meaningPa": "ਕਲਾਸ; ਪੜ੍ਹਾਈ ਵਾਲਾ ਕਮਰਾ"
      },
      {
        "word": "help",
        "meaningEn": "do something to support someone",
        "meaningPa": "ਮਦਦ; ਸਹਾਰਾ ਦੇਣਾ"
      },
      {
        "word": "together",
        "meaningEn": "with another person",
        "meaningPa": "ਇਕੱਠੇ; ਨਾਲ ਮਿਲ ਕੇ"
      },
      {
        "word": "friend",
        "meaningEn": "a person you like and trust",
        "meaningPa": "ਦੋਸਤ; ਪਿਆਰਾ ਸਾਥੀ"
      },
      {
        "word": "smile",
        "meaningEn": "a happy face expression",
        "meaningPa": "ਮੁਸਕਾਨ; ਖੁਸ਼ ਚਿਹਰਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "comes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK8_CUSTOM_STORIES = [
  {
    "storyId": "B8_S01",
    "bundleId": 8,
    "orderInBundle": 1,
    "titleEn": "Book 8 · Story 1: Rain or No Rain?",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 1: ਮੀਂਹ ਪਵੇਗਾ ਜਾਂ ਨਹੀਂ?",
    "englishStory": "Panel 1 (Intro): Today I look out the window before school. The sky is gray, and I see big clouds.\nPanel 2 (Body): First, I observe the clouds and notice dark parts. I ask, \"Will it rain today?\"\nPanel 3 (Body): Next, I predict it will rain because the clouds look heavy. I test my plan by packing an umbrella in my bag.\nPanel 4 (Body): Then I walk outside and feel small drops on my hand. The result is rain, so my prediction was right.\nPanel 5 (Conclusion): After that, I open my umbrella and stay dry. I feel proud because I observed, predicted, and stayed ready.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਸਕੂਲ ਤੋਂ ਪਹਿਲਾਂ ਖਿੜਕੀ ਤੋਂ ਬਾਹਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਆਸਮਾਨ ਸਲੇਟੀ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਵੱਡੇ ਬੱਦਲ ਦਿਖਾਈ ਦਿੰਦੇ ਹਨ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਬੱਦਲ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਕਾਲੇ ਹਿੱਸੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਮੀਂਹ ਪਵੇਗਾ ਕਿਉਂਕਿ ਬੱਦਲ ਭਾਰੇ ਲੱਗਦੇ ਹਨ। ਮੈਂ ਯੋਜਨਾ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ ਅਤੇ ਛਤਰੀ ਬੈਗ ਵਿੱਚ ਰੱਖ ਲੈਂਦਾ/ਰੱਖ ਲੈਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਬਾਹਰ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਅਤੇ ਹੱਥ ਉੱਤੇ ਛੋਟੀਆਂ ਬੂੰਦਾਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਮੀਂਹ ਹੈ, ਇਸ ਲਈ ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਠੀਕ ਸੀ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਛਤਰੀ ਖੋਲ੍ਹਦਾ/ਖੋਲ੍ਹਦੀ ਹਾਂ ਅਤੇ ਸੁੱਕਾ/ਸੁੱਕੀ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਵੇਖਿਆ, ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ, ਅਤੇ ਤਿਆਰ ਰਿਹਾ/ਰਹੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child see in the sky? / ਬੱਚਾ ਆਸਮਾਨ ਵਿੱਚ ਕੀ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ?",
        "choices": [
          "clouds / ਬੱਦਲ",
          "fish / ਮੱਛੀ",
          "books / ਕਿਤਾਬਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child sees big clouds. / ਪੈਨਲ 1 ਵਿੱਚ ਵੱਡੇ ਬੱਦਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "observe / ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "run / ਦੌੜਦਾ/ਦੌੜਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child observes the clouds. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਦਲ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "it will rain / ਮੀਂਹ ਪਵੇਗਾ",
          "it will snow / ਬਰਫ਼ ਪਵੇਗੀ",
          "it will be night / ਰਾਤ ਹੋ ਜਾਵੇਗੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child predicts rain. / ਪੈਨਲ 3 ਵਿੱਚ ਮੀਂਹ ਦਾ ਅੰਦਾਜ਼ਾ ਹੈ।"
      },
      {
        "question": "How does the child test the plan? / ਬੱਚਾ ਯੋਜਨਾ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ?",
        "choices": [
          "packs an umbrella / ਛਤਰੀ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ",
          "eats candy / ਕੈਂਡੀ ਖਾਂਦਾ/ਖਾਂਦੀ ਹੈ",
          "jumps high / ਉੱਚਾ ਕੂਦਦਾ/ਕੂਦਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child packs an umbrella to be ready. / ਪੈਨਲ 3 ਵਿੱਚ ਛਤਰੀ ਰੱਖ ਕੇ ਤਿਆਰ ਹੁੰਦਾ/ਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "Why was the prediction right? / ਅੰਦਾਜ਼ਾ ਠੀਕ ਕਿਉਂ ਸੀ?",
        "choices": [
          "because it rained / ਕਿਉਂਕਿ ਮੀਂਹ ਪਿਆ",
          "because it was loud / ਕਿਉਂਕਿ ਸ਼ੋਰ ਸੀ",
          "because it was dark / ਕਿਉਂਕਿ ਹਨੇਰਾ ਸੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the result is rain, so the prediction was right. / ਪੈਨਲ 4 ਵਿੱਚ ਨਤੀਜਾ ਮੀਂਹ ਹੈ, ਇਸ ਲਈ ਅੰਦਾਜ਼ਾ ਠੀਕ ਸੀ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "observe",
        "meaningEn": "look carefully to learn",
        "meaningPa": "ਨਿਰੀਖਣ ਕਰਨਾ; ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ"
      },
      {
        "word": "notice",
        "meaningEn": "see something and pay attention",
        "meaningPa": "ਨੋਟ ਕਰਨਾ; ਧਿਆਨ ਦੇਣਾ"
      },
      {
        "word": "cloud",
        "meaningEn": "a white or gray shape in the sky",
        "meaningPa": "ਬੱਦਲ; ਆਸਮਾਨ ਵਿੱਚ ਧੁੰਦਲਾ ਗੁੱਛ"
      },
      {
        "word": "gray",
        "meaningEn": "a color between black and white",
        "meaningPa": "ਸਲੇਟੀ; ਕਾਲੇ ਤੇ ਚਿੱਟੇ ਵਿਚਕਾਰ ਰੰਗ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਕੀ ਹੋਵੇਗਾ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check what happens",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "result",
        "meaningEn": "what happens in the end",
        "meaningPa": "ਨਤੀਜਾ; ਅੰਤ ਵਿੱਚ ਕੀ ਹੋਇਆ"
      },
      {
        "word": "rain",
        "meaningEn": "water falling from clouds",
        "meaningPa": "ਮੀਂਹ; ਬੱਦਲਾਂ ਤੋਂ ਪਾਣੀ ਡਿੱਗਣਾ"
      },
      {
        "word": "umbrella",
        "meaningEn": "a tool to stay dry in rain",
        "meaningPa": "ਛਤਰੀ; ਮੀਂਹ ਤੋਂ ਬਚਣ ਦੀ ਚੀਜ਼"
      },
      {
        "word": "because",
        "meaningEn": "a word that tells the reason",
        "meaningPa": "ਕਿਉਂਕਿ; ਕਾਰਨ ਦੱਸਣ ਵਾਲਾ ਸ਼ਬਦ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "was",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S02",
    "bundleId": 8,
    "orderInBundle": 2,
    "titleEn": "Book 8 · Story 2: Warm Sun, Cool Shade",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 2: ਧੁੱਪ ਗਰਮ, ਛਾਂ ਠੰਢੀ",
    "englishStory": "Panel 1 (Intro): Today I play outside and see bright sunshine. I also see a shady spot under a tree.\nPanel 2 (Body): First, I observe the sunny spot and the shady spot. I ask, \"Which place feels warmer?\"\nPanel 3 (Body): Next, I predict the sun will feel warmer because it is bright. I test by standing in the sun for a moment, then standing in the shade.\nPanel 4 (Body): Then I compare how my skin feels in both places and notice a difference. The result is the sunny spot feels warmer than the shady spot.\nPanel 5 (Conclusion): After that, I tell my friend, \"Sun is warmer, so shade feels cooler.\" I feel proud because I compared and explained.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਬਾਹਰ ਖੇਡਦਾ/ਖੇਡਦੀ ਹਾਂ ਅਤੇ ਚਮਕੀਲੀ ਧੁੱਪ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਂ ਦਰੱਖਤ ਹੇਠਾਂ ਛਾਂ ਵਾਲੀ ਥਾਂ ਵੀ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਧੁੱਪ ਵਾਲੀ ਅਤੇ ਛਾਂ ਵਾਲੀ ਥਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕਿਹੜੀ ਥਾਂ ਗਰਮ ਲੱਗਦੀ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਧੁੱਪ ਗਰਮ ਹੋਵੇਗੀ ਕਿਉਂਕਿ ਉਹ ਚਮਕਦੀ ਹੈ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਪਹਿਲਾਂ ਧੁੱਪ ਵਿੱਚ ਇਕ ਪਲ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ, ਫਿਰ ਛਾਂ ਵਿੱਚ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਦੋਵੇਂ ਥਾਵਾਂ ਵਿੱਚ ਆਪਣੇ ਸਰੀਰ ਨੂੰ ਕਿਵੇਂ ਲੱਗਦਾ ਹੈ, ਇਹ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਫਰਕ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਧੁੱਪ ਵਾਲੀ ਥਾਂ ਛਾਂ ਵਾਲੀ ਥਾਂ ਨਾਲੋਂ ਗਰਮ ਲੱਗਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਦੋਸਤ ਨੂੰ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਧੁੱਪ ਗਰਮ ਹੈ, ਇਸ ਲਈ ਛਾਂ ਠੰਢੀ ਲੱਗਦੀ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਤੁਲਨਾ ਕਰਕੇ ਸਮਝਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What two places does the child compare? / ਬੱਚਾ ਕਿਹੜੀਆਂ ਦੋ ਥਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "sun and shade / ਧੁੱਪ ਅਤੇ ਛਾਂ",
          "bus and train / ਬੱਸ ਅਤੇ ਰੇਲ",
          "milk and water / ਦੁੱਧ ਅਤੇ ਪਾਣੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story compares a sunny place and a shady place. / ਕਹਾਣੀ ਵਿੱਚ ਧੁੱਪ ਅਤੇ ਛਾਂ ਦੀ ਤੁਲਨਾ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sun is warmer / ਧੁੱਪ ਗਰਮ",
          "shade is louder / ਛਾਂ ਸ਼ੋਰ ਵਾਲੀ",
          "tree is wet / ਦਰੱਖਤ ਭਿੱਜਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the sun will feel warmer. / ਪੈਨਲ 3 ਵਿੱਚ ਧੁੱਪ ਗਰਮ ਹੋਣ ਦਾ ਅੰਦਾਜ਼ਾ ਹੈ।"
      },
      {
        "question": "How does the child test? / ਬੱਚਾ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ?",
        "choices": [
          "stands in both / ਦੋਵੇਂ ਥਾਵਾਂ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹੈ",
          "jumps / ਕੂਦਦਾ/ਕੂਦਦੀ ਹੈ",
          "sings / ਗਾਉਂਦਾ/ਗਾਉਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 tests by standing in the sun and then in the shade. / ਪੈਨਲ 3 ਵਿੱਚ ਧੁੱਪ ਅਤੇ ਛਾਂ ਵਿੱਚ ਖੜ੍ਹ ਕੇ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "sunny is warmer / ਧੁੱਪ ਵਾਲੀ ਗਰਮ",
          "shade is warmer / ਛਾਂ ਗਰਮ",
          "both same / ਦੋਵੇਂ ਇੱਕੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the sunny spot feels warmer. / ਪੈਨਲ 4 ਵਿੱਚ ਧੁੱਪ ਵਾਲੀ ਥਾਂ ਗਰਮ ਲੱਗਦੀ ਹੈ।"
      },
      {
        "question": "Why does shade feel cooler? / ਛਾਂ ਠੰਢੀ ਕਿਉਂ ਲੱਗਦੀ ਹੈ?",
        "choices": [
          "because sun is warmer / ਕਿਉਂਕਿ ਧੁੱਪ ਗਰਮ",
          "because rain falls / ਕਿਉਂਕਿ ਮੀਂਹ ਪੈਂਦਾ",
          "because shoes are soft / ਕਿਉਂਕਿ ਜੁੱਤੇ ਨਰਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child explains shade feels cooler because sun is warmer. / ਬੱਚਾ ਦੱਸਦਾ/ਦੱਸਦੀ ਹੈ ਕਿ ਧੁੱਪ ਗਰਮ ਹੈ ਇਸ ਲਈ ਛਾਂ ਠੰਢੀ ਲੱਗਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "sun",
        "meaningEn": "the bright light in the sky",
        "meaningPa": "ਸੂਰਜ; ਆਸਮਾਨ ਦੀ ਰੌਸ਼ਨੀ"
      },
      {
        "word": "shade",
        "meaningEn": "a cool dark place away from sun",
        "meaningPa": "ਛਾਂ; ਧੁੱਪ ਤੋਂ ਦੂਰ ਠੰਢੀ ਥਾਂ"
      },
      {
        "word": "warm",
        "meaningEn": "not cold; a little hot",
        "meaningPa": "ਗਰਮ; ਠੰਢਾ ਨਹੀਂ"
      },
      {
        "word": "cool",
        "meaningEn": "a little cold",
        "meaningPa": "ਠੰਢਾ; ਹਲਕਾ ਠੰਢਾ"
      },
      {
        "word": "compare",
        "meaningEn": "see what is same and different",
        "meaningPa": "ਤੁਲਨਾ ਕਰਨਾ; ਫਰਕ ਵੇਖਣਾ"
      },
      {
        "word": "difference",
        "meaningEn": "how things are not the same",
        "meaningPa": "ਫਰਕ; ਇੱਕੋ ਜਿਹਾ ਨਾ ਹੋਣਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਸੋਚਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after the test",
        "meaningPa": "ਨਤੀਜਾ; ਟੈਸਟ ਤੋਂ ਬਾਅਦ ਜੋ ਹੋਇਆ"
      },
      {
        "word": "warmer",
        "meaningEn": "more warm",
        "meaningPa": "ਹੋਰ ਗਰਮ; ਵਧੇਰੇ ਗਰਮੀ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "play",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S03",
    "bundleId": 8,
    "orderInBundle": 3,
    "titleEn": "Book 8 · Story 3: Wind Test with Paper",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 3: ਕਾਗਜ਼ ਨਾਲ ਹਵਾ ਦਾ ਟੈਸਟ",
    "englishStory": "Panel 1 (Intro): Today the wind blows outside, and my hair moves. I hold a paper and a small cardboard piece.\nPanel 2 (Body): First, I observe the wind and notice it is strong. I ask, \"Which one will move more in the wind?\"\nPanel 3 (Body): Next, I predict the paper will move more because it is lighter. I test by holding both up and letting the wind push them.\nPanel 4 (Body): Then I watch carefully and compare the movement. The result is the paper flaps more than the cardboard.\nPanel 5 (Conclusion): After that, I tell my friend, \"Light things move more in wind.\" I feel proud because I predicted and tested.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਬਾਹਰ ਹਵਾ ਚੱਲਦੀ ਹੈ, ਅਤੇ ਮੇਰੇ ਵਾਲ ਹਿਲਦੇ ਹਨ। ਮੇਰੇ ਹੱਥ ਵਿੱਚ ਇੱਕ ਕਾਗਜ਼ ਅਤੇ ਇੱਕ ਛੋਟਾ ਗੱਤਾ ਹੁੰਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਹਵਾ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਹਵਾ ਤੇਜ਼ ਹੈ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਹਵਾ ਵਿੱਚ ਕਿਹੜੀ ਚੀਜ਼ ਵਧੇਰੇ ਹਿਲੇਗੀ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਕਾਗਜ਼ ਵਧੇਰੇ ਹਿਲੇਗਾ ਕਿਉਂਕਿ ਉਹ ਹਲਕਾ ਹੈ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਦੋਵੇਂ ਉੱਪਰ ਕਰਕੇ ਹਵਾ ਨੂੰ ਧੱਕਣ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਹਿਲਣ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਕਾਗਜ਼ ਗੱਤੇ ਨਾਲੋਂ ਵਧੇਰੇ ਫੜਫੜਾਉਂਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਦੋਸਤ ਨੂੰ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹਲਕੀਆਂ ਚੀਜ਼ਾਂ ਹਵਾ ਵਿੱਚ ਵਧੇਰੇ ਹਿਲਦੀਆਂ ਹਨ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ ਅਤੇ ਅਜ਼ਮਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What two things does the child use? / ਬੱਚਾ ਕਿਹੜੀਆਂ ਦੋ ਚੀਜ਼ਾਂ ਵਰਤਦਾ/ਵਰਤਦੀ ਹੈ?",
        "choices": [
          "paper and cardboard / ਕਾਗਜ਼ ਤੇ ਗੱਤਾ",
          "spoon and fork / ਚਮਚਾ ਤੇ ਕਾਂਟਾ",
          "shoe and hat / ਜੁੱਤਾ ਤੇ ਟੋਪੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child has paper and cardboard. / ਪੈਨਲ 1 ਵਿੱਚ ਕਾਗਜ਼ ਅਤੇ ਗੱਤਾ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "paper moves more / ਕਾਗਜ਼ ਵਧੇਰੇ ਹਿਲੇਗਾ",
          "cardboard melts / ਗੱਤਾ ਪਿਘਲੇਗਾ",
          "wind stops / ਹਵਾ ਰੁਕ ਜਾਵੇਗੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the paper will move more. / ਪੈਨਲ 3 ਵਿੱਚ ਕਾਗਜ਼ ਵਧੇਰੇ ਹਿਲੇਗਾ।"
      },
      {
        "question": "Why does the child predict paper moves more? / ਬੱਚਾ ਕਾਗਜ਼ ਵਧੇਰੇ ਕਿਉਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "because it is lighter / ਕਿਉਂਕਿ ਹਲਕਾ ਹੈ",
          "because it is loud / ਕਿਉਂਕਿ ਸ਼ੋਰ ਹੈ",
          "because it is wet / ਕਿਉਂਕਿ ਭਿੱਜਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says paper is lighter. / ਪੈਨਲ 3 ਵਿੱਚ ਕਾਗਜ਼ ਹਲਕਾ ਹੈ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "paper flaps more / ਕਾਗਜ਼ ਵਧੇਰੇ ਫੜਫੜਾਉਂਦਾ",
          "cardboard flaps more / ਗੱਤਾ ਵਧੇਰੇ ਫੜਫੜਾਉਂਦਾ",
          "both same / ਦੋਵੇਂ ਇੱਕੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says paper flaps more than cardboard. / ਪੈਨਲ 4 ਵਿੱਚ ਕਾਗਜ਼ ਵਧੇਰੇ ਫੜਫੜਾਉਂਦਾ ਹੈ।"
      },
      {
        "question": "What does the child learn? / ਬੱਚਾ ਕੀ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹੈ?",
        "choices": [
          "light things move more / ਹਲਕੀਆਂ ਚੀਜ਼ਾਂ ਵਧੇਰੇ ਹਿਲਦੀਆਂ",
          "trees are loud / ਦਰੱਖਤ ਸ਼ੋਰ ਕਰਦੇ",
          "books fly / ਕਿਤਾਬਾਂ ਉੱਡਦੀਆਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says light things move more in wind. / ਪੈਨਲ 5 ਵਿੱਚ ਹਲਕੀਆਂ ਚੀਜ਼ਾਂ ਵਧੇਰੇ ਹਿਲਦੀਆਂ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "wind",
        "meaningEn": "moving air outside",
        "meaningPa": "ਹਵਾ; ਚੱਲਦੀ ਹਵਾ"
      },
      {
        "word": "blow",
        "meaningEn": "air moves strongly",
        "meaningPa": "ਵਗਣਾ; ਹਵਾ ਚੱਲਣਾ"
      },
      {
        "word": "paper",
        "meaningEn": "thin sheets used for writing",
        "meaningPa": "ਕਾਗਜ਼; ਪਤਲਾ ਪੱਤਾ"
      },
      {
        "word": "cardboard",
        "meaningEn": "thick paper material",
        "meaningPa": "ਗੱਤਾ; ਮੋਟਾ ਕਾਗਜ਼"
      },
      {
        "word": "light",
        "meaningEn": "not heavy",
        "meaningPa": "ਹਲਕਾ; ਭਾਰੀ ਨਹੀਂ"
      },
      {
        "word": "heavy",
        "meaningEn": "not light",
        "meaningPa": "ਭਾਰੀ; ਹਲਕਾ ਨਹੀਂ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "compare",
        "meaningEn": "see which is more or less",
        "meaningPa": "ਤੁਲਨਾ; ਕਿਹੜਾ ਵਧੇਰਾ/ਘੱਟ"
      },
      {
        "word": "result",
        "meaningEn": "what happens in the end",
        "meaningPa": "ਨਤੀਜਾ; ਆਖਿਰ ਕੀ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S04",
    "bundleId": 8,
    "orderInBundle": 4,
    "titleEn": "Book 8 · Story 4: Shadow Changes",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 4: ਛਾਂ ਕਿਵੇਂ ਬਦਲਦੀ ਹੈ",
    "englishStory": "Panel 1 (Intro): Today I stand in the sun and see my shadow on the ground. It looks long, and I feel curious.\nPanel 2 (Body): First, I observe my shadow in the morning and notice it is long. I ask, \"Will my shadow change later?\"\nPanel 3 (Body): Next, I predict my shadow will be shorter at noon because the sun is higher. I test by checking again after lunch.\nPanel 4 (Body): Then I compare my shadow and notice a big change. The result is my shadow is shorter than before.\nPanel 5 (Conclusion): After that, I say, \"The sun changes shadows, so shadows change too.\" I feel proud because I observed and compared.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਧੁੱਪ ਵਿੱਚ ਖੜ੍ਹਦਾ/ਖੜ੍ਹਦੀ ਹਾਂ ਅਤੇ ਆਪਣੀ ਛਾਂ ਜ਼ਮੀਨ ਉੱਤੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਉਹ ਲੰਬੀ ਲੱਗਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਜਿਗਿਆਸੂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਸਵੇਰੇ ਆਪਣੀ ਛਾਂ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਉਹ ਲੰਬੀ ਹੈ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਬਾਅਦ ਵਿੱਚ ਮੇਰੀ ਛਾਂ ਬਦਲੇਗੀ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਦੁਪਹਿਰ ਨੂੰ ਛਾਂ ਛੋਟੀ ਹੋਵੇਗੀ ਕਿਉਂਕਿ ਸੂਰਜ ਉੱਚਾ ਹੁੰਦਾ ਹੈ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ ਅਤੇ ਲੰਚ ਤੋਂ ਬਾਅਦ ਫਿਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਵੱਡਾ ਫਰਕ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਛਾਂ ਪਹਿਲਾਂ ਨਾਲੋਂ ਛੋਟੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਸੂਰਜ ਛਾਂ ਨੂੰ ਬਦਲਦਾ ਹੈ, ਇਸ ਲਈ ਛਾਂ ਵੀ ਬਦਲਦੀ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਵੇਖਿਆ ਅਤੇ ਤੁਲਨਾ ਕੀਤੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child observe? / ਬੱਚਾ ਕੀ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ?",
        "choices": [
          "shadow / ਛਾਂ",
          "snow / ਬਰਫ਼",
          "cake / ਕੇਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story is about the child observing a shadow. / ਕਹਾਣੀ ਵਿੱਚ ਛਾਂ ਵੇਖਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "When is the shadow long? / ਛਾਂ ਕਦੋਂ ਲੰਬੀ ਹੁੰਦੀ ਹੈ?",
        "choices": [
          "morning / ਸਵੇਰੇ",
          "midnight / ਅੱਧੀ ਰਾਤ",
          "inside / ਅੰਦਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the shadow is long in the morning. / ਪੈਨਲ 2 ਵਿੱਚ ਸਵੇਰੇ ਛਾਂ ਲੰਬੀ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "shadow shorter / ਛਾਂ ਛੋਟੀ",
          "shadow louder / ਛਾਂ ਸ਼ੋਰ ਵਾਲੀ",
          "shadow wet / ਛਾਂ ਭਿੱਜੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the shadow will be shorter later. / ਪੈਨਲ 3 ਵਿੱਚ ਛਾਂ ਛੋਟੀ ਹੋਣ ਦਾ ਅੰਦਾਜ਼ਾ ਹੈ।"
      },
      {
        "question": "How does the child test the prediction? / ਬੱਚਾ ਅੰਦਾਜ਼ਾ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ?",
        "choices": [
          "checks again / ਫਿਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ",
          "runs away / ਭੱਜ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ",
          "sleeps / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child checks again after lunch. / ਪੈਨਲ 3 ਵਿੱਚ ਲੰਚ ਤੋਂ ਬਾਅਦ ਫਿਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "shorter shadow / ਛੋਟੀ ਛਾਂ",
          "longer shadow / ਲੰਬੀ ਛਾਂ",
          "no shadow / ਛਾਂ ਨਹੀਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the shadow becomes shorter than before. / ਪੈਨਲ 4 ਵਿੱਚ ਛਾਂ ਪਹਿਲਾਂ ਨਾਲੋਂ ਛੋਟੀ ਹੋ ਜਾਂਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "shadow",
        "meaningEn": "a dark shape made by light",
        "meaningPa": "ਛਾਂ; ਰੌਸ਼ਨੀ ਨਾਲ ਬਣੀ ਕਾਲੀ ਆਕ੍ਰਿਤੀ"
      },
      {
        "word": "morning",
        "meaningEn": "early part of the day",
        "meaningPa": "ਸਵੇਰ; ਦਿਨ ਦਾ ਸ਼ੁਰੂ"
      },
      {
        "word": "noon",
        "meaningEn": "middle of the day",
        "meaningPa": "ਦੁਪਹਿਰ; ਦਿਨ ਦਾ ਵਿਚਕਾਰ"
      },
      {
        "word": "higher",
        "meaningEn": "more up",
        "meaningPa": "ਉੱਚਾ; ਹੋਰ ਉੱਪਰ"
      },
      {
        "word": "shorter",
        "meaningEn": "less long",
        "meaningPa": "ਛੋਟਾ; ਲੰਬਾ ਨਹੀਂ"
      },
      {
        "word": "long",
        "meaningEn": "not short",
        "meaningPa": "ਲੰਬਾ; ਛੋਟਾ ਨਹੀਂ"
      },
      {
        "word": "observe",
        "meaningEn": "look carefully",
        "meaningPa": "ਨਿਰੀਖਣ ਕਰਨਾ; ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਸੋਚਣਾ"
      },
      {
        "word": "compare",
        "meaningEn": "see what is different",
        "meaningPa": "ਤੁਲਨਾ ਕਰਨਾ; ਫਰਕ ਵੇਖਣਾ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਬਾਅਦ ਵਿੱਚ ਕੀ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "be",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S05",
    "bundleId": 8,
    "orderInBundle": 5,
    "titleEn": "Book 8 · Story 5: Seed in a Cup",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 5: ਕੱਪ ਵਿੱਚ ਬੀਜ",
    "englishStory": "Panel 1 (Intro): Today I plant a seed in a small cup for a class project. I feel curious and ready to learn.\nPanel 2 (Body): First, I put soil in the cup and make a small hole. I observe the seed and notice it is tiny.\nPanel 3 (Body): Next, I predict the seed will sprout because it has water and light. I test by watering a little and placing it near a window.\nPanel 4 (Body): Then I check each day and compare what I see. The result is a small sprout comes up after a few days.\nPanel 5 (Conclusion): After that, I say, \"Seeds grow step by step.\" I feel proud because I observed, tested, and saw results.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਕਲਾਸ ਪ੍ਰੋਜੈਕਟ ਲਈ ਇੱਕ ਛੋਟੇ ਕੱਪ ਵਿੱਚ ਬੀਜ ਲਾਂਦਾ/ਲਾਂਦੀ ਹਾਂ। ਮੈਂ ਜਿਗਿਆਸੂ ਅਤੇ ਸਿੱਖਣ ਲਈ ਤਿਆਰ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਕੱਪ ਵਿੱਚ ਮਿੱਟੀ ਪਾਂਦਾ/ਪਾਂਦੀ ਹਾਂ ਅਤੇ ਛੋਟਾ ਛੇਦ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ। ਮੈਂ ਬੀਜ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਉਹ ਬਹੁਤ ਨਿੱਕਾ ਹੈ।\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਬੀਜ ਅੰਕੁਰ ਕੱਢੇਗਾ ਕਿਉਂਕਿ ਉਸਨੂੰ ਪਾਣੀ ਅਤੇ ਰੌਸ਼ਨੀ ਮਿਲੇਗੀ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਥੋੜ੍ਹਾ ਪਾਣੀ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ ਅਤੇ ਕੱਪ ਨੂੰ ਖਿੜਕੀ ਕੋਲ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਹਰ ਰੋਜ਼ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਬਦਲਾਅ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਕੁਝ ਦਿਨਾਂ ਬਾਅਦ ਛੋਟਾ ਅੰਕੁਰ ਨਿਕਲ ਆਉਂਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਬੀਜ ਕਦਮ-ਕਦਮ ਵਧਦਾ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਵੇਖਿਆ, ਅਜ਼ਮਾਇਆ, ਅਤੇ ਨਤੀਜਾ ਵੇਖਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What does the child plant? / ਬੱਚਾ ਕੀ ਲਾਂਦਾ/ਲਾਂਦੀ ਹੈ?",
        "choices": [
          "seed / ਬੀਜ",
          "stone / ਪੱਥਰ",
          "coin / ਸਿੱਕਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child plants a seed. / ਪੈਨਲ 1 ਵਿੱਚ ਬੀਜ ਲਾਂਦਾ/ਲਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What goes in the cup first? / ਕੱਪ ਵਿੱਚ ਪਹਿਲਾਂ ਕੀ ਜਾਂਦਾ ਹੈ?",
        "choices": [
          "soil / ਮਿੱਟੀ",
          "juice / ਜੂਸ",
          "sandwich / ਸੈਂਡਵਿਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child puts soil in the cup first. / ਪੈਨਲ 2 ਵਿੱਚ ਪਹਿਲਾਂ ਮਿੱਟੀ ਪਾਂਦਾ/ਪਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sprout / ਅੰਕੁਰ ਨਿਕਲੇਗਾ",
          "freeze / ਜਮ ਜਾਵੇਗਾ",
          "fly / ਉੱਡ ਜਾਵੇਗਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the seed will sprout. / ਪੈਨਲ 3 ਵਿੱਚ ਅੰਕੁਰ ਨਿਕਲਣ ਦਾ ਅੰਦਾਜ਼ਾ ਹੈ।"
      },
      {
        "question": "How does the child test growth? / ਬੱਚਾ ਵਧਣ ਨੂੰ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ?",
        "choices": [
          "water and window / ਪਾਣੀ ਤੇ ਖਿੜਕੀ ਕੋਲ",
          "hide it / ਲੁਕਾਉਣਾ",
          "shake it / ਹਿਲਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child waters and places it near a window. / ਪੈਨਲ 3 ਵਿੱਚ ਪਾਣੀ ਦੇ ਕੇ ਖਿੜਕੀ ਕੋਲ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ।"
      },
      {
        "question": "What is the result after a few days? / ਕੁਝ ਦਿਨਾਂ ਬਾਅਦ ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "sprout / ਅੰਕੁਰ",
          "toy / ਖਿਡੌਣਾ",
          "rain / ਮੀਂਹ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says a small sprout comes up. / ਪੈਨਲ 4 ਵਿੱਚ ਛੋਟਾ ਅੰਕੁਰ ਨਿਕਲਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "seed",
        "meaningEn": "a tiny start of a plant",
        "meaningPa": "ਬੀਜ; ਪੌਦੇ ਦੀ ਸ਼ੁਰੂਆਤ"
      },
      {
        "word": "soil",
        "meaningEn": "dirt where plants grow",
        "meaningPa": "ਮਿੱਟੀ; ਜਿੱਥੇ ਪੌਦੇ ਉੱਗਦੇ ਹਨ"
      },
      {
        "word": "sprout",
        "meaningEn": "a baby plant coming out",
        "meaningPa": "ਅੰਕੁਰ; ਨਵਾਂ ਪੌਦਾ ਨਿਕਲਣਾ"
      },
      {
        "word": "water",
        "meaningEn": "a liquid plants need",
        "meaningPa": "ਪਾਣੀ; ਪੌਦੇ ਲਈ ਜ਼ਰੂਰੀ"
      },
      {
        "word": "light",
        "meaningEn": "brightness from sun or lamp",
        "meaningPa": "ਰੌਸ਼ਨੀ; ਚਾਨਣ"
      },
      {
        "word": "window",
        "meaningEn": "glass opening in a wall",
        "meaningPa": "ਖਿੜਕੀ; ਕੰਧ ਦਾ ਕੱਚ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to see what happens",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after the test",
        "meaningPa": "ਨਤੀਜਾ; ਅੰਤ ਵਿੱਚ ਜੋ ਹੋਇਆ"
      },
      {
        "word": "compare",
        "meaningEn": "look for changes",
        "meaningPa": "ਤੁਲਨਾ; ਬਦਲਾਅ ਵੇਖਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "comes",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S06",
    "bundleId": 8,
    "orderInBundle": 6,
    "titleEn": "Book 8 · Story 6: What Plants Need",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 6: ਪੌਦਿਆਂ ਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ",
    "englishStory": "Panel 1 (Intro): Today I have two small plants at home. I want to learn what plants need to grow well.\nPanel 2 (Body): First, I observe both plants and notice they look the same. I ask, \"What happens if one plant gets less light?\"\nPanel 3 (Body): Next, I predict the plant with less light will grow slower because it needs sun. I test by placing one plant near a window and one in a dim corner.\nPanel 4 (Body): Then I check after a short time and compare the leaves. The result is the window plant looks healthier than the corner plant.\nPanel 5 (Conclusion): After that, I say, \"Plants need light and water, so we should care for them.\" I feel proud because I tested and learned.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੇਰੇ ਘਰ ਵਿੱਚ ਦੋ ਛੋਟੇ ਪੌਦੇ ਹਨ। ਮੈਂ ਸਿੱਖਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ ਕਿ ਪੌਦਿਆਂ ਨੂੰ ਚੰਗਾ ਵਧਣ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਦੋਵੇਂ ਪੌਦੇ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਦੋਵੇਂ ਇੱਕੋ ਜਿਹੇ ਲੱਗਦੇ ਹਨ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਜੇ ਇੱਕ ਪੌਦੇ ਨੂੰ ਘੱਟ ਰੌਸ਼ਨੀ ਮਿਲੇ ਤਾਂ ਕੀ ਹੋਵੇਗਾ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਘੱਟ ਰੌਸ਼ਨੀ ਵਾਲਾ ਪੌਦਾ ਹੌਲੀ ਵਧੇਗਾ ਕਿਉਂਕਿ ਉਸਨੂੰ ਧੁੱਪ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਇੱਕ ਪੌਦਾ ਖਿੜਕੀ ਕੋਲ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ ਅਤੇ ਇੱਕ ਮੱਧਮ ਰੌਸ਼ਨੀ ਵਾਲੇ ਕੋਨੇ ਵਿੱਚ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਬਾਅਦ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਪੱਤਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਖਿੜਕੀ ਵਾਲਾ ਪੌਦਾ ਕੋਨੇ ਵਾਲੇ ਨਾਲੋਂ ਵਧੇਰੇ ਤੰਦਰੁਸਤ ਲੱਗਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਪੌਦਿਆਂ ਨੂੰ ਰੌਸ਼ਨੀ ਅਤੇ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ਸਾਨੂੰ ਧਿਆਨ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਅਜ਼ਮਾਇਆ ਅਤੇ ਸਿੱਖਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "How many plants does the child have? / ਬੱਚੇ ਕੋਲ ਕਿੰਨੇ ਪੌਦੇ ਹਨ?",
        "choices": [
          "two / ਦੋ",
          "one / ਇੱਕ",
          "five / ਪੰਜ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child has two plants. / ਪੈਨਲ 1 ਵਿੱਚ ਦੋ ਪੌਦੇ ਹਨ।"
      },
      {
        "question": "What does the child change in the test? / ਟੈਸਟ ਵਿੱਚ ਬੱਚਾ ਕੀ ਬਦਲਦਾ/ਬਦਲਦੀ ਹੈ?",
        "choices": [
          "light / ਰੌਸ਼ਨੀ",
          "music / ਗਾਣਾ",
          "shoes / ਜੁੱਤੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 changes how much light the plants get. / ਪੈਨਲ 3 ਵਿੱਚ ਰੌਸ਼ਨੀ ਘੱਟ-ਵੱਧ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "less light grows slower / ਘੱਟ ਰੌਸ਼ਨੀ ਹੌਲੀ",
          "less light grows faster / ਘੱਟ ਰੌਸ਼ਨੀ ਤੇਜ਼",
          "less light makes ice / ਘੱਟ ਰੌਸ਼ਨੀ ਬਰਫ਼"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the less-light plant will grow slower. / ਪੈਨਲ 3 ਵਿੱਚ ਘੱਟ ਰੌਸ਼ਨੀ ਵਾਲਾ ਹੌਲੀ ਵਧੇਗਾ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "window plant healthier / ਖਿੜਕੀ ਵਾਲਾ ਤੰਦਰੁਸਤ",
          "corner plant healthier / ਕੋਨੇ ਵਾਲਾ ਤੰਦਰੁਸਤ",
          "both dead / ਦੋਵੇਂ ਮਰ ਗਏ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the window plant looks healthier. / ਪੈਨਲ 4 ਵਿੱਚ ਖਿੜਕੀ ਵਾਲਾ ਤੰਦਰੁਸਤ ਲੱਗਦਾ ਹੈ।"
      },
      {
        "question": "Why should we care for plants? / ਪੌਦਿਆਂ ਦੀ ਸੰਭਾਲ ਕਿਉਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
        "choices": [
          "because they need light and water / ਕਿਉਂਕਿ ਰੌਸ਼ਨੀ ਤੇ ਪਾਣੀ",
          "because they are loud / ਕਿਉਂਕਿ ਸ਼ੋਰ",
          "because they are toys / ਕਿਉਂਕਿ ਖਿਡੌਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says plants need light and water, so we should care. / ਪੈਨਲ 5 ਵਿੱਚ ਰੌਸ਼ਨੀ ਤੇ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ਸੰਭਾਲ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "plant",
        "meaningEn": "a living thing that grows in soil",
        "meaningPa": "ਪੌਦਾ; ਮਿੱਟੀ ਵਿੱਚ ਉੱਗਣ ਵਾਲਾ ਜੀਵ"
      },
      {
        "word": "need",
        "meaningEn": "must have to grow or live",
        "meaningPa": "ਲੋੜ; ਚਾਹੀਦਾ ਹੋਣਾ"
      },
      {
        "word": "light",
        "meaningEn": "brightness from the sun",
        "meaningPa": "ਰੌਸ਼ਨੀ; ਚਾਨਣ"
      },
      {
        "word": "dim",
        "meaningEn": "not very bright",
        "meaningPa": "ਮੱਧਮ; ਘੱਟ ਚਾਨਣ"
      },
      {
        "word": "healthier",
        "meaningEn": "more healthy",
        "meaningPa": "ਵਧੇਰੇ ਤੰਦਰੁਸਤ; ਹੋਰ ਚੰਗਾ"
      },
      {
        "word": "slower",
        "meaningEn": "not fast",
        "meaningPa": "ਹੌਲਾ; ਤੇਜ਼ ਨਹੀਂ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਸੋਚਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to find out",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਪਤਾ ਲਗਾਉਣਾ"
      },
      {
        "word": "compare",
        "meaningEn": "look for differences",
        "meaningPa": "ਤੁਲਨਾ; ਫਰਕ ਵੇਖਣਾ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਅਖੀਰ ਜੋ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "need",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "grow",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S07",
    "bundleId": 8,
    "orderInBundle": 7,
    "titleEn": "Book 8 · Story 7: Sink or Float Again",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 7: ਡੁੱਬਦਾ ਜਾਂ ਤਰਦਾ ਫਿਰ",
    "englishStory": "Panel 1 (Intro): Today we do a sink or float test with a bowl of water. I feel excited to try new objects.\nPanel 2 (Body): First, I observe the objects and notice some are heavy and some are light. I ask, \"Which ones will float?\"\nPanel 3 (Body): Next, I predict the coin will sink because it is heavy. I also predict the sponge will float because it is light.\nPanel 4 (Body): Then we test by placing each object in water and watching closely. The result is the coin sinks, and the sponge floats.\nPanel 5 (Conclusion): After that, I explain, \"Heavy things often sink, so light things often float.\" I feel proud because I predicted and tested.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਪਾਣੀ ਵਾਲੀ ਕਟੋਰੀ ਨਾਲ ਡੁੱਬਣ ਜਾਂ ਤਰਨ ਦਾ ਟੈਸਟ ਕਰਦੇ ਹਾਂ। ਮੈਂ ਨਵੀਆਂ ਚੀਜ਼ਾਂ ਅਜ਼ਮਾਉਣ ਲਈ ਉਤਸਾਹੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਚੀਜ਼ਾਂ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਕੁਝ ਭਾਰੀਆਂ ਹਨ ਅਤੇ ਕੁਝ ਹਲਕੀਆਂ ਹਨ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕਿਹੜੀਆਂ ਤਰਣਗੀਆਂ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਸਿੱਕਾ ਡੁੱਬੇਗਾ ਕਿਉਂਕਿ ਉਹ ਭਾਰੀ ਹੈ। ਮੈਂ ਇਹ ਵੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਸਪੰਜ ਤਰੇਗਾ ਕਿਉਂਕਿ ਉਹ ਹਲਕਾ ਹੈ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਹਰ ਚੀਜ਼ ਨੂੰ ਪਾਣੀ ਵਿੱਚ ਰੱਖ ਕੇ ਧਿਆਨ ਨਾਲ ਵੇਖਦੇ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਸਿੱਕਾ ਡੁੱਬਦਾ ਹੈ ਅਤੇ ਸਪੰਜ ਤਰਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ, \"ਭਾਰੀ ਚੀਜ਼ਾਂ ਅਕਸਰ ਡੁੱਬਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਹਲਕੀਆਂ ਚੀਜ਼ਾਂ ਅਕਸਰ ਤਰਦੀਆਂ ਹਨ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ ਅਤੇ ਅਜ਼ਮਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What do they use for the test? / ਟੈਸਟ ਲਈ ਉਹ ਕੀ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "bowl of water / ਪਾਣੀ ਦੀ ਕਟੋਰੀ",
          "sand / ਰੇਤ",
          "fire / ਅੱਗ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they use a bowl of water. / ਪੈਨਲ 1 ਵਿੱਚ ਪਾਣੀ ਦੀ ਕਟੋਰੀ ਹੈ।"
      },
      {
        "question": "What does the child predict about the coin? / ਸਿੱਕੇ ਬਾਰੇ ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sink / ਡੁੱਬੇਗਾ",
          "float / ਤਰੇਗਾ",
          "fly / ਉੱਡੇਗਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the coin will sink. / ਪੈਨਲ 3 ਵਿੱਚ ਸਿੱਕਾ ਡੁੱਬੇਗਾ।"
      },
      {
        "question": "What does the child predict about the sponge? / ਸਪੰਜ ਬਾਰੇ ਕੀ ਅੰਦਾਜ਼ਾ ਹੈ?",
        "choices": [
          "float / ਤਰੇਗਾ",
          "sink / ਡੁੱਬੇਗਾ",
          "break / ਟੁੱਟੇਗਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the sponge will float. / ਪੈਨਲ 3 ਵਿੱਚ ਸਪੰਜ ਤਰੇਗਾ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "coin sinks, sponge floats / ਸਿੱਕਾ ਡੁੱਬਦਾ, ਸਪੰਜ ਤਰਦਾ",
          "coin floats, sponge sinks / ਸਿੱਕਾ ਤਰਦਾ, ਸਪੰਜ ਡੁੱਬਦਾ",
          "both float / ਦੋਵੇਂ ਤਰਦੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the coin sinks and the sponge floats. / ਪੈਨਲ 4 ਵਿੱਚ ਸਿੱਕਾ ਡੁੱਬਦਾ ਅਤੇ ਸਪੰਜ ਤਰਦਾ ਹੈ।"
      },
      {
        "question": "Why does the coin sink? / ਸਿੱਕਾ ਕਿਉਂ ਡੁੱਬਦਾ ਹੈ?",
        "choices": [
          "because it is heavy / ਕਿਉਂਕਿ ਭਾਰੀ ਹੈ",
          "because it is soft / ਕਿਉਂਕਿ ਨਰਮ ਹੈ",
          "because it is loud / ਕਿਉਂਕਿ ਸ਼ੋਰ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 explains the coin sinks because it is heavy. / ਪੈਨਲ 3 ਵਿੱਚ ਭਾਰੀ ਹੋਣ ਕਰਕੇ ਡੁੱਬਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "sink",
        "meaningEn": "go down in water",
        "meaningPa": "ਡੁੱਬਣਾ; ਪਾਣੀ ਵਿੱਚ ਹੇਠਾਂ ਜਾਣਾ"
      },
      {
        "word": "float",
        "meaningEn": "stay on top of water",
        "meaningPa": "ਤਰਨਾ; ਪਾਣੀ ਉੱਤੇ ਰਹਿਣਾ"
      },
      {
        "word": "bowl",
        "meaningEn": "a dish that can hold water",
        "meaningPa": "ਕਟੋਰੀ; ਪਾਣੀ ਰੱਖਣ ਵਾਲਾ ਬਰਤਨ"
      },
      {
        "word": "coin",
        "meaningEn": "small round money",
        "meaningPa": "ਸਿੱਕਾ; ਗੋਲ ਪੈਸਾ"
      },
      {
        "word": "sponge",
        "meaningEn": "soft thing that soaks water",
        "meaningPa": "ਸਪੰਜ; ਪਾਣੀ ਸੋਖਣ ਵਾਲੀ ਨਰਮ ਚੀਜ਼"
      },
      {
        "word": "heavy",
        "meaningEn": "not light",
        "meaningPa": "ਭਾਰੀ; ਹਲਕਾ ਨਹੀਂ"
      },
      {
        "word": "light",
        "meaningEn": "not heavy",
        "meaningPa": "ਹਲਕਾ; ਭਾਰੀ ਨਹੀਂ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਬਾਅਦ ਵਿੱਚ ਕੀ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S08",
    "bundleId": 8,
    "orderInBundle": 8,
    "titleEn": "Book 8 · Story 8: Melting Ice Experiment",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 8: ਬਰਫ਼ ਪਿਘਲਣ ਦਾ ਤਜਰਬਾ",
    "englishStory": "Panel 1 (Intro): Today I do an ice experiment with my teacher. We put two ice cubes on two plates.\nPanel 2 (Body): First, I observe the ice and notice it is hard and cold. I ask, \"Which ice will melt faster?\"\nPanel 3 (Body): Next, I predict the ice in the sun will melt faster because it is warmer. I test by putting one plate in sun and one in shade.\nPanel 4 (Body): Then we wait a short time and compare the water on each plate. The result is the sunny ice melts faster than the shady ice.\nPanel 5 (Conclusion): After that, I explain, \"Warmth makes ice melt, so heat changes ice to water.\" I feel proud because I predicted and tested.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਟੀਚਰ ਨਾਲ ਬਰਫ਼ ਦਾ ਤਜਰਬਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਅਸੀਂ ਦੋ ਪਲੇਟਾਂ ਉੱਤੇ ਦੋ ਬਰਫ਼ ਦੇ ਟੁਕੜੇ ਰੱਖਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਬਰਫ਼ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਉਹ ਸਖ਼ਤ ਅਤੇ ਠੰਢੀ ਹੈ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕਿਹੜੀ ਬਰਫ਼ ਜਲਦੀ ਪਿਘਲੇਗੀ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਧੁੱਪ ਵਾਲੀ ਬਰਫ਼ ਜਲਦੀ ਪਿਘਲੇਗੀ ਕਿਉਂਕਿ ਉੱਥੇ ਗਰਮੀ ਵਧੇਰੀ ਹੈ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਇੱਕ ਪਲੇਟ ਧੁੱਪ ਵਿੱਚ ਅਤੇ ਇੱਕ ਛਾਂ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਥੋੜ੍ਹਾ ਇੰਤਜ਼ਾਰ ਕਰਦੇ ਹਾਂ ਅਤੇ ਦੋਵੇਂ ਪਲੇਟਾਂ ਉੱਤੇ ਪਾਣੀ ਦੀ ਤੁਲਨਾ ਕਰਦੇ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਧੁੱਪ ਵਾਲੀ ਬਰਫ਼ ਛਾਂ ਵਾਲੀ ਨਾਲੋਂ ਜਲਦੀ ਪਿਘਲਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ, \"ਗਰਮੀ ਨਾਲ ਬਰਫ਼ ਪਿਘਲਦੀ ਹੈ, ਇਸ ਲਈ ਗਰਮੀ ਬਰਫ਼ ਨੂੰ ਪਾਣੀ ਬਣਾਂਦੀ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ ਅਤੇ ਅਜ਼ਮਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What do they test? / ਉਹ ਕੀ ਅਜ਼ਮਾਉਂਦੇ ਹਨ?",
        "choices": [
          "ice melting / ਬਰਫ਼ ਪਿਘਲਣਾ",
          "paper flying / ਕਾਗਜ਼ ਉੱਡਣਾ",
          "seed singing / ਬੀਜ ਗਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story tests how ice melts. / ਕਹਾਣੀ ਵਿੱਚ ਬਰਫ਼ ਪਿਘਲਣ ਦਾ ਟੈਸਟ ਹੈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sun melts faster / ਧੁੱਪ ਜਲਦੀ ਪਿਘਲਾਏਗੀ",
          "shade melts faster / ਛਾਂ ਜਲਦੀ ਪਿਘਲਾਏਗੀ",
          "ice grows / ਬਰਫ਼ ਵਧੇਗੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts ice in the sun will melt faster. / ਪੈਨਲ 3 ਵਿੱਚ ਧੁੱਪ ਵਾਲੀ ਬਰਫ਼ ਜਲਦੀ ਪਿਘਲੇਗੀ।"
      },
      {
        "question": "How do they test? / ਉਹ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦੇ ਹਨ?",
        "choices": [
          "sun and shade / ਧੁੱਪ ਤੇ ਛਾਂ",
          "hot and cold soup / ਗਰਮ ਤੇ ਠੰਢਾ ਸੂਪ",
          "bus and car / ਬੱਸ ਤੇ ਗੱਡੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They put one ice in the sun and one in the shade. / ਇੱਕ ਧੁੱਪ ਵਿੱਚ ਅਤੇ ਇੱਕ ਛਾਂ ਵਿੱਚ ਰੱਖਦੇ ਹਨ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "sun melts faster / ਧੁੱਪ ਵਾਲੀ ਜਲਦੀ",
          "shade melts faster / ਛਾਂ ਵਾਲੀ ਜਲਦੀ",
          "both same / ਦੋਵੇਂ ਇੱਕੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the sunny ice melts faster. / ਪੈਨਲ 4 ਵਿੱਚ ਧੁੱਪ ਵਾਲੀ ਜਲਦੀ ਪਿਘਲਦੀ ਹੈ।"
      },
      {
        "question": "Why does ice melt faster in the sun? / ਧੁੱਪ ਵਿੱਚ ਬਰਫ਼ ਜਲਦੀ ਕਿਉਂ ਪਿਘਲਦੀ ਹੈ?",
        "choices": [
          "because it is warmer / ਕਿਉਂਕਿ ਗਰਮ ਹੈ",
          "because it is louder / ਕਿਉਂਕਿ ਸ਼ੋਰ ਹੈ",
          "because it is darker / ਕਿਉਂਕਿ ਹਨੇਰਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The sun is warmer, so the ice melts faster. / ਧੁੱਪ ਗਰਮ ਹੈ, ਇਸ ਲਈ ਬਰਫ਼ ਜਲਦੀ ਪਿਘਲਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "ice",
        "meaningEn": "frozen water",
        "meaningPa": "ਬਰਫ਼; ਜਮਿਆ ਪਾਣੀ"
      },
      {
        "word": "melt",
        "meaningEn": "change from solid to liquid",
        "meaningPa": "ਪਿਘਲਣਾ; ਠੋਸ ਤੋਂ ਤਰਲ ਬਣਨਾ"
      },
      {
        "word": "warmth",
        "meaningEn": "heat; feeling warm",
        "meaningPa": "ਗਰਮੀ; ਤਪਸ਼"
      },
      {
        "word": "heat",
        "meaningEn": "hot energy that warms things",
        "meaningPa": "ਤਾਪ; ਗਰਮੀ ਵਾਲੀ ਊਰਜਾ"
      },
      {
        "word": "sun",
        "meaningEn": "the bright light in the sky",
        "meaningPa": "ਸੂਰਜ; ਧੁੱਪ ਵਾਲਾ ਤਾਰਾ"
      },
      {
        "word": "shade",
        "meaningEn": "a place away from sun",
        "meaningPa": "ਛਾਂ; ਧੁੱਪ ਤੋਂ ਦੂਰ ਥਾਂ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to find out",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਪਤਾ ਲਗਾਉਣਾ"
      },
      {
        "word": "compare",
        "meaningEn": "see which is more",
        "meaningPa": "ਤੁਲਨਾ; ਕਿਹੜਾ ਵਧੇਰਾ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਆਖਿਰ ਜੋ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "makes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S09",
    "bundleId": 8,
    "orderInBundle": 9,
    "titleEn": "Book 8 · Story 9: Sorting Science",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 9: ਛਾਂਟਣ ਦੀ ਸਾਇੰਸ",
    "englishStory": "Panel 1 (Intro): Today our class sorts items for recycling. We have paper, plastic, and metal on our table.\nPanel 2 (Body): First, I observe the items and notice they feel different. I ask, \"How can we sort them correctly?\"\nPanel 3 (Body): Next, I predict paper goes in the paper bin, and plastic goes in the plastic bin. I test by reading labels and checking with my teacher.\nPanel 4 (Body): Then we sort each item and compare our piles. The result is clean groups that match the correct bins.\nPanel 5 (Conclusion): After that, I explain, \"Sorting helps recycling, so trash becomes less.\" I feel proud because I sorted and explained.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਲਾਸ ਰੀਸਾਇਕਲ ਲਈ ਚੀਜ਼ਾਂ ਛਾਂਟਦੀ ਹੈ। ਮੇਜ਼ ਉੱਤੇ ਕਾਗਜ਼, ਪਲਾਸਟਿਕ, ਅਤੇ ਧਾਤੂ ਪਿਆ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਚੀਜ਼ਾਂ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਇਹ ਵੱਖਰਾ ਮਹਿਸੂਸ ਹੁੰਦੀਆਂ ਹਨ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਅਸੀਂ ਇਹਨਾਂ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਕਿਵੇਂ ਛਾਂਟੀਏ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਕਾਗਜ਼ ਕਾਗਜ਼ ਵਾਲੇ ਡੱਬੇ ਵਿੱਚ ਜਾਵੇਗਾ ਅਤੇ ਪਲਾਸਟਿਕ ਪਲਾਸਟਿਕ ਵਾਲੇ ਡੱਬੇ ਵਿੱਚ। ਮੈਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹਾਂ: ਲੇਬਲ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹਾਂ ਅਤੇ ਟੀਚਰ ਨਾਲ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਹਰ ਚੀਜ਼ ਛਾਂਟਦੇ ਹਾਂ ਅਤੇ ਢੇਰਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦੇ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਸਾਫ਼ ਗਰੁੱਪ ਬਣ ਜਾਂਦੇ ਹਨ ਅਤੇ ਸਹੀ ਡੱਬਿਆਂ ਨਾਲ ਮਿਲਦੇ ਹਨ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ, \"ਛਾਂਟਣਾ ਰੀਸਾਇਕਲ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਕੂੜਾ ਘੱਟ ਹੁੰਦਾ ਹੈ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਛਾਂਟਿਆ ਅਤੇ ਸਮਝਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What materials do they sort? / ਉਹ ਕਿਹੜੇ ਸਮਾਨ ਛਾਂਟਦੇ ਹਨ?",
        "choices": [
          "paper, plastic, metal / ਕਾਗਜ਼, ਪਲਾਸਟਿਕ, ਧਾਤੂ",
          "sand, water, fire / ਰੇਤ, ਪਾਣੀ, ਅੱਗ",
          "shoes, hats, socks / ਜੁੱਤੇ, ਟੋਪੀ, ਮੋਜੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 lists paper, plastic, and metal. / ਪੈਨਲ 1 ਵਿੱਚ ਕਾਗਜ਼, ਪਲਾਸਟਿਕ, ਧਾਤੂ ਹਨ।"
      },
      {
        "question": "What does the child do first? / ਬੱਚਾ ਪਹਿਲਾਂ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "observe / ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ",
          "sleep / ਸੌਂਦਾ/ਸੌਂਦੀ ਹੈ",
          "dance / ਨੱਚਦਾ/ਨੱਚਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child observes the items. / ਪੈਨਲ 2 ਵਿੱਚ ਚੀਜ਼ਾਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹੈ।"
      },
      {
        "question": "How does the child test sorting? / ਬੱਚਾ ਛਾਂਟਣ ਨੂੰ ਕਿਵੇਂ ਅਜ਼ਮਾਉਂਦਾ/ਅਜ਼ਮਾਉਂਦੀ ਹੈ?",
        "choices": [
          "read labels and check / ਲੇਬਲ ਪੜ੍ਹ ਕੇ ਚੈੱਕ",
          "throw away / ਸੁੱਟ ਦੇਣਾ",
          "hide items / ਲੁਕਾਉਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the child reads labels and checks with the teacher. / ਪੈਨਲ 3 ਵਿੱਚ ਲੇਬਲ ਪੜ੍ਹ ਕੇ ਟੀਚਰ ਨਾਲ ਚੈੱਕ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "clean groups / ਸਾਫ਼ ਗਰੁੱਪ",
          "broken toys / ਟੁੱਟੇ ਖਿਡੌਣੇ",
          "wet books / ਭਿੱਜੀਆਂ ਕਿਤਾਬਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the result is clean groups that match bins. / ਪੈਨਲ 4 ਵਿੱਚ ਸਾਫ਼ ਗਰੁੱਪ ਬਣਦੇ ਹਨ।"
      },
      {
        "question": "Why does sorting help? / ਛਾਂਟਣਾ ਕਿਉਂ ਮਦਦ ਕਰਦਾ ਹੈ?",
        "choices": [
          "because recycling works / ਕਿਉਂਕਿ ਰੀਸਾਇਕਲ ਚੱਲਦਾ",
          "because clouds move / ਕਿਉਂਕਿ ਬੱਦਲ ਹਿਲਦੇ",
          "because ice melts / ਕਿਉਂਕਿ ਬਰਫ਼ ਪਿਘਲਦੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 explains sorting helps recycling, so trash becomes less. / ਪੈਨਲ 5 ਵਿੱਚ ਰੀਸਾਇਕਲ ਲਈ ਛਾਂਟਣਾ ਮਦਦ ਕਰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "sort",
        "meaningEn": "put into groups",
        "meaningPa": "ਛਾਂਟਣਾ; ਗਰੁੱਪ ਬਣਾਉਣਾ"
      },
      {
        "word": "recycle",
        "meaningEn": "use again in a new way",
        "meaningPa": "ਰੀਸਾਇਕਲ; ਮੁੜ ਵਰਤਣਾ"
      },
      {
        "word": "paper",
        "meaningEn": "thin sheets",
        "meaningPa": "ਕਾਗਜ਼; ਪੱਤੇ"
      },
      {
        "word": "plastic",
        "meaningEn": "light material for bottles and bags",
        "meaningPa": "ਪਲਾਸਟਿਕ; ਹਲਕਾ ਸਮਾਨ"
      },
      {
        "word": "metal",
        "meaningEn": "hard material like a can",
        "meaningPa": "ਧਾਤੂ; ਸਖ਼ਤ ਸਮਾਨ"
      },
      {
        "word": "label",
        "meaningEn": "words on an item",
        "meaningPa": "ਲੇਬਲ; ਚੀਜ਼ ਉੱਤੇ ਲਿਖਾਈ"
      },
      {
        "word": "bin",
        "meaningEn": "container for trash or recycling",
        "meaningPa": "ਡੱਬਾ; ਕੂੜਾ/ਰੀਸਾਇਕਲ ਬਕਸਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਸੋਚਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਅਖੀਰ ਜੋ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "goes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B8_S10",
    "bundleId": 8,
    "orderInBundle": 10,
    "titleEn": "Book 8 · Story 10: Our Mini Science Fair",
    "titlePa": "ਕਿਤਾਬ 8 · ਕਹਾਣੀ 10: ਸਾਡਾ ਛੋਟਾ ਸਾਇੰਸ ਮੇਲਾ",
    "englishStory": "Panel 1 (Intro): Today our class has a mini science fair. I will share my experiment and speak clearly.\nPanel 2 (Body): First, I observe my project and notice what happened. I say, \"I tested ice in sun and shade.\"\nPanel 3 (Body): Next, I predict the sunny ice will melt faster because it is warmer. I show my notes and my picture to my friends.\nPanel 4 (Body): Then I explain my results and compare the plates. The result is the sunny plate has more water than the shady plate.\nPanel 5 (Conclusion): After that, my teacher says, \"Great science talk.\" I feel proud because I observed, predicted, tested, and explained.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਲਾਸ ਵਿੱਚ ਛੋਟਾ ਸਾਇੰਸ ਮੇਲਾ ਹੁੰਦਾ ਹੈ। ਮੈਂ ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰਨਾ ਅਤੇ ਸਾਫ਼ ਬੋਲਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਆਪਣੇ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਕੀ ਹੋਇਆ ਸੀ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਧੁੱਪ ਅਤੇ ਛਾਂ ਵਿੱਚ ਬਰਫ਼ ਅਜ਼ਮਾਈ ਸੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਦੱਸਦਾ/ਦੱਸਦੀ ਹਾਂ ਕਿ ਧੁੱਪ ਵਾਲੀ ਬਰਫ਼ ਜਲਦੀ ਪਿਘਲੇਗੀ ਕਿਉਂਕਿ ਉੱਥੇ ਗਰਮੀ ਵਧੇਰੀ ਹੈ। ਮੈਂ ਆਪਣੇ ਨੋਟ ਅਤੇ ਤਸਵੀਰ ਦੋਸਤਾਂ ਨੂੰ ਦਿਖਾਂਦਾ/ਦਿਖਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਨਤੀਜੇ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ ਅਤੇ ਦੋਵੇਂ ਪਲੇਟਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਧੁੱਪ ਵਾਲੀ ਪਲੇਟ ਉੱਤੇ ਛਾਂ ਵਾਲੀ ਪਲੇਟ ਨਾਲੋਂ ਵਧੇਰੇ ਪਾਣੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਵਧੀਆ ਸਾਇੰਸ ਗੱਲ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਵੇਖਿਆ, ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ, ਅਜ਼ਮਾਇਆ, ਅਤੇ ਸਮਝਾਇਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "What event does the class have? / ਕਲਾਸ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "science fair / ਸਾਇੰਸ ਮੇਲਾ",
          "birthday party / ਜਨਮਦਿਨ ਪਾਰਟੀ",
          "sleep time / ਸੌਣ ਦਾ ਸਮਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the class has a mini science fair. / ਪੈਨਲ 1 ਵਿੱਚ ਛੋਟਾ ਸਾਇੰਸ ਮੇਲਾ ਹੈ।"
      },
      {
        "question": "What did the child test? / ਬੱਚੇ ਨੇ ਕੀ ਅਜ਼ਮਾਇਆ?",
        "choices": [
          "ice in sun and shade / ਧੁੱਪ ਅਤੇ ਛਾਂ ਵਿੱਚ ਬਰਫ਼",
          "paper in water / ਪਾਣੀ ਵਿੱਚ ਕਾਗਜ਼",
          "seed in soup / ਸੂਪ ਵਿੱਚ ਬੀਜ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child tested ice in sun and shade. / ਪੈਨਲ 2 ਵਿੱਚ ਧੁੱਪ ਅਤੇ ਛਾਂ ਵਿੱਚ ਬਰਫ਼ ਅਜ਼ਮਾਈ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sun melts faster / ਧੁੱਪ ਜਲਦੀ ਪਿਘਲਾਏਗੀ",
          "shade melts faster / ਛਾਂ ਜਲਦੀ ਪਿਘਲਾਏਗੀ",
          "ice grows / ਬਰਫ਼ ਵਧੇਗੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 predicts the sunny ice will melt faster. / ਪੈਨਲ 3 ਵਿੱਚ ਧੁੱਪ ਵਾਲੀ ਜਲਦੀ ਪਿਘਲੇਗੀ।"
      },
      {
        "question": "What is the result? / ਨਤੀਜਾ ਕੀ ਹੈ?",
        "choices": [
          "more water on sunny plate / ਧੁੱਪ ਵਾਲੀ ਪਲੇਟ ਤੇ ਵਧੇਰਾ ਪਾਣੀ",
          "more water on shady plate / ਛਾਂ ਵਾਲੀ ਪਲੇਟ ਤੇ ਵਧੇਰਾ ਪਾਣੀ",
          "no water / ਪਾਣੀ ਨਹੀਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the sunny plate has more water. / ਪੈਨਲ 4 ਵਿੱਚ ਧੁੱਪ ਵਾਲੀ ਪਲੇਟ ਤੇ ਵਧੇਰਾ ਪਾਣੀ ਹੈ।"
      },
      {
        "question": "Why is the child proud? / ਬੱਚਾ ਮਾਣ ਕਿਉਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "did science steps / ਸਾਇੰਸ ਦੇ ਕਦਮ ਕੀਤੇ",
          "ate candy / ਕੈਂਡੀ ਖਾਈ",
          "ran fast / ਤੇਜ਼ ਦੌੜਿਆ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child observed, predicted, tested, and explained. / ਪੈਨਲ 5 ਵਿੱਚ ਬੱਚੇ ਨੇ ਵੇਖਿਆ, ਅੰਦਾਜ਼ਾ ਲਗਾਇਆ, ਅਜ਼ਮਾਇਆ, ਅਤੇ ਸਮਝਾਇਆ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "science",
        "meaningEn": "learning about the world by testing",
        "meaningPa": "ਸਾਇੰਸ; ਅਜ਼ਮਾਉਂ ਕੇ ਸਿੱਖਣਾ"
      },
      {
        "word": "fair",
        "meaningEn": "an event where people show projects",
        "meaningPa": "ਮੇਲਾ; ਪ੍ਰੋਜੈਕਟ ਦਿਖਾਉਣ ਦਾ ਸਮਾਗਮ"
      },
      {
        "word": "project",
        "meaningEn": "a work you make to show",
        "meaningPa": "ਪ੍ਰੋਜੈਕਟ; ਦਿਖਾਉਣ ਵਾਲਾ ਕੰਮ"
      },
      {
        "word": "observe",
        "meaningEn": "look carefully",
        "meaningPa": "ਨਿਰੀਖਣ ਕਰਨਾ; ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ"
      },
      {
        "word": "predict",
        "meaningEn": "guess what will happen",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਪਹਿਲਾਂ ਕਹਿਣਾ"
      },
      {
        "word": "test",
        "meaningEn": "try to check",
        "meaningPa": "ਅਜ਼ਮਾਉਣਾ; ਜਾਂਚ ਕਰਨੀ"
      },
      {
        "word": "compare",
        "meaningEn": "see which is more or less",
        "meaningPa": "ਤੁਲਨਾ; ਵਧੇਰਾ/ਘੱਟ ਵੇਖਣਾ"
      },
      {
        "word": "result",
        "meaningEn": "what happens after",
        "meaningPa": "ਨਤੀਜਾ; ਅਖੀਰ ਜੋ ਹੋਇਆ"
      },
      {
        "word": "explain",
        "meaningEn": "tell the reason clearly",
        "meaningPa": "ਸਮਝਾਉਣਾ; ਕਾਰਨ ਦੱਸਣਾ"
      },
      {
        "word": "proud",
        "meaningEn": "happy about doing well",
        "meaningPa": "ਮਾਣ; ਚੰਗਾ ਕਰਕੇ ਖੁਸ਼"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK9_CUSTOM_STORIES = [
  {
    "storyId": "B9_S01",
    "bundleId": 9,
    "orderInBundle": 1,
    "titleEn": "Book 9 · Story 1: Bazaar Mission: Find the Fruit Seller",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 1: ਬਾਜ਼ਾਰ ਦਾ ਕੰਮ: ਫਲ ਵਾਲਾ ਲੱਭੋ",
    "englishStory": "Panel 1 (Intro): Today I go to the bazaar with my mom to buy sweet fruit.\nPanel 2 (Body): First, I stay close to Mom and look around carefully. I ask, \"Excuse me, where is the fruit shop?\"\nPanel 3 (Body): Next, the shopkeeper points and says, \"Go straight, then turn left near the big sign.\"\nPanel 4 (Body): Then we find apples and bananas, and Mom asks, \"How much are the apples?\" The seller says, \"A kilo is cheaper today.\"\nPanel 5 (Conclusion): After that, we buy fruit and say, \"Thank you!\" I feel proud because I asked politely and followed directions.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਂ ਨਾਲ ਬਾਜ਼ਾਰ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਤਾਂ ਜੋ ਮਿੱਠੇ ਫਲ ਖਰੀਦ ਸਕੀਏ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਮਾਂ ਦੇ ਨੇੜੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹਾਂ ਅਤੇ ਧਿਆਨ ਨਾਲ ਆਲੇ-ਦੁਆਲੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਫਲ ਦੀ ਦੁਕਾਨ ਕਿੱਥੇ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਦੁਕਾਨਦਾਰ ਇਸ਼ਾਰਾ ਕਰਕੇ ਕਹਿੰਦਾ ਹੈ, \"ਸਿੱਧੇ ਜਾਓ, ਫਿਰ ਵੱਡੇ ਸਾਈਨ ਕੋਲ ਖੱਬੇ ਮੁੜੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਸੇਬ ਤੇ ਕੇਲੇ ਲੱਭ ਲੈਂਦੇ ਹਾਂ, ਅਤੇ ਮਾਂ ਪੁੱਛਦੀ ਹੈ, \"ਸੇਬ ਕਿੰਨੇ ਦੇ ਹਨ?\" ਫਲ ਵਾਲਾ ਕਹਿੰਦਾ ਹੈ, \"ਅੱਜ ਇੱਕ ਕਿਲੋ ਸਸਤਾ ਹੈ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਫਲ ਖਰੀਦਦੇ ਹਾਂ ਅਤੇ ਕਹਿੰਦੇ ਹਾਂ, \"ਧੰਨਵਾਦ!\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਨਮਰਤਾ ਨਾਲ ਪੁੱਛਿਆ ਅਤੇ ਰਸਤਾ ਮੰਨਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "bazaar / ਬਾਜ਼ਾਰ",
          "library / ਲਾਇਬ੍ਰੇਰੀ",
          "clinic / ਕਲੀਨਿਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child goes to the bazaar. / ਪੈਨਲ 1 ਵਿੱਚ ਬਾਜ਼ਾਰ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first in a crowded place? / ਭੀੜ ਵਿੱਚ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "stay close to mom / ਮਾਂ ਦੇ ਨੇੜੇ ਰਹਿਣਾ",
          "run far / ਦੂਰ ਦੌੜ ਜਾਣਾ",
          "hide behind boxes / ਡੱਬਿਆਂ ਪਿੱਛੇ ਲੁਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows the child stays close to Mom for safety. / ਪੈਨਲ 2 ਵਿੱਚ ਬੱਚਾ ਸੁਰੱਖਿਆ ਲਈ ਮਾਂ ਦੇ ਨੇੜੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।"
      },
      {
        "question": "Who gives directions? / ਰਸਤਾ ਕੌਣ ਦੱਸਦਾ ਹੈ?",
        "choices": [
          "shopkeeper / ਦੁਕਾਨਦਾਰ",
          "bus driver / ਬੱਸ ਡਰਾਈਵਰ",
          "doctor / ਡਾਕਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the shopkeeper points and gives directions. / ਪੈਨਲ 3 ਵਿੱਚ ਦੁਕਾਨਦਾਰ ਰਸਤਾ ਦੱਸਦਾ ਹੈ।"
      },
      {
        "question": "Why does the child follow directions? / ਬੱਚਾ ਰਸਤਾ ਕਿਉਂ ਮੰਨਦਾ/ਮੰਨਦੀ ਹੈ?",
        "choices": [
          "to find the fruit shop / ਫਲ ਦੀ ਦੁਕਾਨ ਲੱਭਣ ਲਈ",
          "to get lost / ਗੁੰਮ ਹੋਣ ਲਈ",
          "to be late / ਦੇਰ ਕਰਨ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Following directions helps the child reach the fruit shop. / ਰਸਤਾ ਮੰਨਣ ਨਾਲ ਫਲ ਦੀ ਦੁਕਾਨ ਮਿਲਦੀ ਹੈ।"
      },
      {
        "question": "What do they buy? / ਉਹ ਕੀ ਖਰੀਦਦੇ ਹਨ?",
        "choices": [
          "fruit / ਫਲ",
          "shoes / ਜੁੱਤੇ",
          "medicine / ਦਵਾਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they buy fruit and say thank you. / ਪੈਨਲ 5 ਵਿੱਚ ਫਲ ਖਰੀਦਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bazaar",
        "meaningEn": "a busy market with many shops",
        "meaningPa": "ਬਾਜ਼ਾਰ; ਕਈ ਦੁਕਾਨਾਂ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "fruit",
        "meaningEn": "sweet food like apples or bananas",
        "meaningPa": "ਫਲ; ਸੇਬ, ਕੇਲੇ ਵਰਗਾ ਮਿੱਠਾ ਖਾਣਾ"
      },
      {
        "word": "excuse me",
        "meaningEn": "polite words to get attention",
        "meaningPa": "ਐਕਸਕਿਊਜ਼ ਮੀ; ਨਮਰਤਾ ਨਾਲ ਧਿਆਨ ਖਿੱਚਣਾ"
      },
      {
        "word": "directions",
        "meaningEn": "how to go to a place",
        "meaningPa": "ਰਸਤਾ; ਕਿੱਧਰ ਜਾਣਾ"
      },
      {
        "word": "straight",
        "meaningEn": "go forward, not left or right",
        "meaningPa": "ਸਿੱਧਾ; ਅੱਗੇ ਵੱਲ"
      },
      {
        "word": "left",
        "meaningEn": "the side opposite of right",
        "meaningPa": "ਖੱਬਾ; ਸੱਜੇ ਦਾ ਉਲਟ"
      },
      {
        "word": "sign",
        "meaningEn": "a board with words or pictures",
        "meaningPa": "ਸਾਈਨ; ਲਿਖਤ/ਤਸਵੀਰ ਵਾਲਾ ਬੋਰਡ"
      },
      {
        "word": "price",
        "meaningEn": "how much money something costs",
        "meaningPa": "ਕੀਮਤ; ਕਿੰਨੇ ਪੈਸੇ"
      },
      {
        "word": "cheaper",
        "meaningEn": "costs less money",
        "meaningPa": "ਸਸਤਾ; ਘੱਟ ਕੀਮਤ"
      },
      {
        "word": "thank you",
        "meaningEn": "polite words after help",
        "meaningPa": "ਧੰਨਵਾਦ; ਮਦਦ ਲਈ ਸ਼ੁਕਰੀਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "ask",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S02",
    "bundleId": 9,
    "orderInBundle": 2,
    "titleEn": "Book 9 · Story 2: Auto-Rickshaw Ride: Saying the Address",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 2: ਆਟੋ ਰਿਕਸ਼ਾ ਸਫ਼ਰ: ਪਤਾ ਦੱਸਣਾ",
    "englishStory": "Panel 1 (Intro): Today I ride in an auto-rickshaw with my dad to visit my aunt.\nPanel 2 (Body): First, Dad says, \"Stay seated and hold the side bar.\" I say, \"Okay, Dad, I will sit safely.\"\nPanel 3 (Body): Next, Dad tells the driver, \"Please take us to Green Street, near the school. That is our address.\" The driver says, \"Yes, I know.\"\nPanel 4 (Body): Then I watch for landmarks and say, \"I see the school, so we are close.\" Dad says, \"Good noticing!\"\nPanel 5 (Conclusion): After that, we stop safely and say, \"Thank you.\" I feel confident because I used polite words and stayed safe.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਿਉ ਨਾਲ ਆਟੋ ਰਿਕਸ਼ੇ ਵਿੱਚ ਮਾਸੀ/ਚਾਚੀ ਨੂੰ ਮਿਲਣ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਬੈਠੇ ਰਹੋ ਅਤੇ ਸਾਈਡ ਵਾਲੀ ਪੱਟੀ ਫੜੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਠੀਕ ਹੈ ਪਿਉ ਜੀ, ਮੈਂ ਸੁਰੱਖਿਅਤ ਬੈਠਾਂਗਾ/ਬੈਠਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਪਿਉ ਡਰਾਈਵਰ ਨੂੰ ਕਹਿੰਦਾ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਸਾਨੂੰ ਗ੍ਰੀਨ ਸਟਰੀਟ, ਸਕੂਲ ਦੇ ਨੇੜੇ ਲੈ ਜਾਓ। ਇਹ ਸਾਡਾ ਪਤਾ ਹੈ।\" ਡਰਾਈਵਰ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ ਜੀ, ਮੈਨੂੰ ਪਤਾ ਹੈ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਨਿਸ਼ਾਨੀਆਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਨੂੰ ਸਕੂਲ ਦਿਖ ਰਿਹਾ ਹੈ, ਅਸੀਂ ਨੇੜੇ ਹਾਂ।\" ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਵਧੀਆ ਧਿਆਨ!\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਸੁਰੱਖਿਅਤ ਰੁਕਦੇ ਹਾਂ ਅਤੇ ਕਹਿੰਦੇ ਹਾਂ, \"ਧੰਨਵਾਦ।\" ਮੈਨੂੰ ਭਰੋਸਾ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਨਮਰ ਸ਼ਬਦ ਵਰਤੇ ਅਤੇ ਸੁਰੱਖਿਅਤ ਰਿਹਾ/ਰਹੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Who is with the child? / ਬੱਚੇ ਨਾਲ ਕੌਣ ਹੈ?",
        "choices": [
          "dad / ਪਿਉ",
          "teacher / ਟੀਚਰ",
          "police officer / ਪੁਲਿਸ ਅਫ਼ਸਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child rides with Dad. / ਪੈਨਲ 1 ਵਿੱਚ ਪਿਉ ਨਾਲ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do in the auto? / ਆਟੋ ਵਿੱਚ ਬੱਚੇ ਨੇ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "sit and hold the bar / ਬੈਠ ਕੇ ਪੱਟੀ ਫੜਨੀ",
          "stand and jump / ਖੜ੍ਹ ਕੇ ਕੂਦਣਾ",
          "lean out / ਬਾਹਰ ਝੁਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to stay seated and hold the side bar. / ਪੈਨਲ 2 ਵਿੱਚ ਬੈਠ ਕੇ ਪੱਟੀ ਫੜਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Where do they want to go? / ਉਹ ਕਿੱਥੇ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹਨ?",
        "choices": [
          "Green Street / ਗ੍ਰੀਨ ਸਟਰੀਟ",
          "City Zoo / ਚਿੜੀਆਘਰ",
          "Airport / ਹਵਾਈ ਅੱਡਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says \"Green Street, near the school.\" / ਪੈਨਲ 3 ਵਿੱਚ ਗ੍ਰੀਨ ਸਟਰੀਟ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the child say they are close? / ਬੱਚਾ ਕਿਉਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ ਕਿ ਅਸੀਂ ਨੇੜੇ ਹਾਂ?",
        "choices": [
          "because they see the school / ਕਿਉਂਕਿ ਸਕੂਲ ਦਿਖਦਾ ਹੈ",
          "because it is night / ਕਿਉਂਕਿ ਰਾਤ ਹੈ",
          "because it is raining / ਕਿਉਂਕਿ ਮੀਂਹ ਪੈਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the child sees the school as a landmark. / ਪੈਨਲ 4 ਵਿੱਚ ਸਕੂਲ ਨਿਸ਼ਾਨੀ ਵਜੋਂ ਦਿਖਦਾ ਹੈ।"
      },
      {
        "question": "What do they say at the end? / ਅੰਤ ਵਿੱਚ ਉਹ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "Thank you / ਧੰਨਵਾਦ",
          "Go away / ਦੂਰ ਜਾਓ",
          "Be loud / ਸ਼ੋਰ ਕਰੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they say \"Thank you.\" / ਪੈਨਲ 5 ਵਿੱਚ ਧੰਨਵਾਦ ਕਹਿੰਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "auto-rickshaw",
        "meaningEn": "a small vehicle for rides",
        "meaningPa": "ਆਟੋ ਰਿਕਸ਼ਾ; ਛੋਟੀ ਸਵਾਰੀ ਵਾਲੀ ਗੱਡੀ"
      },
      {
        "word": "driver",
        "meaningEn": "person who drives a vehicle",
        "meaningPa": "ਡਰਾਈਵਰ; ਗੱਡੀ ਚਲਾਉਣ ਵਾਲਾ"
      },
      {
        "word": "address",
        "meaningEn": "the place name where you go",
        "meaningPa": "ਪਤਾ; ਕਿੱਥੇ ਜਾਣਾ ਹੈ"
      },
      {
        "word": "near",
        "meaningEn": "close to",
        "meaningPa": "ਨੇੜੇ; ਕੋਲ"
      },
      {
        "word": "landmark",
        "meaningEn": "a place you recognize to guide you",
        "meaningPa": "ਨਿਸ਼ਾਨੀ; ਰਸਤਾ ਦੱਸਣ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "seat",
        "meaningEn": "a place to sit",
        "meaningPa": "ਸੀਟ; ਬੈਠਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "hold",
        "meaningEn": "keep in your hand",
        "meaningPa": "ਫੜਨਾ; ਹੱਥ ਵਿੱਚ ਰੱਖਣਾ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "please",
        "meaningEn": "polite word when asking",
        "meaningPa": "ਕਿਰਪਾ ਕਰਕੇ; ਨਮਰ ਸ਼ਬਦ"
      },
      {
        "word": "stop",
        "meaningEn": "to end the ride at a place",
        "meaningPa": "ਰੁਕਣਾ; ਥਾਂ ਤੇ ਰੁਕ ਜਾਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "ride",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "visit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S03",
    "bundleId": 9,
    "orderInBundle": 3,
    "titleEn": "Book 9 · Story 3: Gurdwara Visit: Langar Line Rules",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 3: ਗੁਰਦੁਆਰਾ ਦੌਰਾ: ਲੰਗਰ ਦੀ ਕਤਾਰ",
    "englishStory": "Panel 1 (Intro): Today I visit the gurdwara with my family. The hall feels calm and quiet.\nPanel 2 (Body): First, Mom says, \"Cover your head and put your shoes in the rack.\" I say, \"Yes, Mom.\"\nPanel 3 (Body): Next, we stand in the langar line and wait our turn. I whisper, \"Please, may I sit here?\"\nPanel 4 (Body): Then the helper smiles and says, \"Yes, sit down and keep your plate ready.\" I say, \"Thank you.\"\nPanel 5 (Conclusion): After that, I help put cups in the bin and feel proud. I learn that respect means waiting and being kind to everyone.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਰਿਵਾਰ ਨਾਲ ਗੁਰਦੁਆਰੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਹਾਲ ਵਿੱਚ ਸ਼ਾਂਤ ਅਤੇ ਚੁੱਪ ਲੱਗਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਸਿਰ ਢੱਕੋ ਅਤੇ ਜੁੱਤੇ ਰੈਕ ਵਿੱਚ ਰੱਖੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹਾਂ ਮਾਂ ਜੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਲੰਗਰ ਦੀ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਆਪਣੀ ਵਾਰੀ ਉਡੀਕਦੇ ਹਾਂ। ਮੈਂ ਹੌਲੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਕਿਰਪਾ ਕਰਕੇ, ਕੀ ਮੈਂ ਇੱਥੇ ਬੈਠ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਸੇਵਾਦਾਰ ਮੁਸਕੁਰਾ ਕੇ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ, ਬੈਠ ਜਾਓ ਅਤੇ ਥਾਲੀ ਤਿਆਰ ਰੱਖੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਧੰਨਵਾਦ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਗਿਲਾਸ ਡੱਬੇ ਵਿੱਚ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਂ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹਾਂ ਕਿ ਆਦਰ ਦਾ ਮਤਲਬ ਹੈ ਉਡੀਕ ਕਰਨੀ ਅਤੇ ਸਭ ਨਾਲ ਦਇਆ ਕਰਨੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "gurdwara / ਗੁਰਦੁਆਰਾ",
          "cinema / ਸਿਨੇਮਾ",
          "zoo / ਚਿੜੀਆਘਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child visits the gurdwara. / ਪੈਨਲ 1 ਵਿੱਚ ਗੁਰਦੁਆਰੇ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first? / ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "cover head and place shoes / ਸਿਰ ਢੱਕਣਾ ਤੇ ਜੁੱਤੇ ਰੱਖਣਾ",
          "run loudly / ਉੱਚੀ ਦੌੜਣਾ",
          "push in line / ਕਤਾਰ ਧੱਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows head covering and shoes in the rack. / ਪੈਨਲ 2 ਵਿੱਚ ਸਿਰ ਢੱਕਣ ਅਤੇ ਜੁੱਤੇ ਰੱਖਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they do in the langar line? / ਲੰਗਰ ਦੀ ਕਤਾਰ ਵਿੱਚ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "wait turn / ਵਾਰੀ ਉਡੀਕਦੇ",
          "shout / ਚੀਕਦੇ",
          "sleep / ਸੌਂਦੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they wait their turn. / ਪੈਨਲ 3 ਵਿੱਚ ਵਾਰੀ ਉਡੀਕਦੇ ਹਨ।"
      },
      {
        "question": "Why does the child whisper? / ਬੱਚਾ ਹੌਲੀ ਕਿਉਂ ਬੋਲਦਾ/ਬੋਲਦੀ ਹੈ?",
        "choices": [
          "because it is quiet inside / ਕਿਉਂਕਿ ਅੰਦਰ ਚੁੱਪ ਹੈ",
          "because it is windy / ਕਿਉਂਕਿ ਹਵਾ ਹੈ",
          "because it is dark / ਕਿਉਂਕਿ ਹਨੇਰਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story shows a calm, quiet place, so a soft voice is respectful. / ਕਹਾਣੀ ਵਿੱਚ ਸ਼ਾਂਤ ਥਾਂ ਹੈ, ਇਸ ਲਈ ਹੌਲੀ ਆਵਾਜ਼ ਆਦਰ ਹੈ।"
      },
      {
        "question": "What does the child do at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "helps with cups / ਗਿਲਾਸ ਰੱਖਣ ਵਿੱਚ ਮਦਦ",
          "throws plates / ਥਾਲੀਆਂ ਸੁੱਟਦਾ",
          "runs away / ਭੱਜ ਜਾਂਦਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child helps put cups in the bin. / ਪੈਨਲ 5 ਵਿੱਚ ਗਿਲਾਸ ਡੱਬੇ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "gurdwara",
        "meaningEn": "a Sikh place of worship",
        "meaningPa": "ਗੁਰਦੁਆਰਾ; ਸਿੱਖਾਂ ਦਾ ਧਾਰਮਿਕ ਸਥਾਨ"
      },
      {
        "word": "langar",
        "meaningEn": "community meal served to everyone",
        "meaningPa": "ਲੰਗਰ; ਸਭ ਲਈ ਸਾਂਝਾ ਭੋਜਨ"
      },
      {
        "word": "line",
        "meaningEn": "people waiting in order",
        "meaningPa": "ਕਤਾਰ; ਲਾਈਨ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until your turn comes",
        "meaningPa": "ਉਡੀਕ ਕਰਨੀ; ਵਾਰੀ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      },
      {
        "word": "turn",
        "meaningEn": "your time to do something",
        "meaningPa": "ਵਾਰੀ; ਤੁਹਾਡਾ ਮੌਕਾ"
      },
      {
        "word": "whisper",
        "meaningEn": "speak very softly",
        "meaningPa": "ਫੁਸਫੁਸਾ ਕੇ ਬੋਲਣਾ; ਬਹੁਤ ਹੌਲੀ ਬੋਲਣਾ"
      },
      {
        "word": "helper",
        "meaningEn": "a person who helps",
        "meaningPa": "ਮਦਦਗਾਰ/ਸੇਵਾਦਾਰ; ਜੋ ਮਦਦ ਕਰੇ"
      },
      {
        "word": "plate",
        "meaningEn": "a dish for food",
        "meaningPa": "ਥਾਲੀ; ਖਾਣਾ ਰੱਖਣ ਵਾਲਾ ਬਰਤਨ"
      },
      {
        "word": "respect",
        "meaningEn": "show good manners",
        "meaningPa": "ਆਦਰ; ਸਲੀਕਾ ਅਤੇ ਸਨਮਾਨ"
      },
      {
        "word": "kindness",
        "meaningEn": "being nice and helpful",
        "meaningPa": "ਦਇਆ; ਚੰਗਾ ਅਤੇ ਮਦਦਗਾਰ ਹੋਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "visit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S04",
    "bundleId": 9,
    "orderInBundle": 4,
    "titleEn": "Book 9 · Story 4: Bus Stop: Which Bus Is Ours?",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 4: ਬੱਸ ਸਟਾਪ: ਸਾਡੀ ਬੱਸ ਕਿਹੜੀ ਹੈ?",
    "englishStory": "Panel 1 (Intro): Today I wait at the bus stop with my aunt. Many buses come and go.\nPanel 2 (Body): First, Aunt says, \"Stand behind the line and hold my hand.\" I say, \"Okay, I will stay close.\"\nPanel 3 (Body): Next, I read the bus number and ask, \"Excuse me, does this bus route go to City Park?\"\nPanel 4 (Body): Then the driver says, \"Yes, it goes there.\" Aunt says, \"Thank you,\" and we board calmly.\nPanel 5 (Conclusion): After that, I sit down and keep my bag close. I feel proud because I asked safely and used clear words.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਸੀ/ਚਾਚੀ ਨਾਲ ਬੱਸ ਸਟਾਪ ਤੇ ਉਡੀਕ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਕਈ ਬੱਸਾਂ ਆਉਂਦੀਆਂ ਤੇ ਜਾਂਦੀਆਂ ਹਨ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮਾਸੀ ਕਹਿੰਦੀ ਹੈ, \"ਲਾਈਨ ਦੇ ਪਿੱਛੇ ਖੜ੍ਹੋ ਅਤੇ ਮੇਰਾ ਹੱਥ ਫੜੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਠੀਕ ਹੈ, ਮੈਂ ਨੇੜੇ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਬੱਸ ਦਾ ਨੰਬਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਕੀ ਇਸ ਬੱਸ ਦਾ ਰੂਟ ਸਿਟੀ ਪਾਰਕ ਜਾਂਦਾ ਹੈ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਡਰਾਈਵਰ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ, ਜਾਂਦੀ ਹੈ।\" ਮਾਸੀ ਕਹਿੰਦੀ ਹੈ, \"ਧੰਨਵਾਦ,\" ਅਤੇ ਅਸੀਂ ਸ਼ਾਂਤ ਹੋ ਕੇ ਚੜ੍ਹਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਬੈਠਦਾ/ਬੈਠਦੀ ਹਾਂ ਅਤੇ ਬੈਗ ਨੇੜੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਪੁੱਛਿਆ ਅਤੇ ਸਾਫ਼ ਬੋਲਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where are they waiting? / ਉਹ ਕਿੱਥੇ ਉਡੀਕ ਕਰ ਰਹੇ ਹਨ?",
        "choices": [
          "bus stop / ਬੱਸ ਸਟਾਪ",
          "kitchen / ਰਸੋਈ",
          "park / ਪਾਰਕ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they wait at the bus stop. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਸ ਸਟਾਪ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first? / ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "hold aunt’s hand / ਮਾਸੀ ਦਾ ਹੱਥ ਫੜਨਾ",
          "run to the road / ਸੜਕ ਵੱਲ ਦੌੜਨਾ",
          "push people / ਲੋਕਾਂ ਨੂੰ ਧੱਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows holding the adult’s hand for safety. / ਪੈਨਲ 2 ਵਿੱਚ ਸੁਰੱਖਿਆ ਲਈ ਵੱਡੇ ਦਾ ਹੱਥ ਫੜਦਾ/ਫੜਦੀ ਹੈ।"
      },
      {
        "question": "Who answers the question? / ਸਵਾਲ ਦਾ ਜਵਾਬ ਕੌਣ ਦਿੰਦਾ ਹੈ?",
        "choices": [
          "driver / ਡਰਾਈਵਰ",
          "chef / ਰਸੋਈਆ",
          "teacher / ਟੀਚਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the driver answers. / ਪੈਨਲ 4 ਵਿੱਚ ਡਰਾਈਵਰ ਜਵਾਬ ਦਿੰਦਾ ਹੈ।"
      },
      {
        "question": "Why does the child ask the driver? / ਬੱਚਾ ਡਰਾਈਵਰ ਨੂੰ ਕਿਉਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ?",
        "choices": [
          "to check the bus route / ਬੱਸ ਦਾ ਰੂਟ ਚੈੱਕ ਕਰਨ ਲਈ",
          "to get candy / ਕੈਂਡੀ ਲਈ",
          "to be noisy / ਸ਼ੋਰ ਕਰਨ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The child asks to make sure the bus goes to the right place. / ਬੱਚਾ ਪੱਕਾ ਕਰਨ ਲਈ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "What does the child do after boarding? / ਚੜ੍ਹਨ ਤੋਂ ਬਾਅਦ ਬੱਚਾ ਕੀ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "sits and keeps bag close / ਬੈਠ ਕੇ ਬੈਗ ਨੇੜੇ ਰੱਖਦਾ",
          "stands on seat / ਸੀਟ ਤੇ ਖੜ੍ਹਦਾ",
          "shouts / ਚੀਕਦਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child sits and keeps the bag close. / ਪੈਨਲ 5 ਵਿੱਚ ਬੈਠ ਕੇ ਬੈਗ ਨੇੜੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "bus stop",
        "meaningEn": "a place where buses pick people up",
        "meaningPa": "ਬੱਸ ਸਟਾਪ; ਬੱਸ ਚੜ੍ਹਨ ਦੀ ਥਾਂ"
      },
      {
        "word": "line",
        "meaningEn": "people waiting in order",
        "meaningPa": "ਕਤਾਰ; ਲਾਈਨ"
      },
      {
        "word": "hold hands",
        "meaningEn": "hold an adult’s hand for safety",
        "meaningPa": "ਹੱਥ ਫੜਨਾ; ਸੁਰੱਖਿਆ ਲਈ ਵੱਡੇ ਦਾ ਹੱਥ ਫੜਨਾ"
      },
      {
        "word": "number",
        "meaningEn": "the bus number",
        "meaningPa": "ਨੰਬਰ; ਬੱਸ ਦਾ ਨੰਬਰ"
      },
      {
        "word": "route",
        "meaningEn": "the path the bus takes",
        "meaningPa": "ਰੂਟ; ਬੱਸ ਦਾ ਰਸਤਾ"
      },
      {
        "word": "board",
        "meaningEn": "get on the bus",
        "meaningPa": "ਚੜ੍ਹਨਾ; ਬੱਸ ਵਿੱਚ ਚੜ੍ਹਨਾ"
      },
      {
        "word": "seat",
        "meaningEn": "a place to sit",
        "meaningPa": "ਸੀਟ; ਬੈਠਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "bag",
        "meaningEn": "a school bag or carry bag",
        "meaningPa": "ਬੈਗ; ਥੈਲਾ"
      },
      {
        "word": "ask",
        "meaningEn": "say a question",
        "meaningPa": "ਪੁੱਛਣਾ; ਸਵਾਲ ਕਰਨਾ"
      },
      {
        "word": "clear",
        "meaningEn": "easy to understand",
        "meaningPa": "ਸਾਫ਼; ਸਮਝਣ ਵਿੱਚ ਆਸਾਨ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "come",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S05",
    "bundleId": 9,
    "orderInBundle": 5,
    "titleEn": "Book 9 · Story 5: Railway Station: Finding the Platform",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 5: ਰੇਲਵੇ ਸਟੇਸ਼ਨ: ਪਲੇਟਫਾਰਮ ਲੱਭਣਾ",
    "englishStory": "Panel 1 (Intro): Today I go to the railway station with my mom. It is busy, so we stay close.\nPanel 2 (Body): First, Mom says, \"Hold my hand and do not run.\" I say, \"I will stay with you.\"\nPanel 3 (Body): Next, I ask a staff member, \"Excuse me, which platform is the Amritsar train?\"\nPanel 4 (Body): Then he says, \"Platform two, go straight and follow the sign.\" Mom says, \"Thank you,\" and we walk calmly.\nPanel 5 (Conclusion): After that, we find platform two and wait near our coach. I feel proud because I asked and followed signs.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਂ ਨਾਲ ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ। ਭੀੜ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਨੇੜੇ ਰਹਿੰਦੇ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਮੇਰਾ ਹੱਥ ਫੜੋ ਅਤੇ ਨਾ ਦੌੜੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਤੁਹਾਡੇ ਨਾਲ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਸਟਾਫ਼ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਅੰਮ੍ਰਿਤਸਰ ਵਾਲੀ ਰੇਲ ਕਿਹੜੇ ਪਲੇਟਫਾਰਮ ਤੇ ਹੈ?\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਉਹ ਕਹਿੰਦਾ ਹੈ, \"ਪਲੇਟਫਾਰਮ ਦੋ, ਸਿੱਧੇ ਜਾਓ ਅਤੇ ਸਾਈਨ ਦੇਖੋ।\" ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਧੰਨਵਾਦ,\" ਅਤੇ ਅਸੀਂ ਹੌਲੀ ਤੁਰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਪਲੇਟਫਾਰਮ ਦੋ ਲੱਭ ਲੈਂਦੇ ਹਾਂ ਅਤੇ ਆਪਣੇ ਕੋਚ ਕੋਲ ਉਡੀਕ ਕਰਦੇ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਪੁੱਛਿਆ ਅਤੇ ਸਾਈਨ ਮੰਨੇ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "railway station / ਰੇਲਵੇ ਸਟੇਸ਼ਨ",
          "school / ਸਕੂਲ",
          "home / ਘਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they are at the railway station. / ਪੈਨਲ 1 ਵਿੱਚ ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first in the crowd? / ਭੀੜ ਵਿੱਚ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "hold mom’s hand / ਮਾਂ ਦਾ ਹੱਥ ਫੜਨਾ",
          "run ahead / ਅੱਗੇ ਦੌੜਣਾ",
          "sit on floor / ਫਰਸ਼ ਤੇ ਬੈਠਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to hold Mom’s hand and not run. / ਪੈਨਲ 2 ਵਿੱਚ ਮਾਂ ਦਾ ਹੱਥ ਫੜ ਕੇ ਨਾ ਦੌੜਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who helps with information? / ਜਾਣਕਾਰੀ ਕੌਣ ਦਿੰਦਾ ਹੈ?",
        "choices": [
          "staff member / ਸਟਾਫ਼",
          "cook / ਰਸੋਈਆ",
          "friend / ਦੋਸਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child asks a staff member. / ਪੈਨਲ 3 ਵਿੱਚ ਸਟਾਫ਼ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ।"
      },
      {
        "question": "Why do they follow the sign? / ਉਹ ਸਾਈਨ ਕਿਉਂ ਮੰਨਦੇ ਹਨ?",
        "choices": [
          "to reach the platform / ਪਲੇਟਫਾਰਮ ਤੱਕ ਪਹੁੰਚਣ ਲਈ",
          "to lose the train / ਰੇਲ ਛੱਡਣ ਲਈ",
          "to play games / ਖੇਡਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Following signs helps them reach the correct platform. / ਸਾਈਨ ਮੰਨਣ ਨਾਲ ਸਹੀ ਪਲੇਟਫਾਰਮ ਮਿਲਦਾ ਹੈ।"
      },
      {
        "question": "Which platform do they find? / ਉਹ ਕਿਹੜਾ ਪਲੇਟਫਾਰਮ ਲੱਭਦੇ ਹਨ?",
        "choices": [
          "platform two / ਪਲੇਟਫਾਰਮ ਦੋ",
          "platform ten / ਪਲੇਟਫਾਰਮ ਦਸ",
          "platform zero / ਪਲੇਟਫਾਰਮ ਸਿਫ਼ਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they find platform two. / ਪੈਨਲ 5 ਵਿੱਚ ਪਲੇਟਫਾਰਮ ਦੋ ਲੱਭਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "station",
        "meaningEn": "a place where trains arrive and leave",
        "meaningPa": "ਸਟੇਸ਼ਨ; ਰੇਲ ਆਉਣ-ਜਾਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "platform",
        "meaningEn": "the place beside the train",
        "meaningPa": "ਪਲੇਟਫਾਰਮ; ਰੇਲ ਦੇ ਨਾਲ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "staff",
        "meaningEn": "people who work there",
        "meaningPa": "ਸਟਾਫ਼; ਉੱਥੇ ਕੰਮ ਕਰਨ ਵਾਲੇ"
      },
      {
        "word": "sign",
        "meaningEn": "a board that shows directions",
        "meaningPa": "ਸਾਈਨ; ਰਸਤਾ ਦੱਸਣ ਵਾਲਾ ਬੋਰਡ"
      },
      {
        "word": "follow",
        "meaningEn": "go the same way",
        "meaningPa": "ਮੰਨਣਾ/ਪਿੱਛੇ ਕਰਨਾ; ਉਸੇ ਰਸਤੇ ਜਾਣਾ"
      },
      {
        "word": "coach",
        "meaningEn": "a train car",
        "meaningPa": "ਕੋਚ; ਰੇਲ ਦਾ ਡੱਬਾ"
      },
      {
        "word": "busy",
        "meaningEn": "many people and movement",
        "meaningPa": "ਭੀੜ ਵਾਲਾ; ਬਹੁਤ ਲੋਕ"
      },
      {
        "word": "hold",
        "meaningEn": "keep in your hand",
        "meaningPa": "ਫੜਨਾ; ਹੱਥ ਵਿੱਚ ਰੱਖਣਾ"
      },
      {
        "word": "ask",
        "meaningEn": "say a question",
        "meaningPa": "ਪੁੱਛਣਾ; ਸਵਾਲ ਕਰਨਾ"
      },
      {
        "word": "wait",
        "meaningEn": "stay until it is time",
        "meaningPa": "ਉਡੀਕ; ਸਮਾਂ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S06",
    "bundleId": 9,
    "orderInBundle": 6,
    "titleEn": "Book 9 · Story 6: Clinic Visit: Simple Symptoms",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 6: ਕਲੀਨਿਕ ਦੌਰਾ: ਸਧਾਰਣ ਲੱਛਣ",
    "englishStory": "Panel 1 (Intro): Today I go to the clinic with my dad because my throat hurts. I feel tired.\nPanel 2 (Body): First, Dad says, \"Speak clearly to the nurse.\" I say, \"Okay, I will use my words.\"\nPanel 3 (Body): Next, I tell the nurse, \"My throat hurts, and I have a small cough.\" She says, \"Thank you for telling me.\"\nPanel 4 (Body): Then the doctor says, \"Drink warm water and rest today.\" Dad says, \"We will follow your advice.\"\nPanel 5 (Conclusion): After that, I rest at home and feel better. I feel proud because I explained my problem politely.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਿਉ ਨਾਲ ਕਲੀਨਿਕ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੇਰਾ ਗਲਾ ਦਰਦ ਕਰਦਾ ਹੈ। ਮੈਂ ਥੱਕਿਆ/ਥੱਕੀ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਨਰਸ ਨੂੰ ਸਾਫ਼ ਬੋਲ ਕੇ ਦੱਸੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਠੀਕ ਹੈ, ਮੈਂ ਸ਼ਬਦਾਂ ਨਾਲ ਦੱਸਾਂਗਾ/ਦੱਸਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਨਰਸ ਨੂੰ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਗਲਾ ਦਰਦ ਕਰਦਾ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਹਲਕੀ ਖਾਂਸੀ ਹੈ।\" ਨਰਸ ਕਹਿੰਦੀ ਹੈ, \"ਦੱਸਣ ਲਈ ਧੰਨਵਾਦ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਡਾਕਟਰ ਕਹਿੰਦੇ ਹਨ, \"ਗੁੰਮਗਰਮ ਪਾਣੀ ਪੀਓ ਅਤੇ ਅੱਜ ਆਰਾਮ ਕਰੋ।\" ਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਤੁਹਾਡੀ ਸਲਾਹ ਮੰਨਾਂਗੇ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਘਰ ਵਿੱਚ ਆਰਾਮ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਅਤੇ ਚੰਗਾ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ। ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਨਮਰਤਾ ਨਾਲ ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child go? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "clinic / ਕਲੀਨਿਕ",
          "bazaar / ਬਾਜ਼ਾਰ",
          "train / ਰੇਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child goes to the clinic. / ਪੈਨਲ 1 ਵਿੱਚ ਕਲੀਨਿਕ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first at the clinic? / ਕਲੀਨਿਕ ਵਿੱਚ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "speak clearly / ਸਾਫ਼ ਬੋਲਣਾ",
          "hide / ਲੁਕਣਾ",
          "shout / ਚੀਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to speak clearly to the nurse. / ਪੈਨਲ 2 ਵਿੱਚ ਨਰਸ ਨੂੰ ਸਾਫ਼ ਦੱਸਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who does the child talk to? / ਬੱਚਾ ਕਿਸ ਨਾਲ ਗੱਲ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "nurse / ਨਰਸ",
          "driver / ਡਰਾਈਵਰ",
          "guard / ਗਾਰਡ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child talks to the nurse. / ਪੈਨਲ 3 ਵਿੱਚ ਨਰਸ ਨਾਲ ਗੱਲ ਹੁੰਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child go to the clinic? / ਬੱਚਾ ਕਲੀਨਿਕ ਕਿਉਂ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "because throat hurts / ਕਿਉਂਕਿ ਗਲਾ ਦਰਦ",
          "because wants toys / ਕਿਉਂਕਿ ਖਿਡੌਣੇ",
          "because late bus / ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the throat hurts. / ਪੈਨਲ 1 ਵਿੱਚ ਗਲੇ ਦੇ ਦਰਦ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does Dad say? / ਪਿਉ ਕੀ ਕਹਿੰਦਾ ਹੈ?",
        "choices": [
          "We will follow your advice / ਅਸੀਂ ਤੁਹਾਡੀ ਸਲਾਹ ਮੰਨਾਂਗੇ",
          "We will run fast / ਅਸੀਂ ਤੇਜ਼ ਦੌੜਾਂਗੇ",
          "We will shout / ਅਸੀਂ ਚੀਕਾਂਗੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says Dad will follow the doctor’s advice. / ਪੈਨਲ 4 ਵਿੱਚ ਪਿਉ ਸਲਾਹ ਮੰਨਣ ਦੀ ਗੱਲ ਕਰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "clinic",
        "meaningEn": "a place to see a doctor",
        "meaningPa": "ਕਲੀਨਿਕ; ਡਾਕਟਰ ਨੂੰ ਮਿਲਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "nurse",
        "meaningEn": "a helper in a clinic or hospital",
        "meaningPa": "ਨਰਸ; ਕਲੀਨਿਕ ਵਿੱਚ ਮਦਦਗਾਰ"
      },
      {
        "word": "doctor",
        "meaningEn": "a person who helps sick people",
        "meaningPa": "ਡਾਕਟਰ; ਬਿਮਾਰ ਨੂੰ ਸਹਾਇਤਾ ਕਰਨ ਵਾਲਾ"
      },
      {
        "word": "throat",
        "meaningEn": "part inside your neck",
        "meaningPa": "ਗਲਾ; ਗਰਦਨ ਅੰਦਰਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "hurt",
        "meaningEn": "feel pain",
        "meaningPa": "ਦਰਦ ਕਰਨਾ; ਪੀੜ ਹੋਣੀ"
      },
      {
        "word": "cough",
        "meaningEn": "a sound when you are sick",
        "meaningPa": "ਖਾਂਸੀ; ਬਿਮਾਰੀ ਵਾਲੀ ਖੰਘ"
      },
      {
        "word": "rest",
        "meaningEn": "relax and sleep to feel better",
        "meaningPa": "ਆਰਾਮ; ਸਰੀਰ ਨੂੰ ਸੁਕੂਨ"
      },
      {
        "word": "warm",
        "meaningEn": "not cold",
        "meaningPa": "ਗੁੰਮਗਰਮ; ਠੰਢਾ ਨਹੀਂ"
      },
      {
        "word": "clearly",
        "meaningEn": "in an easy-to-understand way",
        "meaningPa": "ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ; ਸਮਝ ਆਵੇ ਤਰ੍ਹਾਂ"
      },
      {
        "word": "advice",
        "meaningEn": "helpful words from an expert",
        "meaningPa": "ਸਲਾਹ; ਮਦਦ ਵਾਲੀ ਗੱਲ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S07",
    "bundleId": 9,
    "orderInBundle": 7,
    "titleEn": "Book 9 · Story 7: Chemist Shop: Bandage and ORS",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 7: ਕੈਮਿਸਟ: ਪੱਟੀ ਅਤੇ ORS",
    "englishStory": "Panel 1 (Intro): Today I go to the chemist with my mom because I got a small scrape.\nPanel 2 (Body): First, Mom says, \"Stay close to me and wait your turn.\" I say, \"Okay, Mom.\"\nPanel 3 (Body): Next, Mom says, \"We need a bandage and ORS, please.\" The chemist says, \"Sure, one moment.\"\nPanel 4 (Body): Then Mom asks, \"How much is it?\" The chemist answers, and Mom pays carefully.\nPanel 5 (Conclusion): After that, I say, \"Thank you,\" and we go home. I feel safe because I stayed with my mom.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮਾਂ ਨਾਲ ਕੈਮਿਸਟ ਕੋਲ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਨੂੰ ਹਲਕੀ ਖਰੋਚ ਲੱਗੀ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਮੇਰੇ ਨੇੜੇ ਰਹੋ ਅਤੇ ਆਪਣੀ ਵਾਰੀ ਉਡੀਕੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਠੀਕ ਹੈ ਮਾਂ ਜੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮਾਂ ਕਹਿੰਦੀ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਪੱਟੀ ਅਤੇ ORS ਦੇ ਦਿਓ।\" ਕੈਮਿਸਟ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ ਜੀ, ਇਕ ਮਿੰਟ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮਾਂ ਪੁੱਛਦੀ ਹੈ, \"ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?\" ਕੈਮਿਸਟ ਜਵਾਬ ਦਿੰਦਾ ਹੈ, ਅਤੇ ਮਾਂ ਧਿਆਨ ਨਾਲ ਭੁਗਤਾਨ ਕਰਦੀ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਧੰਨਵਾਦ,\" ਅਤੇ ਅਸੀਂ ਘਰ ਜਾਂਦੇ ਹਾਂ। ਮੈਨੂੰ ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਮਾਂ ਨਾਲ ਰਹਿਆ/ਰਹੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they go? / ਉਹ ਕਿੱਥੇ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "chemist / ਕੈਮਿਸਟ",
          "bus stop / ਬੱਸ ਸਟਾਪ",
          "gurdwara / ਗੁਰਦੁਆਰਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they go to the chemist. / ਪੈਨਲ 1 ਵਿੱਚ ਕੈਮਿਸਟ ਜਾਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first in the shop? / ਦੁਕਾਨ ਵਿੱਚ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "stay close and wait / ਨੇੜੇ ਰਹਿ ਕੇ ਉਡੀਕ",
          "run outside / ਬਾਹਰ ਦੌੜਣਾ",
          "touch everything / ਸਭ ਛੂਹਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says stay close and wait your turn. / ਪੈਨਲ 2 ਵਿੱਚ ਨੇੜੇ ਰਹਿ ਕੇ ਵਾਰੀ ਉਡੀਕਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they ask for? / ਉਹ ਕੀ ਮੰਗਦੇ ਹਨ?",
        "choices": [
          "bandage and ORS / ਪੱਟੀ ਅਤੇ ORS",
          "toy car / ਖਿਡੌਣਾ ਗੱਡੀ",
          "ice cream / ਆਈਸ ਕ੍ਰੀਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they need a bandage and ORS. / ਪੈਨਲ 3 ਵਿੱਚ ਪੱਟੀ ਅਤੇ ORS ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why do they go to the chemist? / ਉਹ ਕੈਮਿਸਟ ਕਿਉਂ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "because of a scrape / ਕਿਉਂਕਿ ਖਰੋਚ",
          "because of homework / ਕਿਉਂਕਿ ਹੋਮਵਰਕ",
          "because of rain / ਕਿਉਂਕਿ ਮੀਂਹ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child got a small scrape. / ਪੈਨਲ 1 ਵਿੱਚ ਖਰੋਚ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does the child say at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "Thank you / ਧੰਨਵਾਦ",
          "Go away / ਦੂਰ ਜਾਓ",
          "No / ਨਹੀਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child says thank you. / ਪੈਨਲ 5 ਵਿੱਚ ਧੰਨਵਾਦ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "chemist",
        "meaningEn": "a shop that sells health items",
        "meaningPa": "ਕੈਮਿਸਟ; ਸਿਹਤ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਦੀ ਦੁਕਾਨ"
      },
      {
        "word": "bandage",
        "meaningEn": "a strip to cover a small wound",
        "meaningPa": "ਪੱਟੀ; ਚੋਟ ਢੱਕਣ ਵਾਲੀ ਪੱਟੀ"
      },
      {
        "word": "scrape",
        "meaningEn": "a small skin scratch",
        "meaningPa": "ਖਰੋਚ; ਚਮੜੀ ਦੀ ਹਲਕੀ ਚੋਟ"
      },
      {
        "word": "ORS",
        "meaningEn": "drink to help with dehydration (with adult)",
        "meaningPa": "ORS; ਪਾਣੀ ਦੀ ਘਾਟ ਲਈ ਪੇਯ (ਵੱਡੇ ਨਾਲ)"
      },
      {
        "word": "wait",
        "meaningEn": "stay until your turn",
        "meaningPa": "ਉਡੀਕ; ਵਾਰੀ ਆਉਣ ਤੱਕ ਰੁਕਣਾ"
      },
      {
        "word": "turn",
        "meaningEn": "your time",
        "meaningPa": "ਵਾਰੀ; ਤੁਹਾਡਾ ਮੌਕਾ"
      },
      {
        "word": "price",
        "meaningEn": "how much it costs",
        "meaningPa": "ਕੀਮਤ; ਕਿੰਨੇ ਦਾ"
      },
      {
        "word": "pay",
        "meaningEn": "give money for something",
        "meaningPa": "ਭੁਗਤਾਨ ਕਰਨਾ; ਪੈਸੇ ਦੇਣਾ"
      },
      {
        "word": "careful",
        "meaningEn": "not rushed; safe",
        "meaningPa": "ਧਿਆਨ ਨਾਲ; ਸਾਵਧਾਨ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "go",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "close",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S08",
    "bundleId": 9,
    "orderInBundle": 8,
    "titleEn": "Book 9 · Story 8: Library: Finding a Book",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 8: ਲਾਇਬ੍ਰੇਰੀ: ਕਿਤਾਬ ਲੱਭਣਾ",
    "englishStory": "Panel 1 (Intro): Today I visit the library with my dad to find a science book. The room is quiet.\nPanel 2 (Body): First, Dad whispers, \"Use a soft voice here.\" I whisper, \"Yes, Dad, I will be quiet.\"\nPanel 3 (Body): Next, I ask the librarian, \"Excuse me, where are the science books for kids?\" She says, \"Aisle three, on the left.\"\nPanel 4 (Body): Then I walk to aisle three and look on the shelf. I find a book with pictures. I say, \"I found it!\" and Dad smiles.\nPanel 5 (Conclusion): After that, we check out the book and say, \"Thank you.\" I feel proud because I asked politely and used a quiet voice.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਿਉ ਨਾਲ ਲਾਇਬ੍ਰੇਰੀ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਤਾਂ ਜੋ ਸਾਇੰਸ ਦੀ ਕਿਤਾਬ ਲੱਭੀਏ। ਕਮਰਾ ਚੁੱਪ ਲੱਗਦਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਪਿਉ ਫੁਸਫੁਸਾ ਕੇ ਕਹਿੰਦਾ ਹੈ, \"ਇੱਥੇ ਹੌਲੀ ਆਵਾਜ਼ ਵਰਤੋ।\" ਮੈਂ ਹੌਲੀ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਜੀ ਪਿਉ ਜੀ, ਮੈਂ ਚੁੱਪ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਲਾਇਬ੍ਰੇਰੀਅਨ ਨੂੰ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਬੱਚਿਆਂ ਲਈ ਸਾਇੰਸ ਦੀਆਂ ਕਿਤਾਬਾਂ ਕਿੱਥੇ ਹਨ?\" ਉਹ ਕਹਿੰਦੀ ਹੈ, \"ਅਇਜ਼ਲ ਤਿੰਨ, ਖੱਬੇ ਪਾਸੇ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅਇਜ਼ਲ ਤਿੰਨ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ ਅਤੇ ਸ਼ੈਲਫ਼ ਉੱਤੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ। ਮੈਂ ਤਸਵੀਰਾਂ ਵਾਲੀ ਕਿਤਾਬ ਲੱਭ ਲੈਂਦਾ/ਲੱਭ ਲੈਂਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮਿਲ ਗਈ!\" ਅਤੇ ਪਿਉ ਮੁਸਕੁਰਾਉਂਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਕਿਤਾਬ ਇਸ਼ੂ ਕਰਵਾਂਦੇ ਹਾਂ ਅਤੇ ਕਹਿੰਦੇ ਹਾਂ, \"ਧੰਨਵਾਦ।\" ਮੈਨੂੰ ਮਾਣ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਨਮਰਤਾ ਨਾਲ ਪੁੱਛਿਆ ਅਤੇ ਹੌਲੀ ਬੋਲਿਆ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where are they? / ਉਹ ਕਿੱਥੇ ਹਨ?",
        "choices": [
          "library / ਲਾਇਬ੍ਰੇਰੀ",
          "bazaar / ਬਾਜ਼ਾਰ",
          "station / ਸਟੇਸ਼ਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they are in the library. / ਪੈਨਲ 1 ਵਿੱਚ ਲਾਇਬ੍ਰੇਰੀ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first in the library? / ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "use a quiet voice / ਹੌਲੀ ਆਵਾਜ਼",
          "shout loudly / ਉੱਚਾ ਚੀਕਣਾ",
          "run fast / ਤੇਜ਼ ਦੌੜਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says to use a soft voice. / ਪੈਨਲ 2 ਵਿੱਚ ਹੌਲੀ ਆਵਾਜ਼ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who helps the child find the aisle? / ਅਇਜ਼ਲ ਕੌਣ ਦੱਸਦਾ ਹੈ?",
        "choices": [
          "librarian / ਲਾਇਬ੍ਰੇਰੀਅਨ",
          "driver / ਡਰਾਈਵਰ",
          "guard / ਗਾਰਡ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the librarian gives the aisle number. / ਪੈਨਲ 3 ਵਿੱਚ ਲਾਇਬ੍ਰੇਰੀਅਨ ਅਇਜ਼ਲ ਦੱਸਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child ask \"Excuse me\"? / ਬੱਚਾ \"Excuse me\" ਕਿਉਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹੈ?",
        "choices": [
          "to be polite / ਨਮਰ ਹੋਣ ਲਈ",
          "to be rude / ਬਦਤਮੀਜ਼ੀ ਲਈ",
          "to be loud / ਸ਼ੋਰ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "\"Excuse me\" is polite when asking for help. / \"Excuse me\" ਮਦਦ ਮੰਗਦੇ ਸਮੇਂ ਨਮਰਤਾ ਹੈ।"
      },
      {
        "question": "What do they do at the end? / ਅੰਤ ਵਿੱਚ ਉਹ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "check out the book / ਕਿਤਾਬ ਇਸ਼ੂ ਕਰਵਾਉਂਦੇ",
          "throw the book / ਕਿਤਾਬ ਸੁੱਟਦੇ",
          "hide the book / ਕਿਤਾਬ ਲੁਕਾਉਂਦੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says they check out the book and say thank you. / ਪੈਨਲ 5 ਵਿੱਚ ਕਿਤਾਬ ਇਸ਼ੂ ਕਰਵਾਉਂਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "library",
        "meaningEn": "a place to borrow books",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀ; ਕਿਤਾਬਾਂ ਲੈਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "librarian",
        "meaningEn": "a helper who works in a library",
        "meaningPa": "ਲਾਇਬ੍ਰੇਰੀਅਨ; ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਮਦਦਗਾਰ"
      },
      {
        "word": "aisle",
        "meaningEn": "a row/path between shelves",
        "meaningPa": "ਅਇਜ਼ਲ; ਸ਼ੈਲਫ਼ਾਂ ਵਿਚਕਾਰ ਰਸਤਾ"
      },
      {
        "word": "shelf",
        "meaningEn": "a place where books sit",
        "meaningPa": "ਸ਼ੈਲਫ਼; ਕਿਤਾਬਾਂ ਰੱਖਣ ਦੀ ਥਾਂ"
      },
      {
        "word": "whisper",
        "meaningEn": "speak very softly",
        "meaningPa": "ਫੁਸਫੁਸਾ ਕੇ ਬੋਲਣਾ; ਬਹੁਤ ਹੌਲੀ"
      },
      {
        "word": "quiet",
        "meaningEn": "not loud",
        "meaningPa": "ਚੁੱਪ; ਉੱਚਾ ਨਹੀਂ"
      },
      {
        "word": "find",
        "meaningEn": "discover after looking",
        "meaningPa": "ਲੱਭਣਾ; ਵੇਖ ਕੇ ਮਿਲਣਾ"
      },
      {
        "word": "science",
        "meaningEn": "learning about the world",
        "meaningPa": "ਸਾਇੰਸ; ਦੁਨੀਆ ਬਾਰੇ ਸਿੱਖਣਾ"
      },
      {
        "word": "picture",
        "meaningEn": "an image",
        "meaningPa": "ਤਸਵੀਰ; ਚਿੱਤਰ"
      },
      {
        "word": "check out",
        "meaningEn": "borrow a book officially",
        "meaningPa": "ਇਸ਼ੂ ਕਰਵਾਉਣਾ; ਕਿਤਾਬ ਲੈ ਜਾਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "visit",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "find",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S09",
    "bundleId": 9,
    "orderInBundle": 9,
    "titleEn": "Book 9 · Story 9: Society Gate: Talking to the Guard",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 9: ਸੋਸਾਇਟੀ ਗੇਟ: ਗਾਰਡ ਨਾਲ ਗੱਲ",
    "englishStory": "Panel 1 (Intro): Today I come home with my grandma, and we reach the society gate. The guard is at his desk.\nPanel 2 (Body): First, Grandma says, \"Stand beside me and wait calmly.\" I say, \"Okay, Grandma.\"\nPanel 3 (Body): Next, the guard asks, \"Which flat are you going to?\" Grandma says, \"Flat 302, please.\"\nPanel 4 (Body): Then I add, \"My parent will meet us upstairs.\" The guard says, \"Okay, you may enter,\" and opens the gate.\nPanel 5 (Conclusion): After that, we enter the society and feel safe. I learn to speak clearly with helpers and stay with my adult.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦਾਦੀ/ਨਾਨੀ ਨਾਲ ਘਰ ਆਉਂਦਾ/ਆਉਂਦੀ ਹਾਂ, ਅਤੇ ਅਸੀਂ ਸੋਸਾਇਟੀ ਦੇ ਗੇਟ ਤੇ ਪਹੁੰਚਦੇ ਹਾਂ। ਗਾਰਡ ਆਪਣੀ ਮੇਜ਼ ਤੇ ਬੈਠਾ ਹੈ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਦਾਦੀ ਕਹਿੰਦੀ ਹੈ, \"ਮੇਰੇ ਕੋਲ ਖੜ੍ਹੋ ਅਤੇ ਸ਼ਾਂਤ ਉਡੀਕ ਕਰੋ।\" ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਠੀਕ ਹੈ ਦਾਦੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਗਾਰਡ ਪੁੱਛਦਾ ਹੈ, \"ਤੁਸੀਂ ਕਿਹੜੇ ਫਲੈਟ ਵਿੱਚ ਜਾਣਾ ਹੈ?\" ਦਾਦੀ ਕਹਿੰਦੀ ਹੈ, \"ਫਲੈਟ 302, ਕਿਰਪਾ ਕਰਕੇ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਮੰਮੀ/ਡੈਡੀ ਉੱਪਰ ਸਾਨੂੰ ਮਿਲਣਗੇ।\" ਗਾਰਡ ਕਹਿੰਦਾ ਹੈ, \"ਠੀਕ ਹੈ, ਤੁਸੀਂ ਅੰਦਰ ਦਾਖ਼ਲ ਹੋ ਸਕਦੇ ਹੋ,\" ਅਤੇ ਗੇਟ ਖੋਲ੍ਹ ਦਿੰਦਾ ਹੈ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਸੋਸਾਇਟੀ ਵਿੱਚ ਦਾਖ਼ਲ ਹੋ ਜਾਂਦੇ ਹਾਂ ਅਤੇ ਮੈਨੂੰ ਸੁਰੱਖਿਅਤ ਲੱਗਦਾ ਹੈ। ਮੈਂ ਸਿੱਖਦਾ/ਸਿੱਖਦੀ ਹਾਂ ਕਿ ਮਦਦਗਾਰਾਂ ਨਾਲ ਸਾਫ਼ ਬੋਲਣਾ ਅਤੇ ਆਪਣੇ ਵੱਡੇ ਨਾਲ ਰਹਿਣਾ ਚੰਗਾ ਹੈ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where are they? / ਉਹ ਕਿੱਥੇ ਹਨ?",
        "choices": [
          "society gate / ਸੋਸਾਇਟੀ ਗੇਟ",
          "bus stop / ਬੱਸ ਸਟਾਪ",
          "bazaar / ਬਾਜ਼ਾਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they reach the society gate. / ਪੈਨਲ 1 ਵਿੱਚ ਸੋਸਾਇਟੀ ਗੇਟ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first? / ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "stand beside grandma / ਦਾਦੀ ਦੇ ਕੋਲ ਖੜ੍ਹਨਾ",
          "run inside alone / ਇਕੱਲਾ ਅੰਦਰ ਦੌੜਨਾ",
          "argue with guard / ਗਾਰਡ ਨਾਲ ਝਗੜਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says stand beside Grandma and wait calmly. / ਪੈਨਲ 2 ਵਿੱਚ ਦਾਦੀ ਦੇ ਕੋਲ ਸ਼ਾਂਤ ਖੜ੍ਹਨ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who asks the question about the flat? / ਫਲੈਟ ਬਾਰੇ ਸਵਾਲ ਕੌਣ ਕਰਦਾ ਹੈ?",
        "choices": [
          "guard / ਗਾਰਡ",
          "doctor / ਡਾਕਟਰ",
          "shopkeeper / ਦੁਕਾਨਦਾਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the guard asks which flat they are going to. / ਪੈਨਲ 3 ਵਿੱਚ ਗਾਰਡ ਪੁੱਛਦਾ ਹੈ।"
      },
      {
        "question": "Why do they tell the flat number? / ਉਹ ਫਲੈਟ ਨੰਬਰ ਕਿਉਂ ਦੱਸਦੇ ਹਨ?",
        "choices": [
          "so the guard can allow entry / ਤਾਂ ਜੋ ਗਾਰਡ ਅੰਦਰ ਜਾਣ ਦੇਵੇ",
          "so they get lost / ਤਾਂ ਜੋ ਗੁੰਮ ਹੋਣ",
          "so it rains / ਤਾਂ ਜੋ ਮੀਂਹ ਪਵੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Telling the flat number helps the guard know where they are going. / ਫਲੈਟ ਨੰਬਰ ਨਾਲ ਗਾਰਡ ਨੂੰ ਪਤਾ ਲੱਗਦਾ ਹੈ।"
      },
      {
        "question": "What happens after that? / ਉਸ ਤੋਂ ਬਾਅਦ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "gate opens / ਗੇਟ ਖੁਲਦਾ ਹੈ",
          "bus arrives / ਬੱਸ ਆਉਂਦੀ ਹੈ",
          "train leaves / ਰੇਲ ਜਾਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says the guard opens the gate. / ਪੈਨਲ 4 ਵਿੱਚ ਗਾਰਡ ਗੇਟ ਖੋਲ੍ਹ ਦਿੰਦਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "society",
        "meaningEn": "a group of apartments with a gate",
        "meaningPa": "ਸੋਸਾਇਟੀ; ਗੇਟ ਵਾਲੇ ਫਲੈਟਾਂ ਦੀ ਥਾਂ"
      },
      {
        "word": "gate",
        "meaningEn": "an entry door for a place",
        "meaningPa": "ਗੇਟ; ਅੰਦਰ ਜਾਣ ਦਾ ਦਰਵਾਜ਼ਾ"
      },
      {
        "word": "guard",
        "meaningEn": "a person who keeps the place safe",
        "meaningPa": "ਗਾਰਡ; ਸੁਰੱਖਿਆ ਕਰਨ ਵਾਲਾ"
      },
      {
        "word": "flat",
        "meaningEn": "an apartment home",
        "meaningPa": "ਫਲੈਟ; ਅਪਾਰਟਮੈਂਟ ਘਰ"
      },
      {
        "word": "upstairs",
        "meaningEn": "on a higher floor",
        "meaningPa": "ਉੱਪਰ; ਉੱਪਰੀ ਮੰਜ਼ਿਲ"
      },
      {
        "word": "wait",
        "meaningEn": "stay calmly until time",
        "meaningPa": "ਉਡੀਕ; ਸ਼ਾਂਤ ਰੁਕਣਾ"
      },
      {
        "word": "calmly",
        "meaningEn": "in a calm way",
        "meaningPa": "ਸ਼ਾਂਤੀ ਨਾਲ; ਘਬਰਾਏ ਬਿਨਾਂ"
      },
      {
        "word": "enter",
        "meaningEn": "go inside",
        "meaningPa": "ਅੰਦਰ ਜਾਣਾ; ਦਾਖ਼ਲ ਹੋਣਾ"
      },
      {
        "word": "please",
        "meaningEn": "polite word when asking",
        "meaningPa": "ਕਿਰਪਾ ਕਰਕੇ; ਨਮਰ ਸ਼ਬਦ"
      },
      {
        "word": "helper",
        "meaningEn": "someone who helps you",
        "meaningPa": "ਮਦਦਗਾਰ; ਜੋ ਮਦਦ ਕਰੇ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "come",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "says",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B9_S10",
    "bundleId": 9,
    "orderInBundle": 10,
    "titleEn": "Book 9 · Story 10: Lost in a Crowd: Find a Safe Helper",
    "titlePa": "ਕਿਤਾਬ 9 · ਕਹਾਣੀ 10: ਭੀੜ ਵਿੱਚ ਗੁੰਮ: ਸੁਰੱਖਿਅਤ ਮਦਦ ਲੱਭੋ",
    "englishStory": "Panel 1 (Intro): Today I am at a busy mela with my parent. I look up, and I cannot see them.\nPanel 2 (Body): First, I stop my feet and take a slow breath. I say, \"I will stay in one safe place.\"\nPanel 3 (Body): Next, I find a police officer and say, \"Excuse me, I am lost. Please help me call my parent.\"\nPanel 4 (Body): Then the officer asks, \"What is your parent's phone number?\" I say it slowly, and we call together.\nPanel 5 (Conclusion): After that, my parent comes quickly and hugs me. I feel relieved because I stayed calm and asked a safe helper.",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਮੰਮੀ/ਡੈਡੀ ਨਾਲ ਮੇਲੇ ਵਿੱਚ ਹਾਂ। ਮੈਂ ਉੱਪਰ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਮੈਨੂੰ ਉਹ ਨਹੀਂ ਦਿਖਦੇ।\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਮੈਂ ਪੈਰ ਰੋਕਦਾ/ਰੋਕਦੀ ਹਾਂ ਅਤੇ ਹੌਲੀ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਂ ਇੱਕ ਸੁਰੱਖਿਅਤ ਥਾਂ ਤੇ ਹੀ ਖੜ੍ਹਾ/ਖੜ੍ਹੀ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਪੁਲਿਸ ਅਫ਼ਸਰ ਨੂੰ ਲੱਭਦਾ/ਲੱਭਦੀ ਹਾਂ ਅਤੇ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਮੈਂ ਗੁੰਮ ਹੋ ਗਿਆ/ਹੋ ਗਈ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਮੰਮੀ/ਡੈਡੀ ਨੂੰ ਫ਼ੋਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੋ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਫ਼ਸਰ ਪੁੱਛਦਾ ਹੈ, \"ਤੁਹਾਡੇ ਮੰਮੀ/ਡੈਡੀ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਕੀ ਹੈ?\" ਮੈਂ ਹੌਲੀ-ਹੌਲੀ ਦੱਸਦਾ/ਦੱਸਦੀ ਹਾਂ, ਅਤੇ ਅਸੀਂ ਇਕੱਠੇ ਕਾਲ ਕਰਦੇ ਹਾਂ।\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ, ਮੇਰੇ ਮੰਮੀ/ਡੈਡੀ ਜਲਦੀ ਆ ਜਾਂਦੇ ਹਨ ਅਤੇ ਮੈਨੂੰ ਗਲੇ ਲਾ ਲੈਂਦੇ ਹਨ। ਮੈਨੂੰ ਸੁਕੂਨ ਹੁੰਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਂ ਸ਼ਾਂਤ ਰਿਹਾ/ਰਹੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਮਦਦ ਮੰਗੀ।",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child? / ਬੱਚਾ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "mela / ਮੇਲਾ",
          "classroom / ਕਲਾਸ",
          "bus / ਬੱਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child is at a mela. / ਪੈਨਲ 1 ਵਿੱਚ ਮੇਲੇ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should the child do first when lost? / ਗੁੰਮ ਹੋਣ ਤੇ ਬੱਚੇ ਨੇ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "stop and stay in one place / ਰੁਕ ਕੇ ਇੱਕ ਥਾਂ ਰਹਿਣਾ",
          "run fast / ਤੇਜ਼ ਦੌੜਨਾ",
          "hide quietly / ਚੁੱਪ ਲੁਕਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says the child stops, breathes, and stays in one safe place. / ਪੈਨਲ 2 ਵਿੱਚ ਰੁਕ ਕੇ ਇੱਕ ਸੁਰੱਖਿਅਤ ਥਾਂ ਰਹਿਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Who is a safe helper in the story? / ਕਹਾਣੀ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਮਦਦਗਾਰ ਕੌਣ ਹੈ?",
        "choices": [
          "police officer / ਪੁਲਿਸ ਅਫ਼ਸਰ",
          "stranger kid / ਅਜਨਬੀ ਬੱਚਾ",
          "random driver / ਅਜਨਬੀ ਡਰਾਈਵਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 shows the child asks a police officer for help. / ਪੈਨਲ 3 ਵਿੱਚ ਪੁਲਿਸ ਅਫ਼ਸਰ ਤੋਂ ਮਦਦ ਮੰਗਦਾ/ਮੰਗਦੀ ਹੈ।"
      },
      {
        "question": "Why does the child call the parent? / ਬੱਚਾ ਮੰਮੀ/ਡੈਡੀ ਨੂੰ ਕਿਉਂ ਫ਼ੋਨ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "to meet again safely / ਸੁਰੱਖਿਅਤ ਮਿਲਣ ਲਈ",
          "to buy toys / ਖਿਡੌਣੇ ਲਈ",
          "to be late / ਦੇਰ ਕਰਨ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Calling helps the child meet the parent again safely. / ਫ਼ੋਨ ਕਰਨ ਨਾਲ ਸੁਰੱਖਿਅਤ ਮਿਲ ਸਕਦੇ ਹਨ।"
      },
      {
        "question": "How does the child feel at the end? / ਅੰਤ ਵਿੱਚ ਬੱਚਾ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ?",
        "choices": [
          "relieved / ਸੁਕੂਨ",
          "angry / ਗੁੱਸਾ",
          "sleepy / ਨੀਂਦ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child feels relieved after getting help. / ਪੈਨਲ 5 ਵਿੱਚ ਸੁਕੂਨ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "crowd",
        "meaningEn": "many people together",
        "meaningPa": "ਭੀੜ; ਬਹੁਤ ਲੋਕ"
      },
      {
        "word": "lost",
        "meaningEn": "not finding your parent or way",
        "meaningPa": "ਗੁੰਮ; ਰਸਤਾ/ਵੱਡਾ ਨਾ ਮਿਲਣਾ"
      },
      {
        "word": "safe",
        "meaningEn": "not in danger",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "helper",
        "meaningEn": "a trusted person who helps",
        "meaningPa": "ਮਦਦਗਾਰ; ਭਰੋਸੇਯੋਗ ਮਦਦ"
      },
      {
        "word": "police officer",
        "meaningEn": "a person who helps keep people safe",
        "meaningPa": "ਪੁਲਿਸ ਅਫ਼ਸਰ; ਸੁਰੱਖਿਆ ਕਰਨ ਵਾਲਾ"
      },
      {
        "word": "breathe",
        "meaningEn": "take air in and out slowly",
        "meaningPa": "ਸਾਹ ਲੈਣਾ; ਹੌਲੀ ਸਾਹ ਅੰਦਰ-ਬਾਹਰ"
      },
      {
        "word": "phone number",
        "meaningEn": "numbers to call someone",
        "meaningPa": "ਫ਼ੋਨ ਨੰਬਰ; ਕਾਲ ਕਰਨ ਵਾਲੇ ਅੰਕ"
      },
      {
        "word": "call",
        "meaningEn": "phone someone",
        "meaningPa": "ਫ਼ੋਨ ਕਰਨਾ; ਕਾਲ ਕਰਨੀ"
      },
      {
        "word": "stay",
        "meaningEn": "remain in one place",
        "meaningPa": "ਰਹਿਣਾ; ਇੱਕ ਥਾਂ ਟਿਕੇ ਰਹਿਣਾ"
      },
      {
        "word": "relieved",
        "meaningEn": "feeling better after worry ends",
        "meaningPa": "ਸੁਕੂਨ; ਚਿੰਤਾ ਘੱਟ ਹੋ ਜਾਣੀ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "am",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stop",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "say",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

var BOOK10_CUSTOM_STORIES = [
  {
    "storyId": "B10_S01",
    "bundleId": 10,
    "orderInBundle": 1,
    "titleEn": "Book 10 · Story 1: The Soil Is Alive",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 1: ਮਿੱਟੀ ਜੀਉਂਦੀ ਹੈ",
    "englishStory": "Panel 1 (Intro): Today I visit Grandpa's farm, and I smell wet soil after rain, while small worms move under brown leaves quietly nearby.\nGrandpa says, \"Soil is alive with tiny helpers, so we feed it and protect it, just like we care for our bodies.\"\nPanel 2 (Body): First we compare dry dirt and dark compost in two bowls, and I notice compost feels crumbly and cool, not dusty or hard.\nI ask, \"Can you show me compost again, and please tell me why it looks darker and smells sweeter than the soil in this bowl?\"\nPanel 3 (Body): Next we mix compost into the garden bed with a small shovel, and I watch the soil loosen, so roots can spread easily later.\nGrandpa answers, \"Compost comes from old leaves and peels, and it becomes plant food, because nature recycles everything slowly for us.\"\nPanel 4 (Body): Then we pour the same cup of water on two spots, and I observe one spot stays wet longer, while the other dries quickly.\nI say, \"I predict the compost spot will help plants drink longer, so our seedlings will stay happy when hot wind blows.\"\nPanel 5 (Conclusion): After that we add straw mulch on top, and Grandpa says it keeps moisture in, so the soil does not get too hot.\nFinally I smile and say, \"Now I understand healthy soil needs compost and mulch, because good soil is the first step for food.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਦਾਦਾ ਜੀ ਦੇ ਖੇਤ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ, ਅਤੇ ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਮਿੱਟੀ ਦੀ ਖੁਸ਼ਬੂ ਆਉਂਦੀ ਹੈ, ਜਦੋਂ ਸੁੱਕੇ ਪੱਤਿਆਂ ਹੇਠ ਕੇਂਚੂਏ ਹਿਲਦੇ ਹਨ।\nਦਾਦਾ ਜੀ ਕਹਿੰਦੇ ਹਨ, \"ਮਿੱਟੀ ਵਿੱਚ ਨਿੱਕੇ ਮਦਦਗਾਰ ਜੀਵ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ ਅਸੀਂ ਇਸਨੂੰ ਖੁਰਾਕ ਦਿੰਦੇ ਹਾਂ ਅਤੇ ਇਸਦੀ ਰੱਖਿਆ ਕਰਦੇ ਹਾਂ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਦੋ ਕਟੋਰੀਆਂ ਵਿੱਚ ਸੁੱਕੀ ਮਿੱਟੀ ਅਤੇ ਕਾਲਾ ਕੰਪੋਸਟ ਵੇਖਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਕੰਪੋਸਟ ਭੁਰਭੁਰਾ ਤੇ ਠੰਢਾ ਲੱਗਦਾ ਹੈ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਕੰਪੋਸਟ ਫਿਰ ਦਿਖਾ ਸਕਦੇ ਹੋ, ਅਤੇ ਦੱਸੋ ਇਹ ਕਿਉਂ ਕਾਲਾ ਹੈ ਤੇ ਇਸਦੀ ਖੁਸ਼ਬੂ ਮਿੱਟੀ ਨਾਲੋਂ ਮਿੱਠੀ ਕਿਉਂ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਛੋਟੀ ਫਾਵੜੀ ਨਾਲ ਕੰਪੋਸਟ ਨੂੰ ਕਿਆਰੀ ਦੀ ਮਿੱਟੀ ਵਿੱਚ ਮਿਲਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਕਿ ਮਿੱਟੀ ਢਿੱਲੀ ਹੋ ਜਾਂਦੀ ਹੈ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਆਸਾਨੀ ਨਾਲ ਫੈਲ ਸਕਣ।\nਦਾਦਾ ਜੀ ਕਹਿੰਦੇ ਹਨ, \"ਕੰਪੋਸਟ ਪੁਰਾਣੇ ਪੱਤਿਆਂ ਅਤੇ ਛਿਲਕਿਆਂ ਤੋਂ ਬਣਦਾ ਹੈ, ਅਤੇ ਇਹ ਪੌਦਿਆਂ ਦੀ ਖੁਰਾਕ ਬਣ ਜਾਂਦਾ ਹੈ ਕਿਉਂਕਿ ਕੁਦਰਤ ਸਭ ਕੁਝ ਮੁੜ ਵਰਤਦੀ ਹੈ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਅਸੀਂ ਦੋ ਥਾਵਾਂ ਉੱਤੇ ਇੱਕੋ ਜਿਹਾ ਪਾਣੀ ਪਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਕਿ ਇੱਕ ਥਾਂ ਨਮੀ ਲੰਮੀ ਰਹਿੰਦੀ ਹੈ ਪਰ ਦੂਜੀ ਜਲਦੀ ਸੁੱਕ ਜਾਂਦੀ ਹੈ।\nਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਕੰਪੋਸਟ ਵਾਲੀ ਥਾਂ ਪੌਦਿਆਂ ਨੂੰ ਲੰਮਾ ਪੀਣ ਦੇਵੇਗੀ, ਇਸ ਲਈ ਗਰਮ ਹਵਾ ਵਿੱਚ ਵੀ ਪੌਦੇ ਖੁਸ਼ ਰਹਿਣਗੇ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਉੱਤੇ ਪਰਾਲੀ ਦਾ ਮਲਚ ਪਾਂਦੇ ਹਾਂ, ਅਤੇ ਦਾਦਾ ਜੀ ਕਹਿੰਦੇ ਹਨ ਇਹ ਨਮੀ ਰੱਖਦਾ ਹੈ ਤਾਂ ਜੋ ਮਿੱਟੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਨਾ ਤਪੇ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ ਕਿ ਚੰਗੀ ਮਿੱਟੀ ਲਈ ਕੰਪੋਸਟ ਅਤੇ ਮਲਚ ਜ਼ਰੂਰੀ ਹਨ, ਕਿਉਂਕਿ ਖਾਣਾ ਉੱਥੋਂ ਹੀ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "Where is the child today? / ਬੱਚਾ ਅੱਜ ਕਿੱਥੇ ਹੈ?",
        "choices": [
          "Grandpa's farm / ਦਾਦਾ ਜੀ ਦਾ ਖੇਤ",
          "library / ਲਾਇਬ੍ਰੇਰੀ",
          "bus stop / ਬੱਸ ਸਟਾਪ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child visits Grandpa's farm. / ਪੈਨਲ 1 ਵਿੱਚ ਬੱਚਾ ਦਾਦਾ ਜੀ ਦੇ ਖੇਤ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ।"
      },
      {
        "question": "What two things do they compare in bowls? / ਉਹ ਕਟੋਰੀਆਂ ਵਿੱਚ ਕੀ ਤੁਲਨਾ ਕਰਦੇ ਹਨ?",
        "choices": [
          "dry dirt and compost / ਸੁੱਕੀ ਮਿੱਟੀ ਅਤੇ ਕੰਪੋਸਟ",
          "milk and juice / ਦੁੱਧ ਅਤੇ ਜੂਸ",
          "books and pencils / ਕਿਤਾਬਾਂ ਅਤੇ ਪੈਂਸਿਲਾਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 compares dry dirt and dark compost. / ਪੈਨਲ 2 ਵਿੱਚ ਸੁੱਕੀ ਮਿੱਟੀ ਅਤੇ ਕੰਪੋਸਟ ਦੀ ਤੁਲਨਾ ਹੈ।"
      },
      {
        "question": "What happens when compost is mixed in? / ਕੰਪੋਸਟ ਮਿਲਾਉਣ ਨਾਲ ਕੀ ਹੁੰਦਾ ਹੈ?",
        "choices": [
          "soil loosens / ਮਿੱਟੀ ਢਿੱਲੀ ਹੁੰਦੀ ਹੈ",
          "soil becomes metal / ਮਿੱਟੀ ਲੋਹਾ ਬਣਦੀ ਹੈ",
          "soil disappears / ਮਿੱਟੀ ਗਾਇਬ ਹੋ ਜਾਂਦੀ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says the soil loosens so roots can spread. / ਪੈਨਲ 3 ਵਿੱਚ ਮਿੱਟੀ ਢਿੱਲੀ ਹੋਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why do they add straw mulch? / ਉਹ ਪਰਾਲੀ ਦਾ ਮਲਚ ਕਿਉਂ ਪਾਂਦੇ ਹਨ?",
        "choices": [
          "to keep moisture in / ਨਮੀ ਰੱਖਣ ਲਈ",
          "to make soil louder / ਮਿੱਟੀ ਸ਼ੋਰਲੀ ਬਣਾਉਣ ਲਈ",
          "to make bugs angry / ਕੀੜੇ ਗੁੱਸੇ ਕਰਨ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says mulch keeps moisture in and helps soil stay cooler. / ਪੈਨਲ 5 ਵਿੱਚ ਮਲਚ ਨਮੀ ਰੱਖਦਾ ਹੈ।"
      },
      {
        "question": "What is a kind way to work in the garden? / ਬਾਗ ਵਿੱਚ ਚੰਗਾ ਤਰੀਕਾ ਕੀ ਹੈ?",
        "choices": [
          "work gently and listen to adults / ਹੌਲੀ ਕੰਮ ਕਰਨਾ ਅਤੇ ਵੱਡਿਆਂ ਦੀ ਸੁਣਨੀ",
          "throw soil at friends / ਦੋਸਤਾਂ ਉੱਤੇ ਮਿੱਟੀ ਸੁੱਟਣਾ",
          "run and kick the bed / ਦੌੜ ਕੇ ਕਿਆਰੀ ਨੂੰ ਲੱਤ ਮਾਰਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story models gentle work and listening to Grandpa. / ਕਹਾਣੀ ਵਿੱਚ ਹੌਲੀ ਕੰਮ ਅਤੇ ਦਾਦਾ ਜੀ ਦੀ ਸੁਣਨ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "soil",
        "meaningEn": "ground where plants grow",
        "meaningPa": "ਮਿੱਟੀ; ਜਿੱਥੇ ਪੌਦੇ ਵਧਦੇ ਹਨ"
      },
      {
        "word": "compost",
        "meaningEn": "old leaves and peels turned into rich plant food",
        "meaningPa": "ਕੰਪੋਸਟ; ਪੱਤੇ/ਛਿਲਕੇ ਸੜ ਕੇ ਬਣੀ ਖੁਰਾਕ"
      },
      {
        "word": "worm",
        "meaningEn": "a small animal that lives in soil",
        "meaningPa": "ਕੇਂਚੂਆ; ਮਿੱਟੀ ਵਿੱਚ ਰਹਿਣ ਵਾਲਾ ਜੀਵ"
      },
      {
        "word": "crumbly",
        "meaningEn": "breaks into small pieces easily",
        "meaningPa": "ਭੁਰਭੁਰਾ; ਛੋਟੇ ਟੁਕੜਿਆਂ ਵਿੱਚ ਟੁੱਟਣ ਵਾਲਾ"
      },
      {
        "word": "shovel",
        "meaningEn": "a tool for digging or moving soil",
        "meaningPa": "ਫਾਵੜੀ; ਮਿੱਟੀ ਖੋਦਣ ਦਾ ਸੰਦ"
      },
      {
        "word": "roots",
        "meaningEn": "parts of a plant that grow under soil",
        "meaningPa": "ਜੜ੍ਹਾਂ; ਪੌਦੇ ਦਾ ਹੇਠਾਂ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "moisture",
        "meaningEn": "a small amount of wetness",
        "meaningPa": "ਨਮੀ; ਹਲਕੀ ਭਿੱਜਾਪਣ"
      },
      {
        "word": "mulch",
        "meaningEn": "dry straw or leaves placed on soil to protect it",
        "meaningPa": "ਮਲਚ; ਮਿੱਟੀ ਉੱਤੇ ਪਰਾਲੀ/ਪੱਤੇ ਦੀ ਪਰਤ"
      },
      {
        "word": "observe",
        "meaningEn": "look carefully and notice details",
        "meaningPa": "ਨਿਰੀਖਣ ਕਰਨਾ; ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ"
      },
      {
        "word": "predict",
        "meaningEn": "make a smart guess before you see the result",
        "meaningPa": "ਅੰਦਾਜ਼ਾ ਲਗਾਉਣਾ; ਨਤੀਜੇ ਤੋਂ ਪਹਿਲਾਂ ਅਨੁਮਾਨ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "comes",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "recycles",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S02",
    "bundleId": 10,
    "orderInBundle": 2,
    "titleEn": "Book 10 · Story 2: Seed to Sprout",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 2: ਬੀਜ ਤੋਂ ਅੰਕੁਰ",
    "englishStory": "Panel 1 (Intro): Today our class plants a bean seed in a clear cup, and I watch it rest against wet cotton, ready for change.\nTeacher says, \"We are going to observe daily, so keep the cup near light, and do not shake it when you carry it.\"\nPanel 2 (Body): First I draw a simple calendar and circle each morning, because routines help me remember to check my seed gently every day.\nI whisper, \"Can I add a few drops now, and please tell me how much water is enough, so the seed can breathe too?\"\nPanel 3 (Body): Next Teacher replies, \"Use only a few drops, because too much water can drown the seed, and roots need air to grow.\"\nI feel patient and take a deep breath, because learning takes time, even when I cannot see anything happening yet.\nPanel 4 (Body): Then I predict a sprout will appear in three days, and I write my guess, so I can compare it with real results.\nMy friend says, \"Let us check together tomorrow, and we will compare cups, so we learn from both seeds and mistakes.\"\nPanel 5 (Conclusion): After that I see a tiny white root, and I point without touching, because new roots are soft and can break easily.\nFinally I smile and say, \"Now I know seeds grow step by step, so careful watching and kind patience help me learn.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਸਾਡੀ ਕਲਾਸ ਸਾਫ਼ ਕੱਪ ਵਿੱਚ ਬੀਨ ਦਾ ਬੀਜ ਰੱਖਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਇਸਨੂੰ ਭਿੱਜੇ ਕਪਾਹ ਨਾਲ ਟਿਕਿਆ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ।\nਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਅਸੀਂ ਹਰ ਦਿਨ ਨਿਰੀਖਣ ਕਰਾਂਗੇ, ਇਸ ਲਈ ਕੱਪ ਨੂੰ ਰੌਸ਼ਨੀ ਕੋਲ ਰੱਖੋ ਅਤੇ ਲਿਜਾਂਦਿਆਂ ਹਿਲਾਓ ਨਾ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਸਾਦਾ ਕੈਲੰਡਰ ਬਣਾਂਦਾ/ਬਣਾਂਦੀ ਹਾਂ ਅਤੇ ਹਰ ਸਵੇਰ ਗੋਲ ਲਾਂਦਾ/ਲਾਂਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਰੁਟੀਨ ਨਾਲ ਮੈਨੂੰ ਯਾਦ ਰਹਿੰਦਾ ਹੈ।\nਮੈਂ ਹੌਲੀ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਮੈਂ ਹੁਣ ਕੁਝ ਬੂੰਦਾਂ ਪਾ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਅਤੇ ਦੱਸੋ ਕਿੰਨਾ ਪਾਣੀ ਕਾਫ਼ੀ ਹੈ ਤਾਂ ਜੋ ਬੀਜ ਸਾਹ ਵੀ ਲੈ ਸਕੇ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਟੀਚਰ ਕਹਿੰਦੇ ਹਨ, \"ਸਿਰਫ਼ ਕੁਝ ਬੂੰਦਾਂ ਪਾਓ, ਕਿਉਂਕਿ ਜ਼ਿਆਦਾ ਪਾਣੀ ਬੀਜ ਨੂੰ ਡੁਬੋ ਸਕਦਾ ਹੈ ਅਤੇ ਜੜ੍ਹਾਂ ਨੂੰ ਹਵਾ ਚਾਹੀਦੀ ਹੈ।\"\nਮੈਂ ਧੀਰਜ ਨਾਲ ਡੂੰਘਾ ਸਾਹ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਸਿੱਖਣਾ ਸਮਾਂ ਲੈਂਦਾ ਹੈ ਭਾਵੇਂ ਅੱਖਾਂ ਨੂੰ ਹਾਲੇ ਕੁਝ ਨਾ ਦਿੱਸੇ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਫਿਰ ਮੈਂ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹਾਂ ਕਿ ਤਿੰਨ ਦਿਨਾਂ ਵਿੱਚ ਅੰਕੁਰ ਨਿਕਲੇਗਾ, ਅਤੇ ਮੈਂ ਇਹ ਲਿਖ ਲੈਂਦਾ/ਲਿਖ ਲੈਂਦੀ ਹਾਂ ਤਾਂ ਜੋ ਬਾਅਦ ਵਿੱਚ ਮਿਲਾ ਸਕਾਂ।\nਮੇਰਾ ਦੋਸਤ ਕਹਿੰਦਾ ਹੈ, \"ਕੱਲ੍ਹ ਅਸੀਂ ਇਕੱਠੇ ਚੈੱਕ ਕਰੀਏ, ਅਤੇ ਕੱਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰੀਏ ਤਾਂ ਜੋ ਗਲਤੀਆਂ ਤੋਂ ਵੀ ਸਿੱਖੀਏ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਮੈਂ ਨਿੱਕੀ ਚਿੱਟੀ ਜੜ੍ਹ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਮੈਂ ਬਿਨਾਂ ਛੂਹੇ ਉਂਗਲੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਇਹ ਨਰਮ ਹੁੰਦੀ ਹੈ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਜਾਣਦਾ/ਜਾਣਦੀ ਹਾਂ ਬੀਜ ਕਦਮ-ਕਦਮ ਵਧਦਾ ਹੈ, ਇਸ ਲਈ ਧੀਰਜ ਅਤੇ ਹੌਲੀ ਨਿਰੀਖਣ ਮਦਦ ਕਰਦੇ ਹਨ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "Where does this story happen? / ਇਹ ਕਹਾਣੀ ਕਿੱਥੇ ਹੁੰਦੀ ਹੈ?",
        "choices": [
          "classroom / ਕਲਾਸ",
          "railway station / ਰੇਲਵੇ ਸਟੇਸ਼ਨ",
          "mandi / ਮੰਡੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the class plants a seed in a cup. / ਪੈਨਲ 1 ਵਿੱਚ ਕਲਾਸ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they plant? / ਉਹ ਕੀ ਲਗਾਂਦੇ ਹਨ?",
        "choices": [
          "bean seed / ਬੀਨ ਦਾ ਬੀਜ",
          "toy car / ਖਿਡੌਣਾ ਗੱਡੀ",
          "apple / ਸੇਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they plant a bean seed. / ਪੈਨਲ 1 ਵਿੱਚ ਬੀਨ ਦੇ ਬੀਜ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "How much water should the seed get? / ਬੀਜ ਨੂੰ ਕਿੰਨਾ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?",
        "choices": [
          "a few drops / ਕੁਝ ਬੂੰਦਾਂ",
          "a whole bucket / ਪੂਰੀ ਬਾਲਟੀ",
          "no water ever / ਕਦੇ ਪਾਣੀ ਨਹੀਂ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says to use only a few drops. / ਪੈਨਲ 3 ਵਿੱਚ ਕੁਝ ਬੂੰਦਾਂ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why does the teacher say \"do not shake\"? / ਟੀਚਰ \"ਹਿਲਾਓ ਨਾ\" ਕਿਉਂ ਕਹਿੰਦੇ ਹਨ?",
        "choices": [
          "to keep the seed steady / ਬੀਜ ਨੂੰ ਥਿਰ ਰੱਖਣ ਲਈ",
          "to make noise / ਸ਼ੋਰ ਕਰਨ ਲਈ",
          "to dry the cotton fast / ਕਪਾਹ ਜਲਦੀ ਸੁਕਾਉਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Keeping the cup steady helps the seed and roots stay safe. / ਕੱਪ ਥਿਰ ਰਹੇ ਤਾਂ ਬੀਜ ਅਤੇ ਜੜ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੀਆਂ ਹਨ।"
      },
      {
        "question": "What should you NOT do to the new root? / ਨਵੀਂ ਜੜ੍ਹ ਨਾਲ ਕੀ ਨਹੀਂ ਕਰਨਾ?",
        "choices": [
          "touch it / ਛੂਹਣਾ",
          "point and look / ਵੇਖ ਕੇ ਉਂਗਲੀ ਕਰਨੀ",
          "be gentle / ਹੌਲੀ ਰਹਿਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the child points without touching because roots are soft. / ਪੈਨਲ 5 ਵਿੱਚ ਨਾ ਛੂਹਣ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "seed",
        "meaningEn": "a small start of a plant",
        "meaningPa": "ਬੀਜ; ਪੌਦੇ ਦੀ ਸ਼ੁਰੂਆਤ"
      },
      {
        "word": "sprout",
        "meaningEn": "a tiny new plant coming out",
        "meaningPa": "ਅੰਕੁਰ; ਨਿੱਕਾ ਨਵਾਂ ਪੌਦਾ"
      },
      {
        "word": "cotton",
        "meaningEn": "soft material that holds water",
        "meaningPa": "ਕਪਾਹ; ਨਰਮ ਚੀਜ਼ ਜੋ ਪਾਣੀ ਫੜਦੀ ਹੈ"
      },
      {
        "word": "calendar",
        "meaningEn": "a chart of days to track time",
        "meaningPa": "ਕੈਲੰਡਰ; ਦਿਨ ਗਿਣਣ ਦੀ ਤਾਲਿਕਾ"
      },
      {
        "word": "routine",
        "meaningEn": "something you do every day",
        "meaningPa": "ਰੁਟੀਨ; ਹਰ ਰੋਜ਼ ਵਾਲਾ ਕੰਮ"
      },
      {
        "word": "drops",
        "meaningEn": "very small amounts of water",
        "meaningPa": "ਬੂੰਦਾਂ; ਬਹੁਤ ਥੋੜ੍ਹਾ ਪਾਣੀ"
      },
      {
        "word": "drown",
        "meaningEn": "have too much water and cannot breathe",
        "meaningPa": "ਡੁੱਬਣਾ; ਜ਼ਿਆਦਾ ਪਾਣੀ ਨਾਲ ਸਾਹ ਨਾ ਆਉਣਾ"
      },
      {
        "word": "root",
        "meaningEn": "plant part that grows under the soil",
        "meaningPa": "ਜੜ੍ਹ; ਪੌਦੇ ਦਾ ਹੇਠਾਂ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "patient",
        "meaningEn": "able to wait calmly",
        "meaningPa": "ਧੀਰਜਵਾਨ; ਸ਼ਾਂਤ ਰਹਿ ਕੇ ਉਡੀਕ ਕਰਨੀ"
      },
      {
        "word": "compare",
        "meaningEn": "look at two things and see differences",
        "meaningPa": "ਤੁਲਨਾ ਕਰਨੀ; ਦੋ ਚੀਜ਼ਾਂ ਦਾ ਫਰਕ ਵੇਖਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "draw",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S03",
    "bundleId": 10,
    "orderInBundle": 3,
    "titleEn": "Book 10 · Story 3: Water Choices on a Hot Day",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 3: ਗਰਮੀ ਵਾਲੇ ਦਿਨ ਪਾਣੀ ਦੀ ਚੋਣ",
    "englishStory": "Panel 1 (Intro): Today the farm feels very hot, and I see cracks in the soil near our tiny seedlings, while warm wind dries my cheeks quickly.\nGrandma says, \"If soil is dry, we water early morning, so plants drink slowly before the strong sun climbs high.\"\nPanel 2 (Body): First I press my finger into the bed and notice the soil feels dusty, so it does not stick, and it falls apart easily.\nI ask, \"Should we use the hose or the drip pipe today, and can you show me the safest place to stand near water?\"\nPanel 3 (Body): Next Grandma replies, \"We will use drip irrigation, because it saves water, and you must stand back from pumps and canal edges.\"\nThen we open the valve slowly and watch tiny drops fall, and I compare wet soil near the pipe to dry soil farther away.\nPanel 4 (Body): I say, \"I predict drip will waste less water, so every plant gets a fair drink, even when the day stays windy.\"\nGrandma says, \"Good thinking, and never run near machines, because moving parts and slippery ground can cause scary sudden falls.\"\nPanel 5 (Conclusion): After that we close the valve and touch leaves gently, and I notice they look less droopy, because water reaches roots quietly.\nFinally I say, \"Now I can choose safe watering steps, because careful planning saves water, protects plants, and protects children too.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਖੇਤ ਵਿੱਚ ਬਹੁਤ ਗਰਮੀ ਹੈ, ਅਤੇ ਮੈਂ ਨਿੱਕੇ ਪੌਦਿਆਂ ਕੋਲ ਮਿੱਟੀ ਵਿੱਚ ਦਰਾਰਾਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਜਦੋਂ ਗਰਮ ਹਵਾ ਮੇਰੀਆਂ ਗੱਲਾਂ ਸੁਕਾਂਦੀ ਹੈ।\nਦਾਦੀ ਕਹਿੰਦੀ ਹੈ, \"ਜੇ ਮਿੱਟੀ ਸੁੱਕੀ ਹੋਵੇ ਤਾਂ ਅਸੀਂ ਸਵੇਰੇ ਪਾਣੀ ਦਿੰਦੇ ਹਾਂ, ਤਾਂ ਜੋ ਤਿੱਖੀ ਧੁੱਪ ਤੋਂ ਪਹਿਲਾਂ ਪੌਦੇ ਹੌਲੀ ਪੀ ਸਕਣ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਉਂਗਲੀ ਮਿੱਟੀ ਵਿੱਚ ਲਾਂਦਾ/ਲਾਂਦੀ ਹਾਂ ਅਤੇ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਇਹ ਧੂੜੀਲੀ ਹੈ, ਇਸ ਲਈ ਚਿਪਕਦੀ ਨਹੀਂ ਅਤੇ ਛੇਤੀ ਟੁੱਟ ਜਾਂਦੀ ਹੈ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਅੱਜ ਅਸੀਂ ਹੋਜ਼ ਵਰਤਾਂਗੇ ਜਾਂ ਡ੍ਰਿਪ ਪਾਈਪ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਪਾਣੀ ਕੋਲ ਖੜ੍ਹਨ ਦੀ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਥਾਂ ਦਿਖਾ ਸਕਦੇ ਹੋ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਦਾਦੀ ਕਹਿੰਦੀ ਹੈ, \"ਅਸੀਂ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਵਰਤਾਂਗੇ, ਕਿਉਂਕਿ ਇਹ ਪਾਣੀ ਬਚਾਂਦੀ ਹੈ, ਅਤੇ ਪੰਪਾਂ ਅਤੇ ਕੈਨਾਲ ਦੇ ਕਿਨਾਰੇ ਤੋਂ ਦੂਰ ਰਹੋ।\"\nਫਿਰ ਅਸੀਂ ਵਾਲਵ ਹੌਲੀ ਖੋਲ੍ਹਦੇ ਹਾਂ ਅਤੇ ਬੂੰਦਾਂ ਡਿੱਗਦੀਆਂ ਵੇਖਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਪਾਈਪ ਕੋਲ ਭਿੱਜੀ ਮਿੱਟੀ ਦੀ ਦੂਰ ਵਾਲੀ ਸੁੱਕੀ ਮਿੱਟੀ ਨਾਲ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਡ੍ਰਿਪ ਨਾਲ ਪਾਣੀ ਘੱਟ ਵਿਅਰਥ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਹਵਾ ਹੋਵੇ ਤਾਂ ਵੀ ਹਰ ਪੌਦੇ ਨੂੰ ਠੀਕ ਮਿਲਦਾ ਹੈ।\"\nਦਾਦੀ ਕਹਿੰਦੀ ਹੈ, \"ਵਧੀਆ ਸੋਚ, ਅਤੇ ਮਸ਼ੀਨਾਂ ਕੋਲ ਕਦੇ ਨਾ ਦੌੜੋ, ਕਿਉਂਕਿ ਹਿਲਦੇ ਪੁਰਜ਼ੇ ਤੇ ਫਿਸਲਣ ਵਾਲੀ ਜ਼ਮੀਨ ਨਾਲ ਅਚਾਨਕ ਡਿੱਗ ਪੈਣਾ ਡਰਾਉਣਾ ਹੋ ਸਕਦਾ ਹੈ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਵਾਲਵ ਬੰਦ ਕਰਦੇ ਹਾਂ ਅਤੇ ਪੱਤਿਆਂ ਨੂੰ ਹੌਲੀ ਛੂਹਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਕਿ ਪਾਣੀ ਨਾਲ ਪੱਤੇ ਘੱਟ ਝੁੱਕਦੇ ਹਨ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਸੁਰੱਖਿਅਤ ਪਾਣੀ ਦੇ ਕਦਮ ਚੁਣ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਯੋਜਨਾ ਪਾਣੀ ਬਚਾਂਦੀ ਹੈ, ਪੌਦਿਆਂ ਦੀ ਮਦਦ ਕਰਦੀ ਹੈ, ਅਤੇ ਬੱਚਿਆਂ ਦੀ ਵੀ ਰੱਖਿਆ ਕਰਦੀ ਹੈ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "How does the farm feel today? / ਅੱਜ ਖੇਤ ਕਿਵੇਂ ਲੱਗਦਾ ਹੈ?",
        "choices": [
          "very hot / ਬਹੁਤ ਗਰਮ",
          "very cold / ਬਹੁਤ ਠੰਢਾ",
          "snowy / ਬਰਫ਼ ਵਾਲਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the farm feels very hot. / ਪੈਨਲ 1 ਵਿੱਚ ਬਹੁਤ ਗਰਮੀ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What does Grandma choose to use? / ਦਾਦੀ ਕੀ ਵਰਤਣ ਦੀ ਚੋਣ ਕਰਦੀ ਹੈ?",
        "choices": [
          "drip irrigation / ਡ੍ਰਿਪ ਸਿੰਚਾਈ",
          "fireworks / ਆਤਿਸ਼ਬਾਜ਼ੀ",
          "paint / ਰੰਗ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they use drip irrigation. / ਪੈਨਲ 3 ਵਿੱਚ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਹੈ।"
      },
      {
        "question": "Where should the child stand for safety? / ਸੁਰੱਖਿਆ ਲਈ ਬੱਚਾ ਕਿੱਥੇ ਖੜ੍ਹੇ?",
        "choices": [
          "back from pumps and canal edges / ਪੰਪਾਂ ਤੇ ਕੈਨਾਲ ਦੇ ਕਿਨਾਰੇ ਤੋਂ ਦੂਰ",
          "right on the edge / ਬਿਲਕੁਲ ਕਿਨਾਰੇ ਤੇ",
          "inside the pump room / ਪੰਪ ਰੂਮ ਵਿੱਚ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says to stand back from pumps and canal edges. / ਪੈਨਲ 3 ਵਿੱਚ ਦੂਰ ਰਹਿਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why should you not run near machines? / ਮਸ਼ੀਨਾਂ ਕੋਲ ਦੌੜਣਾ ਕਿਉਂ ਨਹੀਂ ਚਾਹੀਦਾ?",
        "choices": [
          "slippery ground can cause falls / ਫਿਸਲਣ ਨਾਲ ਡਿੱਗ ਸਕਦੇ ਹੋ",
          "it makes plants sing / ਪੌਦੇ ਗਾਉਂਦੇ ਹਨ",
          "it makes water sweeter / ਪਾਣੀ ਮਿੱਠਾ ਹੁੰਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 explains moving parts and slippery ground can cause falls. / ਪੈਨਲ 4 ਵਿੱਚ ਡਿੱਗਣ ਦਾ ਖ਼ਤਰਾ ਦੱਸਿਆ ਹੈ।"
      },
      {
        "question": "What change does the child notice in leaves? / ਬੱਚਾ ਪੱਤਿਆਂ ਵਿੱਚ ਕੀ ਬਦਲਾਅ ਵੇਖਦਾ ਹੈ?",
        "choices": [
          "less droopy / ਘੱਟ ਝੁੱਕੇ",
          "more broken / ਹੋਰ ਟੁੱਟੇ",
          "covered in snow / ਬਰਫ਼ ਨਾਲ ਢੱਕੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says leaves look less droopy after watering. / ਪੈਨਲ 5 ਵਿੱਚ ਪੱਤੇ ਘੱਟ ਝੁੱਕਦੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "seedling",
        "meaningEn": "a very young plant",
        "meaningPa": "ਨਿੱਕਾ ਪੌਦਾ; ਛੋਟਾ ਨਵਾਂ ਪੌਦਾ"
      },
      {
        "word": "cracks",
        "meaningEn": "thin breaks in dry soil",
        "meaningPa": "ਦਰਾਰਾਂ; ਸੁੱਕੀ ਮਿੱਟੀ ਵਿੱਚ ਚੀਰ"
      },
      {
        "word": "dusty",
        "meaningEn": "dry like dust",
        "meaningPa": "ਧੂੜੀਲਾ; ਧੂੜ ਵਰਗਾ ਸੁੱਕਾ"
      },
      {
        "word": "hose",
        "meaningEn": "a pipe that carries water",
        "meaningPa": "ਹੋਜ਼; ਪਾਣੀ ਵਾਲਾ ਪਾਈਪ"
      },
      {
        "word": "drip irrigation",
        "meaningEn": "water drops slowly near roots",
        "meaningPa": "ਡ੍ਰਿਪ ਸਿੰਚਾਈ; ਜੜ੍ਹਾਂ ਕੋਲ ਬੂੰਦ-ਬੂੰਦ ਪਾਣੀ"
      },
      {
        "word": "valve",
        "meaningEn": "a handle that opens or closes water",
        "meaningPa": "ਵਾਲਵ; ਪਾਣੀ ਖੋਲ੍ਹਣ/ਬੰਦ ਕਰਨ ਵਾਲਾ ਹੈਂਡਲ"
      },
      {
        "word": "canal",
        "meaningEn": "a water channel",
        "meaningPa": "ਕੈਨਾਲ; ਪਾਣੀ ਦੀ ਨਾਲੀ"
      },
      {
        "word": "pump",
        "meaningEn": "a machine that moves water",
        "meaningPa": "ਪੰਪ; ਪਾਣੀ ਚਲਾਉਣ ਵਾਲੀ ਮਸ਼ੀਨ"
      },
      {
        "word": "slippery",
        "meaningEn": "easy to slip and fall",
        "meaningPa": "ਫਿਸਲੂ; ਫਿਸਲਣ ਵਾਲਾ"
      },
      {
        "word": "droopy",
        "meaningEn": "hanging down and tired-looking",
        "meaningPa": "ਝੁੱਕਿਆ; ਥੱਲੇ ਲਟਕਿਆ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "use",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "saves",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S04",
    "bundleId": 10,
    "orderInBundle": 4,
    "titleEn": "Book 10 · Story 4: Sunlight Makes a Difference",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 4: ਧੁੱਪ ਫਰਕ ਪਾਂਦੀ ਹੈ",
    "englishStory": "Panel 1 (Intro): Today I grow two tomato plants in pots, and I place one in full sun and one in shade beside a cool wall.\nUncle says, \"We will test fairly by watering both the same, so sunlight is the only thing we change this week.\"\nPanel 2 (Body): First I observe the sunny plant and notice its leaves point up, while the shady plant looks softer and a little pale.\nI ask, \"Do you think shade will make it grow slower, and can we write our prediction neatly in my notebook together?\"\nPanel 3 (Body): Next Uncle answers, \"Yes, write it first, because good farmers and scientists record ideas before they see results and get surprised.\"\nThen we measure both plants with a ruler, and I compare height, leaf color, and the number of tiny buds forming.\nPanel 4 (Body): I say, \"I predict the sunny plant will make more buds, so it may give more tomatoes when warm days arrive.\"\nUncle replies, \"After three days we will check again, and we will not move the pots, so our test stays honest.\"\nPanel 5 (Conclusion): After that we check again and see the sunny plant is taller, and I notice the shady leaves still look lighter.\nFinally I explain, \"Sunlight helps plants make food, so more light often means stronger growth when water stays the same.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਗਮਲਿਆਂ ਵਿੱਚ ਦੋ ਟਮਾਟਰ ਦੇ ਪੌਦੇ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ, ਅਤੇ ਇੱਕ ਨੂੰ ਪੂਰੀ ਧੁੱਪ ਵਿੱਚ ਅਤੇ ਇੱਕ ਨੂੰ ਠੰਢੀ ਕੰਧ ਦੇ ਕੋਲ ਛਾਂ ਵਿੱਚ ਰੱਖਦਾ/ਰੱਖਦੀ ਹਾਂ।\nਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਦੋਵਾਂ ਨੂੰ ਇੱਕੋ ਜਿਹਾ ਪਾਣੀ ਦੇ ਕੇ ਨਿਆਪੂਰਨ ਟੈਸਟ ਕਰਾਂਗੇ, ਤਾਂ ਜੋ ਇਸ ਹਫ਼ਤੇ ਸਿਰਫ਼ ਧੁੱਪ ਹੀ ਬਦਲੇ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਧੁੱਪ ਵਾਲੇ ਪੌਦੇ ਦੇ ਪੱਤੇ ਉੱਪਰ ਵੱਲ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਪਰ ਛਾਂ ਵਾਲਾ ਨਰਮ ਤੇ ਥੋੜ੍ਹਾ ਫਿੱਕਾ ਲੱਗਦਾ ਹੈ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੁਹਾਨੂੰ ਲੱਗਦਾ ਹੈ ਛਾਂ ਨਾਲ ਪੌਦਾ ਹੌਲੀ ਵਧੇਗਾ, ਅਤੇ ਕੀ ਅਸੀਂ ਆਪਣਾ ਅੰਦਾਜ਼ਾ ਕਾਪੀ ਵਿੱਚ ਸਾਫ਼ ਲਿਖੀਏ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ, ਪਹਿਲਾਂ ਲਿਖੋ, ਕਿਉਂਕਿ ਚੰਗੇ ਕਿਸਾਨ ਤੇ ਸਾਇੰਸ ਵਾਲੇ ਨਤੀਜੇ ਤੋਂ ਪਹਿਲਾਂ ਵਿਚਾਰ ਲਿਖਦੇ ਹਨ ਤਾਂ ਜੋ ਹੈਰਾਨ ਨਾ ਹੋਣ।\"\nਫਿਰ ਅਸੀਂ ਰੂਲਰ ਨਾਲ ਮਾਪਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਉਚਾਈ, ਪੱਤਿਆਂ ਦਾ ਰੰਗ, ਅਤੇ ਨਿੱਕੀਆਂ ਕਲੀਆਂ ਦੀ ਗਿਣਤੀ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਧੁੱਪ ਵਾਲੇ ਪੌਦੇ ਵਿੱਚ ਵਧੇਰੀਆਂ ਕਲੀਆਂ ਆਉਣਗੀਆਂ, ਇਸ ਲਈ ਗਰਮ ਦਿਨਾਂ ਵਿੱਚ ਫਲ ਵੀ ਵਧੇਰੇ ਹੋ ਸਕਦਾ ਹੈ।\"\nਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਤਿੰਨ ਦਿਨ ਬਾਅਦ ਅਸੀਂ ਫਿਰ ਵੇਖਾਂਗੇ, ਅਤੇ ਗਮਲੇ ਨਹੀਂ ਹਿਲਾਂਗੇ ਤਾਂ ਜੋ ਟੈਸਟ ਸੱਚਾ ਰਹੇ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਫਿਰ ਚੈੱਕ ਕਰਦੇ ਹਾਂ, ਅਤੇ ਧੁੱਪ ਵਾਲਾ ਪੌਦਾ ਲੰਮਾ ਹੁੰਦਾ ਹੈ ਪਰ ਛਾਂ ਵਾਲੇ ਪੱਤੇ ਹਾਲੇ ਵੀ ਹਲਕੇ ਹਨ।\nਆਖਿਰ ਮੈਂ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ, \"ਧੁੱਪ ਨਾਲ ਪੌਦਾ ਖੁਰਾਕ ਬਣਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਜਦ ਪਾਣੀ ਇੱਕੋ ਹੋਵੇ ਤਾਂ ਵਧੇਰੀ ਰੌਸ਼ਨੀ ਨਾਲ ਵਧੇਰਾ ਵਾਧਾ ਹੁੰਦਾ ਹੈ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "What do they change in the test? / ਟੈਸਟ ਵਿੱਚ ਕੀ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ?",
        "choices": [
          "sunlight / ਧੁੱਪ",
          "water amount / ਪਾਣੀ ਦੀ ਮਾਤਰਾ",
          "plant type / ਪੌਦੇ ਦੀ ਕਿਸਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says sunlight is the only thing they change. / ਪੈਨਲ 1 ਵਿੱਚ ਸਿਰਫ਼ ਧੁੱਪ ਬਦਲਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What stays the same for both plants? / ਦੋਵਾਂ ਪੌਦਿਆਂ ਲਈ ਕੀ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ?",
        "choices": [
          "watering / ਪਾਣੀ ਦੇਣਾ",
          "moving pots / ਗਮਲੇ ਹਿਲਾਉਣਾ",
          "cutting leaves / ਪੱਤੇ ਕੱਟਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "They water both the same for a fair test. / ਨਿਆਪੂਰਨ ਟੈਸਟ ਲਈ ਦੋਵਾਂ ਨੂੰ ਇੱਕੋ ਜਿਹਾ ਪਾਣੀ।"
      },
      {
        "question": "What does the child predict? / ਬੱਚਾ ਕੀ ਅੰਦਾਜ਼ਾ ਲਗਾਂਦਾ/ਲਗਾਂਦੀ ਹੈ?",
        "choices": [
          "sunny plant makes more buds / ਧੁੱਪ ਵਾਲੇ ਪੌਦੇ ਵਿੱਚ ਵਧੇਰੀਆਂ ਕਲੀਆਂ",
          "shade plant becomes a tree / ਛਾਂ ਵਾਲਾ ਦਰੱਖਤ ਬਣੇਗਾ",
          "pots will fly / ਗਮਲੇ ਉੱਡਣਗੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 predicts the sunny plant will make more buds. / ਪੈਨਲ 4 ਵਿੱਚ ਕਲੀਆਂ ਵਧਣ ਦਾ ਅੰਦਾਜ਼ਾ ਹੈ।"
      },
      {
        "question": "Why should they not move the pots? / ਗਮਲੇ ਕਿਉਂ ਨਹੀਂ ਹਿਲਾਉਣੇ ਚਾਹੀਦੇ?",
        "choices": [
          "to keep the test honest / ਟੈਸਟ ਸੱਚਾ ਰੱਖਣ ਲਈ",
          "to make noise / ਸ਼ੋਰ ਕਰਨ ਲਈ",
          "to change water color / ਪਾਣੀ ਦਾ ਰੰਗ ਬਦਲਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says not moving pots keeps the test honest. / ਪੈਨਲ 4 ਵਿੱਚ ਟੈਸਟ ਸੱਚਾ ਰੱਖਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Which plant is taller after checking? / ਚੈੱਕ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕਿਹੜਾ ਪੌਦਾ ਲੰਮਾ ਹੈ?",
        "choices": [
          "sunny plant / ਧੁੱਪ ਵਾਲਾ",
          "shady plant / ਛਾਂ ਵਾਲਾ",
          "both are smaller / ਦੋਵੇਂ ਛੋਟੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 5 says the sunny plant is taller. / ਪੈਨਲ 5 ਵਿੱਚ ਧੁੱਪ ਵਾਲਾ ਪੌਦਾ ਲੰਮਾ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "sunlight",
        "meaningEn": "light from the sun",
        "meaningPa": "ਧੁੱਪ; ਸੂਰਜ ਦੀ ਰੌਸ਼ਨੀ"
      },
      {
        "word": "shade",
        "meaningEn": "a cooler place with less sun",
        "meaningPa": "ਛਾਂ; ਧੁੱਪ ਘੱਟ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "fair test",
        "meaningEn": "a test where only one thing changes",
        "meaningPa": "ਨਿਆਪੂਰਨ ਟੈਸਟ; ਸਿਰਫ਼ ਇੱਕ ਚੀਜ਼ ਬਦਲਦੀ ਹੈ"
      },
      {
        "word": "prediction",
        "meaningEn": "a smart guess before results",
        "meaningPa": "ਅੰਦਾਜ਼ਾ; ਨਤੀਜੇ ਤੋਂ ਪਹਿਲਾਂ ਅਨੁਮਾਨ"
      },
      {
        "word": "measure",
        "meaningEn": "find size using a tool",
        "meaningPa": "ਮਾਪਣਾ; ਸੰਦ ਨਾਲ ਨਾਪਣਾ"
      },
      {
        "word": "ruler",
        "meaningEn": "a tool to measure length",
        "meaningPa": "ਰੂਲਰ; ਲੰਬਾਈ ਮਾਪਣ ਵਾਲਾ ਸੰਦ"
      },
      {
        "word": "height",
        "meaningEn": "how tall something is",
        "meaningPa": "ਉਚਾਈ; ਕਿੰਨਾ ਲੰਮਾ"
      },
      {
        "word": "bud",
        "meaningEn": "a small new flower part",
        "meaningPa": "ਕਲੀ; ਫੁੱਲ ਬਣਨ ਵਾਲਾ ਨਿੱਕਾ ਹਿੱਸਾ"
      },
      {
        "word": "notebook",
        "meaningEn": "a book for writing notes",
        "meaningPa": "ਕਾਪੀ; ਲਿਖਣ ਲਈ ਕਿਤਾਬ"
      },
      {
        "word": "results",
        "meaningEn": "what happens after a test",
        "meaningPa": "ਨਤੀਜੇ; ਟੈਸਟ ਤੋਂ ਬਾਅਦ ਕੀ ਹੋਇਆ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "grow",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "make",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S05",
    "bundleId": 10,
    "orderInBundle": 5,
    "titleEn": "Book 10 · Story 5: Tools That Help Farmers",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 5: ਕਿਸਾਨਾਂ ਦੇ ਸੰਦ",
    "englishStory": "Panel 1 (Intro): Today I watch a tractor pull a plough across the field, and the loud engine vibrates, while dust rises in warm sunlight.\nFarmer uncle says, \"Stand behind this safe line, because machines can move suddenly, and safety is always more important than curiosity.\"\nPanel 2 (Body): First I observe the plough turning soil into neat rows, and I notice weeds flip under, so new plants get more space.\nI ask, \"Can you please tell me this tool's name, and how it helps you work faster than digging with hands alone?\"\nPanel 3 (Body): Next he answers, \"This is a plough, and it breaks hard soil, so roots can grow deeper and water can enter easily.\"\nThen he shows a seed drill and explains spacing, and I compare straight rows from the machine to messy rows made by rushing.\nPanel 4 (Body): I say, \"I think careful spacing gives each plant room, so they do not fight for sunlight, water, and nutrients later.\"\nFarmer uncle replies, \"Yes, and you must never touch moving parts, so keep your hands in your pockets while we watch.\"\nPanel 5 (Conclusion): After that we wave when the tractor stops, and I feel relieved because the field becomes quiet, and everyone stays safe.\nFinally I say, \"Now I understand tools save time, because smart machines help farmers grow food for many families each season.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਟਰੈਕਟਰ ਨੂੰ ਖੇਤ ਵਿੱਚ ਹਲ ਖਿੱਚਦਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਤੇਜ਼ ਇੰਜਣ ਕੰਬਕੰਬੀ ਕਰਦਾ ਹੈ ਜਦੋਂ ਧੁੱਪ ਵਿੱਚ ਧੂੜ ਉੱਪਰ ਚੜ੍ਹਦੀ ਹੈ।\nਕਿਸਾਨ ਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਇਸ ਸੁਰੱਖਿਅਤ ਰੇਖਾ ਦੇ ਪਿੱਛੇ ਰਹੋ, ਕਿਉਂਕਿ ਮਸ਼ੀਨ ਅਚਾਨਕ ਹਿਲ ਸਕਦੀ ਹੈ ਅਤੇ ਸੁਰੱਖਿਆ ਜਿਗਿਆਸਾ ਨਾਲੋਂ ਵਧੀਕ ਹੈ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਹਲ ਨੂੰ ਮਿੱਟੀ ਨੂੰ ਸਿੱਧੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਪਲਟਦਾ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਘਾਹ ਹੇਠਾਂ ਦੱਬ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਪੌਦਿਆਂ ਨੂੰ ਜਗ੍ਹਾ ਮਿਲੇ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਇਹ ਸੰਦ ਦਾ ਨਾਮ ਕੀ ਹੈ, ਅਤੇ ਇਹ ਹੱਥਾਂ ਨਾਲ ਖੋਦਣ ਨਾਲੋਂ ਤੇਜ਼ ਕੰਮ ਕਿਵੇਂ ਕਰਦਾ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਇਹ ਹਲ ਹੈ, ਅਤੇ ਇਹ ਸਖ਼ਤ ਮਿੱਟੀ ਤੋੜਦਾ ਹੈ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਡੂੰਘੀਆਂ ਵਧਣ ਅਤੇ ਪਾਣੀ ਅੰਦਰ ਜਾ ਸਕੇ।\"\nਫਿਰ ਉਹ ਸੀਡ ਡ੍ਰਿਲ ਦਿਖਾਂਦਾ ਹੈ ਅਤੇ ਦੂਰੀ ਸਮਝਾਂਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਮਸ਼ੀਨ ਦੀ ਸਿੱਧੀ ਕਤਾਰ ਨੂੰ ਜਲਦੀ ਵਾਲੀ ਗੜਬੜ ਕਤਾਰ ਨਾਲ ਮਿਲਾਂਦਾ/ਮਿਲਾਂਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਸਹੀ ਦੂਰੀ ਨਾਲ ਪੌਦਿਆਂ ਨੂੰ ਜਗ੍ਹਾ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਬਾਅਦ ਵਿੱਚ ਧੁੱਪ, ਪਾਣੀ, ਅਤੇ ਖੁਰਾਕ ਲਈ ਲੜਾਈ ਘੱਟ ਹੁੰਦੀ ਹੈ।\"\nਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ, ਅਤੇ ਚੱਲਦੇ ਪੁਰਜ਼ੇ ਕਦੇ ਨਾ ਛੂਹੋ, ਇਸ ਲਈ ਵੇਖਦਿਆਂ ਹੱਥ ਜੇਬ ਵਿੱਚ ਰੱਖੋ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਟਰੈਕਟਰ ਰੁਕਣ ਤੇ ਹੱਥ ਹਿਲਾਂਦੇ ਹਾਂ, ਅਤੇ ਖੇਤ ਸ਼ਾਂਤ ਹੋਣ ਨਾਲ ਮੈਨੂੰ ਸੁਕੂਨ ਆਉਂਦਾ ਹੈ ਕਿਉਂਕਿ ਸਭ ਸੁਰੱਖਿਅਤ ਰਹੇ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ ਸੰਦ ਸਮਾਂ ਬਚਾਉਂਦੇ ਹਨ, ਕਿਉਂਕਿ ਸਮਝਦਾਰ ਮਸ਼ੀਨਾਂ ਕਿਸਾਨਾਂ ਨੂੰ ਕਈ ਪਰਿਵਾਰਾਂ ਲਈ ਖਾਣਾ ਉਗਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀਆਂ ਹਨ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "What vehicle is working in the field? / ਖੇਤ ਵਿੱਚ ਕਿਹੜੀ ਗੱਡੀ ਕੰਮ ਕਰ ਰਹੀ ਹੈ?",
        "choices": [
          "tractor / ਟਰੈਕਟਰ",
          "bus / ਬੱਸ",
          "bicycle / ਸਾਈਕਲ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 shows a tractor pulling a plough. / ਪੈਨਲ 1 ਵਿੱਚ ਟਰੈਕਟਰ ਹੈ।"
      },
      {
        "question": "What tool turns the soil into rows? / ਕਿਹੜਾ ਸੰਦ ਮਿੱਟੀ ਨੂੰ ਕਤਾਰਾਂ ਬਣਾਉਂਦਾ ਹੈ?",
        "choices": [
          "plough / ਹਲ",
          "spoon / ਚਮਚਾ",
          "book / ਕਿਤਾਬ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2–3 describe the plough turning soil into neat rows. / ਪੈਨਲ 2–3 ਵਿੱਚ ਹਲ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Where should the child stand for safety? / ਸੁਰੱਖਿਆ ਲਈ ਬੱਚਾ ਕਿੱਥੇ ਖੜ੍ਹੇ?",
        "choices": [
          "behind the safe line / ਸੁਰੱਖਿਅਤ ਰੇਖਾ ਦੇ ਪਿੱਛੇ",
          "next to moving parts / ਚੱਲਦੇ ਪੁਰਜ਼ਿਆਂ ਕੋਲ",
          "in front of the tractor / ਟਰੈਕਟਰ ਦੇ ਸਾਹਮਣੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says to stand behind the safe line. / ਪੈਨਲ 1 ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰੇਖਾ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why is spacing important? / ਦੂਰੀ ਕਿਉਂ ਜਰੂਰੀ ਹੈ?",
        "choices": [
          "plants get room and do not fight / ਪੌਦਿਆਂ ਨੂੰ ਜਗ੍ਹਾ ਮਿਲਦੀ ਹੈ",
          "plants become toys / ਪੌਦੇ ਖਿਡੌਣੇ ਬਣਦੇ ਹਨ",
          "water disappears forever / ਪਾਣੀ ਗਾਇਬ ਹੋ ਜਾਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says spacing gives each plant room for sunlight and water. / ਪੈਨਲ 4 ਵਿੱਚ ਜਗ੍ਹਾ ਮਿਲਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What should you never do near machines? / ਮਸ਼ੀਨਾਂ ਕੋਲ ਕਦੇ ਕੀ ਨਹੀਂ ਕਰਨਾ?",
        "choices": [
          "touch moving parts / ਚੱਲਦੇ ਪੁਰਜ਼ੇ ਛੂਹਣਾ",
          "watch from far / ਦੂਰੋਂ ਵੇਖਣਾ",
          "listen to adult / ਵੱਡੇ ਦੀ ਸੁਣਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says you must never touch moving parts. / ਪੈਨਲ 4 ਵਿੱਚ ਨਾ ਛੂਹਣ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "tractor",
        "meaningEn": "a strong farm vehicle",
        "meaningPa": "ਟਰੈਕਟਰ; ਖੇਤ ਦੀ ਮਜ਼ਬੂਤ ਗੱਡੀ"
      },
      {
        "word": "plough",
        "meaningEn": "a tool that turns soil",
        "meaningPa": "ਹਲ; ਮਿੱਟੀ ਪਲਟਣ ਵਾਲਾ ਸੰਦ"
      },
      {
        "word": "engine",
        "meaningEn": "the part that makes a vehicle move",
        "meaningPa": "ਇੰਜਣ; ਗੱਡੀ ਚਲਾਉਣ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "rows",
        "meaningEn": "straight lines of soil or plants",
        "meaningPa": "ਕਤਾਰਾਂ; ਸਿੱਧੀਆਂ ਲਾਈਨਾਂ"
      },
      {
        "word": "weeds",
        "meaningEn": "plants that grow where you do not want them",
        "meaningPa": "ਘਾਹ-ਝਾੜ; ਗ਼ੈਰ-ਲੋੜੀਂਦੇ ਪੌਦੇ"
      },
      {
        "word": "seed drill",
        "meaningEn": "a tool that plants seeds evenly",
        "meaningPa": "ਸੀਡ ਡ੍ਰਿਲ; ਬੀਜ ਸਮਾਨ ਦੂਰੀ ਨਾਲ ਲਗਾਉਣ ਵਾਲਾ ਸੰਦ"
      },
      {
        "word": "spacing",
        "meaningEn": "distance between plants",
        "meaningPa": "ਦੂਰੀ; ਪੌਦਿਆਂ ਵਿਚਕਾਰ ਫਾਸਲਾ"
      },
      {
        "word": "nutrients",
        "meaningEn": "food in soil that plants need",
        "meaningPa": "ਪੋਸ਼ਕ ਤੱਤ; ਮਿੱਟੀ ਦੀ ਪੌਦਿਆਂ ਵਾਲੀ ਖੁਰਾਕ"
      },
      {
        "word": "moving parts",
        "meaningEn": "machine pieces that move",
        "meaningPa": "ਚੱਲਦੇ ਪੁਰਜ਼ੇ; ਮਸ਼ੀਨ ਦੇ ਹਿਲਦੇ ਹਿੱਸੇ"
      },
      {
        "word": "safe line",
        "meaningEn": "a boundary you should not cross",
        "meaningPa": "ਸੁਰੱਖਿਅਤ ਰੇਖਾ; ਜਿਸ ਤੋਂ ਪਾਰ ਨਹੀਂ ਜਾਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "stand",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "grow",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S06",
    "bundleId": 10,
    "orderInBundle": 6,
    "titleEn": "Book 10 · Story 6: Weeds and Plant Care",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 6: ਘਾਹ-ਝਾੜ ਅਤੇ ਪੌਦਿਆਂ ਦੀ ਸੰਭਾਲ",
    "englishStory": "Panel 1 (Intro): Today I help my cousin in the vegetable bed, and I see weeds crowding tiny okra plants, while the row looks messy.\nCousin says, \"We pull weeds gently, because weeds steal water and light, so vegetables grow slower when we ignore them.\"\nPanel 2 (Body): First we kneel on a mat and wear gloves, and I observe leaf shapes, so I can tell weeds from okra carefully.\nI ask, \"Can you show one weed and one okra plant, so I do not pull the wrong thing by accident today?\"\nPanel 3 (Body): Next Cousin answers, \"Look at the stem and leaf edges, because okra stems are thicker, and weeds often feel thin and weak.\"\nThen we pull weeds from the root and place them in a pile, and I compare clean soil to crowded soil nearby.\nPanel 4 (Body): I say, \"I predict mulch will help next, so weeds have less space, and soil stays cooler during hot afternoons in summer.\"\nCousin replies, \"Good plan, and after mulching we water slowly, so roots stay wet without washing soil away from stems.\"\nPanel 5 (Conclusion): After that we step back and count plants, and I notice each okra plant looks brighter because sunlight reaches its leaves.\nFinally I smile and say, \"Now I can care for plants with teamwork, because small daily steps can lead to a big harvest.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਆਪਣੇ ਕਜ਼ਨ ਨਾਲ ਸਬਜ਼ੀ ਦੀ ਕਿਆਰੀ ਵਿੱਚ ਮਦਦ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਅਤੇ ਘਾਹ-ਝਾੜ ਭਿੰਡੀ ਦੇ ਨਿੱਕੇ ਪੌਦਿਆਂ ਕੋਲ ਭੀੜ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਕਤਾਰ ਗੰਦੀ ਲੱਗਦੀ ਹੈ।\nਕਜ਼ਨ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਘਾਹ ਹੌਲੀ ਖਿੱਚਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਘਾਹ ਪਾਣੀ ਅਤੇ ਧੁੱਪ ਚੁਰਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਅਣਡਿੱਠਾ ਕਰਨ ਨਾਲ ਸਬਜ਼ੀ ਹੌਲੀ ਵਧਦੀ ਹੈ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਮੈਟ ਉੱਤੇ ਘੁੱਟਣੇ ਟਿਕਾਂਦੇ ਹਾਂ ਅਤੇ ਦਸਤਾਨੇ ਪਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਪੱਤਿਆਂ ਦੀ ਸ਼ਕਲ ਵੇਖ ਕੇ ਘਾਹ ਅਤੇ ਭਿੰਡੀ ਦੀ ਪਛਾਣ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਇੱਕ ਘਾਹ ਅਤੇ ਇੱਕ ਭਿੰਡੀ ਦਾ ਪੌਦਾ ਦਿਖਾ ਸਕਦੇ ਹੋ, ਤਾਂ ਜੋ ਮੈਂ ਅੱਜ ਗਲਤੀ ਨਾਲ ਗਲਤ ਚੀਜ਼ ਨਾ ਖਿੱਚ ਲਵਾਂ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਕਜ਼ਨ ਕਹਿੰਦਾ ਹੈ, \"ਡੰਡੀ ਅਤੇ ਪੱਤੇ ਦੇ ਕੋਨੇ ਵੇਖੋ, ਕਿਉਂਕਿ ਭਿੰਡੀ ਦੀ ਡੰਡੀ ਮੋਟੀ ਹੁੰਦੀ ਹੈ ਪਰ ਘਾਹ ਅਕਸਰ ਪਤਲਾ ਤੇ ਕਮਜ਼ੋਰ ਹੁੰਦਾ ਹੈ।\"\nਫਿਰ ਅਸੀਂ ਜੜ੍ਹ ਸਮੇਤ ਘਾਹ ਖਿੱਚ ਕੇ ਢੇਰ ਬਣਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਸਾਫ਼ ਮਿੱਟੀ ਦੀ ਭੀੜ ਵਾਲੀ ਮਿੱਟੀ ਨਾਲ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਅਗਲਾ ਕਦਮ ਮਲਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਤਾਂ ਜੋ ਘਾਹ ਨੂੰ ਜਗ੍ਹਾ ਘੱਟ ਮਿਲੇ ਅਤੇ ਮਿੱਟੀ ਠੰਢੀ ਰਹੇ।\"\nਕਜ਼ਨ ਕਹਿੰਦਾ ਹੈ, \"ਵਧੀਆ ਯੋਜਨਾ, ਅਤੇ ਮਲਚ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਹੌਲੀ ਪਾਣੀ ਦੇਵਾਂਗੇ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਭਿੱਜੀਆਂ ਰਹਿਣ ਅਤੇ ਮਿੱਟੀ ਨਾ ਵਹੇ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਪਿੱਛੇ ਹੋ ਕੇ ਪੌਦਿਆਂ ਦੀ ਗਿਣਤੀ ਕਰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਕਿ ਧੁੱਪ ਮਿਲਣ ਨਾਲ ਭਿੰਡੀ ਦੇ ਪੱਤੇ ਚਮਕਦੇ ਲੱਗਦੇ ਹਨ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਟੀਮਵਰਕ ਨਾਲ ਪੌਦਿਆਂ ਦੀ ਸੰਭਾਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਕਿਉਂਕਿ ਹਰ ਦਿਨ ਦੇ ਛੋਟੇ ਕਦਮ ਵੱਡੀ ਫਸਲ ਬਣਾਉਂਦੇ ਹਨ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "Which plant is in the story? / ਕਹਾਣੀ ਵਿੱਚ ਕਿਹੜਾ ਪੌਦਾ ਹੈ?",
        "choices": [
          "okra / ਭਿੰਡੀ",
          "pineapple / ਅਨਾਨਾਸ",
          "snow tree / ਬਰਫ਼ ਵਾਲਾ ਦਰੱਖਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says weeds crowd the okra plants. / ਪੈਨਲ 1 ਵਿੱਚ ਭਿੰਡੀ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "Why do they pull weeds? / ਉਹ ਘਾਹ ਕਿਉਂ ਖਿੱਚਦੇ ਹਨ?",
        "choices": [
          "weeds steal water and light / ਘਾਹ ਪਾਣੀ ਤੇ ਧੁੱਪ ਚੁਰਾਂਦਾ ਹੈ",
          "weeds make music / ਘਾਹ ਗਾਣੇ ਗਾਂਦਾ ਹੈ",
          "weeds make phones work / ਘਾਹ ਫੋਨ ਚਲਾਂਦਾ ਹੈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 explains weeds steal water and light. / ਪੈਨਲ 1 ਵਿੱਚ ਚੁਰਾਉਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they wear for the work? / ਕੰਮ ਲਈ ਉਹ ਕੀ ਪਾਂਦੇ ਹਨ?",
        "choices": [
          "gloves / ਦਸਤਾਨੇ",
          "skates / ਸਕੇਟ",
          "helmets for swimming / ਤੈਰਨ ਵਾਲੇ ਹੈਲਮੈਟ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they wear gloves. / ਪੈਨਲ 2 ਵਿੱਚ ਦਸਤਾਨੇ ਹਨ।"
      },
      {
        "question": "What comes next after pulling weeds? / ਘਾਹ ਖਿੱਚਣ ਤੋਂ ਬਾਅਦ ਕੀ ਆਉਂਦਾ ਹੈ?",
        "choices": [
          "mulch / ਮਲਚ",
          "snow / ਬਰਫ਼",
          "fire / ਅੱਗ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says mulch will help next. / ਪੈਨਲ 4 ਵਿੱਚ ਮਲਚ ਅਗਲਾ ਕਦਮ ਹੈ।"
      },
      {
        "question": "What is a good learning choice here? / ਇੱਥੇ ਚੰਗੀ ਸਿੱਖਣ ਵਾਲੀ ਚੋਣ ਕੀ ਹੈ?",
        "choices": [
          "ask and check before pulling / ਖਿੱਚਣ ਤੋਂ ਪਹਿਲਾਂ ਪੁੱਛ ਕੇ ਚੈੱਕ ਕਰਨਾ",
          "pull everything fast / ਸਭ ਕੁਝ ਜਲਦੀ ਖਿੱਚਣਾ",
          "throw tools in the air / ਸੰਦ ਹਵਾ ਵਿੱਚ ਸੁੱਟਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows the child asks to avoid pulling the wrong plant. / ਪੈਨਲ 2 ਵਿੱਚ ਪੁੱਛ ਕੇ ਸਹੀ ਚੋਣ ਕਰਨ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "vegetable bed",
        "meaningEn": "a small area where vegetables grow",
        "meaningPa": "ਸਬਜ਼ੀ ਦੀ ਕਿਆਰੀ; ਸਬਜ਼ੀਆਂ ਉਗਾਉਣ ਵਾਲੀ ਥਾਂ"
      },
      {
        "word": "okra",
        "meaningEn": "a green vegetable",
        "meaningPa": "ਭਿੰਡੀ; ਹਰੀ ਸਬਜ਼ੀ"
      },
      {
        "word": "weed",
        "meaningEn": "a plant you do not want in the garden",
        "meaningPa": "ਘਾਹ-ਝਾੜ; ਕਿਆਰੀ ਵਿੱਚ ਨਾ-ਚਾਹੀਦਾ ਪੌਦਾ"
      },
      {
        "word": "gloves",
        "meaningEn": "hand covers for safety",
        "meaningPa": "ਦਸਤਾਨੇ; ਹੱਥਾਂ ਦੀ ਰੱਖਿਆ ਲਈ"
      },
      {
        "word": "stem",
        "meaningEn": "the main stalk of a plant",
        "meaningPa": "ਡੰਡੀ; ਪੌਦੇ ਦਾ ਮੁੱਖ ਡੰਡਾ"
      },
      {
        "word": "root",
        "meaningEn": "plant part under the soil",
        "meaningPa": "ਜੜ੍ਹ; ਮਿੱਟੀ ਹੇਠਾਂ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "pile",
        "meaningEn": "a small heap of things",
        "meaningPa": "ਢੇਰ; ਇਕੱਠੀਆਂ ਚੀਜ਼ਾਂ"
      },
      {
        "word": "mulch",
        "meaningEn": "cover on soil to protect it",
        "meaningPa": "ਮਲਚ; ਮਿੱਟੀ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਪਰਤ"
      },
      {
        "word": "teamwork",
        "meaningEn": "working together",
        "meaningPa": "ਟੀਮਵਰਕ; ਮਿਲ ਕੇ ਕੰਮ ਕਰਨਾ"
      },
      {
        "word": "harvest",
        "meaningEn": "collecting crops when ready",
        "meaningPa": "ਕਟਾਈ; ਤਿਆਰ ਫਸਲ ਇਕੱਠੀ ਕਰਨੀ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "help",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "looks",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "grow",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S07",
    "bundleId": 10,
    "orderInBundle": 7,
    "titleEn": "Book 10 · Story 7: Bugs on the Leaves",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 7: ਪੱਤਿਆਂ ਉੱਤੇ ਕੀੜੇ",
    "englishStory": "Panel 1 (Intro): Today I notice tiny holes on spinach leaves, and I feel worried, because the plants looked perfect yesterday morning in our bed.\nAunt says, \"We will observe first, because guessing wastes time, so we look for insects and signs before choosing a plan.\"\nPanel 2 (Body): First we turn a leaf and spot small green caterpillars, and I count three, so I know the problem is real.\nI ask, \"Should I touch them, or should I call you, and what is the safest way to protect plants and my skin?\"\nPanel 3 (Body): Next Aunt answers, \"Do not touch them, because some bugs can irritate skin, and adults choose safe ways to help plants.\"\nThen she shows me a net cover, and she says, \"We can cover the bed, so insects cannot reach the leaves easily.\"\nPanel 4 (Body): I say, \"I predict checking early will help, so we stop damage before it spreads across the whole bed of greens.\"\nAunt replies, \"Yes, and we keep the garden clean, because fallen leaves can hide bugs, so we remove them gently.\"\nPanel 5 (Conclusion): After that we tie the net corners, and I feel calm because we solved the problem safely without sprays near children.\nFinally I explain, \"We observed, asked an adult, and used a net, so plants stay healthy, and our hands stay safe too.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਪਾਲਕ ਦੇ ਪੱਤਿਆਂ ਵਿੱਚ ਨਿੱਕੇ ਛੇਦ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਮੈਨੂੰ ਚਿੰਤਾ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਕੱਲ੍ਹ ਸਵੇਰੇ ਪੌਦੇ ਬਿਲਕੁਲ ਠੀਕ ਸਨ।\nਮਾਸੀ ਕਹਿੰਦੀ ਹੈ, \"ਅਸੀਂ ਪਹਿਲਾਂ ਨਿਰੀਖਣ ਕਰਾਂਗੇ, ਕਿਉਂਕਿ ਅੰਦਾਜ਼ੇ ਨਾਲ ਸਮਾਂ ਵਿਅਰਥ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਨਿਸ਼ਾਨ ਅਤੇ ਕੀੜੇ ਵੇਖ ਕੇ ਯੋਜਨਾ ਬਣਾਈਦੀ ਹੈ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਪੱਤਾ ਉਲਟਦੇ ਹਾਂ ਅਤੇ ਨਿੱਕੇ ਹਰੇ ਸੁੰਡੇ ਵੇਖਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਤਿੰਨ ਗਿਣਦਾ/ਗਿਣਦੀ ਹਾਂ ਤਾਂ ਜੋ ਸਮੱਸਿਆ ਪੱਕੀ ਹੋਵੇ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਮੈਂ ਇਨ੍ਹਾਂ ਨੂੰ ਛੂਹਾਂ, ਜਾਂ ਮੈਂ ਤੁਹਾਨੂੰ ਬੁਲਾਵਾਂ, ਅਤੇ ਪੌਦਿਆਂ ਤੇ ਆਪਣੀ ਚਮੜੀ ਨੂੰ ਬਚਾਉਣ ਦਾ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਤਰੀਕਾ ਕੀ ਹੈ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਮਾਸੀ ਕਹਿੰਦੀ ਹੈ, \"ਇਨ੍ਹਾਂ ਨੂੰ ਨਾ ਛੂਹੋ, ਕਿਉਂਕਿ ਕੁਝ ਕੀੜੇ ਚਮੜੀ ਨੂੰ ਖੁਜਲਾਅ ਦੇ ਸਕਦੇ ਹਨ, ਅਤੇ ਪੌਦਿਆਂ ਦੀ ਮਦਦ ਦੇ ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਵੱਡੇ ਚੁਣਦੇ ਹਨ।\"\nਫਿਰ ਮਾਸੀ ਜਾਲੀ ਦਿਖਾਉਂਦੀ ਹੈ ਅਤੇ ਕਹਿੰਦੀ ਹੈ, \"ਅਸੀਂ ਕਿਆਰੀ ਨੂੰ ਢੱਕ ਸਕਦੇ ਹਾਂ, ਤਾਂ ਜੋ ਕੀੜੇ ਪੱਤਿਆਂ ਤੱਕ ਆਸਾਨੀ ਨਾਲ ਨਾ ਪਹੁੰਚਣ।\"\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਸਵੇਰੇ ਜਲਦੀ ਚੈੱਕ ਕਰਨ ਨਾਲ ਮਦਦ ਮਿਲੇਗੀ, ਇਸ ਲਈ ਨੁਕਸਾਨ ਪੂਰੀ ਕਿਆਰੀ ਵਿੱਚ ਫੈਲਣ ਤੋਂ ਪਹਿਲਾਂ ਰੁਕ ਸਕਦਾ ਹੈ।\"\nਮਾਸੀ ਕਹਿੰਦੀ ਹੈ, \"ਹਾਂ, ਅਤੇ ਅਸੀਂ ਬਾਗ ਸਾਫ਼ ਰੱਖਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਡਿੱਗੇ ਪੱਤਿਆਂ ਹੇਠ ਕੀੜੇ ਛੁਪ ਸਕਦੇ ਹਨ, ਇਸ ਲਈ ਅਸੀਂ ਉਹ ਹੌਲੀ ਹਟਾਂਦੇ ਹਾਂ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਜਾਲੀ ਦੇ ਕੋਨੇ ਬੰਨ੍ਹ ਦਿੰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਸ਼ਾਂਤ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਬੱਚਿਆਂ ਕੋਲ ਕੁਝ ਛਿੜਕੇ ਬਿਨਾਂ ਹੱਲ ਹੋ ਗਿਆ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਅਸੀਂ ਨਿਰੀਖਣ ਕੀਤਾ, ਵੱਡੇ ਨੂੰ ਪੁੱਛਿਆ, ਅਤੇ ਜਾਲੀ ਵਰਤੀ, ਇਸ ਲਈ ਪੌਦੇ ਵੀ ਸਿਹਤਮੰਦ ਹਨ ਅਤੇ ਹੱਥ ਵੀ ਸੁਰੱਖਿਅਤ ਹਨ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "What plant has holes in its leaves? / ਕਿਸ ਪੌਦੇ ਦੇ ਪੱਤਿਆਂ ਵਿੱਚ ਛੇਦ ਹਨ?",
        "choices": [
          "spinach / ਪਾਲਕ",
          "wheat / ਗੇਂਹੂੰ",
          "tomato / ਟਮਾਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 mentions holes on spinach leaves. / ਪੈਨਲ 1 ਵਿੱਚ ਪਾਲਕ ਦੇ ਪੱਤੇ ਹਨ।"
      },
      {
        "question": "What do they see under the leaf? / ਪੱਤੇ ਹੇਠ ਉਹ ਕੀ ਵੇਖਦੇ ਹਨ?",
        "choices": [
          "caterpillars / ਸੁੰਡੇ",
          "coins / ਸਿੱਕੇ",
          "buttons / ਬਟਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they spot small green caterpillars. / ਪੈਨਲ 2 ਵਿੱਚ ਸੁੰਡੇ ਹਨ।"
      },
      {
        "question": "What is the safest choice for the child? / ਬੱਚੇ ਲਈ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਚੋਣ ਕੀ ਹੈ?",
        "choices": [
          "do not touch and ask an adult / ਨਾ ਛੂਹੋ ਅਤੇ ਵੱਡੇ ਨੂੰ ਪੁੱਛੋ",
          "touch all bugs / ਸਾਰੇ ਕੀੜੇ ਛੂਹੋ",
          "eat the leaves / ਪੱਤੇ ਖਾਓ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says do not touch and adults choose safe ways. / ਪੈਨਲ 3 ਵਿੱਚ ਨਾ ਛੂਹਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they use to protect the plants? / ਪੌਦੇ ਬਚਾਉਣ ਲਈ ਉਹ ਕੀ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "net cover / ਜਾਲੀ ਕਵਰ",
          "loud music / ਉੱਚਾ ਸੰਗੀਤ",
          "snow / ਬਰਫ਼"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3–5 show using a net cover. / ਪੈਨਲ 3–5 ਵਿੱਚ ਜਾਲੀ ਹੈ।"
      },
      {
        "question": "Why keep the garden clean? / ਬਾਗ ਸਾਫ਼ ਕਿਉਂ ਰੱਖਣਾ?",
        "choices": [
          "fallen leaves can hide bugs / ਡਿੱਗੇ ਪੱਤੇ ਕੀੜੇ ਲੁਕਾ ਸਕਦੇ ਹਨ",
          "to change the sky / ਅਸਮਾਨ ਬਦਲਣ ਲਈ",
          "to stop rain / ਮੀਂਹ ਰੋਕਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says fallen leaves can hide bugs. / ਪੈਨਲ 4 ਵਿੱਚ ਲੁਕਣ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "spinach",
        "meaningEn": "a leafy green vegetable",
        "meaningPa": "ਪਾਲਕ; ਪੱਤਿਆਂ ਵਾਲੀ ਸਬਜ਼ੀ"
      },
      {
        "word": "holes",
        "meaningEn": "small empty spaces",
        "meaningPa": "ਛੇਦ; ਨਿੱਕੇ ਖਾਲੀ ਸੁਰਾਖ"
      },
      {
        "word": "insects",
        "meaningEn": "small bugs",
        "meaningPa": "ਕੀੜੇ; ਨਿੱਕੇ ਜੀਵ"
      },
      {
        "word": "caterpillar",
        "meaningEn": "a small bug that eats leaves",
        "meaningPa": "ਸੁੰਡਾ; ਪੱਤੇ ਖਾਣ ਵਾਲਾ ਕੀੜਾ"
      },
      {
        "word": "irritate",
        "meaningEn": "make skin feel itchy or sore",
        "meaningPa": "ਖੁਜਲਾਅ ਕਰਨਾ; ਚਮੜੀ ਨੂੰ ਤੰਗ ਕਰਨਾ"
      },
      {
        "word": "net",
        "meaningEn": "a mesh cover",
        "meaningPa": "ਜਾਲੀ; ਬਾਰੀਕ ਜਾਲ"
      },
      {
        "word": "cover",
        "meaningEn": "put something over to protect",
        "meaningPa": "ਢੱਕਣਾ; ਰੱਖਿਆ ਲਈ ਉੱਤੇ ਰੱਖਣਾ"
      },
      {
        "word": "damage",
        "meaningEn": "harm",
        "meaningPa": "ਨੁਕਸਾਨ; ਹਾਨੀ"
      },
      {
        "word": "safe",
        "meaningEn": "not dangerous",
        "meaningPa": "ਸੁਰੱਖਿਅਤ; ਖ਼ਤਰਾ ਨਹੀਂ"
      },
      {
        "word": "observe",
        "meaningEn": "look carefully",
        "meaningPa": "ਨਿਰੀਖਣ ਕਰਨਾ; ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "look",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "turn",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "count",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S08",
    "bundleId": 10,
    "orderInBundle": 8,
    "titleEn": "Book 10 · Story 8: Harvest Day",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 8: ਕਟਾਈ ਦਾ ਦਿਨ",
    "englishStory": "Panel 1 (Intro): Today is wheat harvest day, and I see golden heads moving like waves, while the field smells warm, dry, and dusty.\nGrandpa says, \"We harvest when grains are hard, so they store well, and we keep far from the cutting machine.\"\nPanel 2 (Body): First I rub a wheat head between my palms and observe grains fall out, and I notice they feel firm, not soft.\nI ask, \"Can I carry small bundles, and will you show me where to walk, so I stay away from sharp blades?\"\nPanel 3 (Body): Next Grandpa answers, \"Carry only light bundles, and walk behind me, because the machine area is for trained adults only.\"\nThen we stack bundles under shade, and I compare dry bundles to damp ones, so I learn why drying matters before storage.\nPanel 4 (Body): I say, \"I predict drying prevents mold, so our flour stays clean, and we can share food with neighbors later too.\"\nGrandpa smiles and says, \"Yes, and after harvest we thank nature, because farmers and weather always work together each season.\"\nPanel 5 (Conclusion): After that we drink water, wash hands, and rest, and I feel grateful when Grandma sings a small harvest song softly.\nFinally I say, \"Now I understand harvest needs timing and safety, so careful work turns plants into food for many homes.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਗੇਂਹੂੰ ਦੀ ਕਟਾਈ ਦਾ ਦਿਨ ਹੈ, ਅਤੇ ਮੈਂ ਸੋਨੇ ਵਰਗੇ ਸਿੱਟੇ ਲਹਿਰਾਂ ਵਾਂਗ ਹਿਲਦੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਜਦੋਂ ਖੇਤ ਸੁੱਕੀ ਗਰਮ ਖੁਸ਼ਬੂ ਕਰਦਾ ਹੈ।\nਦਾਦਾ ਜੀ ਕਹਿੰਦੇ ਹਨ, \"ਅਸੀਂ ਤਦੋਂ ਕਟਾਈ ਕਰਦੇ ਹਾਂ ਜਦੋਂ ਦਾਣੇ ਸਖ਼ਤ ਹੁੰਦੇ ਹਨ, ਤਾਂ ਜੋ ਸਟੋਰ ਚੰਗਾ ਰਹੇ, ਅਤੇ ਕੱਟਣ ਵਾਲੀ ਮਸ਼ੀਨ ਤੋਂ ਦੂਰ ਰਹਿੰਦੇ ਹਾਂ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਸਿੱਟਾ ਹਥੇਲੀਆਂ ਵਿੱਚ ਮਲਦਾ/ਮਲਦੀ ਹਾਂ ਅਤੇ ਦਾਣੇ ਡਿੱਗਦੇ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਅਤੇ ਮੈਂ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਉਹ ਸਖ਼ਤ ਹਨ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਕੀ ਮੈਂ ਹਲਕੇ ਗੱਛੇ ਚੁੱਕ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਅਤੇ ਤੁਸੀਂ ਦਿਖਾਉਗੇ ਕਿ ਕਿੱਥੇ ਤੁਰਾਂ ਤਾਂ ਜੋ ਤੇਜ਼ ਧਾਰਾਂ ਤੋਂ ਦੂਰ ਰਹਾਂ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਦਾਦਾ ਜੀ ਕਹਿੰਦੇ ਹਨ, \"ਸਿਰਫ਼ ਹਲਕੇ ਗੱਛੇ ਚੁੱਕੋ ਅਤੇ ਮੇਰੇ ਪਿੱਛੇ ਤੁਰੋ, ਕਿਉਂਕਿ ਮਸ਼ੀਨ ਵਾਲਾ ਇਲਾਕਾ ਸਿਰਫ਼ ਤਰਬੀਤ ਵਾਲੇ ਵੱਡਿਆਂ ਲਈ ਹੈ।\"\nਫਿਰ ਅਸੀਂ ਗੱਛੇ ਛਾਂ ਵਿੱਚ ਰੱਖਦੇ ਹਾਂ ਅਤੇ ਮੈਂ ਸੁੱਕੇ ਗੱਛਿਆਂ ਦੀ ਭਿੱਜਿਆਂ ਨਾਲ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਸੁਕਾਉਣ ਦੀ ਲੋੜ ਸਮਝ ਆਵੇ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਸੁਕਾਉਣ ਨਾਲ ਫਫੂੰਦੀ ਨਹੀਂ ਲੱਗਦੀ, ਇਸ ਲਈ ਆਟਾ ਸਾਫ਼ ਰਹਿੰਦਾ ਹੈ ਅਤੇ ਅਸੀਂ ਬਾਅਦ ਵਿੱਚ ਪੜੋਸੀਆਂ ਨਾਲ ਸਾਂਝਾ ਵੀ ਕਰ ਸਕਦੇ ਹਾਂ।\"\nਦਾਦਾ ਜੀ ਮੁਸਕੁਰਾ ਕੇ ਕਹਿੰਦੇ ਹਨ, \"ਹਾਂ, ਅਤੇ ਕਟਾਈ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਕੁਦਰਤ ਦਾ ਧੰਨਵਾਦ ਕਰਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਕਿਸਾਨ ਅਤੇ ਮੌਸਮ ਹਮੇਸ਼ਾਂ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਪਾਣੀ ਪੀਂਦੇ ਹਾਂ, ਹੱਥ ਧੋਂਦੇ ਹਾਂ, ਅਤੇ ਆਰਾਮ ਕਰਦੇ ਹਾਂ, ਅਤੇ ਦਾਦੀ ਦੀ ਛੋਟੀ ਕਟਾਈ ਵਾਲੀ ਧੁਨ ਸੁਣ ਕੇ ਮੈਂ ਖੁਸ਼ ਹੁੰਦਾ/ਹੁੰਦੀ ਹਾਂ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ ਕਟਾਈ ਵਿੱਚ ਸਮਾਂ ਅਤੇ ਸੁਰੱਖਿਆ ਲਾਜ਼ਮੀ ਹੈ, ਇਸ ਲਈ ਧਿਆਨ ਨਾਲ ਕੀਤਾ ਕੰਮ ਕਈ ਘਰਾਂ ਲਈ ਖਾਣਾ ਬਣਦਾ ਹੈ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "What crop are they harvesting? / ਉਹ ਕਿਹੜੀ ਫਸਲ ਕੱਟ ਰਹੇ ਹਨ?",
        "choices": [
          "wheat / ਗੇਂਹੂੰ",
          "spinach / ਪਾਲਕ",
          "mango / ਆਮ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says it is wheat harvest day. / ਪੈਨਲ 1 ਵਿੱਚ ਗੇਂਹੂੰ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "When do they harvest grains? / ਉਹ ਦਾਣੇ ਕਦੋਂ ਕੱਟਦੇ ਹਨ?",
        "choices": [
          "when grains are hard / ਜਦੋਂ ਦਾਣੇ ਸਖ਼ਤ ਹੋਣ",
          "when grains are candy / ਜਦੋਂ ਦਾਣੇ ਕੈਂਡੀ ਹੋਣ",
          "when it snows / ਜਦੋਂ ਬਰਫ਼ ਪਵੇ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they harvest when grains are hard. / ਪੈਨਲ 1 ਵਿੱਚ ਸਖ਼ਤ ਦਾਣੇ ਹਨ।"
      },
      {
        "question": "What safety rule does Grandpa give? / ਦਾਦਾ ਜੀ ਕਿਹੜਾ ਸੁਰੱਖਿਆ ਨਿਯਮ ਦਿੰਦੇ ਹਨ?",
        "choices": [
          "stay far from the cutting machine / ਕੱਟਣ ਵਾਲੀ ਮਸ਼ੀਨ ਤੋਂ ਦੂਰ ਰਹੋ",
          "touch sharp blades / ਤੇਜ਼ ਧਾਰਾਂ ਛੂਹੋ",
          "run in the field / ਖੇਤ ਵਿੱਚ ਦੌੜੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "The story emphasizes staying far from the machine. / ਕਹਾਣੀ ਵਿੱਚ ਮਸ਼ੀਨ ਤੋਂ ਦੂਰ ਰਹਿਣਾ ਹੈ।"
      },
      {
        "question": "Why do they dry bundles before storage? / ਸਟੋਰ ਤੋਂ ਪਹਿਲਾਂ ਗੱਛੇ ਕਿਉਂ ਸੁਕਾਉਂਦੇ ਹਨ?",
        "choices": [
          "to prevent mold / ਫਫੂੰਦੀ ਤੋਂ ਬਚਾਉਣ ਲਈ",
          "to make them heavier / ਭਾਰੀ ਕਰਨ ਲਈ",
          "to make them noisy / ਸ਼ੋਰਲੀ ਬਣਾਉਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3–4 explain drying helps prevent mold. / ਪੈਨਲ 3–4 ਵਿੱਚ ਫਫੂੰਦੀ ਤੋਂ ਬਚਾਉਣਾ ਹੈ।"
      },
      {
        "question": "What does the child want to carry? / ਬੱਚਾ ਕੀ ਚੁੱਕਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹੈ?",
        "choices": [
          "small bundles / ਹਲਕੇ ਗੱਛੇ",
          "the machine / ਮਸ਼ੀਨ",
          "a tree / ਦਰੱਖਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 asks about carrying small bundles. / ਪੈਨਲ 2 ਵਿੱਚ ਹਲਕੇ ਗੱਛੇ ਹਨ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "harvest",
        "meaningEn": "collecting crops when ready",
        "meaningPa": "ਕਟਾਈ; ਤਿਆਰ ਫਸਲ ਇਕੱਠੀ ਕਰਨੀ"
      },
      {
        "word": "wheat",
        "meaningEn": "a grain used to make flour",
        "meaningPa": "ਗੇਂਹੂੰ; ਆਟਾ ਬਣਾਉਣ ਵਾਲਾ ਅਨਾਜ"
      },
      {
        "word": "grain",
        "meaningEn": "a small seed of a crop",
        "meaningPa": "ਦਾਣਾ; ਅਨਾਜ ਦਾ ਨਿੱਕਾ ਬੀਜ"
      },
      {
        "word": "bundle",
        "meaningEn": "a tied group of plants",
        "meaningPa": "ਗੱਛਾ; ਬੰਨ੍ਹਿਆ ਹੋਇਆ ਢੇਰ"
      },
      {
        "word": "blade",
        "meaningEn": "a sharp cutting edge",
        "meaningPa": "ਧਾਰ; ਤੇਜ਼ ਕੱਟਣ ਵਾਲਾ ਹਿੱਸਾ"
      },
      {
        "word": "shade",
        "meaningEn": "a cooler place away from sun",
        "meaningPa": "ਛਾਂ; ਧੁੱਪ ਤੋਂ ਦੂਰ ਠੰਢੀ ਥਾਂ"
      },
      {
        "word": "dry",
        "meaningEn": "not wet",
        "meaningPa": "ਸੁੱਕਾ; ਭਿੱਜਾ ਨਹੀਂ"
      },
      {
        "word": "storage",
        "meaningEn": "keeping things safely for later",
        "meaningPa": "ਸਟੋਰ; ਬਾਅਦ ਲਈ ਸੰਭਾਲ ਕੇ ਰੱਖਣਾ"
      },
      {
        "word": "mold",
        "meaningEn": "bad fungus that grows on wet food",
        "meaningPa": "ਫਫੂੰਦੀ; ਗਿੱਲੀ ਚੀਜ਼ ਉੱਤੇ ਬਣਦੀ ਖ਼ਰਾਬ ਪਰਤ"
      },
      {
        "word": "flour",
        "meaningEn": "powder made from grains",
        "meaningPa": "ਆਟਾ; ਦਾਣਿਆਂ ਦਾ ਪਿਸਿਆ ਪਾਊਡਰ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "walk",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "learn",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S09",
    "bundleId": 10,
    "orderInBundle": 9,
    "titleEn": "Book 10 · Story 9: From Milk to Home",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 9: ਦੁੱਧ ਖੇਤ ਤੋਂ ਘਰ",
    "englishStory": "Panel 1 (Intro): Today I visit a dairy shed, and I see a calm buffalo chewing, while clean buckets and soap wait beside the water tap.\nUncle says, \"We must always wash hands and tools, because milk is food, so cleanliness keeps families healthy and strong.\"\nPanel 2 (Body): First we wash hands for twenty seconds and dry them, and I observe how soap removes dirt that I cannot even see.\nI ask, \"Can you explain why we cover the bucket, and how we keep flies away from fresh milk while we work?\"\nPanel 3 (Body): Next Uncle answers, \"We cover milk to protect it, and we keep the area clean, so fewer insects land and germs stay away.\"\nThen he pours milk through a clean filter cloth, and I compare milk before filtering to milk after filtering in a clear glass.\nPanel 4 (Body): I say, \"I predict chilling milk quickly helps, so it stays fresh longer when we deliver it to homes during summer heat.\"\nUncle replies, \"Yes, we take it to a cooler, and you can watch from here, because electrical machines are not for children.\"\nPanel 5 (Conclusion): After that we label the container and count liters, and I feel confident when I read numbers slowly, without rushing or guessing.\nFinally I smile and say, \"Now I know milk needs hygiene and cooling, so careful farm rules protect everyone who drinks it.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਮੈਂ ਡੇਅਰੀ ਸ਼ੈਡ ਵਿੱਚ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ, ਅਤੇ ਮੈਂ ਭੈਂਸ ਨੂੰ ਸ਼ਾਂਤ ਚੱਬਦੀ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਜਦੋਂ ਸਾਫ਼ ਬਾਲਟੀਆਂ ਅਤੇ ਸਾਬਣ ਨਲਕੇ ਕੋਲ ਪਏ ਹਨ।\nਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਹਮੇਸ਼ਾਂ ਹੱਥ ਅਤੇ ਸੰਦ ਧੋਂਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਦੁੱਧ ਭੋਜਨ ਹੈ, ਇਸ ਲਈ ਸਫ਼ਾਈ ਪਰਿਵਾਰਾਂ ਨੂੰ ਤੰਦਰੁਸਤ ਰੱਖਦੀ ਹੈ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਵੀਹ ਸਕਿੰਟ ਹੱਥ ਧੋਂਦੇ ਹਾਂ ਅਤੇ ਸੁਕਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਨੋਟ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਸਾਬਣ ਉਹ ਗੰਦ ਵੀ ਹਟਾਂਦਾ ਹੈ ਜੋ ਅੱਖ ਨੂੰ ਨਹੀਂ ਦਿਸਦਾ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਤੁਸੀਂ ਬਾਲਟੀ ਕਿਉਂ ਢੱਕਦੇ ਹੋ, ਅਤੇ ਕੰਮ ਕਰਦਿਆਂ ਤਾਜ਼ੇ ਦੁੱਧ ਤੋਂ ਮੱਖੀਆਂ ਕਿਵੇਂ ਦੂਰ ਰੱਖਦੇ ਹੋ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਦੁੱਧ ਨੂੰ ਬਚਾਉਣ ਲਈ ਢੱਕਦੇ ਹਾਂ ਅਤੇ ਥਾਂ ਸਾਫ਼ ਰੱਖਦੇ ਹਾਂ, ਤਾਂ ਜੋ ਕੀੜੇ ਘੱਟ ਬੈਠਣ ਅਤੇ ਜਰਾਸੀਮ ਦੂਰ ਰਹਿਣ।\"\nਫਿਰ ਉਹ ਸਾਫ਼ ਛਾਣਣ ਵਾਲੇ ਕਪੜੇ ਨਾਲ ਦੁੱਧ ਛਾਣਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਛਾਣਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੇ ਦੁੱਧ ਦੀ ਤੁਲਨਾ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਮੇਰਾ ਅੰਦਾਜ਼ਾ ਹੈ ਦੁੱਧ ਨੂੰ ਜਲਦੀ ਠੰਢਾ ਕਰਨ ਨਾਲ ਇਹ ਲੰਮਾ ਤਾਜ਼ਾ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਗਰਮੀ ਵਿੱਚ ਘਰਾਂ ਤੱਕ ਪਹੁੰਚਾਉਣਾ ਆਸਾਨ ਹੁੰਦਾ ਹੈ।\"\nਚਾਚਾ ਕਹਿੰਦਾ ਹੈ, \"ਹਾਂ, ਅਸੀਂ ਇਸਨੂੰ ਕੂਲਰ ਵਿੱਚ ਰੱਖਦੇ ਹਾਂ, ਅਤੇ ਤੁਸੀਂ ਇੱਥੋਂ ਵੇਖ ਸਕਦੇ ਹੋ, ਕਿਉਂਕਿ ਬਿਜਲੀ ਵਾਲੀਆਂ ਮਸ਼ੀਨਾਂ ਬੱਚਿਆਂ ਲਈ ਨਹੀਂ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਡੱਬੇ ਉੱਤੇ ਲੇਬਲ ਲਗਾਂਦੇ ਹਾਂ ਅਤੇ ਲੀਟਰ ਗਿਣਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਨੰਬਰ ਹੌਲੀ ਪੜ੍ਹ ਕੇ ਆਪਣੇ ਆਪ ਨੂੰ ਭਰੋਸੇ ਵਾਲਾ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।\nਆਖਿਰ ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਹੁਣ ਮੈਂ ਜਾਣਦਾ/ਜਾਣਦੀ ਹਾਂ ਦੁੱਧ ਨੂੰ ਸਫ਼ਾਈ ਅਤੇ ਠੰਢਕ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਖੇਤ ਦੇ ਨਿਯਮ ਹਰ ਪੀਣ ਵਾਲੇ ਦੀ ਰੱਖਿਆ ਕਰਦੇ ਹਨ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "Where does the child visit? / ਬੱਚਾ ਕਿੱਥੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹੈ?",
        "choices": [
          "dairy shed / ਡੇਅਰੀ ਸ਼ੈਡ",
          "playground / ਖੇਡ ਮੈਦਾਨ",
          "classroom / ਕਲਾਸ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says the child visits a dairy shed. / ਪੈਨਲ 1 ਵਿੱਚ ਡੇਅਰੀ ਸ਼ੈਡ ਹੈ।"
      },
      {
        "question": "What must they do first? / ਉਹ ਪਹਿਲਾਂ ਕੀ ਕਰਦੇ ਹਨ?",
        "choices": [
          "wash hands / ਹੱਥ ਧੋਣੇ",
          "touch machines / ਮਸ਼ੀਨ ਛੂਹਣੀ",
          "run inside / ਅੰਦਰ ਦੌੜਨਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 says they wash hands for twenty seconds. / ਪੈਨਲ 2 ਵਿੱਚ ਹੱਥ ਧੋਣੇ ਹਨ।"
      },
      {
        "question": "Why do they cover the bucket? / ਬਾਲਟੀ ਕਿਉਂ ਢੱਕਦੇ ਹਨ?",
        "choices": [
          "to protect milk from flies and germs / ਮੱਖੀਆਂ ਤੇ ਜਰਾਸੀਮ ਤੋਂ ਬਚਾਉਣ ਲਈ",
          "to make it heavier / ਭਾਰੀ ਕਰਨ ਲਈ",
          "to hide toys / ਖਿਡੌਣੇ ਲੁਕਾਉਣ ਲਈ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 explains covering protects milk from insects and germs. / ਪੈਨਲ 3 ਵਿੱਚ ਸੁਰੱਖਿਆ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they use to filter the milk? / ਦੁੱਧ ਛਾਣਣ ਲਈ ਕੀ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "filter cloth / ਛਾਣਣ ਵਾਲਾ ਕਪੜਾ",
          "paper book / ਕਾਗਜ਼ੀ ਕਿਤਾਬ",
          "sand / ਰੇਤ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says milk is poured through a clean filter cloth. / ਪੈਨਲ 3 ਵਿੱਚ ਛਾਣਣ ਵਾਲਾ ਕਪੜਾ ਹੈ।"
      },
      {
        "question": "What is the safety rule about machines? / ਮਸ਼ੀਨਾਂ ਬਾਰੇ ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹੈ?",
        "choices": [
          "children watch from far / ਬੱਚੇ ਦੂਰੋਂ ਵੇਖਣ",
          "children touch electrical machines / ਬੱਚੇ ਬਿਜਲੀ ਮਸ਼ੀਨ ਛੂਹਣ",
          "children climb on machines / ਬੱਚੇ ਮਸ਼ੀਨ ਤੇ ਚੜ੍ਹਣ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says electrical machines are not for children. / ਪੈਨਲ 4 ਵਿੱਚ ਬੱਚਿਆਂ ਲਈ ਨਹੀਂ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "dairy",
        "meaningEn": "place where milk is collected and handled",
        "meaningPa": "ਡੇਅਰੀ; ਜਿੱਥੇ ਦੁੱਧ ਨਾਲ ਕੰਮ ਹੁੰਦਾ ਹੈ"
      },
      {
        "word": "buffalo",
        "meaningEn": "a large animal that gives milk",
        "meaningPa": "ਭੈਂਸ; ਦੁੱਧ ਦੇਣ ਵਾਲਾ ਜਾਨਵਰ"
      },
      {
        "word": "bucket",
        "meaningEn": "a container for holding liquid",
        "meaningPa": "ਬਾਲਟੀ; ਤਰਲ ਰੱਖਣ ਵਾਲਾ ਡੱਬਾ"
      },
      {
        "word": "soap",
        "meaningEn": "used to clean hands",
        "meaningPa": "ਸਾਬਣ; ਸਫ਼ਾਈ ਲਈ"
      },
      {
        "word": "germs",
        "meaningEn": "tiny things that can make you sick",
        "meaningPa": "ਜਰਾਸੀਮ; ਨਿੱਕੇ ਜੀਵ ਜੋ ਬਿਮਾਰ ਕਰ ਸਕਦੇ ਹਨ"
      },
      {
        "word": "flies",
        "meaningEn": "small insects that land on food",
        "meaningPa": "ਮੱਖੀਆਂ; ਖਾਣੇ ਉੱਤੇ ਬੈਠਣ ਵਾਲੇ ਕੀੜੇ"
      },
      {
        "word": "filter",
        "meaningEn": "remove small bits by passing through cloth",
        "meaningPa": "ਛਾਣਣਾ; ਕਪੜੇ ਰਾਹੀਂ ਛਾਣਨਾ"
      },
      {
        "word": "cooler",
        "meaningEn": "a machine that keeps things cold",
        "meaningPa": "ਕੂਲਰ; ਠੰਢਾ ਰੱਖਣ ਵਾਲੀ ਮਸ਼ੀਨ"
      },
      {
        "word": "liters",
        "meaningEn": "a unit to measure liquid amount",
        "meaningPa": "ਲੀਟਰ; ਤਰਲ ਮਾਪਣ ਦੀ ਇਕਾਈ"
      },
      {
        "word": "hygiene",
        "meaningEn": "clean habits to stay healthy",
        "meaningPa": "ਸਫ਼ਾਈ; ਤੰਦਰੁਸਤ ਰਹਿਣ ਲਈ ਸਾਫ਼ ਆਦਤਾਂ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "helps",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "are",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  },
  {
    "storyId": "B10_S10",
    "bundleId": 10,
    "orderInBundle": 10,
    "titleEn": "Book 10 · Story 10: Mandi Day: Fair Price",
    "titlePa": "ਕਿਤਾਬ 10 · ਕਹਾਣੀ 10: ਮੰਡੀ ਦਾ ਦਿਨ: ਨਿਆਪੂਰਨ ਕੀਮਤ",
    "englishStory": "Panel 1 (Intro): Today we take vegetables to the mandi market, and I hear many voices, while sacks of tomatoes and onions wait near the scale.\nDad says, \"We will speak politely and count carefully, so we get a fair price and understand our budget for the week.\"\nPanel 2 (Body): First I observe the weighing scale and watch the needle move, while the buyer adds weights until the basket balances evenly.\nI ask, \"Excuse me, can you repeat the weight slowly, and can I write it down on our receipt to remember later?\"\nPanel 3 (Body): Next the buyer answers, \"It is twenty kilos today, and yes you can write it, because clear records prevent confusion later.\"\nThen Dad asks, \"How much per kilo, please?\" and the buyer replies with a number, so we calculate the total together.\nPanel 4 (Body): I say, \"If the price is low, we can wait or sell less, because we must protect our work and pay for seeds.\"\nDad smiles and says, \"Good thinking, and we can compare nearby stalls, so we choose the best deal without arguing.\"\nPanel 5 (Conclusion): After that we shake hands, take the receipt, and load sacks, and I feel proud because I used calm market English.\nFinally I explain, \"From soil to market, farming needs science and manners, so I can talk, count, and help my family.\"",
    "punjabiStory": "ਪੈਨਲ 1 (ਸ਼ੁਰੂਆਤ): ਅੱਜ ਅਸੀਂ ਸਬਜ਼ੀਆਂ ਮੰਡੀ ਲੈ ਜਾਂਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਬਹੁਤ ਆਵਾਜ਼ਾਂ ਸੁਣਦਾ/ਸੁਣਦੀ ਹਾਂ, ਜਦੋਂ ਟਮਾਟਰ ਤੇ ਪਿਆਜ਼ ਦੇ ਬੋਰੇ ਤਰਾਜੂ ਕੋਲ ਪਏ ਹਨ।\nਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਅਸੀਂ ਨਮਰਤਾ ਨਾਲ ਬੋਲਾਂਗੇ ਅਤੇ ਧਿਆਨ ਨਾਲ ਗਿਣਾਂਗੇ, ਤਾਂ ਜੋ ਨਿਆਪੂਰਨ ਕੀਮਤ ਮਿਲੇ ਅਤੇ ਹਫ਼ਤੇ ਦਾ ਬਜਟ ਸਮਝ ਆਵੇ।\"\nਪੈਨਲ 2 (ਵਿਚਕਾਰ): ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਤਰਾਜੂ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ ਅਤੇ ਸੂਈ ਹਿਲਦੀ ਵੇਖਦਾ/ਵੇਖਦੀ ਹਾਂ, ਜਦੋਂ ਖਰੀਦਦਾਰ ਵਜ਼ਨ ਰੱਖ ਕੇ ਟੋਕਰਾ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ।\nਮੈਂ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹਾਂ, \"ਐਕਸਕਿਊਜ਼ ਮੀ, ਕੀ ਤੁਸੀਂ ਵਜ਼ਨ ਹੌਲੀ ਦੋਹਰਾ ਸਕਦੇ ਹੋ, ਅਤੇ ਕੀ ਮੈਂ ਇਹ ਰਸੀਦ ਉੱਤੇ ਲਿਖ ਲਵਾਂ ਤਾਂ ਜੋ ਬਾਅਦ ਵਿੱਚ ਯਾਦ ਰਹੇ?\"\nਪੈਨਲ 3 (ਵਿਚਕਾਰ): ਖਰੀਦਦਾਰ ਕਹਿੰਦਾ ਹੈ, \"ਅੱਜ ਵੀਹ ਕਿਲੋ ਹੈ, ਅਤੇ ਹਾਂ, ਤੁਸੀਂ ਲਿਖ ਸਕਦੇ ਹੋ, ਕਿਉਂਕਿ ਸਾਫ਼ ਰਿਕਾਰਡ ਨਾਲ ਉਲਝਣ ਨਹੀਂ ਹੁੰਦੀ।\"\nਫਿਰ ਪਿਉ ਪੁੱਛਦਾ ਹੈ, \"ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਕਿਲੋ ਦੀ ਕੀਮਤ ਕਿੰਨੀ ਹੈ?\" ਅਤੇ ਖਰੀਦਦਾਰ ਨੰਬਰ ਦੱਸਦਾ ਹੈ, ਤਾਂ ਅਸੀਂ ਕੁੱਲ ਜੋੜ ਕੱਢਦੇ ਹਾਂ।\nਪੈਨਲ 4 (ਵਿਚਕਾਰ): ਮੈਂ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ, \"ਜੇ ਕੀਮਤ ਘੱਟ ਹੋਵੇ ਤਾਂ ਅਸੀਂ ਉਡੀਕ ਕਰ ਸਕਦੇ ਹਾਂ ਜਾਂ ਘੱਟ ਵੇਚ ਸਕਦੇ ਹਾਂ, ਕਿਉਂਕਿ ਸਾਡੀ ਮਿਹਨਤ ਦੀ ਰੱਖਿਆ ਅਤੇ ਬੀਜਾਂ ਦੀ ਭੁਗਤਾਨੀ ਵੀ ਕਰਨੀ ਹੈ।\"\nਪਿਉ ਕਹਿੰਦਾ ਹੈ, \"ਵਧੀਆ ਸੋਚ, ਅਤੇ ਅਸੀਂ ਨੇੜੇ ਵਾਲੀਆਂ ਦੁਕਾਨਾਂ ਨਾਲ ਤੁਲਨਾ ਕਰਾਂਗੇ, ਤਾਂ ਜੋ ਬਿਨਾਂ ਝਗੜੇ ਸਭ ਤੋਂ ਚੰਗਾ ਸੌਦਾ ਚੁਣੀਏ।\"\nਪੈਨਲ 5 (ਅੰਤ): ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਹੱਥ ਮਿਲਾਂਦੇ ਹਾਂ, ਰਸੀਦ ਲੈਂਦੇ ਹਾਂ, ਅਤੇ ਬੋਰੇ ਲੋਡ ਕਰਦੇ ਹਾਂ, ਅਤੇ ਮੈਂ ਮਾਣ ਮਹਿਸੂਸ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਸ਼ਾਂਤ ਮੰਡੀ ਵਾਲੀ ਅੰਗਰੇਜ਼ੀ ਵਰਤੀ।\nਆਖਿਰ ਮੈਂ ਸਮਝਾਉਂਦਾ/ਸਮਝਾਂਦੀ ਹਾਂ, \"ਮਿੱਟੀ ਤੋਂ ਮੰਡੀ ਤੱਕ, ਖੇਤੀ ਨੂੰ ਸਾਇੰਸ ਅਤੇ ਤਮੀਜ਼ ਦੋਵੇਂ ਚਾਹੀਦੇ ਹਨ, ਇਸ ਲਈ ਮੈਂ ਬੋਲ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਗਿਣ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਅਤੇ ਪਰਿਵਾਰ ਦੀ ਮਦਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।\"",
    "multipleChoiceQuestions": [
      {
        "question": "Where do they take vegetables? / ਉਹ ਸਬਜ਼ੀਆਂ ਕਿੱਥੇ ਲੈ ਜਾਂਦੇ ਹਨ?",
        "choices": [
          "mandi market / ਮੰਡੀ",
          "clinic / ਕਲੀਨਿਕ",
          "playground / ਖੇਡ ਮੈਦਾਨ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 1 says they go to the mandi market. / ਪੈਨਲ 1 ਵਿੱਚ ਮੰਡੀ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What tool do they use to check weight? / ਵਜ਼ਨ ਚੈੱਕ ਕਰਨ ਲਈ ਕੀ ਵਰਤਦੇ ਹਨ?",
        "choices": [
          "weighing scale / ਤਰਾਜੂ",
          "ruler / ਰੂਲਰ",
          "thermometer / ਥਰਮੋਮੀਟਰ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 describes the weighing scale and needle. / ਪੈਨਲ 2 ਵਿੱਚ ਤਰਾਜੂ ਹੈ।"
      },
      {
        "question": "What does the child ask politely? / ਬੱਚਾ ਨਮਰਤਾ ਨਾਲ ਕੀ ਪੁੱਛਦਾ/ਪੁੱਛਦੀ ਹੈ?",
        "choices": [
          "repeat the weight slowly / ਵਜ਼ਨ ਹੌਲੀ ਦੋਹਰਾਓ",
          "shout louder / ਹੋਰ ਉੱਚਾ ਚੀਕੋ",
          "throw the receipt / ਰਸੀਦ ਸੁੱਟੋ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 2 shows the child asking to repeat the weight slowly. / ਪੈਨਲ 2 ਵਿੱਚ ਹੌਲੀ ਦੋਹਰਾਉਣ ਦੀ ਗੱਲ ਹੈ।"
      },
      {
        "question": "What do they calculate together? / ਉਹ ਇਕੱਠੇ ਕੀ ਜੋੜ ਕੱਢਦੇ ਹਨ?",
        "choices": [
          "the total price / ਕੁੱਲ ਕੀਮਤ",
          "the color of the sky / ਅਸਮਾਨ ਦਾ ਰੰਗ",
          "the number of clouds / ਬੱਦਲਾਂ ਦੀ ਗਿਣਤੀ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 3 says they calculate the total together. / ਪੈਨਲ 3 ਵਿੱਚ ਕੁੱਲ ਜੋੜ ਹੈ।"
      },
      {
        "question": "What is a good choice if the price is low? / ਕੀਮਤ ਘੱਟ ਹੋਵੇ ਤਾਂ ਚੰਗੀ ਚੋਣ ਕੀ ਹੈ?",
        "choices": [
          "wait or sell less / ਉਡੀਕ ਕਰਨਾ ਜਾਂ ਘੱਟ ਵੇਚਣਾ",
          "argue loudly / ਉੱਚੀ ਆਵਾਜ਼ ਨਾਲ ਝਗੜਨਾ",
          "give everything free / ਸਭ ਕੁਝ ਮੁਫ਼ਤ ਦੇਣਾ"
        ],
        "correctChoiceIndex": 0,
        "explanation": "Panel 4 says they can wait or sell less if the price is low. / ਪੈਨਲ 4 ਵਿੱਚ ਉਡੀਕ ਜਾਂ ਘੱਟ ਵੇਚਣ ਦੀ ਗੱਲ ਹੈ।"
      }
    ],
    "vocabularyWords": [
      {
        "word": "mandi",
        "meaningEn": "a big market for selling crops",
        "meaningPa": "ਮੰਡੀ; ਫਸਲ ਵੇਚਣ ਵਾਲੀ ਵੱਡੀ ਮਾਰਕੀਟ"
      },
      {
        "word": "sack",
        "meaningEn": "a large bag",
        "meaningPa": "ਬੋਰਾ; ਵੱਡਾ ਥੈਲਾ"
      },
      {
        "word": "scale",
        "meaningEn": "a tool for weighing",
        "meaningPa": "ਤਰਾਜੂ; ਵਜ਼ਨ ਮਾਪਣ ਵਾਲਾ ਸੰਦ"
      },
      {
        "word": "weight",
        "meaningEn": "how heavy something is",
        "meaningPa": "ਵਜ਼ਨ; ਕਿੰਨਾ ਭਾਰੀ"
      },
      {
        "word": "kilo",
        "meaningEn": "a unit of weight",
        "meaningPa": "ਕਿਲੋ; ਵਜ਼ਨ ਦੀ ਇਕਾਈ"
      },
      {
        "word": "receipt",
        "meaningEn": "paper showing what was sold",
        "meaningPa": "ਰਸੀਦ; ਵੇਚਣ ਦੀ ਕਾਗਜ਼ੀ ਪਰਚੀ"
      },
      {
        "word": "records",
        "meaningEn": "written notes to remember",
        "meaningPa": "ਰਿਕਾਰਡ; ਲਿਖਤ ਨੋਟ"
      },
      {
        "word": "budget",
        "meaningEn": "a plan for how to use money",
        "meaningPa": "ਬਜਟ; ਪੈਸਿਆਂ ਦੀ ਯੋਜਨਾ"
      },
      {
        "word": "fair price",
        "meaningEn": "a price that is right and honest",
        "meaningPa": "ਨਿਆਪੂਰਨ ਕੀਮਤ; ਠੀਕ ਤੇ ਇਮਾਨਦਾਰ ਕੀਮਤ"
      },
      {
        "word": "compare",
        "meaningEn": "check and choose the best option",
        "meaningPa": "ਤੁਲਨਾ ਕਰਨੀ; ਵੇਖ ਕੇ ਚੰਗੀ ਚੋਣ"
      }
    ],
    "partsOfSpeech": {
      "verbs": [
        {
          "en": "wait",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "count",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "write",
          "pa": "ਕਿਰਿਆ"
        },
        {
          "en": "is",
          "pa": "ਕਿਰਿਆ"
        }
      ]
    }
  }
];

(function buildReadingsDataset() {
  function readingId(index) {
    return "R" + index;
  }

  function buildLegacyQuestions(story) {
    var mcq = Array.isArray(story && story.multipleChoiceQuestions)
      ? story.multipleChoiceQuestions
      : [];
    return mcq.map(function(q) {
      var choices = Array.isArray(q && q.choices) ? q.choices : [];
      var choicesPa = Array.isArray(q && q.choicesPa) ? q.choicesPa : [];
      return {
        q: q && q.question ? q.question : "",
        options: choices.map(function(choice, idx) {
          return {
            en: choice,
            pa: choicesPa[idx] || choice
          };
        }),
        explanation: {
          en: (q && q.explanation) || "",
          pa: (q && q.explanationPa) || ((q && q.explanation) || "")
        },
        correctIndex: (q && typeof q.correctChoiceIndex === "number") ? q.correctChoiceIndex : 0
      };
    });
  }

  var GRAMMAR_POS_ORDER = [
    "nouns",
    "verbs",
    "pronouns",
    "adjectives",
    "adverbs",
    "prepositions",
    "conjunctions",
    "articles",
    "interjections"
  ];

  var GRAMMAR_DEFAULT_DEFINITIONS = {
    nouns: {
      definitionEn: "A noun is a person, place, or thing.",
      definitionPa: "ਨਾਂਵ ਵਿਅਕਤੀ, ਥਾਂ ਜਾਂ ਚੀਜ਼ ਦਾ ਨਾਂ ਹੁੰਦਾ ਹੈ।"
    },
    verbs: {
      definitionEn: "A verb shows an action or a state (being).",
      definitionPa: "ਕਿਰਿਆ ਕੰਮ ਜਾਂ ਹਾਲਤ (ਹੋਣਾ) ਦੱਸਦੀ ਹੈ।"
    },
    pronouns: {
      definitionEn: "A pronoun replaces a noun (I, you, my).",
      definitionPa: "ਸਰਵਨਾਮ ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ (ਮੈਂ, ਤੂੰ/ਤੁਸੀਂ, ਮੇਰਾ)।"
    },
    adjectives: {
      definitionEn: "An adjective describes a noun.",
      definitionPa: "ਵਿਸ਼ੇਸ਼ਣ ਨਾਂਵ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਦੱਸਦਾ ਹੈ।"
    },
    adverbs: {
      definitionEn: "An adverb describes a verb, adjective, or another adverb (how, when, where).",
      definitionPa: "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਕਿਰਿਆ, ਵਿਸ਼ੇਸ਼ਣ ਜਾਂ ਹੋਰ ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ ਬਾਰੇ ਦੱਸਦਾ ਹੈ (ਕਿਵੇਂ, ਕਦੋਂ, ਕਿੱਥੇ)।"
    },
    prepositions: {
      definitionEn: "A preposition shows location or relationship (in, on, by).",
      definitionPa: "ਸਬੰਧ ਬੋਧਕ ਥਾਂ ਜਾਂ ਸਬੰਧ ਦੱਸਦਾ ਹੈ (ਵਿੱਚ, ਉੱਤੇ, ਦੇ ਕੋਲ)।"
    },
    conjunctions: {
      definitionEn: "A conjunction joins words, phrases, or clauses (and, but, because).",
      definitionPa: "ਸੰਯੋਜਕ ਸ਼ਬਦ, ਭਾਗਾਂ ਜਾਂ ਵਾਕਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ (ਅਤੇ, ਪਰ, ਕਿਉਂਕਿ)।"
    },
    articles: {
      definitionEn: "An article introduces a noun as specific or general (a, an, the).",
      definitionPa: "ਲੇਖ (ਆਰਟਿਕਲ) ਨਾਂਵ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ ਅਤੇ ਖ਼ਾਸ ਜਾਂ ਆਮ ਅਰਥ ਦਿੰਦਾ ਹੈ (a, an, the)।"
    },
    interjections: {
      definitionEn: "An interjection shows sudden feeling or reaction (wow!, oh!, yay!).",
      definitionPa: "ਵਿਸਮਿਆਦਿਬੋਧਕ ਅਚਾਨਕ ਭਾਵਨਾ ਜਾਂ ਪ੍ਰਤੀਕਿਰਿਆ ਦੱਸਦਾ ਹੈ (ਵਾਹ!, ਓਹ!, ਯੇ!)."
    }
  };

  function deriveArticlesFromStoryText(englishStory) {
    var text = (englishStory || "").toLowerCase();
    var out = [];
    function add(en, pa) {
      for (var i = 0; i < out.length; i++) {
        if ((out[i] && out[i].en) === en) return;
      }
      out.push({ en: en, pa: pa });
    }
    if (/\bthe\b/.test(text)) add("the", "ਉਹ/ਉਹੀ");
    if (/\ban\b/.test(text)) add("an", "ਇੱਕ");
    if (/\ba\b/.test(text)) add("a", "ਇੱਕ");
    if (!out.length) add("the", "ਉਹ/ਉਹੀ");
    return out;
  }

  function inferPartsFromVocabulary(vocabularyWords) {
    var inferred = {
      nouns: [],
      verbs: [],
      pronouns: [],
      adjectives: [],
      adverbs: [],
      prepositions: [],
      conjunctions: [],
      articles: [],
      interjections: []
    };

    var vocab = Array.isArray(vocabularyWords) ? vocabularyWords : [];
    for (var i = 0; i < vocab.length; i++) {
      var item = vocab[i] || {};
      var enWord = (item.word || "").trim();
      var paWord = (item.meaningPa || "").trim();
      if (!enWord && !paWord) continue;
      var entry = { en: enWord || paWord || "—", pa: paWord || enWord || "—" };
      var meaningEn = (item.meaningEn || "").toLowerCase();

      if (/^\s*verb\b/.test(meaningEn)) inferred.verbs.push(entry);
      else if (/^\s*pronoun\b/.test(meaningEn)) inferred.pronouns.push(entry);
      else if (/^\s*adjective\b/.test(meaningEn)) inferred.adjectives.push(entry);
      else if (/^\s*adverb\b/.test(meaningEn)) inferred.adverbs.push(entry);
      else if (/^\s*preposition\b/.test(meaningEn)) inferred.prepositions.push(entry);
      else if (/^\s*conjunction\b/.test(meaningEn)) inferred.conjunctions.push(entry);
      else if (/^\s*(article|determiner)\b/.test(meaningEn)) inferred.articles.push(entry);
      else if (/^\s*interjection\b/.test(meaningEn)) inferred.interjections.push(entry);
      else inferred.nouns.push(entry);
    }

    return inferred;
  }

  function normalizePosEntries(items) {
    var out = [];
    var src = Array.isArray(items) ? items : [];
    for (var i = 0; i < src.length; i++) {
      var item = src[i] || {};
      var en = "";
      var pa = "";
      if (typeof item === "string") {
        en = item.trim();
      } else if (item && typeof item === "object") {
        en = (item.en || "").trim();
        pa = (item.pa || "").trim();
      }
      if (!en && !pa) continue;
      out.push({
        en: en || pa || "—",
        pa: pa || en || "—"
      });
    }
    return out;
  }

  function mergePosEntries(baseItems, extraItems, maxItems) {
    var out = normalizePosEntries(baseItems);
    var extra = normalizePosEntries(extraItems);
    var limit = (typeof maxItems === "number" && maxItems > 0) ? maxItems : 8;

    for (var i = 0; i < extra.length; i++) {
      var en = ((extra[i] && extra[i].en) || "").toLowerCase();
      if (!en) continue;
      var exists = false;
      for (var j = 0; j < out.length; j++) {
        if ((((out[j] && out[j].en) || "").toLowerCase()) === en) {
          exists = true;
          break;
        }
      }
      if (!exists) out.push(extra[i]);
      if (out.length >= limit) break;
    }

    return out;
  }

  function derivePartsFromStoryText(englishStory, vocabularyWords) {
    var text = (englishStory || "").toLowerCase();
    var tokens = text.match(/[a-z']+/g) || [];
    var tokenSet = {};
    for (var i = 0; i < tokens.length; i++) tokenSet[tokens[i]] = true;

    var out = {
      nouns: [],
      verbs: [],
      pronouns: [],
      adjectives: [],
      adverbs: [],
      prepositions: [],
      conjunctions: [],
      articles: deriveArticlesFromStoryText(englishStory),
      interjections: []
    };

    function add(list, en, pa) {
      var key = (en || "").toLowerCase();
      if (!key) return;
      for (var j = 0; j < list.length; j++) {
        if (((list[j] && list[j].en) || "").toLowerCase() === key) return;
      }
      list.push({ en: en, pa: pa });
    }

    function addFromWordMap(list, map) {
      for (var word in map) {
        if (!Object.prototype.hasOwnProperty.call(map, word)) continue;
        if (tokenSet[word]) add(list, word, map[word]);
      }
    }

    addFromWordMap(out.pronouns, {
      i: "ਮੈਂ", we: "ਅਸੀਂ", you: "ਤੂੰ/ਤੁਸੀਂ", he: "ਉਹ", she: "ਉਹ", it: "ਇਹ", they: "ਉਹ",
      my: "ਮੇਰਾ/ਮੇਰੀ", our: "ਸਾਡਾ/ਸਾਡੀ", your: "ਤੁਹਾਡਾ/ਤੁਹਾਡੀ", his: "ਉਸਦਾ", her: "ਉਸਦੀ", their: "ਉਹਨਾਂ ਦਾ"
    });

    addFromWordMap(out.conjunctions, {
      and: "ਅਤੇ", but: "ਪਰ", because: "ਕਿਉਂਕਿ", so: "ਇਸ ਲਈ", or: "ਜਾਂ", if: "ਜੇ", when: "ਜਦੋਂ", then: "ਫਿਰ", after: "ਬਾਅਦ", before: "ਪਹਿਲਾਂ"
    });

    addFromWordMap(out.prepositions, {
      in: "ਵਿੱਚ", on: "ਉੱਤੇ", at: "ਤੇ", by: "ਦੇ ਕੋਲ", to: "ਵੱਲ", from: "ਤੋਂ", with: "ਨਾਲ", near: "ਨੇੜੇ",
      behind: "ਪਿੱਛੇ", under: "ਹੇਠਾਂ", over: "ਉੱਪਰ", between: "ਵਿਚਕਾਰ", into: "ਅੰਦਰ", through: "ਵਿੱਚੋਂ"
    });

    if (text.indexOf("next to") >= 0) add(out.prepositions, "next to", "ਦੇ ਕੋਲ");
    if (text.indexOf("in front of") >= 0) add(out.prepositions, "in front of", "ਦੇ ਸਾਹਮਣੇ");

    addFromWordMap(out.adverbs, {
      slowly: "ਹੌਲੀ", quickly: "ਜਲਦੀ", quietly: "ਚੁੱਪਚਾਪ", carefully: "ਧਿਆਨ ਨਾਲ", calmly: "ਸ਼ਾਂਤੀ ਨਾਲ",
      together: "ਇਕੱਠੇ", always: "ਹਮੇਸ਼ਾ", now: "ਹੁਣ", today: "ਅੱਜ", very: "ਬਹੁਤ", again: "ਫਿਰ"
    });

    addFromWordMap(out.adjectives, {
      big: "ਵੱਡਾ", small: "ਛੋਟਾ", happy: "ਖੁਸ਼", quiet: "ਚੁੱਪ", clean: "ਸਾਫ਼", ready: "ਤਿਆਰ",
      safe: "ਸੁਰੱਖਿਅਤ", lost: "ਗੁੰਮ", tired: "ਥੱਕਿਆ", bright: "ਚਮਕਦਾਰ", red: "ਲਾਲ", short: "ਛੋਟਾ"
    });

    addFromWordMap(out.verbs, {
      go: "ਜਾਣਾ", walk: "ਤੁਰਨਾ", run: "ਦੌੜਨਾ", sit: "ਬੈਠਣਾ", look: "ਵੇਖਣਾ", read: "ਪੜ੍ਹਨਾ", write: "ਲਿਖਣਾ",
      play: "ਖੇਡਣਾ", help: "ਮਦਦ ਕਰਨੀ", wait: "ਉਡੀਕ ਕਰਨੀ", turn: "ਮੁੜਨਾ", stop: "ਰੁਕਣਾ", carry: "ਲੈ ਜਾਣਾ",
      open: "ਖੋਲ੍ਹਣਾ", close: "ਬੰਦ ਕਰਨਾ", stand: "ਖੜ੍ਹਨਾ", ask: "ਪੁੱਛਣਾ", answer: "ਜਵਾਬ ਦੇਣਾ", smile: "ਮੁਸਕੁਰਾਉਣਾ"
    });

    addFromWordMap(out.nouns, {
      school: "ਸਕੂਲ", class: "ਕਲਾਸ", teacher: "ਟੀਚਰ", friend: "ਦੋਸਤ", desk: "ਡੈਸਕ", bag: "ਬੈਗ", book: "ਕਿਤਾਬ",
      park: "ਪਾਰਕ", bus: "ਬੱਸ", road: "ਸੜਕ", door: "ਦਰਵਾਜ਼ਾ", board: "ਬੋਰਡ", library: "ਲਾਇਬ੍ਰੇਰੀ", market: "ਮਾਰਕੀਟ",
      hospital: "ਹਸਪਤਾਲ", firefighter: "ਫਾਇਰਫਾਈਟਰ", story: "ਕਹਾਣੀ", family: "ਪਰਿਵਾਰ", home: "ਘਰ"
    });

    var vocab = Array.isArray(vocabularyWords) ? vocabularyWords : [];
    for (var v = 0; v < vocab.length; v++) {
      var vw = vocab[v] || {};
      var wEn = (vw.word || "").trim();
      var wPa = (vw.meaningPa || "").trim();
      if (wEn || wPa) add(out.nouns, wEn || wPa, wPa || wEn);
    }

    if (text.indexOf("thank you") >= 0) add(out.interjections, "thank you", "ਧੰਨਵਾਦ");
    if (/[!]/.test(englishStory || "")) add(out.interjections, "wow", "ਵਾਹ");

    if (!out.nouns.length) add(out.nouns, "story", "ਕਹਾਣੀ");
    if (!out.verbs.length) add(out.verbs, "go", "ਜਾਣਾ");
    if (!out.pronouns.length) add(out.pronouns, "I", "ਮੈਂ");
    if (!out.adjectives.length) add(out.adjectives, "good", "ਚੰਗਾ");
    if (!out.adverbs.length) add(out.adverbs, "slowly", "ਹੌਲੀ");
    if (!out.prepositions.length) add(out.prepositions, "in", "ਵਿੱਚ");
    if (!out.conjunctions.length) add(out.conjunctions, "and", "ਅਤੇ");
    if (!out.interjections.length) add(out.interjections, "oh", "ਓਹ");

    return out;
  }

  function normalizePartsOfGrammar(story, englishStory, vocabularyWords) {
    var source = (story && story.partsOfGrammar && typeof story.partsOfGrammar === "object")
      ? story.partsOfGrammar
      : ((story && story.partsOfSpeech && typeof story.partsOfSpeech === "object") ? story.partsOfSpeech : {});

    var out = { definitions: {} };
    var inferred = inferPartsFromVocabulary(vocabularyWords);
    var storyDerived = derivePartsFromStoryText(englishStory, vocabularyWords);

    for (var i = 0; i < GRAMMAR_POS_ORDER.length; i++) {
      var key = GRAMMAR_POS_ORDER[i];
      var rawDef = source && source.definitions && source.definitions[key];
      out.definitions[key] = (rawDef && typeof rawDef === "object")
        ? rawDef
        : GRAMMAR_DEFAULT_DEFINITIONS[key];

      var arr = Array.isArray(source && source[key]) ? source[key].slice() : [];
      arr = mergePosEntries(arr, inferred[key], 8);
      arr = mergePosEntries(arr, storyDerived[key], 8);
      out[key] = arr;
    }

    if (!out.articles.length) {
      out.articles = deriveArticlesFromStoryText(englishStory);
    }

    return out;
  }

  function toPartsOfSpeech(partsOfGrammar) {
    var out = {};
    for (var i = 0; i < GRAMMAR_POS_ORDER.length; i++) {
      var key = GRAMMAR_POS_ORDER[i];
      out[key] = Array.isArray(partsOfGrammar && partsOfGrammar[key])
        ? partsOfGrammar[key].slice()
        : [];
    }
    return out;
  }

  function normalizeCustomStory(story, fallbackIndex) {
    var id = (story && story.storyId) ? story.storyId : readingId(fallbackIndex);
    var englishStory = (story && (story.englishStory || story.english)) || "";
    var punjabiStory = (story && (story.punjabiStory || story.punjabi)) || "";
    var vocabularyWords = (story && story.vocabularyWords) || [];
    var partsOfGrammar = normalizePartsOfGrammar(story, englishStory, vocabularyWords);
    var partsOfSpeech = toPartsOfSpeech(partsOfGrammar);
    return {
      id: id,
      storyId: id,
      bundleId: (story && typeof story.bundleId === "number") ? story.bundleId : 1,
      orderInBundle: (story && typeof story.orderInBundle === "number") ? story.orderInBundle : fallbackIndex,
      titleEn: (story && story.titleEn) || ("Book 1 · Story " + fallbackIndex),
      titlePa: (story && story.titlePa) || ("ਕਿਤਾਬ 1 · ਕਹਾਣੀ " + fallbackIndex),
      levelHint: "Easy",
      primaryTrackId: "T_READING",
      english: englishStory,
      punjabi: punjabiStory,
      englishStory: englishStory,
      punjabiStory: punjabiStory,
      partsOfSpeech: partsOfSpeech,
      partsOfGrammar: partsOfGrammar,
      vocabularyWords: vocabularyWords,
      multipleChoiceQuestions: Array.isArray(story && story.multipleChoiceQuestions)
        ? story.multipleChoiceQuestions
        : [],
      images: [],
      questions: Array.isArray(story && story.questions)
        ? story.questions
        : buildLegacyQuestions(story)
    };
  }

  function buildQuestion(bookId, storyInBook) {
    var bundleMeta = BUNDLES[bookId - 1] || {};
    var bundleLabel = bundleMeta.nameEn || ("Book " + bookId);
    return {
      q: "Which story is this in " + bundleLabel + "?",
      options: [
        { en: "Story " + storyInBook, pa: "ਕਹਾਣੀ " + storyInBook },
        { en: "Story " + (storyInBook === 10 ? 9 : storyInBook + 1), pa: "ਕਹਾਣੀ " + (storyInBook === 10 ? 9 : storyInBook + 1) },
        { en: "Story " + (storyInBook === 1 ? 2 : storyInBook - 1), pa: "ਕਹਾਣੀ " + (storyInBook === 1 ? 2 : storyInBook - 1) },
        { en: "None of these", pa: "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ" }
      ],
      explanation: {
        en: "This is Story " + storyInBook + " from " + bundleLabel + ".",
        pa: "ਇਹ " + (bundleMeta.namePa || ("ਕਿਤਾਬ " + bookId)) + " ਦੀ ਕਹਾਣੀ " + storyInBook + " ਹੈ।"
      },
      correctIndex: 0
    };
  }

  var CUSTOM_STORIES_BY_BOOK = {
    1: BOOK1_CUSTOM_STORIES,
    2: BOOK2_CUSTOM_STORIES,
    3: BOOK3_CUSTOM_STORIES,
    4: BOOK4_CUSTOM_STORIES,
    5: BOOK5_CUSTOM_STORIES,
    6: BOOK6_CUSTOM_STORIES,
    7: BOOK7_CUSTOM_STORIES,
    8: BOOK8_CUSTOM_STORIES,
    9: BOOK9_CUSTOM_STORIES,
    10: BOOK10_CUSTOM_STORIES
  };

  for (var bookId = 1; bookId <= 10; bookId++) {
    for (var storyInBook = 1; storyInBook <= 10; storyInBook++) {
      var idx = ((bookId - 1) * 10) + storyInBook;
      var customStories = CUSTOM_STORIES_BY_BOOK[bookId];
      if (Array.isArray(customStories) && customStories[storyInBook - 1]) {
        READINGS.push(normalizeCustomStory(customStories[storyInBook - 1], storyInBook));
        continue;
      }

      var bundleMeta = BUNDLES[bookId - 1] || {};
      var bundleLabelEn = bundleMeta.nameEn || ("Book " + bookId);
      var bundleLabelPa = bundleMeta.namePa || ("ਕਿਤਾਬ " + bookId);
      var fallbackEnglish = "This is Story " + storyInBook + " from Book " + bookId + ". We read short lines, learn new words, and answer one simple question. The goal is to build daily reading confidence step by step.";
      var fallbackPunjabi = "ਇਹ ਕਿਤਾਬ " + bookId + " ਦੀ ਕਹਾਣੀ " + storyInBook + " ਹੈ। ਅਸੀਂ ਛੋਟੀਆਂ ਲਾਈਨਾਂ ਪੜ੍ਹਦੇ ਹਾਂ, ਨਵੇਂ ਸ਼ਬਦ ਸਿੱਖਦੇ ਹਾਂ, ਅਤੇ ਇੱਕ ਸਧਾਰਣ ਪ੍ਰਸ਼ਨ ਦਾ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ। ਮਕਸਦ ਰੋਜ਼ਾਨਾ ਪੜ੍ਹਨ ਦਾ ਵਿਸ਼ਵਾਸ ਵਧਾਉਣਾ ਹੈ।";
      var fallbackPartsOfGrammar = normalizePartsOfGrammar({}, fallbackEnglish, []);
      var fallbackPartsOfSpeech = toPartsOfSpeech(fallbackPartsOfGrammar);
      READINGS.push({
        id: readingId(idx),
        bundleId: bookId,
        orderInBundle: storyInBook,
        titleEn: bundleLabelEn + " · Story " + storyInBook,
        titlePa: bundleLabelPa + " · ਕਹਾਣੀ " + storyInBook,
        levelHint: (bookId <= 2) ? "Easy" : ((bookId <= 4) ? "Medium" : "Hard"),
        primaryTrackId: "T_READING",
        english: fallbackEnglish,
        punjabi: fallbackPunjabi,
        englishStory: fallbackEnglish,
        punjabiStory: fallbackPunjabi,
        partsOfSpeech: fallbackPartsOfSpeech,
        partsOfGrammar: fallbackPartsOfGrammar,
        vocabularyWords: [],
        images: [],
        questions: [buildQuestion(bookId, storyInBook)]
      });
    }
  }
})();
