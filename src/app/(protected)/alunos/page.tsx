// src/app/(protected)/alunos/page.tsx

import AlunosClient from "@/components/alunos/AlunosClient/AlunosClient";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AlunosPage() {
  const usuario = await requirePermission("students.view");

  const alunos = await prisma.student.findMany({
    orderBy: {
      name: "asc",
    },
    take: 500,
  });

  const alunosFormatados = alunos.map((aluno) => ({
    ...aluno,
    weightKg: aluno.weightKg ? Number(aluno.weightKg) : null,
    monthlyFee: Number(aluno.monthlyFee),
    birthDate: aluno.birthDate?.toISOString() || null,
    joinedAt: aluno.joinedAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Alunos"
        subtitle="Cadastro, graduação, contato e situação do aluno."
      />

      <AlunosClient
        alunos={alunosFormatados}
        podeCadastrar={usuario.permissions.includes("students.create")}
        podeEditar={usuario.permissions.includes("students.edit")}
      />
    </div>
  );
}