import React, { createContext, useState, useContext, useEffect } from 'react';

interface BehavioralData {
  typingPattern: number[];
  touchGestures: number[];
  navigationBehavior: number[];
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

interface BehavioralContextType {
  behavioralData: BehavioralData | null;
  isLearning: boolean;
  confidenceLevel: number;
  updateTypingPattern: (keyPressTime: number, keyReleaseTime: number) => void;
  updateTouchGesture: (x: number, y: number, pressure: number, duration: number) => void;
  updateNavigationBehavior: (path: string, duration: number) => void;
  resetLearningMode: () => void;
}

const defaultBehavioralData: BehavioralData = {
  typingPattern: [],
  touchGestures: [],
  navigationBehavior: [],
  confidenceScore: 0,
  riskLevel: 'high',
  lastUpdated: new Date(),
};

const BehavioralContext = createContext<BehavioralContextType>({
  behavioralData: defaultBehavioralData,
  isLearning: true,
  confidenceLevel: 0,
  updateTypingPattern: () => {},
  updateTouchGesture: () => {},
  updateNavigationBehavior: () => {},
  resetLearningMode: () => {},
});

export const useBehavioral = () => useContext(BehavioralContext);

export const BehavioralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [behavioralData, setBehavioralData] = useState<BehavioralData>(defaultBehavioralData);
  const [isLearning, setIsLearning] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState(0);

  // Simulate behavioral learning
  useEffect(() => {
    if (isLearning && interactionCount > 0) {
      const confidence = Math.min(interactionCount / 20, 1) * 100;
      setConfidenceLevel(confidence);
      
      if (interactionCount >= 20) {
        setIsLearning(false);
      }
    }
  }, [interactionCount, isLearning]);

  const updateTypingPattern = (keyPressTime: number, keyReleaseTime: number) => {
    setBehavioralData(prev => ({
      ...prev,
      typingPattern: [...prev.typingPattern, keyReleaseTime - keyPressTime],
      confidenceScore: Math.min((prev.confidenceScore + 0.02), 1),
      lastUpdated: new Date(),
      riskLevel: calculateRiskLevel(prev.confidenceScore + 0.02),
    }));
    setInteractionCount(prev => prev + 1);
  };

  const updateTouchGesture = (x: number, y: number, pressure: number, duration: number) => {
    setBehavioralData(prev => ({
      ...prev,
      touchGestures: [...prev.touchGestures, duration],
      confidenceScore: Math.min((prev.confidenceScore + 0.05), 1),
      lastUpdated: new Date(),
      riskLevel: calculateRiskLevel(prev.confidenceScore + 0.05),
    }));
    setInteractionCount(prev => prev + 1);
  };

  const updateNavigationBehavior = (path: string, duration: number) => {
    setBehavioralData(prev => ({
      ...prev,
      navigationBehavior: [...prev.navigationBehavior, duration],
      confidenceScore: Math.min((prev.confidenceScore + 0.03), 1),
      lastUpdated: new Date(),
      riskLevel: calculateRiskLevel(prev.confidenceScore + 0.03),
    }));
    setInteractionCount(prev => prev + 1);
  };

  const calculateRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score > 0.7) return 'low';
    if (score > 0.4) return 'medium';
    return 'high';
  };

  const resetLearningMode = () => {
    setIsLearning(true);
    setInteractionCount(0);
    setConfidenceLevel(0);
    setBehavioralData(defaultBehavioralData);
  };

  return (
    <BehavioralContext.Provider
      value={{
        behavioralData,
        isLearning,
        confidenceLevel,
        updateTypingPattern,
        updateTouchGesture,
        updateNavigationBehavior,
        resetLearningMode,
      }}
    >
      {children}
    </BehavioralContext.Provider>
  );
};