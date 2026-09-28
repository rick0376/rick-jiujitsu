"use client";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";
type S = { id: string; name: string; belt: string; photoUrl: string | null };
export default function AttendanceClient({ students, canManage }: { students: S[]; canManage: boolean }) {
  const [state, setState] = useState<Record<string, string>>(() => Object.fromEntries(students.map(s => [s.id, "PRESENT"])));
  const [title, setTitle] = useState(`Treino ${new Date().toLocaleDateString("pt-BR")}`);
  const [saving, setSaving] = useState(false);
  const summary = useMemo(() => Object.values(state).reduce((a, v) => ({ ...a, [v]: (a[v] || 0) + 1 }), {} as Record<string, number>), [state]);
  async function save() { if (!canManage) return; setSaving(true); const res = await fetch("/api/attendance/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, items: Object.entries(state).map(([studentId, status]) => ({ studentId, status })) }) }); setSaving(false); alert(res.ok ? "Presença registrada." : "Erro ao registrar."); }
  return <div>
    <div className={styles.top}><input value={title} onChange={e => setTitle(e.target.value)} /><div><span>Presentes <b>{summary.PRESENT || 0}</b></span><span>Faltas <b>{summary.ABSENT || 0}</b></span><span>Just. <b>{summary.JUSTIFIED || 0}</b></span></div>{canManage && <button onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar chamada"}</button>}</div>
    <div className={styles.grid}>{students.map(s => <article key={s.id}><div className={styles.avatar}>{s.photoUrl ? <img src={s.photoUrl} alt="" /> : s.name[0]}</div><div><b>{s.name}</b><small>{s.belt}</small></div><select value={state[s.id]} onChange={e => setState(v => ({ ...v, [s.id]: e.target.value }))}><option value="PRESENT">Presente</option><option value="ABSENT">Falta</option><option value="JUSTIFIED">Justificada</option></select></article>)}</div>
  </div>
}
