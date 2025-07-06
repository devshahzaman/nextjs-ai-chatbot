// components/markdown.tsx

import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

const components: Partial<Components> = {
  // @ts-expect-error - The CodeBlock component handles the 'inline' prop
  code: CodeBlock,
  // Fix: Don't use a fragment. Pass the <pre> tag through so CodeBlock can receive its props.
  pre: ({ node, children, ...props }) => (
    <pre {...props} className="relative">
      {children}
    </pre>
  ),
  ol: ({ node, children, ...props }) => (
    <ol className="list-decimal list-outside ml-6 my-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }) => (
    <li className="py-1 pl-2" {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="list-disc list-outside ml-6 my-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  p: ({ node, children, ...props }) => (
    <p className="my-1 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ node, children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  a: ({ node, children, ...props }) => (
    <Link
      href={props.href || "#"}
      className="text-blue-500 hover:text-blue-600 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </Link>
  ),
  h1: ({ node, children, ...props }) => (
    <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="text-2xl font-bold mt-6 mb-4 border-b pb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="text-xl font-semibold mt-5 mb-3" {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 className="text-lg font-semibold mt-5 mb-3" {...props}>
      {children}
    </h4>
  ),
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
