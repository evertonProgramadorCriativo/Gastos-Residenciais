/*
Camada fina de serviço para a entidade Transacao. 

Expõe listar (todas),
listarPorPessoa, 
criar e 
deletar, 

cada método delegando a chamada HTTP real para
hooks  apiGet/ apiPost/ apiDelete/ (lib/api.ts). 
 
 Consumido pela DashboardPage e pela TransacoesPage.


*/

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
