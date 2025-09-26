// frontend/next/src/context/CustomerContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { trpcHttp } from '~/utils/trpc';

import type { VendorInfo } from '@boozebunk-trpc/modules/customer/dto';
import type { ReactNode } from 'react';

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported' | 'error';

interface CustomerContextProps {
  location: { lat: number | null; lon: number | null };
  locationStatus: LocationStatus;
  nearbyVendors: VendorInfo;
  nearbyVendorsLoading: boolean;
  nearbyVendorsError: unknown | null;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const CustomerContext = createContext<CustomerContextProps | undefined>(undefined);

export function useCustomerContext() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null
  });
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // 1. Get customer location
  useEffect(() => {
    if (locationStatus === 'idle') {
      if ('geolocation' in navigator) {
        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
            setLocationStatus('granted');
          },
          (err) => {
            setLocationStatus('denied');
            console.error('Geolocation error:', err);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setLocationStatus('unsupported');
        console.error('Geolocation is not supported by this browser.');
      }
    }
  }, [locationStatus]);

  // 2. Use location to get nearby vendors
  const {
    data: nearbyVendors,
    isLoading: nearbyVendorsLoading,
    error: nearbyVendorsError
  } = useQuery(
    trpcHttp.customer.getNearbyVendors.queryOptions(
      {
        customerLat: location.lat!,
        customerLon: location.lon!
      },
      {
        enabled: locationStatus === 'granted'
      }
    )
  );

  const contextValue = {
    location,
    locationStatus,
    nearbyVendors: nearbyVendors ?? [],
    nearbyVendorsLoading,
    nearbyVendorsError: nearbyVendorsError ?? null,
    selectedCity,
    setSelectedCity
  };

  return <CustomerContext.Provider value={contextValue}>{children}</CustomerContext.Provider>;
}
