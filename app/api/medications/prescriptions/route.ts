import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch prescriptions for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '1'; // Default to user 1
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let sql = `
      SELECT
        p.Prescription_ID as id,
        p.User_ID as userId,
        p.Medicine_ID as medicineId,
        m.Name as medicineName,
        m.Type as medicineType,
        p.Dosage as dosage,
        p.Frequency as frequency,
        p.Start_Date as startDate,
        p.End_Date as endDate,
        p.Instructions as instructions,
        d.Name as doctorName,
        d.Speciality as doctorSpeciality,
        d.Phone as doctorPhone,
        m.Side_Effects as sideEffects
      FROM Prescriptions p
      JOIN Medicines m ON p.Medicine_ID = m.Medicine_ID
      JOIN Doctors d ON p.Doctor_ID = d.Doctor_ID
      WHERE p.User_ID = ?
    `;

    const params: any[] = [userId];

    if (activeOnly) {
      sql += " AND (p.End_Date IS NULL OR p.End_Date >= DATE('now'))";
    }

    sql += ' ORDER BY p.Start_Date DESC';

    const prescriptions = await query(sql, params);

    return NextResponse.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions. Make sure database is connected.' },
      { status: 500 }
    );
  }
}

// POST: Create a new prescription
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      doctorId,
      medicineId,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions
    } = await request.json();

    if (!userId || !doctorId || !medicineId || !dosage || !frequency || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result: any = await query(
      `INSERT INTO Prescriptions (User_ID, Doctor_ID, Medicine_ID, Dosage, Frequency, Start_Date, End_Date, Instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, doctorId, medicineId, dosage, frequency, startDate, endDate || null, instructions || null]
    );

    return NextResponse.json({
      success: true,
      prescriptionId: result.insertId
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
