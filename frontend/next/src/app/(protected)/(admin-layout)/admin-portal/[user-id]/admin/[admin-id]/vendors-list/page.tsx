'use client';

import * as React from 'react';

import { type EditVendorTypes } from '@boozebunk-trpc/modules/vendor/dto';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/shadcn/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { DataTable } from '~/shared/components/dataTable';
import { CustomDialog } from '~/shared/components/dialogBox';

import { VendorsOverview } from '~/components/admin-dashboard/vendors-list/vendorsOverview';
import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';

export type VendorsDataType = {
  id: string;
  martName: string;
  vendorName: string | null;
  phoneNumber: string | null;
  RegisteredOn: Date;
  isActive: boolean;
  licenseNumber: string | null;
  vendorEmail: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  addressArea: string | null;
};

export default function Page() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [search, setSearch] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [isActiveToggle, setIsActiveToggle] = React.useState(true);
  const [openVendorActiveDialog, setOpenVendorActiveDialog] = React.useState(false);
  const [openVendorDelete, setOpenVendorDelete] = React.useState(false);
  const [openVendorEdit, setOpenVendorEdit] = React.useState(false);

  const [activeFroozenContext, setActiveFroozenContext] = React.useState('Activate');

  const [vendorId, setVendorId] = React.useState<string>('');
  const [vendorEmail, setVendorEmail] = React.useState<string>('');

  const [editableVedorDetails, setEditableVedorDetails] = React.useState<EditVendorTypes>({
    vendorId: '',
    martName: '',
    licenseNumber: '',
    vendorName: '',
    phoneNumber: ''
  });

  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  const columns: ColumnDef<VendorsDataType>[] = [
    {
      id: 'sno',
      header: () => <div className="w-12 text-center">S.No</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>
    },
    {
      accessorKey: 'martName',
      header: () => (
        <Button className="text-sm md:text-xl" variant="ghost" onClick={() => {}}>
          Mart Name
        </Button>
      ),
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="ml-3 flex min-w-[150px] flex-col gap-1 font-medium whitespace-normal">
            <span>{vendor.martName}</span>
            <span>{vendor.licenseNumber}</span>
          </div>
        );
      }
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
            <div className="text-muted-foreground">{vendor.phoneNumber}</div>
          </div>
        );
      }
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex flex-col gap-1 text-sm leading-tight">
            <span className="text-muted-foreground min-w-[250px] text-left text-sm whitespace-normal">
              {vendor.addressArea}
            </span>

            <span>{vendor.addressCity}</span>
            <span>{vendor.addressState}</span>
            <span>{vendor.addressPostalCode}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'Registered On',
      header: () => <div className="text-right">Registered On</div>,
      cell: ({ row }) => {
        const vendor = row.original;
        const date = new Date(vendor.RegisteredOn);
        const formatted = format(date, 'yyyy-MM-dd');
        return <div className="text-right text-sm">{formatted}</div>;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const vendor = row.original;
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
                  onClick={() => {
                    setEditableVedorDetails({
                      vendorId: vendor.id,
                      martName: vendor.martName,
                      licenseNumber: vendor.licenseNumber ?? '',
                      phoneNumber: vendor.phoneNumber ?? '',
                      vendorName: vendor.vendorName ?? ''
                    });
                    setOpenVendorEdit(true);
                  }}>
                  Edit vendor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {vendor.isActive ? (
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveFroozenContext('Freeze');
                      setVendorId(vendor.id);
                      setOpenVendorActiveDialog(true);
                    }}>
                    Freeze vendor
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveFroozenContext('Activate');
                      setVendorId(vendor.id);
                      setOpenVendorActiveDialog(true);
                    }}>
                    Activate vendor
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setVendorId(vendor.id);
                    setVendorEmail(vendor.vendorEmail!);
                    setOpenVendorDelete(true);
                  }}>
                  Delete vendor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
    }
  ];

  //fetching vendors data - filtered and paginated
  const {
    data: vendorsList,
    isLoading,
    refetch: refetchVendorsList
  } = useQuery(
    trpcHttp.vendor.getVendorsList.queryOptions({
      search: debouncedSearch,
      isActive: isActiveToggle,
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  //fetching  vendors overview
  const {
    data: vendorsOverview,
    isLoading: loadingVendorOverview,
    refetch: refetchVendorOverview
  } = useQuery(trpcHttp.vendor.getVendorsOverview.queryOptions());

  //Edit activity of vendor mutation
  const { mutateAsync: EditVendorActivity } = useMutation(
    trpcHttp.vendor.editVendorActivity.mutationOptions({
      onSuccess: () => {
        toast.success('successfully updated vendor activity');
        refetchVendorsList();
        refetchVendorOverview();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  //Edit Vendor Details
  const { mutateAsync: EditVendorDetails } = useMutation(
    trpcHttp.vendor.editVendor.mutationOptions({
      onSuccess: () => {
        toast.success('Details Edited Successfully');
        refetchVendorsList();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  //Delete Vendor mutation
  const { mutateAsync: DeleteVendor } = useMutation(
    trpcHttp.vendor.deleteVendor.mutationOptions({
      onSuccess: () => {
        toast.success('vendor deleted Successfully');
        refetchVendorsList();
        refetchVendorOverview();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const handleVendorAccountActivityChange = async () => {
    await EditVendorActivity({ vendorId });
  };

  const handleDeleteVendorAccount = async () => {
    await DeleteVendor({ vendorId, vendorEmail });
  };

  const handleEditVendorDetails = async () => {
    await EditVendorDetails(editableVedorDetails);
    setEditableVedorDetails({
      martName: '',
      vendorName: '',
      vendorId: '',
      licenseNumber: '',
      phoneNumber: ''
    });
  };

  return (
    <div>
      {/* Custom Dialog Boxes */}
      <CustomDialog
        title="Confirm Your Action?"
        description={`Are you sure you want to ${activeFroozenContext} this vendor Account?`}
        actionText={activeFroozenContext == 'Activate' ? 'Activate' : 'Freeze'}
        onOpenChange={setOpenVendorActiveDialog}
        open={openVendorActiveDialog}
        onAction={() => {
          handleVendorAccountActivityChange();
        }}
      />
      <CustomDialog
        title="Confirm Your Action?"
        description={`Are you sure you want to Delete this vendor Account?, note that this action cannot be un-done`}
        actionText="Delete"
        onOpenChange={setOpenVendorDelete}
        open={openVendorDelete}
        onAction={() => {
          handleDeleteVendorAccount();
        }}
      />
      <CustomDialog
        title="Can Edit the following details"
        actionText="Edit"
        onOpenChange={setOpenVendorEdit}
        open={openVendorEdit}
        onAction={() => {
          handleEditVendorDetails();
        }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditVendorDetails();
          }}
          className="flex flex-col gap-3">
          <div>
            <label>Mart Name</label>
            <input
              type="text"
              value={editableVedorDetails.martName}
              onChange={(e) =>
                setEditableVedorDetails((prev: EditVendorTypes) => ({
                  ...prev,
                  martName: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Vendor Name</label>
            <input
              type="text"
              value={editableVedorDetails.vendorName}
              onChange={(e) =>
                setEditableVedorDetails((prev: EditVendorTypes) => ({
                  ...prev,
                  vendorName: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={editableVedorDetails.phoneNumber}
              onChange={(e) =>
                setEditableVedorDetails((prev: EditVendorTypes) => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label>License Number</label>
            <input
              type="text"
              value={editableVedorDetails.licenseNumber}
              onChange={(e) =>
                setEditableVedorDetails((prev: EditVendorTypes) => ({
                  ...prev,
                  licenseNumber: e.target.value
                }))
              }
              className="w-full rounded border px-2 py-1"
            />
          </div>
        </form>
      </CustomDialog>

      <VendorsOverview
        totalVendors={vendorsOverview?.totalVendors ?? 0}
        activeVendors={vendorsOverview?.activeVendors ?? 0}
        frozenVendors={vendorsOverview?.frozenVendors ?? 0}
        isLoading={loadingVendorOverview}
      />

      <div className="flex flex-col gap-3 p-3 lg:px-10">
        <h1 className="font-medium md:text-2xl">
          <strong>List</strong> of all the Vendors
        </h1>

        {/* Filters Row */}
        <div className="flex flex-col items-start gap-3 lg:flex-row">
          <div className="flex items-start gap-3">
            {/*Active/Frozen filter*/}
            <ToggleGroup variant="outline" type="multiple">
              <ToggleGroup
                type="single"
                value={isActiveToggle ? 'Active' : 'Frozen'}
                onValueChange={(val) => setIsActiveToggle(val === 'Active')}
                className="border-none">
                <ToggleGroupItem value="Active" aria-label="Set Active">
                  Active
                </ToggleGroupItem>
                <ToggleGroupItem value="Frozen" aria-label="Set Frozen">
                  Frozen
                </ToggleGroupItem>
              </ToggleGroup>
            </ToggleGroup>

            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`max-w-[250px] justify-between text-left font-normal ${
                    !dateRange?.from && 'text-muted-foreground'
                  }`}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                      {format(dateRange.to, 'MMM dd, yyyy')}
                    </>
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range || undefined);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Search Bar */}
          <Input
            placeholder="Search for a vendor by any of his details..."
            className="text-sm sm:max-w-[550px] md:text-lg"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Vendors Table */}
        {isLoading ? (
          <ComponentLoader />
        ) : (
          <div className="gap-2 py-0">
            <DataTable
              columns={columns}
              data={vendorsList?.vendorsData ?? []}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalRowCount={vendorsList?.totalCount ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
