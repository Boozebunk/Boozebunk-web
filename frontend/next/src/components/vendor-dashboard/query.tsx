'use client';

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
import { Textarea } from '~/shared/shadcn/textarea';

interface QueryFormValues {
  title: string;
  query: string;
}

export function WriteQuery() {
  const form = useForm<QueryFormValues>({
    defaultValues: {
      title: '',
      query: ''
    }
  });

  const onSubmit = (values: QueryFormValues) => {
    console.log(values);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Login issue" className="text-sm" />
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
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
