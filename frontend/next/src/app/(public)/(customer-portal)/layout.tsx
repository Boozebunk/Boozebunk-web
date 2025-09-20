import React from 'react';

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-gray-100 p-4 shadow-md">
        <h1>BoozeBunk Customer Portal</h1>
      </header>
      <main className="p-4">{children}</main>
    </>
  );
}
