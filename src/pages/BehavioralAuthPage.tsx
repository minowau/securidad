import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBehavioral } from '../context/BehavioralContext';
import { Shield, Check, AlertTriangle } from 'lucide-react';

const BehavioralAuthPage: React.FC = () => {
  const [interactionStep, setInteractionStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchPosition, setTouchPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  
  const { setAuthStage, user } = useAuth();
  const { confidenceLevel, updateTouchGesture, isLearning } = useBehavioral();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (confidenceLevel >= 100 && !isLearning) {
      setTimeout(() => {
        setAuthStage('complete');
        navigate('/dashboard');
      }, 1500);
    }
  }, [confidenceLevel, isLearning, setAuthStage, navigate]);

  const getInteractionText = () => {
    const interactions = [
      "Swipe from left to right across the screen",
      "Tap each of the colored circles in order",
      "Draw a pattern connecting the dots",
      "Double tap anywhere on the screen",
      "Press and hold in the center of the screen"
    ];
    return interactions[interactionStep % interactions.length];
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchStart(Date.now());
    
    if ('touches' in e) {
      setTouchPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    } else {
      setTouchPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const duration = Date.now() - touchStart;
    const pressure = Math.random() * 0.5 + 0.5; // Simulated pressure
    
    updateTouchGesture(touchPosition.x, touchPosition.y, pressure, duration);
    setInteractionStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-bold">Behavioral Verification</h1>
          <p className="text-indigo-100 mt-2">Complete the interactions below</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Authentication progress</span>
              <span className="text-sm font-medium text-indigo-600">{Math.round(confidenceLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${confidenceLevel}%` }}
              ></div>
            </div>
          </div>
          
          <div 
            className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6 text-center transition-all"
            onTouchStart={handleTouchStart}
            onMouseDown={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseUp={handleTouchEnd}
          >
            <p className="text-indigo-800 font-medium mb-4">{getInteractionText()}</p>
            
            {interactionStep % 5 === 1 && (
              <div className="flex justify-around my-8">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 ${
                      ['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'][i]
                    }`}
                  ></div>
                ))}
              </div>
            )}
            
            {interactionStep % 5 === 2 && (
              <div className="grid grid-cols-3 gap-8 my-8 mx-auto w-64">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-4 h-4 rounded-full bg-indigo-400 mx-auto"
                  ></div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center">
            {confidenceLevel < 100 ? (
              <div className="flex items-center justify-center text-amber-600">
                <AlertTriangle size={18} className="mr-2" />
                <span>Collecting behavioral data...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-green-600">
                <Check size={18} className="mr-2" />
                <span>Authentication successful!</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md text-xs text-gray-500">
        <p>
          Your unique behavioral patterns are being analyzed to verify your identity.
          This provides an additional layer of security beyond traditional passwords.
        </p>
      </div>
    </div>
  );
};

export default BehavioralAuthPage;