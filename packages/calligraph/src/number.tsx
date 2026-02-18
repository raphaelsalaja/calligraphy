import type { Transition } from "motion/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRef, useState } from "react";

type DigitCustom = { dir: number; delay: number };

const digitVariants = {
  initial: ({ dir }: DigitCustom) => ({
    y: dir > 0 ? "33%" : "-33%",
    opacity: 0,
    scale: 0.5,
    filter: "blur(4px)",
  }),
  animate: ({ delay }: DigitCustom) => ({
    y: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay },
  }),
  exit: ({ dir, delay }: DigitCustom) => ({
    y: dir > 0 ? "-33%" : "33%",
    opacity: 0,
    scale: 0.5,
    filter: "blur(4px)",
    transition: { delay },
  }),
};

export function NumberRenderer({
  text,
  Component,
  transition,
  stagger,
  animateInitial,
  onComplete,
  className,
  style,
  rest,
}: {
  text: string;
  Component: React.ElementType;
  transition: Transition;
  stagger: number;
  animateInitial: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  rest: Record<string, unknown>;
}) {
  const chars = text.split("");

  const nextIdRef = useRef(chars.length);
  const [prevText, setPrevText] = useState(text);
  const [digitKeys, setDigitKeys] = useState<number[]>(() =>
    chars.map((_, i) => i),
  );
  const dirRef = useRef(1);

  if (text !== prevText) {
    const toNum = (s: string) => parseFloat(s.replace(/[^0-9.-]/g, "")) || 0;
    dirRef.current = toNum(text) >= toNum(prevText) ? 1 : -1;

    const oldChars = prevText.split("");
    const maxLen = Math.max(oldChars.length, chars.length);

    const padOld = [
      ...Array<string>(Math.max(0, maxLen - oldChars.length)).fill(""),
      ...oldChars,
    ];
    const padNew = [
      ...Array<string>(Math.max(0, maxLen - chars.length)).fill(""),
      ...chars,
    ];
    const padKeys = [
      ...Array<number>(Math.max(0, maxLen - digitKeys.length)).fill(-1),
      ...digitKeys,
    ];

    const newKeys = padNew.map((c, i) =>
      c === padOld[i] && padKeys[i] >= 0 ? padKeys[i] : nextIdRef.current++,
    );

    setDigitKeys(newKeys.slice(maxLen - chars.length));
    setPrevText(text);
  }

  const dir = dirRef.current;

  return (
    <MotionConfig transition={transition}>
      <Component
        aria-label={text}
        style={{ display: "inline-flex", ...style }}
        className={className}
        {...rest}
      >
        <AnimatePresence mode="popLayout" initial={animateInitial}>
          {chars.map((char, i) => {
            const colIndex = chars.length - 1 - i;
            const delay = i * stagger;
            const isLast = i === chars.length - 1;

            return (
              <motion.span
                key={`col-${colIndex}`}
                layout="position"
                style={{ display: "inline-block" }}
              >
                <AnimatePresence mode="popLayout" initial={animateInitial}>
                  <motion.span
                    key={digitKeys[i]}
                    aria-hidden="true"
                    variants={digitVariants}
                    custom={{ dir, delay }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onAnimationComplete={
                      isLast && onComplete ? onComplete : undefined
                    }
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {char}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            );
          })}
        </AnimatePresence>
      </Component>
    </MotionConfig>
  );
}
