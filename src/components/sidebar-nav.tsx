'use client';
import { Award, BookOpen, Home, Lightbulb, Users, ClipboardList } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/dashboard', label: 'Painel', icon: Home },
  { href: '/dashboard/trainings', label: 'Treinamentos', icon: BookOpen },
  { href: '/dashboard/records', label: 'Meus Registros', icon: ClipboardList },
  { href: '/dashboard/seals', label: 'Selos', icon: Award },
  { href: '/dashboard/users', label: 'Usuários', icon: Users },
  {
    href: '/dashboard/tools/summarizer',
    label: 'Resumidor IA',
    icon: Lightbulb,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard')}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
