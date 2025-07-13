# Fall Detection App

## Overview

This is a web-based fall detection application that uses device motion sensors to detect falls and alert users. The app is built with React on the frontend and Express.js on the backend, featuring a modern UI with real-time motion monitoring capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Mobile-First**: Responsive design with mobile device sensor integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Hot reloading with TSX

## Key Components

### Motion Detection System
- **Sensor Integration**: Uses DeviceMotionEvent API to access accelerometer data
- **Permission Management**: Handles iOS 13+ permission requests for motion sensors
- **Fall Detection Algorithm**: Analyzes acceleration patterns to detect sudden impacts
- **Configurable Sensitivity**: Three sensitivity levels (low, medium, high) with adjustable thresholds

### Audio Alert System
- **Web Audio API**: Custom oscillator-based alarm sounds
- **Configurable Volume**: User-adjustable volume controls
- **Vibration Support**: Browser vibration API integration
- **Pattern Generation**: Alternating frequency patterns for urgency

### User Interface
- **Dashboard**: Real-time motion monitoring with start/stop controls
- **Settings Modal**: Sensitivity, volume, and vibration preferences
- **Permission Modals**: User-friendly permission request flows
- **Fall Alert System**: Emergency notification with dismiss options

## Data Flow

1. **Sensor Data Collection**: Device motion sensors provide x, y, z acceleration data
2. **Motion Processing**: Raw sensor data is processed and stored in motion history
3. **Fall Detection**: Algorithm analyzes motion patterns for fall signatures
4. **Alert Triggering**: When fall is detected, audio and visual alerts are activated
5. **User Interaction**: Users can adjust settings and control monitoring state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **wouter**: Lightweight routing library
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public` directory
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **Development**: Uses TSX for hot reloading and Vite dev server
- **Production**: Compiled JavaScript with static file serving
- **Database**: Requires `DATABASE_URL` environment variable

### Scripts
- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build both frontend and backend for production
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes

## Changelog

- July 08, 2025. Initial setup
- July 08, 2025. Added PWA functionality for offline use
- July 08, 2025. Configured service worker for offline caching
- July 08, 2025. Added web app manifest for mobile installation
- July 08, 2025. Created offline setup documentation

## Recent Changes

✓ Added Progressive Web App (PWA) support for offline functionality  
✓ Created service worker for caching app resources  
✓ Configured web app manifest for mobile installation  
✓ Added offline setup documentation  
✓ Updated HTML with mobile-optimized meta tags  
✓ Implemented SMS emergency notification system with 60-second grace period  
✓ Added customizable fall detection threshold slider (10-100 sensitivity)  
✓ Created emergency contact settings in app configuration  
✓ Added countdown timer and SMS status display in fall alert modal  
✓ Implemented backend API endpoint for emergency SMS sending  

## User Preferences

Preferred communication style: Simple, everyday language.