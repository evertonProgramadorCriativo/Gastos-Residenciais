import { authStorage } from "./auth";
/**
 * Client HTTP centralizado para comunicação com a API do backend.
 * Este arquivo concentra as funções de requisição da aplicação,
 * evitando repetir fetch em vários lugares do projeto.
 */

// Lê a URL base da API a partir das variáveis de ambiente do Vite.
// Exemplo: http://localhost:8080
const API_URL = import.meta.env.VITE_API_URL;

// Função genérica responsável por tratar a resposta de qualquer requisição HTTP.
// O <T> indica que ela pode retornar qualquer tipo esperado pela chamada.
/**
 * Monta os headers padrão de toda requisição, incluindo o token JWT
 * quando existir. Centralizar aqui evita repetir isso em cada service.
 */
function montarHeaders(extras?: Record<string, string>): HeadersInit {
  const token = authStorage.obterToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extras,
  };
}

async function tratarResposta<T>(response: Response): Promise<T> {
  // 401: token ausente/expirado/inválido. Nesse caso não faz sentido
  // mostrar a mensagem crua da API — desloga e deixa o RotaProtegida
  // (Passo 3) cuidar do redirecionamento para /login.
  // (ex.: status 400, 404, 500 etc.)
  if (response.status === 401) {
    authStorage.limpar();
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  // Verifica se a resposta da API NÃO foi bem-sucedida
  if (!response.ok) {
    // Define uma mensagem padrão de erro usando o status HTTP retornado.
    let mensagem = `Erro na requisição: ${response.status}`;

    try {
      // Tenta converter o corpo da resposta para JSON.
      const corpo = await response.json();

      // Se o backend retornou um objeto com a propriedade "mensagem",
      // usa essa mensagem como erro, pois ela costuma ser mais amigável.
      if (corpo?.mensagem) mensagem = corpo.mensagem;
    } catch {
      // Se der erro ao converter o corpo para JSON,
      // significa que a resposta não veio em JSON.
      // Nesse caso, mantém a mensagem padrão criada acima.
    }

    // Lança um erro com a mensagem final para quem chamou a função tratar.
    throw new Error(mensagem);
  }

  // Se o status for 204 (No Content), significa que a resposta não possui corpo.
  // Isso é comum em requisições DELETE bem-sucedidas.
  if (response.status === 204) {
    // Retorna undefined convertido para o tipo esperado.
    return undefined as T;
  }

  // Se a resposta foi bem-sucedida e possui corpo,
  // converte o JSON retornado para o tipo esperado T.
  return response.json() as Promise<T>;
}

// Função genérica para fazer requisições GET.
// Recebe o caminho da rota (ex.: "/pessoas") e retorna o tipo esperado T.
export async function apiGet<T>(path: string): Promise<T> {
  // Faz a requisição GET para a URL completa da API.
  const response = await fetch(`${API_URL}${path}`, {
    headers: montarHeaders(),
  });

  // Envia a resposta para a função central de tratamento.
  return tratarResposta<T>(response);
}

// Função genérica para fazer requisições POST.
// Recebe a rota e o objeto que será enviado no corpo da requisição.
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  // Faz a requisição POST para a URL completa da API.
  const response = await fetch(`${API_URL}${path}`, {
    // Define o método HTTP como POST.
    method: "POST",
    headers: montarHeaders(),

    // Converte o objeto JavaScript em texto JSON para enviar na requisição.
    body: JSON.stringify(body),
  });

  // Trata a resposta da API e retorna o resultado no tipo esperado.
  return tratarResposta<T>(response);
}

// Função para fazer requisições DELETE.
// Recebe apenas o caminho da rota e não espera retorno no corpo.
export async function apiDelete(path: string): Promise<void> {
  // Faz a requisição DELETE para a URL completa da API.
  const response = await fetch(`${API_URL}${path}`, {
    // Define o método HTTP como DELETE.
    method: "DELETE",
    headers: montarHeaders(),
  });

  // Trata a resposta da API.
  // Como o retorno esperado é vazio, usamos void.
  return tratarResposta<void>(response);
}
