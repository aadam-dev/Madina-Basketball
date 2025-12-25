import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - List all games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const mode = searchParams.get('mode');

    let query = supabaseAdmin
      .from('games')
      .select('*')
      .order('game_date', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (mode) {
      query = query.eq('game_mode', mode);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching games:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST - Create new game
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const {
      home_team,
      away_team,
      home_score = 0,
      away_score = 0,
      quarter = 1,
      overtime = 0,
      game_mode = 'basic',
      status = 'upcoming',
      game_date,
      location = 'Madina Basketball Court',
      notes,
      created_by,
    } = body;

    // Validation
    if (!home_team || !away_team) {
      return NextResponse.json(
        { error: 'Home team and away team are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('games')
      .insert({
        home_team,
        away_team,
        home_score,
        away_score,
        quarter,
        overtime,
        game_mode,
        status,
        game_date: game_date || new Date().toISOString(),
        location,
        notes,
        created_by,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

