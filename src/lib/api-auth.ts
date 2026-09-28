import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function apiRequirePermission(code?: string) {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) };
  if (code && !user.permissions.includes(code)) {
    return { error: NextResponse.json({ error: "Sem permissão" }, { status: 403 }) };
  }
  return { user };
}
