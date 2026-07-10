const CHAVE_TOKEN = "gastos_residenciais_token";
const CHAVE_NOME = "gastos_residenciais_nome";

export const authStorage = {
  salvar(token: string, nome: string) {
    localStorage.setItem(CHAVE_TOKEN, token);
    localStorage.setItem(CHAVE_NOME, nome);
  },
  obterToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  },
  obterNome(): string | null {
    return localStorage.getItem(CHAVE_NOME);
  },
  limpar() {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_NOME);
  },
  estaAutenticado(): boolean {
    return this.obterToken() !== null;
  },
};
