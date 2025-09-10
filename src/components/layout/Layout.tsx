'use client';

import { ReactNode } from 'react';
import { Sidebar, MobileSidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          <MobileSidebar />
          <h1 className="text-lg font-semibold text-gray-900">ByteBooks</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
