/**
  Página de gerenciamento de pessoas efetivamente usada na rota /pessoas
   Busca a lista via pessoasService, 
   controla a abertura do modal de cadastro (PessoaFormModal) 
   e do diálogo de exclusão (PessoaDeleteDialog), e
  delega a listagem em si para PessoasTable.
 */

import { useEffect, useState, useCallback } from "react";
import { pessoasService } from "../../services/pessoasService";
import { PessoasTable } from "../pessoas/PessoasTable";
import { PessoaFormModal } from "../pessoas/PessoaFormModal";
import { PessoaDeleteDialog } from "../pessoas/PessoaDeleteDialog";
import type { Pessoa, CriarPessoaInput } from "../../types/pessoa";

export function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(
    null,
  );

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await pessoasService.listar();
      setPessoas(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar pessoas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleCriar = async (dados: CriarPessoaInput) => {
    await pessoasService.criar(dados);
    await carregar();
  };

  const handleExcluir = async (id: string) => {
    await pessoasService.deletar(id);
    await carregar();
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
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Pessoas</h1>
          <p style={{ color: "var(--cor-texto-secundario)", margin: 0 }}>
            Gerencie os moradores vinculados ao controle de gastos.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={carregar}
            style={{
              padding: "10px 16px",
              backgroundColor: "transparent",
              border: "1px solid var(--cor-borda)",
              borderRadius: "var(--raio-borda)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ↻ Atualizar
          </button>
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
            + Nova Pessoa
          </button>
        </div>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "var(--cor-erro)" }}>{erro}</p>}

      {!carregando && !erro && (
        <PessoasTable pessoas={pessoas} onExcluir={setPessoaParaExcluir} />
      )}

      <PessoaFormModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onCriar={handleCriar}
      />

      <PessoaDeleteDialog
        pessoa={pessoaParaExcluir}
        onFechar={() => setPessoaParaExcluir(null)}
        onConfirmar={handleExcluir}
      />
    </div>
  );
}
