import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user exists in database
    const { data: users, error } = await db
      .from('users')
      .select(`
        user_id,
        first_name,
        last_name,
        email,
        login_credentials!inner(user_type, account_status)
      `)
      .eq('email', email)
      .eq('login_credentials.user_type', 'Elder')
      .eq('login_credentials.account_status', 'Active');

    if (error) throw error;

    if (users && users.length > 0) {
      const user = users[0];
      return NextResponse.json({
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          name: `${user.first_name} ${user.last_name}`,
        },
      });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
