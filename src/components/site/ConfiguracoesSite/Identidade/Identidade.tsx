// src/components/site/ConfiguracoesSite/Identidade/Identidade.tsx

"use client";

import {
    Building2,
    ImageIcon,
    Palette,
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

    logoUrl: string;
    icon192Url: string;
    icon512Url: string;
    faviconUrl: string;
};

export default function Identidade({
    valores,
    podeEditar,
    logoUrl,
    icon192Url,
    icon512Url,
    faviconUrl,
}: Props) {
    return (
        <>
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <Building2 size={22} />
                    </div>

                    <div>
                        <h2>Identidade da equipe</h2>

                        <p>
                            Nome, sigla, slogan e descrição
                            principal da equipe.
                        </p>
                    </div>
                </div>

                <div className={styles.fields}>
                    <label>
                        Nome da equipe

                        <input
                            name="name"
                            disabled={!podeEditar}
                            defaultValue={
                                valores["site.name"] ||
                                "Rick Pereira Jiu-Jitsu"
                            }
                        />
                    </label>

                    <label>
                        Nome curto

                        <input
                            name="shortName"
                            disabled={!podeEditar}
                            defaultValue={
                                valores["site.shortName"] ||
                                "Rick Pereira"
                            }
                        />
                    </label>

                    <label>
                        Sigla / iniciais

                        <input
                            name="initials"
                            disabled={!podeEditar}
                            defaultValue={
                                valores["site.initials"] ||
                                "RK"
                            }
                        />
                    </label>

                    <label>
                        Slogan

                        <input
                            name="slogan"
                            disabled={!podeEditar}
                            defaultValue={
                                valores["site.slogan"] ||
                                "Mais que um esporte, um estilo de vida."
                            }
                        />
                    </label>

                    <label className={styles.full}>
                        Descrição

                        <textarea
                            name="description"
                            disabled={!podeEditar}
                            defaultValue={
                                valores["site.description"] ||
                                ""
                            }
                        />
                    </label>
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <ImageIcon size={22} />
                    </div>

                    <div>
                        <h2>Logo e ícones</h2>

                        <p>
                            Imagens utilizadas no site, PWA e
                            navegador.
                        </p>
                    </div>
                </div>

                <div className={styles.imageGrid}>
                    <ImagemCampo
                        titulo="Logo principal"
                        descricao="Utilizado no cabeçalho, localização, rodapé e identidade visual do site."
                        url={logoUrl}
                        nome="logo"
                        podeEditar={podeEditar}
                    />

                    <ImagemCampo
                        titulo="Ícone PWA 192x192"
                        descricao="Utilizado em atalhos, instalação do aplicativo e dispositivos que solicitam o ícone menor."
                        url={icon192Url}
                        nome="icon192"
                        podeEditar={podeEditar}
                    />

                    <ImagemCampo
                        titulo="Ícone PWA 512x512"
                        descricao="Utilizado pelo PWA em instalações e dispositivos que solicitam o ícone de alta resolução."
                        url={icon512Url}
                        nome="icon512"
                        podeEditar={podeEditar}
                    />

                    <ImagemCampo
                        titulo="Favicon"
                        descricao="Ícone exibido na aba do navegador e nos favoritos."
                        url={faviconUrl}
                        nome="favicon"
                        podeEditar={podeEditar}
                    />
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <Palette size={22} />
                    </div>

                    <div>
                        <h2>Cores da equipe</h2>

                        <p>
                            Identidade visual utilizada no site
                            público.
                        </p>
                    </div>
                </div>

                <div className={styles.colors}>
                    <CorCampo
                        label="Principal"
                        name="colorPrimary"
                        valor={
                            valores["site.color.primary"] ||
                            "#e6aa22"
                        }
                        disabled={!podeEditar}
                    />

                    <CorCampo
                        label="Secundária"
                        name="colorSecondary"
                        valor={
                            valores["site.color.secondary"] ||
                            "#f4c34a"
                        }
                        disabled={!podeEditar}
                    />

                    <CorCampo
                        label="Destaque"
                        name="colorAccent"
                        valor={
                            valores["site.color.accent"] ||
                            "#d99d14"
                        }
                        disabled={!podeEditar}
                    />

                    <CorCampo
                        label="Escura"
                        name="colorDark"
                        valor={
                            valores["site.color.dark"] ||
                            "#111216"
                        }
                        disabled={!podeEditar}
                    />

                    <CorCampo
                        label="Clara"
                        name="colorLight"
                        valor={
                            valores["site.color.light"] ||
                            "#f5f5f3"
                        }
                        disabled={!podeEditar}
                    />
                </div>
            </section>
        </>
    );
}

function ImagemCampo({
    titulo,
    descricao,
    url,
    nome,
    podeEditar,
}: {
    titulo: string;
    descricao: string;
    url: string;
    nome: string;
    podeEditar: boolean;
}) {
    const [preview, setPreview] =
        useState(url);

    useEffect(() => {
        setPreview(url);
    }, [url]);

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
            setPreview(url);
            return;
        }

        const novaPreview =
            URL.createObjectURL(
                arquivo,
            );

        setPreview(novaPreview);
    }

    return (
        <div className={styles.imageCard}>
            <div className={styles.imagePreview}>
                {preview ? (
                    <Image
                        src={preview}
                        alt={titulo}
                        fill
                        sizes="420px"
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
                <strong>{titulo}</strong>

                <span>{descricao}</span>

                {podeEditar && (
                    <label className={styles.upload}>
                        <Upload size={16} />

                        Selecionar imagem

                        <input
                            name={nome}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                            onChange={
                                selecionarImagem
                            }
                        />
                    </label>
                )}
            </div>
        </div>
    );
}

function CorCampo({
    label,
    name,
    valor,
    disabled,
}: {
    label: string;
    name: string;
    valor: string;
    disabled: boolean;
}) {
    return (
        <label className={styles.colorLabel}>
            {label}

            <div className={styles.colorField}>
                <input
                    type="color"
                    name={name}
                    defaultValue={valor}
                    disabled={disabled}
                />

                <span>{valor}</span>
            </div>
        </label>
    );
}