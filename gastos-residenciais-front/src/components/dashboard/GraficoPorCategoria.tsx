import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Transacao } from "../../types/transacao";
import { CATEGORIA_LABEL, CATEGORIA_COR } from "../../lib/categorias";
import { formatarMoeda } from "../../lib/formato";

interface GraficoPorCategoriaProps {
  transacoes: Transacao[];
}

export function GraficoPorCategoria({ transacoes }: GraficoPorCategoriaProps) {
  // Agrupa só as despesas por categoria — receitas não fazem sentido
  // nesse gráfico (ele mostra "onde o dinheiro está indo").
  const totaisPorCategoria = transacoes
    .filter((t) => t.tipo === "Despesa")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] ?? 0) + t.valor;
      return acc;
    }, {});

  const dadosGrafico = Object.entries(totaisPorCategoria).map(
    ([categoria, valor]) => ({
      categoria,
      label:
        CATEGORIA_LABEL[categoria as keyof typeof CATEGORIA_LABEL] ?? categoria,
      valor,
    }),
  );

  return (
    <div
      style={{
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 12,
        padding: 20,
        flex: 1,
        boxShadow: "var(--sombra-card)",
      }}
    >
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Por categoria</h3>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          color: "var(--cor-texto-secundario)",
        }}
      >
        Onde o dinheiro está indo
      </p>

      {dadosGrafico.length === 0 ? (
        <p style={{ color: "var(--cor-texto-secundario)", fontSize: 14 }}>
          Sem despesas ainda.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dadosGrafico}
                dataKey="valor"
                nameKey="label"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {dadosGrafico.map((entry) => (
                  <Cell
                    key={entry.categoria}
                    fill={
                      CATEGORIA_COR[
                        entry.categoria as keyof typeof CATEGORIA_COR
                      ] ?? "#94a3b8"
                    }
                  />
                ))}
              </Pie>
              <Tooltip formatter={(valor: number) => formatarMoeda(valor)} />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 8,
            }}
          >
            {dadosGrafico.map((item) => (
              <div
                key={item.categoria}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      CATEGORIA_COR[
                        item.categoria as keyof typeof CATEGORIA_COR
                      ] ?? "#94a3b8",
                  }}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                <strong>{formatarMoeda(item.valor)}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
