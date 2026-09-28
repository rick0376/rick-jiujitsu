// src/app/login/page.tsx

import LoginForm from "@/components/auth/LoginForm/LoginForm";

import styles from "./styles.module.scss";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.overlay} />

      <section className={styles.content}>
        <div className={styles.formArea}>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}