/**
  Componente simples que recebe um RelatorioTotais via props e 
  
  Desenha uma  tabela com o 
  total de receitas/despesas/saldo por pessoa. 
  
*/

import type { RelatorioTotais } from "../types/totais";
import { formatarMoeda } from "../lib/formato";

interface DashboardTotaisProps {
  relatorio: RelatorioTotais;
}

export function DashboardTotais({ relatorio }: DashboardTotaisProps) {
  const { pessoas, totalGeral } = relatorio;

  if (pessoas.length === 0) {
    return <p>Nenhuma pessoa cadastrada ainda.</p>;
  }

  return (
    <div>
      <h2>Totais por Pessoa</h2>

      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((p) => (
            <tr key={p.pessoaId}>
              <td>{p.nome}</td>
              <td style={{ color: "green" }}>
                {formatarMoeda(p.totalReceitas)}
              </td>
              <td style={{ color: "crimson" }}>
                {formatarMoeda(p.totalDespesas)}
              </td>
              <td
                style={{
                  color: p.saldo >= 0 ? "green" : "crimson",
                  fontWeight: "bold",
                }}
              >
                {formatarMoeda(p.saldo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: "2px solid #333",
          borderRadius: 8,
        }}
      >
        <h3>Total Geral</h3>
        <p>
          Receitas:{" "}
          <strong style={{ color: "green" }}>
            {formatarMoeda(totalGeral.totalReceitas)}
          </strong>
        </p>
        <p>
          Despesas:{" "}
          <strong style={{ color: "crimson" }}>
            {formatarMoeda(totalGeral.totalDespesas)}
          </strong>
        </p>
        <p>
          Saldo Líquido:{" "}
          <strong
            style={{
              color: totalGeral.saldoLiquido >= 0 ? "green" : "crimson",
            }}
          >
            {formatarMoeda(totalGeral.saldoLiquido)}
          </strong>
        </p>
      </div>
    </div>
  );
}
