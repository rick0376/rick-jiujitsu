// src/components/alunos/AlunosClient/AlunosClient.tsx

"use client";

import { useState } from "react";

import styles from "./styles.module.scss";

type Aluno = {
  id: string;
  registration: string;
  name: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  belt: string;
  stripes: number;
  status: string;
  weightKg: number | null;
  monthlyFee: number;
  birthDate: string | null;
  joinedAt: string;
};

type Props = {
  alunos: Aluno[];
  podeCadastrar: boolean;
  podeEditar: boolean;
};

const faixas: Record<string, string> = {
  WHITE: "Branca",
  BLUE: "Azul",
  PURPLE: "Roxa",
  BROWN: "Marrom",
  BLACK: "Preta",
  RED_BLACK: "Vermelha e Preta",
  RED_WHITE: "Vermelha e Branca",
  RED: "Vermelha",
};

const statusAluno: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PAUSED: "Pausado",
  CANCELED: "Cancelado",
};

const opcoesFaixa = [
  "WHITE",
  "BLUE",
  "PURPLE",
  "BROWN",
  "BLACK",
  "RED_BLACK",
  "RED_WHITE",
  "RED",
];

export default function AlunosClient({
  alunos: alunosIniciais,
  podeCadastrar,
  podeEditar,
}: Props) {
  const [alunos, setAlunos] = useState(alunosIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Aluno | null>(null);
  const [salvando, setSalvando] = useState(false);

  function abrirCadastro() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(aluno: Aluno) {
    setEditando(aluno);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
  }

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);

    try {
      const formulario = new FormData(event.currentTarget);

      let photoUrl = editando?.photoUrl || "";

      const arquivo = formulario.get("photo");

      if (arquivo instanceof File && arquivo.size > 0) {
        const upload = new FormData();

        upload.set("file", arquivo);
        upload.set("folder", "alunos");

        const respostaUpload = await fetch("/api/uploads/image", {
          method: "POST",
          body: upload,
        });

        if (!respostaUpload.ok) {
          const erroUpload = await respostaUpload.json().catch(() => null);

          throw new Error(
            erroUpload?.error || "Erro ao enviar a foto do aluno.",
          );
        }

        const dadosUpload = await respostaUpload.json();

        photoUrl = dadosUpload.secure_url;
      }

      const dados = {
        registration: String(formulario.get("registration") || ""),
        name: String(formulario.get("name") || ""),
        email: String(formulario.get("email") || "") || null,
        phone: String(formulario.get("phone") || "") || null,
        belt: String(formulario.get("belt") || "WHITE"),
        stripes: Number(formulario.get("stripes") || 0),
        weightKg: formulario.get("weightKg")
          ? Number(formulario.get("weightKg"))
          : null,
        monthlyFee: Number(formulario.get("monthlyFee") || 0),
        photoUrl,
      };

      const rota = editando
        ? `/api/alunos/${editando.id}`
        : "/api/alunos";

      const resposta = await fetch(rota, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const alunoSalvo = await resposta.json();

      if (!resposta.ok) {
        throw new Error(alunoSalvo.error || "Erro ao salvar aluno.");
      }

      setAlunos((listaAtual) => {
        if (editando) {
          return listaAtual.map((aluno) =>
            aluno.id === alunoSalvo.id ? alunoSalvo : aluno,
          );
        }

        return [...listaAtual, alunoSalvo].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });

      fecharModal();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar aluno.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      {podeCadastrar && (
        <button
          type="button"
          className={styles.add}
          onClick={abrirCadastro}
        >
          + Novo aluno
        </button>
      )}

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Faixa</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>
                  <div className={styles.person}>
                    {aluno.photoUrl ? (
                      <img
                        src={aluno.photoUrl}
                        alt={aluno.name}
                      />
                    ) : (
                      <span>
                        {aluno.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}

                    <div>
                      <b>{aluno.name}</b>
                      <small>{aluno.registration}</small>
                    </div>
                  </div>
                </td>

                <td>
                  {faixas[aluno.belt] || aluno.belt}
                  {" • "}
                  {aluno.stripes}{" "}
                  {aluno.stripes === 1 ? "grau" : "graus"}
                </td>

                <td>
                  {aluno.phone || aluno.email || "-"}
                </td>

                <td>
                  <span
                    className={`${styles.status} ${styles[
                      aluno.status.toLowerCase()
                      ] || ""
                      }`}
                  >
                    {statusAluno[aluno.status] || aluno.status}
                  </span>
                </td>

                <td>
                  {podeEditar && (
                    <button
                      type="button"
                      className={styles.edit}
                      onClick={() => abrirEdicao(aluno)}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {!alunos.length && (
              <tr>
                <td
                  colSpan={5}
                  className={styles.empty}
                >
                  Nenhum aluno cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div
          className={styles.modal}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModal();
            }
          }}
        >
          <form
            onSubmit={salvar}
            className={styles.form}
          >
            <div className={styles.formHeader}>
              <div>
                <h2>
                  {editando
                    ? "Editar aluno"
                    : "Novo aluno"}
                </h2>

                <p>
                  Preencha os dados principais do aluno.
                </p>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={fecharModal}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className={styles.fields}>
              <label>
                Matrícula

                <input
                  name="registration"
                  required
                  defaultValue={
                    editando?.registration || ""
                  }
                />
              </label>

              <label>
                Nome

                <input
                  name="name"
                  required
                  defaultValue={
                    editando?.name || ""
                  }
                />
              </label>

              <label>
                E-mail

                <input
                  name="email"
                  type="email"
                  defaultValue={
                    editando?.email || ""
                  }
                />
              </label>

              <label>
                Telefone

                <input
                  name="phone"
                  defaultValue={
                    editando?.phone || ""
                  }
                />
              </label>

              <label>
                Faixa

                <select
                  name="belt"
                  defaultValue={
                    editando?.belt || "WHITE"
                  }
                >
                  {opcoesFaixa.map((faixa) => (
                    <option
                      key={faixa}
                      value={faixa}
                    >
                      {faixas[faixa]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Graus

                <input
                  name="stripes"
                  type="number"
                  min="0"
                  max="10"
                  defaultValue={
                    editando?.stripes ?? 0
                  }
                />
              </label>

              <label>
                Peso (kg)

                <input
                  name="weightKg"
                  type="number"
                  min="0"
                  step="0.1"
                  defaultValue={
                    editando?.weightKg ?? ""
                  }
                />
              </label>

              <label>
                Mensalidade

                <input
                  name="monthlyFee"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    editando?.monthlyFee ?? 0
                  }
                />
              </label>

              <label className={styles.full}>
                Foto

                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                />

                {editando?.photoUrl && (
                  <small className={styles.photoInfo}>
                    O aluno já possui uma foto cadastrada.
                    Selecione outra somente para substituir.
                  </small>
                )}
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : "Salvar aluno"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}