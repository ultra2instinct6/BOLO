#!/usr/bin/env node

/**
 * Node.js Validation Script for Learn QA Implementation
 * Validates code structure without requiring browser
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const results = [];
const appDir = __dirname;

function loadLessonDataGlobals() {
  const tracksPath = path.join(appDir, 'app/data/tracks.js');
  const lessonsDataPath = path.join(appDir, 'app/data/lessons.js');

  const tracksCode = fs.readFileSync(tracksPath, 'utf8');
  const lessonsCode = fs.readFileSync(lessonsDataPath, 'utf8');

  // Data files are plain JS that declare globals via `var ... = ...`.
  // Evaluate them in a sandbox so we can inspect real runtime objects.
  const silentConsole = {
    log: function () {},
    warn: function () {},
    error: function () {},
    info: function () {},
    debug: function () {}
  };

  const context = {
    console: silentConsole,
    window: {}
  };

  vm.runInNewContext(tracksCode, context, { filename: tracksPath });
  vm.runInNewContext(lessonsCode, context, { filename: lessonsDataPath });

  const lessonMeta = context.LESSON_META || context.window.LESSON_META || null;
  const lessons = context.LESSONS || context.window.LESSONS || null;

  return { lessonMeta, lessons };
}

console.log('\n' + '='.repeat(70));
console.log('🎓 LEARN QA IMPLEMENTATION VALIDATION');
console.log('='.repeat(70) + '\n');

// Test 1: Verify LearnQA exists in lessons.js
console.log('Test 1: Checking LearnQA helper object in lessons.js...');
const lessonsPath = path.join(appDir, 'app/js/lessons.js');
const lessonsContent = fs.readFileSync(lessonsPath, 'utf8');

const learnQAChecks = {
  'LearnQA object declaration': lessonsContent.includes('var LearnQA = {'),
  'enabled() method': lessonsContent.includes('enabled: function()'),
  'validateLesson() method': lessonsContent.includes('validateLesson: function('),
  'logLessonsPerTrack() method': lessonsContent.includes('logLessonsPerTrack: function()'),
  'logFilterState() method': lessonsContent.includes('logFilterState: function('),
  'logCardRendered() method': lessonsContent.includes('logCardRendered: function('),
  'logLessonLaunch() method': lessonsContent.includes('logLessonLaunch: function(')
};

let learnQAPass = true;
for (const check in learnQAChecks) {
  const passed = learnQAChecks[check];
  learnQAPass = learnQAPass && passed;
  console.log(`  ${passed ? '✅' : '❌'} ${check}`);
}

results.push({
  test: 'LearnQA helper object + all 7 methods',
  pass: learnQAPass,
  count: Object.values(learnQAChecks).filter(v => v).length + '/7'
});

// Test 2: Verify instrumentation hooks
console.log('\nTest 2: Checking 6 instrumentation hooks...');
const instrumentationChecks = {
  'Search filter logging (L1087)': lessonsContent.includes('if (LearnQA.enabled()) console.log("🎓 [Learn] Search filter changed to:'),
  'Status filter logging (L1105)': lessonsContent.includes('if (LearnQA.enabled()) console.log("🎓 [Learn] Status filter changed to:'),
  'Difficulty filter logging (L1128)': lessonsContent.includes('if (LearnQA.enabled()) console.log("🎓 [Learn] Difficulty filter changed to:'),
  'Track filter logging (L1139)': lessonsContent.includes('if (LearnQA.enabled()) console.log("🎓 [Learn] Track filter changed to:'),
  'renderLearnSections logging (L1189-1190)': lessonsContent.includes('LearnQA.logLessonsPerTrack();') && lessonsContent.includes('LearnQA.logFilterState(filtered);'),
  'startLesson logging (L1553)': lessonsContent.includes('LearnQA.logLessonLaunch(lessonId, meta.trackId);')
};

let instrumentationPass = true;
for (const check in instrumentationChecks) {
  const passed = instrumentationChecks[check];
  instrumentationPass = instrumentationPass && passed;
  console.log(`  ${passed ? '✅' : '❌'} ${check}`);
}

results.push({
  test: '6 instrumentation hooks',
  pass: instrumentationPass,
  count: Object.values(instrumentationChecks).filter(v => v).length + '/6'
});

// Test 3: Verify lesson data
console.log('\nTest 3: Checking lesson data files...');
const tracksPath = path.join(appDir, 'app/data/tracks.js');
const lessonsDataPath = path.join(appDir, 'app/data/lessons.js');

const tracksContent = fs.readFileSync(tracksPath, 'utf8');
const lessonsDataContent = fs.readFileSync(lessonsDataPath, 'utf8');

const dataChecks = {
  'LESSON_META array defined': tracksContent.includes('LESSON_META') && tracksContent.includes('var LESSON_META'),
  'L_NOUNS_COMMON_01 in lessons.js': lessonsDataContent.includes('L_NOUNS_COMMON_01'),
  'Tutorial lessons present (T01-T10)': (
    lessonsDataContent.includes('__RAW_LESSONS.T01') &&
    lessonsDataContent.includes('__RAW_LESSONS.T10')
  ),
  'Bilingual metadata (titleEn + titlePa)': lessonsDataContent.includes('titleEn:') && lessonsDataContent.includes('titlePa:'),
  'Steps array format': lessonsDataContent.includes('steps: [')
};

let dataPass = true;
for (const check in dataChecks) {
  const passed = dataChecks[check];
  dataPass = dataPass && passed;
  console.log(`  ${passed ? '✅' : '❌'} ${check}`);
}

results.push({
  test: 'Lesson data files',
  pass: dataPass,
  count: Object.values(dataChecks).filter(v => v).length + '/5'
});

// Test 4: Count LESSON_META entries
console.log('\nTest 4: Analyzing LESSON_META entry count...');
let lessonMetaCount = 0;
let lessonMetaPass = false;
try {
  const loaded = loadLessonDataGlobals();
  const lessonMeta = loaded.lessonMeta;
  const lessons = loaded.lessons;
  lessonMetaCount = Array.isArray(lessonMeta) ? lessonMeta.length : 0;

  // Keep this threshold modest; the repo's lesson inventory may grow/shrink.
  // The stronger check: every meta id should exist as a concrete lesson.
  const minimumExpected = 30;
  const missing = Array.isArray(lessonMeta) && lessons && typeof lessons === 'object'
    ? lessonMeta.filter(m => m && m.id && !lessons[m.id]).map(m => m.id)
    : [];

  lessonMetaPass = lessonMetaCount >= minimumExpected && missing.length === 0;

  console.log(`  ${lessonMetaPass ? '✅' : '❌'} LESSON_META has ${lessonMetaCount} lessons (expected ${minimumExpected}+), missing in LESSONS: ${missing.length}`);
} catch (e) {
  console.log(`  ❌ Failed to evaluate lesson data: ${e && e.message ? e.message : String(e)}`);
}
results.push({
  test: 'LESSON_META entry count',
  pass: lessonMetaPass,
  count: lessonMetaCount + ' lessons'
});

// Test 5: Verify LESSONS object entries
console.log('\nTest 5: Analyzing LESSONS object entries...');
let lessonsCount = 0;
let lessonsPass = false;
try {
  const loaded = loadLessonDataGlobals();
  const lessons = loaded.lessons;
  lessonsCount = lessons && typeof lessons === 'object' ? Object.keys(lessons).length : 0;
  lessonsPass = lessonsCount >= 40;
  console.log(`  ${lessonsPass ? '✅' : '❌'} LESSONS has ${lessonsCount} entries (expected 40+)`);
} catch (e) {
  console.log(`  ❌ Failed to evaluate LESSONS: ${e && e.message ? e.message : String(e)}`);
}
results.push({
  test: 'LESSONS object entries',
  pass: lessonsPass,
  count: lessonsCount + ' lessons'
});

// Test 6: Verify tracks
console.log('\nTest 6: Checking TRACKS definition...');
const tracksMatch = tracksContent.match(/var TRACKS = \{[\s\S]*?\};/);
const tracksKeys = tracksContent.match(/T_WORDS|T_ACTIONS|T_DESCRIBE|T_SENTENCE|T_READING/g);
const uniqueTracks = tracksKeys ? new Set(tracksKeys).size : 0;
const tracksPass = uniqueTracks === 5;

console.log(`  ${tracksPass ? '✅' : '❌'} All 5 tracks defined: T_WORDS, T_ACTIONS, T_DESCRIBE, T_SENTENCE, T_READING`);
results.push({
  test: 'TRACKS definition',
  pass: tracksPass,
  count: uniqueTracks + '/5 tracks'
});

// Test 7: Check documentation files exist
console.log('\nTest 7: Verifying documentation files...');
const docsPath = appDir;
const docChecks = {
  'LEARN_QA_QUICK_START.md': fs.existsSync(path.join(docsPath, 'LEARN_QA_QUICK_START.md')),
  'LEARN_QA_TEST_PLAN.md': fs.existsSync(path.join(docsPath, 'LEARN_QA_TEST_PLAN.md')),
  'LEARN_QA_IMPLEMENTATION_SUMMARY.md': fs.existsSync(path.join(docsPath, 'LEARN_QA_IMPLEMENTATION_SUMMARY.md'))
};

let docsPass = true;
for (const doc in docChecks) {
  const exists = docChecks[doc];
  docsPass = docsPass && exists;
  console.log(`  ${exists ? '✅' : '❌'} ${doc}`);
}

results.push({
  test: 'Documentation files',
  pass: docsPass,
  count: Object.values(docChecks).filter(v => v).length + '/3'
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(70));

const totalTests = results.length;
const passedTests = results.filter(r => r.pass).length;
const passRate = ((passedTests / totalTests) * 100).toFixed(1);

results.forEach(r => {
  console.log(`${r.pass ? '✅' : '❌'} ${r.test}: ${r.count}`);
});

console.log('\n' + '='.repeat(70));
console.log(`RESULTS: ${passedTests}/${totalTests} validation checks passed (${passRate}%)`);
console.log('='.repeat(70));

if (passedTests === totalTests) {
  console.log('\n✅ ALL VALIDATION CHECKS PASSED');
  console.log('Implementation is complete and ready for browser QA testing.\n');
  process.exit(0);
} else {
  console.log('\n❌ SOME CHECKS FAILED');
  console.log('Please review failed items above.\n');
  process.exit(1);
}
