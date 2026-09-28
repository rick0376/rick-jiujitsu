import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import styles from "./styles.module.scss";
export default async function FinancePage(){
  await requirePermission("finance.view");
  const payments=await prisma.payment.findMany({include:{student:{select:{name:true}}},orderBy:{dueDate:"desc"},take:100});
  const total=payments.filter(p=>p.status==="PAID").reduce((a,p)=>a+Number(p.amount)-Number(p.discount),0);
  return <div><PageHeader title="Financeiro" subtitle="Mensalidades, vencimentos, pagamentos e inadimplência."/>
    <div className={styles.summary}><article><span>Recebido</span><b>R$ {total.toFixed(2)}</b></article><article><span>Lançamentos</span><b>{payments.length}</b></article></div>
    <div className={styles.table}><table><thead><tr><th>Aluno</th><th>Referência</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr></thead><tbody>{payments.map(p=><tr key={p.id}><td>{p.student.name}</td><td>{p.reference}</td><td>R$ {Number(p.amount).toFixed(2)}</td><td>{new Intl.DateTimeFormat("pt-BR").format(p.dueDate)}</td><td>{p.status}</td></tr>)}{!payments.length&&<tr><td colSpan={5}>Nenhuma mensalidade lançada.</td></tr>}</tbody></table></div>
  </div>
}
