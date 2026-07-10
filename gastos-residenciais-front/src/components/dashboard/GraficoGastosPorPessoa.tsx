import type { TotalPorPessoa } from "../../types/totais";

interface GraficoGastosPorPessoaProps {
  dados: TotalPorPessoa[];
}

const formatarMoedaCompacta = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export function GraficoGastosPorPessoa({ dados }: GraficoGastosPorPessoaProps) {
  const dadosGrafico = dados.map((p) => ({
    nome: p.nome.split(" ")[0], // só o primeiro nome, pra caber no eixo X
    despesas: p.totalDespesas,
  }));

  const maiorValor = Math.max(...dadosGrafico.map((d) => d.despesas), 0);

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
      <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Gastos por pessoa</h3>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          color: "var(--cor-texto-secundario)",
        }}
      >
        Distribuição dos gastos entre os moradores
      </p>

      {dadosGrafico.length === 0 ? (
        <p style={{ color: "var(--cor-texto-secundario)", fontSize: 14 }}>
          Sem dados ainda.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            height: 260,
            padding: "0 8px",
          }}
        >
          {dadosGrafico.map((item) => {
            const alturaPercentual =
              maiorValor > 0 ? (item.despesas / maiorValor) * 100 : 0;

            return (
              <div
                key={item.nome}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                  gap: 6,
                }}
              >
                <span
                  style={{ fontSize: 11, color: "var(--cor-texto-secundario)" }}
                >
                  {formatarMoedaCompacta(item.despesas)}
                </span>
                <div
                  title={formatarMoedaCompacta(item.despesas)}
                  style={{
                    width: "100%",
                    maxWidth: 48,
                    height: `${Math.max(alturaPercentual, 2)}%`,
                    backgroundColor: "var(--cor-primaria)",
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
                <span style={{ fontSize: 12, marginTop: 4 }}>{item.nome}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
