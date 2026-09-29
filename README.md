# Rick Jiu-Jitsu — Sistema de Gestão

Base completa e modular para gestão de uma equipe de Jiu-Jitsu.

## Incluído nesta versão

- Site público da equipe
- Login com sessão HTTP-only via JWT
- Rotas protegidas
- Controle de permissões por perfil e por usuário
- Cadastro de alunos
- Upload de fotos para Cloudinary e gravação da URL no Neon/PostgreSQL
- Presenças
- Graduações (estrutura de banco + módulo protegido)
- Avaliações (estrutura de banco + módulo protegido)
- Financeiro / mensalidades
- Competições
- Eventos
- Dashboard
- Cronômetro normal
- Cronômetro com duplas
- Rodízio de duplas
- Último minuto com destaque dourado
- Usuários e permissões
- Auditoria
- PWA com service worker e ícones
- SCSS Modules por componente/tela

> A base foi criada de forma organizada para que os módulos possam ser refinados individualmente depois dos seus testes.

## 1. Requisitos

- Node.js 20+ recomendado
- PostgreSQL/Neon
- Conta Cloudinary

## 2. Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e preencha as chaves.

## 3. Banco de dados

Como o projeto foi preparado para Prisma moderno, configure `DATABASE_URL` e execute:

```bash
npx prisma generate
npx prisma migrate dev --name initial
npm run prisma:seed
```

Login inicial:

- E-mail: `admin@mandiok.com.br`
- Senha: `Admin@123`

Troque a senha após o primeiro teste.

## 4. Executar

```bash
npm run dev
```

Abra `http://localhost:3000`.

## 5. Cloudinary

Preencha:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="mandiok-jiujitsu"
```

O upload envia a imagem ao Cloudinary e apenas a URL é salva no banco.

## 6. Permissões

A lógica funciona em duas camadas:

1. `RolePermission`: permissões herdadas pelo perfil.
2. `UserPermission`: permissão específica do usuário, que pode permitir ou bloquear individualmente.

Exemplos:

- `students.view`
- `students.create`
- `students.edit`
- `attendance.manage`
- `finance.view`
- `timer.use`
- `timer.manage_pairs`
- `users.manage`

## 7. Organização principal

```text
src/
  app/
    (protected)/
      dashboard/
      alunos/
      presencas/
      graduacoes/
      avaliacoes/
      financeiro/
      competicoes/
      eventos/
      cronometro/
      usuarios/
      configuracoes/
    api/
      auth/
      students/
      attendance/
      uploads/
      users/
  components/
    auth/
    layout/
    students/
    attendance/
    timer/
    users/
    ui/
  lib/
    auth.ts
    api-auth.ts
    audit.ts
    cloudinary.ts
    prisma.ts
prisma/
  schema.prisma
  seed.ts
public/
  icons/
  sw.js
```

## 8. Deploy na Vercel

Cadastre as mesmas variáveis do `.env` no projeto da Vercel.

Build:

```bash
npm run build
```

Banco: use Neon/PostgreSQL com SSL.

## 9. Próximos refinamentos recomendados durante seus testes

- Tela completa de criação/edição de mensalidades
- CRUD visual completo de eventos e competições
- Histórico detalhado de graduações e avaliações
- Relatórios PDF
- Carteirinha com QR Code
- Regras avançadas do rodízio de duplas
- Integração de endereço real com mapa
- Notificações de mensalidade
- Área exclusiva do aluno
- Recuperação de senha por e-mail
- 2FA opcional
