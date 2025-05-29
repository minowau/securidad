import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BehavioralProvider } from './context/BehavioralContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BehavioralProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <AppRoutes />
            <Toaster />
          </div>
        </BehavioralProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;