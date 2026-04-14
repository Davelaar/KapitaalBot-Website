"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/lib/i18n";
import { slugifyHeadingPlainText } from "@/lib/doc-heading-slug";
import { isExternalDocHref, resolveDocMarkdownHref } from "@/lib/resolve-doc-markdown-href";
import { MermaidLiveDiagram } from "@/components/MermaidLiveDiagram";

const docViewerStyles = {
  doc: {
    maxWidth: "100%",
    minWidth: 0,
    /* Do not make the whole article a horizontal scroll strip; contain wide blocks in pre/mermaid/table wrappers */
    overflowX: "hidden" as const,
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
    borderLeft: "4px solid var(--brand)",
    marginLeft: 0,
    paddingLeft: "1rem",
    color: "var(--muted)",
  },
};

interface DocViewerProps {
  content: string;
  locale: Locale;
  docSlug: string;
}

/** react-markdown does not render raw HTML; engine docs used `<a name="...">` for anchors — strip so they are not shown as literal text. */
function stripInvisibleAnchors(markdown: string): string {
  return markdown.replace(/<a\s+name="[^"]*"\s*>\s*<\/a>\s*\n?/gi, "");
}

function reactNodeToPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToPlainText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return reactNodeToPlainText(props.children);
  }
  return "";
}

export default function DocViewer({ content, locale, docSlug }: DocViewerProps) {
  const md = stripInvisibleAnchors(content);

  const nextHeadingId = React.useMemo(() => {
    const counts = new Map<string, number>();
    return (plain: string) => {
      const base = slugifyHeadingPlainText(plain);
      const k = counts.get(base) ?? 0;
      counts.set(base, k + 1);
      return k === 0 ? base : `${base}-${k}`;
    };
  }, [md]);

  const mkHeading =
    (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", style: React.CSSProperties) =>
    ({ children }: { children?: React.ReactNode }) => {
      const text = reactNodeToPlainText(children);
      const id = nextHeadingId(text);
      return (
        <Tag id={id} style={style}>
          {children}
        </Tag>
      );
    };

  return (
    <article style={docViewerStyles.doc} className="doc-viewer markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: mkHeading("h1", docViewerStyles.heading1),
          h2: mkHeading("h2", docViewerStyles.heading2),
          h3: mkHeading("h3", docViewerStyles.heading3),
          h4: mkHeading("h4", docViewerStyles.heading3),
          h5: mkHeading("h5", docViewerStyles.heading3),
          h6: mkHeading("h6", docViewerStyles.heading3),
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
              return <MermaidLiveDiagram chart={code} />;
            }
            return (
              <code style={docViewerStyles.code} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const child = React.Children.only(children) as React.ReactElement<{
              children?: React.ReactNode;
              className?: string;
            }> | null;
            const className = child?.props?.className ?? "";
            const isMermaid = typeof className === "string" && /language-mermaid/.test(className);
            const codeStr = (child?.props?.children != null ? String(child.props.children) : "").replace(/\n$/, "");
            if (isMermaid && codeStr.trim()) {
              return <MermaidLiveDiagram chart={codeStr} />;
            }
            return <pre style={docViewerStyles.pre}>{children}</pre>;
          },
          blockquote: ({ children }) => <blockquote style={docViewerStyles.blockquote}>{children}</blockquote>,
          a: ({ href, children }) => {
            if (isExternalDocHref(href)) {
              return (
                <a
                  href={href}
                  className="kb-text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            }
            const resolved = resolveDocMarkdownHref(href, locale, docSlug);
            return (
              <Link href={resolved} className="kb-text-link">
                {children}
              </Link>
            );
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </article>
  );
}
