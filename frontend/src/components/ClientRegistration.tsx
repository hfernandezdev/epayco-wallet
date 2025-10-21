import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { walletService } from '../services/api';

interface ClientForm {
  document: string;
  names: string;
  email: string;
  cellphone: string;
}

export const ClientRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientForm>();

  const onSubmit = async (data: ClientForm) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await walletService.registerClient(data);
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
        message: error.response?.data?.message || 'Error al registrar cliente'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registro de Cliente</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input
            type="text"
            {...register('document', {
              required: 'Documento es requerido',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Solo se permiten números'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="Ingrese su documento"
          />
          {errors.document && (
            <p className="text-red-500 text-sm mt-1">{errors.document.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres Completos *
          </label>
          <input
            type="text"
            {...register('names', {
              required: 'Nombres son requeridos',
              minLength: {
                value: 2,
                message: 'Mínimo 2 caracteres'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="Ingrese sus nombres completos"
          />
          {errors.names && (
            <p className="text-red-500 text-sm mt-1">{errors.names.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Celular *
          </label>
          <input
            type="text"
            {...register('cellphone', {
              required: 'Celular es requerido',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Solo se permiten números'
              },
              minLength: {
                value: 10,
                message: 'Mínimo 10 dígitos'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            placeholder="3001234567"
          />
          {errors.cellphone && (
            <p className="text-red-500 text-sm mt-1">{errors.cellphone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : 'Registrar Cliente'}
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
