import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { authStorage } from "../lib/auth";

interface AuthContextType {
  nomeUsuario: string | null;
  estaAutenticado: boolean;
  definirSessao: (token: string, nome: string) => void;
  encerrarSessao: () => void;
  mostrarBoasVindas: boolean;
  fecharBoasVindas: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(
    authStorage.obterNome(),
  );

  // Controla a exibição do modal de boas-vindas.
  // Só vira "true" quando definirSessao é chamado a partir de um login/cadastro
  // real (ação do usuário), nunca ao simplesmente recarregar a página com uma
  // sessão já salva no localStorage.
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState(false);

  const definirSessao = useCallback((token: string, nome: string) => {
    authStorage.salvar(token, nome);
    setNomeUsuario(nome);
    setMostrarBoasVindas(true);
  }, []);

  const encerrarSessao = useCallback(() => {
    authStorage.limpar();
    setNomeUsuario(null);
    setMostrarBoasVindas(false);
  }, []);

  const fecharBoasVindas = useCallback(() => {
    setMostrarBoasVindas(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        nomeUsuario,
        estaAutenticado: nomeUsuario !== null,
        definirSessao,
        encerrarSessao,
        mostrarBoasVindas,
        fecharBoasVindas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider.");
  }
  return contexto;
}
