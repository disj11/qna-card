import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

const renderApp = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]} basename="/qna-card">
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  it("renders the landing page", () => {
    renderApp("/qna-card/");

    expect(
      screen.getByRole("heading", { name: /질문카드/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /지금 시작하기/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders the mode selection menu", () => {
    renderApp("/qna-card/start");

    expect(
      screen.getByRole("button", { name: /한 기기로 함께 시작/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /혼자 미리보기 시작/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /원거리 함께하기 시작/i })
    ).toBeInTheDocument();
  });

  it("shows a friendly not found screen for unknown routes", () => {
    renderApp("/qna-card/unknown");

    expect(
      screen.getByRole("heading", { name: /페이지를 찾을 수 없습니다/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /홈으로 돌아가기/i })
    ).toBeInTheDocument();
  });
});
