/*
 Modal de cadastro de nova pessoa (nome + idade), 
 
 construído em cima do componente genérico Modal. 

 Controla o próprio estado do formulário com useState e,
 ao submeter, chama onCriar(dados) recebido via props.
 
 É a versão atual (em modal) do
  antigo FormularioPessoa.tsx.
*/

import { useState } from "react";
import { Modal } from "../ui/Modal";
import type { CriarPessoaInput } from "../../types/pessoa";

interface PessoaFormModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriar: (dados: CriarPessoaInput) => Promise<void>;
}

export function PessoaFormModal({
  aberto,
  onFechar,
  onCriar,
}: PessoaFormModalProps) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const resetar = () => {
    setNome("");
    setIdade("");
    setErro(null);
  };

  const handleFechar = () => {
    resetar();
    onFechar();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim()) {
      setErro("Informe o nome.");
      return;
    }
    const idadeNumero = Number(idade);
    if (!Number.isFinite(idadeNumero) || idadeNumero < 0) {
      setErro("Informe uma idade válida.");
      return;
    }

    setEnviando(true);
    try {
      await onCriar({ nome: nome.trim(), idade: idadeNumero });
      resetar();
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar pessoa.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal aberto={aberto} titulo="Nova Pessoa" onFechar={handleFechar}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="nome"
            style={{ display: "block", fontSize: 14, marginBottom: 6 }}
          >
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={enviando}
            style={estiloInput}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="idade"
            style={{ display: "block", fontSize: 14, marginBottom: 6 }}
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
            style={estiloInput}
          />
        </div>

        {erro && (
          <p
            style={{ color: "var(--cor-erro)", fontSize: 14, marginBottom: 16 }}
          >
            {erro}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={handleFechar}
            disabled={enviando}
            style={estiloBotaoSecundario}
          >
            Cancelar
          </button>
          <button type="submit" disabled={enviando} style={estiloBotaoPrimario}>
            {enviando ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--cor-borda)",
  borderRadius: "var(--raio-borda)",
  fontSize: 14,
};

const estiloBotaoPrimario: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "var(--cor-primaria)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--raio-borda)",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const estiloBotaoSecundario: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "transparent",
  border: "1px solid var(--cor-borda)",
  borderRadius: "var(--raio-borda)",
  fontSize: 14,
  cursor: "pointer",
};
