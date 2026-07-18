import type { InputHTMLAttributes } from "react";
import { focusRing, radius } from "../design-system/tokens";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  error?: string | null;
}

export default function TextInput({
  label,
  helpText,
  error,
  id,
  className = "",
  ...props
}: TextInputProps) {
  const inputId = id ?? props.name ?? label;
  const descriptionId = `${inputId}-description`;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-semibold text-white/80">{label}</span>
      <input
        id={inputId}
        className={`w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 ${radius.control} border border-white/20 ${focusRing} focus-visible:ring-[#D9695A]/60 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={helpText || error ? descriptionId : undefined}
        {...props}
      />
      {(helpText || error) && (
        <span
          id={descriptionId}
          className={`block text-xs ${error ? "text-red-200" : "text-white/60"}`}
        >
          {error ?? helpText}
        </span>
      )}
    </label>
  );
}
