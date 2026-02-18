import type { Transition } from "motion/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
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
      pairs.push([i - 1, j - 1]);
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

  pairs.reverse();
  return pairs;
}

export function TextRenderer({
  text,
  Component,
  transition,
  driftX,
  driftY,
  animateInitial,
  onComplete,
  className,
  style,
  rest,
}: {
  text: string;
  Component: React.ElementType;
  transition: Transition;
  driftX: number;
  driftY: number;
  stagger: number;
  animateInitial: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  rest: Record<string, unknown>;
}) {
  const nextIdRef = useRef(text.length);
  const [prevText, setPrevText] = useState(text);
  const [charKeys, setCharKeys] = useState<string[]>(() =>
    text.split("").map((_, i) => `c${i}`),
  );
  const [changeRatio, setChangeRatio] = useState(0);

  if (text !== prevText) {
    const matches = computeLCS(prevText, text);
    const newKeys: string[] = new Array(text.length).fill("");

    for (const [oldIdx, newIdx] of matches) {
      newKeys[newIdx] = charKeys[oldIdx];
    }

    let newCount = 0;
    for (let i = 0; i < newKeys.length; i++) {
      if (!newKeys[i]) {
        newKeys[i] = `c${nextIdRef.current++}`;
        newCount++;
      }
    }
    setPrevText(text);
    setCharKeys(newKeys);
    setChangeRatio(text.length > 0 ? newCount / text.length : 1);
  }

  return (
    <MotionConfig transition={transition}>
      <Component
        aria-label={text}
        style={{ display: "inline-flex", ...style }}
        className={className}
        {...rest}
      >
        <AnimatePresence mode="popLayout" initial={animateInitial}>
          {text.split("").map((char: string, i: number) => {
            const key = charKeys[i];
            const progress = text.length <= 1 ? 0 : i / (text.length - 1);
            const offsetX = (progress - 0.5) * driftX * changeRatio;
            const offsetY = (progress - 0.5) * driftY * changeRatio;
            const isLast = i === text.length - 1;

            return (
              <motion.span
                key={key}
                aria-hidden="true"
                layout="position"
                initial={{ opacity: 0, x: offsetX, y: offsetY }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: offsetX, y: offsetY }}
                onAnimationComplete={
                  isLast && onComplete ? onComplete : undefined
                }
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </Component>
    </MotionConfig>
  );
}
