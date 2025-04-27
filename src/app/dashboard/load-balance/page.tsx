'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadBalancePage() {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'credit_card',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement load balance logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al cargar saldo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Cargar saldo
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Selecciona el monto y el método de pago para cargar saldo.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-900"
              >
                Monto a cargar
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-900 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  min="0"
                  step="0.01"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md text-gray-900 font-medium"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-900 sm:text-sm">ARS</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-900"
              >
                Método de pago
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 font-medium"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="credit_card">Tarjeta de crédito</option>
                <option value="debit_card">Tarjeta de débito</option>
                <option value="bank_transfer">Transferencia bancaria</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Procesando...' : 'Cargar saldo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 