'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Example: okaidia theme
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeContent = String(children).replace(/\n$/, '');

  // Highlight code on mount
  useEffect(() => {
    if (!inline) Prism.highlightAll();
  }, [inline, codeContent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!inline) {
    return (
      <div className="not-prose relative bg-zinc-900 text-zinc-50 border border-zinc-700 rounded-lg shadow-lg w-9/12">
        <div className="flex justify-between items-center p-2">
          <span className="text-sm font-semibold capitalize">{language}</span>
          <span
            role="button"
            onClick={handleCopy}
            className={cn(
              'cursor-pointer text-sm px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-50',
              copied && 'bg-green-500 hover:bg-green-400'
            )}
          >
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </div>
        <pre {...props} className={`language-${language} p-4 rounded-b-lg overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600`}>
          <code>{codeContent}</code>
        </pre>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
