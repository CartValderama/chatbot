'use client';

import { useEffect, useState } from 'react';
import { MedicationService } from '@/lib/services/medication-service';
import { MedicationReminder } from '@/lib/types/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MedicationNotificationsProps {
  userId: string;
}

export default function MedicationNotifications({ userId }: MedicationNotificationsProps) {
  const [upcomingReminders, setUpcomingReminders] = useState<MedicationReminder[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }

    // Check for upcoming reminders every minute
    checkUpcomingReminders();
    const interval = setInterval(checkUpcomingReminders, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  const checkUpcomingReminders = async () => {
    try {
      const reminders = await MedicationService.getUpcomingReminders(userId);

      // Filter out dismissed reminders
      const newReminders = reminders.filter((r) => !dismissedIds.has(r.id));

      // Check for reminders that need to be marked as "Sent"
      for (const reminder of newReminders) {
        const reminderTime = new Date(reminder.reminderDateTime);
        const now = new Date();
        const diffMinutes = Math.floor((reminderTime.getTime() - now.getTime()) / 60000);

        // If reminder time is within 5 minutes or has passed, mark as "Sent"
        if (diffMinutes <= 5 && reminder.status === 'Pending') {
          try {
            await MedicationService.updateReminderStatus(reminder.id, 'Sent');
            // Update the local reminder status
            reminder.status = 'Sent';

            // Send automated chat message
            await sendChatMessage(reminder);
          } catch (error) {
            console.error('Error updating reminder to Sent:', error);
          }
        }
      }

      setUpcomingReminders(newReminders);

      // Send browser notifications for new reminders
      if (notificationPermission === 'granted' && newReminders.length > 0) {
        newReminders.forEach((reminder) => {
          if (!dismissedIds.has(reminder.id)) {
            sendBrowserNotification(reminder);
          }
        });
      }
    } catch (error) {
      console.error('Error checking upcoming reminders:', error);
    }
  };

  const sendChatMessage = async (reminder: MedicationReminder) => {
    try {
      const time = new Date(reminder.reminderDateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const message = `🔔 Medication Reminder:\n\nIt's time to take your ${reminder.medicineName} (${reminder.dosage}).\n\n${
        reminder.instructions ? `Instructions: ${reminder.instructions}\n\n` : ''
      }Please remember to take your medication as prescribed. If you have any questions or concerns, feel free to ask me!`;

      await fetch('/api/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          messageText: message,
          senderType: 'Bot',
          intent: 'medication_reminder',
        }),
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const sendBrowserNotification = (reminder: MedicationReminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const time = new Date(reminder.reminderDateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      new Notification('Medication Reminder', {
        body: `Time to take ${reminder.medicineName} (${reminder.dosage}) at ${time}`,
        icon: '/medication-icon.png',
        tag: reminder.id,
        requireInteraction: true,
      });
    }
  };

  const handleTaken = async (reminderId: string) => {
    try {
      await MedicationService.updateReminderStatus(reminderId, 'Acknowledged');
      setDismissedIds((prev) => new Set(prev).add(reminderId));
      setUpcomingReminders((prev) => prev.filter((r) => r.id !== reminderId));
    } catch (error) {
      console.error('Error acknowledging reminder:', error);
    }
  };

  const handleDismiss = (reminderId: string) => {
    setDismissedIds((prev) => new Set(prev).add(reminderId));
    setUpcomingReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes <= 0) {
      return '🔔 TIME TO TAKE YOUR MEDICATION NOW!';
    } else if (minutes < 60) {
      return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (upcomingReminders.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {upcomingReminders.map((reminder) => (
        <Card
          key={reminder.id}
          className="p-4 bg-blue-50 border-blue-200 shadow-lg animate-in slide-in-from-right"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h4 className="font-semibold text-gray-900">Medication Reminder</h4>
            </div>
            <button
              onClick={() => handleDismiss(reminder.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm font-medium text-gray-900">{reminder.medicineName}</p>
            <p className="text-sm text-gray-600">Dosage: {reminder.dosage}</p>
            <p className="text-sm text-blue-600 font-medium">
              Time: {formatTime(reminder.reminderDateTime)}
            </p>
            {reminder.instructions && (
              <p className="text-xs text-gray-500">{reminder.instructions}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleTaken(reminder.id)}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              I've Taken It
            </Button>
            <Button
              onClick={() => handleDismiss(reminder.id)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Remind Later
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
