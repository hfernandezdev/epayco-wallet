import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { walletService } from '../services/api';

interface BalanceForm {
  document: string;
  cellphone: string;
}

export const BalanceCheck: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BalanceForm>();

  const onSubmit = async (data: BalanceForm) => {
    setLoading(true);
    setBalance(null);
    setError(null);

    try {
      const response = await walletService.getBalance(data);

      if (response.data.success) {

        const balance = response.data.data ? response.data.data.balance : null;

        if (balance !== undefined) {
          setBalance(balance);
        } else {
          setError(response.data.message);
        }
      } else {
        setError('Balance no disponible');
      }

    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al consultar saldo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Consultar Saldo</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input
            type="text"
            {...register('document', {
              required: 'Documento es requerido',
              pattern: { value: /^[0-9]+$/, message: 'Solo números' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="12345678"
          />
          {errors.document && <p className="text-red-500 text-sm">{errors.document.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular *
          </label>
          <input
            type="text"
            {...register('cellphone', {
              required: 'Celular es requerido',
              pattern: { value: /^[0-9]+$/, message: 'Solo números' },
              minLength: { value: 10, message: 'Mínimo 10 dígitos' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="3001234567"
          />
          {errors.cellphone && <p className="text-red-500 text-sm">{errors.cellphone.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Consultar Saldo'}
        </button>
      </form>

      {balance !== null && (
        <div className="bg-green-50 border border-green-200 rounded-md p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Saldo Actual</h3>
          <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
          <p className="text-green-600 text-sm mt-2">Consulta realizada exitosamente</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};
