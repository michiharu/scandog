#!/usr/bin/env node

import { globbySync } from 'globby';
import fs from 'node:fs';
import { format, parse } from 'node:path';
import Reporter from './reporter.js';

function getWithSuffix(path: string, suffix: string) {
  const { root, dir, name, ext } = parse(path);
  return format({ root, dir, name: `${name}.${suffix}`, ext });
}

const isTarget = (suffix: string) => (path: string) => {
  if (path.includes('node_modules')) return false;
  const { name } = parse(path);
  return !name.includes(suffix);
};

const check = (suffix: string, reporter: Reporter) => (path: string) => {
  const withSuffix = getWithSuffix(path, suffix);
  const exists = fs.existsSync(withSuffix);
  if (exists) {
    reporter.reportExist();
  } else {
    reporter.reportNotExist(withSuffix, path);
  }
};

function scan(patterns: string[], suffix: string) {
  const paths = globbySync(patterns).filter(isTarget(suffix));
  const reporter = new Reporter(paths);
  paths.forEach(check(suffix, reporter));
  reporter.printSummary();
}

function showVersion() {
  console.log(JSON.stringify(process.env, undefined, 2));
  const json = fs.readFileSync(new URL('package.json', process.env.npm_package_version), 'utf8');
  const { name, version } = JSON.parse(json);
  console.log(`${name} ${version}`);
}

function showHelpInformation() {
  console.log(
    `Usage: scandog [suffix] [file/glob ...]

Verify that all files matching a given suffix have been correctly identified by the provided glob pattern.
The default glob is "**/*.{js,jsx,ts,tsx}".
Given a suffix of "spec" and a glob expression of "**/*.ts",
check that for each ".ts" file matching the glob expression, there exists a corresponding ".spec.ts" file.

  -h, --help     Display this help
  -v, --version  Display the package version
  `
  );
}

function run() {
  const args = process.argv.slice(2);

  if (args.some((a) => ['--help', '-h'].includes(a))) return showHelpInformation();
  if (args.some((a) => ['--version', '-v'].includes(a))) return showVersion();

  const suffix = args[0];
  const patterns = args.slice(1);
  if (patterns.length === 0) patterns.push('**/*.{js,jsx,ts,tsx}');
  scan(patterns, suffix);
}

run();
