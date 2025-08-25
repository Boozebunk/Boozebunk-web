'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
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

const passwordSchema = z
  .object({
    newPassword: z.string().min(3, 'Password must be at least 3 characters long.'),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password do not match.',
    path: ['confirmPassword']
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const params = useParams();
  const resetToken = params['reset-token'] as string;

  const { mutateAsync: ResetPassword, isPending } = useMutation(
    trpcHttp.auth.changePassword.mutationOptions({
      onSuccess: (data) => {
        console.log('Password Successfully Changed');
        toast.success('Password Changed successfully');

        if (data.userRole === 'admin') {
          router.push('/admin-authentication/sign-in');
        } else if (data.userRole === 'vendor') {
          router.push('/vendor-authentication/sign-in');
        }
      },
      onError: (err) => {
        toast.error(err.message);
        console.error(err);
      }
    })
  );

  const handleSubmit = async (data: PasswordForm) => {
    console.log('Submitting new password');
    await ResetPassword({ token_id: resetToken, password: data.confirmPassword });
  };

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-1xl font-bold md:text-2xl">Reset Your Password</CardTitle>
          <CardDescription className="text-sm">
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col justify-center">
            <CardContent className="flex flex-col gap-5">
              {/* password  */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="newPassword"
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
                  </FormItem>
                )}
              />
              {/* confirm password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Match your above password"
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
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="my-10 flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]"
                disabled={isPending}>
                {isPending ? <Loader2 /> : 'Save New Password'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
