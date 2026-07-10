using GastosResidenciais.Api.DTOs;
using GastosResidenciais.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("transacoes")]
[Authorize]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // GET /transacoes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoRespostaDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .AsNoTracking()
            .OrderByDescending(t => t.Data)
            .Select(t => t.ParaDto())
            .ToListAsync();

        return Ok(transacoes);
    }

    // GET /pessoas/{pessoaId}/transacoes
    [HttpGet("/pessoas/{pessoaId:guid}/transacoes")]
    public async Task<ActionResult<IEnumerable<TransacaoRespostaDto>>> ListarPorPessoa(Guid pessoaId)
    {
        var transacoes = await _context.Transacoes
            .AsNoTracking()
            .Where(t => t.PessoaId == pessoaId)
            .OrderByDescending(t => t.Data)
            .Select(t => t.ParaDto())
            .ToListAsync();

        return Ok(transacoes);
    }

    // POST /transacoes
    [HttpPost]
    public async Task<ActionResult<TransacaoRespostaDto>> Criar([FromBody] CriarTransacaoDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var pessoaExiste = await _context.Pessoas
            .AnyAsync(p => p.Id == dto.PessoaId);

        if (!pessoaExiste)
            return BadRequest(new { mensagem = "Pessoa não encontrada." });

        var transacao = dto.ParaEntidade();

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return Created($"/transacoes/{transacao.Id}", transacao.ParaDto());
    }

    // DELETE /transacoes/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var transacao = await _context.Transacoes.FirstOrDefaultAsync(t => t.Id == id);

        if (transacao is null)
            return NotFound(new { mensagem = "Transação não encontrada." });

        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}