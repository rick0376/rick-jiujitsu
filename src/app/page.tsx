// src/app/page.tsx

import type { CSSProperties } from "react";

import Cronometros from "@/components/site/home/Cronometros/Cronometros";
import DestaquesEventos from "@/components/site/home/DestaquesEventos/DestaquesEventos";
import Estatisticas from "@/components/site/home/Estatisticas/Estatisticas";
import Footer from "@/components/site/home/Footer/Footer";
import Header from "@/components/site/home/Header/Header";
import Hero from "@/components/site/home/Hero/Hero";
import LocalizacaoContato from "@/components/site/home/LocalizacaoContato/LocalizacaoContato";
import Recursos from "@/components/site/home/Recursos/Recursos";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type FooterLink = {
  label: string;
  href: string;
};

type Horario = {
  day: string;
  time: string;
};

function parseJson<T>(
  value: string | undefined,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [
    configuracoesBanco,
    recursos,
    cronometros,
    destaques,
    eventos,
  ] = await Promise.all([
    prisma.siteSetting.findMany({
      orderBy: {
        key: "asc",
      },
    }),

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

  const configuracoes: Record<string, string> =
    Object.fromEntries(
      configuracoesBanco.map((item) => [
        item.key,
        item.value,
      ]),
    );

  const linksRodape = parseJson<FooterLink[]>(
    configuracoes["footer.links"],
    [],
  );

  const horarios = parseJson<Horario[]>(
    configuracoes["home.schedule"],
    [],
  );

  const nomeEquipe =
    configuracoes["site.name"] ||
    "Rick Pereira Jiu-Jitsu";

  const nomeCurto =
    configuracoes["site.shortName"] ||
    "Rick Pereira";

  const siglaEquipe =
    configuracoes["site.initials"] ||
    "RK";

  const sloganEquipe =
    configuracoes["site.slogan"] ||
    "Mais que um esporte, um estilo de vida.";

  const logoEquipe =
    configuracoes["site.logoUrl"] ||
    "/images/logo/logo.png";

  const iconeEquipe =
    configuracoes["site.iconUrl"] ||
    "/icons/icon-192.png";

  const cores = {
    primaria:
      configuracoes["site.color.primary"] ||
      "#e6aa22",

    secundaria:
      configuracoes["site.color.secondary"] ||
      "#f4c34a",

    destaque:
      configuracoes["site.color.accent"] ||
      "#d99d14",

    escura:
      configuracoes["site.color.dark"] ||
      "#111216",

    clara:
      configuracoes["site.color.light"] ||
      "#f5f5f3",
  };

  const identidade = {
    nomeEquipe,
    nomeCurto,
    siglaEquipe,
    sloganEquipe,
    logoEquipe,
    iconeEquipe,
  };

  const style = {
    "--site-primary": cores.primaria,
    "--site-secondary": cores.secundaria,
    "--site-accent": cores.destaque,
    "--site-dark": cores.escura,
    "--site-light": cores.clara,
    background: cores.clara,
    minHeight: "100vh",
  } as CSSProperties;

  return (
    <main style={style}>
      <Header
        configuracoes={configuracoes}
        identidade={identidade}
      />

      <Hero
        configuracoes={configuracoes}
        identidade={identidade}
      />

      <Recursos
        recursos={recursos}
      />

      <Estatisticas
        configuracoes={configuracoes}
      />

      <DestaquesEventos
        configuracoes={configuracoes}
        destaques={destaques}
        eventos={eventos}
      />

      <Cronometros
        configuracoes={configuracoes}
        cronometros={cronometros}
      />

      <LocalizacaoContato
        configuracoes={configuracoes}
        identidade={identidade}
        horarios={horarios}
      />

      <Footer
        configuracoes={configuracoes}
        identidade={identidade}
        links={linksRodape}
      />
    </main>
  );
}