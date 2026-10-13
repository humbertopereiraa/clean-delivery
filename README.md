# 🚚 Clean Delivery

Plataforma de gestão de entregas desenvolvida com foco em **arquitetura limpa**, **DDD** e **boas práticas modernas de desenvolvimento**.

---

## 📌 Status do Projeto

🚧 Em desenvolvimento

---

## 🎯 Objetivo

Este projeto foi criado com o objetivo de **praticar e consolidar conceitos avançados de engenharia de software**, incluindo:

- Clean Architecture
- Domain-Driven Design (DDD)
- SOLID
- Clean Code
- Microservices
- Mensageria assíncrona

---

## 🧠 Conceitos Aplicados

### 🧩 Arquitetura

- Clean Architecture (camadas bem definidas)
- Separação de responsabilidades
- Baixo acoplamento e alta coesão

Os backends (`auth-service` e `pedido-service`) seguem as mesmas camadas:

- **domain** — entidades, value objects, contratos e erros, sem dependência de framework
- **application** — casos de uso, services e DTOs
- **infra** — banco, cache, mensageria, HTTP, criptografia e log
- **presentation** — rotas, controllers e schemas
- **main** — composição e subida do servidor

### 📐 Padrões e Abordagens

#### Design Patterns (GoF)

- Singleton (`PostgresAdapter`, `RabbitMQ` e `RedisAdapter` via `getInstance`)
- Adapter (Fastify, Express, PostgreSQL, Knex, Zod, Winston, JWT, bcrypt, RabbitMQ e Redis)

#### Enterprise Patterns

- Repository
- Unit of Work (no `pedido-service`)
- Transaction Script (services de autenticação e usuário no `auth-service`)
- Value Objects (`cpf`, `email`, `cep`, `telefone`)

### 🧱 Princípios

- SOLID

---

## 🏗️ Arquitetura do Sistema

O sistema é composto por serviços independentes, orquestrados pelo [`docker-compose.yml`](docker-compose.yml):

- **app (Angular + NGINX)**
  Serve o frontend e atua como gateway. O NGINX em [`app/nginx/default.conf`](app/nginx/default.conf) encaminha `/auth/` para o auth-service e `/pedido/` para o pedido-service.

- **Auth Service (Fastify)**
  Login e cadastro, atualização e exclusão de usuários. Emite JWT e publica os eventos `usuario.criado`, `usuario.atualizado` e `usuario.deletado`.

- **Pedido Service (Express)**
  Criação de pedidos (`POST /pedido`). Consome os eventos de usuário e mantém uma cópia local, com Redis e consulta HTTP ao auth-service quando o cache não tem o registro.

- **Mensageria (RabbitMQ)**
  Exchange `events` do tipo topic, para a comunicação assíncrona entre os serviços.

- **Banco de Dados**
  PostgreSQL 15, um banco por serviço (`auth-db` e `pedido-db`). As migrations sobem automaticamente no `docker compose up`.

- **Redis**
  Cache de usuários no pedido-service.

---

## 🖼️ Diagrama da Arquitetura

<img width="1695" height="652" alt="Diagrama da arquitetura do Clean Delivery" src="https://github.com/user-attachments/assets/b2357810-e700-4717-ab24-db03cb8d60df" />

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- Angular 19
- TypeScript
- RxJS
- Bootstrap
- Vitest

### Backend

- Node.js
- TypeScript
- Fastify (auth-service)
- Express (pedido-service)
- Zod
- Winston
- JWT e bcrypt
- Jest

### Infraestrutura

- Docker
- NGINX
- PostgreSQL
- Redis
- RabbitMQ

---

## 📂 Estrutura do Projeto

```bash
clean-delivery/
├── app/                 # Angular + NGINX
├── auth-service/        # autenticação (Fastify)
├── pedido-service/      # pedidos (Express)
└── docker-compose.yml
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Docker

Node.js só é necessário para desenvolver um serviço fora do Compose.

### Rodar com Docker

```bash
docker compose up --build
```

A aplicação estará disponível em:

```bash
http://localhost
```

---

## 🔐 Funcionalidades

- ✅ Login
- ✅ Cadastro, atualização e exclusão de usuários
- ✅ Papéis `cliente`, `entregador` e `admin` no domínio
- ✅ Área do cliente, com cadastro de pedido no dashboard
- ✅ Sincronização de usuários entre serviços via RabbitMQ

A interface atual cobre o login e a área do cliente. Aceitar entrega existe como caso de uso no código, ainda sem rota exposta.

---

## 📚 Aprendizados

Durante o desenvolvimento deste projeto foram explorados:

- Estruturação de sistemas escaláveis
- Organização de código em camadas
- Comunicação entre microserviços
- Boas práticas de desenvolvimento frontend e backend

---

## 📌 Próximos Passos

- [ ] Implementar refresh token
- [ ] Melhorar o tratamento global de erros
- [x] Logs estruturados (Winston)
- [ ] Métricas
- [x] Testes unitários (Jest nos serviços e Vitest no frontend)
- [ ] Ampliar testes de integração
- [ ] CI/CD

---

## 👨‍💻 Autor

Desenvolvido por Humberto Pereira.

---

## 📄 Licença

Este projeto está sob a licença MIT.
