'use client';

import type { AvatarStyleProps, Tone } from '@mainset/ui-core';
import {
  AVATAR__CLASS_NAME_CONFIG,
  cnx,
  extractClassNamesFromProps,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

import { avatarInitials } from './avatar-initials.mjs';

type AvatarProps = React.ComponentPropsWithRef<'span'> &
  AvatarStyleProps & {
    /** The picture; until it loads, or when it fails, the fallback shows */
    avtSrc?: string;
    /** Whose avatar it is: its accessible name, and the initials of the fallback */
    avtName?: string;
    /** The fallback's tone @default the inherited one */
    avtTone?: Tone;
    /** More props of the `img` (`srcSet`, `loading`, `referrerPolicy`…) */
    avtImgProps?: Omit<React.ComponentPropsWithRef<'img'>, 'src' | 'alt'>;
    /** A fallback instead of the initials, e.g. an icon */
    children?: React.ReactNode;
  };

type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * A picture of a person, over a fallback (the initials of {avtName}, or `children`) that shows
 * while it loads and if it fails. It's one image for assistive tech, named by {avtName};
 * without a name it's decorative.
 *
 * @example <Avatar avtSrc={user.photoUrl} avtName={user.name} avtSize="sm" />
 */
function Avatar({
  avtSrc,
  avtName,
  avtTone,
  avtImgProps,

  className,
  children,
  ...props
}: AvatarProps) {
  const [status, setStatus] = React.useState<ImageStatus>('loading');
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  // A new picture starts over
  const [prevSrc, setPrevSrc] = React.useState(avtSrc);
  if (avtSrc !== prevSrc) {
    setPrevSrc(avtSrc);
    setStatus('loading');
  }

  // NOTE: a server-rendered image may fail before hydration, without an `error` event for React
  React.useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setStatus('error');
  }, [avtSrc]);

  const [classNames, spanProps] = extractClassNamesFromProps(
    [AVATAR__CLASS_NAME_CONFIG],
    props,
  );
  const fallback = children ?? avatarInitials(avtName);

  return (
    <span
      role={avtName ? 'img' : undefined}
      aria-label={avtName}
      aria-hidden={avtName ? undefined : true}
      className={cnx(className, classNames, toneRecipe(avtTone))}
      {...spanProps}
    >
      {status !== 'loaded' && fallback}
      {avtSrc && status !== 'error' && (
        <img
          {...avtImgProps}
          ref={imgRef}
          src={avtSrc}
          // NOTE: named by the avatar itself
          alt=""
          onLoad={(event) => {
            setStatus('loaded');
            avtImgProps?.onLoad?.(event);
          }}
          onError={(event) => {
            setStatus('error');
            avtImgProps?.onError?.(event);
          }}
        />
      )}
    </span>
  );
}

export { Avatar };
export type { AvatarProps };
