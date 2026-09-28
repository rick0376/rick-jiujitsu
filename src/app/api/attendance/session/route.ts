import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";
export async function POST(req:Request){
  const auth=await apiRequirePermission("attendance.manage"); if("error" in auth)return auth.error;
  const body=await req.json();
  const session=await prisma.trainingSession.create({data:{title:String(body.title||"Treino"),date:new Date(),attendances:{create:(body.items||[]).map((i:any)=>({studentId:i.studentId,status:i.status,checkInAt:i.status==="PRESENT"?new Date():null}))}}});
  await audit(auth.user.id,"CREATE","TrainingSession",session.id);
  return NextResponse.json({ok:true,id:session.id});
}
