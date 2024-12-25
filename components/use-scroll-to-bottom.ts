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
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            // Check if new content is added before scrolling
            if (
              container.scrollHeight >
              container.scrollTop + container.clientHeight
            ) {
              end.scrollIntoView({ behavior: "smooth", block: "end" });
            }
          }
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: false, // Important: Only observe direct child changes
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
