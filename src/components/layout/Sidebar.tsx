'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BarChart3, Receipt, Users, UserCheck, User, LogOut, X } from 'lucide-react';
import { signOut } from 'next-auth/react'; // ✅ add this for signout

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Entries', href: '/entries', icon: Receipt },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Employees', href: '/employees', icon: UserCheck },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  
  return (
    <div className={cn('flex h-full w-64 flex-col bg-gray-900', className)}>
      {/* Header */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">ByteBooks</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-800 p-3">
        <Link
          href="/profile"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
          Profile
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="mt-1 w-full justify-start px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full w-64 flex-col bg-gray-900">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-white">ByteBooks</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="border-t border-gray-800 p-3">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
            >
              <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
              Profile
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="mt-1 w-full justify-start px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
