import * as React from "react";
import { cn } from "../lib/cn";
import { CopyButton } from "./copy-button";

/**
 * Tiny, dependency-free highlighter tuned for the snippets in the console
 * (bash + TypeScript). Not a general tokenizer — just enough for premium code.
 */
const TS_KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|await|async|new|app|use|type|interface|extends|default|if|else|for|of|in)\b/;

type Token = { text: string; cls?: string };

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  const commentIdx = lang === "bash" ? line.indexOf("#") : line.indexOf("//");
  const code = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const comment = commentIdx >= 0 ? line.slice(commentIdx) : "";

  const pattern =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\$[\w.]+|\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)|(\s+)|([^\sA-Za-z_]+)/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code)) !== null) {
    const [full, str, num, word, ws, sym] = match;
    if (str) tokens.push({ text: full, cls: "tok-str" });
    else if (num) tokens.push({ text: full, cls: "tok-num" });
    else if (word) {
      if (lang !== "bash" && TS_KEYWORDS.test(word))
        tokens.push({ text: full, cls: "tok-kw" });
      else if (lang === "bash" && /^(npm|pnpm|bun|yarn|npx|add|install|run)$/.test(word))
        tokens.push({ text: full, cls: "tok-kw" });
      else if (/^[A-Z]/.test(word)) tokens.push({ text: full, cls: "tok-type" });
      else if (code[pattern.lastIndex] === "(")
        tokens.push({ text: full, cls: "tok-fn" });
      else tokens.push({ text: full });
    } else if (ws) tokens.push({ text: full });
    else if (sym) tokens.push({ text: full, cls: "tok-punc" });
  }
  if (comment) tokens.push({ text: comment, cls: "tok-comment" });
  return tokens;
}

function Highlight({ code, lang }: { code: string; lang: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block min-h-[1.4em]">
          {line.length === 0
            ? " "
            : tokenizeLine(line, lang).map((t, j) => (
                <span key={j} className={t.cls}>
                  {t.text}
                </span>
              ))}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({
  code,
  lang = "ts",
  filename,
  className,
  onCopied,
}: {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
  onCopied?: () => void;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-muted/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {filename ?? (lang === "bash" ? "terminal" : "example")}
        </span>
        <CopyButton value={code} className="h-7 w-7" onCopied={onCopied} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          <Highlight code={code} lang={lang} />
        </code>
      </pre>
    </div>
  );
}
