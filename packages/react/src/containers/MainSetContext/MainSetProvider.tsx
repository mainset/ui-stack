'use client';

import { createTheme } from '@mainset/ui-core/theme';
import React from 'react';

// NOTE: avoid loop dependency as MainSetProvider uses OverlayContainer
import { OverlayContainer } from '../Overlay/OverlayContainer.js';
import {
  MainSetContext,
  type MainSetContextValue,
  type OverlayRegistration,
} from './MainSetContext.mjs';
import {
  type MainSetTheme,
  MainSetThemeContext,
  type MainSetThemeContextValue,
} from './MainSetThemeContext.mjs';

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

  const [isOverlayOpenById, setIsOverlayOpenById] = React.useState<
    Record<string, boolean>
  >({});
  const [overlayStackIds, setOverlayStackIds] = React.useState<string[]>([]);
  // NOTE: a ref, so registering a dismiss handler doesn't re-render every consumer
  const overlayRegistrationsRef = React.useRef(
    new Map<string, OverlayRegistration>(),
  );

  const setOverlayOpen = React.useCallback(
    (id: string, isOpen: boolean | ((isOpen: boolean) => boolean)) =>
      setIsOverlayOpenById((prevState) => {
        const wasOpen = prevState[id] ?? false;
        const willBeOpen =
          typeof isOpen === 'function' ? isOpen(wasOpen) : isOpen;

        return wasOpen === willBeOpen
          ? prevState
          : { ...prevState, [id]: willBeOpen };
      }),
    [],
  );

  const openOverlayById = React.useCallback(
    (id: string) => setOverlayOpen(id, true),
    [setOverlayOpen],
  );
  const closeOverlayById = React.useCallback(
    (id: string) => setOverlayOpen(id, false),
    [setOverlayOpen],
  );
  const toggleOverlayOpenById = React.useCallback(
    (id: string) => setOverlayOpen(id, (isOpen) => !isOpen),
    [setOverlayOpen],
  );

  const registerOverlay = React.useCallback(
    (id: string, registration: OverlayRegistration) => {
      overlayRegistrationsRef.current.set(id, registration);
      setOverlayStackIds((prevIds) => [
        ...prevIds.filter((stackId) => stackId !== id),
        id,
      ]);

      return () => {
        // NOTE: only its own registration, a remount may have replaced it already
        if (overlayRegistrationsRef.current.get(id) === registration) {
          overlayRegistrationsRef.current.delete(id);
        }

        setOverlayStackIds((prevIds) =>
          prevIds.filter((stackId) => stackId !== id),
        );
      };
    },
    [],
  );

  const overlayStackIdsRef = React.useRef(overlayStackIds);
  React.useLayoutEffect(() => {
    overlayStackIdsRef.current = overlayStackIds;
  }, [overlayStackIds]);

  const dismissTopOverlay = React.useCallback(
    (reason: 'escape' | 'backdrop') => {
      const stackIds = overlayStackIdsRef.current;
      // NOTE: not `.at(-1)`, Safari 15.4+
      const topId = stackIds[stackIds.length - 1];
      const registration =
        topId === undefined
          ? undefined
          : overlayRegistrationsRef.current.get(topId);

      if (!registration) return;
      if (reason === 'backdrop' && !registration.isBackdropDismissable) return;

      registration.onDismiss();
    },
    [],
  );

  const value = React.useMemo<MainSetContextValue>(
    () => ({
      isOverlayOpenById,
      overlayStackIds,
      openOverlayById,
      closeOverlayById,
      toggleOverlayOpenById,
      dismissTopOverlay,
      registerOverlay,
    }),
    [
      isOverlayOpenById,
      overlayStackIds,
      openOverlayById,
      closeOverlayById,
      toggleOverlayOpenById,
      dismissTopOverlay,
      registerOverlay,
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
