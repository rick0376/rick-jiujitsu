import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  const auth=await apiRequirePermission("students.edit"); if("error" in auth)return auth.error;
  const {id}=await params; const body=await req.json();
  const item=await prisma.student.update({where:{id},data:{
    registration:String(body.registration),name:String(body.name),email:body.email||null,phone:body.phone||null,photoUrl:body.photoUrl||null,
    belt:body.belt,stripes:Number(body.stripes||0),weightKg:body.weightKg||null,monthlyFee:Number(body.monthlyFee||0)
  }});
  await audit(auth.user.id,"UPDATE","Student",id);
  return NextResponse.json({...item,weightKg:item.weightKg?Number(item.weightKg):null,monthlyFee:Number(item.monthlyFee)});
}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  const auth=await apiRequirePermission("students.delete"); if("error" in auth)return auth.error;
  const {id}=await params; await prisma.student.delete({where:{id}}); await audit(auth.user.id,"DELETE","Student",id);
  return NextResponse.json({ok:true});
}
