// useState    -> cria e gerencia estados do componente.
// useEffect   -> executa efeitos colaterais (ex.: carregar dados da API).
// useCallback -> memoriza funções para evitar recriações desnecessárias.
import { useEffect, useState, useCallback } from "react";

// Importa o serviço responsável pelas chamadas da API relacionadas às pessoas.
import { pessoasService } from "./services/pessoasService";

// Importa o componente responsável pelo formulário de cadastro.
import { FormularioPessoa } from "./components/FormularioPessoa";

// Importa o componente responsável pela listagem das pessoas.
import { ListaPessoas } from "./components/ListaPessoas";

// Importa os tipos utilizados no componente.
import type { Pessoa, CriarPessoaInput } from "./types/pessoa";

// Componente principal da aplicação.
function App() {
  // Estado que armazena todas as pessoas cadastradas.
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estado que informa se os dados estão sendo carregados.
  const [carregando, setCarregando] = useState(true);

  // Estado responsável por armazenar mensagens de erro ao carregar dados.
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  // Função responsável por buscar todas as pessoas na API.

  // useCallback é utilizado para evitar que a função seja recriada
  // a cada renderização do componente.
  const carregarPessoas = useCallback(async () => {
    // Ativa o indicador de carregamento.
    setCarregando(true);

    // Limpa erros anteriores.
    setErroCarregamento(null);

    try {
      // Busca as pessoas na API.
      const dados = await pessoasService.listar();

      // Atualiza o estado com os dados recebidos.
      setPessoas(dados);
    } catch (err) {
      // Caso ocorra erro, salva a mensagem.
      setErroCarregamento(
        err instanceof Error ? err.message : "Erro ao carregar pessoas.",
      );
    } finally {
      // Executa sempre, independentemente de sucesso ou erro.
      setCarregando(false);
    }
  }, []);

  // Executa quando o componente é montado pela primeira vez.
  //
  // Equivalente ao componentDidMount das Class Components.
  useEffect(() => {
    carregarPessoas();
  }, [carregarPessoas]);

  // Função responsável por criar uma nova pessoa.
  const handleCriar = async (dados: CriarPessoaInput) => {
    // Envia os dados para a API.
    await pessoasService.criar(dados);

    // Recarrega a lista para exibir a nova pessoa cadastrada.
    await carregarPessoas();
  };

  // Função responsável por excluir uma pessoa.
  const handleDeletar = async (id: string) => {
    // Remove a pessoa da API.
    await pessoasService.deletar(id);

    // Atualiza a lista após a exclusão.
    await carregarPessoas();
  };

  // JSX responsável pela interface da aplicação.
  return (
    // Container principal da página.
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 24,
      }}
    >
      {/* Título principal */}
      <h1>
        Controle de <br />
        <br /> Gastos Residenciais
      </h1>

      {/* Formulário de cadastro */}
      <FormularioPessoa onCriar={handleCriar} />

      {/* Linha separadora */}
      <hr />

      {/* Título da seção */}
      <h2>Pessoas cadastradas</h2>

      {/* Exibe mensagem enquanto os dados estão sendo carregados */}
      {carregando && <p>Carregando...</p>}

      {/* Exibe mensagem caso ocorra erro */}
      {erroCarregamento && <p style={{ color: "red" }}>{erroCarregamento}</p>}

      {/* Exibe a lista somente quando não estiver carregando
          e não existir erro */}
      {!carregando && !erroCarregamento && (
        <ListaPessoas pessoas={pessoas} onDeletar={handleDeletar} />
      )}
    </div>
  );
}

// Exporta o componente para ser utilizado pelo React.
// Normalmente ele será importado no arquivo main.tsx.
export default App;
