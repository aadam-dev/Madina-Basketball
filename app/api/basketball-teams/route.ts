import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - List all active basketball teams
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('basketball_teams')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching basketball teams:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching basketball teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch basketball teams' },
      { status: 500 }
    );
  }
}

