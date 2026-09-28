"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
type U={id:string;name:string;email:string;status:string;roles:string[];overrides:{code:string;allowed:boolean}[]};
type P={id:string;code:string;label:string;description:string|null};
type R={id:string;name:string;description:string|null};
export default function UsersClient({users,permissions,roles,canManage}:{users:U[];permissions:P[];roles:R[];canManage:boolean}){
  const [selected,setSelected]=useState<U|null>(users[0]||null);
  async function toggle(code:string,allowed:boolean){if(!selected)return;const res=await fetch(`/api/users/${selected.id}/permissions`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,allowed})});if(!res.ok){alert("Falha ao atualizar");return;}setSelected({...selected,overrides:[...selected.overrides.filter(x=>x.code!==code),{code,allowed}]});}
  return <div className={styles.layout}><section className={styles.users}>{users.map(u=><button key={u.id} className={selected?.id===u.id?styles.sel:""} onClick={()=>setSelected(u)}><b>{u.name}</b><span>{u.email}</span><small>{u.roles.join(", ")||"Sem perfil"}</small></button>)}</section><section className={styles.perms}>{selected?<><h2>{selected.name}</h2><p>Permissões individuais sobrescrevem as permissões herdadas do perfil.</p>{permissions.map(p=>{const o=selected.overrides.find(x=>x.code===p.code);return <div className={styles.perm} key={p.id}><div><b>{p.label}</b><small>{p.code}</small></div>{canManage?<select value={o===undefined?"inherit":o.allowed?"allow":"deny"} onChange={e=>e.target.value==="inherit"?void 0:toggle(p.code,e.target.value==="allow")}><option value="inherit">Herdar do perfil</option><option value="allow">Permitir</option><option value="deny">Bloquear</option></select>:<span>{o?"Personalizada":"Herdada"}</span>}</div>})}</>:<p>Nenhum usuário.</p>}</section></div>
}
