
#  BUILD
# Usando a imagem completa do SDK do .NET,
# que possui todas as ferramentas necessárias para compilar
# a aplicação (restore, build e publish).


# Baixa a imagem oficial do SDK do .NET 8 e cria um estágio
# chamado "build" para ser reutilizado posteriormente.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Define o diretório de trabalho dentro do container.
# Todos os comandos seguintes serão executados dentro de /src.
WORKDIR /src

# Copia apenas o arquivo .csproj para dentro do container.
# Isso melhora o cache do Docker porque as dependências só
# serão restauradas novamente se o .csproj mudar.
COPY ["GastosResidenciais.Api/GastosResidenciais.Api.csproj", "GastosResidenciais.Api/"]

# Faz o download de todas as dependências NuGet do projeto.
# Equivalente ao comando executado localmente:
# dotnet restore
RUN dotnet restore "GastosResidenciais.Api/GastosResidenciais.Api.csproj"

# Copia todos os arquivos do projeto para dentro do container.
# Aqui entram Controllers, Domain, DTOs, Program.cs, etc.
COPY . .

# Entra na pasta do projeto ASP.NET.
WORKDIR /src/GastosResidenciais.Api

# Compila a aplicação em modo Release.
#
# -c Release
#   Compila usando as otimizações de produção.
#
# -o /app/build
#   Define a pasta onde os arquivos compilados serão gerados.
RUN dotnet build "GastosResidenciais.Api.csproj" -c Release -o /app/build



# PUBLISH
# gerando os arquivos finais que serão executados
# em produção, removendo arquivos desnecessários do SDK.


# Cria um novo estágio baseado no estágio "build".
# Dessa forma reaproveitamos tudo que já foi compilado.
FROM build AS publish

# Publica a aplicação.
#
# O publish:
# - compila novamente se necessário;
# - copia dependências;
# - prepara os arquivos para execução.
#
# -o /app/publish
#   Pasta onde a aplicação publicada será colocada.
#
# /p:UseAppHost=false
#   Evita gerar executáveis específicos do sistema operacional,
#   deixando a aplicação mais portátil dentro do container.
RUN dotnet publish "GastosResidenciais.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false



# RUN
# Usando imagem leve do ASP.NET Runtime,
# sem ferramentas de compilação, reduzindo muito o tamanho
# final da imagem.


# Usa a imagem do runtime do ASP.NET Core 8.
# Ela contém apenas o necessário para executar a aplicação.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Define o diretório de trabalho da aplicação.
WORKDIR /app

# Copia os arquivos publicados no estágio "publish"
# para dentro do container final.
#
# --from=publish
#   Indica que os arquivos virão do estágio anterior.
COPY --from=publish /app/publish .

# Informa que a aplicação utilizará a porta 8080.
# Isso é apenas documentação para o Docker.
# O mapeamento real acontece no docker-compose.yml.
EXPOSE 8080

# Define a variável de ambiente que informa ao ASP.NET
# em qual endereço e porta ele deve escutar.

ENV ASPNETCORE_URLS=http://+:8080

# Define o comando que será executado quando o container iniciar.

# Esse comando sobe o servidor Kestrel da aplicação.
ENTRYPOINT ["dotnet", "GastosResidenciais.Api.dll"]