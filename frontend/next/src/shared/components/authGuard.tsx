'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { trpcHttp } from '~/utils/trpc';

import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

interface SessionTypes {
  id: string;
  email: string;
  role: 'admin' | 'vendor';
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);
  const isProtectedRoute =
    pathname.startsWith('/admin-portal') || pathname.startsWith('/vendor-portal');
  const isAdminRoute = pathname.startsWith('/admin-portal');
  const isVendorRoute = pathname.startsWith('/vendor-portal');
  const isAuthPage =
    pathname.startsWith('/admin-authentication') || pathname.startsWith('/vendor-authentication');

  const { data: session, isLoading } = useQuery(
    trpcHttp.auth.getSession.queryOptions<SessionTypes>()
  );

  console.log('Session Data:', session);

  useEffect(() => {
    if (isLoading) return;

    if (isProtectedRoute) {
      if (!session) {
        if (isAdminRoute) {
          router.push('/admin-authentication/sign-in');
        } else if (isVendorRoute) {
          router.push('/vendor-authentication/sign-in');
        }
        return;
      } else if (isAuthPage && session) {
        if (session.role === 'admin') {
          router.replace('/admin-portal/' + session.id + '/admin/dashboard');
        } else if (session.role === 'vendor') {
          router.replace('/vendor-portal/' + session.id + '/vendor/dashboard');
        }
        return;
      }
    }
    setHasChecked(true);
  }, [session, isLoading, pathname, router]);

  if (isLoading || (!hasChecked && (isProtectedRoute || isAuthPage))) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">boozebunk...</p>
      </div>
    );
  }

  return <>{children}</>;
}
