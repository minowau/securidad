import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, DollarSign, TrendingUp, Plus } from 'lucide-react';

const AccountsPage: React.FC = () => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Accounts</h1>
        <p className="text-gray-600">View and manage all your financial accounts</p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.accounts.map(account => (
          <div 
            key={account.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-50 mr-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{account.name}</h2>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Account Number</div>
                <div className="text-gray-800">{account.accountNumber}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Available Balance</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center py-2 px-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Transfer
                </button>
                <button className="flex items-center justify-center py-2 px-3 bg-gray-50 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6">
          <div className="p-3 rounded-full bg-gray-100 mb-3">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-center mb-2">Add a new account</p>
          <button className="text-blue-600 text-sm font-medium">
            Link Account
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {user.accounts.map(account => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{account.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{account.accountNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {account.name.includes('Checking') ? 'Checking' : account.name.includes('Savings') ? 'Savings' : 'Investment'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {formatCurrency(account.balance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                Total Balance
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                {formatCurrency(user.accounts.reduce((sum, account) => sum + account.balance, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AccountsPage;