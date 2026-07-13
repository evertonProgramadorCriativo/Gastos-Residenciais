/*

 Entidade de domínio que representa um usuário com acesso ao
 sistema (login). 
 
 Guarda o e-mail e o hash da senha (SenhaHash,
 nunca a senha em texto puro), gerado pelo AuthController via
 PasswordHasher.
 
  É a entidade central usada por AuthController e
 JwtTokenGenerator para autenticação.
// */

namespace GastosResidenciais.Api.Domain;


public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
}