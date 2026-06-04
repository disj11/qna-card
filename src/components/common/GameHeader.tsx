import type { ReactNode } from "react";
import Button from "./Button";

interface GameHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  meta?: ReactNode;
}

export default function GameHeader({
  title,
  description,
  icon,
  onBack,
  backLabel = "돌아가기",
  meta,
}: GameHeaderProps) {
  return (
    <header className="space-y-8">
      {(onBack || meta) && (
        <div className="flex items-center justify-between gap-4">
          {onBack ? (
            <Button type="button" variant="ghost" onClick={onBack}>
              ← {backLabel}
            </Button>
          ) : (
            <span />
          )}
          {meta}
        </div>
      )}
      <div className="text-center animate-slide-up">
        {icon && (
          <div className="text-7xl sm:text-8xl mb-6" aria-hidden="true">
            {icon}
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-white/80 text-lg sm:text-xl">{description}</p>
        )}
      </div>
    </header>
  );
}
