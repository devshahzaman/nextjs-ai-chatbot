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
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            end.scrollIntoView({ behavior: "smooth", block: "end" });
            break;
          }
        }
      });

      observer.observe(container, {
        childList: true,
      });

      return () => observer.disconnect();
    }
  }, []); // The effect runs only once, setting up the observer.

  return [containerRef, endRef];
}
