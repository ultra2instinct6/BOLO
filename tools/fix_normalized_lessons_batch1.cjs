/* eslint-disable no-var */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const tracksPath = path.join(root, 'app', 'data', 'tracks.js');
const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');

const VALID_TRACK_IDS = ['T_WORDS', 'T_ACTIONS', 'T_DESCRIBE', 'T_SENTENCE'];

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isCheckOnly = args.includes('--check');

function getFlagValue(flagName) {
  const flag = `${flagName}=`;
  const hit = args.find((entry) => entry.startsWith(flag));
  return hit ? hit.slice(flag.length) : '';
}

const reportPathArg = getFlagValue('--report');
const lessonsArg = getFlagValue('--lessons');
const targetLessonIds = lessonsArg
  ? new Set(lessonsArg.split(',').map((x) => x.trim()).filter(Boolean))
  : null;

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

function norm(text) {
  return String(text || '').trim().toLowerCase();
}

function getStepType(step) {
  if (!step || typeof step !== 'object') return '';
  return typeof step.type === 'string'
    ? step.type
    : (typeof step.step_type === 'string' ? step.step_type : '');
}

function isSummaryType(type) {
  return type === 'summary' || type === 'summary_bullets';
}

function optionToKey(option) {
  if (typeof option === 'string') return option;
  if (option && typeof option === 'object' && typeof option.en === 'string') return option.en;
  return '';
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function clampDifficulty(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1;
  if (value < 1) return 1;
  if (value > 3) return 3;
  return value;
}

function sumPoints(steps) {
  return steps.reduce((acc, step) => {
    const type = getStepType(step);
    if (!step || isSummaryType(type)) return acc;
    return acc + (typeof step.points === 'number' ? step.points : 0);
  }, 0);
}

function resolveCorrectIndex(step, optionKeys) {
  const byIndex = Number.isInteger(step.correctOptionIndex) ? step.correctOptionIndex : -1;
  if (byIndex >= 0 && byIndex < optionKeys.length) return byIndex;

  const answerRaw = step.correctAnswer || step.correct_answer;
  if (!isNonEmptyString(answerRaw)) return -1;

  const target = norm(answerRaw);
  const matches = [];
  for (let index = 0; index < optionKeys.length; index++) {
    if (norm(optionKeys[index]) === target) matches.push(index);
  }
  if (matches.length !== 1) return -1;
  return matches[0];
}

function buildMetaById(lessonMeta) {
  const out = {};
  for (const row of lessonMeta) {
    if (!row || typeof row.id !== 'string') continue;
    out[row.id] = row;
  }
  return out;
}

function ensureQuestionConsistency(step, lessonId, questionOrdinal, usedIds, stats) {
  if (!Array.isArray(step.options)) return;

  if (step.options.length < 2) {
    const base = optionToKey(step.options[0]) || 'Option 1';
    const second = base === 'Option 2' ? 'Option 1' : 'Option 2';
    if (typeof step.options[0] === 'object') {
      step.options = [
        step.options[0],
        { en: second, pa: second }
      ];
    } else {
      step.options = [base, second];
    }
    stats.questionOptionsPatched += 1;
  }

  const keys = step.options.map(optionToKey);
  if (keys.some((k) => !isNonEmptyString(k))) return;

  const resolved = resolveCorrectIndex(step, keys);
  if (resolved >= 0) {
    if (step.correctOptionIndex !== resolved) {
      step.correctOptionIndex = resolved;
      stats.correctnessPatched += 1;
    }
    const expectedAnswer = keys[resolved];
    if (!isNonEmptyString(step.correctAnswer) || norm(step.correctAnswer) !== norm(expectedAnswer)) {
      step.correctAnswer = expectedAnswer;
      stats.correctnessPatched += 1;
    }
  } else {
    step.correctOptionIndex = 0;
    step.correctAnswer = keys[0];
    stats.correctnessPatched += 1;
  }

  let baseId = isNonEmptyString(step.id) ? step.id.trim() : `q_${lessonId.toLowerCase()}_${questionOrdinal}`;
  if (!isNonEmptyString(step.id)) stats.questionIdsPatched += 1;

  if (usedIds.has(baseId)) {
    let suffix = 2;
    let nextId = `${baseId}_${suffix}`;
    while (usedIds.has(nextId)) {
      suffix += 1;
      nextId = `${baseId}_${suffix}`;
    }
    step.id = nextId;
    stats.questionIdsPatched += 1;
    usedIds.add(nextId);
  } else {
    step.id = baseId;
    usedIds.add(baseId);
  }
}

function ensureLessonMetadata(lessonId, lesson, metaById, stats) {
  if (!lesson.metadata || typeof lesson.metadata !== 'object') {
    lesson.metadata = {};
    stats.metadataPatched += 1;
  }

  const m = lesson.metadata;
  const meta = metaById[lessonId] || {};

  if (!isNonEmptyString(m.titleEn)) {
    m.titleEn = meta.labelEn || lessonId;
    stats.metadataPatched += 1;
  }
  if (!isNonEmptyString(m.titlePa)) {
    m.titlePa = meta.labelPa || m.titleEn;
    stats.metadataPatched += 1;
  }
  if (!isNonEmptyString(m.labelEn)) {
    m.labelEn = meta.labelEn || m.titleEn;
    stats.metadataPatched += 1;
  }
  if (!isNonEmptyString(m.labelPa)) {
    m.labelPa = meta.labelPa || m.titlePa;
    stats.metadataPatched += 1;
  }

  if (!isNonEmptyString(m.trackId) || !VALID_TRACK_IDS.includes(m.trackId)) {
    m.trackId = VALID_TRACK_IDS.includes(meta.trackId) ? meta.trackId : 'T_WORDS';
    stats.metadataPatched += 1;
  }

  const nextDifficulty = clampDifficulty(typeof m.difficulty === 'number' ? m.difficulty : (typeof meta.difficulty === 'number' ? meta.difficulty : 1));
  if (m.difficulty !== nextDifficulty) {
    m.difficulty = nextDifficulty;
    stats.metadataPatched += 1;
  }

  if (!m.objective || typeof m.objective !== 'object') {
    m.objective = {};
    stats.objectivePatched += 1;
  }

  const o = m.objective;
  if (!isNonEmptyString(o.titleEn)) {
    o.titleEn = m.labelEn;
    stats.objectivePatched += 1;
  }
  if (!isNonEmptyString(o.titlePa)) {
    o.titlePa = m.labelPa;
    stats.objectivePatched += 1;
  }
  if (!isNonEmptyString(o.descEn)) {
    o.descEn = m.titleEn;
    stats.objectivePatched += 1;
  }
  if (!isNonEmptyString(o.descPa)) {
    o.descPa = m.titlePa;
    stats.objectivePatched += 1;
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
  runFileIntoContext(tracksPath, context);
  runFileIntoContext(lessonsPath, context);

  const lessons = context.LESSONS && typeof context.LESSONS === 'object' ? context.LESSONS : null;
  const lessonMeta = Array.isArray(context.LESSON_META) ? context.LESSON_META : [];
  if (!lessons) {
    console.error('LESSONS not loaded as object');
    process.exit(1);
  }

  const stats = {
    lessonsVisited: 0,
    metadataPatched: 0,
    objectivePatched: 0,
    questionIdsPatched: 0,
    questionOptionsPatched: 0,
    correctnessPatched: 0,
    summaryPointsPatched: 0,
    pointsAvailablePatched: 0,
    lessonsTargeted: 0
  };

  const metaById = buildMetaById(lessonMeta);
  const lessonIds = Object.keys(lessons).filter((id) => id.startsWith('L_'));

  for (const lessonId of lessonIds) {
    if (targetLessonIds && !targetLessonIds.has(lessonId)) continue;
    const lesson = lessons[lessonId];
    if (!lesson || typeof lesson !== 'object') continue;

    stats.lessonsTargeted += 1;
    stats.lessonsVisited += 1;
    ensureLessonMetadata(lessonId, lesson, metaById, stats);

    if (!Array.isArray(lesson.steps)) continue;

    const usedIds = new Set();
    let questionOrdinal = 1;

    for (let stepIndex = 0; stepIndex < lesson.steps.length; stepIndex++) {
      const step = lesson.steps[stepIndex];
      if (!step || typeof step !== 'object') continue;

      const type = getStepType(step);
      if (isSummaryType(type) && step.points !== 0) {
        step.points = 0;
        stats.summaryPointsPatched += 1;
      }

      if (type === 'question') {
        ensureQuestionConsistency(step, lessonId, questionOrdinal, usedIds, stats);
        questionOrdinal += 1;
      }
    }

    const expectedPoints = sumPoints(lesson.steps);
    if (lesson.metadata.objective.pointsAvailable !== expectedPoints) {
      lesson.metadata.objective.pointsAvailable = expectedPoints;
      stats.pointsAvailablePatched += 1;
    }
  }

  const totalChanges =
    stats.metadataPatched +
    stats.objectivePatched +
    stats.questionIdsPatched +
    stats.questionOptionsPatched +
    stats.correctnessPatched +
    stats.summaryPointsPatched +
    stats.pointsAvailablePatched;

  const result = {
    ok: true,
    mode: isCheckOnly ? 'check' : (isDryRun ? 'dry-run' : 'apply'),
    stats,
    totalChanges,
    changed: totalChanges > 0
  };

  if (!isDryRun && !isCheckOnly && totalChanges > 0) {
    saveLessons(lessons);
  }

  if (reportPathArg) {
    const absoluteReportPath = path.isAbsolute(reportPathArg)
      ? reportPathArg
      : path.join(root, reportPathArg);
    fs.writeFileSync(absoluteReportPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    result.reportPath = absoluteReportPath;
  }

  console.log(JSON.stringify(result, null, 2));
  if (isCheckOnly && totalChanges > 0) {
    process.exit(1);
  }
}

main();
