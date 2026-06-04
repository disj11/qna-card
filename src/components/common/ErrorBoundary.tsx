import { Component, type ReactNode, type ErrorInfo } from "react";
import Button from "./Button";
import GlassPanel from "./GlassPanel";
import PageShell from "./PageShell";

interface Props {
  children: ReactNode;
  /** 에러 발생 시 대체 UI */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * React 컴포넌트 트리에서 발생한 JavaScript 에러를 캐치하고 대체 UI를 표시합니다.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/qna-card/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <PageShell centered>
          <GlassPanel size="lg" className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              앗! 문제가 발생했습니다
            </h1>
            <p className="text-white/80 mb-6">
              예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-white/60 text-sm cursor-pointer hover:text-white/80">
                  기술적인 정보 보기
                </summary>
                <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-white/70 overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="space-y-3">
              <Button onClick={this.handleReset} variant="primary" fullWidth>
                메인 화면으로 돌아가기
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                fullWidth
              >
                페이지 새로고침
              </Button>
            </div>
          </GlassPanel>
        </PageShell>
      );
    }

    return this.props.children;
  }
}
