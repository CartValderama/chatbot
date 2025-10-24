import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch medication reminders for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '1'; // Default to user 1 (Anna Hansen)
    const date = searchParams.get('date'); // Optional: filter by specific date

    let sql = `
      SELECT
        r.Reminder_ID as id,
        r.User_ID as userId,
        r.Prescription_ID as prescriptionId,
        r.Reminder_DateTime as reminderDateTime,
        r.Status as status,
        r.Notes as notes,
        m.Name as medicineName,
        p.Dosage as dosage,
        p.Frequency as frequency,
        p.Instructions as instructions
      FROM Reminders r
      JOIN Prescriptions p ON r.Prescription_ID = p.Prescription_ID
      JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
      WHERE r.User_ID = ?
    `;

    const params: any[] = [userId];

    if (date) {
      sql += ' AND DATE(r.Reminder_DateTime) = ?';
      params.push(date);
    } else {
      // Default: get today's and upcoming reminders
      sql += " AND DATE(r.Reminder_DateTime) >= DATE('now')";
    }

    sql += ' ORDER BY r.Reminder_DateTime ASC';

    const reminders = await query(sql, params);

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
    const { userId, prescriptionId, reminderDateTime, notes } = await request.json();

    if (!userId || !prescriptionId || !reminderDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result: any = await query(
      `INSERT INTO Reminders (User_ID, Prescription_ID, Reminder_DateTime, Status, Notes)
       VALUES (?, ?, ?, 'Pending', ?)`,
      [userId, prescriptionId, reminderDateTime, notes || null]
    );

    return NextResponse.json({
      success: true,
      reminderId: result.insertId
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
    const { reminderId, status } = await request.json();

    if (!reminderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE Reminders SET Status = ? WHERE Reminder_ID = ?',
      [status, reminderId]
    );

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
    const { reminderId, reminderDateTime, notes } = await request.json();

    if (!reminderId || !reminderDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE Reminders SET Reminder_DateTime = ?, Notes = ? WHERE Reminder_ID = ?',
      [reminderDateTime, notes || null, reminderId]
    );

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
    const searchParams = request.nextUrl.searchParams;
    const reminderId = searchParams.get('reminderId');

    if (!reminderId) {
      return NextResponse.json(
        { error: 'Reminder ID required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM Reminders WHERE Reminder_ID = ?',
      [reminderId]
    );

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
