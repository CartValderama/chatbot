import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const { data: users, error } = await db
      .from('users')
      .select('user_id, first_name, last_name, email, phone, birth_date')
      .order('first_name', { ascending: true })
      .order('last_name', { ascending: true });

    if (error) throw error;

    // Transform to match expected format
    const formattedUsers = users?.map((user: any) => ({
      User_ID: user.user_id,
      First_Name: user.first_name,
      Last_Name: user.last_name,
      Email: user.email,
      Phone: user.phone,
      Birth_Date: user.birth_date
    })) || [];

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
