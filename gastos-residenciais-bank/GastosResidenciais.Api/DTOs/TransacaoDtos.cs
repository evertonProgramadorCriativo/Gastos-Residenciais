// Importa atributos de validação do .NET.

// Esses atributos são utilizados para validar automaticamente
// os dados recebidos pela API antes mesmo do Controller executar.

// Exemplos:
// [Required]
// [Range]
// [MaxLength]
using System.ComponentModel.DataAnnotations;

// Importa as entidades do domínio da aplicação,
// como Transacao e TipoTransacao.
using GastosResidenciais.Api.Domain;

// Namespace responsável pelos DTOs (Data Transfer Objects).
//
// DTOs são objetos utilizados para transportar dados
// entre cliente e servidor sem expor diretamente
// as entidades do banco de dados.
namespace GastosResidenciais.Api.DTOs;


// <summary>
// DTO utilizado para receber os dados enviados pelo cliente
// ao criar uma nova transação.
//
// Exemplo JSON:
//
// {
//   "descricao": "Mercado",
//   "valor": 250.50,
//   "tipo": 1,
//   "data": "2026-07-09T15:00:00Z",
//   "pessoaId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
// }
// </summary>
public class CriarTransacaoDto
{
    //<summary>
    // Descrição da transação.
    //
    // O atributo [Required] obriga o envio desse campo.
    //
    // ErrorMessage define a mensagem retornada pela API
    // caso a validação falhe.
    // </summary>
    [Required(ErrorMessage = "A descrição é obrigatória.")]

    // <summary>
    // Limita o tamanho máximo da descrição para 200 caracteres.
    // Isso evita textos muito grandes no banco.
    // </summary>
    [MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    // <summary>
    // Valor financeiro da transação.

    // [Range] garante que o valor seja maior que zero.

    // Não faz sentido existir uma transação com valor
    // igual a zero ou negativo.
    // </summary>
    [Range(
        0.01,
        double.MaxValue,
        ErrorMessage = "O valor deve ser maior que zero."
    )]
    public decimal Valor { get; set; }

    // <summary>
    // Tipo da transação:

    // Receita = 0
    // Despesa = 1

    // O atributo [Required] indica que esse campo
    // precisa ser informado.
    // </summary>
    [Required]
    public TipoTransacao Tipo { get; set; }

    [Required]
    public CategoriaTransacao Categoria { get; set; }

    // <summary>
    // Data da transação.

    // Caso o cliente não envie uma data,
    // será utilizada a data atual em UTC.

    // UTC evita problemas com fusos horários.
    // </summary>
    public DateTime Data { get; set; } = DateTime.UtcNow;

    // <summary>
    // ID da pessoa responsável pela transação.

    // Esse campo cria a relação entre
    // Pessoa e Transação.
    // </summary>
    [Required(ErrorMessage = "PessoaId é obrigatório.")]
    public Guid PessoaId { get; set; }
}

// <summary>
// DTO utilizado para devolver os dados da transação
// para o cliente.

// Diferente do DTO de criação,
// este contém o ID gerado pelo banco.
// </summary>
public class TransacaoRespostaDto
{
    // <summary>
    // Identificador único da transação.
    // </summary>
    public Guid Id { get; set; }

    // <summary>
    // Descrição da transação.
    // </summary>
    public string Descricao { get; set; } = string.Empty;

    // <summary>
    // Valor da transação.
    // </summary>
    public decimal Valor { get; set; }

    // <summary>
    // Tipo da transação.
    // </summary>
    public TipoTransacao Tipo { get; set; }
    public CategoriaTransacao Categoria { get; set; }

    // <summary>
    // Data da transação.
    // </summary>
    public DateTime Data { get; set; }

    // <summary>
    // Pessoa dona da transação.
    // </summary>
    public Guid PessoaId { get; set; }
}

// <summary>
// Classe estática responsável pelas conversões
// entre DTOs e Entidades.

// Esse padrão é chamado de Mapping.
// </summary>
public static class TransacaoMappingExtensions
{
    // <summary>
    // Método de extensão responsável por converter
    // CriarTransacaoDto em uma entidade Transacao.

    // Exemplo:

    // var entidade = dto.ParaEntidade();
    // </summary>
    public static Transacao ParaEntidade(
        this CriarTransacaoDto dto
    ) =>
        new()
        {
            // Copia os valores do DTO para a entidade.
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            Categoria = dto.Categoria,
            Data = dto.Data,
            PessoaId = dto.PessoaId
        };

    // <summary>
    // Método responsável por converter uma entidade
    // Transacao em um DTO de resposta.

    // Exemplo:

    // var resposta = transacao.ParaDto();
    // </summary>
    public static TransacaoRespostaDto ParaDto(
        this Transacao transacao
    ) =>
        new()
        {
            // Copia os valores da entidade para o DTO.
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            Categoria = transacao.Categoria,
            Data = transacao.Data,
            PessoaId = transacao.PessoaId
        };
}