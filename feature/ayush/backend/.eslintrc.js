<<<<<<< HEAD:feature/ayush/backend/base-setup/.eslintrc.js
/**
 * CON-17: ESLint Configuration for TypeScript
 * Configure ESLint for TypeScript code quality
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
=======
module.exports = {
  parser: '@typescript-eslint/parser',
>>>>>>> feature/con-18-ci-cd:feature/ayush/backend/.eslintrc.js
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
<<<<<<< HEAD:feature/ayush/backend/base-setup/.eslintrc.js
  env: {
    node: true,
    es6: true,
    jest: true,
=======
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    node: true,
    es2020: true,
>>>>>>> feature/con-18-ci-cd:feature/ayush/backend/.eslintrc.js
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
<<<<<<< HEAD:feature/ayush/backend/base-setup/.eslintrc.js
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
=======
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
>>>>>>> feature/con-18-ci-cd:feature/ayush/backend/.eslintrc.js
};

