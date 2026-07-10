import { useEffect, useState, useCallback } from "react";
import { pessoasService } from "../services/pessoasService";
import { transacoesService } from "../services/transacoesService";
import { FormularioTransacao } from "../components/FormularioTransacao";
import { ListaTransacoes } from "../components/ListaTransacoes";
import type { Pessoa } from "../types/pessoa";
import type { Transacao, CriarTransacaoInput } from "../types/transacao";

export function TransacoesPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filtroPessoaId, setFiltroPessoaId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  const handleDeletar = async (id: string) => {
    await transacoesService.deletar(id);
    await carregarTransacoes();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Transações</h1>
      <p style={{ color: "var(--cor-texto-secundario)", marginBottom: 24 }}>
        Registre receitas e despesas da residência.
      </p>

      <FormularioTransacao pessoas={pessoas} onCriar={handleCriar} />
      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px solid var(--cor-borda)",
        }}
      />

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "var(--cor-erro)" }}>{erro}</p>}
      {!carregando && !erro && (
        <ListaTransacoes
          transacoes={transacoes}
          pessoas={pessoas}
          filtroPessoaId={filtroPessoaId}
          onMudarFiltro={setFiltroPessoaId}
          onDeletar={handleDeletar}
        />
      )}
    </div>
  );
}
