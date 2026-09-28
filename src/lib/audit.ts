import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function audit(userId: string | undefined, action: string, entity: string, entityId?: string, metadata?: unknown) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata: metadata as any,
      ip
    }
  });
}
