'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';

import { trpcHttp } from '~/utils/trpc';

function DeletedBanner() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: logout, isPending } = useMutation(
    trpcHttp.auth.logout.mutationOptions({
      onSuccess: async () => {
        // 1. Invalidate the old session data to mark it as stale
        await queryClient.invalidateQueries({
          queryKey: trpcHttp.auth.getSession.queryOptions().queryKey
        });

        // 2. Force a re-fetch of the session data, which should now return null
        await queryClient.fetchQuery(trpcHttp.auth.getSession.queryOptions());
        router.push('/vendor-authentication/sign-in');
      },
      onError: (err) => {
        console.error('Error while logging out:', err);
      }
    })
  );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-white to-amber-100 p-6 text-center">
      {/* Decorative top bottle or glass */}
      <div className="mb-6 text-6xl">🍸</div>

      {/* Message */}
      <h1 className="mb-2 text-3xl font-bold text-amber-900">Account Deleted</h1>
      <p className="mb-6 max-w-md text-amber-800">
        Looks like last call was made — your vendor account has been permanently deleted. Don’t
        worry, the bar’s always open for a new beginning 🍻
      </p>

      {/* Retry / Sign-in Button */}
      <Button
        onClick={async () => await logout()}
        className="rounded-xl bg-amber-700 px-6 py-3 text-white shadow-md transition-all hover:bg-amber-800">
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Retry Sign-in'}
      </Button>

      {/* Optional: subtle footer */}
      <div className="mt-8 text-sm text-amber-700/70 italic">
        — Team <strong>BoozeBunk</strong>
      </div>
    </div>
  );
}

export default DeletedBanner;
