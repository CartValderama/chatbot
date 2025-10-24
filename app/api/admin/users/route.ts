import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const users = await query(
      `SELECT User_ID, First_Name, Last_Name, Email, Phone, Birth_Date
       FROM Users
       ORDER BY First_Name, Last_Name`
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
