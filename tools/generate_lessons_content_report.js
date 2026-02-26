/* eslint-disable no-var */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runFileIntoContext(filePath, context) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
}

function isNonEmptyObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function classifyOptionFormat(options) {
  if (!Array.isArray(options)) return 'mixedOther';
  if (options.length === 0) return 'mixedOther';

  const allStrings = options.every((option) => typeof option === 'string');
  if (allStrings) return 'stringArray';

  const allBilingualObjects = options.every(
    (option) => isNonEmptyObject(option) && typeof option.en === 'string' && typeof option.pa === 'string'
  );
  if (allBilingualObjects) return 'bilingualObjectArray';

  return 'mixedOther';
}

function normalizeOptionText(option) {
  if (typeof option === 'string') return option.trim().toLowerCase();
  if (isNonEmptyObject(option) && typeof option.en === 'string') return option.en.trim().toLowerCase();
  if (isNonEmptyObject(option) && typeof option.pa === 'string') return option.pa.trim().toLowerCase();
  return '';
}

function isYesNoQuestion(step) {
  if (!step || !Array.isArray(step.options) || step.options.length !== 2) return false;

  const values = new Set(step.options.map(normalizeOptionText));
  const hasYes = values.has('yes') || values.has('ਹਾਂ');
  const hasNo = values.has('no') || values.has('ਨਹੀਂ');
  return hasYes && hasNo;
}

function getStepTypeBucket(type) {
  switch (type) {
    case 'objective':
      return 'objective';
    case 'definition':
      return 'definition';
    case 'example':
      return 'example';
    case 'question':
      return 'question';
    case 'summary':
    case 'summary_bullets':
      return 'summary';
    default:
      return 'unknown';
  }
}

function emptyMetrics() {
  return {
    totalSteps: 0,
    stepTypeCounts: {
      objective: 0,
      definition: 0,
      example: 0,
      question: 0,
      summary: 0,
      unknown: 0
    },
    unknownStepTypes: {},
    questionSummary: {
      totalQuestions: 0,
      optionFormats: {
        stringArray: 0,
        bilingualObjectArray: 0,
        mixedOther: 0
      },
      yesNoCount: 0,
      presenceCounts: {
        hint: 0,
        explanation: 0,
        workedExample: 0,
        examples: 0,
        wrongOptionExplanations: 0
      }
    }
  };
}

function addUnknownType(counter, rawType) {
  const key = typeof rawType === 'string' && rawType.trim() ? rawType.trim() : '(missing type)';
  counter[key] = (counter[key] || 0) + 1;
}

function collectLessonMetrics(steps) {
  const metrics = emptyMetrics();
  const safeSteps = Array.isArray(steps) ? steps : [];

  for (const step of safeSteps) {
    metrics.totalSteps += 1;

    const rawType = step && typeof step.type === 'string'
      ? step.type
      : (step && typeof step.step_type === 'string' ? step.step_type : '');
    const bucket = getStepTypeBucket(rawType);
    metrics.stepTypeCounts[bucket] += 1;
    if (bucket === 'unknown') addUnknownType(metrics.unknownStepTypes, rawType);

    if (bucket !== 'question') continue;

    metrics.questionSummary.totalQuestions += 1;

    const format = classifyOptionFormat(step.options);
    metrics.questionSummary.optionFormats[format] += 1;

    if (isYesNoQuestion(step)) metrics.questionSummary.yesNoCount += 1;
    if (isNonEmptyObject(step.hint)) metrics.questionSummary.presenceCounts.hint += 1;
    if (isNonEmptyObject(step.explanation)) metrics.questionSummary.presenceCounts.explanation += 1;
    if (isNonEmptyObject(step.workedExample)) metrics.questionSummary.presenceCounts.workedExample += 1;
    if (isNonEmptyArray(step.examples)) metrics.questionSummary.presenceCounts.examples += 1;
    if (isNonEmptyObject(step.wrongOptionExplanations)) {
      metrics.questionSummary.presenceCounts.wrongOptionExplanations += 1;
    }
  }

  return metrics;
}

function mergeMetrics(target, source) {
  target.totalSteps += source.totalSteps;

  for (const key of Object.keys(target.stepTypeCounts)) {
    target.stepTypeCounts[key] += source.stepTypeCounts[key];
  }

  for (const [rawType, count] of Object.entries(source.unknownStepTypes)) {
    target.unknownStepTypes[rawType] = (target.unknownStepTypes[rawType] || 0) + count;
  }

  target.questionSummary.totalQuestions += source.questionSummary.totalQuestions;

  for (const key of Object.keys(target.questionSummary.optionFormats)) {
    target.questionSummary.optionFormats[key] += source.questionSummary.optionFormats[key];
  }

  target.questionSummary.yesNoCount += source.questionSummary.yesNoCount;

  for (const key of Object.keys(target.questionSummary.presenceCounts)) {
    target.questionSummary.presenceCounts[key] += source.questionSummary.presenceCounts[key];
  }
}

