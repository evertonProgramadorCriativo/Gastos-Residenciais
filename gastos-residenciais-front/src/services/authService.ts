import { apiPost } from "../lib/api";
import type { LoginInput, RegistrarInput, AuthResposta } from "../types/auth";

export const authService = {
  login: (dados: LoginInput) => apiPost<AuthResposta>("/auth/login", dados),
  registrar: (dados: RegistrarInput) =>
    apiPost<AuthResposta>("/auth/registrar", dados),
};
