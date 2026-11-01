'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditarUsuarioDialog, type EditableUser } from '@/components/users/dialog';

export interface UserRow extends EditableUser {
  createdAt: string | Date;
}

function formatFecha(fecha: string | Date) {
  return new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader className="bg-primary/[0.04]">
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Creado</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className='text-right'>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className='font-mono text-xs text-muted-foreground'>
                {user.id.slice(0, 8)}
              </TableCell>
              <TableCell>{formatFecha(user.createdAt)}</TableCell>
              <TableCell className='font-medium'>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
              </TableCell>
              <TableCell className='text-right'>
                <EditarUsuarioDialog user={user} onUpdated={() => router.refresh()} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
              No hay usuarios registrados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
