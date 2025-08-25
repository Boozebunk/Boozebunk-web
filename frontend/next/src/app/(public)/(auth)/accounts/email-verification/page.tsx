'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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

// Email validation schema
const emailSchema = z.object({
  email: z.email('Please enter a valid email address.').min(1, 'Email is required.')
});

type EmailForm = z.infer<typeof emailSchema>;

export default function Page() {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const { mutateAsync: VerifyEmail, isPending } = useMutation(
    trpcHttp.auth.requestPasswordReset.mutationOptions({
      onSuccess: (data) => {
        console.log(data.message);
        toast.success('Email successfully verified');
        setEmailSent(true);
      },
      onError: (err) => {
        toast.error(err.message);
        console.log(err);
      }
    })
  );

  const handleSubmit = async () => {
    console.log('submitting the email for verification');
    await VerifyEmail(form.getValues());
    console.log('Email submitted:');
  };

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      {emailSent ? (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Email Sent</CardTitle>
            <CardDescription className="text-sm">
              Please check your inbox for the verification link.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle className="text-1xl font-bold md:text-2xl">Email Verification</CardTitle>
            <CardDescription className="text-sm">
              Please enter your registered email to continue.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col justify-center">
              <CardContent className="flex justify-center">
                <div className="grid w-full gap-2.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input type="email" id="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]"
                  disabled={isPending}>
                  {isPending ? <Loader2 /> : 'Verify Email'}
                </Button>
                <div className="text-center text-sm">
                  A link to reset the password will be sent to you email after verification of the
                  your account.
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
