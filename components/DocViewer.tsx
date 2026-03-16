"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidRenderer } from "@/components/MermaidRenderer";

const docViewerStyles = {
  doc: {
    maxWidth: "100%",
    lineHeight: 1.6,
    fontSize: "0.9375rem",
  },
  heading1: { fontSize: "1.75rem", marginTop: "1.5rem", marginBottom: "0.75rem" },
  heading2: { fontSize: "1.35rem", marginTop: "1.25rem", marginBottom: "0.5rem" },
  heading3: { fontSize: "1.1rem", marginTop: "1rem", marginBottom: "0.5rem" },
  paragraph: { marginBottom: "0.75rem" },
  list: { paddingLeft: "1.5rem", marginBottom: "0.75rem" },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  th: {
    borderBottom: "2px solid var(--border)",
    padding: "0.5rem 0.75rem",
    textAlign: "left" as const,
    color: "var(--muted)",
  },
  td: {
    borderBottom: "1px solid var(--border)",
    padding: "0.5rem 0.75rem",
  },
  code: {
    background: "var(--border)",
    padding: "0.15rem 0.35rem",
    borderRadius: 4,
    fontSize: "0.875em",
  },
  pre: {
    background: "var(--border)",
    padding: "1rem",
    borderRadius: 8,
    overflow: "auto",
    marginBottom: "0.75rem",
  },
  blockquote: {
    borderLeft: "4px solid var(--accent)",
    marginLeft: 0,
    paddingLeft: "1rem",
    color: "var(--muted)",
  },
};

interface DocViewerProps {
  content: string;
}

export default function DocViewer({ content }: DocViewerProps) {
  return (
    <div style={docViewerStyles.doc} className="doc-viewer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 style={docViewerStyles.heading1}>{children}</h1>,
          h2: ({ children }) => <h2 style={docViewerStyles.heading2}>{children}</h2>,
          h3: ({ children }) => <h3 style={docViewerStyles.heading3}>{children}</h3>,
          p: ({ children }) => <p style={docViewerStyles.paragraph}>{children}</p>,
          ul: ({ children }) => <ul style={docViewerStyles.list}>{children}</ul>,
          ol: ({ children }) => <ol style={docViewerStyles.list}>{children}</ol>,
          table: ({ children }) => (
            <div style={{ overflowX: "auto" }}>
              <table style={docViewerStyles.table}>{children}</table>
            </div>
          ),
          th: ({ children }) => <th style={docViewerStyles.th}>{children}</th>,
          td: ({ children }) => <td style={docViewerStyles.td}>{children}</td>,
          code: ({ className, children, ...props }) => {
            const isMermaid = typeof className === "string" && className.includes("language-mermaid");
            const code = String(children ?? "").replace(/\n$/, "");
            if (isMermaid) {
              return <MermaidRenderer code={code} />;
            }
            return (
              <code style={docViewerStyles.code} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const child = React.Children.only(children) as React.ReactElement<{ children?: React.ReactNode; className?: string }> | null;
            const className = child?.props?.className ?? "";
            const isMermaid = typeof className === "string" && /language-mermaid/.test(className);
            const codeStr = (child?.props?.children != null ? String(child.props.children) : "").replace(/\n$/, "");
            if (isMermaid && codeStr.trim()) {
              return <MermaidRenderer code={codeStr} />;
            }
            return <pre style={docViewerStyles.pre}>{children}</pre>;
          },
          blockquote: ({ children }) => <blockquote style={docViewerStyles.blockquote}>{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
