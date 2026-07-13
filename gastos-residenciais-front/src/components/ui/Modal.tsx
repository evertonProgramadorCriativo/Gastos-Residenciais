/*
Componente de UI genérico e reutilizável de modal/diálogo
 (overlay + caixa central + título + botão de fechar),
 
 sem nenhuma regra de negócio. 

 Serve de  base para PessoaFormModal, PessoaDeleteDialog, 
 TransacaoFormModal e TransacaoDeleteDialog, 
 
 que só passam o conteúdo (children)
  e o comportamento específico.
*/

import type { ReactNode } from "react";

interface ModalProps {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
}

export function Modal({ aberto, titulo, onFechar, children }: ModalProps) {
  if (!aberto) return null;

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "clamp(12px, 4vw, 16px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--cor-card-fundo)",
          borderRadius: 12,
          padding: "clamp(18px, 5vw, 24px)",
          width: "100%",
          maxWidth: 420,
          // Em telas baixas (celular deitado, formulários longos) o conteúdo
          // rola dentro do modal em vez de estourar a viewport.
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>{titulo}</h2>
          <button
            onClick={onFechar}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--cor-texto-secundario)",
              lineHeight: 1,
            }}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
