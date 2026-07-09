export interface TotalPorPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioTotais {
  pessoas: TotalPorPessoa[];
  totalGeral: TotalGeral;
}
