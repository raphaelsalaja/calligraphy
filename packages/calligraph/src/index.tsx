"use client";

import type { Transition } from "motion/react";
import { NumberRenderer } from "./number";
import { TextRenderer } from "./text";

const animations = {
  default: { duration: 0.38, ease: [0.19, 1, 0.22, 1] },
  smooth: { type: "spring", duration: 0.5, bounce: 0 },
  snappy: { type: "spring", duration: 0.35, bounce: 0.15 },
  bouncy: { type: "spring", duration: 0.5, bounce: 0.3 },
} satisfies Record<string, Transition>;

type Animation = keyof typeof animations;

export type CalligraphProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  children?: string | number;
  variant?: "text" | "number";
  animation?: Animation;
  as?: React.ElementType;
  drift?: { x?: number; y?: number };
  stagger?: number;
  initial?: boolean;
  onComplete?: () => void;
};

/**
 * Calligraph — {@link https://calligraph.raphaelsalaja.com | Documentation}
 *
 * Fluid text and number transitions powered by Motion.
 *
 * @param props.variant - `"text"` for LCS character diffing, `"number"` for
 * rolling vertical digits. Defaults to `"text"`.
 *
 * @param props.animation - Spring preset: `"smooth"`, `"snappy"`, or
 * `"bouncy"`. Defaults to `"smooth"` for text, `"snappy"` for number.
 *
 * @param props.as - Wrapper element type. Defaults to `"span"`.
 *
 * @param props.drift - Maximum spread in pixels for entering/exiting
 * characters. `{ x, y }` — scaled by the fraction of characters that changed.
 * Only applies to `variant="text"`. Defaults to `{ x: 15, y: 0 }`.
 *
 * @param props.stagger - Seconds of delay spread across characters.
 * Defaults to `0.02`.
 *
 * @param props.initial - When `true`, characters animate in on first mount.
 * Defaults to `false`.
 *
 * @param props.onComplete - Fired when the last character finishes animating.
 */
export function Calligraph(props: CalligraphProps) {
  const {
    children,
    variant = "text",
    animation,
    as: Component = "span",
    drift: { x: driftX = 15, y: driftY = 0 } = {},
    stagger = 0.02,
    initial: animateInitial = false,
    onComplete,
    className,
    style,
    ...rest
  } = props;

  const transition =
    animations[animation ?? (variant === "number" ? "snappy" : "default")];

  if (variant === "number") {
    return (
      <NumberRenderer
        text={String(children ?? "")}
        Component={Component}
        transition={transition}
        stagger={stagger}
        animateInitial={animateInitial}
        onComplete={onComplete}
        className={className}
        style={style}
        rest={rest}
      />
    );
  }

  return (
    <TextRenderer
      text={String(children ?? "")}
      Component={Component}
      transition={transition}
      driftX={driftX}
      driftY={driftY}
      stagger={stagger}
      animateInitial={animateInitial}
      onComplete={onComplete}
      className={className}
      style={style}
      rest={rest}
    />
  );
}
