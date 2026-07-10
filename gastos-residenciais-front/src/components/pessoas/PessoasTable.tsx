import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import type { Pessoa } from "../../types/pessoa";
import { Trash2 } from "lucide-react";
import { Search } from "lucide-react";

interface PessoasTableProps {
  pessoas: Pessoa[];
  onExcluir: (pessoa: Pessoa) => void;
}

function idAbreviado(id: string): string {
  return `#${id.slice(0, 8)}`;
}

export function PessoasTable({ pessoas, onExcluir }: PessoasTableProps) {
  const [busca, setBusca] = useState("");

  const pessoasFiltradas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div
      style={{
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 12,
        boxShadow: "var(--sombra-card)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid var(--cor-borda)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 320,
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--cor-texto-secundario)",
            }}
          />

          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid var(--cor-borda)",
              borderRadius: "var(--raio-borda)",
              fontSize: 14,
              outline: "none",
              backgroundColor: "var(--cor-card-fundo)",
            }}
          />
        </div>
      </div>

      {pessoasFiltradas.length === 0 ? (
        <p
          style={{
            padding: 24,
            color: "var(--cor-texto-secundario)",
            fontSize: 14,
          }}
        >
          {busca
            ? "Nenhuma pessoa encontrada para essa busca."
            : "Nenhuma pessoa cadastrada ainda."}
        </p>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                color: "var(--cor-texto-secundario)",
                fontSize: 12,
              }}
            >
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>Nome</th>
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>Idade</th>
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>ID</th>
              <th
                style={{
                  padding: "12px 16px",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {pessoasFiltradas.map((pessoa) => (
              <tr
                key={pessoa.id}
                style={{ borderTop: "1px solid var(--cor-borda)" }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Avatar nome={pessoa.nome} tamanho={32} />
                    {pessoa.nome}
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>{pessoa.idade} anos</td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: "var(--cor-texto-secundario)",
                    fontSize: 13,
                  }}
                >
                  {idAbreviado(pessoa.id)}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    title="Excluir"
                    onClick={() => onExcluir(pessoa)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "var(--cor-erro)",
                      padding: 4,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
