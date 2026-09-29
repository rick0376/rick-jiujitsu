// src/components/site/home/Header/Header.tsx

import {
    ArrowRight,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./styles.module.scss";

type Props = {
    configuracoes: Record<string, string>;

    identidade: {
        nomeEquipe: string;
        logoEquipe: string;
    };
};

export default function Header({
    configuracoes,
    identidade,
}: Props) {
    const menu = [
        {
            label:
                configuracoes["nav.home.label"] ||
                "Início",
            href:
                configuracoes["nav.home.href"] ||
                "/",
        },
        {
            label:
                configuracoes["nav.team.label"] ||
                "Equipe",
            href:
                configuracoes["nav.team.href"] ||
                "#equipe",
        },
        {
            label:
                configuracoes["nav.system.label"] ||
                "Sistema",
            href:
                configuracoes["nav.system.href"] ||
                "#sistema",
        },
        {
            label:
                configuracoes["nav.events.label"] ||
                "Eventos",
            href:
                configuracoes["nav.events.href"] ||
                "#eventos",
        },
        {
            label:
                configuracoes["nav.timer.label"] ||
                "Cronômetro",
            href:
                configuracoes["nav.timer.href"] ||
                "#cronometro",
        },
        {
            label:
                configuracoes["nav.contact.label"] ||
                "Contato",
            href:
                configuracoes["nav.contact.href"] ||
                "#contato",
        },
    ];

    const loginLabel =
        configuracoes["nav.login.label"] ||
        "Entrar";

    const loginHref =
        configuracoes["nav.login.href"] ||
        "/login";

    const ctaLabel =
        configuracoes["nav.cta.label"] ||
        "Quero conhecer";

    const ctaHref =
        configuracoes["nav.cta.href"] ||
        "#contato";

    return (
        <header className={styles.header}>
            <Link
                href="/"
                className={styles.brand}
                aria-label={identidade.nomeEquipe}
            >
                <Image
                    src={identidade.logoEquipe}
                    alt={identidade.nomeEquipe}
                    width={150}
                    height={70}
                    priority
                />
            </Link>

            <nav className={styles.nav}>
                {menu.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className={styles.actions}>
                <Link
                    className={styles.login}
                    href={loginHref}
                >
                    <UserRound size={16} />
                    {loginLabel}
                </Link>

                <a
                    className={styles.cta}
                    href={ctaHref}
                >
                    {ctaLabel}
                    <ArrowRight size={16} />
                </a>
            </div>
        </header>
    );
}