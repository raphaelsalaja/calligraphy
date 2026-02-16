import { type BundledLanguage, codeToTokens } from "shiki";
import { CopyButton } from "./copy-button";
import styles from "./styles.module.css";

interface CodeBlockProps {
  children: string;
  language?: BundledLanguage;
}

export async function CodeBlock({
  children,
  language = "tsx",
}: CodeBlockProps) {
  const { tokens } = await codeToTokens(children, {
    lang: language,
    theme: "github-light",
  });

  return (
    <div className={styles.root}>
      <CopyButton text={children} />
      <pre>
        <code>
          {tokens.map((line, i) => {
            const lineKey = `${i}:${line.map((t) => t.content).join("")}`;
            return (
              <span key={lineKey}>
                {i > 0 && "\n"}
                {line.map((token) => {
                  const tokenKey = `${i}:${token.offset}:${token.content}`;
                  return (
                    <span key={tokenKey} style={{ color: token.color }}>
                      {token.content}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
