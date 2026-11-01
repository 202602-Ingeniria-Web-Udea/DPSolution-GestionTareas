'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChecklist, IconClipboardList, IconUsers, IconLayoutDashboard } from '@tabler/icons-react';

import { cn } from 'cn';
import { Logo } from '@/components/logo';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { SessionUser } from '@/lib/session';

// Visibilidad por rol según el enunciado: Transacciones y Maestros para
// ambos roles, Usuarios solo para ADMIN.
const links = [
  { title: 'Inicio', url: '/home', icon: IconLayoutDashboard, roles: ['ADMIN', 'USER'] as const },
  { title: 'Transacciones', url: '/transacciones', icon: IconClipboardList, roles: ['ADMIN', 'USER'] as const },
  { title: 'Maestros', url: '/maestros', icon: IconChecklist, roles: ['ADMIN', 'USER'] as const },
  { title: 'Usuarios', url: '/users', icon: IconUsers, roles: ['ADMIN'] as const },
];

export function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const visibleLinks = links.filter((link) => (link.roles as readonly string[]).includes(user.role));
  const fullName = [user.name, user.lastName].filter(Boolean).join(' ');

  return (
    <Sidebar collapsible='icon' className='bg-gradient-to-b from-primary/[0.07] via-sidebar to-chart-2/[0.06]'>
      <SidebarHeader>
        <Logo className='px-2 py-1.5' />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.url);
                return (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={link.title}
                      // Acento de marca: borde + ícono en indigo cuando el
                      // link está activo, en vez de solo el resaltado gris
                      // por defecto de shadcn.
                      className={cn(
                        'border-l-2 border-transparent',
                        isActive && 'border-primary text-primary data-active:text-primary [&_svg]:text-primary'
                      )}
                      render={
                        <Link href={link.url}>
                          <link.icon />
                          <span>{link.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: fullName, email: user.email, avatar: user.image ?? '' }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
