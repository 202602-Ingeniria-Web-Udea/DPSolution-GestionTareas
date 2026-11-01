import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { requireUser } from '@/lib/auth';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Autorización real: si no hay sesión válida en la base de datos, esto
  // redirige a /login. El middleware solo filtra de forma optimista.
  const user = await requireUser();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className='bg-gradient-to-br from-primary/[0.04] via-background to-chart-2/[0.05]'>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b border-primary/10 bg-background/60 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            <span className='text-sm text-muted-foreground'>
              Sesión iniciada como <span className='font-medium text-foreground'>{user.name}</span> ·{' '}
              {user.role}
            </span>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-4'>
          {children}
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
