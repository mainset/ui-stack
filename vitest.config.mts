import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.{mts,tsx}'],
    // NOTE: stylesheets imported by element modules are irrelevant to class-name logic
    css: false,
  },
});
