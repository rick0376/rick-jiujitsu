// src/app/layout.tsx

import type {
  Metadata,
  Viewport,
} from "next";
import { cache } from "react";

import RegisterSW from "@/components/pwa/RegisterSW/RegisterSW";
import { prisma } from "@/lib/prisma";

import "./globals.scss";

const carregarConfiguracoes =
  cache(async () => {
    const configuracoes =
      await prisma.siteSetting.findMany({
        where: {
          key: {
            in: [
              "site.name",
              "site.shortName",
              "site.description",
              "site.icon192Url",
              "site.icon512Url",
              "site.faviconUrl",
              "site.color.dark",
            ],
          },
        },
      });

    return Object.fromEntries(
      configuracoes.map(
        (item) => [
          item.key,
          item.value,
        ],
      ),
    ) as Record<string, string>;
  });

export async function generateMetadata(): Promise<Metadata> {
  const configuracoes =
    await carregarConfiguracoes();

  const nome =
    configuracoes["site.name"] ||
    "Rick Pereira Jiu-Jitsu";

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

  const favicon =
    configuracoes[
    "site.faviconUrl"
    ] ||
    icon192;

  return {
    title: {
      default: nome,
      template: `%s | ${nome}`,
    },

    description: descricao,

    manifest:
      "/manifest.webmanifest",

    icons: {
      icon: [
        {
          url: favicon,
        },
        {
          url: icon192,
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: icon512,
          sizes: "512x512",
          type: "image/png",
        },
      ],

      shortcut: [
        {
          url: favicon,
        },
      ],

      apple: [
        {
          url: icon192,
        },
      ],
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const configuracoes =
    await carregarConfiguracoes();

  return {
    themeColor:
      configuracoes[
      "site.color.dark"
      ] || "#111216",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        <RegisterSW />
      </body>
    </html>
  );
}