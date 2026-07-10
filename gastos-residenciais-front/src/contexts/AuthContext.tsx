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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(
    authStorage.obterNome(),
  );

  const definirSessao = useCallback((token: string, nome: string) => {
    authStorage.salvar(token, nome);
    setNomeUsuario(nome);
  }, []);

  const encerrarSessao = useCallback(() => {
    authStorage.limpar();
    setNomeUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        nomeUsuario,
        estaAutenticado: nomeUsuario !== null,
        definirSessao,
        encerrarSessao,
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
