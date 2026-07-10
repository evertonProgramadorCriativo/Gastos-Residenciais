export type TipoTransacao = "Receita" | "Despesa";

export type CategoriaTransacao =
  | "Alimentacao"
  | "Moradia"
  | "Transporte"
  | "Saude"
  | "Salario"
  | "Lazer"
  | "Educacao"
  | "Outros";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: CategoriaTransacao;
  data: string;
  pessoaId: string;
}

export interface CriarTransacaoInput {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: CategoriaTransacao;
  data: string;
  pessoaId: string;
}
