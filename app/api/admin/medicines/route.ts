import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const medicines = await query(
      `SELECT Medicine_ID, Name, Type, Dosage, Side_Effects, Instructions
       FROM Medicines
       ORDER BY Name`
    );

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}
