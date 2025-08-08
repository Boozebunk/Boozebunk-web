'use client';

import { useState } from 'react';

import { Eye, EyeOff, UserRound } from 'lucide-react';

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

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full items-center justify-center p-6 lg:w-[40%]">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center text-center text-[#442816]">
          <UserRound className="h-8 w-8 sm:h-10 sm:w-10" />
          <CardTitle className="text-1xl font-bold md:text-2xl">Admin Login</CardTitle>
          <CardDescription className="text-sm text-[#6B0F1A]">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#442816]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="focus-visible:ring-[#ffc82e]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#442816]">
                  Password
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8+ characters"
                      required
                      className="pr-10 focus-visible:ring-[#ffc82e]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 transform text-[#6B0F1A] hover:text-[#442816]"
                      tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <a
                    href="#"
                    className="self-end text-sm text-[#6B0F1A] underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex items-center gap-3 self-start">
            <Checkbox id="logged-in" />
            <Label htmlFor="logged-in">Remember me</Label>
          </div>
          <Button type="submit" className="w-full bg-[#6B0F1A] text-white hover:bg-[#44101b]">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
