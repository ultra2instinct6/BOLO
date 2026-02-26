const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'app', 'data', 'templates');

const ADDITIONS = {
  B1_S01: { word: 'house', meaningEn: 'a place where people live', meaningPa: 'ਘਰ' },
  B1_S02: { word: 'bag', meaningEn: 'a container to carry things', meaningPa: 'ਬੈਗ' },
  B1_S03: { word: 'milk', meaningEn: 'a white drink from animals like cows', meaningPa: 'ਦੁੱਧ' },
  B1_S04: { word: 'water', meaningEn: 'a clear liquid we drink and use for washing', meaningPa: 'ਪਾਣੀ' },
  B1_S05: { word: 'table', meaningEn: 'a piece of furniture with a flat top', meaningPa: 'ਮੇਜ਼' },
  B1_S06: { word: 'baby', meaningEn: 'a very young child', meaningPa: 'ਬੱਚਾ' },
  B1_S07: { word: 'spoon', meaningEn: 'a tool used for eating or stirring', meaningPa: 'ਚਮਚਾ' },
  B1_S08: { word: 'hat', meaningEn: 'something worn on the head', meaningPa: 'ਟੋਪੀ' },
  B1_S09: { word: 'rice', meaningEn: 'small white grains used as food', meaningPa: 'ਚਾਵਲ' },
  B1_S10: { word: 'room', meaningEn: 'a part of a house with walls', meaningPa: 'ਕਮਰਾ' },

  B2_S01: { word: 'smile', meaningEn: 'a happy expression on the face', meaningPa: 'ਮੁਸਕਾਨ' },
  B2_S02: { word: 'name', meaningEn: 'the word used to identify a person', meaningPa: 'ਨਾਮ' },
  B2_S03: { word: 'close', meaningEn: 'to shut something', meaningPa: 'ਬੰਦ ਕਰਨਾ' },
  B2_S04: { word: 'friend', meaningEn: 'a person you like and trust', meaningPa: 'ਦੋਸਤ' },
  B2_S05: { word: 'look', meaningEn: 'to use your eyes to see', meaningPa: 'ਵੇਖਣਾ' },
  B2_S06: { word: 'question', meaningEn: 'something you ask to get an answer', meaningPa: 'ਸਵਾਲ' },
  B2_S07: { word: 'circle', meaningEn: 'a round shape', meaningPa: 'ਗੋਲ' },
  B2_S08: { word: 'hand', meaningEn: 'the part at the end of your arm', meaningPa: 'ਹੱਥ' },
  B2_S09: { word: 'class', meaningEn: 'a group of students learning together', meaningPa: 'ਕਲਾਸ' },
  B2_S10: { word: 'goodbye', meaningEn: 'a word used when leaving', meaningPa: 'ਅਲਵਿਦਾ' },

  B3_S01: { word: 'street', meaningEn: 'a road in a town or city', meaningPa: 'ਗਲੀ' },
  B3_S02: { word: 'road', meaningEn: 'a path for cars and people to travel', meaningPa: 'ਸੜਕ' },
  B3_S03: { word: 'bank', meaningEn: 'a place where money is kept', meaningPa: 'ਬੈਂਕ' },
  B3_S04: { word: 'whisper', meaningEn: 'to speak very quietly', meaningPa: 'ਹੌਲੀ ਬੋਲਣਾ' },
  B3_S05: { word: 'tummy', meaningEn: 'a child word for stomach', meaningPa: 'ਪੇਟ' },
  B3_S06: { word: 'tools', meaningEn: 'things used to do work', meaningPa: 'ਸਾਜ਼ੋ-ਸਾਮਾਨ' },
  B3_S07: { word: 'tree', meaningEn: 'a tall plant with a trunk and branches', meaningPa: 'ਦਰੱਖਤ' },
  B3_S08: { word: 'breathe', meaningEn: 'to take air in and out of your body', meaningPa: 'ਸਾਹ ਲੈਣਾ' },
  B3_S09: { word: 'slide', meaningEn: 'playground equipment children slide on', meaningPa: 'ਸਲਾਈਡ' },
  B3_S10: { word: 'dance', meaningEn: 'to move your body to music', meaningPa: 'ਨੱਚਣਾ' }
};

const files = fs.readdirSync(templatesDir).filter((name) => /^book\d+_first10_stories\.template\.json$/.test(name));

let updates = 0;
const changedStories = [];

for (const name of files) {
  const filePath = path.join(templatesDir, name);
  const stories = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  for (const story of stories) {
    const storyId = story.storyId;
    const addition = ADDITIONS[storyId];
    if (!addition) continue;

    if (!Array.isArray(story.vocabularyWords)) {
      story.vocabularyWords = [];
    }

    const existing = new Set(story.vocabularyWords.map((item) => String(item.word || '').toLowerCase().trim()));
    if (!existing.has(addition.word.toLowerCase())) {
      story.vocabularyWords.push(addition);
      updates += 1;
      changed = true;
      changedStories.push(storyId);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(stories, null, 2)}\n`, 'utf8');
  }
}

console.log(JSON.stringify({ updates, changedStoriesCount: changedStories.length, changedStories }, null, 2));
