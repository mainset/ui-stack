/*!
 * @license @mainset/docs-kit
 * Copyright (c) 2019-present Yevhen Uzhva (mainset).
 *
 * This source code is licensed under the CC-BY-NC-4.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Browser and server (isomorphic). The build-time half (markdown loader, static export) is
// `@mainset/docs-kit/node`.
export * from './core/index.mjs';
export {
  containsPage,
  findNavTrail,
  findSiblingPages,
} from './core/nav-tree.mjs';
export * from './react/index.mjs';
// The docs app: `defineDocsApp`, and what the engine builds the app with
export * from './app/index.mjs';
