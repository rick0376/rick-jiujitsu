// prisma/seed.ts

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const permissionSeeds = [
  ["dashboard.view", "Ver dashboard"],
  ["students.view", "Ver alunos"],
  ["students.create", "Cadastrar alunos"],
  ["students.edit", "Editar alunos"],
  ["students.delete", "Excluir alunos"],

  ["attendance.view", "Ver presença"],
  ["attendance.manage", "Gerenciar presença"],

  ["graduations.view", "Ver graduações"],
  ["graduations.manage", "Gerenciar graduações"],

  ["evaluations.view", "Ver avaliações"],
  ["evaluations.manage", "Gerenciar avaliações"],

  ["finance.view", "Ver financeiro"],
  ["finance.manage", "Gerenciar financeiro"],

  ["events.view", "Ver eventos"],
  ["events.manage", "Gerenciar eventos"],

  ["competitions.view", "Ver competições"],
  ["competitions.manage", "Gerenciar competições"],

  ["timer.use", "Usar cronômetro"],
  ["timer.manage_pairs", "Gerenciar duplas"],

  ["users.view", "Ver usuários"],
  ["users.manage", "Gerenciar usuários e permissões"],

  ["settings.manage", "Gerenciar configurações"],
] as const;

async function main() {
  for (const [code, label] of permissionSeeds) {
    await prisma.permission.upsert({
      where: { code },
      update: { label },
      create: { code, label },
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Acesso administrativo total",
      isSystem: true,
    },
  });

  const permissions = await prisma.permission.findMany();

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@mandiok.com.br",
    },
    update: {},
    create: {
      name: "Administrador Mandiok",
      email: "admin@mandiok.com.br",
      passwordHash,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  const groups = [
    "Adulto Iniciante",
    "Adulto Avançado",
    "Infantil",
  ];

  for (const name of groups) {
    await prisma.classGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed concluído.");
  console.log(
    "Login inicial: admin@mandiok.com.br / Admin@123",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });