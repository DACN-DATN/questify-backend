// eslint.config.js (minimal version)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  // Base configuration
  {
    languageOptions: {
      ecmaVersion: 2016, // Matches your tsconfig "target"
      sourceType: 'commonjs', // Matches your tsconfig "module"
      globals: { node: true }, // Node.js environment
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
      'prettier/prettier': 'error', // Enforce Prettier formatting
      'no-unused-vars': 'off', // Disable base rule
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Catch unused variables
      '@typescript-eslint/no-explicit-any': 'error', // Disallow explicit 'any'
    },
  },
  // Minimal recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended, // Basic TypeScript rules
  // Test file overrides
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests
    },
  },
  // Service-specific tsconfig overrides
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
);
