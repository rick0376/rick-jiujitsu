// src/app/(protected)/dashboard/site/page.tsx

import CardsSite from "@/components/site/CardsSite/CardsSite";
import ConfiguracoesSite from "@/components/site/ConfiguracoesSite/ConfiguracoesSite";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracoesSitePage() {
    const usuario = await requirePermission("site.view");
    const podeEditar = usuario.permissions.includes("site.manage");

    const [configuracoesBanco, cardsBanco] = await Promise.all([
        prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
        prisma.siteCard.findMany({ orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);

    const configuracoes = Object.fromEntries(configuracoesBanco.map((item) => [item.key, item.value]));

    const cards = cardsBanco.map((card) => ({
        id: card.id,
        slug: card.slug,
        section: card.section,
        title: card.title,
        description: card.description,
        bullets: card.bullets,
        linkLabel: card.linkLabel,
        linkHref: card.linkHref,
        imageUrl: card.imageUrl,
        imagePublicId: card.imagePublicId,
        active: card.active,
        sortOrder: card.sortOrder,
    }));

    return (
        <div>
            <PageHeader
                title="Configurações do Site"
                subtitle="Gerencie a identidade, conteúdo, imagens, cards e demais informações exibidas na página pública."
            />

            <ConfiguracoesSite configuracoes={configuracoes} podeEditar={podeEditar} />

            <CardsSite cardsIniciais={cards} podeEditar={podeEditar} />
        </div>
    );
}