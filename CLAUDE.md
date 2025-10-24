# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medication Reminder Chatbot is a Next.js 15 application that helps elderly users manage their medication schedules. The app displays medication reminders, tracks prescriptions, sends notifications, and provides an AI chatbot assistant to answer medication-related questions.

## Development Commands

- **Development server**: `npm run dev` - Starts the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates an optimized production build
- **Start production**: `npm run start` - Runs the production build
- **Lint**: `npm run lint` - Runs ESLint to check code quality
- **Install dependencies**: `npm install` - Installs all project dependencies

## Database Configuration

The application uses MySQL to store medication data. Configure in `.env.local`:

1. **Set up MySQL database**: Follow instructions in `database/README.md`
2. **Copy environment template**: `cp .env.example .env.local`
3. **Set your database credentials**:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=healthcare_chatbot
   ```

### Database Setup
Run the SQL file to create tables and sample data:
```bash
mysql -u root -p < database/healthcare_chatbot.sql
```

### API Endpoints
- `GET /api/medications/reminders?userId=1` - Fetch medication reminders
- `GET /api/medications/prescriptions?userId=1` - Fetch prescriptions
- `PATCH /api/medications/reminders` - Update reminder status
- `POST /api/chat` - Medication assistant chatbot

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MySQL with mysql2 driver
- **Styling**: Tailwind CSS
- **State Management**: React Context for authentication, Zustand for messages
- **Authentication**: Context-based mock authentication (simplified for demo)
- **Voice Input**: Web Speech API (webkit)
- **Notifications**: Browser Notification API

## Architecture

### App Router Structure
- `app/` - Next.js 15 app directory with file-based routing
- `app/login/` - Authentication page
- `app/dashboard/` - Medication reminders and prescriptions dashboard
- `app/chatbot/` - Medication assistant chat interface
- `app/api/medications/` - API routes for medication data
- `app/api/chat/` - Chatbot API with medication context

### Database Layer
- **Connection**: `lib/db.ts` - MySQL connection pool with query helper
- **Services**: `lib/services/medication-service.ts` - Frontend service layer
- **Database**: MySQL with 8 tables (Users, Doctors, Medicines, Prescriptions, Reminders, Chat_Messages, Health_Records, Login_Credentials)
- **Types**: `lib/types/types.ts` - TypeScript definitions for medication data

### Component Structure
- `components/LoginForm.tsx` - Simple authentication form
- `components/MedicationDashboard.tsx` - Main dashboard showing reminders and prescriptions
- `components/MedicationNotifications.tsx` - Floating notification system for upcoming reminders
- `components/ChatUI.tsx` - Chat interface with medication context and voice input

### Key Features
- **Medication Reminders**: Display today's medication schedule with status tracking
- **Prescription Management**: View active prescriptions with full details
- **Real-time Notifications**: Browser and popup notifications for upcoming medications
- **Medication Assistant**: AI chatbot with access to medication database
- **Status Tracking**: Mark medications as taken, missed, or acknowledged
- **Voice Input**: Speech-to-text for chatbot interactions
- **Auto-refresh**: Dashboard updates every minute to check for new reminders

### Navigation Flow
1. Home (`/`) → Redirects to dashboard (if authenticated) or login
2. Login (`/login`) → Dashboard on successful authentication
3. Dashboard (`/dashboard`) → Shows medication reminders and prescriptions
4. Chatbot (`/chatbot`) → Medication assistant chat interface
5. All protected routes check authentication and redirect to login if needed

### Sample Data and Authentication
- Demo login: Any email/password works (simplified for demo)
- Sample users in database: anna.hansen@email.no, per.olsen@email.no, kari.larsen@email.no
- Default user ID: 1 (Anna Hansen)
- Sample medications include Lisinopril, Aspirin, Metformin, Atorvastatin
- Chat messages stored in database with intent tracking

## Development Notes

- Uses Next.js 15 features including typed routes and latest app router patterns
- Tailwind CSS configured with custom color scheme for accessibility
- TypeScript strict mode enabled with path mapping (`@/*`)
- Speech recognition only available in webkit browsers (Chrome, Safari)
- Most components are client-side (`'use client'`) due to browser API usage
- Database queries use prepared statements for security
- Notifications require browser permission (requested automatically)
- Auto-refresh intervals set to 60 seconds to balance performance and real-time updates

## Important Setup Steps

Before running the application:
1. Install and configure MySQL (see `database/README.md`)
2. Run the SQL file to create database: `mysql -u root -p < database/healthcare_chatbot.sql`
3. Copy `.env.example` to `.env.local` and configure database credentials
4. Install dependencies: `npm install`
5. Start dev server: `npm run dev`

For complete setup instructions, see `SETUP_GUIDE.md`