/*
Componente de UI genérico que desenha um "avatar"
 circular com as iniciais do nome recebido, 
 
 escolhendo a cor de fundo de forma determinística a partir da
 primeira letra do nome (corPorNome). Usado nas tabelas de pessoas e transações.
*/

const CORES = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#14b8a6",
];

function corPorNome(nome: string): string {
  const indice = nome.charCodeAt(0) % CORES.length;
  return CORES[indice];
}

function iniciais(nome: string): string {
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  nome: string;
  tamanho?: number;
}

export function Avatar({ nome, tamanho = 36 }: AvatarProps) {
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: "50%",
        backgroundColor: corPorNome(nome),
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: tamanho * 0.38,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {iniciais(nome)}
    </div>
  );
}
