import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// POST: Add a chat message (for automated reminder messages)
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { userId, messageText, senderType, intent } = await request.json();

    if (!userId || !messageText || !senderType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from('chat_messages')
      .insert([{
        user_id: userId,
        message_text: messageText,
        sender_type: senderType,
        intent: intent || null
      }])
      .select('message_id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      messageId: data.message_id,
    });
  } catch (error) {
    console.error('Error adding chat message:', error);
    return NextResponse.json(
      { error: 'Failed to add chat message' },
      { status: 500 }
    );
  }
}
