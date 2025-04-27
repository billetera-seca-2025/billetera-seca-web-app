'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // TODO: Implement transfer logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al realizar la transferencia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Realizar una transferencia
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Ingresa los datos del destinatario y el monto a transferir.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            <div>
              <label
                htmlFor="recipientEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico del destinatario
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="recipientEmail"
                  id="recipientEmail"
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="ejemplo@correo.com"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Monto
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  min="0"
                  step="0.01"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">ARS</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <div className="mt-1">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Agrega una descripción opcional"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Procesando...' : 'Transferir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 