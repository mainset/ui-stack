import {
  defineConfig,
  eslintMainsetConfig,
} from '@mainset/dev-stack-fe/eslint';

export default defineConfig([
  ...eslintMainsetConfig,
  {
    rules: {
      // NOTE: shipped code targets 2021 browsers (.browserslistrc): the regex `v` flag is ES2024
      // (Safari 17) and `Object.hasOwn` is ES2022 (Safari 15.4)
      'require-unicode-regexp': 'off',
      'prefer-object-has-own': 'off',
    },
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    rules: {
      // NOTE: the core rule reports parameter names inside function *types*
      // (`(id: string) => void`); the TS-aware rule covers real unused variables
      'no-unused-vars': 'off',
    },
  },
]);
