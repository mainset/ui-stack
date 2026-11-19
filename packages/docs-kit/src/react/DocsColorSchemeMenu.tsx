'use client';

import { Button } from '@mainset/react/components';
import { Menu } from '@mainset/react/containers';
import React from 'react';

import { useDocs } from './docs-context.js';
import { MonitorIcon, MoonIcon, SunIcon } from './icons.js';

type ColorScheme = 'light' | 'dark' | 'system';

const COLOR_SCHEME__STORAGE_KEY = 'msd-color-scheme';
const COLOR_SCHEMES: readonly ColorScheme[] = ['light', 'dark', 'system'];

/**
 * Sets `data-theme` on `<html>` before the first paint (put it inline in the template's
 * `<head>`), so a stored dark scheme never flashes light.
 */
const COLOR_SCHEME__INLINE_SCRIPT = `try{var s=localStorage.getItem('${COLOR_SCHEME__STORAGE_KEY}');if(s==='light'||s==='dark'||s==='system')document.documentElement.dataset.theme=s}catch(e){}`;

const readStoredScheme = (): ColorScheme | null => {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME__STORAGE_KEY);

    return COLOR_SCHEMES.includes(stored as ColorScheme)
      ? (stored as ColorScheme)
      : null;
  } catch {
    return null;
  }
};

/** `[scheme, setScheme]`: `system` on the server and the first render, the stored one after */
function useColorScheme() {
  const [scheme, setScheme] = React.useState<ColorScheme>('system');

  React.useEffect(() => {
    const stored = readStoredScheme();

    if (stored) setScheme(stored);
  }, []);

  const changeScheme = React.useCallback((nextScheme: ColorScheme) => {
    setScheme(nextScheme);
    document.documentElement.dataset.theme = nextScheme;
    try {
      localStorage.setItem(COLOR_SCHEME__STORAGE_KEY, nextScheme);
    } catch {
      // NOTE: storage can be blocked (private mode); the choice then lasts for the page only
    }
  }, []);

  return [scheme, changeScheme] as const;
}

const ICON__BY_SCHEME = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

function DocsColorSchemeMenu() {
  const { ui } = useDocs();
  const [scheme, setScheme] = useColorScheme();
  const SchemeIcon = ICON__BY_SCHEME[scheme];

  const labelByScheme: Record<ColorScheme, string> = {
    light: ui.colorSchemeLight,
    dark: ui.colorSchemeDark,
    system: ui.colorSchemeSystem,
  };

  return (
    <Menu mnuAlign="end">
      <Menu.Trigger>
        <Button
          btnIsIcon
          srfTheme="muted"
          srfVariant="ghost"
          aria-label={`${ui.colorScheme}: ${labelByScheme[scheme]}`}
        >
          <SchemeIcon />
        </Button>
      </Menu.Trigger>
      <Menu.List aria-label={ui.colorScheme}>
        <Menu.RadioGroup
          mnuValue={scheme}
          mnuOnValueChange={(value) => setScheme(value as ColorScheme)}
        >
          {COLOR_SCHEMES.map((option) => (
            <Menu.RadioItem key={option} mnuValue={option}>
              {labelByScheme[option]}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.List>
    </Menu>
  );
}

export { COLOR_SCHEME__INLINE_SCRIPT, DocsColorSchemeMenu, useColorScheme };
export type { ColorScheme };
