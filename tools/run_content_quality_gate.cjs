#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'tools', 'reports');

function parseBooksArg(argv) {
  const arg = argv[2];
  if (!arg) {
    return null;
  }

  const parsed = String(arg)
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (parsed.length === 0) {
    return null;
  }

  return new Set(parsed);
}

function runCheck(label, scriptPath) {
  const startedAt = Date.now();
  const result = spawnSync('node', [scriptPath], {
    cwd: ROOT,
    encoding: 'utf8'
  });

  const finishedAt = Date.now();
  const status = result.status === 0 ? 'passed' : 'failed';

  return {
    label,
    scriptPath,
    status,
    exitCode: result.status,
    durationMs: finishedAt - startedAt,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function getBookNumber(story) {
  const fromId = String(story.id || '').match(/^book-(\d+)-/i);
  if (fromId) {
    return Number(fromId[1]);
  }

  const fromIdBundleStyle = String(story.id || '').match(/^B(\d+)_/i);
  if (fromIdBundleStyle) {
    return Number(fromIdBundleStyle[1]);
  }

  const fromBundle = String(story.bundleId || '').match(/^B(\d+)_/i);
  if (fromBundle) {
    return Number(fromBundle[1]);
  }

  return null;
}

function countMaterialType(materials, type) {
  if (!Array.isArray(materials)) {
    return 0;
  }
  return materials.filter((item) => item && item.type === type).length;
}

function summarizeStoryMinimums(bookFilter) {
  const readingsPath = path.join(ROOT, 'app', 'data', 'readings.js');
  const source = fs.readFileSync(readingsPath, 'utf8');
  const sandbox = { console, window: {}, globalThis: {} };
  vm.createContext(sandbox);
  vm.runInContext(
    `${source}\n;globalThis.__READINGS__ = (typeof READINGS !== "undefined" ? READINGS : ((window && window.READINGS) || globalThis.READINGS || []));`,
    sandbox
  );

  const readings = sandbox.globalThis.__READINGS__ || [];
  const stories = readings.filter((story) => {
    const id = String(story.id || '');
    if (!/^book-/i.test(id) && !/^B\d+_/i.test(id)) {
      return false;
    }

    if (!bookFilter) {
      return true;
    }

    const book = getBookNumber(story);
    return book !== null && bookFilter.has(book);
  });

  const failing = [];
  for (const story of stories) {
    const vocabFromArrays = Array.isArray(story.vocabularyWords) ? story.vocabularyWords.length : 0;
    const mcqFromArrays = Array.isArray(story.multipleChoiceQuestions) ? story.multipleChoiceQuestions.length : 0;
    const verbsFromArrays = Array.isArray(story.partsOfGrammar && story.partsOfGrammar.verbs)
      ? story.partsOfGrammar.verbs.length
      : 0;

    const vocabFromMaterials = countMaterialType(story.materials, 'vocab');
    const mcqFromMaterials = countMaterialType(story.materials, 'mcq');

    const vocab = vocabFromArrays > 0 ? vocabFromArrays : vocabFromMaterials;
    const mcq = mcqFromArrays > 0 ? mcqFromArrays : mcqFromMaterials;
    const verbs = verbsFromArrays;

    const ok = vocab >= 10 && mcq >= 5 && verbs >= 4;
    if (!ok) {
      failing.push({
        id: story.id,
        book: getBookNumber(story),
        vocab,
        mcq,
        verbs
      });
    }
  }

  return {
    totalStories: stories.length,
    failingCount: failing.length,
    firstFailingStoryIds: failing.slice(0, 5).map((item) => item.id),
    failing
  };
}

function timestampForFilename(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

function writeReport(report) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const timestamp = timestampForFilename(new Date());
  const reportPath = path.join(REPORTS_DIR, `content_quality_gate_${timestamp}.json`);
  const latestPath = path.join(REPORTS_DIR, 'content_quality_gate_latest.json');

  const content = JSON.stringify(report, null, 2) + '\n';
  fs.writeFileSync(reportPath, content, 'utf8');
  fs.writeFileSync(latestPath, content, 'utf8');

  return {
    reportPath,
    latestPath
  };
}

function printSummary(report, reportPaths) {
  const passChecks = report.checks.filter((check) => check.status === 'passed').length;
  const failChecks = report.checks.length - passChecks;

  console.log('=== Content Quality Gate ===');
  console.log(`Checks: ${passChecks} passed, ${failChecks} failed`);
  console.log(
    `Stories checked: ${report.storyMinimums.totalStories}, failing: ${report.storyMinimums.failingCount}`
  );

  if (report.storyMinimums.firstFailingStoryIds.length > 0) {
    console.log(`First failing story IDs: ${report.storyMinimums.firstFailingStoryIds.join(', ')}`);
  } else {
    console.log('First failing story IDs: none');
  }

  console.log(`Report: ${path.relative(ROOT, reportPaths.reportPath)}`);
  console.log(`Latest: ${path.relative(ROOT, reportPaths.latestPath)}`);

  if (!report.ok) {
    console.error('Quality gate failed. See report JSON for details.');
  }
}

function main() {
  const bookFilter = parseBooksArg(process.argv);

  const checks = [
    runCheck('Audit reading template fields', 'tools/audit_reading_templates_fields.cjs'),
    runCheck('Validate wrong option explanations', 'tools/validate_wrong_option_explanations.cjs'),
    runCheck('Run lessons quality suite', 'tools/run_lessons_quality_suite.cjs'),
    runCheck('Generate lesson rundown counts', 'tools/generate_lesson_rundown_counts.cjs')
  ];

  const storyMinimums = summarizeStoryMinimums(bookFilter);
  const checksFailed = checks.some((check) => check.status === 'failed');
  const storiesFailed = storyMinimums.failingCount > 0;

  const report = {
    createdAtIso: new Date().toISOString(),
    booksFilter: bookFilter ? Array.from(bookFilter.values()).sort((a, b) => a - b) : null,
    ok: !checksFailed && !storiesFailed,
    checks,
    storyMinimums
  };

  const reportPaths = writeReport(report);
  printSummary(report, reportPaths);

  process.exit(report.ok ? 0 : 1);
}

main();
