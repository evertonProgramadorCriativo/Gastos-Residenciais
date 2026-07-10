import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
