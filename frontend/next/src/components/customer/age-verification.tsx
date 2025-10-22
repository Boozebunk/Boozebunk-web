'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle
} from '~/shared/shadcn/alert-dialog';
import { Button } from '~/shared/shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/shared/shadcn/form';
import { Input } from '~/shared/shadcn/input';

import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

const EMAIL_COOKIE_NAME = 'c_e';
const AGE_COOKIE_NAME = 'a_v';
const EMAIL_EXPIRATION_DAYS = 30;

export default function AgeVerificationDialog() {
  const [OpenVerification, setOpenVerification] = useState<boolean>(true);
  const [OpenEmailForm, setOpenEmailForm] = useState<boolean>(false);
  const [hasEmailConsent, setHasEmailConsent] = useState(false);

  const { setCustomerEmail } = useCustomerContext();

  useEffect(() => {
    const email = Cookies.get(EMAIL_COOKIE_NAME);
    const ageVerified = Cookies.get(AGE_COOKIE_NAME);

    if (ageVerified) {
      setOpenVerification(false);
    }
    if (email) {
      setOpenEmailForm(false);
      setHasEmailConsent(true);
    }
    if (ageVerified && !email) {
      setOpenEmailForm(true);
    }
  }, []);

  const { mutateAsync: sendCustomerEmail, isPending } = useMutation(
    trpcHttp.customer.saveCustomerEmail.mutationOptions({
      onSuccess: () => {
        toast.success('Email Received Successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );

  function OnVerification() {
    setOpenVerification(false);
    Cookies.set(AGE_COOKIE_NAME, 'Verified', { expires: 3 });

    if (!hasEmailConsent) {
      setOpenEmailForm(true);
    } else {
      const currentEmail = Cookies.get(EMAIL_COOKIE_NAME);
      setCustomerEmail(currentEmail ?? '');
    }
  }

  const emailSchema = z.object({
    email: z.string().email({
      message: 'Please enter a valid email address.'
    })
  });

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    await sendCustomerEmail(values);
    setCustomerEmail(values.email);
    Cookies.set(EMAIL_COOKIE_NAME, values.email, { expires: EMAIL_EXPIRATION_DAYS });
    setOpenEmailForm(false);
  }

  return (
    <>
      <AlertDialog open={OpenVerification} onOpenChange={setOpenVerification}>
        <AlertDialogOverlay className="bg-transparent backdrop-blur-xs" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">
              Are you of legal drinking age in your region?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please confirm your age.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex !w-full !flex-row !justify-start gap-5">
            <AlertDialogAction onClick={OnVerification} className="flex-1">
              Yes
            </AlertDialogAction>
            <AlertDialogCancel
              onClick={(e) => {
                e.preventDefault();
                alert('You must be of legal age to continue!');
                setOpenVerification(true);
              }}
              className="flex-1">
              No
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={OpenEmailForm} onOpenChange={setOpenEmailForm}>
        <AlertDialogOverlay className="bg-transparent backdrop-blur-xs" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">
              Please enter your email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please confirm your age.
            </AlertDialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. booze@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {isPending ? <Loader2 /> : 'Submit'}
                </Button>
              </form>
            </Form>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex !w-full !flex-row !justify-start gap-5">
            <AlertDialogCancel
              onClick={(e) => {
                e.preventDefault();
                alert('Enter the email to continue!');
                setOpenEmailForm(true);
              }}
              className="flex-1">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
