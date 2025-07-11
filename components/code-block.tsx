// components/code-block.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";

// Import languages you expect to use
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";

// Choose a theme
import "prismjs/themes/prism-tomorrow.css"; // A nice dark theme
import { cn } from "@/lib/utils";
import { CopyIcon, CheckCircleFillIcon } from "./icons"; // Assuming you have these icons

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";
  const codeContent = String(children).replace(/\n$/, "");

  // A heuristic to determine if it's a "small" snippet vs a "large" block
  const isBlock =
    !inline && (codeContent.includes("\n") || codeContent.length > 30);

  useEffect(() => {
    if (isBlock && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [isBlock, codeContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (isBlock) {
    return (
      <div className="not-prose relative bg-[#2d2d2d] text-zinc-50 rounded-lg shadow-lg my-4 w-full">
        <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 rounded-t-lg border-b border-zinc-700">
          <span className="text-xs font-sans font-semibold capitalize text-zinc-400">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 cursor-pointer text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md text-zinc-300 transition-colors",
              copied && "bg-green-600 hover:bg-green-500 text-white"
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckCircleFillIcon size={14} />
            ) : (
              <CopyIcon size={14} />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre
          {...props}
          className={`language-${language} p-4 !my-0 rounded-b-lg overflow-x-auto max-w-[45rem]`}
        >
          <code ref={codeRef}>{codeContent}</code>
        </pre>
      </div>
    );
  }

  // Render as an inline code element for short snippets
  return (
    <code
      className={cn(
        "text-sm font-mono bg-muted text-muted-foreground py-0.5 px-1.5 rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
