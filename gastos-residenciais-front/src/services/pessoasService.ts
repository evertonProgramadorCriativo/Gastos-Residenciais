// Importa funções genéricas para realizar requisições HTTP para a API.
// apiGet    -> faz requisições GET (buscar dados)
// apiPost   -> faz requisições POST (criar dados)
// apiDelete -> faz requisições DELETE (remover dados)
import { apiGet, apiPost, apiDelete } from "../lib/api";

// Importa os tipos TypeScript relacionados à entidade Pessoa.
// Pessoa            -> representa uma pessoa já cadastrada no sistema.
// CriarPessoaInput  -> representa os dados necessários para criar uma nova pessoa.
import type { Pessoa, CriarPessoaInput } from "../types/pessoa";

// Serviço responsável por centralizar todas as operações relacionadas
// à entidade Pessoa na API.
export const pessoasService = {
  // Busca a lista de todas as pessoas cadastradas.
  // Retorna um array de objetos do tipo Pessoa.
  listar: () => apiGet<Pessoa[]>("/pessoas"),

  // Cria uma nova pessoa no sistema.
  // Recebe os dados necessários para cadastro e retorna a pessoa criada.
  criar: (dados: CriarPessoaInput) => apiPost<Pessoa>("/pessoas", dados),

  // Remove uma pessoa do sistema utilizando seu ID.
  // O ID é enviado na URL da requisição.
  deletar: (id: string) => apiDelete(`/pessoas/${id}`),
};
