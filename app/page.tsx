import Link from 'next/link';
import { IconChecklist, IconUsers, IconChartBar, IconArrowRight, IconSparkles } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: IconChecklist,
    title: 'Proyectos y tareas',
    description: 'Cree proyectos, agregue tareas y complete las que ya haya terminado.',
  },
  {
    icon: IconChartBar,
    title: 'Seguimiento visual',
    description: 'Consulte la evolución diaria de las tareas pendientes de cada proyecto.',
  },
  {
    icon: IconUsers,
    title: 'Roles diferenciados',
    description: 'Administradores gestionan usuarios y proyectos; el equipo gestiona el día a día.',
  },
];

export default function LandingPage() {
  return (
    <div className='flex min-h-svh flex-col overflow-x-hidden bg-background'>
      <header className='relative z-10 flex items-center justify-between px-6 py-5 sm:px-10'>
        <Logo />
        <Button nativeButton={false} render={<Link href='/login'>Iniciar sesión</Link>} />
      </header>

      {/* Hero: textura de puntos + dos manchas de color difuminadas (identidad
          DP Solutions: indigo/violeta), sin imágenes externas. */}
      <main className='relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center sm:py-28'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]'
          style={{
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -top-32 -left-24 -z-10 size-96 rounded-full bg-primary/25 blur-[100px]'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -top-20 -right-16 -z-10 size-80 rounded-full bg-chart-2/30 blur-[100px]'
        />

        <span className='mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary'>
          <IconSparkles className='size-3.5' />
          DP Solutions
        </span>

        <h1 className='max-w-2xl text-4xl leading-[1.08] font-bold tracking-tight sm:text-6xl'>
          Organice los proyectos y las tareas de{' '}
          <span className='bg-gradient-to-br from-primary to-chart-2 bg-clip-text text-transparent'>
            su equipo
          </span>{' '}
          en un solo lugar
        </h1>
        <p className='mt-5 max-w-xl text-balance text-muted-foreground sm:text-lg'>
          Cree proyectos, registre el avance de sus tareas y siga la evolución de cada equipo con
          roles diferenciados para administradores y colaboradores.
        </p>
        <Button
          size='lg'
          className='mt-8 gap-1.5'
          nativeButton={false}
          render={
            <Link href='/login'>
              Iniciar sesión <IconArrowRight className='size-4' />
            </Link>
          }
        />

        <div className='mt-24 grid w-full max-w-4xl gap-5 sm:grid-cols-3'>
          {features.map((feature) => (
            <div
              key={feature.title}
              className='flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-sm transition-colors hover:border-primary/30'
            >
              <span className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <feature.icon className='size-5' />
              </span>
              <h2 className='font-heading font-semibold'>{feature.title}</h2>
              <p className='text-sm text-muted-foreground'>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className='border-t px-6 py-6 text-center text-xs text-muted-foreground'>
        Proyecto evaluativo · Ingeniería Web · DP Solutions
      </footer>
    </div>
  );
}
