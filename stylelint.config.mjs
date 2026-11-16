import mainsetStylelintConfig from '@mainset/dev-stack-fe/stylelint';

/** @type {import('stylelint').Config} */
export default {
  ...mainsetStylelintConfig,
  rules: {
    ...mainsetStylelintConfig.rules,
    // kebab-case blocks with BEM elements / modifiers: `ms-checkbox__icon`, `ms-button--full-width`
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Expected a kebab-case BEM class (block__element--modifier)' },
    ],
  },
};
