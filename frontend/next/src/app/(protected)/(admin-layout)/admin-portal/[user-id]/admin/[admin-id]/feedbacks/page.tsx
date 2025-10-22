'use client';

import * as React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { format } from 'date-fns';
import { MoreHorizontal, Star, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { DataTable } from '~/shared/components/dataTable';

import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={clsx(
            'size-4',
            i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

export type Feedback = {
  id: string;
  email: string;
  description: string | null;
  rating: number;
  createdAt: Date;
};

export default function Page() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });

  const {
    data: feedbackData,
    isLoading,
    refetch: refetchFeedbacks
  } = useQuery(
    trpcHttp.reshub.getCustomerFeedback.queryOptions({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  const { mutateAsync: deleteFeedback } = useMutation(
    trpcHttp.reshub.deleteFeedbackById.mutationOptions({
      onSuccess: () => {
        toast.success('Feedback Deleted Successfully');
        refetchFeedbacks();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const { mutateAsync: deleteAllStock } = useMutation(
    trpcHttp.reshub.deleteAllFeedbacks.mutationOptions({
      onSuccess: () => {
        toast.success('Feedbacks Deleted Successfully');
        refetchFeedbacks();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const columns: ColumnDef<Feedback>[] = [
    {
      id: 'sno',
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <div className="text-center">{pageIndex * pageSize + row.index + 1}</div>;
      },
      enableSorting: false
    },
    {
      accessorKey: 'email',
      header: () => (
        <Button className="text-sm md:text-xl" variant="ghost">
          Email
        </Button>
      ),
      cell: ({ row }) => <div className="ml-3 font-medium">{row.getValue('email')}</div>
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const desc = row.getValue('rating') as number;
        return <StarRating value={desc} />;
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const desc = row.getValue('description') as string;
        return <div className="min-w-[250px] text-sm whitespace-normal">{desc || '—'}</div>;
      }
    },
    {
      accessorKey: 'feedbackDate',
      header: () => <div className="text-right">Posted On</div>,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formatted = format(date, 'yyyy-MM-dd');

        return <div className="text-right text-sm">{formatted}</div>;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await deleteFeedback({ feedbackId: row.original.id });
                  }}>
                  Delete Feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-5 p-3 lg:px-10">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-medium md:text-2xl">
          <strong>Users</strong> Feedback
        </h1>
        <div className="bg-foreground h-5 w-[1.5px]"></div>
        <Button
          variant={'ghost'}
          className="text-red-500"
          onClick={async () => {
            await deleteAllStock();
          }}>
          <Trash /> Delete all Feedbacks
        </Button>
      </div>
      <div className="gap-2 py-0">
        {/* Feedback Table */}
        {isLoading ? (
          <ComponentLoader />
        ) : (
          <div className="gap-2 py-0">
            <DataTable
              columns={columns}
              data={feedbackData?.feedbacks ?? []}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalRowCount={feedbackData?.totalLength ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
