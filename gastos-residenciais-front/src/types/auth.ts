export interface LoginInput {
  email: string;
  senha: string;
}

export interface RegistrarInput {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResposta {
  token: string;
  nome: string;
  email: string;
}
