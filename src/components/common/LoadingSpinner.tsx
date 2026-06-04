interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: "sm" | "md" | "lg";
  /** 로딩 메시지 */
  message?: string;
}

/**
 * 로딩 상태를 표시하는 스피너 컴포넌트
 */
export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div
          className={`${sizeStyles[size]} border-4 border-white/20 border-t-white rounded-full animate-spin`}
        />
      </div>
      {message && (
        <p className="text-white/80 text-sm font-medium">{message}</p>
      )}
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}
