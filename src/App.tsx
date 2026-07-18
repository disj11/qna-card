import { Routes, Route, useNavigate } from "react-router-dom";
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
        <Route path="/" element={<Menu />} />
        <Route
          path="/together"
          element={<TogetherPage onBack={() => navigate("/")} />}
        />
        <Route
          path="/solo"
          element={<SoloPreviewPage onBack={() => navigate("/")} />}
        />
        <Route
          path="/remote"
          element={<MultiplayerPage onBack={() => navigate("/")} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
