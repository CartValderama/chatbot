// Medication service for frontend to interact with API
import { MedicationReminder, Prescription } from '@/lib/types/types';

const API_BASE = '/api/medications';

export class MedicationService {
  // Fetch reminders for a user
  static async getReminders(userId: string, date?: string): Promise<MedicationReminder[]> {
    try {
      const params = new URLSearchParams({ userId });
      if (date) params.append('date', date);

      const response = await fetch(`${API_BASE}/reminders?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch reminders');
      }

      return data.reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  }

  // Update reminder status (Acknowledged, Missed, etc.)
  static async updateReminderStatus(reminderId: string, status: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/reminders`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reminderId, status }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update reminder');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  // Create a new reminder
  static async createReminder(
    userId: string,
    prescriptionId: string,
    reminderDateTime: string,
    notes?: string
  ): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, prescriptionId, reminderDateTime, notes }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create reminder');
      }

      return data.reminderId;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  // Fetch prescriptions for a user
  static async getPrescriptions(userId: string, activeOnly: boolean = true): Promise<Prescription[]> {
    try {
      const params = new URLSearchParams({ userId, activeOnly: activeOnly.toString() });

      const response = await fetch(`${API_BASE}/prescriptions?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch prescriptions');
      }

      return data.prescriptions;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  }

  // Check for upcoming reminders (within next hour)
  static async getUpcomingReminders(userId: string): Promise<MedicationReminder[]> {
    try {
      const reminders = await this.getReminders(userId);
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      return reminders.filter((reminder) => {
        const reminderTime = new Date(reminder.reminderDateTime);
        return reminderTime >= now && reminderTime <= oneHourFromNow && reminder.status === 'Pending';
      });
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      throw error;
    }
  }

  // Get today's reminders
  static async getTodayReminders(userId: string): Promise<MedicationReminder[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getReminders(userId, today);
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
      throw error;
    }
  }
}
