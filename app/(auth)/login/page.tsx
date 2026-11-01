import Link from 'next/link';
import { IconAsteriskSimple } from '@tabler/icons-react';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      {/* Panel de marca: gradiente difuminado tipo "vidrio esmerilado",
          solo en pantallas grandes — en móvil el formulario ocupa todo. */}
      <div className='relative z-10 hidden flex-col justify-between overflow-hidden p-10 text-white shadow-[16px_0_40px_-16px_rgba(26,18,64,0.5)] lg:flex'>
        <div aria-hidden className='absolute inset-0 bg-[#1a1240]'>
          <div className='absolute -top-20 -left-24 size-96 rounded-full bg-indigo-500 opacity-80 blur-[90px]' />
          <div className='absolute top-1/3 -right-20 size-80 rounded-full bg-violet-400 opacity-70 blur-[90px]' />
          <div className='absolute -bottom-24 left-10 size-80 rounded-full bg-blue-500 opacity-60 blur-[90px]' />
          <div className='absolute top-1/2 left-1/3 size-72 rounded-full bg-white opacity-10 blur-[100px]' />
        </div>

        <IconAsteriskSimple className='relative z-10 size-8' />

        <div className='relative z-10'>
          <h2 className='font-heading text-3xl leading-tight font-semibold'>
            Organice el trabajo de su equipo con claridad
          </h2>
          <p className='mt-3 text-sm text-white/70'>
            Proyectos, tareas y roles diferenciados, en un solo panel de administración.
          </p>
        </div>
      </div>

      {/* Panel del formulario */}
      <div className='flex flex-col justify-center gap-8 px-8 py-12 sm:px-14 lg:px-20'>
        <Link href='/' className='flex items-center gap-2 text-primary lg:hidden'>
          <span className='flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground'>
            DP
          </span>
          <span className='text-sm font-semibold text-foreground'>Gestión de Tareas</span>
        </Link>

        <div className='mx-auto w-full max-w-sm'>
          <IconAsteriskSimple className='mb-4 hidden size-6 text-primary lg:block' />
          <h1 className='font-heading text-3xl font-bold tracking-tight'>Bienvenido de nuevo</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Ingrese a su cuenta para gestionar sus proyectos y tareas.
          </p>

          <LoginForm className='mt-8' />
        </div>
      </div>
    </div>
  );
}
