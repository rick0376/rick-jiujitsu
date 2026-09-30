// src/components/layout/AppShell/AppShell.tsx

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
  Menu,
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
import { useMemo, useState } from "react";

import type { SessionUser } from "@/lib/auth";

import styles from "./styles.module.scss";

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

export default function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const configuracoesAtiva =
    pathname === "/configuracoes" ||
    pathname.startsWith("/configuracoes/") ||
    pathname === "/dashboard/site" ||
    pathname.startsWith("/dashboard/site/");

  const [configuracoesOpen, setConfiguracoesOpen] =
    useState(configuracoesAtiva);

  const podeVerConfiguracoes =
    user.permissions.includes("settings.manage") ||
    user.permissions.includes("site.view");

  const itensPermitidos = useMemo(
    () =>
      nav.filter(([permission]) =>
        user.permissions.includes(permission),
      ),
    [user.permissions],
  );

  function rotaAtiva(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  function fecharMobile() {
    setOpen(false);
  }

  return (
    <div className={styles.shell}>
      <aside
        className={`${styles.sidebar} ${open ? styles.open : ""
          }`}
      >
        <div className={styles.brand}>
          <span>RK</span>

          <div>
            <b>Rick Pereira</b>
            <small>JIU-JITSU</small>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav>
          {itensPermitidos.map(
            ([
              _permission,
              href,
              label,
              Icon,
            ]) => {
              const ativo =
                rotaAtiva(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={fecharMobile}
                  className={
                    ativo
                      ? styles.active
                      : undefined
                  }
                >
                  <Icon size={18} />

                  <span>{label}</span>
                </Link>
              );
            },
          )}

          {podeVerConfiguracoes && (
            <div
              className={
                styles.navGroup
              }
            >
              <button
                type="button"
                className={`${styles.navGroupButton} ${configuracoesAtiva
                    ? styles.navGroupActive
                    : ""
                  }`}
                onClick={() =>
                  setConfiguracoesOpen(
                    (atual) => !atual,
                  )
                }
              >
                <span
                  className={
                    styles.navGroupButtonLeft
                  }
                >
                  <Settings size={18} />

                  <span>
                    Configurações
                  </span>
                </span>

                {configuracoesOpen ? (
                  <ChevronDown
                    size={16}
                    className={
                      styles.chevron
                    }
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={
                      styles.chevron
                    }
                  />
                )}
              </button>

              {configuracoesOpen && (
                <div
                  className={
                    styles.submenu
                  }
                >
                  {user.permissions.includes(
                    "settings.manage",
                  ) && (
                      <Link
                        href="/configuracoes"
                        onClick={fecharMobile}
                        className={
                          pathname ===
                            "/configuracoes" ||
                            pathname.startsWith(
                              "/configuracoes/",
                            )
                            ? styles.submenuActive
                            : undefined
                        }
                      >
                        <Settings
                          size={16}
                        />

                        <span>
                          Sistema
                        </span>
                      </Link>
                    )}

                  {user.permissions.includes(
                    "site.view",
                  ) && (
                      <Link
                        href="/dashboard/site"
                        onClick={fecharMobile}
                        className={
                          pathname ===
                            "/dashboard/site" ||
                            pathname.startsWith(
                              "/dashboard/site/",
                            )
                            ? styles.submenuActive
                            : undefined
                        }
                      >
                        <Globe2
                          size={16}
                        />

                        <span>
                          Site público
                        </span>
                      </Link>
                    )}
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          className={styles.logout}
          type="button"
          onClick={logout}
        >
          <LogOut size={18} />

          <span>Sair</span>
        </button>
      </aside>

      <div className={styles.content}>
        <header>
          <button
            className={styles.menu}
            type="button"
            onClick={() =>
              setOpen(true)
            }
            aria-label="Abrir menu"
          >
            <Menu />
          </button>

          <div>
            <b>{user.name}</b>
            <span>{user.email}</span>
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>

      {open && (
        <button
          className={styles.backdrop}
          type="button"
          onClick={() =>
            setOpen(false)
          }
          aria-label="Fechar menu"
        />
      )}
    </div>
  );
}