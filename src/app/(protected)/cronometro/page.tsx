import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import TrainingTimer from "@/components/timer/TrainingTimer/TrainingTimer";

export default async function TimerPage(){
  const user=await requirePermission("timer.use");
  const students=await prisma.student.findMany({where:{status:"ACTIVE"},select:{id:true,name:true,belt:true,weightKg:true},orderBy:{name:"asc"}});
  return <div><PageHeader title="Cronômetro de Treino" subtitle="Funciona sozinho ou com casamento de duplas e rodízio."/>
    <TrainingTimer canPair={user.permissions.includes("timer.manage_pairs")} students={students.map(s=>({...s,weightKg:s.weightKg?Number(s.weightKg):null}))}/>
  </div>
}
