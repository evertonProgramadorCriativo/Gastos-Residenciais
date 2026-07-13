/*
 Camada fina de serviço para autenticação. 
 
 Só decide quais rotas chamar
  (/auth/login e /auth/registrar),

   delegando a chamada HTTP de fato para
    apiPost (lib/api.ts). Usado pela LoginPage.

*/

import { apiPost } from "../lib/api";
import type { LoginInput, RegistrarInput, AuthResposta } from "../types/auth";

export const authService = {
  login: (dados: LoginInput) => apiPost<AuthResposta>("/auth/login", dados),
  registrar: (dados: RegistrarInput) =>
    apiPost<AuthResposta>("/auth/registrar", dados),
};
