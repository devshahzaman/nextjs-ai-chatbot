'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Import a Prism.js theme
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
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
      <div className="not-prose relative bg-zinc-900 text-zinc-50 border border-zinc-700 rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-2">
          <span className="text-sm font-semibold capitalize">{language}</span>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy code to clipboard</TooltipContent>
          </Tooltip>
        </div>
        <pre {...props} className={`language-${language} p-4 rounded-b-lg overflow-x-auto`}>
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
