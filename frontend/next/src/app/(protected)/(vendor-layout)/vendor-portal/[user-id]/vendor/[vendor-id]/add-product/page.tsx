'use client';

import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, PackagePlus } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';

import { trpcHttp } from '~/utils/trpc';

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
              filteredOptions.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onMouseDown={(e) => {
                    e.preventDefault(); // ensures onBlur doesn't close first
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
  const [preview, setPreview] = React.useState<string | null>(null);

  const [brand, setBrand] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [type, setType] = React.useState('');
  const [size, setSize] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [availability, setAvailability] = React.useState(true);
  const [price, setPrice] = React.useState(0);

  const brandOptions = liquorData.brands;
  const categoryOptions = liquorData.categories.map((cat) => cat.name);
  // find selected category object
  const selectedCategory = liquorData.categories.find((cat) => cat.name === category);
  const typeOptions = selectedCategory ? selectedCategory.types : [];
  const sizeOptions = selectedCategory ? selectedCategory.sizes : [];

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  // revoke object URL on unmount/preview change
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { mutateAsync: AddStock, isPending } = useMutation(
    trpcHttp.stock.addStock.mutationOptions({
      onSuccess: () => {
        toast.success('Stock Added Successfully');
      },
      onError: (err) => {
        toast.error('Error Occurred');
        console.log(err);
      }
    })
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      productName,
      brand,
      category,
      type,
      size,
      price: price.toString(),
      availability
    };
    console.log(payload);
    await AddStock(payload);
  }

  return (
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
            {/* Left column */}
            <div className="flex flex-row items-center justify-center gap-3 sm:flex-col sm:justify-normal sm:gap-10">
              {/* Image upload */}
              <div className="flex flex-col items-center gap-2">
                <Label className="text-lg font-semibold" htmlFor="productImage">
                  Product Image
                </Label>
                <div className="flex w-full">
                  <label
                    htmlFor="productImage"
                    className="hover:bg-muted relative flex aspect-square h-60 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors">
                    {preview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Selected product"
                          className="z-0 h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreview(null);
                          }}
                          className="absolute inset-0 z-10 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/60 p-2 text-white hover:bg-black/80">
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ImagePlus />
                        <p className="text-muted-foreground text-sm">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-muted-foreground text-xs">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="productImage"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex flex-col gap-1">
                <Label className="text-lg font-semibold">Availability</Label>
                <ToggleGroup
                  type="single"
                  value={availability ? 'in' : 'out'}
                  onValueChange={(value) => {
                    if (value === 'in') {
                      setAvailability(false);
                    } else {
                      setAvailability(true);
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
            </div>

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
                    setPrice(parseFloat(e.target.value));
                  }}
                  required
                />
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="flex w-full flex-col gap-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 bg-[#6B0F1A] text-white hover:bg-[#44101b]"
            disabled={isPending}>
            {isPending ? <Loader2 /> : 'Add Product'}
            <PackagePlus />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
