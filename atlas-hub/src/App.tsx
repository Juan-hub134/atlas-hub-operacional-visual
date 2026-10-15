import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import ConvitesPage from "./pages/ConvitesPage";
import PainelPage from "./pages/PainelPage";
import TreinamentosPage from "./pages/TreinamentosPage";
import DocumentosPage from "./pages/DocumentosPage";
import FinanceiroPage from "./pages/FinanceiroPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/treinamentos" element={<TreinamentosPage />} />
          <Route path="/documentos" element={<DocumentosPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/convites" element={<ConvitesPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
