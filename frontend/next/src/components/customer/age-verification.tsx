'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

export default function AgeVerificationDialog() {
  const [OpenVerification, setOpenVerification] = useState<boolean>(true);
  const [OpenEmailForm, setOpenEmailForm] = useState<boolean>(false);

  function OnVerification() {
    setOpenVerification(false);
    setOpenEmailForm(true);
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

  function onSubmit(values: z.infer<typeof emailSchema>) {
    console.log(values);
    setOpenEmailForm(false);
  }

  return (
    <>
      <AlertDialog open={OpenVerification} onOpenChange={setOpenVerification}>
        <AlertDialogOverlay className="bg-transparent backdrop-blur-xs" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">
              Are you of legal drinking age (21+)?
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
                  Submit
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
