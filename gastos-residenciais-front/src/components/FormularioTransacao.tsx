// Importa hooks do React.
// useState => guarda estados do componente (campos do formulário, erro, loading etc.)
// useMemo => memoriza um cálculo para evitar refazer em toda renderização sem necessidade.
import { useState, useMemo } from "react";

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
    // Formulário HTML.
    // Quando o usuário clicar no botão submit, o handleSubmit será chamado.
    <form onSubmit={handleSubmit}>
      {/* Título do formulário */}
      <h2>Nova Transação</h2>

      {/* Campo de seleção da pessoa */}
      <div>
        {/* Label associada ao select pelo htmlFor="pessoa" */}
        <label htmlFor="pessoa">Pessoa</label>

        <select
          // id usado para conectar com a label
          id="pessoa"
          // valor atual do select controlado pelo estado pessoaId
          value={pessoaId}
          // quando o usuário trocar a opção, chama a função handleSelecionarPessoa
          onChange={(e) => handleSelecionarPessoa(e.target.value)}
          // desabilita o select enquanto estiver enviando
          disabled={enviando}
        >
          {/* opção padrão vazia */}
          <option value="">Selecione...</option>

          {/* percorre a lista de pessoas e cria uma opção para cada uma */}
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {/* texto exibido na opção */}
              {p.nome} ({p.idade} anos)
            </option>
          ))}
        </select>
      </div>

      {/* Campo de descrição */}
      <div>
        <label htmlFor="descricao">Descrição</label>
        <input
          id="descricao" // conecta com a label
          type="text" // campo textual
          value={descricao} // valor controlado pelo estado
          onChange={(e) => setDescricao(e.target.value)} // atualiza o estado conforme o usuário digita
          disabled={enviando} // desabilita durante envio
        />
      </div>

      {/* Campo de valor */}
      <div>
        <label htmlFor="valor">Valor</label>
        <input
          id="valor" // conecta com a label
          type="number" // input numérico
          min={0.01} // menor valor permitido visualmente no navegador
          step="0.01" // permite casas decimais de centavos
          value={valor} // valor controlado pelo estado
          onChange={(e) => setValor(e.target.value)} // atualiza o estado ao digitar
          disabled={enviando} // desabilita durante envio
        />
      </div>

      {/* Campo de tipo da transação */}
      <div>
        <label htmlFor="tipo">Tipo</label>
        <select
          id="tipo" // conecta com a label
          value={tipo} // valor controlado pelo estado
          onChange={(e) => setTipo(e.target.value as TipoTransacao)} // atualiza o tipo escolhido
          disabled={enviando} // desabilita durante envio
        >
          {/* opção para despesa */}
          <option value="Despesa">Despesa</option>

          {/* opção para receita */}
          <option value="Receita" disabled={pessoaEhMenorDeIdade}>
            {/* Se a pessoa for menor, mostra aviso ao lado do texto */}
            Receita{" "}
            {pessoaEhMenorDeIdade ? "(indisponível para menores de 18)" : ""}
          </option>
        </select>

        {/* Mensagem informativa exibida apenas se a pessoa selecionada for menor de idade */}
        {pessoaEhMenorDeIdade && (
          <p style={{ fontSize: "0.85em", color: "#666" }}>
            Pessoas menores de 18 anos só podem registrar despesas.
          </p>
        )}
      </div>

      {/* Se houver erro, exibe a mensagem em vermelho */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Botão de envio do formulário */}
      <button type="submit" disabled={enviando}>
        {/* Se estiver enviando, mostra "Salvando...", senão mostra o texto normal */}
        {enviando ? "Salvando..." : "Cadastrar Transação"}
      </button>
    </form>
  );
}
