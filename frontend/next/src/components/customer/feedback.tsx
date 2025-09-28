'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Star } from 'lucide-react';
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
import { Textarea } from '~/shared/shadcn/textarea';

const feedbackFormSchema = z.object({
  description: z.string().optional(),
  rating: z.number().min(1, 'Please select a rating')
});

type feedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function WriteFeedback() {
  const form = useForm<feedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: 'onChange',
    defaultValues: {
      description: '',
      rating: 0
    }
  });

  const onFormSubmit = () => {
    console.log(form.getValues());
    form.reset();
  };
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Card className="box-border !w-[calc(100vw-50px)] border-none p-0 shadow-none sm:!w-[500px]">
      <CardHeader className="flex w-full flex-col items-center gap-1 p-0 text-center sm:px-5">
        <CardTitle className="text-2xl font-bold">Write Us</CardTitle>
        <CardDescription className="max-w-lg text-sm">
          Feel free to share your feedback. It helps us a lot!
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 sm:px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g. Love your services"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Star Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const starIndex = i + 1;
                        return (
                          <Star
                            key={i}
                            onClick={() => field.onChange(starIndex)} // actually set value
                            onMouseEnter={() => setHover(starIndex)} // temporary hover preview
                            onMouseLeave={() => setHover(null)} // reset hover
                            className={clsx(
                              'cursor-pointer transition-colors duration-150',
                              starIndex <= (hover ?? field.value)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            )}
                            size={28}
                          />
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <Button type="submit" className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
            </Button> */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
