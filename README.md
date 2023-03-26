# ✨Welcome to Scandog🐕

Scandog checks if there exist files with the specified suffix for all files matching globs.

## Usage

You can call scandog from npx command without installing npm.

Scandog uses "globby" as glob engine. Please visit [globby#readme] for how to write glob.

[globby#readme]: https://github.com/sindresorhus/globby#readme

```bash
npx scandog <suffix> <patterns...> <options>
```

### Check spec files

```bash
scandog .spec '**/*.{ts,tsx}' --gitignore
```

### Check story files

```bash
scandog .stories '**/*.{ts,tsx}' --gitignore
```

## options

### `-g`, `--gitignore`

Apply ignore patterns in ".gitignore" files. 
If you don't use this option, the node_modules directory will be ignored.
