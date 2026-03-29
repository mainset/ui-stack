import React from 'react';

const useGlobalBodyScrollLock = (isLocked: boolean) => {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isLocked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
};

export { useGlobalBodyScrollLock };
