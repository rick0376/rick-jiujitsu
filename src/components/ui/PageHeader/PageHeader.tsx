import styles from "./styles.module.scss";
export default function PageHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) {
  return <div className={styles.header}><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>;
}
