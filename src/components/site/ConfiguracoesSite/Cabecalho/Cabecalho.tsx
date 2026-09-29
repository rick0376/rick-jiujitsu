// src/components/site/ConfiguracoesSite/Cabecalho/Cabecalho.tsx

import { LayoutTemplate } from "lucide-react";

import styles from "../styles.module.scss";

type Props = {
    valores: Record<string, string>;
    podeEditar: boolean;
};

export default function Cabecalho({
    valores,
    podeEditar,
}: Props) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    <LayoutTemplate size={22} />
                </div>

                <div>
                    <h2>Cabeçalho e menu</h2>

                    <p>
                        Textos e destinos dos links exibidos
                        no menu superior do site.
                    </p>
                </div>
            </div>

            <div className={styles.menuGrid}>
                <LinkCampo
                    titulo="Início"
                    labelName="navHomeLabel"
                    hrefName="navHomeHref"
                    label={
                        valores["nav.home.label"] ||
                        "Início"
                    }
                    href={
                        valores["nav.home.href"] ||
                        "/"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Equipe"
                    labelName="navTeamLabel"
                    hrefName="navTeamHref"
                    label={
                        valores["nav.team.label"] ||
                        "Equipe"
                    }
                    href={
                        valores["nav.team.href"] ||
                        "#equipe"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Sistema"
                    labelName="navSystemLabel"
                    hrefName="navSystemHref"
                    label={
                        valores["nav.system.label"] ||
                        "Sistema"
                    }
                    href={
                        valores["nav.system.href"] ||
                        "#sistema"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Eventos"
                    labelName="navEventsLabel"
                    hrefName="navEventsHref"
                    label={
                        valores["nav.events.label"] ||
                        "Eventos"
                    }
                    href={
                        valores["nav.events.href"] ||
                        "#eventos"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Cronômetro"
                    labelName="navTimerLabel"
                    hrefName="navTimerHref"
                    label={
                        valores["nav.timer.label"] ||
                        "Cronômetro"
                    }
                    href={
                        valores["nav.timer.href"] ||
                        "#cronometro"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Contato"
                    labelName="navContactLabel"
                    hrefName="navContactHref"
                    label={
                        valores["nav.contact.label"] ||
                        "Contato"
                    }
                    href={
                        valores["nav.contact.href"] ||
                        "#contato"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Botão Entrar"
                    labelName="navLoginLabel"
                    hrefName="navLoginHref"
                    label={
                        valores["nav.login.label"] ||
                        "Entrar"
                    }
                    href={
                        valores["nav.login.href"] ||
                        "/login"
                    }
                    disabled={!podeEditar}
                />

                <LinkCampo
                    titulo="Botão de destaque"
                    labelName="navCtaLabel"
                    hrefName="navCtaHref"
                    label={
                        valores["nav.cta.label"] ||
                        "Quero conhecer"
                    }
                    href={
                        valores["nav.cta.href"] ||
                        "#contato"
                    }
                    disabled={!podeEditar}
                />
            </div>
        </section>
    );
}

function LinkCampo({
    titulo,
    labelName,
    hrefName,
    label,
    href,
    disabled,
}: {
    titulo: string;
    labelName: string;
    hrefName: string;
    label: string;
    href: string;
    disabled: boolean;
}) {
    return (
        <div className={styles.linkCard}>
            <strong>{titulo}</strong>

            <label>
                Texto

                <input
                    name={labelName}
                    disabled={disabled}
                    defaultValue={label}
                />
            </label>

            <label>
                Destino

                <input
                    name={hrefName}
                    disabled={disabled}
                    defaultValue={href}
                />
            </label>
        </div>
    );
}