'use client';

import React from 'react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Thank You for Your Interest!</h1>
        
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-lg text-gray-700 mb-4">
            We've received your information and are excited about your interest in joining our travel sales team!
          </p>
          
          <p className="text-gray-600 mb-6">
            One of our team leaders will contact you soon to discuss this opportunity further and answer any questions you might have.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">What Happens Next?</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>You'll receive a confirmation email with more details about our travel sales opportunity</li>
            <li>A team leader will contact you within 24-48 hours</li>
            <li>We'll schedule a brief orientation call to explain the business model</li>
            <li>You'll get access to our training resources to help you get started</li>
          </ol>
        </div>
        
        <div className="text-center">
          <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200">
            Return to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
