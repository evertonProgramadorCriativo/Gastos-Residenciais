import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { pessoasService } from "../../services/pessoasService";
import { FiSearch, FiGrid, FiUsers, FiRepeat } from "react-icons/fi";
import { Menu, X, LogOut } from "lucide-react";
import { useEhTablet, useEhMobile } from "../../hooks/useMediaQuery";
import type { Pessoa } from "../../types/pessoa";

// Páginas fixas do sistema — sempre aparecem na busca (filtradas pelo texto digitado)
const PAGINAS = [
  { label: "Dashboard", rota: "/dashboard", icone: FiGrid },
  { label: "Pessoas", rota: "/pessoas", icone: FiUsers },
  { label: "Transações", rota: "/transacoes", icone: FiRepeat },
];

interface HeaderProps {
  /** Abre o drawer da Sidebar (usado apenas em tablet/mobile). */
  onAbrirMenu: () => void;
}

export function Header({ onAbrirMenu }: HeaderProps) {
  const navigate = useNavigate();
  const { nomeUsuario, encerrarSessao } = useAuth();
  const ehTablet = useEhTablet();
  const ehMobile = useEhMobile();

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [busca, setBusca] = useState("");
  const [resultadosAbertos, setResultadosAbertos] = useState(false);
  const [buscaMobileAberta, setBuscaMobileAberta] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega a lista de pessoas uma vez, para poder buscar pelo nome
  useEffect(() => {
    pessoasService
      .listar()
      .then(setPessoas)
      .catch(() => setPessoas([]));
  }, []);

  // Fecha o dropdown (versão desktop) ao clicar fora dele
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResultadosAbertos(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const termo = busca.trim().toLowerCase();

  const paginasFiltradas = termo
    ? PAGINAS.filter((p) => p.label.toLowerCase().includes(termo))
    : PAGINAS;

  const pessoasFiltradas = termo
    ? pessoas.filter((p) => p.nome.toLowerCase().includes(termo))
    : pessoas.slice(0, 5); // sem termo digitado, mostra só as 5 primeiras

  const temResultados =
    paginasFiltradas.length > 0 || pessoasFiltradas.length > 0;

  const handleSair = () => {
    encerrarSessao();
    navigate("/login", { replace: true });
  };

  const irParaPagina = (rota: string) => {
    navigate(rota);
    setBusca("");
    setResultadosAbertos(false);
    setBuscaMobileAberta(false);
  };

  const irParaTransacoesDaPessoa = (pessoaId: string) => {
    navigate(`/transacoes?pessoaId=${pessoaId}`);
    setBusca("");
    setResultadosAbertos(false);
    setBuscaMobileAberta(false);
  };

  // Lista de resultados reaproveitada tanto no dropdown desktop
  // quanto no overlay de busca mobile.
  const ListaResultados = () => (
    <>
      {!temResultados && (
        <p
          style={{
            padding: 16,
            fontSize: 13,
            color: "var(--cor-texto-secundario)",
          }}
        >
          Nada encontrado para "{busca}".
        </p>
      )}

      {paginasFiltradas.length > 0 && (
        <div>
          <span
            style={{
              display: "block",
              padding: "10px 14px 4px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--cor-texto-secundario)",
              textTransform: "uppercase",
            }}
          >
            Páginas
          </span>
          {paginasFiltradas.map((pagina) => {
            const Icone = pagina.icone;
            return (
              <button
                key={pagina.rota}
                onClick={() => irParaPagina(pagina.rota)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--cor-fundo)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Icone size={16} color="var(--cor-texto-secundario)" />
                {pagina.label}
              </button>
            );
          })}
        </div>
      )}

      {pessoasFiltradas.length > 0 && (
        <div>
          <span
            style={{
              display: "block",
              padding: "10px 14px 4px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--cor-texto-secundario)",
              textTransform: "uppercase",
            }}
          >
            Pessoas
          </span>
          {pessoasFiltradas.map((pessoa) => (
            <button
              key={pessoa.id}
              onClick={() => irParaTransacoesDaPessoa(pessoa.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 14,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--cor-fundo)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "var(--cor-primaria)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {pessoa.nome[0]?.toUpperCase()}
              </span>
              <span style={{ flex: 1 }}>{pessoa.nome}</span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--cor-texto-secundario)",
                }}
              >
                ver transações
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "var(--cor-card-fundo)",
        borderBottom: "1px solid var(--cor-borda)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: ehMobile ? "0 16px" : "0 24px",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Hambúrguer: só aparece em tablet/mobile, abre a Sidebar */}
        {ehTablet && (
          <button
            onClick={onAbrirMenu}
            aria-label="Abrir menu"
            style={{
              background: "none",
              border: "1px solid var(--cor-borda)",
              borderRadius: "var(--raio-borda)",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: "var(--cor-texto)",
            }}
          >
            <Menu size={18} />
          </button>
        )}

        {/* Desktop/tablet largo: busca inline. Em telas <=768px vira ícone. */}
        {!ehTablet ? (
          <div ref={containerRef} style={{ position: "relative", width: 320 }}>
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
              value={busca}
              onFocus={() => setResultadosAbertos(true)}
              onChange={(e) => {
                setBusca(e.target.value);
                setResultadosAbertos(true);
              }}
              style={{
                border: "1px solid var(--cor-borda)",
                borderRadius: "var(--raio-borda)",
                padding: "8px 12px 8px 38px",
                width: "100%",
                fontSize: 14,
              }}
            />

            {resultadosAbertos && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--cor-card-fundo)",
                  border: "1px solid var(--cor-borda)",
                  borderRadius: "var(--raio-borda)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  maxHeight: 320,
                  overflowY: "auto",
                  zIndex: 20,
                }}
              >
                <ListaResultados />
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setBuscaMobileAberta(true)}
            aria-label="Buscar"
            style={{
              background: "none",
              border: "1px solid var(--cor-borda)",
              borderRadius: "var(--raio-borda)",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: "var(--cor-texto)",
            }}
          >
            <FiSearch size={17} />
          </button>
        )}
      </div>

      {nomeUsuario && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
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
              flexShrink: 0,
            }}
          >
            {nomeUsuario
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          {/* Nome completo só cabe a partir do tablet em diante */}
          {!ehMobile && (
            <span style={{ fontSize: 14, fontWeight: 500 }}>{nomeUsuario}</span>
          )}

          {ehMobile ? (
            <button
              onClick={handleSair}
              aria-label="Sair"
              style={{
                background: "none",
                border: "1px solid var(--cor-borda)",
                borderRadius: "var(--raio-borda)",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--cor-texto-secundario)",
              }}
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              onClick={handleSair}
              style={{
                background: "none",
                border: "1px solid var(--cor-borda)",
                borderRadius: "var(--raio-borda)",
                padding: "6px 12px",
                fontSize: 13,
                cursor: "pointer",
                color: "var(--cor-texto-secundario)",
              }}
            >
              Sair
            </button>
          )}
        </div>
      )}

      {/* Overlay de busca em tela cheia — só em tablet/mobile */}
      {ehTablet && buscaMobileAberta && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "var(--cor-card-fundo)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 16,
              borderBottom: "1px solid var(--cor-borda)",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
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
                autoFocus
                type="text"
                placeholder="Buscar no sistema..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  border: "1px solid var(--cor-borda)",
                  borderRadius: "var(--raio-borda)",
                  padding: "10px 12px 10px 38px",
                  width: "100%",
                  fontSize: 15,
                }}
              />
            </div>

            <button
              onClick={() => {
                setBuscaMobileAberta(false);
                setBusca("");
              }}
              aria-label="Fechar busca"
              style={{
                background: "none",
                border: "1px solid var(--cor-borda)",
                borderRadius: "var(--raio-borda)",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                color: "var(--cor-texto)",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <ListaResultados />
          </div>
        </div>
      )}
    </header>
  );
}
