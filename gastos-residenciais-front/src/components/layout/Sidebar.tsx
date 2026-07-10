import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ArrowLeftRight, Wallet } from "lucide-react";

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

export function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        backgroundColor: "var(--cor-sidebar-fundo)",
        color: "var(--cor-sidebar-texto)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "0 24px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: "var(--cor-primaria)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
  );
}
