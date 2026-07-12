import { useState, useMemo } from "react";
import { Modal } from "../ui/Modal";
import { CATEGORIA_LABEL } from "../../lib/categorias";
import type { Pessoa } from "../../types/pessoa";
import type {
  CriarTransacaoInput,
  TipoTransacao,
  CategoriaTransacao,
} from "../../types/transacao";

interface TransacaoFormModalProps {
  aberto: boolean;
  pessoas: Pessoa[];
  onFechar: () => void;
  onCriar: (dados: CriarTransacaoInput) => Promise<void>;
}

const CATEGORIAS = Object.keys(CATEGORIA_LABEL) as CategoriaTransacao[];

export function TransacaoFormModal({
  aberto,
  pessoas,
  onFechar,
  onCriar,
}: TransacaoFormModalProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [categoria, setCategoria] = useState<CategoriaTransacao>("Outros");
  const [pessoaId, setPessoaId] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoas, pessoaId],
  );
  const pessoaEhMenorDeIdade = (pessoaSelecionada?.idade ?? 0) < 18;

  const resetar = () => {
    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setCategoria("Outros");
    setPessoaId("");
    setErro(null);
  };

  const handleFechar = () => {
    resetar();
    onFechar();
  };

  const handleSelecionarPessoa = (id: string) => {
    setPessoaId(id);
    const pessoa = pessoas.find((p) => p.id === id);
    if (pessoa && pessoa.idade < 18 && tipo === "Receita") {
      setTipo("Despesa");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!descricao.trim()) {
      setErro("Informe a descrição.");
      return;
    }
    const valorNumero = Number(valor);
    if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    if (!pessoaId) {
      setErro("Selecione uma pessoa.");
      return;
    }

    setEnviando(true);
    try {
      await onCriar({
        descricao: descricao.trim(),
        valor: valorNumero,
        tipo,
        categoria,
        data: new Date().toISOString(),
        pessoaId,
      });
      resetar();
      onFechar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar transação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal aberto={aberto} titulo="Nova Transação" onFechar={handleFechar}>
      <form onSubmit={handleSubmit}>
        <div style={estiloCampo}>
          <label htmlFor="pessoa" style={estiloLabel}>
            Pessoa
          </label>
          <select
            id="pessoa"
            value={pessoaId}
            onChange={(e) => handleSelecionarPessoa(e.target.value)}
            disabled={enviando}
            style={estiloInput}
          >
            <option value="">Selecione...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>
        </div>

        <div style={estiloCampo}>
          <label htmlFor="descricao" style={estiloLabel}>
            Descrição
          </label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={enviando}
            style={estiloInput}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ ...estiloCampo, flex: 1 }}>
            <label htmlFor="valor" style={estiloLabel}>
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
              style={estiloInput}
            />
          </div>

          <div style={{ ...estiloCampo, flex: 1 }}>
            <label htmlFor="tipo" style={estiloLabel}>
              Tipo
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoTransacao)}
              disabled={enviando}
              style={estiloInput}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita" disabled={pessoaEhMenorDeIdade}>
                Receita
              </option>
            </select>
          </div>
        </div>

        {pessoaEhMenorDeIdade && (
          <p
            style={{
              fontSize: 13,
              color: "var(--cor-texto-secundario)",
              marginTop: -8,
              marginBottom: 16,
            }}
          >
            Pessoas menores de 18 anos só podem registrar despesas.
          </p>
        )}

        <div style={estiloCampo}>
          <label htmlFor="categoria" style={estiloLabel}>
            Categoria
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaTransacao)}
            disabled={enviando}
            style={estiloInput}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        {erro && (
          <p
            style={{ color: "var(--cor-erro)", fontSize: 14, marginBottom: 16 }}
          >
            {erro}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
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

const estiloCampo: React.CSSProperties = { marginBottom: 16 };
const estiloLabel: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  marginBottom: 6,
};
const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--cor-borda)",
  borderRadius: "var(--raio-borda)",
  fontSize: 14,
  boxSizing: "border-box",
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
