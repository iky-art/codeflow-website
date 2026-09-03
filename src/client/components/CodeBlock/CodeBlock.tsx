import { ReactNode } from "react";
import "./CodeBlock.css";

interface CodeBlockProps {
  filename?: string;
  children: ReactNode; // pass pre-tokenized JSX spans, or plain text for simple cases
}

// Minimal, dependency-free code display. Real syntax highlighting (if needed)
// can be layered on later without changing this component's shape.
export function CodeBlock({ filename, children }: CodeBlockProps) {
  return (
    <div className="code-block">
      {filename && (
        <div className="code-block-header">
          <span className="code-block-dot" />
          {filename}
        </div>
      )}
      <pre className="code-block-body">
        <code>{children}</code>
      </pre>
    </div>
  );
}
