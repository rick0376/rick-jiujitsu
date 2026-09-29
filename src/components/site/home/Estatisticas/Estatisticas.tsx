// src/components/site/home/Estatisticas/Estatisticas.tsx

import {
    Award,
    BarChart3,
    CalendarDays,
    ShieldCheck,
    Users,
} from "lucide-react";

import styles from "./styles.module.scss";

type Props = {
    configuracoes: Record<string, string>;
};

export default function Estatisticas({
    configuracoes,
}: Props) {
    const estatisticas = [
        {
            icon: Users,
            value:
                configuracoes["home.stats.students.value"] ||
                "186",
            label:
                configuracoes["home.stats.students.label"] ||
                "Alunos Ativos",
            change:
                configuracoes["home.stats.students.change"] ||
                "+12%",
        },
        {
            icon: BarChart3,
            value:
                configuracoes["home.stats.attendance.value"] ||
                "78%",
            label:
                configuracoes["home.stats.attendance.label"] ||
                "Presença Média",
            change:
                configuracoes["home.stats.attendance.change"] ||
                "+8%",
        },
        {
            icon: Award,
            value:
                configuracoes["home.stats.graduations.value"] ||
                "24",
            label:
                configuracoes["home.stats.graduations.label"] ||
                "Graduações no Ano",
            change:
                configuracoes["home.stats.graduations.change"] ||
                "+33%",
        },
        {
            icon: CalendarDays,
            value:
                configuracoes["home.stats.events.value"] ||
                "12",
            label:
                configuracoes["home.stats.events.label"] ||
                "Eventos Realizados",
            change:
                configuracoes["home.stats.events.change"] ||
                "+100%",
        },
        {
            icon: ShieldCheck,
            value:
                configuracoes["home.stats.payments.value"] ||
                "R$ 12.480",
            label:
                configuracoes["home.stats.payments.label"] ||
                "Mensalidades em dia",
            change:
                configuracoes["home.stats.payments.change"] ||
                "+18%",
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {estatisticas.map((estatistica) => {
                    const Icon = estatistica.icon;

                    return (
                        <article
                            className={styles.card}
                            key={estatistica.label}
                        >
                            <div className={styles.icon}>
                                <Icon size={28} />
                            </div>

                            <div className={styles.info}>
                                <strong>{estatistica.value}</strong>
                                <span>{estatistica.label}</span>
                                <small>
                                    ↑ {estatistica.change}
                                </small>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}