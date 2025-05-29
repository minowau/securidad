import React from 'react';
import { Account } from '../../types';
import { CreditCard } from 'lucide-react';

interface AccountSummaryProps {
  accounts: Account[];
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ accounts }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Accounts</h2>
      
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1">Total Balance</div>
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</div>
      </div>
      
      <div className="space-y-4">
        {accounts.map(account => (
          <div key={account.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mr-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
              <p className="text-xs text-gray-500 truncate">{account.accountNumber}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          View All Accounts
        </button>
      </div>
    </div>
  );
};

export default AccountSummary;