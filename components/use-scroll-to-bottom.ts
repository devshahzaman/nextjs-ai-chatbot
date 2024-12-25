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
      const observer = new MutationObserver(() => {
        // Check if new content is added before scrolling
        if (
          container.scrollHeight >
          container.scrollTop + container.clientHeight
        ) {
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

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;
    if (container && end) {
      // Check if new content is added before scrolling
      if (
        container.scrollHeight >
        container.scrollTop + container.clientHeight
      ) {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [containerRef, endRef]);

  return [containerRef, endRef];
}
