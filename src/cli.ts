#!/usr/bin/env node

import yargs from 'yargs/yargs';

import scan, { type PathResult } from './index.js';

const filesCount = (count: number) =>
  count === 1 ? ('1 file' as const) : (`${count} files` as const);

const color = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
};
const bg = {
  green: (text: string) => `\x1b[42m${text}\x1b[49m`,
  red: (text: string) => `\x1b[41m${text}\x1b[49m`,
};

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

const reportArgs = (suffix: string, patterns: string[], gitignore: boolean): string[] => {
  const messages = [''];

  messages.push(`   suffix: ${suffix}`);
  if (patterns.length === 1) {
    messages.push(`  pattern: ${patterns[0]}`);
  } else {
    messages.push(' patterns:');
    patterns.forEach((p) => messages.push(`  - ${p}`));
  }
  messages.push(`gitignore: ${gitignore}`);
  messages.push('');

  return messages;
};

const reportErrors = (errors: PathResult[]): string[] => {
  const messages = [];

  if (errors.length === 1) {
    const { path, withSuffix } = errors[0];
    messages.push(`Does not exist: ./${withSuffix}`);
    messages.push(`               (./${path})`);
  }
  if (errors.length > 1) {
    messages.push('List of files that do not exist:');
    errors.forEach(({ path, withSuffix }) => {
      messages.push(`  - ./${withSuffix}`);
      messages.push(`    ./${path}`);
    });
  }

  return messages;
};

const reportSummary = (results: PathResult[], errors: PathResult[], suffix: string): string[] => {
  const messages = [];

  if (results.length === 0) {
    messages.push(color.red('No matching files.'));
    return messages;
  }
  if (errors.length !== 0) messages.push('');
  messages.push(`Found ${filesCount(results.length)}.`);
  if (errors.length !== 0) {
    const message =
      errors.length === 1 ? '1 file does not exist.' : `${errors.length} files do not exist.`;
    messages.push(color.red(message));
  }
  const existCount = results.length - errors.length;
  if (existCount !== 0) {
    const message = existCount === 1 ? '1 file exists.' : `${existCount} files exist.`;
    messages.push(message);
  }
  if (errors.length === 0) {
    const message = `${bg.green('SUCCESS')} All files with "${suffix}" exist.`;
    messages.push(message);
  }
  messages.push('');

  return messages;
};

function run() {
  const { suffix, patterns, gitignore } = command.parseSync();

  reportArgs(suffix, patterns, gitignore).forEach((message) => console.log(message));

  patterns.push('!node_modules');
  const results = scan(suffix, patterns, { gitignore });
  const errors = results.filter(({ exists }) => !exists);

  reportErrors(errors).forEach((message) => console.error(message));
  reportSummary(results, errors, suffix).forEach((message) => console.log(message));

  if (results.length === 0 || errors.length !== 0) process.exit(1);
}

run();
