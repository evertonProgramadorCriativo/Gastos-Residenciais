/*
EXPLICAÇÃO DOS DTOs

DOTS = Objetos de entrada/saída da API (não vão para o banco, servem para validar e formatar dados trocados com o front)

 DTOs de saída do relatório de totais, devolvidos pelo
 TotaisController na rota GET /totais. 
 
 TotalPorPessoaDto representa
 os totais individuais de cada pessoa;
 
  TotalGeralDto representa a
 soma consolidada da residência;
 
  RelatorioTotaisDto é o envelope que
 agrupa os dois. Espelham exatamente os tipos types/totais.ts do frontend.
*/

namespace GastosResidenciais.Api.DTOs;

// <summary>Totais de receitas, despesas e saldo de uma pessoa específica.</summary>
public class TotalPorPessoaDto
{
    public Guid PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}

// <summary>Totais consolidados de todas as pessoas somadas.</summary>
public class TotalGeralDto
{
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal SaldoLiquido { get; set; }
}

// <summary>Resposta completa do endpoint de totais: por pessoa + geral.</summary>
public class RelatorioTotaisDto
{
    public List<TotalPorPessoaDto> Pessoas { get; set; } = new();
    public TotalGeralDto TotalGeral { get; set; } = new();
}