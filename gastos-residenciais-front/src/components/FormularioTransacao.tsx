// Importa hooks do React.
// useState => guarda estados do componente (campos do formulário, erro, loading etc.)
// useMemo => memoriza um cálculo para evitar refazer em toda renderização sem necessidade.
import { useState, useMemo } from "react";
import { ArrowLeftRight, User, FileText, DollarSign, AlertTriangle, Save } from "lucide-react";

// Importa o tipo Pessoa.
// Esse tipo representa os dados de uma pessoa vindos da API/front.
import type { Pessoa } from "../types/pessoa";

// Importa os tipos usados na transação.
// CriarTransacaoInput => formato esperado ao criar uma transação
// TipoTransacao => tipo da transação ("Despesa" ou "Receita")
import type { CriarTransacaoInput, TipoTransacao } from "../types/transacao";

// Define o formato das props que o componente recebe.
interface FormularioTransacaoProps {
  // Lista de pessoas disponíveis para selecionar no formulário.
  pessoas: Pessoa[];

  // Função recebida do componente pai para criar uma nova transação.
  // Ela recebe os dados da transação e retorna uma Promise<void>.
  onCriar: (dados: CriarTransacaoInput) => Promise<void>;
}

// Componente responsável por renderizar o formulário de criação de transações.
export function FormularioTransacao({
  pessoas,
  onCriar,
}: FormularioTransacaoProps) {
  // Estado que guarda a descrição digitada no campo "Descrição".
  const [descricao, setDescricao] = useState("");

  // Estado que guarda o valor digitado no campo "Valor".
  // Está como string porque input HTML trabalha naturalmente com texto.
  const [valor, setValor] = useState("");

  // Estado que guarda o tipo da transação selecionado.
  // O valor inicial é "Despesa".
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");

  // Estado que guarda o id da pessoa selecionada no select.
  const [pessoaId, setPessoaId] = useState("");

  // Estado que indica se o formulário está enviando os dados para o backend.
  // Enquanto for true, podemos desabilitar campos e botão para evitar envio duplicado.
  const [enviando, setEnviando] = useState(false);

  // Estado que guarda a mensagem de erro, caso exista.
  // null significa que não há erro no momento.
  const [erro, setErro] = useState<string | null>(null);

  // useMemo memoriza o resultado da busca da pessoa selecionada.
  // Ele só recalcula quando "pessoas" ou "pessoaId" mudarem.
  const pessoaSelecionada = useMemo(
    // Procura na lista a pessoa cujo id seja igual ao pessoaId selecionado.
    // Se não encontrar, retorna null.
    () => pessoas.find((p) => p.id === pessoaId) ?? null,

    // Dependências do useMemo:
    // se a lista de pessoas mudar ou o id selecionado mudar, recalcula.
    [pessoas, pessoaId],
  );

  // Verifica se a pessoa selecionada é menor de idade.
  // Se nenhuma pessoa estiver selecionada, usa idade 0 como fallback.
  const pessoaEhMenorDeIdade = (pessoaSelecionada?.idade ?? 0) < 18;

  // Função executada quando o usuário seleciona uma pessoa no select.
  // Ela atualiza o estado da pessoa escolhida e aplica uma regra de negócio:
  // se a pessoa for menor de idade, não pode ficar com tipo "Receita".
  const handleSelecionarPessoa = (id: string) => {
    // Atualiza o id da pessoa selecionada.
    setPessoaId(id);

    // Procura o objeto completo da pessoa selecionada na lista.
    const pessoa = pessoas.find((p) => p.id === id);

    // Se a pessoa existir, for menor de 18 e o tipo atual for "Receita",
    // troca automaticamente o tipo para "Despesa".
    if (pessoa && pessoa.idade < 18 && tipo === "Receita") {
      setTipo("Despesa");
    }
  };

  // Função chamada quando o formulário é enviado.
  const handleSubmit = async (e: React.FormEvent) => {
    // Evita o comportamento padrão do formulário,
    // que seria recarregar a página ao dar submit.
    e.preventDefault();

    // Limpa qualquer erro anterior antes de iniciar nova validação.
    setErro(null);

    // Validação: a descrição não pode estar vazia ou só com espaços.
    if (!descricao.trim()) {
      setErro("Informe a descrição.");
      return;
    }

    // Converte o valor digitado (string) para número.
    const valorNumero = Number(valor);

    // Validação: o valor precisa ser um número válido e maior que zero.
    if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    // Validação: o usuário precisa selecionar uma pessoa.
    if (!pessoaId) {
      setErro("Selecione uma pessoa.");
      return;
    }

    // Marca que o envio começou.
    // Isso pode ser usado para desabilitar o formulário e mostrar feedback visual.
    setEnviando(true);

    try {
      // Chama a função recebida por props para criar a transação.
      // Monta o objeto no formato esperado pelo backend/API.
      await onCriar({
        // Remove espaços extras da descrição.
        descricao: descricao.trim(),

        // Valor convertido para número.
        valor: valorNumero,

        // Tipo selecionado no formulário.
        tipo,

        // Data atual em formato ISO (ex.: 2026-07-09T18:00:00.000Z).
        data: new Date().toISOString(),

        // Id da pessoa selecionada.
        pessoaId,
      });

      // Se deu tudo certo, limpa os campos do formulário.
      setDescricao("");
      setValor("");

      // Volta o tipo para o padrão "Despesa".
      setTipo("Despesa");
    } catch (err) {
      // Se der erro ao criar a transação, salva a mensagem no estado.
      // Se o erro for uma instância de Error, usa a mensagem real.
      // Caso contrário, usa uma mensagem genérica.
      setErro(err instanceof Error ? err.message : "Erro ao criar transação.");
    } finally {
      // Independentemente de sucesso ou erro, finaliza o estado de envio.
      setEnviando(false);
    }
  };

  // JSX que será renderizado na tela.
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 650,
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
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <ArrowLeftRight size={24} />
        Nova Transação
      </h2>

      {/* Pessoa */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="pessoa"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <User size={16} />
          Pessoa
        </label>

        <select
          id="pessoa"
          value={pessoaId}
          onChange={(e) => handleSelecionarPessoa(e.target.value)}
          disabled={enviando}
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
          }}
        >
          <option value="">Selecione...</option>

          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} ({p.idade} anos)
            </option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="descricao"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <FileText size={16} />
          Descrição
        </label>

        <input
          id="descricao"
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={enviando}
          placeholder="Ex: Compra no supermercado"
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
          }}
        />
      </div>

      {/* Valor */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="valor"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <DollarSign size={16} />
          Valor
        </label>

        <input
          id="valor"
          type="number"
          min={0.01}
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          disabled={enviando}
          placeholder="0,00"
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
          }}
        />
      </div>

      {/* Tipo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <label
          htmlFor="tipo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <ArrowLeftRight size={16} />
          Tipo
        </label>

        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoTransacao)}
          disabled={enviando}
          style={{
            padding: "12px 16px",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
          }}
        >
          <option value="Despesa">Despesa</option>

          <option value="Receita" disabled={pessoaEhMenorDeIdade}>
            Receita
            {pessoaEhMenorDeIdade ? " (indisponível para menores)" : ""}
          </option>
        </select>

        {pessoaEhMenorDeIdade && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              padding: 12,
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <AlertTriangle size={18} />
            Pessoas menores de 18 anos só podem registrar despesas.
          </div>
        )}
      </div>

      {erro && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
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
          height: 48,
          border: "none",
          borderRadius: "var(--raio-borda)",
          backgroundColor: "var(--cor-primaria)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: enviando ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: enviando ? 0.7 : 1,
        }}
      >
        <Save size={18} />

        {enviando ? "Salvando..." : "Cadastrar Transação"}
      </button>
    </form>
  );
}
