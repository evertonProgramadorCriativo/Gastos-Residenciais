/*

EXPLICAÇÃO DOS DTOs

DTOS = Objetos de entrada/saída da API (não vão para o banco, servem para validar e formatar dados trocados com o front)

 DTOs (Data Transfer Objects) de entrada e saída da autenticação.
 RegistrarUsuarioDto e LoginDto moldam o corpo esperado pelas rotas
 POST /auth/registrar e /auth/login (com validações via
 DataAnnotations: [Required], [EmailAddress], [MinLength]);
 AuthRespostaDto molda o que a API devolve ao cliente (token JWT,
 nome e e-mail). Usados pelo AuthController.
*/

using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Api.DTOs;

public class RegistrarUsuarioDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "A senha deve ter pelo menos 6 caracteres.")]
    public string Senha { get; set; } = string.Empty;
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}

public class AuthRespostaDto
{
    public string Token { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}