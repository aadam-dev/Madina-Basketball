import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Get single game
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Also fetch game events if they exist
    const { data: events } = await supabaseAdmin
      .from('game_events')
      .select('*')
      .eq('game_id', params.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({ ...data, events: events || [] });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

// PUT - Update game
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const {
      home_team,
      away_team,
      home_score,
      away_score,
      quarter,
      overtime,
      game_mode,
      status,
      game_date,
      location,
      notes,
    } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (home_team !== undefined) updateData.home_team = home_team;
    if (away_team !== undefined) updateData.away_team = away_team;
    if (home_score !== undefined) updateData.home_score = home_score;
    if (away_score !== undefined) updateData.away_score = away_score;
    if (quarter !== undefined) updateData.quarter = quarter;
    if (overtime !== undefined) updateData.overtime = overtime;
    if (game_mode !== undefined) updateData.game_mode = game_mode;
    if (status !== undefined) updateData.status = status;
    if (game_date !== undefined) updateData.game_date = game_date;
    if (location !== undefined) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabaseAdmin
      .from('games')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE - Delete game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(); // Ensure user is authenticated

    // Delete game (CASCADE will delete related game_events)
    const { error } = await supabaseAdmin
      .from('games')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}

