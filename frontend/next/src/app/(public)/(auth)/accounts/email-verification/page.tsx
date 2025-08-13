'use client';

import { useState } from 'react';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import { Input } from '~/shared/shadcn/input';
import { Label } from '~/shared/shadcn/label';

export default function Page() {
  const [email, setEmail] = useState('');

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-1xl font-bold md:text-2xl">Email Verification</CardTitle>
          <CardDescription className="text-sm">
            Please enter your registered email to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="grid w-full gap-2.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]">
            Verify
          </Button>
          <div className="text-center text-sm">
            A link to reset the password will be sent to you email after verification of the your
            account.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
