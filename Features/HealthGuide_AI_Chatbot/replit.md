# MedBot - Health Assistant Chat Application

## Overview

This is a comprehensive full-stack medical chatbot application built with React/TypeScript frontend and Express.js backend. The application provides AI-powered health consultations, symptom checking, health information library, and doctor finding capabilities through a professional medical interface with proper safety guidelines.

## Recent Changes (January 2025)

- ✓ Switched from OpenAI to Google Gemini AI (free tier) for cost efficiency
- ✓ Created comprehensive Symptom Checker with multi-step assessment flow
- ✓ Built Health Library with detailed medical articles and search functionality
- ✓ Developed Find Doctor page with specialty and insurance filtering
- ✓ Implemented full routing system with navigation between all sections
- ✓ Added active navigation states and connected all quick action buttons
- ✓ Updated Find Doctor with authentic Indian healthcare data:
  - Real doctors from major Indian hospitals (Apollo, Fortis, Manipal, etc.)
  - Authentic Indian locations (Mumbai, Delhi, Chennai, Bangalore, etc.)
  - Indian insurance providers (Star Health, ICICI Lombard, Bajaj Allianz, etc.)
  - Regional language support (Hindi, Tamil, Telugu, Kannada, etc.)
- ✓ All core features now functional and interconnected

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI GPT-4o for health consultations
- **Session Management**: In-memory storage with fallback to persistent storage

## Key Components

### Application Pages
- **Home/Health Chat**: AI-powered conversational interface with Gemini
- **Symptom Checker**: Multi-step interactive health assessment tool
- **Health Library**: Comprehensive medical information with search and categories
- **Find Doctor**: Healthcare provider search with specialty and insurance filters

### Database Schema
- **chat_sessions**: Stores chat session metadata with unique session IDs
- **messages**: Stores individual messages with session association, content, and bot/user flags
- **Schema Management**: Drizzle ORM with automatic migrations

### AI Service Integration
- **Google Gemini 2.5 Pro**: Free AI model for medical consultations
- **Structured Responses**: JSON-formatted responses with urgency levels, recommendations, and care guidance
- **Safety Features**: Built-in medical disclaimers and professional care recommendations
- **Context Awareness**: Maintains chat history for contextual responses

### Chat Interface
- **Real-time Messaging**: Asynchronous message handling with loading states
- **Message Persistence**: All conversations stored in database
- **Session Management**: Unique session IDs for conversation continuity
- **Responsive Design**: Mobile-optimized chat interface

### UI Components
- **Medical Theme**: Custom color palette with medical blue, health green, and professional styling
- **Accessibility**: Built on Radix UI primitives for full accessibility support
- **Component Library**: Comprehensive UI components (buttons, forms, dialogs, etc.)
- **Dark Mode**: Built-in dark mode support with CSS variables

## Data Flow

1. **Session Creation**: Client generates unique session ID using nanoid
2. **Message Handling**: User messages saved to database, then sent to AI service
3. **AI Processing**: Gemini processes message with medical safety guidelines
4. **Response Storage**: AI responses stored in database with structured metadata
5. **Real-time Updates**: TanStack Query manages real-time UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@google/genai**: Official Google Gemini AI client
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Connected to Neon Database via environment variables
- **AI Service**: Gemini API key required for chat functionality

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js deployment
- **Database**: Drizzle migrations applied via `db:push` command
- **Environment**: Requires DATABASE_URL and GEMINI_API_KEY environment variables

### Key Features
- **Medical Safety**: Built-in disclaimers and professional care recommendations
- **Responsive Design**: Mobile-first approach with professional medical styling
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Scalable Architecture**: Modular design supports feature expansion
- **Error Handling**: Comprehensive error handling with user-friendly messages

The application prioritizes medical safety by providing clear disclaimers, recommending professional medical care when appropriate, and maintaining a professional, trustworthy interface design.