import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET: Fetch medication reminders for a user
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '1'; // Default to user 1 (Anna Hansen)
    const date = searchParams.get('date'); // Optional: filter by specific date

    let query = db
      .from('reminders')
      .select(`
        reminder_id,
        user_id,
        prescription_id,
        reminder_datetime,
        status,
        notes,
        prescriptions(
          dosage,
          frequency,
          instructions,
          medicines(name)
        )
      `)
      .eq('user_id', userId);

    if (date) {
      // Filter by specific date
      query = query.gte('reminder_datetime', `${date}T00:00:00`).lte('reminder_datetime', `${date}T23:59:59`);
    } else {
      // Default: get today's and upcoming reminders
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('reminder_datetime', `${today}T00:00:00`);
    }

    query = query.order('reminder_datetime', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    // Transform the data to match the expected format
    const reminders = data?.map((r: any) => ({
      id: r.reminder_id,
      userId: r.user_id,
      prescriptionId: r.prescription_id,
      reminderDateTime: r.reminder_datetime,
      status: r.status,
      notes: r.notes,
      medicineName: r.prescriptions?.medicines?.name,
      dosage: r.prescriptions?.dosage,
      frequency: r.prescriptions?.frequency,
      instructions: r.prescriptions?.instructions
    })) || [];

    return NextResponse.json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders. Make sure database is connected.' },
      { status: 500 }
    );
  }
}

// POST: Create a new reminder
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { userId, prescriptionId, reminderDateTime, notes } = await request.json();

    if (!userId || !prescriptionId || !reminderDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from('reminders')
      .insert([{
        user_id: userId,
        prescription_id: prescriptionId,
        reminder_datetime: reminderDateTime,
        status: 'Pending',
        notes: notes || null
      }])
      .select('reminder_id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reminderId: data.reminder_id
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}

// PATCH: Update reminder status
export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const { reminderId, status } = await request.json();

    if (!reminderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await db
      .from('reminders')
      .update({ status })
      .eq('reminder_id', reminderId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Reminder status updated'
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// PUT: Update reminder details
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const { reminderId, reminderDateTime, notes } = await request.json();

    if (!reminderId || !reminderDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await db
      .from('reminders')
      .update({
        reminder_datetime: reminderDateTime,
        notes: notes || null
      })
      .eq('reminder_id', reminderId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Reminder updated'
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a reminder
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const reminderId = searchParams.get('reminderId');

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID required' },
        { status: 400 }
      );
    }

    const { error } = await db
      .from('reminders')
      .delete()
      .eq('reminder_id', reminderId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted'
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}
