# ✨Welcome to Scandog🐕

Scandog checks if there exist files with the specified suffix for all files matching globs.

## Usage

You can call scandog from the npx command without installing it.

```bash
npx scandog <suffix> --patterns <patterns...> <other options>
```

`--patterns` is required. You can use a short alias.

```bash
npx scandog <suffix> -p <patterns...> <other options>
```

### Basic

```bash
npx scandog .spec -p '**/*.{ts,tsx}'
npx scandog .stories -p '**/*.tsx'
```

### Ignore config files with negated glob patterns

You can use negated glob patterns.

```bash
npx scandog .spec -p '**/*.{ts,tsx}' '!*.config.ts'
```

### Ignore patterns from .gitignore

You can use "-g" or "--gitignore" option to apply ignore patterns from ".gitignore" file.
This is a useful option to ignore the "dist" or "build" directories.

```bash
npx scandog .spec -p '**/*.{js.ts}' -g
```

## Options

### `-p`, `--patterns`

Glob patterns. Scandog uses "globby" as glob engine. Please visit [globby#readme] for how to write glob.

[globby#readme]: https://github.com/sindresorhus/globby#readme

### `-g`, `--gitignore`

This option applies ignore patterns from ".gitignore" file.
The node_modules directory is always ignored even if you don't use this option.
