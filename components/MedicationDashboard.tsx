'use client';

import { useEffect, useState } from 'react';
import { MedicationService } from '@/lib/services/medication-service';
import { MedicationReminder, Prescription } from '@/lib/types/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface MedicationDashboardProps {
  userId: string;
}

export default function MedicationDashboard({ userId }: MedicationDashboardProps) {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Refresh data every minute to check for new reminders
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [remindersData, prescriptionsData] = await Promise.all([
        MedicationService.getTodayReminders(userId),
        MedicationService.getPrescriptions(userId, true),
      ]);
      setReminders(remindersData);
      setPrescriptions(prescriptionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching medication data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (reminderId: string) => {
    try {
      await MedicationService.updateReminderStatus(reminderId, 'Acknowledged');
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error acknowledging reminder:', err);
      alert('Failed to update reminder status');
    }
  };

  const handleMarkMissed = async (reminderId: string) => {
    try {
      await MedicationService.updateReminderStatus(reminderId, 'Missed');
      await fetchData(); // Refresh data
    } catch (err) {
      console.error('Error marking reminder as missed:', err);
      alert('Failed to update reminder status');
    }
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Ongoing';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Acknowledged':
        return 'bg-green-100 text-green-800';
      case 'Missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && reminders.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading medication data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <p className="text-sm text-red-600 mb-4">
          Make sure your database is set up and running. Check database/README.md for setup instructions.
        </p>
        <Button onClick={fetchData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Reminders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Today's Reminders</h3>
          <Link href="/chatbot">
            <Button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              size="lg"
            >
              <span className="text-2xl mr-3">🤖</span>
              Ask Your Assistant
            </Button>
          </Link>
        </div>

        {reminders.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No medication reminders for today
          </Card>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {reminder.medicineName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          reminder.status
                        )}`}
                      >
                        {reminder.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Time:</span> {formatTime(reminder.reminderDateTime)}
                      </p>
                      <p>
                        <span className="font-medium">Dosage:</span> {reminder.dosage}
                      </p>
                      {reminder.instructions && (
                        <p>
                          <span className="font-medium">Instructions:</span> {reminder.instructions}
                        </p>
                      )}
                      {reminder.notes && (
                        <p className="text-gray-500 italic">{reminder.notes}</p>
                      )}
                    </div>
                  </div>

                  {reminder.status === 'Pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleAcknowledge(reminder.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Taken
                      </Button>
                      <Button
                        onClick={() => handleMarkMissed(reminder.id)}
                        size="sm"
                        variant="outline"
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Prescriptions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Prescriptions</h3>

        {prescriptions.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No active prescriptions
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {prescription.medicineName}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Type:</span> {prescription.medicineType || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Dosage:</span> {prescription.dosage}
                  </p>
                  <p>
                    <span className="font-medium">Frequency:</span> {prescription.frequency}
                  </p>
                  <p>
                    <span className="font-medium">Doctor:</span> {prescription.doctorName}
                  </p>
                  <p>
                    <span className="font-medium">Period:</span> {formatDate(prescription.startDate)} -{' '}
                    {formatDate(prescription.endDate)}
                  </p>
                  {prescription.instructions && (
                    <p className="mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium">Instructions:</span> {prescription.instructions}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
