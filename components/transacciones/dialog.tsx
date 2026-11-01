'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { IconPlus } from '@tabler/icons-react';

const formSchema = z.object({
  tipo: z.enum(['ENTRADA', 'SALIDA']),
  cantidad: z.number().int('Debe ser un número entero.').positive('Debe ser mayor a 0.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Proyecto {
  id: string;
  nombre: string;
}

export function AgregarMovimientoDialog({
  proyecto,
  onCreated,
}: {
  proyecto: Proyecto;
  onCreated: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { tipo: 'ENTRADA', cantidad: 1 },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proyectoId: proyecto.id, ...data }),
      });
      const body = await response.json();
      if (!response.ok) {
        toast.error(body.error ?? 'No se pudo crear el movimiento');
        return;
      }
      toast.success('Movimiento registrado correctamente');
      setOpen(false);
      form.reset({ tipo: 'ENTRADA', cantidad: 1 });
      onCreated();
    } catch {
      toast.error('No se pudo crear el movimiento, inténtelo de nuevo');
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset({ tipo: 'ENTRADA', cantidad: 1 });
      }}
    >
      <form id='form-agregar-movimiento' onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger
          render={
            <Button type='button'>
              <IconPlus /> Agregar movimiento
            </Button>
          }
        />
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Nuevo movimiento — {proyecto.nombre}</DialogTitle>
            <DialogDescription>Registra una entrada o salida de tareas para este Maestro.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name='tipo'
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='tipo'>Tipo de movimiento</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='tipo' className='w-full'>
                      <SelectValue>
                        {(value: 'ENTRADA' | 'SALIDA' | null) =>
                          value === 'SALIDA' ? 'Salida (se completan tareas)' : 'Entrada (se agregan tareas)'
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        <SelectItem value='ENTRADA'>Entrada (se agregan tareas)</SelectItem>
                        <SelectItem value='SALIDA'>Salida (se completan tareas)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name='cantidad'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='cantidad'>Cantidad de tareas</FieldLabel>
                  <Input
                    {...field}
                    id='cantidad'
                    type='number'
                    min={1}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Field orientation='horizontal'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type='submit' form='form-agregar-movimiento' disabled={loading}>
                {loading ? <Spinner className='size-4' /> : 'Crear movimiento'}
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
