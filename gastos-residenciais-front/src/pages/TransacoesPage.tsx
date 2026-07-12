import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { pessoasService } from "../services/pessoasService";
import { transacoesService } from "../services/transacoesService";
import { TransacoesTable } from "../components/transacoes/TransacoesTable";
import { TransacaoFormModal } from "../components/transacoes/TransacaoFormModal";
import { TransacaoDeleteDialog } from "../components/transacoes/TransacaoDeleteDialog";
import type { Pessoa } from "../types/pessoa";
import type { Transacao, CriarTransacaoInput } from "../types/transacao";

export function TransacoesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Inicializa o filtro já lendo o parâmetro ?pessoaId= da URL, se existir
  const [filtroPessoaId, setFiltroPessoaId] = useState(
    searchParams.get("pessoaId") ?? "",
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] =
    useState<Transacao | null>(null);

  // Mantém o filtro sincronizado se o usuário já estiver em /transacoes
  // e clicar em outra pessoa na busca do Header
  useEffect(() => {
    const idDaUrl = searchParams.get("pessoaId") ?? "";
    setFiltroPessoaId(idDaUrl);
  }, [searchParams]);

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

  const carregarTudo = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      await Promise.all([carregarPessoas(), carregarTransacoes()]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  }, [carregarPessoas, carregarTransacoes]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  const handleCriar = async (dados: CriarTransacaoInput) => {
    await transacoesService.criar(dados);
    await carregarTransacoes();
  };

  const handleExcluir = async (id: string) => {
    await transacoesService.deletar(id);
    await carregarTransacoes();
  };

  // Quando o filtro muda manualmente na própria tela (dropdown da tabela),
  // atualiza a URL também, mantendo um único lugar de verdade
  const handleMudarFiltro = (id: string) => {
    setFiltroPessoaId(id);
    setSearchParams(id ? { pessoaId: id } : {});
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Transações</h1>
          <p style={{ color: "var(--cor-texto-secundario)", margin: 0 }}>
            Registre receitas e despesas da residência.
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          style={{
            padding: "10px 16px",
            backgroundColor: "var(--cor-primaria)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Nova Transação
        </button>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "var(--cor-erro)" }}>{erro}</p>}

      {!carregando && !erro && (
        <TransacoesTable
          transacoes={transacoes}
          pessoas={pessoas}
          filtroPessoaId={filtroPessoaId}
          onMudarFiltro={handleMudarFiltro}
          onExcluir={setTransacaoParaExcluir}
        />
      )}

      <TransacaoFormModal
        aberto={modalAberto}
        pessoas={pessoas}
        onFechar={() => setModalAberto(false)}
        onCriar={handleCriar}
      />

      <TransacaoDeleteDialog
        transacao={transacaoParaExcluir}
        onFechar={() => setTransacaoParaExcluir(null)}
        onConfirmar={handleExcluir}
      />
    </div>
  );
}
