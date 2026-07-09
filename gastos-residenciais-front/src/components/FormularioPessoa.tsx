// Importa o Hook useState do React.
// O useState permite criar e gerenciar estados dentro de componentes funcionais.
import { useState } from "react";

// Importa o tipo que define quais dados são necessários
// para criar uma nova pessoa.
import type { CriarPessoaInput } from "../types/pessoa";

// Interface que define as propriedades (props)
// que o componente receberá.
interface FormularioPessoaProps {
  // Função responsável por criar uma pessoa.
  // Ela recebe os dados do formulário e retorna uma Promise,
  // pois normalmente faz uma chamada para uma API.
  onCriar: (dados: CriarPessoaInput) => Promise<void>;
}

// Componente responsável por exibir o formulário
// de cadastro de uma nova pessoa.
export function FormularioPessoa({ onCriar }: FormularioPessoaProps) {
  // Estado que armazena o nome digitado no input.
  const [nome, setNome] = useState("");

  // Estado que armazena a idade digitada no input.
  // Inicialmente é uma string porque o valor de um input
  // HTML sempre é recebido como texto.
  const [idade, setIdade] = useState("");

  // Estado que indica se o formulário está enviando os dados.
  // É utilizado para desabilitar os campos e evitar múltiplos cliques.
  const [enviando, setEnviando] = useState(false);

  // Estado responsável por armazenar mensagens de erro.
  // Pode ser uma string ou null (sem erro).
  const [erro, setErro] = useState<string | null>(null);

  // Função executada quando o formulário é enviado.
  const handleSubmit = async (e: React.FormEvent) => {
    // Impede o comportamento padrão do navegador,
    // que seria recarregar a página.
    e.preventDefault();

    // Limpa mensagens de erro anteriores.
    setErro(null);

    // ==========================
    // Validações no Front-end
    // ==========================

    // Remove espaços em branco e verifica se o nome foi informado.
    if (!nome.trim()) {
      setErro("Informe o nome.");
      return;
    }

    // Converte a idade de string para número.
    const idadeNumero = Number(idade);

    // Verifica se a idade é válida e maior ou igual a zero.
    if (!Number.isFinite(idadeNumero) || idadeNumero < 0) {
      setErro("Informe uma idade válida.");
      return;
    }

    // Indica que o envio começou.
    setEnviando(true);

    try {
      // Chama a função recebida pelas props para criar a pessoa.
      await onCriar({
        nome: nome.trim(),
        idade: idadeNumero,
      });

      // Limpa os campos após o cadastro ser realizado com sucesso.
      setNome("");
      setIdade("");
    } catch (err) {
      // Caso ocorra um erro, exibe a mensagem.
      setErro(err instanceof Error ? err.message : "Erro ao criar pessoa.");
    } finally {
      // Executa sempre, mesmo se ocorrer erro.
      // Finaliza o estado de envio.
      setEnviando(false);
    }
  };

  return (
    // Formulário que chama handleSubmit ao ser enviado.
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Pessoa</h2>

      {/* Campo Nome */}
      <div>
        <label htmlFor="nome">Nome</label>

        <input
          id="nome"
          type="text"
          // Valor controlado pelo estado "nome".
          value={nome}
          // Atualiza o estado sempre que o usuário digitar.
          onChange={(e) => setNome(e.target.value)}
          // Desabilita o campo durante o envio.
          disabled={enviando}
        />
      </div>

      {/* Campo Idade */}
      <div>
        <label htmlFor="idade">Idade</label>

        <input
          id="idade"
          type="number"
          // Não permite números menores que zero.
          min={0}
          // Valor controlado pelo estado "idade".
          value={idade}
          // Atualiza o estado conforme o usuário digita.
          onChange={(e) => setIdade(e.target.value)}
          // Desabilita o campo durante o envio.
          disabled={enviando}
        />
      </div>

      {/* Exibe a mensagem de erro somente se ela existir */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Botão de envio */}
      <button type="submit" disabled={enviando}>
        {/* Texto dinâmico do botão */}
        {enviando ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}
