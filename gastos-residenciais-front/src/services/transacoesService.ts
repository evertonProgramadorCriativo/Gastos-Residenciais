import { apiGet, apiPost, apiDelete } from "../lib/api";
import type { Transacao, CriarTransacaoInput } from "../types/transacao";

export const transacoesService = {
  listar: () => apiGet<Transacao[]>("/transacoes"),
  listarPorPessoa: (pessoaId: string) =>
    apiGet<Transacao[]>(`/pessoas/${pessoaId}/transacoes`),
  criar: (dados: CriarTransacaoInput) =>
    apiPost<Transacao>("/transacoes", dados),
  deletar: (id: string) => apiDelete(`/transacoes/${id}`),
};
