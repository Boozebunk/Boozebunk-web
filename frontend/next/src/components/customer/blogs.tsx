'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2, ScrollText } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle
} from '~/shared/shadcn/alert-dialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/shared/shadcn/card';

import { trpcHttp } from '~/utils/trpc';

export function Blog() {
  const [openBlog, setOpenBlog] = useState<boolean>(false);
  const [currentPostId, setCurrentPostId] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timer | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data: blogsData, isLoading: blogsLoader } = useQuery(
    trpcHttp.blog.getAllBlogs.queryOptions()
  );

  const currentPost = blogsData?.blogs.find((post) => post.id === currentPostId);

  // Function to start scrolling
  const startScrolling = () => {
    if (scrollInterval.current) return; // already scrolling
    scrollInterval.current = setInterval(() => {
      if (!scrollRef.current) return;

      const el = scrollRef.current;

      // If reached end, reset instantly without smooth
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 1; // move by 2px
      }
    }, 10); // smaller = smoother
  };

  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  // start scrolling on mount
  useEffect(() => {
    startScrolling();
    return () => {
      stopScrolling();
    };
  }, []);

  const handleMouseEnter = () => {
    stopScrolling();
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handleMouseLeave = () => {
    // resume scrolling after 4 seconds
    hoverTimeout.current = setTimeout(() => {
      startScrolling();
    }, 1000);
  };

  return (
    <>
      <AlertDialog open={openBlog} onOpenChange={setOpenBlog}>
        <AlertDialogContent className="h-fit max-h-[90vh] w-fit !max-w-full overflow-auto">
          {currentPost && (
            <div className="flex w-full min-w-[330px] flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  🍂 {currentPost.tag}
                </span>
                <AlertDialogTitle asChild>
                  <h1 className="text-md font-semibold sm:text-lg lg:text-xl">
                    ✨ {currentPost.title}
                  </h1>
                </AlertDialogTitle>
              </div>
              <p className="sm:text-md text-sm text-gray-700 lg:text-lg dark:text-gray-300">
                {currentPost.description}
              </p>
            </div>
          )}
          <AlertDialogFooter className="sticky bottom-0">
            <AlertDialogCancel className="cursor-pointer bg-red-600 text-white shadow-md">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex w-full flex-col gap-5 px-5 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Curated{' '}
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-center font-bold text-transparent">
              Reads ✨
            </span>
          </h1>
        </div>
        <div
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex w-full flex-row items-stretch gap-5 overflow-x-scroll pb-3 sm:gap-8 [&::-webkit-scrollbar]:hidden">
          {blogsLoader ? (
            <div className="flex h-40 w-full items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg font-medium">Loading Blogs...</span>
              </div>
            </div>
          ) : blogsData?.blogs && blogsData.blogs.length > 0 ? (
            blogsData?.blogs.map((post) => (
              <Card
                key={post.id}
                className="group relative flex w-[330px] shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:shadow-xl md:w-[400px] lg:w-[500px] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800">
                <CardHeader>
                  <CardTitle className="text-md text-foreground line-clamp-2 max-w-[330px] font-semibold sm:max-w-[450px] sm:text-lg lg:max-w-[500px] lg:text-xl">
                    ✨ {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 text-gray-600 dark:text-gray-300">
                  <p className="sm:text-md line-clamp-4 max-w-[330px] text-sm sm:max-w-[450px] lg:max-w-[500px] lg:text-lg">
                    {post.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <div className="mt-4 flex w-full items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="max-w-[300px] truncate rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      🍂 {post.tag}
                    </span>
                    <button
                      onClick={() => {
                        setOpenBlog(true);
                        setCurrentPostId(post.id);
                      }}
                      className="flex shrink-0 cursor-pointer items-center text-sm font-medium text-amber-600 transition-colors hover:text-rose-500 dark:text-amber-400 dark:hover:text-rose-400">
                      Read more ↗
                    </button>
                  </div>
                </CardFooter>

                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500 opacity-70" />
              </Card>
            ))
          ) : (
            <div className="sm:text-md flex w-full items-center justify-center text-sm text-gray-500 md:text-lg">
              <ScrollText className="text-accent mr-2 !size-5" /> No blogs available.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
