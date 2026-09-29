// src/components/site/home/Hero/Hero.tsx

import {
    ArrowRight,
    CalendarDays,
    UserRound,
} from "lucide-react";
import Link from "next/link";

import styles from "./styles.module.scss";

type Props = {
    configuracoes: Record<string, string>;

    identidade: {
        nomeEquipe: string;
        sloganEquipe: string;
    };
};

export default function Hero({
    configuracoes,
    identidade,
}: Props) {
    const imagem =
        configuracoes["home.hero.imageUrl"];

    const linkBotaoPrincipal =
        configuracoes[
        "home.hero.primaryButtonHref"
        ] || "/login";

    const linkBotaoSecundario =
        configuracoes[
        "home.hero.secondaryButtonHref"
        ] || "#contato";

    return (
        <section
            className={styles.hero}
            style={
                imagem
                    ? {
                        backgroundImage: `
                              linear-gradient(
                                  90deg,
                                  rgba(3, 4, 5, 0.92) 0%,
                                  rgba(4, 5, 6, 0.70) 43%,
                                  rgba(4, 5, 6, 0.18) 100%
                              ),
                              url("${imagem}")
                          `,
                    }
                    : undefined
            }
        >
            <div className={styles.shade} />

            <div className={styles.content}>
                <aside className={styles.sideLeft}>
                    {(configuracoes[
                        "home.hero.sideTextLeft"
                    ] ||
                        "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA")
                        .split("\n")
                        .filter(Boolean)
                        .map((item) => (
                            <span key={item}>
                                {item}
                            </span>
                        ))}
                </aside>

                <div className={styles.text}>
                    <h1>
                        EQUIPE
                        <br />

                        <strong>
                            {identidade.nomeEquipe.toUpperCase()}
                        </strong>
                    </h1>

                    <h2>
                        {configuracoes[
                            "home.hero.subtitle"
                        ] ||
                            identidade.sloganEquipe.toUpperCase()}
                    </h2>

                    <p>
                        {configuracoes[
                            "home.hero.description"
                        ] ||
                            "Treinamento de alto nível, disciplina, evolução e tecnologia para fortalecer ainda mais a equipe."}
                    </p>

                    <div className={styles.buttons}>
                        <Link
                            href={linkBotaoPrincipal}
                            className={styles.primary}
                        >
                            <UserRound size={18} />

                            {configuracoes[
                                "home.hero.primaryButtonLabel"
                            ] ||
                                "Entrar no sistema"}

                            <ArrowRight size={18} />
                        </Link>

                        <a
                            href={linkBotaoSecundario}
                            className={styles.secondary}
                        >
                            <CalendarDays size={18} />

                            {configuracoes[
                                "home.hero.secondaryButtonLabel"
                            ] ||
                                "Agendar aula experimental"}
                        </a>
                    </div>
                </div>

                <aside className={styles.sideRight}>
                    {(configuracoes[
                        "home.hero.sideTextRight"
                    ] ||
                        "FOCO\nDISCIPLINA\nRESPEITO\nEVOLUÇÃO\nSEMPRE.")
                        .split("\n")
                        .filter(Boolean)
                        .map((item) => (
                            <span key={item}>
                                {item}
                            </span>
                        ))}
                </aside>
            </div>
        </section>
    );
}