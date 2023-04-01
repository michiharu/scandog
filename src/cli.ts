#!/usr/bin/env node
/* eslint-disable no-console */

import yargs from 'yargs/yargs';

import scan from './index.js';
import { color, reportArgs, reportErrors, reportSummary } from './report.js';

const command = yargs(process.argv.slice(2))
  .usage(
    `
✨Welcome to Scandog🐕
Scandog checks if there exist files with the specified suffix for all files matching globs.

Please visit https://github.com/sindresorhus/globby#readme for how to write glob. Scandog uses "globby" as glob engine.

Usage: scandog .spec -p '**/*.ts' '!*.config.ts' -g`
  )
  .command('* <suffix>', false)
  .positional('suffix', {
    describe: 'such as ".spec" or ".stories".',
    type: 'string',
    demandOption: true,
  })
  .options({
    patterns: {
      describe: 'Glob patterns.',
      type: 'array',
      string: true,
      demandOption: true,
    },
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
    p: 'patterns',
  })
  .demandCommand(1);

function run() {
  const { suffix, patterns, gitignore } = command.parseSync();
  if (!patterns) throw new Error();

  reportArgs(suffix, patterns, gitignore).forEach((message) => console.log(message));

  patterns.push('!node_modules');
  const results = scan(suffix, patterns, { gitignore });

  reportErrors(results).forEach((message) => console.error(color.red(message)));
  reportSummary(results, suffix).forEach((message) => console.log(message));

  if (results.length === 0 || results.some(({ exists }) => !exists)) process.exit(1);
}

run();
