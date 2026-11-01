import Link from 'next/link';
import {
  IconChecklist,
  IconClipboardList,
  IconUsers,
  IconArrowUpRight,
  IconArrowDownRight,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function formatFecha(fecha: Date) {
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const user = await requireUser();

  const [proyectosCount, tareasPendientes, usuarios, proyectos, actividad] = await Promise.all([
    prisma.proyecto.count({ where: { deleted: false } }),
    prisma.proyecto.aggregate({ where: { deleted: false }, _sum: { saldo: true } }),
    user.role === 'ADMIN' ? prisma.user.count({ where: { deleted: false } }) : Promise.resolve(null),
    prisma.proyecto.findMany({
      where: { deleted: false },
      orderBy: { saldo: 'desc' },
      take: 5,
      select: { id: true, nombre: true, saldo: true },
    }),
    prisma.movimiento.findMany({
      orderBy: { fecha: 'desc' },
      take: 6,
      include: {
        proyecto: { select: { nombre: true } },
        responsable: { select: { name: true, lastName: true } },
      },
    }),
  ]);

  const cards = [
    {
      title: 'Proyectos activos',
      value: proyectosCount,
      icon: IconChecklist,
      href: '/maestros',
      accent: 'bg-primary/10 text-primary',
      bar: 'bg-primary',
      tint: 'from-primary/[0.07]',
    },
    {
      title: 'Tareas pendientes (total)',
      value: tareasPendientes._sum.saldo ?? 0,
      icon: IconClipboardList,
      href: '/transacciones',
      accent: 'bg-emerald-500/15 text-emerald-600',
      bar: 'bg-emerald-500',
      tint: 'from-emerald-500/[0.08]',
    },
    ...(usuarios !== null
      ? [
          {
            title: 'Usuarios registrados',
            value: usuarios,
            icon: IconUsers,
            href: '/users',
            accent: 'bg-amber-500/15 text-amber-600',
            bar: 'bg-amber-500',
            tint: 'from-amber-500/[0.1]',
          },
        ]
      : []),
  ];

  return (
    <div className='flex flex-1 flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold'>Hola, {user.name}</h1>
        <p className='text-muted-foreground'>Este es el resumen general del sistema.</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card
              className={`gap-3 overflow-hidden border-t-0 bg-gradient-to-b ${card.tint} to-card pt-0 transition-colors hover:border-primary/40`}
            >
              <div className={`h-1.5 w-full ${card.bar}`} />
              <CardHeader className='flex flex-row items-center justify-between pb-0'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>{card.title}</CardTitle>
                <span className={`flex size-9 items-center justify-center rounded-lg ${card.accent}`}>
                  <card.icon className='size-4.5' />
                </span>
              </CardHeader>
              <CardContent>
                <div className='font-heading text-3xl font-bold'>{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className='grid gap-4 lg:grid-cols-5'>
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle className='text-base'>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            {actividad.length === 0 && (
              <p className='py-6 text-center text-sm text-muted-foreground'>
                Todavía no hay movimientos registrados.
              </p>
            )}
            {actividad.map((mov) => (
              <div
                key={mov.id}
                className='flex items-center justify-between gap-3 border-b py-3 last:border-0 last:pb-0'
              >
                <div className='flex items-center gap-3'>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                      mov.tipo === 'ENTRADA' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {mov.tipo === 'ENTRADA' ? (
                      <IconArrowUpRight className='size-4' />
                    ) : (
                      <IconArrowDownRight className='size-4' />
                    )}
                  </span>
                  <div>
                    <p className='text-sm font-medium'>
                      {mov.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} de {mov.cantidad} tarea
                      {mov.cantidad === 1 ? '' : 's'} — {mov.proyecto.nombre}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {mov.responsable.name} {mov.responsable.lastName ?? ''} · {formatFecha(mov.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base'>Proyectos con más tareas pendientes</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            {proyectos.length === 0 && (
              <p className='py-6 text-center text-sm text-muted-foreground'>
                Todavía no hay Maestros creados.
              </p>
            )}
            {proyectos.map((proyecto) => (
              <Link
                key={proyecto.id}
                href='/transacciones'
                className='flex items-center justify-between gap-3 rounded-md border-b py-3 last:border-0 last:pb-0 hover:text-primary'
              >
                <span className='text-sm font-medium'>{proyecto.nombre}</span>
                <Badge variant={proyecto.saldo === 0 ? 'secondary' : 'default'}>{proyecto.saldo}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
