import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { walletService } from '../services/api';

interface RechargeForm {
  document: string;
  cellphone: string;
  amount: number;
}

export const WalletRecharge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RechargeForm>();

  const onSubmit = async (data: RechargeForm) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await walletService.rechargeWallet(data);
      setResult({
        success: response.data.success,
        message: response.data.message
      });

      if (response.data.success) {
        reset();
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al recargar billetera'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recargar Billetera</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor a Recargar *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', {
              required: 'Valor es requerido',
              min: { value: 1, message: 'Mínimo $1' },
              valueAsNumber: true
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="100.00"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Recargando...' : 'Recargar Billetera'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
};
