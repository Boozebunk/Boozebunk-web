'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import { Input } from '~/shared/shadcn/input';
import { Textarea } from '~/shared/shadcn/textarea';
import { ComponentLoader } from '~/shared/components/componentLoader';

import { trpcHttp } from '~/utils/trpc';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tag: z.string().min(1, 'Tag is required')
});

type BlogForm = z.infer<typeof blogSchema>;

function BlogsPage() {
  const [editingBlog, setEditingBlog] = React.useState<{
    id: string;
    title: string;
    description: string;
    tag: string;
  } | null>(null);

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      tag: ''
    }
  });

  const {
    data: blogsData,
    isLoading: blogsLoader,
    refetch: refetchBlogs
  } = useQuery(trpcHttp.blog.getAllBlogs.queryOptions());

  const { mutateAsync: postBlog, isPending: creationLoader } = useMutation(
    trpcHttp.blog.createBlog.mutationOptions({
      onSuccess: () => {
        toast.success('Blog created successfully');
        refetchBlogs();
      },
      onError: (error) => {
        toast.error('Blog creation failed');
        console.log(error);
      }
    })
  );

  const { mutateAsync: updateBlog, isPending: updateLoader } = useMutation(
    trpcHttp.blog.editBlog.mutationOptions({
      onSuccess: () => {
        toast.success('Blog updated successfully');
        refetchBlogs();
        setEditingBlog(null);
      },
      onError: (error) => {
        toast.error('Blog update failed');
        console.log(error);
      }
    })
  );

  const { mutateAsync: deleteBlog, isPending: deleteLoader } = useMutation(
    trpcHttp.blog.deleteBlog.mutationOptions({
      onSuccess: () => {
        toast.success('Blog deleted successfully');
        refetchBlogs();
      },
      onError: (error) => {
        toast.error('Blog deletion failed');
        console.log(error);
      }
    })
  );

  const onSubmit = async (data: BlogForm) => {
    await postBlog(data);
    form.reset();
  };

  const handleEdit = (blog: { id: string; title: string; description: string; tag: string }) => {
    setEditingBlog(blog);
  };

  const handleUpdate = async () => {
    if (editingBlog) {
      console.log('Updated blog:', editingBlog);
      await updateBlog(editingBlog);
      setEditingBlog(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-5 md:gap-8 lg:px-7">
      <Card className="!w-full rounded-xl p-6 sm:!max-w-[800px]">
        <CardHeader className="flex w-full flex-col items-center gap-1 p-0 text-center sm:px-5">
          <CardTitle className="text-2xl font-bold">Create Blog</CardTitle>
          <CardDescription className="max-w-lg text-sm">Write a eye catching blog!</CardDescription>
        </CardHeader>

        {/* Blog Uplaod Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <Input {...form.register('title')} placeholder="Enter blog title" className="text-sm" />
            {form.formState.errors.title && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea
              {...form.register('description')}
              placeholder="Enter blog description"
              rows={4}
              className="text-sm"
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tag</label>
            <Input {...form.register('tag')} placeholder="Enter tag" className="text-sm" />
            {form.formState.errors.tag && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.tag.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            {creationLoader ? <Loader2 /> : 'Submit'}
          </Button>
        </form>
      </Card>

      {/* Blog List */}
      <div className="flex w-full flex-col gap-2 sm:gap-3">
        <h1 className="text-lg font-medium md:text-2xl">
          <strong>Blogs</strong> Posted
        </h1>
        <div className="grid grid-cols-1 justify-center gap-3 md:grid-cols-2 md:gap-10">
          {blogsLoader ? (
            <ComponentLoader />
          ) : (
            blogsData?.blogs.map((post) => (
              <Card
                key={post.id}
                className="group relative flex shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
                <CardHeader>
                  {editingBlog?.id === post.id ? (
                    <Input
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    />
                  ) : (
                    <CardTitle className="text-md text-foreground font-semibold sm:text-lg lg:text-xl">
                      ✨ {post.title}
                    </CardTitle>
                  )}
                </CardHeader>

                <CardContent className="flex-1 text-gray-600 dark:text-gray-300">
                  {editingBlog?.id === post.id ? (
                    <Textarea
                      value={editingBlog.description}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, description: e.target.value })
                      }
                    />
                  ) : (
                    <p className="sm:text-md text-sm lg:text-lg">{post.description}</p>
                  )}
                </CardContent>

                <CardFooter>
                  <div className="mt-4 flex w-full items-center justify-between gap-3 text-sm">
                    {editingBlog?.id === post.id ? (
                      <Input
                        value={editingBlog.tag}
                        onChange={(e) => setEditingBlog({ ...editingBlog, tag: e.target.value })}
                        className="w-full max-w-sm bg-amber-100 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      />
                    ) : (
                      <span className="max-w-[300px] truncate rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        🍂 {post.tag}
                      </span>
                    )}
                    <div className="flex flex-row gap-2">
                      {editingBlog?.id === post.id ? (
                        <Button onClick={handleUpdate}>
                          {updateLoader ? <Loader2 /> : 'Update'}
                        </Button>
                      ) : (
                        <Button
                          variant={'outline'}
                          className="cursor-pointer shadow-sm"
                          onClick={() => handleEdit(post)}>
                          Edit
                        </Button>
                      )}
                      <Button
                        variant={'destructive'}
                        className="cursor-pointer"
                        onClick={async () => {
                          await deleteBlog({ id: post.id });
                        }}>
                        {deleteLoader ? <Loader2 /> : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </CardFooter>

                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500 opacity-70" />
              </Card>
            ))
          )}{' '}
        </div>{' '}
      </div>
    </div>
  );
}

export default BlogsPage;
