import type { ReactNode } from "react";
import {
  feedbackToneStyles,
  radius,
  type FeedbackTone,
} from "../design-system/tokens";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: FeedbackTone;
  className?: string;
}

export default function StatusBadge({
  children,
  tone = "info",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2.5 py-1 text-xs font-semibold ${radius.pill} ${feedbackToneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
