// src/app/page.tsx

import {
  ArrowRight,
  Award,
  BarChart3,
  CalendarDays,
  Camera,
  Clock3,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Timer,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import styles from "./styles.module.scss";

type FooterLink = {
  label: string;
  href: string;
};

type ScheduleItem = {
  day: string;
  time: string;
};

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [settingsRows, mainFeatures, timerFeatures, highlights, events] =
    await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.siteCard.findMany({
        where: {
          section: "MAIN_FEATURE",
          active: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
      prisma.siteCard.findMany({
        where: {
          section: "TIMER_FEATURE",
          active: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
      prisma.highlight.findMany({
        where: {
          active: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 4,
      }),
      prisma.event.findMany({
        where: {
          published: true,
        },
        orderBy: {
          startsAt: "desc",
        },
        take: 4,
      }),
    ]);

  const settings = Object.fromEntries(
    settingsRows.map((item) => [item.key, item.value]),
  );

  const footerLinks = parseJson<FooterLink[]>(settings["footer.links"], []);
  const schedule = parseJson<ScheduleItem[]>(settings["home.schedule"], []);

  const navItems = [
    {
      label: settings["nav.home.label"] || "Início",
      href: settings["nav.home.href"] || "/",
    },
    {
      label: settings["nav.team.label"] || "Equipe",
      href: settings["nav.team.href"] || "#equipe",
    },
    {
      label: settings["nav.system.label"] || "Sistema",
      href: settings["nav.system.href"] || "#sistema",
    },
    {
      label: settings["nav.events.label"] || "Eventos",
      href: settings["nav.events.href"] || "#eventos",
    },
    {
      label: settings["nav.timer.label"] || "Cronômetro",
      href: settings["nav.timer.href"] || "#cronometro",
    },
    {
      label: settings["nav.contact.label"] || "Contato",
      href: settings["nav.contact.href"] || "#contato",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: settings["home.stats.students.value"] || "186",
      label: settings["home.stats.students.label"] || "Alunos Ativos",
      change: settings["home.stats.students.change"] || "+12%",
    },
    {
      icon: BarChart3,
      value: settings["home.stats.attendance.value"] || "78%",
      label: settings["home.stats.attendance.label"] || "Presença Média",
      change: settings["home.stats.attendance.change"] || "+8%",
    },
    {
      icon: Award,
      value: settings["home.stats.graduations.value"] || "24",
      label: settings["home.stats.graduations.label"] || "Graduações no Ano",
      change: settings["home.stats.graduations.change"] || "+33%",
    },
    {
      icon: CalendarDays,
      value: settings["home.stats.events.value"] || "12",
      label: settings["home.stats.events.label"] || "Eventos Realizados",
      change: settings["home.stats.events.change"] || "+100%",
    },
    {
      icon: ShieldCheck,
      value: settings["home.stats.payments.value"] || "R$ 12.480",
      label: settings["home.stats.payments.label"] || "Mensalidades em dia",
      change: settings["home.stats.payments.change"] || "+18%",
    },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroShade} />

        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/images/logo/logo.png"
              alt="Rick Pereira Jiu-Jitsu"
              width={150}
              height={70}
              priority
            />
          </Link>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.loginButton} href="/login">
              <UserRound size={16} />
              Entrar
            </Link>

            <a
              className={styles.ctaButton}
              href={settings["nav.cta.href"] || "#contato"}
            >
              {settings["nav.cta.label"] || "Quero conhecer"}
              <ArrowRight size={16} />
            </a>
          </div>
        </header>

        <div className={styles.heroContent}>
          <aside className={styles.sideLeft}>
            {(settings["home.hero.sideTextLeft"] ||
              "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA")
              .split("\n")
              .map((text) => (
                <span key={text}>{text}</span>
              ))}
          </aside>

          <div className={styles.heroText}>
            <span className={styles.heroEyebrow}>
              {settings["home.hero.eyebrow"] ||
                "DISCIPLINA • RESPEITO • EVOLUÇÃO • FAMÍLIA"}
            </span>

            <h1>
              EQUIPE
              <br />
              <strong>
                {settings["home.hero.title"] ||
                  "RICK PEREIRA JIU-JITSU"}
              </strong>
            </h1>

            <h2>
              {settings["home.hero.subtitle"] ||
                "MAIS QUE UM ESPORTE, UM ESTILO DE VIDA."}
            </h2>

            <p>
              {settings["home.hero.description"] ||
                "Treinamento de alto nível, disciplina, evolução e tecnologia para fortalecer ainda mais a equipe."}
            </p>

            <div className={styles.heroButtons}>
              <Link href="/login" className={styles.primaryButton}>
                <UserRound size={18} />
                {settings["home.hero.primaryButtonLabel"] ||
                  "Entrar no sistema"}
                <ArrowRight size={18} />
              </Link>

              <a
                href={
                  settings["home.hero.secondaryButtonHref"] ||
                  "#contato"
                }
                className={styles.secondaryButton}
              >
                <CalendarDays size={18} />
                {settings["home.hero.secondaryButtonLabel"] ||
                  "Agendar aula experimental"}
              </a>
            </div>
          </div>

          <aside className={styles.sideRight}>
            {(settings["home.hero.sideTextRight"] ||
              "FOCO\nDISCIPLINA\nRESPEITO\nEVOLUÇÃO\nSEMPRE.")
              .split("\n")
              .map((text) => (
                <span key={text}>{text}</span>
              ))}
          </aside>
        </div>
      </section>

      <section id="sistema" className={styles.featuresSection}>
        <div className={styles.featureGrid}>
          {mainFeatures.map((feature) => (
            <article className={styles.featureCard} key={feature.id}>
              <div className={styles.featureImage}>
                {feature.imageUrl ? (
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    {feature.slug === "sistema-gestao" && (
                      <Users size={48} />
                    )}

                    {feature.slug ===
                      "dashboard-inteligente" && (
                        <BarChart3 size={48} />
                      )}

                    {feature.slug === "cronometro-treino" && (
                      <Timer size={48} />
                    )}
                  </div>
                )}
              </div>

              <div className={styles.featureContent}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <Link href={feature.linkHref || "/login"}>
                  {feature.linkLabel || "Ver mais"}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className={styles.statCard} key={stat.label}>
                <div className={styles.statIcon}>
                  <Icon size={30} />
                </div>

                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>↑ {stat.change}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="equipe" className={styles.contentSection}>
        <div className={styles.dualGrid}>
          <div className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>
                  <Users size={22} />
                  {settings["home.highlights.title"] ||
                    "Alunos Destaques"}
                </h2>

                <p>
                  {settings["home.highlights.subtitle"] ||
                    "Exemplos de disciplina, evolução e comprometimento."}
                </p>
              </div>

              <Link href="/login">
                {settings["home.highlights.linkLabel"] ||
                  "Ver todos os alunos"}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.highlightGrid}>
              {highlights.map((highlight) => (
                <article
                  className={styles.highlightCard}
                  key={highlight.id}
                >
                  <div className={styles.highlightPhoto}>
                    {highlight.photoUrl ? (
                      <Image
                        src={highlight.photoUrl}
                        alt={highlight.studentName}
                        fill
                        sizes="220px"
                      />
                    ) : (
                      <UserRound size={48} />
                    )}
                  </div>

                  <div className={styles.highlightInfo}>
                    <h3>{highlight.studentName}</h3>
                    <span>Faixa a cadastrar</span>

                    <strong>
                      <Trophy size={16} />
                      {highlight.title}
                    </strong>

                    <p>{highlight.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div id="eventos" className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>
                  <CalendarDays size={22} />
                  {settings["home.events.title"] ||
                    "Eventos Realizados"}
                </h2>

                <p>
                  {settings["home.events.subtitle"] ||
                    "Momentos que fortalecem a nossa equipe."}
                </p>
              </div>

              <Link href="/login">
                {settings["home.events.linkLabel"] ||
                  "Ver todos os eventos"}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.eventGrid}>
              {events.map((event) => (
                <article className={styles.eventCard} key={event.id}>
                  <div className={styles.eventPhoto}>
                    {event.coverUrl ? (
                      <Image
                        src={event.coverUrl}
                        alt={event.title}
                        fill
                        sizes="220px"
                      />
                    ) : (
                      <CalendarDays size={46} />
                    )}
                  </div>

                  <div className={styles.eventInfo}>
                    <time>
                      {event.startsAt.toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </time>

                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cronometro" className={styles.timerSection}>
        <div className={styles.timerTitle}>
          <div>
            <Timer size={38} />
          </div>

          <div>
            <h2>
              {settings["home.timer.title"] ||
                "Cronômetro Inteligente de Treino"}
            </h2>

            <p>
              {settings["home.timer.subtitle"] ||
                "Ferramenta prática e completa para um treino mais organizado e dinâmico."}
            </p>
          </div>

          <span>
            {settings["home.timer.sideText"] ||
              "DO INÍCIO AO OSS, SEM COMPLICAÇÃO. TECNOLOGIA A FAVOR DA EVOLUÇÃO."}
          </span>
        </div>

        <div className={styles.timerGrid}>
          {timerFeatures.map((timer) => {
            const bullets = Array.isArray(timer.bullets)
              ? timer.bullets
              : [];

            return (
              <article className={styles.timerCard} key={timer.id}>
                <div className={styles.timerDescription}>
                  <h3>
                    <Timer size={22} />
                    {timer.title}
                  </h3>

                  <p>{timer.description}</p>

                  <ul>
                    {bullets.map((item, index) => (
                      <li key={`${timer.id}-${index}`}>
                        <span>✓</span>
                        {String(item)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.timerPreview}>
                  {timer.imageUrl ? (
                    <Image
                      src={timer.imageUrl}
                      alt={timer.title}
                      fill
                      sizes="420px"
                    />
                  ) : (
                    <>
                      <Clock3 size={42} />
                      <strong>
                        {timer.slug === "cronometro-simples"
                          ? "05:00"
                          : "00:58"}
                      </strong>
                      <small>
                        {timer.slug === "cronometro-simples"
                          ? "TEMPO DE LUTA"
                          : "ROUND 5 / 6"}
                      </small>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="contato" className={styles.bottomSection}>
        <div className={styles.locationPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>
                <MapPin size={24} />
                {settings["home.location.title"] ||
                  "Como chegar ao treino"}
              </h2>

              <p>
                {settings["home.location.subtitle"] ||
                  "Nossa sede está de portas abertas para receber você."}
              </p>
            </div>
          </div>

          <div className={styles.locationContent}>
            <div className={styles.academyImage}>
              {settings["home.location.imageUrl"] ? (
                <Image
                  src={settings["home.location.imageUrl"]}
                  alt="Academia Rick Pereira Jiu-Jitsu"
                  fill
                  sizes="350px"
                />
              ) : (
                <div className={styles.academyPlaceholder}>
                  <Image
                    src="/images/logo/logo.png"
                    alt="Rick Pereira Jiu-Jitsu"
                    width={160}
                    height={90}
                  />
                </div>
              )}
            </div>

            <div className={styles.mapBox}>
              <MapPin size={38} />
              <strong>MAPA</strong>
              <span>Localização será configurada</span>
            </div>

            <div className={styles.address}>
              <div>
                <MapPin size={18} />
                <p>
                  <strong>
                    {settings["home.location.address"] ||
                      "Endereço a cadastrar"}
                  </strong>

                  <span>
                    {settings["home.location.city"] ||
                      "Pindamonhangaba - SP"}
                  </span>
                </p>
              </div>

              <div>
                <Clock3 size={18} />

                <p>
                  <strong>Horários de treino</strong>

                  {schedule.map((item) => (
                    <span key={item.day}>
                      {item.day}: {item.time}
                    </span>
                  ))}
                </p>
              </div>

              <button type="button">
                {settings["home.location.mapButtonLabel"] ||
                  "Abrir no mapa"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.contactPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>
                <MessageCircle size={24} />
                {settings["home.contact.title"] ||
                  "Fale com a nossa equipe"}
              </h2>

              <p>
                {settings["home.contact.subtitle"] ||
                  "Tire suas dúvidas, agende uma aula ou saiba mais sobre o sistema."}
              </p>
            </div>
          </div>

          <div className={styles.contactContent}>
            <div className={styles.contactLinks}>
              <a href="#">
                <MessageCircle size={20} />

                <div>
                  <strong>WhatsApp</strong>
                  <span>
                    {settings["home.contact.whatsappHint"] ||
                      "Converse agora"}
                  </span>
                </div>
              </a>

              <a href="#">
                <Camera size={20} />

                <div>
                  <strong>Instagram</strong>
                  <span>
                    {settings["home.contact.instagramHint"] ||
                      "Acompanhe nossa rotina"}
                  </span>
                </div>
              </a>

              <a href="#">
                <Phone size={20} />

                <div>
                  <strong>Telefone</strong>
                  <span>
                    {settings["home.contact.phone"] ||
                      "Cadastrar telefone"}
                  </span>
                </div>
              </a>

              <a href="#">
                <Mail size={20} />

                <div>
                  <strong>E-mail</strong>
                  <span>
                    {settings["home.contact.email"] ||
                      "Cadastrar e-mail"}
                  </span>
                </div>
              </a>
            </div>

            <form className={styles.contactForm}>
              <input
                type="text"
                placeholder={
                  settings[
                  "home.contact.form.namePlaceholder"
                  ] || "Nome completo"
                }
              />

              <input
                type="email"
                placeholder={
                  settings[
                  "home.contact.form.emailPlaceholder"
                  ] || "Seu e-mail"
                }
              />

              <textarea
                placeholder={
                  settings[
                  "home.contact.form.messagePlaceholder"
                  ] || "Sua mensagem"
                }
              />

              <button type="button">
                {settings["home.contact.form.submitLabel"] ||
                  "Enviar mensagem"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image
            src="/images/logo/logo.png"
            alt="Rick Pereira Jiu-Jitsu"
            width={150}
            height={80}
          />

          <div className={styles.footerValues}>
            <span>DISCIPLINA</span>
            <span>RESPEITO</span>
            <span>EVOLUÇÃO</span>
            <span>FAMÍLIA</span>
          </div>

          <strong>
            {settings["footer.slogan"] ||
              "Jiu-Jitsu transforma pessoas."}
          </strong>
        </div>

        <div className={styles.footerLinks}>
          <h3>Links</h3>

          <div>
            {footerLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.footerSocial}>
          <h3>Siga-nos</h3>

          <div className={styles.socialIcons}>
            <a href="#" aria-label="Instagram">
              <Camera size={20} />
            </a>

            <a href="#" aria-label="Youtube">
              <Play size={20} />
            </a>

            <a href="#" aria-label="Facebook">
              <Globe size={20} />
            </a>
          </div>

          <strong>RICK PEREIRA JIU-JITSU</strong>

          <p>
            {settings["footer.description"] ||
              "Disciplina, evolução, gestão. Em um só sistema."}
          </p>
        </div>

        <div className={styles.copyright}>
          {settings["footer.copyright"] ||
            `© ${new Date().getFullYear()} Rick Pereira Jiu-Jitsu. Todos os direitos reservados.`}
        </div>
      </footer>
    </main>
  );
}