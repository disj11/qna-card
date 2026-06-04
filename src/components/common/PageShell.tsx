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
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.background} ${className}`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

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
