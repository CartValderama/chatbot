import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const doctors = await query(
      `SELECT Doctor_ID, Name, Speciality, Phone, Email, Hospital
       FROM Doctors
       ORDER BY Name`
    );

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
