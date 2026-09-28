import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  const auth=await apiRequirePermission("users.manage"); if("error" in auth)return auth.error;
  const {id}=await params; const {code,allowed}=await req.json();
  const p=await prisma.permission.findUnique({where:{code}}); if(!p)return NextResponse.json({error:"Permissão inexistente."},{status:404});
  await prisma.userPermission.upsert({where:{userId_permissionId:{userId:id,permissionId:p.id}},update:{allowed:Boolean(allowed)},create:{userId:id,permissionId:p.id,allowed:Boolean(allowed)}});
  await audit(auth.user.id,"UPDATE_PERMISSION","User",id,{code,allowed});
  return NextResponse.json({ok:true});
}
