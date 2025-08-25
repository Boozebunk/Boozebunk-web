import React from 'react';

import { AuthGuard } from '~/shared/components/authGuard';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
