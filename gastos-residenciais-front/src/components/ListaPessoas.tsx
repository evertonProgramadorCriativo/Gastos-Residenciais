/* Lista simples (não paginada, sem busca) das pessoas cadastradas,

 com botão de excluir por linha. 

 Recebe os dados prontos via props (pessoas, onDeletar) 
 
 */

// Importa o tipo Pessoa.
// Esse tipo define a estrutura de uma pessoa no sistema,
// contendo propriedades como id, nome e idade.
import type { Pessoa } from "../types/pessoa";

// Interface responsável por definir quais propriedades
// o componente ListaPessoas irá receber.
interface ListaPessoasProps {
  // Lista contendo todas as pessoas cadastradas.
  // O tipo Pessoa[] significa um array de objetos Pessoa.
  pessoas: Pessoa[];

  // Função responsável por excluir uma pessoa.
  // Recebe o ID da pessoa e retorna uma Promise,
  // pois normalmente faz uma requisição para a API.
  onDeletar: (id: string) => Promise<void>;
}

// Componente responsável por exibir a lista de pessoas cadastradas.
export function ListaPessoas({ pessoas, onDeletar }: ListaPessoasProps) {
  // Função executada quando o usuário clicar em excluir.
  const handleDeletar = async (pessoa: Pessoa) => {
    // Exibe uma janela de confirmação no navegador.
    // Isso evita exclusões acidentais.
    const confirmado = window.confirm(
      `Excluir "${pessoa.nome}"? Todas as transações dela também serão apagadas.`,
    );

    // Se o usuário clicar em "Cancelar",
    // a função é encerrada imediatamente.
    if (!confirmado) return;

    // Chama a função recebida pelas props para excluir a pessoa.
    // É enviado apenas o ID para a API.
    await onDeletar(pessoa.id);
  };

  // Caso não exista nenhuma pessoa cadastrada,
  // exibe uma mensagem ao usuário.
  if (pessoas.length === 0) {
    return <p>Nenhuma pessoa cadastrada ainda.</p>;
  }

  // Renderiza a tabela de pessoas.
  return (
    <table>
      {/* Cabeçalho da tabela */}
      <thead>
        <tr>
          <th>Nome</th>
          <th>Idade</th>

          {/* Coluna reservada para os botões de ação */}
          <th></th>
        </tr>
      </thead>

      {/* Corpo da tabela */}
      <tbody>
        {/* Percorre o array de pessoas e cria uma linha para cada pessoa */}
        {pessoas.map((pessoa) => (
          // Cada item precisa de uma chave única (key)
          // para que o React identifique mudanças na lista.
          <tr key={pessoa.id}>
            {/* Exibe o nome da pessoa */}
            <td>{pessoa.nome}</td>

            {/* Exibe a idade da pessoa */}
            <td>{pessoa.idade}</td>

            {/* Coluna das ações */}
            <td>
              {/* Botão para excluir a pessoa */}
              <button onClick={() => handleDeletar(pessoa)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
