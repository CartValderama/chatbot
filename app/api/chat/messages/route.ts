import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch chat messages for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const messages: any[] = await query(
      `SELECT Message_ID as id, Message_Text as content, Sender_Type as sender,
              datetime(Timestamp, 'localtime') as timestamp, Intent as intent
       FROM Chat_Messages
       WHERE User_ID = ?
       ORDER BY Timestamp ASC`,
      [userId]
    );

    // Convert sender type to lowercase for consistency
    const formattedMessages = messages.map(msg => ({
      id: msg.id.toString(),
      content: msg.content,
      sender: msg.sender === 'User' ? 'user' : 'bot',
      timestamp: msg.timestamp,
      intent: msg.intent
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
