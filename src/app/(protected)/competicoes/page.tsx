import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import styles from "./styles.module.scss";

export default async function Page() {
  await requirePermission("competitions.view");
  return <div><PageHeader title="Competições" subtitle="Inscrições, categorias, peso, resultados e medalhas."/><section className={styles.panel}><p>Este módulo está preparado e integrado à segurança do sistema. Use as telas e APIs deste projeto como base para evoluir os fluxos específicos durante os testes.</p></section></div>
}
