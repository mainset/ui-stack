import type { AvatarStyleProps } from '@mainset/ui-core';
import {
  AVATAR_GROUP__CLASS_NAME_CONFIG,
  AVATAR__CLASS_NAME_CONFIG,
  cnx,
  composeClassNames,
  toneRecipe,
} from '@mainset/ui-core';
import React from 'react';

type AvatarGroupProps = React.ComponentPropsWithRef<'div'> &
  AvatarStyleProps & {
    /** Avatars shown; the rest are counted in a last "+N" avatar */
    avtMax?: number;
    /** @default (count) => `${count} more` */
    avtGetMoreLabel?: (count: number) => string;
  };

/**
 * Overlapping avatars, e.g. the members of a project. {avtSize} / {avtShape} apply to every
 * avatar that doesn't set its own; past {avtMax}, a "+N" avatar counts the others.
 * Name the group for assistive tech (`aria-label`); it's a `role="group"`.
 *
 * @example
 * <AvatarGroup aria-label="Members" avtSize="sm" avtMax={3}>
 *   {members.map((member) => <Avatar key={member.id} avtName={member.name} avtSrc={member.photo} />)}
 * </AvatarGroup>
 */
function AvatarGroup({
  avtMax,
  avtSize,
  avtShape,
  avtGetMoreLabel = (count) => `${count} more`,

  className,
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children).filter(React.isValidElement);
  const shown = avtMax === undefined ? avatars : avatars.slice(0, avtMax);
  const hiddenCount = avatars.length - shown.length;

  return (
    <div
      role="group"
      className={cnx(className, AVATAR_GROUP__CLASS_NAME_CONFIG.baseClass)}
      {...props}
    >
      {shown.map((avatar) => {
        const avatarProps = avatar.props as AvatarStyleProps;

        return React.cloneElement(
          avatar as React.ReactElement<AvatarStyleProps>,
          {
            avtSize: avatarProps.avtSize ?? avtSize,
            avtShape: avatarProps.avtShape ?? avtShape,
          },
        );
      })}
      {hiddenCount > 0 && (
        <span
          role="img"
          aria-label={avtGetMoreLabel(hiddenCount)}
          // NOTE: keeps "+2" from reading "2+" in RTL text
          dir="ltr"
          className={cnx(
            composeClassNames([AVATAR__CLASS_NAME_CONFIG], {
              avtSize,
              avtShape,
            }),
            toneRecipe('muted'),
          )}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

export { AvatarGroup };
export type { AvatarGroupProps };