function getDominantStepType(stepTypeCounts) {
  const priority = ['objective', 'definition', 'example', 'question', 'summary', 'unknown'];
  let dominantType = 'unknown';
  let dominantCount = -1;

  for (const type of priority) {
    const count = stepTypeCounts[type] || 0;
    if (count > dominantCount) {
      dominantType = type;
      dominantCount = count;
    }
  }

  return dominantType;
}

function humanStepTypeLabel(type) {
  switch (type) {
    case 'objective':
      return 'Objective';
    case 'definition':
      return 'Definition';
    case 'example':
      return 'Example';
    case 'question':
      return 'Question';
    case 'summary':
      return 'Summary';
    case 'unknown':
      return 'Unknown';
    default:
      return type;
  }
}

function contentTypesPresentLabelList(stepTypeCounts, unknownStepTypes) {
  const ordered = ['objective', 'definition', 'example', 'question', 'summary', 'unknown'];
  const labels = [];

  for (const type of ordered) {
    if ((stepTypeCounts[type] || 0) > 0) {
      if (type !== 'unknown') {
        labels.push(humanStepTypeLabel(type));
      } else {
        const unknownKeys = Object.keys(unknownStepTypes).sort();
        if (unknownKeys.length > 0) {
          labels.push(`Unknown (${unknownKeys.join(', ')})`);
        } else {
          labels.push('Unknown');
        }
      }
    }
  }

  return labels;
}

function formatList(values) {
  return values.length > 0 ? values.join(', ') : 'None';
}

