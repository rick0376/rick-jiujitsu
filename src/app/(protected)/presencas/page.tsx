import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import AttendanceClient from "@/components/attendance/AttendanceClient/AttendanceClient";

export default async function AttendancePage(){
  const user=await requirePermission("attendance.view");
  const students=await prisma.student.findMany({where:{status:"ACTIVE"},select:{id:true,name:true,belt:true,photoUrl:true},orderBy:{name:"asc"}});
  return <div><PageHeader title="Presenças" subtitle="Crie o treino do dia e registre presença, falta ou justificativa."/><AttendanceClient students={students} canManage={user.permissions.includes("attendance.manage")}/></div>
}
