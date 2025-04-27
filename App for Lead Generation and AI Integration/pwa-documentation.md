# Lead Generation PWA - Mobile App Documentation

## Overview

This document provides comprehensive information about the Progressive Web App (PWA) version of the Lead Generation application for travel team recruitment. The application has been optimized for mobile devices and includes offline functionality, allowing you to capture and manage leads for your travel package sales team from anywhere.

## What is a PWA?

A Progressive Web App (PWA) combines the best of web and mobile apps. It can be installed on your device like a native app but doesn't require downloading from an app store. PWAs work offline, can send push notifications, and provide an app-like experience while being accessible through a web browser.

## Features

The Lead Generation PWA includes the following features:

1. **Mobile-Optimized Interface**: Responsive design that works well on smartphones and tablets
2. **Offline Functionality**: Capture leads even without an internet connection
3. **Home Screen Installation**: Add the app to your device's home screen for quick access
4. **Background Sync**: Automatically submits forms when you regain internet connection
5. **Offline Data Storage**: Securely stores lead information on your device until it can be synchronized
6. **Responsive Lead Capture Form**: Optimized for touch input on mobile devices
7. **Mobile Navigation**: Easy bottom navigation for accessing all app features

## Installation Instructions

### On iOS (Safari)

1. Open the app in Safari
2. Tap the Share button (rectangle with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Give the app a name (or keep the default)
5. Tap "Add" in the top-right corner
6. The app icon will appear on your home screen

### On Android (Chrome)

1. Open the app in Chrome
2. Tap the menu button (three dots in the top-right)
3. Tap "Add to Home screen"
4. Confirm by tapping "Add"
5. The app icon will appear on your home screen

### On Desktop (Chrome, Edge, or other Chromium browsers)

1. Open the app in your browser
2. Look for the install icon in the address bar (usually a "+" or computer icon)
3. Click the icon and then click "Install"
4. The app will open in its own window and be added to your start menu/dock

## Using the App Offline

The Lead Generation PWA is designed to work even when you don't have an internet connection:

1. **Lead Capture**: You can fill out and submit the lead capture form while offline. The data will be stored on your device.
2. **Automatic Sync**: When you regain internet connection, the app will automatically attempt to sync your offline submissions.
3. **Sync Status**: The app will show you the status of pending submissions and notify you when they've been successfully synced.
4. **Offline Indicator**: When you're offline, the app will display an indicator to let you know.

## App Pages

### Home Page
- Main landing page with lead capture form
- Information about the travel sales opportunity
- Benefits of joining the team

### Dashboard
- Overview of all captured leads
- Filtering and sorting capabilities
- Lead score visualization

### Keywords Management
- View and manage targeting keywords
- Set priority levels for different keywords
- Filter keywords by category

### Settings
- Configure LLM integration
- Test AI responses
- Set qualification criteria

## Offline Mode Limitations

While most features work offline, there are some limitations:

1. **Lead Qualification**: AI-powered lead qualification requires an internet connection
2. **Image Loading**: Some images may not be available offline if they haven't been cached
3. **New Content**: Any new content added to the system won't be available until you're online again

## Troubleshooting

### App Not Installing

- Make sure you're using a supported browser (Chrome, Safari, Edge, etc.)
- Check that you have the latest version of your browser
- Some browsers require you to visit the site multiple times before offering installation

### Offline Submissions Not Syncing

1. Check that you have regained internet connection
2. Go to the home page to trigger a sync attempt
3. If submissions still don't sync, try the "Sync Now" button in the offline manager
4. If problems persist, restart the app

### App Performance Issues

1. Clear your browser cache
2. Make sure your device has sufficient storage space
3. Update your browser to the latest version
4. Reinstall the app if necessary

## Testing PWA Functionality

The app includes a test page to verify that all PWA features are working correctly:

1. Navigate to `/test-pwa` in the app
2. The page will run tests for:
   - Service Worker registration
   - Web App Manifest
   - Installability
   - Offline support
   - IndexedDB access
   - Cache storage
3. Use the "Run Tests Again" button to recheck functionality

## Data Security

- All lead data is stored securely on your device using IndexedDB
- Data is only transmitted when you have an internet connection
- No sensitive information is stored in browser cookies

## Updates

The PWA will automatically update when new versions are available:

1. When you open the app with an internet connection, it checks for updates
2. If an update is available, it will be downloaded in the background
3. The next time you restart the app, the new version will be active

## Support

For additional support or questions about the Lead Generation PWA, please contact the development team.

---

This documentation provides a comprehensive overview of your Lead Generation PWA for travel team recruitment. It covers all aspects of the mobile app from installation to troubleshooting, ensuring you can effectively use it to build your travel package sales team from anywhere, even without a constant internet connection.