function main() {
  const root = path.resolve(__dirname, '..');
  const tracksPath = path.join(root, 'app', 'data', 'tracks.js');
  const lessonsPath = path.join(root, 'app', 'data', 'lessons.js');
  const outputPath = path.join(root, 'LESSONS_CONTENT_TYPE_REPORT.md');

  const context = { console, window: {} };
  runFileIntoContext(tracksPath, context);
  runFileIntoContext(lessonsPath, context);

  const lessonMeta = Array.isArray(context.LESSON_META) ? context.LESSON_META.slice() : [];
  const lessons = context.LESSONS && typeof context.LESSONS === 'object' ? context.LESSONS : null;

  if (!lessons) {
    throw new Error('LESSONS not defined as object after loading app/data/lessons.js');
  }

  const metaSorted = lessonMeta
    .map((item) => ({
      id: item && item.id,
      order: item && typeof item.order === 'number' ? item.order : Number.MAX_SAFE_INTEGER
    }))
    .filter((item) => typeof item.id === 'string' && item.id.startsWith('L_'))
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.id.localeCompare(b.id);
    });

  const metaIds = metaSorted.map((item) => item.id);
  const metaIdSet = new Set(metaIds);

  const extraLessonIds = Object.keys(lessons)
    .filter((id) => id.startsWith('L_') && !metaIdSet.has(id))
    .sort((a, b) => a.localeCompare(b));

  const orderedIds = metaIds.concat(extraLessonIds);

  const metaById = {};
  for (const item of lessonMeta) {
    if (item && typeof item.id === 'string') {
      metaById[item.id] = item;
    }
  }

  const aggregate = emptyMetrics();
  const perLessonRows = [];
  const lines = [];

  lines.push('# Lessons Content Type Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Total lessons in report: ${orderedIds.length}`);
  lines.push('');

  for (let index = 0; index < orderedIds.length; index += 1) {
    const id = orderedIds[index];
    const lesson = lessons[id];
    const metadata = (lesson && lesson.metadata) || {};
    const meta = metaById[id] || {};

    const titleOrLabel =
      metadata.titleEn ||
      metadata.labelEn ||
      meta.labelEn ||
      metadata.titlePa ||
      metadata.labelPa ||
      meta.labelPa ||
      'N/A';

    const trackId = metadata.trackId || meta.trackId || 'N/A';
    const difficulty =
      typeof metadata.difficulty === 'number'
        ? metadata.difficulty
        : typeof meta.difficulty === 'number'
          ? meta.difficulty
          : 'N/A';

    const steps = lesson && Array.isArray(lesson.steps) ? lesson.steps : [];
    const metrics = collectLessonMetrics(steps);
    mergeMetrics(aggregate, metrics);

    const dominantStepType = getDominantStepType(metrics.stepTypeCounts);

    perLessonRows.push({
      id,
      totalSteps: metrics.totalSteps,
      questionCount: metrics.questionSummary.totalQuestions,
      dominantStepType
    });

    lines.push(`## ${index + 1}. ${id}`);
    lines.push('');
    lines.push(`- Lesson order: ${index + 1}`);
    lines.push(`- ID: ${id}`);
    lines.push(`- Title/Label: ${titleOrLabel}`);
    lines.push(`- Track ID: ${trackId}`);
    lines.push(`- Difficulty: ${difficulty}`);
    lines.push(`- Total steps: ${metrics.totalSteps}`);
    lines.push('');
    lines.push('- Step type counts:');
    lines.push(`  - Objective: ${metrics.stepTypeCounts.objective}`);
    lines.push(`  - Definition: ${metrics.stepTypeCounts.definition}`);
    lines.push(`  - Example: ${metrics.stepTypeCounts.example}`);
    lines.push(`  - Question: ${metrics.stepTypeCounts.question}`);
    lines.push(`  - Summary: ${metrics.stepTypeCounts.summary}`);
    lines.push(`  - Unknown: ${metrics.stepTypeCounts.unknown}`);

    if (metrics.stepTypeCounts.unknown > 0) {
      const unknownParts = Object.keys(metrics.unknownStepTypes)
        .sort()
        .map((key) => `${key}: ${metrics.unknownStepTypes[key]}`);
      lines.push(`  - Unknown raw types: ${unknownParts.join(', ')}`);
    }

    lines.push(
      `- Content types present: ${formatList(
        contentTypesPresentLabelList(metrics.stepTypeCounts, metrics.unknownStepTypes)
      )}`
    );
    lines.push('');
    lines.push('- Question-level summary:');
    lines.push(`  - Total questions: ${metrics.questionSummary.totalQuestions}`);
    lines.push(`  - Option format string[]: ${metrics.questionSummary.optionFormats.stringArray}`);
    lines.push(
      `  - Option format bilingual object[]: ${metrics.questionSummary.optionFormats.bilingualObjectArray}`
    );
    lines.push(`  - Option format mixed/other: ${metrics.questionSummary.optionFormats.mixedOther}`);
    lines.push(`  - Yes/No question count: ${metrics.questionSummary.yesNoCount}`);
    lines.push(`  - Questions with hint: ${metrics.questionSummary.presenceCounts.hint}`);
    lines.push(`  - Questions with explanation: ${metrics.questionSummary.presenceCounts.explanation}`);
    lines.push(
      `  - Questions with workedExample: ${metrics.questionSummary.presenceCounts.workedExample}`
    );
    lines.push(`  - Questions with examples: ${metrics.questionSummary.presenceCounts.examples}`);
    lines.push(
      `  - Questions with wrongOptionExplanations: ${metrics.questionSummary.presenceCounts.wrongOptionExplanations}`
    );
    lines.push('');
  }

  lines.push('## Global Aggregate Summary');
  lines.push('');
  lines.push(`- Total lessons: ${orderedIds.length}`);
  lines.push(`- Total steps: ${aggregate.totalSteps}`);
  lines.push('');
  lines.push('- Step type counts:');
  lines.push(`  - Objective: ${aggregate.stepTypeCounts.objective}`);
  lines.push(`  - Definition: ${aggregate.stepTypeCounts.definition}`);
  lines.push(`  - Example: ${aggregate.stepTypeCounts.example}`);
  lines.push(`  - Question: ${aggregate.stepTypeCounts.question}`);
  lines.push(`  - Summary: ${aggregate.stepTypeCounts.summary}`);
  lines.push(`  - Unknown: ${aggregate.stepTypeCounts.unknown}`);

  if (aggregate.stepTypeCounts.unknown > 0) {
    const aggregateUnknownParts = Object.keys(aggregate.unknownStepTypes)
      .sort()
      .map((key) => `${key}: ${aggregate.unknownStepTypes[key]}`);
    lines.push(`  - Unknown raw types: ${aggregateUnknownParts.join(', ')}`);
  }

  lines.push(
    `- Content types present: ${formatList(
      contentTypesPresentLabelList(aggregate.stepTypeCounts, aggregate.unknownStepTypes)
    )}`
  );
  lines.push('');
  lines.push('- Question-level summary:');
  lines.push(`  - Total questions: ${aggregate.questionSummary.totalQuestions}`);
  lines.push(`  - Option format string[]: ${aggregate.questionSummary.optionFormats.stringArray}`);
  lines.push(
    `  - Option format bilingual object[]: ${aggregate.questionSummary.optionFormats.bilingualObjectArray}`
  );
  lines.push(`  - Option format mixed/other: ${aggregate.questionSummary.optionFormats.mixedOther}`);
  lines.push(`  - Yes/No question count: ${aggregate.questionSummary.yesNoCount}`);
  lines.push(`  - Questions with hint: ${aggregate.questionSummary.presenceCounts.hint}`);
  lines.push(`  - Questions with explanation: ${aggregate.questionSummary.presenceCounts.explanation}`);
  lines.push(`  - Questions with workedExample: ${aggregate.questionSummary.presenceCounts.workedExample}`);
  lines.push(`  - Questions with examples: ${aggregate.questionSummary.presenceCounts.examples}`);
  lines.push(
    `  - Questions with wrongOptionExplanations: ${aggregate.questionSummary.presenceCounts.wrongOptionExplanations}`
  );
  lines.push('');
  lines.push('## Per-Lesson Metrics Table');
  lines.push('');
  lines.push('| ID | Total Steps | Question Count | Dominant Step Type |');
  lines.push('| --- | ---: | ---: | --- |');

  for (const row of perLessonRows) {
    lines.push(
      `| ${row.id} | ${row.totalSteps} | ${row.questionCount} | ${humanStepTypeLabel(row.dominantStepType)} |`
    );
  }

  lines.push('');

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
  console.log(`Generated lesson content report for ${orderedIds.length} lessons: ${outputPath}`);
}

main();
