import {
  Wallet,
  Users,
  ArrowLeftRight,
  LayoutDashboard,
  X,
} from "lucide-react";

interface BoasVindasModalProps {
  aberto: boolean;
  nomeUsuario: string | null;
  onFechar: () => void;
}

const RECURSOS = [
  {
    icone: LayoutDashboard,
    titulo: "Dashboard",
    descricao:
      "Veja de forma rápida o total de gastos e receitas do condomínio.",
  },
  {
    icone: Users,
    titulo: "Pessoas",
    descricao: "Cadastre os moradores ou responsáveis de cada unidade.",
  },
  {
    icone: ArrowLeftRight,
    titulo: "Transações",
    descricao: "Registre despesas e receitas vinculadas a cada pessoa.",
  },
];

export function BoasVindasModal({
  aberto,
  nomeUsuario,
  onFechar,
}: BoasVindasModalProps) {
  if (!aberto) return null;

  const primeiroNome = nomeUsuario?.split(" ")[0] ?? "";

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "clamp(12px, 4vw, 24px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--cor-card-fundo)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 480,
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            position: "relative",
            padding: "clamp(24px, 6vw, 32px) clamp(20px, 6vw, 32px) 20px",
            background:
              "linear-gradient(135deg, var(--cor-primaria), var(--cor-primaria-hover))",
            borderRadius: "16px 16px 0 0",
            color: "#fff",
          }}
        >
          <button
            onClick={onFechar}
            aria-label="Fechar"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Wallet size={24} color="#fff" />
          </div>

          <h2
            style={{
              margin: "0 0 6px",
              fontSize: "clamp(18px, 5vw, 22px)",
              fontWeight: 700,
            }}
          >
            {primeiroNome ? `Bem-vindo(a), ${primeiroNome}!` : "Bem-vindo(a)!"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              opacity: 0.9,
              lineHeight: 1.5,
            }}
          >
            Você está no Gastos Residenciais, o sistema de controle financeiro
            pensado para o seu condomínio.
          </p>
        </div>

        {/* Corpo */}
        <div style={{ padding: "clamp(20px, 6vw, 32px)" }}>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 14,
              color: "var(--cor-texto-secundario)",
              lineHeight: 1.6,
            }}
          >
            Aqui você organiza receitas e despesas de cada morador ou unidade,
            acompanha o saldo geral e mantém tudo transparente entre os
            responsáveis. Conheça rapidamente o que dá para fazer:
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {RECURSOS.map((recurso) => {
              const Icone = recurso.icone;
              return (
                <div
                  key={recurso.titulo}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: "var(--cor-fundo)",
                      border: "1px solid var(--cor-borda)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icone size={17} color="var(--cor-primaria)" />
                  </span>
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}
                    >
                      {recurso.titulo}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--cor-texto-secundario)",
                        lineHeight: 1.4,
                      }}
                    >
                      {recurso.descricao}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onFechar}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--cor-primaria)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--raio-borda)",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Entendi, vamos começar!
          </button>
        </div>
      </div>
    </div>
  );
}
