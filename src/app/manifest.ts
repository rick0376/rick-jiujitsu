// src/app/manifest.ts

import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const configuracoesBanco =
    await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "site.name",
            "site.shortName",
            "site.description",
            "site.icon192Url",
            "site.icon512Url",
            "site.color.dark",
          ],
        },
      },
    });

  const configuracoes =
    Object.fromEntries(
      configuracoesBanco.map(
        (item) => [
          item.key,
          item.value,
        ],
      ),
    ) as Record<string, string>;

  const nome =
    configuracoes["site.name"] ||
    "Rick Pereira Jiu-Jitsu";

  const nomeCurto =
    configuracoes[
    "site.shortName"
    ] ||
    "Rick Pereira";

  const descricao =
    configuracoes[
    "site.description"
    ] ||
    `Gestão completa da equipe ${nome}`;

  const icon192 =
    configuracoes[
    "site.icon192Url"
    ] ||
    "/icons/icon-192.png";

  const icon512 =
    configuracoes[
    "site.icon512Url"
    ] ||
    "/icons/icon-512.png";

  const corEscura =
    configuracoes[
    "site.color.dark"
    ] ||
    "#111216";

  return {
    name: nome,
    short_name: nomeCurto,
    description: descricao,

    start_url: "/",

    display: "standalone",

    background_color:
      corEscura,

    theme_color:
      corEscura,

    icons: [
      {
        src: icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}