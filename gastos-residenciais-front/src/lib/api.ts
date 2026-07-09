/**
 * Client HTTP centralizado para comunicação com a API do backend.
 * Centralizar aqui evita repetir a URL base em cada componente,
 * e facilita trocar a implementação (fetch -> axios) no futuro
 * sem precisar mexer em cada tela.
 */

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
