import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ByteBooks',
  description: 'A modern accounting application for small businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <TenantProvider>
            {children}
            <Toaster />
          </TenantProvider>
        </QueryProvider>
        <GoogleAnalytics gaId="G-DX9YCGLSJC" />
      </body>
    </html>
  );
}
