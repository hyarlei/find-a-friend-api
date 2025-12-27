<div align="center">
  <h1>🐾 Find A Friend API</h1>
  <p>API RESTful para conectar pets a famílias que buscam um novo membro</p>
  
  [![CI](https://github.com/hyarlei/find-a-friend-api/actions/workflows/run-tests.yml/badge.svg?branch=master)](https://github.com/hyarlei/find-a-friend-api/actions/workflows/run-tests.yml)
  [![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
  [![Node](https://img.shields.io/badge/node-20.19.5-green.svg)](https://nodejs.org/)
</div>

---

## 📖 Sobre o Projeto

**Find A Friend** é uma API desenvolvida para facilitar a adoção de animais de estimação. O projeto permite que organizações (ORGs) cadastrem pets disponíveis para adoção e gerenciem todo o processo de forma eficiente e organizada.

### 🎯 Funcionalidades Principais

- ✅ Cadastro e autenticação de organizações (ORGs)
- ✅ Gerenciamento completo de pets para adoção
- ✅ Busca avançada de pets por características
- ✅ Perfil detalhado de cada pet
- ✅ Sistema de autenticação JWT
- ✅ Documentação interativa com Swagger

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Fluxo de Requisições

```mermaid
graph LR
    A[Cliente] -->|HTTP Request| B[Fastify Routes]
    B -->|Validação Zod| C[Controllers]
    C -->|Executa| D[Use Cases]
    D -->|Acessa| E[Repositories]
    E -->|Query| F[(PostgreSQL)]
    F -->|Resultado| E
    E -->|Dados| D
    D -->|Response| C
    C -->|JSON| B
    B -->|HTTP Response| A

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
    style E fill:#f5e1ff
    style F fill:#ff9999
```

### Arquitetura em Camadas

```mermaid
flowchart TB
    subgraph Client["👤 Cliente"]
        HTTP[HTTP Requests]
    end

    subgraph API["🌐 Camada de Apresentação"]
        Routes[Routes + Swagger]
        Controllers[Controllers]
        Validation[Validação Zod]
    end

    subgraph Business["💼 Camada de Negócio"]
        UC1[Register Use Case]
        UC2[Authenticate Use Case]
        UC3[Create Pet Use Case]
        UC4[Search Pets Use Case]
        UC5[Get Pet Profile Use Case]
    end

    subgraph Data["💾 Camada de Dados"]
        Repos[Repositories Interface]
        PrismaRepos[Prisma Repositories]
        InMemoryRepos[In-Memory Repositories]
    end

    subgraph Infrastructure["🔧 Infraestrutura"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
        JWT[JWT Auth]
    end

    HTTP --> Routes
    Routes --> Validation
    Validation --> Controllers
    Controllers --> UC1 & UC2 & UC3 & UC4 & UC5
    UC1 & UC2 & UC3 & UC4 & UC5 --> Repos
    Repos -.Produção.-> PrismaRepos
    Repos -.Testes.-> InMemoryRepos
    PrismaRepos --> Prisma
    Prisma --> DB
    UC2 --> JWT

    style Client fill:#e3f2fd
    style API fill:#fff3e0
    style Business fill:#f1f8e9
    style Data fill:#fce4ec
    style Infrastructure fill:#ede7f6
```

### Fluxo de Autenticação e Criação de Pet

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant API as 🌐 API
    participant Auth as 🔐 Authenticate
    participant JWT as 🎫 JWT
    participant Pet as 🐕 Create Pet
    participant Repo as 💾 Repository
    participant DB as 🗄️ Database

    Note over User,DB: Fluxo de Autenticação
    User->>API: POST /sessions (email, password)
    API->>Auth: Executa Use Case
    Auth->>Repo: Busca ORG por email
    Repo->>DB: SELECT * FROM orgs
    DB-->>Repo: Dados da ORG
    Repo-->>Auth: Retorna ORG
    Auth->>Auth: Valida senha (bcrypt)
    Auth->>JWT: Gera token
    JWT-->>Auth: Token JWT
    Auth-->>API: Retorna token
    API-->>User: 200 OK {token}

    Note over User,DB: Fluxo de Criação de Pet
    User->>API: POST /pets + Bearer Token
    API->>JWT: Valida token
    JWT-->>API: Token válido + org_id
    API->>Pet: Executa Use Case
    Pet->>Repo: Cria pet com org_id
    Repo->>DB: INSERT INTO pets
    DB-->>Repo: Pet criado
    Repo-->>Pet: Retorna pet
    Pet-->>API: Pet criado
    API-->>User: 201 Created
```

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    ORG ||--o{ PET : "possui"

    ORG {
        string id PK
        string name
        string email UK
        string password_hash
        string address
        string phone
        datetime created_at
    }

    PET {
        string id PK
        string name
        string about
        string age
        string size
        string energy_level
        string independence_level
        string environment
        string org_id FK
    }
```

---

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Fastify](https://fastify.dev/)** - Framework web rápido e eficiente
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript
- **[JWT](https://jwt.io/)** - Autenticação via tokens
- **[Vitest](https://vitest.dev/)** - Framework de testes
- **[Docker](https://www.docker.com/)** - Containerização

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/hyarlei/find-a-friend-api.git
cd find-a-friend-api
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/findafriend?schema=public"

# JWT
JWT_SECRET="your-secret-key-here"
```

### 4️⃣ Inicie o banco de dados

```bash
docker-compose up -d
```

### 5️⃣ Execute as migrations

```bash
npx prisma migrate dev
```

### 6️⃣ Inicie o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333` 🎉

---

## 📚 Documentação da API

### Swagger UI

Após iniciar o servidor, acesse a documentação interativa:

```
http://localhost:3333/docs
```

### Endpoints Principais

#### 🏢 Organizações (ORGs)

| Método | Endpoint    | Descrição                  |
| ------ | ----------- | -------------------------- |
| POST   | `/orgs`     | Cadastrar nova organização |
| POST   | `/sessions` | Autenticar organização     |

#### 🐕 Pets

| Método | Endpoint    | Descrição                                |
| ------ | ----------- | ---------------------------------------- |
| POST   | `/pets`     | Cadastrar novo pet (requer autenticação) |
| GET    | `/pets`     | Buscar pets com filtros                  |
| GET    | `/pets/:id` | Obter detalhes de um pet                 |

### Exemplos de Requisições

#### Cadastrar Organização

```bash
POST /orgs
Content-Type: application/json

{
  "name": "Abrigo Patas Felizes",
  "email": "contato@patasfelizes.com",
  "password": "senha123",
  "address": "Rua das Flores, 123 - São Paulo, SP",
  "phone": "(11) 98765-4321"
}
```

#### Autenticar

```bash
POST /sessions
Content-Type: application/json

{
  "email": "contato@patasfelizes.com",
  "password": "senha123"
}
```

#### Cadastrar Pet

```bash
POST /pets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Thor",
  "about": "Cachorro dócil e brincalhão",
  "age": "2",
  "size": "medium",
  "energy_level": "high",
  "independence_level": "medium",
  "environment": "amplo"
}
```

#### Buscar Pets

```bash
GET /pets?city=São Paulo&age=2&size=medium&energy_level=high
```

---

## 🗄️ Modelo de Dados

### Org (Organização)

```typescript
{
  id: string (UUID)
  name: string
  email: string (único)
  password_hash: string
  address: string
  phone: string
  created_at: DateTime
  pets: Pet[]
}
```

### Pet

```typescript
{
  id: string(UUID)
  name: string
  about: string ? age : string
  size: string
  energy_level: string
  independence_level: string
  environment: string
  org_id: string
  org: Org
}
```

---

## 🧪 Testes

Execute os testes unitários:

```bash
npm test
```

Execute os testes em modo watch:

```bash
npm run test:watch
```

---

## 📦 Build e Deploy

### Build para produção

```bash
npm run build
```

### Executar versão de produção

```bash
npm start
```

---

## 🛠️ Scripts Disponíveis

| Script          | Descrição                                 |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Gera build de produção                    |
| `npm start`     | Executa a versão de produção              |
| `npm test`      | Executa os testes                         |

---

## 🏗️ Estrutura do Projeto

```
find-a-friend-api/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── http/
│   │   ├── controllers/       # Controladores das rotas
│   │   └── routes.ts          # Definição das rotas
│   ├── repositories/          # Camada de acesso aos dados
│   │   ├── in-memory/         # Repositórios para testes
│   │   └── prisma/            # Repositórios Prisma
│   ├── use-cases/             # Regras de negócio
│   │   └── factories/         # Factories dos use cases
│   ├── lib/                   # Bibliotecas e configurações
│   ├── env/                   # Validação de variáveis de ambiente
│   ├── app.ts                 # Configuração do Fastify
│   └── server.ts              # Inicialização do servidor
├── docker-compose.yml         # Configuração do Docker
├── package.json
└── tsconfig.json
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Regras de Negócio

- ✅ Deve ser possível cadastrar um pet vinculado a uma ORG
- ✅ Deve ser possível listar todos os pets disponíveis para adoção
- ✅ Deve ser possível filtrar pets por características
- ✅ Deve ser possível visualizar detalhes de um pet
- ✅ Para listar os pets, obrigatoriamente é necessário informar a cidade
- ✅ Uma ORG precisa ter endereço e WhatsApp para cadastro
- ✅ Um pet deve estar vinculado a uma ORG
- ✅ O usuário que quer adotar entrará em contato com a ORG via WhatsApp
- ✅ Todos os filtros são opcionais, exceto a cidade

---

## 👤 Autor

Desenvolvido por **Hyarlei Silva**

- GitHub: [@hyarlei](https://github.com/hyarlei)

---

## 📄 Licença

Este projeto está sob a licença ISC.

---

<div align="center">
  <p>Feito com ❤️ e ☕</p>
  <p>⭐ Deixe uma estrela se este projeto te ajudou!</p>
</div>
