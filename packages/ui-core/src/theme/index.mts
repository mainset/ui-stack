/*!
 * @license @mainset/ui-core
 * Copyright (c) 2019-present Yevhen Uzhva (mainset).
 *
 * This source code is licensed under the CC-BY-NC-4.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// NOTE: `@mainset/ui-core/theme` imports no CSS, so it also runs in Node (SSR, build scripts)
export {
  applyTheme,
  createTheme,
  createThemeTokens,
  THEME_STYLE_ID,
} from './create-theme.mjs';
export type {
  ApplyThemeOptions,
  CreateThemeOptions,
  ThemeCustomProperties,
  ThemeCustomPropertyName,
  ThemeTokens,
  ThemeToneInput,
  ToneColorDefinition,
  ToneColorInput,
} from './create-theme.mjs';
export { deriveToneRoles, pickOnSolid } from './derive.mjs';
export type { DeriveToneRolesInput } from './derive.mjs';
export { contrastRatio, formatHex, mixOklab, parseColor } from './color.mjs';
export type { RgbaColor } from './color.mjs';
