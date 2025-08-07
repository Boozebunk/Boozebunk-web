import * as React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

import Providers from '~/providers';

import type { Metadata, Viewport } from 'next';

import '../styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  title: 'Boozebunk - Liquor Management and Information Platform',
  description:
    'Find your favorite drinks fast! Our platform helps customers locate nearby liquor marts and empowers mart owners to easily manage their stock.',
  keywords: [
    'liquor',
    'liquor management',
    'liquor information',
    'liquor availability',
    'liquor near me'
  ],
  authors: [{ name: 'Boozebunk' }],
  creator: 'Boozebunk',
  publisher: 'Boozebunk',
  openGraph: {
    title: 'Boozebunk',
    description:
      'Find your favorite drinks fast! Our platform helps customers locate nearby liquor marts and empowers mart owners to easily manage their stock.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boozebunk - Liquor Management and Information Platform',
    description:
      'Find your favorite drinks fast! Our platform helps customers locate nearby liquor marts and empowers mart owners to easily manage their stock.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <body className={'font-sans'}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
