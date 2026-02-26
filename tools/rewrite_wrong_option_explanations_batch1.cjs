/* eslint-disable no-var */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');

const TARGET_IDS = new Set([
  'q_l_pronouns_basics_01_error_correction_subject_pronoun',
  'q_l_pronouns_personal_01_subject_vs_object_called_me',
  'q_l_nouns_plurals_possession_01_plural_or_possessive_mix',
  'q_l_possessive_nouns_01_rewrite_of_phrase_students',
  'q_simple_past_irregular_go_went',
  'q_past_progressive_vs_simple_past_interrupt',
  'q_simple_present_negative_does_not',
  'q_future_complete_will_read',
  'q_future_pick_will_go',
  'q_future_form_will_bake',
  'q_future_not_yet_will_learn',
  'q_simple_future_will_vs_going_to',
  'q_modal_must_necessary',
  'q_modal_can_drive',
  'q_modal_could_polite',
  'q_modal_polite_request_could_you',
  'q_adj_complete_interesting',
  'q_adj_sentence_smart',
  'q_l_adj_vs_adv_01_he_speaks',
  'q_l_adj_vs_adv_01_a_fast_car',
  'q_comp_correct_faster',
  'q_comp_complete_redder',
  'q_l_preposition_basics_01_complete_the_cat_is_the_chair',
  'q_l_preposition_basics_01_which_preposition_shows_time',
  'q_l_preposition_basics_01_pick_the_sentence_with_a_preposi'
]);

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

function optionToKey(option) {
  if (typeof option === 'string') return option;
  if (option && typeof option === 'object' && typeof option.en === 'string') return option.en;
  return '';
}

function make(en, pa) {
  return { en, pa };
}

