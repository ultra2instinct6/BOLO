#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const reportPathArg = process.argv.slice(2).find((arg) => arg.startsWith('--report='));
const reportPath = reportPathArg
  ? (path.isAbsolute(reportPathArg.slice('--report='.length))
    ? reportPathArg.slice('--report='.length)
    : path.join(root, reportPathArg.slice('--report='.length)))
  : path.join(root, 'tools', 'lessons_quality_suite_report.json');

function run(command, args) {
  const res = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8'
  });
  return {
    command: `${command} ${args.join(' ')}`,
    exitCode: typeof res.status === 'number' ? res.status : 1,
    stdout: res.stdout || '',
    stderr: res.stderr || ''
  };
}

const checks = [
  run('node', ['tools/fix_normalized_lessons_batch1.cjs', '--check']),
  run('node', ['tools/validate_normalized_lessons.js']),
  run('node', ['tools/validate_wrong_option_explanations.cjs']),
  run('node', ['tools/generate_lessons_content_report.js'])
];

const summary = {
  ok: checks.every((x) => x.exitCode === 0),
  generatedAt: new Date().toISOString(),
  checks: checks.map((x) => ({ command: x.command, exitCode: x.exitCode })),
  details: checks
};

fs.writeFileSync(reportPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ ok: summary.ok, reportPath, checks: summary.checks }, null, 2));
if (!summary.ok) process.exit(1);
