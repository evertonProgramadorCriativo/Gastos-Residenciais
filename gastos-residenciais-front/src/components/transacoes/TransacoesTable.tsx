import type { Pessoa } from "../../types/pessoa";
import type { Transacao } from "../../types/transacao";
import { CATEGORIA_LABEL, CATEGORIA_COR } from "../../lib/categorias";
import { formatarMoeda } from "../../lib/formato";
import { Avatar } from "../ui/Avatar";
import { Trash2 } from "lucide-react";
import { useEhTabela } from "../../hooks/useMediaQuery";

interface TransacoesTableProps {
  transacoes: Transacao[];
  pessoas: Pessoa[];
  filtroPessoaId: string;
  onMudarFiltro: (pessoaId: string) => void;
  onExcluir: (transacao: Transacao) => void;
}

function nomeDaPessoa(pessoas: Pessoa[], pessoaId: string): string {
  return pessoas.find((p) => p.id === pessoaId)?.nome ?? "—";
}

function Badge({ categoria }: { categoria: Transacao["categoria"] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: "var(--cor-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 999,
        padding: "3px 10px",
        fontSize: 12,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: CATEGORIA_COR[categoria],
          flexShrink: 0,
        }}
      />
      {CATEGORIA_LABEL[categoria]}
    </span>
  );
}

export function TransacoesTable({
  transacoes,
  pessoas,
  filtroPessoaId,
  onMudarFiltro,
  onExcluir,
}: TransacoesTableProps) {
  const ehTabela = useEhTabela();
  const ordenadas = [...transacoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
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
      <div style={{ padding: 16, borderBottom: "1px solid var(--cor-borda)" }}>
        <select
          value={filtroPessoaId}
          onChange={(e) => onMudarFiltro(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            // Em telas estreitas o select vira largura total: mais fácil de tocar
            // e evita ficar minúsculo ao lado de um texto longo selecionado.
            width: ehTabela ? "100%" : "auto",
          }}
        >
          <option value="">Todas as pessoas</option>
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {ordenadas.length === 0 ? (
        <p
          style={{
            padding: 24,
            color: "var(--cor-texto-secundario)",
            fontSize: 14,
          }}
        >
          Nenhuma transação encontrada.
        </p>
      ) : ehTabela ? (
        // Abaixo de 640px: lista de cards em vez de tabela.
        <div>
          {ordenadas.map((t) => (
            <div
              key={t.id}
              style={{
                padding: "14px 16px",
                borderTop: "1px solid var(--cor-borda)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Linha 1: descrição + valor */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.descricao}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    color:
                      t.tipo === "Receita"
                        ? "var(--cor-sucesso)"
                        : "var(--cor-erro)",
                  }}
                >
                  {t.tipo === "Receita" ? "+" : "-"} {formatarMoeda(t.valor)}
                </span>
              </div>

              {/* Linha 2: pessoa + categoria */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    nome={nomeDaPessoa(pessoas, t.pessoaId)}
                    tamanho={22}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--cor-texto-secundario)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {nomeDaPessoa(pessoas, t.pessoaId)}
                  </span>
                </div>
                <Badge categoria={t.categoria} />
              </div>

              {/* Linha 3: data + excluir */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: 12, color: "var(--cor-texto-secundario)" }}
                >
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </span>
                <button
                  title="Excluir"
                  onClick={() => onExcluir(t)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--cor-erro)",
                    padding: 6,
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
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
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>
                Descrição
              </th>
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>Pessoa</th>
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>
                Categoria
              </th>
              <th style={{ padding: "12px 16px", fontWeight: 500 }}>Data</th>
              <th
                style={{
                  padding: "12px 16px",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                Valor
              </th>
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
            {ordenadas.map((t) => (
              <tr
                key={t.id}
                style={{ borderTop: "1px solid var(--cor-borda)" }}
              >
                <td style={{ padding: "12px 16px" }}>{t.descricao}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Avatar
                      nome={nomeDaPessoa(pessoas, t.pessoaId)}
                      tamanho={26}
                    />
                    {nomeDaPessoa(pessoas, t.pessoaId)}
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Badge categoria={t.categoria} />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontWeight: 600,
                    color:
                      t.tipo === "Receita"
                        ? "var(--cor-sucesso)"
                        : "var(--cor-erro)",
                  }}
                >
                  {t.tipo === "Receita" ? "+" : "-"} {formatarMoeda(t.valor)}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button
                    title="Excluir"
                    onClick={() => onExcluir(t)}
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
