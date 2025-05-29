export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  accounts: Account[];
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  accountId: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login' | 'transaction' | 'settings_change' | 'anomaly';
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  location?: {
    city: string;
    country: string;
    ip: string;
  };
  device?: {
    type: string;
    browser: string;
    os: string;
  };
}

export interface BehavioralTrait {
  name: string;
  confidenceScore: number;
  dataPoints: number;
  lastUpdated: string;
}