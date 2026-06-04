import type { ReactNode } from "react";
import Button from "./Button";
import GlassPanel from "./GlassPanel";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <GlassPanel size="lg" className="max-w-md w-full text-center">
      {icon && (
        <div className="text-6xl mb-4" aria-hidden="true">
          {icon}
        </div>
      )}
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-white/70 mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} fullWidth>
          {actionLabel}
        </Button>
      )}
    </GlassPanel>
  );
}
