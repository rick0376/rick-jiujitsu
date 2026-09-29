// src/components/site/ConfiguracoesSite/Rodape/Rodape.tsx

import { Footprints } from "lucide-react";

import styles from "../styles.module.scss";

type Props = {
    valores: Record<string, string>;
    podeEditar: boolean;
};

type LinkRodape = {
    label: string;
    href: string;
};

function linksParaTexto(
    valor: string | undefined,
) {
    if (!valor) {
        return "";
    }

    try {
        const links =
            JSON.parse(valor) as LinkRodape[];

        return links
            .map(
                (item) =>
                    `${item.label}|${item.href}`,
            )
            .join("\n");
    } catch {
        return "";
    }
}

export default function Rodape({
    valores,
    podeEditar,
}: Props) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    <Footprints size={22} />
                </div>

                <div>
                    <h2>Rodapé</h2>

                    <p>
                        Frases, slogan, links, redes sociais
                        e informações finais do site.
                    </p>
                </div>
            </div>

            <div className={styles.fields}>
                <label className={styles.full}>
                    Valores da equipe

                    <textarea
                        name="footerValues"
                        disabled={!podeEditar}
                        defaultValue={
                            valores["footer.values"] ||
                            "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA"
                        }
                    />

                    <small>
                        Uma palavra ou frase por linha.
                    </small>
                </label>

                <label>
                    Slogan

                    <input
                        name="footerSlogan"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "footer.slogan"
                            ] ||
                            "Jiu-Jitsu transforma pessoas."
                        }
                    />
                </label>

                <label>
                    Copyright

                    <input
                        name="footerCopyright"
                        disabled={!podeEditar}
                        placeholder="Deixe vazio para gerar automaticamente."
                        defaultValue={
                            valores[
                            "footer.copyright"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label className={styles.full}>
                    Descrição

                    <textarea
                        name="footerDescription"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "footer.description"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label className={styles.full}>
                    Links do rodapé

                    <textarea
                        name="footerLinks"
                        disabled={!podeEditar}
                        defaultValue={linksParaTexto(
                            valores[
                            "footer.links"
                            ],
                        )}
                        placeholder={
                            "Início|/\nEquipe|#equipe\nSistema|#sistema\nEventos|#eventos\nContato|#contato"
                        }
                    />

                    <small>
                        Uma linha por link:
                        Nome|Destino
                    </small>
                </label>

                <label>
                    Instagram

                    <input
                        name="footerInstagram"
                        disabled={!podeEditar}
                        placeholder="https://instagram.com/..."
                        defaultValue={
                            valores[
                            "footer.instagramUrl"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    YouTube

                    <input
                        name="footerYoutube"
                        disabled={!podeEditar}
                        placeholder="https://youtube.com/..."
                        defaultValue={
                            valores[
                            "footer.youtubeUrl"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    Facebook

                    <input
                        name="footerFacebook"
                        disabled={!podeEditar}
                        placeholder="https://facebook.com/..."
                        defaultValue={
                            valores[
                            "footer.facebookUrl"
                            ] ||
                            ""
                        }
                    />
                </label>
            </div>
        </section>
    );
}