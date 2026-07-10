import type { Transacao } from "../../types/transacao";
import type { Pessoa } from "../../types/pessoa";
import { CATEGORIA_LABEL } from "../../lib/categorias";
import { formatarMoeda } from "../../lib/formato";

interface UltimasTransacoesProps {
  transacoes: Transacao[];
  pessoas: Pessoa[];
}

export function UltimasTransacoes({
  transacoes,
  pessoas,
}: UltimasTransacoesProps) {
  const ultimas = [...transacoes]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const nomeDaPessoa = (pessoaId: string) =>
    pessoas.find((p) => p.id === pessoaId)?.nome ?? "—";

  return (
    <div
      style={{
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "var(--sombra-card)",
      }}
    >
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Últimas transações</h3>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          color: "var(--cor-texto-secundario)",
        }}
      >
        Movimentações mais recentes da residência
      </p>

      {ultimas.length === 0 ? (
        <p style={{ color: "var(--cor-texto-secundario)", fontSize: 14 }}>
          Nenhuma transação ainda.
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
              <th style={{ padding: "8px 0", fontWeight: 500 }}>Descrição</th>
              <th style={{ padding: "8px 0", fontWeight: 500 }}>Pessoa</th>
              <th style={{ padding: "8px 0", fontWeight: 500 }}>Categoria</th>
              <th style={{ padding: "8px 0", fontWeight: 500 }}>Data</th>
              <th
                style={{
                  padding: "8px 0",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {ultimas.map((t) => (
              <tr
                key={t.id}
                style={{ borderTop: "1px solid var(--cor-borda)" }}
              >
                <td style={{ padding: "10px 0" }}>{t.descricao}</td>
                <td style={{ padding: "10px 0" }}>
                  {nomeDaPessoa(t.pessoaId)}
                </td>
                <td style={{ padding: "10px 0" }}>
                  <span
                    style={{
                      backgroundColor: "var(--cor-fundo)",
                      border: "1px solid var(--cor-borda)",
                      borderRadius: 999,
                      padding: "2px 10px",
                      fontSize: 12,
                    }}
                  >
                    {CATEGORIA_LABEL[t.categoria]}
                  </span>
                </td>
                <td style={{ padding: "10px 0" }}>
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </td>
                <td
                  style={{
                    padding: "10px 0",
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
