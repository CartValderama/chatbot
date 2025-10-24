import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user exists in database
    const users: any[] = await query(
      `SELECT u.User_ID, u.First_Name, u.Last_Name, u.Email
       FROM Users u
       JOIN Login_Credentials lc ON u.User_ID = lc.User_ID
       WHERE u.Email = ? AND lc.User_Type = 'Elder' AND lc.Account_Status = 'Active'`,
      [email]
    );

    if (users.length > 0) {
      const user = users[0];
      return NextResponse.json({
        user: {
          id: user.User_ID,
          email: user.Email,
          firstName: user.First_Name,
          lastName: user.Last_Name,
          name: `${user.First_Name} ${user.Last_Name}`,
        },
      });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
