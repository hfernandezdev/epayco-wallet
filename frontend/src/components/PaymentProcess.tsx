import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { walletService } from '../services/api';

interface PaymentForm {
  document: string;
  cellphone: string;
  amount: number;
  email: string;
  description: string;
}

interface ConfirmationForm {
  token: string;
}

export const PaymentProcess: React.FC = () => {
  const [step, setStep] = useState<'initiate' | 'confirm'>('initiate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const paymentForm = useForm<PaymentForm>();
  const confirmationForm = useForm<ConfirmationForm>();

  const handleInitiatePayment = async (data: PaymentForm) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await walletService.initiatePayment(data);
      const sessionId = response.data.data?.sessionId || null;

      if (response.data.success && sessionId) {
        setSessionId(sessionId);
        setStep('confirm');
        setResult({
          success: true,
          message: `Token enviado a ${data.email}. Revisa tu correo.`
        });
      } else {
        setResult({
          success: false,
          message: response.data.message
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al iniciar pago'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (data: ConfirmationForm) => {
    setLoading(true);

    try {
      const response = await walletService.confirmPayment({
        sessionId,
        token: data.token
      });

      setResult({
        success: response.data.success,
        message: response.data.message
      });

      if (response.data.success) {
        setStep('initiate');
        confirmationForm.reset();
        paymentForm.reset();
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al confirmar pago'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setStep('initiate');
    setSessionId('');
    setResult(null);
    paymentForm.reset();
    confirmationForm.reset();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Realizar Pago</h2>

      {step === 'initiate' && (
        <form onSubmit={paymentForm.handleSubmit(handleInitiatePayment)} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documento *</label>
            <input
              type="text"
              {...paymentForm.register('document', {
                required: 'Documento es requerido',
                pattern: { value: /^[0-9]+$/, message: 'Solo números' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {paymentForm.formState.errors.document && (
              <p className="text-red-500 text-sm">{paymentForm.formState.errors.document.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
            <input
              type="text"
              {...paymentForm.register('cellphone', {
                required: 'Celular es requerido',
                pattern: { value: /^[0-9]+$/, message: 'Solo números' },
                minLength: { value: 10, message: 'Mínimo 10 dígitos' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {paymentForm.formState.errors.cellphone && (
              <p className="text-red-500 text-sm">{paymentForm.formState.errors.cellphone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              {...paymentForm.register('email', {
                required: 'Email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {paymentForm.formState.errors.email && (
              <p className="text-red-500 text-sm">{paymentForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor a Pagar *</label>
            <input
              type="number"
              step="0.01"
              {...paymentForm.register('amount', {
                required: 'Valor es requerido',
                min: { value: 1, message: 'Mínimo $1' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {paymentForm.formState.errors.amount && (
              <p className="text-red-500 text-sm">{paymentForm.formState.errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              {...paymentForm.register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
              placeholder="Descripción del pago"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Iniciando Pago...' : 'Iniciar Pago'}
          </button>
        </form>
      )}

      {step === 'confirm' && (
        <div className="max-w-2xl">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <p className="text-yellow-800">
              Se ha enviado un token de 6 dígitos a tu correo. Ingrésalo a continuación.
            </p>
          </div>

          <form onSubmit={confirmationForm.handleSubmit(handleConfirmPayment)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token de Confirmación *
              </label>
              <input
                type="text"
                maxLength={6}
                {...confirmationForm.register('token', {
                  required: 'Token es requerido',
                  pattern: { value: /^[0-9]{6}$/, message: 'Debe ser exactamente 6 dígitos' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest placeholder:opacity-50"
                placeholder="123456"
              />
              {confirmationForm.formState.errors.token && (
                <p className="text-red-500 text-sm">{confirmationForm.formState.errors.token.message}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={resetProcess}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Confirmando...' : 'Confirmar Pago'}
              </button>
            </div>
          </form>
        </div>
      )}

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
