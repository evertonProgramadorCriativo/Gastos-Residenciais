/*

 Controller de autenticação (ASP.NET Core). 
 
 Expõe as rotas públicas

 POST /auth/registrar 
 e POST /auth/login.
 
  Usa PasswordHasher para
 gerar/verificar o hash da senha (nunca salva senha em texto puro)
 
 e JwtTokenGenerator (Infrastructure) para emitir o token JWT que o
 frontend guarda em localStorage (lib/auth.ts) e envia em toda
 requisição via header Authorization: Bearer <token>.

*/


// Importa a entidade Usuario e outras entidades do domínio da aplicação.
using GastosResidenciais.Api.Domain;

// Importa os DTOs utilizados para receber e retornar dados da API.
using GastosResidenciais.Api.DTOs;

// Importa o gerador de tokens JWT da camada de infraestrutura.
using GastosResidenciais.Api.Infrastructure;

// Biblioteca do ASP.NET responsável por gerar e validar hashes de senha.
using Microsoft.AspNetCore.Identity;

// Contém recursos para criação de Controllers e respostas HTTP.
using Microsoft.AspNetCore.Mvc;

// Biblioteca do Entity Framework para consultas assíncronas no banco.
using Microsoft.EntityFrameworkCore;

// Namespace onde ficam os controllers da API.
namespace GastosResidenciais.Api.Controllers;

// <summary>
// Cliente -> POST /auth/registrar -> Verifica se e-mail existe -> Gera hash da senha -> Salva usuário no banco -> Gera JWT -> Retorna token

// Cliente -> POST /auth/login -> Procura usuário pelo e-mail -> Verifica hash da senha -> Gera JWT -> Retorna token

// Indica que esta classe é um Controller de API.
// Habilita validações automáticas e comportamentos específicos do ASP.NET.
// </summary>
[ApiController]

// <summary>
// Define a rota base do controller.
// Todas as rotas começarão com:

// /auth

// Exemplos:
// POST /auth/registrar
// POST /auth/login
// </summary>
[Route("auth")]
public class AuthController : ControllerBase
{
    // <summary>
    // Contexto do banco de dados utilizado para acessar as tabelas.
    // </summary>
    private readonly AppDbContext _context;

    // <summary>
    // Serviço responsável pela geração dos tokens JWT.
    // </summary>
    private readonly JwtTokenGenerator _tokenGenerator;

    // <summary>
    // Classe responsável por gerar e validar hashes de senha.

    // Nunca armazenamos senhas em texto puro no banco.
    // Apenas o hash é salvo.
    // </summary>
    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    // <summary>
    // Construtor do controller.

    // O ASP.NET injeta automaticamente as dependências através do
    // sistema de Injeção de Dependência (Dependency Injection).
    // </summary>
    public AuthController(
        AppDbContext context,
        JwtTokenGenerator tokenGenerator)
    {
        // Armazena a referência do banco de dados.
        _context = context;

        // Armazena a referência do gerador de tokens.
        _tokenGenerator = tokenGenerator;
    }

    // <summary>
    // Cria um novo usuário no sistema e retorna um JWT já autenticado.

    // Endpoint:
    // POST /auth/registrar
    // </summary>
    [HttpPost("registrar")]
    public async Task<ActionResult<AuthRespostaDto>> Registrar(
        RegistrarUsuarioDto dto)
    {
        // Verifica se já existe um usuário utilizando o mesmo e-mail.
        var emailJaExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == dto.Email);

        // Caso o e-mail já exista, retorna HTTP 409 Conflict.
        if (emailJaExiste)
        {
            return Conflict(new
            {
                mensagem = "Já existe um usuário com este e-mail."
            });
        }

        // Cria uma nova entidade Usuario.
        var usuario = new Usuario
        {
            // Copia o nome informado pelo cliente.
            Nome = dto.Nome,

            // Copia o e-mail informado pelo cliente.
            Email = dto.Email
        };

        // Gera o hash seguro da senha.

        // O PasswordHasher utiliza algoritmos modernos como PBKDF2
        // com salt automático.

        // A senha original nunca será salva no banco.
        usuario.SenhaHash = _passwordHasher
            .HashPassword(
                usuario,
                dto.Senha
            );

        // Adiciona o usuário ao contexto do EF Core.
        _context.Usuarios.Add(usuario);

        // Persiste as alterações no banco de dados.
        await _context.SaveChangesAsync();

        // Gera um token JWT para o usuário recém-criado.
        var token = _tokenGenerator.GerarToken(usuario);

        // Retorna HTTP 200 com os dados de autenticação.
        return Ok(new AuthRespostaDto
        {
            // Token JWT utilizado pelo frontend.
            Token = token,

            // Nome do usuário autenticado.
            Nome = usuario.Nome,

            // E-mail do usuário autenticado.
            Email = usuario.Email
        });
    }

    // <summary>
    // Realiza autenticação de um usuário existente.

    // Endpoint:
    // POST /auth/login
    // </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthRespostaDto>> Login(LoginDto dto)
    {
        // Procura o usuário pelo e-mail informado.
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.Email == dto.Email
            );

        // Caso o usuário não exista...
        if (usuario is null)
        {
            // Retorna mensagem genérica por segurança.
            //
            // Isso evita ataques de enumeração de e-mails.
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        // Verifica se a senha informada corresponde ao hash salvo.
        var resultado = _passwordHasher
            .VerifyHashedPassword(
                usuario,
                usuario.SenhaHash,
                dto.Senha
            );

        // Caso a senha esteja incorreta...
        if (resultado == PasswordVerificationResult.Failed)
        {
            // Retorna a mesma mensagem genérica.
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        // Gera um novo token JWT para o usuário autenticado.
        var token = _tokenGenerator.GerarToken(usuario);

        // Retorna os dados de autenticação.
        return Ok(new AuthRespostaDto
        {
            Token = token,
            Nome = usuario.Nome,
            Email = usuario.Email
        });
    }
}