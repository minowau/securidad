import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
import { useBehavioral } from '../context/BehavioralContext';
import BehavioralTraitCard from '../components/security/BehavioralTraitCard';
import SecurityEventTimeline from '../components/security/SecurityEventTimeline';
import ConfidenceGauge from '../components/security/ConfidenceGauge';

const SecurityPage: React.FC = () => {
  const { behavioralData, confidenceLevel } = useBehavioral();
  const [activeTab, setActiveTab] = useState('overview');

  const securityEvents = [
    {
      id: '1',
      timestamp: '2025-04-10T09:24:15',
      type: 'login',
      confidenceScore: 0.95,
      riskLevel: 'low',
      description: 'Successful login from recognized device',
      location: {
        city: 'New York',
        country: 'US',
        ip: '192.168.1.1'
      },
      device: {
        type: 'mobile',
        browser: 'Chrome',
        os: 'iOS 18'
      }
    },
    {
      id: '2',
      timestamp: '2025-04-08T15:36:42',
      type: 'transaction',
      confidenceScore: 0.82,
      riskLevel: 'low',
      description: 'Routine transaction pattern detected',
    },
    {
      id: '3',
      timestamp: '2025-04-05T18:12:05',
      type: 'settings_change',
      confidenceScore: 0.91,
      riskLevel: 'low',
      description: 'Profile information updated',
    },
    {
      id: '4',
      timestamp: '2025-04-01T07:45:22',
      type: 'anomaly',
      confidenceScore: 0.65,
      riskLevel: 'medium',
      description: 'Login from new location',
      location: {
        city: 'Boston',
        country: 'US',
        ip: '198.51.100.42'
      }
    }
  ];

  const behavioralTraits = [
    {
      name: 'Typing Dynamics',
      confidenceScore: behavioralData?.typingPattern.length ? Math.min(behavioralData.typingPattern.length / 50, 1) : 0.2,
      dataPoints: behavioralData?.typingPattern.length || 0,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'Touch Gestures',
      confidenceScore: behavioralData?.touchGestures.length ? Math.min(behavioralData.touchGestures.length / 30, 1) : 0.35,
      dataPoints: behavioralData?.touchGestures.length || 0,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'Navigation Behavior',
      confidenceScore: behavioralData?.navigationBehavior.length ? Math.min(behavioralData.navigationBehavior.length / 20, 1) : 0.15,
      dataPoints: behavioralData?.navigationBehavior.length || 0,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'Device Orientation',
      confidenceScore: 0.65,
      dataPoints: 32,
      lastUpdated: new Date().toISOString()
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Security Center</h1>
        <p className="text-gray-600">Monitor your behavioral authentication status</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Overview
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'traits'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('traits')}
            >
              <span className="flex items-center">
                <Fingerprint className="w-4 h-4 mr-2" />
                Behavioral Traits
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'events'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <span className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Security Events
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'privacy'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Privacy Controls
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Authentication Confidence</h3>
                  <div className="flex justify-center">
                    <ConfidenceGauge value={confidenceLevel} />
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        behavioralData?.riskLevel === 'low' 
                          ? 'bg-green-100 text-green-800' 
                          : behavioralData?.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {behavioralData?.riskLevel === 'low' ? 'Low' : behavioralData?.riskLevel === 'medium' ? 'Medium' : 'High'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Updated</span>
                      <span className="text-sm text-gray-800">
                        {behavioralData?.lastUpdated ? new Date(behavioralData.lastUpdated).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Learning Mode</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        confidenceLevel < 100 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {confidenceLevel < 100 ? 'Active' : 'Complete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This is a demo of behavioral authentication. In a real system, your unique patterns would be 
                      used to verify your identity continuously.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traits' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  The system uses multiple behavioral traits to verify your identity continuously.
                  Below are the traits currently being monitored.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {behavioralTraits.map((trait, index) => (
                  <BehavioralTraitCard key={index} trait={trait} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Recent security events and authentication activities
                </p>
              </div>
              <SecurityEventTimeline events={securityEvents} />
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Control how your behavioral data is collected and used
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Data Collection Consent</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Allow the system to collect and analyze your behavioral patterns for authentication purposes.
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <button className="bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                          <span className="ml-3 text-sm text-gray-900">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <Fingerprint className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Trait Collection Settings</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Select which behavioral traits the system can monitor.
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="typing" name="typing" type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="typing" className="font-medium text-gray-700">Typing Dynamics</label>
                            <p className="text-gray-500">Keyboard interaction patterns and timing</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="touch" name="touch" type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="touch" className="font-medium text-gray-700">Touch Gestures</label>
                            <p className="text-gray-500">Screen interaction patterns and pressure</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="navigation" name="navigation" type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="navigation" className="font-medium text-gray-700">Navigation Behavior</label>
                            <p className="text-gray-500">App usage patterns and flows</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="device" name="device" type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="device" className="font-medium text-gray-700">Device Orientation</label>
                            <p className="text-gray-500">How you hold and move your device</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Data Retention</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Control how long your behavioral data is stored.
                      </p>
                      <div className="mt-4">
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>Until account closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;