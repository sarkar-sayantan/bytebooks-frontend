

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto mb-6 flex items-center justify-center">
          {/* Minimalistic, eye-catching icon */}
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <circle cx="36" cy="36" r="36" fill="var(--primary)" />
            <path d="M22 36c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14-14-6.268-14-14zm14-10a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" fill="var(--primary-foreground)" />
          </svg>
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-2"
          style={{ color: 'var(--sidebar-primary)' }}
        >
          ByteBooks
        </h1>
        <p
          className="text-lg md:text-xl font-semibold mb-4 text-gray-900"
          style={{ color: 'var(--sidebar-primary)' }}
        >
          Simplify. Track. Grow.
        </p>
        <p className="text-base text-muted-foreground mb-6">
          Smart accounting for modern businesses. Fast. Secure. Effortless.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full md:w-auto text-lg font-semibold shadow-lg" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <Link href="/dashboard">Start Now</Link>
          </Button>
          <span className="text-xs text-muted-foreground">Your business, your rules. No setup required.</span>
        </div>
      </div>
    </main>
  );
}