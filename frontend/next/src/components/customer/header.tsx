'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Search } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';

import { useCustomerContext } from '~/providers/customer-provider';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

import LiquorSearch from './SearchBar';

export function Header() {
  const { locationStatus, nearbyVendorsLoading } = useCustomerContext();

  // The search bar should be disabled if location is denied, unsupported, or if nearby vendors are still loading
  const isSearchDisabled = locationStatus !== 'granted' || nearbyVendorsLoading;
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

        <div className="flex flex-row items-center gap-1">
          <Search />
          <LiquorSearch isSearchDisabled={isSearchDisabled} /> {/* Pass the disabled state */}
        </div>
      </div>
    </div>
  );
}
