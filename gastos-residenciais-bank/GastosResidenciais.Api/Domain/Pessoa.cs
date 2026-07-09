namespace GastosResidenciais.Api.Domain;

/// <summary>
/// Representa uma pessoa cadastrada no sistema de controle de gastos.
/// O Id é gerado automaticamente (Guid), garantindo unicidade sem
/// depender de sequência incremental do banco.
/// </summary>
public class Pessoa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}