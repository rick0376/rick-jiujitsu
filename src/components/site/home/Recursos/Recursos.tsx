// src/components/site/home/Recursos/Recursos.tsx

import { ArrowUpRight, BarChart3, Sparkles, Timer, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./styles.module.scss";

type Recurso = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    linkLabel: string | null;
    linkHref: string | null;
    imageUrl: string | null;
};

type Props = {
    recursos: Recurso[];
};

function IconeRecurso({ slug }: { slug: string }) {
    if (slug === "sistema-gestao") return <Users size={26} />;
    if (slug === "dashboard-inteligente") return <BarChart3 size={26} />;
    if (slug === "cronometro-treino") return <Timer size={26} />;
    return <Sparkles size={26} />;
}

export default function Recursos({ recursos }: Props) {
    if (!recursos.length) return null;

    return (
        <section id="sistema" className={styles.section}>
            <div className={styles.grid}>
                {recursos.map((recurso, index) => (
                    <article className={styles.card} key={recurso.id}>
                        <div className={styles.image}>
                            {recurso.imageUrl ? (
                                <Image
                                    src={recurso.imageUrl}
                                    alt={recurso.title}
                                    fill
                                    sizes="(max-width: 900px) 100vw, 400px"
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    <IconeRecurso slug={recurso.slug} />
                                </div>
                            )}

                            <div className={styles.imageOverlay} />

                            <div className={styles.number}>
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className={styles.icon}>
                                <IconeRecurso slug={recurso.slug} />
                            </div>
                        </div>

                        <div className={styles.content}>
                            <span className={styles.eyebrow}>Rick Pereira Jiu-Jitsu</span>
                            <h3>{recurso.title}</h3>
                            <p>{recurso.description || "Informações sobre este recurso."}</p>

                            <Link href={recurso.linkHref || "/login"} className={styles.link}>
                                <span>{recurso.linkLabel || "Ver mais"}</span>
                                <span className={styles.linkIcon}>
                                    <ArrowUpRight size={15} />
                                </span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}