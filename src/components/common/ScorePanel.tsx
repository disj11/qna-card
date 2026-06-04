import type { ReactNode } from "react";
import GlassPanel from "./GlassPanel";

interface ScorePanelProps {
  label: string;
  value: ReactNode;
  toneClass?: string;
}

export default function ScorePanel({
  label,
  value,
  toneClass = "text-white",
}: ScorePanelProps) {
  return (
    <GlassPanel variant="subtle" size="sm" className="text-center">
      <div className={`text-2xl font-bold ${toneClass}`}>{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </GlassPanel>
  );
}
