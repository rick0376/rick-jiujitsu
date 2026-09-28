// src/components/auth/LoginForm/LoginForm.tsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Eye,
  EyeOff,
  GraduationCap,
  Settings,
  Users,
} from "lucide-react";

import styles from "./styles.module.scss";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(
        data.error ||
        "Não foi possível entrar no sistema.",
      );

      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      className={styles.card}
      onSubmit={submit}
    >
      <div className={styles.logoArea}>
        <Image
          src="/images/logo/logo.png"
          alt="Mandiok Jiu-Jitsu"
          width={150}
          height={150}
          priority
          className={styles.logo}
        />
      </div>

      <div className={styles.heading}>
        <span>SISTEMA DE GESTÃO</span>

        <p>
          Acesso para alunos, professores
          <br />
          e administração.
        </p>
      </div>

      <div className={styles.fields}>
        <label>
          <span>E-mail</span>

          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Digite seu e-mail"
          />
        </label>

        <label>
          <span>Senha</span>

          <div className={styles.passwordField}>
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              required
              autoComplete="current-password"
              placeholder="Digite sua senha"
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
              title={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </label>
      </div>

      <div className={styles.options}>
        <label className={styles.remember}>
          <input type="checkbox" />

          <span>Lembrar de mim</span>
        </label>

        <button
          type="button"
          className={styles.forgot}
        >
          Esqueci minha senha
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <button
        className={styles.submit}
        disabled={loading}
      >
        {loading
          ? "Entrando..."
          : "Entrar"}
      </button>

      <div className={styles.divider}>
        <span />
        <small>ou</small>
        <span />
      </div>

      <div className={styles.accessTypes}>
        <div className={styles.accessCard}>
          <GraduationCap size={23} />

          <strong>Aluno</strong>

          <span>Área do aluno</span>
        </div>

        <div className={styles.accessCard}>
          <Users size={23} />

          <strong>Professor</strong>

          <span>Gestão de treinos</span>
        </div>

        <div className={styles.accessCard}>
          <Settings size={23} />

          <strong>Administração</strong>

          <span>Gestão completa</span>
        </div>
      </div>
    </form>
  );
}