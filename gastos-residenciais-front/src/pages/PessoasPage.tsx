import { useEffect, useState, useCallback } from "react";
import { pessoasService } from "../services/pessoasService";
import { FormularioPessoa } from "../components/FormularioPessoa";
import { ListaPessoas } from "../components/ListaPessoas";
import type { Pessoa, CriarPessoaInput } from "../types/pessoa";

export function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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

  const handleDeletar = async (id: string) => {
    await pessoasService.deletar(id);
    await carregar();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Pessoas</h1>
      <p style={{ color: "var(--cor-texto-secundario)", marginBottom: 24 }}>
        Gerencie os moradores vinculados ao controle de gastos.
      </p>

      <FormularioPessoa onCriar={handleCriar} />
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
        <ListaPessoas pessoas={pessoas} onDeletar={handleDeletar} />
      )}
    </div>
  );
}
