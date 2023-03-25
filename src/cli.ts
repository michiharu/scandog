#!/usr/bin/env node

import yargs from 'yargs/yargs';

import scan from './index.js';

const filesCount = (count: number) =>
  count === 1 ? ('1 file' as const) : (`${count} files` as const);

const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const bgRed = (text: string) => `\x1b[41m${text}\x1b[49m`;
const bgGreen = (text: string) => `\x1b[42m${text}\x1b[49m`;

function run() {
  const argv = yargs(process.argv.slice(2))
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
        describe: 'Apply ignore patterns in ".gitignore" files.',
        default: false,
      },
    })
    .alias({
      h: 'help',
      v: 'version',
      g: 'gitignore',
    })
    .demandCommand(1)
    .parseSync();

  const { suffix, patterns, gitignore } = argv;
  console.log();
  console.log(`   suffix: ${suffix}`);
  if (patterns.length === 1) {
    console.log(`  pattern: ${patterns[0]}`);
  } else {
    console.log(' patterns:');
    patterns.forEach((p) => console.log(`  - ${p}`));
  }
  console.log(`gitignore: ${gitignore}`);
  console.log();

  patterns.push('!node_modules');
  const results = scan(suffix, patterns, { gitignore });

  const errors = results.filter(({ exists }) => !exists);

  if (errors.length === 1) {
    const { path, withSuffix } = errors[0];
    console.error(`Does not exist: ./${withSuffix}`);
    console.error(`               (./${path})`);
  }

  if (errors.length > 1) {
    console.error('List of files that do not exist:');
    errors.forEach(({ path, withSuffix }) => {
      console.error(`  - ./${withSuffix}`);
      console.error(`   (./${path})`);
    });
  }

  // summary
  if (results.length === 0) {
    console.error('\x1b[31mNo matching files.\x1b[0m');
    process.exitCode = 2;
    return;
  }

  if (errors.length !== 0) console.log();

  console.log(`Found ${filesCount(results.length)}.`);
  if (errors.length !== 0) {
    const message =
      errors.length === 1 ? '1 file does not exist.' : `${errors.length} files do not exist.`;
    console.log(red(message));
  }
  const existCount = results.length - errors.length;
  if (existCount !== 0) {
    const message = existCount === 1 ? '1 file exists.' : `${existCount} files exist.`;
    console.log(message);
  }

  if (errors.length === 0) {
    const message = `${bgGreen('SUCCESS')} All files with "${suffix}" exist.`;
    console.log();
  } else {
    process.exitCode = 1;
  }
  console.log();
}

run();
