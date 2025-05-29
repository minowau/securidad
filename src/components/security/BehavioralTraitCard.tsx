import React from 'react';
import { BehavioralTrait } from '../../types';

interface BehavioralTraitCardProps {
  trait: BehavioralTrait;
}

const BehavioralTraitCard: React.FC<BehavioralTraitCardProps> = ({ trait }) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{trait.name}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Confidence</span>
          <span className={`text-sm font-medium ${getConfidenceColor(trait.confidenceScore)}`}>
            {Math.round(trait.confidenceScore * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              trait.confidenceScore >= 0.7 
                ? 'bg-green-500' 
                : trait.confidenceScore >= 0.4 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
            }`}
            style={{ width: `${trait.confidenceScore * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Data points: {trait.dataPoints}</span>
        <span>Updated: {new Date(trait.lastUpdated).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BehavioralTraitCard;