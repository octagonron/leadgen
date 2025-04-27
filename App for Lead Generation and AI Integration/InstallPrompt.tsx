'use client';

import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show the install prompt after a delay for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', (e) => {
      setIsInstalled(true);
      setShowPrompt(false);
      
      // Log install to analytics
      console.log('PWA was installed');
      
      // Store installation status in localStorage
      localStorage.setItem('pwaInstalled', 'true');
    });

    // Check if previously installed
    if (localStorage.getItem('pwaInstalled') === 'true') {
      setIsInstalled(true);
    }

    // Check if user dismissed the prompt before
    const promptDismissed = localStorage.getItem('installPromptDismissed');
    if (promptDismissed) {
      const dismissedTime = parseInt(promptDismissed, 10);
      const now = Date.now();
      // Only show again after 7 days
      if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        // Store dismissal time
        localStorage.setItem('installPromptDismissed', Date.now().toString());
      }
      
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
      setShowPrompt(false);
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal time
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showPrompt || isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg p-4 z-40 border border-blue-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Install this app</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add to your home screen for quick access to your travel team leads anytime.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleInstallClick}
            >
              Install
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleDismiss}
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 ml-1 h-5 w-5 text-gray-400 hover:text-gray-500"
          onClick={handleDismiss}
        >
          <span className="sr-only">Dismiss</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
