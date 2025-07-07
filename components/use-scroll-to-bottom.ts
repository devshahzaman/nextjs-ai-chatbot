// components/use-scroll-to-bottom.ts

import { useEffect, useRef } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T>,
  React.RefObject<T>
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        // 1. Check if any of the detected changes originated from the copy button.
        const isFromCopyButton = mutations.some((mutation) => {
          // The `target` of the mutation is the node that changed.
          // This could be the button element itself or a text node inside it.
          const targetNode = mutation.target;

          // If the changed node has a parent element with aria-label="Copy code",
          // then it's a change we want to IGNORE.
          // We use `.closest()` to efficiently check the node and its parents.
          return (targetNode as Element).closest?.('[aria-label="Copy code"]');
        });

        // 2. If the change was from the copy button, do nothing.
        if (isFromCopyButton) {
          return;
        }

        // 3. Otherwise, it's a valid change (like AI typing), so scroll.
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      });

      // We MUST observe the subtree to see the AI streaming text into a message.
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true, // Also watch for changes to text content.
      });

      return () => observer.disconnect();
    }
  }, []); // The effect runs only once, setting up the observer.

  return [containerRef, endRef];
}
