import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import styles from "./styles.module.scss";
export default async function EventsPage(){
  await requirePermission("events.view");
  const items=await prisma.event.findMany({orderBy:{startsAt:"asc"}});
  return <div><PageHeader title="Eventos" subtitle="Graduações, seminários, campeonatos e eventos sociais."/>
    <div className={styles.grid}>{items.map(e=><article key={e.id}>{e.coverUrl&&<img src={e.coverUrl} alt=""/>}<div><span>{e.type}</span><h3>{e.title}</h3><p>{e.description||"Sem descrição."}</p><b>{new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(e.startsAt)}</b></div></article>)}{!items.length&&<p>Nenhum evento cadastrado.</p>}</div>
  </div>
}
