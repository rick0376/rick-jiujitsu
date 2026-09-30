// src/components/layout/Sidebar/Sidebar.tsx

"use client";

import {
    Award,
    CalendarCheck,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Globe2,
    LayoutDashboard,
    LogOut,
    Settings,
    ShieldCheck,
    TimerReset,
    Trophy,
    Users,
    WalletCards,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { SessionUser } from "@/lib/auth";

import styles from "./styles.module.scss";

type Props = {
    user: SessionUser;
    open: boolean;
    onClose: () => void;
};

const nav = [
    ["dashboard.view", "/dashboard", "Dashboard", LayoutDashboard],
    ["students.view", "/alunos", "Alunos", Users],
    ["attendance.view", "/presencas", "Presenças", CalendarCheck],
    ["graduations.view", "/graduacoes", "Graduações", Award],
    ["evaluations.view", "/avaliacoes", "Avaliações", ClipboardList],
    ["finance.view", "/financeiro", "Financeiro", WalletCards],
    ["competitions.view", "/competicoes", "Competições", Trophy],
    ["events.view", "/eventos", "Eventos", CalendarDays],
    ["timer.use", "/cronometro", "Cronômetro", TimerReset],
    ["users.view", "/usuarios", "Usuários", ShieldCheck],
] as const;

export default function Sidebar({ user, open, onClose }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const configuracoesAtiva =
        pathname === "/configuracoes" ||
        pathname.startsWith("/configuracoes/") ||
        pathname === "/dashboard/site" ||
        pathname.startsWith("/dashboard/site/");

    const [configuracoesOpen, setConfiguracoesOpen] = useState(configuracoesAtiva);

    useEffect(() => {
        if (configuracoesAtiva) setConfiguracoesOpen(true);
    }, [configuracoesAtiva]);

    const podeVerConfiguracoes =
        user.permissions.includes("settings.manage") ||
        user.permissions.includes("site.view");

    const itensPermitidos = useMemo(
        () => nav.filter(([permission]) => user.permissions.includes(permission)),
        [user.permissions],
    );

    function rotaAtiva(href: string) {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname === href || pathname.startsWith(`${href}/`);
    }

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    return (
        <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
            <div className={styles.brand}>
                <span className={styles.brandMark}>RK</span>

                <div className={styles.brandText}>
                    <b>Rick Pereira</b>
                    <small>JIU-JITSU</small>
                </div>

                <button
                    type="button"
                    className={styles.close}
                    onClick={onClose}
                    aria-label="Fechar menu"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className={styles.nav}>
                {itensPermitidos.map(([_permission, href, label, Icon]) => {
                    const ativo = rotaAtiva(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={`${styles.navItem} ${ativo ? styles.active : ""}`}
                        >
                            <span className={styles.navIcon}>
                                <Icon size={18} />
                            </span>

                            <span>{label}</span>
                        </Link>
                    );
                })}

                {podeVerConfiguracoes && (
                    <div className={styles.navGroup}>
                        <button
                            type="button"
                            className={`${styles.navGroupButton} ${configuracoesAtiva ? styles.navGroupActive : ""
                                }`}
                            onClick={() => setConfiguracoesOpen((atual) => !atual)}
                            aria-expanded={configuracoesOpen}
                        >
                            <span className={styles.navGroupButtonLeft}>
                                <span className={styles.navIcon}>
                                    <Settings size={18} />
                                </span>

                                <span>Configurações</span>
                            </span>

                            {configuracoesOpen ? (
                                <ChevronDown size={16} className={styles.chevron} />
                            ) : (
                                <ChevronRight size={16} className={styles.chevron} />
                            )}
                        </button>

                        {configuracoesOpen && (
                            <div className={styles.submenu}>
                                {user.permissions.includes("settings.manage") && (
                                    <Link
                                        href="/configuracoes"
                                        onClick={onClose}
                                        className={`${styles.submenuItem} ${pathname === "/configuracoes" ||
                                                pathname.startsWith("/configuracoes/")
                                                ? styles.submenuActive
                                                : ""
                                            }`}
                                    >
                                        <span className={styles.submenuIcon}>
                                            <Settings size={15} />
                                        </span>

                                        <span>Sistema</span>
                                    </Link>
                                )}

                                {user.permissions.includes("site.view") && (
                                    <Link
                                        href="/dashboard/site"
                                        onClick={onClose}
                                        className={`${styles.submenuItem} ${pathname === "/dashboard/site" ||
                                                pathname.startsWith("/dashboard/site/")
                                                ? styles.submenuActive
                                                : ""
                                            }`}
                                    >
                                        <span className={styles.submenuIcon}>
                                            <Globe2 size={15} />
                                        </span>

                                        <span>Site público</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </nav>

            <button type="button" className={styles.logout} onClick={logout}>
                <LogOut size={18} />
                <span>Sair</span>
            </button>
        </aside>
    );
}