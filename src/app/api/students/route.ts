import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";
import { z } from "zod";

const schema=z.object({
  registration:z.string().min(1),
  name:z.string().min(2),
  email:z.string().email().nullable().optional(),
  phone:z.string().nullable().optional(),
  photoUrl:z.string().nullable().optional(),
  belt:z.enum(["WHITE","BLUE","PURPLE","BROWN","BLACK","RED_BLACK","RED_WHITE","RED"]),
  stripes:z.number().int().min(0).max(10),
  weightKg:z.number().positive().nullable().optional(),
  monthlyFee:z.number().min(0)
});

export async function GET(){
  const auth=await apiRequirePermission("students.view"); if("error" in auth)return auth.error;
  const items=await prisma.student.findMany({orderBy:{name:"asc"}});
  return NextResponse.json(items.map(s=>({...s,weightKg:s.weightKg?Number(s.weightKg):null,monthlyFee:Number(s.monthlyFee)})));
}
export async function POST(req:Request){
  const auth=await apiRequirePermission("students.create"); if("error" in auth)return auth.error;
  const parsed=schema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Dados inválidos."},{status:400});
  const item=await prisma.student.create({data:{...parsed.data,email:parsed.data.email||null,weightKg:parsed.data.weightKg??null}});
  await audit(auth.user.id,"CREATE","Student",item.id);
  return NextResponse.json({...item,weightKg:item.weightKg?Number(item.weightKg):null,monthlyFee:Number(item.monthlyFee)});
}
