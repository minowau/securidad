import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBehavioral } from '../context/BehavioralContext';
import { Lock, Shield, Fingerprint } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyPressTime, setKeyPressTime] = useState<number | null>(null);

  const { login, authStage } = useAuth();
  const { updateTypingPattern } = useBehavioral();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStage === 'behavioral') {
      navigate('/auth/behavioral');
    }
  }, [authStage, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setKeyPressTime(Date.now());
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (keyPressTime) {
      updateTypingPattern(keyPressTime, Date.now());
      setKeyPressTime(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-bold">SecureBank</h1>
          <p className="text-blue-100 mt-2">Behavioral Authentication Demo</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <Lock size={18} />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Fingerprint size={16} className="mr-1" />
              <span>Protected by behavioral authentication</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Demo credentials:</strong> username: "demo" / password: "password"
        </p>
        <p className="text-xs text-gray-500">
          This is a demonstration of behavioral authentication. Your typing patterns and interactions
          are being analyzed as part of the security system.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;