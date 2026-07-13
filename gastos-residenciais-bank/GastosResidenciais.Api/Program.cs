/*
 Ponto de entrada principal da API

 Usa WebApplication.CreateBuilder para registrar todos os
 serviços necessários
 
  (Controllers, Swagger, AppDbContext/PostgreSQL,
 JwtTokenGenerator, autenticação JWT, autorização, CORS liberado
 para o frontend em localhost:5173/3000)
 
  e, em seguida, monta o
 pipeline de middlewares na ordem correta 
 (UseCors -> UseAuthentication -> UseAuthorization -> MapControllers) antes de subir o servidor com app.Run().
*/

// Biblioteca utilizada para converter strings em bytes UTF8.
// Será usada para transformar a chave secreta JWT em bytes.
using System.Text;

// Importa o AppDbContext e o JwtTokenGenerator da camada Infrastructure.
using GastosResidenciais.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
// Contém as classes necessárias para autenticação JWT.
using Microsoft.AspNetCore.Authentication.JwtBearer;

// Biblioteca principal do Entity Framework Core.
using Microsoft.EntityFrameworkCore;

// Permite configurar serialização JSON, incluindo enums como texto.
using System.Text.Json.Serialization;

// Contém classes relacionadas à segurança e validação do JWT.
using Microsoft.IdentityModel.Tokens;

//Fluxo de uma requisição protegida
// Cliente -> Authorization: Bearer eyJhbGciOi... -> UseAuthentication() -> JWT é validado -> UseAuthorization() -> [Authorize] -> Controller -> Resposta



// Cria o objeto principal da aplicação ASP.NET.
// Aqui são carregados configuração, serviços e dependências.
var builder = WebApplication.CreateBuilder(args);



// Configuração dos Controllers da API


// Registra o suporte aos Controllers ([ApiController]).
builder.Services.AddControllers()

    // Configura opções da serialização JSON.
    .AddJsonOptions(options =>
    {
        // Faz com que enums sejam enviados como texto
        // em vez de números.

        // Sem isso:
        // {
        //   "tipo": 0
        // }

        // Com isso:
        // {
        //   "tipo": "Receita"
        // }
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());
    });


// Habilita recursos necessários para Swagger/OpenAPI.
builder.Services.AddEndpointsApiExplorer();

// Registra o gerador da documentação Swagger.
builder.Services.AddSwaggerGen();



// Configuração do banco PostgreSQL


// Registra o AppDbContext no sistema de Injeção de Dependência.

// O AddDbContext cria automaticamente uma instância do contexto
// para cada requisição HTTP.
builder.Services.AddDbContext<AppDbContext>(options =>

    // Define que será utilizado PostgreSQL através do Npgsql.
    options.UseNpgsql(

        // Obtém a string de conexão do appsettings.json.
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    )
);



// Registro do serviço responsável por gerar JWT


// AddScoped significa:

// - Uma instância por requisição HTTP.
// - Todos os controllers da mesma requisição compartilham
//   o mesmo objeto.

// É o tempo de vida recomendado para serviços de aplicação.
builder.Services.AddScoped<JwtTokenGenerator>();



// Configuração da autenticação JWT


// Obtém a chave secreta utilizada para assinar os tokens.
var chaveSecreta =
    builder.Configuration["Jwt:ChaveSecreta"]

    // Se não existir configuração, interrompe a inicialização.
    ?? throw new InvalidOperationException(
        "Jwt:ChaveSecreta não configurada."
    );


// Registra o sistema de autenticação.
builder.Services

    // Configura o esquema padrão da aplicação.
    .AddAuthentication(options =>
    {
        // Define qual mecanismo será utilizado para autenticar.
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        // Define qual mecanismo será utilizado quando
        // o usuário tentar acessar uma rota protegida sem token.
        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })

    // Adiciona suporte ao Bearer Token JWT.
    .AddJwtBearer(options =>
    {
        // Define as regras de validação do token.
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                // Verifica se o emissor do token é válido.
                ValidateIssuer = true,

                // Verifica se o destinatário do token é válido.
                ValidateAudience = true,

                // Verifica se o token expirou.
                ValidateLifetime = true,

                // Verifica se a assinatura do token é válida.
                ValidateIssuerSigningKey = true,

                // Emissor esperado.
                ValidIssuer =
                    builder.Configuration["Jwt:Emissor"],

                // Aplicação que pode consumir o token.
                ValidAudience =
                    builder.Configuration["Jwt:Audiencia"],

                // Chave utilizada para validar a assinatura.
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            chaveSecreta
                        )
                    )
            };
    });



// Sistema de autorização


// Habilita o uso do atributo [Authorize].
builder.Services.AddAuthorization();


// 
// Configuração do CORS
// 

// Nome da política de CORS.
const string FrontendPolicy = "FrontendPolicy";

// Registra as regras de CORS.
builder.Services.AddCors(options =>
{
    // Cria uma política chamada FrontendPolicy.
    options.AddPolicy(
        FrontendPolicy,
        policy =>
        {
            policy

                // Lista de origens autorizadas.
                .WithOrigins(
                    "http://localhost:5173", // Vite
                    "http://localhost:3000"  // React padrão
                )

                // Permite qualquer header HTTP.
                .AllowAnyHeader()

                // Permite GET, POST, PUT, DELETE etc.
                .AllowAnyMethod();
        });
});


// 
// Construção da aplicação
// 

// Cria efetivamente a aplicação ASP.NET.
var app = builder.Build();



// Middleware do Swagger


// Executa apenas em ambiente Development.
if (app.Environment.IsDevelopment())
{
    // Gera o arquivo OpenAPI.
    app.UseSwagger();

    // Interface visual do Swagger.
    app.UseSwaggerUI();
}


// Redireciona automaticamente HTTP para HTTPS.
app.UseHttpsRedirection();


// Ativa a política de CORS definida anteriormente.
app.UseCors(FrontendPolicy);



// Middleware de autenticação e autorização


// Identifica quem é o usuário.
app.UseAuthentication();

// Verifica se o usuário possui permissão.
app.UseAuthorization();


// Mapeia automaticamente todos os Controllers.
app.MapControllers();


// Inicia o servidor web e começa a receber requisições.
app.Run();