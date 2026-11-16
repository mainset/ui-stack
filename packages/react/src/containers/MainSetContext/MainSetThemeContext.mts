'use client';

import type { CreateThemeOptions } from '@mainset/ui-core/theme';
import React from 'react';

type MainSetTheme = CreateThemeOptions | undefined;

interface MainSetThemeContextValue {
  /** The active runtime theme; `undefined` = the built-in theme */
  theme: MainSetTheme;
  /** Replaces the theme (or derives it from the current one); `undefined` restores the built-in one */
  setTheme: React.Dispatch<React.SetStateAction<MainSetTheme>>;
}

const MainSetThemeContext =
  React.createContext<MainSetThemeContextValue | null>(null);

/**
 * Reads and changes the runtime theme of the closest `MainSetProvider`.
 *
 * @example
 * const { setTheme } = useTheme();
 * setTheme((theme) => ({ ...theme, tones: { ...theme?.tones, primary: '#0f766e' } }));
 */
const useTheme = (): MainSetThemeContextValue => {
  const context = React.useContext(MainSetThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a MainSetProvider');
  }

  return context;
};

export { MainSetThemeContext, useTheme };
export type { MainSetTheme, MainSetThemeContextValue };
