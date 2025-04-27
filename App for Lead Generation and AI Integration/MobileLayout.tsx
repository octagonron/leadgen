'use client';

import React, { useState, useEffect } from 'react';
import PWAHandler from '@/components/PWAHandler';
import MobileNavigation from '@/components/MobileNavigation';

export default function MobileLayout({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  useEffect(() => {
    // Check online status initially
    setIsOnline(navigator.onLine);
    
    // Add event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Show install banner if not installed and not shown before
    const hasShownInstallBanner = localStorage.getItem('installBannerShown');
    if (!isAppInstalled && !hasShownInstallBanner) {
      // Delay showing the banner for better user experience
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerShown', 'true');
  };
  
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Register service worker */}
      <PWAHandler />
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          You are currently offline. Some features may be limited.
        </div>
      )}
      
      {/* Install banner */}
      {showInstallBanner && (
        <div className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-40 md:bottom-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Install this app</p>
                <p className="text-sm text-gray-500">Add to home screen for quick access</p>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                id="install-button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm mr-2"
              >
                Install
              </button>
              <button 
                onClick={dismissInstallBanner}
                className="text-gray-500 p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className={`${!isOnline ? 'pt-10' : ''}`}>
        {children}
      </main>
      
      {/* Mobile navigation */}
      <MobileNavigation />
    </div>
  );
}
