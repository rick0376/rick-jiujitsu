// src/app/api/site/configuracoes/route.ts

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

const chavesPermitidas = [
    "site.name",
    "site.shortName",
    "site.initials",
    "site.slogan",
    "site.description",

    "site.logoUrl",
    "site.logoPublicId",

    "site.icon192Url",
    "site.icon192PublicId",

    "site.icon512Url",
    "site.icon512PublicId",

    "site.faviconUrl",
    "site.faviconPublicId",

    "site.color.primary",
    "site.color.secondary",
    "site.color.accent",
    "site.color.dark",
    "site.color.light",

    "nav.home.label",
    "nav.home.href",
    "nav.team.label",
    "nav.team.href",
    "nav.system.label",
    "nav.system.href",
    "nav.events.label",
    "nav.events.href",
    "nav.timer.label",
    "nav.timer.href",
    "nav.contact.label",
    "nav.contact.href",
    "nav.login.label",
    "nav.login.href",
    "nav.cta.label",
    "nav.cta.href",

    "home.hero.sideTextLeft",
    "home.hero.sideTextRight",
    "home.hero.subtitle",
    "home.hero.description",
    "home.hero.primaryButtonLabel",
    "home.hero.primaryButtonHref",
    "home.hero.secondaryButtonLabel",
    "home.hero.secondaryButtonHref",
    "home.hero.imageUrl",
    "home.hero.imagePublicId",

    "home.location.title",
    "home.location.subtitle",
    "home.location.name",
    "home.location.address",
    "home.location.city",
    "home.location.zipCode",
    "home.location.lat",
    "home.location.lng",
    "home.location.mapButtonLabel",
    "home.location.mapUrl",
    "home.location.imageUrl",
    "home.location.imagePublicId",

    "home.schedule",

    "home.contact.title",
    "home.contact.subtitle",
    "home.contact.whatsapp",
    "home.contact.whatsappHint",
    "home.contact.instagram",
    "home.contact.instagramHint",
    "home.contact.phone",
    "home.contact.email",

    "home.contact.form.namePlaceholder",
    "home.contact.form.emailPlaceholder",
    "home.contact.form.messagePlaceholder",
    "home.contact.form.submitLabel",

    "footer.values",
    "footer.slogan",
    "footer.description",
    "footer.copyright",
    "footer.links",

    "footer.instagramUrl",
    "footer.youtubeUrl",
    "footer.facebookUrl",
] as const;

const schema = z.record(
    z.string(),
    z.string(),
);

export async function GET() {
    const auth =
        await apiRequirePermission(
            "site.view",
        );

    if ("error" in auth) {
        return auth.error;
    }

    try {
        const configuracoes =
            await prisma.siteSetting.findMany({
                where: {
                    key: {
                        in: [
                            ...chavesPermitidas,
                        ],
                    },
                },
                orderBy: {
                    key: "asc",
                },
            });

        return NextResponse.json(
            Object.fromEntries(
                configuracoes.map(
                    (item) => [
                        item.key,
                        item.value,
                    ],
                ),
            ),
        );
    } catch (error) {
        console.error(
            "Erro ao buscar configurações do site:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível carregar as configurações do site.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function PUT(
    request: Request,
) {
    const auth =
        await apiRequirePermission(
            "site.manage",
        );

    if ("error" in auth) {
        return auth.error;
    }

    const body = await request.json();

    const parsed =
        schema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            {
                error:
                    "Dados das configurações inválidos.",
            },
            {
                status: 400,
            },
        );
    }

    try {
        const dados = parsed.data;

        const chavesRecebidas =
            chavesPermitidas.filter(
                (key) =>
                    Object.prototype.hasOwnProperty.call(
                        dados,
                        key,
                    ),
            );

        await Promise.all(
            chavesRecebidas.map(
                (key) =>
                    prisma.siteSetting.upsert(
                        {
                            where: {
                                key,
                            },
                            update: {
                                value:
                                    dados[
                                    key
                                    ],
                            },
                            create: {
                                key,
                                value:
                                    dados[
                                    key
                                    ],
                            },
                        },
                    ),
            ),
        );

        await audit(
            auth.user.id,
            "UPDATE",
            "SiteSettings",
            "public-site",
        );

        revalidatePath("/");
        revalidatePath(
            "/dashboard/site",
        );

        revalidatePath(
            "/manifest.webmanifest",
        );

        return NextResponse.json({
            ok: true,
            message:
                "Configurações salvas com sucesso.",
        });
    } catch (error) {
        console.error(
            "Erro ao salvar configurações do site:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Não foi possível salvar as configurações do site.",
            },
            {
                status: 500,
            },
        );
    }
}