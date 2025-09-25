'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

import { AlertTriangle } from 'lucide-react';

import { pageview } from '~/lib/analytics';

import AgeVerificationDialog from '~/components/customer/age-verification';
import { Header } from '~/components/customer/header';

export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(window.location.pathname);
  }, [pathname]);

  return null;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="re">
        <AgeVerificationDialog />
        <div className="relative flex flex-col items-center gap-8 md:gap-10">
          <Header />
          <main className="flex w-full">{children}</main>
          <footer className="border-foreground/20 mt-5 flex w-full flex-col gap-5 border-t py-10">
            <div className="text-muted-foreground mx-auto max-w-6xl space-y-4 px-4 text-center text-xs sm:text-sm">
              <p className="text-foreground flex items-center justify-center gap-2 font-semibold tracking-wide uppercase">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Responsible Consumption Notice
              </p>

              <p>
                We do not promote or encourage excessive drinking. Alcohol consumption is strictly
                for individuals of legal drinking age.
              </p>

              <p>
                Please drink responsibly and at your own risk. Know your limits, and never drink and
                drive.
              </p>
            </div>

            <div className="flex items-center justify-center gap-5 text-xs sm:text-sm">
              <Link href="/terms" className="text-[#6B0F1A] hover:underline">
                Terms & Conditions
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <Link href="/privacy" className="text-[#6B0F1A] hover:underline">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
        <AnalyticsListener />
      </body>
    </html>
  );
}
