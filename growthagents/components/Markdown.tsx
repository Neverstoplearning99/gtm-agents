"use client";

import { useMemo } from "react";

interface MarkdownProps {
  text: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+?)`/g, '<code class="md-code">$1</code>');
  out = out.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer noopener" class="md-link">$1</a>',
  );
  return out;
}

interface Block {
  type: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "hr" | "blockquote" | "code";
  content: string;
  items?: string[];
  lang?: string;
}

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i] ?? "")) {
        buf.push(lines[i] ?? "");
        i++;
      }
      i++;
      blocks.push({ type: "code", content: buf.join("\n"), lang });
      continue;
    }

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    if (/^---\s*$/.test(line) || /^\*\*\*\s*$/.test(line)) {
      blocks.push({ type: "hr", content: "" });
      i++;
      continue;
    }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1]?.length ?? 1;
      const type: Block["type"] = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      blocks.push({ type, content: h[2] ?? "" });
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i] ?? "")) {
        buf.push((lines[i] ?? "").replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", content: buf.join(" ") });
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", content: "", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", content: "", items });
      continue;
    }

    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i] ?? "") &&
      !/^(#{1,3})\s+/.test(lines[i] ?? "") &&
      !/^\s*[-*+]\s+/.test(lines[i] ?? "") &&
      !/^\s*\d+\.\s+/.test(lines[i] ?? "") &&
      !/^>\s?/.test(lines[i] ?? "") &&
      !/^---\s*$/.test(lines[i] ?? "") &&
      !/^```/.test(lines[i] ?? "")
    ) {
      buf.push(lines[i] ?? "");
      i++;
    }
    blocks.push({ type: "p", content: buf.join(" ") });
  }
  return blocks;
}

function renderBlock(b: Block, idx: number): JSX.Element {
  const key = `b-${idx}`;
  switch (b.type) {
    case "h1":
      return (
        <h1
          key={key}
          className="mt-3 text-xl font-semibold text-ink-100"
          dangerouslySetInnerHTML={{ __html: applyInline(b.content) }}
        />
      );
    case "h2":
      return (
        <h2
          key={key}
          className="mt-5 border-b border-ink-700/60 pb-1 text-lg font-semibold text-ink-100"
          dangerouslySetInnerHTML={{ __html: applyInline(b.content) }}
        />
      );
    case "h3":
      return (
        <h3
          key={key}
          className="mt-4 text-[15px] font-semibold text-ink-100"
          dangerouslySetInnerHTML={{ __html: applyInline(b.content) }}
        />
      );
    case "p":
      return (
        <p
          key={key}
          className="mt-2 leading-relaxed text-ink-200"
          dangerouslySetInnerHTML={{ __html: applyInline(b.content) }}
        />
      );
    case "ul":
      return (
        <ul key={key} className="mt-2 list-disc space-y-1 pl-5 text-ink-200">
          {(b.items ?? []).map((it, j) => (
            <li
              key={`${key}-${j}`}
              dangerouslySetInnerHTML={{ __html: applyInline(it) }}
            />
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="mt-2 list-decimal space-y-1 pl-5 text-ink-200">
          {(b.items ?? []).map((it, j) => (
            <li
              key={`${key}-${j}`}
              dangerouslySetInnerHTML={{ __html: applyInline(it) }}
            />
          ))}
        </ol>
      );
    case "hr":
      return <hr key={key} className="my-5 border-ink-700/70" />;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="mt-2 border-l-2 border-accent/60 pl-3 text-ink-300"
          dangerouslySetInnerHTML={{ __html: applyInline(b.content) }}
        />
      );
    case "code":
      return (
        <pre
          key={key}
          className="mt-3 overflow-x-auto rounded-md bg-ink-950/80 p-3 text-xs leading-relaxed text-ink-100"
        >
          <code>{b.content}</code>
        </pre>
      );
  }
}

export function Markdown({ text }: MarkdownProps) {
  const blocks = useMemo(() => parse(text), [text]);
  return (
    <div className="markdown text-[14px]">
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}
