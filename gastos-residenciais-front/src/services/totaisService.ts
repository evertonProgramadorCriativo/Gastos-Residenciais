import { apiGet } from "../lib/api";
import type { RelatorioTotais } from "../types/totais";

export const totaisService = {
  obter: () => apiGet<RelatorioTotais>("/totais"),
};
