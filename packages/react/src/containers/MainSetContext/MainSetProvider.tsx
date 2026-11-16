'use client';

import { createTheme } from '@mainset/ui-core/theme';
import React from 'react';

// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { OverlayContainer } from '../Overlay/OverlayContainer.js';
import { MainSetContext, MainSetContextValue } from './MainSetContext.mjs';
import {
  type MainSetTheme,
  MainSetThemeContext,
  type MainSetThemeContextValue,
} from './MainSetThemeContext.mjs';

type MainSetProviderState = Pick<
  MainSetContextValue,
  'isOverlayOpenById' | 'overlayStackIds'
>;

interface MainSetProviderProps {
  children?: React.ReactNode;
  /**
   * Runtime theme (brand colors and any `--ms-*` values), rendered as one `<style>` element, so it
   * is server-rendered without a flash. `useTheme().setTheme` changes it on the client; a new value
   * of this prop (by content, not identity) resets it.
   * Invalid colors throw (see `createTheme` in `@mainset/ui-core/theme`).
   */
  theme?: MainSetTheme;
  /** CSP nonce for the theme `<style>` element */
  themeNonce?: string;
}

// The runtime theme state, re-seeded whenever the {theme} prop's CSS changes
type ThemeState = { propCss: string; theme: MainSetTheme };

const MainSetProvider = ({
  children,
  theme: themeProp,
  themeNonce,
}: MainSetProviderProps) => {
  const themePropCss = React.useMemo(
    () => (themeProp ? createTheme(themeProp) : ''),
    [themeProp],
  );
  const [themeState, setThemeState] = React.useState<ThemeState>({
    propCss: themePropCss,
    theme: themeProp,
  });

  // NOTE: compares CSS text, so an inline `theme={{ … }}` object doesn't reset {setTheme} changes
  // on every render (the "adjust state while rendering" pattern, no extra effect pass)
  if (themeState.propCss !== themePropCss) {
    setThemeState({ propCss: themePropCss, theme: themeProp });
  }

  const setTheme = React.useCallback<MainSetThemeContextValue['setTheme']>(
    (next) =>
      setThemeState((prevState) => ({
        ...prevState,
        theme: typeof next === 'function' ? next(prevState.theme) : next,
      })),
    [],
  );

  const themeCss = React.useMemo(
    () => (themeState.theme ? createTheme(themeState.theme) : ''),
    [themeState.theme],
  );

  const themeValue = React.useMemo<MainSetThemeContextValue>(
    () => ({ theme: themeState.theme, setTheme }),
    [themeState.theme, setTheme],
  );

  const [state, setState] = React.useState<MainSetProviderState>({
    isOverlayOpenById: {},
    overlayStackIds: [],
  });

  /*
  const setOverlayOpenById = React.useCallback((id: string, isOpen: boolean) => {
    setState((prevState) => {
      const isCurrentlyOpen = prevState.isOverlayOpenById[id] ?? false;
      if (isCurrentlyOpen === isOpen) return prevState;

      const newStack = isOpen
        ? prevState.overlayStackIds.includes(id)
          ? prevState.overlayStackIds
          : [...prevState.overlayStackIds, id]
        : prevState.overlayStackIds.filter((stackId) => stackId !== id);

      return {
        isOverlayOpenById: { ...prevState.isOverlayOpenById, [id]: isOpen },
        overlayStackIds: newStack,
      };
    });
  }, []);
  */

  const toggleOverlayOpenById = React.useCallback((id: string) => {
    setState((prevState) => {
      const isCurrentlyOpen = prevState.isOverlayOpenById[id] ?? false;
      const willBeOpen = !isCurrentlyOpen;

      const newStack = willBeOpen
        ? prevState.overlayStackIds.includes(id)
          ? prevState.overlayStackIds
          : [...prevState.overlayStackIds, id]
        : prevState.overlayStackIds.filter((stackId) => stackId !== id);

      return {
        isOverlayOpenById: { ...prevState.isOverlayOpenById, [id]: willBeOpen },
        overlayStackIds: newStack,
      };
    });
  }, []);

  const value = React.useMemo<MainSetContextValue>(
    () => ({
      isOverlayOpenById: state.isOverlayOpenById,
      overlayStackIds: state.overlayStackIds,
      // setOverlayOpenById,
      toggleOverlayOpenById,
    }),
    [
      state.isOverlayOpenById,
      state.overlayStackIds,
      // setOverlayOpenById,
      toggleOverlayOpenById,
    ],
  );

  return (
    <MainSetThemeContext.Provider value={themeValue}>
      <MainSetContext.Provider value={value}>
        {themeCss && (
          <style
            data-ms-theme=""
            nonce={themeNonce}
            // NOTE: {createTheme} output is normalized hex colors + values validated against
            // `;{}<>`, so it can't close the element; set as HTML so SSR doesn't entity-escape it
            dangerouslySetInnerHTML={{ __html: themeCss }}
          />
        )}
        <OverlayContainer />
        {children}
      </MainSetContext.Provider>
    </MainSetThemeContext.Provider>
  );
};

export { MainSetProvider };
export type { MainSetProviderProps };
