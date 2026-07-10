import { ReactNode } from "react";
import { formatarMoeda } from "../../lib/formato";
import {
  Users,
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
interface CardsResumoProps {
  totalPessoas: number;
  totalTransacoes: number;
  totalDespesas: number;
  totalReceitas: number;
}

function Card({
  titulo,
  valor,
  subtitulo,
  icone,
  corIcone,
}: {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icone: ReactNode;
  corIcone: string;
}) {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 13, color: "var(--cor-texto-secundario)", fontWeight: 500 }}>
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
          }}
        >
          {icone}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 4px" }}>{valor}</div>
      <span style={{ fontSize: 12, color: "var(--cor-texto-secundario)" }}>{subtitulo}</span>
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
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      <Card
        titulo="PESSOAS"
        valor={totalPessoas}
        subtitulo="Cadastradas na residência"
        icone={<Users size={18} />}
        corIcone="#dbeafe"
      />
      <Card
        titulo="TRANSAÇÕES"
        valor={totalTransacoes}
        subtitulo="No período atual"
        icone={<ArrowLeftRight size={18} />}
        corIcone="#e0e7ff"
      />
      <Card
        titulo="TOTAL DE GASTOS"
        valor={formatarMoeda(totalDespesas)}
        subtitulo="Saídas do mês"
        icone={<TrendingDown size={18} />}
        corIcone="#fee2e2"
      />
      <Card
        titulo="TOTAL DE ENTRADAS"
        valor={formatarMoeda(totalReceitas)}
        subtitulo="Receitas do mês"
        icone={<TrendingUp size={18} />}
        corIcone="#dcfce7"
      />
    </div>
  );
}