'use client';

import { TOAST__CLASS_NAME_CONFIG } from '@mainset/ui-core';
import React from 'react';

import { Alert } from '../../components/Alert/index.mjs';
import { Button } from '../../components/Button/index.mjs';
import { VisuallyHidden } from '../../elements/VisuallyHidden/index.mjs';
import { usePresence } from '../../hooks/usePresence.mjs';
import type { ToastContextValue, ToastOptions } from './ToastContext.mjs';
import { ToastContext } from './ToastContext.mjs';

const { baseClass: TOAST } = TOAST__CLASS_NAME_CONFIG;

const TOAST__DEFAULT_DURATION = 5000;
// Older toasts beyond this are dismissed
const TOAST__MAX_VISIBLE = 5;

type ToastEntry = ToastOptions & {
  tstId: string;
  isClosing: boolean;
  /** Bumped when shown again with the same id: restarts its timer */
  version: number;
};

interface ToastItemProps {
  entry: ToastEntry;
  isPaused: boolean;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}

function ToastItem({ entry, isPaused, onDismiss, onRemove }: ToastItemProps) {
  const {
    tstId,
    tstTitle,
    tstDescription,
    tstDuration = TOAST__DEFAULT_DURATION,
    tstAction,
    isClosing,
    version,
    srfTheme = 'base',
    srfVariant,
    alrtIcon,
  } = entry;

  const ref = React.useRef<HTMLLIElement>(null);
  const { isMounted, state } = usePresence(!isClosing, ref);

  React.useEffect(() => {
    if (!isMounted) onRemove(tstId);
  }, [isMounted, onRemove, tstId]);

  // Time left, kept across pauses; reset when it's shown again
  const remainingRef = React.useRef(tstDuration);
  React.useLayoutEffect(() => {
    remainingRef.current = tstDuration;
  }, [tstDuration, version]);

  React.useEffect(() => {
    if (isClosing || isPaused || !Number.isFinite(remainingRef.current)) return;

    const startedAt = Date.now();
    const timeoutId = setTimeout(() => onDismiss(tstId), remainingRef.current);

    return () => {
      clearTimeout(timeoutId);
      remainingRef.current -= Date.now() - startedAt;
    };
  }, [isClosing, isPaused, onDismiss, tstId, version]);

  if (!isMounted) return null;

  return (
    <Alert
      alrtAs="li"
      ref={ref}
      // NOTE: announced by the provider's live region, not by the toast itself
      role="listitem"
      data-state={state}
      className={TOAST}
      srfTheme={srfTheme}
      srfVariant={srfVariant}
      alrtIcon={alrtIcon}
      alrtTitle={tstTitle}
      alrtActions={
        tstAction && (
          <Button
            btnSize="sm"
            srfVariant="outlined"
            onClick={() => {
              tstAction.onClick();
              onDismiss(tstId);
            }}
          >
            {tstAction.label}
          </Button>
        )
      }
      alrtOnDismiss={() => onDismiss(tstId)}
    >
      {tstDescription}
    </Alert>
  );
}

interface ToastProviderProps {
  children?: React.ReactNode;
  /** The name of the toast list for assistive tech @default 'Notifications' */
  toastRegionLabel?: string;
}

/**
 * Holds the toasts of a `MainSetProvider` and renders them, newest last, in the block-end /
 * inline-end corner. Announces each one through a live region that is always in the page
 * (`assertive` for errors), as a region added along with its content may not be read.
 */
function ToastProvider({
  children,
  toastRegionLabel = 'Notifications',
}: ToastProviderProps) {
  const [entries, setEntries] = React.useState<ToastEntry[]>([]);
  const [announcement, setAnnouncement] = React.useState<{
    options: ToastOptions;
    key: number;
  } | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocusWithin, setIsFocusWithin] = React.useState(false);
  const generatedId = React.useId();
  const countRef = React.useRef(0);

  const dismissToast = React.useCallback((id: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.tstId === id ? { ...entry, isClosing: true } : entry,
      ),
    );
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.tstId !== id),
    );
  }, []);

  const toast = React.useCallback<ToastContextValue['toast']>(
    (options) => {
      countRef.current += 1;
      const tstId = options.tstId ?? `${generatedId}-${countRef.current}`;

      setEntries((prevEntries) => {
        const existing = prevEntries.find((entry) => entry.tstId === tstId);
        const entry: ToastEntry = {
          ...options,
          tstId,
          isClosing: false,
          version: (existing?.version ?? 0) + 1,
        };

        if (existing) {
          return prevEntries.map((prevEntry) =>
            prevEntry.tstId === tstId ? entry : prevEntry,
          );
        }

        const nextEntries = [...prevEntries, entry];
        const openEntries = nextEntries.filter(({ isClosing }) => !isClosing);
        const overflowIds = new Set(
          openEntries
            .slice(0, Math.max(0, openEntries.length - TOAST__MAX_VISIBLE))
            .map(({ tstId: id }) => id),
        );

        return nextEntries.map((nextEntry) =>
          overflowIds.has(nextEntry.tstId)
            ? { ...nextEntry, isClosing: true }
            : nextEntry,
        );
      });

      setAnnouncement({ options, key: countRef.current });

      return tstId;
    },
    [generatedId],
  );

  const context = React.useMemo(
    () => ({ toast, dismissToast }),
    [toast, dismissToast],
  );
  const isPaused = isHovered || isFocusWithin;

  const isUrgent = announcement?.options.srfTheme === 'error';
  const announcementContent = announcement && (
    // NOTE: a new key per toast replaces the node, so the same text is announced again
    <span key={announcement.key}>
      {announcement.options.tstTitle}
      {announcement.options.tstDescription && (
        <>. {announcement.options.tstDescription}</>
      )}
    </span>
  );

  return (
    <ToastContext.Provider value={context}>
      {children}
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {!isUrgent && announcementContent}
      </VisuallyHidden>
      <VisuallyHidden aria-live="assertive" aria-atomic="true">
        {isUrgent && announcementContent}
      </VisuallyHidden>
      {entries.length > 0 && (
        <ol
          className={`${TOAST}-region`}
          aria-label={toastRegionLabel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocusWithin(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setIsFocusWithin(false);
          }}
        >
          {entries.map((entry) => (
            <ToastItem
              key={entry.tstId}
              entry={entry}
              isPaused={isPaused}
              onDismiss={dismissToast}
              onRemove={removeToast}
            />
          ))}
        </ol>
      )}
    </ToastContext.Provider>
  );
}

export { ToastProvider };
export type { ToastProviderProps };
