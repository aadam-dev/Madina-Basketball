import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - List all team members or filter by section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let query = supabaseAdmin
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const { name, role, description, image_url, section, order_index = 0 } = body;

    // Validation
    if (!name || !role || !section) {
      return NextResponse.json(
        { error: 'Name, role, and section are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .insert({
        name,
        role,
        description,
        image_url,
        section,
        order_index,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

