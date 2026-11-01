import 'server-only';
import { redirect } from 'next/navigation';
import { getSession, type SessionUser } from '@/lib/session';

/**
 * Para usar en Server Components de páginas protegidas. Si no hay sesión
 * válida, redirige a /login. Esta es la autorización real del sistema — el
 * middleware solo hace una verificación optimista para mejorar la UX.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect('/login');
  return user;
}

/** Igual que requireUser, pero además exige rol ADMIN (ej. página de Usuarios). */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/home');
  return user;
}
