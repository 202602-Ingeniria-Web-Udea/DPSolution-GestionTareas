import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'session_token';

/**
 * Next.js 16 renombró "middleware" a "proxy" (mismo propósito, corre antes
 * de renderizar la ruta). Aquí solo hacemos una verificación optimista: ¿la
 * cookie de sesión existe? Aunque esta versión ya corre en runtime Node.js
 * (antes era exclusivo de Edge), seguimos sin tocar la base de datos aquí a
 * propósito — la verificación real y autorizada (token válido, no expirado,
 * usuario habilitado, rol correcto) vive en `requireUser`/`requireAdmin`
 * dentro del layout de `(main)` y en cada ruta de API, que es donde debe
 * estar la autorización de verdad.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login');

  if (!hasSession && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/transacciones/:path*', '/maestros/:path*', '/users/:path*', '/login'],
};
