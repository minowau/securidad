import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBehavioral } from '../../context/BehavioralContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { updateNavigationBehavior } = useBehavioral();
  const [navigationStartTime, setNavigationStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Track navigation time for behavioral analysis
    if (navigationStartTime) {
      const duration = Date.now() - navigationStartTime;
      updateNavigationBehavior(pathname, duration);
    }
    setNavigationStartTime(Date.now());
  }, [pathname, updateNavigationBehavior, navigationStartTime]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;