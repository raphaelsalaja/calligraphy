"use client";

import { Calligraph } from "calligraph";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useMeasure } from "../../hooks/use-measure";
import styles from "./styles.module.css";

const variants = ["Text", "Number"] as const;
type Variant = (typeof variants)[number];

const animationPresets = ["Default", "Smooth", "Snappy", "Bouncy"] as const;
type AnimationPreset = (typeof animationPresets)[number];

const defaultWords = ["Calligraph", "Craft", "Creative", "Create"];

const defaultPrices = ["35.99", "234.29", "123.45", "3.99", "4423.89"];

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function useListCycle<T>(defaults: T[], parse: (raw: string) => T[]) {
  const [list, setList] = useState(defaults);
  const [input, setInput] = useState(defaults.join(" | "));
  const [current, setCurrent] = useState(defaults[0]);

  const commit = useCallback(() => {
    const parsed = parse(input);
    if (parsed.length > 0) {
      setList(parsed);
      setInput(parsed.join(" | "));
      setCurrent(parsed[0]);
    }
  }, [input, parse]);

  const cycle = useCallback(() => {
    setCurrent((prev) => {
      const idx = list.indexOf(prev);
      return list[(idx + 1) % list.length];
    });
  }, [list]);

  return { list, input, setInput, current, commit, cycle } as const;
}

const parseWords = (raw: string) =>
  raw
    .split("|")
    .map((w) => w.trim())
    .filter(Boolean);

const parsePrices = (raw: string) =>
  raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !Number.isNaN(Number.parseFloat(s)));

function Pill({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.button
      type="button"
      animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
      onClick={onClick}
      className={styles.button}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <div ref={ref} className={styles.wrapper}>
        {children}
      </div>
    </motion.button>
  );
}

function Control({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.control}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

const animationPropMap: Record<AnimationPreset, string | undefined> = {
  Default: undefined,
  Smooth: "smooth",
  Snappy: "snappy",
  Bouncy: "bouncy",
};

export function Demo() {
  const [variant, setVariant] = useState<Variant>("Text");
  const [animation, setAnimation] = useState<AnimationPreset>("Default");

  const words = useListCycle(defaultWords, parseWords);
  const prices = useListCycle(defaultPrices, parsePrices);

  const active = variant === "Text" ? words : prices;
  const animationProp = animationPropMap[animation] as
    | "smooth"
    | "snappy"
    | "bouncy"
    | undefined;

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Pill onClick={active.cycle}>
          {variant === "Text" ? (
            <Calligraph
              variant="text"
              animation={animationProp}
              className={styles.text}
            >
              {words.current}
            </Calligraph>
          ) : (
            <Calligraph
              variant="number"
              animation={animationProp}
              className={styles.text}
            >
              {fmt.format(Number(prices.current))}
            </Calligraph>
          )}
        </Pill>
      </div>

      <div className={styles.footer}>
        <Control label="Variant">
          <div className={styles.tabs} role="tablist">
            {variants.map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={variant === v}
                className={styles.tab}
                data-active={variant === v || undefined}
                onClick={() => setVariant(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </Control>

        <div className={styles.divider} />

        <Control label="Animation">
          <div className={styles.tabs} role="tablist">
            {animationPresets.map((a) => (
              <button
                key={a}
                type="button"
                role="tab"
                aria-selected={animation === a}
                className={styles.tab}
                data-active={animation === a || undefined}
                onClick={() => setAnimation(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </Control>

        <div className={styles.divider} />

        <Control
          label={variant === "Text" ? "Words" : "Numbers"}
          htmlFor="values-input"
        >
          <input
            id="values-input"
            type="text"
            value={active.input}
            onChange={(e) => active.setInput(e.target.value)}
            onBlur={active.commit}
            className={styles.input}
          />
        </Control>
      </div>
    </div>
  );
}
