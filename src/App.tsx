import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./pages/Menu";
import QuestionCards from "./pages/QuestionCards";
import QuestionDeck from "./pages/QuestionDeck";
import QuestionCardsMultiplayer from "./pages/QuestionCardsMultiplayer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import NotFound from "./pages/NotFound";

function App() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route
          path="/together"
          element={<QuestionDeck onBack={() => navigate("/")} />}
        />
        <Route
          path="/solo"
          element={<QuestionCards onBack={() => navigate("/")} />}
        />
        <Route
          path="/remote"
          element={<QuestionCardsMultiplayer onBack={() => navigate("/")} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
