/*
 Serviço de infraestrutura responsável
 
por gerar o token JWT assinado após 
um login/registro bem-sucedido (chamado pelo AuthController). 
 
 Lê a chave secreta, emissor, audiência e tempo de
 expiração da configuração (appsettings.json),
 
  monta as claims do usuário (Sub, Email, Nome)
 
  e devolve o token pronto para ser
 enviado ao frontend, que o guarda via lib/auth.ts.
*/

// Biblioteca responsável por criar, ler e manipular tokens JWT.
using System.IdentityModel.Tokens.Jwt;

// Contém as classes relacionadas às Claims (informações do usuário no token).
using System.Security.Claims;

// Fornece suporte para manipulação de texto e codificações como UTF8.
using System.Text;

// Importa a entidade Usuario do domínio da aplicação.
using GastosResidenciais.Api.Domain;

// Contém classes para assinatura, validação e segurança do JWT.
using Microsoft.IdentityModel.Tokens;

// Namespace onde ficam as classes de infraestrutura da aplicação,
// como acesso ao banco, autenticação e geração de tokens.
namespace GastosResidenciais.Api.Infrastructure;

// <summary>
// Responsável por gerar o token JWT assinado para um usuário autenticado.

// O JWT é enviado ao cliente após o login e será utilizado para
// autenticar futuras requisições para a API.

// A chave secreta e o tempo de expiração vêm da configuração
// (appsettings.json ou variável de ambiente), nunca devem ficar
// escritas diretamente no código.
// </summary>
public class JwtTokenGenerator
{
    // Objeto utilizado para acessar configurações da aplicação,
    // como Jwt:ChaveSecreta, Jwt:Emissor e Jwt:Audiencia.
    private readonly IConfiguration _configuration;

    // <summary>
    // Construtor da classe.
    // O ASP.NET injeta automaticamente o IConfiguration através
    // do sistema de Injeção de Dependência (Dependency Injection).
    // </summary>
    public JwtTokenGenerator(IConfiguration configuration)
    {
        // Guarda a referência da configuração para uso posterior.
        _configuration = configuration;
    }

    // <summary>
    // Gera um token JWT para o usuário autenticado.

    // Recebe um objeto Usuario e retorna uma string contendo
    // o token JWT pronto para ser enviado ao frontend.
    // </summary>
    public string GerarToken(Usuario usuario)
    {
        // Obtém a chave secreta do arquivo de configuração.

        // Exemplo no appsettings.json:

        // "Jwt": {
        //   "ChaveSecreta": "minha-chave-super-secreta"
        // }
        var chaveSecreta = _configuration["Jwt:ChaveSecreta"]

            // Caso a chave não exista, lança uma exceção e impede
            // a geração de tokens inválidos.
            ?? throw new InvalidOperationException(
                "Jwt:ChaveSecreta não configurada."
            );

        // Converte a chave secreta em bytes UTF8.
        // O algoritmo HMAC trabalha utilizando bytes e não strings.
        var chave = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(chaveSecreta)
        );

        // Define qual algoritmo será utilizado para assinar o token.
        //
        // HmacSha256 é o algoritmo mais comum para JWT simétrico.
        var credenciais = new SigningCredentials(
            chave,
            SecurityAlgorithms.HmacSha256
        );

        // Claims são as informações armazenadas dentro do token.

        // Essas informações poderão ser recuperadas posteriormente
        // pelo backend durante a autenticação.
        var claims = new[]
        {
            // Subject (Sub) representa o identificador único do usuário.
            new Claim(
                JwtRegisteredClaimNames.Sub,
                usuario.Id.ToString()
            ),

            // Armazena o e-mail do usuário.
            new Claim(
                JwtRegisteredClaimNames.Email,
                usuario.Email
            ),

            // Nome amigável do usuário.
            new Claim(
                ClaimTypes.Name,
                usuario.Nome
            ),
        };

        // Obtém o tempo de expiração do token em minutos.

        // Caso a configuração não exista, utiliza 120 minutos
        // como valor padrão.
        var expiracaoMinutos = int.Parse(
            _configuration["Jwt:ExpiracaoMinutos"] ?? "120"
        );

        // Cria efetivamente o objeto JWT.
        var token = new JwtSecurityToken(

            // Identifica quem emitiu o token.
            // Exemplo:
            // "GastosResidenciais.Api"
            issuer: _configuration["Jwt:Emissor"],

            // Identifica quem pode consumir o token.
            // Exemplo:
            // "GastosResidenciais.Frontend"
            audience: _configuration["Jwt:Audiencia"],

            // Informações armazenadas dentro do token.
            claims: claims,

            // Define a data e hora de expiração.
            expires: DateTime.UtcNow.AddMinutes(
                expiracaoMinutos
            ),

            // Define as credenciais e algoritmo utilizados
            // para assinar digitalmente o token.
            signingCredentials: credenciais
        );

        // Converte o objeto JwtSecurityToken em uma string JWT.

        // Exemplo:

        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}