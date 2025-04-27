'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: '🏠' },
    { name: 'Transferir', href: '/dashboard/transfer', icon: '💸' },
    { name: 'Cargar Saldo', href: '/dashboard/load-balance', icon: '💰' },
    { name: 'DEBIN', href: '/dashboard/debin', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Mi Billetera</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <span className="sr-only">Cerrar menú</span>
            ✕
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Abrir menú</span>
            ☰
          </button>
        </div>
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 