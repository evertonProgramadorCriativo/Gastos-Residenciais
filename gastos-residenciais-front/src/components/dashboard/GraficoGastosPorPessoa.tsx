import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TotalPorPessoa } from "../../types/totais";

interface GraficoGastosPorPessoaProps {
  dados: TotalPorPessoa[];
}

export function GraficoGastosPorPessoa({ dados }: GraficoGastosPorPessoaProps) {
  const dadosGrafico = dados.map((p) => ({
    nome: p.nome.split(" ")[0], // só o primeiro nome, pra caber no eixo X
    despesas: p.totalDespesas,
  }));

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
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--cor-borda)"
            />
            <XAxis dataKey="nome" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(valor: number) =>
                valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <Bar
              dataKey="despesas"
              fill="var(--cor-primaria)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
