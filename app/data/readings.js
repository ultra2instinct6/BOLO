var BUNDLES = [
  { id: 1, nameEn: "Bundle 1", masteryThreshold: 0.7, requiredPassages: 10 },
  { id: 2, nameEn: "Bundle 2", masteryThreshold: 0.7, requiredPassages: 10 },
  { id: 3, nameEn: "Bundle 3", masteryThreshold: 0.7, requiredPassages: 10 },
  { id: 4, nameEn: "Bundle 4", masteryThreshold: 0.7, requiredPassages: 10 },
  { id: 5, nameEn: "Bundle 5", masteryThreshold: 0.7, requiredPassages: 10 }
];

var READINGS = [
  {
    id: "R1",
    bundleId: 1,
    orderInBundle: 1,
    titleEn: "The Park",
    titlePa: "ਪਾਰਕ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "Today I go to the park with my sister. The park is big and green. I see a tall tree and a small pond. Some kids are playing on the swings. I run to the slide and I laugh. My sister sits on a bench and watches me. A brown dog walks near us, and it wags its tail. Yesterday it rained, so the grass is still wet. I hold my sister's hand and we walk on the path. We hear birds in the trees. Before we go home, we drink water and say, \"This park is fun!\"",
    punjabi: "ਅੱਜ ਮੈਂ ਆਪਣੀ ਭੈਣ ਨਾਲ ਪਾਰਕ ਜਾਂਦਾ ਹਾਂ। ਪਾਰਕ ਵੱਡਾ ਅਤੇ ਹਰਾ ਹੈ। ਮੈਂ ਇੱਕ ਉੱਚਾ ਰੁੱਖ ਅਤੇ ਇੱਕ ਛੋਟਾ ਤਲਾਬ ਵੇਖਦਾ ਹਾਂ। ਕੁਝ ਬੱਚੇ ਝੂਲਿਆਂ ਤੇ ਖੇਡ ਰਹੇ ਹਨ। ਮੈਂ ਫਿਸਲਣ ਵਾਲੀ ਪੱਟੀ ਵੱਲ ਦੌੜਦਾ ਹਾਂ ਅਤੇ ਹੱਸਦਾ ਹਾਂ। ਮੇਰੀ ਭੈਣ ਬੈਂਚ ਤੇ ਬੈਠ ਕੇ ਮੈਨੂੰ ਵੇਖਦੀ ਹੈ। ਇੱਕ ਭੂਰਾ ਕੁੱਤਾ ਸਾਡੇ ਨੇੜੇ ਤੁਰਦਾ ਹੈ ਅਤੇ ਆਪਣੀ ਪੁੱਛ ਹਿਲਾਉਂਦਾ ਹੈ। ਕੱਲ੍ਹ ਮੀਂਹ ਪਿਆ ਸੀ, ਇਸ ਲਈ ਘਾਹ ਹਜੇ ਵੀ ਭਿੱਜਾ ਹੈ। ਮੈਂ ਆਪਣੀ ਭੈਣ ਦਾ ਹੱਥ ਫੜਦਾ ਹਾਂ ਅਤੇ ਰਸਤੇ ਤੇ ਤੁਰਦੇ ਹਾਂ। ਅਸੀਂ ਰੁੱਖਾਂ ਵਿੱਚ ਪੰਛੀਆਂ ਦੀਆਂ ਆਵਾਜ਼ਾਂ ਸੁਣਦੇ ਹਾਂ। ਘਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਪਾਣੀ ਪੀਂਦੇ ਹਾਂ ਅਤੇ ਕਹਿੰਦੇ ਹਾਂ, \"ਇਹ ਪਾਰਕ ਮਜ਼ੇਦਾਰ ਹੈ!\"",
    images: [
      { src: "img/readings/R1/1.png", alt: "Park entrance", captionEn: "Park entrance", captionPa: "ਪਾਰਕ ਦਾ ਦਰਵਾਜ਼ਾ" },
      { src: "img/readings/R1/2.png", alt: "Swings and slide", captionEn: "Swings and slide", captionPa: "ਝੂਲੇ ਅਤੇ ਫਿਸਲਪੱਟੀ" },
      { src: "img/readings/R1/3.png", alt: "Tree and pond", captionEn: "Tree and pond", captionPa: "ਰੁੱਖ ਅਤੇ ਤਲਾਬ" },
      { src: "img/readings/R1/4.png", alt: "Bench with sister", captionEn: "Bench with sister", captionPa: "ਭੈਣ ਨਾਲ ਬੈਂਚ" }
    ],
    questions: [
      {
        q: "Who goes to the park with the child?",
        options: [
          {en: "My sister", pa: "ਮੇਰੀ ਭੈਣ"},
          {en: "My teacher", pa: "ਮੇਰੀ ਅਧਿਆਪਕਾ"},
          {en: "My brother", pa: "ਮੇਰਾ ਭਰਾ"},
          {en: "My grandmother", pa: "ਮੇਰੀ ਦਾਦੀ"}
        ],
        explanation: {
          en: "The passage says I go to the park with my sister.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਮੈਂ ਆਪਣੀ ਭੈਣ ਨਾਲ ਪਾਰਕ ਜਾਂਦਾ ਹਾਂ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R2",
    bundleId: 1,
    orderInBundle: 2,
    titleEn: "A School Day",
    titlePa: "ਸਕੂਲ ਦਾ ਦਿਨ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "I wake up early on Monday. I wash my face and eat breakfast. Then I put my books in my bag. My friend Amir meets me near the corner. We walk to school together. At school, we stand in a line and say good morning. Our teacher writes words on the board. We read, we listen, and we ask questions. At lunch, I open my lunch box and share an apple with Amir. Yesterday we had art class, and I painted a yellow sun. Today we have math, and we count coins. After school, I go home and do my homework.",
    punjabi: "ਮੈਂ ਸੋਮਵਾਰ ਨੂੰ ਸਵੇਰੇ ਜਲਦੀ ਉੱਠਦਾ ਹਾਂ। ਮੈਂ ਮੂੰਹ ਧੋਂਦਾ ਹਾਂ ਅਤੇ ਨਾਸਤਾ ਕਰਦਾ ਹਾਂ। ਫਿਰ ਮੈਂ ਆਪਣੀਆਂ ਕਿਤਾਬਾਂ ਬੈਗ ਵਿੱਚ ਰੱਖਦਾ ਹਾਂ। ਮੇਰਾ ਦੋਸਤ ਅਮੀਰ ਮੈਨੂੰ ਮੋੜ ਦੇ ਨੇੜੇ ਮਿਲਦਾ ਹੈ। ਅਸੀਂ ਇਕੱਠੇ ਸਕੂਲ ਤੁਰਕੇ ਜਾਂਦੇ ਹਾਂ। ਸਕੂਲ ਵਿੱਚ ਅਸੀਂ ਕਤਾਰ ਵਿੱਚ ਖੜ੍ਹਦੇ ਹਾਂ ਅਤੇ ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਹਿੰਦੇ ਹਾਂ। ਸਾਡੀ ਅਧਿਆਪਕਾ ਬੋਰਡ ਤੇ ਸ਼ਬਦ ਲਿਖਦੀ ਹੈ। ਅਸੀਂ ਪੜ੍ਹਦੇ ਹਾਂ, ਸੁਣਦੇ ਹਾਂ, ਅਤੇ ਸਵਾਲ ਪੁੱਛਦੇ ਹਾਂ। ਦੁਪਹਿਰ ਨੂੰ ਮੈਂ ਆਪਣਾ ਡੱਬਾ ਖੋਲ੍ਹਦਾ ਹਾਂ ਅਤੇ ਅਮੀਰ ਨਾਲ ਇੱਕ ਸੇਬ ਸਾਂਝਾ ਕਰਦਾ ਹਾਂ। ਕੱਲ੍ਹ ਸਾਡੀ ਕਲਾ ਦੀ ਕਲਾਸ ਸੀ, ਅਤੇ ਮੈਂ ਪੀਲਾ ਸੂਰਜ ਬਣਾਇਆ ਸੀ। ਅੱਜ ਗਣਿਤ ਹੈ, ਅਤੇ ਅਸੀਂ ਸਿੱਕੇ ਗਿਣਦੇ ਹਾਂ। ਸਕੂਲ ਤੋਂ ਬਾਅਦ ਮੈਂ ਘਰ ਜਾਂਦਾ ਹਾਂ ਅਤੇ ਘਰ ਦਾ ਕੰਮ ਕਰਦਾ ਹਾਂ।",
    images: [
      { src: "img/readings/R2/1.png", alt: "Morning routine", captionEn: "Morning routine", captionPa: "ਸਵੇਰੇ ਦੀ ਤਿਆਰੀ" },
      { src: "img/readings/R2/2.png", alt: "Walking to school", captionEn: "Walking to school", captionPa: "ਸਕੂਲ ਤੁਰਨਾ" },
      { src: "img/readings/R2/3.png", alt: "Classroom board", captionEn: "Classroom board", captionPa: "ਕਲਾਸਰੂਮ ਬੋਰਡ" },
      { src: "img/readings/R2/4.png", alt: "Lunch with friend", captionEn: "Lunch with friend", captionPa: "ਦੋਸਤ ਨਾਲ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ" }
    ],
    questions: [
      {
        q: "What does the teacher write on the board?",
        options: [
          {en: "Words", pa: "ਸ਼ਬਦ"},
          {en: "Pictures", pa: "ਤਸਵੀਰਾਂ"},
          {en: "Numbers", pa: "ਨੰਬਰ"},
          {en: "Games", pa: "ਖੇਡ"}
        ],
        explanation: {
          en: "The passage says Our teacher writes words on the board.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਸਾਡੀ ਅਧਿਆਪਕਾ ਬੋਰਡ ਤੇ ਸ਼ਬਦ ਲਿਖਦੀ ਹੈ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R3",
    bundleId: 1,
    orderInBundle: 3,
    titleEn: "What I Did",
    titlePa: "ਮੈਂ ਕੀ ਕੀਤਾ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "Last Saturday I had a busy day. In the morning, I cleaned my room and folded my clothes. Then I helped my dad wash the car. The water was cold, but we laughed. After lunch, I went to my cousin's house. We played a board game and ate popcorn. My cousin showed me a new book, and I read two pages. In the evening, we walked to the store and bought milk. I carried the bag carefully. When I came home, I felt tired. Today I rest on the sofa and think about my fun Saturday.",
    punjabi: "ਪਿਛਲੇ ਸ਼ਨੀਵਾਰ ਮੇਰਾ ਦਿਨ ਰੁੱਝਿਆ ਹੋਇਆ ਸੀ। ਸਵੇਰੇ ਮੈਂ ਆਪਣਾ ਕਮਰਾ ਸਾਫ਼ ਕੀਤਾ ਅਤੇ ਕੱਪੜੇ ਮੋੜੇ। ਫਿਰ ਮੈਂ ਪਾਪਾ ਦੀ ਗੱਡੀ ਧੋਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ। ਪਾਣੀ ਠੰਢਾ ਸੀ, ਪਰ ਅਸੀਂ ਹੱਸਦੇ ਰਹੇ। ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਮੈਂ ਆਪਣੇ ਕਜ਼ਨ ਦੇ ਘਰ ਗਿਆ। ਅਸੀਂ ਇੱਕ ਬੋਰਡ ਵਾਲੀ ਖੇਡ ਖੇਡੀ ਅਤੇ ਮੱਕੀ ਦੇ ਦਾਣੇ ਖਾਧੇ। ਮੇਰੇ ਕਜ਼ਨ ਨੇ ਮੈਨੂੰ ਇੱਕ ਨਵੀਂ ਕਿਤਾਬ ਵਿਖਾਈ, ਅਤੇ ਮੈਂ ਦੋ ਪੰਨੇ ਪੜ੍ਹੇ। ਸ਼ਾਮ ਨੂੰ ਅਸੀਂ ਦੁਕਾਨ ਤੁਰਕੇ ਗਏ ਅਤੇ ਦੁੱਧ ਲਿਆ। ਮੈਂ ਥੈਲਾ ਧਿਆਨ ਨਾਲ ਫੜਿਆ। ਜਦੋਂ ਮੈਂ ਘਰ ਆਇਆ, ਮੈਂ ਥੱਕ ਗਿਆ ਸੀ। ਅੱਜ ਮੈਂ ਸੋਫੇ ਤੇ ਆਰਾਮ ਕਰਦਾ ਹਾਂ ਅਤੇ ਆਪਨੇ ਮਜ਼ੇਦਾਰ ਸ਼ਨੀਵਾਰ ਬਾਰੇ ਸੋਚਦਾ ਹਾਂ।",
    images: [
      { src: "img/readings/R3/1.png", alt: "Cleaning room", captionEn: "Cleaning room", captionPa: "ਕਮਰਾ ਸਾਫ਼ ਕਰਨਾ" },
      { src: "img/readings/R3/2.png", alt: "Washing car", captionEn: "Washing car", captionPa: "ਗੱਡੀ ਧੋਣਾ" },
      { src: "img/readings/R3/3.png", alt: "Visiting cousin", captionEn: "Visiting cousin", captionPa: "ਕਜ਼ਨ ਦੇ ਘਰ ਜਾਣਾ" },
      { src: "img/readings/R3/4.png", alt: "Buying milk", captionEn: "Buying milk", captionPa: "ਦੁੱਧ ਖਰੀਦਣਾ" }
    ],
    questions: [
      {
        q: "What did the child buy at the store?",
        options: [
          {en: "Milk", pa: "ਦੁੱਧ"},
          {en: "Bread", pa: "ਰੋਟੀ"},
          {en: "Chocolate", pa: "ਚਾਕਲੇਟ"},
          {en: "Toy", pa: "ਖਿਡੌਣਾ"}
        ],
        explanation: {
          en: "The passage says we walked to the store and bought milk.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਅਸੀਂ ਦੁਕਾਨ ਤੁਰਕੇ ਗਏ ਅਤੇ ਦੁੱਧ ਲਿਆ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R4",
    bundleId: 1,
    orderInBundle: 4,
    titleEn: "My Family",
    titlePa: "ਮੇਰਾ ਪਰਿਵਾਰ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "I live with my family in a small home. My mother cooks dinner, and my father tells funny stories. I have one sister and one brother. My sister likes drawing, and her pictures are on the fridge. My brother plays soccer, and his ball is always near the door. Yesterday my grandparents visited us. My grandma gave me a warm hug. My grandpa fixed my toy car. After dinner, we sat together and drank tea. We talked about school and games. Today my family is busy, but we still eat breakfast together.",
    punjabi: "ਮੈਂ ਆਪਣੇ ਪਰਿਵਾਰ ਨਾਲ ਇੱਕ ਛੋਟੇ ਘਰ ਵਿੱਚ ਰਹਿੰਦਾ ਹਾਂ। ਮੇਰੀ ਮਾਂ ਖਾਣਾ ਬਣਾਉਂਦੀ ਹੈ, ਅਤੇ ਮੇਰੇ ਪਿਤਾ ਮਜ਼ੇਦਾਰ ਕਹਾਣੀਆਂ ਸੁਣਾਉਂਦੇ ਹਨ। ਮੇਰੀ ਇੱਕ ਭੈਣ ਅਤੇ ਇੱਕ ਭਰਾ ਹੈ। ਮੇਰੀ ਭੈਣ ਨੂੰ ਚਿੱਤਰ ਬਣਾਉਣਾ ਪਸੰਦ ਹੈ, ਅਤੇ ਉਸਦੇ ਚਿੱਤਰ ਫ੍ਰਿਜ਼ ਤੇ ਲੱਗੇ ਹਨ। ਮੇਰਾ ਭਰਾ ਫੁਟਬਾਲ ਖੇਡਦਾ ਹੈ, ਅਤੇ ਉਸਦੀ ਗੇਂਦ ਅਕਸਰ ਦਰਵਾਜ਼ੇ ਦੇ ਨੇੜੇ ਹੁੰਦੀ ਹੈ। ਕੱਲ੍ਹ ਮੇਰੇ ਦਾਦਾ-ਦਾਦੀ ਸਾਨੂੰ ਮਿਲਣ ਆਏ। ਮੇਰੀ ਦਾਦੀ ਨੇ ਮੈਨੂੰ ਗਰਮ ਗਲੇ ਲਾਇਆ। ਮੇਰੇ ਦਾਦਾ ਨੇ ਮੇਰੀ ਖਿਡੌਣਾ ਗੱਡੀ ਠੀਕ ਕੀਤੀ। ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਇਕੱਠੇ ਬੈਠੇ ਅਤੇ ਚਾਹ ਪੀਤੀ। ਅਸੀਂ ਸਕੂਲ ਅਤੇ ਖੇਡਾਂ ਬਾਰੇ ਗੱਲ ਕੀਤੀ। ਅੱਜ ਮੇਰਾ ਪਰਿਵਾਰ ਰੁੱਝਿਆ ਹੈ, ਪਰ ਅਸੀਂ ਫਿਰ ਵੀ ਨਾਸਤਾ ਇਕੱਠੇ ਕਰਦੇ ਹਾਂ।",
    images: [
      { src: "img/readings/R4/1.png", alt: "Family at home", captionEn: "Family at home", captionPa: "ਘਰ ਵਿੱਚ ਪਰਿਵਾਰ" },
      { src: "img/readings/R4/2.png", alt: "Fridge drawings", captionEn: "Fridge drawings", captionPa: "ਫ੍ਰਿਜ਼ ਤੇ ਚਿੱਤਰ" },
      { src: "img/readings/R4/3.png", alt: "Soccer ball", captionEn: "Soccer ball", captionPa: "ਫੁਟਬਾਲ" },
      { src: "img/readings/R4/4.png", alt: "Tea together", captionEn: "Tea together", captionPa: "ਇਕੱਠੇ ਚਾਹ" }
    ],
    questions: [
      {
        q: "Where are the sister's pictures?",
        options: [
          {en: "On the fridge", pa: "ਫ੍ਰਿਜ਼ ਤੇ"},
          {en: "On the wall", pa: "ਕੰਧ ਤੇ"},
          {en: "On the table", pa: "ਮੇਜ਼ ਤੇ"},
          {en: "In the bag", pa: "ਬੈਗ ਵਿੱਚ"}
        ],
        explanation: {
          en: "The passage says her pictures are on the fridge.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਉਸਦੇ ਚਿੱਤਰ ਫ੍ਰਿਜ਼ ਤੇ ਲੱਗੇ ਹਨ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R5",
    bundleId: 1,
    orderInBundle: 5,
    titleEn: "Tomorrow's Plan",
    titlePa: "ਕੱਲ੍ਹ ਦੀ ਯੋਜਨਾ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "Today I finish my homework early. Tomorrow I will visit my aunt. She lives near a library. I will bring my small backpack and a water bottle. My aunt says we can read new books together. After that, we will go to the bakery. I can choose one cookie. Yesterday I ate a cookie at home, and it was sweet. Tomorrow I will try a different one. In the evening, my aunt will help me make a simple salad. I can wash the tomatoes and cut the cucumber. I feel happy because tomorrow will be a good day.",
    punjabi: "ਅੱਜ ਮੈਂ ਆਪਣਾ ਘਰ ਦਾ ਕੰਮ ਜਲਦੀ ਮੁਕਾ ਲੈਂਦਾ ਹਾਂ। ਕੱਲ੍ਹ ਮੈਂ ਆਪਣੀ ਮਾਸੀ ਨੂੰ ਮਿਲਣ ਜਾਵਾਂਗਾ। ਉਹ ਇੱਕ ਪੁਸਤਕਾਲੇ ਦੇ ਨੇੜੇ ਰਹਿੰਦੀ ਹੈ। ਮੈਂ ਆਪਣਾ ਛੋਟਾ ਬੈਗ ਅਤੇ ਪਾਣੀ ਦੀ ਬੋਤਲ ਲੈ ਕੇ ਜਾਵਾਂਗਾ। ਮੇਰੀ ਮਾਸੀ ਕਹਿੰਦੀ ਹੈ ਕਿ ਅਸੀਂ ਇਕੱਠੇ ਨਵੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਸਕਦੇ ਹਾਂ। ਉਸ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਬੇਕਰੀ ਜਾਵਾਂਗੇ। ਮੈਂ ਇੱਕ ਬਿਸਕੁਟ ਚੁਣ ਸਕਦਾ ਹਾਂ। ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਇੱਕ ਬਿਸਕੁਟ ਖਾਧਾ ਸੀ, ਅਤੇ ਉਹ ਮਿੱਠਾ ਸੀ। ਕੱਲ੍ਹ ਮੈਂ ਕੋਈ ਹੋਰ ਬਿਸਕੁਟ ਲਵਾਂਗਾ। ਸ਼ਾਮ ਨੂੰ ਮੇਰੀ ਮਾਸੀ ਮੈਨੂੰ ਇੱਕ ਸਧਾਰਣ ਸਲਾਦ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੇਗੀ। ਮੈਂ ਟਮਾਟਰ ਧੋ ਸਕਦਾ ਹਾਂ ਅਤੇ ਖੀਰਾ ਕੱਟ ਸਕਦਾ ਹਾਂ। ਮੈਂ ਖੁਸ਼ ਹਾਂ ਕਿਉਂਕਿ ਕੱਲ੍ਹ ਚੰਗਾ ਦਿਨ ਹੋਵੇਗਾ।",
    images: [
      { src: "img/readings/R5/1.png", alt: "Homework done", captionEn: "Homework done", captionPa: "ਘਰ ਦਾ ਕੰਮ ਮੁਕਾਇਆ" },
      { src: "img/readings/R5/2.png", alt: "Visit aunt", captionEn: "Visit aunt", captionPa: "ਮਾਸੀ ਨੂੰ ਮਿਲਣਾ" },
      { src: "img/readings/R5/3.png", alt: "Library and books", captionEn: "Library and books", captionPa: "ਪੁਸਤਕਾਲਾ ਅਤੇ ਕਿਤਾਬਾਂ" },
      { src: "img/readings/R5/4.png", alt: "Bakery cookie", captionEn: "Bakery cookie", captionPa: "ਬੇਕਰੀ ਬਿਸਕੁਟ" }
    ],
    questions: [
      {
        q: "Where will the child go tomorrow?",
        options: [
          {en: "To my aunt's house", pa: "ਮੇਰੀ ਮਾਸੀ ਦੇ ਘਰ"},
          {en: "To the zoo", pa: "ਚਿੜੀਆਘਰ ਨੂੰ"},
          {en: "To school", pa: "ਸਕੂਲ ਨੂੰ"},
          {en: "To the playground", pa: "ਮੈਦਾਨ ਨੂੰ"}
        ],
        explanation: {
          en: "The passage says Tomorrow I will visit my aunt.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਕੱਲ੍ਹ ਮੈਂ ਆਪਣੀ ਮਾਸੀ ਨੂੰ ਮਿਲਣ ਜਾਵਾਂਗਾ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R6",
    bundleId: 1,
    orderInBundle: 6,
    titleEn: "Colors and Things",
    titlePa: "ਰੰਗ ਅਤੇ ਚੀਜ਼ਾਂ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "In my room I have many things. I see a big blue pillow on my bed. I also have a small red ball. My pencil is yellow, and my notebook is green. Yesterday I drew a picture with my crayons. I drew a red car and a blue sky. My mom smiled when she saw it. Today I clean my desk. I put my books in a neat stack. I find a purple sticker under a paper. I like colors because they make my room bright. When I finish cleaning, my room looks nice and calm.",
    punjabi: "ਮੇਰੇ ਕਮਰੇ ਵਿੱਚ ਬਹੁਤ ਸਾਰੀਆਂ ਚੀਜ਼ਾਂ ਹਨ। ਮੈਂ ਆਪਣੇ ਬਿਸਤਰ ਤੇ ਇੱਕ ਵੱਡਾ ਨੀਲਾ ਤਕੀਆ ਵੇਖਦਾ ਹਾਂ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਛੋਟੀ ਲਾਲ ਗੇਂਦ ਵੀ ਹੈ। ਮੇਰੀ ਪੈਂਸਲ ਪੀਲੀ ਹੈ, ਅਤੇ ਮੇਰੀ ਕਾਪੀ ਹਰੀ ਹੈ। ਕੱਲ੍ਹ ਮੈਂ ਆਪਣੇ ਰੰਗਾਂ ਨਾਲ ਇੱਕ ਚਿੱਤਰ ਬਣਾਇਆ ਸੀ। ਮੈਂ ਇੱਕ ਲਾਲ ਕਾਰ ਅਤੇ ਇੱਕ ਨੀਲਾ ਆਕਾਸ਼ ਬਣਾਇਆ ਸੀ। ਮਾਂ ਨੇ ਵੇਖ ਕੇ ਮੁਸਕਰਾਇਆ। ਅੱਜ ਮੈਂ ਆਪਣਾ ਮੇਜ਼ ਸਾਫ਼ ਕਰਦਾ ਹਾਂ। ਮੈਂ ਆਪਣੀਆਂ ਕਿਤਾਬਾਂ ਠੀਕ ਤਰ੍ਹਾਂ ਢੇਰੀ ਬਣਾਕੇ ਰੱਖਦਾ ਹਾਂ। ਮੈਂ ਇੱਕ ਜਾਮਣੀ ਸਟਿਕਰ ਕਾਗਜ਼ ਹੇਠ ਲੱਭਦਾ ਹਾਂ। ਮੈਨੂੰ ਰੰਗ ਪਸੰਦ ਹਨ ਕਿਉਂਕਿ ਉਹ ਮੇਰੇ ਕਮਰੇ ਨੂੰ ਚਮਕਦਾਰ ਬਣਾਉਂਦੇ ਹਨ। ਜਦੋਂ ਮੈਂ ਸਾਫ਼ ਕਰਨਾ ਮੁਕਾ ਲੈਂਦਾ ਹਾਂ, ਮੇਰਾ ਕਮਰਾ ਚੰਗਾ ਅਤੇ ਸ਼ਾਂਤ ਲੱਗਦਾ ਹੈ।",
    images: [
      { src: "img/readings/R6/1.png", alt: "Blue pillow", captionEn: "Blue pillow", captionPa: "ਨੀਲਾ ਤਕੀਆ" },
      { src: "img/readings/R6/2.png", alt: "Red ball", captionEn: "Red ball", captionPa: "ਲਾਲ ਗੇਂਦ" },
      { src: "img/readings/R6/3.png", alt: "Yellow pencil, green notebook", captionEn: "Yellow pencil, green notebook", captionPa: "ਪੀਲੀ ਪੈਂਸਲ, ਹਰੀ ਕਾਪੀ" },
      { src: "img/readings/R6/4.png", alt: "Crayon drawing", captionEn: "Crayon drawing", captionPa: "ਰੰਗਾਂ ਨਾਲ ਚਿੱਤਰ" }
    ],
    questions: [
      {
        q: "What color is the pillow on the bed?",
        options: [
          {en: "Blue", pa: "ਨੀਲਾ"},
          {en: "Red", pa: "ਲਾਲ"},
          {en: "Green", pa: "ਹਰਾ"},
          {en: "Yellow", pa: "ਪੀਲਾ"}
        ],
        explanation: {
          en: "The passage says I see a big blue pillow on my bed.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਮੈਂ ਆਪਣੇ ਬਿਸਤਰ ਤੇ ਇੱਕ ਵੱਡਾ ਨੀਲਾ ਤਕੀਆ ਵੇਖਦਾ ਹਾਂ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R7",
    bundleId: 1,
    orderInBundle: 7,
    titleEn: "Where Is It?",
    titlePa: "ਇਹ ਕਿੱਥੇ ਹੈ?",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "I am looking for my shoe. I check under the bed. I check in the closet. I check on the shelf. I ask my sister, \"Do you see my shoe?\" My sister says, \"Look on the floor behind the door.\" I go behind the door and find my shoe! My mother says I should always put my things in the same place. Today I put both shoes in the box near the door. Tomorrow I will remember where my shoes are.",
    punjabi: "ਮੈਂ ਆਪਣਾ ਜੁੱਤਾ ਲੱਭ ਰਿਹਾ ਹਾਂ। ਮੈਂ ਬਿਸਤਰ ਹੇਠ ਵੇਖਦਾ ਹਾਂ। ਮੈਂ ਅਲਮਾਰੀ ਵਿੱਚ ਵੇਖਦਾ ਹਾਂ। ਮੈਂ ਸ਼ੈਲਫ ਤੇ ਵੇਖਦਾ ਹਾਂ। ਮੈਂ ਆਪਣੀ ਭੈਣ ਨੂੰ ਪੁੱਛਦਾ ਹਾਂ, \"ਕੀ ਤੁਸੀਂ ਮਾਡਾ ਜੁੱਤਾ ਵੇਖਦੇ ਹੋ?\" ਮੇਰੀ ਭੈਣ ਕਹਿੰਦੀ ਹੈ, \"ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ ਫਰਸ਼ ਤੇ ਵੇਖੋ।\" ਮੈਂ ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ ਜਾਂਦਾ ਹਾਂ ਅਤੇ ਆਪਣਾ ਜੁੱਤਾ ਲੱਭਦਾ ਹਾਂ! ਮਾਂ ਕਹਿੰਦੀ ਹੈ ਮੈਨੂੰ ਆਪਣੀਆਂ ਚੀਜ਼ਾਂ ਹਮੇਸ਼ਾ ਇੱਕੋ ਜਗ੍ਹਾ ਰੱਖਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ। ਅੱਜ ਮੈਂ ਦੋਵੇਂ ਜੁੱਤੇ ਦਰਵਾਜ਼ੇ ਦੇ ਨੇੜੇ ਬਕਸੇ ਵਿੱਚ ਰੱਖਦਾ ਹਾਂ। ਕੱਲ੍ਹ ਮੈਂ ਯਾਦ ਰੱਖਾਂਗਾ ਕਿ ਮੇਰੇ ਜੁੱਤੇ ਕਿੱਥੇ ਹਨ।",
    images: [
      { src: "img/readings/R7/1.png", alt: "Looking under bed", captionEn: "Looking under bed", captionPa: "ਬਿਸਤਰ ਹੇਠ ਵੇਖਣਾ" },
      { src: "img/readings/R7/2.png", alt: "Checking closet", captionEn: "Checking closet", captionPa: "ਅਲਮਾਰੀ ਵਿੱਚ ਵੇਖਣਾ" },
      { src: "img/readings/R7/3.png", alt: "Behind the door", captionEn: "Behind the door", captionPa: "ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ" },
      { src: "img/readings/R7/4.png", alt: "Shoes in box", captionEn: "Shoes in box", captionPa: "ਬਕਸੇ ਵਿੱਚ ਜੁੱਤੇ" }
    ],
    questions: [
      {
        q: "Where does the child find the shoe?",
        options: [
          {en: "Behind the door", pa: "ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ"},
          {en: "Under the bed", pa: "ਬਿਸਤਰ ਹੇਠ"},
          {en: "In the closet", pa: "ਅਲਮਾਰੀ ਵਿੱਚ"},
          {en: "On the shelf", pa: "ਸ਼ੈਲਫ ਤੇ"}
        ],
        explanation: {
          en: "The passage says Look on the floor behind the door and the child finds the shoe.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਦਰਵਾਜ਼ੇ ਦੇ ਪਿੱਛੇ ਫਰਸ਼ ਤੇ ਵੇਖੋ ਅਤੇ ਬੱਚਾ ਜੁੱਤਾ ਲੱਭਦਾ ਹੈ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R8",
    bundleId: 1,
    orderInBundle: 8,
    titleEn: "My Friend and Me",
    titlePa: "ਮੇਰਾ ਦੋਸਤ ਅਤੇ ਮੈਂ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "My best friend's name is Sara. We meet at school every day. We sit together at lunch. We share our snacks. Sara has orange cookies, and I have apple slices. We like to trade. After lunch, we go to the playground. We run on the grass and play games. Sometimes we swing on the swings. One day Sara was sick, and she did not come to school. I felt sad. But my mother said, \"You can draw a picture for Sara.\" I drew a big sun and flowers. Sara was so happy when I showed her my picture. Now we are best friends forever.",
    punjabi: "ਮੇਰੇ ਸਭ ਤੋਂ ਚੰਗੇ ਦੋਸਤ ਦਾ ਨਾਮ ਸਾਰਾ ਹੈ। ਅਸੀਂ ਹਰ ਰੋਜ਼ ਸਕੂਲ ਵਿੱਚ ਮਿਲਦੇ ਹਾਂ। ਅਸੀਂ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੇ ਇਕੱਠੇ ਬੈਠਦੇ ਹਾਂ। ਅਸੀਂ ਆਪਣੇ ਨਾਸਤੇ ਸਾਂਝੇ ਕਰਦੇ ਹਾਂ। ਸਾਰਾ ਕੋਲ ਸੰਤਰੀ ਬਿਸਕੁਟ ਹਨ, ਅਤੇ ਮੇਰੇ ਕੋਲ ਸੇਬ ਦੇ ਟੁਕੜੇ ਹਨ। ਅਸੀਂ ਆਪਣੀ ਚੀਜ਼ਾਂ ਤਬਦੀਲ ਕਰਨਾ ਪਸੰਦ ਕਰਦੇ ਹਾਂ। ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੋਂ ਬਾਅਦ, ਅਸੀਂ ਖੇਲ ਦੇ ਮੈਦਾਨ ਵਿੱਚ ਜਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਘਾਹ ਤੇ ਦੌੜਦੇ ਹਾਂ ਅਤੇ ਖੇਡ ਖੇਡਦੇ ਹਾਂ। ਕਦੀ-ਕਦੀ ਅਸੀਂ ਝੂਲਿਆਂ ਤੇ ਝੂਲਦੇ ਹਾਂ। ਇੱਕ ਦਿਨ ਸਾਰਾ ਬਿਮਾਰ ਸੀ, ਅਤੇ ਉਹ ਸਕੂਲ ਨਹੀਂ ਆਈ। ਮੈਂ ਉਦਾਸ ਮਹਿਸੂਸ ਕੀਤਾ। ਪਰ ਮਾਂ ਨੇ ਕਿਹਾ, \"ਤੁਸੀਂ ਸਾਰਾ ਲਈ ਇੱਕ ਚਿੱਤਰ ਬਣਾ ਸਕਦੇ ਹੋ।\" ਮੈਂ ਇੱਕ ਵੱਡਾ ਸੂਰਜ ਅਤੇ ਫੁੱਲ ਬਣਾਏ। ਸਾਰਾ ਬਹੁਤ ਖੁਸ਼ ਸੀ ਜਦੋਂ ਮੈਂ ਉਨੂੰ ਆਪਣੀ ਤਸਵੀਰ ਵਿਖਾਈ। ਹੁਣ ਅਸੀਂ ਹਮੇਸ਼ਾ ਲਈ ਸਭ ਤੋਂ ਚੰਗੇ ਦੋਸਤ ਹਾਂ।",
    images: [
      { src: "img/readings/R8/1.png", alt: "Lunch together", captionEn: "Lunch together", captionPa: "ਇਕੱਠੇ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ" },
      { src: "img/readings/R8/2.png", alt: "Playground running", captionEn: "Playground running", captionPa: "ਖੇਡ ਮੈਦਾਨ ਵਿੱਚ ਦੌੜਣਾ" },
      { src: "img/readings/R8/3.png", alt: "Swinging", captionEn: "Swinging", captionPa: "ਝੂਲਣਾ" },
      { src: "img/readings/R8/4.png", alt: "Drawing for Sara", captionEn: "Drawing for Sara", captionPa: "ਸਾਰਾ ਲਈ ਚਿੱਤਰ" }
    ],
    questions: [
      {
        q: "What did the child draw for Sara?",
        options: [
          {en: "A sun and flowers", pa: "ਸੂਰਜ ਅਤੇ ਫੁੱਲ"},
          {en: "A car", pa: "ਗੱਡੀ"},
          {en: "A house", pa: "ਘਰ"},
          {en: "A tree", pa: "ਰੁੱਖ"}
        ],
        explanation: {
          en: "The passage says I drew a big sun and flowers.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਮੈਂ ਇੱਕ ਵੱਡਾ ਸੂਰਜ ਅਤੇ ਫੁੱਲ ਬਣਾਏ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R9",
    bundleId: 1,
    orderInBundle: 9,
    titleEn: "My Birthday",
    titlePa: "ਮੇਰਾ ਜਨਮਦਿਨ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "Tomorrow is my birthday. I wake up early because I am excited. My mother bakes a cake with chocolate frosting. I help by mixing the batter. My father hangs colorful balloons in the living room. My little brother gives me a handmade card. It has a big heart drawn on it. At noon, my aunt and uncle arrive. They bring a small gift wrapped in blue paper. My friends come in the afternoon. We play musical chairs and laugh a lot. We also play a guessing game with animal sounds. When it is time to eat, everyone sings happy birthday to me. I make a wish and blow out the candles. The cake tastes sweet and soft. After cake, we open presents together. I feel thankful because my family and friends make my day special. In the evening, we clean up and sit together. I say, \"Thank you for the best birthday.\"",
    punjabi: "ਕੱਲ੍ਹ ਮੇਰਾ ਜਨਮਦਿਨ ਹੈ। ਮੈਂ ਜਲਦੀ ਉੱਠਦਾ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਉਤਸਾਹਿਤ ਹਾਂ। ਮੇਰੀ ਮਾਂ ਚਾਕਲੇਟ ਫਰਾਸਟਿੰਗ ਵਾਲਾ ਕੇਕ ਬਣਾਉਂਦੀ ਹੈ। ਮੈਂ ਘੋਲ ਹਿਲਾ ਕੇ ਮਦਦ ਕਰਦਾ ਹਾਂ। ਮੇਰੇ ਪਿਤਾ ਡਰਾਇੰਗ ਰੂਮ ਵਿੱਚ ਰੰਗਬਿਰੰਗੇ ਗੁਬਾਰੇ ਲਟਕਾਉਂਦੇ ਹਨ। ਮੇਰਾ ਛੋਟਾ ਭਰਾ ਮੈਨੂੰ ਹੱਥ ਨਾਲ ਬਣਾਇਆ ਕਾਰਡ ਦਿੰਦਾ ਹੈ। ਇਸ 'ਤੇ ਇੱਕ ਵੱਡਾ ਦਿਲ ਬਣਿਆ ਹੈ। ਦੁਪਹਿਰ ਨੂੰ ਮੇਰੀ ਮਾਸੀ ਤੇ ਮਾਮਾ ਆਉਂਦੇ ਹਨ। ਉਹ ਨੀਲੇ ਕਾਗਜ਼ ਵਿੱਚ ਲਪੇਟਿਆ ਛੋਟਾ ਤੋਹਫ਼ਾ ਲਿਆਉਂਦੇ ਹਨ। ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ ਮੇਰੇ ਦੋਸਤ ਆਉਂਦੇ ਹਨ। ਅਸੀਂ ਸੰਗੀਤ ਵਾਲੀਆਂ ਕੁਰਸੀਆਂ ਖੇਡਦੇ ਹਾਂ ਅਤੇ ਬਹੁਤ ਹੱਸਦੇ ਹਾਂ। ਅਸੀਂ ਜਾਨਵਰਾਂ ਦੀਆਂ ਆਵਾਜ਼ਾਂ ਵਾਲਾ ਅੰਦਾਜ਼ਾ ਖੇਡ ਵੀ ਖੇਡਦੇ ਹਾਂ। ਖਾਣਾ ਖਾਣ ਦਾ ਸਮਾਂ ਆਉਂਦਾ ਹੈ ਤਾਂ ਸਭ ਮੇਰੇ ਲਈ ਹੈਪੀ ਬਰਥਡੇ ਗਾਂਦੇ ਹਨ। ਮੈਂ ਇੱਕ ਇੱਛਾ ਮੰਗਦਾ ਹਾਂ ਅਤੇ ਮੋਮਬੱਤੀਆਂ ਬੁਝਾਉਂਦਾ ਹਾਂ। ਕੇਕ ਮਿੱਠਾ ਅਤੇ ਨਰਮ ਲੱਗਦਾ ਹੈ। ਕੇਕ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਇਕੱਠੇ ਤੋਹਫ਼ੇ ਖੋਲ੍ਹਦੇ ਹਾਂ। ਮੈਂ ਧੰਨਵਾਦੀ ਮਹਿਸੂਸ ਕਰਦਾ ਹਾਂ ਕਿਉਂਕਿ ਮੇਰਾ ਪਰਿਵਾਰ ਅਤੇ ਦੋਸਤ ਮੇਰਾ ਦਿਨ ਖਾਸ ਬਣਾਉਂਦੇ ਹਨ। ਸ਼ਾਮ ਨੂੰ ਅਸੀਂ ਸਾਫ਼ ਕਰਦੇ ਹਾਂ ਅਤੇ ਇਕੱਠੇ ਬੈਠਦੇ ਹਾਂ। ਮੈਂ ਕਹਿੰਦਾ ਹਾਂ, \"ਸਭ ਤੋਂ ਵਧੀਆ ਜਨਮਦਿਨ ਲਈ ਧੰਨਵਾਦ।\"",
    images: [
      { src: "img/readings/R9/1.png", alt: "Birthday cake", captionEn: "Birthday cake", captionPa: "ਜਨਮਦਿਨ ਦਾ ਕੇਕ" },
      { src: "img/readings/R9/2.png", alt: "Balloons and card", captionEn: "Balloons and card", captionPa: "ਗੁਬਾਰੇ ਅਤੇ ਕਾਰਡ" },
      { src: "img/readings/R9/3.png", alt: "Friends playing", captionEn: "Friends playing", captionPa: "ਦੋਸਤ ਖੇਡ ਰਹੇ" },
      { src: "img/readings/R9/4.png", alt: "Blowing candles", captionEn: "Blowing candles", captionPa: "ਮੋਮਬੱਤੀਆਂ ਬੁਝਾਉਣਾ" }
    ],
    questions: [
      {
        q: "What game do the friends play at the party?",
        options: [
          {en: "Musical chairs", pa: "ਸੰਗੀਤ ਵਾਲੀਆਂ ਕੁਰਸੀਆਂ"},
          {en: "Hide and seek", pa: "ਲੁਕਣ ਮੀਤੀ"},
          {en: "Tag", pa: "ਟੈਗ"},
          {en: "Marbles", pa: "ਗੁੱਲੀਆਂ"}
        ],
        explanation: {
          en: "The passage says we play musical chairs and laugh a lot.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਅਸੀਂ ਸੰਗੀਤ ਵਾਲੀਆਂ ਕੁਰਸੀਆਂ ਖੇਡਦੇ ਹਾਂ ਅਤੇ ਬਹੁਤ ਹੱਸਦੇ ਹਾਂ।"
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: "R10",
    bundleId: 1,
    orderInBundle: 10,
    titleEn: "At the Market",
    titlePa: "ਬਾਜ਼ਾਰ ਵਿੱਚ",
    levelHint: "Easy",
    primaryTrackId: "T_READING",
    english: "On Sunday I go to the market with my father. We carry two empty bags. The market is busy and colorful. First we visit the fruit stall. We see red apples, green grapes, and yellow bananas. I choose four apples and two bananas. Next we go to the vegetable stall. My father picks fresh tomatoes and cucumbers. The seller gives us some mint leaves for free. The smell is fresh. We also buy a small bag of rice. I see a toy car at another stall, but we decide to save money. Before leaving, we stop at the snack cart. My father buys roasted corn for both of us. We sit on a bench and eat the warm corn. It tastes salty and sweet. After we finish, we check our list and see we bought everything. We walk home with full bags. I feel happy helping my father at the market.",
    punjabi: "ਐਤਵਾਰ ਨੂੰ ਮੈਂ ਪਿਤਾ ਨਾਲ ਬਾਜ਼ਾਰ ਜਾਂਦਾ ਹਾਂ। ਅਸੀਂ ਦੋ ਖਾਲੀ ਬੈਗ ਲੈ ਕੇ ਜਾਂਦੇ ਹਾਂ। ਬਾਜ਼ਾਰ ਰੁੱਝਿਆ ਅਤੇ ਰੰਗਬਿਰੰਗਾ ਹੈ। ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਫਲਾਂ ਦੇ ਠੇਲੇ ਤੇ ਜਾਂਦੇ ਹਾਂ। ਅਸੀਂ ਲਾਲ ਸੇਬ, ਹਰੇ ਅੰਗੂਰ, ਅਤੇ ਪੀਲੇ ਕੇਲੇ ਵੇਖਦੇ ਹਾਂ। ਮੈਂ ਚਾਰ ਸੇਬ ਅਤੇ ਦੋ ਕੇਲੇ ਚੁਣਦਾ ਹਾਂ। ਫਿਰ ਅਸੀਂ ਸਬਜ਼ੀਆਂ ਦੇ ਠੇਲੇ ਤੇ ਜਾਂਦੇ ਹਾਂ। ਪਿਤਾ ਤਾਜ਼ੇ ਟਮਾਟਰ ਅਤੇ ਖੀਰੇ ਚੁਣਦੇ ਹਨ। ਵਿਕਰੇਤਾ ਸਾਨੂੰ ਕੁਝ ਪੁਦ੍ਹੀਨਾ ਪੱਤੇ ਮੁਫ਼ਤ ਦਿੰਦਾ ਹੈ। ਖੁਸ਼ਬੂ ਤਾਜ਼ਾ ਹੈ। ਅਸੀਂ ਇੱਕ ਛੋਟੀ ਥੈਲੀ ਚਾਵਲ ਵੀ ਲੈਂਦੇ ਹਾਂ। ਮੈਂ ਦੂਜੇ ਠੇਲੇ ਤੇ ਇੱਕ ਖਿਡੌਣਾ ਗੱਡੀ ਵੇਖਦਾ ਹਾਂ, ਪਰ ਅਸੀਂ ਪੈਸੇ ਬਚਾਉਣ ਦਾ ਫੈਸਲਾ ਕਰਦੇ ਹਾਂ। ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਅਸੀਂ ਨਾਸਤੇ ਵਾਲੇ ਗੱਡੇ ਤੇ ਰੁਕਦੇ ਹਾਂ। ਪਿਤਾ ਸਾਡੇ ਦੋਵਾਂ ਲਈ ਭੁੰਨੀ ਹੋਈ ਮੱਕੀ ਖਰੀਦਦੇ ਹਨ। ਅਸੀਂ ਬੈਂਚ ਤੇ ਬੈਠ ਕੇ ਗਰਮ ਮੱਕੀ ਖਾਂਦੇ ਹਾਂ। ਇਹ ਨਮਕੀਨ ਅਤੇ ਮਿੱਠੀ ਲੱਗਦੀ ਹੈ। ਖਤਮ ਕਰਨ ਤੋਂ ਬਾਅਦ ਅਸੀਂ ਆਪਣੀ ਸੂਚੀ ਵੇਖਦੇ ਹਾਂ ਅਤੇ ਸਮਝਦੇ ਹਾਂ ਕਿ ਅਸੀਂ ਸਭ ਕੁਝ ਖਰੀਦ ਲਿਆ ਹੈ। ਅਸੀਂ ਭਰੇ ਬੈਗ ਨਾਲ ਘਰ ਤੁਰਦੇ ਹਾਂ। ਮੈਂ ਖੁਸ਼ ਮਹਿਸੂਸ ਕਰਦਾ ਹਾਂ ਕਿਉਂਕਿ ਮੈਂ ਪਿਤਾ ਦੀ ਬਾਜ਼ਾਰ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹਾਂ।",
    images: [
      { src: "img/readings/R10/1.png", alt: "Fruit stall", captionEn: "Fruit stall", captionPa: "ਫਲਾਂ ਦਾ ਠੇਲਾ" },
      { src: "img/readings/R10/2.png", alt: "Vegetable stall", captionEn: "Vegetable stall", captionPa: "ਸਬਜ਼ੀਆਂ ਦਾ ਠੇਲਾ" },
      { src: "img/readings/R10/3.png", alt: "Rice bag", captionEn: "Rice bag", captionPa: "ਚਾਵਲ ਦੀ ਥੈਲੀ" },
      { src: "img/readings/R10/4.png", alt: "Roasted corn", captionEn: "Roasted corn", captionPa: "ਭੁੰਨੀ ਹੋਈ ਮੱਕੀ" }
    ],
    questions: [
      {
        q: "What snack do they eat at the market?",
        options: [
          {en: "Roasted corn", pa: "ਭੁੰਨੀ ਹੋਈ ਮੱਕੀ"},
          {en: "Ice cream", pa: "ਆਈਸਕ੍ਰੀਮ"},
          {en: "Cookies", pa: "ਬਿਸਕੁਟ"},
          {en: "Juice", pa: "ਜੂਸ"}
        ],
        explanation: {
          en: "The passage says my father buys roasted corn for both of us.",
          pa: "ਪੈਸੇਜ ਵਿੱਚ ਲਿਖਿਆ ਹੈ ਪਿਤਾ ਸਾਡੇ ਦੋਵਾਂ ਲਈ ਭੁੰਨੀ ਹੋਈ ਮੱਕੀ ਖਰੀਦਦੇ ਹਨ।"
        },
        correctIndex: 0
      }
    ]
  }
];
