import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ByteBooks',
  description: 'A modern accounting application for small businesses',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SessionProvider>
            <TenantProvider>
              {children}
              <Toaster />
            </TenantProvider>
          </SessionProvider>
        </QueryProvider>
        <GoogleAnalytics gaId="G-25TYNNMMSD" />
      </body>
    </html>
  );
}


