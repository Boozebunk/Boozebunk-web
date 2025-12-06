'use client';

import * as React from 'react';

import { type BulkUploadStockType } from '@boozebunk-trpc/modules/stock/dto';
import { useMutation } from '@tanstack/react-query';
import { Loader2, PackagePlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '~/shared/shadcn/command';
import { Input } from '~/shared/shadcn/input';
import { Label } from '~/shared/shadcn/label';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { CSVImport } from '~/shared/components/csv-import';
import { CustomDialog } from '~/shared/components/dialogBox';

import { queryClient, trpcHttp } from '~/utils/trpc';

import liquorDataJson from './StockInfo.json';

interface LiquorCategory {
  name: string;
  types: string[];
  sizes: string[];
}

interface LiquorData {
  brands: string[];
  categories: LiquorCategory[];
}

const liquorData = liquorDataJson as LiquorData;

interface ComboboxInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function ComboboxInput({ label, placeholder, value, onChange, options }: ComboboxInputProps) {
  const [open, setOpen] = React.useState(false);

  const filteredOptions =
    value.trim() === ''
      ? options
      : options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative flex flex-col gap-2">
      <Label className="font-semibold">{label}</Label>
      <Command className="rounded-md border text-sm shadow-sm">
        <CommandInput
          placeholder={placeholder}
          value={value}
          onValueChange={(search) => {
            onChange(search);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="h-9"
        />
        {open && (
          <CommandGroup className="bg-muted top-full z-10 mt-1 max-h-48 w-full overflow-y-scroll rounded-md border shadow-md">
            {filteredOptions.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              filteredOptions.map((opt, idx) => (
                <CommandItem
                  key={`${opt}-${idx}`}
                  value={opt}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="cursor-pointer">
                  {opt}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}
      </Command>
    </div>
  );
}

export default function VendorRegistrationPage() {
  const [brand, setBrand] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [type, setType] = React.useState('');
  const [size, setSize] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState<string>('');
  const [openBulkUpload, setOpenBulkUpload] = React.useState(false);

  const brandOptions = liquorData.brands;
  const categoryOptions = liquorData.categories.map((cat) => cat.name);
  const selectedCategory = liquorData.categories.find((cat) => cat.name === category);
  const typeOptions = selectedCategory ? selectedCategory.types : [];
  const sizeOptions = selectedCategory ? selectedCategory.sizes : [];

  const { mutateAsync: AddStock, isPending } = useMutation(
    trpcHttp.stock.addStock.mutationOptions({
      onSuccess: () => {
        toast.success('Stock Added Successfully');
        setBrand('');
        setCategory('');
        setType('');
        setSize('');
        setProductName('');
        setPrice('0');
        queryClient.removeQueries({
          queryKey: [['stock', 'getVendorStock']]
        });
        queryClient.removeQueries({
          queryKey: [['analytics', 'getStockOverview']]
        });
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  const { mutateAsync: BulkUploadStock, isPending: isBulkUploadPending } = useMutation(
    trpcHttp.stock.bulkUploadStock.mutationOptions({
      onSuccess: () => {
        toast.success('Stock Bulk-Uploaded Successfully');
        queryClient.removeQueries({ queryKey: [['stock', 'getVendorStock']] });
        queryClient.removeQueries({
          queryKey: [['analytics', 'getStockOverview']]
        });
        setOpenBulkUpload(false);
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation: Only 'type' is optional
    if (!productName.trim() || !brand.trim() || !category.trim() || !size.trim()) {
      toast.error('Please fill all required fields: Product Name, Brand, Category, and Size.');
      return;
    }

    const payload = {
      productName,
      brand,
      category,
      type,
      size,
      price: price || '0',
      availability: true
    };
    await AddStock(payload);
  }

  const handleBulkUpload = async (data: string[][]) => {
    BulkUploadStock({ data: data as BulkUploadStockType });
  };

  return (
    <>
      <CustomDialog
        className="w-100%"
        title="Upload Stock CSV file"
        open={openBulkUpload}
        onOpenChange={setOpenBulkUpload}>
        {isBulkUploadPending ? <ComponentLoader /> : <CSVImport onImport={handleBulkUpload} />}
      </CustomDialog>

      <div className="bg-background flex min-h-screen w-full justify-center p-0 pb-5 sm:p-5 sm:py-0">
        <Card className="flex h-fit w-[900px] gap-10 border-0 bg-transparent shadow-none">
          <CardHeader className="flex w-full flex-col items-center gap-1 text-center">
            <PackagePlus className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
            <CardTitle className="text-2xl font-bold">New Product</CardTitle>
            <CardDescription className="max-w-lg text-sm">
              Fill in the details below to add the product.
            </CardDescription>
          </CardHeader>

          <CardContent className="w-full">
            <section className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr] sm:gap-10">
              {/* Right column: product details */}
              <div className="col-span-2 mt-8 flex flex-col gap-5 sm:mt-0">
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold" htmlFor="productName">
                    Product Name*
                  </Label>
                  <Input
                    id="productName"
                    className="text-sm"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                    }}
                    placeholder="e.g. Jack Daniel's Old No. 7"
                    required
                  />
                </div>

                {/* Combobox fields */}
                <ComboboxInput
                  label="Brand*"
                  placeholder="e.g. Jack Daniel's"
                  value={brand}
                  onChange={setBrand}
                  options={brandOptions}
                />

                <ComboboxInput
                  label="Category*"
                  placeholder="e.g. Whiskey"
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setType('');
                    setSize('');
                  }}
                  options={categoryOptions}
                />

                <ComboboxInput
                  label="Type*"
                  placeholder="e.g. Bourbon"
                  value={type}
                  onChange={setType}
                  options={typeOptions}
                />

                <ComboboxInput
                  label="Size*"
                  placeholder="e.g. 750ml"
                  value={size}
                  onChange={setSize}
                  options={sizeOptions}
                />

                <div className="flex flex-col gap-2">
                  <Label className="font-semibold" htmlFor="price">
                    Price*
                  </Label>
                  <Input
                    id="price"
                    className="text-sm"
                    type="number"
                    min="0"
                    placeholder="e.g. 2000"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
            </section>
          </CardContent>

          <CardFooter className="flex w-full flex-row gap-4">
            <Button
              onClick={() => {
                setOpenBulkUpload(true);
              }}>
              Bulk Upload
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex w-full flex-1 items-center justify-center gap-2 bg-[#6B0F1A] text-white hover:bg-[#44101b]"
              disabled={
                isPending ||
                !productName.trim() ||
                !brand.trim() ||
                !category.trim() ||
                !size.trim()
              }>
              {isPending ? <Loader2 /> : 'Add Product'}
              <PackagePlus />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
