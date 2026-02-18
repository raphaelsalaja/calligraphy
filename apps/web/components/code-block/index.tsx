import styles from "./styles.module.css";

interface CodeBlockProps {
  children: string;
  terminal?: boolean;
}

export function CodeBlock({ children, terminal }: CodeBlockProps) {
  return (
    <div className={styles.root}>
      <pre>
        <code>
          {terminal && <span className={styles.prompt}>$ </span>}
          {children}
        </code>
      </pre>
    </div>
  );
}
