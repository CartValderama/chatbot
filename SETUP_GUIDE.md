# Medication Reminder Chatbot - Setup Guide

## What's New

Your chatbot has been transformed into a **Medication Reminder System** that:
- ✅ Shows today's medication schedule with reminders
- ✅ Displays active prescriptions from the database
- ✅ Sends browser notifications for upcoming medications
- ✅ Allows users to mark medications as taken or missed
- ✅ Provides an AI chatbot to answer medication questions
- ✅ Tracks medication adherence

## Quick Start

### 1. Set Up the Database

#### Install MySQL
If you don't have MySQL installed:
- **Windows**: Download from https://dev.mysql.com/downloads/mysql/
- **Mac**: `brew install mysql && brew services start mysql`
- **Linux**: `sudo apt-get install mysql-server`

#### Create the Database
```bash
# Navigate to the database folder
cd database

# Import the SQL file
mysql -u root -p < healthcare_chatbot.sql
```

This will create:
- 8 tables (Users, Doctors, Medicines, Prescriptions, Reminders, etc.)
- 3 sample users (Anna Hansen, Per Olsen, Kari Larsen)
- Sample medications and reminders

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=healthcare_chatbot
```

### 3. Install Dependencies & Run

```bash
# Install packages
npm install

# Start the development server
npm run dev
```

Visit http://localhost:3000

### 4. Login

Use any email/password combination (login is simplified for demo):
- Suggested: `anna.hansen@email.no` / `password123`

## Features Overview

### Dashboard (http://localhost:3000/dashboard)

**Today's Reminders Section:**
- Shows all medication reminders scheduled for today
- Color-coded status (Pending, Acknowledged, Missed)
- "Taken" and "Skip" buttons to update reminder status
- Auto-refreshes every minute

**Active Prescriptions Section:**
- Lists all current prescriptions with full details
- Shows medicine name, dosage, frequency, doctor info
- Includes prescription start/end dates and instructions

### Notification System

The app includes a floating notification system that:
- Checks for upcoming reminders every minute
- Shows popup alerts for medications due within the next hour
- Sends browser notifications (if permission granted)
- Allows quick "I've Taken It" or "Remind Later" actions

### Chatbot (http://localhost:3000/chatbot)

The medication assistant chatbot can answer questions like:
- "What medications do I take today?"
- "Tell me about my prescriptions"
- "What are the side effects?"
- "I forgot to take my medication, what should I do?"
- "When is my next dose?"

The chatbot has access to your medication database and provides contextual responses.

## Database Structure

### Key Tables

1. **Users** - Elder patient information
2. **Doctors** - Healthcare providers
3. **Login_Credentials** - Authentication (Elder/Doctor types)
4. **Medicines** - Medication catalog
5. **Prescriptions** - Active medication prescriptions
6. **Reminders** - Scheduled medication reminders
7. **Chat_Messages** - Conversation history
8. **Health_Records** - Vital signs tracking (future use)

### Sample Data

**User 1: Anna Hansen**
- Email: anna.hansen@email.no
- Has prescriptions for Lisinopril (blood pressure) and Aspirin
- Today's reminders at 8:00 AM and 12:00 PM

**User 2: Per Olsen**
- Email: per.olsen@email.no
- Has prescription for Metformin (diabetes)
- Reminders at 8:00 AM and 7:00 PM

**User 3: Kari Larsen**
- Email: kari.larsen@email.no
- Has prescription for Atorvastatin (cholesterol)
- Evening reminder

## API Endpoints

The following API routes are available:

### Medications
- `GET /api/medications/reminders?userId=1` - Fetch reminders
- `PATCH /api/medications/reminders` - Update reminder status
- `POST /api/medications/reminders` - Create new reminder
- `GET /api/medications/prescriptions?userId=1` - Fetch prescriptions

### Chat
- `GET /api/chat` - Health check
- `POST /api/chat` - Send message to medication assistant

## How to Add Data

### Add a New Reminder

You can add reminders directly in the database:

```sql
INSERT INTO Reminders (User_ID, Prescription_ID, Reminder_DateTime, Status, Notes)
VALUES (1, 1, '2024-10-25 14:00:00', 'Pending', 'Afternoon dose');
```

Or use the API:

```javascript
await MedicationService.createReminder('1', '1', '2024-10-25 14:00:00', 'Afternoon dose');
```

### Add a New Prescription

```sql
INSERT INTO Prescriptions (User_ID, Doctor_ID, Medicine_ID, Dosage, Frequency, Start_Date, End_Date, Instructions)
VALUES (1, 1, 1, '50mg', 'Once daily', '2024-10-25', '2025-10-25', 'Take with food');
```

## Testing the Notification System

To test notifications:

1. Insert a reminder for 5 minutes from now:
```sql
INSERT INTO Reminders (User_ID, Prescription_ID, Reminder_DateTime, Status)
VALUES (1, 1, DATE_ADD(NOW(), INTERVAL 5 MINUTE), 'Pending');
```

2. Keep the dashboard page open
3. When the reminder time approaches (within 1 hour), you'll see a popup notification
4. Browser notifications will also appear (if you granted permission)

## Troubleshooting

### "Failed to fetch reminders"
- Check that MySQL is running: `mysql -u root -p`
- Verify database credentials in `.env.local`
- Ensure the database was created: `USE healthcare_chatbot; SHOW TABLES;`

### No reminders showing
- Check if there are reminders for today:
```sql
SELECT * FROM Reminders WHERE User_ID = 1 AND DATE(Reminder_DateTime) = CURDATE();
```
- Add a test reminder if needed (see above)

### Chat not working
- Check API status indicator at top of chat
- Verify database connection
- Check browser console for errors

## Next Steps

### Adding Your Own Chatbot API

The current chatbot uses rule-based responses from the database. To integrate OpenAI, Anthropic, or another API:

1. Uncomment and configure in `.env.local`:
```env
CHATBOT_API_URL=https://api.openai.com/v1/chat/completions
CHATBOT_API_KEY=your_key_here
```

2. Update `app/api/chat/route.ts` to call the external API with medication context

### Customization Ideas

- Add medication images/photos
- Implement medication interaction warnings
- Add health vitals tracking
- Create weekly/monthly adherence reports
- Add family/caregiver notifications
- Implement prescription refill reminders

## Files Changed

- `lib/types/types.ts` - Added medication-related types
- `lib/db.ts` - Database connection utility
- `lib/services/medication-service.ts` - Medication API service layer
- `app/api/medications/reminders/route.ts` - Reminders API
- `app/api/medications/prescriptions/route.ts` - Prescriptions API
- `app/api/chat/route.ts` - Medication-aware chatbot
- `components/MedicationDashboard.tsx` - Main dashboard component
- `components/MedicationNotifications.tsx` - Notification system
- `app/dashboard/page.tsx` - Updated to use medication dashboard
- `app/chatbot/page.tsx` - Simplified for medication assistant
- `components/ChatUI.tsx` - Updated for medication context
- `components/LoginForm.tsx` - Updated branding

## Support

For issues or questions:
1. Check the `database/README.md` for database setup help
2. Review the browser console for error messages
3. Verify your `.env.local` configuration
4. Ensure all npm packages are installed
