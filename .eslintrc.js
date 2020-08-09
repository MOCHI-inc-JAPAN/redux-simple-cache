module.exports = {
  root: true,
  ignorePatterns: [
    '!.eslintrc.js',
    'node_modules',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:cypress/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        allowedNames: ['useInjection'],
      },
    ],
  },
}
