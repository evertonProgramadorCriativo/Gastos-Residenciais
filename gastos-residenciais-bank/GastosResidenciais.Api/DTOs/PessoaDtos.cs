/*
EXPLICAÇÃO DOS DTOs

DOTS = Objetos de entrada/saída da API (não vão para o banco, servem para validar e formatar dados trocados com o front)

 DTOs de entrada/saída da entidade Pessoa.
  CriarPessoaDto molda os dados exigidos para 
  
  cadastrar uma pessoa (com validações [Required], [MaxLength], [Range]); PessoaRespostaDto molda o que a
 API devolve ao cliente. 
 
 PessoaMappingExtensions traz os
  métodos de conversão DTO <-> Domain 
  
  (ParaEntidade()/ParaDto()) usados pelo
 PessoasController, evitando expor a entidade do EF Core diretamente.
*/

// Importa os atributos de validação como [Required], [MaxLength] e [Range].
// Esses atributos são usados para validar os dados recebidos pela API.
using System.ComponentModel.DataAnnotations;

// Importa a entidade Pessoa do domínio.
// Vamos usar essa classe para converter os DTOs em entidade e vice-versa.
using GastosResidenciais.Api.Domain;

// Define o namespace onde ficam os DTOs da aplicação.
// DTO = Data Transfer Object, usado para transportar dados entre API e cliente.
namespace GastosResidenciais.Api.DTOs;

// <summary>
// DTO de entrada para criação de uma pessoa.
// Essa classe representa os dados que o cliente precisa enviar para cadastrar uma pessoa.
// </summary>
public class CriarPessoaDto
{
    // [Required] => torna o campo obrigatório.
    // Se o cliente não enviar o nome, a API retorna erro com a mensagem definida.
    [Required(ErrorMessage = "O nome é obrigatório.")]

    // [MaxLength(150)] => limita o tamanho máximo do nome em 150 caracteres.
    // Se passar disso, a validação falha.
    [MaxLength(150)]

    // Propriedade que recebe o nome da pessoa.
    // string.Empty evita que a propriedade fique nula por padrão.
    public string Nome { get; set; } = string.Empty;

    // [Range(0, 150)] => valida se a idade está entre 0 e 150.
    // Se o valor estiver fora desse intervalo, a API retorna a mensagem de erro.
    [Range(0, 150, ErrorMessage = "Idade deve estar entre 0 e 150.")]

    // Propriedade que recebe a idade da pessoa.
    public int Idade { get; set; }
}

// <summary>
// DTO de saída, ou seja, o objeto que a API devolve ao cliente.
// Em vez de retornar a entidade do banco diretamente,
// a API retorna esse DTO com apenas os dados necessários.
// </summary>
public class PessoaRespostaDto
{
    // Identificador único da pessoa.
    public Guid Id { get; set; }

    // Nome da pessoa.
    public string Nome { get; set; } = string.Empty;

    // Idade da pessoa.
    public int Idade { get; set; }
}

// <summary>
// Classe estática com métodos de conversão entre DTOs e entidade Pessoa.
// Esses métodos ajudam a separar a camada da API da camada de domínio,
// evitando expor a entidade do EF Core diretamente.
// </summary>
public static class PessoaMappingExtensions
{
    // Método de extensão que converte um CriarPessoaDto em uma entidade Pessoa.
    // "this CriarPessoaDto dto" faz esse método virar um método de extensão,
    // permitindo chamar assim: dto.ParaEntidade()
    public static Pessoa ParaEntidade(this CriarPessoaDto dto) =>
        // Cria uma nova instância da entidade Pessoa.
        new()
        {
            // Copia o Nome enviado no DTO para a entidade.
            Nome = dto.Nome,

            // Copia a Idade enviada no DTO para a entidade.
            Idade = dto.Idade
        };

    // Método de extensão que converte uma entidade Pessoa em PessoaRespostaDto.
    // Permite chamar assim: pessoa.ParaDto()
    public static PessoaRespostaDto ParaDto(this Pessoa pessoa) =>
        // Cria um novo DTO de resposta.
        new()
        {
            // Copia o Id da entidade para o DTO.
            Id = pessoa.Id,

            // Copia o Nome da entidade para o DTO.
            Nome = pessoa.Nome,

            // Copia a Idade da entidade para o DTO.
            Idade = pessoa.Idade
        };
}

