import React from 'react';

// NOTE: covers every focusable input type (email, password, number, search, etc.), not only text/radio/checkbox
const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableNodes = (rootNode: HTMLElement) =>
  Array.from(
    rootNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR),
  ).filter(
    (node) =>
      !node.hasAttribute('disabled') &&
      node.tabIndex !== -1 &&
      !node.closest('[inert]'),
  );

// An element that asks for the initial focus (`autoFocus` / `data-autofocus`)
const getAutoFocusNode = (rootNode: HTMLElement) =>
  rootNode.querySelector<HTMLElement>('[autofocus], [data-autofocus]');

/**
 * Keeps Tab / Shift+Tab inside {ref} while active. On activation it focuses the element marked
 * `autoFocus` / `data-autofocus`, else the first focusable one, else the container.
 * NOTE: it doesn't give the focus back when deactivated (a stacked dialog on top deactivates it
 * too): that's `useFocusReturn`, on close.
 */
const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
) => {
  React.useEffect(() => {
    if (!isActive || !ref.current) return;

    const rootNode = ref.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      // We only care about the Tab key
      if (e.key !== 'Tab') return;

      // Find all valid focusable elements inside the modal
      const focusableNodes = getFocusableNodes(rootNode);

      if (focusableNodes.length === 0) {
        // If there's nothing to focus, prevent default tabbing behavior
        e.preventDefault();
        return;
      }

      const firstNode = focusableNodes[0];
      const lastNode = focusableNodes[focusableNodes.length - 1];

      // If holding shift (tabbing backwards)
      if (e.shiftKey) {
        if (document.activeElement === firstNode) {
          lastNode.focus();
          e.preventDefault();
        }
      }
      // If not holding shift (tabbing forwards)
      else if (document.activeElement === lastNode) {
        firstNode.focus();
        e.preventDefault();
      }
    };

    // Initial focus once the content is painted.
    // NOTE: kept when it's inside already: `autoFocus`, or a stacked dialog on top just closed
    // and gave the focus back to its trigger in this one
    const frameId = requestAnimationFrame(() => {
      if (rootNode.contains(document.activeElement)) return;

      const [firstFocusableNode] = getFocusableNodes(rootNode);
      // Fall back to the container itself so focus never stays behind the overlay
      (getAutoFocusNode(rootNode) || firstFocusableNode || rootNode).focus();
    });

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, ref]);
};

/**
 * Gives the focus back on close to what had it when {isOpen} turned true (the trigger), as the
 * WAI-ARIA dialog pattern asks.
 */
const useFocusReturn = (isOpen: boolean) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedNode = document.activeElement as HTMLElement | null;

    return () => {
      // NOTE: not when the node is gone, or focus would jump to <body>
      if (previouslyFocusedNode?.isConnected) previouslyFocusedNode.focus();
    };
  }, [isOpen]);
};

export { getFocusableNodes, useFocusReturn, useFocusTrap };
