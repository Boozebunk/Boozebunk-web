'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { MapPin, Search, X } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '~/shared/shadcn/select';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

import { MainSearchBar } from './SearchBar';

const cities = [
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'bengaluru', label: 'Bengaluru' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'pune', label: 'Pune' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'lucknow', label: 'Lucknow' },
  { value: 'kanpur', label: 'Kanpur' },
  { value: 'patna', label: 'Patna' },
  { value: 'bhopal', label: 'Bhopal' }
];

const regions = {
  'North India': ['delhi', 'jaipur', 'lucknow', 'kanpur'],
  'West India': ['mumbai', 'pune', 'ahmedabad'],
  'East India': ['kolkata', 'patna'],
  'South India': ['chennai', 'bengaluru', 'hyderabad'],
  'Central India': ['bhopal']
};

export function Header() {
  const [selected, setSelected] = React.useState('');
  const selectedCity = cities.find((city) => city.value === selected);
  const [isSearchBarOpen, setSearchBarOpen] = React.useState<boolean>(false);

  return (
    <div className="sticky top-0 z-20 flex w-full transform-gpu flex-col gap-5 bg-[#fff5cb] px-5 py-4 shadow-md lg:px-25 lg:py-5">
      <div className="flex w-full items-center justify-between gap-10">
        {/* LOGO */}
        <Button asChild className="w-fit bg-transparent p-0 shadow-none hover:bg-transparent">
          <Link href="#" className="flex items-center justify-baseline p-0">
            <Image src={Logo} alt="logo" className="w-5 sm:w-6" />
            <Image src={Logo2} alt="logo" className="ml-[-5px] w-30 sm:w-35" />
          </Link>
        </Button>

        <div className="relative hidden w-full max-w-[700px] md:block">
          <MainSearchBar />
        </div>

        {/* CITY SELECT */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setSearchBarOpen(!isSearchBarOpen)}
            variant={'ghost'}
            className="active:bg-accent text-accent flex h-9 w-9 items-center justify-center rounded-full active:text-white md:hidden">
            {!isSearchBarOpen ? <Search className="size-6" /> : <X className="size-6" />}
          </Button>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-yellow-100 sm:text-lg">
              <MapPin className="h-6 w-6 text-yellow-600" strokeWidth={2.5} />
              <SelectValue
                placeholder={
                  <>
                    <span className="hidden sm:inline">Select City</span>
                    <span className="inline sm:hidden">City</span>
                  </>
                }>
                {selectedCity && <span>{selectedCity.label}</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(regions).map(([region, countryCodes]) => (
                <SelectGroup key={region}>
                  <SelectLabel>{region}</SelectLabel>
                  {countryCodes.map((code) => {
                    const city = cities.find((c) => c.value === code)!;
                    return (
                      <SelectItem key={code} value={code}>
                        {city.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isSearchBarOpen && (
        <div className="w-full md:hidden">
          <MainSearchBar />
        </div>
      )}
    </div>
  );
}
