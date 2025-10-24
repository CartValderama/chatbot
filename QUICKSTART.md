# Quick Start Guide - SQLite Version

## ✅ Database is Already Set Up!

The SQLite database has been created with sample data. You're ready to go!

## Run the Application

```bash
npm run dev
```

Then open http://localhost:3000

## Login

Use any email and password (minimum 6 characters). For example:
- Email: `anna.hansen@email.no`
- Password: `password123`

## What You'll See

### Dashboard (http://localhost:3000/dashboard)
- **Today's Reminders**: 5 medication reminders for today
- **Active Prescriptions**: 4 active prescriptions with details
- Click "Taken" or "Skip" to update reminder status

### Chatbot (http://localhost:3000/chatbot)
- Click "Ask Chatbot" button on dashboard
- Ask questions like:
  - "What medications do I take today?"
  - "Tell me about my prescriptions"
  - "What are the side effects?"
  - "I forgot my medication, what should I do?"

### Notifications
- Popup notifications will appear for medications due within 1 hour
- Browser will ask for notification permission (recommended to allow)

## Sample Data Included

- **3 Users**: Anna Hansen, Per Olsen, Kari Larsen
- **3 Doctors**: Dr. Sarah Johnson, Dr. Michael Chen, Dr. Emma Wilson
- **5 Medicines**: Aspirin, Metformin, Lisinopril, Atorvastatin, Warfarin
- **4 Prescriptions**: Active prescriptions for the users
- **5 Reminders**: Scheduled for today at different times

## Database Location

Your database file is stored at:
```
database/healthcare_chatbot.db
```

You can view/edit it with any SQLite browser tool, or use the API endpoints.

## Troubleshooting

### If the dashboard shows "Failed to fetch reminders":
1. Check that the database file exists: `database/healthcare_chatbot.db`
2. If not, run: `node database/setup-sqlite.js`
3. Restart the dev server: `npm run dev`

### If chat doesn't show:
1. Make sure you're logged in
2. Navigate to: http://localhost:3000/chatbot
3. Or click "Ask Chatbot" button on the dashboard

### To reset the database:
```bash
node database/setup-sqlite.js
```

This will drop all tables and recreate them with fresh sample data.

## What's Working

✅ Database (SQLite - no installation needed!)
✅ Medication reminders display
✅ Prescription management
✅ Reminder status updates (Taken/Skip)
✅ Medication assistant chatbot
✅ Browser notifications
✅ Chat history saved to database
✅ Auto-refresh every minute

## Next Steps

- Add more reminders for different times
- Test the notification system (wait for a reminder time)
- Chat with the medication assistant
- Mark reminders as taken/missed
- Add your own medications and prescriptions (via API or database)

Enjoy your medication reminder system! 🏥💊
