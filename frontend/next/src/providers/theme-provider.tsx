'use client';

import { type ComponentProps } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
// example code of using themeprovider in future
// 'use client';

// import { useTheme } from 'next-themes';
// import { Button } from '~/shared/shadcn/button'; // Example button component

// export function ThemeToggle() {
//   // `useTheme` reads from a React Context provided by `ThemeProvider`.
//   // `setTheme` automatically updates local storage and the <html> tag.
//   const { theme, setTheme } = useTheme();

//   const toggleTheme = () => {
//     setTheme(theme === 'dark' ? 'light' : 'dark');
//   };

//   return (
//     <Button onClick={toggleTheme}>
//       {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
//     </Button>
//   );
// }
