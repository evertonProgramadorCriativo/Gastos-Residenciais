// Migration gerada automaticamente pelo EF Core: primeiro "commit" do
// histórico do banco, criando a tabela Pessoas. Up() descreve o
// CREATE TABLE equivalente; Down() descreve como desfazer. Não deve
// ser editada manualmente — para alterar o schema, crie uma nova
// migration com "dotnet ef migrations add".

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GastosResidenciais.Api.Migrations
{
    // <inheritdoc />
    public partial class AddPessoa : Migration
    {
        // <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pessoas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Idade = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoas", x => x.Id);
                });
        }

        // <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pessoas");
        }
    }
}
