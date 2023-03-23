/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
