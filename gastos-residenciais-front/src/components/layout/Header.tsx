import { FiSearch } from "react-icons/fi";

interface HeaderProps {
  nomeUsuario?: string;
}

export function Header({ nomeUsuario }: HeaderProps) {
  return (
    <header
      style={{
        height: 64,
        backgroundColor: "var(--cor-card-fundo)",
        borderBottom: "1px solid var(--cor-borda)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 320,
        }}
      >
        <FiSearch
          size={18}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#888",
          }}
        />

        <input
          type="text"
          placeholder="Buscar no sistema..."
          style={{
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            padding: "8px 12px 8px 38px",
            width: "100%",
            fontSize: 14,
          }}
        />
      </div>

      {nomeUsuario && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "var(--cor-primaria)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {nomeUsuario
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{nomeUsuario}</span>
        </div>
      )}
    </header>
  );
}