function explanationFor(questionId, wrongKey, correctKey) {
  switch (questionId) {
    case 'q_l_pronouns_basics_01_error_correction_subject_pronoun':
      if (wrongKey === 'Him plays football.') return make('"Him" is an object pronoun, but this position needs a subject pronoun. Use "He" before "plays".', '"Him" object pronoun ਹੈ, ਪਰ ਇਸ ਥਾਂ subject pronoun ਚਾਹੀਦਾ ਹੈ। "plays" ਤੋਂ ਪਹਿਲਾਂ "He" ਆਉਂਦਾ ਹੈ।');
      return make('With "He" (third-person singular), simple present verb should be "plays", not "play".', '"He" (third-person singular) ਨਾਲ simple present ਵਿੱਚ "plays" ਆਉਂਦਾ ਹੈ, "play" ਨਹੀਂ।');

    case 'q_l_pronouns_personal_01_subject_vs_object_called_me':
      if (wrongKey === 'I') return make('"I" is a subject pronoun. After "called", you need object form "me".', '"I" subject pronoun ਹੈ। "called" ਤੋਂ ਬਾਅਦ object ਰੂਪ "me" ਆਉਂਦਾ ਹੈ।');
      return make('"Mine" shows possession, not object case. This sentence needs object pronoun "me".', '"Mine" ਮਲਕੀਅਤ ਦਿਖਾਉਂਦਾ ਹੈ, object case ਨਹੀਂ। ਇਸ ਵਾਕ ਵਿੱਚ object pronoun "me" ਚਾਹੀਦਾ ਹੈ।');

    case 'q_l_nouns_plurals_possession_01_plural_or_possessive_mix':
      return make(`"${wrongKey}" is a possessive structure, but this question asks for a plain plural subject doing an action. "${correctKey}" fits that rule.`, `"${wrongKey}" possessive ਬਣਤਰ ਹੈ, ਪਰ ਇੱਥੇ action ਕਰਨ ਵਾਲਾ ਸਧਾਰਨ plural subject ਚਾਹੀਦਾ ਹੈ। "${correctKey}" ਇਹ ਨਿਯਮ ਪੂਰਾ ਕਰਦਾ ਹੈ।`);

    case 'q_l_possessive_nouns_01_rewrite_of_phrase_students':
      if (wrongKey === 'the students bag') return make('This misses the apostrophe. For plural possessive, use apostrophe after plural noun: "students\' bag".', 'ਇੱਥੇ apostrophe ਨਹੀਂ ਹੈ। plural possessive ਲਈ apostrophe plural noun ਤੋਂ ਬਾਅਦ ਲਗਦਾ ਹੈ: "students\' bag"।');
      return make('"student\'s" is singular possessive. The phrase here needs plural possessive "students\'".', '"student\'s" singular possessive ਹੈ। ਇੱਥੇ plural possessive "students\'" ਚਾਹੀਦਾ ਹੈ।');

    case 'q_simple_past_irregular_go_went':
      if (wrongKey === 'goed') return make('"Go" is irregular; its past tense is "went", not "goed".', '"Go" irregular verb ਹੈ; ਇਸ ਦਾ past tense "went" ਹੁੰਦਾ ਹੈ, "goed" ਨਹੀਂ।');
      return make('"Goes" is present tense. The question asks for past tense, so "went" is correct.', '"Goes" present tense ਹੈ। ਸਵਾਲ past tense ਦਾ ਹੈ, ਇਸ ਲਈ "went" ਸਹੀ ਹੈ।');

    case 'q_past_progressive_vs_simple_past_interrupt':
      if (wrongKey === 'I cooked when she arrived.') return make('This uses simple past, but the pattern here needs an ongoing past action interrupted by another action: "was cooking".', 'ਇੱਥੇ simple past ਹੈ, ਪਰ ਬਣਤਰ ongoing past + interruption ਦੀ ਹੈ: "was cooking"।');
      return make('This is missing the auxiliary "was". Past progressive requires "was/were + verb-ing".', 'ਇੱਥੇ auxiliary "was" ਗੁੰਮ ਹੈ। past progressive ਲਈ "was/were + verb-ing" ਲੋੜੀਂਦਾ ਹੈ।');

    case 'q_simple_present_negative_does_not':
      if (wrongKey === "She don't play cricket.") return make('With third-person singular "She", use "doesn\'t", not "don\'t".', 'third-person singular "She" ਨਾਲ "doesn\'t" ਆਉਂਦਾ ਹੈ, "don\'t" ਨਹੀਂ।');
      return make('Simple present negative needs auxiliary "does not" before base verb.', 'simple present negative ਵਿੱਚ base verb ਤੋਂ ਪਹਿਲਾਂ auxiliary "does not" ਚਾਹੀਦਾ ਹੈ।');

    case 'q_future_complete_will_read':
    case 'q_future_pick_will_go':
    case 'q_future_form_will_bake':
    case 'q_future_not_yet_will_learn':
      return make(`"${wrongKey}" is not the future form here. For this context, use "will + base verb": "${correctKey}".`, `"${wrongKey}" ਇੱਥੇ future ਰੂਪ ਨਹੀਂ ਹੈ। ਇਸ ਸੰਦਰਭ ਵਿੱਚ "will + base verb" ਚਾਹੀਦਾ ਹੈ: "${correctKey}"।`);

    case 'q_simple_future_will_vs_going_to':
      if (wrongKey === 'I goes to visit my aunt tomorrow.') return make('After "I", verb is "go" (not "goes"). Planned future here is best shown by "am going to visit".', '"I" ਨਾਲ verb "go" ਹੁੰਦਾ ਹੈ ("goes" ਨਹੀਂ)। planned future ਲਈ "am going to visit" ਸਹੀ ਹੈ।');
      return make('"Visited" is past tense, but "tomorrow" is future time. Use future plan form "am going to visit".', '"Visited" past tense ਹੈ, ਪਰ "tomorrow" future ਸਮਾਂ ਹੈ। future plan ਲਈ "am going to visit" ਵਰਤੋ।');

    case 'q_modal_must_necessary':
      if (wrongKey === 'can') return make('"Can" shows ability, not necessity. The modal for requirement is "must".', '"Can" ਸਮਰੱਥਾ ਦਿਖਾਉਂਦਾ ਹੈ, ਲਾਜ਼ਮੀਅਤ ਨਹੀਂ। requirement ਲਈ modal "must" ਹੈ।');
      return make('"Could" usually shows possibility/polite request. Necessity is expressed by "must".', '"Could" ਆਮ ਤੌਰ ਤੇ ਸੰਭਾਵਨਾ/ਨਮ੍ਰ ਬੇਨਤੀ ਦਿਖਾਉਂਦਾ ਹੈ। ਲਾਜ਼ਮੀਅਤ ਲਈ "must" ਵਰਤਦੇ ਹਨ।');

    case 'q_modal_can_drive':
      if (wrongKey === 'cans') return make('"Cans" is not the modal verb form here. Use modal "can" + base verb "drive".', '"Cans" ਇੱਥੇ modal verb ਰੂਪ ਨਹੀਂ ਹੈ। modal "can" + base verb "drive" ਵਰਤੋ।');
      return make('"Canning" is an -ing form, not a modal. The correct modal form is "can".', '"Canning" -ing ਰੂਪ ਹੈ, modal ਨਹੀਂ। ਸਹੀ modal ਰੂਪ "can" ਹੈ।');

    case 'q_modal_could_polite':
      if (wrongKey === 'can') return make('"Can" is less polite. For polite request style, "could" is preferred.', '"Can" ਘੱਟ ਨਮ੍ਰ ਹੈ। ਨਮ੍ਰ ਬੇਨਤੀ ਲਈ "could" ਵਧੀਆ ਹੈ।');
      return make('"Must" shows obligation, not polite requesting. "Could" is the polite choice.', '"Must" ਲਾਜ਼ਮੀਅਤ ਦਿਖਾਉਂਦਾ ਹੈ, ਨਮ੍ਰ ਬੇਨਤੀ ਨਹੀਂ। ਨਮ੍ਰ ਚੋਣ "could" ਹੈ।');

    case 'q_modal_polite_request_could_you':
      if (wrongKey === 'Can') return make('"Can you" works, but "Could you" is more polite in requests.', '"Can you" ਠੀਕ ਹੈ, ਪਰ ਬੇਨਤੀ ਵਿੱਚ "Could you" ਹੋਰ ਨਮ੍ਰ ਹੁੰਦਾ ਹੈ।');
      return make('"Must" sounds like force/obligation, not a polite request opener.', '"Must" ਜ਼ਬਰ/ਲਾਜ਼ਮੀਅਤ ਦਾ ਲਹਿਜ਼ਾ ਦਿੰਦਾ ਹੈ, ਨਮ੍ਰ ਬੇਨਤੀ ਦੀ ਸ਼ੁਰੂਆਤ ਨਹੀਂ।');

    case 'q_adj_complete_interesting':
      if (wrongKey === 'read') return make('"Read" is a verb, but the blank before "book" needs an adjective.', '"Read" ਕਿਰਿਆ ਹੈ, ਪਰ "book" ਤੋਂ ਪਹਿਲਾਂ adjective ਚਾਹੀਦਾ ਹੈ।');
      return make('"Quickly" is an adverb, not an adjective for a noun. "Interesting" describes "book" correctly.', '"Quickly" adverb ਹੈ, noun ਲਈ adjective ਨਹੀਂ। "Interesting" "book" ਦਾ ਸਹੀ ਵਰਣਨ ਕਰਦਾ ਹੈ।');

    case 'q_adj_sentence_smart':
      return make(`"${wrongKey}" has no adjective describing a person/thing. "${correctKey}" includes adjective "smart".`, `"${wrongKey}" ਵਿੱਚ ਕਿਸੇ ਵਿਅਕਤੀ/ਚੀਜ਼ ਦਾ adjective ਨਹੀਂ ਹੈ। "${correctKey}" ਵਿੱਚ adjective "smart" ਹੈ।`);

    case 'q_l_adj_vs_adv_01_he_speaks':
      if (wrongKey === 'polite') return make('After verb "speaks", we need an adverb of manner: "politely", not adjective "polite".', 'verb "speaks" ਤੋਂ ਬਾਅਦ manner adverb ਚਾਹੀਦਾ ਹੈ: "politely", adjective "polite" ਨਹੀਂ।');
      return make('"Politeness" is a noun, but this position needs adverb form "politely".', '"Politeness" noun ਹੈ, ਪਰ ਇੱਥੇ adverb ਰੂਪ "politely" ਚਾਹੀਦਾ ਹੈ।');

    case 'q_l_adj_vs_adv_01_a_fast_car':
      if (wrongKey === 'fastly') return make('Standard adjective here is "fast". "Fastly" is not the correct form in this context.', 'ਇੱਥੇ ਮਿਆਰੀ adjective "fast" ਹੈ। ਇਸ ਸੰਦਰਭ ਵਿੱਚ "fastly" ਸਹੀ ਰੂਪ ਨਹੀਂ ਹੈ।');
      return make('"Quickly" is adverb (for verbs), but here we modify noun "car", so adjective "fast" is needed.', '"Quickly" adverb ਹੈ (verbs ਲਈ), ਪਰ ਇੱਥੇ noun "car" ਦਾ ਵਰਣਨ ਕਰਨਾ ਹੈ, ਇਸ ਲਈ adjective "fast" ਚਾਹੀਦਾ ਹੈ।');

    case 'q_comp_correct_faster':
      return make(`For short adjective "fast", comparative form is "faster" (with -er). "${wrongKey}" is not the target comparative form.`, `ਛੋਟੇ adjective "fast" ਲਈ comparative ਰੂਪ "faster" (-er ਨਾਲ) ਹੁੰਦਾ ਹੈ। "${wrongKey}" ਇੱਥੇ ਸਹੀ comparative ਨਹੀਂ ਹੈ।`);

    case 'q_comp_complete_redder':
      return make(`The sentence needs comparative form of "red": "redder". "${wrongKey}" is not the required comparative form here.`, `ਵਾਕ ਵਿੱਚ "red" ਦਾ comparative ਰੂਪ "redder" ਚਾਹੀਦਾ ਹੈ। "${wrongKey}" ਇੱਥੇ ਲੋੜੀਂਦਾ comparative ਰੂਪ ਨਹੀਂ ਹੈ।`);

    case 'q_l_preposition_basics_01_complete_the_cat_is_the_chair':
      if (wrongKey === 'run') return make('"Run" is a verb, but this blank needs a preposition showing place relation.', '"Run" ਕਿਰਿਆ ਹੈ, ਪਰ ਇੱਥੇ ਥਾਂ-ਸਬੰਧ ਦਿਖਾਉਣ ਵਾਲਾ preposition ਚਾਹੀਦਾ ਹੈ।');
      return make('"Happy" is an adjective, not a preposition. The place relation here is shown by "in".', '"Happy" adjective ਹੈ, preposition ਨਹੀਂ। ਇੱਥੇ ਥਾਂ-ਸਬੰਧ "in" ਨਾਲ ਦਿਖਦਾ ਹੈ।');

    case 'q_l_preposition_basics_01_which_preposition_shows_time':
      if (wrongKey === 'in') return make('"In" is used for longer periods (month/year). Exact clock time usually takes "at".', '"In" ਲੰਮੇ ਸਮੇਂ (month/year) ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। exact clock time ਲਈ ਆਮ ਤੌਰ ਤੇ "at" ਲੱਗਦਾ ਹੈ।');
      return make('"Through" shows movement/continuation, not a specific time point. Use "at" for exact time.', '"Through" ਚਾਲ/ਜਾਰੀ ਰਹਿਣਾ ਦਿਖਾਉਂਦਾ ਹੈ, specific time point ਨਹੀਂ। exact time ਲਈ "at" ਵਰਤੋ।');

    case 'q_l_preposition_basics_01_pick_the_sentence_with_a_preposi':
      return make(`"${wrongKey}" has no preposition word. "${correctKey}" includes preposition "under".`, `"${wrongKey}" ਵਿੱਚ preposition ਸ਼ਬਦ ਨਹੀਂ ਹੈ। "${correctKey}" ਵਿੱਚ preposition "under" ਹੈ।`);

    default:
      return make(`"${wrongKey}" is not correct here. "${correctKey}" matches the grammar rule required in this question.`, `"${wrongKey}" ਇੱਥੇ ਸਹੀ ਨਹੀਂ ਹੈ। "${correctKey}" ਇਸ ਸਵਾਲ ਦੇ grammar ਨਿਯਮ ਨਾਲ ਮਿਲਦਾ ਹੈ।`);
  }
}

