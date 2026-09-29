// src/components/site/home/LocalizacaoContato/LocalizacaoContato.tsx

"use client";

import {
    ArrowRight,
    Camera,
    Clock3,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from "lucide-react";
import Image from "next/image";

import styles from "./styles.module.scss";

type Horario = {
    day: string;
    time: string;
};

type Props = {
    configuracoes: Record<string, string>;

    identidade: {
        nomeEquipe: string;
        logoEquipe: string;
    };

    horarios: Horario[];
};

function criarWhatsAppHref(valor: string) {
    const texto = valor.trim();

    if (!texto) {
        return "";
    }

    if (
        texto.startsWith("http://") ||
        texto.startsWith("https://")
    ) {
        return texto;
    }

    const numero = texto.replace(/\D/g, "");

    return numero
        ? `https://wa.me/${numero}`
        : "";
}

function criarInstagramHref(valor: string) {
    const texto = valor.trim();

    if (!texto) {
        return "";
    }

    if (
        texto.startsWith("http://") ||
        texto.startsWith("https://")
    ) {
        return texto;
    }

    return `https://instagram.com/${texto.replace(/^@/, "")}`;
}

export default function LocalizacaoContato({
    configuracoes,
    identidade,
    horarios,
}: Props) {
    const nomeLocal =
        configuracoes["home.location.name"] ||
        identidade.nomeEquipe;

    const endereco =
        configuracoes["home.location.address"] ||
        "Endereço a cadastrar";

    const cidade =
        configuracoes["home.location.city"] ||
        "Cidade a cadastrar";

    const cep =
        configuracoes["home.location.zipCode"] ||
        "";

    const latitude =
        configuracoes["home.location.lat"] ||
        "";

    const longitude =
        configuracoes["home.location.lng"] ||
        "";

    const mapUrlCadastrada =
        configuracoes["home.location.mapUrl"] ||
        "";

    const mapUrl =
        mapUrlCadastrada ||
        (latitude && longitude
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${latitude},${longitude}`,
            )}`
            : endereco !== "Endereço a cadastrar"
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${endereco}, ${cidade}`,
                )}`
                : "");

    const whatsapp =
        configuracoes["home.contact.whatsapp"] ||
        "";

    const whatsappHref =
        criarWhatsAppHref(whatsapp);

    const instagram =
        configuracoes["home.contact.instagram"] ||
        "";

    const instagramHref =
        criarInstagramHref(instagram);

    const telefone =
        configuracoes["home.contact.phone"] ||
        "";

    const email =
        configuracoes["home.contact.email"] ||
        "";

    function enviarMensagem(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const formulario = new FormData(
            event.currentTarget,
        );

        const nome = String(
            formulario.get("nome") || "",
        ).trim();

        const emailRemetente = String(
            formulario.get("email") || "",
        ).trim();

        const mensagem = String(
            formulario.get("mensagem") || "",
        ).trim();

        const texto = [
            `Olá! Meu nome é ${nome || "visitante"}.`,
            emailRemetente
                ? `E-mail: ${emailRemetente}`
                : "",
            "",
            mensagem,
        ]
            .filter(Boolean)
            .join("\n");

        if (whatsappHref) {
            const separador = whatsappHref.includes("?")
                ? "&"
                : "?";

            window.open(
                `${whatsappHref}${separador}text=${encodeURIComponent(texto)}`,
                "_blank",
                "noopener,noreferrer",
            );

            return;
        }

        if (email) {
            window.location.href =
                `mailto:${email}` +
                `?subject=${encodeURIComponent(
                    "Contato pelo site",
                )}` +
                `&body=${encodeURIComponent(texto)}`;
        }
    }

    return (
        <section
            id="contato"
            className={styles.section}
        >
            <div className={styles.location}>
                <div className={styles.header}>
                    <h2>
                        <MapPin size={23} />

                        {configuracoes[
                            "home.location.title"
                        ] || "Como chegar ao treino"}
                    </h2>

                    <p>
                        {configuracoes[
                            "home.location.subtitle"
                        ] ||
                            "Nossa sede está de portas abertas para receber você."}
                    </p>
                </div>

                <div className={styles.locationContent}>
                    <div className={styles.academyImage}>
                        {configuracoes[
                            "home.location.imageUrl"
                        ] ? (
                            <Image
                                src={
                                    configuracoes[
                                    "home.location.imageUrl"
                                    ]
                                }
                                alt={nomeLocal}
                                fill
                                sizes="350px"
                            />
                        ) : (
                            <div
                                className={
                                    styles.academyPlaceholder
                                }
                            >
                                <Image
                                    src={
                                        identidade.logoEquipe
                                    }
                                    alt={
                                        identidade.nomeEquipe
                                    }
                                    width={150}
                                    height={90}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.map}>
                        <MapPin size={36} />

                        <strong>
                            {nomeLocal}
                        </strong>

                        <span>
                            {latitude && longitude
                                ? `${latitude}, ${longitude}`
                                : cidade}
                        </span>
                    </div>

                    <div className={styles.address}>
                        <div>
                            <MapPin size={18} />

                            <p>
                                <strong>
                                    {endereco}
                                </strong>

                                <span>
                                    {cidade}
                                    {cep
                                        ? ` • CEP ${cep}`
                                        : ""}
                                </span>
                            </p>
                        </div>

                        <div>
                            <Clock3 size={18} />

                            <p>
                                <strong>
                                    Horários de treino
                                </strong>

                                {horarios.length > 0 ? (
                                    horarios.map(
                                        (horario) => (
                                            <span
                                                key={`${horario.day}-${horario.time}`}
                                            >
                                                {
                                                    horario.day
                                                }
                                                :{" "}
                                                {
                                                    horario.time
                                                }
                                            </span>
                                        ),
                                    )
                                ) : (
                                    <span>
                                        Horários a
                                        cadastrar
                                    </span>
                                )}
                            </p>
                        </div>

                        {mapUrl ? (
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {configuracoes[
                                    "home.location.mapButtonLabel"
                                ] || "Abrir no mapa"}

                                <ArrowRight
                                    size={16}
                                />
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled
                            >
                                {configuracoes[
                                    "home.location.mapButtonLabel"
                                ] || "Abrir no mapa"}

                                <ArrowRight
                                    size={16}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.contact}>
                <div className={styles.header}>
                    <h2>
                        <MessageCircle size={23} />

                        {configuracoes[
                            "home.contact.title"
                        ] ||
                            "Fale com a nossa equipe"}
                    </h2>

                    <p>
                        {configuracoes[
                            "home.contact.subtitle"
                        ] ||
                            "Tire suas dúvidas, agende uma aula ou saiba mais sobre o sistema."}
                    </p>
                </div>

                <div className={styles.contactContent}>
                    <div className={styles.contactLinks}>
                        <a
                            href={
                                whatsappHref || "#contato"
                            }
                            target={
                                whatsappHref
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                whatsappHref
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                        >
                            <MessageCircle size={19} />

                            <div>
                                <strong>
                                    WhatsApp
                                </strong>

                                <span>
                                    {configuracoes[
                                        "home.contact.whatsappHint"
                                    ] ||
                                        "Converse agora"}
                                </span>
                            </div>
                        </a>

                        <a
                            href={
                                instagramHref ||
                                "#contato"
                            }
                            target={
                                instagramHref
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                instagramHref
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                        >
                            <Camera size={19} />

                            <div>
                                <strong>
                                    Instagram
                                </strong>

                                <span>
                                    {configuracoes[
                                        "home.contact.instagramHint"
                                    ] ||
                                        "Acompanhe nossa rotina"}
                                </span>
                            </div>
                        </a>

                        <a
                            href={
                                telefone
                                    ? `tel:${telefone.replace(
                                        /[^\d+]/g,
                                        "",
                                    )}`
                                    : "#contato"
                            }
                        >
                            <Phone size={19} />

                            <div>
                                <strong>
                                    Telefone
                                </strong>

                                <span>
                                    {telefone ||
                                        "Cadastrar telefone"}
                                </span>
                            </div>
                        </a>

                        <a
                            href={
                                email
                                    ? `mailto:${email}`
                                    : "#contato"
                            }
                        >
                            <Mail size={19} />

                            <div>
                                <strong>
                                    E-mail
                                </strong>

                                <span>
                                    {email ||
                                        "Cadastrar e-mail"}
                                </span>
                            </div>
                        </a>
                    </div>

                    <form
                        className={styles.form}
                        onSubmit={enviarMensagem}
                    >
                        <input
                            name="nome"
                            type="text"
                            required
                            placeholder={
                                configuracoes[
                                "home.contact.form.namePlaceholder"
                                ] || "Nome completo"
                            }
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder={
                                configuracoes[
                                "home.contact.form.emailPlaceholder"
                                ] || "Seu e-mail"
                            }
                        />

                        <textarea
                            name="mensagem"
                            required
                            placeholder={
                                configuracoes[
                                "home.contact.form.messagePlaceholder"
                                ] || "Sua mensagem"
                            }
                        />

                        <button type="submit">
                            {configuracoes[
                                "home.contact.form.submitLabel"
                            ] || "Enviar mensagem"}

                            <ArrowRight size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}