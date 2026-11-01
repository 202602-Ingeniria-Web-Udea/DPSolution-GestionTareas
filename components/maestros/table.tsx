import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface MaestroRow {
  id: string;
  nombre: string;
  saldo: number;
  creador: { name: string; lastName: string | null };
}

export function MaestrosTable({ proyectos }: { proyectos: MaestroRow[] }) {
  return (
    <Table>
      <TableHeader className="bg-primary/[0.04]">
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Saldo (tareas pendientes)</TableHead>
          <TableHead>Creado por</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proyectos.length ? (
          proyectos.map((proyecto) => (
            <TableRow key={proyecto.id}>
              <TableCell className='font-mono text-xs text-muted-foreground'>
                {proyecto.id.slice(0, 8)}
              </TableCell>
              <TableCell className='font-medium'>{proyecto.nombre}</TableCell>
              <TableCell>
                <Badge variant={proyecto.saldo === 0 ? 'secondary' : 'default'}>{proyecto.saldo}</Badge>
              </TableCell>
              <TableCell>
                {proyecto.creador.name} {proyecto.creador.lastName ?? ''}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
              Todavía no hay Maestros creados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
