'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Transfer {
  id: string;
  amount: number;
  type: 'sent' | 'received';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    // TODO: Fetch balance and recent transfers from API
    setBalance(15000);
    setRecentTransfers([
      {
        id: '1',
        amount: 5000,
        type: 'received',
        description: 'Pago de Juan Pérez',
        date: '2024-03-15',
        status: 'completed',
      },
      {
        id: '2',
        amount: 2000,
        type: 'sent',
        description: 'Transferencia a María García',
        date: '2024-03-14',
        status: 'completed',
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Saldo disponible
          </h3>
          <div className="mt-2 text-3xl font-semibold text-indigo-600">
            ${balance.toLocaleString('es-AR')}
          </div>
          <div className="mt-4 flex space-x-3">
            <Link
              href="/dashboard/transfer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Transferir
            </Link>
            <Link
              href="/dashboard/load-balance"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cargar saldo
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transfers */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Transferencias recientes
          </h3>
          <div className="mt-4">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentTransfers.map((transfer) => (
                  <li key={transfer.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                            transfer.type === 'received'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transfer.type === 'received' ? '↓' : '↑'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transfer.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transfer.date).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transfer.type === 'received'
                              ? 'text-green-800 bg-green-100'
                              : 'text-red-800 bg-red-100'
                          }`}
                        >
                          {transfer.type === 'received' ? '+' : '-'}$
                          {transfer.amount.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard/transfers"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ver todas las transferencias
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 