
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
    // Representa a tabela "Transacoes" no banco de dados.
    // Com esse DbSet você consegue consultar, adicionar, editar e remover transações.
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    public DbSet<Usuario> Usuarios => Set<Usuario>();

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
        // servem para configurar o mapeamento das entidades. 
        // Aqui você define regras como: 
        // - campos obrigatórios 
        // - tamanho máximo de texto
        // - nomes de tabelas/colunas
        // - relacionamentos entre entidades
        // Configura a entidade Transacao.
        // O EF vai aplicar essas regras ao criar ou interpretar a tabela correspondente.
        modelBuilder.Entity<Transacao>(entity =>
        {
            // Configura a propriedade Descricao da entidade Transacao.
            // IsRequired() => campo obrigatório (NOT NULL no banco).
            // HasMaxLength(200) => limita o tamanho do texto a 200 caracteres.
            entity.Property(t => t.Descricao).IsRequired().HasMaxLength(200);

            // Precisão explícita para valores monetários — sem isso o Postgres
            // pode usar um numeric sem escala definida, gerando warning do EF.
            entity.Property(t => t.Valor).HasColumnType("numeric(18,2)");

            // Salva o enum como texto ('Receita'/'Despesa') em vez de inteiro,
            // deixando a tabela legível direto no psql.
            entity.Property(t => t.Tipo).HasConversion<string>();
            // Configura o relacionamento entre Transacao e Pessoa.
            // Uma transação pertence a uma pessoa (PessoaId é a FK).
            // OnDelete(DeleteBehavior.Cascade) => ao excluir uma pessoa, exclua também as transações associadas.
            // Mesma estratégia do Tipo: salva como texto legível no banco,
            // e define um valor padrão para linhas que já existiam antes
            // desta coluna existir (migration não quebra dados antigos).
            entity.Property(t => t.Categoria)
                  .HasConversion<string>()
                  .HasDefaultValue(CategoriaTransacao.Outros);
            entity.HasOne(t => t.Pessoa)
                  .WithMany()
                  .HasForeignKey(t => t.PessoaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        // Configura a entidade Usuario.
        // O EF vai aplicar essas regras ao criar ou interpretar a tabela correspondente.
        modelBuilder.Entity<Usuario>(entity =>
     {
         entity.Property(u => u.Nome).IsRequired().HasMaxLength(150);
         entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
         entity.Property(u => u.SenhaHash).IsRequired();

         // Impede dois usuários com o mesmo e-mail.
         entity.HasIndex(u => u.Email).IsUnique();
     });
    }

}