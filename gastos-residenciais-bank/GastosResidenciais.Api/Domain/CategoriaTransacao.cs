namespace GastosResidenciais.Api.Domain;

/// <summary>
/// Categoria da transação, usada para agrupar gastos/receitas
/// no dashboard (ex.: gráfico "Por categoria").
/// </summary>
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