// src/components/site/home/Cronometros/Cronometros.tsx

import {
    Clock3,
    Timer,
} from "lucide-react";
import Image from "next/image";

import styles from "./styles.module.scss";

type Cronometro = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    bullets: unknown;
    imageUrl: string | null;
};

type Props = {
    configuracoes: Record<string, string>;
    cronometros: Cronometro[];
};

export default function Cronometros({
    configuracoes,
    cronometros,
}: Props) {
    return (
        <section
            id="cronometro"
            className={styles.section}
        >
            <div className={styles.title}>
                <div className={styles.titleIcon}>
                    <Timer size={36} />
                </div>

                <div>
                    <h2>
                        {configuracoes["home.timer.title"] ||
                            "Cronômetro Inteligente de Treino"}
                    </h2>

                    <p>
                        {configuracoes["home.timer.subtitle"] ||
                            "Ferramenta prática e completa para um treino mais organizado e dinâmico."}
                    </p>
                </div>

                <span>
                    {configuracoes["home.timer.sideText"] ||
                        "DO INÍCIO AO OSS, SEM COMPLICAÇÃO. TECNOLOGIA A FAVOR DA EVOLUÇÃO."}
                </span>
            </div>

            <div className={styles.grid}>
                {cronometros.map((cronometro) => {
                    const itens = Array.isArray(cronometro.bullets)
                        ? cronometro.bullets
                        : [];

                    return (
                        <article
                            className={styles.card}
                            key={cronometro.id}
                        >
                            <div className={styles.description}>
                                <h3>
                                    <Timer size={21} />
                                    {cronometro.title}
                                </h3>

                                <p>
                                    {cronometro.description}
                                </p>

                                <ul>
                                    {itens.map((item, index) => (
                                        <li
                                            key={`${cronometro.id}-${index}`}
                                        >
                                            <span>✓</span>
                                            {String(item)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.preview}>
                                {cronometro.imageUrl ? (
                                    <Image
                                        src={cronometro.imageUrl}
                                        alt={cronometro.title}
                                        fill
                                        sizes="500px"
                                    />
                                ) : (
                                    <>
                                        <Clock3 size={40} />

                                        <strong>
                                            {cronometro.slug ===
                                                "cronometro-simples"
                                                ? "05:00"
                                                : "00:58"}
                                        </strong>

                                        <small>
                                            {cronometro.slug ===
                                                "cronometro-simples"
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
    );
}