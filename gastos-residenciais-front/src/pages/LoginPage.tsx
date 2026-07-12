import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Wallet } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
type Modo = "login" | "registrar";

export function LoginPage() {
  const navigate = useNavigate();
  const { definirSessao } = useAuth();

  const [modo, setModo] = useState<Modo>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta =
        modo === "login"
          ? await authService.login({ email, senha })
          : await authService.registrar({ nome, email, senha });

      definirSessao(resposta.token, resposta.nome);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao autenticar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--cor-fundo)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "var(--cor-card-fundo)",
          borderRadius: 12,
          padding: 32,
          boxShadow: "var(--sombra-card)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "var(--cor-primaria)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            <Wallet size={20} color="white" />
          </div>
          <strong style={{ fontSize: 18 }}>Gastos Residenciais</strong>
        </div>

        <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>
          {modo === "login" ? "Bem-vindo de volta" : "Criar sua conta"}
        </h1>
        <p
          style={{
            color: "var(--cor-texto-secundario)",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          {modo === "login"
            ? "Acesse sua conta para continuar gerenciando os gastos."
            : "Preencha os dados para começar a usar o sistema."}
        </p>

        <form onSubmit={handleSubmit}>
          {modo === "registrar" && (
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
                required
                style={estiloInput}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: 14, marginBottom: 6 }}
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={enviando}
              required
              style={estiloInput}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="senha"
              style={{ display: "block", fontSize: 14, marginBottom: 6 }}
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={enviando}
              required
              minLength={6}
              style={estiloInput}
            />
          </div>

          {erro && (
            <p
              style={{
                color: "var(--cor-erro)",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--cor-primaria)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--raio-borda)",
              fontSize: 15,
              fontWeight: 600,
              cursor: enviando ? "default" : "pointer",
              opacity: enviando ? 0.7 : 1,
            }}
          >
            {enviando
              ? "Aguarde..."
              : modo === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            marginTop: 20,
            color: "var(--cor-texto-secundario)",
          }}
        >
          {modo === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setModo(modo === "login" ? "registrar" : "login");
              setErro(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--cor-primaria)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              padding: 0,
            }}
          >
            {modo === "login" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

const estiloInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--cor-borda)",
  borderRadius: "var(--raio-borda)",
  fontSize: 14,
};
