import { useEffect, useState } from "react";
import {
  QUERY_MOBILE_DOWN,
  QUERY_TABELA_DOWN,
  QUERY_TABLET_DOWN,
} from "../lib/breakpoints";

/**
 * Observa uma media query e retorna se ela está ativa no momento,
 * atualizando automaticamente quando a tela é redimensionada.
 *
 * Exemplo: const ehTelaPequena = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [corresponde, setCorresponde] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Garante o valor correto caso a query tenha mudado entre renders.
    setCorresponde(mediaQueryList.matches);

    const listener = (evento: MediaQueryListEvent) =>
      setCorresponde(evento.matches);

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return corresponde;
}

/** true para telas de tablet ou menores (<= 768px). */
export function useEhTablet(): boolean {
  return useMediaQuery(QUERY_TABLET_DOWN);
}

/** true para telas de celular (<= 480px). */
export function useEhMobile(): boolean {
  return useMediaQuery(QUERY_MOBILE_DOWN);
}

/** true quando tabelas devem virar cards empilhados (<= 640px). */
export function useEhTabela(): boolean {
  return useMediaQuery(QUERY_TABELA_DOWN);
}
