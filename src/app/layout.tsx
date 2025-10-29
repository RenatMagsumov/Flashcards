// src/app/layout.tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import AppHeader from '@/components/AppHeader';

export const metadata = {
  title: 'Flashcards',
  description: 'Next.js + Supabase flashcards app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-right" />
          <AppHeader />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
