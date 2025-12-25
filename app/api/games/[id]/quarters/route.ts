import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST - Save quarter score
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { quarter, home_score, away_score } = body;

    if (!quarter || home_score === undefined || away_score === undefined) {
      return NextResponse.json(
        { error: 'Quarter, home_score, and away_score are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('quarter_scores')
      .insert({
        game_id: params.id,
        quarter,
        home_score,
        away_score,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (quarter already exists)
      if (error.code === '23505') {
        // Update instead of insert
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('quarter_scores')
          .update({
            home_score,
            away_score,
          })
          .eq('game_id', params.id)
          .eq('quarter', quarter)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json(updateData);
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error saving quarter score:', error);
    return NextResponse.json(
      { error: 'Failed to save quarter score' },
      { status: 500 }
    );
  }
}

// GET - Get all quarter scores for a game
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('quarter_scores')
      .select('*')
      .eq('game_id', params.id)
      .order('quarter', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching quarter scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quarter scores' },
      { status: 500 }
    );
  }
}

