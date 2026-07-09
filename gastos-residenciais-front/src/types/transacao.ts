export type TipoTransacao = "Receita" | "Despesa";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
  pessoaId: string;
}

export interface CriarTransacaoInput {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string;
  pessoaId: string;
}
