#!/usr/bin/env node

import { globbySync } from 'globby';
import { existsSync } from 'node:fs';
import yargs from 'yargs/yargs';

import scan from './index.js';
import { color, reportArgs, reportErrors, reportSummary } from './report.js';

const command = yargs(process.argv.slice(2))
  .usage(
    `
✨Welcome to Scandog🐕
Scandog checks if there exist files with the specified suffix for all files matching globs.

Please visit https://github.com/sindresorhus/globby#readme for how to write glob. Scandog uses "globby" as glob engine.

Usage: scandog <suffix> <patterns...> <options>

Example: scandog .spec '**/*.ts' --gitignore`
  )
  .command('* <suffix> <patterns...>', false)
  .positional('suffix', {
    describe: 'suffix',
    type: 'string',
    demandOption: true,
  })
  .positional('patterns', {
    describe: `glob patterns.`,
    type: 'string',
    array: true,
    default: ['**/*.{js,jsx,ts,tsx}'],
  })
  .options({
    gitignore: {
      type: 'boolean',
      describe: `This option applies ignore patterns from the gitignore file.
    The node_modules directory is always ignored even if you don't use this option.`,
      default: false,
    },
  })
  .alias({
    h: 'help',
    v: 'version',
    g: 'gitignore',
  })
  .demandCommand(1);

function run() {
  const { suffix, patterns, gitignore } = command.parseSync();

  reportArgs(suffix, patterns, gitignore).forEach((message) => console.log(message));

  patterns.push('!node_modules');
  const results = scan(suffix, patterns, { gitignore }, globbySync, existsSync);
  const errors = results.filter(({ exists }) => !exists);

  reportErrors(errors).forEach((message) => console.error(color.red(message)));
  reportSummary(results, errors, suffix).forEach((message) => console.log(message));

  if (results.length === 0 || errors.length !== 0) process.exit(1);
}

run();
