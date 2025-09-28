# Caregiver Chatbot 🤖👴👵

A Next.js 15 application that provides virtual caregiver services for elderly users with AI-powered conversational support, medication reminders, and appointment management.

## ✨ Features

- 🔐 **Authentication System** - Secure login with route protection
- 📊 **Dashboard** - Manage multiple chatbot configurations
- 💊 **Medication Management** - Schedule and track medications
- 📅 **Appointment Scheduling** - Manage healthcare appointments
- 🤖 **AI-Powered Chat** - Intelligent responses using external APIs
- 🎤 **Voice Input** - Speech-to-text support (webkit browsers)
- 📱 **Responsive Design** - Mobile-friendly interface
- 💾 **Local Storage** - Persistent data without backend

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API (Required for AI responses)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API credentials
CHATBOT_API_URL=https://api.openai.com/v1/chat/completions
CHATBOT_API_KEY=your_openai_api_key_here
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_MAX_TOKENS=150
CHATBOT_TEMPERATURE=0.7
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Application

Visit [http://localhost:3000](http://localhost:3000)

**Demo Login:**

- Email: `demo@example.com`
- Password: `password123`
