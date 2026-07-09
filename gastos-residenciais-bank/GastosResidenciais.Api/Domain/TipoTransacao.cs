// Define que esta classe faz parte do namespace Domain.

// O namespace serve para organizar o código em grupos lógicos,
// semelhante às pastas do projeto.

// Neste caso, Domain contém as entidades e regras de negócio
// da aplicação de Gastos Residenciais.
namespace GastosResidenciais.Api.Domain;

// Enumeração que representa os possíveis tipos de transação.

// Um enum é utilizado quando existe um conjunto fixo e conhecido
// de valores possíveis.

// Vantagens do enum:
// - Evita erros de digitação que ocorreriam usando strings.
// - Facilita validações.
// - Melhora a legibilidade do código.
// - Ocupa menos espaço no banco de dados quando salvo como inteiro.
public enum TipoTransacao
{
    // Representa uma entrada de dinheiro.
    //
    // Exemplos:
    // - Salário
    // - Venda de algum item
    // - Rendimentos
    // - Aluguel recebido
    //
    // O valor 0 será armazenado no banco de dados.
    Receita = 0,

    // Representa uma saída de dinheiro.
    //
    // Exemplos:
    // - Conta de luz
    // - Mercado
    // - Internet
    // - Combustível
    // - Aluguel pago
    //
    // O valor 1 será armazenado no banco de dados.
    Despesa = 1
}