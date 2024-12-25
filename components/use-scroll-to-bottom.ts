import { useEffect, useRef } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T>,
  React.RefObject<T>
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const lastContentLength = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        // Check if mutation is from copy button
        const isCopyButtonMutation = mutations.some(mutation => 
          mutation.target.closest('[role="button"]')?.textContent?.includes('Copy')
        );

        if (isCopyButtonMutation) return;

        // Check if new content is added before scrolling
        if (container.scrollHeight > container.scrollTop + container.clientHeight) {
          end.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
