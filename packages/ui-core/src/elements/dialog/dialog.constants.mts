// NOTE: CSS is attached to the module that defines the class-name config (always consumed),
// so bundlers keep it when tree-shaking re-exports through the side-effect-free `index.mjs`.
// Foundation (tokens + base styles) goes first; bundlers dedupe it across elements.
import '../../styles/foundation.scss';
import type { ClassNameFromPropConfig } from '../../utils/index.mjs';
// NOTE: a dialog is always placed by an `.ms-overlay` positioner
import '../overlay/overlay.constants.mjs';
import './dialog-normalize.scss';
import './dialog.scss';

/**
 * The panel of a dialog or a drawer: `__header` (`__title` + a close `ms-button--icon`),
 * `__body` (scrolls), `__footer` (actions). `data-state="open" | "closed"` runs the enter / exit
 * animation.
 */
const DIALOG__CLASS_NAME_CONFIG = {
  baseClass: 'ms-dialog',
  classNameDefinitionByPropName: {
    // value-mapped
    dlgSize: {
      modifier: 'size',
      options: ['xs', 'sm', 'base', 'lg', 'xl', 'full'],
      defaultValue: 'base',
    },
    // boolean
    dlgIsDrawer: {
      modifier: 'drawer',
      options: [true, false],
    },
  },
} as const satisfies ClassNameFromPropConfig;

/**
 * A close (×) icon for the dialog's close `ms-button--icon`, for markup written by hand.
 * Symmetric, so it needs no mirroring in RTL; drawn in `currentcolor`.
 */
const CLOSE_ICON__SVG =
  '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
  '<path d="M4 4l8 8M12 4l-8 8"/>' +
  '</svg>';

export { CLOSE_ICON__SVG, DIALOG__CLASS_NAME_CONFIG };
