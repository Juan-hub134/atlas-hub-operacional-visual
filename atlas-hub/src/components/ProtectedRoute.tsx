import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Só barra a NAVEGAÇÃO. Quem decide acesso de verdade é o backend.
export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.scope)) return <Navigate to="/painel" replace />;
  return <Outlet />;
}
