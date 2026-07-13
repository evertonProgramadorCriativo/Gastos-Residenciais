/*
Wrapper de rota que verifica, via useAuth(), 
se o usuário está autenticado;
 se não estiver, redireciona para /login com <Navigate>. 
*/

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
