# Gastos Residenciais

Sistema para gerenciamento de gastos residenciais desenvolvido para praticar conceitos de desenvolvimento Full Stack utilizando **ASP.NET Core**, **PostgreSQL**, **Docker**, **React** e **TypeScript**.
---

## Conversa Do Backend para Front End 

### Inicio da Conversa

**1. Backend (.NET) — Controllers**
Arquivos como `TransacoesController.cs`, `PessoasController.cs`, `TotaisController.cs` expõem as rotas (`GET /transacoes`, `POST /pessoas` etc.). Eles consultam o banco via `AppDbContext` e devolvem JSON.

**2. `src/lib/api.ts`** — é o **único arquivo do frontend que efetivamente conversa com o servidor** via `fetch`. Nele estão os métodos genéricos:
- `apiGet<T>(path)` — requisições GET
- `apiPost<T>(path, body)` — requisições POST
- `apiDelete(path)` — requisições DELETE

Ele monta a URL (`VITE_API_URL` + rota), injeta o header `Authorization: Bearer <token>` e trata erros/401 de forma centralizada.

**3. `src/services/*.ts`** — cada arquivo (`pessoasService.ts`, `transacoesService.ts`, `totaisService.ts`, `authService.ts`) é uma "camada fina" que só decide **qual rota chamar**, delegando o trabalho pesado pro `api.ts`. Ex: `pessoasService.listar()` = `apiGet<Pessoa[]>("/pessoas")`.

**4. `src/pages/*.tsx`** — é quem **dispara** a chamada de fato, dentro de um `useEffect`, e guarda o resultado num `useState`. Ex: `DashboardPage.tsx` chama `pessoasService.listar()`, `transacoesService.listar()` e `totaisService.obter()` em paralelo com `Promise.all`.

**5. `src/components/*.tsx`** — não fazem nenhuma chamada de rede; só recebem os dados prontos via **props** (que vêm do `useState` da página) e desenham na tela (gráficos, listas, cards).

Resumindo o caminho de uma requisição: **Controller (backend) -> api.ts (fetch) -> service (rota) -> page (useEffect/useState) -> component (props/render)**.


 
---



## Expliacando o Back End

- **C# puro**: a linguagem em si — classes, propriedades (`get; set;`), tipos (`Guid`, `decimal`, `enum`), `namespace`, `using`. Isso existe independente de framework.

- **ASP.NET (Core)**: é o *framework web* que roda em cima do C#. Ele contribui com: `[ApiController]`, `[Route]`, `[HttpGet]`, `ControllerBase`, `[Authorize]`, o pipeline de middlewares (`UseAuthentication`, `UseCors`), e o `WebApplication.CreateBuilder`.

- **Entity Framework Core (EF Core)**: é uma biblioteca *separada* do ASP.NET (mas super integrada) que faz o ORM — traduz classes C# em tabelas SQL. `DbContext`, `DbSet<T>`, `ModelBuilder` e as **Migrations** são todas dele, não do ASP.NET.

| Peça | Pertence a |
|---|---|
| `class Pessoa { get; set; }` | C# puro |
| `[ApiController]`, `ControllerBase`, `[HttpGet]` | ASP.NET |
| `DbContext`, `DbSet<Pessoa>`, Migrations | EF Core |
| `[Authorize]`, JWT Bearer | ASP.NET (Identity/Auth) |

## Pastas e arquivos

