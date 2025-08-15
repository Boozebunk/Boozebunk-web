'use client';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import { Button } from '~/shared/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/shared/shadcn/input-otp';

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-1xl font-bold md:text-2xl">OTP Verification</CardTitle>
          <CardDescription className="text-sm">
            Please enter the code sent to your email to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]">
            Verify
          </Button>
          <div className="text-center text-sm">
            Didn’t receive the code?{' '}
            <a href="#" className="font-semibold underline-offset-4 hover:underline">
              Resend OTP
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
