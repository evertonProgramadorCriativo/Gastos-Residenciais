import { useEffect, useState, useCallback } from "react";
import { totaisService } from "../services/totaisService";
import { DashboardTotais } from "../components/DashboardTotais";
import type { RelatorioTotais } from "../types/totais";

export function DashboardPage() {
  const [totais, setTotais] = useState<RelatorioTotais | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await totaisService.obter();
      setTotais(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar totais.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: "var(--cor-texto-secundario)", marginBottom: 24 }}>
        Visão geral do controle financeiro da sua residência.
      </p>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "var(--cor-erro)" }}>{erro}</p>}
      {!carregando && !erro && totais && <DashboardTotais relatorio={totais} />}
    </div>
  );
}
