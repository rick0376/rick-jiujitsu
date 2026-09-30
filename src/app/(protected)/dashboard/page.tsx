// src/app/(protected)/dashboard/page.tsx

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import StatCard from "@/components/ui/StatCard/StatCard";
import styles from "./styles.module.scss";

export default async function DashboardPage() {
  await requirePermission("dashboard.view");
  const now = new Date();
  const [students, active, pending, presentCount, events] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.payment.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
    prisma.attendance.count({ where: { status: "PRESENT", createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } } }),
    prisma.event.findMany({ where: { startsAt: { gte: now } }, take: 5, orderBy: { startsAt: "asc" } })
  ]);
  const belts = await prisma.student.groupBy({ by: ["belt"], _count: { _all: true } });
  return <div>
    <PageHeader title="Dashboard" subtitle="Visão geral da equipe Mandiok Jiu-Jitsu." />
    <div className={styles.stats}>
      <StatCard label="Alunos cadastrados" value={students} />
      <StatCard label="Alunos ativos" value={active} />
      <StatCard label="Mensalidades pendentes" value={pending} />
      <StatCard label="Presenças no mês" value={presentCount} />
    </div>
    <div className={styles.grid}>
      <section className={styles.panel}><h2>Distribuição por faixa</h2>{belts.length ? belts.map(b => <div className={styles.row} key={b.belt}><span>{b.belt}</span><b>{b._count._all}</b></div>) : <p>Cadastre alunos para visualizar.</p>}</section>
      <section className={styles.panel}><h2>Próximos eventos</h2>{events.length ? events.map(e => <div className={styles.row} key={e.id}><span>{e.title}</span><b>{new Intl.DateTimeFormat("pt-BR").format(e.startsAt)}</b></div>) : <p>Nenhum evento futuro.</p>}</section>
    </div>
  </div>
}
