import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintConfigUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/migrations',
      '.vscode/**',
      '**/generated',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    rules: {
      'markdown/fenced-code-language': 'off',
    },
    extends: ['markdown/recommended'],
  },
  eslintConfigUnicorn.configs['recommended'],
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
