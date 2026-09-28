import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import styles from "./styles.module.scss";

export default async function Page() {
  await requirePermission("graduations.view");
  return <div><PageHeader title="Graduações" subtitle="Histórico de faixas, graus, datas e responsáveis."/><section className={styles.panel}><p>Este módulo está preparado e integrado à segurança do sistema. Use as telas e APIs deste projeto como base para evoluir os fluxos específicos durante os testes.</p></section></div>
}
