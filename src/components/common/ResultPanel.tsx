import type { ReactNode } from "react";
import Button from "./Button";
import GlassPanel from "./GlassPanel";

interface ResultPanelProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export default function ResultPanel({
  icon,
  title,
  children,
  primaryAction,
  secondaryAction,
}: ResultPanelProps) {
  return (
    <GlassPanel size="lg" className="max-w-md w-full">
      <div className="text-center space-y-6">
        {icon && (
          <div className="text-6xl" aria-hidden="true">
            {icon}
          </div>
        )}
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {children}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col gap-3 pt-2">
            {primaryAction && (
              <Button type="button" onClick={primaryAction.onClick} fullWidth>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                type="button"
                variant="secondary"
                onClick={secondaryAction.onClick}
                fullWidth
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
