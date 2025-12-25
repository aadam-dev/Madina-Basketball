import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Get game events
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('game_events')
      .select('*')
      .eq('game_id', params.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching game events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching game events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game events' },
      { status: 500 }
    );
  }
}

// POST - Create game event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const {
      player_id,
      player_name,
      player_jersey,
      team,
      event_type,
      points = 0,
      quarter,
      game_time,
      details,
    } = body;

    // Validation
    if (!player_name || !team || !event_type || quarter === undefined) {
      return NextResponse.json(
        {
          error: 'player_name, team, event_type, and quarter are required',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('game_events')
      .insert({
        game_id: params.id,
        player_id,
        player_name,
        player_jersey,
        team,
        event_type,
        points,
        quarter,
        game_time,
        details,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating game event:', error);
    return NextResponse.json(
      { error: 'Failed to create game event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete game event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('game_events')
      .delete()
      .eq('id', eventId)
      .eq('game_id', params.id); // Ensure event belongs to this game

    if (error) {
      console.error('Error deleting game event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting game event:', error);
    return NextResponse.json(
      { error: 'Failed to delete game event' },
      { status: 500 }
    );
  }
}

