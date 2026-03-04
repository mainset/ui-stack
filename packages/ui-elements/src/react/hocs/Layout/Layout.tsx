import cn from 'classnames';
import React from 'react';

interface WrappedComponentProps extends React.HTMLAttributes<HTMLElement> {
  contentAlignHorizontally: 'start' | 'center' | 'end';
  contentAlignVertically: 'start' | 'center' | 'end';
  contentSpace:
    | 'between-horizontally'
    | 'between-vertically'
    | 'around-horizontally'
    | 'around-vertically'
    | 'vertically';
  contentDirection: 'row' | 'column';
  hideOn: 'mobile' | 'desktop';
  showOn: 'mobile' | 'desktop';
}

const asLayout = (
  WrappedComponent: React.FC<React.HTMLAttributes<HTMLElement>>,
) => {
  const WrappedComponentAsLayout: React.FC<WrappedComponentProps> = ({
    className,
    contentAlignHorizontally,
    contentAlignVertically,
    contentSpace,
    contentDirection = 'row',
    hideOn,
    showOn,
    ...rest
  }) => {
    // NOTE: content has column direction when it's spaced vertically
    const isContentDirectionAsColumn =
      contentSpace && contentSpace.includes('vertically');
    const isContentShouldDisplayAsFlex =
      contentAlignHorizontally || contentAlignVertically || contentSpace;
    return (
      <WrappedComponent
        className={cn(className, {
          'ms-layout--flex': isContentShouldDisplayAsFlex,
          [`ms-layout--direction-${isContentDirectionAsColumn ? 'column' : contentDirection}`]:
            isContentShouldDisplayAsFlex,
          [`ms-layout--horizontally-${contentAlignHorizontally}`]:
            contentAlignHorizontally,
          [`ms-layout--vertically-${contentAlignVertically}`]:
            contentAlignVertically,
          [`ms-layout--space-${contentSpace}`]: contentSpace,
          [`ms-layout--hidden-${hideOn}`]: hideOn,
          [`ms-layout--shown-${showOn}`]: showOn,
        })}
        {...rest}
      />
    );
  };

  return WrappedComponentAsLayout;
};

export type { WrappedComponentProps };
export { asLayout };
