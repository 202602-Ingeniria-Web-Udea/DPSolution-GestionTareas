'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MovimientosTable, type MovimientoRow } from '@/components/transacciones/table';
import { AgregarMovimientoDialog } from '@/components/transacciones/dialog';
import { SaldoChart } from '@/components/transacciones/chart';
import { Spinner } from '@/components/ui/spinner';

export interface ProyectoOption {
  id: string;
  nombre: string;
  saldo: number;
  createdAt: Date | string;
}

export function TransaccionesClient({ proyectos }: { proyectos: ProyectoOption[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string>(proyectos[0]?.id ?? '');
  const [movimientos, setMovimientos] = React.useState<MovimientoRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const selected = proyectos.find((proyecto) => proyecto.id === selectedId) ?? null;

  const fetchMovimientos = React.useCallback(async (proyectoId: string) => {
    if (!proyectoId) {
      setMovimientos([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/movimientos?proyectoId=${proyectoId}`);
      const body = await response.json();
      setMovimientos(response.ok ? body.movimientos : []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMovimientos(selectedId);
  }, [selectedId, fetchMovimientos]);

  function handleMovimientoCreado() {
    // Refresca tanto los datos del servidor (el saldo del Proyecto cambió)
    // como la lista de movimientos de este cliente.
    router.refresh();
    fetchMovimientos(selectedId);
  }

  if (proyectos.length === 0) {
    return (
      <p className='rounded-lg border border-dashed p-8 text-center text-muted-foreground'>
        Todavía no hay Maestros creados. Pídale a un administrador que cree uno en la sección
        &ldquo;Maestros&rdquo;.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <Select value={selectedId} onValueChange={(value) => setSelectedId(value ?? '')}>
          <SelectTrigger className='w-full max-w-xs'>
            {/* Base UI no resuelve la etiqueta a mostrar a partir de los
                SelectItem hijos por sí solo — hay que mapear value -> label
                explícitamente aquí. */}
            <SelectValue placeholder='Seleccione un Maestro'>
              {(value: string | null) =>
                proyectos.find((proyecto) => proyecto.id === value)?.nombre ?? 'Seleccione un Maestro'
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Maestros</SelectLabel>
              {proyectos.map((proyecto) => (
                <SelectItem key={proyecto.id} value={proyecto.id}>
                  {proyecto.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selected && <AgregarMovimientoDialog proyecto={selected} onCreated={handleMovimientoCreado} />}
      </div>

      {loading ? (
        <div className='flex justify-center py-10'>
          <Spinner className='size-6' />
        </div>
      ) : selected ? (
        <>
          <SaldoChart movimientos={movimientos} proyecto={selected} />
          <MovimientosTable movimientos={movimientos} />
        </>
      ) : null}
    </div>
  );
}
