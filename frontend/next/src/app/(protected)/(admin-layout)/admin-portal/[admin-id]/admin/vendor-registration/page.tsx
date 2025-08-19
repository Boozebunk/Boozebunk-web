// app/vendor-registration/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

import { vendorRegistrationSchema } from '@boozebunk-trpc/modules/vendor/dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Store } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/shared/shadcn/form';
import { Input } from '~/shared/shadcn/input';

import { trpcHttp } from '~/utils/trpc';

import type { GooglePlacesResponse, VendorRegistration } from '@boozebunk-trpc/modules/vendor/dto';

// Extend Event type for gmp-select event
interface GMPSelectEvent extends Event {
  placePrediction: {
    toPlace: () => {
      fetchFields: (args: { fields: string[] }) => Promise<void>;
      displayName: string;
      formattedAddress: string;
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
}

export default function VendorRegistrationPage() {
  const [googleReady, setGoogleReady] = useState(false);
  const [place, setPlace] = useState<GooglePlacesResponse | null>(null);

  const { mutateAsync: registerVendor, isPending } = useMutation(
    trpcHttp.vendor.createVendor.mutationOptions({
      onSuccess: () => {
        console.log('Vendor Registration Successful');
        form.reset();
        // form.setValue('martName', '');
        // form.setValue('licenseNumber', '');
        // form.setValue('vendorName', '');
        // form.setValue('email', '');
        // form.setValue('phoneNumber', '');
        // form.setValue('addressFormatted', '');
        // form.setValue('addressArea', '');
        // form.setValue('addressPostalCode', '');
        // form.setValue('addressCity', '');
        // form.setValue('addressState', '');
        // form.setValue('locationCoordinates.lat', 0);
        // form.setValue('locationCoordinates.lng', 0);
      },
      onError: (error) => {
        console.error('Vendor Registration Error:', error);
      }
    })
  );

  const form = useForm<VendorRegistration>({
    resolver: zodResolver(vendorRegistrationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      martName: '',
      licenseNumber: '',
      vendorName: '',
      email: '',
      phoneNumber: '',
      addressFormatted: '',
      addressArea: '',
      addressPostalCode: '',
      addressCity: '',
      addressState: '',
      locationCoordinates: {
        lat: 0,
        lng: 0
      }
    }
  });

  useEffect(() => {
    if (!googleReady) return;

    const initAutocomplete = async () => {
      // Load Places library
      await google.maps.importLibrary('places');

      // Create the <gmp-place-autocomplete> element
      const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({});
      placeAutocomplete.className =
        'w-full border rounded-lg p-2 text-sm shadow-sm focus:ring focus:ring-primary';

      // Find container in our JSX
      const container = document.getElementById('autocomplete-container');
      if (container) {
        container.innerHTML = ''; // clear old
        container.appendChild(placeAutocomplete);
      }

      // @ts-expect-error: We know this event has placePrediction from Google API
      placeAutocomplete.addEventListener('gmp-select', async (event: GMPSelectEvent) => {
        const place = event.placePrediction.toPlace();
        await place.fetchFields({
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'addressComponents',
            'location',
            'internationalPhoneNumber'
          ]
        });

        setPlace({
          displayName: place.displayName,
          formattedAddress: place.formattedAddress,
          location: {
            latitude: place.location.lat(),
            longitude: place.location.lng()
          }
        });
      });
    };

    initAutocomplete();
  }, [googleReady]);

  useEffect(() => {
    if (place?.formattedAddress) {
      form.setValue('martName', place?.displayName || '');
      form.setValue('addressFormatted', place?.formattedAddress || '');
      form.setValue('locationCoordinates.lat', place?.location?.latitude || 0);
      form.setValue('locationCoordinates.lng', place?.location?.longitude || 0);

      const addressArray = place?.formattedAddress.split(',').reverse();
      console.log(addressArray);
      const CityCodeArr = addressArray[1].split(' ');
      console.log(CityCodeArr);
      const area = addressArray.slice(4).reverse().join(',');

      form.setValue('addressPostalCode', CityCodeArr[2]);
      form.setValue('addressState', CityCodeArr[1]);
      form.setValue('addressCity', addressArray[2]);
      form.setValue('addressArea', area);
    }
  }, [place, form]);

  console.log(place);

  const handleSubmit = async () => {
    console.log('Creating new Vendor');
    await registerVendor(form.getValues());
  };

  return (
    <main>
      <div className="bg-background flex min-h-screen w-full justify-center p-0 sm:p-5 sm:py-0">
        <Card className="h-fit w-full border-0 bg-transparent shadow-none">
          <CardHeader className="flex flex-col items-center gap-2 text-center">
            <Store className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
            <CardTitle className="text-2xl font-bold">Vendor Registration</CardTitle>
            <CardDescription className="max-w-lg text-sm">
              Fill in the details below to register the liquor mart as a vendor.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <section className="space-y-4">
                  <h2 className="border-b pb-1 text-lg font-semibold">Business Info</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="martName"
                      render={({}) => (
                        <FormItem>
                          <FormLabel>Search for a place</FormLabel>
                          <FormControl>
                            {/* Container for Google Autocomplete */}
                            <div id="autocomplete-container" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input
                              id="licenseNumber"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. LIC-123456"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Section: Contact Info */}
                <section className="space-y-4">
                  <h2 className="border-b pb-1 text-lg font-semibold">Contact Info</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vendorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Name</FormLabel>
                          <FormControl>
                            <Input
                              id="vendorName"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. John Doe"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              className="text-sm"
                              type="email"
                              placeholder="vendor@example.com"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              id="phoneNumber"
                              className="text-sm"
                              type="tel"
                              placeholder="+91 98765 43210"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Section: Address Details */}
                <section className="space-y-4">
                  <h2 className="border-b pb-1 text-lg font-semibold">Address Details</h2>
                  <FormField
                    control={form.control}
                    name="addressFormatted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input
                            id="addressFormatted"
                            className="text-sm"
                            type="text"
                            placeholder="123, Near Market Street, Downtown"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="addressArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <FormControl>
                            <Input
                              id="addressArea"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. 123"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressPostalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input
                              id="addressPostalCode"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. 400001"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              id="addressCity"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. Mumbai"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              id="addressState"
                              className="text-sm"
                              type="text"
                              placeholder="e.g. Maharashtra"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <CardFooter className="flex flex-row gap-4">
                  <Button
                    onClick={() => {
                      form.reset();
                    }}>
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]"
                    disabled={isPending}>
                    {isPending ? <Loader2 /> : 'Register Vendor'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAs3lerUmAxkTDlH17cSKLNyyOhWh5pyOI&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
      />
    </main>
  );
}
