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
import { Field, FieldLabel } from '@/components/ui/field';
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
import { IconPencil } from '@tabler/icons-react';

const formSchema = z.object({
  role: z.enum(['ADMIN', 'USER']),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditableUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export function EditarUsuarioDialog({
  user,
  onUpdated,
}: {
  user: EditableUser;
  onUpdated: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: user.role },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        toast.error(body.error ?? 'No se pudo actualizar el usuario');
        return;
      }
      toast.success('Usuario actualizado correctamente');
      setOpen(false);
      onUpdated();
    } catch {
      toast.error('No se pudo actualizar el usuario, inténtelo de nuevo');
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset({ role: user.role });
      }}
    >
      <form id={`form-editar-usuario-${user.id}`} onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger
          render={
            <Button type='button' variant='outline' size='sm'>
              <IconPencil /> Editar usuario
            </Button>
          }
        />
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>
          <Controller
            name='role'
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={`role-${user.id}`}>Rol</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`role-${user.id}`} className='w-full'>
                    <SelectValue>
                      {(value: 'ADMIN' | 'USER' | null) => (value === 'ADMIN' ? 'Administrador' : 'Usuario')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Rol</SelectLabel>
                      <SelectItem value='ADMIN'>Administrador</SelectItem>
                      <SelectItem value='USER'>Usuario</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <DialogFooter>
            <Field orientation='horizontal'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type='submit' form={`form-editar-usuario-${user.id}`} disabled={loading}>
                {loading ? <Spinner className='size-4' /> : 'Guardar cambios'}
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
