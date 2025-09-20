'use client';

import React from 'react';

import { createAdminSchema } from '@boozebunk-trpc/modules/auth/dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/shared/shadcn/form';

import { trpcHttp } from '~/utils/trpc';

import type { CreateAdminType } from '@boozebunk-trpc/modules/auth/dto';

function Page() {
  const form = useForm<CreateAdminType>({
    resolver: zodResolver(createAdminSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'admin'
    }
  });

  const { mutateAsync: createAdmin } = useMutation(
    trpcHttp.auth.createAdmin.mutationOptions({
      onSuccess: () => {
        toast.success('Admin created Successfully');
        console.log('Admin created successfully');
      },
      onError: (err: unknown) => {
        toast.error('Admin creation failed');
        console.error('Error creating admin:', err);
      }
    })
  );

  const handleFormSubmit = async () => {
    console.log('creating and admin');
    await createAdmin(form.getValues());
  };

  return (
    <div>
      <h1>Temporarily Adding an ADMIN account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input type="text" placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input type="email" placeholder="email" {...field} />
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
                  <input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <input type="text" placeholder="role" {...field} value="admin" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
