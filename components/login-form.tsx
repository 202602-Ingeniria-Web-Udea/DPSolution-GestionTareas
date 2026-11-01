'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        setServerError(body.error ?? 'No fue posible iniciar sesión');
        return;
      }
      router.push('/home');
      router.refresh();
    } catch {
      setServerError('No fue posible conectar con el servidor');
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='email'>Correo</FieldLabel>
                <Input
                  {...field}
                  id='email'
                  type='email'
                  placeholder='admin@dpsolutions.test'
                  autoComplete='email'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='password'>Contraseña</FieldLabel>
                <Input
                  {...field}
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {serverError && <p className='text-sm text-destructive'>{serverError}</p>}
          <Field>
            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? <Spinner className='size-4' /> : 'Iniciar sesión'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
