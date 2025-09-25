'use client';

import * as React from 'react';

import { cn } from '~/lib/utils';
import { Input } from '~/shared/shadcn/input';

// Liquor-related mock data
const liquorData: Record<string, string[]> = {
  a: ['Absolut Vodka', 'Amstel Beer', 'Apple Cider', 'Añejo Tequila', 'Aperol'],
  b: ['Budweiser', "Ballantine's", 'Baileys Irish Cream', 'Bombay Sapphire', 'Bacardi Rum'],
  c: ['Corona', 'Chardonnay', 'Captain Morgan', 'Cognac', 'Craft Beer'],
  d: ['Don Julio', 'Dry Gin', 'Dark Rum', 'Dom Pérignon', 'Draft Beer'],
  g: ['Grey Goose', 'Guinness', 'Gin Tonic', 'Glenfiddich', 'Ginger Beer'],
  r: ['Red Wine', 'RumChata', 'Rosé Wine', 'Royal Stag', 'Russian Vodka'],
  w: ['Whiskey', 'White Wine', 'Wild Turkey', 'Woodford Reserve', 'Wine Cooler']
};

export default function LiquorSearch() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value.length === 0) {
      setResults([]);
      return;
    }

    // Get first letter matches
    const firstLetter = value[0];
    const suggestions = liquorData[firstLetter] || [];
    setResults(suggestions.filter((item) => item.toLowerCase().includes(value)));
  };

  const handleSelect = (value: string) => {
    setQuery(value);
    setResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setResults([]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          placeholder="Search liquor brands, products, categories..."
          value={query}
          onChange={handleChange}
          className="pr-10"
        />
        {/* Dropdown */}
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
            {results.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className={cn('cursor-pointer px-3 py-2 text-sm hover:bg-gray-100')}>
                {item}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
