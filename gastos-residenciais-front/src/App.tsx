// useState    -> cria e gerencia estados do componente.
// useEffect   -> executa efeitos colaterais (ex.: carregar dados da API).
// useCallback -> memoriza funções para evitar recriações desnecessárias.
import { useEffect, useState, useCallback } from "react";
// Importa o serviço responsável pelas chamadas da API relacionadas às pessoas.
import { pessoasService } from "./services/pessoasService";

// Importa os serviços responsáveis pelas chamadas da API relacionadas às transações.
import { transacoesService } from "./services/transacoesService";

// Importa o componente responsável pelo formulário de cadastro.
import { FormularioPessoa } from "./components/FormularioPessoa";

// Importa o componente responsável pela listagem das pessoas.
import { ListaPessoas } from "./components/ListaPessoas";
import { FormularioTransacao } from "./components/FormularioTransacao";
import { ListaTransacoes } from "./components/ListaTransacoes";
// Importa os tipos utilizados no componente.
import type { Pessoa, CriarPessoaInput } from "./types/pessoa";
import type { Transacao, CriarTransacaoInput } from "./types/transacao";

type Aba = "pessoas" | "transacoes";

// Componente principal da aplicação.
function App() {
  // Estado que armazena todas as pessoas cadastradas.
  const [aba, setAba] = useState<Aba>("pessoas");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estado que informa se os dados estão sendo carregados.

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtroPessoaId, setFiltroPessoaId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Função responsável por buscar todas as pessoas na API.

  // useCallback é utilizado para evitar que a função seja recriada
  // a cada renderização do componente.
  const carregarPessoas = useCallback(async () => {
    const dados = await pessoasService.listar();
    setPessoas(dados);
  }, []);

  const carregarTransacoes = useCallback(async () => {
    const dados = filtroPessoaId
      ? await transacoesService.listarPorPessoa(filtroPessoaId)
      : await transacoesService.listar();
    setTransacoes(dados);
  }, [filtroPessoaId]);

  // Executa quando o componente é montado pela primeira vez.
  //
  // Equivalente ao componentDidMount das Class Components.
  useEffect(() => {
    setCarregando(true);

    setErro(null);
    Promise.all([carregarPessoas(), carregarTransacoes()])
      .catch((err) =>
        setErro(err instanceof Error ? err.message : "Erro ao carregar dados."),
      )
      .finally(() => setCarregando(false));
  }, [carregarPessoas, carregarTransacoes]);

  const handleCriarPessoa = async (dados: CriarPessoaInput) => {
    // Envia os dados para a API.
    await pessoasService.criar(dados);

    // Recarrega a lista para exibir a nova pessoa cadastrada.
    await carregarPessoas();
  };

  // Função responsável por excluir uma pessoa.
  const handleDeletarPessoa = async (id: string) => {
    // Remove a pessoa da API.
    await pessoasService.deletar(id);
    await carregarPessoas();
    await carregarTransacoes(); // reflete o cascade delete na lista de transações
  };
  // Atualiza a lista após a exclusão.
  const handleCriarTransacao = async (dados: CriarTransacaoInput) => {
    await transacoesService.criar(dados);
    await carregarTransacoes();
  };
  const handleDeletarTransacao = async (id: string) => {
    await transacoesService.deletar(id);
    await carregarTransacoes();
  };
  // JSX responsável pela interface da aplicação.
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1>
        Controle de Gastos <br />
        <br /> Residenciais
      </h1>

      <nav style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setAba("pessoas")} disabled={aba === "pessoas"}>
          Pessoas
        </button>
        <button
          onClick={() => setAba("transacoes")}
          disabled={aba === "transacoes"}
        >
          Transações
        </button>
      </nav>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!carregando && aba === "pessoas" && (
        <>
          <FormularioPessoa onCriar={handleCriarPessoa} />
          <hr />
          <ListaPessoas pessoas={pessoas} onDeletar={handleDeletarPessoa} />
        </>
      )}

      {!carregando && aba === "transacoes" && (
        <>
          <FormularioTransacao
            pessoas={pessoas}
            onCriar={handleCriarTransacao}
          />
          <hr />
          <ListaTransacoes
            transacoes={transacoes}
            pessoas={pessoas}
            filtroPessoaId={filtroPessoaId}
            onMudarFiltro={setFiltroPessoaId}
            onDeletar={handleDeletarTransacao}
          />
        </>
      )}
    </div>
  );
}

// Exporta o componente para ser utilizado pelo React.
// Normalmente ele será importado no arquivo main.tsx.
export default App;
