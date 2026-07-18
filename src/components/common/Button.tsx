import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  focusRing,
  motion,
  themeByTone,
  type DesignTone,
} from "../../design-system/tokens";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 내용 */
  children: ReactNode;
  /** 버튼 스타일 변형 */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** 버튼 크기 */
  size?: "sm" | "md" | "lg";
  /** 버튼 색상 톤 */
  tone?: DesignTone;
  /** 전체 너비 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 선택 상태 */
  isSelected?: boolean;
  /** 비활성화 사유 */
  disabledReason?: string;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  tone = "brand",
  fullWidth = false,
  isLoading = false,
  isSelected = false,
  disabledReason,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const theme = themeByTone[tone];
  const baseStyles = `inline-flex items-center justify-center font-medium rounded-xl ${motion.interactive} ${focusRing} ${theme.focusRing} disabled:opacity-50 disabled:cursor-not-allowed`;

  const variantStyles = {
    primary: `${theme.accent} ${theme.accentText} hover:shadow-lg hover:shadow-black/30`,
    secondary:
      "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/10",
    danger: "bg-red-500/90 text-white hover:bg-red-500",
    ghost: "text-white/70 hover:text-white hover:bg-white/[0.06]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledReasonId =
    disabledReason && props.id ? `${props.id}-reason` : undefined;

  return (
    <span className={`inline-flex flex-col ${widthStyle}`}>
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${
          isSelected ? "ring-2 ring-white/80" : ""
        } ${className}`}
        disabled={disabled || isLoading}
        aria-pressed={isSelected || undefined}
        aria-describedby={disabledReasonId}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            처리 중...
          </>
        ) : (
          children
        )}
      </button>
      {disabledReason && (disabled || isLoading) && (
        <span
          id={disabledReasonId}
          className="mt-2 text-center text-xs text-yellow-200"
        >
          {disabledReason}
        </span>
      )}
    </span>
  );
}
