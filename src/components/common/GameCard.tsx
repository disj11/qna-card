import type { ButtonHTMLAttributes, ReactNode } from "react";
import { focusRing, motion, radius } from "../../design-system/tokens";

interface GameCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  meta?: ReactNode;
  isSelected?: boolean;
}

export default function GameCard({
  icon,
  title,
  description,
  gradient = "from-purple-500 to-pink-500",
  meta,
  isSelected = false,
  className = "",
  ...props
}: GameCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`group relative text-left ${focusRing} focus-visible:ring-purple-300 ${className}`}
      {...props}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${radius.panel} p-8 shadow-2xl ${motion.lift} ${
          isSelected ? "ring-2 ring-white/80" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform duration-300 motion-reduce:transform-none">
            {icon}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
          <p className="text-sm sm:text-base text-white/80">{description}</p>
          {meta}
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-tr-full rounded-bl-2xl"></div>
      </div>
    </button>
  );
}
