'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MovimientoRow } from '@/components/transacciones/table';

interface ChartProyecto {
  id: string;
  nombre: string;
  saldo: number;
  createdAt: Date | string;
}

function dayLabel(date: Date) {
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

/**
 * Reconstruye la evolución diaria del saldo a partir de los movimientos.
 * No guardamos un histórico de saldos aparte: el saldo "semilla" al crear
 * el Maestro se deduce restándole al saldo actual la suma de todos los
 * movimientos (entradas suman, salidas restan) — así el último punto de la
 * gráfica siempre coincide con el saldo real del Proyecto.
 */
function buildChartData(movimientos: MovimientoRow[], proyecto: ChartProyecto) {
  const totalDelta = movimientos.reduce(
    (acc, m) => acc + (m.tipo === 'ENTRADA' ? m.cantidad : -m.cantidad),
    0
  );
  const seed = proyecto.saldo - totalDelta;

  const points: { fecha: string; saldo: number }[] = [
    { fecha: dayLabel(new Date(proyecto.createdAt)), saldo: seed },
  ];

  let running = seed;
  for (const movimiento of movimientos) {
    running += movimiento.tipo === 'ENTRADA' ? movimiento.cantidad : -movimiento.cantidad;
    const label = dayLabel(new Date(movimiento.fecha));
    const last = points[points.length - 1];
    if (last.fecha === label) {
      last.saldo = running;
    } else {
      points.push({ fecha: label, saldo: running });
    }
  }

  return points;
}

export function SaldoChart({
  movimientos,
  proyecto,
}: {
  movimientos: MovimientoRow[];
  proyecto: ChartProyecto;
}) {
  const data = React.useMemo(() => buildChartData(movimientos, proyecto), [movimientos, proyecto]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Evolución de tareas pendientes — {proyecto.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-64 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='saldoFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--color-primary, #6366f1)' stopOpacity={0.35} />
                  <stop offset='95%' stopColor='var(--color-primary, #6366f1)' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='fecha' fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} width={32} />
              <Tooltip
                formatter={(value) => [value, 'Tareas pendientes']}
                labelFormatter={(label) => `Día: ${label}`}
              />
              <Area
                type='stepAfter'
                dataKey='saldo'
                stroke='var(--color-primary, #6366f1)'
                strokeWidth={2}
                fill='url(#saldoFill)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
