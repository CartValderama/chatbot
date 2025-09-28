# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Caregiver Chatbot is a Next.js 15 application that provides virtual caregiver services for elderly users. The app allows caregivers to create and manage chatbot configurations with medication reminders, appointment scheduling, and conversational support.

## Development Commands

- **Development server**: `npm run dev` - Starts the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates an optimized production build
- **Start production**: `npm run start` - Runs the production build
- **Lint**: `npm run lint` - Runs ESLint to check code quality
- **Install dependencies**: `npm install` - Installs all project dependencies

## API Configuration

The chatbot uses external AI APIs for intelligent responses. Configure in `.env.local`:

1. **Copy environment template**: `cp .env.example .env.local`
2. **Set your API credentials**:
   ```env
   CHATBOT_API_URL=https://api.openai.com/v1/chat/completions
   CHATBOT_API_KEY=your_api_key_here
   CHATBOT_MODEL=gpt-3.5-turbo
   CHATBOT_MAX_TOKENS=150
   CHATBOT_TEMPERATURE=0.7
   ```

### Supported APIs
- **OpenAI**: `https://api.openai.com/v1/chat/completions`
- **Anthropic Claude**: `https://api.anthropic.com/v1/messages`
- **Cohere**: `https://api.cohere.ai/v1/generate`
- **Hugging Face**: `https://api-inference.huggingface.co/models/[model-name]`

### API Health Check
Visit `/api/chat` (GET) to check API connectivity status.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand for chatbot data persistence
- **Authentication**: Context-based mock authentication
- **Voice Input**: Web Speech API (webkit)

## Architecture

### App Router Structure
- `app/` - Next.js 15 app directory with file-based routing
- `app/login/` - Authentication page
- `app/dashboard/` - Main dashboard with chatbot grid
- `app/form/` - Chatbot configuration form (create/edit)
- `app/chatbot/` - Chat interface for individual chatbots

### State Management
- **Authentication**: React Context (`lib/auth-context.tsx`) with localStorage persistence
- **Chatbot Data**: Zustand store (`lib/store.ts`) with local persistence
- **Types**: Centralized TypeScript definitions in `lib/types.ts`

### Component Structure
- `components/LoginForm.tsx` - Email/password authentication form
- `components/DashboardGrid.tsx` - Grid view of chatbot configurations
- `components/CareForm.tsx` - Form for creating/editing chatbot settings
- `components/ChatUI.tsx` - Chat interface with message bubbles and voice input

### Key Features
- **Route Protection**: Unauthenticated users redirected to login
- **Responsive Design**: Mobile-first Tailwind CSS implementation
- **Voice Input**: Optional speech-to-text using Web Speech API
- **Real-time Chat**: Simulated bot responses with typing indicators
- **Data Persistence**: LocalStorage for authentication and chatbot data

### Navigation Flow
1. Home (`/`) → Redirects to dashboard (if authenticated) or login
2. Login (`/login`) → Dashboard on successful authentication
3. Dashboard (`/dashboard`) → Form (create/edit) or Chatbot (chat interface)
4. All protected routes check authentication and redirect to login if needed

### Mock Data and Authentication
- Demo credentials: `demo@example.com` / `password123` (minimum 6 characters)
- Chatbot data stored locally using Zustand persistence
- Messages per chatbot stored separately with timestamps

## Development Notes

- Uses Next.js 15 features including typed routes and latest app router patterns
- Tailwind CSS configured with custom color scheme for accessibility
- TypeScript strict mode enabled with path mapping (`@/*`)
- Speech recognition only available in webkit browsers (Chrome, Safari)
- All components are client-side (`'use client'`) due to browser API usage