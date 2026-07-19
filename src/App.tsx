import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import Menu from "./pages/Menu";
import SoloPreviewPage from "./features/solo-preview/SoloPreviewPage";
import TogetherPage from "./features/together/TogetherPage";
import MultiplayerPage from "./features/multiplayer/MultiplayerPage";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";

function App() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Menu />} />
        <Route
          path="/together"
          element={<TogetherPage onBack={() => navigate("/start")} />}
        />
        <Route
          path="/solo"
          element={<SoloPreviewPage onBack={() => navigate("/start")} />}
        />
        <Route
          path="/remote"
          element={<MultiplayerPage onBack={() => navigate("/start")} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
