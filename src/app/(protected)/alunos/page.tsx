import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import StudentsClient from "@/components/students/StudentsClient/StudentsClient";

export default async function StudentsPage() {
  const user = await requirePermission("students.view");
  const students = await prisma.student.findMany({orderBy:{name:"asc"},take:500});
  return <div>
    <PageHeader title="Alunos" subtitle="Cadastro, graduação, contato e situação do aluno."/>
    <StudentsClient canCreate={user.permissions.includes("students.create")} canEdit={user.permissions.includes("students.edit")} students={students.map(s=>({...s,weightKg:s.weightKg?Number(s.weightKg):null,monthlyFee:Number(s.monthlyFee),birthDate:s.birthDate?.toISOString()||null,joinedAt:s.joinedAt.toISOString()}))}/>
  </div>
}
