'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

const feedbackFormSchema = z.object({
  email: z.string().min(1, 'Email is Mandatorily required'),
  description: z.string().optional(),
  rating: z.number().min(1, 'Please select a rating')
});

type feedbackFormValues = z.infer<typeof feedbackFormSchema>;

type WriteFeedbackProps = {
  onClose: () => void; // NEW: Prop to close the parent dialog
};

export function WriteFeedback({ onClose }: WriteFeedbackProps) {
  const { customerEmail } = useCustomerContext();

  const { mutateAsync: sendFeedback, isPending } = useMutation(
    trpcHttp.reshub.saveCustomerFeedback.mutationOptions({
      onSuccess: () => {
        toast.success('Feedback send Successfully');
        form.reset({ email: customerEmail, description: '', rating: 0 });
        onClose();
      },
      onError: (err) => {
        toast.error('Feedback Failed');
        console.log(`feedback failed: ${err.message}`);
      }
    })
  );

  const form = useForm<feedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: customerEmail,
      description: '',
      rating: 0
    }
  });

  const onFormSubmit = async (values: feedbackFormValues) => {
    console.log('on form submitssion');
    await sendFeedback(values);
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
                      rows={3}
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 /> : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
