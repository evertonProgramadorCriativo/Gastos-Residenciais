/*
Diálogo de confirmação de exclusão de uma pessoa, 
construído em cima do componente genérico Modal (src/components/ui/Modal.tsx). Só é renderizado quando a prop pessoa não é null; 

ao confirmar, chama onConfirmar(pessoa.id).
*/

import { Modal } from "../ui/Modal";
import type { Pessoa } from "../../types/pessoa";

interface PessoaDeleteDialogProps {
  pessoa: Pessoa | null;
  onFechar: () => void;
  onConfirmar: (id: string) => Promise<void>;
}

export function PessoaDeleteDialog({
  pessoa,
  onFechar,
  onConfirmar,
}: PessoaDeleteDialogProps) {
  if (!pessoa) return null;

  const handleConfirmar = async () => {
    await onConfirmar(pessoa.id);
    onFechar();
  };

  return (
    <Modal aberto={pessoa !== null} titulo="Excluir pessoa" onFechar={onFechar}>
      <p style={{ fontSize: 14, marginBottom: 20 }}>
        Tem certeza que deseja excluir <strong>{pessoa.nome}</strong>? Todas as
        transações associadas a ela também serão apagadas permanentemente.
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onFechar}
          style={{
            padding: "10px 16px",
            backgroundColor: "transparent",
            border: "1px solid var(--cor-borda)",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmar}
          style={{
            padding: "10px 16px",
            backgroundColor: "var(--cor-erro)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--raio-borda)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Excluir
        </button>
      </div>
    </Modal>
  );
}
