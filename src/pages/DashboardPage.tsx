import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBehavioral } from '../context/BehavioralContext';
import { Transaction, SecurityEvent } from '../types';
import AccountSummary from '../components/dashboard/AccountSummary';
import TransactionList from '../components/dashboard/TransactionList';
import SecurityStatus from '../components/dashboard/SecurityStatus';
import { AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { behavioralData } = useBehavioral();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2025-04-10',
        description: 'Grocery Store',
        amount: 67.82,
        type: 'debit',
        category: 'Shopping',
        accountId: '101'
      },
      {
        id: '2',
        date: '2025-04-09',
        description: 'Salary Deposit',
        amount: 2850.00,
        type: 'credit',
        category: 'Income',
        accountId: '101'
      },
      {
        id: '3',
        date: '2025-04-08',
        description: 'Utility Bill',
        amount: 124.56,
        type: 'debit',
        category: 'Bills',
        accountId: '101'
      },
      {
        id: '4',
        date: '2025-04-07',
        description: 'Restaurant',
        amount: 42.19,
        type: 'debit',
        category: 'Dining',
        accountId: '101'
      }
    ];

    const events: SecurityEvent[] = [
      {
        id: '1',
        timestamp: '2025-04-10T09:24:15',
        type: 'login',
        confidenceScore: 0.95,
        riskLevel: 'low',
        description: 'Successful login from recognized device',
        location: {
          city: 'New York',
          country: 'US',
          ip: '192.168.1.1'
        },
        device: {
          type: 'mobile',
          browser: 'Chrome',
          os: 'iOS 18'
        }
      },
      {
        id: '2',
        timestamp: '2025-04-08T15:36:42',
        type: 'transaction',
        confidenceScore: 0.82,
        riskLevel: 'low',
        description: 'Routine transaction pattern detected',
      }
    ];

    setRecentTransactions(transactions);
    setSecurityEvents(events);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

      {behavioralData?.riskLevel === 'high' && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                We're still learning your behavioral patterns. Additional verification may be required for sensitive transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AccountSummary accounts={user.accounts} />
        <div className="lg:col-span-2">
          <SecurityStatus 
            confidenceScore={behavioralData?.confidenceScore || 0} 
            riskLevel={behavioralData?.riskLevel || 'high'} 
            securityEvents={securityEvents}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <TransactionList transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default DashboardPage;