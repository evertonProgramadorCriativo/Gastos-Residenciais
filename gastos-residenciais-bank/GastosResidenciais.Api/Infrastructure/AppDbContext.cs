
// Importa o namespace onde está a entidade Pessoa.
// Essa classe representa a tabela/objeto de domínio que será salva no banco.
using GastosResidenciais.Api.Domain;

// Importa o Entity Framework Core.
// Ele fornece as classes DbContext, DbSet, ModelBuilder etc.
using Microsoft.EntityFrameworkCore;

// Define o namespace da camada de infraestrutura do projeto.
// Normalmente aqui ficam classes de acesso a banco, repositórios, contextos, etc.
namespace GastosResidenciais.Api.Infrastructure;

/// <summary>
/// Contexto principal do EF Core para acesso ao banco PostgreSQL.
/// O DbContext é a classe responsável por representar a conexão com o banco
/// e mapear as entidades da aplicação para tabelas.
/// </summary>
public class AppDbContext : DbContext
{
    // Construtor do contexto.
    // Recebe as opções de configuração do DbContext
    // (como string de conexão, provedor PostgreSQL, etc.)
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) // Envia as opções para a classe base DbContext.
    {
    }

    // Representa a tabela "Pessoas" no banco de dados.
    // Com esse DbSet você consegue consultar, adicionar, editar e remover pessoas.
    // Exemplo:
    // _context.Pessoas.Add(novaPessoa);
    // var lista = _context.Pessoas.ToList();
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();

    // Método chamado pelo EF Core para configurar o mapeamento das entidades.
    // Aqui você define regras como:
    // - campos obrigatórios
    // - tamanho máximo de texto
    // - nomes de tabelas/colunas
    // - relacionamentos entre entidades
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configura a entidade Pessoa.
        // O EF vai aplicar essas regras ao criar ou interpretar a tabela correspondente.
        modelBuilder.Entity<Pessoa>(entity =>
        {
            // Configura a propriedade Nome da entidade Pessoa.
            // IsRequired() => campo obrigatório (NOT NULL no banco).
            // HasMaxLength(150) => limita o tamanho do texto a 150 caracteres.
            entity.Property(p => p.Nome).IsRequired().HasMaxLength(150);

            // Configura a propriedade Idade.
            // IsRequired() => campo obrigatório (não pode ser nulo).
            entity.Property(p => p.Idade).IsRequired();
        });
    }
}

