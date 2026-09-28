import type { Metadata, Viewport } from "next";
import RegisterSW from "@/components/pwa/RegisterSW/RegisterSW";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Mandiok Jiu-Jitsu",
  description: "Gestão completa da equipe Mandiok Jiu-Jitsu",
  manifest: "/manifest.webmanifest",
  icons: { icon: ["/icons/icon-192.png", "/icons/icon-512.png"], apple: ["/icons/icon-192.png"] }
};
export const viewport: Viewport = { themeColor: "#111216" };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}<RegisterSW/></body></html>;
}
