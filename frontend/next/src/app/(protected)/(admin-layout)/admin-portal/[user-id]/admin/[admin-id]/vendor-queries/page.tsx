'use client';

import * as React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MoreHorizontal, Trash } from 'lucide-react';
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
import { CustomDialog } from '~/shared/components/dialogBox';

import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';

export type Queries = {
  id: string;
  martName: string | null;
  vendorName: string | null;
  vendorEmail: string | null;
  vendorPhone: string | null;
  title: string;
  description: string;
  vendorCity: string | null;
  vendorState: string | null;
  vendorPostalCode: string | null;
  queryDate: Date;
};

export default function Page() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });

  const [openQueryDelete, setOpenQueryDelete] = React.useState(false);

  const {
    data,
    isLoading,
    refetch: vendorQueriesRefetch
  } = useQuery(
    trpcHttp.reshub.getVendorQueries.queryOptions({
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex
    })
  );

  const { mutateAsync: DeleteSingleQuery } = useMutation(
    trpcHttp.reshub.deleteQueryById.mutationOptions({
      onSuccess: () => {
        toast.success('Query Deleted Successfully');
        vendorQueriesRefetch();
      },
      onError: (err) => {
        toast.error('Query Deletion Failed');
        console.log('Error deleting Query ', err.message);
      }
    })
  );

  const { mutateAsync: DeleteAllQueries } = useMutation(
    trpcHttp.reshub.deleteAllQueries.mutationOptions({
      onSuccess: () => {
        toast.success('Queries Deleted Successfully');
        vendorQueriesRefetch();
      },
      onError: (err) => {
        toast.error('Deletion Queries Failed');
        console.log('Error deleting Queries ', err.message);
      }
    })
  );

  const columns: ColumnDef<Queries>[] = [
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
      accessorKey: 'martName',
      header: () => (
        <Button className="text-sm md:text-xl" variant="ghost">
          Mart Name
        </Button>
      ),
      cell: ({ row }) => <div className="ml-3 font-medium">{row.getValue('martName')}</div>
    },
    {
      id: 'vendorDetails',
      header: 'Vendor Details',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex flex-col space-y-1 text-sm">
            <div className="font-medium">{vendor.vendorName}</div>
            <div className="text-muted-foreground lowercase">{vendor.vendorEmail}</div>
            <div className="text-muted-foreground">{vendor.vendorPhone}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'Query',
      header: 'Vendor Query',
      cell: ({ row }) => {
        const query = row.original;
        return (
          <div className="min-w-[250px] whitespace-normal">
            <p className="text-base font-bold">{query.title}</p>
            <p>{query.description}</p>
          </div>
        );
      }
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const queryLoc = row.original;
        return (
          <div className="flex flex-col gap-1 text-sm leading-tight">
            {queryLoc.vendorCity},{' '}
            <span className="text-muted-foreground">
              {queryLoc.vendorState}, {queryLoc.vendorPostalCode}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'queryDate',
      header: () => <div className="text-right">Query Date</div>,
      cell: ({ row }) => {
        const date = new Date(row.original.queryDate);
        const formatted = format(date, 'yyyy-MM-dd');

        return <div className="text-right text-sm">{formatted}</div>;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const query = row.original;
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
                  onClick={() => {
                    handleSingleQueryDelete(query.id);
                  }}>
                  Delete Query
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
    }
  ];

  const handleSingleQueryDelete = async (queryId: string) => {
    await DeleteSingleQuery({ queryId });
  };

  return (
    <>
      <CustomDialog
        title="Confirm Your Action?"
        description={`Are you sure you want to delete all the queries?, note that this action cannot be un-done`}
        actionText="Delete"
        onOpenChange={setOpenQueryDelete}
        open={openQueryDelete}
        onAction={async () => {
          await DeleteAllQueries();
        }}
      />
      <div className="flex flex-col gap-5 p-3 lg:px-10">
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-medium md:text-2xl">
            <strong>Vendors</strong> Queries
          </h1>
          <div className="bg-foreground h-5 w-[1.5px]"></div>
          <Button
            variant={'ghost'}
            className="text-red-500"
            onClick={() => setOpenQueryDelete(true)}>
            <Trash /> Delete all
          </Button>
        </div>

        <div className="gap-2 py-0">
          {/* Queries Table */}
          {isLoading ? (
            <ComponentLoader />
          ) : (
            <div className="gap-2 py-0">
              <DataTable
                columns={columns}
                data={data?.queries ?? []}
                pagination={pagination}
                onPaginationChange={setPagination}
                totalRowCount={data?.totalLength ?? 0}
              />
            </div>
          )}
        </div>
      </div>{' '}
    </>
  );
}
