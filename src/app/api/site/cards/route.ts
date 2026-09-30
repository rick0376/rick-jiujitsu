// src/app/api/site/cards/route.ts

import { Prisma, SiteCardSection } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export async function GET() {
    try {
        await requirePermission("site.view");

        const cards = await prisma.siteCard.findMany({
            orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        });

        return NextResponse.json({ cards });
    } catch (error) {
        console.error("Erro ao buscar cards do site:", error);
        return NextResponse.json({ message: "Não foi possível carregar os cards." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission("site.manage");

        const body = await request.json();
        const title = String(body.title || "").trim();
        const slug = String(body.slug || "").trim();
        const section = normalizarSecao(body.section || SiteCardSection.MAIN_FEATURE);

        if (!title || !slug) {
            return NextResponse.json({ message: "Título e slug são obrigatórios." }, { status: 400 });
        }

        if (!section) {
            return NextResponse.json({ message: "A seção informada para o card é inválida." }, { status: 400 });
        }

        const slugExistente = await prisma.siteCard.findUnique({ where: { slug } });

        if (slugExistente) {
            return NextResponse.json({ message: "Já existe um card com este slug." }, { status: 409 });
        }

        const ultimoCard = await prisma.siteCard.findFirst({
            where: { section },
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
        });

        const card = await prisma.siteCard.create({
            data: {
                title,
                slug,
                section,
                description: body.description ? String(body.description).trim() : null,
                bullets: normalizarBullets(body.bullets),
                linkLabel: body.linkLabel ? String(body.linkLabel).trim() : null,
                linkHref: body.linkHref ? String(body.linkHref).trim() : null,
                imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
                imagePublicId: body.imagePublicId ? String(body.imagePublicId).trim() : null,
                active: body.active !== false,
                sortOrder: Number.isFinite(Number(body.sortOrder))
                    ? Number(body.sortOrder)
                    : (ultimoCard?.sortOrder ?? -1) + 1,
            },
        });

        return NextResponse.json({ message: "Card criado com sucesso.", card }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar card do site:", error);
        return NextResponse.json({ message: "Não foi possível criar o card." }, { status: 500 });
    }
}