import fs from 'node:fs';
import { parse } from 'node:path';

import { globbySync } from 'globby';

type ScanOptions = {
  gitignore: boolean;
};

export type PathResult = {
  path: string;
  withSuffix: string;
  exists: boolean;
};

export const isTargetPath = (suffix: string) => (path: string) => {
  const { name } = parse(path);
  return !name.endsWith(suffix);
};

export function getWithSuffix(path: string, suffix: string) {
  const { dir, name, ext } = parse(path);
  if (dir === '') return `${name}${suffix}${ext}`;
  return `${dir}/${name}${suffix}${ext}`;
}

const scan = (suffix: string, patterns: string[], { gitignore }: ScanOptions): PathResult[] => {
  const paths = globbySync(patterns, { gitignore }).filter(isTargetPath(suffix));
  return paths.map((path) => {
    const withSuffix = getWithSuffix(path, suffix);
    return { path, withSuffix, exists: fs.existsSync(withSuffix) };
  });
};

export default scan;
