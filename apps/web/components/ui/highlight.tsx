import * as React from "react";

/**
 * Tiny, dependency-free syntax highlighter tuned for the few snippets on this
 * site (bash + TypeScript). Not a general-purpose tokenizer — just enough to
 * make the marketing code blocks look premium in both themes.
 */

type Token = { text: string; cls?: string };

const TS_KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|await|async|new|app|use|type|interface|extends|default|if|else|for|of|in)\b/;

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  // Comments
  const commentIdx =
    lang === "bash" ? line.indexOf("#") : line.indexOf("//");
  let code = line;
  let comment = "";
  if (commentIdx >= 0) {
    // avoid matching # inside strings for bash — good enough for our snippets
    code = line.slice(0, commentIdx);
    comment = line.slice(commentIdx);
  }

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
      else if (lang === "bash" && /^(npm|pnpm|bun|yarn|npx|install|add|run)$/.test(word))
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

export function Highlight({
  code,
  lang = "ts",
}: {
  code: string;
  lang?: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.length === 0 ? (
            " "
          ) : (
            tokenizeLine(line, lang).map((t, j) => (
              <span key={j} className={t.cls}>
                {t.text}
              </span>
            ))
          )}
        </span>
      ))}
    </>
  );
}
