// src/app/api/alunos/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";

import { apiRequirePermission } from "@/lib/api-auth";
import { audit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

const alunoSchema = z.object({
  registration: z.string().min(1, "Matrícula obrigatória."),
  name: z.string().min(2, "Nome inválido."),
  email: z.string().email("E-mail inválido.").nullable().optional(),
  phone: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  belt: z.enum([
    "WHITE",
    "BLUE",
    "PURPLE",
    "BROWN",
    "BLACK",
    "RED_BLACK",
    "RED_WHITE",
    "RED",
  ]),
  stripes: z.number().int().min(0).max(10),
  weightKg: z.number().positive().nullable().optional(),
  monthlyFee: z.number().min(0),
});

export async function GET() {
  const auth = await apiRequirePermission("students.view");

  if ("error" in auth) {
    return auth.error;
  }

  const alunos = await prisma.student.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(
    alunos.map((aluno) => ({
      ...aluno,
      weightKg: aluno.weightKg ? Number(aluno.weightKg) : null,
      monthlyFee: Number(aluno.monthlyFee),
    })),
  );
}

export async function POST(request: Request) {
  const auth = await apiRequirePermission("students.create");

  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json();
  const parsed = alunoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos.",
        details: parsed.error.flatten(),
      },
      {
        status: 400,
      },
    );
  }

  try {
    const aluno = await prisma.student.create({
      data: {
        ...parsed.data,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        photoUrl: parsed.data.photoUrl || null,
        weightKg: parsed.data.weightKg ?? null,
      },
    });

    await audit(
      auth.user.id,
      "CREATE",
      "Student",
      aluno.id,
    );

    return NextResponse.json({
      ...aluno,
      weightKg: aluno.weightKg ? Number(aluno.weightKg) : null,
      monthlyFee: Number(aluno.monthlyFee),
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);

    return NextResponse.json(
      {
        error: "Não foi possível cadastrar o aluno.",
      },
      {
        status: 500,
      },
    );
  }
}