// src/components/site/home/Footer/Footer.tsx

import {
    Camera,
    Globe,
    Play,
} from "lucide-react";
import Image from "next/image";

import styles from "./styles.module.scss";

type LinkRodape = {
    label: string;
    href: string;
};

type Props = {
    configuracoes: Record<string, string>;

    identidade: {
        nomeEquipe: string;
        logoEquipe: string;
    };

    links: LinkRodape[];
};

export default function Footer({
    configuracoes,
    identidade,
    links,
}: Props) {
    const linksExibidos =
        links.length > 0
            ? links
            : [
                {
                    label: "Início",
                    href: "/",
                },
                {
                    label: "Equipe",
                    href: "#equipe",
                },
                {
                    label: "Sistema",
                    href: "#sistema",
                },
                {
                    label: "Eventos",
                    href: "#eventos",
                },
                {
                    label: "Cronômetro",
                    href: "#cronometro",
                },
                {
                    label: "Contato",
                    href: "#contato",
                },
            ];

    const valores =
        (
            configuracoes["footer.values"] ||
            "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA"
        )
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);

    const instagram =
        configuracoes[
        "footer.instagramUrl"
        ] || "";

    const youtube =
        configuracoes[
        "footer.youtubeUrl"
        ] || "";

    const facebook =
        configuracoes[
        "footer.facebookUrl"
        ] || "";

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <Image
                        src={identidade.logoEquipe}
                        alt={identidade.nomeEquipe}
                        width={120}
                        height={70}
                    />

                    <div className={styles.values}>
                        {valores.map((valor) => (
                            <span key={valor}>
                                {valor}
                            </span>
                        ))}
                    </div>

                    <strong>
                        {configuracoes[
                            "footer.slogan"
                        ] ||
                            "Jiu-Jitsu transforma pessoas."}
                    </strong>
                </div>

                <div className={styles.links}>
                    <h3>Links</h3>

                    <div>
                        {linksExibidos.map(
                            (link) => (
                                <a
                                    href={
                                        link.href
                                    }
                                    key={
                                        link.label
                                    }
                                >
                                    {
                                        link.label
                                    }
                                </a>
                            ),
                        )}
                    </div>
                </div>

                <div className={styles.social}>
                    <h3>Siga-nos</h3>

                    <div className={styles.icons}>
                        {instagram && (
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <Camera
                                    size={18}
                                />
                            </a>
                        )}

                        {youtube && (
                            <a
                                href={youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                            >
                                <Play
                                    size={18}
                                />
                            </a>
                        )}

                        {facebook && (
                            <a
                                href={facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <Globe
                                    size={18}
                                />
                            </a>
                        )}
                    </div>

                    <strong>
                        {identidade.nomeEquipe.toUpperCase()}
                    </strong>

                    <p>
                        {configuracoes[
                            "footer.description"
                        ] ||
                            configuracoes[
                            "site.description"
                            ] ||
                            "Disciplina, evolução e gestão em um só sistema."}
                    </p>
                </div>

                <div className={styles.copyright}>
                    {configuracoes[
                        "footer.copyright"
                    ] ||
                        `© ${new Date().getFullYear()} ${identidade.nomeEquipe}. Todos os direitos reservados.`}
                </div>
            </div>
        </footer>
    );
}