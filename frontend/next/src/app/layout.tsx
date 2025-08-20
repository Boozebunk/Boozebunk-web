import * as React from 'react';

import { ThemeProvider } from 'next-themes';

import Providers from '~/providers';

import type { Metadata, Viewport } from 'next';

import '../styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  title: 'Boozebunk - Liquor Management and Information Platform',
  icons: {
    icon: '/favicon.ico'
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
