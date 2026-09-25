import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "default_super_secret_jwt_key_32chars_long!";
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR";
}

export async function signSessionToken(payload: SessionUser): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as "STUDENT" | "INSTRUCTOR",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("eduflow_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
