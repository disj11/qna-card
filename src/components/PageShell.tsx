import type { ReactNode } from "react";
import { theme } from "../design-system/tokens";

interface PageShellProps {
  children: ReactNode;
  centered?: boolean;
  className?: string;
}

export default function PageShell({
  children,
  centered = false,
  className = "",
}: PageShellProps) {
  return (
    <div className={`min-h-screen ${theme.background} ${className}`}>
      <div
        className={
          centered
            ? "relative z-10 min-h-screen flex items-center justify-center p-4"
            : "relative z-10"
        }
      >
        {children}
      </div>
    </div>
  );
}
