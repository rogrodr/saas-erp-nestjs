# RSON ERP

Sistema de gestão empresarial (ERP) **multi-tenant** full-stack, desenvolvido como projeto de portfólio / TCC. Cada empresa cadastrada tem seus próprios dados isolados (produtos, clientes, vendas, financeiro), acessados por múltiplos usuários com diferentes papéis de permissão.

**[🔗 Acessar demo ao vivo](https://saas-erp-nestjs.vercel.app/login)**

> ⚠️ O backend está hospedado em um plano gratuito (Render) — a primeira requisição após um período de inatividade pode levar até ~50 segundos enquanto o servidor "acorda". Isso já é sinalizado para o usuário na própria tela de login.

## Demo

Use as credenciais abaixo para explorar o sistema já populado com dados de exemplo (produtos, clientes, vendas e compras):

```
E-mail: admin@rson.com
Senha:  admin123
```

## Funcionalidades

- **Autenticação multi-tenant** — JWT + refresh token, cadastro self-service de empresa (cria empresa + usuário admin), recuperação de senha
- **Dashboard** — faturamento do mês, contas a receber em atraso, alertas de estoque baixo, gráfico de produtos mais vendidos
- **Vendas e Compras** — pedidos com múltiplos itens, cálculo automático de total
- **Produtos e Estoque** — CRUD de produtos, controle de estoque mínimo, movimentações (entrada/saída/ajuste)
- **Clientes e Fornecedores** — CRUD completo, com endereços e contatos
- **Financeiro** — contas a pagar e a receber, com baixa de pagamento/recebimento
- **Histórico de Preços** — variação de preço de compra/venda por produto, consulta de menor preço por período
- **Usuários e permissões** — papéis Admin / Gerente / Funcionário
- **Auditoria** — log de ações realizadas por usuário, entidade e tipo de ação
- Tabelas com busca e paginação em todas as telas de listagem

## Stack

**Backend** (`erp-backend/`)
- NestJS + TypeScript
- Prisma ORM + PostgreSQL (Supabase)
- Autenticação JWT (access + refresh token) com Passport
- Validação de DTOs com `class-validator`
- Deploy: Render

**Frontend** (`erp-frontend/`)
- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- Axios (com interceptor de refresh token automático)
- Recharts (gráficos do dashboard)
- Deploy: Vercel

## Estrutura do repositório

```
.
├── erp-backend/     # API NestJS
└── erp-frontend/    # SPA React
```

## Rodando localmente

### Backend

```bash
cd erp-backend
npm install

# configure o .env com DATABASE_URL, DIRECT_URL (se aplicável) e JWT_SECRET
npx prisma migrate deploy
npm run start:dev
```

A API sobe em `http://localhost:3000` por padrão.

### Frontend

```bash
cd erp-frontend
npm install
cp .env.example .env
# ajuste VITE_API_URL em .env para apontar pro backend local
npm run dev
```

O frontend sobe em `http://localhost:5173`.


### Lições Aprendidas

Alguns problemas reais enfrentados ao colocar o projeto em produção, e como foram resolvidos — deixados aqui porque diagnosticar isso ensinou mais sobre deploy do que qualquer tutorial:

Supabase + Render e IPv6: a connection string "Direct connection" do Supabase resolve para um endereço IPv6, mas o Render (no plano usado) só tem saída IPv4 — resultando em ENETUNREACH. Resolvido trocando para a connection string do Session Pooler do Supabase (IPv4).
nest start em produção estoura memória: o Start Command do Render estava configurado para yarn start, que roda nest start — esse comando recompila TypeScript em tempo de execução (via webpack), consumindo bem mais RAM do que apenas executar o JavaScript já compilado. No plano gratuito (RAM limitada), isso causava JavaScript heap out of memory e um loop de crash silencioso. Corrigido trocando o Start Command para yarn start:prod (node dist/main).
tsconfig.build.json sobrescreve tsconfig.json: ao mudar para start:prod, um novo erro surgiu (Cannot find module dist/main) porque um arquivo na raiz do projeto (prisma.config.ts) fazia o TypeScript colocar a saída em dist/src/main.js em vez de dist/main.js. A causa raiz: arrays como exclude não se combinam quando um tsconfig estende outro via extends — o tsconfig.build.json tinha seu próprio exclude, que sobrescrevia completamente o do tsconfig.json pai. Corrigido adicionando rootDir e ajustando o exclude no arquivo correto (tsconfig.build.json).

## Licença

Projeto de portfólio pessoal — sem licença de uso comercial definida.
