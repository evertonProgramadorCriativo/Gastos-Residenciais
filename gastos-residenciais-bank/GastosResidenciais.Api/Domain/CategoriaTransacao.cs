namespace GastosResidenciais.Api.Domain;

// <summary>
// Entidades (Entities) representam os objetos do domínio da aplicação.
// Elas funcionam como o "molde" ou "esqueleto" dos dados em memória.
//
// O Entity Framework Core utiliza essas classes para criar o mapeamento
// entre o código C# e as tabelas do banco de dados.
//
// Em resumo:
// Classe (Entidade)  <-->  Tabela do Banco
// Propriedade         <-->  Coluna da Tabela
// Objeto              <-->  Registro (Linha) da Tabela

// Categoria da transação, usada para agrupar gastos/receitas
// no dashboard (ex.: gráfico "Por categoria").
// </summary>
public enum CategoriaTransacao
{
    Alimentacao = 0,
    Moradia = 1,
    Transporte = 2,
    Saude = 3,
    Salario = 4,
    Lazer = 5,
    Educacao = 6,
    Outros = 7
}