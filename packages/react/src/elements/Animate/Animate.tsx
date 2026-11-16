'use client';

import type { AnimateStyleProps } from '@mainset/ui-core';
import { ANIMATE__CLASS_NAME_CONFIG, cnx } from '@mainset/ui-core';
import React from 'react';

import type { BlockElementType, PolymorphicProps } from '../utils/index.mjs';
import { mergeRefs, splitStyleProps } from '../utils/index.mjs';

type AnimateState = NonNullable<AnimateStyleProps['anmState']>;

type AnimateOwnProps = Omit<AnimateStyleProps, 'anmState'> & {
  /**
   * When the entrance plays (ignored while {anmIsIn} is set):
   * `mount` — from the first paint, in CSS alone (server-rendered HTML animates before
   * hydration); for what's on screen at load, e.g. a hero.
   * `visible` — once it scrolls into view; anything already on screen at load is simply shown.
   * @default 'mount'
   */
  anmTrigger?: 'mount' | 'visible';
  /** Controlled: `true` plays the entrance, `false` the exit */
  anmIsIn?: boolean;
  /** With {anmIsIn}: renders nothing once the exit has finished (and while it starts out) */
  anmIsUnmountedOnExit?: boolean;
  /** Called once the exit animation has finished */
  anmOnExited?: () => void;
  /** Milliseconds before it starts, e.g. `index * 80` for a staggered list */
  anmDelay?: number;
};

type AnimateProps<C extends BlockElementType = 'div'> = PolymorphicProps<
  'anmAs',
  C,
  AnimateOwnProps
>;

const EXIT_ANIMATION_NAME = 'ms-animate-exit';
// Content further down than this share of the viewport waits to scroll in
const VISIBLE__FOLD_RATIO = 0.9;
const VISIBLE__OBSERVER_OPTIONS: ConstructorParameters<
  typeof IntersectionObserver
>[1] = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
};

// The exit's total time from the computed style, for when no `animationend` comes (no styles)
function exitDurationMs(element: HTMLElement) {
  const { animationDuration, animationDelay } = getComputedStyle(element);
  const toMs = (value: string) =>
    Math.max(
      0,
      ...value
        .split(',')
        .map((part) =>
          part.trim().endsWith('ms')
            ? parseFloat(part)
            : parseFloat(part) * 1000,
        )
        .filter((ms) => !Number.isNaN(ms)),
    );

  return toMs(animationDuration) + toMs(animationDelay);
}

/**
 * Entrance and exit animations with CSS (`ms-animate` in ui-core). Choose where it comes from
 * with `anmFade` (default on), `anmSlide` (`up` / `down`) and `anmZoom` (`in` / `out`), how
 * long with `anmDuration`. Only `opacity` and `transform` move; `prefers-reduced-motion` shows it
 * at once.
 *
 * - `anmTrigger="mount"` (default): plays from the first paint.
 * - `anmTrigger="visible"`: plays when it scrolls into view. Server-rendered, it's visible from
 *   the start; only content below the fold is hidden, once in the browser, until it's reached.
 * - `anmIsIn`: controlled, plays the entrance / the exit; `anmIsUnmountedOnExit` removes it
 *   after the exit.
 *
 * NOTE: `anmFade={false}` for a page's largest text: Chrome counts its Largest Contentful Paint
 * only once it's visible, so a fade from 0 reports the page late.
 *
 * @example
 * <Animate anmSlide="up" anmFade={false}><Heading>…</Heading></Animate>
 * {items.map((item, index) => (
 *   <Animate key={item.id} anmAs="li" anmTrigger="visible" anmSlide="up" anmDelay={index * 80}>…</Animate>
 * ))}
 */
function Animate<C extends BlockElementType = 'div'>({
  anmAs,
  anmTrigger = 'mount',
  anmIsIn,
  anmIsUnmountedOnExit = false,
  anmOnExited,
  anmDelay,

  ref,
  style,
  className,
  children,
  onAnimationEnd,
  ...props
}: AnimateProps<C>): React.ReactElement | null {
  const isControlled = anmIsIn !== undefined;
  const elementRef = React.useRef<HTMLElement | null>(null);
  const setRef = React.useMemo(
    () => mergeRefs(elementRef, ref as React.Ref<HTMLElement>),
    [ref],
  );

  // ----- `visible`: no state class at first (the server's HTML stays readable) -----
  const [visibleState, setVisibleState] = React.useState<AnimateState | null>(
    null,
  );

  React.useEffect(() => {
    if (isControlled || anmTrigger !== 'visible') return;

    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    // Already on screen: shown as it is, no entrance
    if (
      element.getBoundingClientRect().top <
      window.innerHeight * VISIBLE__FOLD_RATIO
    )
      return;

    setVisibleState('hidden');

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      setVisibleState('enter');
      observer.disconnect();
    }, VISIBLE__OBSERVER_OPTIONS);

    observer.observe(element);
    return () => observer.disconnect();
  }, [isControlled, anmTrigger]);

  // ----- controlled: enter / exit, optionally unmounted after the exit -----
  const [hasExited, setHasExited] = React.useState(isControlled && !anmIsIn);
  const onExitedRef = React.useRef(anmOnExited);
  onExitedRef.current = anmOnExited;

  if (isControlled && anmIsIn && hasExited) setHasExited(false);

  const finishExit = React.useCallback(() => {
    setHasExited((previousHasExited) => {
      if (!previousHasExited) onExitedRef.current?.();
      return true;
    });
  }, []);

  // A fallback for the `animationend` that never comes (styles not loaded)
  React.useEffect(() => {
    const element = elementRef.current;
    if (!isControlled || anmIsIn || hasExited || !element) return;

    const timeoutId = setTimeout(finishExit, exitDurationMs(element) + 50);
    return () => clearTimeout(timeoutId);
  }, [isControlled, anmIsIn, hasExited, finishExit]);

  const state: AnimateState | null = isControlled
    ? anmIsIn
      ? 'enter'
      : 'exit'
    : anmTrigger === 'visible'
      ? visibleState
      : 'enter';

  const [classNames, restProps, mergedStyle] = splitStyleProps(
    [ANIMATE__CLASS_NAME_CONFIG],
    {
      ...props,
      anmState: state,
      style:
        anmDelay === undefined
          ? style
          : ({
              '--ms-animate-delay': `${anmDelay}ms`,
              ...style,
            } as React.CSSProperties),
    },
  );

  if (isControlled && anmIsUnmountedOnExit && hasExited) return null;

  return React.createElement(
    anmAs || 'div',
    {
      ...restProps,
      ref: setRef,
      className: cnx(className, classNames),
      style: mergedStyle,
      onAnimationEnd(event: React.AnimationEvent<HTMLElement>) {
        onAnimationEnd?.(event as never);
        if (
          event.target === event.currentTarget &&
          event.animationName === EXIT_ANIMATION_NAME
        ) {
          finishExit();
        }
      },
    },
    children,
  );
}

export { Animate };
export type { AnimateProps };
