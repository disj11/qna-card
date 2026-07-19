import type { ReactNode } from "react";
import Button from "./Button";
import GlassPanel from "./GlassPanel";
import TextInput from "./TextInput";

interface SetupFormProps {
  icon?: ReactNode;
  title: string;
  description: string;
  nickname: string;
  onNicknameChange: (value: string) => void;
  roomId?: string;
  onRoomIdChange?: (value: string) => void;
  primaryLabel: string;
  isLoading?: boolean;
  error?: string | null;
  onSubmit: () => void;
  onBack: () => void;
}

export default function SetupForm({
  icon,
  title,
  description,
  nickname,
  onNicknameChange,
  roomId,
  onRoomIdChange,
  primaryLabel,
  isLoading = false,
  error,
  onSubmit,
  onBack,
}: SetupFormProps) {
  const canSubmit = Boolean(
    nickname.trim() && (!onRoomIdChange || roomId?.trim())
  );

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && canSubmit) {
      onSubmit();
    }
  };

  return (
    <GlassPanel size="lg" className="max-w-md w-full">
      <div className="text-center mb-8">
        {icon && (
          <div className="text-6xl mb-4" aria-hidden="true">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/70">{description}</p>
      </div>

      <div className="space-y-4">
        <TextInput
          label="닉네임"
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
          onKeyDown={handleEnter}
          placeholder="닉네임"
          maxLength={20}
          autoComplete="nickname"
        />
        {onRoomIdChange && (
          <TextInput
            label="방 코드"
            value={roomId ?? ""}
            onChange={(event) => onRoomIdChange(event.target.value)}
            onKeyDown={handleEnter}
            placeholder="방 코드"
            maxLength={20}
            className="font-mono text-center text-xl uppercase"
            autoComplete="off"
          />
        )}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          isLoading={isLoading}
          fullWidth
          size="lg"
          disabledReason={!canSubmit ? "필수 정보를 입력해주세요" : undefined}
        >
          {primaryLabel}
        </Button>
        <Button type="button" onClick={onBack} variant="secondary" fullWidth>
          뒤로
        </Button>
      </div>

      {error && (
        <div
          className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-3"
          role="alert"
        >
          <p className="text-red-200 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}
    </GlassPanel>
  );
}
