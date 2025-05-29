import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import BehavioralAuthPage from '../pages/BehavioralAuthPage';
import DashboardPage from '../pages/DashboardPage';
import AccountsPage from '../pages/AccountsPage';
import TransactionsPage from '../pages/TransactionsPage';
import SecurityPage from '../pages/SecurityPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { authStage } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          authStage === 'complete' 
            ? <Navigate to="/dashboard\" replace /> 
            : authStage === 'behavioral' 
              ? <Navigate to="/auth/behavioral" replace />
              : <LoginPage />
        } 
      />
      <Route path="/auth/behavioral" element={<BehavioralAuthPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;