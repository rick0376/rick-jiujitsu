import { NextResponse } from "next/server";
import { apiRequirePermission } from "@/lib/api-auth";
import { uploadBuffer } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const auth = await apiRequirePermission();
  if ("error" in auth) return auth.error;

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "general");

  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Envie uma imagem." }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Imagem maior que 8MB." }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const result = await uploadBuffer(Buffer.from(arrayBuffer), folder);
  return NextResponse.json(result);
}
