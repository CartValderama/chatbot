import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET: Fetch chat messages for a user
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: messages, error } = await db
      .from('chat_messages')
      .select('message_id, message_text, sender_type, timestamp, intent')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    // Convert sender type to lowercase for consistency
    const formattedMessages = messages?.map((msg: any) => ({
      id: msg.message_id.toString(),
      content: msg.message_text,
      sender: msg.sender_type === 'User' ? 'user' : 'bot',
      timestamp: msg.timestamp,
      intent: msg.intent
    })) || [];

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
