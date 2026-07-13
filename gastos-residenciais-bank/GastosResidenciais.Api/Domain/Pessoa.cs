/*
 Entidade de domínio que representa uma pessoa cadastrada no sistema
 
 (o "esqueleto" da tabela Pessoas em memória, mapeado pelo EF Core
 via AppDbContext).
 
  O Id é gerado como Guid no próprio C#, sem
 depender de sequência do banco. Espelhada no frontend por types/pessoa.ts.
*/

namespace GastosResidenciais.Api.Domain;

// <summary>
// Representa uma pessoa cadastrada no sistema de controle de gastos.
// O Id é gerado automaticamente (Guid), garantindo unicidade sem
// depender de sequência incremental do banco.
// </summary>
public class Pessoa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}