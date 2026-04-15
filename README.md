# 💰 FinTrack API

API REST de finanças pessoais — controle de receitas, despesas e relatórios.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Sobre

O FinTrack é uma API completa para gerenciamento de finanças pessoais. Permite registrar receitas e despesas, organizar por categorias, visualizar resumos financeiros com filtro por período, e acompanhar o histórico de todas as ações realizadas. Construída com foco em boas práticas, segurança e arquitetura profissional.

## 🚀 Tecnologias

- **Runtime:** Node.js 22 LTS
- **Framework:** Express 5
- **Banco de dados:** PostgreSQL 18
- **ORM:** Prisma 7 (com adapter-pg)
- **Autenticação:** JWT (jsonwebtoken + bcryptjs)
- **Validação:** Zod 4
- **Segurança:** Helmet, CORS, Rate Limiting
- **Email:** Nodemailer (Gmail SMTP)

## 📁 Estrutura do Projeto

```
src/
├── controllers/       # Lógica de request/response
│   ├── activityLogController.js
│   ├── authController.js
│   ├── categoryController.js
│   ├── summaryController.js
│   └── transactionController.js
├── middlewares/        # Middlewares customizados
│   ├── auth.js        # Guard de autenticação JWT
│   └── validate.js    # Validação com Zod
├── routes/            # Definição de rotas
│   ├── activityLogRoutes.js
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── summaryRoutes.js
│   └── transactionRoutes.js
├── services/          # Lógica de negócio
│   ├── activityLogService.js
│   ├── authService.js
│   ├── categoryService.js
│   ├── emailService.js
│   ├── summaryService.js
│   └── transactionService.js
├── utils/             # Utilitários
│   └── prisma.js      # Conexão com o banco
├── validations/       # Schemas de validação Zod
│   ├── authValidation.js
│   ├── categoryValidation.js
│   └── transactionValidation.js
└── server.js          # Ponto de entrada
```

## ⚙️ Como rodar

### Pré-requisitos

- Node.js 22+
- PostgreSQL 16+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/pecinallib/fintrack-api.git
cd fintrack-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Variáveis de ambiente

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/fintrack"
JWT_SECRET="sua-chave-secreta"
CORS_ORIGIN="http://localhost:5173"
SMTP_EMAIL="seu-email@gmail.com"
SMTP_PASSWORD="sua-app-password"
FRONTEND_URL="http://localhost:5173"
```

### Banco de dados

```bash
# Crie o banco no PostgreSQL
psql -U postgres -c "CREATE DATABASE fintrack;"

# Rode as migrations
npx prisma migrate dev

# (Opcional) Visualize o banco
npx prisma studio
```

### Executando

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor inicia em `http://localhost:3000`.

## 📌 Endpoints

### Autenticação (públicas)

| Método | Rota                    | Descrição                          |
| ------ | ----------------------- | ---------------------------------- |
| POST   | `/auth/register`        | Cadastrar novo usuário             |
| POST   | `/auth/login`           | Fazer login e receber token        |
| POST   | `/auth/forgot-password` | Solicitar recuperação de senha     |
| POST   | `/auth/reset-password`  | Redefinir senha com token do email |

### Transações (protegidas — requer Bearer Token)

| Método | Rota                | Descrição                  |
| ------ | ------------------- | -------------------------- |
| GET    | `/transactions`     | Listar todas as transações |
| GET    | `/transactions/:id` | Buscar transação por ID    |
| POST   | `/transactions`     | Criar nova transação       |
| PUT    | `/transactions/:id` | Atualizar transação        |
| DELETE | `/transactions/:id` | Deletar transação          |

### Categorias (protegidas)

| Método | Rota              | Descrição                  |
| ------ | ----------------- | -------------------------- |
| GET    | `/categories`     | Listar todas as categorias |
| GET    | `/categories/:id` | Buscar categoria por ID    |
| POST   | `/categories`     | Criar nova categoria       |
| PUT    | `/categories/:id` | Atualizar categoria        |
| DELETE | `/categories/:id` | Deletar categoria          |

### Resumo financeiro (protegida)

| Método | Rota                                                          | Descrição                                |
| ------ | ------------------------------------------------------------- | ---------------------------------------- |
| GET    | `/transactions/summary`                                       | Resumo com totais e gastos por categoria |
| GET    | `/transactions/summary?dateFrom=2026-01-01&dateTo=2026-12-31` | Resumo filtrado por período              |

### Histórico de ações (protegida)

| Método | Rota        | Descrição                   |
| ------ | ----------- | --------------------------- |
| GET    | `/activity` | Últimas 20 ações do usuário |

## 🔒 Segurança

- **Helmet** — Headers HTTP de segurança
- **CORS** — Controle de origens permitidas
- **Rate Limiting** — 100 requests por IP a cada 15 minutos
- **bcrypt** — Hash de senhas com salt
- **JWT** — Tokens com expiração de 7 dias
- **Password Reset** — Token SHA-256 com expiração de 15 minutos, tokens anteriores invalidados automaticamente

## 📋 Histórico de Ações

Todas as operações de CRUD em transações e categorias são registradas automaticamente na tabela `activity_logs`. O log inclui a ação realizada, a entidade afetada, detalhes descritivos em português (com valores, nomes anteriores e novos em edições), e o timestamp.

## 🧪 Testando a API

O projeto inclui um arquivo `requests.http` na raiz para testes com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VS Code.

## 🔗 Frontend

O frontend do FinTrack está disponível em: [fintrack-web](https://github.com/pecinallib/fintrack-web)

## 📝 Padrões do projeto

- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- **Git Flow** — Branches `main`, `dev` e `feat/*`
- **Pull Requests** — Toda feature mergeada via PR com descrição

## 👤 Autor

**Matheus Bastos Pecinalli**

- GitHub: [@pecinallib](https://github.com/pecinallib)
- LinkedIn: [/in/dev-pecinalli](https://www.linkedin.com/in/dev-pecinalli)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
