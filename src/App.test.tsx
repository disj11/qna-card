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
  it("renders the main menu", () => {
    renderApp("/qna-card/");

    expect(
      screen.getByRole("heading", { name: /아이스브레이킹 게임/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /질문카드 선택/i })
    ).toBeInTheDocument();
  });

  it("shows a friendly not found screen for unknown routes", () => {
    renderApp("/qna-card/unknown");

    expect(
      screen.getByRole("heading", { name: /페이지를 찾을 수 없습니다/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /메인 메뉴로 돌아가기/i })
    ).toBeInTheDocument();
  });

  it("shows a friendly not found screen for unknown game ids", () => {
    renderApp("/qna-card/game/not-real");

    expect(
      screen.getByRole("heading", { name: /잘못된 게임 주소입니다/i })
    ).toBeInTheDocument();
  });
});
