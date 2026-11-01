import { TransaccionesClient } from '@/components/transacciones/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function TransaccionesPage() {
  await requireUser();

  const proyectos = await prisma.proyecto.findMany({
    where: { deleted: false },
    select: { id: true, nombre: true, saldo: true, createdAt: true },
    orderBy: { nombre: 'asc' },
  });

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div>
        <h1 className='text-2xl font-bold'>Transacciones</h1>
        <p className='text-muted-foreground'>
          Seleccione un Maestro para ver y registrar movimientos de sus tareas.
        </p>
      </div>
      <TransaccionesClient proyectos={proyectos} />
    </div>
  );
}
