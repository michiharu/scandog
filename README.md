# ✨Welcome to Scandog🐕

Scandog checks if there exist files with the specified suffix for all files matching globs.

## Usage

You can call scandog from the npx command without installing it.

Scandog uses "globby" as glob engine. Please visit [globby#readme] for how to write glob.

[globby#readme]: https://github.com/sindresorhus/globby#readme

```bash
npx scandog <suffix> <patterns...> <options>
```

### Check spec files

```bash
npx scandog .spec '**/*.{ts,tsx}' --gitignore
```

### Check story files

```bash
npx scandog .stories '**/*.{ts,tsx}' --gitignore
```

## Options

### `-g`, `--gitignore`

This option applies ignore patterns from the gitignore file.
The node_modules directory is always ignored even if you don't use this option.
