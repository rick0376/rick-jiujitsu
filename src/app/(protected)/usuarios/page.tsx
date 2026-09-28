import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import UsersClient from "@/components/users/UsersClient/UsersClient";
export default async function UsersPage(){
  const current=await requirePermission("users.view");
  const [users,permissions,roles]=await Promise.all([
    prisma.user.findMany({include:{roleAssignments:{include:{role:true}},permissions:{include:{permission:true}}},orderBy:{name:"asc"}}),
    prisma.permission.findMany({orderBy:{code:"asc"}}),
    prisma.role.findMany({orderBy:{name:"asc"}})
  ]);
  return <div><PageHeader title="Usuários e permissões" subtitle="Acesso individual por função e permissões específicas."/><UsersClient canManage={current.permissions.includes("users.manage")} users={users.map(u=>({id:u.id,name:u.name,email:u.email,status:u.status,roles:u.roleAssignments.map(x=>x.role.name),overrides:u.permissions.map(x=>({code:x.permission.code,allowed:x.allowed}))}))} permissions={permissions} roles={roles}/></div>
}
