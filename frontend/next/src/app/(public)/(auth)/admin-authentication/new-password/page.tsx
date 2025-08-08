'use client';

import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center text-[#442816]">
          <CardTitle className="text-1xl font-bold md:text-2xl">Reset Your Password</CardTitle>
          <CardDescription className="text-sm text-[#6B0F1A]">
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>

        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
          <CardContent className="flex flex-col gap-5">
            {/* New Password */}
            <div className="grid gap-2">
              <Label htmlFor="newPassword" className="text-[#442816]">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  required
                  className="pr-10 focus-visible:ring-[#ffc82e]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 transform text-[#6B0F1A] hover:text-[#442816]"
                  tabIndex={-1}>
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-[#442816]">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  required
                  className="pr-10 focus-visible:ring-[#ffc82e]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 transform text-[#6B0F1A] hover:text-[#442816]"
                  tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]">
              Save New Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
