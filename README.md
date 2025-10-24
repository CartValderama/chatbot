# Medication Reminder Chatbot 💊

A Next.js application for elderly care that provides medication reminders, virtual caregiver support, and prescription management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 For Group Members

**See [GROUP_SETUP_GUIDE.md](./GROUP_SETUP_GUIDE.md) for complete setup instructions!**

### Quick Login

- Email: `anna.hansen@email.no`
- Password: `password123` (or any 6+ characters)

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom context-based auth
- **Notifications**: Browser Notification API

## 📁 Key Files

- `GROUP_SETUP_GUIDE.md` - Complete setup guide for team members
- `database/SUPABASE_SETUP.md` - Database setup instructions
- `MCP_SETUP_INSTRUCTIONS.md` - Claude Code MCP server setup
- `CLAUDE.md` - Project context for Claude Code

## 🔑 Features

### For Patients
- 📅 Medication schedule dashboard
- 🔔 Automated reminders with notifications
- 💬 Virtual caregiver chatbot
- 📊 Prescription tracking

### For Admins/Doctors
- 👥 User management
- 💊 Prescription creation
- ⏰ Reminder scheduling
- ✏️ Edit/delete reminders

## 🗄️ Database

This project uses Supabase for cloud database storage. All team members share the same database.

**Supabase Dashboard**: https://hmlkzgoufaxszkfgaxth.supabase.co

## 📚 Documentation

- [Group Setup Guide](./GROUP_SETUP_GUIDE.md) - Start here!
- [Supabase Setup](./database/SUPABASE_SETUP.md)
- [MCP Server Setup](./MCP_SETUP_INSTRUCTIONS.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

## 🤝 Contributing

1. Pull the latest changes: `git pull origin main`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add: description"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request on GitHub

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `npx kill-port 3000` |
| Module errors | `rm -rf node_modules && npm install` |
| Cache issues | `rm -rf .next` |
| Can't login | Use any test email + 6+ char password |

## 📱 Test Users

| Name | Email |
|------|-------|
| Anna Hansen | anna.hansen@email.no |
| Per Olsen | per.olsen@email.no |
| Kari Larsen | kari.larsen@email.no |

Password: Any 6+ characters (e.g., `password123`)

## 🔗 Links

- **GitHub**: https://github.com/CartValderama/chatbot
- **Supabase**: https://hmlkzgoufaxszkfgaxth.supabase.co
- **Local**: http://localhost:3000

---

Made with ❤️ using Next.js 15 and Supabase
