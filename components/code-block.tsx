'use client';
import { useState } from 'react';
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
  const [output, setOutput] = useState<string | null>(null);
  const [tab, setTab] = useState<'code' | 'run'>('code');
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\n$/, '');

  if (!inline) {
    return (
      <div className="not-prose flex flex-col max-w-full">
        {tab === 'code' && (
          <pre
            {...props}
            className={cn(
              "text-sm w-full dark:bg-zinc-900 p-4 border border-zinc-200",
              "dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900",
              "overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600",
              "scrollbar-track-transparent"
            )}
          >
            <code className="min-w-full inline-block">{children}</code>
          </pre>
        )}
        {tab === 'run' && output && (
          <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
            <code className="min-w-full inline-block">{output}</code>
          </div>
        )}
      </div>
    );
  }

  return (
    <code
      className={cn(
        className,
        "text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md"
      )}
      {...props}
    >
      {children}
    </code>
  );
}
