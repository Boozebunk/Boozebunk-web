import React from 'react';

// This is the root layout for your application.
// It wraps all pages and can be used to define common UI elements
// like headers, footers, navigation, or apply global styles.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Your common UI elements like Header, Navbar could go here */}
        {children} {/* This is where your page content will be rendered */}
        {/* Your common UI elements like Footer could go here */}
      </body>
    </html>
  );
}
