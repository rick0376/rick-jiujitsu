import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "mandiok_session";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET não configurado.");
  return new TextEncoder().encode(value);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
};

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const userId = String(payload.userId || "");
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          include: {
            role: { include: { permissions: { include: { permission: true } } } }
          }
        },
        permissions: { include: { permission: true } }
      }
    });

    if (!user || user.status !== "ACTIVE") return null;

    const set = new Set<string>();
    for (const ur of user.roleAssignments) {
      for (const rp of ur.role.permissions) set.add(rp.permission.code);
    }
    for (const up of user.permissions) {
      if (up.allowed) set.add(up.permission.code);
      else set.delete(up.permission.code);
    }

    return { id: user.id, name: user.name, email: user.email, permissions: [...set] };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(code: string) {
  const user = await requireUser();
  if (!user.permissions.includes(code)) redirect("/sem-permissao");
  return user;
}