function saveLessons(lessons) {
  const original = fs.readFileSync(lessonsPath, 'utf8');
  const prefixMatch = original.match(/^([\s\S]*?var LESSONS = )/);
  const prefix = prefixMatch ? prefixMatch[1] : 'var LESSONS = ';
  const serialized = prefix + JSON.stringify(lessons, null, 2) + ';\n';
  fs.writeFileSync(lessonsPath, serialized, 'utf8');
}

function main() {
  const context = { console, window: {} };
  runFileIntoContext(lessonsPath, context);

  const lessons = context.LESSONS && typeof context.LESSONS === 'object' ? context.LESSONS : null;
  if (!lessons) {
    console.error('LESSONS not loaded as object');
    process.exit(1);
  }

  const found = new Set();
  let updatedQuestions = 0;
  let updatedEntries = 0;

  for (const lessonId of Object.keys(lessons)) {
    if (!lessonId.startsWith('L_')) continue;
    const steps = Array.isArray(lessons[lessonId] && lessons[lessonId].steps) ? lessons[lessonId].steps : [];
    for (const step of steps) {
      if (!step || (step.type || step.step_type) !== 'question') continue;
      if (!TARGET_IDS.has(step.id)) continue;

      found.add(step.id);
      const options = Array.isArray(step.options) ? step.options : [];
      if (!step.wrongOptionExplanations || typeof step.wrongOptionExplanations !== 'object') {
        step.wrongOptionExplanations = {};
      }

      const correctIndex = Number.isInteger(step.correctOptionIndex) ? step.correctOptionIndex : -1;
      const correctKey = correctIndex >= 0 && correctIndex < options.length
        ? optionToKey(options[correctIndex])
        : String(step.correctAnswer || step.correct_answer || '');

      let touched = false;
      for (let index = 0; index < options.length; index++) {
        if (index === correctIndex) continue;
        const wrongKey = optionToKey(options[index]);
        if (!wrongKey) continue;
        step.wrongOptionExplanations[wrongKey] = explanationFor(step.id, wrongKey, correctKey);
        updatedEntries += 1;
        touched = true;
      }
      if (touched) updatedQuestions += 1;
    }
  }

  const missing = [...TARGET_IDS].filter((qid) => !found.has(qid));
  if (missing.length > 0) {
    console.error('Missing question IDs:', JSON.stringify(missing, null, 2));
    process.exit(1);
  }

  saveLessons(lessons);
  console.log(JSON.stringify({ ok: true, updatedQuestions, updatedEntries }, null, 2));
}

main();