| Pasta/Arquivo | O que é | Descrição |
|---|---|---|
| **`Domain/`** | Entidades (C# puro + atributos EF) | `Pessoa.cs`, `Transacao.cs`, `Usuario.cs` — são o **esqueleto das tabelas em memória**. EF Core mapeia essas classes pra tabelas reais via o `DbContext`. Ex: `Transacao` tem `Guid Id`, `decimal Valor`, `Guid PessoaId` (FK) e uma propriedade de navegação `Pessoa? Pessoa`. |
| **`DTOs/`** | Objetos de entrada/saída da API | `PessoaDtos.cs`, `TransacaoDtos.cs` etc. Cada arquivo tem um DTO de entrada (`CriarPessoaDto`, com `[Required]`, `[MaxLength]`, `[Range]` pra validação) e um de saída (`PessoaRespostaDto`). **Não vão pro banco** — servem só pra moldar o que entra/sai da API. Tem também métodos de extensão (`ParaEntidade()`, `ParaDto()`) que convertem DTO ↔ Domain. |
| **`Controllers/`** | ASP.NET | `TransacoesController.cs`, `PessoasController.cs` etc. Recebem a requisição HTTP, chamam o `AppDbContext`, montam o DTO de resposta. Regra de negócio pesada não fica aqui (ex: validar se a pessoa existe antes de criar transação é uma checagem simples, não uma regra complexa). |
| **`Infrastructure/`** | EF Core + serviços auxiliares | `AppDbContext.cs` — o `DbContext`, com os `DbSet<Pessoa>`, `DbSet<Transacao>`, `DbSet<Usuario>` e o `OnModelCreating` (onde ficam as regras de mapeamento: tamanho máximo de texto, enum salvo como string, `OnDelete(Cascade)` etc). `JwtTokenGenerator.cs` — gera o token JWT no login. |
| **`Migrations/`** | Gerado pelo EF Core | Cada arquivo (`AddPessoa.cs`, `AddTransacao.cs`, `AddUsuario.cs`, `AddCategoriaToTransacao.cs`) é um "commit" do histórico do banco: descreve em código C# o `CREATE TABLE`/`ALTER TABLE` equivalente (`Up()`) e como desfazer (`Down()`). O EF gera isso automaticamente comparando o estado atual das entidades com o `AppDbContextModelSnapshot.cs`. |
| **`Program.cs`** | ASP.NET — Bootstrap | Ponto de entrada. Registra serviços (`AddDbContext`, `AddAuthentication` com JWT, `AddCors`, `AddControllers`), depois registra os middlewares na ordem certa (`UseCors` -> `UseAuthentication` -> `UseAuthorization` -> `MapControllers`), e no fim `app.Run()` sobe o servidor. |

###  Observação sobre a pasta `Domain`

A pasta **`Domain`** contém as **entidades** da aplicação. Essas entidades representam o **esqueleto das tabelas em memória**, ou seja, definem a estrutura dos dados que serão persistidos no banco de dados.

O **Entity Framework Core** utiliza essas entidades por meio do **`AppDbContext`**, onde cada classe é mapeada para uma tabela através das propriedades `DbSet<T>`.

Nos **Controllers**, o `AppDbContext` é injetado pelo mecanismo de **Injeção de Dependência (Dependency Injection)** e, por convenção, é armazenado na variável privada `_context`. É por meio desse objeto que a aplicação realiza operações no banco de dados, como criar, consultar, atualizar e remover registros.
 
- **Entidades** -> representam as tabelas em memória.
- **AppDbContext** -> faz o mapeamento das entidades para as tabelas do banco.
- **`_context`** -> é apenas o nome convencional da variável que recebe a instância de `AppDbContext` por injeção de dependência, não um parâmetro pré-definido da classe.
 
Controller
   - conhece DTO            -> EXPLÍCITO (using GastosResidenciais.Api.DTOs; + tipo escrito:
    - CriarTransacaoDto)
   - conhece Domain         -> IMPLÍCITO (var transacao = ...; _context.Transacoes, sem using Domain)
  - conhece Infrastructure -> EXPLÍCITO (using GastosResidenciais.Api.Infrastructure; + AppDbContext)
 
O Controller nunca importa `Domain` diretamente, mas manipula objetos `Pessoa`/`Transacao` "por tabela" através do `_context.Pessoas` / `_context.Transacoes` (que vêm do `AppDbContext`) — daí ser implícito: o tipo aparece via inferência (`var`), não via `using` explícito.

 

## C# puro — a linguagem, sem framework nenhum

**`class` / propriedades (`get; set;`)**
- O que faz: define um tipo de dado com atributos e comportamento.
- Serve pra quê: modelar qualquer coisa — uma pessoa, uma transação, um cálculo.
- Quando é usado: o tempo todo, é a base de tudo. Ex: `public class Pessoa { public string Nome { get; set; } }`.

**Tipos (`Guid`, `decimal`, `enum`)**
- O que faz: cada um resolve um problema específico. `Guid` gera um identificador único global (`Guid.NewGuid()`), sem depender de sequência do banco. `decimal` é o tipo certo pra dinheiro (não perde precisão como `float`/`double`). `enum` restringe um valor a um conjunto fixo de opções.
- Serve pra quê: `Guid` -> chave primária sem depender do banco pra gerar o próximo número. `decimal` -> evitar erro de arredondamento em valor monetário. `enum` -> `TipoTransacao { Receita, Despesa }` garante que só esses dois valores existam, nada de string livre.
- Quando é usado: `Guid` em todo `Id` das entidades; `decimal` em `Transacao.Valor`; `enum` em `Tipo` e `Categoria`.

**`namespace` / `using`**
- O que faz: organiza o código em "gavetas" (namespace) e importa o conteúdo de uma gaveta pra usar no arquivo atual (`using`).
- Serve pra quê: evitar conflito de nomes e deixar explícito de onde cada classe vem — é o que te permite ver, por exemplo, que o Controller importa `DTOs` mas não importa `Domain`.
- Quando é usado: no topo de cada arquivo `.cs`. Ex: `using GastosResidenciais.Api.DTOs;` no `TransacoesController.cs`.

## ASP.NET Core —  framework web


**`[ApiController]` / `ControllerBase`**
- O que faz: `ControllerBase` é a classe-mãe que dá ao seu Controller a capacidade de responder HTTP (`Ok()`, `NotFound()`, `BadRequest()`). `[ApiController]` é um atributo que liga comportamentos automáticos — por exemplo, validação automática dos DTOs (`[Required]`, `[Range]`) sem você precisar checar `ModelState.IsValid` manualmente.
- Serve pra quê: transformar uma classe C# comum numa classe que sabe "falar HTTP".
- Quando é usado: em todo arquivo de `Controllers/`. Ex: `public class TransacoesController : ControllerBase`.

**`[Route]` / `[HttpGet]` / `[HttpPost]` / `[HttpDelete]`**
- O que faz: mapeia um método C# pra uma URL + verbo HTTP específico.
- Serve pra quê: dizer "quando chegar um GET em `/transacoes`, execute este método aqui".
- Quando é usado: em cima de cada método de ação do Controller. Ex: `[HttpGet("{id}")]` no método que busca uma transação por Id.

**`[Authorize]`**
- O que faz: bloqueia o acesso a uma rota se a requisição não tiver um token JWT válido no header `Authorization`.
- Serve pra quê: proteger endpoints — só usuário logado consegue chamar.
- Quando é usado: em cima do Controller inteiro ou de métodos específicos que exigem login (tudo, exceto `/auth/login` e `/auth/registrar`, no seu projeto).

**Pipeline de middlewares (`UseAuthentication`, `UseAuthorization`, `UseCors`)**
- O que faz: cada `Use...` é uma etapa que toda requisição passa, em sequência, antes de chegar no Controller.
- Serve pra quê: `UseCors` decide se o navegador de outra origem (seu frontend em `localhost:5173`) pode chamar a API. `UseAuthentication` lê o token e descobre "quem é você". `UseAuthorization` decide "você pode acessar isso?".
- Quando é usado: configurado uma vez no `Program.cs`, na ordem certa (CORS -> Authentication -> Authorization -> MapControllers), e roda automaticamente em **toda** requisição.

**`WebApplication.CreateBuilder(args)`**
- O que faz: cria o objeto que monta a aplicação inteira — é o "motor de inicialização" do ASP.NET.
- Serve pra quê: é onde você registra tudo que a API vai precisar (`AddControllers`, `AddDbContext`, `AddAuthentication`, `AddCors`) antes de efetivamente subir o servidor.
- Quando é usado: uma única vez, na primeira linha executável do `Program.cs`.

## Entity Framework Core (EF Core) — o ORM

É uma biblioteca separada, focada só em traduzir C# 
- banco de dados. Não é ASP.NET nem C# puro 
- é uma ferramenta a mais que você "pluga" no projeto.

**`DbContext`**
- O que faz: representa a conexão com o banco e serve de ponto central pra consultar/salvar dados.
- Serve pra quê: é a "porta de entrada" pro Postgres — todo Controller que precisa ler/gravar dado passa por ele.
- Quando é usado: injetado no construtor de cada Controller (`AppDbContext _context`) e usado em toda ação: `_context.Transacoes.ToListAsync()`.

**`DbSet<T>`**
- O que faz: representa uma tabela específica dentro do `DbContext` (ex: `DbSet<Pessoa> Pessoas`).
- Serve pra quê: dar acesso a operações de CRUD numa tabela como se fosse uma lista C#: `.Add()`, `.Where()`, `.ToListAsync()`.
- Quando é usado: uma propriedade por entidade dentro do `AppDbContext`. Ex: `public DbSet<Transacao> Transacoes => Set<Transacao>();`.

**`ModelBuilder`**
- O que faz: define regras finas de como cada entidade vira tabela — tamanho de coluna, obrigatoriedade, relacionamento (FK), conversão de enum pra string.
- Serve pra quê: ajustar o que o EF faria "no padrão" pra algo mais específico. Ex: no seu projeto, ele força `Tipo` e `Categoria` a serem salvos como texto (`'Receita'`) em vez de número, e configura `OnDelete(Cascade)` pra apagar as transações quando a pessoa é apagada.
- Quando é usado: dentro do método `OnModelCreating` do `AppDbContext`, executado uma vez quando o EF monta o mapeamento (não a cada requisição).

**Migrations**
- O que faz: cada migration é um arquivo C# gerado automaticamente que descreve uma mudança no schema do banco (`CreateTable`, `AddColumn` etc), com uma versão de "ida" (`Up`) e "volta" (`Down`).
- Serve pra quê: versionar o banco junto com o código — cada vez que você muda uma entidade, gera uma migration nova e aplica no Postgres real, sem precisar escrever SQL manualmente.
- Quando é usado: você gera com `dotnet ef migrations add NomeDaMudanca` sempre que altera uma entidade do `Domain/`, e aplica com `dotnet ef database update`. No seu projeto: `AddPessoa`, `AddTransacao`, `AddUsuario`, `AddCategoriaToTransacao` — nessa ordem cronológica.

---

# Banco De Dados

## Explicando o relacionamento Das Tabelas

**Pessoas 1 -> N Transacoes**
Uma pessoa pode ter várias transações, mas cada transação pertence a **exatamente uma** pessoa. Isso é feito com uma **chave estrangeira** (`PessoaId`) na tabela `Transacoes`, apontando pro `Id` da tabela `Pessoas`.

```csharp
// Domain/Transacao.cs
public Guid PessoaId { get; set; }      // a FK em si (a coluna)
public Pessoa? Pessoa { get; set; }     // propriedade de navegação (permite transacao.Pessoa.Nome)
```

```csharp
// Infrastructure/AppDbContext.cs — dentro de OnModelCreating
entity.HasOne(t => t.Pessoa)
      .WithMany()
      .HasForeignKey(t => t.PessoaId)
      .OnDelete(DeleteBehavior.Cascade);
```

- `HasOne(t => t.Pessoa).WithMany()` -> declara o relacionamento **1 pessoa : N transações** (o `WithMany()` sem argumento significa que `Pessoa` não tem uma lista `List<Transacao>` navegável de volta — a navegação é só de mão única, da Transação pra Pessoa).
- `OnDelete(DeleteBehavior.Cascade)` -> se você deletar uma pessoa, o Postgres **apaga automaticamente** todas as transações dela junto (sem isso, o banco recusaria o delete por violar a FK).

**Usuarios — tabela isolada**
`Usuario` não tem nenhuma FK ligando com `Pessoa` ou `Transacao`. Ela existe só pro fluxo de login/JWT (`Email` com índice único pra impedir cadastro duplicado). Ou seja: "quem acessa o sistema" (`Usuario`) é uma entidade separada de "quem tem gastos registrados" (`Pessoa`) — o sistema não amarra as duas coisas hoje.

Se quiser, posso te mostrar como ficaria o SQL gerado (`CREATE TABLE ... REFERENCES ... ON DELETE CASCADE`) que as migrations aplicam de fato no Postgres.


## Tabela `Pessoas`

**Responsabilidade:** representar os **membros do domicílio** que têm gastos/receitas rastreados no sistema — o "quem" das finanças.

- Guarda só o essencial pra identificar uma pessoa: `Nome` e `Idade`.
- É o **lado "um"** do relacionamento com `Transacoes` — cada pessoa pode acumular várias transações, mas a tabela em si não sabe quais; ela só existe como referência que a tabela `Transacoes` aponta de volta.
- Não guarda nenhum dado financeiro diretamente — saldo, total de receitas/despesas etc. são **calculados** (no `TotaisController`), não armazenados aqui.
- Se uma pessoa é apagada, todas as transações dela somem junto (cascade), então ela é meio que o "dono" dos registros financeiros.

## Tabela `Transacoes`

**Responsabilidade:** ser o **livro-caixa** — o registro de cada movimentação financeira, individual, que entra ou sai.

- É a tabela mais rica em dados: `Descricao`, `Valor`, `Tipo` (Receita/Despesa), `Categoria` (Alimentação, Moradia etc.), `Data` e a FK `PessoaId` dizendo de quem é aquele gasto/receita.
- É o lado "muitos" do relacionamento — cada linha pertence a uma pessoa só, mas a mesma pessoa aparece em várias linhas.
- É a fonte de verdade pra tudo que é cálculo: o `TotaisController` soma essas linhas (agrupando por `Tipo` e por `PessoaId`) pra gerar saldo, total de receitas e total de despesas — nada disso fica armazenado em outra tabela, é sempre recalculado a partir daqui.

## Tabela `Usuarios`

**Responsabilidade:** controlar **quem tem permissão de acessar o sistema** — é a camada de autenticação, não de dados financeiros.

- Guarda `Nome`, `Email` (único) e `SenhaHash` (nunca a senha em texto puro).
- Não tem nenhuma ligação (FK) com `Pessoas` ou `Transacoes` — ou seja, hoje o sistema **não distingue** "qual usuário logado é dono de quais pessoas/transações". Qualquer usuário autenticado enxerga os mesmos dados de `Pessoas`/`Transacoes` (não há um "multi-tenant" por usuário implementado ainda).
- É usada só no momento do login/registro (`AuthController`), pra gerar o JWT que depois o `[Authorize]` valida nas outras rotas.

**Resumo em uma frase por tabela:**
- `Pessoas` -> **quem** tem gastos.
- `Transacoes` -> **o que** foi gasto/recebido, quando e por quem.
- `Usuarios` -> **quem pode entrar** no sistema (não tem relação com o dinheiro em si).

## Populando o banco com dados (Opcional)
```csharp
-- Usuário e banco de dados

--  Criação de Tabelas
-- Pessoas (moradores cadastrados no sistema)

CREATE TABLE IF NOT EXISTS "Pessoas" (
    "Id"    uuid NOT NULL PRIMARY KEY,
    "Nome"  character varying(150) NOT NULL,
    "Idade" integer NOT NULL
);

-- Usuários (login do sistema — senha sempre como hash, nunca texto puro)
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id"        uuid NOT NULL PRIMARY KEY,
    "Nome"      character varying(150) NOT NULL,
    "Email"     character varying(200) NOT NULL,
    "SenhaHash" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Usuarios_Email" ON "Usuarios" ("Email");

-- Transações (receitas e despesas, vinculadas a uma Pessoa)
CREATE TABLE IF NOT EXISTS "Transacoes" (
    "Id"        uuid NOT NULL PRIMARY KEY,
    "Descricao" character varying(200) NOT NULL,
    "Valor"     numeric(18,2) NOT NULL,
    "Tipo"      text NOT NULL,                    -- 'Receita' ou 'Despesa'
    "Categoria" text NOT NULL DEFAULT 'Outros',    -- ver lista de categorias abaixo
    "Data"      timestamp with time zone NOT NULL,
    "PessoaId"  uuid NOT NULL,
    CONSTRAINT "FK_Transacoes_Pessoas_PessoaId"
        FOREIGN KEY ("PessoaId") REFERENCES "Pessoas" ("Id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "IX_Transacoes_PessoaId" ON "Transacoes" ("PessoaId");

-- Valores válidos de "Tipo": Receita, Despesa
-- Valores válidos de "Categoria": Alimentacao, Moradia, Transporte, Saude,
--                                 Salario, Lazer, Educacao, Outros
-- (esses textos precisam bater exatamente com os enums do backend em C#)



-- Inserir Dados de exemplo (6 pessoas + 22 transações)
-- 
-- IDs fixos + ON CONFLICT DO NOTHING: rodar o script de novo não duplica nada.
-- João Pedro (15 anos) só tem Despesas de propósito, pra ilustrar a regra
-- de que menores de 18 anos não podem registrar Receita.

INSERT INTO "Pessoas" ("Id", "Nome", "Idade") VALUES
    ('11111111-1111-1111-1111-111111111101', 'Ana Beatriz Souza',       34),
    ('11111111-1111-1111-1111-111111111102', 'Carlos Eduardo Lima',     41),
    ('11111111-1111-1111-1111-111111111103', 'Mariana Ferreira Costa',  29),
    ('11111111-1111-1111-1111-111111111104', 'João Pedro Santos',       15),
    ('11111111-1111-1111-1111-111111111105', 'Beatriz Almeida Rocha',   38),
    ('11111111-1111-1111-1111-111111111106', 'Rafael Oliveira Mendes',  45)
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "Transacoes" ("Id", "Descricao", "Valor", "Tipo", "Categoria", "Data", "PessoaId") VALUES
    -- Salários do mês (Receita)
    ('22222222-2222-2222-2222-222222222201', 'Salário',                          4500.00, 'Receita', 'Salario',     '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222202', 'Salário',                          6200.00, 'Receita', 'Salario',     '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222203', 'Salário',                          3800.00, 'Receita', 'Salario',     '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111103'),
    ('22222222-2222-2222-2222-222222222204', 'Salário',                          5100.00, 'Receita', 'Salario',     '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111105'),
    ('22222222-2222-2222-2222-222222222205', 'Salário',                          7300.00, 'Receita', 'Salario',     '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111106'),

    -- Moradia (taxa de condomínio, contas fixas)
    ('22222222-2222-2222-2222-222222222206', 'Taxa de condomínio',                850.00, 'Despesa', 'Moradia',     '2026-07-06 10:00:00', '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222207', 'Conta de luz',                      320.50, 'Despesa', 'Moradia',     '2026-07-08 10:00:00', '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222208', 'Conta de água',                     145.90, 'Despesa', 'Moradia',     '2026-07-08 11:00:00', '11111111-1111-1111-1111-111111111103'),
    ('22222222-2222-2222-2222-222222222209', 'Internet e TV a cabo',              199.90, 'Despesa', 'Moradia',     '2026-07-09 08:30:00', '11111111-1111-1111-1111-111111111105'),
    ('22222222-2222-2222-2222-222222222210', 'Manutenção do portão eletrônico',   180.00, 'Despesa', 'Outros',      '2026-06-25 14:00:00', '11111111-1111-1111-1111-111111111103'),

    -- Alimentação
    ('22222222-2222-2222-2222-222222222211', 'Mercado do mês',                   980.35, 'Despesa', 'Alimentacao', '2026-07-10 17:00:00', '11111111-1111-1111-1111-111111111106'),
    ('22222222-2222-2222-2222-222222222212', 'Feira semanal',                    210.00, 'Despesa', 'Alimentacao', '2026-07-11 08:00:00', '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222213', 'Lanche na cantina',                 45.00, 'Despesa', 'Alimentacao', '2026-07-09 12:15:00', '11111111-1111-1111-1111-111111111104'),

    -- Transporte
    ('22222222-2222-2222-2222-222222222214', 'Combustível',                      380.00, 'Despesa', 'Transporte',  '2026-07-03 18:00:00', '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222215', 'Uber para o trabalho',              96.40, 'Despesa', 'Transporte',  '2026-07-04 07:45:00', '11111111-1111-1111-1111-111111111103'),

    -- Saúde
    ('22222222-2222-2222-2222-222222222216', 'Plano de saúde',                   640.00, 'Despesa', 'Saude',       '2026-07-02 09:00:00', '11111111-1111-1111-1111-111111111105'),
    ('22222222-2222-2222-2222-222222222217', 'Farmácia',                          87.25, 'Despesa', 'Saude',       '2026-07-07 16:20:00', '11111111-1111-1111-1111-111111111106'),

    -- Lazer
    ('22222222-2222-2222-2222-222222222218', 'Cinema em família',                145.00, 'Despesa', 'Lazer',       '2026-06-28 20:00:00', '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222219', 'Streaming (Netflix + Spotify)',     64.80, 'Despesa', 'Lazer',       '2026-06-30 21:00:00', '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222220', 'Presente de aniversário',          120.00, 'Despesa', 'Outros',      '2026-06-20 15:00:00', '11111111-1111-1111-1111-111111111106'),

    -- Educação (João Pedro, 15 anos — só despesas, nunca receita)
    ('22222222-2222-2222-2222-222222222221', 'Material escolar',                 210.00, 'Despesa', 'Educacao',    '2026-07-01 09:00:00', '11111111-1111-1111-1111-111111111104'),
    ('22222222-2222-2222-2222-222222222222', 'Mensalidade do curso de inglês',   350.00, 'Despesa', 'Educacao',    '2026-07-05 09:00:00', '11111111-1111-1111-1111-111111111104')
ON CONFLICT ("Id") DO NOTHING;

-- Confirmação no console ao final da execução.
SELECT
    (SELECT COUNT(*) FROM "Pessoas")    AS total_pessoas,
    (SELECT COUNT(*) FROM "Transacoes") AS total_transacoes;
```
## Funcionalidades

### Backend
- Cadastro de pessoas.
- Listagem de pessoas cadastradas.
- Remoção de pessoas.
- Cadastro de transações financeiras.
- Controle de despesas e receitas.
- Cálculo automático do saldo.
- API REST documentada com Swagger.
- Persistência de dados em PostgreSQL.

### Frontend
- Listagem de pessoas cadastradas.
- Cadastro de novas pessoas.
- Cadastro de transações.
- Dashboard com saldo e totais.
- Consumo da API utilizando Fetch API.

---

##  Tecnologias Utilizadas

### Backend
- ASP.NET Core 8
- Entity Framework Core
- PostgreSQL
- Docker
- Swagger/OpenAPI

### Frontend
- React 19
- TypeScript
- Vite

---
 

##  Executando o Projeto

### Pré-requisitos

- Docker Desktop
- Docker Compose
- Node.js 22+
- npm

---

##  Subindo o Backend docker 

Na raiz do projeto execute:

```bash
docker compose up -d --build
```

Verifique se os containers estão ativos:

```bash
docker compose ps
```

---

##  Testando a API

Health Check:

```http
GET http://localhost:8080/health/db
```

Swagger:

```text
http://localhost:8080/swagger
```

---

##  Executando o Frontend

Entre na pasta do frontend:

```bash
cd gastos-residenciais-front
npm install
npm run dev
```

A aplicação ficará disponível em:

### Frontend

```text
http://localhost:5173
```

---

 

### Backend Api Base

```env
VITE_API_URL=http://localhost:8080
```
 
 

## Autor

Desenvolvido por Everton Eduardo  