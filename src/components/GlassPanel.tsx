import type { HTMLAttributes, ReactNode } from "react";
import { radius, surface } from "../design-system/tokens";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "subtle" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function GlassPanel({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: GlassPanelProps) {
  const variantClass = {
    default: surface.glass,
    subtle: surface.glassSubtle,
    dark: surface.dark,
  }[variant];

  const sizeClass = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }[size];

  return (
    <div
      className={`${variantClass} ${radius.panel} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
