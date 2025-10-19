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
    <>
      <div>This account has been deleted</div>
      <Button onClick={async () => await logout()}>
        {isPending ? <Loader2 /> : 'Retry Sign-in'}
      </Button>
    </>
  );
}

export default DeletedBanner;
