'use client';

import * as React from 'react';

import { type StockEditTypes } from '@boozebunk-trpc/modules/stock/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MoreHorizontal, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '~/shared/shadcn/badge';
import { Button } from '~/shared/shadcn/button';
import { Checkbox } from '~/shared/shadcn/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { DataTable } from '~/shared/components/dataTable';
import { CustomDialog } from '~/shared/components/dialogBox';

import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';

type StockItem = {
  id: string;
  brand: string;
  productName: string;
  category: string;
  type: string | null;
  size: string;
  price: string;
  availability: boolean;
  productImageUrl: string | null;
};

export default function Page() {
  const [stockFilter, setStockFilter] = React.useState<'all' | 'in' | 'out'>('all');
  const [search, setSearch] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [stockId, setStockId] = React.useState<string>();
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const [openStockEdit, setOpenStockEdit] = React.useState(false);
  const queryClient = useQueryClient();

  const [editableStock, setEditableStock] = React.useState<StockEditTypes>({
    stockId: '',
    brandName: '',
    productName: '',
    category: '',
    type: '',
    size: '',
    price: ''
  });

  const columns: ColumnDef<StockItem>[] = [
    {
      id: 'select_sno',
      header: () => (
        <div className="mr-5 flex items-center gap-2 font-medium">
          <span>Select</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRowIds.includes(row.original.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  if (!selectedRowIds.includes(row.original.id)) {
                    setSelectedRowIds([...selectedRowIds, row.original.id]);
                  }
                } else {
                  setSelectedRowIds(selectedRowIds.filter((id) => id !== row.original.id));
                }
              }}
              aria-label="Select row"
            />
            <span>{row.index + 1}</span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="relative h-25 w-25 shrink-0 sm:h-35 sm:w-30">
            {!item.productImageUrl ? (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
                No image
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        );
      }
    },
    {
      id: 'Brand-Product',
      header: 'Brand / Product',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700 sm:text-base dark:text-gray-200">
              {item.brand},
            </span>
            <span className="text-sm text-[#6B0F1A] sm:text-lg dark:text-[#ffc82e]">
              {item.productName}
            </span>
          </div>
        );
      }
    },
    {
      id: 'Category-Type',
      header: 'Category / Type',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <Badge className="rounded-md bg-[#fff5cb] px-2 py-1 text-sm font-medium text-[#8B5E3C] sm:text-base">
                {item.category}
              </Badge>
            </div>
            <span className="text-sm font-normal text-gray-700 sm:text-base dark:text-gray-200">
              {item.type}
            </span>
          </div>
        );
      }
    },
    {
      id: 'Size-Price',
      header: 'Size / Price',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-2">
            <Badge className="rounded-md bg-[#DBEAFE] px-2 py-1 text-sm font-medium text-[#1E40AF] sm:text-base">
              {item.size}
            </Badge>
            <span className="text-sm font-normal text-gray-700 sm:text-base dark:text-gray-200">
              ₹{item.price}
            </span>
          </div>
        );
      }
    },
    {
      id: 'availability',
      header: () => <div className="text-right">Availability</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end">
            <ToggleGroup
              type="single"
              value={item.availability ? 'in' : 'out'}
              onValueChange={(val) => {
                if (val) {
                  const newStatus = val === 'in';
                  if (newStatus !== item.availability) {
                    handleIndividualUpdate(item.id, newStatus);
                  }
                }
              }}
              className="bg-muted grid w-max grid-cols-2 rounded-xl p-1">
              <ToggleGroupItem
                value="in"
                aria-label="In Stock"
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm data-[state=on]:bg-green-600">
                In
              </ToggleGroupItem>
              <ToggleGroupItem
                value="out"
                aria-label="Out of Stock"
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm data-[state=on]:bg-red-500">
                Out
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditableStock({
                  stockId: row.original.id,
                  brandName: row.original.brand,
                  productName: row.original.productName,
                  category: row.original.category,
                  type: row.original.type ?? '',
                  size: row.original.size,
                  price: row.original.price
                });
                setOpenStockEdit(true);
              }}>
              <Pencil />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                className="mt-1 w-full"
                variant="destructive"
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setStockId(row.original.id);
                }}>
                Delete Stock
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  // fetching vendor Stock Data
  const {
    data: stockData,
    isLoading,
    refetch: refetchVendorStocks
  } = useQuery(
    trpcHttp.stock.getVendorStock.queryOptions({
      search,
      stockFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  const { mutateAsync: editStock } = useMutation(
    trpcHttp.stock.editVendorStock.mutationOptions({
      onSuccess: () => {
        toast.success('Stock Updated Successfully');
        refetchVendorStocks();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const { mutateAsync: updateStock, isPending: isUpdatingStock } = useMutation(
    trpcHttp.stock.updateVendorStockAvailability.mutationOptions({
      onSuccess: () => {
        toast.success('Successfully Updated Stock');
        refetchVendorStocks();
        queryClient.removeQueries({
          queryKey: [['analytics', 'getStockOverview']]
        });
        setSelectedRowIds([]);
      },
      onError: (err) => {
        setSelectedRowIds([]);
        toast.error(err.message);
      }
    })
  );

  const { mutateAsync: deleteStock } = useMutation(
    trpcHttp.stock.deleteVendorStock.mutationOptions({
      onSuccess: () => {
        toast.success('Stock Deleted Successfully');
        setStockId('');
        refetchVendorStocks();
        queryClient.removeQueries({
          queryKey: [['analytics', 'getStockOverview']]
        });
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const handleMassUpdate = async (newStatus: boolean) => {
    if (selectedRowIds.length === 0) {
      toast.error('Please select at least one item to update.');
      return;
    }
    await updateStock({ stockIds: selectedRowIds, availability: newStatus });
  };

  const handleIndividualUpdate = async (stockId: string, newStatus: boolean) => {
    await updateStock({ stockIds: [stockId], availability: newStatus });
  };

  const handleEditStock = async () => {
    await editStock(editableStock);
    setEditableStock({
      stockId: '',
      brandName: '',
      productName: '',
      category: '',
      type: '',
      size: '',
      price: ''
    });
  };

  const handleDeleteStock = async () => {
    if (stockId) {
      await deleteStock({ stockId });
    } else {
      toast.warning('Select a Specific Stock');
    }
  };

  return (
    <>
      <CustomDialog
        title="Confirm Your Action?"
        description="Are you sure you want to delete this stock"
        actionText="Delete"
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onAction={() => {
          handleDeleteStock();
        }}
      />
      <CustomDialog
        title="Edit Your Stock Here"
        actionText="Edit"
        open={openStockEdit}
        onOpenChange={setOpenStockEdit}
        onAction={() => {
          handleEditStock();
        }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditStock();
          }}
          className="flex flex-col gap-3">
          <div>
            <label>Brand Name</label>
            <input
              type="text"
              value={editableStock.brandName}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  brandName: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={editableStock.productName}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  productName: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Category</label>
            <input
              type="text"
              value={editableStock.category}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  category: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Type</label>
            <input
              type="text"
              value={editableStock.type}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  type: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Size</label>
            <input
              type="text"
              value={editableStock.size}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  size: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="text"
              value={editableStock.price}
              onChange={(e) =>
                setEditableStock((prev: StockEditTypes) => ({
                  ...prev,
                  price: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
        </form>
      </CustomDialog>
      <div className="flex flex-col gap-3 p-3 lg:px-10">
        <h1 className="font-medium md:text-2xl">
          <strong>All the Stock</strong> Listed
        </h1>

        <div className="flex flex-col items-start gap-3 sm:gap-5 lg:flex-row">
          {/* Top filter toggle */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-5">
            <ToggleGroup
              type="single"
              value={stockFilter}
              onValueChange={(val) => val && setStockFilter(val as 'all' | 'in' | 'out')}
              className="bg-background flex w-[300px]">
              <ToggleGroupItem value="all" aria-label="All Stock">
                All Stock
              </ToggleGroupItem>
              <ToggleGroupItem value="in" aria-label="In Stock">
                In Stock
              </ToggleGroupItem>
              <ToggleGroupItem value="out" aria-label="Out of Stock">
                Out of Stock
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Stock updation buttons */}
          <div className="flex items-start gap-3">
            <Button
              className="w-fit bg-green-600 text-white"
              onClick={() => handleMassUpdate(true)}
              disabled={isUpdatingStock || selectedRowIds.length === 0}>
              {isUpdatingStock ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Update to In-Stock'
              )}
            </Button>
            <Button
              className="w-fit bg-red-600 text-white"
              onClick={() => handleMassUpdate(false)}
              disabled={isUpdatingStock || selectedRowIds.length === 0}>
              {isUpdatingStock ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Update to Out-of-Stock'
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 gap-2 py-0">
          <Input
            placeholder="Search by stock name..."
            className="mb-3 max-w-[100%] text-sm sm:w-[50%] md:text-lg"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {isLoading ? (
            <ComponentLoader />
          ) : (
            <DataTable
              columns={columns}
              data={stockData?.vendorStocks ?? []}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalRowCount={stockData?.totalCount ?? 0}
            />
          )}
        </div>
      </div>
    </>
  );
}
