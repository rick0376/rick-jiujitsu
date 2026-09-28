import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mandiok Jiu-Jitsu",
    short_name: "Mandiok",
    description: "Gestão completa da equipe Mandiok Jiu-Jitsu",
    start_url: "/",
    display: "standalone",
    background_color: "#111216",
    theme_color: "#111216",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
