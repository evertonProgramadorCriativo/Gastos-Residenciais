using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Infrastructure;

/// <summary>
/// Contexto principal do EF Core para acesso ao banco PostgreSQL.
/// Neste bloco ainda está vazio  
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
}