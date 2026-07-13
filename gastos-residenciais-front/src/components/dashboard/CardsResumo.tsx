import type { ReactNode } from "react";
import { formatarMoeda } from "../../lib/formato";
import { Users, ArrowLeftRight, TrendingDown, TrendingUp } from "lucide-react";
import { useContadorAnimado } from "../../hooks/useContadorAnimado";
import "./animacoes.css";
/*
  Renderiza os quatro cards de resumo no topo do dashboard (total de
  pessoas, total de transações, total de despesas e total de receitas), 
  
  cada um com ícone (lucide-react) e valor animado via useContadorAnimado. Recebe os totais prontos via props, sem fazer chamadas de rede.

*/
interface CardsResumoProps {
  totalPessoas: number;
  totalTransacoes: number;
  totalDespesas: number;
  totalReceitas: number;
}

function Card({
  titulo,
  valor,
  formato = "numero",
  subtitulo,
  icone,
  corIcone,
  atraso = 0,
}: {
  titulo: string;
  valor: number;
  formato?: "numero" | "moeda";
  subtitulo: string;
  icone: ReactNode;
  corIcone: string;
  atraso?: number;
}) {
  const valorAnimado = useContadorAnimado(valor);
  const valorExibido =
    formato === "moeda"
      ? formatarMoeda(valorAnimado)
      : Math.round(valorAnimado).toLocaleString("pt-BR");

  return (
    <div
      className="dashboard-card-anim"
      style={{
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 12,
        padding: "var(--espaco-card)",
        boxShadow: "var(--sombra-card)",
        animationDelay: `${atraso}ms`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--cor-texto-secundario)",
            fontWeight: 500,
          }}
        >
          {titulo}
        </span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: corIcone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {icone}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          margin: "8px 0 4px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={valorExibido}
      >
        {valorExibido}
      </div>
      <span style={{ fontSize: 12, color: "var(--cor-texto-secundario)" }}>
        {subtitulo}
      </span>
    </div>
  );
}

export function CardsResumo({
  totalPessoas,
  totalTransacoes,
  totalDespesas,
  totalReceitas,
}: CardsResumoProps) {
  return (
    <div
      style={{
        display: "grid",
        // Cada card tem no mínimo 170px; quantas colunas couberem na
        // largura disponível são geradas automaticamente — sem media
        // query e sem JS. Em telas de celular vira 1 ou 2 colunas sozinho.
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <Card
        titulo="PESSOAS"
        valor={totalPessoas}
        subtitulo="Cadastradas na residência"
        icone={<Users size={18} />}
        corIcone="#dbeafe"
        atraso={0}
      />
      <Card
        titulo="TRANSAÇÕES"
        valor={totalTransacoes}
        subtitulo="No período atual"
        icone={<ArrowLeftRight size={18} />}
        corIcone="#e0e7ff"
        atraso={80}
      />
      <Card
        titulo="TOTAL DE GASTOS"
        valor={totalDespesas}
        formato="moeda"
        subtitulo="Saídas do mês"
        icone={<TrendingDown size={18} />}
        corIcone="#fee2e2"
        atraso={160}
      />
      <Card
        titulo="TOTAL DE ENTRADAS"
        valor={totalReceitas}
        formato="moeda"
        subtitulo="Receitas do mês"
        icone={<TrendingUp size={18} />}
        corIcone="#dcfce7"
        atraso={240}
      />
    </div>
  );
}
