'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { PageLoader } from '~/shared/components/pageLoader';

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
      console.log('in authGuard session', session);
      if (!session) {
        if (isAdminRoute) {
          router.push('/admin-authentication/sign-in');
        } else if (isVendorRoute) {
          router.push('/vendor-authentication/sign-in');
        }
        return;
      }
    }
    setHasChecked(true);
  }, [
    session,
    isLoading,
    pathname,
    router,
    isProtectedRoute,
    isAdminRoute,
    isVendorRoute,
    isAuthPage
  ]);

  if (isLoading || (!hasChecked && (isProtectedRoute || isAuthPage))) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
