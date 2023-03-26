module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],
  plugins: ['svelte3', '@typescript-eslint', 'import'],
  ignorePatterns: ['*.cjs'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: true,
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', orderImportKind: 'asc' },
        groups: ['type', 'builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
      },
    ],
  },
}
