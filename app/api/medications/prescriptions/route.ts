import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET: Fetch prescriptions for a user
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '1'; // Default to user 1
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query = db
      .from('prescriptions')
      .select(`
        prescription_id,
        user_id,
        medicine_id,
        dosage,
        frequency,
        start_date,
        end_date,
        instructions,
        medicines(name, type, side_effects),
        doctors(name, speciality, phone)
      `)
      .eq('user_id', userId);

    if (activeOnly) {
      const today = new Date().toISOString().split('T')[0];
      query = query.or(`end_date.is.null,end_date.gte.${today}`);
    }

    query = query.order('start_date', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Transform the data to match the expected format
    const prescriptions = data?.map((p: any) => ({
      id: p.prescription_id,
      userId: p.user_id,
      medicineId: p.medicine_id,
      medicineName: p.medicines?.name,
      medicineType: p.medicines?.type,
      dosage: p.dosage,
      frequency: p.frequency,
      startDate: p.start_date,
      endDate: p.end_date,
      instructions: p.instructions,
      doctorName: p.doctors?.name,
      doctorSpeciality: p.doctors?.speciality,
      doctorPhone: p.doctors?.phone,
      sideEffects: p.medicines?.side_effects
    })) || [];

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
    const db = getDb();
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

    const { data, error } = await db
      .from('prescriptions')
      .insert([{
        user_id: userId,
        doctor_id: doctorId,
        medicine_id: medicineId,
        dosage,
        frequency,
        start_date: startDate,
        end_date: endDate || null,
        instructions: instructions || null
      }])
      .select('prescription_id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      prescriptionId: data.prescription_id
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
