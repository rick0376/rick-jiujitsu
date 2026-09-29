// src/components/site/ConfiguracoesSite/Localizacao/Localizacao.tsx

"use client";

import {
    ImageIcon,
    MapPin,
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
    localImagemUrl: string;
};

type Horario = {
    day: string;
    time: string;
};

function horariosParaTexto(
    valor: string | undefined,
) {
    if (!valor) {
        return "";
    }

    try {
        const horarios =
            JSON.parse(valor) as Horario[];

        return horarios
            .map(
                (item) =>
                    `${item.day}|${item.time}`,
            )
            .join("\n");
    } catch {
        return "";
    }
}

export default function Localizacao({
    valores,
    podeEditar,
    localImagemUrl,
}: Props) {
    const [preview, setPreview] =
        useState(localImagemUrl);

    useEffect(() => {
        setPreview(localImagemUrl);
    }, [localImagemUrl]);

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
            setPreview(
                localImagemUrl,
            );
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
                        <MapPin size={22} />
                    </div>

                    <div>
                        <h2>Localização</h2>

                        <p>
                            Endereço, coordenadas, mapa e horários
                            da academia.
                        </p>
                    </div>
                </div>

                <div className={styles.fields}>
                    <label>
                        Título

                        <input
                            name="locationTitle"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.title"
                                ] ||
                                "Como chegar ao treino"
                            }
                        />
                    </label>

                    <label>
                        Nome do local

                        <input
                            name="locationName"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.name"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label className={styles.full}>
                        Subtítulo

                        <input
                            name="locationSubtitle"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.subtitle"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label className={styles.full}>
                        Endereço

                        <input
                            name="locationAddress"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.address"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        Cidade / Estado

                        <input
                            name="locationCity"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.city"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        CEP

                        <input
                            name="locationZipCode"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.zipCode"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        Latitude

                        <input
                            name="locationLat"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.lat"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        Longitude

                        <input
                            name="locationLng"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.lng"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label>
                        Texto do botão do mapa

                        <input
                            name="locationMapLabel"
                            disabled={!podeEditar}
                            defaultValue={
                                valores[
                                "home.location.mapButtonLabel"
                                ] ||
                                "Abrir no mapa"
                            }
                        />
                    </label>

                    <label>
                        Link do Google Maps

                        <input
                            name="locationMapUrl"
                            disabled={!podeEditar}
                            placeholder="https://maps.google.com/..."
                            defaultValue={
                                valores[
                                "home.location.mapUrl"
                                ] ||
                                ""
                            }
                        />
                    </label>

                    <label className={styles.full}>
                        Horários de treino

                        <textarea
                            name="schedule"
                            disabled={!podeEditar}
                            defaultValue={horariosParaTexto(
                                valores[
                                "home.schedule"
                                ],
                            )}
                            placeholder={
                                "Segunda-feira|19:00\nTerça-feira|19:00\nQuarta-feira|20:00"
                            }
                        />

                        <small>
                            Uma linha para cada horário.
                            Utilize: Dia|Horário
                        </small>
                    </label>
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                        <ImageIcon size={22} />
                    </div>

                    <div>
                        <h2>Foto da academia</h2>

                        <p>
                            Imagem exibida na área de localização
                            da página pública.
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
                                    alt="Foto da academia"
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
                                Imagem da academia
                            </strong>

                            <span>
                                Caso nenhuma imagem seja cadastrada,
                                o site utiliza o logo da equipe.
                            </span>

                            {podeEditar && (
                                <label className={styles.upload}>
                                    <Upload size={16} />

                                    Selecionar imagem

                                    <input
                                        name="locationImage"
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
        </>
    );
}