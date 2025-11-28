# Status Monitor - Dashboard para Agências WordPress

O **Status Monitor** é uma plataforma SaaS/Dashboard desenvolvida para agências digitais e gestores de tráfego. O sistema permite monitorar a saúde técnica de múltiplos sites WordPress de forma centralizada ("headless") e gerenciar cobranças simples para clientes.

O projeto utiliza **Next.js 16** com **Server Actions** para o backend, **Prisma** para o banco de dados e **Tailwind CSS v4** para a estilização.

## 🚀 Funcionalidades Principais

### 🏢 Painel do Administrador (Agência)
* **Gestão de Clientes:** Cadastro de clientes (Gestores/Donos de sites) com geração de slugs e códigos de acesso.
* **Vinculação de Sites:** Adição de múltiplos sites WordPress por cliente, utilizando URL e Token de API.
* **Gestão Financeira:** Criação de faturas simples com links de pagamento externos (ex: InfinitePay) e controle de status (Pendente/Pago).
* **Visão Geral:** Dashboard com contagem total de sites online, offline e clientes ativos.

### 👤 Painel do Cliente
* **Monitoramento em Tempo Real:** Verificação de *uptime* (Online/Offline) com atualização ao vivo via polling.
* **Status Técnico:** Visualização da versão do WordPress, versão do PHP, IP do servidor e tema ativo.
* **Plugins e Logs:** Listagem de plugins instalados e histórico de atualizações recentes.
* **Relatórios:** Geração de relatórios técnicos em PDF via `react-to-print`.
* **Financeiro:** Visualização de faturas pendentes com link direto para pagamento.
* **Segurança:** Possibilidade de alterar a própria senha de acesso.

---

## 🛠️ Stack Tecnológica

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* **Banco de Dados:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
* **Animações:** Framer Motion
* **Ícones:** Lucide React
* **Autenticação:** Customizada (BCrypt para Admin / Access Code para Clientes)

---

## ⚙️ Pré-requisitos

* Node.js 18+ (Recomendado 20+ para Next.js 16).
* Banco de dados PostgreSQL (Local ou hospedado como Supabase/Neon).
* Um site WordPress com o endpoint de API compatível (veja abaixo).
