import { useState } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/shared/shadcn/card';
import { CustomDialog } from '~/shared/components/dialogBox';

const blogPost = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `The Secret to Perfectly Aged Wine #${i + 1}`,
  description: `Aging wine is an art that requires patience, the right temperature, and careful storage. Properly aged wine develops a rich aroma, smooth texture, and deep flavors that transform each sip into a luxurious experience. Learn how to store your bottles to perfection and elevate your wine-tasting journey.`,
  tag: 'Wine Tips'
}));

export function Blog() {
  const [openBlog, setOpenBlog] = useState<boolean>(false);

  return (
    <>
      <CustomDialog
        open={openBlog}
        customCancelBtn="bg-red-500 text-white shadow-xl"
        cancelText="Close"
        onOpenChange={setOpenBlog}>
        <div className="flex w-full min-w-[330px] flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              🍂 Wine Tips
            </span>
            <h1 className="text-md font-semibold sm:text-lg lg:text-xl">
              ✨ The Secret to Perfectly Aged Wine
            </h1>
          </div>
          <p className="sm:text-md text-sm text-gray-700 lg:text-lg dark:text-gray-300">
            Aging wine is an art that requires patience, the right temperature, and careful storage.
            Properly aged wine develops a rich aroma, smooth texture, and deep flavors that
            transform each sip into a luxurious experience. Learn how to store your bottles to
            perfection and elevate your wine-tasting journey.
          </p>
        </div>
      </CustomDialog>

      <div className="flex w-full flex-col gap-5 px-5 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Curated{' '}
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-center font-bold text-transparent">
              Reads ✨
            </span>
          </h1>
        </div>
        <div className="flex w-full flex-row items-stretch gap-5 overflow-x-scroll sm:gap-8">
          {blogPost.map((post) => (
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
                <div className="mt-4 flex w-full items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    🍂 {post.tag}
                  </span>
                  <button
                    onClick={() => setOpenBlog(true)}
                    className="flex cursor-pointer items-center text-sm font-medium text-amber-600 transition-colors hover:text-rose-500 dark:text-amber-400 dark:hover:text-rose-400">
                    Read more ↗
                  </button>
                </div>
              </CardFooter>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500 opacity-70" />
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
