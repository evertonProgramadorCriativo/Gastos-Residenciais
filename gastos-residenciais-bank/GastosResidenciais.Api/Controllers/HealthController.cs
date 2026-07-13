/*
 Controller utilitário de infraestrutura, sem relação com as regras
 de negócio do sistema. 

 Expõe GET /health/db, 
 
 que apenas verifica se
 a API consegue abrir uma conexão real com o PostgreSQL via
 AppDbContext 
 
 Isso é útil para checar se o container do banco subiu
 corretamente (ex.: depois de "docker compose up").
*/

using GastosResidenciais.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    // <summary>
    // Verifica se a API consegue abrir uma conexão real com o PostgreSQL.
    // Usado apenas para validação de infraestrutura.
    // </summary>
    [HttpGet("db")]
    public async Task<IActionResult> CheckDatabaseConnection()
    {
        var canConnect = await _context.Database.CanConnectAsync();

        return canConnect
            ? Ok(new { status = "ok", database = "conectado" })
            : StatusCode(503, new { status = "error", database = "sem conexão" });
    }
}