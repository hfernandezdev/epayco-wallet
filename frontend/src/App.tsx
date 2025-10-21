import React, { useState } from 'react';
import { ClientRegistration } from './components/ClientRegistration';
import { WalletRecharge } from './components/WalletRecharge';
import { PaymentProcess } from './components/PaymentProcess';
import { BalanceCheck } from './components/BalanceCheck';

type ActiveTab = 'register' | 'recharge' | 'payment' | 'balance';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('register');

  const tabs = [
    { id: 'register' as ActiveTab, name: 'Registro Cliente', component: <ClientRegistration /> },
    { id: 'recharge' as ActiveTab, name: 'Recargar Billetera', component: <WalletRecharge /> },
    { id: 'payment' as ActiveTab, name: 'Realizar Pago', component: <PaymentProcess /> },
    { id: 'balance' as ActiveTab, name: 'Consultar Saldo', component: <BalanceCheck /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">💰 ePayco Wallet</h1>
          <p className="text-gray-600">Sistema de Billetera Virtual</p>
        </header>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}

export default App;
