'use client';

import * as React from 'react';

import clsx from 'clsx';
import { MoreHorizontal, Star, Trash } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { DataTable } from '~/shared/components/dataTable';

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
  email: string;
  rating: number;
  description: string;
  feedbackDate: string;
};

const data: Feedback[] = [
  {
    email: 'john.doe@example.com',
    rating: 4,
    description: 'Great experience overall!',
    feedbackDate: '2025-08-08'
  },
  {
    email: 'jane.smith@example.com',
    rating: 5,
    description: '',
    feedbackDate: '2025-08-07'
  },
  {
    email: 'rohit.patel@example.com',
    rating: 3,
    description:
      'Could improve in certain areas and this is a fantastic product by the way keep it up! Your rocking go on guys achieve the best you can.',
    feedbackDate: '2025-08-05'
  },
  {
    email: 'lisa.chen@example.com',
    rating: 2,
    description: 'Not very satisfied.',
    feedbackDate: '2025-08-03'
  }
];

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
    header: () => <div className="text-right">Posted Date</div>,
    cell: ({ row }) => {
      const dateStr = row.getValue('feedbackDate') as string;
      const date = new Date(dateStr);
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`;

      return <div className="text-right text-sm">{formatted}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({}) => {
      // const feedback = row.original;
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
              <DropdownMenuItem variant="destructive">Delete Feedback</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
  }
];

export default function Page() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });

  return (
    <div className="flex flex-col gap-5 p-3 lg:px-10">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-medium md:text-2xl">
          <strong>Users</strong> Feedback
        </h1>
        <div className="bg-foreground h-5 w-[1.5px]"></div>
        <Button variant={'ghost'} className="text-red-500">
          <Trash /> Delete all
        </Button>
      </div>
      <div className="gap-2 py-0">
        {/* Queries Table */}
        {/* {isLoading ? (
          <ComponentLoader />
        ) : ( */}
        <div className="gap-2 py-0">
          <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalRowCount={data.length}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
