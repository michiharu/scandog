import fs from 'node:fs';
import { parse } from 'node:path';

import * as globby from 'globby';

export const isTargetPath = (suffix: string) => (path: string) => {
  const { name } = parse(path);
  return !name.endsWith(suffix);
};

export function getWithSuffix(path: string, suffix: string) {
  const { dir, name, ext } = parse(path);
  if (dir === '') return `${name}${suffix}${ext}`;
  return `${dir}/${name}${suffix}${ext}`;
}

export type PathResult = {
  path: string;
  withSuffix: string;
  exists: boolean;
};
type ScanOptions = {
  gitignore: boolean;
};
type GlobbySync = typeof globby.globbySync;
type ExistsSync = typeof fs.existsSync;

const scan = (
  suffix: string,
  patterns: string[],
  options: ScanOptions,
  globbySync: GlobbySync = globby.globbySync,
  existsSync: ExistsSync = fs.existsSync
): PathResult[] => {
  const paths = globbySync(patterns, options).filter(isTargetPath(suffix));
  return paths.map((path) => {
    const withSuffix = getWithSuffix(path, suffix);
    return { path, withSuffix, exists: existsSync(withSuffix) };
  });
};

export default scan;
