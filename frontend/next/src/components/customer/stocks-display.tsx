import React from 'react';

import { Plus } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';

import { ProductCard } from './product-card';

const baseProducts = [
  {
    name: 'Johnnie Walker Blue Label',
    category: 'Whiskey',
    type: 'Blended Scotch',
    size: '750ml',
    price: 12000
  },
  {
    name: 'Jack Daniel’s Tennessee Whiskey',
    category: 'Whiskey',
    type: 'Tennessee Whiskey',
    size: '750ml',
    price: 5500
  },
  {
    name: 'old monk',
    category: 'Whiskey',
    type: 'Blended Scotch',
    size: '750ml',
    price: 4000
  },
  {
    name: 'Chivas Regal 12',
    category: 'Whiskey',
    type: 'Blended Scotch',
    size: '750ml',
    price: 4000
  },
  { name: 'Hennessy VS', category: 'Cognac', type: 'VS Cognac', size: '750ml', price: 7000 },
  { name: 'Bombay Sapphire', category: 'Gin', type: 'London Dry Gin', size: '750ml', price: 3000 },
  { name: 'Absolut Vodka', category: 'Vodka', type: 'Standard Vodka', size: '750ml', price: 2500 },
  { name: 'Heineken', category: 'Beer', type: 'Lager', size: '500ml', price: 250 },
  { name: 'Kingfisher Premium', category: 'Beer', type: 'Lager', size: '650ml', price: 180 },
  { name: 'Corona Extra', category: 'Beer', type: 'Pale Lager', size: '355ml', price: 300 },
  { name: 'Budweiser', category: 'Beer', type: 'Lager', size: '500ml', price: 250 }
];

const ExampleProducts = Array.from({ length: 9 }, (_, i) => {
  const product = baseProducts[i % baseProducts.length];
  return {
    image: `https://www.livcheers.com/static/content/images/liquor/LCIN01896.webp`,
    category: product.category,
    name: product.name,
    size: product.size,
    price: `₹${product.price}`,
    type: product.type
  };
});

function StockDisplay() {
  return (
    <div className="flex w-full flex-col gap-5 px-5 md:gap-8 lg:px-25">
      <div className="flex flex-col items-center gap-0 md:gap-1">
        <h1 className="text-center text-2xl font-bold md:text-3xl">
          Explore{' '}
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Stock
          </span>
        </h1>
        <p className="text-center text-sm text-gray-500">Browse products curated for you.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        {ExampleProducts.map((info, id) => (
          <ProductCard key={id} info={info} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="flex cursor-pointer items-center gap-2 rounded-full font-medium shadow-md transition hover:scale-105 hover:bg-yellow-500 hover:text-white">
          <Plus />
          Show More
        </Button>
      </div>
    </div>
  );
}

export default StockDisplay;
