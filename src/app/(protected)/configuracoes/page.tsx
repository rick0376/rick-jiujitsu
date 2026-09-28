import { requirePermission } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import styles from "./styles.module.scss";

export default async function Page() {
  await requirePermission("settings.manage");
  return <div><PageHeader title="Configurações" subtitle="Dados da academia, endereço, contatos, horários e preferências."/><section className={styles.panel}><p>Este módulo está preparado e integrado à segurança do sistema. Use as telas e APIs deste projeto como base para evoluir os fluxos específicos durante os testes.</p></section></div>
}
