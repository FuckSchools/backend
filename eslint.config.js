import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintConfigUnicorn from 'eslint-plugin-unicorn';
import boundaries from 'eslint-plugin-boundaries';
import neverthrow from 'eslint-plugin-neverthrow';

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
    plugins: { neverthrow },
  },
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
  {
    files: ['src/modules/**'],
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'domain',
          pattern: 'src/modules/**/domain/**',
        },
        {
          type: 'application',
          pattern: 'src/modules/**/application/**',
        },
        {
          type: 'infrastructure',
          pattern: 'src/modules/**/infrastructure/**',
        },
        {
          type: 'controller',
          pattern: 'src/modules/**/controller/**',
        },
        {
          type: 'shared',
          pattern: 'src/modules/shared/**',
        },
      ],
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      'boundaries/dependencies': [
        2,
        {
          default: 'disallow',
          rules: [
            { from: { type: 'domain' }, allow: { to: { type: 'shared' } } },
            {
              from: { type: 'application' },
              allow: { to: { type: ['domain', 'shared'] } },
            },
            {
              from: { type: 'infrastructure' },
              allow: { to: { type: ['domain', 'application', 'shared'] } },
            },
            {
              from: { type: 'controller' },
              allow: {
                to: {
                  type: ['domain', 'application', 'infrastructure', 'shared'],
                },
              },
            },
            { from: { type: 'shared' }, disallow: { to: { type: '*' } } },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
