import React from 'react';

interface ConfidenceGaugeProps {
  value: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value }) => {
  // Normalize value between 0 and 1
  const normalizedValue = Math.min(Math.max(value, 0), 100) / 100;
  
  // Calculate rotation based on value (from -90 to 90 degrees)
  const rotation = -90 + (180 * normalizedValue);
  
  // Determine color based on value
  const getColor = () => {
    if (normalizedValue >= 0.7) return '#10B981'; // green
    if (normalizedValue >= 0.4) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  return (
    <div className="relative w-48 h-48">
      {/* Gauge background */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Gauge value */}
        <path
          d="M 50,50 m 0,-35 a 35,35 0 1 1 0,70 a 35,35 0 1 1 0,-70"
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${normalizedValue * 220}, 220`}
        />
        
        {/* Needle */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="#374151"
          strokeWidth="2"
          transform={`rotate(${rotation}, 50, 50)`}
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="#374151" />
      </svg>
      
      {/* Value text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-gray-800">{Math.round(value)}%</span>
        <span className="text-sm text-gray-500">Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;