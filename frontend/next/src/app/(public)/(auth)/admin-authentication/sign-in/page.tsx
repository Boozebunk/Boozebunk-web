'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { loginCredentialSchema } from '@boozebunk-trpc/modules/auth/dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/shared/shadcn/form';
import { Input } from '~/shared/shadcn/input';

import { trpcHttp } from '~/utils/trpc';

import type { LoginCredentials } from '@boozebunk-trpc/modules/auth/dto';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      role: 'admin'
    }
  });

  const { mutateAsync: AdminLogin, isPending } = useMutation(
    trpcHttp.auth.login.mutationOptions({
      onSuccess: async (data) => {
        console.log('Logged-In Successfully');
        // 1. Invalidate the old 'null' session query to mark it as stale
        await queryClient.invalidateQueries({
          queryKey: trpcHttp.auth.getSession.queryOptions().queryKey
        });

        // 2. Manually re-fetch the session query to get the new session data
        //    before proceeding to the next page. This guarantees the AuthGuard
        //    will have the correct, non-null session.
        await queryClient.fetchQuery(trpcHttp.auth.getSession.queryOptions());
        router.push(`/admin-portal/${data.user.id}/admin/dashboard`);
      },
      onError: (err) => {
        console.log('Error while loggin in -> frontend/next ', err);
      }
    })
  );

  const handleFormSubmit = async () => {
    console.log('logging in as admin');
    console.log('Form Values:', form.getValues());
    await AdminLogin(form.getValues());
  };

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center">
          <UserRound className="h-8 w-8 sm:h-10 sm:w-10" />
          <CardTitle className="text-1xl font-bold md:text-2xl">Admin Login</CardTitle>
          <CardDescription className="text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="8+ characters"
                          required
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute top-1/2 right-2 -translate-y-1/2 transform"
                          tabIndex={-1}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <a href="#" className="self-end text-sm underline-offset-4 hover:underline">
                      Forgot password?
                    </a>
                  </FormItem>
                )}
              />
              {/* Role Field (hidden, but included for completeness) */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => <input type="hidden" {...field} value="admin" readOnly />}
              />
              <Button
                type="submit"
                className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]"
                disabled={isPending}>
                {isPending ? <Loader2 /> : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* ...existing code... */}
      </Card>
    </div>
  );
}
