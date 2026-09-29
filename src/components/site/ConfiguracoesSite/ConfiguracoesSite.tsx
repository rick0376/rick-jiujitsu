// src/components/site/ConfiguracoesSite/ConfiguracoesSite.tsx

"use client";

import {
    Building2,
    CheckCircle2,
    CircleAlert,
    Contact,
    Footprints,
    ImageIcon,
    LayoutTemplate,
    MapPin,
    Save,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

import Cabecalho from "./Cabecalho/Cabecalho";
import Contato from "./Contato/Contato";
import Hero from "./Hero/Hero";
import Identidade from "./Identidade/Identidade";
import Localizacao from "./Localizacao/Localizacao";
import Rodape from "./Rodape/Rodape";

import styles from "./styles.module.scss";

type Configuracoes = Record<string, string>;

type Props = {
    configuracoes: Configuracoes;
    podeEditar: boolean;
};

type Aba =
    | "identidade"
    | "cabecalho"
    | "hero"
    | "localizacao"
    | "contato"
    | "rodape";

type UploadResponse = {
    secure_url?: string;
    public_id?: string;
    error?: string;
};

type Aviso = {
    tipo: "sucesso" | "erro";
    titulo: string;
    mensagem: string;
};

function textoParaHorarios(valor: string) {
    return valor
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean)
        .map((linha) => {
            const [day, ...restante] =
                linha.split("|");

            return {
                day: day?.trim() || "",
                time: restante
                    .join("|")
                    .trim(),
            };
        })
        .filter(
            (item) =>
                item.day && item.time,
        );
}

function textoParaLinks(valor: string) {
    return valor
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean)
        .map((linha) => {
            const [label, ...restante] =
                linha.split("|");

            return {
                label:
                    label?.trim() || "",
                href: restante
                    .join("|")
                    .trim(),
            };
        })
        .filter(
            (item) =>
                item.label && item.href,
        );
}

