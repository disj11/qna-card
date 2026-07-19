import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export default function NotFound({
  title = "페이지를 찾을 수 없습니다",
  message = "주소를 다시 확인하거나 홈으로 돌아가 주세요.",
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <PageShell centered>
      <EmptyState
        icon="404"
        title={title}
        message={message}
        actionLabel="홈으로 돌아가기"
        onAction={() => navigate("/")}
      />
    </PageShell>
  );
}
