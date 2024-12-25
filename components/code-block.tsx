'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { CodeIcon, LoaderIcon, PlayIcon, PythonIcon, CopyIcon } from './icons';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
// Import all languages
import 'prismjs/components/';


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
    const [pyodide, setPyodide] = useState<any>(null);
    const match = /language-(\w+)/.exec(className || '');
    const isPython = match && match[1] === 'python';
    const codeContent = String(children).replace(/\n$/, '');
    const [tab, setTab] = useState<'code' | 'run'>('code');
    const codeRef = useRef<HTMLPreElement>(null);
    const [isCopied, setIsCopied] = useState(false);
    const language = match ? match[1] : 'text';


    const handleCopyCode = useCallback(async () => {
        if (codeRef.current) {
            try {
                await navigator.clipboard.writeText(codeRef.current.textContent || '');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy code: ', err);
            }
        }
    }, []);


    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [codeRef, children]);



  if (!inline) {
    return (
      <div className="not-prose flex flex-col relative">
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyCode}
                    >
                        <CopyIcon className={cn("h-4 w-4", {
                            "text-green-500": isCopied
                        })} />
                     </Button>
                </TooltipTrigger>
                  <TooltipContent>
                      {isCopied ? "Copied!" : "Copy"}
                  </TooltipContent>
            </Tooltip>
        </div>
        <div className="absolute top-2 left-2  z-10 text-sm font-medium text-zinc-400 uppercase">
                {language}
            </div>
        {tab === 'code' && (
          <pre
              ref={codeRef}
            {...props}
            className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
          >
            <code className={`whitespace-pre-wrap break-words language-${language}`}>
                {children}
             </code>
          </pre>
        )}

        {tab === 'run' && output && (
          <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
            <code>{output}</code>
          </div>
        )}
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
