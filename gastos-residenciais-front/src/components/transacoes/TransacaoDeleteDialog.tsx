/*
Diálogo de confirmação de exclusão de uma transação, 
construído em cima do componente genérico Modal,

 mostrando a descrição e o valor formatado
  (formatarMoeda) do lançamento antes de confirmar a exclusão.
*/

import { Modal } from "../ui/Modal";
import { formatarMoeda } from "../../lib/formato";
import type { Transacao } from "../../types/transacao";

interface TransacaoDeleteDialogProps {
  transacao: Transacao | null;
  onFechar: () => void;
  onConfirmar: (id: string) => Promise<void>;
}

export function TransacaoDeleteDialog({
  transacao,
  onFechar,
  onConfirmar,
}: TransacaoDeleteDialogProps) {
  if (!transacao) return null;

  const handleConfirmar = async () => {
    await onConfirmar(transacao.id);
    onFechar();
  };

  return (
    <Modal
      aberto={transacao !== null}
      titulo="Excluir transação"
      onFechar={onFechar}
    >
      <p style={{ fontSize: 14, marginBottom: 20 }}>
        Excluir <strong>{transacao.descricao}</strong> (
        {formatarMoeda(transacao.valor)})? Essa ação não pode ser desfeita.
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
