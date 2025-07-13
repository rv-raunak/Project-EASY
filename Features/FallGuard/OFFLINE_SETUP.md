# Running Fall Detection App Offline

## Method 1: Progressive Web App (PWA) - Recommended

The app is now configured as a PWA which enables offline functionality:

1. **Open the app on your mobile device**
2. **Install as PWA:**
   - **iOS Safari:** Tap the share button → "Add to Home Screen"
   - **Android Chrome:** Tap the three dots menu → "Add to Home Screen"
3. **The app will now work offline** after the initial load

## Method 2: Local Development Server

If you want to run it completely offline during development:

1. **Download the project files** to your computer
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Access on your phone:**
   - Connect your phone to the same WiFi network
   - Find your computer's IP address (usually `192.168.x.x`)
   - Open `http://[your-ip]:5000` on your phone

## Method 3: Static Build

To create a fully offline version:

1. **Build the app:**
   ```bash
   npm run build
   ```
2. **Serve the built files:**
   ```bash
   npx serve dist
   ```
3. **Access on your phone using your local IP address**

## Features That Work Offline

✅ **Motion sensor detection** - Uses device APIs  
✅ **Fall detection algorithm** - Runs locally  
✅ **Audio alarm system** - Uses Web Audio API  
✅ **Settings and preferences** - Stored locally  
✅ **All UI components** - No network required  

## Requirements

- **HTTPS or localhost** - Motion sensors require secure context
- **Modern mobile browser** - Chrome, Safari, Firefox
- **Device motion permission** - Granted by user
- **JavaScript enabled** - Required for sensor access

## Tips for Best Offline Experience

1. **Load the app once while online** to cache resources
2. **Grant motion permissions** before going offline
3. **Add to home screen** for app-like experience
4. **Keep the browser tab active** for continuous monitoring