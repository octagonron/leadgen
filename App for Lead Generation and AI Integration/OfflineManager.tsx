'use client';

import React, { useState, useEffect } from 'react';

export default function OfflineManager() {
  const [pendingItems, setPendingItems] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSyncAttempt, setLastSyncAttempt] = useState(null);

  useEffect(() => {
    // Check for pending items on load
    checkPendingItems();

    // Set up listeners for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for sync events from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'sync-status') {
          setSyncStatus(event.data.status);
          if (event.data.status === 'success') {
            checkPendingItems(); // Refresh count after successful sync
            setLastSyncAttempt(new Date().toISOString());
          }
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOnline = () => {
    console.log('Device is online, attempting to sync pending data');
    setSyncStatus('syncing');
    triggerSync();
  };

  const handleOffline = () => {
    console.log('Device is offline');
    setSyncStatus('offline');
  };

  const checkPendingItems = async () => {
    try {
      const db = await openDatabase();
      const count = await countPendingForms(db);
      setPendingItems(count);
    } catch (error) {
      console.error('Error checking pending items:', error);
    }
  };

  const triggerSync = () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('lead-form-submission')
          .then(() => {
            console.log('Background sync registered');
          })
          .catch(err => {
            console.error('Background sync registration failed:', err);
            setSyncStatus('error');
          });
      });
    } else {
      // If background sync is not supported, try manual sync
      manualSync();
    }
  };

  const manualSync = async () => {
    try {
      setSyncStatus('syncing');
      const db = await openDatabase();
      const pendingForms = await getAllPendingForms(db);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const form of pendingForms) {
        try {
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
          });
          
          if (response.ok) {
            await removePendingForm(db, form.id);
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Error syncing form:', error);
          errorCount++;
        }
      }
      
      if (errorCount === 0 && successCount > 0) {
        setSyncStatus('success');
      } else if (errorCount > 0) {
        setSyncStatus('partial');
      }
      
      setLastSyncAttempt(new Date().toISOString());
      checkPendingItems(); // Refresh count
    } catch (error) {
      console.error('Error in manual sync:', error);
      setSyncStatus('error');
    }
  };

  // Database helper functions
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LeadFormsDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pendingForms')) {
          db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  const countPendingForms = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingForms'], 'readonly');
      const store = transaction.objectStore('pendingForms');
      const countRequest = store.count();
      
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = (event) => reject(event.target.error);
    });
  };

  const getAllPendingForms = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingForms'], 'readonly');
      const store = transaction.objectStore('pendingForms');
      const request = store.getAll();
      
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  const removePendingForm = (db, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingForms'], 'readwrite');
      const store = transaction.objectStore('pendingForms');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Only render if there are pending items or we're syncing
  if (pendingItems === 0 && syncStatus !== 'syncing') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-30 md:bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${
            syncStatus === 'syncing' ? 'bg-blue-100' : 
            syncStatus === 'success' ? 'bg-green-100' : 
            syncStatus === 'error' ? 'bg-red-100' : 
            syncStatus === 'partial' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
              syncStatus === 'syncing' ? 'text-blue-600' : 
              syncStatus === 'success' ? 'text-green-600' : 
              syncStatus === 'error' ? 'text-red-600' : 
              syncStatus === 'partial' ? 'text-yellow-600' : 'text-gray-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <p className="font-medium">
              {syncStatus === 'syncing' ? 'Syncing data...' : 
               syncStatus === 'success' ? 'Sync complete' : 
               syncStatus === 'error' ? 'Sync failed' : 
               syncStatus === 'partial' ? 'Partial sync' : 
               `${pendingItems} item${pendingItems !== 1 ? 's' : ''} pending`}
            </p>
            <p className="text-sm text-gray-500">
              {syncStatus === 'syncing' ? 'Uploading your data...' : 
               syncStatus === 'success' ? 'All data synchronized' : 
               syncStatus === 'error' ? 'Could not sync data' : 
               syncStatus === 'partial' ? 'Some items could not be synced' : 
               'Will be uploaded when online'}
            </p>
          </div>
        </div>
        {navigator.onLine && pendingItems > 0 && syncStatus !== 'syncing' && (
          <button 
            onClick={manualSync}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
}
