// src/components/site/home/DestaquesEventos/DestaquesEventos.tsx

import {
    ArrowRight,
    CalendarDays,
    Trophy,
    UserRound,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./styles.module.scss";

type Destaque = {
    id: string;
    studentName: string;
    title: string;
    description: string | null;
    photoUrl: string | null;
};

type Evento = {
    id: string;
    title: string;
    description: string | null;
    startsAt: Date;
    coverUrl: string | null;
};

type Props = {
    configuracoes: Record<string, string>;
    destaques: Destaque[];
    eventos: Evento[];
};

export default function DestaquesEventos({
    configuracoes,
    destaques,
    eventos,
}: Props) {
    return (
        <section id="equipe" className={styles.section}>
            <div className={styles.grid}>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <div>
                            <h2>
                                <Users size={22} />
                                {configuracoes["home.highlights.title"] ||
                                    "Alunos Destaques"}
                            </h2>

                            <p>
                                {configuracoes["home.highlights.subtitle"] ||
                                    "Exemplos de disciplina, evolução e comprometimento."}
                            </p>
                        </div>

                        <Link href="/login">
                            {configuracoes["home.highlights.linkLabel"] ||
                                "Ver todos os alunos"}
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className={styles.cards}>
                        {destaques.map((destaque) => (
                            <article
                                className={styles.card}
                                key={destaque.id}
                            >
                                <div className={styles.photo}>
                                    {destaque.photoUrl ? (
                                        <Image
                                            src={destaque.photoUrl}
                                            alt={destaque.studentName}
                                            fill
                                            sizes="150px"
                                        />
                                    ) : (
                                        <UserRound size={44} />
                                    )}
                                </div>

                                <div className={styles.cardInfo}>
                                    <h3>{destaque.studentName}</h3>

                                    <span>
                                        Faixa a cadastrar
                                    </span>

                                    <strong>
                                        <Trophy size={14} />
                                        {destaque.title}
                                    </strong>

                                    <p>
                                        {destaque.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div
                    id="eventos"
                    className={styles.panel}
                >
                    <div className={styles.header}>
                        <div>
                            <h2>
                                <CalendarDays size={22} />
                                {configuracoes["home.events.title"] ||
                                    "Eventos Realizados"}
                            </h2>

                            <p>
                                {configuracoes["home.events.subtitle"] ||
                                    "Momentos que fortalecem a nossa equipe."}
                            </p>
                        </div>

                        <Link href="/login">
                            {configuracoes["home.events.linkLabel"] ||
                                "Ver todos os eventos"}
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className={styles.cards}>
                        {eventos.map((evento) => (
                            <article
                                className={styles.card}
                                key={evento.id}
                            >
                                <div className={styles.photo}>
                                    {evento.coverUrl ? (
                                        <Image
                                            src={evento.coverUrl}
                                            alt={evento.title}
                                            fill
                                            sizes="150px"
                                        />
                                    ) : (
                                        <CalendarDays size={42} />
                                    )}
                                </div>

                                <div className={styles.cardInfo}>
                                    <time>
                                        {evento.startsAt.toLocaleDateString(
                                            "pt-BR",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            },
                                        )}
                                    </time>

                                    <h3>{evento.title}</h3>

                                    <p>
                                        {evento.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}