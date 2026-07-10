import type { Transacao } from "../../types/transacao";
import { CATEGORIA_LABEL, CATEGORIA_COR } from "../../lib/categorias";
import { formatarMoeda } from "../../lib/formato";

interface GraficoPorCategoriaProps {
  transacoes: Transacao[];
}

export function GraficoPorCategoria({ transacoes }: GraficoPorCategoriaProps) {
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
      cor: CATEGORIA_COR[categoria as keyof typeof CATEGORIA_COR] ?? "#94a3b8",
    }),
  );

  const total = dadosGrafico.reduce((soma, item) => soma + item.valor, 0);

  // Monta o conic-gradient acumulando os percentuais de cada fatia
  let acumulado = 0;
  const fatias = dadosGrafico.map((item) => {
    const percentual = total > 0 ? (item.valor / total) * 100 : 0;
    const inicio = acumulado;
    const fim = acumulado + percentual;
    acumulado = fim;
    return `${item.cor} ${inicio}% ${fim}%`;
  });

  const gradiente =
    fatias.length > 0 ? `conic-gradient(${fatias.join(", ")})` : "transparent";

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <div
              title="Distribuição por categoria"
              style={{
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: gradiente,
                position: "relative",
              }}
            >
              {/* Furo do donut */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "var(--cor-card-fundo)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--cor-texto-secundario)",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                {formatarMoeda(total)}
              </div>
            </div>
          </div>

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
                    backgroundColor: item.cor,
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
