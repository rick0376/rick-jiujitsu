// src/components/layout/AppShell/AppShell.tsx

"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar/Sidebar";
import type { SessionUser } from "@/lib/auth";

import styles from "./styles.module.scss";

type Props = {
  user: SessionUser;
  children: React.ReactNode;
};

export default function AppShell({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.content}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.menu}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className={styles.user}>
            <b>{user.name}</b>
            <span>{user.email}</span>
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        />
      )}
    </div>
  );
}