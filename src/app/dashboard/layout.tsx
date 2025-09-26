'use client';

import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserProfile } from './_components/user-profile';
import { Logo } from '@/components/logo';
import { SidebarNav } from '@/components/sidebar-nav';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
    return (
        <div className="flex h-screen w-full">
            <div className="hidden md:block w-64 border-r p-4">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            <div className="flex-1 p-6">
                <header className="flex justify-end mb-6">
                    <Skeleton className="h-9 w-9 rounded-full" />
                </header>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const fetchedUser = await getAuthenticatedUser();
        if (!fetchedUser && pathname !== '/') {
            // Using window.location to force a full redirect and clear state
            window.location.href = '/';
        } else {
            setUser(fetchedUser);
        }
      } catch (error) {
        console.error("Failed to fetch user, redirecting.", error);
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [pathname]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (!user) {
    // This should be caught by the useEffect, but as a fallback, we prevent rendering the layout
    return null;
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* O conteúdo do rodapé pode ir aqui */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="ml-auto">
            <UserProfile user={user} />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
