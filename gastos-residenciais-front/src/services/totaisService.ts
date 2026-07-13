/*
Camada fina de serviço que busca o 
relatório consolidado de totais

(receitas, despesas e saldo por pessoa e geral)
  na rota /totais, delegando a
 requisição para apiGet (lib/api.ts). 
 
 Consumido pela DashboardPage.
 
 */

import { apiGet } from "../lib/api";
import type { RelatorioTotais } from "../types/totais";

export const totaisService = {
  obter: () => apiGet<RelatorioTotais>("/totais"),
};
