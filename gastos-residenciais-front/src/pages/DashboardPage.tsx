/**
 * Página inicial do sistema (rota /dashboard).
 *
 *
 * Dispara, dentro de um useEffect, as chamadas a pessoasService, transacoesService e totaisService em paralelo com Promise.all,
 *
 * guarda o resultado em useState e distribui os dados para
 * os componentes visuais do dashboard:
 *
 *  CardsResumo, GraficoGastosPorPessoa,
 * GraficoPorCategoria e UltimasTransacoes.
 *
 *  Também usa useEhTablet para decidir se os
 * dois gráficos ficam lado a lado ou empilhados.
 *
 */

import { useEffect, useState, useCallback } from "react";
import { pessoasService } from "../services/pessoasService";
import { transacoesService } from "../services/transacoesService";
import { totaisService } from "../services/totaisService";
import { CardsResumo } from "../components/dashboard/CardsResumo";
import { GraficoGastosPorPessoa } from "../components/dashboard/GraficoGastosPorPessoa";
import { GraficoPorCategoria } from "../components/dashboard/GraficoPorCategoria";
import { UltimasTransacoes } from "../components/dashboard/UltimasTransacoes";
import { useEhTablet } from "../hooks/useMediaQuery";
import type { Pessoa } from "../types/pessoa";
import type { Transacao } from "../types/transacao";
import type { RelatorioTotais } from "../types/totais";

export function DashboardPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [totais, setTotais] = useState<RelatorioTotais | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Abaixo de 768px os dois gráficos empilham em vez de dividir a largura.
  const ehTablet = useEhTablet();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [pessoasDados, transacoesDados, totaisDados] = await Promise.all([
        pessoasService.listar(),
        transacoesService.listar(),
        totaisService.obter(),
      ]);
      setPessoas(pessoasDados);
      setTransacoes(transacoesDados);
      setTotais(totaisDados);
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : "Erro ao carregar o dashboard.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) return <p>Carregando dashboard...</p>;
  if (erro) return <p style={{ color: "var(--cor-erro)" }}>{erro}</p>;
  if (!totais) return null;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: "var(--cor-texto-secundario)", marginBottom: 24 }}>
        Visão geral do controle financeiro da sua residência.
      </p>

      <CardsResumo
        totalPessoas={pessoas.length}
        totalTransacoes={transacoes.length}
        totalDespesas={totais.totalGeral.totalDespesas}
        totalReceitas={totais.totalGeral.totalReceitas}
      />

      <div
        style={{
          display: "flex",
          flexDirection: ehTablet ? "column" : "row",
          gap: 16,
          marginBottom: 16,
          alignItems: "stretch",
        }}
      >
        <div style={{ flex: ehTablet ? "unset" : 2, minWidth: 0 }}>
          <GraficoGastosPorPessoa dados={totais.pessoas} />
        </div>
        <div style={{ flex: ehTablet ? "unset" : 1, minWidth: 0 }}>
          <GraficoPorCategoria transacoes={transacoes} />
        </div>
      </div>

      <UltimasTransacoes transacoes={transacoes} pessoas={pessoas} />
    </div>
  );
}
