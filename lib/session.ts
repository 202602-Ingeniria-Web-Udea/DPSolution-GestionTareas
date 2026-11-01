import 'server-only';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'session_token';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 3; // 3 días

export type SessionUser = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
};

/**
 * Crea una sesión en la base de datos y la guarda en una cookie httpOnly.
 * httpOnly evita que JS en el navegador lea el token (protege contra XSS).
 */
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Lee la sesión actual desde la cookie y la valida contra la base de datos.
 * Esta es la verificación "de verdad" (a diferencia del middleware, que solo
 * revisa si la cookie existe, sin tocar la base de datos).
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.enabled) {
    return null;
  }

  const { user } = session;
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
