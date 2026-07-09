// O namespace Domain é responsável por armazenar as entidades

namespace GastosResidenciais.Api.Domain;

// <summary>
// Representa uma movimentação financeira do sistema.

// Uma transação pode ser:

// - Uma Receita (entrada de dinheiro)
// - Uma Despesa (saída de dinheiro)

// </summary>
public class Transacao
{
    // <summary>
    // Identificador único da transação.

    // Guid (Globally Unique Identifier) é utilizado para garantir
    // que cada registro possua um ID exclusivo no sistema inteiro.

    // Guid.NewGuid() gera automaticamente um novo identificador
    // quando a transação é criada.

    // Exemplo:
    // 3f16f2f8-c5f1-43d2-a1e5-6d41d5f7f8aa
    // </summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    // <summary>
    // Descrição da transação.
    //
    // Exemplos:
    // - Salário
    // - Mercado
    // - Conta de Luz
    // - Internet
    // - Venda de Produto
    //
    // string.Empty evita valores nulos.
    // </summary>
    public string Descricao { get; set; } = string.Empty;

    // <summary>
    // Valor monetário da transação.

    // O tipo decimal é recomendado para dinheiro,
    // pois possui maior precisão que float ou double
    // e evita erros de arredondamento.

    // Exemplos:
    // 1500.00
    // 299.99
    // 42.50

    // O valor deve ser sempre positivo.
    // </summary>
    public decimal Valor { get; set; }

    // <summary>
    // Define se a transação é uma Receita ou uma Despesa.

    // O enum TipoTransacao possui:
    // - Receita = 0
    // - Despesa = 1

    // Esse campo determina se o valor será somado
    // ou subtraído do saldo.
    // </summary>
    public TipoTransacao Tipo { get; set; }

    // <summary>
    // Data em que a transação ocorreu.
    //
    // Pode representar:
    // - Data da compra
    // - Data do recebimento do salário
    // - Data do pagamento da conta
    //
    // Exemplo:
    // 2026-07-09 14:30:00
    // </summary>
    public DateTime Data { get; set; }

    // <summary>
    // Chave estrangeira (Foreign Key) para a tabela Pessoa.
    //
    // Indica a quem essa transação pertence.
    //
    // Exemplo:
    // Uma transação pode pertencer ao João,
    // outra à Maria, etc.
    // </summary>
    public Guid PessoaId { get; set; }

    // <summary>
    // Propriedade de navegação do Entity Framework.
    //
    // Permite acessar diretamente os dados da pessoa
    // relacionada à transação.
    //
    // Exemplo:
    //
    // transacao.Pessoa.Nome
    //
    // O símbolo ? indica que a propriedade pode ser nula,
    // principalmente antes do carregamento da relação.
    // </summary>
    public Pessoa? Pessoa { get; set; }
}