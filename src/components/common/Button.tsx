import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** 버튼 내용 */
    children: ReactNode;
    /** 버튼 스타일 변형 */
    variant?: "primary" | "secondary" | "danger" | "ghost";
    /** 버튼 크기 */
    size?: "sm" | "md" | "lg";
    /** 전체 너비 여부 */
    fullWidth?: boolean;
    /** 로딩 상태 */
    isLoading?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 */
export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    isLoading = false,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary:
            "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-400 shadow-lg hover:shadow-xl",
        secondary:
            "bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm border border-white/20",
        danger:
            "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 focus:ring-red-400 shadow-lg hover:shadow-xl",
        ghost:
            "text-white/80 hover:text-white hover:bg-white/10 focus:ring-white/30",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
            disabled={disabled || isLoading}
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
    );
}
