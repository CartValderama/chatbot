import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST: Add a chat message (for automated reminder messages)
export async function POST(request: NextRequest) {
  try {
    const { userId, messageText, senderType, intent } = await request.json();

    if (!userId || !messageText || !senderType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result: any = await query(
      `INSERT INTO Chat_Messages (User_ID, Message_Text, Sender_Type, Intent)
       VALUES (?, ?, ?, ?)`,
      [userId, messageText, senderType, intent || null]
    );

    return NextResponse.json({
      success: true,
      messageId: result.lastInsertRowid || result.insertId,
    });
  } catch (error) {
    console.error('Error adding chat message:', error);
    return NextResponse.json(
      { error: 'Failed to add chat message' },
      { status: 500 }
    );
  }
}
