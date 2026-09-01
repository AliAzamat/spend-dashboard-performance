// An in-house design-system primitive. One place that owns how a labeled,
// colored token looks and BEHAVES — so every chip in the product is consistent,
// accessible, and themeable from tokens instead of scattered ad-hoc spans.
import type { ReactNode } from "react";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

interface ChipProps {
  tone?: Tone;
  children: ReactNode;
  // An accessible label when the visible text is an abbreviation or glyph.
  // If the visible children are already descriptive, this is optional.
  srLabel?: string;
}

// Tones map to CSS custom properties, not raw hex. Theming/contrast is tuned
// once in the token layer; components never hardcode a color.
const toneClass: Record<Tone, string> = {
  neutral: "chip--neutral",
  info: "chip--info",
  success: "chip--success",
  warning: "chip--warning",
  danger: "chip--danger",
};

export function Chip({ tone = "neutral", children, srLabel }: ChipProps) {
  return (
    <span
      className={`chip ${toneClass[tone]}`}
      // role=status is wrong for a static label; a plain span with an optional
      // aria-label is correct. Screen readers read the label if present, else
      // the visible text.
      aria-label={srLabel}
    >
      {children}
    </span>
  );
}
