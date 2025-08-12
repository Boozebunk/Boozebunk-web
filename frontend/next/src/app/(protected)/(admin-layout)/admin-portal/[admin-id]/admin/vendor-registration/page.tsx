'use client';

import { Store } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import { Checkbox } from '~/shared/shadcn/checkbox';
import { Input } from '~/shared/shadcn/input';
import { Label } from '~/shared/shadcn/label';

export default function VendorRegistrationPage() {
  return (
    <div className="bg-background flex min-h-screen w-full justify-center p-0 sm:p-5 sm:py-0">
      <Card className="h-fit w-full border-0 bg-transparent shadow-none">
        {/* Header */}
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <Store className="text-primary h-10 w-10 sm:h-12 sm:w-12" />
          <CardTitle className="text-2xl font-bold">Vendor Registration</CardTitle>
          <CardDescription className="max-w-lg text-sm">
            Fill in the details below to register the liquor mart as a vendor.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Section: Business Info */}
          <section className="space-y-4">
            <h2 className="border-b pb-1 text-lg font-semibold">Business Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="martName">Liquor Mart Name</Label>
                <Input
                  id="martName"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. Sunrise Liquor Mart"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. LIC-123456"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section: Contact Info */}
          <section className="space-y-4">
            <h2 className="border-b pb-1 text-lg font-semibold">Contact Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Vendor Email</Label>
                <Input
                  id="email"
                  className="text-sm"
                  type="email"
                  placeholder="vendor@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  className="text-sm"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section: Address Details */}
          <section className="space-y-4">
            <h2 className="border-b pb-1 text-lg font-semibold">Address Details</h2>
            {/* Full Address */}
            <div className="grid gap-2">
              <Label htmlFor="fullAddress">Full Address</Label>
              <Input
                id="fullAddress"
                className="text-sm"
                type="text"
                placeholder="123, Near Market Street, Downtown"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. Market Street"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. Maharashtra"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  className="text-sm"
                  type="text"
                  placeholder="e.g. 400001"
                  required
                />
              </div>
            </div>
          </section>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm">
              Vendor has agreed to{' '}
              <a href="#" className="underline">
                terms & conditions
              </a>
            </Label>
          </div>
          <Button type="submit" className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]">
            Register Vendor
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
