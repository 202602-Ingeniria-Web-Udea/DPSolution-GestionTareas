'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { Spinner } from '@/components/ui/spinner';
import { IconPlus } from '@tabler/icons-react';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  saldoInicial: z.number().int().min(0, 'El saldo inicial no puede ser negativo.'),
});

type FormValues = z.infer<typeof formSchema>;

export function CrearMaestroDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: '', saldoInicial: 0 },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch('/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        toast.error(body.error ?? 'No se pudo crear el Maestro');
        return;
      }
      toast.success('Maestro creado correctamente');
      setOpen(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error('No se pudo crear el Maestro, inténtelo de nuevo');
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <form id='form-crear-maestro' onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger
          render={
            <Button type='button'>
              <IconPlus /> Agregar
            </Button>
          }
        />
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Nuevo Maestro</DialogTitle>
            <DialogDescription>Cree un nuevo proyecto para gestionar sus tareas.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name='nombre'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='nombre'>Nombre del Maestro</FieldLabel>
                  <Input {...field} id='nombre' placeholder='Rediseño del sitio web' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='saldoInicial'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='saldoInicial'>Saldo inicial (tareas pendientes)</FieldLabel>
                  <Input
                    {...field}
                    id='saldoInicial'
                    type='number'
                    min={0}
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
              <Button type='submit' form='form-crear-maestro' disabled={loading}>
                {loading ? <Spinner className='size-4' /> : 'Crear Maestro'}
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
