import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BoasVindasModal } from "../../modals/BoasVindasModal";
import { useAuth } from "../../contexts/AuthContext";
export function AppLayout() {
  const { nomeUsuario, mostrarBoasVindas, fecharBoasVindas } = useAuth();

  // Controla o drawer da Sidebar em telas de tablet/mobile (<= 768px).
  // Em desktop esse estado é ignorado pela Sidebar.
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header onAbrirMenu={() => setMenuAberto(true)} />
        <main style={{ padding: "var(--espaco-page)", flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <BoasVindasModal
        aberto={mostrarBoasVindas}
        nomeUsuario={nomeUsuario}
        onFechar={fecharBoasVindas}
      />
    </div>
  );
}
