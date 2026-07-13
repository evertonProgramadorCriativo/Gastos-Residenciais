import type { TotalPorPessoa } from "../../types/totais";
import "./animacoes.css";

interface GraficoGastosPorPessoaProps {
  dados: TotalPorPessoa[];
}
/*
 Gráfico de barras comparando receitas x despesas de cada pessoa,
 calculando a proporção de cada barra a
 partir do maior valor entre todas as pessoas. 
 Recebe a lista de TotalPorPessoa via props.

*/

const formatarMoedaCompacta = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export function GraficoGastosPorPessoa({ dados }: GraficoGastosPorPessoaProps) {
  const maiorValor = Math.max(
    ...dados.map((p) => Math.max(p.totalReceitas, p.totalDespesas)),
    0,
  );
  const semDados = dados.length === 0 || maiorValor === 0;

  const dadosOrdenados = [...dados].sort(
    (a, b) =>
      b.totalReceitas + b.totalDespesas - (a.totalReceitas + a.totalDespesas),
  );

  return (
    <div
      style={{
        backgroundColor: "var(--cor-card-fundo)",
        border: "1px solid var(--cor-borda)",
        borderRadius: 12,
        padding: "var(--espaco-card)",
        boxShadow: "var(--sombra-card)",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Gastos por pessoa</h3>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--cor-texto-secundario)",
            }}
          >
            Receitas e despesas de cada morador
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, flexShrink: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--cor-sucesso)",
              }}
            />
            Receita
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--cor-erro)",
              }}
            />
            Despesa
          </span>
        </div>
      </div>

      {semDados ? (
        <p
          style={{
            color: "var(--cor-texto-secundario)",
            fontSize: 14,
            marginTop: 16,
          }}
        >
          Sem movimentações ainda.
        </p>
      ) : (
        // Em telas estreitas as barras continuam com o mesmo tamanho legível
        // e a área rola horizontalmente — melhor que espremer os valores.
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            marginTop: 20,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 48,
              height: 300,
              padding: "0 8px 8px",
              width: "max-content",
            }}
          >
            {dadosOrdenados.map((pessoa, indice) => {
              const alturaReceita =
                maiorValor > 0 ? (pessoa.totalReceitas / maiorValor) * 100 : 0;
              const alturaDespesa =
                maiorValor > 0 ? (pessoa.totalDespesas / maiorValor) * 100 : 0;
              const atrasoBarra = indice * 60;

              return (
                <div
                  key={pessoa.pessoaId}
                  className="dashboard-linha-anim"
                  style={{
                    flexShrink: 0,
                    width: 110,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    gap: 10,
                    animationDelay: `${atrasoBarra}ms`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 14,
                      height: 230,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--cor-sucesso)",
                          fontWeight: 600,
                          marginBottom: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatarMoedaCompacta(pessoa.totalReceitas)}
                      </span>
                      <div
                        className="dashboard-barra-anim"
                        title={`Receitas: ${formatarMoedaCompacta(pessoa.totalReceitas)}`}
                        style={{
                          width: 38,
                          height: `${Math.max(alturaReceita, pessoa.totalReceitas > 0 ? 2 : 0)}%`,
                          backgroundColor: "var(--cor-sucesso)",
                          borderRadius: "6px 6px 0 0",
                          transition: "height 0.3s ease",
                          animationDelay: `${atrasoBarra}ms`,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--cor-erro)",
                          fontWeight: 600,
                          marginBottom: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatarMoedaCompacta(pessoa.totalDespesas)}
                      </span>
                      <div
                        className="dashboard-barra-anim"
                        title={`Despesas: ${formatarMoedaCompacta(pessoa.totalDespesas)}`}
                        style={{
                          width: 38,
                          height: `${Math.max(alturaDespesa, pessoa.totalDespesas > 0 ? 2 : 0)}%`,
                          backgroundColor: "var(--cor-erro)",
                          borderRadius: "6px 6px 0 0",
                          transition: "height 0.3s ease",
                          animationDelay: `${atrasoBarra + 40}ms`,
                        }}
                      />
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                    title={pessoa.nome}
                  >
                    {pessoa.nome.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
