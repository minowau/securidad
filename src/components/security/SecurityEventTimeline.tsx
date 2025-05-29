import React from 'react';
import { SecurityEvent } from '../../types';
import { Shield, CreditCard, Settings, AlertTriangle } from 'lucide-react';

interface SecurityEventTimelineProps {
  events: SecurityEvent[];
}

const SecurityEventTimeline: React.FC<SecurityEventTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Shield className="h-5 w-5" />;
      case 'transaction':
        return <CreditCard className="h-5 w-5" />;
      case 'settings_change':
        return <Settings className="h-5 w-5" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };
  
  const getEventColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200\" aria-hidden="true"></span>
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    event.type === 'anomaly' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white">
                      {getEventIcon(event.type)}
                    </span>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-800">{event.description}</p>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {event.location && (
                        <span className="mr-3">
                          {event.location.city}, {event.location.country}
                        </span>
                      )}
                      {event.device && (
                        <span>
                          {event.device.type} • {event.device.browser}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap">
                    <time dateTime={event.timestamp}>{getFormattedDate(event.timestamp)}</time>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getEventColor(event.riskLevel)}`}>
                        {event.riskLevel.charAt(0).toUpperCase() + event.riskLevel.slice(1)} risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SecurityEventTimeline;