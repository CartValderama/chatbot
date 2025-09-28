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

## 🔧 API Configuration

The application supports multiple AI providers:

### OpenAI (Recommended)
```env
CHATBOT_API_URL=https://api.openai.com/v1/chat/completions
CHATBOT_API_KEY=sk-your-openai-key
CHATBOT_MODEL=gpt-3.5-turbo
```

### Anthropic Claude
```env
CHATBOT_API_URL=https://api.anthropic.com/v1/messages
CHATBOT_API_KEY=your-anthropic-key
CHATBOT_MODEL=claude-3-haiku-20240307
```

### Cohere
```env
CHATBOT_API_URL=https://api.cohere.ai/v1/generate
CHATBOT_API_KEY=your-cohere-key
CHATBOT_MODEL=command
```

### Hugging Face
```env
CHATBOT_API_URL=https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium
CHATBOT_API_KEY=your-hf-token
```

## 🏗️ Project Structure

```
chatbot/
├── app/                    # Next.js 15 App Router
│   ├── api/chat/          # Chat API endpoint
│   ├── login/             # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── form/              # Chatbot configuration
│   ├── chatbot/           # Chat interface
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── LoginForm.tsx      # Authentication form
│   ├── DashboardGrid.tsx  # Chatbot grid view
│   ├── CareForm.tsx       # Configuration form
│   └── ChatUI.tsx         # Chat interface
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript definitions
│   ├── auth-context.tsx   # Authentication context
│   ├── store.ts           # Zustand state management
│   └── chatbot-api.ts     # External API integration
└── .env.local             # Environment variables
```

## 🎯 Usage Guide

### 1. Login
- Use demo credentials or any email with 6+ character password
- Authentication persists in localStorage

### 2. Create Chatbot
- Click "New Chatbot" on dashboard
- Enter elderly person's name
- Add medications with times and dosages
- Schedule appointments with dates and locations
- Add any additional notes

### 3. Chat Interface
- Click "Open Chat" on any chatbot card
- Type messages or use voice input (🎤 button)
- AI responds with personalized, context-aware messages
- Bot knows about specific medications and appointments

### 4. Manage Configurations
- Edit existing chatbots from dashboard
- Delete chatbots with confirmation
- View next reminders and medication schedules

## 🧪 API Health Check

Visit `/api/chat` to check your API configuration:
```bash
curl http://localhost:3000/api/chat
```

Response indicates API connectivity status and any configuration issues.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Code linting

### Key Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Web Speech API** - Voice input

## 🔒 Security Notes

- API keys are server-side only (not exposed to client)
- Demo uses mock authentication (replace with real auth in production)
- Data stored locally (consider database for production)

## 📚 Further Development

- Replace mock auth with real authentication system
- Add database for persistent storage
- Implement real-time notifications
- Add medication/appointment reminders
- Enhance voice capabilities
- Add user management for caregivers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with different API providers
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.