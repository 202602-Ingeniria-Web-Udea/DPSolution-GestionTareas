import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const proyectos = await prisma.proyecto.findMany({
      where: { deleted: false },
      include: { creador: { select: { name: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ proyectos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    return NextResponse.json({ error: 'No se pudieron obtener los Maestros' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  // Solo ADMIN puede crear Maestros, según el enunciado — se valida aquí
  // además de ocultar el botón en el front.
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { nombre, saldoInicial } = await request.json();

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
    return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
  }
  const saldo = Number(saldoInicial);
  if (!Number.isFinite(saldo) || saldo < 0) {
    return NextResponse.json({ error: 'Saldo inicial inválido' }, { status: 400 });
  }

  try {
    const proyecto = await prisma.proyecto.create({
      data: { nombre: nombre.trim(), saldo, creadorId: session.id },
      include: { creador: { select: { name: true, lastName: true } } },
    });
    return NextResponse.json({ proyecto }, { status: 201 });
  } catch (error) {
    console.error('Error creating proyecto:', error);
    return NextResponse.json({ error: 'No se pudo crear el Maestro' }, { status: 500 });
  }
}
