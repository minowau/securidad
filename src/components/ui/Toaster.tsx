import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToasterProps {}

export const Toaster: React.FC<ToasterProps> = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Example toast for demonstration
    const demoToast = {
      id: 'demo-toast',
      title: 'Behavioral data collected',
      description: 'Your authentication profile is being updated',
      type: 'info' as const,
    };
    
    const timer = setTimeout(() => {
      setToasts([demoToast]);
      
      // Auto-dismiss after 5 seconds
      const dismissTimer = setTimeout(() => {
        setToasts([]);
      }, 5000);
      
      return () => clearTimeout(dismissTimer);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const removeToast = (id: string) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  const getToastClasses = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full sm:w-auto sm:max-w-sm z-50 pointer-events-none">
      <div className="flex flex-col space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-lg border-l-4 p-4 shadow-md pointer-events-auto transform transition-all duration-500 ease-in-out ${getToastClasses(
              toast.type
            )}`}
          >
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{toast.title}</p>
                    {toast.description && (
                      <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
                  onClick={() => removeToast(toast.id)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toaster;