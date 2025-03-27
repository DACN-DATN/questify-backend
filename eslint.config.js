import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  // Ignore patterns
  {
    ignores: ['common/build/**/*'], // Add eslint.config.js to ignore patterns
  },
  // Base configuration
  {
    languageOptions: {
      ecmaVersion: 2016,
      sourceType: 'commonjs',
      globals: { node: true },
      parser: tseslint.parser,
      parserOptions: {
        project: ['./auth/tsconfig.json', './course_management/tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['auth/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./auth/tsconfig.json'],
      },
    },
  },
  {
    files: ['course_management/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./course_management/tsconfig.json'],
      },
    },
  },
  {
    files: ['course_learning/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./course_learning/tsconfig.json'],
      },
    },
  },
  {
    files: ['code_problem/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./code_problem/tsconfig.json'],
      },
    },
  },
  {
    files: ['admin/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./admin/tsconfig.json'],
      },
    },
  },
  {
    files: ['common/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./common/tsconfig.json'],
      },
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
);
