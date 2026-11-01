import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface MovimientoRow {
  id: string;
  fecha: string | Date;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  responsable: { name: string; lastName: string | null };
}

function formatFecha(fecha: string | Date) {
  return new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MovimientosTable({ movimientos }: { movimientos: MovimientoRow[] }) {
  return (
    <Table>
      <TableHeader className="bg-primary/[0.04]">
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Responsable</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimientos.length ? (
          [...movimientos]
            .reverse()
            .map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell className='font-mono text-xs text-muted-foreground'>
                  {movimiento.id.slice(0, 8)}
                </TableCell>
                <TableCell>{formatFecha(movimiento.fecha)}</TableCell>
                <TableCell>
                  <Badge variant={movimiento.tipo === 'ENTRADA' ? 'default' : 'destructive'}>
                    {movimiento.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
                  </Badge>
                </TableCell>
                <TableCell>{movimiento.cantidad}</TableCell>
                <TableCell>
                  {movimiento.responsable.name} {movimiento.responsable.lastName ?? ''}
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
              Este Maestro todavía no tiene movimientos.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
