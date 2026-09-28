"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CalendarCheck, Award, ClipboardList, WalletCards, Trophy, TimerReset, CalendarDays, ShieldCheck, Settings, Menu, X, LogOut } from "lucide-react";
import styles from "./styles.module.scss";
import type { SessionUser } from "@/lib/auth";

const nav = [
  ["dashboard.view", "/dashboard", "Dashboard", LayoutDashboard],
  ["students.view", "/alunos", "Alunos", Users],
  ["attendance.view", "/presencas", "Presenças", CalendarCheck],
  ["graduations.view", "/graduacoes", "Graduações", Award],
  ["evaluations.view", "/avaliacoes", "Avaliações", ClipboardList],
  ["finance.view", "/financeiro", "Financeiro", WalletCards],
  ["competitions.view", "/competicoes", "Competições", Trophy],
  ["events.view", "/eventos", "Eventos", CalendarDays],
  ["timer.use", "/cronometro", "Cronômetro", TimerReset],
  ["users.view", "/usuarios", "Usuários", ShieldCheck],
  ["settings.manage", "/configuracoes", "Configurações", Settings]
] as const;

export default function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  return <div className={styles.shell}>
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
      <div className={styles.brand}><span>RK</span><div><b>Rick Pereira</b><small>JIU-JITSU</small></div><button onClick={() => setOpen(false)}><X size={20} /></button></div>
      <nav>{nav.filter(([p]) => user.permissions.includes(p)).map(([_, href, label, Icon]) => <Link key={href} href={href} onClick={() => setOpen(false)}><Icon size={18} />{label}</Link>)}</nav>
      <button className={styles.logout} onClick={logout}><LogOut size={18} />Sair</button>
    </aside>
    <div className={styles.content}>
      <header><button className={styles.menu} onClick={() => setOpen(true)}><Menu /></button><div><b>{user.name}</b><span>{user.email}</span></div></header>
      <main>{children}</main>
    </div>
    {open && <button className={styles.backdrop} onClick={() => setOpen(false)} aria-label="Fechar menu" />}
  </div>
}
