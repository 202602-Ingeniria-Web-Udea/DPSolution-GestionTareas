import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const { email, password } = data;

  if (!email || !password) {
    return NextResponse.json({ error: 'Correo y contraseña son obligatorios' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Mismo mensaje de error para usuario inexistente o contraseña incorrecta:
  // así no revelamos a un atacante si el correo existe en el sistema.
  if (!user || !user.enabled || user.deleted) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 200 }
  );
}
