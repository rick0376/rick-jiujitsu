import Link from "next/link";
export default function Page(){return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20}}><div style={{textAlign:"center"}}><h1>Sem permissão</h1><p>Seu usuário não possui acesso a este módulo.</p><Link href="/dashboard">Voltar ao dashboard</Link></div></main>}
