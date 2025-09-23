'use client';

import React from 'react';

import clsx from 'clsx';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '~/shared/shadcn/command';

interface SearchBarProps {
  placeholder?: string;
  //   value: string;
  //   onChange: (value: string) => void;
  results: string[];
  className?: string;
}

export function SearchBar({
  placeholder = 'Search...',
  //   value,
  //   onChange,
  results,
  className
}: SearchBarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={clsx('relative w-full', className)}>
      <Command className="border-input w-full rounded-xl border">
        <CommandInput
          placeholder={placeholder}
          //   value={value}
          //   onValueChange={(val) => {
          //     onChange(val);
          //     setOpen(true);
          //   }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="sm:text-md w-full text-sm lg:text-lg"
        />
        {open && (
          <CommandGroup className="bg-background absolute top-full left-0 z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border shadow-lg sm:max-h-100">
            {results.length === 0 ? (
              <CommandEmpty className="p-3 text-gray-500">No results found.</CommandEmpty>
            ) : (
              results.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={item}
                  //   onMouseDown={(e) => {
                  //     e.preventDefault();
                  //     onChange(item);
                  //     setOpen(false);
                  //   }}
                  className="border-border sm:text-mdl cursor-pointer border-b px-4 py-2 text-sm last:border-b-0 lg:text-lg">
                  {item}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}
      </Command>
    </div>
  );
}

const items = [
  'Legacy Liquor',
  'Wine Shop',
  'Craft Beer',
  'Whiskey World',
  'Vodka Vault',
  'Legacy Liquor',
  'Wine Shop',
  'Craft Beer',
  'Whiskey World',
  'Vodka Vault',
  'Legacy Liquor',
  'Wine Shop',
  'Craft Beer',
  'Whiskey World',
  'Vodka Vault'
];

export function MainSearchBar() {
  return <SearchBar results={items} />;
}
