namespace GastosResidenciais.Api.Domain;

// <summary>
// Representa um usuário com acesso ao sistema.
// O Id é gerado automaticamente (Guid), garantindo unicidade sem
// depender de sequência incremental do banco.
// </summary>
public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
}