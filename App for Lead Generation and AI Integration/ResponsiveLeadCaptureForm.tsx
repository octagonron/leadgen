'use client';

import React, { useState } from 'react';

export default function ResponsiveLeadCaptureForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    currentOccupation: '',
    experienceLevel: 'beginner',
    interests: [] as string[],
    motivationLevel: 3,
    source: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [offlineSubmission, setOfflineSubmission] = useState(false);

  const interestOptions = [
    { value: 'travel_sales', label: 'Selling Travel Packages' },
    { value: 'team_building', label: 'Building a Team' },
    { value: 'remote_work', label: 'Working Remotely' },
    { value: 'side_income', label: 'Creating Side Income' },
    { value: 'financial_freedom', label: 'Achieving Financial Freedom' },
    { value: 'digital_nomad', label: 'Digital Nomad Lifestyle' },
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Just Starting Out' },
    { value: 'some_experience', label: 'Some Experience' },
    { value: 'experienced', label: 'Experienced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, interests: [...prev.interests, value] };
      } else {
        return { ...prev, interests: prev.interests.filter(interest => interest !== value) };
      }
    });
  };

  const storeFormDataOffline = async () => {
    try {
      // Open IndexedDB
      const request = indexedDB.open('LeadFormsDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('pendingForms')) {
          db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['pendingForms'], 'readwrite');
        const store = transaction.objectStore('pendingForms');
        
        // Store the form data
        const addRequest = store.add({
          data: formData,
          timestamp: new Date().toISOString()
        });
        
        addRequest.onsuccess = () => {
          console.log('Form data stored offline');
          setOfflineSubmission(true);
          setSuccess(true);
          
          // Register for background sync if available
          if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
              registration.sync.register('lead-form-submission')
                .then(() => {
                  console.log('Background sync registered');
                })
                .catch(err => {
                  console.error('Background sync registration failed:', err);
                });
            });
          }
        };
        
        addRequest.onerror = () => {
          console.error('Error storing form data offline');
          setError('Failed to store your information offline. Please try again when online.');
        };
      };
      
      request.onerror = () => {
        console.error('Error opening IndexedDB');
        setError('Failed to access offline storage. Please try again when online.');
      };
    } catch (err) {
      console.error('Error in storeFormDataOffline:', err);
      setError('An error occurred while trying to save your information offline.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setOfflineSubmission(false);
    
    // Check if online
    if (!navigator.onLine) {
      // Store form data in IndexedDB for later submission
      await storeFormDataOffline();
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit lead information');
      }
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        currentOccupation: '',
        experienceLevel: 'beginner',
        interests: [],
        motivationLevel: 3,
        source: '',
      });
      
      // Redirect to thank you page after 2 seconds
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
      
    } catch (err) {
      // If fetch fails due to network issues, try to store offline
      if (!navigator.onLine) {
        await storeFormDataOffline();
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-blue-600">Join Our Travel Sales Team</h2>
      <p className="text-gray-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">
        Looking for go-getters who want to build a successful business selling travel packages. 
        Join our team and start your journey to success today!
      </p>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Thank you for your interest! {offlineSubmission ? 'Your information will be submitted when you\'re back online.' : 'We\'ll be in touch soon.'}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {!navigator.onLine && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">You are currently offline. Complete the form and we'll submit it when you're back online.</span>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="City, State/Province"
              />
            </div>
            
            <div>
              <label htmlFor="currentOccupation" className="block text-sm font-medium text-gray-700 mb-1">Current Occupation</label>
              <input
                type="text"
                id="currentOccupation"
                name="currentOccupation"
                value={formData.currentOccupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="What do you currently do?"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">Experience Level in Sales or Travel</label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What are you interested in? (Select all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {interestOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.value}
                    name="interests"
                    value={option.value}
                    checked={formData.interests.includes(option.value)}
                    onChange={handleInterestChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={option.value} className="ml-2 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="motivationLevel" className="block text-sm font-medium text-gray-700 mb-1">
              How motivated are you to start a new opportunity? (1-5)
            </label>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Not very</span>
              <input
                type="range"
                id="motivationLevel"
                name="motivationLevel"
                min="1"
                max="5"
                value={formData.motivationLevel}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500 ml-2">Very</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="Social media, friend, search engine, etc."
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Join Our Team'}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            By submitting this form, you agree to be contacted about travel sales opportunities. 
            We respect your privacy and will never share your information with third parties.
          </p>
        </form>
      )}
    </div>
  );
}
