# Gastos Residenciais

Sistema para gerenciamento de gastos residenciais desenvolvido para praticar conceitos de desenvolvimento Full Stack utilizando **ASP.NET Core**, **PostgreSQL**, **Docker**, **React** e **TypeScript**.

---

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

```text
http://localhost:5173
```

---

 

### Frontend

```env
VITE_API_URL=http://localhost:8080
```
 
 

## Autor

Desenvolvido por Everton Eduardo  