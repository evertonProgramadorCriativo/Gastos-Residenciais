using GastosResidenciais.Api.Domain;
using GastosResidenciais.Api.DTOs;
using GastosResidenciais.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
namespace GastosResidenciais.Api.Controllers;

[ApiController]
[Route("totais")]
[Authorize]

public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    // <summary>
    // Lista todas as pessoas com o total de receitas, despesas e saldo
    // de cada uma, seguido do total geral consolidado de todas juntas.
    // A agregação é feita em memória (após trazer as transações do banco)
    // porque o volume de dados esperado para este sistema é baixo (uso
    // residencial) ,não há necessidade de otimizar com agregação SQL pura.
    // </summary>
    [HttpGet]
    public async Task<ActionResult<RelatorioTotaisDto>> ObterTotais()
    {
        var pessoas = await _context.Pessoas.ToListAsync();
        var transacoes = await _context.Transacoes.ToListAsync();

        var totaisPorPessoa = pessoas.Select(pessoa =>
        {
            var transacoesDaPessoa = transacoes.Where(t => t.PessoaId == pessoa.Id);

            var totalReceitas = transacoesDaPessoa
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var totalDespesas = transacoesDaPessoa
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return new TotalPorPessoaDto
            {
                PessoaId = pessoa.Id,
                Nome = pessoa.Nome,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            };
        }).ToList();

        var totalGeral = new TotalGeralDto
        {
            TotalReceitas = totaisPorPessoa.Sum(p => p.TotalReceitas),
            TotalDespesas = totaisPorPessoa.Sum(p => p.TotalDespesas),
            SaldoLiquido = totaisPorPessoa.Sum(p => p.Saldo)
        };

        return Ok(new RelatorioTotaisDto
        {
            Pessoas = totaisPorPessoa,
            TotalGeral = totalGeral
        });
    }
}