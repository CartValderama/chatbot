import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const { data: doctors, error } = await db
      .from('doctors')
      .select('doctor_id, name, speciality, phone, email, hospital')
      .order('name', { ascending: true });

    if (error) throw error;

    // Transform to match expected format
    const formattedDoctors = doctors?.map((doc: any) => ({
      Doctor_ID: doc.doctor_id,
      Name: doc.name,
      Speciality: doc.speciality,
      Phone: doc.phone,
      Email: doc.email,
      Hospital: doc.hospital
    })) || [];

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
