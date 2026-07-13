/*
Menu lateral de navegação com os links para Dashboard, 
Pessoas e Transações (usando NavLink para destacar a rota ativa).

Em telas de tablet/mobile
 funciona como um drawer que abre/fecha
  (controlado pelo AppLayout via props
 aberto/onFechar).

*/

import type { CSSProperties } from "react";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Wallet,
  X,
} from "lucide-react";
import { useEhTablet } from "../../hooks/useMediaQuery";

const itensMenu = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icone: <LayoutDashboard size={18} />,
  },
  {
    path: "/pessoas",
    label: "Pessoas",
    icone: <Users size={18} />,
  },
  {
    path: "/transacoes",
    label: "Transações",
    icone: <ArrowLeftRight size={18} />,
  },
];

interface SidebarProps {
  /** Se o menu está aberto. Só tem efeito visual em telas <= 768px. */
  aberto: boolean;
  /** Chamado ao fechar o drawer (clique no overlay, no X, ou troca de rota). */
  onFechar: () => void;
}

export function Sidebar({ aberto, onFechar }: SidebarProps) {
  const ehTablet = useEhTablet();
  const location = useLocation();

  // Fecha o drawer automaticamente sempre que a rota muda (mobile/tablet).
  // Em desktop isso não tem efeito visual, já que a sidebar não usa "aberto".
  useEffect(() => {
    onFechar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const estiloAside: CSSProperties = ehTablet
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "min(260px, 82vw)",
        transform: aberto ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        zIndex: 60,
        boxShadow: aberto ? "4px 0 24px rgba(0,0,0,0.25)" : "none",
      }
    : {
        width: "var(--sidebar-width)",
        minHeight: "100vh",
      };

  return (
    <>
      {/* Overlay escuro atrás do drawer, só em tablet/mobile e com menu aberto */}
      {ehTablet && aberto && (
        <div
          onClick={onFechar}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            zIndex: 55,
          }}
        />
      )}

      <aside
        style={{
          ...estiloAside,
          backgroundColor: "var(--cor-sidebar-fundo)",
          color: "var(--cor-sidebar-texto)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "0 24px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "var(--cor-primaria)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Wallet size={20} color="white" />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--cor-sidebar-texto-ativo)",
                  fontSize: 15,
                }}
              >
                Gastos
              </div>

              <div style={{ fontSize: 12, opacity: 0.7 }}>Residenciais</div>
            </div>
          </div>

          {/* Botão de fechar só faz sentido no drawer mobile/tablet */}
          {ehTablet && (
            <button
              onClick={onFechar}
              aria-label="Fechar menu"
              style={{
                background: "none",
                border: "none",
                color: "var(--cor-sidebar-texto)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "0 12px",
          }}
        >
          {itensMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: "var(--raio-borda)",
                textDecoration: "none",
                color: isActive
                  ? "var(--cor-sidebar-texto-ativo)"
                  : "var(--cor-sidebar-texto)",
                backgroundColor: isActive
                  ? "var(--cor-sidebar-item-ativo)"
                  : "transparent",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s ease",
              })}
            >
              {item.icone}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
