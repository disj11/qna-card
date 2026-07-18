import type { ReactNode } from "react";
import { themeByTone, type DesignTone } from "../../design-system/tokens";

interface PageShellProps {
  children: ReactNode;
  tone?: DesignTone;
  centered?: boolean;
  className?: string;
}

export default function PageShell({
  children,
  tone = "brand",
  centered = false,
  className = "",
}: PageShellProps) {
  const theme = themeByTone[tone];

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
