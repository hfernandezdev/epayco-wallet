import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Client {
  document: string;
  names: string;
  email: string;
  cellphone: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface PaymentInitiationResponse {
  sessionId: string;
  expiresIn: string;
}

export const walletService = {
  registerClient: (data: Client) =>
    api.post<ApiResponse>('/api/clients/register', data),

  findClient: (data: { document: string; cellphone: string }) =>
    api.post<ApiResponse>('/api/clients/find', data),

  rechargeWallet: (data: { document: string; cellphone: string; amount: number }) =>
    api.post<ApiResponse>('/api/wallet/recharge', data),

  getBalance: (data: { document: string; cellphone: string }) =>
    api.post<ApiResponse<BalanceResponse>>('/api/wallet/balance', data),

  initiatePayment: (data: {
    document: string;
    cellphone: string;
    amount: number;
    email: string;
    description?: string;
  }) => api.post<ApiResponse<PaymentInitiationResponse>>('/api/payments/initiate', data),

  confirmPayment: (data: { sessionId: string; token: string }) =>
    api.post<ApiResponse>('/api/payments/confirm', data),
};
