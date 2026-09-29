// src/components/site/ConfiguracoesSite/Contato/Contato.tsx

import { Contact as ContactIcon } from "lucide-react";

import styles from "../styles.module.scss";

type Props = {
    valores: Record<string, string>;
    podeEditar: boolean;
};

export default function Contato({
    valores,
    podeEditar,
}: Props) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    <ContactIcon size={22} />
                </div>

                <div>
                    <h2>Contato</h2>

                    <p>
                        WhatsApp, Instagram, telefone, e-mail
                        e formulário da página pública.
                    </p>
                </div>
            </div>

            <div className={styles.fields}>
                <label>
                    Título

                    <input
                        name="contactTitle"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.title"
                            ] ||
                            "Fale com a nossa equipe"
                        }
                    />
                </label>

                <label>
                    Subtítulo

                    <input
                        name="contactSubtitle"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.subtitle"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    WhatsApp

                    <input
                        name="contactWhatsapp"
                        disabled={!podeEditar}
                        placeholder="5512999999999 ou https://wa.me/..."
                        defaultValue={
                            valores[
                            "home.contact.whatsapp"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    Texto auxiliar do WhatsApp

                    <input
                        name="contactWhatsappHint"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.whatsappHint"
                            ] ||
                            "Converse agora"
                        }
                    />
                </label>

                <label>
                    Instagram

                    <input
                        name="contactInstagram"
                        disabled={!podeEditar}
                        placeholder="@usuario ou https://instagram.com/..."
                        defaultValue={
                            valores[
                            "home.contact.instagram"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    Texto auxiliar do Instagram

                    <input
                        name="contactInstagramHint"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.instagramHint"
                            ] ||
                            "Acompanhe nossa rotina"
                        }
                    />
                </label>

                <label>
                    Telefone

                    <input
                        name="contactPhone"
                        disabled={!podeEditar}
                        placeholder="(12) 99999-9999"
                        defaultValue={
                            valores[
                            "home.contact.phone"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    E-mail

                    <input
                        name="contactEmail"
                        type="email"
                        disabled={!podeEditar}
                        placeholder="contato@equipe.com.br"
                        defaultValue={
                            valores[
                            "home.contact.email"
                            ] ||
                            ""
                        }
                    />
                </label>

                <label>
                    Placeholder do nome

                    <input
                        name="formNamePlaceholder"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.form.namePlaceholder"
                            ] ||
                            "Nome completo"
                        }
                    />
                </label>

                <label>
                    Placeholder do e-mail

                    <input
                        name="formEmailPlaceholder"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.form.emailPlaceholder"
                            ] ||
                            "Seu e-mail"
                        }
                    />
                </label>

                <label className={styles.full}>
                    Placeholder da mensagem

                    <input
                        name="formMessagePlaceholder"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.form.messagePlaceholder"
                            ] ||
                            "Sua mensagem"
                        }
                    />
                </label>

                <label>
                    Texto do botão

                    <input
                        name="formSubmitLabel"
                        disabled={!podeEditar}
                        defaultValue={
                            valores[
                            "home.contact.form.submitLabel"
                            ] ||
                            "Enviar mensagem"
                        }
                    />
                </label>
            </div>
        </section>
    );
}