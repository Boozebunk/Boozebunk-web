import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'],
    rules: {
      '@next/next/no-img-element': 'error',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports'
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/require-await': 'off'
    }
  }),
  {
    ignores: ['node_modules', 'dist', 'build', 'out', 'coverage', '.turbo', '.next']
  }
];

export default eslintConfig;
