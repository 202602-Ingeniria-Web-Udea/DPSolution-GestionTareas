import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const proyectoId = searchParams.get('proyectoId');
  if (!proyectoId) {
    return NextResponse.json({ error: 'proyectoId es obligatorio' }, { status: 400 });
  }

  try {
    const movimientos = await prisma.movimiento.findMany({
      where: { proyectoId },
      include: { responsable: { select: { name: true, lastName: true } } },
      orderBy: { fecha: 'asc' },
    });
    return NextResponse.json({ movimientos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching movimientos:', error);
    return NextResponse.json({ error: 'No se pudieron obtener los movimientos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  // Tanto ADMIN como USER pueden crear movimientos, según el enunciado.

  const { proyectoId, tipo, cantidad } = await request.json();

  if (!proyectoId || (tipo !== 'ENTRADA' && tipo !== 'SALIDA')) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const cantidadNum = Number(cantidad);
  if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
    return NextResponse.json({ error: 'La cantidad debe ser un entero positivo' }, { status: 400 });
  }

  try {
    // Transacción: crear el movimiento y actualizar el saldo del Proyecto
    // deben ocurrir juntos o no ocurrir — si uno falla, se revierte el otro.
    const movimiento = await prisma.$transaction(async (tx) => {
      const proyecto = await tx.proyecto.findUnique({ where: { id: proyectoId } });
      if (!proyecto || proyecto.deleted) {
        throw new Error('PROYECTO_NO_ENCONTRADO');
      }

      const delta = tipo === 'ENTRADA' ? cantidadNum : -cantidadNum;
      const nuevoSaldo = proyecto.saldo + delta;
      if (nuevoSaldo < 0) {
        throw new Error('SALDO_INSUFICIENTE');
      }

      await tx.proyecto.update({
        where: { id: proyectoId },
        data: { saldo: nuevoSaldo },
      });

      return tx.movimiento.create({
        data: { proyectoId, tipo, cantidad: cantidadNum, responsableId: session.id },
        include: { responsable: { select: { name: true, lastName: true } } },
      });
    });

    return NextResponse.json({ movimiento }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'SALDO_INSUFICIENTE') {
      return NextResponse.json(
        { error: 'No hay suficientes tareas pendientes para completar esa cantidad' },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === 'PROYECTO_NO_ENCONTRADO') {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    console.error('Error creating movimiento:', error);
    return NextResponse.json({ error: 'No se pudo crear el movimiento' }, { status: 500 });
  }
}
