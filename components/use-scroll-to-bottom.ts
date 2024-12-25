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
        const hasNewContent = mutations.some(mutation => {
          // Check for text content changes
          if (mutation.type === 'characterData') {
            return true;
          }
          // Check for added nodes that contain text
          if (mutation.type === 'childList') {
            return Array.from(mutation.addedNodes).some(node => 
              node.textContent && node.textContent.length > lastContentLength.current
            );
          }
          return false;
        });

        if (hasNewContent) {
          lastContentLength.current = container.textContent?.length || 0;
          end.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
