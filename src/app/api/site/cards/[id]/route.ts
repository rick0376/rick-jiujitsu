// src/app/api/site/cards/[id]/route.ts

import { Prisma, SiteCardSection } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Context = {
    params: Promise<{ id: string }>;
};

function normalizarSecao(valor: unknown): SiteCardSection | null {
    const secao = String(valor || "").trim().toUpperCase();

    if (Object.values(SiteCardSection).includes(secao as SiteCardSection)) {
        return secao as SiteCardSection;
    }

    return null;
}

function normalizarBullets(valor: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    if (valor === null || valor === undefined) return Prisma.JsonNull;

    if (Array.isArray(valor)) {
        return valor.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof valor === "string") {
        const texto = valor.trim();

        if (!texto) return Prisma.JsonNull;

        try {
            const json = JSON.parse(texto);

            if (Array.isArray(json)) {
                return json.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            // Se não for JSON, trata como texto linha por linha.
        }

        return texto.split("\n").map((item) => item.trim()).filter(Boolean);
    }

    return Prisma.JsonNull;
}

export async function PUT(request: NextRequest, context: Context) {
    try {
        await requirePermission("site.manage");

        const { id } = await context.params;
        const body = await request.json();

        const cardAtual = await prisma.siteCard.findUnique({ where: { id } });

        if (!cardAtual) {
            return NextResponse.json({ message: "Card não encontrado." }, { status: 404 });
        }

        const title = body.title !== undefined ? String(body.title).trim() : cardAtual.title;
        const slug = body.slug !== undefined ? String(body.slug).trim() : cardAtual.slug;

        if (!title || !slug) {
            return NextResponse.json({ message: "Título e slug são obrigatórios." }, { status: 400 });
        }

        let section = cardAtual.section;

        if (body.section !== undefined) {
            const secaoNormalizada = normalizarSecao(body.section);

            if (!secaoNormalizada) {
                return NextResponse.json({ message: "A seção informada para o card é inválida." }, { status: 400 });
            }

            section = secaoNormalizada;
        }

        if (slug !== cardAtual.slug) {
            const slugExistente = await prisma.siteCard.findUnique({ where: { slug } });

            if (slugExistente && slugExistente.id !== id) {
                return NextResponse.json({ message: "Já existe outro card com este slug." }, { status: 409 });
            }
        }

        const card = await prisma.siteCard.update({
            where: { id },
            data: {
                title,
                slug,
                section,
                description:
                    body.description !== undefined
                        ? body.description
                            ? String(body.description).trim()
                            : null
                        : cardAtual.description,
                ...(body.bullets !== undefined && {
                    bullets: normalizarBullets(body.bullets),
                }),
                linkLabel:
                    body.linkLabel !== undefined
                        ? body.linkLabel
                            ? String(body.linkLabel).trim()
                            : null
                        : cardAtual.linkLabel,
                linkHref:
                    body.linkHref !== undefined
                        ? body.linkHref
                            ? String(body.linkHref).trim()
                            : null
                        : cardAtual.linkHref,
                imageUrl:
                    body.imageUrl !== undefined
                        ? body.imageUrl
                            ? String(body.imageUrl).trim()
                            : null
                        : cardAtual.imageUrl,
                imagePublicId:
                    body.imagePublicId !== undefined
                        ? body.imagePublicId
                            ? String(body.imagePublicId).trim()
                            : null
                        : cardAtual.imagePublicId,
                active: body.active !== undefined ? Boolean(body.active) : cardAtual.active,
                sortOrder:
                    body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))
                        ? Number(body.sortOrder)
                        : cardAtual.sortOrder,
            },
        });

        return NextResponse.json({ message: "Card atualizado com sucesso.", card });
    } catch (error) {
        console.error("Erro ao atualizar card do site:", error);
        return NextResponse.json({ message: "Não foi possível atualizar o card." }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, context: Context) {
    try {
        await requirePermission("site.manage");

        const { id } = await context.params;

        const card = await prisma.siteCard.findUnique({ where: { id } });

        if (!card) {
            return NextResponse.json({ message: "Card não encontrado." }, { status: 404 });
        }

        await prisma.siteCard.delete({ where: { id } });

        return NextResponse.json({ message: "Card excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir card do site:", error);
        return NextResponse.json({ message: "Não foi possível excluir o card." }, { status: 500 });
    }
}