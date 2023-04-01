import { type PathResult } from './index.js';

export const color = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
};
export const bg = {
  green: (text: string) => `\x1b[42m${text}\x1b[49m` as const,
  red: (text: string) => `\x1b[41m${text}\x1b[49m` as const,
};

export const reportArgs = (suffix: string, patterns: string[], gitignore: boolean): string[] => {
  const messages = ['Arguments:'];
  messages.push(`     suffix: ${suffix}`);
  if (patterns.length === 1) {
    messages.push(`    pattern: ${patterns[0]}`);
  } else {
    messages.push('   patterns:');
    patterns.forEach((p) => messages.push(`      - ${p}`));
  }
  messages.push(`  gitignore: ${gitignore}`);
  messages.push('');
  return messages;
};

export const reportErrors = (results: PathResult[]): string[] => {
  const errors = results.filter(({ exists }) => !exists);
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

export const filesCount = (count: number) =>
  count === 1 ? ('1 file' as const) : (`${count} files` as const);

export const reportSummary = (results: PathResult[], suffix: string): string[] => {
  const errors = results.filter(({ exists }) => !exists);
  const messages = [];
  if (errors.length !== 0) messages.push('');
  const result =
    results.length !== 0 && errors.length === 0 ? bg.green(' SUCCESS ') : bg.red(' ERROR ');
  messages.push(`Summary: ${result}`);

  if (results.length === 0) {
    messages.push(color.red('  No matching files.'));
    return messages;
  }
  messages.push(`  Found ${filesCount(results.length)}.`);
  if (errors.length !== 0) {
    const message =
      errors.length === 1 ? '  1 file does not exist.' : `  ${errors.length} files do not exist.`;
    messages.push(color.red(message));
  }
  const existCount = results.length - errors.length;
  if (existCount !== 0) {
    const message = existCount === 1 ? '  1 file exists.' : `  ${existCount} files exist.`;
    messages.push(message);
  }
  if (errors.length === 0) {
    const message = `  All files with "${suffix}" exist.`;
    messages.push(message);
  }
  messages.push('');

  return messages;
};
