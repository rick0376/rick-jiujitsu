// src/app/api/alunos/[id]/route.ts

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

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: RouteParams,
) {
  const auth = await apiRequirePermission("students.edit");

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await params;

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
    const aluno = await prisma.student.update({
      where: {
        id,
      },
      data: {
        registration: parsed.data.registration,
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        photoUrl: parsed.data.photoUrl || null,
        belt: parsed.data.belt,
        stripes: parsed.data.stripes,
        weightKg: parsed.data.weightKg ?? null,
        monthlyFee: parsed.data.monthlyFee,
      },
    });

    await audit(
      auth.user.id,
      "UPDATE",
      "Student",
      id,
    );

    return NextResponse.json({
      ...aluno,
      weightKg: aluno.weightKg ? Number(aluno.weightKg) : null,
      monthlyFee: Number(aluno.monthlyFee),
    });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);

    return NextResponse.json(
      {
        error: "Não foi possível atualizar o aluno.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams,
) {
  const auth = await apiRequirePermission("students.delete");

  if ("error" in auth) {
    return auth.error;
  }

  const { id } = await params;

  try {
    await prisma.student.delete({
      where: {
        id,
      },
    });

    await audit(
      auth.user.id,
      "DELETE",
      "Student",
      id,
    );

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);

    return NextResponse.json(
      {
        error: "Não foi possível excluir o aluno.",
      },
      {
        status: 500,
      },
    );
  }
}