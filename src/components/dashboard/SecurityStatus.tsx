import React from 'react';
import { SecurityEvent } from '../../types';
import { Shield, AlertCircle } from 'lucide-react';

interface SecurityStatusProps {
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  securityEvents: SecurityEvent[];
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({ 
  confidenceScore, 
  riskLevel, 
  securityEvents 
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.7) return 'bg-green-500';
    if (score > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Security Status</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View Details
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className={`p-2 rounded-full ${
                riskLevel === 'low' ? 'bg-green-100' : riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Shield className={`h-5 w-5 ${getRiskLevelColor(riskLevel)}`} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Current Risk Level</div>
              <div className={`text-lg font-semibold ${getRiskLevelColor(riskLevel)}`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">Behavioral Confidence</div>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full ${getConfidenceColor(confidenceScore)}`}
                  style={{ width: `${confidenceScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-3 text-lg font-semibold">
              {Math.round(confidenceScore * 100)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Security Events</h3>
        
        {securityEvents.length > 0 ? (
          <div className="space-y-3">
            {securityEvents.slice(0, 2).map(event => (
              <div key={event.id} className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    event.riskLevel === 'low' ? 'bg-green-100' : event.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Shield className={`h-4 w-4 ${getRiskLevelColor(event.riskLevel)}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <AlertCircle className="h-5 w-5 mx-auto mb-2" />
            <p className="text-sm">No recent security events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityStatus;