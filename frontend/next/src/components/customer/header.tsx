'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Check, ChevronsUpDown, Loader2, MapPin, Search, X } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/shared/shadcn/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '~/shared/shadcn/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';

import { useCustomerContext } from '~/providers/customer-provider';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

import LiquorSearch from './SearchBar';

type headerProps = {
  cities: { city: string }[];
  isLoadingCities: boolean;
};

export function Header({ cities, isLoadingCities }: headerProps) {
  const { locationStatus, nearbyVendorsLoading, selectedCity, setSelectedCity } =
    useCustomerContext();
  const [open, setOpen] = React.useState(false);
  const [isSearchBarOpen, setSearchBarOpen] = React.useState<boolean>(false);

  // The search bar should be disabled if location is denied, unsupported, or if nearby vendors are still loading
  const isSearchDisabled = locationStatus !== 'granted' || nearbyVendorsLoading;
  return (
    <div className="sticky top-0 z-20 flex w-full transform-gpu flex-col gap-5 bg-[#fff5cb] px-5 py-4 shadow-md lg:px-25 lg:py-5">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-5">
        {/* LOGO */}
        <Button asChild className="w-fit bg-transparent p-0 shadow-none hover:bg-transparent">
          <Link href="#" className="flex items-center justify-baseline p-0">
            <Image src={Logo} alt="logo" className="w-5 sm:w-6" />
            <Image src={Logo2} alt="logo" className="ml-[-5px] w-30 sm:w-35" />
          </Link>
        </Button>

        <div className="relative hidden w-full max-w-[700px] md:block">
          <LiquorSearch isSearchDisabled={isSearchDisabled} />
        </div>

        <div className="flex items-center gap-1 sm:gap-5">
          <Button
            onClick={() => setSearchBarOpen(!isSearchBarOpen)}
            variant={'ghost'}
            className="active:bg-accent text-accent flex h-9 w-9 items-center justify-center rounded-full active:text-white md:hidden">
            {!isSearchBarOpen ? <Search className="size-6" /> : <X className="size-6" />}
          </Button>
          {/* Cities dropdown */}
          {isLoadingCities ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition sm:text-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-yellow-600" />
                    {selectedCity || (
                      <>
                        <span className="hidden sm:inline">Select City</span>
                        <span className="inline sm:hidden">City</span>
                      </>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 sm:ml-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {cities.map((city) => (
                      <CommandItem
                        key={city.city}
                        value={city.city}
                        onSelect={(currentValue) => {
                          setSelectedCity(currentValue);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCity === city.city ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {city.city}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      {isSearchBarOpen && <LiquorSearch isSearchDisabled={isSearchDisabled} />}
    </div>
  );
}
