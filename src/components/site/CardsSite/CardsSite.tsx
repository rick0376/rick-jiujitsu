// src/components/site/CardsSite/CardsSite.tsx

"use client";

import { CheckCircle2, CircleAlert, Eye, EyeOff, ImageIcon, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import styles from "./styles.module.scss";

type Secao = "MAIN_FEATURE" | "TIMER_FEATURE";

type CardSite = {
    id: string;
    slug: string;
    section: Secao;
    title: string;
    description: string | null;
    bullets: unknown;
    linkLabel: string | null;
    linkHref: string | null;
    imageUrl: string | null;
    imagePublicId: string | null;
    active: boolean;
    sortOrder: number;
};

type Props = {
    cardsIniciais: CardSite[];
    podeEditar: boolean;
};

type Aviso = {
    tipo: "sucesso" | "erro";
    titulo: string;
    mensagem: string;
};

type Editor = {
    id: string | null;
    title: string;
    slug: string;
    section: Secao;
    description: string;
    bullets: string;
    linkLabel: string;
    linkHref: string;
    imageUrl: string;
    imagePublicId: string;
    active: boolean;
    sortOrder: number;
};

type UploadResponse = {
    secure_url?: string;
    public_id?: string;
    error?: string;
};

const editorVazio: Editor = {
    id: null,
    title: "",
    slug: "",
    section: "MAIN_FEATURE",
    description: "",
    bullets: "",
    linkLabel: "Ver mais",
    linkHref: "/login",
    imageUrl: "",
    imagePublicId: "",
    active: true,
    sortOrder: 0,
};

function bulletsParaTexto(valor: unknown) {
    if (!Array.isArray(valor)) return "";
    return valor.map((item) => String(item)).join("\n");
}

function gerarSlug(valor: string) {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function nomeSecao(secao: Secao) {
    return secao === "MAIN_FEATURE" ? "Recursos principais" : "Cronômetros";
}

export default function CardsSite({ cardsIniciais, podeEditar }: Props) {
    const [cards, setCards] = useState(cardsIniciais);
    const [editor, setEditor] = useState<Editor>(editorVazio);
    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [cardExcluir, setCardExcluir] = useState<CardSite | null>(null);
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
    const [previewLocal, setPreviewLocal] = useState("");
    const [aviso, setAviso] = useState<Aviso | null>(null);

    useEffect(() => {
        if (!arquivoImagem) {
            setPreviewLocal("");
            return;
        }

        const url = URL.createObjectURL(arquivoImagem);
        setPreviewLocal(url);

        return () => URL.revokeObjectURL(url);
    }, [arquivoImagem]);

    const cardsOrdenados = useMemo(
        () => [...cards].sort((a, b) => a.section.localeCompare(b.section) || a.sortOrder - b.sortOrder),
        [cards],
    );

    function abrirNovo() {
        const maiorOrdem = cards
            .filter((card) => card.section === "MAIN_FEATURE")
            .reduce((maior, card) => Math.max(maior, card.sortOrder), -1);

        setEditor({ ...editorVazio, sortOrder: maiorOrdem + 1 });
        setArquivoImagem(null);
        setModalAberto(true);
    }

    function abrirEdicao(card: CardSite) {
        setEditor({
            id: card.id,
            title: card.title,
            slug: card.slug,
            section: card.section,
            description: card.description || "",
            bullets: bulletsParaTexto(card.bullets),
            linkLabel: card.linkLabel || "",
            linkHref: card.linkHref || "",
            imageUrl: card.imageUrl || "",
            imagePublicId: card.imagePublicId || "",
            active: card.active,
            sortOrder: card.sortOrder,
        });

        setArquivoImagem(null);
        setModalAberto(true);
    }

    function fecharEditor() {
        if (salvando) return;
        setModalAberto(false);
        setArquivoImagem(null);
        setEditor(editorVazio);
    }

    async function enviarImagem(arquivo: File) {
        const formulario = new FormData();
        formulario.set("file", arquivo);
        formulario.set("folder", "rick-jiujitsu/site/cards");

        const resposta = await fetch("/api/uploads/image", { method: "POST", body: formulario });
        const dados = (await resposta.json()) as UploadResponse;

        if (!resposta.ok) {
            throw new Error(dados.error || "Não foi possível enviar a imagem.");
        }

        return dados;
    }

    async function salvarCard(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!podeEditar || salvando) return;

        if (!editor.title.trim()) {
            setAviso({ tipo: "erro", titulo: "Título obrigatório", mensagem: "Informe o título do card." });
            return;
        }

        setSalvando(true);

        try {
            let imageUrl = editor.imageUrl;
            let imagePublicId = editor.imagePublicId;

            if (arquivoImagem) {
                const upload = await enviarImagem(arquivoImagem);
                imageUrl = upload.secure_url || "";
                imagePublicId = upload.public_id || "";
            }

            const slug = editor.slug.trim() || gerarSlug(editor.title);

            const corpo = {
                title: editor.title.trim(),
                slug,
                section: editor.section,
                description: editor.description.trim(),
                bullets: editor.bullets,
                linkLabel: editor.linkLabel.trim(),
                linkHref: editor.linkHref.trim(),
                imageUrl,
                imagePublicId,
                active: editor.active,
                sortOrder: Number(editor.sortOrder),
            };

            const resposta = await fetch(editor.id ? `/api/site/cards/${editor.id}` : "/api/site/cards", {
                method: editor.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Não foi possível salvar o card.");
            }

            const cardSalvo = dados.card as CardSite;

            setCards((atuais) =>
                editor.id
                    ? atuais.map((card) => (card.id === cardSalvo.id ? cardSalvo : card))
                    : [...atuais, cardSalvo],
            );

            fecharEditor();
            setAviso({
                tipo: "sucesso",
                titulo: "Card salvo",
                mensagem: editor.id ? "O card foi atualizado com sucesso." : "O novo card foi criado com sucesso.",
            });
        } catch (error) {
            setAviso({
                tipo: "erro",
                titulo: "Não foi possível salvar",
                mensagem: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o card.",
            });
        } finally {
            setSalvando(false);
        }
    }

    async function alterarStatus(card: CardSite) {
        if (!podeEditar) return;

        try {
            const resposta = await fetch(`/api/site/cards/${card.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !card.active }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Não foi possível alterar o status.");
            }

            setCards((atuais) => atuais.map((item) => (item.id === card.id ? dados.card : item)));
        } catch (error) {
            setAviso({
                tipo: "erro",
                titulo: "Não foi possível alterar",
                mensagem: error instanceof Error ? error.message : "Ocorreu um erro ao alterar o status.",
            });
        }
    }

    async function excluirCard() {
        if (!cardExcluir || !podeEditar || excluindo) return;

        setExcluindo(true);

        try {
            const resposta = await fetch(`/api/site/cards/${cardExcluir.id}`, { method: "DELETE" });
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || "Não foi possível excluir o card.");
            }

            setCards((atuais) => atuais.filter((card) => card.id !== cardExcluir.id));
            setCardExcluir(null);
            setAviso({ tipo: "sucesso", titulo: "Card excluído", mensagem: "O card foi removido com sucesso." });
        } catch (error) {
            setAviso({
                tipo: "erro",
                titulo: "Não foi possível excluir",
                mensagem: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o card.",
            });
        } finally {
            setExcluindo(false);
        }
    }

    const imagemPreview = previewLocal || editor.imageUrl;

    return (
        <>
            <section className={styles.section}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Conteúdo da página pública</span>
                        <h2>Cards do site</h2>
                        <p>Gerencie os cards exibidos nas áreas de recursos e cronômetros da página principal.</p>
                    </div>

                    {podeEditar && (
                        <button type="button" className={styles.newButton} onClick={abrirNovo}>
                            <Plus size={17} />
                            Novo card
                        </button>
                    )}
                </div>

                {!cardsOrdenados.length ? (
                    <div className={styles.empty}>
                        <ImageIcon size={34} />
                        <strong>Nenhum card cadastrado</strong>
                        <span>Cadastre o primeiro card para começar a preencher esta área do site.</span>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {cardsOrdenados.map((card) => (
                            <article className={`${styles.card} ${!card.active ? styles.cardInactive : ""}`} key={card.id}>
                                <div className={styles.image}>
                                    {card.imageUrl ? (
                                        <Image src={card.imageUrl} alt={card.title} fill sizes="360px" />
                                    ) : (
                                        <div className={styles.placeholder}>
                                            <ImageIcon size={32} />
                                        </div>
                                    )}

                                    <div className={styles.overlay} />

                                    <span className={styles.order}>#{String(card.sortOrder + 1).padStart(2, "0")}</span>

                                    <span className={`${styles.status} ${card.active ? styles.statusActive : styles.statusInactive}`}>
                                        {card.active ? "Ativo" : "Inativo"}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <span className={styles.sectionBadge}>{nomeSecao(card.section)}</span>
                                    <h3>{card.title}</h3>
                                    <p>{card.description || "Sem descrição cadastrada."}</p>

                                    <div className={styles.slug}>
                                        <span>Slug</span>
                                        <code>{card.slug}</code>
                                    </div>

                                    {podeEditar && (
                                        <div className={styles.actions}>
                                            <button type="button" onClick={() => abrirEdicao(card)}>
                                                <Pencil size={15} />
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className={styles.statusButton}
                                                onClick={() => alterarStatus(card)}
                                            >
                                                {card.active ? <EyeOff size={15} /> : <Eye size={15} />}
                                                {card.active ? "Desativar" : "Ativar"}
                                            </button>

                                            <button
                                                type="button"
                                                className={styles.deleteButton}
                                                onClick={() => setCardExcluir(card)}
                                                aria-label={`Excluir ${card.title}`}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {modalAberto && (
                <div className={styles.modalOverlay} onMouseDown={(event) => event.target === event.currentTarget && fecharEditor()}>
                    <form className={styles.modal} onSubmit={salvarCard}>
                        <div className={styles.modalHeader}>
                            <div>
                                <span>{editor.id ? "Editar card" : "Novo card"}</span>
                                <h2>{editor.id ? editor.title || "Editar card" : "Cadastrar novo card"}</h2>
                            </div>

                            <button type="button" className={styles.closeButton} onClick={fecharEditor} aria-label="Fechar">
                                <X size={19} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.imageEditor}>
                                <div className={styles.preview}>
                                    {imagemPreview ? (
                                        <Image
                                            src={imagemPreview}
                                            alt="Prévia do card"
                                            fill
                                            sizes="420px"
                                            unoptimized={imagemPreview.startsWith("blob:")}
                                        />
                                    ) : (
                                        <div className={styles.previewEmpty}>
                                            <ImageIcon size={36} />
                                            <span>Imagem do card</span>
                                        </div>
                                    )}
                                </div>

                                <label className={styles.uploadButton}>
                                    <ImageIcon size={16} />
                                    Escolher imagem
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={!podeEditar || salvando}
                                        onChange={(event) => setArquivoImagem(event.target.files?.[0] || null)}
                                    />
                                </label>

                                {(editor.imageUrl || arquivoImagem) && (
                                    <button
                                        type="button"
                                        className={styles.removeImage}
                                        onClick={() => {
                                            setArquivoImagem(null);
                                            setEditor((atual) => ({ ...atual, imageUrl: "", imagePublicId: "" }));
                                        }}
                                    >
                                        Remover imagem
                                    </button>
                                )}
                            </div>

                            <div className={styles.fields}>
                                <div className={styles.twoColumns}>
                                    <label>
                                        <span>Título *</span>
                                        <input
                                            value={editor.title}
                                            disabled={!podeEditar || salvando}
                                            onChange={(event) => {
                                                const title = event.target.value;
                                                setEditor((atual) => ({
                                                    ...atual,
                                                    title,
                                                    slug: atual.id || atual.slug ? atual.slug : gerarSlug(title),
                                                }));
                                            }}
                                        />
                                    </label>

                                    <label>
                                        <span>Slug</span>
                                        <input
                                            value={editor.slug}
                                            disabled={!podeEditar || salvando}
                                            placeholder="gerado-automaticamente"
                                            onChange={(event) => setEditor((atual) => ({ ...atual, slug: gerarSlug(event.target.value) }))}
                                        />
                                    </label>
                                </div>

                                <div className={styles.twoColumns}>
                                    <label>
                                        <span>Seção</span>
                                        <select
                                            value={editor.section}
                                            disabled={!podeEditar || salvando}
                                            onChange={(event) =>
                                                setEditor((atual) => ({ ...atual, section: event.target.value as Secao }))
                                            }
                                        >
                                            <option value="MAIN_FEATURE">Recursos principais</option>
                                            <option value="TIMER_FEATURE">Cronômetros</option>
                                        </select>
                                    </label>

                                    <label>
                                        <span>Ordem</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editor.sortOrder}
                                            disabled={!podeEditar || salvando}
                                            onChange={(event) =>
                                                setEditor((atual) => ({ ...atual, sortOrder: Number(event.target.value) }))
                                            }
                                        />
                                    </label>
                                </div>

                                <label>
                                    <span>Descrição</span>
                                    <textarea
                                        rows={4}
                                        value={editor.description}
                                        disabled={!podeEditar || salvando}
                                        onChange={(event) => setEditor((atual) => ({ ...atual, description: event.target.value }))}
                                    />
                                </label>

                                <label>
                                    <span>Itens / benefícios</span>
                                    <textarea
                                        rows={4}
                                        value={editor.bullets}
                                        disabled={!podeEditar || salvando}
                                        placeholder={"Um item por linha\nOutro item\nMais um benefício"}
                                        onChange={(event) => setEditor((atual) => ({ ...atual, bullets: event.target.value }))}
                                    />
                                    <small>Digite um item por linha.</small>
                                </label>

                                <div className={styles.twoColumns}>
                                    <label>
                                        <span>Texto do link</span>
                                        <input
                                            value={editor.linkLabel}
                                            disabled={!podeEditar || salvando}
                                            onChange={(event) => setEditor((atual) => ({ ...atual, linkLabel: event.target.value }))}
                                        />
                                    </label>

                                    <label>
                                        <span>Destino do link</span>
                                        <input
                                            value={editor.linkHref}
                                            disabled={!podeEditar || salvando}
                                            placeholder="/login"
                                            onChange={(event) => setEditor((atual) => ({ ...atual, linkHref: event.target.value }))}
                                        />
                                    </label>
                                </div>

                                <label className={styles.switchRow}>
                                    <div>
                                        <strong>Card ativo</strong>
                                        <span>Quando desativado, o card deixa de aparecer na página pública.</span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={editor.active}
                                        disabled={!podeEditar || salvando}
                                        onChange={(event) => setEditor((atual) => ({ ...atual, active: event.target.checked }))}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.cancelButton} onClick={fecharEditor} disabled={salvando}>
                                Cancelar
                            </button>

                            <button type="submit" className={styles.saveButton} disabled={salvando}>
                                <Save size={17} />
                                {salvando ? "Salvando..." : "Salvar card"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {cardExcluir && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmModal}>
                        <div className={styles.confirmIcon}>
                            <Trash2 size={28} />
                        </div>

                        <h2>Excluir card?</h2>
                        <p>
                            O card <strong>{cardExcluir.title}</strong> será removido do site. Esta ação não poderá ser desfeita.
                        </p>

                        <div className={styles.confirmActions}>
                            <button type="button" onClick={() => setCardExcluir(null)} disabled={excluindo}>
                                Cancelar
                            </button>

                            <button type="button" className={styles.confirmDelete} onClick={excluirCard} disabled={excluindo}>
                                <Trash2 size={16} />
                                {excluindo ? "Excluindo..." : "Excluir card"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {aviso && (
                <div className={styles.modalOverlay} onMouseDown={(event) => event.target === event.currentTarget && setAviso(null)}>
                    <div className={styles.noticeModal}>
                        <button type="button" className={styles.noticeClose} onClick={() => setAviso(null)}>
                            <X size={18} />
                        </button>

                        <div className={aviso.tipo === "sucesso" ? styles.noticeSuccess : styles.noticeError}>
                            {aviso.tipo === "sucesso" ? <CheckCircle2 size={32} /> : <CircleAlert size={32} />}
                        </div>

                        <h2>{aviso.titulo}</h2>
                        <p>{aviso.mensagem}</p>

                        <button type="button" className={styles.noticeButton} onClick={() => setAviso(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}