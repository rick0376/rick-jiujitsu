// src/components/site/home/Recursos/Recursos.tsx

import {
    ArrowRight,
    BarChart3,
    Timer,
    Users,
} from "lucide-react";
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

export default function Recursos({ recursos }: Props) {
    return (
        <section id="sistema" className={styles.section}>
            <div className={styles.grid}>
                {recursos.map((recurso) => (
                    <article
                        className={styles.card}
                        key={recurso.id}
                    >
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
                                    {recurso.slug === "sistema-gestao" && (
                                        <Users size={48} />
                                    )}

                                    {recurso.slug === "dashboard-inteligente" && (
                                        <BarChart3 size={48} />
                                    )}

                                    {recurso.slug === "cronometro-treino" && (
                                        <Timer size={48} />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.content}>
                            <h3>{recurso.title}</h3>

                            <p>
                                {recurso.description ||
                                    "Informações sobre este recurso."}
                            </p>

                            <Link href={recurso.linkHref || "/login"}>
                                {recurso.linkLabel || "Ver mais"}
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}