export default function ConfiguracoesSite({
    configuracoes,
    podeEditar,
}: Props) {
    const [abaAtiva, setAbaAtiva] =
        useState<Aba>("identidade");

    const [salvando, setSalvando] =
        useState(false);

    const [aviso, setAviso] =
        useState<Aviso | null>(null);

    const [valores, setValores] =
        useState<Configuracoes>({
            ...configuracoes,
        });

    const [logoUrl, setLogoUrl] =
        useState(
            configuracoes["site.logoUrl"] ||
            "",
        );

    const [
        logoPublicId,
        setLogoPublicId,
    ] = useState(
        configuracoes[
        "site.logoPublicId"
        ] || "",
    );

    const [icon192Url, setIcon192Url] =
        useState(
            configuracoes[
            "site.icon192Url"
            ] ||
            configuracoes["site.iconUrl"] ||
            "",
        );

    const [
        icon192PublicId,
        setIcon192PublicId,
    ] = useState(
        configuracoes[
        "site.icon192PublicId"
        ] ||
        configuracoes[
        "site.iconPublicId"
        ] ||
        "",
    );

    const [icon512Url, setIcon512Url] =
        useState(
            configuracoes[
            "site.icon512Url"
            ] || "",
        );

    const [
        icon512PublicId,
        setIcon512PublicId,
    ] = useState(
        configuracoes[
        "site.icon512PublicId"
        ] || "",
    );

    const [
        faviconUrl,
        setFaviconUrl,
    ] = useState(
        configuracoes[
        "site.faviconUrl"
        ] || "",
    );

    const [
        faviconPublicId,
        setFaviconPublicId,
    ] = useState(
        configuracoes[
        "site.faviconPublicId"
        ] || "",
    );

    const [
        heroImagemUrl,
        setHeroImagemUrl,
    ] = useState(
        configuracoes[
        "home.hero.imageUrl"
        ] || "",
    );

    const [
        heroImagemPublicId,
        setHeroImagemPublicId,
    ] = useState(
        configuracoes[
        "home.hero.imagePublicId"
        ] || "",
    );

    const [
        localImagemUrl,
        setLocalImagemUrl,
    ] = useState(
        configuracoes[
        "home.location.imageUrl"
        ] || "",
    );

    const [
        localImagemPublicId,
        setLocalImagemPublicId,
    ] = useState(
        configuracoes[
        "home.location.imagePublicId"
        ] || "",
    );

    const abas = useMemo(
        () => [
            {
                id: "identidade" as const,
                label: "Identidade",
                icon: Building2,
            },
            {
                id: "cabecalho" as const,
                label: "Cabeçalho",
                icon: LayoutTemplate,
            },
            {
                id: "hero" as const,
                label: "Hero",
                icon: ImageIcon,
            },
            {
                id: "localizacao" as const,
                label: "Localização",
                icon: MapPin,
            },
            {
                id: "contato" as const,
                label: "Contato",
                icon: Contact,
            },
            {
                id: "rodape" as const,
                label: "Rodapé",
                icon: Footprints,
            },
        ],
        [],
    );

    function mostrarSucesso(
        mensagem: string,
    ) {
        setAviso({
            tipo: "sucesso",
            titulo: "Tudo certo!",
            mensagem,
        });
    }

    function mostrarErro(
        mensagem: string,
    ) {
        setAviso({
            tipo: "erro",
            titulo:
                "Não foi possível concluir",
            mensagem,
        });
    }

    async function enviarImagem(
        arquivo: File,
        pasta: string,
    ): Promise<UploadResponse> {
        const formulario =
            new FormData();

        formulario.set(
            "file",
            arquivo,
        );

        formulario.set(
            "folder",
            pasta,
        );

        const resposta = await fetch(
            "/api/uploads/image",
            {
                method: "POST",
                body: formulario,
            },
        );

        const dados =
            (await resposta.json()) as UploadResponse;

        if (!resposta.ok) {
            throw new Error(
                dados.error ||
                "Não foi possível enviar a imagem.",
            );
        }

        return dados;
    }

    async function salvar(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!podeEditar) {
            return;
        }

        setSalvando(true);
        setAviso(null);

        try {
            const formulario =
                new FormData(
                    event.currentTarget,
                );

            const dados: Record<
                string,
                string
            > = {};

            if (
                abaAtiva ===
                "identidade"
            ) {
                let novaLogoUrl =
                    logoUrl;

                let novaLogoPublicId =
                    logoPublicId;

                let novoIcon192Url =
                    icon192Url;

                let novoIcon192PublicId =
                    icon192PublicId;

                let novoIcon512Url =
                    icon512Url;

                let novoIcon512PublicId =
                    icon512PublicId;

                let novoFaviconUrl =
                    faviconUrl;

                let novoFaviconPublicId =
                    faviconPublicId;

                const logo =
                    formulario.get(
                        "logo",
                    );

                const icon192 =
                    formulario.get(
                        "icon192",
                    );

                const icon512 =
                    formulario.get(
                        "icon512",
                    );

                const favicon =
                    formulario.get(
                        "favicon",
                    );

                if (
                    logo instanceof File &&
                    logo.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            logo,
                            "rick-jiujitsu/site/logo",
                        );

                    novaLogoUrl =
                        upload.secure_url ||
                        "";

                    novaLogoPublicId =
                        upload.public_id ||
                        "";
                }

                if (
                    icon192 instanceof File &&
                    icon192.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            icon192,
                            "rick-jiujitsu/site/pwa-192",
                        );

                    novoIcon192Url =
                        upload.secure_url ||
                        "";

                    novoIcon192PublicId =
                        upload.public_id ||
                        "";
                }

                if (
                    icon512 instanceof File &&
                    icon512.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            icon512,
                            "rick-jiujitsu/site/pwa-512",
                        );

                    novoIcon512Url =
                        upload.secure_url ||
                        "";

                    novoIcon512PublicId =
                        upload.public_id ||
                        "";
                }

                if (
                    favicon instanceof File &&
                    favicon.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            favicon,
                            "rick-jiujitsu/site/favicon",
                        );

                    novoFaviconUrl =
                        upload.secure_url ||
                        "";

                    novoFaviconPublicId =
                        upload.public_id ||
                        "";
                }

                dados["site.name"] =
                    String(
                        formulario.get(
                            "name",
                        ) || "",
                    );

                dados[
                    "site.shortName"
                ] = String(
                    formulario.get(
                        "shortName",
                    ) || "",
                );

                dados[
                    "site.initials"
                ] = String(
                    formulario.get(
                        "initials",
                    ) || "",
                );

                dados[
                    "site.slogan"
                ] = String(
                    formulario.get(
                        "slogan",
                    ) || "",
                );

                dados[
                    "site.description"
                ] = String(
                    formulario.get(
                        "description",
                    ) || "",
                );

                dados[
                    "site.logoUrl"
                ] = novaLogoUrl;

                dados[
                    "site.logoPublicId"
                ] = novaLogoPublicId;

                dados[
                    "site.icon192Url"
                ] = novoIcon192Url;

                dados[
                    "site.icon192PublicId"
                ] = novoIcon192PublicId;

                dados[
                    "site.icon512Url"
                ] = novoIcon512Url;

                dados[
                    "site.icon512PublicId"
                ] = novoIcon512PublicId;

                dados[
                    "site.faviconUrl"
                ] = novoFaviconUrl;

                dados[
                    "site.faviconPublicId"
                ] = novoFaviconPublicId;

                dados[
                    "site.color.primary"
                ] = String(
                    formulario.get(
                        "colorPrimary",
                    ) || "#e6aa22",
                );

                dados[
                    "site.color.secondary"
                ] = String(
                    formulario.get(
                        "colorSecondary",
                    ) || "#f4c34a",
                );

                dados[
                    "site.color.accent"
                ] = String(
                    formulario.get(
                        "colorAccent",
                    ) || "#d99d14",
                );

                dados[
                    "site.color.dark"
                ] = String(
                    formulario.get(
                        "colorDark",
                    ) || "#111216",
                );

                dados[
                    "site.color.light"
                ] = String(
                    formulario.get(
                        "colorLight",
                    ) || "#f5f5f3",
                );

                setLogoUrl(
                    novaLogoUrl,
                );

                setLogoPublicId(
                    novaLogoPublicId,
                );

                setIcon192Url(
                    novoIcon192Url,
                );

                setIcon192PublicId(
                    novoIcon192PublicId,
                );

                setIcon512Url(
                    novoIcon512Url,
                );

                setIcon512PublicId(
                    novoIcon512PublicId,
                );

                setFaviconUrl(
                    novoFaviconUrl,
                );

                setFaviconPublicId(
                    novoFaviconPublicId,
                );
            }

            if (
                abaAtiva ===
                "cabecalho"
            ) {
                dados[
                    "nav.home.label"
                ] = String(
                    formulario.get(
                        "navHomeLabel",
                    ) || "",
                );

                dados[
                    "nav.home.href"
                ] = String(
                    formulario.get(
                        "navHomeHref",
                    ) || "",
                );

                dados[
                    "nav.team.label"
                ] = String(
                    formulario.get(
                        "navTeamLabel",
                    ) || "",
                );

                dados[
                    "nav.team.href"
                ] = String(
                    formulario.get(
                        "navTeamHref",
                    ) || "",
                );

                dados[
                    "nav.system.label"
                ] = String(
                    formulario.get(
                        "navSystemLabel",
                    ) || "",
                );

                dados[
                    "nav.system.href"
                ] = String(
                    formulario.get(
                        "navSystemHref",
                    ) || "",
                );

                dados[
                    "nav.events.label"
                ] = String(
                    formulario.get(
                        "navEventsLabel",
                    ) || "",
                );

                dados[
                    "nav.events.href"
                ] = String(
                    formulario.get(
                        "navEventsHref",
                    ) || "",
                );

                dados[
                    "nav.timer.label"
                ] = String(
                    formulario.get(
                        "navTimerLabel",
                    ) || "",
                );

                dados[
                    "nav.timer.href"
                ] = String(
                    formulario.get(
                        "navTimerHref",
                    ) || "",
                );

                dados[
                    "nav.contact.label"
                ] = String(
                    formulario.get(
                        "navContactLabel",
                    ) || "",
                );

                dados[
                    "nav.contact.href"
                ] = String(
                    formulario.get(
                        "navContactHref",
                    ) || "",
                );

                dados[
                    "nav.login.label"
                ] = String(
                    formulario.get(
                        "navLoginLabel",
                    ) || "",
                );

                dados[
                    "nav.login.href"
                ] = String(
                    formulario.get(
                        "navLoginHref",
                    ) || "",
                );

                dados[
                    "nav.cta.label"
                ] = String(
                    formulario.get(
                        "navCtaLabel",
                    ) || "",
                );

                dados[
                    "nav.cta.href"
                ] = String(
                    formulario.get(
                        "navCtaHref",
                    ) || "",
                );
            }

            if (
                abaAtiva === "hero"
            ) {
                let novaHeroImagemUrl =
                    heroImagemUrl;

                let novaHeroImagemPublicId =
                    heroImagemPublicId;

                const heroImagem =
                    formulario.get(
                        "heroImage",
                    );

                if (
                    heroImagem instanceof File &&
                    heroImagem.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            heroImagem,
                            "rick-jiujitsu/site/hero",
                        );

                    novaHeroImagemUrl =
                        upload.secure_url ||
                        "";

                    novaHeroImagemPublicId =
                        upload.public_id ||
                        "";
                }

                dados[
                    "home.hero.sideTextLeft"
                ] = String(
                    formulario.get(
                        "heroSideLeft",
                    ) || "",
                );

                dados[
                    "home.hero.sideTextRight"
                ] = String(
                    formulario.get(
                        "heroSideRight",
                    ) || "",
                );

                dados[
                    "home.hero.subtitle"
                ] = String(
                    formulario.get(
                        "heroSubtitle",
                    ) || "",
                );

                dados[
                    "home.hero.description"
                ] = String(
                    formulario.get(
                        "heroDescription",
                    ) || "",
                );

                dados[
                    "home.hero.primaryButtonLabel"
                ] = String(
                    formulario.get(
                        "heroPrimaryLabel",
                    ) || "",
                );

                dados[
                    "home.hero.primaryButtonHref"
                ] = String(
                    formulario.get(
                        "heroPrimaryHref",
                    ) || "",
                );

                dados[
                    "home.hero.secondaryButtonLabel"
                ] = String(
                    formulario.get(
                        "heroSecondaryLabel",
                    ) || "",
                );

                dados[
                    "home.hero.secondaryButtonHref"
                ] = String(
                    formulario.get(
                        "heroSecondaryHref",
                    ) || "",
                );

                dados[
                    "home.hero.imageUrl"
                ] = novaHeroImagemUrl;

                dados[
                    "home.hero.imagePublicId"
                ] = novaHeroImagemPublicId;

                setHeroImagemUrl(
                    novaHeroImagemUrl,
                );

                setHeroImagemPublicId(
                    novaHeroImagemPublicId,
                );
            }

            if (
                abaAtiva ===
                "localizacao"
            ) {
                let novaLocalImagemUrl =
                    localImagemUrl;

                let novaLocalImagemPublicId =
                    localImagemPublicId;

                const localImagem =
                    formulario.get(
                        "locationImage",
                    );

                if (
                    localImagem instanceof File &&
                    localImagem.size > 0
                ) {
                    const upload =
                        await enviarImagem(
                            localImagem,
                            "rick-jiujitsu/site/localizacao",
                        );

                    novaLocalImagemUrl =
                        upload.secure_url ||
                        "";

                    novaLocalImagemPublicId =
                        upload.public_id ||
                        "";
                }

                const horarios =
                    textoParaHorarios(
                        String(
                            formulario.get(
                                "schedule",
                            ) || "",
                        ),
                    );

                dados[
                    "home.location.title"
                ] = String(
                    formulario.get(
                        "locationTitle",
                    ) || "",
                );

                dados[
                    "home.location.subtitle"
                ] = String(
                    formulario.get(
                        "locationSubtitle",
                    ) || "",
                );

                dados[
                    "home.location.name"
                ] = String(
                    formulario.get(
                        "locationName",
                    ) || "",
                );

                dados[
                    "home.location.address"
                ] = String(
                    formulario.get(
                        "locationAddress",
                    ) || "",
                );

                dados[
                    "home.location.city"
                ] = String(
                    formulario.get(
                        "locationCity",
                    ) || "",
                );

                dados[
                    "home.location.zipCode"
                ] = String(
                    formulario.get(
                        "locationZipCode",
                    ) || "",
                );

                dados[
                    "home.location.lat"
                ] = String(
                    formulario.get(
                        "locationLat",
                    ) || "",
                );

                dados[
                    "home.location.lng"
                ] = String(
                    formulario.get(
                        "locationLng",
                    ) || "",
                );

                dados[
                    "home.location.mapButtonLabel"
                ] = String(
                    formulario.get(
                        "locationMapLabel",
                    ) || "",
                );

                dados[
                    "home.location.mapUrl"
                ] = String(
                    formulario.get(
                        "locationMapUrl",
                    ) || "",
                );

                dados[
                    "home.location.imageUrl"
                ] = novaLocalImagemUrl;

                dados[
                    "home.location.imagePublicId"
                ] = novaLocalImagemPublicId;

                dados[
                    "home.schedule"
                ] = JSON.stringify(
                    horarios,
                );

                setLocalImagemUrl(
                    novaLocalImagemUrl,
                );

                setLocalImagemPublicId(
                    novaLocalImagemPublicId,
                );
            }

            if (
                abaAtiva === "contato"
            ) {
                dados[
                    "home.contact.title"
                ] = String(
                    formulario.get(
                        "contactTitle",
                    ) || "",
                );

                dados[
                    "home.contact.subtitle"
                ] = String(
                    formulario.get(
                        "contactSubtitle",
                    ) || "",
                );

                dados[
                    "home.contact.whatsapp"
                ] = String(
                    formulario.get(
                        "contactWhatsapp",
                    ) || "",
                );

                dados[
                    "home.contact.whatsappHint"
                ] = String(
                    formulario.get(
                        "contactWhatsappHint",
                    ) || "",
                );

                dados[
                    "home.contact.instagram"
                ] = String(
                    formulario.get(
                        "contactInstagram",
                    ) || "",
                );

                dados[
                    "home.contact.instagramHint"
                ] = String(
                    formulario.get(
                        "contactInstagramHint",
                    ) || "",
                );

                dados[
                    "home.contact.phone"
                ] = String(
                    formulario.get(
                        "contactPhone",
                    ) || "",
                );

                dados[
                    "home.contact.email"
                ] = String(
                    formulario.get(
                        "contactEmail",
                    ) || "",
                );

                dados[
                    "home.contact.form.namePlaceholder"
                ] = String(
                    formulario.get(
                        "formNamePlaceholder",
                    ) || "",
                );

                dados[
                    "home.contact.form.emailPlaceholder"
                ] = String(
                    formulario.get(
                        "formEmailPlaceholder",
                    ) || "",
                );

                dados[
                    "home.contact.form.messagePlaceholder"
                ] = String(
                    formulario.get(
                        "formMessagePlaceholder",
                    ) || "",
                );

                dados[
                    "home.contact.form.submitLabel"
                ] = String(
                    formulario.get(
                        "formSubmitLabel",
                    ) || "",
                );
            }

            if (
                abaAtiva === "rodape"
            ) {
                const linksRodape =
                    textoParaLinks(
                        String(
                            formulario.get(
                                "footerLinks",
                            ) || "",
                        ),
                    );

                dados[
                    "footer.values"
                ] = String(
                    formulario.get(
                        "footerValues",
                    ) || "",
                );

                dados[
                    "footer.slogan"
                ] = String(
                    formulario.get(
                        "footerSlogan",
                    ) || "",
                );

                dados[
                    "footer.description"
                ] = String(
                    formulario.get(
                        "footerDescription",
                    ) || "",
                );

                dados[
                    "footer.copyright"
                ] = String(
                    formulario.get(
                        "footerCopyright",
                    ) || "",
                );

                dados[
                    "footer.links"
                ] = JSON.stringify(
                    linksRodape,
                );

                dados[
                    "footer.instagramUrl"
                ] = String(
                    formulario.get(
                        "footerInstagram",
                    ) || "",
                );

                dados[
                    "footer.youtubeUrl"
                ] = String(
                    formulario.get(
                        "footerYoutube",
                    ) || "",
                );

                dados[
                    "footer.facebookUrl"
                ] = String(
                    formulario.get(
                        "footerFacebook",
                    ) || "",
                );
            }

            const resposta =
                await fetch(
                    "/api/site/configuracoes",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify(
                            dados,
                        ),
                    },
                );

            const resultado =
                await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error ||
                    "Não foi possível salvar as configurações.",
                );
            }

            setValores(
                (anteriores) => ({
                    ...anteriores,
                    ...dados,
                }),
            );

            mostrarSucesso(
                resultado.message ||
                "As configurações foram salvas com sucesso.",
            );
        } catch (error) {
            mostrarErro(
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro ao salvar as configurações.",
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <form
                className={styles.page}
                onSubmit={salvar}
            >
                <div className={styles.tabs}>
                    {abas.map((aba) => {
                        const Icon =
                            aba.icon;

                        return (
                            <button
                                key={aba.id}
                                type="button"
                                className={
                                    abaAtiva ===
                                        aba.id
                                        ? styles.tabActive
                                        : styles.tab
                                }
                                onClick={() =>
                                    setAbaAtiva(
                                        aba.id,
                                    )
                                }
                            >
                                <Icon size={17} />
                                {aba.label}
                            </button>
                        );
                    })}
                </div>

                {abaAtiva ===
                    "identidade" && (
                        <Identidade
                            valores={valores}
                            podeEditar={
                                podeEditar
                            }
                            logoUrl={logoUrl}
                            icon192Url={
                                icon192Url
                            }
                            icon512Url={
                                icon512Url
                            }
                            faviconUrl={
                                faviconUrl
                            }
                        />
                    )}

                {abaAtiva ===
                    "cabecalho" && (
                        <Cabecalho
                            valores={valores}
                            podeEditar={
                                podeEditar
                            }
                        />
                    )}

                {abaAtiva === "hero" && (
                    <Hero
                        valores={valores}
                        podeEditar={
                            podeEditar
                        }
                        heroImagemUrl={
                            heroImagemUrl
                        }
                    />
                )}

                {abaAtiva ===
                    "localizacao" && (
                        <Localizacao
                            valores={valores}
                            podeEditar={
                                podeEditar
                            }
                            localImagemUrl={
                                localImagemUrl
                            }
                        />
                    )}

                {abaAtiva ===
                    "contato" && (
                        <Contato
                            valores={valores}
                            podeEditar={
                                podeEditar
                            }
                        />
                    )}

                {abaAtiva ===
                    "rodape" && (
                        <Rodape
                            valores={valores}
                            podeEditar={
                                podeEditar
                            }
                        />
                    )}

                {podeEditar && (
                    <div
                        className={
                            styles.saveArea
                        }
                    >
                        <button
                            type="submit"
                            disabled={
                                salvando
                            }
                        >
                            <Save size={18} />

                            {salvando
                                ? "Salvando..."
                                : "Salvar configurações"}
                        </button>
                    </div>
                )}
            </form>

            {aviso && (
                <div
                    className={
                        styles.modalOverlay
                    }
                    role="presentation"
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setAviso(
                                null,
                            );
                        }
                    }}
                >
                    <div
                        className={
                            styles.modalAviso
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-aviso-site"
                    >
                        <button
                            type="button"
                            className={
                                styles.modalFechar
                            }
                            aria-label="Fechar aviso"
                            onClick={() =>
                                setAviso(
                                    null,
                                )
                            }
                        >
                            <X size={18} />
                        </button>

                        <div
                            className={
                                aviso.tipo ===
                                    "sucesso"
                                    ? styles.modalIconeSucesso
                                    : styles.modalIconeErro
                            }
                        >
                            {aviso.tipo ===
                                "sucesso" ? (
                                <CheckCircle2
                                    size={34}
                                />
                            ) : (
                                <CircleAlert
                                    size={34}
                                />
                            )}
                        </div>

                        <h2 id="titulo-aviso-site">
                            {aviso.titulo}
                        </h2>

                        <p>
                            {aviso.mensagem}
                        </p>

                        <button
                            type="button"
                            className={
                                aviso.tipo ===
                                    "sucesso"
                                    ? styles.modalBotaoSucesso
                                    : styles.modalBotaoErro
                            }
                            onClick={() =>
                                setAviso(
                                    null,
                                )
                            }
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}