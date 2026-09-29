// src/components/site/ConfiguracoesSite/Hero/Hero.tsx

"use client";

import {
    ImageIcon,
    LayoutTemplate,
    Upload,
} from "lucide-react";
import Image from "next/image";
import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";

import styles from "../styles.module.scss";

type Props = {
    valores: Record<string, string>;
    podeEditar: boolean;
    heroImagemUrl: string;
};

export default function Hero({
    valores,
    podeEditar,
    heroImagemUrl,
}: Props) {
    const [preview, setPreview] =
        useState(heroImagemUrl);

    useEffect(() => {
        setPreview(heroImagemUrl);
    }, [heroImagemUrl]);

    useEffect(() => {
        return () => {
            if (
                preview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    preview,
                );
            }
        };
    }, [preview]);

    function selecionarImagem(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const arquivo =
            event.target.files?.[0];

        if (!arquivo) {
            setPreview(heroImagemUrl);
            return;
        }

        setPreview(
            URL.createObjectURL(
                arquivo,
            ),
        );
    }

    return (
        <>
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <ImageIcon size={22} />
                    </div>

                    <div>
                        <h2>Imagem principal</h2>

                        <p>
                            Foto utilizada como fundo da primeira
                            seção da página pública.
                        </p>
                    </div>
                </div>

                <div className={styles.heroImageArea}>
                    <div
                        className={`${styles.imageCard} ${styles.imageCardLarge}`}
                    >
                        <div className={styles.imagePreview}>
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Imagem principal do site"
                                    fill
                                    sizes="900px"
                                    unoptimized={preview.startsWith(
                                        "blob:",
                                    )}
                                />
                            ) : (
                                <div className={styles.imageEmpty}>
                                    <ImageIcon size={38} />

                                    <span>
                                        Nenhuma imagem cadastrada
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className={styles.imageInfo}>
                            <strong>
                                Imagem do Hero
                            </strong>

                            <span>
                                Utilize uma imagem horizontal e de
                                boa resolução.
                            </span>

                            {podeEditar && (
                                <label className={styles.upload}>
                                    <Upload size={16} />

                                    Selecionar imagem

                                    <input
                                        name="heroImage"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={
                                            selecionarImagem
                                        }
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <LayoutTemplate size={22} />
                    </div>

                    <div>
                        <h2>Conteúdo do Hero</h2>

                        <p>
                            O nome principal vem automaticamente da
                            aba Identidade.
                        </p>
                    </div>
                </div>

                <div className={styles.fields}>
                    <label className={styles.full}>
                        Subtítulo

                        <input
                            name="heroSubtitle"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.subtitle"
                                ] ||
                                "MAIS QUE UM ESPORTE, UM ESTILO DE VIDA."
                            }
                        />
                    </label>

                    <label className={styles.full}>
                        Descrição

                        <textarea
                            name="heroDescription"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.description"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        Frases do lado esquerdo

                        <textarea
                            name="heroSideLeft"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.sideTextLeft"
                                ] ||
                                "DISCIPLINA\nRESPEITO\nEVOLUÇÃO\nFAMÍLIA"
                            }
                        />

                        <small>
                            Uma frase por linha.
                        </small>
                    </label>

                    <label>
                        Frases do lado direito

                        <textarea
                            name="heroSideRight"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.sideTextRight"
                                ] ||
                                "FOCO\nDISCIPLINA\nRESPEITO\nEVOLUÇÃO\nSEMPRE."
                            }
                        />

                        <small>
                            Uma frase por linha.
                        </small>
                    </label>

                    <label>
                        Texto do botão principal

                        <input
                            name="heroPrimaryLabel"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.primaryButtonLabel"
                                ] ||
                                "Entrar no sistema"
                            }
                        />
                    </label>

                    <label>
                        Destino do botão principal

                        <input
                            name="heroPrimaryHref"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.primaryButtonHref"
                                ] ||
                                "/login"
                            }
                        />
                    </label>

                    <label>
                        Texto do botão secundário

                        <input
                            name="heroSecondaryLabel"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.secondaryButtonLabel"
                                ] ||
                                "Agendar aula experimental"
                            }
                        />
                    </label>

                    <label>
                        Destino do botão secundário

                        <input
                            name="heroSecondaryHref"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.hero.secondaryButtonHref"
                                ] ||
                                "#contato"
                            }
                        />
                    </label>
                </div>
            </section>
        </>
    );
}