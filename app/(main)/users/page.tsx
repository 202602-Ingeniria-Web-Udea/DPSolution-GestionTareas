import { UsersTable } from '@/components/users/table';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  // Protección server-side real: si un USER intenta entrar directamente a
  // /users, se le redirige — no basta con ocultar el link en el sidebar.
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: { deleted: false },
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div>
        <h1 className='text-2xl font-bold'>Usuarios</h1>
        <p className='text-muted-foreground'>Administra los roles de las personas con acceso al sistema.</p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
