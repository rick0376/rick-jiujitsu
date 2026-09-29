// src/app/(protected)/dashboard/site/page.tsx

import ConfiguracoesSite from "@/components/site/ConfiguracoesSite/ConfiguracoesSite";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracoesSitePage() {
    const usuario = await requirePermission("site.view");

    const configuracoesBanco = await prisma.siteSetting.findMany({
        orderBy: {
            key: "asc",
        },
    });

    const configuracoes = Object.fromEntries(
        configuracoesBanco.map((item) => [
            item.key,
            item.value,
        ]),
    );

    return (
        <div>
            <PageHeader
                title="Configurações do Site"
                subtitle="Gerencie a identidade, cabeçalho, Hero, localização, contato e rodapé da página pública."
            />

            <ConfiguracoesSite
                configuracoes={configuracoes}
                podeEditar={usuario.permissions.includes("site.manage")}
            />
        </div>
    );
}