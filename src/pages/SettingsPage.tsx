import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBehavioral } from '../context/BehavioralContext';
import { User, Mail, Key, Bell, Shield, Eye, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { resetLearningMode } = useBehavioral();
  const [activeTab, setActiveTab] = useState('profile');
  const [formState, setFormState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    security: {
      twoFactor: true,
      loginAlerts: true,
      transactionAlerts: true
    },
    privacy: {
      shareData: false,
      locationTracking: false,
      marketingEmails: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleCheckboxChange = (category: string, setting: string) => {
    setFormState({
      ...formState,
      [category]: {
        ...formState[category as keyof typeof formState] as Record<string, boolean>,
        [setting]: !(formState[category as keyof typeof formState] as Record<string, boolean>)[setting]
      }
    });
  };

  const handleResetBehavioralData = () => {
    resetLearningMode();
    // Show success message or notification
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'privacy'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Privacy
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Update your personal information and contact details
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      value={formState.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Manage your password, two-factor authentication, and security preferences
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formState.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formState.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formState.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Behavioral Authentication</h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      The system learns your behavioral patterns to provide continuous authentication.
                      You can reset this data if you're using a new device or experiencing authentication issues.
                    </p>
                    
                    <button
                      type="button"
                      onClick={handleResetBehavioralData}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset Behavioral Data
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="twoFactor"
                          name="twoFactor"
                          type="checkbox"
                          checked={formState.security.twoFactor}
                          onChange={() => handleCheckboxChange('security', 'twoFactor')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="twoFactor" className="font-medium text-gray-700">Two-factor authentication</label>
                        <p className="text-gray-500">Enable additional security layer for logins</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="loginAlerts"
                          name="loginAlerts"
                          type="checkbox"
                          checked={formState.security.loginAlerts}
                          onChange={() => handleCheckboxChange('security', 'loginAlerts')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="loginAlerts" className="font-medium text-gray-700">Login alerts</label>
                        <p className="text-gray-500">Receive notifications for new login attempts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="transactionAlerts"
                          name="transactionAlerts"
                          type="checkbox"
                          checked={formState.security.transactionAlerts}
                          onChange={() => handleCheckboxChange('security', 'transactionAlerts')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="transactionAlerts" className="font-medium text-gray-700">Transaction alerts</label>
                        <p className="text-gray-500">Get notified of large or unusual transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Control how and when you receive notifications from the system
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotif"
                        name="emailNotif"
                        type="checkbox"
                        checked={formState.notifications.email}
                        onChange={() => handleCheckboxChange('notifications', 'email')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotif" className="font-medium text-gray-700">Email notifications</label>
                      <p className="text-gray-500">Receive important alerts via email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="pushNotif"
                        name="pushNotif"
                        type="checkbox"
                        checked={formState.notifications.push}
                        onChange={() => handleCheckboxChange('notifications', 'push')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="pushNotif" className="font-medium text-gray-700">Push notifications</label>
                      <p className="text-gray-500">Receive real-time notifications on your device</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="smsNotif"
                        name="smsNotif"
                        type="checkbox"
                        checked={formState.notifications.sms}
                        onChange={() => handleCheckboxChange('notifications', 'sms')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="smsNotif" className="font-medium text-gray-700">SMS notifications</label>
                      <p className="text-gray-500">Receive text message alerts for critical events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Control how your data is used and shared within the system
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shareData"
                        name="shareData"
                        type="checkbox"
                        checked={formState.privacy.shareData}
                        onChange={() => handleCheckboxChange('privacy', 'shareData')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="shareData" className="font-medium text-gray-700">Data sharing</label>
                      <p className="text-gray-500">Allow anonymous data sharing to improve security systems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="locationTracking"
                        name="locationTracking"
                        type="checkbox"
                        checked={formState.privacy.locationTracking}
                        onChange={() => handleCheckboxChange('privacy', 'locationTracking')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="locationTracking" className="font-medium text-gray-700">Location tracking</label>
                      <p className="text-gray-500">Allow location data to be used for security verification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingEmails"
                        name="marketingEmails"
                        type="checkbox"
                        checked={formState.privacy.marketingEmails}
                        onChange={() => handleCheckboxChange('privacy', 'marketingEmails')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing communications</label>
                      <p className="text-gray-500">Receive promotional offers and updates</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;