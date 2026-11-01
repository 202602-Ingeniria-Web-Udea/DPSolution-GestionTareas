import { MaestrosTable } from '@/components/maestros/table';
import { CrearMaestroDialog } from '@/components/maestros/dialog';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function MaestrosPage() {
  const user = await requireUser();

  const proyectos = await prisma.proyecto.findMany({
    where: { deleted: false },
    include: { creador: { select: { name: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Maestros</h1>
          <p className='text-muted-foreground'>Proyectos del sistema y sus tareas pendientes.</p>
        </div>
        {/* Solo ADMIN puede ver el botón de crear Maestro, según el enunciado. */}
        {user.role === 'ADMIN' && <CrearMaestroDialog />}
      </div>
      <MaestrosTable proyectos={proyectos} />
    </div>
  );
}
