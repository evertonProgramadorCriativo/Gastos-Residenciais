import { useEffect, useRef, useState } from "react";

/**
 * Anima um número, contando suavemente do valor anterior até `valorFinal`.
 * Usa requestAnimationFrame (sem libs externas) com easing "ease-out cubic".
 *
 * Sempre que `valorFinal` mudar (ex: nova transação alterou o total),
 * a animação recomeça do valor atualmente exibido até o novo valor.
 */
export function useContadorAnimado(valorFinal: number, duracaoMs = 800) {
  const [valorAnimado, setValorAnimado] = useState(0);
  const valorAnteriorRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const valorInicial = valorAnteriorRef.current;
    const diferenca = valorFinal - valorInicial;
    const inicioTempo = performance.now();

    function animar(agora: number) {
      const decorrido = agora - inicioTempo;
      const progresso = Math.min(decorrido / duracaoMs, 1);
      // easing "ease-out cubic": começa rápido, desacelera no final
      const progressoSuavizado = 1 - Math.pow(1 - progresso, 3);

      setValorAnimado(valorInicial + diferenca * progressoSuavizado);

      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(animar);
      } else {
        valorAnteriorRef.current = valorFinal;
      }
    }

    frameRef.current = requestAnimationFrame(animar);

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [valorFinal, duracaoMs]);

  return valorAnimado;
}
