// Importa os DTOs usados na entrada e saída da API.
// Exemplo: CriarPessoaDto e PessoaRespostaDto.
using GastosResidenciais.Api.DTOs;

using Microsoft.AspNetCore.Authorization;

// Importa o AppDbContext, que é a classe responsável por acessar o banco de dados.
using GastosResidenciais.Api.Infrastructure;

// Importa recursos do ASP.NET Core MVC, como ControllerBase, ActionResult,
// atributos [HttpGet], [HttpPost], [HttpDelete], etc.
using Microsoft.AspNetCore.Mvc;

// Importa métodos assíncronos do Entity Framework Core,
// como ToListAsync, FirstOrDefaultAsync, SaveChangesAsync etc.
using Microsoft.EntityFrameworkCore;

// Namespace onde ficam os controllers da API.
namespace GastosResidenciais.Api.Controllers;

// [ApiController] indica que essa classe é um controller de API.
// Ele ativa comportamentos automáticos como:
// - validação automática de DTOs
// - respostas 400 em caso de modelo inválido
// - melhor integração com rotas e binding
[ApiController]

// Define a rota base deste controller.
// Como está "pessoas", todas as rotas começam com /pessoas
// Exemplo:
// POST   /pessoas
// GET    /pessoas
// GET    /pessoas/{id}
// DELETE /pessoas/{id}
[Route("pessoas")]
[Authorize]
public class PessoasController : ControllerBase
{
    // Campo privado que guarda a instância do contexto do banco.
    // Ele será usado para acessar a tabela Pessoas.
    private readonly AppDbContext _context;

    // Construtor do controller.
    // O ASP.NET injeta automaticamente o AppDbContext aqui
    // por meio de injeção de dependência.
    public PessoasController(AppDbContext context)
    {
        // Armazena o contexto recebido no campo privado da classe.
        _context = context;
    }

    // <summary>
    // Cria uma nova pessoa.
    // Método responsável por receber os dados do cliente,
    // converter para entidade, salvar no banco e retornar a resposta.
    // </summary>
    [HttpPost] // Indica que esse método responde a requisições HTTP POST em /pessoas
    public async Task<ActionResult<PessoaRespostaDto>> Criar(CriarPessoaDto dto)
    {
        // Converte o DTO recebido em uma entidade Pessoa.
        // Isso evita usar diretamente o DTO na camada de persistência.
        var pessoa = dto.ParaEntidade();

        // Adiciona a nova pessoa ao contexto do EF Core.
        // Nesse momento ainda não salva no banco, apenas marca para inserção.
        _context.Pessoas.Add(pessoa);

        // Persiste a alteração no banco de dados.
        // Aqui o INSERT realmente acontece.
        await _context.SaveChangesAsync();

        // Retorna HTTP 201 Created.
        // CreatedAtAction também informa onde o recurso criado pode ser consultado.
        // nameof(BuscarPorId) => aponta para o método que busca a pessoa por id
        // new { id = pessoa.Id } => valor usado para montar a rota /pessoas/{id}
        // pessoa.ParaDto() => corpo da resposta enviado ao cliente
        return CreatedAtAction(nameof(BuscarPorId), new { id = pessoa.Id }, pessoa.ParaDto());
    }

    // <summary>
    // Lista todas as pessoas cadastradas.
    // </summary>
    [HttpGet] // Responde a GET /pessoas
    public async Task<ActionResult<IEnumerable<PessoaRespostaDto>>> Listar()
    {
        // Busca todas as pessoas da tabela Pessoas.
        // Select(p => p.ParaDto()) converte cada entidade em DTO de resposta.
        // ToListAsync() executa a consulta no banco e retorna uma lista.
        var pessoas = await _context.Pessoas
            .Select(p => p.ParaDto())
            .ToListAsync();

        // Retorna HTTP 200 OK com a lista de pessoas no corpo da resposta.
        return Ok(pessoas);
    }

    // <summary>
    // Busca uma pessoa específica pelo Id.
    // </summary>
    [HttpGet("{id:guid}")] // Responde a GET /pessoas/{id}, exigindo que o id seja um Guid válido
    public async Task<ActionResult<PessoaRespostaDto>> BuscarPorId(Guid id)
    {
        // Procura a primeira pessoa cujo Id seja igual ao id recebido na rota.
        // Se não encontrar, retorna null.
        var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == id);

        // Verifica se nenhuma pessoa foi encontrada.
        if (pessoa is null)
        {
            // Retorna HTTP 404 Not Found com uma mensagem personalizada.
            return NotFound(new { mensagem = "Pessoa não encontrada." });
        }

        // Se encontrou, converte a entidade para DTO e retorna HTTP 200 OK.
        return Ok(pessoa.ParaDto());
    }
    // <summary>
    // Remove uma pessoa.
    // Futuramente, se houver transações associadas, elas poderão ser removidas
    // automaticamente em cascata, dependendo da configuração do relacionamento.
    // </summary>
    [HttpDelete("{id:guid}")] // Responde a DELETE /pessoas/{id}
    public async Task<IActionResult> Deletar(Guid id)
    {
        // Busca a pessoa pelo id informado.
        var pessoa = await _context.Pessoas.FirstOrDefaultAsync(p => p.Id == id);

        // Se não encontrar a pessoa, retorna 404.
        if (pessoa is null)
        {
            return NotFound(new { mensagem = "Pessoa não encontrada." });
        }

        // Marca a pessoa para remoção no contexto.
        _context.Pessoas.Remove(pessoa);

        // Salva a alteração no banco, executando o DELETE.
        await _context.SaveChangesAsync();

        // Retorna HTTP 204 No Content.
        // Significa que a exclusão foi feita com sucesso e não há conteúdo para retornar.
        return NoContent();
    }
}