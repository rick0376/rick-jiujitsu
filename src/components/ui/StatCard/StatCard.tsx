import styles from "./styles.module.scss";
export default function StatCard({ label,value,detail }:{label:string;value:string|number;detail?:string}) {
  return <article className={styles.card}><span>{label}</span><strong>{value}</strong>{detail&&<small>{detail}</small>}</article>
}
