'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '~/shared/shadcn/button';

import Logo2 from '../../../../public/Assets/Logo-main-2.png';
import Logo from '../../../../public/Assets/Logo-main.png';

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="sticky top-0 z-20 flex w-full transform-gpu flex-col items-center gap-5 bg-[#fff5cb] px-5 py-4 shadow-md lg:px-25 lg:py-5">
        <Button
          asChild
          className="flex w-fit items-center justify-baseline bg-transparent p-0 shadow-none hover:bg-transparent">
          <Link href="/" className="flex items-center justify-baseline p-0">
            <Image src={Logo} alt="logo" className="w-5 sm:w-6" />
            <Image src={Logo2} alt="logo" className="ml-[-5px] w-30 sm:w-35" />
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
