'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '~/shared/shadcn/textarea';

const queryFormSchema = z.object({
  title: z.string().min(1, 'title cannot be empty'),
  query: z.string().min(1, 'description cannot be empty')
});

type QueryFormValues = z.infer<typeof queryFormSchema>;

interface WriteQueryProps {
  onQuerySubmit: (title: string, query: string) => void;
  isLoading: boolean;
}

export function WriteQuery({ onQuerySubmit, isLoading }: WriteQueryProps) {
  const form = useForm<QueryFormValues>({
    resolver: zodResolver(queryFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      query: ''
    }
  });

  const onFormSubmit = (values: QueryFormValues) => {
    onQuerySubmit(values.title, values.query);
    form.reset();
  };

  return (
    <Card className="box-border !w-[calc(100vw-50px)] border-none p-0 shadow-none sm:!w-[500px]">
      <CardHeader className="flex w-full flex-col items-center gap-1 p-0 text-center sm:px-5">
        <CardTitle className="text-2xl font-bold">Write Us</CardTitle>
        <CardDescription className="max-w-lg text-sm">
          Feel free to share your problem or feedback that would be a great help for us!
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 sm:px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Stock Updation Issue" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your issue here..."
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isLoading ? <Loader2 /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
