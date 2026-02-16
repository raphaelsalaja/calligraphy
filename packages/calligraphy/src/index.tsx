"use client";

import {
  AnimatePresence,
  type HTMLMotionProps,
  MotionConfig,
  motion,
} from "motion/react";
import { useRef, useState } from "react";

function computeLCS(oldStr: string, newStr: string): [number, number][] {
  const m = oldStr.length;
  const n = newStr.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (oldStr[i - 1] === newStr[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const pairs: [number, number][] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (oldStr[i - 1] === newStr[j - 1]) {
      pairs.unshift([i - 1, j - 1]);
      i--;
      j--;
    } else if (
      dp[i - 1][j] > dp[i][j - 1] ||
      (dp[i - 1][j] === dp[i][j - 1] && i >= j)
    ) {
      i--;
    } else {
      j--;
    }
  }

  return pairs;
}

type CalligraphyProps = HTMLMotionProps<"span"> & {
  drift?: number;
};

/**
 * Calligraphy - {@link https://calligraphy.raphaelsalaja.com | Documentation}
 *
 * Animates text changes at the character level.
 *
 * @remarks
 * When `children` changes, characters common to both strings
 * reposition via layout animation while new characters drift in
 * and removed characters drift out.
 *
 *
 * @param props - Accepts all {@link HTMLMotionProps} for a `span` element.
 *
 * @param props.drift - Horizontal spread in pixels for entering/exiting
 * characters. Left-side characters drift in from the left, right-side from
 * the right. Set to `0` to disable. Defaults to `20`.
 *
 * @param props.transition - Custom motion transition. Defaults to
 * `{duration: 0.4, ease: [0.19, 1, 0.22, 1]}`.
 *
 */
export function Calligraphy(props: CalligraphyProps) {
  const { children, transition, drift = 20, className, style, ...rest } = props;

  const text = typeof children === "string" ? children : String(children ?? "");

  const nextIdRef = useRef(text.length);

  const [prevText, setPrevText] = useState(text);

  const [charKeys, setCharKeys] = useState<string[]>(() =>
    text.split("").map((_, i) => `c${i}`),
  );

  if (text !== prevText) {
    const matches = computeLCS(prevText, text);
    const newKeys: string[] = new Array(text.length).fill("");

    for (const [oldIdx, newIdx] of matches) {
      newKeys[newIdx] = charKeys[oldIdx];
    }

    for (let i = 0; i < newKeys.length; i++) {
      if (!newKeys[i]) {
        newKeys[i] = `c${nextIdRef.current++}`;
      }
    }
    setPrevText(text);
    setCharKeys(newKeys);
  }

  return (
    <MotionConfig
      transition={
        transition ?? {
          duration: 0.4,
          ease: [0.19, 1, 0.22, 1],
        }
      }
    >
      <motion.span
        className={className}
        style={{
          display: "inline-flex",
          ...style,
        }}
        {...rest}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {text.split("").map((char: string, i: number) => {
            const key = charKeys[i];

            const progress = text.length <= 1 ? 0 : i / (text.length - 1);

            const offset = (progress - 0.5) * drift;

            return (
              <motion.span
                key={key}
                layout="position"
                initial={{ opacity: 0, x: offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: offset }}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </motion.span>
    </MotionConfig>
  );
}
