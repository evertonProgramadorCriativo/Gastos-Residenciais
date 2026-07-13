/*
 Lista em tabela simples das transações,
 com filtro por pessoa e cruzamento
 com a lista de pessoas para exibir 

 o nome de quem fez cada lançamento. 
 Recebe tudo via props e 
 não faz requisição própria.
  */

// Importa o tipo Pessoa.
// Esse tipo representa os dados de uma pessoa, como id, nome e idade.
import type { Pessoa } from "../types/pessoa";

// Importa o tipo Transacao.
// Esse tipo representa uma transação da aplicação, com campos como
// id, descrição, valor, tipo, data e pessoaId.
import type { Transacao } from "../types/transacao";

// Interface que define as props esperadas pelo componente ListaTransacoes.
interface ListaTransacoesProps {
  // Lista de transações que serão exibidas na tabela.
  transacoes: Transacao[];

  // Lista de pessoas, usada para descobrir o nome da pessoa associada a cada transação
  // e também para preencher o filtro por pessoa.
  pessoas: Pessoa[];

  // Id da pessoa atualmente selecionada no filtro.
  // Se estiver vazio, significa "mostrar todas".
  filtroPessoaId: string;

  // Função chamada quando o usuário muda o filtro de pessoa.
  // Recebe o id da pessoa selecionada.
  onMudarFiltro: (pessoaId: string) => void;

  // Função chamada quando o usuário clica para deletar uma transação.
  // Recebe o id da transação e retorna uma Promise.
  onDeletar: (id: string) => Promise<void>;
}

// Função auxiliar para descobrir o nome de uma pessoa a partir do pessoaId.
// Ela percorre a lista de pessoas e tenta encontrar a que tem o mesmo id.
// Se encontrar, retorna o nome.
// Se não encontrar, retorna "—".
function nomeDaPessoa(pessoas: Pessoa[], pessoaId: string): string {
  return pessoas.find((p) => p.id === pessoaId)?.nome ?? "—";
}

// Componente responsável por exibir a lista de transações.
// Também mostra um filtro por pessoa e um botão para excluir cada transação.
export function ListaTransacoes({
  transacoes,
  pessoas,
  filtroPessoaId,
  onMudarFiltro,
  onDeletar,
}: ListaTransacoesProps) {
  // JSX retornado pelo componente.
  return (
    <div>
      {/* Bloco do filtro por pessoa */}
      <div>
        {/* Label do campo de filtro */}
        <label htmlFor="filtro">Filtrar por pessoa</label>

        <select
          // id usado para associar a label ao select
          id="filtro"
          // valor atual do filtro, controlado pela prop filtroPessoaId
          value={filtroPessoaId}
          // quando o usuário troca a opção, chama a função onMudarFiltro
          // enviando o id da pessoa selecionada
          onChange={(e) => onMudarFiltro(e.target.value)}
        >
          {/* opção vazia para mostrar todas as transações */}
          <option value="">Todas</option>

          {/* percorre a lista de pessoas e cria uma opção para cada uma */}
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {/* texto mostrado no select */}
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Se a lista de transações estiver vazia, mostra uma mensagem */}
      {transacoes.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        // Se existir pelo menos uma transação, renderiza a tabela
        <table>
          <thead>
            <tr>
              {/* Cabeçalho da tabela */}
              <th>Descrição</th>
              <th>Pessoa</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th></th> {/* coluna vazia para o botão de excluir */}
            </tr>
          </thead>

          <tbody>
            {/* percorre a lista de transações e cria uma linha para cada item */}
            {transacoes.map((t) => (
              <tr key={t.id}>
                {/* Exibe a descrição da transação */}
                <td>{t.descricao}</td>

                {/* Exibe o nome da pessoa associada à transação.
                    Como a transação guarda apenas pessoaId,
                    usamos a função nomeDaPessoa para buscar o nome correspondente. */}
                <td>{nomeDaPessoa(pessoas, t.pessoaId)}</td>

                {/* Exibe o tipo da transação.
                    Também aplica cor condicional:
                    - verde para Receita
                    - vermelho para Despesa */}
                <td
                  style={{ color: t.tipo === "Receita" ? "green" : "crimson" }}
                >
                  {t.tipo}
                </td>

                {/* Exibe o valor formatado em moeda brasileira (R$). */}
                <td>
                  {t.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>

                {/* Coluna com botão para excluir a transação */}
                <td>
                  <button onClick={() => onDeletar(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
