'use client';
import { BookOpen, Home, Lightbulb, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/trainings', label: 'Trainings', icon: BookOpen },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  {
    href: '/dashboard/tools/summarizer',
    label: 'AI Summarizer',
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
