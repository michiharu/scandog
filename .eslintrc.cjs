/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
  },
  overrides: [
    {
      files: ['vitest.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
