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
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: "32px auto",
        padding: 32,
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: "var(--raio-borda)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 700,
          color: "var(--cor-texto)",
        }}
      >
        Cadastrar Pessoa
      </h2>

      {/* Nome */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="nome"
          style={{
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Nome
        </label>

        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={enviando}
          placeholder="Digite o nome da pessoa"
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {/* Idade */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="idade"
          style={{
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Idade
        </label>

        <input
          id="idade"
          type="number"
          min={0}
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          disabled={enviando}
          placeholder="Digite a idade"
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {erro && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "var(--raio-borda)",
          backgroundColor: "var(--cor-primaria)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: enviando ? "not-allowed" : "pointer",
          opacity: enviando ? 0.7 : 1,
        }}
      >
        {enviando ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}
