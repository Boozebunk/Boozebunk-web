'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Loader2, Plus } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';

import { ProductCard } from '~/components/customer/product-card';
import { VendorCard } from '~/components/customer/vendor-card';

const go_to_categories = [
  { name: 'Beer', image: '/assets/categories/beer.jpg' },
  { name: 'Wine', image: '/assets/categories/wine.jpg' },
  { name: 'Whiskey', image: '/assets/categories/whiskey.jpg' },
  { name: 'Vodka', image: '/assets/categories/vodka.jpg' },
  { name: 'Rum', image: '/assets/categories/rum.jpg' },
  { name: 'Gin', image: '/assets/categories/gin.jpg' },
  { name: 'Tequila', image: '/assets/categories/tequila.jpg' },
  { name: 'Brandy', image: '/assets/categories/brandy.jpg' },
  { name: 'Cocktails', image: '/assets/categories/cocktail.jpg' },
  { name: 'Champagne', image: '/assets/categories/champagne.jpg' }
];

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

const baseVendors = [
  {
    name: 'Legacy Liquor Co.',
    distance: '2km',
    storeStatus: 'Open'
  },
  {
    name: 'Sri elammathali pochammathali wines',
    distance: '2km',
    storeStatus: 'Open'
  },
  {
    name: 'Sindhura wines',
    distance: '2km',
    storeStatus: 'Close'
  },
  {
    name: 'Sai Durga Wines',
    distance: '2km',
    storeStatus: 'Open'
  }
];

const ExampleVendors = Array.from({ length: 20 }, (_, i) => {
  const product = baseVendors[i % baseVendors.length];
  return {
    name: product.name,
    distance: product.distance,
    storeStatus: product.storeStatus
  };
});

type Coords = {
  lat: number | null;
  lon: number | null;
};

function Page() {
  // ------------location access of lat and long-----------------
  const [coords, setCoords] = useState<Coords>({ lat: null, lon: null });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setLoading(false);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              console.log('User denied the request for Geolocation.');
              break;
            case err.POSITION_UNAVAILABLE:
              console.log('Location information is unavailable.');
              break;
            case err.TIMEOUT:
              console.log('The request to get user location timed out.');
              break;
            default:
              console.log('An unknown error occurred.');
          }
        },
        {
          enableHighAccuracy: true, // Request the best possible results
          timeout: 10000, // Wait up to 10 seconds (10000ms)
          maximumAge: 0 // Don't use a cached position
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);
  console.log(coords);

  return (
    <div className="flex w-full flex-col items-center gap-8 sm:gap-15">
      {/* STORES NEAR YOU */}
      <div className="mb-[-3] flex w-full flex-col gap-5 overflow-hidden px-5 md:gap-8 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Stores Near{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              You
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500">Discover stores around your area.</p>
        </div>

        <div className="w-full overflow-x-auto scroll-smooth pb-3">
          {loading ? (
            <div className="flex h-40 w-full items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg font-medium">Loading stores...</span>
              </div>
            </div>
          ) : coords.lat !== null && coords.lon !== null ? (
            <div className="flex gap-5 lg:gap-8">
              {ExampleVendors.map((info, id) => (
                <div key={id}>
                  <VendorCard info={info} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="text-center text-sm sm:text-base">
                Location access is denied. Please enable it in your browser or device settings and
                refresh.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="cursor-pointer text-sm sm:text-base">
                Refresh if Done
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-[2px] w-[95%] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* CATEGORIES */}
      <div className="flex w-fit flex-col items-center gap-5 px-5 md:gap-8 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Go-To{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500">View by category you love.</p>
        </div>

        <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-5 sm:gap-x-10 lg:gap-x-20">
          {go_to_categories.map(({ name, image }, idx) => (
            <div
              key={idx}
              className="flex w-fit cursor-pointer flex-col items-center gap-2 md:gap-3">
              <div className="relative h-[80px] w-[80px] rounded-full bg-gradient-to-tr from-yellow-400 to-orange-400 p-[2px] transition-transform hover:scale-105 sm:h-[120px] sm:w-[120px] lg:h-[150px] lg:w-[150px]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                  <Image src={image} alt={name} fill className="object-cover" />
                </div>
              </div>

              <span className="text-xs font-semibold text-gray-700 md:text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-[2px] w-[95%] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* STOCK */}
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
    </div>
  );
}

export default Page;
