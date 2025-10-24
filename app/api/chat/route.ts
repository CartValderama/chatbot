import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Health check endpoint
export async function GET() {
  try {
    // Try to query database to check health
    await query('SELECT 1');
    return NextResponse.json({ status: 'healthy', message: 'Chat API is ready' });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }
}

// POST: Handle chat messages with medication context
export async function POST(request: NextRequest) {
  try {
    const { message, userId = '1' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch user's medication context
    const [prescriptions, reminders, user]: any[] = await Promise.all([
      query(
        `SELECT m.Name, p.Dosage, p.Frequency, p.Instructions
         FROM Prescriptions p
         JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
         WHERE p.User_ID = ? AND (p.End_Date IS NULL OR p.End_Date >= DATE('now'))`,
        [userId]
      ),
      query(
        `SELECT r.Reminder_DateTime, r.Status, m.Name, p.Dosage
         FROM Reminders r
         JOIN Prescriptions p ON r.Prescription_ID = p.Prescription_ID
         JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
         WHERE r.User_ID = ? AND DATE(r.Reminder_DateTime) = DATE('now')
         ORDER BY r.Reminder_DateTime`,
        [userId]
      ),
      query(
        `SELECT First_Name, Last_Name FROM Users WHERE User_ID = ?`,
        [userId]
      ),
    ]);

    const userName = user[0] ? `${user[0].First_Name}` : 'there';

    // Generate contextual response based on message
    const response = generateMedicationResponse(message.toLowerCase(), {
      userName,
      prescriptions,
      reminders,
    });

    // Save message to database
    await Promise.all([
      query(
        `INSERT INTO Chat_Messages (User_ID, Message_Text, Sender_Type, Intent)
         VALUES (?, ?, 'User', ?)`,
        [userId, message, detectIntent(message)]
      ),
      query(
        `INSERT INTO Chat_Messages (User_ID, Message_Text, Sender_Type, Intent)
         VALUES (?, ?, 'Bot', ?)`,
        [userId, response, detectIntent(message)]
      ),
    ]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);

    // Return fallback response even on error
    return NextResponse.json({
      response:
        "I'm having trouble accessing your medication information right now. Please make sure the database is set up correctly, or contact your healthcare provider for assistance.",
      error: 'Database error',
    });
  }
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('side effect') ||
    lowerMessage.includes('reaction') ||
    lowerMessage.includes('feel')
  ) {
    return 'side_effects';
  }

  if (
    lowerMessage.includes('when') ||
    lowerMessage.includes('time') ||
    lowerMessage.includes('schedule')
  ) {
    return 'medication_schedule';
  }

  if (lowerMessage.includes('what') || lowerMessage.includes('tell me about')) {
    return 'medication_info';
  }

  if (lowerMessage.includes('forgot') || lowerMessage.includes('missed')) {
    return 'missed_dose';
  }

  return 'general_query';
}

function generateMedicationResponse(
  message: string,
  context: { userName: string; prescriptions: any[]; reminders: any[] }
): string {
  const { userName, prescriptions, reminders } = context;

  // Greeting
  if (message.includes('hello') || message.includes('hi')) {
    return `Hello ${userName}! I'm here to help you with your medications. You can ask me about your schedule, prescriptions, or any concerns you have.`;
  }

  // Today's schedule
  if (message.includes('today') || message.includes('schedule')) {
    if (reminders.length === 0) {
      return `Hi ${userName}! You have no medication reminders scheduled for today. If you think this is incorrect, please check with your doctor.`;
    }

    let response = `Here are your medication reminders for today:\n\n`;
    reminders.forEach((r: any) => {
      const time = new Date(r.Reminder_DateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const status = r.Status === 'Acknowledged' ? '✓ Taken' : 'Pending';
      response += `• ${time} - ${r.Name} (${r.Dosage}) - ${status}\n`;
    });

    return response;
  }

  // List all medications
  if (message.includes('medication') || message.includes('prescription')) {
    if (prescriptions.length === 0) {
      return `${userName}, you don't have any active prescriptions in the system. Please contact your doctor if you believe this is incorrect.`;
    }

    let response = `Your current medications:\n\n`;
    prescriptions.forEach((p: any) => {
      response += `• ${p.Name} - ${p.Dosage}, ${p.Frequency}\n`;
      if (p.Instructions) {
        response += `  Instructions: ${p.Instructions}\n`;
      }
    });

    return response;
  }

  // Side effects inquiry
  if (message.includes('side effect') || message.includes('feel')) {
    return `${userName}, if you're experiencing side effects from your medication, please note the symptoms and contact your doctor immediately. Common side effects include nausea, dizziness, or drowsiness, but any unusual reactions should be reported. Would you like me to provide information about a specific medication?`;
  }

  // Missed dose
  if (message.includes('forgot') || message.includes('missed')) {
    return `${userName}, if you missed a dose, take it as soon as you remember unless it's almost time for your next dose. Never double up on doses. If you're unsure, please call your doctor or pharmacist for guidance.`;
  }

  // When to take medication
  if (message.includes('when') && message.includes('take')) {
    if (reminders.length > 0) {
      const nextReminder = reminders.find((r: any) => r.Status === 'Pending');
      if (nextReminder) {
        const time = new Date(nextReminder.Reminder_DateTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `Your next medication is ${nextReminder.Name} (${nextReminder.Dosage}) at ${time} today.`;
      }
    }
    return `You can check your full medication schedule on the dashboard. I'll send you reminders when it's time to take your medications.`;
  }

  // Help/How
  if (message.includes('help') || message.includes('how')) {
    return `I can help you with:\n\n• Checking your medication schedule\n• Information about your prescriptions\n• Reminders for when to take medications\n• Guidance on side effects or missed doses\n\nJust ask me anything about your medications!`;
  }

  // Default response
  return `${userName}, I'm here to help with your medications. You can ask me about your schedule, prescriptions, side effects, or anything else medication-related. What would you like to know?`;
}
