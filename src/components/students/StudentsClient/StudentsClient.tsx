"use client";
import { useState } from "react";
import styles from "./styles.module.scss";

type Student = {
  id:string; registration:string; name:string; email:string|null; phone:string|null; photoUrl:string|null;
  belt:string; stripes:number; status:string; weightKg:number|null; monthlyFee:number; birthDate:string|null; joinedAt:string;
};

export default function StudentsClient({students:initial,canCreate,canEdit}:{students:Student[];canCreate:boolean;canEdit:boolean}) {
  const [students,setStudents]=useState(initial);
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Student|null>(null);
  const [saving,setSaving]=useState(false);

  async function save(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd=new FormData(e.currentTarget);
    let photoUrl=editing?.photoUrl||"";
    const file=fd.get("photo");
    if(file instanceof File && file.size>0){
      const up=new FormData();up.set("file",file);up.set("folder","students");
      const ur=await fetch("/api/uploads/image",{method:"POST",body:up});
      if(ur.ok){const ud=await ur.json();photoUrl=ud.secure_url;}
    }
    const payload={
      registration:String(fd.get("registration")||""),
      name:String(fd.get("name")||""),
      email:String(fd.get("email")||"")||null,
      phone:String(fd.get("phone")||"")||null,
      belt:String(fd.get("belt")||"WHITE"),
      stripes:Number(fd.get("stripes")||0),
      weightKg:fd.get("weightKg")?Number(fd.get("weightKg")):null,
      monthlyFee:Number(fd.get("monthlyFee")||0),
      photoUrl
    };
    const res=await fetch(editing?`/api/students/${editing.id}`:"/api/students",{method:editing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const data=await res.json(); setSaving(false);
    if(!res.ok){alert(data.error||"Erro ao salvar");return;}
    setStudents(prev=>editing?prev.map(s=>s.id===data.id?data:s):[...prev,data].sort((a,b)=>a.name.localeCompare(b.name)));
    setOpen(false);setEditing(null);
  }

  return <div>
    {canCreate&&<button className={styles.add} onClick={()=>{setEditing(null);setOpen(true)}}>+ Novo aluno</button>}
    <div className={styles.tableWrap}><table><thead><tr><th>Aluno</th><th>Faixa</th><th>Contato</th><th>Status</th><th></th></tr></thead><tbody>
      {students.map(s=><tr key={s.id}><td><div className={styles.person}>{s.photoUrl?<img src={s.photoUrl} alt=""/>:<span>{s.name[0]}</span>}<div><b>{s.name}</b><small>{s.registration}</small></div></div></td><td>{s.belt} • {s.stripes} grau(s)</td><td>{s.phone||s.email||"-"}</td><td>{s.status}</td><td>{canEdit&&<button className={styles.edit} onClick={()=>{setEditing(s);setOpen(true)}}>Editar</button>}</td></tr>)}
      {!students.length&&<tr><td colSpan={5}>Nenhum aluno cadastrado.</td></tr>}
    </tbody></table></div>

    {open&&<div className={styles.modal}><form onSubmit={save} className={styles.form}><h2>{editing?"Editar aluno":"Novo aluno"}</h2>
      <div className={styles.fields}>
        <label>Matrícula<input name="registration" required defaultValue={editing?.registration}/></label>
        <label>Nome<input name="name" required defaultValue={editing?.name}/></label>
        <label>E-mail<input name="email" type="email" defaultValue={editing?.email||""}/></label>
        <label>Telefone<input name="phone" defaultValue={editing?.phone||""}/></label>
        <label>Faixa<select name="belt" defaultValue={editing?.belt||"WHITE"}>{["WHITE","BLUE","PURPLE","BROWN","BLACK","RED_BLACK","RED_WHITE","RED"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Graus<input name="stripes" type="number" min="0" max="10" defaultValue={editing?.stripes||0}/></label>
        <label>Peso (kg)<input name="weightKg" type="number" step=".1" defaultValue={editing?.weightKg||""}/></label>
        <label>Mensalidade<input name="monthlyFee" type="number" step=".01" defaultValue={editing?.monthlyFee||0}/></label>
        <label className={styles.full}>Foto<input name="photo" type="file" accept="image/*"/></label>
      </div>
      <div className={styles.actions}><button type="button" onClick={()=>{setOpen(false);setEditing(null)}}>Cancelar</button><button disabled={saving}>{saving?"Salvando...":"Salvar"}</button></div>
    </form></div>}
  </div>
}
