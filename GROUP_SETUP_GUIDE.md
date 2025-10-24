# Group Setup Guide - Medication Reminder Chatbot

This guide will help your group mates set up and run the medication reminder application on their own computers.

## Prerequisites

Before starting, make sure you have:
- **Node.js** (v18 or higher) - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/
- **A code editor** - VS Code recommended (https://code.visualstudio.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/CartValderama/chatbot.git
cd chatbot
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Supabase client

## Step 3: Set Up Environment Variables

Create a file called `.env.local` in the root directory:

```bash
# Windows PowerShell
New-Item .env.local

# Mac/Linux or Git Bash
touch .env.local
```

Add the following content to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hmlkzgoufaxszkfgaxth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbGt6Z291ZmF4c3prZmdheHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTA2ODIsImV4cCI6MjA3Njg4NjY4Mn0._Tvn2AV214I1HahY4134Z6hEcgZySw4p1MyOwfWUqD8
```

**Important:** This file should already exist in the repository, but if it doesn't, create it with the content above.

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will start on http://localhost:3000

## Step 5: Access the Application

Open your browser and go to: **http://localhost:3000**

You'll be redirected to the login page.

### Test Users

You can log in with any of these test accounts:

| Name | Email | Password |
|------|-------|----------|
| Anna Hansen | anna.hansen@email.no | password123 (or any 6+ char password) |
| Per Olsen | per.olsen@email.no | password123 (or any 6+ char password) |
| Kari Larsen | kari.larsen@email.no | password123 (or any 6+ char password) |

**Note:** The password field requires at least 6 characters, but the actual password doesn't matter for testing - authentication is simplified for development.

## Application Features

### For Patients (Elders)
- **Dashboard**: View medication schedule and reminders
- **Chat**: Talk with the virtual caregiver assistant
- **Notifications**: Receive popup and browser notifications for medication times

### For Doctors/Admins
- **Admin Panel**: Access at `/admin`
  - Add new prescriptions for patients
  - Schedule medication reminders
  - Manage existing reminders (edit/delete)
  - View all users, medicines, and doctors

## Database Information

The application uses **Supabase** (cloud PostgreSQL database). All data is stored in the cloud and shared across all team members.

### Accessing the Database

1. Go to: https://hmlkzgoufaxszkfgaxth.supabase.co
2. Log in with the team Supabase account
3. Navigate to "SQL Editor" or "Table Editor" to view/modify data

### Database Tables

- **users**: Patient information
- **doctors**: Doctor information
- **medicines**: Available medications
- **prescriptions**: Active prescriptions for patients
- **reminders**: Scheduled medication reminders
- **chat_messages**: Chat history
- **login_credentials**: User authentication
- **health_records**: Patient health data

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check code quality
npm run lint
```

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is in use":

**Windows:**
```bash
npx kill-port 3000
npm run dev
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Errors

1. Check your `.env.local` file exists and has the correct Supabase credentials
2. Make sure you're connected to the internet
3. Verify the Supabase project is accessible at https://hmlkzgoufaxszkfgaxth.supabase.co

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Project Structure

```
chatbot/
├── app/                      # Next.js 15 app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── medications/     # Medication & reminder endpoints
│   │   ├── admin/           # Admin endpoints
│   │   └── chat/            # Chat endpoints
│   ├── admin/               # Admin panel page
│   ├── chatbot/             # Chat interface page
│   ├── dashboard/           # Main dashboard page
│   └── login/               # Login page
├── components/              # React components
│   ├── Header.tsx
│   ├── LoginForm.tsx
│   ├── MedicationDashboard.tsx
│   ├── MedicationNotifications.tsx
│   └── ChatUI.tsx
├── lib/                     # Utility functions
│   ├── db.ts               # Supabase database connection
│   ├── auth-context.tsx    # Authentication context
│   └── types/              # TypeScript type definitions
├── database/               # Database scripts
│   ├── supabase-schema.sql      # Database schema
│   └── SUPABASE_SETUP.md        # Database setup guide
└── public/                 # Static assets
```

## Working as a Team

### Best Practices

1. **Pull before you start working:**
   ```bash
   git pull origin main
   ```

2. **Create a new branch for features:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit regularly with clear messages:**
   ```bash
   git add .
   git commit -m "Add: description of what you added"
   git push origin feature/your-feature-name
   ```

4. **Use Pull Requests:**
   - Push your branch to GitHub
   - Create a Pull Request for review
   - Wait for approval before merging

### Shared Database

Since everyone uses the same Supabase database:
- ✅ **DO**: Test with the existing test users (Anna, Per, Kari)
- ✅ **DO**: Add new test data if needed
- ❌ **DON'T**: Delete important data without asking the team
- ❌ **DON'T**: Modify the database schema without team discussion

### Git Ignore

The following files/folders are already ignored in `.gitignore`:
- `node_modules/` - Dependencies (too large)
- `.env.local` - Environment variables (already in repo for team use)
- `.next/` - Build cache
- `database/*.db` - Local SQLite files (not used anymore)

## Setting Up Claude Code MCP (Optional)

If you use **Claude Code** (claude.ai/code), you can set up direct database access through MCP (Model Context Protocol). This allows Claude to query the Supabase database directly.

### What is MCP?

MCP allows Claude Code to interact with external tools and services like databases. With this setup, you can ask Claude to query the database, view tables, and analyze data directly.

### Setup Steps

1. **Get the database password** from your team (sent separately via secure channel)

2. **Create the MCP config file** on your local machine:

   **Windows:**
   ```powershell
   # Create the .claude directory if it doesn't exist
   if (-not (Test-Path "$env:USERPROFILE\.claude")) {
       New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude"
   }

   # Create the config file
   notepad "$env:USERPROFILE\.claude\config.json"
   ```

   **Mac/Linux:**
   ```bash
   # Create the .claude directory if it doesn't exist
   mkdir -p ~/.claude

   # Create the config file
   nano ~/.claude/config.json
   ```

3. **Add this configuration** (replace `[YOUR-DB-PASSWORD]` with the actual password):

   ```json
   {
     "mcpServers": {
       "supabase-postgres": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-postgres",
           "postgresql://postgres.hmlkzgoufaxszkfgaxth:[YOUR-DB-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
         ]
       }
     }
   }
   ```

4. **Restart Claude Code** to load the MCP server

5. **Verify it works**: Start a new conversation in Claude Code and you should see `mcp__` tools available

### Important Notes

- ⚠️ **Never commit the database password to git**
- The `mcp-config.json` file in the project repo is just a template
- Each team member needs to set this up on their own machine
- The config file location is:
  - Windows: `%USERPROFILE%\.claude\config.json`
  - Mac/Linux: `~/.claude/config.json`

### Troubleshooting MCP

- **MCP not showing up**: Make sure you've restarted Claude Code after creating the config
- **Connection errors**: Verify the password is correct and you have internet access
- **npx errors**: Make sure Node.js is installed (`node --version`)

## Need Help?

- **Project Issues**: Check the GitHub Issues page
- **Supabase Dashboard**: https://hmlkzgoufaxszkfgaxth.supabase.co
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code

## Testing the Application

### Manual Testing Checklist

- [ ] Login with test user
- [ ] View dashboard with medication reminders
- [ ] Check if notifications appear
- [ ] Navigate to admin panel
- [ ] Add a new prescription
- [ ] Schedule a reminder
- [ ] Edit an existing reminder
- [ ] Delete a reminder
- [ ] Test chat interface
- [ ] Switch between different users
- [ ] Verify data persists after refresh

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Can't log in | Use any of the test emails and any 6+ character password |
| Dashboard is empty | Check database in Supabase - make sure reminders exist |
| Notifications don't show | Allow browser notifications when prompted |
| Changes don't appear | Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) |
| TypeScript errors | Run `npm run lint` to check for issues |

---

**Good luck with your project! 🚀**
