import Link from "next/link";
import styles from "./styles.module.scss";

const highlights = [
  { name: "Ana Clara", title: "Destaque do mês", text: "Assiduidade, disciplina e evolução técnica." },
  { name: "Bruno Alves", title: "Competidor destaque", text: "Excelente desempenho nos treinos e competições." },
  { name: "Lucas Mendes", title: "Maior frequência", text: "Presença constante e dedicação nos treinos." }
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}><span>MJ</span><div><strong>MANDIOK</strong><small>JIU-JITSU</small></div></div>
        <nav><a href="#sobre">Sobre</a><a href="#destaques">Destaques</a><a href="#eventos">Eventos</a><a href="#contato">Contato</a></nav>
        <Link className={styles.login} href="/login">Área do aluno</Link>
      </header>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>DISCIPLINA • RESPEITO • EVOLUÇÃO</span>
          <h1>Mais que luta.<br/><em>Uma equipe.</em></h1>
          <p>Treinos para iniciantes, competidores, crianças e adultos. Evolução técnica com acompanhamento completo.</p>
          <div className={styles.actions}><a href="#contato">Quero treinar</a><Link href="/login">Entrar no sistema</Link></div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.glow}></div>
          <strong>MANDIOK</strong>
          <span>JIU-JITSU</span>
          <small>Gestão, performance e comunidade.</small>
        </div>
      </section>

      <section id="sobre" className={styles.section}>
        <span className={styles.kicker}>NOSSA EQUIPE</span>
        <h2>Treino sério. Ambiente de família.</h2>
        <p>O sistema integra gestão de alunos, presença, graduação, mensalidades, competições e acompanhamento de evolução.</p>
      </section>

      <section id="destaques" className={styles.section}>
        <span className={styles.kicker}>ALUNOS EM DESTAQUE</span>
        <div className={styles.grid}>
          {highlights.map((h) => <article className={styles.card} key={h.name}><div className={styles.avatar}>{h.name.slice(0,1)}</div><h3>{h.name}</h3><strong>{h.title}</strong><p>{h.text}</p></article>)}
        </div>
      </section>

      <section id="eventos" className={styles.darkSection}>
        <span className={styles.kicker}>EVENTOS</span>
        <h2>Graduações, seminários e competições.</h2>
        <div className={styles.events}>
          <article><b>Graduação da Equipe</b><span>Evento interno com entrega de faixas e graus.</span></article>
          <article><b>Open Mat</b><span>Treino aberto para integração e evolução.</span></article>
          <article><b>Campeonatos</b><span>Acompanhamento dos atletas e resultados.</span></article>
        </div>
      </section>

      <section id="contato" className={styles.contact}>
        <div><span className={styles.kicker}>VENHA TREINAR</span><h2>Conheça nosso treino.</h2><p>Cadastre o endereço real da academia em Configurações para exibir mapa, telefone, WhatsApp e horários.</p></div>
        <div className={styles.mapPlaceholder}>MAPA / COMO CHEGAR</div>
      </section>

      <footer>© {new Date().getFullYear()} Mandiok Jiu-Jitsu • Disciplina e evolução.</footer>
    </main>
  );
}
