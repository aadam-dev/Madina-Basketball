import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - List all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    let query = supabaseAdmin.from('events').select('*').order('date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    await requireAuth(); // Ensure user is authenticated

    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      type,
      teams,
      image_url,
      registration_link,
      status = 'upcoming',
      featured = false,
    } = body;

    // Validation
    if (!title || !date || !type) {
      return NextResponse.json(
        { error: 'Title, date, and type are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        description,
        date,
        time,
        location,
        type,
        teams,
        image_url,
        registration_link,
        status,
        featured,
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
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

