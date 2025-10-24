import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const { data: medicines, error } = await db
      .from('medicines')
      .select('medicine_id, name, type, dosage, side_effects, instructions')
      .order('name', { ascending: true });

    if (error) throw error;

    // Transform to match expected format
    const formattedMedicines = medicines?.map((med: any) => ({
      Medicine_ID: med.medicine_id,
      Name: med.name,
      Type: med.type,
      Dosage: med.dosage,
      Side_Effects: med.side_effects,
      Instructions: med.instructions
    })) || [];

    return NextResponse.json(formattedMedicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}
