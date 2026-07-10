import type { CategoriaTransacao } from "../types/transacao";

export const CATEGORIA_LABEL: Record<CategoriaTransacao, string> = {
  Alimentacao: "Alimentação",
  Moradia: "Moradia",
  Transporte: "Transporte",
  Saude: "Saúde",
  Salario: "Salário",
  Lazer: "Lazer",
  Educacao: "Educação",
  Outros: "Outros",
};

export const CATEGORIA_COR: Record<CategoriaTransacao, string> = {
  Alimentacao: "#2563eb",
  Moradia: "#16a34a",
  Transporte: "#0ea5e9",
  Saude: "#f59e0b",
  Salario: "#8b5cf6",
  Lazer: "#ec4899",
  Educacao: "#14b8a6",
  Outros: "#64748b",
};
